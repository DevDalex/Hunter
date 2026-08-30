const route = (id, path, label, group, title, description, status = 'active') => Object.freeze({
  id, path, label, group, title, description, status,
});

const hubTab = (target, label, routes = [target], params = {}) => Object.freeze({
  target,
  label,
  routes: Object.freeze([...routes]),
  params: Object.freeze({ ...params }),
});

const hub = (id, target, label, group, title, description, tabs = []) => Object.freeze({
  id, target, label, group, title, description, tabs: Object.freeze([...tabs]),
});

export const successionArchiveRoutes = Object.freeze([
  route('archive', '', 'Home', 'Core', 'Succession Contest', 'A minimal entrance to the three maintained Succession Contest systems: Timeline, Characters, and Nen.'),
  route('timeline', 'timeline', 'Timeline', 'Core', 'Succession Timeline', 'Chronology, chapters, events, threads, locations, Black Whale movement, causal context, and story state.'),
  route('characters', 'characters', 'Characters', 'Core', 'Succession Characters', 'Royalty, guards, Hunters, mafia, the Troupe, affiliations, assignments, relationships, status, knowledge, and movement.'),
  route('nen', 'nen', 'Nen', 'Core', 'Succession Nen', 'Abilities, Guardian Spirit Beasts, ritual mechanics, curses, conditions, costs, possession, instruction, Contagion, and unresolved systems.'),
]);

export const successionArchiveHubs = Object.freeze([
  hub('timeline', 'timeline', 'Timeline', 'Core', 'Timeline', 'Story, chapter, event, location, and movement intelligence.', [hubTab('timeline', 'Timeline')]),
  hub('characters', 'characters', 'Characters', 'Core', 'Characters', 'People, affiliations, relationships, assignments, and royal-family intelligence.', [hubTab('characters', 'Characters')]),
  hub('nen', 'nen', 'Nen', 'Core', 'Nen', 'Abilities, Guardian Spirit Beasts, ritual systems, conditions, curses, and unknown mechanics.', [hubTab('nen', 'Nen')]),
]);

export const successionArchiveHubGroups = Object.freeze(['Core']);
export const successionArchiveHubByRoute = new Map();
for (const currentHub of successionArchiveHubs) {
  successionArchiveHubByRoute.set(currentHub.target, currentHub);
  for (const tab of currentHub.tabs) for (const routeId of tab.routes) successionArchiveHubByRoute.set(routeId, currentHub);
}
successionArchiveHubByRoute.set('archive', successionArchiveHubs[0]);

export const getSuccessionArchiveHub = (routeId = 'timeline') => successionArchiveHubByRoute.get(routeId) || successionArchiveHubs[0];

export const successionArchiveRetiredTargets = Object.freeze({
  story: 'timeline',
  search: 'timeline',
  events: 'timeline',
  chapters: 'timeline',
  reader: 'timeline',
  'black-whale': 'timeline',
  locations: 'timeline',
  research: 'timeline',
  glossary: 'timeline',
  princes: 'characters',
  queens: 'characters',
  bodyguards: 'characters',
  organizations: 'characters',
  relationships: 'characters',
  hunters: 'characters',
  deaths: 'characters',
  mafia: 'characters',
  military: 'characters',
  politics: 'characters',
  justice: 'characters',
  'power-blocs': 'characters',
  'guardian-spirit-beasts': 'nen',
  beasts: 'nen',
  media: 'timeline',
});

export const successionArchiveGroups = Object.freeze(['Core']);
export const successionArchiveRouteIds = new Set(successionArchiveRoutes.map((item) => item.id));
export const successionArchivePrimary = successionArchiveRoutes.map((item) => item.id);
export const successionArchiveRouteById = new Map(successionArchiveRoutes.map((item) => [item.id, item]));
export const successionArchivePathToTarget = new Map([
  ...successionArchiveRoutes.map((item) => [item.path, item.id]),
  ...Object.entries(successionArchiveRetiredTargets),
]);
export const successionArchiveTargetToPath = new Map(successionArchiveRoutes.map((item) => [item.id, item.path]));

export const successionArchiveLegacyTargets = Object.freeze({
  overview: 'archive',
  'family-tree': 'characters',
  'royal-family': 'characters',
  'succession-roster': 'characters',
  'succession-timeline': 'timeline',
  'connection-board': 'characters',
  'nen-classes': 'nen',
  ...successionArchiveRetiredTargets,
});

export const getSuccessionArchiveRoute = (id = 'archive') => successionArchiveRouteById.get(id)
  || successionArchiveRouteById.get(successionArchiveRetiredTargets[id])
  || successionArchiveRouteById.get('archive');
