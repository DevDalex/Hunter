import { chapterTitles } from '../chapterTitles.js';
import { successionArchiveData as maintainedData } from './entities.js';
import {
  LATEST_SUCCESSION_RESEARCH_CHAPTER,
  successionChapterResearch,
} from './successionResearch.js';

const ARCHIVE_DATE = '2026-07-24';
const latestChapter = LATEST_SUCCESSION_RESEARCH_CHAPTER;
const maintainedSourceIds = new Set(maintainedData.sources.map((source) => source.id));
const maintainedChapterIds = new Set(maintainedData.chapters.map((chapter) => chapter.id));

const createSource = (research) => Object.freeze({
  id: `source:chapter-${research.number}`,
  entityType: 'source',
  slug: null,
  name: `Chapter ${research.number}`,
  aliases: [],
  summary: research.focus || `Primary manga reference for Chapter ${research.number}.`,
  sourceIds: [],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  sourceType: 'chapter',
  chapter: research.number,
  pages: [],
  url: research.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${research.number}`,
  note: research.status || 'Latest indexed chapter source.',
});

const createChapter = (research) => Object.freeze({
  id: `chapter:${research.number}`,
  entityType: 'chapter',
  slug: String(research.number),
  name: `Chapter ${research.number} · ${research.title || chapterTitles[research.number - 1] || research.number}`,
  aliases: [],
  summary: research.focus || `Research record for Chapter ${research.number}.`,
  sourceIds: [`source:chapter-${research.number}`],
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: ARCHIVE_DATE,
  updatedAt: ARCHIVE_DATE,
  number: research.number,
  storyPhaseIds: ['active-contest-and-voyage'],
  appearanceRecords: [],
  eventIds: ['event:room-1014-nen-classes'],
  locationIds: ['location:black-whale'],
  abilityIds: [],
  organizationIds: [],
  reader: { manifestChapter: research.number },
  voyageDay: research.voyageDay || 'Unassigned',
  lanes: research.lanes || [],
  referenceUrl: research.source || `https://hunterxhunter.fandom.com/wiki/Chapter_${research.number}`,
});

const additionalSources = successionChapterResearch
  .filter((research) => !maintainedSourceIds.has(`source:chapter-${research.number}`))
  .map(createSource);

const additionalChapters = successionChapterResearch
  .filter((research) => !maintainedChapterIds.has(`chapter:${research.number}`))
  .map(createChapter);

const updateRangeEnd = (range) => range?.end === 413 ? { ...range, end: latestChapter } : range;

export const successionArchiveData = Object.freeze({
  ...maintainedData,
  sources: Object.freeze([
    ...maintainedData.sources,
    ...additionalSources,
  ]),
  characters: Object.freeze(maintainedData.characters.map((character) => Object.freeze({
    ...character,
    status: character.status ? Object.freeze({ ...character.status, asOfChapter: latestChapter }) : character.status,
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
    ...additionalChapters,
  ].sort((left, right) => left.number - right.number)),
});
