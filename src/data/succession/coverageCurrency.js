import {
  ARCHIVE_BOUNDARY,
  ARCHIVE_DETAILED_BOUNDARY,
  ARCHIVE_REVIEW_DATE,
} from '../archiveMeta.js';
import {
  successionChapterResearch,
  successionChapterResearchByNumber,
} from './successionResearch.js';
import {
  getAssignmentSnapshot,
  getCharacterCurrentState,
  getCharacterLifetimeTimeline,
  getCharacterRoleProfile,
  getEntityById,
  getOrganizationCurrentState,
  getRelationshipSnapshot,
  getSourcesForEntity,
  successionArchiveData,
} from './successionData.js';

const freeze = (value) => Object.freeze(value);
const finite = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const unique = (values) => [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))];
const normalize = (value) => String(value || '').trim().toLowerCase();
const pendingText = (value) => /pending|unverified|unknown|unresolved|not confirmed|not revealed|unclear|inference|theory/i.test(String(value || ''));

const sourcesById = new Map((successionArchiveData.sources || []).map((source) => [source.id, source]));

const sourceChapters = (record) => (record?.sourceIds || [])
  .map((sourceId) => finite(sourcesById.get(sourceId)?.chapter))
  .filter(Number.isFinite);

const directEvidenceChapters = (record) => unique([
  finite(record?.chapter),
  finite(record?.chapterRange?.start),
  ...(record?.sourceChapterNumbers || []).map(finite),
  ...sourceChapters(record),
]).filter(Number.isFinite);

const latestAtOrBefore = (values, boundary) => {
  const bounded = values.filter((chapter) => Number.isFinite(chapter) && chapter <= boundary);
  return bounded.length ? Math.max(...bounded) : null;
};

const chapterRangeText = (start, end) => {
  if (!Number.isFinite(start)) return 'No verified chapter evidence';
  if (!Number.isFinite(end) || start === end) return `Chapter ${start}`;
  return `Chapters ${start}–${end}`;
};

const describeTimelineEntry = (entry) => ({
  id: entry.id || `${entry.kind || 'record'}-${entry.chapterRange?.start || 'unknown'}-${entry.label || entry.name || ''}`,
  label: entry.label || entry.name || entry.kind || 'Archive change',
  summary: entry.summary || entry.operationalState || entry.objective || entry.status || '',
  kind: entry.kind || entry.entityType || 'record',
  chapterRange: entry.chapterRange || null,
  certainty: entry.certainty || entry.canonLevel || 'confirmed',
  active: entry.chapterRange?.end == null || entry.status === 'active',
});

const relatedEvidenceForEntity = (entity) => {
  if (!entity) return { chapters: [], recentRecords: [], state: null, role: null };
  const chapters = [...directEvidenceChapters(entity)];
  const recentRecords = [];
  let state = null;
  let role = null;

  if (entity.entityType === 'character') {
    const timeline = getCharacterLifetimeTimeline(entity.id) || [];
    for (const entry of timeline) {
      chapters.push(...directEvidenceChapters(entry));
      recentRecords.push(describeTimelineEntry(entry));
    }
    const assignmentSnapshot = getAssignmentSnapshot(entity.id);
    for (const assignment of assignmentSnapshot?.assignments || []) {
      chapters.push(...directEvidenceChapters(assignment));
      recentRecords.push(describeTimelineEntry({ ...assignment, kind: 'assignment' }));
    }
    const relationshipSnapshot = getRelationshipSnapshot(entity.id);
    for (const relationship of relationshipSnapshot?.relationships || []) {
      chapters.push(...directEvidenceChapters(relationship));
      recentRecords.push(describeTimelineEntry({ ...relationship, kind: 'relationship' }));
    }
    state = getCharacterCurrentState(entity.id);
    role = getCharacterRoleProfile(entity.id);
    chapters.push(...directEvidenceChapters(state));
  } else if (entity.entityType === 'organization') {
    state = getOrganizationCurrentState(entity.id);
    chapters.push(...directEvidenceChapters(state));
    const relationshipSnapshot = getRelationshipSnapshot(entity.id);
    for (const relationship of relationshipSnapshot?.relationships || []) {
      chapters.push(...directEvidenceChapters(relationship));
      recentRecords.push(describeTimelineEntry({ ...relationship, kind: 'relationship' }));
    }
  } else {
    const assignmentSnapshot = getAssignmentSnapshot(entity.id);
    for (const assignment of assignmentSnapshot?.assignments || []) {
      chapters.push(...directEvidenceChapters(assignment));
      recentRecords.push(describeTimelineEntry({ ...assignment, kind: 'assignment' }));
    }
    const relationshipSnapshot = getRelationshipSnapshot(entity.id);
    for (const relationship of relationshipSnapshot?.relationships || []) {
      chapters.push(...directEvidenceChapters(relationship));
      recentRecords.push(describeTimelineEntry({ ...relationship, kind: 'relationship' }));
    }
  }

  return { chapters: unique(chapters).filter(Number.isFinite), recentRecords, state, role };
};

