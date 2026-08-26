import * as base from './successionArchiveThrough393.js';

export * from './successionArchiveThrough393.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 393 · exact time unsupplied', chapters: '394', subject: 'Gateaume / Hinrigh / Ken’i / Tassi / Room 3101',
    route: 'Hinrigh blood-tests Gateaume’s displayed body → Gateaume disappears → Tassi enters Room 3101 → Tassi disappears → Ken’i confirms Luini is already dead and repeats the Troupe’s anti-Heil-Ly declaration',
    change: 'Gateaume’s old-man presentation is exposed as a bloodless false/remote body and Room 3101 is shown to remain an active transfer point despite Luini’s death. Tassi disappears after entering while Hinrigh avoids assuming Luini is still responsible.',
    state: 'Room 3101 confirmed active inside Heil-Ly operations / Gateaume real body and mechanism unresolved / Tassi transferred away from observers', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Tassi / Bille / Matvere / Gelato / Contagion',
    route: 'Tassi appears inside Heil-Ly route network → Bille stabs Tassi in neck → Bille reaches level 21 → Water Divination → Bille Conjurer / Matvere Transmuter disclosed',
    change: 'Tassi is killed by Bille. Bille reaches level 21 and Water Divination identifies him as a Conjurer. Matvere states that his own natural type is Transmuter.',
    state: 'Tassi dead / Bille level 21 Conjurer / Matvere level 21 Transmuter / Bille personal developed ability not supplied', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Terebellum / Voconte / Chiffon Toto / Montblanc Toto',
    route: 'Terebellum delivers Tassi corpse → reports Voconte direct connection → Chiffon removes clothes → Montblanc prepares dismemberment',
    change: 'Heil-Ly’s corpse-processing workflow and member profiles become explicit. Voconte’s door ability gains a reported direct room-to-processing connection use, while its complete rules remain unresolved.',
    state: 'processing workflow active / Voconte direct connection reported / Terebellum level 21 Emitter / Chiffon level 6 Conjurer / Montblanc level 3 Conjurer', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Morena / Tserriednich / Sodom / Dogman / Orarge / Yokotani',
    route: 'VVIP liaison goes quiet → Morena expects discovery → soldier capture proposed → Contagion tracking plan → Room 3101 abandoned → Door C guard shifts assigned',
    change: 'Morena treats Tserriednich as an imminent counterintelligence threat, plans to capture and infect one of his soldiers to track his movements, abandons Room 3101 as a usable access route, shifts traffic to Door C, and assigns Sodom/Dogman plus Orarge/Yokotani to new operational roles.',
    state: 'anti-Tserriednich capture/tracking plan active / Room 3101 compromised / Door C replacement access active / exact Tserriednich response unresolved', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Notre / Soufflé / Room 3131 / Heil-Ly internal route',
    route: 'Morena orders Room 3131 check → Notre explains return via disposal/laundry → processing/shower → living room',
    change: 'Notre reports a concrete Room 3131/disposal/processing/living-room sequence used within Heil-Ly’s hidden logistics. The sequence is preserved without inventing the omitted transition mechanics or assigning every link to Voconte.',
    state: 'Room 3131 route sequence documented / full spatial topology unresolved', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Dogman / Morena / Contagion progression',
    route: 'Morena gives Dogman priority mission → Dogman says he needs levels → Morena sends him to new processing area to exceed level 50',
    change: 'Dogman is disclosed as a level 36 Enhancer and is ordered to level past 50 before carrying out Morena’s most important search mission.',
    state: 'Dogman leveling objective >50 active / exact search target not named in supplied synopsis', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Hinrigh / Biohazard surveillance',
    route: 'Hinrigh returns to fountain → recovers cat → cat reverts to camcorder → footage reviewed',
    change: 'Hinrigh recovers the object transformed for surveillance, returns it to camcorder form, and reviews the recording.',
    state: 'Biohazard surveillance/reversion confirmed / no new maximum duration or remote-control rule supplied', source: wiki('Chapter_394'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '394', subject: 'Gipper / Otocin / Momolly / Borksen / Tserriednich soldiers',
    route: 'Tier 3 Heil-Ly office raid → old body found → cover story planned → Nen concern raised → Borksen transfer requested → institutional-war scenarios / transfer-warning plan → Borksen confirms Theta is teaching Tserriednich Nen → Morena-avoidance and capture contingency',
    change: 'Tserriednich’s soldier circle becomes an active lower-tier intelligence lane. Gipper prioritizes Morena’s capture while the group assesses legal and institutional escalation. Otocin introduces Nen as a threat, Borksen confirms Tserriednich’s classified training under Theta without knowing the mechanics herself, and the group recognizes that Morena may already have their identities.',
    state: 'Tier 3 soldier search active / Borksen limited Nen intelligence integrated / predicted eradication war remains scenario analysis / survival-first contact with Xi-Yu or Cha-R proposed', source: wiki('Chapter_394'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
