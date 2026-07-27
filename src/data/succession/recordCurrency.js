const freeze = (value) => Object.freeze(value);
const unique = (values) => [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))];
const maxFinite = (values, fallback = null) => {
  const finite = values.map(Number).filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : fallback;
};
const rangeStart = (record) => Number(record?.chapterRange?.start);
const rangeEnd = (record) => Number(record?.chapterRange?.end);
const chapterOf = (record) => maxFinite([
  record?.chapter,
  record?.number,
  rangeStart(record),
], null);
const sourceChapterOf = (source) => maxFinite([
  source?.chapter,
  source?.number,
  rangeStart(source),
  rangeEnd(source),
], null);
const statusText = (record) => [
  record?.status,
  record?.publicationStatus,
  record?.operationalState,
  record?.state,
  record?.status?.life,
  record?.status?.operational,
].flat().filter(Boolean).join(' ').toLowerCase();
const isClosedStatus = (record) => /deceased|dead|destroyed|dissolved|resolved|completed|inactive|terminated|closed|removed/.test(statusText(record));
const isPendingStatus = (record) => /pending|unreviewed|awaiting|partial|limited/.test(statusText(record));
const currentBearingTypes = new Set(['character', 'organization', 'ability', 'guardian-beast', 'assignment', 'relationship']);
const domainForType = (type) => ({
  character: 'characters',
  organization: 'organizations',
  ability: 'abilities',
  location: 'locations',
  event: 'events',
  assignment: 'assignments',
  relationship: 'relationships',
  source: 'sources',
  chapter: 'chapters',
  'guardian-beast': 'guardianBeasts',
}[type] || `${type || 'records'}s`);

