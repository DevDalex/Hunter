export const performancePolicy = Object.freeze({
  routeChunks: Object.freeze({
    shellMaximumKb: 180,
    workspaceMaximumKb: 420,
    lazyRoutes: Object.freeze(['reader', 'black-whale', 'princes', 'characters', 'organizations', 'nen', 'research']),
  }),
  dataChunks: Object.freeze({
    maximumInitialResearchKb: 220,
    chapterWindowSize: 10,
    splitDomains: Object.freeze(['characters', 'events', 'relationships', 'locations', 'nen', 'chapter-records']),
  }),
  media: Object.freeze({
    preferredFormats: Object.freeze(['avif', 'webp']),
    requireDimensions: true,
    requireLazyLoading: true,
    separateThumbnailAndFullSize: true,
    excludeChapterBinariesFromPublicExports: true,
  }),
  interaction: Object.freeze({
    maximumSearchResponseMs: 150,
    maximumRouteInteractiveMs: 2500,
    respectReducedMotion: true,
  }),
});
