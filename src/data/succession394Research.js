const freeze = (value) => Object.freeze(value);
const source394 = 'https://hunterxhunter.fandom.com/wiki/Chapter_394';

export const succession394SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 394 synopsis text',
  chapterUrl: source394,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 394 directly continues the Voyage Day 10 Room 3101 and lower-tier Heil-Ly threads from Chapter 393. No exact clock time is supplied or invented.',
  identityBoundary: 'Ken’i says Hinrigh has already found Hisoka, but the archive preserves the Chapter 393 apparent-Hisoka identity quarantine rather than converting this speaker belief into objective identity confirmation.',
  roomNetworkBoundary: 'Chapter 394 confirms that Room 3101 participates in Heil-Ly operations and supplies additional route information through Gateaume, Tassi, Voconte, Door C, Room 3131, the disposal/laundry room, processing/shower room, and living room. The archive records only the observed or reported connections and does not invent a complete spatial mechanism, trigger model, or topology.',
  excluded: freeze([
    'Importing any Chapter 395+ consequence, identity reveal, ability rule, or route explanation',
    'Treating Ken’i’s reference to Hisoka as objective proof of the apparent-Hisoka man’s identity',
    'Classifying Gateaume’s body phenomenon into a specific Nen category or supplying an activation rule not stated in the chapter',
    'Treating Gateaume’s displayed body as his real body after the bloodless knife test and his own reference to a real body elsewhere',
    'Generalizing Room 3101 into a complete people-only teleportation rule from Maizan and Tassi alone',
    'Treating Voconte’s natural Emitter type as proof that his door ability itself is Emission',
    'Inventing an ability for Bille merely because he reaches level 21 and performs Water Divination',
    'Inventing a Nen type for Dogman, Sodom, Orarge, Yokotani, Soufflé, Notre, Terebellum, Chiffon Toto, Montblanc Toto, Bille, or Matvere beyond the explicit Chapter 394 disclosures',
    'Treating the soldiers’ institutional-war scenarios as events that have already occurred',
    'Treating Borksen as knowing Nen mechanics; she explicitly says the information is classified and she does not know the details',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Black Whale', confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 394 synopsis' }) => freeze({
  id,
  day: 10,
  time: 'Voyage Day 10 · exact clock time unsupplied',
  chronology: 'direct continuation of Chapter 393 on Voyage Day 10; exact clock time unsupplied',
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 394,
  confidence,
  source: source394,
});

