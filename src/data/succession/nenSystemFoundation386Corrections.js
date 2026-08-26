const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const abilityKnowledge386Overrides = freeze({
  'ability:parallel-future': freeze([
    freeze({
      id: 'ability-knowledge:parallel-future:386',
      chapterRange: freeze({ start: 386, end: 386 }),
      knowledgeState: 'partially documented',
      certainty: 'probable',
      summary: 'Chapter 386 adds forensic evidence to Tserriednich’s Zetsu-linked temporal anomaly: luminol finds no blood where Theta remembers the apparent corpse, but the full prediction, duration, perception, and divergence mechanics remain unrevealed at this boundary.',
      mechanics: freeze({
        activation: 'The phenomenon is still only tied by observation to Tserriednich entering and sustaining Zetsu during Theta’s assassination attempt; Chapter 386 adds no complete activation rule.',
        conditions: freeze([
          'Tserriednich was sustaining Zetsu during the demonstrated Chapter 385 assassination sequence.',
          'Theta perceived a lethal headshot and corpse that did not persist as an ordinary physical death scene.',
          'Chapter 386 forensic follow-up finds no blood where Theta remembers the corpse lying.',
        ]),
        limitations: freeze([
          'Chapter 386 still does not establish an exact duration.',
          'The chapter does not establish a complete precognition model.',
          'The chapter does not establish a complete rule for what Tserriednich consciously sees during activation.',
          'The chapter does not establish the full observer-perception or divergence rules.',
          'The absence of blood does not prove that every part of Theta’s experience was merely an illusion.',
        ]),
        costs: freeze([]),
        targets: freeze([]),
        range: 'unknown at Chapter 386 boundary',
        duration: 'unknown at Chapter 386 boundary',
        knownUses: freeze([
          'Chapter 385: Theta perceives a lethal headshot and corpse, but Tserriednich remains alive and a guard reports a skipped interval.',
          'Chapter 386: Salkov uses luminol at the remembered corpse location and finds no blood, adding forensic evidence that the apparent death did not leave an ordinary physical trace.',
        ]),
      }),
      sourceIds: freeze([chapterSourceId(385), chapterSourceId(386)]),
    }),
  ]),
});
