const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const chapterSource = (number) => wiki(`Chapter_${number}`);
const updatedAt = '2026-07-28';
const freeze = (value) => Object.freeze(value);
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

export const succession414415CrossChecks = freeze([
  freeze({
    id: 'viz-414',
    chapter: 414,
    label: 'VIZ official Chapter 414 release',
    role: 'Official English publication identity and release verification',
    url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800',
  }),
  freeze({
    id: 'viz-415',
    chapter: 415,
    label: 'VIZ official Chapter 415 release',
    role: 'Official English publication identity and release verification',
    url: 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  }),
  freeze({
    id: 'hunterpedia-414',
    chapter: 414,
    label: 'Hunterpedia Chapter 414',
    role: 'Project-standard chapter reference and cross-link target',
    url: chapterSource(414),
  }),
  freeze({
    id: 'hunterpedia-415',
    chapter: 415,
    label: 'Hunterpedia Chapter 415',
    role: 'Project-standard chapter reference and cross-link target',
    url: chapterSource(415),
  }),
  freeze({
    id: 'voracious-drake-414',
    chapter: 414,
    label: 'VoraciousDrake translation notes · Chapter 414',
    role: 'Independent translation and terminology cross-check',
    url: 'https://voraciousdrake.wordpress.com/2026/07/17/hxh-414-friends/',
  }),
  freeze({
    id: 'voracious-drake-translations',
    chapter: 415,
    label: 'VoraciousDrake translation archive',
    role: 'Independent translation and mechanics cross-check for current releases',
    url: 'https://voraciousdrake.wordpress.com/category/hunter-x-hunter/translations/',
  }),
  freeze({
    id: 'comic-watch-414',
    chapter: 414,
    label: 'Comic Watch · Chapter 414: Friends',
    role: 'Independent English review and scene-order cross-check',
    url: 'https://comic-watch.com/comic-book-reviews/hunter-x-hunter-no-414-friends/',
  }),
  freeze({
    id: 'comic-watch-415',
    chapter: 415,
    label: 'Comic Watch · Chapter 415: Authenticity',
    role: 'Independent English review and title/scene cross-check',
    url: 'https://comic-watch.com/comic-book-reviews/hunter-x-hunter-no-415-authenticity/',
  }),
  freeze({
    id: 'skypenguin-414',
    chapter: 414,
    label: 'Sky Penguin Japanese Chapter 414 analysis',
    role: 'Japanese-language sequence and terminology cross-check',
    url: 'https://skypenguin.net/2026/07/20/post-159012/',
  }),
]);

const timelineEvent = ({
  id,
  time,
  title,
  detail,
  location,
  tracks,
  chapter,
  confidence = 'Story-order placement',
}) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter,
  confidence,
  source: chapterSource(chapter),
});

export const succession414415TimelineEvents = freeze([
  timelineEvent({
    id: 'day-12-414-luzurus-countermeasures',
    time: 'Before martial law',
    title: 'Luzurus prepares a nonresistance strategy',
    detail: 'Luzurus orders his household not to resist an expected military intervention, to remove compromising drugs, and to delay Benjamin’s guards through legal and procedural friction rather than violence.',
    location: 'Tier 1 · Room 1007',
    tracks: ['ritual', 'benjamin', 'justice', 'mafia'],
    chapter: 414,
  }),
  timelineEvent({
    id: 'day-12-414-woble-dual-crisis',
    time: 'Before 13:50',
    title: 'Room 1014 separates Woble’s two crises',
    detail: 'Kurapika’s group distinguishes the curse threatening Woble from the unresolved location of the actual Fourteenth Prince. The infant publicly presented in Room 1014 is treated separately from the missing royal child.',
    location: 'Tier 1 · Room 1014',
    tracks: ['kurapika', 'ritual', 'nen', 'justice'],
    chapter: 414,
    confidence: 'Confirmed distinction; actual location unknown',
  }),
  timelineEvent({
    id: 'day-12-414-passenger-search',
    time: 'Before martial law',
    title: 'The official search treats Woble as possibly aboard',
    detail: 'Passenger and voyage records are examined, but the absence of conclusive proof means the military must continue treating the actual Woble as potentially somewhere aboard the Black Whale.',
    location: 'Black Whale · Administrative records',
    tracks: ['kurapika', 'justice', 'ship'],
    chapter: 414,
    confidence: 'Confirmed search logic; location unresolved',
  }),
  timelineEvent({
    id: 'day-12-414-trusted-friends-contingency',
    time: 'Before 13:50',
    title: 'Oito authorizes a coded outside contact',
    detail: 'Oito accepts a contingency plan using coded communication with relatives, and Kurapika identifies trusted friends as possible help. The chapter establishes a contact plan, not a confirmed mission or acceptance by Gon or Killua.',
    location: 'Tier 1 · Room 1014',
    tracks: ['kurapika', 'ship', 'expedition'],
    chapter: 414,
    confidence: 'Confirmed plan; outside response not yet shown',
  }),
  timelineEvent({
    id: 'day-12-414-forty-nine-day-marker',
    time: 'Story marker',
    title: 'The voyage is framed against a 49-day remainder',
    detail: 'The chapter supplies a 49-day remaining marker for the current voyage framework. The archive records the stated marker without converting it into a more exact calendar claim than the chapter supports.',
    location: 'Black Whale · Voyage frame',
    tracks: ['ship', 'ritual', 'expedition'],
    chapter: 414,
    confidence: 'Explicit countdown marker',
  }),
  timelineEvent({
    id: 'day-12-415-furykov-curse-flashback',
    time: 'Two months before departure',
    title: 'Furykov detects Beyond’s long-prepared curse',
    detail: 'Furykov’s Fullmetal Alchemist / Combo Master analysis identifies a stealth curse shared with another person. Beyond describes a death-triggered post-mortem curse linked to a prince’s Seed Urn participation, while Furykov treats Beyond’s explanation as strategically unreliable.',
    location: 'Kakin · Pre-voyage meeting',
    tracks: ['benjamin', 'nen', 'ritual', 'expedition'],
    chapter: 415,
    confidence: 'Dated relative flashback',
  }),
  timelineEvent({
    id: 'day-12-415-coded-postcards',
    time: '13:50 · 25 minutes before martial law',
    title: 'Oito’s coded postcards enter the mail system',
    detail: 'Eight postcards written through a Yamato-script code are submitted under ordinary commercial cover. The plan is designed to contact Oito’s relatives without openly identifying the royal emergency.',
    location: 'Black Whale · General-store mail channel',
    tracks: ['kurapika', 'justice', 'ship'],
    chapter: 415,
    confidence: 'Exact relative time',
  }),
  timelineEvent({
    id: 'day-12-415-martial-law-declaration',
    time: '14:15',
    title: 'Special martial law is formally declared',
    detail: 'The emergency regime moves from anticipation to active enforcement, changing royal access, relocation, confinement, searches, and the military chain of command.',
    location: 'Shipwide · Upper tiers',
    tracks: ['benjamin', 'justice', 'ritual', 'ship'],
    chapter: 415,
    confidence: 'Exact time',
  }),
  timelineEvent({
    id: 'day-12-415-tubeppa-relocation',
    time: 'After 14:15',
    title: 'Tubeppa is ordered toward Room 1001',
    detail: 'The Fifth Prince is ordered to relocate under special martial law. Royal military guards may accompany her, while her private guard structure is restricted, concentrating Benjamin’s control over the encounter.',
    location: 'Tier 1 · Rooms 1005 → 1001',
    tracks: ['benjamin', 'ritual', 'justice', 'nen'],
    chapter: 415,
    confidence: 'Relocation order confirmed; completion pending',
  }),
  timelineEvent({
    id: 'day-12-415-luzurus-missing',
    time: 'After 14:15',
    title: 'Luzurus is reported missing',
    detail: 'The Seventh Prince and a close household associate cannot be located as Benjamin’s soldiers attempt to turn the disappearance and surrounding violence into a treason case against Luzurus, Cha-R, and Hunter personnel.',
    location: 'Tier 1 · Room 1007 and surrounding route',
    tracks: ['benjamin', 'ritual', 'justice', 'mafia'],
    chapter: 415,
    confidence: 'Missing status confirmed; responsibility unresolved',
  }),
  timelineEvent({
    id: 'day-12-415-marayam-holds-space',
    time: 'After 14:15',
    title: 'Marayam’s household holds the isolated Nen space',
    detail: 'The household decides not to leave the protected duplicate-space state. Biscuit warns that exiting could collapse, reset, hibernate, or permanently consume the Guardian Spirit Beast’s defensive condition.',
    location: 'Tier 1 · Room 1013 isolated Nen space',
    tracks: ['ritual', 'nen', 'justice'],
    chapter: 415,
    confidence: 'Decision confirmed; exact ability consequence uncertain',
  }),
  timelineEvent({
    id: 'day-12-415-oito-confinement',
    time: '20 minutes after martial law',
    title: 'Oito receives conditional confinement',
    detail: 'Oito is suspected of grave royal offenses, but punishment is held while the actual Woble’s status remains unresolved and Oito may still become Queen Regent. She may remain within the main bedroom; leaving would make her a fugitive.',
    location: 'Tier 1 · Room 1014',
    tracks: ['kurapika', 'benjamin', 'justice', 'ritual'],
    chapter: 415,
    confidence: 'Exact relative time',
  }),
]);

