import { succession416TimelineEvents } from './succession416EventPacket.js';

const freeze = (value) => Object.freeze(value);
const source416 = 'https://hunterxhunter.fandom.com/wiki/Chapter_416';
const unique = (values) => [...new Set(values.filter(Boolean))];

export { succession416TimelineEvents };

export const succession416SourcePolicy = freeze({
  reviewedAt: '2026-08-14',
  soleSubstantiveSource: freeze({
    label: 'User-supplied Chapter 416 synopsis',
    basis: 'The synopsis supplied directly in chat is the sole substantive Chapter 416 story source for this modernization.',
    referenceUrl: source416,
  }),
  retainedMetadata: freeze(['Existing maintained Chapter 416 title metadata may be retained without importing additional story claims.']),
  chronologyRule: 'Keep Chapter 416 on Voyage Day 12 after the Special Martial Law declaration, while preserving Tserriednich and Salkov’s explicitly recalled shortly-earlier exchange as an embedded flashback. Do not invent exact clock times.',
  inferenceRule: 'Benjamin’s internal deadline, Camilla’s survival calculation, Benjamin’s counteractive-ability hypotheticals, and Salkov’s deductions about Tserriednich remain speaker-bounded where they are plans, questions, calculations, or inferences rather than independent mechanics.',
  unnamedPeopleRule: 'The second servant killed in Camilla’s room and the unnamed kneeling Room 1004 personnel remain unnamed; do not fabricate canonical character nodes.',
  stoppingPoint: 'Benjamin shoots Tserriednich and the shot sends him across Room 1004’s master bedroom. Tserriednich’s immediate condition, staged-death result, TSK-17 progression, Moswana-curse outcome, and all later developments are unresolved at this boundary.',
  spoilerFirewall: 'Chapter 417+ is quarantined from the strict Chapter 416 packet.',
});

const focus = 'Special Martial Law becomes direct armed confrontation on Tier 1: Benjamin enters Camilla’s residence under a ten-hour incapacitation deadline, survives her gunfire with Ken, kills her servants, is struck by Moswana’s post-mortem Hell Fruit curse, infects Camilla with TSK-17, then breaches Room 1004 and shoots Tserriednich during the latter’s Zetsu-based staged-death plan.';

export const succession416ChapterResearch = freeze([freeze({
  number: 416,
  title: 'Proclamation',
  japaneseTitle: '発令',
  phase: 'Current releases',
  voyageDay: 'Voyage Day 12',
  lanes: freeze([
    'Royal contest',
    'Benjamin emergency campaign',
    'Nen curses and counteractive abilities',
    'Tserriednich training',
    'Justice and military control',
  ]),
  focus,
  events: succession416TimelineEvents,
  prelude: freeze([]),
  locations: freeze([
    'Black Whale · shipwide',
    'Black Whale · Tier 1 · VVIP area',
    'Black Whale · Tier 1 · Camilla residence',
    'Black Whale · Tier 1 · Room 1004 entrance',
    'Black Whale · Tier 1 · Room 1004 living quarters',
    'Black Whale · Tier 1 · Room 1004 master bedroom',
    'Central Ministry of Justice',
  ]),
  characters: freeze([
    'Benjamin Hui Guo Rou', 'Furykov', 'Butch', 'Mozbe', 'Taler',
    'Camilla Hui Guo Rou', 'Fukataki', 'Moswana', 'Tserriednich Hui Guo Rou',
    'Salkov', 'Theta', 'Danjin', 'Kurapika',
  ]),
  threadLabels: freeze(['Benjamin', 'Camilla', 'Moswana', 'Tserriednich', 'Nen development', 'Justice & military', 'Ship operations']),
  confidence: freeze([
    '60 chapter-bounded canonical beats are taken only from the supplied Chapter 416 synopsis.',
    'Benjamin’s ten-hour limit is preserved as his own internal remaining timeline before incapacitation.',
    'Dust in the Wind: Hell Fruit activation and the visible curse strike are confirmed; its final effect on Benjamin is not imported from later chapters.',
    'TSK-17 infection of Camilla is confirmed; disease progression and its interaction with Camilla’s resurrection ability remain unresolved.',
    'Salkov’s conclusion that Zetsu activates Tserriednich’s ability remains an inference at this boundary.',
    'Tserriednich is shot and thrown across the room; his immediate condition and staged-death result remain unresolved.',
    'Chapter 417+ information is excluded.',
  ]),
  status: 'Strict maintained Chapter 416 packet: 60 chapter-bounded beats, Moswana Hell Fruit curse strike, Camilla TSK-17 infection, Room 1004 breach, Tserriednich shooting cliff-edge, and Chapter 417+ spoiler firewall',
  coverage: freeze({ identity: true, publication: false, summary: true, sceneSummary: true, chronology: true, appearances: true, locations: true, relationships: true, assignments: true, nen: true, source: true }),
  lastReviewed: 'August 14, 2026',
  releaseDate: null,
  titleStatus: 'retained-existing-metadata',
  officialReaderUrl: null,
  source: source416,
  crossChecks: freeze([succession416SourcePolicy.soleSubstantiveSource]),
})]);

export const succession416ChapterFocus = freeze({ 416: focus });

