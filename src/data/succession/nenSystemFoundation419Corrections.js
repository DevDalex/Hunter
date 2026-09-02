const freeze = (value) => Object.freeze(value);
const range419 = freeze({start:419,end:419});
const sourceIds = freeze(['source:chapter-419']);
const knowledge = ({id,abilityName,knowledgeState,summary,mechanics,certainty='confirmed'}) => freeze({id,abilityName,chapterRange:range419,knowledgeState,certainty,summary,mechanics,sourceIds});

export const abilityKnowledge419Overrides = freeze({
  'ability:parallel-future':freeze([knowledge({
    id:'ability-knowledge:parallel-future:419',
    abilityName:'Parallel Future',
    knowledgeState:'field boundary, outsider-entry rule, and forced deactivation demonstrated',
    summary:'Chapter 419 converts several Chapter 418 hypotheses into demonstrated operating rules. Tserriednich measures the sustained influence at approximately thirty-six meters from the activation point, observes affected and unaffected soldiers on opposite sides of that boundary, confirms that an observer outside the field at activation remains unaffected after entering it later, and deliberately ends the sustained effect by crossing the boundary while maintaining Zetsu. He also uses Ephemeral Ten Seconds: Laplace’s Devil tactically to avoid a predicted costly firefight while affected soldiers continue perceiving the predicted combat.',
    mechanics:freeze({
      activation:'Maintained archive identity remains Parallel Future; Chapter 419 uses the technique label Ephemeral Ten Seconds: Laplace’s Devil during active combat use.',
      conditions:freeze([
        'Zetsu remains central to activation and sustained operation.',
        'Observers inside the influence set at activation can remain locked into the predicted sequence while Tserriednich takes different actions.',
        'Observers outside the field at activation do not join that influence merely by entering the radius later.',
      ]),
      limitations:freeze([
        'Practical radius is approximately thirty-six meters from the activation point based on Tserriednich’s route estimate and observer split; exact geometry and exact boundary remain unresolved.',
        'Crossing beyond the field boundary terminates the sustained effect even if Tserriednich keeps Zetsu active.',
        'The outsider-entry test resolves only the case of observers who were outside at activation; leave/re-entry and other membership edge cases remain unknown.',
        'Maximum stored-aura duration and the one-eleventh charge-to-operation estimate remain unverified.',
      ]),
      costs:freeze(['Repeated sustained use continues to rely on Tserriednich’s stored-aura model, but Chapter 419 does not show final exhaustion.']),
      targets:freeze(['Observers inside the influence set at activation','Tserriednich himself','Objects/actions whose perceived outcomes follow the predicted future']),
      range:'Approximately thirty-six meters operationally from the activation point in the demonstrated Room 1004-to-VVIP corridor sequence; exact shape and precision unresolved.',
      duration:'Can continue beyond the ten-second future while Zetsu is maintained, but ends when Tserriednich crosses the demonstrated field boundary. Maximum total duration remains unknown.',
      knownUses:freeze([
        'Room 1004 to Room 1006 boundary test.',
        'Shared VVIP corridor firefight and future divergence.',
        'Outsider-entry experiment with soldiers arriving from the main corridor.',
        'Forced deactivation by crossing the field boundary while keeping Zetsu.',
      ]),
    }),
  })]),
});

export const nenSystemProfile419Corrections = freeze({});
