/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['brand/logo.png'],
      manifest: {
        name: 'Kab Tak? (independent concept)',
        short_name: 'Kab Tak?',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#F2F7FC',
        theme_color: '#143461',
        icons: [],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,woff2,svg}'] },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