const researchRecord = ({
  number,
  title,
  focus,
  events,
  locations,
  threadLabels,
  confidence,
}) => freeze({
  number,
  title,
  phase: 'Current releases',
  voyageDay: 'Voyage Day 12',
  lanes: freeze(['Royal contest', 'Kurapika / Woble', 'Nen development', 'Justice Bureau', 'Beyond curse network']),
  focus,
  events,
  prelude: freeze([]),
  locations: freeze(locations),
  threadLabels: freeze(threadLabels),
  confidence: freeze(confidence),
  status: 'Maintained chapter summary + chronology + royal, assignment, Nen, location, and consequence research linked',
  coverage: freeze({
    identity: true,
    publication: true,
    summary: true,
    sceneSummary: true,
    chronology: true,
    appearances: true,
    locations: true,
    relationships: true,
    assignments: true,
    nen: true,
    source: true,
  }),
  lastReviewed: 'July 28, 2026',
  releaseDate: number === 414 ? 'July 19, 2026' : 'July 26, 2026',
  titleStatus: number === 414 ? 'verified' : 'cross-checked-english-rendering',
  officialReaderUrl: number === 414
    ? 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-414/chapter/50800'
    : 'https://www.viz.com/shonenjump/hunter-x-hunter-chapter-415/chapter/50829',
  source: chapterSource(number),
  crossChecks: freeze(succession414415CrossChecks.filter((source) => source.chapter === number)),
});

export const succession414415ChapterResearch = freeze([
  researchRecord({
    number: 414,
    title: 'Friends',
    focus: 'Luzurus prepares for martial law while Room 1014 separates Woble’s curse risk from the actual prince’s unknown location, authorizes coded contact with Kurapika’s trusted friends, and records a 49-day voyage marker.',
    events: freeze(succession414415TimelineEvents.filter((event) => event.chapter === 414)),
    locations: ['Tier 1 · Room 1007', 'Tier 1 · Room 1014', 'Black Whale · Administrative records', 'Black Whale · Voyage frame'],
    threadLabels: ['Kurapika & Woble', 'Benjamin', 'Justice & military', 'Nen development', 'Ship operations'],
    confidence: ['official publication verified', 'chapter sequence cross-checked across independent English and Japanese sources', 'actual Woble location remains unresolved', 'outside contacts are prospective, not confirmed participants'],
  }),
  researchRecord({
    number: 415,
    title: 'Truth and Falsehood',
    focus: 'Furykov reveals the mechanics and uncertainty surrounding Beyond’s long-prepared curse network as special martial law activates, Tubeppa faces forced relocation, Luzurus disappears, Marayam holds his Nen space, and Oito is conditionally confined pending Woble’s status.',
    events: freeze(succession414415TimelineEvents.filter((event) => event.chapter === 415)),
    locations: ['Kakin · Pre-voyage meeting', 'Black Whale · General-store mail channel', 'Shipwide · Upper tiers', 'Tier 1 · Rooms 1005 → 1001', 'Tier 1 · Room 1007 and surrounding route', 'Tier 1 · Room 1013 isolated Nen space', 'Tier 1 · Room 1014'],
    threadLabels: ['Kurapika & Woble', 'Benjamin', 'Nasubi & ritual', 'Nen development', 'Justice & military', 'Ship operations'],
    confidence: ['official publication verified', 'chapter sequence cross-checked across independent translations and reviews', 'Furykov’s 365-day and 700-day figures are ability-specific estimates', 'Luzurus responsibility and Benjamin’s deeper martial-law objective remain unresolved'],
  }),
]);

export const succession414415ChapterFocus = freeze({
  414: succession414415ChapterResearch[0].focus,
  415: succession414415ChapterResearch[1].focus,
});

