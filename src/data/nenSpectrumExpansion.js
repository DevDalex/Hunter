// Maintained spectrum placements and ability profiles for the interactive Nen map.
// Placement ratios follow the Togashi exhibition chart as translated and clarified
// by VoraciousDrake, cross-checked against Hunterpedia and HunterxNen.
//
// Natural category and ability-category composition are deliberately separate.
// A user's chart placement does not by itself prove every category used by an ability.

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

// Idle examples stay visible at all times.
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

// Exactly three secondary pure-type examples are revealed for every pinned category.
export const secondaryPureUsers = {
  'category:enhancement': [
    { name: 'Isaac Netero', ability: '100-Type Guanyin Bodhisattva' },
    { name: 'Phinks Magcub', ability: 'Ripper Cyclotron' },
    { name: 'Komugi', ability: 'Gungi aptitude' },
  ],
  'category:transmutation': [
    { name: 'Biscuit Krueger', ability: 'Magical Esthetician' },
    { name: 'Menthuthuyoupi', ability: 'Rage Blast' },
    { name: 'Feitan Portor', ability: 'Pain Packer' },
  ],
  'category:conjuration': [
    { name: 'Genthru', ability: 'Countdown' },
    { name: 'Knuckle Bine', ability: 'Hakoware' },
    { name: 'Abengane', ability: 'Nen Exorcism' },
  ],
  'category:specialization': [
    { name: 'Pakunoda', ability: 'Memory Bomb' },
    { name: 'Neferpitou', ability: 'Doctor Blythe' },
    { name: 'Alluka Zoldyck', ability: 'Requests and wishes' },
  ],
  'category:manipulation': [
    { name: 'Morel Mackernasey', ability: 'Deep Purple' },
    { name: 'Shaiapouf', ability: 'Beelzebub' },
    { name: 'Shoot McMahon', ability: 'Hotel Rafflesia' },
  ],
  'category:emission': [
    { name: 'Zeno Zoldyck', ability: 'Dragon Dive' },
    { name: 'Knov', ability: 'Hide and Seek' },
    { name: 'Meruem', ability: 'Aura Synthesis' },
  ],
};

// t is the interpolation ratio from `from` to `to` on the six-type spectrum.
// Ordering is intentional: each category focus reveals its strongest documented
// examples before the six-user cap is reached.
export const spectrumPlacements = [
  { id: 'franklin', name: 'Franklin Bordeau', natural: 'Emission', from: 'category:emission', to: 'category:enhancement', t: .50, lane: 0, ability: 'Double Machine Gun' },
  { id: 'leorio', name: 'Leorio Paradinight', natural: 'Emission', from: 'category:emission', to: 'category:enhancement', t: .40, lane: 1, ability: 'Remote Punch' },
  { id: 'ikalgo', name: 'Ikalgo', natural: 'Enhancement', from: 'category:emission', to: 'category:enhancement', t: .90, lane: -2 },
  { id: 'gotoh', name: 'Gotoh', natural: 'Enhancement', from: 'category:emission', to: 'category:enhancement', t: .70, lane: -1 },

  { id: 'killua', name: 'Killua Zoldyck', natural: 'Transmutation', from: 'category:enhancement', to: 'category:transmutation', t: .50, lane: 0, ability: 'Godspeed' },
  { id: 'machi', name: 'Machi Komacine', natural: 'Transmutation', from: 'category:enhancement', to: 'category:transmutation', t: .50, lane: 1, ability: 'Nen Threads' },
  { id: 'palm', name: 'Palm Siberia', natural: 'Enhancement', from: 'category:enhancement', to: 'category:transmutation', t: .20, lane: -2, ability: 'Black Widow' },
  { id: 'nobunaga', name: 'Nobunaga Hazama', natural: 'Enhancement', from: 'category:enhancement', to: 'category:transmutation', t: .30, lane: -1 },

  { id: 'kite', name: 'Kite', natural: 'Conjuration', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: 0, ability: 'Crazy Slots' },
  { id: 'tsubone', name: 'Tsubone', natural: 'Conjuration', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: 1, ability: 'Rider’s High' },
  { id: 'hanzo', name: 'Hanzo', natural: 'Transmutation', from: 'category:transmutation', to: 'category:conjuration', t: .50, lane: -1, ability: 'Hanzo Skill 4' },

  { id: 'kurapika', name: 'Kurapika', natural: 'Conjuration', from: 'category:conjuration', to: 'category:specialization', t: .50, lane: 0, ability: 'Chain abilities / Emperor Time' },
  { id: 'milluki', name: 'Milluki Zoldyck', natural: 'Manipulation', from: 'category:specialization', to: 'category:manipulation', t: .80, lane: 0 },

  { id: 'shalnark', name: 'Shalnark', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .20, lane: 1, ability: 'Black Voice' },
  { id: 'kalluto', name: 'Kalluto Zoldyck', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .40, lane: 0, ability: 'Dance of the Serpent’s Bite' },
  { id: 'melody', name: 'Melody', natural: 'Emission', from: 'category:manipulation', to: 'category:emission', t: .50, lane: -1, ability: 'Music-based Nen' },
  { id: 'pokkle', name: 'Pokkle', natural: 'Emission', from: 'category:manipulation', to: 'category:emission', t: .80, lane: -2, ability: 'Rainbow' },
  { id: 'ponzu', name: 'Ponzu', natural: 'Manipulation', from: 'category:manipulation', to: 'category:emission', t: .10, lane: 2 },
];

