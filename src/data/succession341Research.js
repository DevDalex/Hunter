const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_341';

export const succession341SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 341',
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
  chapter: 341,
  confidence,
  source,
});

export const succession341TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-341-ipa-briefing',
    title: 'The IPA briefs Steiner on the Dark Continent crisis',
    detail: 'The International Permit Agency Director escorts newly assigned Deputy Secretary Steiner through a heavily secured facility and explains the agency’s role in the coming Dark Continent negotiations. Kakin has bypassed normal voyage-agency screening because it has not signed the treaty and classifies its trip as business colonization rather than sightseeing.',
    location: 'International Permit Agency · secured complex',
    tracks: ['expedition', 'v5', 'ipa', 'kakin'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-gatekeeper-warning',
    title: 'The Director warns about the Gatekeeper of the New World',
    detail: 'The Director tells Steiner that the Gatekeeper of the New World dislikes ill-mannered visitors and warns that failed negotiations with Kakin could open a metaphorical Pandora’s Box.',
    location: 'International Permit Agency · secured elevator route',
    tracks: ['expedition', 'ipa', 'dark-continent'],
    confidence: 'The Gatekeeper warning is confirmed chapter dialogue; its nature, rules, and exact role remain unexplained here',
  }),
  timelineEvent({
    id: 'pre-voyage-341-basement-victims',
    title: 'Steiner sees the human aftermath of prior Dark Continent contact',
    detail: 'The IPA Director opens a basement containing human corpses and other horrific remains connected to prior Dark Continent expeditions. The wrung-out victims were discovered in the known world despite never having traveled to the Dark Continent themselves, demonstrating that returned calamities can spread beyond expedition members.',
    location: 'International Permit Agency · basement containment facility',
    tracks: ['expedition', 'ipa', 'calamities'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-journey-book',
    title: 'Steiner receives Journey to the New World',
    detail: 'The Director gives Steiner Journey to the New World, a centuries-old travel record once dismissed as fiction and now regarded as a legendary text. Steiner is ordered to memorize it and identify the risks associated with travel to the New World.',
    location: 'International Permit Agency · basement containment facility',
    tracks: ['expedition', 'ipa', 'dark-continent'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-zobae-survivor',
    title: 'The IPA reveals a surviving victim of Zobae Disease',
    detail: 'A former Hunter held in the IPA basement is identified as the lone surviving human subject in the facility. After infection by Zobae Disease, the victim no longer requires ordinary sustenance, has remained alive for nearly fifty years, cannot die, and is described as no longer human. Beyond Netero’s report contains further information on the case.',
    location: 'International Permit Agency · basement containment facility',
    tracks: ['expedition', 'ipa', 'calamities', 'beyond'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-returned-calamities',
    title: 'Every recorded V5 expedition returned with a new calamity',
    detail: 'The Director explains that each time humanity reached the Dark Continent and fled back to the known world, the returning expedition brought an extinction-level threat with it. This pattern establishes the Five Threats as consequences of human exploration rather than dangers confined to the distant continent.',
    location: 'International Permit Agency · basement containment facility',
    tracks: ['expedition', 'v5', 'calamities'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-netero-second-dvd',
    title: 'Netero’s second DVD explains his Dark Continent directive',
    detail: 'The Zodiacs watch Isaac Netero’s second DVD. Netero reveals that he traveled to the Dark Continent twice, that Beyond once ignored his warning and took an unexplored route that caused many casualties and returned with new threats, and that he barred Beyond and the Hunter Association from further travel until his death. Netero asks, rather than orders, the Zodiacs to reach and explore the Dark Continent before Beyond.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['netero', 'zodiacs', 'beyond', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-zodiac-mission-debate',
    title: 'Cheadle accepts Netero’s request as the Zodiacs debate the race',
    detail: 'Cheadle accepts Netero’s request and initially insists that only the Zodiacs participate. Saiyu and Kanzai object that hunting Beyond makes the race unfair, while Gel notes that Ging is the only known Hunter with comparable ambition and that Kakin will otherwise retain a major head start.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['zodiacs', 'ging', 'beyond', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-beyond-self-capture',
    title: 'Beyond presents himself to the Zodiacs as captured',
    detail: 'Beyond contacts Beans, appears before the Zodiacs, and tells them to inform the V5 that they have captured Beyond Netero, voluntarily placing himself in their custody as part of his larger expedition strategy.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['beyond', 'zodiacs', 'v5', 'expedition'],
  }),
  timelineEvent({
    id: 'pre-voyage-341-five-threats',
    title: 'Steiner identifies the Five Threats',
    detail: 'While studying Journey to the New World and the expedition record, Steiner learns of the five extinction-level calamities brought back by humanity: Brion, Ai, Hellbell, Pap, and Zobae. Their descriptions frame the Dark Continent as a source of hazards that can transform, control, exploit, or perpetually sustain human life in catastrophic ways.',
    location: 'Steiner residence · research setting',
    tracks: ['expedition', 'calamities', 'ipa'],
  }),
]);

export const succession341ThreatRecords = freeze([
  freeze({
    name: 'Brion',
    classification: 'Botanical weapon',
    description: 'A sphere associated with protecting mysterious ancient ruins.',
    thematicDescription: null,
    chapter: 341,
    source,
  }),
  freeze({
    name: 'Ai',
    classification: 'Gaseous life-form',
    description: 'A gaseous life-form brought back from the Dark Continent.',
    thematicDescription: 'Co-dependence of desire',
    chapter: 341,
    source,
  }),
  freeze({
    name: 'Hellbell',
    classification: 'Twin snake',
    description: 'A monster that infects its prey with homicidal desire.',
    thematicDescription: null,
    chapter: 341,
    source,
  }),
  freeze({
    name: 'Pap',
    classification: 'Beast',
    description: 'A beast that keeps human beings as pets.',
    thematicDescription: 'Trade-off between life and pleasure',
    chapter: 341,
    source,
  }),
  freeze({
    name: 'Zobae',
    classification: 'Immortality disease',
    description: 'A disease capable of leaving an infected human self-sustaining and unable to die.',
    thematicDescription: 'Endless despair disguised as hope',
    chapter: 341,
    source,
  }),
]);

const focus = 'The International Permit Agency exposes Steiner to the human cost of prior Dark Continent contact, Journey to the New World and the Five Threats establish the expedition’s extinction-level risk, Netero’s second DVD reveals his own journeys and Beyond’s disastrous earlier expedition, Cheadle accepts Netero’s request to reach the continent first, and Beyond voluntarily presents himself to the Zodiacs as captured.';

export const succession341ChapterResearch = freeze([
  freeze({
    number: 341,
    title: 'Threats',
    japaneseTitle: '厄災',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Expedition politics',
      'International Permit Agency',
      'Dark Continent calamities',
      'Zodiacs',
      'Beyond Netero',
      'V5',
    ]),
    focus,
    events: succession341TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'IPA Director',
      'Steiner',
      'Isaac Netero',
      'Beyond Netero',
      'Cheadle Yorkshire',
      'Saiyu',
      'Kanzai',
      'Gel',
      'Beans',
      'Ging Freecss',
      'Zodiacs',
      'Zobae-infected former Hunter',
    ]),
    locations: freeze([
      'International Permit Agency · secured complex',
      'International Permit Agency · basement containment facility',
      'Hunter Association · Zodiac conference room',
      'Steiner residence · research setting',
      'Dark Continent',
    ]),
    threadLabels: freeze([
      'Dark Continent expedition',
      'Five Threats',
      'International Permit Agency',
      'Beyond Netero',
      'Isaac Netero legacy',
      'Zodiacs',
      'V5',
      'Kakin Empire',
    ]),
    threats: succession341ThreatRecords,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 341 text',
      'Kakin’s lack of treaty signature and colonization classification are preserved as chapter-note claims',
      'The chapter establishes a recurring pattern in which human expeditions return with calamities that can affect the known world',
      'The Zobae victim’s nearly fifty-year survival and inability to die are preserved as the supplied chapter’s description',
      'Netero’s request that the Hunter Association reach the Dark Continent before Beyond is a request rather than a binding order',
      'The nature and operating rules of the Gatekeeper of the New World remain unresolved in this chapter',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, expedition history, Five Threat records, assignment changes, and source confidence linked',
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
    crossChecks: freeze([succession341SourcePolicy.soleSource]),
  }),
]);

export const succession341ChapterFocus = freeze({ 341: focus });

export const succession341Mysteries = freeze([
  freeze({
    question: 'What is the Gatekeeper of the New World and what rules govern passage?',
    evidence: 'The IPA Director warns that the Gatekeeper dislikes ill-mannered visitors, but Chapter 341 does not explain its nature, authority, or exact conditions for permitting travel.',
    status: 'open',
    lastChapter: '341',
    source,
  }),
]);
