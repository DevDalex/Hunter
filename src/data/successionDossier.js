import * as base from './successionDossierThrough383.js';
import {
  succession384MafiaProtocolResearch,
  succession384MorenaLocationResearch,
  succession384Mysteries,
  succession384RelationshipRecords,
  succession384SecondTrackFakerResearch,
  succession384SourcePolicy,
  succession384TroupeMafiaResearch,
  succession384TserriednichBeastResearch,
  succession384ZetsuTrainingResearch,
} from './succession384Research.js';

export * from './successionDossierThrough383.js';

const freeze = (value) => Object.freeze(value);
const source384 = 'https://hunterxhunter.fandom.com/wiki/Chapter_384';

const tserriednichSpecialistBeast384Ability = freeze({
  ability: 'Tserriednich’s Instinctive Specialist Nen Beast',
  user: 'Tserriednich Hui Guo Rou',
  owner: 'Tserriednich Hui Guo Rou',
  type: 'Instinctively manifested Specialist Nen beast / full ability unresolved',
  category: 'Specialist Nen-beast manifestation',
  chapters: '384',
  chapter: 384,
  conditions: 'Theta identifies the second beast as a product of Tserriednich’s own Specialist Nen that manifested instinctively and without his conscious intent. It is separate from his Seed Urn Guardian Spirit Beast.',
  mechanics: 'A dark aura mass and second Nen beast appear around Tserriednich during training. Theta calls it his alter ego, but Chapter 384 does not supply an official ability name or reveal its complete function, targets, costs, range, or later relationship to other abilities.',
  knownAtChapterBoundary: 'Existence, Specialist origin, unintended manifestation, and separation from the Seed Urn Guardian Spirit Beast are confirmed. Complete mechanics are not.',
  target: 'Unknown.',
  confidence: 'Core manifestation confirmed / official name and complete ability unresolved.',
  source: source384,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => record.ability !== 'Tserriednich’s Instinctive Specialist Nen Beast'),
  tserriednichSpecialistBeast384Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession384RelationshipRecords,
]);

export const bodyStateLedger = freeze([...(base.bodyStateLedger || [])]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession384Mysteries,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter384: source384,
  sourcePolicy384: succession384SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 384 mafia-war flashback and Tserriednich Nen escalation',
    description: 'Chapter 384 rewinds to Voyage Day 7 at 10:30 p.m. The Cha-R leadership and Phantom Troupe compare the disappearance crisis, define the Kakin mafia hit-and-raid settlement procedure, and make Morena’s location the hinge between settlement and open war. The chapter also identifies the three mafia bosses as Second-track Fakers, then reveals that Tserriednich has instinctively created a second Specialist Nen beast while Theta advances him into Zetsu training.',
    records: freeze([
      freeze({ subject: 'Cha-R / Phantom Troupe briefing', people: 'Ken’i Wang, Tajao, Phinks Magcub, Nobunaga Hazama', notes: 'Ken’i reports eight missing Cha-R men and more than 300 missing workers overall. Phinks offers to kill the hitman if the Troupe can obtain Xi-Yu permission to search Tier 4 for Hisoka.', status: 'conditional tactical cooperation / several hitman-route deductions remain hypotheses', source: source384 }),
      freeze({ subject: 'Kakin mafia conflict protocol', people: 'Ken’i Wang, Tajao, Cha-R, Xi-Yu, Heil-Ly', notes: 'The chapter presents a boss-notification and settlement procedure for inter-family hits and raids, including a twenty-four-hour notice window and an away-from-home-turf condition. Morena’s location determines whether the unresolved incident can still fit that procedure.', status: 'procedure clarified / Morena-location hinge unresolved', source: source384 }),
      freeze({ subject: 'Phantom Troupe / Heil-Ly war risk', people: 'Phantom Troupe, Heil-Ly Family, Morena Prudo', notes: 'Tajao says killing the hitman will put the Spiders at war with Heil-Ly. Nobunaga accepts the cost and proposes killing Morena, while Phinks prioritizes gathering the Troupe and hunting the hitman first.', status: 'prospective hostility accepted / direct Morena attack not yet executed', source: source384 }),
      freeze({ subject: 'Second-track Fakers', people: 'Onior Longbao, Brocco Li, Morena Prudo', notes: 'The three mafia bosses are identified as Second-track Fakers, illegitimate royal heirs allowed to live and covertly compensated while remaining outside the spotlight and obeying the monarchy system. Morena’s Tier 1 room is empty.', status: 'shared royal-mafia status revealed / Morena exact location unresolved', source: source384 }),
      freeze({ subject: 'Tserriednich / Morena search', people: 'Tserriednich Hui Guo Rou, Morena Prudo', notes: 'Tserriednich says Morena is absent from the VVIP area, estimates that she has probably been in the lower tiers since boarding, and orders lower-tier soldiers to search for her hideout.', status: 'search order active / lower-tier history remains Tserriednich estimate', source: source384 }),
      freeze({ subject: 'Tserriednich second Nen beast', people: 'Tserriednich Hui Guo Rou, Theta', notes: 'Theta recognizes a second Nen beast created instinctively from Tserriednich’s own Specialist Nen, distinct from the Seed Urn Guardian Spirit Beast. She calls it his alter ego, but no official name or full function is supplied.', status: 'second Nen beast confirmed / mechanics unresolved', source: source384 }),
      freeze({ subject: 'Theta Zetsu training', people: 'Theta, Tserriednich Hui Guo Rou', notes: 'Theta advances Tserriednich to sustained Zetsu practice after assessing his Ten and Ren progress. She privately thinks she can do “it” tomorrow if necessary, but the intended action is not identified in the supplied synopsis.', status: 'Zetsu training begun / Theta next-day action unresolved', source: source384 }),
    ]),
  }),
]);

export const troupeMafiaChapter384Research = succession384TroupeMafiaResearch;
export const mafiaProtocolChapter384Research = succession384MafiaProtocolResearch;
export const secondTrackFakersChapter384Research = succession384SecondTrackFakerResearch;
export const morenaLocationChapter384Research = succession384MorenaLocationResearch;
export const tserriednichSpecialistBeastChapter384Research = succession384TserriednichBeastResearch;
export const zetsuTrainingChapter384Research = succession384ZetsuTrainingResearch;
