const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_408';

export const succession408SourcePolicy = freeze({
  reviewedAt: '2026-08-05',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 408',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location = 'Black Whale 1 · Heil-Ly negotiation room (exact tier unstated)',
  tracks = ['mafia', 'nen'],
  confidence = 'Confirmed in the supplied Hunterpedia synopsis',
}) => freeze({
  id,
  time: 'Chapter 408 · negotiation-game order',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 408,
  confidence,
  source,
});

export const succession408TimelineEvents = freeze([
  timelineEvent({
    id: 'chapter-408-aim-opening',
    title: 'Borksen opens with the Aim card',
    detail: 'Borksen selects Aim from the seven question cards. Before Morena explains her objective, Borksen tests whether she may ask informal questions, probes the silent Heil-Ly members around her, and estimates from Morena’s reaction that the group probably numbers well below fifty.',
  }),
  timelineEvent({
    id: 'chapter-408-morena-goal',
    title: 'Morena states her goals without disguise',
    detail: 'Morena says her immediate objective is the destruction of the Kakin Empire and that she intends to continue afterward until humanity itself is destroyed. She tells Borksen that Borksen is needed for that plan.',
  }),
  timelineEvent({
    id: 'chapter-408-false-morena-identity',
    title: 'Morena reveals that she is not the original Morena Prudo',
    detail: 'Morena explains that the true Second-Track Faker named Morena is buried in a grave bearing the current Morena’s identity. By invoking Carne Levare and lèse-majesté, she leads Borksen to identify her as a Carnival Orphan.',
    tracks: ['mafia', 'ritual'],
  }),
  timelineEvent({
    id: 'chapter-408-carne-levare-system',
    title: 'The Carne Levare system is exposed',
    detail: 'The chapter explains a secret royal carnival in which a randomly selected village is divided into Entertainers and Others. Royal offenses remain punishable by death, including modern restrictions involving contraception, abortion, or genetic testing connected to royal descendants.',
    tracks: ['mafia', 'ritual', 'justice'],
  }),
  timelineEvent({
    id: 'chapter-408-morena-upbringing',
    title: 'Morena recounts life as a Carnival Orphan',
    detail: 'Morena says her mother was forced to entertain visiting royalty, later died when Morena was two, and left her to a Heil-Ly-linked trafficking institution and underground hospital. Scarred at birth and classified as flesh rather than a Second-Track Faker, Morena says she endured that role for roughly twenty years before becoming Heil-Ly’s boss.',
    tracks: ['mafia', 'ritual', 'justice'],
  }),
  timelineEvent({
    id: 'chapter-408-kakin-destruction-framework',
    title: 'Morena connects recurring carnivals to Kakin’s destruction',
    detail: 'Morena identifies herself with the ’98 Carnival Orphan group and says seven newer groups entered the institution during the following twenty years, including a ’20 group. She presents this continuity as proof that democratized Kakin has not changed and will not reform.',
    tracks: ['mafia', 'ritual'],
  }),
  timelineEvent({
    id: 'chapter-408-borksen-critical-role',
    title: 'Morena says Borksen may fill Heil-Ly’s critical missing role',
    detail: 'Morena explains that her plan requires people with specialized abilities and that one ability will be especially important. She hopes Borksen will develop it, but refuses to explain why Borksen was selected while only the Aim card is active.',
  }),
  timelineEvent({
    id: 'chapter-408-joker-discarded',
    title: 'The Joker response card is removed',
    detail: 'Orarge shuffles Borksen’s five response cards. Borksen reveals Joker, which could become Yes or No if it survived as the final response, and discards it to the graveyard before continuing.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-408-contagion-explained',
    title: 'Morena explains her Nen recruitment system',
    detail: 'After Borksen selects Ability, Morena explains that Nen can be learned and that her own ability can awaken compatible recruits. She describes herself as the dealer or mother of up to twenty-two children, who gain points, develop abilities with her support, and can eventually become parents who produce further children.',
  }),
  timelineEvent({
    id: 'chapter-408-borksen-rejects-morena-worldview',
    title: 'Borksen privately rejects Morena’s larger goal',
    detail: 'Borksen sympathizes with Morena’s suffering but concludes that she cannot accept murder or the destruction of Kakin. She reflects that Kakin is repressive and flawed yet remains her home, and resolves to escape the extraordinary conflict rather than let Morena’s ambition consume her ordinary life.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-408-specialist-identification',
    title: 'Borksen is identified as an unawakened Specialist',
    detail: 'Morena says a Heil-Ly Enhancer sharpened his sense of smell until he could identify Nen categories from the faint aura of unawakened people. She says he identified Borksen as a Specialist and continues searching the ship for others, including awakened Specialists and a famous Heavens Arena Floor Master who excited him.',
    confidence: 'Borksen’s classification and Morena’s description are confirmed as statements made by Morena; the unnamed searcher and Floor Master are not identified in the supplied synopsis',
  }),
  timelineEvent({
    id: 'chapter-408-specialization-explained',
    title: 'Morena explains the flexibility of Specialization',
    detail: 'Morena presents Specialists as able to pursue difficult hybrid techniques or abilities outside the ordinary five categories without the usual learning disadvantages. She identifies herself as a Specialist and describes her recruitment ability as both unique and comparable to an advanced hybrid system.',
    confidence: 'This records Morena’s explanation within the negotiation, not a universal independent ruling beyond the supplied synopsis',
  }),
  timelineEvent({
    id: 'chapter-408-desired-ability-withheld',
    title: 'Morena reserves Borksen’s intended ability for the Yes? card',
    detail: 'Morena says she has a specific request for the ability Borksen would develop but refuses to disclose it under Ability. She classifies that information as part of Borksen’s prospective team role and says it can only be discussed through Yes?.',
  }),
  timelineEvent({
    id: 'chapter-408-yes-response-revealed',
    title: 'Borksen’s Yes response is removed',
    detail: 'After the next shuffle, Borksen reveals Yes. Morena and the surrounding Heil-Ly members react with disappointment, and Morena interprets the removal as Borksen having chosen not to join them at that stage of the game.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-408-no-versus-x',
    title: 'Morena explains the difference between No and X',
    detail: 'When Borksen selects No?, Morena says No is an irrevocable refusal that makes Borksen and her associates outsiders and potential points for Heil-Ly. X instead voids the negotiation: Borksen retains her memories, but Heil-Ly promises to treat the meeting as nonexistent, avoid renewed recruitment, and postpone targeting the people she values.',
  }),
  timelineEvent({
    id: 'chapter-408-vows-and-limitations',
    title: 'The game’s risk is tied to vows and limitations',
    detail: 'Morena explains that X is valuable precisely because honoring it is dangerous. Accepting the outcome of a life-or-death negotiation strengthens her support ability and team unity. Recruits take a parallel risk because ending with No? means death.',
  }),
  timelineEvent({
    id: 'chapter-408-x-revealed',
    title: 'Borksen reveals X as her third response card',
    detail: 'Borksen turns over X, leaving No, which she equates with death, and Return, which she equates with survival, as her remaining response possibilities.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-408-martial-law-interruption',
    title: 'Special Martial Law interrupts the negotiation',
    detail: 'An alarm sounds immediately after X is revealed. Morena and Borksen look up as the ship announces that Special Martial Law has been declared and emphasizes that the announcement is not a drill.',
    location: 'Black Whale 1 · Heil-Ly negotiation room and shipwide intercom',
    tracks: ['mafia', 'justice', 'ship'],
  }),
]);

