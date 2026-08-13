import { successionArchiveData as data } from '../src/data/succession/entitiesHighValueIntelligence.js';

const arrays = Object.entries(data).filter(([, value]) => Array.isArray(value));
const ids = new Map();
const slugs = new Map();
for (const [collection, values] of arrays) {
  for (const item of values) {
    if (item?.id) ids.set(item.id, [...(ids.get(item.id) || []), collection]);
    if (item?.entityType && item?.slug) {
      const key = `${item.entityType}:${item.slug}`;
      slugs.set(key, [...(slugs.get(key) || []), `${collection}:${item.id || '?'}`]);
    }
  }
}
for (const [id, owners] of ids) if (owners.length > 1) console.log(`DUP_ID ${id} ${owners.join('|')}`);
for (const [slug, owners] of slugs) if (owners.length > 1) console.log(`DUP_SLUG ${slug} ${owners.join('|')}`);
