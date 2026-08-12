const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-411';
const relationship = ({ slug, name, summary, sourceEntityId, targetEntityId, subtype, sentiment = 'mixed', basis, operationalState, certainty = 'confirmed', relatedEventIds = [] }) => freeze({
  id: `relationship:${slug}`, entityType: 'relationship', slug, name, aliases: freeze([]), summary,
  sourceIds: freeze([sourceId]), publicationStatus: 'published', canonLevel: 'canon', createdAt: '2026-08-12', updatedAt: '2026-08-12',
  sourceEntityId, targetEntityId, relationshipType: 'professional', subtype, direction: 'directed', sentiment, status: 'active',
  chapterRange: freeze({ start: 411, end: 411 }), basis, operationalState, strength: 'high-operational', certainty,
  relatedEventIds: freeze(relatedEventIds), evidenceNotes: freeze([]), legacyIds: freeze([]),
});

export const relationshipFoundation411Expansion = freeze([
  relationship({
    slug: 'halkenburg-benjamin-ch411-balsamilco-impersonation',
    name: 'Halkenburg Deceives Benjamin Through Balsamilco’s Body',
    summary: 'Halkenburg speaks from Balsamilco Might’s body while impersonating Balsamilco and supplies Benjamin with the funeral schedule, prince exemption, and guard-reassignment plan.',
    sourceEntityId: 'character:halkenburg-hui-guo-rou', targetEntityId: 'character:benjamin-hui-guo-rou', subtype: 'body-transfer-deceptive-impersonation', sentiment: 'hostile',
    basis: 'The 8:00 a.m. call is explicitly conducted by Halkenburg from within Balsamilco’s body while pretending to be Balsamilco.',
    operationalState: 'Benjamin accepts the call at face value within Chapter 411; no discovery of the impersonation is recorded.',
    relatedEventIds: ['event:chapter411-halkenburg-in-balsamilco-calls-benjamin-at-eight','event:chapter411-funeral-schedule-prince-exemption-guard-reassignment'],
  }),
  relationship({
    slug: 'kacho-fugetsu-ch411-postdeath-protective-dependency',
    name: 'Kacho’s Post-Death Construct Sustains Fugetsu',
    summary: 'Kacho’s post-death Nen construct worries that she consumes Fugetsu’s energy, while Melody insists Fugetsu needs her and would not last without her.',
    sourceEntityId: 'character:kacho-hui-guo-rou', targetEntityId: 'character:fugetsu-hui-guo-rou', subtype: 'postdeath-nen-protective-dependency', sentiment: 'positive',
    basis: 'Kacho’s concern and Melody’s correction in Kaiser’s office.', operationalState: 'Protective construct remains active while Fugetsu sleeps and recovers; human Kacho is not revived.',
    relatedEventIds: ['event:chapter411-kaiser-melody-kacho-monitor-sleeping-fugetsu'],
  }),
  relationship({
    slug: 'sarahell-woble-ch411-covert-curse-infiltration',
    name: 'Sarahell Infiltrates Room 1014 to Target Woble',
    summary: 'Sarahell disguises herself as a maid, preserves the curse operation, evaluates exorcist risk and conditional timing, and observes Woble from within the expanded Nen class.',
    sourceEntityId: 'character:sarahell', targetEntityId: 'character:woble-hui-guo-rou', subtype: 'covert-curse-assassination-targeting', sentiment: 'hostile',
    basis: 'Sarahell’s disguise, curse timing estimates, exorcist check, and Room 1014 observation.', operationalState: 'Active covert targeting; no completed curse or attack is recorded in Chapter 411.',
    relatedEventIds: ['event:chapter411-sarahell-disguises-herself-as-maid','event:chapter411-sarahell-continues-woble-curse-plan-and-exorcist-check','event:chapter411-sarahell-estimates-five-day-object-assisted-curse'],
  }),
  relationship({
    slug: 'kurapika-woble-ch411-defense-and-ineligibility-declaration',
    name: 'Kurapika Expands Woble’s Defensive Coalition and Declares Woble Ineligible',
    summary: 'Kurapika expands the Room 1014 Nen-training coalition, proposes a ritual-failure theory that could protect weaker princes, and ends by declaring Woble ineligible to participate.',
    sourceEntityId: 'character:kurapika', targetEntityId: 'character:woble-hui-guo-rou', subtype: 'protective-strategy-contest-eligibility', sentiment: 'positive',
    basis: 'Kurapika’s training strategy, succession ritual analysis, and terminal declaration.', operationalState: 'Kurapika remains Woble’s protector; the reason and legal/Nen effect of the ineligibility declaration remain unresolved at the Chapter 411 endpoint.',
    relatedEventIds: ['event:chapter411-kurapika-splits-intro-beginner-classes','event:chapter411-kurapika-proposes-vow-limitation-model-for-contest','event:chapter411-kurapika-declares-woble-ineligible-oito-awake'],
  }),
]);
