import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(),],
  server: {
    port: 3000,
    host: true, // Add this to expose to network
    open: true  // Automatically open browser
  },
  root: '.', // Ensure root is correctly set
  build: {
    outDir: 'dist'
  }
})