import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  documentedFreeSlotCards,
  gameMasterCards,
  greedIslandCardLibraryCollections,
  SPELL_CLASS_LABELS,
  spellCards,
  spellCardsById,
} from '../src/data/greed-island/cardLibraries.js';
import { cardLibraryLocalMedia } from '../src/data/greed-island/cardLibraryLocalMedia.generated.js';
import { cardLibraryRemoteMedia } from '../src/data/greed-island/cardLibraryMedia.js';
import { PROTECTION_TUTORIAL_EXAMPLES, SPELL_TUTORIAL_EXAMPLES } from '../src/data/greed-island/tutorialRules.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island library audit failed: ${message}`);
};

const root = process.cwd();
const ranks = new Set(['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS']);
const classCodes = new Set(Object.keys(SPELL_CLASS_LABELS));

assert(spellCards.length === 40, `expected 40 Spell Cards, found ${spellCards.length}`);
assert(documentedFreeSlotCards.length === 20, `expected 20 documented Free Slot cards, found ${documentedFreeSlotCards.length}`);
assert(gameMasterCards.length === 4, `expected 4 Game Master-only cards, found ${gameMasterCards.length}`);
assert(greedIslandCardLibraryCollections.spell.cards === spellCards, 'spell collection does not expose canonical spellCards');
assert(greedIslandCardLibraryCollections.free.cards === documentedFreeSlotCards, 'free collection does not expose documentedFreeSlotCards');
assert(greedIslandCardLibraryCollections.gm.cards === gameMasterCards, 'gm collection does not expose gameMasterCards');

for (const [index, card] of spellCards.entries()) {
  const expected = String(1001 + index);
  assert(card.id === expected, `Spell Card order drifted: expected ${expected}, found ${card.id}`);
  assert(card.category === 'spell' && card.border === 'blue', `${card.id} does not keep Spell Card category/border`);
  assert(ranks.has(card.rank), `${card.id} uses unsupported rank ${card.rank}`);
  assert(Number.isInteger(card.conversionLimit) && card.conversionLimit > 0, `${card.id} has invalid conversion limit`);
  assert(classCodes.has(card.range), `${card.id} uses unknown range ${card.range}`);
  assert(card.classes.length > 0, `${card.id} has no spell class`);
  for (const code of card.classes) assert(classCodes.has(code), `${card.id} uses unknown class ${code}`);
  assert(card.effect.length >= 24, `${card.id} effect is too thin`);
  assert(card.acquisition.status === 'verified', `${card.id} acquisition must be verified to Masadora`);
}

for (const card of documentedFreeSlotCards) {
  assert(card.category === 'free' && card.border === 'yellow', `${card.displayNumber} does not keep Free Slot category/border`);
  assert(ranks.has(card.rank), `${card.displayNumber} uses unsupported rank ${card.rank}`);
  assert(card.kind && card.effect.length >= 16, `${card.displayNumber} missing kind or effect`);
  assert(card.displayNumber === '?' || /^\d+$/.test(card.displayNumber), `${card.name} has invalid display number`);
}

for (const [index, card] of gameMasterCards.entries()) {
  const expected = `-00${index}`;
  assert(card.id === expected, `Game Master number drifted: expected ${expected}, found ${card.id}`);
  assert(card.category === 'game-master' && card.border === 'black', `${card.id} does not keep GM category/border`);
  assert(card.range === 'LR' && card.classes.includes('*S'), `${card.id} must be Long Range Special Spell`);
  assert(card.access === 'Game Master only', `${card.id} must stay restricted`);
}

for (const item of [...SPELL_TUTORIAL_EXAMPLES, ...PROTECTION_TUTORIAL_EXAMPLES]) {
  assert(spellCardsById.has(item.id), `tutorial references missing Spell Card ${item.id}`);
}

const attackCount = spellCards.filter((card) => card.classes.includes('AS')).length;
const defenseCount = spellCards.filter((card) => card.classes.some((code) => ['DS', 'AA', 'VS'].includes(code))).length;
assert(attackCount === 10, `expected 10 Attack Spells, found ${attackCount}`);
assert(defenseCount === 6, `expected 6 defensive/counter spells, found ${defenseCount}`);
assert(spellCardsById.get('1035')?.classes.includes('AA'), 'Fortress must remain Anti-Attack capable');
assert(gameMasterCards.some((card) => card.name === 'Eliminate'), 'Eliminate GM card is missing');

assert(cardLibraryRemoteMedia.length === 62, `expected 62 exact Hunterpedia table images, found ${cardLibraryRemoteMedia.length}`);
assert(cardLibraryLocalMedia.length === 62, `expected 62 local card-library WebPs, found ${cardLibraryLocalMedia.length}`);
assert(new Set(cardLibraryLocalMedia.map((record) => record.cardId)).size === 62, 'local card-library media ids are not unique');
const remoteById = new Map(cardLibraryRemoteMedia.map((record) => [record.cardId, record]));
for (const record of cardLibraryLocalMedia) {
  const remote = remoteById.get(record.cardId);
  assert(remote, `${record.cardId} local artwork has no exact table-image registry record`);
  assert(record.imageSource === remote.remote, `${record.cardId} local artwork source drifted from Hunterpedia table image`);
  assert(record.filePage === remote.filePage, `${record.cardId} local artwork file-page provenance drifted`);
  assert(/^\/media\/greed-island\/library-cards\/(?:gm-)?\d+\.webp$/.test(record.src), `${record.cardId} uses invalid local artwork path ${record.src}`);
  assert(!record.src.includes('/portraits/'), `${record.cardId} incorrectly uses a portrait fallback`);
  const bytes = await readFile(path.join(root, 'public', record.src.slice(1)));
  assert(bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP', `${record.cardId} local artwork is not WebP`);
  assert(record.width >= 120 && record.height >= 120, `${record.cardId} local artwork dimensions are unexpectedly small`);
}

const localIds = new Set(cardLibraryLocalMedia.map((record) => record.cardId));
for (const card of spellCards) assert(localIds.has(card.id), `${card.id} Spell Card is missing local artwork`);
for (const card of gameMasterCards) assert(localIds.has(card.id), `${card.id} Game Master card is missing local artwork`);
assert(documentedFreeSlotCards.filter((card) => localIds.has(card.id)).length === 18, 'documented Free Slot artwork coverage must remain 18/20; the table explicitly shows no image for two records');

console.log(`Greed Island library audit passed: ${spellCards.length} Spell Cards, ${documentedFreeSlotCards.length} documented Free Slot cards, ${gameMasterCards.length} GM-only cards, ${cardLibraryLocalMedia.length} local table images, ${attackCount} attacks, ${defenseCount} defensive/counter spells.`);
