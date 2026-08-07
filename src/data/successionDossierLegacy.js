const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const file = (name) => `https://hunterxhunter.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(name)}`;
import { chapterTitles } from './chapterTitles';
import { successionDays, successionPrelude, timelineTracks } from './successionTimeline';

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
    pressure: ['Theta’s resistance', 'Kurapika’s objective', 'Rapid Nen growth', 'Personal Nen beast'],
    source: wiki('Tserriednich_Hui_Guo_Rou'),
  },
  {
    order: 5, name: 'Tubeppa Hui Guo Rou', short: 'Tubeppa', mother: 'Duazul', room: '1005', status: 'active',
    strategy: 'Pursues scientific and political partnership, using Maor and Longhi to evaluate Kurapika and construct a lower-prince alliance.',
    nen: 'No confirmed personal ability; her camp contains hidden Nen users and a formal treaty with Woble’s side.',
    beast: 'Transmuter that can concoct chemicals but requires a collaborative partner and manifests around perceived contracts.',
    team: ['Maor', 'Longhi', 'Tubeppa’s guards'],
    pressure: ['Beyond’s curse network', 'Treaty conditions', 'Unrevealed beast products', 'Higher-prince aggression'],
    source: wiki('Tubeppa_Hui_Guo_Rou'),
  },
  {
    order: 6, name: 'Tyson Hui Guo Rou', short: 'Tyson', mother: 'Katrono', room: '1006', status: 'active',
    strategy: 'Builds devotion through the Book of Tyson and an emotionally unified guard group rather than conventional assassination.',
    nen: 'No confirmed personal Nen ability.',
    beast: 'Emitter whose eye-wogs collect aura from followers, return happiness, deepen devotion, and punish violation of a taboo.',
    team: ['Giuliano', 'Izunavi', 'Tyson’s attendants'],
    pressure: ['Unknown taboo', 'Guard loyalty', 'Religious coercion', 'Exposure to rival operations'],
    source: wiki('Tyson_Hui_Guo_Rou'),
  },
  {
    order: 7, name: 'Luzurus Hui Guo Rou', short: 'Luzurus', mother: 'Duazul', room: '1007', status: 'active',
    strategy: 'Relies on experienced Hunter guards and Cha-R sponsorship while other camps consider whether his beast is harming Fugetsu.',
    nen: 'No confirmed personal Nen ability.',
    beast: 'Conjurer using pseudo-coercive manipulation; it creates desired bait and springs a trap when the target satisfies that desire.',
    team: ['Bashō', 'Scairt', 'Cha-R connection'],
    pressure: ['Fugetsu investigation', 'Assassination proposals', 'Mafia war', 'Unconfirmed beast involvement'],
    source: wiki('Luzurus_Hui_Guo_Rou'),
  },
  {
    order: 8, name: 'Salé-salé Hui Guo Rou', short: 'Salé-salé', mother: 'Swinko-swinko', room: '1008', status: 'deceased',
    statusDetail: 'Assassinated after Rihan’s Predator eliminated his Guardian Spirit Beast.',
    strategy: 'Attempted to turn popularity and mass goodwill into an effortless political victory.',
    nen: 'No confirmed personal Nen ability.',
    beast: 'Diffusive induction Manipulator that spread goodwill through smoke and created small influence-bearing clones.',
    team: ['Mushaho', 'Royal attendants'],
    pressure: ['Eliminated'],
    source: wiki('Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou'),
  },
  {
    order: 9, name: 'Halkenburg Hui Guo Rou', short: 'Halkenburg', mother: 'Unma (birth) / Duazul (raised)', room: '1009 / consciousness elsewhere', status: 'exceptional',
    statusDetail: 'His original body is dead while his consciousness remains active in Balsamilco’s body.',
    strategy: 'Turns mass public support and a collective Nen ability into a possession campaign aimed at the center of Benjamin’s command.',
    nen: 'Collective aura forms an unavoidable arrow that displaces consciousness between shooter and target under complex rules.',
    beast: 'Enhancer that marks loyal followers with pinions, magnifies unified group aura, and granted Halkenburg his ability.',
    team: ['Sumidori', 'Yuhirai', 'Halkenburg’s marked followers'],
    pressure: ['Body-state deadline', 'Benjamin’s command', 'Funeral operation', 'Legal custody'],
    source: wiki('Halkenburg_Hui_Guo_Rou'),
  },
  {
    order: 10, name: 'Kacho Hui Guo Rou', short: 'Kacho', mother: 'Seiko', room: '1010 / GSB continuation', status: 'deceased',
    statusDetail: 'Kacho died during the escape; Without You continues in her form beside Fugetsu.',
    strategy: 'Protected Fugetsu through apparent hostility, Melody’s network, Justice cooperation, and a failed lifeboat escape.',
    nen: 'No confirmed personal ability.',
    beast: 'Without You assumes the form of whichever twin dies first and protects the survivor until death.',
    team: ['Melody', 'Keeney', 'Kaiser', 'Without You'],
    pressure: ['Identity secrecy', 'Fugetsu’s survival', 'Justice scrutiny', 'Ritual exit restriction'],
    source: wiki('Kacho_Hui_Guo_Rou'),
  },
  {
    order: 11, name: 'Fugetsu Hui Guo Rou', short: 'Fugetsu', mother: 'Seiko', room: '1011 / Justice protection', status: 'active',
    strategy: 'Uses Magical Worm, Kacho’s support, Melody, and Justice Bureau access to seek survival and communicate with other princes.',
    nen: 'Her Guardian Spirit Beast granted a travel ability; her own Nen type is not confirmed.',
    beast: 'Magical Worm creates an outgoing door and a return route; its frequency and return rules changed after Kacho’s death.',
    team: ['Kacho / Without You', 'Melody', 'Kaiser'],
    pressure: ['Curse-like spirits', 'Aura exhaustion', 'Luzurus theory', 'Escape restrictions'],
    source: wiki('Fugetsu_Hui_Guo_Rou'),
  },
  {
    order: 12, name: 'Momoze Hui Guo Rou', short: 'Momoze', mother: 'Sevanti', room: '1012', status: 'deceased',
    statusDetail: 'Strangled by Tuffdy after her mother transferred most protection to Marayam.',
    strategy: 'Entered with limited protection and attempted to conceal the danger created by her wandering beast.',
    nen: 'No confirmed personal Nen ability.',
    beast: 'Pseudo-coercive Manipulator that asks whether a target is free and seizes the body after an affirmative response.',
    team: ['Hanzo', 'Tuffdy', 'Momoze’s reduced guard detail'],
    pressure: ['Eliminated'],
    source: wiki('Momoze_Hui_Guo_Rou'),
  },
  {
    order: 13, name: 'Marayam Hui Guo Rou', short: 'Marayam', mother: 'Sevanti', room: '1013 / isolated Nen space', status: 'active',
    strategy: 'Survives behind a spatial barrier while Hunters compare the real room with an inaccessible empty counterpart.',
    nen: 'No confirmed personal Nen ability.',
    beast: 'Dragon-like beast suspected of creating the barrier and alternate-space effect around Room 1013.',
    team: ['Biscuit Krueger', 'Hanzo', 'Belerainte', 'Sevanti'],
    pressure: ['Isolation mechanics', 'Aura supply', 'Outside infiltration', 'Unknown beast rules'],
    source: wiki('Marayam_Hui_Guo_Rou'),
  },
  {
    order: 14, name: 'Woble Hui Guo Rou', short: 'Woble', mother: 'Oito', room: '1014', status: 'active',
    strategy: 'Depends on Kurapika’s information-sharing, Nen lessons, alliances, and deterrence because Woble is an infant with the smallest initial force.',
    nen: 'No personal Nen ability; Woble’s Guardian Spirit Beast has not yet been revealed.',
    beast: 'Existence is expected from the ritual, but appearance and ability remain unknown.',
    team: ['Oito', 'Kurapika', 'Bill', 'Shimano', 'Babimyna', 'Sakata', 'Hashito'],
    pressure: ['Sarahell’s curse plan', 'Silent Majority', 'Kurapika’s lifespan', 'Unrevealed beast'],
    source: wiki('Woble_Hui_Guo_Rou'),
  },
].map((record) => ({
  ...record,
  age: 'Not confirmed by Hunterpedia',
  mafia: princeMafiaLinks[record.order] || 'No confirmed direct mafia sponsorship',
  currentLocation: record.room,
  unresolved: record.pressure,
}));

