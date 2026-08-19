import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from '../src/data/successionChapterAvailability.generated.js';
import {
  getSuccessionArchiveHub,
  successionArchiveGroups,
  successionArchiveHubGroups,
  successionArchiveHubs,
  successionArchiveLegacyTargets,
  successionArchivePathToTarget,
  successionArchiveRetiredTargets,
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

const requiredRouteIds = Object.freeze([
  'archive', 'story', 'timeline', 'reader', 'search',
  'characters', 'princes', 'queens', 'bodyguards', 'organizations',
  'black-whale', 'locations', 'nen', 'guardian-spirit-beasts',
  'events', 'relationships', 'chapters', 'research', 'glossary',
]);

assert(unique(successionArchiveRoutes.map((route) => route.id)), 'route IDs must be unique');
assert(unique(successionArchiveRoutes.map((route) => route.path)), 'route paths must be unique');
assert(successionArchiveRouteIds.size === successionArchiveRoutes.length, 'route ID set must cover every archive route');
assert(requiredRouteIds.every((id) => successionArchiveRouteIds.has(id)), 'the route hierarchy must expose every maintained archive area');
assert(successionArchiveRoutes.every((route) => requiredRouteIds.includes(route.id)), 'the route hierarchy contains an unreviewed primary route');
assert(successionArchiveGroups.join('|') === 'Overview|People|Power|World|Systems|Records|Library', 'record groups must remain deliberate and ordered');
assert(successionArchiveRoutes.every((route) => route.status === 'active'), 'every maintained route must be active');

assert(successionArchiveHubs.length === 7, 'top-level navigation must expose four consolidated hubs plus Search, Research, and Glossary');
assert(successionArchiveHubGroups.join('|') === 'Operations|Library', 'hub groups must remain deliberate and ordered');
assert(unique(successionArchiveHubs.map((currentHub) => currentHub.id)), 'hub IDs must be unique');
assert(unique(successionArchiveHubs.map((currentHub) => currentHub.target)), 'hub targets must be unique');
assert(successionArchiveHubs.map((currentHub) => currentHub.label).join('|') === 'Story Intelligence|People & Power|Black Whale|Nen Systems|Search|Research|Glossary', 'top-level hub labels changed unexpectedly');
assert(getSuccessionArchiveHub('archive').id === 'story', 'removed Archive Home must resolve into Story Intelligence');
assert(getSuccessionArchiveHub('chapters').id === 'story' && getSuccessionArchiveHub('timeline').id === 'story' && getSuccessionArchiveHub('events').id === 'story', 'narrative routes must share Story Intelligence');
assert(getSuccessionArchiveHub('characters').id === 'people' && getSuccessionArchiveHub('princes').id === 'people' && getSuccessionArchiveHub('bodyguards').id === 'people' && getSuccessionArchiveHub('organizations').id === 'people' && getSuccessionArchiveHub('relationships').id === 'people', 'people and institution routes must share People & Power');
assert(getSuccessionArchiveHub('locations').id === 'black-whale', 'Locations must share the Black Whale hub');
assert(getSuccessionArchiveHub('guardian-spirit-beasts').id === 'nen', 'Guardian Spirit Beasts must share Nen Systems');
assert(successionArchiveHubs.find((currentHub) => currentHub.id === 'story')?.tabs.map((tab) => tab.target).join('|') === 'story|chapters|timeline|events', 'Story Intelligence tab order is incomplete');
assert(successionArchiveHubs.find((currentHub) => currentHub.id === 'people')?.tabs.map((tab) => tab.target).join('|') === 'characters|princes|bodyguards|organizations|relationships', 'People & Power tab order is incomplete');
assert(successionArchiveHubs.find((currentHub) => currentHub.id === 'black-whale')?.tabs.map((tab) => tab.target).join('|') === 'black-whale|locations', 'Black Whale tab order is incomplete');
assert(successionArchiveHubs.find((currentHub) => currentHub.id === 'nen')?.tabs.map((tab) => tab.target).join('|') === 'nen|guardian-spirit-beasts', 'Nen Systems tab order is incomplete');

for (const [retired, destination] of Object.entries(successionArchiveRetiredTargets)) {
  assert(!successionArchiveRouteIds.has(retired), `${retired} must not remain a primary route`);
  assert(successionArchiveLegacyTargets[retired] === destination, `${retired} must redirect to ${destination}`);
  assert(successionArchivePathToTarget.get(retired) === destination, `clean path ${retired} must redirect to ${destination}`);
  assert(successionArchiveRouteIds.has(destination), `${retired} redirects to missing maintained route ${destination}`);
}
assert(successionArchiveRoutes.find((route) => route.id === 'characters')?.description.includes('body state'), 'Characters must own life and body-state information');
assert(successionArchiveRoutes.find((route) => route.id === 'organizations')?.description.includes('mafia families'), 'Organizations must own the consolidated power structure');
assert(successionArchiveRoutes.find((route) => route.id === 'research')?.description.includes('media provenance'), 'Research must own redirected media provenance');
assert(successionArchiveRoutes.find((route) => route.id === 'chapters')?.description.includes('latest imported reader release'), 'Chapter route must follow imported chapter availability');

const [
  app,
  entry,
  shell,
  workspace,
  organizationWorkspace,
  evidenceWorkspace,
  router,
  preload,
  css,
  contrast,
  catalogue,
  searchCss,
  releasePatch,
  main,
  packageJson,
] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveEvidenceWorkspace.jsx'),
  read('src/lib/appRouter.js'),
  read('src/lib/routePreload.js'),
  read('src/styles/succession-archive.css'),
  read('src/components/succession/SuccessionArchiveContrast.css'),
  read('src/components/succession/SuccessionArchiveCatalog.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('src/components/succession/SuccessionFinalReleasePatch.css'),
  read('src/main.jsx'),
  read('package.json'),
]);

