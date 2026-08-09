import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare serves static files from dist/client and executes the
  // worker from dist/server. Keeping those concerns separate prevents the
  // host-level 404 that occurs when index.html is written to dist/ itself.
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 20000,
          groups: [
            { name: 'vendor', test: /node_modules/ },
            // The maintained chapter archive grows every time a dedicated
            // research module is added. Keep the older 340–368 records in a
            // stable data chunk so later chapter upgrades do not repeatedly
            // push the active maintained-research chunk over its CI budget.
            { name: 'succession-maintained-340-368', test: /src\/data\/succession(?:34\d|35\d|36[0-8])\d*Research\.js$/ },
            // Keep this split deliberately narrow. Information consistency is
            // a leaf runtime selector used inside the on-demand Succession
            // data graph, so extracting it relieves the per-chunk ceiling
            // without promoting the much larger product/search graph into the
            // startup dependency closure.
            { name: 'succession-information-consistency', test: /src\/data\/succession\/informationConsistency\.js$/ },
          ],
        },
      },
    },
  },
});
