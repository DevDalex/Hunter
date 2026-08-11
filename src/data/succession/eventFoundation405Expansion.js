import { succession405TimelineEvents } from '../succession405Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-405';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterAliases = freeze({ "Ken'i Wang": 'character:ken-i-wang' });
const characterId = (name) => characterAliases[name] || `character:${slugify(name)}`;

const casino = 'location:black-whale:tier-1:casino';
const casinoRestroom = 'location:black-whale:tier-1:casino:restroom';
const tier3 = 'location:black-whale:tier-3';
const tier5 = 'location:black-whale:tier-5';
const chaRRoute = 'location:black-whale:tier-5:cha-r-route';
const heilLy = 'location:black-whale:tier-2:heil-ly-hideout';
const processing = 'location:black-whale:tier-2:heil-ly-hideout:processing-area';

const locations = freeze({
  '405-hisoka-square3-seven-card-hand': [casino],
  '405-hisoka-hits-triple-sevens-and-leaves-prize': [casino],
  '405-hisoka-rejects-group-rumbling-prefers-one-on-one': ['location:black-whale:tier-1'],
  '405-fake-hisoka-bonolenov-spots-real-hisoka': [casino],
  '405-bonolenov-transforms-into-owl': [casinoRestroom],
  '405-metamorphorsen-contact-duration-rules': [casinoRestroom],
  '405-lynch-body-and-soul-exposes-bonolenov': [tier3],
  '405-zakuro-does-not-hear-inner-answer': [tier3],
  '405-bonolenov-knocks-out-zakuro-and-copies-him': [tier3],
  '405-zakuro-disguise-confirms-lynch-knows-fake': [tier3],
  '405-bonolenov-confirms-he-killed-lynch': [tier3],
  '405-bonolenov-uses-lynch-form-to-misdirect-zakuro': [tier3],
  '405-bonolenov-wants-phinks-team-to-handle-hisoka': ['location:black-whale:tier-1'],
  '405-bonolenov-describes-chrollo-grief-and-sought-ability': ['location:black-whale'],
  '405-bonolenov-number-nine-final-curtain-thought': ['location:black-whale'],
  '405-risnorth-moms-help-memorial-broadcast': ['location:black-whale'],
  '405-nobunaga-questions-current-heilly-continuity': [tier5],
  '405-keni-explains-morena-royal-blood-mafia-rule': [tier5],
  '405-nobunaga-compares-heilly-command-style-to-troupe': [tier5],
  '405-nobunaga-total-destruction-theory': [tier5],
  '405-phinks-feitan-kill-count-vow-theory': [tier5],
  '405-tajao-contrasts-established-mafia-balance': [tier5],
  '405-tajao-declares-char-xiyu-support-for-troupe': [chaRRoute],
  '405-keni-morena-joker-hidden-plan': [tier5],
  '405-morena-targets-upcoming-funeral-crowd': [heilLy],
  '405-dogman-level62-nen-scent-rules': [heilLy],
  '405-morena-green-light-beginning-of-end': [heilLy],
  '405-sodom-non-nen-kidnapping-condition': [heilLy],
  '405-voconte-asks-about-processing-team': [heilLy, processing],
  '405-tevelares-daemon-quorolle-mafia-hunt': [processing],
  '405-tajao-opens-final-route-door': [chaRRoute],
});