export const queenDossiers = [
  ['1st', 'Unma', ['Benjamin', 'Tserriednich', 'Halkenburg (birth record)'], 'Highest-ranked queen; her household intersects Benjamin’s military power and Halkenburg’s concealed maternal history.', 'Unma_Hui_Guo_Rou'],
  ['2nd', 'Duazul', ['Camilla', 'Tubeppa', 'Luzurus', 'Halkenburg (raised)'], 'Mother of three active contenders and the queen who raised Halkenburg.', 'Duazul_Hui_Guo_Rou'],
  ['3rd', 'Tang Zhao Li', ['Zhang Lei'], 'Her branch is tied politically to Zhang Lei’s measured alliance strategy.', 'Tang_Zhao_Li_Hui_Guo_Rou'],
  ['4th', 'Katrono', ['Tyson'], 'Mother of Tyson and head of her royal household.', 'Katrono_Hui_Guo_Rou'],
  ['5th', 'Swinko-swinko', ['Salé-salé'], 'Mother of the eliminated 8th Prince.', 'Swinko-swinko_Hui_Guo_Rou'],
  ['6th', 'Seiko', ['Kacho', 'Fugetsu'], 'Mother of the twin princes whose survival strategy became entangled with Justice and Melody.', 'Seiko_Hui_Guo_Rou'],
  ['7th', 'Sevanti', ['Momoze', 'Marayam'], 'Transferred protection toward Marayam, leaving Momoze dangerously exposed.', 'Sevanti_Hui_Guo_Rou'],
  ['8th', 'Oito', ['Woble'], 'Woble’s mother and Kurapika’s employer; an active participant in reconnaissance and alliance-building.', 'Oito_Hui_Guo_Rou'],
].map(([rank, name, children, role, slug]) => ({ rank, name, children, role, source: wiki(slug) }));

const beastTypes = {
  Nasubi: 'Unknown', Benjamin: 'Unknown', Camilla: 'Manipulation', 'Zhang Lei': 'Conjuration', Tserriednich: 'Unknown',
  Tubeppa: 'Transmutation', Tyson: 'Emission', Luzurus: 'Conjuration', 'Salé-salé': 'Manipulation', Halkenburg: 'Enhancement',
  Kacho: 'Unknown / mutual cooperation', Fugetsu: 'Unknown', Momoze: 'Manipulation', Marayam: 'Unknown', Woble: 'Unknown',
};

const beastConditions = {
  Nasubi: 'Previous-generation winner; current complete rules are unknown.',
  Benjamin: 'Has dispersed low-level curse spirits; activation and cost are unknown.',
  Camilla: 'Complete control follows conditions that have not been disclosed.',
  'Zhang Lei': 'Produces one coin daily; gifted coins reset and change design; later activation remains unresolved.',
  Tserriednich: 'Questions suspicious people, marks a lie, and escalates the mark after further deception.',
  Tubeppa: 'Requires a collaborative partner and appears around a contract recognized by Tubeppa.',
  Tyson: 'Eye-wogs attach to listeners; collected aura returns happiness; an unknown taboo carries punishment.',
  Luzurus: 'Materializes a desired bait and activates when the target satisfies that desire.',
  'Salé-salé': 'Diffusive smoke spreads goodwill and produces influence-bearing clones.',
  Halkenburg: 'Loyal followers receive pinion marks; unified will and proximity amplify the group aura.',
  Kacho: 'Activates when either twin dies, copies the deceased twin, and protects the survivor until death.',
  Fugetsu: 'Creates an outgoing door and a return route; frequency and return behavior change after Kacho dies.',
  Momoze: 'Asks whether the target is free and can seize the body after an affirmative response.',
  Marayam: 'Spatial isolation is strongly associated with the beast, but its complete trigger remains unconfirmed.',
  Woble: 'Appearance, type, behavior, trigger, cost, and restrictions remain unknown.',
};

export const guardianBeasts = [
  ['King', 'Nasubi', 'Unknown', 'A previous-generation beast whose presence proves that a winner’s beast can persist beyond a contest.', "Chap 349 - Nasubi's sacred beast.png", 'Nasubi_Hui_Guo_Rou'],
  ['1', 'Benjamin', 'Partially known', 'Beetle-like beast shown dispersing low-level curse spirits; full ability unresolved.', "Benjamin's Sacred Beast.png", 'Benjamin_Hui_Guo_Rou'],
  ['2', 'Camilla', 'Known in part', 'Coercive Manipulator that completely controls a target after unknown conditions are met.', "Camilla's Sacred Beast.png", 'Camilla_Hui_Guo_Rou'],
  ['3', 'Zhang Lei', 'Known in part', 'Conjures one coin each day; numbers accumulate and gifted owners may later awaken abilities.', "Zhang's Sacred Beast.png", 'Zhang_Lei_Hui_Guo_Rou'],
  ['4', 'Tserriednich', 'Known in part', 'Questions suspicious people, marks lies, and escalates the mark after further deception.', 'Tserriednich Sacred Beast.png', 'Tserriednich_Hui_Guo_Rou'],
  ['5', 'Tubeppa', 'Known in part', 'Collaborative Transmuter that requires a partner and can manufacture chemicals with varied effects.', 'Tubeppa Nen beast.png', 'Tubeppa_Hui_Guo_Rou'],
  ['6', 'Tyson', 'Known in part', 'Eye-wogs collect aura, bestow happiness, deepen devotion, and enforce an unknown taboo.', 'Chap 375 - Tyson and her Guardian Spirit Beast.png', 'Tyson_Hui_Guo_Rou'],
  ['7', 'Luzurus', 'Known in part', 'Conjures desired bait and activates pseudo-coercive manipulation when the target satisfies the desire.', 'Chap 375 - Luzurus and Guardian Spirit Beast.png', 'Luzurus_Hui_Guo_Rou'],
  ['8', 'Salé-salé', 'Eliminated', 'Diffusive smoke and clones increased goodwill; Rihan’s Predator destroyed the beast.', "Salesale's Sacred Beast.png", 'Sal%C3%A9-sal%C3%A9_Hui_Guo_Rou'],
  ['9', 'Halkenburg', 'Known in part', 'Marks followers, amplifies unified group aura, and granted Halkenburg his possession arrow.', "Chap 361 - Halkenburg's Nen beast.png", 'Halkenburg_Hui_Guo_Rou'],
  ['10', 'Kacho', 'Active after host death', 'Without You takes the form of the first deceased twin and protects the survivor.', 'Without-you.png', 'Kacho_Hui_Guo_Rou'],
  ['11', 'Fugetsu', 'Known in part', 'Magical Worm manifests travel doors whose frequency and return rules have changed.', '374 - Door of Travel.png', 'Fugetsu_Hui_Guo_Rou'],
  ['12', 'Momoze', 'Host deceased', 'Asks whether a target is free and can seize bodily control after an affirmative answer.', "Chap 361 - Momoze's Nen beast.png", 'Momoze_Hui_Guo_Rou'],
  ['13', 'Marayam', 'Suspected', 'Dragon-like beast suspected of creating the sealed alternate-space effect around Room 1013.', 'Chap 366 - Marayam Nen beast.png', 'Marayam_Hui_Guo_Rou'],
  ['14', 'Woble', 'Unknown', 'Appearance and ability remain unrevealed; no substitute image is used.', null, 'Woble_Hui_Guo_Rou'],
].map(([order, host, knowledge, ability, imageName, slug]) => ({
  order, host, knowledge, ability, type: beastTypes[host], conditions: beastConditions[host],
  image: imageName ? file(imageName) : null, source: wiki(slug),
}));

