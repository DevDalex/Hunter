import * as base from './successionDossierThrough398.js';
import {
  succession399ChapterResearch,
  succession399Mysteries,
  succession399OperationalResearch,
  succession399RelationshipRecords,
  succession399ResolvedQuestions,
  succession399RouteResearch,
  succession399SourcePolicy,
  succession399TerebellumResearch,
  succession399YokotaniResearch,
} from './succession399Research.js';

export * from './successionDossierThrough398.js';

const freeze = (value) => Object.freeze(value);
const source399 = 'https://hunterxhunter.fandom.com/wiki/Chapter_399';

const biohazard399Ability = freeze({
  ability: 'Biohazard', user: 'Hinrigh Biganduffno', owner: 'Hinrigh Biganduffno', type: 'Nen type unknown', category: 'Object-to-living-animal transformation', chapters: '390–391, 394, 398–399', chapter: 399,
  conditions: 'Chapter 399 continues the transmitter-oyster operation: Hinrigh vomits the still-transformed oyster, hides it under a laundry-room cabinet, and leaves it there. After returning to Room 3101, he states he cannot use Biohazard again for the remainder of that day.',
  mechanics: 'Chapter 398’s size-dependent duration, roughly two-hour transmitter estimate, aura-depletion reversion statement, and one-kilometer receiver behavior remain the latest detailed mechanics. Chapter 399 adds only the demonstrated concealment state and Hinrigh’s rest-of-day inability to activate the ability again.',
  knownAtChapterBoundary: 'The rest-of-day statement is not converted into a universal fixed daily-use count, exact aura quota, cooldown equation, or reset clock. Hinrigh separately says he has used all of his knives; the archive does not make knife exhaustion a Biohazard condition.',
  target: 'Ordinary physical objects selected for transformation; the tracked object remains the transmitter-oyster.', confidence: 'Transmitter remains transformed and hidden; rest-of-day unavailability confirmed by Hinrigh / fixed quota, exact aura cost, Nen type, and complete limits unresolved.', source: source399,
});

const teleport399Ability = freeze({
  ability: 'Heil-Ly Front-Door Teleport Trap', user: 'Unknown Heil-Ly-associated operator', owner: 'Unknown', type: 'Nen type unknown · descriptive archive label', category: 'Prepared spatial teleport trap / concealed passage', chapters: '398–399', chapter: 399,
  conditions: 'Chapter 398 establishes Room 3101-side/front-door inward teleport into the hideout. Chapter 399 shows Nobunaga and Hinrigh returning from the hideout to Room 3101 during/after expulsion.',
  mechanics: 'The operational route now functions in the demonstrated scenes as both hostile entry trap and concealed passage. Nobunaga additionally reasons that Heil-Ly must possess a separate member-only jump point, but that point is not directly observed.',
  knownAtChapterBoundary: 'Official ability name, operator, category, switch geometry, member-only access, and exact relationship to Gateaume, Voconte, or LSDF remain unresolved. Yokotani’s expulsion sequence does not prove LSDF creates the route.',
  target: 'People crossing the demonstrated Room 3101-side entry and people returning/being expelled through the demonstrated hideout-side route.', confidence: 'Inbound and outbound operational results confirmed / operator, member-only route, Nen category, exact topology, and ownership unresolved.', source: source399,
});

const sweetHome399Ability = freeze({
  ability: 'Damage: “Sweet Home”', user: 'Terebellum', owner: 'Terebellum', type: 'Emitter / Emission', category: 'Damage and attacking-material displacement / transfer', chapters: '399', chapter: 399,
  conditions: 'For protection of another target, Terebellum must be touching it with his right hand at the moment damage is received. He takes that damage into himself and can transfer it onward to something touched with his left hand.',
  mechanics: 'If received damage is not transferred onward, Terebellum bears it. Chapter 399 also demonstrates attacking blade/tip material moving with the transferred damage.',
  knownAtChapterBoundary: 'Range beyond contact, maximum damage/capacity, transfer delay/storage, aura cost, and complete self-target rules remain unresolved. The ability is not generalized into healing or unconditional immunity.',
  target: 'Terebellum and right-hand protected targets / left-hand transfer targets under the demonstrated contact rules.', confidence: 'Official name, Emitter type, core right/left-hand transfer conditions and self-cost confirmed / broader limits unresolved.', source: source399,
});

