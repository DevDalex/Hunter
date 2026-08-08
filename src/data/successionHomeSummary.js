import { chapterTitles } from './chapterTitles.js';
import { authorizedSuccessionChapterNumbers } from './successionChapterAvailability.generated.js';

const freeze = (value) => Object.freeze(value);

const successionChapterNumbers = authorizedSuccessionChapterNumbers
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
    title: chapterTitles[number - 1] || null,
  })),
);
