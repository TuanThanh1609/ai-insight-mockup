import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api/smax-chat → Smax AI (CORS-safe for dev)
      '/api/smax-chat': {
        target: 'https://smaxai.cdp.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/smax-chat/, '/api/chat'),
      },
    },
  },
})
