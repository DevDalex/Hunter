import {
  GREED_ISLAND_TACTICAL_SOURCES,
  biscuitTrainingModules,
  bomberMechanics,
  finalBattleRecords,
  greedIslandTacticalStats,
  razorDodgeballPhases,
  resolveGreedIslandTacticalSource,
  tacticalCardExists,
  tacticalRecordCollections,
} from '../src/data/greed-island/tacticalRecords.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island tactical audit failed: ${message}`);
};
const unique = (records, label) => {
  const ids = records.map((record) => record.id);
  assert(new Set(ids).size === ids.length, `${label} ids must be unique`);
};

const allRecords = [...biscuitTrainingModules, ...razorDodgeballPhases, ...bomberMechanics, ...finalBattleRecords];
assert(biscuitTrainingModules.length === 5, `expected 5 Biscuit training modules, found ${biscuitTrainingModules.length}`);
assert(razorDodgeballPhases.length === 6, `expected 6 Razor dodgeball phases, found ${razorDodgeballPhases.length}`);
assert(bomberMechanics.length === 5, `expected 5 Bomber mechanics, found ${bomberMechanics.length}`);
assert(finalBattleRecords.length === 3, `expected 3 final battle records, found ${finalBattleRecords.length}`);
assert(greedIslandTacticalStats.trainingModules === biscuitTrainingModules.length, 'training stat drifted');
assert(greedIslandTacticalStats.dodgeballPhases === razorDodgeballPhases.length, 'dodgeball stat drifted');
assert(greedIslandTacticalStats.bomberMechanics === bomberMechanics.length, 'bomber stat drifted');
assert(greedIslandTacticalStats.finalBattles === finalBattleRecords.length, 'battle stat drifted');
assert(Object.keys(tacticalRecordCollections).length === 4, 'tactical collection count drifted');

unique(biscuitTrainingModules, 'training');
unique(razorDodgeballPhases, 'dodgeball');
unique(bomberMechanics, 'bomber');
unique(finalBattleRecords, 'battle');

for (const [key, source] of Object.entries(GREED_ISLAND_TACTICAL_SOURCES)) {
  assert(source.id && source.label && source.verifiedAt, `source ${key} is incomplete`);
  assert(source.href.startsWith('https://hunterxhunter.fandom.com/wiki/'), `source ${key} is outside Hunterpedia/Fandom`);
}

for (const record of allRecords) {
  assert(['verified', 'source-bounded', 'archive-simulation'].includes(record.status), `${record.id} has unsupported status ${record.status}`);
  assert(record.title && record.summary.length >= 70, `${record.id} needs a readable tactical summary`);
  assert(record.actors.length > 0, `${record.id} needs actors`);
  assert(record.tags.length > 0, `${record.id} needs tags`);
  assert(record.steps.length >= 3, `${record.id} needs at least three steps`);
  assert(resolveGreedIslandTacticalSource(record.sourceId).href, `${record.id} has unresolved source`);
  for (const card of record.cards) assert(tacticalCardExists(card), `${record.id} references unknown card ${card}`);
}

const phaseOrders = razorDodgeballPhases.map((phase) => phase.order);
assert(phaseOrders.join(',') === '1,2,3,4,5,6', `Razor phase order drifted: ${phaseOrders.join(',')}`);
assert(razorDodgeballPhases.some((phase) => phase.id === 'eight-player-rule' && phase.summary.includes('eight players')), 'eight-player dodgeball rule is missing');
assert(razorDodgeballPhases.some((phase) => phase.tags.includes('bungee-gum')), 'Bungee Gum finish is missing');
assert(bomberMechanics.some((record) => record.id === 'caught-bomber-disarm' && record.summary.includes('I caught the Bomber')), 'Countdown disarm condition is missing');
assert(bomberMechanics.some((record) => record.id === 'release-ritual' && record.actors.includes('Sub') && record.actors.includes('Bara')), 'Release ritual trio record is incomplete');
assert(biscuitTrainingModules.some((record) => record.id === 'gyo-feint-read' && record.counters.includes('Little Flower')), 'Gyo/Little Flower counter training is missing');
assert(finalBattleRecords.some((battle) => battle.id === 'gon-vs-genthru' && battle.cards.includes('14170')), 'Gon vs Genthru must keep Gasoline link');
assert(finalBattleRecords.some((battle) => battle.id === 'killua-vs-sub'), 'Killua vs Sub battle is missing');
assert(finalBattleRecords.some((battle) => battle.id === 'biscuit-vs-bara' && battle.cards.includes('017')), 'Biscuit vs Bara Angel’s Breath aftermath is missing');

console.log(`Greed Island tactical audit passed: ${biscuitTrainingModules.length} training modules, ${razorDodgeballPhases.length} dodgeball phases, ${bomberMechanics.length} Bomber mechanics, ${finalBattleRecords.length} battle records.`);
