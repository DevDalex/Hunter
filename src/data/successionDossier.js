import * as maintained from './successionDossierMaintained.js';
import {
  succession374CoalitionResearch,
  succession374FugetsuDoorResearch,
  succession374Mysteries,
  succession374PredatorResearch,
  succession374RelationshipRecords,
  succession374Room1013Research,
  succession374SaleSaleBeastResearch,
  succession374SourcePolicy,
  succession374ZhangLeiCoinResearch,
} from './succession374Research.js';

export * from './successionDossierMaintained.js';

const freeze = (value) => Object.freeze(value);
const source374 = 'https://hunterxhunter.fandom.com/wiki/Chapter_374';

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

const predator374Ability = freeze({
  ability: 'Predator',
  owner: 'Rihan',
  category: succession374PredatorResearch.category,
  knownAtChapterBoundary: 'Rihan chooses a target and develops a tailored predator whose effectiveness depends on accurate unaided analysis of the target ability from a state of ignorance.',
  mechanics: 'Greater analytical accuracy produces a stronger counter. The supplied Chapter 374 notes state Predator is powerless against simple Enhancer and Emitter attacks.',
  target: 'Salé-salé’s Guardian Spirit Beast in Chapter 374',
  confidence: 'Core mechanics confirmed; complete operating envelope remains open.',
  chapter: 374,
  source: source374,
});

export const successionAbilities = freeze([
  ...maintained.successionAbilities.filter((record) => record.ability !== 'Predator'),
  predator374Ability,
].map(normalizeAbilityForLegacyConsumers));

export const successionRelationships = freeze([
  ...maintained.successionRelationships,
  ...succession374RelationshipRecords,
]);

const room1013Questions = new Set([
  'What mechanism creates the incompatible occupied and empty states of Room 1013?',
  'What mechanism creates the empty Room 1013 state encountered by Hanzo?',
]);

export const successionMysteries = freeze([
  ...maintained.successionMysteries.filter((record) => !room1013Questions.has(record.question)),
  ...succession374Mysteries,
]);

export const dossierSources = freeze({
  ...maintained.dossierSources,
  chapter374: source374,
  sourcePolicy374: succession374SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...maintained.guardAssignmentGroups,
  freeze({
    group: 'Chapter 374 Room 1013 and coalition state',
    description: 'Kurapika shares the Room 1013 anomaly with Sakata while continuing to seek younger-prince coalition cooperation from a deeply distrustful Vergei.',
    records: freeze([
      freeze({ subject: 'Room 1013 investigation', people: 'Kurapika, Hanzo, Vergei, Sakata, Babimyna', notes: 'Hanzo still sees an empty state; Kurapika proposes Nen-based spatial displacement and suspects a defensive mechanism from Marayam’s Guardian Spirit Beast.', status: 'active investigation / mechanism unresolved', source: source374 }),
      freeze({ subject: 'Younger-prince coalition', people: 'Kurapika, Vergei', notes: 'Vergei offers Momoze’s former professional Hunters, but Kurapika refuses the personnel exchange and continues to seek prince-level coalition support.', status: 'negotiation open / trust not secured', source: source374 }),
    ]),
  }),
]);

export const room1013Chapter374Research = succession374Room1013Research;
export const coalitionChapter374Research = succession374CoalitionResearch;
export const fugetsuDoorChapter374Research = succession374FugetsuDoorResearch;
export const predatorChapter374Research = succession374PredatorResearch;
export const saleSaleBeastChapter374Research = succession374SaleSaleBeastResearch;
export const zhangLeiCoinChapter374Research = succession374ZhangLeiCoinResearch;
