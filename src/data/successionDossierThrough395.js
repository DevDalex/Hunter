import * as base from './successionDossierThrough394.js';
import {
  succession395ChapterResearch,
  succession395LowerTierResearch,
  succession395MeteorCityResearch,
  succession395Mysteries,
  succession395RelationshipRecords,
  succession395ResolvedQuestions,
  succession395SourcePolicy,
  succession395TroupeBreachResearch,
} from './succession395Research.js';

export * from './successionDossierThrough394.js';

const freeze = (value) => Object.freeze(value);
const source395 = 'https://hunterxhunter.fandom.com/wiki/Chapter_395';

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession395RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession395Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession395ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter395: source395,
  sourcePolicy395: succession395SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 395 spatial-access proof / hidden-room breach / Meteor City origin flashback',
    description: 'Chapter 395 advances the lower-tier Heil-Ly investigation from Room 3101 uncertainty into footage-backed spatial-access analysis and a physical breach from Room 3102, then opens an undated Meteor City childhood flashback that supplies Troupe-origin context without importing the formal founding or Chapter 396+ outcomes.',
    records: freeze([
      freeze({ subject: 'Hinrigh / camcorder spatial-access conclusion', people: 'Hinrigh Biganduffno', notes: 'The recovered footage shows two Heil-Ly members use the only visible hallway and later appear to enter again from another direction. Hinrigh considers secret passages but concludes Nen-mediated teleportation/spatial access is involved.', status: 'Nen-mediated spatial access strongly established by Hinrigh / exact user and mechanics unresolved', source: source395 }),
      freeze({ subject: 'Joint pursuit briefing', people: "Hinrigh, Ken'i, Borksen, Gipper, Otocin, Momolly", notes: 'The registered Heil-Ly office is confirmed sealed and empty; Ken’i assigns the Troupe trio to the probable hidden base and joins Hinrigh in tracking the two recorded members for live capture.', status: 'joint information-sharing active / Tserriednich soldiers constrained by known-face exposure', source: source395 }),
      freeze({ subject: 'Room 3102 physical breach', people: 'Nobunaga, Phinks, Feitan', notes: 'The Troupe enters Room 3102, chooses the bathroom as a safer test point, and Nobunaga cuts through the wall into the hidden space.', status: 'physical breach confirmed / Nen doorway trigger bypassed rather than solved', source: source395 }),
      freeze({ subject: 'Recently occupied Heil-Ly hidden room', people: 'Nobunaga, Phinks, Feitan, Luini', notes: 'Food and drinks imply recent occupancy. The trio debates why Luini was allowed to confront them and whether Heil-Ly resembles the Troupe’s early state.', status: 'recent occupancy inferred from direct scene evidence / occupants and evacuation route unresolved', source: source395 }),
      freeze({ subject: 'Meteor City historical context', people: 'Chrollo, Franklin, Shalnark, Uvogin, Phinks, Feitan, Lisores', notes: 'The flashback shows the future Troupe circle as children amid a city-wide abduction crisis, while narration supplies social-status, casualty, mafia-protection, and retribution-law history.', status: 'historical context confirmed / exact flashback year and formal Troupe founding not supplied', source: source395 }),
      freeze({ subject: 'Power Cleaners dubbing project', people: 'Chrollo, Pakunoda, Sheila, Sarasa', notes: 'Chrollo discovers Mighty Sweepin’ Power Cleaners and organizes a dubbed performance with Pakunoda, Sheila, and Sarasa. Sheila states her childhood goal of becoming a Hunter.', status: 'childhood collaboration confirmed / no later Sheila or Sarasa outcome imported', source: source395 }),
      freeze({ subject: 'Unidentified abducted children', people: 'Three unnamed children', notes: 'Three hooded and bound children are shown in a van on Meteor City’s outskirts while the dubbing recording begins.', status: 'abduction shown / captive identities explicitly unresolved', source: source395 }),
    ]),
  }),
]);

export const lowerTierChapter395Research = succession395LowerTierResearch;
export const troupeBreachChapter395Research = succession395TroupeBreachResearch;
export const meteorCityChapter395Research = succession395MeteorCityResearch;
export const relationshipsChapter395Research = succession395RelationshipRecords;
export const chapter395Research = succession395ChapterResearch;
