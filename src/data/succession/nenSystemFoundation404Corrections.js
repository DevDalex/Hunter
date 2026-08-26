const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityName, knowledgeState, summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], certainty = 'confirmed', sources = [404] }) => freeze({
  id,
  abilityName,
  chapterRange: freeze({ start: 404, end: 404 }),
  knowledgeState,
  certainty,
  summary,
  mechanics: freeze({ activation, conditions: freeze(conditions), limitations: freeze(limitations), costs: freeze(costs), targets: freeze(targets), range, duration, knownUses: freeze(knownUses) }),
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const abilityKnowledge404Overrides = freeze({
  'ability:zhang-lei-coins': freeze([knowledge({
    id: 'ability-knowledge:zhang-lei-coins:404',
    abilityName: 'Zhang Lei’s Guardian Coins',
    knowledgeState: 'holder-linked reverse design confirmed / transferred 10 becomes 1 and does not numerically reset on return / eventual system unresolved',
    summary: 'Chapter 404 directly compares retained and distributed coins. Tenftory’s coin has the same front but a different reverse. Zhang Lei gives Kurapika a coin displaying 10; within seconds it changes to the distributed-holder reverse and value 1. Returned to Zhang Lei, the reverse reverts while the number remains 1. These observations do not confirm Kurapika’s cumulative Conjuration, future-power, aura-node, threshold, or loyalty theories.',
    activation: 'The Guardian Spirit Beast produces one coin daily at 1:00 p.m.; holder transfer visibly changes the demonstrated coin, but the complete activation and ownership rules remain unknown.',
    conditions: ['The ten-day change hypothesis is described by Kurapika as mostly supported, not conclusively proven.', 'A distributed coin and Zhang Lei-retained coins have matching fronts but different reverse designs.', 'The demonstrated 10 coin changes to value 1 and the distributed-holder reverse within seconds in Kurapika’s hand.', 'When returned to Zhang Lei, the reverse returns to his retained design while the number stays 1.', 'Zhang Lei gives Kurapika the coin produced that day; no resulting effect is shown.'],
    limitations: ['Different reverse designs do not yet prove different functional effects.', 'No complete ownership, reset, multiplier, spending, circulation, or activation rule is established.', 'Cumulative Conjuration is Kurapika’s possible classification, not confirmed.', 'Stored Nen, eventual holder powers, aura-node opening, six-month one-quintillion growth, and 10^64 are projections.', 'Pseudo-coercive Manipulation and semi-forced loyalty are withheld hypotheses.', 'Coventoba does not produce or test the suspected first-day coin.'],
    targets: ['Zhang Lei Guardian Coin holders; eventual effect unresolved'],
    range: 'persistent coin objects; exact Nen range unresolved',
    duration: 'coins persist and display holder-linked change; mature duration/effect unresolved',
    knownUses: ['Chapter 404: Tenftory compares a distributed coin’s reverse with Zhang Lei’s retained coins.', 'Chapter 404: Kurapika’s transferred 10 coin becomes 1 and changes reverse within seconds.', 'Chapter 404: the returned coin reverts its reverse but remains at value 1.', 'Chapter 404: Kurapika receives the newly produced daily coin without a shown effect.'],
    sources: [362, 376, 389, 390, 402, 403, 404],
  })]),
  'ability:halkenburg-possession-arrow': freeze([knowledge({
    id: 'ability-knowledge:halkenburg-possession-arrow:404',
    abilityName: 'The Boy Who Shoots the Arrow: Grimmel the Dissonance',
    knowledgeState: 'forced random-contributor mind swap / one-awake priority / two body-death cases explained / immediate post-original-body-death control confirmed',
    summary: 'Halkenburg explains that a struck victim forcibly swaps minds with one randomly selected contributor from his group. Only one exchanged mind is normally awake at a time. The Shikaku/Sumidori result demonstrates the ordinary one-awake priority, while the Vict experiment shows that if the Halkenburg-side original body dies first, the victim’s mind returns to its own body, coexists with the invader, and receives wake priority. Halkenburg plans to delay Balsamilco with a sleeping pill; after Halkenburg’s original body dies, Halkenburg remains immediately active in Balsamilco’s body.',
    activation: 'Halkenburg and committed supporters generate the collective aura state, form and fire the arrow, and one contributing participant is selected at random to exchange minds with the struck victim.',
    conditions: ['The participant who swaps with the victim is described as randomly selected from the contributing group.', 'Participation requires followers willing to stake their lives for the collective objective.', 'Only one of the exchanged minds is normally awake at a time.', 'While both original bodies remain, the Halkenburg-side participant generally receives wake priority.', 'If the Halkenburg-side original body dies first, the victim mind returns to its own body, coexists with the invader, and receives wake priority.', 'Halkenburg attempts to exploit ordinary sleep in Balsamilco’s body to delay that wake priority.'],
    limitations: ['No formal Nen category is confirmed.', 'No rule for controlling which contributor is selected is supplied; selection is random.', 'The synopsis does not establish every possible death order, recovery path, or permanent consciousness endpoint.', 'Halkenburg’s estimate of about ten hours is a plan and loose prediction, not a completed duration.', 'Balsamilco is not shown awake or back in control by the Chapter 404 endpoint.', 'The sleeping-pill dose, timing precision, and ultimate success are not supplied.'],
    costs: ['The operation exposes participating lives to lethal body-death outcomes.', 'Halkenburg’s original body dies during the Balsamilco operation while his consciousness continues elsewhere.'],
    targets: ['The individual struck by the collective arrow', 'One randomly selected contributing participant as the exchange counterpart'],
    range: 'collective projectile range demonstrated previously; exact maximum unresolved',
    duration: 'swap persists through body-state changes; wake/control duration is case-dependent and incompletely mapped',
    knownUses: ['Shikaku/Sumidori experiment: the surviving body and service-number response establish identity transfer and one-awake priority.', 'Vict experiment: death of the Halkenburg-side original body returns the victim mind to its own body with wake priority.', 'Balsamilco operation: Halkenburg remains active in Balsamilco’s body immediately after Halkenburg’s original body dies.'],
    sources: [382, 386, 389, 403, 404],
  })]),
  'ability:have-not-curse': freeze([knowledge({
    id: 'ability-knowledge:have-not-curse:404',
    abilityName: 'Have-Not Death-Powered Curse',
    knowledgeState: 'Sarahell scheduled for second class / Room 1014 suspects curse access / no Chapter 404 entry or activation',
    summary: 'Camilla sends Sarahell as the sole expected attendee for Thursday’s 9:00 a.m. second Nen class. Babimyna raises hearsay about Have-Not curses and Kurapika treats the attendance as a serious covert threat, but Sarahell has not entered Room 1014, approached Woble, or activated a curse.',
    activation: 'Previously documented death-powered ritual conditions remain; Chapter 404 adds no completed activation.',
    conditions: ['Sarahell is expected to attend the next class as Camilla’s representative.', 'Room 1014 prepares to keep her away from Woble.'],
    limitations: ['Attendance does not itself prove activation.', 'Sarahell’s exact intended action and Camilla’s immediate motive remain unresolved.', 'No physical entry, proximity condition, suicide, curse manifestation, or exorcism occurs in Chapter 404.'],
    targets: ['Woble remains Sarahell’s established assigned target, while Chapter 404 characters still discuss the immediate threat with uncertainty.'],
    knownUses: ['Chapter 404: no new use; only attendance scheduling and defensive preparation occur.'],
    certainty: 'confirmed schedule / unconfirmed immediate action',
    sources: [389, 404],
  })]),
  'ability:without-you': freeze([knowledge({
    id: 'ability-knowledge:without-you:404',
    abilityName: 'Without You',
    knowledgeState: 'Kacho-form still present beside Fugetsu / fading begins / cause and endpoint unresolved',
    summary: 'The Kacho-form continuation remains beside weak, sleeping Fugetsu and slowly begins to fade. The chapter does not establish disappearance, death, exhaustion, range, a completed duration, or whether Kacho’s human consciousness is present.',
    activation: 'Post-mortem continuation after Kacho’s human death; Chapter 404 supplies no new trigger.',
    conditions: ['Kacho’s human body remains dead.', 'The continuation is shown kneeling beside Fugetsu as fading begins.'],
    limitations: ['Cause, reversibility, duration, and endpoint of the fading are unknown.', 'The fading is not treated as completed disappearance.', 'Human Kacho consciousness remains unconfirmed.'],
    targets: ['Fugetsu as the continuing protection target'],
    duration: 'active through the shown moment; visible fading has begun',
    knownUses: ['Chapter 404: Kacho-form stays beside Fugetsu and begins fading.'],
    certainty: 'confirmed observation / unresolved cause',
    sources: [383, 388, 400, 402, 403, 404],
  })]),
});

export const guardianBeastState404Corrections = freeze({
  'guardian-beast:zhang-lei': freeze([freeze({
    id: 'guardian-beast-state:zhang-lei:404', beastId: 'guardian-beast:zhang-lei', chapterRange: freeze({ start: 404, end: 404 }),
    knowledge: 'holder-linked reverse design and 10-to-1 transfer change confirmed; final coin system unresolved',
    operationalState: 'Tenftory’s distributed coin shows a different reverse. A retained 10 coin becomes 1 and changes reverse in Kurapika’s hand; returned to Zhang Lei, the reverse resets but the number remains 1. One new daily coin is given to Kurapika without a shown effect.',
    hostState: 'host active', visibility: 'visible to eligible Nen users other than the host',
    knownAbilityIds: freeze(['ability:zhang-lei-coins']), suspectedAbilityIds: freeze([]),
    unresolved: freeze(['Complete holder/design/number rule', 'Eventual holder power', 'Cumulative Conjuration classification', '10^64 threshold', 'Pseudo-coercive loyalty', 'Coventoba first-day coin state']),
    sourceIds: freeze([362, 376, 389, 390, 402, 403, 404].map(chapterSourceId)), certainty: 'confirmed observations / theories unresolved',
  })]),
  'guardian-beast:kacho': freeze([freeze({
    id: 'guardian-beast-state:kacho:404', beastId: 'guardian-beast:kacho', chapterRange: freeze({ start: 404, end: 404 }),
    knowledge: 'Without You remains present beside Fugetsu and begins fading; cause and endpoint unresolved',
    operationalState: 'The Kacho-form continuation kneels beside weak, sleeping Fugetsu and slowly begins to fade without disappearing inside the supplied boundary.',
    hostState: 'host deceased; beast continuation active but visibly fading', visibility: 'human-form continuation rather than ordinary visible beast',
    knownAbilityIds: freeze(['ability:without-you']), suspectedAbilityIds: freeze([]),
    unresolved: freeze(['Cause of fading', 'Whether fading is reversible', 'How long the continuation can persist', 'Whether Kacho’s consciousness is present']),
    sourceIds: freeze([383, 388, 400, 402, 403, 404].map(chapterSourceId)), certainty: 'confirmed observation / unresolved mechanism',
  })]),
});

export const guardianBeastState404LegacySplits = freeze({
  'guardian-beast:zhang-lei': freeze([freeze({
    id: 'guardian-beast-state:zhang-lei:405', beastId: 'guardian-beast:zhang-lei', chapterRange: freeze({ start: 405, end: null }),
    knowledge: 'Chapter 404 holder transformation carried forward; later effects remain chapter-dependent',
    operationalState: 'After the exact Chapter 404 holder test, imported coin continuity resumes without treating Kurapika’s long-term theories as confirmed mechanics.',
    hostState: 'host active', visibility: 'visible to eligible Nen users other than the host', knownAbilityIds: freeze(['ability:zhang-lei-coins']), suspectedAbilityIds: freeze([]),
    unresolved: freeze(['Complete coin rule', 'Kurapika coin outcome', 'Eventual holder effect and loyalty status']), sourceIds: freeze([chapterSourceId(404)]), certainty: 'probable',
  })]),
  'guardian-beast:kacho': freeze([
    freeze({
      id: 'guardian-beast-state:kacho:383', beastId: 'guardian-beast:kacho', chapterRange: freeze({ start: 383, end: 403 }),
      knowledge: 'Without You active before the exact Chapter 404 fading observation',
      operationalState: 'After Kacho dies, the beast continues in her form to protect Fugetsu through Chapter 403 without backfilling the Chapter 404 fading state.',
      hostState: 'host deceased; beast continuation active', visibility: 'human-form continuation rather than ordinary visible beast', knownAbilityIds: freeze(['ability:without-you']), suspectedAbilityIds: freeze([]),
      unresolved: freeze(['How long the continuation can persist', 'Whether Kacho’s consciousness is present']), sourceIds: freeze([chapterSourceId(383), chapterSourceId(388), chapterSourceId(402), chapterSourceId(403)]), certainty: 'probable',
    }),
    freeze({
      id: 'guardian-beast-state:kacho:405', beastId: 'guardian-beast:kacho', chapterRange: freeze({ start: 405, end: null }),
      knowledge: 'Chapter 404 fading carried forward; later continuation status requires exact chapter review',
      operationalState: 'Imported later Without You continuity resumes without inventing the cause or immediate resolution of Chapter 404’s fading.',
      hostState: 'host deceased; post-mortem continuation remains chapter-dependent', visibility: 'human-form continuation rather than ordinary visible beast', knownAbilityIds: freeze(['ability:without-you']), suspectedAbilityIds: freeze([]),
      unresolved: freeze(['Fading cause and later status', 'Whether Kacho’s consciousness is present']), sourceIds: freeze([chapterSourceId(404), chapterSourceId(411)]), certainty: 'probable',
    }),
  ]),
});
