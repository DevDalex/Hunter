import { arcs } from './arcs';
import { archiveDirectory } from './archiveDirectory';
import { nenTaxonomy, timelineIndex, worldIndexSections } from './hunterpediaMasterIndex';
import { blackWhaleRooms } from './blackWhale';
import { chapters } from './chapters';
import { worldIndexes } from './referenceLibrary';
import { referenceEntityRecords } from './referenceEntities';
import { nenRecords } from './nenEncyclopedia';
import {
  guardianBeasts,
  mafiaDossiers,
  princeDossiers,
  successionAbilities,
  successionChapterResearch,
  successionFactions,
  successionMysteries,
  successionObjects,
  successionOperations,
} from './successionDossier';
import { successionRoster } from './successionRoster';
import { fightAbilities, fightChapters } from './hisokaChrollo';
import { seriesArcDossiers } from './seriesArcDossiers';
import { encyclopediaRecords } from './encyclopedia';
import { worldMapLocations, worldMapRoutes, worldMapUnplacedLocations } from './worldMap';
import { successionDays } from './successionTimeline';

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const focusId = (value) => normalize(value).replace(/\s+/g, '-');
const firstChapter = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);
const record = (type, title, subtitle, keywords, route, source, chapter = 0) => ({
  id: `${type}:${focusId(title)}`,
  type,
  title,
  subtitle,
  searchText: normalize(`${title} ${subtitle} ${keywords || ''} ${type}`),
  route,
  source,
  chapter,
});

const chapterRecords = chapters.map((chapter) => record(
  'Chapter',
  `Chapter ${chapter.number}: ${chapter.title}`,
  `${chapter.arcTitle} · ${chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected'}`,
  `${chapter.summary} ${chapter.characters.join(' ')} ${chapter.locations.join(' ')} ${chapter.research?.phaseTitle || ''} ${chapter.research?.beat || ''} ${chapter.research?.peopleScope?.join(' ') || ''} ${chapter.research?.placeScope?.join(' ') || ''}`,
  chapter.number <= 339
    ? { view: 'series', target: 'chapters', params: { chapter: chapter.number } }
    : { view: 'succession', target: 'chapters', params: { panel: 'chapters', focus: String(chapter.number) } },
  chapter.sourceUrl, chapter.number,
));

const directoryRecords = archiveDirectory.map((item) => record(
  'Archive section', `${item.letter} — ${item.title}`, item.scope,
  `${item.description} ${item.contents.join(' ')}`,
  item.route, item.source,
));

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

