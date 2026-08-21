import * as base from './successionDossierThrough399.js';
import {
  succession400ChapterResearch,
  succession400FugetsuResearch,
  succession400KurapikaLonghiResearch,
  succession400MelodyKaiserResearch,
  succession400Mysteries,
  succession400RelationshipRecords,
  succession400ResolvedQuestions,
  succession400SourcePolicy,
  succession400TroupeResearch,
  succession400TwinJusticeResearch,
  succession400TysonResearch,
} from './succession400Research.js';

export * from './successionDossierThrough399.js';

const freeze = (value) => Object.freeze(value);
const source400 = 'https://hunterxhunter.fandom.com/wiki/Chapter_400';

const melody400Ability = freeze({
  ability: 'Melody’s Aura Performance', user: 'Melody', owner: 'Melody', type: 'Nen type unknown', category: 'Mass auditory entrancement / healing-oriented musical performance', chapters: '383, 400', chapter: 400,
  conditions: 'The demonstrated target must hear Melody’s sincere performance. Chapter 400 explicitly says covering the ears prevents the demonstrated entrancement.',
  mechanics: 'Chapter 383 demonstrates a three-minute entrancement through live/loudspeaker audio. Chapter 400 adds Melody’s explanation that her music is intended to heal and loss of consciousness is a side effect rather than the purpose.',
  knownAtChapterBoundary: 'The Chapter 400 explanation is not generalized into every song causing unconsciousness, a universal three-minute duration, a known Nen type, or a complete resistance table.',
  target: 'People who hear the performance.', confidence: 'Hearing requirement, healing intent, and unconsciousness side effect confirmed / Nen type and broader musical-effect limits unresolved.', source: source400,
});

const magicalWorm400Ability = freeze({
  ability: 'Magical Worm', user: 'Fugetsu Guardian Spirit Beast / Fugetsu', owner: 'Fugetsu Guardian Spirit Beast', type: 'Nen type unknown', category: 'Guardian Spirit Beast translocation tunnel', chapters: '383, 400', chapter: 400,
  conditions: 'Fugetsu reports and demonstrates that she can now use the route multiple times rather than once per day and that a return door appears while she is alone.',
  mechanics: 'The solo return shown/reported in Chapter 400 returns Fugetsu to the place she departed from. The reason the prior use limit changed is not supplied.',
  knownAtChapterBoundary: 'Chapter 400 does not prove that every use strengthens Magical Worm, that repeated use causes Fugetsu’s physical/aura deterioration, or that she can choose arbitrary solo return destinations.',
  target: 'Fugetsu and route users permitted by still-incomplete Guardian Spirit Beast rules.', confidence: 'Repeated-use and solo-return behavior confirmed / cause, cost, complete topology, and relation to Fugetsu deterioration unresolved.', source: source400,
});

const withoutYou400Ability = freeze({
  ability: 'Without You', user: 'Kacho Guardian Spirit Beast', owner: 'Kacho Guardian Spirit Beast', type: 'Nen type unknown', category: 'Death-triggered post-mortem protective continuation', chapters: '383, 400', chapter: 400,
  conditions: 'Human Kacho remains dead. Without You continues in Kacho’s form around Fugetsu and Chapter 400 directly shows the Kacho-form actor passing through a bookcase/wall.',
  mechanics: 'The Kacho-form actor continues the protection strategy and reasons about its own state. Its theory that Fugetsu may be supplying aura to maintain the form is retained as a hypothesis, not a confirmed cost mechanic.',
  knownAtChapterBoundary: 'Human-consciousness persistence, contest-status interpretation, Fugetsu aura burden, and whether revealing the truth would reduce that burden remain unresolved.',
  target: 'Fugetsu as the surviving twin.', confidence: 'Human Kacho dead; Kacho-form Guardian Spirit Beast continuation and wall traversal confirmed / consciousness and aura-cost theories unresolved.', source: source400,
});

