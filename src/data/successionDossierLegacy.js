const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;
import { chapterTitles } from './chapterTitles';
import { successionDays, successionPrelude, timelineTracks } from './successionTimelineLegacy';

export const successionNavigation = [
  ['overview', 'Scope & source status'],
  ['royal', 'Royal family tree', 'family-tree'],
  ['royal', 'Fourteen prince dossiers'],
  ['assignments', 'Queens, guards & room assignments'],
  ['beasts', 'Guardian Spirit Beasts'],
  ['timeline', 'Timeline', 'succession-timeline'],
  ['routes', 'Black Whale atlas', 'black-whale'],
  ['abilities', 'Nen lessons & abilities'],
  ['mafia', 'Mafia families'],
  ['troupe', 'Phantom Troupe & Hisoka'],
  ['justice', 'Justice & military'],
  ['expedition', 'Expedition layer'],
  ['core', 'Woble / Oito / Kurapika thread'],
  ['status', 'Death & body-state ledger'],
  ['operations', 'Conflicts and operations'],
  ['objects', 'Objects and evidence'],
  ['chapters', 'Chapter-by-chapter index'],
  ['mysteries', 'Mysteries'],
  ['links', 'Cross-linked entity views'],
  ['sources', 'Sources and confidence'],
].map(([tab, label, target], index) => ({ order: index + 1, tab, label, target }));

export const successionPeriods = [
  {
    name: 'Expedition setup',
    chapters: '340-348',
    status: 'pre-voyage',
    summary: 'Beyond announces the Dark Continent expedition, Kakin enters the V5/V6 political frame, the Zodiacs reorganize, and Kurapika is recruited into the bodyguard mission.',
    focus: ['Beyond Netero', 'V5 becomes V6', 'Zodiacs', 'Kurapika and Leorio', 'Dark Continent plan'],
    source: wiki('Dark_Continent_Expedition_arc'),
  },
  {
    name: 'Succession preparation',
    chapters: '349-358',
    status: 'boarding',
    summary: 'The Seed Urn and bodyguard recruitment establish the royal contest. The Hisoka-Chrollo battle supplies the Troupe conflict that will follow aboard, and Chapter 358 boards every class of passenger.',
    focus: ['Seed Urn', 'Bodyguard recruitment', 'Hisoka vs Chrollo', 'Troupe consequence', 'Boarding'],
    source: wiki('Succession_Contest_arc'),
  },
  {
    name: 'Active contest and voyage',
    chapters: '359-current',
    status: 'active deathmatch',
    summary: 'The Black Whale departs and the royal contest becomes active while the mafia war, Justice Bureau investigations, military authority, Nen lessons, and expedition background move in parallel.',
    focus: ['Voyage days', 'Royal murders', 'Nen classes', 'Mafia conflict', 'Special martial law'],
    source: wiki('Succession_Contest'),
  },
];

const chapterPhaseFor = (number) => {
  if (number <= 348) return 'Expedition setup';
  if (number <= 350) return 'Succession preparation';
  if (number <= 357) return 'Heavens Arena interlude';
  if (number === 358) return 'Boarding';
  return 'Active contest and voyage';
};

const chapterLanesFor = (number) => {
  if (number <= 348) return ['Expedition politics', 'Zodiacs', 'Beyond', 'Kurapika recruitment'];
  if (number <= 350) return ['Seed Urn ritual', 'Prince introductions', 'Guard recruitment'];
  if (number <= 357) return ['Hisoka vs Chrollo', 'Phantom Troupe consequence', 'Nen combat'];
  if (number === 358) return ['Boarding', 'Black Whale', 'Royal family', 'Passenger classes'];
  const lanes = ['Royal contest', 'Kurapika / Woble', 'Nen development'];
  if (number >= 377) lanes.push('Mafia / Troupe');
  if (number >= 383) lanes.push('Justice Bureau');
  if (number >= 391) lanes.push('Heil-Ly');
  if (number >= 401) lanes.push('Beyond curse network');
  return lanes;
};

const princeMafiaLinks = {
  3: 'Xi-Yu sponsorship through Onior Longbao',
  4: 'Former Heil-Ly sponsorship through Morena Prudo',
  7: 'Cha-R sponsorship through Brocco Li',
};

const chapterDayFor = (number) => {
  if (number < 359) return 'Pre-voyage';
  if (number <= 368) return 'Voyage Day 1';
  if (number <= 373) return 'Voyage Day 2';
  if (number <= 376) return 'Voyage Day 3';
  if (number <= 380) return 'Voyage Day 4';
  if (number === 381) return 'Voyage Day 5';
  if (number === 382) return 'Voyage Days 6-7';
  if (number === 383) return 'Voyage Days 7-8';
  if (number <= 387) return 'Voyage Day 8';
  if (number <= 390) return 'Voyage Day 9';
  if (number <= 402) return 'Voyage Day 10';
  if (number === 403) return 'Voyage Day 11';
  return 'Voyage Day 12';
};

