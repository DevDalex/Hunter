import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Crown,
  ExternalLink,
  FileSearch,
  FileText,
  GitBranch,
  Images,
  Landmark,
  Library,
  Map,
  MapPin,
  Network,
  Scale,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  expeditionLayer,
  guardianBeasts,
  justiceMilitaryLedger,
  mafiaDossiers,
  princeDossiers,
  successionAbilities,
  successionEvidence,
  successionFactions,
  successionMysteries,
  successionOperations,
  successionRelationships,
} from '../../data/successionDossier';
import {
  legalProcedureLedger,
  queenHouseholdLedger,
  roomAssignmentLedger,
} from '../../data/successionArchive';
import { shipRouteLayers } from '../../data/successionDossier';
import { successionChapterResearch } from '../../data/succession/successionResearch';
import {
  getAbilitiesForOwner,
  getAppearancesForCharacter,
  getEntitiesAtLocation,
  getEntitiesByType,
  getEntityById,
  getEventsAtLocation,
  getEventsForCharacter,
  getLocationBreadcrumbs,
  getLocationChildren,
  getLocationHistoryForCharacter,
  getOrganizationMembers,
  getRelatedEntities,
  getRelationshipsForEntity,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import {
  EntityBadge,
  EntityHeader,
  EntityLink,
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveExtendedWorkspaces.css';

const normalize = (value) => String(value || '').toLocaleLowerCase();
const firstChapter = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);
const entityList = (ids = []) => ids.map((id) => getEntityById(id)).filter(Boolean);
const roleLabel = (role) => String(role || '').replaceAll('-', ' ');
const statusTone = (value = '') => /dead|deceased|eliminated/i.test(value)
  ? 'dead'
  : /unknown|pending|unresolved/i.test(value)
    ? 'unknown'
    : /exceptional|possess|continuation|strained/i.test(value)
      ? 'exceptional'
      : 'active';

function WorkspaceHero({ kicker, title, description, stats = [], icon: Icon = Library }) {
  return <section className="succession-extended-hero">
    <div><span><Icon size={16} aria-hidden="true" /> {kicker}</span><h2>{title}</h2><p>{description}</p></div>
    <dl>{stats.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
  </section>;
}

function EntityMiniButton({ entity, onNavigate, target }) {
  if (!entity) return null;
  return <button type="button" className="succession-extended-entity" onClick={() => onNavigate(target || entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><b>{entity.name}</b><small>{entity.entityType.replaceAll('-', ' ')}</small></span>
  </button>;
}

const characterRecords = () => getEntitiesByType('character');
const organizationRecords = () => getEntitiesByType('organization');
const locationRecords = () => getEntitiesByType('location');
const sourceRecords = () => getEntitiesByType('source');

export function CharactersWorkspace({ onNavigate }) {
  const characters = useMemo(characterRecords, []);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const roleOptions = ['all', 'prince', 'queen', 'bodyguard', 'hunter', 'military', 'justice-official', 'mafia-member', 'phantom-troupe-member'];
  const visible = useMemo(() => characters.filter((character) => {
    const roleMatch = role === 'all' || (character.roles || []).includes(role);
    const queryMatch = !query.trim() || normalize(`${character.name} ${character.summary} ${(character.aliases || []).join(' ')} ${(character.roles || []).join(' ')} ${(character.affiliations || []).map((item) => item.role).join(' ')}`).includes(normalize(query.trim()));
    return roleMatch && queryMatch;
  }), [characters, query, role]);
  const pictured = characters.filter((character) => character.media?.portrait).length;

  return <div className="succession-characters-workspace">
    <WorkspaceHero kicker="Canonical cast" title="People organized by role, allegiance, and current state" description="The complete current-arc roster remains searchable without flattening princes, guards, Hunters, soldiers, mafia members, servants, and institutional actors into one undifferentiated wall." icon={Users} stats={[{ label: 'Named characters', value: characters.length }, { label: 'Portraits', value: pictured }, { label: 'Visible', value: visible.length }]} />
    <div className="succession-extended-tools">
      <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search characters</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, alias, role, affiliation…" /></label>
      <div>{roleOptions.map((item) => <button type="button" className={role === item ? 'is-active' : ''} onClick={() => setRole(item)} key={item}>{item === 'all' ? 'All roles' : roleLabel(item)}</button>)}</div>
    </div>
    <section className="succession-character-ledger" aria-label="Succession character records">
      {visible.map((character) => <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(character), { entity: character.id })} key={character.id}>
        <EntityVisual entity={character} />
        <div><EntityBadge entity={character} compact /><span className={`is-${statusTone(character.status?.life)}`}>{character.status?.life || 'unknown'}</span><h3>{character.name}</h3><p>{character.summary}</p></div>
        <footer><small>{(character.roles || []).slice(0, 3).map(roleLabel).join(' · ')}</small><b>Open dossier <ArrowRight size={14} aria-hidden="true" /></b></footer>
      </button>)}
    </section>
  </div>;
}

export function HuntersWorkspace({ onNavigate }) {
  const hunters = useMemo(() => characterRecords().filter((character) => (character.roles || []).some((role) => role === 'hunter' || role === 'zodiac')), []);
  const missionFor = (hunter) => {
    const roles = hunter.roles || [];
    if (roles.includes('zodiac')) return 'Zodiac expedition command';
    if (roles.includes('bodyguard')) return 'Royal bodyguard contract';
    if (roles.includes('nen-instructor')) return 'Nen instruction and deterrence';
    return 'Expedition or shipboard assignment';
  };
  const missionGroups = [...new Set(hunters.map(missionFor))];

  return <div className="succession-hunters-workspace">
    <WorkspaceHero kicker="Hunter assignments" title="Contracts, Association duties, royal rooms, and expedition command" description="Hunters aboard the Black Whale do not share one mission. Their obligations are separated into Zodiac governance, prince contracts, Nen instruction, security work, investigation, and the larger expedition." icon={Shield} stats={[{ label: 'Hunters', value: hunters.length }, { label: 'Zodiacs', value: hunters.filter((item) => item.roles?.includes('zodiac')).length }, { label: 'Mission groups', value: missionGroups.length }]} />
    <div className="succession-hunter-missions">{missionGroups.map((mission) => <section key={mission}><header><span>{mission}</span><b>{hunters.filter((hunter) => missionFor(hunter) === mission).length}</b></header><div>{hunters.filter((hunter) => missionFor(hunter) === mission).map((hunter) => <button type="button" onClick={() => onNavigate('hunters', { entity: hunter.id })} key={hunter.id}><EntityVisual entity={hunter} compact /><span><h3>{hunter.name}</h3><p>{hunter.summary}</p><small>{(hunter.affiliations || []).map((item) => item.role).join(' · ')}</small></span></button>)}</div></section>)}</div>
    <section className="succession-expedition-layer"><header><Map size={18} aria-hidden="true" /><div><span>Strategic background</span><h3>Expedition responsibilities beyond the contest</h3></div></header><div>{expeditionLayer.map((record) => <article key={record[0] || record.topic}><h4>{record.topic || record[0]}</h4><p>{record.note || record[1]}</p><small>{record.location || record[2]}</small></article>)}</div></section>
  </div>;
}

export function MilitaryWorkspace({ onNavigate }) {
  const personnel = useMemo(() => characterRecords().filter((character) => (character.roles || []).some((role) => ['military', 'justice-official', 'benjamin-soldier'].includes(role))), []);
  const operations = successionOperations.filter((operation) => /military|justice|martial|custody|funeral|benjamin|halkenburg/i.test(`${operation.name} ${operation.summary} ${operation.place}`));
  return <div className="succession-military-workspace">
    <WorkspaceHero kicker="Authority map" title="Military command, Justice procedure, custody, and martial law" description="The Royal Army can control movement and security, while the Justice Bureau and courts preserve investigations, hearings, witnesses, and legal procedure. Their powers overlap without becoming identical." icon={Scale} stats={[{ label: 'Authority records', value: justiceMilitaryLedger.length }, { label: 'Legal procedures', value: legalProcedureLedger.length }, { label: 'Named personnel', value: personnel.length }]} />
    <section className="succession-authority-chain"><header><Landmark size={18} aria-hidden="true" /><div><span>Command and jurisdiction</span><h3>Who can act, where, and under what authority</h3></div></header><div>{justiceMilitaryLedger.map((record) => <article key={record.area}><span>{record.place}</span><h4>{record.area}</h4><b>{record.people}</b><p>{record.authority}</p></article>)}</div></section>
    <section className="succession-legal-ledger"><header><Scale size={18} aria-hidden="true" /><div><span>Procedure</span><h3>Legal constraints operating inside the ritual</h3></div></header><div>{legalProcedureLedger.map((record) => <article key={record[0] || record.name}><h4>{record.name || record[0]}</h4><p>{record.note || record[1]}</p><small>{record.people || record[2]} · {record.status || record[3]}</small></article>)}</div></section>
    <section className="succession-military-people"><header><Users size={18} aria-hidden="true" /><div><span>Personnel</span><h3>Maintained soldiers and Justice officials</h3></div></header><div>{personnel.map((person) => <EntityMiniButton key={person.id} entity={person} onNavigate={onNavigate} target="military" />)}</div></section>
    <section className="succession-military-operations"><header><Activity size={18} aria-hidden="true" /><div><span>Active board</span><h3>Operations affected by state authority</h3></div></header><div>{operations.map((operation) => <article key={operation.name}><span>Ch. {operation.chapters} · {operation.place}</span><h4>{operation.name}</h4><p>{operation.summary}</p><b>{operation.status}</b></article>)}</div></section>
  </div>;
}

export function OrganizationsWorkspace({ onNavigate }) {
  const organizations = useMemo(organizationRecords, []);
  const roots = organizations.filter((organization) => !organization.parentOrganizationId);
  const childrenOf = (id) => organizations.filter((organization) => organization.parentOrganizationId === id);
  return <div className="succession-organizations-workspace">
    <WorkspaceHero kicker="Institutional hierarchy" title="Organizations shown as systems, not alphabetical cards" description="Leadership, parent organizations, objectives, membership, and institutional type are presented together so the royal, military, Hunter, mafia, and criminal structures remain legible." icon={Building2} stats={[{ label: 'Organizations', value: organizations.length }, { label: 'Root institutions', value: roots.length }, { label: 'Nested units', value: organizations.length - roots.length }]} />
    <section className="succession-organization-tree" aria-label="Organization hierarchy">{roots.map((organization) => {
      const members = getOrganizationMembers(organization.id);
      const leaders = entityList(organization.leaderIds);
      const children = childrenOf(organization.id);
      return <article key={organization.id}><header><EntityVisual entity={organization} compact /><div><span>{roleLabel(organization.organizationType)}</span><h3>{organization.name}</h3><p>{organization.summary}</p></div><button type="button" onClick={() => onNavigate('organizations', { entity: organization.id })}>Dossier <ArrowRight size={13} /></button></header><dl><div><dt>Leaders</dt><dd>{leaders.length}</dd></div><div><dt>Members</dt><dd>{members.length}</dd></div><div><dt>Child units</dt><dd>{children.length}</dd></div></dl>{!!leaders.length && <div className="succession-organization-tree__leaders">{leaders.map((leader) => <EntityMiniButton entity={leader} onNavigate={onNavigate} key={leader.id} />)}</div>}{!!children.length && <div className="succession-organization-tree__children">{children.map((child) => <button type="button" onClick={() => onNavigate('organizations', { entity: child.id })} key={child.id}><Building2 size={16} /><span><b>{child.name}</b><small>{roleLabel(child.organizationType)}</small></span></button>)}</div>}</article>;
    })}</section>
  </div>;
}

export function PoliticsWorkspace({ onNavigate }) {
  const royalLinks = successionRelationships.filter((relationship) => /prince|queen|royal|mother|sponsor|alliance|treaty|king|succession/i.test(`${relationship.from} ${relationship.to} ${relationship.type} ${relationship.note}`));
  return <div className="succession-politics-workspace">
    <WorkspaceHero kicker="Political architecture" title="Parentage, succession interests, sponsorship, alliance, and authority" description="The political archive separates family rank, ritual candidacy, queen households, mafia sponsorship, military authority, and negotiated alliances instead of treating every connection as generic kinship." icon={Crown} stats={[{ label: 'Princes', value: princeDossiers.length }, { label: 'Queen branches', value: queenHouseholdLedger.length }, { label: 'Political links', value: royalLinks.length }]} />
    <section className="succession-political-branches"><header><Crown size={18} /><div><span>Royal branches</span><h3>Eight maternal households</h3></div></header><div>{queenHouseholdLedger.map((queen) => <button type="button" onClick={() => onNavigate('queens', { focus: normalize(queen.name).replace(/[^a-z0-9]+/g, '-') })} key={queen.rank}><span>{queen.rank}</span><h4>{queen.name}</h4><p>{queen.children}</p><small>{queen.status}</small></button>)}</div></section>
    <section className="succession-sponsor-map"><header><GitBranch size={18} /><div><span>Underworld sponsorship</span><h3>Royal branches connected to Kakin mafia</h3></div></header><div>{mafiaDossiers.map((family) => <article key={family.family}><span>{family.family}</span><h4>{family.sponsor}</h4><p>{family.objectives.join(' · ')}</p><button type="button" onClick={() => onNavigate('mafia', { focus: normalize(family.family).replace(/[^a-z0-9]+/g, '-') })}>Open family</button></article>)}</div></section>
    <section className="succession-political-links"><header><Network size={18} /><div><span>Negotiated board</span><h3>Political and family relationships</h3></div></header><div>{royalLinks.map((relationship) => <article key={`${relationship.from}-${relationship.to}-${relationship.type}`}><span>{relationship.type} · {relationship.state}</span><h4>{relationship.from} ↔ {relationship.to}</h4><p>{relationship.note}</p><small>Ch. {relationship.chapters}</small></article>)}</div></section>
  </div>;
}

export function LocationsWorkspace({ onNavigate }) {
  const locations = useMemo(locationRecords, []);
  const rooms = roomAssignmentLedger;
  return <div className="succession-locations-workspace">
    <WorkspaceHero kicker="Spatial archive" title="Tiers, royal rooms, controlled passages, and Nen routes" description="Locations are presented through hierarchy, access, occupants, incidents, and movement systems. The Black Whale is not a flat list of room names." icon={MapPin} stats={[{ label: 'Canonical locations', value: locations.length }, { label: 'Royal rooms', value: rooms.length }, { label: 'Route systems', value: shipRouteLayers.length }]} />
    <section className="succession-location-hierarchy"><header><Map size={18} /><div><span>Canonical hierarchy</span><h3>Maintained location records</h3></div></header><div>{locations.map((location) => <button type="button" onClick={() => onNavigate('locations', { entity: location.id })} key={location.id}><span>{location.locationType}</span><h4>{location.name}</h4><p>{location.summary}</p><small>{location.accessLevel} access{location.deck ? ` · Tier ${location.deck}` : ''}</small></button>)}</div></section>
    <section className="succession-room-location-board"><header><Crown size={18} /><div><span>Tier 1 royal ring</span><h3>Prince-room occupancy and operational state</h3></div></header><div>{rooms.map((room) => <button type="button" onClick={() => onNavigate('bodyguards', { prince: room.order })} key={room.order}><b>{String(room.order).padStart(2, '0')}</b><span><h4>{room.prince}</h4><small>{room.room}</small><p>{room.current}</p></span><i className={`is-${statusTone(room.state)}`}>{room.state}</i></button>)}</div></section>
    <section className="succession-route-systems"><header><GitBranch size={18} /><div><span>Movement systems</span><h3>Legal, public, criminal, emergency, and Nen-mediated routes</h3></div></header><div>{shipRouteLayers.map((route) => <article key={route.name}><h4>{route.name}</h4><p>{route.path}</p><small>{route.access}</small></article>)}</div></section>
  </div>;
}

export function ResearchWorkspace({ onNavigate }) {
  const sources = useMemo(sourceRecords, []);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const types = [...new Set(sources.map((source) => source.sourceType))];
  const visible = sources.filter((source) => (type === 'all' || source.sourceType === type) && (!query.trim() || normalize(`${source.name} ${source.summary} ${source.note} ${source.chapter}`).includes(normalize(query.trim()))));
  const chapterSources = sources.filter((source) => source.sourceType === 'chapter');
  return <div className="succession-research-workspace">
    <WorkspaceHero kicker="Evidence desk" title="Sources, provenance, confidence, coverage, and unresolved claims" description="Research records distinguish what is directly indexed, what is inferred, what remains unknown, and which chapter or reference supports each maintained claim." icon={FileSearch} stats={[{ label: 'Sources', value: sources.length }, { label: 'Chapter sources', value: chapterSources.length }, { label: 'Open mysteries', value: successionMysteries.length }]} />
    <div className="succession-extended-tools"><label><Search size={16} /><span className="sr-only">Search research sources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Source, chapter, evidence note…" /></label><div>{['all', ...types].map((item) => <button type="button" className={type === item ? 'is-active' : ''} onClick={() => setType(item)} key={item}>{item}</button>)}</div></div>
    <div className="succession-research-grid">
      <section className="succession-source-catalogue"><header><Library size={18} /><div><span>Source catalogue</span><h3>{visible.length} visible records</h3></div></header><div>{visible.map((source) => <article key={source.id}><span>{source.sourceType}{source.chapter ? ` · Ch. ${source.chapter}` : ''}</span><h4>{source.name}</h4><p>{source.note || source.summary}</p><footer><button type="button" onClick={() => onNavigate('research', { entity: source.id })}>Open record</button>{source.url && <a href={source.url} target="_blank" rel="noreferrer noopener">Source <ExternalLink size={12} /></a>}</footer></article>)}</div></section>
      <aside><section className="succession-evidence-catalogue"><header><FileText size={18} /><div><span>Physical and documentary evidence</span><h3>Maintained evidence types</h3></div></header><div>{successionEvidence.map((record) => <article key={record.name}><span>{record.kind}</span><h4>{record.name}</h4><p>{record.note}</p></article>)}</div></section><section className="succession-mystery-catalogue"><header><Sparkles size={18} /><div><span>Research gaps</span><h3>Unknowns kept explicit</h3></div></header><div>{successionMysteries.map((record) => <article key={record.question}><span>{record.status} · Ch. {record.lastChapter}</span><h4>{record.question}</h4><p>{record.evidence}</p></article>)}</div></section></aside>
    </div>
  </div>;
}

const glossaryTerms = Object.freeze([
  ['Seed Urn Ceremony', 'Royal blood ritual that creates parasitic Guardian Spirit Beasts for eligible Kakin princes.', 'Ritual'],
  ['Succession Contest', 'The Kakin royal deathmatch intended to produce one successor during the Black Whale voyage.', 'Ritual'],
  ['Guardian Spirit Beast', 'Parasitic Nen beast created by the Seed Urn and sustained by the host prince’s aura.', 'Nen'],
  ['Parasitic Nen', 'Nen that attaches to and draws power from a host, often without normal conscious control.', 'Nen'],
  ['Room 1014', 'Woble and Oito’s quarters, Kurapika’s defensive base, and the site of the public Nen classes.', 'Location'],
  ['Special Martial Law', 'Emergency military authority affecting access, movement, investigation, and command aboard the upper tiers.', 'Law'],
  ['Justice Bureau', 'Kakin institution handling investigation, witness protection, custody, and legal procedure aboard the ship.', 'Law'],
  ['Benjamin Baton', 'First Prince Benjamin’s inherited-ability system tied to loyal deceased private soldiers.', 'Ability'],
  ['Parallel Future', 'Tserriednich’s ten-second future-perception ability activated through Zetsu.', 'Ability'],
  ['Contagion', 'Morena’s Heil-Ly ability that awards murder points, awakens abilities, and permits further infection.', 'Ability'],
  ['Have-Not', 'Camilla-aligned curse soldiers prepared to use death-powered Nen against assigned princes.', 'Faction'],
  ['Without You', 'Kacho’s Guardian Spirit Beast, continuing in her form to protect Fugetsu after Kacho’s death.', 'Nen'],
  ['Magical Worm', 'Fugetsu’s Guardian Spirit Beast route ability creating outgoing and return doors.', 'Nen'],
  ['Predator', 'Rihan’s analysis-dependent counter-beast ability.', 'Ability'],
  ['Moonlight Act', 'Longhi’s contract ability used to formalize a conditional alliance with Kurapika.', 'Ability'],
  ['Room 3101', 'A key entry point in the Heil-Ly spatial route and hideout investigation.', 'Location'],
  ['V6', 'The international political framework formed when Kakin joins the former V5 powers.', 'Politics'],
  ['New Continent', 'The public voyage destination used before the true Dark Continent expedition proceeds.', 'Expedition'],
  ['Body-state split', 'Archive distinction between a dead or occupied body and a consciousness or Nen effect continuing elsewhere.', 'Status'],
  ['Reading boundary', 'User-controlled chapter limit that hides later archive material.', 'Archive'],
]);

export function GlossaryWorkspace() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const groups = [...new Set(glossaryTerms.map((term) => term[2]))];
  const visible = glossaryTerms.filter(([term, definition, category]) => (group === 'all' || category === group) && (!query.trim() || normalize(`${term} ${definition} ${category}`).includes(normalize(query.trim()))));
  return <div className="succession-glossary-workspace"><WorkspaceHero kicker="Controlled vocabulary" title="Terms used consistently across the Succession Archive" description="Ritual, Nen, legal, political, status, ship, and archive terminology is defined in one place so similar concepts are not silently merged." icon={Library} stats={[{ label: 'Terms', value: glossaryTerms.length }, { label: 'Categories', value: groups.length }, { label: 'Visible', value: visible.length }]} /><div className="succession-extended-tools"><label><Search size={16} /><span className="sr-only">Search glossary</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Term or definition…" /></label><div>{['all', ...groups].map((item) => <button type="button" className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} key={item}>{item}</button>)}</div></div><section className="succession-glossary-list">{visible.map(([term, definition, category]) => <article key={term}><span>{category}</span><h3>{term}</h3><p>{definition}</p></article>)}</section></div>;
}

export function MediaWorkspace({ onNavigate }) {
  const portraits = useMemo(() => characterRecords().filter((entity) => entity.media?.portrait).map((entity) => ({ id: entity.id, label: entity.name, kind: 'Character portrait', src: entity.media.portrait, source: entity.media.source || entity.referenceUrl, entity })), []);
  const beasts = guardianBeasts.filter((record) => record.image).map((record) => ({ id: `beast:${record.host}`, label: `${record.host} Guardian Spirit Beast`, kind: 'Guardian Spirit Beast', src: record.image, source: record.source, entity: getEntityById(`guardian-beast:${normalize(record.host).replace(/[^a-z0-9]+/g, '-')}`) }));
  const media = [...portraits, ...beasts];
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const kinds = [...new Set(media.map((item) => item.kind))];
  const visible = media.filter((item) => (kind === 'all' || item.kind === kind) && (!query.trim() || normalize(`${item.label} ${item.kind}`).includes(normalize(query.trim()))));
  return <div className="succession-media-workspace"><WorkspaceHero kicker="Media provenance" title="Available archive visuals with subjects and source links" description="Only maintained portraits and Guardian Spirit Beast images are shown. Missing visuals remain explicit rather than being replaced with unrelated art." icon={Images} stats={[{ label: 'Available media', value: media.length }, { label: 'Character portraits', value: portraits.length }, { label: 'Beast visuals', value: beasts.length }]} /><div className="succession-extended-tools"><label><Search size={16} /><span className="sr-only">Search media</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Subject or media type…" /></label><div>{['all', ...kinds].map((item) => <button type="button" className={kind === item ? 'is-active' : ''} onClick={() => setKind(item)} key={item}>{item}</button>)}</div></div><section className="succession-media-grid">{visible.map((item) => <article key={item.id}><SafeImage src={item.src} alt={`${item.label} archive media`} fallbackLabel="Media" /><div><span>{item.kind}</span><h3>{item.label}</h3><footer>{item.entity && <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(item.entity), { entity: item.entity.id })}>Open subject</button>}{item.source && <a href={item.source} target="_blank" rel="noreferrer noopener">Provenance <ExternalLink size={12} /></a>}</footer></div></article>)}</section></div>;
}

function EntityFact({ label, children }) {
  if (children === null || children === undefined || children === '' || (Array.isArray(children) && !children.length)) return null;
  return <div><dt>{label}</dt><dd>{children}</dd></div>;
}

export function DomainEntityDetail({ entity, onNavigate }) {
  const sources = getSourcesForEntity(entity.id);
  const related = getRelatedEntities(entity.id);
  const relationships = getRelationshipsForEntity(entity.id);
  const abilities = entity.entityType === 'character' ? getAbilitiesForOwner(entity.id) : [];
  const events = entity.entityType === 'character' ? getEventsForCharacter(entity.id) : entity.entityType === 'location' ? getEventsAtLocation(entity.id) : [];
  const appearances = entity.entityType === 'character' ? getAppearancesForCharacter(entity.id) : [];
  const locationHistory = entity.entityType === 'character' ? getLocationHistoryForCharacter(entity.id) : [];
  const members = entity.entityType === 'organization' ? getOrganizationMembers(entity.id) : [];
  const locationChildren = entity.entityType === 'location' ? getLocationChildren(entity.id) : [];
  const breadcrumbs = entity.entityType === 'location' ? getLocationBreadcrumbs(entity.id) : [];
  const occupants = entity.entityType === 'location' ? getEntitiesAtLocation(entity.id) : [];
  const sourceEntity = entity.entityType === 'relationship' ? getEntityById(entity.sourceEntityId) : null;
  const targetEntity = entity.entityType === 'relationship' ? getEntityById(entity.targetEntityId) : null;

  return <article className="succession-domain-dossier">
    <EntityHeader entity={entity} onNavigate={onNavigate} />
    <dl className="succession-domain-dossier__facts">
      <EntityFact label="Record type">{entity.entityType.replaceAll('-', ' ')}</EntityFact>
      <EntityFact label="Canon level">{entity.canonLevel}</EntityFact>
      <EntityFact label="Publication">{entity.publicationStatus}</EntityFact>
      <EntityFact label="As of chapter">{entity.status?.asOfChapter || entity.chapterRange?.end || entity.number || entity.chapter}</EntityFact>
      {entity.entityType === 'character' && <><EntityFact label="Life state">{entity.status?.life}</EntityFact><EntityFact label="Roles">{(entity.roles || []).map(roleLabel).join(' · ')}</EntityFact><EntityFact label="Royal mother">{entity.royalMother}</EntityFact></>}
      {entity.entityType === 'organization' && <><EntityFact label="Organization type">{roleLabel(entity.organizationType)}</EntityFact><EntityFact label="Status">{entity.status}</EntityFact><EntityFact label="Parent">{getEntityById(entity.parentOrganizationId)?.name}</EntityFact></>}
      {entity.entityType === 'location' && <><EntityFact label="Location type">{entity.locationType}</EntityFact><EntityFact label="Access">{entity.accessLevel}</EntityFact><EntityFact label="Deck">{entity.deck}</EntityFact></>}
      {entity.entityType === 'ability' && <><EntityFact label="Nen type">{entity.classification?.nenTypes?.join(' · ')}</EntityFact><EntityFact label="Category">{entity.category}</EntityFact><EntityFact label="Activation">{entity.activation}</EntityFact></>}
      {entity.entityType === 'event' && <><EntityFact label="Category">{entity.category}</EntityFact><EntityFact label="Status">{entity.status}</EntityFact><EntityFact label="Chapters">{entity.chapterRange && `${entity.chapterRange.start}–${entity.chapterRange.end || 'current'}`}</EntityFact></>}
      {entity.entityType === 'relationship' && <><EntityFact label="Type">{entity.relationshipType} · {entity.subtype}</EntityFact><EntityFact label="Direction">{entity.direction}</EntityFact><EntityFact label="Sentiment">{entity.sentiment}</EntityFact></>}
      {entity.entityType === 'chapter' && <><EntityFact label="Chapter">{entity.number}</EntityFact><EntityFact label="Voyage day">{entity.voyageDay}</EntityFact><EntityFact label="Story lanes">{(entity.lanes || []).join(' · ')}</EntityFact></>}
      {entity.entityType === 'source' && <><EntityFact label="Source type">{entity.sourceType}</EntityFact><EntityFact label="Chapter">{entity.chapter}</EntityFact></>}
      {entity.entityType === 'guardian-beast' && <><EntityFact label="Host">{getEntityById(entity.hostCharacterId)?.name}</EntityFact><EntityFact label="Knowledge">{entity.knowledge}</EntityFact><EntityFact label="Nen type">{entity.classification?.nenTypes?.join(' · ')}</EntityFact></>}
    </dl>

    {entity.entityType === 'character' && <div className="succession-domain-dossier__split"><section><header><Building2 size={17} /><div><span>Affiliations</span><h3>Organizations and roles</h3></div></header><div>{(entity.affiliations || []).map((affiliation) => { const organization = getEntityById(affiliation.organizationId); return <article key={`${affiliation.organizationId}-${affiliation.role}`}><EntityMiniButton entity={organization} onNavigate={onNavigate} /><small>{affiliation.role} · {affiliation.status}</small></article>; })}</div></section><section><header><Sparkles size={17} /><div><span>Nen and activity</span><h3>Abilities, appearances, and locations</h3></div></header><dl><EntityFact label="Abilities">{abilities.map((ability) => ability.name).join(' · ') || 'No canonical ability record linked'}</EntityFact><EntityFact label="Chapter appearances">{appearances.map((appearance) => appearance.chapterId?.replace('chapter:', '')).join(' · ') || 'No structured appearance rows linked'}</EntityFact><EntityFact label="Location history">{locationHistory.map((record) => getEntityById(record.locationId)?.name).filter(Boolean).join(' · ') || 'No structured location history linked'}</EntityFact><EntityFact label="Events">{events.map((event) => event.name).join(' · ') || 'No structured event rows linked'}</EntityFact></dl></section></div>}

    {entity.entityType === 'organization' && <div className="succession-domain-dossier__split"><section><header><Users size={17} /><div><span>Membership</span><h3>Leaders and indexed members</h3></div></header><div>{entityList(entity.leaderIds).map((leader) => <EntityMiniButton entity={leader} onNavigate={onNavigate} key={leader.id} />)}{members.map(({ character, role }) => <article key={`${character.id}-${role}`}><EntityMiniButton entity={character} onNavigate={onNavigate} /><small>{role}</small></article>)}</div></section><section><header><Activity size={17} /><div><span>Purpose</span><h3>Objectives</h3></div></header><ul>{(entity.objectives || []).map((objective) => <li key={objective}>{objective}</li>)}</ul></section></div>}

    {entity.entityType === 'location' && <div className="succession-domain-dossier__split"><section><header><MapPin size={17} /><div><span>Hierarchy</span><h3>Breadcrumb and child locations</h3></div></header><p>{breadcrumbs.map((item) => item.name).join(' → ')}</p><div>{locationChildren.map((location) => <EntityMiniButton entity={location} onNavigate={onNavigate} key={location.id} />)}</div></section><section><header><Users size={17} /><div><span>Activity</span><h3>Occupants and events</h3></div></header><div>{occupants.map(({ entity: occupant }) => <EntityMiniButton entity={occupant} onNavigate={onNavigate} key={occupant.id} />)}</div><ul>{events.map((event) => <li key={event.id}>{event.name}</li>)}</ul></section></div>}

    {entity.entityType === 'ability' && <div className="succession-domain-dossier__split"><section><header><Users size={17} /><div><span>Owners</span><h3>Linked users</h3></div></header><div>{entityList(entity.ownerIds).map((owner) => <EntityMiniButton entity={owner} onNavigate={onNavigate} key={owner.id} />)}</div></section><section><header><Scale size={17} /><div><span>Mechanics</span><h3>Conditions, limitations, and costs</h3></div></header><dl><EntityFact label="Conditions">{(entity.conditions || []).join(' · ')}</EntityFact><EntityFact label="Limitations">{(entity.limitations || []).join(' · ')}</EntityFact><EntityFact label="Costs">{(entity.costs || []).join(' · ')}</EntityFact></dl></section></div>}

    {entity.entityType === 'event' && <div className="succession-domain-dossier__split"><section><header><Users size={17} /><div><span>Participants</span><h3>People, organizations, and locations</h3></div></header><div>{entityList([...(entity.participantIds || []), ...(entity.organizationIds || []), ...(entity.locationIds || [])]).map((record) => <EntityMiniButton entity={record} onNavigate={onNavigate} key={record.id} />)}</div></section><section><header><Activity size={17} /><div><span>Causality</span><h3>Causes and outcomes</h3></div></header><dl><EntityFact label="Causes">{(entity.causes || []).join(' · ')}</EntityFact><EntityFact label="Outcomes">{(entity.outcomes || []).join(' · ')}</EntityFact></dl></section></div>}

    {entity.entityType === 'relationship' && <section className="succession-domain-link"><EntityMiniButton entity={sourceEntity} onNavigate={onNavigate} /><GitBranch size={22} /><EntityMiniButton entity={targetEntity} onNavigate={onNavigate} /></section>}

    {entity.entityType === 'chapter' && <div className="succession-domain-dossier__split"><section><header><Users size={17} /><div><span>Appearances</span><h3>Linked people</h3></div></header><div>{entityList((entity.appearanceRecords || []).map((appearance) => appearance.characterId)).map((record) => <EntityMiniButton entity={record} onNavigate={onNavigate} key={record.id} />)}</div></section><section><header><BookOpen size={17} /><div><span>Reader bridge</span><h3>Open the image chapter</h3></div></header><button className="succession-button succession-button--primary" type="button" onClick={() => onNavigate('reader', { chapter: entity.number })}>Read Chapter {entity.number}</button></section></div>}

    {entity.entityType === 'source' && <section className="succession-domain-source"><p>{entity.note || entity.summary}</p>{entity.url && <a href={entity.url} target="_blank" rel="noreferrer noopener">Open source <ExternalLink size={13} /></a>}</section>}

    {!!relationships.length && <section className="succession-domain-dossier__relationships"><header><Network size={17} /><div><span>Canonical graph</span><h3>Typed relationships</h3></div></header><div>{relationships.map((relationship) => <article key={relationship.id}><span>{relationship.relationshipType} · {relationship.subtype}</span><h4>{relationship.name}</h4><p>{relationship.summary}</p></article>)}</div></section>}
    {!!related.length && <section className="succession-domain-dossier__related"><header><GitBranch size={17} /><div><span>Connected records</span><h3>Related entities</h3></div></header><div>{related.slice(0, 18).map((record) => <EntityMiniButton entity={record} onNavigate={onNavigate} key={record.id} />)}</div></section>}
    {!!sources.length && <section className="succession-domain-dossier__sources"><header><FileSearch size={17} /><div><span>Evidence</span><h3>Source references</h3></div></header>{sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}
  </article>;
}

export function ChapterRecordsWorkspaceV2({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedNumber = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
  const eligible = useMemo(() => successionChapterResearch.filter((chapter) => chapter.number <= spoilerLimit), [spoilerLimit]);
  const fallbackNumber = eligible.at(-1)?.number || successionChapterResearch[0]?.number;
  const [selectedNumber, setSelectedNumber] = useState(requestedNumber || fallbackNumber);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('all');
  const phases = [...new Set(eligible.map((chapter) => chapter.phase))];
  const visible = eligible.filter((chapter) => (phase === 'all' || chapter.phase === phase) && (!query.trim() || normalize(`${chapter.number} ${chapter.title} ${chapter.phase} ${chapter.voyageDay} ${chapter.focus} ${chapter.lanes.join(' ')} ${chapter.locations.join(' ')}`).includes(normalize(query.trim()))));
  const selected = eligible.find((chapter) => chapter.number === selectedNumber) || eligible.at(-1) || null;

  useEffect(() => {
    const next = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
    if (next && eligible.some((chapter) => chapter.number === next)) setSelectedNumber(next);
  }, [eligible, requestedEntity?.number, routeParams.chapter, routeParams.focus]);

  if (!selected) return null;
  const selectedIndex = eligible.findIndex((chapter) => chapter.number === selected.number);
  const previous = eligible[selectedIndex - 1];
  const next = eligible[selectedIndex + 1];
  const openChapter = (number) => { setSelectedNumber(number); onNavigate('chapters', { chapter: number }); };

  return <div className="succession-chapter-records succession-chapter-records--extended">
    <WorkspaceHero kicker="Research ledger" title="Chapter evidence separated from the image reader" description="Each record connects focus, voyage phase, parallel story lanes, chronology, locations, confidence, source coverage, and the direct reading route through Chapter 414." icon={BookOpen} stats={[{ label: 'Visible records', value: eligible.length }, { label: 'Phases', value: phases.length }, { label: 'Selected', value: `Ch. ${selected.number}` }]} />
    <div className="succession-chapter-records__layout"><aside className="succession-chapter-index"><label><Search size={16} /><span className="sr-only">Search chapter records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chapter, title, lane, location…" /></label><select value={phase} onChange={(event) => setPhase(event.target.value)} aria-label="Filter chapter phase"><option value="all">All phases</option>{phases.map((item) => <option value={item} key={item}>{item}</option>)}</select><div>{visible.map((chapter) => <button type="button" className={chapter.number === selected.number ? 'is-active' : ''} onClick={() => openChapter(chapter.number)} key={chapter.number}><b>{chapter.number}</b><span><strong>{chapter.title}</strong><small>{chapter.phase} · {chapter.voyageDay}</small></span><ArrowRight size={13} /></button>)}</div></aside><article className="succession-chapter-record"><header><div><span>{selected.phase} · {selected.voyageDay}</span><h2>Chapter {selected.number}: {selected.title}</h2><p>{selected.focus}</p></div><button type="button" onClick={() => onNavigate('reader', { chapter: selected.number })}>Open reader <BookOpen size={14} /></button></header><section className="succession-chapter-record__lanes"><span>Parallel story lanes</span><div>{selected.lanes.map((lane) => <small key={lane}>{lane}</small>)}</div></section><div className="succession-chapter-record__grid"><section><MapPin size={17} /><span>Locations</span>{selected.locations.length ? <ul>{selected.locations.map((location) => <li key={location}>{location}</li>)}</ul> : <p>No maintained location row is attached.</p>}</section><section><Activity size={17} /><span>Chronology events</span>{selected.events.length ? <ul>{selected.events.map((event, index) => <li key={`${event.label || event.title || 'event'}-${index}`}>{event.label || event.title || event.summary || event.note || 'Linked chronology event'}</li>)}</ul> : <p>No verified local event row is attached.</p>}</section><section><FileSearch size={17} /><span>Evidence confidence</span><p>{selected.confidence.length ? selected.confidence.join(' · ') : 'Primary chapter source'}</p><small>{selected.status}</small></section><section><FileText size={17} /><span>Coverage</span><ul>{Object.entries(selected.coverage).map(([key, value]) => <li key={key}><b>{key}</b><small>{value ? 'Available' : 'Pending'}</small></li>)}</ul></section></div><footer><button type="button" disabled={!previous} onClick={() => previous && openChapter(previous.number)}><ArrowLeft size={14} /> {previous ? `Chapter ${previous.number}` : 'First record'}</button><a href={selected.source} target="_blank" rel="noreferrer noopener">Chapter reference <ExternalLink size={13} /></a><button type="button" disabled={!next} onClick={() => next && openChapter(next.number)}>{next ? `Chapter ${next.number}` : 'Latest record'} <ArrowRight size={14} /></button></footer></article></div>
  </div>;
}
