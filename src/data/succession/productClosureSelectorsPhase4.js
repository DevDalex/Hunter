import {
  createProductClosureSelectors as createPhase3ProductClosureSelectors,
  normalizeArchiveSearchText,
} from './productClosureSelectorsFinal.js';

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

export const createProductClosureSelectors = (args) => {
  const base = createPhase3ProductClosureSelectors(args);

  const searchArchiveProduct = (query, options = {}) => {
    const baseResults = base.searchArchiveProduct(query, options);
    const normalized = normalizeArchiveSearchText(query);
    const chapter = Number.isFinite(Number(options.chapter)) ? Number(options.chapter) : args.data.chapters.at(-1)?.number || 414;
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

    return freeze([...new Map([...intelligenceResults, ...baseResults].map((result) => [result.id, result])).values()]
      .sort((left, right) => (Number(right.score) || 0) - (Number(left.score) || 0)
        || String(left.label || left.id).localeCompare(String(right.label || right.id)))
      .slice(0, Number(options.limit) || 40));
  };

  return Object.freeze({ ...base, searchArchiveProduct });
};
