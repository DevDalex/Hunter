import {
  createProductClosureSelectors as createBaseProductClosureSelectors,
  normalizeArchiveSearchText,
} from './productClosureSelectors.js';

const freeze = (values) => Object.freeze(values);

export const createProductClosureSelectors = (args) => {
  const base = createBaseProductClosureSelectors(args);
  const entityTypes = [...new Set(Object.values(args.data)
    .filter(Array.isArray)
    .flat()
    .map((record) => record?.entityType)
    .filter(Boolean))];

  const searchArchiveProduct = (query, options = {}) => {
    const normalizedQuery = normalizeArchiveSearchText(query);
    const allowed = options.types ? new Set(options.types) : null;
    const baseTypes = allowed
      ? [...allowed].filter((type) => type !== 'story')
      : [...entityTypes, 'glossary'];
    const baseResults = base.searchArchiveProduct(normalizedQuery, { ...options, types: baseTypes });
    const includeStory = !allowed || allowed.has('story');
    if (!includeStory) return baseResults;

    const chapter = Number.isFinite(Number(options.chapter))
      ? Number(options.chapter)
      : args.data.chapters.at(-1)?.number;
    const storyResults = args.storyIntelligence.searchStoryIntelligence(normalizedQuery, {
      chapter,
      limit: Math.max(Number(options.limit) || 40, 100),
    }).map((result) => {
      const record = result.record || null;
      return Object.freeze({
        id: record?.id || result.id,
        resultType: 'story',
        domain: `story-${result.kind}`,
        label: result.displayName || record?.name || result.id,
        summary: result.displaySummary || record?.summary || 'Story Intelligence record.',
        score: Number(result.score) || 75,
        matchReason: `Matched Story ${result.kind}`,
        route: result.kind === 'chapter' ? 'chapters' : 'story',
        params: Object.freeze(result.kind === 'chapter'
          ? { chapter: record?.number || chapter }
          : { [result.kind]: record?.id, chapter }),
        story: result,
      });
    });

    return freeze([...new Map([...baseResults, ...storyResults].map((result) => [result.id, result])).values()]
      .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
      .slice(0, Number(options.limit) || 40));
  };

  return Object.freeze({ ...base, searchArchiveProduct });
};

export { normalizeArchiveSearchText };
