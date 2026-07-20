const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const source = (label, slug) => ({ label, href: wiki(slug) });
const cardListSource = wiki('Greed_Island_Card_Lists');

const specifiedCardNames = [
  "Ruler's Blessing", 'Patch of Forest', 'Plot of Beach', 'Pitcher of Eternal Water', 'Skin Care Hot Springs', 'Spirited Away Hollow', 'Liquor Spring', 'Pregnancy Stones', 'Mystery Pond', 'Tree of Plenty',
  'Golden Guidebook', 'Golden Scales', 'Golden Dictionary', 'Luck Bankbook', 'Connection Severing Scissors', 'Fickle Genie', "Fairy King's Advice", "Angel's Breath", "Imp's Wink", 'Poltergeist Pillow',
  'Mood Clock', 'X-Ray Goggles', 'Toraemon', 'Tome of a Thousand Tales', 'Hypothetical T.V.', 'Risky Dice', 'Night Shift Dwarves', 'Book of V.I.P Passes', 'Capricious Remote', 'Pre-Order Vouchers',
  'Favor Cushion', 'Double Postcard to the Dead', 'Parrot Candy', 'Hormone Cookies', 'Universal Survey', 'Chameleon Cat', 'Recycling Room', 'Fledgling Athlete', 'Fledgling Artist', 'Fledgling Politician',
  'Fledgling Musician', 'Fledgling Pilot', 'Fledgling Novelist', 'Fledgling Gambler', 'Fledgling Actor', 'Fledgling CEO', 'Gold Dust Girl', 'Sleeping Girl', 'Aromatherapy Girl', 'Miniature Mermaid',
  'Miniature Dino', 'Miniature Dragon', 'Pearl Locusts', 'King White Stag Beetle', 'Millennium Butterfly', 'Revenge Shop', 'Perfect Memory Studio', 'Hideout Realtor', 'Secrets Video Rental', 'Instant Foreign Language School',
  'Long Lost Delivery', 'Vending Check-Up', 'Club "You Rule"', 'Virtual Restaurant', "Witch's Love Potion", "Witch's Rejuvenation Potion", "Witch's Diet Pills", "Doyen's Growth Pills", "Doyen's Virility Pills", "Doyen's Hair Restorer",
  "Mad Scientist's Steroids", "Mad Scientist's Pheromones", "Mad Scientist's Plastic Surgery", 'Night Jade', "Sage's Aquamarine", 'Wild Luck Alexandrite', 'Roaming Ruby', 'Beauty Magnet Emerald', 'Lonely Sapphire', 'Rainbow Diamond',
  'Levitation Stone', 'Blue Planet', 'Staff of Judgment', 'Sword of Truth', "Paladin's Necklace", 'Sacrifice Armor', 'Quiver of Frustration', 'Shield of Faith', 'Eternal Hammer', "Tax Collector's Gauntlet",
  'Memory Helmet', 'Plastic King', 'Swap Ticket', 'Book of Life', "Bandit's Blade", 'Secret Cape', 'Clairvoyant Snake', '3-D Camera', 'Silver Dog', 'Panda Maid',
];

const specifiedUse = (number, name) => {
  if (number === 0) return 'Final completion reward';
  if (["Angel's Breath", 'Blue Planet', "Ruler's Blessing"].includes(name)) return 'Arc-critical reward';
  if (["Paladin's Necklace", 'Shield of Faith', 'Sacrifice Armor', "Bandit's Blade", "Tax Collector's Gauntlet", 'Secret Cape', 'Clairvoyant Snake'].includes(name)) return 'Rule interaction';
  if (number >= 37 && number <= 45) return 'Long-term reward item';
  if (number >= 46 && number <= 54) return 'Creature or person card';
  if (number >= 73 && number <= 81) return 'Treasure and risk reward';
  if (number < 18) return 'Rare utility / completion';
  return 'Specified slot record';
};

export const greedIslandSpecifiedCards = specifiedCardNames.map((name, index) => ({
  number: String(index).padStart(3, '0'),
  name,
  type: 'specified',
  group: specifiedUse(index, name),
  source: cardListSource,
}));

