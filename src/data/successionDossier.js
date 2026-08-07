import * as legacy from './successionDossierLegacy.js';
import {
  succession340ChapterFocus,
  succession340ChapterResearch,
  succession340Mysteries,
  succession340SourcePolicy,
} from './succession340Research.js';
import {
  succession341ChapterFocus,
  succession341ChapterResearch,
  succession341Mysteries,
  succession341SourcePolicy,
} from './succession341Research.js';
import {
  succession342ChapterFocus,
  succession342ChapterResearch,
  succession342Mysteries,
  succession342SourcePolicy,
} from './succession342Research.js';
import {
  succession343AbilityRecords,
  succession343ChapterFocus,
  succession343ChapterResearch,
  succession343Mysteries,
  succession343RelationshipRecords,
  succession343SourcePolicy,
} from './succession343Research.js';
import {
  succession344BodyStates,
  succession344ChapterFocus,
  succession344ChapterResearch,
  succession344Mysteries,
  succession344ObjectRecords,
  succession344RelationshipRecords,
  succession344SourcePolicy,
} from './succession344Research.js';
import {
  succession345BodyStates,
  succession345ChapterFocus,
  succession345ChapterResearch,
  succession345Mysteries,
  succession345ObjectRecords,
  succession345RelationshipRecords,
  succession345SourcePolicy,
} from './succession345Research.js';
import {
  succession400ChapterFocus,
  succession400ChapterResearch,
  succession400Mysteries,
  succession400SourcePolicy,
} from './succession400Research.js';
import {
  succession406ChapterFocus,
  succession406ChapterResearch,
  succession406Mysteries,
  succession406SourcePolicy,
} from './succession406Research.js';
import {
  succession408ChapterFocus,
  succession408ChapterResearch,
  succession408Mysteries,
  succession408SourcePolicy,
} from './succession408Research.js';
import {
  succession409ChapterFocus,
  succession409ChapterResearch,
  succession409Mysteries,
  succession409SourcePolicy,
} from './succession409Research.js';
import {
  succession410ChapterFocus,
  succession410ChapterResearch,
  succession410Mysteries,
  succession410SourcePolicy,
} from './succession410Research.js';
import {
  patchSuccessionPrinceDossier,
  patchSuccessionQueenDossier,
  succession414415AbilityRecords,
  succession414415BodyStates,
  succession414415ChapterFocus,
  succession414415ChapterResearch,
  succession414415CrossChecks,
  succession414415Mysteries,
  succession414415RelationshipRecords,
} from './succession414415Research.js';
import {
  patchSuccession416PrinceDossier,
  succession416ChapterFocus,
  succession416ChapterResearch,
  succession416Mysteries,
  succession416SourcePolicy,
} from './succession416Research.js';

export * from './successionDossierLegacy.js';

export const chapterFocus = Object.freeze({
  ...legacy.chapterFocus,
  ...succession340ChapterFocus,
  ...succession341ChapterFocus,
  ...succession342ChapterFocus,
  ...succession343ChapterFocus,
  ...succession344ChapterFocus,
  ...succession345ChapterFocus,
  ...succession400ChapterFocus,
  ...succession406ChapterFocus,
  ...succession408ChapterFocus,
  ...succession409ChapterFocus,
  ...succession410ChapterFocus,
  ...succession414415ChapterFocus,
  ...succession416ChapterFocus,
});

export const successionChapterResearch = Object.freeze([
  ...legacy.successionChapterResearch.filter((record) => ![340, 341, 342, 343, 344, 345, 400, 406, 408, 409, 410].includes(record.number)),
  ...succession340ChapterResearch,
  ...succession341ChapterResearch,
  ...succession342ChapterResearch,
  ...succession343ChapterResearch,
  ...succession344ChapterResearch,
  ...succession345ChapterResearch,
  ...succession400ChapterResearch,
  ...succession406ChapterResearch,
  ...succession408ChapterResearch,
  ...succession409ChapterResearch,
  ...succession410ChapterResearch,
  ...succession414415ChapterResearch,
  ...succession416ChapterResearch,
].sort((left, right) => left.number - right.number));

export const princeDossiers = Object.freeze(
  legacy.princeDossiers
    .map(patchSuccessionPrinceDossier)
    .map(patchSuccession416PrinceDossier),
);
export const queenDossiers = Object.freeze(legacy.queenDossiers.map(patchSuccessionQueenDossier));

export const successionAbilities = Object.freeze([
  ...legacy.successionAbilities,
  ...succession343AbilityRecords,
  ...succession414415AbilityRecords,
]);

