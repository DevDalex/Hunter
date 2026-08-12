const freeze = (value) => Object.freeze(value);

// Chapter 410 modernization exposes an old temporal leak in Benjamin's base
// profile: the generic Chapter 358 state was open-ended and could become the
// latest explicit state again after the exact 403–410 records stopped. Replace
// that same state id with a bounded 358–402 record. Chapter 403 onward is owned
// by exact chapter states / bounded continuity bridges, and later imported
// status can therefore fall back without mixing an old "alive" record with a
// later deceased character status.
export const characterState410LegacyClosures = freeze({
  'character:benjamin-hui-guo-rou': freeze([
    freeze({
      id: 'character-state:benjamin-hui-guo-rou:358',
      characterId: 'character:benjamin-hui-guo-rou',
      chapterRange: freeze({ start: 358, end: 402 }),
      life: 'alive',
      bodyState: 'living body',
      consciousnessState: 'active in own body',
      operationalState: 'Commands the First Prince faction, private army, surveillance network, and succession operations through the Chapter 402 boundary. Chapter 403 and later developments are owned by exact chapter states and bounded continuity records.',
      protectionState: 'Protected by the strongest formal military command network among the princes.',
      threatLevel: 'existential',
      nenKnowledge: 'experienced Nen user and beneficiary of the Benjamin Baton inheritance system',
      allegianceState: 'First Prince household and Benjamin Private Army command structure.',
      locationId: 'location:black-whale:tier-1:room-1001',
      openQuestions: freeze(['Chapter 403+ Benjamin developments are governed by their own chapter-bounded records.']),
      certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-358', 'source:chapter-361', 'source:chapter-389', 'source:chapter-402']),
    }),
  ]),
});
