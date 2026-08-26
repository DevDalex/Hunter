const freeze = (values = []) => Object.freeze([...values]);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const stable = (value) => JSON.stringify(value);
const titleCase = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());
const includesChapter = (range = {}, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return Number(chapter) >= Number(range.start) && Number(chapter) <= Number(end);
};
const asArray = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const displayValue = (value) => {
  if (Array.isArray(value)) return value.length ? value.map(displayValue).join(' · ') : 'None published';
  if (value && typeof value === 'object') return Object.values(value).map(displayValue).filter(Boolean).join(' · ') || 'None published';
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return value == null || value === '' ? 'None published' : String(value);
};

const compareFields = (fromState, toState) => {
  const keys = unique([...Object.keys(fromState || {}), ...Object.keys(toState || {})]);
  return freeze(keys.flatMap((key) => {
    const before = fromState?.[key];
    const after = toState?.[key];
    if (stable(before) === stable(after)) return [];
    return [Object.freeze({ key, label: titleCase(key), before, after })];
  }));
};

const compactEntity = (entity) => entity ? Object.freeze({
  id: entity.id,
  entityType: entity.entityType,
  name: entity.name,
  slug: entity.slug,
}) : null;

export const createHighValueIntelligenceSelectors = ({
  data,
  archive,
  characterStates,
  organizationStates,
  nenSystems,
  eventKnowledge,
  informationConsistency,
}) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const earliestChapter = data.chapters.at(0)?.number || 338;
  const clampChapter = (chapter) => Math.min(latestChapter, Math.max(earliestChapter, Number(chapter) || latestChapter));
  const knowledgeRecords = archive.getEntitiesByType('knowledge-record');
  const protocolRecords = archive.getEntitiesByType('protocol');
  const artifactRecords = freeze([
    ...archive.getEntitiesByType('object'),
    ...archive.getEntitiesByType('document'),
    ...archive.getEntitiesByType('evidence-item'),
  ]);
  const meaningfulTypes = Object.freeze([
    'character', 'organization', 'ability', 'guardian-beast', 'location', 'event',
    'assignment', 'relationship', 'knowledge-record', 'protocol', 'object', 'document', 'evidence-item',
  ]);

  const sourceChapterNumbers = (entity) => (entity?.sourceIds || [])
    .map((id) => archive.getEntityById(id)?.chapter)
    .filter(Number.isFinite);

  const firstKnownChapter = (entity) => {
    if (!entity) return null;
    if (Number.isFinite(entity.number)) return entity.number;
    if (Number.isFinite(entity.chapterRange?.start)) return entity.chapterRange.start;
    if (Number.isFinite(entity.firstChapter)) return entity.firstChapter;
    const sourceChapters = sourceChapterNumbers(entity);
    if (entity.entityType === 'character') {
      sourceChapters.push(...archive.getAppearancesForCharacter(entity.id).map((record) => record.chapter));
      sourceChapters.push(...(data.characterStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'organization') {
      sourceChapters.push(...archive.getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
      sourceChapters.push(...(data.organizationStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    const finite = sourceChapters.filter(Number.isFinite);
    return finite.length ? Math.min(...finite) : earliestChapter;
  };

  const availableAtChapter = (entity, chapter) => {
    if (!entity) return false;
    if (entity.entityType === 'chapter') return entity.number <= chapter;
    if (entity.entityType === 'source') return !Number.isFinite(entity.chapter) || entity.chapter <= chapter;
    return firstKnownChapter(entity) <= chapter;
  };

  const resolveIds = (ids = []) => freeze(unique(ids).map((id) => archive.getEntityById(id)).filter(Boolean).map(compactEntity));

  const assignmentState = (entity, chapter) => includesChapter(entity.chapterRange, chapter) ? Object.freeze({
    active: true,
    status: entity.status,
    assignmentType: entity.assignmentType,
    secrecy: entity.secrecy,
    personId: entity.personId,
    subjectEntityId: entity.subjectEntityId || null,
    principalEntityId: entity.principalEntityId || null,
    locationId: entity.locationId || null,
    allegianceEntityId: entity.allegianceEntityId || null,
    reportingEntityId: entity.reportingEntityId || null,
  }) : null;

  const relationshipState = (entity, chapter) => includesChapter(entity.chapterRange, chapter) ? Object.freeze({
    active: true,
    relationshipType: entity.relationshipType,
    sentiment: entity.sentiment,
    direction: entity.direction,
    sourceEntityId: entity.sourceEntityId,
    targetEntityId: entity.targetEntityId,
    certainty: entity.certainty || 'confirmed',
  }) : null;

  const getEntityStateAtChapter = (entityOrId, chapter = latestChapter) => {
    const entity = typeof entityOrId === 'string' ? archive.getEntityById(entityOrId) : entityOrId;
    const boundary = clampChapter(chapter);
    if (!entity || !availableAtChapter(entity, boundary)) return null;

    if (entity.entityType === 'character') {
      const state = informationConsistency.getCanonicalCharacterState(entity.id, boundary);
      const authority = informationConsistency.getCharacterAuthorityProfile(entity.id, boundary);
      const loyalty = informationConsistency.getCharacterLoyaltyProfile(entity.id, boundary);
      const locationRecord = archive.getCurrentLocationRecordForCharacter(entity.id, boundary);
      const assignments = archive.getAssignmentsForPerson(entity.id).filter((record) => includesChapter(record.chapterRange, boundary)).map((record) => record.id);
      const relationships = archive.getActiveRelationshipsAtChapter(boundary).filter((record) => record.sourceEntityId === entity.id || record.targetEntityId === entity.id).map((record) => record.id);
      return Object.freeze({
        life: state?.life || entity.status?.life || 'unknown',
        body: state?.bodyStateCode || 'unknown',
        identity: state?.identityStateCode || 'unresolved',
        consciousness: state?.consciousnessStateCode || 'unknown',
        loyalty: loyalty?.evidenceCode || state?.loyaltyStateCode || 'unknown',
        officialRoleKind: authority?.officialRoleKind || 'unclassified',
        roles: freeze((entity.roles || []).slice().sort()),
        affiliations: freeze((loyalty?.declaredAffiliations || []).map((record) => record.organization?.id).filter(Boolean).sort()),
        locationId: locationRecord?.locationId || state?.locationId || null,
        assignmentIds: freeze(assignments.sort()),
        relationshipIds: freeze(relationships.sort()),
      });
    }

    if (entity.entityType === 'organization') {
      const state = organizationStates.getOrganizationStateAtChapter(entity.id, boundary);
      const personnel = organizationStates.getOrganizationPersonnelAtChapter(entity.id, boundary) || [];
      return Object.freeze({
        status: state?.status || entity.status || 'unknown',
        operationalState: state?.operationalState || entity.operationalState || 'unknown',
        authority: state?.authority || entity.authorityBasis || 'unknown',
        objective: state?.objective || entity.objective || 'unknown',
        personnelIds: freeze(asArray(personnel).map((record) => record.characterId || record.id).filter(Boolean).sort()),
        leaderIds: freeze((entity.leaderIds || []).slice().sort()),
      });
    }

    if (entity.entityType === 'ability') {
      const knowledge = nenSystems.getAbilityKnowledgeAtChapter(entity.id, boundary);
      if (!knowledge?.known) return null;
      return Object.freeze({
        known: true,
        knowledgeState: knowledge.knowledgeState || knowledge.state || 'known',
        activation: knowledge.activation || entity.activation || 'unknown',
        conditions: freeze((knowledge.conditions || entity.conditions || []).slice().sort()),
        limitations: freeze((knowledge.limitations || entity.limitations || []).slice().sort()),
        costs: freeze((knowledge.costs || entity.costs || []).slice().sort()),
        ownerIds: freeze((entity.ownerIds || []).slice().sort()),
      });
    }

    if (entity.entityType === 'guardian-beast') {
      const state = nenSystems.getGuardianBeastStateAtChapter(entity.id, boundary);
      if (!state) return null;
      return Object.freeze({
        state: state.state || state.operationalState || 'known',
        hostCharacterId: entity.hostCharacterId,
        knownAbilityIds: freeze((state.knownAbilityIds || entity.knownAbilityIds || []).slice().sort()),
        suspectedAbilityIds: freeze((state.suspectedAbilityIds || entity.suspectedAbilityIds || []).slice().sort()),
        activity: state.activity || state.summary || 'known',
      });
    }

    if (entity.entityType === 'event') {
      const event = eventKnowledge.getStoryEventKnowledgeAtChapter(entity.id, boundary);
      if (!event) return null;
      return Object.freeze({
        status: event.status,
        mature: event.mature,
        visibleThroughChapter: event.visibleThroughChapter,
        participantIds: freeze((event.participantIds || []).slice().sort()),
        organizationIds: freeze((event.organizationIds || []).slice().sort()),
        locationIds: freeze((event.locationIds || []).slice().sort()),
        abilityIds: freeze((event.abilityIds || []).slice().sort()),
        outcomeCount: event.outcomes?.length || 0,
        stateChangeCount: event.stateChanges?.length || 0,
      });
    }

    if (entity.entityType === 'location') {
      const snapshot = archive.getLocationSnapshot(entity.id, boundary);
      return Object.freeze({
        accessLevel: entity.accessLevel || 'unknown',
        zoneRole: entity.zoneRole || 'unknown',
        occupantIds: freeze((snapshot?.occupants || snapshot?.entities || []).map((record) => record.characterId || record.id).filter(Boolean).sort()),
        activeEventIds: freeze(archive.getEventsAtLocation(entity.id).filter((event) => includesChapter(event.chapterRange, boundary)).map((event) => event.id).sort()),
        activeAssignmentIds: freeze(archive.getAssignmentsAtLocation(entity.id).filter((record) => includesChapter(record.chapterRange, boundary)).map((record) => record.id).sort()),
      });
    }

    if (entity.entityType === 'assignment') return assignmentState(entity, boundary);
    if (entity.entityType === 'relationship') return relationshipState(entity, boundary);

    if (entity.entityType === 'knowledge-record') return includesChapter(entity.chapterRange, boundary) ? Object.freeze({
      knowledgeState: entity.publicAtChapter && entity.publicAtChapter <= boundary ? 'public' : entity.knowledgeState,
      secrecy: entity.publicAtChapter && entity.publicAtChapter <= boundary ? 'announced' : entity.secrecy,
      subjectEntityIds: freeze((entity.subjectEntityIds || []).slice().sort()),
      knowerEntityIds: freeze((entity.knowerEntityIds || []).slice().sort()),
      misinformedEntityIds: freeze((entity.misinformedEntityIds || []).slice().sort()),
      publicAtChapter: entity.publicAtChapter || null,
    }) : null;

    if (entity.entityType === 'protocol') return includesChapter(entity.chapterRange, boundary) ? Object.freeze({
      domain: entity.domain,
      protocolStatus: entity.protocolStatus,
      authority: entity.authority,
      ruleStatement: entity.ruleStatement,
      trigger: entity.trigger,
      scope: entity.scope,
      enforcement: entity.enforcement,
      exceptionCount: entity.exceptions?.length || 0,
      openQuestionCount: entity.openQuestions?.length || 0,
    }) : null;

    if (['object', 'document', 'evidence-item'].includes(entity.entityType)) return includesChapter(entity.chapterRange, boundary) ? Object.freeze({
      category: entity.artifactCategory || entity.documentCategory || entity.evidenceCategory || 'unknown',
      artifactState: entity.artifactState || 'unknown',
      ownerEntityIds: freeze((entity.ownerEntityIds || entity.authorEntityIds || entity.subjectEntityIds || []).slice().sort()),
      holderEntityIds: freeze((entity.holderEntityIds || entity.recipientEntityIds || []).slice().sort()),
      locationEntityIds: freeze((entity.locationEntityIds || []).slice().sort()),
      linkedArtifactIds: freeze((entity.linkedArtifactIds || []).slice().sort()),
      nenStatus: entity.nenStatus || 'not specified',
      legalSignificance: entity.legalSignificance || 'not specified',
      evidenceRole: entity.evidenceRole || entity.evidentiaryUse || 'not specified',
      custodyStatus: entity.custodyStatus || entity.chainOfCustody?.at(-1)?.state || 'unknown',
    }) : null;

    return Object.freeze({
      status: entity.status || entity.publicationStatus || 'published',
      canonLevel: entity.canonLevel || 'canon',
      summary: entity.summary || '',
    });
  };

  const getChapterStateDiff = (fromChapter, toChapter, { types = meaningfulTypes, changedOnly = true } = {}) => {
    const from = clampChapter(fromChapter);
    const to = clampChapter(toChapter);
    const allowed = new Set(types || meaningfulTypes);
    const entities = unique([...allowed].flatMap((type) => archive.getEntitiesByType(type))).sort((left, right) => left.id.localeCompare(right.id));
    const records = [];
    const byType = new Map();

    for (const entity of entities) {
      const before = getEntityStateAtChapter(entity, from);
      const after = getEntityStateAtChapter(entity, to);
      const status = before == null && after != null
        ? 'added'
        : before != null && after == null
          ? 'removed'
          : before != null && after != null && stable(before) !== stable(after)
            ? 'changed'
            : 'unchanged';
      const deltas = status === 'changed' ? compareFields(before, after) : freeze([]);
      if (changedOnly && status === 'unchanged') continue;
      const record = Object.freeze({ entity: compactEntity(entity), status, before, after, deltas });
      records.push(record);
      const summary = byType.get(entity.entityType) || { added: 0, removed: 0, changed: 0, unchanged: 0 };
      summary[status] += 1;
      byType.set(entity.entityType, summary);
    }

    return Object.freeze({
      fromChapter: from,
      toChapter: to,
      direction: from === to ? 'same-boundary' : from < to ? 'forward' : 'reverse',
      records: freeze(records),
      summary: Object.freeze({
        total: records.length,
        added: records.filter((record) => record.status === 'added').length,
        removed: records.filter((record) => record.status === 'removed').length,
        changed: records.filter((record) => record.status === 'changed').length,
        unchanged: records.filter((record) => record.status === 'unchanged').length,
        byType: Object.freeze(Object.fromEntries([...byType.entries()].map(([type, counts]) => [type, Object.freeze(counts)]))),
      }),
    });
  };

  const getKnowledgeRecord = (idOrSlug) => knowledgeRecords.find((record) => record.id === idOrSlug || record.slug === idOrSlug) || null;
  const getKnowledgeRecordsAtChapter = (chapter = latestChapter, { state = null, entityId = null } = {}) => {
    const boundary = clampChapter(chapter);
    return freeze(knowledgeRecords
      .filter((record) => includesChapter(record.chapterRange, boundary))
      .map((record) => Object.freeze({
        ...record,
        chapter: boundary,
        currentKnowledgeState: record.publicAtChapter && record.publicAtChapter <= boundary ? 'public' : record.knowledgeState,
        subjects: resolveIds(record.subjectEntityIds),
        knowers: resolveIds(record.knowerEntityIds),
        misinformed: resolveIds(record.misinformedEntityIds),
      }))
      .filter((record) => !state || record.currentKnowledgeState === state)
      .filter((record) => !entityId || [...record.subjectEntityIds, ...record.knowerEntityIds, ...record.misinformedEntityIds].includes(entityId))
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.name.localeCompare(right.name)));
  };
  const getKnowledgeForEntity = (entityId, chapter = latestChapter) => getKnowledgeRecordsAtChapter(chapter, { entityId });
  const getKnowledgeMatrix = (chapter = latestChapter) => {
    const records = getKnowledgeRecordsAtChapter(chapter);
    const states = Object.freeze(Object.fromEntries(unique(records.map((record) => record.currentKnowledgeState)).sort().map((state) => [state, records.filter((record) => record.currentKnowledgeState === state).length])));
    return Object.freeze({ chapter: clampChapter(chapter), records, states, publicCount: records.filter((record) => record.currentKnowledgeState === 'public').length, secretCount: records.filter((record) => record.currentKnowledgeState === 'secret').length });
  };

  const getProtocolRecord = (idOrSlug) => protocolRecords.find((record) => record.id === idOrSlug || record.slug === idOrSlug) || null;
  const getProtocolRecordsAtChapter = (chapter = latestChapter, { domain = null, status = null, entityId = null } = {}) => {
    const boundary = clampChapter(chapter);
    return freeze(protocolRecords
      .filter((record) => includesChapter(record.chapterRange, boundary))
      .filter((record) => !domain || record.domain === domain)
      .filter((record) => !status || record.protocolStatus === status)
      .filter((record) => !entityId || record.linkedEntityIds?.includes(entityId))
      .map((record) => Object.freeze({ ...record, chapter: boundary, linkedEntities: resolveIds(record.linkedEntityIds) }))
      .sort((left, right) => left.domain.localeCompare(right.domain) || left.name.localeCompare(right.name)));
  };

  const getArtifactRecord = (idOrSlug) => artifactRecords.find((record) => record.id === idOrSlug || record.slug === idOrSlug) || null;
  const getArtifactsAtChapter = (chapter = latestChapter, { entityType = null, category = null, entityId = null } = {}) => {
    const boundary = clampChapter(chapter);
    return freeze(artifactRecords
      .filter((record) => includesChapter(record.chapterRange, boundary))
      .filter((record) => !entityType || record.entityType === entityType)
      .filter((record) => !category || [record.artifactCategory, record.documentCategory, record.evidenceCategory].includes(category))
      .filter((record) => !entityId || [
        ...(record.ownerEntityIds || []), ...(record.holderEntityIds || []), ...(record.authorEntityIds || []),
        ...(record.recipientEntityIds || []), ...(record.subjectEntityIds || []), ...(record.locationEntityIds || []),
      ].includes(entityId))
      .map((record) => Object.freeze({
        ...record,
        chapter: boundary,
        owners: resolveIds(record.ownerEntityIds || record.authorEntityIds || record.subjectEntityIds),
        holders: resolveIds(record.holderEntityIds || record.recipientEntityIds),
        locations: resolveIds(record.locationEntityIds),
        linkedArtifacts: freeze((record.linkedArtifactIds || []).map((id) => getArtifactRecord(id)).filter(Boolean).map(compactEntity)),
      }))
      .sort((left, right) => left.entityType.localeCompare(right.entityType) || left.name.localeCompare(right.name)));
  };
  const getEvidenceForArtifact = (artifactId, chapter = latestChapter) => freeze(getArtifactsAtChapter(chapter, { entityType: 'evidence-item' }).filter((record) => record.linkedArtifactIds?.includes(artifactId)));

  const fieldMaps = Object.freeze({
    character: Object.freeze([
      ['life', 'Life'], ['body', 'Body'], ['identity', 'Identity'], ['consciousness', 'Consciousness'],
      ['officialRoleKind', 'Official role kind'], ['roles', 'Registered roles'], ['affiliations', 'Declared affiliations'],
      ['loyalty', 'Operational loyalty evidence'], ['locationId', 'Location'], ['assignmentIds', 'Active assignments'],
    ]),
    ability: Object.freeze([
      ['knowledgeState', 'Knowledge state'], ['activation', 'Activation'], ['conditions', 'Conditions'],
      ['limitations', 'Limitations'], ['costs', 'Costs'], ['ownerIds', 'Owners'],
    ]),
    organization: Object.freeze([
      ['status', 'Status'], ['operationalState', 'Operational state'], ['authority', 'Authority'],
      ['objective', 'Objective'], ['leaderIds', 'Leaders'], ['personnelIds', 'Personnel'],
    ]),
    'guardian-beast': Object.freeze([
      ['state', 'State'], ['hostCharacterId', 'Host'], ['knownAbilityIds', 'Known abilities'],
      ['suspectedAbilityIds', 'Suspected abilities'], ['activity', 'Activity'],
    ]),
    'knowledge-record': Object.freeze([
      ['knowledgeState', 'Knowledge state'], ['secrecy', 'Secrecy'], ['subjectEntityIds', 'Subjects'],
      ['knowerEntityIds', 'Knowers'], ['misinformedEntityIds', 'Misinformed parties'], ['publicAtChapter', 'Public chapter'],
    ]),
    protocol: Object.freeze([
      ['domain', 'Domain'], ['protocolStatus', 'Status'], ['authority', 'Authority'], ['ruleStatement', 'Rule'],
      ['trigger', 'Trigger'], ['scope', 'Scope'], ['enforcement', 'Enforcement'], ['exceptionCount', 'Exceptions'],
    ]),
    object: Object.freeze([
      ['category', 'Category'], ['artifactState', 'State'], ['ownerEntityIds', 'Owners'], ['holderEntityIds', 'Holders'],
      ['locationEntityIds', 'Locations'], ['nenStatus', 'Nen status'], ['legalSignificance', 'Legal significance'], ['evidenceRole', 'Evidence role'],
    ]),
    document: Object.freeze([
      ['category', 'Category'], ['artifactState', 'State'], ['ownerEntityIds', 'Authors'], ['holderEntityIds', 'Recipients'],
      ['locationEntityIds', 'Locations'], ['legalSignificance', 'Legal significance'], ['evidenceRole', 'Evidence role'],
    ]),
    'evidence-item': Object.freeze([
      ['category', 'Category'], ['artifactState', 'State'], ['ownerEntityIds', 'Subjects'], ['linkedArtifactIds', 'Linked artifacts'],
      ['evidenceRole', 'Evidentiary use'], ['custodyStatus', 'Custody'],
    ]),
  });

  const compareSameTypeRecords = (entityIds, chapter = latestChapter) => {
    const ids = unique(entityIds).slice(0, 4);
    const entities = ids.map((id) => archive.getEntityById(id)).filter(Boolean);
    if (entities.length < 2) return Object.freeze({ valid: false, reason: 'Select at least two published records.', records: freeze(entities.map(compactEntity)), rows: freeze([]) });
    const type = entities[0].entityType;
    if (entities.some((entity) => entity.entityType !== type)) return Object.freeze({ valid: false, reason: 'Comparison requires records of the same entity type.', records: freeze(entities.map(compactEntity)), rows: freeze([]) });
    const boundary = clampChapter(chapter);
    const states = entities.map((entity) => getEntityStateAtChapter(entity, boundary));
    if (states.some((state) => state == null)) return Object.freeze({ valid: false, reason: 'One or more records are unavailable at the selected chapter.', records: freeze(entities.map(compactEntity)), rows: freeze([]) });
    const map = fieldMaps[type] || Object.freeze([['status', 'Status'], ['canonLevel', 'Canon level'], ['summary', 'Summary']]);
    const rows = freeze(map.map(([key, label]) => {
      const values = freeze(states.map((state) => state?.[key]));
      return Object.freeze({ key, label, values, displayValues: freeze(values.map(displayValue)), allSame: values.every((value) => stable(value) === stable(values[0])) });
    }));
    return Object.freeze({ valid: true, entityType: type, chapter: boundary, records: freeze(entities.map(compactEntity)), rows, differenceCount: rows.filter((row) => !row.allSame).length, sharedCount: rows.filter((row) => row.allSame).length });
  };

  const getEditorialChangeLog = ({ phase = null, changeType = null } = {}) => Object.freeze({
    ...data.editorialChangeLog,
    entries: freeze((data.editorialChangeLog?.entries || [])
      .filter((entry) => !phase || entry.phase === phase)
      .filter((entry) => !changeType || entry.changeType === changeType)
      .sort((left, right) => right.date.localeCompare(left.date) || right.id.localeCompare(left.id))),
  });

  const getIntelligenceWorkbenchSummary = (chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const knowledge = getKnowledgeRecordsAtChapter(boundary);
    const protocols = getProtocolRecordsAtChapter(boundary);
    const artifacts = getArtifactsAtChapter(boundary);
    return Object.freeze({
      chapter: boundary,
      knowledgeRecords: knowledge.length,
      secretKnowledge: knowledge.filter((record) => record.currentKnowledgeState === 'secret').length,
      protocolRecords: protocols.length,
      disputedProtocols: protocols.filter((record) => ['disputed', 'unknown'].includes(record.protocolStatus)).length,
      objects: artifacts.filter((record) => record.entityType === 'object').length,
      documents: artifacts.filter((record) => record.entityType === 'document').length,
      evidenceItems: artifacts.filter((record) => record.entityType === 'evidence-item').length,
      editorialEntries: data.editorialChangeLog?.entries?.length || 0,
    });
  };

  return Object.freeze({
    getEntityStateAtChapter,
    getChapterStateDiff,
    getKnowledgeRecord,
    getKnowledgeRecordsAtChapter,
    getKnowledgeForEntity,
    getKnowledgeMatrix,
    getProtocolRecord,
    getProtocolRecordsAtChapter,
    getArtifactRecord,
    getArtifactsAtChapter,
    getEvidenceForArtifact,
    compareSameTypeRecords,
    getEditorialChangeLog,
    getIntelligenceWorkbenchSummary,
  });
};
