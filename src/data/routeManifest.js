import { ARCHIVE_BOUNDARY } from './archiveMeta.js';
import {
  successionArchiveRetiredTargets,
  successionArchiveRoutes,
} from './succession/archiveRoutes.js';

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

export const viewIds = ['succession', 'reference'];
export const views = new Set(viewIds);

// Kept as an empty compatibility export while retired full-series modules are removed.
export const seriesRoutes = [];

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

const retiredSuccessionAliases = Object.fromEntries(
  Object.entries(successionArchiveRetiredTargets).map(([target, destination]) => [target, { target: destination }]),
);

export const successionAliases = {
  'deep-dossier': { target: 'princes' },
  princes: { target: 'princes' },
  'family-tree': { target: 'princes' },
  'royal-family': { target: 'princes' },
  'connection-board': { target: 'relationships' },
  'succession-roster': { target: 'characters' },
  'succession-timeline': { target: 'timeline' },
  'nen-classes': { target: 'nen' },
  beasts: { target: 'guardian-spirit-beasts' },
  ...retiredSuccessionAliases,
  mysteries: { target: 'chapters' },
  'succession-sources': { target: 'research' },
  overview: { target: 'archive' },
};

export const successionPageIds = new Set([
  ...successionPages.map((page) => page.id),
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
  {
    id: 'atlas', label: 'World & places', kicker: 'Story geography', title: 'World and location atlas',
    description: 'Explore the Known World, major story routes, the Black Whale voyage, and nested locations through the visual atlas.',
  },
];

export const referencePrimary = referencePages.map((page) => page.id);

export const referenceAliases = {
  nen: { target: 'nen' },
  world: { target: 'atlas' },
  atlas: { target: 'atlas' },
  locations: { target: 'atlas' },
  'research-library': { target: 'atlas' },
  'study-layers': { target: 'atlas' },
};

export const successionReleaseRouteIds = Object.freeze([
  'story', 'chapters', 'events', 'timeline', 'characters', 'princes', 'queens',
  'bodyguards', 'organizations', 'relationships', 'locations', 'black-whale',
  'nen', 'guardian-spirit-beasts', 'research',
]);

export const successionReleaseRoutes = successionReleaseRouteIds
  .map((id) => successionArchiveRoutes.find((route) => route.id === id))
  .filter(Boolean);

export const routeManifest = [
  { view: 'succession', target: 'archive', label: 'Succession Contest Archive' },
  ...successionReleaseRoutes.map((route) => ({ view: 'succession', target: route.id, label: route.title })),
  ...referencePages.map((route) => ({ view: 'reference', target: route.id, label: route.title })),
];

export const routeManifestStats = {
  screens: routeManifest.length,
  succession: successionArchiveRoutes.length,
  successionReleaseScreens: successionReleaseRoutes.length + 1,
  reference: referencePages.length,
  aliases: Object.keys(referenceAliases).length + Object.keys(successionAliases).length,
};
