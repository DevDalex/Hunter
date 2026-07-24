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
  'scripts/audit-succession-events-workspace.mjs',
  'scripts/audit-succession-locations-workspace.mjs',
  'scripts/audit-succession-black-whale-bridge.mjs',
  'scripts/audit-succession-assignments-workspace.mjs',
  'scripts/audit-succession-relationships-workspace.mjs',
  'scripts/audit-succession-foundation-closure.mjs',
  'scripts/audit-succession-reader.mjs',
]);

const [app, packageText, ...auditSources] = await Promise.all([
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('package.json'),
  ...auditPaths.map(read),
]);
const packageJson = JSON.parse(packageText);

for (const routeId of ['characters', 'locations', 'bodyguards', 'relationships']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must remain a specialized record route`);
}
for (const routeId of ['black-whale', 'timeline', 'nen']) {
  assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual workspace`);
}
for (const routeId of ['characters', 'events', 'locations', 'bodyguards', 'relationships', 'research']) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain a dedicated workspace route`);
}
for (const [routeId, componentName] of [
  ['characters', 'CharactersWorkspace'],
  ['events', 'EventsWorkspace'],
  ['locations', 'LocationsWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace'],
  ['relationships', 'RelationshipsWorkspace'],
  ['research', 'EvidenceWorkspace'],
]) {
  assert(sourceRendersRouteWith(app, routeId, componentName), `${routeId} must render ${componentName}`);
}

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
  assert(archive.getCharactersWithStateProfiles().length >= 10, 'Batch 2 must retain explicit state profiles for the high-value cast');

  console.log(`Succession runtime contract audit passed: ${auditPaths.length} audits avoid transient foundation imports, route membership is order-independent, aggregate failure collection is active, and the canonical runtime exposes every Batch 1 graph layer plus the Batch 2 character state foundation.`);
} finally {
  await vite.close();
}
