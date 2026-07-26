import { successionArchiveLegacyTargets } from './archiveRoutes.js';

const freeze = (values) => Object.freeze(values);

const workspace = (routeId, module, authority, options = {}) => Object.freeze({
  routeId,
  module,
  authority,
  kind: options.kind || 'canonical-workspace',
  specializedRecords: Boolean(options.specializedRecords),
  chapterBounded: options.chapterBounded !== false,
});

export const successionProductInventory = Object.freeze({
  version: 3,
  batch: 5,
  status: 'release-candidate',
  authoritativeWorkspaces: freeze([
    workspace('archive', 'SuccessionArchiveApp.jsx#ArchiveHome', 'archive overview', { chapterBounded: false }),
    workspace('story', 'SuccessionArchiveStoryIntelligenceWorkspace.jsx', 'story phases, lanes, threads, and causal intelligence'),
    workspace('search', 'SuccessionArchiveApp.jsx#SearchWorkspace', 'grouped global product search'),
    workspace('characters', 'SuccessionArchiveCharacterWorkspace.jsx', 'all character dossiers, roles, life states, and body states', { specializedRecords: true }),
    workspace('princes', 'SuccessionArchiveWorkspaces.jsx#PrincesWorkspace', 'royal-family role index', { specializedRecords: true }),
    workspace('queens', 'SuccessionArchiveDeepWorkspaces.jsx#QueensWorkspace', 'legacy queen deep-link index', { specializedRecords: true }),
    workspace('bodyguards', 'SuccessionArchiveAssignmentWorkspace.jsx', 'assignments and reporting chains', { specializedRecords: true }),
    workspace('organizations', 'SuccessionArchiveOrganizationWorkspace.jsx', 'all mafia, military, Justice, political, royal, expedition, and institutional dossiers', { specializedRecords: true }),
    workspace('locations', 'SuccessionArchiveLocationWorkspace.jsx', 'location hierarchy and dossiers', { specializedRecords: true }),
    workspace('nen', 'SuccessionArchiveNenWorkspace.jsx', 'abilities and Nen-system dossiers', { specializedRecords: true }),
    workspace('guardian-spirit-beasts', 'SuccessionArchiveGuardianBeastWorkspace.jsx', 'Guardian Spirit Beast dossiers', { specializedRecords: true }),
    workspace('events', 'SuccessionArchiveEventWorkspace.jsx', 'chapter-bounded event dossiers', { specializedRecords: true }),
    workspace('relationships', 'SuccessionArchiveRelationshipWorkspace.jsx', 'relationship dossiers', { specializedRecords: true }),
    workspace('chapters', 'SuccessionArchiveChapterStoryWorkspace.jsx', 'chapter story dossiers', { specializedRecords: true }),
    workspace('research', 'SuccessionArchiveEvidenceWorkspace.jsx', 'sources, evidence, provenance, media records, and closure reporting'),
    workspace('glossary', 'SuccessionArchiveGlossaryWorkspace.jsx', 'graph-connected chapter-bounded vocabulary'),
  ]),
  preservedVisualTools: freeze([
    workspace('black-whale', '../BlackWhaleGuide.jsx', 'ship visual atlas', { kind: 'preserved-visual-tool' }),
    workspace('timeline', '../TimelineWorkspace.jsx', 'voyage visual timeline', { kind: 'preserved-visual-tool' }),
    workspace('reader', 'SuccessionReader route', 'chapter image reader', { kind: 'external-route-tool' }),
  ]),
  legacyAliases: successionArchiveLegacyTargets,
  removedImplementationClasses: freeze([
    'static Story workspace',
    'legacy Chapter Records workspace',
    'generic Characters workspace',
    'generic Organizations workspace',
    'legacy Locations workspace',
    'legacy Research workspace',
    'static Glossary workspace',
    'standalone Media route',
    'standalone Hunters route',
    'standalone Deaths route',
    'standalone Mafia route',
    'standalone Military route',
    'standalone Politics route',
    'Nen migration tab',
    'legacy Guardian Spirit Beast board',
    'duplicate SuccessionArchiveApp module wrapper',
  ]),
  releaseGates: freeze([
    'canonical-data-validation',
    'batch-1-foundation-closure',
    'batch-2-people-institutions-closure',
    'batch-3-nen-systems-closure',
    'batch-4-story-intelligence-closure',
    'batch-5-product-closure',
    'production-build',
    'browser-interaction-qa',
    'browser-accessibility-qa',
    'cloudflare-deployment',
  ]),
});

export const getSuccessionProductInventoryReport = () => Object.freeze({
  ...successionProductInventory,
  counts: Object.freeze({
    authoritativeWorkspaces: successionProductInventory.authoritativeWorkspaces.length,
    preservedVisualTools: successionProductInventory.preservedVisualTools.length,
    legacyAliases: Object.keys(successionProductInventory.legacyAliases).length,
    removedImplementationClasses: successionProductInventory.removedImplementationClasses.length,
    releaseGates: successionProductInventory.releaseGates.length,
  }),
});
