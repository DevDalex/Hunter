import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), 'utf8');
const assert = (condition, message) => {
  if (!condition) throw new Error(`Succession character command audit failed: ${message}`);
};

const [workspace, commandCss, packageJson, workflow, docs] = await Promise.all([
  read('src/components/succession/SuccessionArchiveCharacterWorkspace.jsx'),
  read('src/components/succession/SuccessionArchiveCharacterCommand.css'),
  read('package.json'),
  read('.github/workflows/succession-visual-redesign.yml'),
  read('docs/SUCCESSION-VISUAL-REDESIGN-BATCH-3.md'),
]);

for (const token of [
  'succession-character-command-hero',
  'succession-character-coverage-ring',
  'succession-character-command-bar',
  'succession-character-view-toggle',
  'data-view={view}',
  'succession-character-card',
]) assert(workspace.includes(token), `character directory or card contract is missing ${token}`);

for (const token of [
  'succession-character-command-profile',
  'succession-character-command-identity',
  'succession-character-command-chapter',
  'succession-character-dossier-nav',
  'id="character-state"',
  'id="character-operations"',
  'id="character-chronology"',
  'id="character-evidence"',
]) assert(workspace.includes(token), `character dossier contract is missing ${token}`);

for (const token of [
  'timelineKinds',
  'intersectsChapter',
  'data-kind={entry.kind}',
  'is-current',
  'aria-current={record.id === dossier.state.id',
]) assert(workspace.includes(token), `chronology contract is missing ${token}`);

for (const selector of [
  '.succession-character-command-hero',
  '.succession-character-command-bar',
  '.succession-character-card',
  '.succession-character-command-profile',
  '.succession-character-dossier-nav',
  '.succession-character-lifetime__lanes',
]) assert(commandCss.includes(selector), `advanced character CSS is missing ${selector}`);

assert(commandCss.includes('@media (max-width: 1180px)'), 'wide-to-tablet character adaptation is required');
assert(commandCss.includes('@media (max-width: 700px)'), 'tablet-to-mobile character adaptation is required');
assert(commandCss.includes('@media (max-width: 520px)'), 'compact mobile character adaptation is required');
assert(commandCss.includes('@media (hover: none)'), 'touch-specific interaction behavior is required');
assert(commandCss.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion behavior is required');
assert(commandCss.includes('min-height: 44px'), 'mobile controls must retain 44px targets');
assert(!/#(?:[0-9a-fA-F]{3,8})\b/.test(commandCss), 'advanced character CSS must not introduce raw hex colors');
assert(!commandCss.includes('!important'), 'advanced character CSS must not depend on !important');
assert(workspace.includes("import './SuccessionArchiveCharacterCommand.css';"), 'character workspace must load the advanced command layer');
assert(packageJson.includes('"audit:succession-character-command"'), 'package.json must expose the character command audit');
assert(workflow.includes('audit:succession-character-command'), 'visual workflow must run the character command audit');
for (const hour of ['Hour 25', 'Hour 26', 'Hour 27', 'Hour 28', 'Hour 29']) assert(docs.includes(hour), `design record must document ${hour}`);

console.log('Succession character command audit passed: directory, cards, profile identity, dossier sections, chronology, accessibility, and responsive contracts are registered.');