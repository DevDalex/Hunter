import * as base from './successionDossierThrough395.js';
import {
  succession396ChapterResearch,
  succession396Mysteries,
  succession396PerformanceResearch,
  succession396RelationshipRecords,
  succession396ResolvedQuestions,
  succession396SarasaResearch,
  succession396SourcePolicy,
  succession396TroupeOriginResearch,
} from './succession396Research.js';

export * from './successionDossierThrough395.js';

const freeze = (value) => Object.freeze(value);
const source396 = 'https://hunterxhunter.fandom.com/wiki/Chapter_396';

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession396RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...base.successionMysteries,
  ...succession396Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession396ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter396: source396,
  sourcePolicy396: succession396SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 396 Meteor City live performance / troupe naming / Sarasa cliffhanger',
    description: 'Chapter 396 remains entirely inside the undated Meteor City childhood flashback. The Power Cleaners dub becomes a successful live performance, the wider childhood circle joins the project and adopts “troupe” as an incomplete performance-group label, and Sarasa leaves alone to search for tapes near Uga Forest while the kidnappers consider one more victim. No present-day Black Whale state is manufactured and no Chapter 397 Sarasa outcome is imported.',
    records: freeze([
      freeze({ subject: 'Power Cleaners live screening', people: 'Chrollo, Pakunoda, Sheila, Sarasa, Lisores', notes: 'A tangled sound tape stops the prerecorded dub, so Chrollo leads a live restart and the four performers complete the episode before an enthusiastic audience.', status: 'live performance confirmed / Chrollo villain voice remains acting', source: source396 }),
      freeze({ subject: 'Expanded childhood cast', people: 'Chrollo, Uvogin, Nobunaga, Feitan, Phinks, Shalnark, Franklin, Machi, Pakunoda, Sheila, Sarasa', notes: 'Uvogin praises Chrollo and joins the cast; the broader group chooses roles, rehearses, writes, and makes props.', status: 'creative collaboration expanded / later Phantom Troupe membership rules not inferred', source: source396 }),
      freeze({ subject: 'Incomplete “troupe” naming', people: 'Childhood Meteor City performance group', notes: 'The children debate theater company versus traveling performers and accept Pakunoda’s “troupe” suggestion while saying they still need another word in front of it.', status: 'performance-troupe label confirmed / formal Phantom Troupe name and Spider structure not yet supplied', source: source396 }),
      freeze({ subject: 'Uvogin world-tour goal', people: 'Uvogin, Chrollo', notes: 'Uvogin says the project gave him a goal: tour the world with Chrollo and become the world’s greatest villain.', status: 'theatrical ambition confirmed / criminal vow not inferred', source: source396 }),
      freeze({ subject: 'Sarasa tape-search departure', people: 'Sarasa, Chrollo, Phinks, Shalnark', notes: 'Sarasa leaves alone for sorting duty and hopes to search a corporate dump near Uga Forest for more Power Cleaners tapes.', status: 'Sarasa alive and traveling alone in depicted story-time', source: source396 }),
      freeze({ subject: 'Kidnapper cliffhanger', people: 'Three unidentified child hostages / unidentified kidnappers', notes: 'The kidnappers say Meteor City is becoming more vigilant and their quota is met, then one suggests taking one more child.', status: 'threat active / no Chapter 396 Sarasa encounter, capture, harm, death, or explicit target identification', source: source396 }),
    ]),
  }),
]);

export const performanceChapter396Research = succession396PerformanceResearch;
export const troupeOriginChapter396Research = succession396TroupeOriginResearch;
export const sarasaChapter396Research = succession396SarasaResearch;
export const relationshipsChapter396Research = succession396RelationshipRecords;
export const chapter396Research = succession396ChapterResearch;
