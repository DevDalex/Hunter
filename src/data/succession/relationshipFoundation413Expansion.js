const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-413';
const record = ({ slug, name, summary, sourceEntityId, targetEntityId, subtype, sentiment = 'mixed', certainty = 'confirmed' }) => freeze({
  id: `relationship:${slug}`, entityType: 'relationship', slug, name, aliases: freeze([]), summary,
  sourceIds: freeze([sourceId]), publicationStatus: 'published', canonLevel: 'canon', createdAt: '2026-08-13', updatedAt: '2026-08-13',
  sourceEntityId, targetEntityId, relationshipType: 'professional', subtype, direction: 'directed', sentiment, status: 'active',
  chapterRange: freeze({ start: 413, end: 413 }), basis: summary, operationalState: summary, strength: 'high-operational', certainty,
  relatedEventIds: freeze([]), evidenceNotes: freeze([]), legacyIds: freeze([]),
});

export const relationshipFoundation413Expansion = freeze([
  record({ slug: 'nasubi-halkenburg-ch413-soul-eligibility', name: 'Nasubi Recognizes Halkenburg’s Continuing Succession Position', summary: 'Nasubi states that Halkenburg retains his succession position while his soul resides in a body, despite the state of the original body.', sourceEntityId: 'character:nasubi-hui-guo-rou', targetEntityId: 'character:halkenburg-hui-guo-rou', subtype: 'royal-ritual-eligibility-recognition' }),
  record({ slug: 'halkenburg-benjamin-ch413-ability-experiment', name: 'Halkenburg Extends His Ability Experiment Toward Benjamin', summary: 'Halkenburg ends the usefulness of continued Balsamilco impersonation and begins a new ability hypothesis involving Benjamin; the result remains unresolved.', sourceEntityId: 'character:halkenburg-hui-guo-rou', targetEntityId: 'character:benjamin-hui-guo-rou', subtype: 'active-nen-rivalry-unresolved-result' }),
  record({ slug: 'furykov-benjamin-ch413-coercion-restored-trust', name: 'Furykov Explains Coercion and Restores Benjamin’s Trust', summary: 'Furykov accepts responsibility for Benjamin’s current condition, explains the coercion and curse strategy behind his choice, reaffirms loyalty, and regains Benjamin’s trust.', sourceEntityId: 'character:furykov', targetEntityId: 'character:benjamin-hui-guo-rou', subtype: 'coerced-action-restored-command-trust', sentiment: 'allied' }),
  record({ slug: 'unma-furykov-ch413-curse-coercion-claim', name: 'Furykov Attributes a Forty-Eight-Hour Ultimatum to Unma', summary: 'Furykov says Unma used the threat of his Beyond-linked curse to impose a forty-eight-hour ultimatum involving Benjamin.', sourceEntityId: 'character:unma-hui-guo-rou', targetEntityId: 'character:furykov', subtype: 'coercion-claim-through-curse-threat', certainty: 'speaker-attributed' }),
  record({ slug: 'beyond-furykov-ch413-claimed-lineage-curse-source', name: 'Furykov Identifies Beyond as Father and Curse Source', summary: 'Furykov states that Beyond is his father and identifies Beyond as the source of the marked curse he carries.', sourceEntityId: 'character:beyond-netero', targetEntityId: 'character:furykov', subtype: 'claimed-lineage-and-curse-source', certainty: 'speaker-attributed' }),
  record({ slug: 'benjamin-tserriednich-ch413-personal-rivalry-plan', name: 'Benjamin Reserves Tserriednich for Personal Action', summary: 'Benjamin cites a Tserriednich–Halkenburg conspiracy and reserves Tserriednich for his own role in the approaching royal operation; no encounter is completed in Chapter 413.', sourceEntityId: 'character:benjamin-hui-guo-rou', targetEntityId: 'character:tserriednich-hui-guo-rou', subtype: 'planned-personal-rivalry', sentiment: 'hostile' }),
]);
