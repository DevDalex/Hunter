const includesChapter = (range, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const sortByRange = (left, right) => left.chapterRange.start - right.chapterRange.start
  || (left.chapterRange.end ?? Number.POSITIVE_INFINITY) - (right.chapterRange.end ?? Number.POSITIVE_INFINITY)
  || left.id.localeCompare(right.id);

const uniqueEntities = (values) => [...new Map(values.filter(Boolean).map((value) => [value.id, value])).values()];

export const createCharacterStateSelectors = ({ data, archive }) => {
  const profiles = data.characterStateProfiles || Object.freeze({});
  const latestChapter = data.chapters.at(-1)?.number || 414;

  const getCharacterStateTimeline = (characterId) => Object.freeze([
    ...(profiles[characterId] || []),
  ].sort(sortByRange));

  const getCharacterStateAtChapter = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;

    const explicit = getCharacterStateTimeline(characterId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .sort((left, right) => right.chapterRange.start - left.chapterRange.start)[0];
    if (explicit) return explicit;

    const locationRecord = archive.getCurrentLocationRecordForCharacter(characterId, parsedChapter);
    return Object.freeze({
      id: `character-state:derived:${characterId.replace('character:', '')}:${parsedChapter}`,
      characterId,
      chapterRange: Object.freeze({ start: parsedChapter, end: parsedChapter }),
      life: character.status?.life || 'unknown',
      bodyState: character.status?.life === 'dead' ? 'deceased body' : 'living body',
      consciousnessState: character.status?.life === 'dead' ? 'unknown or ended' : 'active in own body',
      operationalState: character.summary || 'No chapter-specific operational override is published.',
      protectionState: 'Derived from active assignments and relationships.',
      threatLevel: 'unknown',
      nenKnowledge: character.nen?.naturalType ? `${character.nen.naturalType} user` : 'unknown',
      allegianceState: 'Derived from canonical affiliations.',
      locationId: locationRecord?.locationId || character.locationState?.locationId || null,
      openQuestions: Object.freeze([]),
      certainty: character.status?.certainty || 'confirmed',
      sourceIds: Object.freeze([...(character.sourceIds || [])]),
      derived: true,
    });
  };

  const getCharacterCurrentState = (characterId) => getCharacterStateAtChapter(characterId, latestChapter);

  const getCharacterDossier = (characterId, chapter = null) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;

    const state = getCharacterStateAtChapter(characterId, parsedChapter);
    const locationRecord = archive.getCurrentLocationRecordForCharacter(characterId, parsedChapter);
    const location = archive.getEntityById(state?.locationId || locationRecord?.locationId);
    const assignmentSnapshot = archive.getAssignmentSnapshot(characterId, parsedChapter);
    const relationshipSnapshot = archive.getRelationshipSnapshot(characterId, parsedChapter);
    const events = archive.getEventsForCharacter(characterId)
      .filter((event) => includesChapter(event.chapterRange, parsedChapter));
    const abilities = archive.getAbilitiesForOwner(characterId);
    const appearances = archive.getAppearancesForCharacter(characterId)
      .filter((appearance) => appearance.chapter <= parsedChapter);
    const threatAssignments = assignmentSnapshot?.byRole.subject.filter((assignment) => [
      'assassination', 'infiltration', 'surveillance',
    ].includes(assignment.assignmentType)) || [];
    const protectionAssignments = assignmentSnapshot?.byRole.subject.filter((assignment) => [
      'protection', 'custody', 'allied-reinforcement', 'transferred-protection',
    ].includes(assignment.assignmentType)) || [];
    const sourceIds = [...new Set([
      ...(character.sourceIds || []),
      ...(state?.sourceIds || []),
      ...events.flatMap((event) => event.sourceIds || []),
    ])];

    return Object.freeze({
      character,
      chapter: parsedChapter,
      state,
      locationRecord,
      location: location?.entityType === 'location' ? location : null,
      assignments: assignmentSnapshot,
      relationships: relationshipSnapshot,
      abilities: Object.freeze(abilities),
      events: Object.freeze(events),
      appearances: Object.freeze(appearances),
      threatAssignments: Object.freeze(threatAssignments),
      protectionAssignments: Object.freeze(protectionAssignments),
      affiliations: Object.freeze([...(character.affiliations || [])]),
      sources: Object.freeze(sourceIds.map((id) => archive.getEntityById(id)).filter(Boolean)),
      timeline: getCharacterStateTimeline(characterId),
    });
  };

  const searchCharactersByState = (query, { limit = 20 } = {}) => {
    const normalized = String(query || '').trim().toLocaleLowerCase();
    if (!normalized) return [];
    const matches = [];
    for (const [characterId, timeline] of Object.entries(profiles)) {
      const character = archive.getEntityById(characterId);
      if (!character) continue;
      const text = timeline.flatMap((record) => [
        record.bodyState,
        record.consciousnessState,
        record.operationalState,
        record.protectionState,
        record.threatLevel,
        record.nenKnowledge,
        record.allegianceState,
        ...(record.openQuestions || []),
      ]).join(' ').toLocaleLowerCase();
      if (!text.includes(normalized)) continue;
      const exactState = timeline.some((record) => [record.bodyState, record.consciousnessState, record.threatLevel]
        .some((value) => String(value || '').toLocaleLowerCase() === normalized));
      matches.push(Object.freeze({ entity: character, score: exactState ? 55 : 25 }));
    }
    return matches.sort((left, right) => right.score - left.score || left.entity.name.localeCompare(right.entity.name)).slice(0, limit);
  };

  const getCharactersWithStateProfiles = () => Object.freeze(uniqueEntities(
    Object.keys(profiles).map((characterId) => archive.getEntityById(characterId)),
  ));

  return Object.freeze({
    getCharacterStateTimeline,
    getCharacterStateAtChapter,
    getCharacterCurrentState,
    getCharacterDossier,
    getCharactersWithStateProfiles,
    searchCharactersByState,
  });
};
