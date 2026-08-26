import * as base from './successionDossierBoundary403.js';
import {
  succession404ChapterResearch,
  succession404Mysteries,
  succession404RelationshipRecords,
  succession404ResolvedQuestions,
  succession404SourcePolicy,
} from './succession404Research.js';

export * from './successionDossierBoundary403.js';

const freeze = (value) => Object.freeze(value);
const source404 = 'https://hunterxhunter.fandom.com/wiki/Chapter_404';

const grimmel404 = freeze({
  ability: 'The Boy Who Shoots the Arrow: Grimmel the Dissonance · Chapter 404 topology update',
  user: 'Halkenburg', owner: 'Halkenburg',
  type: 'Collective forced mind swap · formal Nen category unresolved',
  category: 'Random contributor/victim exchange with one-awake body-death priority',
  chapters: '382, 386, 389, 403, 404', chapter: 404,
  conditions: 'A person struck by the collective arrow swaps minds with one randomly selected contributing participant. Only one exchanged mind is normally awake. Halkenburg-side priority generally applies while both bodies remain; the Vict case shows victim priority after the Halkenburg-side original body dies.',
  mechanics: 'Shikaku/Sumidori and Vict establish two body-death priority cases. Halkenburg expects Balsamilco’s mind to return to its own body with wake priority after Halkenburg’s original-body death and plans to delay it using ordinary sleep. Immediate post-death Halkenburg control is shown; Balsamilco waking and the full estimated ten-hour window are not.',
  knownAtChapterBoundary: 'Halkenburg’s original body is dead. His consciousness remains immediately active inside Balsamilco’s living body. Balsamilco is not shown awake or in control.',
  target: 'The arrow-struck victim and one randomly selected contributor.',
  confidence: 'Core forced-swap and demonstrated priority cases confirmed / formal category, universal edge cases, and final control duration unresolved.',
  source: source404,
});

const zhangLeiCoins404 = freeze({
  ability: 'Zhang Lei Guardian Coins · Chapter 404 holder-transfer update',
  user: 'Zhang Lei Guardian Spirit Beast', owner: 'Zhang Lei Guardian Spirit Beast',
  type: 'Guardian Spirit Beast coin-production system',
  category: 'Persistent numbered coins with holder-linked visible state',
  chapters: '362, 376, 389, 390, 402, 403, 404', chapter: 404,
  conditions: 'Tenftory’s distributed coin has a different reverse from Zhang Lei’s retained coins. A 10 coin transferred to Kurapika becomes 1 and adopts the distributed-holder reverse within seconds. Returned to Zhang Lei, its reverse resets but its number remains 1.',
  mechanics: 'Holder-linked visible transformation is directly observed. Kurapika’s cumulative Conjuration, stored Nen, future holder powers, aura-node opening, six-month/one-quintillion growth, 10^64 threshold, and pseudo-coercive loyalty models remain hypotheses.',
  knownAtChapterBoundary: 'Zhang Lei gives Kurapika the day’s new coin, but no effect is shown. Coventoba does not produce the suspected first-day coin. No complete ownership, reset, multiplier, spending, or activation rule is known.',
  target: 'Coin holders; eventual effect unresolved.',
  confidence: 'Holder-linked design and 10→1/return-stays-1 observations confirmed / category, threshold, loyalty, and final effect unresolved.',
  source: source404,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !/Grimmel the Dissonance · Chapter 40[34]|Zhang Lei Guardian Coins · Chapter 40[34]/.test(record.ability || '')),
  grimmel404,
  zhangLeiCoins404,
]);

const asLegacyRelationship = (record) => {
  if (record.from && record.to && record.chapters) return record;

  const [subjectFrom = '', subjectTo = ''] = String(record.subject || '')
    .split(/\s*(?:↔|→)\s*/, 2);
  const source = record.sourceUrl
    || (/^https?:\/\//.test(String(record.source || '')) ? record.source : source404);
  const chapter = String(record.chapter || String(source).match(/Chapter_(\d+)/)?.[1] || '404');
  const people = Array.isArray(record.people) ? record.people : [];

  return freeze({
    ...record,
    from: record.from || (record.sourceUrl ? record.source : '') || people[0] || subjectFrom || record.subject || 'Unknown',
    to: record.to || record.target || people.slice(1).join(' / ') || subjectTo || 'Unknown',
    type: record.type || record.relation || record.relationship || 'documented relationship',
    note: record.note || record.detail || record.boundary || record.evidence || record.status || '',
    phase: record.phase || `Voyage Chapter ${chapter}`,
    chapters: record.chapters || chapter,
    state: record.state || record.status || 'documented',
    source,
  });
};

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession404RelationshipRecords,
].map(asLegacyRelationship));

