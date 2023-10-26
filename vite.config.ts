import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/pages/popup/index.html',
        options: 'src/pages/options/index.html',
      }
    }
  }
})