export const beastRules = [
  'Created by the Seed Urn ceremony and sustained by the host’s aura.',
  'Hosts cannot see their own beast or the beasts of princes from the same generation.',
  'They vanish during Zetsu or when the host cannot supply enough aura.',
  'They do not kill one another and do not directly attack another beast’s host.',
  'Their Nen type may differ from the host’s and their behavior reflects the host’s disposition.',
  'They can be destroyed by Nen abilities; survival after host death depends on the individual ability.',
];

export const nenLessonPhases = [
  {
    phase: 'Round 1 · introduction', chapters: '369–390', place: 'Room 1014',
    summary: 'Kurapika promises rapid awakening through Stealth Dolphin-assisted instruction, forcing rival camps to send representatives and acknowledge Nen.',
    people: ['Kurapika', 'Bill', 'Furykov', 'Loberry', 'Barrigen', 'Myuhan', 'Prince representatives'],
    incidents: ['Silent Majority possesses Loberry', 'Barrigen is killed', 'Myuhan is killed', 'Four students awaken'],
    source: wiki('Succession_Contest#Kurapika%27s_Nen_lessons'),
  },
  {
    phase: 'Between rounds · alliance use', chapters: '391–410', place: 'Rooms 1014 / 1003 / Justice areas',
    summary: 'New Nen literacy becomes diplomatic leverage while Kurapika investigates coins, contracts with Longhi, and balances Emperor Time’s cost.',
    people: ['Kurapika', 'Oito', 'Bill', 'Longhi', 'Sakata', 'Hashito'],
    incidents: ['Moonlight Act treaty', 'Beyond curse disclosure', 'Zhang Lei coin analysis', 'Expanded attendance negotiated'],
    source: wiki('Chapter_401'),
  },
  {
    phase: 'Round 2 · split curriculum', chapters: '411–current', place: 'Room 1014',
    summary: 'Eighteen expected participants are split into introductory and beginner groups while Benjamin’s observers and Sarahell’s curse plan enter the room’s pressure system.',
    people: ['Kurapika', 'Bill', 'Shimano', 'Furykov', 'Babimyna', 'Sakata', 'Hashito', 'Naipei', 'Belerainte', 'Sarahell'],
    incidents: ['Two class levels', 'Additional aligned-prince seats', 'One-month basics plan', 'Woble curse infiltration risk'],
    source: wiki('Chapter_411'),
  },
];

export const guardAssignmentGroups = [
  {
    group: 'Prince original private guards',
    description: 'Personnel originally assigned to a prince before the public Nen lesson reshuffled the information balance.',
    records: [
      ['Benjamin', 'Balsamilco, Babimyna, Furykov, Rihan, Yushohi, Vict, Musse, Shikaku, Vincent', 'Military command; several are confirmed Nen users.', 'mixed'],
      ['Tserriednich', 'Theta, Salkov, Danjin, Momolly, Muherr', 'Training containment, loyalty testing, and internal resistance.', 'active'],
      ['Woble', 'Kurapika, Bill, Shimano, Woody, Wolfe, Sandra and other initial guards', 'Most initial protection collapsed on Day 1; Kurapika rebuilt deterrence through Nen lessons.', 'fragile'],
      ['Momoze', 'Hanzo, Tuffdy and reduced guard detail', 'Protection was weakened after Sevanti shifted attention to Marayam.', 'eliminated'],
    ],
  },
  {
    group: 'Queen-appointed guards and spies',
    description: 'Guards embedded across rival rooms as surveillance, deterrence, or assassination infrastructure.',
    records: [
      ['Unma branch', 'Benjamin and Tserriednich-linked pressure', 'High-rank queen politics intersect with military authority and hidden maternity.', 'active'],
      ['Duazul branch', 'Camilla, Tubeppa, Luzurus and Halkenburg household interests', 'Multiple active contenders create overlapping loyalties.', 'active'],
      ['Seiko branch', 'Kacho and Fugetsu protection network', 'Twin-prince survival became tied to Melody, Kaiser, and Justice custody.', 'exceptional'],
      ['Oito branch', 'Woble household and Kurapika contract', 'Lowest-ranked household relies on external Hunters and public information.', 'active'],
    ],
  },
  {
    group: 'Nen-class attendees and observers',
    description: 'Representatives whose attendance changes whether their prince’s faction understands Nen.',
    records: [
      ['First-round attendees', 'Loberry, Barrigen, Myuhan, other prince representatives', 'Silent Majority murders expose the room as an information battlefield.', 'violent'],
      ['Benjamin observers', 'Babimyna, Furykov and later aligned personnel', 'Observation becomes counterintelligence and assassination assessment.', 'active'],
      ['Second-round expansion', 'Sakata, Hashito, Naipei, Belerainte, Sarahell and others', 'Kurapika splits introductory and beginner instruction while curse risks enter the room.', 'active'],
    ],
  },
  {
    group: 'State, servants, and temporary custody',
    description: 'Royal Army, Justice Bureau, servants, maids, and detainees whose official status changes by day.',
    records: [
      ['Justice protection', 'Kaiser, Melody, Fugetsu, Without You', 'Protective custody overlaps with investigation and deception.', 'active'],
      ['Royal Army custody', 'Benjamin, Balsamilco body state, Halkenburg funeral route', 'Special martial law changes movement, access, and command authority.', 'active'],
      ['Servants and attendants', 'Room staff, maids, lower-ranked attendants', 'Ordinary staff repeatedly become witnesses, targets, or vectors.', 'needs room matrix'],
    ],
  },
].map((group) => ({
  ...group,
  records: group.records.map(([subject, people, notes, status]) => ({ subject, people, notes, status, source: wiki('Succession_Contest') })),
}));

export const contestRules = [
  ['Seed Urn origin', 'Kakin’s royal ritual creates Guardian Spirit Beasts through a blood ceremony; historical prior contests are implied rather than fully documented.', 'confirmed / incomplete'],
  ['Eligibility', 'The legitimate princes participating in Nasubi’s succession line receive beasts and become contestants.', 'confirmed'],
  ['Sole-survivor objective', 'The ritual is framed as producing one surviving monarch, but legal and ritual definitions of “eliminated” remain unresolved.', 'confirmed / ambiguous'],
  ['Withdrawal and escape', 'Kacho and Fugetsu’s failed lifeboat attempt shows leaving the ship is prevented by the ritual.', 'confirmed'],
  ['Beast restrictions', 'Guardian Spirit Beasts do not directly attack other princes or each other, forcing indirect tactics.', 'confirmed'],
  ['Host awareness', 'Hosts cannot see their own beasts or same-generation prince beasts; non-prince Nen users may perceive them.', 'confirmed'],
  ['Legal law vs ritual law', 'Murders still trigger Justice Bureau and military responses even while ritual law pushes the deathmatch forward.', 'developing'],
  ['Sunday banquets', 'Formal gatherings are part of the royal routine and become communication and assassination opportunities.', 'confirmed'],
  ['Funeral procedures', 'Deaths move into legal, ceremonial, and possibly ritual channels through the burial chamber and processions.', 'developing'],
  ['Fourteen caskets', 'The burial chamber has fourteen caskets and an unexplained central apparatus.', 'confirmed / unknown purpose'],
  ['King’s role', 'Nasubi interprets and sponsors the ritual, but his final intended role is still unresolved.', 'developing'],
  ['Special martial law', 'Emergency authority changes access, movement, and investigation power without yet resolving the contest.', 'developing'],
].map(([name, note, status]) => ({ name, note, status, source: wiki('Succession_Contest') }));

