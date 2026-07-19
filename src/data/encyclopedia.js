import { ARCHIVE_REVIEW_DATE } from './archiveMeta';
import { generalCharacterSnapshot } from './generalCharacterSnapshot';
import { entityRegistry, canonicalEntityName } from './entityRegistry';
import { successionRoster } from './successionRoster';
import { referenceEntityRecords } from './referenceEntities';
import { nenRecords } from './nenEncyclopedia';
import { blackWhaleRooms } from './blackWhale';
import { worldLocations, worldLocationsById } from './worldAtlas';
import { seriesArcDossiers } from './seriesArcDossiers';
import { institutionalRelationships, objectTrails } from './systemsDesk';
import {
  bodyStateLedger,
  guardianBeasts,
  mafiaDossiers,
  princeDossiers,
  queenDossiers,
  successionFactions,
  successionObjects,
  successionOperations,
  successionRelationships,
} from './successionDossier';
import { deathLedger } from './successionStatus';

const wiki = (slug) => `https://hunterxhunter.fandom.com/wiki/${slug}`;
const slugify = (value = '') => String(value).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const unique = (values) => [...new Set(values.filter(Boolean))];
const factRows = (facts = {}) => Object.entries(facts).filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => ({ label, value: Array.isArray(value) ? value.join(' · ') : String(value) }));

const categoryDefinitions = [
  ['characters', 'Characters', 'People, creatures, named groups, aliases, affiliations, portraits, and centrally maintained status.'],
  ['factions', 'Factions', 'Families, institutions, states, criminal groups, expedition teams, and internal power structures.'],
  ['locations', 'Locations', 'World regions, cities, estates, game spaces, Black Whale tiers, rooms, and travel connections.'],
  ['nen', 'Nen & abilities', 'System principles, techniques, categories, contracts, named abilities, and Guardian Spirit Beasts.'],
  ['conflicts', 'Conflicts', 'Battles, assassinations, games, negotiations, pursuits, operations, and information wars.'],
  ['objects', 'Objects', 'Artifacts, weapons, cards, documents, ritual devices, evidence, and technology.'],
  ['relationships', 'Relationships', 'Family, loyalty, contracts, teaching, rivalry, custody, deception, sponsorship, and body transfer.'],
  ['status', 'Deaths & states', 'Confirmed deaths, exceptional body states, possession, confinement, continuations, and uncertainty rules.'],
];

const makeRecord = ({
  id, category, name, kind, summary, facts = [], related = [], tags = [], source,
  image = null, imageSource = null, media = null, statusCode = 'verified', statusLabel = 'Verified',
  researchLevel = 'Structured local record', reviewed = ARCHIVE_REVIEW_DATE, chapter = 0, imageMode = 'source',
}) => ({
  id,
  category,
  name,
  kind,
  summary,
  facts: Array.isArray(facts) ? facts : factRows(facts),
  related: unique(related),
  tags: unique(tags),
  source,
  image,
  imageSource: imageSource || source,
  media,
  imageMode,
  statusCode,
  statusLabel,
  researchLevel,
  reviewed,
  chapter,
});

