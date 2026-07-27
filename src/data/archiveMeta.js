import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from './successionChapterAvailability.generated.js';
import { LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER } from './latestChapterReleases.js';

export const ARCHIVE_BOUNDARY = Math.max(413, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
export const ARCHIVE_REVIEW_DATE = 'July 27, 2026';
export const ARCHIVE_SOURCE = 'Hunterpedia / Fandom';
export const ARCHIVE_DETAILED_RESEARCH_BOUNDARY = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER;

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
  chapters: `Chapter identity, official publication status, and reader availability extend through Chapter ${ARCHIVE_BOUNDARY}; detailed scene research is verified through Chapter ${ARCHIVE_DETAILED_RESEARCH_BOUNDARY}, with newer releases visibly marked pending.`,
  characters: 'Unified 644-name Hunterpedia character index with portrait-gallery, research-index, and story-group views; 106 priority portraits are stored locally with source, dimensions, and crop metadata, while remaining identities attempt a Hunterpedia source portrait and fall back visibly to initials.',
  succession: `The reading boundary extends through Chapter ${ARCHIVE_BOUNDARY}; active dossiers now expose their own latest verified evidence and any gap beyond Chapter ${ARCHIVE_DETAILED_RESEARCH_BOUNDARY}.`,
  timeline: `Thirty-nine sourced structural blocks and 134 selected Succession voyage events remain verified through Chapter ${ARCHIVE_DETAILED_RESEARCH_BOUNDARY}; pending releases are not converted into invented chronology.`,
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics and chapter-currency gaps labeled explicitly.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by Hunterpedia sources; organization charts and trail diagrams remain explicitly editorial study structures.',
};

export const archiveBoundaryLabel = `Reader media indexed through Chapter ${ARCHIVE_BOUNDARY} · detailed research verified through Chapter ${ARCHIVE_DETAILED_RESEARCH_BOUNDARY}`;
