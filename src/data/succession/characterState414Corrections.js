const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-414']);

const state = ({ characterId, operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, openQuestions = [] }) => freeze({
  id: `character-state:${characterId.replace('character:', '')}:414`,
  characterId,
  chapterRange: freeze({ start: 414, end: 414 }),
  life: 'alive',
  bodyState: 'living body',
  consciousnessState: 'active in own body',
  operationalState,
  protectionState,
  threatLevel,
  nenKnowledge,
  allegianceState,
  locationId: 'location:black-whale:tier-1',
  openQuestions: freeze(openQuestions),
  certainty: 'confirmed',
  sourceIds,
  bodyStateCode: 'living',
  identityStateCode: 'self',
  consciousnessStateCode: 'active',
});

export const characterState414CorrectionProfiles = freeze({
  'character:kanjidol': freeze([state({
    characterId: 'character:kanjidol',
    operationalState: 'Active inside Room 1007 during Benjamin’s pre-declaration operation; Ridge discovers him during the servants’ quarters incident and their confrontation begins without a Chapter 414 resolution.',
    protectionState: 'Operating inside a rival royal household; later outcome unresolved.',
    threatLevel: 'active confrontation',
    nenKnowledge: 'Nen-capable; aura use is shown, with no new named personal ability established here.',
    allegianceState: 'Benjamin-aligned operational duty.',
    openQuestions: ['What is the result of the Ridge confrontation?'],
  })]),
  'character:ridge': freeze([state({
    characterId: 'character:ridge',
    operationalState: 'Luzurus directs Ridge to keep Kanjidol occupied. Ridge reaches the servants’ quarters, challenges Kanjidol’s account, invokes possible judicial procedure, and their confrontation begins.',
    protectionState: 'Part of Luzurus’s Room 1007 protection detail during the approaching emergency regime.',
    threatLevel: 'active confrontation',
    nenKnowledge: 'Nen-capable; aura use is shown, with no named personal ability added.',
    allegianceState: 'Luzurus household protection.',
    openQuestions: ['What is the result of the Ridge–Kanjidol confrontation?'],
  })]),
  'character:yushohi': freeze([state({
    characterId: 'character:yushohi',
    operationalState: 'Waits with Chiyamasi outside Room 1009 for the Special Martial Law trigger, confirms one detected presence inside, reassesses En and Stand By Me, and receives Muteking before the planned movement.',
    protectionState: 'Muteking is active and accumulating invincibility time; expiry and later outcome are unresolved.',
    threatLevel: 'high-risk planned Room 1009 entry',
    nenKnowledge: 'Experienced Nen user; Chapter 414 preserves his self-assessed En/Gyo tradeoffs and his conclusion that Stand By Me has become operationally impractical.',
    allegianceState: 'Paired operation with Chiyamasi.',
    openQuestions: ['What happens after the planned Room 1009 movement?', 'What happens when Muteking protection ends?'],
  })]),
  'character:chiyamasi': freeze([state({
    characterId: 'character:chiyamasi',
    operationalState: 'Waits with Yushohi outside Room 1009, confirms the Special Martial Law movement trigger, and activates Muteking on Yushohi before the operation.',
    protectionState: 'No separate protection state is established for Chiyamasi at the strict Chapter 414 boundary.',
    threatLevel: 'high-risk planned Room 1009 operation',
    nenKnowledge: 'Confirmed user of Muteking; activation and accumulation of invincibility time are shown while complete limits remain unresolved.',
    allegianceState: 'Paired operation with Yushohi.',
    openQuestions: ['What are Muteking’s complete operating limits?', 'What happens after the movement trigger?'],
  })]),
});
