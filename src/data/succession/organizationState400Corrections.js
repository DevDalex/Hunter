const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-400';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:400`,
  organizationId,
  chapterRange: freeze({ start: 400, end: 400 }),
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

export const organizationState400Corrections = freeze({
  'organization:phantom-troupe': freeze([state({
    organizationId: 'organization:phantom-troupe',
    operationalState: 'Phinks and Feitan continue tracking Hinrigh’s transmitter, Nobunaga rejoins roughly ten minutes after the Chapter 399 hideout operation, and descending toward Tier 4 confirms the tracked Heil-Ly base is broadly on Tier 2. Nobunaga proposes adding Franklin because Heil-Ly’s abilities are more refined than expected, but Franklin is not shown joining. Phinks explicitly keeps finding Hisoka as the Troupe’s primary objective and treats the mafia conflict as a secondary route/security problem.',
    authority: 'The shown field decisions are made by Phinks, Feitan, and Nobunaga. No new Chapter 400 command from Chrollo is supplied.',
    territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-4'],
    objectiveStates: ['Find Hisoka as the primary Troupe objective.', 'Use the transmitter result to establish a route toward the Tier 2 Heil-Ly base.', 'Coordinate with Cha-R access where useful without entering permanent mafia allegiance.', 'Consider Franklin as reinforcement without treating the proposal as completed deployment.'],
    pressure: ['Heil-Ly possesses refined personal and prepared Nen defenses.', 'The exact Tier 2 room, full access topology, and creator/operator of the hidden space remain unresolved.', 'The Troupe’s Heil-Ly involvement risks distracting from the Hisoka search.'],
    relatedEventIds: ['event:phinks-feitan-receiver-search-en-limits', 'event:nobunaga-rejoins-ten-minutes-cha-r-route', 'event:receiver-confirms-heilly-base-tier2', 'event:troupe-mafia-custom-franklin-hisoka-priority'],
  })]),
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'The transmitter left inside the hideout allows the Troupe to confirm the concealed base’s broad physical level as Tier 2. This advances the physical-location model beyond Chapters 398–399 without resolving exact room coordinates, route topology, or spatial-system ownership. Nobunaga attributes the Nen-created space to the enemy boss, but Chapter 400 does not independently confirm Morena as the creator/operator of the hideout space, Room 3101 route, or self-restoring stage.',
    authority: 'Morena remains Heil-Ly boss. Chapter 400 does not show her directly issuing new orders in the supplied scenes.',
    territoryIds: ['location:black-whale:tier-2:heil-ly-hideout'],
    objectiveStates: ['Keep the main base and movement network concealed despite the transmitter search.', 'Continue the broader Contagion campaign and resistance to the established mafia families.', 'Prevent the Troupe/mafia coalition from converting broad Tier 2 localization into an exact breach route.'],
    pressure: ['Hinrigh’s transmitter has enabled broad Tier 2 localization.', 'The Phantom Troupe is preparing to use Cha-R access toward the upper tiers.', 'Exact ownership of the spatial systems remains unresolved and should not be collapsed into Morena personally.'],
    relatedEventIds: ['event:receiver-confirms-heilly-base-tier2', 'event:troupe-mafia-custom-franklin-hisoka-priority'],
  })]),
  'organization:kakin-justice-bureau': freeze([state({
    organizationId: 'organization:kakin-justice-bureau',
    operationalState: 'The Justice Bureau continues to hold and protect key witnesses while managing Melody’s prince requests, the Kacho-form protector, Fugetsu’s worsening condition, controlled interviews, and witness-protection contingencies. Kaiser describes the Bureau as the ship’s most neutral institution under current conditions and warns that a future Special Martial Law declaration could transfer effective control to the military.',
    authority: 'Justice officials retain operational control of witness access and interview procedure in the Chapter 400 scenes. Special Martial Law is discussed as a contingency and is not yet active.',
    territoryIds: ['location:black-whale:tier-2:justice-bureau', 'location:black-whale:tier-2:justice-bureau:interrogation-office', 'location:black-whale:tier-2:justice-bureau:witness-protection-area', 'location:black-whale:tier-2:justice-bureau:protected-quarters', 'location:black-whale:tier-2:justice-bureau:hallway', 'location:black-whale:tier-2:justice-bureau:interview-room'],
    objectiveStates: ['Maintain legal custody and witness protection.', 'Manage prince access to Melody through controlled interviews and subpoenas.', 'Protect Fugetsu while the cause of her hostile Nen condition is investigated.', 'Prepare for, but do not assume, a possible future military takeover under Special Martial Law.'],
    pressure: ['Five prince camps are seeking Melody’s performance.', 'Benjamin’s men are waiting for Melody to leave Justice protection.', 'Fugetsu requires urgent Nen-exorcism expertise.', 'A future Special Martial Law declaration could compromise institutional neutrality.'],
    relatedEventIds: ['event:without-you-kacho-form-fugetsu-king-plan', 'event:five-princes-request-melody-performance', 'event:kaiser-proposes-prince-poisoning-declares-love', 'event:kaiser-martial-law-warning-steiner-device', 'event:fugetsu-magical-worm-multiple-use-solo-return', 'event:melody-detects-fugetsu-hostile-spirits', 'event:zhang-lei-coin-vantine-negotiation-probe', 'event:melody-pauses-plan-asks-kaiser-contact-kurapika'],
  })]),
});
