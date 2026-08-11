const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityName, knowledgeState, summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], certainty = 'confirmed', sources = [406], chapterRange = { start: 406, end: 406 } }) => freeze({
  id,
  abilityName,
  chapterRange: freeze(chapterRange),
  knowledgeState,
  certainty,
  summary,
  mechanics: freeze({ activation, conditions: freeze(conditions), limitations: freeze(limitations), costs: freeze(costs), targets: freeze(targets), range, duration, knownUses: freeze(knownUses) }),
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const abilityKnowledge406Overrides = freeze({
  'ability:hinrigh-object-animal-transformation': freeze([knowledge({
    id: 'ability-knowledge:hinrigh-object-animal-transformation:406',
    abilityName: 'Biohazard',
    knowledgeState: 'hidden transmitter-oyster reversion confirmed / exact persistence threshold unresolved',
    summary: 'The transmitter Hinrigh transformed into a raw oyster in Chapter 398 and concealed under a cabinet in Chapter 399 remains inside the Heil-Ly hideout in Chapter 406, continues beeping, and then suddenly reverts to the original transmitter device.',
    activation: 'No new activation occurs. Chapter 406 shows the endpoint of an earlier Biohazard transformation.',
    conditions: ['The previously transformed transmitter-oyster is still physically concealed beneath the hideout cabinet before reversion.'],
    limitations: ['The exact elapsed transformation time, aura remainder, universal duration formula, and cause of the precise reversion instant are not supplied.', 'The scene does not establish that Hinrigh personally witnesses the reversion.'],
    targets: ['the previously transformed transmitter'],
    range: 'existing transformed object inside the Heil-Ly hideout',
    duration: 'persists until the shown Chapter 406 reversion; exact duration not supplied',
    knownUses: ['Chapter 406: transmitter-oyster reverts to the original transmitter beneath the cabinet.'],
    sources: [398, 399, 406],
  })]),
  'ability:yokotani-battle-of-wits-lsdf': freeze([knowledge({
    id: 'ability-knowledge:yokotani-battle-of-wits-lsdf:406',
    abilityName: 'A Battle of Wits: “LSDF”',
    knowledgeState: 'Chapter 399 defense mechanics retained / Chapter 406 operational recap / self-defense bypass untested',
    summary: 'Nobunaga warns Phinks and Feitan that the Heil-Ly hideout guard uses a counteractive defense that produces an invincibility-like protected state when attacked and expels intruders with Nen security dolls. This is an operational recap of the previously documented LSDF encounter, not a new activation demonstration.',
    activation: 'No new Chapter 406 activation. The established Chapter 399 lawbreaking/identity/hideout conditions remain the archive’s specific documented mechanics.',
    conditions: ['Nobunaga’s warning links attacking the guard with the counteractive defense and expulsion response.'],
    limitations: ['Feitan’s proposal that waiting for Heil-Ly to attack first and then acting in self-defense may be safe is not tested.', 'Chapter 406 shorthand does not erase or broaden the Chapter 399 location, law, identity, and guard conditions.'],
    targets: ['qualifying law-breaking intruders under the established hideout-defense conditions'],
    range: 'qualifying Morena hideout area; exact range unresolved',
    duration: 'no new Chapter 406 activation duration supplied',
    knownUses: ['Chapter 406: Nobunaga briefs Phinks and Feitan; Feitan proposes an untested self-defense approach.'],
    sources: [399, 406],
  })]),
  'ability:love-dial-6700-disgusting-telephone': freeze([knowledge({
    id: 'ability-knowledge:love-dial-6700-disgusting-telephone:406',
    abilityName: 'Love Dial 6700 - Disgusting Telephone',
    knowledgeState: 'translated criteria-number-dial guidance plus demonstrated area/signal search behavior / complete rules and original owner unresolved',
    summary: 'Chrollo accesses a phone-search ability from Skill Hunter. The supplied translated page says criteria produce a 6–20 digit number that can be dialed for guidance. The demonstrated calls report whether the tracked person is in the current area or outside the current Nen signal range, and a finite number of calls remains for the day.',
    activation: 'Open Skill Hunter to the ability, conjure the cell phone, input criteria to obtain a 6–20 digit number according to the translated page, then dial for guidance.',
    conditions: ['A selected-criteria step is stated in the translated page text.', 'Generated number length is stated as 6–20 digits.', 'A finite daily call allowance exists in the demonstrated story use.', 'Caller coordinates/current area and Nen signal range affect the returned guidance.'],
    limitations: ['Exact daily call count and reset are unknown.', 'Exact signal radius, valid criteria, target eligibility, aura cost, Nen category, and original owner are unknown.', 'Chrollo considers changing coordinates or loosening conditions, but the mechanics/tradeoffs are not supplied.', '“McGait Narumi” appears in the supplied translated page text but its meaning is unresolved.', 'The tracked person’s identity and exact tier remain unresolved.'],
    costs: ['Finite calls per day; exact count and aura cost unresolved.'],
    targets: ['an unspecified person matching the selected search criteria'],
    range: 'current-area / Nen-signal guidance with exact radius unresolved',
    duration: 'per call',
    knownUses: ['First call: target not in current area.', 'Final call: target found beyond current signal range; Chrollo concludes the target is above Tier 3.'],
  })]),
});
