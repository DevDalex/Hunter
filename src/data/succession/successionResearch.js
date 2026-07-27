import { chapterTitles } from '../chapterTitles.js';
import {
  getChapterCatalogueTitle,
  getLatestChapterMetadata,
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
} from '../latestChapterMetadata.js';
import {
  authorizedSuccessionChapterNumbers,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
} from '../successionChapterAvailability.generated.js';
import { successionChapterResearch as maintainedResearch } from '../successionDossier.js';

const maintainedNumbers = new Set(maintainedResearch.map((record) => record.number));
const pendingImportedResearch = authorizedSuccessionChapterNumbers
  .filter((number) => number >= 340 && !maintainedNumbers.has(number))
  .map((number) => {
    const metadata = getLatestChapterMetadata(number);
    return Object.freeze({
      number,
      title: getChapterCatalogueTitle(number, chapterTitles),
      phase: number >= 414 ? 'Current releases' : 'Active contest and voyage',
      voyageDay: number < 359 ? 'Pre-voyage' : 'Unassigned',
      lanes: [],
      focus: `Chapter ${number} is published and authorized in the reader. Detailed scene, character, location, relationship, Nen, and consequence claims remain intentionally pending until maintained source documentation is available.`,
      events: [],
      prelude: [],
      locations: [],
      threadLabels: [],
      confidence: ['publication identity verified', 'detailed scene annotation pending maintained source'],
      status: 'Reader media indexed; detailed research pending verified chapter documentation',
      coverage: {
        identity: true,
        publication: true,
        summary: true,
        sceneSummary: false,
        chronology: false,
        appearances: false,
        locations: false,
        relationships: false,
        assignments: false,
        nen: false,
        source: true,
      },
      lastReviewed: 'July 27, 2026',
      releaseDate: metadata?.releaseDate || null,
      titleStatus: metadata?.titleStatus || 'pending-reference-title',
      officialReaderUrl: metadata?.officialReaderUrl || null,
      source: metadata?.sourceUrl || `https://hunterxhunter.fandom.com/wiki/Chapter_${number}`,
    });
  });

const maintainedDetailedMaximum = Math.max(
  ...maintainedResearch
    .filter((record) => !String(record.status || '').toLowerCase().includes('pending'))
    .map((record) => record.number),
);
if (maintainedDetailedMaximum !== LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER) {
  throw new Error(`Detailed Succession research boundary drift: metadata declares Chapter ${LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER}, maintained records end at Chapter ${maintainedDetailedMaximum}.`);
}
export { LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER };

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
