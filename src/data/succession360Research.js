const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_360';

export const succession360SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 360 synopsis and chapter-note text',
  titleMetadata: 'English title Parasite retained from the repository chapterTitles dataset, itself transcribed from Hunterpedia; Japanese and romanized title text were not supplied in the current message and are left unset.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1 · Room 1014', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 360,
  confidence,
  source,
});

export const succession360TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-360-kurapika-reveals-contest',
    title: 'Kurapika reveals the succession battle to everyone remaining in Room 1014',
    detail: 'Kurapika continues the armed Dowsing Chain interrogation and openly explains that the voyage conceals a royal succession battle among Kakin’s princes. The interrogation establishes that only the royal guards had known of the contest beforehand.',
    tracks: ['kurapika', 'dowsing-chain', 'succession-contest', 'room-1014'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-two-guards-admit-spy-role',
    title: 'Two surviving royal guards admit they were not solely loyal to Woble',
    detail: 'Two guards acknowledge that they knew about the succession contest and were serving interests beyond Woble’s household. Oito initially orders Kurapika to shoot them, but he refuses to act before hearing their explanation.',
    tracks: ['oito', 'woble', 'royal-guards', 'kurapika', 'counterintelligence'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-higher-queen-spy-system',
    title: 'The higher-queen surveillance system inside Oito’s guard detail is exposed',
    detail: 'The guards explain that the seven higher-ranked queens each placed one royal guard in Oito’s household as an informant. Because Oito is the lowest-ranked queen, the guards were assigned to monitor her while still protecting Woble so long as that protection did not endanger the queen and prince they truly served.',
    tracks: ['queens', 'oito', 'woble', 'royal-guards', 'spy-network'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-lawful-assassination-boundary',
    title: 'The informant guards deny having direct assassination orders against Woble',
    detail: 'When Kurapika asks whether they were ordered to kill Woble, the guards say no and emphasize that even during the succession contest they still operate under the rule of law. Their reaction to Woody’s death and the revelation of Nen convinces them that the princes themselves are participating through mechanisms they had not understood.',
    tracks: ['woble', 'royal-guards', 'law', 'succession-contest'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-seed-urn-as-nen-mechanism',
    title: 'The Seed Urn Ceremony is identified as the likely mechanism behind the princes’ Nen phenomena',
    detail: 'The guards ask whether Woble participated in the Seed Urn Ceremony and suggest that the ritual may have bestowed Nen-related powers. Oito says Woble completed the ceremony a little over a month earlier.',
    tracks: ['seed-urn', 'woble', 'guardian-spirit-beast', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-kurapika-woble-defense-hypothesis',
    title: 'Kurapika considers but does not confirm that Woble may have attacked defensively',
    detail: 'Kurapika tells Oito that Woble senses her fear as danger and wonders whether an unseen defensive phenomenon could have reacted to the informant guards. He also considers the alternative that another prince targeted Woble and her inner circle because she is the youngest and weakest.',
    tracks: ['kurapika', 'woble', 'oito', 'murder-mystery', 'guardian-spirit-beast'],
    confidence: 'This is Kurapika’s hypothesis. Chapter 360 does not identify Woble, Woble’s beast, or another prince as the killer of the five earlier guards.',
  }),
  timelineEvent({
    id: 'voyage-day1-360-guardian-beasts-appear',
    title: 'Multiple Guardian Spirit Beasts manifest inside Room 1014',
    detail: 'Small unseen creatures crawl over the restrained guards before multiple Guardian Spirit Beasts pass through the walls and ceiling into Room 1014. Kurapika recognizes them as the phenomena produced by the Seed Urn succession ritual and notes that they do not appear to be consciously controlled.',
    tracks: ['guardian-spirit-beast', 'room-1014', 'seed-urn', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-emergency-all-channels-call',
    title: 'Kurapika broadcasts an emergency Nen-beast warning across all channels',
    detail: 'Kurapika identifies himself and uses the emergency communications system to ask other Hunters whether they are seeing Nen beasts. Melody reports no sighting in her area, while Biscuit confirms beasts had appeared around Marayam’s section and that the area is now clear.',
    tracks: ['kurapika', 'melody', 'biscuit', 'marayam', 'communications', 'guardian-spirit-beast'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-princes-cannot-see-beasts',
    title: 'The princes are confirmed to be unaware of their Guardian Spirit Beasts',
    detail: 'Biscuit confirms that Marayam, his servants, and ordinary guards cannot see the beasts. Kurapika realizes that the princes can be hosts to the succession ritual’s Nen creatures without understanding or consciously controlling them.',
    tracks: ['princes', 'marayam', 'guardian-spirit-beast', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-parasitic-nen-rules',
    title: 'Bill explains the parasitic Nen model behind the Guardian Spirit Beasts',
    detail: 'Bill describes parasitic Nen as curse-like: the parasite consumes aura from its host while the host remains unaware and unable to control it. Continued aura drain can leave the host fatigued.',
    tracks: ['bill', 'guardian-spirit-beast', 'parasitic-nen', 'aura'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-bill-stays',
    title: 'Bill refuses Kurapika’s offer to withdraw and reaffirms protection of Oito and Woble',
    detail: 'Kurapika gives Bill a chance to leave after the danger escalates. Bill refuses, states that protecting Oito and Woble remains his current responsibility, and says he and Kurapika must keep exchanging information to improve their chances.',
    tracks: ['bill', 'kurapika', 'oito', 'woble', 'protection'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-bill-beyond-mission',
    title: 'Bill reveals his group’s underlying mission is to reach the Dark Continent with Beyond',
    detail: 'Bill explains that his group’s original mission is to reach the Dark Continent with Beyond Netero. He nevertheless insists that this does not cancel the immediate obligation to protect Oito and Woble.',
    tracks: ['bill', 'beyond', 'dark-continent', 'pariston-route', 'woble'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-three-escape-ways',
    title: 'Bill says Oito and Woble currently have three possible escape routes',
    detail: 'After Kurapika argues that genuine protection means finding a way out of the succession battle entirely, Bill tells Oito that they currently have three possible ways to escape the danger. Chapter 360 does not enumerate all three methods in the supplied text.',
    tracks: ['bill', 'kurapika', 'oito', 'woble', 'escape-plan'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-sayird-beast-attaches',
    title: 'One Guardian Spirit Beast remains attached to Sayird after the others leave',
    detail: 'As the other beasts depart Room 1014, one remains with Sayird and addresses him, asking to be told when he is free. Sayird is frightened and confused by the contact.',
    tracks: ['sayird', 'guardian-spirit-beast', 'manipulation', 'room-1014'],
  }),
  timelineEvent({
    id: 'voyage-day1-360-sayird-kills-three',
    title: 'Sayird is influenced to kill Kurton and the two restrained royal guards',
    detail: 'A servant screams and the group finds Sayird holding a bloody knife after stabbing Kurton and both restrained informant guards. Sayird says that because he was “free,” the creature told him to do it. Kurapika decides to capture Sayird alive while Bill protects Oito and Woble.',
    tracks: ['sayird', 'kurton', 'royal-guards', 'guardian-spirit-beast', 'murder', 'kurapika'],
  }),
]);

export const succession360ParasiticNenRecord = freeze({
  subject: 'Guardian Spirit Beasts / parasitic Nen',
  chapter: 360,
  classification: 'Parasitic-type Nen',
  establishedMechanics: freeze([
    'The host may remain unaware of the parasite and unable to control it',
    'The parasite feeds on the host’s aura',
    'Aura drain may cause fatigue in the host',
    'The princes themselves can be unable to see the Guardian Spirit Beasts generated through the succession ritual',
    'Guardian Spirit Beasts can pass through physical walls and ceilings in the observed Room 1014 manifestation',
  ]),
  unknowns: freeze([
    'Complete targeting rules',
    'Complete visibility rules for every Nen user and host',
    'Whether every Guardian Spirit Beast follows identical parasitic constraints',
    'The identity and full mechanics of the beast that manipulates Sayird',
  ]),
  source,
});

export const succession360QueenSpyNetwork = freeze([
  freeze({ sponsor: 'Higher Queen 1', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 2', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 3', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 4', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 5', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 6', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
  freeze({ sponsor: 'Higher Queen 7', placement: 'One royal guard assigned into Oito/Woble household', purpose: 'Monitor Oito while protecting Woble unless that conflicts with sponsor household safety', identity: 'Not named in supplied Chapter 360 text', source }),
]);

export const succession360BodyStates = freeze([
  freeze({ subject: 'Kurton', state: 'deceased', chapter: 360, detail: 'Stabbed by Sayird while Sayird is under the influence of a Guardian Spirit Beast.', source }),
  freeze({ subject: 'Two unnamed surviving royal guards in Oito’s detail', state: 'deceased', chapter: 360, detail: 'The two restrained informant guards are stabbed and killed by Sayird. Together with the five deaths in Chapter 359, all seven higher-queen royal-guard placements in Oito’s household are now dead.', source }),
  freeze({ subject: 'Sayird', state: 'alive / manipulated', chapter: 360, detail: 'Remains alive but is being influenced by an unidentified Guardian Spirit Beast to attack people with a knife; Kurapika intends to restrain him without killing him.', source }),
]);

export const succession360RelationshipRecords = freeze([
  freeze({
    from: 'Seven higher-ranked queens',
    to: 'Oito / Woble household',
    type: 'Embedded surveillance network',
    note: 'Each higher queen placed one royal guard in Oito’s household to monitor the lowest-ranked queen while preserving conditional protection of Woble.',
    phase: 'Active contest and voyage',
    chapters: '359–360',
    state: 'exposed / embedded guards deceased by end of Chapter 360',
    source,
  }),
  freeze({
    from: 'Bill',
    to: 'Beyond Netero expedition',
    type: 'Underlying expedition affiliation',
    note: 'Bill states that his group’s original mission is to reach the Dark Continent with Beyond, while his immediate obligation remains protecting Oito and Woble.',
    phase: 'Active contest and voyage / expedition layer',
    chapters: '360–current',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Bill',
    to: 'Oito & Woble',
    type: 'Protection commitment',
    note: 'Bill refuses an opportunity to withdraw despite the Nen-beast danger and explicitly reaffirms that he will continue protecting Oito and Woble.',
    phase: 'Active contest and voyage',
    chapters: '360–current',
    state: 'active',
    source,
  }),
  freeze({
    from: 'Unidentified Guardian Spirit Beast',
    to: 'Sayird',
    type: 'Behavioral manipulation / coercion',
    note: 'A beast remains attached to Sayird, speaks to him, and influences him to stab Kurton and two royal guards. Chapter 360 does not identify which prince hosts the beast or define the full control mechanism.',
    phase: 'Active contest and voyage',
    chapters: '360–current',
    state: 'active / unresolved source',
    source,
  }),
]);

export const succession360Mysteries = freeze([
  freeze({
    question: 'Which Guardian Spirit Beast is manipulating Sayird, and who is its host?',
    evidence: 'One beast remains attached to Sayird after the others leave, speaks to him, and influences him to kill three people. Chapter 360 does not identify the beast’s royal host or full ability conditions.',
    status: 'open',
    lastChapter: '360',
    source,
  }),
  freeze({
    question: 'What are the three escape routes Bill says are available to Oito and Woble?',
    evidence: 'Bill states that they currently have three ways to escape the threats of the succession battle, but the supplied Chapter 360 text does not enumerate all three.',
    status: 'open',
    lastChapter: '360',
    source,
  }),
  freeze({
    question: 'Did Woble or Woble’s Guardian Spirit Beast kill the five guards found in Chapter 359?',
    evidence: 'Kurapika considers a defensive reaction by Woble as one possibility but also considers an attack by another prince. The appearance of multiple parasitic Guardian Spirit Beasts in Chapter 360 does not resolve the earlier blood-draining murders.',
    status: 'open / hypothesis only',
    lastChapter: '360',
    source,
  }),
]);

const focus = 'Kurapika exposes the higher-queen spy network embedded in Woble’s guard detail, multiple Guardian Spirit Beasts manifest in Room 1014, Bill confirms the parasitic Nen model in which hosts can neither see nor control the beasts as they feed on aura, Bill reveals his underlying Beyond-expedition mission while remaining committed to Oito and Woble, and an unidentified beast manipulates Sayird into killing Kurton and the two remaining royal guards before Kurapika moves to capture him alive.';

export const succession360ChapterResearch = freeze([
  freeze({
    number: 360,
    title: 'Parasite',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Kurapika / Woble',
      'Guardian Spirit Beasts',
      'Parasitic Nen',
      'Queen spy network',
      'Sayird manipulation',
      'Beyond expedition link',
      'Escape planning',
    ]),
    focus,
    events: succession360TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Queen Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Bill', 'Sayird', 'Kurton',
      'Two unnamed surviving royal guards', 'Seven higher-ranked queens', 'Biscuit Krueger', 'Melody',
      'Marayam Hui Guo Rou', 'Beyond Netero',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Marayam household section',
      'Black Whale · emergency communications network',
    ]),
    threadLabels: freeze([
      'Guardian Spirit Beasts', 'Parasitic Nen', 'Room 1014', 'Oito / Woble', 'Sayird',
      'Queen surveillance network', 'Beyond expedition', 'Escape routes',
    ]),
    parasiticNen: succession360ParasiticNenRecord,
    queenSpyNetwork: succession360QueenSpyNetwork,
    relationships: succession360RelationshipRecords,
    bodyStates: succession360BodyStates,
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 360 text',
      'The seven higher-queen guard placements are confirmed as a surveillance system, but the supplied text does not map each unnamed guard to a specific named queen',
      'Kurapika’s theory that Woble may have attacked defensively is preserved as a hypothesis and does not resolve the Chapter 359 blood-draining murders',
      'Parasitic Nen mechanics are limited to the supplied Chapter 360 explanation: host unawareness/lack of control, aura consumption, and fatigue',
      'The beast manipulating Sayird is not assigned to a prince because the supplied text does not identify its host',
      'Bill’s statement that there are three escape methods is preserved without inventing the methods not listed in the supplied text',
    ]),
    status: 'Maintained chapter summary, chronology, Guardian Spirit Beast manifestation, parasitic Nen mechanics, queen spy network, body states, Bill/Beyond affiliation, Sayird manipulation, escape planning, relationships, mysteries, and source confidence linked',
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
    titleStatus: 'verified-from-maintained-hunterpedia-title-dataset',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession360ChapterFocus = freeze({ 360: focus });
