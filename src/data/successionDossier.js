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
import {
  succession376BelerainteAllianceResearch,
  succession376CourtResearch,
  succession376DayMarkers,
  succession376FugetsuDoorResearch,
  succession376HalkenburgAppealResearch,
  succession376MosquitoneResearch,
  succession376Mysteries,
  succession376RelationshipRecords,
  succession376SilentMajorityResearch,
  succession376SourcePolicy,
  succession376TserriednichNenResearch,
  succession376ZhangLeiCoinResearch,
} from './succession376Research.js';
import {
  succession377IllumiContractResearch,
  succession377KachoBeastResearch,
  succession377KachoEscapeResearch,
  succession377LovelyGhostwriterResearch,
  succession377MafiaTierResearch,
  succession377MetamorphorsenResearch,
  succession377Mysteries,
  succession377RelationshipRecords,
  succession377SourcePolicy,
  succession377TroupeSearchResearch,
} from './succession377Research.js';

export * from './successionDossierMaintained.js';

const freeze = (value) => Object.freeze(value);
const source374 = 'https://hunterxhunter.fandom.com/wiki/Chapter_374';
const source375 = 'https://hunterxhunter.fandom.com/wiki/Chapter_375';
const source376 = 'https://hunterxhunter.fandom.com/wiki/Chapter_376';
const source377 = 'https://hunterxhunter.fandom.com/wiki/Chapter_377';

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

const metamorphorsen377Ability = freeze({
  ability: 'Battle Cantabile: Metamorphorsen',
  owner: 'Bonolenov Ndongo',
  category: 'Transformation / disguise',
  knownAtChapterBoundary: succession377MetamorphorsenResearch.demonstratedFunction,
  mechanics: 'Bonolenov can transform into various things/forms; complete transformation range, duration, activation details, costs, and copied properties are not established in Chapter 377.',
  target: 'Bonolenov / self-transformation',
  confidence: 'Core transformation function confirmed / detailed mechanics open.',
  chapter: 377,
  source: source377,
});

const replacementAbilityNames = new Set([
  'Predator',
  'Battle Cantabile: Metamorphorsen',
  ...guardianBeast375Abilities.map((record) => record.ability),
]);

export const successionAbilities = freeze([
  ...maintained.successionAbilities.filter((record) => !replacementAbilityNames.has(record.ability)),
  predator374Ability,
  ...guardianBeast375Abilities,
  metamorphorsen377Ability,
].map(normalizeAbilityForLegacyConsumers));

export const successionRelationships = freeze([
  ...maintained.successionRelationships,
  ...succession374RelationshipRecords,
  ...succession375RelationshipRecords,
  ...succession376RelationshipRecords,
  ...succession377RelationshipRecords,
]);

const isSupersededRoomOrDoorMystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Room 1013')
    || (question.includes('Fugetsu') && (question.includes('door') || question.includes('tunnel')));
};

const isSuperseded376Mystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Silent Majority')
    || (question.includes('Zhang Lei') && question.includes('coin'))
    || (question.includes('Fugetsu') && (question.includes('door') || question.includes('tunnel')))
    || (question.includes('Theta') && question.includes('wound'));
};

const isSuperseded377Mystery = (record) => {
  const question = String(record.question || '');
  return (question.includes('Kacho') && question.includes('Guardian Spirit Beast'))
    || (question.includes('Hisoka') && (question.includes('where') || question.includes('Where')))
    || question.includes('Metamorphorsen')
    || question.includes('Lovely Ghostwriter')
    || question.includes('Neon Nostrade');
};

const priorMysteries = [
  ...maintained.successionMysteries.filter((record) => !isSupersededRoomOrDoorMystery(record)),
  ...succession374Mysteries.filter((record) => !isSupersededRoomOrDoorMystery(record)),
  ...succession375Mysteries,
];

const through376Mysteries = [
  ...priorMysteries.filter((record) => !isSuperseded376Mystery(record)),
  ...succession376Mysteries,
];

export const successionMysteries = freeze([
  ...through376Mysteries.filter((record) => !isSuperseded377Mystery(record)),
  ...succession377Mysteries,
]);

