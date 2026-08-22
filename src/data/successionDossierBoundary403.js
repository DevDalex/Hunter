import * as base from './successionDossierThrough402.js';
import {
  succession403ChapterResearch,
  succession403Mysteries,
  succession403RelationshipRecords,
  succession403ResolvedQuestions,
  succession403SourcePolicy,
} from './succession403Research.js';

export * from './successionDossierThrough402.js';

const freeze = (value) => Object.freeze(value);
const source403 = 'https://hunterxhunter.fandom.com/wiki/Chapter_403';

const grimmel403 = freeze({
  ability: 'The Boy Who Shoots the Arrow: Grimmel the Dissonance · Chapter 403 update',
  user: 'Halkenburg',
  owner: 'Halkenburg',
  type: 'Collective Nen body/consciousness-transfer attack · formal Nen category unresolved',
  category: 'Collective aura bow / possession transfer',
  chapters: '382, 386, 389, 403',
  chapter: 403,
  conditions: 'Halkenburg is shown with twelve civilian supporters generating the collective rumbling. A hidden distance signal helps him aim through a wall at Balsamilco. The shot succeeds and Halkenburg’s consciousness is later directly revealed inside Balsamilco’s body.',
  mechanics: 'The chapter confirms successful consciousness transfer into Balsamilco and that civilian loyalists can participate. It does not establish twelve as the universal minimum, a maximum range, the exact material-barrier rule, Balsamilco’s displaced-consciousness location, or a formal Manipulation classification.',
  knownAtChapterBoundary: 'Halkenburg controls Balsamilco’s living body while Halkenburg’s original body remains alive and unconscious in medical care. Chapter 404+ original-body death/funeral consequences are quarantined.',
  target: 'Balsamilco in the demonstrated Chapter 403 operation.',
  confidence: 'Official name and successful Balsamilco transfer confirmed / complete topology and classification unresolved.',
  source: source403,
});

const zhangLeiCoins403 = freeze({
  ability: 'Zhang Lei Guardian Coins · Chapter 403 progression update',
  user: 'Zhang Lei Guardian Spirit Beast',
  owner: 'Zhang Lei Guardian Spirit Beast',
  type: 'Guardian Spirit Beast coin-production system',
  category: 'Numbered persistent coins / eventual holder effect unresolved',
  chapters: '362, 376, 389, 390, 402, 403',
  chapter: 403,
  conditions: 'Zhang Lei accounts for ten produced coins after ten days: seven retained and three distributed. Among the seven on the table, six display 1 and one displays 10. He begins production-date tracking and orders follow-up on distributed coins.',
  mechanics: 'The 1→10 change is directly observed. The ten-day aging model, holder-growth model, monetary-value interpretation, exponential progression, and final activation rule are all hypotheses.',
  knownAtChapterBoundary: 'No Kurapika test result is imported. Chapter 403 ends when Kurapika and Oito arrive in Room 1003.',
  target: 'Coin holders; complete holder effect unresolved.',
  confidence: 'Ten total coins accounted for and 1→10 change confirmed / progression cause and final ability unresolved.',
  source: source403,
});

export const successionAbilities = freeze([
  ...base.successionAbilities.filter((record) => !/Grimmel the Dissonance · Chapter 403|Zhang Lei Guardian Coins · Chapter 403 progression update/.test(record.ability || '')),
  grimmel403,
  zhangLeiCoins403,
]);

export const successionRelationships = freeze([
  ...(base.successionRelationships || []),
  ...succession403RelationshipRecords,
]);

export const successionMysteries = freeze([
  ...(base.successionMysteries || []),
  ...succession403Mysteries,
]);

export const successionResolvedQuestions = freeze([
  ...(base.successionResolvedQuestions || []),
  ...succession403ResolvedQuestions,
]);

export const dossierSources = freeze({
  ...base.dossierSources,
  chapter403: source403,
  sourcePolicy403: succession403SourcePolicy,
});

export const guardAssignmentGroups = freeze([
  ...base.guardAssignmentGroups,
  freeze({
    group: 'Chapter 403 Halkenburg possession / red alert / coin progression / Justice intelligence',
    description: 'Chapter 403 resolves the immediate Balsamilco-arrow question in Halkenburg’s favor, confirms Unma’s maternity, escalates Benjamin to red alert without activating Special Martial Law, advances the Fugetsu and letter operations, and opens a new Zhang Lei coin experiment while keeping later death, funeral, coin-test, and Luzurus outcomes outside the boundary.',
    records: freeze([
      freeze({ subject: 'Balsamilco courthouse operation', people: 'Balsamilco, Halkenburg, Vict', notes: 'Balsamilco enters Justice intending to use TSK-17 but is struck first by Halkenburg’s collective operation.', status: 'Balsamilco attack interrupted / Halkenburg arrow succeeds', source: source403 }),
      freeze({ subject: 'Halkenburg possession', people: 'Halkenburg, Balsamilco', notes: 'Halkenburg’s consciousness is directly revealed inside Balsamilco’s living body while the original Halkenburg body lies unconscious.', status: 'possession confirmed / Balsamilco consciousness unresolved', source: source403 }),
      freeze({ subject: 'Benjamin red alert', people: 'Benjamin, Butch, Balsamilco', notes: 'Benjamin orders Tiers 2 and 3 onto red alert and defines unauthorized Balsamilco movement as a martial-law trigger.', status: 'red alert active / Special Martial Law inactive', source: source403 }),
      freeze({ subject: 'Unma maternity', people: 'Unma, Halkenburg, Duazul', notes: 'Unma directly calls Halkenburg her son.', status: 'biological maternity confirmed / transfer motive remains rumor', source: source403 }),
      freeze({ subject: 'Fugetsu protection', people: 'Fugetsu, Kacho-form, Melody, Kaiser, Basho', notes: 'Fugetsu sleeps while Basho’s aid is reported to keep hostile spirits away; the Luzurus operation is scheduled for the following night.', status: 'temporary suppression reported / Luzurus guilt unresolved / operation not executed', source: source403 }),
      freeze({ subject: 'Zhang Lei coin progression', people: 'Zhang Lei, guards, Kurapika', notes: 'Seven retained plus three distributed coins are accounted for; one retained coin displays 10 while six display 1.', status: '1→10 observation confirmed / ten-day and holder theories unresolved', source: source403 }),
      freeze({ subject: 'Worio contingency', people: 'Worio Bay, Kaiser, Halkenburg', notes: 'Worio shows a Halkenburg-linked feather mark, reveals prearranged disclosure instructions, and says Halkenburg will die soon.', status: 'warning confirmed / future death not yet fulfilled', source: source403 }),
      freeze({ subject: 'Kurapika public-letter strategy', people: 'Kurapika, Oito, Woble', notes: 'Oito permits publication of the letter addressed to her during the next Nen class as part of Kurapika’s diplomatic bargaining plan.', status: 'strategy authorized / letter contents and responses unresolved', source: source403 }),
    ]),
  }),
]);

export const chapter403Research = succession403ChapterResearch;
export const relationshipsChapter403Research = succession403RelationshipRecords;
