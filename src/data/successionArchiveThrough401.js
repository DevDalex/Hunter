import * as base from './successionArchiveThrough400.js';

export * from './successionArchiveThrough400.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary401 = Object.freeze({
  chapter: 401,
  day: 'Voyage Day 10',
  presentDay: true,
  exactTimes: Object.freeze(['11:45 a.m.', '2:00 p.m.']),
  boundary: 'Chapter 401 reveals Transparent Words—Moonlight Act, Longhi’s biological parentage through Beyond Netero, the ten strong curse-sacrifice disclosure, the exact Tubeppa–Woble treaty terms, and Beyond’s unnamed 2:00 p.m. meeting request while preserving the curse-target map and possible Beyond-child prince as unresolved hypotheses.',
  quarantined: Object.freeze([
    'Chapter 402+ consequences of the Moonlight Act treaty',
    'any later identification of a prince as Beyond Netero’s biological child',
    'any later mapping of Beyond curse sacrifices to individual prince targets',
    'any later revelation of whom Beyond requested to meet',
    'any later Special Martial Law declaration or enforcement',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10 · 11:45 a.m.', chapters: '401', subject: 'Longhi / Kurapika / Moonlight Act / Silent Majority',
    route: 'Room 1014 master bedroom → Longhi denies snake-ability ownership → aura pen/paper → Transparent Words—Moonlight Act reveal → voluntary contract framework',
    change: 'Longhi becomes an openly confirmed Nen user and Manipulator. She excludes herself as the Silent Majority user, reveals Moonlight Act’s voluntary-signature and truthful-disclosure conditions, and moves the Chapter 400 unsupplied contract into explicit mechanics without identifying the actual Silent Majority user.',
    state: 'Moonlight Act mechanics known / Longhi not Silent Majority user by direct denial / actual Silent Majority user unresolved', source: wiki('Chapter_401'),
  },
  {
    day: 'Voyage Day 10 · 11:45 a.m.', chapters: '401', subject: 'Longhi / Makaha / Beyond curse-sacrifice network',
    route: 'Beyond biological-daughter reveal → fake-marriage and academy history → Makaha investigation → shared seal → renowned Nen-user examination → ten strong curse sacrifices',
    change: 'Longhi identifies Beyond as her biological father and describes a long-prepared network of biological children carrying powerful malevolent Nen released at death. Longhi and Makaha are two of ten selected strong curse sacrifices. The exact individual curse abilities and target map remain unknown, while Longhi’s prince-target theory and Bill/Kurapika activation models remain hypotheses.',
    state: 'Longhi parentage confirmed / ten strong sacrifices disclosed / target map and activation control unresolved', source: wiki('Chapter_401'),
  },
  {
    day: 'Voyage Day 10 · 11:45 a.m.', chapters: '401', subject: 'Longhi / Kurapika / Tubeppa / Woble / Oito',
    route: 'legal-wife eligibility loophole → Tubeppa–Woble non-interference agreement → 9:00 a.m. Sunday renewal rule → one-week enforced-Zetsu breach penalty → Beyond-child investigation reward → one-use Moonlight Act',
    change: 'The private agreement becomes an explicit weekly peace treaty enforced by Moonlight Act. Kurapika accepts an investigation condition concerning a possible Beyond-child prince and may earn one use of Moonlight Act. Oito’s legal-wife eligibility wording permits the paternity hypothesis but does not confirm any Beyond-child prince.',
    state: 'treaty active / one-week Zetsu breach penalty known / possible Beyond-child prince unresolved / reward not yet granted or used', source: wiki('Chapter_401'),
  },
  {
    day: 'Voyage Day 10 · 11:45 a.m.', chapters: '401', subject: 'Longhi / Kurapika / Furykov / Room 1014 observers',
    route: 'Longhi conditional assassination intent → exit while crying → Furykov multi-model analysis → Kurapika unresolved-negotiation cover story → Tenftory enters next → Furykov asks Babimyna about reassignment',
    change: 'Longhi states that she will kill Beyond’s child herself if that child proves to be one of the princes. Kurapika’s Dowsing Chain detects no lie but does not convert Longhi’s hypotheses into fact. Outside the room, Kurapika conceals the actual compromise while Furykov fails to infer the private mechanics and begins doubting his Longhi-as-assassin model.',
    state: 'conditional Longhi assassination intent confirmed / victim unidentified / treaty concealed from observers / Babimyna hesitation unexplained', source: wiki('Chapter_401'),
  },
  {
    day: 'Voyage Day 10 · 2:00 p.m.', chapters: '401', subject: 'Beyond Netero / Kanzai',
    route: 'Tier 1 detention cell → book exchange denied → pen/paper denied → security banter → Beyond requests a meeting',
    change: 'Beyond remains confined and asks Kanzai to arrange a meeting with someone. The requested person is not named and the chapter does not show the meeting being scheduled.',
    state: 'Beyond detained / meeting target and outcome unresolved', source: wiki('Chapter_401'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
