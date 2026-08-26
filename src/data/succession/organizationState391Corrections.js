const freeze = (value) => Object.freeze(value);
const chapterSourceId = (number) => `source:chapter-${number}`;

const state = ({ organizationId, start = 391, end = 391, operationalState, authority, territoryIds = [], objectiveStates = [], pressure = [], relatedEventIds = [], certainty = 'confirmed', sources = [start] }) => freeze({
  id: `organization-state:${organizationId.replace('organization:', '')}:${start}`,
  organizationId,
  chapterRange: freeze({ start, end }),
  status: 'active',
  operationalState,
  authority,
  territoryIds: freeze(territoryIds),
  objectiveStates: freeze(objectiveStates),
  pressure: freeze(pressure),
  relatedEventIds: freeze(relatedEventIds),
  certainty,
  sourceIds: freeze(sources.map(chapterSourceId)),
});

export const organizationState391Corrections = freeze({
  'organization:xi-yu': freeze([
    state({
      organizationId: 'organization:xi-yu',
      operationalState: 'Hinrigh splits Xi-Yu’s Tier 3 operation: Lynch and Zakuro continue the Hisoka search under a contact-first instruction while Hinrigh traces Heil-Ly members, uses public camera evidence, deploys Biohazard surveillance, and personally fights Tevelares, Quorolle, and Padaille. Hinrigh kills Padaille while the other two escape.',
      authority: 'Onior’s Chapter 390 command remains in force through Hinrigh’s underboss field authority over Lynch and Zakuro.',
      territoryIds: ['location:black-whale:tier-3', 'location:black-whale:tier-3:xi-yu-office'],
      objectiveStates: ['Find Hisoka without Lynch or Zakuro engaging him before contacting Hinrigh.', 'Identify Heil-Ly members and access routes.', 'Track Heil-Ly without allowing capture or hideout intelligence to slip away.', 'Continue the Morena-elimination operation established in Chapter 390.'],
      pressure: ['The prior soldier killings have created public panic on Tier 3.', 'Heil-Ly members are actively watching the standard-cabin access hallway.', 'Padaille attacks Hinrigh with a newly revealed Conjuration ability.', 'Tevelares and Quorolle escape after Padaille is killed.', 'Hinrigh says he is counting on Misha, but Chapter 391 does not define her task.'],
      relatedEventIds: ['event:xiyu-splits-hisoka-and-heilly-search', 'event:hinrigh-identifies-standard-cabin-watch-route', 'event:biohazard-camcorder-cat-surveillance', 'event:tier-3-padaille-battle', 'event:hinrigh-kills-padaille-with-axe-form'],
    }),
    state({
      organizationId: 'organization:xi-yu',
      start: 392,
      end: null,
      operationalState: 'After the Chapter 391 Padaille confrontation, Hinrigh’s Xi-Yu field operation continues into later route-testing, Room 3101 reconnaissance, and temporary coordination with Phantom Troupe members while investigating Heil-Ly’s hidden movement system.',
      authority: 'Onior’s family command remains delegated to Hinrigh as active underboss and field coordinator.',
      territoryIds: ['location:black-whale:tier-3:xi-yu-office', 'location:black-whale:tier-3:public-corridor', 'location:black-whale:tier-3:room-3101'],
      objectiveStates: ['Map Heil-Ly’s hidden route system.', 'Protect public territory and Xi-Yu personnel.', 'Use temporary alliances without surrendering Xi-Yu control.'],
      pressure: ['Heil-Ly spatial abilities remain incompletely understood.', 'Temporary Phantom Troupe cooperation can collapse without warning.'],
      relatedEventIds: ['event:room-3101-breach'],
      sources: [392, 394, 398, 399],
    }),
  ]),
  'organization:heil-ly': freeze([
    state({
      organizationId: 'organization:heil-ly',
      operationalState: 'Heil-Ly personnel monitor the standard-cabin access route on Tier 3 and directly confront Hinrigh. Tevelares (level 24 Enhancer, civil engineer), Quorolle (level 22 Emitter, repairman), and Padaille (level 29 Conjurer, demolition worker) debate the Contagion reward for killing a Nen user before Padaille attacks and is killed. Tevelares and Quorolle retreat to seek Morena’s instructions.',
      authority: 'Morena remains the acknowledged ability user and “game master” in the members’ discussion. Their expectation that she will decide reward allocation is explicit; Quorolle’s belief that she can probably monitor members at all times remains an inference.',
      territoryIds: ['location:black-whale:tier-3'],
      objectiveStates: ['Observe and defend the standard-cabin access route.', 'Accumulate Contagion levels through killing.', 'Avoid capture and disclosure of the hideout.', 'Return to Morena for instructions after Padaille’s death.'],
      pressure: ['Xi-Yu is actively identifying Heil-Ly personnel by footage and aura.', 'Hinrigh’s Biohazard surveillance and restraint tactics defeat Padaille’s direct attack.', 'Padaille is killed.', 'The exact multi-attacker allocation of a ten-level Nen-user kill reward is unresolved.', 'Hinrigh’s rebellion/training interpretation is not confirmed as Heil-Ly’s actual motive.'],
      relatedEventIds: ['event:hinrigh-identifies-standard-cabin-watch-route', 'event:heilly-trio-levels-types-and-nen-user-kill-value', 'event:padaille-activates-fistful-of-weapons', 'event:tier-3-padaille-battle', 'event:hinrigh-kills-padaille-with-axe-form'],
    }),
  ]),
});