const chapterCoverageFor = (chapter, readingBoundary) => {
  const research = successionChapterResearchByNumber.get(chapter.number);
  const pending = normalize(research?.status).includes('pending');
  const detailed = Boolean(research && !pending && (research.coverage?.chronology || research.events?.length || research.prelude?.length));
  return freeze({
    readingBoundary,
    archiveMaximum: ARCHIVE_BOUNDARY,
    identityVerifiedThrough: chapter.number,
    verifiedThrough: detailed ? chapter.number : Math.min(ARCHIVE_DETAILED_BOUNDARY, readingBoundary),
    detailStatus: detailed ? 'detailed' : 'pending',
    hasGap: !detailed && chapter.number > ARCHIVE_DETAILED_BOUNDARY,
    gapStart: !detailed && chapter.number > ARCHIVE_DETAILED_BOUNDARY ? ARCHIVE_DETAILED_BOUNDARY + 1 : null,
    gapEnd: !detailed && chapter.number > ARCHIVE_DETAILED_BOUNDARY ? Math.min(chapter.number, readingBoundary) : null,
    gapLabel: !detailed && chapter.number > ARCHIVE_DETAILED_BOUNDARY
      ? chapterRangeText(ARCHIVE_DETAILED_BOUNDARY + 1, Math.min(chapter.number, readingBoundary))
      : 'No chapter-detail gap inside this boundary',
    latestEvidenceChapter: detailed ? chapter.number : null,
    lastReviewed: research?.lastReviewed || ARCHIVE_REVIEW_DATE,
    sourceCount: getSourcesForEntity(chapter.id).length,
    research,
  });
};

export const getEntityCoverage = (entityOrId, readingBoundary = ARCHIVE_BOUNDARY) => {
  const entity = typeof entityOrId === 'string' ? getEntityById(entityOrId) : entityOrId;
  const boundary = Math.min(ARCHIVE_BOUNDARY, Math.max(340, finite(readingBoundary) || ARCHIVE_BOUNDARY));
  if (!entity) return null;
  if (entity.entityType === 'chapter') return chapterCoverageFor(entity, boundary);

  const related = relatedEvidenceForEntity(entity);
  const latestEvidenceChapter = latestAtOrBefore(related.chapters, boundary);
  const verifiedThrough = latestEvidenceChapter;
  const hasGap = Number.isFinite(verifiedThrough) ? verifiedThrough < boundary : true;
  const gapStart = Number.isFinite(verifiedThrough) ? verifiedThrough + 1 : 340;
  const gapEnd = hasGap ? boundary : null;
  const sources = getSourcesForEntity(entity.id);
  const recentChanges = related.recentRecords
    .filter((record) => (record.chapterRange?.start || 0) > ARCHIVE_DETAILED_BOUNDARY && (record.chapterRange?.start || 0) <= boundary)
    .sort((left, right) => (right.chapterRange?.start || 0) - (left.chapterRange?.start || 0))
    .slice(0, 12);

  const questionCandidates = [
    ...(entity.openQuestions || []),
    ...(entity.unresolved || []),
    ...(entity.pressure || []),
    entity.summary,
    related.state?.operationalState,
    related.state?.bodyState,
    related.state?.consciousnessState,
    related.state?.protectionState,
    related.state?.allegianceState,
    related.role?.mandate,
    ...(related.role?.responsibilities || []),
  ].filter((value) => pendingText(value));

  const openQuestions = unique([
    ...(hasGap ? [`No maintained evidence currently closes the ${chapterRangeText(gapStart, gapEnd)} coverage gap for this record.`] : []),
    ...questionCandidates,
    ...(!sources.length ? ['No direct source record is attached to this entity.'] : []),
  ]).slice(0, 12);

  const canonLevel = normalize(entity.canonLevel || 'canon');
  const confirmedClaims = canonLevel === 'canon' && entity.summary ? [entity.summary] : [];
  const inferredClaims = canonLevel === 'inference' && entity.summary ? [entity.summary] : [];
  const probableClaims = canonLevel === 'probable' && entity.summary ? [entity.summary] : [];

  return freeze({
    entityId: entity.id,
    readingBoundary: boundary,
    archiveMaximum: ARCHIVE_BOUNDARY,
    archiveDetailedMaximum: ARCHIVE_DETAILED_BOUNDARY,
    identityVerifiedThrough: entity.entityType === 'chapter' ? entity.number : latestEvidenceChapter,
    verifiedThrough,
    latestEvidenceChapter,
    detailStatus: hasGap ? 'coverage-gap' : 'current',
    hasGap,
    gapStart: hasGap ? gapStart : null,
    gapEnd,
    gapLabel: hasGap ? chapterRangeText(gapStart, gapEnd) : 'Current through selected boundary',
    lastReviewed: entity.updatedAt || entity.lastReviewed || ARCHIVE_REVIEW_DATE,
    sourceCount: sources.length,
    recentChanges: freeze(recentChanges),
    openQuestions: freeze(openQuestions),
    claims: freeze({
      confirmed: freeze(confirmedClaims),
      probable: freeze(probableClaims),
      inference: freeze(inferredClaims),
      contradictions: freeze(entity.contradictions || []),
      unresolved: freeze(openQuestions),
    }),
  });
};

