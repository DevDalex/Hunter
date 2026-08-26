const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_378';

export const succession378SourcePolicy = freeze({
  reviewedAt: '2026-08-09',
  soleStorySource: 'User-supplied Hunterpedia Chapter 378 synopsis and chapter notes',
  titleMetadata: 'The current user message did not supply an English, Japanese, or romanized chapter title. No title is invented here.',
  chronologyNote: 'The supplied Chapter 378 material does not state a new voyage-day marker. Voyage Day 4 placement is retained as the immediate chronology continuation from Chapter 377 and is marked as inferred continuity rather than an explicit timestamp.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const event = ({ id, title, detail, tracks, location = 'Black Whale', confidence = 'confirmed' }) => freeze({
  id,
  time: 'Voyage Day 4 · chronology continuation from Chapter 377',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 378,
  confidence,
  source,
});

export const succession378TimelineEvents = freeze([
  event({ id: '378-mafia-bosses-revealed', title: 'The three Kakin mafia bosses are identified', detail: 'Onior Longbao is identified as Xi-Yu boss, Brocco Li as Cha-R boss, and Morena Prudo as Heil-Ly boss. The supplied notes also identify Onior and Brocco as Nasubi’s half brothers and Morena as Nasubi’s illegitimate daughter.', tracks: ['mafia', 'xi-yu', 'cha-r', 'heil-ly', 'royal-family'], location: 'Black Whale · lower-tier mafia leadership' }),
  event({ id: '378-onior-brocco-balance-talk', title: 'Onior and Brocco discuss balance and the Phantom Troupe threat', detail: 'Onior emphasizes maintaining social and criminal balance while Brocco describes the Phantom Troupe as dangerous, uncontrollable outsiders. They agree the Troupe will eventually collide with Heil-Ly and that the timing of that collision should be controlled.', tracks: ['onior', 'brocco', 'phantom-troupe', 'heil-ly', 'mafia-balance'], location: 'Black Whale · Xi-Yu and Cha-R boss residences' }),
  event({ id: '378-mafia-bosses-order-hisoka-search', title: 'Xi-Yu and Cha-R order Hisoka found before the Phantom Troupe', detail: 'Onior and Brocco separately instruct their underbosses to find Hisoka before the Spiders do, treating Hisoka’s location as a lever for controlling when the Troupe and Heil-Ly collide.', tracks: ['hisoka', 'xi-yu', 'cha-r', 'phantom-troupe', 'search'], location: 'Black Whale · lower tiers' }),
  event({ id: '378-keni-wang-bounty', title: 'Ken’i Wang mobilizes Cha-R’s labor network with cash rewards', detail: 'Ken’i orders group leaders and labor contacts mobilized. The supplied notes list ten million for useful information, ten million for whoever finds Hisoka, and ten million for the leader of the area where he is found. The synopsis includes an immediate revision in Ken’i’s phrasing, so the archive preserves the chapter-note reward structure without inferring a cancellation not explicitly stated there.', tracks: ['ken-i-wang', 'cha-r', 'hisoka', 'bounty', 'labor-network'], location: 'Black Whale · Tier 5' }),
  event({ id: '378-hinrigh-manifest-search', title: 'Hinrigh begins a manifest-driven Hisoka search', detail: 'Hinrigh orders the passenger manifest checked first for single male travelers, then for larger family groups if needed, reasoning that a vigilant Hisoka would be more likely to hide where searchers expect him least.', tracks: ['hinrigh', 'xi-yu', 'hisoka', 'manifest', 'search'], location: 'Black Whale · Tier 4' }),
  event({ id: '378-hinrigh-id-verification', title: 'Hinrigh seeks a Royal Army ID-and-ticket sweep through Tang Zhao Li', detail: 'Hinrigh concludes Hisoka may be an unregistered stowaway and instructs his subordinate to use Queen Tang Zhao Li’s influence to have soldiers verify passengers’ identities and tickets.', tracks: ['hinrigh', 'tang-zhao-li', 'xi-yu', 'hisoka', 'royal-army'], location: 'Black Whale · passenger tiers' }),
  event({ id: '378-mafia-income-structure', title: 'The lower-tier mafia economy is explained', detail: 'All three families control commodities and distribute goods in their respective tiers. The supplied notes state that Heil-Ly and Xi-Yu participate in human trafficking, while Heil-Ly’s main income comes from brokering between wealthy Tier 2 clients and the black market.', tracks: ['mafia', 'xi-yu', 'cha-r', 'heil-ly', 'economy', 'black-market'], location: 'Black Whale · Tiers 2–5' }),
  event({ id: '378-morena-addresses-community', title: 'Morena addresses the twenty-two followers who chose her Heil-Ly takeover', detail: 'In Room 302, Morena thanks the twenty-two followers who stayed with her after she used the family ceremony to take over the Heil-Ly name as a junior member and reiterates her command to kill.', tracks: ['morena', 'heil-ly', 'room-302', 'community'], location: 'Black Whale · Room 302' }),
  event({ id: '378-contagion-initiation', title: 'Morena infects her followers with Contagion', detail: 'Morena kisses each of the twenty-two followers on the lips, infecting them with Contagion and forming an infected community of twenty-three people including Morena herself.', tracks: ['morena', 'contagion', 'heil-ly', 'nen'], location: 'Black Whale · Room 302' }),
  event({ id: '378-contagion-kill-values', title: 'Contagion’s kill-value progression is revealed', detail: 'The supplied notes assign one level for a civilian kill, ten levels for killing a Nen user, and fifty levels for killing a prince. Progression therefore directly rewards murder with increasing Nen potential.', tracks: ['morena', 'contagion', 'levels', 'nen', 'heil-ly'], location: 'Black Whale · Room 302' }),
  event({ id: '378-contagion-thresholds', title: 'Contagion’s level thresholds are revealed', detail: 'At level 20 an infected member gains a Nen ability. At level 100 the member becomes capable of starting a new infected community.', tracks: ['morena', 'contagion', 'levels', 'nen', 'heil-ly'], location: 'Black Whale · Room 302' }),
  event({ id: '378-illegitimate-royal-scar-rule', title: 'Kakin’s scar rule for illegitimate royal children is explained', detail: 'Illegitimate children of Kakin kings who cannot become rightful heirs are marked at birth by two facial scars made with a double blade and are permitted to exist only while remaining permanently in the shadows.', tracks: ['kakin', 'royal-family', 'morena', 'scar-system'], location: 'Kakin royal system' }),
  event({ id: '378-morena-destruction-motive', title: 'Morena frames her scar and royal status as fuel for destroying the world', detail: 'Morena reflects on the royal family’s treatment of illegitimate children, traces her scar, and describes it as something that keeps her on the razor’s edge long enough to continue trying to destroy what she calls the world’s dung heap.', tracks: ['morena', 'heil-ly', 'motivation', 'royal-family'], location: 'Black Whale · Room 302' }),
  event({ id: '378-troupe-tier4-plan', title: 'Nobunaga, Phinks, and Feitan choose Tier 4 for the next Hisoka search', detail: 'The three decide to leave the Tier 5 search to the Buor Family and move toward Tier 4, but first detour to a Tier 5 warehouse to recover smuggled weapons.', tracks: ['nobunaga', 'phinks', 'feitan', 'hisoka', 'tier-4', 'buor'], location: 'Black Whale · Tier 5' }),
  event({ id: '378-troupe-enters-warehouse', title: 'Cha-R personnel guide the Troupe trio into the weapon warehouse', detail: 'A Cha-R subordinate who had been told to expect them leads Nobunaga, Phinks, and Feitan into the warehouse where their smuggled weapons are stored.', tracks: ['nobunaga', 'phinks', 'feitan', 'cha-r', 'warehouse'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '378-guide-vanishes-from-en', title: 'The Cha-R guide abruptly disappears from the Spiders’ En', detail: 'Nobunaga stops the others after the guide turns a corner and suddenly vanishes from his En. Phinks and Feitan confirm with their own En that nothing ordinary is waiting around the corner, and the path resolves into a dead end.', tracks: ['nobunaga', 'phinks', 'feitan', 'en', 'warehouse', 'spatial-anomaly'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '378-cha-r-guide-killed', title: 'The missing Cha-R guide is found murdered', detail: 'After hearing a thud, the Spiders find the guide dead with his neck slit and multiple stab wounds. The supplied material does not name the victim.', tracks: ['nobunaga', 'phinks', 'feitan', 'cha-r', 'murder'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '378-warehouse-ceiling-opening', title: 'A hidden opening begins forming in the warehouse ceiling', detail: 'As the Spiders argue about priorities, hands appear through the ceiling and widen an opening above them, signaling an active spatial intrusion into the warehouse.', tracks: ['nobunaga', 'phinks', 'feitan', 'warehouse', 'spatial-nen'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '378-tier3-massacre-investigation', title: 'Mizaistom investigates a twenty-victim Tier 3 blade massacre', detail: 'Twenty victims were killed rapidly with a blade. A witness reports a perpetrator disguised as Royal Army personnel, in his twenties, approximately 185–190 cm tall, with a crescent scar on his left cheek. Investigators warn that parts of the shocked witness’s testimony may be unreliable.', tracks: ['mizaistom', 'tier-3', 'massacre', 'investigation', 'royal-army-disguise'], location: 'Black Whale · Tier 3 · crime scene', confidence: 'Twenty deaths are confirmed by the supplied notes; the disguise and descriptive details are witness testimony with stated uncertainty' }),
  event({ id: '378-luini-revealed', title: 'Luini is revealed as the crescent-scarred Heil-Ly attacker spying on the Spiders', detail: 'Luini, a member of Morena’s infected group, watches Nobunaga, Phinks, and Feitan through the warehouse ceiling opening. The supplied notes identify him as the killer of twenty civilians on Tier 3 and later the unnamed Cha-R warehouse guard.', tracks: ['luini', 'heil-ly', 'phantom-troupe', 'tier-3', 'tier-5', 'massacre'], location: 'Black Whale · Tier 5 · warehouse' }),
  event({ id: '378-luini-progression', title: 'Luini’s killings push him past Contagion’s ability threshold', detail: 'The supplied notes say Luini kills twenty civilians in Tier 3 and later a Cha-R guard in Tier 5, gaining twenty-one levels and a transportation Nen ability in the process. The source does not separately state his starting level, so the archive does not calculate a final current level beyond the reported gain and confirmed crossing of the level-20 ability threshold.', tracks: ['luini', 'morena', 'contagion', 'heil-ly', 'transportation', 'levels'], location: 'Black Whale · Tiers 3 and 5', confidence: 'Kill total, reported twenty-one-level gain, and acquisition of a transportation ability are supplied; the ability name and detailed mechanics are not supplied' }),
]);

export const succession378MafiaLeadershipResearch = freeze({
  bosses: freeze([
    freeze({ family: 'Xi-Yu Family', boss: 'Onior Longbao', royalRelation: 'Half brother of Nasubi Hui Guo Rou' }),
    freeze({ family: 'Cha-R Family', boss: 'Brocco Li', royalRelation: 'Half brother of Nasubi Hui Guo Rou' }),
    freeze({ family: 'Heil-Ly Family', boss: 'Morena Prudo', royalRelation: 'Illegitimate daughter of Nasubi Hui Guo Rou' }),
  ]),
  strategicBalance: 'Onior and Brocco want to prevent uncontrolled lower-tier disruption and manipulate when the Phantom Troupe encounters Heil-Ly.',
  source,
});

export const succession378HisokaSearchResearch = freeze({
  chaR: freeze({
    underboss: "Ken'i Wang",
    method: 'Mobilize group leaders and labor contacts across the lower tiers.',
    rewards: freeze({ usefulInformation: 10000000, finder: 10000000, areaLeader: 10000000 }),
    confidenceBoundary: 'The chapter notes explicitly list the useful-information, finder, and area-leader rewards. The synopsis contains an immediate revision in Ken’i’s wording, so no unstated cancellation is inferred.',
  }),
  xiYu: freeze({
    underboss: 'Hinrigh Biganduffno',
    method: 'Search the manifest beginning with single male passengers, then larger family groups, while considering the possibility that Hisoka is an unregistered stowaway.',
    escalation: 'Seek an ID-and-ticket verification sweep through Queen Tang Zhao Li’s influence over Royal Army personnel.',
  }),
  sharedObjective: 'Find Hisoka before the Phantom Troupe so the mafia can control the timing of a Troupe–Heil-Ly collision.',
  source,
});

export const succession378ContagionResearch = freeze({
  ability: 'Contagion',
  owner: 'Morena Prudo',
  initiation: 'Morena kisses each recruit on the lips to infect them.',
  communitySize: 23,
  composition: 'Morena plus twenty-two followers in the Chapter 378 initiation group.',
  progression: freeze([
    freeze({ victimClass: 'civilian', levelValue: 1 }),
    freeze({ victimClass: 'Nen user', levelValue: 10 }),
    freeze({ victimClass: 'prince', levelValue: 50 }),
  ]),
  thresholds: freeze([
    freeze({ level: 20, result: 'The infected member gains a Nen ability.' }),
    freeze({ level: 100, result: 'The infected member can start a new infected community.' }),
  ]),
  confidenceBoundary: 'These are the mechanics explicitly supplied for Chapter 378. Later Heil-Ly membership rules, later recruits, and later ability details are not imported backward.',
  source,
});

export const succession378RoyalScarResearch = freeze({
  appliesTo: 'Illegitimate children of Kakin kings who cannot become rightful heirs',
  marking: 'Two facial scars applied at birth in one stroke with a double blade.',
  socialCondition: 'They are permitted to exist in exchange for remaining permanently in the shadows.',
  chapterExample: 'Morena Prudo reflects directly on the scar and her exclusion from the legitimate royal line.',
  source,
});

export const succession378MafiaEconomyResearch = freeze({
  shared: 'All three mafia families control commodities and distribute goods within their respective tiers.',
  xiYu: freeze(['Human trafficking']),
  chaR: freeze([]),
  heilLy: freeze(['Human trafficking', 'Intermediary between wealthy Tier 2 clients and the black market']),
  heilLyPrimaryIncome: 'Intermediary role between Tier 2 wealth and the black market.',
  source,
});

export const succession378LuiniProgressionResearch = freeze({
  member: 'Luini',
  affiliation: 'Heil-Ly Family / Morena’s Contagion community',
  confirmedKills: freeze([
    freeze({ count: 20, description: 'Civilians killed rapidly with a blade in Tier 3.' }),
    freeze({ count: 1, description: 'Unnamed Cha-R guard killed in the Tier 5 warehouse.' }),
  ]),
  reportedProgression: 'The supplied notes state that these killings gain Luini twenty-one levels and a transportation Nen ability.',
  threshold: 'The level-20 ability threshold is therefore crossed.',
  abilityState: 'Transportation Nen ability acquired; official name and complete mechanics are not supplied in Chapter 378.',
  confidenceBoundary: 'Do not infer Luini’s exact final current level from a starting level that is not separately stated in the supplied text.',
  source,
});

export const succession378TroupeWarehouseResearch = freeze({
  team: freeze(['Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor']),
  nextSearchTier: 4,
  tier5SearchDelegatedTo: 'Buor Family',
  warehousePurpose: 'Recover smuggled weapons before moving to Tier 4.',
  observedAnomaly: 'Their Cha-R guide disappears from En after turning a corner; the route becomes a dead end, the guide is found murdered, and an opening is later formed in the ceiling.',
  assailantReveal: 'Luini is shown watching the Spiders through the ceiling opening.',
  source,
});

export const succession378MizaistomInvestigationResearch = freeze({
  location: 'Black Whale · Tier 3',
  victims: 20,
  method: 'Rapid blade killings',
  witnessDescription: 'Male in his twenties, approximately 185–190 cm tall, crescent scar on left cheek, reportedly disguised as Royal Army personnel.',
  witnessReliability: 'Investigators explicitly caution that parts of the witness testimony may be confused because of shock.',
  investigator: 'Mizaistom Nana',
  resolutionAtChapterBoundary: 'The chapter later shows Luini, matching the crescent-scar description, and the supplied notes identify Luini as the killer.',
  source,
});

export const succession378RelationshipRecords = freeze([
  freeze({ from: 'Onior Longbao', to: 'Nasubi Hui Guo Rou', type: 'Royal half-siblings', note: 'The supplied notes identify Onior as Nasubi’s half brother.', phase: 'Kakin royal and mafia structure', chapters: '378', state: 'confirmed lineage', source }),
  freeze({ from: 'Brocco Li', to: 'Nasubi Hui Guo Rou', type: 'Royal half-siblings', note: 'The supplied notes identify Brocco as Nasubi’s half brother.', phase: 'Kakin royal and mafia structure', chapters: '378', state: 'confirmed lineage', source }),
  freeze({ from: 'Morena Prudo', to: 'Nasubi Hui Guo Rou', type: 'Illegitimate daughter / father', note: 'The supplied notes identify Morena as Nasubi’s illegitimate daughter and connect her scars to Kakin’s treatment of illegitimate royal children.', phase: 'Kakin royal and mafia structure', chapters: '378', state: 'confirmed lineage / excluded from rightful succession', source }),
  freeze({ from: 'Xi-Yu Family', to: 'Cha-R Family', type: 'Strategic coordination', note: 'Onior and Brocco coordinate around finding Hisoka first and controlling the timing of a Phantom Troupe–Heil-Ly clash.', phase: 'Black Whale mafia conflict', chapters: '378', state: 'coordination active', source }),
  freeze({ from: 'Heil-Ly Family', to: 'Phantom Troupe', type: 'Emerging collision', note: 'Onior and Brocco expect the groups to clash even without direct intervention and seek to control when it occurs; Luini is already spying on Nobunaga, Phinks, and Feitan.', phase: 'Black Whale mafia conflict', chapters: '378', state: 'collision developing', source }),
]);

export const succession378Mysteries = freeze([
  freeze({ question: 'Where is Hisoka aboard the Black Whale?', evidence: 'Xi-Yu and Cha-R both escalate their searches using bounties, manifests, labor networks, and possible Royal Army ID checks, but Chapter 378 still does not locate him.', status: 'open / mafia search escalated', lastChapter: '378', source }),
  freeze({ question: 'What are the complete mechanics and official name of Luini’s new transportation Nen ability?', evidence: 'The supplied notes confirm that Luini gains a transportation Nen ability after progressing through Contagion, while the warehouse scene shows spatial disappearance and a ceiling opening. The supplied Chapter 378 material does not name the ability or enumerate its full rules.', status: 'core transportation function confirmed / name and mechanics open', lastChapter: '378', source }),
  freeze({ question: 'How much direct control does Morena retain over members infected by Contagion?', evidence: 'Chapter 378 shows Morena initiating a twenty-three-person community and giving the group a command to kill, but does not establish a complete coercion or obedience mechanic.', status: 'open / community hierarchy known, control mechanics unresolved', lastChapter: '378', source }),
  freeze({ question: 'How will the Phantom Troupe, Heil-Ly, Xi-Yu, and Cha-R conflict intersect?', evidence: 'Onior and Brocco explicitly expect a Troupe–Heil-Ly collision and try to control its timing, while Luini has already infiltrated the Troupe trio’s warehouse route.', status: 'developing lower-tier conflict', lastChapter: '378', source }),
]);

const focus = 'The lower-tier mafia structure becomes explicit as Xi-Yu boss Onior Longbao, Cha-R boss Brocco Li, and Heil-Ly boss Morena Prudo are identified, with Onior and Brocco coordinating to find Hisoka before the Phantom Troupe. Morena initiates a twenty-three-person Contagion community whose murder-based level system grants Nen abilities at level 20 and community replication at level 100. Luini provides the first concrete progression example by killing twenty civilians and a Cha-R guard, gaining twenty-one levels and a transportation Nen ability. Meanwhile Nobunaga, Phinks, and Feitan enter a Tier 5 warehouse before moving to Tier 4, encounter a spatial disappearance and murdered guide, and are secretly watched by Luini as Mizaistom investigates the Tier 3 massacre.';

export const succession378ChapterResearch = freeze([
  freeze({
    number: 378,
    title: null,
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 4',
    lanes: freeze(['Kakin mafia leadership', 'Hisoka search escalation', 'Contagion progression', 'illegitimate royal scars', 'mafia economy', 'Luini progression', 'Phantom Troupe Tier 4 move', 'warehouse spatial attack', 'Mizaistom massacre investigation']),
    focus,
    events: succession378TimelineEvents,
    prelude: freeze([]),
    characters: freeze(['Onior Longbao', 'Brocco Li', 'Morena Prudo', 'Nasubi Hui Guo Rou', "Ken'i Wang", 'Hinrigh Biganduffno', 'Tang Zhao Li Hui Guo Rou', 'Hisoka Morow', 'Chrollo Lucilfer', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Luini', 'Mizaistom Nana']),
    appearances: freeze(['Onior Longbao', 'Brocco Li', 'Morena Prudo', "Ken'i Wang", 'Hinrigh Biganduffno', 'Nobunaga Hazama', 'Phinks Magcub', 'Feitan Portor', 'Luini', 'Mizaistom Nana']),
    relationships: succession378RelationshipRecords,
    bodyStates: freeze([]),
    mysteries: succession378Mysteries,
    abilities: freeze([succession378ContagionResearch, succession378LuiniProgressionResearch]),
    locations: freeze(['Black Whale · Room 302', 'Black Whale · Tier 3 · crime scene', 'Black Whale · Tier 5 · warehouse', 'Black Whale · Tiers 2–5']),
    objects: freeze(['Passenger manifest', 'Smuggled weapons', 'Royal Army IDs and tickets']),
    organizations: freeze(['Xi-Yu Family', 'Cha-R Family', 'Heil-Ly Family', 'Phantom Troupe', 'Buor Family', 'Royal Army']),
    coverage: freeze({ chronology: true, appearances: true, relationships: true, abilities: true, mysteries: true, locations: true, organizations: true, economy: true }),
    confidence: freeze([
      'Mafia boss identities, their stated royal relations, the Contagion community size and progression thresholds, the twenty Tier 3 civilian deaths, the later Cha-R guard death, and Luini’s acquisition of a transportation ability are supplied Chapter 378 information.',
      'Voyage Day 4 placement is chronology continuity from Chapter 377; the supplied Chapter 378 notes do not independently state a new day marker.',
      'The supplied notes describe Luini as gaining twenty-one levels but do not separately state his starting level, so the archive does not calculate an exact final level.',
      'The official name and full mechanics of Luini’s transportation ability are not supplied and are not invented.',
      'The witness description at the Tier 3 crime scene is explicitly treated as partially uncertain because investigators say shock may have affected the testimony.',
    ]),
    essentialTakeaway: focus,
    source,
    sourcePolicy: succession378SourcePolicy,
  }),
]);

export const succession378ChapterFocus = freeze({ 378: focus });
