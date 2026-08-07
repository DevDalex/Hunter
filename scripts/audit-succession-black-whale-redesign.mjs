#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession Black Whale redesign audit failed: ${message}`);
};

const cssFiles = [
  'SuccessionBlackWhaleTheme.css',
  'SuccessionCommandHome.css',
  'SuccessionOperationalWorkspaces.css',
  'SuccessionRoyalRegistry.css',
  'SuccessionVesselAtlas.css',
  'SuccessionNenContainment.css',
  'SuccessionIntelligenceOperations.css',
  'SuccessionTimelineCommand.css',
  'SuccessionResearchLibrary.css',
  'SuccessionReaderCommand.css',
  'SuccessionAccessibilityClosure.css',
];

const componentRoot = 'src/components/succession';
const [entry, shell, readerRoute, ...styles] = await Promise.all([
  read(`${componentRoot}/SuccessionArchiveEntry.jsx`),
  read(`${componentRoot}/SuccessionArchiveShell.jsx`),
  read(`${componentRoot}/SuccessionArchiveReaderRoute.jsx`),
  ...cssFiles.map((file) => read(`${componentRoot}/${file}`)),
]);

for (const file of cssFiles) {
  await access(path.join(root, componentRoot, file));
  assert(entry.includes(`import './${file}';`), `${file} is not loaded by SuccessionArchiveEntry`);
}

const accessibilityImport = entry.indexOf("import './SuccessionAccessibilityClosure.css';");
const readerImport = entry.indexOf("import './SuccessionReaderCommand.css';");
assert(accessibilityImport > readerImport, 'accessibility closure must load after all visual route layers');
assert(entry.includes("props.routeTarget === 'reader'"), 'Reader route is not intercepted by the archive entry');
assert(entry.includes('<SuccessionArchiveReaderRoute {...props} />'), 'Reader route wrapper is not rendered');

assert(shell.includes('succession-archive__status-strip'), 'Black Whale operational status strip is missing');
assert(shell.includes('<Ship size={14}'), 'status strip no longer identifies the Black Whale');
assert(shell.includes('Succession Intelligence'), 'archive command identity is missing');
assert(shell.includes('SuccessionCommandHome'), 'command-center homepage is not mounted by the archive shell');

assert(readerRoute.includes('<SuccessionChapterReader'), 'integrated reader no longer mounts SuccessionChapterReader');
assert(readerRoute.includes('entity: `chapter:${chapter}`'), 'reader-to-chapter-record bridge does not preserve the canonical chapter entity ID');
assert(readerRoute.includes('chapter,'), 'reader-to-chapter-record bridge does not preserve the chapter number');
assert(readerRoute.includes("onExitArchive={() => onNavigate('archive')}"), 'reader cannot return to the archive');

const combined = styles.join('\n');
const requiredSelectors = [
  '.succession-archive__status-strip',
  '.succession-command-home__portals',
  '.succession-royal-command',
  '.black-whale-intelligence',
  '.succession-nen-command',
  '.succession-assignment-command',
  '.succession-event-command',
  '.succession-canonical-relationships',
  '.timeline-command-voyage',
  '.succession-evidence-workspace',
  '.succession-glossary-canonical',
  '.succession-reader-command',
];
for (const selector of requiredSelectors) assert(combined.includes(selector), `required redesigned surface is missing: ${selector}`);

assert(combined.includes('--succession-royal-gold'), 'restricted royal-gold token is missing');
assert(!combined.includes('var(--archive-gold'), 'new Succession layers must not reuse generic archive gold');
assert(!combined.includes('#d9bb5e'), 'legacy universal gold remains in the new redesign layers');
assert(!combined.includes('#e3c96f'), 'legacy decorative gold remains in the new redesign layers');

const accessibility = styles.at(-1);
assert(accessibility.includes('font-size: max(11px, .6875rem) !important'), '11px compact-text floor is missing');
assert(accessibility.includes('min-height: 44px'), '44px interaction target floor is missing');
assert(accessibility.includes('@media (forced-colors: active)'), 'forced-colors support is missing');
assert(accessibility.includes('@media (prefers-contrast: more)'), 'increased-contrast support is missing');

for (const [index, source] of styles.entries()) {
  const opening = (source.match(/\{/g) || []).length;
  const closing = (source.match(/\}/g) || []).length;
  assert(opening === closing, `${cssFiles[index]} has unbalanced CSS blocks (${opening} opening, ${closing} closing)`);
}

console.log(`Succession Black Whale redesign audit passed: ${cssFiles.length} themed layers, reference-matched portal homepage, integrated Reader route, operational shell, route coverage, accessibility closure, and canonical chapter bridge verified.`);
