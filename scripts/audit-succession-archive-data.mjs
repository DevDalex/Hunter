import { createServer } from 'vite';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Archive audit failed: ${message}`);
};

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const [archiveModule, availabilityModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/successionChapterAvailability.generated.js'),
  ]);
  const {
    getCharacter,
    getChapter,
    getEntitiesAtLocation,
    getEntitiesByType,
    getEventsForCharacter,
    getLocationBreadcrumbs,
    getOrganizationMembers,
    getRelatedEntities,
    searchSuccessionArchive,
    successionArchiveData,
    successionArchiveIndexes,
    successionArchiveValidation,
  } = archiveModule;
  const { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } = availabilityModule;
  const latestChapter = Math.max(414, LATEST_AUTHORIZED_SUCCESSION_CHAPTER);
  const expectedChapterRecords = latestChapter - 340 + 1;

  assert(successionArchiveValidation.valid, 'canonical data must pass schema validation');
  assert(successionArchiveValidation.stats.entities >= 250, 'canonical graph must contain the expanded current-arc catalogue');
  assert(successionArchiveIndexes.byId.size === successionArchiveValidation.stats.entities, 'global ID index must include every entity');

  const characterRecords = getEntitiesByType('character');
  const princes = characterRecords.filter((record) => record.roles?.includes('prince'));
  const queens = characterRecords.filter((record) => record.roles?.includes('queen'));
  const bodyguards = characterRecords.filter((record) => record.roles?.includes('bodyguard'));
  const hunters = characterRecords.filter((record) => record.roles?.includes('hunter'));
  const placeholders = characterRecords.filter((record) => /^(Unnamed |Stone Wall |V6 Leader |Temp Hunter |Cha-R Associate |Tserriednich Friend |Heil-Ly Associate )/.test(record.name));
  const characterNames = characterRecords.map((record) => record.name);
  const chapterRecords = getEntitiesByType('chapter');

  assert(princes.length === 14, `expected 14 princes, found ${princes.length}`);
  assert(queens.length === 8, `expected 8 queens, found ${queens.length}`);
  assert(bodyguards.length >= 85, `expected the expanded bodyguard catalogue, found ${bodyguards.length}`);
  assert(hunters.length >= 20, `expected the current-arc Hunter catalogue, found ${hunters.length}`);
  assert(placeholders.length === 0, 'generic unnamed placeholders must not appear as canonical characters');
  assert(new Set(characterNames).size === characterNames.length, 'canonical character names must be deduplicated');
  assert(getEntitiesByType('guardian-beast').length === 15, 'King Nasubi and fourteen prince Guardian Spirit Beast records are required');
  assert(chapterRecords.length === expectedChapterRecords, `Chapter records must cover 340 through ${latestChapter}`);
  assert(chapterRecords[0]?.number === 340 && chapterRecords.at(-1)?.number === latestChapter, `chapter catalogue boundaries must remain 340–${latestChapter}`);
  assert(chapterRecords.every((record, index) => record.number === 340 + index), 'chapter records must remain sequential');
  assert(getEntitiesByType('organization').filter((record) => record.organizationType === 'mafia-family').length === 3, 'all three Kakin mafia families are required');

  const kurapika = getCharacter('kurapika');
  assert(kurapika?.id === 'character:kurapika', 'character slug lookup must resolve Kurapika');
  assert(getCharacter('character:kurapika') === kurapika, 'character ID and slug lookup must resolve the same canonical object');
  assert(kurapika?.status?.asOfChapter === 414, 'maintained character status boundaries must reach Chapter 414');

  const woble = getCharacter('woble-hui-guo-rou');
  assert(woble?.princeOrder === 14, 'Woble must resolve as the Fourteenth Prince');

  const chapter369 = getChapter(369);
  assert(chapter369?.reader?.manifestChapter === 369, 'chapter metadata must preserve the reader manifest link');
  const chapter414 = getChapter(414);
  assert(chapter414?.reader?.manifestChapter === 414, 'Chapter 414 must bridge into the reader manifest');
  assert(chapter414?.sourceIds?.includes('source:chapter-414'), 'Chapter 414 must preserve its canonical source record');
  const latestRecord = getChapter(latestChapter);
  assert(latestRecord?.reader?.manifestChapter === latestChapter, `latest Chapter ${latestChapter} must bridge into the reader manifest`);

  const kurapikaEvents = getEventsForCharacter('character:kurapika');
  assert(kurapikaEvents.some((event) => event.id === 'event:room-1014-nen-classes'), 'character event index must include the Room 1014 Nen classes');

  const roomOccupants = getEntitiesAtLocation('location:black-whale:tier-1:room-1014', 369);
  const roomOccupantIds = new Set(roomOccupants.map(({ entity }) => entity.id));
  assert(roomOccupantIds.has('character:kurapika'), 'location history must place Kurapika in Room 1014 during Chapter 369');
  assert(roomOccupantIds.has('character:woble-hui-guo-rou'), 'location history must place Woble in Room 1014 during Chapter 369');

  const breadcrumbs = getLocationBreadcrumbs('location:black-whale:tier-1:room-1014');
  assert(
    breadcrumbs.map((location) => location.id).join('>') === 'location:black-whale>location:black-whale:tier-1>location:black-whale:tier-1:room-1014',
    'location breadcrumbs must preserve the Black Whale hierarchy',
  );

  const heilLyMembers = getOrganizationMembers('organization:heil-ly');
  assert(heilLyMembers.some(({ character }) => character.id === 'character:morena-prudo'), 'organization membership must derive Morena from canonical affiliation data');
  assert(heilLyMembers.length >= 20, 'Heil-Ly membership must include the named Contagion network');

  const kurapikaRelatedIds = new Set(getRelatedEntities('character:kurapika').map((entity) => entity.id));
  assert(kurapikaRelatedIds.has('organization:hunter-association'), 'related-entity projection must include affiliations');
  assert(kurapikaRelatedIds.has('ability:emperor-time'), 'related-entity projection must include abilities');
  assert(kurapikaRelatedIds.has('chapter:369'), 'related-entity projection must include chapter appearances');

  const tserriednichSearch = searchSuccessionArchive('fourth prince');
  assert(tserriednichSearch.some(({ entity }) => entity.id === 'character:tserriednich-hui-guo-rou'), 'global search must resolve character aliases');
  const latestChapterSearch = searchSuccessionArchive(`chapter ${latestChapter}`);
  assert(latestChapterSearch.some(({ entity }) => entity.id === `chapter:${latestChapter}`), `global search must resolve Chapter ${latestChapter}`);

  const duplicateReferences = Object.values(successionArchiveData)
    .filter(Array.isArray)
    .flat()
    .filter((entity) => entity.sourceIds && new Set(entity.sourceIds).size !== entity.sourceIds.length);
  assert(duplicateReferences.length === 0, 'entity source references must not contain duplicates');

  console.log(
    `Succession Archive data audit passed: ${successionArchiveValidation.stats.entities} entities, `
    + `${characterRecords.length} named characters, ${princes.length} princes, ${queens.length} queens, `
    + `${bodyguards.length} bodyguards, ${hunters.length} Hunters, and ${chapterRecords.length} chapter records through ${latestChapter}.`,
  );
} finally {
  await vite.close();
}
