import { successionChapterResearchByNumber } from './successionResearch.js';

const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const rangesIntersect = (left, right) => left.start <= (right.end ?? Number.POSITIVE_INFINITY) && right.start <= (left.end ?? Number.POSITIVE_INFINITY);
const uniqueById = (values) => [...new Map(values.filter(Boolean).map((value) => [value.id, value])).values()];
const uniqueStrings = (values) => [...new Set(values.filter(Boolean))];
const freeze = (values) => Object.freeze(values);

export const createStoryIntelligenceSelectors = ({ data, archive, eventKnowledge }) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const phaseProfiles = data.storyPhaseProfiles || Object.freeze({});
  const laneProfiles = data.storyLaneProfiles || Object.freeze({});
  const threadProfiles = data.storyThreadProfiles || Object.freeze({});
  const causalLinksById = data.storyCausalLinksById || Object.freeze({});
  const getEventKnowledge = eventKnowledge?.getStoryEventKnowledgeAtChapter || null;

  const resolve = (ids) => (ids || []).map((id) => archive.getEntityById(id)).filter(Boolean);
  const eventAtChapter = (eventOrId, chapter) => getEventKnowledge
    ? getEventKnowledge(eventOrId, chapter)
    : (() => {
      const event = typeof eventOrId === 'string' ? archive.getEntityById(eventOrId) : eventOrId;
      return event?.entityType === 'event' && event.chapterRange.start <= chapter ? event : null;
    })();
  const sourceAtChapter = (id, chapter) => {
    const source = archive.getEntityById(id);
    return source?.entityType === 'source' && (!source.chapter || source.chapter <= chapter) ? source : null;
  };
  const profileSourceChapters = (profile) => (profile?.sourceIds || [])
    .map((id) => archive.getEntityById(id)?.chapter)
    .filter(Number.isFinite);

  const entityFirstKnownChapter = (entity) => {
    if (!entity) return null;
    const chapters = (entity.sourceIds || [])
      .map((sourceId) => archive.getEntityById(sourceId)?.chapter)
      .filter(Number.isFinite);
    if (entity.entityType === 'character') {
      chapters.push(...archive.getAppearancesForCharacter(entity.id).map((record) => record.chapter));
      chapters.push(...(data.characterStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'organization') {
      chapters.push(...archive.getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
      chapters.push(...(data.organizationStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'location') chapters.push(...archive.getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
    return chapters.length ? Math.min(...chapters) : null;
  };

  const entityAvailableAtChapter = (entity, chapter) => {
    const firstChapter = entityFirstKnownChapter(entity);
    return firstChapter === null || chapter >= firstChapter;
  };

  const getStoryPhaseProfile = (phaseId) => phaseProfiles[phaseId] || null;
  const getStoryLaneProfile = (laneId) => laneProfiles[laneId] || null;
  const getStoryThreadProfile = (threadId) => threadProfiles[threadId] || null;
  const getStoryCausalLink = (linkId) => causalLinksById[linkId] || null;

  const getStoryPhaseAtChapter = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    return Object.values(phaseProfiles).find((profile) => includesChapter(profile.chapterRange, parsedChapter)) || null;
  };

  const getStoryLanesAtChapter = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    const phase = getStoryPhaseAtChapter(parsedChapter);
    if (!phase) return freeze([]);
    return freeze((phase.laneIds || [])
      .map(getStoryLaneProfile)
      .filter((profile) => profile && includesChapter(profile.chapterRange, parsedChapter)));
  };

  const threadStatusAtChapter = (profile, chapter) => {
    if (!profile || chapter < profile.chapterRange.start) return 'not-yet-open';
    if (profile.resolutionChapter !== null) return chapter >= profile.resolutionChapter ? 'resolved' : 'open';
    return profile.status || 'open';
  };

  const phasePresentationAtChapter = (profile, chapter) => {
    if (!profile) return null;
    const end = profile.chapterRange.end ?? chapter;
    const complete = chapter >= end;
    const research = successionChapterResearchByNumber.get(chapter);
    return Object.freeze({
      name: complete ? profile.name : research?.phase || `Story phase beginning Chapter ${profile.chapterRange.start}`,
      summary: complete ? profile.summary : research?.focus || `This phase is active at Chapter ${chapter}; later developments remain hidden by the selected boundary.`,
      complete,
      visibleChapterRange: Object.freeze({ start: profile.chapterRange.start, end: Math.min(end, chapter) }),
    });
  };

  const lanePresentationAtChapter = (profile, chapter, events) => {
    if (!profile) return null;
    const sourceChapters = profileSourceChapters(profile);
    const matureChapter = sourceChapters.length ? Math.max(...sourceChapters) : profile.chapterRange.start;
    const mature = chapter >= matureChapter;
    const recentEvents = events.slice(-3).map((event) => event.name);
    return Object.freeze({
      name: profile.name,
      summary: mature
        ? profile.summary
        : recentEvents.length
          ? `Through Chapter ${chapter}, this plotline includes ${recentEvents.join(', ')}. Later developments remain hidden.`
          : `This plotline is active at Chapter ${chapter}, but no later operational development is exposed before its supporting chapter.`,
      objective: mature
        ? profile.objective
        : 'Follow the events and unresolved questions currently supported by the selected chapter boundary.',
      mature,
      matureChapter,
    });
  };

  const getStoryThreadDossier = (threadId, chapter = null) => {
    const profile = getStoryThreadProfile(threadId);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!profile || !Number.isFinite(parsedChapter) || parsedChapter < profile.chapterRange.start) return null;
    const status = threadStatusAtChapter(profile, parsedChapter);
    return Object.freeze({
      profile,
      chapter: parsedChapter,
      status,
      evidenceState: status === 'resolved'
        ? profile.evidenceState
        : 'The resolution remains unavailable at the selected chapter boundary.',
      lanes: freeze((profile.laneIds || []).map(getStoryLaneProfile).filter(Boolean)),
      entities: freeze(resolve(profile.entityIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      events: freeze(resolve(profile.eventIds).map((event) => eventAtChapter(event, parsedChapter)).filter(Boolean)),
      abilities: freeze(resolve(profile.abilityIds).filter((ability) => {
        const sourceChapters = (ability.sourceIds || []).map((id) => archive.getEntityById(id)?.chapter).filter(Number.isFinite);
        return !sourceChapters.length || Math.min(...sourceChapters) <= parsedChapter;
      })),
      locations: freeze(resolve(profile.locationIds).filter((location) => entityAvailableAtChapter(location, parsedChapter))),
      sources: freeze((profile.sourceIds || []).map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
    });
  };

  const getStoryThreadsAtChapter = (chapter = null, { status = null, category = null, laneId = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    return freeze(Object.values(threadProfiles)
      .map((profile) => getStoryThreadDossier(profile.id, parsedChapter))
      .filter(Boolean)
      .filter((dossier) => !status || dossier.status === status)
      .filter((dossier) => !category || dossier.profile.category === category)
      .filter((dossier) => !laneId || dossier.profile.laneIds.includes(laneId))
      .sort((left, right) => left.profile.chapterRange.start - right.profile.chapterRange.start || left.profile.name.localeCompare(right.profile.name)));
  };

  const getStoryCausalLinksAtChapter = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    return freeze(Object.values(causalLinksById)
      .filter((link) => eventAtChapter(link.sourceEventId, parsedChapter) && eventAtChapter(link.targetEventId, parsedChapter))
      .sort((left, right) => {
        const leftTarget = archive.getEntityById(left.targetEventId);
        const rightTarget = archive.getEntityById(right.targetEventId);
        return leftTarget.chapterRange.start - rightTarget.chapterRange.start || left.id.localeCompare(right.id);
      }));
  };

  const getStoryCausalGraphAtChapter = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const links = getStoryCausalLinksAtChapter(parsedChapter);
    const nodes = uniqueById(links.flatMap((link) => [eventAtChapter(link.sourceEventId, parsedChapter), eventAtChapter(link.targetEventId, parsedChapter)]));
    return Object.freeze({ chapter: parsedChapter, nodes: freeze(nodes), edges: links });
  };

  const getStoryPhaseDossier = (phaseId, chapter = null) => {
    const profile = getStoryPhaseProfile(phaseId);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!profile || !Number.isFinite(parsedChapter) || parsedChapter < profile.chapterRange.start) return null;
    const boundedEnd = Math.min(profile.chapterRange.end ?? parsedChapter, parsedChapter);
    const boundedRange = { start: profile.chapterRange.start, end: boundedEnd };
    const chapters = data.chapters.filter((record) => record.number >= boundedRange.start && record.number <= boundedRange.end);
    const events = data.events
      .filter((event) => rangesIntersect(event.chapterRange, boundedRange) && event.chapterRange.start <= parsedChapter)
      .map((event) => eventAtChapter(event, parsedChapter))
      .filter(Boolean);
    const lanes = (profile.laneIds || []).map(getStoryLaneProfile).filter(Boolean);
    return Object.freeze({
      profile,
      presentation: phasePresentationAtChapter(profile, parsedChapter),
      chapter: parsedChapter,
      chapters: freeze(chapters),
      lanes: freeze(lanes),
      laneDossiers: freeze(lanes.map((lane) => getStoryLaneDossier(lane.id, parsedChapter)).filter(Boolean)),
      events: freeze(events.sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.name.localeCompare(right.name))),
      entities: freeze(resolve(profile.entityIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      organizations: freeze(resolve(profile.organizationIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      locations: freeze(resolve(profile.locationIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      threads: freeze((profile.threadIds || []).map((id) => getStoryThreadDossier(id, parsedChapter)).filter(Boolean)),
      sources: freeze((profile.sourceIds || []).map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
    });
  };

  const getStoryLaneDossier = (laneId, chapter = null) => {
    const profile = getStoryLaneProfile(laneId);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!profile || !Number.isFinite(parsedChapter) || parsedChapter < profile.chapterRange.start) return null;
    const phases = Object.values(phaseProfiles)
      .filter((phase) => phase.laneIds.includes(profile.id) && phase.chapterRange.start <= parsedChapter)
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start);
    const events = (profile.eventIds || [])
      .map((id) => eventAtChapter(id, parsedChapter))
      .filter(Boolean)
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.name.localeCompare(right.name));
    const sourceIds = new Set([...(profile.sourceIds || []), ...events.flatMap((event) => event.sourceIds || [])]);
    return Object.freeze({
      profile,
      presentation: lanePresentationAtChapter(profile, parsedChapter, events),
      chapter: parsedChapter,
      phases: freeze(phases),
      events: freeze(events),
      threads: getStoryThreadsAtChapter(parsedChapter, { laneId: profile.id }),
      entities: freeze(resolve(profile.entityIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      organizations: freeze(resolve(profile.organizationIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      locations: freeze(resolve(profile.locationIds).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
      sources: freeze([...sourceIds].map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
    });
  };

  const getChapterStoryDossier = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const chapterRecord = archive.getChapter(parsedChapter);
    if (!chapterRecord) return null;
    const research = successionChapterResearchByNumber.get(parsedChapter) || null;
    const phase = getStoryPhaseAtChapter(parsedChapter);
    const phaseDossier = phase ? getStoryPhaseDossier(phase.id, parsedChapter) : null;
    const lanes = getStoryLanesAtChapter(parsedChapter);
    const threadDossiers = (chapterRecord.storyThreadIds || [])
      .map((id) => getStoryThreadDossier(id, parsedChapter))
      .filter(Boolean);
    const events = archive.getEventsForChapter(parsedChapter)
      .map((event) => eventAtChapter(event, parsedChapter))
      .filter(Boolean)
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.name.localeCompare(right.name));
    const startingEvents = events.filter((event) => event.canonicalChapterRange.start === parsedChapter);
    const continuingEvents = events.filter((event) => event.canonicalChapterRange.start < parsedChapter);
    const appearances = resolve((chapterRecord.appearanceRecords || []).map((record) => record.characterId));
    const incomingCausalLinks = (chapterRecord.incomingCausalLinkIds || []).map(getStoryCausalLink).filter(Boolean);
    const outgoingCausalLinks = (chapterRecord.outgoingCausalLinkIds || []).map(getStoryCausalLink).filter(Boolean);
    const sourceIds = new Set([
      ...(chapterRecord.sourceIds || []),
      ...(phase?.sourceIds || []),
      ...events.flatMap((event) => event.sourceIds || []),
      ...threadDossiers.flatMap((dossier) => dossier.profile.sourceIds || []),
    ]);
    return Object.freeze({
      chapter: chapterRecord,
      research,
      phase,
      phasePresentation: phaseDossier?.presentation || null,
      lanes,
      laneDossiers: phaseDossier?.laneDossiers || freeze([]),
      threads: freeze(threadDossiers),
      openThreads: freeze(threadDossiers.filter((dossier) => dossier.status === 'open')),
      resolvedThreads: freeze(threadDossiers.filter((dossier) => dossier.status === 'resolved')),
      events: freeze(events),
      startingEvents: freeze(startingEvents),
      continuingEvents: freeze(continuingEvents),
      appearances: freeze(appearances),
      locations: freeze(resolve(chapterRecord.locationIds)),
      abilities: freeze(resolve(chapterRecord.abilityIds)),
      organizations: freeze(resolve(chapterRecord.organizationIds)),
      incomingCausalLinks: freeze(incomingCausalLinks),
      outgoingCausalLinks: freeze(outgoingCausalLinks),
      previous: archive.getChapter(parsedChapter - 1),
      next: archive.getChapter(parsedChapter + 1),
      sources: freeze([...sourceIds].map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
      changes: freeze(uniqueStrings(startingEvents.flatMap((event) => [
        ...(event.stateChanges || []),
        ...(event.outcomes || []),
      ]))),
    });
  };

  const getStorySnapshotAtChapter = (chapter = null) => {
    const dossier = getChapterStoryDossier(chapter);
    if (!dossier) return null;
    const ongoingEvents = dossier.events.filter((event) => event.status === 'active-at-selected-chapter' || event.canonicalEvent?.status === 'ongoing');
    return Object.freeze({
      chapter: dossier.chapter.number,
      phase: dossier.phase,
      phasePresentation: dossier.phasePresentation,
      lanes: dossier.lanes,
      laneDossiers: dossier.laneDossiers,
      startingEvents: dossier.startingEvents,
      ongoingEvents: freeze(ongoingEvents),
      openThreads: dossier.openThreads,
      resolvedThreads: dossier.resolvedThreads,
      counts: Object.freeze({
        lanes: dossier.lanes.length,
        events: dossier.events.length,
        startingEvents: dossier.startingEvents.length,
        openThreads: dossier.openThreads.length,
        appearances: dossier.appearances.length,
      }),
    });
  };

  const searchStoryIntelligence = (query, { chapter = latestChapter, limit = 30, kind = null } = {}) => {
    const normalized = String(query || '').trim().toLocaleLowerCase();
    const parsedChapter = Number(chapter);
    if (!normalized || !Number.isFinite(parsedChapter)) return [];
    const records = [];
    for (const profile of Object.values(phaseProfiles)) {
      if (profile.chapterRange.start > parsedChapter || (kind && kind !== 'phase')) continue;
      const dossier = getStoryPhaseDossier(profile.id, parsedChapter);
      const presentation = dossier?.presentation;
      const text = [presentation?.name, presentation?.summary, profile.status].join(' ').toLocaleLowerCase();
      if (text.includes(normalized)) records.push({ kind: 'phase', id: profile.id, record: profile, displayName: presentation.name, displaySummary: presentation.summary, score: presentation.name.toLocaleLowerCase() === normalized ? 70 : 35 });
    }
    for (const profile of Object.values(laneProfiles)) {
      if (profile.chapterRange.start > parsedChapter || (kind && kind !== 'lane')) continue;
      const dossier = getStoryLaneDossier(profile.id, parsedChapter);
      const presentation = dossier?.presentation;
      const text = [presentation?.name, presentation?.summary, presentation?.objective].join(' ').toLocaleLowerCase();
      if (text.includes(normalized)) records.push({ kind: 'lane', id: profile.id, record: profile, displayName: presentation.name, displaySummary: presentation.summary, score: presentation.name.toLocaleLowerCase() === normalized ? 70 : 35 });
    }
    for (const profile of Object.values(threadProfiles)) {
      if (profile.chapterRange.start > parsedChapter || (kind && kind !== 'thread')) continue;
      const dossier = getStoryThreadDossier(profile.id, parsedChapter);
      const text = [profile.name, profile.question, profile.category, dossier.evidenceState].join(' ').toLocaleLowerCase();
      if (text.includes(normalized)) records.push({ kind: 'thread', id: profile.id, record: profile, displayName: profile.name, displaySummary: profile.question, score: profile.name.toLocaleLowerCase() === normalized ? 70 : 40 });
    }
    if (!kind || kind === 'chapter') {
      for (const chapterRecord of data.chapters) {
        if (chapterRecord.number > parsedChapter) continue;
        const research = successionChapterResearchByNumber.get(chapterRecord.number);
        const text = [chapterRecord.name, chapterRecord.summary, research?.phase, research?.voyageDay, ...(research?.lanes || []), ...(research?.threadLabels || [])].join(' ').toLocaleLowerCase();
        if (text.includes(normalized)) records.push({ kind: 'chapter', id: chapterRecord.id, record: chapterRecord, displayName: chapterRecord.name, displaySummary: research?.focus || chapterRecord.summary, score: String(chapterRecord.number) === normalized ? 80 : 30 });
      }
    }
    return records.sort((left, right) => right.score - left.score || left.id.localeCompare(right.id)).slice(0, limit);
  };

  const getStoryIntelligenceClosureReport = () => {
    const phases = Object.values(phaseProfiles).sort((left, right) => left.chapterRange.start - right.chapterRange.start);
    const lanes = Object.values(laneProfiles);
    const threads = Object.values(threadProfiles);
    const causalLinks = Object.values(causalLinksById);
    const phaseCoverageIssues = [];
    for (let chapter = data.chapters[0]?.number || 340; chapter <= latestChapter; chapter += 1) {
      const matches = phases.filter((profile) => includesChapter(profile.chapterRange, chapter));
      if (matches.length !== 1) phaseCoverageIssues.push(Object.freeze({ chapter, phaseIds: matches.map((profile) => profile.id) }));
    }
    const phaseContinuityIssues = [];
    for (let index = 1; index < phases.length; index += 1) {
      const previous = phases[index - 1];
      const current = phases[index];
      if ((previous.chapterRange.end ?? previous.chapterRange.start) + 1 !== current.chapterRange.start) phaseContinuityIssues.push(Object.freeze({ previous: previous.id, current: current.id }));
    }
    const missingReferences = [];
    const checkEntityIds = (ownerId, ids) => {
      for (const id of ids || []) if (!archive.getEntityById(id)) missingReferences.push(Object.freeze({ ownerId, missingId: id }));
    };
    const checkProfile = (profile) => {
      checkEntityIds(profile.id, profile.eventIds);
      checkEntityIds(profile.id, profile.entityIds);
      checkEntityIds(profile.id, profile.organizationIds);
      checkEntityIds(profile.id, profile.locationIds);
      checkEntityIds(profile.id, profile.abilityIds);
      checkEntityIds(profile.id, profile.sourceIds);
      for (const id of profile.laneIds || []) if (!laneProfiles[id]) missingReferences.push(Object.freeze({ ownerId: profile.id, missingId: id }));
      for (const id of profile.threadIds || []) if (!threadProfiles[id]) missingReferences.push(Object.freeze({ ownerId: profile.id, missingId: id }));
    };
    phases.forEach(checkProfile);
    lanes.forEach(checkProfile);
    threads.forEach(checkProfile);
    for (const link of causalLinks) {
      checkEntityIds(link.id, [link.sourceEventId, link.targetEventId, ...link.sourceIds]);
      if (link.sourceEventId === link.targetEventId) missingReferences.push(Object.freeze({ ownerId: link.id, missingId: 'self-referential-causal-link' }));
    }
    const chapterProjectionIssues = data.chapters.filter((chapter) => {
      const pending = chapter.storyIntelligenceStatus === 'Reader media indexed; detailed research pending verified chapter documentation';
      return chapter.storyPhaseIds?.length !== 1
        || !chapter.storyCoverage?.phase
        || (!pending && (!chapter.storyLaneIds?.length || !chapter.storyThreadIds?.length));
    });
    const eventProjectionIssues = data.events.filter((event) => {
      const opening = eventAtChapter(event, event.chapterRange.start);
      const matureChapter = Math.max(event.chapterRange.end ?? event.chapterRange.start, ...(event.sourceIds || []).map((id) => archive.getEntityById(id)?.chapter).filter(Number.isFinite));
      const mature = eventAtChapter(event, matureChapter);
      return !opening || !mature || opening.id !== event.id || mature.id !== event.id;
    });
    const pendingChapters = data.chapters.filter((chapter) => chapter.storyIntelligenceStatus === 'Reader media indexed; detailed research pending verified chapter documentation');
    const closureReady = Boolean(getEventKnowledge)
      && phases.length >= 10
      && lanes.length === 7
      && threads.length >= 15
      && causalLinks.length >= 15
      && phaseCoverageIssues.length === 0
      && phaseContinuityIssues.length === 0
      && missingReferences.length === 0
      && chapterProjectionIssues.length === 0
      && eventProjectionIssues.length === 0;
    return Object.freeze({
      status: closureReady ? 'closed' : 'open',
      closureReady,
      chapterRange: Object.freeze({ start: data.chapters[0]?.number || 340, end: latestChapter }),
      counts: Object.freeze({ phases: phases.length, lanes: lanes.length, threads: threads.length, causalLinks: causalLinks.length, chapters: data.chapters.length, pendingChapters: pendingChapters.length, events: data.events.length }),
      phaseCoverageIssues: freeze(phaseCoverageIssues),
      phaseContinuityIssues: freeze(phaseContinuityIssues),
      missingReferences: freeze(missingReferences),
      chapterProjectionIssues: freeze(chapterProjectionIssues),
      eventProjectionIssues: freeze(eventProjectionIssues),
      pendingChapterIds: freeze(pendingChapters.map((chapter) => chapter.id)),
    });
  };

  return Object.freeze({
    getStoryPhaseProfile,
    getStoryPhaseAtChapter,
    getStoryPhaseDossier,
    getStoryLaneProfile,
    getStoryLanesAtChapter,
    getStoryLaneDossier,
    getStoryThreadProfile,
    getStoryThreadDossier,
    getStoryThreadsAtChapter,
    getStoryCausalLink,
    getStoryCausalLinksAtChapter,
    getStoryCausalGraphAtChapter,
    getChapterStoryDossier,
    getStorySnapshotAtChapter,
    searchStoryIntelligence,
    getStoryIntelligenceClosureReport,
  });
};
