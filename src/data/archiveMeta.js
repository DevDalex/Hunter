import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata.js';
import { archiveCoverage, domainCoverage } from './archiveCoverage.js';
import { SITE_STATS } from './siteStats.generated.js';

export const ARCHIVE_BOUNDARY = LATEST_PUBLISHED_CHAPTER;
export const ARCHIVE_DETAILED_BOUNDARY = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER;
export const ARCHIVE_REVIEW_DATE = 'July 29, 2026';
export const ARCHIVE_SOURCE = 'VIZ publication records, Hunterpedia structured references, and VoraciousDrake translation cross-checks; community context is labelled separately';

const SPOILER_LIMIT_KEY = 'hxh-spoiler-limit';
const SPOILER_BOUNDARY_KEY = 'hxh-spoiler-boundary';
const LEGACY_DEFAULT_BOUNDARIES = new Set([416, 417]);

const migrateStoredSpoilerBoundary = () => {
  if (typeof window === 'undefined') return;
  try {
    const storage = window.localStorage;
    const stored = Number(storage.getItem(SPOILER_LIMIT_KEY));
    const previouslySeenBoundary = Number(storage.getItem(SPOILER_BOUNDARY_KEY));
    const validStored = Number.isFinite(stored) && stored >= 1 && stored <= ARCHIVE_BOUNDARY;
    const legacyDefault = validStored
      && !previouslySeenBoundary
      && LEGACY_DEFAULT_BOUNDARIES.has(stored)
      && stored < ARCHIVE_BOUNDARY;
    const trackedOldDefault = validStored
      && previouslySeenBoundary > 0
      && previouslySeenBoundary < ARCHIVE_BOUNDARY
      && stored === previouslySeenBoundary;

    if (legacyDefault || trackedOldDefault) {
      storage.setItem(SPOILER_LIMIT_KEY, String(ARCHIVE_BOUNDARY));
    }
    storage.setItem(SPOILER_BOUNDARY_KEY, String(ARCHIVE_BOUNDARY));
  } catch {
    // Storage is optional. The in-memory archive boundary still defaults to the latest release.
  }
};

migrateStoredSpoilerBoundary();

export { archiveCoverage, domainCoverage, SITE_STATS };

export const coverageLabels = {
  publication: `${archiveCoverage.publication.label}: Chapter ${archiveCoverage.publication.chapter}.`,
  research: `${archiveCoverage.research.label}: Chapter ${archiveCoverage.research.chapter}.`,
  chapters: `Publication identity and maintained scene-level research extend through Chapter ${archiveCoverage.research.chapter}.`,
  characters: 'Unified Hunterpedia character index with portrait-gallery, research-index, and story-group views. Local portraits retain source, dimensions, and crop metadata where available.',
  succession: `Published Succession coverage extends through Chapter ${archiveCoverage.publication.chapter}; fully indexed research extends through Chapter ${archiveCoverage.research.chapter}. Domain coverage exposes remaining uncertainty explicitly.`,
  timeline: `Selected Succession voyage events are maintained through Chapter ${domainCoverage.timeline.chapter}; the archive does not claim to transcribe every source-page event.`,
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics and chapter gaps labeled explicitly.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by maintained sources; editorial study structures remain explicitly labelled.',
};

export const archiveBoundaryLabel = `${archiveCoverage.publication.label}: Chapter ${archiveCoverage.publication.chapter}; ${archiveCoverage.research.label.toLowerCase()}: Chapter ${archiveCoverage.research.chapter}`;
