const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const knowledge = ({ id, abilityName, summary, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', knownUses = [], certainty = 'confirmed' }) => freeze({
  id,
  abilityName,
  chapterRange: freeze({ start: 400, end: 400 }),
  knowledgeState: 'Chapter 400 modernized knowledge boundary',
  certainty,
  summary,
  mechanics: freeze({ activation, conditions: freeze(conditions), limitations: freeze(limitations), costs: freeze(costs), targets: freeze(targets), range, duration, knownUses: freeze(knownUses) }),
  sourceIds: freeze([chapterSourceId(400)]),
});

export const abilityKnowledge400Overrides = freeze({
  'ability:melody-aura-performance': freeze([
    knowledge({
      id: 'ability-knowledge:melody-aura-performance:400',
      abilityName: 'Melody’s Aura Performance',
      summary: 'Chapter 400 adds Melody’s own explanation of the performance used during the twin escape: her music is intended to heal, loss of consciousness is a side effect, and covering the ears prevents the demonstrated entrancement.',
      activation: 'The target must hear Melody’s sincere musical performance. Chapter 400 specifically confirms that covering the ears prevents the demonstrated entrancement.',
      conditions: ['Auditory exposure is required in the demonstrated use.', 'Melody describes healing as the intended purpose and unconsciousness as a side effect.'],
      limitations: ['The chapter does not establish that every Melody performance causes unconsciousness.', 'Nen classification, maximum unamplified range, resistance rules, and broader musical-effect catalog remain unresolved.'],
      targets: ['people who hear the performance'],
      range: 'auditory reach; Chapter 383 demonstrated loudspeaker relay',
      duration: 'three minutes in the Chapter 383 demonstration; not generalized to all pieces',
      knownUses: ['Chapter 400: Melody explains the hearing requirement, healing intent, and unconsciousness side effect while Kaiser discusses political use of her performance.'],
    }),
  ]),
  'ability:magical-worm': freeze([
    knowledge({
      id: 'ability-knowledge:magical-worm:400',
      abilityName: 'Magical Worm',
      summary: 'Fugetsu reports and demonstrates a Chapter 400 operational expansion: she can use Magical Worm multiple times rather than once per day, and a return door appears while she is alone. Solo return is limited to returning to the place she departed from.',
      activation: 'Fugetsu independently opens/uses the door-and-tunnel route. The exact cause of the expanded activation frequency is unknown.',
      conditions: ['Multiple activations within the current day are now possible.', 'A return door can appear while Fugetsu is alone.', 'The demonstrated solo return takes Fugetsu back to where she was.'],
      limitations: ['The cause of the expanded behavior is unknown.', 'Chapter 400 does not prove the ability becomes stronger with every use.', 'Chapter 400 does not prove repeated use caused Fugetsu’s physical collapse, aura weakness, or hostile-spirit condition.', 'Exact aura cost, reset rule, maximum range, arbitrary destination selection, and complete post-Kacho cooperative mechanics remain unresolved.'],
      targets: ['Fugetsu and the route users permitted by Magical Worm’s still-incomplete rules'],
      range: 'translocation tunnel; exact maximum range unresolved',
      duration: 'route-dependent',
      knownUses: ['Chapter 400: Fugetsu repeatedly explores alone and returns through a solo return door before later collapsing.'],
    }),
  ]),
  'ability:without-you': freeze([
    knowledge({
      id: 'ability-knowledge:without-you:400',
      abilityName: 'Without You',
      summary: 'Without You remains active in Kacho’s form after human Kacho’s death. Chapter 400 shows the Kacho-form actor continuing the protection plan around Fugetsu and moving through a solid bookcase/wall. Its statements about resurrection, contest status, and Fugetsu possibly supplying aura are retained as the beast’s reasoning rather than settled mechanics.',
      activation: 'The Chapter 383 death trigger remains the established activation. Chapter 400 adds continued post-death activity and demonstrated incorporeal traversal, not a new trigger.',
      conditions: ['Human Kacho remains dead.', 'Without You continues in Kacho’s form beside/around Fugetsu.', 'The Kacho-form actor can pass through solid furniture/walls in the demonstrated Justice Bureau movement.'],
      limitations: ['Human Kacho’s consciousness persistence remains unconfirmed.', 'The Kacho-form actor’s theory that Fugetsu supplies aura to maintain the form is not independently confirmed.', 'The claim that Fugetsu seeing the Kacho form proves Kacho is outside the contest remains the actor’s reasoning.', 'Whether telling Fugetsu the truth changes any aura burden remains unresolved.'],
      targets: ['Fugetsu as the surviving twin protected by Without You'],
      range: 'protective proximity / Justice Bureau movement; exact maximum range unresolved',
      duration: 'ongoing at Chapter 400',
      knownUses: ['Chapter 400: Kacho-form Without You coordinates with Melody and Kaiser, hides Kacho’s actual death from Fugetsu, and moves through a bookcase/wall.'],
    }),
  ]),
  'ability:fugetsu-unidentified-hostile-spirit-affliction': freeze([
    knowledge({
      id: 'ability-knowledge:fugetsu-unidentified-hostile-spirit-affliction:400',
      abilityName: 'Fugetsu Unidentified Hostile-Spirit Affliction',
      summary: 'Melody detects a severe unresolved hostile Nen condition around Fugetsu: Zetsu-like aura weakness, an unstable heartbeat, and numerous evil spirits. An exorcist appears necessary, but the responsible user, official ability, body, trigger, and motive are unknown.',
      activation: 'Unknown.',
      conditions: ['Fugetsu is the observed affected target.', 'Many hostile spirits are visible/sensible around her to Melody while her aura and heartbeat are severely weakened.'],
      limitations: ['User, official name, Nen type, activation route, target-selection rule, range, duration, and removal mechanism are unknown.', 'Melody’s hostage-negotiation theory remains speculation.', 'No causal connection to Magical Worm is established.'],
      targets: ['Fugetsu Hui Guo Rou in Chapter 400'],
      range: 'unknown',
      duration: 'ongoing at Chapter 400 endpoint',
      knownUses: ['Chapter 400: Melody detects the spirit infestation and concludes that an exorcist is needed.'],
      certainty: 'unknown',
    }),
  ]),
});
