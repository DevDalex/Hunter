const freeze = (values) => Object.freeze(values);
const unique = (values) => [...new Set(values.filter(Boolean))];

export const createEventKnowledgeSelectors = ({ data, archive }) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const events = archive.getEntitiesByType('event');

  const sourceChapterNumbers = (entity) => (entity?.sourceIds || [])
    .map((sourceId) => archive.getEntityById(sourceId))
    .filter((source) => source?.entityType === 'source' && Number.isFinite(source.chapter))
    .map((source) => source.chapter);

  const entityFirstKnownChapter = (entity) => {
    if (!entity) return null;
    const chapters = sourceChapterNumbers(entity);
    if (entity.entityType === 'character') {
      chapters.push(...archive.getAppearancesForCharacter(entity.id).map((record) => record.chapter));
      chapters.push(...(data.characterStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'organization') {
      chapters.push(...archive.getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
      chapters.push(...(data.organizationStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'location') chapters.push(...archive.getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
    if (entity.entityType === 'ability' && Number.isFinite(entity.firstChapter)) chapters.push(entity.firstChapter);
    const finite = chapters.filter(Number.isFinite);
    return finite.length ? Math.min(...finite) : null;
  };

  const entityAvailableAtChapter = (entity, chapter) => {
    const firstChapter = entityFirstKnownChapter(entity);
    return firstChapter === null || chapter >= firstChapter;
  };

  const boundedIds = (ids, chapter, entityType = null) => freeze(unique((ids || []).filter((id) => {
    const entity = archive.getEntityById(id);
    return entity && (!entityType || entity.entityType === entityType) && entityAvailableAtChapter(entity, chapter);
  })));

  const getStoryEventKnowledgeAtChapter = (eventOrId, chapter = null) => {
    const event = typeof eventOrId === 'string' ? archive.getEntityById(eventOrId) : eventOrId;
    if (!event || event.entityType !== 'event') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter) || parsedChapter < event.chapterRange.start) return null;

    const canonicalEnd = event.chapterRange.end ?? event.chapterRange.start;
    const sourceChapters = sourceChapterNumbers(event);
    const matureAt = Math.max(canonicalEnd, ...(sourceChapters.length ? sourceChapters : [event.chapterRange.start]));
    const singleChapter = canonicalEnd === event.chapterRange.start;
    const mature = singleChapter || parsedChapter >= matureAt;
    const activeAtBoundary = parsedChapter < canonicalEnd;
    const visibleEnd = Math.min(canonicalEnd, parsedChapter);
    const boundedStatus = activeAtBoundary ? 'active-at-selected-chapter' : event.status;
    const summary = mature
      ? event.summary
      : parsedChapter === event.chapterRange.start
        ? `${event.name} begins in Chapter ${event.chapterRange.start}. Later operational details and outcomes remain hidden by the selected chapter boundary.`
        : `${event.name} remains active through Chapter ${parsedChapter}. Its later developments and outcome remain hidden by the selected chapter boundary.`;

    const participantIds = boundedIds(event.participantIds, parsedChapter, 'character');
    const organizationIds = boundedIds(event.organizationIds, parsedChapter, 'organization');
    const locationIds = boundedIds(event.locationIds, parsedChapter, 'location');
    const abilityIds = boundedIds(event.abilityIds, parsedChapter, 'ability');
    const sourceIds = freeze(unique((event.sourceIds || []).filter((id) => {
      const source = archive.getEntityById(id);
      return source?.entityType === 'source' && (!Number.isFinite(source.chapter) || source.chapter <= parsedChapter);
    })));
    const consequenceEventIds = freeze(unique((event.consequenceEventIds || []).filter((id) => {
      const consequence = archive.getEntityById(id);
      return consequence?.entityType === 'event' && consequence.chapterRange.start <= parsedChapter;
    })));
    const predecessorEventIds = freeze(events
      .filter((candidate) => candidate.chapterRange.start <= parsedChapter && candidate.consequenceEventIds?.includes(event.id))
      .map((candidate) => candidate.id));

    return Object.freeze({
      ...event,
      chapter: parsedChapter,
      startChapter: event.chapterRange.start,
      visibleThroughChapter: visibleEnd,
      knowledgeState: mature ? 'documented through selected boundary' : 'operation in progress; later details hidden',
      mature,
      matureChapter: mature ? matureAt : null,
      canonicalEvent: Object.freeze({ status: boundedStatus }),
      canonicalChapterRange: Object.freeze({ start: event.chapterRange.start, end: visibleEnd }),
      chapterRange: Object.freeze({ start: event.chapterRange.start, end: visibleEnd }),
      summary,
      status: boundedStatus,
      causes: freeze([...(event.causes || [])]),
      outcomes: mature ? freeze([...(event.outcomes || [])]) : freeze([]),
      stateChanges: mature ? freeze([...(event.stateChanges || [])]) : freeze([]),
      openQuestions: mature ? freeze([...(event.openQuestions || [])]) : freeze([]),
      participantIds,
      organizationIds,
      locationIds,
      abilityIds,
      consequenceEventIds,
      predecessorEventIds,
      sourceIds,
    });
  };

  const getStoryEventsKnownAtChapter = (chapter = null, { category = null, status = null, atChapterOnly = false } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    return freeze(events
      .filter((event) => !atChapterOnly || (parsedChapter >= event.chapterRange.start && parsedChapter <= (event.chapterRange.end ?? event.chapterRange.start)))
      .map((event) => getStoryEventKnowledgeAtChapter(event, parsedChapter))
      .filter(Boolean)
      .filter((event) => !category || event.category === category)
      .filter((event) => !status || event.status === status)
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start
        || (left.chronology?.sequence || 0) - (right.chronology?.sequence || 0)
        || left.name.localeCompare(right.name)));
  };

  return Object.freeze({
    getStoryEventKnowledgeAtChapter,
    getStoryEventsKnownAtChapter,
  });
};
