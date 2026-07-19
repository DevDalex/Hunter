const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

const node = (name, role, source = '') => ({ name, role, source });

export const systemsDeskSources = {
  groups: wiki('Category:Group'),
  organisations: wiki('Category:Organisation'),
  events: wiki('Category:Events'),
  items: wiki('Category:Rare_Items'),
};

export const institutionCharts = [
  {
    id: 'hunter-association', name: 'Hunter Association', era: 'series-wide', scope: 'Professional authority',
    summary: 'The Association links licensing, examinations, specialist Hunters, political negotiation, crisis response, and the Dark Continent expedition.',
    source: wiki('Hunter_Association'), status: 'Active under Cheadle Yorkshire',
    root: node('Hunter Association', 'Licensing and professional authority', wiki('Hunter_Association')),
    levels: [
      { label: 'Executive authority', nodes: [node('Chairman', 'Institutional head'), node('Vice Chairman', 'Second executive office')] },
      { label: 'Senior council', nodes: [node('Zodiacs', 'Twelve selected senior Hunters', wiki('Zodiacs'))] },
      { label: 'Operational systems', nodes: [node('Hunter Exam', 'Testing and licensing', wiki('Hunter_Exam')), node('Exam Commission', 'Examiners and annual administration'), node('Specialist Hunters', 'Professional fields and missions'), node('Temp Hunters', 'Contract and political voting bloc')] },
    ],
  },
  {
    id: 'dark-continent-framework', name: 'Dark Continent framework', era: 'succession', scope: 'International expedition authority',
    summary: 'No single faction owns the expedition. International approval, Kakin’s public voyage, Association expertise, Beyond’s team, and the Guide requirement overlap.',
    source: wiki('Dark_Continent_Expedition_arc'), status: 'Expedition preparations ongoing',
    root: node('V6 framework', 'International political authority', wiki('V5')),
    levels: [
      { label: 'Public and regulatory layer', nodes: [node('Kakin Empire', 'Public expedition sponsor', wiki('Kakin_Empire')), node('International Permit Agency', 'Permit and risk administration', wiki('International_Permit_Agency'))] },
      { label: 'Expedition bodies', nodes: [node('Hunter Association', 'Operational escort and expertise', wiki('Hunter_Association')), node('Beyond’s team', 'Specialist expedition faction', wiki('Beyond_Netero'))] },
      { label: 'Required passage', nodes: [node('Gatekeepers', 'Access beyond the known world', wiki('Gatekeeper')), node('Guides', 'Required guide relationship', wiki('Guide')), node('New Continent', 'Public transfer destination', wiki('New_Continent'))] },
    ],
  },
  {
    id: 'kakin-state', name: 'Kakin state', era: 'succession', scope: 'Monarchy, law, military and underworld',
    summary: 'The royal contest sits inside an ordinary state. Nasubi’s ritual authority, the royal family, military command, courts, Justice Bureau, and sponsored mafia families do not share identical rules.',
    source: wiki('Kakin_Empire'), status: 'Active during the Black Whale voyage',
    root: node('King Nasubi', 'King of Kakin and ritual center', wiki('Nasubi_Hui_Guo_Rou')),
    levels: [
      { label: 'Royal system', nodes: [node('Eight Queens', 'Maternal households', wiki('Kakin_Royal_Family')), node('Fourteen Princes', 'Eligible succession participants', wiki('Succession_Contest'))] },
      { label: 'State authority', nodes: [node('Kakin Royal Army', 'Military command and ship security', wiki('Kakin_Military')), node('Justice Bureau', 'Investigation and custody', wiki('Succession_Contest_arc')), node('Supreme Court', 'Judicial authority', wiki('Succession_Contest_arc'))] },
      { label: 'Sponsored underworld', nodes: [node('Xi-Yu Family', 'Zhang Lei-sponsored family', wiki('Xi-Yu_Family')), node('Cha-R Family', 'Luzurus-sponsored family', wiki('Cha-R_Family')), node('Heil-Ly Family', 'Formerly Tserriednich-sponsored', wiki('Heil-Ly_Family'))] },
    ],
  },
  {
    id: 'mafia-community', name: 'Mafia Community', era: 'underworld', scope: 'Changing criminal order',
    summary: 'The Yorknew Ten Dons structure and Kakin’s three-family balance belong to different moments in the underworld’s history. The Troupe’s auction massacre helps remap that power.',
    source: wiki('Mafia_Community'), status: 'Fragmented; Kakin families remain active',
    root: node('Mafia Community', 'International criminal network', wiki('Mafia_Community')),
    levels: [
      { label: 'Yorknew-era summit', nodes: [node('Ten Dons', 'Regional leaders; deceased', wiki('Ten_Dons')), node('Shadow Beasts', 'Ten Dons’ elite combat unit', wiki('Shadow_Beasts')), node('Nostrade Family', 'Prediction-backed family', wiki('Nostrade_Family'))] },
      { label: 'Kakin three-family balance', nodes: [node('Xi-Yu', 'Tier 4 influence', wiki('Xi-Yu_Family')), node('Cha-R', 'Tier 5 influence', wiki('Cha-R_Family')), node('Heil-Ly', 'Contagion-driven insurgency', wiki('Heil-Ly_Family'))] },
      { label: 'External disruptors', nodes: [node('Phantom Troupe', 'Yorknew destroyer; current tactical actor', wiki('Phantom_Troupe')), node('Hisoka', 'Target of overlapping searches', wiki('Hisoka_Morow'))] },
    ],
  },
  {
    id: 'phantom-troupe', name: 'Phantom Troupe', era: 'underworld', scope: 'The Spider and its members',
    summary: 'The Troupe treats the Spider as an organism: Chrollo leads, numbered members fill functional roles, replacements are possible, and the collective is meant to survive individual losses.',
    source: wiki('Phantom_Troupe'), status: 'Aboard the Black Whale; hunting Hisoka',
    root: node('The Spider', 'Collective identity', wiki('Phantom_Troupe')),
    levels: [
      { label: 'Head', nodes: [node('Chrollo Lucilfer', 'Leader and strategist', wiki('Chrollo_Lucilfer'))] },
      { label: 'Operational functions', nodes: [node('Combat members', 'Front-line force'), node('Reconnaissance', 'Tracking and intelligence'), node('Support abilities', 'Transport, memory and logistics'), node('Replacements', 'Seats can be refilled')] },
      { label: 'Current pressures', nodes: [node('Hisoka hunt', 'Retaliation after Heavens Arena'), node('Heil-Ly conflict', 'Lower-tier route war'), node('Kakin treasure', 'Chrollo’s present objective'), node('Member losses', 'Collective survival under strain')] },
    ],
  },
  {
    id: 'zoldyck-household', name: 'Zoldyck household', era: 'family', scope: 'Assassin family and estate',
    summary: 'Family authority, succession expectations, assassination work, servants, and the confinement of Alluka/Nanika make the household both a family tree and an operating institution.',
    source: wiki('Zoldyck_Family'), status: 'Active; members pursue separate agendas',
    root: node('Zoldyck Family', 'Assassin household', wiki('Zoldyck_Family')),
    levels: [
      { label: 'Senior generations', nodes: [node('Maha / Zigg line', 'Older family history'), node('Zeno', 'Senior assassin', wiki('Zeno_Zoldyck'))] },
      { label: 'Current household', nodes: [node('Silva and Kikyo', 'Parents and household authority'), node('Illumi', 'Control and assassination'), node('Milluki', 'Technical support'), node('Killua', 'Designated heir in conflict'), node('Alluka / Nanika', 'Confined exceptional state'), node('Kalluto', 'Family member and Troupe member')] },
      { label: 'Estate staff', nodes: [node('Gotoh', 'Senior butler'), node('Tsubone and Amane', 'Senior pursuit detail'), node('Canary', 'Apprentice butler'), node('Testing Gate staff', 'Estate security')] },
    ],
  },
  {
    id: 'chimera-ant-colony', name: 'Chimera Ant colony', era: 'chimera-ant', scope: 'Biological and military hierarchy',
    summary: 'The colony begins as a reproductive hierarchy, then fractures as human memories and individual goals compete with loyalty to the Queen and King.',
    source: wiki('Chimera_Ants'), status: 'Central colony ended; survivors dispersed',
    root: node('Chimera Ant Queen', 'Reproductive founder', wiki('Chimera_Ant_Queen')),
    levels: [
      { label: 'Royal succession', nodes: [node('Meruem', 'King', wiki('Meruem'))] },
      { label: 'Royal Guard', nodes: [node('Neferpitou', 'Guard and medical specialist'), node('Shaiapouf', 'Guard and ideological loyalist'), node('Menthuthuyoupi', 'Guard and combat force')] },
      { label: 'Colony ranks', nodes: [node('Squadron Leaders', 'Command units'), node('Officers', 'Subordinate command'), node('Soldiers', 'Colony labor and combat'), node('Human collaborators', 'Gyro network and selected humans')] },
    ],
  },
  {
    id: 'greed-island-administration', name: 'Greed Island administration', era: 'greed-island', scope: 'Nen game governance',
    summary: 'Greed Island is a real place governed through Nen rules. Creators, resident Game Masters, transport systems, card restrictions, players, and outside sponsors form separate layers.',
    source: wiki('Greed_Island'), status: 'Game completed by Gon; infrastructure persists',
    root: node('Greed Island creators', 'Eleven-name creator group', wiki('Game_Masters')),
    levels: [
      { label: 'Administration', nodes: [node('Ging Freecss', 'Lead creator'), node('Game Masters', 'Resident administrators', wiki('Game_Masters')), node('Razor', 'Emitter and transport enforcement', wiki('Razor'))] },
      { label: 'Rule system', nodes: [node('Book and Ring', 'Card storage and commands'), node('Specified slots', 'Completion structure'), node('Spell cards', 'Movement and interaction'), node('Game Master events', 'Rule-bound challenges')] },
      { label: 'Participants', nodes: [node('Battera', 'Outside sponsor'), node('Contract players', 'Paid completion teams'), node('Bombers', 'Coercive player faction'), node('Gon’s team', 'Successful completion group')] },
    ],
  },
];

