import { getSpecifiedCardMedia } from './specifiedCardMedia.js';

/**
 * Canonical Greed Island Specified Slot registry.
 * Primary source: https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists
 * Verified: 2026-07-21
 */

export const GREED_ISLAND_CARD_SOURCE = Object.freeze({
  id: 'hunterpedia-card-list',
  label: 'Greed Island Card Lists',
  href: 'https://hunterxhunter.fandom.com/wiki/Greed_Island_Card_Lists',
  verifiedAt: '2026-07-21',
});

export const GREED_ISLAND_CARD_RANKS = Object.freeze(['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS']);

const coreRecords = [
  [0, "Ruler's Blessing", 'SS', 1],
  [1, 'Patch of Forest', 'SS', 3],
  [2, 'Plot of Beach', 'SS', 3],
  [3, 'Pitcher of Eternal Water', 'A', 17],
  [4, 'Skin Care Hot Springs', 'A', 15],
  [5, 'Spirited Away Hollow', 'S', 8],
  [6, 'Liquor Spring', 'A', 15],
  [7, 'Pregnancy Stones', 'S', 10],
  [8, 'Mystery Pond', 'S', 10],
  [9, 'Tree of Plenty', 'S', 10],
  [10, 'Golden Guidebook', 'A', 20],
  [11, 'Golden Scales', 'B', 30],
  [12, 'Golden Dictionary', 'S', 10],
  [13, 'Luck Bankbook', 'A', 20],
  [14, 'Connection Severing Scissors', 'B', 22],
  [15, 'Fickle Genie', 'S', 10],
  [16, "Fairy King's Advice", 'S', 6],
  [17, "Angel's Breath", 'SS', 3],
  [18, "Imp's Wink", 'A', 18],
  [19, 'Poltergeist Pillow', 'A', 13],
  [20, 'Mood Clock', 'B', 30],
  [21, 'X-Ray Goggles', 'B', 27],
  [22, 'Toraemon', 'A', 22],
  [23, 'Tome of a Thousand Tales', 'B', 30],
  [24, 'Hypothetical T.V.', 'A', 20],
  [25, 'Risky Dice', 'B', 30],
  [26, 'Night Shift Dwarves', 'A', 20],
  [27, 'Book of V.I.P Passes', 'B', 25],
  [28, 'Capricious Remote', 'B', 27],
  [29, 'Pre-Order Vouchers', 'A', 20],
  [30, 'Favor Cushion', 'B', 21],
  [31, 'Double Postcard to the Dead', 'S', 13],
  [32, 'Parrot Candy', 'B', 30],
  [33, 'Hormone Cookies', 'S', 13],
  [34, 'Universal Survey', 'B', 30],
  [35, 'Chameleon Cat', 'S', 6],
  [36, 'Recycling Room', 'S', 10],
  [37, 'Fledgling Athlete', 'B', 30],
  [38, 'Fledgling Artist', 'B', 30],
  [39, 'Fledgling Politician', 'B', 30],
  [40, 'Fledgling Musician', 'B', 30],
  [41, 'Fledgling Pilot', 'B', 30],
  [42, 'Fledgling Novelist', 'B', 30],
  [43, 'Fledgling Gambler', 'B', 30],
  [44, 'Fledgling Actor', 'B', 30],
  [45, 'Fledgling CEO', 'B', 30],
  [46, 'Gold Dust Girl', 'A', 13],
  [47, 'Sleeping Girl', 'A', 11],
  [48, 'Aromatherapy Girl', 'A', 15],
  [49, 'Miniature Mermaid', 'A', 23],
  [50, 'Miniature Dino', 'A', 11],
  [51, 'Miniature Dragon', 'S', 10],
  [52, 'Pearl Locusts', 'B', 30],
  [53, 'King White Stag Beetle', 'A', 30],
  [54, 'Millennium Butterfly', 'A', 25],
  [55, 'Revenge Shop', 'A', 20],
  [56, 'Perfect Memory Studio', 'B', 25],
  [57, 'Hideout Realtor', 'A', 11],
  [58, 'Secrets Video Rental', 'A', 13],
  [59, 'Instant Foreign Language School', 'A', 20],
  [60, 'Long Lost Delivery', 'B', 30],
  [61, 'Vending Check-Up', 'A', 20],
  [62, 'Club "You Rule"', 'B', 20],
  [63, 'Virtual Restaurant', 'B', 30],
  [64, "Witch's Love Potion", 'B', 30],
  [65, "Witch's Rejuvenation Potion", 'S', 10],
  [66, "Witch's Diet Pills", 'B', 28],
  [67, "Doyen's Growth Pills", 'B', 30],
  [68, "Doyen's Virility Pills", 'A', 20],
  [69, "Doyen's Hair Restorer", 'B', 30],
  [70, "Mad Scientist's Steroids", 'A', 16],
  [71, "Mad Scientist's Pheromones", 'A', 20],
  [72, "Mad Scientist's Plastic Surgery", 'A', 15],
  [73, 'Night Jade', 'A', 15],
  [74, "Sage's Aquamarine", 'A', 11],
  [75, 'Wild Luck Alexandrite', 'A', 20],
  [76, 'Roaming Ruby', 'B', 30],
  [77, 'Beauty Magnet Emerald', 'S', 10],
  [78, 'Lonely Sapphire', 'B', 30],
  [79, 'Rainbow Diamond', 'A', 20],
  [80, 'Levitation Stone', 'S', 7],
  [81, 'Blue Planet', 'SS', 5],
  [82, 'Staff of Judgment', 'A', 15],
  [83, 'Sword of Truth', 'B', 22],
  [84, "Paladin's Necklace", 'D', 60],
  [85, 'Scapegoat/Sacrifice Armor', 'S', 8],
  [86, 'Quiver of Frustration', 'A', 11],
  [87, 'Shield of Faith', 'S', 15],
  [88, 'Eternal Hammer', 'A', 15],
  [89, "Tax Collector's Gauntlet", 'A', 20],
  [90, 'Memory Helmet', 'A', 20],
  [91, 'Plastic King', 'A', 20],
  [92, 'Swap Ticket', 'S', 7],
  [93, 'Book of Life', 'B', 28],
  [94, "Bandit's Blade", 'S', 10],
  [95, 'Secret Cape', 'A', 20],
  [96, 'Clairvoyant Snake', 'A', 12],
  [97, '3-D Camera', 'A', 20],
  [98, 'Silver Dog', 'S', 8],
  [99, 'Panda Maid', 'S', 6],
];

