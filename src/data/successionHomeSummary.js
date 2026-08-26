import { chapterTitles } from './chapterTitles.js';
import { getChapterCatalogueTitle } from './latestChapterMetadata.js';
import { maintainedSuccessionChapterNumbers } from './successionMaintainedChapterResearch.js';

const freeze = (value) => Object.freeze(value);

const successionChapterNumbers = maintainedSuccessionChapterNumbers
  .filter((number) => number >= 340)
  .sort((left, right) => left - right);

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

export const getSuccessionHomeRecentChapters = (boundary = successionChapterNumbers.at(-1), limit = 4) => {
  const safeBoundary = Number(boundary);
  const safeLimit = Math.max(1, Math.min(12, Number(limit) || 4));
  return freeze(successionHomeChapterSummaries
    .filter((chapter) => !Number.isFinite(safeBoundary) || chapter.number <= safeBoundary)
    .slice(-safeLimit)
    .reverse());
};

export const successionHomeRecentChapters = getSuccessionHomeRecentChapters();
