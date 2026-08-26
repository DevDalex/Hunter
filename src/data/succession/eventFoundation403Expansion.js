import { succession403TimelineEvents } from '../succession403Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-403';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;
const justice = 'location:black-whale:tier-2:justice-bureau';

const locationIdsByResearchId = freeze({
  '403-0645-balsamilco-arrives-justice-courthouse': [`${justice}:prosecution-courthouse:entrance`],
  '403-balsamilco-tsk17-courtroom-risk-plan': [`${justice}:prosecution-courthouse`],
  '403-vict-signals-halkenburg-secret-rumbling': [`${justice}:prosecution-courthouse:corridor`],
  '403-halkenburg-twelve-civilians-arrow-balsamilco': [`${justice}:prosecution-courthouse:corridor`, `${justice}:prosecution-courthouse`],
  '403-benjamin-trial-postponement-analysis': ['location:black-whale:tier-1:room-1001'],
  '403-benjamin-civilian-supporter-loyalty-deduction': ['location:black-whale:tier-1:room-1001'],
  '403-benjamin-balsamilco-manipulation-first-come-theory': ['location:black-whale:tier-1:room-1001'],
  '403-possessed-balsamilco-claims-arrow-missed': [`${justice}:prosecution-courthouse`, 'location:black-whale:tier-1:room-1001'],
  '403-benjamin-conditional-martial-law-balsamilco-mission': ['location:black-whale:tier-1:room-1001', justice],
  '403-0750-benjamin-butch-red-alert': ['location:black-whale:tier-1:room-1001'],
  '403-unma-confirms-halkenburg-son': ['location:black-whale:tier-1:room-01'],
  '403-benjamin-reads-kacho-unma-letter-dismisses-rumor': ['location:black-whale:tier-1:room-1001'],
  '403-kaiser-martial-law-risk-letter-audience': ['location:black-whale:tier-1:room-1001'],
  '403-letter-recipients-fugetsu-rest-luzurus-operation-scheduled': [justice, `${justice}:kaiser-office`, `${justice}:medical-wing`, 'location:black-whale:tier-1:room-1003', 'location:black-whale:tier-1:room-1002', 'location:black-whale:tier-1:room-1005', 'location:black-whale:tier-1:room-1006'],
  '403-kurapika-black-whale-urn-sees-hope': ['location:black-whale:tier-1:room-1014', 'location:black-whale'],
  '403-zhang-lei-coin-one-to-ten-experiment': ['location:black-whale:tier-1:room-1003'],
  '403-kaiser-steiner-mass-syncope-worio': [`${justice}:prosecution-courthouse`],
  '403-kaiser-worio-nen-disclosure-conditional-support': [`${justice}:room-e-6`],
  '403-worio-feather-mark-halkenburg-die-soon': [`${justice}:room-e-6`],
  '403-halkenburg-possesses-balsamilco-reports-mission-complete': [`${justice}:medical-wing`, 'location:black-whale:tier-1:room-1001'],
  '403-kurapika-oito-public-letter-nen-class-strategy': ['location:black-whale:tier-1:room-1014'],
  '403-kurapika-oito-arrive-room-1003': ['location:black-whale:tier-1:room-1003'],
});

const abilityIdsByResearchId = freeze({
  '403-halkenburg-twelve-civilians-arrow-balsamilco': ['ability:halkenburg-possession-arrow'],
  '403-benjamin-civilian-supporter-loyalty-deduction': ['ability:halkenburg-possession-arrow'],
  '403-benjamin-balsamilco-manipulation-first-come-theory': ['ability:halkenburg-possession-arrow'],
  '403-possessed-balsamilco-claims-arrow-missed': ['ability:halkenburg-possession-arrow'],
  '403-letter-recipients-fugetsu-rest-luzurus-operation-scheduled': ['ability:fugetsu-unidentified-hostile-spirit-affliction', 'ability:magical-worm'],
  '403-zhang-lei-coin-one-to-ten-experiment': ['ability:zhang-lei-coins'],
  '403-worio-feather-mark-halkenburg-die-soon': ['ability:halkenburg-possession-arrow'],
  '403-halkenburg-possesses-balsamilco-reports-mission-complete': ['ability:halkenburg-possession-arrow'],
});

