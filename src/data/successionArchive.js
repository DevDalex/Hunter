import * as base from './successionArchiveThrough391.js';

export * from './successionArchiveThrough391.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 391 · exact time unsupplied', chapters: '392', subject: 'Padaille / Misha Hao / Hinrigh / Maizan',
    route: 'Tier 3 Area E aftermath → Padaille corpse appears to leave under civilian cover → Misha post-mortem cleanup revealed → Maizan privately approaches Hinrigh',
    change: 'Padaille remains dead despite his corpse appearing to rise and leave the public scene. Chapter 392 reveals Misha Hao, the deceased former Xi-Yu undertaker, as a post-mortem Nen cleanup contingency that inconspicuously disposes of people killed by Xi-Yu members and vanishes after the corpse is dealt with.',
    state: 'Padaille death preserved / Misha post-mortem cleanup purpose confirmed / official ability name and complete mechanics unresolved', source: wiki('Chapter_392'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '392', subject: 'Hinrigh / Corporal Maizan / possible Heil-Ly infrastructure',
    route: 'Maizan offers Morena-location intelligence → 50-million conditional offer / 30-million upfront demand → unplanned wired-room story → Hinrigh requires Maizan to lead him there',
    change: 'Maizan says workers wired a room absent from the ship plans after which he was warned to keep quiet. He guesses that it must belong to Heil-Ly if Xi-Yu has no secret hideout. Hinrigh refuses to treat the attribution as verified without personally confirming the location and requires Maizan to guide him there.',
    state: 'unplanned-room lead active / price negotiation confirmed / Heil-Ly ownership and Morena location unverified', source: wiki('Chapter_392'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '392', subject: 'Lynch / Zakuro / Hanal / apparent Hisoka',
    route: 'Bloody Mary candidate search → Hanal ruled out by Body and Soul → another candidate followed into empty corridor → Lynch reflexively countered → Zakuro invites apparent Hisoka to Xi-Yu',
    change: 'Body and Soul produces Hanal’s inner-soul answer that he is not Hisoka. Lynch later attempts the ability on a man she and Zakuro believe is Hisoka, but her punch seemingly fails and she is abruptly countered. Lynch later groans and remains alive. Zakuro, frightened by the man’s aura and ease of subduing Lynch, concludes he must be Hisoka and asks him to accompany Xi-Yu.',
    state: 'Hanal ruled out / Lynch alive but temporarily down / second target believed to be Hisoka by Xi-Yu but objective identity unresolved at Chapter 392 boundary / later Chapter 405 identity reveal not backfilled', source: wiki('Chapter_392'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '392', subject: 'Tsudonke / Cha-R logistics and Hisoka search',
    route: 'lower-tier kiosk gossip → Area E disturbance report → autograph-paper search → Tier 1 ordering route → final-shipment deadlines → four-day Hisoka-search goal',
    change: 'The kiosk woman tells Tsudonke that upper-class contacts can arrange requested goods, states Voyage Day 14 as the last air-shipment order deadline and three days earlier for high-speed boat, and says small items might be drone-delivered depending on connections and cash. Tsudonke gives himself four days to find Hisoka so he can ask for proper autograph paper as a reward.',
    state: 'reported shipment deadlines preserved as speaker information / Tsudonke four-day personal search goal active', source: wiki('Chapter_392'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '392', subject: 'Ken’i Wang / Cha-R / Hisoka / Heil-Ly / Phantom Troupe',
    route: 'Area E clash report → Tsudonke search expanded toward Area C → Ken’i assesses Troupe/Heil-Ly hitman condition → Hisoka made top priority → non-approach order → three-way balancing strategy',
    change: 'Ken’i orders Cha-R personnel not to approach Hisoka before he arrives and plans to negotiate so Hisoka, Heil-Ly, and the Phantom Troupe can be turned against one another while Cha-R preserves balance. His belief that the Heil-Ly hitman’s marking condition has already been fulfilled and his reading that Hisoka likes stacking the deck against himself remain character assessments.',
    state: 'Hisoka search becomes Cha-R top priority / non-approach order confirmed / projected balance outcome and hitman-condition assessment remain strategic inference', source: wiki('Chapter_392'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '392', subject: 'Nobunaga / Phinks / Feitan / Luini / Cha-R office',
    route: 'Tier 5 Cha-R office waiting position → possible two-person search plan → Luini arm/opening probe → Cha-R search-team doorway disappearance → Luini face appears through door opening → Nobunaga draws katana',
    change: 'Nobunaga, Phinks, and Feitan remain together at the Cha-R office while discussing search shifts. Luini uses spatial openings to probe the position and directly confronts the three, criticizing their cooperation with Cha-R. Phinks and Feitan reject his interpretation and Nobunaga draws his katana and threatens him.',
    state: 'Luini/Troupe direct hostile contact confirmed / spatial openings demonstrated but complete ability rules unresolved / Luini alive at Chapter 392 end', source: wiki('Chapter_392'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
