const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_381';

export const succession381SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 381 synopsis and chapter notes',
  titleMetadata: 'The supplied material does not include an English, Japanese, or romanized chapter title. No title is invented.',
  chronologyNote: 'The chapter explicitly ends at 8:00 p.m. on Voyage Day 5. Earlier Chapter 381 scenes are treated as preceding events on Day 5 unless a more precise timestamp is supplied later.',
  retrospectiveNote: 'The supplied Chapter 381 notes explain the Hunter Code using information revealed in Chapter 383. The decoded message is stored only as retrospective annotation, not as explicit knowledge available at the Chapter 381 boundary.',
  excluded: freeze(['Outside story claims', 'Unsupplied later mechanics', 'Any assumption that Melody or other characters consciously decode the Hunter Code in Chapter 381']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale', time = 'Voyage Day 5 · before 8:00 p.m.', confidence = 'confirmed' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 381,
  confidence,
  source,
});

export const succession381TimelineEvents = freeze([
  event({ id: '381-fugetsu-central-police', title: 'Fugetsu is taken to the Tier 3 Central Police Station', detail: 'After discovering Fugetsu on the lower tiers, Mizaistom takes the Eleventh Prince to the Central Police Station on Tier 3 for questioning.', tracks: ['fugetsu', 'mizaistom', 'custody', 'tier-3'], location: 'Black Whale · Tier 3 · Central Police Station' }),
  event({ id: '381-room1011-absence-confirmed', title: 'Fugetsu’s absence from Room 1011 is independently confirmed', detail: 'One of Mizaistom’s men confirms that Fugetsu is not in her room. Security footage is being checked and provides no indication that she traveled through the ordinary corridors.', tracks: ['fugetsu', 'mizaistom', 'room-1011', 'investigation'], location: 'Black Whale · Tier 3 · Central Police Station' }),
  event({ id: '381-fugetsu-asks-for-kacho', title: 'Fugetsu refuses substantive questioning and asks for Kacho', detail: 'Fugetsu does not explain her route and insists that she wants to speak with her sister Kacho.', tracks: ['fugetsu', 'kacho', 'mizaistom', 'custody'], location: 'Black Whale · Tier 3 · Central Police Station' }),
  event({ id: '381-mizaistom-prince-contact-rule', title: 'Mizaistom reiterates the restriction on inter-prince communication', detail: 'Mizaistom reminds Fugetsu that princes cannot freely communicate with one another outside the banquet structure and tells her that he wants to help both twins.', tracks: ['mizaistom', 'fugetsu', 'kacho', 'royal-rules'], location: 'Black Whale · Tier 3 · Central Police Station' }),
  event({ id: '381-melody-receives-call', title: 'Melody receives a call about Fugetsu’s lower-tier appearance', detail: 'A member of Mizaistom’s side calls Melody in Room 1010. The information confirms Melody’s suspicion that Fugetsu’s Guardian Spirit Beast possesses a transportation effect.', tracks: ['melody', 'fugetsu', 'mizaistom', 'guardian-spirit-beast', 'information-control'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '381-escape-countermission', title: 'Keeney and Melody are outwardly assigned to stop a twin escape', detail: 'The caller warns that Kacho and Fugetsu may be planning an escape. Keeney is named as mission lead and Melody is told to support him in preventing the twins from leaving.', tracks: ['keeney', 'melody', 'kacho', 'fugetsu', 'escape-plan'], location: 'Black Whale · Tier 1 · Room 1010', confidence: 'The spoken assignment is explicit in Chapter 381. The supplied notes retrospectively reveal a hidden Hunter Code message with the opposite intent, but that decoding is not available as explicit Chapter 381 knowledge.' }),
  event({ id: '381-melody-relays-to-keeney', title: 'Melody relays the call to Keeney', detail: 'After the call, Melody updates Keeney on the situation surrounding Fugetsu and the escape concern.', tracks: ['melody', 'keeney', 'fugetsu', 'kacho'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '381-fugetsu-return-tier1', title: 'Fugetsu is escorted back to Tier 1', detail: 'Mizaistom and another man escort Fugetsu back toward the VVIP area. Fugetsu reflects on her Guardian Spirit Beast and the childhood tunnel game she shared with Kacho.', tracks: ['fugetsu', 'mizaistom', 'guardian-spirit-beast', 'kacho'], location: 'Black Whale · Tier 1' }),
  event({ id: '381-fugetsu-72h-monitoring', title: 'Fugetsu avoids confinement but receives seventy-two-hour surveillance', detail: 'A Kakin jurisdiction supervisor tells Seiko and Fugetsu that the prince has been spared confinement but will be monitored for the next seventy-two hours. Surveillance is to be temporarily lifted before the Sunday-night banquet.', tracks: ['fugetsu', 'seiko', 'surveillance', 'jurisdiction'], location: 'Black Whale · Tier 1 · Room 1011' }),
  event({ id: '381-fugetsu-kacho-contact-tightened', title: 'Fugetsu is warned that contact with Kacho will become more difficult', detail: 'The supervisor warns that communication with Kacho will face tighter restrictions. Fugetsu outwardly agrees and says she will practice for the banquet.', tracks: ['fugetsu', 'kacho', 'surveillance', 'banquet'], location: 'Black Whale · Tier 1 · Room 1011' }),
  event({ id: '381-melody-hyle-requiem', title: 'Melody performs Hyle’s Requiem', detail: 'Melody performs Hyle’s Requiem for Seiko and the jurisdiction supervisor while Kacho remains nearby reading.', tracks: ['melody', 'seiko', 'kacho', 'music'], location: 'Black Whale · Tier 1 · Room 1010/1011 area' }),
  event({ id: '381-banquet-performance-discussion', title: 'Seiko asks Melody to perform again at the banquet', detail: 'Seiko enthusiastically praises Melody and asks for the requiem at the banquet. Melody says she has another piece that would be more suitable for the event.', tracks: ['melody', 'seiko', 'banquet', 'music'], location: 'Black Whale · Tier 1' }),
  event({ id: '381-supervisor-offers-contact', title: 'The jurisdiction supervisor offers Melody an unofficial support channel', detail: 'The supervisor compliments Melody, suggests she may be able to protect the prince until landfall, and invites her to call if problems arise.', tracks: ['melody', 'jurisdiction', 'support', 'surveillance'], location: 'Black Whale · Tier 1' }),
  event({ id: '381-phone-record-counterintelligence', title: 'Melody warns that telephone records are vulnerable intelligence', detail: 'Melody rejects casual telephone contact because other princes could potentially access the call records. The supervisor proposes creating an official monitoring pretext if necessary.', tracks: ['melody', 'counterintelligence', 'telephone', 'jurisdiction'], location: 'Black Whale · Tier 1' }),
  event({ id: '381-supervisor-heartbeat-suspicion', title: 'Melody finds the supervisor’s heartbeat suspicious', detail: 'Listening to the supervisor’s heartbeat, Melody finds it strangely abnormal and considers the possibility that he has been manipulated by a Nen user. She interprets the situation as evidence that opponents may already be developing defensive countermeasures.', tracks: ['melody', 'manipulation', 'nen', 'counterintelligence'], location: 'Black Whale · Tier 1', confidence: 'Melody’s suspicion only; manipulation is not confirmed in Chapter 381.' }),
  event({ id: '381-rihan-exposure-timing', title: 'Rihan estimates Salé-salé’s influence timing', detail: 'Watching Koroabde’s changing attitude, Rihan estimates that the smoke effect manifests around seventy hours after exposure for him, while Salé-salé’s closest associates can reach maximum affection in roughly eight hours.', tracks: ['rihan', 'koroabde', 'sale-sale', 'guardian-spirit-beast', 'analysis'], location: 'Black Whale · Tier 1 · Room 1008', confidence: 'Rihan’s observational estimate; the archive does not treat the timing as a universal fixed threshold for every target.' }),
  event({ id: '381-rihan-dictatorship-theory', title: 'Rihan theorizes that Salé-salé’s influence could propagate to the entire kingdom', detail: 'Rihan extrapolates that the Guardian Spirit Beast’s contagious goodwill mechanism could potentially scale into an absolute dictatorship if allowed to spread widely enough.', tracks: ['rihan', 'sale-sale', 'guardian-spirit-beast', 'theory'], location: 'Black Whale · Tier 1 · Room 1008', confidence: 'Rihan’s strategic extrapolation, not confirmed future outcome.' }),
  event({ id: '381-predator-devours-clone', title: 'Predator devours Koroabde’s clone and breaks the influence', detail: 'Rihan releases Predator. It consumes the small clone above Koroabde, after which the guard immediately snaps out of his altered affectionate state.', tracks: ['rihan', 'predator', 'koroabde', 'sale-sale'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '381-predator-devours-gsb', title: 'Predator consumes Salé-salé’s Guardian Spirit Beast', detail: 'Predator then turns on Salé-salé’s Guardian Spirit Beast and consumes the entire beast in one bite, completing Rihan’s mission.', tracks: ['rihan', 'predator', 'sale-sale', 'guardian-spirit-beast'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '381-predator-48h-lockout', title: 'Rihan enters a forty-eight-hour Nen lockout after Predator succeeds', detail: 'After Predator completes the mission, Rihan states that he will be unable to use Nen for forty-eight hours and requests that Yushohi replace him because Yushohi’s ability is better suited to assassination.', tracks: ['rihan', 'yushohi', 'predator', 'benjamin-guards'], location: 'Black Whale · Tier 1 · Room 1008' }),
  event({ id: '381-stinger-ball-fugetsu', title: 'Yushohi reveals that Stinger Ball is attached to Fugetsu', detail: 'Yushohi thinks through Fugetsu’s increased danger after the exposure of her transportation ability. Although he reduced his En because he feared clashes with other Nen users and therefore failed to track her escape, he confirms that he successfully attached Stinger Ball to Fugetsu.', tracks: ['yushohi', 'fugetsu', 'stinger-ball', 'assassination'], location: 'Black Whale · Tier 1 · Room 1011' }),
  event({ id: '381-yushohi-replaces-rihan', title: 'Yushohi receives the order to replace Rihan', detail: 'Yushohi receives the reassignment order after Rihan’s Predator mission succeeds and Rihan loses access to Nen for forty-eight hours.', tracks: ['yushohi', 'rihan', 'benjamin-guards', 'assignment'], location: 'Black Whale · Tier 1' }),
  event({ id: '381-lockdown-lifted', title: 'The lower-tier lockdown is lifted', detail: 'At 8:00 p.m. on Voyage Day 5, a shipwide announcement states that the stowaway has been captured and the lockdown order has been lifted.', tracks: ['black-whale', 'security', 'lockdown', 'stowaway'], location: 'Black Whale', time: 'Voyage Day 5 · 8:00 p.m.' }),
]);

export const succession381FugetsuCustodyResearch = freeze({
  prince: 'Fugetsu Hui Guo Rou',
  discoveryContext: 'Found on the lower tiers without an ID before being taken to the Tier 3 Central Police Station.',
  roomCheck: 'Mizaistom’s side confirms Fugetsu is absent from Room 1011 and ordinary corridor footage does not explain her movement.',
  questioningState: 'Fugetsu refuses substantive explanation and asks to speak with Kacho.',
  disposition: 'Returned to Tier 1 without confinement but placed under seventy-two-hour surveillance.',
  banquetException: 'Monitoring is scheduled to be temporarily lifted before the Sunday-night banquet.',
  unresolvedRoute: 'Chapter 381 strengthens the teleportation interpretation but does not fully document the route mechanics used to reach the lower tiers.',
  source,
});

export const succession381HunterCodeRetrospective = freeze({
  visibleChapter381Message: 'The spoken call outwardly tells Melody to assist Keeney in preventing Kacho and Fugetsu from escaping.',
  retrospectiveDecode: 'Assist Princes escape fully',
  revealBoundary: 'The supplied Chapter 381 notes state that Chapter 383 later explains the Hunter Code used to decode the call. The phrase is therefore retrospective metadata, not explicit Chapter 381 character knowledge.',
  vizMethod: 'The official Viz translation begins with 11:55 and uses the eleventh word of each following sentence.',
  japaneseDifference: 'The supplied notes state that the Japanese text uses 13:44 and the corresponding clause-based rule, while communicating the same hidden meaning.',
  source,
});

export const succession381MelodySupervisorResearch = freeze({
  subject: 'Kakin jurisdiction supervisor',
  overtPosition: 'Offers Melody support, suggests an official monitoring pretext, and expresses hope that Nasubi might still be moved by words.',
  melodyAssessment: 'Melody finds his heartbeat strange and considers possible Nen manipulation.',
  certainty: 'possible manipulation only; not confirmed in Chapter 381',
  counterintelligenceConstraint: 'Melody avoids casual telephone contact because call records could expose coordination to rival princes.',
  source,
});

export const succession381PredatorResolutionResearch = freeze({
  user: 'Rihan',
  target: 'Salé-salé Hui Guo Rou Guardian Spirit Beast',
  observedTimingAnalysis: freeze({
    koroabde: 'roughly 70 hours before the influence visibly manifests, according to Rihan’s observation',
    closeAssociates: 'roughly 8 hours to maximum affection, according to Rihan’s analysis',
  }),
  observedResult: 'Predator consumes Koroabde’s clone, immediately ending his trance, then consumes Salé-salé’s Guardian Spirit Beast.',
  postUseCost: 'Rihan cannot use Nen for 48 hours after successful completion of the mission.',
  strategicConsequence: 'Rihan requests replacement by Yushohi, whom he considers better suited to assassination.',
  extrapolationBoundary: 'Rihan’s absolute-dictatorship scenario remains his extrapolation and is not stored as a guaranteed future effect.',
  source,
});

export const succession381StingerBallResearch = freeze({
  user: 'Yushohi',
  target: 'Fugetsu Hui Guo Rou',
  confirmedState: 'Stinger Ball is already attached to Fugetsu by Chapter 381.',
  context: 'Yushohi had reduced his En because he feared provoking other Nen users, which contributed to his failure to track Fugetsu’s escape movement.',
  mechanicsBoundary: 'The supplied Chapter 381 material does not explain Stinger Ball’s complete activation, trigger, effect, range, removal method, or official Nen classification.',
  source,
});

export const succession381SecurityResolutionResearch = freeze({
  priorState: 'Tier 3 and below were under a martially enforced lockdown/curfew after the lower-tier killings.',
  chapterEnd: 'At 8:00 p.m. on Voyage Day 5, the ship announces that the stowaway has been captured and the lockdown is lifted.',
  identificationBoundary: 'The supplied Chapter 381 material does not identify the announced captured stowaway in this scene.',
  source,
});

export const succession381RelationshipRecords = freeze([
  freeze({ from: 'Mizaistom Nana', to: 'Fugetsu Hui Guo Rou', type: 'Protective custody / investigation', note: 'Mizaistom questions Fugetsu while trying to protect both twins and later returns her to Tier 1 under jurisdiction surveillance rather than confinement.', phase: 'Active contest and voyage', chapters: '380–381', state: 'protective investigation and monitored release', source }),
  freeze({ from: 'Melody', to: 'Fugetsu Hui Guo Rou', type: 'Covert protection under surveillance pressure', note: 'Melody receives the official anti-escape instruction, keeps Fugetsu’s transportation secret concerns in mind, and continues protecting the twins while avoiding traceable communication.', phase: 'Active contest and voyage', chapters: '377–381', state: 'active protection / counterintelligence constrained', source }),
  freeze({ from: 'Rihan', to: 'Yushohi', type: 'Benjamin-guard tactical handoff', note: 'After Predator succeeds and imposes a 48-hour Nen lockout on Rihan, he requests that Yushohi replace him for the next assassination phase.', phase: 'Active contest and voyage', chapters: '381', state: 'operational handoff active', source }),
]);

export const succession381Mysteries = freeze([
  freeze({ question: 'How exactly did Fugetsu’s transportation effect place her on the lower tiers without an ordinary corridor route?', evidence: 'Room 1011 absence and corridor-footage checks support a nonstandard route, while Melody interprets the incident as confirmation of the transportation Guardian Spirit Beast.', status: 'teleportation strongly supported / full route mechanics open', lastChapter: '381', source }),
  freeze({ question: 'Is the Kakin jurisdiction supervisor being manipulated by Nen?', evidence: 'Melody hears an abnormal heartbeat and considers manipulation possible, but Chapter 381 provides no confirmation.', status: 'open / Melody suspicion only', lastChapter: '381', source }),
  freeze({ question: 'What are Stinger Ball’s actual trigger and effect on Fugetsu?', evidence: 'Yushohi confirms the ability is attached to Fugetsu, but the supplied Chapter 381 material gives no complete mechanics.', status: 'attached / mechanics unresolved', lastChapter: '381', source }),
  freeze({ question: 'What becomes of Salé-salé’s protection after Predator consumes his Guardian Spirit Beast?', evidence: 'Predator fully consumes the beast in Chapter 381 and Rihan immediately transitions to a 48-hour Nen lockout while requesting Yushohi as replacement.', status: 'Guardian Spirit Beast neutralized / assassination phase developing', lastChapter: '381', source }),
]);

const focus = 'Fugetsu’s unexplained lower-tier appearance is investigated and converted into a seventy-two-hour surveillance regime while Melody operates under increasingly dangerous communication constraints. Rihan completes his analysis of Salé-salé’s influence system, releases Predator to consume both Koroabde’s clone and Salé-salé’s Guardian Spirit Beast, and pays a forty-eight-hour Nen lockout that triggers a handoff to Yushohi. Yushohi reveals that Stinger Ball is already attached to Fugetsu, while the chapter ends at 8:00 p.m. on Voyage Day 5 with the lower-tier lockdown lifted.';

export const succession381ChapterResearch = freeze([
  freeze({
    number: 381,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 5',
    voyageDayConfidence: 'Chapter-ending 8:00 p.m. Day 5 timestamp is explicit; earlier same-chapter scenes are treated as preceding Day 5 events.',
    lanes: freeze(['Fugetsu custody and surveillance', 'twin escape counterintelligence', 'Melody jurisdiction contact', 'Salé-salé Guardian Spirit Beast analysis', 'Predator resolution', 'Rihan/Yushohi handoff', 'Stinger Ball threat', 'lower-tier lockdown']),
    focus,
    events: succession381TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Mizaistom Nana', 'Fugetsu Hui Guo Rou', 'Kacho Hui Guo Rou', 'Melody', 'Keeney', 'Seiko Hui Guo Rou', 'Rihan', 'Koroabde', 'Salé-salé Hui Guo Rou', 'Yushohi']),
    appearances: freeze(['Mizaistom Nana', 'Fugetsu Hui Guo Rou', 'Melody', 'Keeney', 'Seiko Hui Guo Rou', 'Kacho Hui Guo Rou', 'Rihan', 'Koroabde', 'Salé-salé Hui Guo Rou', 'Yushohi']),
    relationships: succession381RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession381Mysteries,
    abilities: freeze([succession381PredatorResolutionResearch, succession381StingerBallResearch]),
    locations: freeze(['Black Whale · Tier 3 · Central Police Station', 'Black Whale · Tier 1 · Room 1010', 'Black Whale · Tier 1 · Room 1011', 'Black Whale · Tier 1 · Room 1008']),
    objects: freeze(['Hunter Code call structure', 'Hyle’s Requiem', 'Stinger Ball']),
    organizations: freeze(['Hunter Association', 'Kakin military/police', 'Kakin jurisdiction', 'Benjamin private soldiers']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: true, mysteries: true, locations: true, organizations: true, investigations: true }),
    confidence: freeze([
      'Fugetsu’s ordinary corridor route is not observed; teleportation is strongly supported but complete route mechanics are still not supplied.',
      'The Hunter Code decode comes from the supplied retrospective Chapter 383 note and is not treated as explicit Chapter 381 character knowledge.',
      'Melody’s manipulation suspicion regarding the jurisdiction supervisor remains unconfirmed.',
      'Rihan’s 70-hour / 8-hour values are observational estimates, not universal fixed thresholds for every target.',
      'Predator’s consumption of Salé-salé’s Guardian Spirit Beast and Rihan’s 48-hour Nen lockout are explicit.',
      'Stinger Ball is confirmed attached to Fugetsu, but its complete mechanics remain unsupplied.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession381SourcePolicy,
  }),
]);

export const succession381ChapterFocus = freeze({ 381: focus });