function buildSpecifiedCards(records) {
  if (records.length !== 100) throw new Error(`Greed Island registry must contain 100 cards; found ${records.length}.`);
  const names = new Set();

  return records.map(([number, name, rank, conversionLimit], index) => {
    const id = String(number).padStart(3, '0');
    if (number !== index) throw new Error(`Greed Island registry is missing or misorders Specified Slot ${String(index).padStart(3, '0')}.`);
    if (!name || names.has(name)) throw new Error(`Greed Island registry has an invalid or duplicate name at ${id}.`);
    if (!GREED_ISLAND_CARD_RANKS.includes(rank)) throw new Error(`Card ${id} has unsupported rank ${rank}.`);
    if (!Number.isInteger(conversionLimit) || conversionLimit < 1) throw new Error(`Card ${id} has an invalid conversion limit.`);
    names.add(name);

    const media = getSpecifiedCardMedia(id);
    if (!media) throw new Error(`Card ${id} is missing its verified Hunterpedia image record.`);

    return Object.freeze({
      id,
      number,
      name,
      rank,
      conversionLimit,
      category: 'specified',
      border: 'red',
      description: null,
      acquisition: null,
      story: null,
      sourceRef: GREED_ISLAND_CARD_SOURCE.id,
      verification: Object.freeze({ core: 'verified', description: 'pending', acquisition: 'pending', story: 'pending', media: 'verified-remote' }),
      media,
    });
  });
}

export const specifiedCards = Object.freeze(buildSpecifiedCards(coreRecords));
export const specifiedCardById = new Map(specifiedCards.map((card) => [card.id, card]));
export const getSpecifiedCard = (id) => specifiedCardById.get(String(id).padStart(3, '0')) || null;
