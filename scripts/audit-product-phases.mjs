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
if (!archiveSchemas.route || !archiveSchemas.entity || !archiveSchemas.evidence || !archiveSchemas.investigation) throw new Error('Runtime archive schemas are incomplete.');
if (!analyticsPrivacyPolicy.localOnly || analyticsPrivacyPolicy.storesSearchQueries) throw new Error('Analytics must remain local and query-free.');

const entrySource = readFileSync('src/components/succession/SuccessionArchiveEntry.jsx', 'utf8');
for (const component of ['SuccessionArchiveOnboarding', 'SuccessionArchiveContextBar', 'SuccessionConsolidationNotice', 'SuccessionResearchTools', 'SuccessionIntelligencePanels']) if (!entrySource.includes(component)) throw new Error(`${component} is not wired into the archive entry.`);
const onboardingSource = readFileSync('src/components/succession/SuccessionArchiveOnboarding.jsx', 'utf8');
for (const feature of ['readingBoundary', 'Resume at Chapter', 'Reset saved mission', 'setSavedReadingBoundary']) if (!onboardingSource.includes(feature)) throw new Error(`Phase 2 onboarding is missing ${feature}.`);
const explanationSource = readFileSync('src/components/succession/SuccessionExplanationView.jsx', 'utf8');
for (const feature of ["mode === 'brief'", "mode === 'deep'", "mode === 'evidence'", 'What happened', 'Mechanics and causal links', 'Interpretation and uncertainty', 'Sources and claims']) if (!explanationSource.includes(feature)) throw new Error(`Phase 2 explanation output is missing ${feature}.`);
const researchSource = readFileSync('src/components/succession/SuccessionResearchTools.jsx', 'utf8');
for (const feature of ['Bookmark view', 'Chapter changes', 'Investigation board', 'Copy research snapshot', 'Export JSON', 'Export CSV', 'Export Markdown', 'Citation bundle', 'Print / Save PDF', 'SuccessionEvidenceInspector']) if (!researchSource.includes(feature)) throw new Error(`Research interface is missing ${feature}.`);
const intelligenceSource = readFileSync('src/components/succession/SuccessionIntelligencePanels.jsx', 'utf8');
for (const feature of ['Compare canonical records', 'compareDomain', 'Copy comparison link', 'is-different', 'Candidates', 'Evidence for', 'Evidence against', 'Resolution history', 'Open related dossier']) if (!intelligenceSource.includes(feature)) throw new Error(`Phase 3 intelligence interface is missing ${feature}.`);
const evidenceSource = readFileSync('src/components/succession/SuccessionEvidenceInspector.jsx', 'utf8');
for (const feature of ['claim-kind', 'Contradictions', 'Translation variants', 'Page / panel', 'Reviewed']) if (!evidenceSource.includes(feature)) throw new Error(`Phase 3 evidence interface is missing ${feature}.`);
for (const [name, phase] of Object.entries(productCapabilities)) {
  if (!Number.isInteger(phase.phase) || phase.phase < 2 || phase.phase > 5) throw new Error(`${name} has an invalid phase.`);
  if (!phase.capabilities?.length) throw new Error(`${name} has no capability contract.`);
}
console.log(`Product phase audit passed: ${capabilityIds.length} capabilities across Phases 2–5 with completed Phase 2–3 UI enforcement.`);
