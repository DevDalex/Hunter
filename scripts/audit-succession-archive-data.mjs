import {
  getCharacter,
  getChapter,
  getEntitiesAtLocation,
  getEventsForCharacter,
  getLocationBreadcrumbs,
  getOrganizationMembers,
  getRelatedEntities,
  searchSuccessionArchive,
  successionArchiveData,
  successionArchiveIndexes,
  successionArchiveValidation,
} from '../src/data/succession/successionData.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Archive audit failed: ${message}`);
};

assert(successionArchiveValidation.valid, 'canonical pilot data must pass schema validation');
assert(successionArchiveValidation.stats.entities >= 25, 'pilot graph must contain a meaningful cross-section of entities');
assert(successionArchiveIndexes.byId.size === successionArchiveValidation.stats.entities, 'global ID index must include every entity');

const kurapika = getCharacter('kurapika');
assert(kurapika?.id === 'character:kurapika', 'character slug lookup must resolve Kurapika');
assert(getCharacter('character:kurapika') === kurapika, 'character ID and slug lookup must resolve the same canonical object');

const chapter369 = getChapter(369);
assert(chapter369?.reader?.manifestChapter === 369, 'chapter metadata must preserve the reader manifest link');

const kurapikaEvents = getEventsForCharacter('character:kurapika');
assert(kurapikaEvents.some((event) => event.id === 'event:room-1014-nen-classes'), 'character event index must include the Room 1014 Nen classes');

const roomOccupants = getEntitiesAtLocation('location:black-whale:tier-1:room-1014', 369);
const roomOccupantIds = new Set(roomOccupants.map(({ entity }) => entity.id));
assert(roomOccupantIds.has('character:kurapika'), 'location history must place Kurapika in Room 1014 during Chapter 369');
assert(roomOccupantIds.has('character:woble'), 'location history must place Woble in Room 1014 during Chapter 369');

const breadcrumbs = getLocationBreadcrumbs('location:black-whale:tier-1:room-1014');
assert(
  breadcrumbs.map((location) => location.id).join('>') === 'location:black-whale>location:black-whale:tier-1>location:black-whale:tier-1:room-1014',
  'location breadcrumbs must preserve the Black Whale hierarchy',
);

const heilLyMembers = getOrganizationMembers('organization:heil-ly');
assert(heilLyMembers.some(({ character }) => character.id === 'character:morena-prudo'), 'organization membership must derive Morena from canonical affiliation data');

const kurapikaRelatedIds = new Set(getRelatedEntities('character:kurapika').map((entity) => entity.id));
assert(kurapikaRelatedIds.has('organization:hunter-association'), 'related-entity projection must include affiliations');
assert(kurapikaRelatedIds.has('ability:emperor-time'), 'related-entity projection must include abilities');
assert(kurapikaRelatedIds.has('chapter:369'), 'related-entity projection must include chapter appearances');

const tserriednichSearch = searchSuccessionArchive('fourth prince');
assert(tserriednichSearch[0]?.entity?.id === 'character:tserriednich-hui-guo-rou', 'global search must resolve character aliases');

const duplicateReferences = Object.values(successionArchiveData)
  .filter(Array.isArray)
  .flat()
  .filter((entity) => entity.sourceIds && new Set(entity.sourceIds).size !== entity.sourceIds.length);
assert(duplicateReferences.length === 0, 'entity source references must not contain duplicates');

console.log(
  `Succession Archive data audit passed: ${successionArchiveValidation.stats.entities} entities, `
  + `${successionArchiveValidation.stats.characters} characters, ${successionArchiveValidation.stats.chapters} pilot chapters, `
  + `${successionArchiveValidation.stats.events} event, and ${successionArchiveValidation.warnings.length} non-blocking completeness warnings.`,
);
