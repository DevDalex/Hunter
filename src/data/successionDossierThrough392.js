import * as base from './successionDossierThrough391.js';
import {
  succession392ApparentHisokaResearch,
  succession392ChaRStrategyResearch,
  succession392ChapterResearch,
  succession392LuiniTroupeResearch,
  succession392MaizanIntelResearch,
  succession392MishaResearch,
  succession392Mysteries,
  succession392RelationshipRecords,
  succession392ResolvedQuestions,
  succession392SourcePolicy,
} from './succession392Research.js';

export * from './successionDossierThrough391.js';

const freeze = (value) => Object.freeze(value);
const source392 = 'https://hunterxhunter.fandom.com/wiki/Chapter_392';

const bloodyMary392Ability = freeze({
  ability: 'Bloody Mary', user: 'Zakuro Custard', owner: 'Zakuro Custard', type: 'Nen type unknown · blood-control named ability', category: 'Blood search and combat', chapters: '390–392', chapter: 392,
  conditions: 'Zakuro’s existing mobile blood drops continue searching Tier 3. Chapter 392 shows the drops leading Lynch and Zakuro toward multiple possible Hisoka candidates.',
  mechanics: 'The Chapter 391 30–40 minute demonstrated Nen lifetime remains the latest explicit duration rule. Chapter 392 demonstrates candidate-finding behavior but not infallible identity recognition: Hanal is a false candidate and the later target is only believed by Lynch and Zakuro to be Hisoka at this chapter boundary.',
  knownAtChapterBoundary: 'Search continuation and candidate-finding are confirmed. Search range, sensory method, communication rules, candidate-selection logic, maximum blood volume/drop count, and Nen type remain unresolved. The drops do not establish objective identity.',
  target: 'Possible Hisoka candidates during the Xi-Yu Tier 3 search.', confidence: 'Search continuation confirmed / identity-recognition and full mechanics unresolved.', source: source392,
});
const bodyAndSoul392Ability = freeze({
  ability: 'Body and Soul', user: 'Lynch Fullbokko', owner: 'Lynch Fullbokko', type: 'Nen type unknown · named interrogation ability', category: 'Close-range interrogation / information acquisition', chapters: '390, 392', chapter: 392,
  conditions: 'Lynch asks a target a question and strikes at close range in the demonstrated uses.',
  mechanics: 'Lynch asks Hanal whether he is Hisoka and punches him; Hanal’s inner soul answers that he is not. Lynch later attempts the ability on a man she and Zakuro believe is Hisoka, but her punch seemingly fails and she abruptly falls after what the man calls a reflexive counter.',
  knownAtChapterBoundary: 'The Hanal identity-check use is confirmed. The second target’s objective identity and the reason Body and Soul seemingly fails are unresolved. No aura-resistance, speed, counter-ability, or other failure mechanic is invented.',
  target: 'Close-range questioned targets.', confidence: 'Successful identity-question use confirmed / apparent counter case unresolved.', source: source392,
});
const misha392Ability = freeze({
  ability: 'Misha Hao’s Post-Mortem Disposal Ability', user: 'Misha Hao', owner: 'Misha Hao', type: 'Nen type unknown · post-mortem Nen · descriptive archive label', category: 'Post-mortem corpse disposal', chapters: '392', chapter: 392,
  conditions: 'Misha is deceased. The synopsis states that her post-mortem Nen causes her to appear and inconspicuously dispose of a person killed by a Xi-Yu member.',
  mechanics: 'Padaille, killed by Hinrigh in Chapter 391, is the demonstrated cleanup target. Misha appears with the corpse during the public removal sequence and vanishes after the corpse has been dealt with.',
  knownAtChapterBoundary: 'Post-mortem cleanup purpose and Padaille use are confirmed. No formal ability name is supplied. Nen category, trigger timing, range, visibility, corpse-control mechanism, disposal destination/method, cost, exceptions, and other limits remain unresolved. Padaille is not revived.',
  target: 'Corpses of people killed by Xi-Yu members, as stated in Chapter 392.', confidence: 'Post-mortem cleanup function confirmed / formal name and full mechanics unresolved.', source: source392,
});

