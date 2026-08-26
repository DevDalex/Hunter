import { successionMysteryCases } from './successionMysteryCases.js';
import {
  CHAPTER_FORENSIC_FIELDS,
  PRINCE_DOSSIER_FIELDS,
  SPECIAL_PRINCE_TRACKERS,
  INVESTIGATION_DOSSIERS,
  KAKIN_ROYAL_REFERENCE,
  INFORMATION_WAR_TOPICS,
  LEDGER_DEFINITIONS,
  READER_ORIENTATION_CHECKPOINTS,
  EVIDENCE_QUALITY_RULES,
  REFERENCE_APPENDICES,
} from './contentDepthExpansionReference.js';

const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const words = (...values) => values.flat(Infinity).filter(Boolean).join(' ').toLocaleLowerCase();
const compact = (entity) => entity ? Object.freeze({ id: entity.id, entityType: entity.entityType, name: entity.name || entity.title || entity.id, slug: entity.slug || null }) : null;
const chapterFromSourceId = (id) => Number(String(id || '').match(/chapter-(\d+)/)?.[1]) || null;
const maxFinite = (values = []) => {
  const finite = values.map(Number).filter(Number.isFinite);
  return finite.length ? Math.max(...finite) : null;
};
const summarizeUnknown = (value) => value == null || value === '' || value === 'unknown' || value === 'unresolved';
const activeInChapter = (record, chapter) => {
  const start = Number(record?.chapterRange?.start || record?.firstChapter || 0);
  const end = Number(record?.chapterRange?.end ?? record?.latestChapter ?? Number.POSITIVE_INFINITY);
  return chapter >= start && chapter <= end;
};