const coreRelationshipRows = [
  ['Gon Freecss', 'Killua Zoldyck', 'Closest companions', 'Their shared journey is built from trust, competition, rescue, and an increasingly unequal emotional burden.', 'Hunter_Exam_arc'],
  ['Gon Freecss', 'Ging Freecss', 'Child / absent parent', 'Gon’s search for Ging supplies the route through the completed story arcs, while their eventual meeting reframes the journey rather than ending it.', 'Ging_Freecss'],
  ['Gon Freecss', 'Kite', 'Student / mentor link', 'Kite connects Gon to Ging and becomes the emotional cause of Gon’s collapse during the Chimera Ant crisis.', 'Kite'],
  ['Killua Zoldyck', 'Alluka Zoldyck', 'Sibling protection', 'Killua’s defense of Alluka and recognition of Nanika directly oppose the family’s confinement and control.', 'Alluka_Zoldyck'],
  ['Killua Zoldyck', 'Illumi Zoldyck', 'Sibling / coercive control', 'Illumi treats Killua as an asset to shape; Killua’s development repeatedly depends on recognizing and resisting that control.', 'Illumi_Zoldyck'],
  ['Killua Zoldyck', 'Silva Zoldyck', 'Child / father', 'Silva permits Killua’s departure through a promise whose meaning remains bound to the family’s expectations.', 'Zoldyck_Family'],
  ['Kurapika', 'Phantom Troupe', 'Survivor / targets', 'Kurapika’s recovery of the Scarlet Eyes and revenge against the Troupe structure his Yorknew and current-arc choices.', 'Kurapika'],
  ['Kurapika', 'Melody', 'Colleagues / trusted allies', 'Their Yorknew bodyguard partnership develops into durable trust and coordinated work aboard the Black Whale.', 'Melody'],
  ['Kurapika', 'Leorio Paradinight', 'Friends', 'Their argumentative first meeting becomes a protective friendship that persists through separation and institutional change.', 'Leorio_Paradinight'],
  ['Chrollo Lucilfer', 'Phantom Troupe', 'Leader / Spider', 'Chrollo treats the Spider as an organism meant to outlive any individual member, including himself.', 'Phantom_Troupe'],
  ['Chrollo Lucilfer', 'Hisoka Morow', 'Mutual hunt', 'Hisoka pursues the fight, Chrollo prepares and wins it, and the revived Hisoka turns the result into a hunt against the entire Troupe.', 'Chrollo_Lucilfer_vs._Hisoka_Morow'],
  ['Kurapika', 'Chrollo Lucilfer', 'Captor / target', 'Their Yorknew confrontation turns revenge into a hostage and information problem governed by Judgment Chain.', 'Yorknew_City_arc'],
  ['Meruem', 'Komugi', 'Rivals / intimate bond', 'Repeated Gungi games transform Meruem’s ideas about power, identity, vulnerability, and the value of a human life.', 'Meruem'],
  ['Isaac Netero', 'Meruem', 'Exterminator / king', 'Their battle contrasts perfected human discipline, biological supremacy, negotiation, and humanity’s capacity for escalation.', 'Isaac_Netero_vs._Meruem'],
  ['Morel Mackernasey', 'Knuckle Bine', 'Mentor / student', 'Morel’s tactical judgment and Knuckle’s compassion repeatedly shape the extermination team’s choices.', 'Morel_Mackernasey'],
  ['Morel Mackernasey', 'Shoot McMahon', 'Mentor / student', 'Shoot’s fear and courage are tested inside the operational discipline taught by Morel.', 'Shoot_McMahon'],
  ['Biscuit Krueger', 'Gon & Killua', 'Teacher / students', 'Biscuit turns informal talent into systematic Nen training, physical conditioning, and combat judgment.', 'Biscuit_Krueger'],
  ['Gon Freecss', 'Hisoka Morow', 'Prospect / predator', 'Hisoka repeatedly cultivates Gon as a future opponent while Gon uses the rivalry as a measure of growth.', 'Hisoka_Morow'],
  ['Ging Freecss', 'Kite', 'Mentor / student', 'Kite’s Hunter work and connection to Gon originate in training under Ging.', 'Kite'],
  ['Netero', 'Zodiacs', 'Founder / chosen council', 'Netero’s hand-picked council inherits institutional responsibility after his death while disagreeing over his intentions.', 'Zodiacs'],
  ['Alluka Zoldyck', 'Nanika', 'Shared body / distinct personhood', 'Killua recognizes two identities within one body while the Zoldyck family primarily understands Nanika as a dangerous power.', 'Nanika'],
  ['Palm Siberia', 'Killua Zoldyck', 'Former opponent / ally', 'Palm’s post-transformation encounter with Killua becomes a critical recognition of his loyalty to Gon.', 'Palm_Siberia'],
  ['Ikalgo', 'Killua Zoldyck', 'Former enemies / friends', 'Killua’s refusal to abandon Ikalgo creates an alliance that becomes operationally important during the palace invasion.', 'Ikalgo'],
  ['Pakunoda', 'Phantom Troupe', 'Member / chosen sacrifice', 'Pakunoda prioritizes the Troupe’s shared memory and Chrollo’s survival over her own life.', 'Pakunoda'],
];

