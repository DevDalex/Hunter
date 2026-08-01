#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 2 design-system audit failed: ${message}`);
};

const [entry, phase2, shell] = await Promise.all([
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionPhase2DesignSystem.css'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
]);

const phase2Import = "import './SuccessionPhase2DesignSystem.css';";
assert(entry.includes(phase2Import), 'the Phase 2 production layer is not loaded by SuccessionArchiveEntry');
assert(entry.indexOf(phase2Import) > entry.indexOf("import './SuccessionExactContrastClosure.css';"), 'the Phase 2 layer must load after the legacy closure layers');

for (const contract of [
  '--succession-vf-version: 2',
  '--succession-canvas: #f4f4f1',
  '--succession-surface-paper: #fbfbf8',
  '--succession-text: #171717',
  '--succession-border-strong: #171717',
  '--succession-state-confirmed: #111',
  '--succession-state-inferred: #51514e',
  '--succession-radius-md: 0',
  '--succession-shadow-md: none',
  'color-scheme: light',
]) assert(phase2.includes(contract), `missing monochrome token contract: ${contract}`);

for (const selector of [
  '.succession-archive__status-strip',
  '.succession-archive__sidebar-inner',
  '.succession-archive-nav a.is-active',
  '.succession-hub-tabs',
  '.succession-page-header',
  '.succession-archive__mobile-bar',
  '.succession-drawer',
  '.succession-architecture-board',
  '.succession-architecture__sheet',
]) assert(phase2.includes(selector), `missing shared Phase 2 surface: ${selector}`);

for (const viewportContract of [
  'body.succession-architecture-mode',
  'overflow: hidden !important',
  'height: 100dvh !important',
  'position: fixed !important',
  '--phase2-board-fit',
  'place-items: center !important',
  '@media (max-width: 1279px), (max-height: 759px)',
]) assert(phase2.includes(viewportContract), `missing architecture viewport contract: ${viewportContract}`);

for (const accessibilityContract of [
  ':focus-visible',
  '@media (forced-colors: active)',
  '@media (prefers-reduced-motion: reduce)',
  "[data-state='inferred']",
  "[data-state='uncertain']",
  "[data-state='pending']",
]) assert(phase2.includes(accessibilityContract), `missing accessible monochrome contract: ${accessibilityContract}`);

for (const forbidden of ['#d7b56d', '#f1cf81', '#9f3442', '#c34b5b', '#7693a8', '#8d769d', '#668f7c', '#c28b45']) {
  assert(!phase2.toLowerCase().includes(forbidden), `legacy color ${forbidden} remains in the Phase 2 layer`);
}

for (const workspaceSelector of [
  '.succession-character-command',
  '.succession-event-command',
  '.succession-gsb-command',
  '.succession-assignment-command',
  '.succession-relationship-command',
  '.black-whale-intelligence',
]) assert(!phase2.includes(workspaceSelector), `Phase 2 improperly redesigns a Phase 3 workspace: ${workspaceSelector}`);

assert(shell.includes('succession-archive__layout'), 'canonical shared shell is missing');
assert(shell.includes('succession-archive__mobile-bar'), 'canonical mobile shell is missing');
assert(shell.includes('succession-drawer'), 'canonical modal navigation drawer is missing');

const opening = (phase2.match(/\{/g) || []).length;
const closing = (phase2.match(/\}/g) || []).length;
assert(opening === closing, `Phase 2 CSS has unbalanced blocks (${opening} opening, ${closing} closing)`);

console.log('Succession Phase 2 design-system audit passed: monochrome tokens, shared shell, full-canvas architecture fitting, semantic states, responsive fallback, and Phase 3 workspace boundaries are protected.');
