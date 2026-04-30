import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://api.bmob.com/1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'X-Bmob-Application-Id': 'f33a06a03b05f0795367d32767f21c63',
          'X-Bmob-REST-API-Key': 'e309b64d6176f40dea125aa38bf8a2e4'
        }
      }
    }
  }
})