export const relationTypes = [
  ['authority', 'Authority / command'],
  ['membership', 'Membership / origin'],
  ['contract', 'Contract / employment'],
  ['alliance', 'Alliance / cooperation'],
  ['opposition', 'Opposition / target'],
  ['sponsorship', 'Sponsorship / patronage'],
  ['custody', 'Custody / jurisdiction'],
  ['dependence', 'Dependence / required link'],
];

const relation = (id, from, to, type, era, chapters, note, slug, state = 'established') => ({
  id, from, to, type, era, chapters, note, state, source: wiki(slug),
});

export const institutionalRelationships = [
  relation('association-exam', 'Hunter Association', 'Hunter Exam', 'authority', 'hunter-exam', 'Exam arcs', 'The Association appoints examiners and licenses applicants who pass the changing annual examination.', 'Hunter_Exam'),
  relation('netero-zodiacs', 'Isaac Netero', 'Zodiacs', 'authority', 'election', 'Before Chapter 319', 'Netero personally selected the twelve themed senior Hunters who later inherit institutional responsibility.', 'Zodiacs'),
  relation('cheadle-association', 'Cheadle Yorkshire', 'Hunter Association', 'authority', 'election', 'Chapters 319–339', 'Cheadle becomes chair after Pariston wins the election and immediately resigns.', '13th_Hunter_Chairman_Election_arc'),
  relation('pariston-zodiacs', 'Pariston Hill', 'Zodiacs', 'opposition', 'election', 'Chapters 319–339', 'Pariston turns procedure, turnout, Temp Hunters, and uncertainty into pressure on the council.', '13th_Hunter_Chairman_Election_arc'),
  relation('v6-association', 'V6', 'Hunter Association', 'contract', 'succession', 'Chapters 340–346', 'The international framework requires the Association to supervise Beyond and supply expedition expertise.', 'Dark_Continent_Expedition_arc'),
  relation('v6-kakin', 'V6', 'Kakin Empire', 'alliance', 'succession', 'Chapters 340–346', 'Kakin enters a revised six-state framework after forcing the expedition issue into public view.', 'V5'),
  relation('beyond-team', 'Beyond Netero', 'Beyond expedition team', 'authority', 'succession', 'Chapters 340–current', 'Beyond recruits specialists for a true Dark Continent expedition even while his own movement is restricted.', 'Beyond_Netero'),
  relation('association-beyond', 'Hunter Association', 'Beyond Netero', 'custody', 'succession', 'Chapters 341–current', 'The Zodiacs detain and escort Beyond under international conditions rather than treating him as an ordinary passenger.', 'Beyond_Netero'),
  relation('guide-expedition', 'Dark Continent expedition', 'Guide', 'dependence', 'succession', 'Expedition requirement', 'A sanctioned journey requires passage through the Gatekeepers and cooperation with a Guide.', 'Guide'),
  relation('zoldyck-killua', 'Zoldyck Family', 'Killua Zoldyck', 'authority', 'family', 'Chapters 39–43; 321–336', 'The household treats Killua as an heir and asset, while his central development repeatedly resists that control.', 'Zoldyck_Family'),
  relation('dons-zoldycks', 'Ten Dons', 'Zeno and Silva', 'contract', 'yorknew', 'Yorknew climax', 'The Ten Dons hire the Zoldycks to kill Chrollo; the contract ends when Illumi kills the clients.', 'Chrollo_Lucilfer_vs._Zeno_and_Silva_Zoldyck'),
  relation('nostrade-kurapika', 'Nostrade Family', 'Kurapika', 'contract', 'yorknew', 'Chapters 70–119', 'Bodyguard employment gives Kurapika lawful access to the auction and the Mafia Community.', 'Nostrade_Family'),
  relation('troupe-mafia', 'Phantom Troupe', 'Mafia Community', 'opposition', 'yorknew', 'Chapters 71–119', 'The Troupe attacks the auction and destroys the Ten Dons-era balance of power.', 'Yorknew_City_arc'),
  relation('meteor-troupe', 'Meteor City', 'Phantom Troupe', 'membership', 'underworld', 'Troupe origin and later operations', 'The original Troupe members grow up in Meteor City and later defend it from Chimera Ants.', 'Phantom_Troupe'),
  relation('kurapika-troupe', 'Kurapika', 'Phantom Troupe', 'opposition', 'yorknew', 'Yorknew onward', 'Kurapika’s recovery and revenge objectives make the Spider both a personal and systemic target.', 'Kurapika'),
  relation('battera-players', 'Battera', 'Greed Island contract players', 'contract', 'greed-island', 'Chapters 120–185', 'Battera finances teams to clear the game in exchange for the completion reward.', 'Battera'),
  relation('creators-game-masters', 'Greed Island creators', 'Game Masters', 'authority', 'greed-island', 'Game administration', 'Resident Game Masters enforce separate parts of the island’s Nen rule system.', 'Game_Masters'),
  relation('association-extermination', 'Hunter Association', 'Chimera Ant Extermination Team', 'authority', 'chimera-ant', 'Chapters 186–318', 'Netero assembles a small specialist operation under political and time pressure.', 'Chimera_Ant_Extermination_Team'),
  relation('queen-meruem', 'Chimera Ant Queen', 'Meruem', 'membership', 'chimera-ant', 'Colony succession', 'The Queen’s reproductive objective culminates in the premature birth of the King.', 'Meruem'),
  relation('meruem-guards', 'Meruem', 'Royal Guards', 'authority', 'chimera-ant', 'Chapters 213–318', 'The Guards organize their identities around protecting and interpreting the King’s will.', 'Royal_Guards'),
  relation('nasubi-contest', 'King Nasubi', 'Succession Contest', 'authority', 'succession', 'Chapters 349–current', 'Nasubi establishes the voyage as the venue and treats the ritual as a system the princes cannot simply exit.', 'Succession_Contest'),
  relation('benjamin-army', 'Benjamin', 'Kakin Royal Army', 'authority', 'succession', 'Chapters 359–current', 'Benjamin’s military position gives his camp trained soldiers, surveillance reach, and martial-law leverage.', 'Benjamin_Hui_Guo_Rou'),
  relation('justice-princes', 'Justice Bureau', 'Royal households', 'custody', 'succession', 'Chapters 383–current', 'Justice officials investigate deaths and escapes, but royal immunity and military power constrain ordinary procedure.', 'Succession_Contest_arc'),
  relation('zhang-xiyu', 'Zhang Lei', 'Xi-Yu Family', 'sponsorship', 'succession', 'Black Whale voyage', 'The Xi-Yu family has a direct patronage line to the Third Prince.', 'Xi-Yu_Family'),
  relation('luzurus-char', 'Luzurus', 'Cha-R Family', 'sponsorship', 'succession', 'Black Whale voyage', 'The Cha-R family operates under the patronage of the Seventh Prince.', 'Cha-R_Family'),
  relation('tserriednich-heily', 'Tserriednich', 'Heil-Ly Family', 'sponsorship', 'succession', 'Before and during voyage', 'Tserriednich was Heil-Ly’s benefactor before cutting ties with Morena’s faction.', 'Heil-Ly_Family', 'severed'),
  relation('xiyu-char', 'Xi-Yu Family', 'Cha-R Family', 'alliance', 'succession', 'Chapters 378–current', 'The rival families maintain a conditional balance while treating Heil-Ly as the destabilizing enemy.', 'Mafia_Community', 'conditional'),
  relation('mafia-heily', 'Xi-Yu and Cha-R', 'Heil-Ly Family', 'opposition', 'succession', 'Chapters 378–current', 'Both established families seek to contain Morena’s leveling war and protect their routes.', 'Mafia_Community', 'active'),
  relation('char-troupe', 'Cha-R Family', 'Phantom Troupe', 'alliance', 'succession', 'Chapters 379–406', 'Cha-R grants controlled movement and information while using the Troupe against Heil-Ly.', 'Cha-R_Family', 'tactical'),
  relation('troupe-heily', 'Phantom Troupe', 'Heil-Ly Family', 'opposition', 'succession', 'Chapters 393–current', 'Nobunaga’s killing of Luini turns rejection into an active plan to destroy Heil-Ly.', 'Chapter_393', 'active'),
  relation('kurapika-class', 'Kurapika', 'Nen class attendees', 'authority', 'succession', 'Chapters 369–current', 'Instruction redistributes Nen knowledge and creates temporary political interdependence among prince camps.', 'Succession_Contest'),
  relation('justice-fugetsu', 'Justice Bureau', 'Fugetsu and Kacho', 'custody', 'succession', 'Chapters 383–current', 'The failed escape places the twins’ case, Melody, and associated evidence inside Justice supervision.', 'Succession_Contest_arc'),
  relation('camilla-havenots', 'Camilla', 'Have-Nots', 'authority', 'succession', 'Chapters 389–current', 'Camilla’s curse soldiers prepare death-powered attacks against designated princes.', 'Camilla_Hui_Guo_Rou'),
];

