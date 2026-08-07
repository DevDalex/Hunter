const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_361';

export const succession361SourcePolicy = freeze({
  reviewedAt: '2026-08-07',
  soleStorySource: 'User-supplied Hunterpedia Chapter 361 synopsis and chapter-note text',
  titleMetadata: 'English title Withdraw retained from the repository chapter-title dataset; Japanese and romanized title text were not supplied in the current message and are left unset.',
  excluded: freeze(['All outside story claims and external cross-checks']),
});

const timelineEvent = ({ id, title, detail, location = 'Black Whale · Tier 1', tracks, confidence = 'Confirmed in the supplied Hunterpedia synopsis or chapter notes' }) => freeze({
  id,
  time: 'Voyage Day 1 · roughly two hours after departure',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 361,
  confidence,
  source,
});

export const succession361TimelineEvents = freeze([
  timelineEvent({
    id: 'voyage-day1-361-kurapika-restrains-sayird',
    title: 'Kurapika restrains Sayird without killing him',
    detail: 'Sayird charges with a knife, but Kurapika catches his arm with a chain, throws him down, and pins him. Kurapika keeps the Chapter 360 plan to take Sayird alive so the manipulation incident can be investigated.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'sayird', 'room-1014', 'guardian-spirit-beast'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-kurton-escape-method',
    title: 'Bill explains the first of the three escape routes: Kurton’s transformation ability',
    detail: 'Bill says Kurton could use a Conjuration-based symbiotic ability to transform into a ship or car capable of carrying five passengers, drawing on other people’s aura as part of the ability. Kurton’s death makes this route unavailable.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['bill', 'kurton', 'escape-plan', 'conjuration', 'symbiotic-nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-little-eye-revealed',
    title: 'Bill reveals Sayird’s Little Eye ability',
    detail: 'After initially refusing to disclose another Hunter’s ability without consent, Bill explains that Sayird is an Emitter whose ability incorporates Manipulation: he launches a Nen ball at a small living creature, captures it, controls it, and receives the visual and auditory information it perceives.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['bill', 'sayird', 'little-eye', 'emission', 'manipulation'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-izunavi-index-chain-flashback',
    title: 'Kurapika recalls Izunavi advising him to reserve one chain for an ability that compensates for fighting alone',
    detail: 'A flashback shows Izunavi urging Kurapika to value synergy and allies rather than assume every fight must be carried alone. He recommends leaving one chain undeveloped until Kurapika understands what weakness an additional ability should cover.',
    location: 'Flashback · Kurapika / Izunavi training',
    tracks: ['kurapika', 'izunavi', 'index-finger-chain', 'allies'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-kurapika-allies-reflection',
    title: 'Kurapika recognizes Izunavi’s lesson while still fearing the cost of involving his friends',
    detail: 'Kurapika accepts that Izunavi was right about fighting beside allies, remembering Gon, Killua, and Leorio, but also concludes that working alone can keep the people he cares about from being endangered by his objectives.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'gon', 'killua', 'leorio', 'izunavi'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-steal-chain',
    title: 'Kurapika reveals Steal Chain and temporarily takes Little Eye',
    detail: 'The syringe on Kurapika’s Index Finger Chain pierces Sayird and Steal Chain drains his aura, temporarily taking Little Eye and forcing Sayird into a Zetsu-like state. Kurapika deliberately uses the aura deprivation in hopes of starving the parasitic beast attached to Sayird.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'steal-chain', 'sayird', 'little-eye', 'zetsu', 'parasitic-nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-parasite-leaves-sayird',
    title: 'The parasitic creature leaves Sayird after his aura is drained',
    detail: 'A small creature crawls from Sayird’s ear and escapes toward an air vent after Steal Chain removes his usable aura. This matches Kurapika’s plan to deprive the parasite of an aura food source, although Chapter 361 does not establish that every parasitic Nen creature can be expelled this way.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['sayird', 'parasitic-nen', 'steal-chain', 'guardian-spirit-beast'],
    confidence: 'Observed interaction in Sayird’s case; not generalized as a universal parasitic-Nen countermeasure',
  }),
  timelineEvent({
    id: 'voyage-day1-361-stealth-dolphin',
    title: 'Kurapika activates Emperor Time and reveals Stealth Dolphin',
    detail: 'Kurapika activates Emperor Time, summons Stealth Dolphin, and loads the stolen Little Eye ability. Stealth Dolphin analyzes the ability and confirms its mechanics while warning that Emperor Time must remain active until the loaded ability is used or the Dolphin is dismissed.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['kurapika', 'emperor-time', 'stealth-dolphin', 'little-eye'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-little-eye-limitations',
    title: 'Little Eye’s target limits and information channel are clarified',
    detail: 'Stealth Dolphin states that Little Eye cannot control Nen-conjured creatures. Sayird later adds that the largest living creature he can control is approximately hamster-sized and that he receives what the controlled creature sees and hears. The stolen ability will automatically return after Kurapika uses it once.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['little-eye', 'sayird', 'stealth-dolphin', 'nen-mechanics'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-sayird-keyword-testimony',
    title: 'Sayird explains the coercion trigger used by the creature',
    detail: 'Sayird says the small creature repeatedly asked whether he was “free.” After he finally answered that he was, he lost control of his body. Kurapika considers whether the keyword is part of the manipulation condition, while noting complications involving people who cannot perceive Nen creatures.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['sayird', 'guardian-spirit-beast', 'manipulation', 'condition'],
    confidence: 'Sayird’s testimony confirms the sequence he experienced; the exact universal activation rule of the beast remains unresolved',
  }),
  timelineEvent({
    id: 'voyage-day1-361-sayird-arrested',
    title: 'The Royal Army arrests Sayird',
    detail: 'Royal Army personnel remove the dead and take Sayird into custody for questioning. Kurapika tells Sayird his ability is stored in the syringe; Sayird allows Kurapika to use it and asks him to catch the culprit.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['sayird', 'royal-army', 'kurapika', 'little-eye'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-woble-household-collapse',
    title: 'Only Kurapika, Bill, Shimanu, and Sandra remain in Woble’s depleted guard/servant core',
    detail: 'Two additional servants resign. Only two hours after departure, Woble and Oito are down from eleven guards and four servants to two guards, Kurapika and Bill, and two servants, Shimanu and Sandra.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['woble', 'oito', 'kurapika', 'bill', 'shimanu', 'sandra', 'staffing'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-pariston-beyond-escape-routes',
    title: 'Bill reveals the remaining escape routes depend on Pariston or Beyond',
    detail: 'With Kurton’s route lost, Bill says the second escape option requires Pariston’s help and will be difficult, while the third requires Beyond Netero’s help and will be even more difficult. Chapter 361 does not explain the operational details of either route.',
    location: 'Black Whale · Tier 1 · Room 1014',
    tracks: ['bill', 'pariston', 'beyond', 'escape-plan', 'oito', 'woble'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-sevanti-shifts-guards',
    title: 'Sevanti shifts protection away from Momoze toward Marayam',
    detail: 'Queen Sevanti decides that Marayam needs more protection to feel safe and redirects much of the household manpower toward him, leaving Momoze with a reduced protective detail. Hanzo notices that Momoze can hear the conversation and feels sympathy for her.',
    location: 'Black Whale · Tier 1 · Momoze quarters',
    tracks: ['sevanti', 'momoze', 'marayam', 'hanzo', 'guards'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-momoze-beast-identified',
    title: 'The Sayird-controlling Guardian Spirit Beast is revealed to belong to Momoze',
    detail: 'The hamster-like Guardian Spirit Beast previously seen manipulating Sayird is shown sitting behind Momoze, establishing Momoze as its royal host. Momoze herself is not shown consciously commanding the creature.',
    location: 'Black Whale · Tier 1 · Momoze quarters',
    tracks: ['momoze', 'guardian-spirit-beast', 'sayird', 'parasitic-nen'],
  }),
  timelineEvent({
    id: 'voyage-day1-361-halkenburg-withdrawal-request',
    title: 'Halkenburg asks Nasubi to withdraw from the succession contest',
    detail: 'Halkenburg tells Nasubi that he entered only out of respect and wants no part in obtaining a bloody throne. Nasubi smiles and tells him he may do as he wishes. Chapter 361 records the request and Nasubi’s permissive wording but does not yet establish that the succession system actually releases Halkenburg from participation.',
    location: 'Black Whale · Tier 1 · royal banquet area',
    tracks: ['halkenburg', 'nasubi', 'succession-contest', 'withdrawal'],
    confidence: 'Withdrawal request and Nasubi’s response are confirmed; the legal/ritual effect on Halkenburg’s contestant status remains unresolved in Chapter 361',
  }),
]);

export const succession361AbilityRecords = freeze([
  freeze({
    user: 'Kurapika',
    ability: 'Steal Chain',
    type: 'Index Finger Chain ability',
    mechanics: 'A syringe-tipped chain drains a target’s aura, forces the target into a Zetsu-like state, and temporarily steals one Nen ability. The stolen ability is retained for one use and then returns automatically to its owner.',
    chapters: '361',
    conditions: 'The supplied text establishes aura extraction, temporary theft, Zetsu-like suppression, and one-use return. Complete range, resistance rules, and all edge cases are not established here.',
    source,
  }),
  freeze({
    user: 'Kurapika',
    ability: 'Stealth Dolphin',
    type: 'Index Finger Chain / Emperor Time support ability',
    mechanics: 'While Emperor Time is active, Kurapika can summon Stealth Dolphin and load a stolen ability into it. The Dolphin analyzes the loaded ability and can supply its mechanics to Kurapika.',
    chapters: '361',
    conditions: 'Emperor Time must remain active while the loaded stolen ability is pending; the supplied synopsis states this continues until the ability is activated or Stealth Dolphin is dismissed.',
    source,
  }),
  freeze({
    user: 'Sayird',
    ability: 'Little Eye',
    type: 'Emission with Manipulation application',
    mechanics: 'Launches a Nen ball at a small living creature, captures and controls it, and relays the target’s visual and auditory information to Sayird. Maximum controllable size is about that of a hamster.',
    chapters: '361',
    conditions: 'Does not work on Nen-conjured creatures according to Stealth Dolphin’s analysis. Other activation, range, duration, and aura-cost limits are not supplied.',
    source,
  }),
  freeze({
    user: 'Kurton',
    ability: 'Unnamed vehicle transformation ability',
    type: 'Conjuration / symbiotic-type Nen',
    mechanics: 'Kurton could transform into a ship or car capable of carrying up to five passengers and required the aura of other people as part of the ability.',
    chapters: '361',
    conditions: 'Kurton is dead by Chapter 361, so this escape method is no longer available. Complete transformation limits, required contributors, range, and duration are not supplied.',
    source,
  }),
]);

export const succession361EscapeRoutes = freeze([
  freeze({ route: 'Kurton vehicle transformation', dependency: 'Kurton', status: 'unavailable', difficulty: 'Previously viable', detail: 'Kurton could transform into a ship or car for up to five passengers using a symbiotic aura contribution. His death closes this route.', source }),
  freeze({ route: 'Pariston-assisted escape', dependency: 'Pariston Hill', status: 'theoretical / still available', difficulty: 'Difficult', detail: 'Bill says one remaining escape route requires Pariston’s help. Chapter 361 does not reveal the method.', source }),
  freeze({ route: 'Beyond-assisted escape', dependency: 'Beyond Netero', status: 'theoretical / still available', difficulty: 'Even more difficult', detail: 'Bill says the third escape route requires Beyond’s help. Chapter 361 does not reveal the method.', source }),
]);

export const succession361GuardianBeastUpdates = freeze([
  freeze({
    host: 'Momoze Hui Guo Rou',
    beast: 'Hamster-like Guardian Spirit Beast',
    observedAbility: 'Behavioral coercion / manipulation after repeatedly asking a target whether they are “free”',
    confirmedTarget: 'Sayird',
    hostAwareness: 'Not shown to be consciously controlled by Momoze',
    chapter: 361,
    source,
  }),
]);

export const succession361BodyStates = freeze([
  freeze({ subject: 'Sayird', state: 'alive / Royal Army custody', chapter: 361, detail: 'Restrained by Kurapika, parasite exits after aura drain, Little Eye temporarily stolen, then transferred to Royal Army custody for questioning.', source }),
  freeze({ subject: 'Woble household active staff', state: 'critical staffing depletion', chapter: 361, detail: 'Two hours after departure, only guards Kurapika and Bill and servants Shimanu and Sandra remain from eleven guards and four servants.', source }),
]);

export const succession361RelationshipRecords = freeze([
  freeze({
    from: 'Momoze Hui Guo Rou',
    to: 'Hamster-like Guardian Spirit Beast',
    type: 'Royal host / parasitic Guardian Spirit Beast',
    note: 'Chapter 361 identifies the beast that manipulated Sayird as Momoze’s Guardian Spirit Beast. Momoze is not shown consciously directing it.',
    phase: 'Active contest and voyage',
    chapters: '361–current',
    state: 'active / host identified',
    source,
  }),
  freeze({
    from: 'Queen Sevanti',
    to: 'Momoze & Marayam households',
    type: 'Protection reallocation',
    note: 'Sevanti shifts protective manpower away from Momoze toward Marayam because she believes Marayam needs more guards to feel secure.',
    phase: 'Active contest and voyage',
    chapters: '361',
    state: 'active at chapter end',
    source,
  }),
  freeze({
    from: 'Halkenburg Hui Guo Rou',
    to: 'Nasubi Hui Guo Rou',
    type: 'Succession withdrawal request',
    note: 'Halkenburg asks to withdraw from the succession contest. Nasubi tells him to do as he wishes, but Chapter 361 does not establish whether ritual participation can actually be canceled.',
    phase: 'Active contest and voyage',
    chapters: '361',
    state: 'requested / effect unresolved',
    source,
  }),
  freeze({
    from: 'Kurapika',
    to: 'Sayird',
    type: 'Temporary Nen ability seizure',
    note: 'Kurapika uses Steal Chain to drain Sayird’s aura and temporarily take Little Eye for one use before automatic return.',
    phase: 'Active contest and voyage',
    chapters: '361',
    state: 'temporary / active at chapter end',
    source,
  }),
]);

export const succession361Mysteries = freeze([
  freeze({
    question: 'Can a prince actually withdraw from the succession contest after completing the Seed Urn Ceremony?',
    evidence: 'Halkenburg asks Nasubi to withdraw and Nasubi says he may do as he wishes, but Chapter 361 does not establish whether the ritual or contest rules recognize withdrawal as a valid exit.',
    status: 'developing',
    lastChapter: '361',
    source,
  }),
  freeze({
    question: 'What are the actual Pariston-assisted and Beyond-assisted escape methods for Oito and Woble?',
    evidence: 'Bill identifies Pariston and Beyond as the two surviving dependencies after Kurton’s death, calling the first route difficult and the second even more difficult, but supplies no operational details.',
    status: 'open',
    lastChapter: '361',
    source,
  }),
  freeze({
    question: 'What are the complete activation and targeting rules of Momoze’s Guardian Spirit Beast?',
    evidence: 'Sayird reports repeated “are you free?” prompting and loses bodily control after answering yes. Chapter 361 identifies Momoze as the host but does not establish range, valid targets, repeat use, duration, immunity, or whether the spoken answer alone is sufficient.',
    status: 'open',
    lastChapter: '361',
    source,
  }),
  freeze({
    question: 'What are the complete costs and limitations of Steal Chain and Stealth Dolphin?',
    evidence: 'Chapter 361 establishes one-use ability theft, a Zetsu-like target state, Emperor Time dependence for Stealth Dolphin, and automatic return after use, but does not establish every cost, resistance rule, or edge case.',
    status: 'open',
    lastChapter: '361',
    source,
  }),
]);

const focus = 'Kurapika restrains Sayird and reveals the Index Finger Chain system: Steal Chain drains aura and temporarily steals Little Eye, while Emperor Time summons Stealth Dolphin to analyze and hold the stolen ability; the parasite leaves Sayird after his aura is removed, Little Eye’s hamster-size and information-gathering limits are clarified, Woble’s household falls to only Kurapika, Bill, Shimanu, and Sandra, Bill resolves his three escape dependencies as the now-dead Kurton plus difficult Pariston and Beyond routes, Sevanti shifts guards from Momoze toward Marayam, Momoze is confirmed as host of the beast that manipulated Sayird, and Halkenburg asks Nasubi to withdraw from the succession contest.';

export const succession361ChapterResearch = freeze([
  freeze({
    number: 361,
    title: 'Withdraw',
    japaneseTitle: null,
    romanizedTitle: null,
    phase: 'Active contest and voyage',
    voyageDay: 'Voyage Day 1',
    lanes: freeze([
      'Kurapika Index Finger Chain',
      'Steal Chain / Stealth Dolphin',
      'Little Eye',
      'Oito / Woble escape routes',
      'Momoze Guardian Spirit Beast',
      'Momoze / Marayam guard allocation',
      'Halkenburg withdrawal',
    ]),
    focus,
    events: succession361TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Kurapika', 'Sayird', 'Bill', 'Kurton', 'Izunavi', 'Gon Freecss', 'Killua Zoldyck', 'Leorio Paradinight',
      'Queen Oito Hui Guo Rou', 'Woble Hui Guo Rou', 'Shimanu', 'Sandra', 'Queen Sevanti Hui Guo Rou', 'Momoze Hui Guo Rou',
      'Marayam Hui Guo Rou', 'Hanzo', 'Halkenburg Hui Guo Rou', 'Nasubi Hui Guo Rou', 'Nugui',
    ]),
    locations: freeze([
      'Black Whale · Tier 1 · Room 1014',
      'Flashback · Kurapika / Izunavi training',
      'Black Whale · Tier 1 · Momoze quarters',
      'Black Whale · Tier 1 · royal banquet area',
    ]),
    threadLabels: freeze([
      'Steal Chain', 'Stealth Dolphin', 'Little Eye', 'Emperor Time', 'Momoze Guardian Spirit Beast',
      'Oito/Woble escape', 'Household depletion', 'Halkenburg withdrawal',
    ]),
    abilities: succession361AbilityRecords,
    escapeRoutes: succession361EscapeRoutes,
    guardianBeastUpdates: succession361GuardianBeastUpdates,
    relationships: succession361RelationshipRecords,
    bodyStates: succession361BodyStates,
    confidence: freeze([
      'All story details derive only from the user-supplied Hunterpedia Chapter 361 text',
      'Momoze is confirmed as host of the hamster-like Guardian Spirit Beast; conscious control by Momoze is not asserted',
      'The parasite leaving Sayird after aura deprivation is recorded as an observed case, not a universal rule for all parasitic Nen',
      'Halkenburg’s withdrawal request is confirmed, but Nasubi’s response is not treated as proof that ritual participation has ended',
      'Little Eye is stored with the supplied Emitter classification, Manipulation application, hamster-size maximum, sensory relay, and inability to control Nen-conjured creatures',
      'Steal Chain and Stealth Dolphin are limited to the mechanics explicitly supplied in Chapter 361; unknown costs and edge cases remain open',
    ]),
    status: 'Maintained chapter summary, chronology, Index Finger Chain mechanics, Little Eye, escape-route resolution, household staffing collapse, Guardian Spirit Beast host identification, guard reallocation, withdrawal attempt, relationships, body states, mysteries, and source confidence linked',
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
    titleStatus: 'repository-maintained-hunterpedia-title',
    officialReaderUrl: null,
    source,
  }),
]);

export const succession361ChapterFocus = freeze({ 361: focus });
