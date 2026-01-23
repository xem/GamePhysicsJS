import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'esnext',
    assetsDir: '',
    cssCodeSplit: false,
    minify: false,
    modulePreload: {
      polyfill: false, // Don't add vite polyfills
    },
  },
  test: {
    globals: true,
  },
});
