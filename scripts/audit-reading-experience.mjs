import {
  archiveContextModel,
  archiveEntryMissions,
  explanationModes,
  getArchiveContextForBoundary,
} from '../src/data/succession/readingExperience.js';

const unique = (items, field) => new Set(items.map((item) => item[field])).size === items.length;

if (!unique(archiveEntryMissions, 'id')) throw new Error('Archive entry mission IDs must be unique.');
if (!unique(explanationModes, 'id')) throw new Error('Explanation mode IDs must be unique.');

for (const mission of archiveEntryMissions) {
  if (!mission.label || !mission.description || !mission.target) {
    throw new Error(`Archive entry mission ${mission.id} is incomplete.`);
  }
}

for (const mode of explanationModes) {
  if (!mode.label || !mode.description) throw new Error(`Explanation mode ${mode.id} is incomplete.`);
}

const latestContext = getArchiveContextForBoundary(archiveContextModel.fullyIndexedChapter.chapter);
if (!latestContext.isFullyIndexed) throw new Error('The fully indexed boundary must report fully indexed.');

const earlierContext = getArchiveContextForBoundary(Math.max(1, archiveContextModel.fullyIndexedChapter.chapter - 1));
if (!earlierContext.laterInformationHidden) throw new Error('Earlier boundaries must hide later information.');

console.log(`Reading experience audit passed: ${archiveEntryMissions.length} missions, ${explanationModes.length} explanation modes.`);
