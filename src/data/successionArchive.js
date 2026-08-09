import * as base from './successionArchiveThrough385.js';

export * from './successionArchiveThrough385.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Theta / Salkov / Tserriednich',
    route: 'Chapter 385 apparent corpse site → luminol forensic check → no blood detected',
    change: 'Salkov tests the location where Theta remembers Tserriednich’s shot body lying and finds no blood with luminol. Theta therefore reopens her assumptions about how much of the apparent assassination scene was physically real.',
    state: 'Bloodless apparent-death evidence added / complete temporal mechanism still unresolved',
    source: wiki('Chapter_386'),
  },
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Melody / Kaiser / Fugetsu / Kacho-form Without You / Keeney',
    route: 'Tier 2 Justice Bureau questioning → Keeney sole-responsibility note → forced-escape account → continued protective delay',
    change: 'Kaiser tells Melody that Keeney left a suicide note claiming sole responsibility and that the two girls say Keeney forced them onto the lifeboat. Kaiser cannot prove or disprove whether they were forced, so questioning continues. Melody interprets the prolonged Tier 2 Justice stay as protection from princes seeking private meetings.',
    state: 'Justice investigation unresolved / Melody gains planning time / biological Kacho remains deceased and the Kacho-form participant is Without You',
    source: wiki('Chapter_386'),
  },
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Halkenburg / Sumidori / Shikaku',
    route: 'First possession-arrow aftermath → four consciousness models → lethal follow-up experiment prepared',
    change: 'Halkenburg’s group treats Sumidori as the consciousness controlling Shikaku’s body while Sumidori’s original body sleeps under monitoring. Halkenburg explicitly lists four possible states for Shikaku’s original consciousness and says he needs Nen expertise before deciding which model is correct.',
    state: 'Consciousness topology narrowed to four candidate models / none confirmed',
    source: wiki('Chapter_386'),
  },
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Sumidori / Shikaku / Halkenburg / Benjamin / Balsamilco',
    route: 'Shikaku body outside Luzurus quarters → self-inflicted gunshot → Benjamin threat reprioritization → Sumidori original-body wakeup',
    change: 'The consciousness treated as Sumidori makes Shikaku’s body shoot itself through the head outside Luzurus’s quarters. Benjamin and Balsamilco elevate Halkenburg to their greatest immediate threat. Sumidori’s original body then wakes in Halkenburg’s room and Halkenburg begins an identity check by asking for post and service number.',
    state: 'Shikaku body deceased / Shikaku consciousness unresolved / Sumidori original body awake / awakened identity not yet confirmed',
    source: wiki('Chapter_386'),
  },
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Kurapika / Bill / Room 1014 Nen class',
    route: 'Distant aura rumbling → Water Divination introduction → private Nen-type testing terms',
    change: 'Kurapika introduces Water Divination, identifies his demonstration to the class as a Specialist result, selects Ladiolus to motivate the students, and explains that privately learned Nen types are payment for the class and compensation for the risk he accepts while prolonging the succession stalemate.',
    state: 'Nen class advances into type identification / information-exchange terms made explicit',
    source: wiki('Chapter_386'),
  },
  {
    day: 'Day 9',
    chapters: '386',
    subject: 'Tserriednich / Salkov',
    route: 'Four Major Principles practice → faster Zetsu response training → sub-second sparring threshold',
    change: 'Tserriednich tells Salkov that he is training to shorten the response time needed to enter Zetsu and plans to spar once he can do it in less than one second.',
    state: 'Sub-second Zetsu remains a stated training target / not yet an achieved Chapter 386 feat',
    source: wiki('Chapter_386'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
