/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// API aynı adres üzerinden: oturum çerezi ve CSRF (Origin: 5174) sorunsuz çalışır.
const proxy = {
  '/api': 'http://localhost:3000',
  '/uploads': 'http://localhost:3000',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { port: 5174, strictPort: true, proxy },
  preview: { port: 5174, proxy },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