export const dossierSources = freeze({
  ...maintained.dossierSources,
  chapter374: source374,
  sourcePolicy374: succession374SourcePolicy,
  chapter375: source375,
  sourcePolicy375: succession375SourcePolicy,
  chapter376: source376,
  sourcePolicy376: succession376SourcePolicy,
  chapter377: source377,
  sourcePolicy377: succession377SourcePolicy,
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
  freeze({
    group: 'Chapter 376 class, court, and covert-channel state',
    description: 'The third voyage day turns Kurapika’s public class into an even sharper trust crisis while royal judicial containment and covert communications expand around it; the chapter then crosses into Day 4 for Fugetsu and Tserriednich developments.',
    records: freeze([
      freeze({ subject: 'Room 1014 Silent Majority crisis', people: 'Kurapika, Belerainte, Maor, Satobi, Myuhan', notes: 'Myuhan is killed by Silent Majority. Maor and Satobi suspect the course, while Belerainte argues that canceling it would let the assassin escape.', status: 'class continues / assassin unidentified / Myuhan deceased', source: source376 }),
      freeze({ subject: 'Room 1013 covert reporting', people: 'Belerainte, Bill, Hanzo, Vergei', notes: 'Belerainte uses a natural conversation with Bill near the boundary as cover for passing information toward the hidden Room 1013 side.', status: 'covert reporting active', source: source376 }),
      freeze({ subject: 'Benjamin–Camilla judicial containment', people: 'Benjamin, Camilla, Cleapatro, Balsamilco', notes: 'The case is postponed; both princes are monitored while Rooms 1001 and 1002 are searched. Benjamin retains Secret Window surveillance of Camilla.', status: 'court surveillance active', source: source376 }),
      freeze({ subject: 'Kacho–Melody covert channel', people: 'Kacho, Melody', notes: 'Mosquitone devices and Morse code establish a private communication route under the cover of studying.', status: 'secret channel active', source: source376 }),
    ]),
  }),
  freeze({
    group: 'Chapter 377 twin escape and Troupe hunt state',
    description: 'Kacho and Melody convert covert communication into a banquet escape operation while the Phantom Troupe reorganizes its Hisoka hunt around lower-tier mafia access and disguise tactics.',
    records: freeze([
      freeze({ subject: 'Kacho–Fugetsu banquet escape plan', people: 'Kacho, Fugetsu, Melody, Keeney', notes: 'The next Sunday music show becomes the planned escape window. Melody wants the performance broadcast across Tier 1 while performers can wait in the passageway.', status: 'escape operation developing', source: source377 }),
      freeze({ subject: 'Kacho Guardian Spirit Beast', people: 'Kacho, Melody, Keeney', notes: 'No usable information about the beast is available to the protection team.', status: 'unobserved / tactical role unknown', source: source377 }),
      freeze({ subject: 'Phantom Troupe Hisoka hunt', people: 'Chrollo, Illumi, Shizuku, Bonolenov, Phinks', notes: 'Tier 5 search fails; Chrollo keeps Hisoka as the priority, Illumi reveals his assassination contract, and Shizuku/Bonolenov join Chrollo for disguise-based searching.', status: 'decentralized hunt active', source: source377 }),
      freeze({ subject: 'Cha-R / Troupe contact', people: 'Cha-R Family, Phantom Troupe, Sun-bin, Ken’i Wang', notes: 'Chrollo refuses Cha-R recruitment and asks about Tier 1; Cha-R subsequently judges the Troupe uncontrollable and moves to obstruct them.', status: 'relationship shifting toward opposition', source: source377 }),
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
export const voyageChapter376DayMarkers = succession376DayMarkers;
export const halkenburgChapter376AppealResearch = succession376HalkenburgAppealResearch;
export const benjaminCamillaChapter376CourtResearch = succession376CourtResearch;
export const silentMajorityChapter376Research = succession376SilentMajorityResearch;
export const belerainteChapter376AllianceResearch = succession376BelerainteAllianceResearch;
export const mosquitoneChapter376Research = succession376MosquitoneResearch;
export const zhangLeiCoinChapter376Research = succession376ZhangLeiCoinResearch;
export const fugetsuDoorChapter376Research = succession376FugetsuDoorResearch;
export const tserriednichChapter376NenResearch = succession376TserriednichNenResearch;
export const kachoEscapeChapter377Research = succession377KachoEscapeResearch;
export const kachoBeastChapter377Research = succession377KachoBeastResearch;
export const mafiaTierChapter377Research = succession377MafiaTierResearch;
export const illumiContractChapter377Research = succession377IllumiContractResearch;
export const troupeSearchChapter377Research = succession377TroupeSearchResearch;
export const metamorphorsenChapter377Research = succession377MetamorphorsenResearch;
export const lovelyGhostwriterChapter377Research = succession377LovelyGhostwriterResearch;
