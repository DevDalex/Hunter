import { chapterTitles } from '../chapterTitles.js';
import { successionChapterResearch as maintainedResearch } from '../successionDossier.js';

export const LATEST_SUCCESSION_RESEARCH_CHAPTER = 414;

const chapter414 = Object.freeze({
  number: 414,
  title: chapterTitles[413] || 'Chapter 414',
  phase: 'Active contest and voyage',
  voyageDay: 'Voyage Day 12',
  lanes: ['Royal contest', 'Kurapika / Woble', 'Nen development', 'Military command', 'Funeral operation'],
  focus: 'The latest reader chapter is indexed as a canonical research record. Detailed scene claims remain intentionally unfilled until the maintained Hunterpedia synopsis and chapter evidence are available.',
  events: [],
  prelude: [],
  locations: [],
  threadLabels: [],
  confidence: ['chapter and title indexed', 'scene summary pending maintained source'],
  status: 'Reader media indexed; detailed research pending verified chapter documentation',
  coverage: {
    summary: true,
    chronology: false,
    locations: false,
    source: true,
  },
  lastReviewed: 'July 24, 2026',
  source: 'https://hunterxhunter.fandom.com/wiki/Chapter_414',
});

export const successionChapterResearch = Object.freeze([
  ...maintainedResearch,
  ...(maintainedResearch.some((record) => record.number === chapter414.number) ? [] : [chapter414]),
]);

export const successionChapterResearchByNumber = new Map(
  successionChapterResearch.map((record) => [record.number, record]),
);
