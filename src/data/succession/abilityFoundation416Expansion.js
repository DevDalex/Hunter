import { abilityFoundation415Expansion } from './abilityFoundation415Expansion.js';

const freeze = (value) => Object.freeze(value);

const upgraded = abilityFoundation415Expansion.map((record) => {
  if (record.id !== 'ability:cats-name') return record;
  return freeze({
    ...record,
    summary: `${record.summary} Chapter 416 adds a direct edge-case confrontation: Benjamin deliberately avoids killing Camilla, infects her with TSK-17, and asks whether disease or an already-dead carrier could provide a valid killer/aura source; those disease interactions remain unresolved.`,
    sourceIds: freeze([...new Set([...(record.sourceIds || []), 'source:chapter-416'])]),
    updatedAt: '2026-08-14',
    latestChapter: 416,
    sourceChapterNumbers: freeze([...new Set([...(record.sourceChapterNumbers || []), 416])].sort((a,b)=>a-b)),
    knownUses: freeze([...new Set([...(record.knownUses || []), 'Chapter 416: Benjamin avoids directly killing Camilla and instead probes the unresolved interaction between Cat’s Name, incurable disease, killer identity, and aura source before infecting her with TSK-17.'])]),
    limitations: freeze([...new Set([...(record.limitations || []), 'Chapter 416 does not resolve whether disease counts as a killer, whose aura would power resurrection if causation is indirect, or what happens if a disease carrier dies before Camilla.'])]),
    researchStatus: 'core counteractive revival mechanics confirmed / disease and indirect-killer edge conditions unresolved through Chapter 416',
  });
});

const hellFruit = freeze({
  id: 'ability:dust-in-the-wind-hell-fruit',
  entityType: 'ability',
  slug: 'dust-in-the-wind-hell-fruit',
  name: 'Dust in the Wind: Hell Fruit',
  aliases: freeze(['Hell Fruit']),
  summary: 'Moswana’s named post-mortem curse. In Chapter 416, her death activates a ghostly hand with hollow faces at its fingertips; the construct rushes Benjamin, strikes him, darkens his body, and produces face-like markings in his pupils while the final curse outcome remains unresolved.',
  sourceIds: freeze(['source:chapter-389','source:chapter-416']),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-14',
  updatedAt: '2026-08-14',
  ownerIds: freeze(['character:moswana']),
  classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed' }),
  category: 'post-mortem assassination curse',
  activation: 'Chapter 416 demonstrates activation when Moswana dies in Benjamin’s presence after removing the knife from her throat.',
  conditions: freeze(['Moswana is assigned to Benjamin as the prepared curse target.','Moswana dies close to Benjamin while making direct visual contact immediately before activation.']),
  limitations: freeze(['Chapter 416 does not resolve the final lethal timing or complete effect after the curse visibly marks Benjamin.','Camilla’s statement that the ten-year plan is complete does not by itself establish every preparation mechanic.','No Chapter 417+ outcome is imported.']),
  costs: freeze(['Moswana dies to activate the demonstrated post-mortem curse.']),
  targets: freeze(['Benjamin Hui Guo Rou']),
  range: 'close-proximity activation demonstrated; complete maximum range not established here',
  duration: 'active effect visible on Benjamin at the Chapter 416 boundary; final duration unresolved',
  status: 'activated / final outcome unresolved',
  knownUses: freeze(['Chapter 416: Moswana dies, a ghostly hand erupts from her corpse and strikes Benjamin, whose body darkens and whose pupils develop face-like markings.']),
  firstChapter: 416,
  latestChapter: 416,
  sourceChapterNumbers: freeze([389,416]),
  researchStatus: 'named activation and visible curse manifestation confirmed / final effect unresolved',
});

export const abilityFoundation416Expansion = freeze([
  ...upgraded.filter((record) => record.id !== hellFruit.id),
  hellFruit,
]);
