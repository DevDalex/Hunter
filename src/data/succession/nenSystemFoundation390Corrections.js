const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityId, abilityName = null, start = 390, end = null, knowledgeState = 'documented', certainty = 'confirmed', summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], sources = [390] }) => freeze({
  id,
  abilityId,
  abilityName,
  chapterRange: freeze({ start, end }),
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

export const abilityKnowledge390Overrides = freeze({
  'ability:zhang-lei-coins': freeze([
    knowledge({
      id: 'ability-knowledge:zhang-lei-coins:390',
      abilityId: 'ability:zhang-lei-coins',
      start: 390,
      end: 403,
      knowledgeState: 'partially documented',
      summary: 'By Chapter 390, Coventoba’s coin is known to have changed from 1 to 10 while still carrying the same aura he associated with the original coin, and Tenftory simultaneously holds a separate coin still displaying 1. The cause, number meaning, threshold, and eventual holder effect remain unresolved.',
      activation: 'The Guardian Spirit Beast produces numbered coins; no Chapter 390 holder-activation rule is established.',
      conditions: [
        'Coins can be held and distributed.',
        'A held coin can change its displayed number from 1 to 10.',
        'Coventoba recognizes the same aura on the changed coin.',
        'Tenftory’s separate coin remains at 1 during the Chapter 390 comparison.',
      ],
      limitations: [
        'The meaning of the number is unknown.',
        'The cause and timing rule behind the 1-to-10 change are unknown.',
        'Coventoba does not perform his proposed Guardian Spirit Beast mouth experiment, so it yields no mechanic.',
        'Zhang Lei’s idea of future public distribution after becoming King is a personal theory, not an activation rule.',
        'The eventual holder effect and activation threshold remain unresolved.',
      ],
      targets: ['coin holders; eventual effect unresolved'],
      range: 'coin-based / exact Nen range unresolved',
      duration: 'coins persist; full duration unresolved',
      knownUses: [
        'Chapter 389: Coventoba observes his earlier coin change from 1 to 10 while Tenftory receives a new coin.',
        'Chapter 390: Coventoba recognizes the same aura on the changed 10 coin while Tenftory’s separate coin still displays 1.',
      ],
      sources: [362, 376, 389, 390],
    }),
  ]),
  'ability:bloody-mary': freeze([
    knowledge({
      id: 'ability-knowledge:bloody-mary:390',
      abilityId: 'ability:bloody-mary',
      end: 390,
      knowledgeState: 'demonstrated effect / complete mechanics unresolved',
      summary: 'Zakuro’s Bloody Mary is demonstrated after a deep neck wound supplies blood; he then subdues the attacker. The complete blood-control method and Nen category are not supplied.',
      activation: 'Demonstrated after Zakuro receives a deep neck cut and has blood available.',
      conditions: ['Zakuro explicitly says he needed more blood and thanks the attacker for cutting him because he could not cut himself.'],
      limitations: ['Nen category is unknown.', 'Exact blood-control method, range, quantity limit, duration, and repeat-use rules are unknown.', 'An enemy-inflicted wound is not established as a universal requirement for every use.'],
      costs: ['The demonstrated use relies on blood from Zakuro’s injury; broader cost rules remain unresolved.'],
      targets: ['Heil-Ly opponent in the demonstrated Chapter 390 use'],
      range: 'unknown',
      duration: 'unknown',
      knownUses: ['Chapter 390: Zakuro subdues the opponent who cut his neck.'],
    }),
  ]),
  'ability:body-and-soul': freeze([
    knowledge({
      id: 'ability-knowledge:body-and-soul:390',
      abilityId: 'ability:body-and-soul',
      end: 390,
      knowledgeState: 'demonstrated interrogation / complete mechanics unresolved',
      summary: 'Lynch’s Body and Soul is demonstrated by combining a physical attack with questions and successfully obtaining basic information about Heil-Ly’s goal and Morena’s ability.',
      activation: 'The demonstrated sequence combines Lynch striking the target and asking questions through the ability.',
      conditions: ['A physical attack and questioning are both present in the demonstrated use.'],
      limitations: ['Nen category is unknown.', 'Chapter 390 does not establish universal truth compulsion.', 'Exact wording, resistance, range, duration, and repeat-use rules are unknown.'],
      targets: ['questioned opponent'],
      range: 'close-range demonstration / maximum range unresolved',
      duration: 'unknown',
      knownUses: ['Chapter 390: Lynch learns basic Heil-Ly and Morena information from an opponent.'],
    }),
  ]),
  'ability:hinrigh-object-animal-transformation': freeze([
    knowledge({
      id: 'ability-knowledge:hinrigh-object-animal-transformation:390',
      abilityId: 'ability:hinrigh-object-animal-transformation',
      abilityName: 'Hinrigh Object-to-Animal Transformation',
      end: 390,
      knowledgeState: 'demonstrated effect / formal name and full mechanics unresolved',
      summary: 'Hinrigh touches two soldiers’ guns; their barrels become live snakes whose mouths retain the guns’ firing function and kill the soldiers. The Chapter 390 synopsis supplies no formal ability name or Nen category.',
      activation: 'Hinrigh physically touches the guns before the transformation manifests.',
      conditions: ['Physical contact with the transformed guns is directly shown.'],
      limitations: ['Formal ability name is unsupplied.', 'Nen category, target count, transformed mass, range, duration, aura cost, and selection rules are unknown.', 'Retained gunfire is demonstrated for these transformed guns but is not generalized to every possible transformed object.'],
      targets: ['two soldiers’ guns in the Chapter 390 demonstration'],
      range: 'touch-triggered demonstration / later operational range unresolved',
      duration: 'unknown',
      knownUses: ['Chapter 390: gun barrels transform into live snakes whose mouths fire and kill two soldiers.'],
    }),
  ]),
});

export const guardianBeastState390Corrections = freeze({
  'guardian-beast:zhang-lei': freeze([
    freeze({
      id: 'guardian-beast-state:zhang-lei:390',
      beastId: 'guardian-beast:zhang-lei',
      chapterRange: freeze({ start: 390, end: 403 }),
      knowledge: 'coin number progression plus same-aura continuity directly observed',
      operationalState: 'Coventoba’s coin displays 10 and still carries the aura he associates with the original coin, while Tenftory’s separate coin still displays 1. Zhang Lei considers eventual public distribution after becoming King, but the coin’s trigger and effect remain unresolved.',
      hostState: 'host active',
      visibility: 'visible to eligible Nen users other than the host',
      knownAbilityIds: freeze(['ability:zhang-lei-coins']),
      suspectedAbilityIds: freeze([]),
      unresolved: freeze(['Meaning of the numbers', 'Trigger and timing of number progression', 'Activation threshold', 'Eventual holder effect', 'Result of the rejected beast-mouth experiment']),
      sourceIds: freeze([chapterSourceId(362), chapterSourceId(376), chapterSourceId(389), chapterSourceId(390)]),
      certainty: 'confirmed',
    }),
  ]),
});
