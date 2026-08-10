const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityName, knowledgeState, summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], certainty = 'confirmed', sources = [403] }) => freeze({
  id,
  abilityName,
  chapterRange: freeze({ start: 403, end: 403 }),
  knowledgeState,
  certainty,
  summary,
  mechanics: freeze({
    activation,
    conditions: freeze(conditions),
    limitations: freeze(limitations),
    costs: freeze(costs),
    targets: freeze(targets),
    range,
    duration,
    knownUses: freeze(knownUses),
  }),
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const abilityKnowledge403Overrides = freeze({
  'ability:halkenburg-possession-arrow': freeze([
    knowledge({
      id: 'ability-knowledge:halkenburg-possession-arrow:403',
      abilityName: 'The Boy Who Shoots the Arrow: Grimmel the Dissonance',
      knowledgeState: 'official name supplied / successful Balsamilco consciousness transfer confirmed / complete topology still unresolved',
      summary: 'Chapter 403 names Halkenburg’s collective bow-and-arrow technique The Boy Who Shoots the Arrow: Grimmel the Dissonance. Halkenburg stands with twelve civilian supporters, uses a hidden distance signal to aim through a wall at Balsamilco, fires, and later is directly revealed to be controlling Balsamilco’s body while Halkenburg’s original body lies unconscious under medical care.',
      activation: 'Halkenburg and a loyal supporter group generate the collective rumbling/aura state; Halkenburg forms the aura bow, calculates the target position, and releases the arrow.',
      conditions: [
        'Twelve civilian supporters are physically shown participating in the Chapter 403 attack.',
        'The supporters need not be Halkenburg’s formally assigned personal guards; Benjamin realizes loyal civilians can participate.',
        'A separate participant covertly supplies Balsamilco’s distance using finger signals hidden by a laptop screen.',
        'The successful hit results in Halkenburg’s consciousness operating Balsamilco’s body while Halkenburg’s original body becomes unconscious.',
      ],
      limitations: [
        'Chapter 403 shows twelve supporters but does not establish twelve as the universal minimum or exact required count.',
        'Exact maximum range is not quantified.',
        'The shot is aimed through a wall, but the chapter does not fully define how the arrow interacts with ordinary material barriers.',
        'Balsamilco’s displaced consciousness location is not revealed.',
        'Vict’s condition and the full meaning of his statement that he discovered the secret are unresolved.',
        'Benjamin’s coercive-Manipulation classification and first-come-first-served exception theory are analysis, not a confirmed formal Nen category or universal rule.',
        'Chapter 404+ consequences are excluded from this boundary.',
      ],
      costs: ['Halkenburg’s original body collapses and remains unconscious after the successful Chapter 403 operation; the exact causal/cost rule governing that collapse is not fully explained here.'],
      targets: ['Balsamilco Might in the demonstrated Chapter 403 use', 'hostile individual struck by the collective arrow'],
      range: 'cross-room/corridor projectile reach demonstrated through a wall; exact distance not quantified',
      duration: 'Halkenburg remains active in Balsamilco’s body through the Chapter 403 endpoint; complete duration/termination rule unresolved',
      knownUses: [
        'Chapter 403: Halkenburg and twelve civilian supporters generate the collective attack and fire at Balsamilco through the courthouse wall.',
        'Chapter 403: the later reveal confirms Halkenburg’s consciousness is inside Balsamilco’s body while the original Halkenburg body lies unconscious.',
        'Chapter 403: the possessed Balsamilco body deceives Benjamin by claiming the arrow missed and later reports the mission completed.',
      ],
      sources: [382, 386, 389, 403],
    }),
  ]),
  'ability:zhang-lei-coins': freeze([
    knowledge({
      id: 'ability-knowledge:zhang-lei-coins:403',
      abilityName: 'Zhang Lei’s Guardian Coins',
      knowledgeState: 'ten produced coins accounted for / one retained coin changes 1 to 10 / progression cause unresolved',
      summary: 'Chapter 403 has Zhang Lei account for ten produced coins after ten days: seven remain with him and three were given away. Among the seven laid out in Room 1003, six display 1 and one displays 10. The direct observation is the 1-to-10 change; every proposed explanation for why it changed remains unconfirmed.',
      activation: 'The Guardian Spirit Beast continues producing numbered coins that Zhang Lei can retain or distribute; Chapter 403 supplies no confirmed holder-activation rule.',
      conditions: [
        'Zhang Lei says one coin is produced per day and accounts for ten total after ten days.',
        'Seven coins are currently retained in Room 1003 and three have been distributed.',
        'One retained coin has changed from 1 to 10.',
        'Zhang Lei orders production dates to be recorded and the distributed coins to be followed up so the ten-day hypothesis can be tested.',
      ],
      limitations: [
        'The proposal that coins change after ten days is a hypothesis, not an established progression rule.',
        'Ideas that the number reflects holder growth, monetary value, exponentially increasing value, or another parameter are speculation.',
        'The meaning of 1 and 10, the trigger, holder effect, threshold, and eventual complete ability remain unresolved.',
        'Chapter 403 ends with Zhang Lei seeking Kurapika’s expertise; no Kurapika test result from Chapter 404+ is imported.',
      ],
      targets: ['coin holders; eventual effect unresolved'],
      range: 'coin-based / exact Nen range unresolved',
      duration: 'coins persist; production/progression timing still under test',
      knownUses: [
        'Chapter 403: Zhang Lei lays out seven retained coins, with six showing 1 and one showing 10, while accounting for three additional distributed coins.',
        'Chapter 403: Zhang Lei begins dated tracking and orders follow-up on distributed coins.',
      ],
      sources: [362, 376, 389, 390, 402, 403],
    }),
  ]),
  'ability:magical-worm': freeze([
    knowledge({
      id: 'ability-knowledge:magical-worm:403',
      abilityName: 'Magical Worm',
      knowledgeState: 'Chapter 402 route knowledge carried forward / Luzurus operation scheduled but not executed',
      summary: 'Chapter 403 carries forward the Chapter 402 route plan. Kacho-form says marking Luzurus’s room makes the letter operation worthwhile, but Fugetsu is resting and the team schedules the operation for the night of the following day. No new route mechanic or completed Luzurus transport is demonstrated.',
      activation: 'Fugetsu opens the established door-and-tunnel route toward destinations available under the still-incomplete rules.',
      conditions: ['The protection team treats prior access/marking of Luzurus’s room as preparation for the planned route.', 'Fugetsu must recover enough strength for the planned operation.'],
      limitations: ['No Luzurus operation occurs in Chapter 403.', 'No new outside-ship route, third-party rule, maximum range, or destination rule is demonstrated.', 'Luzurus remains an unconfirmed suspect in Fugetsu’s condition.'],
      targets: ['Fugetsu and route users permitted by still-incomplete rules'],
      range: 'within-ship destinations demonstrated previously; exact maximum unresolved',
      duration: 'route-dependent',
      knownUses: ['Chapter 403: no new completed route use; the next-night Luzurus operation remains scheduled only.'],
      sources: [383, 400, 402, 403],
    }),
  ]),
  'ability:fugetsu-unidentified-hostile-spirit-affliction': freeze([
    knowledge({
      id: 'ability-knowledge:fugetsu-unidentified-hostile-spirit-affliction:403',
      abilityName: 'Fugetsu Unidentified Hostile-Spirit Affliction',
      knowledgeState: 'Basho suppression reported effective while Fugetsu rests / culprit and mechanism unresolved',
      summary: 'Chapter 403 shows Fugetsu sleeping deeply in the Justice infirmary while Melody reports that Basho’s help has kept the hostile spirits away even when Fugetsu is alone. The protection team still has not identified the attacker and does not establish Luzurus as the culprit.',
      activation: 'Unknown.',
      conditions: ['Fugetsu remains the affected target.', 'Basho’s prior protective measure is reported to keep the spirits away while she rests alone.'],
      limitations: ['User, official name, Nen type, exact trigger, target-selection method, duration, and permanent removal method remain unknown.', 'The chapter does not convert temporary suppression into exorcism or a permanent cure.', 'Luzurus remains only an operational suspect and the planned operation has not occurred.', 'No causal link to Magical Worm itself is established.'],
      targets: ['Fugetsu Hui Guo Rou'],
      range: 'unknown',
      duration: 'ongoing condition with temporary suppression reported',
      knownUses: ['Chapter 403: Fugetsu sleeps while Melody reports Basho’s aid is keeping the hostile spirits away even when she is alone.'],
      certainty: 'unknown',
      sources: [400, 402, 403],
    }),
  ]),
});

export const guardianBeastState403Corrections = freeze({
  'guardian-beast:zhang-lei': freeze([
    freeze({
      id: 'guardian-beast-state:zhang-lei:403',
      beastId: 'guardian-beast:zhang-lei',
      chapterRange: freeze({ start: 403, end: 403 }),
      knowledge: 'ten produced coins accounted for; one retained coin changes from 1 to 10; progression cause unresolved',
      operationalState: 'Zhang Lei lays out seven retained Guardian Coins, six marked 1 and one marked 10, while accounting for three distributed coins. He and his guards generate competing explanations, but the chapter confirms only the observed number change and the new dated-tracking plan.',
      hostState: 'host active',
      visibility: 'visible to eligible Nen users other than the host',
      knownAbilityIds: freeze(['ability:zhang-lei-coins']),
      suspectedAbilityIds: freeze([]),
      unresolved: freeze(['Meaning of the coin numbers', 'Cause/timing of the 1-to-10 change', 'Whether production age matters', 'Effect on distributed holders', 'Activation threshold and eventual complete ability']),
      sourceIds: freeze([chapterSourceId(362), chapterSourceId(376), chapterSourceId(389), chapterSourceId(390), chapterSourceId(402), chapterSourceId(403)]),
      certainty: 'confirmed',
    }),
  ]),
});
