import * as base from './successionDossierThrough390.js';
import {
  succession391BiohazardResearch,
  succession391BloodyMaryResearch,
  succession391ChapterResearch,
  succession391ContagionResearch,
  succession391FistfulOfWeaponsResearch,
  succession391HinrighOperationalResearch,
  succession391Mysteries,
  succession391RelationshipRecords,
  succession391ResolvedQuestions,
  succession391SourcePolicy,
} from './succession391Research.js';

export * from './successionDossierThrough390.js';

const freeze = (value) => Object.freeze(value);
const source391 = 'https://hunterxhunter.fandom.com/wiki/Chapter_391';

const bloodyMary391Ability = freeze({
  ability: 'Bloody Mary', user: 'Zakuro Custard', owner: 'Zakuro Custard', type: 'Nen type unknown · blood-control named ability', category: 'Blood search and combat', chapters: '390, 391', chapter: 391,
  conditions: 'Zakuro uses his own blood as the demonstrated medium. Chapter 391 shows numerous drops moving through Tier 3 to search for Hisoka.',
  mechanics: 'The searching drops move independently through the corridor for the assigned search. Zakuro states that they will run out of Nen after approximately 30 to 40 minutes and then return to ordinary blood.',
  knownAtChapterBoundary: 'The mobile search application and 30–40 minute demonstrated Nen lifetime are confirmed. Search range, sensory method, communication rules, maximum blood volume, exact Nen type, and whether the drops possess any independent intelligence remain unresolved.',
  target: 'Hisoka in the Chapter 391 search; combat opponents in the Chapter 390 use.', confidence: 'Search use and duration confirmed / complete mechanics unresolved.', source: source391,
});
const biohazard391Ability = freeze({
  ability: 'Biohazard', user: 'Hinrigh Biganduffno', owner: 'Hinrigh Biganduffno', type: 'Nen type unknown · object-to-living-animal transformation', category: 'Transformation / surveillance / restraint', chapters: '390, 391', chapter: 391,
  conditions: 'Biohazard transforms ordinary physical objects into animal forms. Chapter 390 directly showed Hinrigh touching guns before their transformation; Chapter 391 formally names the ability and expands its uses.',
  mechanics: 'A recording camcorder becomes a small surveillance cat. Ordinary handcuffs become aura-reinforced pigeons that can fly to a target and revert into handcuff form around limbs. Alongside Chapter 390’s firing snake-guns, the demonstrated transformations preserve useful original functions in specific cases.',
  knownAtChapterBoundary: 'Formal name Biohazard, camcorder-cat surveillance, handcuff-pigeon restraint/reversion, and aura reinforcement are confirmed. Nen category, mass limit, transformation count, duration, full range, aura cost, and universal function-retention rules remain unknown.',
  target: 'Selected ordinary objects.', confidence: 'Formal name and multiple transformation applications confirmed / complete limits unresolved.', source: source391,
});
const contagion391Ability = freeze({
  ability: 'Contagion', user: 'Morena Prudo', owner: 'Morena Prudo', type: 'Community leveling Nen system', category: 'Infection / progression', chapters: '378, 391', chapter: 391,
  conditions: 'Heil-Ly members operate within Morena’s existing level-progression system.',
  mechanics: 'Tevelares, Quorolle, and Padaille explicitly treat killing a Nen user as worth ten levels. They disagree over how that value should be allocated when several members participate and expect Morena, as the ability user and game master, to decide.',
  knownAtChapterBoundary: 'Nen-user kill value of +10 levels is directly stated. Multi-attacker reward allocation remains unresolved. Quorolle’s belief that Morena can probably monitor members at all times is character inference, not a confirmed surveillance mechanic.',
  target: 'Members of Morena’s Contagion community.', confidence: 'Nen-user +10 value confirmed / allocation and continuous-surveillance claims unresolved.', source: source391,
});
const fistful391Ability = freeze({
  ability: 'Fistful of Weapons', user: 'Padaille', owner: 'Padaille', type: 'Conjuration', category: 'Body-part weapon transformation', chapters: '391', chapter: 391,
  conditions: 'Padaille transforms his right hand into weapon forms during close combat.',
  mechanics: 'Chapter 391 directly shows hammer, drill, and axe forms. The drill lets Padaille slip a handcuff and attack; the axe is used in an attempt to cut free before Hinrigh turns it against him.',
  knownAtChapterBoundary: 'Official ability name, Conjurer user type, and hammer/drill/axe forms are confirmed. Complete weapon list, other transformable body parts, duration, aura cost, switching rules, and durability remain unknown.',
  target: 'Close-range combat targets.', confidence: 'Three forms demonstrated / complete rule set unresolved.', source: source391,
});

