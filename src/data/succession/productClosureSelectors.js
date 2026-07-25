const freeze = (values) => Object.freeze(values);
const unique = (values) => [...new Set(values.filter(Boolean))];
const ordinalAliases = Object.freeze([
  ['first', '1st'], ['second', '2nd'], ['third', '3rd'], ['fourth', '4th'], ['fifth', '5th'],
  ['sixth', '6th'], ['seventh', '7th'], ['eighth', '8th'], ['ninth', '9th'], ['tenth', '10th'],
  ['eleventh', '11th'], ['twelfth', '12th'], ['thirteenth', '13th'], ['fourteenth', '14th'],
]);

export const normalizeArchiveSearchText = (value) => {
  let normalized = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\b([a-z0-9]+)'s\b/g, '$1')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
  for (const [word, ordinal] of ordinalAliases) normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'g'), ordinal);
  return normalized;
};

const includesAllTokens = (text, query) => {
  const tokens = normalizeArchiveSearchText(query).split(' ').filter(Boolean);
  const haystack = normalizeArchiveSearchText(text);
  return tokens.length > 0 && tokens.every((token) => haystack.includes(token));
};

const scoreFields = (query, fields) => {
  const normalized = normalizeArchiveSearchText(query);
  if (!normalized) return null;
  let best = null;
  for (const field of fields) {
    const text = normalizeArchiveSearchText(field.value);
    if (!text) continue;
    let score = 0;
    let detail = null;
    if (text === normalized) {
      score = field.weight + 100;
      detail = `Exact ${field.label}`;
    } else if (text.startsWith(normalized)) {
      score = field.weight + 65;
      detail = `${field.label} starts with the query`;
    } else if (text.includes(normalized)) {
      score = field.weight + 40;
      detail = `Matched ${field.label}`;
    } else if (includesAllTokens(text, normalized)) {
      score = field.weight + 20;
      detail = `Matched words across ${field.label}`;
    }
    if (score && (!best || score > best.score)) best = { score, reason: detail };
  }
  return best;
};

const entityFields = (entity, dossiers = {}) => {
  const fields = [
    { label: 'name', value: entity.name, weight: 100 },
    { label: 'alias', value: (entity.aliases || []).join(' '), weight: 90 },
    { label: 'stable ID', value: `${entity.id} ${(entity.legacyIds || []).join(' ')}`, weight: 75 },
    { label: 'summary', value: entity.summary, weight: 45 },
    { label: 'classification', value: [entity.entityType, entity.category, entity.subtype, entity.organizationType, entity.locationType, ...(entity.roles || []), ...(entity.tags || [])].filter(Boolean).join(' '), weight: 35 },
    { label: 'mechanics and conditions', value: [entity.activation, entity.range, entity.duration, ...(entity.conditions || []), ...(entity.limitations || []), ...(entity.costs || []), ...(entity.targets || []), ...(entity.knownUses || [])].filter(Boolean).join(' '), weight: 50 },
    { label: 'operations and evidence', value: [entity.objective, entity.operationalState, entity.authorityBasis, entity.basis, ...(entity.operationalNotes || []), ...(entity.evidenceNotes || []), ...(entity.openQuestions || [])].filter(Boolean).join(' '), weight: 40 },
  ];
  if (dossiers.character) fields.push({ label: 'chapter-bounded character state', value: [dossiers.character.state?.operationalState, dossiers.character.state?.bodyState, dossiers.character.state?.consciousnessState, dossiers.character.state?.allegianceState, dossiers.character.roleProfile?.label, ...(dossiers.character.state?.openQuestions || [])].filter(Boolean).join(' '), weight: 55 });
  if (dossiers.organization) fields.push({ label: 'chapter-bounded institution state', value: [dossiers.organization.state?.operationalState, dossiers.organization.state?.authority, ...(dossiers.organization.objectives || []), ...(dossiers.organization.pressure || [])].filter(Boolean).join(' '), weight: 55 });
  if (dossiers.ability) fields.push({ label: 'Nen dossier', value: [dossiers.ability.knowledge?.summary, dossiers.ability.knowledge?.activation, ...(dossiers.ability.knowledge?.conditions || []), ...(dossiers.ability.knowledge?.limitations || []), ...(dossiers.ability.knowledge?.costs || [])].filter(Boolean).join(' '), weight: 60 });
  return fields;
};

