const freeze = (value) => Object.freeze(value);
const range415 = freeze({ start: 415, end: 415 });
const sourceIds = freeze(['source:chapter-415']);

export const abilityKnowledge415Overrides = freeze({
  'ability:combo-master': freeze([freeze({
    id: 'ability-knowledge:combo-master:415',
    abilityName: 'Combo Master',
    chapterRange: range415,
    knowledgeState: 'conjured laptop interface and curse-analysis functions demonstrated',
    certainty: 'confirmed',
    summary: 'Furykov activates Combo Master and conjures a laptop-like interface that warns he is under attack, identifies a curse, shows another affected person only as a silhouette, supports investigation, and returns curse-specific deciphering and antidote-development estimates.',
    mechanics: freeze({
      activation: 'Furykov activates the ability and a laptop conjures between his hands.',
      conditions: freeze(['Chapter 415 demonstrates analysis of the active curse affecting Furykov.']),
      limitations: freeze(['The fellow cursee remains visually obscured.', 'The 365-day deciphering figure and approximately 700 additional days to create and conjure an antidote apply to this detected curse only.', 'Complete menus, universal scan range, universal curse rules, and the eventual investigation result remain unknown.', 'No Chapter 416+ information is imported.']),
      costs: freeze([]),
      targets: freeze(['Furykov’s detected curse', 'the unidentified linked cursee / curse-target investigation']),
      range: 'not fully established',
      duration: 'interface persists during the demonstrated analysis; complete duration rule unknown',
      knownUses: freeze(['Chapter 415 pre-voyage: detects the curse and linked silhouette.', 'Chapter 415 pre-voyage: returns 365-day deciphering and approximately 700-day antidote-development estimates for this curse.']),
    }),
    sourceIds,
  })]),
});

export const nenSystemProfile415Corrections = freeze({});
