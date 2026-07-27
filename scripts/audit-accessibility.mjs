import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(`Accessibility audit failed: ${message}`); };

const [app, main, css, contrastCss, accessibilityRuntime, header, familyTree, royalTree, royalTreeNodes, royalTreeModel, sectionTabs, blackWhale, worldMap, systemsDesk, search, drawer, packageJson] = await Promise.all([
  read('src/App.jsx'),
  read('src/main.jsx'),
  read('src/styles.css'),
  read('src/styles/accessibility-contrast.css'),
  read('src/lib/accessibilityRuntime.js'),
  read('src/components/Header.jsx'),
  read('src/components/FamilyTree.jsx'),
  read('src/components/succession/RoyalFamilyGuardTree.jsx'),
  read('src/components/succession/RoyalFamilyBoardNodes.jsx'),
  read('src/components/succession/RoyalFamilyBoardModel.js'),
  read('src/components/SectionTabs.jsx'),
  read('src/components/BlackWhaleGuide.jsx'),
  read('src/components/InteractiveWorldMap.jsx'),
  read('src/components/SystemsDesk.jsx'),
  read('src/components/ArchiveSearch.jsx'),
  read('src/components/ChapterDrawer.jsx'),
  read('package.json'),
]);

const royalTreeSource = `${royalTree}\n${royalTreeNodes}\n${royalTreeModel}`;

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
assert(familyTree.includes('RoyalFamilyGuardTree'), 'the family-tree route must mount the accessible unified royal visualization');
for (const token of ['royal-map__viewport', 'royal-map__queen-node', 'royal-map__prince-summary', 'royal-map__guard-mini', 'royal-map__force-summary', 'royal-map__force-member', 'royal-map__controls', 'royal-map__inspector']) assert(royalTreeSource.includes(token), `the accessible Royal Family relationship map is missing ${token}`);
assert(royalTreeSource.includes("'aria-pressed': pinned") && royalTreeSource.includes("aria-current={selected ? 'true' : undefined}"), 'pin state and current prince state must remain semantically distinct');
assert(royalTreeSource.includes("'aria-controls': 'royal-map-inspector'") && royalTreeSource.includes('id="royal-map-inspector"'), 'every map trigger must identify the single controlled inspector');
assert(royalTreeSource.includes('onFocus: () => onPreview(record)') && royalTreeSource.includes('onBlur: onClear') && royalTreeSource.includes('onMouseEnter: () => onPreview(record)'), 'Royal Family previews must remain keyboard and pointer accessible');
assert(
  royalTreeNodes.includes('aria-live="polite"')
    && royalTreeNodes.includes('<h3 id={titleId}>{record.name}</h3>')
    && royalTree.includes('const activeRecord = hoveredRecord || pinnedRecord;'),
  'the interaction-driven inspector must announce the active record name without forcing a default panel',
);
assert(!royalTreeSource.includes('setHoverdKey'), 'the misspelled blur setter must remain absent');
assert(royalTreeSource.includes('abilityLabelFor') && royalTreeSource.includes('getOrganizationMembers'), 'guards and mafia members must expose essential profile information through the inspector');
assert(!royalTree.includes('<main className="royal-map__main">'), 'the embedded Royal Family map must not create a nested main landmark');
assert(royalTreeSource.includes("status === 'deceased'") && royalTreeSource.includes("? 'Deceased'"), 'the royal visualization must expose a written nonvisual death status');
assert(
  royalTreeNodes.includes('aria-label={`${prince.short} protection and intelligence circle.')
    && royalTreeNodes.includes('All ${guards.length} documented records shown.')
    && royalTree.includes('aria-label="Pan and zoom the Kakin royal relationship map.')
    && royalTree.includes("event.key === 'ArrowLeft'")
    && royalTree.includes("event.key === '+'")
    && royalTree.includes("event.key === '0'")
    && royalTree.includes("event.key.toLowerCase() === 'r'"),
  'the map, complete protection circles, and keyboard pan/zoom commands must have meaningful accessible names',
);
for (const label of ['Zoom in', 'Zoom out', 'Fit entire relationship map', 'Reset map to one hundred percent', 'Current zoom level']) {
  assert(royalTree.includes(label), `the map controls are missing the accessible label: ${label}`);
}
assert(royalTree.includes("if (event.key === 'Escape')") && royalTree.includes('setPinnedRecord(null)'), 'keyboard users must be able to clear pinned records with Escape');
assert(blackWhale.includes('aria-label="Black Whale passenger manifest" tabIndex="0"'), 'the scrollable ship manifest must be keyboard-focusable and named');
assert(worldMap.includes('Skip map and open location list') && worldMap.includes('world-map-inspector__mobile-toggle') && worldMap.includes('aria-label={`${location.name}, ${location.kind}'), 'the world map needs equivalent keyboard, list, and mobile-inspector access');
assert(systemsDesk.includes('Filter organization charts by story period'), 'the organization-chart period selector needs an accessible name');
assert(search.includes('role="status" aria-live="polite"'), 'archive-search result changes need a polite live announcement');
assert(drawer.includes('role="status" aria-live="polite"') && drawer.includes("event.key === 'Escape'"), 'chapter source changes and drawer dismissal must be announced and keyboard-operable');
assert(packageJson.includes('"qa:accessibility"') && packageJson.includes('"audit:accessibility"'), 'repeatable accessibility commands are missing');

console.log('Accessibility audit passed: semantic contrast layer; legacy ARIA parent-role preservation; skip navigation; contained menus; keyboard and pointer pannable Royal Family map; named zoom controls; distinct pinned/current states; interaction-driven live inspector; complete named protection regions; Escape clearing; reduced motion and written status.');
