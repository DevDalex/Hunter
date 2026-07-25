import { useMemo } from 'react';
import {
  Activity,
  Crown,
  GitBranch,
  Landmark,
  Library,
  Scale,
  Shield,
  Users,
} from 'lucide-react';
import {
  getAssignmentSnapshot,
  getEntitiesByType,
  getEventsForOrganization,
  getOrganizationDossier,
  getRelatedEntities,
  getRelationshipsForType,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import {
  EntityBadge,
  EntityHeader,
  EntityLink,
  EntityVisual,
  SourceReference,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveExtendedWorkspaces.css';

const roleLabel = (role) => String(role || '').replaceAll('-', ' ');
const latestChapter = () => getEntitiesByType('chapter').at(-1)?.number || 414;

function WorkspaceHero({ kicker, title, description, stats = [], icon: Icon = Library }) {
  return <section className="succession-extended-hero">
    <div><span><Icon size={16} aria-hidden="true" /> {kicker}</span><h2>{title}</h2><p>{description}</p></div>
    <dl>{stats.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
  </section>;
}

function EntityMiniButton({ entity, onNavigate }) {
  if (!entity) return null;
  return <EntityLink entity={entity} onNavigate={onNavigate} className="succession-extended-entity"><EntityVisual entity={entity} compact /><span><b>{entity.name}</b><small>{entity.entityType.replaceAll('-', ' ')}</small></span></EntityLink>;
}

export function HuntersWorkspace({ onNavigate, spoilerLimit = latestChapter() }) {
  const hunters = useMemo(() => getEntitiesByType('character').filter((character) => (character.roles || []).some((role) => role === 'hunter' || role === 'zodiac')), []);
  const grouped = useMemo(() => [
    ['Zodiac expedition command', hunters.filter((hunter) => hunter.roles?.includes('zodiac'))],
    ['Royal protection and instruction', hunters.filter((hunter) => hunter.roles?.some((role) => role === 'bodyguard' || role === 'nen-instructor'))],
    ['Other expedition Hunters', hunters.filter((hunter) => !hunter.roles?.includes('zodiac') && !hunter.roles?.some((role) => role === 'bodyguard' || role === 'nen-instructor'))],
  ].filter(([, records]) => records.length), [hunters]);

  return <div className="succession-hunters-workspace">
    <WorkspaceHero kicker="Hunter operations" title="Association duty, royal contracts, and expedition command" description="Every Hunter link opens the authoritative chapter-bounded character dossier. This role view only groups their current institutional purpose." icon={Shield} stats={[{ label: 'Hunters', value: hunters.length }, { label: 'Zodiacs', value: hunters.filter((item) => item.roles?.includes('zodiac')).length }, { label: 'Boundary', value: `Ch. ${spoilerLimit}` }]} />
    <div className="succession-hunter-missions">{grouped.map(([label, records]) => <section key={label}><header><span>{label}</span><b>{records.length}</b></header><div>{records.map((hunter) => {
      const snapshot = getAssignmentSnapshot(hunter.id, spoilerLimit);
      return <button type="button" onClick={() => onNavigate('characters', { entity: hunter.id })} key={hunter.id}><EntityVisual entity={hunter} compact /><span><h3>{hunter.name}</h3><p>{hunter.summary}</p><small>{snapshot?.assignments.length || 0} active assignment links · {(hunter.affiliations || []).map((item) => item.role).join(' · ')}</small></span></button>;
    })}</div></section>)}</div>
  </div>;
}

export function MilitaryWorkspace({ onNavigate, spoilerLimit = latestChapter() }) {
  const organizations = useMemo(() => getEntitiesByType('organization').filter((organization) => ['organization:kakin-military', 'organization:kakin-justice-bureau', 'organization:benjamin-private-army'].includes(organization.id)), []);
  const personnel = useMemo(() => getEntitiesByType('character').filter((character) => (character.roles || []).some((role) => ['military', 'justice-official', 'benjamin-soldier'].includes(role))), []);
  const dossiers = organizations.map((organization) => getOrganizationDossier(organization.id, spoilerLimit)).filter(Boolean);

  return <div className="succession-military-workspace">
    <WorkspaceHero kicker="Authority map" title="Military command, Justice procedure, and private-army operations" description="Institutional authority, personnel, assignments, and events are drawn from canonical organization dossiers rather than separate static ledgers." icon={Scale} stats={[{ label: 'Institutions', value: dossiers.length }, { label: 'Personnel', value: personnel.length }, { label: 'Boundary', value: `Ch. ${spoilerLimit}` }]} />
    <section className="succession-authority-chain"><header><Landmark size={18} aria-hidden="true" /><div><span>Command and jurisdiction</span><h3>Chapter-bounded authority</h3></div></header><div>{dossiers.map((dossier) => <article key={dossier.organization.id}><span>{roleLabel(dossier.organization.organizationType)}</span><h4>{dossier.organization.name}</h4><b>{dossier.state?.authority || 'Authority recorded in the institutional dossier.'}</b><p>{dossier.state?.operationalState}</p><button type="button" onClick={() => onNavigate('organizations', { entity: dossier.organization.id })}>Open institution</button></article>)}</div></section>
    <section className="succession-military-people"><header><Users size={18} aria-hidden="true" /><div><span>Personnel</span><h3>Soldiers and Justice officials</h3></div></header><div>{personnel.map((person) => <EntityMiniButton key={person.id} entity={person} onNavigate={onNavigate} />)}</div></section>
    <section className="succession-military-operations"><header><Activity size={18} aria-hidden="true" /><div><span>Connected events</span><h3>Operations linked to state authority</h3></div></header><div>{[...new Map(organizations.flatMap((organization) => getEventsForOrganization(organization.id)).filter((event) => event.chapterRange.start <= spoilerLimit).map((event) => [event.id, event])).values()].map((event) => <article key={event.id}><span>Ch. {event.chapterRange.start}{event.chapterRange.end && event.chapterRange.end !== event.chapterRange.start ? `–${Math.min(event.chapterRange.end, spoilerLimit)}` : ''}</span><h4>{event.name}</h4><p>{event.summary}</p><EntityLink entity={event} onNavigate={onNavigate}>Open event</EntityLink></article>)}</div></section>
  </div>;
}

export function PoliticsWorkspace({ onNavigate, spoilerLimit = latestChapter() }) {
  const royals = useMemo(() => getEntitiesByType('character').filter((character) => (character.roles || []).some((role) => ['king', 'queen', 'prince'].includes(role))), []);
  const politicalRelationships = useMemo(() => [...getRelationshipsForType('political'), ...getRelationshipsForType('family')], []);
  const visibleRelationships = politicalRelationships.filter((relationship) => relationship.chapterRange.start <= spoilerLimit);

  return <div className="succession-politics-workspace">
    <WorkspaceHero kicker="Political architecture" title="Royal branches, sponsorship, alliance, and competing authority" description="This role map uses canonical people, institutions, and typed relationships. Selected records always open their authoritative dossiers." icon={Crown} stats={[{ label: 'Royal actors', value: royals.length }, { label: 'Visible links', value: visibleRelationships.length }, { label: 'Boundary', value: `Ch. ${spoilerLimit}` }]} />
    <section className="succession-political-branches"><header><Crown size={18} aria-hidden="true" /><div><span>Royal family</span><h3>King, queens, and princes</h3></div></header><div>{royals.map((royal) => <button type="button" onClick={() => onNavigate('characters', { entity: royal.id })} key={royal.id}><span>{(royal.roles || []).find((role) => ['king', 'queen', 'prince'].includes(role))}</span><h4>{royal.name}</h4><p>{royal.summary}</p><small>Open canonical dossier</small></button>)}</div></section>
    <section className="succession-political-links"><header><GitBranch size={18} aria-hidden="true" /><div><span>Typed graph</span><h3>Family and political relationships</h3></div></header><div>{visibleRelationships.map((relationship) => <article key={relationship.id}><span>{relationship.relationshipType} · {relationship.status}</span><h4>{relationship.name}</h4><p>{relationship.summary}</p><EntityLink entity={relationship} onNavigate={onNavigate}>Open relationship</EntityLink></article>)}</div></section>
  </div>;
}

export function DomainEntityDetail({ entity, onNavigate }) {
  const sources = getSourcesForEntity(entity.id);
  const related = getRelatedEntities(entity.id);
  return <article className="succession-entity-detail">
    <EntityHeader entity={entity} onNavigate={onNavigate} />
    <section className="succession-entity-detail__facts"><div><span>Stable ID</span><code>{entity.id}</code></div><div><span>Entity type</span><EntityBadge entity={entity} compact /></div><div><span>Canon layer</span><b>{entity.canonLevel || 'canon'}</b></div><div><span>Publication</span><b>{entity.publicationStatus || 'published'}</b></div></section>
    {!!sources.length && <section className="succession-source-list" aria-labelledby="generic-source-list-title"><header><span>Evidence</span><h3 id="generic-source-list-title">Source references</h3></header>{sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}
    {!!related.length && <section className="succession-related"><header><Library size={17} aria-hidden="true" /><div><span>Canonical graph</span><h3>Related records</h3></div></header><div>{related.slice(0, 16).map((record) => <EntityLink entity={record} onNavigate={onNavigate} key={record.id} />)}</div></section>}
  </article>;
}
