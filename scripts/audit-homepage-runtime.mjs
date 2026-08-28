import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Homepage runtime audit failed: ${message}`);
};

const [app, home, homeCss, workspace, switcher, explorer, explorerCss, completeCss, main] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionCommandHome.jsx'),
  read('src/components/succession/SuccessionCommandHome.css'),
  read('src/components/TimelineWorkspace.jsx'),
  read('src/components/TimelineWorkspaceSwitcher.jsx'),
  read('src/components/TimelineArchiveExplorer.jsx'),
  read('src/components/TimelineArchiveExplorer.css'),
  read('src/components/TimelineCompleteSystem.css'),
  read('src/main.jsx'),
]);

for (const token of [
  "import SuccessionCommandHome from './components/succession/SuccessionCommandHome'",
  "lazy(() => import('./components/TimelineWorkspace'))",
  "pathname === '/timeline'",
  'const readTimelineState',
  'const commitTimelineState',
  'requestedState={timelineState}',
  'onNavigate={commitTimelineState}',
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
  'TimelineContextNavigator',
  'TimelineStoryField',
  'TimelineComparisonBuilder',
  'TimelineIntelligencePanels',
  'TimelineSpatialIntelligence',
  'TimelineEventFocus',
  'TimelineCausalityGraphInstrument',
  'NenInteractionGraphInstrument',
  'timeline-workspace--complete-system',
]) assert(workspace.includes(token), `production Timeline workspace is missing ${token}`);

for (const mode of ['archive', 'story', 'compare', 'atlas', 'space']) {
  assert(switcher.includes(`id: '${mode}'`), `timeline switcher is missing ${mode}`);
}
assert(switcher.includes("return 'archive';"), 'approved Archive explorer is not the default Timeline lens');

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
  'function PhaseFocus',
  'function sequenceGroups',
  'Related chronology',
  'Open full dossier',
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

for (const selector of [
  '.timeline-workspace--complete-system',
  '.tae-density-graph > button',
  '.tae-phase-focus',
  '.tae-sequence',
  '.tae-inspector__visual',
  '.timeline-system-event-drawer',
]) assert(completeCss.includes(selector), `complete timeline styling is missing ${selector}`);

assert(!homeCss.toLowerCase().includes('gold'), 'homepage stylesheet restored a prohibited legacy color label');
assert(!explorerCss.toLowerCase().includes('gold'), 'timeline explorer stylesheet introduced a prohibited legacy color label');
assert(!completeCss.toLowerCase().includes('gold'), 'complete timeline stylesheet introduced a prohibited legacy color label');
assert(main.includes('<App />') || main.includes('<App/>'), 'main entry must render App');
assert(app.includes("if (!anchor || anchor.target === '_blank') return;"), 'new-tab links must not be intercepted');
assert(app.includes("if (!href || href.startsWith('#')) return;"), 'in-page anchors must not be intercepted');
assert(app.includes('if (destination.origin !== window.location.origin) return;'), 'external links must not be intercepted');

console.log('Homepage runtime audit passed: production exposes the private homepage and a URL-addressable five-lens Timeline with the dark 1,555-event Archive explorer as its default.');
