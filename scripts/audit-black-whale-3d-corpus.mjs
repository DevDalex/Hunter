import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };

const paths = {
  summary: 'public/phase7/black-whale-3d-corpus-summary-342-415.json',
  corpusManifest: 'public/phase7/black-whale-3d-corpus-manifest-342-415.json',
  locations: 'public/phase7/black-whale-3d-location-registry-342-415.json',
  contradictions: 'public/phase7/black-whale-3d-contradictions-342-415.json',
  loader: 'public/succession/black-whale-3d/data-loader.js',
  app: 'public/succession/black-whale-3d/app.js',
  page: 'public/succession/black-whale-3d/index.html',
};

await Promise.all(Object.values(paths).map((file) => access(path.join(root, file))));

const [summary, corpusManifest, locations, contradictions] = await Promise.all([
  readJson(paths.summary),
  readJson(paths.corpusManifest),
  readJson(paths.locations),
  readJson(paths.contradictions),
]);
const readPublicJson = (url) => readJson(`public${url}`);
const readGzipBase64Json = async (url) => JSON.parse(gunzipSync(Buffer.from((await readFile(path.join(root, `public${url}`), 'utf8')).trim(), 'base64')).toString('utf8'));
const [censusParts, atomParts, atomRest, visuals] = await Promise.all([
  Promise.all(corpusManifest.sourceCensus.map(readPublicJson)),
  Promise.all(corpusManifest.evidenceAtomJson.map(readPublicJson)),
  readGzipBase64Json(corpusManifest.evidenceAtomGzipBase64),
  readGzipBase64Json(corpusManifest.visualIndexGzipBase64),
]);
const census = censusParts.flat();
const atoms = [...atomParts.flat(), ...atomRest];

expect(summary.schemaVersion === '7.1B.2', 'Unexpected Phase 7.1B schema version.');
expect(summary.scope.requestedStartChapter === 342, 'Corpus must start at Chapter 342.');
expect(summary.scope.requestedEndChapter === 415, 'Corpus must end at Chapter 415.');
expect(census.length === 74, `Expected 74 chapter slots, found ${census.length}.`);
expect(atoms.length === 190, `Expected 190 evidence atoms, found ${atoms.length}.`);
expect(locations.length === 79, `Expected 79 location/route records, found ${locations.length}.`);
expect(visuals.length === 67, `Expected 67 visual discovery records, found ${visuals.length}.`);

const expectedChapters = Array.from({ length: 74 }, (_, index) => 342 + index);
expect(census.every((record, index) => record.chapter === expectedChapters[index]), 'Chapter census is not contiguous from 342 through 415.');

const released = census.filter((record) => record.releaseStatus === 'released');
expect(released.length === 70, `Expected 70 released chapter records, found ${released.length}.`);
expect(released[0]?.chapter === 342 && released.at(-1)?.chapter === 411, 'Released chapter coverage must span 342–411.');

const unavailable = census.filter((record) => record.reviewStatus === 'requested-slot-checked-no-canon-source').map((record) => record.chapter);
expect(JSON.stringify(unavailable) === JSON.stringify([412, 413, 414, 415]), `Unexpected unavailable chapter slots: ${unavailable.join(', ')}.`);

// These values intentionally preserve the historical Phase 7.1B first-pass state.
// They are not the authority for the current live programme after 7.1C and 7.2.
expect(summary.status.phase72 === 'blocked', 'Frozen Phase 7.1B summary must preserve its original Phase 7.2 block.');
expect(summary.status.productionGeometryPercent === 0, 'Frozen Phase 7.1B summary must preserve its original geometry baseline.');
expect(summary.status.programmePercent === null, 'A precise programme percentage must remain withdrawn in the frozen 7.1B summary.');
expect(summary.completionPolicy.researchComplete === false, 'The frozen first exhaustive pass must not claim later research completion.');
expect(summary.completionPolicy.phase72MayStart === false, 'The frozen first-pass summary must preserve its original Phase 7.2 gate.');

