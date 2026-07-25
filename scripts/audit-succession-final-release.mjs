import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession final release audit failed: ${message}`);
};
const exists = (relative) => access(path.join(root, relative)).then(() => true, () => false);

for (const artifact of ['dist/client/index.html', 'dist/client/.vite/manifest.json']) {
  assert(await exists(artifact), `missing production artifact ${artifact}`);
}

const manifest = JSON.parse(await readFile(path.join(root, 'dist/client/.vite/manifest.json'), 'utf8'));
const entry = Object.values(manifest).find((record) => record.isEntry && /src\/main\.jsx$/.test(record.src || ''));
assert(entry?.file, 'Vite manifest must retain the main client entry');
assert(await exists(path.join('dist/client', entry.file)), `main client bundle ${entry.file} is missing`);

const assetDir = path.join(root, 'dist/client/assets');
const assetFiles = (await readdir(assetDir)).filter((file) => file.endsWith('.js'));
assert(assetFiles.length > 0, 'production output must contain JavaScript assets');
const bundleText = (await Promise.all(assetFiles.map((file) => readFile(path.join(assetDir, file), 'utf8')))).join('\n');
for (const signature of [
  'Glossary terms connected to the archive graph',
  'Visuals with canonical subjects and provenance',
  'Search every canonical domain available through Chapter',
  'release-candidate',
]) assert(bundleText.includes(signature), `production bundles are missing the Batch 5 signature: ${signature}`);

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const report = archive.getFinalReleaseClosureReport();
  assert(report?.closureReady && report.status === 'release-candidate', 'source runtime must remain a release candidate after production build');
  assert(report.batches.finalProductClosure.status === 'release-candidate', 'Batch 5 product closure must remain a release candidate');
  assert(report.batches.foundation.status === 'closed', 'Batch 1 foundation must remain closed');
  assert(report.batches.peopleAndInstitutions.status === 'closed', 'Batch 2 people and institutions must remain closed');
  assert(report.batches.nenAndRitualSystems.status === 'closed', 'Batch 3 Nen systems must remain closed');
  assert(report.batches.chapterAndStoryIntelligence.status === 'closed', 'Batch 4 Story Intelligence must remain closed');
  assert(report.releaseGates.performanceBuild === 'pending-external-build-result', 'source report must not falsely claim an externally observed performance result');

  console.log(`Succession final release audit passed: ${assetFiles.length} production JavaScript assets retain Search, Glossary, Media, and release-candidate signatures; Batches 1–4 remain closed and Batch 5 remains deployment-ready.`);
} finally {
  await vite.close();
}
