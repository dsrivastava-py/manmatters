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
      includeAssets: ['brand/logo.png', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Kab Tak?',
        short_name: 'Kab Tak',
        description: 'An independent concept: what is commonly reported at your week of a hair routine. Works offline, no login.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#F2F7FC',
        theme_color: '#143461',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,woff2,woff,svg,ico,webmanifest}'], navigateFallback: 'index.html' },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
  },
});