export const chapterFocus = {
  340: 'Nasubi publicly announces Kakin\'s Dark Continent voyage and introduces Beyond Netero, prompting the V5 to order the Zodiacs to hunt him.',
  341: 'The International Permit Agency shows Steiner the human cost of earlier expeditions and introduces Journey to the New World and the returned calamities.',
  342: 'Beyond predicts that the Zodiacs will escort him to the Dark Continent while the V5 moves to absorb Kakin into a new V6 framework.',
  343: 'Cheadle invites Leorio into the Zodiacs, while Ging and Pariston expose their opposing plans for the Association and Beyond\'s expedition team.',
  344: 'Kurapika\'s Scarlet Eyes objective, Gon\'s lost access to Nen, Ging\'s bid for expedition authority, and the Five Threats are brought into one frame.',
  345: 'Ging tells Gon to treat his return to normal as a chance to find a new goal; Gon returns to Whale Island while Beyond\'s team divides over Ging.',
  346: 'Kurapika and Leorio formally join the Zodiacs, Kakin joins the V6, and Kurapika warns that Beyond already has allies inside the Association.',
  347: 'Ging dismantles a staged attack by copying and extending Leorio\'s remote-punch technique, proving his value to the expedition group.',
  348: 'Kurapika uses Dowsing Chain during the final Hunter Exam screening and explains how manipulation or altered memories could defeat his lie test.',
  349: 'Tserriednich learns the succession rules, the fourteen princes are introduced, and the Seed Urn ceremony implants Guardian Spirit Beast eggs.',
  350: 'Kurapika recruits Biscuit, Basho, Izunavi, Hanzo, and Melody to enter six prince households and seek a route to Tserriednich.',
  351: 'Hisoka and Chrollo begin their promised death match at Heavens Arena, with Chrollo immediately using Black Voice and a prepared ability set.',
  352: 'Chrollo explains Order Stamp, Gallery Fake, and the bookmark while building the multi-ability system he prepared specifically for Hisoka.',
  353: 'Chrollo hides among the audience and drives a growing crowd of stamped puppets against Hisoka.',
  354: 'Hisoka turns severed puppet heads into weapons and tries to constrain Chrollo\'s ability sequence by keeping one puppet active.',
  355: 'Hisoka discovers how Sun and Moon preserves marked copies and realizes that Chrollo has converted the crowd into persistent explosives.',
  356: 'Chrollo\'s explosive puppet plan overwhelms Hisoka as chained blasts and the crowd cut off his escape routes.',
  357: 'Hisoka revives through post-mortem Bungee Gum, kills Kortopi and Shalnark, and declares that he will hunt the Troupe on sight.',
  358: 'Kakin stages the departure celebration as Nasubi, Beyond, the princes, VIPs, and civilians board the Black Whale by class.',
  359: 'The ship departs, Guardian Spirit Beasts appear, Woody and other guards die, and Kurapika broadcasts Nen information from Room 1014.',
  360: 'Sayird is detained after a manipulated attack, Woble\'s guard detail collapses, and Kurapika develops a parasitic-Nen explanation for the crisis.',
  361: 'Benjamin deploys soldiers into rival rooms; Vincent attacks Woble\'s household, kills Sandra, and dies after Kurapika and Bill stop him.',
  362: 'Benjamin\'s observers settle into prince rooms while Zhang Lei receives a mysterious coin and Kurapika searches for a stabilizing alliance.',
  363: 'Kurapika compares the unknown Nen beasts with known ability rules as Oito weighs the danger of borrowing Little Eye.',
  364: 'The prince camps analyze Kurapika\'s emergency disclosure and the distinction between a host, a parasite, and an autonomous Nen beast.',
  365: 'Oito accepts Little Eye and uses a cockroach as a covert scout, giving Room 1014 a temporary route through the royal residences.',
  366: 'The royal households reveal separate survival choices while Momoze\'s wandering beast seeks a target and her own aura begins to fail.',
  367: 'Oito\'s reconnaissance crosses prince rooms as Emperor Time exhausts Kurapika and the pressure around Momoze intensifies.',
  368: 'Momoze is murdered after her protection is reduced; Oito witnesses the aftermath and Kurapika opens direct cooperation with Zhang Lei.',
  369: 'Kurapika begins the first public Nen class in Room 1014, where Silent Majority possesses Loberry and kills Barrigen.',
  370: 'Hanzo\'s double obtains Tuffdy\'s confession and kills Momoze\'s murderer while Benjamin\'s soldiers continue their ability reconnaissance.',
  371: 'Kurapika turns the class into diplomatic cover for a lower-prince alliance and negotiates personnel support for Woble.',
  372: 'Hanzo\'s astral double investigates the murder aftermath while guards, arrests, and room assignments continue to shift.',
  373: 'Camilla kills Musse, reveals the lethal revival ability Cat\'s Name, confronts Benjamin, and is taken into custody.',
  374: 'Fugetsu\'s Magical Worm opens a route to Kacho while multiple Guardian Spirit Beast abilities begin to show their rules.',
  375: 'Benjamin\'s soldiers compare royal beasts and assassination methods, with Rihan preparing Predator through sustained analysis.',
  376: 'Silent Majority kills Myuhan as Zhang Lei\'s coins, Halkenburg\'s group aura, and Tserriednich\'s Specialist result reshape the contest.',
  377: 'Kacho and Fugetsu build an escape plan around the Sunday banquet while the Troupe\'s presence starts changing lower-tier calculations.',
  378: 'The three mafia families enter the foreground, Morena activates Contagion, and the organized search for Hisoka begins.',
  379: 'Troupe search teams and mafia personnel divide territory, exchange information, and test how much cooperation each side can tolerate.',
  380: 'The Royal Army responds to lower-tier violence while the Phantom Troupe secures access and a working arrangement with Cha-R.',
  381: 'Rihan\'s Predator destroys Sale-sale\'s Guardian Spirit Beast as Fugetsu returns under guard and banquet surveillance tightens.',
  382: 'Halkenburg confronts Nasubi, awakens the collective possession arrow, tests it on Shikaku, and Benjamin\'s side assassinates Sale-sale.',
  383: 'Melody\'s banquet performance covers the twin escape; Keeney and Kacho die, Without You manifests, and Tserriednich\'s Zetsu training deepens.',
  384: 'The failed escape moves into Justice custody while Theta prepares to exploit Tserriednich\'s Zetsu state as an assassination window.',
  385: 'Tserriednich experiences the first clear operation of Parallel Future and survives Theta\'s attempt without the room perceiving the divergence.',
  386: 'Tserriednich and Theta separately reason through the future-sight sequence, its Zetsu trigger, and the danger of repeating the test.',
  387: 'Theta faces the mark and warning imposed by Tserriednich\'s Guardian Spirit Beast while his rapid training continues.',
  388: 'Melody, Fugetsu, and the Kacho copy remain under Justice Bureau protection as royal camps review the escape and Camilla\'s curse strategy.',
  389: 'Camilla\'s Have-Nots and their death-powered curses are explained while Shikaku\'s possessed body dies and Fugetsu\'s condition worsens.',
  390: 'Kurapika\'s first class produces newly awakened students while mafia, Heil-Ly, and Troupe interests close on the same lower-tier conflict.',
  391: 'Hinrigh, Zakuro, and Lynch continue the Hisoka search as Heil-Ly violence on Tier 3 turns a public corridor into a Nen battlefield.',
  392: 'Hinrigh contains Padaille and negotiates for information about Morena\'s base while the mafia weighs police, Troupe, and Heil-Ly risks.',
  393: 'Nobunaga rejects Luini\'s proposal and kills him, committing the Troupe to destroying Heil-Ly while still hunting Hisoka.',
  394: 'The mafia tests Room 3101, exposes a teleportation trap, and loses another person while planning to send the Troupe through it.',
  395: 'Hinrigh maps the Heil-Ly route around Room 3101 before the story turns to the Troupe\'s childhood dubbing group in Meteor City.',
  396: 'Young Chrollo organizes a dubbed screening with Sarasa, Sheila, Uvogin, Phinks, and the children who will become the Phantom Troupe.',
  397: 'Sarasa disappears and is murdered, leading Chrollo and the others toward the organization, skills, and vengeance that define the Troupe.',
  398: 'Nobunaga, Phinks, and Feitan reason through the Room 3101 teleport trap and force a mafia escort to test the route.',
  399: 'Hinrigh and Nobunaga enter the concealed rooms, inspect the abandoned laundry and hideout traces, and are expelled from the route.',
  400: 'The transmitter signal places Heil-Ly above or below Tier 3 while Troupe and mafia teams protect sensitive information and reposition.',
  401: 'Longhi reveals Moonlight Act and Beyond\'s curse-child network, then offers Kurapika a binding alliance centered on Woble\'s survival.',
  402: 'Zhang Lei, Tubeppa, and Woble formalize a lower-prince arrangement while Kacho\'s letters carry warnings and requests across Tier 1.',
  403: 'Balsamilco enters the Tier 2 courthouse to poison Halkenburg, but Halkenburg\'s prepared possession operation turns the attack back on him.',
  404: 'Kurapika tests Zhang Lei\'s changing coins while Halkenburg, operating through Balsamilco, advances the TSK-17 death-and-funeral plan.',
  405: 'Hisoka appears in the Tier 1 casino while funeral preparations and the competing searches bring Hisoka, Chrollo, and the upper tiers closer.',
  406: 'Tajao leads Nobunaga, Phinks, and Feitan toward Tier 2 as Chrollo connects Kakin\'s national treasures to the ability he needs against Hisoka.',
  407: 'Halkenburg\'s funeral procession moves through the ship as Borksen disappears and is brought to Morena for recruitment.',
  408: 'Morena and Borksen begin the negotiation card game, using the Aim exchange to test information, intent, and the limits of refusal.',
  409: 'Special martial law locks down the tiers while the card game continues and Borksen recalculates the cost of every remaining choice.',
  410: 'Borksen is forced into a final Yes while Morena identifies her marked-card tactic and defines the consequences of joining Heil-Ly.',
  411: 'Halkenburg schedules the funeral through Balsamilco\'s body; Kaiser and Melody monitor Fugetsu; Sarahell enters Kurapika\'s expanded second class.',
  412: 'Kurapika explains the four-stage Kakin ritual, its vows and limitations, and the political consequence of failing to establish a sole successor before the voyage deadline.',
  413: 'Halkenburg\'s casket and guards reach the gate of Nasubi\'s quarters, where Nugui and the royal priests receive the procession as loyalties around the ritual tighten.',
};

