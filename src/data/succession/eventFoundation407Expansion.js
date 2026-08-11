import { succession407TimelineEvents } from '../succession407Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-407';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;

const tier3Funeral = 'location:black-whale:tier-3:funeral-procession-crowd';
const tier2Hideout = 'location:black-whale:tier-2:heil-ly-hideout';

const locationIds = (record) => freeze([
  ...(String(record.location || '').includes('Tier 3') || record.id === '407-halkenburg-funeral-continues-up-staircase' ? [tier3Funeral] : []),
  ...(String(record.location || '').includes('Tier 2') ? [tier2Hideout] : []),
]);

const organizationIds = (record) => freeze([
  ...(record.tracks?.includes('heil-ly') || record.tracks?.includes('morena') || record.tracks?.includes('negotiation-game') ? ['organization:heil-ly'] : []),
  ...(record.tracks?.includes('tserriednich') || record.tracks?.includes('soldiers') ? ['organization:kakin-royal-army'] : []),
]);

const criticalIds = new Set([
  '407-borksen-missing-last-contact-thirty-minutes',
  '407-borksen-wakes-tier2-heilly-hideout',
  '407-borksen-memory-gap-nen-possibility',
  '407-morena-offers-negotiation-game-retirement-cost',
  '407-parent-child-alternating-game-procedure',
  '407-child-cards-joker-x-and-x-exit-promise',
  '407-parent-cards-aim-power',
  '407-morena-promises-no-cheating-borksen-infers-interview',
  '407-parent-card-deal-recovery-small-request',
  '407-borksen-condition-accepted-game-begins',
]);

const openQuestions = freeze({
  '407-soldiers-infer-abduction-worst-case': ['How exactly was Borksen taken without a visible struggle?'],
  '407-otocin-nen-heilly-assassination-hypothesis': ['Was a Nen ability involved in Borksen’s capture?', 'What does Heil-Ly actually want from Borksen?'],
  '407-borksen-memory-gap-nen-possibility': ['Who abducted Borksen and what ability or method caused the memory gap?'],
  '407-morena-recruits-borksen-compatible-donor-analogy': ['Why specifically does Morena need Borksen?'],
  '407-parent-cards-aim-power': ['What will Morena reveal under Aim?', 'What ability will Morena explain under Power?'],
  '407-parent-cards-yes-no-question-scopes': ['What are the exact final-Yes and final-No consequences?'],
  '407-borksen-condition-accepted-game-begins': ['Which response card will ultimately decide Borksen’s negotiation?'],
});

export const eventFoundation407Expansion = freeze(succession407TimelineEvents.map((record, index) => {
  const slug = `chapter407-${record.id.replace(/^407-/, '')}`;
  return freeze({
    id: `event:${slug}`,
    entityType: 'event',
    slug,
    name: record.title,
    aliases: freeze([]),
    summary: record.detail,
    sourceIds: freeze([sourceId]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-11',
    updatedAt: '2026-08-11',
    category: record.tracks?.[0] || 'chapter-407',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 407, end: 407 }),
    chronology: freeze({
      sequence: index + 1,
      day: 'Voyage Day 12',
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 12 · Halkenburg funeral-security period / Borksen recruitment negotiation',
      certainty: 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: organizationIds(record),
    locationIds: locationIds(record),
    abilityIds: freeze([]),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze(openQuestions[record.id] || []),
  });
}));