const relationshipHints = new Map();
const addRelationshipHint = (from, to) => {
  const key = canonicalEntityName(from);
  relationshipHints.set(key, unique([...(relationshipHints.get(key) || []), to]));
};
coreRelationshipRows.forEach(([from, to]) => { addRelationshipHint(from, to); addRelationshipHint(to, from); });
successionRelationships.forEach(({ from, to }) => { addRelationshipHint(from, to); addRelationshipHint(to, from); });
institutionalRelationships.forEach(({ from, to }) => { addRelationshipHint(from, to); addRelationshipHint(to, from); });

const characterMap = new Map();
const ensureCharacter = (name) => {
  const canonical = canonicalEntityName(name);
  if (!characterMap.has(canonical)) characterMap.set(canonical, { name: canonical, groups: new Set(), aliases: new Set(), source: null, image: null, imageSource: null, media: null, registry: null, roster: null });
  return characterMap.get(canonical);
};

generalCharacterSnapshot.forEach((item) => {
  const target = ensureCharacter(item.name);
  target.groups.add(item.group);
  target.source ||= item.source;
  if (item.name !== target.name) target.aliases.add(item.name);
});
successionRoster.forEach((item) => {
  const target = ensureCharacter(item.name);
  target.groups.add(item.groupTitle || item.group || 'Succession Contest');
  target.source = item.source || target.source;
  target.image = item.image || target.image;
  target.imageSource = item.imageSource || target.imageSource;
  target.media = item.media || target.media;
  target.roster = item;
  if (item.name !== target.name) target.aliases.add(item.name);
});
entityRegistry.forEach((item) => {
  const target = ensureCharacter(item.name);
  target.groups.add(item.group);
  target.source = item.source || target.source;
  target.image = item.image || target.image;
  target.imageSource = item.imageSource || target.imageSource;
  target.media = item.media || target.media;
  target.registry = item;
  item.aliases.forEach((alias) => target.aliases.add(alias));
});

const princeByName = new Map(princeDossiers.map((item) => [canonicalEntityName(item.name), item]));
const deathByName = new Map(deathLedger.filter((item) => !item.name.endsWith('’s body')).map((item) => [canonicalEntityName(item.name), item]));

const characterRecords = [...characterMap.values()].sort((a, b) => a.name.localeCompare(b.name)).map((item) => {
  const registry = item.registry;
  const prince = princeByName.get(item.name);
  const death = deathByName.get(item.name);
  const rawStatus = registry?.status || (death ? 'deceased' : 'unreviewed');
  const statusCode = rawStatus === 'deceased' ? 'deceased' : rawStatus === 'active' ? 'active' : rawStatus === 'unknown' || rawStatus === 'unreviewed' ? 'unreviewed' : 'exceptional';
  const statusLabel = statusCode === 'deceased' ? 'Confirmed deceased' : statusCode === 'active' ? 'Active in maintained record' : statusCode === 'exceptional' ? (registry?.statusNote || rawStatus) : 'Status not locally reviewed';
  const groups = [...item.groups].filter(Boolean).sort();
  const role = registry?.role && !/^Indexed (Hunterpedia )?character$/i.test(registry.role) ? registry.role : null;
  const localDepth = prince ? 'Full prince dossier' : role ? 'Curated profile' : registry ? 'Maintained identity record' : 'Hunterpedia source index';
  const facts = [
    { label: 'Status', value: statusLabel },
    { label: 'Indexed under', value: groups.join(' · ') || 'Hunterpedia character directory' },
    { label: 'Series scope', value: registry?.scope === 'both' ? 'Pre-Succession and Succession' : registry?.scope === 'succession' ? 'Succession / current arc' : registry?.scope === 'all-arcs' ? 'Pre-Succession / series-wide' : 'Source directory; local scope not reviewed' },
    { label: 'Local depth', value: localDepth },
  ];
  if (item.aliases.size) facts.push({ label: 'Aliases / shorter forms', value: [...item.aliases].join(' · ') });
  if (prince) facts.push(
    { label: 'Royal position', value: `${prince.order}. Prince · mother: ${prince.mother}` },
    { label: 'Current location', value: prince.currentLocation },
    { label: 'Nen / ability state', value: prince.nen },
  );
  if (death) facts.push({ label: 'Death record', value: `Chapter ${death.chapter} · ${death.place} · ${death.cause}` });
  return makeRecord({
    id: `character-${slugify(item.name)}`,
    category: 'characters',
    name: item.name,
    kind: prince ? `${prince.order}. Prince of Kakin` : 'Character',
    summary: prince?.strategy || role || `Hunterpedia-indexed character associated with ${groups.slice(0, 3).join(', ') || 'the series character directory'}. A source-index entry is not presented as a completed biography.`,
    facts,
    related: [...(relationshipHints.get(item.name) || []), ...groups],
    tags: [statusCode, localDepth, ...groups, ...(item.aliases || [])],
    source: item.source || wiki(encodeURIComponent(item.name.replaceAll(' ', '_'))),
    image: item.image,
    imageSource: item.imageSource,
    media: item.media,
    statusCode,
    statusLabel,
    researchLevel: localDepth,
    chapter: death ? Number(death.chapter) : 0,
  });
});

