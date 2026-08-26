import {
  authorizedSuccessionChapterNumbers,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
} from './successionChapterAvailability.generated.js';
import { authorizedSuccessionChapterMedia } from './successionChapterMedia.generated.js';
import { chapterTitles } from './chapterTitles.js';
import { getChapterCatalogueTitle, getLatestChapterMetadata, LATEST_PUBLISHED_CHAPTER } from './latestChapterMetadata.js';
import { successionChapterResearchByNumber } from './succession/successionResearch.js';

export const SUCCESSION_READER_START = 338;
const importedSuccessionChapterNumbers = Object.keys(authorizedSuccessionChapterMedia)
  .map((chapter) => Number.parseInt(chapter, 10))
  .filter(Number.isInteger);

export const SUCCESSION_READER_END = Math.max(
  414,
  LATEST_PUBLISHED_CHAPTER,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
  ...authorizedSuccessionChapterNumbers,
  ...importedSuccessionChapterNumbers,
);

// Page records are generated from local media by scripts/import-succession-chapter.mjs.
// Published chapters can still appear as awaiting-local-media records before page images are imported.
export { authorizedSuccessionChapterMedia };

export const successionChapterReaderRecords = Object.freeze(
  Array.from({ length: SUCCESSION_READER_END - SUCCESSION_READER_START + 1 }, (_, offset) => {
    const chapter = SUCCESSION_READER_START + offset;
    const pages = Object.freeze([...(authorizedSuccessionChapterMedia[chapter] || [])]
      .sort((left, right) => left.page - right.page));
    const metadata = getLatestChapterMetadata(chapter);
    const research = successionChapterResearchByNumber.get(chapter);
    const title = getChapterCatalogueTitle(chapter, chapterTitles);
    return Object.freeze({
      chapter,
      title,
      label: `Chapter ${chapter} · ${title}`,
      releaseDate: metadata?.releaseDate || null,
      titleStatus: metadata?.titleStatus || 'maintained-reference-title',
      detailStatus: research?.status || 'Research status unavailable',
      detailVerified: Boolean(research?.coverage?.chronology || research?.events?.length || research?.prelude?.length),
      pages,
      pageCount: pages.length,
      mediaStatus: pages.length ? 'local-media' : 'awaiting-local-media',
    });
  }),
);

export const successionChapterReaderByNumber = new Map(
  successionChapterReaderRecords.map((record) => [record.chapter, record]),
);

export const SUCCESSION_READER_TOTAL = successionChapterReaderRecords.length;
