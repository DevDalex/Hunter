import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  ARCHIVE_DESIGN_SYSTEM_VERSION,
  archiveDesignSystemRules,
  archiveDesignSystemStats,
  archivePrimitiveContracts,
  archiveSemanticTones,
} from '../src/data/archiveDesignSystem.js';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Design system audit failed: ${message}`); };
const unique = (values) => new Set(values).size === values.length;

assert(ARCHIVE_DESIGN_SYSTEM_VERSION.includes('Batch 12'), 'design system version must identify Batch 12');
assert(archiveDesignSystemStats.primitives === archivePrimitiveContracts.length, 'primitive stats must match the contract list');
assert(archiveDesignSystemStats.semanticTones === archiveSemanticTones.length, 'semantic-tone stats must match the tone list');
assert(archiveDesignSystemStats.rules === archiveDesignSystemRules.length, 'rule stats must match the rule list');
assert(archivePrimitiveContracts.length >= 6 && unique(archivePrimitiveContracts.map((item) => item.id)), 'at least six unique UI primitives are required');
assert(archiveSemanticTones.length >= 7 && unique(archiveSemanticTones.map((item) => item.id)), 'shared evidence/status tones must cover the current evidence vocabulary');

for (const requiredState of ['confirmed', 'inferred', 'unclear', 'deferred', 'source-index-only', 'manga-only', 'anime-only']) {
  assert(archiveSemanticTones.some((tone) => tone.id === requiredState && tone.evidenceState === requiredState), `missing semantic tone for ${requiredState}`);
}

const [component, css, styles, home, packageJson, preflight, docs, readme, handbook] = await Promise.all([
  read('src/components/ArchiveUI.jsx'),
  read('src/styles/archive-system.css'),
  read('src/styles.css'),
  read('src/components/SiteHome.jsx'),
  read('package.json'),
  read('scripts/run-build-preflight.mjs'),
  read('docs/DESIGN-SYSTEM.md'),
  read('README.md'),
  read('public/implementation-notes.md'),
]);

for (const contract of archivePrimitiveContracts) {
  assert(component.includes(`function ${contract.component}`) || component.includes(`const ${contract.component}`), `ArchiveUI is missing ${contract.component}`);
  assert(css.includes(`.${contract.requiredClass}`), `archive-system.css is missing .${contract.requiredClass}`);
}

for (const exportedName of ['ArchiveSection', 'ArchiveCard', 'EvidenceBadge', 'StatusPill', 'SourceStack', 'ArchiveLedger']) {
  assert(component.includes(`export function ${exportedName}`), `ArchiveUI must export ${exportedName}`);
}
assert(component.includes('target="_blank"') && component.includes('rel="noreferrer noopener"'), 'source links must use literal safe external-link attributes');
assert(component.includes('safeRel') && component.includes("rel: href.startsWith('http') ? safeRel : undefined"), 'external card links must use the shared safeRel guard');
assert(component.includes('toneForEvidenceState'), 'EvidenceBadge must use the canonical tone map');
assert(css.includes('font-size: 11px') && css.includes('@media (max-width: 860px)'), 'design-system CSS must preserve the 11px text floor and responsive collapse');
assert(styles.includes("@import './styles/archive-system.css';"), 'global CSS must import the Batch 12 design-system layer');
assert(!home.includes('archive-ui-library') && !home.includes('Design-system foundation'), 'the removed reader-facing design-system showcase must not return to the home page');
assert(packageJson.includes('"audit:design-system"') && packageJson.includes('node scripts/audit-design-system.mjs'), 'package.json must expose audit:design-system');
assert(preflight.includes("'audit:design-system'"), 'aggregate preflight must include audit:design-system');

for (const phrase of ['Batch 12', 'ArchiveSection', 'ArchiveCard', 'EvidenceBadge', 'SourceStack', '16 independent pre-build audits']) {
  assert(docs.includes(phrase), `design-system documentation is missing ${phrase}`);
}
for (const phrase of ['Batch 12', 'src/components/ArchiveUI.jsx', 'src/data/archiveDesignSystem.js', '16 independent pre-build audits']) {
  assert(readme.includes(phrase), `README is missing Batch 12 contract phrase ${phrase}`);
  assert(handbook.includes(phrase), `handbook is missing Batch 12 contract phrase ${phrase}`);
}

for (const file of ['src/data/archiveDesignSystem.js', 'src/components/ArchiveUI.jsx', 'src/styles/archive-system.css', 'docs/DESIGN-SYSTEM.md']) await access(path.resolve(file));

console.log(`Design system audit passed: ${archivePrimitiveContracts.length} primitives, ${archiveSemanticTones.length} semantic tones, ${archiveDesignSystemRules.length} governance rules, hidden homepage showcase, docs, and aggregate preflight wiring verified.`);
