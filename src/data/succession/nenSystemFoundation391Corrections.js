const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, start = 391, end = 391, knowledgeState = 'documented', certainty = 'confirmed', summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], sources = [391] }) => freeze({
  id,
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

export const abilityKnowledge391Overrides = freeze({
  'ability:bloody-mary': freeze([
    knowledge({
      id: 'ability-knowledge:bloody-mary:391',
      knowledgeState: 'expanded demonstration / complete mechanics unresolved',
      summary: 'By Chapter 391, Bloody Mary is known both from Zakuro’s Chapter 390 blood-linked combat subdual and from numerous blood drops that move through Tier 3 searching for Hisoka. Zakuro states that the search drops run out of Nen after roughly 30 to 40 minutes and return to ordinary blood.',
      activation: 'Zakuro deploys his own available blood as the demonstrated medium; Chapter 391 shows multiple drops sent out to search.',
      conditions: ['The Chapter 391 search consists of numerous mobile blood drops.', 'The Chapter 390 combat use followed a deep neck wound that supplied usable blood.'],
      limitations: ['The demonstrated search drops have roughly 30 to 40 minutes of Nen before reverting to ordinary blood.', 'Nen category, sensory method, search range, maximum drop count, maximum blood volume, and communication rules remain unresolved.', 'Zakuro’s personification of the drops is not proof of independent intelligence.', 'An enemy-inflicted wound is not established as a universal requirement.'],
      costs: ['Uses Zakuro’s blood as the demonstrated medium; complete blood-cost rules remain unresolved.'],
      targets: ['Hisoka as the Chapter 391 search target', 'combat opponents in the Chapter 390 demonstration'],
      range: 'mobile search range unresolved',
      duration: 'approximately 30–40 minutes for the demonstrated search drops',
      knownUses: ['Chapter 390: blood-linked subdual.', 'Chapter 391: numerous searching drops move along the corridor and later revert to ordinary blood when Nen expires.'],
      sources: [390, 391],
    }),
  ]),
  'ability:body-and-soul': freeze([
    knowledge({
      id: 'ability-knowledge:body-and-soul:391',
      knowledgeState: 'known from Chapter 390 / no new activation in Chapter 391',
      summary: 'Body and Soul remains known as Lynch’s strike-and-question interrogation ability from Chapter 390. In Chapter 391 Lynch discusses using it on suspicious people found by Zakuro’s blood drops, but no new activation or mechanic is demonstrated.',
      activation: 'The demonstrated Chapter 390 sequence combines Lynch striking a target with asking questions through the ability.',
      conditions: ['A physical attack and questioning are both present in the demonstrated Chapter 390 use.'],
      limitations: ['Chapter 391 adds no new demonstrated mechanic.', 'Nen category, exact wording, resistance, range, duration, repeat-use rules, and any universal truth condition remain unresolved.'],
      targets: ['questioned opponent'],
      range: 'close-range demonstration / maximum range unresolved',
      duration: 'unknown',
      knownUses: ['Chapter 390: Lynch obtains basic information about Heil-Ly and Morena.', 'Chapter 391: Lynch discusses intended future use but does not activate the ability in the supplied scene.'],
      sources: [390, 391],
    }),
  ]),
  'ability:hinrigh-object-animal-transformation': freeze([
    knowledge({
      id: 'ability-knowledge:hinrigh-object-animal-transformation:391',
      knowledgeState: 'formal name and expanded demonstrations documented',
      summary: 'Chapter 391 identifies Hinrigh’s transformation ability as Biohazard. In addition to the Chapter 390 gun-to-snake use, Hinrigh transforms a recording camcorder into a surveillance cat and uses aura-reinforced handcuff-pigeons that can revert to cuff form around Padaille.',
      activation: 'Biohazard transforms ordinary objects into living-animal forms. Chapter 390 directly shows Hinrigh touching guns before transformation; Chapter 391 supplies the formal name and additional uses.',
      conditions: ['A camcorder set to record becomes a cat used for surveillance.', 'Ordinary handcuffs become pigeons and can return to handcuff form around a target.', 'Hinrigh states that the handcuff-pigeons are reinforced with aura.'],
      limitations: ['Nen category, maximum transformed mass, simultaneous transformation count, duration, command range, aura cost, and animal-selection rules remain unresolved.', 'Function retention is demonstrated in specific cases and is not generalized to every object.', 'The aura-reinforced pigeons resist standard handgun bullets in this fight; universal invulnerability is not established.'],
      targets: ['ordinary physical objects selected for transformation'],
      range: 'mobile transformed-animal operation / full range unresolved',
      duration: 'unknown',
      knownUses: ['Chapter 390: guns become live firing snakes.', 'Chapter 391: recording camcorder becomes surveillance cat.', 'Chapter 391: handcuffs become pigeons and revert to restraints around Padaille.'],
      sources: [390, 391],
    }),
  ]),
  'ability:fistful-of-weapons': freeze([
    knowledge({
      id: 'ability-knowledge:fistful-of-weapons:391',
      knowledgeState: 'official name and three forms demonstrated',
      summary: 'Padaille, identified as a Conjurer, activates Fistful of Weapons and transforms his right hand into a hammer, drill, and axe during his Chapter 391 fight with Hinrigh.',
      activation: 'Padaille changes his right hand into a selected weapon form.',
      conditions: ['Hammer, drill, and axe forms are directly demonstrated from the right hand.'],
      limitations: ['The complete weapon catalogue is unknown.', 'The chapter does not establish whether only the right hand can transform.', 'Duration, aura cost, durability, switching limits, and other forms remain unresolved.', 'Padaille’s wish to be reborn as a weapon is not treated as a literal reincarnation mechanic.'],
      targets: ['close-range combat targets'],
      range: 'close-range',
      duration: 'unknown',
      knownUses: ['Hammer attack on Hinrigh.', 'Drill form used to slip a handcuff and attack.', 'Axe form used in an attempted escape before Hinrigh kills Padaille with the transformed axe.'],
    }),
  ]),
  'ability:contagion': freeze([
    knowledge({
      id: 'ability-knowledge:contagion:391',
      knowledgeState: 'leveling rule partially documented',
      summary: 'Chapter 391 directly shows Heil-Ly members treating the killing of a Nen user as worth ten levels. Tevelares, Quorolle, and Padaille disagree about how that reward should be allocated among multiple attackers and expect Morena, as the ability user and game master, to decide.',
      activation: 'Morena’s existing Contagion community governs member level progression; Chapter 391 adds the demonstrated discussion of the Nen-user kill value.',
      conditions: ['The members explicitly state that killing a Nen user is worth ten levels.'],
      limitations: ['The exact multi-attacker reward-allocation rule is unresolved because the three members disagree.', 'Quorolle’s belief that Morena can probably tell what they are doing at all times is an inference, not a demonstrated surveillance mechanic.', 'Chapter 391 does not by itself restate every other Contagion point value, threshold, or community-creation rule.'],
      targets: ['Heil-Ly Contagion members participating in the level system'],
      range: 'community-system range unresolved at this chapter boundary',
      duration: 'ongoing community progression',
      knownUses: ['Chapter 391: Tevelares, Quorolle, and Padaille discuss the +10 value for killing a Nen user and dispute how to divide it.'],
      sources: [378, 391],
    }),
  ]),
});
