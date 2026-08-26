const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-409']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:409`,
  organizationId,
  chapterRange: freeze({ start: 409, end: 409 }),
  status,
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds,
});

export const organizationState409Corrections = freeze({
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'Heil-Ly continues Morena’s Borksen recruitment game during Special Martial Law from a hidden base confirmed to lie between Tiers 2 and 3. Morena discloses the three conditions for full joining, completes the kiss condition with Borksen, answers Question A, confirms five hideout entrances and twenty-one current members, and reaches an endpoint where Borksen intentionally restores Yes after surviving with Return.',
    authority: 'Morena remains the direct leader and substantive speaker. Orarge handles shuffling and presentation of response cards, while five surrounding Heil-Ly members observe and react under Morena’s lead.',
    territoryIds: ['location:black-whale:intertier-2-3:heil-ly-hideout'],
    objectiveStates: [
      'Continue recruiting Borksen as a strategically valuable Specialist candidate through the negotiated game rather than forced completion of the three joining conditions.',
      'Maintain the hidden inter-tier base during Special Martial Law.',
      'Preserve the Contagion community and its broader killing/progression objective while Morena’s personal destruction goal remains unchanged.',
      'Complete all required joining conditions before treating Borksen as a full Heil-Ly member.',
    ],
    pressure: [
      'Special Martial Law creates direct military-police pressure and closes the central gate between Tiers 2 and 3.',
      'Question A exposes sensitive intelligence to Borksen: the base is between Tiers 2 and 3, has five entrances, and the group currently has twenty-one members.',
      'Morena confirms she is the only Specialist in the current twenty-one-member group, at least one Enhancer exists, and she does not know all twenty other members’ abilities.',
      'Borksen completes the kiss condition and intentionally restores Yes, but the synopsis does not show the murder-presence condition required for completed joining.',
    ],
    relatedEventIds: [
      'event:chapter409-three-heilly-joining-conditions',
      'event:chapter409-kiss-condition-completed',
      'event:chapter409-central-gate-rumble-intertier-location-confirmed',
      'event:chapter409-five-hideout-doors-confirmed',
      'event:chapter409-heilly-current-headcount-twenty-one',
      'event:chapter409-heilly-nen-type-breakdown',
      'event:chapter409-borksen-intentionally-chooses-yes',
    ],
    certainty: 'inter-tier base, five entrances, twenty-one-member headcount, partial Nen-type breakdown, kiss and intentional Yes confirmed / full Borksen membership, awakening, exact entrance topology and Chapter 410 outcome unresolved',
  })]),
});
