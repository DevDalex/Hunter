const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:392`,
  organizationId,
  chapterRange: freeze({ start: 392, end: 392 }),
  status: 'active',
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds: freeze([chapterSourceId(392)]),
});

export const organizationState392Corrections = freeze({
  'organization:xi-yu': freeze([
    state({
      organizationId: 'organization:xi-yu',
      operationalState: 'Immediately after Hinrigh kills Padaille, Xi-Yu uses Misha Hao’s post-mortem cleanup effect to inconspicuously remove the corpse. Hinrigh negotiates with Corporal Maizan for an unverified lead on a room absent from the ship plans, while Lynch and Zakuro continue the Bloody Mary Hisoka search, rule Hanal out with Body and Soul, and reach a man they believe is Hisoka. Lynch is reflexively countered but remains alive.',
      authority: 'Onior’s Chapter 390 operation remains delegated to Hinrigh as underboss. Lynch and Zakuro continue operating under Hinrigh’s Chapter 391 contact-first search instruction.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:xi-yu-office', 'location:black-whale:tier-3:public-corridor'],
      objectiveStates: ['Dispose of the Padaille killing without disrupting the public Tier 3 operation.', 'Verify Maizan’s unplanned-room intelligence before treating it as a Heil-Ly location.', 'Continue locating Hisoka through Bloody Mary and Body and Soul.', 'Bring the man believed to be Hisoka into contact with Xi-Yu leadership without escalating recklessly.'],
      pressure: ['Maizan demands a large upfront payment for dangerous intelligence.', 'The unplanned wired room is not yet confirmed as Heil-Ly territory.', 'Lynch is abruptly incapacitated during contact with the apparent Hisoka.', 'The apparent-Hisoka target’s objective identity is unresolved at the Chapter 392 boundary.', 'Misha’s post-mortem ability has only partially documented mechanics.'],
      relatedEventIds: ['event:padaille-corpse-public-cover-after-death', 'event:maizan-sells-unplanned-room-lead', 'event:misha-post-mortem-padaille-disposal', 'event:lynch-hanal-body-and-soul-hisoka-check', 'event:xiyu-finds-man-believed-to-be-hisoka', 'event:apparent-hisoka-reflex-counter-drops-lynch'],
    }),
  ]),
  'organization:heil-ly': freeze([
    state({
      organizationId: 'organization:heil-ly',
      operationalState: 'Padaille is dead and his corpse is removed by Xi-Yu’s Misha contingency. Elsewhere, Luini uses spatial openings to probe the Cha-R office on Tier 5 and directly confronts Nobunaga, Phinks, and Feitan. Maizan separately possesses an unverified wiring/ship-plan lead that he guesses may point to a Heil-Ly room.',
      authority: 'Morena remains Heil-Ly boss and Contagion user. Chapter 392 does not show Morena directly issuing new instructions in the supplied scenes.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-5'],
      objectiveStates: ['Continue the lower-tier conflict after Padaille’s death.', 'Luini directly pressures and tests the Phantom Troupe at the Cha-R office.', 'Keep hidden infrastructure and movement routes from rival mafia verification.'],
      pressure: ['Xi-Yu is buying and verifying information about possible hidden Heil-Ly infrastructure.', 'Padaille has been killed.', 'Luini is directly provoking three Phantom Troupe members.', 'The supposed secret-room connection to Heil-Ly is only Maizan’s inference, not confirmed ownership.', 'Ken’i’s belief about Luini’s fulfilled marking condition is an outside assessment, not a complete ability specification.'],
      relatedEventIds: ['event:maizan-sells-unplanned-room-lead', 'event:luini-probes-cha-r-office-through-opening', 'event:luini-directly-confronts-troupe'],
    }),
  ]),
  'organization:cha-r': freeze([
    state({
      organizationId: 'organization:cha-r',
      operationalState: 'Cha-R receives word of the Xi-Yu clash in Area E, expands its Hisoka information sweep, and makes Hisoka the top operational priority. Ken’i plans to negotiate with Hisoka and use the resulting conflict among Hisoka, Heil-Ly, and the Phantom Troupe to preserve balance. At the Tier 5 office, Luini directly intrudes on the Troupe/Cha-R position.',
      authority: 'Ken’i Wang exercises underboss field command over the Hisoka search and directs Tsudonke’s team. Ittoku’s prior warning about the Troupe remains strategic advice rather than a completed event.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-4', 'location:black-whale:tier-5'],
      objectiveStates: ['Find Hisoka before Xi-Yu secures an exclusive advantage.', 'Do not approach Hisoka before Ken’i arrives.', 'Use negotiation and faction conflict to maintain mafia balance.', 'Continue monitoring the Phantom Troupe while resisting Heil-Ly infiltration.'],
      pressure: ['Xi-Yu may already have found the person it believes is Hisoka.', 'The Phantom Troupe remains concentrated at the office instead of splitting up.', 'Luini’s spatial intrusion reaches the Cha-R office.', 'Ken’i considers the Troupe a future Tier 1 threat after Hisoka is killed.', 'Hisoka’s behavior is treated as unpredictable even within Ken’i’s plan.'],
      relatedEventIds: ['event:tsudonke-buys-area-e-gossip', 'event:tsudonke-autograph-paper-shipment-deadlines', 'event:keni-expands-cha-r-hisoka-search', 'event:keni-hisoka-balance-strategy', 'event:troupe-cha-r-office-two-person-search-plan', 'event:luini-probes-cha-r-office-through-opening', 'event:luini-directly-confronts-troupe'],
    }),
  ]),
  'organization:phantom-troupe': freeze([
    state({
      organizationId: 'organization:phantom-troupe',
      operationalState: 'Nobunaga, Phinks, and Feitan remain together at the Cha-R Tier 5 office while discussing a possible two-person search rotation involving Franklin. Luini then probes the office through spatial openings and directly confronts the three. Nobunaga draws his katana and threatens Luini, but no later combat outcome is part of Chapter 392.',
      authority: 'The three members coordinate autonomously within Chrollo’s larger Hisoka-search objective; Chapter 392 does not show a new direct order from Chrollo.',
      territoryIds: ['location:black-whale:tier-5'],
      objectiveStates: ['Continue the Hisoka search without losing patience.', 'Assess and respond to Heil-Ly’s hitman/spatial threat.', 'Use the Cha-R position without accepting Luini’s characterization of the Troupe’s motives.'],
      pressure: ['Luini can contact/probe the office through spatial openings.', 'Cha-R personnel at the office cannot use Nen and are vulnerable.', 'Ken’i is simultaneously considering how to use Hisoka against both Heil-Ly and the Troupe.', 'Luini remains alive at the end of Chapter 392.'],
      relatedEventIds: ['event:troupe-cha-r-office-two-person-search-plan', 'event:luini-probes-cha-r-office-through-opening', 'event:luini-directly-confronts-troupe'],
    }),
  ]),
});
