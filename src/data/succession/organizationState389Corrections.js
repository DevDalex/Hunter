const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ organizationId, start, end = null, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', sources = [] }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:${start}`,
  organizationId,
  chapterRange: freeze({ start, end }),
  status: 'active',
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const organizationState389Corrections = freeze({
  'organization:camilla-private-guard': freeze([
    state({
      organizationId: 'organization:camilla-private-guard',
      start: 358,
      end: 388,
      operationalState: 'Protects Camilla through her private household guard structure while the prince pursues succession operations and later remains confined after the Musse incident.',
      authority: 'Second Prince household command and private-guard loyalty operating inside the Kakin royal structure.',
      territoryIds: ['location:black-whale:tier-1:room-1002'],
      objectiveStates: ['Protect Camilla.', 'Preserve the Second Prince household’s operational capacity during Camilla’s confinement.'],
      pressure: ['Camilla’s detention separates the prince from parts of her network.', 'The complete abilities and intentions of several private soldiers remain unrevealed before Chapter 389.'],
      sources: [358, 373],
    }),
    state({
      organizationId: 'organization:camilla-private-guard',
      start: 389,
      end: 410,
      operationalState: 'Chapter 389 discloses an organized Have-Not curse-assassination network inside Camilla’s private army, with individual curse bearers assigned to rival princes, a Nen exorcist held in reserve, and target-specific preparation already under way.',
      authority: 'Camilla’s household command is reinforced by Have-Not loyalty created after she admitted the caste into her personal army, provided housing, and granted military-equivalent status and rights.',
      territoryIds: ['location:black-whale:tier-1:room-1002'],
      objectiveStates: ['Protect Camilla.', 'Prepare assigned post-mortem curses against rival princes.', 'Investigate enemy Nen exorcism capability.', 'Create opportunities for curse bearers to approach assigned targets.'],
      pressure: ['Prince Guardian Spirit Beasts complicate close-proximity suicide attacks.', 'Enemy or Hunter Association exorcists may neutralize curses.', 'Sarahell has only planned, not yet executed, her Room 1014 approach at this boundary.'],
      relatedEventIds: ['event:camilla-have-not-curse-network-disclosure', 'event:have-not-curse-ritual-and-woble-plan'],
      sources: [389],
    }),
    state({
      organizationId: 'organization:camilla-private-guard',
      start: 411,
      operationalState: 'Later maintained records advance the Have-Not curse operation into the expanded Room 1014 class, with Sarahell present as a concealed threat to Woble while Camilla’s broader private-guard network remains active.',
      authority: 'Camilla’s household command persists through loyal guards and curse bearers despite her confinement.',
      territoryIds: ['location:black-whale:tier-1:room-1002', 'location:black-whale:tier-1:room-1014'],
      objectiveStates: ['Execute assigned curses against rival princes.', 'Preserve concealment until proximity and death conditions can be met.', 'Continue Camilla’s succession strategy outside detention.'],
      pressure: ['Room 1014 is increasingly Nen-aware and difficult to infiltrate.', 'Curse success still depends on target access, death conditions, and counter-exorcism risk.'],
      relatedEventIds: ['event:sarahell-curse-infiltration'],
      sources: [411, 412, 413],
    }),
  ]),
  'organization:restricted-voyage-permit-agency': freeze([
    state({
      organizationId: 'organization:restricted-voyage-permit-agency',
      start: 389,
      operationalState: 'Its special task force executes the Chapter 389 custody action against Halkenburg, with five members arriving to take the prince into custody pending trial.',
      authority: 'Voyage-related legal and custodial authority as demonstrated by the Chapter 389 arrest operation; the supplied synopsis does not define the agency’s complete jurisdictional structure.',
      territoryIds: ['location:black-whale:tier-1'],
      objectiveStates: ['Carry out Halkenburg’s custody operation.', 'Transfer the case into the trial process.'],
      pressure: ['Balsamilco expects evidence may be insufficient to keep Halkenburg detained permanently.', 'Royal status and Nen uncertainty complicate ordinary custody.'],
      relatedEventIds: ['event:restricted-voyage-agency-arrests-halkenburg'],
      sources: [389],
    }),
  ]),
});
