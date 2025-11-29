import { defineConfig } from 'vite';
import { vitePluginApi } from './vite-plugin-api.js';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis .env
dotenv.config();

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [
    vitePluginApi()
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

