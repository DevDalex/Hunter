const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_349';

export const succession349SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 349',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location, tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Pre-voyage · succession preparation',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 349,
  confidence,
  source,
});

export const succession349TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-349-nugui-explains-eligibility',
    title: 'Nugui explains the eligibility and activation rules of the succession contest',
    detail: 'Nasubi’s butler Nugui tells Tserriednich that only children born to the king’s eight legal wives can enter the contest, and only if they board the Black Whale and participate in the departure ceremony. Participant identities and the final number of contestants remain confidential until the ceremony.',
    location: 'Tserriednich residence · royal briefing',
    tracks: ['tserriednich', 'nugui', 'succession-contest', 'kakin', 'black-whale'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-contest-start-cancellation',
    title: 'The contest is tied to the Black Whale departure signal',
    detail: 'The supplied synopsis says the contest becomes valid after the first special whistle associated with departure, while the chapter notes summarize the same boundary as the Black Whale finishing its departure horn. If a potential heir dies before that boundary, the succession contest is canceled; after the contest begins, all measures taken to survive are treated as legitimate within the contest framework.',
    location: 'Tserriednich residence · royal briefing',
    tracks: ['succession-contest', 'black-whale', 'royal-rules'],
    confidence: 'The supplied synopsis and chapter notes use slightly different wording for the departure signal; both are preserved rather than silently merged into a more specific rule than the source text supports',
  }),
  timelineEvent({
    id: 'pre-voyage-349-fourteen-princes-eight-wives',
    title: 'Kakin’s fourteen princes and eight legal wives define the eligible royal pool',
    detail: 'Nasubi has fourteen children by eight legal wives. Kakin uses the title “Prince” for every royal child regardless of gender, and the fourteen are numbered by birth order. Chapter 349 presents the full set of princes as the pool eligible for the succession ritual.',
    location: 'Kakin royal family · succession framework',
    tracks: ['nasubi', 'princes', 'queens', 'succession-contest'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-tserriednich-seed-urn',
    title: 'Tserriednich completes the Seed Urn Ceremony',
    detail: 'Tserriednich proves his royal blood through the ritual by placing a drop of blood into the Seed Urn and then inserting his hand. A fairy-like entity emerges from the urn and feeds him a small egg before disappearing, marking his participation in the ritual that will produce a Guardian Spirit Beast.',
    location: 'Tserriednich residence · Seed Urn Ceremony',
    tracks: ['tserriednich', 'seed-urn', 'guardian-spirit-beast', 'nen'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-seed-urn-origin',
    title: 'The First King’s Seed Urn is linked to the Worm Toxin tradition',
    detail: 'According to the old manuscripts described in the supplied text, Kakin’s First King conjured the Seed Urn after drawing inspiration from the poisonous-magic concept known as Worm Toxin. Nasubi considers the succession contest the historically proper use of the urn.',
    location: 'Kakin royal history · Seed Urn tradition',
    tracks: ['first-king', 'seed-urn', 'worm-toxin', 'conjuration', 'succession-contest'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-guardian-beast-eggs',
    title: 'The Seed Urn secretly implants Guardian Spirit Beast eggs',
    detail: 'People who complete the blood ritual unknowingly harbor an egg that later hatches into a Guardian Spirit Beast. The protector’s appearance and powers are influenced by the host’s personality. The chapter also preserves the public-facing rumor that a person who desires kingship and offers royal blood to the urn will receive a special power.',
    location: 'Kakin royal history · Seed Urn mechanics',
    tracks: ['seed-urn', 'guardian-spirit-beast', 'nen', 'succession-contest'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-departure-countdown',
    title: 'The Black Whale departure is fixed at 35 days away',
    detail: 'Mizaistom tells Kurapika that the Black Whale will depart on August 8, thirty-five days from this point in the pre-voyage chronology.',
    location: 'Hunter Association · Kurapika/Mizaistom review',
    tracks: ['black-whale', 'mizaistom', 'kurapika', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-beyond-celebration-pressure',
    title: 'Kakin pressures the V6 to let Beyond attend the departure celebration',
    detail: 'Nasubi requests that Beyond attend the celebration on the eve of departure. Mizaistom tries to leverage the request by offering Beyond temporary freedom in exchange for identifying a Zodiac ally, while Beyond predicts that Kakin’s political pressure will eventually make the Zodiacs themselves ask him to attend.',
    location: 'Beyond detention area · recorded interview',
    tracks: ['beyond', 'nasubi', 'mizaistom', 'v6', 'kakin', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-beyond-denies-saiyu-knowledge',
    title: 'Beyond says he knows nothing about a Zodiac spy and does not care about the ceremony',
    detail: 'Beyond tells Mizaistom that he does not know of any spy working for him and has no personal interest in the celebration. He says he expects to remain confined for roughly another month, spend about two more months reaching the expedition destination, and behave in Kakin’s interest until the point where his real objective beyond the known route begins.',
    location: 'Beyond detention area · recorded interview',
    tracks: ['beyond', 'saiyu', 'zodiacs', 'dark-continent'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-kurapika-confirms-beyond-truth',
    title: 'Kurapika judges Beyond’s denial to be truthful',
    detail: 'After reviewing the recording, Kurapika states that Beyond was telling the truth. Mizaistom therefore concludes that Beyond is not personally directing Saiyu and infers that Pariston is the likely organizer of the conspiracy around Saiyu and a possible future breakout.',
    location: 'Hunter Association · Kurapika/Mizaistom review',
    tracks: ['kurapika', 'mizaistom', 'beyond', 'pariston', 'saiyu', 'counterintelligence'],
    confidence: 'Beyond’s truthfulness is Kurapika’s Dowsing Chain assessment; Pariston being the mastermind is Mizaistom’s inference rather than a directly confirmed confession in Chapter 349',
  }),
  timelineEvent({
    id: 'pre-voyage-349-no-early-breakout-logic',
    title: 'Kurapika argues that an early Beyond breakout would undermine the expedition itself',
    detail: 'Kurapika reasons that Beyond deliberately surrendered and announced a truce because an escape before the planned landing could rupture Kakin’s arrangement with the V6 and jeopardize the voyage. He therefore recommends leaving Beyond in custody rather than reacting prematurely to Saiyu.',
    location: 'Hunter Association · Kurapika/Mizaistom review',
    tracks: ['kurapika', 'beyond', 'v6', 'kakin', 'counterintelligence'],
    confidence: 'This is Kurapika’s strategic analysis of the incentives surrounding Beyond’s custody',
  }),
  timelineEvent({
    id: 'pre-voyage-349-three-monkeys',
    title: 'Saiyu’s Three Monkeys ability is incorporated into the arrest plan',
    detail: 'Kurapika and Mizaistom discuss Saiyu’s Nen ability, Three Monkeys, which can deprive an opponent of vision, hearing, and speech. Kurapika believes Saiyu described the ability honestly and uses its known effect when assessing how and when Saiyu may attempt to free Beyond.',
    location: 'Hunter Association · counterintelligence planning',
    tracks: ['saiyu', 'three-monkeys', 'nen', 'kurapika', 'mizaistom'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-delayed-saiyu-arrest',
    title: 'Kurapika proposes delaying Saiyu’s arrest until just before the New Continent landing',
    detail: 'Kurapika proposes secretly monitoring Saiyu instead of restraining him immediately. The goal is to gather evidence, learn the enemy plan, avoid giving Pariston time to replace Saiyu with another method, and arrest Saiyu shortly before arrival without Beyond realizing the operation has been compromised.',
    location: 'Hunter Association · counterintelligence planning',
    tracks: ['kurapika', 'mizaistom', 'saiyu', 'pariston', 'beyond', 'new-continent'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-zodiac-trust-cost',
    title: 'Kurapika and Mizaistom acknowledge the internal cost of their secret counterintelligence operation',
    detail: 'Mizaistom warns that the other Zodiacs may condemn him for secretly using Kurapika to identify and monitor a colleague after publicly emphasizing trust and shared ability information. The pair recognize that exposing the deception could damage Zodiac cooperation and even force changes to the expedition plan.',
    location: 'Hunter Association · counterintelligence planning',
    tracks: ['kurapika', 'mizaistom', 'zodiacs', 'trust', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'pre-voyage-349-six-princes-bodyguard-recruitment',
    title: 'Six unidentified princes begin recruiting outside bodyguards',
    detail: 'Linssen informs Kurapika that six Kakin princes are recruiting bodyguards for the celebration and voyage. Kurapika, Mizaistom, and Cheadle immediately recognize the security consequence: people screened out of the 289th Hunter Exam may still be able to board the Black Whale through royal employment.',
    location: 'Hunter Association · Linssen call / royal recruitment channel',
    tracks: ['kurapika', 'linssen', 'mizaistom', 'cheadle', 'princes', 'bodyguards', 'black-whale'],
  }),
]);

export const succession349ContestRules = freeze([
  freeze({ rule: 'Eligible bloodline', detail: 'Only children of Nasubi’s eight legal wives can participate; all fourteen royal children are called Princes regardless of gender.', source }),
  freeze({ rule: 'Boarding and ceremony requirement', detail: 'An eligible prince must board the Black Whale and take part in the departure ceremony to participate.', source }),
  freeze({ rule: 'Participant secrecy', detail: 'The identities and number of participants remain confidential until the departure ceremony.', source }),
  freeze({ rule: 'Pre-start cancellation', detail: 'If a potential heir dies before the departure signal that activates the contest, the succession contest is canceled.', source }),
  freeze({ rule: 'Contest activation', detail: 'The supplied synopsis describes a special departure whistle; the chapter notes summarize the boundary as completion of the Black Whale departure horn. Both refer to the formal start of the contest.', source }),
  freeze({ rule: 'Post-start survival permission', detail: 'After the contest begins, measures taken to survive are treated as legitimate within the succession-war framework described to Tserriednich.', source }),
]);

export const succession349SeedUrnRecord = freeze({
  name: 'Seed Urn',
  creator: 'Kakin’s First King',
  creation: 'Conjured according to ancient manuscripts',
  inspiration: 'Worm Toxin / Kodoku poisonous-magic tradition',
  ritual: freeze([
    'Eligible royal participant places a drop of blood into the urn',
    'Participant places a hand into the urn',
    'A fairy-like entity emerges and feeds the participant a small egg',
    'The participant unknowingly carries a Guardian Spirit Beast egg until it hatches',
  ]),
  guardianBeastRule: 'The Guardian Spirit Beast becomes a protector whose appearance and powers are influenced by the host’s personality',
  publicRumor: 'A person who craves kingship and offers royal blood to the urn will be blessed with special power',
  source,
});

export const succession349AbilityRecords = freeze([
  freeze({
    user: 'Saiyu',
    ability: 'Three Monkeys',
    type: 'Nen ability; exact category not supplied in the provided Chapter 349 text',
    mechanics: 'Allows Saiyu to rob an opponent of vision, hearing, and speech.',
    chapters: '349',
    conditions: 'The supplied chapter text establishes the three sensory/communication losses but does not give the complete activation conditions, range, duration, resistance rules, or recovery mechanism.',
    source,
  }),
]);

export const succession349RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Mizaistom Nana',
    type: 'Covert Saiyu monitoring plan',
    note: 'They agree to leave Saiyu operational under secret observation, gather evidence, and arrest him shortly before arrival rather than expose the investigation immediately.',
    phase: 'Succession preparation / expedition counterintelligence',
    chapters: '349–current',
    state: 'covert',
    source,
  }),
  freeze({
    from: 'Pariston Hill',
    to: 'Saiyu',
    type: 'Suspected conspiracy coordination',
    note: 'Mizaistom infers that Pariston is the organizer behind Saiyu’s activity because Beyond truthfully denies knowing Saiyu is acting for his side. Chapter 349 does not independently confirm the exact command relationship.',
    phase: 'Succession preparation / expedition counterintelligence',
    chapters: '349',
    state: 'suspected',
    source,
  }),
  freeze({
    from: 'Tserriednich Hui Guo Rou',
    to: 'Seed Urn / Guardian Spirit Beast',
    type: 'Ritual host relationship',
    note: 'Tserriednich completes the Seed Urn Ceremony and receives the hidden Guardian Spirit Beast egg associated with his royal participation.',
    phase: 'Succession preparation',
    chapters: '349–current',
    state: 'active',
    source,
  }),
]);

export const succession349ObjectRecords = freeze([
  freeze({
    name: 'Seed Urn',
    note: 'Royal Kakin ritual vessel attributed to the First King. Chapter 349 links it to Worm Toxin, royal blood verification, hidden Guardian Spirit Beast eggs, and the formal succession process.',
    source,
  }),
]);

export const succession349Mysteries = freeze([
  freeze({
    question: 'What is Pariston’s exact plan for Saiyu and Beyond?',
    evidence: 'Beyond truthfully denies knowing about Saiyu, while Mizaistom infers that Pariston is coordinating the conspiracy. The exact instructions, timing, communications, and backup plans remain unresolved in Chapter 349.',
    status: 'developing',
    lastChapter: '349',
    source,
  }),
  freeze({
    question: 'What are the complete activation rules of Three Monkeys?',
    evidence: 'Chapter 349 states that Saiyu can deprive an opponent of vision, hearing, and speech, but does not establish the full activation condition, duration, range, resistance, or recovery rules.',
    status: 'open',
    lastChapter: '349',
    source,
  }),
  freeze({
    question: 'Which six princes are recruiting outside bodyguards, and who will enter through those routes?',
    evidence: 'Linssen reports six unidentified princes recruiting bodyguards, reopening an infiltration path for people screened out by the Hunter Exam. Chapter 349 does not identify all six households in the supplied text.',
    status: 'open',
    lastChapter: '349',
    source,
  }),
]);

const focus = 'Tserriednich learns the succession contest’s eligibility, secrecy, cancellation, and departure-trigger rules and completes the Seed Urn Ceremony, which implants a Guardian Spirit Beast egg linked to Kakin’s Worm Toxin tradition; the Black Whale is 35 days from departure; Beyond truthfully denies knowing about Saiyu, leading Mizaistom to suspect Pariston is directing the conspiracy; Kurapika and Mizaistom plan to monitor Saiyu and arrest him shortly before arrival, while six unidentified princes begin recruiting bodyguards and reopen a route for screened-out infiltrators.';

export const succession349ChapterResearch = freeze([
  freeze({
    number: 349,
    title: 'Worm Toxin',
    japaneseTitle: '蠱毒',
    romanizedTitle: 'Kodoku',
    phase: 'Succession preparation',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Succession Contest rules',
      'Seed Urn ritual',
      'Guardian Spirit Beasts',
      'Tserriednich',
      'Beyond custody',
      'Saiyu / Pariston counterintelligence',
      'Prince bodyguard recruitment',
    ]),
    focus,
    events: succession349TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Nasubi Hui Guo Rou',
      'Nugui',
      'Tserriednich Hui Guo Rou',
      'Kakin’s First King',
      'Kurapika',
      'Mizaistom Nana',
      'Beyond Netero',
      'Pariston Hill',
      'Saiyu',
      'Cheadle Yorkshire',
      'Linssen',
      'Fourteen Kakin Princes',
      'Eight legal wives of Nasubi',
    ]),
    locations: freeze([
      'Tserriednich residence · royal briefing',
      'Tserriednich residence · Seed Urn Ceremony',
      'Kakin royal history · Seed Urn tradition',
      'Beyond detention area · recorded interview',
      'Hunter Association · Kurapika/Mizaistom review',
      'Hunter Association · counterintelligence planning',
      'Hunter Association · Linssen call / royal recruitment channel',
    ]),
    threadLabels: freeze([
      'Succession Contest',
      'Seed Urn',
      'Guardian Spirit Beasts',
      'Tserriednich',
      'Beyond Netero',
      'Saiyu',
      'Pariston',
      'Zodiac counterintelligence',
      'Bodyguard recruitment',
      'Black Whale departure',
    ]),
    contestRules: succession349ContestRules,
    seedUrn: succession349SeedUrnRecord,
    relationships: succession349RelationshipRecords,
    abilities: succession349AbilityRecords,
    objects: succession349ObjectRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 349 text',
      'The departure-start signal is preserved with both phrasings supplied by the synopsis and chapter notes instead of silently choosing one wording',
      'Beyond’s ignorance of Saiyu is treated as confirmed through Kurapika’s truth assessment; Pariston’s role as mastermind is Mizaistom’s inference',
      'The Seed Urn’s First King origin and Conjuration are retained from the supplied chapter notes',
      'Guardian Spirit Beast eggs, personality-linked appearance/powers, and Tserriednich’s ritual participation are treated as chapter-established mechanics',
      'Three Monkeys is stored with only the effects explicitly supplied: deprivation of vision, hearing, and speech',
      'The six recruiting princes remain unidentified because the supplied Chapter 349 text does not name them',
    ]),
    status: 'Maintained chapter summary, chronology, contest rules, Seed Urn ritual and origin, Guardian Spirit Beast mechanics, departure countdown, Beyond/Saiyu counterintelligence, Three Monkeys, prince recruitment risk, relationships, objects, mysteries, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
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
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession349ChapterFocus = freeze({ 349: focus });
