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

export * from './successionDossierBase.js';

const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_370';
const freeze = (value) => Object.freeze(value);

export const chapterFocus = freeze({
  ...base.chapterFocus,
  ...succession370ChapterFocus,
});

export const successionChapterResearch = freeze([
  ...base.successionChapterResearch.filter((record) => record.number !== 370),
  ...succession370ChapterResearch,
].sort((left, right) => left.number - right.number));

const silentMajority370Ability = freeze({
  ability: 'Silent Majority',
  owner: 'Unknown',
  category: 'Possession-assisted curse / blood-draining attack',
  knownAtChapterBoundary: 'The user operates a marionette visible only to the user and its possessed person; Loberry is possessed during the class. The marionette has ten people within its selectable possession range, and failure to kill before deactivation rebounds the curse onto the user.',
  mechanics: 'Four snake-like curse entities can attack together and drain a victim’s blood; the user states that all four can exsanguinate a body in eleven seconds.',
  target: 'Barrigen is the confirmed Chapter 370 victim.',
  confidence: 'Chapter 370 confirms the visibility rule, ten-person selection window, rebound condition, four snakes, Barrigen’s death, and the eleven-second four-snake drain. User identity, Nen category, complete possession rules, physical range, and same-user attribution for the Chapter 359 murders remain unresolved.',
  chapter: 370,
  source,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !(record.ability === 'Silent Majority' && record.chapter === 369)),
  silentMajority370Ability,
]);

export const successionRelationships = freeze([
  ...base.successionRelationships,
  ...succession370RelationshipRecords,
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

export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !supersededMysteryQuestions.has(record.question)),
  freeze({
    question: 'Who or what killed Woody and the four other Oito guards by draining their blood?',
    evidence: 'Chapter 370 demonstrates Silent Majority killing Barrigen with four blood-draining snakes in a pattern explicitly compared by the supplied notes to the Chapter 359 deaths. This disproves the theory that Woble’s Guardian Spirit Beast caused those deaths, but Chapter 370 does not explicitly identify the earlier killer as the same Silent Majority user.',
    status: 'Woble Guardian Beast theory disproved / killer identity still open',
    lastChapter: '370',
    source,
  }),
  freeze({
    question: 'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
    evidence: 'By Chapter 370 Babimyna has concluded that the cockroach-control ability demonstrated in Chapter 367 was not Bill’s actual ability. The Bill cover is therefore broken, but the supplied Chapter 370 text does not establish that Babimyna has identified Oito as the true temporary user.',
    status: 'cover broken / Oito attribution not yet confirmed',
    lastChapter: '370',
    source,
  }),
  ...succession370Mysteries,
]);

export const silentMajorityChapter370Research = succession370SilentMajorityMechanics;
export const furykovChapter370MethodResearch = succession370FurykovMethod;
export const room1014Chapter370CounterintelligenceResearch = succession370Counterintelligence;

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter370: source,
  sourcePolicy370: succession370SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 370 Nen class incident state',
    description: 'The first public Nen lesson becomes an active murder investigation after Silent Majority kills Barrigen while rival guards continue intelligence and training operations inside Room 1014.',
    records: freeze([
      freeze({
        subject: 'Room 1014 Nen class',
        people: 'Barrigen',
        notes: 'Marayam representative killed by Silent Majority during the first public Nen lesson.',
        status: 'deceased / class casualty',
        source,
      }),
      freeze({
        subject: 'Oito / Woble household',
        people: 'Oito Hui Guo Rou, Bill',
        notes: 'Bill begins Oito’s practical Nen training after her forced awakening in Chapter 369.',
        status: 'active Nen instruction',
        source,
      }),
    ]),
  }),
]);
