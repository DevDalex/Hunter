export const GREED_ISLAND_LIBRARY_SOURCE = Object.freeze({
  id: 'hunterpedia-greed-island-card-libraries',
  label: 'Greed Island Card Lists — Free, Spell, and Game Master cards',
  href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists',
  verifiedAt: '2026-07-21',
});

export const SPELL_CLASS_LABELS = Object.freeze({
  SR: 'Short Range',
  LR: 'Long Range',
  RS: 'Regular Spell',
  AS: 'Attack Spell',
  DS: 'Defensive Spell',
  AA: 'Anti-Attack Spell',
  C: 'Continuous Spell',
  VS: 'Versus Spell',
  '*S': 'Special Spell',
});

const spell = (id, name, range, classes, rank, limit, target, effect, behavior = []) => Object.freeze({
  id: String(id),
  number: Number(id),
  name,
  category: 'spell',
  border: 'blue',
  range,
  classes: Object.freeze(classes),
  rank,
  conversionLimit: limit,
  target,
  effect,
  behavior: Object.freeze(behavior),
  acquisition: Object.freeze({
    status: 'verified',
    summary: 'Available from random Spell Card packs sold at the Spell Card Shop in Masadora.',
    location: 'Masadora Spell Card Shop',
    source: GREED_ISLAND_LIBRARY_SOURCE.href,
  }),
  source: GREED_ISLAND_LIBRARY_SOURCE.href,
  verifiedAt: GREED_ISLAND_LIBRARY_SOURCE.verifiedAt,
});

