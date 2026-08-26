const freeze = (value) => Object.freeze(value);
const characterId = (name) => `character:${String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
const chapterSourceId = (number) => `source:chapter-${number}`;

const ability = ({ slug, name, aliases = [], summary, owners = [], nenTypes = ['unknown'], certainty = 'confirmed', canonLevel = 'canon', category, activation, conditions = [], limitations = [], costs = [], targets = [], range = 'unknown', duration = 'unknown', status = 'active', knownUses = [], researchStatus = 'documented' }) => freeze({
  id: `ability:${slug}`,
  entityType: 'ability',
  slug,
  name,
  aliases: freeze(aliases),
  summary,
  sourceIds: freeze([chapterSourceId(384)]),
  publicationStatus: 'published',
  canonLevel,
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
  firstChapter: 384,
  latestChapter: 384,
  sourceChapterNumbers: freeze([384]),
  researchStatus,
});

export const abilityFoundation384Expansion = freeze([
  ability({
    slug: 'tserriednich-instinctive-specialist-nen-beast',
    name: 'Tserriednich’s Instinctive Specialist Nen Beast',
    aliases: ['Tserriednich’s Alter Ego Nen Beast'],
    summary: 'During Chapter 384 Nen training, Theta recognizes a second Nen beast around Tserriednich that is separate from his Seed Urn Guardian Spirit Beast. She identifies it as a product of his own Specialist Nen, created instinctively and without conscious intent, and describes it as his alter ego.',
    owners: ['Tserriednich Hui Guo Rou'],
    nenTypes: ['specialization'],
    certainty: 'confirmed',
    category: 'instinctive-specialist-nen-beast-manifestation',
    activation: 'Chapter 384 shows the beast manifesting without Tserriednich consciously intending or designing it while his Nen develops.',
    conditions: ['The Chapter 384 manifestation arises from Tserriednich’s own Specialist Nen rather than the Seed Urn Ceremony.', 'Theta observes the second beast existing alongside the separate parasitic Guardian Spirit Beast.'],
    limitations: ['No official ability name is supplied in Chapter 384.', 'The chapter does not reveal the beast’s complete function, targeting rules, costs, range, duration, or relationship to later Tserriednich abilities.', 'Theta’s “alter ego” description is preserved as her characterization rather than converted into a proven consciousness or identity-transfer mechanic.'],
    targets: ['unknown'],
    range: 'unknown',
    duration: 'unknown',
    knownUses: ['Manifests beside Tserriednich during Theta’s Nen lesson while his Seed Urn Guardian Spirit Beast is also present.'],
    researchStatus: 'existence, Specialist origin, unintended manifestation, and distinction from the Guardian Spirit Beast confirmed / full ability unresolved',
  }),
]);
