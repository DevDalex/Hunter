const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const queenHouseholdLedger = [
  {
    rank: '1st', name: 'Unma', children: 'Benjamin, Tserriednich; Halkenburg is her biological son', residence: 'Tier 1 queen residence',
    guards: 'Her Royal Guards originally monitored lower-prince rooms and were progressively replaced by Benjamin soldiers. Unma and Duazul coordinate surveillance reports.',
    action: 'Her household links the First Prince\'s military command, the Fourth Prince\'s private army, and the concealed record of Halkenburg\'s maternity.',
    status: 'Active household', source: wiki('Unma_Hui_Guo_Rou'),
  },
  {
    rank: '2nd', name: 'Duazul', children: 'Camilla, Tubeppa, Luzurus; raised Halkenburg', residence: 'Tier 1 queen residence',
    guards: 'Maintains a coordinator, spies in lower-prince rooms, and a substantial Royal Guard contingent attached to Luzurus. Slakka is reassigned to Room 1014.',
    action: 'Her four connected prince camps create the widest network of overlapping maternal, guard, and alliance interests.',
    status: 'Active household', source: wiki('Duazul_Hui_Guo_Rou'),
  },
  {
    rank: '3rd', name: 'Tang Zhao Li', children: 'Zhang Lei', residence: 'Tier 1 queen residence',
    guards: 'Her Royal Guards monitor princes ranked below Zhang Lei; one of her guards assigned to Woble is killed on Voyage Day 1.',
    action: 'Her branch supports Zhang Lei while the prince relies primarily on his own guards and the Xi-Yu relationship.',
    status: 'Active household', source: wiki('Tang_Zhao_Li_Hui_Guo_Rou'),
  },
  {
    rank: '4th', name: 'Katrono', children: 'Tyson', residence: 'Tier 1 queen residence',
    guards: 'Her Royal Guards are distributed among lower-ranked princes while Tyson maintains a separate devotional household.',
    action: 'Her political position is expressed mostly through surveillance assignments and Tyson\'s insulated camp.',
    status: 'Active household', source: wiki('Katrono_Hui_Guo_Rou'),
  },
  {
    rank: '5th', name: 'Swinko-swinko', children: 'Sale-sale', residence: 'Tier 1 queen residence',
    guards: 'Her captain Mushaho and household guards served Sale-sale alongside spies sent by higher queens.',
    action: 'Her branch loses its contestant when Sale-sale is assassinated after Rihan destroys his Guardian Spirit Beast.',
    status: 'Prince deceased', source: wiki('Swinko-swinko_Hui_Guo_Rou'),
  },
  {
    rank: '6th', name: 'Seiko', children: 'Kacho and Fugetsu', residence: 'Tier 1 queen residence',
    guards: 'The twin households combine Seiko guards, higher-queen spies, hired Hunters, servants, and later Justice Bureau protection.',
    action: 'Her treatment of the twins and the failed escape remain politically important while Without You conceals Kacho\'s death from Fugetsu.',
    status: 'One child deceased; one active', source: wiki('Seiko_Hui_Guo_Rou'),
  },
  {
    rank: '7th', name: 'Sevanti', children: 'Momoze and Marayam', residence: 'Room 1013 with Marayam',
    guards: 'She transfers most Hunters and servants from Momoze to Marayam, then remains inside Marayam\'s isolated Nen space.',
    action: 'The reassignment leaves Momoze exposed and becomes a direct cause in the Twelfth Prince\'s vulnerability.',
    status: 'Momoze deceased; Marayam active', source: wiki('Sevanti_Hui_Guo_Rou'),
  },
  {
    rank: '8th', name: 'Oito', children: 'Woble', residence: 'Room 1014',
    guards: 'Begins with hired Hunters, servants, spies, and guards from higher queens; after the Day 1 deaths, the room is rebuilt around Kurapika, Bill, Shimano, and allied replacements.',
    action: 'Actively performs reconnaissance, approves information-sharing, negotiates alliances, and protects Woble while learning Nen politics in real time.',
    status: 'Active household', source: wiki('Oito_Hui_Guo_Rou'),
  },
];