const lsdf399Ability = freeze({
  ability: 'A Battle of Wits: “LSDF”', user: 'Yokotani', owner: 'Yokotani', type: 'Conjurer / Conjuration', category: 'Law-conditioned hideout defense / conjured autonomous guards', chapters: '399', chapter: 399,
  conditions: 'Usable only at the hideout where Morena is located. Yokotani activates it after identifying himself to a law-breaking intruder. More serious crimes allow higher-level guards.',
  mechanics: 'Seven guards appear in the demonstrated encounter. Trespassing and attempted murder produce alert level 4; Nobunaga’s attack pushes a guard to maximum alert. The guards cannot harm the criminal, while the criminal’s attacks are ineffective against them under the established conditions. They can restrain, confiscate weapons, carry targets, and enforce expulsion.',
  knownAtChapterBoundary: 'Nobunaga calls the guards autopilot. Hinrigh infers Yokotani cannot see through them, but that visual-link limit is not independently narrated. The Room 3101 teleport route used during expulsion is not assigned to LSDF itself.',
  target: 'Law-breaking intruders identified by Yokotani at the qualifying Morena hideout.', confidence: 'Official name, Conjuration type, location/law conditions, crime scaling, defensive guard behavior, seven-guard use, alert escalation, restraint and expulsion confirmed / full scale, guard cap, cost, range and route relationship unresolved.', source: source399,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !['Biohazard', 'Heil-Ly Front-Door Teleport Trap'].includes(record.ability)),
  biohazard399Ability,
  teleport399Ability,
  sweetHome399Ability,
  lsdf399Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession399RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession399Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession399ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter399: source399,
  sourcePolicy399: succession399SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 399 Sweet Home / LSDF / hideout expulsion / transmitter search',
    description: 'Chapter 399 continues directly from the laundry-room endpoint. Hinrigh and Nobunaga encounter nine Heil-Ly members, reveal Terebellum’s Damage: “Sweet Home” and Yokotani’s A Battle of Wits: “LSDF”, are expelled back toward Room 3101, leave the transmitter hidden in the base, and divide follow-up search work without resolving the route operator, member-only access, kikan role, or Morena’s complete capabilities.',
    records: freeze([
      freeze({ subject: 'Laundry-room disappearance theories', people: 'Hinrigh, Nobunaga', notes: 'Neighbor complicity, civilian restraint, automatic evacuation, and oblivious-neighbor alarm models are discussed.', status: 'recent occupancy suspected / actual explanation unresolved', source: source399 }),
      freeze({ subject: 'Nine-member Heil-Ly contact', people: 'Hinrigh, Nobunaga, Gelato, Soufflé, Terebellum, Perigord, Orarge, Yokotani + three unnamed', notes: 'The main door opens onto nine seated Heil-Ly members. The supplied synopsis names six of them and leaves three unidentified.', status: 'nine-member gathering confirmed / no identities invented for the remaining three', source: source399 }),
      freeze({ subject: 'Damage: “Sweet Home”', people: 'Terebellum, Hinrigh, Nobunaga, Yokotani', notes: 'Emitter ability receives damage through right-hand target contact at impact and can transfer it through left-hand contact; untransferred damage remains on Terebellum and attacking material is displaced in the demonstrated strikes.', status: 'official name/type/core mechanics confirmed / capacity, range, storage timing and cost unresolved', source: source399 }),
      freeze({ subject: 'Perigord “organ” assignment', people: 'Perigord, Orarge, Morena', notes: 'Orarge reminds Perigord that Morena already selected him as the “organ” and told him to keep his head down.', status: 'selection confirmed / exact kikan function and Perigord ability unresolved', source: source399 }),
      freeze({ subject: 'A Battle of Wits: “LSDF”', people: 'Yokotani, Nobunaga, Hinrigh, Morena', notes: 'Conjuration ability works only at the hideout where Morena is located; identification of a law-breaking intruder triggers defensive guards whose level scales with crime severity. Seven guards appear at alert 4, one reaches max alert, and Nobunaga is restrained and expelled.', status: 'official name/type/core conditions and demonstrated enforcement confirmed / full scale, visual link, cost and teleport-route relationship unresolved', source: source399 }),
      freeze({ subject: 'Room 3101 ↔ hideout route', people: 'Nobunaga, Hinrigh', notes: 'Chapter 398 showed Room 3101-side inward entry to the hideout; Chapter 399 shows Nobunaga and Hinrigh returning from the hideout to Room 3101.', status: 'two-way operational result documented / member-only jump point, operator, formal name and category unresolved', source: source399 }),
      freeze({ subject: 'Hidden transmitter / Hinrigh resource state', people: 'Hinrigh', notes: 'Hinrigh vomits the still-transformed oyster, hides it under a laundry-room cabinet, later says Biohazard is unavailable for the rest of the day and that all of his knives are spent.', status: 'transmitter hidden and current resource limits confirmed / universal Biohazard quota or reset rule not established', source: source399 }),
      freeze({ subject: 'Xi-Yu / Troupe follow-up division', people: 'Hinrigh, Nobunaga', notes: 'Hinrigh plans floor-plan mapping, member descriptions, witnesses, activity-area narrowing and Xi-Yu information consolidation; the Troupe takes the transmitter search.', status: 'follow-up plan confirmed / results belong to later chapters', source: source399 }),
    ]),
  }),
]);

export const terebellumChapter399Research = succession399TerebellumResearch;
export const yokotaniChapter399Research = succession399YokotaniResearch;
export const routeChapter399Research = succession399RouteResearch;
export const operationsChapter399Research = succession399OperationalResearch;
export const relationshipsChapter399Research = succession399RelationshipRecords;
export const chapter399Research = succession399ChapterResearch;
