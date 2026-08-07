const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_342';

export const succession342SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 342',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location,
  tracks,
  confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes',
}) => freeze({
  id,
  time: 'Pre-voyage · Dark Continent expedition preparation',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 342,
  confidence,
  source,
});

export const succession342TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-342-beyond-interview',
    title: 'Cheadle interviews Beyond in Zodiac custody',
    detail: 'Beyond is held in a cell while Cheadle questions him under observation by the Zodiacs. Beyond predicts that the Zodiacs will eventually release him and accompany him to the Dark Continent. Cheadle treats the exchange as an adversarial information battle and proposes recording the conversation.',
    location: 'Hunter Association · Beyond detention area',
    tracks: ['beyond', 'zodiacs', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-expedition-survival-record',
    title: 'The IPA reviews humanity’s catastrophic expedition record',
    detail: 'V5 personnel and Steiner review at least 149 attempts to reach the Dark Continent. Only five voyages returned with survivors, totaling 28 people, and only three of those survivors were eventually able to return to ordinary life. Beyond is identified as the only one of those three still alive.',
    location: 'International Permit Agency · V5 briefing',
    tracks: ['ipa', 'v5', 'expedition', 'calamities'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-guide-gatekeeper-system',
    title: 'The Gatekeeper and Guide system is explained',
    detail: 'The briefing states that humanity has never completed a Dark Continent round trip independently. Passage across the Far Ocean Boundary requires a Guide summoned by a Gatekeeper, and the Gatekeepers belong to a magical-beast clan described as the only pipeline to the Dark Continent.',
    location: 'International Permit Agency · V5 briefing',
    tracks: ['ipa', 'v5', 'expedition', 'gatekeeper'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-v6-proposal',
    title: 'Steiner proposes absorbing Kakin into a new V6 framework',
    detail: 'Because Kakin cannot easily be stopped except through limited military options, Steiner proposes supporting the expedition while inviting Kakin into the international bloc, reorganizing the V5 as the V6 and placing the voyage inside a managed political structure.',
    location: 'International Permit Agency · V5 briefing',
    tracks: ['v5', 'kakin', 'ipa', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-zodiacs-escort-beyond',
    title: 'The Zodiacs accept the structure of escorting Beyond to the Dark Continent',
    detail: 'Beyond frames his cooperation as a challenge to the Zodiacs. Cheadle accepts, contacts the V5, and the operating plan becomes clear: the Association will transport Beyond as a prisoner, release him after reaching the Dark Continent, and keep him under surveillance while he reconnects with his companions. Saccho volunteers to watch him.',
    location: 'Hunter Association · Beyond detention area',
    tracks: ['beyond', 'zodiacs', 'v5', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-cheadle-expands-association-role',
    title: 'Cheadle expands the expedition beyond the Zodiacs',
    detail: 'Cheadle changes her earlier position that only the Zodiacs should participate and determines that the full Hunter Association will be needed. Kakin will conduct the voyage while the Hunter Association serves as the expedition’s chaperone and controlling escort around Beyond.',
    location: 'Hunter Association · expedition planning',
    tracks: ['zodiacs', 'hunter-association', 'kakin', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-new-continent-plan',
    title: 'Neutral-zone islands become the public New Continent destination',
    detail: 'The international plan distinguishes the true Dark Continent from uninhabited islands inside the neutral zone within the Far Ocean Boundary. Those islands can receive migrants and function publicly as the New Continent while the dangerous onward expedition remains controlled.',
    location: 'Far Ocean Boundary · neutral zone',
    tracks: ['expedition', 'kakin', 'v5'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-black-whale-announced',
    title: 'The Black Whale is presented as Kakin’s mass-transport vessel',
    detail: 'Kakin publicly presents the Black Whale as the commemorative vessel for the maiden voyage. It is designed to carry roughly 200,000 people, including Beyond Netero, King Nasubi, and all fourteen princes, while ordinary civilian seats are distributed by lottery.',
    location: 'Kakin Empire · Black Whale public presentation',
    tracks: ['kakin', 'black-whale', 'expedition', 'ritual'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-mass-migration-plan',
    title: 'Nasubi announces an enormous long-term migration program',
    detail: 'Nasubi’s public plan calls for constructing twenty Black Whale-class ships in one year and ultimately sending one hundred million people toward the New World over five years. The maiden voyage is framed as the beginning of a much larger colonization program.',
    location: 'Kakin Empire · Black Whale public presentation',
    tracks: ['kakin', 'black-whale', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-342-ging-confronts-pariston',
    title: 'Ging confronts Pariston inside Beyond’s expedition team',
    detail: 'Ging enters the Dark Continent Expedition Team’s base and confronts Pariston. Ging claims that if the government fails to answer Beyond’s provocation and send the expedition onward, Pariston intends to unleash 5,000 Chimera soldiers he is sheltering. Ging states that he will no longer allow Pariston to act freely and challenges him directly.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'beyond', 'expedition', 'chimera-ants'],
    confidence: 'Ging’s claim that Pariston controls 5,000 Chimera soldiers is preserved as Ging’s stated assessment; Chapter 342 does not independently verify the force or deployment plan',
  }),
  timelineEvent({
    id: 'pre-voyage-342-ging-joins-team',
    title: 'Ging seeks entry into Beyond’s expedition team on his own terms',
    detail: 'Ging asks to join Beyond’s group while rejecting Pariston’s assumption that this means Ging will cooperate with him. Ging frames his involvement as playing independently and positioning himself inside the expedition conflict rather than becoming Pariston’s ally.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'beyond', 'expedition'],
  }),
]);

export const succession342ExpeditionStatistics = freeze({
  attemptedVoyages: 149,
  voyagesWithReturningSurvivors: 5,
  totalReturningSurvivors: 28,
  survivorsReturnedToOrdinaryLife: 3,
  suppliedSurvivalRate: '0.04% (3 out of 7,500 people)',
  beyondStatus: 'Only one of the three ordinary-life returnees stated to still be alive',
  treatyContext: 'The five returning voyages were unofficial attempts made after the V5 Inviolability Treaty',
  source,
});

export const succession342PassageSystem = freeze({
  knownWorld: 'Located inside the enormous Lake Mobius, which itself lies within the Dark Continent',
  farOceanBoundary: 'Human expeditions cannot independently cross and return through this boundary',
  guide: 'A being required for passage and summoned by the Gatekeeper',
  gatekeeper: 'Member of a magical-beast clan described as the only pipeline to the Dark Continent',
  newContinent: 'Uninhabited islands within the neutral zone that can receive migrants without being the true Dark Continent',
  source,
});

export const succession342BlackWhalePlan = freeze({
  maidenCapacity: 200000,
  commemorativePassengers: freeze(['Beyond Netero', 'Nasubi Hui Guo Rou', 'Fourteen Kakin princes']),
  civilianLotteryOdds: '1 in 1,300 for a seat on the first ship',
  constructionClaim: '20 Black Whale-class ships in one year',
  fiveYearMigrationClaim: '100 million people sent toward the New World in five years',
  operatingStructure: 'Kakin conducts the voyage; the Hunter Association acts as chaperone',
  source,
});

const focus = 'Beyond predicts the Zodiacs will escort and eventually release him at the Dark Continent, the IPA reveals the near-zero survival history and the Gatekeeper/Guide passage system, Steiner proposes converting the V5 into a V6 with Kakin, Cheadle commits the full Hunter Association to the voyage, the Black Whale and New Continent migration structure are announced, and Ging enters Beyond’s team to challenge Pariston over his alleged 5,000 Chimera soldiers.';

export const succession342ChapterResearch = freeze([
  freeze({
    number: 342,
    title: 'Challenge',
    japaneseTitle: null,
    romanizedTitle: 'Fukoku',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Expedition politics',
      'International Permit Agency',
      'V5 / V6',
      'Beyond Netero',
      'Zodiacs',
      'Black Whale',
      'Ging & Pariston',
    ]),
    focus,
    events: succession342TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Beyond Netero',
      'Cheadle Yorkshire',
      'Kanzai',
      'Saccho Kobayakawa',
      'Mizaistom Nana',
      'Gel',
      'Steiner',
      'IPA Director',
      'Nasubi Hui Guo Rou',
      'Ging Freecss',
      'Pariston Hill',
      'Zodiacs',
      'Fourteen Kakin princes',
      'Dark Continent Expedition Team',
    ]),
    locations: freeze([
      'Hunter Association · Beyond detention area',
      'International Permit Agency · V5 briefing',
      'Far Ocean Boundary · neutral zone',
      'Kakin Empire · Black Whale public presentation',
      'Beyond Netero expedition team · base',
      'Lake Mobius',
      'Dark Continent',
    ]),
    threadLabels: freeze([
      'Dark Continent expedition',
      'Beyond Netero',
      'Zodiacs',
      'V5 / V6',
      'International Permit Agency',
      'Black Whale',
      'Kakin Empire',
      'Ging & Pariston',
      'Gatekeeper & Guide',
    ]),
    expeditionStatistics: succession342ExpeditionStatistics,
    passageSystem: succession342PassageSystem,
    blackWhalePlan: succession342BlackWhalePlan,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 342 text',
      'The 149 attempts, five returning voyages, 28 survivors, three ordinary-life returnees, and supplied 0.04% survival rate are preserved exactly from the supplied chapter notes',
      'The Guide and Gatekeeper relationship is treated as confirmed chapter exposition, while their deeper biology and operating conditions remain unresolved',
      'The Rank-B or Rank-A Dark Continent creature statements are rumors in the supplied text and are not promoted to confirmed classifications',
      'Ging’s statement about Pariston sheltering 5,000 Chimera soldiers is stored as Ging’s claim rather than independently verified fact',
      'The supplied text gives the romanization Fukoku but does not include the Japanese title characters, so japaneseTitle is intentionally left unset',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, expedition statistics, passage-system rules, Black Whale migration plan, political assignments, and source confidence linked',
    coverage: freeze({
      identity: true,
      publication: false,
      summary: true,
      sceneSummary: true,
      chronology: true,
      appearances: true,
      locations: true,
      relationships: true,
      assignments: true,
      nen: false,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession342SourcePolicy.soleSource]),
  }),
]);

export const succession342ChapterFocus = freeze({ 342: focus });

export const succession342Mysteries = freeze([
  freeze({
    question: 'What exactly are the Guide and Gatekeeper, and what conditions govern their cooperation?',
    evidence: 'Chapter 342 establishes that a Gatekeeper summons the Guide required to cross the Far Ocean Boundary and calls the Gatekeeper clan the only pipeline to the Dark Continent, but does not explain their full rules or motives.',
    status: 'open',
    lastChapter: '342',
    source,
  }),
  freeze({
    question: 'What is Pariston’s actual plan for the alleged 5,000 Chimera soldiers?',
    evidence: 'Ging claims Pariston is sheltering 5,000 Chimera soldiers and would deploy them if the government failed to answer Beyond’s challenge, but the chapter does not independently confirm the force or its operational plan.',
    status: 'open',
    lastChapter: '342',
    source,
  }),
]);
