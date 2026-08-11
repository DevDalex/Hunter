const freeze = (value) => Object.freeze(value);

export const organizationState405LegacySplits = freeze({
  'organization:heil-ly': freeze([
    freeze({
      id: 'organization-state:heil-ly:399',
      organizationId: 'organization:heil-ly',
      chapterRange: freeze({ start: 399, end: 404 }),
      status: 'active',
      operationalState: 'Operates through Nen-mediated hidden rooms, defensive specialists, and a partially mapped route network while Morena prepares the community for further recruitment. This imported pre-405 continuity stops before the exact Chapter 405 funeral-search and mafia-hunt update.',
      authority: 'Morena remains the community leader; Contagion levels and specialist abilities structure internal participation.',
      territoryIds: freeze(['location:black-whale:tier-3:heil-ly-hideout', 'location:black-whale:tier-3:room-3101']),
      objectiveStates: freeze(['Preserve and expand the hidden community.', 'Identify recruits with useful abilities and access.', 'Survive the combined mafia, Troupe, and state search.']),
      pressure: freeze(['The Room 3101 route has been breached and tested.', 'The family needs new personnel without exposing its hidden structure.', 'The mafia and Phantom Troupe continue narrowing the search area.']),
      relatedEventIds: freeze(['event:room-3101-breach']),
      certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-399', 'source:chapter-400']),
    }),
    freeze({
      id: 'organization-state:heil-ly:406',
      organizationId: 'organization:heil-ly',
      chapterRange: freeze({ start: 406, end: 406 }),
      status: 'active',
      operationalState: 'After the exact Chapter 405 Dogman/Sodom funeral-search preparation and processing-area mafia-hunt state, imported Heil-Ly continuity resumes for Chapter 406 only. Chapter 406 outcomes remain governed by that chapter’s own maintained packet rather than being backfilled into 405.',
      authority: 'Morena remains the community leader; Contagion levels and specialist abilities structure internal participation.',
      territoryIds: freeze(['location:black-whale:tier-3:heil-ly-hideout', 'location:black-whale:tier-3:room-3101']),
      objectiveStates: freeze(['Preserve and expand the hidden community.', 'Continue recruitment and specialist operations.', 'Survive the combined mafia, Troupe, and state search.']),
      pressure: freeze(['The established mafia and Phantom Troupe are converging on Heil-Ly.', 'Chapter 406-specific target and operation outcomes require Chapter 406 evidence.']),
      relatedEventIds: freeze(['event:room-3101-breach']),
      certainty: 'confirmed',
      sourceIds: freeze(['source:chapter-406']),
    }),
  ]),
});
