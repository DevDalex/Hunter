import {
  GREED_ISLAND_SYSTEM_SOURCES,
  greedIslandGameMasterControls,
  greedIslandLocationById,
  greedIslandLocations,
  greedIslandPlayerSystems,
  greedIslandQuestRecords,
  greedIslandQuestById,
  greedIslandSystemStats,
  resolveGreedIslandSystemSource,
} from '../src/data/greed-island/islandSystems.js';
import { documentedFreeSlotCardById, gameMasterCardById, spellCardsById } from '../src/data/greed-island/cardLibraries.js';
import { enrichedSpecifiedCardById } from '../src/data/greed-island/specifiedCardsEnriched.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island systems audit failed: ${message}`);
};

const unique = (records, label) => {
  const ids = records.map((item) => item.id);
  assert(new Set(ids).size === ids.length, `${label} ids must be unique`);
};

const allowedCommandCards = new Set(['Book', 'Gain', '1001-1040']);
const cardExists = (rawId) => {
  const id = String(rawId);
  if (allowedCommandCards.has(id)) return true;
  if (enrichedSpecifiedCardById.has(id)) return true;
  if (spellCardsById.has(id)) return true;
  if (documentedFreeSlotCardById.has(id)) return true;
  if (gameMasterCardById.has(id)) return true;
  return false;
};

assert(greedIslandLocations.length === 9, `expected 9 locations/facilities, found ${greedIslandLocations.length}`);
assert(greedIslandQuestRecords.length === 8, `expected 8 quest records, found ${greedIslandQuestRecords.length}`);
assert(greedIslandPlayerSystems.length === 6, `expected 6 player systems, found ${greedIslandPlayerSystems.length}`);
assert(greedIslandGameMasterControls.length === 6, `expected 6 Game Master controls, found ${greedIslandGameMasterControls.length}`);
assert(greedIslandSystemStats.locations === greedIslandLocations.length, 'location stat drifted');
assert(greedIslandSystemStats.quests === greedIslandQuestRecords.length, 'quest stat drifted');
assert(greedIslandSystemStats.playerSystems === greedIslandPlayerSystems.length, 'player-system stat drifted');
assert(greedIslandSystemStats.gameMasterControls === greedIslandGameMasterControls.length, 'GM-control stat drifted');
assert(greedIslandQuestById.get('soufrabi-plot-of-beach')?.cards.includes('002'), 'Plot of Beach quest must remain mapped to card 002');

unique(greedIslandLocations, 'location');
unique(greedIslandQuestRecords, 'quest');
unique(greedIslandPlayerSystems, 'player-system');
unique(greedIslandGameMasterControls, 'GM-control');

for (const [key, source] of Object.entries(GREED_ISLAND_SYSTEM_SOURCES)) {
  assert(source.id && source.label && source.verifiedAt, `source ${key} is incomplete`);
  assert(source.href.startsWith('https://hunterxhunter.fandom.com/wiki/'), `source ${key} is outside Hunterpedia/Fandom`);
}

for (const location of greedIslandLocations) {
  assert(location.name && location.role.length >= 40, `${location.id} needs a readable role`);
  assert(location.status === 'verified', `${location.id} must remain a verified location/facility`);
  assert(Number.isFinite(location.x) && location.x >= 0 && location.x <= 100, `${location.id} has invalid map x`);
  assert(Number.isFinite(location.y) && location.y >= 0 && location.y <= 100, `${location.id} has invalid map y`);
  assert(resolveGreedIslandSystemSource(location.sourceId).href, `${location.id} has an unresolved source`);
  for (const connection of location.connections) {
    assert(greedIslandLocationById.has(connection), `${location.id} links to unknown location ${connection}`);
  }
}

for (const quest of greedIslandQuestRecords) {
  assert(greedIslandLocationById.has(quest.locationId), `${quest.id} points to unknown location ${quest.locationId}`);
  assert(['verified', 'archive-simulation'].includes(quest.status), `${quest.id} has unsupported status ${quest.status}`);
  assert(quest.summary.length >= 50, `${quest.id} summary is too thin`);
  assert(quest.cards.length > 0, `${quest.id} needs card links`);
  assert(quest.rewards.length > 0, `${quest.id} needs rewards`);
  assert(quest.steps.length >= 3, `${quest.id} needs a three-step archive flow`);
  assert(resolveGreedIslandSystemSource(quest.sourceId).href, `${quest.id} has unresolved source`);
  for (const card of quest.cards) assert(cardExists(card), `${quest.id} references unknown card ${card}`);
}

for (const system of greedIslandPlayerSystems) {
  assert(['verified', 'archive-simulation'].includes(system.status), `${system.id} has unsupported status ${system.status}`);
  assert(system.summary.length >= 45, `${system.id} summary is too thin`);
  assert(system.tags.length > 0, `${system.id} needs tags`);
  assert(resolveGreedIslandSystemSource(system.sourceId).href, `${system.id} has unresolved source`);
  for (const card of system.cards) assert(cardExists(card), `${system.id} references unknown card ${card}`);
}

for (const control of greedIslandGameMasterControls) {
  assert(control.gm && control.controlType && control.summary.length >= 45, `${control.id} is incomplete`);
  assert(control.status === 'verified', `${control.id} must stay source-verified`);
  assert(resolveGreedIslandSystemSource(control.sourceId).href, `${control.id} has unresolved source`);
  for (const card of control.cards) assert(cardExists(card), `${control.id} references unknown card ${card}`);
}

assert(greedIslandLocations.some((location) => location.id === 'soufrabi' && location.tags.includes('plot-of-beach')), 'Soufrabi must keep Plot of Beach tag');
assert(greedIslandLocations.some((location) => location.id === 'port' && location.tags.includes('transport')), 'Port must keep transport tag');
assert(greedIslandGameMasterControls.some((control) => control.cards.includes('-003') && control.summary.includes('Eliminate')), 'Eliminate GM control is missing');
assert(greedIslandPlayerSystems.some((system) => system.tags.includes('defense-window')), 'player-system defense window record is missing');

console.log(`Greed Island systems audit passed: ${greedIslandLocations.length} locations, ${greedIslandQuestRecords.length} quests, ${greedIslandPlayerSystems.length} player systems, ${greedIslandGameMasterControls.length} GM controls.`);
