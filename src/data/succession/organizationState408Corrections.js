const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-408']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:408`,
  organizationId,
  chapterRange: freeze({ start: 408, end: 408 }),
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

export const organizationState408Corrections = freeze({
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'The Tier 2 recruitment room remains active as Morena advances Borksen through Aim, Power / Ability, and No?. Morena discloses her Carnival Orphan history, the group’s larger killing goal, her Contagion-style child network, an ongoing search for Specialists, and the No/X risk structure. Joker, Yes, and X are removed from Borksen’s child hand before Special Martial Law interrupts the negotiation.',
    authority: 'Morena remains the direct leader and substantive speaker. Orarge handles response-card shuffling and the surrounding Heil-Ly members follow the procedure without taking over the negotiation.',
    territoryIds: ['location:black-whale:tier-2:heil-ly-hideout'],
    objectiveStates: [
      'Recruit a Specialist whose future ability can fill a critical missing role; Morena hopes Borksen can be that recruit but says another compatible Specialist could substitute.',
      'Continue searching the Black Whale for unawakened Specialists through an unnamed Enhancer’s claimed category-detection sense of smell.',
      'Use Morena’s child/parent progression system to awaken and develop individualized Nen abilities among people sharing the larger goal.',
      'Pursue the group’s shared larger goal of killing people, while Morena separately states her personal goal of destroying Kakin and then humanity.',
    ],
    pressure: [
      'Borksen explicitly rejects Morena’s murder/destruction worldview internally and continues gathering information rather than accepting alliance.',
      'The Yes response card is removed, visibly disappointing Morena and the attendants.',
      'X is removed as the third child card, leaving No and Return and making the remaining game state sharply constrained.',
      'Special Martial Law is declared at the chapter endpoint; Chapter 408 does not supply its cause, enforcement sequence, or effect on Heil-Ly operations.',
    ],
    relatedEventIds: [
      'event:chapter408-morena-states-kakin-humanity-destruction-goals',
      'event:chapter408-contagion-mother-twenty-two-children',
      'event:chapter408-borksen-specialist-unnamed-enhancer-detector',
      'event:chapter408-orarge-shuffles-yes-revealed',
      'event:chapter408-x-third-response-no-return-remain',
      'event:chapter408-special-martial-law-declared',
    ],
    certainty: 'negotiation, disclosed objectives, specialist search and card state confirmed as supplied / unnamed detector identity and desired Borksen ability unresolved / Chapter 409+ martial-law aftermath quarantined',
  })]),
});
