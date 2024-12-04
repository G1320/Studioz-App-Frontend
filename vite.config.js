import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import Sitemap from 'vite-plugin-sitemap';

const languages = ['en', 'he'];
const baseRoutes = ['/services', '/wishlists', '/create-studio'];

const languageRoutes = languages.flatMap((lang) => baseRoutes.map((route) => `/${lang}${route}`));

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://studioz.co.il',
      routes: languageRoutes
    })
  ],
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@forms': path.resolve(__dirname, './src/forms'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/models'),
      '@config': path.resolve(__dirname, './src/config')
    }
  }
});
