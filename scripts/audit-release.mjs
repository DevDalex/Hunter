import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const exists = async (relative) => access(path.join(root, relative)).then(() => true, () => false);

for (const required of ['dist/client/index.html', 'dist/client/.vite/manifest.json', 'dist/server/index.js', 'wrangler.jsonc']) {
  if (!(await exists(required))) fail(`missing required deployment artifact ${required}`);
}

let wrangler;
try {
  wrangler = JSON.parse(await readFile(path.join(root, 'wrangler.jsonc'), 'utf8'));
} catch (error) {
  fail(`wrangler.jsonc is not parseable JSON: ${error.message}`);
}

if (wrangler) {
  if (wrangler.name !== 'hunter') fail('Worker name must match the connected Cloudflare project');
  if (wrangler.main !== 'dist/server/index.js') fail('Worker entry must point to dist/server/index.js');
  if (wrangler.assets?.directory !== 'dist/client') fail('static asset directory must point to dist/client');
  if (wrangler.assets?.binding !== 'ASSETS') fail('static assets must expose the ASSETS binding used by the Worker');
  const compatibilityDate = String(wrangler.compatibility_date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(compatibilityDate)) fail('compatibility_date must use YYYY-MM-DD');
  else if (compatibilityDate > new Date().toISOString().slice(0, 10)) fail(`compatibility_date ${compatibilityDate} cannot be in the future`);
}

if (await exists('dist/client')) {
  const clientFiles = await readdir(path.join(root, 'dist/client'));
  if (clientFiles.some((file) => /^hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(file))) {
    fail('retired portable release ZIPs must not be deployed as public assets');
  }
}
if (await exists('dist/.openai')) fail('unexpected OpenAI hosting identity is present in the Cloudflare artifact');

if (failures.length) {
  for (const failure of failures) console.error(`Release audit failed: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Release audit passed: production client, Worker entry, Cloudflare configuration, and public artifact boundaries are valid.');
}
