const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;

const plate = (title, moment, meaning, fileName, source) => ({ title, moment, meaning, image: file(fileName), source: wiki(source) });

export const arcVisualArchives = {
  'hunter-exam': {
    title: 'The exam changes what “winning” means in every phase.',
    note: 'Read the images as evidence of a changing test: endurance, judgment, cooperation, hunting, and refusal. Strength alone never explains the result.',
    essentials: [
      ['Hidden route', 'Applicants are evaluated before registration by the captain, the old woman, and the Kiriko family.'],
      ['Phase outcomes', 'A failure, death, voluntary withdrawal, proctor intervention, and disqualification remain separate result types.'],
      ['Badge economy', 'Own badge = 3 points; assigned target = 3; any other badge = 1; six points are required.'],
      ['Final logic', 'The inverted bracket is designed to produce one failure. Conceding advances the winner; killing disqualifies the killer.'],
      ['License result', 'The formal result follows Netero’s ruling even though the scheduled match order is interrupted.'],
      ['After-exam bridge', 'The Zoldyck rescue and Secret Hunter Exam explain why a license is only the beginning of Hunter qualification.'],
    ],
    plates: [
      plate('The endurance field', 'First Phase', 'Satotz controls pace and direction while the tunnel and wetlands eliminate applicants in different ways.', 'Kurapika and Leorio follow Satotz.png', 'Hunter_Exam_arc'),
      plate('Cooking as expertise', 'Second Phase', 'The Gourmet Hunters test specialist knowledge; Netero’s retest shows that an examiner’s procedure can be reviewed.', 'Cooking test.png', 'Hunter_Exam_arc'),
      plate('Majority Rules', 'Third Phase', 'The clock, group voting, prisoner wagers, and final corridor choice make Trick Tower a resource-allocation test.', '3rd Phase - Trick Tower.png', 'Trick_Tower'),
      plate('The badge hunt', 'Fourth Phase', 'Zevil Island turns every participant into both hunter and target; information and timing matter more than open combat.', '4th Phase - Zevil Island.png', 'Hunter_Exam_arc'),
      plate('The debt to Hisoka', 'Fourth Phase', 'Gon succeeds tactically, is ambushed, and refuses to treat the returned badge as a clean victory.', 'Hisoka punches Gon.png', 'Hunter_Exam_arc'),
      plate('Final ruling', 'Final Phase', 'The pass-oriented tournament ends through Killua’s disqualification rather than a conventional champion.', 'Final Phase bracket.png', '287th_Hunter_Exam'),
    ],
  },
  'heavens-arena': {
    title: 'The tower is simultaneously a sports system and a hidden Nen school.',
    note: 'Floor rules, registration deadlines, point scoring, money, injury, and aura initiation change with elevation. The visual archive keeps those layers separate.',
    essentials: [
      ['One tower', 'Heavens Arena has 251 floors; it is not a campus of separate competitive buildings.'],
      ['200th-floor threshold', 'Registration, scheduled matches, four-loss disqualification, and the ten-win Floor Master challenge define the upper circuit.'],
      ['Nen initiation', 'Hostile aura at the 200th floor is a barrier that ordinary fighters cannot safely cross.'],
      ['Score vs. survival', 'A match can be won by points even when one fighter achieves a personal objective inside it.'],
      ['Category mismatch', 'Kastro’s Double is used to explain affinity, training load, and Hisoka’s “memory overload” analysis.'],
      ['Long continuity', 'The arena later becomes the chosen environment for Chrollo’s prepared fight against Hisoka.'],
    ],
    plates: [
      plate('The 251-floor tower', 'Vertical competition', 'Floor bands are progression gates, while the summit belongs to Battle Olympia and Floor Masters.', 'Heavens Arena.png', 'Heavens_Arena'),
      plate('Kastro’s opening', 'Hisoka vs. Kastro', 'Tiger Bite Fist establishes real damage before Hisoka exposes the logic and burden of the Double.', "Kastro's Tiger Bite Fist.png", 'Heavens_Arena_arc'),
      plate('The hidden hand', 'Nen mechanics', 'Hisoka uses Bungee Gum, Texture Surprise, psychology, and severed limbs as one deceptive sequence.', 'True Tiger Bite Fist.png', 'Heavens_Arena_arc'),
      plate('Fundamentals in combat', 'Gon vs. Gido', 'Gon’s rematch turns Ren, timing, arena material, and threat assessment into a practical lesson.', 'Gon after defeating Gido.png', 'Heavens_Arena_arc'),
      plate('The badge returned', 'Gon vs. Hisoka', 'Gon lands the promised punch and returns badge #44 even though Hisoka wins the official match on points.', 'Gon punches Hisoka.png', 'Heavens_Arena_arc'),
    ],
  },
  'yorknew-city': {
    title: 'Yorknew is an information war disguised as an auction week.',
    note: 'The same event means something different to the Mafia, the Troupe, Kurapika, the Nostrades, the Zoldycks, and Gon’s group. Dates and information states matter.',
    essentials: [
      ['Two markets', 'The public Southernpiece Auction and the Mafia’s Underground Auction have different authority and risks.'],
      ['Kurapika’s contract', 'Chain Jail, Judgment Chain, Emperor Time, and his target restriction form a connected ability system.'],
      ['Spider rule', 'The organization may sacrifice a limb to preserve the Spider; this principle drives the hostage debate.'],
      ['Counterfeit outcome', 'Gallery Fake copies and staged corpses distort what both the Mafia and protagonists believe.'],
      ['Competing contracts', 'The Zoldyck fight with Chrollo ends because Illumi’s separate contract removes the Ten Dons.'],
      ['Memory as inheritance', 'Pakunoda’s final shots preserve group knowledge while triggering the cost of Kurapika’s condition.'],
    ],
    plates: [
      plate('Bodyguard entrance test', 'Before September', 'Kurapika’s Dowsing Chain and the applicants’ abilities establish the Nostrade team before the auction crisis.', 'Kurapika fighting the assailants.png', 'Yorknew_City_arc'),
      plate('The opening massacre', 'September 1', 'The Troupe’s attack destroys the expected auction structure and begins a city-wide information scramble.', 'Feitan and Franklin beginning the massacre at the auction.png', 'Yorknew_City_arc'),
      plate('Shadow Beasts operation', 'Uvogin captured', 'Specialized attacks briefly contain Uvogin, but damage, poison, and restraint do not equal a finished operation.', 'Uvogin killing multiple Shadow Beasts by himself.png', 'Yorknew_City_arc'),
      plate('Kurapika’s revenge duel', 'Uvogin’s death', 'Chain Jail forces Zetsu and turns the vow against the Troupe into decisive control.', "Uvogin's final moments.png", 'Yorknew_City_arc'),
      plate('Requiem', 'Troupe retaliation', 'Chrollo conducts a coordinated city assault in Uvogin’s memory while the Mafia misreads the Spider’s state.', 'Chrollo orchestrating a requiem for Uvogin.png', 'Yorknew_City_arc'),
      plate('The exchange', 'Final hostage operation', 'Judgment Chain conditions, Pakunoda’s decision, and competing loyalties determine the outcome.', 'Kurapika stating his conditions.png', 'Yorknew_City_arc'),
      plate('Memory Bomb', 'Pakunoda’s choice', 'The Troupe retains the truth at the cost of Pakunoda’s life.', "Pakunoda's death.png", 'Yorknew_City_arc'),
    ],
  },
  'greed-island': {
    title: 'Greed Island is a physical country governed by game rules and Nen infrastructure.',
    note: 'The binder, specified slots, spells, copy limits, acquisition methods, transport, quests, and Game Masters are one operating system—not decorative game language.',
    essentials: [
      ['Physical transport', 'A player’s body enters the island; death and injury are real.'],
      ['100-card objective', 'Completion requires the specified-slot set and knowledge of how each card is acquired.'],
      ['Spell economy', 'Movement, theft, defense, tracking, and communication cards create a second strategic layer.'],
      ['Training route', 'Biscuit turns travel and quests into Ten, Ren, Gyo, Shu, Ken, Ko, Ryu, and category practice.'],
      ['Three simultaneous fights', 'Gon, Killua, and Biscuit split the Bombers so each matchup can use a tailored plan.'],
      ['Exit choice', 'Three cards may leave; Gon’s use of Accompany determines the next destination and reveals Razor’s naming clue.'],
    ],
    plates: [
      plate('Biscuit’s intervention', 'Training begins', 'Binolt becomes a controlled benchmark as Gon and Killua learn to combine sensing, timing, and physical work.', 'Binolt surrendering to Gon.png', 'Greed_Island_arc'),
      plate('The Bomber revealed', 'Alliance collapse', 'Genthru weaponizes prior contact, information, and Countdown’s release rule against the card alliance.', 'Genthru killing Jispa.png', 'Greed_Island_arc'),
      plate('Soufrabi challenge', 'Patch of Shore route', 'The pirate sequence forces players to assemble a team before Razor’s final game.', 'The group meeting Razor and his pirates.png', 'Greed_Island_arc'),
      plate('Dodgeball alliance', 'Razor match', 'Gon, Killua, Hisoka, Biscuit, Goreinu, and others solve catching, returning, positioning, and injury as a team.', 'Gon, Killua, and Hisoka working together to defeat Razor.png', 'Greed_Island_arc'),
      plate('Three-part counterplan', 'Bombers defeated', 'Prepared terrain and matchup-specific tactics matter more than a generic comparison of raw power.', 'Gon defeating Genthru.png', 'Greed_Island_arc'),
    ],
  },
  'chimera-ant': {
    title: 'The arc changes scale: colony, nation, operation, duel, and aftermath.',
    note: 'A single chronological list hides too much. The visual archive marks each scale change and shows where objectives stop being purely military.',
    essentials: [
      ['Phagogenesis', 'The Queen incorporates consumed traits into offspring, producing ranked soldiers with increasingly human memory and identity.'],
      ['Political capture', 'East Gorteau’s dictatorship, the Selection, and the palace become logistical parts of the colony.'],
      ['Operation design', 'Knov’s portals and Guard-separation plans depend on exact roles, then fracture when Komugi is injured.'],
      ['Multiple moral centers', 'Gon/Pitou, Meruem/Komugi, Killua/Palm, Ikalgo/Welfin, and Knuckle/Youpi change through different confrontations.'],
      ['Rose mechanism', 'The bomb’s blast is not the only weapon; its spreading poison determines the surviving King and Guards’ deaths.'],
      ['Human continuity', 'Reina/Shidore, Koala, Welfin, Bloster, and Gyro preserve unresolved links beyond the military victory.'],
    ],
    plates: [
      plate('Threat discovery', 'Entering NGL', 'Rammot shows how rapidly the colony’s soldiers can become combat threats before formal Nen education spreads.', 'Gon and Killua facing Rammot in combat.png', 'Chimera_Ant_arc'),
      plate('The new ceiling', 'Pitou is born', 'Pitou’s treatment of Pokkle and defeat of Kite establish both intelligence acquisition and overwhelming power.', "Neferpitou extracting information from Pokkle's brain.png", 'Chimera_Ant_arc'),
      plate('The captured state', 'East Gorteau palace', 'The King and Guards move from colony biology into control of a nation and mass Selection plan.', 'The King and his Royal Guards arriving at the Royal Palace of East Gorteau.png', 'Chimera_Ant_arc'),
      plate('The transforming contest', 'Meruem and Komugi', 'Repeated Gungi defeat changes the King more deeply than military resistance can.', 'Meruem and Komugi playing Gungi.png', 'Chimera_Ant_arc'),
      plate('Zero hour', 'Palace invasion', 'Dragon Dive begins several concurrent lanes whose objectives immediately change around Komugi.', 'The Extermination Team entering the palace.png', 'Chimera_Ant_arc'),
      plate('The isolated duel', 'Netero vs. Meruem', 'Prayer speed, pattern recognition, endurance, Zero Hand, and the Rose form distinct layers of the result.', 'Meruem fighting Netero inside the underground tomb.png', 'Chimera_Ant_arc'),
      plate('The vow', 'Gon vs. Pitou', 'Gon exchanges future potential for the power to force one immediate outcome.', 'Gon preparing to fight Neferpitou.png', 'Chimera_Ant_arc'),
      plate('The final game', 'Poison aftermath', 'Meruem accepts his remaining time and returns to Komugi rather than attempting to restore the regime.', 'Meruem and Komugi holding hands even in death.png', 'Chimera_Ant_arc'),
    ],
  },
  'chairman-election': {
    title: 'A public election and a private rescue race run on the same clock.',
    note: 'The ballot changes Association power while Killua’s route tests who controls Alluka and Nanika. Gon’s condition connects the two lanes.',
    essentials: [
      ['Turnout threshold', 'A ballot is invalid below 95 percent participation, forcing repeated rounds and political pressure.'],
      ['Majority threshold', 'A candidate needs a majority; later rounds narrow the field until a final choice is possible.'],
      ['Pariston’s objective', 'Winning office is not equivalent to wanting to govern; his play targets the Association and Netero’s legacy.'],
      ['Leorio’s candidacy', 'His public anger about Gon converts medical loyalty into political support.'],
      ['Requests vs. commands', 'Killua’s relationship with Nanika exposes rules the family’s control model does not understand.'],
      ['World Tree bridge', 'Ging reframes the known world and leads directly toward the Dark Continent story.'],
    ],
    plates: [
      plate('The rules are drawn', 'Election opens', 'Netero’s instruction becomes a voting procedure whose turnout rule prevents an immediate result.', 'Beans drawing the lot.png', '13th_Hunter_Chairman_Election_arc'),
      plate('The early favorite', 'First ballot', 'Pariston leads while repeated low-turnout rounds turn procedure into a pressure tactic.', 'Pariston coming in first place.png', '13th_Hunter_Chairman_Election_arc'),
      plate('The rescue condition', 'Alluka and Nanika', 'Killua distinguishes care, requests, commands, healing, and family fear while moving toward Gon.', "Nanika listening to Killua's request.png", '13th_Hunter_Chairman_Election_arc'),
      plate('Leorio’s political rise', 'Candidate speeches', 'One punch at Ging makes Gon’s absence impossible for the Association to treat as background.', 'Leorio striking Ging with his warping punch.png', '13th_Hunter_Chairman_Election_arc'),
      plate('The pursuit', 'Hospital route', 'Butlers, Godspeed, Illumi’s Needle People, Hisoka, and family surveillance create overlapping chases.', 'The butlers chasing after Killua and Alluka.png', '13th_Hunter_Chairman_Election_arc'),
      plate('Healing', 'Election climax', 'Nanika restores Gon while the final ballot resolves the public political lane.', 'Nanika healing Gon.png', '13th_Hunter_Chairman_Election_arc'),
      plate('Known world boundary', 'World Tree', 'Gon returns Ging’s license and learns that the mapped human world is only the inner frame.', 'Gon and Ging viewing the scenery atop the World Tree.png', '13th_Hunter_Chairman_Election_arc'),
    ],
  },
};

