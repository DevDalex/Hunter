import { DEEP_GLOSSARY_ENTRIES } from './contentDepthExpansionReference.js';

const freeze = (values = []) => Object.freeze([...values]);
const wiki = (slug = 'Nen') => `https://hunterxhunter.fandom.com/wiki/${slug}`;

export const normalizeGlossaryText = (value) => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase()
  .replace(/[’‘`´]/g, "'")
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const singularVariant = (value) => {
  const normalized = normalizeGlossaryText(value);
  const words = normalized.split(' ').filter(Boolean);
  if (!words.length) return normalized;
  const last = words.at(-1);
  if (last.length > 3 && last.endsWith('s') && !last.endsWith('ss')) words[words.length - 1] = last.slice(0, -1);
  return words.join(' ');
};

const aliasKeys = (entry) => new Set(
  [entry?.term, ...(entry?.synonyms || [])]
    .flatMap((value) => [normalizeGlossaryText(value), singularVariant(value)])
    .filter(Boolean),
);

const intersects = (left, right) => [...left].some((value) => right.has(value));
const uniqueStrings = (values = []) => [...new Map(values.filter(Boolean).map((value) => [normalizeGlossaryText(value), value])).values()];
const uniqueById = (values = []) => [...new Map(values.filter(Boolean).map((value) => [value.id || value.url || JSON.stringify(value), value])).values()];

const term = ({
  id,
  term: label,
  definition,
  synonyms = [],
  relatedTerms = [],
  sourceSlug = 'Nen',
  category = 'Nen reference',
}) => Object.freeze({
  id: `glossary:nen-reference:${id}`,
  recordType: 'glossary',
  slug: `nen-reference-${id}`,
  term: label,
  definition,
  category,
  firstChapter: 339,
  synonyms: freeze(synonyms),
  relatedEntityIds: freeze([]),
  relatedTerms: freeze(relatedTerms),
  sourceIds: freeze([]),
  externalSources: freeze([Object.freeze({
    id: `external-source:nen-reference:${id}`,
    entityType: 'source',
    sourceType: 'reference',
    name: `${label} Nen reference`,
    url: wiki(sourceSlug),
    note: 'Series-level Nen terminology that predates or supplements the Succession Contest archive. It is available from the Chapter 339 archive handoff and is not presented as a Chapter 339 introduction.',
  })]),
  certainty: 'canon',
  availabilityNote: 'Series-level Nen vocabulary; visible from the Succession archive entry boundary rather than treated as newly introduced in Chapter 339.',
});

export const SUCCESSION_NEN_GLOSSARY_ENTRIES = freeze([
  term({ id: 'aura', term: 'Aura', definition: 'Life energy released by living beings and consciously controlled by Nen users.', relatedTerms: ['Aura nodes', 'Ten', 'Ren'], sourceSlug: 'Aura' }),
  term({ id: 'aura-nodes', term: 'Aura nodes', definition: 'Points throughout the body through which aura flows; Nen training teaches a user to open and regulate that flow.', relatedTerms: ['Aura', 'Ten', 'Nen initiation'], sourceSlug: 'Aura_Nodes' }),
  term({ id: 'ten', term: 'Ten', definition: 'The basic practice of keeping aura around the body instead of allowing it to leak away, providing stable protection and maintenance.', relatedTerms: ['Ren', 'Ken', 'Four Major Principles'], sourceSlug: 'Ten' }),
  term({ id: 'zetsu', term: 'Zetsu', definition: 'Closing aura nodes to suppress outward aura. It improves concealment and recovery while sharply reducing active aura defense, and can also serve as an ability condition.', relatedTerms: ['Ten', 'In', 'Parallel Future'], sourceSlug: 'Zetsu' }),
  term({ id: 'ren', term: 'Ren', definition: 'Producing and sustaining a larger volume of aura than ordinary Ten, increasing usable offensive and defensive output at a stamina cost.', relatedTerms: ['Ten', 'Ken', 'En'], sourceSlug: 'Ren' }),
  term({ id: 'hatsu', term: 'Hatsu', definition: 'The personal expression of Nen shaped by a user’s nature, training, categories, conditions, and intended effect.', relatedTerms: ['Nen categories', 'Conditions and limitations', 'Named ability'], sourceSlug: 'Hatsu' }),
  term({ id: 'four-major-principles', term: 'Four Major Principles', definition: 'Ten, Zetsu, Ren, and Hatsu, the basic framework used to learn and describe Nen control.', synonyms: ['Four Major Principles of Nen'], relatedTerms: ['Ten', 'Zetsu', 'Ren', 'Hatsu'], sourceSlug: 'Nen#Four_Major_Principles' }),
  term({ id: 'gyo', term: 'Gyo', definition: 'Concentrating a larger share of aura in one body part; using it in the eyes can reveal aura concealed with In.', relatedTerms: ['In', 'Ko', 'Ryu'], sourceSlug: 'Gyo' }),
  term({ id: 'in', term: 'In', definition: 'An advanced concealment technique that hides aura or aura-created effects from ordinary Nen perception; Gyo can counter it.', relatedTerms: ['Zetsu', 'Gyo', 'Conjuration'], sourceSlug: 'In' }),
  term({ id: 'en', term: 'En', definition: 'Expanding controlled aura around the user to detect movement or intrusion within an area; range, shape, stability, and sensitivity vary by user.', relatedTerms: ['Ren', 'Ten', 'En range vs quality'], sourceSlug: 'En' }),
  term({ id: 'shu', term: 'Shu', definition: 'Extending Ten around an object so the object is reinforced as part of the user’s aura defense and offense.', relatedTerms: ['Ten', 'Weapons'], sourceSlug: 'Shu' }),
  term({ id: 'ko', term: 'Ko', definition: 'Concentrating nearly all available aura into one body part for maximum force or defense while leaving the rest of the body highly exposed.', relatedTerms: ['Gyo', 'Ken', 'Ryu'], sourceSlug: 'Ko' }),
  term({ id: 'ken', term: 'Ken', definition: 'Maintaining a strong full-body defensive aura by sustaining Ren within Ten.', relatedTerms: ['Ten', 'Ren', 'Ryu'], sourceSlug: 'Ken' }),
  term({ id: 'ryu', term: 'Ryu', definition: 'Rapidly redistributing aura across the body during combat to adjust offense and defense in response to an opponent.', relatedTerms: ['Gyo', 'Ken', 'Ko'], sourceSlug: 'Ryu' }),
  term({ id: 'enhancement', term: 'Enhancement', definition: 'A Nen category that strengthens the natural properties or performance of a body or object.', relatedTerms: ['Transmutation', 'Emission', 'Water Divination'], sourceSlug: 'Enhancement' }),
  term({ id: 'transmutation', term: 'Transmutation', definition: 'A Nen category that changes the qualities of aura so it behaves like another substance or property.', relatedTerms: ['Enhancement', 'Conjuration'], sourceSlug: 'Transmutation' }),
  term({ id: 'emission', term: 'Emission', definition: 'A Nen category concerned with separating aura from the body while retaining useful force or function at range.', relatedTerms: ['Enhancement', 'Manipulation', 'Remote Nen persistence'], sourceSlug: 'Emission' }),
  term({ id: 'conjuration', term: 'Conjuration', definition: 'A Nen category that materializes objects or structures from aura, often with special rules or restrictions.', relatedTerms: ['Transmutation', 'Specialization', 'Conditions and limitations'], sourceSlug: 'Conjuration' }),
  term({ id: 'manipulation', term: 'Manipulation', definition: 'A Nen category that controls living beings, objects, or processes through ability-specific activation and command rules.', relatedTerms: ['Emission', 'Specialization', 'Manipulation precedence'], sourceSlug: 'Manipulation' }),
  term({ id: 'specialization', term: 'Specialization', definition: 'The Nen category for effects that do not fit the five regular categories; unusual effects are not automatically Specialist without source support.', relatedTerms: ['Conjuration', 'Manipulation'], sourceSlug: 'Specialization' }),
  term({ id: 'category-affinity', term: 'Category affinity', definition: 'The efficiency framework describing how naturally a Nen user can learn and apply techniques in their own and neighboring categories.', synonyms: ['Nen affinity'], relatedTerms: ['Nen categories', 'Water Divination'], sourceSlug: 'Nen#Aura_Types' }),
  term({ id: 'water-divination', term: 'Water Divination', definition: 'A classification test that identifies a user’s natural Nen category by observing characteristic changes around water and a floating leaf.', relatedTerms: ['Nen categories', 'Category affinity'], sourceSlug: 'Water_Divination' }),
  term({ id: 'nen-initiation', term: 'Nen initiation', definition: 'The process of opening a learner’s aura nodes and teaching immediate control; safe instruction is distinct from dangerous forced awakening.', synonyms: ['Initiation and forced awakening'], relatedTerms: ['Aura nodes', 'Ten', 'Forced Nen awakening'], sourceSlug: 'Nen#Initiation' }),
  term({ id: 'telltale-signs', term: 'Telltale signs', definition: 'Observable aura behavior, movement, habits, and reactions that experienced users can use to infer whether someone is trained in Nen.', relatedTerms: ['Gyo', 'In', 'Nen initiation'], sourceSlug: 'Telltale_Signs' }),
  term({ id: 'conditions-limitations', term: 'Conditions and limitations', definition: 'Rules restricting activation, targets, timing, behavior, or cost. Stronger restrictions can enable narrower or stronger effects but remain ability-specific.', synonyms: ['Conditions', 'Restrictions'], relatedTerms: ['Vows', 'Hatsu', 'Ability activation stack'], sourceSlug: 'Conditions' }),
  term({ id: 'vows', term: 'Vows', definition: 'Self-imposed commitments or consequences that reinforce Nen through genuine resolve and risk.', synonyms: ['Vows and limitations'], relatedTerms: ['Conditions and limitations', 'Post-mortem Nen'], sourceSlug: 'Vows_and_Limitations' }),
  term({ id: 'nen-curses-exorcism', term: 'Nen curses and exorcism', definition: 'Hostile or burdensome Nen attached to a target, and the specialized methods used to remove, contain, transfer, or neutralize it.', synonyms: ['Nen curse', 'Nen exorcism'], relatedTerms: ['Post-mortem Nen', 'Have-Not', 'Exorcism consequence'], sourceSlug: 'Nen#Nen_curses' }),
  term({ id: 'nen-beasts', term: 'Nen beasts', definition: 'Aura entities created or maintained by abilities. Their autonomy, visibility, fuel, control, and termination rules depend on the creating ability.', synonyms: ['Nen beast'], relatedTerms: ['Guardian Spirit Beast', 'Parasitic Nen'], sourceSlug: 'Nen_Beast' }),
  term({ id: 'collaborative-abilities', term: 'Collaborative abilities', definition: 'Nen abilities whose activation or output depends on several users, supporters, hosts, marks, or synchronized actions.', synonyms: ['Compound-type abilities', 'Cooperative Nen'], relatedTerms: ['Conditions and limitations', 'Symbiotic and cooperative Nen'], sourceSlug: 'Nen#Compound-type_abilities' }),
  term({ id: 'ability-transfer', term: 'Loaned, stolen, and inherited abilities', definition: 'A family of distinct Nen mechanisms that lend, steal, copy, preserve, or inherit abilities under different acquisition and retention rules.', synonyms: ['Ability transfer', 'Transferred abilities'], relatedTerms: ['Ability lending', 'Ability theft', 'Ability inheritance', 'Benjamin Baton'], sourceSlug: 'Nen' }),
  term({ id: 'manipulation-precedence', term: 'Manipulation precedence', definition: 'The interaction in which an already-established Manipulation effect can block or alter a later attempt to control the same target.', relatedTerms: ['Manipulation', 'Self-Manipulation defense'], sourceSlug: 'Manipulation' }),
  term({ id: 'aura-reserves-output', term: 'Aura reserves vs output', definition: 'Total aura reserves and the amount a user can release or commit at one moment are different practical variables.', synonyms: ['Aura quantity vs output'], relatedTerms: ['Aura', 'Ren', 'Ken'], sourceSlug: 'Aura' }),
  term({ id: 'aura-control-precision', term: 'Aura control and precision', definition: 'The skill of shaping, maintaining, concealing, distributing, and redirecting aura accurately and efficiently.', relatedTerms: ['Gyo', 'Ryu', 'Hatsu'], sourceSlug: 'Aura' }),
  term({ id: 'aura-recovery-endurance', term: 'Aura recovery and endurance', definition: 'Nen performance depends on aura expenditure, recovery, and physical or mental stamina rather than one undifferentiated energy total.', relatedTerms: ['Zetsu', 'Ren', 'Ken'], sourceSlug: 'Nen' }),
  term({ id: 'zetsu-perception-tradeoff', term: 'Zetsu and perception trade-off', definition: 'Zetsu improves aura concealment and can satisfy ability conditions, but removes most active aura defense and therefore creates deliberate vulnerability.', relatedTerms: ['Zetsu', 'Parallel Future', 'Conditions and limitations'], sourceSlug: 'Zetsu' }),
  term({ id: 'en-range-quality', term: 'En range vs quality', definition: 'En should be evaluated by shape, stability, duration, sensitivity, and environmental limits in addition to raw distance.', relatedTerms: ['En', 'Aura control and precision'], sourceSlug: 'En' }),
  term({ id: 'remote-nen-persistence', term: 'Remote Nen persistence', definition: 'Nen effects can continue operating away from their user through ability-specific mechanisms such as Emission, marks, mediums, constructs, or location rules.', relatedTerms: ['Emission', 'Automatic abilities'], sourceSlug: 'Emission' }),
  term({ id: 'automatic-abilities', term: 'Automatic abilities', definition: 'Abilities that execute preset behavior after activation without requiring continuous conscious control.', relatedTerms: ['Nen beasts', 'Conditions and limitations', 'Counteractive abilities'], sourceSlug: 'Nen' }),
  term({ id: 'counteractive-abilities', term: 'Counteractive abilities', definition: 'Abilities designed to respond after a qualifying hostile action or state, sometimes accepting damage or death as part of the trigger.', synonyms: ['Counter-type ability'], relatedTerms: ['Conditions and limitations', 'Post-mortem Nen', 'Cat’s Name'], sourceSlug: 'Nen' }),
  term({ id: 'activation-stack', term: 'Ability activation stack', definition: 'A checklist model for complex abilities in which several conditions such as aura state, target, medium, place, time, or vow must be true together.', relatedTerms: ['Conditions and limitations', 'Vows'], sourceSlug: 'Conditions' }),
  term({ id: 'termination-rules', term: 'Ability termination rules', definition: 'The ability-specific reasons a Nen effect ends, including time, distance, aura depletion, user choice, target action, death, exorcism, or rule completion.', relatedTerms: ['Post-mortem Nen', 'Nen curses and exorcism', 'Conditions and limitations'], sourceSlug: 'Nen' }),
  term({ id: 'nen-spaces', term: 'Nen spaces and bounded domains', definition: 'Nen can create, alter, or govern spaces with special access, occupancy, visibility, and interaction rules.', synonyms: ['Nen space', 'Bounded Nen domain'], relatedTerms: ['Conjuration', 'Emission', 'Teleportation and portal mechanics'], sourceSlug: 'Nen' }),
  term({ id: 'teleportation-portals', term: 'Teleportation and portal mechanics', definition: 'Spatial Nen abilities differ in whether they transport bodies, connect fixed points, open routes, swap locations, or require prior setup.', synonyms: ['Portal mechanics', 'Teleportation mechanics'], relatedTerms: ['Emission', 'Nen spaces and bounded domains', 'Magical Worm'], sourceSlug: 'Nen' }),
  term({ id: 'coercive-manipulation', term: 'Coercive Manipulation', definition: 'Manipulation that directly controls a target’s actions or body once its activation requirements are satisfied.', relatedTerms: ['Manipulation', 'Manipulation precedence'], sourceSlug: 'Manipulation' }),
  term({ id: 'soliciting-manipulation', term: 'Soliciting Manipulation', definition: 'Manipulation that influences choices, feelings, or behavior without necessarily puppeteering every action.', relatedTerms: ['Manipulation', 'Conditions and limitations'], sourceSlug: 'Manipulation' }),
  term({ id: 'self-manipulation-defense', term: 'Self-Manipulation defense', definition: 'A defensive tactic in which a user establishes a compatible Manipulation effect on themselves before an opponent can take control.', relatedTerms: ['Manipulation precedence', 'Coercive Manipulation'], sourceSlug: 'Manipulation' }),
  term({ id: 'safe-nen-initiation', term: 'Safe Nen initiation', definition: 'Controlled opening of a learner’s aura nodes together with immediate stabilization, usually through Ten, so the learner is not left leaking aura uncontrollably.', relatedTerms: ['Nen initiation', 'Aura nodes', 'Ten'], sourceSlug: 'Nen#Initiation' }),
  term({ id: 'forced-nen-awakening', term: 'Forced Nen awakening', definition: 'Dangerous opening of aura nodes through hostile or uncontrolled Nen. Survival does not imply mastery or a developed personal ability.', synonyms: ['Forced awakening'], relatedTerms: ['Nen initiation', 'Aura nodes'], sourceSlug: 'Nen#Initiation' }),
  term({ id: 'system-mediated-awakening', term: 'System-mediated awakening', definition: 'Nen access or ability development produced by a rule system rather than ordinary instruction, as with progression systems such as Contagion.', relatedTerms: ['Contagion', 'Ability transfer'], sourceSlug: 'Nen' }),
  term({ id: 'noncombat-nen', term: 'Noncombat Nen', definition: 'Nen used for information, transport, prediction, healing, contracts, detection, craftsmanship, social systems, and other goals beyond direct damage.', relatedTerms: ['Hatsu', 'Conditions and limitations'], sourceSlug: 'Nen' }),
  term({ id: 'symbiotic-cooperative-nen', term: 'Symbiotic and cooperative Nen', definition: 'Nen whose function depends on multiple users, hosts, supporters, or reciprocal roles contributing aura, intent, marks, information, or position.', synonyms: ['Symbiotic Nen', 'Cooperative Nen'], relatedTerms: ['Collaborative abilities'], sourceSlug: 'Nen#Compound-type_abilities' }),
  term({ id: 'ability-lending', term: 'Ability lending', definition: 'Temporarily granting another person use of an ability without necessarily transferring ownership permanently.', relatedTerms: ['Loaned, stolen, and inherited abilities', 'Stealth Dolphin'], sourceSlug: 'Nen' }),
  term({ id: 'ability-theft', term: 'Ability theft', definition: 'Acquiring another user’s ability under explicit conditions, with retention and original-owner consequences determined by the specific theft system.', relatedTerms: ['Loaned, stolen, and inherited abilities', 'Skill Hunter'], sourceSlug: 'Skill_Hunter' }),
  term({ id: 'ability-inheritance', term: 'Ability inheritance', definition: 'Receiving a qualifying Nen ability after a trigger such as death or succession under ability-specific ownership, loyalty, or timing conditions.', relatedTerms: ['Loaned, stolen, and inherited abilities', 'Benjamin Baton'], sourceSlug: 'Nen' }),
  term({ id: 'post-mortem-persistence-models', term: 'Post-mortem persistence models', definition: 'Post-mortem Nen can continue as a curse, autonomous entity, revival or retaliation trigger, inherited function, or another ability-specific persistence model.', relatedTerms: ['Post-mortem Nen', 'Counteractive abilities', 'Nen curses and exorcism'], sourceSlug: 'Nen#Post-mortem_Nen' }),
  term({ id: 'exorcism-consequence', term: 'Exorcism consequence', definition: 'Removing hostile Nen can transfer, contain, transform, or otherwise leave a residual burden instead of simply deleting the effect.', relatedTerms: ['Nen curses and exorcism', 'Post-mortem Nen'], sourceSlug: 'Nen#Nen_curses' }),
]);

const normalizeSupplement = (entry) => Object.freeze({
  ...entry,
  recordType: entry.recordType || 'glossary',
  slug: entry.slug || String(entry.id || entry.term).replace(/^glossary:/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase(),
  synonyms: freeze(entry.synonyms || []),
  relatedEntityIds: freeze(entry.relatedEntityIds || []),
  relatedTerms: freeze(entry.relatedTerms || []),
  sourceIds: freeze(entry.sourceIds || []),
  externalSources: freeze(entry.externalSources || []),
});

export const SUCCESSION_GLOSSARY_SUPPLEMENT = freeze([
  ...DEEP_GLOSSARY_ENTRIES.map(normalizeSupplement),
  ...SUCCESSION_NEN_GLOSSARY_ENTRIES,
]);

export const mergeGlossaryEntries = (...collections) => {
  const output = [];
  for (const incomingRaw of collections.flat()) {
    if (!incomingRaw?.term) continue;
    const incoming = normalizeSupplement(incomingRaw);
    const incomingKeys = aliasKeys(incoming);
    const index = output.findIndex((existing) => intersects(aliasKeys(existing), incomingKeys));
    if (index < 0) {
      output.push(incoming);
      continue;
    }
    const current = output[index];
    const extraPrimary = normalizeGlossaryText(current.term) === normalizeGlossaryText(incoming.term) ? [] : [incoming.term];
    output[index] = Object.freeze({
      ...incoming,
      ...current,
      term: current.term,
      definition: current.definition || incoming.definition,
      category: current.category || incoming.category,
      firstChapter: current.firstChapter ?? incoming.firstChapter,
      certainty: current.certainty || incoming.certainty,
      synonyms: freeze(uniqueStrings([...(current.synonyms || []), ...extraPrimary, ...(incoming.synonyms || [])])
        .filter((value) => normalizeGlossaryText(value) !== normalizeGlossaryText(current.term))),
      relatedEntityIds: freeze(uniqueStrings([...(current.relatedEntityIds || []), ...(incoming.relatedEntityIds || [])])),
      relatedTerms: freeze(uniqueStrings([...(current.relatedTerms || []), ...(incoming.relatedTerms || [])])),
      sourceIds: freeze(uniqueStrings([...(current.sourceIds || []), ...(incoming.sourceIds || [])])),
      externalSources: freeze(uniqueById([...(current.externalSources || []), ...(incoming.externalSources || [])])),
    });
  }
  return freeze(output.sort((left, right) => String(left.term).localeCompare(String(right.term))));
};

export const glossaryEntryMatches = (entry, idOrSlug) => {
  const target = normalizeGlossaryText(idOrSlug);
  if (!target) return false;
  if ([entry.id, entry.slug].some((value) => normalizeGlossaryText(value) === target)) return true;
  return aliasKeys(entry).has(target) || aliasKeys(entry).has(singularVariant(target));
};

export const getSupplementalGlossaryEntriesAtChapter = (chapter) => {
  const parsed = Number(chapter);
  if (!Number.isFinite(parsed)) return freeze([]);
  return freeze(SUCCESSION_GLOSSARY_SUPPLEMENT.filter((entry) => Number(entry.firstChapter || 339) <= parsed));
};
