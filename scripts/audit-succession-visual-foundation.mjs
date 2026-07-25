import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  SUCCESSION_VISUAL_FOUNDATION_VERSION,
  successionSemanticStates,
  successionVisualComponentContracts,
  successionVisualFoundationReport,
  successionVisualPrinciples,
  successionVisualTokenGroups,
} from '../src/data/succession/visualDesignSystem.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession visual foundation audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

assert(SUCCESSION_VISUAL_FOUNDATION_VERSION.includes('Batch 1'), 'version must identify Batch 1');
assert(successionVisualFoundationReport.scope === 'presentation-only', 'foundation scope must remain presentation-only');
assert(successionVisualPrinciples.length >= 7 && unique(successionVisualPrinciples.map((item) => item.id)), 'visual principles must be complete and unique');
assert(successionVisualTokenGroups.length >= 10 && unique(successionVisualTokenGroups.map((item) => item.id)), 'token groups must be complete and unique');
assert(successionSemanticStates.length >= 15 && unique(successionSemanticStates.map((item) => item.id)), 'semantic states must be complete and unique');
assert(successionVisualComponentContracts.length >= 10 && unique(successionVisualComponentContracts.map((item) => item.id)), 'component contracts must be complete and unique');

for (const requiredState of ['confirmed', 'inferred', 'uncertain', 'disputed', 'pending', 'active', 'deceased', 'missing', 'captured', 'compromised', 'allied', 'hostile', 'neutral', 'completed', 'failed']) {
  assert(successionSemanticStates.some((state) => state.id === requiredState), `missing semantic state ${requiredState}`);
}

const [css, bridgeCss, searchCss, preview, previewCss, app, docs, packageJson, inventoryReport] = await Promise.all([
  read('src/components/succession/SuccessionVisualFoundation.css'),
  read('src/components/succession/SuccessionVisualFoundationBridge.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/components/succession/SuccessionVisualFoundationPreview.jsx'),
  read('src/components/succession/SuccessionVisualFoundationPreview.css'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('docs/SUCCESSION-VISUAL-REDESIGN.md'),
  read('package.json'),
  read('scripts/report-succession-visual-inventory.mjs'),
]);

assert(css.includes('.succession-archive {'), 'foundation styles must be scoped to .succession-archive');
assert(css.includes('--succession-vf-version: 1'), 'CSS must expose foundation version 1');
assert(css.includes('@media (max-width: 860px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'responsive and reduced-motion contracts are required');
assert(css.includes('font-size: var(--succession-text-xs)') && css.includes('--succession-text-xs: 11px'), 'the 11px readability floor must remain explicit');
assert(css.includes(':focus-visible') && css.includes('--succession-border-focus'), 'visible keyboard focus styling is required');

for (const token of successionVisualTokenGroups) {
  assert(css.includes(token.cssPrefix), `CSS is missing token prefix ${token.cssPrefix}`);
}
for (const contract of successionVisualComponentContracts) {
  assert(css.includes(contract.selector), `CSS is missing component selector ${contract.selector}`);
}

const expectedImports = "@import './SuccessionVisualFoundation.css';\n@import './SuccessionVisualFoundationBridge.css';";
assert(searchCss.trimStart().startsWith(expectedImports), 'the foundation and compatibility bridge must load after existing Succession compatibility modules');
assert(bridgeCss.includes('.succession-story-intel') && bridgeCss.includes('.succession-character-workspace'), 'compatibility bridge must cover the Story and Character workspace roots verified by browser QA');
assert(bridgeCss.includes('--archive-panel: var(--succession-surface-1)') && bridgeCss.includes('--succession-panel: var(--succession-surface-1)'), 'legacy workspace variables must map to semantic foundation tokens');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(bridgeCss), 'the compatibility bridge must not introduce raw hex colors');
assert(preview.includes('Development-only visual contract preview'), 'preview must remain explicitly development-only');
assert(preview.includes("import './SuccessionVisualFoundationPreview.css';"), 'preview must load its isolated presentation styles');
assert(previewCss.includes('.succession-visual-preview') && previewCss.includes('@media (max-width: 620px)'), 'preview CSS must remain scoped and responsive');
assert(!app.includes('SuccessionVisualFoundationPreview'), 'the preview must not become a public archive route during Batch 1');
assert(packageJson.includes('"audit:succession-visual-foundation"'), 'package.json must expose the visual foundation audit');
assert(packageJson.includes('"report:succession-visual-inventory"'), 'package.json must expose the visual inventory report');
assert(inventoryReport.includes('# Succession visual inventory') && inventoryReport.includes('Migration guidance'), 'visual inventory report must document debt and migration guidance');

for (const phrase of ['64-hour implementation schedule', 'presentation-only', 'Hourly safety check', 'Compatibility strategy', 'GitHub issue **#49**']) {
  assert(docs.includes(phrase), `documentation is missing ${phrase}`);
}

for (const file of [
  'src/data/succession/visualDesignSystem.js',
  'src/components/succession/SuccessionVisualFoundation.css',
  'src/components/succession/SuccessionVisualFoundationBridge.css',
  'src/components/succession/SuccessionVisualFoundationPreview.jsx',
  'src/components/succession/SuccessionVisualFoundationPreview.css',
  'scripts/report-succession-visual-inventory.mjs',
  'docs/SUCCESSION-VISUAL-REDESIGN.md',
]) await access(path.join(root, file));

console.log(`Succession visual foundation audit passed: ${successionVisualPrinciples.length} principles, ${successionVisualTokenGroups.length} token groups, ${successionSemanticStates.length} semantic states, ${successionVisualComponentContracts.length} component contracts, scoped CSS, semantic compatibility bridge, hidden preview, responsive behavior, reduced motion, inventory reporting, and issue #49 schedule documentation verified.`);
