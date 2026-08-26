import * as base from './successionDossierThrough397.js';
import {
  succession398BiohazardResearch,
  succession398ChapterResearch,
  succession398HideoutResearch,
  succession398Mysteries,
  succession398RelationshipRecords,
  succession398ResolvedQuestions,
  succession398SourcePolicy,
  succession398TeleportTrapResearch,
} from './succession398Research.js';

export * from './successionDossierThrough397.js';

const freeze = (value) => Object.freeze(value);
const source398 = 'https://hunterxhunter.fandom.com/wiki/Chapter_398';

const biohazard398Ability = freeze({
  ability: 'Biohazard', user: 'Hinrigh Biganduffno', owner: 'Hinrigh Biganduffno', type: 'Nen type unknown', category: 'Object-to-living-animal transformation', chapters: '390–391, 394, 398', chapter: 398,
  conditions: 'Chapter 398 adds a physical transmitter transformed into a raw oyster that Hinrigh swallows before entering the Heil-Ly teleport trap. Hinrigh says the transformed object reverts after aura depletion and that duration depends on object size.',
  mechanics: 'For the transmitter-oyster specifically, Hinrigh estimates roughly two hours. The paired receiver provides distance and rough direction, increases beep frequency/pitch and redness when closer, has a maximum radius of one kilometer, and does not account for altitude.',
  knownAtChapterBoundary: 'The transmitter use expands Biohazard without establishing a universal size-to-duration formula, exact aura cost, maximum transformed mass/count, or rule that every transformation can end only through aura depletion.',
  target: 'Ordinary physical objects selected for transformation; Chapter 398 demonstrates a transmitter.', confidence: 'Transmitter-oyster use, use-specific duration estimate, aura-depletion reversion statement, and receiver behavior confirmed / complete Biohazard limits and Nen type unresolved.', source: source398,
});

const teleport398Ability = freeze({
  ability: 'Heil-Ly Front-Door Teleport Trap', user: 'Unknown Heil-Ly-associated operator', owner: 'Unknown', type: 'Nen type unknown · descriptive archive label', category: 'Prepared spatial teleport trap', chapters: '398', chapter: 398,
  conditions: 'Bathroom-side entry is demonstrated without teleportation. The first hostage leaves through the front and disappears only on re-entry; a second hostage, Hinrigh, and Nobunaga are also teleported through the tested entry.',
  mechanics: 'Repeated inward crossing of the tested front doorway is the observed activation pattern. Chapter 398 demonstrates reuse but does not supply the exact switch geometry, setup process, user, official name, category, capacity, cost, or reset rule.',
  knownAtChapterBoundary: 'Gateaume’s displayed double is not visibly present for the tested activations. Nobunaga’s land-mine classification and Phinks’s user-near-destination claim remain hypotheses, not confirmed mechanics.',
  target: 'People crossing the tested front-door entry under the demonstrated condition.', confidence: 'Repeatable teleport behavior confirmed / owner, Nen category, setup, full limits, and destination topology unresolved.', source: source398,
});

