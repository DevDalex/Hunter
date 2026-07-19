import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A single-bundle build is used only for the downloadable direct-open edition.
// The hosted application keeps its normal route-level code splitting.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '.standalone-build',
    emptyOutDir: true,
    cssCodeSplit: false,
    manifest: false,
    rolldownOptions: {
      output: {
        codeSplitting: false,
        entryFileNames: 'assets/application.js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