const successionAbilityConditions = {
  'Emperor Time / Stealth Dolphin / Chain abilities': 'Scarlet Eyes activate Emperor Time; each second costs Kurapika one hour of life. Stealth Dolphin requires Emperor Time and can loan an ability after analysis.',
  Erigeron: 'Works on living growth; combat limits and maximum acceleration remain incompletely shown.',
  'Silent Majority': 'Uses a possessed host and conjured snakes inside a defined area. User identity, host relationship, and complete target rule are unknown.',
  'Benjamin Baton': 'The deceased soldier must be loyal to Benjamin, belong to his private army, and graduate from Kakin military academy for the ability to pass on.',
  'Cat’s Name': 'Counteractive post-death activation requires Camilla to be killed; the cat takes the killer’s life and restores hers.',
  'Untouchable curse plans': 'A Have-Not spends a lifetime near a target and dies close enough to power a post-mortem curse; each assignment and success state must be tracked separately.',
  'Guardian coins': 'One coin is produced daily. Numbers and designs change with time and transfer; the eventual holder ability is not yet confirmed.',
  'Parallel Future': 'Tserriednich closes his eyes and enters Zetsu to see ten seconds ahead; others continue through a divergent reality without perceiving his changed action.',
  'Magical Worm': 'Outgoing and return doors have asymmetric roles; range, daily use, and post-Kacho changes are still being tested.',
  'Without You': 'Only activates after one twin dies and remains in that twin’s form to protect the survivor.',
  'Collective aura possession arrow': 'Requires marked followers acting in unity and formation. The arrow cannot be conventionally blocked; body and consciousness outcomes depend on who fires and who is hit.',
  Predator: 'Rihan must observe and correctly analyze the target ability. More complex or misleading abilities require longer preparation and a tailored counter-beast.',
  'Secret Window': 'Musse places an owl-like surveillance construct; the gathered information passes to Benjamin through Benjamin Baton after Musse dies.',
  'Moonlight Act': 'A voluntary signed contract sets a limited term, restrictions, and possible loan of the ability; wording and consent are central.',
  Contagion: 'Members gain points by killing; reaching level 20 awakens an ability, while level 100 permits a new infection. Morena controls membership through the kiss initiation.',
  'Door / spatial and combat abilities': 'Each Heil-Ly member has separate level, trigger, range, and room conditions; shared affiliation does not imply shared mechanics.',
  'Aboard-ship combat abilities': 'Only previously revealed or currently shown Troupe abilities should be attributed to a member; planned abilities remain unknown.',
};

const successionAbilitySources = {
  'Emperor Time / Stealth Dolphin / Chain abilities': 'Kurapika#Nen',
  Erigeron: 'Bill#Nen',
  'Silent Majority': 'Silent_Majority',
  'Benjamin Baton': 'Benjamin_Hui_Guo_Rou#Nen',
  'Cat’s Name': 'Camilla_Hui_Guo_Rou#Nen',
  'Untouchable curse plans': 'Camilla_Hui_Guo_Rou#Have-Nots',
  'Guardian coins': 'Zhang_Lei_Hui_Guo_Rou#Guardian_Spirit_Beast',
  'Parallel Future': 'Tserriednich_Hui_Guo_Rou#Nen',
  'Magical Worm': 'Fugetsu_Hui_Guo_Rou#Guardian_Spirit_Beast',
  'Without You': 'Kacho_Hui_Guo_Rou#Guardian_Spirit_Beast',
  'Collective aura possession arrow': 'Halkenburg_Hui_Guo_Rou#Nen',
  Predator: 'Rihan#Nen',
  'Secret Window': 'Musse#Nen',
  'Moonlight Act': 'Longhi#Nen',
  Contagion: 'Morena_Prudo#Nen',
  'Door / spatial and combat abilities': 'Heil-Ly_Family#Nen',
  'Aboard-ship combat abilities': 'Phantom_Troupe#Abilities',
};

export const successionAbilities = [
  ['Kurapika', 'Emperor Time / Stealth Dolphin / Chain abilities', 'Specialist while eyes are scarlet; multiple chain abilities', 'Long-term lifespan cost; ability loaning and instruction through Stealth Dolphin.', '340-current'],
  ['Bill', 'Erigeron', 'Enhancement', 'Accelerates organic growth and supports Kurapika’s teaching plan.', '361'],
  ['Unknown user', 'Silent Majority', 'Unknown', 'Possession and snake murders inside Room 1014; user remains unidentified.', '359'],
  ['Benjamin', 'Benjamin Baton', 'Enhancement-linked inheritance', 'Inherits abilities from loyal deceased private soldiers who meet conditions.', '373'],
  ['Camilla', 'Cat’s Name', 'Specialist counteractive', 'Revives Camilla after death by killing the attacker.', '373'],
  ['Camilla Have-Nots', 'Untouchable curse plans', 'Curse / post-mortem Nen', 'Have-Nots prepare suicide-based curses against rival princes.', '389-current'],
  ['Zhang Lei', 'Guardian coins', 'Conjuration', 'One coin per day accumulates value and may later awaken a holder.', '362-current'],
  ['Tserriednich', 'Parallel Future', 'Specialist', 'Ten-second future sight during Zetsu with divergent perceived reality.', '385'],
  ['Fugetsu', 'Magical Worm', 'Guardian Spirit Beast ability', 'Creates travel doors and altered return routes after Kacho’s death.', '374-current'],
  ['Kacho', 'Without You', 'Guardian Spirit Beast ability', 'Takes the form of the deceased twin and protects the survivor.', '383'],
  ['Halkenburg', 'Collective aura possession arrow', 'Enhancement / group ability', 'Unavoidable possession arrow created through unified marked followers.', '382-current'],
  ['Rihan', 'Predator', 'Conjuration / analysis ability', 'Creates a counter-beast after sufficient analysis of the target ability.', '382'],
  ['Musse', 'Secret Window', 'Surveillance ability', 'Monitors Camilla and transfers information to Benjamin after Musse’s death.', '373'],
  ['Longhi', 'Moonlight Act', 'Conjuration / contract', 'Formal treaty ability that binds Kurapika and reveals Beyond’s curse network.', '401'],
  ['Morena', 'Contagion', 'Specialist', 'Levels Heil-Ly members through murder points until abilities awaken.', '378-current'],
  ['Heil-Ly members', 'Door / spatial and combat abilities', 'Mixed', 'Teleportation, trap rooms, and newly awakened combat abilities support the hideout war.', '391-current'],
  ['Phantom Troupe', 'Aboard-ship combat abilities', 'Mixed', 'Known Troupe abilities remain relevant while the members hunt Hisoka and Heil-Ly.', '377-current'],
].map(([user, ability, type, mechanics, chapters]) => ({
  user, ability, type, mechanics, chapters, conditions: successionAbilityConditions[ability],
  source: wiki(successionAbilitySources[ability]),
}));

export const successionFactions = [
  ['Royal contest camps', 'Tier 1', 'Fourteen prince households competing, allying, spying, and surviving under ritual restrictions.', ['Princes', 'Queens', 'Private guards', 'Servants'], 'Kakin_Royal_Family'],
  ['Benjamin’s military network', 'Tiers 1–3', 'Elite soldiers, inherited abilities, surveillance assignments, and special martial-law leverage.', ['Benjamin', 'Balsamilco', 'Furykov', 'Rihan'], 'Benjamin_Hui_Guo_Rou'],
  ['Justice Bureau', 'Tier 2', 'Investigates crimes, holds hearings, protects witnesses, and limits royal action through legal procedure.', ['Kaiser', 'Cleapatro', 'Mizaistom', 'Melody'], 'Succession_Contest#Martial_Law'],
  ['Xi-Yu', 'Tiers 1 / 3 / 4', 'Onior’s family sponsors Zhang Lei and hunts Heil-Ly while managing its relationship with the Troupe.', ['Onior', 'Hinrigh', 'Lynch', 'Zakuro'], 'Xi-Yu_Family'],
  ['Cha-R', 'Tiers 1 / 5', 'Brocco Li’s family sponsors Luzurus, controls lower-tier logistics, and cooperates with the Troupe.', ['Brocco Li', 'Ken%27i Wang', 'Cha-R members'], 'Cha-R_Family'],
  ['Heil-Ly', 'Tiers 1 / 3 / hidden band', 'Morena’s twenty-three-person group uses Contagion, murder levels, and a spatial hideout to overturn the social order.', ['Morena', 'Luini', 'Dogman', 'Borksen'], 'Heil-Ly_Family'],
  ['Phantom Troupe', 'Tiers 3–5', 'Searches for Hisoka, bargains with mafia families, and probes the Heil-Ly network.', ['Chrollo', 'Nobunaga', 'Phinks', 'Feitan'], 'Phantom_Troupe'],
  ['Expedition command', 'Upper ship / separate mission', 'Zodiacs, Beyond, V6, and expedition specialists prepare for the New Continent and Dark Continent beyond the royal war.', ['Beyond', 'Cheadle', 'Mizaistom', 'Leorio'], 'Dark_Continent_Expedition'],
].map(([name, territory, objective, people, slug]) => ({ name, territory, objective, people, source: wiki(slug) }));

