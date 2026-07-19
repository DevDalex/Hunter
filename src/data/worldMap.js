const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const worldMapAssets = {
  clean: {
    src: '/world-map-reference.png',
    width: 1000,
    height: 566,
    label: 'Project-owner supplied labeled Known World map',
    source: wiki('World_of_Hunter_%C3%97_Hunter'),
    note: 'This exact supplied labeled image is the visible interactive base. Its coastlines, labels, proportions, and framing are preserved.',
  },
  reference: {
    src: '/world-map-reference.png',
    width: 1000,
    height: 566,
    label: 'Labeled placement reference',
    source: wiki('World_of_Hunter_%C3%97_Hunter'),
    note: 'Project-owner supplied labeled reference. Used to calibrate approximate marker placement, not as proof of exact coordinates.',
  },
};

export const placementStates = {
  confirmed: { label: 'Supported placement', note: 'The place and its broad map position are supported by the maintained reference.' },
  approximate: { label: 'Approximate placement', note: 'The point follows the supplied labeled map but does not claim exact coordinates.' },
  reference: { label: 'Reference-label placement', note: 'The label appears on the supplied map and still needs a dedicated Hunterpedia place record.' },
  conceptual: { label: 'Conceptual route position', note: 'The marker explains a relationship or departure direction rather than a canonical coordinate.' },
};

const marker = ({
  id, name, kind, x, y, parent = '', era = 'pre', arcs = [], summary, importance, source,
  confidence = 'approximate', basis = 'Supplied labeled world map', worldLocationId = '', labelPriority = 50,
  modes = ['explore', 'reference'], related = [], labelOffset = [0, 0], depth = 'anchor', alternateNames = [],
  geometryType = 'point', mapScale = 'known-world', sourceNote = 'The place record and broad map alignment are sourced separately; the marker does not claim survey-level coordinates.',
}) => ({
  id, name, kind, x, y, parent, era, arcs, summary, importance, source: source || wiki('World_of_Hunter_%C3%97_Hunter'),
  confidence, basis, worldLocationId, labelPriority, modes, related, labelOffset, depth, alternateNames,
  geometryType, mapScale, sourceNote,
});

