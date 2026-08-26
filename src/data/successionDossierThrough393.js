import * as base from './successionDossierThrough392.js';
import {
  succession393ApparentHisokaResearch,
  succession393ChapterResearch,
  succession393HeilLyResearch,
  succession393LuiniResearch,
  succession393Mysteries,
  succession393RelationshipRecords,
  succession393ResolvedQuestions,
  succession393Room3101Research,
  succession393SourcePolicy,
} from './succession393Research.js';

export * from './successionDossierThrough392.js';

const freeze = (value) => Object.freeze(value);
const source393 = 'https://hunterxhunter.fandom.com/wiki/Chapter_393';

const luini393Ability = freeze({
  ability: 'Luini transportation ability', user: 'Luini', owner: 'Luini', type: 'Nen type unknown · spatial transportation / marked-location travel', category: 'Spatial transportation / marked-location travel', chapters: '379, 392–393', chapter: 393,
  conditions: 'Earlier maintained research establishes a sealed room with exactly one door as Luini’s origin hub and marked destinations as travel points. Chapter 392 shows openings into the Cha-R office.',
  mechanics: 'The earlier sealed-hub and marked-destination mechanics remain the established core. Chapter 393 ends Luini’s living use when Nobunaga kills him. Perigord says he believes Luini was an Emitter, but that remains character inference rather than confirmed classification.',
  knownAtChapterBoundary: 'Luini is dead at Chapter 393. Official ability name, confirmed Nen type, maximum range, complete marking rules, and any post-mortem persistence remain unresolved. No post-mortem continuation is established.',
  target: 'Luini / spatial route between the prepared hub and marked locations', confidence: 'Core spatial mechanics retained / owner dead / Nen type and post-mortem persistence unresolved.', source: source393,
});
const contagion393Ability = freeze({
  ability: 'Contagion', user: 'Morena Prudo', owner: 'Morena Prudo', type: 'Community leveling Nen system', category: 'Infection / progression / ability development', chapters: '378, 391, 393', chapter: 393,
  conditions: 'Heil-Ly members participate in Morena’s established level-progression system. Chapter 393 members discuss needing to reach level 21 to develop abilities and state that each person has an innate Nen type.',
  mechanics: 'The Chapter 391 Nen-user kill value remains +10 levels. Chapter 393 adds the level-21 ability-development discussion and the innate-type constraint. Morena coaches members to analyze opponents and build useful restrictions/counters rather than simply selecting a preferred Nen category.',
  knownAtChapterBoundary: 'Level 21 is discussed by the members as the ability-development threshold, and innate Nen type is treated as not freely chosen. Multi-attacker reward allocation remains unresolved. Morena’s example of an ability that reports how many hits are required to defeat an enemy is hypothetical coaching, not an actual ability.',
  target: 'Members of Morena’s Contagion community.', confidence: 'Leveling/ability-development discussion confirmed / individual future abilities and unresolved allocation rules remain open.', source: source393,
});
const voconte393Ability = freeze({
  ability: 'Voconte’s Door Ability', user: 'Voconte', owner: 'Voconte', type: 'Nen type of ability unknown · owner is a confirmed Emitter · descriptive archive label', category: 'Door / trap-support ability', chapters: '393', chapter: 393,
  conditions: 'Voconte proposes using the unnamed door ability to catch prey that wander into a trap.',
  mechanics: 'Chapter 393 confirms the ability exists and records the proposed trap use, but does not provide a full activation sequence. Voconte’s natural type is Emitter; the ability itself is not automatically classified as Emission.',
  knownAtChapterBoundary: 'Official name, ability-specific Nen category, door placement/creation, trigger, transport/capture mechanism, range, duration, target limits, aura cost, and reset rules remain unresolved.',
  target: 'Prey entering the proposed trap.', confidence: 'Existence/proposed use confirmed / complete mechanics unresolved.', source: source393,
});

const abilityNamesReplacedAt393 = new Set(['Luini transportation ability', 'Contagion']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt393.has(record.ability)),
  luini393Ability,
  contagion393Ability,
  voconte393Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession393RelationshipRecords,
]);

const superseded392Mystery = (record) => {
  const question = String(record?.question || '');
  return /where exactly is the unplanned wired room/i.test(question)
    || /will ken.i or hinrigh successfully negotiate/i.test(question);
};
export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded392Mystery(record)),
  ...succession393Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession393ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter393: source393, sourcePolicy393: succession393SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 393 Luini death / Heil-Ly adaptation / apparent-Hisoka truce / Room 3101 investigation',
    description: 'Chapter 393 kills Luini and changes the Troupe–Heil-Ly conflict, expands Contagion-era ability-development information, advances Xi-Yu’s temporary apparent-Hisoka deal, and converts Maizan’s unplanned-room lead into the unresolved Room 3101 disappearance case.',
    records: freeze([
      freeze({ subject: 'Luini death', people: 'Luini, Nobunaga, Phinks, Feitan', notes: 'Nobunaga immediately kills Luini after rejecting his destructive alliance proposal. The Troupe then makes Heil-Ly destruction an explicit priority alongside the Hisoka hunt.', status: 'Luini dead / no post-mortem spatial continuation established', source: source393 }),
      freeze({ subject: 'Heil-Ly ability development', people: 'Morena, Daemon, Gelato, Perigord, Bille, Voconte, Tevelares, Quorolle, Matvere', notes: 'Members discuss reaching level 21, innate Nen types, replacing Luini’s hunting utility, and counters to Biohazard. Morena’s hit-count example is hypothetical design advice.', status: 'level/type discussion confirmed / individual future abilities mostly unresolved', source: source393 }),
      freeze({ subject: 'Voconte door technique', people: 'Voconte', notes: 'Voconte is a level 26 Emitter and proposes his unnamed door ability as a trap. The archive does not infer the technique’s category from his natural type.', status: 'existence and proposed trap use confirmed / official name and mechanics unresolved', source: source393 }),
      freeze({ subject: 'Apparent-Hisoka cinema arrangement', people: 'Hinrigh, unidentified apparent Hisoka', notes: 'Hinrigh offers Tier 1/VVIP access and asks the man not to initiate a Troupe fight until Heil-Ly is handled. He accepts while reserving the right to fight if attacked first.', status: 'temporary arrangement confirmed under Chapter 393 working identity / Chapter 405 reveal not backfilled', source: source393 }),
      freeze({ subject: 'Maizan / Ken’i intelligence transaction', people: 'Maizan, Ken’i, Hinrigh, Connelly', notes: 'Ken’i matches the 50-million offer, adds paid identification incentives, and joins the Xi-Yu/Cha-R verification party.', status: 'transaction and tactical cooperation confirmed / Fourth Prince approval remains Ken’i’s statement', source: source393 }),
      freeze({ subject: 'Room 3101', people: 'Maizan, Hinrigh, Ken’i', notes: 'Maizan guides the group to Room 3101, enters first, and disappears from the observers’ view. Hinrigh’s thrown knife does not disappear, but one test does not establish a complete transport rule.', status: 'Room 3101 identified / Maizan whereabouts and mechanism unresolved / Heil-Ly connection not yet confirmed', source: source393 }),
    ]),
  }),
]);

export const luiniChapter393Research = succession393LuiniResearch;
export const heilLyChapter393Research = succession393HeilLyResearch;
export const apparentHisokaChapter393Research = succession393ApparentHisokaResearch;
export const room3101Chapter393Research = succession393Room3101Research;
export const relationshipsChapter393Research = succession393RelationshipRecords;
export const chapter393Research = succession393ChapterResearch;