const fromReference = (item) => makeRecord({
  id: item.id,
  category: item.section,
  name: item.name,
  kind: item.kind,
  summary: item.summary,
  facts: item.facts,
  related: item.related,
  tags: [item.sectionTitle, item.kind, item.status],
  source: item.source,
  statusLabel: item.status,
  researchLevel: 'Structured local record',
  reviewed: item.reviewed,
});

const baseByCategory = {
  factions: referenceEntityRecords.filter((item) => item.section === 'factions').map(fromReference),
  locations: referenceEntityRecords.filter((item) => item.section === 'locations').map(fromReference),
  conflicts: referenceEntityRecords.filter((item) => item.section === 'conflicts').map(fromReference),
  objects: referenceEntityRecords.filter((item) => item.section === 'objects').map(fromReference),
};

const factionRecords = [
  ...baseByCategory.factions,
  ...successionFactions.map((item) => makeRecord({
    id: `faction-${slugify(item.name)}`, category: 'factions', name: item.name, kind: 'Succession faction', summary: item.objective,
    facts: { Territory: item.territory, 'Key people': item.people, 'Current objective': item.objective, Scope: 'Succession Contest / Black Whale' },
    related: item.people, tags: ['Succession', item.territory], source: item.source, statusLabel: 'Developing current-arc record', researchLevel: 'Current-arc dossier',
  })),
  ...mafiaDossiers.map((item) => makeRecord({
    id: `faction-${slugify(item.family)}`, category: 'factions', name: item.family, kind: 'Kakin mafia family', summary: item.objectives.join(' '),
    facts: { Sponsor: item.sponsor, Base: item.base, Leadership: item.leadership, Members: item.members, Objectives: item.objectives },
    related: [...item.leadership, ...item.members, item.sponsor], tags: ['Mafia', 'Black Whale', item.base], source: item.source, statusLabel: 'Developing current-arc record', researchLevel: 'Current-arc dossier',
  })),
];

const locationRecords = [
  ...baseByCategory.locations,
  ...worldLocations.map((location) => makeRecord({
    id: `location-world-${location.id}`, category: 'locations', name: location.name, kind: location.kind, summary: location.summary,
    facts: { 'Route region': location.zone, 'Parent place': location.parent ? worldLocationsById.get(location.parent)?.name : 'Top-level study place', Arc: location.arc, Chapters: location.chapters, Control: location.control, Access: location.access, Events: location.events, 'Current state': location.status },
    related: [location.parent ? worldLocationsById.get(location.parent)?.name : '', ...location.related], tags: [location.zone, location.kind, location.arc], source: location.source, image: location.image,
    statusLabel: 'Structured world-atlas record', researchLevel: 'World-atlas place dossier', imageMode: location.imageMode,
  })),
  ...blackWhaleRooms.map((room) => makeRecord({
    id: `location-black-whale-${slugify(room.name)}`, category: 'locations', name: room.name, kind: room.type || 'Black Whale space', summary: room.detail,
    facts: { Tier: room.tier, Occupants: room.occupants, Control: room.control, Access: room.access, Connections: room.connections, Chapters: room.chapters, 'Operational status': room.status },
    related: ['Black Whale 1', room.tier, room.control, room.occupants], tags: ['Black Whale', room.tier, room.type, room.status], source: room.source, image: room.image, imageSource: room.media?.imageSource, media: room.media,
    statusLabel: 'Developing spatial record', researchLevel: 'Room / route dossier',
  })),
];

