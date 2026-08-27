import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Homepage runtime audit failed: ${message}`);
};

const [app, home, main] = await Promise.all([
  read('src/App.jsx'),
  read('src/components/succession/SuccessionCommandHome.jsx'),
  read('src/main.jsx'),
]);

for (const token of [
  "import SuccessionCommandHome from './components/succession/SuccessionCommandHome'",
  "document.title = 'Hunter × Hunter Archive'",
  "window.history.replaceState({ hxhRoute: '/' }, '', '/')",
  'onClickCapture={keepInternalLinksOnHome}',
  '<SuccessionCommandHome',
  'spoilerLimit={ARCHIVE_BOUNDARY}',
  'onNavigate={stayHome}',
  'onOpenSearch={stayHome}',
]) assert(app.includes(token), `App is missing current homepage contract: ${token}`);

for (const retiredMount of ['SuccessionArchiveApp', 'SuccessionArchiveEntry', 'successionPanels', 'routeModuleLoaders']) {
  assert(!app.includes(retiredMount), `App restored retired live runtime mount: ${retiredMount}`);
}

for (const token of [
  'className="succession-command-home"',
  'href="#succession-command-content"',
  '<main id="succession-command-content"',
  '<h1 id="succession-voyage-title">Voyage status</h1>',
  'getSuccessionHomeRecentChapters(spoilerLimit)',
]) assert(home.includes(token), `homepage source is missing ${token}`);

assert(main.includes('<App />') || main.includes('<App/>'), 'main entry must render App');
assert(app.includes("if (!anchor || anchor.target === '_blank') return;"), 'new-tab links must not be intercepted');
assert(app.includes("if (!href || href.startsWith('#')) return;"), 'in-page anchors must not be intercepted');
assert(app.includes('if (destination.origin !== window.location.origin) return;'), 'external links must not be intercepted');

console.log('Homepage runtime audit passed: the production shell is homepage-only, keeps internal navigation pinned to /, preserves external/hash/new-tab behavior, and exposes the archive content landmark.');
