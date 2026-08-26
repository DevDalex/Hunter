const freeze = (value) => Object.freeze(value);
const justice = 'location:black-whale:tier-2:justice-bureau';

export const organizationState400LegacySplits = freeze({
  'organization:kakin-justice-bureau': freeze([
    freeze({
      id: 'organization-state:kakin-justice-bureau:383',
      organizationId: 'organization:kakin-justice-bureau',
      chapterRange: freeze({ start: 383, end: 399 }),
      status: 'active',
      operationalState: 'Combines investigation, protected custody, medical monitoring, hearings, and controlled access around succession-related cases without importing Chapter 400’s later Fugetsu diagnosis or emergency-law discussion backward.',
      authority: 'Justice procedure, protected-witness control, detention, medical access, and court coordination under ordinary shipboard legal authority.',
      territoryIds: freeze([justice, `${justice}:detention-wing`, `${justice}:medical-wing`]),
      objectiveStates: freeze(['Protect vulnerable witnesses and survivors.', 'Investigate deaths and exceptional Nen-linked cases.', 'Preserve legal procedure while royal and military pressure grows.']),
      pressure: freeze(['Nen evidence remains difficult to identify and explain.', 'Royal and military interests increasingly press against ordinary Justice procedure.']),
      relatedEventIds: freeze(['event:kacho-letter-operation']),
      certainty: 'probable',
      sourceIds: freeze(['source:chapter-383', 'source:chapter-388']),
    }),
    freeze({
      id: 'organization-state:kakin-justice-bureau:401',
      organizationId: 'organization:kakin-justice-bureau',
      chapterRange: freeze({ start: 401, end: null }),
      status: 'active',
      operationalState: 'Continues investigation, protected custody, medical monitoring, hearings, and controlled access after the Chapter 400 Fugetsu crisis while later imported Justice material remains pending chapter-by-chapter modernization.',
      authority: 'Justice procedure, protected-witness control, detention, medical access, and court coordination under increasing military pressure.',
      territoryIds: freeze([justice, `${justice}:detention-wing`, `${justice}:medical-wing`]),
      objectiveStates: freeze(['Protect vulnerable witnesses and survivors.', 'Investigate deaths, hostile Nen, and exceptional body states.', 'Preserve legal procedure during later emergency-authority escalation.']),
      pressure: freeze(['Fugetsu’s hostile Nen condition requires investigation and treatment.', 'Kaiser’s complete motives remain uncertain.', 'Military authority increasingly pressures movement and Justice cases in later imported material.']),
      relatedEventIds: freeze(['event:kacho-letter-operation']),
      certainty: 'probable',
      sourceIds: freeze(['source:chapter-402', 'source:chapter-411']),
    }),
  ]),
});
