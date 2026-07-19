const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const item = (name, slug = name.replaceAll(' ', '_'), note = '') => ({ name, note, source: wiki(slug) });
const names = (values) => values.map((name) => item(name));

export const hunterpediaMasterSources = [
  item('List of Volumes and Chapters', 'List_of_Volumes_and_Chapters', 'Numbered manga catalogue, volumes, release data, and chapter links.'),
  item('Story Arcs', 'Story_Arcs', 'The seven official manga story arcs and their chapter spans.'),
  item('Timeline', 'Timeline', 'In-universe chronology with uncertainty, retcon, and dubious-canonicity markings.'),
  item('List of Hunter × Hunter Characters', 'List_of_Hunter_%C3%97_Hunter_Characters', 'Grouped Chapters 1–339 directory.'),
  item('Characters: Chapters 340-current', 'List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current', 'Current-arc character directory.'),
  item('Characters A–Z', 'List_of_Hunter_%C3%97_Hunter_Characters/A-Z', 'Every canon character appearing or mentioned, including Volume 0.'),
  item('World of Hunter × Hunter', 'World_of_Hunter_%C3%97_Hunter', 'Geography, organisms, resources, underworld, peoples, languages, currencies, and calendars.'),
  item('Nen', 'Nen', 'Aura, techniques, affinities, ability subtypes, limitations, quantification, and training.'),
];

export const timelineIndex = [
  { era: 'Prehistory', precision: 'Mixed / uncertain', topics: ['Ancient Dark Continent exploration', 'Human migration into the Known World', 'Kakin royal ritual history', 'Hunter Association prehistory'], source: wiki('Timeline#Prehistory') },
  { era: 'January 1999', precision: 'Dated story chronology', topics: ['Gon leaves Whale Island', '287th Hunter Exam', 'Main quartet forms', 'Kukuroo Mountain rescue'], source: wiki('Timeline#Hunter_Exam_arc') },
  { era: 'Heavens Arena period', precision: 'Relative chronology', topics: ['Floor progression', 'Nen initiation', 'Training deadlines', 'Gon versus Hisoka'], source: wiki('Timeline#Heavens_Arena_arc') },
  { era: 'Yorknew City period', precision: 'September calendar', topics: ['Underground Auction', 'Phantom Troupe attack', 'Kurapika operations', 'Hostage exchange'], source: wiki('Timeline#Yorknew_City_arc') },
  { era: 'Greed Island period', precision: 'Relative game chronology', topics: ['Game entry', 'Biscuit training', 'Razor game', 'Bomber plan', 'Completion'], source: wiki('Timeline#Greed_Island_arc') },
  { era: 'Chimera Ant period', precision: 'Mixed; minute-level at invasion', topics: ['NGL outbreak', 'King’s birth', 'East Gorteau takeover', 'Palace invasion', 'Rose aftermath'], source: wiki('Timeline#Chimera_Ant_arc') },
  { era: 'Chairman Election period', precision: 'Procedural chronology', topics: ['Election rounds', 'Alluka retrieval', 'Illumi pursuit', 'Gon recovery'], source: wiki('Timeline#13th_Hunter_Chairman_Election_arc') },
  { era: 'August 10, 2000', precision: 'Dated', topics: ['Succession-era prelude'], source: wiki('Timeline#August_10th,_2000') },
  { era: 'Aug. 11, 2000–early June 2001', precision: 'Date range', topics: ['Dark Continent and Kakin expedition preparation'], source: wiki('Timeline#Succession_Contest_arc') },
  { era: 'Around June 4, 2001', precision: 'Approximate date', topics: ['Expedition and Association developments'], source: wiki('Timeline#Around_June_4th,_2001') },
  { era: 'July 4, 2001', precision: 'Dated', topics: ['Kakin and Hunter Association preparations'], source: wiki('Timeline#July_4th,_2001') },
  { era: 'July 4–August 7, 2001', precision: 'Date range', topics: ['Succession preparation, recruitment, and boarding'], source: wiki('Timeline#Between_July_4th_and_August_7th,_2001') },
  { era: 'August 7, 2001', precision: 'Dated', topics: ['Final pre-departure events'], source: wiki('Timeline#August_7th,_2001_(Sat)') },
  ...Array.from({ length: 12 }, (_, index) => ({
    era: `Voyage Day ${index + 1} · August ${index + 8}, 2001`,
    precision: 'Dated voyage chronology',
    topics: index === 0 ? ['Black Whale departure', 'Active Succession Contest begins'] : index === 11 ? ['Chapter 411–413 period', 'Nen lessons, funeral route, and special-martial-law countdown'] : ['Parallel royal, guard, mafia, Justice, and Troupe events'],
    source: wiki(`Timeline#August_${index + 8}th,_2001`),
  })),
];

