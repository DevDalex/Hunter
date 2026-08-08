const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_379';

export const succession379SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 379 synopsis and chapter notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  chronologyNote: 'The supplied Chapter 379 material does not state a new voyage-day marker. Voyage Day 4 is retained as immediate chronology continuation from Chapter 378 and is marked as inferred continuity.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale', confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 4 · chronology continuation from Chapter 378',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 379,
  confidence,
  source,
});

export const succession379TimelineEvents = freeze([
  event({ id: '379-cashew-testimony', title: 'Cashew recounts the Tier 3 massacre to Mizaistom', detail: 'The lone witness tells Mizaistom that the attacker killed her companion, forced her out of the bathroom, then vanished from the sealed bathroom after military personnel arrived.', tracks: ['mizaistom', 'cashew', 'tier-3', 'investigation', 'witness-testimony'], location: 'Black Whale · Tier 3 · investigation area', confidence: 'This is Cashew’s presented testimony; Chapter 379 later reveals that she intentionally mixes truth and lies.' }),
  event({ id: '379-mizaistom-doubts-escape', title: 'Mizaistom questions the impossible bathroom escape and the spared witness', detail: 'Mizaistom notes that the pipes are too small for human escape and questions why a killer who murdered twenty people would deliberately leave Cashew alive. He allows her to rest after she becomes emotional.', tracks: ['mizaistom', 'cashew', 'investigation', 'deduction'], location: 'Black Whale · Tier 3 · investigation area' }),
  event({ id: '379-cashew-heilly-reveal', title: 'Cashew is revealed as a Heil-Ly accomplice', detail: 'After leaving the interview, Cashew is revealed to be another Heil-Ly member working with Luini. Their plan is to sabotage the investigation by mixing lies with truthful details.', tracks: ['cashew', 'luini', 'heil-ly', 'counterintelligence'], location: 'Black Whale · Tier 3' }),
  event({ id: '379-luini-investigation-test', title: 'Luini uses Cashew’s testimony to test the investigators', detail: 'Luini instructed Cashew to keep mentioning his crescent scar and to reveal clues pointing toward his newly acquired transportation ability so he can measure how quickly the Royal Army and Hunter Association identify him.', tracks: ['luini', 'cashew', 'mizaistom', 'hunter-association', 'royal-army', 'counterintelligence'], location: 'Black Whale · Tier 3' }),
  event({ id: '379-cashew-leveling-priority', title: 'Cashew chooses to prioritize leveling and developing her own ability', detail: 'Cashew privately questions whether Luini is rushing the plan and decides to proceed more slowly, focusing on increasing her level and eventually developing an ability.', tracks: ['cashew', 'contagion', 'heil-ly', 'levels'], location: 'Black Whale · Tier 3' }),
  event({ id: '379-luini-transport-conditions', title: 'Luini’s transportation activation conditions are disclosed', detail: 'Luini’s ability requires him to be inside a sealed room with exactly one door. From that room he can travel through walls to locations he has marked and return to the sealed room while its only door remains closed.', tracks: ['luini', 'transportation', 'nen', 'spatial-nen', 'heil-ly'], location: 'Black Whale · sealed-room transport network' }),
  event({ id: '379-luini-transport-reset', title: 'Opening the sealed room’s door resets Luini’s transport setup', detail: 'If somebody opens the room’s only door, the room ceases to qualify as sealed and the active transportation setup resets.', tracks: ['luini', 'transportation', 'nen', 'condition', 'reset'], location: 'Black Whale · sealed-room transport network' }),
  event({ id: '379-luini-level24', title: 'Luini kills three more Cha-R guards and reaches level 24', detail: 'The supplied notes state that Luini kills three additional Cha-R warehouse guards, bringing him to level 24 under Contagion.', tracks: ['luini', 'cha-r', 'contagion', 'levels', 'murders'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '379-luini-marks-char-hideout', title: 'Luini uses a guard’s body to infiltrate and mark the Cha-R hideout', detail: 'Luini uses one of the dead Cha-R guards’ bodies as part of infiltrating the family hideout and marking it as a destination for his transportation ability.', tracks: ['luini', 'cha-r', 'hideout', 'transportation', 'infiltration'], location: 'Black Whale · Tier 5 · Cha-R route' }),
  event({ id: '379-luini-seeks-troupe-collaboration', title: 'Luini intends to collaborate with the Phantom Troupe', detail: 'After opening his spatial route to another destination and continuing his attacks, Luini frames the Phantom Troupe as potential collaborators for his destructive goals.', tracks: ['luini', 'phantom-troupe', 'heil-ly', 'collaboration'], location: 'Black Whale · lower tiers', confidence: 'Luini’s stated/intended collaboration objective is confirmed; no agreement from the Phantom Troupe exists at this point.' }),
  event({ id: '379-troupe-finds-warehouse-empty', title: 'The Troupe trio finds the warehouse guards missing', detail: 'Nobunaga, Phinks, and Feitan return toward the warehouse entrance and find Cha-R guards gone, with evidence of violence and a dried blood trail.', tracks: ['nobunaga', 'phinks', 'feitan', 'cha-r', 'warehouse'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '379-troupe-rejects-hisoka-theory', title: 'The Troupe rejects Hisoka as the likely warehouse attacker', detail: 'The trio considers whether Hisoka caused the warehouse violence, but Feitan rejects the idea because the damage is sloppy blade work rather than the style they associate with Hisoka’s cards.', tracks: ['nobunaga', 'phinks', 'feitan', 'hisoka', 'deduction'], location: 'Black Whale · Tier 5 · warehouse', confidence: 'This is the Troupe’s assessment, not independent proof that Hisoka could not be involved.' }),
  event({ id: '379-wang-confronts-troupe', title: 'Ken’i Wang confronts the Troupe trio over the warehouse killings', detail: 'Ken’i Wang arrives with Cha-R personnel, identifies himself as underboss, and directly asks whether Nobunaga, Phinks, and Feitan attacked the warehouse keepers.', tracks: ['ken-i-wang', 'nobunaga', 'phinks', 'feitan', 'cha-r', 'phantom-troupe'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '379-franklin-waits-hisoka', title: 'Franklin chooses to wait for Hisoka on Tier 5', detail: 'When Ittoku questions him, Franklin says he will not waste effort searching and expects Hisoka to expose himself because Hisoka intends to kill every Spider.', tracks: ['franklin', 'ittoku', 'hisoka', 'phantom-troupe', 'tier-5'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '379-franklin-troupe-priority', title: 'Franklin confirms Hisoka is the Troupe’s top priority', detail: 'Franklin tells Ittoku that the Troupe are thieves as well, but Hisoka remains their first priority and they will not initiate unnecessary fights unless others start them.', tracks: ['franklin', 'ittoku', 'phantom-troupe', 'hisoka', 'cha-r'], location: 'Black Whale · Tier 5 · central dining hall' }),
  event({ id: '379-wang-clears-troupe', title: 'Cha-R receives enough information to clear the Troupe of the warehouse attack', detail: 'After a radio update, Wang apologizes to the trio and explains that the culprit dragged bodies into the family hideout while blaming the Phantom Troupe.', tracks: ['ken-i-wang', 'cha-r', 'phantom-troupe', 'warehouse', 'investigation'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '379-phinks-spatial-analysis', title: 'Phinks identifies infiltration as the attacker’s likely goal', detail: 'Phinks argues that entering and marking the Cha-R hideout was likely the attacker’s main objective and explains the relevant requirements of spatial transportation Nen to Wang.', tracks: ['phinks', 'ken-i-wang', 'spatial-nen', 'cha-r', 'analysis'], location: 'Black Whale · Tier 5 · warehouse', confidence: 'The supplied synopsis says Phinks explains spatial-teleportation requirements but does not reproduce a complete general rule-set; the archive does not invent additional universal mechanics.' }),
  event({ id: '379-wang-private-hostility', title: 'Wang privately decides the Phantom Troupe is too dangerous to leave unchecked', detail: 'After hearing the Spiders analyze the incident, Wang privately concludes that the Phantom Troupe is dangerously capable and decides he ultimately wants them crushed.', tracks: ['ken-i-wang', 'phantom-troupe', 'cha-r', 'hostility'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '379-wang-alliance-offer', title: 'Wang proposes a tactical alliance with the Troupe', detail: 'Despite his private hostility, Wang openly proposes cooperation with Nobunaga, Phinks, and Feitan against the immediate lower-tier threat.', tracks: ['ken-i-wang', 'nobunaga', 'phinks', 'feitan', 'cha-r', 'phantom-troupe', 'alliance'], location: 'Black Whale · Tier 5 · warehouse', confidence: 'Operational cooperation is proposed; Wang’s private intention to eventually crush the Troupe remains active.' }),
]);

export const succession379CashewDeceptionResearch = freeze({
  character: 'Cashew',
  affiliation: 'Heil-Ly Family',
  publicRole: 'Lone surviving witness of the Tier 3 massacre',
  actualRole: 'Luini’s accomplice and deliberate source of mixed true/false testimony',
  method: 'Mix accurate physical details and ability hints with falsehoods so investigators must separate signal from deception.',
  luiniObjective: 'Measure the investigative speed and competence of the Royal Army and Hunter Association.',
  cashewObjective: 'Proceed more cautiously than Luini while increasing her Contagion level and developing an ability.',
  source,
});

export const succession379LuiniTransportResearch = freeze({
  user: 'Luini',
  abilityName: null,
  category: 'Spatial transportation / marked-location travel',
  activationConditions: freeze([
    'Luini must be inside a sealed room.',
    'The room must have exactly one door.',
  ]),
  capabilities: freeze([
    'Travel from the sealed room through walls to locations Luini has marked.',
    'Return to the original sealed room while its only door remains closed.',
  ]),
  resetCondition: 'If somebody opens the room’s only door, the room ceases to be sealed and the transportation setup resets.',
  chapter379Use: 'Luini uses the ability to move between attack locations and exploits a Cha-R guard’s body to infiltrate and mark the Cha-R hideout.',
  confidenceBoundary: 'The official ability name, maximum distance, number of marked destinations, marking procedure beyond the Chapter 379 infiltration example, and other limitations are not supplied.',
  source,
});

export const succession379LuiniProgressionResearch = freeze({
  priorState: 'Chapter 378 supplied a reported gain of twenty-one levels and acquisition of a transportation Nen ability.',
  chapter379Kills: freeze([{ count: 3, victims: 'Cha-R warehouse guards' }]),
  chapter379Level: 24,
  state: 'Level 24 confirmed by the supplied Chapter 379 notes.',
  source,
});

export const succession379FranklinStrategyResearch = freeze({
  character: 'Franklin Bordeau',
  location: 'Black Whale · Tier 5',
  strategy: 'Wait for Hisoka to reveal himself rather than actively search the ship.',
  rationale: 'Franklin expects Hisoka to come after the Spiders because Hisoka intends to kill them.',
  priority: 'Hisoka remains the Troupe’s top objective; ordinary theft interests are secondary.',
  escalationRule: 'Franklin says the Troupe will not start unnecessary fights unless another party initiates them.',
  source,
});

export const succession379ChaRTroupeResearch = freeze({
  parties: freeze(['Cha-R Family', 'Phantom Troupe']),
  immediateTrigger: 'Cha-R initially suspects the Troupe of attacking warehouse personnel before radio intelligence and the Troupe’s analysis redirect blame toward another attacker.',
  wangPublicPosition: 'Proposes tactical collaboration with Nobunaga, Phinks, and Feitan.',
  wangPrivatePosition: 'Considers the Phantom Troupe dangerously capable and decides he ultimately wants them crushed.',
  state: 'Tactical cooperation proposed under concealed mutual distrust.',
  source,
});

export const succession379RelationshipRecords = freeze([
  freeze({ from: 'Cashew', to: 'Luini', type: 'Heil-Ly accomplice / counterintelligence partnership', note: 'Cashew deliberately mixes truth and lies in her witness statement according to the pair’s plan, while Luini uses the testimony to test investigators.', phase: 'Lower-tier mafia conflict', chapters: '379', state: 'active covert cooperation', source }),
  freeze({ from: 'Cha-R Family', to: 'Phantom Troupe', type: 'Tactical cooperation under concealed hostility', note: 'Wang clears the Troupe of the immediate warehouse attack and proposes collaboration, while privately deciding the Troupe should ultimately be crushed.', phase: 'Lower-tier mafia conflict', chapters: '377–379', state: 'operational cooperation proposed / strategic distrust active', source }),
  freeze({ from: 'Luini', to: 'Cha-R Family', type: 'Hostile infiltration', note: 'Luini kills additional warehouse guards, uses a body to infiltrate and mark the Cha-R hideout, and exploits spatial transportation against the family.', phase: 'Lower-tier mafia conflict', chapters: '378–379', state: 'active attack and route penetration', source }),
  freeze({ from: 'Luini', to: 'Phantom Troupe', type: 'Unilateral collaboration intent', note: 'Luini wants to collaborate with the Spiders, but no reciprocal agreement from the Phantom Troupe is established in Chapter 379.', phase: 'Lower-tier mafia conflict', chapters: '379', state: 'one-sided intent only', source }),
]);

export const succession379Mysteries = freeze([
  freeze({ question: 'What is the official name and full operating envelope of Luini’s transportation ability?', evidence: 'Chapter 379 confirms sealed-room, one-door, marked-destination, return, and door-opening reset rules, but does not supply the official name, range, capacity, or complete marking procedure.', status: 'core mechanics confirmed / full mechanics open', lastChapter: '379', source }),
  freeze({ question: 'How long will the Cha-R–Phantom Troupe tactical cooperation last?', evidence: 'Wang proposes collaboration while privately resolving to crush the Troupe, making the alliance operationally useful but strategically unstable from inception.', status: 'open / tactical cooperation under concealed hostility', lastChapter: '379', source }),
  freeze({ question: 'How quickly will Mizaistom and the Hunter Association identify Cashew’s deception and Luini’s route?', evidence: 'Cashew is intentionally feeding mixed truth and lies while Luini explicitly wants to measure the investigation team’s performance.', status: 'open investigation / active disinformation', lastChapter: '379', source }),
  freeze({ question: 'Where is Hisoka aboard the Black Whale?', evidence: 'Franklin elects to wait for Hisoka on Tier 5 rather than search, while the mafia search remains active and no Chapter 379 scene identifies Hisoka’s location.', status: 'open / location still unknown', lastChapter: '379', source }),
]);

const focus = 'Cashew is exposed as Luini’s Heil-Ly accomplice and uses mixed truthful and false testimony to sabotage Mizaistom’s investigation. Luini’s spatial transportation ability receives its first hard rule-set: a sealed one-door room, marked destinations, return while the door remains shut, and reset when the door opens. Luini kills three more Cha-R guards and reaches level 24, while Franklin adopts a wait-for-Hisoka strategy. After Cha-R initially confronts the Troupe over the warehouse killings, Ken’i Wang clears them and proposes tactical cooperation even as he privately decides the Spiders must ultimately be crushed.';

export const succession379ChapterResearch = freeze([
  freeze({
    number: 379,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    titleStatus: 'not-supplied-no-title-invented',
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 4',
    voyageDayConfidence: 'inferred chronology continuation; no new day marker supplied in Chapter 379 material',
    lanes: freeze(['Cashew counterintelligence', 'Mizaistom investigation', 'Luini transportation mechanics', 'Contagion progression', 'Cha-R warehouse crisis', 'Franklin Hisoka strategy', 'Cha-R–Troupe tactical alliance']),
    focus,
    events: succession379TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Mizaistom Nana', 'Cashew', 'Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', "Ken'i Wang", 'Franklin Bordeau', 'Ittoku', 'Hisoka Morow']),
    appearances: freeze(['Mizaistom Nana', 'Cashew', 'Luini', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', "Ken'i Wang", 'Franklin Bordeau', 'Ittoku']),
    relationships: succession379RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession379Mysteries,
    abilities: freeze([succession379LuiniTransportResearch]),
    locations: freeze(['Black Whale · Tier 3 · investigation area', 'Black Whale · Tier 5 · warehouse', 'Black Whale · Tier 5 · central dining hall', 'Black Whale · Cha-R hideout route']),
    objects: freeze(['sealed one-door room', 'marked spatial destinations', 'radio']),
    organizations: freeze(['Heil-Ly Family', 'Cha-R Family', 'Phantom Troupe', 'Hunter Association', 'Royal Army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: true, mysteries: true, locations: true, organizations: true, investigations: true }),
    confidence: freeze([
      'Cashew’s Heil-Ly affiliation and deliberate mixed-truth testimony are confirmed by the supplied Chapter 379 material.',
      'Luini’s sealed-room transportation conditions, three additional Cha-R guard kills, and level 24 state are explicitly supplied.',
      'Phinks discusses spatial-teleportation requirements, but the supplied synopsis does not reproduce a universal rule-set; only Luini-specific mechanics are formalized here.',
      'Wang’s public alliance proposal and private desire to crush the Troupe coexist and must not be collapsed into genuine trust.',
      'Voyage Day 4 placement is inferred from immediate chapter continuity because no new day marker is supplied.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession379SourcePolicy,
  }),
]);

export const succession379ChapterFocus = freeze({ 379: focus });
