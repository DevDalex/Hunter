import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { assertReleasedSuccessionRoutes } from './lib/release-route-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Succession Batch 4 Story audit failed: ${message}`); };

const [workspace, styles, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveStoryCommand.css'),
  read('.github/workflows/succession-visual-redesign-batch-4.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-4.md'),
]);

for (const token of ['succession-story-command__hero','succession-story-command__metrics','succession-story-command__phases','succession-story-command__phase-grid','succession-story-command__lanes','succession-story-command__swimlanes','succession-story-command__lane-track','succession-story-command__threads','succession-story-command__thread-grid','succession-story-command__causal','succession-story-command__causal-river','succession-story-command-dossier','Narrative intelligence command','Imported media and maintained Story research remain separate']) assert(workspace.includes(token), `Story workspace contract is missing ${token}`);
for (const selector of ['.succession-story-command__hero','.succession-story-command__metrics','.succession-story-command__phase-grid','.succession-story-command__swimlanes','.succession-story-command__lane-track','.succession-story-command-thread','.succession-story-command__causal-river','.succession-story-command-dossier__hero','.succession-story-command-dossier__events']) assert(styles.includes(selector), `Story visual system is missing ${selector}`);

assert(!styles.includes('@media (max-width:'), 'desktop-only Story CSS must not carry narrow-width breakpoint layouts');
assert(!styles.includes('@media (hover: none)'), 'desktop-only Story CSS must not carry no-hover device behavior');
assert(!styles.includes('(pointer: coarse)'), 'desktop-only Story CSS must not carry coarse-pointer behavior');
assert(!styles.includes('touch-action:'), 'desktop-only Story CSS must not carry touch-action rules');
assert(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Story reduced-motion behavior is required');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(styles), 'Story CSS must not introduce raw hex colors');
assert(!styles.includes('!important'), 'Story CSS must not depend on !important');
assertReleasedSuccessionRoutes(['story'], assert, 'release visual manifest');
assert(workflow.includes('node scripts/audit-succession-batch-4-story.mjs'), 'Batch 4 workflow must run the Story audit');
assert(workflow.includes('succession/story'), 'Batch 4 workflow must render the Story workspace');
for (const hour of ['Hour 41','Hour 42','Hour 43','Hour 44']) assert(docs.includes(hour), `Batch 4 design record must document ${hour}`);
console.log('Succession Batch 4 Story audit passed: desktop phase architecture, synchronized lane tracks, thread dossiers, causal relationships, and reduced motion are registered.');
