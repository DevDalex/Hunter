const freeze = (value) => Object.freeze(value);
const range416 = freeze({ start:416, end:416 });
const sourceIds = freeze(['source:chapter-416']);
const record = ({ id,abilityName,knowledgeState,certainty='confirmed',summary,mechanics }) => freeze({ id,abilityName,chapterRange:range416,knowledgeState,certainty,summary,mechanics:freeze(mechanics),sourceIds });

export const abilityKnowledge416Overrides = freeze({
  'ability:dust-in-the-wind-hell-fruit': freeze([record({
    id:'ability-knowledge:dust-in-the-wind-hell-fruit:416', abilityName:'Dust in the Wind: Hell Fruit', knowledgeState:'named post-mortem curse activation directly demonstrated',
    summary:'Moswana dies in Benjamin’s presence and Hell Fruit manifests as a ghostly hand with hollow faces at its fingertips. It strikes Benjamin, whose body darkens and whose pupils develop face-like marks.',
    mechanics:{ activation:'Moswana’s death triggers the demonstrated curse manifestation.',conditions:freeze(['Moswana is the prepared curse bearer assigned to Benjamin.','Close-proximity death and direct visual engagement are present in the demonstrated activation.']),limitations:freeze(['The final lethal effect and timing are unresolved at the Chapter 416 boundary.','Camilla’s ten-year-plan statement does not establish every preparation mechanic.','No Chapter 417+ outcome is imported.']),costs:freeze(['Moswana’s death.']),targets:freeze(['Benjamin Hui Guo Rou']),range:'close-proximity activation demonstrated; maximum unresolved',duration:'visible effect active at boundary; final duration unresolved',knownUses:freeze(['Chapter 416: activates after Moswana dies and visibly curses Benjamin.'])}
  })]),
  'ability:cats-name': freeze([record({
    id:'ability-knowledge:cats-name:416', abilityName:"Cat's Name", knowledgeState:'known counteractive ability confronted with unresolved disease edge case',
    summary:'Benjamin confirms he knows Camilla’s ability activates when she is killed and deliberately avoids killing her. He then asks whether disease, indirect causation, or a dead disease carrier could provide a valid killer/aura source before infecting Camilla with TSK-17.',
    mechanics:{ activation:'No new Cat’s Name activation occurs in Chapter 416.',conditions:freeze(['Previously established death-triggered counter remains known.']),limitations:freeze(['Chapter 416 does not resolve whether disease counts as the killer.','Chapter 416 does not resolve whose aura could power resurrection under indirect causation.','Chapter 416 does not resolve what happens if the disease carrier dies before Camilla.']),costs:freeze([]),targets:freeze(['unresolved under the disease hypothetical']),range:'no new range information',duration:'not activated',knownUses:freeze(['Chapter 416: no activation; Benjamin designs TSK-17 strategy around unresolved edge conditions.'])}
  })]),
  'ability:parallel-future': freeze([record({
    id:'ability-knowledge:parallel-future:416', abilityName:'Parallel Future', knowledgeState:'Salkov infers Zetsu activation link from prior evidence', certainty:'probable',
    summary:'Salkov connects Theta’s inability to sense being caught in Tserriednich’s ability with Tserriednich’s focus on faster Zetsu activation and infers that Zetsu activates the ability; he suspects it is already active before Benjamin shoots Tserriednich.',
    mechanics:{ activation:'Salkov infers a Zetsu activation link; this record preserves the inference rather than elevating it to omniscient confirmation.',conditions:freeze([]),limitations:freeze(['The exact state of the ability during Benjamin’s shot is not independently confirmed by the Chapter 416 scene.','The post-shot result and staged-death outcome are outside the Chapter 416 boundary.']),costs:freeze([]),targets:freeze([]),range:'no new confirmed range information',duration:'no new confirmed duration information',knownUses:freeze(['Chapter 416: Salkov prepares to observe the confrontation as evidence for Theta.'])}
  })]),
});

export const nenSystemProfile416Corrections = freeze({});