const focus = 'Morena and Borksen begin the Heil-Ly negotiation game: Aim exposes Morena’s Carnival Orphan identity and plan to destroy Kakin and humanity, Ability reveals her twenty-two-child Nen recruitment system and Borksen’s Specialist classification, and No? explains the lethal difference between refusal and voiding the game before Special Martial Law interrupts play.';

export const succession408ChapterResearch = freeze([
  freeze({
    number: 408,
    title: 'Negotiation: Part 2',
    japaneseTitle: '交渉②',
    phase: 'Active contest and voyage',
    voyageDay: 'Not stated in the supplied synopsis',
    lanes: freeze([
      'Heil-Ly recruitment',
      'Morena and Borksen negotiation',
      'Nen abilities and categories',
      'Kakin royal system',
      'Special Martial Law',
    ]),
    focus,
    events: succession408TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Morena Prudo',
      'Borksen',
      'Orarge',
      'Heil-Ly negotiation attendants',
      'Unnamed Heil-Ly ability-detection Enhancer',
      'The original Morena Prudo (referenced)',
      'Morena’s mother (referenced)',
      'Unnamed Heavens Arena Floor Master (referenced)',
    ]),
    locations: freeze([
      'Black Whale 1',
      'Heil-Ly negotiation room · exact tier unstated in the supplied synopsis',
      'Kakin Carne Levare villages and trafficking institution · historical account',
    ]),
    threadLabels: freeze([
      'Mafia families',
      'Nen development',
      'Justice & military',
      'Ship operations',
      'Nasubi & ritual',
    ]),
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 408 text',
      'Morena’s claims about her identity, research figures, Nen categories, and institutional history are recorded as statements delivered during the negotiation',
      'The supplied synopsis does not identify the ability-detection Enhancer or the Heavens Arena Floor Master',
      'The exact ship tier of the negotiation room is not stated in the supplied synopsis',
      'Borksen’s desired Specialist ability and final response remain unresolved at the end of the chapter',
    ]),
    status: 'Maintained chapter summary, negotiation sequence, card mechanics, history, Nen explanations, appearances, locations, and open questions sourced only to Hunterpedia Chapter 408',
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
    lastReviewed: 'August 5, 2026',
    releaseDate: null,
    titleStatus: 'verified-from-user-supplied-hunterpedia',
    officialReaderUrl: null,
    source,
    crossChecks: freeze([succession408SourcePolicy.soleSource]),
  }),
]);

export const succession408ChapterFocus = freeze({ 408: focus });

export const succession408Mysteries = freeze([
  freeze({
    question: 'What Specialist ability does Morena want Borksen to develop?',
    evidence: 'Morena says Borksen may fill Heil-Ly’s most critical missing role but reserves the requested ability and team function for the Yes? card.',
    status: 'open',
    lastChapter: '408',
    source,
  }),
  freeze({
    question: 'Which response card will decide Borksen’s fate?',
    evidence: 'After X is revealed, Borksen identifies No with death and Return with survival, but Special Martial Law interrupts before another card is resolved.',
    status: 'open',
    lastChapter: '408',
    source,
  }),
  freeze({
    question: 'Who is Heil-Ly’s ability-detection Enhancer, and which Floor Master excited him?',
    evidence: 'Morena describes an unnamed Enhancer who detects Nen categories by smell and mentions an awakened Specialist Floor Master, but neither person is named in the supplied synopsis.',
    status: 'open',
    lastChapter: '408',
    source,
  }),
]);
