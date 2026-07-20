import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Final polish audit failed: ${message}`);
};

const [main, packageJson, preflight, finalCss, storyArchitecture, storyAudit, referenceAudit, characterAudit, docs] = await Promise.all([
  read('src/main.jsx'),
  read('package.json'),
  read('scripts/run-build-preflight.mjs'),
  read('src/styles/final-polish.css'),
  read('docs/STORY-ARCHITECTURE.md'),
  read('scripts/audit-story-architecture.mjs'),
  read('scripts/audit-reference-backbone.mjs'),
  read('scripts/audit-character-profiles.mjs'),
  read('docs/FINAL-POLISH.md'),
]);

const finalImport = "import './styles/final-polish.css';";
const nenImport = "import './nen.css';";
assert(main.includes(finalImport), 'main.jsx must load the final polish stylesheet');
assert(main.indexOf(finalImport) > main.indexOf(nenImport), 'final polish must load after Nen-specific CSS');

for (const token of ['--archive-black: #0d0d10', '--archive-paper: #f1ece2', '--crimson: #a12a38', '--archive-gold: #c29c57']) {
  assert(finalCss.toLowerCase().includes(token), `final polish CSS is missing ${token}`);
}
assert(finalCss.includes('--forest: var(--crimson);') && finalCss.includes('--forest-dark: var(--crimson-dark);') && finalCss.includes('--forest-soft: var(--crimson-soft);'), 'legacy forest aliases must resolve to crimson compatibility values');
assert(!/#164f3a|#0d2b22|#dbe8df/i.test(finalCss), 'final polish must not reintroduce the old global green values');

for (const selector of ['.site-header', '.header-links a::after', '.page-intro::before', '[data-arc="greed-island"] .arc-experience-hero__copy', '[data-arc="chimera-ant"] .arc-experience-hero__copy', '.nen-desk-hero', '.character-profile-dossier', '@media (prefers-reduced-motion: reduce)']) {
  assert(finalCss.includes(selector), `final polish CSS must cover ${selector}`);
}

for (const script of ['audit:story', 'audit:reference', 'audit:characters', 'audit:final', 'audit:polish', 'preflight:build', 'qa:browser']) {
  assert(packageJson.includes(`"${script}"`), `package.json is missing ${script}`);
}
assert(packageJson.includes('npm run generate:build-info && npm run preflight:build'), 'the normal build must enter the aggregate preflight after build identity generation');

const lockedAuditOrder = ['audit:story', 'audit:reference', 'audit:characters', 'audit:final'];
const lockedAuditPositions = lockedAuditOrder.map((name) => preflight.indexOf(`'${name}'`));
assert(lockedAuditPositions.every((position) => position >= 0), 'aggregate preflight is missing a Batch 7–10 lock audit');
assert(lockedAuditPositions.every((position, index) => index === 0 || position > lockedAuditPositions[index - 1]), 'aggregate preflight must run Story, Reference, Characters, then Final in order');

for (const auditText of [storyAudit, referenceAudit, characterAudit]) {
  assert(auditText.includes('Hunterpedia') || auditText.includes('isApprovedSourceUrl'), 'batch audits must keep the approved source policy visible');
}
assert(storyAudit.includes('mobile work must remain deferred') || storyArchitecture.toLowerCase().includes('mobile') && storyArchitecture.toLowerCase().includes('deferred'), 'mobile must remain explicitly deferred');
assert(referenceAudit.includes('referenceBackbone') && characterAudit.includes('No cast deletion'), 'Batch 8 and Batch 9 contracts must stay visible');

for (const docName of ['CHIMERA-ANT-PROTOTYPE.md', 'REFERENCE-BACKBONE.md', 'CHARACTER-PROFILES.md', 'FINAL-POLISH.md']) {
  await access(path.resolve('docs', docName));
  assert(docs.includes('Batch 10') || docName !== 'FINAL-POLISH.md', 'final polish documentation must identify Batch 10');
}

console.log('Final polish audit passed: Black Archive palette locked, final CSS loaded last, Batch 7–9 audits preserved inside aggregate preflight, mobile deferred, and Batch 10 documented.');
