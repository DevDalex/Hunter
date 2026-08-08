const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_371';

export const succession371SourcePolicy = freeze({
  reviewedAt: '2026-08-08',
  soleStorySource: 'User-supplied Hunterpedia Chapter 371 synopsis and chapter-note text',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale · Tier 1 · Room 1014', confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 2 · first Nen class aftermath',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 371,
  confidence,
  source,
});

export const succession371TimelineEvents = freeze([
  event({ id: '371-loberry-detained', title: 'Loberry is detained after Barrigen’s death', detail: 'Sakata and Hashito accuse Loberry of Barrigen’s murder after her strange behavior during the Silent Majority attack, and the Royal Army arrests her as a suspect. Chapter 371 does not establish that she knowingly committed the murder.', tracks: ['loberry', 'sakata', 'hashito', 'barrigen', 'silent-majority', 'custody'] }),
  event({ id: '371-seiko-case-request', title: 'Sakata asks Cleapatro to pursue Seiko as an assassination accomplice', detail: 'Sakata contacts Supreme Magistrate Cleapatro seeking a case against Sixth Queen Seiko on suspicion that she plotted to assassinate Woble through Loberry.', tracks: ['sakata', 'cleapatro', 'seiko', 'woble', 'justice'] }),
  event({ id: '371-kaiser-72-hour-watch', title: 'Cleapatro rejects the immediate case and orders a 72-hour observation', detail: 'Cleapatro declines Sakata’s requested case and instead dispatches investigator Kaiser to observe Room 1010 and the Seiko household for the next seventy-two hours.', tracks: ['cleapatro', 'kaiser', 'seiko', 'justice', 'investigation'] }),
  event({ id: '371-kurapika-reconsiders-class', title: 'Kurapika asks the remaining participants to reconsider the Nen course', detail: 'After a student is killed inside the classroom, Kurapika gives the remaining attendees another opportunity to reconsider participation before continuing instruction.', tracks: ['kurapika', 'nen-class', 'barrigen'] }),
  event({ id: '371-babimyna-keeps-furykov-out', title: 'Babimyna tells Furykov not to interfere with his Room 1014 mission', detail: 'When Kurapika takes Oito aside, Furykov asks Babimyna whether he should follow. Babimyna dismisses the idea and tells him not to interfere with Babimyna’s assignment.', tracks: ['babimyna', 'furykov', 'kurapika', 'counterintelligence'] }),
  event({ id: '371-shimanu-bill-dowsing', title: 'Dowsing Chain clears Bill and Shimanu of being the classroom assassin', detail: 'Kurapika questions Bill and Shimanu and uses Dowsing Chain to confirm that neither is the assassin responsible for Barrigen’s murder. Shimanu also denies prior knowledge of Nen.', tracks: ['kurapika', 'bill', 'shimanu', 'dowsing-chain', 'investigation'] }),
  event({ id: '371-nen-beast-visibility-briefing', title: 'Kurapika distinguishes royal parasitic beasts from visible conjured Nen beasts', detail: 'Responding to Shimanu’s suggestion that the snakes may have been Woble’s Nen beast, Kurapika explains that the princes’ parasitic Guardian Spirit Beasts are not visible to ordinary people, whereas a Nen user’s conjured beast can be visible to both Nen users and ordinary people.', tracks: ['kurapika', 'shimanu', 'guardian-spirit-beast', 'conjuration', 'nen-mechanics'], confidence: 'Kurapika’s in-story explanation as supplied by Chapter 371' }),
  event({ id: '371-withdrawal-beast-theory', title: 'Kurapika proposes a withdrawal test for the Guardian Spirit Beast system', detail: 'Kurapika theorizes that if a prince truly withdrew from the succession battle and thereby broke a ritual condition, the other Guardian Spirit Beasts might disappear. The chapter presents this as his hypothesis, not a confirmed ceremony rule.', tracks: ['kurapika', 'guardian-spirit-beast', 'withdrawal', 'seed-urn'], confidence: 'Kurapika theory / unconfirmed ritual mechanic' }),
  event({ id: '371-no-withdrawal', title: 'No participating prince has withdrawn', detail: 'Kurapika returns to the class after checking the situation and finds that none of the princes represented in the current contest state has withdrawn.', tracks: ['kurapika', 'succession-contest', 'withdrawal'] }),
  event({ id: '371-three-training-groups', title: 'Kurapika restructures the Nen class into three groups', detail: 'Kurapika divides the remaining participants into three groups and appoints Furykov and Belerainte as assistants responsible for helping check aura flow.', tracks: ['kurapika', 'furykov', 'belerainte', 'nen-class', 'training'] }),
  event({ id: '371-oito-shimanu-trust', title: 'Oito learns why Shimanu remains loyal to royal service', detail: 'Shimanu explains that her family served Kakin’s royal house for generations and that her dying parents asked her to continue that service. Oito thanks her sincerely, and the two exchange personal details about their siblings and childhoods.', tracks: ['oito', 'shimanu', 'trust', 'household'] }),
  event({ id: '371-tier5-kickback-blockade', title: 'The Troupe encounters a Tier 5 kickback checkpoint', detail: 'Three men demand payment from passengers seeking passage toward the cafeteria. Other passengers complain that the men bribed soldiers to operate freely until Phinks, Franklin, Feitan, and Nobunaga confront them.', tracks: ['phantom-troupe', 'tier-5', 'mafia', 'kickbacks'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-troupe-defeats-informants', title: 'The Troupe easily defeats the three men and forces an explanation of Kakin’s mafia system', detail: 'The men attempt to resist the Troupe and are quickly defeated. They then explain the structure of the three Kakin mafia communities and their royal connections.', tracks: ['phantom-troupe', 'mafia', 'information'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-three-mafia-prince-links', title: 'The three prince-to-mafia sponsorship lines are identified', detail: 'The chapter identifies Zhang Lei as benefactor of Xi-Yu, Tserriednich as benefactor of Heil-Ly, and Luzurus as benefactor of Cha-R. The three families boarded to secure territory on the New Continent.', tracks: ['zhang-lei', 'tserriednich', 'luzurus', 'xi-yu', 'heil-ly', 'cha-r', 'mafia'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-xiyu-strongest-claim', title: 'The Tier 5 informants call Xi-Yu the strongest mafia family', detail: 'When Franklin asks which family is strongest, the defeated men answer Xi-Yu, the family affiliated with Zhang Lei. This ranking is stored as the informants’ statement rather than an objective power measurement.', tracks: ['franklin', 'xi-yu', 'zhang-lei', 'mafia'], location: 'Black Whale · Tier 5', confidence: 'Claim by the defeated Tier 5 informants' }),
  event({ id: '371-upper-tier-access-plan', title: 'The Troupe arranges a path toward upper-tier access', detail: 'The men refuse to place themselves directly between the mafia families, but the chapter notes establish that the Troupe plans to meet the Tier 5 kickbacks collector next Saturday in order to seek access to the upper tiers.', tracks: ['phantom-troupe', 'tier-5', 'upper-tiers', 'mafia'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-hisoka-height-search', title: 'Phinks turns the Tier 5 men into Hisoka search assets', detail: 'Phinks orders the men to search for a person taller than roughly 190 cm. The chapter notes connect that search criterion to the Troupe’s hunt for Hisoka.', tracks: ['phinks', 'hisoka', 'phantom-troupe', 'search'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-chrollo-machi-hunt', title: 'Chrollo rejects Machi’s claim to Hisoka as a personal kill', detail: 'Machi insists that she will kill Hisoka and proposes a coin flip, but Chrollo says the conflict belongs to the entire Troupe rather than two members. He is confident Hisoka is aboard the Black Whale and that the Spiders will find him.', tracks: ['chrollo', 'machi', 'hisoka', 'phantom-troupe'], location: 'Black Whale · Tier 5' }),
  event({ id: '371-momoze-capsules', title: 'Nasubi stands over Momoze’s corpse beside fourteen capsules', detail: 'Nasubi and Nugui stand in a darkened room with Momoze’s body and fourteen capsules. Nasubi says Momoze has become a foundation of the Great Kakin Tree and insists that his daughter still lives. Chapter 371 does not explain the capsules or establish literal resurrection.', tracks: ['nasubi', 'momoze', 'nugui', 'succession-ritual', 'great-kakin-tree'], location: 'Black Whale · undisclosed dark ritual room', confidence: 'Scene and Nasubi’s statements are confirmed; ritual meaning remains unresolved' }),
]);

export const succession371LegalInvestigation = freeze({
  barrigenVictim: 'Barrigen',
  detainedSuspect: 'Loberry',
  arrestingAuthority: 'Royal Army',
  accusationBasis: 'Loberry visibly reacted to and pointed at the Silent Majority marionette immediately before Barrigen’s death, causing Sakata and Hashito to suspect her.',
  guiltStatus: 'Unproven at the Chapter 371 boundary',
  queenUnderSuspicion: 'Seiko Hui Guo Rou',
  sakataRequestedAction: 'Open/retain a case against Seiko for allegedly plotting to assassinate Woble',
  magistrate: 'Cleapatro',
  magistrateDecision: 'Does not grant Sakata’s requested case at this stage',
  investigator: 'Kaiser',
  observationWindow: '72 hours',
  targetLocation: 'Room 1010 / Seiko-linked household',
  source,
});

export const succession371NenClassStructure = freeze({
  status: 'Class continues after Barrigen’s murder',
  participantChoice: 'Kurapika asks remaining attendees to reconsider whether they still wish to take the course.',
  groups: 3,
  assistants: freeze([
    freeze({ person: 'Furykov', role: 'Assistant checking aura flow; already a Nen user' }),
    freeze({ person: 'Belerainte', role: 'Assistant checking aura flow; already a Nen user' }),
  ]),
  dowsingPlan: 'Kurapika uses Dowsing Chain on Bill and Shimanu and intends to test other participants if an opportunity arises.',
  confirmedClearedByDowsing: freeze(['Bill', 'Shimanu']),
  source,
});

export const succession371GuardianBeastTheory = freeze({
  visibleBeastExplanation: 'Kurapika distinguishes the princes’ parasitic Guardian Spirit Beasts, which ordinary people cannot see, from conjured Nen beasts that can be visible to ordinary people.',
  withdrawalHypothesis: 'Kurapika theorizes that a genuine prince withdrawal might break a succession-condition requirement and cause the Guardian Spirit Beasts to disappear.',
  withdrawalStatus: 'No prince withdrawal is confirmed in Chapter 371.',
  certainty: 'Visibility explanation is Kurapika’s stated briefing; mass-disappearance-on-withdrawal is explicitly a hypothesis.',
  source,
});

export const succession371MafiaPrinceLinks = freeze([
  freeze({ prince: 'Zhang Lei Hui Guo Rou', family: 'Xi-Yu Family', relationship: 'benefactor / direct royal line', voyageGoal: 'Mafia family boarded to secure territory on the New Continent', source }),
  freeze({ prince: 'Tserriednich Hui Guo Rou', family: 'Heil-Ly Family', relationship: 'benefactor / direct royal line', voyageGoal: 'Mafia family boarded to secure territory on the New Continent', source }),
  freeze({ prince: 'Luzurus Hui Guo Rou', family: 'Cha-R Family', relationship: 'benefactor / direct royal line', voyageGoal: 'Mafia family boarded to secure territory on the New Continent', source }),
]);

export const succession371TroupeSearchResearch = freeze({
  tier: 5,
  confirmedMembersOnTier5: freeze(['Phinks Magcub', 'Franklin Bordeau', 'Feitan Portor', 'Nobunaga Hazama', 'Machi Komacine', 'Chrollo Lucilfer']),
  target: 'Hisoka Morow',
  searchCriterion: 'Person taller than roughly 190 cm',
  chrolloAssessment: 'Hisoka is on the ship and the Troupe will find him.',
  machiPosition: 'Wants to kill Hisoka personally.',
  chrolloPosition: 'The hunt belongs to the entire Troupe, so a two-member coin flip is inappropriate.',
  upperTierPlan: 'Meet the Tier 5 kickbacks collector next Saturday to seek access to the upper tiers.',
  xiYuPowerClaim: 'The defeated Tier 5 men describe Xi-Yu as the strongest of the three families; this remains their statement.',
  source,
});

export const succession371RitualCapsuleResearch = freeze({
  people: freeze(['Nasubi Hui Guo Rou', 'Nugui', 'Momoze Hui Guo Rou']),
  observedObjects: 'Fourteen capsules surrounding the scene',
  momozeState: 'Momoze is physically deceased; her corpse is present.',
  nasubiLanguage: freeze([
    'Momoze has become a foundation of the Great Kakin Tree.',
    'Nasubi insists that his daughter still lives.',
  ]),
  archiveCaution: 'Chapter 371 does not explain the capsules, what “foundation” technically means, whether the statement is symbolic/ritual/metaphysical, or whether any consciousness or life persists. Do not record literal resurrection from this scene alone.',
  source,
});

export const succession371CustodyRecords = freeze([
  freeze({ person: 'Loberry', status: 'detained / arrested as murder suspect', authority: 'Royal Army', guilt: 'unproven', chapter: 371, source }),
  freeze({ person: 'Seiko Hui Guo Rou', status: 'under judicial suspicion / 72-hour observation ordered', authority: 'Supreme Court / Cleapatro / Kaiser', guilt: 'unproven', chapter: 371, source }),
]);

export const succession371RelationshipRecords = freeze([
  freeze({ from: 'Sakata / Hashito', to: 'Loberry', type: 'Murder suspicion and detention', note: 'They accuse Loberry after Barrigen’s death and arrange her detention, but Chapter 371 does not establish knowing participation in Silent Majority.', phase: 'Active contest and voyage', chapters: '371', state: 'custody / guilt unresolved', source }),
  freeze({ from: 'Cleapatro / Kaiser', to: 'Seiko household', type: 'Judicial observation', note: 'Cleapatro rejects Sakata’s requested immediate case and sends Kaiser to observe the Seiko-linked room for seventy-two hours.', phase: 'Active contest and voyage', chapters: '371–current', state: 'active investigation', source }),
  freeze({ from: 'Kurapika', to: 'Furykov / Belerainte', type: 'Nen-class assistant assignment', note: 'Kurapika divides the class into three groups and uses the two openly experienced Nen users to help assess aura flow.', phase: 'Active contest and voyage', chapters: '371–current', state: 'active class cooperation', source }),
  freeze({ from: 'Oito Hui Guo Rou', to: 'Shimanu', type: 'Household trust', note: 'Shimanu explains her multigenerational family obligation to royal service, and Oito responds with sincere gratitude and a personal exchange about family.', phase: 'Active contest and voyage', chapters: '371–current', state: 'trust deepening', source }),
  freeze({ from: 'Zhang Lei Hui Guo Rou', to: 'Xi-Yu Family', type: 'Royal mafia benefactor link', note: 'Chapter 371 explicitly identifies Zhang Lei as Xi-Yu’s royal benefactor/direct prince connection.', phase: 'Active contest and voyage', chapters: '371–current', state: 'confirmed affiliation', source }),
  freeze({ from: 'Tserriednich Hui Guo Rou', to: 'Heil-Ly Family', type: 'Royal mafia benefactor link', note: 'Chapter 371 explicitly identifies Tserriednich as Heil-Ly’s royal benefactor/direct prince connection at this chapter boundary.', phase: 'Active contest and voyage', chapters: '371–current', state: 'confirmed affiliation at Chapter 371 boundary', source }),
  freeze({ from: 'Luzurus Hui Guo Rou', to: 'Cha-R Family', type: 'Royal mafia benefactor link', note: 'Chapter 371 explicitly identifies Luzurus as Cha-R’s royal benefactor/direct prince connection.', phase: 'Active contest and voyage', chapters: '371–current', state: 'confirmed affiliation', source }),
  freeze({ from: 'Phantom Troupe', to: 'Hisoka Morow', type: 'Collective hunt', note: 'Chrollo rejects framing Hisoka as Machi’s personal target and states that the conflict belongs to the entire Troupe.', phase: 'Active contest and voyage', chapters: '371–current', state: 'active hunt', source }),
]);

export const succession371Mysteries = freeze([
  freeze({ question: 'Is Loberry knowingly connected to the Silent Majority user, or only an unwilling possessed person and witness?', evidence: 'Loberry is arrested because her reaction immediately precedes Barrigen’s murder, but Chapter 370 established that she was the person possessed by the marionette and Chapter 371 supplies no confession or proof of willing collaboration.', status: 'open / detained suspect', lastChapter: '371', source }),
  freeze({ question: 'Is Seiko actually involved in an assassination plot against Woble?', evidence: 'Sakata suspects the Sixth Queen because Loberry belongs to the Seiko-linked camp, but Cleapatro refuses the immediate case and instead orders Kaiser to conduct seventy-two hours of observation.', status: 'open / judicial suspicion only', lastChapter: '371', source }),
  freeze({ question: 'Would a genuine prince withdrawal cause all Guardian Spirit Beasts to disappear?', evidence: 'Kurapika considers this as a possible way to test the succession ritual’s conditions, but no prince withdraws and the theory is not tested in Chapter 371.', status: 'open / Kurapika hypothesis', lastChapter: '371', source }),
  freeze({ question: 'What are the fourteen capsules surrounding Momoze, and what does Nasubi mean when he says she became a foundation of the Great Kakin Tree and still lives?', evidence: 'Momoze’s corpse is shown in a dark room beside Nasubi, Nugui, and fourteen capsules. Nasubi uses ritual language, but the chapter does not explain the mechanism or whether “lives” is literal, symbolic, metaphysical, or institutional.', status: 'open / central succession-ritual mystery', lastChapter: '371', source }),
  freeze({ question: 'Who is the Silent Majority user?', evidence: 'Loberry is detained after Barrigen’s death, but Chapter 371 does not reveal the actual user and Kurapika continues trying to screen the class with Dowsing Chain.', status: 'open / active murderer', lastChapter: '371', source }),
]);

const focus = 'After Barrigen’s murder, Loberry is detained while Cleapatro refuses an immediate case against Seiko and instead sends Kaiser for a seventy-two-hour observation; Kurapika clears Bill and Shimanu with Dowsing Chain, hypothesizes about withdrawal and Guardian Spirit Beast disappearance, and restructures the class into three groups under Furykov and Belerainte; on Tier 5 the Phantom Troupe learns the Xi-Yu/Zhang Lei, Heil-Ly/Tserriednich, and Cha-R/Luzurus sponsorship map while turning local mafia contacts into Hisoka-search assets; and Nasubi stands over Momoze’s corpse beside fourteen unexplained capsules while describing her as a foundation of the Great Kakin Tree.';

export const succession371ChapterResearch = freeze([
  freeze({
    number: 371,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 2',
    lanes: freeze(['Room 1014 murder investigation', 'Nen-class restructuring', 'Guardian Spirit Beast theory', 'Kakin judicial procedure', 'Tier 5 mafia system', 'Phantom Troupe Hisoka hunt', 'Succession ritual capsules']),
    focus,
    events: succession371TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Kurapika', 'Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Bill', 'Shimanu', 'Loberry', 'Barrigen', 'Sakata', 'Hashito', 'Cleapatro', 'Kaiser', 'Seiko Hui Guo Rou', 'Furykov', 'Babimyna', 'Belerainte', 'Zhang Lei Hui Guo Rou', 'Tserriednich Hui Guo Rou', 'Luzurus Hui Guo Rou', 'Phinks Magcub', 'Franklin Bordeau', 'Feitan Portor', 'Nobunaga Hazama', 'Machi Komacine', 'Chrollo Lucilfer', 'Hisoka Morow', 'Nasubi Hui Guo Rou', 'Nugui', 'Momoze Hui Guo Rou']),
    locations: freeze(['Black Whale · Tier 1 · Room 1014', 'Black Whale · Tier 1 · Room 1010 / Seiko-linked investigation target', 'Black Whale · Tier 5', 'Black Whale · undisclosed dark ritual room']),
    threadLabels: freeze(['Silent Majority', 'Loberry', 'Justice', 'Kaiser', 'Nen class', 'Dowsing Chain', 'Guardian Spirit Beast', 'withdrawal theory', 'Xi-Yu', 'Heil-Ly', 'Cha-R', 'Phantom Troupe', 'Hisoka', 'Momoze', 'Great Kakin Tree']),
    legalInvestigation: succession371LegalInvestigation,
    nenClassStructure: succession371NenClassStructure,
    guardianBeastTheory: succession371GuardianBeastTheory,
    mafiaPrinceLinks: succession371MafiaPrinceLinks,
    troupeSearch: succession371TroupeSearchResearch,
    ritualCapsules: succession371RitualCapsuleResearch,
    custody: succession371CustodyRecords,
    relationships: succession371RelationshipRecords,
    mysteries: succession371Mysteries,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 371 text.',
      'Loberry is recorded as detained under suspicion, not as the proven Silent Majority user or willing accomplice.',
      'Seiko is recorded as under suspicion and observation, not as guilty of an assassination plot.',
      'Kurapika’s theory that prince withdrawal could make Guardian Spirit Beasts disappear remains explicitly hypothetical.',
      'Xi-Yu being the strongest mafia family is preserved as a statement by the defeated Tier 5 informants rather than an objective ranking.',
      'Nasubi’s Great Kakin Tree language and the fourteen capsules are preserved without interpreting “still lives” as literal resurrection.',
    ]),
    status: 'Maintained chapter summary, chronology, legal investigation, Nen-class restructuring, Guardian Spirit Beast hypothesis, mafia-prince map, Troupe Hisoka hunt, ritual-capsule mystery, custody states, relationships, mysteries, and source confidence linked',
    coverage: freeze({ identity: true, publication: false, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
    lastReviewed: 'August 8, 2026',
    releaseDate: null,
    titleStatus: 'not supplied in current source text',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession371ChapterFocus = freeze({ 371: focus });
