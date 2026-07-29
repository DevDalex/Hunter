// Maintained spectrum placements and ability profiles for the interactive Nen map.
// Placement ratios are based on the Togashi exhibition chart as translated and
// clarified by VoraciousDrake, cross-checked against Hunterpedia's exhibition page.
// The UI deliberately does not display source-status badges; these notes remain
// implementation metadata for future accuracy reviews.

export const nenCategoryOrder = [
  'category:enhancement',
  'category:transmutation',
  'category:conjuration',
  'category:specialization',
  'category:manipulation',
  'category:emission',
];

export const categoryMeta = {
  'category:enhancement': {
    name: 'Enhancement', code: 'En', mark: '強', cx: 1040, cy: 250,
    water: 'Water volume changes',
    summary: 'Strengthen the body, aura, objects, or an existing quality.',
  },
  'category:transmutation': {
    name: 'Transmutation', code: 'Tr', mark: '変', cx: 1320, cy: 420,
    water: 'Water taste changes',
    summary: 'Give aura the properties of another substance or phenomenon.',
  },
  'category:conjuration': {
    name: 'Conjuration', code: 'Co', mark: '具', cx: 1320, cy: 700,
    water: 'Impurities appear',
    summary: 'Materialize an object, structure, creature, or rule-bearing construct.',
  },
  'category:specialization': {
    name: 'Specialization', code: 'Sp', mark: '特', cx: 1040, cy: 870,
    water: 'A unique change occurs',
    summary: 'Produce an exceptional effect outside the regular five categories.',
  },
  'category:manipulation': {
    name: 'Manipulation', code: 'Ma', mark: '操', cx: 760, cy: 700,
    water: 'The leaf moves',
    summary: 'Control a person, object, creature, substance, or process.',
  },
  'category:emission': {
    name: 'Emission', code: 'Em', mark: '放', cx: 760, cy: 420,
    water: 'Water color changes',
    summary: 'Separate aura from the body while retaining its force or function.',
  },
};

// Idle examples stay visible at all times. More pure-type users are revealed when
// their category is pinned.
export const primaryCategoryUsers = {
  'category:enhancement': [
    { name: 'Gon Freecss', ability: 'Jajanken', x: 840, y: 26 },
    { name: 'Uvogin', ability: 'Big Bang Impact', x: 1050, y: 26 },
  ],
  'category:transmutation': [
    { name: 'Hisoka Morow', ability: 'Bungee Gum', x: 1418, y: 350 },
  ],
  'category:conjuration': [
    { name: 'Shizuku Murasaki', ability: 'Blinky', x: 1418, y: 718 },
  ],
  'category:specialization': [
    { name: 'Chrollo Lucilfer', ability: 'Skill Hunter', x: 840, y: 982 },
    { name: 'Neon Nostrade', ability: 'Lovely Ghostwriter', x: 1050, y: 982 },
  ],
  'category:manipulation': [
    { name: 'Illumi Zoldyck', ability: 'Needle People', x: 498, y: 690 },
  ],
  'category:emission': [
    { name: 'Razor', ability: '14 Devils', x: 498, y: 390 },
  ],
};

export const secondaryPureUsers = {
  'category:enhancement': [
    { name: 'Isaac Netero', ability: '100-Type Guanyin Bodhisattva' },
    { name: 'Komugi', ability: 'Gungi talent' },
  ],
  'category:transmutation': [
    { name: 'Biscuit Krueger', ability: 'Magical Esthetician' },
    { name: 'Menthuthuyoupi', ability: 'Rage Blast' },
  ],
  'category:conjuration': [
    { name: 'Genthru', ability: 'Countdown' },
    { name: 'Knuckle Bine', ability: 'Hakoware' },
    { name: 'Abengane', ability: 'Nen Exorcism' },
  ],
  'category:specialization': [
    { name: 'Pakunoda', ability: 'Memory Bomb' },
    { name: 'Neferpitou', ability: 'Doctor Blythe' },
    { name: 'Alluka Zoldyck', ability: 'Wish-granting system' },
  ],
  'category:manipulation': [
    { name: 'Morel Mackernasey', ability: 'Deep Purple' },
    { name: 'Shaiapouf', ability: 'Beelzebub' },
  ],
  'category:emission': [
    { name: 'Zeno Zoldyck', ability: 'Dragon Dive' },
    { name: 'Silva Zoldyck', ability: 'Explosive Orbs' },
    { name: 'Knov', ability: 'Hide and Seek' },
    { name: 'Meruem', ability: 'Aura Synthesis' },
  ],
};

