const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ start, end = null, operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, locationId, openQuestions = [], sources = [start], certainty = 'confirmed' }) => freeze({
  id: `character-state:tserriednich-hui-guo-rou:${start}`,
  characterId: 'character:tserriednich-hui-guo-rou',
  chapterRange: freeze({ start, end }),
  life: 'alive',
  bodyState: 'living body',
  consciousnessState: 'active in own body',
  operationalState,
  protectionState,
  threatLevel,
  nenKnowledge,
  allegianceState,
  locationId,
  openQuestions: freeze(openQuestions),
  certainty,
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const characterState376CorrectionProfiles = freeze({
  'character:tserriednich-hui-guo-rou': freeze([
    state({
      start: 376,
      end: 376,
      operationalState: 'Continues accelerated private Nen training under Theta. Water Divination identifies him as a Specialist while his personal Hatsu remains unrevealed at the Chapter 376 boundary.',
      protectionState: 'Protected by his private guard, training staff, and restricted royal-room access.',
      threatLevel: 'extreme',
      nenKnowledge: 'newly confirmed Specialist; actively training Zetsu under Theta',
      allegianceState: 'Fourth Prince household.',
      locationId: 'location:black-whale:tier-1:room-1004',
      openQuestions: [
        'What personal Specialist ability will Tserriednich develop?',
        'What condition is attached to the wound inflicted on Theta by his Guardian Spirit Beast?',
      ],
      sources: [376],
    }),
    state({
      start: 377,
      operationalState: 'Trains privately in Nen while later chapter records progressively reveal the abilities and future-perception mechanics associated with his rapid development.',
      protectionState: 'Protected by his private guard, training staff, and restricted royal-room access.',
      threatLevel: 'extreme',
      nenKnowledge: 'rapidly developing Specialist; later mechanics remain governed by their own chapter-bounded ability and event records',
      allegianceState: 'Fourth Prince household with former Heil-Ly sponsorship separated from Morena’s breakaway faction.',
      locationId: 'location:black-whale:tier-1:room-1004',
      openQuestions: ['The full limits and reveal sequence of Tserriednich’s later Specialist abilities remain chapter-bounded.'],
      sources: [376, 383, 385, 387, 410],
      certainty: 'confirmed',
    }),
  ]),
});