const nenEntityRecords = [
  ...nenRecords.map((item) => makeRecord({
    id: `nen-${item.id}`, category: 'nen', name: item.name, kind: item.kind, summary: item.summary,
    facts: [
      ...(item.user ? [{ label: 'User', value: item.user }] : []),
      ...(item.type ? [{ label: 'Nen type', value: item.type }] : []),
      ...(item.debut ? [{ label: 'Debut / scope', value: item.debut }] : []),
      { label: 'Group', value: item.group },
      { label: 'Mechanics', value: item.mechanics.join(' · ') },
      { label: 'Study boundary', value: item.study },
    ],
    related: unique([item.user, ...item.related]), tags: [item.group, item.kind, item.type, item.user], source: item.source,
    statusLabel: item.group === 'Succession abilities' ? 'Developing current-arc record' : 'Structured local record', researchLevel: item.kind.includes('ability') ? 'Ability record' : 'System concept', chapter: item.chapter || 0,
  })),
  ...guardianBeasts.map((item) => makeRecord({
    id: `nen-guardian-beast-${slugify(item.host)}`, category: 'nen', name: `${item.host} — Guardian Spirit Beast`, kind: 'Parasitic Nen beast', summary: item.ability,
    facts: { Host: item.host, Position: item.order, Knowledge: item.knowledge, 'Nen type': item.type, Conditions: item.conditions, Status: item.knowledge },
    related: [item.host, 'Guardian Spirit Beasts', 'Seed Urn'], tags: ['Guardian Spirit Beast', item.type, item.knowledge, 'Succession'], source: item.source, image: item.image,
    statusLabel: item.knowledge, researchLevel: 'Host-by-host beast dossier',
  })),
];

const conflictRecords = [
  ...baseByCategory.conflicts,
  ...seriesArcDossiers.flatMap((arc) => arc.conflicts.map((item) => makeRecord({
    id: `conflict-${slugify(arc.id)}-${slugify(item.name)}`, category: 'conflicts', name: item.name, kind: item.type, summary: item.objective,
    facts: { Arc: arc.title, Chapters: item.chapters, Participants: item.participants, Objective: item.objective, Abilities: item.abilities, 'Turning point': item.turningPoint, Outcome: item.outcome, Consequence: item.consequence },
    related: [arc.title, item.participants, item.abilities], tags: [arc.title, item.type, item.chapters], source: item.source, researchLevel: 'Completed-arc conflict record', chapter: Number(item.chapters.match(/\d+/)?.[0] || 0),
  }))),
  ...successionOperations.map((item) => makeRecord({
    id: `conflict-operation-${slugify(item.name)}`, category: 'conflicts', name: item.name, kind: 'Succession operation', summary: item.summary,
    facts: { Chapters: item.chapters, Location: item.place, Status: item.status, Scope: 'Succession Contest' },
    related: [item.place, 'Succession Contest'], tags: ['Succession', item.status, item.place], source: item.source, statusLabel: item.status, researchLevel: 'Current-arc operation record', chapter: Number(item.chapters.match(/\d+/)?.[0] || 0),
  })),
];

