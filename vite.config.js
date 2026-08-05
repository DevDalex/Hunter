import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const successionDataGroups = [
  { name: 'succession-characters', test: /src\/data\/succession\/(characters|royal|queens|princes)/ },
  { name: 'succession-organizations', test: /src\/data\/succession\/(organizations|mafia|military|politics|justice)/ },
  { name: 'succession-story', test: /src\/data\/succession\/(chapters|story|timeline|events)/ },
  { name: 'succession-systems', test: /src\/data\/succession\/(nen|abilities|guardian|ritual)/ },
  { name: 'succession-world', test: /src\/data\/succession\/(locations|rooms|black-whale|atlas)/ },
  { name: 'succession-relations', test: /src\/data\/succession\/(relationships|assignments)/ },
  { name: 'succession-research', test: /src\/data\/succession\/(research|evidence|glossary|sources)/ },
];

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 16000,
          groups: [
            { name: 'vendor-react', test: /node_modules\/(react|react-dom)/ },
            { name: 'vendor-icons', test: /node_modules\/lucide-react/ },
            ...successionDataGroups,
            // Reader routes already use dynamic imports. Do not force all reader
            // modules into one shared slab, which can make route-only code part of
            // the startup graph. Let Rolldown preserve the natural lazy boundaries.
            { name: 'succession-research-ui', test: /src\/components\/succession\/(SuccessionResearch|SuccessionEvidence|SuccessionIntelligence|SuccessionSaved)/ },
            { name: 'vendor', test: /node_modules/ },
          ],
        },
      },
    },
  },
});