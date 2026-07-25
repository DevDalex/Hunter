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
  'scripts/audit-succession-final-product-closure.mjs',
]);

const [app, primitives, packageText, ...auditSources] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('package.json'),
  ...auditPaths.map(read),
]);
const packageJson = JSON.parse(packageText);

for (const routeId of ['characters', 'organizations', 'locations', 'bodyguards', 'relationships', 'nen', 'guardian-spirit-beasts', 'chapters', 'events']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must remain a specialized record route`);
}
for (const routeId of ['black-whale', 'timeline']) assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual workspace`);
assert(!declarationIncludesLiteral(app, 'preserved', 'nen'), 'Nen must remain migrated out of the preserved legacy layer');
for (const routeId of ['story', 'chapters', 'characters', 'organizations', 'nen', 'guardian-spirit-beasts', 'events', 'locations', 'bodyguards', 'relationships', 'research', 'glossary', 'media']) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain a dedicated workspace route`);
}
for (const [routeId, componentName] of [
  ['story', 'StoryIntelligenceWorkspace'],
  ['chapters', 'ChapterStoryWorkspace'],
  ['characters', 'CharactersWorkspace'],
  ['organizations', 'OrganizationsWorkspace'],
  ['nen', 'NenWorkspace'],
  ['guardian-spirit-beasts', 'GuardianBeastsWorkspace'],
  ['events', 'EventsWorkspace'],
  ['locations', 'LocationsWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace'],
  ['relationships', 'RelationshipsWorkspace'],
  ['research', 'EvidenceWorkspace'],
  ['glossary', 'GlossaryWorkspace'],
  ['media', 'MediaWorkspace'],
]) assert(sourceRendersRouteWith(app, routeId, componentName), `${routeId} must render ${componentName}`);

assert(!app.includes('SuccessionStoryWorkspace'), 'legacy static Story workspace must remain inactive');
assert(!app.includes('ChapterRecordsWorkspaceV2'), 'legacy chapter ledger must remain inactive');
assert(app.includes("linkedEntity?.entityType === 'character'") && app.includes("linkedEntity?.entityType === 'organization'"), 'role-route navigation must normalize character and organization links');
assert(app.includes("linkedEntity?.entityType === 'ability'") && app.includes("linkedEntity?.entityType === 'guardian-beast'"), 'system-route navigation must normalize ability and beast links');
assert(app.includes('showCharacterDossier') && app.includes('showOrganizationDossier'), 'people and institution legacy URLs must resolve dedicated dossiers');
assert(app.includes('showAbilityDossier') && app.includes('showGuardianBeastDossier'), 'Nen legacy URLs must resolve dedicated dossiers');
assert(app.includes('searchArchiveProduct') && app.includes('matchReason') && app.includes('spoilerLimit'), 'final global search must be grouped, explained, and chapter-bounded');
assert(app.includes('princes.find((record) => record.princeOrder === Number(order))'), 'family-tree navigation must use the candidate prince record');
assert(!app.includes('princes.find((record) => entity.princeOrder'), 'family-tree navigation must not self-reference its result variable');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared entity routing must send every character to the character workspace');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared entity routing must send every organization to the organization workspace');
assert(primitives.includes("if (entity.entityType === 'ability') return 'nen'"), 'shared entity routing must send every ability to the Nen workspace');
assert(primitives.includes("if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts'"), 'shared entity routing must send every beast to the Guardian Beast workspace');

const forbiddenAuditPatterns = Object.freeze([
  { pattern: /dataEntry\.includes\(\s*["']from '\.\/entities(?:Location|Assignment|Relationship)Foundation\.js'/, message: 'audits must validate active runtime data rather than a transient foundation import path' },
  { pattern: /app\.includes\(\s*["'](?:const specializedRecordRoute = )?\['princes'/, message: 'audits must inspect route membership rather than an exact ordered array literal' },
  { pattern: /counts\.chapters\s*===\s*75|pendingChapterIds\.length\s*===\s*1.*chapter:414/, message: 'audits must derive chapter and pending-release coverage from canonical imported data' },
]);
for (let index = 0; index < auditPaths.length; index += 1) {
  for (const forbidden of forbiddenAuditPatterns) assert(!forbidden.pattern.test(auditSources[index]), `${auditPaths[index]}: ${forbidden.message}`);
}

assert(packageJson.scripts?.['audit:succession-runtime'] === 'node scripts/run-succession-runtime-audits.mjs', 'package scripts must expose the aggregate Succession runtime sweep');
assert(packageJson.scripts?.['audit:succession-contract'] === 'node scripts/audit-succession-runtime-contract.mjs', 'package scripts must expose this contract audit directly');
assert(packageJson.scripts?.['audit:succession-characters'] === 'node scripts/audit-succession-characters-workspace.mjs', 'package scripts must expose the Batch 2 character audit');
assert(packageJson.scripts?.['audit:succession-organizations'] === 'node scripts/audit-succession-organizations-workspace.mjs', 'package scripts must expose the Batch 2 organization audit');
assert(packageJson.scripts?.['audit:succession-people-institutions'] === 'node scripts/audit-succession-people-institutions-closure.mjs', 'package scripts must expose the Batch 2 closure audit');
assert(packageJson.scripts?.['audit:succession-nen-systems'] === 'node scripts/audit-succession-nen-systems-workspace.mjs', 'package scripts must expose the Batch 3 systems audit');
assert(packageJson.scripts?.['audit:succession-story-intelligence'] === 'node scripts/audit-succession-story-intelligence-workspace.mjs', 'package scripts must expose the Batch 4 story intelligence audit');
assert(packageJson.scripts?.['audit:succession-final-product'] === 'node scripts/audit-succession-final-product-closure.mjs', 'package scripts must expose the Batch 5 final-product audit');
assert(packageJson.scripts?.['build:runtime']?.startsWith('npm run audit:succession-runtime &&'), 'build:runtime must collect all Succession failures before continuing');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  assert(archive.successionArchiveValidation?.valid, 'canonical Succession data must validate');
  for (const [entityType, minimum] of [
    ['organization', 11], ['ability', 30], ['guardian-beast', 15], ['event', 29], ['location', 42], ['assignment', 37], ['relationship', 54], ['chapter', 75],
  ]) {
    const records = archive.getEntitiesByType(entityType);
    assert(records.length >= minimum, `${entityType} runtime layer must retain at least ${minimum} records, found ${records.length}`);
  }

  for (const selector of [
    'getLocationSnapshot', 'getAssignmentSnapshot', 'getRelationshipSnapshot', 'getFoundationClosureReport',
    'getCharacterStateAtChapter', 'getCharacterDossier', 'getCharacterAffiliationsAtChapter', 'getCharacterRoleProfile',
    'getCharacterLifetimeTimeline', 'getCharacterStateCoverageReport', 'getOrganizationStateAtChapter',
    'getOrganizationPersonnelAtChapter', 'getOrganizationHierarchy', 'getOrganizationDossier',
    'getOrganizationStateCoverageReport', 'getAbilityKnowledgeAtChapter', 'getAbilitiesKnownAtChapter',
    'getAbilityDossier', 'getNenSystemDossier', 'getGuardianBeastStateAtChapter', 'getGuardianBeastDossier',
    'getNenSystemClosureReport', 'getStoryPhaseAtChapter', 'getStoryPhaseDossier', 'getStoryLanesAtChapter',
    'getStoryLaneDossier', 'getStoryThreadDossier', 'getStoryThreadsAtChapter', 'getStoryCausalGraphAtChapter',
    'getChapterStoryDossier', 'getStorySnapshotAtChapter', 'searchStoryIntelligence', 'getStoryIntelligenceClosureReport',
    'getGlossaryEntryAtChapter', 'getGlossaryEntriesAtChapter', 'getMediaRecordsAtChapter', 'searchArchiveProduct',
    'getProductClosureReport', 'getFinalReleaseClosureReport', 'isSuccessionEntityAvailableAtChapter', 'searchSuccessionArchive',
  ]) assert(typeof archive[selector] === 'function', `${selector} must remain public`);

  assert(archive.getCharactersWithStateProfiles().length >= 42, 'Batch 2 closure must retain complete royal and institution-leader state coverage');
  const characterCoverage = archive.getCharacterStateCoverageReport();
  assert(characterCoverage.explicitCharacters >= 42, 'Batch 2 closure must retain at least forty-two explicit character profiles');
  assert(characterCoverage.roleLayers.some((layer) => layer.id === 'royal-candidate' && layer.explicit === 14), 'all princes must remain explicit');
  assert(characterCoverage.roleLayers.some((layer) => layer.id === 'royal-household' && layer.explicit === 8), 'all queens must remain explicit');

  const organizations = archive.getEntitiesByType('organization');
  assert(archive.getOrganizationsWithStateProfiles().length === organizations.length, 'every organization must retain an explicit state profile');
  const organizationCoverage = archive.getOrganizationStateCoverageReport();
  assert(organizationCoverage.explicitOrganizations === organizations.length && organizationCoverage.coveragePercent === 100, 'organization coverage must remain complete');

  const peopleClosure = archive.getPeopleInstitutionClosureReport();
  assert(peopleClosure?.closureReady && peopleClosure.status === 'closed', 'Batch 2 people and institution closure must remain closed');
  assert(peopleClosure.characters.priorityExplicit === peopleClosure.characters.priorityTotal, 'all priority actors must remain explicit');
  assert(peopleClosure.organizations.explicit === peopleClosure.organizations.total, 'all institutions must remain explicit');
  assert(peopleClosure.routes.violations.length === 0, 'people and institutions must retain canonical routes');

  const nenClosure = archive.getNenSystemClosureReport();
  assert(nenClosure?.closureReady && nenClosure.status === 'closed', 'Batch 3 Nen and ritual systems closure must remain closed');
  assert(nenClosure.guardianBeasts.total === 15 && nenClosure.guardianBeasts.explicitStateProfiles === 15, 'all fifteen Guardian Spirit Beasts must retain explicit state profiles');
  assert(nenClosure.abilities.validDossiers === nenClosure.abilities.total, 'every ability must retain a valid chapter-bounded dossier');
  assert(nenClosure.systems.total === 8, 'all eight canonical Nen and ritual system profiles must remain active');
  assert(nenClosure.stateIntegrityIssues.length === 0 && nenClosure.missingSystemReferences.length === 0, 'Nen state and graph integrity must remain clean');

  const chapters = archive.getEntitiesByType('chapter');
  const firstChapter = chapters[0]?.number;
  const latestChapter = chapters.at(-1)?.number;
  assert(Number.isFinite(firstChapter) && Number.isFinite(latestChapter), 'canonical chapter boundaries must remain numeric');
  assert(chapters.length === latestChapter - firstChapter + 1, `chapter catalogue must remain contiguous from ${firstChapter} through ${latestChapter}`);

  const storyClosure = archive.getStoryIntelligenceClosureReport();
  assert(storyClosure?.closureReady && storyClosure.status === 'closed', 'Batch 4 chapter and story intelligence closure must remain closed');
  assert(storyClosure.counts.chapters === chapters.length, 'Batch 4 chapter count must follow canonical imported data');
  assert(storyClosure.chapterRange.start === firstChapter && storyClosure.chapterRange.end === latestChapter, 'Batch 4 range must follow canonical imported data');
  assert(storyClosure.counts.phases >= 11 && storyClosure.counts.lanes === 7, 'Batch 4 must retain documented phases, a generated pending phase when needed, and seven story lanes');
  assert(storyClosure.counts.threads >= 20 && storyClosure.counts.causalLinks >= 17, 'Batch 4 must retain the unresolved-thread and causal graph foundation');
  assert(storyClosure.phaseCoverageIssues.length === 0 && storyClosure.phaseContinuityIssues.length === 0, 'story phase coverage and continuity must remain clean');
  assert(storyClosure.missingReferences.length === 0 && storyClosure.chapterProjectionIssues.length === 0, 'story graph references and chapter projections must remain clean');

  const storyPhases = Object.values(archive.successionArchiveData.storyPhaseProfiles || {});
  const documentedEnd = Math.max(...storyPhases.filter((phase) => phase.status !== 'pending-maintained-research').map((phase) => phase.chapterRange.end ?? phase.chapterRange.start));
  const expectedPendingIds = chapters.filter((chapter) => chapter.number > documentedEnd).map((chapter) => chapter.id);
  assert(JSON.stringify(storyClosure.pendingChapterIds) === JSON.stringify(expectedPendingIds), 'pending story records must follow imported chapters after the last documented phase');
  for (const chapterId of expectedPendingIds) {
    const chapterNumber = Number(chapterId.split(':').at(-1));
    assert(archive.getStoryPhaseAtChapter(chapterNumber)?.status === 'pending-maintained-research', `${chapterId} must resolve a pending research phase`);
    const dossier = archive.getChapterStoryDossier(chapterNumber);
    assert(dossier?.events.length === 0 && dossier.lanes.length === 0 && dossier.threads.length === 0, `${chapterId} must not manufacture story claims`);
  }

  assert(archive.getStoryPhaseAtChapter(349)?.id === 'story-phase:succession-preparation', 'Chapter 349 must resolve succession preparation');
  assert(archive.getStoryPhaseAtChapter(383)?.id === 'story-phase:escape-failure-and-hidden-systems', 'Chapter 383 must resolve the escape-failure phase');
  assert(archive.getStoryPhaseAtChapter(401)?.id === 'story-phase:treaties-possession-and-convergence', 'Chapter 401 must resolve the treaty and possession convergence phase');
  assert(archive.getStoryLaneDossier('story-lane:mafia-war', 377) === null, 'mafia story intelligence must remain hidden before Chapter 378');
  assert(archive.getStoryLaneDossier('story-lane:mafia-war', 378)?.profile.id === 'story-lane:mafia-war', 'mafia story intelligence must appear at Chapter 378');
  assert(archive.getStoryThreadDossier('story-thread:borksen-autonomy', 409) === null, 'Borksen autonomy must remain hidden before Chapter 410');
  assert(archive.getStoryThreadDossier('story-thread:borksen-autonomy', 410)?.status === 'open', 'Borksen autonomy must open at Chapter 410');
  assert(!archive.searchStoryIntelligence('Borksen autonomy', { chapter: 409 }).some((result) => result.id === 'story-thread:borksen-autonomy'), 'story search must hide future threads');
  assert(archive.searchStoryIntelligence('Borksen autonomy', { chapter: 410 }).some((result) => result.id === 'story-thread:borksen-autonomy'), 'story search must reveal threads at their opening chapter');
  assert(!archive.getStoryCausalGraphAtChapter(383).edges.some((link) => link.id === 'story-cause:twin-escape-to-kacho-letters'), 'causal graph must hide future consequences');
  assert(archive.getStoryCausalGraphAtChapter(413).edges.some((link) => link.id === 'story-cause:balsamilco-to-funeral'), 'causal graph must retain the possession-to-funeral chain');

  assert(!archive.isSuccessionEntityAvailableAtChapter('ability:parallel-future', 384), 'Parallel Future must remain unavailable through Chapter 384');
  assert(archive.isSuccessionEntityAvailableAtChapter('ability:parallel-future', 385), 'Parallel Future must become available at Chapter 385');
  assert(archive.getGuardianBeastDossier('guardian-beast:woble', 348) === null, 'Guardian Spirit Beast dossiers must remain hidden before Chapter 349');
  assert(!archive.searchSuccessionArchive('Parallel Future', { types: ['ability'], chapter: 384 }).some(({ entity }) => entity.id === 'ability:parallel-future'), 'global search must hide future abilities');
  assert(archive.searchSuccessionArchive('Parallel Future', { types: ['ability'], chapter: 385 }).some(({ entity }) => entity.id === 'ability:parallel-future'), 'global search must reveal abilities at their evidence chapter');
  assert(!archive.searchSuccessionArchive('reached Yes', { chapter: 409 }).some(({ entity }) => ['character:borksen', 'organization:heil-ly'].includes(entity.id)), 'global state search must hide future membership outcomes');
  assert(archive.searchSuccessionArchive('reached Yes', { chapter: 410 }).some(({ entity }) => ['character:borksen', 'organization:heil-ly'].includes(entity.id)), 'global state search must reveal confirmed membership outcomes');

  const contagion378 = archive.getNenSystemDossier('nen-system:contagion-progression', 378);
  const contagion410 = archive.getNenSystemDossier('nen-system:contagion-progression', 410);
  assert(!contagion378?.characters.some((character) => character.id === 'character:borksen'), 'early Contagion dossiers must not expose Borksen');
  assert(contagion410?.characters.some((character) => character.id === 'character:borksen'), 'Contagion must include Borksen after the recruitment outcome');

  const productClosure = archive.getProductClosureReport();
  assert(productClosure?.closureReady && productClosure.status === 'release-candidate', 'Batch 5 search, glossary, and media closure must reach release-candidate status');
  assert(productClosure.glossary.total >= 24 && productClosure.glossary.referenceIssues.length === 0, 'canonical glossary references must remain complete');
  assert(productClosure.media.total > 0 && productClosure.media.issues.length === 0, 'canonical media provenance must remain complete and deduplicated');
  assert(archive.getGlossaryEntryAtChapter('glossary:parallel-future', 384) === null && archive.getGlossaryEntryAtChapter('glossary:parallel-future', 385), 'glossary records must obey ability revelation timing');
  assert(!archive.searchArchiveProduct('Parallel Future', { chapter: 384, limit: 100 }).some((result) => ['ability:parallel-future', 'glossary:parallel-future', 'story-thread:tserriednich-future-growth'].includes(result.id)), 'unified search must hide future ability language');
  assert(archive.searchArchiveProduct('Borksen autonomy', { chapter: 410, limit: 100 }).some((result) => result.id === 'story-thread:borksen-autonomy'), 'unified search must resolve normalized Story threads');
  assert(archive.searchArchiveProduct('GSB', { chapter: 349, limit: 100 }).some((result) => result.id === 'glossary:guardian-spirit-beast'), 'unified search must resolve glossary synonyms');
  assert(archive.searchArchiveProduct('Room 1014', { chapter: latestChapter, limit: 100 }).every((result) => result.matchReason), 'unified search must explain every match');

  const finalReport = archive.getFinalReleaseClosureReport();
  assert(finalReport?.closureReady && finalReport.status === 'release-candidate', 'the complete Succession Archive must reach release-candidate status before deployment');
  assert(finalReport.deploymentRequiredForClosedStatus && finalReport.releaseGates.cloudflareDeployment === 'pending-external-build-result', 'only an external successful deployment may promote the project from release-candidate to closed');

  console.log(`Succession runtime contract audit passed: ${auditPaths.length} audits protect the canonical graph through imported Chapter ${latestChapter}; Batches 1–4 remain closed and Batch 5 search, glossary, media, legacy cleanup, and final release reporting form a deployment-ready release candidate.`);
} finally {
  await vite.close();
}
