const freeze = (values = []) => Object.freeze([...values]);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const stable = (value) => JSON.stringify(value ?? null);
const normalize = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .toLocaleLowerCase();
const titleCase = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());
const includesChapter = (range = {}, chapter) => Number(chapter) >= Number(range.start || 0)
  && Number(chapter) <= Number(range.end ?? Number.POSITIVE_INFINITY);
const compactEntity = (entity) => entity ? Object.freeze({
  id: entity.id,
  entityType: entity.entityType,
  name: entity.name || entity.id,
  slug: entity.slug || null,
}) : null;
const display = (value) => {
  if (Array.isArray(value)) return value.map(display).filter(Boolean).join(' · ');
  if (value && typeof value === 'object') return Object.values(value).map(display).filter(Boolean).join(' · ');
  return value == null || value === '' ? 'Not published' : String(value);
};
const intersect = (left = [], right = []) => {
  const rightSet = new Set(right);
  return unique(left.filter((value) => rightSet.has(value)));
};

const CAUSALITY_RULES = Object.freeze([
  ['direct-cause', /direct|cause|trigger|result|because|therefore|leads? to/],
  ['enabling-condition', /enable|allow|permit|condition|prerequisite|opens? the way/],
  ['constraint', /prevent|block|restrict|limit|force|require/],
  ['contextual-link', /parallel|context|coincid|meanwhile|correlat|associated/],
]);
const classifyCausality = (link = {}) => {
  const explicit = normalize(link.causalType || link.linkType || link.relationshipType || link.type);
  const text = normalize([
    explicit,
    link.name,
    link.summary,
    link.basis,
    link.explanation,
  ].filter(Boolean).join(' '));
  const matched = CAUSALITY_RULES.find(([, pattern]) => pattern.test(text));
  return matched?.[0] || 'sequence-only';
};
const causalityEvidence = (link = {}) => {
  const certainty = normalize(link.certainty || link.evidenceState || link.canonLevel || 'confirmed');
  if (/theory|speculat/.test(certainty)) return 'theory';
  if (/infer|probable|approx/.test(certainty)) return 'inferred';
  return 'confirmed';
};

const INFRASTRUCTURE_RULES = Object.freeze([
  ['emergency-and-evacuation', /lifeboat|evacuat|escape|launch|emergency|rescue/],
  ['transport-and-access', /elevator|stair|corridor|passage|gate|access|transit|deck|tier|checkpoint/],
  ['security-and-justice', /security|guard|surveillance|detention|prison|court|justice|military|custody/],
  ['medical-and-life-support', /medical|hospital|clinic|food|dining|water|waste|ventilat|sanitation|kitchen/],
  ['royal-and-ceremonial', /royal|prince|queen|king|banquet|ceremon|burial|coffin|vvip/],
  ['logistics-and-public-services', /warehouse|storage|market|casino|service|cargo|supply|public/],
  ['covert-and-criminal', /mafia|hideout|base|heil ly|xi yu|cha r|covert|secret/],
]);
const infrastructureSystem = (location = {}) => {
  const text = normalize([
    location.name,
    location.summary,
    location.zoneRole,
    location.locationType,
    location.accessLevel,
    ...(location.tags || []),
    ...(location.aliases || []),
  ].filter(Boolean).join(' '));
  return INFRASTRUCTURE_RULES.find(([, pattern]) => pattern.test(text))?.[0] || 'general-ship-space';
};
const isBlackWhaleLocation = (location = {}, archive) => {
  const breadcrumbs = archive.getLocationBreadcrumbs(location.id) || [];
  const text = normalize([
    location.id,
    location.name,
    location.summary,
    location.zoneRole,
    ...breadcrumbs.map((record) => record.name || record.id),
  ].filter(Boolean).join(' '));
  return /black whale|tier|royal quarter|lower deck|ship|vessel/.test(text);
};

