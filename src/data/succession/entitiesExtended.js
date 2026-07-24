import { chapterTitles } from '../chapterTitles.js';
import { successionArchiveData as maintainedData } from './entities.js';
import {
  LATEST_SUCCESSION_RESEARCH_CHAPTER,
  successionChapterResearchByNumber,
} from './successionResearch.js';

const ARCHIVE_DATE = '2026-07-24';
// Canonical overlay IDs: source:chapter-414 and chapter:414.
const chapterNumber = LATEST_SUCCESSION_RESEARCH_CHAPTER;
const chapterId = `chapter:${chapterNumber}`;
const sourceId = `source:chapter-${chapterNumber}`;
const research = successionChapterResearchByNumber.get(chapterNumber);

const source414 = Object.freeze({
  id: sourceId,
  entityType: 'source',
  slug: null,
  name: `Chapter ${chapterNumber}`,
  aliases: [],
  summary: research?.focus || `Primary manga reference for Chapter ${chapterNumber}.`,
  sourceIds: [],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  sourceType: 'chapter',
  chapter: chapterNumber,
  pages: [],
  url: research?.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${chapterNumber}`,
  note: research?.status || 'Latest indexed chapter source.',
});

const chapter414 = Object.freeze({
  id: chapterId,
  entityType: 'chapter',
  slug: String(chapterNumber),
  name: `Chapter ${chapterNumber} · ${research?.title || chapterTitles[chapterNumber - 1] || chapterNumber}`,
  aliases: [],
  summary: research?.focus || `Research record for Chapter ${chapterNumber}.`,
  sourceIds: [sourceId],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  number: chapterNumber,
  storyPhaseIds: ['active-contest-and-voyage'],
  appearanceRecords: [],
  eventIds: ['event:room-1014-nen-classes'],
  locationIds: ['location:black-whale'],
  abilityIds: [],
  organizationIds: [],
  reader: { manifestChapter: chapterNumber },
  voyageDay: research?.voyageDay || 'Voyage Day 12',
  lanes: research?.lanes || [],
  referenceUrl: research?.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${chapterNumber}`,
});

const updateRangeEnd = (range) => range?.end === 413 ? { ...range, end: chapterNumber } : range;

export const successionArchiveData = Object.freeze({
  ...maintainedData,
  sources: Object.freeze([
    ...maintainedData.sources,
    ...(maintainedData.sources.some((source) => source.id === sourceId) ? [] : [source414]),
  ]),
  characters: Object.freeze(maintainedData.characters.map((character) => Object.freeze({
    ...character,
    status: character.status ? Object.freeze({ ...character.status, asOfChapter: chapterNumber }) : character.status,
    updatedAt: ARCHIVE_DATE,
  }))),
  locationHistory: Object.freeze(maintainedData.locationHistory.map((record) => Object.freeze({
    ...record,
    chapterRange: Object.freeze(updateRangeEnd(record.chapterRange)),
    updatedAt: ARCHIVE_DATE,
  }))),
  events: Object.freeze(maintainedData.events.map((event) => Object.freeze({
    ...event,
    chapterRange: Object.freeze(updateRangeEnd(event.chapterRange)),
    updatedAt: ARCHIVE_DATE,
  }))),
  chapters: Object.freeze([
    ...maintainedData.chapters,
    ...(maintainedData.chapters.some((chapter) => chapter.id === chapterId) ? [] : [chapter414]),
  ]),
});
