import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Homepage runtime audit failed: ${message}`);
};

const [app, home, homeCss, timeline, timelineCss, main] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionCommandHome.jsx'),
  read('src/components/succession/SuccessionCommandHome.css'),
  read('src/components/succession/SuccessionTimelineMangaWall.jsx'),
  read('src/components/succession/SuccessionTimelineMangaWall.css'),
  read('src/main.jsx'),
]);

for (const token of [
  "import SuccessionCommandHome from './components/succession/SuccessionCommandHome'",
  "import SuccessionTimelineMangaWall from './components/succession/SuccessionTimelineMangaWall'",
  "pathname === '/timeline'",
  "'Timeline · Hunter × Hunter Archive'",
  'onClickCapture={keepInternalNavigationInApp}',
  '<SuccessionCommandHome',
  '<SuccessionTimelineMangaWall',
  'spoilerLimit={ARCHIVE_BOUNDARY}',
]) assert(app.includes(token), `App is missing current route contract: ${token}`);

for (const retiredMount of ['SuccessionArchiveApp', 'SuccessionArchiveEntry', 'successionPanels', 'routeModuleLoaders']) {
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
  'maintainedSuccessionChapterResearch',
  'timelineCausality',
  'buildChapterRecords',
  'PAGE_EXTENSIONS',
  'loading="lazy"',
  'timeline-manga-wall__chapter-grid',
  'timeline-manga-wall__lightbox',
]) assert(timeline.includes(token) || timelineCss.includes(token), `timeline manga wall is missing ${token}`);

assert(timeline.includes("const DEFAULT_PAGE_NUMBERS = [1, 7, 13]"), 'timeline must sample real chapter manga pages across each chapter');
assert(timeline.includes("const DENSE_PAGE_NUMBERS = [1, 7, 13, 18]"), 'dense chapters must receive additional manga coverage');
assert(timeline.includes("record?.events?.length ? record.events : (record?.timelineEvents || [])"), 'timeline must consume maintained chapter event records');
assert(timelineCss.includes("grid-auto-flow: column"), 'timeline must preserve the horizontal manga-wall flow');
assert(timelineCss.includes("width: max-content"), 'timeline chapters must be allowed to expand with story density');
assert(!homeCss.toLowerCase().includes('gold'), 'homepage stylesheet restored a gold design token');
assert(!timelineCss.toLowerCase().includes('gold'), 'timeline stylesheet introduced a gold design token');
assert(main.includes('<App />') || main.includes('<App/>'), 'main entry must render App');
assert(app.includes("if (!anchor || anchor.target === '_blank') return;"), 'new-tab links must not be intercepted');
assert(app.includes("if (!href || href.startsWith('#')) return;"), 'in-page anchors must not be intercepted');
assert(app.includes('if (destination.origin !== window.location.origin) return;'), 'external links must not be intercepted');

console.log('Homepage runtime audit passed: production exposes the private Story / Characters / Nen homepage plus the data-driven /timeline manga wall.');
