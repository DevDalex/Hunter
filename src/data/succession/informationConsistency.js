import {
  BODY_STATES,
  BODY_STATE_VALUES,
  CONSCIOUSNESS_STATES,
  CONSCIOUSNESS_STATE_VALUES,
  IDENTITY_STATES,
  IDENTITY_STATE_VALUES,
  LIFE_STATUSES,
  LOYALTY_STATES,
  LOYALTY_STATE_VALUES,
  OFFICIAL_ROLE_KINDS,
  OFFICIAL_ROLE_KIND_VALUES,
} from './registries.js';

const freezeArray = (values = []) => Object.freeze([...values]);
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const titleCase = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const normalizeLookupKey = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[’'`]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .trim()
  .toLocaleLowerCase();

export const normalizeRoleToken = (value) => normalizeLookupKey(value).replaceAll(' ', '-');

export const normalizeAliasList = (name, aliases = []) => {
  const canonicalKey = normalizeLookupKey(name);
  const seen = new Set();
  const normalized = [];
  for (const value of aliases || []) {
    const display = String(value || '').trim().replace(/\s+/g, ' ');
    const key = normalizeLookupKey(display);
    if (!display || !key || key === canonicalKey || seen.has(key)) continue;
    seen.add(key);
    normalized.push(display);
  }
  return freezeArray(normalized);
};

const textForState = (record = {}, character = {}) => normalizeLookupKey([
  record.life,
  record.bodyState,
  record.identityState,
  record.consciousnessState,
  record.operationalState,
  record.allegianceState,
  character.status?.life,
].filter(Boolean).join(' '));

const has = (text, pattern) => pattern.test(text);

export const deriveBodyStateCode = (record = {}, character = {}) => {
  if (BODY_STATE_VALUES.includes(record.bodyStateCode)) return record.bodyStateCode;
  const text = textForState(record, character);
  if (has(text, /occup|possess|inhabit|host body/)) return BODY_STATES.OCCUPIED;
  if (has(text, /displac|body transfer|separated from (?:the )?body/)) return BODY_STATES.DISPLACED;
  if (has(text, /preserv|suspend|sealed body/)) return BODY_STATES.PRESERVED;
  if (has(text, /no body|body absent|bodiless/)) return BODY_STATES.ABSENT;
  if (record.life === 'dead' || character.status?.life === 'dead' || has(text, /dead|deceased|corpse/)) return BODY_STATES.DECEASED;
  if (record.life === 'alive' || character.status?.life === 'alive' || has(text, /living body|alive/)) return BODY_STATES.LIVING;
  return BODY_STATES.UNKNOWN;
};

export const deriveIdentityStateCode = (record = {}, character = {}) => {
  if (IDENTITY_STATE_VALUES.includes(record.identityStateCode)) return record.identityStateCode;
  const text = textForState(record, character);
  if (has(text, /composite|merged identit|multiple identit|shared identit/)) return IDENTITY_STATES.COMPOSITE;
  if (has(text, /possess|occupying|inhabit|taking over/)) return IDENTITY_STATES.POSSESSING;
  if (has(text, /transfer|reborn|migration|migrat|displac/)) return IDENTITY_STATES.TRANSFERRED;
  if (has(text, /own body|self identity|active in own body/) || deriveBodyStateCode(record, character) === BODY_STATES.LIVING) return IDENTITY_STATES.SELF;
  return IDENTITY_STATES.UNRESOLVED;
};

export const deriveConsciousnessStateCode = (record = {}, character = {}) => {
  if (CONSCIOUSNESS_STATE_VALUES.includes(record.consciousnessStateCode)) return record.consciousnessStateCode;
  const text = normalizeLookupKey([record.consciousnessState, record.operationalState].filter(Boolean).join(' '));
  if (has(text, /suppress|submerged|overridden/)) return CONSCIOUSNESS_STATES.SUPPRESSED;
  if (has(text, /unconscious|comatose|coma|asleep/)) return CONSCIOUSNESS_STATES.UNCONSCIOUS;
  if (has(text, /displac|transfer|migrat/)) return CONSCIOUSNESS_STATES.DISPLACED;
  if (has(text, /active|conscious|own body|awake/)) return CONSCIOUSNESS_STATES.ACTIVE;
  if (has(text, /absent|no consciousness/) || record.life === 'dead' || character.status?.life === 'dead') return CONSCIOUSNESS_STATES.ABSENT;
  return CONSCIOUSNESS_STATES.UNKNOWN;
};

export const deriveLoyaltyStateCode = (record = {}, character = {}) => {
  if (LOYALTY_STATE_VALUES.includes(record.loyaltyStateCode)) return record.loyaltyStateCode;
  const text = normalizeLookupKey(record.allegianceState);
  if (has(text, /conflict|divided|competing|double agent|uncertain allegiance/)) return LOYALTY_STATES.CONFLICTED;
  if (has(text, /covert|secret|infiltrat|decept|hidden allegiance/)) return LOYALTY_STATES.COVERT;
  if (has(text, /contract|assignment|order|duty|reporting|command/)) return LOYALTY_STATES.CONTRACTUAL;
  if (has(text, /operative|acting for|works for|working for|demonstrated support/)) return LOYALTY_STATES.OPERATIVE;
  if (has(text, /independent|self directed|unaffiliated/)) return LOYALTY_STATES.INDEPENDENT;
  if (has(text, /declared|allegiance|affiliation/) || (character.affiliations || []).length) return LOYALTY_STATES.DECLARED;
  return LOYALTY_STATES.UNKNOWN;
};

const roleKindRules = Object.freeze([
  [OFFICIAL_ROLE_KINDS.SOVEREIGN, ['king']],
  [OFFICIAL_ROLE_KINDS.CANDIDATE, ['prince']],
  [OFFICIAL_ROLE_KINDS.HOUSEHOLD, ['queen', 'royal-parent']],
  [OFFICIAL_ROLE_KINDS.INSTITUTIONAL, ['justice-official', 'official', 'administrator']],
  [OFFICIAL_ROLE_KINDS.MILITARY, ['military', 'soldier', 'benjamin-soldier']],
  [OFFICIAL_ROLE_KINDS.SECURITY, ['bodyguard', 'guard', 'security']],
  [OFFICIAL_ROLE_KINDS.CRIMINAL, ['mafia-boss', 'mafia-underboss', 'mafia-member', 'mafia-benefactor', 'phantom-troupe-member']],
  [OFFICIAL_ROLE_KINDS.ASSOCIATION, ['hunter', 'zodiac']],
  [OFFICIAL_ROLE_KINDS.SUPPORT, ['royal-servant', 'servant', 'support']],
  [OFFICIAL_ROLE_KINDS.INDEPENDENT, ['independent']],
]);

export const deriveOfficialRoleKind = (roles = []) => {
  const normalized = (roles || []).map(normalizeRoleToken);
  return roleKindRules.find(([, candidates]) => candidates.some((role) => normalized.includes(role)))?.[0]
    || OFFICIAL_ROLE_KINDS.UNCLASSIFIED;
};

export const normalizeCharacterStateRecord = (record = {}, character = {}) => Object.freeze({
  ...record,
  bodyStateCode: deriveBodyStateCode(record, character),
  identityStateCode: deriveIdentityStateCode(record, character),
  consciousnessStateCode: deriveConsciousnessStateCode(record, character),
  loyaltyStateCode: deriveLoyaltyStateCode(record, character),
});

export const normalizeCharacterEntity = (character) => Object.freeze({
  ...character,
  aliases: normalizeAliasList(character.name, character.aliases),
  roles: freezeArray(unique((character.roles || []).map(normalizeRoleToken))),
  affiliations: freezeArray((character.affiliations || []).map((affiliation) => Object.freeze({
    ...affiliation,
    role: normalizeRoleToken(affiliation.role),
    status: normalizeRoleToken(affiliation.status || 'active'),
  }))),
});

export const normalizeInformationConsistencyData = (data) => {
  const characters = Object.freeze((data.characters || []).map(normalizeCharacterEntity));
  const characterById = new Map(characters.map((character) => [character.id, character]));
  const characterStateProfiles = Object.freeze(Object.fromEntries(
    Object.entries(data.characterStateProfiles || {}).map(([characterId, records]) => [
      characterId,
      freezeArray((records || []).map((record) => normalizeCharacterStateRecord(record, characterById.get(characterId)))),
    ]),
  ));

  return Object.freeze({
    ...data,
    characters,
    characterStateProfiles,
    informationConsistencyVersion: 'phase-3-v1',
  });
};

const rangesOverlap = (left = {}, right = {}) => {
  const leftEnd = left.end ?? Number.POSITIVE_INFINITY;
  const rightEnd = right.end ?? Number.POSITIVE_INFINITY;
  return Number(left.start) <= Number(rightEnd) && Number(right.start) <= Number(leftEnd);
};

const stateTuple = (record) => [
  record.life || 'unknown',
  record.bodyStateCode || BODY_STATES.UNKNOWN,
  record.identityStateCode || IDENTITY_STATES.UNRESOLVED,
  record.consciousnessStateCode || CONSCIOUSNESS_STATES.UNKNOWN,
  record.loyaltyStateCode || LOYALTY_STATES.UNKNOWN,
].join('|');

export const getImpossibleStateReasons = (record = {}) => {
  const reasons = [];
  if (record.life === 'dead' && record.bodyStateCode === BODY_STATES.LIVING) {
    reasons.push('dead life state cannot use a living body state');
  }
  if (record.bodyStateCode === BODY_STATES.DECEASED
    && record.identityStateCode === IDENTITY_STATES.SELF
    && record.consciousnessStateCode === CONSCIOUSNESS_STATES.ACTIVE) {
    reasons.push('a deceased body cannot contain an active self identity without an explicit exceptional state');
  }
  if (record.identityStateCode === IDENTITY_STATES.POSSESSING
    && record.bodyStateCode !== BODY_STATES.OCCUPIED) {
    reasons.push('a possessing identity requires an occupied body state');
  }
  if (record.life === 'alive'
    && record.bodyStateCode === BODY_STATES.DECEASED
    && record.identityStateCode === IDENTITY_STATES.SELF) {
    reasons.push('an alive self identity cannot use a deceased body state');
  }
  if (record.life === 'alive'
    && record.bodyStateCode === BODY_STATES.LIVING
    && record.consciousnessStateCode === CONSCIOUSNESS_STATES.ABSENT
    && record.identityStateCode === IDENTITY_STATES.SELF) {
    reasons.push('an alive self identity in a living body cannot have absent consciousness');
  }
  return freezeArray(reasons);
};

export const validateInformationConsistencyData = (data) => {
  const errors = [];
  const warnings = [];
  const characters = data.characters || [];
  const characterById = new Map(characters.map((character) => [character.id, character]));
  const aliasOwners = new Map();

  for (const character of characters) {
    const canonical = normalizeLookupKey(character.name);
    const local = new Set([canonical]);
    for (const alias of character.aliases || []) {
      const key = normalizeLookupKey(alias);
      if (!key) {
        errors.push(`${character.id} contains an empty normalized alias`);
        continue;
      }
      if (local.has(key)) errors.push(`${character.id} repeats alias ${alias}`);
      local.add(key);
      const owners = aliasOwners.get(key) || [];
      owners.push(character.id);
      aliasOwners.set(key, owners);
    }
  }

  for (const [key, owners] of aliasOwners) {
    const uniqueOwners = unique(owners);
    if (uniqueOwners.length > 1) warnings.push(`alias ${key} resolves to multiple characters: ${uniqueOwners.join(', ')}`);
  }

  for (const [characterId, records] of Object.entries(data.characterStateProfiles || {})) {
    const character = characterById.get(characterId);
    if (!character) {
      errors.push(`characterStateProfiles references missing character ${characterId}`);
      continue;
    }
    const sorted = [...(records || [])].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id));
    sorted.forEach((record, index) => {
      if (!LIFE_STATUSES.includes(record.life)) errors.push(`${record.id}.life is not registered`);
      if (!BODY_STATE_VALUES.includes(record.bodyStateCode)) errors.push(`${record.id}.bodyStateCode is not registered`);
      if (!IDENTITY_STATE_VALUES.includes(record.identityStateCode)) errors.push(`${record.id}.identityStateCode is not registered`);
      if (!CONSCIOUSNESS_STATE_VALUES.includes(record.consciousnessStateCode)) errors.push(`${record.id}.consciousnessStateCode is not registered`);
      if (!LOYALTY_STATE_VALUES.includes(record.loyaltyStateCode)) errors.push(`${record.id}.loyaltyStateCode is not registered`);
      for (const reason of getImpossibleStateReasons(record)) errors.push(`${record.id}: ${reason}`);
      const next = sorted[index + 1];
      if (next && rangesOverlap(record.chapterRange, next.chapterRange) && stateTuple(record) !== stateTuple(next)) {
        errors.push(`${record.id} conflicts with overlapping state record ${next.id}`);
      }
    });
  }

  for (const character of characters) {
    if (!OFFICIAL_ROLE_KIND_VALUES.includes(deriveOfficialRoleKind(character.roles))) {
      errors.push(`${character.id} could not resolve a registered official role kind`);
    }
    for (const affiliation of character.affiliations || []) {
      const organization = (data.organizations || []).find((record) => record.id === affiliation.organizationId);
      if (!organization) errors.push(`${character.id} affiliation references missing organization ${affiliation.organizationId}`);
    }
  }

  return Object.freeze({
    valid: errors.length === 0,
    errors: freezeArray(errors),
    warnings: freezeArray(warnings),
    stats: Object.freeze({
      characters: characters.length,
      explicitStateCharacters: Object.keys(data.characterStateProfiles || {}).length,
      aliasKeys: aliasOwners.size,
      aliasCollisionCount: warnings.filter((warning) => warning.startsWith('alias ')).length,
    }),
  });
};

