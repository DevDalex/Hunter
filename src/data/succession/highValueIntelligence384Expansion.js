const freeze = (value) => Object.freeze(value);

export const highValueIntelligence384Protocols = freeze([
  freeze({
    id: 'protocol:kakin-mafia-hit-raid-settlement',
    entityType: 'protocol',
    slug: 'kakin-mafia-hit-raid-settlement',
    name: 'Kakin Mafia Hit-and-Raid Settlement Procedure',
    summary: 'Ken’i Wang and Tajao explain the shipboard Kakin mafia procedure used to contain inter-family hits and raids: the initiating side informs its boss, the bosses negotiate a settlement, Tajao gives a twenty-four-hour notice window, and the initiating boss must have been away from home turf when the incident began. Morena’s location determines whether the current Heil-Ly conflict can still fit the procedure or becomes open war.',
    aliases: freeze(['Twenty-four-hour mafia settlement rule']),
    publicationStatus: 'published',
    canonLevel: 'canon',
    sourceIds: freeze(['source:chapter-384']),
    chapterRange: freeze({ start: 384, end: null }),
    updatedAt: '2026-08-09',
    domain: 'operational-rule',
    protocolStatus: 'confirmed',
    authority: 'Kakin mafia family operating arrangement as explained by Ken’i Wang and Tajao',
    ruleStatement: 'A member conducting a hit or raid against another family is expected to notify the family boss, after which the bosses negotiate settlement; Tajao states that the notification must occur within twenty-four hours and that the responsible boss must have been away from home turf when the incident began.',
    trigger: 'An inter-family hit or raid creates the need for boss-level notification and settlement.',
    scope: 'The Cha-R, Xi-Yu, and Heil-Ly shipboard mafia conflict described in Chapter 384.',
    enforcement: 'Family-level retaliation and escalation to all-out war if the settlement conditions fail; Tajao says the present case becomes unavoidable war if Morena was on Tier 3 and still has not made the required call.',
    exceptions: freeze(['In the scenario discussed, Tiers 1 and 2 count as away from the families’ lower-tier home turf, allowing the delayed incident to remain potentially reconcilable if Morena was there.']),
    openQuestions: freeze(['Where exactly was Morena when the first relevant incident occurred?', 'Will the boss-level communication and settlement conditions be satisfied before the conflict escalates?']),
    linkedEntityIds: freeze(['organization:cha-r', 'organization:xi-yu', 'organization:heil-ly', 'character:morena-prudo']),
  }),
]);
