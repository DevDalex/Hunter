import { succession412TimelineEvents } from '../succession412Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-412';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const tier = (number) => `location:black-whale:tier-${number}`;

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = ['location:black-whale'];
  if (/Tier 1|Room 1014|Beyond detention/i.test(value)) ids.push(tier(1));
  return freeze([...new Set(ids)]);
};

const criticalIds = new Set([
  '412-kurapika-separates-fact-from-deduction',
  '412-chain-baseline-and-forced-yes-calibration',
  '412-oito-reveals-nephew-and-daughter-swap',
  '412-oito-explains-seed-urn-departure-split',
  '412-oito-says-neither-child-is-eligible',
  '412-chain-does-not-move-on-oito-explanation',
  '412-slakka-only-participant-not-returning',
  '412-kurapika-considers-speaking-with-beyond',
  '412-beyond-lawsuit-count-1047-all-dismissed',
  '412-saiyu-randomizes-documents-as-cleapatro-beyond-bicker',
]);

export const eventFoundation412Expansion = freeze(succession412TimelineEvents.map((record, index) => {
  const slug = `chapter412-${record.id.replace(/^412-/, '')}`;
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
    createdAt: '2026-08-13',
    updatedAt: '2026-08-13',
    category: record.tracks?.[0] || 'chapter-412',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 412, end: 412 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12 / forty-eight-hour flashback', timeOfDay: record.time || null, storyPeriod: 'Voyage Day 12 · five hours before Special Martial Law / forty-eight-hour flashback / 10:00 a.m. return / Beyond detention coda', certainty: 'chapter-presentation-order-confirmed-nonlinear-clock' }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: freeze([]),
    locationIds: locationIds(record),
    abilityIds: freeze([]),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze([]),
  });
}));
