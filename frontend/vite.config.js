import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/api-bmob': {
        target: 'https://api2.bmob.cn/1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-bmob/, '')
      }
    }
  }
})
