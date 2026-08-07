const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_366';

export const succession366SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 366 synopsis, chapter notes, and trivia text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1 · royal residential area', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1 · approximately four hours after departure',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 366,
  confidence,
  source,
});

export const succession366TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-366-marayam-beast-growing',
    title: 'Hanzo and Biscuit observe Marayam’s Guardian Spirit Beast growing',
    detail: 'Hanzo and Biscuit note that the dragon-like Guardian Spirit Beast associated with Marayam is increasing in size. Chapter 366 identifies the dragon seen earlier as Marayam’s beast, but does not explain the growth trigger or its complete ability.',
    tracks: ['marayam', 'guardian-spirit-beast', 'hanzo', 'biscuit'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-momoze-guard-assassination-intent',
    title: 'Momoze’s protection detail contains an internal assassination threat',
    detail: 'The synopsis describes Momoze’s guards planning to kill her in a way that makes their responsibility recognizable to their employer but difficult for the authorities to prove. The chapter notes specifically identify Tuffdy as one royal guard planning to kill Momoze.',
    tracks: ['momoze', 'tuffdy', 'assassination', 'bodyguards'],
    confidence: 'The internal threat is confirmed; Tuffdy is explicitly named by the supplied chapter notes, while no additional guard identities are inferred here',
  }),
  timelineEvent({
    id: 'voyage-day1-366-fugetsu-two-loyal-guards',
    title: 'Ryoji and Bachaem identify themselves as Fugetsu’s only genuine protectors',
    detail: 'Ryoji and Bachaem discuss that they are the only two guards sincerely protecting Fugetsu and regard the remaining guards around her as assassins.',
    tracks: ['fugetsu', 'ryoji', 'bachaem', 'bodyguards', 'assassination-risk'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-kacho-hostile-performance',
    title: 'Kacho harshly criticizes her food in front of guards and maids',
    detail: 'Kacho loudly complains about the food prepared for her, provoking resentment among her bodyguards and maids. The chapter itself does not independently explain whether this behavior is tactical performance, sincere hostility, or both.',
    tracks: ['kacho', 'bodyguards', 'maids', 'household-behavior'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-halkenburg-wakes-guards-alive',
    title: 'Halkenburg wakes and finds all eleven bodyguards alive and conscious',
    detail: 'Contrary to what he witnessed in Chapter 362, Halkenburg wakes to find his bodyguards awake and unharmed. He takes this as suggesting that the earlier scene may have been a dream, but Chapter 366 does not establish the actual cause of the discrepancy.',
    tracks: ['halkenburg', 'bodyguards', 'mystery'],
    confidence: 'The bodyguards being awake is confirmed; the idea that the Chapter 362 event was merely a dream is Halkenburg’s interpretation',
  }),
  timelineEvent({
    id: 'voyage-day1-366-sale-sale-next-banquet-claim',
    title: 'Salé-salé says the next banquet will change everything',
    detail: 'Despite Swinko-swinko’s anxiety about the succession battle, Salé-salé remains frivolous and claims that things will change at the next dinner banquet, saying he will change the world.',
    tracks: ['sale-sale', 'swinko-swinko', 'banquet', 'succession-strategy'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-luzurus-clean-leaf',
    title: 'Luzurus discusses using Basho’s Clean Leaf as addiction therapy',
    detail: 'Luzurus smokes the healthy drug created by Basho and discusses distributing it as therapy for addicts if he becomes King. The chapter presents the proposal as Luzurus’s policy idea, not an enacted program.',
    tracks: ['luzurus', 'basho', 'clean-leaf', 'policy'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-tyson-book',
    title: 'Tyson praises the Book of Tyson while Izunavi assesses her attitude positively',
    detail: 'Tyson lavishes attention on her book, and Izunavi praises her attitude under the stressful circumstances of the succession battle.',
    tracks: ['tyson', 'izunavi', 'book-of-tyson'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-maor-heads-to-woble',
    title: 'Maor proceeds toward Woble’s quarters for Tubeppa’s follow-up',
    detail: 'Following the one-hour arrangement from Chapter 365, Maor heads toward Woble’s room while Tubeppa considers how to remove Benjamin’s soldier Butch from her own environment.',
    tracks: ['maor', 'tubeppa', 'woble', 'butch', 'diplomacy', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-tserriednich-nen-genius',
    title: 'Theta realizes Tserriednich is a Nen genius',
    detail: 'After roughly two hours of meditation and instruction, Tserriednich is already able to manipulate his aura with striking ease. Theta recognizes the speed of his progress as exceptional and dangerous to her containment strategy.',
    tracks: ['tserriednich', 'theta', 'nen-training', 'aura'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-zhang-lei-sends-two-guards',
    title: 'Zhang Lei sends Sakata and Hashito to reinforce Woble’s protection',
    detail: 'As Kurapika’s meeting with Zhang Lei concludes, Zhang Lei assigns Sakata and Hashito to assist Kurapika in guarding Woble until the next banquet.',
    tracks: ['zhang-lei', 'sakata', 'hashito', 'kurapika', 'woble', 'truce'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-slakka-unma-collusion',
    title: 'Slakka acknowledges cooperation with Unma’s soldiers',
    detail: 'Slakka notes that he is colluding with soldiers aligned with First Queen Unma because their interests overlap. The chapter establishes mutual-interest cooperation but does not fully define every objective or command relationship involved.',
    tracks: ['slakka', 'unma', 'royal-guards', 'collusion'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-coventoba-stays-zhang-lei',
    title: 'Coventoba remains with Zhang Lei while Slakka accompanies the transferred guards',
    detail: 'Benjamin’s soldier Coventoba stays in Zhang Lei’s camp. Slakka accompanies Sakata and Hashito as they move toward Woble’s side under the royal-guard arrangements surrounding the third prince.',
    tracks: ['coventoba', 'slakka', 'sakata', 'hashito', 'zhang-lei', 'woble'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-camilla-assassination-order',
    title: 'Camilla orders Duazul to help kill Benjamin and Halkenburg',
    detail: 'Camilla’s succession plan prioritizes Benjamin first and Halkenburg afterward. She instructs her mother Duazul to get close to Halkenburg so that he can be killed.',
    tracks: ['camilla', 'duazul', 'benjamin', 'halkenburg', 'assassination-plan'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-musse-secret-window',
    title: 'Musse eavesdrops on Camilla and prepares Secret Window as evidence collection',
    detail: 'Benjamin’s soldier Musse overhears Camilla’s assassination discussion and plans to use his Nen ability Secret Window to obtain physical evidence of the plot. The supplied Chapter 366 text names the ability and purpose but does not provide its full mechanics.',
    tracks: ['musse', 'camilla', 'secret-window', 'benjamin', 'surveillance'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-benjamin-stalemate-assessment',
    title: 'Benjamin acknowledges Kurapika is successfully delaying his guards',
    detail: 'Benjamin comments that Kurapika is doing a good job of holding off Benjamin’s personnel and contributing to the stalemate that now shapes the contest.',
    tracks: ['benjamin', 'kurapika', 'stalemate', 'surveillance'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-new-guards-return-room1014',
    title: 'Kurapika returns with Zhang Lei’s reinforcements',
    detail: 'Kurapika returns to Woble’s side accompanied by the newly assigned royal guards. Slakka and Babimyna begin coordinating surveillance of Zhang Lei’s guards, layering new observation onto the temporary protection arrangement.',
    tracks: ['kurapika', 'sakata', 'hashito', 'slakka', 'babimyna', 'room-1014', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-kurapika-little-eye-difficulty',
    title: 'Kurapika remains under pressure to find a practical Little Eye target',
    detail: 'Kurapika worries about the difficulty of applying Sayird’s borrowed Nen ability effectively while the royal-household situation continues to shift around him.',
    tracks: ['kurapika', 'little-eye', 'reconnaissance', 'emperor-time'],
  }),
  timelineEvent({
    id: 'voyage-day1-366-chrollo-tier5-hall37564',
    title: 'Chrollo is shown on Tier 5 in Hall 37564',
    detail: 'A passenger encounters Chrollo in Hall 37564 and remarks that Chrollo looks ready to kill someone. When urged to forget worldly ties, Chrollo replies that ties are not forgotten but severed.',
    location: 'Black Whale · Tier 5 · Hall 37564',
    tracks: ['chrollo', 'phantom-troupe', 'tier-5', 'hall-37564'],
  }),
]);

export const succession366GuardianBeastUpdates = freeze([
  freeze({
    prince: 'Marayam Hui Guo Rou',
    update: 'The dragon-like Guardian Spirit Beast seen earlier is confirmed as Marayam’s and is observed growing.',
    mechanicsStatus: 'Growth observed; trigger, cost, maximum size, and full ability remain unknown in Chapter 366.',
    source,
  }),
  freeze({
    prince: 'Halkenburg Hui Guo Rou',
    update: 'The eleven guards found unconscious in Chapter 362 are awake when Halkenburg wakes in Chapter 366.',
    mechanicsStatus: 'The discrepancy is unresolved. Halkenburg suspects the earlier event may have been a dream, but this is not established as fact.',
    source,
  }),
]);

export const succession366ProtectionNetwork = freeze([
  freeze({
    household: 'Momoze Hui Guo Rou',
    person: 'Tuffdy',
    state: 'internal assassination threat',
    detail: 'Tuffdy is explicitly identified in the chapter notes as one royal guard planning to kill Momoze.',
    source,
  }),
  freeze({
    household: 'Fugetsu Hui Guo Rou',
    person: 'Ryoji and Bachaem',
    state: 'legitimate protectors',
    detail: 'They describe themselves as Fugetsu’s only two genuine protectors and regard the other guards as assassins.',
    source,
  }),
  freeze({
    household: 'Woble / Oito household',
    person: 'Sakata and Hashito',
    state: 'temporary Zhang Lei reinforcements',
    detail: 'Zhang Lei sends both personal guards to assist Kurapika in protecting Woble until the next banquet.',
    source,
  }),
  freeze({
    household: 'Zhang Lei Hui Guo Rou',
    person: 'Coventoba',
    state: 'Benjamin surveillance presence remains',
    detail: 'Coventoba stays with Zhang Lei while Sakata, Hashito, and Slakka move toward Woble’s side.',
    source,
  }),
  freeze({
    household: 'Woble / Oito household',
    person: 'Slakka and Babimyna',
    state: 'counter-surveillance around Zhang Lei reinforcements',
    detail: 'After Kurapika returns, Slakka and Babimyna conspire to keep tabs on Zhang Lei’s guards.',
    source,
  }),
]);

export const succession366TserriednichTraining = freeze({
  trainee: 'Tserriednich Hui Guo Rou',
  instructor: 'Theta',
  elapsedTrainingContext: 'approximately two hours of meditation',
  observedProgress: 'Tserriednich is already able to manipulate his aura with unusual ease.',
  assessment: 'Theta recognizes him as a Nen genius.',
  implication: 'Theta’s strategy of controlling or hindering his Nen development becomes substantially more difficult.',
  source,
});

export const succession366AbilityRecords = freeze([
  freeze({
    user: 'Musse',
    ability: 'Secret Window',
    type: 'Nen surveillance / evidence-gathering ability; exact category not supplied by the Chapter 366 text',
    mechanics: 'Musse plans to use Secret Window after eavesdropping on Camilla in order to obtain physical evidence of her assassination plot.',
    chapters: '366',
    confidence: 'Ability name and intended evidentiary use are confirmed; full activation, range, persistence, and information-transfer mechanics are not supplied here.',
    source,
  }),
]);

export const succession366RelationshipRecords = freeze([
  freeze({
    from: 'Zhang Lei Hui Guo Rou',
    to: 'Woble / Oito household',
    type: 'Temporary protection reinforcement',
    note: 'Zhang Lei sends Sakata and Hashito to help protect Woble until the next banquet, deepening the practical consequences of the Chapter 365 truce negotiation.',
    phase: 'Active contest and voyage',
    chapters: '366–next banquet',
    state: 'active temporary cooperation',
    source,
  }),
  freeze({
    from: 'Ryoji and Bachaem',
    to: 'Fugetsu Hui Guo Rou',
    type: 'Genuine protection',
    note: 'Ryoji and Bachaem regard themselves as Fugetsu’s only two legitimate protectors among a detail containing hostile actors.',
    phase: 'Active contest and voyage',
    chapters: '366–current',
    state: 'active protection',
    source,
  }),
  freeze({
    from: 'Tuffdy',
    to: 'Momoze Hui Guo Rou',
    type: 'Covert assassination intent',
    note: 'Tuffdy is identified as planning to kill Momoze while seeking to make responsibility clear to his employer but difficult for authorities to establish.',
    phase: 'Active contest and voyage',
    chapters: '366–current',
    state: 'active hostile intent',
    source,
  }),
  freeze({
    from: 'Camilla Hui Guo Rou',
    to: 'Duazul Hui Guo Rou',
    type: 'Assassination instruction',
    note: 'Camilla orders Duazul to get close to Halkenburg and facilitate his death as part of a plan that prioritizes Benjamin first and Halkenburg second.',
    phase: 'Active contest and voyage',
    chapters: '366–current',
    state: 'declared plan',
    source,
  }),
  freeze({
    from: 'Musse',
    to: 'Camilla Hui Guo Rou',
    type: 'Covert surveillance / evidence collection',
    note: 'Musse overhears Camilla’s assassination discussion and plans to use Secret Window to secure evidence for Benjamin’s side.',
    phase: 'Active contest and voyage',
    chapters: '366–current',
    state: 'active surveillance',
    source,
  }),
  freeze({
    from: 'Slakka',
    to: 'Unma-aligned soldiers',
    type: 'Mutual-interest collusion',
    note: 'Slakka states that he is cooperating with Unma’s soldiers because their interests align. The complete goals and command relationship remain unspecified in Chapter 366.',
    phase: 'Active contest and voyage',
    chapters: '366–current',
    state: 'active covert cooperation',
    source,
  }),
]);

export const succession366LocationState = freeze({
  subject: 'Chrollo Lucilfer',
  location: 'Black Whale · Tier 5 · Hall 37564',
  chapter: 366,
  detail: 'Chrollo is explicitly shown aboard the Black Whale in Hall 37564 on Tier 5.',
  source,
});

export const succession366ContinuityNotes = freeze([
  freeze({
    issue: 'Hall 37564 wordplay',
    detail: 'The supplied trivia notes that 37564 can be read through Japanese number wordplay as “minagoroshi,” meaning “massacre” or “kill them all.” This is stored as trivia rather than treated as an in-world numbering rule.',
    source,
  }),
]);

export const succession366Mysteries = freeze([
  freeze({
    question: 'Why did Halkenburg see all eleven bodyguards unconscious in Chapter 362 when they are awake in Chapter 366?',
    evidence: 'Halkenburg wakes to find his guards conscious and considers that the earlier event may have been a dream, but Chapter 366 does not establish what actually caused the earlier vision or state.',
    status: 'recontextualized / unresolved',
    lastChapter: '366',
    source,
  }),
  freeze({
    question: 'What causes Marayam’s Guardian Spirit Beast to grow, and what does the growth enable?',
    evidence: 'Hanzo and Biscuit observe the dragon-like beast growing, but Chapter 366 supplies no trigger, cost, maximum size, or complete ability mechanics.',
    status: 'developing',
    lastChapter: '366',
    source,
  }),
  freeze({
    question: 'What exactly does Salé-salé intend to do at the next banquet?',
    evidence: 'Salé-salé tells his mother that things will change and declares that he will change the world at the next dinner banquet without explaining the plan in the supplied Chapter 366 text.',
    status: 'open',
    lastChapter: '366',
    source,
  }),
]);

const focus = 'Four hours into the Black Whale voyage, Chapter 366 surveys the royal households as threats and alliances crystallize: Marayam’s dragon Guardian Spirit Beast grows; Momoze and Fugetsu face lethal danger from within their own protection structures; Tserriednich displays extraordinary Nen aptitude; Zhang Lei sends Sakata and Hashito to reinforce Woble; Camilla’s assassination plan is overheard by Musse; and Chrollo is located on Tier 5 in Hall 37564.';

export const succession366ChapterResearch = freeze([
  freeze({
    number: 366,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1 · four hours after departure',
    lanes: freeze([
      'Royal household state sweep',
      'Guardian Spirit Beast growth',
      'Momoze assassination threat',
      'Fugetsu protection fracture',
      'Tserriednich Nen training',
      'Zhang Lei–Woble cooperation',
      'Camilla assassination plot',
      'Benjamin surveillance',
      'Chrollo Tier 5 location',
    ]),
    focus,
    events: succession366TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Hanzo', 'Biscuit Krueger', 'Marayam Hui Guo Rou', 'Momoze Hui Guo Rou', 'Tuffdy',
      'Fugetsu Hui Guo Rou', 'Ryoji', 'Bachaem', 'Kacho Hui Guo Rou', 'Halkenburg Hui Guo Rou',
      'Salé-salé Hui Guo Rou', 'Swinko-swinko Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Basho',
      'Tyson Hui Guo Rou', 'Izunavi', 'Maor', 'Tubeppa Hui Guo Rou', 'Butch',
      'Tserriednich Hui Guo Rou', 'Theta', 'Kurapika', 'Zhang Lei Hui Guo Rou', 'Sakata',
      'Hashito', 'Slakka', 'Unma Hui Guo Rou', 'Coventoba', 'Camilla Hui Guo Rou', 'Duazul Hui Guo Rou',
      'Musse', 'Benjamin Hui Guo Rou', 'Babimyna', 'Chrollo Lucilfer',
    ]),
    locations: freeze(['Black Whale · Tier 1 · royal residential area', 'Black Whale · Tier 5 · Hall 37564']),
    threadIds: freeze(['guardian-spirit-beasts', 'royal-guard-infiltration', 'room-1014-diplomacy', 'tserriednich-nen-training', 'phantom-troupe']),
    relationships: succession366RelationshipRecords,
    abilities: succession366AbilityRecords,
    guardianBeastUpdates: succession366GuardianBeastUpdates,
    protectionNetwork: succession366ProtectionNetwork,
    tserriednichTraining: succession366TserriednichTraining,
    locationState: succession366LocationState,
    continuityNotes: succession366ContinuityNotes,
    mysteries: succession366Mysteries,
    coverage: freeze({ chronology: true, appearances: true, relationships: true, assignments: true, nen: true, objects: false, publication: false }),
    source,
    sources: freeze([source]),
  }),
]);

export const succession366ChapterFocus = freeze({ 366: focus });
