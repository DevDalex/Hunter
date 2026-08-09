const freeze = (value) => Object.freeze(value);

const state = ({ characterId, life = 'alive', bodyState = 'living body', consciousnessState = 'active in own body', operationalState, protectionState, threatLevel, nenKnowledge, allegianceState, openQuestions = [] }) => freeze({
  id: `character-state:${characterId.replace('character:', '')}:391`,
  characterId,
  chapterRange: freeze({ start: 391, end: 391 }),
  life,
  bodyState,
  consciousnessState,
  operationalState,
  protectionState,
  threatLevel,
  nenKnowledge,
  allegianceState,
  locationId: 'location:black-whale:tier-3',
  openQuestions: freeze(openQuestions),
  certainty: 'confirmed',
  sourceIds: freeze(['source:chapter-391']),
});

export const characterState391CorrectionProfiles = freeze({
  'character:hinrigh-biganduffno': freeze([
    state({
      characterId: 'character:hinrigh-biganduffno',
      bodyState: 'living body; left hand pierced by Padaille’s drill during the Tier 3 fight',
      operationalState: 'Runs the Xi-Yu Tier 3 field operation, separates from Lynch and Zakuro to trace Heil-Ly, deploys Biohazard for surveillance and restraint, and kills Padaille before continuing the operation.',
      protectionState: 'Operates largely alone during the Heil-Ly pursuit but has Biohazard-transformed pigeons and Xi-Yu field support elsewhere on Tier 3.',
      threatLevel: 'high',
      nenKnowledge: 'Confirmed Biohazard user; demonstrates camcorder-cat surveillance and aura-reinforced handcuff-pigeon restraint. His Nen category and full ability limits remain unspecified in the supplied synopsis.',
      allegianceState: 'Xi-Yu underboss executing Onior’s Hisoka/Morena operation.',
      openQuestions: ['What exact task is Hinrigh relying on Misha to perform?', 'How serious or lasting is the left-hand injury?'],
    }),
  ]),
  'character:tevelares': freeze([
    state({
      characterId: 'character:tevelares',
      operationalState: 'Identified as a level 24 Heil-Ly member and civil engineer. Participates in the attempted attack on Hinrigh, fires at Biohazard pigeons, then escapes after Padaille is killed and proposes seeking Morena’s instructions.',
      protectionState: 'Acts with Quorolle and Padaille during the confrontation; retreats with Quorolle after Padaille’s death.',
      threatLevel: 'high',
      nenKnowledge: 'Enhancer; level 24 within Morena’s Contagion progression system. No personal named ability is demonstrated in the supplied Chapter 391 synopsis.',
      allegianceState: 'Heil-Ly / Morena’s Contagion community.',
      openQuestions: ['What personal ability, if any, has Tevelares developed?', 'What instructions will Morena give after the retreat?'],
    }),
  ]),
  'character:quorolle': freeze([
    state({
      characterId: 'character:quorolle',
      operationalState: 'Identified as a level 22 Heil-Ly member and repairman. Participates in the attempted attack on Hinrigh, fires at Biohazard pigeons, then escapes with Tevelares and agrees to seek Morena’s instructions.',
      protectionState: 'Acts with Tevelares and Padaille during the confrontation; retreats with Tevelares after Padaille’s death.',
      threatLevel: 'high',
      nenKnowledge: 'Emitter; level 22 within Morena’s Contagion progression system. His claim that Morena can probably tell what members are doing at all times is treated as his inference rather than confirmed system knowledge.',
      allegianceState: 'Heil-Ly / Morena’s Contagion community.',
      openQuestions: ['What personal ability, if any, has Quorolle developed?', 'Can Morena actually monitor Contagion members continuously?'],
    }),
  ]),
  'character:padaille': freeze([
    state({
      characterId: 'character:padaille',
      life: 'dead',
      bodyState: 'deceased after Hinrigh forces Padaille’s own axe-form hand into the back of his head',
      consciousnessState: 'ended; no continuing consciousness is established in the supplied Chapter 391 synopsis',
      operationalState: 'Level 29 Heil-Ly demolition worker and Conjurer who attacks Hinrigh with Fistful of Weapons, demonstrates hammer, drill, and axe forms, and is killed during the same fight.',
      protectionState: 'Initially supported by Tevelares and Quorolle, who later retreat and leave him to the confrontation.',
      threatLevel: 'resolved by death',
      nenKnowledge: 'Confirmed Conjurer and user of Fistful of Weapons. Hammer, drill, and axe forms are demonstrated; the complete weapon catalogue and costs remain unresolved.',
      allegianceState: 'Heil-Ly / Morena’s Contagion community; Padaille explicitly states he will kill for Morena’s sake and his own.',
      openQuestions: ['The complete mechanics and possible forms of Fistful of Weapons remain unresolved despite the user’s death.'],
    }),
  ]),
});
