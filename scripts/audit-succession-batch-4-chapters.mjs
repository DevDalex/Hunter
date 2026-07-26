import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 4 chapter audit failed: ${message}`);
};

const [workspace, styles, routeManifest, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveChapterStoryWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveChapterCommand.css'),
  read('src/data/routeManifest.js'),
  read('.github/workflows/succession-visual-redesign-batch-4.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4.md'),
]);

for (const token of [
  'chapterResearchState',
  'ChapterDirectoryCard',
  'succession-chapter-command__hero',
  'succession-chapter-command__status',
  'succession-chapter-command__controls',
  'succession-chapter-command__grid',
  'succession-chapter-command__index',
  'succession-chapter-command__rail',
  'succession-chapter-dossier__hero',
  'succession-chapter-dossier__phase',
  'succession-chapter-dossier__sequence',
  'succession-chapter-dossier__evidence',
  'Authorized knowledge boundary',
  'Reader media imported; maintained scene research pending',
  'Missing research is never replaced with an inferred scene summary',
]) assert(workspace.includes(token), `chapter workspace contract is missing ${token}`);

for (const selector of [
  '.succession-chapter-command__hero',
  '.succession-chapter-command__status',
  '.succession-chapter-command__controls',
  '.succession-chapter-command__card',
  '.succession-chapter-command__index',
  '.succession-chapter-command__rail',
  '.succession-chapter-dossier__hero',
  '.succession-chapter-dossier__phase',
  '.succession-chapter-dossier__sequence-grid',
  '.succession-chapter-dossier__evidence-board',
]) assert(styles.includes(selector), `chapter visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1100px)', '@media (max-width: 760px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `chapter CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'chapter controls must retain 44px touch targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'chapter CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'chapter CSS must not depend on !important');
assert(routeManifest.includes("'chapters'"), 'release visual manifest must include the chapters route');
assert(workflow.includes('node scripts/audit-succession-batch-4-chapters.mjs'), 'Batch 4 workflow must run the chapter audit');
assert(workflow.includes('succession/chapters'), 'Batch 4 workflow must render the chapter workspace');
for (const hour of ['Hour 37', 'Hour 38', 'Hour 39', 'Hour 40']) assert(docs.includes(hour), `Batch 4 design record must document ${hour}`);

console.log('Succession Batch 4 chapter audit passed: directory modes, research filters, identity stage, phase progress, event sequencing, evidence boundaries, responsive behavior, touch targets, and reduced motion are registered.');
