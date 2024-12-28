import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  define: {
    // Ensure environment variables are properly exposed
    __GROQ_API_KEY__: JSON.stringify(process.env.VITE_GROQ_API_KEY),
    __GROQ_API_KEY_BACKUP__: JSON.stringify(process.env.VITE_GROQ_API_KEY_BACKUP),
  },
})
