import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession shell redesign audit failed: ${message}`);
};

const [shell, shellCss, searchCss, packageJson, docs, workflow] = await Promise.all([
  read('src/components/succession/SuccessionArchiveShell.jsx'),
  read('src/components/succession/SuccessionArchiveShellRedesign.css'),
  read('src/components/succession/SuccessionArchiveSearch.css'),
  read('package.json'),
  read('docs/SUCCESSION-VISUAL-REDESIGN.md'),
  read('.github/workflows/succession-visual-redesign-batch-5.yml'),
]);

for (const requiredMarkup of [
  'succession-archive__skip-link',
  'succession-archive__sidebar-inner',
  'succession-archive__brand-seal',
  'succession-archive__brand-copy',
  'succession-archive__sidebar-context',
  'succession-archive__sidebar-scroll',
  'succession-archive__workspace-frame',
  'id="succession-workspace-content"',
  'tabIndex="-1"',
]) assert(shell.includes(requiredMarkup), `shell markup is missing ${requiredMarkup}`);

assert(shell.includes('href="#succession-workspace-content"'), 'skip navigation must target the shared workspace content');
assert(shell.includes('role="dialog"') && shell.includes('aria-modal="true"'), 'mobile navigation must remain a modal dialog');
assert(shell.includes("event.key === 'Escape'") && shell.includes("event.key !== 'Tab'"), 'drawer escape and focus-trap behavior must remain intact');
assert(shell.includes('<ArchiveNavigation id="succession-desktop-navigation"') && shell.includes('<ArchiveNavigation id="succession-mobile-navigation"'), 'desktop and mobile navigation must share the canonical route component');

for (const requiredSelector of [
  '.succession-archive__layout',
  '.succession-archive__sidebar',
  '.succession-archive__sidebar-inner',
  '.succession-archive__workspace',
  '.succession-archive__workspace-frame',
  '.succession-archive__content > *',
  ".succession-archive[data-archive-route='timeline'] .timeline-workspace",
  '.succession-archive__mobile-bar',
  '.succession-drawer',
]) assert(shellCss.includes(requiredSelector), `shell CSS is missing ${requiredSelector}`);

assert(shellCss.includes('grid-template-columns: var(--succession-sidebar-width) minmax(0, 1fr)'), 'desktop shell must use the shared sidebar-width token');
assert(shellCss.includes('position: sticky') && shellCss.includes('height: 100dvh'), 'desktop sidebar must remain viewport-sticky');
assert(shellCss.includes('width: min(100%, var(--succession-content-width))'), 'workspace stage must respect the shared content-width token');
assert(shellCss.includes('.succession-archive__content > * {\n  min-width: 0;\n  max-width: 100%;'), 'workspace children must not enlarge the shared stage through intrinsic sizing');
assert(shellCss.includes(".succession-archive[data-archive-route='timeline'] .timeline-workspace") && shellCss.includes('margin-inline: 0'), 'preserved Timeline workspace must be clamped to the shell while keeping its internal rail as scroll owner');
assert(!shellCss.includes('overflow: clip'), 'the shell must not hide horizontal-layout regressions from browser QA');
assert(shellCss.includes('@media (max-width: 860px)') && shellCss.includes('@media (max-width: 560px)'), 'tablet/mobile shell breakpoints are required');
assert(shellCss.includes('min-height: 44px'), 'mobile command controls must retain 44px touch targets');
assert(shellCss.includes('@media (prefers-reduced-motion: reduce)'), 'shell motion must respect reduced-motion preferences');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(shellCss), 'shell redesign must not introduce raw hex colors');
assert(!shellCss.includes('!important'), 'shell redesign must not depend on !important overrides');

const expectedImports = "@import './SuccessionVisualFoundation.css';\n@import './SuccessionVisualFoundationBridge.css';\n@import './SuccessionArchiveShellRedesign.css';";
assert(searchCss.trimStart().startsWith(expectedImports), 'shell redesign must load after the Batch 1 foundation and compatibility bridge');
assert(packageJson.includes('"audit:succession-shell-redesign"'), 'package.json must expose the Batch 2 shell audit');
assert(workflow.includes('audit:succession-shell-redesign'), 'maintained Batch 5 workflow must run the Batch 2 shell audit');
assert(workflow.includes('qa:succession-final-release') && workflow.includes('qa:succession-cross-browser'), 'maintained workflow must run responsive and cross-browser release QA');
assert(docs.includes('## Batch 2 — Shell, navigation, and landing experience'), 'design record must include the Batch 2 contract');
assert(docs.includes('### Hour 15 — Shared shell and layout'), 'design record must document Hour 15');
assert(docs.includes('Preserved wide-workspace containment'), 'design record must explain the Timeline containment exception');

for (const file of [
  'src/components/succession/SuccessionArchiveShell.jsx',
  'src/components/succession/SuccessionArchiveShellRedesign.css',
  'scripts/audit-succession-shell-redesign.mjs',
]) await access(path.join(root, file));

console.log('Succession shell redesign audit passed: shared desktop shell, sticky dossier sidebar, controlled workspace stage, preserved wide-workspace containment, mobile command bar, modal drawer, skip navigation, semantic tokens, responsive geometry, reduced-motion behavior, and maintained Batch 5 release workflow verified.');
