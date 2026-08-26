import { successionArchiveData as base } from './entitiesCharacter414Bridge.js';

const freeze = (value) => Object.freeze(value);

const saquelle = freeze({
  id: 'character:saquelle',
  entityType: 'character',
  slug: 'saquelle',
  name: 'Saquelle',
  aliases: freeze([]),
  summary: 'A Room 1013 guard present with Marayam’s household. In Chapter 415 he receives a radio order fifteen minutes before Special Martial Law is declared, and Biscuit notices the resulting change in his aura.',
  sourceIds: freeze(['source:chapter-415']),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-14',
  updatedAt: '2026-08-14',
  status: freeze({ life: 'alive', certainty: 'confirmed', asOfChapter: 415, note: 'Active inside Room 1013 immediately before Special Martial Law.' }),
  roles: freeze(['guard']),
  affiliations: freeze([]),
  tags: freeze(['guard', 'room-1013', 'succession-contest']),
  media: freeze({ portrait: null, galleryIds: freeze([]), source: null }),
  referenceUrl: 'https://hunterxhunter.fandom.com/wiki/Saquelle',
  princeOrder: null,
  queenRank: null,
  royalMother: null,
});

const characters = freeze([
  ...base.characters.filter((record) => record.id !== saquelle.id),
  saquelle,
].sort((left, right) => left.name.localeCompare(right.name)));

export const successionArchiveData = freeze({ ...base, characters });
