import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { LATEST_AUTHORIZED_SUCCESSION_CHAPTER } from '../src/data/successionChapterAvailability.generated.js';
import {
  successionArchiveGroups,
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

assert(successionArchiveRoutes.length >= 25, 'the route hierarchy must expose every primary archive area');
assert(unique(successionArchiveRoutes.map((route) => route.id)), 'route IDs must be unique');
assert(unique(successionArchiveRoutes.map((route) => route.path)), 'route paths must be unique');
assert(successionArchiveRouteIds.size === successionArchiveRoutes.length, 'route ID set must cover every archive route');
assert(successionArchiveGroups.join('|') === 'Overview|People|Power|World|Systems|Records|Library', 'navigation groups must remain deliberate and ordered');

for (const id of [
  'archive', 'story', 'timeline', 'reader', 'characters', 'princes', 'queens', 'bodyguards', 'hunters',
  'mafia', 'military', 'organizations', 'politics', 'black-whale', 'locations', 'nen',
  'guardian-spirit-beasts', 'events', 'deaths', 'relationships', 'chapters', 'research', 'glossary', 'media', 'search',
]) assert(successionArchiveRouteIds.has(id), `missing primary route ${id}`);

for (const id of ['story', 'chapters', 'glossary', 'media', 'nen', 'guardian-spirit-beasts']) {
  assert(successionArchiveRoutes.find((route) => route.id === id)?.status === 'active', `${id} must be a completed active route`);
}
assert(successionArchiveRoutes.find((route) => route.id === 'story')?.description.includes('seven parallel story lanes'), 'Story route must describe the canonical Batch 4 model');
assert(successionArchiveRoutes.find((route) => route.id === 'chapters')?.description.includes('latest imported reader release'), 'Chapter route must follow imported chapter availability');

const [
  app,
  entry,
  shell,
  workspace,
  storyWorkspace,
  chapterWorkspace,
  organizationWorkspace,
  nenWorkspace,
  beastWorkspace,
  extendedWorkspace,
  deepWorkspace,
  workspaces,
  primitives,
  entities,
  extendedEntities,
  research,
  router,
  preload,
  css,
  contrast,
  catalogue,
  storyCss,
  chapterCss,
  extendedCss,
  main,
  packageJson,
] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveChapterStoryWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveOrganizationWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveNenWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveGuardianBeastWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveExtendedWorkspaces.jsx'),
  read('src/components/succession/SuccessionArchiveDeepWorkspaces.jsx'),
  read('src/components/succession/SuccessionArchiveWorkspaces.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/data/succession/entities.js'),
  read('src/data/succession/entitiesExtended.js'),
  read('src/data/succession/successionResearch.js'),
  read('src/lib/appRouter.js'),
  read('src/lib/routePreload.js'),
  read('src/styles/succession-archive.css'),
  read('src/components/succession/SuccessionArchiveContrast.css'),
  read('src/components/succession/SuccessionArchiveCatalog.css'),
  read('src/components/succession/SuccessionArchiveStoryIntelligenceWorkspace.css'),
  read('src/components/succession/SuccessionArchiveChapterStoryWorkspace.css'),
  read('src/components/succession/SuccessionArchiveExtendedWorkspaces.css'),
  read('src/main.jsx'),
  read('package.json'),
]);

assert(app.includes('SuccessionArchiveApp') && !app.includes('successionPanels'), 'App must mount the dedicated archive application instead of the grouped panel layout');
assert(shell.includes('succession-archive__sidebar') && shell.includes('succession-drawer'), 'desktop sidebar and mobile drawer must both exist');
assert(shell.includes('focusableSelector') && shell.includes("event.key === 'Escape'"), 'mobile navigation must manage keyboard focus and Escape');
assert(shell.includes('SpoilerControl') && shell.includes('ARCHIVE_BOUNDARY'), 'shell must retain a generated reading boundary and global search entry point');

for (const name of ['ArchivePageHeader', 'EntityVisual', 'EntityLink', 'EntityBadge', 'EntityHeader', 'SourceReference', 'RelatedEntities', 'ArchiveTabs', 'ArchiveState']) {
  assert(primitives.includes(`export function ${name}`) || primitives.includes(`export const ${name}`), `missing archive primitive ${name}`);
}

