import * as base from './successionArchiveThrough409.js';

export * from './successionArchiveThrough409.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary410 = freeze({
  chapter: 410,
  day: 'Voyage Day 12 · immediate continuation from Borksen’s restored Yes in Chapter 409',
  time: 'No absolute clock minute supplied; chapter endpoint is explicitly 40 minutes after Special Martial Law',
  nonLinear: false,
  summary: 'Morena says Borksen’s marked Return card triggered an automatic Manipulation anti-cheating rule that restricts her to Yes or No. Borksen outwardly confirms Yes while internally resisting, is accepted on Heil-Ly’s side but explicitly remains Level 0 until witnessing a Heil-Ly murder, and begins counter-planning. Tier 3 military investigators classify Room 3101 as a supernatural Case S after three soldiers vanish, while Benjamin uses Special Martial Law, an internal 9.5-hour disease clock, and biological-terrorism allegations to attempt a three-branch military consolidation from the Justice Bureau. The chapter stops forty minutes after martial law was declared.',
  quarantined: freeze([
    'Any claim that Borksen voluntarily wanted the compelled Yes or ideologically accepted Morena’s destruction goal.',
    'Any claim that Borksen is formal Level 1 or has completed the murder-presence joining condition.',
    'Any surveillance function beyond Morena’s confirmed tracking of Borksen’s level, points, location and status; audiovisual spyware is Borksen’s assumption.',
    'Any unreproduced name for the installed-game ability component mentioned but not named in the supplied synopsis.',
    'Room 125 as a separate Chapter 410 route; the supplied correction note identifies Room 3101 as the volume-corrected reference.',
    'The identity of the missing corporal discussed by Tier 3 investigators.',
    'The ability, user or complete route mechanism behind the Room 3101 disappearances.',
    'Zhang Lei’s exact destination after the reported Onior cross-bridge movement and Luzurus’s current location.',
    'Benjamin’s biological-terrorism allegations as independently proven facts.',
    'Kaiser’s suspicion that Benjamin is infected or his twenty-four-hour estimate as confirmed diagnosis.',
    'The identity or mechanics of Kaiser’s final stronghold.',
    'Any Chapter 411+ consequence, movement, death, legal outcome or later explanation.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({
    character: 'Borksen',
    chapter: 410,
    from: 'Intentional Yes restored at the Chapter 409 endpoint, with motive and consequences unresolved and the murder-presence joining condition incomplete.',
    to: 'Outwardly confirms Yes while internally resisting after Morena says the marked Return cheat triggered automatic Manipulation; is accepted on Heil-Ly’s side, remains Level 0, learns the installed-game tracking model, intends to return to her original companions, and asks for a hideout tour first.',
    status: 'alive / operationally aligned under coercion / Level 0 / formal Level 1 and ideological loyalty not established',
  }),
  freeze({
    character: 'Morena Prudo',
    chapter: 410,
    from: 'Heil-Ly leader surprised by Borksen’s intentional restored Yes at the Chapter 409 endpoint.',
    to: 'Explains the marked-card anti-cheating Manipulation, processes Borksen’s forced Yes, reveals installed-game tracking and termination rules, places Borksen at Level 0, and continues recruitment command under Special Martial Law.',
    status: 'active Heil-Ly leader / game administrator / under rising military investigation pressure',
  }),
  freeze({
    character: 'Benjamin Hui Guo Rou',
    chapter: 410,
    from: 'First Prince operating under the newly declared Special Martial Law.',
    to: 'Assigns forces against Heil-Ly, prioritizes Zhang Lei and Luzurus, internally calculates roughly 9.5 operational hours, reaches the Justice Bureau and announces a military consolidation of all three branches while royal written authorization remains pending.',
    status: 'active First Prince / critical health deadline / attempted emergency governmental consolidation',
  }),
  freeze({
    character: 'Mizaistom Nana',
    chapter: 410,
    from: 'Justice Bureau/Hunter Association official operating under Special Martial Law.',
    to: 'Challenges Benjamin for the legal basis and royal authorization and privately reads the plan as hostage leverage supported by conveniently twisted half-truths.',
    status: 'active Justice-side institutional resistance',
  }),
  freeze({
    character: 'Kaiser',
    chapter: 410,
    from: 'Justice-side official under Special Martial Law.',
    to: 'Observes Benjamin’s Justice Bureau confrontation, suspects possible infection, hopes for a one-day delay and privately retains an unidentified final stronghold.',
    status: 'active / infection estimate remains inference / final stronghold unresolved',
  }),
]);

export const wobleCoreTimeline = base.wobleCoreTimeline;
