const freeze = (value) => Object.freeze(value);

export const abilityKnowledge413Overrides = freeze({
  'ability:combo-master': freeze([
    freeze({
      id: 'ability-knowledge:combo-master:413',
      abilityName: 'Combo Master',
      chapterRange: freeze({ start: 413, end: 413 }),
      knowledgeState: 'name and owner confirmed; mechanics unavailable in supplied synopsis',
      certainty: 'confirmed-name-owner-only',
      summary: 'Chapter 413 introduces Combo Master as Furykov’s Nen ability. The supplied synopsis says the ability is explained but does not reproduce that explanation, so the maintained archive does not infer or import its mechanics.',
      mechanics: freeze({
        activation: 'Unknown at the Chapter 413 supplied-source boundary.',
        conditions: freeze([]),
        limitations: freeze(['No activation rule, effect, valid target, range, duration, cost, restriction, or failure state is available in the supplied synopsis.', 'Chapter 415 or outside explanations are not imported backward into Chapter 413.']),
        costs: freeze([]),
        targets: freeze(['unknown']),
        range: 'unknown',
        duration: 'unknown',
        knownUses: freeze(['No mechanical use is established in the supplied Chapter 413 synopsis.']),
      }),
      sourceIds: freeze(['source:chapter-413']),
    }),
  ]),
  'ability:secret-window': freeze([
    freeze({
      id: 'ability-knowledge:secret-window:413',
      abilityName: 'Secret Window',
      chapterRange: freeze({ start: 413, end: 413 }),
      knowledgeState: 'extended inherited use exposes Musse’s pre-death visual knowledge',
      certainty: 'confirmed chapter-specific expansion / broader limits unresolved',
      summary: 'Benjamin uses the inherited Secret Window to monitor Camilla. Chapter 413 states that extended use now lets Benjamin access what Musse had seen before death, allowing Benjamin to know Camilla is a counteractive-type Nen user.',
      mechanics: freeze({
        activation: 'Benjamin activates inherited Secret Window through Benjamin Baton while monitoring Camilla.',
        conditions: freeze(['The chapter attributes the new pre-death visual-knowledge access to extended use of the inherited ability.']),
        limitations: freeze(['The supplied synopsis does not define how much pre-death memory is retained, whether all prior visual information is accessible, or whether the effect generalizes to every inherited ability.', 'Range, duration, targeting, and retention edge cases remain unresolved.']),
        costs: freeze([]),
        targets: freeze(['Camilla Hui Guo Rou in the demonstrated Chapter 413 use']),
        range: 'remote surveillance; exact range unresolved',
        duration: 'active observation window unresolved',
        knownUses: freeze(['Chapter 413: Benjamin observes Camilla and draws on what Musse had seen before death to know her counteractive Nen classification.']),
      }),
      sourceIds: freeze(['source:chapter-413']),
    }),
  ]),
});

export const nenSystemProfile413Corrections = freeze({});
