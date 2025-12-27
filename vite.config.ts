import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['apple-touch-icon.png'],
          manifest: {
            name: 'Pansko',
            short_name: 'Pansko',
            description: 'Pansko PWA',
            theme_color: '#0b1020',
            background_color: '#0b1020',
            display: 'standalone',
            start_url: '/',
            icons: [
              { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
              { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

