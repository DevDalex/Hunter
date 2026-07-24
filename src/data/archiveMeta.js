import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';

export const ARCHIVE_BOUNDARY = Math.max(413, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
export const ARCHIVE_REVIEW_DATE = 'July 24, 2026';
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
  chapters: `Chapter identity and media availability extend through Chapter ${ARCHIVE_BOUNDARY}; detailed local scene accounts remain explicitly separated from pending research records.`,
  characters: 'Unified 644-name Hunterpedia character index with portrait-gallery, research-index, and story-group views; 106 priority portraits are stored locally with source, dimensions, and crop metadata, while remaining identities attempt a Hunterpedia source portrait and fall back visibly to initials.',
  succession: `Developing current-arc roster and reader availability extend through Chapter ${ARCHIVE_BOUNDARY}; assignments and detailed source annotations remain subject to revision.`,
  timeline: 'Thirty-nine sourced structural blocks cover the complete series, with 134 selected Succession voyage events; neither view claims to transcribe every Hunterpedia event.',
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics labeled as such.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by Hunterpedia sources; organization charts and trail diagrams remain explicitly editorial study structures.',
};

export const archiveBoundaryLabel = `Reader media indexed through Chapter ${ARCHIVE_BOUNDARY} · research records label pending detail explicitly`;
