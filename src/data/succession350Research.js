const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_350';

export const succession350SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 350',
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
  chapter: 350,
  confidence,
  source,
});

export const succession350TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-350-kurapika-recruits-network',
    title: 'Kurapika recruits five trusted Hunters into the six-prince bodyguard market',
    detail: 'Kurapika recruits Biscuit Krueger, Basho, Izunavi, Hanzo, and Melody so that each can enter one of the six publicly recruiting prince households while Kurapika takes the sixth opening. Their shared intelligence objective is to create a route that will bring Kurapika into physical contact with Tserriednich.',
    location: 'Kurapika recruitment meeting · pre-voyage',
    tracks: ['kurapika', 'biscuit', 'basho', 'izunavi', 'hanzo', 'melody', 'bodyguards', 'tserriednich'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-six-postings-analysis',
    title: 'The group analyzes why six prince postings appeared simultaneously',
    detail: 'Izunavi, Hanzo, Basho, Melody, and Biscuit compare the unusually synchronized job offers. They suspect that experienced or higher-ranking princes may rely on private forces while less secure households use open recruitment, and Biscuit flags the wording around elimination of threats as especially suspicious.',
    location: 'Kurapika recruitment meeting · pre-voyage',
    tracks: ['princes', 'bodyguards', 'kurapika-network', 'succession-contest'],
    confidence: 'The interpretations of what the listings imply are the characters’ pre-interview analysis, not confirmed identities or motives at that point',
  }),
  timelineEvent({
    id: 'pre-voyage-350-contact-tserriednich-objective',
    title: 'Kurapika defines physical access to Tserriednich as the mission threshold',
    detail: 'Kurapika says the infiltration exists to obtain information sufficient to create direct physical contact with Tserriednich, because physical proximity would let him use more of his abilities effectively. If that access is achieved, he considers the remaining infiltration mission expendable.',
    location: 'Kurapika recruitment meeting · pre-voyage',
    tracks: ['kurapika', 'tserriednich', 'scarlet-eyes', 'mission'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-kurapika-reads-job-profiles',
    title: 'Kurapika profiles the six anonymous job listings',
    detail: 'Kurapika studies small differences in the otherwise similar postings, including timing, salary behavior, interview style, and competitive one-upmanship. He narrows his attention to a high-paying competitive listing and a listing whose salary never changes, treating the latter as evidence of self-esteem and self-control.',
    location: 'Kurapika recruitment meeting · job-posting review',
    tracks: ['kurapika', 'halkenburg', 'bodyguards', 'profiling'],
    confidence: 'These personality readings are Kurapika’s deductions from anonymous postings, not objective personality tests',
  }),
  timelineEvent({
    id: 'pre-voyage-350-halkenburg-profile',
    title: 'Halkenburg’s public history makes him Kurapika’s preferred route to Tserriednich',
    detail: 'Kurapika reviews Halkenburg as an honors student and open royal critic who reportedly had poor relations with his mother and sisters but publicly identified Tserriednich as the one prince he accepted. This relationship makes Halkenburg appear to be Kurapika’s best bridge to the Fourth Prince.',
    location: 'Kurapika recruitment meeting · Halkenburg profile review',
    tracks: ['kurapika', 'halkenburg', 'tserriednich', 'duazul', 'camilla', 'tubeppa'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-kurapika-mistakes-oito-post',
    title: 'Kurapika applies to the listing he believes belongs to Halkenburg',
    detail: 'Kurapika selects the anonymous offer he believes best matches Halkenburg and is invited to a Hui Guo Rou family hotel. His assumption is wrong: the employer is Queen Oito, mother of the Fourteenth Prince Woble.',
    location: 'Hui Guo Rou family hotel · interview',
    tracks: ['kurapika', 'halkenburg', 'oito', 'woble', 'bodyguards'],
    confidence: 'Kurapika’s identification of the listing as Halkenburg’s is explicitly shown to be mistaken',
  }),
  timelineEvent({
    id: 'pre-voyage-350-oito-decoy-recruitment',
    title: 'Oito reveals that her vague listing deliberately targeted Halkenburg-seeking applicants',
    detail: 'Oito explains that the recruitment information was intentionally vague so hostile applicants could not identify their true target. Halkenburg did not post a listing at all. Oito instead sought applicants who believed they were approaching Halkenburg, because assassins or manipulative followers could still be useful if their goals required Woble and Oito to remain alive.',
    location: 'Hui Guo Rou family hotel · Oito interview',
    tracks: ['oito', 'woble', 'halkenburg', 'bodyguards', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-oito-reveals-succession-war',
    title: 'Oito tells Kurapika that the voyage is a lethal succession war',
    detail: 'Oito explains that the royal children cannot simply withdraw from the contest because Nasubi taught them never to renounce the opportunity to become king; a deserter would cease to be recognized as his child and would likely be killed. She also tells Kurapika that higher-ranking princes possess their own private armies.',
    location: 'Hui Guo Rou family hotel · Oito interview',
    tracks: ['oito', 'woble', 'nasubi', 'succession-contest', 'private-armies'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-oito-explains-guard-gap',
    title: 'Oito explains why ordinary professional guards are not enough',
    detail: 'Oito says conventional professional guards specialize in protecting dignitaries rather than proactively killing threats. Her household therefore prefers applicants with their own aggressive motives, because such people may be willing to act more decisively while still needing Oito and Woble alive long enough to pursue their own goals.',
    location: 'Hui Guo Rou family hotel · Oito interview',
    tracks: ['oito', 'woble', 'bodyguards', 'security'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-oito-offers-escape-contract',
    title: 'Oito offers Kurapika ten times the pay to get her and Woble off the ship',
    detail: 'Oito offers Kurapika a choice: keep the conversation confidential and leave for the original fee, or accept ten times the payment to protect Oito and Woble and find a way to remove them from the voyage. She hopes that if Halkenburg eventually becomes king, his participation in the succession war could be used as leverage because public exposure would damage him severely.',
    location: 'Hui Guo Rou family hotel · Oito interview',
    tracks: ['oito', 'woble', 'kurapika', 'halkenburg', 'escape-plan'],
    confidence: 'Using Halkenburg’s participation as leverage is Oito’s proposed strategy, not a guaranteed future outcome',
  }),
  timelineEvent({
    id: 'pre-voyage-350-kurapika-accepts-woble-contract',
    title: 'Kurapika accepts Oito’s protection-and-escape mission',
    detail: 'Kurapika agrees to take the higher-risk assignment if Oito accepts his conditions. Oito agrees, entrusts Woble to him physically during the meeting, and Kurapika becomes the bodyguard protecting Queen Oito and the Fourteenth Prince.',
    location: 'Hui Guo Rou family hotel · Oito interview',
    tracks: ['kurapika', 'oito', 'woble', 'bodyguards'],
  }),
  timelineEvent({
    id: 'pre-voyage-350-all-six-placements',
    title: 'Kurapika’s six-person infiltration network is distributed across six prince households',
    detail: 'The recruitment network lands in six households: Kurapika with Oito and Woble, Izunavi with Tyson, Biscuit with Marayam, Basho with Luzurus, Melody with Kacho, and Hanzo with Momoze. The placements create a distributed intelligence net across the royal contest before boarding.',
    location: 'Kakin prince households · bodyguard hiring results',
    tracks: ['kurapika', 'izunavi', 'biscuit', 'basho', 'melody', 'hanzo', 'bodyguards', 'princes'],
  }),
]);

export const succession350BodyguardAssignments = freeze([
  freeze({ hunter: 'Kurapika', employer: 'Queen Oito Hui Guo Rou', prince: 'Woble Hui Guo Rou', order: 14, purpose: 'Protect Oito and Woble, seek an escape route, and use the royal position to continue the Scarlet Eyes / Tserriednich mission', source }),
  freeze({ hunter: 'Izunavi', employer: 'Tyson Hui Guo Rou', prince: 'Tyson Hui Guo Rou', order: 6, purpose: 'Bodyguard placement within Kurapika’s distributed intelligence network', source }),
  freeze({ hunter: 'Biscuit Krueger', employer: 'Marayam Hui Guo Rou', prince: 'Marayam Hui Guo Rou', order: 13, purpose: 'Bodyguard placement within Kurapika’s distributed intelligence network', source }),
  freeze({ hunter: 'Basho', employer: 'Luzurus Hui Guo Rou', prince: 'Luzurus Hui Guo Rou', order: 7, purpose: 'Bodyguard placement within Kurapika’s distributed intelligence network', source }),
  freeze({ hunter: 'Melody', employer: 'Kacho Hui Guo Rou', prince: 'Kacho Hui Guo Rou', order: 10, purpose: 'Bodyguard placement within Kurapika’s distributed intelligence network', source }),
  freeze({ hunter: 'Hanzo', employer: 'Momoze Hui Guo Rou', prince: 'Momoze Hui Guo Rou', order: 12, purpose: 'Bodyguard placement within Kurapika’s distributed intelligence network', source }),
]);

export const succession350HalkenburgProfile = freeze({
  prince: 'Halkenburg Hui Guo Rou',
  order: 9,
  traitsUsedByKurapika: freeze([
    'Honors-student reputation',
    'Open criticism of the royal family',
    'Poor relationship with his family apart from Tserriednich',
    'Facebox statement identifying Tserriednich as the one prince he accepts',
    'Rumor that boarding school functioned as both exile and protection from assassination',
  ]),
  importantCorrection: 'Halkenburg did not post one of the six bodyguard listings. Oito designed her own vague posting to attract applicants who believed they were applying to Halkenburg.',
  source,
});

export const succession350RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Queen Oito & Woble',
    type: 'Bodyguard / protection-and-escape contract',
    note: 'Kurapika accepts Oito’s ten-times-pay mission to protect her and Woble and seek a route off the voyage, while retaining his broader objective of reaching Tserriednich and recovering the Scarlet Eyes.',
    phase: 'Succession preparation',
    chapters: '350–current',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Halkenburg Hui Guo Rou',
    to: 'Tserriednich Hui Guo Rou',
    type: 'Publicly acknowledged exceptional sibling relationship',
    note: 'Kurapika’s research finds that Halkenburg publicly described Tserriednich as the one prince he accepts, making that relationship the basis for Kurapika’s attempted infiltration route.',
    phase: 'Pre-voyage royal background',
    chapters: '350',
    state: 'reported',
    source,
  }),
  freeze({
    from: 'Kurapika',
    to: 'Biscuit, Basho, Izunavi, Hanzo & Melody',
    type: 'Distributed royal-household intelligence network',
    note: 'Kurapika recruits five trusted Hunters and distributes the group across six prince households to gather information and open a path toward Tserriednich.',
    phase: 'Succession preparation',
    chapters: '350–current',
    state: 'active',
    source,
  }),
]);

