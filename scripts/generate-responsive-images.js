/**
 * Generate responsive images for srcset optimization
 *
 * Creates multiple sizes of images for different screen densities
 * Run: node scripts/generate-responsive-images.js
 */

import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '..', 'public', 'images', 'optimized');

// Images that need responsive versions with their target display widths
const RESPONSIVE_IMAGES = [
  // Hero image - displayed at various widths, needs mobile version
  {
    source: 'Landing-Studio1320-1.webp',
    sizes: [640, 960, 1320] // mobile, tablet, desktop
  },
  // Mobile screenshots - displayed at ~315px width
  {
    source: 'Studioz-Studio-Details-1-Dark.webp',
    sizes: [315, 630] // 1x and 2x for retina
  },
  {
    source: 'Studioz-Studio-Details-2-Dark.webp',
    sizes: [315, 630]
  },
  {
    source: 'Studioz-Studio-Details-1-Light.webp',
    sizes: [315, 630]
  },
  {
    source: 'Studioz-Studio-Detail-2-Light.webp',
    sizes: [315, 630]
  },
  // Schedule control image - displayed at ~634px width
  {
    source: 'Studio-Availability-Controls-desktop-1-V3.webp',
    sizes: [634, 1268]
  },
  // Order details - displayed at various widths
  {
    source: 'Studioz-Studio-Details-Order-1-Light.webp',
    sizes: [400, 800]
  },
  // For Owners: Google ranking screenshot (PNG source → WebP output)
  {
    source: 'For-Owners-Google-Ranking.png',
    sizes: [315, 630], // 1x and 2x for visibility section
    outputExt: '.webp'
  },
  // Dashboard calendar thumbnail (For Owners) — displayed ~380px on mobile
  {
    source: 'Studioz-Dashboard-Calendar.webp',
    sizes: [400, 800]
  }
];

async function generateResponsiveImages() {
  console.log('\n📸 Generating responsive images...\n');

  for (const config of RESPONSIVE_IMAGES) {
    const sourcePath = join(IMAGES_DIR, config.source);

    if (!existsSync(sourcePath)) {
      console.log(`  ⚠️ Skipped: ${config.source} (not found)`);
      continue;
    }

    const ext = extname(config.source);
    const baseName = basename(config.source, ext);
    const outExt = config.outputExt ?? ext;

    for (const width of config.sizes) {
      const outputName = `${baseName}-${width}w${outExt}`;
      const outputPath = join(IMAGES_DIR, outputName);

      // Skip if already exists
      if (existsSync(outputPath)) {
        console.log(`  ✓ Exists: ${outputName}`);
        continue;
      }

      try {
        let pipeline = sharp(sourcePath).resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
        if (outExt === '.webp') {
          pipeline = pipeline.webp({ quality: 80 });
        }
        await pipeline.toFile(outputPath);

        console.log(`  ✓ Created: ${outputName}`);
      } catch (err) {
        console.error(`  ✗ Failed: ${outputName}`, err.message);
      }
    }
  }

  console.log('\n✅ Responsive images generated!\n');
}

generateResponsiveImages().catch(console.error);
