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
import { abilityKnowledge386Overrides } from './nenSystemFoundation386Corrections.js';
import { abilityKnowledge387Overrides } from './nenSystemFoundation387Corrections.js';
import {
  abilityKnowledge389Overrides,
  guardianBeastState389Corrections,
  nenSystemProfile389Corrections,
} from './nenSystemFoundation389Corrections.js';
import {
  abilityKnowledge390Overrides,
  guardianBeastState390Corrections,
} from './nenSystemFoundation390Corrections.js';
import { abilityKnowledge391Overrides } from './nenSystemFoundation391Corrections.js';
import { abilityKnowledge392Overrides } from './nenSystemFoundation392Corrections.js';
import { abilityKnowledge393Overrides } from './nenSystemFoundation393Corrections.js';
import { abilityKnowledge394Overrides } from './nenSystemFoundation394Corrections.js';
import {
  abilityKnowledge398Overrides,
  nenSystemProfile398Corrections,
} from './nenSystemFoundation398Corrections.js';
import { abilityKnowledge399Overrides } from './nenSystemFoundation399Corrections.js';
import { abilityKnowledge400Overrides } from './nenSystemFoundation400Corrections.js';
import { abilityKnowledge401Overrides } from './nenSystemFoundation401Corrections.js';
import { abilityKnowledge402Overrides, guardianBeastState402Corrections } from './nenSystemFoundation402Corrections.js';

const ARCHIVE_DATE = '2026-08-10';
const unique = (values) => [...new Set(values.filter(Boolean))];
const uniqueById = (values) => [...new Map(values.map((value) => [value.id, value])).values()];

const enrichAbility = (ability) => {
  if (ability.id !== 'ability:parallel-future') return ability;
  return Object.freeze({
    ...ability,
    summary: 'Tserriednich enters Zetsu with his eyes closed to receive a vision ten seconds ahead; if he maintains the state, the future view continues while real time advances and his actual actions can diverge from the forecast perceived by the demonstrated observer.',
    activation: 'Tserriednich closes his eyes and fully enters Zetsu; static precedes the ten-second-ahead vision.',
    conditions: Object.freeze(unique([
      ...(ability.conditions || []),
      'The demonstrated activation uses an eyes-closed Zetsu state.',
      'Maintaining the required state lets the future vision continue beyond the first ten-second preview.',
      'In the demonstrated Theta interaction, the observer continues through the forecast sequence without sharing Tserriednich’s awareness of his divergent actual behavior.',
    ])),
    knownUses: Object.freeze(unique([
      ...(ability.knownUses || []),
      'Chapter 387 reveals the ten-second forecast, continuing future view, and demonstrated divergence mechanics behind Theta’s failed assassination.',
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

const guardianBeasts = organizationFoundationData.guardianBeasts;

const guardianBeastProfileKeys = new Set([
  ...Object.keys(guardianBeastStateProfiles),
  ...Object.keys(guardianBeastState375Corrections),
  ...Object.keys(guardianBeastState385Corrections),
  ...Object.keys(guardianBeastState389Corrections),
  ...Object.keys(guardianBeastState390Corrections),
  ...Object.keys(guardianBeastState402Corrections),
]);

const correctedGuardianBeastStateProfiles = Object.freeze(Object.fromEntries(
  [...guardianBeastProfileKeys].map((beastId) => {
    const records = new Map((guardianBeastStateProfiles[beastId] || []).map((record) => [record.id, record]));
    for (const correction of guardianBeastState375Corrections[beastId] || []) records.set(correction.id, correction);
    for (const correction of guardianBeastState385Corrections[beastId] || []) records.set(correction.id, correction);
    for (const correction of guardianBeastState389Corrections[beastId] || []) records.set(correction.id, correction);
    for (const correction of guardianBeastState390Corrections[beastId] || []) records.set(correction.id, correction);
    for (const correction of guardianBeastState402Corrections[beastId] || []) records.set(correction.id, correction);
    return [beastId, Object.freeze([...records.values()].sort((left, right) => left.chapterRange.start - right.chapterRange.start || left.id.localeCompare(right.id)))];
  }),
));

const correctedNenSystemProfiles = Object.freeze({
  ...nenSystemProfiles,
  ...nenSystemProfile378Corrections,
  ...nenSystemProfile389Corrections,
  ...nenSystemProfile398Corrections,
});

const inheritedAbilityKnowledgeOverrides = organizationFoundationData.abilityKnowledgeOverrides || {};
const abilityKnowledgeOverrideKeys = new Set([
  ...Object.keys(inheritedAbilityKnowledgeOverrides),
  ...Object.keys(abilityKnowledge385Overrides),
  ...Object.keys(abilityKnowledge386Overrides),
  ...Object.keys(abilityKnowledge387Overrides),
  ...Object.keys(abilityKnowledge389Overrides),
  ...Object.keys(abilityKnowledge390Overrides),
  ...Object.keys(abilityKnowledge391Overrides),
  ...Object.keys(abilityKnowledge392Overrides),
  ...Object.keys(abilityKnowledge393Overrides),
  ...Object.keys(abilityKnowledge394Overrides),
  ...Object.keys(abilityKnowledge398Overrides),
  ...Object.keys(abilityKnowledge399Overrides),
  ...Object.keys(abilityKnowledge400Overrides),
  ...Object.keys(abilityKnowledge401Overrides),
  ...Object.keys(abilityKnowledge402Overrides),
]);
const correctedAbilityKnowledgeOverrides = Object.freeze(Object.fromEntries(
  [...abilityKnowledgeOverrideKeys].map((abilityId) => [abilityId, Object.freeze([
    ...(inheritedAbilityKnowledgeOverrides[abilityId] || []),
    ...(abilityKnowledge385Overrides[abilityId] || []),
    ...(abilityKnowledge386Overrides[abilityId] || []),
    ...(abilityKnowledge387Overrides[abilityId] || []),
    ...(abilityKnowledge389Overrides[abilityId] || []),
    ...(abilityKnowledge390Overrides[abilityId] || []),
    ...(abilityKnowledge391Overrides[abilityId] || []),
    ...(abilityKnowledge392Overrides[abilityId] || []),
    ...(abilityKnowledge393Overrides[abilityId] || []),
    ...(abilityKnowledge394Overrides[abilityId] || []),
    ...(abilityKnowledge398Overrides[abilityId] || []),
    ...(abilityKnowledge399Overrides[abilityId] || []),
    ...(abilityKnowledge400Overrides[abilityId] || []),
    ...(abilityKnowledge401Overrides[abilityId] || []),
    ...(abilityKnowledge402Overrides[abilityId] || []),
  ])]),
));

export const successionArchiveData = Object.freeze({
  ...organizationFoundationData,
  abilities,
  guardianBeasts,
  chapters,
  nenSystemProfiles: correctedNenSystemProfiles,
  guardianBeastStateProfiles: correctedGuardianBeastStateProfiles,
  abilityKnowledgeOverrides: correctedAbilityKnowledgeOverrides,
  abilitySystemLinks,
});
