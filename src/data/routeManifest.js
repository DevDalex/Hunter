import { ARCHIVE_BOUNDARY } from './archiveMeta.js';
import {
  canonicalSuccessionRoutes,
  legacyRouteRedirects,
  releasedSuccessionRoutes,
} from './routeRegistry.js';

export {
  getSuccessionArchiveRoute,
  successionArchiveGroups,
  successionArchiveLegacyTargets,
  successionArchivePathToTarget,
  successionArchivePrimary,
  successionArchiveRetiredTargets,
  successionArchiveRouteById,
  successionArchiveRouteIds,
  successionArchiveRoutes,
  successionArchiveTargetToPath,
} from './succession/archiveRoutes.js';

export {
  canonicalSuccessionRouteById,
  canonicalSuccessionRoutes,
  legacyRouteRedirects,
  releasedSuccessionRoutes,
  resolveSuccessionRoute,
  searchableSuccessionRoutes,
  sitemapSuccessionRoutes,
} from './routeRegistry.js';

export const viewIds = ['succession', 'reference', 'series'];
export const views = new Set(viewIds);
export const seriesRoutes = ['chapters'];

// Compatibility metadata for older navigation consumers. Canonical route behavior,
// release status, aliases, and sitemap/search policy live in routeRegistry.js.
export const successionPages = [
  {
    id: 'overview', label: 'Arc overview', kicker: 'The current story', title: 'Succession Contest',
    description: 'Legacy entry point retained as an alias to the dedicated Succession Contest Archive.',
  },
  {
    id: 'family-tree', label: 'Royal family', kicker: 'King, queens and princes', title: 'The Kakin royal family',
    description: 'A connected family tree with maternal branches, portraits, succession order, households, unusual body states, and prince dossiers.',
  },
  {
    id: 'succession-roster', label: 'Cast & assignments', kicker: 'People and loyalties', title: 'Cast, guards and assignments',
    description: `Royalty, guards, servants, Hunters, soldiers, mafia, Justice, the Troupe, and expedition personnel indexed through Chapter ${ARCHIVE_BOUNDARY}.`,
  },
  {
    id: 'chapters', label: 'Records', kicker: 'Chapters and changing states', title: 'Chapters, character states and mysteries',
    description: `Current-arc chapter records, character life and body states, possession, consequential objects, and unresolved questions through Chapter ${ARCHIVE_BOUNDARY}.`,
  },
  {
    id: 'black-whale', label: 'Black Whale', kicker: 'Interactive ship atlas', title: 'Inside Black Whale 1',
    description: 'Explore the canonical cross-section through clickable locations, tier and room inspectors, access rules, occupants, and movement routes.',
  },
  {
    id: 'beasts', label: 'Nen & beasts', kicker: 'Power inside the contest', title: 'Nen, Spirit Beasts and lessons',
    description: 'Guardian Spirit Beasts, Succession-specific abilities, Kurapika’s classes, ritual rules, conditions, costs, and unknown mechanics.',
  },
  {
    id: 'organizations', label: 'Organizations', kicker: 'Power structures and operations', title: 'Organizations and institutions',
    description: 'Mafia families, Justice, military authority, royal houses, political institutions, expedition groups, investigations, operations, and institutional relationships.',
  },
];

export const successionPrimary = successionPages.map((page) => page.id);
export const legacyDossierPage = successionPages[0];

export const successionAliases = Object.freeze(
  Object.fromEntries(Object.entries(legacyRouteRedirects).map(([alias, target]) => [alias, { target }])),
);

export const successionPageIds = new Set([
  ...canonicalSuccessionRoutes.map((route) => route.id),
  ...Object.keys(successionAliases),
]);

export const successionDossierTabs = {
  'family-tree': 'royal',
  beasts: 'beasts',
  organizations: 'organizations',
  mafia: 'organizations',
  chapters: 'chapters',
};

export const dossierTabRoutes = {
  overview: 'archive', royal: 'princes', assignments: 'bodyguards', threads: 'relationships',
  beasts: 'guardian-spirit-beasts', abilities: 'nen', rules: 'nen', mafia: 'organizations',
  justice: 'organizations', relationships: 'relationships', operations: 'organizations',
  status: 'chapters', objects: 'chapters', chapters: 'chapters', mysteries: 'chapters',
  links: 'chapters', sources: 'research',
};

export const referencePages = [
  {
    id: 'nen', label: 'Nen & abilities', kicker: 'Power system', title: 'Nen and ability encyclopedia',
    description: 'Learn the system from aura fundamentals through advanced techniques, six categories, vows, curses, Nen beasts, and named abilities.',
  },
];

export const referencePrimary = referencePages.map((page) => page.id);
export const referenceAliases = Object.freeze({
  nen: { target: 'nen' },
});

export const successionReleaseRouteIds = Object.freeze(releasedSuccessionRoutes.map((route) => route.id));
export const successionReleaseRoutes = releasedSuccessionRoutes;

export const routeManifest = Object.freeze([
  ...releasedSuccessionRoutes.map((route) => ({ view: 'succession', target: route.id, label: route.title })),
  ...referencePages.map((route) => ({ view: 'reference', target: route.id, label: route.title })),
  { view: 'series', target: 'chapters', label: 'Pre-Succession chapter record' },
]);

export const routeManifestStats = Object.freeze({
  screens: routeManifest.length,
  succession: canonicalSuccessionRoutes.length,
  successionReleaseScreens: releasedSuccessionRoutes.length + 1,
  reference: referencePages.length,
  series: seriesRoutes.length,
  aliases: Object.keys(referenceAliases).length + Object.keys(legacyRouteRedirects).length,
});
