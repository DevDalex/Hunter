export const SUCCESSION_READER_START = 338;
export const SUCCESSION_READER_END = 414;

// This manifest intentionally contains only media the project is authorized to host.
// Add approved local pages in reading order using the documented shape below:
// 338: [{ page: 1, src: '/media/succession-contest/chapters/338/001.webp', width: 1200, height: 1800 }]
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
