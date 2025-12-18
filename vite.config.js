import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';
import categoriesJson from './src/core/i18n/locales/en/categories.json';
import { cities } from './src/core/config/cities/cities';

const languages = ['en', 'he'];

// Get all subcategory keys from categories.json
// Note: Currently only "music" category is used in URLs, but we include both for future-proofing
const musicSubCategories = Object.keys(categoriesJson.subCategories.musicAndPodcast);

// Generate category/subcategory routes for studios
// URL structure: /studios/music or /studios/music/:subcategory
const studiosCategoryRoutes = [
  '/studios/music', // Category only (shows all music subcategories)
  ...musicSubCategories.map((sub) => `/studios/music/${sub}`) // Category + subcategory
  // Note: Photo category routes not included as they're not currently used in the app
  // Uncomment if photo category support is added:
  // '/studios/photo',
  // ...photoSubCategories.map((sub) => `/studios/photo/${sub}`)
];

// Generate city-specific routes with query parameters
// Format: /studios/music/:subcategory?city=CityName
const cityNames = cities.map((city) => city.name);
const studiosCategoryRoutesWithCities = [
  // Category pages with cities
  ...cityNames.map((city) => `/studios/music?city=${encodeURIComponent(city)}`),
  // Subcategory pages with cities
  ...musicSubCategories.flatMap((sub) =>
    cityNames.map((city) => `/studios/music/${sub}?city=${encodeURIComponent(city)}`)
  )
];

// Base static routes (only publicly accessible pages)
// Note: /wishlists and /create-studio require authentication, so they're excluded from sitemap
const baseRoutes = ['/studios'];

// Combine all routes (base + category/subcategory + city variations)
const allRoutes = ['/', ...baseRoutes, ...studiosCategoryRoutes, ...studiosCategoryRoutesWithCities].flatMap((route) =>
  languages.map((lang) => `/${lang}${route}`)
);

export default defineConfig(({ _command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            '<!-- GOOGLE_MAPS_API -->',
            `<script 
              src="https://maps.googleapis.com/maps/api/js?key=${env.VITE_GOOGLE_MAPS_API_KEY}&loading=async&libraries=places" 
              defer>
            </script>`
          );
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
            'mapbox-vendor': ['react-map-gl', 'mapbox-gl'],
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
          includePaths: [path.resolve(__dirname, './src/assets/styles')]
        }
      }
    }
  };
});