assert(workspace.includes("from '../../data/succession/successionData'"), 'workspaces must consume the canonical public selector module');
assert(!workspace.includes("from '../../data/succession/entities'"), 'workspaces must not import canonical entity records directly');
assert(workspace.includes('EntityVisual') && workspace.includes('media?.portrait'), 'canonical directories must render maintained visuals and report visual coverage');
assert(workspace.includes("routeParams.view === 'tree'"), 'the family tree must be optional rather than replacing canonical prince records');
for (const routeId of ['black-whale', 'timeline']) assert(declarationIncludesLiteral(workspace, 'preserved', routeId), `${routeId} must remain a preserved companion workspace`);
assert(!declarationIncludesLiteral(workspace, 'preserved', 'nen'), 'Nen must remain migrated into its canonical workspace');
assert(workspace.includes('canonLevel') && workspace.includes('SourceReference'), 'canon separation and source references must be visible in entity workspaces');
assert(workspace.includes('SuccessionChapterReader') === false, 'the archive application must not embed the manga reader');
assert(!workspace.includes('SuccessionStoryWorkspace'), 'legacy static Story workspace must not remain active');
assert(!workspace.includes('ChapterRecordsWorkspaceV2'), 'legacy chapter ledger must not remain active');

for (const component of [
  'HuntersWorkspace', 'MilitaryWorkspace', 'PoliticsWorkspace',
  'GlossaryWorkspace', 'MediaWorkspace', 'DomainEntityDetail',
]) assert(extendedWorkspace.includes(`export function ${component}`), `missing completed workspace ${component}`);
assert(extendedWorkspace.includes('export function ChapterRecordsWorkspaceV2'), 'legacy ChapterRecordsWorkspaceV2 must remain identifiable as inactive migration code');
for (const component of ['QueensWorkspace', 'BodyStatesWorkspace']) assert(deepWorkspace.includes(`export function ${component}`), `missing active deep workspace ${component}`);
assert(deepWorkspace.includes('export function GuardianBeastsWorkspace'), 'legacy Guardian Beast workspace must remain identifiable as inactive migration code');
assert(workspaces.includes('export function SuccessionStoryWorkspace'), 'legacy Story workspace must remain identifiable as inactive migration code');
for (const component of ['PrincesWorkspace', 'MafiaWorkspace']) assert(workspaces.includes(`export function ${component}`), `missing specialized workspace ${component}`);

assert(organizationWorkspace.includes('Organizations as chapter-bounded systems of authority'), 'dedicated organization workspace must own institutional dossiers');
assert(nenWorkspace.includes('Abilities, contracts, curses, possession, instruction, and royal ritual'), 'dedicated Nen workspace must own system dossiers');
assert(beastWorkspace.includes('Fifteen Guardian Spirit Beasts as changing ritual records'), 'dedicated beast workspace must own royal beast dossiers');
assert(storyWorkspace.includes('The arc as phases, parallel plotlines, causal turns, and unresolved questions'), 'dedicated Story workspace must own narrative intelligence');
assert(chapterWorkspace.includes('Every chapter placed inside phase, plotline, causality, and unresolved-story context'), 'dedicated Chapter workspace must own chapter dossiers');

for (const [routeId, componentName, modulePath] of [
  ['story', 'StoryIntelligenceWorkspace', './SuccessionArchiveStoryIntelligenceWorkspace'],
  ['chapters', 'ChapterStoryWorkspace', './SuccessionArchiveChapterStoryWorkspace'],
  ['characters', 'CharactersWorkspace', './SuccessionArchiveCharacterWorkspace'],
  ['bodyguards', 'AssignmentsWorkspace', './SuccessionArchiveAssignmentWorkspace'],
  ['events', 'EventsWorkspace', './SuccessionArchiveEventWorkspace'],
  ['guardian-spirit-beasts', 'GuardianBeastsWorkspace', './SuccessionArchiveGuardianBeastWorkspace'],
  ['locations', 'LocationsWorkspace', './SuccessionArchiveLocationWorkspace'],
  ['nen', 'NenWorkspace', './SuccessionArchiveNenWorkspace'],
  ['organizations', 'OrganizationsWorkspace', './SuccessionArchiveOrganizationWorkspace'],
  ['relationships', 'RelationshipsWorkspace', './SuccessionArchiveRelationshipWorkspace'],
  ['research', 'EvidenceWorkspace', './SuccessionArchiveEvidenceWorkspace'],
]) {
  assert(sourceImportsDefault(workspace, componentName, modulePath), `${componentName} must be imported from its dedicated module`);
  assert(sourceRendersRouteWith(workspace, routeId, componentName), `route ${routeId} must render ${componentName}`);
}

