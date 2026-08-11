import * as base from './successionArchiveThrough406.js';

export * from './successionArchiveThrough406.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary407 = Object.freeze({
  chapter: 407,
  day: 'Voyage Day 12 · 1:00 p.m. Tier 3 anchor → later Tier 2 Heil-Ly negotiation',
  presentDay: true,
  exactTimes: Object.freeze(['1:00 p.m. · five of Tserriednich’s soldier friends gather on Tier 3', 'Borksen’s last contact was roughly thirty minutes earlier', 'No exact later hideout minute supplied']),
  presentationOrderNonLinear: false,
  boundary: 'Chapter 407 continues Halkenburg’s funeral-security period, establishes Borksen as missing to Tserriednich’s soldier friends, confirms that she wakes in the Tier 2 Heil-Ly hideout without revealing the capture method, and has Morena explain the complete parent/child negotiation-game setup before accepting Borksen’s face-down-card selection condition and announcing that play begins.',
  quarantined: Object.freeze([
    'Any backfilled Chapter 407 title or Japanese title',
    'Any confirmation that the soldiers’ proposed crowd-cover, drug, familiar-person, hypnosis-like Nen, or anti-Tserriednich assassination scenarios describe the actual capture',
    'Any identification of Borksen’s abductor, capture ability, Nen user, activation condition, or route not supplied in Chapter 407',
    'Any claim that an earlier Heil-Ly kidnapping plan proves who executed Borksen’s Chapter 407 capture',
    'Any Nen-enforced anti-cheating rule inferred from Morena’s promise not to cheat',
    'Any Chapter 408 Aim answer, Morena ability explanation, Contagion mechanics, Borksen Specialist classification, card outcome, or Special Martial Law interruption',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 12 · 1:00 p.m.', chapters: '407', subject: 'Borksen / Tserriednich soldier friends',
    route: 'last contact before funeral procession → roughly thirty-minute silence → five friends gather on Tier 3 → abduction hypotheses → security superior restores perimeter spacing',
    change: 'Borksen becomes an active missing-person problem for her soldier friends. They consider multiple physical and Nen capture models and a possible Heil-Ly anti-Tserriednich motive, but none is confirmed.',
    state: 'Borksen missing to friends / capture method and motive unknown to them / collective response postponed during security duty', source: wiki('Chapter_407'),
  },
  {
    day: 'Voyage Day 12 · later chapter presentation order', chapters: '407', subject: 'Borksen / Morena / Heil-Ly',
    route: 'Borksen wakes in Tier 2 hideout → Morena requests alliance → Borksen audits six-enemy room and missing weapon → memory gap → unknown-power/Nen inference',
    change: 'The archive resolves Borksen’s broad location and confirms Morena’s recruitment intent while preserving the capture mechanism as unknown.',
    state: 'Borksen awake, unrestrained, disarmed in Tier 2 Heil-Ly hideout / Morena recruitment active / abductor and capture ability unresolved', source: wiki('Chapter_407'),
  },
  {
    day: 'Voyage Day 12 · Tier 2 Heil-Ly hideout', chapters: '407', subject: 'Morena / Borksen negotiation game',
    route: 'time-pressure warning → negotiation game offered → parent/child alternating procedure → five child cards → seven parent cards → no-cheating test → Deal explanation → Borksen selection condition accepted → game begins',
    change: 'Chapter 407 establishes the complete game setup and accepted selection modification but stops before any card is played.',
    state: 'negotiation game accepted and ready / Borksen chooses which face-down child card is selected / Heil-Ly may shuffle / final answer unresolved', source: wiki('Chapter_407'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