const asLegacyBodyState = (record) => {
  if (record.examples && record.rule && record.className) return record;

  const subject = record.subject || record.character || record.body || 'Unidentified subject';
  const state = String(record.state || record.bodyState || 'exceptional body state');
  const className = /\b(?:dead|deceased)\b/i.test(state) ? 'deceased'
    : /\b(?:unknown|unresolved)\b/i.test(state) ? 'unknown'
      : 'exceptional';

  return freeze({
    ...record,
    state: `${subject} — ${state}`,
    examples: subject,
    rule: record.detail || record.consciousness || record.cause || record.bodyState || state,
    className,
  });
};

export const bodyStateLedger = freeze((base.bodyStateLedger || []).map(asLegacyBodyState));
export const successionMysteries = freeze([...(base.successionMysteries || []), ...succession404Mysteries]);
export const successionResolvedQuestions = freeze([...(base.successionResolvedQuestions || []), ...succession404ResolvedQuestions]);

export const dossierSources = freeze({ ...base.dossierSources, chapter404: source404, sourcePolicy404: succession404SourcePolicy });

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 404 coin transfer / mind-swap topology / original-body death / Thursday preparation',
    description: 'Chapter 404 confirms the Guardian Coin’s holder-linked visible transformation, explains core Grimmel swap/priority rules, kills Halkenburg’s original body while preserving immediate Balsamilco-body control, and schedules the second class and funeral without beginning either.',
    records: freeze([
      freeze({ subject: 'Guardian Coin holder test', people: 'Zhang Lei, Kurapika, Tenftory, Coventoba', notes: 'A transferred 10 coin becomes 1 and changes reverse; returned, its reverse resets while its number stays 1.', status: 'visible transformation confirmed / complete rule unresolved', source: source404 }),
      freeze({ subject: 'Coin theories', people: 'Kurapika, Zhang Lei', notes: 'Cumulative Conjuration, long-term power growth, aura-node opening, 10^64, and loyalty are analytical possibilities.', status: 'hypotheses only', source: source404 }),
      freeze({ subject: 'Medical control', people: 'Cheadle, Leorio, Halkenburg, Benjamin', notes: 'Cheadle orders tests and forensics before royal/military teams displace her staff.', status: 'takeover confirmed / results and exact TSK-17 delivery unsupplied', source: source404 }),
      freeze({ subject: 'Grimmel topology', people: 'Halkenburg, Balsamilco, Shikaku, Sumidori, Vict', notes: 'Random contributor selection, forced swap, one-awake priority, and two body-death cases are explained.', status: 'core topology confirmed / formal category and universal cases unresolved', source: source404 }),
      freeze({ subject: 'Halkenburg body-state split', people: 'Halkenburg, Balsamilco', notes: 'The original Halkenburg body dies early Thursday while Halkenburg remains immediately active in Balsamilco’s living body.', status: 'original body dead / Balsamilco not shown awake / ten-hour estimate unfinished', source: source404 }),
      freeze({ subject: 'Tserriednich training', people: 'Tserriednich, Salkov', notes: 'The timer falls below 3.5 seconds and Tserriednich forms a large aura sphere.', status: 'below 3.5 confirmed / no precise value or new Parallel Future use', source: source404 }),
      freeze({ subject: 'Fugetsu and Kacho-form', people: 'Fugetsu, Kacho-form', notes: 'Fugetsu is weak and asleep while Kacho-form begins fading.', status: 'fading observed / cause and endpoint unresolved', source: source404 }),
      freeze({ subject: 'Second Nen class', people: 'Kurapika, Bill, Shimano, Babimyna, Sarahell', notes: 'Thursday 9:00 a.m. attendance is scheduled and Room 1014 prepares around Sarahell.', status: 'scheduled only / Sarahell has not entered or acted', source: source404 }),
      freeze({ subject: 'Funeral operation', people: 'Benjamin, Halkenburg-in-Balsamilco, Cleapatro, Halkenburg guards', notes: 'A noon route and guard release are authorized and announced.', status: 'authorized/announced / procession not begun', source: source404 }),
      freeze({ subject: 'Troupe pre-raid decision', people: 'Nobunaga, Phinks, Feitan', notes: 'Nobunaga wants established-mafia intelligence before the Heil-Ly attack.', status: 'contact planned / no meeting or raid', source: source404 }),
    ]),
  }),
]);

export const chapter404Research = succession404ChapterResearch;
export const relationshipsChapter404Research = succession404RelationshipRecords;