export const mafiaDossiers = [
  {
    family: 'Xi-Yu',
    sponsor: 'Zhang Lei branch / Onior',
    base: 'Tier 4 office; royal connection through Tier 1',
    leadership: ['Onior Longbao', 'Hinrigh Biganduffno', 'Zakuro Custard', 'Lynch Fullbokko'],
    members: ['Onior Longbao', 'Hinrigh Biganduffno', 'Lynch Fullbokko', 'Zakuro Custard', 'Connelly', 'Tassi', 'Misha Hao'],
    objectives: ['Control territory', 'Contain Heil-Ly', 'Find Hisoka', 'Manage Phantom Troupe cooperation'],
    risks: ['Heil-Ly teleport routes', 'Troupe volatility', 'Royal sponsorship exposure', 'Lower-tier murders'],
    source: wiki('Xi-Yu_Family'),
  },
  {
    family: 'Cha-R',
    sponsor: 'Luzurus branch / Brocco Li',
    base: 'Tier 5 office and warehouse',
    leadership: ['Brocco Li', "Ken'i Wang", 'Cha-R enforcers', 'surveillance staff'],
    members: ['Brocco Li', 'Tajao', "Ken'i Wang", 'Ittoku', 'Sun-bin', 'Tsudonke', 'Vic', 'eight indexed associates'],
    objectives: ['Control Tier 5 traffic', 'Cooperate with Troupe against Heil-Ly', 'Search for Hisoka', 'Protect cargo routes'],
    risks: ['Heil-Ly expansion', 'Troupe independent action', 'Military pressure', 'Warehouse exposure'],
    source: wiki('Cha-R_Family'),
  },
  {
    family: 'Heil-Ly',
    sponsor: 'Morena Prudo / broken Tserriednich tie',
    base: 'Hidden band between Tiers 2 and 3',
    leadership: ['Morena Prudo', 'Dogman', 'Borksen', 'Contagion players'],
    members: ['Morena Prudo', 'Bille', 'Cashew', 'Chiffon Toto', 'Daemon', 'Dogman', 'Gateaume', 'Gelato', 'Luini', 'Matvere', 'Montblanc Toto', 'Notre', 'Orarge', 'Padaille', 'Perigord', 'Quorolle', 'Sodom', 'Soufflé', 'Terebellum', 'Tevelares', 'Voconte', 'Yokotani', 'unidentified Associate 9', 'Borksen (recruit)'],
    objectives: ['Spread Contagion', 'Level through murders', 'Break the social order', 'Recruit or coerce useful targets'],
    risks: ['Xi-Yu and Cha-R response', 'Troupe invasion', 'Royal Army', 'Borksen negotiation outcome'],
    source: wiki('Heil-Ly_Family'),
  },
];

const mafiaRoles = {
  'Onior Longbao': 'Boss / royal half-brother', 'Hinrigh Biganduffno': 'Underboss / field lead', 'Lynch Fullbokko': 'Enforcer / search team', 'Zakuro Custard': 'Enforcer / search team',
  'Brocco Li': 'Boss / royal half-brother', "Ken'i Wang": 'Underboss / operations', Tajao: 'Route escort', Ittoku: 'Associate', 'Sun-bin': 'Associate', Tsudonke: 'Associate', Vic: 'Associate',
  'Morena Prudo': 'Boss / Contagion administrator', Dogman: 'Levelled search specialist', Borksen: 'Coerced recruit', Luini: 'Spatial attacker', Yokotani: 'Hideout defense', Voconte: 'Spatial route user',
};
const deceasedMafiaMembers = new Set(['Lynch Fullbokko', 'Luini', 'Padaille']);
export const mafiaMemberLedger = mafiaDossiers.flatMap((family) => family.members.map((name) => ({
  family: family.family,
  name,
  role: mafiaRoles[name] || (family.family === 'Heil-Ly' ? 'Contagion member / civilian occupation indexed on Hunterpedia' : 'Family member / associate'),
  nen: family.family === 'Heil-Ly' ? 'Contagion-awakened or unrevealed; verify per member' : 'Known only where individually revealed',
  location: family.base,
  status: deceasedMafiaMembers.has(name) ? 'Confirmed deceased' : name === 'Borksen (recruit)' ? 'Recruitment state / constrained choice' : 'Active or current state not individually confirmed',
  source: family.source,
})));

const troupeTrackerDetails = {
  'Chrollo Lucilfer': ['405–407', 'Upper-tier casino and funeral-route planning are shown; later route remains developing.', 'Chapter-scoped'],
  'Nobunaga Hazama': ['393–406', 'Kills Luini, enters the Room 3101 route, then moves toward Tier 2 with Phinks and Feitan.', 'Chapter-scoped'],
  'Phinks Magcub': ['398–406', 'Part of the three-person Heil-Ly breach group and Tier 2 approach.', 'Chapter-scoped'],
  'Feitan Portor': ['398–406', 'Part of the three-person Heil-Ly breach group and Tier 2 approach.', 'Chapter-scoped'],
  'Franklin Bordeau': ['377', 'Explicit stationary waiting strategy in the Tier 5 dining area.', 'Chapter-scoped'],
  'Hisoka Morow': ['405', 'Confirmed in the Tier 1 casino; sightings before that require separate confidence labels.', 'Chapter-scoped'],
};

export const troupeHisokaTracker = [
  ['Chrollo Lucilfer', 'Aboard', 'Preparing for Hisoka and possible treasure-related plans; exact route is incomplete.', 'unknown upper/lower transition'],
  ['Nobunaga Hazama', 'Aboard', 'Works with Phinks and Feitan, enters Heil-Ly route, kills Luini.', 'lower tiers / Heil-Ly route'],
  ['Phinks Magcub', 'Aboard', 'Lower-tier search party and Heil-Ly response.', 'lower tiers'],
  ['Feitan Portor', 'Aboard', 'Lower-tier search party and mafia contact.', 'lower tiers'],
  ['Machi Komacine', 'Aboard', 'Hisoka hunt; exact current location not always shown.', 'unknown'],
  ['Franklin Bordeau', 'Aboard', 'Stationary waiting strategy while others search.', 'Tier 5 dining area'],
  ['Bonolenov Ndongo', 'Aboard', 'Searches using disguise-related movement; mistaken sightings must be separated from confirmed Hisoka.', 'uncertain'],
  ['Shizuku Murasaki', 'Aboard', 'Assigned search movements with Chrollo-related objectives.', 'uncertain'],
  ['Illumi Zoldyck', 'Aboard / contracted', 'Joined the Troupe under Hisoka-related contract terms.', 'shipboard'],
  ['Kalluto Zoldyck', 'Aboard', 'Troupe member present in the Hisoka hunt.', 'shipboard'],
  ['Hisoka Morow', 'Target / possibly disguised', 'Confirmed as the hunt target; sightings and disguises require strict confidence labels.', 'unknown'],
  ['Pakunoda, Shalnark, Kortopi, Uvogin', 'Absent / deceased', 'Historical Troupe deaths should not be displayed as physically present aboard.', 'not aboard'],
].map(([name, status, objective, location]) => {
  const [lastChapter = 'Unknown', evidence = 'The current page does not establish a later location.', confidence = 'Unknown'] = troupeTrackerDetails[name] || [];
  return { name, status, objective, location, lastChapter, evidence, confidence, source: wiki(name.split(',')[0].replaceAll(' ', '_')) };
});

