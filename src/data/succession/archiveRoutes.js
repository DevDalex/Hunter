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
  route('archive', '', 'Archive Home', 'Overview', 'Succession Contest Archive', 'A dedicated research application for the voyage, its people, institutions, chronology, evidence, and chapter-bounded state.', 'active'),
  route('story', 'story', 'Story', 'Overview', 'Story workspace', 'The arc mapped through its chronological phases, parallel conflicts, active operations, ritual rules, and power blocs.', 'active'),
  route('timeline', 'timeline', 'Timeline', 'Overview', 'Voyage timeline', 'Chapter-bounded events and movements presented in chronological order.', 'active'),
  route('reader', 'reader', 'Reader', 'Overview', 'Manga reader', 'The chapter image reader, kept separate from research and reference material.', 'active'),
  route('search', 'search', 'Global Search', 'Overview', 'Search the archive', 'Search canonical Succession Contest entities and open the relevant workspace or domain dossier.', 'active'),

  route('characters', 'characters', 'Characters', 'People', 'Character archive', 'Canonical people organized by role, allegiance, current state, affiliations, evidence, and connected records.', 'active'),
  route('princes', 'princes', 'Princes', 'People', 'Princes of Kakin', 'Fourteen ordered prince dossiers with strategy, household, Nen, Guardian Spirit Beast, pressure, and family-tree views.', 'active'),
  route('queens', 'queens', 'Queens', 'People', 'Queens of Kakin', 'Eight maternal households with children, guards, surveillance, residence, political action, and current status.', 'active'),
  route('bodyguards', 'bodyguards', 'Bodyguards', 'People', 'Bodyguards and room assignments', 'Royal-room protection, embedded observers, reassignment history, loyalty boundaries, and named protectors.', 'active'),
  route('hunters', 'hunters', 'Hunters', 'People', 'Hunters aboard the voyage', 'Hunter contracts, Zodiac duties, Nen instruction, prince assignments, and expedition responsibilities.', 'active'),

  route('mafia', 'mafia', 'Mafia', 'Power', 'Kakin mafia', 'Xi-Yu, Heil-Ly, and Cha-R compared through leadership, territory, members, royal sponsorship, objectives, risks, and operations.', 'active'),
  route('military', 'military', 'Military', 'Power', 'Military and Justice authority', 'Command hierarchy, custody, legal procedure, investigations, personnel, active operations, and special martial law.', 'active'),
  route('organizations', 'organizations', 'Organizations', 'Power', 'Organization hierarchy', 'Canonical institutions shown through parent units, leadership, objectives, membership, and operational type.', 'active'),
  route('politics', 'politics', 'Politics', 'Power', 'Political archive', 'Royal parentage, succession interests, queen branches, sponsorship, alliances, treaties, and competing authority.', 'active'),

  route('black-whale', 'black-whale', 'Black Whale', 'World', 'Black Whale 1', 'The ship atlas, room lookup, and tier orientation inside the dedicated archive shell.', 'active'),
  route('locations', 'locations', 'Locations', 'World', 'Location archive', 'Ship hierarchy, royal rooms, access, occupants, incidents, legal routes, criminal passages, and Nen-mediated movement.', 'active'),

  route('nen', 'nen', 'Nen', 'Systems', 'Nen archive', 'Succession abilities, instruction, conditions, costs, curses, contracts, possession, and known classifications.', 'active'),
  route('guardian-spirit-beasts', 'guardian-spirit-beasts', 'Guardian Spirit Beasts', 'Systems', 'Guardian Spirit Beasts', 'King Nasubi and all fourteen prince beast records with shared ritual rules, mechanics, knowledge state, and unknowns.', 'active'),

  route('events', 'events', 'Events', 'Records', 'Event archive', 'Operations organized by chapter range, participants, location, causes, consequences, and current state.', 'active'),
  route('deaths', 'deaths', 'Deaths', 'Records', 'Deaths and body states', 'Confirmed deaths and exceptional body, consciousness, possession, custody, and Nen-continuation states.', 'active'),
  route('relationships', 'relationships', 'Relationships', 'Records', 'Relationship archive', 'Typed family, professional, protective, political, allied, deceptive, command, and hostile links.', 'active'),
  route('chapters', 'chapter-records', 'Chapters', 'Records', 'Chapter records', 'Research records for Chapters 340–414, separate from the image reader.', 'active'),

  route('research', 'research', 'Research', 'Library', 'Research desk', 'Sources, provenance, evidence types, confidence, coverage, unresolved claims, and explicit research gaps.', 'active'),
  route('glossary', 'glossary', 'Glossary', 'Library', 'Succession glossary', 'Controlled ritual, Nen, legal, political, ship, status, and archive vocabulary.', 'active'),
  route('media', 'media', 'Media', 'Library', 'Media archive', 'Maintained portraits and Guardian Spirit Beast visuals with subjects, availability, and provenance links.', 'active'),
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
  'succession-roster': 'characters',
  'succession-timeline': 'timeline',
  beasts: 'guardian-spirit-beasts',
  mafia: 'mafia',
  'black-whale': 'black-whale',
});

export const getSuccessionArchiveRoute = (id = 'archive') => successionArchiveRouteById.get(id) || successionArchiveRouteById.get('archive');
