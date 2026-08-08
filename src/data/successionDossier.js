import * as maintained from './successionDossierMaintained.js';

export * from './successionDossierMaintained.js';

const freeze = (value) => Object.freeze(value);

const legacyChapterLabel = (record) => {
  const value = record.chapters ?? record.chapter;
  if (value === null || value === undefined || value === '') return 'Unassigned';
  return String(value);
};

const legacyConditionSummary = (record) => {
  if (record.conditions) return record.conditions;
  if (record.knownAtChapterBoundary) return record.knownAtChapterBoundary;
  if (record.confidence) return record.confidence;
  return 'Complete conditions remain unknown.';
};

const normalizeAbilityForLegacyConsumers = (record) => freeze({
  ...record,
  user: record.user || record.owner || 'Unknown',
  owner: record.owner || record.user || 'Unknown',
  type: record.type || record.category || 'Unknown / unclassified',
  category: record.category || record.type || 'Unknown / unclassified',
  chapters: legacyChapterLabel(record),
  conditions: legacyConditionSummary(record),
  mechanics: record.mechanics || record.knownAtChapterBoundary || 'Complete mechanics remain unknown.',
});

export const successionAbilities = freeze(
  maintained.successionAbilities.map(normalizeAbilityForLegacyConsumers),
);