const freeCards = [
  ['100', "Map of the Island 'empty'", 'navigation'], ['101', "Map of the Island 'detailed'", 'navigation'], ['102', 'Voucher', 'reward bridge'], ['110', "Ruler's Invitation", 'capital access'], ['163', 'Sick Villagers', 'quest state'], ['263', 'Healthy Villagers', 'quest state'], ['266', 'Transport Ticket', 'exit tool'], ['572', 'Giant Cyclops', 'beast'], ['585', 'Bubble Horse', 'beast'], ['598', 'Chief of Wolf Pack', 'beast'], ['607', 'J10,000', 'currency'], ['673', 'Hyper Puffball', 'beast'], ['697', 'Melanin Lizard', 'beast'], ['711', 'Radio Rat', 'beast'], ['1217', 'Galgaida', 'food item'], ['14170', 'Gasoline', 'material'], ['21449', 'Rock', 'material'], ['25008', 'Large Rock', 'material'],
];

const spellCards = [
  ['1001', 'Peek', 'information'], ['1002', 'Fluoroscopy', 'information'], ['1003', 'Defensive Wall', 'defense'], ['1004', 'Reflect', 'defense'], ['1005', 'Magnetic Force', 'movement'], ['1006', 'Pickpocket', 'interference'], ['1007', 'Thief', 'interference'], ['1008', 'Trade', 'interference'], ['1009', 'Return', 'movement'], ['1010', 'Mimic', 'copy'],
  ['1011', 'Clone', 'copy'], ['1012', 'Relegate', 'movement'], ['1013', 'Origin', 'movement'], ['1014', 'Leave', 'movement'], ['1015', 'Clairvoyance', 'information'], ['1016', 'Drift', 'movement'], ['1017', 'Collision', 'movement'], ['1018', 'Levy', 'interference'], ['1019', 'Drawbridge', 'defense'], ['1020', 'Fake', 'copy'],
  ['1021', 'Mug', 'interference'], ['1022', 'Corruption', 'interference'], ['1023', 'Compromise', 'interference'], ['1024', 'Dispel', 'copy'], ['1025', 'Blackout Curtain', 'defense'], ['1026', 'Holy Water', 'defense'], ['1027', 'Trace', 'information'], ['1028', 'Rock Toss', 'interference'], ['1029', 'Bullet', 'interference'], ['1030', 'Guidepost', 'information'],
  ['1031', 'Analysis', 'information'], ['1032', 'Lottery', 'copy'], ['1033', 'Cling', 'information'], ['1034', 'Purify', 'copy'], ['1035', 'Fortress', 'defense'], ['1036', 'Eye of God', 'information'], ['1037', 'Recycle', 'copy'], ['1038', 'List', 'information'], ['1039', 'Accompany', 'movement'], ['1040', 'Contact', 'information'],
];

const gameMasterCards = [
  ['-000', 'Debug', 'game-master event control'], ['-001', 'Under Control', 'game-master action lock'], ['-002', 'Reset', 'game-master data reset'], ['-003', 'Eliminate', 'game-master intrusion removal'],
];

export const greedIslandFreeCards = freeCards.map(([number, name, group]) => ({ number, name, type: 'free', group, source: cardListSource }));
export const greedIslandSpellCards = spellCards.map(([number, name, group]) => ({ number, name, type: 'spell', group, source: cardListSource }));
export const greedIslandGameMasterCards = gameMasterCards.map(([number, name, group]) => ({ number, name, type: 'game-master', group, source: cardListSource }));
export const greedIslandCards = [...greedIslandSpecifiedCards, ...greedIslandFreeCards, ...greedIslandSpellCards, ...greedIslandGameMasterCards];
export const greedIslandCardGroups = [['all', 'All cards'], ['specified', 'Specified slots'], ['spell', 'Spell cards'], ['free', 'Free slots'], ['game-master', 'Game Master']];

