/**
 * Pre-render landing pages for faster cold loads
 * 
 * This script runs after `vite build` to generate static HTML for landing pages.
 * The pre-rendered HTML provides instant content for visitors from ads,
 * then React hydrates to make the page interactive.
 * 
 * Usage: node scripts/prerender.js
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

// Routes to pre-render (landing pages only)
const ROUTES = [
  '/en',
  '/he',
  // Add more routes as needed:
  // '/en/for-owners',
  // '/he/for-owners',
];

// Find an available port (start from 4173, increment if in use)
let PORT = 4173;

/**
 * Create a simple static file server
 */
function createStaticServer() {
  return createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
    
    // SPA fallback - serve index.html for routes
    if (!existsSync(filePath) || !filePath.includes('.')) {
      filePath = join(DIST_DIR, 'index.html');
    }
    
    try {
      const content = readFileSync(filePath);
      const ext = filePath.split('.').pop();
      const contentTypes = {
        html: 'text/html',
        js: 'application/javascript',
        css: 'text/css',
        json: 'application/json',
        png: 'image/png',
        jpg: 'image/jpeg',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        woff2: 'font/woff2',
      };
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

/**
 * Pre-render a single route
 */
async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  
  // Block unnecessary resources to speed up rendering
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    // Block analytics, tracking, and external fonts during prerender
    if (['media', 'websocket'].includes(resourceType)) {
      req.abort();
    } else if (req.url().includes('googletagmanager') || 
               req.url().includes('facebook') ||
               req.url().includes('clarity') ||
               req.url().includes('brevo') ||
               req.url().includes('sentry')) {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  const url = `http://localhost:${PORT}${route}`;
  console.log(`  Rendering: ${route}`);
  
  try {
    // Start CSS coverage to find critical CSS
    await page.coverage.startCSSCoverage();
    
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait a bit for React to finish rendering
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get critical CSS (above-the-fold styles)
    const cssCoverage = await page.coverage.stopCSSCoverage();
    let criticalCSS = '';
    
    for (const entry of cssCoverage) {
      // Only include first-party CSS (from our domain or assets)
      if (entry.url.includes('localhost') || entry.url.includes('/assets/')) {
        for (const range of entry.ranges) {
          criticalCSS += entry.text.substring(range.start, range.end);
        }
      }
    }
    
    // Minify critical CSS (basic - remove extra whitespace)
    criticalCSS = criticalCSS
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ')              // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around symbols
      .trim();
    
    console.log(`  Critical CSS: ${(criticalCSS.length / 1024).toFixed(1)}KB`);
    
    // Get the rendered HTML
    let html = await page.content();
    
    // Add preconnect hints at the TOP of head (must be early for effect)
    const earlyHints = `
<link rel="preconnect" href="https://api.studioz.co.il" crossorigin>
<link rel="preconnect" href="https://player.mediadelivery.net" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;
    
    // Insert preconnects right after <head> tag (before any other resources)
    html = html.replace(/<head([^>]*)>/, `<head$1>${earlyHints}`);
    
    // Add critical CSS and preload at end of head
    const criticalStyleTag = criticalCSS.length > 0 
      ? `<style id="critical-css">${criticalCSS}</style>\n` 
      : '';
    
    const preloadHints = `<link rel="preload" as="image" href="/images/optimized/Landing-Studio1320-1.webp" type="image/webp" fetchpriority="high">`;
    
    html = html.replace(
      '</head>',
      `${preloadHints}\n${criticalStyleTag}<meta name="prerender-status" content="prerendered" data-prerender-time="${new Date().toISOString()}">\n</head>`
    );
    
    // Defer main app CSS for faster FCP, keep page-specific CSS
    // Inline styles on key elements prevent bad FOUC appearance
    const cssLinks = [];
    html = html.replace(
      /<link\s+rel="stylesheet"([^>]*)\s+href="([^"]+)"([^>]*)>/g,
      (match, before, href, after) => {
        // Skip if already has media="print" (already deferred)
        if (match.includes('media="print"')) return match;
        
        // Keep page-specific CSS render-blocking (critical for landing page)
        if (href.includes('ForOwnersPage') || href.includes('forOwners')) {
          return match;
        }
        
        // Defer main app CSS and Google Fonts
        if (href.includes('/assets/index') || href.includes('fonts.googleapis.com')) {
          cssLinks.push(href);
          return `<link rel="stylesheet"${before} href="${href}"${after} media="print" onload="this.media='all'">`;
        }
        
        // Keep other CSS render-blocking by default
        return match;
      }
    );
    
    // Add noscript fallback for deferred CSS (fonts only)
    if (cssLinks.length > 0) {
      const noscriptCSS = cssLinks.map(href => 
        `<link rel="stylesheet" href="${href}">`
      ).join('\n');
      html = html.replace('</head>', `<noscript>${noscriptCSS}</noscript>\n</head>`);
    }
    
    // Create output directory
    const outputDir = join(DIST_DIR, route);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the HTML file
    const outputPath = join(outputDir, 'index.html');
    writeFileSync(outputPath, html);
    console.log(`  ✓ Saved: ${outputPath.replace(DIST_DIR, 'dist')}`);
    
  } catch (err) {
    console.error(`  ✗ Failed: ${route}`, err.message);
  } finally {
    await page.close();
  }
}

/**
 * Main prerender function
 */
async function prerender() {
  console.log('\n🚀 Pre-rendering landing pages for faster cold loads...\n');
  
  // Check if dist exists
  if (!existsSync(DIST_DIR)) {
    console.error('❌ Error: dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }
  
  // Start static server (try multiple ports if needed)
  const server = createStaticServer();
  let serverStarted = false;
  
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(PORT + attempt, () => {
          server.removeListener('error', reject);
          PORT = PORT + attempt;
          resolve();
        });
      });
      serverStarted = true;
      break;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.log(`  Port ${PORT + attempt} in use, trying ${PORT + attempt + 1}...`);
      } else {
        throw err;
      }
    }
  }
  
  if (!serverStarted) {
    throw new Error('Could not find an available port for the static server');
  }
  
  console.log(`📦 Static server running on http://localhost:${PORT}\n`);
  
  // Launch Puppeteer (use system Chrome if available via PUPPETEER_EXECUTABLE_PATH)
  const launchOptions = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  };
  
  // Use system Chromium on CI/Render if PUPPETEER_EXECUTABLE_PATH is set
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    console.log(`  Using system Chrome: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
  }
  
  const browser = await puppeteer.launch(launchOptions);
  
  try {
    // Pre-render each route
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }
    
    console.log('\n✅ Pre-rendering complete!\n');
    console.log('📊 Pre-rendered pages will load instantly for cold visitors.');
    console.log('   React will hydrate to make them interactive.\n');
    
  } finally {
    await browser.close();
    server.close();
  }
}

// Run - gracefully handle failures (don't break build)
prerender().catch((err) => {
  console.error('\n⚠️  Pre-rendering skipped due to error:', err.message);
  console.log('   The build succeeded. Pre-rendering can be retried separately.\n');
  console.log('   For CI environments, ensure Puppeteer dependencies are installed:');
  console.log('   - On Ubuntu/Debian: apt-get install chromium');
  console.log('   - Set PUPPETEER_SKIP_DOWNLOAD=true and use system Chrome\n');
  // Exit with 0 to not fail the build
  process.exit(0);
});
