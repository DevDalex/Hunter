import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from '../src/data/successionChapterAvailability.generated.js';
import {
  successionArchiveGroups,
  successionArchiveLegacyTargets,
  successionArchivePathToTarget,
  successionArchiveRouteIds,
  successionArchiveRoutes,
} from '../src/data/succession/archiveRoutes.js';
import {
  declarationIncludesLiteral,
  sourceImportsDefault,
  sourceRendersRouteWith,
} from './lib/succession-audit-contracts.mjs';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Archive shell audit failed: ${message}`);
};
const unique = (values) => new Set(values).size === values.length;

const expectedRouteIds = Object.freeze([
  'archive', 'story', 'timeline', 'reader', 'search',
  'characters', 'princes', 'queens', 'bodyguards', 'organizations',
  'black-whale', 'locations', 'nen', 'guardian-spirit-beasts',
  'events', 'relationships', 'chapters', 'research', 'glossary',
]);
const retiredRedirects = Object.freeze({
  hunters: 'characters',
  deaths: 'characters',
  mafia: 'organizations',
  military: 'organizations',
  politics: 'organizations',
  media: 'research',
  'power-blocs': 'organizations',
});

assert(successionArchiveRoutes.length === expectedRouteIds.length, `expected ${expectedRouteIds.length} consolidated routes, found ${successionArchiveRoutes.length}`);
assert(unique(successionArchiveRoutes.map((route) => route.id)), 'route IDs must be unique');
assert(unique(successionArchiveRoutes.map((route) => route.path)), 'route paths must be unique');
assert(successionArchiveRouteIds.size === successionArchiveRoutes.length, 'route ID set must cover every archive route');
assert(expectedRouteIds.every((id) => successionArchiveRouteIds.has(id)), 'the route hierarchy must expose every maintained archive area');
assert(successionArchiveRoutes.every((route) => expectedRouteIds.includes(route.id)), 'the route hierarchy contains an unmaintained primary route');
assert(successionArchiveGroups.join('|') === 'Overview|People|Power|World|Systems|Records|Library', 'navigation groups must remain deliberate and ordered');
assert(successionArchiveRoutes.every((route) => route.status === 'active'), 'every maintained route must be active');

for (const [retired, destination] of Object.entries(retiredRedirects)) {
  assert(!successionArchiveRouteIds.has(retired), `${retired} must not remain a primary route`);
  assert(successionArchiveLegacyTargets[retired] === destination, `${retired} must redirect to ${destination}`);
  assert(successionArchivePathToTarget.get(retired) === destination, `clean path ${retired} must redirect to ${destination}`);
}
assert(successionArchiveRoutes.find((route) => route.id === 'characters')?.description.includes('body state'), 'Characters must own life and body-state information');
assert(successionArchiveRoutes.find((route) => route.id === 'organizations')?.description.includes('mafia families'), 'Organizations must own the consolidated power structure');
assert(successionArchiveRoutes.find((route) => route.id === 'chapters')?.description.includes('latest imported reader release'), 'Chapter route must follow imported chapter availability');

const [
  app,
  entry,
  shell,
  workspace,
  organizationWorkspace,
  router,
  preload,
  css,
  contrast,
  catalogue,
  searchCss,
  main,
  packageJson,
] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx'),
  read('src/lib/appRouter.js'),
  read('src/lib/routePreload.js'),
  read('src/styles/succession-archive.css'),
  read('src/components/succession/SuccessionArchiveContrast.css'),
  read('src/components/succession/SuccessionArchiveCatalog.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/main.jsx'),
  read('package.json'),
]);

assert(app.includes('SuccessionArchiveApp') && !app.includes('successionPanels'), 'App must mount the dedicated archive application instead of the grouped panel layout');
assert(shell.includes('succession-archive__sidebar') && shell.includes('succession-drawer'), 'desktop sidebar and mobile drawer must both exist');
assert(shell.includes('focusableSelector') && shell.includes("event.key === 'Escape'"), 'mobile navigation must manage keyboard focus and Escape');
assert(shell.includes('SpoilerControl') && shell.includes('ARCHIVE_BOUNDARY'), 'shell must retain a generated reading boundary and global search entry point');
assert(workspace.includes("from '../../data/succession/successionData'"), 'workspaces must consume the canonical public selector module');
assert(!workspace.includes("from '../../data/succession/entities'"), 'workspaces must not import canonical entity records directly');
assert(workspace.includes('searchArchiveProduct') && workspace.includes('matchReason'), 'global search must use grouped and explained product results');

for (const routeId of ['black-whale', 'timeline']) {
  assert(declarationIncludesLiteral(workspace, 'preserved', routeId), `${routeId} must remain a preserved companion workspace`);
}
for (const routeId of expectedRouteIds.filter((id) => !['archive', 'search', 'reader', 'black-whale', 'timeline'].includes(id))) {
  assert(declarationIncludesLiteral(workspace, 'dedicated', routeId), `${routeId} must remain in the dedicated route registry`);
}
for (const [routeId, componentName, modulePath] of [
  ['story', 'StoryIntelligenceWorkspace', './SuccessionArchiveStoryIntelligenceWorkspace'],
  ['chapters', 'ChapterStoryWorkspace', './SuccessionArchiveChapterStoryWorkspace'],
  ['characters', 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'],
  ['princes', 'PrincesWorkspace', './SuccessionArchiveWorkspaces'],
  ['queens', 'QueensWorkspace', './SuccessionArchiveDeepWorkspaces'],
  ['bodyguards', 'AssignmentsWorkspace', './SuccessionArchiveAssignmentWorkspace'],
  ['events', 'EventsWorkspace', './SuccessionArchiveEventWorkspace'],
  ['guardian-spirit-beasts', 'GuardianBeastsWorkspace', './SuccessionArchiveGuardianBeastWorkspace'],
  ['locations', 'LocationsWorkspace', './SuccessionArchiveLocationWorkspace'],
  ['nen', 'NenWorkspace', './SuccessionArchiveNenWorkspace'],
  ['organizations', 'OrganizationsWorkspace', './SuccessionArchiveOrganizationWorkspace'],
  ['relationships', 'RelationshipsWorkspace', './SuccessionArchiveRelationshipWorkspace'],
  ['research', 'EvidenceWorkspace', './SuccessionArchiveEvidenceWorkspace'],
  ['glossary', 'GlossaryWorkspace', './SuccessionArchiveGlossaryWorkspace'],
]) {
  assert(sourceImportsDefault(workspace, componentName, modulePath), `${componentName} must be imported from its dedicated module`);
  assert(sourceRendersRouteWith(workspace, routeId, componentName), `route ${routeId} must render ${componentName}`);
}

assert(organizationWorkspace.includes('Organizations as chapter-bounded systems of authority'), 'Organizations must own the consolidated institution directory and dossiers');
assert(organizationWorkspace.includes('organization.organizationType'), 'Organizations must retain type filtering for mafia, military, government, royal, and other institutions');
assert(router.includes('successionArchivePathToTarget') && router.includes('successionArchiveTargetToPath'), 'router must use the canonical archive route registry');
assert(preload.includes('successionArchive') && preload.includes('SuccessionArchiveEntry'), 'route preloading must include the scoped archive application chunk');
assert(entry.includes('../../styles/succession-archive.css') && entry.includes('SuccessionArchiveContrast.css') && entry.includes('SuccessionArchiveCatalog.css'), 'the archive entry must own scoped design, readability, and catalogue layers');
assert(!main.includes('./styles/succession-archive.css'), 'the scoped archive stylesheet must not alter the locked global CSS import order');
assert(contrast.includes('font-size: 11px !important'), 'archive readability overrides must preserve the 11px text floor');
assert(catalogue.includes('.succession-entity-visual') && catalogue.includes('data-has-visual'), 'catalogue design must provide portrait and fallback visual frames');
assert(searchCss.includes('.succession-search-complete__groups') && searchCss.includes('@media(max-width:620px)'), 'global search requires grouped and mobile design');
for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state', '.succession-drawer']) assert(css.includes(selector), `design layer is missing ${selector}`);
assert(css.includes('@media (max-width: 860px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'responsive and reduced-motion rules are required');
assert(css.includes(':focus-visible'), 'accessible focus styling is required');
assert(packageJson.includes('"audit:succession-shell"') && packageJson.includes('"qa:succession-shell"'), 'package scripts must expose archive shell checks');

console.log(`Succession Archive shell audit passed through imported Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}: ${successionArchiveRoutes.length} maintained routes, ${Object.keys(retiredRedirects).length} retired-route redirects, one consolidated Organizations power workspace, and Characters-owned life/body-state records verified.`);
