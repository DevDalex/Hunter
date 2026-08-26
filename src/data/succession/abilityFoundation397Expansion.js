const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

export const abilityFoundation397Expansion = freeze([
  freeze({
    id: 'ability:renko-embalming',
    entityType: 'ability',
    slug: 'renko-embalming',
    name: 'Renko’s Embalming Ability',
    aliases: freeze(['Descriptive archive label · official ability name unsupplied']),
    summary: 'A descriptive label for Renko’s extraordinary embalming technique in Chapter 397. Lisores says Sarasa’s body was restored remarkably well despite the condition in which it was recovered. When Machi asks whether she can learn the same technique, Renko says it is a special ability; Machi then asks whether that explains the strong glow around Sarasa, prompting Renko to ask whether Machi can see aura. The demonstrated effect is restoration and preservation of Sarasa’s deceased body for the funeral, not resurrection or consciousness continuation.',
    sourceIds: freeze([chapterSourceId(397)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10',
    ownerIds: freeze(['character:renko']),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed' }),
    category: 'embalming / bodily restoration-preservation',
    activation: 'Unsupplied. Chapter 397 reveals the completed restoration and Renko identifies her technique as a special ability, but does not show the activation procedure.',
    conditions: freeze([
      'Sarasa’s deceased body is the only demonstrated target in the supplied Chapter 397 synopsis.',
      'The completed restoration allows Sarasa’s appearance to be presented close to how she looked while alive despite the severe condition in which the body was recovered.',
      'Machi perceives a strong aura-like glow around Sarasa’s restored body, and Renko responds by asking whether Machi can see aura.',
    ]),
    limitations: freeze([
      'The official ability name and Renko’s Nen category are unsupplied.',
      'The chapter does not establish whether ordinary physical embalming procedures are also required in addition to the special ability.',
      'Valid targets, preparation, range, duration, aura cost, injury limits, decomposition limits, time-since-death limits, repeat-use rules, and failure conditions remain unresolved.',
      'The archive does not generalize one demonstrated restoration into an ability to restore every deceased body.',
      'The restored appearance is not resurrection, healing back to life, or evidence of continued consciousness.',
    ]),
    costs: freeze([]),
    targets: freeze(['Sarasa’s deceased body in the demonstrated Chapter 397 use; broader valid targets unknown']),
    range: 'unknown',
    duration: 'unknown; preservation is demonstrated through Sarasa’s funeral presentation but no limit is supplied',
    status: 'demonstrated special ability / official name, category, activation, and complete mechanics unresolved',
    knownUses: freeze(['Chapter 397: Renko restores and preserves Sarasa’s severely damaged body sufficiently for the funeral presentation; Renko identifies the method as a special ability and Machi perceives aura around the result.']),
    firstChapter: 397,
    latestChapter: 397,
    sourceChapterNumbers: freeze([397]),
    researchStatus: 'existence and demonstrated Sarasa restoration confirmed / official name, Nen type, activation, costs, limits, and broader target rules unresolved',
  }),
]);
