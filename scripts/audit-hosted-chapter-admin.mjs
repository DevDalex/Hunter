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

const [engine, direct, serverIndex, directPage, inspectContract, workflow, importScript, prepareHosting, packageJson] = await Promise.all([
  read('server/chapter-admin.js'),
  read('server/direct-chapter-import.js'),
  read('server/index.js'),
  read('public/admin/chapters/direct.html'),
  read('public/admin/chapters/inspect-contract.js'),
  read('.github/workflows/import-chapter-dispatch.yml'),
  read('scripts/import-succession-chapter-url.mjs'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);

assert(direct.includes('TEMPORARY_SESSION_KEY'), 'inspection, preview and submit must use a short-lived built-in session');
assert(direct.includes('prepareSelectedImport') && direct.includes('selectedImageUrls'), 'the submit route must validate the exact selected picture list');
assert(direct.includes("event_type: DISPATCH_EVENT") && direct.includes('/dispatches'), 'the Worker must queue a repository dispatch instead of downloading the chapter itself');
assert(direct.includes('MAX_DISPATCH_BODY_BYTES'), 'the queued request must remain within GitHub dispatch limits');
assert(direct.includes("request.method === 'POST' && url.pathname === IMPORT_PATH"), 'the direct import endpoint must remain enabled');
assert(direct.includes("'/api/admin/chapter/login'") && direct.includes('does not use account login'), 'legacy account endpoints must remain blocked');
assert(direct.includes("assetUrl.pathname = '/admin/chapters/direct.html'"), 'the direct route must serve the temporary import page');
assert(!directPage.includes('type="password"') && !directPage.includes('GITHUB_ADMIN_TOKEN'), 'the page must not ask for credentials or configuration');
assert(directPage.includes('/api/admin/chapter/inspect') && directPage.includes("api('/api/admin/chapter/import'"), 'the page must inspect and submit through the Worker');
assert(directPage.includes('page-choice-') && directPage.includes('Select all') && directPage.includes('Clear selection'), 'the preview must support individual and bulk picture selection');
assert(directPage.includes('Submit import') && directPage.includes('selectedImageUrls'), 'the page must submit only selected pictures directly');
assert(directPage.includes('queued') && directPage.includes('background'), 'the page must explain that heavy importing runs asynchronously');
assert(!directPage.includes('ChatGPT') && !directPage.includes('issues/new') && !directPage.includes('Submit new issue'), 'the user must not leave the website to finish an import');
assert(workflow.includes('repository_dispatch') && workflow.includes('hunter-chapter-import'), 'the GitHub workflow must receive website import dispatches');
assert(workflow.includes('contents: write') && workflow.includes('selected_images'), 'the workflow must have commit permission and consume selected image URLs');
assert(workflow.includes('--image-list-file') && workflow.includes('git push origin HEAD:main'), 'the workflow must import the exact selected images and commit them to main');
assert(workflow.includes('Mozilla/5.0'), 'the action must use a browser-like fetch profile for the source host');
assert(importScript.includes("'--image-list-file'") && importScript.includes('readSelectedImageUrls'), 'the local importer must accept an ordered selected-image JSON file');
assert(engine.includes('CHAPTER_SOURCE_HOSTS') && engine.includes('CHAPTER_IMAGE_HOSTS'), 'remote source and image hosts must remain allowlisted');
assert(serverIndex.includes("from './direct-chapter-import.js'"), 'the Worker entry must route through the temporary importer');
assert(directPage.includes("credentials:'same-origin'"), 'importer requests must stay on the same origin');
assert(serverIndex.includes('normalizeInspectionGet') && serverIndex.includes('validateInspectionResponse'), 'Worker entry must normalize and validate the GET inspection fallback');
assert(serverIndex.includes('Array.isArray(payload.pages)'), 'Worker must reject successful inspection responses without a pages array');
assert(serverIndex.includes('/admin/chapters/inspect-contract.js'), 'temporary import HTML must load the browser-side inspection contract guard');
assert(inspectContract.includes("requestUrl.pathname !== '/api/admin/chapter/inspect'") && inspectContract.includes('Array.isArray(payload.pages)'), 'browser inspection guard must validate the API response shape');
assert(inspectContract.includes('rewritten to a webpage'), 'browser inspection guard must explain an HTML route rewrite');
assert(prepareHosting.includes("cp('server', 'dist/server', { recursive: true })"), 'hosting preparation must copy Worker modules recursively');
assert(prepareHosting.includes('Mozilla/5.0') && prepareHosting.includes('Hosted chapter admin fetch profile marker is missing.'), 'deployed inspection must use the guarded browser request profile');
assert(packageJson.includes('audit:hosted-admin'), 'hosted importer audit must remain registered in package scripts');

console.log('Hosted chapter importer audit passed: one-button submission, exact picture selection, lightweight Worker dispatch, background GitHub importing, manifest updates, and blocked legacy login endpoints are intact.');
