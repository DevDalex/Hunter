import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const [indexHtml, repairCss, architectureBoard] = await Promise.all([
  read('index.html'),
  read('public/succession-phase-1-visual-repair.css'),
  read('src/components/succession/SuccessionArchitectureBoard.jsx'),
]);

assert(indexHtml.includes('/succession-phase-1-visual-repair.css'), 'index.html must load the Phase 1 Succession visual repair layer');
assert(repairCss.includes('@media (min-width: 1024px)'), 'Phase 1 must remain desktop/laptop-only');
assert(!repairCss.includes('@media (max-width:'), 'Phase 1 must not introduce tablet or mobile rules');

assert(repairCss.includes('.succession-architecture__ship-portrait::before') && repairCss.includes('content: none !important'), 'the exterior Black Whale frame must remove inherited image layers');
assert(repairCss.includes('.succession-architecture__split-grid > a > .succession-architecture__ship-blueprint') && repairCss.includes('display: none !important'), 'tier and room-map imagery must be removed from architecture portal cards');
assert(repairCss.includes('object-fit: contain !important') && repairCss.includes('.succession-architecture__retained-beast-grid'), 'Black Whale and Guardian Spirit Beast media must preserve their full forms');

for (const requiredRoute of ['princes', 'queens', 'characters', 'relationships', 'nen', 'guardian-spirit-beasts', 'organizations', 'research']) {
  assert(repairCss.includes(`data-archive-route="${requiredRoute}"`), `Phase 1 repair coverage is missing the ${requiredRoute} workspace`);
}

assert(repairCss.includes('.succession-relationship-network__canvas') && repairCss.includes('min-height: 760px'), 'relationship map must retain its expanded desktop plotting field');
assert(repairCss.includes('.succession-relationship-network__node b') && repairCss.includes('white-space: normal !important'), 'relationship node names must wrap legibly');
assert(repairCss.includes('.succession-nen-command-system') && repairCss.includes('background: linear-gradient(150deg, #fbfbf8, #ecece7)'), 'Nen system cards must not regress to blank dark slabs');
assert(repairCss.includes('.succession-gsb-command-card__visual') && repairCss.includes('height: 142px'), 'Guardian Spirit Beast cards must retain a stable media frame');
assert(repairCss.includes('.succession-institution-grid > article') && repairCss.includes('.succession-evidence-hero'), 'Power Bloc and Research/Records surfaces must retain Phase 1 contrast repairs');

assert(architectureBoard.includes("target: 'black-whale'") && architectureBoard.includes("routeToHref('succession', 'locations')"), 'Black Whale and Locations routes must remain available after portal image removal');
assert(architectureBoard.includes('guardian-spirit-beasts'), 'Guardian Spirit Beast navigation must remain available');

console.log('Succession Phase 1 visual repair audit passed: desktop-only scope, portal media cleanup, typography, relationship graph, Nen, Beasts, Power Blocs, and Records repairs are present.');