const organizations = freeze({
  '405-chrollo-assigns-bonolenov-hisoka-decoy': ['organization:phantom-troupe', 'organization:xi-yu', 'organization:cha-r'],
  '405-chrollo-predicts-real-hisoka-tier1-vip': ['organization:phantom-troupe'],
  '405-chrollo-orders-disguise-switch-and-wait': ['organization:phantom-troupe'],
  '405-bonolenov-wants-phinks-team-to-handle-hisoka': ['organization:phantom-troupe'],
  '405-bonolenov-describes-chrollo-grief-and-sought-ability': ['organization:phantom-troupe'],
  '405-bonolenov-number-nine-final-curtain-thought': ['organization:phantom-troupe'],
  '405-nobunaga-questions-current-heilly-continuity': ['organization:phantom-troupe', 'organization:cha-r', 'organization:heil-ly'],
  '405-keni-explains-morena-royal-blood-mafia-rule': ['organization:cha-r', 'organization:heil-ly'],
  '405-nobunaga-compares-heilly-command-style-to-troupe': ['organization:phantom-troupe', 'organization:heil-ly', 'organization:cha-r'],
  '405-nobunaga-total-destruction-theory': ['organization:phantom-troupe', 'organization:heil-ly', 'organization:cha-r'],
  '405-phinks-feitan-kill-count-vow-theory': ['organization:phantom-troupe', 'organization:heil-ly', 'organization:cha-r'],
  '405-tajao-contrasts-established-mafia-balance': ['organization:cha-r', 'organization:heil-ly'],
  '405-tajao-declares-char-xiyu-support-for-troupe': ['organization:phantom-troupe', 'organization:cha-r', 'organization:xi-yu', 'organization:heil-ly'],
  '405-keni-morena-joker-hidden-plan': ['organization:cha-r', 'organization:heil-ly'],
  '405-morena-targets-upcoming-funeral-crowd': ['organization:heil-ly'],
  '405-dogman-level62-nen-scent-rules': ['organization:heil-ly'],
  '405-morena-green-light-beginning-of-end': ['organization:heil-ly'],
  '405-sodom-non-nen-kidnapping-condition': ['organization:heil-ly'],
  '405-voconte-asks-about-processing-team': ['organization:heil-ly'],
  '405-tevelares-daemon-quorolle-mafia-hunt': ['organization:heil-ly'],
  '405-tajao-opens-final-route-door': ['organization:phantom-troupe', 'organization:cha-r'],
});

const abilityIds = (record) => freeze([
  ...(['405-bonolenov-transforms-into-owl', '405-metamorphorsen-contact-duration-rules', '405-bonolenov-knocks-out-zakuro-and-copies-him', '405-zakuro-disguise-confirms-lynch-knows-fake', '405-bonolenov-uses-lynch-form-to-misdirect-zakuro'].includes(record.id) ? ['ability:battle-cantabile-metamorphorsen'] : []),
  ...(['405-lynch-body-and-soul-exposes-bonolenov', '405-zakuro-does-not-hear-inner-answer'].includes(record.id) ? ['ability:body-and-soul'] : []),
  ...(record.id === '405-dogman-level62-nen-scent-rules' ? ['ability:dogman-nen-scent-identification'] : []),
  ...(record.id === '405-sodom-non-nen-kidnapping-condition' ? ['ability:sodom-non-nen-kidnapping'] : []),
]);

const criticalIds = new Set([
  '405-fake-hisoka-bonolenov-spots-real-hisoka',
  '405-metamorphorsen-contact-duration-rules',
  '405-lynch-body-and-soul-exposes-bonolenov',
  '405-bonolenov-confirms-he-killed-lynch',
  '405-keni-morena-joker-hidden-plan',
  '405-dogman-level62-nen-scent-rules',
  '405-sodom-non-nen-kidnapping-condition',
]);

const openQuestions = freeze({
  '405-chrollo-predicts-real-hisoka-tier1-vip': ['Which prince or upper-tier actor provided Hisoka’s Tier 1 VIP access?'],
  '405-metamorphorsen-contact-duration-rules': ['What exact effect does a much smaller transformed body have on duration?'],
  '405-bonolenov-describes-chrollo-grief-and-sought-ability': ['What ability is Chrollo seeking and why does he believe it is necessary for Hisoka?'],
  '405-bonolenov-number-nine-final-curtain-thought': ['Who previously held Spider position #9, and what exactly does the vacancy mean to Chrollo?'],
  '405-keni-morena-joker-hidden-plan': ['What is Ken’i’s exact concealed relationship to Morena?', 'What or who is the joker?'],
  '405-morena-targets-upcoming-funeral-crowd': ['Who is Dogman being sent to find?'],
  '405-sodom-non-nen-kidnapping-condition': ['What are the complete mechanics of Sodom’s kidnapping ability?'],
  '405-tajao-opens-final-route-door': ['What lies beyond the opened door?'],
});

export const eventFoundation405Expansion = freeze(succession405TimelineEvents.map((record, index) => {
  const slug = `chapter405-${record.id.replace(/^405-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-405',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 405, end: 405 }),
    chronology: freeze({
      sequence: index + 1,
      day: record.day,
      timeOfDay: record.time || null,
      storyPeriod: record.day === 10 ? 'Voyage Day 10 · retrospective sequence first explained in Chapter 405' : 'Voyage Day 12 · present-day Black Whale sequence before the announced funeral procession',
      certainty: record.day === 10 ? 'retrospective-relative-order-confirmed' : 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).filter((name) => name !== 'Owl').map(characterId)),
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
