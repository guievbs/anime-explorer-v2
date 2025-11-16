import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,         // permite usar test(), describe(), expect() sem importar
    environment: 'jsdom',  // necessário para localStorage, DOM, etc.
    setupFiles: ['./src/test/setupTests.js'], // arquivo de setup
    watch: false,
    coverage: {
      provider: 'v8'
    }
  }
});
