const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_380';

export const succession380SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 380 synopsis',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  chronologyNote: 'The supplied Chapter 380 material does not state a new voyage-day marker. Voyage Day 4 is retained as immediate chronology continuation from Chapter 379 and is marked as inferred continuity.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale', confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 4 · chronology continuation from Chapter 379',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 380,
  confidence,
  source,
});

export const succession380TimelineEvents = freeze([
  event({ id: '380-mizaistom-desire-theory', title: 'Mizaistom rejects stress as the lower-tier murderer’s motive', detail: 'At a meeting with Kakin military officials, Mizaistom argues that the killer is acting from desire rather than ordinary voyage stress and treats the murders as a deliberate escalating threat.', tracks: ['mizaistom', 'kakin-military', 'investigation', 'lower-tiers'], location: 'Black Whale · Kakin military meeting' }),
  event({ id: '380-mizaistom-succession-link', title: 'Mizaistom links the murders to the Succession Contest', detail: 'Mizaistom tells the military that he believes the killings are connected to the Succession Contest, prompting skepticism from officials who cannot see why princes would target unrelated civilians.', tracks: ['mizaistom', 'succession-contest', 'kakin-military', 'analysis'], location: 'Black Whale · Kakin military meeting', confidence: 'This is Mizaistom’s working analysis, not a confirmed causal finding.' }),
  event({ id: '380-human-sacrifice-hypothesis', title: 'Mizaistom presents a human-sacrifice interpretation of unexplained powers', detail: 'Mizaistom argues that actors ignorant of aura and Nen could interpret newly manifested powers as having been granted through human sacrifice and therefore continue killing in the belief that murder preserves or increases those powers.', tracks: ['mizaistom', 'nen', 'succession-contest', 'theory'], location: 'Black Whale · Kakin military meeting', confidence: 'This is Mizaistom’s explanatory hypothesis to the military. It is not archived as a universal rule of the Succession Contest or Nen.' }),
  event({ id: '380-black-whale-chaos-warning', title: 'Mizaistom warns that continuing murders could destabilize the entire ship', detail: 'He warns that unchecked lower-tier killings could produce cascading disorder severe enough to threaten the Black Whale itself.', tracks: ['mizaistom', 'black-whale', 'security', 'risk'], location: 'Black Whale · Kakin military meeting' }),
  event({ id: '380-security-redistribution-proposal', title: 'Mizaistom urges more soldiers on Tier 3 and below', detail: 'Mizaistom identifies the relatively weak security allocation among the lower classes as a structural vulnerability and proposes redistributing military personnel toward Tier 3 and the decks below it.', tracks: ['mizaistom', 'kakin-military', 'security', 'tier-3', 'tier-4', 'tier-5'], location: 'Black Whale · Kakin military meeting' }),
  event({ id: '380-order-fragility-discussion', title: 'Mizaistom and Botobai discuss how fragile shipboard order has become', detail: 'After the meeting, Mizaistom and Botobai discuss the increasingly unstable balance required to preserve peace and order aboard the Black Whale.', tracks: ['mizaistom', 'botobai', 'security', 'hunter-association'], location: 'Black Whale' }),
  event({ id: '380-wang-takes-troupe-to-base', title: 'Wang brings Nobunaga, Phinks, and Feitan into the Cha-R base', detail: 'Ken’i Wang takes the three Spiders to the Cha-R Family base and shows them footage of the man who entered the warehouse, while noting that there is no surveillance footage from inside the warehouse itself.', tracks: ['ken-i-wang', 'nobunaga', 'phinks', 'feitan', 'cha-r', 'phantom-troupe'], location: 'Black Whale · Cha-R Family base' }),
  event({ id: '380-char-troupe-deal', title: 'The Chapter 379 alliance proposal becomes an operational deal', detail: 'Wang grants the Troupe trio access through the adjacent door in exchange for their service hunting the killer of Cha-R members.', tracks: ['ken-i-wang', 'nobunaga', 'phinks', 'feitan', 'cha-r', 'phantom-troupe', 'deal'], location: 'Black Whale · Cha-R Family base' }),
  event({ id: '380-tsudonke-pairing', title: 'Tsudonke’s squad is paired with the Troupe trio', detail: 'Inside the Cha-R-controlled area, Wang introduces Tsudonke and his squad and pairs them with Nobunaga, Phinks, and Feitan for the hunt.', tracks: ['tsudonke', 'nobunaga', 'phinks', 'feitan', 'cha-r', 'phantom-troupe'], location: 'Black Whale · Cha-R Family base' }),
  event({ id: '380-lower-tier-curfew', title: 'A martially enforced curfew is imposed on Tier 3 and below', detail: 'In response to the string of murders, the military imposes a curfew covering Tier 3 and the lower passenger tiers.', tracks: ['kakin-military', 'curfew', 'tier-3', 'tier-4', 'tier-5', 'security'], location: 'Black Whale · Tier 3 and below' }),
  event({ id: '380-mizuri-finds-zoldycks', title: 'Corporal Mizuri finds Illumi and Kalluto on Tier 3', detail: 'Mizuri and accompanying soldiers encounter Illumi and Kalluto during the curfew. Illumi presents his ID ticket, causing Mizuri to question why a VVIP is in the lower tiers and offer an escort back.', tracks: ['mizuri', 'illumi', 'kalluto', 'kakin-military', 'tier-3'], location: 'Black Whale · Tier 3' }),
  event({ id: '380-zoldyck-hunter-status', title: 'Mizaistom and Botobai confirm Illumi’s Hunter status', detail: 'After Illumi continues refusing the offered escort, Mizaistom and Botobai arrive and explain to the soldiers that Illumi is a Hunter, resolving the immediate military challenge to his presence.', tracks: ['mizaistom', 'botobai', 'illumi', 'hunter-association', 'kakin-military'], location: 'Black Whale · Tier 3' }),
  event({ id: '380-all-spiders-aboard', title: 'Illumi confirms that every Phantom Troupe member is aboard the Black Whale', detail: 'When Mizaistom asks whether the Phantom Troupe is on board, Illumi confirms that every member is aboard the ship. He gives no further explanation after Kalluto objects to the disclosure.', tracks: ['mizaistom', 'illumi', 'kalluto', 'phantom-troupe', 'hunter-association'], location: 'Black Whale · Tier 3' }),
  event({ id: '380-mizaistom-kurapika-concern', title: 'Mizaistom worries about the Troupe’s connection to Kurapika', detail: 'Mizaistom becomes anxious over the confirmed presence of the entire Phantom Troupe, especially because of their relationship with Kurapika, and debates whether informing an already highly stressed Kurapika would make matters worse.', tracks: ['mizaistom', 'kurapika', 'phantom-troupe', 'information-control'], location: 'Black Whale · Tier 3', confidence: 'Mizaistom’s internal concern is confirmed; Chapter 380 does not establish that he informs Kurapika.' }),
  event({ id: '380-zoldyck-supervision', title: 'Mizaistom assigns Ginta and Botobai responsibility for the Zoldycks', detail: 'Mizaistom offers Illumi and Kalluto a place to stay and later tells Ginta and Botobai that they are in charge of the two Zoldycks.', tracks: ['mizaistom', 'ginta', 'botobai', 'illumi', 'kalluto', 'hunter-association'], location: 'Black Whale · Tier 3' }),
  event({ id: '380-unidentified-person-report', title: 'Mizaistom receives a report about a person without an ID', detail: 'An assistant reports that someone without an ID has been found and that several soldiers recognize her.', tracks: ['mizaistom', 'kakin-military', 'custody', 'identity'], location: 'Black Whale · military custody area' }),
  event({ id: '380-gag-order-custody', title: 'Mizaistom orders a gag order and controlled custody', detail: 'Mizaistom instructs that the soldiers who recognized the unidentified person be placed under a gag order and that the person be kept in custody while he handles the situation discreetly.', tracks: ['mizaistom', 'kakin-military', 'custody', 'secrecy'], location: 'Black Whale · military custody area' }),
  event({ id: '380-fugetsu-reveal', title: 'The unidentified person is revealed to be Prince Fugetsu', detail: 'Mizaistom enters the interrogation room, reassures the detainee, and asks for help explaining what happened. The person in the dark jacket is revealed to be Fugetsu Hui Guo Rou.', tracks: ['mizaistom', 'fugetsu', 'succession-contest', 'custody', 'mystery'], location: 'Black Whale · interrogation room', confidence: 'Fugetsu’s identity and custody are confirmed. The supplied Chapter 380 synopsis does not explain how she reached this location or why she lacks an ID.' }),
]);

