import { existsSync, readFileSync } from 'node:fs';
import { productCapabilities, capabilityIds } from '../src/data/productCapabilities.js';
import { performancePolicy } from '../src/data/performancePolicy.js';
import { archiveEntryMissions, explanationModes } from '../src/data/succession/readingExperience.js';
import { certaintyLevels, claimKinds, questionStatuses } from '../src/data/succession/researchSemantics.js';
import { archiveSchemas } from '../src/data/schemas/archiveSchemas.js';
import { analyticsPrivacyPolicy } from '../src/lib/privacyAnalytics.js';
import { comparisonDomains } from '../src/lib/succession/comparison.js';
import { chapterChangeKinds } from '../src/lib/succession/chapterDiff.js';
import { publicExportPolicy } from '../src/lib/succession/shareAndExport.js';

const unique = (values, label) => { if (new Set(values).size !== values.length) throw new Error(`${label} contains duplicate identifiers.`); };
const includesInsensitive = (source, value) => source.toLowerCase().includes(value.toLowerCase());
const assertFeatures = (source, features, label) => {
  for (const feature of features) if (!includesInsensitive(source, feature)) throw new Error(`${label} is missing ${feature}.`);
};
const requiredFiles = [
  'src/components/succession/SuccessionArchiveOnboarding.jsx', 'src/components/succession/SuccessionArchiveContextBar.jsx',
  'src/components/succession/SuccessionConsolidationNotice.jsx', 'src/components/succession/SuccessionExplanationView.jsx',
  'src/components/succession/SuccessionEvidenceInspector.jsx', 'src/components/succession/SuccessionResearchTools.jsx',
  'src/components/succession/SuccessionIntelligencePanels.jsx', 'src/components/succession/SuccessionResearchTools.css',
  'src/data/schemas/archiveSchemas.js', 'src/lib/privacyAnalytics.js', 'docs/adr/0001-chapter-bounded-state.md',
];
for (const path of requiredFiles) if (!existsSync(path)) throw new Error(`Missing required product surface: ${path}`);
unique(archiveEntryMissions.map((item) => item.id), 'Archive missions');
unique(explanationModes.map((item) => item.id), 'Explanation modes');
unique(capabilityIds, 'Product capabilities');
unique(chapterChangeKinds, 'Chapter change kinds');
unique(questionStatuses, 'Question statuses');
if (archiveEntryMissions.length < 4) throw new Error('Phase 2 requires four archive entry missions.');
if (explanationModes.length < 4) throw new Error('Phase 2 requires four explanation modes.');
if (!Object.keys(comparisonDomains).length) throw new Error('Phase 3 comparison domains are missing.');
if (!certaintyLevels.confirmed || !claimKinds.canon) throw new Error('Phase 3 evidence semantics are incomplete.');
if (!publicExportPolicy.excluded.includes('chapter-image-binaries')) throw new Error('Phase 4 export policy must exclude chapter images.');
if (performancePolicy.routeChunks.shellMaximumKb >= performancePolicy.routeChunks.workspaceMaximumKb) throw new Error('Phase 5 shell budget must remain below workspace budget.');
for (const schema of ['route', 'entity', 'character', 'organization', 'chapter', 'event', 'relationship', 'assignment', 'ability', 'location', 'guardianBeast', 'glossary', 'evidence', 'investigation']) {
  if (!archiveSchemas[schema]) throw new Error(`Runtime archive schema is missing ${schema}.`);
}
if (!analyticsPrivacyPolicy.localOnly || analyticsPrivacyPolicy.storesSearchQueries) throw new Error('Analytics must remain local and query-free.');

const entrySource = readFileSync('src/components/succession/SuccessionArchiveEntry.jsx', 'utf8');
assertFeatures(entrySource, ['SuccessionArchiveOnboarding', 'SuccessionArchiveContextBar', 'SuccessionConsolidationNotice', 'SuccessionResearchTools', 'SuccessionIntelligencePanels'], 'Archive entry');
const onboardingSource = readFileSync('src/components/succession/SuccessionArchiveOnboarding.jsx', 'utf8');
assertFeatures(onboardingSource, ['readingBoundary', 'Resume at Chapter', 'Reset saved mission', 'setSavedReadingBoundary'], 'Phase 2 onboarding');
const explanationSource = readFileSync('src/components/succession/SuccessionExplanationView.jsx', 'utf8');
assertFeatures(explanationSource, ["mode === 'brief'", "mode === 'deep'", "mode === 'evidence'", 'What happened', 'Mechanics and causal links', 'Interpretation and uncertainty', 'Sources and claims'], 'Phase 2 explanation output');
const researchSource = readFileSync('src/components/succession/SuccessionResearchTools.jsx', 'utf8');
assertFeatures(researchSource, ['Bookmark view', 'Chapter changes', 'Investigation board', 'Copy research snapshot', 'Export JSON', 'Export CSV', 'Export Markdown', 'citation bundle', 'Print or save PDF', 'SuccessionEvidenceInspector'], 'Research interface');
const intelligenceSource = readFileSync('src/components/succession/SuccessionIntelligencePanels.jsx', 'utf8');
assertFeatures(intelligenceSource, ['Compare canonical records', 'compareDomain', 'Copy comparison link', 'is-different', 'Candidates', 'Evidence for', 'Evidence against', 'Resolution history', 'Open related dossier'], 'Phase 3 intelligence interface');
const evidenceSource = readFileSync('src/components/succession/SuccessionEvidenceInspector.jsx', 'utf8');
assertFeatures(evidenceSource, ['claim-kind', 'Contradictions', 'Translation variants', 'Page / panel', 'Reviewed'], 'Phase 3 evidence interface');
for (const [name, phase] of Object.entries(productCapabilities)) {
  if (!Number.isInteger(phase.phase) || phase.phase < 2 || phase.phase > 5) throw new Error(`${name} has an invalid phase.`);
  if (!phase.capabilities?.length) throw new Error(`${name} has no capability contract.`);
}
console.log(`Product phase audit passed: ${capabilityIds.length} capabilities across Phases 2–5 with completed Phase 2–3 UI enforcement.`);
