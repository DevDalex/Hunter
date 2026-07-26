import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import {
  declarationIncludesLiteral,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession runtime contract audit failed: ${message}`);
};

const auditPaths = Object.freeze([
  'scripts/audit-succession-stabilization.mjs',
  'scripts/audit-succession-archive-shell.mjs',
  'scripts/audit-succession-characters-workspace.mjs',
  'scripts/audit-succession-organizations-workspace.mjs',
  'scripts/audit-succession-people-institutions-closure.mjs',
  'scripts/audit-succession-nen-systems-workspace.mjs',
  'scripts/audit-succession-story-intelligence-workspace.mjs',
  'scripts/audit-succession-events-workspace.mjs',
  'scripts/audit-succession-locations-workspace.mjs',
  'scripts/audit-succession-black-whale-bridge.mjs',
  'scripts/audit-succession-assignments-workspace.mjs',
  'scripts/audit-succession-relationships-workspace.mjs',
  'scripts/audit-succession-foundation-closure.mjs',
  'scripts/audit-succession-reader.mjs',
  'scripts/audit-succession-production-surface.mjs',
  'scripts/audit-succession-product-inventory.mjs',
  'scripts/audit-succession-final-product-closure.mjs',
]);

const [app, primitives, router, packageText, ...auditSources] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/lib/appRouter.js'),
  read('package.json'),
  ...auditPaths.map(read),
]);
const packageJson = JSON.parse(packageText);

for (const routeId of ['characters', 'organizations', 'locations', 'bodyguards', 'relationships', 'nen', 'guardian-spirit-beasts', 'chapters', 'events']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must remain a specialized record route`);
}
for (const routeId of ['black-whale', 'timeline']) assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual workspace`);
assert(!declarationIncludesLiteral(app, 'preserved', 'nen'), 'Nen must remain migrated out of the preserved legacy layer');
for (const routeId of ['story', 'chapters', 'characters', 'princes', 'queens', 'bodyguards', 'organizations', 'nen', 'guardian-spirit-beasts', 'events', 'locations', 'relationships', 'research', 'glossary']) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain a dedicated workspace route`);
}
for (const [routeId, componentName] of [
  ['story', 'StoryIntelligenceWorkspace'],
  ['chapters', 'ChapterStoryWorkspace'],
  ['characters', 'CharactersWorkspace'],
  ['princes', 'PrincesWorkspace'],
  ['queens', 'QueensWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace'],
  ['organizations', 'OrganizationsWorkspace'],
  ['nen', 'NenWorkspace'],
  ['guardian-spirit-beasts', 'GuardianBeastsWorkspace'],
  ['events', 'EventsWorkspace'],
  ['locations', 'LocationsWorkspace'],
  ['relationships', 'RelationshipsWorkspace'],
  ['research', 'EvidenceWorkspace'],
  ['glossary', 'GlossaryWorkspace'],
]) assert(sourceRendersRouteWith(app, routeId, componentName), `${routeId} must render ${componentName}`);

for (const removedComponent of ['HuntersWorkspace', 'MafiaWorkspace', 'MilitaryWorkspace', 'PoliticsWorkspace', 'BodyStatesWorkspace', 'MediaWorkspace']) {
  assert(!app.includes(removedComponent), `${removedComponent} must not return to the active application`);
}
assert(!app.includes('SuccessionStoryWorkspace'), 'legacy static Story workspace must remain inactive');
assert(!app.includes('ChapterRecordsWorkspaceV2'), 'legacy chapter ledger must remain inactive');
assert(app.includes("linkedEntity?.entityType === 'character'") && app.includes("linkedEntity?.entityType === 'organization'"), 'entity navigation must normalize character and organization links');
assert(app.includes("linkedEntity?.entityType === 'ability'") && app.includes("linkedEntity?.entityType === 'guardian-beast'"), 'system navigation must normalize ability and beast links');
assert(app.includes('successionArchiveRetiredTargets') && router.includes('resolveSuccessionTarget'), 'active navigation and browser routing must normalize retired routes');
assert(app.includes('showCharacterDossier') && app.includes('showOrganizationDossier'), 'people and institution URLs must resolve dedicated dossiers');
assert(app.includes('showAbilityDossier') && app.includes('showGuardianBeastDossier'), 'Nen URLs must resolve dedicated dossiers');
assert(app.includes('searchArchiveProduct') && app.includes('matchReason') && app.includes('spoilerLimit'), 'global search must be grouped, explained, and chapter-bounded');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared entity routing must send every character to Characters');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared entity routing must send every organization to Organizations');
assert(primitives.includes("if (entity.entityType === 'ability') return 'nen'"), 'shared entity routing must send every ability to Nen');
assert(primitives.includes("if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts'"), 'shared entity routing must send every beast to Guardian Spirit Beasts');

