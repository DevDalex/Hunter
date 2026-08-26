const freeze = (value) => Object.freeze(value);
const source393 = 'https://hunterxhunter.fandom.com/wiki/Chapter_393';

export const succession393SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 393 synopsis and trivia text',
  chapterUrl: source393,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 393 directly continues the Voyage Day 10 Luini/Troupe and Tier 3 search threads from Chapter 392. No exact clock time is supplied or invented.',
  retrospectiveIdentityBoundary: 'The supplied Chapter 392 note says Chapter 405 later reveals that the man treated as Hisoka in Chapters 392–393 was Bonolenov using Metamorphorsen. That later reveal is excluded from Chapter 393 contemporaneous event, ability, and character-knowledge state. Runtime records use apparent Hisoka / man believed to be Hisoka and do not backfill Bonolenov or Metamorphorsen.',
  excluded: freeze([
    'Backfilling Bonolenov or Metamorphorsen into Chapter 393 as contemporaneous knowledge',
    'Treating the cinema encounter as an objectively confirmed Hisoka appearance in the chapter-bounded event graph',
    'Promoting Perigord’s belief that Luini was an Emitter into a confirmed Nen classification',
    'Treating Morena’s hypothetical hit-count ability example as an actual created or owned ability',
    'Inferring that Voconte’s door technique is Emission merely because Voconte is a confirmed Emitter',
    'Explaining where Maizan goes after entering Room 3101 or importing later route mechanics',
    'Treating the knife’s failure to disappear as a complete test of the Room 3101 mechanism',
    'Treating the rumor about Ken’i’s smile as a supernatural ability or factual death rule',
    'Importing any Chapter 394+ consequence of Luini’s death, Room 3101, or the mafia operation',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Black Whale', confidence = 'Confirmed in the supplied Hunterpedia Chapter 393 synopsis' }) => freeze({
  id,
  day: 10,
  time: 'Voyage Day 10 · exact clock time unsupplied',
  chronology: 'direct continuation of Chapter 392 on Voyage Day 10; exact clock time unsupplied',
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 393,
  confidence,
  source: source393,
});

