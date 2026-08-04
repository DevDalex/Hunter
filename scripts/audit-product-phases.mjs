import { productCapabilities, capabilityIds } from '../src/data/productCapabilities.js';
import { performancePolicy } from '../src/data/performancePolicy.js';
import { archiveEntryMissions, explanationModes } from '../src/data/succession/readingExperience.js';
import { certaintyLevels, claimKinds, questionStatuses } from '../src/data/succession/researchSemantics.js';
import { comparisonDomains } from '../src/lib/succession/comparison.js';
import { chapterChangeKinds } from '../src/lib/succession/chapterDiff.js';
import { publicExportPolicy } from '../src/lib/succession/shareAndExport.js';

const unique = (values, label) => {
  if (new Set(values).size !== values.length) throw new Error(`${label} contains duplicate identifiers.`);
};

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

for (const [name, phase] of Object.entries(productCapabilities)) {
  if (!Number.isInteger(phase.phase) || phase.phase < 2 || phase.phase > 5) throw new Error(`${name} has an invalid phase.`);
  if (!phase.capabilities?.length) throw new Error(`${name} has no capability contract.`);
}

console.log(`Product phase audit passed: ${capabilityIds.length} capabilities across Phases 2–5.`);
