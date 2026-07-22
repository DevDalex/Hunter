import { ARCHIVE_BOUNDARY } from './archiveMeta.js';

export const viewIds = ['home', 'series', 'succession', 'reference', 'timeline'];
export const views = new Set(viewIds);

export const seriesRoutes = [
  { id: 'arcs', target: '', label: 'Story hub' },
  { id: 'volume-0', target: 'volume-0', label: 'Volume 0 · Kurapika’s Memories' },
  { id: 'hunter-exam', target: 'hunter-exam', label: 'Hunter Exam' },
  { id: 'zoldyck-family', target: 'zoldyck-family', label: 'Zoldyck Family' },
  { id: 'heavens-arena', target: 'heavens-arena', label: 'Heavens Arena' },
  { id: 'yorknew-city', target: 'yorknew-city', label: 'Yorknew City' },
  { id: 'greed-island', target: 'greed-island', label: 'Greed Island' },
  { id: 'chimera-ant', target: 'chimera-ant', label: 'Chimera Ant' },
  { id: 'chairman-election', target: 'chairman-election', label: 'Chairman Election' },
  { id: 'succession-contest', target: 'succession-contest', label: 'Succession Contest' },
  { id: 'chronology', target: 'chronology', label: 'Complete chronology' },
  { id: 'chapters', target: 'chapters', label: 'Chapter directory' },
  { id: 'adaptation', target: 'adaptation', label: '2011 anime guide' },
];

export const successionPages = [
  {
    id: 'overview', label: 'Arc overview', kicker: 'The current story', title: 'Succession Contest',
    description: 'The dedicated Succession Contest arc page, with royal, cast, ship, Nen, power-bloc, chapter-reader, and record pages preserved beneath it. Its voyage chronology opens in the global Timeline.',
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
    id: 'chapters', label: 'Records', kicker: 'Chapters and changing states', title: 'Chapters, deaths and mysteries',
    description: `Current-arc chapter records, deaths, possession and body states, consequential objects, and unresolved questions through Chapter ${ARCHIVE_BOUNDARY}.`,
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
    id: 'mafia', label: 'Power blocs', kicker: 'Organizations and operations', title: 'Mafia, Justice and operations',
    description: 'Xi-Yu, Cha-R, Heil-Ly, the Phantom Troupe, military authority, investigations, assassinations, escapes, and political relationships.',
  },
];

export const successionPrimary = successionPages.map((page) => page.id);
export const legacyDossierPage = successionPages[0];

export const successionAliases = {
  'deep-dossier': { target: 'family-tree', panel: 'princes' },
  princes: { target: 'family-tree', panel: 'princes' },
  'connection-board': { target: 'succession-roster', panel: 'relationships' },
  'nen-classes': { target: 'beasts', panel: 'classes' },
  justice: { target: 'mafia', panel: 'justice' },
  deaths: { target: 'chapters', panel: 'deaths' },
  mysteries: { target: 'chapters', panel: 'mysteries' },
  'succession-sources': { target: 'overview' },
};

export const successionPageIds = new Set([
  ...successionPages.map((page) => page.id),
  ...Object.keys(successionAliases),
]);

export const successionDossierTabs = {
  'family-tree': 'royal',
  beasts: 'beasts',
  mafia: 'mafia',
  chapters: 'chapters',
};

export const dossierTabRoutes = {
  overview: 'overview', royal: 'family-tree', assignments: 'succession-roster', threads: 'succession-roster',
  beasts: 'beasts', abilities: 'beasts', rules: 'beasts', mafia: 'mafia', justice: 'mafia',
  relationships: 'mafia', operations: 'mafia', status: 'chapters', objects: 'chapters',
  chapters: 'chapters', mysteries: 'chapters', links: 'chapters', sources: 'overview',
};

export const referencePages = [
  {
    id: 'encyclopedia', label: 'Characters', kicker: 'People and connected records', title: 'Character encyclopedia',
    description: 'Browse the complete character index, then follow status, affiliations, relationships, abilities, locations, conflicts, and related records.',
  },
  {
    id: 'nen', label: 'Nen & abilities', kicker: 'Power system', title: 'Nen and ability encyclopedia',
    description: 'Learn the system from aura fundamentals through advanced techniques, six categories, vows, curses, Nen beasts, and named abilities.',
  },
  {
    id: 'atlas', label: 'World & places', kicker: 'Story geography', title: 'World and location atlas',
    description: 'Explore the Known World on an interactive geographic map, trace curated story and Succession routes, then connect places to their people, factions, events, and nested records.',
  },
  {
    id: 'systems', label: 'Organizations', kicker: 'Authority, membership and operations', title: 'Organizations and institutions',
    description: 'Explore institutions, factions, members, sponsorship, typed relationships, territory, and operations in one stable workspace.',
  },
  {
    id: 'conflicts', label: 'Fights', kicker: 'Battles, games and operations', title: 'Fights and conflicts',
    description: 'Browse battles, assassinations, pursuits, operations, games, negotiations, objectives, participants, abilities, turning points, results, and consequences.',
  },
];

export const referencePrimary = referencePages.map((page) => page.id);

export const referenceAliases = {
  '': { target: 'encyclopedia' },
  characters: { target: 'encyclopedia', category: 'characters' },
  people: { target: 'encyclopedia', category: 'characters' },
  world: { target: 'atlas' },
  locations: { target: 'atlas' },
  factions: { target: 'systems', view: 'factions' },
  mafia: { target: 'systems', view: 'factions' },
  institutions: { target: 'systems', view: 'institutions' },
  relationships: { target: 'systems', view: 'relations' },
  operations: { target: 'systems', view: 'operations' },
  objects: { target: 'encyclopedia', category: 'objects' },
  'hisoka-chrollo': { target: 'conflicts', case: 'hisoka-chrollo' },
  'research-library': { target: 'atlas' },
  'study-layers': { target: 'atlas' },
  directory: { target: 'encyclopedia' },
  hunterpedia: { target: 'encyclopedia' },
  sources: { target: 'encyclopedia' },
};

export const routeManifest = [
  { view: 'home', target: '', label: 'Hunter Archive home' },
  { view: 'timeline', target: '', label: 'Global timeline' },
  ...seriesRoutes.map((route) => ({ view: 'series', target: route.target, label: route.label })),
  ...successionPages.filter((route) => route.id !== 'overview').map((route) => ({ view: 'succession', target: route.id, label: route.title })),
  ...referencePages.map((route) => ({ view: 'reference', target: route.id, label: route.title })),
];

export const routeManifestStats = {
  screens: routeManifest.length,
  timeline: 1,
  succession: successionPages.length - 1,
  reference: referencePages.length,
  aliases: Object.keys(referenceAliases).length + Object.keys(successionAliases).length,
};
