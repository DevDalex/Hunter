const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-407']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:407`,
  organizationId,
  chapterRange: freeze({ start: 407, end: 407 }),
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

export const organizationState407Corrections = freeze({
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'The Tier 2 hideout is active and contains Borksen after her unexplained disappearance from the funeral-security period. Morena personally conducts a coercive recruitment negotiation, explains the full parent-child card-game setup, promises not to cheat, and accepts Borksen’s condition that Borksen controls which face-down child card is selected. Chapter 407 does not reveal who executed the capture or how it was done.',
    authority: 'Morena exercises direct leadership over the recruitment room; Borksen reads the surrounding members’ deference as evidence of Morena’s absolute authority.',
    territoryIds: ['location:black-whale:tier-2:heil-ly-hideout'],
    objectiveStates: ['Recruit Borksen as an ally for a reason not yet substantively disclosed in Chapter 407.', 'Conduct the negotiation game under the explained rules and Borksen’s accepted selection modification.', 'Maintain the concealed Tier 2 hideout.'],
    pressure: ['Borksen is unwilling to answer immediately and actively analyzes the rules for traps.', 'The longer the exchange continues, Morena says the situation becomes more dangerous for both sides.', 'Borksen’s soldier friends know she is missing, although they do not know her location or the actual capture mechanism.'],
    relatedEventIds: ['event:chapter407-borksen-wakes-tier2-heilly-hideout', 'event:chapter407-morena-recruits-borksen-compatible-donor-analogy', 'event:chapter407-borksen-condition-accepted-game-begins'],
    certainty: 'hideout/recruitment/game setup confirmed / capture executor and method unresolved / Chapter 408 substantive answers quarantined',
  })]),
});
