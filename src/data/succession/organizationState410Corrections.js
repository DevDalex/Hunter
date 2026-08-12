const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-410']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:410`,
  organizationId,
  chapterRange: freeze({ start: 410, end: 410 }),
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

export const organizationState410Corrections = freeze({
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'Heil-Ly processes Borksen’s restored Yes under Morena’s negotiation-game anti-cheating rule. Morena explains that Borksen’s marked Return triggered automatic Manipulation restricting her to Yes or No, welcomes Borksen onto Heil-Ly’s side, installs/continues the tracked game state, and leaves Borksen at Level 0 until the murder-presence condition is fulfilled. The group remains based in the hidden inter-tier space while Tier 3 military investigators escalate a suspected Heil-Ly Case S around Room 3101.',
    authority: 'Morena remains the direct leader, game administrator and recruitment authority. The five Heil-Ly observers return for Borksen’s forced confirmation and applaud after she reaffirms Yes; Orarge remains part of the recruitment procedure.',
    territoryIds: ['location:black-whale:intertier-2-3:heil-ly-hideout'],
    objectiveStates: [
      'Keep Borksen operationally aligned while she is still Level 0 and complete the remaining murder-presence condition before formal Level 1.',
      'Continue using Morena’s tracked recruitment/progression system while preserving the wider killing and leveling objective.',
      'Maintain hidden-base operations during Special Martial Law and increasing Tier 3 military investigation.',
      'Retain Borksen only while she remains useful; Morena explicitly warns that Heil-Ly will betray her once she is no longer useful.',
    ],
    pressure: [
      'Borksen’s final Yes is revealed to have been compelled by an anti-cheating Manipulation trigger after Morena reconstructs a marked Return-card tactic.',
      'Borksen remains internally resistant, intends to return to her original companions and requests a tour of the hideout, creating an unresolved counterintelligence risk.',
      'Morena confirms tracking of Borksen’s level, points, location and status; broader audiovisual surveillance remains Borksen’s assumption rather than a confirmed capability.',
      'Tier 3 military personnel classify Room 3101 as a supernatural Case S after three soldiers vanish and treat the broader investigation as Heil-Ly-related.',
      'Special Martial Law remains active across the ship.',
    ],
    relatedEventIds: [
      'event:chapter410-cheating-triggers-automatic-manipulation-yes-no-only',
      'event:chapter410-borksen-reaffirms-join-underlings-applaud-release',
      'event:chapter410-installed-game-tracks-level-points-location-status',
      'event:chapter410-borksen-level-zero-third-condition-incomplete',
      'event:chapter410-murder-witness-would-formalize-level-one',
      'event:chapter410-borksen-asks-tour-before-returning',
      'event:chapter410-room3101-sealed-three-soldiers-vanished',
    ],
    certainty: 'anti-cheating Manipulation, Level 0 state, confirmed tracking fields and Room 3101 investigation established / Borksen full Level 1 membership, audiovisual surveillance, counter-strategy and later military outcome unresolved',
  })]),
});
