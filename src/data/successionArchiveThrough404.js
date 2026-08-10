import * as base from './successionArchiveThrough403.js';

export * from './successionArchiveThrough403.js';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const publicationBoundary404 = Object.freeze({
  chapter: 404,
  day: 'Voyage Days 11–12',
  presentDay: true,
  exactTimes: Object.freeze(['daily 1:00 p.m. coin production', 'Thursday 9:00 a.m. class scheduled', 'Thursday 12:00 p.m. funeral movement scheduled']),
  presentationOrderNonLinear: false,
  boundary: 'Chapter 404 directly demonstrates a holder-linked Guardian Coin reverse-design change and a 10→1 transfer that does not numerically reset on return, explains Grimmel the Dissonance as a random-participant forced mind swap with one-awake/body-death priority rules, kills Halkenburg’s original body while preserving his immediate control of Balsamilco’s living body, advances Tserriednich below 3.5 seconds, shows Kacho-form beginning to fade, and schedules—but does not begin—the second Nen class and funeral procession.',
  quarantined: Object.freeze([
    'Any Chapter 405+ funeral departure, route movement, crowd operation, wake-priority change, or Halkenburg next move',
    'Any complete Guardian Coin ownership, reset, multiplier, threshold, granted-power, or loyalty rule',
    'Any claim that cumulative Conjuration or pseudo-coercive Manipulation is a confirmed coin category',
    'Any unshown Coventoba first-day coin test or outcome for Kurapika’s newly received coin',
    'Any Cheadle test result, TSK-17 dose, delivery route, or exact administration moment not supplied in the synopsis',
    'Any claim that Balsamilco wakes or regains control, or that the estimated ten-hour window completes',
    'Any more precise Tserriednich timer than below 3.5 seconds or a new Parallel Future activation',
    'Any resolved cause or completed endpoint for Kacho-form’s fading',
    'Sarahell entering Room 1014 or activating a curse',
    'Special Martial Law becoming active',
  ]),
});

export const personnelTransitions = [
  ...base.personnelTransitions,
  {
    day: 'Voyage Day 11 · after 1:00 p.m.', chapters: '404', subject: 'Zhang Lei / Kurapika / Tenftory / Coventoba',
    route: 'Room 1003 retained/distributed comparison → 10 coin transferred to Kurapika → holder design and number change → returned coin stays 1 → new daily coin given to Kurapika',
    change: 'The chapter confirms a holder-linked reverse design and demonstrates that the transferred 10 coin becomes 1 in Kurapika’s hand. Its reverse returns when Zhang Lei retakes it, but its number remains 1. Kurapika’s cumulative Conjuration, aura-node, threshold, and loyalty interpretations remain hypotheses.',
    state: 'holder transformation confirmed / complete coin system unresolved / Coventoba hidden coin unshown', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 11 · exact time unsupplied', chapters: '404', subject: 'Kurapika / Zhang Lei / Woble / mafia families',
    route: 'unequal safety-for-information bargain → mafia-benefactor balance → false-flag and Special Martial Law risk → Room 1003 versus Room 1014 dilemma',
    change: 'Kurapika recognizes that Zhang Lei remains useful but does not treat him as an equal. He models mafia escalation, prince assassination, false-flag violence, Woble exposure, and martial-law exploitation as risks only; none occurs in Chapter 404.',
    state: 'conditional cooperation active / political scenarios forecast only / Special Martial Law inactive', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 11 · medical decline', chapters: '404', subject: 'Halkenburg / Balsamilco / Cheadle / Leorio / Benjamin',
    route: 'Tier 3 emergency intake → CHEM-7/CT/history/vomitus orders → Balsamilco-body phone report → royal/military medical takeover',
    change: 'Cheadle’s team initially treats Halkenburg and orders diagnostic/forensic work, but royal and military teams displace it. No test result, diagnosis, exact TSK-17 dose, delivery route, or administration moment is supplied.',
    state: 'Association medical access removed / fatal decline continues / medical specifics unresolved', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 11 · operator explanation', chapters: '404', subject: 'Halkenburg / Balsamilco / Shikaku / Sumidori / Vict',
    route: 'Shikaku–Sumidori result → random contributor forced swap → one-awake priority → Vict body-death case → sleeping-pill and ten-hour plan',
    change: 'Halkenburg directly explains the random participant selection and one-awake-at-a-time system. The two experiment cases establish different body-death priority outcomes, but no formal Nen category or controllable participant-selection rule is added.',
    state: 'core forced-swap topology confirmed / universal edge cases and formal category unresolved / ten-hour window remains a plan', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 11 · evening preparation', chapters: '404', subject: 'Tserriednich / Salkov / Fugetsu / Kacho-form / Room 1014',
    route: 'Room 1004 below-3.5-second Zetsu checkpoint → Kacho-form begins fading beside sleeping Fugetsu → Thursday 9:00 a.m. class scheduled → Woble defenses tightened',
    change: 'Tserriednich reaches below 3.5 seconds and forms a large aura sphere without a newly shown Parallel Future activation. Kacho-form begins fading without a supplied cause. Sarahell is scheduled for the next class, but has not entered or acted.',
    state: 'training acceleration confirmed / fading unresolved / second-class threat remains preparatory', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 12 · early Thursday', chapters: '404', subject: 'Halkenburg / Balsamilco / Benjamin / Cleapatro / supporters',
    route: 'resuscitation fails → original Halkenburg body dies → funeral terms approved → immediate Balsamilco-body continuity → death and noon send-off announced',
    change: 'Halkenburg’s original body dies inside Chapter 404. Halkenburg remains immediately active through Balsamilco’s living body and secures a noon Tier 3→Tier 2→Tier 1 morgue plan plus guard release. Balsamilco is not shown awake or back in control.',
    state: 'original body dead / Halkenburg immediately active in Balsamilco / funeral authorized and announced but not begun', source: wiki('Chapter_404'),
  },
  {
    day: 'Voyage Day 12 · after announcement', chapters: '404', subject: 'Nobunaga / Phinks / Feitan / established mafia / Heil-Ly',
    route: 'Tier 3 death announcement → benefactor check → planned family intelligence contact → Tier 4 attack still pending',
    change: 'Nobunaga wants an answer from the established families before the Troupe attacks Heil-Ly because it may determine how hard they must fight. No meeting, descent, or raid occurs in Chapter 404.',
    state: 'pre-raid intelligence check planned / lower-tier action not yet started', source: wiki('Chapter_404'),
  },
].sort((left, right) => String(left.chapters).localeCompare(String(right.chapters), undefined, { numeric: true }));

export const wobleCoreTimeline = base.wobleCoreTimeline;
