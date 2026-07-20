import { blackWhaleRooms } from './blackWhale';
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
import { successionDays } from './successionTimeline';
import {
  archiveSearchRecord as record,
  firstArchiveChapter,
  searchFocusId,
} from './archiveSearch.shared';

const voyageEventRecords = successionDays.flatMap((day) => day.events.map((event) => record(
  'Voyage event', event.title, `Day ${day.day} · Chapter ${event.chapter} · ${event.location}`,
  `${event.time} ${event.detail} ${event.confidence} ${event.tracks.join(' ')}`,
  { view: 'succession', target: 'succession-timeline', params: { search: event.title } },
  event.source, event.chapter,
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
  { view: 'succession', target: 'beasts', params: { panel: 'abilities', focus: searchFocusId(ability.ability) } }, ability.source, firstArchiveChapter(ability.chapters),
));

const beasts = guardianBeasts.map((beast) => record(
  'Guardian Spirit Beast', `${beast.host}'s Guardian Spirit Beast`, `${beast.type} · ${beast.knowledge}`,
  `${beast.ability} ${beast.conditions}`,
  { view: 'succession', target: 'beasts', params: { panel: 'beasts', focus: searchFocusId(beast.host) } }, beast.source, 349,
));

const factions = successionFactions.map((faction) => record(
  'Faction', faction.name, faction.territory, `${faction.objective} ${faction.people.join(' ')}`,
  { view: 'succession', target: 'mafia', params: { panel: 'mafia', focus: searchFocusId(faction.name) } }, faction.source, 359,
));

const mafia = mafiaDossiers.map((family) => record(
  'Mafia family', family.family, `${family.sponsor} · ${family.base}`,
  `${family.leadership.join(' ')} ${family.members.join(' ')} ${family.objectives.join(' ')}`,
  { view: 'succession', target: 'mafia', params: { panel: 'mafia', focus: searchFocusId(family.family) } }, family.source, 378,
));

const operations = successionOperations.map((operation) => record(
  'Operation', operation.name, `Ch. ${operation.chapters} · ${operation.place}`,
  `${operation.summary} ${operation.status}`,
  { view: 'succession', target: 'mafia', params: { panel: 'operations', focus: searchFocusId(operation.name) } }, operation.source, firstArchiveChapter(operation.chapters),
));

const objects = successionObjects.map((item) => record(
  'Object', item.name, 'Succession evidence and objects', item.note,
  { view: 'succession', target: 'chapters', params: { panel: 'objects', focus: searchFocusId(item.name) } }, item.source,
));

const mysteries = successionMysteries.map((item) => record(
  'Mystery', item.question, `${item.status} · last relevant Ch. ${item.lastChapter}`,
  item.evidence,
  { view: 'succession', target: 'chapters', params: { panel: 'mysteries', focus: searchFocusId(item.question) } }, item.source, Number(item.lastChapter),
));

const successionChapters = successionChapterResearch.map((chapter) => record(
  'Succession chapter', `Chapter ${chapter.number}: ${chapter.title}`, `${chapter.phase} · ${chapter.voyageDay}`,
  `${chapter.focus} ${chapter.lanes.join(' ')}`,
  { view: 'succession', target: 'chapters', params: { panel: 'chapters', focus: String(chapter.number) } }, chapter.source, chapter.number,
));

export const successionSearchGroups = {
  voyageEventRecords,
  successionChapters,
  princes,
  rooms,
  abilities,
  beasts,
  factions,
  mafia,
  operations,
  objects,
  mysteries,
  successionCharacters,
};
