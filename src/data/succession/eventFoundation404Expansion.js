import { succession404TimelineEvents } from '../succession404Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-404';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterAliases = freeze({ Shimanu: 'character:shimano' });
const characterId = (name) => characterAliases[name] || `character:${slugify(name)}`;
const room = (number) => `location:black-whale:tier-1:room-${1000 + Number(number)}`;
const clinic = 'location:black-whale:tier-3:central-medical-clinic';
const square = 'location:black-whale:tier-3:central-stairwell-square';
const justice = 'location:black-whale:tier-2:justice-bureau';

const locations = freeze({
  '404-kurapika-mostly-supports-ten-day-coin-change': [room(3)],
  '404-tenftory-distributed-coin-reverse-design-differs': [room(3)],
  '404-zhang-lei-offers-kurapika-ten-coin': [room(3)],
  '404-kurapika-coin-changes-ten-to-one-and-holder-design': [room(3)],
  '404-returned-coin-design-resets-number-stays-one': [room(3)],
  '404-zhang-lei-limits-coin-discussion-before-coventoba': [room(3)],
  '404-kurapika-proposes-cumulative-conjuration-coin-system': [room(3)],
  '404-kurapika-projects-coin-growth-and-aura-node-opening': [room(3)],
  '404-kurapika-withholds-pseudo-coercive-loyalty-theory': [room(3)],
  '404-kurapika-deduces-two-ten-coins-and-coventoba-hidden-coin': [room(3)],
  '404-zhang-lei-gives-todays-coin-to-kurapika': [room(3)],
  '404-zhang-lei-kurapika-unequal-safety-information-exchange': [room(3)],
  '404-kurapika-mafia-balance-martial-law-risk-analysis': [room(3)],
  '404-kurapika-false-flag-and-room-safety-dilemma': [room(3), room(14)],
  '404-cheadle-team-receives-halkenburg-medical-case': [clinic],
  '404-halkenburg-plans-coma-autopsy-cover-from-balsamilco-body': [clinic],
  '404-possessed-balsamilco-tells-benjamin-twelve-hour-completion': [clinic, room(1)],
  '404-royal-military-medical-teams-displace-cheadle': [clinic],
  '404-tserriednich-below-three-point-five-zetsu-aura-ball': [room(4)],
  '404-prince-montage-fugetsu-sleeps-kacho-form-fades': [room(1), room(2), room(3), room(4), room(5), room(6), room(13), justice],
  '404-kurapika-schedules-second-nen-class-thursday-nine': [room(14)],
  '404-room1014-analyzes-sarahell-have-not-risk': [room(14)],
  '404-kurapika-bill-shimanu-tighten-woble-protection': [room(14)],
  '404-early-thursday-halkenburg-original-body-dies': [clinic],
  '404-benjamin-authorizes-noon-funeral-route-and-drops-charges': [room(1), clinic],
  '404-post-death-halkenburg-still-controls-balsamilco-body': [room(1)],
  '404-tier3-announces-halkenburg-death-and-noon-sendoff': [square],
  '404-troupe-hears-announcement-nobunaga-seeks-family-intelligence': ['location:black-whale:tier-3'],
});

const coinEventIds = new Set(succession404TimelineEvents.slice(0, 11).map((record) => record.id));
const grimmelEventIds = new Set([
  '404-halkenburg-plans-coma-autopsy-cover-from-balsamilco-body',
  '404-shikaku-sumidori-one-awake-priority-result',
  '404-halkenburg-explains-random-forced-mind-swap',
  '404-vict-test-opposite-body-death-priority',
  '404-halkenburg-plans-sleeping-pill-ten-hour-balsamilco-window',
  '404-early-thursday-halkenburg-original-body-dies',
  '404-post-death-halkenburg-still-controls-balsamilco-body',
]);
const abilityIds = (record) => freeze([
  ...(coinEventIds.has(record.id) ? ['ability:zhang-lei-coins'] : []),
  ...(grimmelEventIds.has(record.id) ? ['ability:halkenburg-possession-arrow'] : []),
  ...(record.id === '404-prince-montage-fugetsu-sleeps-kacho-form-fades' ? ['ability:fugetsu-unidentified-hostile-spirit-affliction', 'ability:without-you'] : []),
  ...(record.id === '404-room1014-analyzes-sarahell-have-not-risk' ? ['ability:have-not-curse'] : []),
]);

