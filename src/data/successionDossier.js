import * as base from './successionDossierBase.js';
import {
  succession370BodyStates,
  succession370ChapterFocus,
  succession370ChapterResearch,
  succession370Counterintelligence,
  succession370FurykovMethod,
  succession370Mysteries,
  succession370RelationshipRecords,
  succession370SilentMajorityMechanics,
  succession370SourcePolicy,
} from './succession370Research.js';
import {
  succession371ChapterFocus,
  succession371ChapterResearch,
  succession371CustodyRecords,
  succession371GuardianBeastTheory,
  succession371LegalInvestigation,
  succession371MafiaPrinceLinks,
  succession371Mysteries,
  succession371NenClassStructure,
  succession371RelationshipRecords,
  succession371RitualCapsuleResearch,
  succession371SourcePolicy,
  succession371TroupeSearchResearch,
} from './succession371Research.js';

export * from './successionDossierBase.js';

const source370 = 'https://hunterxhunter.fandom.com/wiki/Chapter_370';
const source371 = 'https://hunterxhunter.fandom.com/wiki/Chapter_371';
const freeze = (value) => Object.freeze(value);

export const chapterFocus = freeze({
  ...base.chapterFocus,
  ...succession370ChapterFocus,
  ...succession371ChapterFocus,
});

export const successionChapterResearch = freeze([
  ...base.successionChapterResearch.filter((record) => ![370, 371].includes(record.number)),
  ...succession370ChapterResearch,
  ...succession371ChapterResearch,
].sort((left, right) => left.number - right.number));

const silentMajority370Ability = freeze({
  ability: 'Silent Majority',
  owner: 'Unknown',
  category: 'Possession-assisted curse / blood-draining attack',
  knownAtChapterBoundary: 'The user operates a marionette visible only to the user and its possessed person; Loberry is possessed during the class. The marionette has ten people within its selectable possession range, and failure to kill before deactivation rebounds the curse onto the user.',
  mechanics: 'Four snake-like curse entities can attack together and drain a victim’s blood; the user states that all four can exsanguinate a body in eleven seconds.',
  target: 'Barrigen is the confirmed Chapter 370 victim.',
  confidence: 'Chapter 370 confirms the visibility rule, ten-person selection window, rebound condition, four snakes, Barrigen’s death, and the eleven-second four-snake drain. Chapter 371 detains Loberry as a suspect but does not identify the actual user.',
  chapter: 370,
  source: source370,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !(record.ability === 'Silent Majority' && record.chapter === 369)),
  silentMajority370Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession370RelationshipRecords,
  ...succession371RelationshipRecords,
]);

export const bodyStateLedger = freeze([
  ...base.bodyStateLedger,
  ...succession370BodyStates,
]);

const supersededMysteryQuestions = new Set([
  'Who or what killed Woody and the four other Oito guards by draining their blood?',
  'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
  'Who is using Silent Majority inside Room 1014, and what does the ability do?',
  'Who are the four concealed Nen users Furykov believes are pretending to be beginners?',
]);

const superseded370MysteryQuestions = new Set([
  'Who is the Silent Majority user inside or connected to the Room 1014 class?',
]);

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !supersededMysteryQuestions.has(record.question)),
  freeze({
    question: 'Who or what killed Woody and the four other Oito guards by draining their blood?',
    evidence: 'Chapter 370 demonstrates Silent Majority killing Barrigen with four blood-draining snakes in a pattern explicitly compared by the supplied notes to the Chapter 359 deaths. This disproves the theory that Woble’s Guardian Spirit Beast caused those deaths, but Chapters 370–371 still do not identify the earlier killer as the same Silent Majority user.',
    status: 'Woble Guardian Beast theory disproved / killer identity still open',
    lastChapter: '371',
    source: source371,
  }),
  freeze({
    question: 'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
    evidence: 'By Chapter 370 Babimyna has concluded that the cockroach-control ability demonstrated in Chapter 367 was not Bill’s actual ability. Chapter 371 does not establish that he has identified Oito as the true temporary user.',
    status: 'cover broken / Oito attribution not yet confirmed',
    lastChapter: '371',
    source: source371,
  }),
  ...succession370Mysteries.filter((record) => !superseded370MysteryQuestions.has(record.question)),
  ...succession371Mysteries,
]);

export const silentMajorityChapter370Research = succession370SilentMajorityMechanics;
export const furykovChapter370MethodResearch = succession370FurykovMethod;
export const room1014Chapter370CounterintelligenceResearch = succession370Counterintelligence;
export const chapter371LegalInvestigationResearch = succession371LegalInvestigation;
export const chapter371NenClassStructureResearch = succession371NenClassStructure;
export const guardianBeastWithdrawalTheoryResearch = succession371GuardianBeastTheory;
export const mafiaPrinceChapter371Research = succession371MafiaPrinceLinks;
export const troupeChapter371SearchResearch = succession371TroupeSearchResearch;
export const successionRitualCapsuleResearch = succession371RitualCapsuleResearch;
export const chapter371CustodyResearch = succession371CustodyRecords;

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter370: source370,
  sourcePolicy370: succession370SourcePolicy,
  chapter371: source371,
  sourcePolicy371: succession371SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 370 Nen class incident state',
    description: 'The first public Nen lesson becomes an active murder investigation after Silent Majority kills Barrigen while rival guards continue intelligence and training operations inside Room 1014.',
    records: freeze([
      freeze({ subject: 'Room 1014 Nen class', people: 'Barrigen', notes: 'Marayam representative killed by Silent Majority during the first public Nen lesson.', status: 'deceased / class casualty', source: source370 }),
      freeze({ subject: 'Oito / Woble household', people: 'Oito Hui Guo Rou, Bill', notes: 'Bill begins Oito’s practical Nen training after her forced awakening in Chapter 369.', status: 'active Nen instruction', source: source370 }),
    ]),
  }),
  freeze({
    group: 'Chapter 371 class and judicial aftermath',
    description: 'Barrigen’s murder produces a custody case and judicial observation while Kurapika reorganizes the surviving Nen students into three instructional groups.',
    records: freeze([
      freeze({ subject: 'Silent Majority investigation', people: 'Loberry', notes: 'Royal Army custody as a murder suspect. Possession is established by Chapter 370, but willing complicity is not.', status: 'detained / guilt unresolved', source: source371 }),
      freeze({ subject: 'Seiko household investigation', people: 'Kaiser, Seiko Hui Guo Rou', notes: 'Cleapatro sends Kaiser for a seventy-two-hour observation rather than granting Sakata’s requested immediate case.', status: 'active judicial observation', source: source371 }),
      freeze({ subject: 'Nen class assistants', people: 'Furykov, Belerainte', notes: 'Kurapika divides the class into three groups and appoints the two openly experienced Nen users to help check aura flow.', status: 'active class assignment', source: source371 }),
    ]),
  }),
]);
