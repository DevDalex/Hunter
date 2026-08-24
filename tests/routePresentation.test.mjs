import assert from 'node:assert/strict';
import test from 'node:test';
import { successionArchiveRoutes } from '../src/data/succession/archiveRoutes.js';
import {
  getRoutePresentationProfile,
  successionPresentationRouteIds,
} from '../src/data/succession/routePresentation.js';

const densities = new Set(['calm', 'medium', 'high', 'extreme']);

test('every maintained Succession route has an explicit presentation profile', () => {
  const maintained = successionArchiveRoutes.map((route) => route.id).sort();
  const profiled = [...successionPresentationRouteIds].sort();
  assert.deepEqual(profiled, maintained);
});

test('presentation profiles calculate finite information pressure', () => {
  for (const route of successionArchiveRoutes) {
    const profile = getRoutePresentationProfile(route.id);
    assert.equal(profile.routeId, route.id);
    assert.ok(profile.kind);
    assert.ok(Number.isFinite(profile.recordCount));
    assert.ok(profile.recordCount >= 0);
    assert.ok(Number.isFinite(profile.informationUnits));
    assert.ok(profile.informationUnits >= 1);
    assert.ok(densities.has(profile.density));
  }
});

test('known heavy workspaces cannot fall back to spacious presentation', () => {
  for (const routeId of ['timeline', 'events', 'search', 'research']) {
    assert.equal(getRoutePresentationProfile(routeId).density, 'extreme');
  }
});
