/**
 * Sitemap Generator Script
 *
 * This script generates a sitemap.xml that includes:
 * - Static pages (landing, studios list, privacy, terms, etc.)
 * - Category and city filter pages
 * - Individual studio detail pages (fetched from API)
 *
 * Run this script after building: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOSTNAME = 'https://studioz.co.il';
const API_URL = 'https://api.studioz.co.il/api';
const LANGUAGES = ['en', 'he'];

// Static routes (publicly accessible pages)
const BASE_ROUTES = [
  '/',
  '/discover',
  '/studios',
  '/for-owners',
  '/subscription',
  '/how-it-works',
  '/privacy',
  '/terms'
];

// Subcategories for filter pages
const MUSIC_SUBCATEGORIES = [
  'Music Production',
  'Podcast Recording',
  'Vocal & Instrument Recording',
  'Film & Post Production',
  'Voiceover & Dubbing',
  'Mixing',
  'Mastering',
  'Sound Design',
  'Band rehearsal',
  'Studio Rental',
  'Foley & Sound Effects',
  'Workshops & Classes',
  'Remote Production Services',
  'Restoration & Archiving'
];

// Cities
const CITIES = [
  'Tel Aviv-Yafo',
  'Jerusalem',
  'Haifa',
  'Rishon LeTsiyon',
  'Herzliya',
  'Ramat Gan',
  'Ashdod',
  'Beit Dagan',
  'Holon',
  'Ashkelon',
  'Eilat'
];

/**
 * Fetch all active/published studios from the API
 */
async function fetchStudios() {
  try {
    console.log('📡 Fetching studios from API...');
    const response = await fetch(`${API_URL}/studios`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const studios = await response.json();
    
    // Filter to only include active/published studios
    const activeStudios = studios.filter(studio => 
      studio.isActive !== false && studio.isPublished !== false
    );
    
    console.log(`✅ Fetched ${studios.length} studios (${activeStudios.length} active)`);
    return activeStudios;
  } catch (error) {
    console.error('❌ Error fetching studios:', error.message);
    console.log('⚠️  Continuing with static routes only...');
    return [];
  }
}

/**
 * Generate URL entry for sitemap
 */
function createUrlEntry(loc, lastmod, changefreq = 'weekly', priority = '0.8') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Generate the complete sitemap
 */
async function generateSitemap() {
  const now = new Date().toISOString();
  const urls = [];

  // 1. Add static routes for each language
  console.log('📝 Adding static routes...');
  for (const route of BASE_ROUTES) {
    for (const lang of LANGUAGES) {
      const url = route === '/' ? `${HOSTNAME}/${lang}` : `${HOSTNAME}/${lang}${route}`;

      const priority = route === '/' ? '1.0' : '0.8';
      const changefreq = route === '/' ? 'daily' : 'weekly';
      urls.push(createUrlEntry(url, now, changefreq, priority));
    }
  }

  // Also add the root URL
  urls.push(createUrlEntry(HOSTNAME, now, 'daily', '1.0'));

  // 2. Add subcategory filter pages
  console.log('📝 Adding subcategory filter pages...');
  for (const subcategory of MUSIC_SUBCATEGORIES) {
    for (const lang of LANGUAGES) {
      const encodedSubcategory = encodeURIComponent(subcategory);
      const url = `${HOSTNAME}/${lang}/studios?subcategory=${encodedSubcategory}`;
      urls.push(createUrlEntry(url, now, 'weekly', '0.7'));
    }
  }

  // 3. Add city filter pages
  console.log('📝 Adding city filter pages...');
  for (const city of CITIES) {
    for (const lang of LANGUAGES) {
      const encodedCity = encodeURIComponent(city);
      const url = `${HOSTNAME}/${lang}/studios?city=${encodedCity}`;
      urls.push(createUrlEntry(url, now, 'weekly', '0.7'));
    }
  }

  // 4. Fetch and add individual studio pages
  const studios = await fetchStudios();

  if (studios.length > 0) {
    console.log('📝 Adding individual studio pages...');
    for (const studio of studios) {
      // Skip studios without an ID
      if (!studio._id) continue;

      for (const lang of LANGUAGES) {
        // Studio detail page: /{lang}/studio/{studioId}
        const studioUrl = `${HOSTNAME}/${lang}/studio/${studio._id}`;
        urls.push(createUrlEntry(studioUrl, now, 'weekly', '0.9'));

        // Studio reviews page: /{lang}/studio/{studioId}/reviews
        const reviewsUrl = `${HOSTNAME}/${lang}/studio/${studio._id}/reviews`;
        urls.push(createUrlEntry(reviewsUrl, now, 'monthly', '0.6'));
      }
    }
  }

  // 5. Generate the XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  // 6. Write to dist folder
  const distPath = path.resolve(__dirname, '../dist/sitemap.xml');

  // Ensure dist folder exists
  const distDir = path.dirname(distPath);
  if (!fs.existsSync(distDir)) {
    console.log('⚠️  dist folder not found. Run `npm run build` first.');
    return;
  }

  fs.writeFileSync(distPath, sitemap, 'utf8');

  console.log(`\n✅ Sitemap generated successfully!`);
  console.log(`📄 Location: ${distPath}`);
  console.log(`📊 Total URLs: ${urls.length}`);
  console.log(`   - Static pages: ${BASE_ROUTES.length * LANGUAGES.length + 1}`);
  console.log(`   - Subcategory pages: ${MUSIC_SUBCATEGORIES.length * LANGUAGES.length}`);
  console.log(`   - City pages: ${CITIES.length * LANGUAGES.length}`);
  console.log(`   - Studio pages: ${studios.length * LANGUAGES.length * 2}`);
}

// Run the generator
generateSitemap().catch(console.error);
