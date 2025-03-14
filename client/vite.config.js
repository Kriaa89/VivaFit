import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this for better CSS handling if needed
  css: {
    devSourcemap: true,
  }
})
