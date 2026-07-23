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
  route('story', 'story', 'Story', 'Overview', 'Story workspace', 'A focused narrative orientation that points into the archive without repeating every reference domain on one page.', 'active'),
  route('timeline', 'timeline', 'Timeline', 'Overview', 'Voyage timeline', 'Chapter-bounded events and movements presented in chronological order.', 'active'),
  route('reader', 'reader', 'Reader', 'Overview', 'Manga reader', 'The existing chapter image reader, kept separate from research and reference material.', 'active'),
  route('search', 'search', 'Global Search', 'Overview', 'Search the archive', 'Search canonical Succession Contest entities and open the relevant workspace.', 'active'),

  route('characters', 'characters', 'Characters', 'People', 'Character archive', 'Canonical character records, current state, affiliations, sources, and connected entities.', 'active'),
  route('princes', 'princes', 'Princes', 'People', 'Princes of Kakin', 'Prince records and the preserved royal-family workspace.', 'migration'),
  route('queens', 'queens', 'Queens', 'People', 'Queens of Kakin', 'Queen records separated from prince and household material.', 'active'),
  route('bodyguards', 'bodyguards', 'Bodyguards', 'People', 'Bodyguards', 'Royal guards, contracted protectors, assignments, and current affiliations.', 'active'),
  route('hunters', 'hunters', 'Hunters', 'People', 'Hunters aboard the voyage', 'Hunter Association members and contracted Hunters active in the Succession Contest.', 'active'),

  route('mafia', 'mafia', 'Mafia', 'Power', 'Kakin mafia', 'Mafia families, members, objectives, and active operations.', 'migration'),
  route('military', 'military', 'Military', 'Power', 'Kakin military', 'Military authority, personnel, custody, and security operations.', 'migration'),
  route('organizations', 'organizations', 'Organizations', 'Power', 'Organizations', 'Canonical organizations and their memberships, leadership, objectives, and relationships.', 'active'),
  route('politics', 'politics', 'Politics', 'Power', 'Political archive', 'Royal authority, alliances, pressure, and political relationships kept distinct from faction summaries.', 'foundation'),

  route('black-whale', 'black-whale', 'Black Whale', 'World', 'Black Whale 1', 'The preserved ship atlas inside the dedicated archive shell.', 'migration'),
  route('locations', 'locations', 'Locations', 'World', 'Location archive', 'Canonical ship locations, hierarchy, occupants, and chapter-bounded location history.', 'active'),

  route('nen', 'nen', 'Nen', 'Systems', 'Nen archive', 'Succession-specific abilities, instruction, conditions, and known classifications without speculative filling.', 'migration'),
  route('guardian-spirit-beasts', 'guardian-spirit-beasts', 'Guardian Spirit Beasts', 'Systems', 'Guardian Spirit Beasts', 'Guardian Spirit Beast records separated from the general Nen workspace.', 'migration'),

  route('events', 'events', 'Events', 'Records', 'Event archive', 'Canonical events, participants, locations, consequences, and chapter ranges.', 'active'),
  route('deaths', 'deaths', 'Deaths', 'Records', 'Deaths and body states', 'Confirmed deaths and exceptional body states, bounded by source chapter and certainty.', 'migration'),
  route('relationships', 'relationships', 'Relationships', 'Records', 'Relationship archive', 'Typed family, professional, protective, political, allied, and hostile links.', 'migration'),
  route('chapters', 'chapter-records', 'Chapters', 'Records', 'Chapter records', 'Research records and entity links for Succession Contest chapters, separate from the image reader.', 'migration'),

  route('research', 'research', 'Research', 'Library', 'Research desk', 'Sources, evidence notes, provenance, and chapter-bounded research material.', 'active'),
  route('glossary', 'glossary', 'Glossary', 'Library', 'Glossary', 'A future controlled vocabulary for archive terms and names.', 'foundation'),
  route('media', 'media', 'Media', 'Library', 'Media archive', 'A future media workspace governed by the existing chapter image manifest and provenance rules.', 'foundation'),
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
