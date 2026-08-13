import { successionArchiveData as base } from './entitiesCharacterFoundation.js';

const freeze = (value) => Object.freeze(value);
const chiyamasi = freeze({
  id: 'character:chiyamasi',
  entityType: 'character',
  slug: 'chiyamasi',
  name: 'Chiyamasi',
  aliases: freeze([]),
  summary: 'A named Chapter 414 participant paired with Yushohi outside Room 1009 and identified as the user of Muteking.',
  sourceIds: freeze(['source:chapter-414']),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-13',
  updatedAt: '2026-08-13',
  status: freeze({ life: 'alive', certainty: 'confirmed', asOfChapter: 414, note: 'Active outside Room 1009 at the strict Chapter 414 boundary.' }),
  roles: freeze(['bodyguard']),
  affiliations: freeze([]),
  tags: freeze(['bodyguard', 'succession-contest']),
  media: freeze({ portrait: null, galleryIds: freeze([]), source: null }),
  referenceUrl: 'https://hunterxhunter.fandom.com/wiki/Chiyamasi',
  princeOrder: null,
  queenRank: null,
  royalMother: null,
});

const characters = freeze([
  ...base.characters.filter((record) => record.id !== chiyamasi.id),
  chiyamasi,
].sort((left, right) => left.name.localeCompare(right.name)));

export const successionArchiveData = freeze({ ...base, characters });
