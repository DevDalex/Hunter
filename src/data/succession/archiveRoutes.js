const route = (id, path, label, group, title, description, status = 'active') => Object.freeze({
  id,
  path,
  label,
  group,
  title,
  description,
  status,
});

const hubTab = (target, label, routes = [target], params = {}) => Object.freeze({
  target,
  label,
  routes: Object.freeze([...routes]),
  params: Object.freeze({ ...params }),
});

const hub = (id, target, label, group, title, description, tabs = []) => Object.freeze({
  id,
  target,
  label,
  group,
  title,
  description,
  tabs: Object.freeze([...tabs]),
});

export const successionArchiveRoutes = Object.freeze([
  route('archive', '', 'Archive Home', 'Overview', 'Succession Contest Archive', 'The completed chapter-bounded research application connecting people, institutions, Nen systems, story intelligence, search, vocabulary, chronology, evidence, assignments, relationships, and location state.', 'active'),
  route('story', 'story', 'Story', 'Overview', 'Chapter and story intelligence', 'The authoritative narrative route: contiguous phases, seven parallel story lanes, causal event links, unresolved threads, current pressure, and pending research gaps at the selected chapter.', 'active'),
  route('timeline', 'timeline', 'Timeline', 'Overview', 'Voyage timeline', 'Chapter-bounded events and movements presented in chronological order.', 'active'),
  route('reader', 'reader', 'Reader', 'Overview', 'Manga reader', 'The chapter image reader, kept separate from research and reference material.', 'active'),
  route('search', 'search', 'Global Search', 'Overview', 'Search the complete archive', 'Grouped, explained, chapter-safe search across canonical entities, aliases, mechanics, conditions, operational states, Story Intelligence, and glossary vocabulary.', 'active'),

  route('characters', 'characters', 'Characters', 'People', 'Character archive', 'The authoritative people route: every named character resolves a chapter-bounded dossier, including Hunter roles, life state, body state, affiliations, assignments, abilities, relationships, and supporting graph-derived context.', 'active'),
  route('princes', 'princes', 'Royal Family', 'People', 'Kakin Royal Family', 'King Nasubi, the eight queens, all fourteen princes, and each selected prince’s documented protection circle in one visual workspace.', 'active'),
  route('queens', 'queens', 'Queens', 'Legacy', 'Queens of Kakin', 'Legacy deep link retained for existing bookmarks; queen records now belong to the unified Royal Family workspace.', 'active'),
  route('bodyguards', 'bodyguards', 'Assignments', 'People', 'Assignments and reporting chains', 'Canonical protection, surveillance, instruction, custody, infiltration, assassination, allegiance, reporting, transfer, and chapter-snapshot records.', 'active'),

  route('organizations', 'organizations', 'Organizations', 'Power', 'Organizations and power structures', 'The single authoritative institution route for mafia families, military and Justice bodies, royal houses, political institutions, expedition groups, and every other canonical organization. Compare authority, hierarchy, leadership, personnel, territory, objectives, pressure, assignments, relationships, events, and evidence in one chapter-bounded workspace.', 'active'),

  route('black-whale', 'black-whale', 'Black Whale', 'World', 'Black Whale 1', 'The ship atlas, room lookup, and tier orientation inside the dedicated archive shell.', 'active'),
  route('locations', 'locations', 'Locations', 'World', 'Location archive', 'Ship hierarchy, royal rooms, access, occupants, incidents, legal routes, criminal passages, and Nen-mediated movement.', 'active'),

  route('nen', 'nen', 'Nen', 'Systems', 'Nen and ritual systems', 'The authoritative systems route for abilities, activation, restrictions, costs, contracts, curses, possession, instruction, post-mortem Nen, Contagion, and the Seed Urn ritual at a selected chapter.', 'active'),
  route('guardian-spirit-beasts', 'guardian-spirit-beasts', 'Guardian Spirit Beasts', 'Systems', 'Guardian Spirit Beast dossiers', 'All fifteen royal beasts tracked through chapter-bounded knowledge, host state, demonstrated and suspected abilities, ritual rules, continuation, destruction, and unresolved mechanics.', 'active'),

  route('events', 'events', 'Events', 'Records', 'Event archive', 'Operations organized by chapter range, participants, location, causes, consequences, and chapter-bounded knowledge state.', 'active'),
  route('relationships', 'relationships', 'Relationships', 'Records', 'Relationship archive', 'Typed family, professional, protective, political, allied, deceptive, command, and hostile links.', 'active'),
  route('chapters', 'chapter-records', 'Chapters', 'Records', 'Canonical chapter dossiers', 'Every Chapter 340 through the current published research boundary is placed inside its story phase, active lanes, events, causal links, state changes, unresolved threads, evidence, and reader bridge. Manga page images use a separate imported-media boundary and do not limit chapter research visibility.', 'active'),

  route('research', 'research', 'Research', 'Library', 'Research desk', 'Sources, provenance, evidence types, confidence, coverage, unresolved claims, media provenance, and explicit research gaps.', 'active'),
  route('glossary', 'glossary', 'Glossary', 'Library', 'Canonical Succession glossary', 'Chapter-bounded definitions, synonyms, certainty, canonical graph connections, and evidence for ritual, Nen, legal, political, location, status, and archive vocabulary.', 'active'),
]);

