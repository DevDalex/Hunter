import * as base from './successionArchiveThrough390.js';

export * from './successionArchiveThrough390.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 10 · direct continuation from Chapter 390 · exact time unsupplied', chapters: '391', subject: 'Hinrigh / Lynch / Zakuro / Hisoka search',
    route: 'Tier 3 soldier-killing aftermath → Lynch and Zakuro continue Hisoka search → contact-Hinrigh-before-action protocol → Bloody Mary blood-drop search',
    change: 'Hinrigh splits from Lynch and Zakuro to trace Heil-Ly while they continue searching for Hisoka. Zakuro deploys numerous blood drops and states that the demonstrated search drops will run out of Nen after roughly 30 to 40 minutes before returning to ordinary blood.',
    state: 'Hisoka search active / Bloody Mary search function and 30–40 minute lifetime confirmed / range and sensory mechanics unresolved', source: wiki('Chapter_391'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '391', subject: 'Hinrigh / Heil-Ly surveillance',
    route: 'civilian camera-footage review → standard-cabin access hallway identified → camcorder confiscated → Biohazard camcorder-cat surveillance',
    change: 'Hinrigh concludes Heil-Ly is watching the standard-cabin hallway, says the group aims to identify all 23 members, and transforms a recording camcorder into a small surveillance cat. Chapter 391 formally names the ability Biohazard.',
    state: 'access-route watch inferred by Hinrigh / Biohazard formal name and surveillance application confirmed / rebellion and killing-as-training model remains Hinrigh hypothesis', source: wiki('Chapter_391'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '391', subject: 'Tevelares / Quorolle / Padaille / Contagion',
    route: 'three Heil-Ly members identify Hinrigh → debate attack and five-meter En → discuss Nen-user kill reward → member profiles disclosed',
    change: 'Tevelares is revealed as a level 24 Enhancer civil engineer, Quorolle as a level 22 Emitter repairman, and Padaille as a level 29 Conjurer demolition worker. Their discussion explicitly treats killing a Nen user as worth ten levels.',
    state: 'three Heil-Ly profiles and +10 Nen-user value confirmed / multi-attacker reward allocation unresolved / Quorolle’s continuous Morena-monitoring idea remains speculation', source: wiki('Chapter_391'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '391', subject: 'Hinrigh / Padaille',
    route: 'Padaille hammer attack → Biohazard handcuff-pigeon restraint → handgun fire fails against aura-reinforced pigeons → Padaille drill escape → second restraint',
    change: 'Padaille demonstrates Fistful of Weapons with hammer and drill forms. Hinrigh demonstrates Biohazard handcuff-pigeons that revert to restraints and are stated to be aura-reinforced; Padaille’s drill pierces Hinrigh’s left hand before Hinrigh restrains him again.',
    state: 'Fistful of Weapons and expanded Biohazard combat mechanics confirmed / full limits unresolved', source: wiki('Chapter_391'),
  },
  {
    day: 'Day 10 · exact time unsupplied', chapters: '391', subject: 'Padaille / Hinrigh / Tevelares / Quorolle / Misha',
    route: 'Padaille axe-form escape attempt → Hinrigh turns axe against Padaille → Padaille killed → Tevelares and Quorolle flee → survivors decide to seek Morena instructions',
    change: 'Hinrigh forces Padaille’s axe-form hand into the back of his head, killing him. Tevelares and Quorolle escape rather than risk torture over the hideout and decide to ask Morena for instructions. Hinrigh says he is counting on Misha, but the supplied synopsis does not define her task.',
    state: 'Padaille body death confirmed / Tevelares and Quorolle retreat / Misha role unresolved', source: wiki('Chapter_391'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
