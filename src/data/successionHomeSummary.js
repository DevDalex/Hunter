import { chapterTitles } from './chapterTitles.js';
import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  getChapterCatalogueTitle,
} from './latestChapterMetadata.js';

const freeze = (value) => Object.freeze(value);
const FIRST_SUCCESSION_CHAPTER = 340;

const successionChapterNumbers = freeze(Array.from(
  { length: Math.max(0, LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER - FIRST_SUCCESSION_CHAPTER + 1) },
  (_, index) => FIRST_SUCCESSION_CHAPTER + index,
));

export const successionHomeCounts = freeze({
  princes: 14,
  families: 8,
  organizations: 11,
  assignments: 40,
  chapters: successionChapterNumbers.length,
});

export const successionHomeChapterSummaries = freeze(
  successionChapterNumbers.map((number) => freeze({
    id: `chapter:${number}`,
    number,
    title: getChapterCatalogueTitle(number, chapterTitles),
  })),
);

export const getSuccessionHomeRecentChapters = (boundary = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER, limit = 4) => {
  const safeBoundary = Number(boundary);
  const safeLimit = Math.max(1, Math.min(12, Number(limit) || 4));
  return freeze(successionHomeChapterSummaries
    .filter((chapter) => !Number.isFinite(safeBoundary) || chapter.number <= safeBoundary)
    .slice(-safeLimit)
    .reverse());
};

export const successionHomeRecentChapters = getSuccessionHomeRecentChapters();
