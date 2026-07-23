import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { routeManifest } from '../src/data/routeManifest.js';

const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(`Cloudflare release audit failed: ${message}`); };
const exists = async (relative) => access(path.join(root, relative)).then(() => true, () => false);
const unique = (items) => new Set(items).size === items.length;

for (const required of [
  'dist/client/index.html',
  'dist/client/.vite/manifest.json',
  'dist/server/index.js',
  'dist/server/chapter-admin.js',
  'wrangler.jsonc',
]) {
  assert(await exists(required), `missing required deployment artifact ${required}`);
}

const wrangler = JSON.parse(await readFile(path.join(root, 'wrangler.jsonc'), 'utf8'));
assert(wrangler.name === 'hunter', 'Worker name must match the Cloudflare connected project');
assert(wrangler.main === 'dist/server/index.js', 'Worker entry must be dist/server/index.js');
assert(wrangler.assets?.directory === 'dist/client', 'static asset directory must be dist/client');
assert(wrangler.assets?.binding === 'ASSETS', 'static assets must use the ASSETS binding');
assert(wrangler.assets?.run_worker_first === true, 'Worker-first routing must remain enabled');
assert(wrangler.assets?.html_handling === 'none' && wrangler.assets?.not_found_handling === 'none', 'Cloudflare must not rewrite API routes through automatic HTML handling');

const compatibilityDate = String(wrangler.compatibility_date || '');
assert(/^\d{4}-\d{2}-\d{2}$/.test(compatibilityDate), 'compatibility_date must use YYYY-MM-DD');
const todayUtc = new Date().toISOString().slice(0, 10);
assert(compatibilityDate <= todayUtc, `compatibility_date ${compatibilityDate} cannot be later than ${todayUtc}`);

assert(routeManifest.length > 0 && unique(routeManifest.map((route) => `${route.view}/${route.target}`)), 'reader-facing route destinations must remain non-empty and unique');

const clientFiles = await readdir(path.join(root, 'dist/client'));
assert(!clientFiles.some((file) => /^hxh-archive-phase-[^/]+-(?:source|sites-source|standalone)\.zip$/.test(file)), 'retired portable release ZIPs must not be deployed as public assets');
assert(!clientFiles.includes('release-manifest.json'), 'retired portable release manifest must not be deployed');
assert(!(await exists('dist/.openai')), 'OpenAI hosting identity must not be present in the Cloudflare artifact');

const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
assert(!packageJson.scripts?.['package:release'], 'retired portable package build command is still registered');
assert(!String(packageJson.scripts?.build || '').includes('package:release'), 'Cloudflare build still invokes portable package generation');
assert(!String(packageJson.scripts?.build || '').includes('vite.standalone'), 'Cloudflare build still invokes the standalone Vite configuration');

console.log(`Cloudflare release audit passed: ${routeManifest.length} unique reader routes; Worker entry, ASSETS binding, Worker-first API routing, and public artifact boundaries verified.`);