export const roomAssignmentLedger = [
  {
    order: 1, prince: 'Benjamin', room: '1001 / VVIP confinement', mother: 'Unma', state: 'Active / confined',
    original: 'Balsamilco and Benjamin\'s elite military unit',
    deployed: 'Furykov, Babimyna, Rihan, Yushohi, Vict, Coventoba, Musse, Shikaku, Vincent, and other soldiers are dispatched across rival rooms.',
    current: 'The command structure is destabilized by Halkenburg\'s possession operation and the body state of Balsamilco.',
  },
  {
    order: 2, prince: 'Camilla', room: '1002 / Room 302 detention', mother: 'Duazul', state: 'Active / detained',
    original: 'Personal guards, servants, five Provisional Hunters, and the Have-Not curse unit',
    deployed: 'Sarahell and the Have-Nots pursue death-powered curse plans; Musse replaces an Unma spy before Camilla kills him.',
    current: 'Camilla is legally confined while her household\'s curse infrastructure remains active.',
  },
  {
    order: 3, prince: 'Zhang Lei', room: '1003', mother: 'Tang Zhao Li', state: 'Active',
    original: 'Ten personal guards, three servants, and five Provisional Hunters',
    deployed: 'Sakata and Hashito reinforce Woble; Tenftory attends Nen lessons; Slakka joins Room 1014; Coventoba monitors Room 1003.',
    current: 'The camp studies the Guardian Spirit Beast coins and maintains a working alliance with Kurapika.',
  },
  {
    order: 4, prince: 'Tserriednich', room: '1004', mother: 'Unma', state: 'Active',
    original: 'Ten personal guards, five servants, and five Provisional Hunters',
    deployed: 'Theta and Salkov supervise Nen training; Myuhan and Danjin attend Kurapika\'s class; private military friends operate elsewhere aboard.',
    current: 'Theta attempts to contain the prince\'s growth while his private guard network protects his training secrecy.',
  },
  {
    order: 5, prince: 'Tubeppa', room: '1005', mother: 'Duazul', state: 'Active',
    original: 'Maor, Longhi, personal guards, servants, and Provisional Hunters',
    deployed: 'Maor represents the camp in Nen instruction; Longhi negotiates Moonlight Act with Kurapika.',
    current: 'The household is tied to Woble through a conditional treaty and to Beyond through Longhi\'s disclosed parentage.',
  },
  {
    order: 6, prince: 'Tyson', room: '1006', mother: 'Katrono', state: 'Active',
    original: 'Five personal guards, five servants, Izunavi, Giuliano, and another Pro Hunter',
    deployed: 'Higher-queen spies are embedded while Tyson\'s attendants spread the Book of Tyson and receive eye-wogs.',
    current: 'The camp remains cohesive, but the beast\'s taboo and coercive social effects are unresolved.',
  },
  {
    order: 7, prince: 'Luzurus', room: '1007', mother: 'Duazul', state: 'Active',
    original: 'Duazul Royal Guards, four personal guards, one servant, and three Pro Hunters including Basho',
    deployed: 'Satobi attends Nen lessons; Scairt and Ridge represent queen and military surveillance interests.',
    current: 'The room is under suspicion in Fugetsu\'s curse investigation while Cha-R sponsorship links it to lower-tier conflict.',
  },
  {
    order: 8, prince: 'Sale-sale', room: '1008', mother: 'Swinko-swinko', state: 'Confirmed deceased',
    original: 'Five personal guards, three servants, Swinko-swinko guards, and higher-queen spies',
    deployed: 'Mushaho represents the household; Rihan analyzes the beast and Yushohi completes Benjamin\'s assassination operation.',
    current: 'The contestant and his Guardian Spirit Beast are eliminated; surviving personnel require separate reassignment tracking.',
  },
  {
    order: 9, prince: 'Halkenburg', room: '1009 / body state split', mother: 'Unma by birth; raised by Duazul', state: 'Exceptional',
    original: 'Fourteen highly loyal personal guards and one higher-queen spy',
    deployed: 'Marked followers form the collective aura formation; Vict and Balsamilco become targets in successive possession operations.',
    current: 'The original body is dead while Halkenburg\'s consciousness operates through Balsamilco\'s body.',
  },
  {
    order: 10, prince: 'Kacho', room: '1010 / Without You continuation', mother: 'Seiko', state: 'Confirmed deceased / beast active',
    original: 'Melody, Keeney, personal staff, Seiko guards, and spies from higher queens',
    deployed: 'Melody and Keeney organize the banquet escape; Kaiser later coordinates with the surviving Guardian Spirit Beast copy.',
    current: 'Kacho is dead. Without You continues in her form beside Fugetsu and should not be recorded as Kacho surviving.',
  },
  {
    order: 11, prince: 'Fugetsu', room: '1011 / Justice protection', mother: 'Seiko', state: 'Active / protected custody',
    original: 'Personal staff, Seiko guards, higher-queen spies, and the shared twin protection plan',
    deployed: 'Melody, Kaiser, and Without You support movement, investigation, letters, and medical monitoring.',
    current: 'Fugetsu is exhausted and surrounded by curse-like spirits while Magical Worm remains a crucial route ability.',
  },
  {
    order: 12, prince: 'Momoze', room: '1012', mother: 'Sevanti', state: 'Confirmed deceased',
    original: 'A reduced guard detail including Hanzo, Tuffdy, Hunters, servants, and queen-assigned guards',
    deployed: 'Sevanti moves much of the household to Marayam; Tuffdy murders Momoze and Hanzo later kills him.',
    current: 'The room is no longer an active prince household; death, arrests, and reassignments remain linked to its record.',
  },
  {
    order: 13, prince: 'Marayam', room: '1013 / isolated Nen space', mother: 'Sevanti', state: 'Active / isolated',
    original: 'Biscuit, Hanzo, Belerainte, Vergei, transferred Hunters and servants, and queen-assigned guards',
    deployed: 'The household compares the occupied Nen space with an inaccessible empty version of Room 1013.',
    current: 'Marayam, Sevanti, and their protectors remain behind the Guardian Spirit Beast\'s spatial barrier.',
  },
  {
    order: 14, prince: 'Woble', room: '1014', mother: 'Oito', state: 'Active',
    original: 'Kurapika, Bill, Shimano, Sayird, Woody, Sandra, servants, and guards sent by higher queens',
    deployed: 'After mass deaths: Babimyna, Slakka, Sakata, and Hashito reinforce the room; rotating Nen students and observers enter daily.',
    current: 'Room 1014 is simultaneously a nursery, classroom, diplomatic hub, murder scene, surveillance post, and curse target.',
  },
].map((record) => ({ ...record, source: wiki('Kakin_Empire#Royal_Family') }));

