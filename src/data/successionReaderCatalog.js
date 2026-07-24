import { chapterTitles } from './chapterTitles.js';
import { successionChapterResearch } from './succession/successionResearch.js';
import {
  SUCCESSION_READER_END,
  SUCCESSION_READER_START,
  successionChapterReaderRecords,
} from './successionChapterReader.js';

const researchByChapter = new Map(successionChapterResearch.map((record) => [record.number, record]));

export const successionReaderPhases = Object.freeze([
  { id: 'prelude', label: 'Prelude', range: [338, 339], description: 'The threshold between the Election aftermath and the Dark Continent expedition.' },
  { id: 'expedition-setup', label: 'Expedition setup', range: [340, 348], description: 'Beyond, the V6, the Zodiacs, and Kurapika’s recruitment establish the voyage.' },
  { id: 'succession-preparation', label: 'Succession preparation', range: [349, 350], description: 'The Seed Urn ritual, fourteen princes, and bodyguard recruitment establish the contest.' },
  { id: 'arena-interlude', label: 'Heavens Arena interlude', range: [351, 357], description: 'Hisoka and Chrollo’s battle creates the Phantom Troupe conflict carried onto the ship.' },
  { id: 'boarding', label: 'Boarding', range: [358, 358], description: 'The royal family, expedition personnel, and civilian classes board the Black Whale.' },
  { id: 'royal-conflict', label: 'Royal conflict and Nen exposure', range: [359, 376], description: 'The ship departs, royal murders begin, and Kurapika turns Nen knowledge into deterrence.' },
  { id: 'mafia-arrival', label: 'Mafia arrival and royal escalation', range: [377, 390], description: 'The three mafia families, the Troupe, royal assassinations, and the first Nen class converge.' },
  { id: 'heil-ly-war', label: 'Heil-Ly war', range: [391, 400], description: 'The lower-tier conflict expands through Contagion, Room 3101, and the Troupe’s history.' },
  { id: 'alliance-convergence', label: 'Alliances and upper-tier convergence', range: [401, 406], description: 'Moonlight Act, Beyond’s curse network, the funeral operation, and Hisoka move toward Tier 1.' },
  { id: 'martial-law', label: 'Martial law and negotiation', range: [407, 413], description: 'Borksen’s recruitment, the funeral procession, the second Nen class, and martial law advance together.' },
  { id: 'current-releases', label: 'Current releases', range: [414, Number.POSITIVE_INFINITY], description: 'Imported chapters beyond the maintained phase map remain available immediately while detailed research annotation catches up.' },
]);

const phaseForChapter = (chapter) => successionReaderPhases.find(({ range }) => chapter >= range[0] && chapter <= range[1]) || successionReaderPhases.at(-1);

export const successionReaderCatalog = Object.freeze(successionChapterReaderRecords.map((record) => {
  const research = researchByChapter.get(record.chapter);
  const phase = phaseForChapter(record.chapter);
  const expectedPageCount = record.expectedPageCount || (record.pageCount || null);
  const mediaStatus = !record.pageCount
    ? 'indexed'
    : expectedPageCount && record.pageCount < expectedPageCount
      ? 'partial'
      : 'available';
  return Object.freeze({
    ...record,
    title: research?.title || chapterTitles[record.chapter - 1] || `Chapter ${record.chapter}`,
    phaseId: phase.id,
    phase: research?.phase || phase.label,
    phaseDescription: phase.description,
    focus: research?.focus || '',
    voyageDay: research?.voyageDay || (record.chapter < 359 ? 'Pre-voyage' : 'Unassigned'),
    lanes: research?.lanes || [],
    eventCount: research?.events?.length || 0,
    locationCount: research?.locations?.length || 0,
    chapterRecordId: research ? `chapter:${record.chapter}` : null,
    expectedPageCount,
    mediaStatus,
    thumbnail: record.pages[0]?.src || null,
  });
}));

export const successionReaderCatalogByNumber = new Map(successionReaderCatalog.map((record) => [record.chapter, record]));

export const successionReaderPhaseGroups = Object.freeze(successionReaderPhases.map((phase) => Object.freeze({
  ...phase,
  chapters: Object.freeze(successionReaderCatalog.filter((record) => record.phaseId === phase.id)),
})).filter((phase) => phase.chapters.length));

export const successionReaderAvailableChapters = Object.freeze(successionReaderCatalog.filter((record) => record.pageCount > 0));
export const SUCCESSION_READER_AVAILABLE_TOTAL = successionReaderAvailableChapters.length;
export const isSuccessionReaderChapter = (chapter) => Number(chapter) >= SUCCESSION_READER_START && Number(chapter) <= SUCCESSION_READER_END;