export const justiceMilitaryLedger = [
  ['Ministry of Justice / Supreme Court', 'Cleapatro', 'Final judicial authority aboard; legal procedure intersects with prince immunity.', 'Tier 1'],
  ['Justice Bureau', 'Kaiser', 'Witness protection, investigations, visitation, custody, and Fugetsu/Kacho-related operations.', 'Tier 2'],
  ['Crime Hunter authority', 'Mizaistom', 'Zodiac and security role constrained by Kakin command and legal jurisdiction.', 'Tier 3 / lower tiers'],
  ['Kakin Royal Army', 'Benjamin and senior officers', 'Security, surveillance, martial law, guard reassignment, and bulkhead closures.', 'Tiers 1-3'],
  ['Benjamin command staff', 'Balsamilco, Babimyna, Furykov', 'Operations against rival princes, analysis of Nen classes, and emergency power.', 'Tier 1'],
  ['Detention and hearings', 'Justice officials', 'Arrest, questioning, VIP witness protection, and investigation records.', 'Justice Bureau'],
  ['Special martial law', 'Benjamin’s emergency authority', 'Closes routes and changes access between upper tiers while the ritual continues.', 'Tiers 1-3'],
].map(([area, people, authority, place]) => ({ area, people, authority, place, source: wiki('Succession_Contest#Martial_Law') }));

export const expeditionLayer = [
  ['Beyond Netero', 'Detained figurehead of the Dark Continent expedition; also tied to the hidden curse-child network.', 'Tier 1 holding cell'],
  ['Zodiacs', 'Cheadle, Mizaistom, Botobai, Kurapika, Leorio and others carry the expedition governance burden.', 'Upper ship / offices'],
  ['V5 / V6', 'International framework expands to include Kakin after the public expedition declaration.', 'Political layer'],
  ['New Continent deception', 'Public destination differs from the true Dark Continent objective.', 'Voyage route'],
  ['Pariston and Ging group', 'Separate expedition faction whose agenda runs beside the royal contest.', 'background'],
  ['Temp Hunters and specialists', 'Personnel recruited for expedition labor and expertise, distinct from royal bodyguards.', 'shipwide'],
  ['Known calamities and guide requirements', 'Dark Continent risk frame remains background pressure during the voyage.', 'expedition dossier'],
  ['Beyond’s children and curses', 'A hidden network that may directly affect the royal contest.', 'current-arc reveal'],
].map(([topic, note, location]) => ({ topic, note, location, source: wiki('Dark_Continent_Expedition') }));

export const successionOperations = [
  ['Silent Majority murders', 'Unknown user weaponizes guards and Nen-class gatherings inside Room 1014.', '359–376', 'Room 1014', 'unresolved'],
  ['Vincent’s Room 1014 operation', 'Benjamin’s soldier enters under legal cover, kills Sandra, and attempts to control Woble’s remaining staff before Kurapika and Bill stop him.', '361', 'Room 1014', 'resolved'],
  ['Benjamin’s deployments', 'Elite soldiers enter rival rooms to observe beasts, abilities, and opportunities for legal assassination.', '361–current', 'Tier 1', 'active'],
  ['Momoze murder and retaliation', 'Tuffdy kills Momoze; Hanzo’s double obtains a confession and kills him.', '368–370', 'Rooms 1012 / 1013', 'resolved'],
  ['Camilla counterattack', 'Camilla kills Musse, confronts Benjamin, and demonstrates the danger of killing her directly.', '373', 'VVIP / Tier 1', 'contained'],
  ['Salé-salé elimination', 'Rihan removes the prince’s beast and Yushohi completes the assassination.', '381–382', 'Room 1008', 'resolved'],
  ['Twin-prince escape', 'Melody’s banquet performance covers a lifeboat attempt that triggers the ritual’s exit restriction.', '383', 'Banquet hall / lifeboats', 'failed'],
  ['Halkenburg possession campaign', 'Collective aura displaces consciousness and carries Halkenburg’s plan inside Benjamin’s command structure.', '382–current', 'Tiers 1–3', 'active'],
  ['Theta’s Zetsu test', 'Theta tries to exploit Tserriednich’s training, revealing his future-sight ability and personal beast.', '383–387', 'Room 1004', 'failed'],
  ['Fugetsu curse investigation', 'Melody, Kaiser, Kacho’s continuing beast, and allied guards investigate the spirits, exhaustion, routes, and possible culprit around Fugetsu.', '388–current', 'Justice Bureau / Tier 1', 'active'],
  ['Hisoka search', 'Troupe and mafia teams sweep the lower and upper recreational tiers through real and false sightings.', '377–current', 'Tiers 1–5', 'active'],
  ['Heil-Ly leveling war', 'Contagion turns civilian murders into ability growth and opens conflict with every established faction.', '378–current', 'Tiers 3–5', 'active'],
  ['Room 3101 breach', 'Hinrigh and Nobunaga enter the hidden route, map the Nen-reinforced base, and leave a transmitter.', '398–405', 'Tier 3 / hidden band', 'active'],
  ['Borksen recruitment game', 'Heil-Ly abducts Borksen and Morena uses a rule-bound card negotiation to force a membership decision under special martial law.', '407–410', 'Heil-Ly hideout', 'resolved'],
  ['Sarahell curse infiltration', 'A Camilla Have-Not enters Kurapika’s expanded class with a death-powered curse plan aimed at Woble.', '411–current', 'Room 1014', 'active'],
  ['Funeral and special martial law', 'Halkenburg’s procession becomes a convergence point while the military closes the upper bulkhead and the casket reaches the King’s gate.', '405–413', 'Tiers 1–3', 'active'],
].map(([name, summary, chapters, place, status]) => ({ name, summary, chapters, place, status, source: wiki(`Chapter_${chapters.split('–')[0]}`) }));

export const exceptionalStatuses = [
  ['Confirmed deceased', 'A red X marks a death confirmed by Hunterpedia.'],
  ['Eliminated', 'The prince is out of the ritual contest; this may require more context than physical death alone.'],
  ['Body deceased / consciousness active', 'Halkenburg’s original body and continuing consciousness are tracked separately.'],
  ['Guardian beast continuation', 'Kacho is deceased while Without You remains active in her form.'],
  ['Possessed or displaced', 'The body’s occupant and original consciousness are recorded as separate state fields.'],
  ['Confined or detained', 'Legal location is not treated as death or elimination.'],
  ['Unknown', 'Missing, disguised, or unresolved identity is not converted into a factual status.'],
];

export const bodyStateLedger = [
  ['Confirmed deceased', 'Salé-salé, Kacho, Momoze, Vincent, Musse, and other confirmed deaths', 'Red X only applies here.', 'deceased'],
  ['Original body deceased / consciousness active', 'Halkenburg', 'His original body is dead while his consciousness remains active elsewhere.', 'exceptional'],
  ['Body occupied', 'Balsamilco Might', 'Balsamilco’s body is occupied; original consciousness status remains unresolved.', 'exceptional'],
  ['Guardian Spirit Beast continuation', 'Kacho / Without You', 'Kacho is dead but her beast continues in her form beside Fugetsu.', 'exceptional'],
  ['Possessed or displaced', 'Shikaku and Halkenburg operation victims', 'Body and consciousness must be tracked separately.', 'exceptional'],
  ['Confined or detained', 'Camilla, Benjamin, Beyond, others by circumstance', 'Legal confinement is not equivalent to death or elimination.', 'legal'],
  ['Missing / unknown', 'Hisoka and several lower-tier positions', 'Unknown location must remain unknown until sourced.', 'unknown'],
  ['Disguised or identity uncertain', 'Potential Hisoka sightings and Troupe movement', 'Confirmed sightings and mistaken sightings need separate records.', 'unknown'],
].map(([state, examples, rule, className]) => ({ state, examples, rule, className, source: wiki('Succession_Contest_arc') }));

