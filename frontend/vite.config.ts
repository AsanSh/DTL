import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    allowedHosts: [
      '8a52-212-112-119-142.ngrok-free.app',
      'localhost'
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}) 