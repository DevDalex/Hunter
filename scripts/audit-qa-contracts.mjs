import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const scriptsRoot = path.join(root, 'scripts');
const workflowsRoot = path.join(root, '.github/workflows');
const assert = (condition, message) => {
  if (!condition) throw new Error(`QA contract audit failed: ${message}`);
};

const collectFiles = async (directory, extension) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(absolute, extension));
    else if (entry.name.endsWith(extension)) files.push(absolute);
  }
  return files;
};

const scriptFiles = (await collectFiles(scriptsRoot, '.mjs'))
  .filter((file) => path.basename(file) !== 'audit-qa-contracts.mjs');
const workflowFiles = await collectFiles(workflowsRoot, '.yml');
const scriptSources = await Promise.all(scriptFiles.map(async (file) => ({
  file: path.relative(root, file),
  source: await readFile(file, 'utf8'),
})));
const workflowSources = await Promise.all(workflowFiles.map(async (file) => ({
  file: path.relative(root, file),
  source: await readFile(file, 'utf8'),
})));

const routeManifestLiteralCheck = ['routeManifest', '.includes('].join('');
const retiredSearchDialog = ['archive-search', '-dialog'].join('');
const retiredChapterRow = ['chapter', '-row'].join('');
const retiredChapterDrawer = ['chapter', '-drawer'].join('');
const obsoleteAssetCommand = ['prepare:', 'eta-assets'].join('');

for (const { file, source } of scriptSources) {
  assert(!source.includes(routeManifestLiteralCheck), `${file} scrapes generated routeManifest source instead of importing the canonical registry`);
  assert(!source.includes(retiredSearchDialog), `${file} still targets the retired search modal`);
  assert(!source.includes(retiredChapterRow), `${file} still targets the retired chapter-row interface`);
  assert(!source.includes(retiredChapterDrawer), `${file} still targets the retired chapter drawer`);
}
for (const { file, source } of workflowSources) {
  assert(!source.includes(obsoleteAssetCommand), `${file} calls the removed asset-preparation command`);
}

const cloudflareWorkflow = await readFile(path.join(workflowsRoot, 'cloudflare-build.yml'), 'utf8');
assert(/push:\s*\n\s*branches:\s*\[[^\]]*main[^\]]*dev[^\]]*\]/m.test(cloudflareWorkflow), 'Cloudflare full-stack verification must run on main and dev pushes');

const accessibilityQa = await readFile(path.join(scriptsRoot, 'accessibility-qa.mjs'), 'utf8');
for (const token of [
  '.succession-archive[data-archive-route="search"]',
  '.succession-search-workspace input',
  '.succession-chapter-command__card',
]) assert(accessibilityQa.includes(token), `accessibility QA is missing canonical routed selector ${token}`);

const searchQa = await readFile(path.join(scriptsRoot, 'search-qa.mjs'), 'utf8');
for (const token of [
  '.succession-archive[data-archive-route="search"]',
  '.succession-search-workspace input',
  '.succession-search-complete__groups article',
]) assert(searchQa.includes(token), `search QA is missing canonical routed selector ${token}`);

const canonicalRouteAuditFiles = [
  'audit-succession-batch-3-closure.mjs',
  'audit-succession-batch-4-chapters.mjs',
  'audit-succession-batch-4-story.mjs',
  'audit-succession-batch-4-events.mjs',
  'audit-succession-batch-4-nen.mjs',
  'audit-succession-batch-4-nen-release.mjs',
  'audit-succession-batch-4-guardian-beasts.mjs',
  'audit-succession-batch-4-spatial.mjs',
  'audit-succession-batch-5-timeline.mjs',
  'audit-succession-batch-5-relationships.mjs',
  'audit-succession-batch-5-black-whale.mjs',
  'audit-succession-batch-5-assignments.mjs',
  'audit-succession-batch-5-final.mjs',
];
for (const filename of canonicalRouteAuditFiles) {
  const source = await readFile(path.join(scriptsRoot, filename), 'utf8');
  assert(source.includes("from './lib/release-route-contracts.mjs'"), `${filename} must use the canonical release-route helper`);
}

console.log(`QA contract audit passed: ${scriptFiles.length} scripts and ${workflowFiles.length} workflows are free of retired selector, generated-manifest, obsolete-command, and production-trigger drift.`);