const chapterEvents = successionDays.flatMap((day) => day.events.map((event) => ({ ...event, voyageDay: day.day, date: day.date })));
const timelineTrackNames = Object.fromEntries(timelineTracks.map((track) => [track.id, track.label]));
const chapterInRange = (number, value) => {
  const matches = String(value).match(/\d{3}/g)?.map(Number) || [];
  if (!matches.length) return false;
  return number >= matches[0] && number <= (matches[1] || matches[0]);
};

export const successionChapterResearch = Array.from({ length: 74 }, (_, index) => {
  const number = 340 + index;
  const events = chapterEvents.filter((event) => event.chapter === number);
  const prelude = successionPrelude.filter((event) => chapterInRange(number, event.chapters));
  const trackIds = [...new Set(events.flatMap((event) => event.tracks))];
  return {
    number,
    title: chapterTitles[number - 1],
    phase: chapterPhaseFor(number),
    voyageDay: chapterDayFor(number),
    lanes: chapterLanesFor(number),
    focus: chapterFocus[number],
    events,
    prelude,
    locations: [...new Set(events.map((event) => event.location))],
    threadLabels: trackIds.map((track) => timelineTrackNames[track] || track),
    confidence: [...new Set(events.map((event) => event.confidence))],
    status: events.length ? 'Local summary + chronology linked' : 'Local study summary',
    coverage: {
      summary: true,
      chronology: events.length > 0 || prelude.length > 0,
      locations: events.length > 0,
      source: true,
    },
    lastReviewed: 'July 14, 2026',
    source: wiki(`Chapter_${number}`),
  };
});

