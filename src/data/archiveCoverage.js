import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata.js';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';

export const archiveCoverage = Object.freeze({
  publication: Object.freeze({
    id: 'publication',
    label: 'Latest official publication',
    chapter: LATEST_PUBLISHED_CHAPTER,
    description: 'The latest chapter with verified publication metadata.',
  }),
  reader: Object.freeze({
    id: 'reader',
    label: 'Latest readable chapter',
    chapter: LATEST_AUTHORIZED_SUCCESSION_CHAPTER,
    description: 'The latest chapter authorized for the integrated reader.',
  }),
  research: Object.freeze({
    id: 'research',
    label: 'Latest fully indexed chapter',
    chapter: LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
    description: 'The latest chapter covered by maintained scene-level research.',
  }),
});

export const archiveCoverageList = Object.freeze(Object.values(archiveCoverage));

export const domainCoverage = Object.freeze({
  reader: Object.freeze({ label: 'Chapter reader', chapter: archiveCoverage.reader.chapter, status: 'maintained' }),
  chapters: Object.freeze({ label: 'Chapter dossiers', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  story: Object.freeze({ label: 'Story Intelligence', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  timeline: Object.freeze({ label: 'Voyage timeline', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  events: Object.freeze({ label: 'Event records', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  characters: Object.freeze({ label: 'Character states', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  assignments: Object.freeze({ label: 'Assignments', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  relationships: Object.freeze({ label: 'Relationships', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  organizations: Object.freeze({ label: 'Organizations', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  locations: Object.freeze({ label: 'Locations', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  nen: Object.freeze({ label: 'Nen and ritual systems', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
  glossary: Object.freeze({ label: 'Glossary', chapter: archiveCoverage.research.chapter, status: 'maintained' }),
});

export const getCoverageSummary = () => ({
  officialPublication: archiveCoverage.publication.chapter,
  readableChapter: archiveCoverage.reader.chapter,
  fullyIndexedChapter: archiveCoverage.research.chapter,
});