const objectTrailByName = new Map(objectTrails.map((item) => [slugify(item.name), item]));
const objectRecords = [
  ...baseByCategory.objects.map((item) => {
    const trail = objectTrailByName.get(slugify(item.name));
    if (!trail) return item;
    return {
      ...item,
      facts: [...item.facts, { label: 'Visual trail', value: `${trail.stages.length} maintained stages · ${trail.status}` }],
      related: unique([...item.related, ...trail.stages.map(([name]) => name)]),
      tags: unique([...item.tags, 'Phase 6D object trail', trail.kind]),
      researchLevel: 'Structured record + object trail',
    };
  }),
  ...successionObjects.map((item) => makeRecord({
    id: `object-succession-${slugify(item.name)}`, category: 'objects', name: item.name, kind: 'Succession object / evidence', summary: item.note,
    facts: { Scope: 'Succession Contest', Function: item.note, 'Source state': 'Developing current-arc record' },
    related: ['Succession Contest'], tags: ['Succession', 'Evidence'], source: item.source, statusLabel: 'Developing current-arc record', researchLevel: 'Current-arc object record',
  })),
];

const relationshipRecords = [
  ...coreRelationshipRows.map(([from, to, type, note, slug]) => makeRecord({
    id: `relationship-${slugify(from)}-${slugify(to)}`, category: 'relationships', name: `${from} ↔ ${to}`, kind: type, summary: note,
    facts: { 'First party': from, 'Second party': to, Relationship: type, Scope: 'Series relationship record' }, related: [from, to], tags: [type, from, to], source: wiki(slug), researchLevel: 'Curated relationship record',
  })),
  ...successionRelationships.map((item) => makeRecord({
    id: `relationship-succession-${slugify(item.from)}-${slugify(item.to)}`, category: 'relationships', name: `${item.from} ↔ ${item.to}`, kind: item.type, summary: item.note,
    facts: { 'First party': item.from, 'Second party': item.to, Phase: item.phase, Chapters: item.chapters, 'Current state': item.state },
    related: [item.from, item.to], tags: ['Succession', item.type, item.state, item.chapters], source: item.source, statusLabel: item.state, researchLevel: 'Time-sensitive current-arc relationship', chapter: Number(item.chapters.match(/\d+/)?.[0] || 0),
  })),
  ...institutionalRelationships.map((item) => makeRecord({
    id: `relationship-system-${item.id}`, category: 'relationships', name: `${item.from} → ${item.to}`, kind: item.type,
    summary: item.note,
    facts: { 'First party': item.from, 'Second party': item.to, Relationship: item.type, Era: item.era, Chapters: item.chapters, 'Current state': item.state },
    related: [item.from, item.to], tags: ['Phase 6D', item.type, item.era, item.state], source: item.source,
    statusLabel: item.state, researchLevel: 'Typed institutional relationship',
  })),
  ...queenDossiers.flatMap((queen) => queen.children.map((child) => makeRecord({
    id: `relationship-royal-${slugify(queen.name)}-${slugify(child)}`, category: 'relationships', name: `${queen.name} → ${child}`, kind: child.includes('raised') ? 'Raised child' : 'Mother / child',
    summary: `${queen.rank} Queen ${queen.name} is connected to ${child} in the maintained royal-family record. ${queen.role}`,
    facts: { Queen: `${queen.rank} Queen ${queen.name}`, Child: child, 'Household context': queen.role, Scope: 'Kakin royal family' },
    related: [queen.name, child, 'Kakin Royal Family'], tags: ['Royal family', queen.rank, child], source: queen.source, researchLevel: 'Royal-family relationship',
  }))),
];