export const worldMapLocations = [
  marker({ id: 'padokea', name: 'Republic of Padokea', kind: 'country', x: 25.0, y: 13.5, parent: 'northwestern-landmass', summary: 'The country containing Kukuroo Mountain in the supplied reference geography.', importance: 'Provides the political parent context for the Zoldyck estate route.', confidence: 'reference', related: ['Kukuroo Mountain', 'Mimbo Republic'], labelPriority: 70, modes: ['explore', 'political', 'reference'] }),
  marker({ id: 'kukuroo-mountain', name: 'Kukuroo Mountain', kind: 'landmark', x: 22.5, y: 13.8, parent: 'padokea', era: 'cross', arcs: ['Hunter Exam', 'Chairman Election'], summary: 'The mountain estate, public attraction, guarded approach, and private household territory of the Zoldyck Family.', importance: 'The rescue detour after the Hunter Exam and the later Alluka retrieval both begin here.', source: wiki('Kukuroo_Mountain'), confidence: 'approximate', worldLocationId: 'kukuroo-mountain', related: ['Zoldyck Family', 'Testing Gate', 'Alluka Zoldyck'], labelPriority: 100, modes: ['explore', 'journey', 'reference'], labelOffset: [-2, -7] }),
  marker({ id: 'mimbo-republic', name: 'Mimbo Republic', kind: 'country', x: 25.0, y: 20.6, parent: 'northwestern-landmass', summary: 'A country label visible in the supplied geographic reference.', importance: 'Retained for political-world orientation; no deeper story dossier is required.', confidence: 'reference', related: ['Republic of Padokea', 'Heaven’s Arena'], labelPriority: 45, modes: ['political', 'reference'] }),
  marker({ id: 'heavens-arena', name: 'Heaven’s Arena', kind: 'landmark', x: 36.2, y: 23.4, parent: 'mimbo-republic', era: 'cross', arcs: ['Heavens Arena', 'Succession preparation'], summary: 'The battle tower where Gon and Killua learn Nen and where Hisoka later fights Chrollo.', importance: 'Connects the 2011-anime Nen foundation to the conflict that drives the Troupe aboard the Black Whale.', source: wiki('Heavens_Arena'), confidence: 'approximate', worldLocationId: 'heavens-arena', related: ['Nen', 'Hisoka Morow', 'Chrollo Lucilfer'], labelPriority: 100, modes: ['explore', 'journey', 'reference'], labelOffset: [7, 0] }),

  marker({ id: 'hunter-selection-hotel', name: 'Hunter Selection Committee Hotel', kind: 'facility', x: 14.8, y: 31.3, parent: 'hunter-exam-region', arcs: ['Hunter Exam'], summary: 'A Hunter Exam administration label shown in the supplied reference.', importance: 'Functions as a broad exam-route anchor rather than a chapter-specific destination.', confidence: 'reference', related: ['Hunter Exam', 'Dolle Harbor', 'Zaban City'], labelPriority: 40, modes: ['explore', 'journey', 'reference'], labelOffset: [-8, -2] }),
  marker({ id: 'kukanyu-kingdom', name: 'Kukan’yu Kingdom', kind: 'country', x: 18.7, y: 41.2, parent: 'hunter-exam-region', arcs: ['Hunter Exam'], summary: 'A kingdom label positioned along the broad Hunter Exam route in the supplied reference.', importance: 'Political context only; no chapter-by-chapter expansion is planned.', confidence: 'reference', related: ['Dolle Harbor', 'Zaban City'], labelPriority: 40, modes: ['political', 'reference'] }),
  marker({ id: 'dolle-harbor', name: 'Dolle Harbor', kind: 'city', x: 18.1, y: 48.0, parent: 'kukanyu-kingdom', arcs: ['Hunter Exam'], summary: 'The port where Gon, Kurapika, and Leorio begin the concealed route toward the Hunter Exam.', importance: 'The first useful mapped stop after Gon leaves Whale Island.', source: wiki('Dolle_Harbor'), confidence: 'approximate', worldLocationId: 'dolle-harbor', related: ['Whale Island', 'Zaban City', 'Hunter Exam'], labelPriority: 90, modes: ['explore', 'journey', 'reference'], labelOffset: [-6, 6] }),
  marker({ id: 'zaban-city', name: 'Zaban City', kind: 'city', x: 19.2, y: 47.0, parent: 'kukanyu-kingdom', arcs: ['Hunter Exam'], summary: 'The city containing the concealed entrance to the 287th Hunter Exam route.', importance: 'Links the surface journey to the underground first phase.', source: wiki('Zaban_City'), confidence: 'approximate', worldLocationId: 'zaban-city', related: ['287th Hunter Exam Site Restaurant', 'Milsy Wetlands'], labelPriority: 92, modes: ['explore', 'journey', 'reference'], labelOffset: [7, -6] }),
  marker({ id: 'milsy-wetlands', name: 'Milsy Wetlands', alternateNames: ['Numere Wetlands on the supplied reference'], kind: 'region', x: 20.1, y: 49.4, parent: 'hunter-exam-region', arcs: ['Hunter Exam'], summary: 'The dangerous wetland used during the first phase of the 287th Hunter Exam.', importance: 'A broad terrain anchor whose preferred Hunterpedia name differs from the label on the supplied map.', source: wiki('Milsy_Wetlands'), confidence: 'reference', worldLocationId: 'milsy-wetlands', related: ['Satotz', 'Hunter Exam'], labelPriority: 60, modes: ['explore', 'journey', 'reference'], labelOffset: [9, 2], sourceNote: 'Hunterpedia supports “Milsy Wetlands”; the supplied reference uses “Numere Wetlands,” so the marker preserves both names.' }),
  marker({ id: 'glam-gas-land', name: 'Glam Gas Land', alternateNames: ['Glama Gas Land on the supplied reference'], kind: 'region', x: 20.7, y: 57.5, parent: 'saherta', arcs: ['Hunter Exam'], summary: 'A region label visible on the supplied map and listed by Hunterpedia under the United States of Saherta.', importance: 'Retained as geographic context rather than expanded into a chapter dossier.', confidence: 'reference', related: ['United States of Saherta', 'Zaban City'], labelPriority: 30, modes: ['political', 'reference'] }),

  marker({ id: 'saherta', name: 'United States of Saherta', kind: 'country', x: 20.7, y: 56.0, parent: 'yorbian-continent', era: 'cross', summary: 'A country/federation label occupying the western portion of the Yorbian Continent in the supplied map.', importance: 'Provides political context for Yorknew and the Gordeau Desert.', confidence: 'reference', related: ['Yorknew City', 'Gordeau Desert'], labelPriority: 70, modes: ['explore', 'political', 'reference'], labelOffset: [1, 11] }),
  marker({ id: 'gordeau-desert', name: 'Gordeau Desert', kind: 'region', x: 13.5, y: 67.6, parent: 'saherta', arcs: ['Yorknew City'], summary: 'A desert label positioned near Yorknew in the supplied reference.', importance: 'Regional context only; exact boundaries are not asserted.', confidence: 'reference', related: ['Yorknew City', 'United States of Saherta'], labelPriority: 45, modes: ['explore', 'political', 'reference'], labelOffset: [-6, -2] }),
  marker({ id: 'yorknew-city', name: 'Yorknew City', kind: 'city', x: 13.3, y: 69.3, parent: 'saherta', era: 'cross', arcs: ['Yorknew City'], summary: 'The auction metropolis where Kurapika, the Mafia Community, collectors, Hunters, and the Phantom Troupe converge.', importance: 'Kurapika’s first major revenge operation and the central location of the Yorknew arc.', source: wiki('Yorknew_City'), confidence: 'approximate', worldLocationId: 'yorknew-city', related: ['Kurapika', 'Phantom Troupe', 'Mafia Community'], labelPriority: 100, modes: ['explore', 'journey', 'reference'], labelOffset: [-1, 8] }),
  marker({ id: 'yorbian-continent', name: 'Yorbian Continent', alternateNames: ['Yorobia on the supplied reference'], kind: 'continent', x: 29.0, y: 70.0, summary: 'One of the two Known World continents named by Hunterpedia; the supplied map labels this landmass “Yorobia.”', importance: 'Orientation label only; it is not a country.', source: wiki('Yorbian_Continent'), confidence: 'reference', related: ['United States of Saherta', 'Republic of East Gorteau'], labelPriority: 25, modes: ['political', 'reference'] }),

  marker({ id: 'rokario', name: 'Republic of Rokario', alternateNames: ['Republic of Rukario on the supplied reference'], kind: 'country', x: 28.9, y: 93.7, parent: 'southern-states', arcs: ['Chimera Ant'], summary: 'A member state of the Mitene Union in the southern island cluster.', importance: 'Political-world context rather than a primary story destination.', source: wiki('Republic_of_Rokario'), confidence: 'reference', related: ['NGL', 'Republic of East Gorteau'], labelPriority: 30, modes: ['political', 'reference'], sourceNote: 'Hunterpedia’s preferred spelling is “Rokario”; the supplied map visibly uses “Rukario.”' }),
  marker({ id: 'ngl', name: 'NGL', kind: 'country', x: 29.5, y: 97.0, parent: 'southern-states', arcs: ['Chimera Ant'], summary: 'The isolationist state where the Chimera Ant outbreak grows behind restrictive borders and a concealed criminal system.', importance: 'The crisis route begins here before moving into East Gorteau.', source: wiki('NGL'), confidence: 'approximate', worldLocationId: 'ngl', related: ['Gyro', 'Chimera Ants', 'Kite'], labelPriority: 100, modes: ['explore', 'journey', 'political', 'reference'], labelOffset: [-5, -7] }),
  marker({ id: 'west-gorteau', name: 'Republic of West Gorteau', kind: 'country', x: 31.5, y: 95.6, parent: 'southern-states', arcs: ['Chimera Ant'], summary: 'A neighboring state label in the supplied reference.', importance: 'Regional context only; no deep chapter treatment is required.', confidence: 'reference', related: ['Republic of East Gorteau', 'NGL'], labelPriority: 25, modes: ['political', 'reference'] }),
  marker({ id: 'east-gorteau', name: 'Republic of East Gorteau', kind: 'country', x: 33.1, y: 94.9, parent: 'southern-states', arcs: ['Chimera Ant'], summary: 'The authoritarian state seized by Meruem’s faction and reorganized around the national Selection.', importance: 'The late Chimera Ant arc’s political and operational geography.', source: wiki('Republic_of_East_Gorteau'), confidence: 'approximate', worldLocationId: 'east-gorteau', related: ['Meruem', 'Peijin', 'Royal Palace of East Gorteau'], labelPriority: 100, modes: ['explore', 'journey', 'political', 'reference'], labelOffset: [9, 2] }),
  marker({ id: 'hass', name: 'Republic of Hass', kind: 'country', x: 31.7, y: 98.2, parent: 'southern-states', arcs: ['Chimera Ant'], summary: 'A southern republic label shown beside the Gorteau states.', importance: 'Political-world context pending dedicated verification.', confidence: 'reference', related: ['Republic of East Gorteau', 'NGL'], labelPriority: 20, modes: ['political', 'reference'] }),

  marker({ id: 'greed-island', name: 'Greed Island', kind: 'island', x: 47.0, y: 69.4, parent: 'known-ocean', arcs: ['Greed Island'], summary: 'A physical island transformed into a rule-bound Nen game with cities, cards, transport spells, monsters, and Game Masters.', importance: 'The 2011 adaptation’s game arc and a bridge between Nen training and the Chimera Ant crisis.', source: wiki('Greed_Island'), confidence: 'approximate', worldLocationId: 'greed-island', related: ['Ging Freecss', 'Biscuit Krueger', 'Game Masters'], labelPriority: 100, modes: ['explore', 'journey', 'reference'], labelOffset: [0, -8] }),
  marker({ id: 'begerosse-union', name: 'Begerossé Union', kind: 'country', x: 59.0, y: 83.5, parent: 'central-island', summary: 'A union label occupying the central southern island in the supplied reference.', importance: 'Political-world orientation pending dedicated verification.', confidence: 'reference', related: ['Known World'], labelPriority: 35, modes: ['political', 'reference'] }),

  marker({ id: 'azian-continent', name: 'Azian Continent', alternateNames: ['Azia on the supplied reference'], kind: 'continent', x: 78.0, y: 34.5, summary: 'One of the two Known World continents named by Hunterpedia; the supplied map labels it “Azia.”', importance: 'Orientation label only; it is not a country.', source: wiki('Azian_Continent'), confidence: 'reference', related: ['Kakin Empire', 'Federation of Ochima'], labelPriority: 30, modes: ['political', 'reference'] }),
  marker({ id: 'kakin-port', name: 'Kakin Port City', kind: 'city', x: 66.0, y: 39.4, parent: 'kakin-empire', era: 'succession', arcs: ['Succession preparation'], summary: 'The port-city label associated with Kakin’s expedition and the Black Whale departure context.', importance: 'The geographic handoff from national preparation to the voyage.', source: wiki('Kakin_Empire'), confidence: 'reference', related: ['Kakin Empire', 'Black Whale 1'], labelPriority: 95, modes: ['explore', 'succession', 'reference'], labelOffset: [-1, -8], depth: 'researched' }),
  marker({ id: 'kakin-empire', name: 'Kakin Empire', kind: 'country', x: 75.0, y: 49.6, parent: 'azian-continent', era: 'succession', arcs: ['Dark Continent Expedition', 'Succession Contest'], summary: 'The state that announces the public expedition, joins the V6, builds the Black Whale fleet, and conducts the royal succession ritual.', importance: 'Political origin of the current voyage and every Kakin royal household.', source: wiki('Kakin_Empire'), confidence: 'approximate', worldLocationId: 'kakin-empire', related: ['Nasubi Hui Guo Rou', 'Kakin Royal Family', 'Black Whale 1'], labelPriority: 100, modes: ['explore', 'political', 'succession', 'reference'], labelOffset: [2, 8], depth: 'deep' }),
  marker({ id: 'black-whale-voyage', name: 'Black Whale departure route', kind: 'voyage', x: 63.5, y: 32.5, parent: 'kakin-port', era: 'succession', arcs: ['Succession Contest'], summary: 'A conceptual ocean marker linking Kakin’s departure context to the current ship and the outward expedition route.', importance: 'Opens the five-tier Black Whale atlas; it is not a claim about the ship’s exact current coordinate.', source: wiki('Black_Whale'), confidence: 'conceptual', related: ['Black Whale 1', 'New Continent', 'Dark Continent'], labelPriority: 100, modes: ['succession', 'reference'], labelOffset: [9, -1], depth: 'deep' }),
  marker({ id: 'ochima', name: 'Federation of Ochima', kind: 'country', x: 80.5, y: 65.2, parent: 'azian-continent', summary: 'A federation label on the southeastern landmass in the supplied reference.', importance: 'Political-world orientation rather than a primary story destination.', source: wiki('Federation_of_Ochima'), confidence: 'reference', related: ['Kakin Empire', 'Azian Continent'], labelPriority: 35, modes: ['political', 'reference'] }),
];

