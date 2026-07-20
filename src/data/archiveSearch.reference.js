import { nenTaxonomy, timelineIndex, worldIndexSections } from './hunterpediaMasterIndex';
import { worldIndexes } from './referenceLibrary';
import { referenceEntityRecords } from './referenceEntities';
import { nenRecords } from './nenEncyclopedia';
import { encyclopediaRecords } from './encyclopedia';
import { worldMapLocations, worldMapRoutes, worldMapUnplacedLocations } from './worldMap';
import { archiveSearchRecord as record } from './archiveSearch.shared';

const encyclopediaTypes = {
  characters: 'Character', factions: 'Faction', locations: 'Location', nen: 'Nen record', conflicts: 'Conflict',
  objects: 'Object', relationships: 'Relationship', status: 'Status',
};

const encyclopediaEntries = encyclopediaRecords.map((item) => record(
  encyclopediaTypes[item.category] || 'Encyclopedia record', item.name, `${item.kind} · ${item.researchLevel}`,
  `${item.summary} ${item.statusLabel} ${item.facts.map((fact) => `${fact.label} ${fact.value}`).join(' ')} ${item.related.join(' ')} ${item.tags.join(' ')}`,
  item.category === 'conflicts'
    ? { view: 'reference', target: 'conflicts', params: { search: item.name } }
    : { view: 'reference', target: 'encyclopedia', params: { category: item.category, record: item.id } }, item.source, item.chapter,
));

const mappedPlaces = worldMapLocations.map((place) => record(
  'Mapped place', place.name, `${place.kind} · ${place.confidence} placement`,
  `${place.alternateNames.join(' ')} ${place.summary} ${place.importance} ${place.parent || ''} ${place.arcs.join(' ')} ${place.related.join(' ')}`,
  { view: 'reference', target: 'atlas', params: { location: place.id, mode: place.era === 'succession' ? 'succession' : 'explore' } },
  place.source,
));

const unplacedMapRecords = worldMapUnplacedLocations.map((place) => record(
  'Unpinned place', place.name, `${place.kind} · coordinate intentionally withheld`,
  `${place.note} ${place.related.join(' ')}`,
  { view: 'reference', target: 'atlas', params: { location: place.id, mode: place.era === 'succession' ? 'succession' : 'explore' } },
  place.source,
));

const mapRouteRecords = worldMapRoutes.map((route) => record(
  'Map route', route.label, `${route.stops.length} ordered anchors · ${route.era} era`,
  `${route.note} ${route.stops.map((id) => worldMapLocations.find((place) => place.id === id)?.name || id).join(' ')}`,
  { view: 'reference', target: 'atlas', params: { mode: route.id === 'succession-voyage' ? 'succession' : 'journey', route: route.id, location: route.stops[0] } },
  worldMapLocations.find((place) => place.id === route.stops[0])?.source,
));

const nenEntries = nenRecords.filter((item) => item.group !== 'Succession abilities').map((item) => record(
  /ability/i.test(item.kind) ? 'Nen ability' : 'Nen concept', item.name, `${item.group}${item.user ? ` · ${item.user}` : ''}`,
  `${item.summary} ${item.mechanics.join(' ')} ${item.type || ''} ${item.related.join(' ')}`,
  { view: 'reference', target: 'nen', params: { search: item.name } }, item.source, item.chapter || 0,
));

const hunterpediaTimeline = timelineIndex.map((entry) => record(
  'Timeline', entry.era, entry.precision, entry.topics.join(' '),
  { view: 'reference', target: 'hunterpedia', params: { tab: 'timeline', search: entry.era } }, entry.source,
));

const hunterpediaWorld = worldIndexSections.flatMap((section) => section.groups.flatMap((group) => group.items.map((entry) => record(
  'World', entry.name, `${section.title} · ${group.name}`, section.description,
  { view: 'reference', target: 'hunterpedia', params: { tab: 'world', search: entry.name } }, entry.source,
))));

const hunterpediaNen = nenTaxonomy.flatMap((section) => section.items.map((entry) => record(
  'Nen topic', entry.name, section.title, 'Hunterpedia Nen taxonomy',
  { view: 'reference', target: 'hunterpedia', params: { tab: 'nen', search: entry.name } }, entry.source,
)));

const referenceEntries = worldIndexes.flatMap((group) => group.items.map((item) => record(
  group.title.replace(/ &.*$/, ''), item.name, group.title, item.note,
  { view: 'reference', target: 'research-library', params: { index: group.id, search: item.name } }, item.source,
)));

const structuredReferenceEntries = referenceEntityRecords.map((item) => record(
  item.kind, item.name, item.sectionTitle,
  `${item.summary} ${Object.values(item.facts).join(' ')} ${item.related.join(' ')}`,
  { view: 'reference', target: item.section === 'conflicts' || item.section === 'objects' ? item.section : 'atlas', params: { index: item.section, search: item.name } }, item.source,
));

export const referenceSearchGroups = {
  mappedPlaces,
  unplacedMapRecords,
  mapRouteRecords,
  encyclopediaEntries,
  nenEntries,
  hunterpediaTimeline,
  hunterpediaWorld,
  hunterpediaNen,
  structuredReferenceEntries,
  referenceEntries,
};
