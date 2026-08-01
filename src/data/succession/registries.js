export const ENTITY_TYPES = Object.freeze({
  CHARACTER: 'character',
  ORGANIZATION: 'organization',
  ABILITY: 'ability',
  GUARDIAN_BEAST: 'guardian-beast',
  LOCATION: 'location',
  LOCATION_HISTORY: 'location-history',
  EVENT: 'event',
  ASSIGNMENT: 'assignment',
  CHAPTER: 'chapter',
  RELATIONSHIP: 'relationship',
  SOURCE: 'source',
});

export const ENTITY_TYPE_VALUES = Object.freeze(Object.values(ENTITY_TYPES));

export const PUBLICATION_STATUSES = Object.freeze([
  'published',
  'draft',
  'hidden',
]);

export const CANON_LEVELS = Object.freeze({
  CANON: 'canon',
  INFERENCE: 'inference',
  THEORY: 'theory',
});

export const CANON_LEVEL_VALUES = Object.freeze(Object.values(CANON_LEVELS));

export const CERTAINTY_LEVELS = Object.freeze([
  'confirmed',
  'probable',
  'approximate',
  'unknown',
]);

export const LIFE_STATUSES = Object.freeze([
  'alive',
  'dead',
  'unknown',
]);

/* Phase 3 keeps body, identity, and consciousness separate. A character can
   have a deceased body, a displaced identity, and an unresolved consciousness
   state without those facts being flattened into one ambiguous sentence. */
export const BODY_STATES = Object.freeze({
  LIVING: 'living',
  DECEASED: 'deceased',
  OCCUPIED: 'occupied',
  DISPLACED: 'displaced',
  PRESERVED: 'preserved',
  ABSENT: 'absent',
  UNKNOWN: 'unknown',
});
export const BODY_STATE_VALUES = Object.freeze(Object.values(BODY_STATES));

export const IDENTITY_STATES = Object.freeze({
  SELF: 'self',
  TRANSFERRED: 'transferred',
  POSSESSING: 'possessing',
  COMPOSITE: 'composite',
  UNRESOLVED: 'unresolved',
});
export const IDENTITY_STATE_VALUES = Object.freeze(Object.values(IDENTITY_STATES));

export const CONSCIOUSNESS_STATES = Object.freeze({
  ACTIVE: 'active',
  UNCONSCIOUS: 'unconscious',
  SUPPRESSED: 'suppressed',
  DISPLACED: 'displaced',
  ABSENT: 'absent',
  UNKNOWN: 'unknown',
});
export const CONSCIOUSNESS_STATE_VALUES = Object.freeze(Object.values(CONSCIOUSNESS_STATES));

/* Loyalty is an evidence state, never a mind-reading claim. DECLARED records
   stated alignment, CONTRACTUAL records an assignment or formal obligation,
   OPERATIVE records demonstrated action, and COVERT / CONFLICTED preserve
   uncertainty where official position and observed conduct diverge. */
export const LOYALTY_STATES = Object.freeze({
  DECLARED: 'declared',
  CONTRACTUAL: 'contractual',
  OPERATIVE: 'operative',
  COVERT: 'covert',
  CONFLICTED: 'conflicted',
  INDEPENDENT: 'independent',
  UNKNOWN: 'unknown',
});
export const LOYALTY_STATE_VALUES = Object.freeze(Object.values(LOYALTY_STATES));

export const OFFICIAL_ROLE_KINDS = Object.freeze({
  SOVEREIGN: 'sovereign',
  CANDIDATE: 'candidate',
  HOUSEHOLD: 'household',
  INSTITUTIONAL: 'institutional',
  MILITARY: 'military',
  SECURITY: 'security',
  CRIMINAL: 'criminal',
  ASSOCIATION: 'association',
  SUPPORT: 'support',
  INDEPENDENT: 'independent',
  UNCLASSIFIED: 'unclassified',
});
export const OFFICIAL_ROLE_KIND_VALUES = Object.freeze(Object.values(OFFICIAL_ROLE_KINDS));

export const ORGANIZATION_STATUSES = Object.freeze([
  'active',
  'inactive',
  'disbanded',
  'unknown',
]);

export const EVENT_STATUSES = Object.freeze([
  'planned',
  'ongoing',
  'completed',
  'interrupted',
  'unknown',
]);

export const ASSIGNMENT_TYPES = Object.freeze([
  'protection',
  'service',
  'surveillance',
  'infiltration',
  'allied-reinforcement',
  'kurapika-placement',
  'transferred-protection',
  'assassination',
  'instruction',
  'custody',
  'unknown',
]);

export const ASSIGNMENT_STATUSES = Object.freeze([
  'active',
  'ended',
  'transferred',
  'unknown',
]);

export const ASSIGNMENT_SECRECY_LEVELS = Object.freeze([
  'public',
  'covert',
  'mixed',
  'unknown',
]);

export const LOCATION_TYPES = Object.freeze([
  'vessel',
  'tier',
  'district',
  'room',
  'corridor',
  'facility',
  'unknown',
]);

export const RELATIONSHIP_TYPES = Object.freeze([
  'family',
  'professional',
  'protective',
  'political',
  'alliance',
  'command',
  'deception',
  'rivalry',
  'hostile',
  'unknown',
]);

export const RELATIONSHIP_DIRECTIONS = Object.freeze([
  'directed',
  'bidirectional',
]);

export const RELATIONSHIP_SENTIMENTS = Object.freeze([
  'allied',
  'neutral',
  'hostile',
  'mixed',
  'unknown',
]);

export const NEN_TYPES = Object.freeze([
  'enhancement',
  'transmutation',
  'emission',
  'conjuration',
  'manipulation',
  'specialization',
  'unknown',
]);

export const SOURCE_TYPES = Object.freeze([
  'chapter',
  'volume',
  'author-comment',
  'reference',
]);

export const SUCCESSION_CHAPTER_RANGE = Object.freeze({
  start: 338,
  end: 9999,
});