export const worldMapUnplacedLocations = [
  { id: 'whale-island', name: 'Whale Island', kind: 'island', era: 'pre', note: 'Gon’s story origin is canonically important, but Hunterpedia lists its world position as unknown; the atlas therefore starts the pinned route at Dolle Harbor.', related: ['Gon Freecss', 'Mito Freecss', 'Chapter 1'], source: wiki('Whale_Island'), modes: ['explore', 'journey', 'reference'] },
  { id: 'kurta-settlement', name: 'Kurta Clan settlement', kind: 'settlement', era: 'pre', note: 'Volume 0 establishes the settlement and Lukso Province context without supporting a precise pin on this world image.', related: ['Kurapika', 'Pairo', 'Kurta Clan'], source: wiki('Kurta_Clan'), modes: ['explore', 'journey', 'reference'] },
  { id: 'zevil-island', name: 'Zevil Island', kind: 'island', era: 'pre', note: 'Hunterpedia lists its broader political placement as an inference, so no exact island point is published here.', related: ['Hunter Exam', 'Fourth Phase'], source: wiki('Zevil_Island'), modes: ['explore', 'journey', 'reference'] },
  { id: 'meteor-city', name: 'Meteor City', kind: 'city', era: 'cross', note: 'Hunterpedia maintains the place but lists its world position among unknown locations.', related: ['Phantom Troupe', 'Chrollo Lucilfer', 'Chimera Ant'], source: wiki('Meteor_City'), modes: ['explore', 'reference'] },
  { id: 'new-continent', name: 'New Continent', kind: 'outside-world destination', era: 'succession', note: 'The public expedition destination belongs to the Lake Mobius / voyage scale, not this Known World projection.', related: ['Black Whale 1', 'Morel Mackernasey', 'Kakin Empire'], source: wiki('New_Continent'), modes: ['succession', 'reference'] },
  { id: 'dark-continent', name: 'Dark Continent', kind: 'outside-world region', era: 'succession', note: 'The true expedition objective surrounds Lake Mobius and cannot be represented as a point inside the Known World map.', related: ['Beyond Netero', 'Five Threats', 'Lake Mobius'], source: wiki('Dark_Continent'), modes: ['succession', 'reference'] },
];