export const patchSuccessionPrinceDossier = (record) => {
  if (record.order === 1) {
    return freeze({
      ...record,
      room: '1001 / special martial-law command',
      strategy: 'Uses special martial law, military relocations, legal confinement, searches, and Benjamin Baton to compress the remaining royal field around his command.',
      pressure: freeze(unique([...(record.pressure || []), 'Unknown infection or concealed condition', 'Actual Woble search', 'Furykov’s curse warning', 'Unrevealed urgent martial-law objective'])),
      statusDetail: 'Actively directing the special-martial-law phase while an undisclosed medical or Nen-related condition remains a major uncertainty.',
    });
  }
  if (record.order === 5) {
    return freeze({
      ...record,
      room: '1005 → ordered to Room 1001',
      status: 'relocation ordered',
      strategy: 'Attempts to preserve the Kurapika–Longhi treaty and scientific partnership while special martial law orders her into Benjamin’s controlled space.',
      pressure: freeze(unique([...(record.pressure || []), 'Forced relocation', 'Private guards restricted', 'Direct Benjamin confrontation'])),
      statusDetail: 'Ordered to relocate under special martial law; the order is confirmed, while the final room state remains developing.',
    });
  }
  if (record.order === 7) {
    return freeze({
      ...record,
      room: '1007 / current location unknown',
      status: 'missing',
      strategy: 'Had prepared a nonresistance and evidence-removal strategy for martial law before disappearing as Benjamin’s soldiers built a treason narrative around his household and Cha-R connection.',
      pressure: freeze(unique([...(record.pressure || []), 'Current location unknown', 'Manufactured treason case', 'Benjamin military search'])),
      statusDetail: 'Reported missing after special martial law begins; the cause, destination, and responsibility remain unresolved.',
    });
  }
  if (record.order === 13) {
    return freeze({
      ...record,
      room: '1013 / isolated Nen space held under martial law',
      strategy: 'The household deliberately remains inside the spatial barrier because exiting may collapse, reset, hibernate, or permanently consume the defensive condition.',
      pressure: freeze(unique([...(record.pressure || []), 'One-use condition risk', 'Military relocation pressure', 'Unknown exit consequence'])),
      statusDetail: 'Active inside the isolated Nen space; the household has chosen to hold position rather than test the exit condition.',
    });
  }
  if (record.order === 14) {
    return freeze({
      ...record,
      room: 'Actual Woble: unknown / substitute infant: Room 1014',
      status: 'location unresolved',
      strategy: 'Room 1014 now manages two separate problems: protecting the substitute infant and Oito under martial law while locating the actual Woble and countering the curse attached to the Fourteenth Prince.',
      pressure: freeze(unique([...(record.pressure || []), 'Actual location unknown', 'Beyond curse network', 'Military search', 'Identity separation between actual prince and substitute infant'])),
      statusDetail: 'The actual Fourteenth Prince’s location is unconfirmed and must still be treated as potentially aboard; the infant displayed in Room 1014 is a substitute.',
      currentLocation: 'Actual Woble unknown; substitute infant in Room 1014',
    });
  }
  return record;
};

export const patchSuccessionQueenDossier = (record) => {
  if (record.name !== 'Oito') return record;
  return freeze({
    ...record,
    role: 'Woble’s mother and Kurapika’s employer; conditionally confined inside Room 1014 under special martial law while punishment is held pending the actual Woble’s status and Oito’s possible Queen Regent role. She authorizes a coded outside-contact contingency.',
  });
};

export const succession414415AbilityRecords = freeze([
  freeze({
    user: 'Furykov',
    ability: 'Fullmetal Alchemist / Combo Master',
    type: 'Conjuration / analysis',
    mechanics: 'Detects and analyzes concealed Nen attacks or curses, compares affected subjects, and estimates the time required to decode or formulate a countermeasure.',
    chapters: '415',
    conditions: 'The revealed 365-day decoding and 700-day antidote estimates apply to Beyond’s specific long-accumulated curse, not to Nen exorcism in general.',
    source: chapterSource(415),
  }),
  freeze({
    user: 'Beyond Netero / curse children',
    ability: 'Beyond’s long-term succession curse network',
    type: 'Curse / post-mortem Nen',
    mechanics: 'A curse planted through birth and long aura accumulation is designed to activate through the bearer’s death after the assigned prince enters the Seed Urn succession system.',
    chapters: '401–415',
    conditions: 'Targets, bearers, exact effects, and Beyond’s full truthfulness remain unresolved; Chapter 415 confirms a prince-linked trigger and decades of aura accumulation.',
    source: chapterSource(415),
  }),
]);

export const succession414415RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Trusted outside friends',
    type: 'Contingency contact',
    note: 'Kurapika identifies trusted friends as possible help through Oito’s coded-contact plan. The record does not treat Gon or Killua as contacted, assigned, or committed until the manga shows a response.',
    phase: 'Voyage Day 12',
    chapters: '414–current',
    state: 'prospective',
    source: chapterSource(414),
  }),
  freeze({
    from: 'Oito',
    to: 'Actual Woble / substitute infant',
    type: 'Mother / protected identity split',
    note: 'Oito’s legal and strategic position depends on the actual prince’s unresolved status, while the substitute infant remains inside Room 1014.',
    phase: 'Voyage Day 12',
    chapters: '414–current',
    state: 'exceptional',
    source: chapterSource(415),
  }),
  freeze({
    from: 'Furykov',
    to: 'Beyond’s curse network',
    type: 'Analyst / affected subject',
    note: 'Furykov detects the curse, obtains a partial explanation from Beyond, and preserves doubt about the target, benefit, and truthfulness of the explanation.',
    phase: 'Pre-voyage disclosure',
    chapters: '415',
    state: 'developing',
    source: chapterSource(415),
  }),
]);

export const succession414415BodyStates = freeze([
  freeze({
    state: 'Actual location unresolved / substitute present',
    examples: 'Woble',
    rule: 'The actual prince and the infant displayed in Room 1014 must be tracked as separate identity and location records.',
    className: 'exceptional',
    source: chapterSource(414),
  }),
  freeze({
    state: 'Missing under martial law',
    examples: 'Luzurus',
    rule: 'A missing report is not proof of death, escape, guilt, or ritual elimination.',
    className: 'unknown',
    source: chapterSource(415),
  }),
  freeze({
    state: 'Conditional in-room confinement',
    examples: 'Oito',
    rule: 'Oito may remain inside the main Room 1014 bedroom while punishment is held; leaving would change her legal status to fugitive.',
    className: 'legal',
    source: chapterSource(415),
  }),
]);

