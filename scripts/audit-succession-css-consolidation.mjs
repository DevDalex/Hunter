import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession CSS consolidation audit failed: ${message}`);
};

const shell = await readFile(path.join(root, 'src/components/succession/SuccessionArchiveShell.jsx'), 'utf8');
const boundary = await readFile(path.join(root, 'src/components/succession/SuccessionArchiveHistoricalLayers.css'), 'utf8');
const legacyLayers = [
  'SuccessionArchiveContrastFixes.css',
  'SuccessionArchiveDeepContrastFixes.css',
  'SuccessionArchiveNenFixes.css',
];

assert(shell.includes("import './SuccessionArchiveHistoricalLayers.css';"), 'archive shell does not use the consolidated historical CSS entrypoint');
for (const filename of legacyLayers) {
  assert(!shell.includes(`import './${filename}';`), `archive shell still imports ${filename} directly`);
  assert(boundary.includes(`@import './${filename}';`), `historical boundary does not retain ${filename}`);
  await readFile(path.join(root, 'src/components/succession', filename), 'utf8');
}
assert(boundary.includes('New presentation work belongs in component/design-system styles'), 'historical CSS boundary lacks its no-new-patches contract');
assert(!/@media\s*\([^)]*max-width:/i.test(boundary), 'historical CSS entrypoint introduced a mobile/tablet breakpoint');

console.log(`Succession CSS consolidation audit passed: ${legacyLayers.length} historical fix layers are isolated behind one shell import boundary.`);
