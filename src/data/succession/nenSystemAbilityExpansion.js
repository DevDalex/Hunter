const ARCHIVE_DATE = '2026-07-25';
const chapterSourceId = (number) => `source:chapter-${number}`;

export const nenSystemAbilityExpansion = Object.freeze([
  Object.freeze({
    id: 'ability:benjamin-guardian-curse-dispersal',
    entityType: 'ability',
    slug: 'benjamin-guardian-curse-dispersal',
    name: 'Benjamin Guardian Curse Dispersal',
    aliases: Object.freeze(['Benjamin Guardian Spirit Beast Curse Dispersal']),
    summary: 'Benjamin’s Guardian Spirit Beast has dispersed low-level curse spirits, establishing a partial defensive interaction without revealing the beast’s complete ability.',
    sourceIds: Object.freeze([chapterSourceId(389)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: ARCHIVE_DATE,
    updatedAt: ARCHIVE_DATE,
    ownerIds: Object.freeze(['guardian-beast:benjamin']),
    classification: Object.freeze({
      nenTypes: Object.freeze(['unknown']),
      certainty: 'probable',
    }),
    category: 'guardian-beast-curse-defense',
    activation: 'The beast reacts to low-level curse spirits within Benjamin’s protected environment.',
    conditions: Object.freeze(['The observed interaction involves low-level curse spirits.']),
    limitations: Object.freeze(['The complete activation rule, strength ceiling, and relationship to the beast’s primary ability remain unknown.']),
    costs: Object.freeze([]),
    targets: Object.freeze(['curse spirits']),
    range: 'local defensive range',
    duration: 'brief reaction',
    status: 'active',
    knownUses: Object.freeze(['Disperses low-level curse spirits around Benjamin.']),
    firstChapter: 389,
    latestChapter: 389,
    sourceChapterNumbers: Object.freeze([389]),
    researchStatus: 'partial',
  }),
]);
