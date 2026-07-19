const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const storySplit = [
  {
    id: 'all-arcs',
    title: 'Complete series',
    range: 'Chapters 1–413',
    summary: 'The complete seven-arc catalogue, from Gon leaving Whale Island through the current Black Whale voyage.',
    lenses: ['Gon and Killua’s growth', 'Kurapika’s revenge', 'Nen instruction', 'Association politics', 'Succession information warfare'],
  },
  {
    id: 'pre-succession',
    title: 'Pre-Succession story',
    range: 'Chapters 1–339',
    summary: 'The six completed earlier arcs, from Whale Island through the Chairman Election and Gon meeting Ging.',
    lenses: ['Hunter Exam foundations', 'Nen training', 'Yorknew and Kurapika', 'Greed Island', 'Chimera Ant crisis', 'Election aftermath'],
  },
  {
    id: 'succession',
    title: 'Succession Contest',
    range: 'Chapters 340–413',
    summary: 'The current arc operates like a dense political dossier: the Dark Continent launch, Kakin succession war, royal bodyguards, mafia families, Phantom Troupe, and Nen information warfare aboard the Black Whale.',
    lenses: ['Kakin princes', 'Guardian Spirit Beasts', 'Black Whale tiers', 'Mafia conflict', 'Kurapika’s lifespan cost'],
  },
];

export const nenSections = [
  {
    title: 'Core principles',
    description: 'The starting vocabulary for aura control.',
    items: [
      ['Nen', 'Nen'], ['Aura', 'Aura'], ['Aura Nodes', 'Aura_Nodes'], ['Ten', 'Ten'], ['Zetsu', 'Zetsu'], ['Ren', 'Ren'], ['Hatsu', 'Hatsu'],
    ],
  },
  {
    title: 'Advanced applications',
    description: 'Combat-reading and aura-shaping techniques.',
    items: [
      ['Gyo', 'Gyo'], ['In', 'In'], ['En', 'En'], ['Shu', 'Shu'], ['Ko', 'Ko'], ['Ken', 'Ken'], ['Ryu', 'Ryu'],
    ],
  },
  {
    title: 'Nen types',
    description: 'The six expression categories used to classify abilities.',
    items: [
      ['Enhancement', 'Enhancement'], ['Transmutation', 'Transmutation'], ['Emission', 'Emission'],
      ['Conjuration', 'Conjuration'], ['Manipulation', 'Manipulation'], ['Specialization', 'Specialization'],
    ],
  },
  {
    title: 'Tests and training',
    description: 'How aura is discovered, classified, awakened, and trained.',
    items: [
      ['Water Divination', 'Water_Divination'], ['Personality Test', 'Personality_Test'], ['Telltale Signs', 'Telltale_Signs'],
      ['Training Exercises', 'Training_Exercises'], ['Initiation', 'Nen#Initiation'], ['Forced Awakening', 'Nen#Initiation'],
    ],
  },
  {
    title: 'Rules, contracts & aftereffects',
    description: 'Conditions and costs that make abilities stronger, stranger, or dangerous to their users.',
    items: [
      ['Vows and Limitations', 'Vows_and_Limitations'], ['Conditions', 'Conditions'], ['Post-Mortem Nen', 'Nen#Post-mortem_Nen'],
      ['Nen Curse', 'Nen#Nen_curses'], ['Nen Exorcism', 'Nen#Exorcism'], ['Nen Beast', 'Nen_Beast'],
      ['Parasitic Nen', 'Guardian_Spirit_Beast'], ['Collaborative Abilities', 'Nen#Compound-type_abilities'],
    ],
  },
  {
    title: 'Named abilities',
    description: 'Major ability pages to cross-reference while reading.',
    items: [
      ['Jajanken', 'Jajanken'], ['Godspeed', 'Godspeed'], ['Emperor Time', 'Emperor_Time'], ['Stealth Dolphin', 'Stealth_Dolphin'],
      ['Bungee Gum', 'Bungee_Gum'], ['Texture Surprise', 'Texture_Surprise'], ['Skill Hunter', 'Skill_Hunter'],
      ['Chain Jail', 'Chain_Jail'], ['Judgment Chain', 'Judgment_Chain'], ['100-Type Guanyin Bodhisattva', '100-Type_Guanyin_Bodhisattva'],
      ['Hakoware', 'Hakoware'], ['Deep Purple', 'Deep_Purple'], ['Hide and Seek', 'Hide_and_Seek'],
    ],
  },
  {
    title: 'Succession abilities',
    description: 'The abilities that define information warfare aboard the Black Whale.',
    items: [
      ['Guardian Spirit Beasts', 'Guardian_Spirit_Beast'], ['Benjamin Baton', 'Benjamin_Hui_Guo_Rou'], ['Cat’s Name', 'Camilla_Hui_Guo_Rou'],
      ['Parallel Future', 'Tserriednich_Hui_Guo_Rou'], ['Magical Worm', 'Fugetsu_Hui_Guo_Rou'], ['Without You', 'Kacho_Hui_Guo_Rou'],
      ['Halkenburg’s Arrow', 'Halkenburg_Hui_Guo_Rou'], ['Predator', 'Rihan'], ['Silent Majority', 'Silent_Majority'],
      ['Contagion', 'Morena_Prudo'], ['Moonlight Act', 'Longhi'], ['Zhang Lei’s Coins', 'Zhang_Lei_Hui_Guo_Rou'],
    ],
  },
].map((section) => ({
  ...section,
  items: section.items.map(([name, slug]) => ({ name, url: wiki(slug) })),
}));

