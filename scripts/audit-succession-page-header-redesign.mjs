import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession page-header redesign audit failed: ${message}`);
};

const headerCssPath = 'src/components/succession/SuccessionArchivePageHeaderRedesign.css';
await access(path.join(root, headerCssPath));

const [primitives, headerCss, searchCss, packageJson, docs, workflow] = await Promise.all([
  read('src/components/succession/SuccessionArchivePrimitives.jsx'),
  read(headerCssPath),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('docs/SUCCESSION-VISUAL-REDESIGN.md'),
  read('.github/workflows/succession-visual-redesign.yml'),
]);

for (const requiredMarkup of [
  'succession-page-header__main',
  'succession-page-header__classification',
  'succession-page-header__classification-rule',
  'succession-page-header__body',
  'succession-page-header__kicker',
  'succession-page-header__description',
  'succession-page-header__meta-item',
  'succession-page-header__meta-index',
  'aria-label="Page actions"',
  'aria-label="Workspace metadata"',
]) assert(primitives.includes(requiredMarkup), `shared header markup is missing ${requiredMarkup}`);

assert(primitives.includes("padStart(2, '0')"), 'metadata entries must retain visible record indices');
assert(primitives.includes('visibleMeta'), 'empty metadata entries must be removed before rendering');

for (const requiredSelector of [
  '.succession-archive .succession-page-header',
  '.succession-archive .succession-page-header__main',
  '.succession-archive .succession-page-header__classification',
  '.succession-archive .succession-page-header__body',
  '.succession-archive .succession-page-header__actions',
  '.succession-archive .succession-page-header__meta',
  '.succession-archive .succession-page-header__meta-item',
  '.succession-archive .succession-page-header__meta-index',
]) assert(headerCss.includes(requiredSelector), `page-header CSS is missing ${requiredSelector}`);

assert(headerCss.includes('grid-template-columns: minmax(0, 1fr) auto'), 'desktop header must separate copy and actions');
assert(headerCss.includes('repeat(auto-fit, minmax(180px, 1fr))'), 'metadata rail must adapt within the desktop workspace');
assert(!headerCss.includes('@media (max-width:'), 'desktop-only page header must not carry narrow-width breakpoint layouts');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(headerCss), 'page-header redesign must not introduce raw hex colors');
assert(!headerCss.includes('!important'), 'page-header redesign must not depend on !important overrides');

const expectedImports = "@import './SuccessionVisualFoundation.css';\n@import './SuccessionVisualFoundationBridge.css';\n@import './SuccessionArchiveShellRedesign.css';\n@import './SuccessionArchivePageHeaderRedesign.css';";
assert(searchCss.trimStart().startsWith(expectedImports), 'page-header redesign must load after the shell layer');
assert(packageJson.includes('"audit:succession-page-header-redesign"'), 'package.json must expose the page-header audit');
assert(workflow.includes('audit:succession-page-header-redesign'), 'visual workflow must run the page-header audit');
assert(workflow.includes('scripts/audit-succession-page-header-redesign.mjs'), 'workflow paths must include the page-header audit');
assert(docs.includes('### Hour 16 — Page headers and metadata'), 'design record must document Hour 16');
assert(docs.includes('Workspace metadata rail'), 'design record must explain the metadata presentation contract');

console.log('Succession desktop page-header redesign audit passed.');
