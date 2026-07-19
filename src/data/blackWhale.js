import { roomAssignmentLedger } from './successionArchive';
import { blackWhaleRoomMediaBySource } from './blackWhaleMedia.generated';

const wikiBase = 'https://hunterxhunter.fandom.com/wiki';
const file = (name) => `${wikiBase}/Special:Redirect/file/${encodeURIComponent(name)}`;

export const blackWhaleSource = `${wikiBase}/Black_Whale`;
export const blackWhaleGallery = `${wikiBase}/Black_Whale/Image_Gallery`;

export const blackWhaleFacts = [
  ['Capacity', '200,000 passengers'],
  ['Length', '1,500 m'],
  ['Height / width', '800 m / 800 m'],
  ['Voyage', '2 months to New Continent'],
  ['Security', 'About 2,000 guards and soldiers'],
  ['Structure', '5 social tiers'],
];

export const blackWhaleImages = {
  crossSection: '/black-whale-cutaway.png',
  exterior: file('342 - Black Whale Ship.png'),
  tierOneMap: '/media/rooms/tier-1-quarters.png',
  ceremonyHall: '/media/rooms/ceremony-hall.png',
  theatre: file('Theatre venue.png'),
  bulkhead: file('Tier 2 bulkhead.png'),
  firstClassCabin: file('First-class cabin.png'),
  casino: '/media/rooms/vvip-casino.png',
  lifeboat: '/media/rooms/lifeboat-launch-site.png',
  lifeboatInterior: file('Chap 383 - Black Whale lifeboats interior.png'),
  princeRoomMap: file("Princes' Living Quarters Map.png"),
  banquetPassage: file('Chap 383 - Passageway to the Banquet Hall.png'),
  kingGate: file('Chap 382 - Princes Living Quarters Gate.png'),
  camillaCell: file("Chap 373 - Camilla's first class cell.png"),
  standardCell: file("Tuffdy's cell.png"),
  cellCorridor: file('Prison Corridor.png'),
  courthouse: file('Central courthouse.png'),
  conference: 'https://static.wikia.nocookie.net/hunterxhunter/images/5/5e/Conference_room.png/revision/latest?cb=20210828051525',
  kingLiving: '/media/rooms/kings-living-room.png',
  beyondCell: '/media/rooms/beyond-holding-cell.png',
  supremeCourt: '/media/rooms/supreme-court.png',
  burial: '/media/rooms/princes-burial-chamber.png',
  justice: 'https://static.wikia.nocookie.net/hunterxhunter/images/d/d6/Chap_386_-_Justice_Bureau.png/revision/latest?cb=20240417175703',
  processing: 'https://static.wikia.nocookie.net/hunterxhunter/images/d/df/Chap_398_-_Processing_Room.png/revision/latest?cb=20240417204445',
  disposal: 'https://static.wikia.nocookie.net/hunterxhunter/images/0/01/Chap_394_-_Disposal_Room.png/revision/latest?cb=20240417204235',
  morenaOffice: 'https://static.wikia.nocookie.net/hunterxhunter/images/2/29/Chap_394_-_Morena%27s_Office.png/revision/latest?cb=20240417204336',
  communal: 'https://static.wikia.nocookie.net/hunterxhunter/images/8/8d/Chap_399_-_Communal_Area.png/revision/latest?cb=20240417204541',
  police: 'https://static.wikia.nocookie.net/hunterxhunter/images/d/d9/Central_police_station.png/revision/latest?cb=20231231170721',
  safety: 'https://static.wikia.nocookie.net/hunterxhunter/images/e/ed/Community_safety_section.png/revision/latest?cb=20240102001258',
  armyOffice: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b3/Royal_army_office.png/revision/latest?cb=20240115125818',
  clinic: 'https://static.wikia.nocookie.net/hunterxhunter/images/2/23/Hunter_%C3%97_Hunter_-_v34_p173_-_c359_-_%28VIZ%29_%28Digital_CC%29_%28PZG%29.png/revision/latest?cb=20240417182153',
  observation: 'https://static.wikia.nocookie.net/hunterxhunter/images/7/71/380_-_Observation_Deck.png/revision/latest?cb=20240417182451',
  cineplex: 'https://static.wikia.nocookie.net/hunterxhunter/images/a/a4/Chap_393_-_Cineplex.png/revision/latest?cb=20250407070220',
  standardCabin: 'https://static.wikia.nocookie.net/hunterxhunter/images/e/ed/Single_cabins.png/revision/latest?cb=20240102163128',
  assembly: 'https://static.wikia.nocookie.net/hunterxhunter/images/5/50/37564.png/revision/latest?cb=20240417191915',
  dining: 'https://static.wikia.nocookie.net/hunterxhunter/images/0/09/Chap_377_-_Central_Dining_Hall.png/revision/latest?cb=20240417192352',
  warehouse: file('Warehouse.png'),
  chaR: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b9/Chap_380_-_Cha-R_Family_base.png/revision/latest?cb=20240417193048',
};