assert(app.includes('SuccessionArchiveApp') && !app.includes('successionPanels'), 'App must mount the dedicated archive application instead of the grouped panel layout');
assert(shell.includes('succession-archive__sidebar') && !shell.includes('succession-drawer') && !shell.includes('succession-archive__mobile-bar'), 'desktop sidebar must exist without retired mobile navigation');
assert(shell.includes('SpoilerControl') && shell.includes('ARCHIVE_BOUNDARY'), 'shell must retain a generated reading boundary and global search entry point');
assert(shell.includes('successionArchiveHubs') && shell.includes('successionArchiveHubGroups') && shell.includes('getSuccessionArchiveHub'), 'shell must derive navigation from the consolidated hub registry');
assert(shell.includes('function SuccessionHubTabs') && shell.includes('className="succession-hub-tabs"'), 'hub-local tab navigation is missing');
assert(shell.includes('data-archive-hub={activeHub.id}'), 'rendered shell must expose the active consolidated hub');
assert(shell.includes("if (route.id === 'archive') onNavigate('story', {});"), 'removed Archive Home must redirect to Story Intelligence');
assert(!shell.includes('Open reader</button>'), 'Succession shell must not restore a duplicate Reader action');
assert(workspace.includes("from '../../data/succession/successionData'"), 'workspaces must consume the canonical public selector module');
assert(!workspace.includes("from '../../data/succession/entities'"), 'workspaces must not import canonical entity records directly');
assert(workspace.includes('searchArchiveProduct') && workspace.includes('matchReason'), 'global search must use grouped and explained product results');
assert(workspace.includes('successionArchiveRetiredTargets'), 'active navigation must normalize any retired target before routing');

for (const removedComponent of ['HuntersWorkspace', 'MafiaWorkspace', 'MilitaryWorkspace', 'PoliticsWorkspace', 'BodyStatesWorkspace', 'MediaWorkspace']) {
  assert(!workspace.includes(removedComponent), `${removedComponent} must not remain in the active application`);
}
for (const routeId of ['black-whale', 'timeline']) {
  assert(declarationIncludesLiteral(workspace, 'preserved', routeId), `${routeId} must remain a preserved companion workspace`);
}
for (const routeId of requiredRouteIds.filter((id) => !['archive', 'search', 'reader', 'black-whale', 'timeline'].includes(id))) {
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
assert(evidenceWorkspace.includes('ResearchMediaRecord') && evidenceWorkspace.includes('getMediaRecordsAtChapter'), 'Research must render redirected media records with maintained provenance');
assert(router.includes('successionArchiveRetiredTargets') && router.includes('resolveSuccessionTarget'), 'router must resolve aliases and retired routes until an active destination is reached');
assert(preload.includes('successionArchive') && preload.includes('SuccessionArchiveEntry'), 'route preloading must include the scoped archive application chunk');
assert(entry.includes('../../styles/succession-archive.css') && entry.includes('SuccessionArchiveContrast.css') && entry.includes('SuccessionArchiveCatalog.css'), 'the archive entry must own scoped design, readability, and catalogue layers');
assert(!main.includes('./styles/succession-archive.css'), 'the scoped archive stylesheet must not alter the locked global CSS import order');
assert(contrast.includes('font-size: 11px !important'), 'archive readability overrides must preserve the 11px text floor');
assert(catalogue.includes('.succession-entity-visual') && catalogue.includes('data-has-visual'), 'catalogue design must provide portrait and fallback visual frames');
assert(searchCss.includes('.succession-search-complete__groups') && !/@media\s*\([^)]*max-width:/i.test(searchCss), 'global search requires grouped desktop design without narrow-screen breakpoints');
assert(releasePatch.includes('.succession-hub-tabs') && releasePatch.includes('min-height: 44px'), 'consolidated hub tabs require responsive styling and accessible targets');
for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state']) assert(css.includes(selector), `design layer is missing ${selector}`);
assert(!/@media\s*\([^)]*max-width:/i.test(css) && css.includes('@media (prefers-reduced-motion: reduce)'), 'desktop-only shell must avoid narrow-width rules and retain reduced motion');
assert(css.includes(':focus-visible'), 'accessible focus styling is required');
assert(packageJson.includes('"audit:succession-shell"') && packageJson.includes('"qa:succession-shell"'), 'package scripts must expose archive shell checks');

console.log(`Succession Archive shell audit passed through imported Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}: ${successionArchiveRoutes.length} maintained routes organized into ${successionArchiveHubs.length} top-level hubs, ${Object.keys(successionArchiveRetiredTargets).length} registry-derived redirects, and all canonical dossiers preserved.`);
