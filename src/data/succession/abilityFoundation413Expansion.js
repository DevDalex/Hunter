import { abilityFoundation373Expansion } from './abilityFoundation373Expansion.js';

const freeze = (value) => Object.freeze(value);
const priorSecretWindow = abilityFoundation373Expansion.find((ability) => ability.id === 'ability:secret-window');

export const abilityFoundation413Expansion = freeze([
  freeze({
    id: 'ability:combo-master', entityType: 'ability', slug: 'combo-master', name: 'Combo Master', aliases: freeze([]),
    summary: 'Furykov’s Nen ability is introduced by name in Chapter 413. The supplied synopsis says the ability is explained but does not include those mechanics, so the maintained archive confirms only the name and owner.',
    sourceIds: freeze(['source:chapter-413']), publicationStatus: 'published', canonLevel: 'canon', createdAt: '2026-08-13', updatedAt: '2026-08-13', ownerIds: freeze(['character:furykov']),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed-name-owner-only' }), category: 'ability / mechanics intentionally unresolved', activation: 'Not available in the supplied Chapter 413 synopsis.', conditions: freeze([]),
    limitations: freeze(['The supplied synopsis states that Combo Master is explained but does not reproduce the explanation.', 'Activation, effect, valid targets, range, duration, costs, restrictions, and failure states are not reconstructed from Chapter 415 or outside material.']),
    costs: freeze([]), targets: freeze(['unknown']), range: 'unknown', duration: 'unknown', status: 'active / owner alive at Chapter 413 boundary', knownUses: freeze(['No mechanical use is established by the supplied Chapter 413 synopsis.']),
    firstChapter: 413, latestChapter: 413, sourceChapterNumbers: freeze([413]), researchStatus: 'name-and-owner confirmed / mechanics intentionally unresolved',
  }),
  freeze({
    ...priorSecretWindow,
    summary: 'Musse’s surveillance ability, inherited by Benjamin through Benjamin Baton. Chapter 413 adds that extended inherited use lets Benjamin access what Musse had seen before death; Benjamin uses that accumulated visual knowledge while monitoring Camilla and knows she is a counteractive-type Nen user.',
    sourceIds: freeze([...(priorSecretWindow?.sourceIds || []), 'source:chapter-413']),
    updatedAt: '2026-08-13',
    limitations: freeze([...(priorSecretWindow?.limitations || []), 'Chapter 413 does not establish how much pre-death visual information is retained, whether all of Musse’s prior sight is accessible, or whether this development generalizes to every inherited ability.']),
    knownUses: freeze([...(priorSecretWindow?.knownUses || []), 'Chapter 413: Benjamin monitors Camilla and accesses Musse’s pre-death visual knowledge after extended inherited use.']),
    latestChapter: 413,
    sourceChapterNumbers: freeze([...new Set([...(priorSecretWindow?.sourceChapterNumbers || []), 413])]),
    status: 'user deceased / inherited by Benjamin / Chapter 413 extended-use knowledge access confirmed',
    researchStatus: 'partial mechanics plus Chapter 413 inherited pre-death visual-knowledge access confirmed / broader retention and range limits unresolved',
  }),
]);
