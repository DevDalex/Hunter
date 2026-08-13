import * as base from './successionDossierThrough413.js';
import {
  succession414ChapterFocus,
  succession414ChapterResearch,
  succession414Mysteries,
  succession414NenFindings,
  succession414RelationshipRecords,
  succession414ResolvedQuestions,
  succession414SourcePolicy,
} from './succession414Research.js';

export * from './successionDossierThrough413.js';

const freeze = (value) => Object.freeze(value);
const source414 = 'https://hunterxhunter.fandom.com/wiki/Chapter_414';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession414ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 414),
  ...succession414ChapterResearch,
].sort((left, right) => left.number - right.number));

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.type && record.chapters && record.source) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  return freeze({
    ...record,
    from: record.from || subjectFrom || record.subject || 'Unknown',
    to: record.to || record.target || subjectTo || 'Unknown',
    type: record.type || record.relation || record.relationship || 'documented relationship',
    note: record.note || record.detail || record.boundary || record.evidence || record.status || '',
    phase: record.phase || 'Voyage Chapter 414',
    chapters: record.chapters || '414',
    state: record.state || record.status || 'documented',
    source: record.source || source414,
  });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession414RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession414Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession414ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter414: source414, sourcePolicy414: succession414SourcePolicy });
export const guardAssignmentGroups = freeze([
  ...(base.guardAssignmentGroups || []),
  freeze({
    group: 'Chapter 414 Friends / pre-declaration operations / Woble curse planning',
    description: 'Strict Chapter 414 integration preserving Room 1007 and Room 1009 unresolved operations, the daughter-Woble versus aboard-nephew identity boundary, bounded Nen planning, and the Yamato trusted-contact endpoint.',
    records: freeze([]),
  }),
]);

export const chapter414Research = succession414ChapterResearch;
export const relationshipsChapter414Research = succession414RelationshipRecords;
export const nenChapter414Research = succession414NenFindings;