const approvedHosts = new Set(['hunterxhunter.fandom.com', 'static.wikia.nocookie.net']);
const assertApprovedUrl = (url, label) => {
  if (!url) return;
  const parsed = new URL(url);
  expect(approvedHosts.has(parsed.hostname), `${label} uses prohibited host ${parsed.hostname}.`);
};

for (const record of released) {
  assertApprovedUrl(record.chapterUrl, `Chapter ${record.chapter}`);
  assertApprovedUrl(record.imageCategoryUrl, `Chapter ${record.chapter} image category`);
}
for (const record of census.filter((entry) => entry.chapter >= 412)) {
  expect(record.chapterUrl === null && record.imageCategoryUrl === null, `Legacy Chapter ${record.chapter} slot must not invent article-level source URLs.`);
}

const atomIds = new Set();
const locationIds = new Set(locations.map((location) => location.id));
const certaintyLevels = new Set([
  'c1-confirmed',
  'c2-strong-reconstruction',
  'c3-functional-reconstruction',
  'c4-speculative-visualization',
  'c5-unknown',
]);
for (const atom of atoms) {
  expect(!atomIds.has(atom.id), `Duplicate evidence atom ${atom.id}.`);
  atomIds.add(atom.id);
  expect(certaintyLevels.has(atom.certainty), `Invalid certainty ${atom.certainty} on ${atom.id}.`);
  expect(atom.claim && atom.claim.length >= 12, `Evidence atom ${atom.id} has no usable claim.`);
  atom.hunterpediaSources.forEach((url) => assertApprovedUrl(url, atom.id));
  atom.locationIds.forEach((id) => expect(locationIds.has(id), `${atom.id} references unknown location ${id}.`));
}
expect(atomIds.size === atoms.length, 'Evidence atom IDs are not unique.');

for (const location of locations) {
  expect(location.id.startsWith('bw3d.node.') || location.id.startsWith('bw3d.route.'), `Invalid location ID ${location.id}.`);
  location.atomIds.forEach((id) => expect(atomIds.has(id), `${location.id} references unknown atom ${id}.`));
}

for (const visual of visuals) {
  assertApprovedUrl(visual.sourcePage, visual.id);
  expect(visual.storagePolicy.includes('metadata-only'), `${visual.id} violates metadata-only scan storage.`);
}
expect(visuals.filter((visual) => visual.captureStatus === 'exact-filename-catalogued').length === 14, 'Expected fourteen exact visual filenames.');
expect(contradictions.length === 9, `Expected nine contradiction/correction records, found ${contradictions.length}.`);
expect(contradictions.some((record) => record.statement.includes('burial chamber')), 'Burial chamber contradiction is missing.');
expect(contradictions.some((record) => record.statement.includes('Room 3101')), 'Room 3101 correction is missing.');

const [loader, app, page] = await Promise.all([
  readFile(path.join(root, paths.loader), 'utf8'),
  readFile(path.join(root, paths.app), 'utf8'),
  readFile(path.join(root, paths.page), 'utf8'),
]);
for (const requiredPath of Object.values(summary.files)) {
  expect(loader.includes(requiredPath), `Dashboard loader does not register ${requiredPath}.`);
}
expect(app.includes('Phase 7.1B / 7.1C · Complete'), 'Dashboard does not visibly preserve and contextualize Phase 7.1B.');
expect(app.includes('The spatial graph is no longer blocked'), 'Dashboard does not state the current post-7.1C spatial-graph status.');
expect(loader.includes("id: '7.2'") && loader.includes("title: 'Spatial graph'"), 'Live roadmap does not retain Phase 7.2.');
expect(loader.includes("activeStage: '7.3R'"), 'Live programme stage is not current.');
expect(page.includes('href="#corpus"'), 'Dashboard navigation does not link to the corpus section.');

console.log(
  `Black Whale Phase 7.1B corpus audit passed: ${census.length} frozen chapter slots, `
  + `${released.length} article-level released chapters reviewed, ${atoms.length} evidence atoms, `
  + `${locations.length} nodes/routes and ${visuals.length} visual records; historical first-pass state preserved while the live dashboard correctly reflects the completed 7.1C/7.2 handoff.`,
);