export const worldIndexSections = [
  {
    id: 'known-world', title: 'Known World geography', description: 'Continents, countries, cities, structures, islands, routes, and uncertain placements listed by Hunterpedia.',
    groups: [
      { name: 'Yorbian Continent · Saherta and Yorknew', items: names(['Yorbian Continent', 'United States of Saherta', 'Yorknew City', 'Bull Market', 'Cemetery Building', 'Hotel Beitacle', 'Hotel Bayloke', 'Dayroad Park', 'Castor Line', 'Lipa Station', 'Saloma Mall', 'Tarsetol Station', 'Continental Street', 'Motoba Building', 'Lingon Airport', 'Preview Market', 'Southernpiece Auction House', 'Gordeau Desert']) },
      { name: 'Balsa Islands · Mitene Union', items: names(['Balsa Islands', 'Mitene Union', 'NGL', 'NGL Border Stop', 'D² Manufacturing Plant', 'Chimera Ant Nest', 'Republic of Rokario', 'Ininge City', 'Miera Mountains', 'Pata City', 'Quen City', 'Doli City', 'Aguilor', 'Tri-Orb Hotel', 'Setl City', 'Quant City', 'Roto Mountains', 'Bilgai Desert', 'Republic of Hass', 'Republic of West Gorteau', 'Republic of East Gorteau', 'Peijin', 'Royal Palace of East Gorteau', 'Luonton City', 'Mandai City', 'Taba City', 'Underground Clinic', 'Underground Lake']) },
      { name: 'Azian Continent and Greed Island', items: names(['Azian Continent', 'Kakin Empire', 'Hoihoi Hotel', 'Greed Island', 'Masadora', 'Spell Card Shop', 'Soufrabi', 'Aiai', 'Antokiba', 'Wig & Pen', 'Caveau de Riquewihr', 'Rubicuta', 'Dorias', 'Limeiro', 'G.I. Port', 'G.I. Badlands', 'G.I. Starting Point', 'Village of the Bandits from the Mountains', 'Bunzen', 'Trade Shops']) },
      { name: 'Unnamed continents and states', items: names(['Federation of Ochima', 'Begerossé Union', "Kukan'yu Kingdom", 'Dolle Harbor', 'Lone Pine Tree', 'Zaban City', 'Tsubashi Street', 'Milsy Wetlands', 'Visca Forest Preserve', 'Split Mountain', 'Raoul Mountain', 'Trick Tower', 'Zevil Island', 'Beeskafmarro', 'Diksakura', 'Jappon', 'Republic of Padokea', 'Kukuroo Mountain', 'Testing Gate', 'Parasta', 'Parasta Airport', 'Mimbo Republic', 'Heavens Arena', 'Swardani City']) },
      { name: 'Unplaced and uncertain locations', items: names(['Nebaska', 'Whale Island', 'Snakebeech Forest', 'Lurka Ruins', 'Congo Gold Vein', 'Meteor City', 'Kirimori Valley', 'Uga Forest', "Zazan's Palace", 'Lukso Province', 'Nancha City', "Nostrade's Mansion", 'Sengi Guild', 'Kotoritana Republic', 'Lapet Republic', 'Fānlīn Medical College', 'Varvard', 'Miwal University', 'Egypersia', 'Yul', 'Yul National Treasury', 'Lubo', 'Midonite', 'Wollow Forest', 'Forest Ruins', 'Underground Ruins', "Zegin's Mansion"]) },
    ],
  },
  {
    id: 'outside-world', title: 'Outside World', description: 'The world outside Lake Mobius and the public staging destination for the expedition.',
    groups: [{ name: 'Outer geography', items: names(['Dark Continent', 'Lake Mobius', 'New Continent']) }],
  },
  {
    id: 'life', title: 'Fauna, flora & disease', description: 'Natural, magical, botanical, pathogenic, and Nen-created life indexed by the world page and Bestiary.',
    groups: [
      { name: 'Animals and threats', items: names(['Ai', 'Albino Ponytail Cat', 'Camp Tiger', 'Deodorosaurus', 'Eight-legged dog', 'Fisher Bird', 'Foxbear', 'Frog-In-Waiting', 'Great Stamp', 'Hellbell', 'Hemotropic Butterfly', 'Hypnosis Butterfly', 'Man-faced Ape', 'Master of the Swamp', 'Noggin Lugging Tortoise', 'Pap', 'Piko', 'Ruse Raven', 'Sea Fireflies', 'Six-legged Flying Beast', 'Small-billed Swan', 'Speckled Squirrel', 'Spider Eagle', 'Spotted Leeches', 'Two-headed Wolf', 'World Tree Birds']) },
      { name: 'Magical beasts', items: names(['Chimera Ants', 'Kiriko', 'Flying Lizard', 'Mandragora', 'Strange Chicken']) },
      { name: 'Plants, fungi, and resources', items: names(['Bira', 'Brion', 'Claymore Mushroom', 'Herb for All-illnesses', 'Metallion', 'Nitro Rice', 'World Trees', 'Unmanned Rock', 'Trinity Elixir']) },
      { name: 'Disease and artificial creatures', items: names(['Zobae Disease', 'Bubble Horse', 'Cyclops', 'Hyper Puffball', 'King White Stag Beetle', 'Melanin Lizard', 'Owl NPC', 'Radio Rat', 'Unnamed One-eyed Monster', 'Unnamed Slime Monster', 'Unnamed Worm Monster', 'Wolf Pack']) },
    ],
  },
  {
    id: 'underworld', title: 'Underworld', description: 'Criminal organizations, drugs, and organized events.',
    groups: [
      { name: 'Organizations', items: names(['Mafia Community', 'Ten Dons', 'Shadow Beasts', 'Ritz Family', 'Nostrade Family', 'Cha-R Family', 'Heil-Ly Family', 'Xi-Yu Family', 'Buor Family', 'Phantom Troupe', 'Kute Gang of Thieves', 'Freelance Assassins', 'Zoldyck Family']) },
      { name: 'Drugs and events', items: names(['D²', 'Clean Leaf', 'Underground Auction']) },
    ],
  },
  {
    id: 'culture', title: 'Peoples, languages & systems', description: 'Ethnic groups, scripts, currencies, and calendar systems recorded by Hunterpedia.',
    groups: [
      { name: 'Ethnicities', items: names(['Aiboni Clan', 'Gyudondond Tribe', 'Kurta Clan', 'Miha Clan', 'Sumi', 'Unicorn Tribe']) },
      { name: 'Languages and scripts', items: names(['Hunter × Hunter Alphabet', 'Gelman', 'Jannan', 'Ancient Kappe', 'Nankul', 'Inscription', 'Divine Script']) },
      { name: 'Currencies and calendars', items: names(['Jenny', 'Pail', 'Main calendar', 'Kakin Empire calendar']) },
    ],
  },
];

