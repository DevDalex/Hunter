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

export const abilityFoundation377Expansion = freeze([
  ability({
    slug: 'battle-cantabile-metamorphorsen',
    name: 'Battle Cantabile: Metamorphorsen',
    aliases: ['Metamorphorsen'],
    summary: 'Bonolenov’s transformation ability, revealed during the Phantom Troupe’s Hisoka search. Chapter 377 establishes that it allows him to transform into various things or forms.',
    owners: ['Bonolenov Ndongo'],
    nenTypes: ['unknown'],
    certainty: 'confirmed',
    category: 'transformation / disguise',
    activation: 'Complete activation procedure is not supplied in Chapter 377.',
    limitations: [
      'Chapter 377 does not establish the full range of valid forms.',
      'Duration, costs, copied properties beyond transformed appearance/form, and cancellation rules remain unknown.',
    ],
    targets: ['self'],
    range: 'self',
    knownUses: ['Bonolenov proposes using the transformation ability as part of the search for Hisoka.'],
    sourceChapters: [377],
    researchStatus: 'core transformation function confirmed / detailed mechanics open',
  }),
]);
