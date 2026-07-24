import { successionArchiveData as foundationData } from './entitiesExtended.js';
import {
  abilityFoundationExpansion,
  guardianBeastAbilityExpansion,
} from './abilityFoundationExpansion.js';

const ARCHIVE_DATE = '2026-07-24';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const abilities = Object.freeze(uniqueById([
  ...foundationData.abilities,
  ...abilityFoundationExpansion,
]));

const abilityIdsByChapter = new Map();
for (const ability of abilityFoundationExpansion) {
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