export const personnelTransitions = [
  ['Day 1', '359–360', 'Room 1014 initial guard detail', 'Room 1014 protection', 'Deaths, manipulation, and detention reduce Woble’s effective defense to Kurapika, Bill, Shimano, and Sandra.', 'Collapsed / under investigation', 'Chapter_360'],
  ['Day 1', '361', 'Vincent / Babimyna', 'Benjamin command → Room 1014', 'Vincent attacks and dies; Babimyna becomes Benjamin’s replacement observer inside Woble’s room.', 'Replacement deployment', 'Chapter_361'],
  ['Day 1', '360–368', 'Sevanti household staff', 'Room 1012 → Room 1013', 'Sevanti transfers most protection from Momoze to Marayam, leaving Momoze exposed before her murder.', 'Reassignment with fatal consequence', 'Chapter_368'],
  ['Days 1–2', '368–371', 'Sakata, Hashito, and Slakka', 'Zhang Lei / Duazul networks → Room 1014', 'Additional guards enter Woble’s room as alliance representatives, observers, and political counterweights.', 'Active mixed loyalty', 'Chapter_371'],
  ['Day 2', '369–370', 'Loberry and Tuffdy', 'Nen class / Room 1012 → custody or death', 'Loberry is detained after Silent Majority uses her as an apparent host; Hanzo kills Tuffdy after obtaining his confession.', 'Detained / deceased', 'Chapter_370'],
  ['Day 2', '373', 'Camilla and Musse', 'VVIP area → Justice detention / Benjamin Baton', 'Camilla is confined after attacking Benjamin; Musse dies and his surveillance ability passes to Benjamin.', 'Detained / inherited ability', 'Chapter_373'],
  ['Days 5–8', '381–388', 'Kacho, Fugetsu, Melody, Kaiser', 'Twin rooms → lifeboat attempt → Justice protection', 'Kacho and Keeney die during the escape; Without You continues in Kacho’s form while Fugetsu and Melody enter protected custody.', 'Death / exceptional continuation', 'Chapter_388'],
  ['Days 5–8', '381–389', 'Sale-sale household', 'Room 1008 → eliminated household', 'Rihan destroys the Guardian Spirit Beast and Yushohi completes the assassination; surviving staff require separate status tracking.', 'Contestant eliminated', 'Chapter_389'],
  ['Days 10–12', '401–413', 'Longhi and Halkenburg/Balsamilco', 'Tubeppa alliance / Tier 2 operation → Room 1014 and funeral route', 'Moonlight Act binds Longhi to Kurapika; Halkenburg’s consciousness moves through Balsamilco while his original body proceeds toward burial.', 'Treaty / body-state split', 'Chapter_413'],
  ['Day 12', '411–412', 'Sarahell and expanded students', 'Camilla household and allied rooms → Room 1014', 'The second class adds beginners, experienced students, observers, and a disguised Have-Not curse threat near Woble.', 'Active infiltration risk', 'Chapter_412'],
].map(([day, chapters, subject, route, change, state, slug]) => ({ day, chapters, subject, route, change, state, source: wiki(slug) }));

