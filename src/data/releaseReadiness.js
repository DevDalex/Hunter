import { ARCHIVE_BOUNDARY } from './archiveMeta.js';
import { routeManifestStats } from './routeManifest.js';

export const CURRENT_RELEASE_VERSION = 'Cloudflare baseline · HxH-only deployment';
export const CURRENT_RELEASE_DATE = 'July 23, 2026';

export const releaseGates = [
  { id: 'content', label: 'Content contract', detail: 'Chapter continuity, research-depth labels, sources, identities, statuses, timelines, and media accounting remain build-blocking.' },
  { id: 'routes', label: 'Route contract', detail: `${routeManifestStats.screens} reader-facing screens resolve from one manifest with unique destinations, valid aliases, and maintained navigation.` },
  { id: 'storage', label: 'Private-state resilience', detail: 'Progress, bookmarks, notes, caches, spoiler limits, and inspection marks degrade safely when browser storage is blocked or full.' },
  { id: 'recovery', label: 'Runtime recovery', detail: 'A failed lazy section produces a readable recovery screen without deleting browser-local study data.' },
  { id: 'media', label: 'Media behavior', detail: 'Local and verified-remote Hunterpedia media retain provenance, while unavailable media collapses cleanly.' },
  { id: 'layout', label: 'Visual regression', detail: 'Maintained routes are checked for runtime errors, overflow, escaped content, broken media, undersized text, and narrow-width interaction defects.' },
  { id: 'accessibility', label: 'Accessible interaction', detail: 'Skip navigation, focus management, keyboard controls, named scroll regions, live announcements, reduced motion, and touch alternatives remain release requirements.' },
  { id: 'performance', label: 'Loading performance', detail: 'The startup shell, route chunks, stylesheet, and portrait library stay within explicit budgets.' },
  { id: 'links', label: 'Outbound-link safety', detail: 'New-tab links declare a safe relationship and factual research stays within the Hunterpedia/Fandom source policy.' },
  { id: 'deployment', label: 'Cloudflare deployment', detail: 'The validated build contains the Worker entry and ASSETS tree, excludes retired packaging artifacts, and is not considered released until Cloudflare reaches terminal success.' },
];

export const releaseBoundaries = [
  ['Manga boundary', `The maintained numbered catalogue ends at Chapter ${ARCHIVE_BOUNDARY}.`],
  ['Evidence boundary', 'Hunterpedia/Fandom is the factual and image-source boundary; analysis remains labeled as analysis.'],
  ['Research boundary', 'Catalogue coverage and chapter-specific research depth remain separate, visible claims.'],
  ['State boundary', 'Personal notes, bookmarks, progress, and release marks remain in the reader’s browser unless exported.'],
  ['Hosting boundary', 'Cloudflare Workers serves the application and administrator API; GitHub remains the canonical content store.'],
];

export const releaseStats = {
  routes: routeManifestStats.screens,
  successionRoutes: routeManifestStats.succession,
  referenceRoutes: routeManifestStats.reference,
  gates: releaseGates.length,
  chapterBoundary: ARCHIVE_BOUNDARY,
};
