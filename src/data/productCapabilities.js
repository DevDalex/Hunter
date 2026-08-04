export const productCapabilities = Object.freeze({
  readingExperience: Object.freeze({
    phase: 2,
    status: 'implemented-foundation',
    capabilities: ['mission-onboarding', 'persistent-boundary-context', 'coverage-language', 'explanation-depth'],
  }),
  connectedIntelligence: Object.freeze({
    phase: 3,
    status: 'implemented-foundation',
    capabilities: ['chapter-diffs', 'entity-comparison', 'open-questions', 'claim-semantics', 'translation-notes'],
  }),
  researchWorkspace: Object.freeze({
    phase: 4,
    status: 'implemented-foundation',
    capabilities: ['bookmarks', 'saved-boundary', 'investigations', 'shareable-snapshots', 'json-csv-export'],
  }),
  scaleAndPolish: Object.freeze({
    phase: 5,
    status: 'implemented-foundation',
    capabilities: ['route-chunk-policy', 'data-chunk-policy', 'media-policy', 'adr-governance', 'product-audit'],
  }),
});

export const capabilityIds = Object.freeze(Object.values(productCapabilities).flatMap((phase) => phase.capabilities));
