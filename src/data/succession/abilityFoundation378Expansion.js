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

export const abilityFoundation378Expansion = freeze([
  ability({
    slug: 'contagion',
    name: 'Contagion',
    summary: 'Morena Prudo initiates an infected community whose members gain levels through killing, unlock a Nen ability at level 20, and can create a new infected community at level 100.',
    owners: ['Morena Prudo'],
    nenTypes: ['unknown'],
    certainty: 'confirmed',
    category: 'infection / community progression',
    activation: 'Morena infects a recruit by kissing them on the lips.',
    conditions: [
      'The Chapter 378 initiation group contains twenty-three people including Morena.',
      'Civilian kills are worth 1 level, Nen-user kills 10 levels, and prince kills 50 levels.',
      'At level 20 an infected member gains a Nen ability.',
      'At level 100 an infected member can start a new infected community.',
    ],
    limitations: [
      'Chapter 378 does not establish Morena’s complete control over infected members.',
      'Chapter 378 does not establish all membership, replacement, expulsion, transfer, or successor-community rules.',
      'Individual abilities obtained through progression are not predictable from the shared system in the supplied text.',
    ],
    costs: ['Progression is explicitly tied to killing people.'],
    targets: ['Morena’s selected recruits / infected community members'],
    range: 'Initiation requires direct physical contact; later community range is not established in Chapter 378.',
    duration: 'Not established in Chapter 378.',
    knownUses: [
      'Morena kisses twenty-two followers to create a twenty-three-person infected community including herself.',
      'Luini’s killings cross the level-20 threshold and result in acquisition of an unnamed transportation Nen ability.',
    ],
    sourceChapters: [378],
    researchStatus: 'Core Chapter 378 progression rules confirmed / later community mechanics excluded from this boundary',
  }),
]);