export const succession414415Mysteries = freeze([
  freeze({
    question: 'Actual Woble location',
    evidence: 'The substitute infant remains in Room 1014, while official records do not conclusively establish where the actual Fourteenth Prince is.',
    status: 'developing',
    lastChapter: '415',
    source: chapterSource(415),
  }),
  freeze({
    question: 'Beyond curse target and truthfulness',
    evidence: 'Furykov confirms a long-accumulated prince-linked curse, but Beyond’s claim that it benefits Benjamin and the identity of the assigned target remain unverified.',
    status: 'developing',
    lastChapter: '415',
    source: chapterSource(415),
  }),
  freeze({
    question: 'Luzurus disappearance',
    evidence: 'Luzurus is missing as Benjamin’s soldiers attempt to build a treason case; his location, responsibility, and survival status are unresolved.',
    status: 'developing',
    lastChapter: '415',
    source: chapterSource(415),
  }),
  freeze({
    question: 'Benjamin’s deeper martial-law objective',
    evidence: 'The search for Woble explains part of the emergency operation, but Kurapika infers another more urgent reason remains undisclosed.',
    status: 'developing',
    lastChapter: '415',
    source: chapterSource(415),
  }),
  freeze({
    question: 'Marayam space exit condition',
    evidence: 'The household holds the isolated room because leaving may reset, hibernate, collapse, or permanently consume a one-use defensive condition.',
    status: 'open',
    lastChapter: '415',
    source: chapterSource(415),
  }),
]);

const chapterSourceId = (number) => `source:chapter-${number}`;

const archiveBase = ({
  id,
  entityType,
  slug,
  name,
  summary,
  sourceIds,
  canonLevel = 'canon',
}) => ({
  id,
  entityType,
  slug,
  name,
  aliases: freeze([]),
  summary,
  sourceIds: freeze(sourceIds),
  publicationStatus: 'published',
  canonLevel,
  createdAt: updatedAt,
  updatedAt,
});

const archiveEvent = ({
  slug,
  name,
  summary,
  chapter,
  participants = [],
  organizations = [],
  locations = [],
  abilities = [],
  category = 'story-development',
  status = 'completed',
  timeOfDay = null,
  certainty = 'confirmed',
  openQuestions = [],
}) => freeze({
  ...archiveBase({
    id: `event:${slug}`,
    entityType: 'event',
    slug,
    name,
    summary,
    sourceIds: [chapterSourceId(chapter)],
  }),
  category,
  importance: 'major',
  chapterRange: freeze({ start: chapter, end: chapter }),
  chronology: freeze({ sequence: 0, day: 12, timeOfDay, certainty }),
  participantIds: freeze(participants),
  organizationIds: freeze(organizations),
  locationIds: freeze(locations),
  abilityIds: freeze(abilities),
  causes: freeze([]),
  outcomes: freeze([]),
  consequenceEventIds: freeze([]),
  status,
  stateChanges: freeze([]),
  openQuestions: freeze(openQuestions),
});

const archiveEvents = freeze([
  archiveEvent({
    slug: 'luzurus-martial-law-countermeasures',
    name: 'Luzurus Martial-Law Countermeasures',
    summary: 'Luzurus orders nonresistance, removal of compromising drugs, and procedural delay before the expected military intervention.',
    chapter: 414,
    participants: ['character:luzurus-hui-guo-rou', 'character:basho'],
    organizations: ['organization:kakin-royal-family', 'organization:cha-r'],
    locations: ['location:black-whale:tier-1:room-1007'],
    category: 'royal-defense-plan',
  }),
  archiveEvent({
    slug: 'woble-location-and-curse-crisis',
    name: 'Woble Location and Curse Crisis',
    summary: 'Room 1014 separates the curse attached to the Fourteenth Prince from the unresolved location of the actual Woble and the substitute infant displayed in the room.',
    chapter: 414,
    participants: ['character:kurapika', 'character:oito-hui-guo-rou', 'character:woble-hui-guo-rou', 'character:bill'],
    organizations: ['organization:hunter-association', 'organization:kakin-royal-family'],
    locations: ['location:black-whale:tier-1:room-1014'],
    abilities: ['ability:beyond-curse-child-network'],
    category: 'identity-and-curse-crisis',
    openQuestions: ['Where is the actual Woble?', 'Which curse bearer and conditions threaten the Fourteenth Prince?'],
  }),
  archiveEvent({
    slug: 'oito-coded-contact-contingency',
    name: 'Oito Coded Contact Contingency',
    summary: 'Oito authorizes coded contact with relatives, while Kurapika identifies trusted friends as possible help without establishing that they have received or accepted an assignment.',
    chapter: 414,
    participants: ['character:kurapika', 'character:oito-hui-guo-rou', 'character:bill'],
    organizations: ['organization:hunter-association', 'organization:kakin-royal-family'],
    locations: ['location:black-whale:tier-1:room-1014'],
    category: 'contingency-planning',
    status: 'ongoing',
  }),
  archiveEvent({
    slug: 'furykov-beyond-curse-analysis',
    name: 'Furykov Analyzes Beyond’s Succession Curse',
    summary: 'A pre-voyage flashback shows Furykov detecting a long-accumulated, death-triggered curse linked to a prince’s Seed Urn participation and challenging Beyond’s account of whom it benefits.',
    chapter: 415,
    participants: ['character:furykov', 'character:beyond-netero'],
    organizations: ['organization:benjamin-private-army', 'organization:kakin-royal-family'],
    locations: ['location:black-whale'],
    abilities: ['ability:fullmetal-alchemist-combo-master', 'ability:beyond-curse-child-network'],
    category: 'nen-analysis',
    openQuestions: ['Which prince is targeted?', 'Which parts of Beyond’s explanation are true?'],
  }),
  archiveEvent({
    slug: 'oito-coded-postcards',
    name: 'Oito’s Coded Postcards',
    summary: 'Eight coded postcards enter the commercial mail channel at 13:50, twenty-five minutes before special martial law.',
    chapter: 415,
    participants: ['character:kurapika', 'character:oito-hui-guo-rou', 'character:bill'],
    organizations: ['organization:hunter-association', 'organization:kakin-royal-family'],
    locations: ['location:black-whale'],
    category: 'covert-communication',
    timeOfDay: '13:50',
    status: 'ongoing',
  }),
  archiveEvent({
    slug: 'special-martial-law-royal-confinement',
    name: 'Special Martial Law Royal Confinement',
    summary: 'At 14:15 the military begins enforced royal relocations, room confinement, restricted guard access, and intensified searches across the upper tiers.',
    chapter: 415,
    participants: ['character:benjamin-hui-guo-rou', 'character:tubeppa-hui-guo-rou', 'character:oito-hui-guo-rou', 'character:babimyna'],
    organizations: ['organization:kakin-military', 'organization:benjamin-private-army', 'organization:kakin-justice-bureau', 'organization:kakin-royal-family'],
    locations: ['location:black-whale:tier-1', 'location:black-whale:tier-1:room-1001', 'location:black-whale:tier-1:room-1005', 'location:black-whale:tier-1:room-1014'],
    category: 'emergency-rule',
    timeOfDay: '14:15',
    status: 'ongoing',
  }),
  archiveEvent({
    slug: 'luzurus-disappearance',
    name: 'Luzurus Disappearance',
    summary: 'Luzurus is reported missing as Benjamin’s soldiers attempt to turn the disappearance and surrounding violence into evidence against the prince, Cha-R, and Hunter personnel.',
    chapter: 415,
    participants: ['character:luzurus-hui-guo-rou', 'character:basho'],
    organizations: ['organization:kakin-military', 'organization:benjamin-private-army', 'organization:cha-r', 'organization:hunter-association'],
    locations: ['location:black-whale:tier-1:room-1007'],
    category: 'missing-person-and-frame-operation',
    status: 'ongoing',
    openQuestions: ['Where is Luzurus?', 'Who caused the disappearance and deaths?', 'Will the manufactured treason case succeed?'],
  }),
  archiveEvent({
    slug: 'marayam-isolated-space-hold',
    name: 'Marayam Household Holds the Isolated Space',
    summary: 'Marayam’s household decides not to leave the Nen-isolated Room 1013 because exiting may collapse, reset, hibernate, or permanently consume its defensive condition.',
    chapter: 415,
    participants: ['character:marayam-hui-guo-rou', 'character:biscuit-krueger'],
    organizations: ['organization:kakin-royal-family', 'organization:hunter-association'],
    locations: ['location:black-whale:tier-1:room-1013:isolated-space'],
    category: 'defensive-containment',
    status: 'ongoing',
    openQuestions: ['Is the isolated space a one-use defense?', 'What happens if the household exits?'],
  }),
]);