export const succession394TimelineEvents = freeze([
  timelineEvent({
    id: '394-gateaume-decoy-body-exposed',
    label: 'Hinrigh exposes Gateaume’s bloodless decoy-body phenomenon',
    detail: 'Hinrigh throws a knife into the old man Gateaume’s right thigh. Gateaume reacts as if injured, but Hinrigh points out that there is no blood and demands the location of his real body and Maizan. Gateaume identifies himself as a former insurance scammer, refuses to answer, disappears, and leaves the knife behind. The chapter demonstrates a false or remote body phenomenon but does not supply its Nen category, activation, range, or real-body location.',
    people: ['Hinrigh Biganduffno', 'Gateaume', "Ken'i Wang"],
    tracks: ['room-3101', 'heil-ly', 'xi-yu', 'cha-r', 'nen-unknown'],
    location: 'Tier 3 · Room 3101',
  }),
  timelineEvent({
    id: '394-tassi-disappears-through-room3101',
    label: 'Tassi enters Room 3101 and disappears',
    detail: 'Ken’i argues that the Troupe can be sent against Heil-Ly now that Luini is dead. Xi-Yu member Tassi steps toward Room 3101 to recover Hinrigh’s knife and vanishes as soon as he enters. Hinrigh initially suspects the same abductor responsible for earlier disappearances; Ken’i answers that Luini has already been killed by Nobunaga and that the Troupe has declared Heil-Ly an elimination target.',
    people: ['Tassi', 'Hinrigh Biganduffno', "Ken'i Wang", 'Luini', 'Nobunaga Hazama'],
    tracks: ['room-3101', 'xi-yu', 'cha-r', 'heil-ly', 'phantom-troupe'],
    location: 'Tier 3 · Room 3101',
  }),
  timelineEvent({
    id: '394-bille-kills-tassi-reaches-level21',
    label: 'Bille kills Tassi, reaches level 21, and learns he is a Conjurer',
    detail: 'Tassi finds himself in front of a closed door elsewhere in Heil-Ly’s network. Bille appears behind him and stabs him in the neck, celebrating that he has reached level 21. Matvere supplies a Water Divination cup and says he himself was a Transmuter. Bille hopes to be an Emitter but the test identifies him as a Conjurer. Gelato comments that there seem to be many left-handed Conjurers.',
    people: ['Tassi', 'Bille', 'Matvere', 'Gelato'],
    tracks: ['heil-ly', 'contagion', 'nen-development', 'death'],
    location: 'Tier 3 · Heil-Ly route network',
  }),
  timelineEvent({
    id: '394-heilly-corpse-processing-route-expanded',
    label: 'Tassi’s corpse enters Heil-Ly’s processing chain',
    detail: 'Terebellum, a level 21 Emitter, delivers Tassi’s corpse to Chiffon Toto and Montblanc Toto. He reports that Voconte directly connected the room to the processing area. Chiffon removes Tassi’s clothes while Montblanc prepares to dismember the body, exposing a dedicated corpse-processing workflow inside the hideout network.',
    people: ['Terebellum', 'Tassi', 'Voconte', 'Chiffon Toto', 'Montblanc Toto'],
    tracks: ['heil-ly', 'voconte', 'room-network', 'body-disposal'],
    location: 'Tier 3 · Heil-Ly hideout / disposal-processing network',
  }),
  timelineEvent({
    id: '394-morena-assesses-room3101-and-vvip-liaison',
    label: 'Morena assesses the compromised Room 3101 route and silent VVIP liaison',
    detail: 'A Heil-Ly member reports that the butler left in the VVIP area as liaison to the Fourth Prince has gone quiet. Morena considers that Tserriednich may be on to them and, based on Gateaume’s report, expects the hideout to be discovered soon.',
    people: ['Morena Prudo', 'Gateaume', 'Tserriednich Hui Guo Rou'],
    tracks: ['heil-ly', 'tserriednich', 'room-3101', 'intelligence'],
    location: 'Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '394-morena-orders-tserriednich-soldier-capture',
    label: 'Morena orders Dogman and Sodom to capture a Tserriednich soldier',
    detail: 'Morena proposes bringing one of Tserriednich’s personal soldiers to Heil-Ly’s side. Matvere, now level 21, prefers to serve as the organ for the operation; Sodom, a level 31 Manipulator, volunteers to accompany Dogman to capture a guard.',
    people: ['Morena Prudo', 'Matvere', 'Sodom', 'Dogman', 'Tserriednich Hui Guo Rou'],
    tracks: ['heil-ly', 'tserriednich', 'capture-operation', 'contagion'],
    location: 'Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '394-morena-contagion-tracking-door-c-guards',
    label: 'Morena plans Contagion tracking and shifts access to Door C',
    detail: 'Morena says she wants to infect someone on Tserriednich’s side with Contagion so she can track his movements. She orders members to bring any of his soldiers they find to the hideout, says Room 3101 can no longer be used and Door C should be used instead, and assigns Orarge and Yokotani to guard the door in shifts and invite Tserriednich’s soldiers inside.',
    people: ['Morena Prudo', 'Orarge', 'Yokotani', 'Tserriednich Hui Guo Rou'],
    tracks: ['heil-ly', 'contagion', 'door-c', 'tserriednich', 'security'],
    location: 'Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '394-room3131-processing-route-briefing',
    label: 'Notre explains the Room 3131 disposal-to-processing return route',
    detail: 'Morena sends Soufflé and Notre back to Room 3131 to report on Room 3101. Notre says he returned through Room 3131 and then the disposal area/laundry room; to reverse the route they must pass from the laundry room to the processing area/shower room and then out through the living room. Soufflé asks for the explanation again. The archive preserves this reported route without inventing unspoken door triggers or topology.',
    people: ['Morena Prudo', 'Soufflé', 'Notre'],
    tracks: ['heil-ly', 'room-3131', 'room-network', 'room-3101'],
    location: 'Tier 3 · Heil-Ly hideout / Room 3131 route',
  }),
  timelineEvent({
    id: '394-dogman-ordered-past-level50',
    label: 'Morena orders Dogman to level past 50 for the priority mission',
    detail: 'Morena tells Dogman that he has the most important mission and asks him to find what she is looking for. Dogman, a level 36 Enhancer, says he needs a few more levels; Morena agrees and sends him to the new processing area so he can get past level 50.',
    people: ['Morena Prudo', 'Dogman'],
    tracks: ['heil-ly', 'contagion', 'dogman', 'leveling'],
    location: 'Tier 3 · Heil-Ly hideout',
  }),
  timelineEvent({
    id: '394-hinrigh-recovers-cat-camcorder',
    label: 'Hinrigh recovers the surveillance cat and returns it to a camcorder',
    detail: 'Hinrigh returns to the large fountain, retrieves the cat used for surveillance, turns it back into a camcorder, and reviews the footage. This confirms the continuing object-to-animal surveillance use of Biohazard without supplying a new transformation rule.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'biohazard', 'surveillance', 'heil-ly'],
    location: 'Tier 3 · large fountain',
  }),
  timelineEvent({
    id: '394-gipper-raids-heilly-office-cover-story',
    label: 'Gipper’s unit raids the Heil-Ly office and constructs an official cover story',
    detail: 'Tserriednich’s soldiers force entry into a registered Heil-Ly office on Tier 3 and discover an old body that appears to be a Cha-R member. Corporal Gipper orders a report claiming a Heil-Ly member resisted arrest, shot at them, and escaped into the room. He worries that treating a supposed civilian death incorrectly could turn a mafia dispute into a broader political crisis and prioritizes capturing Morena for Tserriednich.',
    people: ['Gipper', 'Otocin', 'Morena Prudo', 'Tserriednich Hui Guo Rou'],
    tracks: ['kakin-military', 'heil-ly', 'cha-r', 'cover-story', 'institutional-risk'],
    location: 'Tier 3 · registered Heil-Ly office',
  }),
  timelineEvent({
    id: '394-otocin-reveals-nen-borksen-transfer',
    label: 'Otocin introduces Nen intelligence and triggers Borksen’s transfer',
    detail: 'Otocin asks about countermeasures if Heil-Ly includes Nen users. Gipper does not know the term. Otocin says Nen is a dangerous power spreading on Tier 1 and identifies Borksen, a provisional Hunter on royal-security detail, as his source. Gipper decides to request Borksen’s transfer to Tier 3 as an adviser while repeatedly threatening Otocin for informality toward Tserriednich.',
    people: ['Otocin', 'Gipper', 'Borksen', 'Tserriednich Hui Guo Rou'],
    tracks: ['kakin-military', 'nen-knowledge', 'borksen', 'tserriednich'],
    location: 'Tier 3 · registered Heil-Ly office',
  }),
  timelineEvent({
    id: '394-soldiers-model-mafia-war-and-transfer-warning',
    label: 'Tserriednich’s soldiers model the risk of a Kakin–mafia escalation',
    detail: 'The soldiers debate police and army discretion, forensic tampering, Hunter Association intervention, Justice Bureau interests, Benjamin’s likely incentives, Heil-Ly’s apparent goal of destroying balance, and the risk of lower-tier unrest. They propose using rejected or delayed transfer requests as an early-warning signal that a classified mafia-eradication operation and Tier 2–3 passage restrictions have begun. These are assessments and contingency planning, not events already in force.',
    people: ['Gipper', 'Otocin', 'Momolly'],
    tracks: ['kakin-military', 'mafia-balance', 'justice-bureau', 'hunter-association', 'contingency-planning'],
    location: 'Tier 3 · registered Heil-Ly office',
    confidence: 'The discussion and proposed warning system are confirmed; the predicted eradication operation and institutional reactions remain scenario analysis.',
  }),
  timelineEvent({
    id: '394-borksen-confirms-tserriednich-nen-training',
    label: 'Borksen confirms Tserriednich is learning Nen from Theta',
    detail: 'After rejoining the soldiers, Borksen says Tserriednich is learning Nen from Theta and warns that leaking the information would cause immediate demotion. Borksen herself does not know Nen’s classified mechanics and says she had planned to investigate before being transferred. She notes that Theta and Salkov began acting strangely after the emergency broadcast and concludes that Morena is most likely a Nen user who should be avoided.',
    people: ['Borksen', 'Theta', 'Salkov', 'Tserriednich Hui Guo Rou', 'Morena Prudo', 'Otocin', 'Momolly', 'Gipper'],
    tracks: ['borksen', 'tserriednich', 'theta', 'nen-knowledge', 'heil-ly'],
    location: 'Black Whale · lower-tier military group',
  }),
  timelineEvent({
    id: '394-borksen-warns-heilly-knows-soldiers',
    label: 'Borksen warns that Morena likely knows the personal soldiers’ identities',
    detail: 'Borksen explains that the tattoo artist who gave the unit its tattoos had been a Heil-Ly member and that their identities were stored in his client database, which Morena likely possesses. She compares Nen’s apparent danger to a top-secret weapon based on Theta and Salkov’s reactions, makes survival the priority, recommends establishing a working relationship with Xi-Yu or Cha-R, and agrees that the group needs a contingency plan if one of them is captured.',
    people: ['Borksen', 'Morena Prudo', 'Otocin', 'Momolly'],
    tracks: ['borksen', 'heil-ly', 'xi-yu', 'cha-r', 'survival-planning'],
    location: 'Black Whale · lower-tier military group',
  }),
]);