export const blackWhaleRemoteImageSources = Object.entries(blackWhaleImages)
  .filter(([, imageSource]) => imageSource.startsWith('https://'))
  .map(([key, imageSource]) => ({ key, imageSource, articleSource: blackWhaleGallery }));

const localRoomMedia = {
  [blackWhaleImages.tierOneMap]: { width: 690, height: 672, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/e/ed/Outline_of_tier_1_quarters.png/revision/latest' },
  [blackWhaleImages.ceremonyHall]: { width: 972, height: 564, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/4/4c/Chap_359_-_Ceremony_Hall.png/revision/latest' },
  [blackWhaleImages.casino]: { width: 377, height: 295, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/f/ff/Chap_405_-_Casino.png/revision/latest' },
  [blackWhaleImages.lifeboat]: { width: 1089, height: 385, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/8/85/Chap_383_-_Lifeboat_Launch_Site.png/revision/latest' },
  [blackWhaleImages.kingLiving]: { width: 1080, height: 593, focal: '50% 50%', imageSource: "https://static.wikia.nocookie.net/hunterxhunter/images/d/d4/Chap_382_-_King's_living_room.png/revision/latest" },
  [blackWhaleImages.beyondCell]: { width: 1026, height: 1084, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/6/61/Chap_359_-_Beyond_in_his_cell.png/revision/latest' },
  [blackWhaleImages.supremeCourt]: { width: 1008, height: 1049, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/7/74/Chap_376_-_Benjamin_and_Camilla_inside_the_courtroom.png/revision/latest' },
  [blackWhaleImages.burial]: { width: 2133, height: 1600, focal: '50% 50%', imageSource: 'https://static.wikia.nocookie.net/hunterxhunter/images/b/b4/Chap_371_-_Kakin_Tree.png/revision/latest' },
};

export const blackWhaleTiers = [
  {
    id: 'tier-1', number: '1', name: 'Royal & VVIP deck', class: 'Royal family, V6 politicians, industry dignitaries, mafia bosses',
    population: 'Part of the 20,000 people in the upper two tiers', security: '800 guards and Royal Army soldiers', control: 'Kakin royal authority',
    description: 'A separate cruise ship sitting in a pool on top of the main hull. The Succession Contest’s primary hunting ground.',
  },
  {
    id: 'tier-2', number: '2', name: 'Wealth & institutions', class: 'Celebrities and wealthy passengers',
    population: 'Part of the 20,000 people in the upper two tiers', security: '600 guards and Royal Army soldiers', control: 'Kakin state institutions',
    description: 'The highest level inside the hull. A thick one-way emergency bulkhead separates it from Tier 3.',
  },
  {
    id: 'between-2-3', number: '2↕3', name: 'Hidden inter-tier space', class: 'Unregistered / concealed',
    population: 'Unknown', security: 'Outside normal passenger circulation', control: 'Heil-Ly Family',
    description: 'The concealed location of Morena’s active base, linked to teleport traps in Tier 3 cabins.',
  },
  {
    id: 'tier-3', number: '3', name: 'Civic & medical deck', class: 'General passengers; first-class and standard cabins',
    population: 'Part of roughly 180,000 lower-tier passengers', security: 'Sparse; shared lower-tier force', control: 'State wards; former Heil-Ly territory',
    description: 'The upper general-passenger tier, containing courts, police, medical services, cabins, cinemas, and an observation deck.',
  },
  {
    id: 'tier-4', number: '4', name: 'Trade & Xi-Yu deck', class: 'General passengers',
    population: 'Part of roughly 180,000 lower-tier passengers', security: 'More than 300 civilians per guard in lower tiers', control: 'Xi-Yu Family',
    description: 'The largest-looking lower tier, tied to distribution, trafficking, and the Royal Army’s operational conference room.',
  },
  {
    id: 'between-4-5', number: '4↕5', name: 'Service infrastructure', class: 'Restricted ship operations',
    population: 'Not a passenger zone', security: 'Restricted access', control: 'Ship operations',
    description: 'The immense sewage-processing layer serving the full population and suspected as a hunting route.',
  },
  {
    id: 'tier-5', number: '5', name: 'Lowest passenger deck', class: 'General passengers',
    population: 'Part of roughly 180,000 lower-tier passengers', security: 'One clinic; no dedicated doctor', control: 'Cha-R Family',
    description: 'The smallest lower tier, below the waterline beside the propeller, with cabins, warehouse space, dining, and Cha-R surveillance.',
  },
];

const baseBlackWhaleRooms = [
  { tier: 'tier-1', name: 'King’s Living Quarters', type: 'Royal residence', detail: 'Nasubi’s ornate residence, separated from the princes by the banquet hall.', image: blackWhaleImages.kingLiving },
  { tier: 'tier-1', name: 'Princes’ Living Quarters', type: '14 numbered residences', detail: 'Rooms 1001–1014 form two rows. Each contains a master bedroom, washroom, living area, kitchen/dining area, and servants’ quarters.', image: blackWhaleImages.tierOneMap },
  { tier: 'tier-1', name: 'VVIP Living Quarters', type: 'Protected residences', detail: 'Politicians, dignitaries, and mafia bosses reside here. Onior’s residence has a confirmed bridge toward Tier 2.' },
  { tier: 'tier-1', name: 'Queens’ Living Quarters', type: 'Royal residences', detail: 'Each queen has a separate room. Unma’s Room 01 is the only numbered queen’s room shown so far.' },
  { tier: 'tier-1', name: 'Soldiers / Associates’ Quarters', type: 'Staff housing', detail: 'Housing for Kakin soldiers and roughly 150 Provisional Hunters, beside a heavily guarded route to the lower tiers.' },
  { tier: 'tier-1', name: 'Banquet / Ceremony Hall', type: 'Assembly hall', detail: 'Departure ceremony and Sunday banquets; includes Nasubi’s throne, a central stage, buffet restaurant, and intercom broadcast system.', image: blackWhaleImages.ceremonyHall },
  { tier: 'tier-1', name: 'Beyond’s Holding Cell', type: 'Jail', detail: 'A tiny round-the-clock monitored cell containing a bed, urinal, wall restraint, and tracking controls.', image: blackWhaleImages.beyondCell },
  { tier: 'tier-1', name: 'Supreme Court', type: 'Highest judicial chamber', detail: 'Cleapatro’s court has ultimate judicial authority aboard the Black Whale.', image: blackWhaleImages.supremeCourt },
  { tier: 'tier-1', name: 'Princes’ Burial Chamber', type: 'Restricted ritual space', detail: 'A capsule-like chamber with fourteen caskets and inscriptions. Its precise function remains unconfirmed.', image: blackWhaleImages.burial },
  { tier: 'tier-1', name: 'Lifeboat Launch Site', type: 'Emergency facility', detail: 'A keypad-secured waterway and control station reached from the banquet passage in about two minutes.', image: blackWhaleImages.lifeboat },
  { tier: 'tier-1', name: 'VVIP Casino', type: 'Recreation', detail: 'Slot machines, staffed poker tables, and bar service in the royal/VVIP recreation zone.', image: blackWhaleImages.casino },
  { tier: 'tier-1', name: 'Private Recreation Facilities', type: 'Restricted recreation', detail: 'Facilities for the princes on the odd-numbered side of the residence complex.' },
  { tier: 'tier-1', name: 'King’s Quarters Gate', type: 'Royal security threshold', detail: 'The formal gate between Nasubi’s residence and the rest of Tier 1; funeral, ritual, and military authority converge here.', image: blackWhaleImages.kingGate },
  { tier: 'tier-1', name: 'Individual Prince Residence Plan', type: 'Standard royal room plan', detail: 'Every numbered prince residence includes a master bedroom, washroom, central living space, kitchen and dining area, and servants’ quarters.', image: blackWhaleImages.princeRoomMap },
  { tier: 'tier-1', name: 'Banquet Hall Passage', type: 'Prescribed ceremony route', detail: 'Princes enter and leave the banquet hall through controlled time slots, turning a corridor into a surveillance and custody route.', image: blackWhaleImages.banquetPassage },
  { tier: 'tier-1', name: 'Lifeboat Interior & Control', type: 'Emergency craft interior', detail: 'The escape route includes a control point and enclosed craft beyond the launch waterway; leaving the voyage still intersects the succession ritual.', image: blackWhaleImages.lifeboatInterior },
  { tier: 'tier-1', name: 'Camilla’s First-Class Cell', type: 'Royal detention suite', detail: 'A higher-grade detention room used after the royal hearing, distinct from the ship’s standard holding cells.', image: blackWhaleImages.camillaCell },
  { tier: 'tier-1', name: 'Standard Cells', type: 'Detention wing', detail: 'Ordinary suspects and criminals are held in compact standard cells before a court-martial; Tuffdy’s cell becomes central to Hanzo’s investigation.', image: blackWhaleImages.standardCell },
  { tier: 'tier-1', name: 'Standard-Cell Corridor', type: 'Guarded detention route', detail: 'A secured corridor separates ordinary custody from royal first-class confinement and controls the route between the cells and legal proceedings.', image: blackWhaleImages.cellCorridor },

  { tier: 'tier-2', name: 'Theater Venue', type: 'Auditorium', detail: 'A small theatre with a projection screen and loges where the public voyage plan is explained.', image: blackWhaleImages.theatre },
  { tier: 'tier-2', name: 'Justice Bureau', type: 'Five-story legal complex', detail: 'Kaiser’s office, lobby, interrogation rooms, visitation rooms, and a VIP witness-protection area described as the safest place on the ship.', image: blackWhaleImages.justice },
  { tier: 'tier-2', name: 'Tier 2–3 Bulkhead', type: 'Security barrier', detail: 'A thick emergency partition controlled from the Tier 2 side. It closes under special martial law.', image: blackWhaleImages.bulkhead },
  { tier: 'tier-2', name: 'Justice Bureau Witness-Protection Area', type: 'Protected legal residence', detail: 'The VIP area inside the five-story bureau is treated as one of the safest controlled spaces aboard, but access depends on Justice authority.' },
  { tier: 'tier-2', name: 'Justice Bureau Interview & Visitation Floors', type: 'Legal procedure rooms', detail: 'Interrogation, attorney access, protected visitation, and investigative movement occupy different parts of the bureau rather than one generic office.' },

  { tier: 'between-2-3', name: 'Heil-Ly Secret Hideout', type: 'Hidden base', detail: 'Morena’s active headquarters with five entrances and Nen-mediated links to Tier 3.', image: blackWhaleImages.communal },
  { tier: 'between-2-3', name: 'Shower / Rooms A and B', type: 'Teleport arrival area', detail: 'A blood-stained, Nen-reinforced shower room reached through Room 3101.', image: blackWhaleImages.processing },
  { tier: 'between-2-3', name: 'Processing & Disposal Rooms', type: 'Heil-Ly operations', detail: 'Spaces used in Morena’s operation; their exact physical connection to the main hideout is not fully confirmed.', image: blackWhaleImages.disposal },
  { tier: 'between-2-3', name: 'Morena’s Office & Communal Area', type: 'Command / living space', detail: 'Office, meeting space, dormitory, laundry, kitchen, and bunker-like corridors used by Heil-Ly members.', image: blackWhaleImages.morenaOffice },
  { tier: 'between-2-3', name: 'Heil-Ly Laundry & Dormitory', type: 'Hidden domestic infrastructure', detail: 'The base contains ordinary sleeping, laundry, and storage functions, allowing a large group to remain outside registered passenger geography.' },
  { tier: 'between-2-3', name: 'Heil-Ly Kitchen & Meeting Space', type: 'Hidden communal rooms', detail: 'Meals, briefings, recruitment, and Nen operations share one concealed living network rather than a single hideout room.' },

  { tier: 'tier-3', name: 'First-Class & Standard Cabins', type: 'Passenger housing', detail: 'Single cabins connect to passenger assembly areas. Rooms 3101 and 3131 are Heil-Ly-owned traps.', image: blackWhaleImages.firstClassCabin },
  { tier: 'tier-3', name: 'Central Courthouse', type: 'Political ward', detail: 'The main court facility overseen by Botobai during the voyage.', image: blackWhaleImages.courthouse },
  { tier: 'tier-3', name: 'Central Police Station', type: 'Political ward', detail: 'Police and detention operations for lower-tier incidents.', image: blackWhaleImages.police },
  { tier: 'tier-3', name: 'Community Safety Section', type: 'Public security', detail: 'A coordination unit within the political ward.', image: blackWhaleImages.safety },
  { tier: 'tier-3', name: 'Royal Army Office', type: 'Military office', detail: 'Mizaistom’s lower-tier security headquarters and policy meeting room.', image: blackWhaleImages.armyOffice },
  { tier: 'tier-3', name: 'Medical Ward & Central Clinic', type: 'Hospital / research', detail: 'Cheadle supervises the central clinic; Tier 3 holds three clinics and the ship’s major medical services.', image: blackWhaleImages.clinic },
  { tier: 'tier-3', name: 'Observation Deck', type: 'Public recreation', detail: 'A forward sightseeing platform with lounge chairs, shops, and bars.', image: blackWhaleImages.observation },
  { tier: 'tier-3', name: 'Heil-Ly Family Office', type: 'Abandoned official base', detail: 'The registered office near the bottom of Tier 3, connected to Morena’s Tier 1 quarters but mostly abandoned.' },
  { tier: 'tier-3', name: 'Movie Theatre', type: 'Eight-screen cineplex', detail: 'The location used in the false-Hisoka operation; at least eight screens and a public lobby.', image: blackWhaleImages.cineplex },
  { tier: 'tier-3', name: 'Rooms 3101 & 3131', type: 'Nen trap cabins', detail: 'First-class cabins used to teleport victims into Heil-Ly’s hidden base.' },
  { tier: 'tier-3', name: 'First-Class Cabin Corridor', type: 'Passenger circulation / trap approach', detail: 'A normal-looking passenger corridor conceals the approach to Rooms 3101 and 3131, making public housing part of Heil-Ly’s transport system.' },
  { tier: 'tier-3', name: 'Cineplex Lobby & Screen 8', type: 'Public entertainment / search operation', detail: 'The eight-screen movie complex becomes an intelligence stage during the false-Hisoka operation and the Troupe–mafia search.' },

  { tier: 'tier-4', name: 'Kakin Royal Army Conference Room', type: 'Military coordination', detail: 'The main Tier 4 meeting point for Royal Army personnel, headed operationally by Mizaistom.', image: blackWhaleImages.conference },
  { tier: 'tier-4', name: 'Xi-Yu Family Office', type: 'Mafia headquarters', detail: 'A hideout in the forward “teeth” of the Black Whale.' },

  { tier: 'between-4-5', name: 'Sewage Processing Facility', type: 'Service infrastructure', detail: 'The waste-processing system for 200,000 passengers, located between the two lowest tiers.' },

  { tier: 'tier-5', name: 'Standard Passenger Cabins', type: 'Passenger housing', detail: 'The only confirmed cabin type on the lowest tier.', image: blackWhaleImages.standardCabin },
  { tier: 'tier-5', name: '37564 Assembly Point', type: 'Public assembly', detail: 'The place where Chrollo first appears aboard the ship; its number is a Japanese wordplay for “kill them all.”', image: blackWhaleImages.assembly },
  { tier: 'tier-5', name: 'Central Dining Hall', type: 'Cafeteria', detail: 'The tier’s only cafeteria, reached through a single passage that was controlled by bribed thugs.', image: blackWhaleImages.dining },
  { tier: 'tier-5', name: 'Warehouse', type: 'Cargo / black market', detail: 'Cha-R-controlled storage for legitimate and smuggled goods, with a monitored entrance.', image: blackWhaleImages.warehouse },
  { tier: 'tier-5', name: 'Cha-R Family Office', type: 'Mafia headquarters', detail: 'A smart-locked office, bedroom, and surveillance room beside the propeller, linked to Brocco Li’s Tier 1 quarters.', image: blackWhaleImages.chaR },
];

export const blackWhaleManifest = [
  { group: 'All passengers', count: '200,000', distribution: 'Five class-divided tiers', note: 'The vessel functions as a city during the two-month public voyage.' },
  { group: 'Upper tiers', count: 'About 20,000', distribution: 'Tiers 1 and 2', note: 'Royal family, V6 officials, dignitaries, celebrities, wealthy passengers, staff, and security.' },
  { group: 'Lower tiers', count: 'About 180,000', distribution: 'Tiers 3 through 5', note: 'General passengers, including people seeking a new life on the New Continent.' },
  { group: 'Guards and soldiers', count: 'About 2,000', distribution: '1,400 upper / 600 lower', note: 'The unequal distribution leaves more than 300 civilians per guard in parts of the lower ship.' },
  { group: 'Unofficial mafia passengers', count: 'At least 500', distribution: 'Mostly lower tiers', note: 'Associates avoided the Royal Army passenger registry; mafia files track their presence.' },
  { group: 'Heil-Ly initial group', count: '23', distribution: 'Registered as civilians', note: 'Morena and the original members entered through the ordinary passenger system.' },
];

export const blackWhaleMovementRoutes = [
  { name: 'Royal circuit', path: ['King quarters', 'Banquet hall', 'Prince rooms 1001-1014', 'VVIP housing'], access: 'Royal walls, guards, and prescribed Tier 1 access', kind: 'official' },
  { name: 'Justice circuit', path: ['Supreme Court', 'Tier 2 Justice Bureau', 'Tier 3 courthouse and police'], access: 'Court orders, escorts, custody, and protected visitation', kind: 'official' },
  { name: 'Public vertical route', path: ['Tier 2', 'Bulkhead', 'Tier 3', 'Tier 4', 'Tier 5'], access: 'Lower central passages require tickets; the upper bulkhead is controlled from Tier 2', kind: 'restricted' },
  { name: 'Mafia vertical links', path: ['Tier 1 bosses', 'Xi-Yu Tier 4', 'Cha-R Tier 5'], access: 'Unofficial ticket control, staff routes, and family-controlled corridors', kind: 'restricted' },
  { name: 'Heil-Ly network', path: ['Rooms 3101 / 3131', 'Shower rooms', 'Hidden inter-tier base'], access: 'Nen-mediated traps and teleportation conditions', kind: 'hidden' },
  { name: 'Emergency route', path: ['Banquet passage', 'Lifeboat control', 'Hull waterway'], access: 'Keypad, Royal Army control, and ritual consequences', kind: 'restricted' },
  { name: 'Service circuit', path: ['Clinics', 'Warehouses', 'Food systems', 'Sewage band'], access: 'Operational staff and restricted infrastructure access', kind: 'official' },
];

export const blackWhaleDeckPlan = [
  { tier: 'tier-1', label: 'Tier 1', confidence: 'Hunterpedia room plan', nodes: ['King quarters', 'Banquet hall', 'Rooms 1001-1014', 'Queens', 'VVIP', 'Lifeboats'] },
  { tier: 'tier-2', label: 'Tier 2', confidence: 'Named spaces; exact placement partly unknown', nodes: ['Theater', 'Justice Bureau', 'Upper bulkhead'] },
  { tier: 'between-2-3', label: 'Hidden band', confidence: 'Inferred band; Nen connections confirmed', nodes: ['Heil-Ly base', 'Shower A/B', 'Processing', 'Morena office'] },
  { tier: 'tier-3', label: 'Tier 3', confidence: 'Named civic zones and cabins', nodes: ['Cabins', 'Room 3101', 'Courthouse', 'Police', 'Clinics', 'Cineplex'] },
  { tier: 'tier-4', label: 'Tier 4', confidence: 'Named headquarters; full deck geometry unknown', nodes: ['Xi-Yu office', 'Royal Army conference'] },
  { tier: 'between-4-5', label: 'Service band', confidence: 'Functional position confirmed', nodes: ['Sewage processing', 'Restricted infrastructure'] },
  { tier: 'tier-5', label: 'Tier 5', confidence: 'Named public and mafia spaces', nodes: ['Assembly 37564', 'Dining hall', 'Warehouse', 'Cha-R office'] },
];

const roomProfiles = {
  'King’s Living Quarters': { occupants: 'Nasubi and royal staff', access: 'King-level royal access', connections: 'Banquet hall, restricted royal passages', status: 'Active royal residence' },
  'Princes’ Living Quarters': { occupants: 'Fourteen prince households and assigned personnel', access: 'Guarded royal ring; room-specific screening', connections: 'Banquet hall, queens, VVIP and associate housing', status: 'Primary Succession Contest zone' },
  'VVIP Living Quarters': { occupants: 'Political dignitaries and three mafia bosses', access: 'Restricted upper-tier credentials', connections: 'Royal ring and confirmed cross-tier routes', status: 'Active / politically sensitive' },
  'Queens’ Living Quarters': { occupants: 'Eight queens and household staff', access: 'Royal household credentials', connections: 'Prince rooms and royal passages', status: 'Active residences' },
  'Banquet / Ceremony Hall': { occupants: 'Royal family, dignitaries, staff, and invited performers', access: 'Ceremony and banquet schedule', connections: 'King quarters, prince ring, lifeboat passage', status: 'Active assembly and ritual-adjacent space' },
  'Beyond’s Holding Cell': { occupants: 'Beyond Netero under continuous guard', access: 'Association and Kakin custody controls', connections: 'Upper security and tracking systems', status: 'Occupied detention cell' },
  'Supreme Court': { occupants: 'Cleapatro and judicial personnel', access: 'Judicial security', connections: 'Justice Bureau and royal legal channels', status: 'Operational' },
  'Princes’ Burial Chamber': { occupants: 'No ordinary occupants; fourteen caskets and central apparatus', access: 'Highly restricted', connections: 'Unknown ritual route within Tier 1', status: 'Purpose unresolved' },
  'Lifeboat Launch Site': { occupants: 'Emergency and security staff when activated', access: 'Keypad-secured and army controlled', connections: 'Banquet passage and exterior waterway', status: 'Secured after failed escape' },
  'Justice Bureau': { occupants: 'Kaiser, investigators, protected witnesses, detainees, and visitors', access: 'Screening, escort, and legal authorization', connections: 'Tier 1 court, Tier 3 civic ward', status: 'Operational under special martial law' },
  'Tier 2–3 Bulkhead': { occupants: 'Royal Army guards', access: 'Opens only from Tier 2', connections: 'Upper and lower ship', status: 'Closed under special martial law' },
  'Heil-Ly Secret Hideout': { occupants: 'Morena and Heil-Ly members', access: 'Hidden Nen route; five reported entrances', connections: 'Tier 3 trap rooms and concealed inter-tier passages', status: 'Active concealed base' },
  'Shower / Rooms A and B': { occupants: 'Heil-Ly operators and transported targets', access: 'Teleport arrival conditions', connections: 'Room 3101 and hideout interior', status: 'Active trap route' },
  'Processing & Disposal Rooms': { occupants: 'Heil-Ly operators and victims', access: 'Concealed base access', connections: 'Hideout service rooms', status: 'Operational connection partly unconfirmed' },
  'Morena’s Office & Communal Area': { occupants: 'Morena, players, recruits, and communal staff', access: 'Heil-Ly internal access', connections: 'Dormitory, kitchen, laundry, bunker corridors', status: 'Active command center' },
  'Rooms 3101 & 3131': { occupants: 'Registered cabin identities used as cover', access: 'First-class cabin corridor', connections: 'Heil-Ly teleport network', status: 'Active Nen traps' },
  'Xi-Yu Family Office': { occupants: 'Hinrigh and Xi-Yu personnel', access: 'Xi-Yu-controlled Tier 4 territory', connections: 'Tier 1 Onior route and lower-tier operations', status: 'Active headquarters' },
  'Kakin Royal Army Conference Room': { occupants: 'Mizaistom and security personnel', access: 'Royal Army and authorized security staff', connections: 'Tier 3 offices and lower-tier deployment routes', status: 'Operational command room' },
  'Sewage Processing Facility': { occupants: 'Ship operations staff', access: 'Restricted infrastructure', connections: 'Service band between Tiers 4 and 5', status: 'Operational' },
  'Central Dining Hall': { occupants: 'Tier 5 passengers and food staff', access: 'Single corridor; formerly controlled by bribed thugs', connections: 'Tier 5 public circulation', status: 'Operational / control uncertain' },
  'Warehouse': { occupants: 'Cha-R guards and cargo workers', access: 'Cha-R surveillance at entrance', connections: 'Tier 5 cargo and smuggling routes', status: 'Operational after Luini attack' },
  'Cha-R Family Office': { occupants: "Ken'i Wang and Cha-R personnel", access: 'Smart lock and family authorization', connections: 'Tier 5 warehouse and Brocco Li\'s Tier 1 quarters', status: 'Active headquarters' },
};

const tierDefaults = Object.fromEntries(blackWhaleTiers.map((tier) => [tier.id, {
  control: tier.control,
  access: tier.security,
  occupants: tier.class,
  status: 'Operational ship space',
}]));

export const royalRoomPlan = roomAssignmentLedger.map((record) => ({
  ...record,
  roomNumber: `10${String(record.order).padStart(2, '0')}`,
  side: record.order % 2 === 0 ? 'even' : 'odd',
  source: `${wikiBase}/${record.prince.replaceAll(' ', '_')}_Hui_Guo_Rou`,
}));

const royalRoomRecords = royalRoomPlan.map((record) => ({
  tier: 'tier-1',
  name: `Room ${record.roomNumber} · ${record.prince}`,
  type: `${record.order}${record.order === 1 ? 'st' : record.order === 2 ? 'nd' : record.order === 3 ? 'rd' : 'th'} Prince residence`,
  detail: `${record.mother} maternal branch. ${record.original}`,
  occupants: record.current,
  control: `${record.prince} household; outside personnel listed in the assignment ledger`,
  access: 'Prince-room security ring and household screening',
  connections: `${record.side === 'even' ? 'Even-numbered' : 'Odd-numbered'} row; higher-ranked rooms are closer to the banquet hall`,
  status: record.state,
  source: record.source,
}));

export const blackWhaleRooms = [...baseBlackWhaleRooms, ...royalRoomRecords].map((room) => {
  const normalizedMedia = localRoomMedia[room.image] || blackWhaleRoomMediaBySource.get(room.image) || null;
  return {
    ...tierDefaults[room.tier],
    ...room,
    ...roomProfiles[room.name],
    source: room.source || blackWhaleSource,
    image: normalizedMedia?.src || room.image || '',
    media: normalizedMedia ? {
      ...normalizedMedia,
      storage: 'local',
      articleSource: room.source || blackWhaleSource,
      reviewed: 'July 16, 2026',
    } : null,
  };
});

const visualTourNames = [
  'King’s Living Quarters', 'Princes’ Living Quarters', 'Banquet / Ceremony Hall', 'Beyond’s Holding Cell',
  'Supreme Court', 'Princes’ Burial Chamber', 'Lifeboat Launch Site', 'VVIP Casino',
  'King’s Quarters Gate', 'Individual Prince Residence Plan', 'Banquet Hall Passage', 'Lifeboat Interior & Control',
  'Camilla’s First-Class Cell', 'Standard Cells', 'Standard-Cell Corridor',
  'Justice Bureau', 'Tier 2–3 Bulkhead', 'Heil-Ly Secret Hideout', 'Morena’s Office & Communal Area',
  'Medical Ward & Central Clinic', 'Observation Deck', 'Movie Theatre', 'Xi-Yu Family Office',
  'Kakin Royal Army Conference Room', '37564 Assembly Point', 'Central Dining Hall', 'Warehouse', 'Cha-R Family Office',
];

export const blackWhaleVisualTour = visualTourNames
  .map((name) => blackWhaleRooms.find((room) => room.name === name))
  .filter((room) => room?.image);

const hotspotRecords = [
  ['tier-1', 'Tier 1', 'Royal and VVIP ship', 50, 14, 'tier-1', null, 'Confirmed tier', 'The separate royal vessel above the main hull.'],
  ['king-gate', 'King’s quarters', 'Nasubi residence and guarded gate', 50, 8, 'tier-1', 'King’s Living Quarters', 'Approximate within tier', 'The gate receives Halkenburg’s funeral procession in Chapter 413.'],
  ['banquet', 'Banquet hall', 'Ceremony, banquets, and royal route', 50, 22, 'tier-1', 'Banquet / Ceremony Hall', 'Approximate within tier', 'The hall separates the King’s area from the prince residence ring.'],
  ['lifeboat', 'Lifeboat launch', 'Escape craft and ritual boundary', 72, 18, 'tier-1', 'Lifeboat Launch Site', 'Approximate within tier', 'The keypad-secured waterway becomes the twins’ failed escape route.'],
  ['casino', 'VVIP casino', 'Tier 1 recreation and Hisoka sighting', 27, 17, 'tier-1', 'VVIP Casino', 'Approximate within tier', 'The casino becomes an upper-tier convergence point for the Hisoka search.'],
  ['prince-ring', 'Prince rooms', 'Rooms 1001–1014', 38, 18, 'tier-1', 'Princes’ Living Quarters', 'Relationship placement', 'Fourteen identical residences form two guarded rows.'],
  ['tier-2', 'Tier 2', 'Wealth and institutions', 50, 33, 'tier-2', null, 'Confirmed tier', 'Celebrities, wealthy passengers, Justice, and upper security.'],
  ['justice', 'Justice Bureau', 'Five-story legal complex', 68, 32, 'tier-2', 'Justice Bureau', 'Approximate within tier', 'Kaiser’s office, interrogation rooms, visitation, and witness protection.'],
  ['theatre', 'Theater venue', 'Voyage briefing auditorium', 30, 33, 'tier-2', 'Theater Venue', 'Approximate within tier', 'A public explanation space on the wealthy passenger tier.'],
  ['bulkhead', 'Tier 2–3 bulkhead', 'Upper/lower security boundary', 51, 41, 'tier-2', 'Tier 2–3 Bulkhead', 'Confirmed boundary', 'Controlled from Tier 2 and closed under special martial law.'],
  ['heil-ly', 'Heil-Ly hideout', 'Hidden inter-tier Nen base', 67, 43, 'between-2-3', 'Heil-Ly Secret Hideout', 'Inferred band', 'Its exact coordinates are unknown; sound and route evidence place it between Tiers 2 and 3.'],
  ['tier-3', 'Tier 3', 'Civic and medical deck', 50, 50, 'tier-3', null, 'Confirmed tier', 'Courts, police, hospitals, cabins, and entertainment for general passengers.'],
  ['room-3101', 'Room 3101', 'Heil-Ly teleport trap', 28, 52, 'tier-3', 'Rooms 3101 & 3131', 'Approximate within tier', 'A first-class cabin used as an entrance to the hidden base.'],
  ['hospital', 'General hospital', 'Central medical services', 65, 53, 'tier-3', 'Medical Ward & Central Clinic', 'Approximate within tier', 'Halkenburg’s body is treated here before the Day 12 funeral.'],
  ['cineplex', 'Movie theatre', 'Eight-screen public complex', 33, 56, 'tier-3', 'Movie Theatre', 'Approximate within tier', 'A false-Hisoka sighting draws mafia and Troupe attention into a public venue.'],
  ['tier-4', 'Tier 4', 'Trade and Xi-Yu territory', 50, 69, 'tier-4', null, 'Confirmed tier', 'A large lower tier shaped by commerce, distribution, and mafia control.'],
  ['xi-yu', 'Xi-Yu office', 'Tier 4 mafia headquarters', 25, 67, 'tier-4', 'Xi-Yu Family Office', 'Approximate within tier', 'Hinrigh and Xi-Yu personnel operate from this tier.'],
  ['army-conference', 'Royal Army conference', 'Lower-tier security command', 70, 69, 'tier-4', 'Kakin Royal Army Conference Room', 'Approximate within tier', 'Mizaistom coordinates military and Hunter responses from this deck.'],
  ['sewage', 'Service band', 'Sewage and ship infrastructure', 49, 79, 'between-4-5', 'Sewage Processing Facility', 'Confirmed functional band', 'Restricted infrastructure between the two lowest passenger tiers.'],
  ['tier-5', 'Tier 5', 'Lowest passenger deck', 50, 88, 'tier-5', null, 'Confirmed tier', 'Mass housing, dining, cargo, and Cha-R-controlled areas below the waterline.'],
  ['warehouse', 'Warehouse', 'Cargo and smuggling route', 35, 86, 'tier-5', 'Warehouse', 'Approximate within tier', 'Cha-R monitors legitimate and illegal goods through this facility.'],
  ['assembly', '37564 assembly', 'Chrollo’s first ship appearance', 52, 89, 'tier-5', '37564 Assembly Point', 'Approximate within tier', 'The numbered public point becomes a Troupe search landmark.'],
  ['dining', 'Central dining hall', 'Single-route Tier 5 cafeteria', 62, 85, 'tier-5', 'Central Dining Hall', 'Approximate within tier', 'Food access and one controlled corridor make this a population-pressure location.'],
  ['cha-r', 'Cha-R office', 'Tier 5 mafia headquarters', 73, 88, 'tier-5', 'Cha-R Family Office', 'Approximate within tier', 'A smart-locked office and surveillance center near the propeller.'],
];

export const blackWhaleHotspots = hotspotRecords.map(([id, label, subtitle, x, y, tier, roomName, confidence, note]) => ({
  id, label, subtitle, x, y, tier, roomName, confidence, note,
  room: roomName ? blackWhaleRooms.find((candidate) => candidate.name === roomName) : null,
  source: blackWhaleSource,
}));
