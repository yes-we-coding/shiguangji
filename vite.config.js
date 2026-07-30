import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署路径：https://<用户名>.github.io/shiguangji/
  base: '/shiguangji/',
  plugins: [vue()],
})
