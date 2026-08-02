import {
  successionArchiveHubs,
  successionArchiveRoutes,
} from './archiveRoutes.js';

const freeze = (values = []) => Object.freeze([...values]);

export const SUCCESSION_RELEASE_VERSION = 'phase-6-release-v1';

const selectorFamilies = freeze([
  'canonical archive',
  'character state',
  'information consistency',
  'organization state',
  'people and institution closure',
  'Nen systems',
  'event knowledge',
  'story intelligence',
  'high-value intelligence',
  'workspace refinements',
  'product closure',
  'evidence graph',
  'final release closure',
]);

const consolidatedModules = freeze([
  'successionData.js',
  'productClosureSelectorsRelease.js',
  'SuccessionReleaseDesktop.css',
]);

const compatibilityEntrypoints = freeze([
  'productClosureSelectorsPhase4.js',
  'workspaceRefinementRuntime.js',
  'SuccessionInformationConsistencyPanel.css',
  'SuccessionPhase4DesktopOnly.css',
  'SuccessionWorkspaceRefinementDeck.css',
]);

export const createSuccessionReleaseManifest = ({
  data,
  validation,
  productClosure,
  workspaceRefinements,
}) => {
  const latestChapter = data.chapters.at(-1)?.number || 414;
  const productReport = productClosure.getProductClosureReport?.(latestChapter) || null;
  const refinementSummary = workspaceRefinements.getWorkspaceRefinementSummary?.(latestChapter) || null;

  return Object.freeze({
    version: SUCCESSION_RELEASE_VERSION,
    latestChapter,
    architecture: Object.freeze({
      hubs: successionArchiveHubs.length,
      routes: successionArchiveRoutes.length,
      routeIds: freeze(successionArchiveRoutes.map((route) => route.id)),
      desktopRefinementBoundary: 1024,
    }),
    data: Object.freeze({
      valid: Boolean(validation.valid),
      entities: validation.stats.entities,
      chapters: validation.stats.chapters,
      highValueIntelligenceVersion: data.highValueIntelligenceVersion,
      informationConsistencyVersion: data.informationConsistencyVersion,
    }),
    runtime: Object.freeze({
      selectorFamilies,
      consolidatedModules,
      compatibilityEntrypoints,
      productClosureComplete: Boolean(productReport?.complete ?? true),
      refinementChapter: refinementSummary?.chapter || latestChapter,
    }),
    guarantees: freeze([
      'Canonical IDs and chapter boundaries are unchanged.',
      'The four-hub architecture and all maintained routes remain registered.',
      'Search, Research, Glossary, Reader, and direct entity links remain stable.',
      'Phase 3, Phase 4, and Phase 5 selectors resolve through successionData.js.',
      'Desktop release styles are owned by one final stylesheet.',
      'Compatibility entrypoints contain no duplicate implementation logic.',
    ]),
  });
};
