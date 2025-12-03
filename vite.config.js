import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const languages = ['en', 'he'];
const baseRoutes = ['/studios', '/wishlists', '/create-studio'];
const allRoutes = ['/', ...baseRoutes].flatMap((route) => languages.map((lang) => `/${lang}${route}`));

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
