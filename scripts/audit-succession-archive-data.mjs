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
  const [archiveModule, availabilityModule, metadataModule] = await Promise.all([
    vite.ssrLoadModule('/src/data/succession/successionData.js'),
    vite.ssrLoadModule('/src/data/successionChapterAvailability.generated.js'),
    vite.ssrLoadModule('/src/data/latestChapterMetadata.js'),
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
  const { LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER } = metadataModule;
  const latestChapter = Math.max(414, LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER);
  const expectedChapterRecords = latestChapter - 340 + 1;

  assert(latestChapter >= LATEST_AUTHORIZED_SUCCESSION_CHAPTER, 'research chapter boundary must not be lower than the local page-media boundary');
  assert(successionArchiveValidation.valid, 'canonical data must pass schema validation');
  assert(successionArchiveValidation.stats.entities >= 343, 'canonical graph must contain the expanded Batch 1 current-arc catalogue');
  assert(successionArchiveIndexes.byId.size === successionArchiveValidation.stats.entities, 'global ID index must include every entity');

  const characterRecords = getEntitiesByType('character');
  const princes = characterRecords.filter((record) => record.roles?.includes('prince'));
  const queens = characterRecords.filter((record) => record.roles?.includes('queen'));
  const bodyguards = characterRecords.filter((record) => record.roles?.includes('bodyguard'));
  const hunters = characterRecords.filter((record) => record.roles?.includes('hunter'));
  const placeholders = characterRecords.filter((record) => /^(Unnamed |Stone Wall |V6 Leader |Temp Hunter |Cha-R Associate |Tserriednich Friend |Heil-Ly Associate )/.test(record.name));
  const bodyguardsWithoutMediaSlots = bodyguards.filter((record) => !record.media || !Object.prototype.hasOwnProperty.call(record.media, 'portrait') || !Array.isArray(record.media.galleryIds));
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
  assert(bodyguardsWithoutMediaSlots.length === 0, `every named bodyguard must carry a valid media slot; malformed ${bodyguardsWithoutMediaSlots.map((record) => record.name).join(', ')}`);
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

  const room1014 = getLocationBreadcrumbs('location:black-whale:tier-1:room-1014');
  assert(room1014.map((record) => record.name).join(' > ').includes('Room 1014'), 'location breadcrumbs must resolve the Room 1014 hierarchy');
  assert(getEventsAtLocation('location:black-whale:tier-1:room-1014').some((record) => record.id === 'event:room-1014-opening-crisis'), 'Room 1014 must expose linked events');
  assert(getEntitiesAtLocation('location:black-whale:tier-1:room-1014').some((record) => record.entity?.id === 'character:kurapika'), 'Room 1014 must expose Kurapika through its occupancy records');
  assert(getAbilitiesAtLocation('location:black-whale:tier-1:room-1014').some((record) => record.id === 'ability:dowsing-chain'), 'Room 1014 must expose linked abilities');
  assert(getLocationsForAbility('ability:dowsing-chain').some((record) => record.id === 'location:black-whale:tier-1:room-1014'), 'Dowsing Chain must expose linked locations');
  assert(getChaptersForAbility('ability:dowsing-chain').some((record) => record.number === 348), 'Dowsing Chain must expose linked chapters');
  assert(getEventsForAbility('ability:silent-majority').some((record) => record.id === 'event:silent-majority-class-killings'), 'Silent Majority must expose linked events');
  assert(getEventsForCharacter('character:kurapika').length > 0, 'Kurapika must expose linked events');
  assert(getEventsForOrganization('organization:hunter-association').length > 0, 'Hunter Association must expose linked events');
  assert(getOrganizationMembers('organization:hunter-association').some((record) => record.character?.id === 'character:kurapika'), 'Hunter Association membership lookup must include Kurapika');
  assert(getAssignmentsForPerson('character:kurapika').length > 0, 'Kurapika must expose assignment history');
  assert(getAssignmentsForSubject('character:woble-hui-guo-rou').length > 0, 'Woble must expose protection assignments');
  assert(getActiveAssignmentsForSubject('character:woble-hui-guo-rou', latestChapter).length > 0, 'Woble must expose active protection assignments at the current boundary');
  assert(getRelatedEntities('character:kurapika').length > 0, 'Kurapika must expose graph relationships');

  const kurapikaSearch = searchSuccessionArchive('Kurapika');
  assert(kurapikaSearch.some((record) => record.entity?.id === 'character:kurapika'), 'search must resolve Kurapika');
  const dowsingSearch = searchSuccessionArchive('Dowsing Chain');
  assert(dowsingSearch.some((record) => record.entity?.id === 'ability:dowsing-chain'), 'search must resolve Dowsing Chain');
  assert(successionArchiveData.characters.length === characterRecords.length, 'public canonical data must expose the same character catalogue as selectors');

  console.log(`Succession Archive audit passed: ${characterRecords.length} characters, ${bodyguards.length} bodyguards with explicit media slots, ${abilities.length} abilities, ${locations.length} locations, ${events.length} events, ${assignments.length} assignments, ${relationships.length} relationships, and ${chapterRecords.length} sequential chapter records through research Chapter ${latestChapter}; local page media through Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}.`);
} finally {
  await vite.close();
}
