import {
  authorizedSuccessionChapterNumbers,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
} from './successionChapterAvailability.generated.js';
import { authorizedSuccessionChapterMedia } from './successionChapterMedia.generated.js';

export const SUCCESSION_READER_START = 338;
export const SUCCESSION_READER_END = Math.max(
  414,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
  ...authorizedSuccessionChapterNumbers,
);

// Page records are generated from local media by scripts/import-succession-chapter.mjs.
// Each record provides page, local src, width, and height fields in reading order.
export { authorizedSuccessionChapterMedia };

export const successionChapterReaderRecords = Object.freeze(
  Array.from({ length: SUCCESSION_READER_END - SUCCESSION_READER_START + 1 }, (_, offset) => {
    const chapter = SUCCESSION_READER_START + offset;
    const pages = Object.freeze([...(authorizedSuccessionChapterMedia[chapter] || [])]
      .sort((left, right) => left.page - right.page));
    return Object.freeze({
      chapter,
      label: `Chapter ${chapter}`,
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
