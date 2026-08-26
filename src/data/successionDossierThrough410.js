import * as base from './successionDossierThrough409.js';
import {
  succession410BenjaminEmergencyPlan,
  succession410CaseSFindings,
  succession410ChapterFocus,
  succession410ChapterResearch,
  succession410Mysteries,
  succession410NegotiationOutcome,
  succession410NenFindings,
  succession410RelationshipRecords,
  succession410ResolvedQuestions,
  succession410SourcePolicy,
} from './succession410Research.js';

export * from './successionDossierThrough409.js';

const freeze = (value) => Object.freeze(value);
const source410 = 'https://hunterxhunter.fandom.com/wiki/Chapter_410';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession410ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 410),
  ...succession410ChapterResearch,
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
    phase: record.phase || 'Voyage Chapter 410',
    chapters: record.chapters || '410',
    state: record.state || record.status || 'documented',
    source: record.source || source410,
  });
};

const relationshipMap = new Map((base.successionRelationships || []).map((record) => [record.id || `${record.from}:${record.to}:${record.chapters}`, asLegacyRelationship(record)]));
for (const record of succession410RelationshipRecords) relationshipMap.set(record.id, asLegacyRelationship(record));
export const successionRelationships = freeze([...relationshipMap.values()].map(asLegacyRelationship));

export const successionMysteries = freeze([
  ...(base.successionMysteries || []).filter((record) => String(record.lastChapter || '') !== '410'),
  ...succession410Mysteries,
]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession410ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter410: source410, sourcePolicy410: succession410SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 410 forced Yes / Level 0 / Room 3101 Case S / Benjamin martial-law consolidation',
    description: 'Chapter 410 resolves the negotiation-game anti-cheating Manipulation, preserves Borksen’s compelled Yes and Level 0 boundary, advances Contagion installed-game knowledge, records Room 3101 as a supernatural Case S under the supplied volume correction, and tracks Benjamin’s disease-clock-driven Justice Bureau power grab without promoting allegations or character inferences into narrator facts.',
    records: freeze([
      freeze({ subject: 'Forced Yes confirmation', people: 'Borksen, Morena', notes: 'Borksen outwardly confirms Yes while internally resisting. Morena says Borksen’s marked Return cheat triggered automatic Manipulation restricting her to Yes or No.', status: 'Yes confirmation compelled / ideological conversion not established', source: source410 }),
      freeze({ subject: 'Marked Return reconstruction', people: 'Morena, Borksen, Orarge', notes: 'Morena says Borksen created tiny front-side indentations on Return while checking the untouched cards and later crushed Return to remove evidence.', status: 'Morena reconstruction / anti-cheating trigger explanation', source: source410 }),
      freeze({ subject: 'Installed-game telemetry', people: 'Morena, Borksen', notes: 'Morena confirms tracking of Borksen’s level, points, location and status and gives three termination routes.', status: 'four telemetry fields confirmed / audiovisual spyware remains Borksen assumption', source: source410 }),
      freeze({ subject: 'Borksen Level 0', people: 'Morena, Borksen', notes: 'Borksen is accepted on Heil-Ly’s side but remains Level 0 because the murder-presence condition is incomplete. Formal Level 1 follows after witnessing a Heil-Ly murder.', status: 'Level 0 confirmed / Level 1 not reached', source: source410 }),
      freeze({ subject: 'Borksen counter-planning', people: 'Borksen', notes: 'Borksen recognizes a replacement time limit, assumes hostile surveillance, decides she needs power, says she will return to her original people and requests a Heil-Ly tour first.', status: 'underlying resistance active / exact strategy unresolved', source: source410 }),
      freeze({ subject: 'Tier 3 Case S', people: 'Tier 3 military personnel', notes: 'Room 3101 is sealed after three soldiers vanish immediately upon entry and is classified as a textbook supernatural incident.', status: 'Case S confirmed / ability and user unresolved', source: source410 }),
      freeze({ subject: 'Room-number correction', people: 'Tier 3 military personnel', notes: 'The supplied note says the original Room 125 reference is corrected in the volume release to Room 3101.', status: 'Room 3101 canonical / Room 125 not retained as separate Chapter 410 route', source: source410 }),
      freeze({ subject: 'Zhang Lei / Luzurus search', people: 'Benjamin, Zhang Lei, Luzurus, Onior', notes: 'Zhang Lei is reported crossing toward Tier 2 through Onior’s residence and is actively tracked; Luzurus remains unaccounted for.', status: 'cross-bridge report confirmed / destinations unresolved', source: source410 }),
      freeze({ subject: 'Benjamin disease clock', people: 'Benjamin', notes: 'Benjamin internally estimates roughly 9.5 usable hours before expected incapacitation and plans to secure succession rights before then.', status: 'Benjamin internal calculation / future medical outcome unresolved', source: source410 }),
      freeze({ subject: 'Three-branch consolidation', people: 'Benjamin, Mizaistom, Botobai, Kaiser', notes: 'Benjamin announces military consolidation of all three branches and intends to use the Justice Bureau as joint command.', status: 'takeover announced / acceptance and legal completion not established', source: source410 }),
      freeze({ subject: 'Biological-terrorism basis', people: 'Benjamin, Tserriednich, Halkenburg, Mizaistom', notes: 'Benjamin alleges biological terrorism by Tserriednich and Halkenburg; Mizaistom privately judges much of the case to be conveniently twisted half-truths.', status: 'Benjamin allegation / Mizaistom analysis / not independently proven', source: source410 }),
      freeze({ subject: 'Royal authorization', people: 'Benjamin, Nasubi', notes: 'Benjamin says Nasubi’s authorization letter is still being written and can be retrieved after signature and seal.', status: 'written authorization not yet produced', source: source410 }),
      freeze({ subject: 'Benjamin pallor / Kaiser inference', people: 'Benjamin, Botobai, Kaiser', notes: 'Botobai observes Benjamin looks pale. Kaiser suspects infection, estimates at most twenty-four hours, and thinks of an unidentified final stronghold.', status: 'pallor observed / infection estimate inferred / final stronghold unidentified', source: source410 }),
      freeze({ subject: 'Chapter 410 stopping point', people: 'Benjamin, Mizaistom, Botobai, Kaiser', notes: 'Forty minutes have elapsed since Special Martial Law.', status: 'strict endpoint / Chapter 411+ quarantined', source: source410 }),
    ]),
  }),
]);

export const chapter410Research = succession410ChapterResearch;
export const relationshipsChapter410Research = succession410RelationshipRecords;
export const negotiationOutcomeChapter410Research = succession410NegotiationOutcome;
export const nenChapter410Research = succession410NenFindings;
export const caseSChapter410Research = succession410CaseSFindings;
export const benjaminEmergencyChapter410Research = succession410BenjaminEmergencyPlan;