const arcRecords = arcs.map((arc) => record(
  'Arc', arc.title, `Chapters ${arc.chapters[0]}-${arc.chapters[1]}`, `${arc.premise} ${arc.focus.join(' ')}`,
  { view: 'series', target: '', params: { arc: arc.id } }, arc.source,
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

const voyageEventRecords = successionDays.flatMap((day) => day.events.map((event) => record(
  'Voyage event', event.title, `Day ${day.day} · Chapter ${event.chapter} · ${event.location}`,
  `${event.time} ${event.detail} ${event.confidence} ${event.tracks.join(' ')}`,
  { view: 'succession', target: 'succession-timeline', params: { search: event.title } },
  event.source, event.chapter,
)));

const arcPhaseRecords = seriesArcDossiers.flatMap((arc) => arc.phases.map((phase) => record(
  'Arc phase', `${arc.title} — ${phase.title}`, `Chapters ${phase.range[0]}–${phase.range[1]}`,
  `${phase.summary} ${phase.shift} ${phase.people.join(' ')} ${phase.factions.join(' ')} ${phase.places.join(' ')} ${phase.nen.join(' ')} ${phase.conflicts.join(' ')}`,
  { view: 'series', target: 'research', params: { chapter: phase.range[0] } }, phase.source, phase.range[0],
)));

const arcConflictRecords = seriesArcDossiers.flatMap((arc) => arc.conflicts.map((item) => record(
  'Arc conflict', item.name, `${arc.title} · Chapters ${item.chapters}`,
  `${item.type} ${item.participants} ${item.objective} ${item.abilities} ${item.turningPoint} ${item.outcome} ${item.consequence}`,
  { view: 'series', target: 'arc-study', params: { arc: arc.id } }, item.source, Number(item.chapters.match(/\d+/)?.[0] || arc.range[0]),
)));

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

const successionCharacters = successionRoster.map((character) => record(
  'Succession character', character.name, character.groupTitle || 'Succession roster', `${character.status || ''} ${character.statusNote || ''}`,
  { view: 'succession', target: 'succession-roster', params: { search: character.name } }, character.source,
));

const princes = princeDossiers.map((prince) => record(
  'Prince', prince.name, `${prince.order}. Prince · ${prince.mother} · Room ${prince.room}`,
  `${prince.strategy} ${prince.nen} ${prince.beast} ${prince.team.join(' ')} ${prince.pressure.join(' ')}`,
  { view: 'succession', target: 'family-tree', params: { panel: 'princes', prince: prince.order } }, prince.source, 349,
));

const rooms = blackWhaleRooms.map((room) => record(
  'Black Whale room', room.name, `${room.type} · ${room.tier}`,
  `${room.detail} ${room.occupants} ${room.control} ${room.access} ${room.connections || ''} ${room.status}`,
  { view: 'succession', target: 'black-whale', params: { room: room.name } }, room.source,
));

const abilities = successionAbilities.map((ability) => record(
  'Nen ability', ability.ability, `${ability.user} · ${ability.type} · Ch. ${ability.chapters}`,
  `${ability.mechanics} ${ability.conditions}`,
  { view: 'succession', target: 'beasts', params: { panel: 'abilities', focus: focusId(ability.ability) } }, ability.source, firstChapter(ability.chapters),
));

const beasts = guardianBeasts.map((beast) => record(
  'Guardian Spirit Beast', `${beast.host}'s Guardian Spirit Beast`, `${beast.type} · ${beast.knowledge}`,
  `${beast.ability} ${beast.conditions}`,
  { view: 'succession', target: 'beasts', params: { panel: 'beasts', focus: focusId(beast.host) } }, beast.source, 349,
));

const factions = successionFactions.map((faction) => record(
  'Faction', faction.name, faction.territory, `${faction.objective} ${faction.people.join(' ')}`,
  { view: 'succession', target: 'mafia', params: { panel: 'mafia', focus: focusId(faction.name) } }, faction.source, 359,
));

const mafia = mafiaDossiers.map((family) => record(
  'Mafia family', family.family, `${family.sponsor} · ${family.base}`,
  `${family.leadership.join(' ')} ${family.members.join(' ')} ${family.objectives.join(' ')}`,
  { view: 'succession', target: 'mafia', params: { panel: 'mafia', focus: focusId(family.family) } }, family.source, 378,
));

const operations = successionOperations.map((operation) => record(
  'Operation', operation.name, `Ch. ${operation.chapters} · ${operation.place}`,
  `${operation.summary} ${operation.status}`,
  { view: 'succession', target: 'mafia', params: { panel: 'operations', focus: focusId(operation.name) } }, operation.source, firstChapter(operation.chapters),
));

const objects = successionObjects.map((item) => record(
  'Object', item.name, 'Succession evidence and objects', item.note,
  { view: 'succession', target: 'chapters', params: { panel: 'objects', focus: focusId(item.name) } }, item.source,
));

const mysteries = successionMysteries.map((item) => record(
  'Mystery', item.question, `${item.status} · last relevant Ch. ${item.lastChapter}`,
  item.evidence,
  { view: 'succession', target: 'chapters', params: { panel: 'mysteries', focus: focusId(item.question) } }, item.source, Number(item.lastChapter),
));

const successionChapters = successionChapterResearch.map((chapter) => record(
  'Succession chapter', `Chapter ${chapter.number}: ${chapter.title}`, `${chapter.phase} · ${chapter.voyageDay}`,
  `${chapter.focus} ${chapter.lanes.join(' ')}`,
  { view: 'succession', target: 'chapters', params: { panel: 'chapters', focus: String(chapter.number) } }, chapter.source, chapter.number,
));

const fightDossier = record(
  'Fight dossier', 'Hisoka vs. Chrollo', 'Heavens Arena · Chapters 351–357',
  `Battle to the Death ${fightChapters.map((chapter) => chapter.title).join(' ')} ${fightAbilities.map((ability) => ability.name).join(' ')}`,
  { view: 'reference', target: 'hisoka-chrollo', params: { chapter: 351, ability: 'sun-moon' } },
  fightChapters[0].source, 351,
);

const implementationNotesRecord = record(
  'Archive maintenance', 'Implementation, maintenance & final release', 'Phase 6F handoff · Phase 6G release',
  'Architecture route manifest content schema source policy media rules accessibility performance browser storage runtime recovery update runbooks release checklist source package download completion criteria',
  { view: 'reference', target: 'maintenance' },
);

const fightChapterRecords = fightChapters.map((chapter) => record(
  'Fight chapter', `Hisoka vs. Chrollo — Chapter ${chapter.number}`, `${chapter.title} · ${chapter.phase}`,
  `${chapter.thesis} ${chapter.events.join(' ')} ${chapter.mechanics.join(' ')}`,
  { view: 'reference', target: 'hisoka-chrollo', params: { chapter: chapter.number } }, chapter.source, chapter.number,
));

const referenceEntries = worldIndexes.flatMap((group) => group.items.map((item) => record(
  group.title.replace(/ &.*$/, ''), item.name, group.title, item.note,
  { view: 'reference', target: 'research-library', params: { index: group.id, search: item.name } }, item.source,
)));

const structuredReferenceEntries = referenceEntityRecords.map((item) => record(
  item.kind, item.name, item.sectionTitle,
  `${item.summary} ${Object.values(item.facts).join(' ')} ${item.related.join(' ')}`,
  { view: 'reference', target: item.section === 'conflicts' || item.section === 'objects' ? item.section : 'atlas', params: { index: item.section, search: item.name } }, item.source,
));

const byId = new Map();
[
  ...directoryRecords,
  ...mappedPlaces,
  ...unplacedMapRecords,
  ...mapRouteRecords,
  ...voyageEventRecords,
  ...encyclopediaEntries,
  fightDossier,
  implementationNotesRecord,
  ...fightChapterRecords,
  ...chapterRecords,
  ...successionChapters,
  ...arcRecords,
  ...arcPhaseRecords,
  ...arcConflictRecords,
  ...nenEntries,
  ...princes,
  ...rooms,
  ...abilities,
  ...beasts,
  ...factions,
  ...mafia,
  ...operations,
  ...objects,
  ...mysteries,
  ...hunterpediaTimeline,
  ...hunterpediaWorld,
  ...hunterpediaNen,
  ...successionCharacters,
  ...structuredReferenceEntries,
  ...referenceEntries,
].forEach((item) => {
  const key = `${item.type}:${normalize(item.title)}`;
  if (!byId.has(key)) byId.set(key, item);
});

export const archiveSearchIndex = [...byId.values()];
export const archiveSearchTypes = [...new Set(archiveSearchIndex.map((item) => item.type))].sort();
export const searchFocusId = focusId;