export const princeDossiers = [
  {
    order: 1, name: 'Benjamin Hui Guo Rou', short: 'Benjamin', mother: 'Unma', room: '1001 / VVIP confinement', status: 'active',
    strategy: 'Uses his military rank, elite private soldiers, surveillance, and inherited abilities to dominate the legal and tactical board.',
    nen: 'Enhancer; Benjamin Baton inherits the abilities of loyal deceased soldiers who graduated from Kakin’s military academy.',
    beast: 'Beetle-like Guardian Spirit Beast; it has dispelled low-level curse spirits, while its complete rules remain unknown.',
    team: ['Balsamilco Might', 'Babimyna', 'Furykov', 'Rihan', 'Yushohi', 'Vict'],
    pressure: ['Halkenburg’s possession operation', 'Camilla’s counterattack', 'Martial-law scrutiny', 'Unknown royal beasts'],
    source: wiki('Benjamin_Hui_Guo_Rou'),
  },
  {
    order: 2, name: 'Camilla Hui Guo Rou', short: 'Camilla', mother: 'Duazul', room: '1002 / Room 302 confinement', status: 'active',
    strategy: 'Combines a lethal counteractive personal ability with Have-Not curse soldiers prepared to die near rival princes.',
    nen: 'Specialist; Cat’s Name activates after she is killed and can restore her life by taking the killer’s life energy.',
    beast: 'Manipulator with a coercive ability that completely controls a target once currently unknown conditions are met.',
    team: ['Sarahell', 'Fukataki', 'Have-Not curse soldiers'],
    pressure: ['Confinement', 'Benjamin’s army', 'Curse timing', 'Nen exorcism risk'],
    source: wiki('Camilla_Hui_Guo_Rou'),
  },
  {
    order: 3, name: 'Zhang Lei Hui Guo Rou', short: 'Zhang Lei', mother: 'Tang Zhao Li', room: '1003', status: 'active',
    strategy: 'Builds a measured alliance network through Kurapika while studying the long-term political value of his beast’s coins.',
    nen: 'Personal Nen type and ability have not been revealed.',
    beast: 'Conjurer that produces one accumulating coin per day; gifted holders may awaken abilities after satisfying unknown conditions.',
    team: ['Sakata', 'Hashito', 'Tenftory', 'Coventoba'],
    pressure: ['Coin activation remains delayed', 'Queen spies', 'Alliance durability', 'Mafia sponsorship'],
    source: wiki('Zhang_Lei_Hui_Guo_Rou'),
  },
  {
    order: 4, name: 'Tserriednich Hui Guo Rou', short: 'Tserriednich', mother: 'Unma', room: '1004', status: 'active',
    strategy: 'Accelerates his Nen training while concealing his growth, testing loyalty, and retaining the Scarlet Eyes Kurapika seeks.',
    nen: 'Specialist; Parallel Future gives him a ten-second precognitive vision during Zetsu and creates a divergence others experience as reality.',
    beast: 'Horse-like beast that questions suspicious people, marks lies, and progressively worsens the mark after repeated deception.',
    team: ['Theta', 'Salkov', 'Tserriednich’s private guards'],
    pressure: ['Rapid training speed', 'Theta’s deception', 'Scarlet Eyes', 'Guardian Spirit Beast threat'],
    source: wiki('Tserriednich_Hui_Guo_Rou'),
  },
  {
    order: 5, name: 'Tubeppa Hui Guo Rou', short: 'Tubeppa', mother: 'Duazul', room: '1005 / relocated', status: 'active',
    strategy: 'Pursues calculated alliances and uses Maor to negotiate with Kurapika’s group while resisting Benjamin’s pressure.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Transmuter symbiotic beast that requires a research partner and can synthesize substances with varied effects.',
    team: ['Maor', 'Longhi', 'Queen Duazul guards'],
    pressure: ['Relocation under martial law', 'Longhi’s hidden lineage', 'Alliance maintenance'],
    source: wiki('Tubeppa_Hui_Guo_Rou'),
  },
  {
    order: 6, name: 'Tyson Hui Guo Rou', short: 'Tyson', mother: 'Katrono', room: '1006', status: 'active',
    strategy: 'Maintains a devotional household centered on the Book of Tyson while her beast distributes eye-wog creatures among followers.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Emitter that creates fairies collecting aura from recipients who receive happiness in return; breaking the Book’s taboo triggers severe punishment.',
    team: ['Izunavi', 'Giuliano'],
    pressure: ['Nen class exposure', 'Book taboo', 'Guard loyalty'],
    source: wiki('Tyson_Hui_Guo_Rou'),
  },
  {
    order: 7, name: 'Luzurus Hui Guo Rou', short: 'Luzurus', mother: 'Duazul', room: '1007 / relocated', status: 'active',
    strategy: 'Depends on Basho and a pragmatic guard detail while remaining entangled with Cha-R sponsorship and the wider mafia balance.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Conjurer that materializes a trap completing the target’s desire, then activates when the target falls for it.',
    team: ['Basho'],
    pressure: ['Relocation', 'Mafia sponsorship', 'Fugetsu conspiracy suspicion'],
    source: wiki('Luzurus_Hui_Guo_Rou'),
  },
  {
    order: 8, name: 'Salé-salé Hui Guo Rou', short: 'Salé-salé', mother: 'Swinko-swinko', room: '1008', status: 'deceased',
    strategy: 'Relied on charisma, comfort, and his beast’s influence rather than direct defensive planning.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Manipulator that emitted smoke creating clones attached to affected people; the spread increased support for Salé-salé.',
    team: ['Nen Beast (destroyed)'],
    pressure: ['Killed after Rihan’s Predator neutralized his beast'],
    source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou'),
  },
  {
    order: 9, name: 'Halkenburg Hui Guo Rou', short: 'Halkenburg', mother: 'Unma (biological) / Duazul (raised)', room: '1009 / body displaced', status: 'identity active in Balsamilco',
    strategy: 'Uses collective loyalty and a possession arrow to overwhelm stronger opponents, then continues his plan through Balsamilco’s body.',
    nen: 'Enhancer with a collective aura formation and possession arrow; the attacker’s body becomes unconscious while consciousness transfers into the struck target.',
    beast: 'Enhancement-oriented pinion-mark beast that amplifies group aura and supports the collective system.',
    team: ['Sumidori', 'Yuhirai', 'Shedule', 'Vict (occupied)'],
    pressure: ['Body preserved for funeral', 'Possession continuity', 'Succession deadline'],
    source: wiki('Halkenburg_Hui_Guo_Rou'),
  },
  {
    order: 10, name: 'Kacho Hui Guo Rou', short: 'Kacho', mother: 'Seiko', room: 'deceased / copy active', status: 'deceased, copy active',
    strategy: 'Originally planned to escape with Fugetsu; after death, her Guardian Spirit Beast copy remains beside Fugetsu and continues protective action.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Without You creates an exact copy of the deceased twin and remains until the surviving twin dies.',
    team: ['Melody', 'Keeney (deceased)', 'Without You copy'],
    pressure: ['Fugetsu’s worsening condition', 'Justice surveillance', 'Identity secrecy'],
    source: wiki('Kacho_Hui_Guo_Rou'),
  },
  {
    order: 11, name: 'Fugetsu Hui Guo Rou', short: 'Fugetsu', mother: 'Seiko', room: 'Justice custody / clinic access', status: 'alive, afflicted',
    strategy: 'Uses Magical Worm for transport while increasingly depending on Melody, Kaiser, and the Kacho copy for survival.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Magical Worm creates reciprocal portal doors; Fugetsu gains access to multiple uses as her condition evolves.',
    team: ['Kacho copy', 'Melody', 'Kaiser'],
    pressure: ['Aura drain', 'Curse spirits', 'Judicial custody', 'Escape risk'],
    source: wiki('Fugetsu_Hui_Guo_Rou'),
  },
  {
    order: 12, name: 'Momoze Hui Guo Rou', short: 'Momoze', mother: 'Sevanti', room: '1012 / burial chamber', status: 'deceased',
    strategy: 'Entered the contest with minimal protection after guards were shifted toward Marayam.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Manipulator rat-like beast that asks whether a target is free, then coerces and drains the host’s aura through possession.',
    team: ['Hanzo', 'Tuffdy (deceased)'],
    pressure: ['Murdered after protection was reduced'],
    source: wiki('Momoze_Hui_Guo_Rou'),
  },
  {
    order: 13, name: 'Marayam Hui Guo Rou', short: 'Marayam', mother: 'Sevanti', room: 'Nen-isolated Room 1013', status: 'active',
    strategy: 'Survives inside a hidden Nen-isolated room while a concentrated guard detail protects him.',
    nen: 'Personal Nen ability not revealed.',
    beast: 'Dragon-like beast responsible for an isolated Nen space duplicating the room and separating it from the normal corridor.',
    team: ['Biscuit Krueger', 'Belerainte', 'Queen Sevanti guards'],
    pressure: ['Isolation under martial law', 'Unknown exit conditions'],
    source: wiki('Marayam_Hui_Guo_Rou'),
  },
  {
    order: 14, name: 'Woble Hui Guo Rou', short: 'Woble', mother: 'Oito', room: '1014 / identity crisis', status: 'alive, body-state under investigation',
    strategy: 'Depends on Kurapika’s deterrence, alliance-building, Nen education, Queen Oito, and a shrinking guard network.',
    nen: 'Infant; no personal Nen ability revealed.',
    beast: 'Guardian Spirit Beast remains unrevealed in form. Current records separate the beast question from the later actual-Woble identity crisis.',
    team: ['Kurapika', 'Oito', 'Bill', 'Shimano'],
    pressure: ['Benjamin’s special martial law', 'Actual/substitute Woble crisis', 'Ritual eligibility', 'Room 1014 confinement'],
    source: wiki('Woble_Hui_Guo_Rou'),
  },
];

