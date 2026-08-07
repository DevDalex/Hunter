const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_359';

export const succession359SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 359 synopsis and chapter-note text',
  titleMetadata: 'English title Departure retained from the repository chapterTitles dataset, itself transcribed from Hunterpedia; Japanese and romanized title text were not supplied in the current message and are left unset.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location, tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 359,
  confidence,
  source,
});

export const succession359TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-359-departure',
    title: 'The Black Whale departs for the public New Continent voyage',
    detail: 'Thousands cheer as the Black Whale sets sail. The official voyage presented to Kakin royalty and general passengers is a two-month journey to the pretend New Continent.',
    location: 'Black Whale · departure',
    tracks: ['black-whale', 'departure', 'new-continent', 'voyage-day-1'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-public-route',
    title: 'The public two-month route is divided into three weeks of known waters and five weeks of uncharted waters',
    detail: 'The announcer explains that the first three weeks cover territorial/known waters, including refueling and a final ship check. The following five weeks pass through uncharted waters with severe storms, waterspouts, unstable weather, and flying creatures, requiring the top dome to be closed.',
    location: 'Black Whale · Tier 2 theater venue',
    tracks: ['voyage-route', 'new-continent', 'weather', 'ship-operations'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-real-expedition-route',
    title: 'Hunters distinguish the public New Continent voyage from the true Dark Continent expedition',
    detail: 'The Hunters clarify that Kakin royalty and ordinary passengers stop at the New Continent, while the Hunter Association expedition continues: they transfer to Morel’s ship, travel toward the Gate, and meet the Gatekeeper before proceeding toward the actual Dark Continent.',
    location: 'Black Whale · Tier 3 first-class cabin',
    tracks: ['zodiacs', 'dark-continent', 'morel', 'gatekeeper', 'new-continent'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-staging-base',
    title: 'Knov and Tokarine are assigned to the expedition staging-base logistics chain',
    detail: 'A staging base on a small island will support the route to the Gate. Knov will oversee supplies and personnel there, while Tokarine will handle transport from the Dark Continent back to the base. Tokarine says her ability does not teleport and has low capacity, prompting a request for Gel to continue seeking more transport-capable Hunters.',
    location: 'Planned staging island · expedition logistics',
    tracks: ['knov', 'tokarine', 'gel', 'logistics', 'dark-continent'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-labyrinthine-city-hint',
    title: 'Steiner hints that the Labyrinthine City matters to the expedition destination',
    detail: 'Steiner tells IPA colleagues to at least read the Labyrinthine City chapter of Journey to the New World and frames the warning in the context of expedition danger and succession within the IPA if he dies.',
    location: 'Black Whale · IPA quarters',
    tracks: ['steiner', 'ipa', 'journey-to-the-new-world', 'labyrinthine-city'],
    confidence: 'The supplied chapter notes describe this as a hint that the Labyrinthine City is their destination; it is preserved as a hinted destination rather than a fully confirmed route endpoint',
  }),
  timelineEvent({
    id: 'voyage-day1-359-ipa-director-survivor',
    title: 'The current IPA Director is identified as one of the unofficial sole survivors of a Dark Continent trip',
    detail: 'Peuckert reassures Steiner by noting that the Hunter Association will protect them and that the current IPA Director is one of the unofficial “sole survivors” from earlier Dark Continent expeditions.',
    location: 'Black Whale · IPA quarters',
    tracks: ['ipa-director', 'steiner', 'dark-continent', 'survivors'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-beyond-watch',
    title: 'Kanzai, Saccho, and Saiyu guard Beyond while Saccho considers a rotation',
    detail: 'Kanzai, Saccho, and Saiyu remain outside Beyond’s Tier 1 holding cell. Saccho plans to suggest a rotation to Mizaistom so one Zodiac can support the Royal Army while maintaining enough Zodiac presence on the upper tiers for emergencies.',
    location: 'Black Whale · Tier 1 · Beyond holding cell',
    tracks: ['beyond', 'kanzai', 'saccho', 'saiyu', 'zodiacs', 'security'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-zodiac-deployment',
    title: 'The chapter establishes the Zodiacs’ and associated Hunters’ opening ship positions',
    detail: 'Mizaistom is in the Tier 4 Royal Army conference room; Saccho, Saiyu, and Kanzai guard Beyond on Tier 1; Pyon, Cluck, Ginta, Gel, Tokarine, and Sanbica are in a Tier 3 first-class cabin; Cheadle and Leorio are in the Tier 3 central medical clinic; Botobai is in the Tier 3 central courthouse.',
    location: 'Black Whale · Tiers 1, 3, and 4',
    tracks: ['zodiacs', 'locations', 'medical', 'royal-army', 'beyond'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-woody-death',
    title: 'Woody is found dead and completely drained of blood',
    detail: 'A Woble guard discovers Woody dead in the bathroom. Kurapika removes his clothing and sees multiple holes across the body. He concludes the death is likely the result of a Nen attack.',
    location: 'Black Whale · Tier 1 · Room 1014 bathroom area',
    tracks: ['woody', 'kurapika', 'room-1014', 'nen-attack', 'murder'],
    confidence: 'Woody’s death and blood loss are confirmed; identifying the mechanism as a Nen attack is Kurapika’s assessment',
  }),
  timelineEvent({
    id: 'voyage-day1-359-room1014-nen-knowledge-gap',
    title: 'Kurapika discovers a dangerous Nen-information gap inside Woble’s guard detail',
    detail: 'Kurapika asks the surviving guards who knows Nen. Two do not know what Nen is, while three recruited Hunters had concealed their knowledge. Those Hunters say they were not told the full succession-war situation because they were recruited through Pariston’s route, leaving them without the context Kurapika expected.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'woble', 'pariston', 'hunters', 'nen', 'security'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-benjamin-hostility',
    title: 'Benjamin privately longs for the deaths of his siblings',
    detail: 'During the Tier 1 banquet, Benjamin outwardly smiles while internally expressing contempt for the other princes and a desire for them to die, preferably by his own hands.',
    location: 'Black Whale · Tier 1 banquet hall',
    tracks: ['benjamin', 'princes', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-kacho-fugetsu-alliance',
    title: 'Kacho proposes a tactical alliance with Fugetsu',
    detail: 'Kacho tells Fugetsu that the twins should cooperate to eliminate the other princes and coordinate their guard teams. Her stated endgame is to reach a final-two situation and then persuade Nasubi to allow Fugetsu to live. She also reminds Fugetsu to smile because surveillance cameras are watching them.',
    location: 'Black Whale · Tier 1 royal banquet departure route',
    tracks: ['kacho', 'fugetsu', 'succession-contest', 'alliance', 'surveillance'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-melody-reads-kacho',
    title: 'Melody questions whether Kacho’s harsh public persona reflects her real feelings',
    detail: 'Kacho behaves demandingly around her guards after separating from Fugetsu, and Melody wonders whether the prince may be deceiving or suppressing herself.',
    location: 'Black Whale · Tier 1 · Kacho household movement',
    tracks: ['melody', 'kacho', 'character-reading'],
    confidence: 'Melody’s thought is an interpretation of Kacho’s behavior, not a confirmed psychological diagnosis',
  }),
  timelineEvent({
    id: 'voyage-day1-359-four-more-guards-dead',
    title: 'Four more Oito guards are found dead by the same blood-draining pattern',
    detail: 'Kurapika, Oito, Woble, and the remaining guards discover four additional guards killed in the same manner as Woody. They had last checked in only fifteen minutes earlier, bringing the confirmed blood-drained death total in Oito’s guard force to five.',
    location: 'Black Whale · Tier 1 · Room 1014 quarters',
    tracks: ['oito', 'woble', 'kurapika', 'royal-guards', 'murder', 'room-1014'],
  }),
  timelineEvent({
    id: 'voyage-day1-359-dowsing-interrogation',
    title: 'Kurapika begins an armed Dowsing Chain interrogation of the surviving guards',
    detail: 'With only four guards remaining around Oito and Woble, Kurapika draws his gun and Dowsing Chain, orders Oito behind him, and announces that he will explain what he knows before asking questions. He warns that if the chain reacts to a lie, he will shoot.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'dowsing-chain', 'oito', 'woble', 'interrogation'],
  }),
]);

export const succession359VoyageRoute = freeze([
  freeze({ leg: 1, route: 'Departure → known/territorial waters', duration: '3 weeks', purpose: 'Public New Continent voyage', operations: 'Refueling and final Black Whale check before entering uncharted waters', hazards: 'Normal known-world maritime operations', source }),
  freeze({ leg: 2, route: 'Known waters → uncharted waters → pretend New Continent', duration: '5 weeks', purpose: 'Public New Continent voyage', operations: 'Top dome closes during dangerous conditions', hazards: 'Severe storms, waterspouts, weather fluctuations, flying creatures', source }),
  freeze({ leg: 3, route: 'Pretend New Continent → Morel’s ship', duration: null, purpose: 'Hunter Association true expedition', operations: 'Royal family and general passengers stop; expedition team transfers vessels', hazards: 'Not fully detailed in Chapter 359', source }),
  freeze({ leg: 4, route: 'Morel’s ship → staging island → Gate', duration: null, purpose: 'Hunter Association true expedition', operations: 'Knov manages staging-base supplies/personnel; expedition proceeds toward the Gate and Gatekeeper', hazards: 'Not fully detailed in Chapter 359', source }),
  freeze({ leg: 5, route: 'True Dark Continent → staging island return logistics', duration: null, purpose: 'Expedition support / extraction', operations: 'Tokarine handles return transport to the staging base; ability is non-teleporting and low-capacity; Gel seeks additional transporters', hazards: 'Transport capacity is explicitly constrained', source }),
]);

export const succession359ZodiacLocations = freeze([
  freeze({ people: 'Kanzai, Saccho, Saiyu', tier: 1, location: 'Beyond holding cell', role: 'Guard Beyond Netero; Saccho considers a rotation to free one Zodiac for Royal Army support', source }),
  freeze({ people: 'Pyon, Cluck, Ginta, Gel, Tokarine, Sanbica Norton', tier: 3, location: 'First-class cabin', role: 'Expedition logistics / transporter planning and associated Hunter coordination', source }),
  freeze({ people: 'Cheadle Yorkshire, Leorio Paradinight', tier: 3, location: 'Central medical clinic', role: 'Medical organization and supplies', source }),
  freeze({ people: 'Botobai Gigante', tier: 3, location: 'Central courthouse', role: 'Justice/security presence', source }),
  freeze({ people: 'Mizaistom Nana', tier: 4, location: 'Kakin Royal Army conference room', role: 'Coordination with officials and ship security', source }),
]);

export const succession359BodyStates = freeze([
  freeze({ subject: 'Woody', state: 'deceased', chapter: 359, detail: 'Found in the Room 1014 bathroom area with blood completely drained and multiple holes across the body.', source }),
  freeze({ subject: 'Four unnamed Oito royal guards', state: 'deceased', chapter: 359, detail: 'Found within the Woble household quarters killed in the same blood-draining pattern as Woody; last check-in was fifteen minutes earlier.', source }),
]);

export const succession359RelationshipRecords = freeze([
  freeze({
    from: 'Kacho Hui Guo Rou',
    to: 'Fugetsu Hui Guo Rou',
    type: 'Succession survival alliance',
    note: 'Kacho proposes coordinating both guard teams, eliminating the other princes together, and reaching a final-two position where she hopes to persuade Nasubi to spare Fugetsu.',
    phase: 'Active contest and voyage',
    chapters: '359–current',
    state: 'active / privately declared',
    source,
  }),
  freeze({
    from: 'Knov',
    to: 'Tokarine',
    type: 'Expedition logistics chain',
    note: 'Knov manages staging-island supplies/personnel while Tokarine handles transport from the Dark Continent back to that base; the transport side remains capacity-limited and Gel is seeking reinforcements.',
    phase: 'Active contest and voyage / expedition layer',
    chapters: '359–current',
    state: 'planned',
    source,
  }),
]);

export const succession359Mysteries = freeze([
  freeze({
    question: 'Who or what killed Woody and the four other Oito guards by draining their blood?',
    evidence: 'Five guards in Woble’s household are found dead with their blood drained, Woody showing multiple holes. Kurapika suspects a Nen attack, but Chapter 359 does not identify the attacker, user, mechanism, or motive.',
    status: 'open',
    lastChapter: '359',
    source,
  }),
  freeze({
    question: 'How many of the recruited Provisional Hunters are operating under hidden or incomplete missions?',
    evidence: 'The three Hunters inside Woble’s detail say they were not told the full succession-war context after being recruited through Pariston’s route. This supports Kurapika’s earlier concern that ignorance could let hidden assignments pass his screening, but Chapter 359 does not establish the full number or loyalties involved.',
    status: 'developing',
    lastChapter: '359',
    source,
  }),
  freeze({
    question: 'Is the Labyrinthine City the expedition’s actual intended destination?',
    evidence: 'Steiner urges the IPA group to read the Labyrinthine City chapter, and the supplied chapter notes describe this as a hint toward their destination. Chapter 359 does not formally confirm the final target.',
    status: 'open / hinted',
    lastChapter: '359',
    source,
  }),
]);

const focus = 'The Black Whale departs and the two-month public New Continent route is separated from the Hunter Association’s true Dark Continent expedition chain through Morel, Knov, Tokarine, the Gate, and Gatekeeper; the Zodiacs disperse across Tiers 1, 3, and 4; five members of Oito’s guard force including Woody are found blood-drained in Room 1014; Kacho privately forms a survival alliance with Fugetsu; and Kurapika begins an armed Dowsing Chain interrogation of the surviving Woble guards.';

export const succession359ChapterResearch = freeze([
  freeze({
    number: 359,
    title: 'Departure',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Black Whale departure',
      'Public New Continent route',
      'True Dark Continent expedition',
      'Zodiac deployment',
      'Beyond custody',
      'Room 1014 murders',
      'Kurapika / Oito / Woble',
      'Kacho / Fugetsu alliance',
      'Nen counterintelligence',
    ]),
    focus,
    events: succession359TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kakin Announcer', 'Morel Mackernasey', 'Knov', 'Tokarine', 'Gel', 'Pyon', 'Cluck', 'Ginta', 'Sanbica Norton',
      'Kanzai', 'Saccho Kobayakawa', 'Saiyu', 'Beyond Netero', 'Mizaistom Nana', 'Steiner', 'Peuckert', 'IPA Director',
      'Cheadle Yorkshire', 'Leorio Paradinight', 'Botobai Gigante', 'Woody', 'Kurapika', 'Queen Oito Hui Guo Rou', 'Woble Hui Guo Rou',
      'Benjamin Hui Guo Rou', 'Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Nugui', 'Melody', 'Pariston Hill',
    ]),
    locations: freeze([
      'Black Whale · Tier 2 theater venue',
      'Black Whale · Tier 3 first-class cabin',
      'Black Whale · Tier 1 Beyond holding cell',
      'Black Whale · IPA quarters',
      'Black Whale · Tier 3 central medical clinic',
      'Black Whale · Tier 3 central courthouse',
      'Black Whale · Tier 4 Royal Army conference room',
      'Black Whale · Tier 1 banquet hall',
      'Black Whale · Tier 1 Room 1014',
      'Planned staging island',
      'Gate / Gatekeeper route',
    ]),
    threadLabels: freeze([
      'Black Whale', 'Voyage Day 1', 'New Continent', 'Dark Continent', 'Zodiacs', 'Beyond Netero', 'Room 1014',
      'Oito & Woble', 'Blood-draining murders', 'Kacho & Fugetsu', 'Dowsing Chain', 'Expedition logistics',
    ]),
    voyageRoute: succession359VoyageRoute,
    zodiacLocations: succession359ZodiacLocations,
    bodyStates: succession359BodyStates,
    relationships: succession359RelationshipRecords,
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 359 text',
      'Departure is retained from the project’s existing Hunterpedia-transcribed chapter title dataset; Japanese/romanized title metadata was not supplied in this message',
      'The public New Continent route and the Hunter Association’s true Dark Continent route are stored separately',
      'Steiner’s Labyrinthine City statement is preserved as a destination hint, not converted into a confirmed final destination',
      'The five blood-drained deaths are confirmed; the attacker and exact Nen mechanism remain unknown',
      'Kurapika’s conclusion that the blood-draining deaths are Nen-related is stored as his assessment',
      'The recruited Hunters’ ignorance of the succession war is confirmed for Woble’s detail, but no wider loyalty or conspiracy is inferred without evidence',
    ]),
    status: 'Maintained chapter summary, chronology, voyage route, expedition logistics, Zodiac locations, death/body states, Kacho-Fugetsu alliance, Room 1014 murder mystery, Dowsing Chain interrogation, and source confidence linked',
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
    titleStatus: 'project-maintained-hunterpedia-title',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession359ChapterFocus = freeze({ 359: focus });
