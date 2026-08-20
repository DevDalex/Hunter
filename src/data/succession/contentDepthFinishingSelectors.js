import {
  getActiveAssignmentsAtChapter,
  getActiveRelationshipsAtChapter,
  getBlackWhaleSnapshotComparison,
  getClaimProvenanceProfile,
  getConsequenceChains,
  getEntityById,
  getFactionResourceBoard,
  getLeverageBoard,
  getProtocolRecordsAtChapter,
  getShipInfrastructureIndex,
  getStoryThreadsAtChapter,
} from './successionData.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const clamp = (chapter) => Math.min(417, Math.max(340, Number(chapter) || 417));
const text = (...values) => values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase();
const chapterOf = (record) => Number(record?.canonicalChapterRange?.start ?? record?.chapterRange?.start ?? record?.chapter ?? NaN);
const compact = (entity) => entity ? Object.freeze({ id: entity.id, entityType: entity.entityType, name: entity.name || entity.id }) : null;
const delta = (after = [], before = []) => after.length - before.length;

export const getSetupPayoffIndex = (chapter = 417) => {
  const boundary = clamp(chapter);
  const graph = getConsequenceChains(boundary) || {};
  const records = freeze((graph.links || []).flatMap((link) => {
    const source = getEntityById(link.sourceEventId);
    const target = getEntityById(link.targetEventId);
    const setupChapter = chapterOf(source);
    const payoffChapter = chapterOf(target);
    if (!source || !target || !Number.isFinite(setupChapter) || !Number.isFinite(payoffChapter) || payoffChapter <= setupChapter || payoffChapter > boundary) return [];
    return [Object.freeze({
      id: link.id || `${source.id}::${target.id}`,
      setup: compact(source),
      payoff: compact(target),
      setupChapter,
      payoffChapter,
      chapterGap: payoffChapter - setupChapter,
      causalType: link.causalType || link.linkType || link.relationshipType || link.relation || link.type || 'causal-link',
      evidenceState: link.evidenceState || link.certainty || link.canonLevel || 'confirmed',
      sourceIds: freeze(link.sourceIds || []),
      note: 'Cross-chapter setup/payoff candidate derived only from an explicit maintained causal link; authorial intent is not inferred.',
    })];
  }).sort((left, right) => right.chapterGap - left.chapterGap || left.setupChapter - right.setupChapter || left.id.localeCompare(right.id)));
  return Object.freeze({
    chapter: boundary,
    records,
    summary: Object.freeze({ total: records.length, longestGap: records[0]?.chapterGap || 0, confirmed: records.filter((row) => !/infer|theory|probable/i.test(row.evidenceState)).length }),
  });
};

export const getForeshadowingTracker = (chapter = 417) => {
  const boundary = clamp(chapter);
  const dossiers = getStoryThreadsAtChapter(boundary) || [];
  const signals = freeze(dossiers.flatMap((dossier) => {
    const profile = dossier?.profile || dossier;
    const opened = Number(profile?.chapterRange?.start);
    if (!profile || !Number.isFinite(opened) || opened >= boundary) return [];
    const resolution = Number(profile.resolutionChapter);
    const resolved = Number.isFinite(resolution) && resolution <= boundary;
    return [Object.freeze({
      id: profile.id,
      name: profile.name,
      question: profile.question || null,
      openedChapter: opened,
      resolutionChapter: resolved ? resolution : null,
      status: resolved ? 'resolved-retrospective-signal' : 'open-setup-signal',
      category: profile.category || 'story-thread',
      evidenceState: profile.evidenceState || dossier.evidenceState || null,
      eventIds: freeze(profile.eventIds || []),
      sourceIds: freeze(profile.sourceIds || []),
      note: resolved
        ? 'Retrospective structural signal: an earlier maintained thread later resolves inside the selected boundary. This does not claim authorial intent.'
        : 'Open structural setup signal. No payoff or future resolution is inferred.',
    })];
  }).sort((left, right) => Number(Boolean(right.resolutionChapter)) - Number(Boolean(left.resolutionChapter)) || left.openedChapter - right.openedChapter || left.id.localeCompare(right.id)));
  return Object.freeze({
    chapter: boundary,
    signals,
    resolved: freeze(signals.filter((row) => row.resolutionChapter)),
    open: freeze(signals.filter((row) => !row.resolutionChapter)),
  });
};

export const getPromisesContractsTracker = (chapter = 417) => {
  const boundary = clamp(chapter);
  const pattern = /promise|contract|agreement|deal|treaty|truce|terms|vow|pledge|oath|commitment|cooperat/;
  const protocols = freeze(getProtocolRecordsAtChapter(boundary).filter((record) => pattern.test(text(record.name, record.summary, record.domain, record.ruleStatement, record.trigger, record.authority))).map((record) => Object.freeze({
    id: record.id,
    sourceType: 'protocol',
    name: record.name,
    status: record.protocolStatus || 'maintained',
    parties: freeze(record.linkedEntityIds || []),
    terms: record.ruleStatement || record.summary,
    sourceIds: freeze(record.sourceIds || []),
  })));
  const relationships = freeze(getActiveRelationshipsAtChapter(boundary).filter((record) => pattern.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState, record.summary))).map((record) => Object.freeze({
    id: record.id,
    sourceType: 'relationship',
    name: record.name || record.subtype || record.relationshipType || record.id,
    status: record.status || 'active',
    parties: freeze([record.sourceEntityId, record.targetEntityId].filter(Boolean)),
    terms: record.basis || record.operationalState || record.summary || 'Published relationship terms',
    sourceIds: freeze(record.sourceIds || []),
  })));
  const assignments = freeze(getActiveAssignmentsAtChapter(boundary).filter((record) => pattern.test(text(record.assignmentType, record.summary, record.note, record.status))).map((record) => Object.freeze({
    id: record.id,
    sourceType: 'assignment',
    name: record.name || record.assignmentType || record.id,
    status: record.status || 'active',
    parties: freeze([record.personId, record.principalEntityId, record.subjectEntityId, record.allegianceEntityId].filter(Boolean)),
    terms: record.summary || record.note || record.assignmentType || 'Published assignment terms',
    sourceIds: freeze(record.sourceIds || []),
  })));
  return Object.freeze({ chapter: boundary, protocols, relationships, assignments, total: protocols.length + relationships.length + assignments.length });
};