export const legalProcedureLedger = [
  ['Ordinary murder investigation', 'Justice Bureau records scenes, witnesses, bodies, and suspects even when royal households are involved.', 'Kaiser, investigators, military police', 'Active throughout voyage', 'Succession_Contest'],
  ['Prince immunity and custody', 'Royal rank constrains ordinary arrest, but confinement, supervised movement, testimony, and protective custody remain possible.', 'Supreme Court / Ministry of Justice', 'Case-dependent', 'Kakin_Empire'],
  ['Witness and survivor protection', 'Melody, Fugetsu, and associated witnesses are controlled through access, medical observation, and monitored contact.', 'Justice Bureau', 'Active', 'Chapter_388'],
  ['Guard detention and hearings', 'Manipulated, accused, or implicated guards can be removed from prince rooms and questioned under Kakin procedure.', 'Justice officers / Royal Army', 'Active', 'Chapter_360'],
  ['Ordinary martial law', 'Military authority can restrict movement and policing without automatically resolving the ritual contest.', 'Royal Army', 'Declared condition', 'Succession_Contest#Martial_Law'],
  ['Special martial law', 'Emergency control closes the Tier 2–3 bulkhead, changes routes, and expands Benjamin’s operational leverage under a legal time limit.', 'Benjamin command / Justice oversight', 'Active on Day 12', 'Chapter_409'],
  ['Military reassignment', 'Benjamin’s soldiers rotate through royal rooms as observers, assassins, guards, and inherited-ability candidates.', 'Balsamilco command staff', 'Continuously changing', 'Benjamin_Hui_Guo_Rou'],
  ['Funeral and ritual transfer', 'Royal bodies move through public procession, security checkpoints, priestly reception, and the unexplained casket chamber.', 'Royal priests / Army / royal household', 'Developing through Chapter 413', 'Chapter_413'],
].map(([procedure, rule, authority, state, slug]) => ({ procedure, rule, authority, state, source: wiki(slug) }));

export const wobleCoreTimeline = [
  ['349-350', 'Before the voyage', 'Recruitment', 'Kurapika accepts the royal bodyguard route to reach Tserriednich, then discovers that his client is the infant Fourteenth Prince Woble.', 'Kurapika, Oito, Woble', 'Chapter_350'],
  ['358', 'Boarding', 'Room 1014', 'Oito and Woble enter the Black Whale with the smallest and least politically informed royal household.', 'Oito, Woble, Kurapika, Bill, Shimano', 'Chapter_358'],
  ['359', 'Day 1', 'First deaths', 'Woody and four guards die; Kurapika broadcasts the existence of Nen beasts to deter immediate attacks and force every room to react.', 'Kurapika, Bill, Oito, Woble, Woody', 'Chapter_359'],
  ['360-361', 'Day 1', 'Vincent operation', 'Sayird is detained, Vincent attacks, Sandra dies, and the surviving core must handle Benjamin\'s replacement soldier Babimyna.', 'Kurapika, Bill, Shimano, Sandra, Vincent, Babimyna', 'Chapter_361'],
  ['362-368', 'Day 1', 'Reconnaissance', 'Kurapika loans Little Eye to Oito. Her cockroach reconnaissance reaches other royal rooms before she witnesses the aftermath of Momoze\'s murder.', 'Oito, Kurapika, Bill, Zhang Lei, Momoze', 'Chapter_368'],
  ['368-371', 'Days 1-2', 'Alliance network', 'Zhang Lei sends Sakata and Hashito; Slakka joins them; Kurapika converts Room 1014\'s vulnerability into a lower-prince information alliance.', 'Kurapika, Oito, Sakata, Hashito, Slakka', 'Chapter_371'],
  ['369-390', 'Days 2-9', 'Nen classroom', 'Public lessons spread Nen literacy while Silent Majority kills Barrigen and Myuhan inside the room.', 'Kurapika, Bill, Furykov, Loberry, Barrigen, Myuhan', 'Succession_Contest#Kurapika%27s_Nen_lessons'],
  ['390', 'Day 9', 'Awakening result', 'The first class produces newly awakened participants, changing the military value of guards throughout Tier 1.', 'Kurapika, Bill, prince representatives', 'Chapter_390'],
  ['401', 'Day 10', 'Moonlight Act', 'Longhi binds a treaty with Kurapika and reveals Beyond\'s hidden curse-child network, turning Woble\'s room into the center of a second succession conspiracy.', 'Longhi, Kurapika, Oito, Woble', 'Chapter_401'],
  ['402-404', 'Days 11-12', 'Letters and coins', 'Kacho\'s letters pass through the royal tier while Oito, Woble, and Kurapika visit Zhang Lei to study his accumulating coins.', 'Oito, Woble, Kurapika, Zhang Lei', 'Chapter_404'],
  ['411-current', 'Day 12', 'Second class', 'Kurapika divides the expanded class by experience while Sarahell enters Room 1014 carrying a curse plan directed at Woble.', 'Kurapika, Bill, Shimano, Sarahell, Woble', 'Chapter_411'],
].map(([chapters, time, title, detail, people, slug]) => ({ chapters, time, title, detail, people, source: wiki(slug) }));

