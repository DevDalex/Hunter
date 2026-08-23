import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from '../src/data/latestChapterMetadata.js';
import { ARCHIVE_BOUNDARY } from '../src/data/archiveMeta.js';
import { successionDays } from '../src/data/successionTimeline.js';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const withMockStorage = async (entries, callback) => {
  const values = new Map(Object.entries(entries));
  const previousWindow = globalThis.window;
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.has(key) ? values.get(key) : null,
      setItem: (key, value) => values.set(key, String(value)),
    },
  };
  try {
    await callback(values);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
};

test('current release boundary reaches Chapter 418 across publication, research, and timeline', () => {
  assert.equal(LATEST_PUBLISHED_CHAPTER, 418);
  assert.equal(LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER, 418);
  assert.equal(ARCHIVE_BOUNDARY, 418);

  const timelineChapters = new Set(successionDays.flatMap((day) => day.events.map((event) => event.chapter)));
  assert.ok(timelineChapters.has(417), 'public voyage timeline must expose Chapter 417 events');
  assert.ok(timelineChapters.has(418), 'public voyage timeline must expose Chapter 418 events');
});

test('legacy maximum spoiler boundary migrates from Chapter 416 to the current archive ceiling', async () => {
  await withMockStorage({ 'hxh-spoiler-limit': '416' }, async (storage) => {
    await import(`../src/data/archiveMeta.js?legacy-boundary=${Date.now()}`);
    assert.equal(storage.get('hxh-spoiler-limit'), '418');
    assert.equal(storage.get('hxh-spoiler-boundary'), '418');
  });
});

test('an explicitly lower spoiler boundary remains preserved during release migration', async () => {
  await withMockStorage({ 'hxh-spoiler-limit': '400' }, async (storage) => {
    await import(`../src/data/archiveMeta.js?explicit-boundary=${Date.now()}`);
    assert.equal(storage.get('hxh-spoiler-limit'), '400');
    assert.equal(storage.get('hxh-spoiler-boundary'), '418');
  });
});

test('browser-facing current-release surfaces do not clamp the archive at Chapter 417', async () => {
  const [archiveMeta, archiveMemory, completionWorkbench] = await Promise.all([
    read('src/data/archiveMeta.js'),
    read('src/data/succession/archiveMemory.js'),
    read('src/components/succession/SuccessionContentCompletionWorkbench.jsx'),
  ]);

  assert.match(archiveMeta, /hxh-spoiler-boundary/);
  assert.match(archiveMeta, /LEGACY_DEFAULT_BOUNDARIES/);
  assert.doesNotMatch(archiveMemory, /Math\.min\(417\s*,/);
  assert.doesNotMatch(completionWorkbench, /Math\.min\(417\s*,/);
  assert.match(archiveMemory, /LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER/);
  assert.match(completionWorkbench, /LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER/);
});

test('production build stays lightweight while verification remains explicit', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.scripts.build, 'npm run build:runtime');
  assert.ok(!pkg.scripts['build:runtime'].includes('audit:succession-runtime'));
  assert.equal(pkg.scripts.verify, 'npm run check && npm run build:runtime');
  assert.ok(pkg.scripts.deploy.startsWith('npm run verify'));
});
