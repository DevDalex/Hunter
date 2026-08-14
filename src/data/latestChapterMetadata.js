export const latestChapterMetadata = Object.freeze({
  414: Object.freeze({
    number: 414,
    title: 'Friends',
    japaneseTitle: '仲間',
    alternateTitles: Object.freeze(['Companions', 'Comrades']),
    releaseDate: 'July 19, 2026',
    titleStatus: 'verified',
    detailStatus: 'maintained-research',
    researchReviewedAt: 'July 29, 2026',
    sourceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
    officialReaderUrl: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  }),
  415: Object.freeze({
    number: 415,
    title: 'Truth and Falsehood',
    japaneseTitle: '真偽',
    alternateTitles: Object.freeze(['Authenticity', 'Veracity']),
    releaseDate: 'July 26, 2026',
    titleStatus: 'cross-checked-english-rendering',
    detailStatus: 'maintained-research',
    researchReviewedAt: 'July 29, 2026',
    sourceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
    officialReaderUrl: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  }),
  416: Object.freeze({
    number: 416,
    title: 'Proclamation',
    japaneseTitle: '発令',
    alternateTitles: Object.freeze([]),
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    detailStatus: 'maintained-research',
    researchReviewedAt: 'August 5, 2026',
    sourceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_416',
    officialReaderUrl: null,
  }),
  417: Object.freeze({
    number: 417,
    title: null,
    japaneseTitle: null,
    alternateTitles: Object.freeze([]),
    releaseDate: null,
    titleStatus: 'official-title-not-supplied',
    detailStatus: 'maintained-research',
    researchReviewedAt: 'August 14, 2026',
    sourceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_417',
    officialReaderUrl: null,
  }),
});

export const LATEST_PUBLISHED_CHAPTER = Math.max(...Object.keys(latestChapterMetadata).map(Number));
export const LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER = 417;

export const getLatestChapterMetadata = (number) => latestChapterMetadata[Number(number)] || null;

export const getChapterCatalogueTitle = (number, legacyTitles = []) => (
  legacyTitles[Number(number) - 1]
  || getLatestChapterMetadata(number)?.title
  || `Chapter ${number}`
);
