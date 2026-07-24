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
const detected = extractChapterImageUrls(wpHtml, 'https://3asq.online/manga/hunter-x-hunter/415/');
assert(detected.length === 3, 'WP Manga extraction must reject comment/avatar media');
assert(detected[0].endsWith('/01.jpg') && detected[1].endsWith('/02.jpg') && detected[2].endsWith('/10.jpg'), 'detected chapter pages must use natural numeric order');
assert(inferChapterNumber('https://3asq.online/manga/hunter-x-hunter/415/') === 415, 'future chapter number inference changed');

const png = new Uint8Array(24);
png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
new DataView(png.buffer).setUint32(16, 1200, false);
new DataView(png.buffer).setUint32(20, 1800, false);
const pngRecord = detectImage(png, 'image/png', 'https://3asq.online/01.png');
assert(pngRecord.extension === '.png' && pngRecord.width === 1200 && pngRecord.height === 1800, 'PNG signature and dimension validation changed');

const manifest = { 415: [{ page: 1, src: '/media/succession-contest/chapters/415/001.png', width: 1200, height: 1800 }] };
const serialized = serializeGeneratedManifest(manifest);
assert(JSON.stringify(parseGeneratedManifest(serialized)) === JSON.stringify(manifest), 'generated manifest serialization must round-trip');

const [
  engine,
  direct,
  serverIndex,
  directPage,
  inspectContract,
  workflow,
  batchWorkflow,
  batchScript,
  batchQueueText,
  importScript,
  localImportScript,
  readerSource,
  researchSource,
  availabilitySource,
  prepareHosting,
  packageJson,
] = await Promise.all([
  read('server/chapter-admin.js'),
  read('server/direct-chapter-import.js'),
  read('server/index.js'),
  read('public/admin/chapters/direct.html'),
  read('public/admin/chapters/inspect-contract.js'),
  read('.github/workflows/import-chapter-dispatch.yml'),
  read('.github/workflows/import-chapter-batch.yml'),
  read('scripts/run-succession-chapter-batch.mjs'),
  read('.github/chapter-import-batch.json'),
  read('scripts/import-succession-chapter-url.mjs'),
  read('scripts/import-succession-chapter.mjs'),
  read('src/data/successionChapterReader.js'),
  read('src/data/succession/successionResearch.js'),
  read('src/data/successionChapterAvailability.generated.js'),
  read('scripts/prepare-hosting.mjs'),
  read('package.json'),
]);
const batchQueue = JSON.parse(batchQueueText);

assert(direct.includes('TEMPORARY_SESSION_KEY'), 'inspection, preview and submit must use a short-lived built-in session');
assert(direct.includes('prepareSelectedImport') && direct.includes('selectedImageUrls'), 'the submit route must validate the exact selected picture list');
assert(direct.includes("event_type: DISPATCH_EVENT") && direct.includes('/dispatches'), 'the Worker must queue a repository dispatch instead of downloading the chapter itself');
assert(direct.includes('MAX_DISPATCH_BODY_BYTES'), 'the queued request must remain within GitHub dispatch limits');
assert(direct.includes("request.method === 'POST' && url.pathname === IMPORT_PATH"), 'the direct import endpoint must remain enabled');
assert(direct.includes("'/api/admin/chapter/login'") && direct.includes('does not use account login'), 'legacy account endpoints must remain blocked');
assert(direct.includes("assetUrl.pathname = '/admin/chapters/direct.html'"), 'the direct route must serve the temporary import page');
assert(direct.includes('MAX_CHAPTER_NUMBER = 9999') && direct.includes('handleUnboundedInspection'), 'the hosted inspector must accept future chapter numbers beyond the old release boundary');
assert(direct.includes('.replace(\' max="414"\', \'\')'), 'the hosted form must remove the obsolete browser-side Chapter 414 maximum');
assert(!directPage.includes('type="password"') && !directPage.includes('GITHUB_ADMIN_TOKEN'), 'the page must not ask for credentials or configuration');
assert(directPage.includes('/api/admin/chapter/inspect') && directPage.includes("api('/api/admin/chapter/import'"), 'the page must inspect and submit through the Worker');
assert(directPage.includes('page-choice-') && directPage.includes('Select all') && directPage.includes('Clear selection'), 'the preview must support individual and bulk picture selection');
assert(directPage.includes('Submit import') && directPage.includes('selectedImageUrls'), 'the page must submit only selected pictures directly');
assert(directPage.includes('queued') && directPage.includes('background'), 'the page must explain that heavy importing runs asynchronously');
assert(!directPage.includes('ChatGPT') && !directPage.includes('issues/new') && !directPage.includes('Submit new issue'), 'the user must not leave the website to finish an import');
assert(workflow.includes('repository_dispatch') && workflow.includes('hunter-chapter-import'), 'the GitHub workflow must receive website import dispatches');
assert(workflow.includes('contents: write') && workflow.includes('selected_images'), 'the workflow must have commit permission and consume selected image URLs');
assert(workflow.includes('--image-list-file') && workflow.includes('git push origin HEAD:main'), 'the workflow must import the exact selected images and commit them to main');
assert(workflow.includes('maxChapterNumber = 9999') && workflow.includes('successionChapterAvailability.generated.js'), 'the dispatch workflow must accept and commit future chapter availability');
assert(workflow.includes('Mozilla/5.0'), 'the action must use a browser-like fetch profile for the source host');
const restoreIndex = workflow.indexOf('git restore --worktree scripts/lib/succession-chapter-url-source.mjs');
const rebaseIndex = workflow.indexOf('git pull --rebase origin main');
assert(restoreIndex !== -1 && rebaseIndex !== -1 && restoreIndex < rebaseIndex, 'the runtime user-agent edit must be restored before the commit step rebases main');

