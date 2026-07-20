import { ARCHIVE_BOUNDARY } from './archiveMeta.js';
import {
  DOWNLOAD_RELEASE,
  DOWNLOAD_RELEASE_DATE,
  RELEASE_MANIFEST_PATH,
  SITES_SOURCE_PACKAGE_PATH,
  STANDALONE_PACKAGE_PATH,
} from './downloads.js';
import { routeManifestStats } from './routeManifest.js';

export const PHASE_6G_VERSION = 'Phase 6G · Final Phase 6 release';
export const PHASE_6G_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7A_VERSION = 'Phase 7A · Readability foundation';
export const PHASE_7A_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7B_VERSION = 'Phase 7B · Media stabilization';
export const PHASE_7B_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7C_VERSION = 'Phase 7C · Visual regression and layout stabilization';
export const PHASE_7C_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7D_VERSION = 'Phase 7D · Accessibility and interaction hardening';
export const PHASE_7D_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7E_VERSION = 'Phase 7E · Performance and loading hardening';
export const PHASE_7E_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7F_VERSION = 'Phase 7F · Visual and media polish';
export const PHASE_7F_RELEASE_DATE = 'July 15, 2026';
export const PHASE_7G_VERSION = 'Phase 7G · Final site-wide release audit';
export const PHASE_7G_RELEASE_DATE = 'July 15, 2026';
export const PHASE_8A_VERSION = DOWNLOAD_RELEASE;
export const PHASE_8A_RELEASE_DATE = DOWNLOAD_RELEASE_DATE;
export const CURRENT_RELEASE_VERSION = PHASE_8A_VERSION;
export const CURRENT_RELEASE_DATE = PHASE_8A_RELEASE_DATE;
export { RELEASE_MANIFEST_PATH, SITES_SOURCE_PACKAGE_PATH, STANDALONE_PACKAGE_PATH };

export const phaseSixSequence = [
  ['6A', 'Media integrity & readability'],
  ['6B', 'Unified character experience'],
  ['6C', 'World & location atlas'],
  ['6D', 'Power structures & evidence'],
  ['6E', 'Navigation, accessibility & loading'],
  ['6F', 'Implementation & maintenance handoff'],
  ['6G', 'Release hardening & portability'],
];

export const releaseGates = [
  { id: 'content', label: 'Content contract', detail: 'Chapter continuity, research-depth labels, sources, identities, statuses, timelines, media accounting, and Phase 6 systems remain build-blocking.' },
  { id: 'routes', label: 'Route contract', detail: `${routeManifestStats.screens} reader-facing screens resolve from one manifest with unique destinations, valid aliases, and maintained primary navigation.` },
  { id: 'storage', label: 'Private-state resilience', detail: 'Progress, bookmarks, notes, caches, spoiler limits, and inspection marks degrade safely when browser storage is blocked or full.' },
  { id: 'recovery', label: 'Runtime recovery', detail: 'A failed lazy section now produces a readable recovery screen without deleting browser-local study data.' },
  { id: 'media', label: 'Media behavior', detail: 'Priority portraits ship locally with dimensions, focal points, and direct Hunterpedia sources; runtime portrait discovery is disabled and unavailable media collapses cleanly.' },
  { id: 'layout', label: 'Visual regression', detail: `${routeManifestStats.screens} routes are rendered at desktop, tablet, and phone-width browser viewports and checked for runtime errors, page overflow, escaped content, broken or pending media, empty image frames, media-copy collisions, undersized text, and narrow-width interaction defects.` },
  { id: 'accessibility', label: 'Accessible interaction', detail: `${routeManifestStats.screens} routes are checked at desktop and phone-width browser viewports against WCAG 2.0/2.1 A and AA rules; skip navigation, search and drawer focus recovery, menu containment, roving tabs, named scroll regions, live announcements, reduced motion, written status, and touch alternatives remain release requirements.` },
  { id: 'performance', label: 'Loading performance', detail: 'The home entry, startup dependency closure, stylesheet, lazy-route count, and portrait library stay within explicit budgets; six representative routes also pass desktop and constrained-mobile readiness checks without layout shift or service-worker behavior.' },
  { id: 'links', label: 'Outbound-link safety', detail: 'New-tab links declare a safe relationship and factual research stays within the Hunterpedia/Fandom source policy.' },
  { id: 'portability', label: 'Two portable editions', detail: 'Every production build creates a Sites-ready maintainable source archive and a direct-open standalone website; neither contains credentials, repository history, or browser-local study data.' },
];

export const releaseBoundaries = [
  ['Manga boundary', `The maintained numbered catalogue ends at Chapter ${ARCHIVE_BOUNDARY}.`],
  ['Evidence boundary', 'Hunterpedia/Fandom is the factual and image-source boundary; analysis remains labeled as analysis.'],
  ['Research boundary', 'Catalogue coverage and chapter-specific research depth remain separate, visible claims.'],
  ['State boundary', 'Personal notes, bookmarks, progress, and release marks remain in the reader’s browser unless exported.'],
];

export const releaseStats = {
  phases: phaseSixSequence.length,
  routes: routeManifestStats.screens,
  successionRoutes: routeManifestStats.succession,
  referenceRoutes: routeManifestStats.reference,
  gates: releaseGates.length,
  chapterBoundary: ARCHIVE_BOUNDARY,
};