export const spellCards = Object.freeze([
  spell(1001, 'Peek', 'LR', ['RS'], 'G', 200, 'previously-met player', 'Shows the target player’s Free Slot contents.', ['scan', 'free-slots']),
  spell(1002, 'Fluoroscopy', 'LR', ['RS'], 'F', 150, 'previously-met player', 'Shows the target player’s Specified Slot contents.', ['scan', 'specified-slots']),
  spell(1003, 'Defensive Wall', 'SR', ['DS'], 'G', 400, 'self', 'Blocks one Attack Spell aimed at the user.', ['defense', 'one-use']),
  spell(1004, 'Reflect', 'SR', ['DS'], 'E', 120, 'previously-met player', 'Reflects one Attack Spell from a previously met player.', ['defense', 'reflect']),
  spell(1005, 'Magnetic Force', 'LR', ['RS'], 'C', 50, 'previously-met player', 'Moves one person to the target player’s location.', ['travel', 'player-target']),
  spell(1006, 'Pickpocket', 'SR', ['AS'], 'F', 170, 'player', 'Steals one random card from the target player’s Free Slots.', ['attack', 'steal', 'free-slots']),
  spell(1007, 'Thief', 'SR', ['AS'], 'C', 50, 'player', 'Steals one random card from the target player’s Specified Slots.', ['attack', 'steal', 'specified-slots']),
  spell(1008, 'Trade', 'SR', ['AS'], 'E', 100, 'player', 'Randomly swaps one caster-owned card for one target-player card.', ['attack', 'swap']),
  spell(1009, 'Return', 'LR', ['RS'], 'G', 380, 'visited place', 'Moves the caster back to a previously visited location.', ['travel', 'place-target']),
  spell(1010, 'Mimic', 'SR', ['RS'], 'A', 20, 'owned card', 'Transforms into a copy of a target card already owned by the caster if the copy limit allows it.', ['transform', 'limit-check']),
  spell(1011, 'Clone', 'SR', ['RS'], 'D', 70, 'player', 'Changes into one random imposed-slot card from the target player if a valid copy can exist.', ['transform', 'opponent-card']),
  spell(1012, 'Relegate', 'SR', ['RS'], 'F', 140, 'player', 'Makes the target player fly somewhere on the island.', ['travel', 'player-target']),
  spell(1013, 'Origin', 'SR', ['RS'], 'D', 65, 'player', 'Moves the target player to the game starting point.', ['travel', 'starting-point']),
  spell(1014, 'Leave', 'SR', ['RS'], 'B', 30, 'player', 'Makes the target player leave Greed Island.', ['travel', 'exit']),
  spell(1015, 'Clairvoyance', 'LR', ['RS'], 'D', 70, 'player', 'Shows all card data for the target player.', ['scan', 'all-cards']),
  spell(1016, 'Drift', 'SR', ['RS'], 'F', 200, 'self', 'Moves the player to a random unvisited town, or disappears without movement if none remain.', ['travel', 'random-town']),
  spell(1017, 'Collision', 'SR', ['RS'], 'F', 200, 'self', 'Moves the caster to a random unmet player, or disappears without movement if all players have been met.', ['travel', 'random-player']),
  spell(1018, 'Levy', 'SR', ['RS'], 'B', 25, 'nearby players', 'Takes one random card from each player within a 20-meter radius.', ['area', 'steal']),
  spell(1019, 'Drawbridge', 'SR', ['DS', 'AA', 'VS'], 'F', 200, 'self', 'Protects once against a Short Range Regular Spell from another player.', ['defense', 'anti-attack', 'counter']),
  spell(1020, 'Fake', 'SR', ['RS'], 'C', 40, 'specified card number', 'Transforms into a false card from 001–099 that can occupy an imposed slot but cannot complete the set or become an object.', ['transform', 'fake-card']),
  spell(1021, 'Mug', 'SR', ['AS'], 'B', 30, 'player', 'Lets the caster take one chosen card from the target player.', ['attack', 'steal', 'chosen-card']),
  spell(1022, 'Corruption', 'SR', ['AS'], 'C', 40, 'player', 'Transforms one target above-B card into a below-D card number chosen by the caster when the limit permits it.', ['attack', 'transform', 'rank-down']),
  spell(1023, 'Compromise', 'SR', ['AS'], 'B', 25, 'player', 'Destroys one target above-A card and gives the target an available card three ranks lower.', ['attack', 'destroy', 'rank-down']),
  spell(1024, 'Dispel', 'SR', ['RS'], 'D', 80, 'player', 'Returns Fake, Clone, or Mimic transformations to their original forms and destroys invalid slot results.', ['cleanse', 'transform-counter']),
  spell(1025, 'Blackout Curtain', 'SR', ['DS', 'C'], 'F', 200, 'self', 'Continuously protects the user from Peek and Fluoroscopy.', ['defense', 'continuous', 'scan-block']),
  spell(1026, 'Holy Water', 'SR', ['DS', 'C'], 'A', 20, 'self', 'Protects ten times against Attack Spells and resists stealing and destruction effects.', ['defense', 'continuous', 'ten-use']),
  spell(1027, 'Trace', 'SR', ['AS'], 'E', 90, 'player', 'Tracks the current location of one target player until that player leaves the game.', ['attack', 'tracking']),
  spell(1028, 'Rock Toss', 'SR', ['AS'], 'E', 100, 'player', 'Destroys one random card in the target player’s Free Slots.', ['attack', 'destroy', 'free-slots']),
  spell(1029, 'Bullet', 'SR', ['AS'], 'B', 25, 'player', 'Destroys one random card in the target player’s imposed or Specified Slots.', ['attack', 'destroy', 'specified-slots']),
  spell(1030, 'Guidepost', 'LR', ['RS'], 'E', 120, 'card number', 'Reveals the location for a chosen card number, except number 000.', ['scan', 'card-location']),
  spell(1031, 'Analysis', 'LR', ['RS'], 'G', 400, 'card number', 'Shows the explanation for a chosen card number, except number 000.', ['scan', 'card-explanation']),
  spell(1032, 'Lottery', 'SR', ['RS'], 'G', 350, 'self', 'Transforms into a random item card.', ['random', 'item-card']),
  spell(1033, 'Cling', 'SR', ['AS'], 'C', 50, 'player', 'Keeps the target player’s restricted-slot data available until that player leaves the game.', ['attack', 'tracking', 'specified-slots']),
  spell(1034, 'Purify', 'SR', ['RS'], 'D', 55, 'transformed card', 'Dispels a transformation spell and returns a transformed card to its original form, with limit consequences applied.', ['cleanse', 'transform-counter']),
  spell(1035, 'Fortress', 'SR', ['DS', 'C', 'AA'], 'S', 10, 'Specified Slot page', 'Continuously protects cards on a chosen imposed-slot page from stealing and destruction while they remain inserted.', ['defense', 'continuous', 'anti-attack', 'specified-slots']),
  spell(1036, 'Eye of God', 'LR', ['C'], 'S', 10, 'all Specified cards', 'Gives the caster List and Analysis effects for all cards 000–099 until the target player leaves the game.', ['scan', 'continuous', 'specified-slots']),
  spell(1037, 'Recycle', 'SR', ['RS'], 'F', 170, 'card-reverted item', 'Lets an item converted from a below-C card become a card once more if the limit is not full.', ['conversion', 'limit-check']),
  spell(1038, 'List', 'LR', ['RS'], 'G', 350, 'card number', 'Reveals how many people possess the target card and the total number of copies.', ['scan', 'copy-count']),
  spell(1039, 'Accompany', 'SR', ['RS'], 'F', 130, 'visited city or met player', 'Moves the caster and nearby players to a visited city or previously met player.', ['travel', 'group']),
  spell(1040, 'Contact', 'LR', ['RS'], 'F', 200, 'previously-met player', 'Allows Binder communication with a previously met player for up to three minutes.', ['communication', 'binder']),
]);

