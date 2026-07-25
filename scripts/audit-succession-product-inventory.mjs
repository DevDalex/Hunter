import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
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
assert(authoritative.length === 22, `expected 22 authoritative workspaces, found ${authoritative.length}`);
assert(preserved.length === 3, `expected three preserved tools, found ${preserved.length}`);
assert(new Set(allInventoryRoutes).size === allInventoryRoutes.length, 'inventory route IDs must be unique');
assert(successionProductInventory.releaseGates.length === 10, 'inventory must name all ten final release gates');
assert(successionProductInventory.removedImplementationClasses.length >= 10, 'inventory must retain the legacy-removal map');

for (const routeId of authoritative.map((record) => record.routeId).filter((id) => !['archive', 'search'].includes(id))) {
  assert(declarationIncludesLiteral(app, 'dedicated', routeId), `${routeId} must remain in the dedicated route registry`);
}
for (const routeId of ['black-whale', 'timeline']) {
  assert(declarationIncludesLiteral(app, 'preserved', routeId), `${routeId} must remain a preserved visual tool`);
}
for (const routeId of ['characters', 'princes', 'queens', 'bodyguards', 'organizations', 'locations', 'nen', 'guardian-spirit-beasts', 'events', 'relationships', 'chapters']) {
  assert(declarationIncludesLiteral(app, 'specializedRecordRoute', routeId), `${routeId} must retain specialized record ownership`);
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
assert(finalReleaseSource.includes('productInventory: inventory'), 'final release report must embed the maintained inventory');
assert(finalReleaseSource.includes('inventoryReady'), 'final release status must be gated by inventory completeness');

const vite = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
try {
  const routes = await vite.ssrLoadModule('/src/data/succession/archiveRoutes.js');
  const archive = await vite.ssrLoadModule('/src/data/succession/successionData.js');
  const canonicalRouteIds = routes.successionArchiveRoutes.map((record) => record.id);
  assert(canonicalRouteIds.length === allInventoryRoutes.length, `inventory covers ${allInventoryRoutes.length} routes but registry exposes ${canonicalRouteIds.length}`);
  assert(canonicalRouteIds.every((routeId) => allInventoryRoutes.includes(routeId)), 'every registered route must appear in the maintained inventory');
  assert(allInventoryRoutes.every((routeId) => canonicalRouteIds.includes(routeId)), 'inventory must not contain retired route IDs');

  const report = archive.getFinalReleaseClosureReport();
  assert(report?.productInventory?.version === 1, 'public final report must expose product inventory version 1');
  assert(report.productInventory.counts.authoritativeWorkspaces === 22, 'public final report must expose all authoritative workspaces');
  assert(report.productInventory.counts.preservedVisualTools === 3, 'public final report must expose all preserved tools');
  assert(report.closureReady && report.status === 'release-candidate', 'inventory-complete static closure must remain a release candidate');

  console.log(`Succession product inventory audit passed: ${authoritative.length} authoritative workspaces, ${preserved.length} preserved tools, ${Object.keys(successionProductInventory.legacyAliases).length} legacy aliases, ${successionProductInventory.removedImplementationClasses.length} removed implementation classes, and ${successionProductInventory.releaseGates.length} final release gates are maintained.`);
} finally {
  await vite.close();
}
