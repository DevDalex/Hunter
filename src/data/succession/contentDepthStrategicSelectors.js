import { successionMysteryCases } from './successionMysteryCases.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const inRange = (range = {}, chapter) => Number(chapter) >= Number(range.start || 0) && Number(chapter) <= Number(range.end ?? Number.POSITIVE_INFINITY);
const words = (...values) => values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase();
const compact = (entity) => entity ? Object.freeze({ id: entity.id, entityType: entity.entityType, name: entity.name, slug: entity.slug }) : null;
const maxChapter = (values = []) => {
  const finite = values.map(Number).filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : null;
};

export const createContentDepthStrategicSelectors = ({ data, archive, informationConsistency, highValueIntelligence, nenSystems, storyIntelligence }) => {
  const latest = data.chapters.at(-1)?.number || 417;
  const earliest = data.chapters.at(0)?.number || 340;
  const clamp = (chapter) => Math.min(latest, Math.max(earliest, Number(chapter) || latest));
  const characters = archive.getEntitiesByType('character');
  const organizations = archive.getEntitiesByType('organization');
  const abilities = archive.getEntitiesByType('ability');
  const events = archive.getEntitiesByType('event');
  const assignments = archive.getEntitiesByType('assignment');
  const relationships = archive.getEntitiesByType('relationship');
  const beasts = archive.getEntitiesByType('guardian-beast');

  const activeAssignments = (chapter) => assignments.filter((record) => inRange(record.chapterRange, chapter));
  const activeRelationships = (chapter) => relationships.filter((record) => inRange(record.chapterRange, chapter));
  const stateAt = (id, chapter) => informationConsistency.getCanonicalCharacterState(id, chapter);
  const locationAt = (id, chapter) => archive.getCurrentLocationRecordForCharacter(id, chapter)?.locationId || stateAt(id, chapter)?.locationId || null;
  const abilitiesFor = (id, chapter) => abilities.filter((record) => (record.ownerIds || []).includes(id) && nenSystems.getAbilityKnowledgeAtChapter(record.id, chapter)?.known);
  const assignmentsFor = (id, chapter) => activeAssignments(chapter).filter((record) => [record.personId, record.subjectEntityId, record.principalEntityId, record.allegianceEntityId, record.reportingEntityId].includes(id));
  const relationshipsFor = (id, chapter) => activeRelationships(chapter).filter((record) => [record.sourceEntityId, record.targetEntityId].includes(id));
  const threadsFor = (id, chapter) => (storyIntelligence.getStoryThreadsAtChapter(chapter) || []).filter((record) => (record.entityIds || []).includes(id));
  const lastAppearance = (id, chapter) => maxChapter(archive.getAppearancesForCharacter(id).filter((record) => Number(record.chapter) <= chapter).map((record) => record.chapter));

  const campaignRow = (character, chapter) => {
    const state = stateAt(character.id, chapter);
    const rels = relationshipsFor(character.id, chapter);
    const threats = rels.filter((record) => record.sentiment === 'hostile' || /assassin|kill|curse|poison|infect|attack|target|coerc|surveillance/i.test(words(record.relationshipType, record.subtype, record.basis, record.operationalState)));
    return Object.freeze({
      character: compact(character),
      life: state?.life || character.status?.life || 'unknown',
      body: state?.bodyStateCode || 'unknown',
      identity: state?.identityStateCode || 'unresolved',
      consciousness: state?.consciousnessStateCode || 'unknown',
      locationId: locationAt(character.id, chapter),
      abilityIds: freeze(abilitiesFor(character.id, chapter).map((record) => record.id)),
      assignmentIds: freeze(assignmentsFor(character.id, chapter).map((record) => record.id)),
      relationshipIds: freeze(rels.map((record) => record.id)),
      threatIds: freeze(threats.map((record) => record.id)),
      knowledgeIds: freeze(highValueIntelligence.getKnowledgeForEntity(character.id, chapter).map((record) => record.id)),
      storyThreadIds: freeze(threadsFor(character.id, chapter).map((record) => record.id)),
      latestAppearance: lastAppearance(character.id, chapter),
    });
  };

  const getPrinceCampaignBoard = (chapter = latest) => {
    const boundary = clamp(chapter);
    return freeze(characters.filter((record) => (record.roles || []).includes('prince')).sort((a, b) => (a.princeOrder || 99) - (b.princeOrder || 99)).map((prince) => {
      const base = campaignRow(prince, boundary);
      const beast = beasts.find((record) => record.hostCharacterId === prince.id) || null;
      return Object.freeze({ ...base, order: prince.princeOrder || null, queenRank: prince.queenRank || null, biologicalMotherId: prince.biologicalMotherId || prince.motherId || null, guardianBeastId: beast?.id || null });
    }));
  };

  const getQueenIntelligenceBoard = (chapter = latest) => {
    const boundary = clamp(chapter);
    return freeze(characters.filter((record) => (record.roles || []).includes('queen')).sort((a, b) => Number.parseInt(a.queenRank, 10) - Number.parseInt(b.queenRank, 10)).map((queen) => {
      const base = campaignRow(queen, boundary);
      const childIds = characters.filter((record) => [record.biologicalMotherId, record.motherId, ...(record.parentIds || [])].includes(queen.id)).map((record) => record.id);
      return Object.freeze({ ...base, rank: queen.queenRank || null, childIds: freeze(childIds) });
    }));
  };

  const getKnowledgeWarfareMatrix = (chapter = latest) => freeze(highValueIntelligence.getKnowledgeRecordsAtChapter(clamp(chapter)).map((record) => Object.freeze({
    id: record.id,
    name: record.name,
    state: record.currentKnowledgeState,
    secrecy: record.secrecy,
    subjectLabels: freeze(record.subjectLabels || []),
    knowerLabels: freeze(record.knowerLabels || []),
    misinformedLabels: freeze(record.misinformedLabels || []),
    subjectEntityIds: freeze(record.subjectEntityIds || []),
    knowerEntityIds: freeze(record.knowerEntityIds || []),
    misinformedEntityIds: freeze(record.misinformedEntityIds || []),
    acquisition: record.acquisition || null,
    publicAtChapter: record.publicAtChapter || null,
  })));

  const getCurseRegistry = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /curse|post.mortem|death|sacrifice|exorcis|disease|infection/i;
    return Object.freeze({
      abilities: freeze(abilities.filter((record) => nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known && pattern.test(words(record.name, record.summary, record.activation, record.conditions, record.limitations, record.researchStatus))).map((record) => Object.freeze({ ability: compact(record), ownerIds: freeze(record.ownerIds || []), activation: record.activation || null, conditions: freeze(record.conditions || []), limitations: freeze(record.limitations || []), researchStatus: record.researchStatus || null }))),
      protocols: freeze(highValueIntelligence.getProtocolRecordsAtChapter(boundary).filter((record) => pattern.test(words(record.name, record.summary, record.ruleStatement, record.openQuestions))).map(compact)),
    });
  };

  const getBodyIdentityConsciousnessExplorer = (chapter = latest, { exceptionalOnly = true } = {}) => {
    const boundary = clamp(chapter);
    const rows = characters.map((character) => {
      const state = stateAt(character.id, boundary);
      if (!state) return null;
      const row = Object.freeze({ character: compact(character), life: state.life || character.status?.life || 'unknown', body: state.bodyStateCode || 'unknown', identity: state.identityStateCode || 'unresolved', consciousness: state.consciousnessStateCode || 'unknown', locationId: locationAt(character.id, boundary) });
      const exceptional = /possess|transfer|copy|deceas|post.mortem|apparent|displac|unknown|unresolved/i.test(words(row.life, row.body, row.identity, row.consciousness, character.summary));
      return Object.freeze({ ...row, exceptional });
    }).filter(Boolean);
    return freeze(exceptionalOnly ? rows.filter((row) => row.exceptional) : rows);
  };

  const getThreatAssassinationMatrix = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /assassin|kill|curse|poison|infect|hostile|target|attack|shoot|surveillance|coerc|kidnap|infiltrat|eliminat/i;
    const fromRelationships = activeRelationships(boundary).filter((record) => record.sentiment === 'hostile' || pattern.test(words(record.relationshipType, record.subtype, record.basis, record.operationalState))).map((record) => Object.freeze({ id: `threat:${record.id}`, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), method: record.subtype || record.relationshipType, status: record.status || 'active', sourceRecordId: record.id, sourceType: 'relationship' }));
    const fromAssignments = activeAssignments(boundary).filter((record) => pattern.test(words(record.assignmentType, record.summary, record.note, record.status))).map((record) => Object.freeze({ id: `threat:${record.id}`, source: compact(archive.getEntityById(record.personId)), target: compact(archive.getEntityById(record.subjectEntityId || record.principalEntityId)), method: record.assignmentType || 'operation', status: record.status || 'active', sourceRecordId: record.id, sourceType: 'assignment' }));
    return freeze([...fromRelationships, ...fromAssignments]);
  };

  const getMartialLawCommandBoard = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /martial|military|justice|custody|detention|command|relocat|surveillance|first unit/i;
    const institutionIds = ['organization:kakin-military', 'organization:kakin-justice-bureau', 'organization:benjamin-private-army'];
    return Object.freeze({
      chapter: boundary,
      institutions: freeze(institutionIds.map((id) => compact(archive.getEntityById(id))).filter(Boolean)),
      protocolIds: freeze(highValueIntelligence.getProtocolRecordsAtChapter(boundary).filter((record) => pattern.test(words(record.name, record.domain, record.summary, record.authority))).map((record) => record.id)),
      assignmentIds: freeze(activeAssignments(boundary).filter((record) => pattern.test(words(record.assignmentType, record.summary, record.status))).map((record) => record.id)),
      relationshipIds: freeze(activeRelationships(boundary).filter((record) => pattern.test(words(record.relationshipType, record.subtype, record.basis, record.operationalState))).map((record) => record.id)),
    });
  };

  const getHeilLyContagionDashboard = (chapter = latest) => {
    const boundary = clamp(chapter);
    const orgId = 'organization:heil-ly';
    const memberRows = archive.getOrganizationMembers(orgId).filter(Boolean);
    const memberIds = new Set(memberRows.map((record) => record.characterId || record.id));
    const members = characters.filter((record) => memberIds.has(record.id) || (record.affiliations || []).some((affiliation) => affiliation.organizationId === orgId && affiliation.status !== 'former'));
    return Object.freeze({
      organization: compact(archive.getEntityById(orgId)),
      members: freeze(members.map((member) => campaignRow(member, boundary))),
      abilityIds: freeze(abilities.filter((record) => (record.ownerIds || []).some((id) => memberIds.has(id)) && nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known).map((record) => record.id)),
      eventIds: freeze(events.filter((record) => inRange(record.chapterRange, boundary) && (record.organizationIds || []).includes(orgId)).map((record) => record.id)),
      assignmentIds: freeze(activeAssignments(boundary).filter((record) => record.allegianceEntityId === orgId || memberIds.has(record.personId)).map((record) => record.id)),
    });
  };

  const getRoyalHouseholdMatrix = (chapter = latest) => {
    const boundary = clamp(chapter);
    return freeze(getPrinceCampaignBoard(boundary).map((prince) => {
      const household = activeAssignments(boundary).filter((record) => [record.subjectEntityId, record.principalEntityId].includes(prince.character.id));
      return Object.freeze({ ...prince, personnelIds: freeze(unique(household.map((record) => record.personId))), householdAssignmentIds: freeze(household.map((record) => record.id)) });
    }));
  };

  const getCharacterCampaignDossier = (characterId, chapter = latest) => {
    const boundary = clamp(chapter);
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const base = campaignRow(character, boundary);
    const rels = relationshipsFor(character.id, boundary);
    return Object.freeze({
      ...base,
      alliedRelationshipIds: freeze(rels.filter((record) => record.sentiment === 'allied').map((record) => record.id)),
      hostileRelationshipIds: freeze(rels.filter((record) => record.sentiment === 'hostile').map((record) => record.id)),
      currentObjectives: freeze(unique([...assignmentsFor(character.id, boundary).map((record) => record.summary || record.assignmentType), ...threadsFor(character.id, boundary).map((record) => record.question)]).slice(0, 12)),
    });
  };

  const getChapterWhatChanged = (chapter = latest) => {
    const boundary = clamp(chapter);
    const previous = Math.max(earliest, boundary - 1);
    const record = data.chapters.find((item) => item.number === boundary) || null;
    const diff = highValueIntelligence.getChapterStateDiff(previous, boundary);
    return Object.freeze({ chapter: boundary, previousChapter: previous, chapterRecord: compact(record), summary: diff.summary, records: diff.records, openedMysteryCaseIds: freeze(successionMysteryCases.filter((item) => item.firstChapter === boundary).map((item) => item.id)), eventIds: freeze(record?.eventIds || []), locationIds: freeze(record?.locationIds || []), abilityIds: freeze(record?.abilityIds || []), organizationIds: freeze(record?.organizationIds || []), storyThreadIds: freeze(record?.storyThreadIds || []) });
  };

  const getSuccessionRulesEngine = (chapter = latest) => {
    const boundary = clamp(chapter);
    const records = highValueIntelligence.getProtocolRecordsAtChapter(boundary);
    return Object.freeze({ chapter: boundary, domains: freeze(unique(records.map((record) => record.domain)).sort()), records: freeze(records), disputedIds: freeze(records.filter((record) => ['disputed', 'unknown', 'partially-confirmed'].includes(record.protocolStatus)).map((record) => record.id)) });
  };

  const getNenTrainingTracker = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /nen class|training|instruction|teach|student|zetsu|aura node|learn|lesson/i;
    const trainingEvents = events.filter((record) => inRange(record.chapterRange, boundary) && pattern.test(words(record.name, record.summary, record.category, record.stateChanges, record.openQuestions)));
    const participantIds = unique(trainingEvents.flatMap((record) => record.participantIds || []));
    return Object.freeze({ eventIds: freeze(trainingEvents.map((record) => record.id)), participants: freeze(participantIds.map((id) => compact(archive.getEntityById(id))).filter(Boolean)) });
  };

  const getAbilityTransferInheritanceLedger = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /transfer|inherit|borrow|steal|possession|host|post.mortem|copy|fusion|baton|dolphin/i;
    return freeze(abilities.filter((record) => nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known && pattern.test(words(record.name, record.summary, record.activation, record.conditions, record.limitations, record.researchStatus))).map((record) => Object.freeze({ ability: compact(record), ownerIds: freeze(record.ownerIds || []), activation: record.activation || null, conditions: freeze(record.conditions || []), limitations: freeze(record.limitations || []), researchStatus: record.researchStatus || null })));
  };

  const factionSnapshot = (orgId, chapter) => {
    const org = archive.getEntityById(orgId);
    if (!org) return null;
    const memberRows = archive.getOrganizationMembers(orgId).filter(Boolean);
    const memberIds = new Set(memberRows.map((record) => record.characterId || record.id));
    return Object.freeze({ organization: compact(org), leaderIds: freeze(org.leaderIds || []), memberIds: freeze([...memberIds]), abilityIds: freeze(abilities.filter((record) => (record.ownerIds || []).some((id) => memberIds.has(id)) && nenSystems.getAbilityKnowledgeAtChapter(record.id, chapter)?.known).map((record) => record.id)), eventIds: freeze(events.filter((record) => inRange(record.chapterRange, chapter) && (record.organizationIds || []).includes(orgId)).map((record) => record.id) });
  };

  const getMafiaWarCommandCenter = (chapter = latest) => freeze(['organization:xi-yu', 'organization:cha-r', 'organization:heil-ly'].map((id) => factionSnapshot(id, clamp(chapter))).filter(Boolean));

  const getTroupeHisokaTracker = (chapter = latest) => {
    const boundary = clamp(chapter);
    const troupe = factionSnapshot('organization:phantom-troupe', boundary);
    const hisoka = archive.getEntityById('character:hisoka-morow');
    return Object.freeze({ chapter: boundary, troupe, hisoka: compact(hisoka), hisokaLocationId: hisoka ? locationAt(hisoka.id, boundary) : null, threadIds: freeze((storyIntelligence.getStoryThreadsAtChapter(boundary) || []).filter((record) => /hisoka|troupe|chrollo|treasure/i.test(words(record.name, record.question))).map((record) => record.id)) });
  };

  const getKurapikaMissionLedger = (chapter = latest) => {
    const boundary = clamp(chapter);
    const dossier = getCharacterCampaignDossier('character:kurapika', boundary);
    const source = words(dossier?.currentObjectives, dossier?.storyThreadIds, dossier?.knowledgeIds);
    const missionPatterns = Object.freeze({ 'woble-defense': /woble|oito|room 1014|protect/, 'scarlet-eyes': /scarlet|tserriednich|collection/, 'nen-instruction': /nen|class|instruction|teach/, 'royal-diplomacy': /alliance|treaty|prince|queen/, 'beyond-curse': /beyond|longhi|curse|moonlight/, 'emperor-time': /emperor|steal|dolphin/ });
    return Object.freeze({ chapter: boundary, dossier, missions: freeze(Object.entries(missionPatterns).map(([id, pattern]) => Object.freeze({ id: `kurapika-mission:${id}`, active: pattern.test(source) }))) });
  };

  const getLifeStatusLedger = (chapter = latest) => freeze(characters.map((record) => campaignRow(record, clamp(chapter))).map((row) => Object.freeze({ character: row.character, life: row.life, body: row.body, identity: row.identity, consciousness: row.consciousness, latestAppearance: row.latestAppearance })));

  const getDeceptionLedger = (chapter = latest) => {
    const pattern = /deceiv|lie|cover|frame|staged|secret|misinform|disguise|fake|conceal/i;
    return freeze(activeRelationships(clamp(chapter)).filter((record) => pattern.test(words(record.relationshipType, record.subtype, record.basis, record.operationalState))).map((record) => Object.freeze({ id: record.id, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), subtype: record.subtype || record.relationshipType, basis: record.basis || record.operationalState })));
  };

  const getOrdersSurveillanceCustodyLedger = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /order|command|surveillance|custody|detention|escort|confin|relocat|report|inspect|guard/i;
    return Object.freeze({ assignmentIds: freeze(activeAssignments(boundary).filter((record) => pattern.test(words(record.assignmentType, record.summary, record.note, record.status))).map((record) => record.id)), relationshipIds: freeze(activeRelationships(boundary).filter((record) => pattern.test(words(record.relationshipType, record.subtype, record.basis, record.operationalState))).map((record) => record.id)) });
  };

  const getAllianceBetrayalLedger = (chapter = latest) => freeze(activeRelationships(clamp(chapter)).filter((record) => ['allied', 'hostile'].includes(record.sentiment) || /alliance|betray|cooperat|treaty|truce|defect/i.test(words(record.relationshipType, record.subtype, record.basis))).map((record) => Object.freeze({ id: record.id, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), sentiment: record.sentiment, subtype: record.subtype || record.relationshipType, status: record.status || 'active' })));

  const getActiveCountdowns = (chapter = latest) => {
    const boundary = clamp(chapter);
    const pattern = /countdown|deadline|half a day|hour|days?|window|expires?|timing|before/i;
    const threadIds = (storyIntelligence.getStoryThreadsAtChapter(boundary) || []).filter((record) => pattern.test(words(record.name, record.question, record.evidenceState))).map((record) => record.id);
    const mysteryCaseIds = successionMysteryCases.filter((record) => record.firstChapter <= boundary && pattern.test(words(record.title, record.question, record.summary, record.knownFacts, record.unknowns))).map((record) => record.id);
    return Object.freeze({ threadIds: freeze(threadIds), mysteryCaseIds: freeze(mysteryCaseIds) });
  };

  const getUnresolvedLedgers = (chapter = latest) => {
    const cases = successionMysteryCases.filter((record) => record.firstChapter <= clamp(chapter) && record.status !== 'resolved');
    return Object.freeze({ identities: freeze(cases.filter((record) => /identity|consciousness|who |real|copy|body/i.test(words(record.category, record.question))).map((record) => record.id)), abilities: freeze(cases.filter((record) => /ability|nen|guardian|curse|mechanic|transfer|future/i.test(words(record.category, record.question))).map((record) => record.id)), locations: freeze(cases.filter((record) => /where|location|route|space|ship/i.test(words(record.category, record.question))).map((record) => record.id)) });
  };

  const getLeverageBoard = (chapter = latest) => {
    const boundary = clamp(chapter);
    const key = characters.filter((record) => (record.roles || []).some((role) => ['prince', 'queen', 'king', 'hunter', 'mafia-boss', 'zodiac'].includes(role)) || ['character:kurapika', 'character:morena-prudo', 'character:chrollo-lucilfer', 'character:hisoka-morow'].includes(record.id));
    return freeze(key.map((record) => Object.freeze({ character: compact(record), nen: abilitiesFor(record.id, boundary).length, operational: assignmentsFor(record.id, boundary).length, relational: relationshipsFor(record.id, boundary).length, information: highValueIntelligence.getKnowledgeForEntity(record.id, boundary).length, authority: informationConsistency.getCharacterAuthorityProfile(record.id, boundary)?.officialRoleKind || 'unclassified' })));
  };

  const getFactionResourceBoard = (chapter = latest) => freeze(organizations.map((record) => factionSnapshot(record.id, clamp(chapter))).filter(Boolean));

  const getReaderVsInUniverseKnowledge = (chapter = latest) => freeze(getKnowledgeWarfareMatrix(clamp(chapter)).map((record) => Object.freeze({ id: record.id, name: record.name, readerState: 'available-through-selected-boundary', inUniverseState: record.state, knownBy: record.knowerLabels, hiddenFromOrMisinformed: record.misinformedLabels, secrecy: record.secrecy })));

  const getConsequenceChains = (chapter = latest) => {
    const boundary = clamp(chapter);
    const graph = storyIntelligence.getStoryCausalGraphAtChapter(boundary) || {};
    return Object.freeze({ chapter: boundary, nodes: freeze(graph.nodes || []), links: freeze(graph.links || graph.edges || []), roots: freeze(graph.roots || []) });
  };

  const getContentDepthSummary = (chapter = latest) => {
    const boundary = clamp(chapter);
    const countdowns = getActiveCountdowns(boundary);
    return Object.freeze({ chapter: boundary, princes: getPrinceCampaignBoard(boundary).length, queens: getQueenIntelligenceBoard(boundary).length, knowledgeClaims: getKnowledgeWarfareMatrix(boundary).length, threats: getThreatAssassinationMatrix(boundary).length, curseAbilities: getCurseRegistry(boundary).abilities.length, exceptionalBodyStates: getBodyIdentityConsciousnessExplorer(boundary).length, mysteries: successionMysteryCases.filter((record) => record.firstChapter <= boundary).length, countdownSignals: countdowns.threadIds.length + countdowns.mysteryCaseIds.length });
  };

  return Object.freeze({
    getPrinceCampaignBoard, getQueenIntelligenceBoard, getKnowledgeWarfareMatrix, getCurseRegistry,
    getBodyIdentityConsciousnessExplorer, getThreatAssassinationMatrix, getMartialLawCommandBoard,
    getHeilLyContagionDashboard, getRoyalHouseholdMatrix, getCharacterCampaignDossier, getChapterWhatChanged,
    getSuccessionRulesEngine, getNenTrainingTracker, getAbilityTransferInheritanceLedger, getMafiaWarCommandCenter,
    getTroupeHisokaTracker, getKurapikaMissionLedger, getLifeStatusLedger, getDeceptionLedger,
    getOrdersSurveillanceCustodyLedger, getAllianceBetrayalLedger, getActiveCountdowns, getUnresolvedLedgers,
    getLeverageBoard, getFactionResourceBoard, getReaderVsInUniverseKnowledge, getConsequenceChains, getContentDepthSummary,
  });
};
