import { succession410TimelineEvents } from '../succession410Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-410';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;

const blackWhale = 'location:black-whale';
const tier = (number) => `location:black-whale:tier-${number}`;
const intertierHideout = 'location:black-whale:intertier-2-3:heil-ly-hideout';
const room3101 = 'location:black-whale:tier-3:room-3101';
const justiceBureau = 'location:black-whale:tier-2:justice-bureau';

const locationIds = (record) => {
  const value = String(record.location || '');
  const ids = [];
  if (/between Tiers 2 and 3|inter-tier|Heil-Ly hideout/i.test(value)) ids.push(intertierHideout);
  if (/Room 3101/i.test(value)) ids.push(room3101, tier(3));
  if (/Tier 3/i.test(value)) ids.push(tier(3));
  if (/Justice Bureau/i.test(value)) ids.push(justiceBureau, tier(2));
  if (/Tier 1/i.test(value) || /First Prince/i.test(value)) ids.push(tier(1));
  if (/Tier 2/i.test(value)) ids.push(tier(2));
  if (/Black Whale|route|cross-bridge/i.test(value)) ids.push(blackWhale);
  return freeze([...new Set(ids)]);
};

const organizationIds = (record) => freeze([
  ...(record.tracks?.includes('heil-ly') ? ['organization:heil-ly'] : []),
]);

const abilityIds = (record) => freeze([
  ...(record.tracks?.includes('contagion') || record.tracks?.includes('negotiation-game') || (/Morena/i.test(record.detail || '') && record.tracks?.includes('nen')) ? ['ability:contagion'] : []),
]);

const criticalIds = new Set([
  '410-borksen-internally-resists-outwardly-confirms-yes',
  '410-morena-reconstructs-return-indent-mark',
  '410-cheating-triggers-automatic-manipulation-yes-no-only',
  '410-borksen-reaffirms-join-underlings-applaud-release',
  '410-installed-game-tracks-level-points-location-status',
  '410-borksen-level-zero-third-condition-incomplete',
  '410-murder-witness-would-formalize-level-one',
  '410-borksen-assumes-spyware-sees-hears-everything',
  '410-borksen-asks-tour-before-returning',
  '410-room3101-sealed-three-soldiers-vanished',
  '410-hidden-bathroom-route-room3101-volume-correction',
  '410-benjamin-calculates-nine-point-five-hour-operational-window',
  '410-benjamin-announces-three-branch-military-consolidation',
  '410-benjamin-alleges-biological-terrorism-by-tserriednich-halkenburg',
  '410-mizaistom-reads-hostage-leverage-and-half-truths',
  '410-forty-minutes-since-special-martial-law',
]);

const openQuestions = freeze({
  '410-borksen-internally-resists-outwardly-confirms-yes': ['How far does the automatic Manipulation constrain Borksen beyond the final answer?'],
  '410-installed-game-tracks-level-points-location-status': ['What exact ability name is revealed in the chapter text?', 'What precisely counts as clearing the installed game?'],
  '410-borksen-assumes-spyware-sees-hears-everything': ['Can Morena actually see or hear through Borksen, or only track level, points, location, and status?'],
  '410-murder-witness-would-formalize-level-one': ['When and how will Borksen complete the murder-presence condition?'],
  '410-borksen-asks-tour-before-returning': ['What is Borksen’s counter-strategy inside Heil-Ly?'],
  '410-room3101-sealed-three-soldiers-vanished': ['What ability or mechanism makes entrants vanish in Room 3101?'],
  '410-benjamin-calculates-nine-point-five-hour-operational-window': ['Can Benjamin complete his succession plan before incapacitation?'],
  '410-kaiser-suspects-benjamin-infection-and-retains-final-stronghold': ['What is Kaiser’s final stronghold?'],
});

export const eventFoundation410Expansion = freeze(succession410TimelineEvents.map((record, index) => {
  const slug = `chapter410-${record.id.replace(/^410-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-410',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 410, end: 410 }),
    chronology: freeze({
      sequence: index + 1,
      day: 'Voyage Day 12',
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 12 · Special Martial Law / Borksen Level 0 / Room 3101 Case S / Benjamin Justice Bureau confrontation',
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
