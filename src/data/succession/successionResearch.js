import { getCurrentChapterRelease, getPublishedChapterTitle } from '../latestChapterReleases.js';
import {
  authorizedSuccessionChapterNumbers,
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
} from '../successionChapterAvailability.generated.js';
import { successionChapterResearch as maintainedResearch } from '../successionDossier.js';

const freeze = (value) => Object.freeze(value);
const maintainedNumbers = new Set(maintainedResearch.map((record) => record.number));
const latestMaintainedDetailedChapter = Math.max(...maintainedResearch.map((record) => record.number));

const maintainedWithCurrency = maintainedResearch.map((record) => freeze({
  ...record,
  publicationVerifiedThrough: record.number,
  researchVerifiedThrough: record.number,
  coverageGap: null,
  recentChanges: freeze([]),
  openQuestions: freeze([]),
}));

const pendingImportedResearch = authorizedSuccessionChapterNumbers
  .filter((number) => number >= 340 && !maintainedNumbers.has(number))
  .map((number) => {
    const release = getCurrentChapterRelease(number);
    return freeze({
      number,
      title: getPublishedChapterTitle(number),
      titleStatus: release?.titleStatus || 'pending-maintained-source',
      phase: number >= 414 ? 'Current releases' : 'Active contest and voyage',
      voyageDay: number < 359 ? 'Pre-voyage' : 'Unassigned',
      lanes: freeze([]),
      focus: `Chapter ${number} is officially published and available through the authorized reader. Detailed scene claims remain intentionally pending until maintained source documentation is available.`,
      events: freeze([]),
      prelude: freeze([]),
      locations: freeze([]),
      threadLabels: freeze([]),
      confidence: freeze(['official publication verified', 'chapter media indexed', 'detailed scene annotation pending maintained source']),
      status: 'Reader media indexed; detailed research pending verified chapter documentation',
      coverage: freeze({
        publication: true,
        summary: true,
        chronology: false,
        appearances: false,
        locations: false,
        relationships: false,
        assignments: false,
        nen: false,
        source: true,
      }),
      publicationVerifiedThrough: number,
      researchVerifiedThrough: latestMaintainedDetailedChapter,
      coverageGap: freeze({ from: latestMaintainedDetailedChapter + 1, to: number }),
      recentChanges: freeze([
        `Chapter ${number} was officially published${release?.releaseDate ? ` on ${release.releaseDate}` : ''}.`,
        'Authorized reader availability and publication identity were added without promoting unreviewed story claims.',
      ]),
      openQuestions: freeze([
        'Which scene-level events and causal links should be added after maintained source review?',
        'Which character appearances, locations, assignments, and relationship changes are chapter-confirmed?',
        'Which Nen or Guardian Spirit Beast developments, if any, require canonical records?',
        release?.titleStatus === 'pending-maintained-source' ? 'What English chapter title will the maintained source publish?' : null,
      ].filter(Boolean)),
      lastReviewed: 'July 27, 2026',
      source: release?.referenceUrl || `https://hunterxhunter.fandom.com/wiki/Chapter_${number}`,
      officialSource: release?.officialUrl || null,
      releaseDate: release?.releaseDate || null,
    });
  });

export const LATEST_SUCCESSION_RESEARCH_CHAPTER = Math.max(
  LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
  ...maintainedResearch.map((record) => record.number),
);

export const LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER = latestMaintainedDetailedChapter;

export const successionChapterResearch = freeze([
  ...maintainedWithCurrency,
  ...pendingImportedResearch,
].sort((left, right) => left.number - right.number));

export const successionChapterResearchByNumber = new Map(
  successionChapterResearch.map((record) => [record.number, record]),
);

export const successionResearchCoverage = freeze({
  readingBoundary: LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
  archiveMaximum: LATEST_SUCCESSION_RESEARCH_CHAPTER,
  detailedThrough: LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  pendingChapters: freeze(successionChapterResearch
    .filter((record) => record.researchVerifiedThrough < record.number)
    .map((record) => record.number)),
  documentedChapters: successionChapterResearch.filter((record) => record.researchVerifiedThrough >= record.number).length,
  totalChapters: successionChapterResearch.length,
});