export const worldMapLocationsById = new Map(worldMapLocations.map((location) => [location.id, location]));

export const worldMapModes = [
  { id: 'explore', label: 'Explore', note: 'Major story places and geographic context.' },
  { id: 'journey', label: 'Story journey', note: 'Selected anchor stops—not 339 chapter points.' },
  { id: 'political', label: 'Political world', note: 'Countries and large regions without invented borders.' },
  { id: 'succession', label: 'Succession voyage', note: 'Kakin, its port, and the outward Black Whale handoff.' },
  { id: 'reference', label: 'Label reference', note: 'Inspect every point against the supplied labels.' },
];

export const worldMapRoutes = [
  {
    id: 'pre-journey', label: 'Pre-Succession journey anchors', era: 'pre', color: '#1b6248', dash: '',
    stops: ['dolle-harbor', 'zaban-city', 'hunter-selection-hotel', 'kukuroo-mountain', 'heavens-arena', 'yorknew-city', 'greed-island', 'ngl', 'east-gorteau'],
    note: 'Narrative order only. The connecting line does not claim precise travel paths, distance, or duration.',
  },
  {
    id: 'kurapika-route', label: 'Kurapika’s mapped story anchors', era: 'cross', color: '#7d2635', dash: '5 5',
    stops: ['dolle-harbor', 'zaban-city', 'hunter-selection-hotel', 'kukuroo-mountain', 'yorknew-city', 'kakin-port', 'black-whale-voyage'],
    note: 'A curated cross-era route. The Kurta settlement is omitted because an exact map placement is not asserted.',
  },
  {
    id: 'succession-voyage', label: 'Kakin to Black Whale handoff', era: 'succession', color: '#c9a45d', dash: '8 6',
    stops: ['kakin-empire', 'kakin-port', 'black-whale-voyage'],
    note: 'Shows the national-to-voyage handoff. The marker is conceptual and does not represent a current ship coordinate.',
  },
];

export const worldMapKinds = [
  ['all', 'All place types'],
  ['country', 'Countries'],
  ['city', 'Cities & ports'],
  ['landmark', 'Landmarks'],
  ['facility', 'Facilities'],
  ['region', 'Regions'],
  ['island', 'Islands'],
  ['continent', 'Large regions'],
  ['voyage', 'Voyage links'],
];

export const worldMapStats = {
  markers: worldMapLocations.length,
  approximate: worldMapLocations.filter((item) => item.confidence === 'approximate').length,
  reference: worldMapLocations.filter((item) => item.confidence === 'reference').length,
  routes: worldMapRoutes.length,
};
