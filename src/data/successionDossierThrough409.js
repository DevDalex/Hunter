import * as base from './successionDossierThrough408.js';
import {
  succession409ChapterFocus,
  succession409ChapterResearch,
  succession409HideoutFindings,
  succession409MartialLawOrders,
  succession409Mysteries,
  succession409NegotiationGameProgress,
  succession409NenFindings,
  succession409RelationshipRecords,
  succession409ResolvedQuestions,
  succession409SourcePolicy,
} from './succession409Research.js';

export * from './successionDossierThrough408.js';

const freeze = (value) => Object.freeze(value);
const source409 = 'https://hunterxhunter.fandom.com/wiki/Chapter_409';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession409ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 409),
  ...succession409ChapterResearch,
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
    phase: record.phase || 'Voyage Chapter 409',
    chapters: record.chapters || '409',
    state: record.state || record.status || 'documented',
    source: record.source || source409,
  });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession409RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

const retiredMysteryIds = new Set([
  'chapter408-final-response-after-martial-law',
  'chapter408-desired-borksen-specialist-ability',
  'chapter408-martial-law-cause',
]);
export const successionMysteries = freeze([
  ...(base.successionMysteries || []).filter((record) => !retiredMysteryIds.has(record.id)),
  ...succession409Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession409ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter409: source409, sourcePolicy409: succession409SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 409 Special Martial Law / Deal / inter-tier hideout / intentional Yes',
    description: 'Chapter 409 continues Special Martial Law through tier-specific broadcast orders, advances the Morena/Borksen game through Deal and Question A, confirms the five-entrance Heil-Ly hideout between Tiers 2 and 3 and a twenty-one-member current group, preserves the three-condition Contagion joining boundary, and stops when Borksen deliberately exchanges Return for Yes without importing Chapter 410 consequences.',
    records: freeze([
      freeze({ subject: 'Special Martial Law tier orders', people: 'Borksen, Morena, Heil-Ly attendants, Black Whale passengers', notes: 'The broadcast gives distinct instructions to Tiers 5, 4, 3, 2 and 1. Tier 3 noncompliance is threatened with gunfire.', status: 'martial law active / triggering incident unsupplied in the synopsis', source: source409 }),
      freeze({ subject: 'Borksen military interpretation', people: 'Borksen', notes: 'Borksen understands martial law as giving royal soldiers broad immediate shooting, disarmament and anti-subversion authority.', status: 'Borksen trained interpretation / not separately sourced legal code', source: source409 }),
      freeze({ subject: 'Deal request', people: 'Morena, Borksen', notes: 'Deal can recover a response card from the graveyard after Morena’s small request. Morena’s request is a prolonged mouth-to-mouth kiss connected to her recruitment ability.', status: 'Deal mechanics and completed request confirmed', source: source409 }),
      freeze({ subject: 'Three joining conditions', people: 'Morena, Borksen', notes: 'Morena requires final Yes, infection through her kiss, and Borksen’s presence at a Morena/Heil-Ly murder; all three are required in any order.', status: 'three conditions confirmed / murder-presence condition not shown completed', source: source409 }),
      freeze({ subject: 'Card-integrity check', people: 'Borksen, Morena, Orarge', notes: 'After the kiss, Borksen verifies the untouched cards are No and Return before Orarge shuffles X/No/Return.', status: 'observed card integrity confirmed in this game / no universal Nen anti-cheating rule', source: source409 }),
      freeze({ subject: 'X redraw', people: 'Borksen, Morena, Orarge', notes: 'X is returned under Deal, shuffled with No and Return, and immediately redrawn by Borksen.', status: 'X removed again / final pair becomes No and Return', source: source409 }),
      freeze({ subject: 'Inter-tier hideout', people: 'Borksen, Morena', notes: 'Question A eliminates Tiers 1–5, confirms the base is aboard the Black Whale, and the central-gate rumble leads to confirmation that the hideout is between Tiers 2 and 3.', status: 'inter-tier position confirmed / exact centrality and pre-construction planning remain Borksen inferences', source: source409 }),
      freeze({ subject: 'Five hideout entrances', people: 'Borksen, Morena', notes: 'Morena confirms multiple entrances and ultimately five doors; ordinary accessibility receives a Yes-and-No answer.', status: 'five entrances confirmed / exact topology unresolved', source: source409 }),
      freeze({ subject: 'Heil-Ly headcount and Nen breakdown', people: 'Morena, Borksen', notes: 'Morena confirms twenty-one current members total, says she is the only Specialist, confirms at least one Enhancer, and says she does not know all twenty other abilities.', status: 'organization/Nen answers confirmed / unnamed detector identity still unresolved', source: source409 }),
      freeze({ subject: 'Morena goal refusal', people: 'Borksen, Morena', notes: 'Borksen asks four times whether Morena intends to change her goal and receives No four times.', status: 'ideological divide remains explicit', source: source409 }),
      freeze({ subject: 'Final No / Return reveal', people: 'Borksen, Morena, Orarge', notes: 'Orarge shuffles the final pair. Morena receives No and Borksen retains Return after a simultaneous reveal.', status: 'Return won by Borksen', source: source409 }),
      freeze({ subject: 'Intentional Yes stopping point', people: 'Borksen, Morena', notes: 'Borksen exchanges Return for Yes and confirms the choice is not a mistake.', status: 'Yes intentionally selected / motive, full joining, awakening and Chapter 410 consequences unresolved', source: source409 }),
    ]),
  }),
]);

export const chapter409Research = succession409ChapterResearch;
export const relationshipsChapter409Research = succession409RelationshipRecords;
export const negotiationGameChapter409Research = succession409NegotiationGameProgress;
export const martialLawChapter409Research = succession409MartialLawOrders;
export const hideoutChapter409Research = succession409HideoutFindings;
export const nenChapter409Research = succession409NenFindings;