export const succession394RoomNetworkResearch = freeze({
  gateaume: 'Gateaume’s displayed old-man body bleeds no blood when Hinrigh stabs the thigh. Gateaume refers to a real body elsewhere and then disappears, leaving the knife behind. The archive records an unexplained decoy/remote-body phenomenon without classifying its Nen type or full mechanism.',
  tassi: 'Tassi enters Room 3101 and disappears in front of the mafia group. He later appears before a closed door inside Heil-Ly’s network and is killed by Bille.',
  voconte: 'Terebellum reports that Voconte directly connected the corpse-receiving room to the processing area. This is the first supplied Chapter 394 evidence that adds an operational direct-connection function to Voconte’s door technique; trigger, range, directionality, capacity, and full topology remain unresolved.',
  room3101: 'Morena says Room 3101 can no longer be used and directs members to use Door C. This confirms Room 3101 was part of Heil-Ly’s usable route/access system by Chapter 394.',
  route3131: 'Notre reports a route involving Room 3131, the disposal area/laundry room, processing area/shower room, and living room. The archive preserves his reported sequence without inventing omitted door mechanics.',
  unresolved: freeze(['Gateaume’s real-body location and exact ability mechanics', 'Maizan’s location and condition', 'The exact trigger that moved Tassi from Room 3101', 'Voconte’s full door-placement and routing rules', 'Complete relationship among Room 3101, Door C, Room 3131, disposal, processing, and living-room spaces']),
  source: source394,
});

