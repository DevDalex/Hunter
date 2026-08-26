import * as base from './successionArchiveThrough397.js';

export * from './successionArchiveThrough397.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 10', chapters: '398', subject: 'Feitan / Phinks / Nobunaga / unnamed Mafia hostages / Heil-Ly front-door trap',
    route: 'Bathroom-side bypass tested → first hostage enters safely from bypass → exits front → forced to re-enter → teleported → second hostage forced through → teleported',
    change: 'The Troupe empirically isolates the tested front doorway as the observed inward teleport trigger and demonstrates repeated activation. Gateaume’s double is not visibly present for the tested activations.',
    state: 'repeatable front-door teleport behavior confirmed / trap user, official name, exact Nen category, setup, full capacity, and specific land-mine classification unresolved', source: wiki('Chapter_398'),
  },
  {
    day: 'Voyage Day 10', chapters: '398', subject: 'Ken’i / Hinrigh / Phantom Troupe',
    route: 'Ken’i interrupts blind entry → introduces Hinrigh → shared anti-Heil-Ly proposal → Hinrigh reveals transmitter plan → Biohazard transmitter becomes oyster → Hinrigh swallows it → Phinks receives receiver',
    change: 'Temporary Mafia/Troupe cooperation becomes operational around Hinrigh’s tracking plan. Biohazard gains a use-specific transmitter concealment/reversion/duration application and the paired receiver’s one-kilometer rough-direction behavior is documented.',
    state: 'Hinrigh becomes live decoy / Phinks and Feitan remain outside with receiver / permanent alliance not established', source: wiki('Chapter_398'),
  },
  {
    day: 'Voyage Day 10', chapters: '398', subject: 'Hinrigh / Nobunaga / Heil-Ly hideout',
    route: 'Hinrigh enters teleport trap → arrives in concealed hideout → Nobunaga follows → pair chooses to move → Nobunaga tests wall → cuts self-restore → side-room sweep → shower/bathroom/three toilets → laundry-filled room',
    change: 'Hinrigh and Nobunaga establish a temporary field partnership inside the concealed Heil-Ly interior. The wall is directly observed restoring katana damage under Nen protection, and the pair add local facility observations without solving the full hideout topology.',
    state: 'Hinrigh and Nobunaga inside hideout at laundry-room endpoint / self-restoring stage operator and Nen category unresolved / Morena’s smile does not prove personal control', source: wiki('Chapter_398'),
  },
  {
    day: 'Voyage Day 10', chapters: '398', subject: 'Prepared Nen trap knowledge',
    route: 'No visible support objects → barrier-type vs land-mine-type exposition → Nobunaga applies land-mine hypothesis → Phinks proposes user proximity to entry/exit and likely destination',
    change: 'Chapter 398 adds a general prepared-trap distinction to the Nen system record while preserving the Troupe’s application of those rules to the Heil-Ly room as analysis rather than confirmed case classification.',
    state: 'barrier/land-mine distinction documented / this specific trap’s type, user location, and relationship to Gateaume unresolved', source: wiki('Chapter_398'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
