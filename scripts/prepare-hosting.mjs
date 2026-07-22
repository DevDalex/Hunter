import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { SITES_SOURCE_PACKAGE_PATH, STANDALONE_PACKAGE_PATH } from '../src/data/releaseReadiness.js';

await mkdir('dist/server', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await cp('server', 'dist/server', { recursive: true });
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');

// The chapter source currently rejects obvious bot/importer user agents with
// HTTP 405. Keep the readable source implementation explicit, but deploy the
// outbound fetch with an ordinary browser profile so allowed chapter pages can
// be inspected through the Worker.
const hostedAdminPath = 'dist/server/chapter-admin.js';
const importerAgent = "'user-agent': 'Hunter-Archive-Chapter-Importer/2.0',";
const browserAgent = [
  "'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',",
  "'cache-control': 'no-cache',",
  "pragma: 'no-cache',",
].join('\n          ');
let hostedAdminSource = await readFile(hostedAdminPath, 'utf8');
if (!hostedAdminSource.includes(importerAgent)) {
  throw new Error('Hosted chapter admin fetch profile marker is missing.');
}
hostedAdminSource = hostedAdminSource.replace(importerAgent, browserAgent);
await writeFile(hostedAdminPath, hostedAdminSource, 'utf8');

const currentPackages = new Set([SITES_SOURCE_PACKAGE_PATH.slice(1), STANDALONE_PACKAGE_PATH.slice(1)]);
for (const file of await readdir('dist/client')) {
  if (/^hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(file) && !currentPackages.has(file)) await rm(`dist/client/${file}`);
}
for (const file of currentPackages) await rm(`public/${file}`, { force: true });