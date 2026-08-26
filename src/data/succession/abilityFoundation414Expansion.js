import { abilityFoundation413Expansion } from './abilityFoundation413Expansion.js';

const freeze = (value) => Object.freeze(value);

const muteking = freeze({
  id: 'ability:muteking',
  entityType: 'ability',
  slug: 'muteking',
  name: 'Muteking',
  aliases: freeze([]),
  summary: 'Chiyamasi’s Nen ability is activated on Yushohi in Chapter 414, beginning the accumulation of invincibility time before the planned Room 1009 operation. The supplied synopsis does not provide a complete mechanics sheet or the later expiry result.',
  sourceIds: freeze(['source:chapter-414']),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-13',
  updatedAt: '2026-08-13',
  ownerIds: freeze(['character:chiyamasi']),
  abilityType: 'Nen ability',
  category: 'support / temporary protection',
  activation: 'Chapter 414 demonstrates Chiyamasi placing a hand on Yushohi’s shoulder and activating Muteking.',
  conditions: freeze(['Direct contact with Yushohi is shown in the Chapter 414 activation scene.', 'The chapter shows time associated with invincibility beginning to accumulate before the planned movement.']),
  limitations: freeze(['Exact accumulation rate, maximum duration, transferability, reset rules, cancellation rules, and post-expiry consequences are not supplied in the Chapter 414 synopsis.', 'The Room 1009 breach and the end of the protection are outside the strict Chapter 414 boundary.']),
  costs: freeze([]),
  targets: freeze(['Yushohi in the demonstrated Chapter 414 use']),
  range: 'direct-contact activation demonstrated; broader range unknown',
  duration: 'accumulating protection interval; exact duration unresolved',
  knownUses: freeze(['Chapter 414: Chiyamasi activates Muteking on Yushohi outside Room 1009 and begins accumulating invincibility time.']),
  relatedAbilityIds: freeze([]),
  sourceChapterNumbers: freeze([414]),
  latestChapter: 414,
  certainty: 'confirmed',
});

export const abilityFoundation414Expansion = freeze([
  ...abilityFoundation413Expansion,
  muteking,
]);
