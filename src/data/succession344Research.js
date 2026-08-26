const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_344';
const referenceImage = '/media/succession-contest/chapters/344/summary-five-trips-reference.svg';

export const succession344SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleTextSource: freeze({
    label: 'Hunterpedia Chapter 344',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  userMedia: freeze({
    label: 'Summary of the Five Trips table',
    path: referenceImage,
    basis: 'User-supplied reference image; recreated as an in-repo SVG so the visual and its text remain available together',
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
  time: 'Pre-voyage · expedition preparation',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 344,
  confidence,
  source,
});

export const succession344TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-344-kurapika-scarlet-eyes-recall',
    title: 'Kurapika recalls recovering earlier sets of Scarlet Eyes',
    detail: 'Kurapika reflects on the Scarlet Eyes he has already recovered before continuing toward the Dark Continent mission. The chapter uses that history to frame Tserriednich’s remaining collection as the unresolved core of Kurapika’s personal objective.',
    location: 'Kurapika · pre-voyage travel context',
    tracks: ['kurapika', 'scarlet-eyes', 'tserriednich'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-ging-buys-no2-position',
    title: 'Ging secures the expedition team’s No. 2 title with money',
    detail: 'Members of Beyond’s expedition team remain resistant to Ging claiming the second position. Rather than fight them, Ging offers to pay each member double the amount Beyond paid them up front. Pariston raises no objection, and the arrangement establishes Ging as No. 2 in name only rather than by a formal strength ranking.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'pariston', 'beyond', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-team-member-hospital-payment',
    title: 'Ging’s payment immediately changes one member’s circumstances',
    detail: 'A team member supplies Ging with an account number, leaves, and later returns after using the money to save his younger sister in the hospital. He accepts Ging as the team’s second-place member under the new arrangement.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-leorio-kurapika-contact',
    title: 'Leorio reconnects with Kurapika during the Zodiac transition',
    detail: 'Leorio contacts Kurapika while Kurapika is traveling with Mizaistom. Kurapika asks about Gon and is told that Gon is currently fine. Kurapika thanks Mizaistom for the route to Tserriednich, while Mizaistom warns him that the Fourth Prince has a dangerous hidden side.',
    location: 'Hunter Association / Kurapika vehicle call',
    tracks: ['kurapika', 'leorio', 'mizaistom', 'tserriednich', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-gon-nen-inaccessible',
    title: 'Gon discovers that he cannot access Nen',
    detail: 'Gon attempts to activate his aura and is surprised to find that he can no longer access Nen. Chapter 344 confirms the failure to use aura at this point but does not establish the complete cause, permanence, or recovery conditions.',
    location: 'Gon · post-recovery setting',
    tracks: ['gon', 'nen'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-five-threats-briefing',
    title: 'Ging explains the Five Threats and the lack of countermeasures',
    detail: 'Ging briefs expedition members on the Five Threats. The supplied chapter notes classify all five as more dangerous than the Chimera Ants and present isolation and avoidance as the best available response. Victims of Ai and Pap have already appeared in the known world, and the threats are kept off-record in the International Environmental Agency basement.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'expedition', 'calamities', 'chimera-ants', 'iea'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-guide-lesson-theory',
    title: 'Ging theorizes that the returned calamities may be a lesson from the Guide',
    detail: 'Ging suggests that the Guide may have forced the V5 expeditions to bring the Five Threats home as a lesson. Because Beyond intends to take an unexplored route, Ging warns that another unknown calamity could return as a sixth threat.',
    location: 'Beyond Netero expedition team · base',
    tracks: ['ging', 'gatekeeper', 'guide', 'calamities', 'beyond'],
    confidence: 'The danger of an unexplored route is confirmed as a concern; the idea that the Guide intentionally imposed the Five Threats as a lesson is Ging’s theory',
  }),
  timelineEvent({
    id: 'pre-voyage-344-netero-zigg-linne-trip',
    title: 'Isaac Netero’s undocumented Dark Continent expedition is identified',
    detail: 'Ging reveals that Isaac Netero secretly entered the Dark Continent on an undocumented journey accompanied by Zigg Zoldyck and Linne Horsdoeuvre. Netero later described the continent as overwhelmingly vast.',
    location: 'Dark Continent · undocumented expedition history',
    tracks: ['netero', 'zigg', 'linne', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-beyond-metallion-zobae',
    title: 'Beyond’s earlier expedition recovered Metallion and returned with Zobae',
    detail: 'Beyond’s expedition successfully brought back the alchemy plant Metallion, although the specimen eventually died. By leaving the established route, the expedition also returned with Zobae Disease. The supplied chapter notes identify this failure as the event that drove Isaac Netero to persuade the V5 to make Dark Continent travel taboo for the Hunter Association.',
    location: 'Dark Continent → known world · Beyond expedition history',
    tracks: ['beyond', 'netero', 'v5', 'zobae', 'metallion', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-344-don-freecss-author',
    title: 'Don Freecss is revealed as the author of Journey to the New World',
    detail: 'Ging identifies Don Freecss as the author of Journey to the New World, written about three hundred years earlier. The work has East and West editions, but only the East edition has been found. Ging proposes a third explanation for the missing West edition: Don may still be exploring Lake Mobius and writing it.',
    location: 'Beyond Netero expedition team · base / Lake Mobius historical frame',
    tracks: ['ging', 'don-freecss', 'journey-new-world', 'expedition'],
    confidence: 'Don’s authorship and the two-edition structure are supplied chapter facts; Don still being alive and writing the West edition is Ging’s theory',
  }),
  timelineEvent({
    id: 'pre-voyage-344-don-longevity-theory',
    title: 'Ging links Don’s possible survival to Dark Continent resources',
    detail: 'Ging theorizes that Don could have continued his centuries-long journey by using Nitro Rice for longevity and the Herb for All-illnesses for disease prevention or treatment.',
    location: 'Lake Mobius · speculative Don Freecss route',
    tracks: ['ging', 'don-freecss', 'nitro-rice', 'herb-all-illnesses'],
    confidence: 'Ging’s proposed explanation, not a confirmed statement that Don consumed either resource',
  }),
]);

export const succession344FiveTripRecords = freeze([
  freeze({
    member: 'Begerossé Union',
    direction: 'Northeast shore of Lake Mobius',
    location: 'Steep mountain range',
    resource: 'Unmanned Rock',
    use: 'An ore that generates electricity when placed under water; one small bead can generate 20,000 kW a day',
    threat: 'Pap',
    returningSurvivors: 7,
    survivorNote: '7 out of 1000; 0.7% survival rate',
    visualSource: referenceImage,
  }),
  freeze({
    member: 'United States of Saherta',
    direction: 'North shore of Lake Mobius',
    location: 'Ruins of an ancient labyrinthine city that lies 400 km in a forest',
    resource: 'Herb for All-illnesses',
    use: 'Can cure all kinds of diseases',
    threat: 'Brion',
    returningSurvivors: 2,
    survivorNote: '2 returning survivors',
    visualSource: referenceImage,
  }),
  freeze({
    member: 'Federation of Ochima',
    direction: 'Far southeast shore of Lake Mobius',
    location: 'Swamps',
    resource: 'Nitro Rice',
    use: 'The ultimate secret of longevity',
    threat: 'Hellbell',
    returningSurvivors: 11,
    survivorNote: '11; the table states that 99% fell prey to Hellbell',
    visualSource: referenceImage,
  }),
  freeze({
    member: 'Mimbo Republic',
    direction: 'Southeast shore of Lake Mobius',
    location: null,
    resource: 'Trinity Elixir',
    use: 'The mother solution for all sorts of liquids',
    threat: 'Ai',
    returningSurvivors: 3,
    survivorNote: '3 returning survivors',
    visualSource: referenceImage,
  }),
  freeze({
    member: "Kukan'yu Kingdom",
    direction: 'South shore of Lake Mobius',
    location: null,
    resource: 'Metallion',
    use: 'An alchemy plant',
    threat: 'Zobae',
    returningSurvivors: 6,
    survivorNote: '6, including Beyond Netero and the Hunter afflicted by Zobae',
    visualSource: referenceImage,
  }),
]);

export const succession344ReferenceImages = freeze([
  freeze({
    src: referenceImage,
    alt: 'Summary of the Five Trips table showing five V6 expeditions, their Lake Mobius directions, resources, threats, and returning survivors',
    caption: 'User-supplied “Summary of the Five Trips” reference, preserved as an in-repo visual and transcribed into structured Chapter 344 data.',
    provenance: 'User-supplied reference image',
  }),
]);

export const succession344BodyStates = freeze([
  freeze({
    state: 'Nen access unavailable',
    examples: 'Gon Freecss',
    rule: 'Chapter 344 shows Gon attempting to activate aura and being unable to access Nen; the chapter does not settle the cause, permanence, or recovery conditions.',
    className: 'exceptional',
    source,
  }),
]);

export const succession344RelationshipRecords = freeze([
  freeze({
    from: 'Isaac Netero',
    to: 'Zigg Zoldyck & Linne Horsdoeuvre',
    type: 'Dark Continent expedition companions',
    note: 'The three secretly undertook an undocumented Dark Continent trip before the current expedition era.',
    phase: 'Historical expedition',
    chapters: '344',
    state: 'historical',
    source,
  }),
  freeze({
    from: 'Don Freecss',
    to: 'Journey to the New World',
    type: 'Author / explorer record',
    note: 'Don is identified as the author of the East and West edition project; only the East edition is known to have been found.',
    phase: 'Historical expedition record',
    chapters: '344',
    state: 'historical',
    source,
  }),
]);

export const succession344ObjectRecords = freeze([
  freeze({
    name: 'Journey to the New World',
    note: 'Don Freecss’s Dark Continent travel record. It has East and West editions; only the East edition has been found, while Ging theorizes that Don may still be writing the West edition.',
    source,
  }),
]);

const focus = 'Kurapika continues toward Tserriednich and the remaining Scarlet Eyes while Gon discovers he cannot access Nen; Ging buys an in-name-only No. 2 position inside Beyond’s team, lays out the Five Threats and the risk of a sixth calamity, reveals Netero’s undocumented trip with Zigg and Linne and Beyond’s Metallion/Zobae expedition, and identifies Don Freecss as the author of Journey to the New World while theorizing that he may still be writing the missing West edition.';

export const succession344ChapterResearch = freeze([
  freeze({
    number: 344,
    title: 'Author',
    japaneseTitle: null,
    romanizedTitle: 'Chosha',
    suppliedTitleMarker: '%',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Kurapika / Scarlet Eyes',
      'Gon / Nen state',
      'Ging & Pariston',
      'Beyond expedition team',
      'Five Threats',
      'Dark Continent expedition history',
      'Don Freecss / Journey to the New World',
    ]),
    focus,
    events: succession344TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika',
      'Leorio Paradinight',
      'Mizaistom Nana',
      'Tserriednich Hui Guo Rou',
      'Gon Freecss',
      'Ging Freecss',
      'Pariston Hill',
      'Beyond Netero',
      'Isaac Netero',
      'Zigg Zoldyck',
      'Linne Horsdoeuvre',
      'Don Freecss',
      'Curly',
      'Mascher',
      'Dark Continent Expedition Team',
    ]),
    locations: freeze([
      'Kurapika · pre-voyage travel context',
      'Hunter Association / Kurapika vehicle call',
      'Gon · post-recovery setting',
      'Beyond Netero expedition team · base',
      'Dark Continent · undocumented expedition history',
      'Dark Continent → known world · Beyond expedition history',
      'Lake Mobius',
    ]),
    threadLabels: freeze([
      'Kurapika & Scarlet Eyes',
      'Tserriednich',
      'Gon',
      'Nen development',
      'Ging & Pariston',
      'Five Threats',
      'Beyond Netero',
      'Isaac Netero legacy',
      'Don Freecss',
      'Journey to the New World',
    ]),
    fiveTrips: succession344FiveTripRecords,
    referenceImages: succession344ReferenceImages,
    relationships: succession344RelationshipRecords,
    bodyStates: succession344BodyStates,
    objects: succession344ObjectRecords,
    confidence: freeze([
      'All chapter prose details derive only from the user-supplied Hunterpedia Chapter 344 text',
      'The Five Trips matrix is transcribed from the user-supplied reference image and the image is preserved as a Chapter 344 visual',
      'The Five Trips image lists survivor counts of 7, 2, 11, 3, and 6, which sum to 29; Chapter 342’s supplied notes state 28 total returning survivors. Both source statements are preserved and the discrepancy is not silently corrected',
      'Gon’s inability to access Nen is confirmed at this point; the cause, permanence, and recovery conditions remain unresolved here',
      'Ging’s suggestion that the Guide returned the Five Threats as a lesson is a theory',
      'The possibility of a sixth threat is a risk tied to Beyond taking an unexplored route, not a confirmed sixth calamity',
      'Don Freecss being the author and the existence of East and West editions are supplied chapter facts; Don still being alive and writing the West edition is Ging’s theory',
      'The supplied title text gives the romanization Chosha but the Japanese title characters are not recoverable from the supplied marker %, so japaneseTitle is intentionally left unset',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, Nen state change, Five Trips visual and structured matrix, expedition-history records, relationships, objects, mysteries, and source confidence linked',
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
      nen: true,
      source: true,
    }),
    lastReviewed: 'August 7, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession344SourcePolicy.soleTextSource, succession344SourcePolicy.userMedia]),
  }),
]);

export const succession344ChapterFocus = freeze({ 344: focus });

export const succession344Mysteries = freeze([
  freeze({
    question: 'Can Gon regain access to Nen, and what exactly changed after his recovery?',
    evidence: 'Chapter 344 shows Gon attempting to activate aura and discovering that he cannot access Nen, but does not settle whether the condition is permanent or what mechanism caused it.',
    status: 'open',
    lastChapter: '344',
    source,
  }),
  freeze({
    question: 'Is Don Freecss still alive and writing the West edition of Journey to the New World?',
    evidence: 'Only the East edition has been found. Ging proposes that Don may still be exploring the Lake Mobius shoreline and writing the West edition centuries after beginning the journey.',
    status: 'open',
    lastChapter: '344',
    source,
  }),
  freeze({
    question: 'What unknown calamity could Beyond’s unexplored route bring back?',
    evidence: 'Ging warns that leaving established routes creates the possibility of returning with a sixth threat, but no sixth calamity is identified in Chapter 344.',
    status: 'open',
    lastChapter: '344',
    source,
  }),
]);
