const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ start, end = null, operationalState, nenKnowledge, openQuestions = [], sources }) => Object.freeze({
  id: `character-state:ken-i-wang:${start}`,
  characterId: 'character:ken-i-wang',
  chapterRange: Object.freeze({ start, end }),
  life: 'alive',
  bodyState: 'living body',
  consciousnessState: 'active in own body',
  operationalState,
  protectionState: 'Protected by Cha-R hierarchy, Tier 5 territory, and the family’s Luzurus sponsorship.',
  threatLevel: 'high',
  nenKnowledge,
  allegianceState: 'Cha-R Family operational command under Brocco Li.',
  locationId: 'location:black-whale:tier-5',
  openQuestions: Object.freeze(openQuestions),
  certainty: 'confirmed',
  sourceIds: Object.freeze(sources.map(chapterSourceId)),
});

export const characterStateInstitutionClosureExpansionProfiles = Object.freeze({
  'character:ken-i-wang': Object.freeze([
    state({
      start: 378,
      end: 392,
      operationalState: 'Acts as Cha-R underboss and operational coordinator while the family protects Tier 5, searches for Hisoka, and contains Heil-Ly expansion.',
      nenKnowledge: 'institutional awareness of Nen-enabled lower-tier conflict; personal ability is not established',
      sources: [378, 390, 392],
    }),
    state({
      start: 393,
      operationalState: 'Coordinates Cha-R’s tactical relationship with the Phantom Troupe while attempting to direct its violence toward Heil-Ly without surrendering family control.',
      nenKnowledge: 'operational awareness of Phantom Troupe combat risk and the Heil-Ly route war',
      openQuestions: ['Whether Ken’i can preserve Cha-R authority once Troupe objectives diverge remains unresolved.'],
      sources: [393, 398, 399],
    }),
  ]),
});
