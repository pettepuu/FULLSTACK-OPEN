import { defineConfig } from 'vite';

export default defineConfig({
  // other configurations...
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  },
});