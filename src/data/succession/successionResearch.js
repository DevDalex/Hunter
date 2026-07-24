import { chapterTitles } from '../chapterTitles.js';
import {
  authorizedSuccessionChapterNumbers,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
} from '../successionChapterAvailability.generated.js';
import { successionChapterResearch as maintainedResearch } from '../successionDossier.js';

const maintainedNumbers = new Set(maintainedResearch.map((record) => record.number));
const pendingImportedResearch = authorizedSuccessionChapterNumbers
  .filter((number) => number >= 340 && !maintainedNumbers.has(number))
  .map((number) => Object.freeze({
    number,
    title: chapterTitles[number - 1] || `Chapter ${number}`,
    phase: number >= 414 ? 'Current releases' : 'Active contest and voyage',
    voyageDay: number < 359 ? 'Pre-voyage' : 'Unassigned',
    lanes: [],
    focus: `Chapter ${number} was added automatically from the authorized reader-media manifest. Detailed scene claims remain intentionally pending until maintained source documentation is available.`,
    events: [],
    prelude: [],
    locations: [],
    threadLabels: [],
    confidence: ['chapter media imported', 'detailed scene annotation pending maintained source'],
    status: 'Reader media indexed; detailed research pending verified chapter documentation',
    coverage: {
      summary: true,
      chronology: false,
      locations: false,
      source: true,
    },
    lastReviewed: 'Pending maintained research review',
    source: `https://hunterxhunter.fandom.com/wiki/Chapter_${number}`,
  }));

export const LATEST_SUCCESSION_RESEARCH_CHAPTER = Math.max(
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
  ...maintainedResearch.map((record) => record.number),
);

export const successionChapterResearch = Object.freeze([
  ...maintainedResearch,
  ...pendingImportedResearch,
].sort((left, right) => left.number - right.number));

export const successionChapterResearchByNumber = new Map(
  successionChapterResearch.map((record) => [record.number, record]),
);
