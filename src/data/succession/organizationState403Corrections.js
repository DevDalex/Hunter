const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-403';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:403`,
  organizationId,
  chapterRange: freeze({ start: 403, end: 403 }),
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

export const organizationState403Corrections = freeze({
  'organization:kakin-military': freeze([state({
    organizationId: 'organization:kakin-military',
    operationalState: 'Benjamin’s command structure enters red-alert posture after the courthouse rumbling and suspected attack on Balsamilco. At 7:50 a.m. Benjamin orders Butch to alert Tiers 2 and 3 and establishes a conditional martial-law trigger tied to unauthorized Balsamilco movement from Justice. The institution is not yet operating under Special Martial Law.',
    authority: 'Royal Army hierarchy and Kakin security law remain distinct from Justice procedure. Benjamin can order military readiness and prepare emergency escalation, but Chapter 403 does not show Special Martial Law taking effect.',
    territoryIds: ['location:black-whale:tier-1', 'location:black-whale:tier-2', 'location:black-whale:tier-3'],
    objectiveStates: ['Maintain red-alert readiness around the Halkenburg/Balsamilco crisis.', 'Track Balsamilco’s movement and mission status.', 'Prepare for emergency escalation without treating martial law as already active.'],
    pressure: ['Halkenburg’s collective ability has penetrated Benjamin’s command network through Balsamilco’s body.', 'Benjamin does not know the true controlling consciousness.', 'Nen-driven identity compromise weakens ordinary chain-of-command assumptions.'],
    relatedEventIds: ['event:chapter403-benjamin-conditional-martial-law-balsamilco-mission', 'event:chapter403-0750-benjamin-butch-red-alert', 'event:chapter403-halkenburg-possesses-balsamilco-reports-mission-complete'],
  })]),
  'organization:kakin-justice-bureau': freeze([state({
    organizationId: 'organization:kakin-justice-bureau',
    operationalState: 'Justice manages the postponed Balsamilco-Halkenburg proceeding, courthouse screening and controlled movement, Halkenburg’s medical care, Fugetsu’s protected rest and letter operation, and Kaiser’s investigation of the mass-fainting pattern through Worio Bay.',
    authority: 'Justice retains court scheduling, controlled-courthouse access, staff observation/interview, protected medical care, and prince-contact procedure while military pressure rises around the Balsamilco crisis.',
    territoryIds: ['location:black-whale:tier-2:justice-bureau', 'location:black-whale:tier-2:justice-bureau:prosecution-courthouse', 'location:black-whale:tier-2:justice-bureau:prosecution-courthouse:entrance', 'location:black-whale:tier-2:justice-bureau:prosecution-courthouse:corridor', 'location:black-whale:tier-2:justice-bureau:room-e-6', 'location:black-whale:tier-2:justice-bureau:medical-wing', 'location:black-whale:tier-2:justice-bureau:kaiser-office'],
    objectiveStates: ['Manage the postponed proceeding and Halkenburg’s medical condition.', 'Protect Fugetsu while the letter and planned Luzurus operations continue.', 'Investigate anomalous fainting and possible Nen activity through Justice personnel.', 'Preserve legal procedure under escalating military suspicion.'],
    pressure: ['Halkenburg’s ability operates inside Justice-controlled space without ordinary security detecting the threat.', 'The Balsamilco body is identity-compromised while Benjamin still treats it as a military commander.', 'Fugetsu’s hostile-spirit condition remains unresolved.', 'Benjamin’s conditional martial-law posture creates institutional risk.'],
    relatedEventIds: ['event:chapter403-0645-balsamilco-arrives-justice-courthouse', 'event:chapter403-halkenburg-twelve-civilians-arrow-balsamilco', 'event:chapter403-kaiser-worio-nen-disclosure-conditional-support', 'event:chapter403-halkenburg-possesses-balsamilco-reports-mission-complete'],
  })]),
});