const profile = ({
  id,
  user,
  name,
  naturalCategory,
  supportingCategories = [],
  activation,
  cost,
  effect,
  abilityKind = 'named',
  categoryUse = 'confirmed',
}) => ({
  id,
  user,
  name,
  naturalCategory,
  supportingCategories,
  activation,
  cost,
  effect,
  abilityKind,
  categoryUse,
});

export const namedAbilityProfiles = [
  // Enhancement first. This order also keeps category-focus rails deterministic.
  profile({
    id: 'jajanken', user: 'Gon Freecss', name: 'Jajanken', naturalCategory: 'category:enhancement',
    supportingCategories: ['category:transmutation', 'category:emission'],
    activation: 'Gon concentrates aura and commits to Rock, Scissors, or Paper.',
    cost: 'Charge time, visible preparation, and substantial aura use.',
    effect: 'Rock enhances a punch; Scissors shapes aura; Paper releases aura.',
  }),
  profile({
    id: 'big-bang-impact', user: 'Uvogin', name: 'Big Bang Impact', naturalCategory: 'category:enhancement',
    activation: 'Aura is concentrated into a straight right punch.',
    cost: 'Close range and concentrated commitment to one strike.',
    effect: 'Greatly amplifies the destructive force of the punch.',
  }),
  profile({
    id: 'guanyin', user: 'Isaac Netero', name: '100-Type Guanyin Bodhisattva', naturalCategory: 'category:enhancement',
    supportingCategories: ['category:manipulation', 'category:emission'],
    activation: 'A prayer motion precedes each selected hand technique.',
    cost: 'Depends on extraordinary speed, rhythm, training, and aura reserves.',
    effect: 'A giant aura construct delivers selected palm attacks.',
    categoryUse: 'community-attributed',
  }),
  profile({
    id: 'ripper-cyclotron', user: 'Phinks Magcub', name: 'Ripper Cyclotron', naturalCategory: 'category:enhancement',
    activation: 'Phinks rotates his arm before striking.',
    cost: 'The attack requires visible winding and uninterrupted preparation.',
    effect: 'Each completed rotation increases the power concentrated into the punch.',
  }),
  profile({
    id: 'gungi-aptitude', user: 'Komugi', name: 'Gungi aptitude', naturalCategory: 'category:enhancement',
    activation: 'Komugi enters extreme concentration while playing Gungi.',
    cost: 'The awakened talent is tied to Gungi rather than a general combat technique.',
    effect: 'Continuously refines her pattern recognition and competitive Gungi performance.',
    abilityKind: 'aptitude',
    categoryUse: 'natural-type-only',
  }),

  // Transmutation.
  profile({
    id: 'godspeed', user: 'Killua Zoldyck', name: 'Godspeed', naturalCategory: 'category:transmutation',
    supportingCategories: ['category:enhancement'],
    activation: 'Killua stores electricity and transmutes aura into electrical signals.',
    cost: 'Finite stored charge and intense physical conditioning.',
    effect: 'Automates reactions and accelerates movement through electrical aura.',
  }),
  profile({
    id: 'bungee-gum', user: 'Hisoka Morow', name: 'Bungee Gum', naturalCategory: 'category:transmutation',
    activation: 'Hisoka attaches elastic, adhesive aura to a chosen surface or target.',
    cost: 'Practical range, attachment geometry, and Hisoka’s control limit its use.',
    effect: 'Aura behaves with properties associated with rubber and gum.',
  }),
  profile({
    id: 'nen-threads', user: 'Machi Komacine', name: 'Nen Threads', naturalCategory: 'category:transmutation',
    activation: 'Machi forms aura into thread and attaches it by hand.',
    cost: 'Strength and effective length trade off against one another.',
    effect: 'Threads bind, track, manipulate, and reconnect tissue.',
  }),
  profile({
    id: 'magical-esthetician', user: 'Biscuit Krueger', name: 'Magical Esthetician', naturalCategory: 'category:transmutation',
    supportingCategories: ['category:manipulation'],
    activation: 'Biscuit summons Cookie and directs a selected massage or treatment.',
    cost: 'Treatment requires time, contact, and Cookie’s continued operation.',
    effect: 'Transmuted lotion and massage relieve fatigue and accelerate recovery.',
  }),
  profile({
    id: 'rage-blast', user: 'Menthuthuyoupi', name: 'Rage Blast', naturalCategory: 'category:transmutation',
    supportingCategories: ['category:emission'],
    activation: 'Youpi converts accumulated rage and aura into an explosive release.',
    cost: 'Consumes the stored rage and aura committed to the blast.',
    effect: 'Produces a large destructive explosion around or ahead of the user.',
  }),
  profile({
    id: 'pain-packer', user: 'Feitan Portor', name: 'Pain Packer', naturalCategory: 'category:transmutation',
    activation: 'Feitan converts received pain and injury into a counteractive response.',
    cost: 'Requires Feitan to suffer damage before the retaliation scales.',
    effect: 'Creates a punishment whose form and intensity reflect the damage received.',
    categoryUse: 'natural-type-only',
  }),

  // Emission is placed before multi-category Conjuration records so its focus rail
  // is not consumed by absent supporting-category users.
  profile({
    id: 'fourteen-devils', user: 'Razor', name: '14 Devils', naturalCategory: 'category:emission',
    supportingCategories: ['category:manipulation'],
    activation: 'Razor emits numbered aura constructs and assigns them positions or actions.',
    cost: 'Aura is divided among the devils; merging them concentrates their strength.',
    effect: 'Creates controllable emitted teammates that can combine and relay attacks.',
  }),
  profile({
    id: 'remote-punch', user: 'Leorio Paradinight', name: 'Remote Punch', naturalCategory: 'category:emission',
    activation: 'Leorio strikes a surface and sends the force through an emitted path.',
    cost: 'Requires a mapped path and a target position within practical reach.',
    effect: 'Reproduces the punch at a distant point.',
  }),
  profile({
    id: 'double-machine-gun', user: 'Franklin Bordeau', name: 'Double Machine Gun', naturalCategory: 'category:emission',
    supportingCategories: ['category:enhancement'],
    activation: 'Franklin opens his modified fingertips and fires repeated aura bullets.',
    cost: 'The severed fingertips function as a self-imposed commitment that improves output.',
    effect: 'Produces sustained rapid-fire emitted projectiles.',
  }),
  profile({
    id: 'hide-and-seek', user: 'Knov', name: 'Hide and Seek', naturalCategory: 'category:emission',
    activation: 'Knov creates portals tied to prepared entry and exit points.',
    cost: 'Requires prior placement and management of rooms and keys.',
    effect: 'Connects locations through a separate mansion-like Nen space.',
  }),
  profile({
    id: 'dragon-dive', user: 'Zeno Zoldyck', name: 'Dragon Dive', naturalCategory: 'category:emission',
    supportingCategories: ['category:transmutation'],
    activation: 'Zeno forms a large aura dragon and breaks it into descending projectiles.',
    cost: 'Requires altitude, large-scale aura shaping, and broad area commitment.',
    effect: 'Rains hundreds of emitted aura fragments over a wide target area.',
  }),
  profile({
    id: 'aura-synthesis', user: 'Meruem', name: 'Aura Synthesis', naturalCategory: 'category:emission',
    activation: 'Meruem consumes another Nen user and assimilates aura and traits.',
    cost: 'Requires consuming part of another Nen user.',
    effect: 'Increases Meruem’s aura and can reproduce or transform absorbed abilities.',
    abilityKind: 'system',
    categoryUse: 'natural-type-only',
  }),
  profile({
    id: 'rainbow', user: 'Pokkle', name: 'Rainbow', naturalCategory: 'category:emission',
    activation: 'Pokkle forms an aura bow and selects a colored arrow.',
    cost: 'Each arrow is tied to a specific effect and must be aimed and released.',
    effect: 'Fires emitted aura arrows with color-dependent properties.',
  }),
  profile({
    id: 'music-based-nen', user: 'Melody', name: 'Music-based Nen', naturalCategory: 'category:emission',
    activation: 'Melody performs music and projects its effect through sound.',
    cost: 'Requires performance, an audible path, and sustained concentration.',
    effect: 'Carries emotional, calming, and restorative effects to listeners.',
    abilityKind: 'system',
    categoryUse: 'natural-type-only',
  }),

  // Manipulation.
  profile({
    id: 'needle-people', user: 'Illumi Zoldyck', name: 'Needle People', naturalCategory: 'category:manipulation',
    activation: 'Special needles are inserted into targets.',
    cost: 'Requires prepared needles and physical access to implant them.',
    effect: 'Transforms and controls people as disposable agents.',
  }),
  profile({
    id: 'black-voice', user: 'Shalnark', name: 'Black Voice', naturalCategory: 'category:manipulation',
    supportingCategories: ['category:emission'],
    activation: 'An antenna is inserted and commands are issued through a phone.',
    cost: 'Limited antennas; losing the phone or antenna breaks practical control.',
    effect: 'Controls a target remotely or activates Autopilot on Shalnark.',
  }),
  profile({
    id: 'deep-purple', user: 'Morel Mackernasey', name: 'Deep Purple', naturalCategory: 'category:manipulation',
    activation: 'Morel produces smoke and inserts aura cores with programmed commands.',
    cost: 'Pipe access, smoke quantity, aura allocation, and command complexity.',
    effect: 'Creates controllable smoke soldiers, disguises, barriers, and tools.',
  }),
  profile({
    id: 'beelzebub', user: 'Shaiapouf', name: 'Beelzebub', naturalCategory: 'category:manipulation',
    activation: 'Pouf divides his body into independently controlled cellular segments.',
    cost: 'Smaller divisions lose durability and sensory capacity; damage to cells carries back.',
    effect: 'Creates remote bodies for surveillance, escape, deception, and recombination.',
  }),
  profile({
    id: 'hotel-rafflesia', user: 'Shoot McMahon', name: 'Hotel Rafflesia', naturalCategory: 'category:manipulation',
    activation: 'Shoot strikes a target and transfers damaged body parts into the floating cage.',
    cost: 'Requires successful contact and progressive damage before complete capture.',
    effect: 'Removes struck parts from normal space and stores them within the cage.',
    categoryUse: 'natural-type-only',
  }),
  profile({
    id: 'serpents-bite', user: 'Kalluto Zoldyck', name: 'Dance of the Serpent’s Bite', naturalCategory: 'category:manipulation',
    activation: 'Kalluto controls paper fragments through a fan-led dance.',
    cost: 'Requires prepared paper, choreography, and maintained control.',
    effect: 'Directs cutting paper swarms around a chosen target.',
  }),

  // Conjuration.
  profile({
    id: 'blinky', user: 'Shizuku Murasaki', name: 'Blinky', naturalCategory: 'category:conjuration',
    activation: 'Shizuku summons Blinky and orders it to vacuum a valid target.',
    cost: 'Cannot vacuum living things or objects Shizuku considers living.',
    effect: 'A conjured vacuum consumes nonliving material and can return the last item.',
  }),
  profile({
    id: 'crazy-slots', user: 'Kite', name: 'Crazy Slots', naturalCategory: 'category:conjuration',
    activation: 'Kite summons Crazy Slots, which randomly selects one numbered weapon.',
    cost: 'The roll is random and the selected weapon must be used before another roll.',
    effect: 'Conjures one of several specialized weapons with different combat functions.',
  }),
  profile({
    id: 'riders-high', user: 'Tsubone', name: 'Rider’s High', naturalCategory: 'category:conjuration',
    activation: 'Tsubone transforms into a vehicle that another person must operate.',
    cost: 'Requires a rider and consumes the rider’s aura as fuel.',
    effect: 'Conjures vehicle forms for rapid transport.',
  }),
  profile({
    id: 'hakoware', user: 'Knuckle Bine', name: 'Hakoware', naturalCategory: 'category:conjuration',
    supportingCategories: ['category:emission', 'category:manipulation'],
    activation: 'Knuckle lands a strike that lends aura and attaches A.P.R. to the target.',
    cost: 'Knuckle must remain within range for interest to accrue; attacks initially lend rather than damage.',
    effect: 'Tracks aura debt and forces the target into Zetsu when debt exceeds available aura.',
  }),
  profile({
    id: 'nen-exorcism', user: 'Abengane', name: 'Nen Exorcism', naturalCategory: 'category:conjuration',
    activation: 'Abengane performs a fire ritual and conjures a beast that consumes imposed Nen.',
    cost: 'The resulting beast remains attached until the original curse is resolved.',
    effect: 'Transfers an exorcised curse into a conjured Nen beast.',
    categoryUse: 'natural-type-only',
  }),
  profile({
    id: 'countdown', user: 'Genthru', name: 'Countdown', naturalCategory: 'category:conjuration',
    supportingCategories: ['category:emission', 'category:manipulation'],
    activation: 'Genthru touches a target, names the ability, and explains its conditions.',
    cost: 'Strict disclosure and release conditions; Little Flower is needed for direct defense.',
    effect: 'A conjured bomb and timer attach to the victim.',
  }),
  profile({
    id: 'hanzo-skill-four', user: 'Hanzo', name: 'Hanzo Skill 4', naturalCategory: 'category:transmutation',
    supportingCategories: ['category:conjuration'],
    activation: 'Hanzo projects a double while his original body remains immobile and unconscious.',
    cost: 'The original body is defenseless, and the double must remain within its operating conditions.',
    effect: 'Creates a remotely controlled double able to move through physical barriers.',
    categoryUse: 'partly-inferred',
  }),

  // Specialization.
  profile({
    id: 'skill-hunter', user: 'Chrollo Lucilfer', name: 'Skill Hunter', naturalCategory: 'category:specialization',
    activation: 'Chrollo fulfills theft conditions and stores the ability in Bandit’s Secret.',
    cost: 'Multiple acquisition requirements and book-use restrictions.',
    effect: 'Steals and later deploys other people’s Nen abilities.',
  }),
  profile({
    id: 'lovely-ghostwriter', user: 'Neon Nostrade', name: 'Lovely Ghostwriter', naturalCategory: 'category:specialization',
    activation: 'Neon writes while unconscious after receiving identifying information.',
    cost: 'Cannot predict her own future and does not remember the writing process.',
    effect: 'Produces metaphorical fortunes covering the coming month.',
  }),
  profile({
    id: 'memory-bomb', user: 'Pakunoda', name: 'Memory Bomb', naturalCategory: 'category:specialization',
    activation: 'Pakunoda loads extracted memories into bullets and shoots selected people.',
    cost: 'Requires memory access and physical firing; use can carry lethal consequences.',
    effect: 'Transfers memories directly into recipients.',
  }),
  profile({
    id: 'doctor-blythe', user: 'Neferpitou', name: 'Doctor Blythe', naturalCategory: 'category:specialization',
    supportingCategories: ['category:conjuration', 'category:manipulation'],
    activation: 'Pitou conjures Doctor Blythe and anchors it to a limited working radius.',
    cost: 'Pitou cannot use En while it operates and must remain near the patient.',
    effect: 'Performs surgery, healing, reconstruction, and corpse preparation.',
    categoryUse: 'community-attributed',
  }),
  profile({
    id: 'requests-wishes', user: 'Alluka Zoldyck', name: 'Requests and wishes', naturalCategory: 'category:specialization',
    activation: 'Nanika issues requests; satisfying or refusing them determines the next wish sequence.',
    cost: 'The rules impose escalating consequences, with important exceptions around Killua.',
    effect: 'Grants extraordinary wishes through a rule-bound request system.',
    abilityKind: 'system',
    categoryUse: 'natural-type-only',
  }),
  profile({
    id: 'kurapika-chains', user: 'Kurapika', name: 'Chain abilities / Emperor Time', naturalCategory: 'category:conjuration',
    supportingCategories: ['category:specialization'],
    activation: 'Scarlet Eyes activate Emperor Time; individual chains have separate rules.',
    cost: 'Severe restrictions, including Chain Jail’s target limitation and Emperor Time’s lifespan cost.',
    effect: 'Conjured chains perform capture, healing, judgment, dowsing, and ability-stealing functions.',
  }),
  profile({
    id: 'black-widow', user: 'Palm Siberia', name: 'Black Widow', naturalCategory: 'category:enhancement',
    activation: 'Palm wraps herself in strengthened hair after her Chimera Ant transformation.',
    cost: 'Requires the transformed body and commits her hair to armor and movement.',
    effect: 'Enhances hair into a durable defensive and offensive shell.',
  }),
];

export const nenExpansionSources = {
  togashiChart: 'https://voraciousdrake.wordpress.com/2024/11/14/translation-and-clarification-of-the-nen-charts-from-the-togashi-exhibition/',
  hunterpediaExhibition: 'https://hunterxhunter.fandom.com/wiki/Exhibition:_Togashi_Yoshihiro_-Puzzle-',
  hunterpediaNen: 'https://hunterxhunter.fandom.com/wiki/Nen',
  communityGuide: 'https://hunterxnen.com/',
};

export const nenExpansionCompletion = {
  categories: nenCategoryOrder.length,
  primaryUsers: Object.values(primaryCategoryUsers).flat().length,
  secondaryUsers: Object.values(secondaryPureUsers).flat().length,
  placements: spectrumPlacements.length,
  abilityProfiles: namedAbilityProfiles.length,
};