export function createRecordCurrencySelectors({ data, archiveBoundary }) {
  const boundary = Number(archiveBoundary) || maxFinite((data.chapters || []).map((chapter) => chapter.number), 413);
  const sources = data.sources || [];
  const sourceById = new Map(sources.map((source) => [source.id, source]));
  const entityCollections = [
    ...(data.characters || []),
    ...(data.organizations || []),
    ...(data.abilities || []),
    ...(data.guardianBeasts || []),
    ...(data.locations || []),
    ...(data.events || []),
    ...(data.assignments || []),
    ...(data.relationships || []),
    ...sources,
    ...(data.chapters || []),
  ];
  const entityById = new Map(entityCollections.map((record) => [record.id, record]));

  const linkedEvidenceRecords = (entity) => {
    if (!entity) return [];
    const id = entity.id;
    const linked = [];
    const add = (record, reason) => {
      if (!record) return;
      const sourceChapters = (record.sourceIds || []).map((sourceId) => sourceChapterOf(sourceById.get(sourceId))).filter(Number.isFinite);
      const chapter = maxFinite(sourceChapters, chapterOf(record));
      if (!Number.isFinite(chapter)) return;
      linked.push({ record, chapter, reason });
    };

    add(entity, 'record');
    (entity.sourceIds || []).forEach((sourceId) => add(sourceById.get(sourceId), 'direct source'));

    for (const chapter of data.chapters || []) {
      if (chapter.id === id) add(chapter, 'chapter record');
      if ((chapter.appearanceRecords || []).some((appearance) => appearance.characterId === id)) add(chapter, 'appearance');
      if ((chapter.eventIds || []).includes(id)) add(chapter, 'event chapter');
      if ((chapter.locationIds || []).includes(id)) add(chapter, 'location chapter');
      if ((chapter.abilityIds || []).includes(id)) add(chapter, 'ability chapter');
      if ((chapter.organizationIds || []).includes(id)) add(chapter, 'organization chapter');
    }

    for (const event of data.events || []) {
      if ((event.participantIds || []).includes(id)
        || (event.locationIds || []).includes(id)
        || (event.abilityIds || []).includes(id)
        || (event.organizationIds || []).includes(id)
        || event.id === id) add(event, 'event evidence');
    }

    for (const assignment of data.assignments || []) {
      if ([assignment.id, assignment.personId, assignment.subjectId, assignment.principalId, assignment.reportingToId, assignment.locationId, assignment.allegianceId].includes(id)
        || (assignment.relatedEntityIds || []).includes(id)) add(assignment, 'assignment evidence');
    }

    for (const relationship of data.relationships || []) {
      if ([relationship.id, relationship.sourceEntityId, relationship.targetEntityId].includes(id)
        || (relationship.participantIds || []).includes(id)) add(relationship, 'relationship evidence');
    }

    const profileCollections = [data.characterStateProfiles, data.organizationStateProfiles, data.guardianBeastStateProfiles];
    for (const collection of profileCollections) {
      const profile = collection?.[id] || [];
      for (const record of Array.isArray(profile) ? profile : []) add(record, 'state evidence');
    }

    return [...new Map(linked.map((entry) => [`${entry.record.id || entry.reason}:${entry.chapter}`, entry])).values()]
      .sort((left, right) => right.chapter - left.chapter);
  };

  const requiresCurrentReview = (entity) => {
    if (!entity || !currentBearingTypes.has(entity.entityType)) return false;
    if (isClosedStatus(entity)) return false;
    const end = rangeEnd(entity);
    if (Number.isFinite(end) && end < boundary && !/active|current|ongoing|developing/.test(statusText(entity))) return false;
    return true;
  };

  const getRecordCurrency = (entityOrId, readingBoundary = boundary, checkpoint = 413) => {
    const entity = typeof entityOrId === 'string' ? entityById.get(entityOrId) : entityOrId;
    if (!entity) return null;
    const selectedBoundary = Math.min(boundary, Number(readingBoundary) || boundary);
    const evidence = linkedEvidenceRecords(entity).filter((entry) => entry.chapter <= selectedBoundary);
    const latestVerifiedChapter = maxFinite(evidence.map((entry) => entry.chapter), chapterOf(entity));
    const currentReview = requiresCurrentReview(entity);
    const gap = currentReview && Number.isFinite(latestVerifiedChapter) && latestVerifiedChapter < selectedBoundary
      ? freeze({ from: latestVerifiedChapter + 1, to: selectedBoundary })
      : currentReview && !Number.isFinite(latestVerifiedChapter)
        ? freeze({ from: null, to: selectedBoundary })
        : null;
    const recentEvidence = evidence.filter((entry) => entry.chapter > checkpoint);
    const recentChanges = unique([
      ...recentEvidence.map((entry) => `${entry.reason.replace(/\b\w/g, (letter) => letter.toUpperCase())} recorded in Chapter ${entry.chapter}.`),
      ...(entity.recentChanges || []),
    ]).slice(0, 8);
    const uncertaintyText = [entity.summary, entity.note, entity.conditions, entity.status?.note]
      .flat().filter(Boolean).join(' ');
    const openQuestions = unique([
      ...(entity.openQuestions || []),
      ...(entity.unresolvedQuestions || []),
      gap ? `This active record has no maintained evidence for ${gap.from ? `Chapters ${gap.from}–${gap.to}` : `the selected Chapter ${gap.to} boundary`}.` : null,
      /unknown|unresolved|unrevealed|unclear|pending/i.test(uncertaintyText)
        ? 'One or more mechanics, states, or relationships remain explicitly unresolved in the maintained record.'
        : null,
    ]).slice(0, 8);
    const state = gap ? 'behind' : isPendingStatus(entity) ? 'pending' : currentReview ? 'current' : 'historical';

    return freeze({
      entityId: entity.id,
      domain: domainForType(entity.entityType),
      readingBoundary: selectedBoundary,
      archiveMaximum: boundary,
      latestVerifiedChapter,
      verifiedLabel: Number.isFinite(latestVerifiedChapter) ? `Chapter ${latestVerifiedChapter}` : 'No chapter evidence',
      coverageGap: gap,
      state,
      currentReview,
      recentChanges: freeze(recentChanges),
      openQuestions: freeze(openQuestions),
      evidenceCount: evidence.length,
    });
  };

  const getRecentChangesForRecord = (entityOrId, options = {}) => getRecordCurrency(
    entityOrId,
    options.readingBoundary ?? boundary,
    options.checkpoint ?? 413,
  )?.recentChanges || freeze([]);

  const getOpenQuestionsForRecord = (entityOrId, options = {}) => getRecordCurrency(
    entityOrId,
    options.readingBoundary ?? boundary,
    options.checkpoint ?? 413,
  )?.openQuestions || freeze([]);

  const getArchiveCoverageReport = (readingBoundary = boundary) => {
    const selectedBoundary = Math.min(boundary, Number(readingBoundary) || boundary);
    const domains = {};
    for (const entity of entityCollections) {
      const domain = domainForType(entity.entityType);
      const currency = getRecordCurrency(entity, selectedBoundary);
      const current = domains[domain] || { domain, total: 0, current: 0, behind: 0, pending: 0, historical: 0, noEvidence: 0, latestVerifiedChapter: null };
      current.total += 1;
      current[currency.state] = (current[currency.state] || 0) + 1;
      if (!Number.isFinite(currency.latestVerifiedChapter)) current.noEvidence += 1;
      current.latestVerifiedChapter = maxFinite([current.latestVerifiedChapter, currency.latestVerifiedChapter], current.latestVerifiedChapter);
      domains[domain] = current;
    }
    const domainRecords = Object.values(domains)
      .map((record) => freeze({ ...record }))
      .sort((left, right) => left.domain.localeCompare(right.domain));
    return freeze({
      readingBoundary: selectedBoundary,
      archiveMaximum: boundary,
      detailedResearchThrough: maxFinite((data.chapters || [])
        .filter((chapter) => !/pending/i.test(chapter.storyIntelligenceStatus || chapter.researchStatus || ''))
        .map((chapter) => chapter.number), null),
      domains: freeze(domainRecords),
      recordsBehindBoundary: domainRecords.reduce((sum, record) => sum + record.behind, 0),
      recordsPendingReview: domainRecords.reduce((sum, record) => sum + record.pending, 0),
      generatedAt: '2026-07-27',
    });
  };

  return freeze({
    getRecordCurrency,
    getRecentChangesForRecord,
    getOpenQuestionsForRecord,
    getArchiveCoverageReport,
  });
}
