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
  succession346AbilityRecords,
  succession346ChapterFocus,
  succession346ChapterResearch,
  succession346Mysteries,
  succession346RelationshipRecords,
  succession346SourcePolicy,
} from './succession346Research.js';
import {
  succession347AbilityRecords,
  succession347ChapterFocus,
  succession347ChapterResearch,
  succession347Mysteries,
  succession347ObjectRecords,
  succession347RelationshipRecords,
  succession347SourcePolicy,
} from './succession347Research.js';
import {
  succession348ChapterFocus,
  succession348ChapterResearch,
  succession348Mysteries,
  succession348RelationshipRecords,
  succession348SourcePolicy,
} from './succession348Research.js';
import {
  succession349AbilityRecords,
  succession349ChapterFocus,
  succession349ChapterResearch,
  succession349ContestRules,
  succession349Mysteries,
  succession349ObjectRecords,
  succession349RelationshipRecords,
  succession349SourcePolicy,
} from './succession349Research.js';
import {
  succession350BodyguardAssignments,
  succession350ChapterFocus,
  succession350ChapterResearch,
  succession350Mysteries,
  succession350RelationshipRecords,
  succession350SourcePolicy,
} from './succession350Research.js';
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
  ...succession346ChapterFocus,
  ...succession347ChapterFocus,
  ...succession348ChapterFocus,
  ...succession349ChapterFocus,
  ...succession350ChapterFocus,
  ...succession400ChapterFocus,
  ...succession406ChapterFocus,
  ...succession408ChapterFocus,
  ...succession409ChapterFocus,
  ...succession410ChapterFocus,
  ...succession414415ChapterFocus,
  ...succession416ChapterFocus,
});

export const successionChapterResearch = Object.freeze([
  ...legacy.successionChapterResearch.filter((record) => ![340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 400, 406, 408, 409, 410].includes(record.number)),
  ...succession340ChapterResearch,
  ...succession341ChapterResearch,
  ...succession342ChapterResearch,
  ...succession343ChapterResearch,
  ...succession344ChapterResearch,
  ...succession345ChapterResearch,
  ...succession346ChapterResearch,
  ...succession347ChapterResearch,
  ...succession348ChapterResearch,
  ...succession349ChapterResearch,
  ...succession350ChapterResearch,
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
  ...succession346AbilityRecords,
  ...succession347AbilityRecords,
  ...succession349AbilityRecords,
  ...succession414415AbilityRecords,
]);

export const successionRelationships = Object.freeze([
  ...legacy.successionRelationships,
  ...succession343RelationshipRecords,
  ...succession344RelationshipRecords,
  ...succession345RelationshipRecords,
  ...succession346RelationshipRecords,
  ...succession347RelationshipRecords,
  ...succession348RelationshipRecords,
  ...succession349RelationshipRecords,
  ...succession350RelationshipRecords,
  ...succession414415RelationshipRecords,
]);

export const bodyStateLedger = Object.freeze([
  ...legacy.bodyStateLedger,
  ...succession344BodyStates,
  ...succession345BodyStates,
  ...succession414415BodyStates,
]);

export const successionObjects = Object.freeze([
  ...legacy.successionObjects.map((record) => (
    record.name === 'Seed Urn'
      ? Object.freeze({ ...record, ...succession349ObjectRecords[0] })
      : record
  )),
  ...succession344ObjectRecords,
  ...succession345ObjectRecords,
  ...succession347ObjectRecords,
]);