const fugetsuAffliction400Ability = freeze({
  ability: 'Fugetsu Unidentified Hostile-Spirit Affliction', user: 'Unknown', owner: 'Unknown', type: 'Nen type unknown · descriptive archive label', category: 'Unidentified hostile Nen / spirit affliction', chapters: '400', chapter: 400,
  conditions: 'Melody detects the condition around Fugetsu after her rapid decline: aura as weak as Zetsu, unstable heartbeat, and many hostile spirits.',
  mechanics: 'No responsible user, official ability name, body, trigger, target-selection rule, range, duration, or removal condition is supplied. Melody judges an exorcist necessary and considers a hostage-negotiation theory.',
  knownAtChapterBoundary: 'The condition is not assigned to Magical Worm, Kaiser, any prince, or another unsupplied user. Melody’s negotiation theory remains investigative speculation.',
  target: 'Fugetsu in the demonstrated Chapter 400 condition.', confidence: 'Hostile-spirit manifestation and severe aura/heartbeat deterioration confirmed / user, name, type, trigger and motive unresolved.', source: source400,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !['Melody’s Aura Performance', 'Magical Worm', 'Without You'].includes(record.ability)),
  melody400Ability,
  magicalWorm400Ability,
  withoutYou400Ability,
  fugetsuAffliction400Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession400RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession400Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession400ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter400: source400,
  sourcePolicy400: succession400SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 400 Tier 2 confirmation / Justice crisis / Fugetsu affliction / Longhi contract',
    description: 'Chapter 400 modernizes the old maintained packet into a strict publication boundary: the Troupe broadly localizes the tracked Heil-Ly base to Tier 2, Tyson/Izunavi pursue an untested Book of Tyson plan, human Kacho remains dead while Without You protects Fugetsu, Melody and Kaiser navigate prince pressure and a future martial-law contingency, Fugetsu develops repeated/solo Magical Worm behavior while suffering an unidentified hostile-spirit condition, and Kurapika accepts Longhi’s contract without later contract terms being imported.',
    records: freeze([
      freeze({ subject: 'Troupe receiver / Tier 2 fix', people: 'Phinks, Feitan, Nobunaga', notes: 'Descending toward Tier 4 weakens the receiver signal and confirms the tracked transmitter/base above Tier 3 on Tier 2. Phinks’s En limitations are personal self-description.', status: 'broad Tier 2 level confirmed / exact room, space creator and full route unresolved', source: source400 }),
      freeze({ subject: 'Tyson / Book of Tyson plan', people: 'Tyson, Izunavi, Giuliano', notes: 'Role-play identities remain role-play. Izunavi suspects the book/Guardian Spirit Beast explains Giuliano’s calmness and proposes a Nasubi reading.', status: 'proposal confirmed / GSB causal link and contest-ending effect untested', source: source400 }),
      freeze({ subject: 'Kacho-form Without You', people: 'Human Kacho, Without You, Fugetsu, Melody', notes: 'Human Kacho remains dead. Without You continues in Kacho’s form, moves through solid furniture/walls, and develops protection strategy. Its Fugetsu-aura-maintenance theory remains a hypothesis.', status: 'post-mortem protective continuation confirmed / human consciousness and aura-cost theory unresolved', source: source400 }),
      freeze({ subject: 'Melody / Kaiser / five prince requests', people: 'Melody, Kaiser, Zhang Lei, Tserriednich, Benjamin, Tubeppa, Luzurus', notes: 'Melody clarifies hearing, healing intent and unconsciousness side effect. Kaiser proposes slow-poison assassination and declares love; Melody suspects manipulation from his heartbeat.', status: 'statements and requests confirmed / Kaiser Nen status and true motive unresolved', source: source400 }),
      freeze({ subject: 'Special Martial Law contingency', people: 'Kaiser, Steiner', notes: 'Kaiser explains how a future declaration could transfer effective control and gives Steiner an emergency device.', status: 'future contingency only / no Chapter 400 declaration or enforcement', source: source400 }),
      freeze({ subject: 'Fugetsu Magical Worm expansion', people: 'Fugetsu, Kacho-form Without You', notes: 'Fugetsu can use Magical Worm repeatedly and a solo return door appears, limited to returning where she was.', status: 'new behavior confirmed / cause, cost and relation to deterioration unresolved', source: source400 }),
      freeze({ subject: 'Fugetsu hostile-spirit condition', people: 'Fugetsu, Melody', notes: 'Melody detects Zetsu-like aura weakness, unstable heartbeat and many hostile spirits and judges an exorcist necessary.', status: 'condition confirmed / user, ability, trigger, body, motive and removal route unresolved', source: source400 }),
      freeze({ subject: 'Kurapika / Longhi / Tubeppa', people: 'Kurapika, Longhi, Bill, Tubeppa', notes: 'Longhi is already a Nen user; Kurapika accepts her contract and agrees to collaborate with Tubeppa.', status: 'agreement confirmed / exact contract terms deliberately unavailable at Chapter 400 boundary', source: source400 }),
    ]),
  }),
]);

export const troupeChapter400Research = succession400TroupeResearch;
export const tysonChapter400Research = succession400TysonResearch;
export const twinJusticeChapter400Research = succession400TwinJusticeResearch;
export const fugetsuChapter400Research = succession400FugetsuResearch;
export const melodyKaiserChapter400Research = succession400MelodyKaiserResearch;
export const kurapikaLonghiChapter400Research = succession400KurapikaLonghiResearch;
export const relationshipsChapter400Research = succession400RelationshipRecords;
export const chapter400Research = succession400ChapterResearch;
