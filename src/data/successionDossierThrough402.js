import * as base from './successionDossierThrough401.js';
import {
  succession402ChapterResearch,
  succession402Mysteries,
  succession402RelationshipRecords,
  succession402ResolvedQuestions,
  succession402SourcePolicy,
} from './succession402Research.js';

export * from './successionDossierThrough401.js';

const freeze = (value) => Object.freeze(value);
const source402 = 'https://hunterxhunter.fandom.com/wiki/Chapter_402';

const magicalWorm402 = freeze({
  ability: 'Magical Worm · Chapter 402 route update',
  user: 'Fugetsu / Guardian Spirit Beast system',
  owner: 'Fugetsu Guardian Spirit Beast',
  type: 'Guardian Spirit Beast translocation system',
  category: 'Door-and-tunnel route system',
  chapters: '383, 400, 402',
  chapter: 402,
  conditions: 'Chapter 402 reports that an attempted outside-ship destination fails, while the emergency lifeboat area and first lifeboat are reachable. The Luzurus operation treats prior physical visitation of a destination as necessary before Fugetsu can route there.',
  mechanics: 'Kacho-form reports the Outgoing Door closes when Fugetsu enters the tunnel and the Door of Return closes when Kacho-form enters on the return journey. A proposed third-party access test is discussed but not completed.',
  knownAtChapterBoundary: 'Outside-ship travel is not established. General third-party access remains unconfirmed. No causal link between Magical Worm itself and Fugetsu’s mark/spirit deterioration is established.',
  target: 'Fugetsu/Kacho-form route users; possible third-party users unresolved.',
  confidence: 'Lifeboat reachability and prior-visit operational prerequisite documented / third-party access, complete range, cost, and hostile-affliction relationship unresolved.',
  source: source402,
});

const fugetsuAffliction402 = freeze({
  ability: 'Fugetsu Unidentified Hostile-Spirit Affliction · Chapter 402 update',
  user: 'Unknown',
  owner: 'Unknown',
  type: 'Unknown hostile Nen / spirit condition',
  category: 'Marked hostile-spirit affliction',
  chapters: '400, 402',
  chapter: 402,
  conditions: 'A new mark is observed on Fugetsu’s right shoulder blade. Benjamin can perceive the surrounding spirits and his Guardian Spirit Beast’s screech visibly disperses them. Basho later gives Fugetsu a haiku charm and expects low-level spirits to stay away for a while.',
  mechanics: 'Melody proposes a multistep marked trap, fake/additional door, addiction-like compulsion, continued-use weakening, and indiscriminate attack. Kacho-form suspects Luzurus. All remain hypotheses.',
  knownAtChapterBoundary: 'User, official name, Nen type, exact trigger, Luzurus culpability, connection to Magical Worm, and permanent removal method remain unresolved. Benjamin’s diagnosis and prognosis remain his assessment.',
  target: 'Fugetsu',
  confidence: 'Shoulder mark and temporary spirit dispersal observed / culprit and mechanism unresolved.',
  source: source402,
});

