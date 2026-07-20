import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { SITES_SOURCE_PACKAGE_PATH, STANDALONE_PACKAGE_PATH } from '../src/data/releaseReadiness.js';

await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await cp('server/index.js', 'dist/server/index.js');
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
const currentPackages = new Set([SITES_SOURCE_PACKAGE_PATH.slice(1), STANDALONE_PACKAGE_PATH.slice(1)]);
for (const file of await readdir('dist/client')) {
  if (/^hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(file) && !currentPackages.has(file)) await rm(`dist/client/${file}`);
}
for (const file of currentPackages) await rm(`public/${file}`, { force: true });