export const succession394HeilLyResearch = freeze({
  memberDisclosures: freeze([
    freeze({ name: 'Bille', level: 21, occupation: 'arcade employee', nenType: 'Conjurer', note: 'Reaches level 21 by killing Tassi and receives Water Divination.' }),
    freeze({ name: 'Matvere', level: 21, occupation: 'college student', nenType: 'Transmuter', note: 'States that his own Water Divination identified him as a Transmuter.' }),
    freeze({ name: 'Terebellum', level: 21, occupation: 'smuggler / hitman', nenType: 'Emitter' }),
    freeze({ name: 'Chiffon Toto', level: 6, occupation: 'seamstress / ornament factory worker', nenType: 'Conjurer' }),
    freeze({ name: 'Montblanc Toto', level: 3, occupation: 'animal feed factory worker / body disposal', nenType: 'Conjurer' }),
    freeze({ name: 'Sodom', level: 31, occupation: 'back-alley doctor / hitman', nenType: 'Manipulator' }),
    freeze({ name: 'Orarge', level: 21, occupation: 'waste disposal contractor', nenType: 'Enhancer' }),
    freeze({ name: 'Yokotani', level: 27, occupation: 'corrupt lawyer', nenType: 'Conjurer' }),
    freeze({ name: 'Soufflé', level: 28, occupation: 'hacker', nenType: 'Transmuter' }),
    freeze({ name: 'Notre', level: 24, occupation: 'plumber', nenType: 'Conjurer' }),
    freeze({ name: 'Dogman', level: 36, occupation: 'professional wrestler', nenType: 'Enhancer' }),
  ]),
  level21: 'Bille’s kill of Tassi raises him to level 21 and is followed by Water Divination, confirming the ability-development/type-discovery transition discussed in Chapter 393. No personal Bille ability is revealed yet.',
  contagionTracking: 'Morena explicitly says she wants to infect a person on Tserriednich’s side with Contagion so that she can track his movements. The archive records this intended tracking function without adding unsupplied precision, distance, interface, or duration.',
  soldierCapture: 'Morena assigns Dogman and Sodom to capture one of Tserriednich’s personal soldiers and bring targets to the hideout.',
  dogman: 'Dogman is level 36 and says he needs more levels for Morena’s priority mission. Morena sends him to the new processing area to get past level 50. The exact target of his later search is not named in this supplied synopsis and is not invented.',
  source: source394,
});

