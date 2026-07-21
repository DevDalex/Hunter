import { spellCardsById, SPELL_CLASS_LABELS } from './cardLibraries.js';

export const GREED_ISLAND_RULE_SOURCES = Object.freeze({
  overview: Object.freeze({
    id: 'greed-island-overview',
    label: 'Greed Island — Ring, Binder, and Cards',
    href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island#Ring,_Binder,_and_Cards',
    verifiedAt: '2026-07-21',
  }),
  cards: Object.freeze({
    id: 'greed-island-card-lists',
    label: 'Greed Island Card Lists',
    href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists',
    verifiedAt: '2026-07-21',
  }),
  eta: Object.freeze({
    id: 'eta-quiz',
    label: 'Eta — completion quiz',
    href: 'https://hunterxhunter.fandom.com/wiki/Eta',
    verifiedAt: '2026-07-21',
  }),
});

export const ETA_TUTORIAL_LESSONS = Object.freeze([
  ['ring', 'The Ring', 'The ring connects a player to the game system and recognizes the keyword commands “Book” and “Gain”.', 'overview'],
  ['book', '“Book”', 'Saying “Book” materializes the Binder used to store cards and access supported game information.', 'overview'],
  ['binder', 'The Binder', 'The Binder contains 100 numbered Specified Slots, 45 unnumbered Free Slots, and a list of players already met.', 'overview'],
  ['anatomy', 'Card anatomy', 'A card records its number, name, rank and conversion limit, illustration, and effect or description.', 'cards'],
  ['slots', 'Specified and Free Slots', 'Specified cards must occupy matching numbered pockets. Free and Spell cards can be stored in the 45 Free Slots.', 'cards'],
  ['ranks', 'Card ranks', 'Acquisition difficulty runs from H through SS. Rank describes difficulty and scarcity, not a universal combat-power scale.', 'cards'],
  ['limits', 'Conversion limits', 'The conversion limit caps how many copies of a card can exist at once. A full limit blocks new conversions until a copy leaves card form or save data is lost.', 'cards'],
  ['gain', '“Gain”', 'A newly acquired card must enter the Binder within one minute or it reverts permanently. Saying “Gain” also returns a held card to material form, ordinarily preventing it from becoming a card again.', 'overview'],
  ['targeting', 'Spell targeting', 'A Spell Card can be spoken with “On” and a target, or inserted into the Binder terminal so a target can be selected.', 'cards'],
  ['protection', 'Protection and counters', 'When the target has the Binder open and owns a defensive spell, an Attack Spell waits 15 seconds. Defensive and counter spells can then block, reflect, or protect against documented effects.', 'cards'],
  ['completion', 'Completing the game', 'Collecting cards 001–099 opens a 100-question quiz. The highest score receives card 000, completing the 100-card set.', 'eta'],
  ['review', 'Practice and replay', 'Review the command words, slot rules, ranks, limits, spell flow, and completion sequence at any time.', 'cards'],
].map(([id, title, summary, sourceId], index) => Object.freeze({
  id,
  number: String(index + 1).padStart(2, '0'),
  title,
  summary,
  sourceId,
})));

export const CARD_ANATOMY_PARTS = Object.freeze([
  Object.freeze({ id: 'number', label: 'Designation number', position: 'Upper left', note: 'Identifies the card and, for Specified cards, its matching Binder pocket.' }),
  Object.freeze({ id: 'name', label: 'Card name', position: 'Upper center', note: 'The item or spell name used by the game system.' }),
  Object.freeze({ id: 'rank-limit', label: 'Rank and conversion limit', position: 'Upper right', note: 'Shows acquisition difficulty and the maximum number of simultaneous card copies.' }),
  Object.freeze({ id: 'illustration', label: 'Illustration', position: 'Center', note: 'Shows the item, creature, location, or spell represented by the card.' }),
  Object.freeze({ id: 'description', label: 'Description or function', position: 'Bottom', note: 'Explains what the card becomes or what its effect does.' }),
]);

export const CARD_RANK_ORDER = Object.freeze(['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS']);

const classNameFor = (card) => [card.range, ...card.classes].map((code) => SPELL_CLASS_LABELS[code]).join(' · ');
const spellExample = (id, target, outcome) => {
  const card = spellCardsById.get(id);
  if (!card) throw new Error(`Eta tutorial references missing Spell Card ${id}.`);
  return Object.freeze({ id: card.id, name: card.name, className: classNameFor(card), target, effect: card.effect, outcome });
};

export const SPELL_TUTORIAL_EXAMPLES = Object.freeze([
  spellExample('1005', 'player', 'The caster travels to the selected player.'),
  spellExample('1006', 'player', 'A random Free Slot card is selected by the simulation.'),
  spellExample('1009', 'place', 'The caster travels to the selected visited location.'),
  spellExample('1031', 'card number', 'The selected card explanation is displayed.'),
]);

const protectionExample = (id, uses, outcome) => {
  const card = spellCardsById.get(id);
  if (!card) throw new Error(`Eta protection tutorial references missing Spell Card ${id}.`);
  return Object.freeze({ id: card.id, name: card.name, uses, outcome });
};

export const PROTECTION_TUTORIAL_EXAMPLES = Object.freeze([
  protectionExample('1003', 1, 'Blocks one Attack Spell.'),
  protectionExample('1004', 1, 'Reflects one Attack Spell from a previously met player.'),
  protectionExample('1026', 10, 'Protects against ten Attack Spells and resists stealing and destruction effects.'),
  protectionExample('1035', null, 'Continuously protects cards on a chosen Specified Slot page from stealing and destruction while they remain inserted.'),
]);

if (ETA_TUTORIAL_LESSONS.length !== 12) throw new Error('Eta tutorial must contain exactly 12 lessons.');
if (new Set(ETA_TUTORIAL_LESSONS.map((lesson) => lesson.id)).size !== 12) throw new Error('Eta tutorial lesson ids must be unique.');
