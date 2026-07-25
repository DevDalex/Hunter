const route = (id, path, label, group, title, description, status = 'foundation') => Object.freeze({
  id,
  path,
  label,
  group,
  title,
  description,
  status,
});

export const successionArchiveRoutes = Object.freeze([
  route('archive', '', 'Archive Home', 'Overview', 'Succession Contest Archive', 'The completed chapter-bounded research application connecting people, institutions, Nen systems, story intelligence, search, vocabulary, media, chronology, evidence, assignments, relationships, and location state.', 'active'),
  route('story', 'story', 'Story', 'Overview', 'Chapter and story intelligence', 'The authoritative narrative route: contiguous phases, seven parallel story lanes, causal event links, unresolved threads, current pressure, and pending research gaps at the selected chapter.', 'active'),
  route('timeline', 'timeline', 'Timeline', 'Overview', 'Voyage timeline', 'Chapter-bounded events and movements presented in chronological order.', 'active'),
  route('reader', 'reader', 'Reader', 'Overview', 'Manga reader', 'The chapter image reader, kept separate from research and reference material.', 'active'),
  route('search', 'search', 'Global Search', 'Overview', 'Search the complete archive', 'Grouped, explained, chapter-safe search across canonical entities, aliases, mechanics, conditions, operational states, Story Intelligence, and glossary vocabulary.', 'active'),

  route('characters', 'characters', 'Characters', 'People', 'Character archive', 'The authoritative people route: every named character resolves a chapter-bounded dossier, priority actors have explicit state profiles, and supporting actors use identified graph-derived fallbacks.', 'active'),
  route('princes', 'princes', 'Royal Family', 'People', 'Kakin Royal Family', 'King Nasubi, the eight queens, all fourteen princes, and each selected prince’s documented protection circle in one visual workspace.', 'active'),
  route('queens', 'queens', 'Queens', 'Legacy', 'Queens of Kakin', 'Legacy deep link retained for existing bookmarks; queen records now belong to the unified Royal Family workspace.', 'active'),
  route('bodyguards', 'bodyguards', 'Assignments', 'People', 'Assignments and reporting chains', 'Canonical protection, surveillance, instruction, custody, infiltration, assassination, allegiance, reporting, transfer, and chapter-snapshot records.', 'active'),
  route('hunters', 'hunters', 'Hunters', 'People', 'Hunters aboard the voyage', 'Hunter contracts, Zodiac duties, Nen instruction, prince assignments, and expedition responsibilities linked to authoritative character dossiers.', 'active'),

  route('mafia', 'mafia', 'Mafia', 'Power', 'Kakin mafia', 'Xi-Yu, Heil-Ly, and Cha-R compared through leadership, territory, members, royal sponsorship, objectives, risks, and operations.', 'active'),
  route('military', 'military', 'Military', 'Power', 'Military and Justice authority', 'Chapter-bounded command hierarchy, custody, legal procedure, investigations, personnel, active operations, and special martial law.', 'active'),
  route('organizations', 'organizations', 'Organizations', 'Power', 'Institution dossiers', 'The authoritative institution route: every canonical organization has explicit chapter-bounded authority, hierarchy, leadership, personnel transitions, territory, objectives, pressure, assignments, relationships, events, and evidence.', 'active'),
  route('politics', 'politics', 'Politics', 'Power', 'Political archive', 'Canonical royal actors and typed family, sponsorship, alliance, treaty, succession-interest, and authority relationships.', 'active'),

  route('black-whale', 'black-whale', 'Black Whale', 'World', 'Black Whale 1', 'The ship atlas, room lookup, and tier orientation inside the dedicated archive shell.', 'active'),
  route('locations', 'locations', 'Locations', 'World', 'Location archive', 'Ship hierarchy, royal rooms, access, occupants, incidents, legal routes, criminal passages, and Nen-mediated movement.', 'active'),

  route('nen', 'nen', 'Nen', 'Systems', 'Nen and ritual systems', 'The authoritative systems route for abilities, activation, restrictions, costs, contracts, curses, possession, instruction, post-mortem Nen, Contagion, and the Seed Urn ritual at a selected chapter.', 'active'),
  route('guardian-spirit-beasts', 'guardian-spirit-beasts', 'Guardian Spirit Beasts', 'Systems', 'Guardian Spirit Beast dossiers', 'All fifteen royal beasts tracked through chapter-bounded knowledge, host state, demonstrated and suspected abilities, ritual rules, continuation, destruction, and unresolved mechanics.', 'active'),

  route('events', 'events', 'Events', 'Records', 'Event archive', 'Operations organized by chapter range, participants, location, causes, consequences, and chapter-bounded knowledge state.', 'active'),
  route('deaths', 'deaths', 'Deaths', 'Records', 'Deaths and body states', 'Confirmed deaths and exceptional body, consciousness, possession, custody, and Nen-continuation states.', 'active'),
  route('relationships', 'relationships', 'Relationships', 'Records', 'Relationship archive', 'Typed family, professional, protective, political, allied, deceptive, command, and hostile links.', 'active'),
  route('chapters', 'chapter-records', 'Chapters', 'Records', 'Canonical chapter dossiers', 'Every Chapter 340 through the latest imported reader release placed inside its story phase, active lanes, events, causal links, state changes, unresolved threads, evidence, and reader bridge.', 'active'),

  route('research', 'research', 'Research', 'Library', 'Research desk', 'Sources, provenance, evidence types, confidence, coverage, unresolved claims, and explicit research gaps.', 'active'),
  route('glossary', 'glossary', 'Glossary', 'Library', 'Canonical Succession glossary', 'Chapter-bounded definitions, synonyms, certainty, canonical graph connections, and evidence for ritual, Nen, legal, political, location, status, and archive vocabulary.', 'active'),
  route('media', 'media', 'Media', 'Library', 'Media provenance archive', 'Consolidated maintained portraits and Guardian Spirit Beast visuals with canonical subjects, alt text, availability, source records, provenance, and verification dates.', 'active'),
]);

export const successionArchiveGroups = Object.freeze(['Overview', 'People', 'Power', 'World', 'Systems', 'Records', 'Library']);
export const successionArchiveRouteIds = new Set(successionArchiveRoutes.map((item) => item.id));
export const successionArchivePrimary = successionArchiveRoutes.map((item) => item.id);
export const successionArchiveRouteById = new Map(successionArchiveRoutes.map((item) => [item.id, item]));
export const successionArchivePathToTarget = new Map(successionArchiveRoutes.map((item) => [item.path, item.id]));
export const successionArchiveTargetToPath = new Map(successionArchiveRoutes.map((item) => [item.id, item.path]));

export const successionArchiveLegacyTargets = Object.freeze({
  overview: 'archive',
  'family-tree': 'princes',
  'royal-family': 'princes',
  'succession-roster': 'characters',
  'succession-timeline': 'timeline',
  beasts: 'guardian-spirit-beasts',
  mafia: 'mafia',
  'black-whale': 'black-whale',
});

export const getSuccessionArchiveRoute = (id = 'archive') => successionArchiveRouteById.get(id) || successionArchiveRouteById.get('archive');
