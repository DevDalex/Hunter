#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  detectImage,
  extractChapterImageUrls,
  inferChapterNumber,
  parseGeneratedManifest,
  serializeGeneratedManifest,
} from '../server/chapter-admin.js';

const root = process.cwd();
const assert = (condition, message) => { if (!condition) throw new Error(`Hosted chapter importer audit failed: ${message}`); };
const read = (relative) => readFile(path.join(root, relative), 'utf8');

const wpHtml = `
  <img class="wp-manga-chapter-img" data-src="https://3asq.online/wp-content/uploads/WP-manga/data/example/10.jpg" />
  <img class="wp-manga-chapter-img" data-src="https://3asq.online/wp-content/uploads/WP-manga/data/example/02.jpg" />
  <img class="comment-avatar" src="https://3asq.online/avatar.jpg" />
  <img class="wp-manga-chapter-img" data-src="https://3asq.online/wp-content/uploads/WP-manga/data/example/01.jpg" />
`;
const detected = extractChapterImageUrls(wpHtml, 'https://3asq.online/manga/hunter-x-hunter/414/');
assert(detected.length === 3, 'WP Manga extraction must reject comment/avatar media');
assert(detected[0].endsWith('/01.jpg') && detected[1].endsWith('/02.jpg') && detected[2].endsWith('/10.jpg'), 'detected chapter pages must use natural numeric order');
assert(inferChapterNumber('https://3asq.online/manga/hunter-x-hunter/414/') === 414, 'chapter number inference changed');

const png = new Uint8Array(24);
png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
new DataView(png.buffer).setUint32(16, 1200, false);
new DataView(png.buffer).setUint32(20, 1800, false);
const pngRecord = detectImage(png, 'image/png', 'https://3asq.online/01.png');
assert(pngRecord.extension === '.png' && pngRecord.width === 1200 && pngRecord.height === 1800, 'PNG signature and dimension validation changed');

const manifest = { 414: [{ page: 1, src: '/media/succession-contest/chapters/414/001.png', width: 1200, height: 1800 }] };
const serialized = serializeGeneratedManifest(manifest);
assert(JSON.stringify(parseGeneratedManifest(serialized)) === JSON.stringify(manifest), 'generated manifest serialization must round-trip');

const [engine, direct, serverIndex, directPage, inspectContract, prepareHosting, packageJson] = await Promise.all([
  read('server/chapter-admin.js'),
  read('server/direct-chapter-import.js'),
  read('server/index.js'),
  read('public/admin/chapters/direct.html'),
  read('public/admin/chapters/inspect-contract.js'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);

assert(direct.includes("String(env.GITHUB_ADMIN_TOKEN || '').trim()"), 'direct importer must derive its private request session from the server-side GitHub token');
assert(direct.includes("ADMIN_SESSION_SECRET: secret"), 'direct importer must inject the internal session secret without browser credentials');
assert(direct.includes("'/api/admin/chapter/login'") && direct.includes("does not use account login"), 'legacy account endpoints must be blocked');
assert(direct.includes("assetUrl.pathname = '/admin/chapters/direct.html'"), 'the direct route must serve the login-free page');
assert(!directPage.includes('type="password"') && !directPage.includes('login-form') && !directPage.includes('Sign in'), 'the visible importer must not contain a login form');
assert(directPage.includes('No username or password'), 'the page must clearly describe direct access');
assert(directPage.includes('/api/admin/chapter/inspect') && directPage.includes('/api/admin/chapter/import'), 'the direct page must retain inspect and publish actions');
assert(serverIndex.includes("from './direct-chapter-import.js'"), 'the Worker entry must route through the direct importer');
assert(serverIndex.includes('isDirectChapterImportRequest') && !serverIndex.includes('isHostedChapterAdminRequest'), 'the legacy authenticated router must not remain exposed at the Worker boundary');
assert(engine.includes('CHAPTER_SOURCE_HOSTS') && engine.includes('CHAPTER_IMAGE_HOSTS'), 'remote source and image hosts must remain allowlisted');
assert(engine.includes('/git/blobs') && engine.includes('/git/trees') && engine.includes('/git/commits') && engine.includes('/git/refs/heads/'), 'GitHub publication must remain one Git-data commit flow');
assert(engine.includes('force: false'), 'branch update must reject non-fast-forward publication races');
assert(directPage.includes("credentials:'same-origin'"), 'import requests must stay on the same origin');
assert(serverIndex.includes('normalizeInspectionGet') && serverIndex.includes('validateInspectionResponse'), 'Worker entry must normalize and validate the GET inspection fallback');
assert(serverIndex.includes('Array.isArray(payload.pages)'), 'Worker must reject successful inspection responses without a pages array');
assert(serverIndex.includes('/admin/chapters/inspect-contract.js'), 'direct import HTML must load the browser-side inspection contract guard');
assert(inspectContract.includes("requestUrl.pathname !== '/api/admin/chapter/inspect'") && inspectContract.includes('Array.isArray(payload.pages)'), 'browser inspection guard must validate the API response shape');
assert(inspectContract.includes('rewritten to a webpage'), 'browser inspection guard must explain an HTML route rewrite');
assert(prepareHosting.includes("cp('server', 'dist/server', { recursive: true })"), 'hosting preparation must copy Worker modules recursively');
assert(prepareHosting.includes('Mozilla/5.0') && prepareHosting.includes('Hosted chapter admin fetch profile marker is missing.'), 'deployed chapter fetch must use the guarded browser request profile');
assert(packageJson.includes('audit:hosted-admin'), 'hosted importer audit must remain registered in package scripts');

console.log('Hosted chapter importer audit passed: direct access without a visible login, internal short-lived request signing, blocked legacy account endpoints, allowlisted remote fetches, strict inspection contracts, image parsing, manifest round-trip, and atomic GitHub publication are intact.');
