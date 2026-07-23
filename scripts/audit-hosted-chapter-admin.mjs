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
  read('.github/workflows/import-chapter-from-request.yml'),
  read('scripts/import-succession-chapter-url.mjs'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);

assert(direct.includes('TEMPORARY_PREVIEW_KEY'), 'inspection and previews must use the built-in temporary preview key');
assert(!direct.includes('env.GITHUB_ADMIN_TOKEN'), 'the hosted importer boundary must not require a configured GitHub token');
assert(direct.includes("url.pathname === IMPORT_PATH") && direct.includes('Direct Worker publishing was removed'), 'the retired Worker publishing endpoint must remain blocked');
assert(direct.includes("'/api/admin/chapter/login'") && direct.includes('does not use account login'), 'legacy account endpoints must remain blocked');
assert(direct.includes("assetUrl.pathname = '/admin/chapters/direct.html'"), 'the direct route must serve the temporary import page');
assert(!directPage.includes('type="password"') && !directPage.includes('GITHUB_ADMIN_TOKEN'), 'the temporary page must not ask for credentials or configuration');
assert(directPage.includes('/api/admin/chapter/inspect') && !directPage.includes("api('/api/admin/chapter/import'"), 'the page must inspect through the Worker but never publish through it');
assert(directPage.includes('page-choice-') && directPage.includes('Select all') && directPage.includes('Clear selection'), 'the preview must support individual picture selection and bulk selection controls');
assert(directPage.includes('Copy request for ChatGPT') && directPage.includes('HUNTER_CHAPTER_IMPORT_REQUEST_V2'), 'the page must generate a request intended for this ChatGPT conversation');
assert(directPage.includes('selected_images_begin') && directPage.includes('selected_images_end'), 'the generated request must carry the exact selected image URLs in displayed order');
assert(!directPage.includes('issues/new') && !directPage.includes('Submit new issue'), 'the user must not be sent to GitHub to submit the import request');
assert(workflow.includes('issues:') && workflow.includes('contents: write') && workflow.includes('github.repository_owner'), 'the import workflow must be owner-only and use GitHub built-in repository permission');
assert(workflow.includes('HUNTER_CHAPTER_IMPORT_REQUEST_V2') && workflow.includes('selected_images_begin'), 'the workflow must parse the selected-picture request format');
assert(workflow.includes('.chapter-import-selected-images.json') && workflow.includes('--image-list-file'), 'the workflow must pass only selected image URLs to the importer');
assert(workflow.includes('git push origin HEAD:main'), 'the workflow must commit imported pictures to main');
assert(!workflow.includes('GITHUB_ADMIN_TOKEN'), 'the GitHub Actions importer must not require a custom token secret');
assert(importScript.includes("'--image-list-file'") && importScript.includes('readSelectedImageUrls'), 'the local importer must accept an ordered selected-image JSON file');
assert(importScript.includes('new Set(normalized).size') && importScript.includes('inspection.imageUrls'), 'selected image URLs must be validated and imported in supplied order');
assert(serverIndex.includes("from './direct-chapter-import.js'"), 'the Worker entry must route through the temporary importer');
assert(engine.includes('CHAPTER_SOURCE_HOSTS') && engine.includes('CHAPTER_IMAGE_HOSTS'), 'remote source and image hosts must remain allowlisted');
assert(directPage.includes("credentials:'same-origin'"), 'inspection requests must stay on the same origin');
assert(serverIndex.includes('normalizeInspectionGet') && serverIndex.includes('validateInspectionResponse'), 'Worker entry must normalize and validate the GET inspection fallback');
assert(serverIndex.includes('Array.isArray(payload.pages)'), 'Worker must reject successful inspection responses without a pages array');
assert(serverIndex.includes('/admin/chapters/inspect-contract.js'), 'temporary import HTML must load the browser-side inspection contract guard');
assert(inspectContract.includes("requestUrl.pathname !== '/api/admin/chapter/inspect'") && inspectContract.includes('Array.isArray(payload.pages)'), 'browser inspection guard must validate the API response shape');
assert(inspectContract.includes('rewritten to a webpage'), 'browser inspection guard must explain an HTML route rewrite');
assert(prepareHosting.includes("cp('server', 'dist/server', { recursive: true })"), 'hosting preparation must copy Worker modules recursively');
assert(prepareHosting.includes('Mozilla/5.0') && prepareHosting.includes('Hosted chapter admin fetch profile marker is missing.'), 'deployed inspection must use the guarded browser request profile');
assert(packageJson.includes('audit:hosted-admin'), 'hosted importer audit must remain registered in package scripts');

console.log('Hosted chapter importer audit passed: token-free inspection, per-picture selection, ChatGPT handoff, exact ordered image import, owner-only GitHub workflow, manifest updates, and blocked legacy account/Worker publishing endpoints are intact.');
