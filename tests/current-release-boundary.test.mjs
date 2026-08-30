import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
  LATEST_PUBLISHED_CHAPTER,
} from '../src/data/latestChapterMetadata.js';
import { ARCHIVE_BOUNDARY } from '../src/data/archiveMeta.js';
import { successionDays } from '../src/data/successionTimeline.js';

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

test('archive boundaries stay internally consistent', () => {
  assert.equal(ARCHIVE_BOUNDARY, LATEST_PUBLISHED_CHAPTER);
  assert.ok(LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER <= ARCHIVE_BOUNDARY);
  const timelineChapters = successionDays.flatMap((day) => day.events.map((event) => event.chapter)).filter(Number.isFinite);
  assert.ok(timelineChapters.every((chapter) => chapter <= ARCHIVE_BOUNDARY));
});

test('a previously tracked default spoiler boundary follows a newer release', async () => {
  const oldBoundary = Math.max(1, ARCHIVE_BOUNDARY - 1);
  await withMockStorage({
    'hxh-spoiler-limit': String(oldBoundary),
    'hxh-spoiler-boundary': String(oldBoundary),
  }, async (storage) => {
    await import(`../src/data/archiveMeta.js?tracked-boundary=${Date.now()}`);
    assert.equal(storage.get('hxh-spoiler-limit'), String(ARCHIVE_BOUNDARY));
    assert.equal(storage.get('hxh-spoiler-boundary'), String(ARCHIVE_BOUNDARY));
  });
});

test('an explicitly lower spoiler boundary remains a user choice', async () => {
  const explicitBoundary = Math.max(1, ARCHIVE_BOUNDARY - 10);
  await withMockStorage({ 'hxh-spoiler-limit': String(explicitBoundary) }, async (storage) => {
    await import(`../src/data/archiveMeta.js?explicit-boundary=${Date.now()}`);
    assert.equal(storage.get('hxh-spoiler-limit'), String(explicitBoundary));
    assert.equal(storage.get('hxh-spoiler-boundary'), String(ARCHIVE_BOUNDARY));
  });
});