const fullmetalAbility = freeze({
  ...archiveBase({
    id: 'ability:fullmetal-alchemist-combo-master',
    entityType: 'ability',
    slug: 'fullmetal-alchemist-combo-master',
    name: 'Fullmetal Alchemist / Combo Master',
    summary: 'Furykov conjures an analytical system that detects concealed Nen attacks or curses, compares affected subjects, and estimates the time required to decode or formulate a countermeasure.',
    sourceIds: [chapterSourceId(415)],
  }),
  ownerIds: freeze(['character:furykov']),
  classification: freeze({ nenTypes: freeze(['conjuration']), certainty: 'confirmed' }),
  category: 'curse-analysis',
  activation: 'Furykov applies the conjured analytical system to a Nen effect or affected subject.',
  conditions: freeze(['The estimate depends on the specific curse’s accumulated aura, complexity, and available information.']),
  limitations: freeze(['The 365-day decoding and 700-day countermeasure estimates are specific to Beyond’s revealed curse.', 'Detection does not itself remove the curse.']),
  costs: freeze([]),
  targets: freeze(['concealed Nen attacks', 'curses', 'affected people']),
  range: 'analysis-dependent',
  duration: 'until analysis or countermeasure work is complete',
  status: 'active',
  knownUses: freeze(['Detects the curse affecting Furykov and another subject before the voyage.', 'Estimates the time needed to decode and counter Beyond’s long-accumulated curse.']),
  firstChapter: 415,
  latestChapter: 415,
  sourceChapterNumbers: freeze([415]),
  researchStatus: 'documented',
});

const state = ({
  characterId,
  start,
  operationalState,
  protectionState,
  threatLevel,
  nenKnowledge,
  allegianceState,
  locationId = null,
  bodyState = 'living body',
  consciousnessState = 'active in own body',
  life = 'alive',
  certainty = 'confirmed',
  openQuestions = [],
  sources = [start],
}) => freeze({
  id: `character-state:${characterId.replace('character:', '')}:${start}`,
  characterId,
  chapterRange: freeze({ start, end: null }),
  life,
  bodyState,
  consciousnessState,
  operationalState,
  protectionState,
  threatLevel,
  nenKnowledge,
  allegianceState,
  locationId,
  openQuestions: freeze(openQuestions),
  certainty,
  sourceIds: freeze(sources.map(chapterSourceId)),
});

