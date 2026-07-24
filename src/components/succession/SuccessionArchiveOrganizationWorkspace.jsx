import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  GitBranch,
  Landmark,
  MapPin,
  Network,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getOrganizationCurrentState,
  getOrganizationDossier,
  getOrganizationStateCoverageReport,
} from '../../data/succession/successionData';
import {
  ArchiveState,
  EntityBadge,
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveOrganizationWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const label = (value) => String(value || '').replaceAll('-', ' ');
const rangeLabel = (range) => `Ch. ${range.start}${range.end === null || range.end === undefined ? '–current' : range.end === range.start ? '' : `–${range.end}`}`;

const Fact = ({ label: factLabel, children }) => {
  if (children === null || children === undefined || children === '') return null;
  return <div><dt>{factLabel}</dt><dd>{children}</dd></div>;
};

const EntityButton = ({ entity, onNavigate, note }) => {
  if (!entity) return null;
  return <button type="button" className="succession-organization-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><b>{entity.name}</b><small>{note || label(entity.entityType)}</small></span>
  </button>;
};

function OrganizationDirectory({ organizations, onNavigate }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const coverage = getOrganizationStateCoverageReport();
  const types = useMemo(() => ['all', ...new Set(organizations.map((organization) => organization.organizationType || 'unknown'))], [organizations]);
  const states = useMemo(() => ['all', ...new Set(organizations.map((organization) => getOrganizationCurrentState(organization.id)?.status || organization.status || 'unknown'))], [organizations]);
  const roots = organizations.filter((organization) => !organization.parentOrganizationId);
  const childrenByParent = useMemo(() => organizations.reduce((map, organization) => {
    if (!organization.parentOrganizationId) return map;
    const current = map.get(organization.parentOrganizationId) || [];
    current.push(organization);
    map.set(organization.parentOrganizationId, current);
    return map;
  }, new Map()), [organizations]);
  const visible = useMemo(() => organizations.filter((organization) => {
    const state = getOrganizationCurrentState(organization.id);
    const typeMatch = type === 'all' || organization.organizationType === type;
    const statusMatch = status === 'all' || state?.status === status || organization.status === status;
    const text = normalize([
      organization.name,
      organization.id,
      organization.organizationType,
      organization.summary,
      ...(organization.objectives || []),
      state?.operationalState,
      state?.authority,
      ...(state?.objectiveStates || []),
      ...(state?.pressure || []),
    ].join(' '));
    return typeMatch && statusMatch && (!query.trim() || text.includes(normalize(query)));
  }), [organizations, query, status, type]);

  return <div className="succession-organization-workspace">
    <section className="succession-organization-hero">
      <div><span><Building2 size={16} /> Batch 2 · Institution dossiers</span><h2>Organizations as chapter-bounded systems of authority</h2><p>Compare leadership, membership, hierarchy, territory, objectives, operational pressure, assignments, relationships, events, and evidence without reducing institutions to a static roster.</p></div>
      <dl><Fact label="Organizations">{organizations.length}</Fact><Fact label="Explicit profiles">{coverage.explicitOrganizations}</Fact><Fact label="Coverage">{coverage.coveragePercent}%</Fact></dl>
    </section>

    <section className="succession-organization-filters" aria-label="Organization filters">
      <label><Search size={16} /><span className="sr-only">Search organizations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Institution, authority, objective, territory, pressure…" /></label>
      <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option value={item} key={item}>{item === 'all' ? 'All types' : label(item)}</option>)}</select></label>
      <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{states.map((item) => <option value={item} key={item}>{item === 'all' ? 'All states' : label(item)}</option>)}</select></label>
    </section>

    <section className="succession-organization-coverage" aria-label="Organization profile coverage by type">
      {coverage.organizationTypes.map((record) => <article key={record.id}><span>{record.label}</span><b>{record.explicit} / {record.total}</b><small>explicit profiles</small></article>)}
    </section>

    <section className="succession-organization-hierarchy" aria-labelledby="organization-hierarchy-title">
      <header><GitBranch size={18} /><div><span>Institutional hierarchy</span><h3 id="organization-hierarchy-title">Root organizations and subordinate units</h3></div></header>
      <div>{roots.map((root) => <article key={root.id}>
        <button type="button" onClick={() => onNavigate('organizations', { entity: root.id })}><EntityVisual entity={root} compact /><span><b>{root.name}</b><small>{label(root.organizationType)}</small></span><ArrowRight size={14} /></button>
        {!!childrenByParent.get(root.id)?.length && <div>{childrenByParent.get(root.id).map((child) => <button type="button" onClick={() => onNavigate('organizations', { entity: child.id })} key={child.id}><span>{child.name}</span><small>{label(child.organizationType)}</small></button>)}</div>}
      </article>)}</div>
    </section>

    <section className="succession-organization-grid" aria-label="Canonical organization directory">
      {visible.map((organization) => {
        const state = getOrganizationCurrentState(organization.id);
        const childCount = childrenByParent.get(organization.id)?.length || 0;
        return <article key={organization.id}>
          <div><EntityVisual entity={organization} /><EntityBadge entity={organization} compact /></div>
          <span>{label(organization.organizationType)} · {label(state?.status || organization.status)}</span>
          <h3>{organization.name}</h3>
          <p>{state?.operationalState || organization.summary}</p>
          <dl><Fact label="Objectives">{state?.objectiveStates?.length || organization.objectives?.length || 0}</Fact><Fact label="Child units">{childCount}</Fact><Fact label="Territories">{state?.territoryIds?.length || 0}</Fact></dl>
          <button type="button" onClick={() => onNavigate('organizations', { entity: organization.id })}>Open institution dossier <ArrowRight size={14} /></button>
        </article>;
      })}
    </section>
    {!visible.length && <ArchiveState kind="empty" title="No matching organizations" description="Clear the institutional search or choose different type and status filters." />}
  </div>;
}