const organizations = freeze({
  '404-kurapika-mafia-balance-martial-law-risk-analysis': ['organization:xi-yu', 'organization:cha-r', 'organization:heil-ly', 'organization:kakin-military'],
  '404-kurapika-false-flag-and-room-safety-dilemma': ['organization:kakin-military'],
  '404-cheadle-team-receives-halkenburg-medical-case': ['organization:hunter-association', 'organization:zodiacs'],
  '404-possessed-balsamilco-tells-benjamin-twelve-hour-completion': ['organization:kakin-military'],
  '404-royal-military-medical-teams-displace-cheadle': ['organization:hunter-association', 'organization:zodiacs', 'organization:kakin-military'],
  '404-kurapika-schedules-second-nen-class-thursday-nine': ['organization:camilla-private-guard'],
  '404-room1014-analyzes-sarahell-have-not-risk': ['organization:camilla-private-guard'],
  '404-kurapika-bill-shimanu-tighten-woble-protection': ['organization:camilla-private-guard'],
  '404-benjamin-authorizes-noon-funeral-route-and-drops-charges': ['organization:kakin-military', 'organization:kakin-justice-bureau'],
  '404-tier3-announces-halkenburg-death-and-noon-sendoff': ['organization:kakin-military'],
  '404-troupe-hears-announcement-nobunaga-seeks-family-intelligence': ['organization:phantom-troupe', 'organization:xi-yu', 'organization:cha-r', 'organization:heil-ly'],
});

const openQuestions = freeze({
  '404-returned-coin-design-resets-number-stays-one': ['What complete rule separately controls a Guardian Coin’s holder design and displayed number?'],
  '404-kurapika-projects-coin-growth-and-aura-node-opening': ['Do mature coins actually grant Nen use, and is 10^64 a functional threshold?'],
  '404-kurapika-withholds-pseudo-coercive-loyalty-theory': ['Can the coins create pseudo-coercive loyalty to Zhang Lei?'],
  '404-kurapika-deduces-two-ten-coins-and-coventoba-hidden-coin': ['Does Coventoba still possess the first-day coin, and what state is it in?'],
  '404-halkenburg-plans-sleeping-pill-ten-hour-balsamilco-window': ['How long can Halkenburg actually remain awake in Balsamilco’s body after original-body death?'],
  '404-prince-montage-fugetsu-sleeps-kacho-form-fades': ['Why is Kacho-form fading, and will the change endanger Fugetsu?'],
  '404-room1014-analyzes-sarahell-have-not-risk': ['What will Sarahell attempt when the second Nen class begins?'],
  '404-troupe-hears-announcement-nobunaga-seeks-family-intelligence': ['What information does Nobunaga want from the established mafia families before attacking Heil-Ly?'],
});

const criticalIds = new Set([
  '404-kurapika-coin-changes-ten-to-one-and-holder-design',
  '404-returned-coin-design-resets-number-stays-one',
  '404-halkenburg-explains-random-forced-mind-swap',
  '404-vict-test-opposite-body-death-priority',
  '404-early-thursday-halkenburg-original-body-dies',
  '404-post-death-halkenburg-still-controls-balsamilco-body',
]);

export const eventFoundation404Expansion = freeze(succession404TimelineEvents.map((record, index) => {
  const slug = `chapter404-${record.id.replace(/^404-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-404',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 404, end: 404 }),
    chronology: freeze({
      sequence: index + 1,
      day: record.day,
      timeOfDay: record.time || null,
      storyPeriod: `Voyage Day ${record.day} · present-day Black Whale succession contest`,
      certainty: 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: freeze(organizations[record.id] || []),
    locationIds: freeze(locations[record.id] || []),
    abilityIds: abilityIds(record),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze(openQuestions[record.id] || []),
  });
}));
