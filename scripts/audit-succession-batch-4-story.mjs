import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Batch 4 Story audit failed: ${message}`);
};

const [workspace, styles, workflow, docs, routeManifest] = await Promise.all([
  read('src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveStoryCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-4.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4.md'),
  read('src/data/routeManifest.js'),
]);

for (const token of [
  'succession-story-command__hero',
  'succession-story-command__metrics',
  'succession-story-command__phases',
  'succession-story-command__phase-grid',
  'succession-story-command__lanes',
  'succession-story-command__swimlanes',
  'succession-story-command__lane-track',
  'succession-story-command__threads',
  'succession-story-command__thread-grid',
  'succession-story-command__causal',
  'succession-story-command__causal-river',
  'succession-story-command-dossier',
  'Narrative intelligence command',
  'Imported media and maintained Story research remain separate',
]) assert(workspace.includes(token), `Story workspace contract is missing ${token}`);

for (const selector of [
  '.succession-story-command__hero',
  '.succession-story-command__metrics',
  '.succession-story-command__phase-grid',
  '.succession-story-command__swimlanes',
  '.succession-story-command__lane-track',
  '.succession-story-command-thread',
  '.succession-story-command__causal-river',
  '.succession-story-command-dossier__hero',
  '.succession-story-command-dossier__events',
]) assert(styles.includes(selector), `Story visual system is missing ${selector}`);

for (const breakpoint of ['@media (max-width: 1120px)', '@media (max-width: 780px)', '@media (max-width: 560px)']) {
  assert(styles.includes(breakpoint), `Story CSS is missing ${breakpoint}`);
}
assert(styles.includes('@media (hover: none)'), 'Story touch behavior is required');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Story reduced-motion behavior is required');
assert(styles.includes('min-height: 44px'), 'Story controls must retain 44px touch targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'Story CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'Story CSS must not depend on !important');
assert(routeManifest.includes("'story'"), 'release visual manifest must include the Story route');
assert(workflow.includes('node scripts/audit-succession-batch-4-story.mjs'), 'Batch 4 workflow must run the Story audit');
assert(workflow.includes('succession/story'), 'Batch 4 workflow must render the Story workspace');
for (const hour of ['Hour 41', 'Hour 42', 'Hour 43', 'Hour 44']) assert(docs.includes(hour), `Batch 4 design record must document ${hour}`);

console.log('Succession Batch 4 Story audit passed: phase architecture, synchronized lane tracks, thread dossiers, causal relationships, responsive fallbacks, touch targets, and reduced motion are registered.');
