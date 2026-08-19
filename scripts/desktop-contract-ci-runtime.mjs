import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';

const sentinel = path.join(process.cwd(), '.desktop-contract-repaired');
let alreadyRepaired = false;
try {
  await access(sentinel);
  alreadyRepaired = true;
} catch {
  alreadyRepaired = false;
}

if (!alreadyRepaired) {
  await import('./desktop-contract-ci-repair.mjs');
  await import('./timeline-intelligence-readability-fix.mjs');
  await import('./royal-inspector-desktop-cleanup.mjs');
  await import('./desktop-contract-ci-bundle.mjs');
  await writeFile(sentinel, 'validated desktop contract repair\n');
}