for (const route of ['story', 'chapters', 'characters', 'hunters', 'military', 'organizations', 'politics', 'locations', 'nen', 'guardian-spirit-beasts', 'research', 'glossary', 'media']) {
  assert(workspace.includes(`route.id === '${route}'`), `route ${route} is not wired into a dedicated workspace`);
}
assert(workspace.includes('DomainEntityDetail') && workspace.includes('selectedEntity'), 'canonical entity links must open domain-specific dossiers');

assert(entities.includes('successionRosterGroups') && entities.includes('princeDossiers') && entities.includes('queenDossiers'), 'canonical catalogue must derive from maintained roster and royal records');
assert(entities.includes('excludedName') && entities.includes('groupsByCharacter'), 'canonical catalogue must filter placeholders and deduplicate names');
assert(entities.includes("organizationType: 'mafia-family'") && entities.includes("organizationType: 'military'"), 'mafia and military organization records are required');
assert(entities.includes('dossierGuardianBeasts.map') && entities.includes('successionChapterResearch.map'), 'Guardian Spirit Beasts and chapter records must be generated from maintained sources');
assert(extendedEntities.includes('additionalSources') && extendedEntities.includes('additionalChapters') && extendedEntities.includes('successionChapterResearch'), 'canonical overlay must generate every missing imported Chapter Record');
assert(research.includes('authorizedSuccessionChapterNumbers') && research.includes('detailed research pending verified chapter documentation'), 'new imported chapters must receive explicit pending research records automatically');

assert(router.includes("'/story/succession-contest/chapters'"), 'legacy reader URL must remain authoritative');
assert(router.includes("nextTarget === 'reader'"), 'new reader navigation must resolve to the existing reader');
assert(router.includes('successionArchivePathToTarget') && router.includes('successionArchiveTargetToPath'), 'router must use the canonical archive route registry');
assert(preload.includes('successionArchive') && preload.includes('SuccessionArchiveEntry'), 'route preloading must include the scoped archive application chunk');
assert(entry.includes("../../styles/succession-archive.css") && entry.includes('SuccessionArchiveContrast.css') && entry.includes('SuccessionArchiveCatalog.css'), 'the archive entry must own scoped design, readability, and catalogue layers');
assert(!main.includes("./styles/succession-archive.css"), 'the scoped archive stylesheet must not alter the locked global CSS import order');
assert(contrast.includes('font-size: 11px !important'), 'archive readability overrides must preserve the 11px text floor');
assert(catalogue.includes('.succession-entity-visual') && catalogue.includes('data-has-visual'), 'catalogue design must provide portrait and fallback visual frames');
assert(extendedCss.includes('.succession-extended-hero') && extendedCss.includes('.succession-domain-dossier') && extendedCss.includes('@media (max-width: 620px)'), 'extended workspaces require owned desktop and mobile design');
assert(storyCss.includes('.succession-story-intel') && storyCss.includes('@media(max-width:720px)') && storyCss.includes('@media(prefers-reduced-motion:reduce)'), 'Story intelligence requires owned responsive and reduced-motion design');
assert(chapterCss.includes('.succession-chapter-intel') && chapterCss.includes('@media(max-width:720px)') && chapterCss.includes('@media(prefers-reduced-motion:reduce)'), 'Chapter intelligence requires owned responsive and reduced-motion design');

for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state', '.succession-drawer']) assert(css.includes(selector), `design layer is missing ${selector}`);
assert(css.includes('@media (max-width: 860px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'responsive and reduced-motion rules are required');
assert(catalogue.includes('@media (max-width: 620px)'), 'catalogue visuals must include a mobile layout');
assert(css.includes(':focus-visible'), 'accessible focus styling is required');
assert(packageJson.includes('"audit:succession-shell"') && packageJson.includes('"qa:succession-shell"') && packageJson.includes('"audit:succession-nen-systems"') && packageJson.includes('"audit:succession-story-intelligence"'), 'package scripts must expose archive, Nen, and story audits');

console.log(`Succession Archive shell audit passed through imported Chapter ${LATEST_AUTHORIZED_SUCCESSION_CHAPTER}: ${successionArchiveRoutes.length} active routes, canonical Story and Chapter intelligence, dedicated people, institution, Nen, and Guardian Beast dossiers, automatic pending research records, scoped design ownership, desktop/mobile shells, and accessibility states verified.`);
