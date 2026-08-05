const freeze = (value) => Object.freeze(value);
const source = 'https://hunterxhunter.fandom.com/wiki/Chapter_409';

export const succession409SourcePolicy = freeze({
  reviewedAt: '2026-08-05',
  soleSource: freeze({
    label: 'Hunterpedia Chapter 409',
    url: source,
    basis: 'User-supplied Hunterpedia page text',
  }),
  excluded: freeze(['All other websites and external cross-checks']),
});

const timelineEvent = ({
  id,
  title,
  detail,
  location = 'Between Tiers 2 and 3 · Heil-Ly hideout',
  tracks = ['mafia', 'nen'],
  confidence = 'Confirmed in the supplied Hunterpedia synopsis',
}) => freeze({
  id,
  time: 'Chapter 409 · negotiation-game order',
  title,
  detail,
  tier: location,
  location,
  tracks: freeze(tracks),
  chapter: 409,
  confidence,
  source,
});

export const succession409TimelineEvents = freeze([
  timelineEvent({
    id: 'chapter-409-tiered-martial-law-orders',
    title: 'Special Martial Law issues tier-specific commands',
    detail: 'The ship repeats that Special Martial Law is not a drill. Tier 5 is told to obey military police and mafia bosses, Tier 4 is told the sealed passage prevents upper-tier disruption, Tier 3 passengers are ordered to face a wall and kneel with their hands visible under threat of being shot, and Tiers 2 and 1 are ordered back to their rooms for military control and investigation.',
    location: 'Black Whale 1 · shipwide announcement system',
    tracks: ['justice', 'ship', 'mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-borksen-reads-emergency-law',
    title: 'Borksen calculates the danger created by martial law',
    detail: 'Borksen understands that royal soldiers may shoot suspicious people without warning, disarm civilians, and eliminate perceived subversives. She notices Morena’s tension and uses the tier-specific broadcasts to begin narrowing down the hideout’s location.',
    tracks: ['mafia', 'justice', 'ship'],
  }),
  timelineEvent({
    id: 'chapter-409-deal-selected',
    title: 'Borksen selects Deal despite the emergency',
    detail: 'Borksen chooses Deal while the announcements continue. Morena briefly fails to react, which Borksen interprets as distraction or a need to reorganize her thoughts. Morena’s willingness to continue convinces Borksen that Heil-Ly trusts either the hideout’s secrecy or its defenses.',
  }),
  timelineEvent({
    id: 'chapter-409-borksen-targets-x',
    title: 'Borksen decides X is her safest exit',
    detail: 'Borksen considers rescue by the royal army too dangerous because she could be shot, mistaken for Heil-Ly, detained, questioned, or tortured. She concludes that the most peaceful route out is to recover X and void the negotiation.',
    tracks: ['mafia', 'justice'],
  }),
  timelineEvent({
    id: 'chapter-409-deal-kiss-request',
    title: 'Morena names a kiss as the Deal request',
    detail: 'Morena explains that Deal can recover one response card from the graveyard if Borksen fulfills a small request. The request is a prolonged mouth-to-mouth kiss, which Morena says is connected to the activation conditions of her ability.',
  }),
  timelineEvent({
    id: 'chapter-409-three-membership-conditions',
    title: 'Morena reveals the three conditions for joining Heil-Ly',
    detail: 'Morena says Borksen will count as a member only if the negotiation ends with Yes, Morena infects her through a kiss, and Borksen is present when Morena or another Heil-Ly member commits murder. The order does not matter, but all three conditions must be satisfied.',
  }),
  timelineEvent({
    id: 'chapter-409-tier-one-location-doubt',
    title: 'The Tier 1 broadcast complicates Borksen’s location theory',
    detail: 'Hearing Tier 1 instructions initially makes Borksen think the room must be on Tier 1. She then considers Morena’s royal-shadow status and the possibility that the hideout receives every broadcast regardless of its physical position, preventing a firm conclusion.',
    tracks: ['mafia', 'ship'],
    confidence: 'Borksen’s reasoning is confirmed; the actual location is established later in the chapter',
  }),
  timelineEvent({
    id: 'chapter-409-kiss-completed',
    title: 'Borksen accepts the request and recovers X',
    detail: 'Borksen agrees to the kiss because she needs X and further information. Afterward, Morena returns X from the graveyard. Borksen pushes the game forward while rejecting Morena’s teasing about the kiss having been her first.',
  }),
  timelineEvent({
    id: 'chapter-409-card-integrity-check',
    title: 'Borksen verifies that No and Return were not switched',
    detail: 'Because her attention left the cards during the kiss, Borksen insists on turning over the two remaining response cards before the next shuffle. They are confirmed to be No and Return, despite Morena’s annoyance at the accusation of cheating.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-x-redrawn',
    title: 'Borksen immediately redraws X',
    detail: 'Orarge shuffles X, No, and Return. Borksen chooses the leftmost card and reveals X, sending the card back out of play and leaving No and Return as the final response possibilities.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-question-a-location-test',
    title: 'Question A eliminates all five ordinary tiers',
    detail: 'Borksen asks whether the hideout is on Tier 5, Tier 4 or 3, and Tier 1 or 2. Morena answers No each time, then confirms that the hideout is aboard the Black Whale and answers Yes and No when asked whether it was made through Nen.',
  }),
  timelineEvent({
    id: 'chapter-409-hideout-between-tiers',
    title: 'Borksen locates the hideout between Tiers 2 and 3',
    detail: 'A loud rumble reveals the central gate between Tiers 2 and 3 closing. Borksen asks whether the base lies between those tiers and Morena confirms it. Borksen infers that the inter-tier space was planned before the Black Whale was constructed.',
    location: 'Between Tiers 2 and 3 · central inter-tier zone',
    tracks: ['mafia', 'ship', 'nen'],
    confidence: 'The inter-tier location is confirmed; Borksen’s conclusion about pre-construction planning is her inference',
  }),
  timelineEvent({
    id: 'chapter-409-five-entrances',
    title: 'Morena confirms five hideout entrances',
    detail: 'Morena answers Yes and No when asked whether ordinary people can access an entrance, confirms that multiple entrances exist, and eventually states that the hideout has five doors. Borksen reads Morena’s pause as careful counting under the game’s truth requirement.',
    confidence: 'Five doors are confirmed; the meaning of ordinary access remains qualified by Morena’s Yes and No answer',
  }),
  timelineEvent({
    id: 'chapter-409-heilly-headcount',
    title: 'The current Heil-Ly headcount is fixed at twenty-one',
    detail: 'Under Question A, Morena confirms that the group presently has twenty-one members.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-nen-type-breakdown',
    title: 'Morena describes the group’s incomplete Nen profile',
    detail: 'Morena says she is the only Specialist among the current Heil-Ly, confirms that at least one Enhancer exists, and admits that she does not know all twenty other members’ abilities.',
  }),
  timelineEvent({
    id: 'chapter-409-morena-refuses-change',
    title: 'Morena repeatedly refuses to abandon her goal',
    detail: 'Borksen says she is glad they spoke and asks Morena four times whether she intends to change her objective. Morena answers No every time, and Borksen accepts that their fundamental positions will not converge.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-final-no-return-draw',
    title: 'No and Return decide Borksen’s immediate fate',
    detail: 'Orarge confirms and shuffles the last two cards. Borksen sends one card to Morena and keeps the other, proposing that both be revealed simultaneously. She understands Morena receiving Return would mean Borksen’s death, while retaining Return would let her exchange it for another card and leave under the game’s rules.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-borksen-keeps-return',
    title: 'Borksen survives by keeping Return',
    detail: 'The cards are revealed together: Morena receives No and Borksen retains Return. Morena congratulates her and instructs her to exchange Return for the card she wants restored, which will conclude the game.',
    tracks: ['mafia'],
  }),
  timelineEvent({
    id: 'chapter-409-borksen-chooses-yes',
    title: 'Borksen unexpectedly exchanges Return for Yes',
    detail: 'Instead of restoring X or another expected response, Borksen deliberately chooses Yes. Morena is surprised and asks whether she made a mistake, but Borksen confirms that the decision is intentional.',
    tracks: ['mafia', 'nen'],
    confidence: 'The choice of Yes is confirmed; Borksen’s full motive and the next consequences are not explained in the supplied synopsis',
  }),
]);

const focus = 'Special Martial Law broadcasts tier-by-tier control orders while Borksen uses Deal to recover X, learns the three conditions for joining Heil-Ly, confirms that the twenty-one-member hideout occupies a five-entrance space between Tiers 2 and 3, survives the final No-versus-Return draw, and then deliberately exchanges Return for Yes.';

export const succession409ChapterResearch = freeze([
  freeze({
    number: 409,
    title: 'Negotiation: Part 3',
    japaneseTitle: '交渉③',
    phase: 'Active contest and voyage',
    voyageDay: 'Not stated in the supplied synopsis',
    lanes: freeze([
      'Heil-Ly recruitment',
      'Morena and Borksen negotiation',
      'Special Martial Law',
      'Nen vows and activation conditions',
      'Black Whale hidden infrastructure',
    ]),
    focus,
    events: succession409TimelineEvents,
    prelude: freeze([]),
    characters: freeze([
      'Morena Prudo',
      'Borksen',
      'Orarge',
      'Five Heil-Ly negotiation attendants',
    ]),
    locations: freeze([
      'Black Whale 1',
      'Between Tiers 2 and 3 · Heil-Ly hideout',
      'Between Tiers 2 and 3 · central gate area',
      'Tier 1 through Tier 5 · martial-law broadcast zones',
    ]),
    threadLabels: freeze([
      'Mafia families',
      'Nen development',
      'Justice & military',
      'Ship operations',
    ]),
    confidence: freeze([
      'All chapter details derive only from the user-supplied Hunterpedia Chapter 409 text',
      'The hideout’s position between Tiers 2 and 3, its five doors, and the current Heil-Ly headcount of twenty-one are confirmed through Morena’s game answers',
      'The physical and Nen components of the hideout remain only partially defined because Morena answers Yes and No when asked whether Nen made it',
      'Borksen’s choice of Yes is confirmed, but her full motive is not explained in the supplied synopsis',
      'No publication date or official-reader URL is added because neither appears in the supplied text',
    ]),
    status: 'Maintained chapter summary, negotiation chronology, card outcomes, martial-law orders, hideout intelligence, Nen conditions, appearances, locations, and open questions sourced only to Hunterpedia Chapter 409',
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
    crossChecks: freeze([succession409SourcePolicy.soleSource]),
  }),
]);

export const succession409ChapterFocus = freeze({ 409: focus });

export const succession409Mysteries = freeze([
  freeze({
    question: 'Why does Borksen choose Yes after winning the right to leave with Return?',
    evidence: 'Borksen survives the final draw with Return but intentionally exchanges it for Yes and denies having made a mistake.',
    status: 'open',
    lastChapter: '409',
    source,
  }),
  freeze({
    question: 'What ability and team role does Morena intend for Borksen?',
    evidence: 'Chapter 408 establishes that Morena wants a critical Specialist ability from Borksen, while Chapter 409 ends with Borksen choosing Yes before that intended role is disclosed.',
    status: 'open',
    lastChapter: '409',
    source,
  }),
  freeze({
    question: 'How do the physical and Nen components of the inter-tier hideout work together?',
    evidence: 'Morena confirms the hideout is between Tiers 2 and 3 and has five entrances, but answers Yes and No when asked whether it was created by Nen or whether ordinary people can access it.',
    status: 'open',
    lastChapter: '409',
    source,
  }),
  freeze({
    question: 'When will the remaining Heil-Ly membership condition be fulfilled?',
    evidence: 'Morena says joining requires a Yes result, infection through a kiss, and Borksen witnessing a Heil-Ly murder. By the chapter’s end, the kiss has occurred and Borksen has selected Yes, but the murder condition is not shown as completed.',
    status: 'open',
    lastChapter: '409',
    source,
  }),
]);