export const completeCharacterSources = [
  { name: 'Complete canon A–Z character list', url: wiki('List_of_Hunter_%C3%97_Hunter_Characters/A-Z') },
  { name: 'Chapters 340-current character list', url: wiki('List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current') },
  { name: 'All character category', url: wiki('Category:Characters') },
  { name: 'Succession Contest portraits', url: wiki('Category:Succession_Contest_Portraits') },
];

export const successionSystems = [
  {
    title: 'Royal family',
    description: 'King Nasubi, eight queens, fourteen princes, birth order, maternal lines, and each prince’s political base.',
    items: ['King and queens', 'Fourteen princes', 'Maternal lines', 'Royal attendants'],
    source: wiki('Kakin_Royal_Family'),
  },
  {
    title: 'Succession rules',
    description: 'The deathmatch created by the Seed Urn ceremony and the restrictions that keep the princes inside the contest.',
    items: ['Seed Urn ritual', 'Deathmatch rules', 'Withdrawal restrictions', 'Sole-survivor objective'],
    source: wiki('Succession_Contest'),
  },
  {
    title: 'Guardian Spirit Beasts',
    description: 'Parasitic Nen beasts shaped by the princes’ dispositions, invisible to non-users and restricted from directly attacking one another.',
    items: ['Parasitic Nen', 'Host aura cost', 'Indirect action', 'Prince-specific abilities'],
    source: wiki('Guardian_Spirit_Beast'),
  },
  {
    title: 'Royal security network',
    description: 'Personal guards, queen-appointed spies, Hunters, servants, Benjamin’s private army, and shifting room assignments.',
    items: ['Private soldiers', 'Queen spies', 'Hunter bodyguards', 'Nen class attendees'],
    source: wiki('List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current'),
  },
  {
    title: 'Black Whale geography',
    description: 'Five passenger tiers, the Tier 1 royal zone, military and Justice Bureau access, and mafia-controlled lower-deck territory.',
    items: ['Tier 1 residences', 'Justice Bureau', 'Public tiers', 'Hidden passages'],
    source: wiki('Black_Whale'),
  },
  {
    title: 'Kakin mafia balance',
    description: 'Xi-Yu, Cha-R, and Heil-Ly sponsorship, territory, leadership, Nen users, and the conflict surrounding Hisoka and the Troupe.',
    items: ['Xi-Yu / Zhang Lei', 'Cha-R / Luzurus', 'Heil-Ly / Morena', 'Phantom Troupe collision'],
    source: wiki('Mafia_Community'),
  },
];

