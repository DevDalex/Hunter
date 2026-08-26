const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-369', 'source:chapter-370']);

export const abilityFoundation370Expansion = freeze([
  freeze({
    id: 'ability:silent-majority',
    entityType: 'ability',
    slug: 'silent-majority',
    name: 'Silent Majority',
    aliases: freeze([]),
    summary: 'An unidentified user operates an invisible-to-most marionette through a possessed person and deploys four blood-draining curse snakes; Chapter 370 reveals the ten-person possession-selection window, rebound condition, visibility rule, and an eleven-second four-snake exsanguination benchmark.',
    sourceIds,
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-07-24',
    updatedAt: '2026-08-07',
    ownerIds: freeze([]),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'unknown' }),
    category: 'possession-assisted curse / blood-draining attack',
    activation: 'The user operates a marionette through a possessed person. Chapter 370 shows the user waiting for the room’s attention to shift before launching four curse snakes at Barrigen.',
    conditions: freeze([
      'Only the user and the person possessed by the marionette can see the marionette.',
      'The marionette has ten people within its selectable possession range; the exact physical geometry and selection method are not established.',
      'If the marionette deactivates without killing anyone, the curse rebounds to the user.',
    ]),
    limitations: freeze([
      'The user’s identity and Nen category remain unknown at the Chapter 370 boundary.',
      'The complete possession process, physical range, target-selection rules, snake persistence, and defensive counters remain unresolved.',
      'Chapter 370 does not conclusively identify the Silent Majority user as the killer of the five blood-drained guards from Chapter 359.',
    ]),
    costs: freeze(['Failure to kill before deactivation causes the curse to rebound onto the user.']),
    targets: freeze(['people within the active Room 1014 class environment']),
    range: 'Possession-selection window of ten people; exact distance unknown',
    duration: 'Unknown',
    status: 'active threat / user unidentified',
    knownUses: freeze([
      'Operates through possessed Loberry during Kurapika’s first public Nen class.',
      'Kills Barrigen by deploying four snakes that drain his blood.',
      'When all four snakes attack together, the user states they can drain a body of blood in eleven seconds.',
    ]),
    firstChapter: 369,
    latestChapter: 370,
    sourceChapterNumbers: freeze([369, 370]),
    researchStatus: 'partial-mechanics / major-mystery',
  }),
]);
