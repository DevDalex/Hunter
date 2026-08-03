import { describe, expect, it } from 'vitest';
import { createSuccessionSelectors } from '../../src/data/succession/selectors.js';

const kurapika = Object.freeze({ id: 'character:kurapika', entityType: 'character', slug: 'kurapika', name: 'Kurapika' });
const woble = Object.freeze({ id: 'character:woble', entityType: 'character', slug: 'woble', name: '14th Prince Woble' });
const tierOne = Object.freeze({ id: 'location:tier-1', entityType: 'location', name: 'Tier 1', ancestorIds: [] });
const room1014 = Object.freeze({ id: 'location:room-1014', entityType: 'location', name: 'Room 1014', ancestorIds: ['location:tier-1'] });
const chapter400 = Object.freeze({ id: 'chapter:400', entityType: 'chapter', number: 400, name: 'Chapter 400' });
const alliance = Object.freeze({
  id: 'relationship:kurapika-woble',
  entityType: 'relationship',
  sourceEntityId: kurapika.id,
  targetEntityId: woble.id,
  relationshipType: 'protects',
  sentiment: 'allied',
  status: 'active',
  chapterRange: { start: 358 },
  relatedEventIds: [],
});

const entities = [kurapika, woble, tierOne, room1014, chapter400, alliance];
const byId = new Map(entities.map((entity) => [entity.id, entity]));

const indexes = {
  byId,
  byType: new Map([
    ['character', [kurapika.id, woble.id]],
    ['location', [tierOne.id, room1014.id]],
    ['chapter', [chapter400.id]],
    ['relationship', [alliance.id]],
  ]),
  bySlug: new Map([
    ['character:kurapika', kurapika.id],
    ['character:woble', woble.id],
  ]),
  chaptersByNumber: new Map([[400, chapter400.id]]),
  relationshipsByChapter: new Map([[400, [alliance.id]]]),
  relationshipsByEntity: new Map([
    [kurapika.id, [alliance.id]],
    [woble.id, [alliance.id]],
  ]),
  relationshipsBySource: new Map([[kurapika.id, [alliance.id]]]),
  relationshipsByTarget: new Map([[woble.id, [alliance.id]]]),
  relationshipsByType: new Map([['protects', [alliance.id]]]),
  relationshipsBySentiment: new Map([['allied', [alliance.id]]]),
  relationshipsByEvent: new Map(),
  searchDocuments: [
    { id: kurapika.id, type: 'character', name: 'Kurapika', aliases: ['Chain User'], text: 'Hunter protecting Prince Woble' },
    { id: woble.id, type: 'character', name: '14th Prince Woble', aliases: ['Fourteenth Prince'], text: 'Youngest Kakin prince' },
    { id: room1014.id, type: 'location', name: 'Room 1014', aliases: ['Suite 1014'], text: 'Tier 1 royal quarters' },
  ],
};

const selectors = createSuccessionSelectors({ chapters: [chapter400] }, indexes);

describe('Succession selectors', () => {
  it('resolves entities by ID, slug, and chapter number', () => {
    expect(selectors.getEntityById(kurapika.id)).toBe(kurapika);
    expect(selectors.getCharacter('kurapika')).toBe(kurapika);
    expect(selectors.getChapter('400')).toBe(chapter400);
    expect(selectors.getChapter('not-a-number')).toBeNull();
  });

  it('returns location breadcrumbs in ancestor-to-current order', () => {
    expect(selectors.getLocationBreadcrumbs(room1014.id)).toEqual([tierOne, room1014]);
  });

  it('filters chapter relationships by product-facing fields', () => {
    expect(selectors.getActiveRelationshipsAtChapter(400, {
      entityId: woble.id,
      relationshipType: 'protects',
      sentiment: 'allied',
      status: 'active',
    })).toEqual([alliance]);

    expect(selectors.getActiveRelationshipsAtChapter(400, { sentiment: 'hostile' })).toEqual([]);
  });

  it('normalizes written ordinals during archive search', () => {
    const [result] = selectors.search('fourteenth prince', { types: ['character'] });
    expect(result.entity).toBe(woble);
    expect(result.score).toBeGreaterThan(0);
  });

  it('honors search type and result limits', () => {
    expect(selectors.search('room', { types: ['character'] })).toEqual([]);
    expect(selectors.search('prince', { limit: 1 })).toHaveLength(1);
  });
});
