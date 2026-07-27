import { chapterTitles as legacyChapterTitles } from './chapterTitles.js';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';

const freeze = (value) => Object.freeze(value);

export const LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER = 413;

// Publication identity is intentionally separate from detailed story research.
// Release dates are verified against the official VIZ Shonen Jump chapter pages.
// Titles remain provisional until the maintained chapter source publishes them.
export const currentChapterReleases = freeze([
  freeze({
    number: 414,
    title: 'Chapter 414',
    titleStatus: 'pending-maintained-source',
    releaseDate: 'July 19, 2026',
    officialUrl: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
    referenceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
    publicationStatus: 'published',
    researchStatus: 'Reader media indexed; detailed research pending verified chapter documentation',
  }),
  freeze({
    number: 415,
    title: 'Chapter 415',
    titleStatus: 'pending-maintained-source',
    releaseDate: 'July 26, 2026',
    officialUrl: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
    referenceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
    publicationStatus: 'published',
    researchStatus: 'Reader media indexed; detailed research pending verified chapter documentation',
  }),
]);

export const currentChapterReleaseByNumber = new Map(
  currentChapterReleases.map((record) => [record.number, record]),
);

export const publishedChapterTitles = freeze([
  ...legacyChapterTitles,
  ...Array.from(
    { length: Math.max(0, LATEST_AUTHORIZED_SUCCESSION_CHAPTER - legacyChapterTitles.length) },
    (_, offset) => currentChapterReleaseByNumber.get(legacyChapterTitles.length + offset + 1)?.title
      || `Chapter ${legacyChapterTitles.length + offset + 1}`,
  ),
]);

export const getPublishedChapterTitle = (number) => (
  publishedChapterTitles[number - 1] || `Chapter ${number}`
);

export const getCurrentChapterRelease = (number) => currentChapterReleaseByNumber.get(Number(number)) || null;
