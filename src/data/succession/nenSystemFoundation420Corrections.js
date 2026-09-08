const freeze = (value) => Object.freeze(value);
const range420 = freeze({start:420,end:420});
const sourceIds = freeze(['source:chapter-420']);
const knowledge = ({id,abilityName,knowledgeState,summary,mechanics,certainty='confirmed'}) => freeze({id,abilityName,chapterRange:range420,knowledgeState,certainty,summary,mechanics,sourceIds});

export const abilityKnowledge420Overrides = freeze({
  'ability:parallel-future':freeze([knowledge({
    id:'ability-knowledge:parallel-future:420',
    abilityName:'Parallel Future',
    knowledgeState:'lethal-future divergence against elite Nen user, sustained-Zetsu duration pressure, and anomaly-detection uncertainty demonstrated',
    summary:'Chapter 420 shows Tserriednich applying the approximately thirty-six-meter operating model from Chapter 419 to Hisoka, reflexively activating the future ability when Hisoka suddenly appears behind him, seeing a future in which Hisoka kills him, then immediately diverging and surviving while the imposed sequence continues around Hisoka. The chapter also introduces an unresolved anomaly: Hisoka appears to notice that something is wrong, inspects the expected Guardian Spirit Beast position, and then looks toward the real Tserriednich. Tserriednich later judges his remaining operating time conservatively and considers waiting for recharge or releasing Zetsu.',
    mechanics:freeze({
      activation:'Zetsu remains central. Chapter 420 again shows reflexive activation during immediate combat danger and continued sustained operation afterward.',
      conditions:freeze([
        'Tserriednich maintains Zetsu through the casino approach and Hisoka encounter.',
        'The approximately thirty-six-meter range estimate from Chapter 419 remains part of his tactical activation planning.',
        'The future sequence can display a lethal outcome that Tserriednich then avoids by changing his actual movement.',
      ]),
      limitations:freeze([
        'Hisoka’s apparent anomaly detection does not reveal the exact sensory rule of Parallel Future, the Guardian Spirit Beast, or elite-observer resistance.',
        'Chapter 420 does not establish that Hisoka fully sees the real Tserriednich, fully understands the ability, or uses a specifically named perception technique.',
        'Tserriednich treats his available operating time as close to depletion by the exterior endpoint, but no exact numeric reserve or recharge formula is supplied.',
        'The approximately thirty-six-meter range remains an operational estimate rather than a fully surveyed geometric constant.',
      ]),
      costs:freeze(['Extended/repeated sustained operation creates a practical resource-management problem; Tserriednich considers hiding until recharge or dropping Zetsu, but exact cost and recharge values remain unknown.']),
      targets:freeze(['Observers inside the influence set','Tserriednich himself','Perceived future actions and outcomes presented to affected observers']),
      range:'Approximately thirty-six meters operationally from the activation point based on the Chapter 419 model, which Tserriednich continues using tactically in Chapter 420.',
      duration:'Sustained long enough to carry Tserriednich through the Hisoka encounter and subsequent movement, but by the exterior endpoint he judges the remaining operating time close to depletion under a conservative estimate. Exact maximum duration remains unknown.',
      knownUses:freeze([
        'Hisoka casino encounter and predicted throat-slitting divergence.',
        'Continued imposed-future playback while the real Tserriednich watches from a changed position.',
        'Sustained-Zetsu escape through the emergency-exit route toward the exterior Tier 1 area.',
      ]),
    }),
  })]),
});

export const nenSystemProfile420Corrections = freeze({});