export const studyLayers = [
  {
    title: 'Chapter records',
    description: 'A chapter-by-chapter catalogue designed to hold plot summaries, appearances, confrontations, locations, publication data, chapter art, adaptation links, and translation notes.',
    items: ['Plot summary', 'Character appearances', 'Battles and locations', 'Release and volume metadata', 'Adaptation and translation notes'],
    source: wiki('List_of_Volumes_and_Chapters'),
  },
  {
    title: 'Factions and institutions',
    description: 'Organizations whose rules and internal hierarchies drive the story.',
    items: ['Hunter Association', 'Zodiacs', 'Zoldyck Family', 'Phantom Troupe', 'Kakin Empire', 'V5 and V6', 'Beyond expedition team', 'Xi-Yu, Cha-R, and Heil-Ly'],
    source: wiki('Category:Organizations'),
  },
  {
    title: 'Location atlas',
    description: 'The route of the story, from Gon’s home to the expedition beyond the known world.',
    items: ['Whale Island', 'Dolle Harbor', 'Kukuroo Mountain', 'Heavens Arena', 'Yorknew City', 'Greed Island', 'NGL', 'East Gorteau', 'Black Whale', 'Dark Continent'],
    source: wiki('Category:Locations'),
  },
  {
    title: 'Objects, games, and technology',
    description: 'Physical systems and artifacts that carry rules, power, history, or political leverage.',
    items: ['Hunter License', 'Scarlet Eyes', 'Greed Island cards', 'JoyStation console', 'Poor Man’s Rose', 'Seed Urn', 'Black Whale systems', 'Kakin military equipment'],
    source: wiki('Category:Items'),
  },
  {
    title: 'Battles and confrontations',
    description: 'A broader conflict index that includes more than formal fights.',
    items: ['Formal battles', 'Assassinations', 'Negotiations', 'Hostage exchanges', 'Mind games', 'Nen lessons as conflict'],
    source: wiki('Category:Battles'),
  },
  {
    title: 'Timeline',
    description: 'Dates and event order across arcs, with day-by-day tracking where the story becomes especially dense.',
    items: ['In-universe dates', 'Yorknew calendar', 'Greed Island dates', 'Chimera Ant invasion sequence', 'Election rounds', 'Black Whale voyage days'],
    source: wiki('Timeline'),
  },
  {
    title: 'Adaptation comparison',
    description: 'Cross-references for how the manga, 1999 anime, 2011 anime, OVAs, and films organize or alter material.',
    items: ['Manga chapters', '1999 episodes', '2011 episodes', 'OVAs', 'Films', 'Omissions and rearrangements'],
    source: wiki('Hunter_%C3%97_Hunter'),
  },
  {
    title: 'Themes and analysis',
    description: 'Study prompts that connect mechanics to the series’ larger ideas without treating interpretation as canon fact.',
    items: ['Identity and inheritance', 'Friendship and dependency', 'Revenge and self-erasure', 'Humanity and monstrosity', 'Institutions and legitimacy', 'Games, contracts, and risk'],
    source: wiki('Story_Arcs'),
  },
  {
    title: 'Source and data quality',
    description: 'A maintenance layer for separating verified records, provisional current-arc details, interpretation, and unresolved information.',
    items: ['Fandom source link', 'Verification state', 'Spoiler-sensitive labels', 'Unresolved status', 'Last-reviewed notes'],
    source: wiki('Hunterpedia:Policies_and_Guidelines'),
  },
  {
    title: 'Search and study tools',
    description: 'Reader utilities that should work across chapters, characters, abilities, factions, rooms, objects, and timeline events.',
    items: ['Global search', 'Entity filters', 'Shareable URLs', 'Spoiler controls', 'Bookmarks and notes', 'Studied progress', 'Recently viewed records'],
    source: wiki('Hunterpedia:Community_Portal'),
  },
  {
    title: 'Technical model',
    description: 'The site content is organized toward stable entity IDs, centralized statuses, shared source records, validation, and link/image checks.',
    items: ['Stable IDs', 'Central character status', 'Relationship records', 'Schema validation', 'Duplicate detection', 'Broken-link checks', 'Last-updated changelog'],
    source: wiki('Hunterpedia:Manual_of_Style'),
  },
];