assert(batchQueue.version === 1 && String(batchQueue.sourceTemplate).includes('{chapter}'), 'the automatic queue contract is invalid');
assert(Number.isInteger(batchQueue.batchSize) && batchQueue.batchSize >= 1 && batchQueue.batchSize <= 5, 'the automatic batch size must stay bounded');
assert(Number.isInteger(batchQueue.maxAttempts) && batchQueue.maxAttempts >= 1 && batchQueue.maxAttempts <= 5, 'the automatic retry limit must stay bounded');
assert(Array.isArray(batchQueue.pending) && Array.isArray(batchQueue.completed), 'the automatic queue must track pending and completed chapters');
assert(batchQueue.pending.every((chapter) => Number.isInteger(chapter) && chapter >= 338 && chapter <= 9999), 'the automatic queue contains an invalid chapter');
assert(batchWorkflow.includes('hunter-chapter-batch-continue') && batchWorkflow.includes('group: chapter-import'), 'the automatic workflow must self-continue while sharing the manual import lock');
assert(batchWorkflow.includes('github.actor != \'github-actions[bot]\''), 'action-authored queue commits must not start duplicate push runs');
assert(batchWorkflow.includes('restore_helper') && batchWorkflow.indexOf('restore_helper') < batchWorkflow.indexOf('git pull --rebase origin main'), 'the automatic workflow must restore its runtime helper edit before rebasing');
assert(batchWorkflow.includes('/dispatches') && batchWorkflow.includes("steps.batch.outputs.continue == 'true'"), 'the automatic workflow must dispatch the next batch only while work remains');
assert(batchScript.includes('maxAttempts') && batchScript.includes('queued for retry'), 'the automatic runner must retry temporary chapter failures');
assert(batchScript.includes('writeFile(MANIFEST_PATH, beforeManifest)') && batchScript.includes('rm(chapterDirectory'), 'failed automatic imports must roll back their manifest and chapter folder');
assert(batchScript.includes('MIN_PAGES') && batchScript.includes('MAX_PAGES'), 'automatic imports must enforce a conservative page-count sanity range');
assert(batchScript.includes("writeOutput('continue'") && batchScript.includes("writeOutput('remaining'"), 'the automatic runner must expose continuation state to GitHub Actions');

assert(importScript.includes("'--image-list-file'") && importScript.includes('readSelectedImageUrls'), 'the URL importer must accept an ordered selected-image JSON file');
assert(importScript.includes('MAX_CHAPTER_NUMBER = 9999'), 'the URL importer must not retain a release-specific maximum');
assert(localImportScript.includes('AVAILABILITY_PATH') && localImportScript.includes('LATEST_AUTHORIZED_SUCCESSION_CHAPTER'), 'the local importer must regenerate chapter availability with the media manifest');
assert(readerSource.includes('LATEST_AUTHORIZED_SUCCESSION_CHAPTER'), 'the reader boundary must derive from generated chapter availability');
assert(researchSource.includes('authorizedSuccessionChapterNumbers') && researchSource.includes('pendingImportedResearch'), 'Chapter Records must auto-index newly imported chapters without inventing scene detail');
assert(availabilitySource.includes('authorizedSuccessionChapterNumbers') && availabilitySource.includes('LATEST_AUTHORIZED_SUCCESSION_CHAPTER'), 'generated availability contract is missing');
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

console.log('Hosted chapter importer audit passed: Chapter 415 and future releases can be inspected, selected, queued, imported, indexed in reader availability, and represented as pending Chapter Records without a release-specific ceiling.');