export const succession416NenFindings = freeze([
  freeze({ subject: 'Benjamin · Ken', finding: 'Camilla’s bullets visibly bounce off Benjamin while he is using Ken.', status: 'confirmed', source: source416 }),
  freeze({ subject: 'Dust in the Wind: Hell Fruit', finding: 'Moswana’s death activates a post-mortem curse manifested as a ghostly hand that strikes Benjamin and produces visible darkening and face-like pupil marks.', status: 'confirmed activation / final outcome unresolved', source: source416 }),
  freeze({ subject: 'Camilla counteractive resurrection ability', finding: 'Benjamin explicitly avoids killing Camilla and probes whether death by disease would provide a valid killer/aura source. The disease interaction is not resolved.', status: 'known ability / Chapter 416 interaction unresolved', source: source416 }),
  freeze({ subject: 'TSK-17', finding: 'Benjamin silently infects Camilla with TSK-17.', status: 'infection confirmed / progression unresolved', source: source416 }),
  freeze({ subject: 'Tserriednich · Zetsu-linked ability', finding: 'Tserriednich maintains flawless Zetsu; Salkov infers Zetsu is the activation trigger and suspects the ability is already active.', status: 'Salkov inference / not promoted to omniscient mechanics', source: source416 }),
]);

export const succession416Mysteries = freeze([
  freeze({ question: 'What final effect will Moswana’s curse have on Benjamin?', evidence: 'Hell Fruit visibly strikes Benjamin and Camilla declares the curse complete, but Chapter 416 ends while Benjamin remains operational.', status: 'open', lastChapter: '416', source: source416 }),
  freeze({ question: 'How will TSK-17 interact with Camilla’s counteractive resurrection ability?', evidence: 'Benjamin infects Camilla only after probing who would count as her killer and what aura source could resurrect her.', status: 'open', lastChapter: '416', source: source416 }),
  freeze({ question: 'What is Tserriednich’s immediate condition after Benjamin shoots him?', evidence: 'The shot sends Tserriednich across the master bedroom and the synopsis stops there.', status: 'open', lastChapter: '416', source: source416 }),
  freeze({ question: 'Does Tserriednich’s staged-death plan succeed?', evidence: 'Tserriednich instructed Salkov to secure his body, report what he saw, and conceal the ability before Benjamin’s breach; no result is shown.', status: 'open', lastChapter: '416', source: source416 }),
]);

export const succession416ResolvedQuestions = freeze([
  freeze({ question: 'Does Moswana activate her prepared curse on Benjamin?', answer: 'Yes. She dies in Benjamin’s presence and Dust in the Wind: Hell Fruit strikes him.', chapter: 416, source: source416 }),
  freeze({ question: 'Does Benjamin directly kill Camilla in their confrontation?', answer: 'No. He explicitly avoids triggering her death-counter and instead infects her with TSK-17.', chapter: 416, source: source416 }),
  freeze({ question: 'Does Benjamin breach Room 1004?', answer: 'Yes. He kicks in the locked door and enters with Furykov and Butch.', chapter: 416, source: source416 }),
  freeze({ question: 'Does Benjamin shoot Tserriednich?', answer: 'Yes. He fires before Tserriednich can finish proposing a spar.', chapter: 416, source: source416 }),
]);

// Compatibility for the older dossier base. The active Through416 dossier and
// canonical graph remain authoritative; this keeps the frozen legacy base loadable.
export const patchSuccession416PrinceDossier = (record) => {
  if (record.order === 1) return freeze({
    ...record,
    room: 'Tier 1 · Camilla residence → Room 1004 assault route',
    strategy: 'Uses Special Martial Law to personally confront rival princes under a self-stated ten-hour deadline, while applying military force, Ken, disease strategy, and direct assault.',
    pressure: freeze(unique([...(record.pressure || []), 'Ten hours remaining before incapacitation', 'Moswana’s activated Hell Fruit curse', 'Need to finish the succession contest before the deadline'])),
    statusDetail: 'Visibly cursed by Hell Fruit, still operational after infecting Camilla and shooting Tserriednich; final curse and deadline outcomes remain unresolved.',
    source: source416,
  });
  if (record.order === 2) return freeze({
    ...record,
    room: 'Tier 1 · Camilla residence',
    status: 'alive; infected with TSK-17',
    strategy: 'Relies on Cat’s Name as a direct-killing deterrent and Moswana’s curse operation while facing an unresolved disease/indirect-killer interaction.',
    pressure: freeze(unique([...(record.pressure || []), 'TSK-17 infection', 'Unresolved Cat’s Name disease interaction', 'Benjamin’s active martial-law assault'])),
    statusDetail: 'Alive after Hell Fruit strikes Benjamin, but silently infected with TSK-17; later disease/counter outcome remains unresolved.',
    source: source416,
  });
  if (record.order === 4) return freeze({
    ...record,
    room: 'Tier 1 · Room 1004 master bedroom',
    status: 'shot; immediate condition unresolved',
    strategy: 'Maintains Zetsu and prepares a staged-death contingency, ordering Salkov to secure his body unseen, report exactly what he witnesses, and conceal the ability.',
    pressure: freeze(unique([...(record.pressure || []), 'Benjamin’s armed Room 1004 breach', 'Unfinished Zetsu-linked technique', 'Gunshot from Benjamin'])),
    statusDetail: 'Shot by Benjamin and blasted across the room while in Zetsu; Chapter 416 ends before condition or staged-death result is known.',
    source: source416,
  });
  return record;
};