const claimFieldsByType = Object.freeze({
  character: ['summary', 'roles', 'status', 'royalMother', 'princeOrder', 'nen'],
  organization: ['summary', 'status', 'objective', 'authorityBasis', 'leaderIds'],
  ability: ['summary', 'nenType', 'activation', 'conditions', 'limitations', 'costs', 'ownerIds'],
  'guardian-beast': ['summary', 'hostCharacterId', 'knownAbilityIds', 'suspectedAbilityIds'],
  location: ['summary', 'locationType', 'zoneRole', 'accessLevel', 'parentLocationId'],
  event: ['summary', 'chapterRange', 'participantIds', 'locationIds', 'outcomes', 'stateChanges'],
  assignment: ['summary', 'assignmentType', 'status', 'secrecy', 'personId', 'principalEntityId', 'locationId'],
  relationship: ['summary', 'relationshipType', 'sentiment', 'direction', 'strength', 'sourceEntityId', 'targetEntityId'],
  protocol: ['summary', 'domain', 'authority', 'ruleStatement', 'trigger', 'scope', 'enforcement', 'exceptions', 'openQuestions'],
  'knowledge-record': ['summary', 'knowledgeState', 'secrecy', 'subjectEntityIds', 'knowerEntityIds', 'misinformedEntityIds', 'acquisition'],
  object: ['summary', 'artifactCategory', 'artifactState', 'ownerEntityIds', 'holderEntityIds', 'locationEntityIds', 'nenStatus', 'legalSignificance'],
  document: ['summary', 'documentCategory', 'artifactState', 'authorEntityIds', 'recipientEntityIds', 'legalSignificance'],
  'evidence-item': ['summary', 'evidenceCategory', 'artifactState', 'subjectEntityIds', 'evidenceRole', 'chainOfCustody'],
});

const extractGlossaryEntries = (data) => {
  const source = data.glossaryEntries || data.glossaryRecords || {};
  const entries = Array.isArray(source) ? source : Object.values(source);
  return freeze(entries.filter(Boolean).map((entry, index) => Object.freeze({
    ...entry,
    id: entry.id || `glossary:auto:${index}`,
    term: entry.term || entry.name || entry.label || entry.slug || `Term ${index + 1}`,
    aliases: freeze(entry.aliases || entry.synonyms || []),
  })));
};

