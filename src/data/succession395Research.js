const freeze = (value) => Object.freeze(value);
const source395 = 'https://hunterxhunter.fandom.com/wiki/Chapter_395';

export const succession395SourcePolicy = freeze({
  reviewedAt: '2026-08-10',
  soleStorySource: 'User-supplied Hunterpedia Chapter 395 synopsis text',
  chapterUrl: source395,
  titleStatus: 'No chapter title was supplied; none is invented.',
  chronologyPolicy: 'Chapter 395 opens on Voyage Day 10 as a direct continuation of Hinrigh’s Chapter 394 camcorder review, then shifts into an undated pre-voyage Meteor City childhood flashback. The archive keeps publication order, current-day state, and flashback story-time separate.',
  teleportationBoundary: 'Hinrigh reviews footage and becomes confident that Heil-Ly is using a Nen ability for spatial transfer/access. The archive preserves his evidence-backed conclusion without assigning the mechanism to Luini, Voconte, Gateaume, or any other specific user and without inventing trigger, range, topology, or directionality.',
  flashbackBoundary: 'Uvogin, Pakunoda, Shalnark, Sarasa, and other childhood characters appear alive inside the historical flashback. Their flashback appearance does not alter their publication-boundary life state or resurrect deceased characters.',
  troupeOriginBoundary: 'Chapter 395 begins the Phantom Troupe childhood/origin flashback and supplies social context for Meteor City, but it does not yet depict the formal founding decision or license importing Chapter 396+ outcomes, vows, deaths, identities, or motivations.',
  excluded: freeze([
    'Importing any Chapter 396+ event, Sarasa outcome, formal Troupe founding scene, Sheila outcome, or later identity/context reveal',
    'Treating the three hooded/bound children shown in the van as Sarasa, Sheila, Pakunoda, or any other named child without Chapter 395 identification',
    'Treating Pakunoda calling Chrollo “little brother” as proof of a biological sibling relationship; Chrollo immediately objects and says he is older',
    'Assigning the Chapter 395 teleportation/access system to Voconte, Luini, Gateaume, or another specific Heil-Ly member without explicit attribution',
    'Promoting Phinks and Nobunaga’s comparison between Heil-Ly and the early Troupe into a complete statement of the Troupe’s founding ideology',
    'Treating narrated historical statistics about Meteor City as a precise date for the childhood scenes',
    'Inventing exact ages, years, clock times, room dimensions, or hidden-room topology not supplied in the synopsis',
  ]),
});

const timelineEvent = ({ id, label, detail, people = [], tracks = [], location = 'Black Whale', time = 'Voyage Day 10 · exact clock time unsupplied', confidence = 'Confirmed in the user-supplied Hunterpedia Chapter 395 synopsis' }) => freeze({
  id,
  day: 10,
  time,
  chronology: time,
  label,
  title: label,
  detail,
  people: freeze(people),
  tracks: freeze(tracks),
  location,
  tier: location,
  chapter: 395,
  confidence,
  source: source395,
});

