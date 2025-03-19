import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3000,
    allowedHosts: [
      "df66-223-184-182-219.ngrok-free.app"
    ]
  },
  optimizeDeps: {
    include: ['react-scroll-to-bottom']
  }
})
