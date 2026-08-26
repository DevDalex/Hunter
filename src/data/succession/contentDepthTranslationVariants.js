const freeze = (value = []) => Object.freeze([...value]);
const variant = ({ id, subject, chapter, category, adopted, alternate, exactAlternateArchived = true, mechanicsImpact = 'none', note, entityIds = [], sourceIds = [] }) => Object.freeze({
  id: `translation-variant:${id}`,
  subject,
  chapter,
  category,
  adopted,
  alternate,
  exactAlternateArchived,
  mechanicsImpact,
  note,
  entityIds: freeze(entityIds),
  sourceIds: freeze(sourceIds.length ? sourceIds : [`source:chapter-${chapter}`]),
  status: exactAlternateArchived ? 'documented-variant' : 'documented-discrepancy-exact-alternate-unarchived',
});

export const successionTranslationVariants = freeze([
  variant({
    id: 'gypsy-life-host-selection',
    subject: 'Gypsy Life: Bohemian Rhapsody future-host selection rule',
    chapter: 417,
    category: 'mechanics-semantics',
    adopted: 'The maintained archive follows the user-supplied synopsis/translation note: after the initial future-host selection right is determined between Benjamin and the Guardian Spirit Beast, later selection rights alternate between them.',
    alternate: 'A differing Viz rendering is explicitly noted in the maintained Chapter 417 source policy, but the exact alternate wording is not stored in the repository and is therefore not reconstructed here.',
    exactAlternateArchived: false,
    mechanicsImpact: 'high',
    note: 'This variant can materially change interpretation of who chooses future hosts. The archive records the adopted rule and the existence of the discrepancy without inventing the missing wording.',
    entityIds: ['ability:gypsy-life-bohemian-rhapsody', 'character:benjamin-hui-guo-rou'],
  }),
  variant({
    id: 'sale-sale-romanization',
    subject: 'Salé-salé / Sale-sale romanization',
    chapter: 349,
    category: 'romanization',
    adopted: 'Salé-salé Hui Guo Rou',
    alternate: 'Sale-sale Hui Guo Rou',
    mechanicsImpact: 'none',
    note: 'Name normalization only. Both forms resolve to the same Eighth Prince record and must not create duplicate entities.',
    entityIds: ['character:sale-sale-hui-guo-rou'],
  }),
  variant({
    id: 'ken-i-wang-romanization',
    subject: "Ken'i Wang / Ken-i Wang romanization",
    chapter: 378,
    category: 'romanization',
    adopted: "Ken'i Wang",
    alternate: 'Ken-i Wang',
    mechanicsImpact: 'none',
    note: 'Name normalization only. Search and relationship resolution should treat both labels as one person.',
    entityIds: ['character:ken-i-wang'],
  }),
  variant({
    id: 'shimanu-shimano-canonicalization',
    subject: 'Shimanu / canonical Shimano entity resolution',
    chapter: 414,
    category: 'archive-canonicalization',
    adopted: 'Maintained chapter text may use “Shimanu”; the canonical archive entity remains character:shimano.',
    alternate: 'Shimanu',
    mechanicsImpact: 'none',
    note: 'This is an archive identity-normalization rule, not a claim that one spelling is universally authoritative outside the maintained source set. It prevents duplicate character nodes.',
    entityIds: ['character:shimano'],
  }),
]);

export const getSuccessionTranslationVariantsAtChapter = (chapter = 417) => freeze(successionTranslationVariants.filter((record) => record.chapter <= Number(chapter)));
export const getSuccessionTranslationVariant = (id) => successionTranslationVariants.find((record) => record.id === id || record.id === `translation-variant:${id}`) || null;
export const getSuccessionTranslationSummary = (chapter = 417) => {
  const records = getSuccessionTranslationVariantsAtChapter(chapter);
  return Object.freeze({
    chapter: Number(chapter),
    records: records.length,
    mechanicsImpacting: records.filter((record) => record.mechanicsImpact !== 'none').length,
    exactAlternateUnarchived: records.filter((record) => !record.exactAlternateArchived).length,
  });
};
