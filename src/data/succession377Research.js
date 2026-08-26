const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_377';

export const succession377SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 377 synopsis and chapter notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale', confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 4',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 377,
  confidence,
  source,
});

export const succession377TimelineEvents = freeze([
  event({ id: '377-kacho-banquet-show-proposal', title: 'Kacho proposes a music performance for the next Sunday banquet', detail: 'Kacho tells Seiko that she and Fugetsu can perform glass harp while Melody plays flute. Seiko agrees and offers to raise the proposal with Nasubi, but Kacho tells her that will not be necessary.', tracks: ['kacho', 'fugetsu', 'melody', 'seiko', 'banquet', 'escape-plan'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '377-kacho-resolve-cover', title: 'Kacho tells Seiko she has resolved to fight in the Succession Contest', detail: 'Kacho reassures Seiko by presenting herself as prepared to fight, then harshly dismisses her mother after they separate. The supplied material does not establish whether every part of Kacho’s stated attitude toward Seiko is sincere or operational cover.', tracks: ['kacho', 'seiko', 'succession-contest', 'deception'], location: 'Black Whale · Tier 1 · Room 1010', confidence: 'Kacho’s statements are confirmed; their complete sincerity remains uncertain' }),
  event({ id: '377-kacho-melody-show-plan', title: 'Kacho and Melody refine the banquet performance into an escape opportunity', detail: 'Using Mosquitone communication while Kacho gives ordinary orders aloud, they plan to place performers in a passageway and broadcast the performance through speakers across Tier 1. Kacho also intends to meet Fugetsu.', tracks: ['kacho', 'melody', 'mosquitone', 'banquet', 'escape-plan'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '377-melody-kacho-sacrifice-reading', title: 'Melody interprets Kacho’s hostile guard persona as a self-sacrificial survival strategy', detail: 'Melody reasons that Kacho deliberately makes her guards dislike her so that, if forced to choose between Kacho and Fugetsu, they will save Fugetsu. Melody resolves that both sisters will survive instead.', tracks: ['kacho', 'melody', 'fugetsu', 'bodyguards', 'sacrifice'], location: 'Black Whale · Tier 1 · Room 1010', confidence: 'Melody’s interpretation and vow; Kacho’s private motive is not directly confirmed in the supplied text' }),
  event({ id: '377-keeney-fugetsu-inference', title: 'Keeney identifies the prior nighttime intrusion as most likely Fugetsu', detail: 'Keeney tells Melody that while using En he sensed someone appear from Kacho’s bed the previous night but could not identify the person directly. Kacho’s calm reaction leads him to infer that it was probably Fugetsu using a transportation ability.', tracks: ['keeney', 'melody', 'kacho', 'fugetsu', 'en', 'transportation'], location: 'Black Whale · Tier 1 · Room 1010', confidence: 'Keeney and Melody inference; Fugetsu attribution is highly plausible but not directly observed by Keeney' }),
  event({ id: '377-kacho-beast-still-unknown', title: 'Kacho’s Guardian Spirit Beast remains completely unobserved by her protectors', detail: 'Melody and Keeney still have no information about Kacho’s Guardian Spirit Beast and cannot tell whether it is suited to direct battle or another function.', tracks: ['kacho', 'melody', 'keeney', 'guardian-spirit-beast', 'mystery'], location: 'Black Whale · Tier 1 · Room 1010' }),
  event({ id: '377-troupe-gathers-tier5', title: 'The Phantom Troupe gathers in Tier 5’s central dining hall', detail: 'The Troupe regroups after searching Tier 5 for Hisoka. The search for a person over 190 cm tall produces no result, and Hisoka’s location aboard the ship remains unknown.', tracks: ['phantom-troupe', 'hisoka', 'tier-5', 'search'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '377-mafia-tier-control-map', title: 'The lower passenger tiers are mapped to the three Kakin mafia families', detail: 'The supplied chapter notes state that Heil-Ly controls Tier 3, Xi-Yu controls Tier 4, and Cha-R controls Tier 5. Movement among the lower tiers can use official Royal Army channels or unofficial mafia channels.', tracks: ['heil-ly', 'xi-yu', 'cha-r', 'tiers', 'mafia', 'movement'], location: 'Black Whale · Tiers 3–5' }),
  event({ id: '377-passenger-list-access', title: 'Kakin mafia access to passenger-list information is revealed', detail: 'The Troupe learns that the mafia has privileged access to the Black Whale passenger list. The chapter also notes that unregistered passengers exist, meaning the list cannot guarantee that every person aboard is documented.', tracks: ['phantom-troupe', 'mafia', 'passenger-list', 'unregistered-passengers'], location: 'Black Whale · lower tiers' }),
  event({ id: '377-illumi-introduction', title: 'Illumi introduces himself as the newest Spider and Hisoka’s contracted killer', detail: 'Illumi identifies himself as the oldest Zoldyck son and Kalluto’s and Killua’s older brother. He says Hisoka requested that he join the Troupe and contracted Illumi to kill him, with payment contingent on fulfilling the contract.', tracks: ['illumi', 'hisoka', 'phantom-troupe', 'zoldyck', 'contract'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '377-illumi-replaces-uvogin', title: 'Illumi is identified as the Troupe member who replaced Uvogin', detail: 'The supplied notes identify Illumi as the newest Phantom Troupe member and state that he occupies the membership position left by Uvogin.', tracks: ['illumi', 'uvogin', 'phantom-troupe', 'membership'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '377-cha-r-confrontation', title: 'Cha-R personnel confront the Troupe in the central dining hall', detail: 'A Cha-R group orders the Troupe to move. Their leader recognizes the Phantom Troupe, invokes the Yorknew massacre’s effect on organized crime, and attempts to persuade them to conduct their business elsewhere without bloodshed.', tracks: ['phantom-troupe', 'cha-r', 'chrollo', 'mafia'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '377-cha-r-offers-recruitment', title: 'Cha-R offers the Troupe membership and information routes; Chrollo refuses', detail: 'The Cha-R executive suggests using the Royal Army passenger list and explains that leaving Tier 5 requires access tickets or mafia support. He offers to bring the Troupe into Cha-R, but Chrollo declines and instead asks about reaching Tier 1.', tracks: ['chrollo', 'cha-r', 'phantom-troupe', 'tier-access', 'recruitment'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '377-cha-r-decides-to-block-troupe', title: 'Cha-R decides the Troupe is too dangerous to control', detail: 'After the Troupe leaves, Sun-bin describes them as untamable and worries that their unconcealed Nen and determination will eventually carry them to Tier 1. The Cha-R executive decides to obstruct them and notify underboss Ken’i Wang.', tracks: ['cha-r', 'sun-bin', 'ken-i-wang', 'phantom-troupe', 'tier-1'], location: 'Black Whale · Tier 5' }),
  event({ id: '377-chrollo-prioritizes-hisoka', title: 'Chrollo rejects a treasure diversion and orders the Troupe to prioritize Hisoka', detail: 'Phinks suspects the Cha-R reaction to Tier 1 means valuable treasure may be hidden there, but Chrollo refuses to divert the group. He orders the Spiders to act freely while making Hisoka’s death the priority and tells them to bring him Hisoka’s head before regrouping.', tracks: ['chrollo', 'phinks', 'hisoka', 'phantom-troupe', 'hunt'], location: 'Black Whale · Tier 5' }),
  event({ id: '377-shizuku-bonolenov-team-chrollo', title: 'Shizuku and Bonolenov choose to search with Chrollo', detail: 'Shizuku and Bonolenov ask to accompany Chrollo. He agrees on the condition that he gets to kill Hisoka himself. Shizuku accepts, saying she and Bonolenov are poorly matched against Bungee Gum.', tracks: ['chrollo', 'shizuku', 'bonolenov', 'hisoka', 'bungee-gum'], location: 'Black Whale · Tier 5' }),
  event({ id: '377-metamorphorsen-reveal', title: 'Bonolenov reveals Battle Cantabile: Metamorphorsen', detail: 'Bonolenov explains that he can transform into various forms using Battle Cantabile: Metamorphorsen. He has not decided how best to employ the transformation for the Hisoka search and asks Chrollo to direct its use.', tracks: ['bonolenov', 'chrollo', 'metamorphorsen', 'nen', 'disguise'], location: 'Black Whale · Tier 5' }),
  event({ id: '377-lovely-ghostwriter-vanished', title: 'Lovely Ghostwriter is revealed to have disappeared from Skill Hunter', detail: 'Shizuku asks Chrollo to tell fortunes again. Chrollo says the fortune-telling ability has vanished from his book. Shizuku forms her own explanation, while the supplied chapter notes state that the disappearance heavily implies Neon Nostrade’s death.', tracks: ['chrollo', 'shizuku', 'neon-nostrade', 'lovely-ghostwriter', 'skill-hunter'], location: 'Black Whale · Tier 5', confidence: 'Ability disappearance confirmed; Neon’s death is heavily implied rather than directly confirmed in Chapter 377' }),
]);

export const succession377KachoEscapeResearch = freeze({
  plannedWindow: 'Next Sunday banquet music show',
  performers: freeze(['Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody']),
  presentation: 'Kacho and Fugetsu on glass harp with Melody on flute; speakers intended to carry the performance across Tier 1.',
  covertPurpose: 'Create an operational opportunity for Kacho and Fugetsu to escape.',
  communication: 'Kacho and Melody continue coordinating through Mosquitone Morse code.',
  melodyInterpretation: 'Melody believes Kacho cultivates hostility from her guards so they would prioritize Fugetsu if forced to choose.',
  confidenceBoundary: 'The escape plan and communication are confirmed. Melody’s reading of Kacho’s deeper motive is an interpretation.',
  source,
});

export const succession377KachoBeastResearch = freeze({
  observedByProtectors: false,
  knownMechanics: 'None established for Melody or Keeney at this chapter boundary.',
  openQuestion: 'Whether Kacho’s Guardian Spirit Beast is battle-oriented or serves another function remains unknown.',
  source,
});

export const succession377MafiaTierResearch = freeze({
  tierControl: freeze([
    freeze({ tier: 3, family: 'Heil-Ly Family' }),
    freeze({ tier: 4, family: 'Xi-Yu Family' }),
    freeze({ tier: 5, family: 'Cha-R Family' }),
  ]),
  movement: 'Movement between the lower passenger tiers requires official Royal Army means or unofficial mafia channels.',
  passengerList: 'The mafia has special access to passenger-list information, but unregistered passengers are also aboard.',
  source,
});

export const succession377IllumiContractResearch = freeze({
  member: 'Illumi Zoldyck',
  troupeStatus: 'Newest Phantom Troupe member; supplied notes state he replaced Uvogin.',
  requestedBy: 'Hisoka Morow',
  contract: 'According to Illumi, Hisoka hired him to kill Hisoka, with reward tied to successful completion.',
  confidenceBoundary: 'This is Illumi’s stated account in Chapter 377.',
  source,
});

export const succession377TroupeSearchResearch = freeze({
  hisokaTier5Result: 'No one matching the over-190-cm search target is found in Tier 5; Hisoka’s location remains unknown.',
  command: 'Chrollo prioritizes killing Hisoka over pursuing possible Tier 1 treasure and gives the members freedom in how they conduct the hunt.',
  team: freeze(['Chrollo Lucilfer', 'Shizuku Murasaki', 'Bonolenov Ndongo']),
  teamCondition: 'Chrollo gets to kill Hisoka if their team encounters him.',
  chaRState: 'Cha-R judges the Troupe uncontrollable, plans to obstruct them, and sends word to Ken’i Wang.',
  source,
});

export const succession377MetamorphorsenResearch = freeze({
  ability: 'Battle Cantabile: Metamorphorsen',
  owner: 'Bonolenov Ndongo',
  demonstratedFunction: 'Allows Bonolenov to transform into various things/forms.',
  intendedUse: 'Disguise and search support during the hunt for Hisoka.',
  unresolved: freeze(['complete transformation range', 'duration', 'activation details', 'costs', 'whether copied properties extend beyond appearance/form']),
  source,
});

export const succession377LovelyGhostwriterResearch = freeze({
  ability: 'Lovely Ghostwriter',
  originalOwner: 'Neon Nostrade',
  chapter377State: 'Chrollo states that the ability has vanished from Skill Hunter.',
  implication: 'The supplied notes describe this as heavily implying Neon’s death.',
  confidenceBoundary: 'Do not promote Neon to confirmed deceased from Chapter 377 alone; no direct death scene or formal death statement is supplied.',
  source,
});

export const succession377RelationshipRecords = freeze([
  freeze({ from: 'Kacho Hui Guo Rou', to: 'Melody', type: 'Covert escape-planning partnership', note: 'Kacho and Melody use Mosquitone Morse communication to build a banquet performance into an escape opportunity for Kacho and Fugetsu.', phase: 'Active contest and voyage', chapters: '376–377', state: 'escape plan developing', source }),
  freeze({ from: 'Kacho Hui Guo Rou', to: 'Fugetsu Hui Guo Rou', type: 'Twin-prince survival alliance', note: 'Kacho’s planned banquet performance explicitly centers on creating a path for the sisters to escape together.', phase: 'Active contest and voyage', chapters: '377', state: 'escape objective active', source }),
  freeze({ from: 'Illumi Zoldyck', to: 'Hisoka Morow', type: 'Paid assassination contract', note: 'Illumi states that Hisoka requested his Troupe membership and contracted Illumi to kill him.', phase: 'Black Whale Hisoka hunt', chapters: '377', state: 'contract active', source }),
  freeze({ from: 'Phantom Troupe', to: 'Cha-R Family', type: 'Mutual obstruction / unstable contact', note: 'Chrollo refuses Cha-R recruitment; Cha-R decides the Troupe cannot be controlled and prepares to obstruct its movement toward upper tiers.', phase: 'Black Whale mafia conflict', chapters: '377', state: 'tension escalating', source }),
]);

export const succession377Mysteries = freeze([
  freeze({ question: 'What ability does Kacho’s Guardian Spirit Beast possess?', evidence: 'Melody and Keeney still have no information about the beast and cannot determine whether it is battle-oriented.', status: 'open / beast still unobserved', lastChapter: '377', source }),
  freeze({ question: 'Where is Hisoka aboard the Black Whale?', evidence: 'The Phantom Troupe’s Tier 5 search for a person over 190 cm produces no result, and unregistered passengers mean the official list is not exhaustive.', status: 'open / Tier 5 search unsuccessful', lastChapter: '377', source }),
  freeze({ question: 'What are the complete mechanics of Battle Cantabile: Metamorphorsen?', evidence: 'Bonolenov says it allows him to transform into various things, but Chapter 377 does not establish its complete limits or operating conditions.', status: 'open mechanics / core transformation function confirmed', lastChapter: '377', source }),
  freeze({ question: 'Why did Lovely Ghostwriter disappear from Skill Hunter?', evidence: 'Chrollo confirms the ability vanished from his book. The supplied notes heavily imply Neon Nostrade’s death but do not directly confirm it.', status: 'open cause / Neon death strongly implied', lastChapter: '377', source }),
]);

const focus = 'Kacho and Melody convert the next Sunday banquet music show into an escape operation for Kacho and Fugetsu while Keeney independently links Fugetsu’s transportation power to the prior bedroom intrusion. On Tier 5, the Phantom Troupe regroups after failing to locate Hisoka, learns the lower-tier mafia control map, hears Illumi explain his Hisoka assassination contract, clashes with Cha-R, and disperses under Chrollo’s order to prioritize Hisoka. Bonolenov reveals Battle Cantabile: Metamorphorsen, while Lovely Ghostwriter’s disappearance from Skill Hunter strongly implies but does not directly confirm Neon Nostrade’s death.';

export const succession377ChapterResearch = freeze([
  freeze({
    number: 377,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 4',
    lanes: freeze(['Kacho–Fugetsu escape plan', 'Mosquitone coordination', 'Kacho Guardian Spirit Beast mystery', 'Phantom Troupe Hisoka hunt', 'mafia tier control', 'Illumi contract', 'Metamorphorsen', 'Lovely Ghostwriter disappearance']),
    focus,
    events: succession377TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Kacho Hui Guo Rou', 'Fugetsu Hui Guo Rou', 'Melody', 'Seiko Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Keeney', 'Chrollo Lucilfer', 'Illumi Zoldyck', 'Kalluto Zoldyck', 'Killua Zoldyck', 'Hisoka Morow', 'Phinks Magcub', 'Shizuku Murasaki', 'Bonolenov Ndongo', 'Sun-bin', "Ken'i Wang", 'Neon Nostrade']),
    appearances: freeze(['Kacho Hui Guo Rou', 'Melody', 'Seiko Hui Guo Rou', 'Keeney', 'Chrollo Lucilfer', 'Illumi Zoldyck', 'Kalluto Zoldyck', 'Phinks Magcub', 'Shizuku Murasaki', 'Bonolenov Ndongo', 'Sun-bin']),
    relationships: succession377RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession377Mysteries,
    abilities: freeze([succession377MetamorphorsenResearch, succession377LovelyGhostwriterResearch]),
    locations: freeze(['Black Whale · Tier 1 · Room 1010', 'Black Whale · Tier 5 · central dining hall', 'Black Whale · Tiers 3–5']),
    objects: freeze(['Mosquitone', 'Royal Army passenger list', 'Skill Hunter']),
    organizations: freeze(['Phantom Troupe', 'Cha-R Family', 'Xi-Yu Family', 'Heil-Ly Family', 'Royal Army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: true, mysteries: true, locations: true, organizations: true, communications: true }),
    confidence: freeze([
      'Kacho and Melody’s escape-show planning, the mafia tier-control map, Illumi’s stated contract, Metamorphorsen’s transformation function, and Lovely Ghostwriter’s disappearance are confirmed Chapter 377 information.',
      'Melody’s interpretation of Kacho’s hostile guard persona remains Melody’s reading of Kacho’s motive.',
      'Keeney and Melody infer that the prior bedroom visitor was Fugetsu; Keeney did not directly identify her through En.',
      'Lovely Ghostwriter’s disappearance strongly implies Neon’s death but does not directly confirm it at this chapter boundary.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession377SourcePolicy,
  }),
]);

export const succession377ChapterFocus = freeze({ 377: focus });