export const successionRelationships = [
  ['Kurapika', 'Oito & Woble', 'Contract / protection', 'Kurapika’s central mission is keeping Woble alive while pursuing the Scarlet Eyes.', 'Preparation onward', '349–current', 'active'],
  ['Kurapika', 'Zhang Lei', 'Working alliance', 'Information, guards, and coin analysis move between Rooms 1014 and 1003.', 'Voyage', '370–current', 'active'],
  ['Kurapika', 'Tubeppa / Longhi', 'Conditional treaty', 'Moonlight Act formalizes cooperation while Beyond’s curse network remains a hidden risk.', 'Voyage', '401–current', 'conditional'],
  ['Kurapika', 'Bill', 'Hunter partnership', 'Bill manages room defense, borrowed abilities, teaching support, and direct tactical work beside Kurapika.', 'Preparation onward', '349–current', 'active'],
  ['Kurapika', 'Shimano', 'Employer / strategic trust', 'Shimano becomes the room’s communication coordinator and repeatedly stabilizes negotiations among stronger actors.', 'Voyage', '359–current', 'active'],
  ['Kurapika', 'Nen students', 'Teacher / political exchange', 'The lessons exchange knowledge for time, visibility, and a broader stalemate among the royal camps.', 'Voyage Days 2–12', '369–current', 'active'],
  ['Benjamin', 'Elite soldiers', 'Command / inheritance', 'Loyal military service gives Benjamin surveillance reach and post-mortem ability inheritance.', 'Voyage', '359–current', 'strained'],
  ['Benjamin', 'Balsamilco', 'Command / adviser', 'Balsamilco turns Benjamin’s political objectives into disciplined military operations until Halkenburg’s body-transfer attack.', 'Voyage', '359–current', 'exceptional'],
  ['Benjamin', 'Camilla', 'Sibling rivalry / detention', 'Open hostility becomes a legal and military contest after Camilla’s failed attack and revival.', 'Voyage', '373–current', 'hostile'],
  ['Benjamin', 'Halkenburg', 'Assassination target / body conflict', 'Each camp attempts to neutralize the other while the possession operation destabilizes identity and command.', 'Voyage', '382–current', 'hostile'],
  ['Camilla', 'Have-Nots', 'Royal loyalty / curse contract', 'Personal soldiers prepare long-term curses powered by their own deaths.', 'Preparation onward', '359–current', 'active'],
  ['Camilla', 'Sarahell', 'Curse operator / Woble target', 'Sarahell seeks an assignment near Room 1014 so her death-powered curse can reach Woble.', 'Voyage Day 12', '411–current', 'active'],
  ['Zhang Lei', 'Coventoba', 'Guard / embedded surveillance', 'Benjamin’s soldier observes the Third Prince while receiving one of the beast’s numbered coins.', 'Voyage', '362–current', 'covert'],
  ['Tserriednich', 'Theta', 'Teacher / assassination target', 'Theta teaches Nen while secretly trying to prevent Tserriednich’s growth and kill him if possible.', 'Voyage', '362–current', 'deceptive'],
  ['Tserriednich', 'Salkov', 'Guard / Nen instructor', 'Salkov supports the prince’s training while remaining uncertain about Theta’s private plan.', 'Voyage', '362–current', 'active'],
  ['Tubeppa', 'Longhi', 'Prince / hidden curse child', 'Longhi serves Tubeppa while concealing her origin in Beyond’s sacrifice network until bargaining with Kurapika.', 'Voyage', '400–current', 'disclosed'],
  ['Halkenburg', 'Marked followers', 'Collective will', 'Shared resolve amplifies aura and enables the possession arrow.', 'Voyage', '382–current', 'active'],
  ['Halkenburg', 'Balsamilco', 'Possessor / possessed body', 'Halkenburg’s consciousness operates through Balsamilco’s body after the assassination exchange.', 'Voyage Day 12', '404–current', 'exceptional'],
  ['Kacho', 'Fugetsu', 'Twin protection', 'Without You makes the sisters’ emotional bond a literal post-death defense.', 'Voyage', '359–current', 'exceptional'],
  ['Melody', 'Kaiser', 'Justice cooperation', 'They coordinate protection, investigation, letters, and the consequences of the escape attempt.', 'Voyage', '383–current', 'uncertain'],
  ['Melody', 'Kacho & Fugetsu', 'Hunter contract / emotional loyalty', 'A bodyguard contract becomes a personal effort to protect both twins from the ritual and their household.', 'Preparation onward', '349–current', 'active'],
  ['Sevanti', 'Marayam', 'Mother / protected child', 'Sevanti concentrates guards around Marayam and remains with him inside the isolated Nen space.', 'Voyage', '359–current', 'isolated'],
  ['Sevanti', 'Momoze', 'Mother / reassignment', 'Moving most protection away from Momoze leaves the Twelfth Prince exposed before her murder.', 'Voyage Day 1', '359–368', 'ended'],
  ['Onior', 'Zhang Lei', 'Mafia sponsorship / kinship', 'Xi-Yu’s royal branch supports the Third Prince.', 'Preparation onward', '350–current', 'active'],
  ['Brocco Li', 'Luzurus', 'Mafia sponsorship / kinship', 'Cha-R’s royal branch supports the Seventh Prince.', 'Preparation onward', '350–current', 'active'],
  ['Morena', 'Tserriednich', 'Former sponsorship / royal tie', 'Heil-Ly’s break from the old order threatens its former benefactor and every established family.', 'Voyage', '378–current', 'broken'],
  ['Morena', 'Heil-Ly members', 'Leader / Contagion network', 'Leveling, recruitment, and ability awakening bind civilian members to Morena’s destruction campaign.', 'Voyage', '378–current', 'active'],
  ['Morena', 'Borksen', 'Captor / recruit', 'A formalized card negotiation constrains coercion, questions, and the available outcomes of recruitment.', 'Voyage', '407–410', 'forced'],
  ['Xi-Yu', 'Cha-R', 'Nonaggression / shared enemy', 'The two established families preserve the balance of lower-tier territory while coordinating against Heil-Ly.', 'Voyage', '378–current', 'conditional'],
  ['Xi-Yu & Cha-R', 'Phantom Troupe', 'Temporary cooperation', 'The mafia uses the Troupe against Heil-Ly while trying to control the Hisoka search.', 'Voyage', '378–current', 'conditional'],
  ['Phantom Troupe', 'Hisoka', 'Mutual hunt', 'Revenge and preemption drive movement across the ship.', 'Voyage', '377–current', 'hostile'],
  ['Hinrigh', 'Nobunaga', 'Operational cooperation', 'Xi-Yu intelligence and Troupe combat experience combine during the Room 3101 hideout breach.', 'Voyage', '398–current', 'temporary'],
  ['Justice Bureau', 'Royal Army', 'Overlapping authority', 'Investigation, custody, security, and special martial law create competing chains of command.', 'Voyage', '359–current', 'strained'],
  ['Kaiser', 'Kakin Justice Bureau', 'Officer / uncertain loyalty', 'Kaiser uses legal access to protect the twins and move information while his motives remain questioned.', 'Voyage', '383–current', 'uncertain'],
  ['Beyond Netero', 'Curse children', 'Hidden parentage / sacrifice', 'Longhi describes a network designed to affect the royal contest from within.', 'Before voyage onward', '340–current', 'hidden'],
  ['Beyond Netero', 'Zodiacs', 'Detainee / expedition authority', 'The Zodiacs guard Beyond while relying on his expedition expertise and preparing for the true destination.', 'Expedition setup onward', '340–current', 'strained'],
].map(([from, to, type, note, phase, chapters, state]) => ({ from, to, type, note, phase, chapters, state, source: wiki('Succession_Contest_arc') }));

