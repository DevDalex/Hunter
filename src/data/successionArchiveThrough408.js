import * as base from './successionArchiveThrough407.js';

export * from './successionArchiveThrough407.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary408 = freeze({
  chapter: 408,
  day: 'Voyage Day 12 · immediate Tier 2 negotiation continuation',
  time: 'No new exact clock minute supplied',
  nonLinear: false,
  summary: 'Borksen plays Aim, Power / Ability, and No? against Morena; Joker, Yes, and X are removed from the child hand. Morena discloses her Carnival Orphan identity/history, Kakin and humanity destruction goals, Contagion support model, Specialist recruitment logic, and the vow/limitation rationale behind No versus X. Special Martial Law is declared with No and Return still remaining.',
  quarantined: freeze([
    'The cause, ordering authority, enforcement details, and operational consequences of Special Martial Law after the Chapter 408 announcement.',
    'Any Chapter 409+ continuation or final result of the Morena/Borksen negotiation game.',
    'The specific Specialist ability Morena wants Borksen to develop.',
    'The identity of the unnamed Heil-Ly Nen-category detection Enhancer.',
    'The identity of the unnamed Heavens Arena Floor Master encountered by that detector.',
    'Any claim that Borksen has awakened Nen, joined Heil-Ly, or accepted Morena’s larger goal by the Chapter 408 stopping point.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({
    character: 'Borksen',
    chapter: 408,
    from: 'Tier 2 Heil-Ly captive/recruit under a newly started negotiation game',
    to: 'Active but still-uncommitted negotiating party; Morena identifies her as a Specialist, Joker/Yes/X are removed, No and Return remain, and Special Martial Law interrupts before a final response.',
    status: 'alive / unawakened / no Heil-Ly alliance accepted at Chapter 408 boundary',
  }),
  freeze({
    character: 'Morena Prudo',
    chapter: 408,
    from: 'Heil-Ly leader who had explained the recruitment-game rules but withheld her purpose and ability details',
    to: 'Discloses her Carnival Orphan identity, anti-Kakin and anti-humanity goals, Specialist status, Contagion support model, No/X consequences, and vow/limitation rationale while still withholding Borksen’s requested future ability.',
    status: 'active Heil-Ly leader / identity disclosure speaker-bounded where appropriate',
  }),
  freeze({
    character: 'Orarge',
    chapter: 408,
    from: 'Heil-Ly member present in the recruitment setting',
    to: 'Procedural card handler who Hindu-shuffles and lays out Borksen’s response cards during the negotiation.',
    status: 'active Heil-Ly procedural participant',
  }),
]);

export const wobleCoreTimeline = base.wobleCoreTimeline;
