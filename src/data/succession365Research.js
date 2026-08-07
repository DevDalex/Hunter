const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_365';

export const succession365SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 365 synopsis and chapter-note text',
  titleMetadata: 'English title Choice retained from the maintained project context; Japanese and romanized title text were not supplied in the current message and are left unset.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1 · Room 1014', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 365,
  confidence,
  source,
});

export const succession365TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-365-kurapika-reads-three-calls',
    title: 'Kurapika tries to infer the motives behind the three royal calls',
    detail: 'Kurapika cannot reconcile Benjamin simultaneously sending an assassin and placing a call. He reasons that Zhang Lei and Tubeppa likely want Nen information and tentatively infers that their own troops may lack Nen users.',
    tracks: ['kurapika', 'benjamin', 'zhang-lei', 'tubeppa', 'nen', 'diplomacy'],
    confidence: 'The calls are confirmed; Kurapika’s conclusion that Zhang Lei and Tubeppa likely lack Nen users in their troops is his inference',
  }),
  timelineEvent({
    id: 'voyage-day1-365-bill-stays-with-babimyna',
    title: 'Kurapika keeps Bill with Babimyna',
    detail: 'Kurapika orders Bill to remain with Benjamin’s replacement soldier Babimyna while the diplomatic calls are handled, preserving a Nen-capable guard presence around the embedded observer.',
    tracks: ['kurapika', 'bill', 'babimyna', 'room-1014', 'security'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-shimanu-chooses-zhang-lei',
    title: 'Shimanu defies Kurapika’s intended call order and connects Zhang Lei first',
    detail: 'Rather than prioritize Benjamin, Shimanu connects Kurapika to Zhang Lei. Her decision resolves the immediate call-order problem according to her own survival judgment rather than Kurapika’s initial instruction.',
    tracks: ['shimanu', 'kurapika', 'zhang-lei', 'benjamin', 'diplomacy'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-zhang-lei-truce-offer',
    title: 'Zhang Lei offers a truce and invites Oito, Woble, and Kurapika to Room 1003',
    detail: 'Zhang Lei asks why he was chosen ahead of Benjamin. Kurapika says Zhang Lei seemed more open to discussion because of his interest in Nen. Zhang Lei then offers a truce and invites Kurapika, Oito, and Woble to his quarters to exchange information.',
    tracks: ['zhang-lei', 'kurapika', 'oito', 'woble', 'truce', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-benjamin-call-disconnects',
    title: 'Benjamin’s call drops out of the immediate diplomatic queue',
    detail: 'The supplied chapter notes state that Benjamin disconnects his phone call while Room 1014 proceeds with Zhang Lei and Tubeppa instead.',
    tracks: ['benjamin', 'room-1014', 'diplomacy'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-tubeppa-truce-offer',
    title: 'Tubeppa’s camp offers a truce in exchange for Guardian Spirit Beast information',
    detail: 'After the Zhang Lei call, Kurapika contacts Tubeppa’s side. Maor offers a truce in exchange for information about the Nen beasts and gives Kurapika one hour to resolve Benjamin’s soldier issue before visiting their quarters.',
    tracks: ['tubeppa', 'maor', 'kurapika', 'guardian-spirit-beast', 'truce'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-shimanu-explains-benjamin-choice',
    title: 'Shimanu explains why she refused to put Benjamin first',
    detail: 'Shimanu says her sole priority is survival. She judges Benjamin to be callous, expects Balsamilco to act as his proxy, and fears that Benjamin’s side may want Kurapika and Shimanu killed in retaliation for Vincent. These are Shimanu’s strategic assessments, not independently confirmed intentions.',
    tracks: ['shimanu', 'benjamin', 'balsamilco', 'vincent', 'survival'],
    confidence: 'Shimanu’s survival motive is confirmed; her predictions about Benjamin and Balsamilco are her analysis',
  }),
  timelineEvent({
    id: 'voyage-day1-365-shimanu-ranks-zhang-lei',
    title: 'Shimanu judges Zhang Lei as the safest first interlocutor',
    detail: 'Shimanu describes Zhang Lei as relatively humble but not so humble that he would tolerate being addressed second. She believes that getting on his good side could delay or possibly prevent him from killing Woble’s camp.',
    tracks: ['shimanu', 'zhang-lei', 'woble', 'diplomacy', 'survival'],
    confidence: 'This is Shimanu’s character assessment and survival calculation',
  }),
  timelineEvent({
    id: 'voyage-day1-365-shimanu-ranks-tubeppa',
    title: 'Shimanu judges Tubeppa as more patient and focused upward in the succession order',
    detail: 'Shimanu says Tubeppa is more patient and primarily committed to defeating princes older than herself while allowing younger princes to survive, making Tubeppa a safer second contact in Shimanu’s analysis.',
    tracks: ['shimanu', 'tubeppa', 'succession-strategy', 'survival'],
    confidence: 'This is Shimanu’s assessment of Tubeppa’s priorities',
  }),
  timelineEvent({
    id: 'voyage-day1-365-babimyna-entry-risk',
    title: 'Shimanu warns that refusing Babimyna access could hand Benjamin a legal opening',
    detail: 'Shimanu argues that leaving Babimyna outside could lead to Royal Army intervention and arrest, which in turn could expose Oito and Woble to Benjamin’s faction. Her murder-suicide framing is a feared scenario, not a confirmed Benjamin plan.',
    tracks: ['shimanu', 'babimyna', 'benjamin', 'oito', 'woble', 'royal-army', 'legal-risk'],
    confidence: 'The legal-access concern is part of Shimanu’s advice; the specific feared cover-up scenario is her projection',
  }),
  timelineEvent({
    id: 'voyage-day1-365-babimyna-waits-inside',
    title: 'Babimyna remains inside Room 1014 while Kurapika, Oito, and Woble visit Zhang Lei',
    detail: 'Kurapika informs Babimyna that he, Oito, and Woble are going to Room 1003. Babimyna chooses to wait in Room 1014, while Bill stays behind and is told to update Tubeppa’s camp if they call.',
    tracks: ['babimyna', 'bill', 'kurapika', 'oito', 'woble', 'room-1014'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-room1003-meeting',
    title: 'Kurapika, Oito, and Woble enter Zhang Lei’s quarters',
    detail: 'The delegation reaches Room 1003 and Zhang Lei receives them, moving the first truce discussion from phone contact to an in-person royal meeting.',
    location: 'Black Whale · Tier 1 · Room 1003',
    tracks: ['zhang-lei', 'kurapika', 'oito', 'woble', 'room-1003', 'diplomacy'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-kurapika-explains-nen',
    title: 'Kurapika explains basic Nen and the Seed Urn link to Zhang Lei',
    detail: 'Kurapika gives Zhang Lei a basic explanation of Nen and tells him the Guardian Spirit Beasts were assigned to the princes through the Seed Urn initiation. This begins the information exchange Zhang Lei requested.',
    location: 'Black Whale · Tier 1 · Room 1003',
    tracks: ['kurapika', 'zhang-lei', 'nen', 'guardian-spirit-beast', 'seed-urn'],
  }),
  timelineEvent({
    id: 'voyage-day1-365-sensitive-information-threshold',
    title: 'Kurapika asks whether Zhang Lei wants to hear information capable of changing the succession war',
    detail: 'After the basic explanation, Kurapika warns that the next information could change the tide of the succession conflict and asks Zhang Lei whether he is willing to continue the conversation in the room.',
    location: 'Black Whale · Tier 1 · Room 1003',
    tracks: ['kurapika', 'zhang-lei', 'information-war', 'succession-contest'],
  }),
]);

export const succession365DiplomaticSequence = freeze([
  freeze({
    priority: 1,
    prince: 'Zhang Lei Hui Guo Rou',
    result: 'Connected first; offers truce and invites Kurapika, Oito, and Woble to Room 1003 for Nen information.',
    status: 'truce offered / in-person negotiation opened',
    source,
  }),
  freeze({
    priority: 2,
    prince: 'Tubeppa Hui Guo Rou',
    result: 'Maor offers a truce in exchange for Guardian Spirit Beast information and grants Kurapika one hour before a visit.',
    status: 'truce offered / follow-up pending',
    source,
  }),
  freeze({
    priority: 3,
    prince: 'Benjamin Hui Guo Rou',
    result: 'Benjamin disconnects the call; Babimyna remains Benjamin’s active embedded Royal Guard in Room 1014.',
    status: 'call ended / surveillance presence continues',
    source,
  }),
]);

export const succession365ShimanuAssessment = freeze({
  actor: 'Shimanu',
  motive: 'Survival',
  judgments: freeze([
    freeze({ subject: 'Benjamin Hui Guo Rou', assessment: 'Callous and dangerous; likely to use Balsamilco as proxy and potentially seek retaliation for Vincent.', certainty: 'Shimanu assessment, not confirmed intent' }),
    freeze({ subject: 'Zhang Lei Hui Guo Rou', assessment: 'Relatively humble but status-conscious; best first contact because respectful handling may delay or avoid hostility.', certainty: 'Shimanu assessment' }),
    freeze({ subject: 'Tubeppa Hui Guo Rou', assessment: 'Patient and focused on older princes, making younger princes comparatively safer in the immediate term.', certainty: 'Shimanu assessment' }),
  ]),
  source,
});

export const succession365Room1014State = freeze({
  location: 'Room 1014',
  activeWobleCore: freeze(['Bill', 'Shimanu']),
  temporarilyAway: freeze(['Kurapika', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou']),
  embeddedBenjaminGuard: 'Babimyna',
  state: 'Kurapika/Oito/Woble temporarily in Room 1003 while Bill and Shimanu remain in Room 1014 with Babimyna.',
  source,
});

export const succession365RelationshipRecords = freeze([
  freeze({
    from: 'Zhang Lei Hui Guo Rou',
    to: 'Woble / Oito household',
    type: 'Truce offer / Nen information negotiation',
    note: 'Zhang Lei offers a truce and invites Kurapika, Oito, and Woble to Room 1003 to discuss Nen and Guardian Spirit Beasts.',
    phase: 'Active contest and voyage',
    chapters: '365–current',
    state: 'negotiation opened / not yet normalized as a completed alliance from Chapter 365 alone',
    source,
  }),
  freeze({
    from: 'Tubeppa Hui Guo Rou',
    to: 'Woble / Oito household',
    type: 'Conditional truce offer',
    note: 'Through Maor, Tubeppa offers a truce in exchange for Guardian Spirit Beast information and allows one hour for Room 1014 to settle the Benjamin-guard issue.',
    phase: 'Active contest and voyage',
    chapters: '365–current',
    state: 'offer pending follow-up',
    source,
  }),
  freeze({
    from: 'Shimanu',
    to: 'Kurapika',
    type: 'Independent survival judgment inside Room 1014',
    note: 'Shimanu overrides Kurapika’s intended call handling and chooses Zhang Lei first because she judges that order to maximize survival chances.',
    phase: 'Active contest and voyage',
    chapters: '365–current',
    state: 'cooperative but independently judgmental',
    source,
  }),
  freeze({
    from: 'Babimyna',
    to: 'Woble / Oito household',
    type: 'Embedded Benjamin Royal Guard presence',
    note: 'Babimyna is admitted inside Room 1014 and waits there while Kurapika, Oito, and Woble visit Zhang Lei.',
    phase: 'Active contest and voyage',
    chapters: '365–current',
    state: 'active embedded presence',
    source,
  }),
]);

export const succession365ContinuityNotes = freeze([
  freeze({
    issue: 'Room 1003 guard identity continuity',
    detail: 'The supplied chapter notes state that an unnamed guard initially appears on Zhang Lei’s left and is replaced several panels later by Slakka; the intended person appears to be Slakka. The archive preserves this as a presentation/continuity note rather than asserting two distinct guards.',
    source,
  }),
]);

export const succession365Mysteries = freeze([
  freeze({
    question: 'Will Zhang Lei’s truce offer become a formal alliance with Woble’s camp?',
    evidence: 'Chapter 365 opens an in-person negotiation and information exchange but does not yet establish every term of a completed alliance.',
    status: 'developing',
    lastChapter: '365',
    source,
  }),
  freeze({
    question: 'Will Tubeppa’s conditional truce become a formal agreement with Room 1014?',
    evidence: 'Maor offers a truce for Guardian Spirit Beast information and gives Kurapika one hour before a follow-up visit.',
    status: 'developing',
    lastChapter: '365',
    source,
  }),
]);

const focus = 'Shimanu resolves Room 1014’s three-prince contact crisis by prioritizing Zhang Lei on survival grounds; Zhang Lei and Tubeppa independently offer truces in exchange for Nen information; Benjamin disconnects while Babimyna remains embedded inside Room 1014; Kurapika, Oito, and Woble visit Room 1003; and Kurapika begins explaining Nen and the Seed Urn-linked Guardian Spirit Beasts to Zhang Lei while preparing to disclose information capable of shifting the succession war.';

export const succession365ChapterResearch = freeze([
  freeze({
    number: 365,
    title: 'Choice',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Room 1014 diplomacy',
      'Shimanu survival calculus',
      'Zhang Lei truce',
      'Tubeppa truce',
      'Benjamin call withdrawal',
      'Babimyna embedded presence',
      'Nen information exchange',
    ]),
    focus,
    events: succession365TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika',
      'Shimanu',
      'Bill',
      'Oito Hui Guo Rou',
      'Woble Hui Guo Rou',
      'Benjamin Hui Guo Rou',
      'Balsamilco Might',
      'Babimyna',
      'Zhang Lei Hui Guo Rou',
      'Tubeppa Hui Guo Rou',
      'Maor',
      'Vincent',
      'Slakka',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · Room 1003',
    ]),
    threadLabels: freeze([
      'Choice',
      'Shimanu',
      'Zhang Lei',
      'Tubeppa',
      'Benjamin',
      'Babimyna',
      'Truce offers',
      'Nen information',
      'Guardian Spirit Beasts',
      'Room 1003',
    ]),
    diplomaticSequence: succession365DiplomaticSequence,
    shimanuAssessment: succession365ShimanuAssessment,
    room1014State: succession365Room1014State,
    continuityNotes: succession365ContinuityNotes,
    relationships: succession365RelationshipRecords,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 365 text',
      'Kurapika’s inference that Zhang Lei and Tubeppa likely lack Nen users in their troops is not promoted to confirmed roster fact',
      'Shimanu’s descriptions of Benjamin, Zhang Lei, Tubeppa, and possible retaliation are stored as her strategic judgments',
      'Zhang Lei and Tubeppa are recorded as offering truces; Chapter 365 alone does not normalize either offer into a fully completed alliance',
      'The Slakka panel discrepancy is preserved as a continuity note rather than creating a second guard identity',
    ]),
    status: 'Maintained chapter summary, chronology, diplomacy sequence, Shimanu assessment, Room 1014 state, truce offers, Nen disclosure, relationships, continuity note, mysteries, and source confidence linked',
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
    titleStatus: 'maintained-project-context',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession365ChapterFocus = freeze({ 365: focus });