export const createProductClosureSelectors = ({ data, archive, characterStates, organizationStates, nenSystems, storyIntelligence }) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const glossaryById = new Map((data.glossaryEntries || []).map((entry) => [entry.id, entry]));
  const mediaById = new Map((data.mediaRecords || []).map((record) => [record.id, record]));

  const getGlossaryEntry = (idOrSlug) => glossaryById.get(idOrSlug)
    || [...glossaryById.values()].find((entry) => entry.slug === idOrSlug)
    || null;

  const getGlossaryEntryAtChapter = (idOrSlug, chapter = null) => {
    const entry = getGlossaryEntry(idOrSlug);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!entry || !Number.isFinite(parsedChapter) || entry.firstChapter > parsedChapter) return null;
    const boundary = [...(entry.boundaryDefinitions || [])]
      .filter((record) => record.start <= parsedChapter)
      .sort((left, right) => right.start - left.start)[0];
    return Object.freeze({
      ...entry,
      definition: boundary?.definition || entry.definition,
      sources: freeze((entry.sourceIds || []).map((sourceId) => archive.getEntityById(sourceId)).filter((source) => source?.entityType === 'source' && (!source.chapter || source.chapter <= parsedChapter))),
      related: freeze((entry.relatedEntityIds || []).map((id) => archive.getEntityById(id)).filter(Boolean)),
      chapter: parsedChapter,
    });
  };

  const getGlossaryEntriesAtChapter = (chapter = null, { category = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    return freeze([...glossaryById.values()]
      .map((entry) => getGlossaryEntryAtChapter(entry.id, parsedChapter))
      .filter(Boolean)
      .filter((entry) => !category || entry.category === category)
      .sort((left, right) => left.term.localeCompare(right.term)));
  };

  const entityAvailableAtChapter = (entity, chapter) => {
    if (!entity) return false;
    if (entity.entityType === 'ability') return Boolean(nenSystems.getAbilityKnowledgeAtChapter(entity.id, chapter)?.known);
    if (entity.entityType === 'guardian-beast') return Boolean(nenSystems.getGuardianBeastDossier(entity.id, chapter));
    if (entity.entityType === 'chapter') return entity.number <= chapter;
    if (entity.entityType === 'source' && Number.isFinite(entity.chapter)) return entity.chapter <= chapter;
    if (entity.chapterRange?.start) return entity.chapterRange.start <= chapter;
    const sourceChapters = (entity.sourceIds || []).map((id) => archive.getEntityById(id)?.chapter).filter(Number.isFinite);
    const contextual = [];
    if (entity.entityType === 'character') {
      contextual.push(...archive.getAppearancesForCharacter(entity.id).map((record) => record.chapter));
      contextual.push(...(data.characterStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'organization') {
      contextual.push(...archive.getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
      contextual.push(...(data.organizationStateProfiles?.[entity.id] || []).map((record) => record.chapterRange.start));
    }
    if (entity.entityType === 'location') contextual.push(...archive.getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
    const first = [...sourceChapters, ...contextual].sort((left, right) => left - right)[0];
    return first === undefined || first <= chapter;
  };

  const getMediaRecord = (id) => mediaById.get(id) || null;
  const getMediaRecordsAtChapter = (chapter = null, { mediaType = null, availability = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return freeze([]);
    return freeze([...mediaById.values()]
      .filter((record) => !mediaType || record.mediaType === mediaType)
      .filter((record) => !availability || record.availability === availability)
      .map((record) => Object.freeze({
        ...record,
        subjects: freeze((record.subjectIds || []).map((id) => archive.getEntityById(id)).filter((entity) => entityAvailableAtChapter(entity, parsedChapter))),
        sources: freeze((record.sourceIds || []).map((id) => archive.getEntityById(id)).filter((source) => source?.entityType === 'source' && (!source.chapter || source.chapter <= parsedChapter))),
      }))
      .filter((record) => record.subjects.length > 0)
      .sort((left, right) => left.label.localeCompare(right.label)));
  };

  const entityRoute = (entity) => {
    if (entity.entityType === 'character') return 'characters';
    if (entity.entityType === 'organization') return 'organizations';
    if (entity.entityType === 'ability') return 'nen';
    if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts';
    if (entity.entityType === 'event') return 'events';
    if (entity.entityType === 'location' || entity.entityType === 'location-history') return 'locations';
    if (entity.entityType === 'assignment') return 'bodyguards';
    if (entity.entityType === 'relationship') return 'relationships';
    if (entity.entityType === 'chapter') return 'chapters';
    if (entity.entityType === 'source') return 'research';
    return 'archive';
  };

  const searchArchiveProduct = (query, { chapter = null, limit = 40, types = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    const normalized = normalizeArchiveSearchText(query);
    if (!normalized || !Number.isFinite(parsedChapter)) return freeze([]);
    const allowed = types ? new Set(types) : null;
    const results = [];

    const entityCollections = Object.values(data).filter(Array.isArray).flat().filter((record) => record?.entityType && record.publicationStatus !== 'hidden');
    for (const entity of new Map(entityCollections.map((record) => [record.id, record])).values()) {
      if (allowed && !allowed.has(entity.entityType)) continue;
      if (!entityAvailableAtChapter(entity, parsedChapter)) continue;
      const dossiers = {
        character: entity.entityType === 'character' ? characterStates.getCharacterDossier(entity.id, parsedChapter) : null,
        organization: entity.entityType === 'organization' ? organizationStates.getOrganizationDossier(entity.id, parsedChapter) : null,
        ability: entity.entityType === 'ability' ? nenSystems.getAbilityDossier(entity.id, parsedChapter) : null,
      };
      const match = scoreFields(normalized, entityFields(entity, dossiers));
      if (!match) continue;
      results.push(Object.freeze({
        id: entity.id,
        resultType: 'entity',
        domain: entity.entityType,
        label: entity.name,
        summary: entity.summary || 'Canonical archive record.',
        score: match.score,
        matchReason: match.reason,
        route: entityRoute(entity),
        params: Object.freeze({ entity: entity.id, chapter: parsedChapter }),
        entity,
      }));
    }

    if (!allowed || allowed.has('glossary')) {
      for (const entry of getGlossaryEntriesAtChapter(parsedChapter)) {
        const match = scoreFields(normalized, [
          { label: 'glossary term', value: entry.term, weight: 110 },
          { label: 'glossary synonym', value: entry.synonyms.join(' '), weight: 95 },
          { label: 'definition', value: entry.definition, weight: 55 },
          { label: 'glossary category', value: entry.category, weight: 25 },
        ]);
        if (!match) continue;
        results.push(Object.freeze({ id: entry.id, resultType: 'glossary', domain: 'glossary', label: entry.term, summary: entry.definition, score: match.score, matchReason: match.reason, route: 'glossary', params: Object.freeze({ term: entry.id, chapter: parsedChapter }), glossary: entry }));
      }
    }

    if (!allowed || allowed.has('story')) {
      for (const result of storyIntelligence.searchStoryIntelligence(query, { chapter: parsedChapter, limit: 100 })) {
        const record = result.profile || result.chapter || null;
        const id = record?.id || `${result.kind}:${result.label}`;
        results.push(Object.freeze({
          id,
          resultType: 'story',
          domain: `story-${result.kind}`,
          label: result.label,
          summary: result.summary || result.question || 'Story Intelligence record.',
          score: 75,
          matchReason: `Matched Story ${result.kind}`,
          route: result.kind === 'chapter' ? 'chapters' : 'story',
          params: Object.freeze(result.kind === 'chapter' ? { chapter: result.chapter?.number || parsedChapter } : { [result.kind]: record?.id, chapter: parsedChapter }),
          story: result,
        }));
      }
    }

    return freeze([...new Map(results.map((result) => [result.id, result])).values()]
      .sort((left, right) => right.score - left.score || left.label.localeCompare(right.label))
      .slice(0, Number(limit) || 40));
  };

  const getProductClosureReport = () => {
    const validExtendedIds = new Set([
      ...Object.keys(data.nenSystemProfiles || {}),
      ...Object.keys(data.storyPhaseProfiles || {}),
      ...Object.keys(data.storyLaneProfiles || {}),
      ...Object.keys(data.storyThreadProfiles || {}),
      ...Object.keys(data.storyCausalLinksById || {}),
    ]);
    const glossaryReferenceIssues = [];
    for (const entry of glossaryById.values()) {
      for (const id of entry.relatedEntityIds || []) if (!archive.getEntityById(id) && !validExtendedIds.has(id)) glossaryReferenceIssues.push(Object.freeze({ entryId: entry.id, referenceId: id }));
      for (const sourceId of entry.sourceIds || []) if (archive.getEntityById(sourceId)?.entityType !== 'source') glossaryReferenceIssues.push(Object.freeze({ entryId: entry.id, referenceId: sourceId }));
    }
    const mediaIssues = [];
    const srcs = new Set();
    for (const record of mediaById.values()) {
      if (!record.src || !record.alt || !record.provenanceUrl) mediaIssues.push(Object.freeze({ mediaId: record.id, issue: 'incomplete-metadata' }));
      if ((record.subjectIds || []).some((id) => !archive.getEntityById(id))) mediaIssues.push(Object.freeze({ mediaId: record.id, issue: 'missing-subject' }));
      if (srcs.has(record.src)) mediaIssues.push(Object.freeze({ mediaId: record.id, issue: 'duplicate-source' }));
      srcs.add(record.src);
    }
    const closureReady = glossaryById.size >= 20 && mediaById.size > 0 && glossaryReferenceIssues.length === 0 && mediaIssues.length === 0;
    return Object.freeze({
      status: closureReady ? 'release-candidate' : 'open',
      closureReady,
      glossary: Object.freeze({ total: glossaryById.size, referenceIssues: freeze(glossaryReferenceIssues) }),
      media: Object.freeze({ total: mediaById.size, issues: freeze(mediaIssues) }),
      search: Object.freeze({ normalization: 'punctuation, possessives, diacritics, hyphens, ordinals, and whitespace', explainsMatches: true, chapterBounded: true }),
    });
  };

  return Object.freeze({
    getGlossaryEntry,
    getGlossaryEntryAtChapter,
    getGlossaryEntriesAtChapter,
    getMediaRecord,
    getMediaRecordsAtChapter,
    searchArchiveProduct,
    getProductClosureReport,
  });
};
