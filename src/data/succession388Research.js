const freeze = (value) => Object.freeze(value);
const source388 = 'https://hunterxhunter.fandom.com/wiki/Chapter_388';

export const succession388SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 388 synopsis and note text',
  chapterUrl: source388,
  titleStatus: 'No chapter title was supplied; none is invented.',
  excluded: freeze(['All outside story claims', 'Later-chapter mechanics or outcomes not contained in the supplied Chapter 388 text']),
});

const event = ({ id, day, time = null, label, detail, people = [], tracks = [], confidence = 'Confirmed in the supplied Hunterpedia Chapter 388 synopsis' }) => freeze({
  id,
  day,
  time,
  label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  chapter: 388,
  confidence,
  source: source388,
});

export const succession388TimelineEvents = freeze([
  event({
    id: '388-ladiolus-awakening-exit', day: 9,
    label: 'Ladiolus exits the private test with dramatically increased aura',
    detail: 'Chapter 388 continues the Room 1014 class from the prior Day 9 sequence. Furykov compares Ladiolus’s aura quantity to roughly one year of basic practice at three hours per day, while explicitly withholding certainty from a single example and judging that she does not appear manipulated.',
    people: ['Kurapika', 'Bill', 'Ladiolus', 'Furykov', 'Babimyna'],
    tracks: ['room-1014', 'nen-class', 'awakening', 'furykov-assessment'],
  }),
  event({
    id: '388-maor-bill-growth-demonstration', day: 9,
    label: 'Bill demonstrates his growth ability before Maor',
    detail: 'In Oito and Woble’s room, Bill surrounds a glass containing water and a seed; the water overflows and the seed sprouts. Kurapika identifies Bill as an Enhancer and explains that Bill’s ability causes the growth of its target.',
    people: ['Kurapika', 'Bill', 'Maor', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou'],
    tracks: ['bill', 'enhancement', 'growth-ability', 'nen-class'],
  }),
  event({
    id: '388-maor-semi-coercive-awakening', day: 9,
    label: 'Kurapika borrows Bill’s ability and semi-coercively awakens Maor',
    detail: 'Kurapika explains that a Nen "attack" can include healing and ability lending, then says he will borrow Bill’s growth ability and lend it to Maor. Maor exits with active aura; Furykov again judges that he is not being manipulated.',
    people: ['Kurapika', 'Bill', 'Maor', 'Furykov', 'Babimyna'],
    tracks: ['stealth-dolphin', 'bill-growth-ability', 'semi-coercive-awakening', 'nen-class'],
  }),
  event({
    id: '388-yuri-stealth-dolphin-loan', day: 9,
    label: 'Yuri receives Bill’s borrowed ability through Stealth Dolphin',
    detail: 'Kurapika loans Bill’s ability to Yuri through Stealth Dolphin. He explicitly tells her that the aura is borrowed and that the ability is not her own, and explains that after learning Ten and Hatsu she can perform Water Divination privately.',
    people: ['Kurapika', 'Bill', 'Yuri'],
    tracks: ['stealth-dolphin', 'ability-loan', 'nen-class', 'water-divination'],
  }),
  event({
    id: '388-kurapika-bill-resolve-conversation', day: 9,
    label: 'Bill explains why he chose Woble’s guard assignment and stayed',
    detail: 'Bill says Beyond stationed him aboard the ship, but he personally chose Woble’s guard assignment because he expected little combat around an infant. He considered running once killings began, then Vincent’s attack and Kurapika’s conversations with Oito helped him resolve to face the danger. Kurapika rejects Bill’s self-description as a coward.',
    people: ['Kurapika', 'Bill', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Vincent', 'Beyond Netero'],
    tracks: ['bill', 'woble-protection', 'resolve', 'beyond-expedition'],
  }),
  event({
    id: '388-tubeppa-authorizes-alliance-negotiation', day: 9,
    label: 'Tubeppa authorizes continued alliance negotiations and more Nen students',
    detail: 'After Maor and Longhi report that Kurapika’s training worked and that Woble’s camp is most strongly aligned with Zhang Lei, Tubeppa orders them to continue negotiating an alliance and permits more of her guards to attend later classes.',
    people: ['Tubeppa Hui Guo Rou', 'Maor', 'Longhi', 'Kurapika', 'Woble Hui Guo Rou', 'Zhang Lei Hui Guo Rou'],
    tracks: ['tubeppa', 'woble', 'alliance-negotiation', 'nen-class'],
  }),
  event({
    id: '388-fourth-aura-rumbling', day: 10, time: '11:30',
    label: 'Kurapika, Bill, and Oito feel the fourth aura rumbling',
    detail: 'At 11:30 a.m. on Voyage Day 10, Kurapika, Bill, and Oito feel the fourth recurrence of the powerful aura rumbling. The intervals between recurrences are noted to be getting shorter. Chapter 388 does not itself identify a new attacker, target, or complete mechanic for this pulse.',
    people: ['Kurapika', 'Bill', 'Oito Hui Guo Rou'],
    tracks: ['aura-rumbling', 'halkenburg-thread', 'voyage-day-10'],
  }),
]);

export const succession388NenClassResearch = freeze({
  setting: 'Room 1014 training sequence continuing on Voyage Day 9',
  privacyAndControl: freeze([
    'Kurapika performs Water Divination-related awakening work behind closed doors with Bill.',
    'He imposes a gag order on individual results until everyone has taken the test and says a violation will end the class immediately.',
    'Kurapika reiterates that empowering multiple camps is intended to prolong the succession stalemate and protect Woble and Oito.',
  ]),
  ladiolus: freeze({
    resultDisclosure: 'Her individual Nen type is not supplied in the synopsis.',
    auraChange: 'She exits with dramatically increased aura.',
    furykovEstimate: 'Furykov compares the amount to someone who practiced Nen basics three hours per day for one year.',
    manipulationAssessment: 'Furykov says one example is insufficient for certainty but he does not think she is being controlled.',
  }),
  awakenedThatDay: freeze(['Ladiolus', 'Maor', 'Yuri', 'Satobi']),
  satobiNoteBoundary: 'The user-supplied Chapter 388 note states that Satobi is one of the four people awakened that day despite the Viz layout obscuring his head. The archive treats that supplied note as the Chapter 388 source boundary.',
  hashitoBoundary: 'Hashito asks to take the test early, but Kurapika refuses because Hashito has not yet learned the basics and would not be able to handle the aftereffects.',
  unresolved: freeze([
    'The synopsis does not supply each awakened student’s final Nen category.',
    'The exact duration and long-term physiological effect of the semi-coercive awakening procedure are not quantified here.',
  ]),
  source: source388,
});

export const succession388BillGrowthAbilityResearch = freeze({
  user: 'Bill',
  officialName: null,
  archiveLabel: 'Bill’s Growth Ability',
  nenType: 'Enhancement',
  nenTypeBasis: 'Kurapika directly identifies Bill as an Enhancer in the supplied Chapter 388 synopsis.',
  demonstratedEffect: 'With Bill’s hands around a glass, the water overflows and a seed at the bottom sprouts. Kurapika explains that Bill’s ability causes the growth of its target.',
  classUse: 'Kurapika borrows the ability and lends it to students as part of the semi-coercive Nen-awakening procedure.',
  boundaries: freeze([
    'No official ability name is supplied.',
    'The chapter does not quantify range, aura cost, cooldown, maximum growth, valid target categories, or whether all uses require the same hand position.',
    'The plant demonstration establishes growth, but the archive does not infer unrelated healing, regeneration, or aging effects.',
  ]),
  source: source388,
});

export const succession388StealthDolphinResearch = freeze({
  directUse: 'Kurapika loans Bill’s borrowed growth ability to Yuri through Stealth Dolphin.',
  recipientState: 'Kurapika explicitly tells Yuri that the aura is borrowed and that the ability is not her own.',
  awakeningUse: 'The borrowed ability is used in the class procedure to semi-coercively awaken students to Nen.',
  waterDivinationAfterward: 'Kurapika says that once Yuri learns Ten and Hatsu she can perform Water Divination on her own and keep her Nen type private.',
  boundaries: freeze([
    'Chapter 388 demonstrates this lending application but does not establish that every possible borrowed ability awakens Nen in the same way.',
    'The chapter does not replace the previously established Emperor Time / stolen-ability restrictions with a new universal rule.',
  ]),
  source: source388,
});

export const succession388ObserverHypotheses = freeze([
  freeze({
    observer: 'Babimyna',
    hypothesis: 'Kurapika may have a manipulation-like method that semi-coercively opens aura nodes; after seeing Maor he instead becomes convinced Kurapika’s Specialist ability is involved and suspects Kurapika likely has multiple abilities, perhaps one for each right-hand finger.',
    status: 'Character hypothesis only. Chapter 388 does not confirm a one-ability-per-finger system.',
  }),
  freeze({
    observer: 'Furykov',
    hypothesis: 'If Kurapika were manipulating the students, residual mixed aura should allow Furykov to detect it; after Ladiolus and Maor emerge he judges that they do not appear controlled.',
    status: 'Furykov’s operational assessment, not a universal manipulation-detection law.',
  }),
  freeze({
    observer: 'Rihan',
    hypothesis: 'Kurapika might possess five abilities and therefore could be a troublesome Predator target; Tubeppa’s unseen Guardian Spirit Beast might also be especially dangerous.',
    status: 'Rihan’s risk assessment only. Neither five abilities nor the beast’s danger level is established as fact here.',
  }),
  freeze({
    observer: 'Balsamilco',
    hypothesis: 'Shikaku’s suicide might have involved sacrificing himself for Benjamin, but Balsamilco rejects that line because it conflicts with Benjamin’s attitude toward begging for life.',
    status: 'Rejected speculation; Chapter 388 does not resolve Halkenburg’s consciousness mechanics.',
  }),
]);

export const succession388KurapikaBillResearch = freeze({
  kurapikaGoal: 'Protect Woble and Oito by distributing Nen knowledge widely enough to prolong a stalemate among the princes.',
  billDeployment: 'Beyond Netero stationed Bill aboard the Black Whale, while Bill says he personally chose Woble’s guard assignment.',
  billOriginalExpectation: 'Bill hoped guarding an infant prince would involve little real combat.',
  billResolve: 'After killings began he considered fleeing; Vincent’s attack angered him and Kurapika’s conversations with Oito helped him prepare for the worst.',
  kurapikaResponse: 'Kurapika tells Bill that someone with that level of resolve is not a coward.',
  billConcern: 'Bill privately worries that newly distributed power could corrupt some students and hopes Kurapika has countermeasures.',
  source: source388,
});

export const succession388TubeppaResearch = freeze({
  alliancePosture: freeze({
    report: 'Maor and Longhi tell Tubeppa that Woble’s camp is most strongly allied with Zhang Lei and that Kurapika’s Nen training works.',
    decision: 'Tubeppa authorizes continued negotiations toward an alliance and allows more of her guards to attend future classes.',
    boundary: 'This is an active negotiation posture in Chapter 388, not a retroactive replacement for later formal alliance records.',
  }),
  saleSaleAssessment: freeze({
    inference: 'Tubeppa infers Salé-salé was killed because he missed the banquet despite being someone she believes would never miss performing.',
    benjaminInference: 'She interprets the replacement of Benjamin’s soldiers as evidence that she may be their next target.',
    status: 'Tubeppa’s deductions. Salé-salé’s death is already established elsewhere; Chapter 388 does not independently prove Benjamin’s next-target sequence.',
  }),
  heisenExperiment: freeze({
    action: 'Tubeppa gives a flash drive mission to Heisen, an assistant who recently awakened to Nen.',
    hope: 'She hopes assigning a mission at this stage will affect the Nen ability he develops.',
    boundary: 'Her expectation is a hypothesis and is not stored as a general Nen-development law.',
  }),
  informationStrategy: 'She avoids checking Benjamin soldier shift logs or using Duazul’s guard spy because those routes could draw suspicion or create guard/Camilla complications; she decides to speak with Duazul herself.',
  kurapikaAssessment: 'Tubeppa concludes that Maor is not yet ready for a Nen-level threat and thinks she needs an experienced partner such as Kurapika.',
  source: source388,
});

export const succession388RihanResearch = freeze({
  tubeppaBeast: 'Tubeppa’s Guardian Spirit Beast still has not shown itself to Rihan.',
  targetDebate: 'Rihan considers switching attention to Halkenburg, then recalls Balsamilco’s instruction to remain patient.',
  predatorConstraint: 'Balsamilco cannot give Rihan detailed advice because doing so would lessen Predator’s effectiveness.',
  kurapikaRisk: 'Rihan worries that Kurapika’s Nen teaching could create a durable stalemate and considers Kurapika as a target, but his belief that Kurapika might have five abilities is only a hypothesis.',
  halkenburgThreat: 'The Shikaku incident keeps Halkenburg high in Rihan and Balsamilco’s threat calculations without resolving how Halkenburg’s ability works.',
  source: source388,
});

export const succession388AuraRumblingResearch = freeze({
  occurrence: 4,
  day: 10,
  time: '11:30 a.m.',
  witnesses: freeze(['Kurapika', 'Bill', 'Oito Hui Guo Rou']),
  trend: 'The intervals between the aura rumblings are getting shorter.',
  attributionBoundary: 'The recurring phenomenon remains connected to the previously established Halkenburg thread, but the Chapter 388 endpoint does not itself supply a new attacker, target, or complete activation mechanic.',
  source: source388,
});

export const succession388RelationshipRecords = freeze([
  freeze({
    id: 'relationship:tubeppa-woble-alliance-negotiation-ch388',
    from: 'Tubeppa Hui Guo Rou',
    to: 'Woble Hui Guo Rou / Kurapika camp',
    type: 'alliance-negotiation',
    chapter: 388,
    state: 'Tubeppa authorizes Maor and Longhi to continue alliance negotiations after confirming Kurapika’s Nen class works, and permits more of her guards to attend future classes.',
    boundary: 'Negotiation-stage relationship only; later formal terms are not backdated.',
    source: source388,
  }),
]);

export const succession388Mysteries = freeze([
  freeze({ question: 'What are the exact full mechanics and limits of Bill’s unnamed growth ability?', chapter: 388, status: 'open', source: source388 }),
  freeze({ question: 'How will the increasingly frequent aura rumblings develop after the fourth pulse at Day 10 11:30 a.m.?', chapter: 388, status: 'open', source: source388 }),
  freeze({ question: 'Why has Tubeppa’s Guardian Spirit Beast still not shown itself to Rihan?', chapter: 388, status: 'open', source: source388 }),
]);

export const succession388ChapterResearch = freeze([
  freeze({
    number: 388,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    chronology: freeze({
      opening: 'Voyage Day 9 · continuation of the Room 1014 Nen class',
      endpoint: 'Voyage Day 10 · 11:30 a.m. · fourth aura rumbling',
      exactEndpointTime: '11:30 a.m.',
      note: 'Intermediate post-class scenes are kept in publication sequence without invented clock times.',
    }),
    events: succession388TimelineEvents,
    nenClass: succession388NenClassResearch,
    billGrowthAbility: succession388BillGrowthAbilityResearch,
    stealthDolphin: succession388StealthDolphinResearch,
    kurapikaBill: succession388KurapikaBillResearch,
    tubeppa: succession388TubeppaResearch,
    rihan: succession388RihanResearch,
    observerHypotheses: succession388ObserverHypotheses,
    auraRumbling: succession388AuraRumblingResearch,
    relationships: succession388RelationshipRecords,
    mysteries: succession388Mysteries,
    sourcePolicy: succession388SourcePolicy,
  }),
]);