export const successionRelationships = Object.freeze([
  ...legacy.successionRelationships,
  ...succession343RelationshipRecords,
  ...succession344RelationshipRecords,
  ...succession345RelationshipRecords,
  ...succession414415RelationshipRecords,
]);

export const bodyStateLedger = Object.freeze([
  ...legacy.bodyStateLedger,
  ...succession344BodyStates,
  ...succession345BodyStates,
  ...succession414415BodyStates,
]);

export const successionObjects = Object.freeze([
  ...legacy.successionObjects,
  ...succession344ObjectRecords,
  ...succession345ObjectRecords,
]);

export const successionMysteries = Object.freeze([
  ...legacy.successionMysteries.filter((record) => record.question !== 'Martial-law outcome'),
  {
    question: 'Martial-law outcome',
    evidence: 'Chapter 416 shows Special Martial Law being enforced across the ship as Benjamin personally assaults Camilla’s residence and Room 1004, orders Danjin taken for questioning, and shoots Tserriednich.',
    status: 'developing',
    lastChapter: '416',
    source: 'https://hunterxhunter.fandom.com/wiki/Chapter_416',
  },
  ...succession340Mysteries,
  ...succession341Mysteries,
  ...succession342Mysteries,
  ...succession343Mysteries,
  ...succession344Mysteries,
  ...succession345Mysteries,
  ...succession400Mysteries,
  ...succession406Mysteries,
  ...succession408Mysteries,
  ...succession409Mysteries,
  ...succession410Mysteries,
  ...succession414415Mysteries,
  ...succession416Mysteries,
]);

export const nenLessonPhases = Object.freeze(legacy.nenLessonPhases.map((phase) => (
  phase.phase.startsWith('Round 2')
    ? Object.freeze({
      ...phase,
      chapters: '411–415',
      summary: 'The split curriculum continues while Furykov’s curse analysis, the actual-Woble crisis, and special martial law transform Room 1014 into a confined command and recovery center.',
      incidents: Object.freeze([
        ...(phase.incidents || []),
        'Actual Woble separated from substitute infant',
        'Coded outside-contact contingency',
        'Furykov curse analysis',
        'Oito conditionally confined',
      ]),
      source: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
    })
    : phase
)));

export const guardAssignmentGroups = Object.freeze(legacy.guardAssignmentGroups.map((group) => {
  if (group.group !== 'State, servants, and temporary custody') return group;
  return Object.freeze({
    ...group,
    records: Object.freeze([
      ...group.records,
      {
        subject: 'Special-martial-law royal controls',
        people: 'Tubeppa, Oito, Luzurus, Marayam household, Benjamin military personnel',
        notes: 'Chapter 415 distinguishes relocation orders, private-guard restrictions, missing status, isolated-space resistance, and conditional in-room confinement.',
        status: 'active',
        source: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
      },
    ]),
  });
}));

export const dossierSources = Object.freeze({
  ...legacy.dossierSources,
  chapter340: 'https://hunterxhunter.fandom.com/wiki/Chapter_340',
  chapter341: 'https://hunterxhunter.fandom.com/wiki/Chapter_341',
  chapter342: 'https://hunterxhunter.fandom.com/wiki/Chapter_342',
  chapter343: 'https://hunterxhunter.fandom.com/wiki/Chapter_343',
  chapter344: 'https://hunterxhunter.fandom.com/wiki/Chapter_344',
  chapter345: 'https://hunterxhunter.fandom.com/wiki/Chapter_345',
  chapter400: 'https://hunterxhunter.fandom.com/wiki/Chapter_400',
  chapter406: 'https://hunterxhunter.fandom.com/wiki/Chapter_406',
  chapter408: 'https://hunterxhunter.fandom.com/wiki/Chapter_408',
  chapter409: 'https://hunterxhunter.fandom.com/wiki/Chapter_409',
  chapter410: 'https://hunterxhunter.fandom.com/wiki/Chapter_410',
  chapter414: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
  chapter415: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
  chapter416: 'https://hunterxhunter.fandom.com/wiki/Chapter_416',
  viz414: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  viz415: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  sourcePolicy340: succession340SourcePolicy,
  sourcePolicy341: succession341SourcePolicy,
  sourcePolicy342: succession342SourcePolicy,
  sourcePolicy343: succession343SourcePolicy,
  sourcePolicy344: succession344SourcePolicy,
  sourcePolicy345: succession345SourcePolicy,
  sourcePolicy400: succession400SourcePolicy,
  sourcePolicy406: succession406SourcePolicy,
  sourcePolicy408: succession408SourcePolicy,
  sourcePolicy409: succession409SourcePolicy,
  sourcePolicy410: succession410SourcePolicy,
  crossChecks414415: succession414415CrossChecks,
  sourcePolicy416: succession416SourcePolicy,
});
