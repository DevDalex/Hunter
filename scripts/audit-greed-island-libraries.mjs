import {
  documentedFreeSlotCards,
  gameMasterCards,
  greedIslandCardLibraryCollections,
  SPELL_CLASS_LABELS,
  spellCards,
  spellCardsById,
} from '../src/data/greed-island/cardLibraries.js';
import { PROTECTION_TUTORIAL_EXAMPLES, SPELL_TUTORIAL_EXAMPLES } from '../src/data/greed-island/tutorialRules.js';

const assert = (condition, message) => {
  if (!condition) throw new Error(`Greed Island library audit failed: ${message}`);
};

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
assert(attackCount === 11, `expected 11 Attack Spells, found ${attackCount}`);
assert(defenseCount === 7, `expected 7 defensive/counter spells, found ${defenseCount}`);
assert(spellCardsById.get('1035')?.classes.includes('AA'), 'Fortress must remain Anti-Attack capable');
assert(gameMasterCards.some((card) => card.name === 'Eliminate'), 'Eliminate GM card is missing');

console.log(`Greed Island library audit passed: ${spellCards.length} Spell Cards, ${documentedFreeSlotCards.length} documented Free Slot cards, ${gameMasterCards.length} GM-only cards, ${attackCount} attacks, ${defenseCount} defensive/counter spells.`);
