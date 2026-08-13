const freeze = (value) => Object.freeze(value);
const range = freeze({ start: 414, end: 414 });
const relation = ({ slug, name, summary, fromId, toId, relationshipType, direction = 'directed', status = 'active', evidence = [] }) => freeze({
  id: `relationship:${slug}`, entityType: 'relationship', slug, name, aliases: freeze([]), summary,
  sourceIds: freeze(['source:chapter-414']), publicationStatus: 'published', canonLevel: 'canon',
  createdAt: '2026-08-13', updatedAt: '2026-08-13', fromId, toId, relationshipType, direction,
  chapterRange: range, status, certainty: 'confirmed', evidence: freeze(evidence), revealedChapter: 414, latestChapter: 414,
});

export const relationshipFoundation414Expansion = freeze([
  relation({ slug: 'luzurus-ridge-ch414-delay-kanjidol', name: 'Luzurus → Ridge · Kanjidol delay', summary: 'Luzurus privately directs Ridge to keep Kanjidol occupied during the approaching emergency regime.', fromId: 'character:luzurus-hui-guo-rou', toId: 'character:ridge', relationshipType: 'protective command', evidence: ['Chapter 414 Room 1007 instruction.'] }),
  relation({ slug: 'ridge-kanjidol-ch414-unresolved-confrontation', name: 'Ridge ↔ Kanjidol · unresolved confrontation', summary: 'Ridge challenges Kanjidol’s account in Room 1007 and their confrontation begins without a Chapter 414 result.', fromId: 'character:ridge', toId: 'character:kanjidol', relationshipType: 'confrontation', direction: 'bidirectional', status: 'unresolved', evidence: ['Chapter 414 servants’ quarters scene; later result excluded.'] }),
  relation({ slug: 'chiyamasi-yushohi-ch414-muteking-support', name: 'Chiyamasi → Yushohi · Muteking support', summary: 'Chiyamasi and Yushohi are paired outside Room 1009; Chiyamasi activates Muteking on Yushohi before their planned movement.', fromId: 'character:chiyamasi', toId: 'character:yushohi', relationshipType: 'operational support', evidence: ['Chapter 414 Muteking activation.'] }),
  relation({ slug: 'bill-kurapika-ch414-beyond-planning', name: 'Bill ↔ Kurapika · Beyond planning', summary: 'Bill proposes a Beyond negotiation and Moonlight Act counter-trap while Kurapika treats cooperation as a likely trap.', fromId: 'character:bill', toId: 'character:kurapika', relationshipType: 'strategic cooperation', direction: 'bidirectional', evidence: ['Chapter 414 Room 1014 planning discussion.'] }),
  relation({ slug: 'oito-kurapika-ch414-yamato-trust', name: 'Oito ↔ Kurapika · Yamato trust disclosure', summary: 'After Kurapika swears by friends he trusts more than himself, Oito discloses her maternal-side Yamato postal contact route.', fromId: 'character:oito-hui-guo-rou', toId: 'character:kurapika', relationshipType: 'trust and contingency cooperation', direction: 'bidirectional', evidence: ['Chapter 414 strict endpoint.'] }),
]);