const forbiddenAuditPatterns = Object.freeze([
  { pattern: /counts\.chapters\s*===\s*75|pendingChapterIds\.length\s*===\s*1.*chapter:414/, message: 'audits must derive chapter coverage from imported data' },
  { pattern: /authoritativeWorkspaces\s*===\s*\d+/, message: 'audits must derive workspace totals from the maintained inventory' },
  { pattern: /successionArchiveRoutes\.length\s*(?:===|>=)\s*2[0-9]/, message: 'audits must not restore the retired route-count contract' },
  { pattern: /const\s+retiredRedirects\s*=\s*Object\.freeze\(\{/, message: 'audits must derive retired redirects from the canonical registry' },
]);
for (let index = 0; index < auditPaths.length; index += 1) {
  for (const forbidden of forbiddenAuditPatterns) assert(!forbidden.pattern.test(auditSources[index]), `${auditPaths[index]}: ${forbidden.message}`);
}

assert(packageJson.scripts?.['audit:succession-runtime'] === 'node scripts/run-succession-runtime-audits.mjs', 'package scripts must expose the aggregate Succession runtime sweep');
assert(packageJson.scripts?.['audit:succession-contract'] === 'node scripts/audit-succession-runtime-contract.mjs', 'package scripts must expose this contract audit directly');
assert(packageJson.scripts?.['audit:succession-product-inventory'] === 'node scripts/audit-succession-product-inventory.mjs', 'package scripts must expose the product inventory audit');
assert(packageJson.scripts?.['audit:succession-final-product'] === 'node scripts/audit-succession-final-product-closure.mjs', 'package scripts must expose the final-product audit');
assert(packageJson.scripts?.['build:runtime']?.startsWith('npm run audit:succession-runtime &&'), 'build:runtime must collect all Succession failures before continuing');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const routes = await vite.ssrLoadModule('/src/data/succession/archiveRoutes.js');
  assert(archive.successionArchiveValidation?.valid, 'canonical Succession data must validate');

  const routeIds = new Set(routes.successionArchiveRoutes.map((route) => route.id));
  for (const [retired, destination] of Object.entries(routes.successionArchiveRetiredTargets)) {
    assert(!routeIds.has(retired), `${retired} must not remain a primary route`);
    assert(routes.successionArchiveLegacyTargets[retired] === destination, `${retired} must redirect to ${destination}`);
    assert(routes.successionArchivePathToTarget.get(retired) === destination, `${retired} clean path must redirect to ${destination}`);
    assert(routeIds.has(destination), `${retired} must resolve to a maintained route`);
  }

  for (const [entityType, minimum] of [
    ['organization', 11], ['ability', 30], ['guardian-beast', 15], ['event', 29], ['location', 42], ['assignment', 37], ['relationship', 54], ['chapter', 75],
  ]) {
    const records = archive.getEntitiesByType(entityType);
    assert(records.length >= minimum, `${entityType} runtime layer must retain at least ${minimum} records, found ${records.length}`);
  }

  for (const selector of [
    'getLocationSnapshot', 'getAssignmentSnapshot', 'getRelationshipSnapshot', 'getFoundationClosureReport',
    'getCharacterStateAtChapter', 'getCharacterDossier', 'getCharacterAffiliationsAtChapter', 'getCharacterRoleProfile',
    'getOrganizationStateAtChapter', 'getOrganizationPersonnelAtChapter', 'getOrganizationHierarchy', 'getOrganizationDossier',
    'getAbilityDossier', 'getNenSystemDossier', 'getGuardianBeastStateAtChapter', 'getGuardianBeastDossier',
    'getStoryPhaseAtChapter', 'getStoryPhaseDossier', 'getStoryLaneDossier', 'getStoryThreadDossier',
    'getChapterStoryDossier', 'searchStoryIntelligence', 'getStoryIntelligenceClosureReport',
    'getGlossaryEntryAtChapter', 'getGlossaryEntriesAtChapter', 'getMediaRecordsAtChapter', 'searchArchiveProduct',
    'getProductClosureReport', 'getFinalReleaseClosureReport', 'isSuccessionEntityAvailableAtChapter', 'searchSuccessionArchive',
  ]) assert(typeof archive[selector] === 'function', `${selector} must remain public`);

  const organizations = archive.getEntitiesByType('organization');
  assert(archive.getOrganizationsWithStateProfiles().length === organizations.length, 'every organization must retain an explicit state profile');
  const organizationCoverage = archive.getOrganizationStateCoverageReport();
  assert(organizationCoverage.explicitOrganizations === organizations.length && organizationCoverage.coveragePercent === 100, 'organization coverage must remain complete');

  const peopleClosure = archive.getPeopleInstitutionClosureReport();
  assert(peopleClosure?.closureReady && peopleClosure.status === 'closed', 'people and institution closure must remain closed');
  const nenClosure = archive.getNenSystemClosureReport();
  assert(nenClosure?.closureReady && nenClosure.status === 'closed', 'Nen and ritual systems closure must remain closed');

  const chapters = archive.getEntitiesByType('chapter');
  const firstChapter = chapters[0]?.number;
  const latestChapter = chapters.at(-1)?.number;
  assert(Number.isFinite(firstChapter) && Number.isFinite(latestChapter), 'canonical chapter boundaries must remain numeric');
  assert(chapters.length === latestChapter - firstChapter + 1, `chapter catalogue must remain contiguous from ${firstChapter} through ${latestChapter}`);
  const storyClosure = archive.getStoryIntelligenceClosureReport();
  assert(storyClosure?.closureReady && storyClosure.status === 'closed', 'chapter and story intelligence closure must remain closed');
  assert(storyClosure.counts.chapters === chapters.length, 'story chapter count must follow canonical imported data');

  assert(!archive.isSuccessionEntityAvailableAtChapter('ability:parallel-future', 384), 'Parallel Future must remain unavailable through Chapter 384');
  assert(archive.isSuccessionEntityAvailableAtChapter('ability:parallel-future', 385), 'Parallel Future must become available at Chapter 385');
  assert(archive.searchArchiveProduct('GSB', { chapter: 349, limit: 100 }).some((result) => result.id === 'glossary:guardian-spirit-beast'), 'unified search must resolve glossary synonyms');
  assert(archive.searchArchiveProduct('Room 1014', { chapter: latestChapter, limit: 100 }).every((result) => result.matchReason), 'unified search must explain every match');
  assert(archive.searchArchiveProduct('Kurapika portrait', { chapter: latestChapter, limit: 100 }).some((result) => result.domain === 'media' && result.route === 'research'), 'media search must route through Research');

  const productClosure = archive.getProductClosureReport();
  assert(productClosure?.closureReady && productClosure.status === 'release-candidate', 'search, glossary, and maintained media closure must reach release-candidate status');
  assert(productClosure.glossary.total >= 24 && productClosure.glossary.referenceIssues.length === 0, 'canonical glossary references must remain complete');
  assert(productClosure.media.total > 0 && productClosure.media.issues.length === 0, 'canonical media provenance must remain complete despite removing the standalone page');

  const finalReport = archive.getFinalReleaseClosureReport();
  assert(finalReport?.closureReady && finalReport.status === 'release-candidate', 'the complete Succession Archive must reach release-candidate status before deployment');
  const inventoryRouteCount = finalReport.productInventory.authoritativeWorkspaces.length + finalReport.productInventory.preservedVisualTools.length;
  assert(inventoryRouteCount === routes.successionArchiveRoutes.length, 'final inventory must cover the canonical route registry exactly');
  assert(finalReport.productInventory.counts.authoritativeWorkspaces === finalReport.productInventory.authoritativeWorkspaces.length, 'authoritative workspace totals must be derived');
  assert(finalReport.productInventory.counts.preservedVisualTools === finalReport.productInventory.preservedVisualTools.length, 'preserved-tool totals must be derived');
  assert(finalReport.productInventory.counts.releaseGates === finalReport.productInventory.releaseGates.length, 'release-gate totals must be derived');
  assert(finalReport.deploymentRequiredForClosedStatus && finalReport.releaseGates.cloudflareDeployment === 'pending-external-build-result', 'only an external successful deployment may promote the project from release-candidate to closed');

  console.log(`Succession runtime contract audit passed: ${auditPaths.length} audits protect the canonical graph through imported Chapter ${latestChapter}; ${routes.successionArchiveRoutes.length} consolidated routes, ${Object.keys(routes.successionArchiveRetiredTargets).length} registry-derived redirects, and final release reporting form a deployment-ready release candidate.`);
} finally {
  await vite.close();
}
