import * as base from './successionArchiveThrough378.js';

export * from './successionArchiveThrough378.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Day 4 (inferred continuity)',
    chapters: '379',
    subject: 'Cashew / Luini / Mizaistom',
    route: 'Tier 3 massacre witness interview → planted Heil-Ly disinformation operation',
    change: 'Cashew is revealed as a Heil-Ly accomplice who mixes truth and lies in her testimony to Mizaistom. At Luini’s request she preserves identifying details such as his crescent scar and clues toward his transportation ability so Heil-Ly can measure the investigators’ response.',
    state: 'Tier 3 investigation compromised by a planted witness / Mizaistom has not yet exposed the deception',
    source: wiki('Chapter_379'),
  },
  {
    day: 'Day 4 (inferred continuity)',
    chapters: '379',
    subject: 'Luini / Cha-R spatial route',
    route: 'Sealed one-door origin room → marked destinations → Cha-R hideout infiltration',
    change: 'Luini’s unnamed transportation ability is shown to require a sealed room with exactly one door. He can travel to marked locations and return while that door remains closed; opening it breaks the sealed condition and resets the setup. He kills three more Cha-R guards, reaches level 24, and uses a guard’s body to infiltrate and mark the Cha-R hideout.',
    state: 'Luini level 24 / core transport rules confirmed / Cha-R hideout route penetrated',
    source: wiki('Chapter_379'),
  },
  {
    day: 'Day 4 (inferred continuity)',
    chapters: '379',
    subject: 'Franklin / Hisoka',
    route: 'Tier 5 central dining hall → passive Hisoka interception strategy',
    change: 'Franklin declines to actively search for Hisoka and instead waits on Tier 5 for Hisoka to reveal himself, while reaffirming that killing Hisoka remains the Troupe’s top priority over ordinary theft.',
    state: 'Franklin holds Tier 5 / Hisoka still unfound / passive interception active',
    source: wiki('Chapter_379'),
  },
  {
    day: 'Day 4 (inferred continuity)',
    chapters: '379',
    subject: 'Cha-R / Phantom Troupe',
    route: 'Warehouse suspicion → clearance → tactical alliance proposal',
    change: 'Ken’i Wang initially confronts Nobunaga, Phinks, and Feitan over the warehouse killings. After new information clears them and Phinks analyzes the spatial infiltration, Wang proposes cooperation against the immediate threat while privately deciding the Phantom Troupe is dangerous enough to be crushed later.',
    state: 'Tactical cooperation proposed / immediate blame removed / strategic hostility remains concealed',
    source: wiki('Chapter_379'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
