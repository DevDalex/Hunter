import { abilityKnowledge412OverridesBase, nenSystemProfile412CorrectionsBase } from './nenSystemFoundation412CorrectionsBase.js';
import { abilityKnowledge413Overrides, nenSystemProfile413Corrections } from './nenSystemFoundation413Corrections.js';

const abilityIds = new Set([...Object.keys(abilityKnowledge412OverridesBase), ...Object.keys(abilityKnowledge413Overrides)]);

export const abilityKnowledge412Overrides = Object.freeze(Object.fromEntries(
  [...abilityIds].map((abilityId) => [abilityId, Object.freeze([
    ...(abilityKnowledge412OverridesBase[abilityId] || []),
    ...(abilityKnowledge413Overrides[abilityId] || []),
  ])]),
));

export const nenSystemProfile412Corrections = Object.freeze({
  ...nenSystemProfile412CorrectionsBase,
  ...nenSystemProfile413Corrections,
});
