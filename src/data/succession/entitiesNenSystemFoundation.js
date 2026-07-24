import { successionArchiveData as organizationFoundationData } from './entitiesOrganizationFoundation.js';
import {
  abilitySystemLinks,
  guardianBeastStateProfiles,
  nenSystemProfiles,
} from './nenSystemFoundation.js';
import { nenSystemAbilityExpansion } from './nenSystemAbilityExpansion.js';

const ARCHIVE_DATE = '2026-07-25';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const abilities = Object.freeze(uniqueById([
  ...organizationFoundationData.abilities,
  ...nenSystemAbilityExpansion,
]));

const expansionAbilityIdsByChapter = new Map();
for (const ability of nenSystemAbilityExpansion) {
  for (const chapter of ability.sourceChapterNumbers || []) {
    const current = expansionAbilityIdsByChapter.get(chapter) || [];
    current.push(ability.id);
    expansionAbilityIdsByChapter.set(chapter, current);
  }
}

const chapters = Object.freeze(organizationFoundationData.chapters.map((chapter) => Object.freeze({
  ...chapter,
  abilityIds: Object.freeze(unique([
    ...(chapter.abilityIds || []),
    ...(expansionAbilityIdsByChapter.get(chapter.number) || []),
  ])),
  updatedAt: ARCHIVE_DATE,
})));

const guardianBeasts = Object.freeze(organizationFoundationData.guardianBeasts.map((beast) => {
  if (beast.id !== 'guardian-beast:benjamin') return beast;
  return Object.freeze({
    ...beast,
    knownAbilityIds: Object.freeze(unique([
      ...(beast.knownAbilityIds || []),
      'ability:benjamin-guardian-curse-dispersal',
    ])),
    updatedAt: ARCHIVE_DATE,
  });
}));

export const successionArchiveData = Object.freeze({
  ...organizationFoundationData,
  abilities,
  guardianBeasts,
  chapters,
  nenSystemProfiles,
  guardianBeastStateProfiles,
  abilitySystemLinks,
});
