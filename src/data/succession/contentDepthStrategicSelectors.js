import { successionMysteryCases } from './successionMysteryCases.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const includesChapter = (range = {}, chapter) => Number(chapter) >= Number(range.start || 0) && Number(chapter) <= Number(range.end ?? Number.POSITIVE_INFINITY);
const text = (...values) => values.flat().filter(Boolean).join(' ').toLocaleLowerCase();
const compact = (entity) => entity ? Object.freeze({ id: entity.id, entityType: entity.entityType, name: entity.name, slug: entity.slug }) : null;
const latestNumber = (values = [], fallback = null) => {
  const finite = values.map(Number).filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : fallback;
};

export const createContentDepthStrategicSelectors = ({
  data,
  archive,
  informationConsistency,
  highValueIntelligence,
  nenSystems,
  storyIntelligence,
}) => {
  const latestChapter = data.chapters.at(-1)?.number || 417;
  const earliestChapter = data.chapters.at(0)?.number || 340;
  const clamp = (chapter) => Math.min(latestChapter, Math.max(earliestChapter, Number(chapter) || latestChapter));
  const characters = archive.getEntitiesByType('character');
  const organizations = archive.getEntitiesByType('organization');
  const abilities = archive.getEntitiesByType('ability');
  const relationships = archive.getEntitiesByType('relationship');
  const assignments = archive.getEntitiesByType('assignment');
  const events = archive.getEntitiesByType('event');
  const locations = archive.getEntitiesByType('location');
  const guardianBeasts = archive.getEntitiesByType('guardian-beast');

  const activeRelationships = (chapter) => relationships.filter((record) => includesChapter(record.chapterRange, chapter));
  const activeAssignments = (chapter) => assignments.filter((record) => includesChapter(record.chapterRange, chapter));
  const knownAbilitiesForOwner = (id, chapter) => abilities.filter((ability) => (ability.ownerIds || []).includes(id) && Boolean(nenSystems.getAbilityKnowledgeAtChapter(ability.id, chapter)?.known));
  const appearances = (id, chapter) => archive.getAppearancesForCharacter(id).filter((record) => Number(record.chapter) <= chapter);
  const threadRecords = (chapter) => storyIntelligence.getStoryThreadsAtChapter(chapter) || [];
  const stateFor = (id, chapter) => informationConsistency.getCanonicalCharacterState(id, chapter);
  const locationFor = (id, chapter) => archive.getCurrentLocationRecordForCharacter(id, chapter);
  const relatedAssignments = (id, chapter) => activeAssignments(chapter).filter((record) => [record.personId, record.subjectEntityId, record.principalEntityId, record.allegianceEntityId, record.reportingEntityId].includes(id));
  const relatedRelationships = (id, chapter) => activeRelationships(chapter).filter((record) => [record.sourceEntityId, record.targetEntityId].includes(id));
  const relatedThreads = (id, chapter) => threadRecords(chapter).filter((record) => (record.entityIds || []).includes(id));

  const getPrinceCampaignBoard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const princes = characters.filter((character) => (character.roles || []).includes('prince')).sort((a, b) => (a.princeOrder || 99) - (b.princeOrder || 99));
    return freeze(princes.map((prince) => {
      const state = stateFor(prince.id, boundary);
      const location = locationFor(prince.id, boundary);
      const princeAssignments = relatedAssignments(prince.id, boundary);
      const princeRelationships = relatedRelationships(prince.id, boundary);
      const princeThreads = relatedThreads(prince.id, boundary);
      const beast = guardianBeasts.find((record) => record.hostCharacterId === prince.id) || null;
      const hostile = princeRelationships.filter((record) => record.sentiment === 'hostile' || /hostile|assassin|target|coerc|curse|kill|surveillance/i.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState)));
      const latestAppearance = latestNumber(appearances(prince.id, boundary).map((record) => record.chapter), prince.firstChapter || null);
      return Object.freeze({
        prince: compact(prince),
        order: prince.princeOrder || null,
        queenRank: prince.queenRank || null,
        motherId: prince.biologicalMotherId || prince.motherId || prince.parentIds?.[0] || null,
        life: state?.life || prince.status?.life || 'unknown',
        body: state?.bodyStateCode || 'unknown',
        identity: state?.identityStateCode || 'unresolved',
        consciousness: state?.consciousnessStateCode || 'unknown',
        locationId: location?.locationId || state?.locationId || null,
        guardianBeastId: beast?.id || null,
        abilityIds: freeze(knownAbilitiesForOwner(prince.id, boundary).map((record) => record.id)),
        assignmentIds: freeze(princeAssignments.map((record) => record.id)),
        relationshipIds: freeze(princeRelationships.map((record) => record.id)),
        threatRelationshipIds: freeze(hostile.map((record) => record.id)),
        storyThreadIds: freeze(princeThreads.map((record) => record.id)),
        knowledgeRecordIds: freeze(highValueIntelligence.getKnowledgeForEntity(prince.id, boundary).map((record) => record.id)),
        latestAppearance,
        currentPressure: freeze(unique([
          ...hostile.slice(0, 4).map((record) => record.subtype || record.relationshipType),
          ...princeThreads.slice(0, 4).map((record) => record.name),
        ])),
      });
    }));
  };

  const getQueenIntelligenceBoard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(characters.filter((character) => (character.roles || []).includes('queen')).sort((a, b) => Number.parseInt(a.queenRank, 10) - Number.parseInt(b.queenRank, 10)).map((queen) => {
      const state = stateFor(queen.id, boundary);
      const queenRelationships = relatedRelationships(queen.id, boundary);
      const children = characters.filter((character) => [character.biologicalMotherId, character.motherId, ...(character.parentIds || [])].includes(queen.id));
      return Object.freeze({
        queen: compact(queen),
        rank: queen.queenRank || null,
        life: state?.life || queen.status?.life || 'unknown',
        locationId: locationFor(queen.id, boundary)?.locationId || state?.locationId || null,
        childIds: freeze(children.map((record) => record.id)),
        assignmentIds: freeze(relatedAssignments(queen.id, boundary).map((record) => record.id)),
        relationshipIds: freeze(queenRelationships.map((record) => record.id)),
        hostileRelationshipIds: freeze(queenRelationships.filter((record) => record.sentiment === 'hostile').map((record) => record.id)),
        storyThreadIds: freeze(relatedThreads(queen.id, boundary).map((record) => record.id)),
        latestAppearance: latestNumber(appearances(queen.id, boundary).map((record) => record.chapter), queen.firstChapter || null),
      });
    }));
  };

  const getKnowledgeWarfareMatrix = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const records = highValueIntelligence.getKnowledgeRecordsAtChapter(boundary);
    return freeze(records.map((record) => Object.freeze({
      id: record.id,
      name: record.name,
      summary: record.summary,
      knowledgeState: record.currentKnowledgeState,
      secrecy: record.secrecy,
      subjectLabels: freeze(record.subjectLabels || []),
      knowerLabels: freeze(record.knowerLabels || []),
      misinformedLabels: freeze(record.misinformedLabels || []),
      subjectEntityIds: freeze(record.subjectEntityIds || []),
      knowerEntityIds: freeze(record.knowerEntityIds || []),
      misinformedEntityIds: freeze(record.misinformedEntityIds || []),
      publicAtChapter: record.publicAtChapter || null,
      acquisition: record.acquisition,
    })));
  };

  const getCurseRegistry = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const abilityRecords = abilities.filter((ability) => {
      if (!nenSystems.getAbilityKnowledgeAtChapter(ability.id, boundary)?.known) return false;
      return /curse|post.mortem|death|sacrifice|exorcis|disease|infection/i.test(text(ability.name, ability.summary, ability.activation, ability.researchStatus, ability.conditions, ability.limitations, ability.tags));
    });
    const protocolRecords = highValueIntelligence.getProtocolRecordsAtChapter(boundary).filter((record) => /curse|post.mortem|death|exorcis|infection/i.test(text(record.name, record.summary, record.ruleStatement, record.openQuestions)));
    return Object.freeze({
      chapter: boundary,
      abilities: freeze(abilityRecords.map((record) => Object.freeze({
        ability: compact(record),
        ownerIds: freeze(record.ownerIds || []),
        activation: record.activation || 'unknown',
        conditions: freeze(record.conditions || []),
        limitations: freeze(record.limitations || []),
        costs: freeze(record.costs || []),
        researchStatus: record.researchStatus || null,
      }))),
      protocols: freeze(protocolRecords.map(compact)),
    });
  };

  const getBodyIdentityConsciousnessExplorer = (chapter = latestChapter, { exceptionalOnly = true } = {}) => {
    const boundary = clamp(chapter);
    const rows = characters.map((character) => {
      const state = stateFor(character.id, boundary);
      if (!state) return null;
      const body = state.bodyStateCode || 'unknown';
      const identity = state.identityStateCode || 'unresolved';
      const consciousness = state.consciousnessStateCode || 'unknown';
      const exceptional = body !== 'normal' || !['self', 'original', 'stable', 'unresolved'].includes(identity) || !['conscious', 'active', 'normal', 'unknown'].includes(consciousness)
        || /possess|transfer|copy|deceas|post.mortem|apparent/i.test(text(body, identity, consciousness, state.notes, character.summary));
      return Object.freeze({ character: compact(character), life: state.life || character.status?.life || 'unknown', body, identity, consciousness, locationId: state.locationId || locationFor(character.id, boundary)?.locationId || null, exceptional });
    }).filter(Boolean);
    return freeze(exceptionalOnly ? rows.filter((row) => row.exceptional) : rows);
  };

  const getMartialLawCommandBoard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const institutionIds = ['organization:kakin-military', 'organization:kakin-justice-bureau', 'organization:benjamin-private-army'];
    const institutionSet = new Set(institutionIds);
    const martialProtocols = highValueIntelligence.getProtocolRecordsAtChapter(boundary).filter((record) => /martial|military|justice|custody|detention|court|funeral/i.test(text(record.name, record.domain, record.summary, record.authority)));
    const commandAssignments = activeAssignments(boundary).filter((record) => institutionSet.has(record.allegianceEntityId) || institutionSet.has(record.principalEntityId) || /military|justice|custody|detention|command|relocat|surveillance/i.test(text(record.assignmentType, record.status, record.note, record.summary)));
    const commandRelationships = activeRelationships(boundary).filter((record) => /command|custody|detention|military|justice|surveillance|relocation|martial/i.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState)));
    return Object.freeze({
      chapter: boundary,
      institutions: freeze(institutionIds.map((id) => compact(archive.getEntityById(id))).filter(Boolean)),
      protocolIds: freeze(martialProtocols.map((record) => record.id)),
      assignmentIds: freeze(commandAssignments.map((record) => record.id)),
      relationshipIds: freeze(commandRelationships.map((record) => record.id)),
      currentReleaseThreadIds: freeze(threadRecords(boundary).filter((record) => /martial|justice|first unit|detention|military|consolidation/i.test(text(record.name, record.question, record.category))).map((record) => record.id)),
    });
  };

  const getThreatAssassinationMatrix = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const threatWords = /assassin|kill|curse|poison|infect|hostile|target|attack|shoot|surveillance|coerc|kidnap|infiltrat|eliminat/i;
    const rows = [];
    for (const record of activeRelationships(boundary)) {
      if (record.sentiment !== 'hostile' && !threatWords.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState))) continue;
      rows.push(Object.freeze({ id: `threat:relationship:${record.id}`, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), method: record.subtype || record.relationshipType, status: record.status || 'active', certainty: record.certainty || 'confirmed', sourceRecordId: record.id, sourceType: 'relationship' }));
    }
    for (const record of activeAssignments(boundary)) {
      if (!threatWords.test(text(record.assignmentType, record.status, record.note, record.summary))) continue;
      rows.push(Object.freeze({ id: `threat:assignment:${record.id}`, source: compact(archive.getEntityById(record.personId)), target: compact(archive.getEntityById(record.subjectEntityId || record.principalEntityId)), method: record.assignmentType || 'operation', status: record.status || 'active', certainty: record.certainty || 'confirmed', sourceRecordId: record.id, sourceType: 'assignment' }));
    }
    return freeze(rows);
  };

  const getHeilLyContagionDashboard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const orgId = 'organization:heil-ly';
    const members = archive.getOrganizationMembers(orgId).filter(Boolean);
    const memberIds = new Set(members.map((record) => record.id || record.characterId));
    const memberCharacters = characters.filter((record) => memberIds.has(record.id) || (record.affiliations || []).some((affiliation) => affiliation.organizationId === orgId && affiliation.status !== 'former'));
    const heilAbilities = abilities.filter((record) => (record.ownerIds || []).some((id) => memberIds.has(id)) && nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known);
    const heilEvents = events.filter((record) => includesChapter(record.chapterRange, boundary) && (record.organizationIds || []).includes(orgId));
    const heilAssignments = activeAssignments(boundary).filter((record) => record.allegianceEntityId === orgId || memberIds.has(record.personId));
    return Object.freeze({
      chapter: boundary,
      organization: compact(archive.getEntityById(orgId)),
      members: freeze(memberCharacters.map((member) => Object.freeze({
        character: compact(member),
        life: stateFor(member.id, boundary)?.life || member.status?.life || 'unknown',
        locationId: locationFor(member.id, boundary)?.locationId || null,
        abilityIds: freeze(knownAbilitiesForOwner(member.id, boundary).map((record) => record.id)),
        latestAppearance: latestNumber(appearances(member.id, boundary).map((record) => record.chapter), null),
      }))),
      abilityIds: freeze(heilAbilities.map((record) => record.id)),
      eventIds: freeze(heilEvents.map((record) => record.id)),
      assignmentIds: freeze(heilAssignments.map((record) => record.id)),
      activeThreadIds: freeze(threadRecords(boundary).filter((record) => /heil-ly|morena|borksen|contagion|community/i.test(text(record.name, record.question, record.category))).map((record) => record.id)),
    });
  };

  const getRoyalHouseholdMatrix = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(getPrinceCampaignBoard(boundary).map((row) => {
      const householdAssignments = activeAssignments(boundary).filter((record) => [record.subjectEntityId, record.principalEntityId].includes(row.prince.id));
      const personnelIds = unique(householdAssignments.map((record) => record.personId));
      return Object.freeze({ ...row, personnelIds: freeze(personnelIds), householdAssignmentIds: freeze(householdAssignments.map((record) => record.id)), personnelCount: personnelIds.length });
    }));
  };

  const getCharacterCampaignDossier = (characterId, chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const state = stateFor(character.id, boundary);
    const characterRelationships = relatedRelationships(character.id, boundary);
    const characterAssignments = relatedAssignments(character.id, boundary);
    const characterThreads = relatedThreads(character.id, boundary);
    const knowledge = highValueIntelligence.getKnowledgeForEntity(character.id, boundary);
    const hostile = characterRelationships.filter((record) => record.sentiment === 'hostile');
    const allied = characterRelationships.filter((record) => record.sentiment === 'allied');
    return Object.freeze({
      chapter: boundary,
      character: compact(character),
      state: state ? Object.freeze({ life: state.life, body: state.bodyStateCode, identity: state.identityStateCode, consciousness: state.consciousnessStateCode, loyalty: state.loyaltyStateCode }) : null,
      locationId: locationFor(character.id, boundary)?.locationId || state?.locationId || null,
      abilityIds: freeze(knownAbilitiesForOwner(character.id, boundary).map((record) => record.id)),
      assignmentIds: freeze(characterAssignments.map((record) => record.id)),
      relationshipIds: freeze(characterRelationships.map((record) => record.id)),
      alliedRelationshipIds: freeze(allied.map((record) => record.id)),
      hostileRelationshipIds: freeze(hostile.map((record) => record.id)),
      knowledgeRecordIds: freeze(knowledge.map((record) => record.id)),
      storyThreadIds: freeze(characterThreads.map((record) => record.id)),
      latestAppearance: latestNumber(appearances(character.id, boundary).map((record) => record.chapter), null),
      currentObjectives: freeze(unique([
        ...characterAssignments.map((record) => record.summary || record.assignmentType),
        ...characterThreads.map((record) => record.question),
      ]).slice(0, 12)),
      currentThreats: freeze(hostile.map((record) => record.basis || record.operationalState || record.subtype || record.relationshipType).slice(0, 12)),
    });
  };

  const getChapterWhatChanged = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const previous = Math.max(earliestChapter, boundary - 1);
    const diff = highValueIntelligence.getChapterStateDiff(previous, boundary);
    const chapterRecord = data.chapters.find((record) => record.number === boundary) || null;
    const openedCases = successionMysteryCases.filter((record) => record.firstChapter === boundary);
    const resolvedCases = successionMysteryCases.filter((record) => record.status === 'resolved' && record.latestChapter === boundary);
    return Object.freeze({
      chapter: boundary,
      previousChapter: previous,
      chapterRecord: compact(chapterRecord),
      summary: diff.summary,
      changesByType: diff.summary.byType,
      records: diff.records,
      openedMysteryCaseIds: freeze(openedCases.map((record) => record.id)),
      resolvedMysteryCaseIds: freeze(resolvedCases.map((record) => record.id)),
      eventIds: freeze((chapterRecord?.eventIds || []).slice()),
      locationIds: freeze((chapterRecord?.locationIds || []).slice()),
      abilityIds: freeze((chapterRecord?.abilityIds || []).slice()),
      organizationIds: freeze((chapterRecord?.organizationIds || []).slice()),
      storyThreadIds: freeze((chapterRecord?.storyThreadIds || []).slice()),
    });
  };

  const getSuccessionRulesEngine = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const records = highValueIntelligence.getProtocolRecordsAtChapter(boundary);
    const domains = unique(records.map((record) => record.domain)).sort();
    return Object.freeze({ chapter: boundary, domains: freeze(domains), records: freeze(records), disputedIds: freeze(records.filter((record) => ['disputed', 'unknown', 'partially-confirmed'].includes(record.protocolStatus)).map((record) => record.id)) });
  };

  const getNenTrainingTracker = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const trainingWords = /nen class|training|instruction|teach|student|zetsu|aura node|learn|lesson/i;
    const trainingEvents = events.filter((record) => includesChapter(record.chapterRange, boundary) && trainingWords.test(text(record.name, record.summary, record.category, record.stateChanges, record.openQuestions)));
    const participants = unique(trainingEvents.flatMap((record) => record.participantIds || []));
    return Object.freeze({
      chapter: boundary,
      eventIds: freeze(trainingEvents.map((record) => record.id)),
      participants: freeze(participants.map((id) => {
        const character = archive.getEntityById(id);
        return Object.freeze({ character: compact(character), abilityIds: freeze(knownAbilitiesForOwner(id, boundary).map((record) => record.id)), latestAppearance: latestNumber(appearances(id, boundary).map((record) => record.chapter), null) });
      }).filter((record) => record.character)),
    });
  };

  const getAbilityTransferInheritanceLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const transferWords = /transfer|inherit|borrow|steal|possession|host|post.mortem|copy|fusion|baton|dolphin/i;
    return freeze(abilities.filter((record) => nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known && transferWords.test(text(record.name, record.summary, record.activation, record.conditions, record.limitations, record.researchStatus))).map((record) => Object.freeze({ ability: compact(record), ownerIds: freeze(record.ownerIds || []), activation: record.activation || null, conditions: freeze(record.conditions || []), limitations: freeze(record.limitations || []), researchStatus: record.researchStatus || null })));
  };

  const getMafiaWarCommandCenter = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const ids = ['organization:xi-yu', 'organization:cha-r', 'organization:heil-ly'];
    return freeze(ids.map((id) => {
      const org = archive.getEntityById(id);
      if (!org) return null;
      const memberRecords = archive.getOrganizationMembers(id).filter(Boolean);
      const memberIds = new Set(memberRecords.map((record) => record.id || record.characterId));
      return Object.freeze({
        organization: compact(org),
        leaderIds: freeze(org.leaderIds || []),
        memberIds: freeze([...memberIds]),
        eventIds: freeze(events.filter((event) => includesChapter(event.chapterRange, boundary) && (event.organizationIds || []).includes(id)).map((event) => event.id)),
        relationshipIds: freeze(activeRelationships(boundary).filter((record) => [record.sourceEntityId, record.targetEntityId].includes(id) || memberIds.has(record.sourceEntityId) || memberIds.has(record.targetEntityId)).map((record) => record.id)),
        abilityIds: freeze(abilities.filter((ability) => (ability.ownerIds || []).some((ownerId) => memberIds.has(ownerId)) && nenSystems.getAbilityKnowledgeAtChapter(ability.id, boundary)?.known).map((ability) => ability.id)),
      });
    }).filter(Boolean));
  };

  const getTroupeHisokaTracker = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const troupe = archive.getEntityById('organization:phantom-troupe');
    const members = archive.getOrganizationMembers('organization:phantom-troupe').filter(Boolean);
    const ids = new Set(members.map((record) => record.id || record.characterId));
    const hisoka = archive.getEntityById('character:hisoka-morow');
    return Object.freeze({
      chapter: boundary,
      organization: compact(troupe),
      hisoka: compact(hisoka),
      members: freeze(characters.filter((record) => ids.has(record.id)).map((record) => Object.freeze({ character: compact(record), life: stateFor(record.id, boundary)?.life || record.status?.life || 'unknown', locationId: locationFor(record.id, boundary)?.locationId || null, latestAppearance: latestNumber(appearances(record.id, boundary).map((appearance) => appearance.chapter), null) }))),
      hisokaLocationId: hisoka ? locationFor(hisoka.id, boundary)?.locationId || null : null,
      threadIds: freeze(threadRecords(boundary).filter((record) => /hisoka|troupe|chrollo|treasure/i.test(text(record.name, record.question))).map((record) => record.id)),
      relationshipIds: freeze(activeRelationships(boundary).filter((record) => ids.has(record.sourceEntityId) || ids.has(record.targetEntityId) || [record.sourceEntityId, record.targetEntityId].includes(hisoka?.id)).map((record) => record.id)),
    });
  };

  const getKurapikaMissionLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const id = 'character:kurapika';
    const dossier = getCharacterCampaignDossier(id, boundary);
    const missionKeywords = [
      ['woble-defense', /woble|oito|protect|room 1014/i],
      ['scarlet-eyes', /scarlet|tserriednich|collection/i],
      ['nen-instruction', /nen class|teach|instruction|student/i],
      ['royal-diplomacy', /alliance|treaty|prince|queen|diplom/i],
      ['beyond-curse', /beyond|longhi|curse child|moonlight/i],
      ['emperor-time', /emperor time|steal chain|dolphin/i],
    ];
    const sourceTexts = [
      ...relatedAssignments(id, boundary).map((record) => ({ id: record.id, value: text(record.assignmentType, record.summary, record.note) })),
      ...relatedThreads(id, boundary).map((record) => ({ id: record.id, value: text(record.name, record.question, record.evidenceState) })),
      ...events.filter((record) => includesChapter(record.chapterRange, boundary) && (record.participantIds || []).includes(id)).map((record) => ({ id: record.id, value: text(record.name, record.summary) })),
    ];
    const missions = missionKeywords.map(([missionId, pattern]) => Object.freeze({ id: `kurapika-mission:${missionId}`, sourceRecordIds: freeze(unique(sourceTexts.filter((record) => pattern.test(record.value)).map((record) => record.id))) }));
    return Object.freeze({ chapter: boundary, dossier, missions: freeze(missions) });
  };

  const getLifeStatusLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(characters.map((character) => {
      const state = stateFor(character.id, boundary);
      return Object.freeze({ character: compact(character), life: state?.life || character.status?.life || 'unknown', body: state?.bodyStateCode || 'unknown', identity: state?.identityStateCode || 'unresolved', consciousness: state?.consciousnessStateCode || 'unknown', latestAppearance: latestNumber(appearances(character.id, boundary).map((record) => record.chapter), null) });
    }));
  };

  const getDeceptionLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const pattern = /deceiv|lie|cover|frame|staged|secret|misinform|disguise|fake|conceal/i;
    return freeze(activeRelationships(boundary).filter((record) => pattern.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState))).map((record) => Object.freeze({ id: record.id, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), subtype: record.subtype || record.relationshipType, basis: record.basis || record.operationalState, certainty: record.certainty || 'confirmed' })));
  };

  const getOrdersSurveillanceCustodyLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const pattern = /order|command|surveillance|custody|detention|escort|confin|relocat|report|inspect|guard/i;
    return Object.freeze({
      assignments: freeze(activeAssignments(boundary).filter((record) => pattern.test(text(record.assignmentType, record.summary, record.note, record.status))).map(compact)),
      relationships: freeze(activeRelationships(boundary).filter((record) => pattern.test(text(record.relationshipType, record.subtype, record.basis, record.operationalState))).map(compact)),
    });
  };

  const getAllianceBetrayalLedger = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(activeRelationships(boundary).filter((record) => ['allied', 'hostile'].includes(record.sentiment) || /alliance|betray|cooperat|treaty|truce|defect/i.test(text(record.relationshipType, record.subtype, record.basis))).map((record) => Object.freeze({ id: record.id, source: compact(archive.getEntityById(record.sourceEntityId)), target: compact(archive.getEntityById(record.targetEntityId)), sentiment: record.sentiment, subtype: record.subtype || record.relationshipType, status: record.status || 'active' })));
  };

  const getActiveCountdowns = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const pattern = /countdown|deadline|half a day|hour|days?|window|expires?|timing|before/i;
    const threads = threadRecords(boundary).filter((record) => pattern.test(text(record.name, record.question, record.evidenceState)));
    const cases = successionMysteryCases.filter((record) => record.firstChapter <= boundary && pattern.test(text(record.title, record.question, record.summary, record.knownFacts, record.unknowns)));
    return Object.freeze({ threadIds: freeze(threads.map((record) => record.id)), mysteryCaseIds: freeze(cases.map((record) => record.id)) });
  };

  const getUnresolvedLedgers = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const cases = successionMysteryCases.filter((record) => record.firstChapter <= boundary && record.status !== 'resolved');
    return Object.freeze({
      identities: freeze(cases.filter((record) => /identity|consciousness|who |real|copy|body/i.test(text(record.category, record.question))).map((record) => record.id)),
      abilities: freeze(cases.filter((record) => /ability|nen|guardian|curse|mechanic|transfer|future/i.test(text(record.category, record.question))).map((record) => record.id)),
      locations: freeze(cases.filter((record) => /where|location|route|space|ship/i.test(text(record.category, record.question))).map((record) => record.id)),
    });
  };

  const getLeverageBoard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const keyCharacters = characters.filter((record) => (record.roles || []).some((role) => ['prince', 'queen', 'king', 'hunter', 'mafia-boss', 'zodiac'].includes(role)) || ['character:kurapika', 'character:morena-prudo', 'character:chrollo-lucilfer', 'character:hisoka-morow'].includes(record.id));
    return freeze(keyCharacters.map((character) => Object.freeze({
      character: compact(character),
      nen: knownAbilitiesForOwner(character.id, boundary).length,
      operational: relatedAssignments(character.id, boundary).length,
      relational: relatedRelationships(character.id, boundary).length,
      information: highValueIntelligence.getKnowledgeForEntity(character.id, boundary).length,
      authority: informationConsistency.getCharacterAuthorityProfile(character.id, boundary)?.officialRoleKind || 'unclassified',
    })));
  };

  const getFactionResourceBoard = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(organizations.map((org) => {
      const members = archive.getOrganizationMembers(org.id).filter(Boolean);
      const memberIds = new Set(members.map((record) => record.id || record.characterId));
      return Object.freeze({ organization: compact(org), memberCount: memberIds.size, abilityCount: abilities.filter((ability) => (ability.ownerIds || []).some((id) => memberIds.has(id)) && nenSystems.getAbilityKnowledgeAtChapter(ability.id, boundary)?.known).length, activeEventCount: events.filter((event) => includesChapter(event.chapterRange, boundary) && (event.organizationIds || []).includes(org.id)).length, activeAssignmentCount: activeAssignments(boundary).filter((record) => record.allegianceEntityId === org.id || memberIds.has(record.personId)).length, relationshipCount: activeRelationships(boundary).filter((record) => [record.sourceEntityId, record.targetEntityId].includes(org.id)).length }));
    }));
  };

  const getReaderVsInUniverseKnowledge = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return freeze(getKnowledgeWarfareMatrix(boundary).map((record) => Object.freeze({ id: record.id, name: record.name, readerState: 'available through maintained archive boundary', inUniverseState: record.knowledgeState, knownBy: record.knowerLabels, hiddenFromOrMisinformed: record.misinformedLabels, secrecy: record.secrecy })));
  };

  const getConsequenceChains = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    const graph = storyIntelligence.getStoryCausalGraphAtChapter(boundary);
    return Object.freeze({ chapter: boundary, nodes: freeze(graph?.nodes || []), links: freeze(graph?.links || graph?.edges || []), roots: freeze(graph?.roots || []) });
  };

  const getContentDepthSummary = (chapter = latestChapter) => {
    const boundary = clamp(chapter);
    return Object.freeze({
      chapter: boundary,
      princes: getPrinceCampaignBoard(boundary).length,
      queens: getQueenIntelligenceBoard(boundary).length,
      knowledgeClaims: getKnowledgeWarfareMatrix(boundary).length,
      threats: getThreatAssassinationMatrix(boundary).length,
      curseAbilities: getCurseRegistry(boundary).abilities.length,
      exceptionalBodyStates: getBodyIdentityConsciousnessExplorer(boundary).length,
      mysteries: successionMysteryCases.filter((record) => record.firstChapter <= boundary).length,
      activeCountdownSignals: getActiveCountdowns(boundary).threadIds.length + getActiveCountdowns(boundary).mysteryCaseIds.length,
    });
  };

  return Object.freeze({
    getPrinceCampaignBoard,
    getQueenIntelligenceBoard,
    getKnowledgeWarfareMatrix,
    getCurseRegistry,
    getBodyIdentityConsciousnessExplorer,
    getMartialLawCommandBoard,
    getThreatAssassinationMatrix,
    getHeilLyContagionDashboard,
    getRoyalHouseholdMatrix,
    getCharacterCampaignDossier,
    getChapterWhatChanged,
    getSuccessionRulesEngine,
    getNenTrainingTracker,
    getAbilityTransferInheritanceLedger,
    getMafiaWarCommandCenter,
    getTroupeHisokaTracker,
    getKurapikaMissionLedger,
    getLifeStatusLedger,
    getDeceptionLedger,
    getOrdersSurveillanceCustodyLedger,
    getAllianceBetrayalLedger,
    getActiveCountdowns,
    getUnresolvedLedgers,
    getLeverageBoard,
    getFactionResourceBoard,
    getReaderVsInUniverseKnowledge,
    getConsequenceChains,
    getContentDepthSummary,
  });
};