const stateCorrections = freeze({
  'character:kurapika': freeze([
    state({
      characterId: 'character:kurapika',
      start: 414,
      operationalState: 'Coordinates the actual-Woble search, curse response, coded outside contact, and Room 1014 survival under special martial law.',
      protectionState: 'Primary strategist for Oito, the substitute infant, and recovery of the actual Woble.',
      threatLevel: 'critical',
      nenKnowledge: 'expert Nen user, instructor, contract negotiator, and curse-response coordinator',
      allegianceState: 'Oito and Woble remain primary; trusted friends are a prospective contingency, not yet assigned participants.',
      locationId: 'location:black-whale:tier-1:room-1014',
      openQuestions: ['What additional urgent reason does Benjamin have for martial law?'],
      sources: [414, 415],
    }),
  ]),
  'character:oito-hui-guo-rou': freeze([
    state({
      characterId: 'character:oito-hui-guo-rou',
      start: 415,
      operationalState: 'Authorizes coded contact with relatives and remains conditionally confined while the military investigates the actual Woble’s location.',
      protectionState: 'Protected inside Room 1014 by Kurapika, Bill, and the legal uncertainty around her possible Queen Regent status.',
      threatLevel: 'existential legal and royal exposure',
      nenKnowledge: 'limited Nen perception; participates in curse-response planning',
      allegianceState: 'Actual Woble’s survival and recovery remain the controlling objective.',
      locationId: 'location:black-whale:tier-1:room-1014',
      openQuestions: ['What punishment follows once Woble’s status is established?', 'Will the coded messages reach their intended recipients?'],
      sources: [414, 415],
    }),
  ]),
  'character:woble-hui-guo-rou': freeze([
    state({
      characterId: 'character:woble-hui-guo-rou',
      start: 414,
      operationalState: 'The actual Fourteenth Prince is separated from the substitute infant displayed in Room 1014; the royal child’s location remains unresolved.',
      protectionState: 'Kurapika’s network searches for the actual Woble while defending Oito and the substitute infant under martial law.',
      threatLevel: 'existential',
      nenKnowledge: 'infant host; conscious Nen knowledge not established; Beyond-linked curse risk active',
      allegianceState: 'Oito household and Kurapika-led recovery/protection network.',
      bodyState: 'living infant; exact location unresolved',
      locationId: null,
      certainty: 'confirmed',
      openQuestions: ['Where is the actual Woble?', 'Who moved the prince and under what conditions?', 'How does the curse track its royal target?'],
      sources: [414, 415],
    }),
  ]),
  'character:bill': freeze([
    state({
      characterId: 'character:bill',
      start: 414,
      operationalState: 'Treats Oito and Woble’s survival as a personal commitment while supporting the curse response, actual-Woble search, and coded-contact operation.',
      protectionState: 'Core Room 1014 defender and practical partner to Kurapika.',
      threatLevel: 'critical',
      nenKnowledge: 'experienced Enhancer supporting instruction and defensive planning',
      allegianceState: 'Oito and Woble protection has become Bill’s active chosen priority.',
      locationId: 'location:black-whale:tier-1:room-1014',
      sources: [414, 415],
    }),
  ]),
  'character:furykov': freeze([
    state({
      characterId: 'character:furykov',
      start: 415,
      operationalState: 'Serves Benjamin while privately carrying knowledge of Beyond’s prince-linked curse and the analytical burden of decoding it.',
      protectionState: 'Embedded in Benjamin’s military system but personally affected by the curse network.',
      threatLevel: 'critical concealed curse exposure',
      nenKnowledge: 'advanced Nen user with Fullmetal Alchemist / Combo Master analytical conjuration',
      allegianceState: 'Loyal to Benjamin while distrustful of Beyond’s explanation and motives.',
      locationId: 'location:black-whale:tier-1:room-1014',
      openQuestions: ['Did Furykov fully report the curse to Benjamin?', 'Which prince is assigned to the detected curse?'],
      sources: [415],
    }),
  ]),
  'character:tubeppa-hui-guo-rou': freeze([
    state({
      characterId: 'character:tubeppa-hui-guo-rou',
      start: 415,
      operationalState: 'Receives an order to relocate from Room 1005 toward Benjamin’s Room 1001 under special martial law.',
      protectionState: 'Royal military escorts may accompany her, but private guards are restricted from the controlled encounter.',
      threatLevel: 'existential forced proximity to Benjamin',
      nenKnowledge: 'Nen-aware through Longhi, Maor, Rihan’s observation, and the Guardian Spirit Beast partnership condition',
      allegianceState: 'Tubeppa household and conditional Kurapika–Longhi treaty remain active under military coercion.',
      locationId: 'location:black-whale:tier-1:room-1005',
      openQuestions: ['Has the relocation been completed?', 'What does Benjamin intend to demand or do inside Room 1001?'],
      sources: [415],
    }),
  ]),
  'character:luzurus-hui-guo-rou': freeze([
    state({
      characterId: 'character:luzurus-hui-guo-rou',
      start: 415,
      operationalState: 'Reported missing after preparing a nonresistance strategy; Benjamin’s soldiers attempt to frame the disappearance as treason involving Cha-R and Hunter personnel.',
      protectionState: 'Household protection is disrupted and current access is unknown.',
      threatLevel: 'existential missing-person status',
      nenKnowledge: 'no confirmed personal ability; Guardian Spirit Beast remains relevant to the Fugetsu investigation',
      allegianceState: 'Luzurus household and Cha-R sponsorship remain the public affiliation, but current control is unknown.',
      locationId: null,
      openQuestions: ['Where is Luzurus?', 'Is he alive?', 'Who initiated the disappearance?', 'What happened to his close household associate?'],
      sources: [414, 415],
    }),
  ]),
  'character:marayam-hui-guo-rou': freeze([
    state({
      characterId: 'character:marayam-hui-guo-rou',
      start: 415,
      operationalState: 'Remains inside the Nen-isolated Room 1013 after the household chooses not to test the exit during special martial law.',
      protectionState: 'Biscuit, Hanzo, Belerainte, Sevanti, and the spatial barrier continue the defense.',
      threatLevel: 'high but spatially contained',
      nenKnowledge: 'child host; the household now treats the barrier as a possibly finite or one-use Guardian Spirit Beast condition',
      allegianceState: 'Marayam household holds position inside the isolated space.',
      locationId: 'location:black-whale:tier-1:room-1013:isolated-space',
      openQuestions: ['Would exiting permanently end the space?', 'Can the military force access without breaking the Nen condition?'],
      sources: [415],
    }),
  ]),
});

const patchCharacter = (character) => {
  const status = character.status ? freeze({ ...character.status, asOfChapter: 415 }) : character.status;
  if (character.id === 'character:furykov') {
    return freeze({
      ...character,
      summary: 'Benjamin’s private soldier, an advanced Nen observer, and the user of Fullmetal Alchemist / Combo Master, who detects and analyzes Beyond’s prince-linked curse.',
      status,
      nen: freeze({
        ...(character.nen || {}),
        abilityIds: freeze(unique([...(character.nen?.abilityIds || []), 'ability:fullmetal-alchemist-combo-master'])),
      }),
      updatedAt,
    });
  }
  if (character.id === 'character:woble-hui-guo-rou') {
    const { locationState: _retiredLocationState, ...withoutLocation } = character;
    return freeze({
      ...withoutLocation,
      summary: 'The actual Fourteenth Prince of Kakin, whose location is unresolved from Chapter 414 onward; a substitute infant remains in Room 1014 while Kurapika and Oito pursue recovery and curse countermeasures.',
      status,
      updatedAt,
    });
  }
  if (character.id === 'character:oito-hui-guo-rou') {
    return freeze({
      ...character,
      summary: 'The Eighth Queen, Woble’s mother, and Kurapika’s employer, conditionally confined in Room 1014 while the actual prince’s status controls her legal and regency exposure.',
      status,
      updatedAt,
    });
  }
  if (character.id === 'character:tubeppa-hui-guo-rou') {
    return freeze({
      ...character,
      summary: 'The Fifth Prince, ordered from Room 1005 toward Benjamin’s Room 1001 under special martial law while her private guards are restricted.',
      status,
      updatedAt,
    });
  }
  if (character.id === 'character:luzurus-hui-guo-rou') {
    const { locationState: _retiredLocationState, ...withoutLocation } = character;
    return freeze({
      ...withoutLocation,
      summary: 'The Seventh Prince, reported missing after preparing nonresistance countermeasures and becoming the focus of a military treason narrative.',
      status: freeze({ ...(status || {}), life: 'unknown', certainty: 'unknown', asOfChapter: 415 }),
      updatedAt,
    });
  }
  if (character.id === 'character:marayam-hui-guo-rou') {
    return freeze({
      ...character,
      summary: 'The Thirteenth Prince, remaining inside the Nen-isolated Room 1013 after his household chooses to preserve the possibly finite defensive condition.',
      status,
      updatedAt,
    });
  }
  return freeze({ ...character, status, updatedAt });
};

