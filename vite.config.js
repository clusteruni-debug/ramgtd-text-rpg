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
    port: 5120,
    open: true,
  },
});
