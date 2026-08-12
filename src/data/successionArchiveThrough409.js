import * as base from './successionArchiveThrough408.js';

export * from './successionArchiveThrough408.js';

const freeze = (value) => Object.freeze(value);

export const publicationBoundary409 = freeze({
  chapter: 409,
  day: 'Voyage Day 12 · immediate continuation from the Chapter 408 martial-law announcement',
  time: 'No new exact clock minute supplied',
  nonLinear: false,
  summary: 'Special Martial Law continues with tier-specific enforcement broadcasts while Borksen resumes Morena’s game. Deal reveals the three joining conditions and returns X after Morena’s requested kiss; Question A resolves the Heil-Ly base as a five-entrance hideout between Tiers 2 and 3 with twenty-one current members. Borksen survives the final No-versus-Return draw with Return, then deliberately exchanges Return for Yes and confirms the choice is intentional.',
  quarantined: freeze([
    'The incident or actor that caused Special Martial Law when not supplied in the Chapter 409 synopsis.',
    'The exact topology of the five Heil-Ly hideout entrances and the division between physical and Nen-created infrastructure.',
    'Any identification of the unnamed Chapter 408 category-detection Enhancer or Heavens Arena Floor Master.',
    'Borksen’s motive for intentionally restoring Yes.',
    'The specific Specialist ability or team role Morena wants Borksen to develop.',
    'Any claim that the kiss plus Yes alone completes Heil-Ly joining; the required murder-presence condition is not shown.',
    'Any claim that Borksen has received a Nen ability, level, or completed awakening by the Chapter 409 stopping point.',
    'Any Chapter 410+ consequence of the restored Yes response, movement, initiation result, game aftermath, or martial-law development.',
  ]),
});

export const personnelTransitions = freeze([
  ...base.personnelTransitions,
  freeze({
    character: 'Borksen',
    chapter: 409,
    from: 'Uncommitted Heil-Ly negotiating target with No and Return remaining when Special Martial Law interrupts Chapter 408',
    to: 'Completes Deal’s kiss request, maps the inter-tier hideout through Question A, survives the final No/Return draw with Return, and intentionally restores Yes without a supplied motive.',
    status: 'alive / intentional Yes selected / full Heil-Ly membership and Nen awakening not established because the murder-presence condition is not shown',
  }),
  freeze({
    character: 'Morena Prudo',
    chapter: 409,
    from: 'Heil-Ly leader whose recruitment game was interrupted by Special Martial Law',
    to: 'Continues the game, reveals the three joining conditions, confirms major hideout and organization intelligence, refuses to change her goal, accepts Borksen’s Return win, and is surprised by the restored Yes.',
    status: 'active Heil-Ly leader under martial-law pressure',
  }),
  freeze({
    character: 'Orarge',
    chapter: 409,
    from: 'Heil-Ly procedural card handler during the interrupted recruitment game',
    to: 'Handles the X/No/Return shuffle and final No/Return shuffle after Borksen verifies the untouched cards.',
    status: 'active Heil-Ly procedural participant in the inter-tier hideout',
  }),
]);

export const wobleCoreTimeline = base.wobleCoreTimeline;