export const greedIslandPrototype = {
  id: 'greed-island',
  title: 'Greed Island',
  eyebrow: 'Game-system arc page · Binder, spells, players and completion route',
  range: 'Chapters 120–185 · 2011 Episodes 59–75',
  deck: 'A Black Archive game manual for Greed Island: JoyStation entry, Binder rules, full card catalogue, spell strategy, player teams, Biscuit training, Razor’s dodgeball match, Bomber exploitation, and the three-card exit.',
  palette: { primary: '#2B6F9E', accent: '#D9A441', secondary: '#7A4EA3', danger: '#A12A38', paper: '#F1ECE2' },
  heroPeople: ['Gon Freecss', 'Killua Zoldyck', 'Biscuit Krueger', 'Razor', 'Genthru'],
  facts: [['Manga span', 'Ch. 120–185'], ['2011 anime', 'Ep. 59–75'], ['Game platform', 'JoyStation'], ['Completion target', '100 specified slots'], ['Spell cards', '40 known spells'], ['Exit rule', 'Three specified cards']],
  sections: [['overview', 'Overview'], ['chronology', 'Route ledger'], ['rules', 'Game rules'], ['locations', 'Island map'], ['cards', 'Card catalogue'], ['spells', 'Spell strategy'], ['teams', 'Player teams'], ['training', 'Biscuit training'], ['dodgeball', 'Razor match'], ['bomber', 'Bomber conflict'], ['completion', 'Completion route'], ['aftermath', 'Aftermath'], ['adaptation', 'Adaptation'], ['sources', 'Sources']],
  overview: [
    ['Entry state', 'Gon and Killua reach the auction route to Greed Island after Yorknew and enter a game that is actually a dangerous Nen-made physical environment.'],
    ['Main pressure', 'The arc turns combat, travel, trading, information, healing, and player violence into rule-bound card systems that can be mastered or exploited.'],
    ['Structural role', 'Greed Island bridges basic Nen literacy and Chimera Ant danger by making Gon and Killua train under Biscuit while solving a live multiplayer game.'],
    ['Exit state', 'The game is cleared, three cards are taken out, and the Accompany route sends Gon and Killua toward Kite instead of Ging.'],
  ],
  chronology: [
    { code: 'GI-00', phase: 'Auction bridge', title: 'Greed Island becomes the next route', detail: 'The Yorknew goal of accessing the game becomes the new story engine after the auction and Troupe crisis.' },
    { code: 'GI-01', phase: 'Entry', title: 'JoyStation launch and Eta tutorial', detail: 'Players enter physically, receive ring and Binder Book rules, and learn that the game world has lethal consequences.' },
    { code: 'GI-02', phase: 'System discovery', title: 'Book, Gain, card slots and spell pressure', detail: 'Collection, conversion, spell targeting, and player information become tactical rather than decorative.' },
    { code: 'GI-03', phase: 'Biscuit', title: 'Biscuit joins and redirects the boys', detail: 'Biscuit recognizes talent and immaturity, then turns the game into structured Nen and body training.' },
    { code: 'GI-04', phase: 'Player economy', title: 'Teams and card monopolies emerge', detail: 'Tsezguerra’s group, Genthru’s alliance, and other players reveal that completion is political and economic.' },
    { code: 'GI-05', phase: 'Razor route', title: 'Soufrabi and the dodgeball requirement', detail: 'The card path forces the protagonists into Razor’s game, where cooperation with Hisoka and Nen teamwork are necessary.' },
    { code: 'GI-06', phase: 'Bomber reveal', title: 'Genthru weaponizes the alliance', detail: 'Countdown transforms trust, binder visibility, and completion progress into hostages and leverage.' },
    { code: 'GI-07', phase: 'Preparation', title: 'Training becomes a trap plan', detail: 'Biscuit sharpens Gon and Killua while the team prepares a card-and-terrain counterstrategy against Genthru, Sub, and Bara.' },
    { code: 'GI-08', phase: 'Final fights', title: 'Gon, Killua, and Biscuit split the Bomber team', detail: 'The ending conflict proves that game knowledge, card preparation, and Nen fundamentals are inseparable.' },
    { code: 'GI-09', phase: 'Clear', title: 'Quiz, #000, and the three-card case', detail: 'Specified slot completion leads to the quiz, the clear condition, and the reward structure that shapes the transition out of the game.' },
  ],
  rules: [
    ['JoyStation entry', 'Players enter through the console, but their bodies are transported into the actual game environment rather than merely controlling avatars.'],
    ['Ring commands', 'Book materializes the Binder Book; Gain turns a card back into an item under conversion rules.'],
    ['Specified slots', 'The central win condition is collecting the 100 designated cards into their matching binder slots.'],
    ['Free slots', 'Unrestricted/free cards and spell cards occupy separate binder capacity and support play without directly completing the game.'],
    ['Rank and limit', 'Cards carry difficulty rank and conversion-limit pressure, so scarcity and monopolization become strategy.'],
    ['Spell targeting', 'Spell cards can track, move, steal, protect, reveal, copy, destroy, or manipulate cards without directly damaging players.'],
    ['Game Master control', 'Negative-numbered cards show that Greed Island has an administrative layer above normal player rules.'],
    ['Three-card exit', 'A player who clears the game can take three specified cards outside, making the endgame a selection problem as much as a victory.'],
  ],
  locations: [['Shiso Tree', 'Starting point and tutorial boundary.'], ['Masadora', 'Spell-card economy center.'], ['Spell Card Shop', 'Only shop system for spell-card packs.'], ['Soufrabi', 'Port city controlled by Razor’s pirates.'], ['Limeiro', 'Capital-city reward space connected to ruler-class cards.'], ['Aiai', 'Town used to show artificial event logic and player temptation.'], ['Dorias', 'Named travel-web location that makes movement spells valuable.'], ['Training zones', 'Biscuit turns danger into a training circuit.']],
  cardLanes: [['Specified Slot Cards', 'The 100-card red-binder route.'], ['Spell Cards', 'The 40-card blue-binder strategy layer.'], ['Free Slot Cards', 'Utility, materials, currency, creatures, and game-state items.'], ['Game Master Cards', 'Negative-number administrative cards.']],
  spellStrategy: [['Movement', 'Magnetic Force, Return, Relegate, Origin, Leave, Drift, Collision, and Accompany shape travel and pursuit.'], ['Information', 'Peek, Fluoroscopy, Clairvoyance, Trace, Cling, Guidepost, Analysis, Eye of God, List, and Contact turn cards and players into data.'], ['Interference', 'Pickpocket, Thief, Trade, Levy, Mug, Corruption, Compromise, Rock Toss, and Bullet target card progress.'], ['Defense', 'Defensive Wall, Reflect, Drawbridge, Blackout Curtain, Holy Water, and Fortress protect against spell pressure.'], ['Copy / transform', 'Mimic, Clone, Fake, Dispel, Purify, Lottery, and Recycle make identity, slot validity, and scarcity unstable.']],
  teams: [
    { name: 'Gon / Killua / Biscuit', role: 'Training and completion party', goal: 'Clear the game while turning Greed Island into applied Nen training.', outcome: 'Defeats Razor’s challenge, counters the Bombers, clears the game, and exits with three cards.' },
    { name: 'Tsezguerra’s team', role: 'Professional player group', goal: 'Use experience, negotiation, and card progress to compete for the clear condition.', outcome: 'Becomes an ally and strategic foil to Gon’s more reckless development.' },
    { name: 'Genthru / Sub / Bara', role: 'Bomber exploitation team', goal: 'Exploit alliance trust, card scarcity, and Countdown to steal the path to completion.', outcome: 'Defeated by preparation, split matchups, and recovery planning.' },
    { name: 'Razor and Game Masters', role: 'Rule enforcers and gatekeepers', goal: 'Maintain the game’s intended challenge and block illegal or unqualified routes.', outcome: 'Razor becomes the central match gate and exposes the creators’ Nen scale.' },
    { name: 'Hisoka', role: 'Temporary specialist ally', goal: 'Help win the dodgeball game while pursuing his own wider interests.', outcome: 'Bungee Gum becomes decisive without making him part of Gon’s party.' },
    { name: 'Phantom Troupe intrusion', role: 'External pressure', goal: 'Search for Chrollo-related options and test the game boundary.', outcome: 'Razor uses Game Master authority to remove illegal entry pressure from the island.' },
  ],
  training: [['Biscuit’s assessment', 'Biscuit treats Gon and Killua as talented but unfinished.'], ['Ren endurance', 'Long aura output and fatigue management become measurable training.'], ['Ko and Ryu application', 'The arc moves beyond Heaven’s Arena basics into distribution and focus.'], ['Killua’s support role', 'Killua’s damaged hands in Razor’s match show support as active sacrifice.'], ['Gon’s risk habit', 'The Genthru plan works because Gon can commit violently, but the cost stays visible.']],
  conflicts: [
    { name: 'Entry and player predation', type: 'System survival', participants: 'New players, veteran players, and Greed Island rules', result: 'Knowing rules matters as much as strength.', consequence: 'The card catalogue becomes a survival tool.' },
    { name: 'Biscuit training pressure', type: 'Training conflict', participants: 'Biscuit, Gon, and Killua', result: 'The boys are forced into disciplined growth.', consequence: 'Applied Nen becomes the arc’s true curriculum.' },
    { name: 'Soufrabi pirates route', type: 'Quest gate', participants: 'Team Gon, Hisoka, Tsezguerra’s group, Razor’s pirates', result: 'The path to a required card becomes a team challenge.', consequence: 'Razor’s match becomes unavoidable.' },
    { name: 'Razor dodgeball', type: 'Tactical match', participants: 'Razor, his devils, Gon, Killua, Biscuit, Hisoka, and allied players', result: 'Team Gon wins through combined Nen, positioning, sacrifice, and Bungee Gum.', consequence: 'A major completion route opens.' },
    { name: 'Bomber reveal', type: 'Alliance betrayal', participants: 'Genthru, Sub, Bara, and the player alliance', result: 'Countdown turns cooperation into hostage leverage.', consequence: 'Completion progress becomes a threat.' },
    { name: 'Gon vs. Genthru', type: 'Final trap fight', participants: 'Gon and Genthru', result: 'Gon accepts damage to execute the prepared counterplan.', consequence: 'Angel’s Breath recovery and planning become essential.' },
    { name: 'Killua/Biscuit split fights', type: 'Parallel finish', participants: 'Killua vs. Sub and Biscuit vs. Bara', result: 'The Bomber team loses across separated matchups.', consequence: 'Training, deception, and strength pay off differently.' },
  ],
  dodgeball: [['Objective', 'Win Razor’s match to unlock a required route.'], ['Rules', 'The match converts Nen output, catching, rebounds, throws, and positioning into resources.'], ['Razor', 'Razor is both player-facing opponent and Game Master-scale Nen proof.'], ['Hisoka', 'Hisoka’s temporary alliance makes the win possible without softening his threat identity.'], ['Killua', 'Killua’s support catches and damaged hands show the cost of enabling Gon’s throw.'], ['Result', 'Victory proves teamwork and applied Nen can solve game gates.']],
  bomber: [['Countdown as exploitation', 'Genthru weaponizes explanation, touch, trust, and time limits.'], ['Alliance vulnerability', 'Shared completion goals create the perfect environment for betrayal.'], ['Trap preparation', 'The protagonists prepare terrain, cards, matchups, and recovery route.'], ['Gon’s victory cost', 'Gon’s willingness to be injured foreshadows his self-destructive resolve.'], ['Angel’s Breath', 'The recovery card matters because the plan assumes damage and then requires healing.']],
  completion: [['Collect 001–099', 'Specified Slot progress unlocks the final quiz condition.'], ['Final quiz', 'The highest scorer receives card #000.'], ['Three-card case', 'Clearing the game converts victory into a choice of three specified cards.'], ['Accompany route', 'The chosen travel logic points Gon and Killua toward Kite.']],
  aftermath: [['Gon', 'Clears the game and moves closer to Ging’s trail, but the route leads to Kite.'], ['Killua', 'Leaves with applied Nen growth and a stronger tactical support identity.'], ['Biscuit', 'Completes her role as trainer while proving the arc’s cute exterior hides expert judgment.'], ['Greed Island system', 'The cleared game remains a Nen engineering marvel rather than a normal video game.']],
  adaptation: [['Range', 'The 2011 anime covers Greed Island across Episodes 59–75 while the manga spine remains Chapters 120–185.'], ['Viewing use', 'The page separates game rules, card logic, training, Razor, Bomber, and the ending route.'], ['Model', 'Card data is treated as structured reference; the story page interprets how that data functions in the arc.']],
  sources: [source('Greed Island arc', 'Greed_Island_arc'), source('Greed Island', 'Greed_Island'), source('Greed Island Card Lists', 'Greed_Island_Card_Lists'), source('Spell Card Shop', 'Spell_Card_Shop'), source('Biscuit Krueger', 'Biscuit_Krueger'), source('Razor', 'Razor'), source('Genthru', 'Genthru'), source('Gon Freecss', 'Gon_Freecss'), source('Killua Zoldyck', 'Killua_Zoldyck'), source('Tsezguerra', 'Tsezguerra')],
};

export const greedIslandPrototypeStats = {
  sections: greedIslandPrototype.sections.length,
  overview: greedIslandPrototype.overview.length,
  chronology: greedIslandPrototype.chronology.length,
  rules: greedIslandPrototype.rules.length,
  locations: greedIslandPrototype.locations.length,
  cardLanes: greedIslandPrototype.cardLanes.length,
  spellStrategy: greedIslandPrototype.spellStrategy.length,
  teams: greedIslandPrototype.teams.length,
  training: greedIslandPrototype.training.length,
  conflicts: greedIslandPrototype.conflicts.length,
  dodgeball: greedIslandPrototype.dodgeball.length,
  bomber: greedIslandPrototype.bomber.length,
  completion: greedIslandPrototype.completion.length,
  sources: greedIslandPrototype.sources.length,
};

export const greedIslandCardStats = {
  specified: greedIslandSpecifiedCards.length,
  free: greedIslandFreeCards.length,
  spell: greedIslandSpellCards.length,
  gameMaster: greedIslandGameMasterCards.length,
  total: greedIslandCards.length,
};