const trail = (id, name, kind, summary, status, slug, stages) => ({
  id, name, kind, summary, status, source: wiki(slug), stages,
});

export const objectTrails = [
  trail('hunter-license', 'Hunter License', 'Credential', 'A license changes access, information privileges, legal treatment, and financial options; it is both proof of status and a plot instrument.', 'Licenses remain active unless revoked or lost', 'Hunter_License', [
    ['Hunter Association', 'Issues the credential after the Exam'], ['Successful applicants', 'Receive individual licenses'], ['Information and access', 'Unlock restricted services and the Hunter website'], ['Collateral and resale value', 'Can be pawned or monetized without transferring Hunter status'],
  ]),
  trail('scarlet-eyes', 'Scarlet Eyes', 'Human remains / collection', 'The eyes move from a living cultural identity into an illegal collectors’ market and then into Kurapika’s recovery mission.', 'Recovery incomplete; Tserriednich retains a major collection', 'Scarlet_Eyes', [
    ['Kurta Clan', 'Living hereditary trait'], ['Massacre and theft', 'Eyes are removed and sold'], ['Collectors and body-part market', 'Specimens circulate as rare objects'], ['Kurapika', 'Recovers stolen remains through negotiation and force'], ['Tserriednich collection', 'Remaining central objective aboard the Black Whale'],
  ]),
  trail('kurapika-chains', 'Kurapika’s chains', 'Conjured weapon system', 'A single hand carries five separate functions whose use is shaped by training, vows, Emperor Time, and target restrictions.', 'Active; Emperor Time carries a severe lifespan cost', 'Kurapika', [
    ['Izunavi’s training', 'Vows and limitations shape the system'], ['Yorknew', 'Chain Jail and Judgment Chain control Troupe conflicts'], ['Nostrade leadership', 'Dowsing and healing support professional work'], ['Room 1014', 'Steal Chain and Stealth Dolphin become political tools'],
  ]),
  trail('greed-island', 'Greed Island game', 'Nen game system', 'The game passes through creators, consoles and rings, outside sponsors, contracted players, and a completion process that can move selected cards outside.', 'Completed by Gon; game infrastructure persists', 'Greed_Island', [
    ['Ging and ten collaborators', 'Create the island and rules'], ['JoyStation / ring', 'Provide the player interface'], ['Battera', 'Acquires copies and hires completion teams'], ['Players and Game Masters', 'Operate inside the rule system'], ['Gon’s team', 'Completes the specified slots'], ['Three-card exit', 'Chosen rewards can leave the island under special rules'],
  ]),
  trail('poor-mans-rose', 'Poor Man’s Rose', 'Mass-produced weapon', 'The Rose turns Netero’s duel into a state-backed assassination whose poison extends beyond the initial explosion.', 'Detonated; poison kills Meruem, Pouf and Youpi', 'Poor_Man%27s_Rose', [
    ['State arsenals', 'Cheap weapon with a history of mass casualties'], ['Isaac Netero', 'Carries an implanted final measure'], ['Underground test site', 'Detonates after Netero stops his own heart'], ['Meruem', 'Survives the blast after rescue'], ['Contagious poison', 'Kills the King and two Royal Guards'],
  ]),
  trail('seed-urn', 'Seed Urn', 'Royal ritual object', 'The urn ties blood eligibility, a founding king’s Nen, ritual vows, and fourteen parasitic Guardian Spirit Beasts into the succession system.', 'Active ritual; full mechanism unresolved', 'Guardian_Spirit_Beast', [
    ['First King of Kakin', 'Creates the urn through Nen and royal ambition'], ['Eligible prince', 'Offers blood and places a hand inside'], ['Egg implantation', 'Receives a parasitic beast egg'], ['Guardian Spirit Beast', 'Develops around the host’s disposition'], ['Succession ritual', 'Beasts operate within restrictions the princes do not fully know'],
  ]),
  trail('burial-chamber', 'Fourteen-casket burial chamber', 'Ritual apparatus', 'The chamber visually joins thirteen surrounding caskets, a central position, tubing, and royal funeral procedure without revealing the complete mechanism.', 'Purpose partially unknown', 'Black_Whale#Princes%27_Burial_Chamber', [
    ['Black Whale hidden chamber', 'Constructed as part of the voyage ritual'], ['Deceased princes', 'Bodies are processed through royal funerals'], ['Fourteen positions', 'Thirteen perimeter caskets surround a central apparatus'], ['Succession outcome', 'Exact relation to the sole-survivor requirement remains unresolved'],
  ]),
  trail('zhang-coins', 'Zhang Lei’s coins', 'Guardian Beast product', 'The Third Prince’s beast produces coins whose value changes over time and whose eventual ability conditions remain under study.', 'Active; delayed function unresolved', 'Zhang_Lei_Hui_Guo_Rou', [
    ['Guardian Spirit Beast', 'Produces one coin per day'], ['Zhang Lei', 'Studies accumulation and political meaning'], ['Recipients', 'Coins are distributed to selected personnel'], ['Value growth', 'Numbers increase while held'], ['Future activation', 'Ability and conditions remain unknown'],
  ]),
  trail('bandits-secret', 'Bandit’s Secret', 'Nen ability book', 'Chrollo’s book records stolen abilities, but their continued use depends on rules, original owners, page access, and later the Double Face bookmark.', 'Active; Chrollo seeks a further ability aboard ship', 'Skill_Hunter', [
    ['Original ability owner', 'Ability is observed and stolen under conditions'], ['Bandit’s Secret', 'Ability is stored on a page'], ['Chrollo', 'Opens the required page to use it'], ['Double Face', 'Bookmark permits a second active configuration'], ['Heavens Arena / Black Whale', 'Prepared stacks and a new theft objective expand the system'],
  ]),
  trail('magical-worm', 'Magical Worm doors', 'Travel ability', 'Fugetsu’s paired doors create a repeatable outbound and return route, then become central to the failed escape and her worsening condition.', 'Active under strain; complete limits developing', 'Magical_Worm', [
    ['Fugetsu', 'Conjures the departure door'], ['Kacho', 'Shares the intended route and escape plan'], ['Tier 1 movement', 'Doors bypass ordinary corridors'], ['Lifeboat attempt', 'The route tests the contest boundary'], ['Justice custody', 'Later use is monitored as Fugetsu’s state worsens'],
  ]),
  trail('kacho-letters', 'Kacho’s letters', 'Messages / political evidence', 'Prepared messages let Kacho’s plans continue across royal households after the escape attempt changes her status.', 'In circulation through Justice-supervised channels', 'Kacho_Hui_Guo_Rou', [
    ['Kacho', 'Prepares messages for other princes'], ['Melody and Kaiser', 'Coordinate controlled delivery'], ['Royal households', 'Receive warnings, requests and political information'], ['Contest response', 'Letters reshape alliances without revealing the full exceptional state'],
  ]),
  trail('tsk17', 'TSK-17', 'Biological assassination agent', 'A military medical plan becomes a possession operation when Halkenburg turns Balsamilco’s attempted poisoning against Benjamin’s camp.', 'Deployed within the ongoing funeral operation', 'Chapter_403', [
    ['Balsamilco', 'Carries the agent as an assassination plan'], ['Tier 2 courthouse', 'Attempts to approach Halkenburg'], ['Halkenburg’s arrow', 'Transfers consciousness into Balsamilco’s body'], ['Funeral plan', 'The possessed body advances toward Benjamin under cover of death procedure'],
  ]),
  trail('morena-cards', 'Morena’s negotiation cards', 'Rule-bound negotiation tool', 'A visible card set constrains the questions, answers, choices, and final recruitment result between Morena and Borksen.', 'Game completed with a forced Yes result', 'Chapter_408', [
    ['Morena', 'Defines the rules and available choices'], ['Borksen', 'Selects cards and gathers information'], ['Question and answer exchange', 'Each reveal changes the remaining decision space'], ['Marked-card tactic', 'Borksen attempts to preserve control'], ['Final Yes', 'Morena identifies the tactic and completes recruitment'],
  ]),
  trail('black-whale-passes', 'Black Whale tickets and access passes', 'Access-control system', 'Passenger class determines initial tier placement while tickets, gates, military checks, and criminal routes shape movement between decks.', 'Restricted further under special martial law', 'Black_Whale', [
    ['Kakin voyage authority', 'Sells and assigns passenger classes'], ['Passenger tier', 'Ticket class determines accommodation and access'], ['Tier gates and bulkheads', 'Official routes inspect or stop movement'], ['Mafia and hidden passages', 'Unofficial routes bypass parts of the system'], ['Special martial law', 'Closures and checks tighten across the ship'],
  ]),
  trail('gungi', 'Gungi board and pieces', 'Strategy game', 'The board becomes the safest shared language between Komugi and Meruem, transforming a contest of supremacy into recognition and intimacy.', 'Destroyed or abandoned with the East Gorteau palace aftermath', 'Gungi', [
    ['East Gorteau culture', 'Game with professional rankings'], ['Komugi', 'World champion whose life centers on play'], ['Meruem', 'Learns through repeated defeats'], ['Strategic evolution', 'Names moves and rethinks power'], ['Final game', 'They choose to play together as the Rose poison kills them'],
  ]),
];

export const systemsDeskStats = {
  charts: institutionCharts.length,
  chartNodes: institutionCharts.reduce((total, chart) => total + 1 + chart.levels.reduce((sum, level) => sum + level.nodes.length, 0), 0),
  relations: institutionalRelationships.length,
  trails: objectTrails.length,
};

