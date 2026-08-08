const freeze = (value) => Object.freeze(value);
const characterId = (name) => `character:${String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
const chapterSourceId = (number) => `source:chapter-${number}`;

const ability = ({ slug, name, aliases = [], summary, owners = [], nenTypes = ['unknown'], certainty = 'confirmed', category, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', status = 'active', knownUses = [], sourceChapters, researchStatus = 'documented' }) => freeze({
  id: `ability:${slug}`,
  entityType: 'ability',
  slug,
  name,
  aliases: freeze(aliases),
  summary,
  sourceIds: freeze(sourceChapters.map(chapterSourceId)),
  publicationStatus: 'published',
  canonLevel: 'canon',
  createdAt: '2026-08-09',
  updatedAt: '2026-08-09',
  ownerIds: freeze(owners.map(characterId)),
  classification: freeze({ nenTypes: freeze(nenTypes), certainty }),
  category,
  activation,
  conditions: freeze(conditions),
  limitations: freeze(limitations),
  costs: freeze(costs),
  targets: freeze(targets),
  range,
  duration,
  status,
  knownUses: freeze(knownUses),
  firstChapter: Math.min(...sourceChapters),
  latestChapter: Math.max(...sourceChapters),
  sourceChapterNumbers: freeze([...sourceChapters]),
  researchStatus,
});

export const abilityFoundation379Expansion = freeze([
  ability({
    slug: 'luini-transportation',
    name: 'Luini transportation ability',
    aliases: ['Unnamed Luini spatial transportation ability'],
    summary: 'Luini uses a sealed one-door room as a spatial hub for travel to marked locations and can return to that room while its door remains closed.',
    owners: ['Luini'],
    nenTypes: ['unknown'],
    certainty: 'confirmed',
    category: 'spatial transportation / marked-location travel',
    activation: 'Luini must establish himself inside a sealed room with exactly one door.',
    conditions: [
      'The origin room must be sealed.',
      'The origin room must have exactly one door.',
      'Travel is possible to locations Luini has marked.',
      'Luini can return to the original room while its only door remains closed.',
    ],
    limitations: [
      'Opening the room’s only door breaks the sealed condition and resets the active transportation setup.',
      'Chapter 379 does not supply the official ability name.',
      'Maximum range, maximum marked destinations, full marking procedure, transport capacity, and other restrictions remain unknown.',
    ],
    targets: ['self / spatial route between sealed room and marked locations'],
    range: 'Unknown; Chapter 379 demonstrates movement among lower-tier locations.',
    duration: 'Persists while the origin room remains sealed under the disclosed condition.',
    knownUses: [
      'Luini travels between attack locations using the sealed-room route.',
      'Luini uses a dead Cha-R guard’s body to infiltrate and mark the Cha-R hideout as a transportation destination.',
    ],
    sourceChapters: [379],
    researchStatus: 'Core sealed-room and reset mechanics confirmed / official name and full operating envelope open',
  }),
]);
