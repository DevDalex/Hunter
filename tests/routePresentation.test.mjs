import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { successionArchiveRoutes } from '../src/data/succession/archiveRoutes.js';

const presentationSource = await readFile(new URL('../src/data/succession/routePresentation.js', import.meta.url), 'utf8');

const keyForRoute = (routeId) => routeId.includes('-') ? `'${routeId}'` : routeId;

test('every maintained Succession route has an explicit presentation profile', () => {
  for (const route of successionArchiveRoutes) {
    assert.match(
      presentationSource,
      new RegExp(`\\n\\s*${keyForRoute(route.id).replaceAll('-', '\\-')}\\s*:`),
      `missing presentation profile for ${route.id}`,
    );
  }
});

test('presentation engine keeps explicit information-pressure thresholds', () => {
  for (const [density, threshold] of [
    ['calm', '1–39 information units'],
    ['medium', '40–119 information units'],
    ['high', '120–259 information units'],
    ['extreme', '260+ information units'],
  ]) {
    assert.match(presentationSource, new RegExp(`${density}: '${threshold.replace('+', '\\+')}'`));
  }
  assert.match(presentationSource, /informationUnits = Math\.max\(1, Math\.round\(recordCount \* profile\.complexity\)\)/);
});

test('known heavy workspaces cannot fall back to spacious presentation', () => {
  for (const routeId of ['timeline', 'events', 'search', 'research']) {
    const key = keyForRoute(routeId).replaceAll('-', '\\-');
    assert.match(presentationSource, new RegExp(`${key}: \\{[^\\n]+floor: 'extreme'`));
  }
});
