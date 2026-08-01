import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession breadcrumb redesign audit failed: ${message}`);
};

const cssPath = 'src/components/succession/SuccessionArchiveBreadcrumbRedesign.css';
await access(path.join(root, cssPath));

const [shell, breadcrumbCss, searchCss, packageJson, docs, workflow] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read(cssPath),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('docs/SUCCESSION-VISUAL-REDESIGN.md'),
  read('.github/workflows/succession-visual-redesign.yml'),
]);

for (const requiredMarkup of [
  'succession-route-context',
  'succession-breadcrumbs',
  'succession-breadcrumbs__separator',
  'succession-return-path',
  '<ol>',
  'aria-current="page"',
  "const hiddenNavigationRoutes = new Set(['archive', 'reader'])",
  "if (route.id === 'archive') onNavigate('story', {});",
  "aria-current={route.id === 'story' ? 'page' : undefined}",
  'onClick={onExitArchive}',
  'aria-label="Return to Story"',
  '<span>Return to Story</span>',
]) assert(shell.includes(requiredMarkup), `shell markup is missing ${requiredMarkup}`);

assert(!shell.includes('Back to archive index'), 'removed Archive Home must not remain as a return destination');
assert(!shell.includes('Open reader</button>'), 'Succession shell must not expose a duplicate Reader action');
assert(shell.includes('<ArrowLeft') && shell.includes('<ChevronRight'), 'breadcrumbs must expose return and hierarchy icons');
assert(shell.includes('aria-label="Breadcrumb"'), 'breadcrumb navigation must retain an accessible name');

for (const requiredSelector of [
  '.succession-archive .succession-route-context',
  '.succession-archive .succession-breadcrumbs',
  '.succession-archive .succession-breadcrumbs ol',
  '.succession-archive .succession-breadcrumbs__separator',
  '.succession-archive .succession-return-path',
]) assert(breadcrumbCss.includes(requiredSelector), `breadcrumb CSS is missing ${requiredSelector}`);

assert(breadcrumbCss.includes('overflow-x: auto'), 'long breadcrumb trails must remain horizontally reachable');
assert(breadcrumbCss.includes('min-height: 44px'), 'mobile breadcrumb and return controls must retain 44px targets');
assert(breadcrumbCss.includes('@media (max-width: 720px)'), 'breadcrumb context must stack before narrow mobile widths');
assert(breadcrumbCss.includes('@media (max-width: 560px)'), 'breadcrumb controls must provide a dedicated mobile layout');
assert(breadcrumbCss.includes('@media (prefers-reduced-motion: reduce)'), 'return-path motion must respect reduced-motion preferences');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(breadcrumbCss), 'breadcrumb redesign must not introduce raw hex colors');
assert(!breadcrumbCss.includes('!important'), 'breadcrumb redesign must not depend on !important overrides');

const expectedImports = "@import './SuccessionVisualFoundation.css';\n@import './SuccessionVisualFoundationBridge.css';\n@import './SuccessionArchiveShellRedesign.css';\n@import './SuccessionArchivePageHeaderRedesign.css';\n@import './SuccessionArchiveBreadcrumbRedesign.css';";
assert(searchCss.trimStart().startsWith(expectedImports), 'breadcrumb redesign must load after the page-header layer');
assert(packageJson.includes('"audit:succession-breadcrumb-redesign"'), 'package.json must expose the breadcrumb audit');
assert(workflow.includes('audit:succession-breadcrumb-redesign'), 'visual workflow must run the breadcrumb audit');
assert(workflow.includes('scripts/audit-succession-breadcrumb-redesign.mjs'), 'workflow paths must include the breadcrumb audit');
assert(docs.includes('### Hour 17 — Breadcrumbs and return paths'), 'design record must document Hour 17');
assert(docs.includes('Return-path contract'), 'design record must explain the return-path behavior');

console.log('Succession breadcrumb redesign audit passed.');
