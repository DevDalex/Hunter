import * as base from './successionDossierThrough410.js';
import {
  succession411ChapterFocus,
  succession411ChapterResearch,
  succession411Mysteries,
  succession411NenFindings,
  succession411RelationshipRecords,
  succession411ResolvedQuestions,
  succession411SourcePolicy,
} from './succession411Research.js';

export * from './successionDossierThrough410.js';

const freeze = (value) => Object.freeze(value);
const source411 = 'https://hunterxhunter.fandom.com/wiki/Chapter_411';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession411ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 411),
  ...succession411ChapterResearch,
].sort((left, right) => left.number - right.number));

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.type && record.chapters && record.source) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  return freeze({ ...record, from: record.from || subjectFrom || record.subject || 'Unknown', to: record.to || record.target || subjectTo || 'Unknown', type: record.type || record.relation || record.relationship || 'documented relationship', note: record.note || record.detail || record.boundary || record.evidence || record.status || '', phase: record.phase || 'Voyage Chapter 411', chapters: record.chapters || '411', state: record.state || record.status || 'documented', source: record.source || source411 });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession411RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession411Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession411ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter411: source411, sourcePolicy411: succession411SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 411 8:00 a.m. body-transfer / Room 1014 second class / ritual-theory endpoint',
    description: 'Chapter 411 is a non-linear Voyage Day 12 packet opening at 8:00 a.m. It preserves Halkenburg’s Balsamilco-body impersonation, Kacho’s post-death construct status, Sarahell’s maid infiltration and conditional Woble curse estimates, the eighteen-person second Nen lesson, Slakka’s information pressure, Kurapika’s theory-bounded succession ritual model, and the terminal Woble-ineligibility declaration without importing Chapter 412+ explanation.',
    records: freeze([
      freeze({ subject: 'Halkenburg / Balsamilco call', people: 'Halkenburg, Balsamilco, Benjamin', notes: 'Halkenburg is active through Balsamilco’s body and impersonates Balsamilco at 8:00 a.m.; the funeral is scheduled for 1:00 p.m. departure and 2:00 p.m. Tier 1 arrival.', status: 'body-transfer impersonation confirmed / Benjamin discovery not shown', source: source411 }),
      freeze({ subject: 'Fugetsu / Kacho', people: 'Fugetsu, Kacho construct, Melody, Kaiser', notes: 'Fugetsu sleeps while Kacho’s post-death Nen construct worries about her energy burden; Melody says Fugetsu needs the construct.', status: 'human Kacho remains deceased / construct active', source: source411 }),
      freeze({ subject: 'Sarahell infiltration', people: 'Sarahell, Woble, Fukataki', notes: 'Sarahell disguises herself as a maid, keeps the curse plan active, checks exorcist risk, and later estimates an object used by Woble could shorten preparation to roughly five days.', status: 'covert threat active / curse not completed / exorcist unresolved', source: source411 }),
      freeze({ subject: 'Second Nen lesson', people: 'Kurapika and eighteen participants', notes: 'Kurapika splits the eighteen expected attendees into nine-person introductory and beginner tracks with separate training promises and an optional aligned-prince extra seat.', status: 'training structure confirmed', source: source411 }),
      freeze({ subject: 'Halkenburg assassination theory', people: 'Kurapika, Halkenburg, Benjamin', notes: 'Kurapika suspects assassination because of the timing before Halkenburg’s Benjamin-related proceeding but explicitly lacks proof.', status: 'Kurapika inference / no proof', source: source411 }),
      freeze({ subject: 'Succession ritual model', people: 'Kurapika', notes: 'Kurapika proposes vows/limitations, a four-stage ritual, a voyage deadline, dynastic-fall risk, and a necessary multiple-survivor failure option.', status: 'Kurapika theory / not narrator-certified cosmology', source: source411 }),
      freeze({ subject: 'Chapter 411 stopping point', people: 'Kurapika, Woble, Oito', notes: 'Kurapika declares Woble ineligible to participate; the class is shocked and Oito is awake with eyes wide.', status: 'strict endpoint / Chapter 412+ explanation quarantined', source: source411 }),
    ]),
  }),
]);

export const chapter411Research = succession411ChapterResearch;
export const relationshipsChapter411Research = succession411RelationshipRecords;
export const nenChapter411Research = succession411NenFindings;
