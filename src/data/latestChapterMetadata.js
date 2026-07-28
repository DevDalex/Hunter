export const latestChapterMetadata = Object.freeze({
  414: Object.freeze({
    number: 414,
    title: 'Friends',
    japaneseTitle: '仲間',
    alternateTitles: Object.freeze(['Companions', 'Comrades']),
    releaseDate: 'July 19, 2026',
    titleStatus: 'verified',
    detailStatus: 'maintained-research',
    researchReviewedAt: 'July 28, 2026',
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
    researchReviewedAt: 'July 28, 2026',
    sourceUrl: 'https://hunterxhunter.fandom.com/wiki/Chapter_415',
    officialReaderUrl: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  }),
});

export const LATEST_PUBLISHED_CHAPTER = Math.max(...Object.keys(latestChapterMetadata).map(Number));
export const LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER = 415;

export const getLatestChapterMetadata = (number) => latestChapterMetadata[Number(number)] || null;

export const getChapterCatalogueTitle = (number, legacyTitles = []) => (
  legacyTitles[Number(number) - 1]
  || getLatestChapterMetadata(number)?.title
  || `Chapter ${number}`
);
