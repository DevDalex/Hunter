import * as base from './successionDossierThrough406.js';
import {
  succession407ChapterFocus,
  succession407ChapterResearch,
  succession407Mysteries,
  succession407NegotiationGame,
  succession407RelationshipRecords,
  succession407ResolvedQuestions,
  succession407SourcePolicy,
} from './succession407Research.js';

export * from './successionDossierThrough406.js';

const freeze = (value) => Object.freeze(value);
const source407 = 'https://hunterxhunter.fandom.com/wiki/Chapter_407';

export const chapterFocus = freeze({ ...base.chapterFocus, ...succession407ChapterFocus });
export const successionChapterResearch = freeze([
  ...(base.successionChapterResearch || []).filter((record) => record.number !== 407),
  ...succession407ChapterResearch,
].sort((left, right) => left.number - right.number));

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.chapters) return record;
  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '').split(/\s*(?:↔|→)\s*/, 2);
  return freeze({
    ...record,
    from: record.from || subjectFrom || record.subject || 'Unknown',
    to: record.to || record.target || subjectTo || 'Unknown',
    type: record.type || record.relation || record.relationship || 'documented relationship',
    note: record.note || record.detail || record.boundary || record.evidence || record.status || '',
    phase: record.phase || 'Voyage Chapter 407',
    chapters: record.chapters || '407',
    state: record.state || record.status || 'documented',
    source: record.source || source407,
  });
};

export const successionRelationships = freeze([...(base.successionRelationships || []), ...succession407RelationshipRecords].map(asLegacyRelationship));
export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession407Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession407ResolvedQuestions]);
export const dossierSources = freeze({ ...base.dossierSources, chapter407: source407, sourcePolicy407: succession407SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 407 Borksen disappearance / Heil-Ly negotiation setup',
    description: 'Chapter 407 fixes the Tier 3 missing-person scene at 1:00 p.m., keeps every proposed capture method and motive hypothetical, confirms Borksen awake and disarmed in the Tier 2 Heil-Ly hideout without resolving the capture mechanism, and records the complete negotiation-game setup through Morena accepting Borksen’s card-selection condition and announcing that play begins.',
    records: freeze([
      freeze({ subject: 'Tier 3 missing-person alert', people: 'Borksen, Otocin, Momolly, Tserriednich soldier friends', notes: 'Borksen has been silent for roughly thirty minutes after the procession passed her; the group regards abduction as the worst case.', status: 'disappearance confirmed / abduction mechanism unknown to friends', source: source407 }),
      freeze({ subject: 'Capture-method hypotheses', people: 'Tserriednich soldier friends', notes: 'Crowd concealment, immobilizing drug, a familiar-person hospital lure, and hypnosis-like Nen are discussed.', status: 'hypotheses only / none confirmed', source: source407 }),
      freeze({ subject: 'Heil-Ly assassination hypothesis', people: 'Otocin, Borksen, Tserriednich', notes: 'Otocin considers whether Heil-Ly could use Borksen in an assassination attempt on Tserriednich.', status: 'Otocin speculation / not a confirmed Heil-Ly objective', source: source407 }),
      freeze({ subject: 'Borksen captivity state', people: 'Borksen, Morena', notes: 'Borksen wakes in the Tier 2 Heil-Ly hideout, unrestrained but disarmed, with six enemies around her and no memory of how she arrived.', status: 'location/captivity confirmed / capture user, route and ability unresolved', source: source407 }),
      freeze({ subject: 'Morena recruitment', people: 'Morena, Borksen', notes: 'Morena wants Borksen as an ally and uses a compatible-donor analogy while reserving the substantive reason for the game.', status: 'recruitment intent confirmed / specific purpose unresolved', source: source407 }),
      freeze({ subject: 'Child response cards', people: 'Borksen, Morena', notes: 'Yes, No, Return, Joker, and X are explained; X can end the process without a yes/no answer and carries a promise of no forced renegotiation.', status: 'card set and stated mechanics confirmed at Chapter 407 boundary', source: source407 }),
      freeze({ subject: 'Parent question cards', people: 'Morena, Borksen', notes: 'Aim, Power, Question A, Question B, Yes?, No?, and Deal are explained by scope without importing the future substantive answers.', status: 'card scopes confirmed / future answers unresolved', source: source407 }),
      freeze({ subject: 'No-cheating statement', people: 'Morena, Borksen, Voconte, Gelato, Yokotani', notes: 'Morena promises from her own perspective not to cheat after clarifying negative-question answer conventions; Borksen becomes confident in the promise.', status: 'promise and Borksen confidence confirmed / no invented Nen enforcement', source: source407 }),
      freeze({ subject: 'Borksen participation condition', people: 'Borksen, Morena', notes: 'Borksen agrees to play only if she decides which face-down child card is selected. Morena accepts and retains Heil-Ly control of shuffling.', status: 'condition accepted / game ready to begin', source: source407 }),
      freeze({ subject: 'Chapter 407 stopping point', people: 'Borksen, Morena', notes: 'Morena announces that the game begins.', status: 'no card selected before Chapter 408 / outcome unresolved', source: source407 }),
    ]),
  }),
]);

export const chapter407Research = succession407ChapterResearch;
export const relationshipsChapter407Research = succession407RelationshipRecords;
export const negotiationGameChapter407Research = succession407NegotiationGame;
