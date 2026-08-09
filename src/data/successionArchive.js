import * as base from './successionArchiveThrough392.js';

export * from './successionArchiveThrough392.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 392 · exact time unsupplied', chapters: '393', subject: 'Luini / Nobunaga / Phinks / Feitan / Heil-Ly',
    route: 'Tier 5 Cha-R office confrontation → Luini proposes destructive alliance → Nobunaga kills Luini → Troupe shows corpse to returning Cha-R personnel → Heil-Ly destruction becomes explicit Troupe priority',
    change: 'Luini is definitively killed by Nobunaga after proposing cooperation to destroy the mafia families, Kakin royal family, Black Whale, and old world. The Troupe retains its Hisoka hunt while announcing that Heil-Ly and Morena can be dealt with first when useful intelligence becomes available.',
    state: 'Luini dead / Troupe–Heil-Ly direct hostility escalated / no post-mortem continuation of Luini’s spatial ability established', source: wiki('Chapter_393'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '393', subject: 'Morena / Daemon / Gelato / Perigord / Bille / Voconte / Tevelares / Quorolle / Matvere',
    route: 'Heil-Ly assesses Luini loss → members discuss levels/types and ranged counters → Voconte proposes door trap → Morena coaches restriction-based counter design',
    change: 'Heil-Ly members say losing Luini harms their ability to hunt from the hideout and discuss reaching level 21 to develop abilities. Voconte is identified as a level 26 Emitter and proposes an unnamed door ability as a trap. Morena stresses opponent analysis and creative restriction design; her hit-count example is hypothetical rather than an actual revealed ability.',
    state: 'Heil-Ly adapting after Luini/Padaille losses / level-21 and innate-type discussion confirmed / Perigord’s Luini-Emitter claim remains inference / Voconte door mechanics unresolved', source: wiki('Chapter_393'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '393', subject: 'Lynch / Zakuro / Hinrigh / apparent Hisoka',
    route: 'Lynch and Zakuro recover → cinema complex search → auditorium #8 negotiation → VVIP access offered → temporary non-initiation condition accepted',
    change: 'Lynch and Zakuro recover alive after the prior encounter. Hinrigh approaches the man Xi-Yu believes is Hisoka and negotiates a temporary arrangement: Tier 1/VVIP access in exchange for not initiating a Troupe fight until Heil-Ly is handled, while preserving the right to fight if attacked first.',
    state: 'temporary Chapter 393 arrangement active under the mafia’s working identity / objective identity unresolved / Chapter 405 Bonolenov–Metamorphorsen reveal not backfilled', source: wiki('Chapter_393'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '393', subject: 'Ken’i Wang / Maizan / Xi-Yu / Cha-R',
    route: 'Ken’i finds Maizan waiting → learns Hinrigh’s hideout-intelligence deal → matches 50-million offer → adds 5-million identification incentives and cover-up proposal → combined mafia group prepares inspection',
    change: 'Ken’i matches Hinrigh’s fifty-million intelligence offer, expands the paid identification scheme, and says Xi-Yu and Cha-R are cooperating to crush Heil-Ly with Fourth Prince approval. The approval is preserved as Ken’i’s statement rather than independently verified in this chapter scene.',
    state: 'Xi-Yu/Cha-R tactical anti-Heil-Ly cooperation confirmed / Maizan transaction active / Ken’i smile rumor remains only a rumor', source: wiki('Chapter_393'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '393', subject: 'Connelly / Maizan / Hinrigh / Ken’i / Room 3101',
    route: 'Connelly arrives with cash → Maizan guides group to Room 3101 → bathroom-wall/plumbing anomaly explained → old resident opens door → Maizan enters first',
    change: 'Maizan’s Chapter 392 unplanned-room lead is narrowed to Room 3101. He explains the worker’s claim that the room uniquely lacked a bathroom wall because plumbing space lay behind it. The group treats a newly present wall as suspicious evidence while Ken’i warns that anything could be behind it at the ship edge.',
    state: 'Room 3101 identified as investigation site / infrastructure anomaly worth testing / Heil-Ly ownership not yet confirmed', source: wiki('Chapter_393'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '393', subject: 'Maizan / Hinrigh / Ken’i / Room 3101 resident',
    route: 'Maizan crosses Room 3101 threshold → disappears from Hinrigh/Ken’i view → resident suggests bathroom → Hinrigh throws knife → knife remains visible → resident forced outside',
    change: 'Maizan disappears from the observers’ view after entering Room 3101. Hinrigh tests the doorway with a thrown knife and observes that the knife does not disappear. Chapter 393 supplies no destination, trigger, ability user, transport rule, or confirmed Heil-Ly route connection, and Maizan is not marked dead.',
    state: 'Maizan whereabouts/body/consciousness unresolved after disappearance / one non-disappearing knife test recorded / Room 3101 mechanism open', source: wiki('Chapter_393'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