export const succession395TimelineEvents = freeze([
  timelineEvent({
    id: '395-hinrigh-footage-teleportation-conclusion',
    label: 'Hinrigh concludes Heil-Ly is using Nen-mediated teleportation/access',
    detail: 'Hinrigh continues reviewing the camcorder footage and sees two Heil-Ly members use the only hallway to enter the standard cabins, then hours later enter that hallway again from a different direction without an ordinary return path. He considers secret passages but becomes confident that a Nen ability is giving Heil-Ly access to the hideout. The exact user, trigger, route, and mechanism remain unassigned.',
    people: ['Hinrigh Biganduffno'],
    tracks: ['xi-yu', 'heil-ly', 'room-network', 'nen-spatial', 'surveillance'],
    location: 'Tier 3 · standard-cabin corridor',
  }),
  timelineEvent({
    id: '395-mafia-military-briefing-and-pursuit-plan',
    label: 'Hinrigh and Ken’i coordinate a Heil-Ly pursuit with Tserriednich’s soldiers',
    detail: 'Hinrigh returns to Ken’i, who confirms with the six soldiers that the registered Heil-Ly office is known, sealed, and empty after the warehouse-guard body was found. Ken’i says the probable hideout lies behind Room 3101, Nobunaga will investigate with two Troupe members, and he and Hinrigh will track the two people seen on camera and try to take them alive to avoid police involvement. Borksen says the soldiers cannot assist directly because Heil-Ly knows their faces.',
    people: ['Hinrigh Biganduffno', "Ken'i Wang", 'Borksen', 'Gipper', 'Otocin', 'Momolly', 'Nobunaga Hazama'],
    tracks: ['xi-yu', 'cha-r', 'kakin-military', 'heil-ly', 'phantom-troupe', 'capture-plan'],
    location: 'Tier 3 · joint lower-tier briefing',
  }),
  timelineEvent({
    id: '395-troupe-breaches-room3102-bathroom-wall',
    label: 'Nobunaga, Phinks, and Feitan breach the hidden-room boundary from Room 3102',
    detail: 'Nobunaga, Phinks, and Feitan enter Room 3102 beside the Room 3101 trap. Phinks argues that the hidden space may connect several cabins and that the bathroom is the safest starting point because a door may not be the only trigger. Nobunaga cuts a rectangular opening through the bathroom wall, and Feitan forces the room’s resident to enter first before the trio follows.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['phantom-troupe', 'heil-ly', 'room-3101', 'room-3102', 'hidden-room'],
    location: 'Tier 3 · Room 3102 / breached bathroom wall',
  }),
  timelineEvent({
    id: '395-troupe-inspects-recently-used-hidden-room',
    label: 'The Troupe finds a recently used hidden room and compares Heil-Ly with its own beginnings',
    detail: 'Inside the dim hidden room, Feitan notes food and drinks suggesting recent occupation. Phinks questions why a competent group that detected and escaped the Troupe allowed the amateur Luini to confront them without warning. Nobunaga suggests Luini may have been used as a scapegoat and says Heil-Ly resembles the Troupe in some ways; Phinks rejects the comparison because the Troupe does not accept amateurs and does not seek to destroy the world. Nobunaga answers that the Troupe itself began from resignation and anger while searching for purpose.',
    people: ['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Luini'],
    tracks: ['phantom-troupe', 'heil-ly', 'hidden-room', 'troupe-origin'],
    location: 'Tier 3 · hidden room adjacent to Room 3101/3102',
  }),
  timelineEvent({
    id: '395-meteor-city-tape-chase',
    label: 'Childhood Chrollo, Franklin, and Shalnark flee Uvogin with a found videotape',
    detail: 'The story shifts to an undated childhood flashback in Meteor City. Franklin catches a videotape while he, Shalnark, and Chrollo hope it contains something they can understand. Uvogin appears, declares the trash-pile territory his kingdom, attacks Shalnark, and fights Franklin while Franklin throws the tape to Chrollo and tells him to run.',
    people: ['Chrollo Lucilfer', 'Franklin Bordeau', 'Shalnark', 'Uvogin'],
    tracks: ['meteor-city', 'troupe-origin', 'childhood'],
    location: 'Meteor City · trash-pile territory',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
  timelineEvent({
    id: '395-phinks-feitan-intercept-chrollo-tape-swap',
    label: 'Childhood Chrollo fools Phinks and Feitan with a decoy language tape',
    detail: 'Phinks and Feitan intercept Chrollo on a motorcycle and promise to return the tape if he hands it over. Chrollo calmly gives them a cassette, but after they leave he reveals that he kept the real tape and handed Phinks Volume 20 of Learning Gelman instead.',
    people: ['Chrollo Lucilfer', 'Phinks Magcub', 'Feitan Portor'],
    tracks: ['meteor-city', 'troupe-origin', 'childhood', 'chrollo'],
    location: 'Meteor City',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
  timelineEvent({
    id: '395-chrollo-church-graves-meteor-city-crisis',
    label: 'Chrollo reaches the All-Faiths Church as Meteor City’s child-abduction crisis is contextualized',
    detail: 'At the All-Faiths Church, Father Lisores warns Chrollo that abductors are entering internal residential zones and that more children are disappearing. The chapter’s narration explains that Meteor City residents lacked official social status and were exploited; before mafia-linked protection, hundreds died yearly and 70% of the casualties were children under fifteen. The narration also describes the later protection-for-recruits relationship, the elders’ Nen-backed law of retribution, and the climate in which the Phantom Troupe eventually came into being. These historical statements are context, not a precise dating of the childhood scene or a depiction of the formal founding.',
    people: ['Chrollo Lucilfer', 'Lisores'],
    tracks: ['meteor-city', 'child-abductions', 'mafia-history', 'troupe-origin'],
    location: 'Meteor City · All-Faiths Church',
    time: 'Voyage Day 10 narrative · flashback with broader undated Meteor City historical exposition',
  }),
  timelineEvent({
    id: '395-chrollo-pakunoda-discovers-power-cleaners',
    label: 'Chrollo and Pakunoda discover Mighty Sweepin’ Power Cleaners on the tape',
    detail: 'Chrollo finds Pakunoda in the church video room, plays the tape, and initially sees static. Pakunoda is surprised that Chrollo can already speak Gelman and Jannan. After Chrollo fast-forwards, they discover Mighty Sweepin’ Power Cleaners. Pakunoda wants everyone to watch, and Chrollo decides it will be more fun if they dub the show so the others can follow it.',
    people: ['Chrollo Lucilfer', 'Pakunoda'],
    tracks: ['meteor-city', 'troupe-origin', 'childhood', 'power-cleaners'],
    location: 'Meteor City · All-Faiths Church video room',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
  timelineEvent({
    id: '395-lisores-elder-discuss-chrollo-potential',
    label: 'Lisores and a Meteor City elder discuss Chrollo’s promise',
    detail: 'In the church basement, Lisores tells an older individual that Chrollo’s curiosity and intelligence show great promise and wonders whether his ideas could help the elders address the city’s problems. The older individual welcomes the possibility. The chapter does not show Chrollo joining the elders or making a formal commitment here.',
    people: ['Lisores', "Meteor City's Elder", 'Chrollo Lucilfer'],
    tracks: ['meteor-city', 'chrollo', 'elders', 'troupe-origin'],
    location: 'Meteor City · All-Faiths Church basement',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
  timelineEvent({
    id: '395-chrollo-pakunoda-dubbing-plan',
    label: 'Chrollo recruits Pakunoda for a dubbed Power Cleaners performance',
    detail: 'Chrollo explains dubbing, says he will write the script, and asks Pakunoda to voice the Pink Cleaner. Pakunoda jokingly calls him her little brother; Chrollo objects that he is older. He asks her to recruit Sheila and Sarasa for the other female roles, and tells Pakunoda he loves her when she anticipates exactly what he needs. The exchange establishes affection and childhood friendship, not a biological sibling relationship.',
    people: ['Chrollo Lucilfer', 'Pakunoda', 'Sheila', 'Sarasa'],
    tracks: ['meteor-city', 'troupe-origin', 'childhood', 'power-cleaners'],
    location: 'Meteor City · All-Faiths Church video room',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
  timelineEvent({
    id: '395-sheila-sarasa-join-dubbing-recording-begins',
    label: 'Sheila and Sarasa join the dubbing project as another abduction is shown elsewhere in Meteor City',
    detail: 'Pakunoda recruits Sheila and Sarasa. Sheila says The Swashbuckling Adventures of Dino Hunter is the only book she reads because she wants to become a Hunter. Chrollo rapidly finishes the scripts, assigns roles, and the four children begin recording their voice-overs at the church. In parallel, three unidentified children are shown bound and hooded in a van on the outskirts while three men depart. Chapter 395 does not identify those abducted children as any named member of Chrollo’s group.',
    people: ['Chrollo Lucilfer', 'Pakunoda', 'Sheila', 'Sarasa'],
    tracks: ['meteor-city', 'troupe-origin', 'childhood', 'power-cleaners', 'child-abductions'],
    location: 'Meteor City · All-Faiths Church / city outskirts',
    time: 'Voyage Day 10 narrative · flashback to undated pre-voyage Meteor City childhood',
  }),
]);

export const succession395LowerTierResearch = freeze({
  footage: 'Hinrigh sees two Heil-Ly members use the only hallway to enter the standard-cabin area and then, hours later, appear to enter again from another direction without a normal return path. He considers secret passages but concludes a Nen ability is providing hideout access.',
  certaintyBoundary: 'The archive records Hinrigh’s strong evidence-based teleportation/spatial-access conclusion. It does not identify the user, ability name, trigger, range, valid surfaces, directionality, or whether every Heil-Ly route shares one mechanism.',
  office: 'The military confirms the registered Heil-Ly office on Tier 3 is known, sealed after the warehouse-guard body was found, and empty of Heil-Ly personnel.',
  jointPlan: 'Ken’i says Nobunaga will investigate the probable hideout behind Room 3101 with two Troupe members, while Ken’i and Hinrigh track the pair seen in the camcorder footage and try to bring them back alive to avoid police involvement.',
  soldiers: 'Borksen says Tserriednich’s soldiers cannot directly help because Heil-Ly knows their faces. Another soldier says they can turn themselves in if the operation ends with the two targets dead.',
  troupeRisk: 'Hinrigh asks whether the Troupe was warned about the trap. Ken’i says they were asked how they would handle it and replied that it did not matter.',
  source: source395,
});

export const succession395TroupeBreachResearch = freeze({
  entry: 'Nobunaga, Phinks, and Feitan use Room 3102 beside Room 3101 as a breach point. Phinks argues that a hidden room larger than a standard cabin may connect multiple rooms and that the bathroom should be tested first because the ordinary door may not be the only trigger.',
  wallCut: 'Nobunaga cuts a rectangular opening through the bathroom wall. Feitan compels the room resident to enter first, and the Troupe trio follows into the dark hidden space.',
  recentOccupancy: 'Feitan infers recent presence from food and drinks left behind. The chapter does not identify which Heil-Ly members were there or establish the exact evacuation timing.',
  luiniAnalysis: 'Phinks questions why Heil-Ly allowed the amateur Luini to face the Troupe without warning him if the group was otherwise competent enough to detect and evade them. Nobunaga suggests Luini may have served as a scapegoat to sharpen the others.',
  originBridge: 'Nobunaga says Heil-Ly resembles the Troupe in some ways; Phinks rejects the comparison because the Troupe does not accept amateurs and does not seek world destruction. Nobunaga replies that the early Troupe also came from resignation and anger while searching for purpose. The archive treats this as their self-comparison and the narrative bridge into the flashback, not a complete founding doctrine.',
  source: source395,
});

export const succession395MeteorCityResearch = freeze({
  setting: 'The flashback is undated and occurs in the Phantom Troupe founders’ childhood in Meteor City. No exact year or age is supplied in the synopsis.',
  socialStatus: 'The narration states that Meteor City residents had no recognized social status and effectively did not officially exist, making them vulnerable to exploitation and abduction.',
  casualtyContext: 'Before the city obtained protection through a relationship with the Mafia, hundreds died each year and 70% of the casualties were children under fifteen. These are narrated historical statistics, not a date stamp for the shown childhood scenes.',
  mafiaProtection: 'The narration says Meteor City later gained protection in exchange for providing recruits to the Mafia. The chapter does not enumerate a full treaty, start date, or all parties/terms.',
  retribution: 'The narration says the city’s elders eventually developed Nen abilities and established a law of retribution in which only life can pay for life and the city accepts what is left there while rejecting the taking of its people. Complete Nen abilities and institutional mechanics are not supplied.',
  troupeFormationContext: 'The narration says the Phantom Troupe came into being as the outside world began to fear Meteor City, but Chapter 395 does not yet show the formal founding decision.',
  chrollo: 'Child Chrollo is curious, studies foreign-language tapes, speaks Gelman and Jannan, outsmarts Phinks and Feitan with a decoy cassette, and rapidly writes a dubbing script for Mighty Sweepin’ Power Cleaners.',
  pakunoda: 'Pakunoda shares the church video room with Chrollo and agrees to voice the Pink Cleaner. Her “little brother” wording is playful; Chrollo explicitly says he is older.',
  sheila: 'Sheila says The Swashbuckling Adventures of Dino Hunter is the only book she reads because she wants to become a Hunter. No later Sheila history is imported.',
  sarasa: 'Sarasa enthusiastically joins the dubbing project and chooses the energetic Orange Cleaner. Chapter 395 supplies no later outcome for her.',
  abductionBoundary: 'The chapter ends with three unidentified children shown hooded and bound in a van while Chrollo, Pakunoda, Sheila, and Sarasa begin recording. The archive does not identify the abducted children as any named character.',
  source: source395,
});

export const succession395RelationshipRecords = freeze([
  freeze({ id: 'relationship:hinrigh-keni-ch395-joint-heilly-pursuit', from: 'Hinrigh Biganduffno', to: "Ken'i Wang", type: 'alliance', chapter: 395, state: 'Hinrigh and Ken’i divide the anti-Heil-Ly operation between tracking the two people recorded by the camcorder and enabling the Troupe’s hidden-room investigation.', boundary: 'Temporary tactical cooperation is confirmed; the families remain separate organizations.', source: source395 }),
  freeze({ id: 'relationship:troupe-heilly-ch395-hideout-breach', from: 'Phantom Troupe', to: 'Heil-Ly Family', type: 'hostile', chapter: 395, state: 'Nobunaga, Phinks, and Feitan physically breach toward the probable Heil-Ly hidden room and inspect the recently occupied space.', boundary: 'Active hostility is confirmed; the chapter does not show a direct fight with a Heil-Ly member inside the room.', source: source395 }),
  freeze({ id: 'relationship:chrollo-pakunoda-ch395-childhood-friendship', from: 'Chrollo Lucilfer', to: 'Pakunoda', type: 'friendship', chapter: 395, state: 'In the childhood flashback, Pakunoda joins Chrollo in the church video room, agrees to the dubbing project, anticipates his plan to recruit Sheila and Sarasa, and shares warm teasing with him.', boundary: 'The bond is affectionate childhood friendship; “little brother” is teasing and not treated as a biological relation.', source: source395 }),
  freeze({ id: 'relationship:chrollo-sheila-sarasa-ch395-dubbing-collaboration', from: 'Chrollo Lucilfer', to: 'Sheila / Sarasa', type: 'friendship', chapter: 395, state: 'Chrollo recruits Sheila and Sarasa through Pakunoda to perform distinct voices in his dubbed Power Cleaners screening project.', boundary: 'This is a childhood creative collaboration; no later fate or formal Troupe membership is inferred for Sheila or Sarasa.', source: source395 }),
]);

export const succession395ResolvedQuestions = freeze([
  freeze({ question: 'What does Hinrigh learn from the recovered camcorder footage?', chapter: 395, resolution: 'He sees movement that cannot be explained by the only visible hallway route and concludes Heil-Ly is using a Nen ability for teleportation or spatial access to its hideout.', source: source395 }),
  freeze({ question: 'How do Nobunaga, Phinks, and Feitan enter the probable hidden room without using Room 3101’s normal doorway?', chapter: 395, resolution: 'They enter adjacent Room 3102, start from its bathroom, and Nobunaga cuts a rectangular opening through the wall into the hidden space.', source: source395 }),
  freeze({ question: 'What childhood media project brings Chrollo, Pakunoda, Sheila, and Sarasa together in Chapter 395?', chapter: 395, resolution: 'They prepare and begin recording a dubbed version of Mighty Sweepin’ Power Cleaners so their friends can understand the foreign-language show.', source: source395 }),
]);

export const succession395Mysteries = freeze([
  freeze({ question: 'Which Heil-Ly Nen user or ability produces the spatial access Hinrigh identifies in the footage?', chapter: 395, status: 'open; Nen-mediated teleportation/access is Hinrigh’s confident conclusion, but the user, ability name, and complete mechanics remain unidentified', source: source395 }),
  freeze({ question: 'Where did the Heil-Ly members who recently used the hidden room go?', chapter: 395, status: 'open; food and drinks imply recent occupancy but the chapter does not identify the evacuees or destination', source: source395 }),
  freeze({ question: 'How exactly are Room 3101, Room 3102, the hidden room, and the wider standard-cabin network connected?', chapter: 395, status: 'partially advanced; the Troupe physically breaches from Room 3102 and Hinrigh identifies spatial access, but a complete topology and Nen trigger model are not supplied', source: source395 }),
  freeze({ question: 'What exact event turns the childhood Meteor City group into the Phantom Troupe?', chapter: 395, status: 'open; the chapter begins the origin flashback and provides social context, but the formal founding decision is not yet depicted', source: source395 }),
  freeze({ question: 'Who are the three children shown bound and hooded in the van at the end of Chapter 395?', chapter: 395, status: 'open; they are not identified by name in the supplied synopsis', source: source395 }),
]);

export const succession395ChapterResearch = freeze([
  freeze({
    number: 395,
    title: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage / Phantom Troupe origin flashback',
    voyageDay: 'Voyage Day 10',
    source: source395,
    sourcePolicy: succession395SourcePolicy,
    chronology: freeze({
      voyageDay: 'The current-day opening directly continues Chapter 394 on Voyage Day 10.',
      exactClockTime: null,
      opening: 'Hinrigh continues reviewing the Biohazard camcorder footage recovered in Chapter 394.',
      flashback: 'The second half shifts to an undated pre-voyage Meteor City childhood flashback. No exact year or character ages are supplied.',
      boundary: 'Current Black Whale state and flashback story-time remain separate; flashback appearances do not alter publication-boundary life states.',
    }),
    focus: 'Hinrigh uses camcorder footage to conclude Heil-Ly is accessing its hideout through Nen-mediated teleportation, Ken’i coordinates mafia, military, and Phantom Troupe pressure around Room 3101, and Nobunaga, Phinks, and Feitan physically breach into a recently used hidden room from Room 3102. Their argument over whether Heil-Ly resembles the early Troupe opens an undated Meteor City childhood flashback centered on Chrollo, the city’s child-abduction crisis, the found Mighty Sweepin’ Power Cleaners tape, and Chrollo’s dubbing project with Pakunoda, Sheila, and Sarasa.',
    status: 'chapter-bounded research packet complete',
    lanes: freeze(['Hinrigh teleportation evidence', 'Xi-Yu / Cha-R / military coordination', 'Troupe hidden-room breach', 'Meteor City social history', 'Childhood Chrollo and founders', 'Power Cleaners dubbing project', 'Child-abduction threat']),
    events: succession395TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Hinrigh Biganduffno', "Ken'i Wang", 'Borksen', 'Gipper', 'Otocin', 'Momolly', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Luini', 'Chrollo Lucilfer', 'Franklin Bordeau', 'Shalnark', 'Uvogin', 'Machi Komacine', 'Pakunoda', 'Lisores', "Meteor City's Elder", 'Sheila', 'Sarasa']),
    locations: freeze(['Tier 3 · standard-cabin corridor', 'Tier 3 · joint lower-tier briefing', 'Tier 3 · Room 3102', 'Tier 3 · hidden room adjacent to Room 3101/3102', 'Meteor City', 'Meteor City · All-Faiths Church', 'Meteor City · All-Faiths Church video room', 'Meteor City · city outskirts']),
    threadLabels: freeze(['Mafia families', 'Heil-Ly', 'Phantom Troupe', 'Kakin military', 'Room network', 'Meteor City', 'Troupe origin']),
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 395 synopsis.',
      'No chapter title, exact clock time, flashback year, or character age is invented.',
      'Hinrigh’s teleportation conclusion is preserved without assigning the mechanism to a specific Heil-Ly ability user.',
      'The Room 3102 wall breach is physical and distinct from any still-unresolved Nen route trigger.',
      'Deceased present-day characters shown alive in childhood are not resurrected in character-state data.',
      'Meteor City casualty statistics, Mafia protection, and retribution-law history are preserved as narrated historical context rather than a precise chronology for the shown scene.',
      'The formal Phantom Troupe founding and all Chapter 396+ outcomes remain quarantined.',
      'The three abducted children at the end are left unidentified.',
    ]),
    coverage: freeze({ summary: true, chronology: true, locations: true, source: true }),
    keyResearch: freeze({ lowerTier: succession395LowerTierResearch, troupeBreach: succession395TroupeBreachResearch, meteorCity: succession395MeteorCityResearch }),
    relationships: succession395RelationshipRecords,
    resolvedQuestions: succession395ResolvedQuestions,
    mysteries: succession395Mysteries,
  }),
]);

export const succession395ChapterFocus = succession395ChapterResearch[0].focus;
