import { succession406TimelineEvents } from '../succession406Research.js';

const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-406';
const slugify = (value = '') => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const characterId = (name) => `character:${slugify(name)}`;

const route405 = 'location:black-whale:tier-5:cha-r-route';
const outer = 'location:black-whale:outermost-pipe-stair-chamber';
const waste = 'location:black-whale:intertier-4-5:waste-processing-plant';
const heilLy = 'location:black-whale:tier-2:heil-ly-hideout';
const funeral = 'location:black-whale:tier-3:funeral-procession-crowd';
const lynchSite = 'location:black-whale:tier-3:lynch-body-recovery-site';

const locations = freeze({
  '406-tajao-interbuilding-corridor-sword-warning': [route405],
  '406-outer-pipe-chamber-revealed': [outer],
  '406-waste-network-two-hundred-thousand': [outer, waste],
  '406-char-xiyu-control-waste-processing': [waste],
  '406-nobunaga-subcontractor-oversight-theory': [waste],
  '406-heilly-waste-contractor-killing-pipeline-theory': [waste],
  '406-nobunaga-turns-back-to-investigate': [outer],
  '406-nobunaga-recaps-hideout-counteractive-defense': [outer, heilLy],
  '406-room-a-b-warp-recap': [outer, heilLy],
  '406-feitan-self-defense-bypass-theory': [outer],
  '406-biohazard-transmitter-reverts': [heilLy],
  '406-tier3-funeral-crowd-hinrigh-asks-for-lynch': [funeral],
  '406-lynch-body-recovered-funeral-patrol': [lynchSite],
  '406-lynch-neck-professionally-twisted-broken': [lynchSite],
  '406-hinrigh-initial-heilly-hitman-hypothesis': [lynchSite],
  '406-zakuro-recalls-post-encounter-lynch-behavior': [funeral],
  '406-hinrigh-proposes-fake-lynch-hypothesis': [funeral],
  '406-zakuro-remembers-definitely-hisoka-line': [funeral],
  '406-hinrigh-deduces-lynch-found-fake-hisoka': [funeral],
  '406-hinrigh-infers-culprit-seeks-hisoka': [funeral],
  '406-hinrigh-zakuro-vow-revenge': [funeral],
  '406-chrollo-phone-search-first-call': [funeral],
  '406-chrollo-considers-coordinate-and-condition-changes': [funeral],
  '406-chrollo-weighs-tier1-hisoka-risk': [funeral],
  '406-chrollo-identifies-three-sacred-treasures': [funeral],
  '406-chrollo-rules-out-tier3-and-below-for-regalia': [funeral],
  '406-chrollo-regalia-nen-system-theory': [funeral],
  '406-chrollo-tier1-regalia-storage-theory': [funeral],
  '406-skill-hunter-national-treasure-prerequisite': [funeral],
  '406-chrollo-spider-survives-his-death': [funeral],
  '406-halkenburg-funeral-procession-begins': [funeral],
  '406-chrollo-final-call-target-above-signal-range': [funeral],
});

const organizations = freeze({
  '406-tajao-interbuilding-corridor-sword-warning': ['organization:phantom-troupe', 'organization:cha-r'],
  '406-outer-pipe-chamber-revealed': ['organization:phantom-troupe', 'organization:cha-r'],
  '406-waste-network-two-hundred-thousand': ['organization:cha-r'],
  '406-char-xiyu-control-waste-processing': ['organization:cha-r', 'organization:xi-yu'],
  '406-nobunaga-subcontractor-oversight-theory': ['organization:phantom-troupe', 'organization:cha-r', 'organization:xi-yu'],
  '406-heilly-waste-contractor-killing-pipeline-theory': ['organization:phantom-troupe', 'organization:cha-r', 'organization:xi-yu', 'organization:heil-ly'],
  '406-nobunaga-turns-back-to-investigate': ['organization:phantom-troupe', 'organization:heil-ly'],
  '406-nobunaga-recaps-hideout-counteractive-defense': ['organization:phantom-troupe', 'organization:heil-ly'],
  '406-room-a-b-warp-recap': ['organization:phantom-troupe', 'organization:heil-ly'],
  '406-feitan-self-defense-bypass-theory': ['organization:phantom-troupe', 'organization:heil-ly'],
  '406-biohazard-transmitter-reverts': ['organization:xi-yu', 'organization:heil-ly'],
  '406-tier3-funeral-crowd-hinrigh-asks-for-lynch': ['organization:xi-yu'],
  '406-lynch-body-recovered-funeral-patrol': ['organization:xi-yu'],
  '406-hinrigh-initial-heilly-hitman-hypothesis': ['organization:xi-yu', 'organization:heil-ly'],
  '406-zakuro-recalls-post-encounter-lynch-behavior': ['organization:xi-yu'],
  '406-hinrigh-proposes-fake-lynch-hypothesis': ['organization:xi-yu'],
  '406-zakuro-remembers-definitely-hisoka-line': ['organization:xi-yu'],
  '406-hinrigh-deduces-lynch-found-fake-hisoka': ['organization:xi-yu'],
  '406-hinrigh-infers-culprit-seeks-hisoka': ['organization:xi-yu', 'organization:phantom-troupe'],
  '406-hinrigh-zakuro-vow-revenge': ['organization:xi-yu', 'organization:phantom-troupe', 'organization:cha-r'],
  '406-chrollo-phone-search-first-call': ['organization:phantom-troupe'],
  '406-chrollo-considers-coordinate-and-condition-changes': ['organization:phantom-troupe'],
  '406-chrollo-weighs-tier1-hisoka-risk': ['organization:phantom-troupe'],
  '406-chrollo-identifies-three-sacred-treasures': ['organization:phantom-troupe'],
  '406-chrollo-rules-out-tier3-and-below-for-regalia': ['organization:phantom-troupe'],
  '406-chrollo-regalia-nen-system-theory': ['organization:phantom-troupe'],
  '406-chrollo-tier1-regalia-storage-theory': ['organization:phantom-troupe'],
  '406-skill-hunter-national-treasure-prerequisite': ['organization:phantom-troupe'],
  '406-chrollo-spider-survives-his-death': ['organization:phantom-troupe'],
  '406-chrollo-final-call-target-above-signal-range': ['organization:phantom-troupe'],
});

