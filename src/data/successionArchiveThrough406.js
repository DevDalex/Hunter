import * as base from './successionArchiveThrough405.js';

export * from './successionArchiveThrough405.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary406 = Object.freeze({
  chapter: 406,
  day: 'Voyage Day 12 · Halkenburg funeral-procession period',
  presentDay: true,
  exactTimes: Object.freeze(['No exact Chapter 406 minute supplied', 'Halkenburg’s funeral procession begins during the chapter']),
  presentationOrderNonLinear: false,
  boundary: 'Chapter 406 resolves Tajao’s Chapter 405 door cliffhanger into the outer pipe/stair route, separates the inter-tier waste plant from the Heil-Ly processing area, preserves the proposed Heil-Ly subcontractor killing pipeline as theory, shows Hinrigh’s transmitter reverting, reveals Lynch’s recovered body while keeping Hinrigh and Zakuro unaware of Bonolenov, and advances Chrollo’s phone search, three-regalia target, Skill Hunter evolution prerequisite, Spider-continuity statement, and funeral-procession search without importing Chapter 407+ outcomes.',
  quarantined: Object.freeze([
    'Any Chapter 407+ identity or exact tier for the person Chrollo is tracking',
    'Any Chapter 407+ identity for the ability Chrollo wants after the national-treasure prerequisite',
    'Any confirmation that Heil-Ly actually operates the proposed waste-subcontractor killing pipeline',
    'Any proof that Feitan’s self-defense proposal bypasses LSDF or another counteractive defense',
    'Any reader-only Bonolenov knowledge added to Hinrigh or Zakuro’s Chapter 406 personal knowledge',
    'Any invented original owner for Love Dial based on the undefined “McGait Narumi” page text',
    'Any exact Love Dial daily-call count, signal radius, Nen category, or reset rule not supplied in Chapter 406',
    'Any confirmation that Chrollo’s regalia-system and Tier 1 storage theories are objectively true',
    'Any completed sacred-treasure theft, Skill Hunter evolution, or anti-Hisoka ability acquisition',
    'Any named Spider successor or details of Chrollo’s unspecified continuity alternative',
    'Any new Xi-Yu/Cha-R or Xi-Yu/Phantom Troupe war based only on Lynch’s death',
    'Any completed Dogman/Sodom funeral-operation result not shown in the Chapter 406 packet',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 12 · funeral-procession period', chapters: '406', subject: 'Tajao / Nobunaga / Phinks / Feitan',
    route: 'Chapter 405 final door → outer pipe/stair chamber → waste-processing explanation → subcontractor theory → Nobunaga turns back while Phinks/Feitan continue upward',
    change: 'The hidden route’s next area is revealed and the Troupe team splits. The waste-processing facility is confirmed between Tiers 4 and 5 under Cha-R/Xi-Yu control, while Heil-Ly contractor use remains a theory.',
    state: 'outer route identified / waste control stated / Nobunaga investigating / Phinks and Feitan continuing toward Tier 2', source: wiki('Chapter_406'),
  },
  {
    day: 'Voyage Day 12 · Tier 3 funeral patrol', chapters: '406', subject: 'Lynch / Hinrigh / Zakuro',
    route: 'Lynch body recovered → neck injury described → initial Heil-Ly hypothesis → fake-Lynch/fake-Hisoka reconstruction → revenge vow',
    change: 'Chapter 406 adds the corpse-recovery state and Xi-Yu’s deductions. The archive still knows from Chapter 405 that Bonolenov killed Lynch, but Hinrigh and Zakuro do not identify him.',
    state: 'Lynch deceased/body recovered / Hinrigh and Zakuro investigating unknown culprit / revenge objective active', source: wiki('Chapter_406'),
  },
  {
    day: 'Voyage Day 12 · Heil-Ly hideout', chapters: '406', subject: 'Hinrigh transmitter / Biohazard',
    route: 'concealed transmitter-oyster continues beeping → transformed form reverts beneath cabinet',
    change: 'The tracking device returns to its original electronic form. Exact elapsed duration and whether Hinrigh knows the reversion instant remain unresolved.',
    state: 'transmitter original form restored inside hideout', source: wiki('Chapter_406'),
  },
  {
    day: 'Voyage Day 12 · Tier 3 funeral crowd', chapters: '406', subject: 'Chrollo / Kakin regalia / Skill Hunter / Hisoka',
    route: 'phone search → Tier 1 risk analysis → three sacred treasures identified → regalia-system/Tier 1 theories → national-treasure prerequisite explained',
    change: 'Chrollo’s Hisoka preparation now explicitly includes stealing Kakin’s three sacred treasures to satisfy the extra theft prerequisite in his planned Skill Hunter evolution. The desired ability remains unidentified and no treasure is stolen.',
    state: 'regalia theft objective active / Skill Hunter evolution preparation active / Hisoka encounter not begun', source: wiki('Chapter_406'),
  },
  {
    day: 'Voyage Day 12 · Halkenburg procession begins', chapters: '406', subject: 'Chrollo / tracked person / Phantom Troupe continuity',
    route: 'Spider continuity statement → Halkenburg casket enters procession → final phone call finds target beyond current Nen signal range → Chrollo concludes target is above',
    change: 'Chrollo states that an alternative will keep the Spider’s idea alive if he dies. His final search result narrows the unknown target to somewhere above his Tier 3 position without identifying the person or exact tier.',
    state: 'funeral procession underway / tracked person above Tier 3 but exact location unknown / continuity alternative unspecified', source: wiki('Chapter_406'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
