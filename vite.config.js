import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ramgtd-text-rpg/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
