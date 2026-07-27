import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from './latestChapterMetadata.js';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';

export const ARCHIVE_BOUNDARY = Math.max(LATEST_PUBLISHED_CHAPTER, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
export const ARCHIVE_DETAILED_BOUNDARY = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER;
export const ARCHIVE_REVIEW_DATE = 'July 27, 2026';
export const ARCHIVE_SOURCE = 'Hunterpedia / Fandom';

// Small shell-safe totals keep the home and navigation bundles independent
// from the multi-megabyte research datasets. The content audit verifies them.
export const SITE_STATS = {
  records: 1111,
  characters: 644,
  successionRoster: 274,
  officialArcs: 7,
  conflicts: 54,
  places: 119,
  episodes: 148,
  voyageEvents: 134,
};

export const coverageLabels = {
  chapters: `Publication identity and reader authorization extend through Chapter ${ARCHIVE_BOUNDARY}; maintained scene-level research is verified through Chapter ${ARCHIVE_DETAILED_BOUNDARY}.`,
  characters: 'Unified 644-name Hunterpedia character index with portrait-gallery, research-index, and story-group views; 106 priority portraits are stored locally with source, dimensions, and crop metadata, while remaining identities attempt a Hunterpedia source portrait and fall back visibly to initials.',
  succession: `Developing current-arc roster and reader availability extend through Chapter ${ARCHIVE_BOUNDARY}; per-record currency now exposes when assignments, relationships, Nen, locations, and detailed source annotations remain behind that boundary.`,
  timeline: `Thirty-nine sourced structural blocks cover the complete series, with 134 selected Succession voyage events; detailed maintained chronology currently ends at Chapter ${ARCHIVE_DETAILED_BOUNDARY} and does not claim to transcribe every Hunterpedia event.`,
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics and chapter gaps labeled explicitly.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by Hunterpedia sources; organization charts and trail diagrams remain explicitly editorial study structures.',
};

export const archiveBoundaryLabel = `Reader authorized through Chapter ${ARCHIVE_BOUNDARY} · detailed maintained research verified through Chapter ${ARCHIVE_DETAILED_BOUNDARY}`;
