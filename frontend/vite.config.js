import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // In dev the browser talks to /api on localhost (same origin), Vite forwards it to the backend.
      // Same origin => no CORS problems and the httpOnly refresh-token cookie works.
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET || 'https://snitch-beka.onrender.com',
          changeOrigin: true,
        },
      },
    },
  }
})
