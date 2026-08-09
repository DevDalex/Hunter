const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const guardianBeastState385Corrections = freeze({
  'guardian-beast:tserriednich': freeze([
    freeze({
      id: 'guardian-beast-state:tserriednich:385',
      beastId: 'guardian-beast:tserriednich',
      chapterRange: freeze({ start: 385, end: 385 }),
      knowledge: 'Zetsu disappearance and deception escalation observed',
      operationalState: 'Tserriednich’s Guardian Spirit Beast gradually disappears while he sustains Zetsu, returns when Zetsu ends, and explicitly warns Theta that another deception will cause her to cease being human.',
      hostState: 'host alive and rapidly developing Zetsu',
      visibility: 'visible to eligible Nen users other than the host; absent during the observed sustained-Zetsu interval',
      knownAbilityIds: freeze(['ability:tserriednich-lie-marking-beast']),
      suspectedAbilityIds: freeze([]),
      unresolved: freeze([
        'Exact meaning and mechanism of “cease to be human”',
        'Terminal punishment after further deception',
        'Whether Salkov’s pawn-conversion hypothesis is correct',
        'Whether every use of Tserriednich’s Zetsu suppresses the beast in exactly the same way',
      ]),
      sourceIds: freeze([chapterSourceId(385)]),
      certainty: 'confirmed',
    }),
  ]),
});

export const abilityKnowledge385Overrides = freeze({
  'ability:parallel-future': freeze([
    freeze({
      id: 'ability-knowledge:parallel-future:385',
      chapterRange: freeze({ start: 385, end: 385 }),
      knowledgeState: 'partially documented',
      certainty: 'probable',
      summary: 'Chapter 385 demonstrates a Zetsu-linked temporal or causal anomaly during Theta’s attempted assassination, but does not yet establish the later complete mechanics.',
      mechanics: freeze({
        activation: 'Observed while Tserriednich maintains Zetsu with his eyes closed during Theta’s assassination attempt; the exact activation rule is not yet established at this chapter boundary.',
        conditions: freeze([
          'Tserriednich is sustaining Zetsu in the demonstrated scene.',
          'Theta fires a lethal headshot while he remains concentrated.',
        ]),
        limitations: freeze([
          'Exact duration is not established in the supplied Chapter 385 material.',
          'The chapter does not yet establish whether Theta saw a prediction, alternate sequence, altered perception, or another mechanism.',
          'The chapter does not yet establish the complete rules governing what Tserriednich or other observers perceive during the anomaly.',
        ]),
        costs: freeze([]),
        targets: freeze([]),
        range: 'unknown at Chapter 385 boundary',
        duration: 'unknown at Chapter 385 boundary',
        knownUses: freeze([
          'During Theta’s attempted assassination, Theta perceives Tserriednich shot through the head and dead; the apparent corpse disappears, Tserriednich remains alive, and a guard reports that time skipped during Melody’s performance.',
        ]),
      }),
      sourceIds: freeze([chapterSourceId(385)]),
    }),
  ]),
});