// t is the interpolation ratio from `from` to `to` on the six-type spectrum.
// lane offsets coincident placements so every marker remains selectable.
export const spectrumPlacements = [
  { id: 'ikalgo', name: 'Ikalgo', natural: 'Enhancement', from: 'category:emission', to: 'category:enhancement', t: .90, lane: -2 },
  { id: 'gotoh', name: 'Gotoh', natural: 'Enhancement', from: 'category:emission', to: 'category:enhancement', t: .70, lane: -1 },
  { id: 'franklin', name: 'Franklin Bordeau', natural: 'Emission', from: 'category:emission', to: 'category:enhancement', t: .50, lane: 0, ability: 'Double Machine Gun' },
  { id: 'leorio', name: 'Leorio Paradinight', natural: 'Emission', from: 'category:emission', to: 'category:enhancement', t: .40, lane: 1, ability: 'Remote Punch' },

  { id: 'palm', name: 'Palm Siberia', natural: 'Enhancement', from: 'category:enhancement', to: 'category:transmutation', t: .20, lane: -2, ability: 'Black Widow' },
  { id: 'nobunaga', name: 'Nobunaga Hazama', natural: 'Enhancement', from: 'category:enhancement', to: 'category:transmutation', t: .30, lane: -1 },
  { id: 'killua', name: 'Killua Zoldyck', natural: 'Transmutation', from: 'category:enhancement', to: 'category:transmutation', t: .50, lane: 0, ability: 'Godspeed' },
  { id: 'machi', name: 'Machi Komacine', natural: 'Transmutation', from: 'category:enhancement', to: 'category:transmutation', t: .50, lane: 1, ability: 'Nen Threads' },

  { id: 'hanzo', name: 'Hanzo', natural: 'Transmutation', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: -1 },
  { id: 'kite', name: 'Kite', natural: 'Conjuration', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: 0, ability: 'Crazy Slots' },
  { id: 'tsubone', name: 'Tsubone', natural: 'Conjuration', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: 1, ability: 'Rider’s High' },

  { id: 'kurapika', name: 'Kurapika', natural: 'Conjuration', from: 'category:conjuration', to: 'category:specialization', t: .50, lane: 0, ability: 'Chain abilities / Emperor Time' },
  { id: 'milluki', name: 'Milluki Zoldyck', natural: 'Manipulation', from: 'category:specialization', to: 'category:manipulation', t: .80, lane: 0 },

  { id: 'pokkle', name: 'Pokkle', natural: 'Emission', from: 'category:manipulation', to: 'category:emission', t: .80, lane: -2, ability: 'Rainbow' },
  { id: 'melody', name: 'Melody', natural: 'Emission', from: 'category:manipulation', to: 'category:emission', t: .50, lane: -1, ability: 'Music-based Nen' },
  { id: 'kalluto', name: 'Kalluto Zoldyck', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .40, lane: 0, ability: 'Dance of the Serpent’s Bite' },
  { id: 'shalnark', name: 'Shalnark', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .20, lane: 1, ability: 'Black Voice' },
  { id: 'ponzu', name: 'Ponzu', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .10, lane: 2 },
];

