const freeze = (value) => Object.freeze(value);
const justice = 'location:black-whale:tier-2:justice-bureau';

export const organizationState403LegacySplits = freeze({
  'organization:kakin-military': freeze([
    freeze({
      id: 'organization-state:kakin-military:404',
      organizationId: 'organization:kakin-military',
      chapterRange: freeze({ start: 404, end: 409 }),
      status: 'active',
      operationalState: 'After the exact Chapter 403 red-alert and identity-compromise boundary, the still-imported military continuity resumes through Chapter 409 while Chapters 404–409 await modernization.',
      authority: 'Royal Army hierarchy and Kakin security law remain distinct from Justice Bureau investigative and judicial procedure.',
      territoryIds: freeze(['location:black-whale', 'location:black-whale:tier-1', 'location:black-whale:tier-2']),
      objectiveStates: freeze(['Maintain voyage security.', 'Control sensitive royal movement.', 'Execute military orders while the succession crisis escalates.']),
      pressure: freeze(['Prince-controlled soldiers blur state and factional command.', 'Nen abilities undermine ordinary custody, identity, and chain-of-command assumptions.']),
      relatedEventIds: freeze(['event:balsamilco-poisoning-operation']),
      certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-403', 'source:chapter-404']),
    }),
  ]),
  'organization:kakin-justice-bureau': freeze([
    freeze({
      id: 'organization-state:kakin-justice-bureau:404',
      organizationId: 'organization:kakin-justice-bureau',
      chapterRange: freeze({ start: 404, end: null }),
      status: 'active',
      operationalState: 'After the exact Chapter 403 courthouse, medical, Fugetsu-protection, and Worio-investigation state, the still-imported Justice continuity resumes while later chapter-by-chapter modernization remains pending.',
      authority: 'Justice procedure, protected-witness control, detention, medical access, and court coordination under increasing military pressure.',
      territoryIds: freeze([justice, `${justice}:detention-wing`, `${justice}:medical-wing`]),
      objectiveStates: freeze(['Protect vulnerable witnesses and survivors.', 'Investigate deaths, hostile Nen, and exceptional body states.', 'Preserve legal procedure during later emergency-authority escalation.']),
      pressure: freeze(['Fugetsu’s hostile Nen condition remains a major case.', 'Kaiser’s complete motives remain uncertain.', 'Military authority increasingly pressures movement and Justice cases in later imported material.']),
      relatedEventIds: freeze(['event:kacho-letter-operation']),
      certainty: 'probable',
      sourceIds: freeze(['source:chapter-411']),
    }),
  ]),
});