export const nenTaxonomy = [
  { title: 'Aura foundations', items: names(['Nen and Aura', 'Aura Nodes and Awakening', 'Aura Nodes', 'Learning Nen and Initiation', 'Methods of Acquiring Nen', 'Geniuses']) },
  { title: 'Four Major Principles', items: names(['Ten', 'Zetsu', 'Ren', 'Hatsu', 'Nen Ability']) },
  { title: 'Advanced techniques', items: names(['Gyo', 'In', 'En', 'Shu', 'Ko', 'Ken', 'Ryu']) },
  { title: 'Individuality and testing', items: names(['Dual Affinities', 'Water Divination', "Hisoka's Personality Test", 'Telltale Signs', "Morena's Research"]) },
  { title: 'Aura types', items: names(['Enhancement', 'Transmutation', 'Emission', 'Conjuration', 'Manipulation', 'Specialization']) },
  { title: 'Ability subcategories', items: names(['Barrier Type', 'Collaborative Type', 'Compound Type', 'Counteractive Type', 'Curse', 'Diffusive Levy Type', 'Double', 'Exorcism', 'Haunting Type', 'Land Mine Type', 'Loan Type', 'Nen Beast', 'Parasitic Type', 'Supportive Type', 'Symbiotic Type']) },
  { title: 'Conditions, vows & risk', items: names(['Conditions', 'Activation Requirements', 'Other Conditions', 'Loopholes', 'Vows and Limitations', 'Risk']) },
  { title: 'Aura quantification', items: names(['Quantification of Aura', 'Enhancement and Limitations', 'Level, Force, and Accuracy', 'Aura Power']) },
  { title: 'Training', items: names(['Training Exercises', 'Hatsu Training', "Biscuit's Training", 'Gyo Training', 'Shu Training', 'Ken Training', 'Ryu Training', 'Ko Training', 'Nen Type Training', 'Ren Training', "Kurapika's Training", "Izunavi's Conjuration Training"]) },
];

export const hunterpediaMasterCounts = {
  timeline: timelineIndex.length,
  world: worldIndexSections.flatMap((section) => section.groups.flatMap((group) => group.items)).length,
  nen: nenTaxonomy.flatMap((section) => section.items).length,
};