const parallelFuture402 = freeze({
  ability: 'Parallel Future / Zetsu training checkpoint',
  user: 'Tserriednich',
  owner: 'Tserriednich',
  type: 'Specialization · established earlier',
  category: 'Temporal perception / Zetsu-linked ability',
  chapters: '387, 402',
  chapter: 402,
  conditions: 'Salkov times Tserriednich entering Zetsu in 9.67 seconds and observes him maintain Zetsu while running, gaming, and speaking.',
  mechanics: 'Chapter 402 does not add a new demonstrated future-vision sequence. Salkov considers several explanations for Theta’s earlier account and cannot resolve them.',
  knownAtChapterBoundary: 'Jester-beast aura storage, a separate Zetsu-activated mechanism, and Theta manipulation are unconfirmed theories.',
  target: 'Tserriednich’s own established future-perception system.',
  confidence: '9.67-second Zetsu checkpoint confirmed / mechanism theories unresolved.',
  source: source402,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !/Magical Worm · Chapter 402|Fugetsu Unidentified Hostile-Spirit Affliction · Chapter 402|Parallel Future \/ Zetsu training checkpoint/.test(record.ability || '')),
  magicalWorm402,
  fugetsuAffliction402,
  parallelFuture402,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession402RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...(base.successionMysteries || []),
  ...succession402Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession402ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter402: source402,
  sourcePolicy402: succession402SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 402 lower-prince diplomacy / Fugetsu counter-operation / Halkenburg threat',
    description: 'Chapter 402 expands the lower-prince political network, reveals Balsamilco’s prepared anti-Halkenburg pathological weapon, records Tserriednich’s 9.67-second Zetsu checkpoint, and turns Fugetsu’s unresolved hostile-spirit condition into an active Justice operation without promoting its many character theories into settled canon.',
    records: freeze([
      freeze({ subject: 'Three-prince endgame compact', people: 'Zhang Lei, Tubeppa, Woble, Tenftory', notes: 'Tubeppa and Woble are reported willing to renounce for Zhang Lei if the three are final contestants.', status: 'reported written commitment / surrender legality unresolved', source: source402 }),
      freeze({ subject: 'Zhang Lei second Tenftory coin', people: 'Zhang Lei, Tenftory', notes: 'Tenftory receives his second Guardian Coin; Zhang Lei discusses fortune and holder distribution.', status: 'second coin confirmed / fortune and true-power theories unresolved', source: source402 }),
      freeze({ subject: 'Tubeppa Guardian Spirit Beast', people: 'Tubeppa, Rihan', notes: 'Rihan sees the beast appear, croak, and emit fumes after alliance news.', status: 'appearance confirmed / conditional trigger theory unresolved', source: source402 }),
      freeze({ subject: 'Balsamilco pathological weapon', people: 'Balsamilco, Halkenburg', notes: 'Balsamilco tests the shoe delivery device, loads one vial, and resolves to target Halkenburg.', status: 'attack prepared / exposure and outcome not shown', source: source402 }),
      freeze({ subject: 'Tserriednich Zetsu', people: 'Tserriednich, Salkov, Theta', notes: 'Salkov records 9.67 seconds and cannot resolve the jester-beast/ability/Theta-manipulation possibilities.', status: 'training benchmark confirmed / mechanism unresolved', source: source402 }),
      freeze({ subject: 'Fugetsu mark', people: 'Fugetsu, Kacho-form, Melody', notes: 'A new right-shoulder-blade mark is photographed.', status: 'mark confirmed / user and ability unknown', source: source402 }),
      freeze({ subject: 'Luzurus suspect theory', people: 'Kacho-form, Melody, Kaiser, Luzurus', notes: 'Kacho-form suspects Luzurus or his beast; the 8:50 plan explicitly allows that he may be innocent.', status: 'unconfirmed suspect / removal operation planned only', source: source402 }),
      freeze({ subject: 'Magical Worm route tests', people: 'Fugetsu, Kacho-form, Melody, Kaiser', notes: 'Outside-ship attempt fails; lifeboat emergency area and first lifeboat are reachable; prior visitation blocks immediate Luzurus-bedroom routing.', status: 'route knowledge expanded / third-party access untested', source: source402 }),
      freeze({ subject: 'Kaiser', people: 'Kaiser, Melody', notes: 'Kaiser states an ideological motive for supporting Fugetsu; Melody’s manipulation suspicion survives.', status: 'operational ally / true control status unresolved', source: source402 }),
      freeze({ subject: 'Benjamin / spirits / martial law', people: 'Benjamin, Fugetsu, Kaiser', notes: 'Benjamin’s beast disperses Fugetsu’s spirits; Benjamin states the current crisis does not meet the martial-law threshold.', status: 'spirit dispersal and threshold statement confirmed / diagnosis and Kaiser intent-reading remain interpretation', source: source402 }),
      freeze({ subject: 'Basho charm', people: 'Basho, Fugetsu', notes: 'Basho gives a haiku good-luck charm and expects low-level spirits to avoid Fugetsu temporarily.', status: 'temporary aid observed/expected / official ability name and mechanics unsupplied', source: source402 }),
      freeze({ subject: 'Halkenburg rumble and illness', people: 'Melody, Halkenburg', notes: 'Melody guesses the rumble involved Halkenburg or his beast and knows he later fell ill.', status: 'cause and ownership unresolved / not linked to Balsamilco weapon at 402 boundary', source: source402 }),
    ]),
  }),
]);

export const chapter402Research = succession402ChapterResearch;
export const relationshipsChapter402Research = succession402RelationshipRecords;