export const contestRules = Object.freeze([
  ...legacy.contestRules.map((record) => {
    if (record.name === 'Seed Urn origin') return Object.freeze({
      ...record,
      note: 'Chapter 349 attributes the conjured Seed Urn to Kakin’s First King, links its design to the Worm Toxin tradition, and shows the blood ritual implanting Guardian Spirit Beast eggs.',
      status: 'confirmed',
      source: 'https://hunterxhunter.fandom.com/wiki/Chapter_349',
    });
    if (record.name === 'Eligibility') return Object.freeze({
      ...record,
      note: 'Only children of Nasubi’s eight legal wives are eligible; all fourteen are called Princes regardless of gender, and participation requires boarding the Black Whale and joining the departure ceremony.',
      status: 'confirmed',
      source: 'https://hunterxhunter.fandom.com/wiki/Chapter_349',
    });
    return record;
  }),
  ...succession349ContestRules
    .filter((record) => !['Eligible bloodline', 'Boarding and ceremony requirement'].includes(record.rule))
    .map((record) => Object.freeze({
      name: record.rule,
      note: record.detail,
      status: 'confirmed / Chapter 349 boundary',
      source: record.source,
    })),
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
  ...succession346Mysteries,
  ...succession347Mysteries,
  ...succession348Mysteries,
  ...succession349Mysteries.filter((record) => record.question !== 'Which six princes are recruiting outside bodyguards, and who will enter through those routes?'),
  {
    question: 'Which six princes are recruiting outside bodyguards, and who will enter through those routes?',
    evidence: 'Chapter 350 resolves the recruitment network as Woble/Oito, Tyson, Marayam, Luzurus, Kacho, and Momoze hiring Kurapika, Izunavi, Biscuit, Basho, Melody, and Hanzo respectively. Halkenburg did not post a listing; Oito deliberately designed her vague listing to attract applicants who believed they were applying to Halkenburg.',
    status: 'resolved',
    lastChapter: '350',
    source: 'https://hunterxhunter.fandom.com/wiki/Chapter_350',
  },
  ...succession350Mysteries,
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

export const guardAssignmentGroups = Object.freeze([
  Object.freeze({
    group: 'Kurapika-linked hired bodyguards',
    description: 'The six Chapter 350 placements created by Kurapika’s pre-voyage recruitment network across prince households.',
    records: Object.freeze(succession350BodyguardAssignments.map((assignment) => Object.freeze({
      subject: assignment.prince,
      people: assignment.hunter,
      notes: assignment.purpose,
      status: 'hired / pre-voyage',
      source: assignment.source,
    }))),
  }),
  ...legacy.guardAssignmentGroups.map((group) => {
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
  }),
]);

export const dossierSources = Object.freeze({
  ...legacy.dossierSources,
  chapter340: 'https://hunterxhunter.fandom.com/wiki/Chapter_340',
  chapter341: 'https://hunterxhunter.fandom.com/wiki/Chapter_341',
  chapter342: 'https://hunterxhunter.fandom.com/wiki/Chapter_342',
  chapter343: 'https://hunterxhunter.fandom.com/wiki/Chapter_343',
  chapter344: 'https://hunterxhunter.fandom.com/wiki/Chapter_344',
  chapter345: 'https://hunterxhunter.fandom.com/wiki/Chapter_345',
  chapter346: 'https://hunterxhunter.fandom.com/wiki/Chapter_346',
  chapter347: 'https://hunterxhunter.fandom.com/wiki/Chapter_347',
  chapter348: 'https://hunterxhunter.fandom.com/wiki/Chapter_348',
  chapter349: 'https://hunterxhunter.fandom.com/wiki/Chapter_349',
  chapter350: 'https://hunterxhunter.fandom.com/wiki/Chapter_350',
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
  sourcePolicy346: succession346SourcePolicy,
  sourcePolicy347: succession347SourcePolicy,
  sourcePolicy348: succession348SourcePolicy,
  sourcePolicy349: succession349SourcePolicy,
  sourcePolicy350: succession350SourcePolicy,
  sourcePolicy400: succession400SourcePolicy,
  sourcePolicy406: succession406SourcePolicy,
  sourcePolicy408: succession408SourcePolicy,
  sourcePolicy409: succession409SourcePolicy,
  sourcePolicy410: succession410SourcePolicy,
  crossChecks414415: succession414415CrossChecks,
  sourcePolicy416: succession416SourcePolicy,
});