const stage398Ability = freeze({
  ability: 'Heil-Ly Self-Restoring Hideout Stage', user: 'Unknown', owner: 'Unknown', type: 'Nen type unknown · descriptive archive label', category: 'Nen-protected prepared space', chapters: '398', chapter: 398,
  conditions: 'Nobunaga strikes a hideout wall several times with his katana and the damage rapidly disappears. Hinrigh recognizes the protection as Nen.',
  mechanics: 'The observed wall restores damage. Nobunaga names Conjuration, Transmutation, and Specialization as possibilities and discusses user-proximity contracts, but neither category nor operator is confirmed.',
  knownAtChapterBoundary: 'Morena is shown smiling elsewhere, but that does not identify her as the personal operator of the restorative wall or front-door teleport trap.',
  target: 'Observed hideout wall; broader protected footprint unresolved.', confidence: 'Self-restoring Nen protection observed / official name, user, Nen category, scope, cost, and contract unresolved.', source: source398,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => record.ability !== 'Biohazard'),
  biohazard398Ability,
  teleport398Ability,
  stage398Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession398RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession398Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession398ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter398: source398,
  sourcePolicy398: succession398SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 398 teleport-trap testing / Biohazard transmitter / Hinrigh–Nobunaga hideout infiltration',
    description: 'Chapter 398 returns to present-day Tier 3. The Troupe empirically isolates the front-door teleport trigger while preserving uncertainty about Gateaume, the user, and the Nen category; Hinrigh converts a transmitter into an oyster, explains its receiver and duration/reversion details, enters the trap himself, and is joined by Nobunaga inside a self-restoring Nen-protected Heil-Ly hideout.',
    records: freeze([
      freeze({ subject: 'Front-door teleport trigger', people: 'Nobunaga, Phinks, Feitan, two unnamed Mafia hostages, Hinrigh', notes: 'Bathroom-side entry is safe in the demonstrated test. Re-entering through the front teleports the first hostage; a second hostage, Hinrigh, and Nobunaga also teleport through the prepared entry.', status: 'repeat/continuous activation demonstrated / exact switch, user, ability name, category, and limits unresolved', source: source398 }),
      freeze({ subject: 'Barrier vs land-mine Nen trap models', people: 'Nobunaga, Phinks, Feitan', notes: 'Chapter exposition distinguishes support-object barrier traps from direct Nen-switch land-mine traps. Nobunaga infers the tested room is land-mine type because no support objects are visible; Phinks adds a user-proximity theory.', status: 'general distinction documented / specific Heil-Ly trap classification and user-proximity conclusion remain character inference', source: source398 }),
      freeze({ subject: 'Biohazard transmitter-oyster', people: 'Hinrigh, Phinks, Nobunaga, Feitan', notes: 'Hinrigh transforms a transmitter into a raw oyster, swallows it, says reversion follows aura depletion, says duration depends on size, and estimates about two hours for this object.', status: 'use-specific mechanics confirmed / universal duration formula and complete limits unresolved', source: source398 }),
      freeze({ subject: 'Tracking receiver', people: 'Hinrigh, Phinks, Feitan', notes: 'Receiver supplies distance and rough direction, becomes faster/higher/redder when closer, has one-kilometer maximum radius, and does not account for altitude. After Hinrigh teleports, the reading is interpreted as roughly 500–1,000 meters.', status: 'receiver behavior confirmed / exact hideout coordinate and altitude unresolved', source: source398 }),
      freeze({ subject: 'Hinrigh–Nobunaga infiltration pair', people: 'Hinrigh, Nobunaga', notes: 'Nobunaga follows Hinrigh through the trap, chooses to move with him, tests the wall, watches for disappearance triggers, and asks Hinrigh to drop the honorific.', status: 'temporary tactical cooperation confirmed / no permanent alliance or membership change', source: source398 }),
      freeze({ subject: 'Self-restoring hideout stage', people: 'Nobunaga, Hinrigh, Morena', notes: 'Nobunaga’s katana cuts rapidly disappear and Hinrigh recognizes Nen protection. Morena is shown smiling elsewhere.', status: 'restoration observed / Conjuration, Transmutation, Specialization, user proximity, operator identity, and Morena control remain unresolved', source: source398 }),
      freeze({ subject: 'Hideout interior sweep', people: 'Hinrigh, Nobunaga', notes: 'The pair observe fresh blood, a shower room, bathroom, three toilets, and finally a room filled with laundry.', status: 'local facilities confirmed / full hideout topology, capacity, next route, and exact ship coordinates unresolved', source: source398 }),
    ]),
  }),
]);

export const teleportTrapChapter398Research = succession398TeleportTrapResearch;
export const biohazardChapter398Research = succession398BiohazardResearch;
export const hideoutChapter398Research = succession398HideoutResearch;
export const relationshipsChapter398Research = succession398RelationshipRecords;
export const chapter398Research = succession398ChapterResearch;
