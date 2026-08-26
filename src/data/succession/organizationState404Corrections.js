const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-404';

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:404`,
  organizationId,
  chapterRange: freeze({ start: 404, end: 404 }),
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

export const organizationState404Corrections = freeze({
  'organization:kakin-military': freeze([state({
    organizationId: 'organization:kakin-military',
    operationalState: 'Benjamin deploys military and royal medical teams to take control of Halkenburg’s treatment, then authorizes a dignified noon transfer route and guard participation after the original body dies. Kurapika separately identifies escalating mafia conflict as a possible route to Special Martial Law, but no declaration occurs.',
    authority: 'Royal Army command controls military medicine, sensitive royal movement, and funeral security. Chapter 404 does not place the ship under Special Martial Law.',
    territoryIds: ['location:black-whale:tier-1', 'location:black-whale:tier-2', 'location:black-whale:tier-3', 'location:black-whale:tier-3:central-medical-clinic', 'location:black-whale:tier-3:central-stairwell-square'],
    objectiveStates: ['Prevent interference in Halkenburg’s fatal medical course.', 'Carry out the authorized noon movement with solemnity.', 'Maintain security without treating Special Martial Law as active.'],
    pressure: ['Halkenburg covertly controls Balsamilco’s body inside the command channel.', 'Public grief could become anger if the send-off appears disrespectful.', 'Mafia escalation remains a forecasted emergency-authority trigger rather than a completed event.'],
    relatedEventIds: ['event:chapter404-possessed-balsamilco-tells-benjamin-twelve-hour-completion', 'event:chapter404-royal-military-medical-teams-displace-cheadle', 'event:chapter404-benjamin-authorizes-noon-funeral-route-and-drops-charges'],
  })]),
  'organization:kakin-justice-bureau': freeze([state({
    organizationId: 'organization:kakin-justice-bureau',
    operationalState: 'Justice continues protecting the weakened Fugetsu while Kacho-form begins fading. Benjamin also orders Cleapatro to drop all charges against Halkenburg’s guards so they can join the authorized funeral operation.',
    authority: 'Justice retains custody, protected medical access, and charging procedure, while royal and military authority directs Halkenburg’s separate medical/funeral case.',
    territoryIds: ['location:black-whale:tier-2:justice-bureau', 'location:black-whale:tier-2:justice-bureau:medical-wing'],
    objectiveStates: ['Protect Fugetsu during the unresolved hostile-Nen crisis.', 'Release Halkenburg’s guards after the ordered charge dismissal.', 'Preserve ordinary legal procedure while military pressure grows.'],
    pressure: ['Kacho-form is visibly fading without an explained cause.', 'The funeral release order intersects with Halkenburg’s concealed operation.', 'Special Martial Law remains a future risk, not current authority.'],
    relatedEventIds: ['event:chapter404-prince-montage-fugetsu-sleeps-kacho-form-fades', 'event:chapter404-benjamin-authorizes-noon-funeral-route-and-drops-charges'],
  })]),
  'organization:hunter-association': freeze([state({
    organizationId: 'organization:hunter-association',
    operationalState: 'Cheadle leads an Association medical response with five assistants, including Leorio, orders diagnostic and forensic work, and is then removed from Halkenburg’s case by Kakin royal/military teams.',
    authority: 'Association medical expertise operates by voyage assignment but does not override Kakin jurisdiction over a royal patient.',
    territoryIds: ['location:black-whale:tier-3:central-medical-clinic'],
    objectiveStates: ['Assess Halkenburg’s collapse through the ordered tests and history.', 'Preserve medical and forensic evidence where access permits.'],
    pressure: ['The team is displaced before any supplied result or independent final diagnosis.', 'Royal authority limits clinical access to the prince.'],
    relatedEventIds: ['event:chapter404-cheadle-team-receives-halkenburg-medical-case', 'event:chapter404-royal-military-medical-teams-displace-cheadle'],
  })]),
  'organization:camilla-private-guard': freeze([state({
    organizationId: 'organization:camilla-private-guard',
    operationalState: 'Camilla designates Sarahell as her sole expected representative for Thursday’s 9:00 a.m. second Nen class. Room 1014 treats the attendance as a likely covert threat, but Sarahell has not yet entered or activated a curse.',
    authority: 'Camilla’s private-guard hierarchy and Have-Not target assignments remain intact.',
    territoryIds: ['location:black-whale:tier-1:room-1002'],
    objectiveStates: ['Use the next class as an access opportunity through Sarahell.', 'Keep the operative’s exact objective concealed.'],
    pressure: ['Kurapika, Bill, Shimano, and Babimyna are preparing around the Have-Not risk.', 'Chapter 404 supplies attendance only, not curse activation or physical proximity to Woble.'],
    relatedEventIds: ['event:chapter404-kurapika-schedules-second-nen-class-thursday-nine', 'event:chapter404-room1014-analyzes-sarahell-have-not-risk', 'event:chapter404-kurapika-bill-shimanu-tighten-woble-protection'],
  })]),
  'organization:phantom-troupe': freeze([state({
    organizationId: 'organization:phantom-troupe',
    operationalState: 'Nobunaga, Phinks, and Feitan hear Halkenburg’s death announcement on Tier 3. The Tier 4 Heil-Ly objective remains, but Nobunaga first wants intelligence from the established families because the answer may change how forcefully they attack.',
    authority: 'Internal Troupe combat coordination; no formal ship authority.',
    territoryIds: ['location:black-whale:tier-3'],
    objectiveStates: ['Check the relevant Heil-Ly intelligence with the established mafia.', 'Proceed toward the Tier 4 hideout afterward.', 'Use Hinrigh’s hidden transmitter without exposing it.'],
    pressure: ['Phinks and Feitan doubt Nobunaga’s intuition.', 'No family meeting, descent, or raid occurs before the chapter ends.'],
    relatedEventIds: ['event:chapter404-troupe-hears-announcement-nobunaga-seeks-family-intelligence'],
  })]),
});