export const queenDossiers = [
  { rank: '1st', name: 'Unma', children: ['Benjamin', 'Tserriednich', 'Halkenburg (biological)'], role: 'Highest-ranked queen; biological mother of Benjamin, Tserriednich, and Halkenburg, although Halkenburg was raised by Duazul.', source: wiki('Unma') },
  { rank: '2nd', name: 'Duazul', children: ['Camilla', 'Tubeppa', 'Luzurus', 'Halkenburg (raised)'], role: 'Second Queen; mother of Camilla, Tubeppa, and Luzurus, and the woman who raised Halkenburg.', source: wiki('Duazul') },
  { rank: '3rd', name: 'Tang Zhao Li', children: ['Zhang Lei'], role: 'Third Queen and mother of Zhang Lei.', source: wiki('Tang_Zhao_Li') },
  { rank: '4th', name: 'Katrono', children: ['Tyson'], role: 'Fourth Queen and mother of Tyson.', source: wiki('Katrono') },
  { rank: '5th', name: 'Swinko-swinko', children: ['Salé-salé'], role: 'Fifth Queen and mother of Salé-salé.', source: wiki('Swinko-swinko') },
  { rank: '6th', name: 'Seiko', children: ['Kacho', 'Fugetsu'], role: 'Sixth Queen and mother of the twins Kacho and Fugetsu.',
    source: wiki('Seiko') },
  { rank: '7th', name: 'Sevanti', children: ['Momoze', 'Marayam'], role: 'Seventh Queen and mother of Momoze and Marayam.', source: wiki('Sevanti') },
  { rank: '8th', name: 'Oito', children: ['Woble'], role: 'Eighth Queen, mother of Woble, employer of Kurapika, and a direct participant in reconnaissance and survival planning.', source: wiki('Oito') },
];