export const succession394TserriednichSoldierResearch = freeze({
  raid: 'Gipper’s unit raids a registered Heil-Ly office, finds an old body believed to be Cha-R, and constructs a false resistance/shooting narrative to justify forced entry while worrying about the legal and political framing of a civilian death.',
  nenKnowledge: 'Otocin knows only broad danger claims about Nen from Borksen. Borksen confirms Tserriednich is learning Nen from Theta but says the subject is classified and she herself does not know the mechanics.',
  borksenTransfer: 'Gipper requests Borksen’s transfer to Tier 3 as an adviser after Otocin identifies her as his source.',
  institutionalScenarios: 'The soldiers discuss police, army, Justice Bureau, Hunter Association, Benjamin, and lower-tier reactions to a mafia conflict. These are their forecasts and contingency analysis, not archive-level confirmation that an eradication operation has begun.',
  earlyWarning: 'They propose periodic transfer requests as a signal: rejections or holds could indicate a classified operation and restriction of the Tier 2–3 passageway. This remains a proposed indicator.',
  exposure: 'Borksen believes Morena likely has identifying information on the group because their unit tattoo artist was formerly Heil-Ly and kept a client database.',
  survivalPlan: 'Borksen prioritizes avoiding Morena, suggests contacting Xi-Yu or Cha-R for a working relationship, and agrees to develop a capture contingency.',
  source: source394,
});

