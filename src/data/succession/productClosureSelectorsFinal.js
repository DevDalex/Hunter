import {
  createProductClosureSelectors as createBaseProductClosureSelectors,
  normalizeArchiveSearchText,
} from './productClosureSelectors.js';
import { successionChapterResearch } from './successionResearch.js';

const freeze = (values) => Object.freeze(values);
const includesAllTokens = (text, query) => {
  const haystack = normalizeArchiveSearchText(text);
  const tokens = normalizeArchiveSearchText(query).split(' ').filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
};

const searchableEntityTypes = Object.freeze([
  'character',
  'organization',
  'ability',
  'guardian-beast',
  'event',
  'location',
  'assignment',
  'relationship',
  'chapter',
  'source',
]);

const pendingChapterEntity = (record) => Object.freeze({
  id: `chapter:${record.number}`,
  entityType: 'chapter',
  slug: `chapter-${record.number}`,
  name: `Chapter ${record.number}`,
  number: record.number,
  title: record.title,
  summary: record.focus,
  researchStatus: record.status,
  publicationStatus: 'published',
  source: record.source,
  sourceUrl: record.source,
  pendingResearch: true,
});

export const createProductClosureSelectors = (args) => {
  const base = createBaseProductClosureSelectors(args);

  const relatedRecord = (id) => {
    const entity = args.archive.getEntityById(id);
    if (entity) return Object.freeze({ id, kind: 'entity', label: entity.name, entity, route: null, params: null });
    const system = args.data.nenSystemProfiles?.[id];
    if (system) return Object.freeze({ id, kind: 'nen-system', label: system.name, record: system, route: 'nen', params: Object.freeze({ system: id.replace('nen-system:', '') }) });
    const phase = args.data.storyPhaseProfiles?.[id];
    if (phase) return Object.freeze({ id, kind: 'story-phase', label: phase.name, record: phase, route: 'story', params: Object.freeze({ phase: id.replace('story-phase:', '') }) });
    const lane = args.data.storyLaneProfiles?.[id];
    if (lane) return Object.freeze({ id, kind: 'story-lane', label: lane.name, record: lane, route: 'story', params: Object.freeze({ lane: id.replace('story-lane:', '') }) });
    const thread = args.data.storyThreadProfiles?.[id];
    if (thread) return Object.freeze({ id, kind: 'story-thread', label: thread.name, record: thread, route: 'story', params: Object.freeze({ thread: id.replace('story-thread:', '') }) });
    return null;
  };

  const enhanceGlossary = (entry) => entry ? Object.freeze({
    ...entry,
    relatedRecords: freeze((entry.relatedEntityIds || []).map(relatedRecord).filter(Boolean)),
  }) : null;

  const getGlossaryEntryAtChapter = (idOrSlug, chapter = null) => enhanceGlossary(base.getGlossaryEntryAtChapter(idOrSlug, chapter));
  const getGlossaryEntriesAtChapter = (chapter = null, options = {}) => freeze(base.getGlossaryEntriesAtChapter(chapter, options).map(enhanceGlossary));

  const searchArchiveProduct = (query, options = {}) => {
    const normalizedQuery = normalizeArchiveSearchText(query);
    const allowed = options.types ? new Set(options.types) : null;
    const baseTypes = allowed
      ? [...allowed].filter((type) => searchableEntityTypes.includes(type) || type === 'glossary')
      : [...searchableEntityTypes, 'glossary'];
    const baseResults = base.searchArchiveProduct(normalizedQuery, { ...options, types: baseTypes });
    const chapter = Number.isFinite(Number(options.chapter))
      ? Number(options.chapter)
      : args.data.chapters.at(-1)?.number;

    const requestedChapterMatch = normalizedQuery.match(/^(?:chapter )?(\d+)$/);
    const requestedChapter = requestedChapterMatch ? Number(requestedChapterMatch[1]) : null;
    const pendingChapterResults = (!allowed || allowed.has('chapter'))
      ? successionChapterResearch.flatMap((record) => {
        if (record.number > chapter && record.number !== requestedChapter) return [];
        const searchable = [
          `Chapter ${record.number}`,
          record.title,
          record.phase,
          record.status,
          record.focus,
        ].join(' ');
        if (!includesAllTokens(searchable, normalizedQuery)) return [];
        const exactNumber = requestedChapter === record.number;
        const entity = pendingChapterEntity(record);
        return [Object.freeze({
          id: entity.id,
          resultType: 'entity',
          domain: 'chapter',
          label: entity.name,
          summary: entity.summary,
          score: exactNumber ? 190 : 84,
          matchReason: exactNumber ? 'Exact imported chapter number' : 'Matched imported chapter record',
          route: 'chapters',
          params: Object.freeze({ entity: entity.id, chapter: record.number }),
          entity,
        })];
      })
      : [];

    const systemResults = (!allowed || allowed.has('nen-system'))
      ? args.nenSystems.getNenSystemsAtChapter(chapter).flatMap((profile) => {
        const searchable = [
          profile.name,
          profile.summary,
          profile.category,
          ...(profile.knownRules || []),
          ...(profile.costs || []),
          ...(profile.risks || []),
          ...(profile.unresolved || []),
        ].join(' ');
        if (!includesAllTokens(searchable, normalizedQuery)) return [];
        const exactName = normalizeArchiveSearchText(profile.name) === normalizedQuery;
        return [Object.freeze({
          id: profile.id,
          resultType: 'nen-system',
          domain: 'nen-system',
          label: profile.name,
          summary: profile.summary,
          score: exactName ? 170 : 82,
          matchReason: exactName ? 'Exact Nen-system name' : 'Matched Nen-system rules, costs, risks, or open questions',
          route: 'nen',
          params: Object.freeze({ system: profile.id.replace('nen-system:', ''), chapter }),
          system: profile,
        })];
      })
      : [];

    const storyResults = (!allowed || allowed.has('story'))
      ? args.storyIntelligence.searchStoryIntelligence(normalizedQuery, {
        chapter,
        limit: Math.max(Number(options.limit) || 40, 100),
      }).flatMap((result) => {
        const record = result.record || null;
        const unavailableAbilities = (record?.abilityIds || [])
          .map((id) => args.archive.getEntityById(id))
          .filter(Boolean)
          .filter((ability) => !args.nenSystems.getAbilityKnowledgeAtChapter(ability.id, chapter)?.known);
        if (unavailableAbilities.some((ability) => normalizedQuery.includes(normalizeArchiveSearchText(ability.name)))) return [];
        const safeSummary = unavailableAbilities.length
          ? `This ${result.kind} is active through Chapter ${chapter}; later ability details remain hidden by the selected boundary.`
          : result.displaySummary || record?.summary || 'Story Intelligence record.';
        return [Object.freeze({
          id: record?.id || result.id,
          resultType: 'story',
          domain: `story-${result.kind}`,
          label: result.displayName || record?.name || result.id,
          summary: safeSummary,
          score: Number(result.score) || 75,
          matchReason: `Matched Story ${result.kind}`,
          route: result.kind === 'chapter' ? 'chapters' : 'story',
          params: Object.freeze(result.kind === 'chapter'
            ? { chapter: record?.number || chapter }
            : { [result.kind]: record?.id, chapter }),
          story: result,
        })];
      })
      : [];

    const mediaResults = (!allowed || allowed.has('media'))
      ? base.getMediaRecordsAtChapter(chapter).flatMap((record) => {
        const searchable = `${record.label} ${record.mediaType} ${record.alt} ${record.subjects.map((subject) => subject.name).join(' ')}`;
        if (!includesAllTokens(searchable, normalizedQuery)) return [];
        const exactLabel = normalizeArchiveSearchText(record.label) === normalizedQuery;
        return [Object.freeze({
          id: record.id,
          resultType: 'media',
          domain: 'media',
          label: record.label,
          summary: `${record.mediaType.replaceAll('-', ' ')} · ${record.subjects.map((subject) => subject.name).join(' · ')}`,
          score: exactLabel ? 150 : 68,
          matchReason: exactLabel ? 'Exact media label' : 'Matched media subject or alt text',
          route: 'research',
          params: Object.freeze({ media: record.id, chapter }),
          media: record,
        })];
      })
      : [];

    const assignmentResults = (!allowed || allowed.has('assignment'))
      ? args.archive.getEntitiesByType('assignment').flatMap((entity) => {
        if (Number.isFinite(entity.chapterRange?.start) && entity.chapterRange.start > chapter) return [];
        const linkedIds = [
          entity.personId,
          entity.assigneeId,
          entity.subjectId,
          entity.targetId,
          entity.principalId,
          entity.organizationId,
          entity.locationId,
          ...(entity.personIds || []),
          ...(entity.assigneeIds || []),
          ...(entity.subjectIds || []),
          ...(entity.targetIds || []),
          ...(entity.principalIds || []),
          ...(entity.organizationIds || []),
          ...(entity.locationIds || []),
          ...(entity.characterIds || []),
          ...(entity.actorIds || []),
        ].filter(Boolean);
        const linkedNames = [
          ...linkedIds.map((id) => args.archive.getEntityById(id)?.name).filter(Boolean),
          ...args.archive.getRelatedEntities(entity.id).map((record) => record?.name).filter(Boolean),
        ];
        const searchable = [
          entity.name,
          entity.summary,
          entity.entityType,
          entity.assignmentType,
          entity.type,
          entity.category,
          entity.subtype,
          entity.status,
          entity.role,
          entity.objective,
          entity.operationalState,
          ...(entity.roles || []),
          ...(entity.tags || []),
          ...(entity.duties || []),
          ...(entity.responsibilities || []),
          ...new Set(linkedNames),
        ].filter(Boolean).join(' ');
        if (!includesAllTokens(searchable, normalizedQuery)) return [];
        const exactName = normalizeArchiveSearchText(entity.name) === normalizedQuery;
        return [Object.freeze({
          id: entity.id,
          resultType: 'entity',
          domain: 'assignment',
          label: entity.name,
          summary: entity.summary || 'Canonical assignment record.',
          score: exactName ? 160 : 84,
          matchReason: exactName ? 'Exact assignment name' : 'Matched assignment type, duty, or linked subject',
          route: 'bodyguards',
          params: Object.freeze({ entity: entity.id, chapter }),
          entity,
        })];
      })
      : [];

    return freeze([...new Map([...systemResults, ...storyResults, ...mediaResults, ...assignmentResults, ...pendingChapterResults, ...baseResults].map((result) => [result.id, result])).values()]
      .sort((left, right) => (Number(right.score) || 0) - (Number(left.score) || 0)
        || String(left.label || left.id).localeCompare(String(right.label || right.id)))
      .slice(0, Number(options.limit) || 40));
  };

  return Object.freeze({
    ...base,
    getGlossaryEntryAtChapter,
    getGlossaryEntriesAtChapter,
    searchArchiveProduct,
  });
};
