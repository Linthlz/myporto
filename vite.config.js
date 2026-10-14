import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` keeps asset URLs relative so the production build can be served
// from any sub-path (static host, preview link, GitHub Pages project site).
//
// Two pages: the main portfolio (index.html) and the photography portfolio
// (photography/index.html), each with its own entry, styles and theme.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 8192,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        photography: resolve(import.meta.dirname, 'photography/index.html'),
      },
    },
  },
})
