import * as base from './successionDossierThrough385.js';
import {
  succession386BodyStates,
  succession386ChapterResearch,
  succession386GuardianBeastObservationResearch,
  succession386HalkenburgArrowResearch,
  succession386JusticeResearch,
  succession386Mysteries,
  succession386NenClassResearch,
  succession386RelationshipRecords,
  succession386ResolvedQuestions,
  succession386SourcePolicy,
  succession386ThetaForensicsResearch,
  succession386TserriednichTrainingResearch,
} from './succession386Research.js';

export * from './successionDossierThrough385.js';

const freeze = (value) => Object.freeze(value);
const source386 = 'https://hunterxhunter.fandom.com/wiki/Chapter_386';

const halkenburgArrow386Ability = freeze({
  ability: 'Halkenburg collective possession arrow',
  user: 'Halkenburg Hui Guo Rou',
  owner: 'Halkenburg Hui Guo Rou',
  type: 'Collective symbiotic body-will transfer attack / consciousness topology still unresolved',
  category: 'Collective symbiotic body-will transfer attack',
  chapters: '382, 386',
  chapter: 386,
  conditions: 'Chapter 382 establishes the collective fellowship aura, bow-and-arrow strike, follower collapse, and target-body control. Chapter 386 treats Sumidori as the consciousness controlling Shikaku’s body and deliberately tests what occurs when that occupied body dies.',
  mechanics: 'Halkenburg lists four possible locations/states for Shikaku’s original consciousness. The Sumidori-controlled Shikaku body then commits suicide. Sumidori’s original body wakes afterward and Halkenburg begins an identity check by asking for post and service number, but the supplied synopsis ends before the answer. The exact return rule and Shikaku consciousness state therefore remain unresolved.',
  knownAtChapterBoundary: 'The controller of Shikaku’s body is treated by Halkenburg’s group as Sumidori, and occupied-body death is followed by Sumidori’s original body waking. The awakened identity and Shikaku’s original consciousness remain unresolved at the endpoint.',
  target: 'Shikaku in the first documented exchange; Chapter 386 is a follow-up experiment rather than a new arrow target.',
  confidence: 'Observed transfer experiment confirmed / Shikaku consciousness and post-death return topology unresolved.',
  source: source386,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => record.ability !== 'Halkenburg collective possession arrow'),
  halkenburgArrow386Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession386RelationshipRecords,
]);

export const bodyStateLedger = freeze([
  ...(base.bodyStateLedger || []),
  ...succession386BodyStates,
]);

const superseded386Mystery = (record) => {
  const question = String(record.question || '');
  return (question.includes('Theta') && question.includes('Tserriednich') && (question.includes('die') || question.includes('skipped interval')))
    || (question.includes('Shikaku') && (question.includes('conscious') || question.includes('will')));
};

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded386Mystery(record)),
  ...succession386Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession386ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter386: source386,
  sourcePolicy386: succession386SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 386 Day 9 consciousness testing, Justice protection, and Nen-class escalation',
    description: 'Chapter 386 opens Voyage Day 9 by adding forensic evidence to Theta’s bloodless apparent assassination scene, keeping Melody and the surviving twin operation under Justice questioning, and turning Halkenburg’s first possession-arrow exchange into a deliberate consciousness experiment. Kurapika simultaneously advances the Room 1014 class into Water Divination while Tserriednich trains toward faster Zetsu activation.',
    records: freeze([
      freeze({ subject: 'Theta / Salkov forensic check', people: 'Theta, Salkov, Tserriednich Hui Guo Rou', notes: 'Salkov uses luminol where Theta remembers Tserriednich’s corpse and finds no blood. This strengthens the conclusion that the apparent Chapter 385 death did not leave an ordinary physical trace without yet supplying the complete temporal mechanism.', status: 'no-blood result confirmed / complete Parallel Future mechanics still withheld', source: source386 }),
      freeze({ subject: 'Melody under Justice questioning', people: 'Melody, Kaiser, Keeney, Fugetsu Hui Guo Rou, Kacho-form Without You', notes: 'Keeney’s suicide note claims sole responsibility and the two girls say he forced them onto the lifeboat. Kaiser says neither version is proved or disproved. Biological Kacho remains dead; the Kacho-form participant is Without You.', status: 'questioning and protection continue / escape cover accounts unresolved', source: source386 }),
      freeze({ subject: 'Halkenburg consciousness models', people: 'Halkenburg Hui Guo Rou, Sumidori, Shikaku', notes: 'Halkenburg explicitly lists four possibilities for Shikaku’s original consciousness and admits he needs Nen expertise before treating any one model as established.', status: 'four models formalized / no model confirmed', source: source386 }),
      freeze({ subject: 'Shikaku-body suicide experiment', people: 'Sumidori, Shikaku, Halkenburg Hui Guo Rou, Basho, Benjamin Hui Guo Rou, Balsamilco Might', notes: 'The consciousness treated as Sumidori makes Shikaku’s body shoot itself outside Luzurus’s quarters. The Shikaku body dies; Benjamin’s side treats the event as evidence of Halkenburg’s threat.', status: 'Shikaku body deceased / Shikaku original consciousness unresolved', source: source386 }),
      freeze({ subject: 'Sumidori original-body wakeup', people: 'Halkenburg Hui Guo Rou, Sumidori', notes: 'Sumidori’s original body wakes after the Shikaku body dies. Halkenburg asks for post and service number to identify the consciousness, but the supplied chapter packet ends before the response.', status: 'original body awake / occupant identity not yet confirmed', source: source386 }),
      freeze({ subject: 'Room 1014 Water Divination', people: 'Kurapika, Bill, Ladiolus, Satobi, Babimyna, Furykov', notes: 'Kurapika demonstrates Water Divination, identifies his displayed result as Specialization, and makes private Nen-type disclosure part of the class’s information price and stalemate strategy.', status: 'class advances / Nen-type intelligence becomes explicit payment', source: source386 }),
      freeze({ subject: 'Woble and Tubeppa beast surveillance', people: 'Babimyna, Furykov, Rihan, Woble Hui Guo Rou, Tubeppa Hui Guo Rou', notes: 'Both beasts remain unavailable to the observers. Babimyna’s age and counterattack explanations for Woble remain hypotheses.', status: 'nonappearance confirmed / explanation unresolved', source: source386 }),
      freeze({ subject: 'Tserriednich Zetsu response target', people: 'Tserriednich Hui Guo Rou, Salkov', notes: 'Tserriednich says he is shortening his Zetsu response time and will spar once he can enter it in less than one second.', status: 'sub-second target stated / not yet achieved', source: source386 }),
    ]),
  }),
]);

export const thetaForensicsChapter386Research = succession386ThetaForensicsResearch;
export const justiceChapter386Research = succession386JusticeResearch;
export const halkenburgArrowChapter386Research = succession386HalkenburgArrowResearch;
export const nenClassChapter386Research = succession386NenClassResearch;
export const guardianBeastObservationChapter386Research = succession386GuardianBeastObservationResearch;
export const tserriednichTrainingChapter386Research = succession386TserriednichTrainingResearch;
export const chapter386Research = succession386ChapterResearch;