export const succession394RelationshipRecords = freeze([
  freeze({ id: 'relationship:gateaume-xiyu-ch394-room3101-deception', from: 'Gateaume', to: 'Xi-Yu Family', type: 'hostile', chapter: 394, state: 'Gateaume uses a bloodless false/remote body at Room 3101, refuses to reveal his real body or Maizan, and disappears after Hinrigh exposes the deception.', boundary: 'The hostile deception is confirmed; exact Nen mechanics and Gateaume’s real-body location remain unknown.', source: source394 }),
  freeze({ id: 'relationship:bille-tassi-ch394-lethal-attack', from: 'Bille', to: 'Tassi', type: 'hostile', chapter: 394, state: 'Bille ambushes Tassi after the Room 3101 transfer and kills him with a neck stab, reaching level 21.', boundary: 'Tassi is dead; no additional Bille ability is invented from the level-up.', source: source394 }),
  freeze({ id: 'relationship:morena-tserriednich-ch394-tracking-hostility', from: 'Morena Prudo', to: 'Tserriednich Hui Guo Rou', type: 'hostile', chapter: 394, state: 'Morena expects Tserriednich to retaliate for her betrayal and plans to capture and infect someone on his side with Contagion to track his movements.', boundary: 'Mutual political hostility and Morena’s plan are confirmed; Tserriednich’s exact timing and response are explicitly unresolved.', source: source394 }),
  freeze({ id: 'relationship:borksen-soldier-circle-ch394-cooperation', from: 'Borksen', to: 'Kakin Military', type: 'professional', chapter: 394, state: 'Borksen briefs the lower-tier soldier group on Tserriednich’s classified Nen training, Morena risk, identity exposure, and survival planning after being transferred as an adviser.', boundary: 'The cooperation is confirmed; Borksen does not possess detailed Nen mechanics and no later capture/recruitment state is imported.', source: source394 }),
]);

export const succession394ResolvedQuestions = freeze([
  freeze({ question: 'Is Room 3101 actually connected to Heil-Ly operations?', chapter: 394, resolution: 'Yes. Tassi is transferred into Heil-Ly’s network after entering, Morena says Room 3101 can no longer be used, and Gateaume reports on the compromised access. The complete mechanism remains unresolved.', source: source394 }),
  freeze({ question: 'What happens to Tassi after he disappears through Room 3101?', chapter: 394, resolution: 'He appears elsewhere inside Heil-Ly’s route network and is killed by Bille, whose level rises to 21.', source: source394 }),
  freeze({ question: 'What is Bille’s natural Nen type?', chapter: 394, resolution: 'Water Divination identifies Bille as a Conjurer.', source: source394 }),
  freeze({ question: 'What is Matvere’s natural Nen type?', chapter: 394, resolution: 'Matvere states that his own test identified him as a Transmuter.', source: source394 }),
]);

export const succession394Mysteries = freeze([
  freeze({ question: 'Where is Gateaume’s real body and what exactly is the bloodless body phenomenon?', chapter: 394, status: 'open; the displayed body is exposed as false/remote and disappears, but the chapter does not supply its Nen category, activation, range, or real-body location', source: source394 }),
  freeze({ question: 'Where is Maizan and what condition is he in?', chapter: 394, status: 'open; Gateaume refuses to answer and Chapter 394 does not resolve Maizan’s destination or state', source: source394 }),
  freeze({ question: 'What are Voconte’s complete door-routing rules?', chapter: 394, status: 'partially advanced; a direct connection to the processing area is reported, but trigger, directionality, placement, range, capacity, and reset remain unresolved', source: source394 }),
  freeze({ question: 'What personal ability will Bille develop after reaching level 21?', chapter: 394, status: 'open; his Conjurer type is revealed but no individual ability is supplied', source: source394 }),
  freeze({ question: 'What exactly is Dogman being prepared to find?', chapter: 394, status: 'open in the supplied synopsis; Morena calls it her most important mission but does not name the target here', source: source394 }),
  freeze({ question: 'When and how will Tserriednich move against Morena?', chapter: 394, status: 'open; Morena explicitly says the timing and method are unclear while the succession contest continues', source: source394 }),
  freeze({ question: 'Will the soldiers’ transfer-request early-warning system correctly detect a mafia-eradication operation?', chapter: 394, status: 'open; it is a proposed contingency signal, not a confirmed active operation', source: source394 }),
]);