export const createWorkspaceRefinementSelectors = ({
  data,
  archive,
  storyIntelligence,
  highValueIntelligence,
  nenSystems,
}) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const earliestChapter = data.chapters.at(0)?.number || 338;
  const clampChapter = (chapter) => Math.min(latestChapter, Math.max(earliestChapter, Number(chapter) || latestChapter));
  const glossaryEntries = extractGlossaryEntries(data);

  const getChapterDeltaBrief = (chapter = latestChapter) => {
    const current = clampChapter(chapter);
    const previous = clampChapter(current - 1);
    const dossier = storyIntelligence.getChapterStoryDossier(current);
    const diff = highValueIntelligence.getChapterStateDiff(previous, current, {
      types: ['event', 'character', 'organization', 'assignment', 'relationship', 'location', 'ability', 'guardian-beast'],
      changedOnly: true,
    });
    const links = unique([
      ...(dossier?.incomingCausalLinks || []),
      ...(dossier?.outgoingCausalLinks || []),
    ]);
    const causalLinks = freeze(links.map((link) => {
      const source = archive.getEntityById(link.sourceEventId);
      const target = archive.getEntityById(link.targetEventId);
      return Object.freeze({
        ...link,
        source: compactEntity(source),
        target: compactEntity(target),
        causalityClass: classifyCausality(link),
        evidenceState: causalityEvidence(link),
        sourceRecords: freeze((link.sourceIds || []).map((id) => archive.getEntityById(id)).filter(Boolean).map(compactEntity)),
      });
    }));
    const groups = Object.freeze(Object.fromEntries([
      'direct-cause', 'enabling-condition', 'constraint', 'contextual-link', 'sequence-only',
    ].map((category) => [category, freeze(causalLinks.filter((link) => link.causalityClass === category))])));
    const recordsByStatus = Object.freeze({
      added: freeze(diff.records.filter((record) => record.status === 'added')),
      changed: freeze(diff.records.filter((record) => record.status === 'changed')),
      removed: freeze(diff.records.filter((record) => record.status === 'removed')),
    });
    return Object.freeze({
      chapter: current,
      previousChapter: previous,
      dossier,
      diff,
      recordsByStatus,
      causalLinks,
      causalityGroups: groups,
      changes: freeze(dossier?.changes || []),
      summary: Object.freeze({
        additions: recordsByStatus.added.length,
        modifications: recordsByStatus.changed.length,
        removals: recordsByStatus.removed.length,
        directCauses: groups['direct-cause'].length,
        enablingConditions: groups['enabling-condition'].length,
        constraints: groups.constraint.length,
        contextualLinks: groups['contextual-link'].length,
        sequenceOnly: groups['sequence-only'].length,
      }),
    });
  };

  const getFocusedRelationshipView = (entityId, chapter = latestChapter, { depth = 1, limit = 28 } = {}) => {
    const boundary = clampChapter(chapter);
    const focus = archive.getEntityById(entityId);
    if (!focus) return null;
    const active = archive.getActiveRelationshipsAtChapter(boundary);
    const nodes = new Map([[focus.id, focus]]);
    let frontier = new Set([focus.id]);
    const edges = [];
    const seenEdges = new Set();
    for (let level = 0; level < Math.max(1, Math.min(2, Number(depth) || 1)); level += 1) {
      const next = new Set();
      for (const relationship of active) {
        if (!frontier.has(relationship.sourceEntityId) && !frontier.has(relationship.targetEntityId)) continue;
        if (!seenEdges.has(relationship.id)) {
          edges.push(relationship);
          seenEdges.add(relationship.id);
        }
        for (const id of [relationship.sourceEntityId, relationship.targetEntityId]) {
          const entity = archive.getEntityById(id);
          if (entity) nodes.set(id, entity);
          if (!frontier.has(id)) next.add(id);
        }
      }
      frontier = next;
    }
    const rankedNodes = [...nodes.values()].map((entity) => {
      const connected = edges.filter((edge) => edge.sourceEntityId === entity.id || edge.targetEntityId === entity.id);
      return Object.freeze({
        entity: compactEntity(entity),
        edgeCount: connected.length,
        inbound: connected.filter((edge) => edge.targetEntityId === entity.id && edge.direction === 'directed').length,
        outbound: connected.filter((edge) => edge.sourceEntityId === entity.id && edge.direction === 'directed').length,
        hostile: connected.filter((edge) => edge.sentiment === 'hostile').length,
        allied: connected.filter((edge) => edge.sentiment === 'allied').length,
      });
    }).sort((left, right) => (right.entity.id === focus.id) - (left.entity.id === focus.id)
      || right.edgeCount - left.edgeCount
      || left.entity.name.localeCompare(right.entity.name)).slice(0, limit);
    const allowedNodeIds = new Set(rankedNodes.map((record) => record.entity.id));
    const visibleEdges = freeze(edges.filter((edge) => allowedNodeIds.has(edge.sourceEntityId) && allowedNodeIds.has(edge.targetEntityId)).map((edge) => Object.freeze({
      ...edge,
      source: compactEntity(archive.getEntityById(edge.sourceEntityId)),
      target: compactEntity(archive.getEntityById(edge.targetEntityId)),
      sources: freeze(archive.getSourcesForEntity(edge.id).map(compactEntity)),
    })));
    const directionGroups = Object.freeze({
      inbound: freeze(visibleEdges.filter((edge) => edge.direction === 'directed' && edge.targetEntityId === focus.id)),
      outbound: freeze(visibleEdges.filter((edge) => edge.direction === 'directed' && edge.sourceEntityId === focus.id)),
      mutual: freeze(visibleEdges.filter((edge) => edge.direction === 'bidirectional')),
      adjacent: freeze(visibleEdges.filter((edge) => ![edge.sourceEntityId, edge.targetEntityId].includes(focus.id))),
    });
    return Object.freeze({
      chapter: boundary,
      focus: compactEntity(focus),
      depth: Math.max(1, Math.min(2, Number(depth) || 1)),
      nodes: freeze(rankedNodes),
      edges: visibleEdges,
      directionGroups,
      summary: Object.freeze({
        nodes: rankedNodes.length,
        edges: visibleEdges.length,
        inbound: directionGroups.inbound.length,
        outbound: directionGroups.outbound.length,
        mutual: directionGroups.mutual.length,
        hostile: visibleEdges.filter((edge) => edge.sentiment === 'hostile').length,
        allied: visibleEdges.filter((edge) => edge.sentiment === 'allied').length,
        inferred: visibleEdges.filter((edge) => /infer|probable|approx/.test(normalize(edge.certainty))).length,
      }),
    });
  };

  const locationState = (location, chapter) => {
    const snapshot = archive.getLocationSnapshot(location.id, chapter);
    const occupants = (snapshot?.occupants || snapshot?.entities || []).map((record) => record.characterId || record.id).filter(Boolean).sort();
    const events = archive.getEventsAtLocation(location.id).filter((event) => includesChapter(event.chapterRange, chapter)).map((event) => event.id).sort();
    const assignments = archive.getAssignmentsAtLocation(location.id).filter((record) => includesChapter(record.chapterRange, chapter)).map((record) => record.id).sort();
    return Object.freeze({
      occupants: freeze(occupants),
      events: freeze(events),
      assignments: freeze(assignments),
      accessLevel: location.accessLevel || 'unknown',
      zoneRole: location.zoneRole || 'unknown',
    });
  };

  const getShipInfrastructureIndex = (chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const locations = archive.getEntitiesByType('location').filter((location) => isBlackWhaleLocation(location, archive));
    const records = freeze(locations.map((location) => {
      const state = locationState(location, boundary);
      return Object.freeze({
        location: compactEntity(location),
        system: infrastructureSystem(location),
        state,
        operationalLoad: state.occupants.length + state.events.length + state.assignments.length,
        protocolIds: freeze(archive.getEntitiesByType('protocol')
          .filter((protocol) => (protocol.linkedEntityIds || []).includes(location.id) && includesChapter(protocol.chapterRange, boundary))
          .map((protocol) => protocol.id)),
      });
    }).sort((left, right) => left.system.localeCompare(right.system)
      || right.operationalLoad - left.operationalLoad
      || left.location.name.localeCompare(right.location.name)));
    const systems = Object.freeze(Object.fromEntries(unique(records.map((record) => record.system)).sort().map((system) => {
      const entries = records.filter((record) => record.system === system);
      return [system, Object.freeze({
        id: system,
        label: titleCase(system),
        locations: freeze(entries),
        locationCount: entries.length,
        activeEvents: entries.reduce((total, record) => total + record.state.events.length, 0),
        activeAssignments: entries.reduce((total, record) => total + record.state.assignments.length, 0),
        occupants: unique(entries.flatMap((record) => record.state.occupants)).length,
      })];
    })));
    return Object.freeze({ chapter: boundary, records, systems, systemCount: Object.keys(systems).length });
  };

  const getBlackWhaleSnapshotComparison = (fromChapter, toChapter) => {
    const from = clampChapter(fromChapter);
    const to = clampChapter(toChapter);
    const infrastructure = getShipInfrastructureIndex(to);
    const changes = freeze(infrastructure.records.flatMap((record) => {
      const location = archive.getEntityById(record.location.id);
      const before = locationState(location, from);
      const after = locationState(location, to);
      if (stable(before) === stable(after)) return [];
      const deltas = ['occupants', 'events', 'assignments', 'accessLevel', 'zoneRole'].flatMap((key) => stable(before[key]) === stable(after[key]) ? [] : [Object.freeze({
        key,
        label: titleCase(key),
        before: before[key],
        after: after[key],
      })]);
      return [Object.freeze({ location: record.location, system: record.system, before, after, deltas })];
    }));
    const movements = freeze(archive.getEntitiesByType('character').flatMap((character) => {
      const before = archive.getCurrentLocationRecordForCharacter(character.id, from);
      const after = archive.getCurrentLocationRecordForCharacter(character.id, to);
      const beforeId = before?.locationId || null;
      const afterId = after?.locationId || null;
      if (!beforeId || !afterId || beforeId === afterId) return [];
      return [Object.freeze({
        character: compactEntity(character),
        from: compactEntity(archive.getEntityById(beforeId)),
        to: compactEntity(archive.getEntityById(afterId)),
      })];
    }));
    return Object.freeze({
      fromChapter: from,
      toChapter: to,
      direction: from <= to ? 'forward' : 'reverse',
      locationChanges: changes,
      movements,
      infrastructure,
      summary: Object.freeze({
        changedLocations: changes.length,
        movements: movements.length,
        systems: infrastructure.systemCount,
        activeLocations: infrastructure.records.filter((record) => record.operationalLoad > 0).length,
      }),
    });
  };

  const abilityTokens = (ability) => unique(normalize([
    ability.nenType,
    ability.activation,
    ...(ability.conditions || []),
    ...(ability.limitations || []),
    ...(ability.costs || []),
    ...(ability.tags || []),
  ].filter(Boolean).join(' ')).split(' ').filter((token) => token.length > 4));

  const getAbilityInteractionMatrix = (chapter = latestChapter, { entityId = null, limit = 80 } = {}) => {
    const boundary = clampChapter(chapter);
    const abilities = archive.getEntitiesByType('ability').filter((ability) => nenSystems.getAbilityKnowledgeAtChapter(ability.id, boundary)?.known);
    const pairs = [];
    for (let leftIndex = 0; leftIndex < abilities.length; leftIndex += 1) {
      const left = abilities[leftIndex];
      if (entityId && left.id !== entityId && !abilities.some((record) => record.id === entityId)) continue;
      const leftEvents = archive.getEventsForAbility(left.id).filter((event) => event.chapterRange.start <= boundary).map((event) => event.id);
      const leftLocations = archive.getLocationsForAbility(left.id).map((location) => location.id);
      const leftTokens = abilityTokens(left);
      for (let rightIndex = leftIndex + 1; rightIndex < abilities.length; rightIndex += 1) {
        const right = abilities[rightIndex];
        if (entityId && left.id !== entityId && right.id !== entityId) continue;
        const sharedEvents = intersect(leftEvents, archive.getEventsForAbility(right.id).filter((event) => event.chapterRange.start <= boundary).map((event) => event.id));
        const sharedLocations = intersect(leftLocations, archive.getLocationsForAbility(right.id).map((location) => location.id));
        const sharedOwners = intersect(left.ownerIds || [], right.ownerIds || []);
        const sharedMechanics = intersect(leftTokens, abilityTokens(right)).slice(0, 8);
        if (!sharedEvents.length && !sharedLocations.length && !sharedOwners.length && sharedMechanics.length < 2) continue;
        const basis = sharedEvents.length
          ? 'documented-same-event'
          : sharedOwners.length
            ? 'same-owner-system'
            : sharedLocations.length
              ? 'co-located-no-direct-interaction-claimed'
              : 'structural-mechanic-overlap';
        pairs.push(Object.freeze({
          id: `${left.id}::${right.id}`,
          left: compactEntity(left),
          right: compactEntity(right),
          basis,
          directInteractionClaimed: basis === 'documented-same-event',
          sharedEvents: freeze(sharedEvents.map((id) => compactEntity(archive.getEntityById(id))).filter(Boolean)),
          sharedLocations: freeze(sharedLocations.map((id) => compactEntity(archive.getEntityById(id))).filter(Boolean)),
          sharedOwners: freeze(sharedOwners.map((id) => compactEntity(archive.getEntityById(id))).filter(Boolean)),
          sharedMechanics: freeze(sharedMechanics),
          evidenceStrength: sharedEvents.length ? 'confirmed-context' : sharedOwners.length ? 'system-linked' : sharedLocations.length ? 'spatial-context' : 'comparative-only',
        }));
      }
    }
    const ranked = pairs.sort((left, right) => Number(right.directInteractionClaimed) - Number(left.directInteractionClaimed)
      || right.sharedEvents.length - left.sharedEvents.length
      || right.sharedLocations.length - left.sharedLocations.length
      || right.sharedMechanics.length - left.sharedMechanics.length
      || left.id.localeCompare(right.id)).slice(0, limit);
    return Object.freeze({
      chapter: boundary,
      abilities: freeze(abilities.map(compactEntity)),
      interactions: freeze(ranked),
      summary: Object.freeze({
        abilities: abilities.length,
        interactions: ranked.length,
        documentedContexts: ranked.filter((record) => record.basis === 'documented-same-event').length,
        sameOwnerSystems: ranked.filter((record) => record.basis === 'same-owner-system').length,
        spatialContexts: ranked.filter((record) => record.basis === 'co-located-no-direct-interaction-claimed').length,
        comparativeOverlaps: ranked.filter((record) => record.basis === 'structural-mechanic-overlap').length,
      }),
    });
  };

  const getClaimProvenanceProfile = (entityId, chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const entity = archive.getEntityById(entityId);
    if (!entity) return null;
    const sourceIds = unique(entity.sourceIds || []);
    const sources = freeze(sourceIds.map((id) => archive.getEntityById(id)).filter((source) => source && (!source.chapter || source.chapter <= boundary)).map(compactEntity));
    const fields = claimFieldsByType[entity.entityType] || ['summary', 'status', 'chapterRange'];
    const explicitClaims = Array.isArray(entity.claims) ? entity.claims : [];
    const generatedClaims = fields.flatMap((field) => {
      const value = entity[field];
      if (value == null || value === '' || (Array.isArray(value) && !value.length)) return [];
      return [Object.freeze({
        id: `${entity.id}:claim:${field}`,
        field,
        label: titleCase(field),
        value,
        displayValue: display(value),
        sourceIds: freeze(sourceIds),
        sources,
        canonLevel: entity.canonLevel || 'canon',
        certainty: entity.certainty || 'confirmed',
        provenanceState: sources.length ? 'entity-source-inherited' : 'source-missing',
        inheritedSourceChain: true,
      })];
    });
    const claims = freeze([
      ...explicitClaims.map((claim, index) => {
        const claimSourceIds = unique(claim.sourceIds || sourceIds);
        const claimSources = freeze(claimSourceIds.map((id) => archive.getEntityById(id)).filter((source) => source && (!source.chapter || source.chapter <= boundary)).map(compactEntity));
        return Object.freeze({
          ...claim,
          id: claim.id || `${entity.id}:explicit-claim:${index}`,
          label: claim.label || claim.name || `Claim ${index + 1}`,
          displayValue: display(claim.value || claim.statement || claim.summary),
          sourceIds: freeze(claimSourceIds),
          sources: claimSources,
          canonLevel: claim.canonLevel || entity.canonLevel || 'canon',
          certainty: claim.certainty || entity.certainty || 'confirmed',
          provenanceState: claimSources.length ? 'claim-source-explicit' : 'source-missing',
          inheritedSourceChain: false,
        });
      }),
      ...generatedClaims,
    ]);
    const unsupported = claims.filter((claim) => !claim.sources.length);
    const inferred = claims.filter((claim) => /infer|theory|probable|approx/.test(normalize(`${claim.canonLevel} ${claim.certainty}`)));
    return Object.freeze({
      chapter: boundary,
      entity: compactEntity(entity),
      claims,
      sources,
      unsupported: freeze(unsupported),
      inferred: freeze(inferred),
      coverage: claims.length ? Math.round(((claims.length - unsupported.length) / claims.length) * 100) : 100,
      note: 'Generated field claims inherit the entity source chain unless an explicit claim-level source is published.',
    });
  };

  const getProvenanceCoverageReport = (chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const types = ['character', 'organization', 'ability', 'guardian-beast', 'location', 'event', 'assignment', 'relationship', 'protocol', 'knowledge-record', 'object', 'document', 'evidence-item'];
    const profiles = freeze(types.flatMap((type) => archive.getEntitiesByType(type)).map((entity) => getClaimProvenanceProfile(entity.id, boundary)).filter(Boolean));
    const claims = profiles.flatMap((profile) => profile.claims);
    const unsupported = claims.filter((claim) => !claim.sources.length);
    return Object.freeze({
      chapter: boundary,
      profiles,
      claims: claims.length,
      unsupported: unsupported.length,
      explicitClaimSources: claims.filter((claim) => !claim.inheritedSourceChain && claim.sources.length).length,
      inheritedEntitySources: claims.filter((claim) => claim.inheritedSourceChain && claim.sources.length).length,
      coverage: claims.length ? Math.round(((claims.length - unsupported.length) / claims.length) * 100) : 100,
      weakest: freeze([...profiles].sort((left, right) => left.coverage - right.coverage || right.unsupported.length - left.unsupported.length).slice(0, 12)),
    });
  };

  const glossaryMentionsForEntity = (entity) => {
    const text = normalize([
      entity.name,
      entity.summary,
      entity.ruleStatement,
      entity.activation,
      ...(entity.conditions || []),
      ...(entity.limitations || []),
      ...(entity.costs || []),
      ...(entity.tags || []),
    ].filter(Boolean).join(' '));
    return glossaryEntries.flatMap((entry) => {
      const canonical = normalize(entry.term);
      const aliases = (entry.aliases || []).map(normalize).filter(Boolean);
      const canonicalUsed = canonical && text.includes(canonical);
      const aliasUsed = aliases.filter((alias) => text.includes(alias));
      if (!canonicalUsed && !aliasUsed.length) return [];
      return [Object.freeze({
        glossaryId: entry.id,
        term: entry.term,
        canonicalUsed,
        aliasUsed: freeze(aliasUsed),
        linked: (entity.glossaryIds || entity.glossaryEntryIds || []).includes(entry.id),
      })];
    });
  };

  const getGlossaryEnforcementReport = (chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const types = ['character', 'organization', 'ability', 'guardian-beast', 'location', 'event', 'assignment', 'relationship', 'protocol', 'knowledge-record', 'object', 'document', 'evidence-item'];
    const entities = types.flatMap((type) => archive.getEntitiesByType(type)).filter((entity) => !entity.chapterRange?.start || entity.chapterRange.start <= boundary);
    const mentions = freeze(entities.flatMap((entity) => glossaryMentionsForEntity(entity).map((mention) => Object.freeze({ entity: compactEntity(entity), ...mention }))));
    const aliasOnly = freeze(mentions.filter((mention) => !mention.canonicalUsed && mention.aliasUsed.length));
    const unlinked = freeze(mentions.filter((mention) => !mention.linked));
    const unresolvedReferences = freeze(entities.flatMap((entity) => (entity.glossaryIds || entity.glossaryEntryIds || []).flatMap((id) => glossaryEntries.some((entry) => entry.id === id) ? [] : [Object.freeze({ entity: compactEntity(entity), glossaryId: id })])));
    const termCoverage = freeze(glossaryEntries.map((entry) => {
      const records = mentions.filter((mention) => mention.glossaryId === entry.id);
      return Object.freeze({
        id: entry.id,
        term: entry.term,
        mentions: records.length,
        linkedMentions: records.filter((record) => record.linked).length,
        aliasOnlyMentions: records.filter((record) => !record.canonicalUsed && record.aliasUsed.length).length,
      });
    }).sort((left, right) => right.aliasOnlyMentions - left.aliasOnlyMentions || left.term.localeCompare(right.term)));
    return Object.freeze({
      chapter: boundary,
      entries: glossaryEntries,
      mentions,
      aliasOnly,
      unlinked,
      unresolvedReferences,
      termCoverage,
      summary: Object.freeze({
        glossaryTerms: glossaryEntries.length,
        mentions: mentions.length,
        linkedMentions: mentions.filter((mention) => mention.linked).length,
        aliasOnly: aliasOnly.length,
        unlinked: unlinked.length,
        unresolvedReferences: unresolvedReferences.length,
      }),
    });
  };

  const getWorkspaceRefinementSummary = (chapter = latestChapter) => {
    const boundary = clampChapter(chapter);
    const delta = getChapterDeltaBrief(boundary);
    const infrastructure = getShipInfrastructureIndex(boundary);
    const interactions = getAbilityInteractionMatrix(boundary);
    const provenance = getProvenanceCoverageReport(boundary);
    const glossary = getGlossaryEnforcementReport(boundary);
    return Object.freeze({
      chapter: boundary,
      changedRecords: delta.diff.summary.total,
      causalLinks: delta.causalLinks.length,
      infrastructureSystems: infrastructure.systemCount,
      abilityInteractions: interactions.interactions.length,
      provenanceCoverage: provenance.coverage,
      glossaryTerms: glossary.entries.length,
      glossaryUnresolvedReferences: glossary.unresolvedReferences.length,
    });
  };

  return Object.freeze({
    getChapterDeltaBrief,
    getFocusedRelationshipView,
    getBlackWhaleSnapshotComparison,
    getShipInfrastructureIndex,
    getAbilityInteractionMatrix,
    getClaimProvenanceProfile,
    getProvenanceCoverageReport,
    getGlossaryEnforcementReport,
    getWorkspaceRefinementSummary,
  });
};
