export const SUCCESSION_READER_START = 338;
export const SUCCESSION_READER_END = 414;

// This manifest intentionally contains only media the project is authorized to host.
// Approved records must provide page, local src, width, and height fields in reading order.
export const authorizedSuccessionChapterMedia = Object.freeze({});

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
      mediaStatus: pages.length ? 'authorized-local' : 'awaiting-authorized-media',
    });
  }),
);

export const successionChapterReaderByNumber = new Map(
  successionChapterReaderRecords.map((record) => [record.chapter, record]),
);

export const SUCCESSION_READER_TOTAL = successionChapterReaderRecords.length;
