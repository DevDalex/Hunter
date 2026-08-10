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
import { abilityFoundation377Expansion } from './abilityFoundation377Expansion.js';
import { abilityFoundation378Expansion } from './abilityFoundation378Expansion.js';
import { abilityFoundation379Expansion } from './abilityFoundation379Expansion.js';
import { abilityFoundation381Expansion } from './abilityFoundation381Expansion.js';
import { abilityFoundation382Expansion } from './abilityFoundation382Expansion.js';
import { abilityFoundation383Expansion } from './abilityFoundation383Expansion.js';
import { abilityFoundation384Expansion } from './abilityFoundation384Expansion.js';
import { abilityFoundation386Expansion } from './abilityFoundation386Expansion.js';
import { abilityFoundation387Expansion } from './abilityFoundation387Expansion.js';
import { abilityFoundation388Expansion } from './abilityFoundation388Expansion.js';
import { abilityFoundation389Expansion } from './abilityFoundation389Expansion.js';
import { abilityFoundation390Expansion } from './abilityFoundation390Expansion.js';
import { abilityFoundation391Expansion } from './abilityFoundation391Expansion.js';
import { abilityFoundation392Expansion } from './abilityFoundation392Expansion.js';
import { abilityFoundation393Expansion } from './abilityFoundation393Expansion.js';
import { abilityFoundation394Expansion } from './abilityFoundation394Expansion.js';
import { abilityFoundation397Expansion } from './abilityFoundation397Expansion.js';
import { abilityFoundation398Expansion } from './abilityFoundation398Expansion.js';

const ARCHIVE_DATE = '2026-08-10';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];
const abilityExpansions = Object.freeze([
  ...abilityFoundationExpansion,
  ...abilityFoundation370Expansion,
  ...abilityFoundation372Expansion,
  ...abilityFoundation373Expansion,
  ...abilityFoundation374Expansion,
  ...abilityFoundation375Expansion,
  ...abilityFoundation377Expansion,
  ...abilityFoundation378Expansion,
  ...abilityFoundation379Expansion,
  ...abilityFoundation381Expansion,
  ...abilityFoundation382Expansion,
  ...abilityFoundation383Expansion,
  ...abilityFoundation384Expansion,
  ...abilityFoundation386Expansion,
  ...abilityFoundation387Expansion,
  ...abilityFoundation388Expansion,
  ...abilityFoundation389Expansion,
  ...abilityFoundation390Expansion,
  ...abilityFoundation391Expansion,
  ...abilityFoundation392Expansion,
  ...abilityFoundation393Expansion,
  ...abilityFoundation394Expansion,
  ...abilityFoundation397Expansion,
  ...abilityFoundation398Expansion,
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
