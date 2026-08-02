import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readJson = async (relativePath) => JSON.parse(await readFile(path.join(root, relativePath), 'utf8'));
const fail = (message) => { throw new Error(message); };
const expect = (condition, message) => { if (!condition) fail(message); };

const paths = {
  summary: 'public/phase7/black-whale-3d-corpus-summary-342-415.json',
  census: 'public/phase7/black-whale-3d-source-census-342-415.json',
  atomsA: 'public/phase7/black-whale-3d-evidence-atoms-342-415-a.json',
  atomsB: 'public/phase7/black-whale-3d-evidence-atoms-342-415-b.json',
  locations: 'public/phase7/black-whale-3d-location-registry-342-415.json',
  visuals: 'public/phase7/black-whale-3d-visual-index-342-415.json',
  contradictions: 'public/phase7/black-whale-3d-contradictions-342-415.json',
  loader: 'public/succession/black-whale-3d/data-loader.js',
  app: 'public/succession/black-whale-3d/app.js',
  page: 'public/succession/black-whale-3d/index.html',
};

await Promise.all(Object.values(paths).map((file) => access(path.join(root, file))));

const [summary, census, atomsA, atomsB, locations, visuals, contradictions] = await Promise.all([
  readJson(paths.summary),
  readJson(paths.census),
  readJson(paths.atomsA),
  readJson(paths.atomsB),
  readJson(paths.locations),
  readJson(paths.visuals),
  readJson(paths.contradictions),
]);
const atoms = [...atomsA, ...atomsB];

expect(summary.schemaVersion === '7.1B.0', 'Unexpected Phase 7.1B schema version.');
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
expect(summary.status.phase72 === 'blocked', 'Phase 7.2 must remain blocked.');
expect(summary.status.productionGeometryPercent === 0, 'Production geometry must remain at zero.');
expect(summary.status.programmePercent === null, 'A precise programme percentage must remain withdrawn while 7.1B is open.');
expect(summary.completionPolicy.researchComplete === false, 'The first exhaustive pass must not claim research completion.');
expect(summary.completionPolicy.phase72MayStart === false, 'Phase 7.2 must not be authorized.');

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
  expect(record.chapterUrl === null && record.imageCategoryUrl === null, `Unreleased Chapter ${record.chapter} must not invent source URLs.`);
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
expect(app.includes('Phase 7.1B'), 'Dashboard does not visibly identify Phase 7.1B.');
expect(app.includes('Phase 7.2 remains blocked'), 'Dashboard does not state the Phase 7.2 block.');
expect(page.includes('href="#corpus"'), 'Dashboard navigation does not link to the corpus section.');

console.log(
  `Black Whale Phase 7.1B corpus audit passed: ${census.length} chapter slots, `
  + `${released.length} released chapters reviewed, ${atoms.length} evidence atoms, `
  + `${locations.length} nodes/routes, ${visuals.length} visual records, and Phase 7.2 blocked.`,
);
