import { succession408TimelineEvents } from '../succession408Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-408';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;

const tier2Hideout = 'location:black-whale:tier-2:heil-ly-hideout';
const blackWhale = 'location:black-whale';

const locationIds = (record) => freeze([
  ...(String(record.location || '').includes('Tier 2') ? [tier2Hideout] : []),
  ...(String(record.location || '').includes('shipwide') ? [blackWhale] : []),
]);

const organizationIds = (record) => freeze([
  ...(record.tracks?.includes('heil-ly') || record.tracks?.includes('contagion') ? ['organization:heil-ly'] : []),
  ...(record.tracks?.includes('kakin-military') ? ['organization:kakin-royal-army'] : []),
]);

const abilityIds = (record) => freeze([
  ...(record.tracks?.includes('contagion') ? ['ability:contagion'] : []),
]);

const criticalIds = new Set([
  '408-morena-states-kakin-humanity-destruction-goals',
  '408-morena-not-original-carnival-orphan',
  '408-carne-levare-lese-majeste-framework',
  '408-carnival-orphan-trafficking-flesh-classification',
  '408-borksen-critical-ability-role-why-withheld',
  '408-contagion-mother-twenty-two-children',
  '408-borksen-rejects-murder-destruction-resolves-escape',
  '408-borksen-specialist-unnamed-enhancer-detector',
  '408-specialist-rarity-fifty-sixty-floor-master',
  '408-morena-specialist-desired-borksen-ability-withheld',
  '408-orarge-shuffles-yes-revealed',
  '408-no-irrevocable-refusal-outsider-points',
  '408-x-voids-game-memory-retained-avoidance-promise',
  '408-vows-limitations-risk-strengthen-support-unity',
  '408-x-third-response-no-return-remain',
  '408-special-martial-law-declared',
]);

const openQuestions = freeze({
  '408-borksen-critical-ability-role-why-withheld': ['What exact ability and team role does Morena want Borksen to develop?'],
  '408-borksen-specialist-unnamed-enhancer-detector': ['Who is the unnamed Heil-Ly Enhancer who detects Nen categories by smell?'],
  '408-specialist-rarity-fifty-sixty-floor-master': ['Who is the unnamed Heavens Arena Floor Master encountered by the detector?'],
  '408-morena-specialist-desired-borksen-ability-withheld': ['What ability does Morena want Borksen to develop if she joins?'],
  '408-x-third-response-no-return-remain': ['Will No or Return determine Borksen’s final response?'],
  '408-special-martial-law-declared': ['Why was Special Martial Law declared?', 'How will the declaration affect the interrupted negotiation game?'],
});

export const eventFoundation408Expansion = freeze(succession408TimelineEvents.map((record, index) => {
  const slug = `chapter408-${record.id.replace(/^408-/, '')}`;
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
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    category: record.tracks?.[0] || 'chapter-408',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 408, end: 408 }),
    chronology: freeze({
      sequence: index + 1,
      day: 'Voyage Day 12',
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 12 · Tier 2 Morena/Borksen negotiation through Special Martial Law declaration',
      certainty: 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: organizationIds(record),
    locationIds: locationIds(record),
    abilityIds: abilityIds(record),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze(openQuestions[record.id] || []),
  });
}));
