#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 2 design-system audit failed: ${message}`);
};

const [entry, phase2, viewportCss, viewportRuntime, shell] = await Promise.all([
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionPhase2DesignSystem.css'),
  read('src/components/succession/SuccessionArchitectureCenteringFix.css'),
  read('src/components/succession/SuccessionArchitectureViewportRuntime.js'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
]);

const phase2Import = "import './SuccessionPhase2DesignSystem.css';";
const viewportCssImport = "import './SuccessionArchitectureCenteringFix.css';";
const viewportRuntimeImport = "import './SuccessionArchitectureViewportRuntime.js';";
assert(entry.includes(phase2Import), 'the Phase 2 production layer is not loaded by SuccessionArchiveEntry');
assert(entry.includes(viewportCssImport), 'the architecture viewport-fill CSS is not loaded by SuccessionArchiveEntry');
assert(entry.includes(viewportRuntimeImport), 'the architecture viewport runtime is not loaded by SuccessionArchiveEntry');
assert(entry.indexOf(viewportCssImport) > entry.indexOf(phase2Import), 'the viewport-fill CSS must load after the Phase 2 layer');
assert(entry.indexOf(viewportRuntimeImport) > entry.indexOf(viewportCssImport), 'the viewport runtime must load after the viewport-fill CSS');

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
]) assert(phase2.includes(selector), `missing shared Phase 2 surface: ${selector}`);

for (const viewportContract of [
  'html:has(.succession-architecture-board)',
  'width: 100vw !important',
  'height: 100dvh !important',
  'overflow: hidden !important',
  '--architecture-layout-width',
  '--architecture-layout-height',
  '--architecture-scale-x',
  '--architecture-scale-y',
  'translate(-50%, -50%) scale(var(--architecture-scale-x, 1), var(--architecture-scale-y, 1))',
  '.succession-architecture__primary-grid',
  'grid-template-columns: minmax(0, 18fr) minmax(0, 64fr) minmax(0, 18fr)',
]) assert(viewportCss.includes(viewportContract), `missing full-screen viewport contract: ${viewportContract}`);

assert(!viewportCss.includes('@media (max-width'), 'the architecture board must not fall back to a scrolling small-screen document');
assert(!viewportCss.includes('height: auto !important'), 'the architecture sheet must remain locked to the viewport geometry');

for (const runtimeContract of [
  'ARCHITECTURE_BASE_WIDTH = 1660',
  'ARCHITECTURE_BASE_HEIGHT = 1260',
  'const scaleY = height / ARCHITECTURE_BASE_HEIGHT',
  'const layoutWidth = Math.max(ARCHITECTURE_BASE_WIDTH, width / scaleY)',
  'const scaleX = width / layoutWidth',
  "board.style.setProperty('--architecture-layout-width'",
  "board.style.setProperty('--architecture-scale-x'",
  "board.style.setProperty('--architecture-scale-y'",
  "window.addEventListener('resize'",
  'window.visualViewport?.addEventListener',
  'MutationObserver',
]) assert(viewportRuntime.includes(runtimeContract), `missing viewport runtime contract: ${runtimeContract}`);

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

for (const [name, css] of [['Phase 2', phase2], ['viewport fill', viewportCss]]) {
  const opening = (css.match(/\{/g) || []).length;
  const closing = (css.match(/\}/g) || []).length;
  assert(opening === closing, `${name} CSS has unbalanced blocks (${opening} opening, ${closing} closing)`);
}

console.log('Succession Phase 2 design-system audit passed: monochrome tokens, shared shell, edge-to-edge viewport fill, zero-scroll geometry, runtime resizing, semantic states, and Phase 3 workspace boundaries are protected.');