const organizationIdsByResearchId = freeze({
  '403-0645-balsamilco-arrives-justice-courthouse': ['organization:kakin-justice-bureau', 'organization:kakin-military'],
  '403-balsamilco-tsk17-courtroom-risk-plan': ['organization:kakin-justice-bureau', 'organization:kakin-military'],
  '403-vict-signals-halkenburg-secret-rumbling': ['organization:kakin-justice-bureau', 'organization:kakin-military'],
  '403-halkenburg-twelve-civilians-arrow-balsamilco': ['organization:kakin-justice-bureau'],
  '403-0750-benjamin-butch-red-alert': ['organization:kakin-military'],
  '403-kaiser-martial-law-risk-letter-audience': ['organization:kakin-justice-bureau'],
  '403-letter-recipients-fugetsu-rest-luzurus-operation-scheduled': ['organization:kakin-justice-bureau'],
  '403-kaiser-steiner-mass-syncope-worio': ['organization:kakin-justice-bureau'],
  '403-kaiser-worio-nen-disclosure-conditional-support': ['organization:kakin-justice-bureau'],
  '403-worio-feather-mark-halkenburg-die-soon': ['organization:kakin-justice-bureau'],
  '403-halkenburg-possesses-balsamilco-reports-mission-complete': ['organization:kakin-justice-bureau', 'organization:kakin-military'],
});

const openQuestionsByResearchId = freeze({
  '403-vict-signals-halkenburg-secret-rumbling': ['What exactly happened to Vict, and why does he communicate only by military sign language?'],
  '403-halkenburg-twelve-civilians-arrow-balsamilco': ['What are Grimmel the Dissonance’s exact supporter threshold, range, and formal Nen classification?'],
  '403-benjamin-balsamilco-manipulation-first-come-theory': ['How does the collective possession effect interact with prior manipulation?'],
  '403-0750-benjamin-butch-red-alert': ['What event, if any, will cause Benjamin to actually declare Special Martial Law?'],
  '403-unma-confirms-halkenburg-son': ['Why was Halkenburg raised in Duazul’s household?'],
  '403-letter-recipients-fugetsu-rest-luzurus-operation-scheduled': ['Is Luzurus actually responsible for Fugetsu’s affliction?', 'Will Fugetsu recover enough strength for the planned operation?'],
  '403-kurapika-black-whale-urn-sees-hope': ['What opening does Kurapika see in the succession ritual?'],
  '403-zhang-lei-coin-one-to-ten-experiment': ['What causes a Guardian Coin to change from 1 to 10?'],
  '403-worio-feather-mark-halkenburg-die-soon': ['Why will Halkenburg’s original body die, and what happens to the transferred consciousness afterward?'],
  '403-halkenburg-possesses-balsamilco-reports-mission-complete': ['Where is Balsamilco’s original consciousness?'],
  '403-kurapika-oito-public-letter-nen-class-strategy': ['Who will respond to the threatened publication, and what does Oito’s letter contain?'],
});

export const eventFoundation403Expansion = freeze(succession403TimelineEvents.map((record, index) => {
  const slug = `chapter403-${record.id.replace(/^403-/, '')}`;
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
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    category: record.tracks?.[0] || 'chapter-403',
    importance: [3, 9, 10, 14, 15, 18, 19, 20].includes(index) ? 'critical' : 'major',
    chapterRange: freeze({ start: 403, end: 403 }),
    chronology: freeze({
      sequence: index + 1,
      day: 11,
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 11 · present-day Black Whale succession contest',
      certainty: 'chapter-presentation-order-confirmed',
    }),
    participantIds: freeze((record.people || []).map(characterId)),
    organizationIds: freeze(organizationIdsByResearchId[record.id] || []),
    locationIds: freeze(locationIdsByResearchId[record.id] || []),
    abilityIds: freeze(abilityIdsByResearchId[record.id] || []),
    causes: freeze([]),
    outcomes: freeze([record.confidence || 'Chapter-bounded event recorded from the supplied synopsis.']),
    consequenceEventIds: freeze([]),
    status: 'completed',
    stateChanges: freeze([]),
    openQuestions: freeze(openQuestionsByResearchId[record.id] || []),
  });
}));