const includesChapter = (range = {}, chapter) => {
  const end = range.end ?? Number.POSITIVE_INFINITY;
  return chapter >= range.start && chapter <= end;
};

const entitySummary = (entity) => entity ? Object.freeze({ id: entity.id, name: entity.name, entityType: entity.entityType }) : null;

const buildAliasIndex = (entities) => {
  const index = new Map();
  for (const entity of entities) {
    for (const label of [entity.name, ...(entity.aliases || [])]) {
      const key = normalizeLookupKey(label);
      if (!key) continue;
      const current = index.get(key) || [];
      current.push(entity);
      index.set(key, current);
    }
  }
  return index;
};

export const createInformationConsistencySelectors = ({ data, archive, characterStates }) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const characters = archive.getEntitiesByType('character');
  const aliasIndex = buildAliasIndex(characters);

  const getCanonicalCharacterState = (characterId, chapter = latestChapter) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const raw = characterStates.getCharacterStateAtChapter(characterId, chapter);
    if (!raw) return null;
    const normalized = normalizeCharacterStateRecord(raw, character);
    return Object.freeze({
      ...normalized,
      body: Object.freeze({ code: normalized.bodyStateCode, label: titleCase(normalized.bodyStateCode), description: normalized.bodyState || 'No body-state description is published.' }),
      identity: Object.freeze({ code: normalized.identityStateCode, label: titleCase(normalized.identityStateCode), description: normalized.identityState || 'Identity is derived from the body and consciousness record.' }),
      consciousness: Object.freeze({ code: normalized.consciousnessStateCode, label: titleCase(normalized.consciousnessStateCode), description: normalized.consciousnessState || 'No consciousness-state description is published.' }),
      loyalty: Object.freeze({ code: normalized.loyaltyStateCode, label: titleCase(normalized.loyaltyStateCode), description: normalized.allegianceState || 'No operational-alignment description is published.' }),
      impossibleStateReasons: getImpossibleStateReasons(normalized),
    });
  };

  const getCharacterAuthorityProfile = (characterId, chapter = latestChapter) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const roleProfile = characterStates.getCharacterRoleProfile(characterId, chapter);
    const affiliations = characterStates.getCharacterAffiliationsAtChapter(characterId, chapter);
    const officialRoles = freezeArray((character.roles || []).map((role) => Object.freeze({
      id: role,
      label: titleCase(role),
      kind: deriveOfficialRoleKind([role]),
    })));
    const authoritySources = freezeArray([
      ...affiliations.map((affiliation) => Object.freeze({
        type: 'affiliation',
        organization: entitySummary(archive.getEntityById(affiliation.organizationId)),
        role: affiliation.role,
        status: affiliation.status,
        certainty: affiliation.certainty || 'confirmed',
      })),
      ...((archive.getAssignmentsForPerson(characterId) || [])
        .filter((assignment) => includesChapter(assignment.chapterRange, Number(chapter)))
        .map((assignment) => Object.freeze({
          type: 'assignment',
          assignment: entitySummary(assignment),
          principal: entitySummary(archive.getEntityById(assignment.principalEntityId)),
          reportingTo: entitySummary(archive.getEntityById(assignment.reportingEntityId)),
          status: assignment.status,
          certainty: assignment.certainty || 'confirmed',
        }))),
    ]);
    return Object.freeze({
      character: entitySummary(character),
      chapter: Number(chapter),
      officialRoleKind: deriveOfficialRoleKind(character.roles),
      officialRoles,
      mandate: roleProfile?.mandate || 'No formal mandate is published.',
      authority: roleProfile?.authority || 'No formal authority is published.',
      authoritySources,
      note: 'Official role and legal authority are recorded separately from operational loyalty.',
    });
  };

  const getCharacterLoyaltyProfile = (characterId, chapter = latestChapter) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character') return null;
    const state = getCanonicalCharacterState(characterId, chapter);
    const affiliations = characterStates.getCharacterAffiliationsAtChapter(characterId, chapter);
    const assignments = (archive.getAssignmentsForPerson(characterId) || [])
      .filter((assignment) => includesChapter(assignment.chapterRange, Number(chapter)));
    const declaredAffiliations = freezeArray(affiliations.map((affiliation) => Object.freeze({
      organization: entitySummary(archive.getEntityById(affiliation.organizationId)),
      role: affiliation.role,
      status: affiliation.status,
      certainty: affiliation.certainty || 'confirmed',
      evidenceBasis: affiliation.derivedFrom || 'canonical-affiliation',
    })));
    const operationalAlignments = freezeArray(assignments.map((assignment) => {
      const targetId = assignment.allegianceEntityId || assignment.principalEntityId || assignment.reportingEntityId;
      return Object.freeze({
        assignment: entitySummary(assignment),
        alignedWith: entitySummary(archive.getEntityById(targetId)),
        assignmentType: assignment.assignmentType,
        secrecy: assignment.secrecy,
        status: assignment.status,
        certainty: assignment.certainty || 'confirmed',
      });
    }));
    const alignmentIds = unique(operationalAlignments.map((alignment) => alignment.alignedWith?.id));
    const evidenceCode = state?.loyaltyStateCode || (operationalAlignments.length ? LOYALTY_STATES.CONTRACTUAL : declaredAffiliations.length ? LOYALTY_STATES.DECLARED : LOYALTY_STATES.UNKNOWN);
    return Object.freeze({
      character: entitySummary(character),
      chapter: Number(chapter),
      evidenceCode,
      evidenceLabel: titleCase(evidenceCode),
      declaredAffiliations,
      operationalAlignments,
      conflicted: evidenceCode === LOYALTY_STATES.CONFLICTED || alignmentIds.length > 1,
      privateIntent: 'not inferred',
      note: 'This profile records declarations, contracts, and demonstrated operations. It does not claim access to private intent.',
    });
  };

  const getAliasResolution = (query) => {
    const key = normalizeLookupKey(query);
    const matches = freezeArray(aliasIndex.get(key) || []);
    return Object.freeze({
      query: String(query || ''),
      key,
      status: matches.length === 1 ? 'resolved' : matches.length > 1 ? 'ambiguous' : 'unresolved',
      matches,
      entity: matches.length === 1 ? matches[0] : null,
    });
  };

  const queens = characters.filter((character) => (character.roles || []).includes('queen'));
  const queenAliasIndex = buildAliasIndex(queens.map((queen) => Object.freeze({
    ...queen,
    aliases: freezeArray([...(queen.aliases || []), queen.name.replace(/ Hui Guo Rou$/i, '')]),
  })));

  const resolveRoyalMother = (value) => {
    const key = normalizeLookupKey(value);
    if (!key) return null;
    const direct = queenAliasIndex.get(key) || [];
    if (direct.length === 1) return direct[0];
    const partial = queens.filter((queen) => {
      const queenKey = normalizeLookupKey(queen.name.replace(/ Hui Guo Rou$/i, ''));
      return queenKey.includes(key) || key.includes(queenKey);
    });
    return partial.length === 1 ? partial[0] : null;
  };

  const getRoyalDossierConsistencyProfile = (characterId, chapter = latestChapter) => {
    const character = archive.getEntityById(characterId);
    if (!character || character.entityType !== 'character' || !(character.roles || []).some((role) => ['prince', 'queen'].includes(role))) return null;
    const state = getCanonicalCharacterState(characterId, chapter);
    const authority = getCharacterAuthorityProfile(characterId, chapter);
    const loyalty = getCharacterLoyaltyProfile(characterId, chapter);
    const assignments = archive.getAssignmentSnapshot(characterId, chapter);
    const relationships = archive.getRelationshipSnapshot(characterId, chapter);
    const abilities = archive.getAbilitiesForOwner(characterId) || [];
    const beast = archive.getEntitiesByType('guardian-beast').find((record) => record.hostCharacterId === characterId) || null;
    const sources = archive.getSourcesForEntity(characterId) || [];
    const locationRecord = archive.getCurrentLocationRecordForCharacter(characterId, chapter);
    const isPrince = (character.roles || []).includes('prince');
    const household = isPrince
      ? resolveRoyalMother(character.royalMother)
      : Object.freeze({ children: characters.filter((record) => record.royalMother && resolveRoyalMother(record.royalMother)?.id === characterId) });
    const assignmentCount = assignments?.assignments?.length || 0;
    const relationshipCount = relationships?.relationships?.length || 0;
    const sections = Object.freeze({
      identity: Object.freeze({ present: Boolean(character.name), value: entitySummary(character) }),
      successionStatus: Object.freeze({ present: Boolean(state?.life), value: state?.life || 'unknown' }),
      household: Object.freeze({ present: Boolean(isPrince ? household : household?.children), value: isPrince ? entitySummary(household) : freezeArray(household?.children || []) }),
      officialAuthority: Object.freeze({ present: Boolean(authority?.officialRoles.length), value: authority }),
      operationalLoyalty: Object.freeze({ present: Boolean(loyalty), value: loyalty }),
      embodiedState: Object.freeze({ present: Boolean(state), value: state }),
      location: Object.freeze({ present: Boolean(locationRecord?.locationId || state?.locationId), value: entitySummary(archive.getEntityById(locationRecord?.locationId || state?.locationId)) }),
      assignments: Object.freeze({ present: Boolean(assignments), value: assignmentCount }),
      relationships: Object.freeze({ present: Boolean(relationships), value: relationshipCount }),
      nenAndGuardian: Object.freeze({ present: Boolean(abilities.length || beast || character.nen), value: Object.freeze({ abilities: freezeArray(abilities), guardianBeast: entitySummary(beast) }) }),
      evidence: Object.freeze({ present: sources.length > 0, value: freezeArray(sources) }),
      openQuestions: Object.freeze({ present: Array.isArray(state?.openQuestions), value: freezeArray(state?.openQuestions || []) }),
    });
    const missing = Object.entries(sections).filter(([, section]) => !section.present).map(([id]) => id);
    return Object.freeze({
      character: entitySummary(character),
      chapter: Number(chapter),
      royalRole: isPrince ? 'prince' : 'queen',
      sections,
      completeness: Object.freeze({
        present: Object.keys(sections).length - missing.length,
        total: Object.keys(sections).length,
        missing: freezeArray(missing),
        complete: missing.length === 0,
      }),
    });
  };

  const getInformationConsistencyReport = () => {
    const validation = validateInformationConsistencyData(data);
    const aliasCollisions = [...aliasIndex.entries()]
      .filter(([, values]) => unique(values.map((entity) => entity.id)).length > 1)
      .map(([key, values]) => Object.freeze({ key, entityIds: freezeArray(unique(values.map((entity) => entity.id))) }));
    const royalProfiles = characters
      .filter((character) => (character.roles || []).some((role) => ['prince', 'queen'].includes(role)))
      .map((character) => getRoyalDossierConsistencyProfile(character.id, latestChapter));
    const impossibleStates = characters.map((character) => {
      const state = getCanonicalCharacterState(character.id, latestChapter);
      return state?.impossibleStateReasons.length ? Object.freeze({ characterId: character.id, reasons: state.impossibleStateReasons }) : null;
    }).filter(Boolean);
    const unresolvedRoyalMothers = characters
      .filter((character) => (character.roles || []).includes('prince') && character.royalMother && !resolveRoyalMother(character.royalMother))
      .map((character) => Object.freeze({ characterId: character.id, royalMother: character.royalMother }));
    const crossLinkErrors = [];
    for (const character of characters) {
      for (const affiliation of character.affiliations || []) {
        if (!archive.getEntityById(affiliation.organizationId)) crossLinkErrors.push(`${character.id} -> ${affiliation.organizationId}`);
      }
    }
    return Object.freeze({
      version: data.informationConsistencyVersion || 'unversioned',
      chapter: latestChapter,
      validation,
      aliasCollisions: freezeArray(aliasCollisions),
      impossibleStates: freezeArray(impossibleStates),
      unresolvedRoyalMothers: freezeArray(unresolvedRoyalMothers),
      crossLinkErrors: freezeArray(crossLinkErrors),
      royalProfiles: freezeArray(royalProfiles),
      incompleteRoyalProfiles: freezeArray(royalProfiles.filter((profile) => !profile.completeness.complete)),
      officialRoleProfiles: characters.length,
      loyaltyProfiles: characters.length,
      hardErrorCount: validation.errors.length + impossibleStates.length + crossLinkErrors.length,
    });
  };

  return Object.freeze({
    getCanonicalCharacterState,
    getCharacterAuthorityProfile,
    getCharacterLoyaltyProfile,
    getRoyalDossierConsistencyProfile,
    getAliasResolution,
    getInformationConsistencyReport,
  });
};