export const successionObjects = [
  ['Seed Urn', 'Creates the princes’ parasitic Guardian Spirit Beasts through the royal blood ritual.', 'Guardian_Spirit_Beast#The_Seed_Urn'],
  ['Burial chamber', 'Fourteen caskets and a central apparatus whose complete ritual purpose remains unknown.', 'Black_Whale#Princes%27_Burial_Chamber'],
  ['Zhang Lei’s coins', 'Daily conjured objects that accumulate numbers and may awaken holders under later conditions.', 'Zhang_Lei_Hui_Guo_Rou'],
  ['Scarlet Eyes', 'Tserriednich’s collection remains Kurapika’s personal objective inside the political mission.', 'Scarlet_Eyes'],
  ['Book of Tyson', 'Doctrine distributed to followers and tied to the conditions of Tyson’s beast.', 'Tyson_Hui_Guo_Rou'],
  ['Kacho’s letters', 'Messages carried through Tier 1 to share warnings and influence alliances after the escape attempt.', 'Chapter_402'],
  ['Magical Worm doors', 'Outgoing and return routes generated by Fugetsu’s Guardian Spirit Beast.', 'Fugetsu_Hui_Guo_Rou'],
  ['TSK-17', 'Biological agent used in the Halkenburg and Balsamilco operation.', 'Chapter_404'],
  ['Room tickets', 'Access controls movement through class-divided corridors and lower-tier passages.', 'Black_Whale'],
  ['Tracking transmitters', 'Used to test and map the Heil-Ly spatial hideout.', 'Chapter_405'],
  ['Lifeboat controls', 'Secured emergency system used in Kacho and Fugetsu’s failed departure.', 'Black_Whale#Lifeboat_Launch_Site'],
  ['Morena’s negotiation cards', 'Choice system used to recruit or bind Borksen through explicit options and consequences.', 'Chapter_407'],
].map(([name, note, slug]) => ({ name, note, source: wiki(slug) }));

export const successionEvidence = [
  ['Seed Urn', 'Ritual trigger and beast creation mechanism.', 'Guardian_Spirit_Beast#The_Seed_Urn', 'ritual'],
  ['Guardian Spirit Beast eggs', 'Symbolic and mechanical output of the ceremony.', 'Guardian_Spirit_Beast', 'ritual'],
  ['Fourteen burial caskets', 'Endgame structure for the royal deathmatch.', 'Black_Whale#Princes%27_Burial_Chamber', 'ritual'],
  ['Zhang Lei’s coins', 'Accumulating objects with delayed ability implications.', 'Zhang_Lei_Hui_Guo_Rou', 'ability'],
  ['Scarlet Eyes', 'Tserriednich’s possession ties Kurapika’s personal mission to Room 1004.', 'Scarlet_Eyes', 'object'],
  ['Kacho’s letters', 'Evidence and warning route after the escape attempt.', 'Chapter_402', 'document'],
  ['Fugetsu’s doors', 'Routes and return constraints generated by Magical Worm.', 'Fugetsu_Hui_Guo_Rou', 'ability'],
  ['TSK-17', 'Biological agent in the Halkenburg/Balsamilco operation.', 'Chapter_404', 'weapon'],
  ['Tracking transmitters', 'Used to test Heil-Ly route mechanics.', 'Chapter_405', 'device'],
  ['Room tickets and access passes', 'Movement restrictions across class and tier boundaries.', 'Black_Whale', 'access'],
  ['Lifeboat controls', 'Escape route hardware blocked by ritual consequences.', 'Black_Whale#Lifeboat_Launch_Site', 'ship system'],
  ['Surveillance devices', 'Military and mafia monitoring infrastructure.', 'Black_Whale', 'device'],
  ['Morena’s negotiation cards', 'Card-game structure used in Borksen’s recruitment test.', 'Chapter_407', 'evidence'],
  ['Tyson’s book', 'Doctrine and possible taboo object tied to Tyson’s followers.', 'Tyson_Hui_Guo_Rou', 'object'],
].map(([name, note, slug, kind]) => ({ name, note, kind, source: wiki(slug) }));

export const successionMysteries = [
  ['Silent Majority user', 'The operator’s identity and complete targeting method remain unresolved.', 'open', '411'],
  ['Woble’s Guardian Spirit Beast', 'Neither its appearance nor ability has been revealed.', 'open', '411'],
  ['Burial chamber purpose', 'The central apparatus and fourteen-casket end condition remain unexplained.', 'open', '404'],
  ['Nasubi’s intended role', 'The king’s interpretation of survival and the ritual’s final exchange remain uncertain.', 'open', '382'],
  ['Beyond’s royal child', 'Longhi’s disclosure raises the possibility that one prince is Beyond’s child without identifying that prince.', 'open', '401'],
  ['Remaining curse children', 'The identities, targets, and activation state of Beyond’s sacrificial children are incomplete.', 'open', '411'],
  ['Halkenburg’s endgame', 'His consciousness remains active outside his dead original body, but the final transfer plan is unresolved.', 'developing', '411'],
  ['Tserriednich’s limits', 'Parallel Future, his personal beast, and the speed of his development still have unknown constraints.', 'developing', '387'],
  ['Fugetsu’s affliction', 'The source and cure of the curse-like spirits around her remain under investigation.', 'developing', '411'],
  ['Kacho / Without You', 'How long the beast can preserve the deception and what happens if Fugetsu dies remain unresolved.', 'open', '411'],
  ['Hisoka–Troupe collision', 'Both sides’ next confirmed meeting point remains unknown.', 'open', '406'],
  ['Chrollo’s preparation', 'The exact treasures, abilities, and route required for his plan are incomplete.', 'developing', '406'],
  ['Heil-Ly route network', 'The full map of entrances, exits, and spatial conditions is not known.', 'developing', '410'],
  ['Kurapika’s lifespan', 'Emperor Time’s accumulated cost and his route to the Scarlet Eyes remain central dangers.', 'open', '411'],
  ['Martial-law outcome', 'The legal and ritual consequences of Benjamin’s emergency authority remain unresolved through Chapter 413.', 'developing', '413'],
].map(([question, evidence, status, lastChapter]) => ({ question, evidence, status, lastChapter, source: wiki('Succession_Contest_arc') }));

export const shipRouteLayers = [
  ['Royal ring', 'King’s quarters ↔ banquet hall ↔ prince rooms 1001–1014 ↔ VVIP and associate housing', 'Guarded walls and prescribed access'],
  ['Justice route', 'Tier 1 court and jail ↔ Tier 2 Justice Bureau ↔ Tier 3 political ward', 'Legal escorts and custody'],
  ['Public spine', 'Tier 2 entertainment ↔ Tier 3 civic decks ↔ Tier 4 commerce ↔ Tier 5 mass housing', 'Tickets and class restrictions'],
  ['Mafia vertical links', 'Tier 1 bosses ↔ Xi-Yu Tier 4 ↔ Cha-R Tier 5 ↔ abandoned Heil-Ly Tier 3 office', 'Unofficial controlled passages'],
  ['Heil-Ly network', 'Rooms 3101 / 3131 ↔ shower Rooms A/B ↔ secret hideout entrances', 'Nen-mediated teleportation'],
  ['Emergency route', 'Banquet passage ↔ secured lifeboat launch ↔ hull waterway', 'Keypad and Royal Army control'],
  ['Funeral route', 'Tier 3 hospital ↔ Tier 2 Justice area ↔ Tier 1 funeral hall', 'Procession under martial law'],
  ['Service band', 'Warehouses, clinics, food systems, and sewage facility between Tiers 4–5', 'Infrastructure and supply'],
].map(([name, path, access]) => ({ name, path, access, source: wiki('Black_Whale') }));

export const dossierSources = {
  arc: wiki('Succession_Contest_arc'),
  contest: wiki('Succession_Contest'),
  family: wiki('Kakin_Royal_Family'),
  beasts: wiki('Guardian_Spirit_Beast'),
  roster: wiki('List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current'),
  ship: wiki('Black_Whale'),
};
