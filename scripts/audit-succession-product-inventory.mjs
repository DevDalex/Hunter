import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { successionArchiveRetiredTargets } from '../src/data/succession/archiveRoutes.js';
import { successionProductInventory } from '../src/data/succession/productInventory.js';
import { declarationIncludesLiteral } from './lib/succession-audit-contracts.mjs';

const root = process.cwd();
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession product inventory audit failed: ${message}`);
};

const [app, routesSource, extended, roleWorkspaces, deepWorkspaces, finalReleaseSource] = await Promise.all([
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveApp.jsx'), 'utf8'),
  readFile(path.join(root, 'src/data/succession/archiveRoutes.js'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveExtendedWorkspaces.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveWorkspaces.jsx'), 'utf8'),
  readFile(path.join(root, 'src/components/succession/SuccessionArchiveDeepWorkspaces.jsx'), 'utf8'),
  readFile(path.join(root, 'src/data/succession/finalReleaseClosure.js'), 'utf8'),
]);

const authoritative = successionProductInventory.authoritativeWorkspaces;
const preserved = successionProductInventory.preservedVisualTools;
const allInventoryRoutes = [...authoritative, ...preserved].map((record) => record.routeId);

assert(authoritative.length > 0, 'the authoritative workspace inventory must not be empty');
assert(preserved.length === 3, `expected three preserved tools, found ${preserved.length}`);
assert(new Set(allInventoryRoutes).size === allInventoryRoutes.length, 'inventory route IDs must be unique');
assert(successionProductInventory.releaseGates.length === 10, 'inventory must name all ten final release gates');
assert(successionProductInventory.removedImplementationClasses.length >= 10, 'inventory must retain the legacy-removal map');
for (const [retired, destination] of Object.entries(successionArchiveRetiredTargets)) {
  assert(successionProductInventory.legacyAliases[retired] === destination, `${retired} must redirect to ${destination}`);
}

for (const routeId of authoritative.map((record) => record.routeId).filter((id) => !['archive', 'search'].includes(id))) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain in the dedicated route registry`);
}
for (const routeId of ['black-whale', 'timeline']) {
  assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual tool`);
}
for (const routeId of ['characters', 'princes', 'queens', 'bodyguards', 'organizations', 'locations', 'nen', 'guardian-spirit-beasts', 'events', 'relationships', 'chapters']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must retain specialized record ownership`);
}
for (const removedComponent of ['HuntersWorkspace', 'MafiaWorkspace', 'MilitaryWorkspace', 'PoliticsWorkspace', 'BodyStatesWorkspace', 'MediaWorkspace']) {
  assert(!app.includes(removedComponent), `${removedComponent} must not remain in the active application`);
}

const componentDirectory = path.join(root, 'src/components/succession');
for (const record of authoritative) {
  const moduleName = record.module.split('#')[0];
  if (!moduleName.endsWith('.jsx') || moduleName === 'SuccessionArchiveApp.jsx') continue;
  await access(path.join(componentDirectory, moduleName));
}
await access(path.join(root, 'src/components/BlackWhaleGuide.jsx'));
await access(path.join(root, 'src/components/TimelineWorkspace.jsx'));

for (const removedExport of ['CharactersWorkspace', 'OrganizationsWorkspace', 'LocationsWorkspace', 'ResearchWorkspace', 'GlossaryWorkspace', 'MediaWorkspace']) {
  assert(!extended.includes(`export function ${removedExport}`), `${removedExport} must remain removed from the shared extended module`);
}
for (const removedExport of ['SuccessionStoryWorkspace', 'GuardianBeastsWorkspace', 'EventsWorkspace', 'BodyguardsWorkspace', 'RelationshipsWorkspace', 'ChapterRecordsWorkspace']) {
  assert(!roleWorkspaces.includes(`export function ${removedExport}`) && !deepWorkspaces.includes(`export function ${removedExport}`), `${removedExport} must remain removed from legacy role modules`);
}
assert(!app.includes('SuccessionStoryWorkspace') && !app.includes('ChapterRecordsWorkspaceV2'), 'active app must not import superseded Story or Chapter implementations');
assert(!routesSource.includes("status = 'foundation'"), 'route registry defaults must not imply unfinished foundation status');
assert(routesSource.includes('successionArchiveRetiredTargets') && routesSource.includes('Object.entries(successionArchiveRetiredTargets)'), 'path and legacy redirects must derive from the retired-route registry');
assert(finalReleaseSource.includes('productInventory: inventory'), 'final release report must embed the maintained inventory');
assert(finalReleaseSource.includes('inventoryReady'), 'final release status must be gated by inventory completeness');
assert(finalReleaseSource.includes('successionArchiveRoutes.every'), 'final release inventory validation must derive from the canonical registry');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const routes = await vite.ssrLoadModule('/src/data/succession/archiveRoutes.js');
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const canonicalRouteIds = routes.successionArchiveRoutes.map((record) => record.id);
  const canonicalRouteSet = new Set(canonicalRouteIds);
  assert(canonicalRouteIds.length === allInventoryRoutes.length, `inventory covers ${allInventoryRoutes.length} routes but registry exposes ${canonicalRouteIds.length}`);
  assert(canonicalRouteIds.every((routeId) => allInventoryRoutes.includes(routeId)), 'every registered route must appear in the maintained inventory');
  assert(allInventoryRoutes.every((routeId) => canonicalRouteSet.has(routeId)), 'inventory must not contain retired route IDs');
  for (const retired of Object.keys(routes.successionArchiveRetiredTargets)) assert(!canonicalRouteSet.has(retired), `${retired} must not remain a primary route`);

  const report = archive.getFinalReleaseClosureReport();
  assert(report?.productInventory?.version === successionProductInventory.version, 'public final report must expose the current product inventory version');
  assert(report.productInventory.counts.authoritativeWorkspaces === authoritative.length, 'public final report must expose the registry-aligned authoritative workspace count');
  assert(report.productInventory.counts.preservedVisualTools === preserved.length, 'public final report must expose all preserved tools');
  const batchStatuses = Object.fromEntries(Object.entries(report.batches || {}).map(([key, value]) => [key, value.status]));
  assert(
    report.closureReady && report.status === 'release-candidate',
    `inventory-complete static closure must remain a release candidate; status=${report.status}; batches=${JSON.stringify(batchStatuses)}; gates=${JSON.stringify(report.releaseGates)}`,
  );

  console.log(`Succession product inventory audit passed: ${authoritative.length} authoritative workspaces, ${preserved.length} preserved tools, ${Object.keys(successionProductInventory.legacyAliases).length} canonical aliases, ${successionProductInventory.removedImplementationClasses.length} removed implementation classes, and ${successionProductInventory.releaseGates.length} final release gates are maintained.`);
} finally {
  await vite.close();
}
