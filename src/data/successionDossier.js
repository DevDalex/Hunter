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
import {
  succession375BiscuitTrainingResearch,
  succession375FugetsuDoorResearch,
  succession375GuardianBeastResearch,
  succession375HalkenburgOperation,
  succession375Mysteries,
  succession375RelationshipRecords,
  succession375Room1013BoundaryResearch,
  succession375ShikakuAssessment,
  succession375SourcePolicy,
} from './succession375Research.js';

export * from './successionDossierMaintained.js';

const freeze = (value) => Object.freeze(value);
const source374 = 'https://hunterxhunter.fandom.com/wiki/Chapter_374';
const source375 = 'https://hunterxhunter.fandom.com/wiki/Chapter_375';

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

const guardianBeast375Abilities = freeze([
  freeze({ ability: 'Tyson Guardian Spirit Beast eye-wogs', owner: 'Tyson Hui Guo Rou', category: 'Emitter / diffusive levy', knownAtChapterBoundary: 'Eye-wogs attach to Book of Tyson recipients and collect aura in exchange for happiness; collection scales with how thoroughly the host has read the book.', mechanics: 'Breaking the book’s sole taboo brings severe punishment, but the taboo and punishment are not disclosed.', target: 'Book of Tyson recipients/readers', confidence: 'Core system confirmed / taboo unresolved.', chapter: 375, source: source375 }),
  freeze({ ability: 'Camilla Guardian Spirit Beast coercive control', owner: 'Camilla Hui Guo Rou', category: 'Manipulator / coercive', knownAtChapterBoundary: 'Can control a person once unknown conditions are fulfilled.', mechanics: 'Complete trigger, range, duration, and degree-of-control rules remain unknown.', target: 'Person satisfying unknown conditions', confidence: 'Broad function confirmed / conditions open.', chapter: 375, source: source375 }),
  freeze({ ability: 'Tubeppa Guardian Spirit Beast drug synthesis', owner: 'Tubeppa Hui Guo Rou', category: 'Transmuter / collaborative', knownAtChapterBoundary: 'Can produce various drugs within its body and requires a research partner for activation.', mechanics: 'Eligible partner rules, available drugs, costs, and delivery remain unknown.', target: 'Produced substances / unspecified recipients', confidence: 'Core collaboration requirement confirmed.', chapter: 375, source: source375 }),
  freeze({ ability: 'Luzurus Guardian Spirit Beast desire trap', owner: 'Luzurus Hui Guo Rou', category: 'Conjurer / pseudo-coercive manipulation', knownAtChapterBoundary: 'Conjures something desired by the target as bait and activates when the target takes it.', mechanics: 'Target selection, bait limits, and the post-trigger effect remain incomplete.', target: 'Selected target', confidence: 'Trap structure confirmed / result mechanics open.', chapter: 375, source: source375 }),
  freeze({ ability: 'Halkenburg Guardian Spirit Beast symbiotic fellowship', owner: 'Halkenburg Hui Guo Rou', category: 'Enhancer / symbiotic', knownAtChapterBoundary: 'Feather-marked people gathering around Halkenburg increase collective aura and potential, with greater numbers producing a stronger state.', mechanics: 'The source describes the activated state as exceptionally high-level, while the exact maximum-output trigger and relationship to earlier memory loss remain unresolved.', target: 'Halkenburg and feather-marked fellowship', confidence: 'Collective enhancement confirmed; Shikaku’s memory-revision model remains a separate inference.', chapter: 375, source: source375 }),
  freeze({ ability: 'Marayam Guardian Spirit Beast spatial barrier', owner: 'Marayam Hui Guo Rou', category: 'One-way Nen-space boundary', knownAtChapterBoundary: 'Belerainte’s test proves that an occupant can exit the hidden Room 1013 state but cannot see the occupants or return after leaving.', mechanics: 'Biscuit classifies the boundary as one-way and considers Marayam’s Guardian Spirit Beast the likely source; creation trigger and access exceptions remain unknown.', target: 'Room 1013 occupants / doorway boundary', confidence: 'One-way behavior confirmed / Guardian Spirit Beast authorship probable.', chapter: 375, source: source375 }),
]);

