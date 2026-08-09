import * as base from './successionDossierThrough387.js';
import {
  succession388AuraRumblingResearch,
  succession388BillGrowthAbilityResearch,
  succession388ChapterResearch,
  succession388KurapikaBillResearch,
  succession388Mysteries,
  succession388NenClassResearch,
  succession388ObserverHypotheses,
  succession388RelationshipRecords,
  succession388RihanResearch,
  succession388SourcePolicy,
  succession388StealthDolphinResearch,
  succession388TubeppaResearch,
} from './succession388Research.js';

export * from './successionDossierThrough387.js';

const freeze = (value) => Object.freeze(value);
const source388 = 'https://hunterxhunter.fandom.com/wiki/Chapter_388';

const billGrowth388Ability = freeze({
  ability: 'Bill’s Growth Ability',
  user: 'Bill',
  owner: 'Bill',
  type: 'Enhancement · target growth',
  category: 'Growth / accelerated development',
  chapters: '388',
  chapter: 388,
  conditions: 'Chapter 388 demonstrates Bill holding his hands around a water-and-seed glass. The water overflows and the seed sprouts; the synopsis does not establish that the hand position is a universal requirement.',
  mechanics: 'Kurapika identifies Bill as an Enhancer and explains that the ability causes growth of its target. Kurapika then borrows and lends the ability as part of the semi-coercive Nen-awakening procedure.',
  knownAtChapterBoundary: 'Growth effect, Enhancement classification, and use in the class procedure are explicit. Official name, full target rules, costs, range, duration, and maximum effect remain unresolved.',
  target: 'A demonstrated seed target and recipients in the class awakening procedure; broader target eligibility is not established.',
  confidence: 'Direct effect and Nen type confirmed / broader mechanics unresolved.',
  source: source388,
});

export const successionAbilities = freeze([
  ...base.successionAbilities,
  billGrowth388Ability,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession388Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter388: source388,
  sourcePolicy388: succession388SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 388 Room 1014 awakening expansion and Tubeppa negotiation shift',
    description: 'Chapter 388 demonstrates Bill’s unnamed Enhancement growth ability, shows Kurapika lending that borrowed ability through Stealth Dolphin for semi-coercive Nen awakening, records four students awakened that day, advances Tubeppa toward alliance negotiations with Woble’s camp, and closes at Voyage Day 10 11:30 a.m. with the fourth aura rumbling.',
    records: freeze([
      freeze({ subject: 'Four awakened students', people: 'Ladiolus, Maor, Yuri, Satobi', notes: 'The supplied synopsis and note establish these four as the students awakened that day. Individual final Nen types are not supplied.', status: 'four awakenings confirmed / individual categories withheld', source: source388 }),
      freeze({ subject: 'Bill growth demonstration', people: 'Bill, Kurapika, Maor', notes: 'Bill causes a seed to sprout and water to overflow; Kurapika identifies him as an Enhancer whose ability causes growth of the target.', status: 'direct demonstration / official ability name unresolved', source: source388 }),
      freeze({ subject: 'Stealth Dolphin class loan', people: 'Kurapika, Bill, Yuri', notes: 'Yuri receives Bill’s borrowed ability through Stealth Dolphin. Kurapika states that the aura and ability are borrowed rather than Yuri’s own.', status: 'loan demonstrated / universal transfer-awakening rules unresolved', source: source388 }),
      freeze({ subject: 'Tubeppa alliance posture', people: 'Tubeppa Hui Guo Rou, Maor, Longhi, Kurapika', notes: 'Tubeppa authorizes continued alliance negotiations and additional guards in later Nen classes after hearing that the training works.', status: 'negotiation stage confirmed / later formal terms not backdated', source: source388 }),
      freeze({ subject: 'Fourth aura rumbling', people: 'Kurapika, Bill, Oito Hui Guo Rou', notes: 'At 11:30 a.m. on Voyage Day 10 the group feels the fourth aura rumbling, with intervals becoming shorter.', status: 'fourth occurrence and shorter intervals confirmed / immediate target unresolved', source: source388 }),
    ]),
  }),
]);

export const nenClassChapter388Research = succession388NenClassResearch;
export const billGrowthChapter388Research = succession388BillGrowthAbilityResearch;
export const stealthDolphinChapter388Research = succession388StealthDolphinResearch;
export const kurapikaBillChapter388Research = succession388KurapikaBillResearch;
export const tubeppaChapter388Research = succession388TubeppaResearch;
export const rihanChapter388Research = succession388RihanResearch;
export const observerHypothesesChapter388Research = succession388ObserverHypotheses;
export const auraRumblingChapter388Research = succession388AuraRumblingResearch;
export const relationshipsChapter388Research = succession388RelationshipRecords;
export const chapter388Research = succession388ChapterResearch;