const recordLatestChapter = (record) => latestAtOrBefore(directEvidenceChapters(record), ARCHIVE_BOUNDARY);

const domainReport = (id, label, records, boundary) => {
  const rows = records.map((record) => ({
    record,
    latest: recordLatestChapter(record),
    missingSource: record.entityType !== 'source' && !(record.sourceIds || []).length,
  }));
  const latestIndexed = latestAtOrBefore(rows.map((row) => row.latest).filter(Number.isFinite), boundary);
  return freeze({
    id,
    label,
    recordCount: rows.length,
    latestIndexed,
    currentAtBoundary: rows.filter((row) => row.latest === boundary).length,
    behindBoundary: rows.filter((row) => Number.isFinite(row.latest) && row.latest < boundary).length,
    noChapterEvidence: rows.filter((row) => !Number.isFinite(row.latest)).length,
    missingSources: rows.filter((row) => row.missingSource).length,
  });
};

export const getArchiveCoverageReport = (readingBoundary = ARCHIVE_BOUNDARY) => {
  const boundary = Math.min(ARCHIVE_BOUNDARY, Math.max(340, finite(readingBoundary) || ARCHIVE_BOUNDARY));
  const pendingChapters = successionChapterResearch
    .filter((record) => record.number <= boundary && normalize(record.status).includes('pending'))
    .map((record) => record.number);
  const domains = [
    domainReport('chapters', 'Chapters', successionArchiveData.chapters || [], boundary),
    domainReport('characters', 'Characters', successionArchiveData.characters || [], boundary),
    domainReport('organizations', 'Organizations', successionArchiveData.organizations || [], boundary),
    domainReport('nen', 'Nen and Guardian Beasts', [...(successionArchiveData.abilities || []), ...(successionArchiveData.guardianBeasts || [])], boundary),
    domainReport('events', 'Events', successionArchiveData.events || [], boundary),
    domainReport('assignments', 'Assignments', successionArchiveData.assignments || [], boundary),
    domainReport('relationships', 'Relationships', successionArchiveData.relationships || [], boundary),
    domainReport('locations', 'Locations and movement', [...(successionArchiveData.locations || []), ...(successionArchiveData.locationHistory || [])], boundary),
    domainReport('sources', 'Sources', successionArchiveData.sources || [], boundary),
  ];
  return freeze({
    readingBoundary: boundary,
    archiveMaximum: ARCHIVE_BOUNDARY,
    detailedMaximum: ARCHIVE_DETAILED_BOUNDARY,
    lastReviewed: ARCHIVE_REVIEW_DATE,
    pendingChapterNumbers: freeze(pendingChapters),
    pendingChapterCount: pendingChapters.length,
    domains: freeze(domains),
    totals: freeze({
      records: domains.reduce((sum, domain) => sum + domain.recordCount, 0),
      behindBoundary: domains.reduce((sum, domain) => sum + domain.behindBoundary, 0),
      noChapterEvidence: domains.reduce((sum, domain) => sum + domain.noChapterEvidence, 0),
      missingSources: domains.reduce((sum, domain) => sum + domain.missingSources, 0),
    }),
  });
};

export const getProtectionCoverage = (guards = [], entityOrId = null, readingBoundary = ARCHIVE_BOUNDARY) => {
  const named = guards.filter((guard) => !guard.isGroup);
  const groups = guards.filter((guard) => guard.isGroup);
  const missingPortraits = named.filter((guard) => !(guard.portrait || guard.entity?.media?.portrait || guard.entity?.image || guard.entity?.imageSource)).length;
  const categories = Object.fromEntries(['protection', 'observer', 'ally', 'hostile'].map((kind) => [kind, guards.filter((guard) => guard.kind === kind).length]));
  return freeze({
    documentedRecords: guards.length,
    namedPersonnel: named.length,
    groupComplements: groups.length,
    unknownRemainder: groups.length,
    missingPortraits,
    categories: freeze(categories),
    currency: entityOrId ? getEntityCoverage(entityOrId, readingBoundary) : null,
  });
};

export const getRosterCoverage = (members = [], organization = null, readingBoundary = ARCHIVE_BOUNDARY) => {
  const missingPortraits = members.filter((member) => !(member.portrait || member.entity?.media?.portrait || member.entity?.image || member.entity?.imageSource)).length;
  const namedRoles = members.filter((member) => member.role).length;
  return freeze({
    membersIndexed: members.length,
    membersWithRoles: namedRoles,
    missingPortraits,
    currency: organization ? getEntityCoverage(organization, readingBoundary) : null,
  });
};

export const chapterCurrencySummary = freeze({
  archiveMaximum: ARCHIVE_BOUNDARY,
  detailedMaximum: ARCHIVE_DETAILED_BOUNDARY,
  pendingChapterNumbers: freeze(successionChapterResearch.filter((record) => normalize(record.status).includes('pending')).map((record) => record.number)),
  lastReviewed: ARCHIVE_REVIEW_DATE,
});
