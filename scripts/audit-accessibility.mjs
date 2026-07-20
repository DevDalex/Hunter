import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Accessibility audit failed: ${message}`); };

const [app, main, css, contrastCss, accessibilityRuntime, header, familyTree, sectionTabs, downloads, blackWhale, worldMap, systemsDesk, search, drawer, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/main.jsx'),
  read('src/styles.css'),
  read('src/styles/accessibility-contrast.css'),
  read('src/lib/accessibilityRuntime.js'),
  read('src/components/Header.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/SectionTabs.jsx'),
  read('src/components/ArchiveDownloadDialog.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/InteractiveWorldMap.jsx'),
  read('src/components/SystemsDesk.jsx'),
  read('src/components/ArchiveSearch.jsx'),
  read('src/components/ChapterDrawer.jsx'),
  read('package.json'),
]);

assert(app.includes('className="skip-link"') && app.includes('id="main-content" tabIndex="-1"'), 'skip navigation must move focus to the main reading surface');
assert(app.includes('className="site-footer"'), 'the site footer must have an explicit component class');
assert(!/(^|\n)footer\s*\{/.test(css), 'an unscoped footer rule would restyle nested record footers');
assert(!/main > section,\s*footer/.test(css), 'nested footers must not inherit page-shell padding');
assert(css.includes(':focus-visible') && css.includes('prefers-reduced-motion: reduce'), 'focus visibility and reduced-motion handling are required');
assert(contrastCss.includes('--archive-gold-ink: #6b4d00') && contrastCss.includes('--archive-on-dark: #f6ecee') && contrastCss.includes('--archive-active-contrast: #6e1825'), 'the contrast layer must retain tested light, dark, and active-state colors');
assert(main.includes('installAccessibilityRuntime();'), 'main.jsx must install the legacy accessibility normalizer before rendering');
assert(accessibilityRuntime.includes("['.yn-chain-inspector__menu', 'listbox']") && accessibilityRuntime.includes("['.gi-card-tabs', 'tablist']") && accessibilityRuntime.includes("['.ca-tabs', 'tablist']") && accessibilityRuntime.includes("node.setAttribute('role', role)"), 'legacy composite parent roles must be preserved or restored');
assert(accessibilityRuntime.includes("document.querySelectorAll('.ca-table-wrap')") && accessibilityRuntime.includes('node.tabIndex = 0') && accessibilityRuntime.includes("node.setAttribute('aria-label'"), 'the Chimera hierarchy scroll region must be keyboard-focusable and named');
assert(header.includes("event.key === 'Escape'") && header.includes("event.key !== 'Tab'") && header.includes('.header-links a, .header-actions button'), 'the narrow-browser menu must contain focus and close with Escape');
assert(sectionTabs.includes("event.key === 'ArrowRight'") && sectionTabs.includes("event.key === 'Home'") && sectionTabs.includes("event.key === 'End'"), 'grouped section navigation needs full keyboard movement');
assert(familyTree.includes("event.key === 'ArrowRight'") && familyTree.includes('role="tabpanel"') && familyTree.includes('tabIndex={treeMode === id ? 0 : -1}'), 'family-tree modes need roving keyboard focus and named panels');
assert(downloads.includes("event.key === 'Escape'") && downloads.includes("event.key !== 'Tab'") && downloads.includes('role="dialog" aria-modal="true"'), 'the download chooser must trap, restore, and dismiss focus accessibly');
assert(blackWhale.includes('aria-label="Black Whale passenger manifest" tabIndex="0"'), 'the scrollable ship manifest must be keyboard-focusable and named');
assert(worldMap.includes('Skip map and open location list') && worldMap.includes('world-map-inspector__mobile-toggle') && worldMap.includes('aria-label={`${location.name}, ${location.kind}'), 'the world map needs equivalent keyboard, list, and mobile-inspector access');
assert(systemsDesk.includes('Filter organization charts by story period'), 'the organization-chart period selector needs an accessible name');
assert(search.includes('role="status" aria-live="polite"'), 'archive-search result changes need a polite live announcement');
assert(drawer.includes('role="status" aria-live="polite"') && drawer.includes("event.key === 'Escape'"), 'chapter source changes and drawer dismissal must be announced and keyboard-operable');
assert(familyTree.includes('Confirmed deceased'), 'a written nonvisual death status must accompany the red X treatment');
assert(packageJson.includes('"qa:accessibility"') && packageJson.includes('"audit:accessibility"'), 'repeatable accessibility commands are missing');

console.log('Accessibility audit passed: semantic contrast layer; legacy ARIA parent-role preservation; skip navigation; contained menus and dialogs; keyboard section and tree navigation; named scroll regions; live announcements; reduced motion and written status.');
