import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // ⚡ prevent auto-reload, allow manual refresh
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Vectus',
        short_name: 'Vectus',
        description: 'Offline-first gamified learning platform',
        theme_color: '#ffffff',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: '/Vectus/' // ⚡ must match repo name exactly (case-sensitive)
})
