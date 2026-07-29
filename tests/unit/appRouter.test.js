import { describe, expect, it } from 'vitest';
import {
  normalizeDestination,
  parseCleanRoute,
  parseLegacyHashRoute,
  routeToCleanPath,
} from '../../src/lib/appRouter.js';

describe('app router', () => {
  it('parses the canonical Succession reader URL without mixing it into the archive shell', () => {
    expect(parseCleanRoute(
      '/story/succession-contest/chapters',
      '?chapter=400&page=2&mode=page&panel=info',
    )).toEqual({
      view: 'series',
      target: 'succession-contest',
      params: {
        section: 'chapters',
        chapter: '400',
        page: '2',
        mode: 'page',
        panel: 'info',
      },
    });
  });

  it('keeps Chapter Records on the canonical archive route', () => {
    const href = routeToCleanPath('succession', 'chapters', { entity: 'chapter:400' });
    expect(href).toMatch(/^\/story\/succession-contest\/chapter-records\?/);
    expect(href).toContain('entity=chapter%3A400');
  });

  it('normalizes Story chronology into the global Timeline domain', () => {
    expect(normalizeDestination('series', 'chronology', { arc: 'yorknew-city', search: 'auction' })).toEqual({
      view: 'timeline',
      target: '',
      params: { arc: 'yorknew-city', scope: 'arc', search: 'auction' },
    });
  });

  it('migrates legacy Succession timeline hashes', () => {
    const route = parseLegacyHashRoute('#/succession/succession-timeline?search=martial%20law');
    expect(route).toEqual({
      view: 'succession',
      target: 'timeline',
      params: { search: 'martial law' },
    });
  });

  it('moves legacy organization conflict views into Fights', () => {
    expect(normalizeDestination('reference', 'systems', { view: 'conflicts', search: 'Hisoka' })).toEqual({
      view: 'reference',
      target: 'conflicts',
      params: { search: 'Hisoka' },
    });
  });

  it('rejects unknown Story paths instead of silently opening another page', () => {
    expect(parseCleanRoute('/story/not-a-real-arc', '')).toEqual({
      view: 'not-found',
      target: '',
      params: { attemptedPath: '/story/not-a-real-arc' },
    });
  });

  it.each([
    ['series', 'hunter-exam', {}],
    ['timeline', '', { arc: 'succession-contest', scope: 'events' }],
    ['reference', 'nen', { search: 'Emperor Time' }],
    ['succession', 'chapters', { entity: 'chapter:415' }],
  ])('round-trips %s/%s through a clean URL', (view, target, params) => {
    const href = routeToCleanPath(view, target, params);
    const url = new URL(href, 'https://archive.test');
    const parsed = parseCleanRoute(url.pathname, url.search);
    const normalized = normalizeDestination(view, target, params);

    expect(parsed.view).toBe(normalized.view);
    expect(parsed.target).toBe(normalized.target);
    expect(parsed.params).toEqual(Object.fromEntries(
      Object.entries(normalized.params).map(([key, value]) => [key, String(value)]),
    ));
  });
});