function OrganizationDossier({ organization, chapter, spoilerLimit, onChapterChange, onNavigate, organizations }) {
  const dossier = getOrganizationDossier(organization.id, chapter);
  if (!dossier) return <ArchiveState kind="empty" title="Organization dossier unavailable" description="The canonical organization record could not be resolved." />;
  const index = organizations.findIndex((item) => item.id === organization.id);
  const previous = organizations[index - 1];
  const next = organizations[index + 1];
  const assignments = dossier.assignments?.assignments || [];
  const relationships = dossier.relationships?.relationships || [];

  return <article className="succession-organization-dossier">
    <header className="succession-organization-dossier__header">
      <button type="button" className="succession-organization-back" onClick={() => onNavigate('organizations')}><ArrowLeft size={15} /> Organization directory</button>
      <div className="succession-organization-dossier__identity"><EntityVisual entity={organization} /><div><EntityBadge entity={organization} /><span>{label(organization.organizationType)}</span><h2>{organization.name}</h2><p>{organization.summary}</p></div></div>
      <label className="succession-organization-chapter"><span>State at chapter</span><input type="number" min="338" max={spoilerLimit} value={chapter} onChange={(event) => onChapterChange(Math.min(spoilerLimit, Math.max(338, Number(event.target.value) || spoilerLimit)))} /></label>
    </header>

    <section className="succession-organization-state-board">
      <div><span>Operational state</span><h3>{dossier.state.operationalState}</h3><p>{dossier.state.authority}</p></div>
      <dl><Fact label="Status">{label(dossier.state.status)}</Fact><Fact label="Certainty">{dossier.state.certainty}</Fact><Fact label="Leaders">{dossier.leaders.length}</Fact><Fact label="Active personnel">{dossier.activePersonnel.length}</Fact><Fact label="Canonical members">{dossier.canonicalMembers.length}</Fact><Fact label="Territories">{dossier.territories.length}</Fact></dl>
    </section>

    <section className="succession-organization-hierarchy-board">
      <header><GitBranch size={18} /><div><span>Hierarchy</span><h3>Parent authority and subordinate units</h3></div></header>
      <div>
        {dossier.hierarchy.ancestors.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Ancestor organization" />)}
        {dossier.hierarchy.parent && <EntityButton entity={dossier.hierarchy.parent} onNavigate={onNavigate} note="Direct parent" />}
        {dossier.hierarchy.children.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Subordinate unit" />)}
        {!dossier.hierarchy.parent && !dossier.hierarchy.children.length && <p>No parent or child organization is published.</p>}
      </div>
    </section>

    <div className="succession-organization-dossier__columns">
      <section><header><Landmark size={17} /><div><span>Objectives</span><h3>Current institutional priorities</h3></div></header>{dossier.objectives.length ? <ol>{dossier.objectives.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No chapter-specific objectives are published.</p>}</section>
      <section><header><Shield size={17} /><div><span>Pressure</span><h3>Operational risks and unresolved constraints</h3></div></header>{dossier.pressure.length ? <ol>{dossier.pressure.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No structured pressure record is published.</p>}</section>
      <section><header><Users size={17} /><div><span>Leadership</span><h3>Canonical and chapter-active leaders</h3></div></header>{dossier.leaders.length ? <div>{dossier.leaders.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Leadership" />)}</div> : <p>No named leader is linked.</p>}</section>
      <section><header><Users size={17} /><div><span>Personnel</span><h3>Active personnel records at Chapter {chapter}</h3></div></header>{dossier.activePersonnel.length ? <div>{dossier.activePersonnel.map((record) => <EntityButton key={record.id} entity={record.character} onNavigate={onNavigate} note={`${record.role} · ${label(record.status)}`} />)}</div> : <p>No explicit personnel transition intersects this chapter.</p>}</section>
      <section><header><MapPin size={17} /><div><span>Territory</span><h3>Chapter-bounded operational locations</h3></div></header>{dossier.territories.length ? <div>{dossier.territories.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={label(entity.locationType)} />)}</div> : <p>No territory is asserted for this state.</p>}</section>
      <section><header><Activity size={17} /><div><span>Active events</span><h3>Operations intersecting the selected chapter</h3></div></header>{dossier.activeEvents.length ? <div>{dossier.activeEvents.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={rangeLabel(entity.chapterRange)} />)}</div> : <p>No organization event intersects Chapter {chapter}.</p>}</section>
      <section><header><Network size={17} /><div><span>Relationships</span><h3>Active institutional and political edges</h3></div></header>{relationships.length ? <div>{relationships.map((relationship) => {
        const otherId = relationship.sourceEntityId === organization.id ? relationship.targetEntityId : relationship.sourceEntityId;
        return <EntityButton key={relationship.id} entity={getEntityById(otherId)} onNavigate={onNavigate} note={`${label(relationship.relationshipType)} · ${relationship.sentiment}`} />;
      })}</div> : <p>No active relationship edge intersects Chapter {chapter}.</p>}</section>
      <section><header><Shield size={17} /><div><span>Assignments</span><h3>Operations attributed to or reporting through the institution</h3></div></header>{assignments.length ? <div>{assignments.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={`${label(entity.assignmentType)} · ${entity.status}`} />)}</div> : <p>No active canonical assignment directly references this organization.</p>}</section>
    </div>

    <section className="succession-organization-personnel-history">
      <header><Users size={17} /><div><span>Personnel history</span><h3>Leadership, membership, recruitment, casualties, and service transitions</h3></div></header>
      {dossier.personnelHistory.length ? <div>{dossier.personnelHistory.map((record) => <article key={record.id}>
        <span>{rangeLabel(record.chapterRange)} · {label(record.transitionType)} · {record.certainty}</span>
        <h4>{record.characterId ? getEntityById(record.characterId)?.name || record.characterId : record.role}</h4>
        <b>{record.role} · {label(record.status)}</b>
        <p>{record.note}</p>
        {getEntityById(record.characterId) && <EntityButton entity={getEntityById(record.characterId)} onNavigate={onNavigate} note="Open character dossier" />}
      </article>)}</div> : <p>No explicit personnel history is published for this organization.</p>}
    </section>

    <section className="succession-organization-event-history">
      <header><Activity size={17} /><div><span>Event history</span><h3>Institution-linked operations through Chapter {chapter}</h3></div></header>
      {dossier.eventHistory.length ? <div>{dossier.eventHistory.map((event) => <EntityButton key={event.id} entity={event} onNavigate={onNavigate} note={rangeLabel(event.chapterRange)} />)}</div> : <p>No organization-linked events are indexed.</p>}
    </section>

    {!!dossier.sources.length && <section className="succession-organization-sources"><header><BookOpen size={17} /><div><span>Evidence</span><h3>Institution, state, personnel, assignment, relationship, and event sources</h3></div></header>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</section>}

    <footer className="succession-organization-dossier__footer">
      {previous ? <button type="button" onClick={() => onNavigate('organizations', { entity: previous.id, chapter })}><ArrowLeft size={14} /><span><small>Previous</small>{previous.name}</span></button> : <span />}
      {next && <button type="button" onClick={() => onNavigate('organizations', { entity: next.id, chapter })}><span><small>Next</small>{next.name}</span><ArrowRight size={14} /></button>}
    </footer>
  </article>;
}

export default function OrganizationsWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const organizations = useMemo(() => [...getEntitiesByType('organization')].sort((left, right) => left.name.localeCompare(right.name)), []);
  const selected = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedChapter = Number(routeParams.chapter);
  const [chapter, setChapter] = useState(requestedChapter || spoilerLimit);

  useEffect(() => {
    setChapter(requestedChapter || spoilerLimit);
  }, [requestedChapter, spoilerLimit, selected?.id]);

  if (selected?.entityType === 'organization') {
    return <OrganizationDossier organization={selected} chapter={chapter} spoilerLimit={spoilerLimit} onChapterChange={(value) => { setChapter(value); onNavigate('organizations', { entity: selected.id, chapter: value }); }} onNavigate={onNavigate} organizations={organizations} />;
  }

  return <OrganizationDirectory organizations={organizations} onNavigate={onNavigate} />;
}
