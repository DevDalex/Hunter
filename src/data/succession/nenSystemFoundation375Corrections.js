const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ beastId, start, end = null, knowledge, operationalState, hostState = 'host active', visibility = 'visible to eligible Nen users other than the host', knownAbilityIds = [], suspectedAbilityIds = [], unresolved = [], sources = [], certainty = 'confirmed' }) => freeze({
  id: `guardian-beast-state:${beastId.replace('guardian-beast:', '')}:${start}`,
  beastId,
  chapterRange: freeze({ start, end }),
  knowledge,
  operationalState,
  hostState,
  visibility,
  knownAbilityIds: freeze(knownAbilityIds),
  suspectedAbilityIds: freeze(suspectedAbilityIds),
  unresolved: freeze(unresolved),
  sourceIds: freeze(sources.map(chapterSourceId)),
  certainty,
});

export const guardianBeastState375Corrections = freeze({
  'guardian-beast:camilla': freeze([
    state({ beastId: 'guardian-beast:camilla', start: 375, knowledge: 'coercive Manipulation classification and broad function revealed', operationalState: 'Camilla’s Guardian Spirit Beast is a coercive Manipulator capable of controlling a person once its conditions are fulfilled.', knownAbilityIds: ['ability:camilla-guardian-control'], unresolved: ['Activation condition', 'Range', 'Duration', 'Degree of control'], sources: [375] }),
  ]),
  'guardian-beast:tubeppa': freeze([
    state({ beastId: 'guardian-beast:tubeppa', start: 375, knowledge: 'collaborative Transmutation and drug-production function revealed', operationalState: 'Tubeppa’s Guardian Spirit Beast can produce various drugs within its body but requires a research partner to activate.', knownAbilityIds: ['ability:tubeppa-chemical-synthesis'], unresolved: ['Eligible research partner', 'Drug catalogue', 'Production cost', 'Delivery method'], sources: [375] }),
  ]),
  'guardian-beast:tyson': freeze([
    state({ beastId: 'guardian-beast:tyson', start: 375, knowledge: 'Emitter diffusive-levy eye-wog system revealed', operationalState: 'Eye-wogs attach to Book of Tyson recipients, collect aura in exchange for happiness, and scale collection with how thoroughly the host has read the book. Breaking the book’s sole taboo brings severe punishment.', knownAbilityIds: ['ability:tyson-eye-wogs'], unresolved: ['Taboo', 'Punishment', 'Complete attachment/removal rules'], sources: [375] }),
  ]),
  'guardian-beast:luzurus': freeze([
    state({ beastId: 'guardian-beast:luzurus', start: 375, end: 387, knowledge: 'Conjurer desire-trap structure revealed', operationalState: 'Luzurus’s Guardian Spirit Beast uses a pseudo-coercive trap that conjures something desired by the target and activates when the target takes the bait.', knownAbilityIds: ['ability:luzurus-guardian-trap'], unresolved: ['Target selection', 'Bait-generation limits', 'Result after activation', 'Range'], sources: [375] }),
  ]),
  'guardian-beast:halkenburg': freeze([
    state({ beastId: 'guardian-beast:halkenburg', start: 361, end: 374, knowledge: 'form and feather-mark phenomenon observed', operationalState: 'The beast accompanies Halkenburg while the exact collective effect of the follower marks remains incomplete.', unresolved: ['Mark selection', 'Collective effect'], sources: [361], certainty: 'probable' }),
    state({ beastId: 'guardian-beast:halkenburg', start: 375, end: 375, knowledge: 'Enhancer symbiotic fellowship system revealed', operationalState: 'Feather-marked people gathered around Halkenburg increase the group’s collective aura and potential, with more marked participants producing a stronger state.', knownAbilityIds: ['ability:halkenburg-guardian-marking'], unresolved: ['Mark selection rule', 'Removal rule', 'Maximum-output trigger', 'Relationship to blackout and memory-loss phenomena'], sources: [375] }),
  ]),
  'guardian-beast:marayam': freeze([
    state({ beastId: 'guardian-beast:marayam', start: 371, end: 374, knowledge: 'occupied/empty spatial split strongly associated with the household', operationalState: 'Marayam’s household occupies an inaccessible state while Hanzo observes an empty Room 1013; Kurapika suspects Nen spatial displacement and a defensive Guardian Spirit Beast mechanism.', suspectedAbilityIds: ['ability:marayam-spatial-barrier'], unresolved: ['Exact creator', 'Boundary behavior', 'Aura requirement'], sources: [371, 372, 373, 374], certainty: 'probable' }),
    state({ beastId: 'guardian-beast:marayam', start: 375, knowledge: 'one-way spatial boundary experimentally confirmed', operationalState: 'Belerainte can exit the hidden Room 1013 state but cannot see the occupants or return after leaving. Biscuit identifies a one-way Nen-space boundary and considers Marayam’s Guardian Spirit Beast the likely creator.', suspectedAbilityIds: ['ability:marayam-spatial-barrier'], unresolved: ['Definitive creator', 'Creation trigger', 'Cancellation rule', 'Selective access exceptions'], sources: [375], certainty: 'probable' }),
  ]),
});