const patchAbility = (ability) => {
  if (ability.id !== 'ability:beyond-curse-child-network') return ability;
  return freeze({
    ...ability,
    summary: 'A long-prepared network of children and curse bearers uses decades of accumulated aura and death-triggered post-mortem Nen against assigned Kakin princes after the Seed Urn ritual creates the target condition.',
    conditions: freeze(unique([
      ...(ability.conditions || []),
      'The target prince must participate in the Seed Urn succession ritual.',
      'The bearer accumulates aura over a long period before death-triggered activation.',
    ])),
    limitations: freeze(unique([
      ...(ability.limitations || []),
      'Beyond’s stated beneficiary, assigned targets, and complete truthfulness remain unverified.',
      'Furykov’s 365-day and 700-day estimates describe one detected curse, not the entire network.',
    ])),
    knownUses: freeze(unique([
      ...(ability.knownUses || []),
      'Furykov detects and analyzes a prince-linked curse before the voyage.',
    ])),
    sourceIds: freeze(unique([...(ability.sourceIds || []), chapterSourceId(415)])),
    sourceChapterNumbers: freeze(unique([...(ability.sourceChapterNumbers || []), 415])),
    latestChapter: 415,
    updatedAt,
  });
};

const patchGlossary = (entry) => {
  if (entry.term === 'Special Martial Law') {
    return freeze({
      ...entry,
      definition: 'Emergency Kakin military authority that now enforces royal relocations, room confinement, guard restrictions, searches, investigations, and upper-tier command under Benjamin’s operation.',
      sourceIds: freeze(unique([...(entry.sourceIds || []), chapterSourceId(415)])),
      updatedAt,
    });
  }
  if (entry.term === 'Room 1014') {
    return freeze({
      ...entry,
      definition: 'Queen Oito and Kurapika’s Tier 1 defensive base, containing the substitute infant from Chapter 414 onward while the actual Woble’s location remains unresolved.',
      sourceIds: freeze(unique([...(entry.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      updatedAt,
    });
  }
  if (entry.term === 'Have-Not') {
    return freeze({
      ...entry,
      sourceIds: freeze(unique([...(entry.sourceIds || []), chapterSourceId(415)])),
      updatedAt,
    });
  }
  return entry;
};

const patchRelationship = (relationship) => {
  if (relationship.id === 'relationship:kurapika-woble') {
    return freeze({
      ...relationship,
      operationalState: 'Active recovery, protection, curse-response, coded-contact, and deterrence strategy while the actual Woble’s location remains unresolved.',
      sourceIds: freeze(unique([...(relationship.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      relatedEventIds: freeze(unique([...(relationship.relatedEventIds || []), 'event:woble-location-and-curse-crisis', 'event:oito-coded-contact-contingency'])),
      updatedAt,
    });
  }
  if (relationship.id === 'relationship:kurapika-oito') {
    return freeze({
      ...relationship,
      operationalState: 'Active command partnership under Oito’s conditional confinement, centered on finding the actual Woble and executing the coded-contact contingency.',
      sourceIds: freeze(unique([...(relationship.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      relatedEventIds: freeze(unique([...(relationship.relatedEventIds || []), 'event:oito-coded-contact-contingency', 'event:oito-coded-postcards'])),
      updatedAt,
    });
  }
  if (relationship.id === 'relationship:kurapika-bill-room-1014-partners') {
    return freeze({
      ...relationship,
      operationalState: 'Active Room 1014 partnership strengthened by Bill’s chosen commitment to Oito and Woble through the location crisis and martial-law phase.',
      sourceIds: freeze(unique([...(relationship.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      updatedAt,
    });
  }
  return relationship;
};

const patchAssignment = (assignment) => {
  if (assignment.id === 'assignment:bill-protects-woble') {
    return freeze({
      ...assignment,
      objective: 'Protect Oito, the substitute infant, and the actual Woble’s recovery operation while supporting curse analysis, Nen instruction, and coded outside contact.',
      operationalNotes: freeze(unique([...(assignment.operationalNotes || []), 'Chapter 414 clarifies that Bill’s commitment has become a chosen personal priority, not only a paid placement.'])),
      relatedEventIds: freeze(unique([...(assignment.relatedEventIds || []), 'event:woble-location-and-curse-crisis', 'event:oito-coded-postcards'])),
      sourceIds: freeze(unique([...(assignment.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      updatedAt,
    });
  }
  if (assignment.id === 'assignment:babimyna-observes-woble') {
    return freeze({
      ...assignment,
      objective: 'Enforce and observe Benjamin’s special-martial-law conditions in Room 1014 while reporting on Oito, the substitute infant, Kurapika, and the unresolved actual-Woble search.',
      relatedEventIds: freeze(unique([...(assignment.relatedEventIds || []), 'event:special-martial-law-royal-confinement'])),
      sourceIds: freeze(unique([...(assignment.sourceIds || []), chapterSourceId(415)])),
      updatedAt,
    });
  }
  return assignment;
};

export const applySuccession414415ArchiveCorrections = (data) => {
  const abilities = freeze(uniqueById([
    ...data.abilities.map(patchAbility),
    fullmetalAbility,
  ]));
  const events = freeze(uniqueById([
    ...data.events,
    ...archiveEvents,
  ]));
  const eventIdsByChapter = new Map();
  for (const event of archiveEvents) {
    for (let chapter = event.chapterRange.start; chapter <= (event.chapterRange.end ?? event.chapterRange.start); chapter += 1) {
      const current = eventIdsByChapter.get(chapter) || [];
      current.push(event);
      eventIdsByChapter.set(chapter, current);
    }
  }
  const currentPhaseId = 'story-phase:martial-law-funeral-and-recruitment';
  const currentLaneIds = freeze([
    'story-lane:royal-succession',
    'story-lane:woble-defense',
    'story-lane:nen-information-war',
    'story-lane:mafia-war',
    'story-lane:troupe-hisoka',
    'story-lane:justice-military',
  ]);
  const currentThreadIds = freeze([
    'story-thread:woble-guardian-beast',
    'story-thread:beyond-curse-target-map',
    'story-thread:martial-law-end-state',
    'story-thread:sarahell-curse-operation',
    'story-thread:fugetsu-condition',
  ]);
  const chapters = freeze(data.chapters.map((chapter) => {
    const linkedEvents = eventIdsByChapter.get(chapter.number) || [];
    const currentRelease = chapter.number === 414 || chapter.number === 415;
    if (!linkedEvents.length && !currentRelease) return freeze({ ...chapter, updatedAt });
    const appearances = new Map((chapter.appearanceRecords || []).map((record) => [record.characterId, record]));
    for (const participantId of linkedEvents.flatMap((event) => event.participantIds)) {
      if (!appearances.has(participantId)) appearances.set(participantId, freeze({ characterId: participantId, role: 'event participant' }));
    }
    return freeze({
      ...chapter,
      appearanceRecords: freeze([...appearances.values()]),
      eventIds: freeze(unique([...(chapter.eventIds || []), ...linkedEvents.map((event) => event.id)])),
      locationIds: freeze(unique([...(chapter.locationIds || []), ...linkedEvents.flatMap((event) => event.locationIds)])),
      abilityIds: freeze(unique([...(chapter.abilityIds || []), ...linkedEvents.flatMap((event) => event.abilityIds)])),
      organizationIds: freeze(unique([...(chapter.organizationIds || []), ...linkedEvents.flatMap((event) => event.organizationIds)])),
      ...(currentRelease ? {
        storyPhaseIds: freeze([currentPhaseId]),
        storyLaneIds: currentLaneIds,
        storyThreadIds: currentThreadIds,
        storyIntelligenceStatus: 'maintained-research',
        storyCoverage: freeze({
          summary: true,
          chronology: true,
          locations: true,
          source: true,
          phase: true,
          lanes: true,
          threads: true,
        }),
      } : {}),
      updatedAt,
    });
  }));
  const characterStateProfiles = freeze(Object.fromEntries(
    unique([...Object.keys(data.characterStateProfiles || {}), ...Object.keys(stateCorrections)])
      .map((characterId) => [
        characterId,
        freeze([
          ...(data.characterStateProfiles?.[characterId] || []),
          ...(stateCorrections[characterId] || []),
        ].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id))),
      ]),
  ));
  const storyPhaseProfiles = freeze(Object.fromEntries(
    Object.entries(data.storyPhaseProfiles || {})
      .filter(([id]) => id !== 'story-phase:pending-current-release')
      .map(([id, profile]) => {
        if (id !== currentPhaseId) return [id, profile];
        return [id, freeze({
          ...profile,
          name: 'Martial law, Woble crisis, curse analysis, funeral, and recruitment',
          summary: 'Halkenburg’s funeral operation and Morena’s recruitment continue as Chapters 414–415 add the actual-Woble location crisis, coded outside contact, Furykov’s curse analysis, forced royal relocations, disappearances, and confinement under active special martial law.',
          chapterRange: freeze({ start: profile.chapterRange.start, end: 415 }),
          eventIds: freeze(unique([...(profile.eventIds || []), ...archiveEvents.map((event) => event.id)])),
          sourceIds: freeze(unique([...(profile.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
          status: 'documented',
        })];
      }),
  ));
  const laneEventMap = freeze({
    'story-lane:royal-succession': archiveEvents.map((event) => event.id),
    'story-lane:woble-defense': ['event:woble-location-and-curse-crisis', 'event:oito-coded-contact-contingency', 'event:oito-coded-postcards', 'event:special-martial-law-royal-confinement'],
    'story-lane:nen-information-war': ['event:woble-location-and-curse-crisis', 'event:furykov-beyond-curse-analysis', 'event:marayam-isolated-space-hold'],
    'story-lane:mafia-war': ['event:luzurus-martial-law-countermeasures', 'event:luzurus-disappearance'],
    'story-lane:justice-military': ['event:oito-coded-postcards', 'event:special-martial-law-royal-confinement', 'event:luzurus-disappearance', 'event:marayam-isolated-space-hold'],
  });
  const storyLaneProfiles = freeze(Object.fromEntries(
    Object.entries(data.storyLaneProfiles || {}).map(([id, profile]) => {
      const eventIds = laneEventMap[id];
      if (!eventIds) return [id, profile];
      return [id, freeze({
        ...profile,
        eventIds: freeze(unique([...(profile.eventIds || []), ...eventIds])),
        sourceIds: freeze(unique([...(profile.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
      })];
    }),
  ));
  const storyThreadProfiles = freeze(Object.fromEntries(
    Object.entries(data.storyThreadProfiles || {}).map(([id, profile]) => {
      if (id === 'story-thread:beyond-curse-target-map') {
        return [id, freeze({
          ...profile,
          eventIds: freeze(unique([...(profile.eventIds || []), 'event:furykov-beyond-curse-analysis', 'event:woble-location-and-curse-crisis'])),
          abilityIds: freeze(unique([...(profile.abilityIds || []), 'ability:fullmetal-alchemist-combo-master', 'ability:beyond-curse-child-network'])),
          sourceIds: freeze(unique([...(profile.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
          evidenceState: 'Chapter 415 confirms a long-accumulated death-triggered curse linked to a prince’s Seed Urn participation, while the assigned target and Beyond’s truthfulness remain unresolved.',
        })];
      }
      if (id === 'story-thread:martial-law-end-state') {
        return [id, freeze({
          ...profile,
          eventIds: freeze(unique([...(profile.eventIds || []), 'event:special-martial-law-royal-confinement', 'event:luzurus-disappearance', 'event:marayam-isolated-space-hold'])),
          sourceIds: freeze(unique([...(profile.sourceIds || []), chapterSourceId(415)])),
          evidenceState: 'Chapter 415 confirms active royal relocation, confinement, guard restriction, disappearance, and search operations, but the final emergency objective and end state remain unresolved.',
        })];
      }
      if (id === 'story-thread:woble-guardian-beast') {
        return [id, freeze({
          ...profile,
          eventIds: freeze(unique([...(profile.eventIds || []), 'event:woble-location-and-curse-crisis'])),
          sourceIds: freeze(unique([...(profile.sourceIds || []), chapterSourceId(414), chapterSourceId(415)])),
          evidenceState: 'The actual Woble’s location is now unresolved and separated from the substitute infant, while the Guardian Spirit Beast remains unrevealed.',
        })];
      }
      return [id, profile];
    }),
  ));
  return freeze({
    ...data,
    characters: freeze(data.characters.map(patchCharacter)),
    abilities,
    events,
    chapters,
    relationships: freeze(data.relationships.map(patchRelationship)),
    assignments: freeze(data.assignments.map(patchAssignment)),
    characterStateProfiles,
    storyPhaseProfiles,
    storyLaneProfiles,
    storyThreadProfiles,
    glossaryEntries: freeze((data.glossaryEntries || []).map(patchGlossary)),
    currentResearchBoundary: freeze({
      publishedThrough: 415,
      detailedThrough: 415,
      updatedAt,
      chapterIds: freeze(['chapter:414', 'chapter:415']),
      sourcePolicy: 'Official VIZ publication identity; Hunterpedia chapter links; independent English and Japanese translation/review cross-checks.',
    }),
  });
};
