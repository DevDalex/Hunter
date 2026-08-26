import * as base from './successionDossierThrough414.js';
import {
  succession415ChapterFocus,
  succession415ChapterResearch,
  succession415Mysteries,
  succession415NenFindings,
  succession415RelationshipRecords,
  succession415ResolvedQuestions,
  succession415SourcePolicy,
} from './succession414415Research.js';

export * from './successionDossierThrough414.js';

const freeze = (value) => Object.freeze(value);
const source415 = 'https://hunterxhunter.fandom.com/wiki/Chapter_415';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession415ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 415),
  ...succession415ChapterResearch,
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
    phase: record.phase || 'Voyage Chapter 415',
    chapters: record.chapters || '415',
    state: record.state || record.status || 'documented',
    source: record.source || source415,
  });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession415RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession415Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession415ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter415: source415, sourcePolicy415: succession415SourcePolicy });
export const guardAssignmentGroups = freeze([
  ...(base.guardAssignmentGroups || []),
  freeze({
    group: 'Chapter 415 Truth and Falsehood / Special Martial Law / Beyond curse network',
    description: 'Strict Chapter 415 integration preserving Furykov’s speaker-bounded curse investigation, curse-specific Combo Master estimates, the dispatched postcard contingency, exact relative chronology without an invented declaration minute, royal relocation/confinement states, Room 1007 resolution updates, the Room 1013 hold-space decision, and the Chapter 416+ firewall.',
    records: freeze([]),
  }),
]);

export const chapter415Research = succession415ChapterResearch;
export const relationshipsChapter415Research = succession415RelationshipRecords;
export const nenChapter415Research = succession415NenFindings;
