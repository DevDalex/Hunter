const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityName = null, knowledgeState = 'documented', certainty = 'confirmed', summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], sources = [393] }) => freeze({
  id,
  abilityName,
  chapterRange: freeze({ start: 393, end: 393 }),
  knowledgeState,
  certainty,
  summary,
  mechanics: freeze({
    activation,
    conditions: freeze(conditions),
    limitations: freeze(limitations),
    costs: freeze(costs),
    targets: freeze(targets),
    range,
    duration,
    knownUses: freeze(knownUses),
  }),
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const abilityKnowledge393Overrides = freeze({
  'ability:contagion': freeze([
    knowledge({
      id: 'ability-knowledge:contagion:393',
      knowledgeState: 'ability-development threshold and innate-type discussion expanded',
      summary: 'Chapter 393 retains Contagion’s established leveling system and adds Heil-Ly members discussing the need to reach level 21 in order to develop abilities. The group also recalls Morena teaching that each person has an innate Nen type, so Matvere cannot simply choose to become an Emitter.',
      activation: 'Morena’s existing Contagion community governs member progression; Chapter 393 focuses on members approaching the ability-development threshold and designing abilities around their innate types and matchup needs.',
      conditions: ['Heil-Ly members discuss raising their levels to 21 in order to develop abilities.', 'The members state that Nen type is innate rather than freely chosen.', 'Morena coaches members to analyze opponents and develop useful restrictions/counters.'],
      limitations: ['Chapter 393 does not change the previously documented Nen-user kill value or resolve multi-attacker reward allocation.', 'The chapter does not establish that every member develops an ability in the same form or at the same pace once level 21 is reached beyond the members’ stated system understanding.', 'Morena’s hypothetical example of an ability that reports the number of hits needed to defeat an enemy is design advice, not an actual ability.', 'Gelato’s actual Nen type remains unrevealed because she declines Morena’s offer to tell her.'],
      targets: ['Heil-Ly Contagion members participating in the leveling and ability-development system'],
      range: 'community-system range unresolved',
      duration: 'ongoing community progression',
      knownUses: ['Chapter 391: members state that killing a Nen user is worth ten levels.', 'Chapter 393: members discuss reaching level 21 for ability development and innate Nen type as a constraint on design.'],
      sources: [378, 391, 393],
    }),
  ]),
  'ability:luini-transportation': freeze([
    knowledge({
      id: 'ability-knowledge:luini-transportation:393',
      abilityName: 'Luini transportation ability',
      knowledgeState: 'living user killed / type remains unresolved',
      summary: 'By Chapter 393, Luini’s earlier sealed-room/marked-location spatial transportation mechanics and Chapter 392 Cha-R office openings remain documented, but Nobunaga kills Luini. Perigord’s belief that Luini was an Emitter is retained only as character inference.',
      activation: 'Earlier maintained chapters establish Luini’s sealed one-door room and marked-location travel setup.',
      conditions: ['The earlier disclosed hub requires a sealed room with exactly one door.', 'Marked-location travel and return to the sealed hub were previously demonstrated.'],
      limitations: ['Luini’s official ability name and confirmed Nen type remain unknown.', 'Perigord’s Emitter judgment is not upgraded to canon classification.', 'No post-mortem continuation is established after Luini’s death.', 'Maximum range, marking procedure, capacity, and remaining restrictions are unresolved.'],
      targets: ['Luini / routes between his prepared spatial hub and marked locations'],
      range: 'unknown',
      duration: 'living operation ends with Luini’s Chapter 393 death; no post-mortem persistence established',
      knownUses: ['Chapter 379: marked-location spatial travel from a sealed one-door hub.', 'Chapter 392: openings into the Cha-R office.', 'Chapter 393: Luini is killed before further use is established.'],
      sources: [379, 392, 393],
    }),
  ]),
  'ability:voconte-door-ability': freeze([
    knowledge({
      id: 'ability-knowledge:voconte-door-ability:393',
      abilityName: 'Voconte’s Door Ability',
      knowledgeState: 'existence and proposed trap use known / complete mechanics unresolved',
      summary: 'Chapter 393 identifies Voconte as a level 26 Emitter and records his proposal to use an unnamed door ability to catch prey who wander into a trap. The technique itself is not automatically classified as Emission merely because Voconte’s natural type is Emitter.',
      activation: 'Unsupplied. Voconte discusses the ability as a trap option rather than performing a full activation sequence in the supplied synopsis.',
      conditions: ['Voconte proposes catching prey that enter a prepared trap.', 'Voconte’s natural Nen type is confirmed as Emitter.'],
      limitations: ['Official ability name and ability-specific Nen category are unsupplied.', 'Door creation/placement, trigger, route or capture mechanism, valid surfaces, range, duration, target limits, aura cost, and reset conditions remain unresolved.', 'The archive does not infer Emission classification from the owner’s natural type alone.'],
      targets: ['prey entering the proposed trap'],
      range: 'unknown',
      duration: 'unknown',
      knownUses: ['Chapter 393: Voconte proposes the door ability as a way to catch prey; no complete use is demonstrated.'],
    }),
  ]),
  'ability:body-and-soul': freeze([
    knowledge({
      id: 'ability-knowledge:body-and-soul:393',
      knowledgeState: 'Chapter 392 identity-check and unresolved counter retained / no new activation',
      summary: 'Lynch is alive in Chapter 393 and recounts the prior encounter, but Body and Soul receives no new activation or mechanic. The successful Hanal identity check and unresolved Chapter 392 counter case remain the latest demonstrated information.',
      activation: 'The demonstrated uses combine Lynch asking a question with a close-range punch.',
      conditions: ['Chapter 393 contains aftermath discussion rather than a new use.'],
      limitations: ['The reason the prior apparent-Hisoka attempt failed remains unresolved.', 'The objective identity of that target remains unresolved within the Chapter 393 boundary.', 'Nen category and complete counter/resistance rules remain unknown.'],
      targets: ['close-range questioned targets'],
      range: 'close-range physical strike / maximum range unresolved',
      duration: 'immediate answer sequence in demonstrated successful uses',
      knownUses: ['Chapter 392: Hanal inner-soul negative identity answer.', 'Chapter 392: apparent-Hisoka attempt followed by Lynch being countered.', 'Chapter 393: Lynch recovers; no new activation occurs.'],
      sources: [390, 392],
    }),
  ]),
});
