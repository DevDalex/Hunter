const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-393';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:393`,
  organizationId,
  chapterRange: freeze({ start: 393, end: 393 }),
  status: 'active',
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds: freeze([sourceId]),
});

export const organizationState393Corrections = freeze({
  'organization:phantom-troupe': freeze([
    state({
      organizationId: 'organization:phantom-troupe',
      operationalState: 'Nobunaga kills Luini at the Tier 5 Cha-R office after rejecting his destructive alliance proposal. Nobunaga, Phinks, and Feitan then tell Cha-R that the Troupe will destroy Heil-Ly while continuing the Hisoka search, with useful Heil-Ly/Morena intelligence able to take priority in the immediate operation.',
      authority: 'Nobunaga, Phinks, and Feitan coordinate autonomously within the Troupe’s larger Hisoka-search objective; Chapter 393 does not show a new direct Chrollo order in these scenes.',
      territoryIds: ['location:black-whale:tier-5'],
      objectiveStates: ['Destroy Heil-Ly interference and Morena’s network.', 'Continue searching for Hisoka.', 'Use mafia information without accepting Luini’s proposed worldview or command.'],
      pressure: ['Heil-Ly has killed Cha-R personnel and used spatial attacks against the office/warehouse network.', 'Hisoka remains an active Troupe objective.', 'Mafia factions are simultaneously trying to use the Troupe in their balance strategy.'],
      relatedEventIds: ['event:luini-troupe-confrontation', 'event:troupe-declares-heilly-destruction-priority'],
    }),
  ]),
  'organization:heil-ly': freeze([
    state({
      organizationId: 'organization:heil-ly',
      operationalState: 'Luini is dead, removing the spatial hunting role that members say let them hunt from the hideout. Daemon, Gelato, Perigord, Bille, Voconte, Tevelares, Quorolle, and Matvere reassess hunting and ability development while Morena coaches matchup-specific counter design. Voconte’s unnamed door ability is proposed as a trap tool.',
      authority: 'Morena remains Heil-Ly boss, Contagion user, and the members’ acknowledged game master/ability-development adviser.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:heil-ly-hideout'],
      objectiveStates: ['Replace or work around Luini’s lost spatial hunting utility.', 'Raise members toward ability-development thresholds.', 'Develop counters to Hinrigh’s Biohazard restraint tactics.', 'Continue the wider Heil-Ly campaign under increasing military, mafia, and Troupe pressure.'],
      pressure: ['Luini has been killed by the Phantom Troupe.', 'Padaille was killed by Hinrigh.', 'The military is on high alert.', 'Xi-Yu and Cha-R are buying and verifying hideout intelligence.', 'The Troupe has openly declared Heil-Ly a destruction target.'],
      relatedEventIds: ['event:luini-troupe-confrontation', 'event:troupe-declares-heilly-destruction-priority', 'event:heilly-reassesses-after-luini-death', 'event:morena-counter-ability-design-coaching'],
    }),
  ]),
  'organization:xi-yu': freeze([
    state({
      organizationId: 'organization:xi-yu',
      operationalState: 'Lynch and Zakuro recover from the apparent-Hisoka contact while Hinrigh takes over direct negotiation at the Tier 3 cinema. Hinrigh reaches a temporary VVIP non-initiation arrangement on the working assumption that the man is Hisoka, then joins Ken’i and Maizan to verify the Room 3101 intelligence. Maizan disappears after entering the room and Hinrigh begins testing the boundary.',
      authority: 'Onior’s standing operation remains delegated to Hinrigh as Xi-Yu underboss. Connelly acts as a Xi-Yu lieutenant and brings the requested money.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:room-3101'],
      objectiveStates: ['Keep the apparent Hisoka out of the immediate Troupe/Heil-Ly conflict if possible.', 'Coordinate tactically with Cha-R against Heil-Ly.', 'Verify the Room 3101 lead without blindly entering a suspected Nen route.', 'Continue locating Morena and Heil-Ly infrastructure.'],
      pressure: ['The apparent-Hisoka target is overwhelmingly dangerous to field members.', 'The target’s objective identity remains unresolved at this chapter boundary.', 'Maizan disappears after entering Room 3101.', 'The Room 3101 mechanism and Heil-Ly connection remain unresolved.'],
      relatedEventIds: ['event:lynch-zakuro-recover-after-apparent-hisoka', 'event:hinrigh-apparent-hisoka-vvip-negotiation', 'event:keni-maizan-matched-intelligence-deal', 'event:room3101-mafia-wall-verification', 'event:room3101-maizan-disappearance-test'],
    }),
  ]),
  'organization:cha-r': freeze([
    state({
      organizationId: 'organization:cha-r',
      operationalState: 'Cha-R receives the Troupe’s declaration that Heil-Ly will be destroyed while the Hisoka search continues. Ken’i matches Maizan’s intelligence price, expands paid Heil-Ly identification incentives, and coordinates directly with Hinrigh at Room 3101. Tsudonke remains personally focused on obtaining autograph paper for the Troupe.',
      authority: 'Ken’i Wang exercises active underboss command over the lower-tier operation while coordinating with Xi-Yu and hosting the Troupe’s Tier 5 position.',
      territoryIds: ['location:black-whale:tier-5', 'location:black-whale:tier-3', 'location:black-whale:tier-3:room-3101'],
      objectiveStates: ['Help eliminate Heil-Ly while preserving mafia balance.', 'Exploit useful intelligence before the Xi-Yu gains exclusive advantage.', 'Coordinate with Xi-Yu without merging family command.', 'Manage the Phantom Troupe relationship while the Troupe remains useful against Heil-Ly.'],
      pressure: ['Luini killed Cha-R personnel before being killed by Nobunaga.', 'The Troupe remains powerful and autonomous.', 'Ken’i’s intelligence/corruption plan carries legal and retaliation risk.', 'Maizan disappears during the Room 3101 inspection.'],
      relatedEventIds: ['event:troupe-declares-heilly-destruction-priority', 'event:keni-maizan-matched-intelligence-deal', 'event:room3101-mafia-wall-verification', 'event:room3101-maizan-disappearance-test'],
    }),
  ]),
});
