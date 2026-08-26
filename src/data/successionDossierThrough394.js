import * as base from './successionDossierThrough393.js';
import {
  succession394ChapterResearch,
  succession394HeilLyResearch,
  succession394Mysteries,
  succession394RelationshipRecords,
  succession394ResolvedQuestions,
  succession394RoomNetworkResearch,
  succession394SourcePolicy,
  succession394TserriednichSoldierResearch,
} from './succession394Research.js';

export * from './successionDossierThrough393.js';

const freeze = (value) => Object.freeze(value);
const source394 = 'https://hunterxhunter.fandom.com/wiki/Chapter_394';

const gateaume394Ability = freeze({
  ability: 'Gateaume’s Decoy Body Ability', user: 'Gateaume', owner: 'Gateaume', type: 'Nen type unknown · descriptive archive label', category: 'Decoy / remote-body phenomenon', chapters: '394', chapter: 394,
  conditions: 'Gateaume’s displayed old-man body is stabbed in the right thigh, produces no blood, is distinguished from a real body elsewhere, and later disappears while the knife drops.',
  mechanics: 'Chapter 394 confirms only the bloodless false/remote-body observations. It does not establish whether the body is conjured, emitted, manipulated, projected, transformed, remotely controlled, or produced through another mechanism.',
  knownAtChapterBoundary: 'Official ability name, Nen category, activation, real-body location, sensory link, damage transfer, range, duration, and reset rules remain unresolved.',
  target: 'Gateaume’s displayed Room 3101 body', confidence: 'Observed false/remote-body phenomenon confirmed / full mechanics unresolved.', source: source394,
});
const contagion394Ability = freeze({
  ability: 'Contagion', user: 'Morena Prudo', owner: 'Morena Prudo', type: 'Community leveling Nen system', category: 'Infection / progression / ability development / tracking', chapters: '378, 391, 393–394', chapter: 394,
  conditions: 'The established Heil-Ly leveling system remains active. Bille kills Tassi and reaches level 21; Water Divination then identifies Bille as a Conjurer. Morena also says she wants to infect someone on Tserriednich’s side so she can track his movements.',
  mechanics: 'Chapter 394 demonstrates the level-21 transition discussed in Chapter 393 and adds Morena’s intended tracking use for an infected target. Dogman is ordered to continue leveling from 36 to beyond 50 before the priority mission.',
  knownAtChapterBoundary: 'Bille’s natural type is Conjurer and Matvere’s is Transmuter, but Bille’s personal developed ability is not supplied. Tracking precision, interface, range, duration, and limits remain unresolved. Dogman’s exact search target is not named in this synopsis.',
  target: 'Heil-Ly community members and intended infected target on Tserriednich’s side', confidence: 'Level-21 transition and tracking intent confirmed / individual ability and tracking limits unresolved.', source: source394,
});
const voconte394Ability = freeze({
  ability: 'Voconte’s Door Ability', user: 'Voconte', owner: 'Voconte', type: 'Nen type of ability unknown · owner is a confirmed Emitter · descriptive archive label', category: 'Door / spatial route-support ability', chapters: '393–394', chapter: 394,
  conditions: 'Chapter 393 establishes a proposed trap use. Chapter 394 adds Terebellum’s report that Voconte directly connected the corpse-receiving room to the processing area.',
  mechanics: 'The technique can support at least one reported direct room-to-processing connection. Chapter 394 also describes other Heil-Ly access routes, but does not assign every route or transition to Voconte.',
  knownAtChapterBoundary: 'Official name, ability-specific Nen category, setup, trigger, directionality, valid surfaces, maximum links, range, duration, capacity, aura cost, and reset rules remain unresolved.',
  target: 'Prepared route endpoints / exact targeting rules unresolved', confidence: 'Direct connection function reported / full mechanics and category unresolved.', source: source394,
});

const abilityNamesReplacedAt394 = new Set(['Contagion', 'Voconte’s Door Ability']);
export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !abilityNamesReplacedAt394.has(record.ability)),
  contagion394Ability,
  voconte394Ability,
  gateaume394Ability,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession394RelationshipRecords,
]);

const superseded393Mystery = (record) => /does room 3101 actually belong to or connect to heil-ly/i.test(String(record?.question || ''));
export const successionMysteries = freeze([
  ...base.successionMysteries.filter((record) => !superseded393Mystery(record)),
  ...succession394Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession394ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter394: source394, sourcePolicy394: succession394SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 394 Room 3101 route / Heil-Ly processing / Tserriednich soldier counteroperation',
    description: 'Chapter 394 confirms Room 3101 as part of Heil-Ly’s usable route system, kills Tassi inside the network, demonstrates the level-21 transition, expands Voconte/processing logistics, shifts Morena toward capturing Tserriednich’s soldiers, and introduces Borksen as the soldier circle’s limited Nen-information adviser.',
    records: freeze([
      freeze({ subject: 'Gateaume / Room 3101 deception', people: 'Gateaume, Hinrigh, Ken’i', notes: 'Hinrigh’s thigh stab produces no blood; Gateaume distinguishes the displayed body from his real body and disappears while the knife falls.', status: 'false/remote body observed / real body and ability mechanics unresolved', source: source394 }),
      freeze({ subject: 'Tassi transfer and death', people: 'Tassi, Bille, Matvere, Gelato', notes: 'Tassi disappears through Room 3101, appears inside Heil-Ly’s network, and is killed by Bille. Bille reaches level 21 and tests as Conjurer; Matvere states he is a Transmuter.', status: 'Tassi dead / Bille level 21 and Conjurer confirmed / Bille personal ability unrevealed', source: source394 }),
      freeze({ subject: 'Voconte / processing connection', people: 'Voconte, Terebellum, Chiffon Toto, Montblanc Toto', notes: 'Terebellum says Voconte directly connected the corpse-receiving room to the processing area, where Tassi’s clothing removal and dismemberment begin.', status: 'one direct connection reported / full door topology unresolved', source: source394 }),
      freeze({ subject: 'Morena / Tserriednich counteroperation', people: 'Morena, Sodom, Dogman, Orarge, Yokotani, Matvere', notes: 'Morena abandons Room 3101 access, shifts to Door C, plans to capture and infect a Tserriednich soldier for tracking, and sends Dogman to level past 50.', status: 'capture/tracking plan active / exact Tserriednich response and Dogman search target unresolved', source: source394 }),
      freeze({ subject: 'Room 3131 route', people: 'Notre, Soufflé', notes: 'Notre reports a Room 3131 → disposal/laundry → processing/shower → living-room sequence for returning through the network.', status: 'reported route sequence confirmed / omitted transition mechanics unresolved', source: source394 }),
      freeze({ subject: 'Tserriednich soldier group', people: 'Gipper, Otocin, Momolly, Borksen, Theta, Salkov', notes: 'The soldiers raid the Heil-Ly office, assess legal/institutional escalation, learn or confirm limited Nen intelligence, and develop transfer-warning and capture-survival contingencies.', status: 'planning and knowledge state confirmed / predicted institutional war not treated as underway', source: source394 }),
    ]),
  }),
]);

export const roomNetworkChapter394Research = succession394RoomNetworkResearch;
export const heilLyChapter394Research = succession394HeilLyResearch;
export const tserriednichSoldiersChapter394Research = succession394TserriednichSoldierResearch;
export const relationshipsChapter394Research = succession394RelationshipRecords;
export const chapter394Research = succession394ChapterResearch;
