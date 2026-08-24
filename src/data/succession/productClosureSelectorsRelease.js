import {
  createProductClosureSelectors as createCanonicalProductClosureSelectors,
} from './productClosureSelectorsFinal.js';
import { normalizeArchiveSearchText } from './productClosureSelectors.js';
import {
  getSupplementalGlossaryEntriesAtChapter,
  glossaryEntryMatches,
  mergeGlossaryEntries,
} from './successionGlossarySupplement.js';

const freeze = (values = []) => Object.freeze([...values]);
const INTELLIGENCE_TYPES = Object.freeze(['knowledge-record', 'protocol', 'object', 'document', 'evidence-item']);
const typeMode = Object.freeze({
  'knowledge-record': 'knowledge',
  protocol: 'protocols',
  object: 'artifacts',
  document: 'artifacts',
  'evidence-item': 'artifacts',
});

const searchableText = (entity, archive) => [
  entity.name,
  ...(entity.aliases || []),
  entity.summary,
  entity.entityType,
  entity.knowledgeState,
  entity.secrecy,
  ...(entity.subjectLabels || []),
  ...(entity.knowerLabels || []),
  ...(entity.misinformedLabels || []),
  entity.acquisition,
  entity.domain,
  entity.protocolStatus,
  entity.authority,
  entity.ruleStatement,
  entity.trigger,
  entity.scope,
  entity.enforcement,
  ...(entity.exceptions || []),
  ...(entity.openQuestions || []),
  entity.artifactCategory,
  entity.documentCategory,
  entity.evidenceCategory,
  entity.artifactState,
  ...(entity.ownerLabels || []),
  ...(entity.holderLabels || []),
  ...(entity.authorLabels || []),
  ...(entity.recipientLabels || []),
  ...(entity.locationLabels || []),
  entity.nenStatus,
  entity.legalSignificance,
  entity.evidenceRole,
  entity.evidentiaryUse,
  entity.custodyStatus,
  ...(entity.linkedArtifactIds || []).map((id) => archive.getEntityById(id)?.name || id),
].filter(Boolean).join(' ');

const includesAllTokens = (value, query) => {
  const haystack = normalizeArchiveSearchText(value);
  const tokens = normalizeArchiveSearchText(query).split(' ').filter(Boolean);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
};

