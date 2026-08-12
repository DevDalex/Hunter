import * as base from './successionDossierThrough407.js';
import {
  succession408CarneLevareFramework,
  succession408ChapterFocus,
  succession408ChapterResearch,
  succession408Mysteries,
  succession408NegotiationGameProgress,
  succession408NenFindings,
  succession408RelationshipRecords,
  succession408ResolvedQuestions,
  succession408SourcePolicy,
} from './succession408Research.js';

export * from './successionDossierThrough407.js';

const freeze = (value) => Object.freeze(value);
const source408 = 'https://hunterxhunter.fandom.com/wiki/Chapter_408';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession408ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 408),
  ...succession408ChapterResearch,
].sort((left, right) => left.number - right.number));

const asLegacyRelationship = (record) => {
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  return freeze({
    ...record,
    from: record.from || subjectFrom || record.subject || 'Unknown',
    to: record.to || record.target || subjectTo || 'Unknown',
    type: record.type || record.relation || record.relationship || 'documented relationship',
    note: record.note || record.detail || record.boundary || record.evidence || record.status || '',
    phase: record.phase || 'Voyage Chapter 408',
    chapters: record.chapters || '408',
    state: record.state || record.status || 'documented',
    source: record.source || source408,
  });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, record]));
for (const record of succession408RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([
  ...(base.successionMysteries || []).filter((record) => String(record.lastChapter || record.chapter || '') !== '408'),
  ...succession408Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession408ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter408: source408, sourcePolicy408: succession408SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 408 Morena identity / Contagion / Specialist negotiation / martial-law interruption',
    description: 'Chapter 408 continues the Tier 2 recruitment game through Aim, Power / Ability, and No?. It records Morena’s Carnival Orphan identity and anti-Kakin framework, preserves her speaker-bounded Nen claims, fixes the child-card sequence Joker → Yes → X with No and Return remaining, and stops at the Special Martial Law declaration without importing Chapter 409 aftermath.',
    records: freeze([
      freeze({ subject: 'Aim / Morena goals', people: 'Morena, Borksen', notes: 'Morena states that she wants to destroy Kakin and then humanity. Borksen says this is only a fraction of the explanation she needs.', status: 'goal statements confirmed / Borksen does not adopt them', source: source408 }),
      freeze({ subject: 'Current Morena identity', people: 'Morena, Borksen', notes: 'Morena says she is not the original royal Morena Prudo and identifies herself as a Carnival Orphan. The original Morena is said to be buried under the current identity.', status: 'direct Morena disclosure / current birth name unsupplied', source: source408 }),
      freeze({ subject: 'Carne Levare framework', people: 'Morena / Kakin royal system', notes: 'The chapter explains the secret carnival, Entertainer/Other sorting, capital lèse-majesté framework, Carnival Orphan institution, flesh classification, and recurring batches through the ’20 group.', status: 'narrated framework plus speaker-bounded autobiography preserved', source: source408 }),
      freeze({ subject: 'Power / Ability alias', people: 'Morena, Borksen', notes: 'The current synopsis calls the Chapter 407 Power ability-explanation slot Ability.', status: 'same parent-card slot / no eighth card created', source: source408 }),
      freeze({ subject: 'Contagion development model', people: 'Morena, Borksen', notes: 'Morena describes up to twenty-two children, accelerated awakening, eventual parent replication, and individualized ability-development support.', status: 'system explanation confirmed / Borksen remains uninitiated', source: source408 }),
      freeze({ subject: 'Borksen Specialist classification', people: 'Morena, Borksen', notes: 'Morena says an unnamed Enhancer detects Nen categories by smell and identified Borksen as an unawakened Specialist.', status: 'Morena disclosure / unnamed detector deliberately not identified', source: source408 }),
      freeze({ subject: 'Specialist rarity / Floor Master', people: 'Morena, Borksen', notes: 'Morena gives an approximate 1-in-3000 estimate, projects 50–60 more Specialists on a ship this size, and mentions an unnamed Heavens Arena Floor Master encountered by the detector.', status: 'Morena estimate / acknowledged possible inaccuracy / Floor Master unnamed', source: source408 }),
      freeze({ subject: 'Desired Borksen ability', people: 'Morena, Borksen', notes: 'Morena says she has a specific requested Specialist ability/team role but reserves it for Yes?.', status: 'strategic request exists / exact ability withheld', source: source408 }),
      freeze({ subject: 'Child-card state', people: 'Borksen, Morena, Orarge', notes: 'Orarge shuffles; Joker, then Yes, then X are revealed and discarded. No and Return remain.', status: 'sequence confirmed / final answer unresolved', source: source408 }),
      freeze({ subject: 'Anti-cheating inference', people: 'Borksen, Morena, Heil-Ly attendants', notes: 'Borksen reads the group’s disappointment at Yes as limited evidence against expected cheating but immediately notes she may be the first truly unwilling recruit.', status: 'Borksen inference only / no supernatural anti-cheating rule', source: source408 }),
      freeze({ subject: 'No versus X', people: 'Morena, Borksen', notes: 'No is described as irrevocable refusal and outsider status; X voids the game while memory remains and carries an avoidance/non-recruitment promise.', status: 'Morena’s explained consequences confirmed within Chapter 408', source: source408 }),
      freeze({ subject: 'Vows and limitations', people: 'Morena, Borksen', notes: 'Morena says genuine failure and rejection risk increase the return of her support system and team unity.', status: 'qualitative vow/limitation explanation confirmed / no invented multiplier', source: source408 }),
      freeze({ subject: 'Chapter 408 stopping point', people: 'Borksen, Morena', notes: 'Special Martial Law is declared immediately after X is revealed with No and Return still in play.', status: 'declaration confirmed / cause, enforcement and Chapter 409 aftermath unresolved', source: source408 }),
    ]),
  }),
]);

export const chapter408Research = succession408ChapterResearch;
export const relationshipsChapter408Research = succession408RelationshipRecords;
export const negotiationGameChapter408Research = succession408NegotiationGameProgress;
export const carneLevareChapter408Research = succession408CarneLevareFramework;
export const nenChapter408Research = succession408NenFindings;
