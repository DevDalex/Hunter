import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  successionArchiveGroups,
  successionArchiveRouteIds,
  successionArchiveRoutes,
} from '../src/data/succession/archiveRoutes.js';

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

const [app, entry, shell, workspace, primitives, router, preload, css, contrast, main, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionArchiveEntry.jsx'),
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveApp.jsx'),
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read('src/lib/appRouter.js'),
  read('src/lib/routePreload.js'),
  read('src/styles/succession-archive.css'),
  read('src/components/succession/SuccessionArchiveContrast.css'),
  read('src/main.jsx'),
  read('package.json'),
]);

assert(app.includes('SuccessionArchiveApp') && !app.includes('successionPanels'), 'App must mount the dedicated archive application instead of the grouped panel layout');
assert(shell.includes('succession-archive__sidebar') && shell.includes('succession-drawer'), 'desktop sidebar and mobile drawer must both exist');
assert(shell.includes('focusableSelector') && shell.includes("event.key === 'Escape'"), 'mobile navigation must manage keyboard focus and Escape');
assert(shell.includes('SpoilerControl') && shell.includes('onOpenSearch'), 'shell must retain the reading boundary and global search entry point');

for (const name of ['ArchivePageHeader', 'EntityLink', 'EntityBadge', 'EntityHeader', 'SourceReference', 'RelatedEntities', 'ArchiveTabs', 'ArchiveState']) {
  assert(primitives.includes(`export function ${name}`) || primitives.includes(`export const ${name}`), `missing archive primitive ${name}`);
}

assert(workspace.includes("from '../../data/succession/successionData'"), 'workspaces must consume the canonical public selector module');
assert(!workspace.includes("from '../../data/succession/entities'"), 'workspaces must not import canonical entity records directly');
assert(workspace.includes('canonLevel') && workspace.includes('SourceReference'), 'canon separation and source references must be visible in entity workspaces');
assert(workspace.includes('SuccessionChapterReader') === false, 'the archive application must not embed the manga reader');

assert(router.includes("'/story/succession-contest/chapters'"), 'legacy reader URL must remain authoritative');
assert(router.includes("nextTarget === 'reader'"), 'new reader navigation must resolve to the existing reader');
assert(router.includes('successionArchivePathToTarget') && router.includes('successionArchiveTargetToPath'), 'router must use the canonical archive route registry');
assert(preload.includes('successionArchive') && preload.includes('SuccessionArchiveEntry'), 'route preloading must include the scoped archive application chunk');
assert(entry.includes("../../styles/succession-archive.css") && entry.includes('SuccessionArchiveContrast.css'), 'the archive entry must own its scoped design and readability layers');
assert(!main.includes("./styles/succession-archive.css"), 'the scoped archive stylesheet must not alter the locked global CSS import order');
assert(contrast.includes('font-size: 11px !important'), 'archive readability overrides must preserve the 11px text floor');

for (const selector of ['.succession-archive__layout', '.succession-archive__sidebar', '.succession-page-header', '.succession-entity-link', '.succession-state', '.succession-drawer']) {
  assert(css.includes(selector), `design layer is missing ${selector}`);
}
assert(css.includes('@media (max-width: 860px)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'responsive and reduced-motion rules are required');
assert(css.includes(':focus-visible'), 'accessible focus styling is required');
assert(packageJson.includes('"audit:succession-shell"') && packageJson.includes('"qa:succession-shell"'), 'package scripts must expose archive audit and browser QA');

console.log(`Succession Archive shell audit passed: ${successionArchiveRoutes.length} routes across ${successionArchiveGroups.length} navigation groups, canonical selector access, preserved reader routing, scoped design ownership, desktop/mobile shells, and accessibility states verified.`);
