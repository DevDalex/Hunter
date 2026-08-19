const freeze = (value = []) => Object.freeze(Array.isArray(value) ? [...value] : value);
const range = (start, end = null) => Object.freeze({ start, end });
const sourceIds = (...chapters) => freeze([...new Set(chapters.flat().map((chapter) => `source:chapter-${chapter}`))]);
const base = ({ id, entityType, name, summary, chapters, chapterRange, canonLevel = 'canon', aliases = [], tags = [], ...extra }) => Object.freeze({
  id,
  entityType,
  slug: id.split(':').slice(1).join('-'),
  name,
  summary,
  aliases: freeze(aliases),
  tags: freeze(tags),
  publicationStatus: 'published',
  canonLevel,
  sourceIds: sourceIds(chapters),
  chapterRange: chapterRange || range(Math.min(...chapters), null),
  createdAt: '2026-08-19',
  updatedAt: '2026-08-19',
  ...extra,
});
const custody = (...entries) => freeze(entries.map((entry) => Object.freeze(entry)));

export const contentDepthKnowledgeRecords417 = freeze([
  base({
    id: 'knowledge-record:special-martial-law', entityType: 'knowledge-record', name: 'Formal Special Martial Law awareness',
    summary: 'The formal Special Martial Law declaration is treated as a Chapter 415 state transition; by Chapters 416–417 its practical meaning is increasingly defined by Benjamin’s military control, royal confinement, Justice intervention, and forced movement.',
    chapters: [415, 416, 417], chapterRange: range(415, null), knowledgeState: 'public', secrecy: 'announced-order',
    subjectLabels: freeze(['Special Martial Law is formally active', 'Military authority is overriding ordinary movement and custody arrangements']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Royal households', 'Kakin military and Justice personnel', 'Ship population affected by the declaration']), knowerEntityIds: freeze([]),
    misinformedLabels: freeze([]), misinformedEntityIds: freeze([]), acquisition: 'Formal declaration followed by visible enforcement, confinement, relocation, detention, and military orders.', publicAtChapter: 415, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:room-1004-reality-test', entityType: 'knowledge-record', name: 'Room 1004 reality / illusion uncertainty',
    summary: 'Salkov does not accept the battered Tserriednich body or surrounding scene as settled reality and plans to use Theta’s Nen-visible scar as a reality check.',
    chapters: [416, 417], chapterRange: range(416, null), knowledgeState: 'disputed', secrecy: 'private-observer-uncertainty',
    subjectLabels: freeze(['Tserriednich’s apparent fatal trauma', 'Whether Benjamin and the Room 1004 scene are genuine', 'Theta scar reality check']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Salkov', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze(['Benjamin treats the observed body as operationally defeated']), misinformedEntityIds: freeze([]),
    acquisition: 'Direct observation by Salkov after the Room 1004 assault, followed by his explicit reality/illusion analysis.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:benjamin-layered-affliction', entityType: 'knowledge-record', name: 'Benjamin layered affliction disclosure',
    summary: 'Benjamin tells Balsamilco and Coventoba that he is under a Camilla Have-Not curse, infected with TSK-17 with roughly half a day remaining by his own assessment, and may also be targeted by a Beyond curse through Furykov.',
    chapters: [417], knowledgeState: 'limited', secrecy: 'command-circle-disclosure',
    subjectLabels: freeze(['Benjamin Have-Not curse', 'Benjamin TSK-17 infection', 'Possible Beyond/Furykov curse target']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin', 'Balsamilco Might', 'Coventoba']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Benjamin’s direct disclosure after ordering Balsamilco and Coventoba to inspect him with Gyo.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:room-1001-tsk17-exposure', entityType: 'knowledge-record', name: 'Room 1001 TSK-17 exposure',
    summary: 'Benjamin covertly releases a second TSK-17 dose while Tubeppa and Tyson are present. Benjamin later treats both as infected, while his projected death windows remain his strategic assessment rather than observed outcomes.',
    chapters: [417], knowledgeState: 'secret', secrecy: 'covert-biological-operation',
    subjectLabels: freeze(['Tubeppa TSK-17 exposure', 'Tyson TSK-17 exposure', 'Benjamin death-window projections']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze(['Tubeppa', 'Tyson']), misinformedEntityIds: freeze([]),
    acquisition: 'Directly depicted covert dispersal followed by Benjamin’s internal/command assessment.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:camilla-secret-window-surveillance', entityType: 'knowledge-record', name: 'Camilla medical contact under Secret Window surveillance',
    summary: 'Benjamin uses inherited Secret Window to observe Camilla contacting the medical department and incorporates that observation into a planned cover narrative.',
    chapters: [417], knowledgeState: 'secret', secrecy: 'remote-surveillance',
    subjectLabels: freeze(['Camilla contacts medical', 'Benjamin observes the contact with Secret Window', 'Benjamin plans a framing narrative']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze(['Camilla is not shown knowing she is being observed']), misinformedEntityIds: freeze([]),
    acquisition: 'Inherited Secret Window surveillance used directly by Benjamin.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:zhang-lei-coin-value10', entityType: 'knowledge-record', name: 'Zhang Lei coin value-10 report',
    summary: 'Coventoba reports the observed capabilities of Zhang Lei’s coin at displayed value 10; Benjamin orders him to keep holding it and states that the displayed value will not rise further.',
    chapters: [417], knowledgeState: 'limited', secrecy: 'military-analysis',
    subjectLabels: freeze(['Zhang Lei coin at value 10', 'Coventoba capability report', 'Benjamin hold instruction']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Coventoba', 'Benjamin', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Coventoba’s report to Benjamin while holding the coin.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:halkenburg-feather-marker', entityType: 'knowledge-record', name: 'Halkenburg feather-marker investigation',
    summary: 'Balsamilco proposes checking the backs of hands for a feather marker to identify possible participants in Halkenburg’s mind-swap operation. The method is investigative, not proof of a complete participant set.',
    chapters: [417], knowledgeState: 'inferred', secrecy: 'counterintelligence-hypothesis',
    subjectLabels: freeze(['Feather marker on back of hand', 'Possible Halkenburg mind-swap participant identification']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Balsamilco Might', 'Benjamin', 'Coventoba', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Balsamilco’s Chapter 417 counterintelligence proposal.', publicAtChapter: null, confidence: 'probable', canonLevel: 'inference',
  }),
  base({
    id: 'knowledge-record:gypsy-life-host-transfer', entityType: 'knowledge-record', name: 'Gypsy Life future-host transfer mechanics',
    summary: 'Chapter 417 reveals that after Benjamin’s death his Guardian Spirit Beast fuses with Benjamin Baton and transfers to a blood relative, with the supplied host-selection rule alternating between Benjamin and the beast after the initial selection right is determined.',
    chapters: [417], knowledgeState: 'limited', secrecy: 'ability-mechanic-disclosure',
    subjectLabels: freeze(['Gypsy Life: Bohemian Rhapsody', 'Benjamin Baton fusion', 'Blood-relative future host', 'Alternating future-host selection rule']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin command circle as disclosed in scene', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Direct Chapter 417 ability explanation at the publication ceiling.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:first-unit-reactivation', entityType: 'knowledge-record', name: 'First Unit reactivation',
    summary: 'Benjamin rejects continued detention for Balsamilco and Coventoba, restores them to armed First Unit duty, and assigns immediate investigative and operational tasks.',
    chapters: [417], knowledgeState: 'limited', secrecy: 'military-command',
    subjectLabels: freeze(['Balsamilco reactivated', 'Coventoba reactivated', 'First Unit operational restoration']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin', 'Balsamilco Might', 'Coventoba', 'relevant military personnel']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Direct Chapter 417 military orders.', publicAtChapter: null, confidence: 'confirmed',
  }),
  base({
    id: 'knowledge-record:benjamin-unma-plan', entityType: 'knowledge-record', name: 'Benjamin plan to confront Unma',
    summary: 'At the Chapter 417 endpoint Benjamin resolves to confront Unma and force a choice between her own life and Halkenburg’s. No Chapter 418+ result is inferred.',
    chapters: [417], knowledgeState: 'secret', secrecy: 'publication-ceiling-plan',
    subjectLabels: freeze(['Benjamin intends to confront Unma', 'Halkenburg is the brother named in Benjamin’s choice']), subjectEntityIds: freeze([]),
    knowerLabels: freeze(['Benjamin', 'Reader']), knowerEntityIds: freeze([]), misinformedLabels: freeze([]), misinformedEntityIds: freeze([]),
    acquisition: 'Benjamin’s stated decision at the final Chapter 417 beat.', publicAtChapter: null, confidence: 'confirmed',
  }),
]);

export const contentDepthProtocolRecords417 = freeze([
  base({
    id: 'protocol:special-martial-law-order', entityType: 'protocol', name: 'Special Martial Law order',
    summary: 'The formal Chapter 415 declaration shifts practical control toward military command and is visibly enforced through Chapters 416–417 by confinement, forced relocation, detention, armed intervention, and Justice pressure.',
    chapters: [415, 416, 417], chapterRange: range(415, null), domain: 'military-order', protocolStatus: 'confirmed', authority: 'Kakin military command under Special Martial Law',
    ruleStatement: 'Military command may restrict movement and impose emergency operational control while the formal order remains active.', trigger: 'Formal Special Martial Law declaration in Chapter 415.',
    scope: 'Royal households, military and Justice personnel, controlled Tier 1 movement, and affected ship operations.', enforcement: 'Armed units, confinement, relocation, detention, checkpoints, and command orders.',
    exceptions: freeze(['The exact legal ceiling and all royal-immunity interactions remain incompletely published.']), openQuestions: freeze(['How long the order can remain active.', 'Which ordinary Justice powers survive intact under continued military consolidation.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:justice-custody-investigation', entityType: 'protocol', name: 'Justice custody and investigation procedure',
    summary: 'Justice custody remains a formal investigative mechanism, but Chapter 417 shows Benjamin directing Salkov and Danjin into Central Justice Bureau detention while military control expands over the institution.',
    chapters: [383, 384, 388, 389, 403, 417], chapterRange: range(383, null), domain: 'judicial-procedure', protocolStatus: 'confirmed', authority: 'Kakin Justice Bureau operating under royal and military constraints',
    ruleStatement: 'Suspects, witnesses, and protected persons can be moved into controlled Justice custody for investigation, testimony, or detention.', trigger: 'A reportable crime, witness order, escape incident, custody order, or formal inquiry.',
    scope: 'Justice facilities, detainees, witnesses, protected persons, and military-requested custody.', enforcement: 'Justice officials, detention facilities, escorted movement, records, and military pressure under emergency rule.',
    exceptions: freeze(['Special Martial Law and royal/military command can constrain ordinary procedure.']), openQuestions: freeze(['How independent Central Justice Bureau remains after the Chapter 417 takeover pressure.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:death-powered-curse-activation', entityType: 'protocol', name: 'Death-powered curse activation',
    summary: 'Succession curse systems use sacrifice, death, post-mortem Nen, target conditions, prepared carriers, and inheritance rules. Chapters 415–417 add Combo Master analysis, Hell Fruit activation, and Gypsy Life post-death transfer to the archive’s known cases.',
    chapters: [389, 401, 415, 416, 417], chapterRange: range(389, null), domain: 'nen-condition', protocolStatus: 'partially-confirmed', authority: 'Ability-specific Nen contracts',
    ruleStatement: 'Death or sacrifice can activate or amplify a prepared Nen effect, but each ability retains distinct target, persistence, transfer, and removal conditions.', trigger: 'Ability-specific death, sacrifice, proximity, target, or contractual condition.',
    scope: 'Camilla Have-Nots, Beyond curse children, Hell Fruit, Gypsy Life, and other explicitly death-linked systems.', enforcement: 'Nen vows, post-mortem amplification, inheritance, and target conditions.',
    exceptions: freeze(['Mechanics must remain ability-specific; no universal death-curse rule is inferred.']), openQuestions: freeze(['Complete exorcism and countermeasure rules remain incomplete.', 'Gypsy Life’s first future transfer has not yet occurred.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:combo-master-curse-analysis-windows', entityType: 'protocol', name: 'Combo Master curse-analysis windows',
    summary: 'Chapter 415 demonstrates Combo Master’s curse-detection and analysis interface, including curse-specific estimates of 365 days for deciphering and approximately 700 days for antidote development in the demonstrated case.',
    chapters: [415], domain: 'nen-condition', protocolStatus: 'partially-confirmed', authority: 'Combo Master ability mechanics',
    ruleStatement: 'The demonstrated interface can identify a curse-linked target silhouette and produce investigation/analysis windows whose duration depends on the curse under examination.', trigger: 'Use of Combo Master against a curse target.',
    scope: 'The Chapter 415 demonstrated curse-analysis case; not a universal duration for every curse.', enforcement: 'Ability-specific conjured interface and Nen conditions.', exceptions: freeze(['The 365/approximately 700-day figures are curse-specific, not global constants.']), openQuestions: freeze(['Complete mechanics and other curse-analysis durations remain unpublished.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:hell-fruit-post-mortem-trigger', entityType: 'protocol', name: 'Dust in the Wind: Hell Fruit post-mortem trigger',
    summary: 'Chapter 416 identifies Hell Fruit as a prepared post-mortem assassination curse in Camilla’s Have-Not network, with Moswana’s death activating the operation against Benjamin.',
    chapters: [416], domain: 'nen-condition', protocolStatus: 'confirmed', authority: 'Dust in the Wind: Hell Fruit ability conditions',
    ruleStatement: 'The prepared Have-Not curse is activated through the caster’s death under the demonstrated targeting arrangement.', trigger: 'Moswana’s death while the prepared target condition is in force.',
    scope: 'The documented Moswana-to-Benjamin operation.', enforcement: 'Post-mortem Nen and the ability’s prepared targeting conditions.', exceptions: freeze([]), openQuestions: freeze(['Complete removal and interaction rules with Benjamin’s other afflictions remain unresolved.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:tsk17-airborne-exposure', entityType: 'protocol', name: 'TSK-17 airborne exposure operation',
    summary: 'Chapter 417 demonstrates Benjamin covertly dispersing a second TSK-17 dose into Room 1001 while Tubeppa and Tyson are present, extending the biological-agent operation beyond its earlier use in the Halkenburg/Balsamilco conflict.',
    chapters: [417], domain: 'operational-rule', protocolStatus: 'confirmed', authority: 'Benjamin emergency operation using TSK-17',
    ruleStatement: 'A prepared TSK-17 dose can be covertly dispersed into an occupied room as demonstrated in Chapter 417.', trigger: 'Benjamin’s Room 1001 operation.', scope: 'The demonstrated Tubeppa/Tyson exposure event.',
    enforcement: 'Covert dispersal and subsequent military control/inspection.', exceptions: freeze(['Benjamin’s projected death timing is not treated as an observed outcome.']), openQuestions: freeze(['Exact later outcomes for Tubeppa and Tyson remain beyond the Chapter 417 ceiling.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:first-unit-reactivation', entityType: 'protocol', name: 'Benjamin First Unit reactivation',
    summary: 'Chapter 417 shows Benjamin restoring Balsamilco and Coventoba from detention/restriction to armed First Unit duty and immediately assigning counterintelligence tasks.',
    chapters: [417], domain: 'military-order', protocolStatus: 'confirmed', authority: 'First Prince Benjamin under Special Martial Law',
    ruleStatement: 'Benjamin reactivates selected First Unit officers and assigns them operational duties despite the surrounding Justice-custody context.', trigger: 'Benjamin’s Chapter 417 emergency command decision.', scope: 'Balsamilco, Coventoba, and First Unit duties shown in the chapter.',
    enforcement: 'Direct military command and restored armed status.', exceptions: freeze([]), openQuestions: freeze(['The broader institutional legality of the reactivation is not fully adjudicated in the published material.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:halkenburg-feather-screening', entityType: 'protocol', name: 'Halkenburg feather screening proposal',
    summary: 'Balsamilco proposes checking the backs of hands for a feather marker as a counterintelligence screen for possible Halkenburg mind-swap participants; the proposal is evidence-bounded and not treated as a proven exhaustive rule.',
    chapters: [417], canonLevel: 'inference', domain: 'operational-rule', protocolStatus: 'disputed', authority: 'Balsamilco counterintelligence proposal',
    ruleStatement: 'Inspect for the proposed feather marker when investigating possible participants in Halkenburg’s transfer operation.', trigger: 'Suspicion that personnel may have participated in or been affected by Halkenburg’s mind-swap ability.',
    scope: 'Potential participants under Balsamilco’s investigation.', enforcement: 'Physical inspection and follow-up investigation.', exceptions: freeze(['Marker presence/absence is not yet proven to identify every participant.']), openQuestions: freeze(['Whether every transfer participant bears the marker.', 'Whether the marker can persist, disappear, or be concealed.']), linkedEntityIds: freeze([]),
  }),
  base({
    id: 'protocol:gypsy-life-host-transfer', entityType: 'protocol', name: 'Gypsy Life future-host transfer',
    summary: 'Gypsy Life: Bohemian Rhapsody is revealed to fuse with Benjamin Baton after Benjamin’s death and continue as the Guardian Spirit Beast of a blood relative under a supplied alternating host-selection rule.',
    chapters: [417], domain: 'nen-condition', protocolStatus: 'confirmed', authority: 'Gypsy Life: Bohemian Rhapsody ability mechanics',
    ruleStatement: 'After Benjamin’s death, Gypsy Life fuses with Benjamin Baton and transfers to an eligible blood relative; future selection rights alternate after the initial choice is determined between Benjamin and the beast.', trigger: 'Benjamin’s death.',
    scope: 'Benjamin’s Guardian Spirit Beast and eligible blood relatives under the Chapter 417 rule disclosure.', enforcement: 'Post-mortem Nen fusion and ability-specific inheritance conditions.', exceptions: freeze(['The first future transfer has not yet occurred in published material.']), openQuestions: freeze(['Which blood relative becomes the first host.', 'How the initial selection right is resolved in practice.']), linkedEntityIds: freeze([]),
  }),
]);

export const contentDepthObjects417 = freeze([
  base({
    id: 'object:tsk-17', entityType: 'object', name: 'TSK-17', summary: 'Biological agent first embedded in the Halkenburg/Balsamilco operation and later disclosed as infecting Benjamin before a second dose is covertly dispersed around Tubeppa and Tyson in Chapter 417.',
    chapters: [403, 404, 416, 417], chapterRange: range(403, null), artifactCategory: 'biological-agent', artifactState: 'deployed',
    ownerLabels: freeze(['Kakin military / Balsamilco operation', 'Benjamin emergency operation']), ownerEntityIds: freeze([]), holderLabels: freeze(['Operational custody changes across the assassination, infection, and Room 1001 operations']), holderEntityIds: freeze([]),
    locationLabels: freeze(['Tier 2 courthouse operation', 'Benjamin command environment', 'Room 1001']), locationEntityIds: freeze([]), nenStatus: 'non-Nen biological agent repeatedly used inside Nen and succession operations',
    legalSignificance: 'Poisoning, homicide, covert infection, and martial-law evidence.', evidenceRole: 'Links the Halkenburg operation, Benjamin’s self-disclosed infection, and the Tubeppa/Tyson exposure.',
    chainOfCustody: custody({ chapter: 403, state: 'carried for poisoning operation', holder: 'Balsamilco operation' }, { chapter: 404, state: 'integrated into Halkenburg death/funeral plan', holder: 'Halkenburg operation' }, { chapter: 416, state: 'Benjamin infection state enters the current-release record', holder: 'Benjamin body / operational evidence' }, { chapter: 417, state: 'second dose covertly dispersed in Room 1001', holder: 'Benjamin emergency operation' }),
  }),
  base({
    id: 'object:zhang-lei-coins', entityType: 'object', name: 'Zhang Lei’s coins', summary: 'Daily conjured coins whose displayed values accumulate. By Chapter 417 Coventoba reports the coin at value 10 and Benjamin orders him to continue holding it.',
    chapters: [362, 376, 402, 404, 417], chapterRange: range(362, null), artifactCategory: 'conjured-object', artifactState: 'active',
    ownerLabels: freeze(['Zhang Lei Hui Guo Rou']), ownerEntityIds: freeze([]), holderLabels: freeze(['Distributed recipients', 'Coventoba in the Chapter 417 investigation']), holderEntityIds: freeze([]),
    locationLabels: freeze(['Zhang Lei household and recipient custody', 'Benjamin command investigation']), locationEntityIds: freeze([]), nenStatus: 'confirmed conjured Nen object; delayed/accumulating effect still incompletely understood',
    legalSignificance: 'Potential instrument of influence inside the succession contest and an active military intelligence subject.', evidenceRole: 'Material evidence for the Guardian Spirit Beast’s accumulating coin system.',
    chainOfCustody: custody({ chapter: 362, state: 'first observed', holder: 'Zhang Lei household' }, { chapter: 404, state: 'tested', holder: 'Kurapika and Zhang Lei household' }, { chapter: 417, state: 'reported at displayed value 10 and ordered retained', holder: 'Coventoba' }),
  }),
]);

export const contentDepthDocuments417 = freeze([
  base({ id: 'document:ch415-coded-postcard', entityType: 'document', name: 'Chapter 415 coded postcard', summary: 'A coded postcard is dispatched as part of the Room 1014 / Oito-Kurapika communication and contingency operation under the tightening martial-law environment.', chapters: [415], documentCategory: 'coded-correspondence', artifactState: 'deployed', authorLabels: freeze(['Oito/Kurapika operation']), authorEntityIds: freeze([]), recipientLabels: freeze(['Controlled recipient chain']), recipientEntityIds: freeze([]), locationLabels: freeze(['Tier 1 royal communication route']), locationEntityIds: freeze([]), legalSignificance: 'Private coded communication during emergency royal confinement.', evidenceRole: 'Documents a covert information channel and contingency plan.', chainOfCustody: custody({ chapter: 415, state: 'dispatched through controlled handoff', holder: 'Room 1014 communication operation' }) }),
  base({ id: 'document:special-martial-law-declaration', entityType: 'document', name: 'Special Martial Law declaration', summary: 'The formal Chapter 415 declaration establishing the current emergency military regime.', chapters: [415], documentCategory: 'military-declaration', artifactState: 'active', authorLabels: freeze(['Kakin military authority']), authorEntityIds: freeze([]), recipientLabels: freeze(['Royal households', 'Military and Justice personnel', 'Ship population']), recipientEntityIds: freeze([]), locationLabels: freeze(['Black Whale command and announcement network']), locationEntityIds: freeze([]), legalSignificance: 'Formal emergency authority used to justify movement restrictions, confinement, and military intervention.', evidenceRole: 'Primary documentary anchor for the current martial-law state.', chainOfCustody: custody({ chapter: 415, state: 'formally declared', holder: 'Kakin military command' }) }),
  base({ id: 'document:justice-detention-order-417', entityType: 'document', name: 'Salkov and Danjin Justice detention order', summary: 'Benjamin orders Salkov and Danjin escorted to Central Justice Bureau detention after the Room 1004 aftermath.', chapters: [417], documentCategory: 'custody-order', artifactState: 'deployed', authorLabels: freeze(['Benjamin']), authorEntityIds: freeze([]), recipientLabels: freeze(['Escort / Central Justice Bureau custody chain']), recipientEntityIds: freeze([]), locationLabels: freeze(['Central Justice Bureau']), locationEntityIds: freeze([]), legalSignificance: 'Emergency detention under the overlap of royal, military, and Justice authority.', evidenceRole: 'Tracks the transition from Room 1004 witness handling to formal custody.', chainOfCustody: custody({ chapter: 417, state: 'issued and executed', holder: 'Benjamin command / Justice custody chain' }) }),
  base({ id: 'document:first-unit-reactivation-order-417', entityType: 'document', name: 'First Unit reactivation order', summary: 'Benjamin restores Balsamilco and Coventoba to armed First Unit duty and assigns immediate investigations.', chapters: [417], documentCategory: 'military-order', artifactState: 'active', authorLabels: freeze(['Benjamin']), authorEntityIds: freeze([]), recipientLabels: freeze(['Balsamilco Might', 'Coventoba']), recipientEntityIds: freeze([]), locationLabels: freeze(['Benjamin command environment']), locationEntityIds: freeze([]), legalSignificance: 'Demonstrates emergency military command overriding continued detention/restriction.', evidenceRole: 'Documents the operational restoration of two key First Unit officers.', chainOfCustody: custody({ chapter: 417, state: 'issued', holder: 'Benjamin command' }) }),
  base({ id: 'document:zhang-lei-coin-report-417', entityType: 'document', name: 'Zhang Lei coin value-10 report', summary: 'Coventoba reports the coin’s observed capabilities at displayed value 10 to Benjamin and receives an order to keep holding it.', chapters: [417], documentCategory: 'intelligence-report', artifactState: 'active', authorLabels: freeze(['Coventoba']), authorEntityIds: freeze([]), recipientLabels: freeze(['Benjamin']), recipientEntityIds: freeze([]), locationLabels: freeze(['Benjamin command investigation']), locationEntityIds: freeze([]), legalSignificance: 'Military intelligence concerning a prince-linked Nen object.', evidenceRole: 'Preserves the value-10 observation and resulting hold instruction.', chainOfCustody: custody({ chapter: 417, state: 'reported', holder: 'Coventoba / Benjamin command' }) }),
]);

export const contentDepthEvidenceItems417 = freeze([
  base({ id: 'evidence-item:room-1004-reality-test', entityType: 'evidence-item', name: 'Room 1004 reality-test evidence', summary: 'Salkov’s observation of Tserriednich’s battered body and his planned Theta-scar check preserve the Chapter 417 uncertainty without converting either Benjamin’s conclusion or Salkov’s suspicion into omniscient fact.', chapters: [416, 417], chapterRange: range(416, null), evidenceCategory: 'observer-state-evidence', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze([]), evidentiaryUse: 'Separates observed trauma from unresolved scene reality and provides the basis for the pending reality check.', custodyStatus: 'Salkov observation / reader evidence', confidence: 'confirmed' }),
  base({ id: 'evidence-item:benjamin-affliction-disclosure', entityType: 'evidence-item', name: 'Benjamin affliction disclosure', summary: 'Benjamin’s Chapter 417 disclosure to Balsamilco and Coventoba is the direct evidence that he believes himself simultaneously affected by a Have-Not curse, TSK-17 infection, and possible Beyond curse targeting.', chapters: [417], evidenceCategory: 'self-disclosure', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze(['object:tsk-17']), evidentiaryUse: 'Establishes Benjamin’s own stated condition while keeping prognosis and the possible Beyond curse speaker-bounded.', custodyStatus: 'Benjamin command-circle knowledge', confidence: 'confirmed' }),
  base({ id: 'evidence-item:tsk-17-operation-chain', entityType: 'evidence-item', name: 'TSK-17 operation chain', summary: 'The TSK-17 evidence chain now spans the Balsamilco/Halkenburg poisoning operation, Benjamin’s self-disclosed infection, and the covert Room 1001 second-dose exposure of Tubeppa and Tyson.', chapters: [403, 404, 416, 417], chapterRange: range(403, null), evidenceCategory: 'operational-chain', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze(['object:tsk-17']), evidentiaryUse: 'Connects multiple biological-agent operations without asserting post-Chapter-417 outcomes.', custodyStatus: 'fragmented across military, royal, participant, and reader knowledge', confidence: 'confirmed' }),
  base({ id: 'evidence-item:camilla-secret-window-surveillance', entityType: 'evidence-item', name: 'Camilla Secret Window surveillance', summary: 'Benjamin’s use of Secret Window to observe Camilla contacting medical is direct evidence for both the surveillance act and the factual basis Benjamin uses when constructing his planned cover narrative.', chapters: [417], evidenceCategory: 'remote-surveillance', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze([]), evidentiaryUse: 'Separates the observed medical contact from Benjamin’s later framing plan.', custodyStatus: 'Benjamin / reader knowledge', confidence: 'confirmed' }),
  base({ id: 'evidence-item:halkenburg-feather-investigation', entityType: 'evidence-item', name: 'Halkenburg feather counterintelligence evidence', summary: 'Balsamilco’s feather-marker proposal is preserved as an investigative hypothesis supporting a search for possible mind-swap participants, not as proof of a complete transfer map.', chapters: [417], canonLevel: 'inference', evidenceCategory: 'counterintelligence-hypothesis', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze([]), evidentiaryUse: 'Supports targeted inspection while exposing the uncertainty of the marker rule.', custodyStatus: 'Balsamilco / Benjamin command-circle analysis', confidence: 'probable' }),
  base({ id: 'evidence-item:gypsy-life-mechanics', entityType: 'evidence-item', name: 'Gypsy Life mechanics disclosure', summary: 'Chapter 417 provides the first maintained evidence for Gypsy Life: Bohemian Rhapsody’s post-death fusion with Benjamin Baton and blood-relative host-transfer rule.', chapters: [417], evidenceCategory: 'ability-mechanics', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze([]), evidentiaryUse: 'Establishes the published transfer mechanics while keeping the first actual transfer unresolved.', custodyStatus: 'command-circle / reader knowledge', confidence: 'confirmed' }),
  base({ id: 'evidence-item:justice-takeover-first-unit', entityType: 'evidence-item', name: 'Justice takeover and First Unit reactivation chain', summary: 'Salkov/Danjin detention, Central Justice Bureau pressure, and the reactivation of Balsamilco/Coventoba form a single Chapter 417 institutional evidence chain showing military consolidation under Special Martial Law.', chapters: [417], evidenceCategory: 'institutional-control-chain', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze(['document:justice-detention-order-417', 'document:first-unit-reactivation-order-417']), evidentiaryUse: 'Tracks the shift from ordinary custody toward Benjamin-directed emergency military control.', custodyStatus: 'military and Justice operational record', confidence: 'confirmed' }),
  base({ id: 'evidence-item:zhang-lei-coin-value10', entityType: 'evidence-item', name: 'Zhang Lei coin value-10 evidence', summary: 'Coventoba’s Chapter 417 report and continued custody of the coin provide the maintained evidence for its displayed value-10 state and current military interest.', chapters: [417], evidenceCategory: 'nen-object-observation', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze(['object:zhang-lei-coins', 'document:zhang-lei-coin-report-417']), evidentiaryUse: 'Anchors the value-10 observation without extrapolating the coin’s unresolved future effects.', custodyStatus: 'Coventoba / Benjamin command investigation', confidence: 'confirmed' }),
  base({ id: 'evidence-item:unma-halkenburg-publication-endpoint', entityType: 'evidence-item', name: 'Unma / Halkenburg publication-ceiling endpoint', summary: 'Benjamin’s final Chapter 417 decision to confront Unma is the current endpoint. It establishes intent and target pressure only; no confrontation result exists in the maintained publication set.', chapters: [417], evidenceCategory: 'stated-plan', artifactState: 'active', subjectEntityIds: freeze([]), linkedArtifactIds: freeze([]), evidentiaryUse: 'Prevents the archive from converting a stated future plan into a Chapter 418+ outcome.', custodyStatus: 'Benjamin intent / reader knowledge', confidence: 'confirmed' }),
]);

export const contentDepthEditorialEntries417 = freeze([
  Object.freeze({ id: 'change:chapter-415-modernization', date: '2026-08-14', phase: 'content-depth-prelude', changeType: 'chapter-modernization', status: 'merged', summary: 'Integrated Chapter 415 non-linear chronology, formal Special Martial Law, Combo Master analysis, coded-postcard operation, and updated royal-room states.', affectedDomains: freeze(['chapters', 'story', 'nen', 'royal-family', 'protocols']) }),
  Object.freeze({ id: 'change:chapter-416-modernization', date: '2026-08-14', phase: 'content-depth-prelude', changeType: 'chapter-modernization', status: 'merged', summary: 'Integrated Chapter 416 Hell Fruit, Camilla/Benjamin confrontation, TSK-17 state, Danjin questioning order, and Room 1004 shooting cliff-edge.', affectedDomains: freeze(['chapters', 'story', 'nen', 'characters', 'relationships']) }),
  Object.freeze({ id: 'change:chapter-417-modernization', date: '2026-08-14', phase: 'content-depth-prelude', changeType: 'chapter-modernization', status: 'merged', summary: 'Integrated Chapter 417 Room 1004 aftermath, Justice takeover, second TSK-17 deployment, First Unit reactivation, value-10 coin report, Gypsy Life, and the Unma/Halkenburg endpoint.', affectedDomains: freeze(['chapters', 'story', 'nen', 'justice', 'military', 'royal-family']) }),
  Object.freeze({ id: 'change:timeline-content-intelligence', date: '2026-08-19', phase: 'content-depth-prelude', changeType: 'timeline-intelligence', status: 'merged', summary: 'Expanded the public timeline with cause/consequence chains, day synthesis, prince progression, questions, Nen signals, deadlines, and pre-voyage chronology.', affectedDomains: freeze(['timeline', 'story', 'princes', 'questions', 'nen']) }),
  Object.freeze({ id: 'change:content-depth-417-p0', date: '2026-08-19', phase: 'content-depth-p0', changeType: 'canonical-depth', status: 'in-progress', summary: 'Extends advanced Knowledge, Protocol, Artifact, Document, Evidence, and editorial intelligence through the Chapter 417 publication ceiling.', affectedDomains: freeze(['research', 'knowledge', 'protocols', 'objects', 'documents', 'evidence']) }),
]);
