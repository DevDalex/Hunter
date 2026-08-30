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

export const viewIds = ['succession'];
export const views = new Set(viewIds);
export const seriesRoutes = [];

export const successionPages = [
  {
    id: 'succession-timeline', label: 'Timeline', kicker: 'What happened and when', title: 'Succession Timeline',
    description: `Chronology, chapters, events, movements, Black Whale context, and causal story threads through Chapter ${ARCHIVE_BOUNDARY}.`,
  },
  {
    id: 'succession-roster', label: 'Characters', kicker: 'Who is doing what', title: 'Succession Characters',
    description: `Royalty, guards, Hunters, mafia, the Troupe, assignments, relationships, status, and knowledge through Chapter ${ARCHIVE_BOUNDARY}.`,
  },
  {
    id: 'nen-classes', label: 'Nen', kicker: 'How the systems work', title: 'Succession Nen',
    description: 'Abilities, Guardian Spirit Beasts, ritual rules, conditions, costs, curses, possession, instruction, Contagion, and unresolved mechanics.',
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
  'family-tree': 'characters',
  beasts: 'nen',
  organizations: 'characters',
};

export const dossierTabRoutes = {
  overview: 'timeline',
  royal: 'characters',
  assignments: 'characters',
  threads: 'characters',
  relationships: 'characters',
  mafia: 'characters',
  justice: 'characters',
  organizations: 'characters',
  beasts: 'nen',
  abilities: 'nen',
  rules: 'nen',
  status: 'timeline',
  objects: 'timeline',
  chapters: 'timeline',
  mysteries: 'timeline',
  links: 'timeline',
  sources: 'timeline',
};

export const referencePages = [];
export const referencePrimary = [];
export const referenceAliases = Object.freeze({});

export const successionReleaseRouteIds = Object.freeze(releasedSuccessionRoutes.map((route) => route.id));
export const successionReleaseRoutes = releasedSuccessionRoutes;

export const routeManifest = Object.freeze(
  releasedSuccessionRoutes.map((route) => ({ view: 'succession', target: route.id, label: route.title })),
);

export const routeManifestStats = Object.freeze({
  screens: routeManifest.length,
  succession: canonicalSuccessionRoutes.length,
  successionReleaseScreens: releasedSuccessionRoutes.length,
  reference: 0,
  series: 0,
  aliases: Object.keys(legacyRouteRedirects).length,
});
