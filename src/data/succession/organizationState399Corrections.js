const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-399';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:399`,
  organizationId,
  chapterRange: freeze({ start: 399, end: 399 }),
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

export const organizationState399Corrections = freeze({
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'The concealed Tier 3 base is now directly penetrated by Hinrigh and Nobunaga. Nine Heil-Ly members are encountered together in a defended internal room; Terebellum exposes Damage: “Sweet Home” and Yokotani activates A Battle of Wits: “LSDF”. The defense successfully expels the intruders, but Hinrigh leaves the Biohazard transmitter hidden under a laundry-room cabinet. LSDF’s location restriction establishes Morena somewhere within this hideout/complex, while the exact Room 3101 route operator, member-only route, Morena’s room, and “organ” role remain unresolved.',
    authority: 'Morena remains Heil-Ly boss. Yokotani and Terebellum operate as local defenders under previously established community orders; Chapter 399 does not show Morena personally directing the confrontation in real time.',
    territoryIds: ['location:black-whale:tier-3:heil-ly-hideout', 'location:black-whale:tier-3:heil-ly-hideout:laundry-room', 'location:black-whale:tier-3:heil-ly-hideout:gathering-defense-room', 'location:black-whale:tier-3:room-3101'],
    objectiveStates: ['Expel law-breaking intruders from the hideout using Yokotani’s LSDF defense.', 'Protect Heil-Ly personnel through Terebellum’s damage-transfer support and the concealed spatial network.', 'Keep the base and Morena’s exact position concealed.', 'Preserve special assignments such as Perigord’s unresolved “organ” role.'],
    pressure: ['Hinrigh and Nobunaga have seen nine members and two personal abilities inside the base.', 'A hidden transmitter has been left inside the laundry room without the defenders noticing in the supplied scene.', 'Xi-Yu and the Phantom Troupe now plan coordinated follow-up searches.', 'The Room 3101 route has been operationally mapped in both directions by the intruders, though its operator and member-only access remain unresolved.'],
    relatedEventIds: ['event:main-door-reveals-nine-heilly-members', 'event:terebellum-protects-yokotani-sweet-home-revealed', 'event:yokotani-activates-lsdf-seven-guards-alert4', 'event:lsdf-max-alert-restrains-expels-nobunaga', 'event:hinrigh-hides-oyster-transmitter-in-laundry', 'event:oyster-beeps-final-morena-kikan-caution'],
  })]),
  'organization:xi-yu': freeze([state({
    organizationId: 'organization:xi-yu',
    operationalState: 'Hinrigh personally infiltrates the Heil-Ly base with Nobunaga, learns Terebellum and Yokotani’s defensive abilities, hides the tracking transmitter inside, returns to Room 3101 alive, and shifts Xi-Yu into an information-consolidation phase. He plans to estimate the hideout on the ship floor plan, produce member descriptions, find witnesses, narrow Heil-Ly’s activity area, and gather Xi-Yu personnel for intelligence.',
    authority: 'Hinrigh remains Xi-Yu underboss directing the field investigation. His Biohazard is unavailable for the rest of that day by his own statement, and his carried knives are exhausted.',
    territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:room-3101'],
    objectiveStates: ['Use the hidden transmitter to help localize the Heil-Ly base.', 'Map the base against the Black Whale floor plan.', 'Create descriptions of the observed members and locate witnesses.', 'Consolidate Xi-Yu information while the Phantom Troupe handles the transmitter search.'],
    pressure: ['Hinrigh cannot use Biohazard again for the remainder of the day.', 'Hinrigh has exhausted his knife supply.', 'Heil-Ly possesses multiple prepared spatial/defensive Nen mechanisms.', 'The exact base coordinate, route operator, member-only access, Morena capability set, and “organ” role remain unresolved.'],
    relatedEventIds: ['event:hinrigh-hides-oyster-transmitter-in-laundry', 'event:hinrigh-returns-biohazard-unavailable-knives-spent', 'event:xiyu-troupe-divide-heilly-search-work', 'event:oyster-beeps-final-morena-kikan-caution'],
  })]),
  'organization:phantom-troupe': freeze([state({
    organizationId: 'organization:phantom-troupe',
    operationalState: 'Nobunaga joins Hinrigh in the direct base confrontation, probes Terebellum and Yokotani’s defenses, is restrained and expelled by LSDF, returns to Room 3101, and uses the experience to clarify the operational two-way route. After reuniting with Hinrigh, he assigns the Phantom Troupe to search for the hidden transmitter while Xi-Yu handles broader floor-plan and witness intelligence.',
    authority: 'Nobunaga acts as the shown Troupe field representative in the Chapter 399 hideout operation. No new command from Chrollo is supplied in this chapter.',
    territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:room-3101'],
    objectiveStates: ['Search for Hinrigh’s hidden transmitter and use it to locate the Heil-Ly base.', 'Continue the anti-Heil-Ly operation while respecting the newly demonstrated defensive conditions.', 'Use the Room 3101 ↔ hideout route knowledge without assuming the proposed member-only jump point has been found.', 'Continue the broader Troupe agenda; Chapter 399 does not state that other objectives have ended.'],
    pressure: ['Terebellum’s Sweet Home is a poor direct matchup for simple cutting attacks when its conditions are satisfied.', 'Yokotani’s LSDF guards neutralize direct attacks under their law-conditioned defense.', 'The route’s operator and member-only access remain unknown.', 'The Troupe is relying on a transmitter that remains inside enemy territory and is still transformed at the chapter endpoint.'],
    relatedEventIds: ['event:terebellum-protects-yokotani-sweet-home-revealed', 'event:yokotani-activates-lsdf-seven-guards-alert4', 'event:lsdf-max-alert-restrains-expels-nobunaga', 'event:nobunaga-room3101-two-way-route-analysis', 'event:xiyu-troupe-divide-heilly-search-work'],
  })]),
});
