const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_367';

export const succession367SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 367 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1 · Room 1014', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1 · after the Chapter 366 four-hour mark',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 367,
  confidence,
  source,
});

export const succession367TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-367-insect-search',
    title: 'Room 1014 searches for a small living target for Little Eye',
    detail: 'Kurapika, Oito, Bill, and Shimanu search Room 1014 for a small insect before Maor arrives. Sakata and Slakka observe the strange search and speculate about what Kurapika’s group may be doing.',
    tracks: ['kurapika', 'oito', 'bill', 'shimanu', 'little-eye', 'sakata', 'slakka'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-maor-arrives',
    title: 'Maor arrives for Tubeppa’s promised Nen-information exchange',
    detail: 'Maor reaches Woble’s quarters, ending the uninterrupted insect search and advancing Tubeppa’s Chapter 365 conditional-truce contact into an in-person information exchange.',
    tracks: ['maor', 'tubeppa', 'kurapika', 'diplomacy', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-room-choice',
    title: 'Kurapika tries to separate the Nen briefing from Oito’s covert search',
    detail: 'Kurapika initially proposes briefing the guards in the anteroom and asks Bill to remain with Oito and Woble. Bill realizes Kurapika chose the farthest room so Oito and Shimanu could continue searching for an insect away from the observers.',
    tracks: ['kurapika', 'bill', 'oito', 'woble', 'room-1014', 'deception'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-babimyna-insists-attendance',
    title: 'Babimyna insists Oito and Woble accompany the Nen briefing',
    detail: 'Babimyna invokes his duty to guard Woble and refuses to let the prince and queen remain separated from the briefing. Kurapika accepts and moves the discussion again.',
    tracks: ['babimyna', 'oito', 'woble', 'kurapika', 'security'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-bedroom-briefing',
    title: 'Kurapika moves the briefing to the bedroom and lies about his reason',
    detail: 'Kurapika says the anteroom is inappropriate because violent deaths occurred there, then tells Babimyna that repeated room changes are intended to reduce Oito’s stress and make her comfortable. The supplied synopsis explicitly frames this explanation as a lie. Maor agrees with the stated comfort rationale and Babimyna relents.',
    tracks: ['kurapika', 'babimyna', 'maor', 'oito', 'deception'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-kurapika-explains-gsb',
    title: 'Kurapika gives the assembled guards a Guardian Spirit Beast briefing',
    detail: 'Kurapika explains the Seed Urn origin of the princes’ Guardian Spirit Beasts, says they feed on their prince’s aura, and describes their forms as reflecting the prince’s nature. He says they protect their prince while cautioning that protection is not necessarily guaranteed to be the beast’s highest priority.',
    tracks: ['kurapika', 'guardian-spirit-beast', 'seed-urn', 'nen', 'information-war'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-oito-spots-cockroach',
    title: 'Oito finds the first usable Little Eye target',
    detail: 'During the briefing, Oito notices a cockroach on the wall and fixes her attention on it, drawing the other guards’ attention to the insect.',
    tracks: ['oito', 'cockroach', 'little-eye'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-bill-cover-story',
    title: 'Kurapika turns Bill into the public cover for Little Eye',
    detail: 'Oito loudly orders the cockroach removed. Kurapika calls Bill over and tells him to catch it with Nen as a demonstration. Bill realizes Oito will activate Little Eye while he pretends to launch the controlling aura, causing the observers to attribute the ability to him.',
    tracks: ['kurapika', 'bill', 'oito', 'little-eye', 'deception'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-little-eye-activated',
    title: 'Oito activates Little Eye on the cockroach',
    detail: 'Oito uses the stolen Little Eye ability and captures the cockroach. Stealth Dolphin informs her that the insect can now be controlled at will. The supplied synopsis states that only Oito and Kurapika can see Stealth Dolphin during this use.',
    tracks: ['oito', 'kurapika', 'little-eye', 'stealth-dolphin', 'cockroach'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-oito-rest-cover',
    title: 'Oito withdraws under the pretext of resting so she can operate unseen',
    detail: 'Oito asks to rest, giving her a reason to leave the observers while continuing to control the cockroach without revealing that she is the actual user.',
    tracks: ['oito', 'little-eye', 'deception', 'reconnaissance'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-bill-demonstrates-control',
    title: 'Bill performs the visible half of the Little Eye deception',
    detail: 'The cockroach moves according to Oito’s control while Bill behaves as though he is directing it. Babimyna, Slakka, Hashito, Sakata, and Maor therefore believe Bill activated the controlling ability.',
    tracks: ['bill', 'oito', 'babimyna', 'slakka', 'hashito', 'sakata', 'maor', 'deception'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-two-week-nen-plan',
    title: 'Kurapika offers a two-week basic Nen course across prince camps',
    detail: 'Kurapika tells the assembled guards that the basics of Nen can be learned in two weeks, enough to avoid being completely defenseless against a Nen attack. He offers to teach anyone who wishes to participate on the condition that every other prince is informed and allowed to send guards.',
    tracks: ['kurapika', 'nen-training', 'stalemate', 'all-princes'],
    confidence: 'Kurapika’s two-week timetable is his stated training estimate and proposal, not a universal Nen-learning law',
  }),
  timelineEvent({
    id: 'voyage-day1-367-babimyna-reads-stalemate',
    title: 'Babimyna recognizes Kurapika’s mass-training plan as a stalemate strategy',
    detail: 'Babimyna realizes Kurapika is willing to spread Nen knowledge broadly to make the succession conflict harder to resolve through one-sided surprise. He concludes Kurapika will be difficult to handle and resolves to discover Kurapika’s own ability next.',
    tracks: ['babimyna', 'kurapika', 'stalemate', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-babimyna-infers-surveillance',
    title: 'Babimyna infers that Bill’s supposed ability can be used for reconnaissance',
    detail: 'After observing the cockroach being released through a vent, Babimyna deduces that the ability he attributes to Bill can capture small animals and use them for surveillance. His deduction about the surveillance function is sound, but his attribution of the ability to Bill is false.',
    tracks: ['babimyna', 'bill', 'little-eye', 'reconnaissance', 'deception'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-babimyna-en',
    title: 'Kurapika detects Babimyna’s En covering Room 1014',
    detail: 'Kurapika senses that Babimyna is using En throughout Woble’s quarters. He worries that Babimyna may understand what the cockroach is doing and could eventually discover that Oito, not Bill, is operating the ability.',
    tracks: ['babimyna', 'en', 'kurapika', 'room-1014', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-367-marayam-recon',
    title: 'Oito sends the cockroach into Marayam’s quarters',
    detail: 'Oito pilots the cockroach through the air vents into Marayam’s room to confirm his Guardian Spirit Beast and inspect personnel placement. Through the controlled insect she sees Marayam, Sevanti, Vergei, and the large dragon-like Guardian Spirit Beast behind the prince.',
    location: 'Black Whale · Tier 1 · Marayam quarters via air-vent reconnaissance',
    tracks: ['oito', 'marayam', 'sevanti', 'vergei', 'little-eye', 'guardian-spirit-beast', 'reconnaissance'],
  }),
]);

export const succession367LittleEyeReconnaissance = freeze({
  originalOwner: 'Sayird',
  stolenBy: 'Kurapika',
  temporaryUser: 'Oito Hui Guo Rou',
  publicCoverUser: 'Bill',
  target: 'Cockroach',
  objective: 'Reconnoiter Marayam’s quarters, confirm his Guardian Spirit Beast, and inspect the placement of guards and servants.',
  confirmedObservation: freeze([
    'Marayam Hui Guo Rou is present',
    'Queen Sevanti is present',
    'Vergei is present',
    'Marayam’s large dragon-like Guardian Spirit Beast is visible to the Little Eye-linked reconnaissance',
  ]),
  deception: 'Babimyna, Slakka, Hashito, Sakata, and Maor believe Bill activated the ability; Oito is the actual user.',
  source,
});

export const succession367NenInstructionPlan = freeze({
  instructor: 'Kurapika',
  estimate: 'Two weeks for the basics of Nen',
  statedPurpose: 'Give participants enough basic knowledge that they are not completely defenseless against Nen attacks.',
  accessCondition: 'Every prince must be informed of the opportunity and allowed to send guards who wish to participate.',
  strategicEffect: 'Babimyna interprets the proposal as Kurapika deliberately widening Nen knowledge to force a succession stalemate.',
  confidence: 'The two-week duration is Kurapika’s claim for this training plan, not a universal learning-time rule.',
  source,
});

export const succession367DeceptionRecord = freeze({
  actualAbilityUser: 'Oito Hui Guo Rou',
  stagedUser: 'Bill',
  planners: freeze(['Kurapika', 'Oito Hui Guo Rou', 'Bill']),
  observersMisled: freeze(['Babimyna', 'Slakka', 'Hashito', 'Sakata', 'Maor']),
  falseInference: 'Bill possesses an animal-capture and surveillance Nen ability.',
  trueMechanism: 'Oito is using Sayird’s Little Eye through Kurapika’s stolen-ability system while Bill performs a fake Nen demonstration.',
  source,
});

export const succession367BabimynaSurveillance = freeze({
  user: 'Babimyna',
  technique: 'En',
  coverage: 'Entire Room 1014 / Woble’s quarters according to the supplied chapter notes',
  purpose: 'Not formally stated; Kurapika treats the En as active surveillance/counterintelligence pressure and fears it may expose the Little Eye deception.',
  certainty: 'En use is confirmed; exact radius metrics and Babimyna’s full intent are not supplied.',
  source,
});

export const succession367RelationshipRecords = freeze([
  freeze({
    from: 'Tubeppa / Maor',
    to: 'Woble / Oito household',
    type: 'Nen information exchange following conditional truce offer',
    note: 'Maor arrives in Room 1014 and joins Kurapika’s briefing on Nen and Guardian Spirit Beasts, advancing Tubeppa’s Chapter 365 contact from phone negotiation to an in-person exchange.',
    phase: 'Active contest and voyage',
    chapters: '365–367',
    state: 'active information exchange; full formal-truce terms still not explicitly completed in the supplied Chapter 367 text',
    source,
  }),
  freeze({
    from: 'Kurapika',
    to: 'All prince camps',
    type: 'Open Nen-instruction offer',
    note: 'Kurapika offers basic Nen instruction to guards from every prince household if all camps are informed and permitted to participate.',
    phase: 'Active contest and voyage',
    chapters: '367–current',
    state: 'offer announced / responses pending',
    source,
  }),
  freeze({
    from: 'Babimyna',
    to: 'Room 1014',
    type: 'Embedded counterintelligence surveillance',
    note: 'Babimyna uses En throughout the room, studies the cockroach demonstration, infers a reconnaissance application, and resolves to identify Kurapika’s ability.',
    phase: 'Active contest and voyage',
    chapters: '367–current',
    state: 'active',
    source,
  }),
]);

export const succession367Mysteries = freeze([
  freeze({
    question: 'Can Room 1014 keep Oito’s role as the Little Eye user hidden from Babimyna?',
    evidence: 'The staged demonstration successfully causes the observers to attribute Little Eye to Bill, but Babimyna is using En throughout Room 1014 and already deduces the cockroach is being used for reconnaissance.',
    status: 'developing counterintelligence risk',
    lastChapter: '367',
    source,
  }),
  freeze({
    question: 'Which princes will accept Kurapika’s offer to send guards for two weeks of basic Nen instruction?',
    evidence: 'Kurapika announces an open training offer conditioned on informing every prince, but Chapter 367 does not yet show the camps’ responses.',
    status: 'open',
    lastChapter: '367',
    source,
  }),
]);

const focus = 'Kurapika converts Room 1014’s secret Little Eye reconnaissance into a public Nen demonstration by using Bill as a false ability user while Oito secretly captures and pilots a cockroach into Marayam’s quarters; Maor receives the promised Nen and Guardian Spirit Beast briefing; Kurapika offers every prince camp a two-week basic Nen course to deepen the stalemate; and Babimyna answers with active En surveillance and a new effort to uncover Kurapika’s true ability.';

export const succession367ChapterResearch = freeze([
  freeze({
    number: 367,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Little Eye reconnaissance',
      'Oito covert Nen use',
      'Bill cover story',
      'Tubeppa / Maor information exchange',
      'Mass Nen instruction proposal',
      'Babimyna En surveillance',
      'Marayam reconnaissance',
    ]),
    focus,
    events: succession367TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Bill', 'Shimanu',
      'Babimyna', 'Maor', 'Tubeppa Hui Guo Rou', 'Sakata', 'Hashito', 'Slakka',
      'Marayam Hui Guo Rou', 'Sevanti Hui Guo Rou', 'Vergei', 'Sayird',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · Room 1014 bedroom',
      'Black Whale · Tier 1 · Room 1014 air vents',
      'Black Whale · Tier 1 · Marayam quarters',
    ]),
    threadLabels: freeze([
      'Little Eye',
      'Stealth Dolphin',
      'Oito',
      'Bill',
      'Babimyna',
      'En',
      'Nen training',
      'Stalemate strategy',
      'Marayam Guardian Spirit Beast',
      'Tubeppa diplomacy',
    ]),
    littleEyeReconnaissance: succession367LittleEyeReconnaissance,
    nenInstructionPlan: succession367NenInstructionPlan,
    deception: succession367DeceptionRecord,
    babimynaSurveillance: succession367BabimynaSurveillance,
    relationships: succession367RelationshipRecords,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 367 text',
      'Oito is stored as the actual Little Eye user while Bill is stored only as the staged/public cover user',
      'Babimyna’s conclusion that Bill possesses the surveillance ability is explicitly false attribution created by the deception',
      'Kurapika’s two-week Nen-learning estimate is stored as his instructional claim rather than a universal rule',
      'Babimyna’s En use across Room 1014 is confirmed, while his exact range measurements and complete intent remain unspecified',
      'Kurapika’s statement that Guardian Spirit Beasts protect their princes but may have other priorities is stored as his explanation in this briefing, not expanded into unsupported universal mechanics',
    ]),
    status: 'Maintained chapter summary, chronology, Little Eye activation and reconnaissance, Oito/Bill deception, Maor information exchange, mass Nen-instruction proposal, Babimyna En surveillance, relationships, mysteries, and source confidence linked',
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
    titleStatus: 'not-supplied-in-current-message',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession367ChapterFocus = freeze({ 367: focus });
