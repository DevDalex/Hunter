import * as base from './successionArchiveThrough398.js';

export * from './successionArchiveThrough398.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10', chapters: '399', subject: 'Hinrigh / Nobunaga / Terebellum / nine-member Heil-Ly gathering',
    route: 'Laundry-room uncertainty → unlocked main door → nine Heil-Ly members → Hinrigh throws knife → Terebellum displaces damage → Nobunaga probes Yokotani',
    change: 'Direct contact with the hidden-base defenders reveals Terebellum’s Damage: “Sweet Home” as an Emission ability with right-hand damage intake, left-hand onward transfer, self-cost if untransferred, and demonstrated attacking-blade displacement. The identities of three of the nine visible members remain unsupplied.',
    state: 'Sweet Home formally revealed / Terebellum alive in defended room / broader capacity, range, delay and aura cost unresolved', source: wiki('Chapter_399'),
  },
  {
    day: 'Voyage Day 10', chapters: '399', subject: 'Yokotani / LSDF / Morena hideout condition / Nobunaga',
    route: 'Yokotani identifies himself and crimes → seven LSDF guards appear at alert 4 → Nobunaga attacks → maximum alert → guards restrain/confiscate katana → expulsion',
    change: 'A Battle of Wits: “LSDF” is revealed as a Conjuration ability usable only at the hideout where Morena is located and conditioned on Yokotani identifying a law-breaking intruder. Guard level scales with crime severity; the guards cannot harm the criminal and the criminal’s attacks are ineffective against them under the conditions.',
    state: 'Nobunaga expelled alive toward Room 3101 / Morena somewhere in qualifying hideout complex / exact Morena room, full LSDF scale and relationship to teleport route unresolved', source: wiki('Chapter_399'),
  },
  {
    day: 'Voyage Day 10', chapters: '399', subject: 'Hinrigh / Biohazard transmitter / Room 3101 return',
    route: 'LSDF pursuit → laundry room → Hinrigh vomits still-transformed oyster → hides it under cabinet → Hinrigh returns to Room 3101 → reports Biohazard unavailable for rest of day and knives exhausted',
    change: 'Hinrigh successfully leaves the tracking transmitter inside the hideout and returns alive. Chapter 399 adds a current rest-of-day Biohazard availability limit without supplying a universal use quota, exact aura threshold, cooldown equation, or reset rule.',
    state: 'transmitter remains hidden and transformed at chapter endpoint / Hinrigh and Nobunaga back in Room 3101 / Biohazard unavailable to Hinrigh for remainder of day', source: wiki('Chapter_399'),
  },
  {
    day: 'Voyage Day 10', chapters: '399', subject: 'Room 3101 route / Xi-Yu–Troupe follow-up search',
    route: 'Nobunaga analyzes inbound/outbound teleport result → proposes unobserved member-only jump point → Hinrigh plans floor-map/descriptions/witnesses/Xi-Yu intelligence → Troupe takes transmitter search → oyster beeps beneath cabinet',
    change: 'The demonstrated route is now operationally understood as both trap and secret passage between Room 3101-side access and the concealed hideout. Xi-Yu and the Troupe divide follow-up search work. The proposed Heil-Ly-member-only jump point, route operator, “organ” role, and Morena’s complete capabilities remain unresolved.',
    state: 'follow-up search plan active / no later search result imported / transmitter still live inside hideout', source: wiki('Chapter_399'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
