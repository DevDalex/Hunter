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
import {
  buildChapterBank,
  createChapterPageRecord,
  parseGeneratedHistory,
  serializeGeneratedHistory,
} from '../server/chapter-bank.js';

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

const page = await createChapterPageRecord({ chapter: 414, page: 1, filename: '001.png', src: '/media/succession-contest/chapters/414/001.png', sourceUrl: 'https://3asq.online/01.png', width: 1200, height: 1800, bytes: png, importedAt: '2026-07-23T00:00:00.000Z' });
assert(page.id === 'chapter-414-p001' && page.label === 'p.1', 'page bank identity changed');
assert(/^sha256-[a-f0-9]{64}$/.test(page.checksum) && page.byteSize === 24, 'page checksum or byte-size metadata changed');

const manifest = { 414: [page] };
const serialized = serializeGeneratedManifest(manifest);
assert(JSON.stringify(parseGeneratedManifest(serialized)) === JSON.stringify(manifest), 'generated manifest serialization must round-trip');
const history = [{ id: 'chapter-414-test', action: 'import-chapter', chapter: 414, timestamp: '2026-07-23T00:00:00.000Z', newPageCount: 1 }];
assert(JSON.stringify(parseGeneratedHistory(serializeGeneratedHistory(history))) === JSON.stringify(history), 'generated history serialization must round-trip');
const bank = buildChapterBank(manifest, history);
assert(bank.chapterCount === 76 && bank.startChapter === 339 && bank.endChapter === 414, 'Chapter Bank boundary must remain 339–414');
assert(bank.chapters.find((record) => record.chapter === 414).pages[0].label === 'p.1', 'Chapter Bank aggregation lost page labels');

const [legacyWorker, bankWorker, bankHelpers, serverIndex, adminPage, inspectContract, prepareHosting, packageJson] = await Promise.all([
  read('server/chapter-admin.js'),
  read('server/chapter-admin-v2.js'),
  read('server/chapter-bank.js'),
  read('server/index.js'),
  read('public/admin/chapters/index.html'),
  read('public/admin/chapters/inspect-contract.js'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);

for (const secret of ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET', 'GITHUB_ADMIN_TOKEN']) assert(bankWorker.includes(secret), `Chapter Bank Worker must require ${secret}`);
assert(!bankWorker.includes("ADMIN_PASSWORD || '12345'") && !adminPage.includes('value="12345"'), 'temporary credentials must never be hard-coded');
assert(bankWorker.includes('HttpOnly; Secure; SameSite=Strict'), 'administrator session cookie must remain hardened');
assert(bankWorker.includes("request.headers.get('x-csrf-token')"), 'mutating administrator endpoints must retain CSRF validation');
assert(bankWorker.includes('CHAPTER_SOURCE_HOSTS') && bankWorker.includes('CHAPTER_IMAGE_HOSTS'), 'remote source and image hosts must remain allowlisted');
assert(bankWorker.includes('/git/blobs') && bankWorker.includes('/git/trees') && bankWorker.includes('/git/commits') && bankWorker.includes('/git/refs/heads/'), 'GitHub publication must remain one Git-data commit flow');
assert(bankWorker.includes('force: false'), 'branch update must reject non-fast-forward publication races');
assert(bankWorker.includes('CHAPTER_HISTORY_PATH') && bankWorker.includes('serializeGeneratedHistory'), 'publication must write Chapter Bank history in the same tree');
assert(bankWorker.includes('/api/admin/chapter/bank') && bankWorker.includes('handleBank(request, env)'), 'Chapter Bank list and detail endpoints are missing');
assert(bankHelpers.includes('checksumBytes') && bankHelpers.includes('createChapterPageRecord') && bankHelpers.includes('buildChapterBank'), 'Chapter Bank metadata helpers are incomplete');
assert(adminPage.includes('/api/admin/chapter/login') && adminPage.includes('/api/admin/chapter/import') && adminPage.includes('/api/admin/chapter/bank'), 'admin dashboard must use authenticated Chapter Bank endpoints');
assert(adminPage.includes('Chapter Bank build 2026-07-23.2') && adminPage.includes('page.label'), 'admin dashboard build marker or page labels are missing');
assert(adminPage.includes("error.status!==405") && adminPage.includes("method:'GET'"), 'read-only inspection must retain the GET fallback');
assert(adminPage.includes("credentials:'same-origin'"), 'administrator requests must send the session cookie only to the same origin');
assert(adminPage.includes('returned the Hunter Archive webpage instead of the chapter-bank API response'), 'admin must explain SPA-fallback HTML responses');
assert(serverIndex.includes("from './chapter-admin-v2.js'"), 'Worker entry must mount the bank-aware backend');
assert(serverIndex.includes('normalizeInspectionGet') && serverIndex.includes('validateInspectionResponse'), 'Worker entry must normalize and validate inspection fallback');
assert(inspectContract.includes("requestUrl.pathname !== '/api/admin/chapter/inspect'") && inspectContract.includes('Array.isArray(payload.pages)'), 'browser inspection guard must validate the response shape');
assert(prepareHosting.includes("cp('server', 'dist/server', { recursive: true })"), 'hosting preparation must copy all Worker modules recursively');
assert(packageJson.includes('audit:chapter-bank') && packageJson.includes('rebuild:succession-bank'), 'Chapter Bank audit and rebuild commands must be registered');
assert(legacyWorker.includes('extractChapterImageUrls'), 'legacy parser exports must remain available to audits and maintenance commands');

console.log('Hosted Chapter Bank audit passed: authentication, CSRF, allowlisted 3asq fetches, page parsing, p.N identities, checksums, history, bank list/detail endpoints, atomic Git tree publication, SPA-fallback diagnostics, and recursive Worker packaging are intact.');
