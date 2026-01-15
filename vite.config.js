import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import Sitemap from 'vite-plugin-sitemap';
import categoriesJson from './src/core/i18n/locales/en/categories.json';
import { cities } from './src/core/config/cities/cities';

const languages = ['en', 'he'];

// Get all subcategory display names from categories.json for URL query params
// Using the English display names as they're used in query params (e.g., "Podcast Recording")
const musicSubCategories = Object.values(categoriesJson.subCategories.musicAndPodcast);

// Generate subcategory routes for studios using query params
// URL structure: /studios?subcategory=SubcategoryName
const studiosSubcategoryRoutes = musicSubCategories.map((sub) => `/studios?subcategory=${encodeURIComponent(sub)}`);

// Generate city-specific routes with query parameters
const cityNames = cities.map((city) => city.name);
const studiosCityRoutes = cityNames.map((city) => `/studios?city=${encodeURIComponent(city)}`);

// Generate combined subcategory + city routes
// Format: /studios?subcategory=SubcategoryName&city=CityName
const studiosSubcategoryWithCityRoutes = musicSubCategories.flatMap((sub) =>
  cityNames.map((city) => `/studios?subcategory=${encodeURIComponent(sub)}&city=${encodeURIComponent(city)}`)
);

// Base static routes (only publicly accessible pages)
// Note: /wishlists and /create-studio require authentication, so they're excluded from sitemap
const baseRoutes = ['/discover', '/studios', '/for-owners', '/how-it-works', '/subscription', '/privacy', '/terms'];

// Combine all routes (base + subcategory + city + combined variations)
const allRoutes = [
  '/',
  ...baseRoutes,
  ...studiosSubcategoryRoutes,
  ...studiosCityRoutes,
  ...studiosSubcategoryWithCityRoutes
].flatMap((route) => languages.map((lang) => `/${lang}${route}`));

export default defineConfig(({ _command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          let transformedHtml = html;

          // Replace Google Maps API placeholder
          transformedHtml = transformedHtml.replace(
            '<!-- GOOGLE_MAPS_API -->',
            `<script 
              src="https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places" 
              defer>
            </script>`
          );

          return transformedHtml;
        }
      },
      {
        name: 'copy-logo',
        buildStart() {
          // Copy logo file for SEO schema (build time)
          const logoSource = path.resolve(__dirname, 'public/android-chrome-512x512.png');
          const logoDest = path.resolve(__dirname, 'public/logo.png');
          if (fs.existsSync(logoSource) && !fs.existsSync(logoDest)) {
            fs.copyFileSync(logoSource, logoDest);
          }
        },
        configureServer(server) {
          // Ensure logo exists in dev mode
          server.httpServer?.once('listening', () => {
            const logoSource = path.resolve(__dirname, 'public/android-chrome-512x512.png');
            const logoDest = path.resolve(__dirname, 'public/logo.png');
            if (fs.existsSync(logoSource) && !fs.existsSync(logoDest)) {
              fs.copyFileSync(logoSource, logoDest);
            }
          });
        }
      },
      react(),
      Sitemap({
        hostname: 'https://studioz.co.il',
        dynamicRoutes: allRoutes,
        generateRobotsTxt: true
      })
    ],
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
            // Note: mapbox removed from manual chunks - let Vite naturally code-split with lazy components
            'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-persist-client'],
            'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            'animation-vendor': ['react-spring', '@use-gesture/react'],
            'calendar-vendor': [
              '@fullcalendar/core',
              '@fullcalendar/react',
              '@fullcalendar/daygrid',
              '@fullcalendar/timegrid',
              '@fullcalendar/interaction',
              '@fullcalendar/list'
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './src/shared'),
        '@features': path.resolve(__dirname, './src/features'),
        '@app': path.resolve(__dirname, './src/app'),
        '@core': path.resolve(__dirname, './src/core'),
        '@types': path.resolve(__dirname, './src/types')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [
            path.resolve(__dirname, './src/assets/styles'),
            path.resolve(__dirname, './src/shared/components/forms/styles')
          ]
        }
      }
    }
  };
});
