const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_369';

export const succession369SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 369 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1 · Room 1014', tracks, time = 'Voyage Day 2', confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time,
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 369,
  confidence,
  source,
});

export const succession369TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day2-369-eighteen-hours',
    title: 'The voyage reaches its eighteenth hour',
    detail: 'The Black Whale travels through the night as the chapter marks eighteen hours since departure, establishing the beginning of the second voyage day.',
    location: 'Black Whale · at sea',
    tracks: ['black-whale', 'voyage-day-2'],
    time: 'Voyage Day 2 · 18 hours after departure',
  }),
  timelineEvent({
    id: 'voyage-day2-369-kurapika-wakes',
    title: 'Kurapika wakes after roughly nine hours unconscious',
    detail: 'Kurapika regains consciousness in Room 1014. Bill says he avoided calling a doctor because doing so could expose Kurapika’s collapse to the other camps, and reveals that Kurapika was unconscious for about nine hours.',
    tracks: ['kurapika', 'bill', 'emperor-time', 'blackout', 'room-1014'],
    time: 'Voyage Day 2 · about 18 hours after departure',
  }),
  timelineEvent({
    id: 'voyage-day2-369-oito-linked-blackout',
    title: 'Oito is revealed to have shared Kurapika’s nine-hour blackout',
    detail: 'Bill explains that Oito lost consciousness around the same time as Kurapika. She lies in bed with Shimanu nearby, while Stealth Dolphin remains active above her, showing that the transferred stolen-ability state persisted through both blackouts.',
    tracks: ['oito', 'kurapika', 'stealth-dolphin', 'little-eye', 'blackout'],
    time: 'Voyage Day 2 · about 18 hours after departure',
  }),
  timelineEvent({
    id: 'voyage-day2-369-emperor-time-twelve-hours',
    title: 'Kurapika realizes Emperor Time has remained active for about twelve hours',
    detail: 'Seeing Stealth Dolphin still active, Kurapika concludes that Emperor Time has remained on for roughly twelve hours. At the previously established cost of one hour of lifespan per second, the supplied chapter notes approximate the total loss at about five years.',
    tracks: ['kurapika', 'emperor-time', 'stealth-dolphin', 'lifespan-cost'],
    confidence: 'The twelve-hour duration and approximately five-year lifespan loss are supplied chapter-note figures and are preserved as approximate',
  }),
  timelineEvent({
    id: 'voyage-day2-369-kurapika-limit-model',
    title: 'Kurapika forms a working model for Emperor Time overload',
    detail: 'Kurapika wonders whether roughly three hours is the current safe limit for this stolen-ability state, whether exceeding it causes a blackout about three times as long, whether different stolen abilities have different limits, whether the same ability could trigger a faster collapse on repeat use, and whether the deafening heartbeat is an approaching-limit warning.',
    tracks: ['kurapika', 'emperor-time', 'stealth-dolphin', 'working-theory'],
    confidence: 'These are Kurapika’s current conclusions and hypotheses, not a universally confirmed Emperor Time law',
  }),
  timelineEvent({
    id: 'voyage-day2-369-recon-priority-shift',
    title: 'Kurapika changes the Little Eye reconnaissance order toward Tserriednich',
    detail: 'Kurapika tells Oito to prioritize Tserriednich’s quarters instead of continuing in the previous order. Oito challenges whether this mainly serves Kurapika’s personal mission, forcing him to justify the choice strategically.',
    tracks: ['kurapika', 'oito', 'tserriednich', 'little-eye', 'reconnaissance'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-recon-strategy',
    title: 'Kurapika explains why Benjamin and Camilla are lower reconnaissance priorities',
    detail: 'Kurapika argues that Benjamin should be investigated last because his soldiers are likely Nen users and that Camilla’s camp probably also possesses Nen knowledge because she rejected the public class offer. He reasons that Slakka already provides some connection to Camilla’s side through Duazul, while Room 1014 already has direct contact with Zhang Lei and knows almost nothing about Tserriednich’s camp.',
    tracks: ['kurapika', 'benjamin', 'camilla', 'slakka', 'duazul', 'zhang-lei', 'tserriednich', 'strategy'],
    confidence: 'Benjamin/Camilla Nen-capability judgments are Kurapika’s strategic inferences; Shimanu separately confirms Camilla’s unusually strong authority within her household',
  }),
  timelineEvent({
    id: 'voyage-day2-369-woble-kurapika-bond',
    title: 'Woble reaches toward Kurapika as he asks Oito to trust him',
    detail: 'Kurapika kneels and assures Oito that protecting her and Woble remains his purpose. Shimanu points out Woble reaching toward Kurapika and trying to speak; Kurapika touches her hand while Oito watches.',
    tracks: ['kurapika', 'oito', 'woble', 'trust', 'protection'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-oito-sends-roach',
    title: 'Oito pilots the Little Eye cockroach toward Tserriednich’s quarters',
    detail: 'Oito sends the controlled cockroach through the ventilation system toward Room 1004, carefully navigating the route while trying not to increase Kurapika’s burden.',
    location: 'Black Whale · Tier 1 · ventilation route toward Room 1004',
    tracks: ['oito', 'little-eye', 'cockroach', 'tserriednich', 'reconnaissance'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-tserriednich-beast-intercepts',
    title: 'Tserriednich’s Guardian Spirit Beast intercepts and consumes the cockroach',
    detail: 'Faces belonging to Tserriednich’s Guardian Spirit Beast suddenly appear in the ventilation route and open their mouths around the cockroach. Oito screams, later describing a woman’s face appearing from nowhere and concluding that the insect was eaten.',
    location: 'Black Whale · Tier 1 · ventilation route near Room 1004',
    tracks: ['tserriednich', 'guardian-spirit-beast', 'oito', 'little-eye', 'cockroach'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-little-eye-ends',
    title: 'Little Eye deactivates after the cockroach is lost',
    detail: 'Stealth Dolphin announces that Little Eye has deactivated after the cockroach is consumed. Kurapika then tells Oito to order Stealth Dolphin itself to deactivate, ending the outstanding transferred-ability state.',
    tracks: ['little-eye', 'stealth-dolphin', 'oito', 'kurapika'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-kurapika-post-deactivation-pain',
    title: 'Kurapika suffers severe pain after ending the prolonged ability state',
    detail: 'After Stealth Dolphin is dismissed, pain shoots through Kurapika’s body. He reflects that the physical toll remains severe despite the restrictions he placed on his ability and recognizes that the system is a dangerous double-edged sword.',
    tracks: ['kurapika', 'emperor-time', 'stealth-dolphin', 'physical-toll'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-oito-asks-to-learn-nen',
    title: 'Oito asks Kurapika to teach her Nen',
    detail: 'After apologizing for doubting his priorities, Oito asks Kurapika to teach her Nen so that she can better respond to the dangers around Woble.',
    tracks: ['oito', 'kurapika', 'nen-training'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-oito-awakened',
    title: 'Kurapika reveals that Oito is already Nen-awakened',
    detail: 'Kurapika explains that his stolen-ability transfer system forcibly opened Oito’s aura nodes when she used Stealth Dolphin, meaning she can now use Nen even though she has not yet undergone normal training or developed mastery.',
    tracks: ['oito', 'kurapika', 'stealth-dolphin', 'nen-awakening'],
  }),
  timelineEvent({
    id: 'voyage-day2-369-class-begins',
    title: 'Kurapika’s first public Nen class assembles in Room 1014',
    detail: 'At 9 a.m. on the second voyage day, sixteen attendees from rival royal households gather in Woble’s living quarters for Kurapika’s basic Nen instruction. The supplied notes identify twelve bodyguards and four servants among the attendees.',
    tracks: ['kurapika', 'nen-training', 'room-1014', 'all-princes'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-marayam-representatives',
    title: 'Sevanti sends Belerainte and Barrigen with different expectations',
    detail: 'Sevanti instructs Belerainte to report if Kurapika teaches anything incorrectly and orders Barrigen to learn Nen within the promised timeframe. Barrigen is pleased to have been selected over Vergei.',
    tracks: ['sevanti', 'belerainte', 'barrigen', 'marayam', 'nen-training'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-kacho-fugetsu-servants',
    title: 'Kacho and Fugetsu send servants with very different attitudes toward the class',
    detail: 'Two Fugetsu servants wonder why they were chosen to attend, while two Kacho servants are pleased simply to be away from Kacho during the lesson.',
    tracks: ['fugetsu', 'kacho', 'servants', 'nen-training'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-halkenburg-feather-marks',
    title: 'Halkenburg’s representatives connect their feather marks to his Guardian Spirit Beast',
    detail: 'Two of Halkenburg’s guards attend under orders to learn about Nen beasts. They examine feather-like marks on their hands and interpret them as originating from Halkenburg’s Guardian Spirit Beast and as reflecting the prince’s resolve.',
    tracks: ['halkenburg', 'guardian-spirit-beast', 'feather-marks', 'nen-training'],
    confidence: 'The marks are observed; the guards’ interpretation of what the marks signify is their own conclusion in the supplied synopsis',
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-sale-sale-luzurus-reps',
    title: 'Mushaho and Satobi evaluate the class as an intelligence opportunity',
    detail: 'Mushaho from Salé-salé’s camp recognizes the mission’s importance. Satobi from Luzurus’s camp welcomes the chance to speak with guards from other households but worries that Kurapika may be manipulating everyone through the class.',
    tracks: ['mushaho', 'sale-sale', 'satobi', 'luzurus', 'nen-training', 'counterintelligence'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-tubeppa-recruitment',
    title: 'Maor and Longhi plan a covert recruitment approach to Kurapika',
    detail: 'Tubeppa sends Maor and Longhi with the objective of recruiting Kurapika and, if possible, Woble’s entire camp. They discuss using a written letter as the best way to negotiate secretly inside the heavily monitored environment.',
    tracks: ['tubeppa', 'maor', 'longhi', 'kurapika', 'recruitment', 'diplomacy'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-tserriednich-kill-order',
    title: 'Myuhan and Danjin enter under Tserriednich’s two-week kill order',
    detail: 'Tserriednich has ordered Myuhan and Danjin to kill everyone involved if they fail to learn Nen within two weeks. Myuhan is excited by the threat, while Danjin warns that deliberately failing to learn will not provide an escape from the order.',
    tracks: ['tserriednich', 'myuhan', 'danjin', 'nen-training', 'kill-order'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-zhang-lei-watch-order',
    title: 'Tenftory attends under Zhang Lei’s order to watch Kurapika’s contacts',
    detail: 'Zhang Lei instructs Tenftory to watch anyone who speaks with Kurapika because Zhang Lei considers Kurapika a key player. Tenftory decides the First, Fourth, and Fifth Princes deserve particular scrutiny.',
    tracks: ['zhang-lei', 'tenftory', 'kurapika', 'surveillance'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-furykov-assessment',
    title: 'Furykov attends as an experienced Nen user and searches for concealed users',
    detail: 'Benjamin’s soldier Furykov already knows Nen and treats the class as an opportunity to learn enemy Nen types and abilities. He claims he can recognize Nen users from subtle differences around the eyes when viewed in profile and says four people present are pretending not to know Nen.',
    tracks: ['furykov', 'benjamin', 'nen-user-detection', 'counterintelligence'],
    confidence: 'Furykov’s Nen-user-detection method and count of four concealed users are his claims and assessments; Chapter 369 does not independently identify all four',
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
  timelineEvent({
    id: 'voyage-day2-369-silent-majority',
    title: 'An unknown observer prepares Silent Majority inside the Nen class',
    detail: 'An unidentified person watches Furykov from the back of Room 1014, reads his hostile readiness from his aura, and prepares to activate an ability named Silent Majority. The supplied Chapter 369 text does not identify the user or explain the ability’s full mechanics.',
    tracks: ['silent-majority', 'unknown-user', 'furykov', 'room-1014', 'hostile-nen'],
    time: 'Voyage Day 2 · 9:00 a.m.',
  }),
]);

export const succession369EmperorTimeModel = freeze({
  observedState: 'Emperor Time remained active for approximately 12 hours while the Stealth Dolphin / Little Eye transfer state persisted.',
  suppliedApproximateLifespanLoss: 'Approximately five years',
  blackout: 'Kurapika and Oito were unconscious for roughly nine hours.',
  kurapikaWorkingConclusions: freeze([
    'The current stolen-ability state may have an effective limit of around three hours before collapse.',
    'Exceeding that limit may produce a blackout roughly three times as long.',
    'Different stolen abilities may impose different practical time limits.',
    'A repeat use of the same stolen ability may trigger collapse sooner after recovery.',
    'A deafening or pounding heartbeat may warn that the practical limit is approaching.',
  ]),
  certainty: 'Observed durations are confirmed by the supplied chapter notes; the causal model and generalized limits are Kurapika’s current conclusions and remain provisional.',
  source,
});

export const succession369OitoNenAwakening = freeze({
  person: 'Oito Hui Guo Rou',
  status: 'Nen-awakened / untrained',
  mechanism: 'Using the transferred Stealth Dolphin / Little Eye state forcibly opened Oito’s aura nodes.',
  consequence: 'Oito can now use Nen and asks Kurapika for instruction, but Chapter 369 does not present her as trained or proficient.',
  linkedBlackout: 'Oito shared Kurapika’s roughly nine-hour blackout while the transferred ability remained active.',
  source,
});

export const succession369TrainingRoster = freeze({
  start: 'Voyage Day 2 · 9:00 a.m.',
  location: 'Room 1014 / Woble’s living quarters',
  totalAttendees: 16,
  composition: '12 bodyguards and 4 servants',
  knownNenUsers: freeze(['Furykov', 'Belerainte']),
  representatives: freeze([
    freeze({ camp: 'Marayam', people: freeze(['Belerainte', 'Barrigen']), purpose: 'Belerainte monitors the quality/accuracy of the instruction; Barrigen is expected to learn within the promised period.' }),
    freeze({ camp: 'Fugetsu', people: freeze(['Two unnamed servants']), purpose: 'Attend despite uncertainty about why they were selected.' }),
    freeze({ camp: 'Kacho', people: freeze(['Two unnamed servants']), purpose: 'Attend and are pleased to be away from Kacho.' }),
    freeze({ camp: 'Halkenburg', people: freeze(['Two unnamed guards']), purpose: 'Learn what Nen beasts are and investigate the feather marks on their hands.' }),
    freeze({ camp: 'Salé-salé', people: freeze(['Mushaho']), purpose: 'Treat the class as an important mission.' }),
    freeze({ camp: 'Luzurus', people: freeze(['Satobi']), purpose: 'Gather information and interact with other guards while remaining wary of manipulation.' }),
    freeze({ camp: 'Tubeppa', people: freeze(['Maor', 'Longhi']), purpose: 'Learn Nen while covertly seeking to recruit Kurapika and possibly Woble’s camp.' }),
    freeze({ camp: 'Tserriednich', people: freeze(['Myuhan', 'Danjin']), purpose: 'Learn within two weeks under Tserriednich’s threat to kill everyone involved if they fail.' }),
    freeze({ camp: 'Zhang Lei', people: freeze(['Tenftory']), purpose: 'Watch people who make contact with Kurapika and assess rival camps.' }),
    freeze({ camp: 'Benjamin', people: freeze(['Furykov']), purpose: 'Use existing Nen expertise to identify concealed users and learn enemy types/abilities.' }),
  ]),
  absentCamps: freeze(['Tyson', 'Camilla', 'Momoze', 'Woble as host rather than visiting camp']),
  source,
});

export const succession369FurykovAssessment = freeze({
  observer: 'Furykov',
  knownStatus: 'Confirmed Nen user in the supplied chapter notes',
  claimedDetectionMethod: 'Subtle differences around a person’s eyes when viewed in profile',
  concealedUserCountClaim: 4,
  identificationStatus: 'Chapter 369 does not independently identify all four people Furykov believes are pretending to be non-users.',
  tacticalPosture: 'Prepared to invoke self-defense if another attendee activates a threatening Nen ability.',
  source,
});

export const succession369AbilityRecords = freeze([
  freeze({
    ability: 'Silent Majority',
    owner: 'Unknown',
    category: 'Unknown hostile Nen ability',
    knownAtChapterBoundary: 'An unidentified person inside Room 1014 prepares to activate Silent Majority while observing Furykov.',
    mechanics: 'Not supplied in Chapter 369.',
    target: 'Not yet confirmed in the supplied Chapter 369 text.',
    confidence: 'Ability name and hostile activation setup are confirmed; user identity, Nen category, conditions, range, and complete effects remain unknown.',
    chapter: 369,
    source,
  }),
]);

export const succession369BodyStates = freeze([
  freeze({
    person: 'Kurapika',
    state: 'conscious after approximately nine-hour blackout; severe post-ability pain',
    cause: 'Prolonged Emperor Time / Stealth Dolphin stolen-ability state according to the supplied chapter',
    chapter: 369,
    source,
  }),
  freeze({
    person: 'Oito Hui Guo Rou',
    state: 'conscious after approximately nine-hour linked blackout; Nen-awakened but untrained',
    cause: 'Stealth Dolphin linkage caused the shared blackout; transferred ability use forcibly opened her aura nodes',
    chapter: 369,
    source,
  }),
]);

export const succession369RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Oito / Woble',
    type: 'Protection trust deepens',
    note: 'Kurapika reaffirms that protecting Oito and Woble is his priority; Oito challenges his reconnaissance priorities but later apologizes, thanks him through her actions, and asks to learn Nen. Woble reaches toward Kurapika during the exchange.',
    phase: 'Active contest and voyage',
    chapters: '369–current',
    state: 'active / trust deepening',
    source,
  }),
  freeze({
    from: 'Tubeppa / Maor / Longhi',
    to: 'Kurapika / Woble camp',
    type: 'Covert recruitment effort',
    note: 'Tubeppa’s representatives attend the Nen class while planning to recruit Kurapika and, if possible, the whole Woble camp; they consider a letter the safest covert negotiation channel.',
    phase: 'Active contest and voyage',
    chapters: '369–current',
    state: 'active / covert approach not yet delivered',
    source,
  }),
  freeze({
    from: 'Tserriednich',
    to: 'Myuhan / Danjin / Room 1014 class',
    type: 'Conditional kill order',
    note: 'Tserriednich orders Myuhan and Danjin to kill everyone involved if they fail to learn Nen within two weeks.',
    phase: 'Active contest and voyage',
    chapters: '369–current',
    state: 'active threat',
    source,
  }),
  freeze({
    from: 'Zhang Lei / Tenftory',
    to: 'Kurapika contacts',
    type: 'Political surveillance',
    note: 'Zhang Lei orders Tenftory to monitor anyone who speaks with Kurapika because Kurapika is considered a key player in the contest.',
    phase: 'Active contest and voyage',
    chapters: '369–current',
    state: 'active',
    source,
  }),
]);

export const succession369Mysteries = freeze([
  freeze({
    question: 'What are the true overload and blackout rules governing Emperor Time while Stealth Dolphin holds or shares a stolen ability?',
    evidence: 'Kurapika and Oito lose consciousness after the prolonged Little Eye state, Emperor Time remains active for roughly twelve hours, and Kurapika proposes a three-hour practical limit, a triple-duration blackout, ability-specific limits, repeat-use variation, and a heartbeat warning. These remain his working conclusions.',
    status: 'developing mechanics / Kurapika working model',
    lastChapter: '369',
    source,
  }),
  freeze({
    question: 'How did Tserriednich’s Guardian Spirit Beast detect and intercept the Little Eye cockroach in the ventilation system?',
    evidence: 'The beast’s faces appear in the vent and the cockroach is consumed, ending Little Eye, but Chapter 369 does not explain the detection mechanism, range, or whether this is a distinct ability.',
    status: 'open',
    lastChapter: '369',
    source,
  }),
  freeze({
    question: 'Who is using Silent Majority inside Room 1014, and what does the ability do?',
    evidence: 'An unidentified observer reads Furykov’s hostile readiness and prepares to activate Silent Majority at the back of the Nen class. The supplied chapter does not identify the user or explain the mechanics.',
    status: 'open / immediate threat',
    lastChapter: '369',
    source,
  }),
  freeze({
    question: 'Who are the four concealed Nen users Furykov believes are pretending to be beginners?',
    evidence: 'Furykov claims he can detect experienced Nen users from subtle visual cues and counts four people concealing their ability, but Chapter 369 does not independently confirm all four identities.',
    status: 'open / Furykov assessment',
    lastChapter: '369',
    source,
  }),
]);

const focus = 'Eighteen hours after departure, Kurapika and Oito wake from a linked nine-hour blackout and discover that Emperor Time remained active for roughly twelve hours, costing Kurapika about five years of lifespan; Kurapika forms a provisional overload model, redirects Little Eye toward Tserriednich, and loses the cockroach when Tserriednich’s Guardian Spirit Beast intercepts it; Oito learns that the transferred ability forcibly awakened her Nen; and at 9 a.m. the first sixteen-person Nen class begins as rival camps pursue overlapping intelligence, recruitment, assassination, and counterintelligence goals while an unknown user prepares Silent Majority.';

export const succession369ChapterResearch = freeze([
  freeze({
    number: 369,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze([
      'Emperor Time overload',
      'Stealth Dolphin shared-state mechanics',
      'Oito Nen awakening',
      'Little Eye reconnaissance failure',
      'Tserriednich Guardian Spirit Beast defense',
      'First public Nen class',
      'Multi-camp intelligence operations',
      'Silent Majority',
    ]),
    focus,
    events: succession369TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Bill', 'Shimanu', 'Tserriednich Hui Guo Rou', 'Benjamin Hui Guo Rou', 'Camilla Hui Guo Rou', 'Zhang Lei Hui Guo Rou', 'Slakka', 'Duazul Hui Guo Rou', 'Sevanti Hui Guo Rou', 'Belerainte', 'Barrigen', 'Vergei', 'Fugetsu Hui Guo Rou', 'Kacho Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Mushaho', 'Salé-salé Hui Guo Rou', 'Satobi', 'Luzurus Hui Guo Rou', 'Maor', 'Longhi', 'Tubeppa Hui Guo Rou', 'Myuhan', 'Danjin', 'Tenftory', 'Furykov', 'Unknown Silent Majority user',
    ]),
    locations: freeze([
      'Black Whale · at sea',
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · ventilation route toward Room 1004',
    ]),
    threadLabels: freeze([
      'Emperor Time', 'Stealth Dolphin', 'Little Eye', 'Oito', 'Nen awakening', 'Tserriednich', 'Guardian Spirit Beast', 'Nen class', 'Furykov', 'Silent Majority', 'Room 1014',
    ]),
    emperorTimeModel: succession369EmperorTimeModel,
    oitoNenAwakening: succession369OitoNenAwakening,
    trainingRoster: succession369TrainingRoster,
    furykovAssessment: succession369FurykovAssessment,
    abilities: succession369AbilityRecords,
    relationships: succession369RelationshipRecords,
    bodyStates: succession369BodyStates,
    mysteries: succession369Mysteries,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 369 text.',
      'The supplied notes’ roughly twelve-hour Emperor Time duration and approximately five-year lifespan loss are preserved as approximate figures.',
      'Kurapika’s proposed three-hour practical limit, triple-duration blackout, ability-specific limits, repeat-use variation, and heartbeat warning are stored as his working model rather than universal confirmed mechanics.',
      'Oito is recorded as Nen-awakened but untrained after her aura nodes are forcibly opened through the transferred Stealth Dolphin state.',
      'Furykov’s four-hidden-user count is stored as his assessment, not as four independently confirmed identities.',
      'Silent Majority is recorded only by the name and immediate hostile activation setup supplied in Chapter 369; no later mechanics or user identity are imported.',
    ]),
    status: 'Maintained chapter summary, chronology, Emperor Time overload model, Oito Nen awakening, reconnaissance failure, Nen-class roster, Furykov assessment, Silent Majority introduction, relationships, body states, mysteries, and source confidence linked',
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
    titleStatus: 'not supplied in current source text',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession369ChapterFocus = freeze({ 369: focus });
