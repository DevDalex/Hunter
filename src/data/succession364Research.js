const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_364';

export const succession364SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 364 synopsis and chapter-note text',
  titleMetadata: 'English title Speculation retained from the repository Hunterpedia-transcribed chapter-title dataset; Japanese and romanized title text were not supplied in the current message and are left unset.',
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
  chapter: 364,
  confidence,
  source,
});

export const succession364TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-364-kurapika-avoids-open-fight',
    title: 'Kurapika avoids an open fight with Vincent because of the legal consequences',
    detail: 'Despite recognizing Vincent as an assassin, Kurapika does not immediately attack him. He remains defensive because a direct confrontation with an officially assigned Royal Guard could create legal and political consequences for Woble’s camp.',
    tracks: ['kurapika', 'vincent', 'room-1014', 'legal-risk', 'benjamin'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-little-eye-transferred-to-oito',
    title: 'Kurapika transfers Little Eye to Oito',
    detail: 'Kurapika transfers the right to use Sayird’s stolen Little Eye ability to Queen Oito. Stealth Dolphin becomes mentally connected to both Kurapika and Oito and remains linked while Oito retains the borrowed ability.',
    tracks: ['kurapika', 'oito', 'little-eye', 'stealth-dolphin', 'steal-chain', 'emperor-time'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-bill-closes-on-vincent',
    title: 'The Little Eye transfer distracts Vincent long enough for Bill to close distance',
    detail: 'Vincent misreads Kurapika’s transfer procedure as an attack on Oito. The distraction gives Bill an opening to approach Vincent while Kurapika maintains control of the encounter.',
    tracks: ['vincent', 'bill', 'kurapika', 'oito', 'tactical-synergy'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-vincent-restrained',
    title: 'Kurapika drains Vincent’s aura and Bill helps restrain him',
    detail: 'When Vincent tries to fend off Bill, Kurapika uses Steal Chain to drain Vincent’s aura and steal his Nen ability. Vincent is then restrained. The supplied Chapter 364 text does not name or describe the stolen ability itself.',
    tracks: ['kurapika', 'bill', 'vincent', 'steal-chain', 'nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-vincent-suicide',
    title: 'Vincent commits suicide rather than risk being forced to confess',
    detail: 'After hearing Kurapika claim that he can force a confession, Vincent swallows poison hidden behind his back teeth and dies. The chapter notes identify this as suicide intended to avoid being compelled to confess to the assassination attempt.',
    tracks: ['vincent', 'kurapika', 'suicide', 'assassination', 'poison'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-kurapika-delays-report',
    title: 'Kurapika chooses not to report Vincent immediately',
    detail: 'Kurapika judges that immediately reporting Vincent’s death would be ineffective and potentially dangerous under the current political and surveillance conditions, so Room 1014 delays formal disclosure.',
    tracks: ['kurapika', 'vincent', 'room-1014', 'counterintelligence', 'legal-risk'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-benjamin-balsamilco-analyze-audio',
    title: 'Benjamin and Balsamilco struggle to reconstruct the Room 1014 encounter remotely',
    detail: 'Listening from Benjamin’s side, Balsamilco and Benjamin cannot determine exactly how Vincent was neutralized. Balsamilco theorizes that the Room 1014 guards may have deliberately lied aloud to confuse eavesdroppers and misrepresent their Nen mechanics.',
    location: 'Black Whale · Tier 1 · Benjamin command area',
    tracks: ['benjamin', 'balsamilco', 'vincent', 'kurapika', 'counterintelligence'],
    confidence: 'Their lack of clarity is confirmed; Balsamilco’s theory that the guards verbally lied to deceive listeners is his speculation',
  }),
  timelineEvent({
    id: 'voyage-day1-364-benjamin-orders-immediate-nen-use',
    title: 'Benjamin tells his deployed guards to use Nen immediately after asserting self-defense rights',
    detail: 'Benjamin adapts the distributed Royal Guard operation by ordering his personnel to activate Nen immediately after announcing their right to self-defense, tightening the military posture of his embedded observers.',
    location: 'Black Whale · Tier 1 · Benjamin command area',
    tracks: ['benjamin', 'royal-guards', 'nen', 'self-defense', 'surveillance'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-babimyna-succeeds-vincent',
    title: 'Babimyna is sent to Room 1014 as Vincent’s successor',
    detail: 'Benjamin replaces Vincent in Woble’s assigned Royal Guard slot with Babimyna, preserving Benjamin’s surveillance presence against Room 1014 despite Vincent’s death.',
    location: 'Black Whale · Tier 1 · Benjamin command area / Room 1014 entrance',
    tracks: ['babimyna', 'benjamin', 'vincent', 'woble', 'room-1014'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-marayam-hamster-plan',
    title: 'Kurapika identifies Marayam’s pet hamster as the preferred future Little Eye target',
    detail: 'Kurapika judges that Marayam’s pet hamster would be an effective reconnaissance target at the next banquet because Little Eye can control small living creatures and the animal could provide access to a prince household without directly exposing Oito.',
    tracks: ['kurapika', 'oito', 'little-eye', 'marayam', 'reconnaissance'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-fly-immediate-target',
    title: 'Time pressure forces Kurapika to choose an insignificant insect first',
    detail: 'Because the borrowed ability cannot remain pending indefinitely without keeping Emperor Time active, Kurapika tells Oito to use Little Eye on an inconspicuous insect such as a fly rather than wait for the ideal hamster target.',
    tracks: ['kurapika', 'oito', 'little-eye', 'emperor-time', 'time-pressure'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-stealth-dolphin-shared-link',
    title: 'Stealth Dolphin links Kurapika and Oito while Little Eye is loaned out',
    detail: 'The chapter notes state that Stealth Dolphin is connected to both Kurapika’s and Oito’s minds while Oito holds Little Eye. The link remains until Oito deactivates the borrowed ability.',
    tracks: ['stealth-dolphin', 'kurapika', 'oito', 'little-eye'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-emperor-time-lifespan-cost',
    title: 'The exact lifespan cost of Emperor Time is revealed',
    detail: 'Kurapika reveals that every one second spent in Emperor Time shortens his lifespan by one hour. Because loading Vincent’s newly stolen ability into Stealth Dolphin would prolong Emperor Time further, he refuses to do so while Little Eye remains unresolved.',
    tracks: ['kurapika', 'emperor-time', 'stealth-dolphin', 'vincent', 'lifespan-cost'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-three-prince-calls',
    title: 'Benjamin, Zhang Lei, and Tubeppa each contact Woble’s quarters',
    detail: 'Room 1014 receives calls from the camps of Benjamin, Zhang Lei, and Tubeppa. The simultaneous interest follows Kurapika’s public Nen-beast intervention and makes Room 1014 a diplomatic information target for multiple princes.',
    tracks: ['benjamin', 'zhang-lei', 'tubeppa', 'kurapika', 'woble', 'diplomacy'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-call-order-alliance-signal',
    title: 'Even choosing which prince to answer first becomes a political signal',
    detail: 'Kurapika recognizes that prioritizing one prince’s call over the others could be interpreted as favoring or aligning with that prince, turning ordinary communication order into a succession-diplomacy problem.',
    tracks: ['kurapika', 'benjamin', 'zhang-lei', 'tubeppa', 'alliance-signaling'],
  }),
  timelineEvent({
    id: 'voyage-day1-364-babimyna-at-door',
    title: 'Babimyna arrives at Room 1014 while the three-prince contact problem is unresolved',
    detail: 'Babimyna rings Room 1014’s doorbell as Kurapika is already managing Little Eye, Emperor Time’s lifespan cost, Vincent’s death, and three competing royal calls, creating simultaneous tactical and diplomatic pressure.',
    tracks: ['babimyna', 'kurapika', 'room-1014', 'benjamin', 'diplomacy'],
  }),
]);

export const succession364LittleEyeTransfer = freeze({
  ability: 'Little Eye',
  originalUser: 'Sayird',
  stolenBy: 'Kurapika',
  temporaryUser: 'Oito Hui Guo Rou',
  transferMechanism: 'Kurapika transfers the right to use the stolen ability through Stealth Dolphin while Emperor Time is active.',
  sharedLink: 'Stealth Dolphin is connected to both Kurapika and Oito while Oito retains Little Eye.',
  endCondition: 'The shared borrowed-ability state ends when Oito deactivates Little Eye.',
  preferredFutureTarget: 'Marayam’s pet hamster at a later banquet',
  immediateTargetPlan: 'An inconspicuous insect such as a fly because the ability cannot remain pending safely for long',
  source,
});

export const succession364EmperorTimeCost = freeze({
  ability: 'Emperor Time',
  user: 'Kurapika',
  cost: 'One hour of Kurapika’s lifespan is lost for every one second Emperor Time remains activated.',
  strategicEffect: 'Kurapika refuses to load Vincent’s stolen ability into Stealth Dolphin while Little Eye remains active because doing so would prolong Emperor Time and multiply the lifespan cost.',
  unitConversion: freeze({
    oneSecondActive: '1 hour lifespan',
    oneMinuteActive: '60 hours lifespan',
  }),
  source,
});

export const succession364DiplomaticContacts = freeze([
  freeze({ prince: 'Benjamin Hui Guo Rou', order: 1, action: 'Calls Room 1014', implication: 'Reply priority could be interpreted as political alignment or preference', source }),
  freeze({ prince: 'Zhang Lei Hui Guo Rou', order: 3, action: 'Calls Room 1014', implication: 'Reply priority could be interpreted as political alignment or preference', source }),
  freeze({ prince: 'Tubeppa Hui Guo Rou', order: 5, action: 'Calls Room 1014', implication: 'Reply priority could be interpreted as political alignment or preference', source }),
]);

export const succession364BodyStates = freeze([
  freeze({
    subject: 'Vincent',
    state: 'deceased',
    chapter: 364,
    detail: 'After Kurapika drains his aura, steals his unnamed Nen ability, and restrains him with Bill, Vincent swallows poison hidden behind his back teeth and dies rather than risk forced confession.',
    source,
  }),
]);

export const succession364RelationshipRecords = freeze([
  freeze({
    from: 'Kurapika',
    to: 'Oito Hui Guo Rou',
    type: 'Borrowed Nen ability transfer / shared reconnaissance link',
    note: 'Kurapika entrusts Oito with Little Eye. Stealth Dolphin links both of their minds until Oito deactivates the borrowed ability.',
    phase: 'Active contest and voyage',
    chapters: '364–current',
    state: 'active Little Eye operation',
    source,
  }),
  freeze({
    from: 'Benjamin Hui Guo Rou',
    to: 'Babimyna',
    type: 'Room 1014 Royal Guard assignment',
    note: 'Benjamin sends Babimyna to replace Vincent as his official soldier assigned to Woble’s household.',
    phase: 'Active contest and voyage',
    chapters: '364–current',
    state: 'active assignment',
    source,
  }),
  freeze({
    from: 'Benjamin Hui Guo Rou',
    to: 'Woble / Oito household',
    type: 'Continued surveillance after Vincent death',
    note: 'Vincent’s death does not end Benjamin’s embedded observation strategy; Babimyna immediately succeeds him.',
    phase: 'Active contest and voyage',
    chapters: '364–current',
    state: 'active surveillance',
    source,
  }),
]);

export const succession364Mysteries = freeze([
  freeze({
    question: 'What Nen ability did Kurapika steal from Vincent?',
    evidence: 'The supplied Chapter 364 text confirms that Steal Chain takes Vincent’s Nen ability, but does not name or describe that ability. No ability identity is inferred here from outside the supplied chapter text.',
    status: 'open from supplied Chapter 364 text',
    lastChapter: '364',
    source,
  }),
  freeze({
    question: 'How will Room 1014 answer Benjamin, Zhang Lei, and Tubeppa without signaling an unwanted alliance?',
    evidence: 'All three princes contact Woble’s quarters, and Kurapika recognizes that even the order of response can be interpreted politically.',
    status: 'developing diplomatic problem',
    lastChapter: '364',
    source,
  }),
]);

const focus = 'Kurapika and Bill neutralize Vincent without openly escalating the legal conflict; Kurapika transfers Little Eye to Oito and reveals that Emperor Time costs one hour of lifespan for every second activated; Vincent commits suicide after his aura and unnamed ability are stolen; Benjamin sends Babimyna as Vincent’s replacement; and simultaneous calls from Benjamin, Zhang Lei, and Tubeppa turn Room 1014 into a diplomatic focal point where even response order can signal alliance.';

export const succession364ChapterResearch = freeze([
  freeze({
    number: 364,
    title: 'Speculation',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Vincent confrontation',
      'Little Eye transfer',
      'Stealth Dolphin shared link',
      'Emperor Time lifespan cost',
      'Benjamin surveillance replacement',
      'Room 1014 diplomacy',
    ]),
    focus,
    events: succession364TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika',
      'Oito Hui Guo Rou',
      'Woble Hui Guo Rou',
      'Bill',
      'Vincent',
      'Benjamin Hui Guo Rou',
      'Balsamilco Might',
      'Babimyna',
      'Zhang Lei Hui Guo Rou',
      'Tubeppa Hui Guo Rou',
      'Sayird',
      'Marayam Hui Guo Rou',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Black Whale · Tier 1 · Room 1014 entrance',
      'Black Whale · Tier 1 · Benjamin command area',
    ]),
    threadLabels: freeze([
      'Room 1014',
      'Vincent',
      'Little Eye',
      'Stealth Dolphin',
      'Emperor Time',
      'Oito reconnaissance',
      'Benjamin',
      'Babimyna',
      'Zhang Lei',
      'Tubeppa',
      'Diplomatic signaling',
    ]),
    littleEyeTransfer: succession364LittleEyeTransfer,
    emperorTimeCost: succession364EmperorTimeCost,
    diplomaticContacts: succession364DiplomaticContacts,
    relationships: succession364RelationshipRecords,
    bodyStates: succession364BodyStates,
    confidence: freeze([
      'All story claims derive only from the user-supplied Hunterpedia Chapter 364 text',
      'Vincent’s death is confirmed as suicide after he is restrained and his aura is drained',
      'The supplied text confirms Kurapika steals Vincent’s Nen ability but does not name or describe it, so this research module does not identify it as Air Blow or any other named ability',
      'Balsamilco’s interpretation that Room 1014 verbally lied to mislead eavesdroppers is stored as speculation',
      'The exact Emperor Time cost is stored as one hour of lifespan per one second of activation',
      'The three-prince call-order problem is stored as Kurapika’s diplomatic assessment rather than a formal rule that answering first automatically creates an alliance',
    ]),
    status: 'Maintained chapter summary, chronology, Vincent confrontation and death, Little Eye transfer, Stealth Dolphin shared link, Emperor Time cost, Benjamin replacement assignment, diplomatic contact queue, relationships, mysteries, and source confidence linked',
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
    titleStatus: 'repository-hunterpedia-transcription',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession364ChapterFocus = freeze({ 364: focus });
