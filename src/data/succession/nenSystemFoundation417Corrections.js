const freeze = (value) => Object.freeze(value);
const range417 = freeze({ start:417, end:417 });
const sourceIds = freeze(['source:chapter-417']);

const knowledge = ({ id, abilityName, knowledgeState, summary, mechanics, certainty='confirmed' }) => freeze({
  id, abilityName, chapterRange:range417, knowledgeState, certainty, summary, mechanics, sourceIds,
});

export const abilityKnowledge417Overrides = freeze({
  'ability:gypsy-life-bohemian-rhapsody': freeze([knowledge({
    id:'ability-knowledge:gypsy-life-bohemian-rhapsody:417',
    abilityName:'Gypsy Life: Bohemian Rhapsody',
    knowledgeState:'post-death fusion and blood-relative host-transfer mechanics revealed',
    summary:'Chapter 417 names Benjamin’s Guardian Spirit Beast ability and reveals that after Benjamin dies the beast fuses with Benjamin Baton, transfers as a Guardian Spirit Beast to one of Benjamin’s blood relatives, and alternates the side with host-selection authority after the first selection right is determined between Benjamin and the beast.',
    mechanics: freeze({
      activation:'Stated to begin after Benjamin’s death; not actually activated in Chapter 417.',
      conditions:freeze(['Benjamin dies.','The Guardian Spirit Beast fuses with Benjamin Baton.','A blood relative is selected as the next host.']),
      limitations:freeze(['No actual transfer occurs in Chapter 417.','Exact eligible-relative pool and transfer edge cases remain unknown.','The supplied synopsis/translation note controls the alternating selector rule.','No Chapter 418+ result is invented.']),
      costs:freeze(['Benjamin’s death is the stated trigger.']),
      targets:freeze(['one of Benjamin’s blood relatives']),
      range:'not established',
      duration:'successive-host persistence implied; complete termination rule unknown',
      knownUses:freeze(['Mechanics revealed only; no activation shown.']),
    }),
  })]),
  'ability:secret-window': freeze([knowledge({
    id:'ability-knowledge:secret-window:417',
    abilityName:'Secret Window',
    knowledgeState:'inherited remote surveillance use by Benjamin demonstrated',
    summary:'Benjamin uses inherited Secret Window to observe Camilla contacting the medical department during his prince-by-prince strategic review.',
    mechanics: freeze({ activation:'Benjamin uses the inherited ability remotely; exact activation input is not respecified.', conditions:freeze([]), limitations:freeze(['Chapter 417 does not expand the complete surveillance range or target rules.']), costs:freeze([]), targets:freeze(['Camilla Hui Guo Rou']), range:'remote surveillance', duration:'not established', knownUses:freeze(['Benjamin observes Camilla contacting the medical department.']) }),
  })]),
  'ability:benjamin-baton': freeze([knowledge({
    id:'ability-knowledge:benjamin-baton:417',
    abilityName:'Benjamin Baton',
    knowledgeState:'future fusion interaction with Guardian Spirit Beast revealed',
    summary:'Chapter 417 reveals that Gypsy Life will fuse with Benjamin Baton after Benjamin’s death before transferring as a Guardian Spirit Beast to a blood relative.',
    mechanics: freeze({ activation:'Existing inheritance mechanics unchanged; Chapter 417 adds a future post-death interaction.', conditions:freeze(['Gypsy Life interaction is stated to occur after Benjamin dies.']), limitations:freeze(['No actual post-death fusion is shown.']), costs:freeze([]), targets:freeze(['qualifying inherited abilities / future Gypsy Life fusion interaction']), range:'self / inheritance system', duration:'not fully established', knownUses:freeze(['Future Gypsy Life fusion interaction revealed; not activated.']) }),
  })]),
  'ability:dust-in-the-wind-hell-fruit': freeze([knowledge({
    id:'ability-knowledge:dust-in-the-wind-hell-fruit:417',
    abilityName:'Dust in the Wind: Hell Fruit',
    knowledgeState:'Benjamin remains afflicted while operational',
    summary:'Benjamin tells Balsamilco and Coventoba that he is afflicted by a curse from Camilla’s Have-Nots. Chapter 417 does not resolve the curse’s final effect.',
    mechanics: freeze({ activation:'Already activated in Chapter 416.', conditions:freeze([]), limitations:freeze(['Final lethal timing/effect remains unresolved at the Chapter 417 publication ceiling.']), costs:freeze([]), targets:freeze(['Benjamin Hui Guo Rou']), range:'ongoing affliction', duration:'still active/afflicting Benjamin in Chapter 417', knownUses:freeze(['Benjamin discloses the continuing Have-Not curse to Balsamilco and Coventoba.']) }),
  })]),
});

export const nenSystemProfile417Corrections = freeze({});
