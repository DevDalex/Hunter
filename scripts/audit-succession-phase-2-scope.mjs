#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const phase2 = await readFile(path.join(root, 'src/components/succession/SuccessionPhase2DesignSystem.css'), 'utf8');
const scope = await readFile(path.join(root, 'docs/succession-phase-2-design-system.md'), 'utf8');

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 2 scope audit failed: ${message}`);
};

assert(scope.includes('Explicitly deferred'), 'Phase 3 deferral is not documented');
assert(scope.includes('Phases 3A–3E'), 'section-specific redesign boundary is not documented');
assert(scope.includes('complete document remains visible rather than being clipped'), 'full-canvas non-clipping acceptance criterion is missing');

const forbiddenWorkspaceRoots = [
  '.succession-story-intelligence-command',
  '.succession-chapter-command',
  '.succession-event-command',
  '.succession-character-command',
  '.succession-royal-command',
  '.succession-assignment-command',
  '.succession-organization-workspace',
  '.succession-canonical-relationships',
  '.black-whale-intelligence',
  '.succession-location-command',
  '.succession-nen-command',
  '.succession-gsb-command',
  '.succession-search-complete',
  '.succession-evidence-workspace',
  '.succession-glossary-canonical',
];

for (const selector of forbiddenWorkspaceRoots) {
  assert(!phase2.includes(selector), `Phase 2 crossed into a deferred workspace: ${selector}`);
}

console.log('Succession Phase 2 scope audit passed: shared-shell work is documented and all Phase 3A–3E workspace roots remain deferred.');
