const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const abilityKnowledge387Overrides = freeze({
  'ability:parallel-future': freeze([
    freeze({
      id: 'ability-knowledge:parallel-future:387',
      chapterRange: freeze({ start: 387, end: 387 }),
      knowledgeState: 'documented',
      certainty: 'confirmed',
      summary: 'Chapter 387 explicitly reveals Parallel Future’s core working model from Tserriednich’s perspective: eyes-closed Zetsu produces a vision ten seconds ahead; maintaining the state lets that future vision continue while real time advances, and Tserriednich can diverge his actual actions while the demonstrated observer continues perceiving the forecast version.',
      mechanics: freeze({
        activation: 'In the demonstrated sequence Tserriednich closes his eyes and fully enters Zetsu; static appears before the ten-second-ahead vision begins.',
        conditions: freeze([
          'Eyes are closed during the demonstrated activation and continuing future-view state.',
          'Tserriednich fully suppresses his aura with Zetsu before the vision begins.',
          'Maintaining the eyes-closed Zetsu state allows the future vision to continue beyond the initial ten-second preview.',
        ]),
        limitations: freeze([
          'Chapter 387 does not supply an ultimate maximum duration for continuous viewing.',
          'The chapter demonstrates the observer-perception/divergence behavior with Theta but does not enumerate every possible multi-observer configuration.',
          'The chapter does not define every interaction with other Nen abilities.',
        ]),
        costs: freeze([
          'The demonstrated activation requires Zetsu, suppressing Tserriednich’s ordinary aura output while he maintains the state.',
        ]),
        targets: freeze(['self perception', 'future sequence involving surrounding events']),
        range: 'not separately quantified at Chapter 387 boundary',
        duration: 'ten-second forecast lead; continuous viewing can persist beyond the initial ten seconds while the required state is maintained, with no maximum supplied',
        knownUses: freeze([
          'Tserriednich recognizes the first vision as ten seconds ahead when Theta repeats the forecast dialogue.',
          'His initial concern about having to remain defenseless for ten seconds is a provisional hypothesis that is superseded by the next experiment rather than a final ability limitation.',
          'He keeps Zetsu after the first ten seconds and simultaneously senses present Theta while visually watching the future Theta ten seconds ahead.',
          'He changes his actual behavior from the forecast during the coffee-cup experiment while Theta continues reacting to the forecast version of him.',
          'He sees Theta draw her gun in the future sequence, moves his actual body away from the forecast position, and survives while Theta fires at the forecast version she perceives.',
        ]),
      }),
      sourceIds: freeze([chapterSourceId(387)]),
    }),
  ]),
});