const free = (number, name, rank, limitLabel, kind, effect, extra = {}) => Object.freeze({
  id: number === null ? `free-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : String(number),
  number,
  displayNumber: number === null ? '?' : String(number),
  name,
  category: 'free',
  border: 'yellow',
  rank,
  conversionLimit: Number.isFinite(extra.limit) ? extra.limit : null,
  limitLabel,
  kind,
  effect,
  source: GREED_ISLAND_LIBRARY_SOURCE.href,
  verifiedAt: GREED_ISLAND_LIBRARY_SOURCE.verifiedAt,
});

export const documentedFreeSlotCards = Object.freeze([
  free(100, "Map of the Island 'empty'", 'G', '400', 'map', 'A blank island map that automatically fills with towns and markers as the player travels.', { limit: 400 }),
  free(101, "Map of the Island 'detailed'", 'D', '70', 'map', 'A detailed island map that already shows all towns and markers.', { limit: 70 }),
  free(102, 'Voucher', 'SS', '150', 'quest-item', 'A special voucher that can transform into Angel’s Breath when one becomes available.', { limit: 150 }),
  free(110, "Ruler's Invitation", 'SS', '1', 'quest-item', 'A letter inviting the bearer to visit Limeiro and its castle.', { limit: 1 }),
  free(163, 'Sick Villagers', 'F', '150', 'npc', 'Sick villagers represented in card form.', { limit: 150 }),
  free(263, 'Healthy Villagers', 'C', '50', 'npc', 'Healthy villagers represented in card form.', { limit: 50 }),
  free(266, 'Transport Ticket', 'B', '150', 'transport', 'A ticket that gives the bearer safe passage out of the game.', { limit: 150 }),
  free(572, 'Giant Cyclops', 'G', '333', 'creature', 'A giant one-eyed creature that travels in groups and attacks intruders in its territory.', { limit: 333 }),
  free(585, 'Bubble Horse', 'C', '50', 'creature', 'A hard-to-catch creature that emits aura-reactive and non-aura-reactive bubbles when threatened.', { limit: 50 }),
  free(598, 'Chief of Wolf Pack', 'C', '45', 'creature', 'The leader of a wolf pack that attacks travelers.', { limit: 45 }),
  free(607, 'J10,000', 'H', '∞', 'currency', 'Ten thousand Jenny converted into card form.'),
  free(673, 'Hyper Puffball', 'D', '80', 'creature', 'A very fast, hard-to-catch little creature.', { limit: 80 }),
  free(697, 'Melanin Lizard', 'E', '100', 'creature', 'A very large lizard big enough to eat a cow whole.', { limit: 100 }),
  free(711, 'Radio Rat', 'H', '800', 'creature', 'A hard-to-catch creature that uses aura to control armor as a decoy.', { limit: 800 }),
  free(1217, 'Galgaida', 'F', '185', 'fish', 'A fish that tastes delicious when cooked.', { limit: 185 }),
  free(7018, 'Chidon', 'C', '?', 'fish', 'A fish documented with an uncertain limit and a Chapter 172 debut.'),
  free(null, 'Gold Dust Girl Guard', 'F', '?', 'npc', 'An NPC who guarded the Gold Dust Girl.'),
  free(14170, 'Gasoline', 'H', '∞', 'item', 'A flammable vial of gasoline.'),
  free(21449, 'Rock', 'H', '∞', 'item', 'A simple hard rock that can vary in size.'),
  free(25008, 'Large Rock', 'H', '∞', 'item', 'A large rock.'),
]);

const gm = (id, name, effect) => Object.freeze({
  id,
  displayNumber: id,
  name,
  category: 'game-master',
  border: 'black',
  range: 'LR',
  classes: Object.freeze(['*S']),
  effect,
  access: 'Game Master only',
  source: GREED_ISLAND_LIBRARY_SOURCE.href,
  verifiedAt: GREED_ISLAND_LIBRARY_SOURCE.verifiedAt,
});

export const gameMasterCards = Object.freeze([
  gm('-000', 'Debug', 'Forcibly activates a special in-game event.'),
  gm('-001', 'Under Control', 'Stops an NPC or enemy from taking further actions.'),
  gm('-002', 'Reset', 'Resets all card data for one target player.'),
  gm('-003', 'Eliminate', 'Transports illegal Greed Island entrants to a random location on the Azian Continent.'),
]);

export const spellCardsById = new Map(spellCards.map((card) => [card.id, card]));
export const documentedFreeSlotCardById = new Map(documentedFreeSlotCards.map((card) => [card.id, card]));
export const gameMasterCardById = new Map(gameMasterCards.map((card) => [card.id, card]));

export const greedIslandCardLibraryCollections = Object.freeze({
  spell: Object.freeze({ id: 'spell', label: 'Spell Cards', cards: spellCards, border: 'blue' }),
  free: Object.freeze({ id: 'free', label: 'Documented Free Slot Cards', cards: documentedFreeSlotCards, border: 'yellow' }),
  gm: Object.freeze({ id: 'gm', label: 'Game Master-only Cards', cards: gameMasterCards, border: 'black' }),
});

const rankSet = new Set(['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS']);
if (spellCards.length !== 40) throw new Error(`Expected 40 Greed Island Spell Cards; found ${spellCards.length}.`);
if (documentedFreeSlotCards.length !== 20) throw new Error(`Expected 20 documented Free Slot Cards; found ${documentedFreeSlotCards.length}.`);
if (gameMasterCards.length !== 4) throw new Error(`Expected 4 Game Master-only cards; found ${gameMasterCards.length}.`);
for (const [index, card] of spellCards.entries()) {
  if (card.id !== String(1001 + index)) throw new Error(`Spell Card order drifted at ${card.id}.`);
  if (!rankSet.has(card.rank)) throw new Error(`Spell Card ${card.id} has unsupported rank ${card.rank}.`);
  if (!Number.isInteger(card.conversionLimit) || card.conversionLimit < 1) throw new Error(`Spell Card ${card.id} has invalid limit.`);
  for (const code of [card.range, ...card.classes]) if (!SPELL_CLASS_LABELS[code]) throw new Error(`Spell Card ${card.id} uses unknown class ${code}.`);
}
for (const card of documentedFreeSlotCards) {
  if (!rankSet.has(card.rank)) throw new Error(`Free Slot Card ${card.displayNumber} has unsupported rank ${card.rank}.`);
  if (!card.effect || !card.kind) throw new Error(`Free Slot Card ${card.displayNumber} is missing effect or kind.`);
}
for (const card of gameMasterCards) {
  if (!card.id.startsWith('-00')) throw new Error(`Game Master Card ${card.id} must keep its negative number.`);
  if (!card.classes.includes('*S')) throw new Error(`Game Master Card ${card.id} must be Special Spell class.`);
}