export const institutionLedger = [
  ['Kakin monarchy', 'Nasubi and the eight queen households', 'Defines royal legitimacy, succession rank, ceremony access, residences, and the concealed ritual contest.', 'Tier 1', 'Kakin_Royal_Family'],
  ['Kakin Royal Army', 'Benjamin, Balsamilco, officers, guards, and soldiers', 'Controls throughways, surveillance, reassignment, emergency response, and martial-law enforcement.', 'Shipwide; concentrated in Tiers 1-3', 'Kakin_Empire'],
  ['Ministry of Justice', 'Cleapatro, Kaiser, courts, investigators, and custody staff', 'Investigates murders, holds witnesses and princes, conducts hearings, and preserves a legal process inside the ritual war.', 'Tiers 1-3', 'Succession_Contest#Martial_Law'],
  ['Hunter Association', 'Zodiacs, Pro Hunters, and Provisional Hunters', 'Runs expedition preparation, medical and security work, and prince bodyguard contracts under Kakin jurisdiction.', 'Upper and civic decks', 'Hunter_Association'],
  ['V6 framework', 'Kakin and the five established powers', 'Authorizes and politically contains the public New Continent voyage and the concealed Dark Continent objective.', 'International layer', 'V6'],
  ['Beyond expedition', 'Beyond, Pariston, Ging, specialists, and Temp Hunters', 'Prepares the separate Dark Continent mission while Beyond remains detained and his children affect the royal plot.', 'Upper ship and background organization', 'Dark_Continent_Expedition'],
  ['Three mafia families', 'Xi-Yu, Cha-R, and Heil-Ly', 'Govern lower-tier territory, unofficial passage, commodities, violence, and the search for Hisoka.', 'Tiers 1, 3, 4, 5, and hidden band', 'Kakin_Empire#Mafia_Community'],
  ['Black Whale operations', 'Ship staff, suppliers, clinics, guards, and ticket controllers', 'Keeps a 200,000-person vessel functioning while class access and special martial law constrict movement.', 'All tiers', 'Black_Whale'],
].map(([name, people, authority, territory, slug]) => ({ name, people, authority, territory, source: wiki(slug) }));

