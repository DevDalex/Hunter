import { successionArchiveData as productFoundationData } from './entitiesProductClosureFoundation.js';
import { applySuccession414415ArchiveCorrections } from '../succession414415Research.js';

const systemIdCorrections = Object.freeze({
  'nen-system:post-mortem-nen-continuation': 'nen-system:post-mortem-nen',
  'nen-system:royal-curse-networks': 'nen-system:curse-networks',
  'nen-system:contracts-vows-conditional-power': 'nen-system:contracts-vows-and-conditions',
  'nen-system:possession-consciousness-transfer': 'nen-system:possession-and-consciousness-transfer',
});

const glossaryEntries = Object.freeze((productFoundationData.glossaryEntries || []).map((entry) => Object.freeze({
  ...entry,
  relatedEntityIds: Object.freeze((entry.relatedEntityIds || []).map((id) => systemIdCorrections[id] || id)),
})));

const chapterCurrencyData = applySuccession414415ArchiveCorrections(Object.freeze({
  ...productFoundationData,
  glossaryEntries,
}));
const latestImportedChapter = chapterCurrencyData.chapters.at(-1)?.number || 415;

const closeSupersededStateRanges = (profiles = {}) => Object.freeze(Object.fromEntries(
  Object.entries(profiles).map(([characterId, records]) => {
    const sorted = [...records].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id));
    return [characterId, Object.freeze(sorted.map((record, index) => {
      const next = sorted[index + 1];
      if (!next || (record.chapterRange.end !== null && record.chapterRange.end !== undefined)) return record;
      return Object.freeze({
        ...record,
        chapterRange: Object.freeze({ ...record.chapterRange, end: next.chapterRange.start - 1 }),
      });
    }))];
  }),
));

const normalizeCharacterBoundary = (character) => {
  const current = character.status
    ? Object.freeze({
      ...character,
      status: Object.freeze({ ...character.status, asOfChapter: latestImportedChapter }),
    })
    : character;
  if (current.id !== 'character:furykov') return current;
  return Object.freeze({
    ...current,
    nen: Object.freeze({
      ...(current.nen || {}),
      naturalType: 'conjuration',
    }),
  });
};

export const successionArchiveData = Object.freeze({
  ...chapterCurrencyData,
  characters: Object.freeze(chapterCurrencyData.characters.map(normalizeCharacterBoundary)),
  characterStateProfiles: closeSupersededStateRanges(chapterCurrencyData.characterStateProfiles),
});
