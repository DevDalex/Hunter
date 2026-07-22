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
const assert = (condition, message) => { if (!condition) throw new Error(`Hosted chapter admin audit failed: ${message}`); };
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

const [worker, serverIndex, adminPage, inspectContract, prepareHosting, packageJson] = await Promise.all([
  read('server/chapter-admin.js'),
  read('server/index.js'),
  read('public/admin/chapters/index.html'),
  read('public/admin/chapters/inspect-contract.js'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);

for (const secret of ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET', 'GITHUB_ADMIN_TOKEN']) {
  assert(worker.includes(secret), `Worker must require ${secret}`);
}
assert(!worker.includes("ADMIN_PASSWORD || '12345'") && !adminPage.includes('value="12345"'), 'temporary credentials must never be hard-coded into deployed source');
assert(worker.includes('HttpOnly; Secure; SameSite=Strict'), 'administrator session cookie must remain HttpOnly, Secure, and SameSite Strict');
assert(worker.includes("request.headers.get('x-csrf-token')"), 'mutating administrator endpoints must retain CSRF validation');
assert(worker.includes('CHAPTER_SOURCE_HOSTS') && worker.includes('CHAPTER_IMAGE_HOSTS'), 'remote source and image hosts must remain allowlisted');
assert(worker.includes('/git/blobs') && worker.includes('/git/trees') && worker.includes('/git/commits') && worker.includes('/git/refs/heads/'), 'GitHub publication must remain one Git-data commit flow');
assert(worker.includes('force: false'), 'branch update must reject non-fast-forward publication races');
assert(adminPage.includes('/api/admin/chapter/login') && adminPage.includes('/api/admin/chapter/import'), 'deployed admin page must use authenticated Worker endpoints');
assert(adminPage.includes("error.status !== 405") && adminPage.includes("method:'GET'"), 'read-only inspection must retry through GET after an HTTP 405');
assert(adminPage.includes("credentials:'same-origin'"), 'administrator requests must send the HttpOnly session cookie only to the same origin');
assert(serverIndex.includes('normalizeInspectionGet') && serverIndex.includes('validateInspectionResponse'), 'Worker entry must normalize and validate the GET inspection fallback');
assert(serverIndex.includes('Array.isArray(payload.pages)'), 'Worker must reject successful inspection responses without a pages array');
assert(serverIndex.includes('/admin/chapters/inspect-contract.js'), 'protected admin HTML must load the browser-side inspection contract guard');
assert(inspectContract.includes("requestUrl.pathname !== '/api/admin/chapter/inspect'") && inspectContract.includes('Array.isArray(payload.pages)'), 'browser inspection guard must validate the API response shape');
assert(inspectContract.includes('rewritten to a webpage'), 'browser inspection guard must explain an HTML route rewrite');
assert(prepareHosting.includes("cp('server', 'dist/server', { recursive: true })"), 'hosting preparation must copy Worker modules recursively');
assert(prepareHosting.includes('Mozilla/5.0') && prepareHosting.includes('Hosted chapter admin fetch profile marker is missing.'), 'deployed chapter fetch must use the guarded browser request profile');
assert(packageJson.includes('audit:hosted-admin'), 'hosted administrator audit must remain registered in package scripts');

console.log('Hosted chapter admin audit passed: login/session boundary, CSRF, allowlisted remote fetches, resilient 405 fallback, strict inspection response contracts, browser fetch profile, image parsing, manifest round-trip, atomic GitHub publication, and recursive Worker packaging are intact.');
