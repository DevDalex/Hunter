import { succession409TimelineEvents } from '../succession409Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-409';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;

const blackWhale = 'location:black-whale';
const intertierHideout = 'location:black-whale:intertier-2-3:heil-ly-hideout';
const intertierGate = 'location:black-whale:intertier-2-3:central-gate';
const tier = (number) => `location:black-whale:tier-${number}`;

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = [];
  if (/inter-tier|between Tiers 2 and 3|Heil-Ly negotiation room/i.test(value)) ids.push(intertierHideout);
  if (/central gate/i.test(value)) ids.push(intertierGate);
  for (const number of [1, 2, 3, 4, 5]) if (new RegExp(`Tier ${number} broadcast`, 'i').test(value)) ids.push(tier(number));
  if (/shipwide announcement/i.test(value) || /Black Whale · inter-tier/i.test(value)) ids.push(blackWhale);
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => freeze([
  ...(record.tracks?.includes('heil-ly') || record.tracks?.includes('organization-intelligence') ? ['organization:heil-ly'] : []),
]);

const abilityIds = (record) => freeze([
  ...(record.tracks?.includes('contagion') ? ['ability:contagion'] : []),
]);

const criticalIds = new Set([
  '409-tier3-kneel-wall-shoot-warning',
  '409-borksen-selects-deal',
  '409-three-heilly-joining-conditions',
  '409-kiss-condition-completed',
  '409-no-return-verified-untampered',
  '409-borksen-redraws-x',
  '409-question-a-eliminates-five-ordinary-tiers',
  '409-hideout-on-black-whale-nen-yes-and-no',
  '409-central-gate-rumble-intertier-location-confirmed',
  '409-five-hideout-doors-confirmed',
  '409-heilly-current-headcount-twenty-one',
  '409-heilly-nen-type-breakdown',
  '409-borksen-asks-morena-change-goal-four-times',
  '409-borksen-keeps-return-morena-gets-no',
  '409-borksen-intentionally-chooses-yes',
]);

const openQuestions = freeze({
  '409-three-heilly-joining-conditions': ['When, if ever, will Borksen satisfy the required murder-presence condition?'],
  '409-kiss-condition-completed': ['Does the completed kiss immediately change Borksen’s Nen state, or only satisfy one joining condition?'],
  '409-hideout-on-black-whale-nen-yes-and-no': ['How are the hideout’s physical and Nen-created components divided?'],
  '409-five-hideout-doors-confirmed': ['Where exactly do the five entrances connect?'],
  '409-borksen-intentionally-chooses-yes': ['Why does Borksen intentionally choose Yes after winning Return?', 'What Chapter 410 consequences follow the restored Yes response?'],
});

export const eventFoundation409Expansion = freeze(succession409TimelineEvents.map((record, index) => {
  const slug = `chapter409-${record.id.replace(/^409-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-409',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 409, end: 409 }),
    chronology: freeze({
      sequence: index + 1,
      day: 'Voyage Day 12',
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 12 · Special Martial Law / Morena–Borksen negotiation through intentional Yes response',
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