const abilityIds = (record) => freeze([
  ...(record.id === '406-biohazard-transmitter-reverts' ? ['ability:hinrigh-object-animal-transformation'] : []),
  ...(['406-nobunaga-recaps-hideout-counteractive-defense', '406-feitan-self-defense-bypass-theory'].includes(record.id) ? ['ability:yokotani-battle-of-wits-lsdf'] : []),
  ...(record.id === '406-room-a-b-warp-recap' ? ['ability:heil-ly-front-door-teleport-trap'] : []),
  ...(record.id === '406-hinrigh-deduces-lynch-found-fake-hisoka' ? ['ability:body-and-soul'] : []),
  ...(['406-chrollo-phone-search-first-call', '406-chrollo-considers-coordinate-and-condition-changes', '406-chrollo-final-call-target-above-signal-range'].includes(record.id) ? ['ability:love-dial-6700-disgusting-telephone'] : []),
]);

const criticalIds = new Set([
  '406-outer-pipe-chamber-revealed',
  '406-heilly-waste-contractor-killing-pipeline-theory',
  '406-biohazard-transmitter-reverts',
  '406-lynch-body-recovered-funeral-patrol',
  '406-hinrigh-deduces-lynch-found-fake-hisoka',
  '406-chrollo-phone-search-first-call',
  '406-chrollo-identifies-three-sacred-treasures',
  '406-skill-hunter-national-treasure-prerequisite',
  '406-halkenburg-funeral-procession-begins',
  '406-chrollo-final-call-target-above-signal-range',
]);

const openQuestions = freeze({
  '406-heilly-waste-contractor-killing-pipeline-theory': ['Is Heil-Ly actually using waste-disposal subcontractors as a killing/body-removal pipeline?'],
  '406-feitan-self-defense-bypass-theory': ['Would Feitan’s self-defense interpretation actually avoid the counteractive defense?'],
  '406-hinrigh-deduces-lynch-found-fake-hisoka': ['When will Hinrigh and Zakuro identify Bonolenov as the culprit?'],
  '406-chrollo-phone-search-first-call': ['Who is Chrollo tracking?', 'What is the exact daily call allowance and signal radius?'],
  '406-chrollo-regalia-nen-system-theory': ['Do the three sacred treasures actually sustain the contest and Kakin’s prosperity?'],
  '406-chrollo-tier1-regalia-storage-theory': ['Where are the sacred treasures actually stored?'],
  '406-skill-hunter-national-treasure-prerequisite': ['What unidentified ability does Chrollo want to steal after the prerequisite is satisfied?'],
  '406-chrollo-spider-survives-his-death': ['What is the alternative continuity plan for the Spider?'],
  '406-chrollo-final-call-target-above-signal-range': ['What is the target’s identity and exact tier?'],
});

export const eventFoundation406Expansion = freeze(succession406TimelineEvents.map((record, index) => {
  const slug = `chapter406-${record.id.replace(/^406-/, '')}`;
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
    category: record.tracks?.[0] || 'chapter-406',
    importance: criticalIds.has(record.id) ? 'critical' : 'major',
    chapterRange: freeze({ start: 406, end: 406 }),
    chronology: freeze({
      sequence: index + 1,
      day: record.day,
      timeOfDay: record.time || null,
      storyPeriod: 'Voyage Day 12 · Halkenburg funeral-procession period',
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
