import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const target = process.argv[2];
const allowed = new Set([
  'audit-readability.mjs',
  'audit-layout.mjs',
  'audit-accessibility.mjs',
  'audit-polish.mjs',
  'audit-release.mjs',
]);

if (!allowed.has(target)) throw new Error(`Unknown CSS-aware audit target: ${target || '(missing)'}`);

const root = process.cwd();
const entryPath = path.join(root, 'src/styles.css');
const originalEntry = await readFile(entryPath, 'utf8');
const importPattern = /@import\s+['"]([^'"]+)['"]\s*;/g;
const imports = [...originalEntry.matchAll(importPattern)].map((match) => match[1]);
if (!imports.length) throw new Error('The global stylesheet entry point has no local imports to expand.');

const expanded = [];
for (const relative of imports) {
  if (!relative.startsWith('.')) throw new Error(`External CSS imports are not supported by the audit wrapper: ${relative}`);
  expanded.push(await readFile(path.resolve(path.dirname(entryPath), relative), 'utf8'));
}

const auditCss = `/* Temporary audit expansion of src/styles.css. Do not commit this generated form. */\n\n${expanded.join('\n\n')}\n`;
await writeFile(entryPath, auditCss);

try {
  await import(new URL(`./${target}`, import.meta.url));
} finally {
  await writeFile(entryPath, originalEntry);
}