const deathNames = new Set(deathLedger.filter((item) => !item.name.endsWith('’s body')).map((item) => canonicalEntityName(item.name)));
const statusRecords = [
  ...deathLedger.map((item) => makeRecord({
    id: `status-death-${slugify(item.name)}`, category: 'status', name: item.name, kind: item.name.endsWith('’s body') ? 'Exceptional body state' : 'Confirmed death', summary: item.cause,
    facts: { 'Voyage day / era': item.day, Chapter: item.chapter, Location: item.place, Cause: item.cause, 'Overlay rule': item.name.endsWith('’s body') ? 'No ordinary red X; body and consciousness are recorded separately' : 'Red X may be shown because death is confirmed' },
    related: [canonicalEntityName(item.name), item.place, `Chapter ${item.chapter}`], tags: ['Death ledger', item.day, item.place], source: item.source,
    statusCode: item.name.endsWith('’s body') ? 'exceptional' : 'deceased', statusLabel: item.name.endsWith('’s body') ? 'Exceptional body state' : 'Confirmed deceased', researchLevel: 'Sourced status event', chapter: Number(item.chapter) || 0,
  })),
  ...entityRegistry.filter((item) => item.status === 'deceased' && !deathNames.has(item.name)).map((item) => makeRecord({
    id: `status-death-${slugify(item.name)}`, category: 'status', name: item.name, kind: 'Confirmed death', summary: item.statusNote || 'This character is deceased in the maintained local identity record.',
    facts: { Status: 'Confirmed deceased', 'Detailed event record': 'Not yet locally expanded', 'Overlay rule': 'Red X may be shown because death is confirmed', 'Character source': item.source },
    related: [item.name], tags: ['Death ledger', item.group], source: item.source, image: item.image, imageSource: item.imageSource, media: item.media, statusCode: 'deceased', statusLabel: 'Confirmed deceased', researchLevel: 'Central status record',
  })),
  ...bodyStateLedger.map((item) => makeRecord({
    id: `status-rule-${slugify(item.state)}`, category: 'status', name: item.state, kind: 'Status classification', summary: item.rule,
    facts: { Examples: item.examples, Rule: item.rule, Classification: item.className }, related: item.examples.split(',').map((value) => value.trim()), tags: ['Status system', item.className], source: item.source,
    statusCode: item.className === 'deceased' ? 'deceased' : item.className === 'unknown' ? 'unreviewed' : 'exceptional', statusLabel: item.state, researchLevel: 'Status-system definition',
  })),
];

const categoryRecords = {
  characters: characterRecords,
  factions: factionRecords,
  locations: locationRecords,
  nen: nenEntityRecords,
  conflicts: conflictRecords,
  objects: objectRecords,
  relationships: relationshipRecords,
  status: statusRecords,
};

const dedupeCategory = (records) => {
  const seenNames = new Map();
  return records.filter((item) => {
    const key = item.name.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
    if (seenNames.has(key)) return false;
    seenNames.set(key, item.id);
    return true;
  });
};

const usedRecordIds = new Set();
export const encyclopediaRecords = categoryDefinitions.flatMap(([id]) => dedupeCategory(categoryRecords[id] || [])).map((item) => {
  if (!usedRecordIds.has(item.id)) {
    usedRecordIds.add(item.id);
    return item;
  }
  const nextId = `${item.category}-${item.id}`;
  usedRecordIds.add(nextId);
  return { ...item, id: nextId };
});
export const encyclopediaCategories = categoryDefinitions.map(([id, label, description]) => ({ id, label, description, count: encyclopediaRecords.filter((item) => item.category === id).length }));
export const encyclopediaById = new Map(encyclopediaRecords.map((item) => [item.id, item]));
export const encyclopediaByName = new Map(encyclopediaRecords.map((item) => [`${item.category}:${slugify(item.name)}`, item]));

export const findEncyclopediaRecord = (name, preferredCategory = '') => {
  const normalized = slugify(name);
  if (preferredCategory) {
    const match = encyclopediaByName.get(`${preferredCategory}:${normalized}`);
    if (match) return match;
  }
  return encyclopediaRecords.find((item) => slugify(item.name) === normalized)
    || encyclopediaRecords.find((item) => item.tags.some((tag) => slugify(tag) === normalized))
    || null;
};

export const encyclopediaStats = {
  records: encyclopediaRecords.length,
  characters: characterRecords.length,
  picturedCharacters: characterRecords.filter((item) => item.image).length,
  sourcedCharacters: characterRecords.filter((item) => item.source).length,
  deceasedCharacters: characterRecords.filter((item) => item.statusCode === 'deceased').length,
  relationships: dedupeCategory(relationshipRecords).length,
  categories: encyclopediaCategories.length,
};

export const encyclopediaSources = [
  { label: 'Complete character directory', source: wiki('List_of_Hunter_%C3%97_Hunter_Characters') },
  { label: 'Chapters 340–current cast', source: wiki('List_of_Hunter_%C3%97_Hunter_Characters/Chapters_340-current') },
  { label: 'Nen system', source: wiki('Nen') },
  { label: 'World index', source: wiki('World_of_Hunter_%C3%97_Hunter') },
];
