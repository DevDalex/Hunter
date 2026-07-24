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
  'scripts/audit-succession-archive-shell.mjs',
  'scripts/audit-succession-characters-workspace.mjs',
  'scripts/audit-succession-organizations-workspace.mjs',
  'scripts/audit-succession-people-institutions-closure.mjs',
  'scripts/audit-succession-nen-systems-workspace.mjs',
  'scripts/audit-succession-events-workspace.mjs',
  'scripts/audit-succession-locations-workspace.mjs',
  'scripts/audit-succession-black-whale-bridge.mjs',
  'scripts/audit-succession-assignments-workspace.mjs',
  'scripts/audit-succession-relationships-workspace.mjs',
  'scripts/audit-succession-foundation-closure.mjs',
  'scripts/audit-succession-reader.mjs',
]);

const [app, primitives, packageText, ...auditSources] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('package.json'),
  ...auditPaths.map(read),
]);
const packageJson = JSON.parse(packageText);

for (const routeId of ['characters', 'organizations', 'locations', 'bodyguards', 'relationships', 'nen', 'guardian-spirit-beasts']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must remain a specialized record route`);
}
for (const routeId of ['black-whale', 'timeline']) {
  assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual workspace`);
}
assert(!declarationIncludesLiteral(app, 'preserved', 'nen'), 'Nen must remain migrated out of the preserved legacy layer');
for (const routeId of ['characters', 'organizations', 'nen', 'guardian-spirit-beasts', 'events', 'locations', 'bodyguards', 'relationships', 'research']) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain a dedicated workspace route`);
}
for (const [routeId, componentName] of [
  ['characters', 'CharactersWorkspace'],
  ['organizations', 'OrganizationsWorkspace'],
  ['nen', 'NenWorkspace'],
  ['guardian-spirit-beasts', 'GuardianBeastsWorkspace'],
  ['events', 'EventsWorkspace'],
  ['locations', 'LocationsWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace'],
  ['relationships', 'RelationshipsWorkspace'],
  ['research', 'EvidenceWorkspace'],
]) assert(sourceRendersRouteWith(app, routeId, componentName), `${routeId} must render ${componentName}`);

assert(app.includes("linkedEntity?.entityType === 'character'") && app.includes("linkedEntity?.entityType === 'organization'"), 'role-route navigation must normalize character and organization links');
assert(app.includes("linkedEntity?.entityType === 'ability'") && app.includes("linkedEntity?.entityType === 'guardian-beast'"), 'system-route navigation must normalize ability and beast links');
assert(app.includes('showCharacterDossier') && app.includes('showOrganizationDossier'), 'people and institution legacy URLs must resolve dedicated dossiers');
assert(app.includes('showAbilityDossier') && app.includes('showGuardianBeastDossier'), 'Nen legacy URLs must resolve dedicated dossiers');
assert(app.includes('chapter: spoilerLimit') && app.includes('SearchWorkspace onNavigate={navigate} spoilerLimit={spoilerLimit}'), 'global search must remain inside the selected chapter boundary');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared entity routing must send every character to the character workspace');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared entity routing must send every organization to the organization workspace');
assert(primitives.includes("if (entity.entityType === 'ability') return 'nen'"), 'shared entity routing must send every ability to the Nen workspace');
assert(primitives.includes("if (entity.entityType === 'guardian-beast') return 'guardian-spirit-beasts'"), 'shared entity routing must send every beast to the Guardian Beast workspace');

const forbiddenAuditPatterns = Object.freeze([
  {
    pattern: /dataEntry\.includes\(\s*["']from '\.\/entities(?:Location|Assignment|Relationship)Foundation\.js'/,
    message: 'audits must validate active runtime data rather than a transient foundation import path',
  },
  {
    pattern: /app\.includes\(\s*["'](?:const specializedRecordRoute = )?\['princes'/,
    message: 'audits must inspect route membership rather than an exact ordered array literal',
  },
]);

for (let index = 0; index < auditPaths.length; index += 1) {
  const source = auditSources[index];
  for (const forbidden of forbiddenAuditPatterns) assert(!forbidden.pattern.test(source), `${auditPaths[index]}: ${forbidden.message}`);
}

assert(packageJson.scripts?.['audit:succession-runtime'] === 'node scripts/run-succession-runtime-audits.mjs', 'package scripts must expose the aggregate Succession runtime sweep');
assert(packageJson.scripts?.['audit:succession-contract'] === 'node scripts/audit-succession-runtime-contract.mjs', 'package scripts must expose this contract audit directly');
assert(packageJson.scripts?.['audit:succession-characters'] === 'node scripts/audit-succession-characters-workspace.mjs', 'package scripts must expose the Batch 2 character audit');
assert(packageJson.scripts?.['audit:succession-organizations'] === 'node scripts/audit-succession-organizations-workspace.mjs', 'package scripts must expose the Batch 2 organization audit');
assert(packageJson.scripts?.['audit:succession-people-institutions'] === 'node scripts/audit-succession-people-institutions-closure.mjs', 'package scripts must expose the Batch 2 closure audit');
assert(packageJson.scripts?.['audit:succession-nen-systems'] === 'node scripts/audit-succession-nen-systems-workspace.mjs', 'package scripts must expose the Batch 3 systems audit');
assert(packageJson.scripts?.['build:runtime']?.startsWith('npm run audit:succession-runtime &&'), 'build:runtime must collect all Succession failures before continuing');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  assert(archive.successionArchiveValidation?.valid, 'canonical Succession data must validate');
  for (const [entityType, minimum] of [
    ['organization', 11],
    ['ability', 30],
    ['guardian-beast', 15],
    ['event', 29],
    ['location', 42],
    ['assignment', 37],
    ['relationship', 54],
    ['chapter', 75],
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
    'getNenSystemClosureReport', 'isSuccessionEntityAvailableAtChapter', 'searchSuccessionArchive',
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

  console.log(`Succession runtime contract audit passed: ${auditPaths.length} audits protect the canonical graph, Batch 2 people and institutions remain closed, and Batch 3 Nen, ritual, ability, Guardian Spirit Beast, linked-actor, and global-search knowledge remain chapter-bounded and closed.`);
} finally {
  await vite.close();
}
