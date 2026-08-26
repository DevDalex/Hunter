const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_340';

export const succession340SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 340',
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
  time: 'Pre-voyage · before the Dark Continent expedition',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 340,
  confidence,
  source,
});

export const succession340TimelineEvents = freeze([
  timelineEvent({
    id: 'pre-voyage-340-zodiac-emergency',
    title: 'Beans interrupts the Zodiac conference with an emergency',
    detail: 'As Cheadle prepares an announcement, Beans rushes into the Zodiacs’ conference room with news of a major emergency and plays Kakin’s public announcement.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['expedition', 'zodiacs', 'kakin'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-nasubi-announcement',
    title: 'Nasubi announces Kakin’s Dark Continent expedition',
    detail: 'King Nasubi Hui Guo Rou publicly declares that Kakin will launch a voyage to the Dark Continent and frames the expedition as carrying humanity’s dreams toward a new world.',
    location: 'Kakin Empire · public broadcast',
    tracks: ['expedition', 'kakin', 'ritual'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-v5-treaty-context',
    title: 'The Zodiacs explain the V5 Dark Continent prohibition',
    detail: 'Gel and Mizaistom explain that the Dark Continent lies outside the known world map and that previous human expeditions brought disasters. The five leading nations formed the V5 and signed a treaty roughly two centuries earlier prohibiting further expeditions.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['expedition', 'zodiacs', 'v5'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-kakin-treaty-status',
    title: 'Kakin’s political transition creates a treaty-status question',
    detail: 'Cheadle notes that Kakin underwent a major political transition about thirty years earlier and technically became a new nation. The Zodiacs consider the possibility that Kakin did not renew the old Dark Continent treaty obligations after that transition. The V5 formally asks Nasubi to withdraw the expedition announcement and sign the treaty.',
    location: 'Hunter Association · Zodiac conference room / Kakin diplomatic frame',
    tracks: ['expedition', 'kakin', 'v5'],
    confidence: 'The political transition and V5 request are confirmed in the supplied text; the idea that Kakin failed to renew the treaty is presented as a possibility rather than a settled fact',
  }),
  timelineEvent({
    id: 'pre-voyage-340-beyond-debut',
    title: 'Beyond Netero is introduced as expedition leader',
    detail: 'Nasubi introduces Beyond Netero as Isaac Netero’s son and announces that Kakin has hired him to lead the Dark Continent expedition. The Zodiacs are shocked that the former chairman had a son, while several immediately recognize Beyond’s resemblance to Netero.',
    location: 'Kakin Empire · public broadcast / Hunter Association',
    tracks: ['beyond', 'expedition', 'kakin', 'zodiacs'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-netero-second-dvd',
    title: 'Isaac Netero’s second DVD is revealed',
    detail: 'Beans explains that Netero left two DVDs and instructed him to show the second one to all Zodiacs if anyone ever appeared claiming to be his child. Ging and Pariston are absent when the condition is triggered.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['netero', 'zodiacs', 'beyond'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-beyond-recruitment',
    title: 'Beyond calls the world to join his expedition',
    detail: 'Beyond rejects the V5’s restrictions, declares that he wants to explore untouched parts of the Dark Continent without supervision, and publicly invites people around the world to come to Kakin for the voyage. He appears with ten important followers, including Pariston Hill.',
    location: 'Kakin Empire · Beyond expedition rally',
    tracks: ['beyond', 'expedition', 'pariston', 'kakin'],
  }),
  timelineEvent({
    id: 'pre-voyage-340-zodiac-special-mission',
    title: 'The V5 assigns the Zodiacs to hunt Beyond',
    detail: 'Cheadle reveals that Ging Freecss and Pariston Hill have resigned from the Zodiacs, that Pariston is now part of Beyond’s expedition team, and that the V5 has given the remaining Zodiacs a special mission to hunt Beyond Netero.',
    location: 'Hunter Association · Zodiac conference room',
    tracks: ['zodiacs', 'v5', 'beyond', 'ging', 'pariston'],
  }),
]);

const focus = 'Nasubi launches Kakin’s Dark Continent expedition, Beyond Netero debuts as its leader and openly challenges the V5 prohibition, Netero’s contingency DVD is triggered, Ging and Pariston are revealed to have left the Zodiacs, Pariston joins Beyond’s team, and the V5 orders the Zodiacs to hunt Beyond.';

export const succession340ChapterResearch = freeze([
  freeze({
    number: 340,
    title: 'Special Mission',
    japaneseTitle: '特命',
    phase: 'Expedition setup',
    voyageDay: 'Pre-voyage',
    lanes: freeze([
      'Expedition politics',
      'Zodiacs',
      'Beyond Netero',
      'Kakin Empire',
      'V5',
    ]),
    focus,
    events: succession340TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Beans',
      'Cheadle Yorkshire',
      'Kanzai',
      'Gel',
      'Mizaistom Nana',
      'Nasubi Hui Guo Rou',
      'Isaac Netero',
      'Beyond Netero',
      'Ging Freecss',
      'Pariston Hill',
      'Zodiacs',
      'Beyond Netero’s expedition followers',
    ]),
    locations: freeze([
      'Hunter Association · Zodiac conference room',
      'Kakin Empire · public broadcast',
      'Kakin Empire · Beyond expedition rally',
      'Dark Continent',
    ]),
    threadLabels: freeze([
      'Beyond & expedition',
      'Kakin Empire',
      'Zodiacs',
      'V5',
      'Ging & Pariston',
      'Isaac Netero legacy',
    ]),
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 340 text',
      'Kakin’s political transition about thirty years earlier and the V5 treaty history are treated as confirmed chapter exposition',
      'The claim that Kakin may not have renewed the Dark Continent treaty is preserved as an in-story possibility rather than a confirmed legal conclusion',
      'Beyond is publicly introduced as Isaac Netero’s son; the chapter shows recognition of resemblance while also mentioning verification as a possibility',
    ]),
    status: 'Maintained chapter summary, scene chronology, appearances, locations, political relationships, expedition assignments, and source confidence linked',
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
    crossChecks: freeze([succession340SourcePolicy.soleSource]),
  }),
]);

export const succession340ChapterFocus = freeze({ 340: focus });
export const succession340Mysteries = freeze([]);
