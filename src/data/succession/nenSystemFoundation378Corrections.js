const freeze = (value) => Object.freeze(value);

export const nenSystemProfile378Corrections = freeze({
  'nen-system:contagion-progression': freeze({
    id: 'nen-system:contagion-progression',
    name: 'Contagion Progression System',
    summary: 'Morena’s infected community converts killing into levels, personal Nen abilities, and eventually the capacity to establish a new infected community.',
    category: 'progression',
    chapterRange: freeze({ start: 378, end: null }),
    rules: freeze([
      'Morena initiates recruits by kissing them on the lips.',
      'The Chapter 378 community contains twenty-three people including Morena.',
      'Civilian kills are worth 1 level, Nen-user kills 10 levels, and prince kills 50 levels.',
      'At level 20 an infected member gains a Nen ability.',
      'At level 100 an infected member can start a new infected community.',
    ]),
    costs: freeze(['Progression is explicitly tied to killing people.']),
    risks: freeze(['Rapid distributed Nen growth', 'Unknown personal abilities after level 20', 'Community replication after level 100']),
    openQuestions: freeze([
      'How much direct control does Morena retain over infected members?',
      'What rules govern membership replacement, transfer, or removal?',
      'How do successor communities relate to Morena’s original community?',
    ]),
    abilityIds: freeze(['ability:contagion']),
    guardianBeastIds: freeze([]),
    characterIds: freeze(['character:morena-prudo']),
    organizationIds: freeze(['organization:heil-ly']),
    locationIds: freeze([]),
    sourceIds: freeze(['source:chapter-378']),
    certainty: 'confirmed',
  }),
});
