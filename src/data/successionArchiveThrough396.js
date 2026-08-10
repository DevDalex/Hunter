import * as base from './successionArchiveThrough395.js';

export * from './successionArchiveThrough395.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10 narrative · undated Meteor City childhood flashback', chapters: '396', subject: 'Chrollo / Pakunoda / Sheila / Sarasa / Power Cleaners screening',
    route: 'Church screening begins → dubbed voices win over audience → sound tape tangles → Chrollo shifts to live performance → four-person team completes Clean Sweep finale',
    change: 'The children turn the Power Cleaners dub into a successful live performance after the tape failure. Chrollo demonstrates distinct hero, monster, and villain voices while Pakunoda, Sheila, and Sarasa stay synchronized with him.',
    state: 'childhood performance success confirmed / Chrollo villain work remains stage acting rather than criminal ideology', source: wiki('Chapter_396'),
  },
  {
    day: 'Voyage Day 10 narrative · undated Meteor City childhood flashback', chapters: '396', subject: 'Chrollo / Uvogin / wider childhood performance circle',
    route: 'Sarasa defuses expected confrontation → Uvogin praises Chrollo and joins cast → Nobunaga/Feitan/Phinks/Shalnark/Franklin claim roles → Machi conditionally joins as villain → scripts and props expand',
    change: 'Uvogin’s reaction converts the earlier tape conflict into a creative partnership, and the performance project expands from four dub performers into a larger childhood ensemble.',
    state: 'expanded performance collaboration confirmed / later Phantom Troupe command and membership structure not backfilled', source: wiki('Chapter_396'),
  },
  {
    day: 'Voyage Day 10 narrative · undated Meteor City childhood flashback', chapters: '396', subject: 'Childhood group / troupe naming / Uvogin ambition',
    route: 'Theater-company discussion → traveling-performer framing → Pakunoda proposes “troupe” → group accepts incomplete label → original-play idea postponed → Uvogin declares world-tour villain goal with Chrollo',
    change: 'The children begin describing the performance group as a troupe, but Chapter 396 explicitly leaves the word placed before “troupe” unresolved. Uvogin’s “world’s greatest villain” goal is expressed inside the acting project.',
    state: 'performance-troupe concept established / full Phantom Troupe name, Spider structure, criminal program, and founding vow still unresolved', source: wiki('Chapter_396'),
  },
  {
    day: 'Voyage Day 10 narrative · undated Meteor City childhood flashback', chapters: '396', subject: 'Sarasa / Uga Forest tape search / child abductors',
    route: 'Sarasa leaves for sorting duty → walks alone toward corporate dump near Uga Forest → plans to identify Power Cleaners title → kidnappers discuss increasing vigilance and completed quota → one suggests taking one more child',
    change: 'Sarasa separates from the group while trying to find more tapes. The chapter juxtaposes her trip with the active child-abduction threat but does not depict an encounter, capture, injury, death, or explicit selection of Sarasa by the kidnappers.',
    state: 'Sarasa alive and unharmed in depicted Chapter 396 story-time / cliffhanger threat active / Chapter 397 consequences quarantined', source: wiki('Chapter_396'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
