const freeze = (value) => Object.freeze(value);
const sourceId = 'source:chapter-420';

const relationship = ({ slug, name, summary, sourceEntityId, targetEntityId, relationshipType='hostile', subtype, direction='bidirectional', sentiment='hostile', status='active', basis, operationalState, strength='critical', certainty='confirmed', relatedEventIds=[], evidenceNotes=[] }) => freeze({
  id:`relationship:${slug}`,entityType:'relationship',slug,name,aliases:freeze([]),summary,sourceIds:freeze([sourceId]),publicationStatus:'published',canonLevel:'canon',createdAt:'2026-09-09',updatedAt:'2026-09-09',sourceEntityId,targetEntityId,relationshipType,subtype,direction,sentiment,status,chapterRange:freeze({start:420,end:420}),basis,operationalState,strength,certainty,relatedEventIds:freeze(relatedEventIds),evidenceNotes:freeze(evidenceNotes),legacyIds:freeze([]),
});

export const relationshipFoundation420Expansion = freeze([
  relationship({
    slug:'tserriednich-hisoka-ch420-casino-nen-encounter',
    name:'Tserriednich and Hisoka · Casino Nen Collision',
    summary:'Tserriednich attempts to test Hisoka inside the Tier 1 casino, but Hisoka instantly repositions behind him. Tserriednich activates Parallel Future, sees a future in which Hisoka kills him after learning he is not a Spider, then escapes that predicted outcome while Hisoka appears to detect an unexplained Nen/perception anomaly and walks away.',
    sourceEntityId:'character:tserriednich-hui-guo-rou',targetEntityId:'character:hisoka-morow',
    subtype:'hostile-nen-probing-and-predicted-lethal-contact',
    basis:'The Chapter 420 casino encounter from the user-supplied synopsis.',
    operationalState:'No completed real-world kill occurs. Tserriednich survives and leaves exhilarated; Hisoka departs without further attacking the real Tserriednich.',
    strength:'critical / elite-combat-contact',
    relatedEventIds:['event:chapter420-hisoka-appears-behind-cover','event:chapter420-predicted-hisoka-kills-tserriednich','event:chapter420-tserriednich-jumps-away','event:chapter420-hisoka-looks-toward-real-tserriednich','event:chapter420-hisoka-walks-away'],
    evidenceNotes:['The throat-slitting death is a predicted future, not Tserriednich’s actual death.','Hisoka’s exact Nen perception mechanism remains unresolved.'],
  }),
]);
