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

const enrichAbility = (ability) => {
  if (ability.id !== 'ability:parallel-future') return ability;
  return Object.freeze({
    ...ability,
    summary: 'Tserriednich enters Zetsu to receive a ten-second precognitive vision, then remains aware as the predicted sequence unfolds while his own actions can diverge from it.',
    activation: 'Tserriednich closes his eyes and enters Zetsu to receive the ten-second precognitive vision.',
    conditions: Object.freeze(unique([
      ...(ability.conditions || []),
      'The precognitive vision is linked to entering Zetsu.',
      'Other people continue through the perceived sequence without sharing Tserriednich’s awareness of the divergence.',
    ])),
    knownUses: Object.freeze(unique([
      ...(ability.knownUses || []),
      'Used during Theta’s attempted assassination while Tserriednich’s Zetsu training develops.',
    ])),
    updatedAt: ARCHIVE_DATE,
  });
};

const abilities = Object.freeze(uniqueById([
  ...organizationFoundationData.abilities,
  ...nenSystemAbilityExpansion,
]).map(enrichAbility));

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