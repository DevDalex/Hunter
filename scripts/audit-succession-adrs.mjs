import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession ADR audit failed: ${message}`);
};

const records = [
  ['0001-comprehension-first-presentation.md', ['Status:** Accepted', 'same canonical graph', 'Briefing', 'Intelligence', 'Research']],
  ['0002-local-only-user-state.md', ['Status:** Accepted', 'browser-local', 'Local analytics', 'must not store or transmit']],
  ['0003-runtime-schema-family-coverage.md', ['Status:** Accepted', 'ENTITY_TYPE_VALUES', 'base', 'intelligence', 'schemasFinal.js']],
  ['0004-performance-media-boundaries.md', ['Status:** Accepted', 'preferred JavaScript chunk budget', 'lazy data islands', 'Responsive derivatives', 'PWA/offline']],
];

const index = await readFile(path.join(root, 'docs/adr/README.md'), 'utf8');
for (const [filename, tokens] of records) {
  assert(index.includes(filename), `ADR index does not link ${filename}`);
  const source = await readFile(path.join(root, 'docs/adr', filename), 'utf8');
  for (const token of tokens) assert(source.includes(token), `${filename} is missing decision contract token: ${token}`);
  assert(source.includes('## Context') && source.includes('## Decision') && source.includes('## Consequences') && source.includes('## Rejected alternatives'), `${filename} does not follow the ADR structure`);
}
console.log(`Succession ADR audit passed: ${records.length} accepted architecture decisions are indexed and structurally complete.`);