export const succession350Mysteries = freeze([
  freeze({
    question: 'Can Oito and Woble actually escape the succession voyage?',
    evidence: 'Oito hires Kurapika for ten times the normal pay to get herself and Woble off the ship, but Chapter 350 does not establish a viable route or whether the ritual permits withdrawal.',
    status: 'open',
    lastChapter: '350',
    source,
  }),
  freeze({
    question: 'Can Kurapika use the six-household network to reach Tserriednich?',
    evidence: 'Kurapika creates a distributed bodyguard network specifically to obtain information and physical access to Tserriednich, but the useful route is not yet known in Chapter 350.',
    status: 'developing',
    lastChapter: '350',
    source,
  }),
]);

const focus = 'Kurapika recruits Biscuit, Basho, Izunavi, Hanzo, and Melody to infiltrate six prince households and seek a physical route to Tserriednich; he profiles an anonymous listing as Halkenburg’s but discovers the employer is Queen Oito, who deliberately baited Halkenburg-seeking applicants, reveals the lethal succession war and higher-prince private armies, and hires Kurapika for ten times the pay to protect her and Woble and try to escape; the six Hunters are then distributed across Woble, Tyson, Marayam, Luzurus, Kacho, and Momoze households.';

export const succession350ChapterResearch = freeze([
  freeze({
    number: 350,
    title: 'Prince',
    japaneseTitle: '王子',
    romanizedTitle: 'Ōji',
    phase: 'Succession preparation',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Kurapika recruitment network',
      'Prince bodyguard hiring',
      'Oito & Woble',
      'Halkenburg profile',
      'Tserriednich access plan',
      'Succession Contest security',
    ]),
    focus,
    events: succession350TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Biscuit Krueger', 'Basho', 'Izunavi', 'Hanzo', 'Melody', 'Killua Zoldyck',
      'Tserriednich Hui Guo Rou', 'Halkenburg Hui Guo Rou', 'Queen Oito Hui Guo Rou', 'Woble Hui Guo Rou',
      'Nasubi Hui Guo Rou', 'Tyson Hui Guo Rou', 'Marayam Hui Guo Rou', 'Luzurus Hui Guo Rou',
      'Kacho Hui Guo Rou', 'Momoze Hui Guo Rou', 'Duazul Hui Guo Rou', 'Camilla Hui Guo Rou', 'Tubeppa Hui Guo Rou',
    ]),
    locations: freeze([
      'Kurapika recruitment meeting · pre-voyage',
      'Kurapika recruitment meeting · job-posting review',
      'Kurapika recruitment meeting · Halkenburg profile review',
      'Hui Guo Rou family hotel · interview',
      'Kakin prince households · bodyguard hiring results',
    ]),
    threadLabels: freeze([
      'Kurapika', 'Oito', 'Woble', 'Halkenburg', 'Tserriednich', 'Scarlet Eyes',
      'Bodyguard recruitment', 'Succession Contest', 'Prince households',
    ]),
    bodyguardAssignments: succession350BodyguardAssignments,
    halkenburgProfile: succession350HalkenburgProfile,
    relationships: succession350RelationshipRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 350 text',
      'Kurapika’s initial identification of Oito’s listing as Halkenburg’s is preserved as a mistaken deduction',
      'The anonymous-listing personality analysis remains Kurapika’s inference rather than objective character classification',
      'Halkenburg is explicitly stored as not having posted one of the six listings',
      'Oito’s proposed future leverage over Halkenburg is a strategy, not a confirmed successful blackmail mechanism',
      'The six final bodyguard placements are treated as confirmed hiring results from the supplied chapter text',
      'The chapter establishes that higher-ranking princes possess private armies, but does not provide a complete army roster for each household',
    ]),
    status: 'Maintained chapter summary, chronology, six-household bodyguard assignment matrix, Kurapika infiltration objective, Halkenburg profile and correction, Oito/Woble protection-and-escape contract, private-army security context, relationships, mysteries, and source confidence linked',
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
      nen: false,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession350ChapterFocus = freeze({ 350: focus });
