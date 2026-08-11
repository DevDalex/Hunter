const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-406']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:406`,
  organizationId,
  chapterRange: freeze({ start: 406, end: 406 }),
  status,
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds,
});

export const organizationState406Corrections = freeze({
  'organization:phantom-troupe': freeze([state({
    organizationId: 'organization:phantom-troupe',
    operationalState: 'The anti-Heil-Ly route team splits when Nobunaga turns back to investigate the waste-subcontractor theory while Phinks and Feitan continue upward with Tajao. Separately, Chrollo searches the Tier 3 funeral crowd, targets Kakin’s sacred treasures as a prerequisite for evolving Skill Hunter toward the Hisoka rematch, and says the Spider can continue even if he dies.',
    authority: 'Chrollo remains leader; members continue tactically independent lower-tier operations under the Spider’s broad Hisoka and Heil-Ly objectives.',
    territoryIds: ['location:black-whale:outermost-pipe-stair-chamber', 'location:black-whale:tier-3:funeral-procession-crowd'],
    objectiveStates: ['Find and kill Hisoka.', 'Continue operations against Heil-Ly.', 'Steal Kakin’s three sacred treasures as Chrollo’s planned Skill Hunter evolution prerequisite.', 'Preserve the Spider as an idea even if Chrollo dies.'],
    pressure: ['Nobunaga separates from Phinks and Feitan.', 'Chrollo risks reaching Tier 1 before he is fully prepared for Hisoka.', 'Xi-Yu has begun investigating Lynch’s killer and considers a Troupe culprit possible, but no conflict has begun.'],
    relatedEventIds: ['event:chapter406-nobunaga-turns-back-to-investigate', 'event:chapter406-skill-hunter-national-treasure-prerequisite', 'event:chapter406-chrollo-spider-survives-his-death'],
  })]),
  'organization:cha-r': freeze([state({
    organizationId: 'organization:cha-r',
    operationalState: 'Tajao reveals the restricted outer route and states that Cha-R and Xi-Yu control the waste-processing facility between Tiers 4 and 5. The Troupe develops a theory that Heil-Ly may exploit disposal subcontractors, but Chapter 406 does not prove that theory.',
    authority: 'Traditional Kakin mafia hierarchy with Tajao exercising route and infrastructure knowledge during the Troupe escort.',
    territoryIds: ['location:black-whale:outermost-pipe-stair-chamber', 'location:black-whale:intertier-4-5:waste-processing-plant'],
    objectiveStates: ['Maintain established-mafia control of useful ship infrastructure.', 'Continue using the Troupe against Heil-Ly.', 'Avoid an unnecessary conflict with Xi-Yu or the Troupe while Lynch’s killer remains unidentified to Xi-Yu.'],
    pressure: ['Nobunaga is turning back to investigate a possible Heil-Ly route.', 'Zakuro says a Troupe culprit in Lynch’s death could create a conflict involving Cha-R, but the premise remains unproven to Xi-Yu.'],
    relatedEventIds: ['event:chapter406-char-xiyu-control-waste-processing', 'event:chapter406-heilly-waste-contractor-killing-pipeline-theory', 'event:chapter406-hinrigh-zakuro-vow-revenge'],
    certainty: 'waste-control and route facts confirmed / Heil-Ly subcontractor theory and future inter-family conflict unresolved',
  })]),
  'organization:xi-yu': freeze([state({
    organizationId: 'organization:xi-yu',
    operationalState: 'Xi-Yu’s infrastructure partnership with Cha-R is stated to include control of the waste-processing area. On Tier 3, Hinrigh and Zakuro recover Lynch’s body, reconstruct a fake-Hisoka-linked deception, and vow revenge while explicitly acknowledging that their culprit theory is inferential.',
    authority: 'Onior’s traditional mafia hierarchy with Hinrigh as active field underboss.',
    territoryIds: ['location:black-whale:intertier-4-5:waste-processing-plant', 'location:black-whale:tier-3:funeral-procession-crowd', 'location:black-whale:tier-3:lynch-body-recovery-site'],
    objectiveStates: ['Contain Heil-Ly.', 'Identify and avenge Lynch’s killer.', 'Preserve established-mafia balance until evidence justifies a new conflict.'],
    pressure: ['Lynch’s body has been recovered with a professionally broken neck.', 'Hinrigh and Zakuro suspect a culprit searching for Hisoka but do not know Bonolenov’s identity.', 'A proven Troupe culprit could create a conflict involving Cha-R, but no war begins in Chapter 406.'],
    relatedEventIds: ['event:chapter406-lynch-body-recovered-funeral-patrol', 'event:chapter406-hinrigh-infers-culprit-seeks-hisoka', 'event:chapter406-hinrigh-zakuro-vow-revenge'],
    certainty: 'body recovery and revenge commitment confirmed / culprit identity unresolved to Xi-Yu',
  })]),
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'The concealed hideout remains active. Hinrigh’s hidden transmitter-oyster reverts to its original device beneath a cabinet. Nobunaga’s group theorizes that Heil-Ly may exploit waste-disposal subcontractors, but Chapter 406 provides no direct proof of such a contractor operation and shows no completed Dogman/Sodom kidnapping result.',
    authority: 'Morena remains the established leader from the prior chapter; Chapter 406 does not show a new command scene.',
    territoryIds: ['location:black-whale:tier-2:heil-ly-hideout'],
    objectiveStates: ['Maintain the concealed base and ongoing Contagion operation.', 'Respond to increasing Troupe and established-mafia pressure.'],
    pressure: ['Nobunaga turns back specifically to investigate the waste-route theory.', 'The hidden transmitter has reverted to its original device inside the base.', 'Phinks and Feitan continue through Tajao’s route toward Tier 2.', 'The chapter does not reveal the outcome of the prior funeral-search assignment.'],
    relatedEventIds: ['event:chapter406-heilly-waste-contractor-killing-pipeline-theory', 'event:chapter406-nobunaga-turns-back-to-investigate', 'event:chapter406-biohazard-transmitter-reverts'],
    certainty: 'subcontractor operation remains Troupe theory / hideout and transmitter facts confirmed',
  })]),
});
