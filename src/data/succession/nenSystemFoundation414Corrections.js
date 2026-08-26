const freeze = (value) => Object.freeze(value);
const range414 = freeze({ start: 414, end: 414 });
const sourceIds = freeze(['source:chapter-414']);

export const abilityKnowledge414Overrides = freeze({
  'ability:muteking': freeze([freeze({
    id: 'ability-knowledge:muteking:414',
    abilityName: 'Muteking',
    chapterRange: range414,
    knowledgeState: 'activation on Yushohi and accumulation of invincibility time confirmed; complete mechanics unresolved',
    certainty: 'confirmed',
    summary: 'Chiyamasi activates Muteking on Yushohi outside Room 1009 by placing a hand on his shoulder, after which time associated with invincibility begins accumulating. Chapter 414 stops before the planned movement, protection expiry, or later consequence.',
    mechanics: freeze({
      activation: 'Direct contact with Yushohi’s shoulder is shown in the Chapter 414 activation.',
      conditions: freeze(['Activation is demonstrated on Yushohi before the planned Room 1009 movement.']),
      limitations: freeze(['Exact accumulation rate, maximum duration, transferability, reset rules, cancellation, and post-expiry consequences are not supplied.', 'No Chapter 415+ result is imported.']),
      costs: freeze([]),
      targets: freeze(['Yushohi in the demonstrated use']),
      range: 'direct-contact activation demonstrated; broader range unknown',
      duration: 'accumulating protection interval; exact duration unresolved',
      knownUses: freeze(['Chapter 414: activated on Yushohi outside Room 1009 before the planned movement.']),
    }),
    sourceIds,
  })]),
  'ability:stinger-ball': freeze([freeze({
    id: 'ability-knowledge:stinger-ball:414',
    abilityName: 'Stand By Me / Stinger Ball',
    chapterRange: range414,
    knowledgeState: 'strategic limitation reassessed by Yushohi',
    certainty: 'confirmed',
    summary: 'Yushohi says the expanding number of Nen users makes it practically impossible to keep Stand By Me’s stinger ball attached to the Prince and concludes that the ability is no longer needed for the Succession Contest.',
    mechanics: freeze({
      activation: 'No new activation is demonstrated in Chapter 414.',
      conditions: freeze([]),
      limitations: freeze(['Yushohi judges the expanding Nen-user environment to make maintaining the attachment operationally impractical.', 'The supplied synopsis does not add a new trigger, effect, removal rule, range, or later result.']),
      costs: freeze([]),
      targets: freeze(['the Prince in Yushohi’s Chapter 414 operational discussion']),
      range: 'no new range rule supplied',
      duration: 'no new duration rule supplied',
      knownUses: freeze(['Chapter 414 supplies Yushohi’s strategic reassessment rather than a new demonstrated use.']),
    }),
    sourceIds,
  })]),
  'ability:moonlight-act': freeze([freeze({
    id: 'ability-knowledge:moonlight-act:414',
    abilityName: 'Moonlight Act',
    chapterRange: range414,
    knowledgeState: 'proposed counter-trap tool; not activated',
    certainty: 'confirmed',
    summary: 'Bill proposes using Longhi’s Moonlight Act as the basis of a contract counter-trap if Room 1014 negotiates with Beyond. No contract is activated or accepted in Chapter 414.',
    mechanics: freeze({
      activation: 'No Chapter 414 activation.',
      conditions: freeze([]),
      limitations: freeze(['The proposal does not establish that Beyond would accept a contract or that the proposed trap would succeed.']),
      costs: freeze([]),
      targets: freeze(['Beyond Netero as a proposed negotiation target']),
      range: 'not applicable to the unexecuted proposal',
      duration: 'not applicable to the unexecuted proposal',
      knownUses: freeze(['Chapter 414: discussed by Bill as a possible future counter-trap only.']),
    }),
    sourceIds,
  })]),
  'ability:stealth-dolphin': freeze([freeze({
    id: 'ability-knowledge:stealth-dolphin:414',
    abilityName: 'Stealth Dolphin',
    chapterRange: range414,
    knowledgeState: 'curse-verification use rejected as too dangerous',
    certainty: 'confirmed',
    summary: 'Kurapika considers using Stealth Dolphin to confirm how Beyond’s curse activates but rejects that route because the attempt could cost his life. The ability is not used for this purpose in Chapter 414.',
    mechanics: freeze({
      activation: 'No Chapter 414 activation for the proposed curse test.',
      conditions: freeze([]),
      limitations: freeze(['Kurapika considers the proposed verification route too dangerous to attempt.']),
      costs: freeze(['Kurapika assesses the proposed verification attempt as potentially life-threatening.']),
      targets: freeze(['Beyond-curse activation information as a proposed verification objective']),
      range: 'not established by the rejected proposal',
      duration: 'not established by the rejected proposal',
      knownUses: freeze(['Chapter 414: proposed curse-verification use is explicitly rejected.']),
    }),
    sourceIds,
  })]),
});

export const nenSystemProfile414Corrections = freeze({});
