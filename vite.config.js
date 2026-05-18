import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/') ||
              id.includes('node_modules/@react-three/fiber') ||
              id.includes('node_modules/@react-three/drei') ||
              id.includes('node_modules/@react-three/postprocessing')) {
            return 'three-vendor'
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor'
          }
        }
      }
    }
  }
})
