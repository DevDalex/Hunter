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
    getAbilitiesAtLocation,
    getActiveAssignmentsForSubject,
    getAssignmentsForPerson,
    getAssignmentsForSubject,
    getCharacter,
    getChapter,
    getChaptersForAbility,
    getEntitiesAtLocation,
    getEntitiesByType,
    getEventsAtLocation,
    getEventsForAbility,
    getEventsForCharacter,
    getEventsForOrganization,
    getLocationBreadcrumbs,
    getLocationsForAbility,
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
  assert(successionArchiveValidation.stats.entities >= 343, 'canonical graph must contain the expanded Batch 1 current-arc catalogue');
  assert(successionArchiveIndexes.byId.size === successionArchiveValidation.stats.entities, 'global ID index must include every entity');

  const characterRecords = getEntitiesByType('character');
  const princes = characterRecords.filter((record) => record.roles?.includes('prince'));
  const queens = characterRecords.filter((record) => record.roles?.includes('queen'));
  const bodyguards = characterRecords.filter((record) => record.roles?.includes('bodyguard'));
  const hunters = characterRecords.filter((record) => record.roles?.includes('hunter'));
  const placeholders = characterRecords.filter((record) => /^(Unnamed |Stone Wall |V6 Leader |Temp Hunter |Cha-R Associate |Tserriednich Friend |Heil-Ly Associate )/.test(record.name));
  const bodyguardsWithoutPortraitCandidates = bodyguards.filter((record) => !record.media?.portrait);
  const characterNames = characterRecords.map((record) => record.name);
  const chapterRecords = getEntitiesByType('chapter');
  const abilities = getEntitiesByType('ability');
  const locations = getEntitiesByType('location');
  const events = getEntitiesByType('event');
  const assignments = getEntitiesByType('assignment');
  const relationships = getEntitiesByType('relationship');
  const abilityById = new Map(abilities.map((ability) => [ability.id, ability]));
  const eventById = new Map(events.map((event) => [event.id, event]));

  assert(princes.length === 14, `expected 14 princes, found ${princes.length}`);
  assert(queens.length === 8, `expected 8 queens, found ${queens.length}`);
  assert(bodyguards.length >= 85, `expected the expanded bodyguard catalogue, found ${bodyguards.length}`);
  assert(bodyguardsWithoutPortraitCandidates.length === 0, `every named bodyguard must carry a portrait candidate; missing ${bodyguardsWithoutPortraitCandidates.map((record) => record.name).join(', ')}`);
  assert(hunters.length >= 20, `expected the current-arc Hunter catalogue, found ${hunters.length}`);
  assert(placeholders.length === 0, 'generic unnamed placeholders must not appear as canonical characters');
  assert(new Set(characterNames).size === characterNames.length, 'canonical character names must be deduplicated');
  assert(getEntitiesByType('guardian-beast').length === 15, 'King Nasubi and fourteen prince Guardian Spirit Beast records are required');
  assert(abilities.length >= 35, `Batch 1 must retain at least 35 canonical abilities, found ${abilities.length}`);
  assert(locations.length >= 30, `Batch 1 must retain at least 30 canonical locations, found ${locations.length}`);
  assert(events.length >= 29, `Batch 1 event foundation must retain at least 29 canonical events, found ${events.length}`);
  assert(assignments.length >= 20, `Batch 1 must retain at least 20 canonical assignments, found ${assignments.length}`);
  assert(relationships.length >= 40, `Batch 1 must retain the expanded relationship graph, found ${relationships.length}`);
  assert(chapterRecords.length === expectedChapterRecords, `Chapter records must cover 340 through ${latestChapter}`);
  assert(chapterRecords[0]?.number === 340 && chapterRecords.at(-1)?.number === latestChapter, `chapter catalogue boundaries must remain 340–${latestChapter}`);
  assert(chapterRecords.every((record, index) => record.number === 340 + index), 'chapter records must remain sequential');
  assert(getEntitiesByType('organization').filter((record) => record.organizationType === 'mafia-family').length === 3, 'all three Kakin mafia families are required');

  assert(abilityById.has('ability:dowsing-chain'), 'ability foundation must include Dowsing Chain');
  assert(abilityById.has('ability:steal-chain'), 'ability foundation must include Steal Chain');
  assert(abilityById.has('ability:hanzo-skill-4'), 'ability foundation must include Hanzo Skill 4');
  assert(abilityById.has('ability:have-not-curse'), 'ability foundation must include the Have-Not curse system');
  assert(abilityById.get('ability:woble-guardian-beast-unrevealed')?.researchStatus === 'major-mystery', 'Woble’s unrevealed ability must remain explicitly marked as a major mystery');

  assert(eventById.has('event:room-1014-opening-crisis'), 'event foundation must include the opening Room 1014 crisis');
  assert(eventById.has('event:silent-majority-class-killings'), 'event foundation must include the Silent Majority class killings');
  assert(eventById.has('event:halkenburg-first-possession-operation'), 'event foundation must include Halkenburg’s first possession operation');
  assert(eventById.has('event:heil-ly-contagion-activation'), 'event foundation must include the Heil-Ly Contagion campaign');
  assert(eventById.has('event:lower-prince-alliance-formation'), 'event foundation must include the lower-prince alliance');
  assert(eventById.has('event:second-room-1014-nen-class'), 'event foundation must include the second Room 1014 Nen class');

  const kurapika = getCharacter('kurapika');
  assert(kurapika?.id === 'character:kurapika', 'character slug lookup must resolve Kurapika');
  assert(getCharacter('character:kurapika') === kurapika, 'character ID and slug lookup must resolve the same canonical object');
  assert(kurapika?.status?.asOfChapter === latestChapter, `maintained character status boundaries must reach Chapter ${latestChapter}`);

  const woble = getCharacter('woble-hui-guo-rou');
  assert(woble?.princeOrder === 14, 'Woble must resolve as the Fourteenth Prince');

  const chapter348 = getChapter(348);
  assert(chapter348?.abilityIds?.includes('ability:dowsing-chain'), 'Chapter 348 must link the Dowsing Chain screening record');
  const chapter359 = getChapter(359);
  assert(chapter359?.eventIds?.includes('event:room-1014-opening-crisis'), 'Chapter 359 must link the Room 1014 opening crisis');
  const chapter369 = getChapter(369);
  assert(chapter369?.reader?.manifestChapter === 369, 'chapter metadata must preserve the reader manifest link');
  assert(chapter369?.eventIds?.includes('event:silent-majority-class-killings'), 'Chapter 369 must link the Silent Majority class killings');
  assert(chapter369?.abilityIds?.includes('ability:silent-majority'), 'Chapter 369 must derive Silent Majority from the event graph');
  const chapter393 = getChapter(393);
  assert(chapter393?.eventIds?.includes('event:luini-troupe-confrontation'), 'Chapter 393 must link Luini’s confrontation with the Phantom Troupe');
  const chapter403 = getChapter(403);
  assert(chapter403?.eventIds?.includes('event:balsamilco-poisoning-operation'), 'Chapter 403 must derive the Balsamilco operation from the event graph');
  assert(chapter403?.locationIds?.includes('location:black-whale:tier-2:courthouse'), 'Chapter 403 must derive the Tier 2 courthouse location');
  assert(chapter403?.abilityIds?.includes('ability:halkenburg-possession-arrow'), 'Chapter 403 must derive the possession-arrow ability link');
  const chapter405 = getChapter(405);
  assert(chapter405?.eventIds?.includes('event:hisoka-tier-1-confirmation'), 'Chapter 405 must link Hisoka’s Tier 1 confirmation');
  const chapter413 = getChapter(413);
  assert(chapter413?.abilityIds?.includes('ability:have-not-curse'), 'Chapter 413 must retain the active Have-Not curse threat');
  assert(chapter413?.abilityIds?.includes('ability:woble-guardian-beast-unrevealed'), 'Chapter 413 must preserve Woble’s unrevealed Guardian Spirit Beast mystery');
  assert(chapter413?.eventIds?.includes('event:second-room-1014-nen-class'), 'Chapter 413 must retain the expanded second Nen class');
  const chapter414 = getChapter(414);
  assert(chapter414?.reader?.manifestChapter === 414, 'Chapter 414 must bridge into the reader manifest');
  assert(chapter414?.sourceIds?.includes('source:chapter-414'), 'Chapter 414 must preserve its canonical source record');
  const latestRecord = getChapter(latestChapter);
  assert(latestRecord?.reader?.manifestChapter === latestChapter, `latest Chapter ${latestChapter} must bridge into the reader manifest`);

  const kurapikaEvents = getEventsForCharacter('character:kurapika');
  assert(kurapikaEvents.some((event) => event.id === 'event:room-1014-nen-classes'), 'character event index must include the Room 1014 Nen classes');
  assert(kurapikaEvents.some((event) => event.id === 'event:longhi-kurapika-treaty'), 'character event index must include the Longhi treaty');
  assert(kurapikaEvents.some((event) => event.id === 'event:room-1014-opening-crisis'), 'character event index must include the opening Room 1014 crisis');
  assert(kurapikaEvents.some((event) => event.id === 'event:lower-prince-alliance-formation'), 'character event index must include the lower-prince alliance');

  const silentMajorityEvents = getEventsForAbility('ability:silent-majority');
  assert(silentMajorityEvents.some((event) => event.id === 'event:silent-majority-class-killings'), 'ability event index must connect Silent Majority to its class killings');
  const silentMajorityChapters = new Set(getChaptersForAbility('ability:silent-majority').map((chapter) => chapter.number));
  assert(silentMajorityChapters.has(369) && silentMajorityChapters.has(376), 'ability chapter index must cover Silent Majority’s documented chapter range');
  const contagionLocations = new Set(getLocationsForAbility('ability:contagion').map((location) => location.id));
  assert(contagionLocations.has('location:black-whale:tier-3'), 'ability location index must connect Contagion to Tier 3');
  assert(contagionLocations.has('location:black-whale:tier-3:heil-ly-hideout'), 'ability location index must connect Contagion to the Heil-Ly hideout');
  const room1014Abilities = new Set(getAbilitiesAtLocation('location:black-whale:tier-1:room-1014').map((ability) => ability.id));
  assert(room1014Abilities.has('ability:silent-majority'), 'location ability projection must expose Silent Majority in Room 1014');
  assert(room1014Abilities.has('ability:have-not-curse'), 'location ability projection must expose the Have-Not curse threat in Room 1014');
  const heilLyEvents = getEventsForOrganization('organization:heil-ly');
  assert(heilLyEvents.some((event) => event.id === 'event:heil-ly-contagion-activation'), 'organization event index must expose the Heil-Ly campaign');
  assert(heilLyEvents.some((event) => event.id === 'event:luini-troupe-confrontation'), 'organization event index must expose the Luini confrontation');

  const roomOccupants = getEntitiesAtLocation('location:black-whale:tier-1:room-1014', 369);
  const roomOccupantIds = new Set(roomOccupants.map(({ entity }) => entity.id));
  assert(roomOccupantIds.has('character:kurapika'), 'location history must place Kurapika in Room 1014 during Chapter 369');
  assert(roomOccupantIds.has('character:woble-hui-guo-rou'), 'location history must place Woble in Room 1014 during Chapter 369');

  const breadcrumbs = getLocationBreadcrumbs('location:black-whale:tier-3:room-3101');
  assert(
    breadcrumbs.map((location) => location.id).join('>') === 'location:black-whale>location:black-whale:tier-3>location:black-whale:tier-3:room-3101',
    'location breadcrumbs must preserve the Room 3101 hierarchy',
  );
  assert(getEventsAtLocation('location:black-whale:tier-3:room-3101').some((event) => event.id === 'event:room-3101-breach'), 'Room 3101 must index its breach operation');

  const heilLyMembers = getOrganizationMembers('organization:heil-ly');
  assert(heilLyMembers.some(({ character }) => character.id === 'character:morena-prudo'), 'organization membership must derive Morena from canonical affiliation data');
  assert(heilLyMembers.length >= 20, 'Heil-Ly membership must include the named Contagion network');

  const kurapikaAssignments = getAssignmentsForPerson('character:kurapika');
  assert(kurapikaAssignments.some((assignment) => assignment.id === 'assignment:kurapika-protects-woble'), 'person assignment index must include Kurapika’s Woble contract');
  const wobleAssignments = getAssignmentsForSubject('character:woble-hui-guo-rou');
  assert(wobleAssignments.some((assignment) => assignment.id === 'assignment:babimyna-observes-woble'), 'subject assignment index must include Benjamin surveillance');
  assert(wobleAssignments.some((assignment) => assignment.id === 'assignment:sarahell-infiltrates-woble'), 'subject assignment index must include Sarahell’s curse infiltration');
  const wobleAt400 = new Set(getActiveAssignmentsForSubject('character:woble-hui-guo-rou', 400).map((assignment) => assignment.id));
  const wobleAt411 = new Set(getActiveAssignmentsForSubject('character:woble-hui-guo-rou', 411).map((assignment) => assignment.id));
  assert(!wobleAt400.has('assignment:sarahell-infiltrates-woble'), 'Sarahell must not appear in the Chapter 400 assignment snapshot');
  assert(wobleAt411.has('assignment:sarahell-infiltrates-woble'), 'Sarahell must appear in the Chapter 411 assignment snapshot');

  const kachoBeast = getEntitiesByType('guardian-beast').find((record) => record.id === 'guardian-beast:kacho');
  assert(kachoBeast?.knownAbilityIds?.includes('ability:without-you'), 'Kacho’s Guardian Spirit Beast must link to Without You');
  const halkenburgBeast = getEntitiesByType('guardian-beast').find((record) => record.id === 'guardian-beast:halkenburg');
  assert(halkenburgBeast?.knownAbilityIds?.includes('ability:halkenburg-guardian-marking'), 'Halkenburg’s Guardian Spirit Beast must link to its collective marking system');
  const wobleBeast = getEntitiesByType('guardian-beast').find((record) => record.id === 'guardian-beast:woble');
  assert(wobleBeast?.suspectedAbilityIds?.includes('ability:woble-guardian-beast-unrevealed'), 'Woble’s Guardian Spirit Beast must retain its unrevealed ability record');

  const kurapikaRelatedIds = new Set(getRelatedEntities('character:kurapika').map((entity) => entity.id));
  assert(kurapikaRelatedIds.has('organization:hunter-association'), 'related-entity projection must include affiliations');
  assert(kurapikaRelatedIds.has('ability:emperor-time'), 'related-entity projection must include abilities');
  assert(kurapikaRelatedIds.has('ability:stealth-dolphin'), 'related-entity projection must include Batch 1 abilities');
  assert(kurapikaRelatedIds.has('ability:dowsing-chain'), 'related-entity projection must include expanded Kurapika abilities');
  assert(kurapikaRelatedIds.has('ability:steal-chain'), 'related-entity projection must include Steal Chain');
  assert(kurapikaRelatedIds.has('assignment:kurapika-protects-woble'), 'related-entity projection must include assignments');
  assert(kurapikaRelatedIds.has('event:room-1014-opening-crisis'), 'related-entity projection must include expanded events');
  assert(kurapikaRelatedIds.has('chapter:369'), 'related-entity projection must include chapter appearances');

  const silentMajorityRelatedIds = new Set(getRelatedEntities('ability:silent-majority').map((entity) => entity.id));
  assert(silentMajorityRelatedIds.has('event:silent-majority-class-killings'), 'ability related projection must include linked events');
  assert(silentMajorityRelatedIds.has('location:black-whale:tier-1:room-1014'), 'ability related projection must include linked locations');
  assert(silentMajorityRelatedIds.has('chapter:369'), 'ability related projection must include linked chapters');

  const tserriednichSearch = searchSuccessionArchive('fourth prince');
  assert(tserriednichSearch.some(({ entity }) => entity.id === 'character:tserriednich-hui-guo-rou'), 'global search must resolve character aliases');
  assert(searchSuccessionArchive('Moonlight Act').some(({ entity }) => entity.id === 'ability:moonlight-act'), 'global search must resolve Batch 1 abilities');
  assert(searchSuccessionArchive('Dowsing Chain').some(({ entity }) => entity.id === 'ability:dowsing-chain'), 'global search must resolve expanded canonical abilities');
  assert(searchSuccessionArchive('First Nen-Class Assassinations').some(({ entity }) => entity.id === 'event:silent-majority-class-killings'), 'global search must resolve expanded event aliases');
  assert(searchSuccessionArchive('surveillance Woble').some(({ entity }) => entity.id === 'assignment:babimyna-observes-woble'), 'global search must resolve assignment type and subject summaries');
  const latestChapterSearch = searchSuccessionArchive(`chapter ${latestChapter}`);
  assert(latestChapterSearch.some(({ entity }) => entity.id === `chapter:${latestChapter}`), `global search must resolve Chapter ${latestChapter}`);

  const duplicateReferences = Object.values(successionArchiveData)
    .filter(Array.isArray)
    .flat()
    .filter((entity) => entity.sourceIds && new Set(entity.sourceIds).size !== entity.sourceIds.length);
  assert(duplicateReferences.length === 0, 'entity source references must not contain duplicates');

  console.log(
    `Succession Archive data audit passed: ${successionArchiveValidation.stats.entities} entities, `
    + `${characterRecords.length} named characters, ${abilities.length} abilities, ${locations.length} locations, `
    + `${events.length} events, ${assignments.length} assignments, ${relationships.length} relationships, `
    + `and ${chapterRecords.length} chapter records through ${latestChapter}.`,
  );
} finally {
  await vite.close();
}
