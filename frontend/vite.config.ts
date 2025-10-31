import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts'
    }),
    react(),
    checker({ typescript: true }),
  ],
  server:{
    https: {
      key: fs.readFileSync('certs/frontend.key'),
      cert: fs.readFileSync('certs/frontend.crt'),
    },
    host: 'localhost',
    port: 5173,
  },
})
