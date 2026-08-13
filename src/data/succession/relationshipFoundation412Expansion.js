const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-412';
const relationship = ({ slug, name, summary, sourceEntityId, targetEntityId, subtype, sentiment = 'mixed', basis, operationalState, certainty = 'confirmed', relatedEventIds = [] }) => freeze({
  id: `relationship:${slug}`, entityType: 'relationship', slug, name, aliases: freeze([]), summary,
  sourceIds: freeze([sourceId]), publicationStatus: 'published', canonLevel: 'canon', createdAt: '2026-08-13', updatedAt: '2026-08-13',
  sourceEntityId, targetEntityId, relationshipType: 'professional', subtype, direction: 'directed', sentiment, status: 'active',
  chapterRange: freeze({ start: 412, end: 412 }), basis, operationalState, strength: 'high-operational', certainty,
  relatedEventIds: freeze(relatedEventIds), evidenceNotes: freeze([]), legacyIds: freeze([]),
});

export const relationshipFoundation412Expansion = freeze([
  relationship({
    slug: 'kurapika-oito-ch412-verified-child-swap-trust',
    name: 'Kurapika Verifies Oito’s Child-Swap Disclosure',
    summary: 'After Bill’s pronunciation clue, Kurapika conducts a calibrated chain test, verifies Oito’s account, and clears her before Sakata and Babimyna.',
    sourceEntityId: 'character:kurapika', targetEntityId: 'character:oito-hui-guo-rou', subtype: 'protective-interrogation-verified-trust', sentiment: 'allied',
    basis: 'Oito consents to the chain test and Kurapika’s chain remains still through the identity and eligibility explanation.',
    operationalState: 'Trust is retained after disclosure; Kurapika now strategizes with the knowledge that Oito’s daughter is not the infant aboard.',
    relatedEventIds: ['event:chapter412-kurapika-requests-formal-oito-test','event:chapter412-chain-does-not-move-on-oito-explanation','event:chapter412-sakata-babimyna-witness-clearance'],
  }),
  relationship({
    slug: 'oito-woble-ch412-maternal-separation-concealment',
    name: 'Oito Protects Woble Through Separation and Concealment',
    summary: 'Oito says her daughter Woble is with Oito’s younger sister somewhere unknown to her, while Oito feigned participation aboard the Black Whale to avoid being killed.',
    sourceEntityId: 'character:oito-hui-guo-rou', targetEntityId: 'character:woble-hui-guo-rou', subtype: 'maternal-protection-separation-concealment', sentiment: 'allied',
    basis: 'Oito’s chain-verified testimony about the child swap and her survival motive.',
    operationalState: 'Mother and daughter are physically separated; Oito does not know Woble’s current location.',
    relatedEventIds: ['event:chapter412-oito-reveals-nephew-and-daughter-swap','event:chapter412-oito-explains-feigned-participation'],
  }),
  relationship({
    slug: 'bill-kurapika-ch412-pronunciation-investigation',
    name: 'Bill Supplies the Pronunciation Clue That Unlocks Oito’s Secret',
    summary: 'Bill connects the Shimanu pronunciation discussion to Oito’s alternating masculine/feminine pronunciation of Woble and privately alerts Kurapika.',
    sourceEntityId: 'character:bill', targetEntityId: 'character:kurapika', subtype: 'investigative-support-linguistic-clue', sentiment: 'allied',
    basis: 'Bill’s observation after the Shimanu correction scene.',
    operationalState: 'Room 1014 partnership deepens through shared investigative reasoning.',
    relatedEventIds: ['event:chapter412-bill-recognizes-pronunciation-clue-and-whispers','event:chapter412-bill-explains-woble-pronunciation-switch'],
  }),
  relationship({
    slug: 'cleapatro-beyond-ch412-dismissed-lawsuits-document-review',
    name: 'Cleapatro Brings Beyond 1,047 Dismissed Lawsuits',
    summary: 'Cleapatro arrives with Justice Bureau records, corrects Beyond’s lawsuit count to 1,047, says all were dismissed, and continues arguing while Kanzai and Saiyu screen the material.',
    sourceEntityId: 'character:cleapatro', targetEntityId: 'character:beyond-netero', subtype: 'legal-administrative-document-confrontation', sentiment: 'adversarial',
    basis: 'The Tier 1 detention-cell document visit.',
    operationalState: 'Legal/document exchange remains active at the Chapter 412 stopping point; no later document result is imported.',
    relatedEventIds: ['event:chapter412-cleapatro-visits-beyond-cell-with-documents','event:chapter412-beyond-lawsuit-count-1047-all-dismissed','event:chapter412-saiyu-randomizes-documents-as-cleapatro-beyond-bicker'],
  }),
]);
