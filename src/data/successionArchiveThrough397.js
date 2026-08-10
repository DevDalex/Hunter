import * as base from './successionArchiveThrough396.js';

export * from './successionArchiveThrough396.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10 narrative · undated Meteor City origin flashback', chapters: '397', subject: 'Sarasa / Chrollo / Uvogin / childhood search group',
    route: 'Second screening nears → Sarasa confirmed missing since previous day → community search mobilizes → heart-shaped pouch, tire tracks, and footprints found → search moves into Uga Forest → Sarasa’s body recovered',
    change: 'The Chapter 396 cliffhanger resolves into confirmed murder. Chrollo leads the search and recovers Sarasa’s body with the group; he reads a killers’ note but refuses to reveal its contents.',
    state: 'Sarasa deceased from Chapter 397 knowledge boundary / killer identities, note text, and exact unseen abduction sequence unresolved', source: wiki('Chapter_397'),
  },
  {
    day: 'Voyage Day 10 narrative · undated Meteor City origin flashback', chapters: '397', subject: 'Sarasa funeral / Renko / Machi',
    route: 'Renko restores Sarasa’s body → church farewell and personal items placed in casket → Machi asks about technique → Renko identifies special ability → Machi perceives aura → Renko gives Kirimori Valley invitation',
    change: 'Renko’s extraordinary embalming is explicitly revealed as a special ability and Machi is shown perceiving aura. Sarasa is mourned and buried after the restoration.',
    state: 'Renko ability existence confirmed with Nen type/mechanics unresolved / Machi aura perception confirmed without full Nen profile or training outcome', source: wiki('Chapter_397'),
  },
  {
    day: 'Voyage Day 10 narrative · undated Meteor City origin flashback', chapters: '397', subject: 'Chrollo / Uvogin / Shalnark / three-year Meteor City plan',
    route: 'Sarasa burial → Chrollo asks for three years and before-fourteen preparation → predicts communication revolution → interprets staged crime and cigarette butts → proposes criminal haven/trap → Shalnark understands and group commits',
    change: 'Chrollo replaces immediate revenge with a long-horizon strategy: gain power, exploit future communications, and use Meteor City’s legal/social void to attract criminals so the group can find Sarasa’s killers.',
    state: 'three-year criminal-attraction strategy proposed / recording theory remains Chrollo inference / network not yet built / Sheila observed walking away with exact motive unresolved', source: wiki('Chapter_397'),
  },
  {
    day: 'Voyage Day 10 narrative · Meteor City origin flashback with years-later coda', chapters: '397', subject: 'Chrollo / Uvogin / future Phantom Troupe founders / Spider',
    route: 'Chrollo vows self-sacrifice and many killings → adopts lifelong villain identity and fear deterrence → asks Uvogin to lead → Uvogin refuses and nominates Chrollo → other seven agree → years-later coda establishes Spider birth',
    change: 'Chapter 397 ends the prior theater-only villain boundary. Chrollo explicitly adopts a criminal program and is nominated as head; the years-later coda establishes the historical Spider/Phantom Troupe organization.',
    state: 'Chrollo historical leadership origin and Spider birth confirmed / exact spoken full-name coinage not reconstructed', source: wiki('Chapter_397'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
