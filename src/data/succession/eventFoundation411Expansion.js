import { succession411TimelineEvents } from '../succession411Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-411';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const tier = (number) => `location:black-whale:tier-${number}`;

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = ['location:black-whale'];
  if (/Tier 1|Room 1014|VVIP|Room 302/i.test(value)) ids.push(tier(1));
  if (/Tier 2|Ministry of Justice|Kaiser office/i.test(value)) ids.push(tier(2));
  return freeze([...new Set(ids)]);
};

const criticalIds = new Set([
  '411-halkenburg-in-balsamilco-calls-benjamin-at-eight',
  '411-sarahell-continues-woble-curse-plan-and-exorcist-check',
  '411-eighteen-participants-gather-for-second-nen-round',
  '411-kurapika-suspects-halkenburg-assassination-without-proof',
  '411-kurapika-proposes-vow-limitation-model-for-contest',
  '411-kurapika-proposes-four-stage-kakin-ritual',
  '411-kurapika-says-multiple-survivor-failure-option-must-remain',
  '411-kurapika-declares-woble-ineligible-oito-awake',
]);

export const eventFoundation411Expansion = freeze(succession411TimelineEvents.map((record, index) => {
  const slug = `chapter411-${record.id.replace(/^411-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-411',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 411, end: 411 }),
    chronology: freeze({ sequence: index + 1, day: 'Voyage Day 12', timeOfDay: record.time || null, storyPeriod: 'Voyage Day 12 · 8:00 a.m. opening / second Nen lesson / Kurapika ritual theory', certainty: 'chapter-presentation-order-confirmed-nonlinear-clock' }),
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
