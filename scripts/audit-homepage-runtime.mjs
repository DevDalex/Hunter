import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Homepage runtime audit failed: ${message}`);
};

const [app, home, homeCss, workspace, explorer, explorerCss, main] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionCommandHome.jsx'),
  read('src/components/succession/SuccessionCommandHome.css'),
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/TimelineArchiveExplorer.jsx'),
  read('src/components/TimelineArchiveExplorer.css'),
  read('src/main.jsx'),
]);

for (const token of [
  "import SuccessionCommandHome from './components/succession/SuccessionCommandHome'",
  "lazy(() => import('./components/TimelineWorkspace'))",
  "pathname === '/timeline'",
  "'Timeline · Hunter × Hunter Archive'",
  'onClickCapture={keepInternalNavigationInApp}',
  '<SuccessionCommandHome',
  '<TimelineWorkspace',
  'spoilerLimit={ARCHIVE_BOUNDARY}',
]) assert(app.includes(token), `App is missing current route contract: ${token}`);

for (const retiredMount of ['SuccessionArchiveApp', 'SuccessionArchiveEntry', 'successionPanels', 'routeModuleLoaders', '<SuccessionTimelineMangaWall']) {
  assert(!app.includes(retiredMount), `App restored retired live runtime mount: ${retiredMount}`);
}

for (const token of [
  'className="succession-command-home"',
  'href="#succession-command-content"',
  '<main id="succession-command-content"',
  "label: 'Story'",
  "label: 'Characters'",
  "label: 'Nen'",
  'aria-expanded={expanded}',
  'className="succession-command-home__whale"',
  'succession-command-home__subcategories',
  'href="/timeline"',
]) assert(home.includes(token), `homepage source is missing ${token}`);

for (const token of [
  "url('/media/rooms/black-whale-exterior.webp')",
  '--home-red: #8c2f2b',
  '.succession-command-home__detail.is-open',
  '@media (prefers-reduced-motion: reduce)',
]) assert(homeCss.includes(token), `homepage stylesheet is missing ${token}`);

for (const token of [
  "import TimelineArchiveExplorer from './TimelineArchiveExplorer'",
  'timeline-workspace--archive-explorer',
  '<TimelineArchiveExplorer',
]) assert(workspace.includes(token), `production Timeline workspace is missing ${token}`);

for (const token of [
  'Semantic chronology',
  'Story minimap',
  "id: 'recap'",
  "id: 'story'",
  "id: 'full'",
  'const DISPLAY_BATCH = 120',
  'filteredEvents.slice(0, displayLimit)',
  'Search people, places, events, evidence',
  'All story threads',
  'Complete event record',
  'Cause and consequence',
]) assert(explorer.includes(token), `timeline explorer is missing ${token}`);

for (const selector of [
  '.timeline-workspace--archive-explorer',
  '.timeline-archive-explorer',
  '.tae-density-modes',
  '.tae-phase-strip',
  '.tae-density-graph',
  '.tae-toolbar',
  '.tae-body',
  '.tae-stream',
  '.tae-inspector',
]) assert(explorerCss.includes(selector), `timeline explorer stylesheet is missing ${selector}`);

assert(!homeCss.toLowerCase().includes('gold'), 'homepage stylesheet restored a gold design token');
assert(!explorerCss.toLowerCase().includes('gold'), 'timeline explorer stylesheet introduced a gold design token');
assert(main.includes('<App />') || main.includes('<App/>'), 'main entry must render App');
assert(app.includes("if (!anchor || anchor.target === '_blank') return;"), 'new-tab links must not be intercepted');
assert(app.includes("if (!href || href.startsWith('#')) return;"), 'in-page anchors must not be intercepted');
assert(app.includes('if (destination.origin !== window.location.origin) return;'), 'external links must not be intercepted');

console.log('Homepage runtime audit passed: production exposes the private Story / Characters / Nen homepage plus the lazy-loaded 1,555-event /timeline archive explorer.');