export const voyageOperations = [
  ['Passenger classes', '200,000 total passengers; roughly 20,000 occupy the upper two tiers and 180,000 the lower three.', 'Manifest', 'Black_Whale#Passenger_List'],
  ['Registered and unofficial passengers', 'At least 500 mafia associates are unofficial passengers, while the twenty-three original Heil-Ly members boarded as civilians.', 'Manifest', 'Black_Whale#Passenger_List'],
  ['Security distribution', 'About 2,000 guards and soldiers serve the ship; 1,400 are concentrated in Tiers 1 and 2 and about 600 cover the lower tiers.', 'Security', 'Black_Whale#Passenger_List'],
  ['Medical capacity', 'The ship received far fewer clinics and doctors than planned. Tier 3 has the main medical ward; Tier 5 has no dedicated doctor.', 'Medical', 'Black_Whale#Passenger_List'],
  ['Central passages', 'Movement among lower tiers requires tickets controlled officially by the Royal Army and unofficially by mafia ticket-punchers.', 'Access', 'Black_Whale'],
  ['Tier 2-3 bulkhead', 'The emergency barrier opens only from Tier 2 and closes during special martial law, isolating the upper ship.', 'Access', 'Black_Whale#Tier_2'],
  ['Communications', 'The announcement system can broadcast shipwide, but upper-tier information is usually withheld from lower-tier channels.', 'Communications', 'Black_Whale'],
  ['Supplies and deliveries', 'Tier 1 stores can receive rare goods by drone, cargo blimp, or high-speed boat until voyage delivery deadlines.', 'Logistics', 'Black_Whale'],
  ['Food, cargo, and waste', 'Dining halls, warehouses, shops, clinics, and the sewage-processing band support the city-scale passenger load.', 'Infrastructure', 'Black_Whale'],
  ['Voyage stages', 'The public journey lasts about two months; the ship leaves normal waters, refuels, receives a final check, and closes its dome before hazardous waters.', 'Route', 'Black_Whale'],
  ['Courts and detention', 'The Supreme Court, Justice Bureau, police, holding rooms, and Beyond\'s cell form a layered custody system.', 'Justice', 'Black_Whale'],
  ['Civilian inequality', 'Lower tiers carry most passengers with a much thinner security and medical presence, leaving mafia groups to maintain parts of public order.', 'Conditions', 'Black_Whale#Passenger_List'],
].map(([name, detail, area, slug]) => ({ name, detail, area, source: wiki(slug) }));

export const sourceConfidenceLevels = [
  ['Direct', 'The fact is stated on the linked Hunterpedia entity or chapter page.', 'Use for names, rooms, explicit abilities, deaths, dates, and declared rules.'],
  ['Chapter-scoped', 'The record is tied to a specific chapter synopsis or ordered appearance list.', 'Use when scene order, location, or event timing matters.'],
  ['Aggregate', 'The record comes from a Hunterpedia directory, timeline, category, or organization table.', 'Use for rosters, guard assignments, passenger totals, and cross-chapter membership.'],
  ['In-story inference', 'A character proposes an explanation that the manga has not fully confirmed.', 'Keep the speaker or reasoning visible; never rewrite it as settled mechanics.'],
  ['Unknown', 'Hunterpedia and the published material do not establish the answer.', 'Show Unknown, disputed, approximate, or identity uncertain instead of completing the gap.'],
  ['Site analysis', 'A reading aid such as narrative pressure or a thematic connection is created by this study project.', 'Visually separate analysis from canon and never attribute it to Hunterpedia.'],
];

export const sourceRecordFields = [
  'Direct Hunterpedia page',
  'Chapter or scene source when applicable',
  'Image file or gallery source',
  'Confidence label',
  'Last reviewed date',
  'Canon fact, character inference, or site analysis',
  'Status-change chapter',
  'Unknown or disputed note',
];

export const crossLinkIndex = [
  ['Royal family', 'Parentage, queen branch, birth order, status, prince dossier, room, beast, guards', 'family-tree'],
  ['Prince dossier', 'Mother, strategy, Nen, Guardian Spirit Beast, team, pressure points, and Hunterpedia source', 'tab:royal'],
  ['Room assignment', 'Prince, household, original personnel, embedded personnel, reassignments, and current room state', 'tab:assignments'],
  ['Timeline event', 'Voyage day, time confidence, chapter, location, participants, result, and concurrent plot track', 'succession-timeline'],
  ['Black Whale location', 'Tier, access, controller, occupants, routes, operational status, and related events', 'black-whale'],
  ['Ability record', 'User, Nen type, mechanics, conditions, chapter debut, victims, and unresolved limits', 'tab:abilities'],
  ['Death or body state', 'Character, chapter, place, cause, responsible ability, legal response, and continuing effect', 'tab:status'],
  ['Maintained character roster', 'Portrait, canonical name, faction group, written state, and Hunterpedia entity source', 'succession-roster'],
  ['Chapter record', 'Title, phase, voyage day, source-checked focus, story lanes, and direct chapter page', 'tab:chapters'],
  ['Open mystery', 'Question, evidence boundary, confidence, latest relevant chapter, and unresolved status', 'tab:mysteries'],
].map(([name, connects, target]) => ({ name, connects, target }));