export const getSpatialEvidenceIntelligence = (chapter = 417) => {
  const boundary = clamp(chapter);
  const previous = Math.max(340, boundary - 1);
  const infrastructure = getShipInfrastructureIndex(boundary);
  const comparison = getBlackWhaleSnapshotComparison(previous, boundary);
  const hotspots = freeze([...infrastructure.records]
    .sort((left, right) => right.operationalLoad - left.operationalLoad || left.location.name.localeCompare(right.location.name))
    .slice(0, 16)
    .map((record) => {
      const provenance = getClaimProvenanceProfile(record.location.id, boundary);
      return Object.freeze({
        ...record,
        provenanceCoverage: provenance?.coverage ?? 100,
        sourceCount: provenance?.sources?.length || 0,
        unsupportedClaims: provenance?.unsupported?.length || 0,
      });
    }));
  return Object.freeze({
    chapter: boundary,
    previousChapter: previous,
    infrastructure,
    comparison,
    hotspots,
    summary: Object.freeze({
      systems: infrastructure.systemCount,
      locations: infrastructure.records.length,
      changedLocations: comparison.summary.changedLocations,
      movements: comparison.summary.movements,
      evidenceBackedHotspots: hotspots.filter((row) => row.sourceCount > 0 && row.unsupportedClaims === 0).length,
    }),
  });
};

export const getFactionRecentChangeSummaries = (chapter = 417) => {
  const boundary = clamp(chapter);
  const previous = Math.max(340, boundary - 1);
  const before = new Map(getFactionResourceBoard(previous).map((row) => [row.organization.id, row]));
  return freeze(getFactionResourceBoard(boundary).map((row) => {
    const old = before.get(row.organization.id) || { memberIds: [], abilityIds: [], eventIds: [] };
    const changes = Object.freeze({
      members: delta(row.memberIds, old.memberIds),
      abilities: delta(row.abilityIds, old.abilityIds),
      events: delta(row.eventIds, old.eventIds),
    });
    return Object.freeze({
      organization: row.organization,
      current: row,
      previousChapter: previous,
      changes,
      changed: Object.values(changes).some((value) => value !== 0),
    });
  }).sort((left, right) => Number(right.changed) - Number(left.changed)
    || Math.abs(right.changes.events) - Math.abs(left.changes.events)
    || left.organization.name.localeCompare(right.organization.name)));
};

export const getExplicitLeverageViews = (chapter = 417) => {
  const boundary = clamp(chapter);
  const legalPattern = /law|legal|justice|martial|custody|detention|court|authority|order/;
  const legalRelationshipCounts = new Map();
  const legalAssignmentCounts = new Map();
  for (const record of getActiveRelationshipsAtChapter(boundary)) {
    if (!legalPattern.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState, record.summary))) continue;
    for (const id of [record.sourceEntityId, record.targetEntityId].filter(Boolean)) legalRelationshipCounts.set(id, (legalRelationshipCounts.get(id) || 0) + 1);
  }
  for (const record of getActiveAssignmentsAtChapter(boundary)) {
    if (!legalPattern.test(text(record.assignmentType, record.summary, record.note, record.status))) continue;
    for (const id of [record.personId, record.principalEntityId, record.subjectEntityId, record.reportingEntityId].filter(Boolean)) legalAssignmentCounts.set(id, (legalAssignmentCounts.get(id) || 0) + 1);
  }
  const rows = freeze(getLeverageBoard(boundary).map((row) => Object.freeze({
    ...row,
    political: row.relational + (row.authority && row.authority !== 'unclassified' ? 1 : 0),
    legal: (legalRelationshipCounts.get(row.character.id) || 0) + (legalAssignmentCounts.get(row.character.id) || 0),
    nen: row.nen,
    information: row.information,
    note: 'Signal counts, not power levels: political derives from maintained relationships/authority; legal from maintained law/Justice/martial/custody records.',
  })));
  return Object.freeze({ chapter: boundary, rows, dimensions: freeze(['political', 'nen', 'legal', 'information']) });
};

export const getAnalyticalFinishingSummary = (chapter = 417) => {
  const boundary = clamp(chapter);
  const setup = getSetupPayoffIndex(boundary);
  const foreshadowing = getForeshadowingTracker(boundary);
  const commitments = getPromisesContractsTracker(boundary);
  const spatial = getSpatialEvidenceIntelligence(boundary);
  const factions = getFactionRecentChangeSummaries(boundary);
  const leverage = getExplicitLeverageViews(boundary);
  return Object.freeze({
    chapter: boundary,
    setupPayoff: setup.records.length,
    foreshadowingSignals: foreshadowing.signals.length,
    resolvedForeshadowingSignals: foreshadowing.resolved.length,
    commitments: commitments.total,
    spatialSystems: spatial.summary.systems,
    spatialHotspots: spatial.hotspots.length,
    changedFactions: factions.filter((row) => row.changed).length,
    leverageRows: leverage.rows.length,
  });
};