export const succession380SecurityEscalationResearch = freeze({
  analyst: 'Mizaistom Nana',
  audience: 'Kakin military officials',
  workingAssessment: 'The lower-tier murders are deliberate, linked in some way to the Succession Contest, and capable of triggering cascading shipwide disorder if allowed to continue.',
  humanSacrificeHypothesis: 'Mizaistom argues that Nen-ignorant actors could misread unexplained powers as rewards from human sacrifice and keep killing to preserve or strengthen them.',
  structuralWeakness: 'Lower-class passenger tiers have disproportionately light security relative to the risk Mizaistom sees emerging there.',
  proposedResponse: 'Redistribute soldiers so Tier 3 and the decks below it receive more security coverage.',
  implementedResponse: 'A martially enforced curfew is imposed on Tier 3 and below during the chapter.',
  confidenceBoundary: 'The linkage, motive model, and human-sacrifice interpretation are Mizaistom’s analysis. The curfew itself is an implemented security measure.',
  source,
});

export const succession380ChaRTroupeDealResearch = freeze({
  parties: freeze(['Cha-R Family', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor']),
  broker: "Ken'i Wang",
  evidenceShown: 'Surveillance footage of the man entering the warehouse; no footage exists from inside the warehouse in the supplied synopsis.',
  exchange: 'Cha-R grants access through the adjacent door in exchange for the Troupe trio helping hunt the killer of Cha-R members.',
  attachedChaRUnit: 'Tsudonke and his squad',
  state: 'Operational tactical cooperation accepted and activated in Chapter 380.',
  trustBoundary: 'Chapter 379 established Wang’s concealed long-term hostility toward the Troupe; Chapter 380 operationalizes cooperation but does not erase that distrust.',
  source,
});

export const succession380TroupePresenceDisclosureResearch = freeze({
  discloser: 'Illumi Zoldyck',
  recipient: 'Mizaistom Nana',
  claim: 'Every Phantom Troupe member is aboard the Black Whale.',
  limitation: 'Illumi refuses to explain further after Kalluto objects to the disclosure.',
  mizaistomConcern: 'Mizaistom immediately worries about the Troupe’s relationship with Kurapika and whether informing Kurapika would worsen his already high stress.',
  kurapikaKnowledgeState: 'Chapter 380 does not establish that Mizaistom tells Kurapika.',
  source,
});

export const succession380FugetsuCustodyResearch = freeze({
  character: 'Fugetsu Hui Guo Rou',
  discoveryState: 'Found without an ID during the lower-tier security operation; several soldiers recognize her.',
  containment: 'Mizaistom orders a gag order and custody before personally interviewing her.',
  reveal: 'The unidentified detainee is revealed to be Prince Fugetsu.',
  unresolved: freeze(['How Fugetsu reached the lower tiers', 'Why she is without an ID', 'What happened immediately before military personnel found her']),
  confidenceBoundary: 'Only her presence, identity, lack of ID, recognition by soldiers, gag-order handling, and custody are established by the supplied Chapter 380 synopsis.',
  source,
});

export const succession380RelationshipRecords = freeze([
  freeze({ from: 'Cha-R Family', to: 'Phantom Troupe', type: 'Operational tactical cooperation under concealed distrust', note: 'Wang’s Chapter 379 proposal becomes a concrete exchange: adjacent-door access for Nobunaga, Phinks, and Feitan in return for helping hunt the killer of Cha-R personnel. Wang’s previously established private hostility is not treated as resolved.', phase: 'Lower-tier mafia conflict', chapters: '380', state: 'deal active / strategic distrust persists', source }),
  freeze({ from: 'Mizaistom Nana', to: 'Illumi Zoldyck', type: 'Security inquiry / information exchange', note: 'Mizaistom validates Illumi’s Hunter status, asks whether the Phantom Troupe is aboard, and receives confirmation that every member is on the ship.', phase: 'Lower-tier security escalation', chapters: '380', state: 'limited information exchange / further explanation refused', source }),
  freeze({ from: 'Mizaistom Nana', to: 'Fugetsu Hui Guo Rou', type: 'Protective custody / confidential interrogation', note: 'Mizaistom suppresses wider disclosure of Fugetsu’s discovery, keeps her in custody, reassures her, and asks her to explain what happened.', phase: 'Lower-tier security escalation', chapters: '380', state: 'confidential custody and inquiry active', source }),
]);

export const succession380Mysteries = freeze([
  freeze({ question: 'How did Fugetsu reach the lower tiers without an ID?', evidence: 'Fugetsu is found during the curfew, several soldiers recognize her, Mizaistom imposes a gag order, and Chapter 380 ends with her identity reveal without explaining the route or cause.', status: 'open / immediate Chapter 380 cliffhanger', lastChapter: '380', source }),
  freeze({ question: 'Will Mizaistom tell Kurapika that every Phantom Troupe member is aboard?', evidence: 'Illumi confirms the full Troupe presence, but Mizaistom worries that the information could worsen Kurapika’s already severe stress.', status: 'open / disclosure decision unresolved', lastChapter: '380', source }),
  freeze({ question: 'How long will the now-operational Cha-R–Phantom Troupe deal survive?', evidence: 'Chapter 380 activates the exchange of access for hunting assistance, while Chapter 379 established Wang’s private intention to eventually crush the Troupe.', status: 'open / cooperation active under concealed hostility', lastChapter: '380', source }),
  freeze({ question: 'What exact connection exists between the lower-tier murder campaign and the Succession Contest?', evidence: 'Mizaistom argues to the military that the murders are linked to the contest and offers a Nen-ignorance/human-sacrifice model, but the supplied synopsis presents this as his analysis rather than a confirmed causal chain.', status: 'open / Mizaistom working theory', lastChapter: '380', source }),
]);

const focus = 'Mizaistom treats the lower-tier murders as an escalating systemic threat, links them in his working analysis to the Succession Contest, and pushes the military toward stronger lower-tier security, culminating in a curfew on Tier 3 and below. Cha-R converts its proposed cooperation with Nobunaga, Phinks, and Feitan into an active deal and pairs them with Tsudonke’s squad. During the curfew, Illumi confirms to Mizaistom that every Phantom Troupe member is aboard, creating a new Kurapika information dilemma. The chapter ends with a second security shock: an unidentified detainee without an ID is revealed to be Prince Fugetsu, with the route that brought her there left unexplained.';

export const succession380ChapterResearch = freeze([
  freeze({
    number: 380,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 4',
    voyageDayConfidence: 'inferred chronology continuation; no new day marker supplied in Chapter 380 material',
    lanes: freeze(['Mizaistom security analysis', 'Kakin military redistribution', 'lower-tier curfew', 'Cha-R–Troupe operational deal', 'Tsudonke pairing', 'Illumi and Kalluto', 'full Troupe presence disclosure', 'Kurapika information dilemma', 'Fugetsu custody mystery']),
    focus,
    events: succession380TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Mizaistom Nana', 'Botobai Gigante', "Ken'i Wang", 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Tsudonke', 'Mizuri', 'Illumi Zoldyck', 'Kalluto Zoldyck', 'Ginta', 'Kurapika', 'Fugetsu Hui Guo Rou']),
    appearances: freeze(['Mizaistom Nana', 'Botobai Gigante', "Ken'i Wang", 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Tsudonke', 'Mizuri', 'Illumi Zoldyck', 'Kalluto Zoldyck', 'Ginta', 'Fugetsu Hui Guo Rou']),
    relationships: succession380RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession380Mysteries,
    abilities: freeze([]),
    locations: freeze(['Black Whale · Kakin military meeting', 'Black Whale · Cha-R Family base', 'Black Whale · Tier 3 and below', 'Black Whale · Tier 3', 'Black Whale · military custody area', 'Black Whale · interrogation room']),
    objects: freeze(['warehouse surveillance footage', 'Illumi’s ID ticket']),
    organizations: freeze(['Kakin military', 'Hunter Association', 'Cha-R Family', 'Phantom Troupe']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: false, mysteries: true, locations: true, organizations: true, investigations: true, security: true, custody: true }),
    confidence: freeze([
      'Mizaistom’s Succession Contest linkage and human-sacrifice explanation are retained as his working analysis, not converted into omniscient narrator fact.',
      'The martially enforced curfew on Tier 3 and below is an implemented Chapter 380 security measure.',
      'Cha-R’s access-for-hunting exchange with Nobunaga, Phinks, and Feitan is operational in Chapter 380; it does not erase Wang’s Chapter 379 concealed hostility.',
      'Illumi explicitly confirms that every Phantom Troupe member is aboard, but gives no further explanation in the supplied synopsis.',
      'Fugetsu’s lower-tier presence and custody are confirmed, while how she arrived and why she lacks an ID remain unresolved.',
      'Voyage Day 4 placement is inferred from immediate chapter continuity because no new day marker is supplied.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession380SourcePolicy,
  }),
]);

export const succession380ChapterFocus = freeze({ 380: focus });