const abilityNamesReplacedAt392 = new Set(['Bloody Mary', 'Body and Soul']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt392.has(record.ability)),
  bloodyMary392Ability,
  bodyAndSoul392Ability,
  misha392Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession392RelationshipRecords,
]);

const unresolvedMishaAt391 = (record) => /what exactly is hinrigh relying on misha|misha.*task|misha.*role/i.test(String(record?.question || record?.title || record?.summary || ''));
export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !unresolvedMishaAt391(record)),
  ...succession392Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession392ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter392: source392, sourcePolicy392: succession392SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 392 Xi-Yu apparent-Hisoka contact / Cha-R balance strategy / Luini office confrontation',
    description: 'Chapter 392 resolves Misha’s cleanup role, opens an unverified Maizan secret-room lead, extends Bloody Mary and Body and Soul into the Hisoka search, develops Ken’i’s balancing plan, and ends with Luini directly confronting the Troupe.',
    records: freeze([
      freeze({ subject: 'Padaille corpse cleanup', people: 'Misha Hao, Padaille, Hinrigh', notes: 'Misha’s post-mortem Nen inconspicuously disposes of a person killed by a Xi-Yu member. Padaille remains dead; the apparent walking corpse is not revival.', status: 'Misha cleanup role confirmed / exact mechanics and formal ability name unresolved', source: source392 }),
      freeze({ subject: 'Maizan intelligence deal', people: 'Maizan, Hinrigh, Morena', notes: 'Hinrigh offers 50 million for reliable information; Maizan wants at least 30 million upfront and claims knowledge of an unplanned wired room. His Heil-Ly attribution is only a guess and Hinrigh demands personal guidance/verification.', status: 'lead and negotiation confirmed / Heil-Ly ownership unverified', source: source392 }),
      freeze({ subject: 'Hanal identity check', people: 'Lynch, Zakuro, Hanal', notes: 'Body and Soul produces Hanal’s inner-soul answer that he is not Hisoka.', status: 'Hanal ruled out as search candidate', source: source392 }),
      freeze({ subject: 'Apparent-Hisoka encounter', people: 'Lynch, Zakuro, unidentified apparent Hisoka', notes: 'Lynch’s Body and Soul attempt seemingly fails and she is reflexively countered. Zakuro concludes from the man’s aura and Lynch’s defeat that he must be Hisoka. The event does not objectively tag Hisoka or Bonolenov at the Chapter 392 boundary.', status: 'Lynch alive but down / target identity unresolved inside Chapter 392 / later Chapter 405 reveal not backfilled', source: source392 }),
      freeze({ subject: 'Voyage shipment logistics', people: 'Tsudonke', notes: 'The kiosk woman states Voyage Day 14 as the last air-shipment order deadline and three days earlier for high-speed boat; small-item drone delivery and deadline flexibility depend on connections/cash.', status: 'reported logistics preserved as speaker information, not universal guarantee', source: source392 }),
      freeze({ subject: 'Cha-R balance plan', people: "Ken'i Wang, Ittoku, Tsudonke", notes: 'Ken’i makes Hisoka the top priority, orders members not to approach him first, and hopes to use negotiation to turn Hisoka, Heil-Ly, and the Troupe against one another.', status: 'orders confirmed / projected balancing outcome remains strategy', source: source392 }),
      freeze({ subject: 'Luini / Troupe direct contact', people: 'Luini, Nobunaga, Phinks, Feitan', notes: 'Luini probes and confronts the Cha-R office through spatial openings. Nobunaga draws his katana and threatens him.', status: 'direct hostile contact confirmed / Luini alive at Chapter 392 end / later result excluded', source: source392 }),
    ]),
  }),
]);

export const mishaChapter392Research = succession392MishaResearch;
export const maizanIntelChapter392Research = succession392MaizanIntelResearch;
export const apparentHisokaChapter392Research = succession392ApparentHisokaResearch;
export const chaRStrategyChapter392Research = succession392ChaRStrategyResearch;
export const luiniTroupeChapter392Research = succession392LuiniTroupeResearch;
export const relationshipsChapter392Research = succession392RelationshipRecords;
export const chapter392Research = succession392ChapterResearch;