export const successionArchiveHubs = Object.freeze([
  hub(
    'story',
    'story',
    'Story Intelligence',
    'Operations',
    'Story Intelligence',
    'A unified narrative command center for story phases, canonical chapter dossiers, voyage chronology, and causal event records.',
    [
      hubTab('story', 'Story'),
      hubTab('chapters', 'Chapters'),
      hubTab('timeline', 'Timeline'),
      hubTab('events', 'Events'),
    ],
  ),
  hub(
    'people',
    'characters',
    'People & Power',
    'Operations',
    'People & Power',
    'Characters, the Kakin Royal Family, operational assignments, organizations, and relationship intelligence in one connected workspace.',
    [
      hubTab('characters', 'Characters'),
      hubTab('princes', 'Royal Family', ['princes', 'queens'], { view: 'tree' }),
      hubTab('bodyguards', 'Assignments'),
      hubTab('organizations', 'Organizations'),
      hubTab('relationships', 'Relationships'),
    ],
  ),
  hub(
    'black-whale',
    'black-whale',
    'Black Whale',
    'Operations',
    'Black Whale',
    'The vessel atlas and canonical location registry combined into one spatial intelligence workspace.',
    [
      hubTab('black-whale', 'Ship Atlas'),
      hubTab('locations', 'Locations'),
    ],
  ),
  hub(
    'nen',
    'nen',
    'Nen Systems',
    'Operations',
    'Nen Systems',
    'Succession abilities, ritual rules, contracts, curses, possession, and Guardian Spirit Beast dossiers in one systems workspace.',
    [
      hubTab('nen', 'Nen & Rituals'),
      hubTab('guardian-spirit-beasts', 'Guardian Spirit Beasts'),
    ],
  ),
  hub('search', 'search', 'Search', 'Library', 'Search the complete archive', 'Grouped, explained, chapter-safe search across every maintained Succession record.'),
  hub('research', 'research', 'Research', 'Library', 'Research desk', 'Sources, provenance, confidence, coverage, media records, and explicit research gaps.'),
  hub('glossary', 'glossary', 'Glossary', 'Library', 'Canonical Succession glossary', 'Chapter-bounded definitions, synonyms, certainty, graph connections, and evidence.'),
]);

export const successionArchiveHubGroups = Object.freeze(['Operations', 'Library']);
export const successionArchiveHubByRoute = new Map();
for (const currentHub of successionArchiveHubs) {
  successionArchiveHubByRoute.set(currentHub.target, currentHub);
  for (const tab of currentHub.tabs) for (const routeId of tab.routes) successionArchiveHubByRoute.set(routeId, currentHub);
}
successionArchiveHubByRoute.set('archive', successionArchiveHubs[0]);
successionArchiveHubByRoute.set('reader', successionArchiveHubs[0]);

export const getSuccessionArchiveHub = (routeId = 'story') => successionArchiveHubByRoute.get(routeId) || successionArchiveHubs[0];

export const successionArchiveRetiredTargets = Object.freeze({
  hunters: 'characters',
  deaths: 'characters',
  mafia: 'organizations',
  military: 'organizations',
  politics: 'organizations',
  justice: 'organizations',
  'power-blocs': 'organizations',
  media: 'research',
});

export const successionArchiveGroups = Object.freeze(['Overview', 'People', 'Power', 'World', 'Systems', 'Records', 'Library']);
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
  'family-tree': 'princes',
  'royal-family': 'princes',
  'succession-roster': 'characters',
  'succession-timeline': 'timeline',
  beasts: 'guardian-spirit-beasts',
  'black-whale': 'black-whale',
  ...successionArchiveRetiredTargets,
});

export const getSuccessionArchiveRoute = (id = 'archive') => successionArchiveRouteById.get(id) || successionArchiveRouteById.get('archive');