export const succession393TimelineEvents = freeze([
  timelineEvent({
    id: '393-luini-proposes-world-destruction-alliance',
    label: 'Luini proposes a destructive alliance with the Phantom Troupe',
    detail: 'Luini says he does not want to fight Nobunaga, Phinks, and Feitan and proposes that they work together to eliminate Cha-R, Xi-Yu, and Kakin’s royal family, seize the Black Whale, return to the old world, and destroy it.',
    people: ['Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['heil-ly', 'phantom-troupe', 'cha-r', 'xi-yu', 'confrontation'],
    location: 'Tier 5 · Cha-R office',
  }),
  timelineEvent({
    id: '393-nobunaga-kills-luini',
    label: 'Nobunaga immediately kills Luini',
    detail: 'Nobunaga rejects Luini’s proposal, lunges forward with his katana, stabs him in the head, criticizes his pointless warehouse antics, and strikes him again. Luini is definitively dead in Chapter 393.',
    people: ['Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['heil-ly', 'phantom-troupe', 'death', 'tier-5'],
    location: 'Tier 5 · Cha-R office',
  }),
  timelineEvent({
    id: '393-troupe-prioritizes-destroying-heilly',
    label: 'The Troupe commits to destroying Heil-Ly while retaining the Hisoka hunt',
    detail: 'Tsudonke and his team return to the Cha-R office. Nobunaga reveals the missing Cha-R members were killed, identifies the dismembered Luini as the warehouse hitman, and says the Troupe has decided to destroy Heil-Ly. Phinks says the Hisoka search remains active, but Heil-Ly and Morena intelligence can be handled first.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Tsudonke', 'Luini', 'Morena Prudo'],
    tracks: ['phantom-troupe', 'cha-r', 'heil-ly', 'hisoka-search'],
    location: 'Tier 5 · Cha-R office',
  }),
  timelineEvent({
    id: '393-heilly-assesses-luini-loss',
    label: 'Heil-Ly assesses the operational cost of Luini’s death',
    detail: 'Daemon, Gelato, Perigord, Bille, and Voconte examine the consequences of losing Luini. Daemon says Luini’s ability let them hunt from the hideout, Gelato notes the military alert, and Perigord suggests recreating the lost spatial role. Perigord believes Luini was an Emitter, but this remains his assessment.',
    people: ['Daemon', 'Gelato', 'Perigord', 'Bille', 'Voconte', 'Luini'],
    tracks: ['heil-ly', 'contagion', 'nen-development', 'luini'],
    confidence: 'Luini’s operational loss and the members’ discussion are confirmed; Perigord’s Emitter classification of Luini remains character inference.',
  }),
  timelineEvent({
    id: '393-voconte-door-and-emitter-counterplanning',
    label: 'Voconte offers his door ability while Heil-Ly discusses ranged counters',
    detail: 'Voconte is identified as a level 26 Emitter and human trafficker and proposes using his door ability to catch prey entering a trap. Tevelares and Quorolle arrive seeking an Emitter who can create projectiles against Hinrigh’s handcuff-pigeons. Matvere wants to become an Emitter and make a firearm, but Gelato reminds him that innate type is not chosen by preference.',
    people: ['Voconte', 'Tevelares', 'Quorolle', 'Matvere', 'Gelato', 'Perigord'],
    tracks: ['heil-ly', 'nen-development', 'voconte', 'biohazard', 'contagion'],
    confidence: 'Voconte’s natural type, level, occupation, and mention of a door ability are confirmed; the door technique’s official name, Nen category, and complete rules are not supplied.',
  }),
  timelineEvent({
    id: '393-morena-teaches-counter-ability-design',
    label: 'Morena coaches Heil-Ly to design abilities around opponent restrictions',
    detail: 'Tevelares, Quorolle, and Gelato report to Morena. Morena tells them to analyze opponents and be creative rather than assuming an Emitter is necessary. She gives a hypothetical game-like example of an ability that tells the user how many hits are needed to defeat an enemy. The example is instructional, not a revealed Morena or Heil-Ly ability.',
    people: ['Morena Prudo', 'Tevelares', 'Quorolle', 'Gelato'],
    tracks: ['heil-ly', 'contagion', 'nen-development', 'strategy'],
  }),
  timelineEvent({
    id: '393-lynch-zakuro-recover-from-apparent-hisoka',
    label: 'Lynch and Zakuro recover and reconstruct the apparent-Hisoka encounter',
    detail: 'Zakuro wakes beside boxes and trash. Lynch says the man was gone when she woke and insists he was Hisoka. Zakuro says the man invited him to the movies, asked what he wanted to watch, and knocked him unconscious when Zakuro looked away. They agree they are outmatched and should report to Hinrigh.',
    people: ['Lynch Fullbokko', 'Zakuro Custard'],
    tracks: ['xi-yu', 'hisoka-search', 'identity-uncertain'],
    location: 'Tier 3',
    confidence: 'Their recovery and beliefs are confirmed; the target’s objective identity remains unresolved inside Chapter 393.',
  }),
  timelineEvent({
    id: '393-hinrigh-searches-cinema-complex',
    label: 'Hinrigh clears the cinema complex one auditorium at a time',
    detail: 'Hinrigh arrives with Xi-Yu personnel and tells Zakuro to withdraw so the apparent Hisoka does not interpret the approach as revenge. Xi-Yu begins clearing the cinema one auditorium at a time while Zakuro plans to regroup with Lynch and look for Chrollo.',
    people: ['Hinrigh Biganduffno', 'Zakuro Custard', 'Lynch Fullbokko', 'Chrollo Lucilfer'],
    tracks: ['xi-yu', 'hisoka-search', 'phantom-troupe'],
    location: 'Tier 3 · cinema complex',
  }),
  timelineEvent({
    id: '393-hinrigh-negotiates-vvip-truce-with-apparent-hisoka',
    label: 'Hinrigh negotiates a temporary VVIP non-interference arrangement with the apparent Hisoka',
    detail: 'In auditorium #8, Hinrigh sits beside the man Xi-Yu believes is Hisoka. After receiving no answer to the identity question, Hinrigh asks him to remain on Tier 1 until the Heil-Ly conflict is resolved and offers VVIP access. Hinrigh explains the mafia/Troupe alignment against Heil-Ly and asks him not to attack the Troupe first.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'hisoka-search', 'phantom-troupe', 'heil-ly', 'negotiation', 'identity-uncertain'],
    location: 'Tier 3 · cinema auditorium #8',
    confidence: 'The negotiation is confirmed; the other party is deliberately not objectively identity-tagged in the Chapter 393 event graph.',
  }),
  timelineEvent({
    id: '393-apparent-hisoka-accepts-conditional-vvip-deal',
    label: 'The apparent Hisoka accepts the deal with a self-defense condition',
    detail: 'Hinrigh says the mafia cannot defeat either the apparent Hisoka or the Troupe and asks for patience while Heil-Ly is destroyed. The man asks who Hinrigh thinks would win and hears that Hinrigh supports the Spiders. He ultimately accepts the arrangement on the condition that he will not refuse a fight if the Troupe attacks first; Hinrigh agrees.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'hisoka-search', 'phantom-troupe', 'temporary-truce', 'identity-uncertain'],
    location: 'Tier 3 · cinema auditorium #8',
    confidence: 'The terms are confirmed as the Chapter 393 understanding; objective identity remains quarantined from the later Chapter 405 reveal.',
  }),
  timelineEvent({
    id: '393-keni-matches-maizan-intelligence-offer',
    label: 'Ken’i matches Hinrigh’s payment for Maizan’s hideout intelligence',
    detail: 'Ken’i and Cha-R personnel find Maizan waiting for Hinrigh. Maizan reveals the pending Heil-Ly hideout lead and offers Ken’i the same information. Ken’i immediately agrees to match the 50-million offer and orders a subordinate to bring cash.',
    people: ["Ken'i Wang", 'Maizan', 'Hinrigh Biganduffno'],
    tracks: ['cha-r', 'xi-yu', 'heil-ly', 'intelligence', 'maizan'],
    location: 'Tier 3',
  }),
  timelineEvent({
    id: '393-keni-expands-paid-heilly-identification-scheme',
    label: 'Ken’i expands the paid Heil-Ly identification and cover-up plan',
    detail: 'Ken’i says Cha-R and Xi-Yu are cooperating to crush Heil-Ly and states that they have Fourth Prince approval. He offers five million to the finder and corporal for each potential Heil-Ly member, proposes setting up a culprit for the killings with Maizan as eyewitness, and assures Maizan that every Heil-Ly member will be eliminated. Maizan’s rumor about Ken’i’s smile is not treated as a supernatural rule.',
    people: ["Ken'i Wang", 'Maizan'],
    tracks: ['cha-r', 'xi-yu', 'heil-ly', 'corruption', 'strategy'],
    location: 'Tier 3',
    confidence: 'Ken’i’s statements and offer are confirmed; Fourth Prince approval is recorded as Ken’i’s statement rather than independently verified by this chapter scene.',
  }),
  timelineEvent({
    id: '393-connelly-money-and-room3101-verification',
    label: 'Connelly brings the money and the mafia verifies Room 3101’s suspicious wall layout',
    detail: 'Xi-Yu lieutenant Connelly arrives with a bag of cash. Maizan leads the combined mafia group to Room 3101 in the first-class cabins and explains that a worker said it was uniquely missing a bathroom wall because plumbing space lay behind it. A wall now present would support the hidden-room lead, but Ken’i notes that anything could be behind it at the ship’s edge.',
    people: ['Connelly', 'Maizan', 'Hinrigh Biganduffno', "Ken'i Wang"],
    tracks: ['xi-yu', 'cha-r', 'heil-ly', 'room-3101', 'infrastructure'],
    location: 'Tier 3 · Room 3101',
    confidence: 'Room-layout intelligence and the verification logic are confirmed; hidden Heil-Ly ownership is still not established at this point.',
  }),
  timelineEvent({
    id: '393-maizan-disappears-inside-room3101',
    label: 'Maizan disappears immediately after entering Room 3101',
    detail: 'An unidentified old man opens Room 3101 and claims innocence. Maizan enters with his weapon ready while Hinrigh and Ken’i remain outside. From their perspective Maizan disappears after crossing into the room. The old man suggests he may have gone to the bathroom and repeatedly invites the underbosses inside.',
    people: ['Maizan', 'Hinrigh Biganduffno', "Ken'i Wang"],
    tracks: ['room-3101', 'xi-yu', 'cha-r', 'heil-ly', 'spatial-mystery'],
    location: 'Tier 3 · Room 3101',
    confidence: 'Maizan’s disappearance from Hinrigh and Ken’i’s observation is confirmed; destination, trigger, ability user, and mechanism remain unresolved.',
  }),
  timelineEvent({
    id: '393-hinrigh-knife-tests-room3101-boundary',
    label: 'Hinrigh tests Room 3101 with a thrown knife and forces the resident outside',
    detail: 'Hinrigh throws a knife past the old man’s head and observes that the knife does not disappear. He then orders the man to come outside and threatens that the next knife will not miss. The man complies. The single knife test does not establish a complete object-versus-person transport rule.',
    people: ['Hinrigh Biganduffno', "Ken'i Wang"],
    tracks: ['room-3101', 'xi-yu', 'cha-r', 'spatial-mystery', 'testing'],
    location: 'Tier 3 · Room 3101',
  }),
]);

export const succession393LuiniResearch = freeze({
  death: 'Nobunaga kills Luini at the Tier 5 Cha-R office immediately after Luini proposes a destructive alliance.',
  bodyEvidence: 'Tsudonke is shown Luini’s decapitated and bisected corpse; Heil-Ly members later examine the lower half of the corpse.',
  operationalConsequence: 'The Troupe says it will destroy Heil-Ly while continuing the Hisoka hunt. Heil-Ly members say Luini’s spatial ability had allowed them to hunt prey from the hideout, making his loss operationally significant.',
  typeBoundary: 'Perigord is confident Luini was an Emitter, but the supplied scene presents that as Perigord’s belief. The archive does not upgrade Luini’s Nen classification from unknown on that basis alone.',
  abilityBoundary: 'Luini’s previously documented sealed-room/marked-location spatial mechanics remain available from earlier chapters. Chapter 393 adds his death and the loss of the living user, not a new complete mechanics reveal.',
  source: source393,
});

export const succession393HeilLyResearch = freeze({
  disclosedMembers: freeze([
    freeze({ name: 'Daemon', level: 20, occupation: 'construction worker', nenType: 'unsupplied' }),
    freeze({ name: 'Gelato', level: 19, occupation: 'professional gamer', nenType: 'unsupplied' }),
    freeze({ name: 'Perigord', level: 18, occupation: 'investigator’s assistant', nenType: 'unsupplied' }),
    freeze({ name: 'Bille', level: 20, occupation: 'arcade employee', nenType: 'unsupplied' }),
    freeze({ name: 'Voconte', level: 26, occupation: 'human trafficker', nenType: 'Emitter' }),
    freeze({ name: 'Matvere', level: 18, occupation: 'college student', nenType: 'unsupplied' }),
  ]),
  levelThreshold: 'Gelato discusses needing to raise levels so members can reach level 21 and develop abilities.',
  innateTypeRule: 'The members recall Morena saying everyone has an innate Nen type; Matvere’s wish to be an Emitter is explicitly answered with the point that he does not choose his type.',
  voconteDoor: 'Voconte, a confirmed Emitter, says he can use his door ability to catch prey that wander into a trap. No formal ability name or complete mechanics are supplied, and the technique itself is not automatically classified as Emission from the owner’s natural type.',
  morenaCoaching: 'Morena instructs members to analyze opponent abilities and design around restrictions. Her example of an ability that reports how many hits are needed to defeat an enemy is hypothetical design advice, not an ability reveal.',
  source: source393,
});

export const succession393ApparentHisokaResearch = freeze({
  recovery: 'Lynch and Zakuro recover alive after the Chapter 392 encounter. Zakuro says he was knocked unconscious when he took his eyes off the man; Lynch says the man was gone when she woke.',
  contemporaneousBelief: 'Lynch and Zakuro are convinced the man is Hisoka. Hinrigh proceeds with a mafia negotiation on that same working assumption.',
  cinemaDeal: 'Hinrigh asks the man to remain on Tier 1/VVIP until the Heil-Ly conflict is resolved. Hinrigh promises the mafia will not interfere in a later Hisoka/Troupe fight if he refrains from starting one during the operation; the man accepts while reserving the right to fight if attacked first.',
  objectiveIdentityBoundary: 'The Chapter 405 Bonolenov/Metamorphorsen reinterpretation remains later knowledge and is not inserted into the Chapter 393 event participants or ability state.',
  source: source393,
});

export const succession393Room3101Research = freeze({
  leadProgression: 'Maizan’s Chapter 392 unplanned-room lead becomes a direct Room 3101 inspection with Xi-Yu and Cha-R present.',
  wallEvidence: 'Maizan reports that the worker described Room 3101 as the only room without a bathroom wall because plumbing space was behind it. The presence of a wall is treated as evidence worth testing, not proof of Heil-Ly ownership.',
  disappearance: 'Maizan enters while Hinrigh and Ken’i stay outside and then disappears from their view. The old man’s bathroom explanation is not accepted as verification.',
  knifeTest: 'Hinrigh throws a knife through the doorway and the knife does not disappear. This is one observed test; it does not establish a universal rule that objects are exempt or that only people can be transported.',
  unresolved: freeze(['Maizan’s destination and condition', 'The trigger for the disappearance', 'The responsible Nen user or ability', 'Whether Room 3101 directly connects to Heil-Ly', 'Why the knife does not disappear', 'Complete route and activation rules']),
  source: source393,
});

export const succession393RelationshipRecords = freeze([
  freeze({ id: 'relationship:luini-troupe-ch393-lethal-hostility', from: 'Luini', to: 'Phantom Troupe', type: 'hostile', chapter: 393, state: 'Luini proposes cooperation, Nobunaga immediately rejects him and kills him, and the Troupe commits to destroying Heil-Ly.', boundary: 'Luini’s death resolves the direct contact; later Troupe/Heil-Ly operations are not imported.', source: source393 }),
  freeze({ id: 'relationship:maizan-keni-ch393-intelligence-deal', from: 'Maizan', to: "Ken'i Wang", type: 'professional', chapter: 393, state: 'Maizan offers Ken’i the same Heil-Ly hideout intelligence he negotiated with Hinrigh; Ken’i matches the 50-million offer and expands paid identification incentives.', boundary: 'Transactional cooperation is confirmed; corruption/cover-up terms do not establish supernatural or permanent loyalty.', source: source393 }),
  freeze({ id: 'relationship:xi-yu-cha-r-ch393-heilly-cooperation', from: 'Xi-Yu Family', to: 'Cha-R Family', type: 'alliance', chapter: 393, state: 'Hinrigh and Ken’i coordinate around the Heil-Ly search, jointly pursue Maizan’s Room 3101 lead, and operate under a shared objective of destroying Heil-Ly.', boundary: 'Operational cooperation against Heil-Ly is confirmed for this chapter; permanent institutional alliance or merged command is not inferred.', source: source393 }),
]);

export const succession393ResolvedQuestions = freeze([
  freeze({ question: 'What happens immediately after Nobunaga draws his katana on Luini in Chapter 392?', chapter: 393, resolution: 'Nobunaga kills Luini almost immediately. Luini is later shown as a decapitated and bisected corpse.', source: source393 }),
  freeze({ question: 'Where does Maizan’s Chapter 392 unplanned-room lead take the mafia?', chapter: 393, resolution: 'Maizan leads Xi-Yu and Cha-R personnel to Room 3101 in the Tier 3 first-class cabins, where his wall-layout information is tested.', source: source393 }),
]);

export const succession393Mysteries = freeze([
  freeze({ question: 'Where did Maizan go after entering Room 3101?', chapter: 393, status: 'open; he disappears from Hinrigh and Ken’i’s view and no destination or condition is supplied', source: source393 }),
  freeze({ question: 'What mechanism causes the Room 3101 disappearance, and why does Hinrigh’s thrown knife remain visible?', chapter: 393, status: 'open; one person-disappearance and one knife test are observed but no complete rule is supplied', source: source393 }),
  freeze({ question: 'Does Room 3101 actually belong to or connect to Heil-Ly?', chapter: 393, status: 'open; the room is suspicious and the mafia is testing it, but the supplied chapter does not yet establish the full hidden-route connection', source: source393 }),
  freeze({ question: 'What is the official name and complete rule set of Voconte’s door ability?', chapter: 393, status: 'open; trap use is proposed but the technique is not fully demonstrated or named', source: source393 }),
  freeze({ question: 'What is Luini’s confirmed Nen type?', chapter: 393, status: 'open; Perigord believes he was an Emitter but this remains character inference', source: source393 }),
  freeze({ question: 'Will the temporary mafia arrangement with the apparent Hisoka hold until Heil-Ly is dealt with?', chapter: 393, status: 'open; the man agrees not to initiate a Troupe fight but reserves the right to respond if attacked', source: source393 }),
]);

export const succession393ChapterResearch = freeze([
  freeze({
    number: 393,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    source: source393,
    sourcePolicy: succession393SourcePolicy,
    chronology: freeze({
      voyageDay: 'Voyage Day 10 continuation inherited from the immediate Chapter 392 lower-tier threads',
      exactClockTime: null,
      opening: 'Direct continuation of Luini confronting Nobunaga, Phinks, and Feitan at the Tier 5 Cha-R office.',
      boundary: 'No exact Chapter 393 clock time is supplied; none is invented.',
    }),
    focus: 'Nobunaga kills Luini and the Phantom Troupe prioritizes destroying Heil-Ly; Morena’s members adapt their Nen-development plans after losing Luini; Lynch, Zakuro, and Hinrigh continue operating around a man they believe is Hisoka; Ken’i joins Maizan’s paid intelligence deal; and the mafia reaches Room 3101, where Maizan disappears after entering and Hinrigh begins testing the boundary.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Phantom Troupe / Luini', 'Heil-Ly Nen development', 'Xi-Yu / apparent Hisoka', 'Cha-R / Xi-Yu cooperation', 'Room 3101 mystery']),
    events: succession393TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Luini', 'Tsudonke', 'Morena Prudo', 'Daemon', 'Gelato', 'Perigord', 'Bille', 'Voconte', 'Tevelares', 'Quorolle', 'Matvere', 'Lynch Fullbokko', 'Zakuro Custard', 'Hinrigh Biganduffno', "Ken'i Wang", 'Maizan', 'Connelly']),
    locations: freeze(['Tier 5 · Cha-R office', 'Tier 3', 'Tier 3 · cinema complex / auditorium #8', 'Tier 3 · Room 3101']),
    threadLabels: freeze(['Mafia families', 'Heil-Ly', 'Troupe & Hisoka', 'Nen development', 'Ship operations', 'Room 3101']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 393 synopsis and trivia.',
      'Voyage Day 10 is retained from the immediate Chapter 392 handoff; no Chapter 393 clock time is invented.',
      'The apparent-Hisoka objective identity remains unresolved at the Chapter 393 boundary despite later Chapter 405 knowledge.',
      'Perigord’s Luini-Emitter statement remains his assessment rather than archive-level confirmation.',
      'Morena’s hit-count example remains hypothetical ability-design advice.',
      'Room 3101 mechanics remain unresolved beyond Maizan’s disappearance and the non-disappearing knife test.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({ luini: succession393LuiniResearch, heilLy: succession393HeilLyResearch, apparentHisoka: succession393ApparentHisokaResearch, room3101: succession393Room3101Research }),
    relationships: succession393RelationshipRecords,
    resolvedQuestions: succession393ResolvedQuestions,
    mysteries: succession393Mysteries,
  }),
]);

export const succession393ChapterFocus = succession393ChapterResearch[0].focus;
