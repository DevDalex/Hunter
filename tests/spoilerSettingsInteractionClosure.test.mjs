import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const [finalPolish, main] = await Promise.all([
  read('../src/styles/final-polish.css'),
  read('../src/main.jsx'),
]);

test('collapsed spoiler settings cannot create an invisible pointer shield', () => {
  assert.ok(finalPolish.includes('.spoiler-settings:not([open])'));
  assert.ok(finalPolish.includes('pointer-events: none'));
  assert.ok(finalPolish.includes('.spoiler-settings:not([open]) > summary'));
  assert.ok(finalPolish.includes('pointer-events: auto'));
});

test('global CSS ownership remains the exact approved import chain', () => {
  const cssImports = [...main.matchAll(/import ['"](.+?\.css)['"];?/g)].map((match) => match[1]);
  assert.deepEqual(cssImports, ['./styles.css', './nen.css', './styles/final-polish.css']);
  assert.ok(!main.includes('global-interaction-closure.css'));
});
