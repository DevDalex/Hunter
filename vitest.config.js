import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['src/**/*.test.{js,jsx}', 'tests/unit/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    restoreMocks: true,
    clearMocks: true,
    reporters: ['default'],
  },
});
