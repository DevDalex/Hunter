import { successionArchiveData as foundationData } from './entitiesExtended.js';
import {
  abilityFoundationExpansion,
  guardianBeastAbilityExpansion,
} from './abilityFoundationExpansion.js';
import { abilityFoundation370Expansion } from './abilityFoundation370Expansion.js';
import { abilityFoundation372Expansion } from './abilityFoundation372Expansion.js';
import { abilityFoundation373Expansion } from './abilityFoundation373Expansion.js';
import { abilityFoundation374Expansion } from './abilityFoundation374Expansion.js';
import { abilityFoundation375Expansion } from './abilityFoundation375Expansion.js';

const ARCHIVE_DATE = '2026-08-08';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const abilityExpansions = Object.freeze([
  ...abilityFoundationExpansion,
  ...abilityFoundation370Expansion,
  ...abilityFoundation372Expansion,
  ...abilityFoundation373Expansion,
  ...abilityFoundation374Expansion,
  ...abilityFoundation375Expansion,
]);

const abilities = Object.freeze(uniqueById([
  ...foundationData.abilities,
  ...abilityExpansions,
]));

const abilityIdsByChapter = new Map();
for (const ability of abilityExpansions) {
  for (const chapterNumber of ability.sourceChapterNumbers || []) {
    const current = abilityIdsByChapter.get(chapterNumber) || [];
    current.push(ability.id);
    abilityIdsByChapter.set(chapterNumber, current);
  }
}

const chapters = Object.freeze(foundationData.chapters.map((chapter) => Object.freeze({
  ...chapter,
  abilityIds: Object.freeze(unique([
    ...(chapter.abilityIds || []),
    ...(abilityIdsByChapter.get(chapter.number) || []),
  ])),
  updatedAt: ARCHIVE_DATE,
})));

const guardianBeasts = Object.freeze(foundationData.guardianBeasts.map((beast) => {
  const expansion = guardianBeastAbilityExpansion[beast.id];
  if (!expansion) return beast;

  return Object.freeze({
    ...beast,
    knownAbilityIds: Object.freeze(unique([
      ...(beast.knownAbilityIds || []),
      ...(expansion.knownAbilityIds || []),
    ])),
    suspectedAbilityIds: Object.freeze(unique([
      ...(beast.suspectedAbilityIds || []),
      ...(expansion.suspectedAbilityIds || []),
    ])),
    updatedAt: ARCHIVE_DATE,
  });
}));

export const successionArchiveData = Object.freeze({
  ...foundationData,
  abilities,
  guardianBeasts,
  chapters,
});
