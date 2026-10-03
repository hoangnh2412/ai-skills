import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const fromApp = (pkg: string) => path.resolve(root, 'node_modules', pkg)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // Kit cài kiểu `file:` mang node_modules riêng ⇒ ép React / Router / PrimeReact về MỘT bản của app.
      // Thiếu: "Invalid hook call" hoặc theme Prime inject lệch bản.
      dedupe: ['react', 'react-dom', 'react-router-dom', 'primereact', '@primereact/core'],
      alias: {
        react: fromApp('react'),
        'react-dom': fromApp('react-dom'),
        'react-router-dom': fromApp('react-router-dom'),
        primereact: fromApp('primereact'),
        '@primereact/core': fromApp('@primereact/core'),
      },
    },
    server: {
      proxy: {
        // Dev: same-origin `/api` → backend, tránh CORS. Backend scaffold Jarvis mặc định https://localhost:7006
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'https://localhost:7006',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
