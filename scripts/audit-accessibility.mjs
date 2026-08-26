import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Accessibility audit failed: ${message}`); };

const [app, main, css, contrastCss, accessibilityRuntime, header, familyTree, royalTree, royalTreeNodes, royalTreeModel, sectionTabs, blackWhale, worldMap, successionApp, reader, readerPanel, packageJson] = await Promise.all([
  read('src/App.jsx'), read('src/main.jsx'), read('src/styles.css'), read('src/styles/accessibility-contrast.css'), read('src/lib/accessibilityRuntime.js'), read('src/components/Header.jsx'), read('src/components/FamilyTree.jsx'), read('src/components/succession/RoyalFamilyGuardTree.jsx'), read('src/components/succession/RoyalFamilyBoardNodes.jsx'), read('src/components/succession/RoyalFamilyBoardModel.js'), read('src/components/SectionTabs.jsx'), read('src/components/BlackWhaleGuide.jsx'), read('src/components/InteractiveWorldMap.jsx'), read('src/components/succession/SuccessionArchiveApp.jsx'), read('src/components/SuccessionChapterReader.jsx'), read('src/components/succession-reader/ReaderPanel.jsx'), read('package.json'),
]);

const royalTreeSource = `${royalTree}\n${royalTreeNodes}\n${royalTreeModel}`;
const readerSource = `${reader}\n${readerPanel}`;
assert(app.includes('className="skip-link"') && app.includes('id="main-content" tabIndex="-1"'), 'skip navigation must move focus to the main reading surface');
assert(app.includes('className="site-footer"'), 'the site footer must have an explicit component class');
assert(!/(^|\n)footer\s*\{/.test(css), 'an unscoped footer rule would restyle nested record footers');
assert(!/main > section,\s*footer/.test(css), 'nested footers must not inherit page-shell padding');
assert(css.includes(':focus-visible') && css.includes('prefers-reduced-motion: reduce'), 'focus visibility and reduced-motion handling are required');
assert(contrastCss.includes('--archive-gold-ink: #6b4d00') && contrastCss.includes('--archive-on-dark: #f6ecee') && contrastCss.includes('--archive-active-contrast: #6e1825'), 'the contrast layer must retain tested light, dark, and active-state colors');
assert(main.includes('installAccessibilityRuntime();'), 'main.jsx must install the accessibility normalizer before rendering');
assert(accessibilityRuntime.includes("node.setAttribute('role', role)"), 'legacy composite parent roles must remain normalized');
assert(header.includes('id="primary-navigation"') && header.includes('className="header-links"'), 'desktop primary navigation must remain explicit and labelled');
assert(!header.includes('mobile-menu-button') && !header.includes('menuOpen'), 'narrow-screen header menu must not return');
assert(sectionTabs.includes("event.key === 'ArrowRight'") && sectionTabs.includes("event.key === 'Home'") && sectionTabs.includes("event.key === 'End'"), 'grouped section navigation needs full keyboard movement');
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the family-tree route must mount the accessible unified royal visualization');
for (const token of ['royal-map__viewport','royal-map__queen-node','royal-map__prince-summary','royal-map__guard-mini','royal-map__force-summary','royal-map__controls','royal-map__inspector']) assert(royalTreeSource.includes(token), `the accessible Royal Family relationship map is missing ${token}`);
assert(royalTreeSource.includes("'aria-pressed': pinned") && royalTreeSource.includes("aria-current={selected ? 'true' : undefined}"), 'pin state and current prince state must remain semantically distinct');
assert(royalTreeSource.includes("'aria-controls': 'royal-map-inspector'") && royalTreeSource.includes('id="royal-map-inspector"'), 'every map trigger must identify the controlled inspector');
assert(!royalTreeSource.includes('setHoverdKey'), 'the misspelled blur setter must remain absent');
assert(!royalTree.includes('<main className="royal-map__main">'), 'the embedded Royal Family map must not create a nested main landmark');
assert(blackWhale.includes('aria-label="Black Whale passenger manifest" tabIndex="0"'), 'the ship manifest must be keyboard-focusable and named');
assert(worldMap.includes('Skip map and open location list'), 'the retained World Atlas needs an equivalent keyboard/list route around its visual map');
assert(!worldMap.includes('world-map-inspector__mobile-toggle'), 'the desktop-only World Atlas must not restore an alternate narrow-screen inspector control');
assert(successionApp.includes('role="status" aria-live="polite"') && successionApp.includes('Search canonical Succession Archive'), 'Succession search changes need a polite live announcement and an accessible input name');
assert(readerSource.includes("event.key === 'Escape'") || readerSource.includes("case 'Escape'"), 'the retained Succession reader must support Escape dismissal');
assert(packageJson.includes('"qa:accessibility"') && packageJson.includes('"audit:accessibility"'), 'repeatable accessibility commands are missing');
console.log('Accessibility audit passed: the desktop-focused Succession, Nen, and World surfaces retain skip navigation, contrast, keyboard navigation, semantic search status, map alternatives, reader dismissal, reduced motion, and written states.');
