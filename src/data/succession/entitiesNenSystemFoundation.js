import { successionArchiveData as organizationFoundationData } from './entitiesOrganizationFoundation.js';
import {
  abilitySystemLinks,
  guardianBeastStateProfiles,
  nenSystemProfiles,
} from './nenSystemFoundation.js';
import { nenSystemAbilityExpansion } from './nenSystemAbilityExpansion.js';
import { guardianBeastState375Corrections } from './nenSystemFoundation375Corrections.js';
import { nenSystemProfile378Corrections } from './nenSystemFoundation378Corrections.js';
import {
  abilityKnowledge385Overrides,
  guardianBeastState385Corrections,
} from './nenSystemFoundation385Corrections.js';

const ARCHIVE_DATE = '2026-08-09';
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

const guardianBeastProfileKeys = new Set([
  ...Object.keys(guardianBeastStateProfiles),
  ...Object.keys(guardianBeastState375Corrections),
  ...Object.keys(guardianBeastState385Corrections),
]);

const correctedGuardianBeastStateProfiles = Object.freeze(Object.fromEntries(
  [...guardianBeastProfileKeys].map((beastId) => {
    const records = new Map((guardianBeastStateProfiles[beastId] || []).map((record) => [record.id, record]));
    for (const correction of guardianBeastState375Corrections[beastId] || []) records.set(correction.id, correction);
    for (const correction of guardianBeastState385Corrections[beastId] || []) records.set(correction.id, correction);
    return [beastId, Object.freeze([...records.values()].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)))];
  }),
));

const correctedNenSystemProfiles = Object.freeze({
  ...nenSystemProfiles,
  ...nenSystemProfile378Corrections,
});

export const successionArchiveData = Object.freeze({
  ...organizationFoundationData,
  abilities,
  guardianBeasts,
  chapters,
  nenSystemProfiles: correctedNenSystemProfiles,
  guardianBeastStateProfiles: correctedGuardianBeastStateProfiles,
  abilityKnowledgeOverrides: Object.freeze({
    ...(organizationFoundationData.abilityKnowledgeOverrides || {}),
    ...abilityKnowledge385Overrides,
  }),
  abilitySystemLinks,
});