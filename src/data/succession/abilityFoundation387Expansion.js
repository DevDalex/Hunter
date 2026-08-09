const freeze = (value) => Object.freeze(value);
const characterId = (name) => `character:${String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
const chapterSourceId = (number) => `source:chapter-${number}`;

export const abilityFoundation387Expansion = freeze([
  freeze({
    id: 'ability:parallel-future',
    entityType: 'ability',
    slug: 'parallel-future',
    name: 'Parallel Future',
    aliases: freeze([]),
    summary: 'Tserriednich’s Specialization ability is explicitly defined in Chapter 387: with his eyes closed in Zetsu he sees a future sequence ten seconds ahead, and while maintaining the state he can continue viewing that future as real time advances and alter his actual actions while the demonstrated observer continues perceiving the forecast version.',
    sourceIds: freeze([chapterSourceId(385), chapterSourceId(386), chapterSourceId(387)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    ownerIds: freeze([characterId('Tserriednich Hui Guo Rou')]),
    classification: freeze({ nenTypes: freeze(['specialization']), certainty: 'confirmed' }),
    category: 'future-perception-and-divergence',
    activation: 'Demonstrated after Tserriednich closes his eyes and fully enters Zetsu; static precedes the future vision.',
    conditions: freeze([
      'Tserriednich’s eyes are closed during the demonstrated activation and continuing future-view state.',
      'He fully suppresses his aura with Zetsu before the vision begins.',
      'Maintaining the eyes-closed Zetsu state allows the future vision to continue beyond the initial ten-second preview.',
    ]),
    limitations: freeze([
      'Chapter 387 does not establish an ultimate maximum duration for continuous future viewing.',
      'The demonstrated divergence rule is established through Theta’s interaction; the chapter does not enumerate every possible multi-observer or Nen-interaction case.',
      'No separate aura cost or cooldown beyond the demonstrated Zetsu requirement is supplied.',
      'Tserriednich’s early fear that he must remain defenseless for ten seconds is superseded by his subsequent continuing-vision and divergence experiment and is not treated as the final limitation.',
    ]),
    costs: freeze(['The demonstrated activation requires Zetsu, suppressing Tserriednich’s ordinary aura output while the state is maintained.']),
    targets: freeze(['self perception', 'future sequence involving surrounding events']),
    range: 'Future-scene range is not separately quantified in Chapter 387.',
    duration: 'Ten-second forecast lead; continuous vision can extend beyond the first ten seconds while the eyes-closed Zetsu state is maintained, with no maximum duration supplied.',
    status: 'active',
    knownUses: freeze([
      'Chapter 385: Theta perceives a lethal headshot and corpse while Tserriednich physically survives; the complete mechanism is not yet revealed at that chapter boundary.',
      'Chapter 386: luminol finds no blood where Theta remembers the corpse, adding forensic evidence while the full temporal model remains withheld.',
      'Chapter 387 flashback: Tserriednich discovers that the vision is ten seconds ahead when Theta repeats forecast dialogue.',
      'Chapter 387 flashback: he maintains Zetsu beyond the initial preview, experiences present sensory information alongside the continuing future vision, and experimentally demonstrates divergence from the forecast.',
      'Chapter 387 flashback: he sees Theta draw her gun, moves his actual body away from the forecast position, and survives while Theta fires at the forecast version she perceives.',
    ]),
    firstChapter: 385,
    latestChapter: 387,
    sourceChapterNumbers: freeze([385, 386, 387]),
    researchStatus: 'documented through Chapter 387 / broader interaction cases unresolved',
  }),
]);
