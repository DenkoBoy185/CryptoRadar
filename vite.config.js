import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  root: 'src/',
  // the site is served from https://denkoboy185.github.io/CryptoRadar/
  base: '/CryptoRadar/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        coin: resolve(root, 'coin/index.html'),
        watchlist: resolve(root, 'watchlist/index.html'),
        news: resolve(root, 'news/index.html'),
        portfolio: resolve(root, 'portfolio/index.html'),
      },
    },
  },
});
