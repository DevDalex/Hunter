const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-402';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:402`,
  organizationId,
  chapterRange: freeze({ start: 402, end: 402 }),
  status: 'active',
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds: freeze([sourceId]),
});

export const organizationState402Corrections = freeze({
  'organization:kakin-justice-bureau': freeze([state({
    organizationId: 'organization:kakin-justice-bureau',
    operationalState: 'Justice remains the operational platform for Melody’s detention, Fugetsu’s protection, Kaiser’s prince-access negotiations, the final-letter operation, and the proposed Luzurus removal. Justice escorts Fugetsu through Tier 1 and uses controlled questioning/medical supervision as the intended alibi structure. No Special Martial Law takeover is active.',
    authority: 'Kaiser and Justice personnel retain enough procedural authority to negotiate prince audiences, provide escorts, manage witness questioning, and threaten stronger search procedures, while the royal-privilege versus military-authority court dispute remains unresolved.',
    territoryIds: ['location:black-whale:tier-2:justice-bureau', 'location:black-whale:tier-2:justice-bureau:melody-cell', 'location:black-whale:tier-2:justice-bureau:kaiser-office', 'location:black-whale:tier-2:justice-bureau:medical-wing'],
    objectiveStates: ['Protect and investigate Fugetsu’s rapidly worsening hostile-spirit condition.', 'Use Kacho-form letters to obtain controlled personal access to prince quarters.', 'Maintain legal/witness procedures as operational cover for the Fugetsu protection plan.', 'Prepare for military pressure without treating Special Martial Law as active.'],
    pressure: ['Fugetsu’s attacker and exact ability remain unidentified.', 'The Luzurus culprit theory may be wrong.', 'Benjamin’s camp and the military retain competing authority claims.', 'Kaiser’s true motive/manipulation status remains unresolved to Melody.'],
    relatedEventIds: ['event:chapter402-day11-0600-kacho-form-shows-fugetsu-shoulder-mark', 'event:chapter402-kacho-final-letter-prince-visits-cover-plan', 'event:chapter402-kaiser-leads-benjamin-into-martial-law-threshold-discussion', 'event:chapter402-day11-0850-luzurus-operation-debrief-basho-buys-time'],
  })]),
  'organization:kakin-military': freeze([state({
    organizationId: 'organization:kakin-military',
    operationalState: 'Chapter 402 reveals that the Kakin military previously developed the pathological agent Balsamilco now prepares as a covert weapon, while Benjamin separately states that the current crisis still does not satisfy the national-crisis threshold required for martial law. The archive does not infer that the military institution as a whole ordered Balsamilco’s specific Halkenburg operation.',
    authority: 'Military authority remains powerful but constrained by the unresolved priority dispute with royal privilege and by the higher crisis threshold Benjamin describes for martial law.',
    territoryIds: ['location:black-whale:tier-1', 'location:black-whale:tier-2'],
    objectiveStates: ['Maintain military security and First Prince command structures.', 'Retain readiness for crisis escalation without an active martial-law transfer in Chapter 402.'],
    pressure: ['Musse remains missing.', 'Halkenburg is a major rival to Benjamin.', 'Justice and royal privilege complicate unrestricted military searches.'],
    relatedEventIds: ['event:chapter402-balsamilco-shoe-aerosol-pathogen-halkenburg-plan', 'event:chapter402-kaiser-leads-benjamin-into-martial-law-threshold-discussion'],
    certainty: 'mixed: institutional weapon origin and Benjamin threshold statement confirmed; Balsamilco operation is not generalized into a military-wide order',
  })]),
});
