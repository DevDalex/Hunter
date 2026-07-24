const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);
const rangeEnd = (range) => range.end ?? Number.POSITIVE_INFINITY;
const byRange = (left, right) => left.chapterRange.start - right.chapterRange.start || rangeEnd(left.chapterRange) - rangeEnd(right.chapterRange) || left.id.localeCompare(right.id);
const uniqueById = (values) => [...new Map(values.filter(Boolean).map((value) => [value.id, value])).values()];

export const createNenSystemSelectors = ({ data, archive }) => {
  const latestChapter = data.chapters.at(-1)?.number || 413;
  const systemProfiles = data.nenSystemProfiles || Object.freeze({});
  const beastStateProfiles = data.guardianBeastStateProfiles || Object.freeze({});
  const abilitySystemLinks = data.abilitySystemLinks || Object.freeze({});

  const sourceAtChapter = (sourceId, chapter) => {
    const source = archive.getEntityById(sourceId);
    return source?.entityType === 'source' && (!source.chapter || source.chapter <= chapter) ? source : null;
  };

  const sourceChapterNumbers = (entity) => (entity?.sourceIds || [])
    .map((sourceId) => archive.getEntityById(sourceId))
    .filter((source) => source?.entityType === 'source' && source.chapter)
    .map((source) => source.chapter);

  const firstKnownChapter = (entity) => {
    const chapters = sourceChapterNumbers(entity);
    if (Number.isFinite(entity?.firstChapter)) chapters.push(entity.firstChapter);
    return chapters.length ? Math.min(...chapters) : null;
  };

  const entityFirstKnownChapter = (entity) => {
    if (!entity) return null;
    const chapters = sourceChapterNumbers(entity);
    if (entity.entityType === 'character') chapters.push(...archive.getAppearancesForCharacter(entity.id).map((record) => record.chapter));
    if (entity.entityType === 'organization') chapters.push(...archive.getEventsForOrganization(entity.id).map((event) => event.chapterRange.start));
    if (entity.entityType === 'location') chapters.push(...archive.getEventsAtLocation(entity.id).map((event) => event.chapterRange.start));
    return chapters.filter(Number.isFinite).length ? Math.min(...chapters.filter(Number.isFinite)) : null;
  };

  const entityAvailableAtChapter = (entity, chapter) => {
    const firstChapter = entityFirstKnownChapter(entity);
    return firstChapter === null || chapter >= firstChapter;
  };

  const systemAvailableAtChapter = (profile, chapter) => Boolean(profile && includesChapter(profile.chapterRange, chapter));

  const getAbilityKnowledgeAtChapter = (abilityId, chapter = null) => {
    const ability = archive.getEntityById(abilityId);
    if (!ability || ability.entityType !== 'ability') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const firstChapter = firstKnownChapter(ability);
    const known = firstChapter === null || parsedChapter >= firstChapter;
    return Object.freeze({
      ability,
      chapter: parsedChapter,
      known,
      firstKnownChapter: firstChapter,
      knowledgeState: known
        ? ability.status === 'unrevealed' || ability.researchStatus === 'unrevealed' || ability.researchStatus === 'major-mystery'
          ? 'existence known; mechanics unrevealed'
          : ability.researchStatus === 'partial' || ability.researchStatus === 'inferred-mechanics' || ability.classification?.certainty !== 'confirmed'
            ? 'partially documented'
            : 'documented'
        : 'not yet revealed',
      certainty: known ? ability.classification?.certainty || 'confirmed' : 'unknown',
      mechanics: known ? Object.freeze({
        activation: ability.activation || 'Unknown.',
        conditions: Object.freeze([...(ability.conditions || [])]),
        limitations: Object.freeze([...(ability.limitations || [])]),
        costs: Object.freeze([...(ability.costs || [])]),
        targets: Object.freeze([...(ability.targets || [])]),
        range: ability.range || 'unknown',
        duration: ability.duration || 'unknown',
        knownUses: Object.freeze([...(ability.knownUses || [])]),
      }) : null,
      sources: Object.freeze(known
        ? (ability.sourceIds || []).map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)
        : []),
    });
  };

  const getAbilitiesKnownAtChapter = (chapter = null, { ownerId = null, category = null, nenType = null, includeUnrevealed = true } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return Object.freeze([]);
    return Object.freeze(archive.getEntitiesByType('ability')
      .map((ability) => getAbilityKnowledgeAtChapter(ability.id, parsedChapter))
      .filter((record) => record?.known)
      .filter((record) => !ownerId || record.ability.ownerIds?.includes(ownerId))
      .filter((record) => !category || record.ability.category === category)
      .filter((record) => !nenType || record.ability.classification?.nenTypes?.includes(nenType))
      .filter((record) => includeUnrevealed || record.knowledgeState !== 'existence known; mechanics unrevealed')
      .sort((left, right) => (left.firstKnownChapter ?? 0) - (right.firstKnownChapter ?? 0) || left.ability.name.localeCompare(right.ability.name)));
  };

  const getNenSystemProfile = (systemId) => systemProfiles[systemId] || null;

  const getNenSystemsAtChapter = (chapter = null, { category = null } = {}) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return Object.freeze([]);
    return Object.freeze(Object.values(systemProfiles)
      .filter((profile) => systemAvailableAtChapter(profile, parsedChapter))
      .filter((profile) => !category || profile.category === category)
      .sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.name.localeCompare(right.name)));
  };

  const getNenSystemDossier = (systemId, chapter = null) => {
    const profile = getNenSystemProfile(systemId);
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!profile || !Number.isFinite(parsedChapter) || !systemAvailableAtChapter(profile, parsedChapter)) return null;
    const abilities = (profile.abilityIds || [])
      .map((abilityId) => getAbilityKnowledgeAtChapter(abilityId, parsedChapter))
      .filter((record) => record?.known);
    const beasts = (profile.guardianBeastIds || [])
      .map((beastId) => getGuardianBeastDossier(beastId, parsedChapter))
      .filter(Boolean);
    const resolveIds = (ids) => ids
      .map((id) => archive.getEntityById(id))
      .filter((entity) => entityAvailableAtChapter(entity, parsedChapter));
    return Object.freeze({
      profile,
      chapter: parsedChapter,
      abilities: Object.freeze(abilities),
      guardianBeasts: Object.freeze(beasts),
      characters: Object.freeze(resolveIds(profile.characterIds || [])),
      organizations: Object.freeze(resolveIds(profile.organizationIds || [])),
      locations: Object.freeze(resolveIds(profile.locationIds || [])),
      sources: Object.freeze((profile.sourceIds || []).map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
    });
  };

  const getGuardianBeastStateTimeline = (beastId) => Object.freeze([...(beastStateProfiles[beastId] || [])].sort(byRange));

  const getGuardianBeastStateAtChapter = (beastId, chapter = null) => {
    const beast = archive.getEntityById(beastId);
    if (!beast || beast.entityType !== 'guardian-beast') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const explicit = getGuardianBeastStateTimeline(beastId)
      .filter((record) => includesChapter(record.chapterRange, parsedChapter))
      .sort((left, right) => right.chapterRange.start - left.chapterRange.start)[0];
    if (explicit) return explicit;
    const firstChapter = firstKnownChapter(beast);
    if (firstChapter !== null && parsedChapter < firstChapter) return Object.freeze({
      id: `guardian-beast-state:hidden:${beastId.replace('guardian-beast:', '')}:${parsedChapter}`,
      beastId,
      chapterRange: Object.freeze({ start: parsedChapter, end: parsedChapter }),
      knowledge: 'not yet revealed',
      operationalState: 'No Guardian Spirit Beast record is available at the selected chapter.',
      hostState: 'not evaluated',
      visibility: 'not revealed',
      knownAbilityIds: Object.freeze([]),
      suspectedAbilityIds: Object.freeze([]),
      unresolved: Object.freeze([]),
      sourceIds: Object.freeze([]),
      certainty: 'unknown',
      derived: true,
    });
    return Object.freeze({
      id: `guardian-beast-state:derived:${beastId.replace('guardian-beast:', '')}:${parsedChapter}`,
      beastId,
      chapterRange: Object.freeze({ start: parsedChapter, end: parsedChapter }),
      knowledge: beast.knowledge || 'existence confirmed',
      operationalState: 'A ritual Guardian Spirit Beast is recorded, but no chapter-specific state override is maintained.',
      hostState: 'derived from host dossier',
      visibility: 'ritual visibility rules apply',
      knownAbilityIds: Object.freeze([]),
      suspectedAbilityIds: Object.freeze([]),
      unresolved: Object.freeze(['Complete mechanics remain unresolved at the selected chapter.']),
      sourceIds: Object.freeze([...(beast.sourceIds || [])]),
      certainty: beast.classification?.certainty || 'unknown',
      derived: true,
    });
  };

  const getGuardianBeastDossier = (beastId, chapter = null) => {
    const beast = archive.getEntityById(beastId);
    if (!beast || beast.entityType !== 'guardian-beast') return null;
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const firstChapter = firstKnownChapter(beast);
    if (firstChapter !== null && parsedChapter < firstChapter) return null;
    const state = getGuardianBeastStateAtChapter(beastId, parsedChapter);
    const abilityIds = [...new Set([
      ...(state?.knownAbilityIds || []),
      ...(state?.suspectedAbilityIds || []),
    ])];
    const abilities = abilityIds.map((id) => getAbilityKnowledgeAtChapter(id, parsedChapter)).filter((record) => record?.known);
    const host = archive.getEntityById(beast.hostCharacterId);
    const systemIds = new Set(['nen-system:seed-urn-succession-ritual', 'nen-system:guardian-spirit-beast-contract']);
    for (const abilityId of abilityIds) for (const systemId of abilitySystemLinks[abilityId] || []) systemIds.add(systemId);
    return Object.freeze({
      beast,
      host,
      chapter: parsedChapter,
      state,
      abilities: Object.freeze(abilities),
      systems: Object.freeze([...systemIds]
        .map(getNenSystemProfile)
        .filter((profile) => systemAvailableAtChapter(profile, parsedChapter))),
      sources: Object.freeze([...new Set([...(beast.sourceIds || []), ...(state?.sourceIds || [])])]
        .map((id) => sourceAtChapter(id, parsedChapter)).filter(Boolean)),
      timeline: Object.freeze(getGuardianBeastStateTimeline(beastId).filter((record) => record.chapterRange.start <= parsedChapter)),
    });
  };

  const getAbilityDossier = (abilityId, chapter = null) => {
    const knowledge = getAbilityKnowledgeAtChapter(abilityId, chapter);
    if (!knowledge?.known) return knowledge ? Object.freeze({ ...knowledge, owners: Object.freeze([]), events: Object.freeze([]), chapters: Object.freeze([]), locations: Object.freeze([]), systems: Object.freeze([]) }) : null;
    const ability = knowledge.ability;
    const owners = uniqueById((ability.ownerIds || []).map((id) => archive.getEntityById(id)));
    const parsedChapter = knowledge.chapter;
    const events = archive.getEventsForAbility(ability.id).filter((event) => event.chapterRange.start <= parsedChapter);
    const chapters = archive.getChaptersForAbility(ability.id).filter((record) => record.number <= parsedChapter);
    const locations = uniqueById(events.flatMap((event) => event.locationIds || []).map((id) => archive.getEntityById(id)));
    const systems = (abilitySystemLinks[ability.id] || [])
      .map(getNenSystemProfile)
      .filter((profile) => systemAvailableAtChapter(profile, parsedChapter));
    return Object.freeze({
      ...knowledge,
      owners: Object.freeze(owners),
      events: Object.freeze(events),
      chapters: Object.freeze(chapters),
      locations: Object.freeze(locations),
      systems: Object.freeze(systems),
    });
  };

  const searchNenSystems = (query, { limit = 20 } = {}) => {
    const normalized = String(query || '').trim().toLocaleLowerCase();
    if (!normalized) return [];
    return Object.values(systemProfiles)
      .map((profile) => ({
        profile,
        text: [profile.name, profile.summary, profile.category, ...profile.rules, ...profile.costs, ...profile.risks, ...profile.openQuestions].join(' ').toLocaleLowerCase(),
      }))
      .filter((record) => record.text.includes(normalized))
      .map((record) => Object.freeze({ profile: record.profile, score: record.profile.name.toLocaleLowerCase() === normalized ? 70 : 35 }))
      .sort((left, right) => right.score - left.score || left.profile.name.localeCompare(right.profile.name))
      .slice(0, limit);
  };

  const getNenSystemClosureReport = (chapter = null) => {
    const parsedChapter = chapter === null ? latestChapter : Number(chapter);
    if (!Number.isFinite(parsedChapter)) return null;
    const abilities = archive.getEntitiesByType('ability');
    const beasts = archive.getEntitiesByType('guardian-beast');
    const invalidAbilities = abilities.filter((ability) => {
      const dossier = getAbilityDossier(ability.id, parsedChapter);
      return !dossier || (dossier.known && (!dossier.sources.length || !dossier.mechanics));
    });
    const invalidBeasts = beasts.filter((beast) => {
      const dossier = getGuardianBeastDossier(beast.id, parsedChapter);
      return !dossier || !dossier.host || !dossier.state || !dossier.sources.length;
    });
    const stateIntegrityIssues = [];
    for (const [beastId, records] of Object.entries(beastStateProfiles)) {
      const sorted = [...records].sort(byRange);
      const ids = new Set();
      for (let index = 0; index < sorted.length; index += 1) {
        const record = sorted[index];
        if (ids.has(record.id)) stateIntegrityIssues.push({ beastId, recordId: record.id, issue: 'duplicate-state-id' });
        ids.add(record.id);
        const previous = sorted[index - 1];
        if (previous && rangeEnd(previous.chapterRange) >= record.chapterRange.start) stateIntegrityIssues.push({ beastId, recordId: record.id, previousRecordId: previous.id, issue: 'overlapping-state-range' });
      }
    }
    const missingSystemReferences = [];
    for (const profile of Object.values(systemProfiles)) {
      for (const id of [...profile.abilityIds, ...profile.guardianBeastIds, ...profile.characterIds, ...profile.organizationIds, ...profile.locationIds, ...profile.sourceIds]) {
        if (!archive.getEntityById(id)) missingSystemReferences.push({ systemId: profile.id, missingId: id });
      }
    }
    const missingBeastProfiles = beasts.filter((beast) => !(beastStateProfiles[beast.id] || []).length);
    const closureReady = invalidAbilities.length === 0
      && invalidBeasts.length === 0
      && stateIntegrityIssues.length === 0
      && missingSystemReferences.length === 0
      && missingBeastProfiles.length === 0;
    return Object.freeze({
      chapter: parsedChapter,
      status: closureReady ? 'closed' : 'open',
      closureReady,
      abilities: Object.freeze({ total: abilities.length, validDossiers: abilities.length - invalidAbilities.length }),
      guardianBeasts: Object.freeze({ total: beasts.length, validDossiers: beasts.length - invalidBeasts.length, explicitStateProfiles: beasts.length - missingBeastProfiles.length }),
      systems: Object.freeze({ total: Object.keys(systemProfiles).length }),
      invalidAbilities: Object.freeze(invalidAbilities),
      invalidBeasts: Object.freeze(invalidBeasts),
      missingBeastProfiles: Object.freeze(missingBeastProfiles),
      stateIntegrityIssues: Object.freeze(stateIntegrityIssues.map(Object.freeze)),
      missingSystemReferences: Object.freeze(missingSystemReferences.map(Object.freeze)),
    });
  };

  return Object.freeze({
    getAbilityKnowledgeAtChapter,
    getAbilitiesKnownAtChapter,
    getAbilityDossier,
    getNenSystemProfile,
    getNenSystemsAtChapter,
    getNenSystemDossier,
    getGuardianBeastStateTimeline,
    getGuardianBeastStateAtChapter,
    getGuardianBeastDossier,
    getNenSystemClosureReport,
    searchNenSystems,
  });
};
