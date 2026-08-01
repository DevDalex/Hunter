#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession architecture lock audit failed: ${message}`);
};

const [board, polish, corrections, shellQa, documentation] = await Promise.all([
  read('src/components/succession/SuccessionArchitectureBoard.jsx'),
  read('src/components/succession/SuccessionArchitecturePolishLock.css'),
  read('src/components/succession/SuccessionArchitectureLockCorrections.css'),
  read('scripts/succession-archive-shell-qa.mjs'),
  read('docs/succession-architecture-lock.md'),
]);

for (const contract of [
  "import './SuccessionArchitecturePolishLock.css';",
  "import './SuccessionArchitectureLockCorrections.css';",
  'data-architecture-status="approved"',
  'data-architecture-version="1.0"',
  'Approved architecture for section redesign',
  '<dd>1.0</dd>',
  '<dd>Approved</dd>',
  '<span>Approved</span>',
  'Architecture approved · V1.0',
  'Phase 3 destinations only',
]) assert(board.includes(contract), `missing approved architecture contract: ${contract}`);

assert(!board.includes('<dd>0.9</dd>'), 'draft version 0.9 remains in the approved portal');
assert(!board.includes('<span>Draft</span>'), 'Draft status remains in the approved portal');
assert((board.match(/action:/g) || []).length >= 19, 'route-feedback action catalogue is incomplete');
assert(board.includes('data-route-action={item.action}'), 'mapped architecture destinations do not bind contextual route feedback');
assert((board.match(/data-route-action=/g) || []).length >= 8, 'direct architecture shortcuts do not expose contextual route feedback');
assert(board.includes('aria-label="Approved Succession Contest architecture"'), 'approved portal region lacks an explicit accessible name');
assert(board.includes('title={contract.detail}'), 'Preserved Contracts do not expose their technical explanations');
assert(board.includes('succession-architecture__skeleton-tabs'), 'miniature shell shortcuts are missing');
assert(board.includes("navigateLink(event, onNavigate, 'timeline')"), 'miniature timeline link is missing');
assert(board.includes("navigateLink(event, onNavigate, 'characters')"), 'miniature dossier link is missing');
assert(board.includes("<a href={routeToHref('succession', 'search')}"), 'miniature search remains a form-style control instead of a navigation link');
assert(!board.includes('className="succession-architecture__skeleton-tabs">{storyViews.map((item) => <button'), 'miniature Story tabs remain undersized button controls');
assert(board.includes('aria-label={item.label} data-route-action={item.action}'), 'canonical accessible route names are not preserved beside visual route feedback');

for (const contract of [
  'overflow-wrap: normal !important',
  'word-break: normal !important',
  'hyphens: none !important',
  '[data-route-action]::after',
  '[data-route-action]:focus-visible::after',
  ':active',
  ':focus-visible',
  '.succession-architecture__modules',
  'grid-template-rows: repeat(2, minmax(0, 1fr))',
  '.succession-architecture__lower-grid > div',
  '.succession-architecture__footer-specs',
  '@media (min-width: 1101px)',
  '@media (min-width: 1800px)',
  '@media (min-width: 1101px) and (max-width: 1399px)',
  '@media (min-width: 1101px) and (max-height: 850px)',
  '@media (prefers-reduced-motion: reduce)',
  '@media (forced-colors: active)',
]) assert(polish.includes(contract), `missing polish/lock CSS contract: ${contract}`);

for (const contract of [
  '.succession-architecture__corner',
  'display: none !important',
  'unstable ornamental nodes are retired',
  '.succession-architecture-board.is-architecture-locked',
  '.succession-architecture__view-cell > strong',
  'overflow-wrap: normal !important',
  'word-break: normal !important',
  'hyphens: none !important',
  '.succession-archive:not(.succession-architecture-board)',
  'font-variant-caps: all-small-caps',
  '.succession-architecture__page-skeleton > header a',
  '.succession-architecture__skeleton-body > nav a',
  '.succession-architecture__skeleton-tabs a',
  '.succession-architecture__skeleton-body > aside > a',
]) assert(corrections.includes(contract), `missing final browser correction: ${contract}`);

assert(!polish.includes('@media (max-width: 1100px)'), 'this pass must not add tablet/mobile architecture composition');
assert(!polish.includes('@media (max-width: 680px)'), 'this pass must not add phone architecture composition');
assert(!corrections.includes('@media (max-width'), 'browser corrections must not add tablet/mobile architecture composition');
assert(!polish.includes('display: none !important; /* mobile'), 'mobile architecture content was hidden by the lock layer');

for (const baseline of [
  'architecture-approved-1440x1000.png',
  'architecture-approved-1920x1080.png',
  'data-architecture-status',
  'data-architecture-version',
  'primaryColumnBottoms',
  'moduleRowBottoms',
  'lowerBandBottoms',
  'routeFeedback',
]) assert(shellQa.includes(baseline), `browser lock proof is missing: ${baseline}`);

assert(documentation.includes('Tablet/mobile architecture-page recomposition is intentionally **not part of this lock pass**'), 'tablet/mobile exclusion is not documented');
assert(documentation.includes('browser-captured 1440×1000 and 1920×1080 visual baselines'), 'visual baseline lock is not documented');
assert(documentation.includes('Phase 3 work changes the destination workspaces rather than the architecture portal'), 'future change boundary is not documented');

for (const [name, source] of [['polish CSS', polish], ['correction CSS', corrections], ['architecture component', board]]) {
  const opening = (source.match(/\{/g) || []).length;
  const closing = (source.match(/\}/g) || []).length;
  assert(opening === closing, `${name} has unbalanced braces (${opening} opening, ${closing} closing)`);
}

console.log('Succession architecture lock audit passed: approved metadata, balanced desktop composition, canonical route labels, no-break architecture headings, semantic miniature links, stable registration rules, lower-band polish, accessibility, visual baselines, and Phase 3 change boundaries are protected.');
