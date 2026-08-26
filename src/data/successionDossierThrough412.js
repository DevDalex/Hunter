import * as base from './successionDossierThrough411.js';
import {
  succession412ChapterFocus,
  succession412ChapterResearch,
  succession412Mysteries,
  succession412NenFindings,
  succession412RelationshipRecords,
  succession412ResolvedQuestions,
  succession412SourcePolicy,
} from './succession412Research.js';

export * from './successionDossierThrough411.js';

const freeze = (value) => Object.freeze(value);
const source412 = 'https://hunterxhunter.fandom.com/wiki/Chapter_412';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession412ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 412),
  ...succession412ChapterResearch,
].sort((left, right) => left.number - right.number));

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.type && record.chapters && record.source) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  return freeze({ ...record, from: record.from || subjectFrom || record.subject || 'Unknown', to: record.to || record.target || subjectTo || 'Unknown', type: record.type || record.relation || record.relationship || 'documented relationship', note: record.note || record.detail || record.boundary || record.evidence || record.status || '', phase: record.phase || 'Voyage Chapter 412', chapters: record.chapters || '412', state: record.state || record.status || 'documented', source: record.source || source412 });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession412RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession412Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession412ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter412: source412, sourcePolicy412: succession412SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 412 Woble identity correction / chain verification / Beyond document visit',
    description: 'Chapter 412 is a non-linear Voyage Day 12 packet. It preserves Slakka’s challenge, the forty-eight-hour Oito investigation, Bill’s linguistic clue, Kurapika’s calibrated Dowsing Chain procedure, the distinction between Oito’s daughter Woble and the unnamed nephew aboard, the Seed Urn/departure eligibility explanation, the 10:00 a.m. class return with Slakka absent, Kurapika’s strategic reset, and Cleapatro’s Beyond visit without importing Chapter 413+ consequences.',
    records: freeze([
      freeze({ subject: 'Woble identity correction', people: 'Oito, Woble, Kurapika, Bill', notes: 'Oito says her daughter Woble is with Oito’s younger sister at an unknown location and the infant aboard is that sister’s son.', status: 'Oito testimony chain-verified / nephew unnamed / location unknown', source: source412 }),
      freeze({ subject: 'Dowsing Chain procedure', people: 'Kurapika, Oito', notes: 'Kurapika calibrates baseline yes/no and instructed-yes responses before the identity questions; the chain remains still during Oito’s explanation.', status: 'demonstrated procedure / no omniscience upgrade', source: source412 }),
      freeze({ subject: 'Eligibility basis', people: 'Oito, Woble, unnamed nephew', notes: 'Oito says her daughter attended the Seed Urn ceremony while her nephew was at departure, so neither child satisfies the participation combination she describes.', status: 'verified testimony / later ritual and legal effect quarantined', source: source412 }),
      freeze({ subject: 'Room 1014 return', people: 'Kurapika, Slakka, class participants', notes: 'Kurapika restarts the class at 10:00 a.m.; Slakka is the only participant who does not return.', status: 'non-return confirmed / later motive unresolved', source: source412 }),
      freeze({ subject: 'Kurapika strategic reset', people: 'Kurapika, Benjamin, Zhang Lei, Tubeppa, Kacho, Beyond', notes: 'Kurapika recommits to Nen development, counts his remaining strategic assets, and considers whether speaking with Beyond would be the fastest curse-information route.', status: 'internal strategic assessment / no Beyond meeting yet', source: source412 }),
      freeze({ subject: 'Beyond legal-document visit', people: 'Beyond, Cleapatro, Kanzai, Saiyu', notes: 'Cleapatro states Beyond filed 1,047 lawsuits as plaintiff and that all were thrown out; Kanzai and Saiyu screen the documents while the argument continues.', status: 'strict Chapter 412 endpoint / later document result quarantined', source: source412 }),
    ]),
  }),
]);

export const chapter412Research = succession412ChapterResearch;
export const relationshipsChapter412Research = succession412RelationshipRecords;
export const nenChapter412Research = succession412NenFindings;
