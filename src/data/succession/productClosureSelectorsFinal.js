import {
  createProductClosureSelectors as createBaseProductClosureSelectors,
  normalizeArchiveSearchText,
} from './productClosureSelectors.js';

const freeze = (values) => Object.freeze(values);
const includesAllTokens = (text, query) => {
  const haystack = normalizeArchiveSearchText(text);
  const tokens = normalizeArchiveSearchText(query).split(' ').filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
};

export const createProductClosureSelectors = (args) => {
  const base = createBaseProductClosureSelectors(args);
  const entityTypes = [...new Set(Object.values(args.data)
    .filter(Array.isArray)
    .flat()
    .map((record) => record?.entityType)
    .filter(Boolean))];

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
      ? [...allowed].filter((type) => !['story', 'media', 'nen-system'].includes(type))
      : [...entityTypes, 'glossary'];
    const baseResults = base.searchArchiveProduct(normalizedQuery, { ...options, types: baseTypes });
    const chapter = Number.isFinite(Number(options.chapter))
      ? Number(options.chapter)
      : args.data.chapters.at(-1)?.number;

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
          route: 'media',
          params: Object.freeze({ media: record.id, chapter }),
          media: record,
        })];
      })
      : [];

    return freeze([...new Map([...baseResults, ...systemResults, ...storyResults, ...mediaResults].map((result) => [result.id, result])).values()]
      .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
      .slice(0, Number(options.limit) || 40));
  };

  return Object.freeze({
    ...base,
    getGlossaryEntryAtChapter,
    getGlossaryEntriesAtChapter,
    searchArchiveProduct,
  });
};

export { normalizeArchiveSearchText };
