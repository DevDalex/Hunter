export const ARCHIVE_BOUNDARY = 413;
export const ARCHIVE_REVIEW_DATE = 'July 16, 2026';
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
  chapters: 'All 413 chapters have maintained identity, source, volume, and story-position records; 112 contain chapter-specific local accounts and 301 retain explicitly labeled arc-phase context while exact scene evidence stays on Hunterpedia.',
  characters: 'Unified 644-name Hunterpedia character index with portrait-gallery, research-index, and story-group views; 106 priority portraits are stored locally with source, dimensions, and crop metadata, while remaining identities attempt a Hunterpedia source portrait and fall back visibly to initials.',
  succession: 'Developing current-arc roster reconciled through Chapter 413; assignments and source pages remain subject to revision.',
  timeline: 'Thirty-nine sourced structural blocks cover the complete series, with 134 selected Succession voyage events; neither view claims to transcribe every Hunterpedia event.',
  nen: 'Structured system concepts, named abilities, users, conditions, and Guardian Spirit Beast records, with developing mechanics labeled as such.',
  world: 'Structured factions, locations, ship rooms, objects, conflicts, relationships, and status records supported by Hunterpedia sources; organization charts and trail diagrams remain explicitly editorial study structures.',
};

export const archiveBoundaryLabel = `Reviewed through Chapter ${ARCHIVE_BOUNDARY} · ${ARCHIVE_REVIEW_DATE}`;
