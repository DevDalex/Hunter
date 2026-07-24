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

for (const routeId of ['characters', 'organizations', 'locations', 'bodyguards', 'relationships']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must remain a specialized record route`);
}
for (const routeId of ['black-whale', 'timeline', 'nen']) {
  assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual workspace`);
}
for (const routeId of ['characters', 'organizations', 'events', 'locations', 'bodyguards', 'relationships', 'research']) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain a dedicated workspace route`);
}
for (const [routeId, componentName] of [
  ['characters', 'CharactersWorkspace'],
  ['organizations', 'OrganizationsWorkspace'],
  ['events', 'EventsWorkspace'],
  ['locations', 'LocationsWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace'],
  ['relationships', 'RelationshipsWorkspace'],
  ['research', 'EvidenceWorkspace'],
]) {
  assert(sourceRendersRouteWith(app, routeId, componentName), `${routeId} must render ${componentName}`);
}
assert(app.includes("linkedEntity?.entityType === 'character'") && app.includes("linkedEntity?.entityType === 'organization'"), 'role-route navigation must normalize character and organization links');
assert(app.includes('showCharacterDossier') && app.includes("selectedEntity?.entityType === 'character'"), 'legacy role-route character URLs must resolve the dedicated character dossier');
assert(app.includes('showOrganizationDossier') && app.includes("selectedEntity?.entityType === 'organization'"), 'legacy role-route organization URLs must resolve the dedicated organization dossier');
assert(primitives.includes("if (entity.entityType === 'character') return 'characters'"), 'shared entity routing must send every character to the character workspace');
assert(primitives.includes("if (entity.entityType === 'organization') return 'organizations'"), 'shared entity routing must send every organization to the organization workspace');

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
  for (const forbidden of forbiddenAuditPatterns) {
    assert(!forbidden.pattern.test(source), `${auditPaths[index]}: ${forbidden.message}`);
  }
}

assert(packageJson.scripts?.['audit:succession-runtime'] === 'node scripts/run-succession-runtime-audits.mjs', 'package scripts must expose the aggregate Succession runtime sweep');
assert(packageJson.scripts?.['audit:succession-contract'] === 'node scripts/audit-succession-runtime-contract.mjs', 'package scripts must expose this contract audit directly');
assert(packageJson.scripts?.['audit:succession-characters'] === 'node scripts/audit-succession-characters-workspace.mjs', 'package scripts must expose the Batch 2 character audit');
assert(packageJson.scripts?.['audit:succession-organizations'] === 'node scripts/audit-succession-organizations-workspace.mjs', 'package scripts must expose the Batch 2 organization audit');
assert(packageJson.scripts?.['audit:succession-people-institutions'] === 'node scripts/audit-succession-people-institutions-closure.mjs', 'package scripts must expose the Batch 2 closure audit');
assert(packageJson.scripts?.['build:runtime']?.startsWith('npm run audit:succession-runtime &&'), 'build:runtime must collect all Succession failures before continuing');

const vite = await createServer({
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

try {
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  assert(archive.successionArchiveValidation?.valid, 'canonical Succession data must validate');
  for (const [entityType, minimum] of [
    ['organization', 11],
    ['event', 29],
    ['location', 42],
    ['assignment', 37],
    ['relationship', 54],
    ['chapter', 75],
  ]) {
    const records = archive.getEntitiesByType(entityType);
    assert(records.length >= minimum, `${entityType} runtime layer must retain at least ${minimum} records, found ${records.length}`);
  }
  assert(typeof archive.getLocationSnapshot === 'function', 'location selectors must remain public');
  assert(typeof archive.getAssignmentSnapshot === 'function', 'assignment selectors must remain public');
  assert(typeof archive.getRelationshipSnapshot === 'function', 'relationship selectors must remain public');
  assert(typeof archive.getFoundationClosureReport === 'function', 'evidence closure selectors must remain public');
  assert(typeof archive.getCharacterStateAtChapter === 'function', 'character state selectors must remain public');
  assert(typeof archive.getCharacterDossier === 'function', 'character dossier selector must remain public');
  assert(typeof archive.getCharacterAffiliationsAtChapter === 'function', 'chapter-bounded character affiliations must remain public');
  assert(typeof archive.getCharacterRoleProfile === 'function', 'role-specific character layers must remain public');
  assert(typeof archive.getCharacterLifetimeTimeline === 'function', 'lifetime character chronology must remain public');
  assert(typeof archive.getCharacterStateCoverageReport === 'function', 'character state coverage reporting must remain public');
  assert(archive.getCharactersWithStateProfiles().length >= 42, 'Batch 2 closure must retain complete royal and institution-leader state coverage');
  const characterCoverage = archive.getCharacterStateCoverageReport();
  assert(characterCoverage.explicitCharacters >= 42, 'Batch 2 closure must retain at least forty-two explicit character profiles');
  assert(characterCoverage.roleLayers.some((layer) => layer.id === 'royal-candidate' && layer.explicit === 14), 'all princes must remain explicit');
  assert(characterCoverage.roleLayers.some((layer) => layer.id === 'royal-household' && layer.explicit === 8), 'all queens must remain explicit');

  assert(typeof archive.getOrganizationStateAtChapter === 'function', 'organization state selectors must remain public');
  assert(typeof archive.getOrganizationPersonnelAtChapter === 'function', 'organization personnel selectors must remain public');
  assert(typeof archive.getOrganizationHierarchy === 'function', 'organization hierarchy selector must remain public');
  assert(typeof archive.getOrganizationDossier === 'function', 'organization dossier selector must remain public');
  assert(typeof archive.getOrganizationStateCoverageReport === 'function', 'organization coverage reporting must remain public');
  const organizations = archive.getEntitiesByType('organization');
  assert(archive.getOrganizationsWithStateProfiles().length === organizations.length, 'every organization must retain an explicit state profile');
  const organizationCoverage = archive.getOrganizationStateCoverageReport();
  assert(organizationCoverage.explicitOrganizations === organizations.length && organizationCoverage.coveragePercent === 100, 'organization coverage must remain complete');

  assert(typeof archive.getCanonicalPeopleInstitutionRoute === 'function', 'canonical people and institution routing must remain public');
  assert(typeof archive.getPeopleInstitutionRecord === 'function', 'cross-domain dossier resolution must remain public');
  assert(typeof archive.getPeopleInstitutionCoverageGaps === 'function', 'people and institution gap reporting must remain public');
  assert(typeof archive.getPeopleInstitutionClosureReport === 'function', 'Batch 2 closure reporting must remain public');
  const closure = archive.getPeopleInstitutionClosureReport();
  assert(closure?.closureReady && closure.status === 'closed', 'Batch 2 people and institution closure must remain closed');
  assert(closure.characters.priorityExplicit === closure.characters.priorityTotal, 'all priority actors must remain explicit');
  assert(closure.organizations.explicit === closure.organizations.total, 'all institutions must remain explicit');
  assert(closure.routes.violations.length === 0, 'people and institutions must retain canonical routes');

  console.log(`Succession runtime contract audit passed: ${auditPaths.length} audits avoid transient foundation imports, route membership is order-independent, aggregate failure collection is active, every person and institution resolves a canonical dossier, and Batch 2 remains closed with chapter-bounded status, affiliation, evidence, and institutional state.`);
} finally {
  await vite.close();
}
