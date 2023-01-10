// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    emptyOutDir: true,
    outDir: '../docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        login: resolve(__dirname, 'src/login/index.html'),
        app: resolve(__dirname, 'src/app/index.html'),
      },
    },
  },
})
