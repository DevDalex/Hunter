import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readText = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const readJson = async (relativePath) => JSON.parse(await readText(relativePath));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const paths = {
  page: 'public/succession/black-whale-3d/index.html',
  styles: 'public/succession/black-whale-3d/styles.css',
  loader: 'public/succession/black-whale-3d/data-loader.js',
  app: 'public/succession/black-whale-3d/app.js',
  charter: 'public/phase7/black-whale-3d-charter.json',
  analysis: 'public/phase7/black-whale-3d-analysis.json',
  referencesA: 'public/phase7/black-whale-3d-references-a.json',
  referencesB: 'public/phase7/black-whale-3d-references-b.json',
  bridge: 'public/assets/bw3d-route-bridge.js',
  index: 'index.html',
  worker: 'server/index.js',
};

await Promise.all(Object.values(paths).map((relativePath) => access(path.join(root, relativePath))));

const [page, loader, app, bridge, index, worker, charter, analysis, referencesA, referencesB] = await Promise.all([
  readText(paths.page),
  readText(paths.loader),
  readText(paths.app),
  readText(paths.bridge),
  readText(paths.index),
  readText(paths.worker),
  readJson(paths.charter),
  readJson(paths.analysis),
  readJson(paths.referencesA),
  readJson(paths.referencesB),
]);

assert(page.includes('<title>Black Whale 3D progress'), 'Phase 7 progress page title is missing.');
assert(page.indexOf('data-loader.js') < page.indexOf('app.js'), 'The split-data loader must run before the dashboard app.');
assert(loader.includes('blackWhale3dReferenceShots'), 'The data loader does not combine the reference ledger.');
assert(app.includes('Phase 7.2 · Spatial graph'), 'The dashboard does not expose the next production gate.');
assert(index.includes('/assets/bw3d-route-bridge.js'), 'The archive shell does not load the Phase 7 navigation bridge.');
assert(bridge.includes('/succession/black-whale-3d'), 'The navigation bridge targets the wrong URL.');
assert(worker.includes("'/succession/black-whale-3d'"), 'The Worker does not own the clean Phase 7 route.');
assert(worker.includes("'/succession/black-whale-3d/index.html'"), 'The Worker does not map the clean route to the static dashboard.');

assert(charter.blackWhale3dPrinciples?.length === 8, 'The charter must contain eight governing principles.');
assert(charter.blackWhale3dCertaintyLevels?.length === 5, 'The charter must contain five certainty levels.');
assert(charter.blackWhale3dAcceptanceGates?.length === 12, 'The charter must contain twelve acceptance gates.');
assert(analysis.blackWhale3dReferenceIssues?.length === 5, 'The reference programme must expose five issue records.');
assert(analysis.blackWhale3dReferenceGaps?.length === 12, 'The reference programme must expose twelve evidence gaps.');
assert(analysis.blackWhale3dArchitecturalMotifs?.length === 10, 'The reference programme must expose ten architectural motifs.');
assert(analysis.blackWhale3dRoadmap?.length === 13, 'The Phase 7 roadmap must contain thirteen stages.');
assert(analysis.blackWhale3dProgressStats?.completedStages === 2, 'The programme must report exactly two completed stages.');
assert(analysis.blackWhale3dProgressStats?.productionGeometryPercent === 0, 'Production geometry must remain at zero before Phase 7.2.');

const references = [...referencesA, ...referencesB];
assert(references.length === 38, `Expected 38 source-shot records, found ${references.length}.`);
const ids = new Set(references.map((record) => record.id));
assert(ids.size === references.length, 'Reference-shot IDs are not unique.');
assert(references.filter((record) => record.sourceGranularity === 'exact-file').length === 37, 'Expected 37 exact file-level references.');
assert(references.filter((record) => record.provenanceStatus === 'verified-subject-pending-exact-file-url').length === 1, 'Expected one pending exact file-level source.');
assert(references.filter((record) => record.modelingDecision === 'quarantined-from-tier-placement').length === 1, 'Expected one tier-placement quarantine.');

for (const record of references) {
  assert(/^bw3d\.ref\.\d{3}$/.test(record.id), `Invalid reference ID: ${record.id}`);
  assert(record.articleSource.startsWith('https://hunterxhunter.fandom.com/'), `${record.id} has an unapproved article source.`);
  assert(
    record.imageSource.startsWith('https://hunterxhunter.fandom.com/')
      || record.imageSource.startsWith('https://static.wikia.nocookie.net/'),
    `${record.id} has an unapproved image source.`,
  );
  assert(Array.isArray(record.geometrySignals) && record.geometrySignals.length, `${record.id} has no geometry signals.`);
  assert(Array.isArray(record.permittedUses) && record.permittedUses.length, `${record.id} has no permitted uses.`);
  assert(Array.isArray(record.limitations) && record.limitations.length, `${record.id} has no limitations.`);
  const localPath = path.join(root, 'public', record.localPath.replace(/^\//, ''));
  await access(localPath);
}

console.log('Black Whale 3D progress audit passed: clean route, charter, 38-shot ledger, issues, gaps, motifs, roadmap, bridge, and local media verified.');
