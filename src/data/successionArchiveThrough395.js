import * as base from './successionArchiveThrough394.js';

export * from './successionArchiveThrough394.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 394 · exact time unsupplied', chapters: '395', subject: 'Hinrigh / Heil-Ly standard-cabin access',
    route: 'Hinrigh continues camcorder review → observes impossible ordinary-hallway sequence → considers secret passages → concludes Nen-mediated teleportation/spatial access',
    change: 'The recovered surveillance footage gives Hinrigh enough evidence to conclude that Heil-Ly is using a Nen ability to access its hideout around the standard cabins. The responsible user, exact ability, trigger, range, directionality, and full topology remain unresolved.',
    state: 'Nen-mediated spatial access strongly supported by Hinrigh’s evidence / specific operator and mechanics unresolved', source: wiki('Chapter_395'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '395', subject: 'Hinrigh / Ken’i / Borksen / Tserriednich soldier group',
    route: 'Military confirms sealed empty Heil-Ly office → probable Room 3101 hideout discussed → Troupe breach team assigned → Hinrigh and Ken’i plan live capture of recorded pair',
    change: 'Xi-Yu, Cha-R, and Tserriednich’s soldiers share lower-tier intelligence while keeping separate commands. Borksen says the soldiers cannot safely join the direct pursuit because Heil-Ly knows their faces.',
    state: 'joint information-sharing active / Hinrigh + Ken’i pursuit active / soldier group constrained by identity exposure', source: wiki('Chapter_395'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '395', subject: 'Nobunaga / Phinks / Feitan / Room 3102 / Heil-Ly hidden room',
    route: 'Troupe enters Room 3102 → Phinks selects bathroom as test point → Nobunaga cuts rectangular wall opening → resident forced through first → trio enters hidden room',
    change: 'The Troupe bypasses the dangerous Room 3101 doorway by physically breaching the adjacent Room 3102 bathroom wall. Food and drinks show the hidden room was recently occupied, but the occupants and evacuation route are not identified.',
    state: 'physical Room 3102-to-hidden-room breach confirmed / Nen doorway trigger bypassed, not solved / recent occupants gone', source: wiki('Chapter_395'),
  },
  {
    day: 'Day 10 narrative · origin-flashback transition', chapters: '395', subject: 'Nobunaga / Phinks / Feitan / Luini / Phantom Troupe origins',
    route: 'Troupe analyzes Heil-Ly competence and Luini → Nobunaga proposes scapegoat interpretation → Phinks rejects broad similarity → Nobunaga recalls resignation and anger in the Troupe’s beginning → Meteor City flashback opens',
    change: 'Present-day Heil-Ly analysis becomes the narrative bridge into the Troupe’s childhood. Nobunaga’s Luini-scapegoat claim remains his interpretation, and Chapter 395 does not yet depict the formal Phantom Troupe founding.',
    state: 'origin context opened / Luini-scapegoat theory unconfirmed / formal founding still outside Chapter 395', source: wiki('Chapter_395'),
  },
  {
    day: 'Undated pre-voyage flashback · exact year and ages unsupplied', chapters: '395', subject: 'Meteor City / childhood Chrollo circle / All-Faiths Church',
    route: 'Found tape and Uvogin chase → Chrollo fools Phinks/Feitan → All-Faiths Church child-abduction warning → Power Cleaners discovered → dubbing project organized with Pakunoda, Sheila, Sarasa → three unidentified children shown abducted elsewhere',
    change: 'Chapter 395 establishes a childhood social circle among future Troupe members and provides narrated context for Meteor City’s lack of recognized social status, child-abduction crisis, historical casualties, mafia-linked protection, and later Nen-backed retribution. The flashback does not alter present-day life states, identify the three abducted children, or import later Sarasa/Sheila outcomes.',
    state: 'historical childhood evidence integrated / present-day dead characters not resurrected / formal Troupe founding and Chapter 396+ consequences quarantined', source: wiki('Chapter_395'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
