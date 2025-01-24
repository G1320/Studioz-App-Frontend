import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const languages = ['en', 'he'];
const baseRoutes = ['/services', '/wishlists', '/create-studio'];
const allRoutes = ['/', ...baseRoutes].flatMap((route) => languages.map((lang) => `/${lang}${route}`));

export default defineConfig(({ command, mode }) => {
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
      outDir: 'dist'
    },
    resolve: {
      alias: {
        '@shared': path.resolve(__dirname, './src/shared'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/shared/services'),
        '@contexts': path.resolve(__dirname, './src/contexts'),
        '@forms': path.resolve(__dirname, './src/forms'),
        '@hooks': path.resolve(__dirname, './src/shared/hooks'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),
        '@types': path.resolve(__dirname, './src/models'),
        '@config': path.resolve(__dirname, './src/core/config')
      }
    }
  };
});