export const createProductClosureSelectors = (args) => {
  const base = createCanonicalProductClosureSelectors(args);
  const latestChapter = args.data.chapters.at(-1)?.number || 418;

  const relatedRecord = (id) => {
    const entity = args.archive.getEntityById(id);
    if (entity) return Object.freeze({ id, kind: 'entity', label: entity.name, entity, route: null, params: null });
    const system = args.data.nenSystemProfiles?.[id];
    if (system) return Object.freeze({ id, kind: 'nen-system', label: system.name, record: system, route: 'nen', params: Object.freeze({ system: id.replace('nen-system:', '') }) });
    return null;
  };

  const enhanceGlossary = (entry, chapter) => {
    if (!entry) return null;
    const parsedChapter = Number.isFinite(Number(chapter)) ? Number(chapter) : latestChapter;
    const internalSources = (entry.sourceIds || [])
      .map((id) => args.archive.getEntityById(id))
      .filter((source) => source?.entityType === 'source' && (!source.chapter || source.chapter <= parsedChapter));
    const existingSources = (entry.sources || []).filter((source) => !source?.chapter || source.chapter <= parsedChapter);
    const sources = [...new Map([...existingSources, ...internalSources, ...(entry.externalSources || [])].filter(Boolean).map((source) => [source.id || source.url || source.name, source])).values()];
    return Object.freeze({
      ...entry,
      chapter: parsedChapter,
      sources: freeze(sources),
      relatedRecords: freeze((entry.relatedEntityIds || []).map(relatedRecord).filter(Boolean)),
    });
  };

  const getGlossaryEntriesAtChapter = (chapter = null, { category = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    const canonical = base.getGlossaryEntriesAtChapter(parsedChapter);
    const supplemental = getSupplementalGlossaryEntriesAtChapter(parsedChapter);
    return freeze(mergeGlossaryEntries(canonical, supplemental)
      .map((entry) => enhanceGlossary(entry, parsedChapter))
      .filter(Boolean)
      .filter((entry) => !category || entry.category === category)
      .sort((left, right) => left.term.localeCompare(right.term)));
  };

  const getGlossaryEntryAtChapter = (idOrSlug, chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    return getGlossaryEntriesAtChapter(parsedChapter).find((entry) => glossaryEntryMatches(entry, idOrSlug)) || null;
  };

  const getGlossaryEntry = (idOrSlug) => getGlossaryEntryAtChapter(idOrSlug, latestChapter);

  const searchArchiveProduct = (query, options = {}) => {
    const baseResults = base.searchArchiveProduct(query, options);
    const normalized = normalizeArchiveSearchText(query);
    const chapter = Number.isFinite(Number(options.chapter)) ? Number(options.chapter) : latestChapter;
    const allowed = options.types ? new Set(options.types) : null;
    if (!normalized) return baseResults;

    const intelligenceResults = INTELLIGENCE_TYPES.flatMap((type) => {
      if (allowed && !allowed.has(type)) return [];
      return args.archive.getEntitiesByType(type).flatMap((entity) => {
        if (entity.chapterRange?.start > chapter) return [];
        const name = normalizeArchiveSearchText(entity.name);
        const aliases = normalizeArchiveSearchText((entity.aliases || []).join(' '));
        const text = normalizeArchiveSearchText(searchableText(entity, args.archive));
        const tokens = normalized.split(' ').filter(Boolean);
        if (!tokens.length || !tokens.every((token) => text.includes(token))) return [];
        const exact = name === normalized || aliases.split(' ').includes(normalized);
        const starts = name.startsWith(normalized);
        return [Object.freeze({
          id: entity.id,
          resultType: 'entity',
          domain: type,
          label: entity.name,
          summary: entity.summary,
          score: exact ? 190 : starts ? 145 : 98,
          matchReason: exact ? `Exact ${type.replaceAll('-', ' ')} name` : `Matched ${type.replaceAll('-', ' ')} intelligence`,
          route: 'research',
          params: Object.freeze({ mode: typeMode[type], entity: entity.id, chapter }),
          entity,
        })];
      });
    });

    const glossaryResults = (!allowed || allowed.has('glossary'))
      ? getGlossaryEntriesAtChapter(chapter).flatMap((entry) => {
        const searchable = [entry.term, ...(entry.synonyms || []), entry.definition, entry.category, ...(entry.relatedTerms || [])].filter(Boolean).join(' ');
        if (!includesAllTokens(searchable, normalized)) return [];
        const exactTerm = normalizeArchiveSearchText(entry.term) === normalized;
        const exactAlias = (entry.synonyms || []).some((alias) => normalizeArchiveSearchText(alias) === normalized);
        return [Object.freeze({
          id: entry.id,
          resultType: 'glossary',
          domain: 'glossary',
          label: entry.term,
          summary: entry.definition,
          score: exactTerm ? 210 : exactAlias ? 195 : 92,
          matchReason: exactTerm ? 'Exact glossary term' : exactAlias ? 'Exact glossary synonym' : 'Matched unified glossary definition or related term',
          route: 'glossary',
          params: Object.freeze({ term: entry.id, chapter }),
          glossary: entry,
        })];
      })
      : [];

    return freeze([...new Map([...baseResults, ...glossaryResults, ...intelligenceResults].map((result) => [result.id, result])).values()]
      .sort((left, right) => (Number(right.score) || 0) - (Number(left.score) || 0)
        || String(left.label || left.id).localeCompare(String(right.label || right.id)))
      .slice(0, Number(options.limit) || 40));
  };

  const getProductClosureReport = () => {
    const baseReport = base.getProductClosureReport();
    const glossary = getGlossaryEntriesAtChapter(latestChapter);
    const validExtendedIds = new Set([
      ...Object.keys(args.data.nenSystemProfiles || {}),
      ...Object.keys(args.data.storyPhaseProfiles || {}),
      ...Object.keys(args.data.storyLaneProfiles || {}),
      ...Object.keys(args.data.storyThreadProfiles || {}),
      ...Object.keys(args.data.storyCausalLinksById || {}),
    ]);
    const referenceIssues = [];
    for (const entry of glossary) {
      for (const id of entry.relatedEntityIds || []) {
        if (!args.archive.getEntityById(id) && !validExtendedIds.has(id)) referenceIssues.push(Object.freeze({ entryId: entry.id, referenceId: id }));
      }
      for (const sourceId of entry.sourceIds || []) {
        if (args.archive.getEntityById(sourceId)?.entityType !== 'source') referenceIssues.push(Object.freeze({ entryId: entry.id, referenceId: sourceId }));
      }
    }
    const closureReady = glossary.length >= 20
      && referenceIssues.length === 0
      && baseReport.media.total > 0
      && baseReport.media.issues.length === 0;
    return Object.freeze({
      ...baseReport,
      status: closureReady ? 'release-candidate' : 'open',
      closureReady,
      glossary: Object.freeze({ total: glossary.length, referenceIssues: freeze(referenceIssues), unified: true }),
      search: Object.freeze({ ...baseReport.search, unifiedGlossary: true }),
    });
  };

  return Object.freeze({
    ...base,
    getGlossaryEntry,
    getGlossaryEntryAtChapter,
    getGlossaryEntriesAtChapter,
    searchArchiveProduct,
    getProductClosureReport,
  });
};