export const guardianBeasts = [
  { host: 'Benjamin', type: 'Unknown', knowledge: 'Unknown', ability: 'Unknown ability; the beast has displayed the capacity to repel or erase weak curse spirits under specific conditions.', conditions: 'Complete conditions unknown.', source: wiki('Benjamin_Hui_Guo_Rou') },
  { host: 'Camilla', type: 'Manipulation', knowledge: 'Known', ability: 'Full control of a target after unknown conditions are met.', conditions: 'Trigger conditions unknown.', source: wiki('Camilla_Hui_Guo_Rou') },
  { host: 'Zhang Lei', type: 'Conjuration', knowledge: 'Known', ability: 'Produces one coin daily; coins accumulate value and may grant holders an ability after conditions are satisfied.', conditions: 'Activation condition remains unknown.', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { host: 'Tserriednich', type: 'Unknown', knowledge: 'Known', ability: 'Interrogates suspicious people and punishes repeated lies with progressive markings and transformation.', conditions: 'Effects escalate with repeated deception.', source: wiki('Tserriednich_Hui_Guo_Rou') },
  { host: 'Tubeppa', type: 'Transmutation', knowledge: 'Known', ability: 'Requires a partner and can synthesize substances with varied effects.', conditions: 'Symbiotic partner required.', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { host: 'Tyson', type: 'Emission', knowledge: 'Known', ability: 'Creates fairies that collect aura from recipients while returning happiness; taboo violations trigger punishment.', conditions: 'Recipient must receive Tyson’s book; taboo breach is punished.', source: wiki('Tyson_Hui_Guo_Rou') },
  { host: 'Luzurus', type: 'Conjuration', knowledge: 'Known', ability: 'Creates a trap that manifests the target’s desire and activates once the target falls for it.', conditions: 'Target must take the bait.', source: wiki('Luzurus_Hui_Guo_Rou') },
  { host: 'Salé-salé', type: 'Manipulation', knowledge: 'Known', ability: 'Emitted smoke creates attached clones that increase political support.', conditions: 'Beast destroyed by Predator.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { host: 'Halkenburg', type: 'Enhancement', knowledge: 'Known', ability: 'Pinion marks amplify collective aura and support Halkenburg’s group possession arrow.', conditions: 'Requires aligned followers in formation.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { host: 'Kacho', type: 'Unknown', knowledge: 'Known', ability: 'Without You creates an exact copy of the dead twin and protects the survivor.', conditions: 'Activates when one twin dies.', source: wiki('Kacho_Hui_Guo_Rou') },
  { host: 'Fugetsu', type: 'Conjuration', knowledge: 'Known', ability: 'Magical Worm creates reciprocal portal doors between locations.', conditions: 'Activation rules changed after Kacho’s death; current limits remain under study.', source: wiki('Fugetsu_Hui_Guo_Rou') },
  { host: 'Momoze', type: 'Manipulation', knowledge: 'Known', ability: 'Possesses a target after asking whether they are free; drains the host’s aura.', conditions: 'Conversational trigger and possession target required.', source: wiki('Momoze_Hui_Guo_Rou') },
  { host: 'Marayam', type: 'Unknown', knowledge: 'Known', ability: 'Creates an isolated duplicate-space around Room 1013.', conditions: 'Exact formation and exit conditions unknown.', source: wiki('Marayam_Hui_Guo_Rou') },
  { host: 'Woble', type: 'Unknown', knowledge: 'Unknown', ability: 'Form and ability remain unrevealed.', conditions: 'Unknown.', source: wiki('Woble_Hui_Guo_Rou') },
];

export const successionAbilities = [
  { owner: 'Kurapika', ability: 'Emperor Time', type: 'Specialization', mechanics: 'While his eyes are scarlet Kurapika can use all Nen categories at full efficiency.', conditions: 'Scarlet Eyes active.', limitations: 'Every second of use removes one hour from his lifespan.', source: wiki('Kurapika') },
  { owner: 'Kurapika', ability: 'Stealth Dolphin', type: 'Conjuration / specialization-linked', mechanics: 'Extracts and analyzes another user’s ability, then can loan it through a dolphin to another person.', conditions: 'Uses Steal Chain and Emperor Time.', limitations: 'Emperor Time remains active while the borrowed ability is held.', source: wiki('Kurapika') },
  { owner: 'Kurapika', ability: 'Dowsing Chain', type: 'Conjuration', mechanics: 'Detects lies and can be used through recorded footage; scarlet eyes improve performance.', conditions: 'Kurapika needs enough context to interpret the target.', limitations: 'Manipulated memory or self-believed falsehood can defeat the test.', source: wiki('Kurapika') },
  { owner: 'Kurapika', ability: 'Judgment Chain', type: 'Emission / Manipulation', mechanics: 'Places a blade around a target’s heart and enforces stated rules.', conditions: 'Usable while eyes are scarlet.', limitations: 'Violation of the stated rule triggers death.', source: wiki('Kurapika') },
  { owner: 'Kurapika', ability: 'Holy Chain', type: 'Enhancement', mechanics: 'Heals injuries; becomes dramatically stronger during Emperor Time.', conditions: 'Finger chain.', limitations: 'Combat use competes with other chains.', source: wiki('Kurapika') },
  { owner: 'Kurapika', ability: 'Chain Jail', type: 'Conjuration', mechanics: 'Restrains a Phantom Troupe member and forces Zetsu.', conditions: 'May only be used on Troupe members.', limitations: 'Using it on anyone else kills Kurapika.', source: wiki('Kurapika') },
  { owner: 'Chrollo Lucilfer', ability: 'Skill Hunter + Double Face', type: 'Specialization', mechanics: 'Steals abilities under Skill Hunter’s conditions; Double Face bookmarks a page so another ability can be used while the book is closed or another page is open.', conditions: 'Skill Hunter theft conditions plus bookmark management.', limitations: 'Complex setup and hand-use constraints shape combinations.', source: wiki('Chrollo_Lucilfer') },
  { owner: 'Chrollo Lucilfer', ability: 'Sun and Moon', type: 'Emission / post-mortem persistence', mechanics: 'Places plus and minus marks that explode on contact; marks survive Gallery Fake copies and persist due to the original owner’s post-mortem Nen.', conditions: 'Opposite marks must touch.', limitations: 'Charge time affects explosion strength.', source: wiki('Chrollo_Lucilfer') },
  { owner: 'Chrollo Lucilfer', ability: 'Gallery Fake', type: 'Conjuration', mechanics: 'Copies objects and corpses; the copies do not copy Nen powers.', conditions: 'Touches original with one hand and book with the other under normal use.', limitations: 'Copies have timed persistence.', source: wiki('Chrollo_Lucilfer') },
  { owner: 'Chrollo Lucilfer', ability: 'Order Stamp', type: 'Manipulation', mechanics: 'Commands puppets stamped with an order.', conditions: 'Works on puppets rather than living humans; head must remain attached.', limitations: 'Cannot issue overly complex individual orders.', source: wiki('Chrollo_Lucilfer') },
  { owner: 'Chrollo Lucilfer', ability: 'Convert Hands', type: 'Conjuration', mechanics: 'Left-hand touch makes the target look like Chrollo; right-hand touch makes Chrollo look like the target.', conditions: 'Touch with marked hands.', limitations: 'Using both hands can swap appearances completely.', source: wiki('Chrollo_Lucilfer') },
  { owner: 'Chrollo Lucilfer', ability: 'Black Voice', type: 'Manipulation', mechanics: 'Controls a target pierced by an antenna through a cell phone.', conditions: 'Antenna must remain lodged.', limitations: 'Loses control if antenna is removed.', source: wiki('Shalnark') },
  { owner: 'Chrollo Lucilfer', ability: 'The Sun and Moon + Gallery Fake + Order Stamp combo', type: 'Composite', mechanics: 'Creates copied bodies, stamps them, marks them with Sun and Moon, and sends them as persistent explosives.', conditions: 'Sequence of borrowed abilities and bookmark use.', limitations: 'High setup burden offset by prepared conditions.', source: wiki('Chapter_355') },
  { owner: 'Hisoka Morow', ability: 'Bungee Gum', type: 'Transmutation', mechanics: 'Aura has the properties of rubber and gum; after death Hisoka orders it to restart his heart and lungs, then uses it as prosthetic tissue.', conditions: 'Aura attached to chosen surfaces or body parts.', limitations: 'Force and geometry still matter.', source: wiki('Hisoka_Morow') },
  { owner: 'Hisoka Morow', ability: 'Texture Surprise', type: 'Transmutation', mechanics: 'Changes the appearance and texture of thin surfaces; after revival Hisoka uses it to cosmetically reconstruct damaged areas.', conditions: 'Applied to a surface.', limitations: 'Primarily visual/texture deception.', source: wiki('Hisoka_Morow') },
  { owner: 'Halkenburg Hui Guo Rou', ability: 'Possession Arrow', type: 'Enhancement / group Nen', mechanics: 'Collective aura creates an arrow that overwhelms defenses and transfers an ally’s consciousness into the struck target.', conditions: 'Followers and pinion marks synchronize aura.', limitations: 'The attacker’s original body becomes unconscious; exact selection of attacker is not fully controlled.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { owner: 'Tserriednich Hui Guo Rou', ability: 'Parallel Future', type: 'Specialization', mechanics: 'During Zetsu, Tserriednich sees ten seconds ahead and then experiences the predicted sequence while acting independently of it.', conditions: 'Eyes closed / Zetsu sequence as trained.', limitations: 'Mechanics require precise Zetsu timing; discovery by enemies would be dangerous.', source: wiki('Tserriednich_Hui_Guo_Rou') },
  { owner: 'Morena Prudo', ability: 'Contagion', type: 'Specialization', mechanics: 'Kiss-initiated game system grants members levels for killing; every level increases aura and level 20 grants a personal ability.', conditions: 'Maximum 23 members including Morena; points depend on victim type.', limitations: 'Member slots and game rules constrain expansion.', source: wiki('Morena_Prudo') },
  { owner: 'Morena Prudo', ability: 'Negotiation game', type: 'Rule-based interaction', mechanics: 'Uses a five-card choice game to force a recruit to select Yes or No after exchanging questions and goals.', conditions: 'The target must play under Morena’s stated rules.', limitations: 'Not established as a separate Nen ability; tracked as a coercive procedure.', source: wiki('Chapter_408') },
  { owner: 'Longhi', ability: 'Moonlight Act', type: 'Conjuration / contract', mechanics: 'Creates a mutually binding contract with up to three conditions, increasing aura while the contract is active.', conditions: 'Both parties agree to the terms.', limitations: 'A contract can only be made once per person.', source: wiki('Chapter_401') },
  { owner: 'Beyond Netero', ability: 'Curse-child system', type: 'Nen curse network', mechanics: 'Cursed children are assigned to princes; their deaths are designed to activate a curse against the assigned prince.', conditions: 'Long-term ritual preparation and assigned targets.', limitations: 'Exact mechanics and Beyond’s direct role remain partly concealed.', source: wiki('Chapter_401') },
  { owner: 'Kaiser', ability: 'Unknown / suspected manipulation', type: 'Unknown', mechanics: 'Melody suspects Kaiser may be manipulated because of his unnatural heartbeat and behavior.', conditions: 'Unknown.', limitations: 'Unconfirmed theory; not canonically named as an ability.', source: wiki('Kaiser') },
];

export const nenLessonPhases = [
  { phase: 'Pre-class preparation', chapters: '359-368', summary: 'Kurapika reveals Nen, contains the Room 1014 crisis, demonstrates Stealth Dolphin through Oito, and proposes a public class to spread risk.', incidents: ['Woody and guards killed', 'Sayird manipulated', 'Vincent attack', 'Oito reconnaissance', 'Momoze death'], source: wiki('Chapter_368') },
  { phase: 'Round 1', chapters: '369-390', summary: 'Kurapika opens the first class and uses it as both training and diplomatic leverage.', incidents: ['Barrigen killed by Silent Majority', 'Myuhan killed', 'Lower-prince alliance deepens', 'Students awaken aura'], source: wiki('Chapter_390') },
  { phase: 'Round 2', chapters: '411-413', summary: 'Kurapika splits the class into awakened and novice groups while Sarahell, Longhi, and multiple political operations converge.', incidents: ['Awakened group advanced exercises', 'Novices begin water divination', 'Sarahell’s curse risk', 'Longhi’s treaty', 'Martial-law pressure'], source: wiki('Chapter_411') },
];

export const blackWhaleTiers = [
  { tier: 1, access: 'VVIP / royalty', occupants: 'Royal family, queens, prince households, king, Beyond detention', key: ['Prince rooms 1001-1014', 'Banquet Hall', 'King’s quarters', 'Burial Chamber', 'Beyond detention'], source: wiki('Black_Whale') },
  { tier: 2, access: 'VIP', occupants: 'Kakin elites, court and entertainment spaces', key: ['Theater', 'Courthouse access', 'Funeral routes'], source: wiki('Black_Whale') },
  { tier: 3, access: 'Upper passenger / administration', occupants: 'First-class passengers, medical center, Justice facilities, mafia movement', key: ['Medical center', 'Justice Bureau', 'Room 3101 / hideout routes'], source: wiki('Black_Whale') },
  { tier: 4, access: 'General passenger', occupants: 'Lower-tier population and Royal Army operations', key: ['Royal Army offices', 'Public corridors', 'Mafia territories'], source: wiki('Black_Whale') },
  { tier: 5, access: 'General passenger / lower-class', occupants: 'Largest civilian population and lower-tier routes', key: ['Crowded communal areas', 'Mafia recruitment routes'], source: wiki('Black_Whale') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection is weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralizes his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection is weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralizes his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia / Contagion network', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection is weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection is weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection is weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Cha-R_Family') },
  { name: 'Phantom Troupe', type: 'criminal group', leadership: 'Chrollo', role: 'Hunts Hisoka while cooperating tactically with mafia factions against Heil-Ly.', chapters: '351-current', source: wiki('Phantom_Troupe') },
];

export const guardAssignmentGroups = [
  {
    group: 'Woble / Room 1014',
    records: [
      { subject: 'Woble', people: 'Kurapika, Bill, Shimano, Queen Oito', notes: 'Core survival group after repeated guard losses.', status: 'active', source: wiki('Chapter_359') },
      { subject: 'Woble', people: 'Babimyna', notes: 'Benjamin private soldier embedded as observer after Vincent’s death.', status: 'embedded / conditional', source: wiki('Babimyna') },
    ],
  },
  {
    group: 'Other princes',
    records: [
      { subject: 'Benjamin', people: 'Balsamilco, Furykov, Rihan, Yushohi, Vict, Babimyna', notes: 'Military chain and observation network.', status: 'active', source: wiki('Benjamin_Hui_Guo_Rou') },
      { subject: 'Camilla', people: 'Sarahell, Have-Nots', notes: 'Private guards and curse network.', status: 'active', source: wiki('Camilla_Hui_Guo_Rou') },
      { subject: 'Zhang Lei', people: 'Sakata, Hashito, Tenftory, Coventoba', notes: 'Royal guards plus Kurapika-linked contacts.', status: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
      { subject: 'Tserriednich', people: 'Theta, Salkov, private guards', notes: 'Training and succession defense.', status: 'active', source: wiki('Tserriednich_Hui_Guo_Rou') },
      { subject: 'Tubeppa', people: 'Maor, Longhi', notes: 'Alliance channel to Kurapika and bodyguard presence.', status: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
      { subject: 'Tyson', people: 'Izunavi, Giuliano', notes: 'Hunter bodyguard plus Tyson religious household.', status: 'active', source: wiki('Tyson_Hui_Guo_Rou') },
      { subject: 'Luzurus', people: 'Basho', notes: 'Hunter bodyguard with Cha-R background pressure.', status: 'active', source: wiki('Luzurus_Hui_Guo_Rou') },
      { subject: 'Kacho', people: 'Melody, Kacho copy', notes: 'After Kacho’s death, Without You remains with Fugetsu.', status: 'deceased / copy active', source: wiki('Kacho_Hui_Guo_Rou') },
      { subject: 'Fugetsu', people: 'Melody, Kaiser, Kacho copy', notes: 'Judicial custody and medical protection.', status: 'active', source: wiki('Fugetsu_Hui_Guo_Rou') },
      { subject: 'Momoze', people: 'Hanzo', notes: 'Prince deceased; Hanzo later killed her murderer.', status: 'deceased', source: wiki('Momoze_Hui_Guo_Rou') },
      { subject: 'Marayam', people: 'Biscuit, Belerainte', notes: 'Protected inside isolated Nen space.', status: 'active', source: wiki('Marayam_Hui_Guo_Rou') },
    ],
  },
];

export const bodyStateLedger = [
  { person: 'Kacho', chapter: 383, state: 'dead / beast-copy active', detail: 'Kacho dies during the escape attempt; Without You creates a copy that remains with Fugetsu.', source: wiki('Kacho_Hui_Guo_Rou') },
  { person: 'Halkenburg', chapter: 403, state: 'body unconscious / consciousness in Balsamilco', detail: 'Halkenburg’s possession arrow transfers consciousness into Balsamilco while the original body later dies for the funeral plan.', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { person: 'Shikaku', chapter: 389, state: 'dead after possession', detail: 'Shikaku’s body dies after serving as a possession vessel for Halkenburg’s follower.', source: wiki('Shikaku') },
  { person: 'Keeney', chapter: 383, state: 'deceased', detail: 'Keeney dies during the twins’ escape operation.', source: wiki('Keeney') },
  { person: 'Momoze', chapter: 368, state: 'deceased', detail: 'Momoze is murdered after her protection was weakened.', source: wiki('Momoze_Hui_Guo_Rou') },
  { person: 'Sale-sale', chapter: 382, state: 'deceased', detail: 'Sale-sale is assassinated after Rihan’s Predator neutralized his Guardian Spirit Beast.', source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou') },
  { person: 'Woble (actual infant)', chapter: 414, state: 'alive / separated', detail: 'Chapter 414 distinguishes the actual Woble from a substitute infant and shows the actual child separated from Oito under disputed circumstances.', source: wiki('Chapter_414') },
  { person: 'Woble (substitute infant)', chapter: 414, state: 'substitute identity', detail: 'A substitute infant is presented inside the royal system while Oito recognizes the child is not Woble.', source: wiki('Chapter_414') },
  { person: 'Borksen', chapter: 410, state: 'alive / forcibly recruited', detail: 'Borksen survives Morena’s negotiation game but is forced into Heil-Ly under the final Yes.', source: wiki('Borksen') },
];

export const successionRelationships = [
  { from: 'Kurapika', to: 'Oito', type: 'bodyguard / employer', note: 'Kurapika is contractually protecting Woble and works directly with Oito on alliances and reconnaissance.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Oito') },
  { from: 'Kurapika', to: 'Woble', type: 'protector / prince', note: 'Kurapika’s central goal inside the contest is Woble’s survival.', phase: 'active contest', chapters: '358-current', state: 'active', source: wiki('Woble_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Longhi', type: 'treaty / provisional ally', note: 'Moonlight Act binds a conditional alliance centered on Woble and the Beyond curse-child problem.', phase: 'active contest', chapters: '401-current', state: 'active', source: wiki('Longhi') },
  { from: 'Kurapika', to: 'Zhang Lei', type: 'alliance', note: 'Zhang Lei supports Kurapika’s Room 1014 position while seeking Nen and succession information.', phase: 'active contest', chapters: '368-current', state: 'active', source: wiki('Zhang_Lei_Hui_Guo_Rou') },
  { from: 'Kurapika', to: 'Tubeppa camp', type: 'alliance', note: 'Maor and Longhi maintain an alliance channel between Tubeppa and Kurapika.', phase: 'active contest', chapters: '371-current', state: 'active', source: wiki('Tubeppa_Hui_Guo_Rou') },
  { from: 'Benjamin', to: 'Balsamilco', type: 'command', note: 'Balsamilco is Benjamin’s senior strategist and executor of high-risk military plans.', phase: 'active contest', chapters: '359-current', state: 'active until possession', source: wiki('Balsamilco_Might') },
  { from: 'Halkenburg', to: 'Balsamilco', type: 'possession / infiltration', note: 'Halkenburg’s plan continues through Balsamilco’s body after the TSK-17 operation.', phase: 'martial law', chapters: '403-current', state: 'active', source: wiki('Halkenburg_Hui_Guo_Rou') },
  { from: 'Kacho copy', to: 'Fugetsu', type: 'guardian beast / twin protection', note: 'Without You maintains Kacho’s copy beside Fugetsu after Kacho’s death.', phase: 'active contest', chapters: '383-current', state: 'active', source: wiki('Kacho_Hui_Guo_Rou') },
  { from: 'Morena', to: 'Borksen', type: 'coercive recruitment', note: 'Morena uses the negotiation game to force Borksen toward Heil-Ly membership.', phase: 'martial law', chapters: '407-410', state: 'resolved into recruitment', source: wiki('Borksen') },
  { from: 'Hisoka', to: 'Phantom Troupe', type: 'mutual hunt', note: 'After his revival, Hisoka abandons duel conditions and declares he will kill Troupe members on sight.', phase: 'post-Heavens Arena / voyage', chapters: '357-current', state: 'active', source: wiki('Hisoka_Morow') },
  { from: 'Phantom Troupe', to: 'Heil-Ly', type: 'hostility', note: 'The Troupe shifts from Hisoka search to explicit Heil-Ly destruction after Luini’s approach.', phase: 'lower-tier conflict', chapters: '393-current', state: 'active', source: wiki('Chapter_393') },
];

export const successionOrganizations = [
  { name: 'Kakin Royal Family', type: 'royal house', leadership: 'Nasubi', role: 'Fourteen princes compete in the succession ritual while queens and guards act through ranked legal structures.', chapters: '349-current', source: wiki('Kakin_Empire') },
  { name: 'Hunter Association / Zodiacs', type: 'expedition command', leadership: 'Cheadle', role: 'Runs the Dark Continent expedition framework, Beyond custody, medical and security roles, and selected royal assignments.', chapters: '340-current', source: wiki('Hunter_Association') },
  { name: 'Kakin Royal Army', type: 'state security', leadership: 'Benjamin / national command', role: 'Controls ship security, custody, checkpoints, and special martial law.', chapters: '358-current', source: wiki('Kakin_Empire') },
  { name: 'Justice Bureau', type: 'judicial / investigative', leadership: 'Chief Justice / Kakin state', role: 'Investigates killings, handles detention, and preserves formal evidence and custody procedures.', chapters: '369-current', source: wiki('Kakin_Empire') },
  { name: 'Xi-Yu Family', type: 'mafia', leadership: 'Onior Longbao', role: 'Zhang Lei-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '378-current', source: wiki('Xi-Yu_Family') },
  { name: 'Heil-Ly Family', type: 'mafia / Contagion network', leadership: 'Morena Prudo', role: 'Breakaway family using Contagion to level members and destabilize the ship.', chapters: '378-current', source: wiki('Heil-Ly_Family') },
  { name: 'Cha-R Family', type: 'mafia', leadership: 'Brocco Li', role: 'Luzurus-linked family balancing Troupe cooperation and Heil-Ly suppression.', chapters: '