export const createContentDepthExpansionSelectors = ({
  data,
  archive,
  informationConsistency,
  highValueIntelligence,
  nenSystems,
  storyIntelligence,
  contentDepth,
}) => {
  const latest = data.chapters.at(-1)?.number || 417;
  const earliest = data.chapters.at(0)?.number || 340;
  const clamp = (chapter) => Math.min(latest, Math.max(earliest, Number(chapter) || latest));
  const characters = archive.getEntitiesByType('character');
  const organizations = archive.getEntitiesByType('organization');
  const abilities = archive.getEntitiesByType('ability');
  const beasts = archive.getEntitiesByType('guardian-beast');
  const events = archive.getEntitiesByType('event');
  const assignments = archive.getEntitiesByType('assignment');
  const relationships = archive.getEntitiesByType('relationship');

  const stateAt = (id, chapter) => informationConsistency.getCanonicalCharacterState(id, chapter);
  const stateFingerprint = (state = {}) => JSON.stringify([
    state.life || 'unknown', state.bodyStateCode || 'unknown', state.identityStateCode || 'unresolved',
    state.consciousnessStateCode || 'unknown', state.locationId || null,
  ]);
  const appearanceChapters = (id) => archive.getAppearancesForCharacter(id).map((record) => Number(record.chapter)).filter(Number.isFinite);
  const lastAppearance = (id, chapter) => maxFinite(appearanceChapters(id).filter((value) => value <= chapter));
  const firstAppearance = (id) => {
    const values = appearanceChapters(id);
    return values.length ? Math.min(...values) : null;
  };
  const activeAssignments = (chapter) => assignments.filter((record) => activeInChapter(record, chapter));
  const activeRelationships = (chapter) => relationships.filter((record) => activeInChapter(record, chapter));

  const getChapterForensicDossier = (chapter = latest) => {
    const boundary = clamp(chapter);
    const previous = Math.max(earliest, boundary - 1);
    const chapterRecord = data.chapters.find((record) => Number(record.number) === boundary) || null;
    const chapterEntity = archive.getEntityById(`chapter:${boundary}`) || archive.getEntityById(`chapter-${boundary}`) || chapterRecord;
    const chapterEvents = archive.getEventsForChapter(boundary) || [];
    const eventIds = unique([...(chapterRecord?.eventIds || []), ...chapterEvents.map((record) => record.id)]);
    const locationIds = unique([
      ...(chapterRecord?.locationIds || []),
      ...chapterEvents.flatMap((record) => [record.locationId, ...(record.locationIds || [])]),
    ]);
    const participantIds = unique(chapterEvents.flatMap((record) => record.participantIds || []));
    const organizationIds = unique([...(chapterRecord?.organizationIds || []), ...chapterEvents.flatMap((record) => record.organizationIds || [])]);
    const abilityIds = unique([...(chapterRecord?.abilityIds || []), ...chapterEvents.flatMap((record) => record.abilityIds || [])]);
    const relationshipIds = unique((archive.getRelationshipsForChapter(boundary) || []).map((record) => record.id));
    const assignmentIds = unique((archive.getAssignmentsForChapter(boundary) || []).map((record) => record.id));

    const transitions = characters.map((character) => {
      const before = stateAt(character.id, previous);
      const after = stateAt(character.id, boundary);
      if (!after || stateFingerprint(before) === stateFingerprint(after)) return null;
      return Object.freeze({ character: compact(character), before: before || null, after, changedAt: boundary });
    }).filter(Boolean);
    const deaths = transitions.filter((row) => row.after?.life === 'dead' && row.before?.life !== 'dead');
    const bodyIdentityChanges = transitions.filter((row) => words(row.before?.bodyStateCode, row.before?.identityStateCode, row.before?.consciousnessStateCode) !== words(row.after?.bodyStateCode, row.after?.identityStateCode, row.after?.consciousnessStateCode));
    const firstAppearances = characters.filter((character) => firstAppearance(character.id) === boundary).map(compact);
    const appearances = characters.filter((character) => appearanceChapters(character.id).includes(boundary)).map((character) => Object.freeze({ character: compact(character), previousAppearance: maxFinite(appearanceChapters(character.id).filter((value) => value < boundary)) }));

    const affectedMysteries = successionMysteryCases.filter((record) => record.firstChapter <= boundary && (
      record.firstChapter === boundary
      || record.latestChapter === boundary
      || (record.sourceIds || []).includes(`source:chapter-${boundary}`)
      || (record.resolutionHistory || []).some((entry) => Number(entry.chapter) === boundary)
    ));
    const openedMysteries = affectedMysteries.filter((record) => record.firstChapter === boundary);
    const resolvedMysteries = affectedMysteries.filter((record) => record.status === 'resolved' || (record.resolutionHistory || []).some((entry) => Number(entry.chapter) === boundary && /resolv|confirm|eliminat|closed/i.test(words(entry.summary, entry.status))));
    const diff = highValueIntelligence.getChapterStateDiff(previous, boundary);
    const story = storyIntelligence.getChapterStoryDossier(boundary);

    return Object.freeze({
      chapter: boundary,
      previousChapter: previous,
      schemaFields: CHAPTER_FORENSIC_FIELDS,
      chapterRecord: compact(chapterEntity),
      metadata: Object.freeze({
        title: chapterRecord?.title || chapterEntity?.title || chapterEntity?.name || null,
        japaneseTitle: chapterRecord?.japaneseTitle || chapterEntity?.japaneseTitle || null,
        alternateTitles: freeze(chapterRecord?.alternateTitles || chapterEntity?.alternateTitles || []),
        releaseDate: chapterRecord?.releaseDate || chapterEntity?.releaseDate || null,
        volume: chapterRecord?.volume || chapterEntity?.volume || null,
        chronology: chapterRecord?.storyDate || chapterRecord?.voyageDay || chapterEntity?.storyDate || null,
        chronologyCertainty: chapterRecord?.chronologyCertainty || chapterEntity?.chronologyCertainty || 'unknown',
      }),
      story,
      stateDiff: diff,
      eventIds: freeze(eventIds),
      locationIds: freeze(locationIds),
      participantIds: freeze(participantIds),
      organizationIds: freeze(organizationIds),
      abilityIds: freeze(abilityIds),
      relationshipIds: freeze(relationshipIds),
      assignmentIds: freeze(assignmentIds),
      firstAppearances: freeze(firstAppearances),
      appearances: freeze(appearances),
      stateTransitions: freeze(transitions),
      deaths: freeze(deaths),
      bodyIdentityChanges: freeze(bodyIdentityChanges),
      affectedMysteries: freeze(affectedMysteries),
      openedMysteries: freeze(openedMysteries),
      resolvedMysteries: freeze(resolvedMysteries),
      questionsOpened: freeze(openedMysteries.map((record) => record.question)),
      questionsStillOpen: freeze(affectedMysteries.filter((record) => record.status !== 'resolved').flatMap((record) => record.unknowns || [])),
      crossLinks: Object.freeze({ characterIds: freeze(participantIds), organizationIds: freeze(organizationIds), locationIds: freeze(locationIds), abilityIds: freeze(abilityIds), mysteryCaseIds: freeze(affectedMysteries.map((record) => record.id)), eventIds: freeze(eventIds) }),
      whyItMatters: diff?.summary || story?.summary || chapterRecord?.summary || 'Use the state transitions, active threads, evidence, and affected mystery cases to explain the chapter’s consequences.',
    });
  };

  const getFullPrinceDossiers = (chapter = latest) => {
    const boundary = clamp(chapter);
    const board = contentDepth.getPrinceCampaignBoard(boundary);
    const threatRows = contentDepth.getThreatAssassinationMatrix(boundary);
    const knowledgeRows = contentDepth.getKnowledgeWarfareMatrix(boundary);
    const active = activeAssignments(boundary);
    const rels = activeRelationships(boundary);
    return freeze(board.map((row) => {
      const prince = archive.getEntityById(row.character.id);
      const tracker = SPECIAL_PRINCE_TRACKERS.find((record) => record.entityId === prince.id) || null;
      const personalAssignments = active.filter((record) => [record.personId, record.subjectEntityId, record.principalEntityId, record.allegianceEntityId, record.reportingEntityId].includes(prince.id));
      const princeRelationships = rels.filter((record) => [record.sourceEntityId, record.targetEntityId].includes(prince.id));
      const allied = princeRelationships.filter((record) => record.sentiment === 'allied');
      const hostile = princeRelationships.filter((record) => record.sentiment === 'hostile');
      const knownInformation = knowledgeRows.filter((record) => (record.knowerEntityIds || []).includes(prince.id));
      const missingOrFalseInformation = knowledgeRows.filter((record) => (record.misinformedEntityIds || []).includes(prince.id));
      const beast = row.guardianBeastId ? archive.getEntityById(row.guardianBeastId) : beasts.find((record) => record.hostCharacterId === prince.id) || null;
      const ownedAbilities = abilities.filter((record) => (record.ownerIds || []).includes(prince.id) && nenSystems.getAbilityKnowledgeAtChapter(record.id, boundary)?.known);
      const incomingThreats = threatRows.filter((record) => record.target?.id === prince.id);
      const outgoingThreats = threatRows.filter((record) => record.source?.id === prince.id);
      const personnelIds = unique(personalAssignments.filter((record) => [record.subjectEntityId, record.principalEntityId].includes(prince.id)).map((record) => record.personId));
      const stateHistory = freeze((data.characterStateProfiles?.[prince.id] || []).filter((record) => Number(record.chapterRange?.start || 0) <= boundary));
      return Object.freeze({
        chapter: boundary,
        schemaFields: PRINCE_DOSSIER_FIELDS,
        prince: compact(prince),
        order: row.order,
        queenRank: row.queenRank,
        biologicalMotherId: row.biologicalMotherId,
        state: Object.freeze({ life: row.life, body: row.body, identity: row.identity, consciousness: row.consciousness, locationId: row.locationId, latestAppearance: row.latestAppearance }),
        objectives: freeze(contentDepth.getCharacterCampaignDossier(prince.id, boundary)?.currentObjectives || []),
        abilityIds: freeze(ownedAbilities.map((record) => record.id)),
        guardianBeast: compact(beast),
        personnelIds: freeze(personnelIds),
        assignmentIds: freeze(personalAssignments.map((record) => record.id)),
        alliedRelationshipIds: freeze(allied.map((record) => record.id)),
        hostileRelationshipIds: freeze(hostile.map((record) => record.id)),
        incomingThreatIds: freeze(incomingThreats.map((record) => record.id)),
        outgoingThreatIds: freeze(outgoingThreats.map((record) => record.id)),
        knownInformationIds: freeze(knownInformation.map((record) => record.id)),
        missingOrFalseInformationIds: freeze(missingOrFalseInformation.map((record) => record.id)),
        statusHistory: stateHistory,
        specialTracker: tracker,
        biggestUnknowns: freeze(tracker?.questions || []),
      });
    }));
  };

  const getSpecialPrinceTracker = (id, chapter = latest) => {
    const boundary = clamp(chapter);
    const tracker = SPECIAL_PRINCE_TRACKERS.find((record) => record.id === id || record.entityId === id) || null;
    if (!tracker) return null;
    const dossier = getFullPrinceDossiers(boundary).find((record) => record.prince.id === tracker.entityId) || null;
    return Object.freeze({ ...tracker, chapter: boundary, dossier });
  };

  const getInvestigationDossiers = (chapter = latest) => {
    const boundary = clamp(chapter);
    return freeze(INVESTIGATION_DOSSIERS.map((record) => {
      const key = record.id === 'silent-majority' ? /silent-majority/i
        : record.id === 'beyond-network' ? /beyond|curse-child|sarahell/i
          : record.id === 'troupe-hisoka' ? /hisoka|troupe|chrollo/i
            : /heil-ly|morena|borksen|mafia/i;
      const cases = successionMysteryCases.filter((item) => item.firstChapter <= boundary && key.test(words(item.id, item.title, item.question, item.summary, item.relatedThreadIds)));
      return Object.freeze({
        ...record,
        chapter: boundary,
        entities: freeze(record.relatedIds.map((id) => compact(archive.getEntityById(id))).filter(Boolean)),
        caseIds: freeze(cases.map((item) => item.id)),
        cases: freeze(cases),
      });
    }));
  };

  const getBeyondIntelligenceDossier = (chapter = latest) => {
    const boundary = clamp(chapter);
    const ids = ['character:beyond-netero', 'character:longhi', 'character:kurapika'];
    const knowledge = contentDepth.getKnowledgeWarfareMatrix(boundary).filter((record) => /beyond|longhi|curse child|curse-child|netero/i.test(words(record.name, record.subjectLabels, record.knowerLabels, record.acquisition)));
    const curseRows = contentDepth.getCurseRegistry(boundary);
    const cases = successionMysteryCases.filter((record) => record.firstChapter <= boundary && /beyond|curse-child|sarahell/i.test(words(record.id, record.title, record.summary)));
    return Object.freeze({
      chapter: boundary,
      people: freeze(ids.map((id) => compact(archive.getEntityById(id))).filter(Boolean)),
      knowledge: freeze(knowledge),
      curseAbilityIds: freeze(curseRows.abilities.filter((row) => /beyond|curse child|sarahell/i.test(words(row.ability?.name, row.ability?.id, row.activation, row.conditions))).map((row) => row.ability.id)),
      caseIds: freeze(cases.map((record) => record.id)),
      disclosureRule: 'Longhi-attributed facts remain attributed until independent corroboration is published.',
      unknowns: freeze(unique(cases.flatMap((record) => record.unknowns || []))),
    });
  };

  const getTroupeHisokaDeepDossier = (chapter = latest) => {
    const boundary = clamp(chapter);
    const tracker = contentDepth.getTroupeHisokaTracker(boundary);
    const troupe = archive.getEntityById('organization:phantom-troupe');
    const members = troupe ? archive.getOrganizationMembers(troupe.id) : [];
    const relatedCases = successionMysteryCases.filter((record) => record.firstChapter <= boundary && /hisoka|troupe|chrollo/i.test(words(record.id, record.title, record.summary)));
    return Object.freeze({ chapter: boundary, tracker, organization: compact(troupe), members: freeze(members), caseIds: freeze(relatedCases.map((record) => record.id)), investigation: INVESTIGATION_DOSSIERS.find((record) => record.id === 'troupe-hisoka') });
  };

  const getMafiaDeepDossier = (chapter = latest) => {
    const boundary = clamp(chapter);
    const families = ['organization:heil-ly', 'organization:xi-yu', 'organization:cha-r'].map((id) => archive.getEntityById(id)).filter(Boolean);
    const familyRows = families.map((family) => Object.freeze({ organization: compact(family), members: freeze(archive.getOrganizationMembers(family.id)), relationships: freeze(archive.getRelationshipsForEntity(family.id)), events: freeze(archive.getEventsForOrganization(family.id)) }));
    return Object.freeze({
      chapter: boundary,
      commandCenter: contentDepth.getMafiaWarCommandCenter(boundary),
      heilLy: contentDepth.getHeilLyContagionDashboard(boundary),
      families: freeze(familyRows),
      investigation: INVESTIGATION_DOSSIERS.find((record) => record.id === 'mafia-war'),
    });
  };

  const getKakinRoyalSystemReference = (chapter = latest) => {
    const boundary = clamp(chapter);
    const protocolPattern = /succession|seed urn|royal|martial|justice|funeral|casket|prince|guardian/i;
    const protocols = highValueIntelligence.getProtocolRecordsAtChapter(boundary).filter((record) => protocolPattern.test(words(record.name, record.domain, record.summary, record.ruleStatement, record.authority)));
    return Object.freeze({
      chapter: boundary,
      reference: KAKIN_ROYAL_REFERENCE,
      king: compact(archive.getEntityById('character:nasubi-hui-guo-rou')),
      queens: freeze(characters.filter((record) => (record.roles || []).includes('queen')).map(compact)),
      princes: freeze(characters.filter((record) => (record.roles || []).includes('prince')).sort((a, b) => (a.princeOrder || 99) - (b.princeOrder || 99)).map(compact)),
      protocols: freeze(protocols),
      ritualCases: freeze(successionMysteryCases.filter((record) => record.firstChapter <= boundary && /ritual|casket|succession|treasure|guardian/i.test(words(record.category, record.title, record.summary)))),
    });
  };

  const getInformationWarExpansion = (chapter = latest) => {
    const boundary = clamp(chapter);
    const records = contentDepth.getKnowledgeWarfareMatrix(boundary);
    const topicRows = INFORMATION_WAR_TOPICS.map((topic) => {
      const tokens = topic.toLocaleLowerCase().split(/\s+|\//).filter((token) => token.length > 3);
      const matches = records.filter((record) => tokens.some((token) => words(record.name, record.subjectLabels, record.knowerLabels, record.misinformedLabels, record.acquisition).includes(token)));
      return Object.freeze({ topic, matches: freeze(matches), count: matches.length });
    });
    return Object.freeze({ chapter: boundary, topics: freeze(topicRows), readerVsInUniverse: contentDepth.getReaderVsInUniverseKnowledge(boundary), totalClaims: records.length });
  };

  const getMysteryEvidenceFiles = (chapter = latest) => {
    const boundary = clamp(chapter);
    return freeze(successionMysteryCases.filter((record) => record.firstChapter <= boundary).map((record) => {
      const sourceChapters = (record.sourceIds || []).map(chapterFromSourceId).filter(Number.isFinite);
      const resolutionChapters = (record.resolutionHistory || []).map((entry) => Number(entry.chapter)).filter(Number.isFinite);
      return Object.freeze({
        ...record,
        latestEvidenceChapter: maxFinite([...sourceChapters, ...resolutionChapters, record.latestChapter]) || record.latestChapter,
        evidenceForCount: (record.candidates || []).reduce((sum, candidate) => sum + (candidate.evidenceFor || []).length, 0),
        evidenceAgainstCount: (record.candidates || []).reduce((sum, candidate) => sum + (candidate.evidenceAgainst || []).length, 0),
        whatWouldResolve: freeze((record.unknowns || []).map((unknown) => `Publish evidence that resolves: ${unknown}`)),
      });
    }));
  };

  const getCrossLinkAtlas = (seed, chapter = latest) => {
    const boundary = clamp(chapter);
    if (Number.isFinite(Number(seed))) {
      const dossier = getChapterForensicDossier(Number(seed));
      return Object.freeze({ kind: 'chapter', id: String(seed), chapter: dossier.chapter, ...dossier.crossLinks });
    }
    const entity = archive.getEntityById(seed);
    if (!entity) return null;
    const related = archive.getRelatedEntities(entity.id) || [];
    const relationshipsFor = archive.getRelationshipsForEntity(entity.id) || [];
    const sourceIds = (archive.getSourcesForEntity(entity.id) || []).map((record) => record.id);
    const eventIds = entity.entityType === 'character' ? (archive.getEventsForCharacter(entity.id) || []).map((record) => record.id)
      : entity.entityType === 'organization' ? (archive.getEventsForOrganization(entity.id) || []).map((record) => record.id)
        : entity.entityType === 'ability' ? (archive.getEventsForAbility(entity.id) || []).map((record) => record.id)
          : [];
    const knowledgeIds = highValueIntelligence.getKnowledgeForEntity(entity.id, boundary).map((record) => record.id);
    const mysteryCaseIds = successionMysteryCases.filter((record) => record.firstChapter <= boundary && [...(record.relatedEntityIds || []), ...(record.relatedAbilityIds || [])].includes(entity.id)).map((record) => record.id);
    return Object.freeze({ kind: 'entity', id: entity.id, chapter: boundary, entity: compact(entity), relatedEntityIds: freeze(unique(related.map((record) => record.id || record.entity?.id))), relationshipIds: freeze(relationshipsFor.map((record) => record.id)), eventIds: freeze(eventIds), sourceIds: freeze(sourceIds), knowledgeIds: freeze(knowledgeIds), mysteryCaseIds: freeze(mysteryCaseIds) });
  };

  const eventMatches = (pattern, chapter) => events.filter((record) => Number(record.chapterRange?.start || 0) <= chapter && pattern.test(words(record.name, record.summary, record.category, record.stateChanges, record.openQuestions)));
  const describeRows = (rows = []) => freeze(rows.slice(0, 18).map((row) => {
    if (!row) return null;
    if (row.character?.name) return row.character.name;
    if (row.ability?.name) return row.ability.name;
    if (row.organization?.name) return row.organization.name;
    if (row.source?.name || row.target?.name) return [row.source?.name, row.target?.name].filter(Boolean).join(' → ');
    return row.name || row.title || row.label || row.term || row.id || 'record';
  }).filter(Boolean));

  const getArchiveLedgers = (chapter = latest) => {
    const boundary = clamp(chapter);
    const lifeRows = contentDepth.getLifeStatusLedger(boundary);
    const lastSeenRows = characters.map((character) => Object.freeze({ character: compact(character), lastChapter: lastAppearance(character.id, boundary) })).filter((row) => row.lastChapter).sort((a, b) => b.lastChapter - a.lastChapter);
    const bodyRows = contentDepth.getBodyIdentityConsciousnessExplorer(boundary, { exceptionalOnly: true });
    const curse = contentDepth.getCurseRegistry(boundary);
    const threatRows = contentDepth.getThreatAssassinationMatrix(boundary);
    const training = contentDepth.getNenTrainingTracker(boundary);
    const alliances = contentDepth.getAllianceBetrayalLedger(boundary);
    const orders = contentDepth.getOrdersSurveillanceCustodyLedger(boundary);
    const deception = contentDepth.getDeceptionLedger(boundary);
    const artifacts = highValueIntelligence.getArtifactsAtChapter(boundary);
    const injuryRows = eventMatches(/injur|wound|shot|poison|trauma|collapse|illness|deteriorat|critical/i, boundary);
    const missingRows = characters.filter((character) => {
      const state = stateAt(character.id, boundary);
      return summarizeUnknown(state?.life) || summarizeUnknown(state?.bodyStateCode) || summarizeUnknown(state?.identityStateCode) || /missing|whereabouts unknown|unresolved location/i.test(words(character.summary));
    }).map((character) => Object.freeze({ character: compact(character), state: stateAt(character.id, boundary) }));
    const beastRows = beasts.filter((record) => Number(record.chapterRange?.start || 0) <= boundary);
    const communicationRows = contentDepth.getKnowledgeWarfareMatrix(boundary).filter((record) => record.acquisition || record.publicAtChapter);
    const ledgerRows = {
      death: lifeRows?.dead || (Array.isArray(lifeRows) ? lifeRows.filter((row) => row.life === 'dead' || row.status === 'dead') : []),
      'last-seen': lastSeenRows,
      injury: injuryRows,
      missing: missingRows,
      'body-identity': bodyRows,
      curse: [...(curse.abilities || []), ...(curse.protocols || [])],
      'guardian-beast': beastRows,
      assassination: threatRows,
      'nen-awakening': training.participants || [],
      alliance: Array.isArray(alliances) ? alliances : alliances?.rows || alliances?.records || [],
      contract: [...activeAssignments(boundary), ...highValueIntelligence.getProtocolRecordsAtChapter(boundary)].filter((row) => /contract|deal|agreement|negotiat|condition|pledge|alliance/i.test(words(row.name, row.summary, row.assignmentType, row.ruleStatement, row.basis))),
      orders: Array.isArray(orders) ? orders : orders?.rows || orders?.records || [],
      communications: communicationRows,
      deception: Array.isArray(deception) ? deception : deception?.rows || deception?.records || [],
      objects: artifacts,
      coins: artifacts.filter((row) => /coin|zhang lei|zhang-lei/i.test(words(row.name, row.summary, row.id))),
      'tyson-book': artifacts.filter((row) => /tyson|book/i.test(words(row.name, row.summary, row.id))),
      treasures: artifacts.filter((row) => /treasure|urn|casket|royal/i.test(words(row.name, row.summary, row.id))),
      'heil-ly-level': contentDepth.getHeilLyContagionDashboard(boundary).members || [],
      'benjamin-baton': contentDepth.getAbilityTransferInheritanceLedger(boundary).filter((row) => /benjamin|baton/i.test(words(row.ability?.name, row.ability?.id))),
      'have-not': threatRows.filter((row) => /have.not|curse|sarahell|camilla/i.test(words(row.method, row.source?.name, row.target?.name, row.id))),
      guards: activeAssignments(boundary).filter((row) => /protect|guard|surveillance|security|custody|infiltrat/i.test(words(row.assignmentType, row.summary))),
    };
    return freeze(LEDGER_DEFINITIONS.map((definition) => {
      const rows = ledgerRows[definition.id] || [];
      return Object.freeze({ ...definition, chapter: boundary, count: rows.length, preview: describeRows(rows), rows: freeze(rows) });
    }));
  };

  const getReaderOrientation = (checkpoint = latest) => {
    const boundary = clamp(checkpoint);
    const princes = contentDepth.getPrinceCampaignBoard(boundary);
    const factions = contentDepth.getFactionResourceBoard(boundary);
    const mysteries = getMysteryEvidenceFiles(boundary).filter((record) => record.status !== 'resolved');
    const threads = (storyIntelligence.getStoryThreadsAtChapter(boundary) || []).map((record) => record?.profile || record).filter(Boolean);
    const changed = contentDepth.getChapterWhatChanged(boundary);
    return Object.freeze({
      chapter: boundary,
      isNamedCheckpoint: READER_ORIENTATION_CHECKPOINTS.includes(boundary),
      availableCheckpoints: READER_ORIENTATION_CHECKPOINTS,
      princeStatus: freeze(princes.map((row) => Object.freeze({ name: row.character.name, life: row.life, locationId: row.locationId, threats: row.threatIds.length, latestAppearance: row.latestAppearance }))),
      factionStatus: freeze((factions || []).slice(0, 20)),
      unresolvedMysteries: freeze(mysteries.slice(0, 20)),
      activeThreads: freeze(threads.slice(0, 24)),
      chapterDelta: changed,
      prompts: freeze(['Who is this again?', 'Why does this person matter?', 'When did we last see them?', 'Who are they loyal to?', 'Which prince do they work for?', 'Do they know Nen?', 'Are they alive?']),
    });
  };

  const getEvidenceQualityAudit = (chapter = latest) => {
    const boundary = clamp(chapter);
    const types = ['character', 'organization', 'ability', 'guardian-beast', 'location', 'event', 'assignment', 'relationship', 'knowledge-record', 'protocol', 'object', 'document', 'evidence-item'];
    const entityRows = types.flatMap((type) => archive.getEntitiesByType(type)).filter((entity) => {
      const first = Number(entity.chapterRange?.start || entity.firstChapter || 0);
      return !first || first <= boundary;
    }).map((entity) => {
      const sources = archive.getSourcesForEntity(entity.id) || [];
      const canon = entity.canonLevel || 'canon';
      const unknownFields = Object.entries(entity).filter(([key, value]) => /status|state|location|owner|host|range|condition|target|review/i.test(key) && summarizeUnknown(value)).map(([key]) => key);
      return Object.freeze({ entity: compact(entity), sourceCount: sources.length, canonLevel: canon, unknownFields: freeze(unknownFields), reviewedThroughChapter: entity.reviewedThroughChapter || entity.latestChapter || null, lastEvidenceChapter: maxFinite(sources.map((source) => Number(source.chapter || chapterFromSourceId(source.id)))) });
    });
    return Object.freeze({
      chapter: boundary,
      rules: EVIDENCE_QUALITY_RULES,
      totalRecords: entityRows.length,
      unsourced: freeze(entityRows.filter((row) => row.sourceCount === 0)),
      inferenceOrTheory: freeze(entityRows.filter((row) => ['inference', 'theory'].includes(row.canonLevel))),
      explicitUnknowns: freeze(entityRows.filter((row) => row.unknownFields.length)),
      staleReviewBoundary: freeze(entityRows.filter((row) => Number.isFinite(Number(row.reviewedThroughChapter)) && Number(row.reviewedThroughChapter) < boundary)),
      rows: freeze(entityRows),
    });
  };

  const getReferenceAppendices = (chapter = latest) => {
    const boundary = clamp(chapter);
    const knownAbilityIds = new Set(nenSystems.getAbilitiesKnownAtChapter(boundary).map((record) => record.id));
    const knownNenUsers = characters.filter((character) => abilities.some((ability) => knownAbilityIds.has(ability.id) && (ability.ownerIds || []).includes(character.id))).map(compact);
    const aliases = characters.flatMap((character) => (character.aliases || []).map((alias) => Object.freeze({ alias, character: compact(character) })));
    const postMortemAbilities = abilities.filter((ability) => knownAbilityIds.has(ability.id) && /post.mortem|after death|death/i.test(words(ability.summary, ability.activation, ability.conditions, ability.researchStatus))).map(compact);
    const transferredAbilities = contentDepth.getAbilityTransferInheritanceLedger(boundary);
    return Object.freeze({
      chapter: boundary,
      catalogue: REFERENCE_APPENDICES,
      dramatisPersonae: freeze(characters.filter((character) => lastAppearance(character.id, boundary)).map((character) => Object.freeze({ character: compact(character), roles: freeze(character.roles || []), affiliations: freeze(character.affiliations || []), lastAppearance: lastAppearance(character.id, boundary) }))),
      aliases: freeze(aliases),
      organizations: freeze(organizations.map(compact)),
      knownNenUsers: freeze(knownNenUsers),
      postMortemAbilities: freeze(postMortemAbilities),
      transferredAbilities: freeze(transferredAbilities),
      ongoingPlans: freeze((storyIntelligence.getStoryThreadsAtChapter(boundary) || []).map((row) => row?.profile || row).filter((row) => row && row.status !== 'resolved')),
    });
  };

  const getContentExpansionSummary = (chapter = latest) => {
    const boundary = clamp(chapter);
    const princes = getFullPrinceDossiers(boundary);
    const ledgers = getArchiveLedgers(boundary);
    const mysteries = getMysteryEvidenceFiles(boundary);
    const evidence = getEvidenceQualityAudit(boundary);
    return Object.freeze({
      chapter: boundary,
      chapterSchemaFields: CHAPTER_FORENSIC_FIELDS.length,
      princeSchemaFields: PRINCE_DOSSIER_FIELDS.length,
      specialPrinceTrackers: SPECIAL_PRINCE_TRACKERS.length,
      investigations: INVESTIGATION_DOSSIERS.length,
      princes: princes.length,
      ledgers: ledgers.length,
      mysteryFiles: mysteries.length,
      evidenceRules: EVIDENCE_QUALITY_RULES.length,
      appendixFamilies: REFERENCE_APPENDICES.length,
      evidenceRecords: evidence.totalRecords,
    });
  };

  return Object.freeze({
    getChapterForensicDossier,
    getFullPrinceDossiers,
    getSpecialPrinceTracker,
    getInvestigationDossiers,
    getBeyondIntelligenceDossier,
    getTroupeHisokaDeepDossier,
    getMafiaDeepDossier,
    getKakinRoyalSystemReference,
    getInformationWarExpansion,
    getMysteryEvidenceFiles,
    getCrossLinkAtlas,
    getArchiveLedgers,
    getReaderOrientation,
    getEvidenceQualityAudit,
    getReferenceAppendices,
    getContentExpansionSummary,
  });
};
