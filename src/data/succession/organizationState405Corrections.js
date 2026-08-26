const freeze = (value) => Object.freeze(value);
const sourceIds = freeze(['source:chapter-405']);

const state = ({ organizationId, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', status = 'active' }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:405`,
  organizationId,
  chapterRange: freeze({ start: 405, end: 405 }),
  status,
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds,
});

export const organizationState405Corrections = freeze({
  'organization:phantom-troupe': freeze([state({
    organizationId: 'organization:phantom-troupe',
    operationalState: 'The Troupe’s Hisoka hunt and Heil-Ly conflict are now explicitly linked by Chrollo’s Bonolenov decoy plan, the real Hisoka’s Tier 1 presence, and Tajao’s route support for Nobunaga, Phinks, and Feitan. Bonolenov believes Chrollo wants a personal rematch and is searching for an unidentified ability.',
    authority: 'Chrollo remains leader; individual members retain tactical independence while following broad search and retaliation objectives.',
    territoryIds: ['location:black-whale:tier-1', 'location:black-whale:tier-5', 'location:black-whale:tier-5:cha-r-route'],
    objectiveStates: ['Find and kill Hisoka.', 'Destroy the current Heil-Ly threat.', 'Use temporary mafia cooperation without becoming subordinate to it.'],
    pressure: ['Hisoka is confirmed on Tier 1.', 'Chrollo’s desired rematch may conflict with members who want to reach Hisoka first.', 'The anti-Heil-Ly route is advancing into an unrevealed area.'],
    relatedEventIds: ['event:chapter405-fake-hisoka-bonolenov-spots-real-hisoka', 'event:chapter405-tajao-declares-char-xiyu-support-for-troupe', 'event:chapter405-tajao-opens-final-route-door'],
  })]),
  'organization:cha-r': freeze([state({
    organizationId: 'organization:cha-r',
    operationalState: 'Cha-R explains its balance-centered mafia identity to the Troupe, declares full support with Xi-Yu for crushing Heil-Ly, and opens a controlled internal route for Nobunaga, Phinks, and Feitan. Ken’i’s private Morena/joker thoughts introduce a concealed-plan contradiction that remains unresolved.',
    authority: 'Traditional Kakin mafia hierarchy under Brocco Li, with Ken’i Wang and Tajao exercising operational control on Tier 5.',
    territoryIds: ['location:black-whale:tier-5', 'location:black-whale:tier-5:cha-r-route'],
    objectiveStates: ['Preserve established mafia balance.', 'Use the Troupe against the current Heil-Ly threat.', 'Protect Cha-R territory and Luzurus-linked legitimacy.'],
    pressure: ['Ken’i has concealed knowledge involving Morena and an accelerated schedule.', 'The Troupe may reach the Heil-Ly leader sooner than expected.', 'The exact meaning of the “joker” is unknown.'],
    relatedEventIds: ['event:chapter405-tajao-contrasts-established-mafia-balance', 'event:chapter405-tajao-declares-char-xiyu-support-for-troupe', 'event:chapter405-keni-morena-joker-hidden-plan'],
    certainty: 'confirmed public operation / concealed Ken’i relationship unresolved',
  })]),
  'organization:xi-yu': freeze([state({
    organizationId: 'organization:xi-yu',
    operationalState: 'Xi-Yu remains part of the established-mafia anti-Heil-Ly front. Tajao states that Xi-Yu and Cha-R will fully support the Troupe’s push, while Chapter 405 retrospectively reveals that Xi-Yu member Lynch was killed by Bonolenov after discovering the false-Hisoka decoy and Zakuro was deceived.',
    authority: 'Onior’s traditional mafia hierarchy with Hinrigh as active field underboss.',
    territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-5'],
    objectiveStates: ['Contain Heil-Ly.', 'Preserve balance with Cha-R and royal sponsors.', 'Manage the Hisoka/Troupe threat without losing operational control.'],
    pressure: ['Lynch is dead.', 'Zakuro was deceived by Bonolenov’s disguise operation.', 'The Troupe is being granted deeper route access by Cha-R.'],
    relatedEventIds: ['event:chapter405-bonolenov-confirms-he-killed-lynch', 'event:chapter405-bonolenov-uses-lynch-form-to-misdirect-zakuro', 'event:chapter405-tajao-declares-char-xiyu-support-for-troupe'],
  })]),
  'organization:heil-ly': freeze([state({
    organizationId: 'organization:heil-ly',
    operationalState: 'Morena’s community prepares two parallel escalations: Dogman and Sodom are assigned to exploit the upcoming Halkenburg funeral crowd to identify and abduct an unspecified non-Nen target, while Tevelares, Daemon, and level-51 Quorolle prepare in the processing area for a mafia hunt and revenge on Hinrigh.',
    authority: 'Morena directs Contagion progression, specialist assignments, recruitment, and the concealed Tier 2 base network.',
    territoryIds: ['location:black-whale:tier-2:heil-ly-hideout', 'location:black-whale:tier-2:heil-ly-hideout:processing-area'],
    objectiveStates: ['Use the funeral crowd to locate an unidentified recruitment target.', 'Pair Dogman’s Nen identification with Sodom’s non-Nen-target kidnapping ability.', 'Level members and retaliate against the established mafia.'],
    pressure: ['Cha-R and Xi-Yu have declared support for a Troupe assault.', 'Dogman’s target identity and recruitment outcome remain unknown.', 'The Troupe may reach Morena earlier than Ken’i expected.'],
    relatedEventIds: ['event:chapter405-morena-targets-upcoming-funeral-crowd', 'event:chapter405-dogman-level62-nen-scent-rules', 'event:chapter405-sodom-non-nen-kidnapping-condition', 'event:chapter405-tevelares-daemon-quorolle-mafia-hunt'],
  })]),
});
