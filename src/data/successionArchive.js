import * as base from './successionArchiveThrough387.js';

export * from './successionArchiveThrough387.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 9', chapters: '388', subject: 'Kurapika / Bill / Room 1014 students',
    route: 'Private Water Divination sequence → Ladiolus exits awakened → Bill growth demonstration → Maor and Yuri semi-coercive awakening',
    change: 'Kurapika’s class demonstrates Bill’s unnamed Enhancement growth ability and uses the borrowed ability through the Stealth Dolphin lending system. The supplied Chapter 388 text and note identify Ladiolus, Maor, Yuri, and Satobi as the four students awakened that day.',
    state: 'Accelerated Nen-awakening procedure operational / individual Nen types withheld by gag order', source: wiki('Chapter_388'),
  },
  {
    day: 'Day 9', chapters: '388', subject: 'Bill / Kurapika / Woble camp',
    route: 'Class pause → Bill explains Beyond deployment and voluntary Woble assignment → resolve reaffirmed',
    change: 'Bill distinguishes being stationed aboard the ship by Beyond from his own decision to guard Woble. He explains that Vincent’s attack and Kurapika’s exchanges with Oito changed his urge to flee into resolve to stay.',
    state: 'Bill remains committed to Woble’s protection despite acknowledging fear', source: wiki('Chapter_388'),
  },
  {
    day: 'Day 9 · after Room 1014 class sequence', chapters: '388', subject: 'Tubeppa / Maor / Longhi',
    route: 'Class report → Woble/Zhang Lei alignment report → Tubeppa authorizes continued alliance negotiation and more Nen students',
    change: 'Tubeppa accepts that Kurapika’s training works, instructs Maor and Longhi to continue negotiating with Woble’s camp, and allows additional guards to attend future classes.',
    state: 'Alliance negotiation posture advances / later formal terms are not backdated', source: wiki('Chapter_388'),
  },
  {
    day: 'Day 9 · after Room 1014 class sequence', chapters: '388', subject: 'Rihan / Balsamilco / Tubeppa / Halkenburg',
    route: 'Tubeppa beast remains unseen → Rihan weighs targets → Kurapika and Halkenburg threat assessments continue',
    change: 'Rihan remains uncertain whether to persist against Tubeppa or redirect attention, while Balsamilco avoids giving advice that would weaken Predator. Their conclusions about Kurapika’s possible ability count and Shikaku’s suicide mechanism remain hypotheses.',
    state: 'Predator targeting unresolved / Tubeppa beast still unseen / Halkenburg remains a major threat', source: wiki('Chapter_388'),
  },
  {
    day: 'Day 10 · 11:30 a.m.', chapters: '388', subject: 'Kurapika / Bill / Oito',
    route: 'Room 1014 → fourth recurring aura rumbling felt',
    change: 'At 11:30 a.m. on Voyage Day 10, Kurapika, Bill, and Oito feel the fourth aura rumbling. The intervals between occurrences are becoming shorter.',
    state: 'Fourth recurrence confirmed / immediate target and complete trigger unresolved', source: wiki('Chapter_388'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