export const succession394ChapterResearch = freeze([
  freeze({
    number: 394,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 10',
    source: source394,
    sourcePolicy: succession394SourcePolicy,
    chronology: freeze({
      voyageDay: 'Voyage Day 10 continuation inherited from the immediate Chapter 393 Room 3101 and lower-tier threads',
      exactClockTime: null,
      opening: 'Direct continuation of Hinrigh and Ken’i confronting the old man outside Room 3101 after Maizan’s disappearance.',
      boundary: 'No exact Chapter 394 clock time is supplied; none is invented.',
    }),
    focus: 'Hinrigh exposes Gateaume’s bloodless decoy-body phenomenon and Tassi disappears through Room 3101 before Bille kills him inside Heil-Ly’s network; Voconte’s door routing and Heil-Ly’s processing logistics become more concrete; Morena pivots toward capturing and infecting Tserriednich’s soldiers; and Gipper, Otocin, Momolly, and Borksen assess Nen, mafia-war risk, and their own exposure while confirming that Tserriednich is learning Nen from Theta.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Room 3101 / Gateaume', 'Heil-Ly leveling and processing', 'Morena / Tserriednich soldier capture', 'Hinrigh surveillance', 'Gipper military raid', 'Borksen / Tserriednich Nen intelligence']),
    events: succession394TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Hinrigh Biganduffno', 'Gateaume', "Ken'i Wang", 'Tassi', 'Nobunaga Hazama', 'Bille', 'Matvere', 'Gelato', 'Terebellum', 'Voconte', 'Chiffon Toto', 'Montblanc Toto', 'Morena Prudo', 'Tserriednich Hui Guo Rou', 'Sodom', 'Dogman', 'Orarge', 'Yokotani', 'Soufflé', 'Notre', 'Gipper', 'Otocin', 'Momolly', 'Borksen', 'Theta', 'Salkov']),
    locations: freeze(['Tier 3 · Room 3101', 'Tier 3 · Heil-Ly route network', 'Tier 3 · Heil-Ly hideout / processing network', 'Tier 3 · Room 3131 route', 'Tier 3 · large fountain', 'Tier 3 · registered Heil-Ly office', 'Black Whale · lower-tier military group']),
    threadLabels: freeze(['Mafia families', 'Heil-Ly', 'Nen development', 'Tserriednich', 'Kakin military', 'Ship operations', 'Room network']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 394 synopsis.',
      'Voyage Day 10 is retained from the immediate Chapter 393 handoff; no Chapter 394 clock time is invented.',
      'Room 3101 is now confirmed as part of Heil-Ly operations, while the complete route mechanism remains unresolved.',
      'Gateaume’s bloodless false/remote body is demonstrated, but its Nen category and complete mechanics remain unknown.',
      'Bille’s Conjurer type and Matvere’s Transmuter type are explicit; no personal Bille ability is invented.',
      'Morena’s Contagion tracking plan is recorded only to the extent explicitly stated.',
      'Borksen confirms Tserriednich is learning Nen from Theta but does not herself know the classified mechanics.',
      'Institutional-war and eradication scenarios discussed by the soldiers remain forecasts rather than completed events.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({ roomNetwork: succession394RoomNetworkResearch, heilLy: succession394HeilLyResearch, tserriednichSoldiers: succession394TserriednichSoldierResearch }),
    relationships: succession394RelationshipRecords,
    resolvedQuestions: succession394ResolvedQuestions,
    mysteries: succession394Mysteries,
  }),
]);

export const succession394ChapterFocus = succession394ChapterResearch[0].focus;
