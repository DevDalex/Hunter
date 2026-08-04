import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata.js';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';
import { archiveCoverage, domainCoverage } from './archiveCoverage.js';
import { SITE_STATS } from './siteStats.generated.js';

export const ARCHIVE_BOUNDARY = Math.max(LATEST_PUBLISHED_CHAPTER, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
export const ARCHIVE_DETAILED_BOUNDARY = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER;
export const ARCHIVE_REVIEW_DATE = 'July 29, 2026';
export const ARCHIVE_SOURCE = 'VIZ publication records, Hunterpedia structured references, and VoraciousDrake translation cross-checks; community context is labelled separately';

export { archiveCoverage, domainCoverage, SITE_STATS };

export const coverageLabels = {
  publication: `${archiveCoverage.publication.label}: Chapter ${archiveCoverage.publication.chapter}.`,
  reader: `${archiveCoverage.reader.label}: Chapter ${archiveCoverage.reader.chapter}.`,
  research: `${archiveCoverage.research.label}: Chapter ${archiveCoverage.research.chapter}.`,
  chapters: `Publication identity and maintained scene-level research extend through Chapter ${archiveCoverage.research.chapter}.`,
  characters: 'Unified 644-name Hunterpedia character index with portrait-gallery, research-index, and story-group views; 106 priority portraits are stored locally with source, dimensions, and crop metadata, while remaining identities attempt a Hunterpedia source portrait and fall back visibly to initials.',
  succession: `Current-arc reader availability extends through Chapter ${archiveCoverage.reader.chapter}; fully indexed research extends through Chapter ${archiveCoverage.research.chapter}. Domain coverage exposes remaining uncertainty explicitly.`,
  timeline: `Thirty-nine sourced structural blocks cover the complete series, with ${SITE_STATS.voyageEvents} selected Succession voyage events; detailed maintained chronology currently reaches Chapter ${domainCoverage.timeline.chapter} and does not claim to transcribe every source-page event.`,
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics and chapter gaps labeled explicitly.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by Hunterpedia sources; organization charts and trail diagrams remain explicitly editorial study structures.',
};

export const archiveBoundaryLabel = `${archiveCoverage.reader.label}: Chapter ${archiveCoverage.reader.chapter}; ${archiveCoverage.research.label.toLowerCase()}: Chapter ${archiveCoverage.research.chapter}`;
