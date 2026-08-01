import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Phase 2 presentation audit failed: ${message}`);
};

const [indexHtml, css] = await Promise.all([
  read('index.html'),
  read('public/succession-phase-2-presentation-consistency.css'),
]);

assert(indexHtml.includes('/succession-phase-2-presentation-consistency.css'), 'index.html must load the Phase 2 presentation layer');
assert(css.includes('@media (min-width: 1024px)'), 'Phase 2 must remain desktop and laptop only');
assert(!css.includes('@media (max-width:'), 'Phase 2 must not introduce tablet or mobile presentation rules');

assert(css.includes('.succession-page-header :is(h1, h2)'), 'shared archive briefs must style both valid heading levels');
assert(css.includes('.succession-page-header__description'), 'shared archive descriptions must retain explicit readable ink');
assert(css.includes('font-size: 11px !important'), 'compact archive labels must retain the desktop 11px floor');
assert(css.includes('[class*="status-pill"]') && css.includes('[data-state="uncertain"]'), 'state and evidence presentation must use one visible grammar');

assert(css.includes('.succession-nen-command > .succession-page-header') && css.includes('display: none !important'), 'the duplicate Nen archive brief must remain removed');
assert(css.includes('.succession-institution-command__network'), 'the redundant institution network ornament must remain removed');
assert(css.includes('.succession-nen-command__core'), 'the repeated Nen record-count ornament must remain removed');
assert(css.includes('[class*="queen"][class*="sigil"]'), 'redundant queen metric ornaments must remain removed');

assert(css.includes('dl[class*="status-strip"]') && css.includes('dl[class*="metrics"]'), 'metric strips must share one document presentation');
assert(css.includes('[class*="control-deck"]') && css.includes('[class*="temporal-command"]'), 'control surfaces must share one readable presentation');
assert(css.includes('data-archive-route="black-whale"') && css.includes('.ship-location-inspector'), 'Black Whale document panels must retain explicit desktop ink');
assert(css.includes('data-archive-route="research"') && css.includes('.succession-evidence-governance'), 'Research and Records panels must retain explicit desktop ink');

assert(css.includes('.succession-entity-visual') && css.includes('background: var(--succession-surface-paper-raised)'), 'entity media must retain the shared archival frame');
assert(css.includes('.succession-prince-card') && css.includes('.succession-queen-card') && css.includes('.succession-character-card'), 'people cards must share the Phase 2 interaction contract');
assert(css.includes('transform: none !important') && css.includes('box-shadow: inset 0 0 0 1px'), 'card focus must replace motion and obstructive overlays with a stable border signal');

console.log('Succession Phase 2 presentation consistency audit passed: desktop heading hierarchy, type floors, state language, surfaces, media frames, controls, redundant ornaments, repeated briefs, and card interaction are protected.');