const abilityNamesReplacedAt391 = new Set(['Bloody Mary', 'Hinrigh object-to-animal transformation', 'Biohazard', 'Contagion']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt391.has(record.ability)),
  bloodyMary391Ability,
  biohazard391Ability,
  contagion391Ability,
  fistful391Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession391RelationshipRecords,
]);
export const successionMysteries = freeze([...base.successionMysteries, ...succession391Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession391ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter391: source391, sourcePolicy391: succession391SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 391 Xi-Yu / Heil-Ly Tier 3 pursuit and Padaille battle',
    description: 'Chapter 391 continues the Tier 3 operation, expands Bloody Mary and Biohazard, discloses three Heil-Ly member profiles and the Nen-user +10 leveling value, and ends with Padaille’s death.',
    records: freeze([
      freeze({ subject: 'Hisoka search protocol', people: 'Hinrigh, Lynch, Zakuro', notes: 'Lynch and Zakuro continue searching for Hisoka but must contact Hinrigh before acting if they find him.', status: 'search active / Hisoka not found in this synopsis', source: source391 }),
      freeze({ subject: 'Bloody Mary search drops', people: 'Zakuro, Lynch', notes: 'Numerous blood drops search Tier 3 for Hisoka. Zakuro states roughly 30–40 minutes of Nen before they return to normal blood.', status: 'search function and duration confirmed / range and sensory rules unresolved', source: source391 }),
      freeze({ subject: 'Biohazard formal reveal', people: 'Hinrigh', notes: 'The formerly unnamed transformation ability is formally called Biohazard. Hinrigh uses a recording camcorder-cat and aura-reinforced handcuff-pigeons.', status: 'formal name and new applications confirmed / full limits unresolved', source: source391 }),
      freeze({ subject: 'Heil-Ly trio profiles', people: 'Tevelares, Quorolle, Padaille', notes: 'Tevelares: level 24 Enhancer, civil engineer. Quorolle: level 22 Emitter, repairman. Padaille: level 29 Conjurer, demolition worker.', status: 'profile disclosures confirmed at Chapter 391', source: source391 }),
      freeze({ subject: 'Contagion Nen-user kill value', people: 'Tevelares, Quorolle, Padaille, Morena', notes: 'The trio treats killing a Nen user as worth ten levels but disagrees on multi-attacker allocation. Quorolle’s continuous-monitoring idea about Morena remains speculation.', status: '+10 value confirmed / allocation and surveillance unresolved', source: source391 }),
      freeze({ subject: 'Fistful of Weapons', people: 'Padaille, Hinrigh', notes: 'Padaille demonstrates hammer, drill, and axe forms from his right hand.', status: 'named Conjuration ability demonstrated / complete weapon set unresolved', source: source391 }),
      freeze({ subject: 'Padaille death', people: 'Padaille, Hinrigh, Tevelares, Quorolle', notes: 'Hinrigh forces Padaille’s axe-form hand into the back of his head, killing him. Tevelares and Quorolle escape and decide to ask Morena for instructions.', status: 'Padaille body death confirmed / survivors retreat', source: source391 }),
      freeze({ subject: 'Misha mention', people: 'Hinrigh, Misha Hao', notes: 'Hinrigh says he is counting on Misha after Padaille’s death, but the supplied synopsis gives no task or ability for her.', status: 'named reliance confirmed / exact role unresolved', source: source391 }),
    ]),
  }),
]);

export const bloodyMaryChapter391Research = succession391BloodyMaryResearch;
export const biohazardChapter391Research = succession391BiohazardResearch;
export const contagionChapter391Research = succession391ContagionResearch;
export const fistfulOfWeaponsChapter391Research = succession391FistfulOfWeaponsResearch;
export const hinrighOperationChapter391Research = succession391HinrighOperationalResearch;
export const relationshipsChapter391Research = succession391RelationshipRecords;
export const chapter391Research = succession391ChapterResearch;
