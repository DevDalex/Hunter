const freeze = (value) => Object.freeze(value);
const range418 = freeze({ start:418,end:418 });
const sourceIds = freeze(['source:chapter-418']);

const knowledge = ({ id,abilityName,knowledgeState,summary,mechanics,certainty='confirmed' }) => freeze({
  id,abilityName,chapterRange:range418,knowledgeState,certainty,summary,mechanics,sourceIds,
});

export const abilityKnowledge418Overrides = freeze({
  'ability:parallel-future': freeze([knowledge({
    id:'ability-knowledge:parallel-future:418',
    abilityName:'Parallel Future',
    knowledgeState:'sustained-Zetsu perception extension and interaction limits demonstrated',
    summary:'Chapter 418 substantially expands Parallel Future. Tserriednich confirms the closed-eyes-plus-Zetsu activation condition, experiences ten future seconds outside ordinary observer time, demonstrates that affected people continue following predicted interactions when he changes objects or himself, and discovers that remaining in Zetsu can keep the predicted perception running after the initial ten-second playback. This extended effect lets him remain alive and mobile while Benjamin and the Room 1004 household perceive his apparent execution and death.',
    mechanics:freeze({
      activation:'Tserriednich is in Zetsu with his eyes shut. The exact order of closing eyes versus entering Zetsu is not materially distinguished by the supplied synopsis.',
      conditions:freeze([
        'Tserriednich must be in Zetsu.',
        'His eyes are shut for activation.',
        'He experiences the next ten seconds subjectively while effectively no ordinary observer time passes.',
        'Opening his eyes begins the witnessed ten-second playback in real time.',
        'Remaining in Zetsu after that playback can continue the affected observers’ predicted perception in the demonstrated Room 1004 sequence.',
      ]),
      limitations:freeze([
        'Tserriednich cannot directly change another person’s location or physical state inside the witnessed future.',
        'He can alter his own state/location and alter objects.',
        'Altered objects cannot be used to force an affected person to perceive a new interaction outside the predicted sequence; the water bottle and Vantine gunfire demonstrate this constraint.',
        'The exact effect radius is unknown.',
        'The activation-point antenna, spherical range, static-as-distance signal, boundary collapse, outside-observer immunity, result-only vision rule, and one-eleventh battery ratio are Tserriednich hypotheses/estimates rather than fully proven mechanics.',
        'Theta’s endpoint perception is ambiguous and does not establish an exception.',
      ]),
      costs:freeze(['Sustaining the post-ten-second effect appears to consume stored aura according to Tserriednich’s self-model; exact charge/duration formula is unverified.']),
      targets:freeze(['Observers inside the demonstrated Room 1004 influence area','Tserriednich himself','Objects he directly changes']),
      range:'Unknown. Tserriednich theorizes a sphere centered on the activation point and perceives stronger static with distance.',
      duration:'Original future window is ten seconds; Chapter 418 demonstrates continued observer misperception beyond that while Zetsu is maintained. Final maximum duration is unknown.',
      knownUses:freeze([
        'Water-bottle experiment with Salkov.',
        'Continued Salkov misperception after the original ten-second playback.',
        'Benjamin’s apparent execution of Tserriednich while the real prince observes from elsewhere.',
        'Three bullets fired at Vantine crumple without changing Vantine’s perceived behavior.',
        'Staged-death coffin and escape preparation under continued concealment.',
      ]),
    }),
  })]),
});

export const nenSystemProfile418Corrections = freeze({});