const replacementAbilityNames = new Set([
  'Predator',
  ...guardianBeast375Abilities.map((record) => record.ability),
]);

export const successionAbilities = freeze([
  ...maintained.successionAbilities.filter((record) => !replacementAbilityNames.has(record.ability)),
  predator374Ability,
  ...guardianBeast375Abilities,
].map(normalizeAbilityForLegacyConsumers));

export const successionRelationships = freeze([
  ...maintained.successionRelationships,
  ...succession374RelationshipRecords,
  ...succession375RelationshipRecords,
]);

const isSupersededRoomOrDoorMystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Room 1013')
    || (question.includes('Fugetsu') && (question.includes('door') || question.includes('tunnel')));
};

export const successionMysteries = freeze([
  ...maintained.successionMysteries.filter((record) => !isSupersededRoomOrDoorMystery(record)),
  ...succession374Mysteries.filter((record) => !isSupersededRoomOrDoorMystery(record)),
  ...succession375Mysteries,
]);

export const dossierSources = freeze({
  ...maintained.dossierSources,
  chapter374: source374,
  sourcePolicy374: succession374SourcePolicy,
  chapter375: source375,
  sourcePolicy375: succession375SourcePolicy,
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
  freeze({
    group: 'Chapter 375 one-way space and internal Nen training',
    description: 'Belerainte’s exit test resolves the basic Room 1013 boundary behavior while Biscuit converts Vergei’s skepticism into a second Nen-training program inside the hidden space.',
    records: freeze([
      freeze({ subject: 'Room 1013 boundary test', people: 'Belerainte, Biscuit Krueger, Vergei', notes: 'Belerainte exits successfully but cannot see or return to the hidden occupants; Biscuit identifies a one-way Nen boundary.', status: 'one-way mechanics confirmed / creator still probable', source: source375 }),
      freeze({ subject: 'Hidden Room 1013 Nen training', people: 'Biscuit Krueger, Vergei, Marayam household staff', notes: 'Vergei becomes Biscuit’s trainee and Biscuit begins teaching the staff remaining inside the hidden space.', status: 'active instruction', source: source375 }),
      freeze({ subject: 'Kurapika Nen class return', people: 'Belerainte', notes: 'Vergei permits Belerainte to leave the hidden space and resume Kurapika’s Nen class; the one-way boundary prevents his return.', status: 'Belerainte outside Room 1013 / class route resumed', source: source375 }),
      freeze({ subject: 'Halkenburg observation', people: 'Shikaku', notes: 'Shikaku delays an immediate assassination attempt after witnessing the fellowship aura surge and requests one or two additional Benjamin-aligned people.', status: 'surveillance active / attack delayed', source: source375 }),
    ]),
  }),
]);

export const room1013Chapter374Research = succession374Room1013Research;
export const coalitionChapter374Research = succession374CoalitionResearch;
export const fugetsuDoorChapter374Research = succession374FugetsuDoorResearch;
export const predatorChapter374Research = succession374PredatorResearch;
export const saleSaleBeastChapter374Research = succession374SaleSaleBeastResearch;
export const zhangLeiCoinChapter374Research = succession374ZhangLeiCoinResearch;
export const guardianBeastChapter375Research = succession375GuardianBeastResearch;
export const shikakuChapter375Assessment = succession375ShikakuAssessment;
export const fugetsuDoorChapter375Research = succession375FugetsuDoorResearch;
export const room1013Chapter375BoundaryResearch = succession375Room1013BoundaryResearch;
export const biscuitChapter375TrainingResearch = succession375BiscuitTrainingResearch;
export const halkenburgChapter375OperationResearch = succession375HalkenburgOperation;