export const namedAbilityProfiles = [
  {
    id: 'jajanken', user: 'Gon Freecss', name: 'Jajanken', naturalCategory: 'category:enhancement',
    supportingCategories: ['category:transmutation', 'category:emission'],
    activation: 'Gon concentrates aura and commits to Rock, Scissors, or Paper.',
    cost: 'Charge time, visible preparation, and substantial aura use.',
    effect: 'Rock enhances a punch; Scissors shapes aura; Paper releases aura.',
  },
  {
    id: 'big-bang-impact', user: 'Uvogin', name: 'Big Bang Impact', naturalCategory: 'category:enhancement', supportingCategories: [],
    activation: 'Aura is concentrated into a straight right punch.', cost: 'Close range and concentrated commitment to one strike.', effect: 'Greatly amplifies the destructive force of the punch.',
  },
  {
    id: 'guanyin', user: 'Isaac Netero', name: '100-Type Guanyin Bodhisattva', naturalCategory: 'category:enhancement', supportingCategories: [],
    activation: 'A prayer motion precedes each selected hand technique.', cost: 'Depends on extraordinary speed, rhythm, training, and aura reserves.', effect: 'A giant aura construct delivers selected palm attacks.',
  },
  {
    id: 'godspeed', user: 'Killua Zoldyck', name: 'Godspeed', naturalCategory: 'category:transmutation', supportingCategories: ['category:enhancement'],
    activation: 'Killua stores electricity and transmutes aura into electrical signals.', cost: 'Finite stored charge and intense physical conditioning.', effect: 'Automates reactions and accelerates movement through electrical aura.',
  },
  {
    id: 'bungee-gum', user: 'Hisoka Morow', name: 'Bungee Gum', naturalCategory: 'category:transmutation', supportingCategories: [],
    activation: 'Hisoka attaches elastic, adhesive aura to a chosen surface or target.', cost: 'Practical range, attachment geometry, and Hisoka’s control limit its use.', effect: 'Aura behaves with properties associated with rubber and gum.',
  },
  {
    id: 'nen-threads', user: 'Machi Komacine', name: 'Nen Threads', naturalCategory: 'category:transmutation', supportingCategories: [],
    activation: 'Machi forms aura into thread and attaches it by hand.', cost: 'Strength and effective length trade off against one another.', effect: 'Threads bind, track, manipulate, and reconnect tissue.',
  },
  {
    id: 'countdown', user: 'Genthru', name: 'Countdown', naturalCategory: 'category:conjuration', supportingCategories: ['category:emission', 'category:manipulation'],
    activation: 'Genthru touches a target, names the ability, and explains its conditions.', cost: 'Strict disclosure and release conditions; Little Flower is needed for direct defense.', effect: 'A conjured bomb and timer attach to the victim.',
  },
  {
    id: 'blinky', user: 'Shizuku Murasaki', name: 'Blinky', naturalCategory: 'category:conjuration', supportingCategories: [],
    activation: 'Shizuku summons Blinky and orders it to vacuum a valid target.', cost: 'Cannot vacuum living things or objects Shizuku considers living.', effect: 'A conjured vacuum consumes nonliving material and can return the last item.',
  },
  {
    id: 'kurapika-chains', user: 'Kurapika', name: 'Chain abilities / Emperor Time', naturalCategory: 'category:conjuration', supportingCategories: ['category:specialization'],
    activation: 'Scarlet Eyes activate Emperor Time; individual chains have separate rules.', cost: 'Severe restrictions, including Chain Jail’s target limitation and Emperor Time’s lifespan cost.', effect: 'Conjured chains perform capture, healing, judgment, dowsing, and ability-stealing functions.',
  },
  {
    id: 'needle-people', user: 'Illumi Zoldyck', name: 'Needle People', naturalCategory: 'category:manipulation', supportingCategories: [],
    activation: 'Special needles are inserted into targets.', cost: 'Requires prepared needles and physical access to implant them.', effect: 'Transforms and controls people as disposable agents.',
  },
  {
    id: 'black-voice', user: 'Shalnark', name: 'Black Voice', naturalCategory: 'category:manipulation', supportingCategories: ['category:emission'],
    activation: 'An antenna is inserted and commands are issued through a phone.', cost: 'Limited antennas; losing the phone or antenna breaks practical control.', effect: 'Controls a target remotely or activates Autopilot on Shalnark.',
  },
  {
    id: 'deep-purple', user: 'Morel Mackernasey', name: 'Deep Purple', naturalCategory: 'category:manipulation', supportingCategories: [],
    activation: 'Morel produces smoke and inserts aura cores with programmed commands.', cost: 'Pipe access, smoke quantity, aura allocation, and command complexity.', effect: 'Creates controllable smoke soldiers, disguises, barriers, and tools.',
  },
  {
    id: 'remote-punch', user: 'Leorio Paradinight', name: 'Remote Punch', naturalCategory: 'category:emission', supportingCategories: [],
    activation: 'Leorio strikes a surface and sends the force through an emitted path.', cost: 'Requires a mapped path and a target position within practical reach.', effect: 'Reproduces the punch at a distant point.',
  },
  {
    id: 'double-machine-gun', user: 'Franklin Bordeau', name: 'Double Machine Gun', naturalCategory: 'category:emission', supportingCategories: ['category:enhancement'],
    activation: 'Franklin opens his modified fingertips and fires repeated aura bullets.', cost: 'The severed fingertips function as a self-imposed commitment that improves output.', effect: 'Produces sustained rapid-fire emitted projectiles.',
  },
  {
    id: 'hide-and-seek', user: 'Knov', name: 'Hide and Seek', naturalCategory: 'category:emission', supportingCategories: [],
    activation: 'Knov creates portals tied to prepared entry and exit points.', cost: 'Requires prior placement and management of rooms and keys.', effect: 'Connects locations through a separate mansion-like Nen space.',
  },
  {
    id: 'skill-hunter', user: 'Chrollo Lucilfer', name: 'Skill Hunter', naturalCategory: 'category:specialization', supportingCategories: [],
    activation: 'Chrollo fulfills theft conditions and stores the ability in Bandit’s Secret.', cost: 'Multiple acquisition requirements and book-use restrictions.', effect: 'Steals and later deploys other people’s Nen abilities.',
  },
  {
    id: 'lovely-ghostwriter', user: 'Neon Nostrade', name: 'Lovely Ghostwriter', naturalCategory: 'category:specialization', supportingCategories: [],
    activation: 'Neon writes while unconscious after receiving identifying information.', cost: 'Cannot predict her own future and does not remember the writing process.', effect: 'Produces metaphorical fortunes covering the coming month.',
  },
  {
    id: 'memory-bomb', user: 'Pakunoda', name: 'Memory Bomb', naturalCategory: 'category:specialization', supportingCategories: [],
    activation: 'Pakunoda loads extracted memories into bullets and shoots selected people.', cost: 'Requires memory access and physical firing; use can carry lethal consequences.', effect: 'Transfers memories directly into recipients.',
  },
];

export const nenExpansionSources = {
  togashiChart: 'https://voraciousdrake.wordpress.com/2024/11/14/translation-and-clarification-of-the-nen-charts-from-the-togashi-exhibition/',
  hunterpediaExhibition: 'https://hunterxhunter.fandom.com/wiki/Exhibition:_Togashi_Yoshihiro_-Puzzle-',
  hunterpediaNen: 'https://hunterxhunter.fandom.com/wiki/Nen',
  communityGuide: 'https://www.hunterxnen.com/',
};
