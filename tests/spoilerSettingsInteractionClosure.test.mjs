import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [closure, main] = await Promise.all([
  read('../src/styles/global-interaction-closure.css'),
  read('../src/main.jsx'),
]);

test('collapsed spoiler settings cannot create an invisible pointer shield', () => {
  assert.ok(closure.includes('.spoiler-settings:not([open])'));
  assert.ok(closure.includes('pointer-events: none'));
  assert.ok(closure.includes('.spoiler-settings:not([open]) > summary'));
  assert.ok(closure.includes('pointer-events: auto'));
  assert.ok(main.includes("import './styles/global-interaction-closure.css';"));
});
