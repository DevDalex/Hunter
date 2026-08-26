import * as base from './successionDossierThrough378.js';
import {
  succession379CashewDeceptionResearch,
  succession379ChaRTroupeResearch,
  succession379FranklinStrategyResearch,
  succession379LuiniProgressionResearch,
  succession379LuiniTransportResearch,
  succession379Mysteries,
  succession379RelationshipRecords,
  succession379SourcePolicy,
} from './succession379Research.js';

export * from './successionDossierThrough378.js';

const freeze = (value) => Object.freeze(value);
const source379 = 'https://hunterxhunter.fandom.com/wiki/Chapter_379';

const luiniTransportAbility = freeze({
  ability: 'Luini transportation ability',
  user: 'Luini',
  owner: 'Luini',
  type: 'Spatial transportation / marked-location travel',
  category: 'Spatial transportation / marked-location travel',
  chapters: '379',
  chapter: 379,
  conditions: 'Luini must be inside a sealed room with exactly one door; marked destinations can be reached while the room remains sealed, and opening the door resets the setup.',
  mechanics: 'Travel occurs through the walls of the sealed room to marked locations. Luini can return to the origin while its only door remains closed. The official ability name, maximum range, mark capacity, and complete marking procedure remain unknown.',
  knownAtChapterBoundary: 'Sealed one-door origin, marked destinations, return while the door remains closed, and door-opening reset are confirmed.',
  target: 'Luini / spatial route between origin room and marked destinations',
  confidence: 'Core Chapter 379 mechanics confirmed / official name and full operating envelope open.',
  source: source379,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => record.ability !== 'Luini transportation ability'),
  luiniTransportAbility,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession379RelationshipRecords,
]);

const superseded379Mystery = (record) => {
  const question = String(record.question || '');
  return question.includes('Luini')
    || (question.includes('Hisoka') && (question.includes('where') || question.includes('Where')))
    || (question.includes('Cha-R') && question.includes('Phantom Troupe'));
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded379Mystery(record)),
  ...succession379Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter379: source379,
  sourcePolicy379: succession379SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 379 lower-tier counterintelligence and tactical alignment',
    description: 'Heil-Ly compromises the Tier 3 investigation through Cashew, Luini’s spatial rules become explicit, Franklin holds Tier 5 for Hisoka, and Cha-R proposes temporary cooperation with the Troupe under concealed hostility.',
    records: freeze([
      freeze({ subject: 'Cashew witness operation', people: 'Cashew, Luini, Mizaistom', notes: 'Cashew is a Heil-Ly accomplice deliberately mixing truths and lies to test the Royal Army and Hunter Association investigation.', status: 'investigation compromised / deception active', source: source379 }),
      freeze({ subject: 'Luini spatial route', people: 'Luini, Cha-R Family', notes: 'A sealed one-door room functions as Luini’s origin hub; he travels to marked destinations and loses the setup when the origin door is opened. He kills three more Cha-R guards and reaches level 24.', status: 'transport rules confirmed / Cha-R hideout penetrated', source: source379 }),
      freeze({ subject: 'Franklin Hisoka interception', people: 'Franklin, Hisoka', notes: 'Franklin remains on Tier 5 and waits for Hisoka to reveal himself rather than joining the active search.', status: 'passive interception strategy active', source: source379 }),
      freeze({ subject: 'Cha-R / Phantom Troupe cooperation', people: 'Ken’i Wang, Nobunaga, Phinks, Feitan', notes: 'Wang clears the trio of the warehouse attack and proposes collaboration while privately deciding the Troupe should eventually be crushed.', status: 'tactical cooperation proposed / strategic hostility concealed', source: source379 }),
    ]),
  }),
]);

export const cashewChapter379DeceptionResearch = succession379CashewDeceptionResearch;
export const luiniChapter379TransportResearch = succession379LuiniTransportResearch;
export const luiniChapter379ProgressionResearch = succession379LuiniProgressionResearch;
export const franklinChapter379StrategyResearch = succession379FranklinStrategyResearch;
export const chaRTroupeChapter379Research = succession379ChaRTroupeResearch;
