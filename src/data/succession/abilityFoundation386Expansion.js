const freeze = (value) => Object.freeze(value);
const characterId = (name) => `character:${String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
const chapterSourceId = (number) => `source:chapter-${number}`;

export const abilityFoundation386Expansion = freeze([
  freeze({
    id: 'ability:halkenburg-possession-arrow',
    entityType: 'ability',
    slug: 'halkenburg-possession-arrow',
    name: 'Halkenburg collective possession arrow',
    aliases: freeze(['Halkenburg collective bow-and-arrow attack']),
    summary: 'A descriptive archive label for Halkenburg’s unnamed collective attack. Chapter 382 establishes the overwhelming collective arrow and body/will exchange; Chapter 386 begins a controlled experiment on what happens to the exchanged consciousnesses when the occupied target body dies.',
    sourceIds: freeze([chapterSourceId(382), chapterSourceId(386)]),
    publicationStatus: 'published',
    canonLevel: 'canon',
    createdAt: '2026-08-09',
    updatedAt: '2026-08-09',
    ownerIds: freeze([characterId('Halkenburg Hui Guo Rou')]),
    classification: freeze({ nenTypes: freeze(['unknown']), certainty: 'confirmed' }),
    category: 'collective symbiotic body-will transfer attack',
    activation: 'Halkenburg and his followers generate a concentrated collective aura state; Halkenburg forms an aura bow and fires the followers’ aura as the arrow. Chapter 386 does not supply a new activation step, but shows the group deliberately testing the post-transfer state.',
    conditions: freeze([
      'The attack operates through Halkenburg’s collective fellowship rather than his aura alone.',
      'The previously established feather-marked symbiotic group is the source context for the amplified collective aura.',
      'A successful transfer involves one Halkenburg follower collapsing while the struck target body becomes controlled by the Halkenburg side.',
      'In the Chapter 386 test, Halkenburg’s group treats Sumidori as the consciousness operating Shikaku’s body.',
    ]),
    limitations: freeze([
      'No official ability name is supplied in Chapters 382 or 386.',
      'Shikaku’s original consciousness destination remains unresolved.',
      'After the Shikaku body dies, Sumidori’s original body wakes, but the supplied synopsis ends before Halkenburg’s identity check is answered.',
      'The exact rule governing consciousness return after the occupied body dies therefore remains unresolved at the Chapter 386 boundary.',
      'Kurapika separately infers that the distant aura rumbling may correspond to an Emitter attack, but he does not know the attacker or target; that inference is not used to classify this ability as confirmed Emission.',
    ]),
    costs: freeze(['A Halkenburg follower’s original body becomes inactive during the demonstrated exchange and the occupied target body can be placed in lethal danger as part of the experiment.']),
    targets: freeze(['hostile individual struck by the collective arrow']),
    range: 'projectile range not quantified',
    duration: 'post-hit consciousness-control duration unresolved; Chapter 386 tests termination through occupied-body death',
    status: 'active',
    knownUses: freeze([
      'Chapter 382: Halkenburg fires at Shikaku; the arrow pierces Culdcept, one follower collapses, and Shikaku’s body rises aligned with Halkenburg’s side.',
      'Chapter 386: Halkenburg’s group identifies Sumidori as the controller of Shikaku’s body for the experiment and lists four possible states for Shikaku’s original consciousness.',
      'Chapter 386: the Sumidori-controlled Shikaku body deliberately shoots itself in the head; afterward Sumidori’s original body wakes and Halkenburg begins an identity check.',
    ]),
    firstChapter: 382,
    latestChapter: 386,
    sourceChapterNumbers: freeze([382, 386]),
    researchStatus: 'core transfer and lethal follow-up experiment documented / original-target consciousness and return rule unresolved',
  }),
]);
