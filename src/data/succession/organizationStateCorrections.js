export const organizationStateProfileCorrections = Object.freeze({
  'organization:heil-ly': Object.freeze([
    Object.freeze({
      id: 'organization-state:heil-ly:399',
      organizationId: 'organization:heil-ly',
      chapterRange: Object.freeze({ start: 399, end: null }),
      status: 'active',
      operationalState: 'Operates through Nen-mediated hidden rooms, defensive specialists, and rule-bound recruitment; Borksen reaches Yes in Chapter 410 and enters Morena’s community under the game’s consequences.',
      authority: 'Morena remains the community leader; Contagion levels, specialist abilities, and negotiated entry rules structure internal participation.',
      territoryIds: Object.freeze(['location:black-whale:tier-3:heil-ly-hideout', 'location:black-whale:tier-3:room-3101']),
      objectiveStates: Object.freeze(['Preserve and expand the hidden community.', 'Integrate recruits with useful abilities and access.', 'Survive the combined mafia, Troupe, and state search.']),
      pressure: Object.freeze(['The Room 3101 route has been breached and tested.', 'Borksen has entered the community, but her autonomy and long-term loyalty remain uncertain.', 'Special martial law threatens movement and recruitment.']),
      relatedEventIds: Object.freeze(['event:room-3101-breach', 'event:borksen-recruitment-game']),
      certainty: 'confirmed',
      sourceIds: Object.freeze(['source:chapter-399', 'source:chapter-400', 'source:chapter-407', 'source:chapter-408', 'source:chapter-409', 'source:chapter-410']),
    }),
  ]),
});

export const organizationPersonnelHistoryCorrections = Object.freeze({
  'organization:heil-ly': Object.freeze([
    Object.freeze({
      id: 'organization-personnel:heil-ly:borksen:407',
      organizationId: 'organization:heil-ly',
      characterId: 'character:borksen',
      chapterRange: Object.freeze({ start: 407, end: 409 }),
      role: 'Recruitment target',
      status: 'recruiting',
      transitionType: 'recruitment',
      note: 'Borksen participates in Morena’s rule-bound recruitment game before the final Yes outcome.',
      certainty: 'confirmed',
      sourceIds: Object.freeze(['source:chapter-407', 'source:chapter-408', 'source:chapter-409']),
    }),
    Object.freeze({
      id: 'organization-personnel:heil-ly:borksen:410',
      organizationId: 'organization:heil-ly',
      characterId: 'character:borksen',
      chapterRange: Object.freeze({ start: 410, end: null }),
      role: 'New community member',
      status: 'active',
      transitionType: 'membership',
      note: 'Borksen reaches Yes and enters Morena’s community under the recruitment game’s consequences; personal loyalty beyond the enforced outcome is not assumed.',
      certainty: 'confirmed',
      sourceIds: Object.freeze(['source:chapter-410']),
    }),
  ]),
});
