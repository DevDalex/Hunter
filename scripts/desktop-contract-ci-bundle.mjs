import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const finalQaPath = path.join(root, 'scripts/succession-final-release-qa.mjs');
const marker = 'desktop-contract-repair.json';
let finalQa = await readFile(finalQaPath, 'utf8');
if (!finalQa.includes(marker)) {
  finalQa = `${finalQa.trimEnd()}\n\nawait mkdir(output, { recursive: true });\nawait writeFile(path.join(output, '${marker}'), await readFile(path.join(root, '${marker}')));\n`;
  await writeFile(finalQaPath, finalQa);
}

const output = execFileSync('git', ['diff', '--name-status', '-z'], { cwd: root, encoding: 'utf8' });
const parts = output.split('\0').filter(Boolean);
const entries = [];
for (let index = 0; index < parts.length;) {
  const status = parts[index++];
  if (status.startsWith('R') || status.startsWith('C')) {
    const from = parts[index++];
    const to = parts[index++];
    const content = await readFile(path.join(root, to), 'utf8');
    entries.push({ path: from, delete: true });
    entries.push({ path: to, content });
    continue;
  }
  const relative = parts[index++];
  if (status.startsWith('D')) entries.push({ path: relative, delete: true });
  else entries.push({ path: relative, content: await readFile(path.join(root, relative), 'utf8') });
}

const bundle = {
  generatedAt: new Date().toISOString(),
  baseHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  files: entries,
};
await writeFile(path.join(root, marker), `${JSON.stringify(bundle, null, 2)}\n`);
console.log(`Desktop repair bundle captured ${entries.length} file operations.`);
