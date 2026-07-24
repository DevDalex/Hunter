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
