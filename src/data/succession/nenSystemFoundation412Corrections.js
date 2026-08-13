const freeze = (value) => Object.freeze(value);

export const abilityKnowledge412Overrides = freeze({
  'ability:dowsing-chain': freeze([
    freeze({
      id: 'ability-knowledge:dowsing-chain:412',
      abilityName: 'Dowsing Chain',
      chapterRange: freeze({ start: 412, end: 412 }),
      knowledgeState: 'calibrated yes/no interrogation procedure demonstrated against Oito',
      certainty: 'confirmed demonstration / interpretation bounded',
      summary: 'Kurapika first asks baseline yes/no questions, then instructs Oito to answer “yes” regardless of truth so he can compare the chain’s swing before moving to the identity questions. The chain remains still through Oito’s later explanation, which Kurapika uses to clear her of lying.',
      mechanics: freeze({
        activation: 'Kurapika holds Dowsing Chain while establishing response baselines and then asks controlled identity/eligibility questions.',
        conditions: freeze(['Kurapika deliberately calibrates truthful and instructed-false response patterns in the demonstrated Chapter 412 use.', 'The chain response is interpreted by Kurapika in conversational context.']),
        limitations: freeze(['The chapter does not establish omniscience.', 'Bill’s pronunciation clue motivates the test but is not itself a Nen detection rule.', 'A motionless chain verifies Oito’s statements within the demonstrated procedure; later ritual or legal consequences are not automatically proven by the chain.']),
        costs: freeze([]),
        targets: freeze(['Oito’s statements about Beyond, the infant aboard, her daughter Woble, and the ceremony split']),
        range: 'close-range Room 1014 interrogation',
        duration: 'during the controlled questioning sequence',
        knownUses: freeze(['Chapter 412: Kurapika calibrates Dowsing Chain with baseline and instructed-yes questions, then observes no movement during Oito’s child-swap disclosure.']),
      }),
      sourceIds: freeze(['source:chapter-412']),
    }),
  ]),
});

export const nenSystemProfile412Corrections = freeze({});
