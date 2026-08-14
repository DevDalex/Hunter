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

export const successionHomeRecentChapters = freeze(
  successionChapterNumbers.slice(-4).reverse().map((number) => freeze({
    id: `chapter:${number}`,
    number,
    title: getChapterCatalogueTitle(number, chapterTitles),
  })),
);
