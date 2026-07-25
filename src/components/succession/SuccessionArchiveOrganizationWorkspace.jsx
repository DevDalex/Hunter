import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  GitBranch,
  Landmark,
  Layers3,
  MapPin,
  Network,
  Search,
  Shield,
  Users,
  X,
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
import './SuccessionArchiveInstitutionCommand.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const label = (value) => String(value || '').replaceAll('-', ' ');
const rangeLabel = (range) => `Ch. ${range.start}${range.end === null || range.end === undefined ? '–current' : range.end === range.start ? '' : `–${range.end}`}`;
const stateClass = (value = '') => /dissolved|destroyed|inactive|ended/i.test(value)
  ? 'inactive'
  : /contested|unstable|uncertain|fragment/i.test(value)
    ? 'contested'
    : /active|operational|recognized|deployed/i.test(value)
      ? 'active'
      : 'neutral';

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

function InstitutionComparison({ organizations, chapter, selectedIds, onToggle, onNavigate }) {
  const selected = selectedIds.map((id) => organizations.find((organization) => organization.id === id)).filter(Boolean);
  const dossiers = selected.map((organization) => ({ organization, dossier: getOrganizationDossier(organization.id, chapter) })).filter((record) => record.dossier);
  const rows = [
    ['Type', (record) => label(record.organization.organizationType)],
    ['Status', (record) => label(record.dossier.state?.status || record.organization.status)],
    ['Authority', (record) => record.dossier.state?.authority || 'Unresolved'],
    ['Leaders', (record) => record.dossier.leaders.length],
    ['Active personnel', (record) => record.dossier.activePersonnel.length],
    ['Objectives', (record) => record.dossier.objectives.length],
    ['Pressure records', (record) => record.dossier.pressure.length],
    ['Territories', (record) => record.dossier.territories.length],
    ['Child units', (record) => record.dossier.hierarchy.children.length],
    ['Active events', (record) => record.dossier.activeEvents.length],
  ];

  return <section className="succession-institution-comparison" aria-labelledby="succession-institution-comparison-title">
    <header><div><span><BarChart3 size={17} aria-hidden="true" /> Comparison matrix</span><h3 id="succession-institution-comparison-title">Authority, reach, personnel, pressure, and operations</h3><p>Select up to four institutions. The matrix is chapter-bounded and preserves text labels rather than encoding meaning through color alone.</p></div><b>{selected.length} / 4 selected</b></header>
    <div className="succession-institution-comparison__picker" aria-label="Select organizations to compare">{organizations.map((organization) => {
      const active = selectedIds.includes(organization.id);
      const disabled = !active && selectedIds.length >= 4;
      return <button type="button" className={active ? 'is-selected' : ''} aria-pressed={active} disabled={disabled} onClick={() => onToggle(organization.id)} key={organization.id}>{active && <X size={12} aria-hidden="true" />}{organization.name}</button>;
    })}</div>
    {dossiers.length ? <div className="succession-institution-comparison__table-wrap"><table><thead><tr><th scope="col">Measure</th>{dossiers.map(({ organization }) => <th scope="col" key={organization.id}><button type="button" onClick={() => onNavigate('organizations', { entity: organization.id })}>{organization.name}<ArrowRight size={13} aria-hidden="true" /></button></th>)}</tr></thead><tbody>{rows.map(([rowLabel, value]) => <tr key={rowLabel}><th scope="row">{rowLabel}</th>{dossiers.map((record) => <td key={`${rowLabel}-${record.organization.id}`}>{value(record)}</td>)}</tr>)}</tbody></table></div> : <ArchiveState kind="empty" title="Choose institutions to compare" description="Select up to four organizations from the comparison picker." />}
  </section>;
}

function OrganizationDirectory({ organizations, chapter, initialView = 'directory', initialCompare = '', onNavigate }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');
  const [view, setView] = useState(['directory', 'hierarchy', 'comparison'].includes(initialView) ? initialView : 'directory');
  const initialCompareIds = initialCompare.split(',').filter((id) => organizations.some((organization) => organization.id === id)).slice(0, 4);
  const [compareIds, setCompareIds] = useState(initialCompareIds.length ? initialCompareIds : organizations.filter((organization) => !organization.parentOrganizationId).slice(0, 3).map((organization) => organization.id));
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
  const records = useMemo(() => organizations.map((organization) => ({
    organization,
    state: getOrganizationCurrentState(organization.id),
    dossier: getOrganizationDossier(organization.id, chapter),
  })), [chapter, organizations]);
  const visible = useMemo(() => records.filter(({ organization, state }) => {
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
  }), [query, records, status, type]);
  const metrics = useMemo(() => ({
    roots: roots.length,
    active: records.filter(({ state, organization }) => stateClass(state?.status || organization.status) === 'active').length,
    personnel: records.reduce((total, record) => total + (record.dossier?.activePersonnel.length || 0), 0),
    relationships: records.reduce((total, record) => total + (record.dossier?.relationships?.relationships.length || 0), 0),
  }), [records, roots.length]);
  const activeFilters = [
    query && { id: 'query', label: `Search: ${query}`, clear: () => setQuery('') },
    type !== 'all' && { id: 'type', label: `Type: ${label(type)}`, clear: () => setType('all') },
    status !== 'all' && { id: 'status', label: `Status: ${label(status)}`, clear: () => setStatus('all') },
  ].filter(Boolean);
  const toggleCompare = (id) => setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);

  return <div className="succession-organization-workspace succession-institution-command">
    <section className="succession-institution-command__hero">
      <div><span><Building2 size={16} aria-hidden="true" /> Institutional intelligence command</span><h2>Power is a system of authority, personnel, territory, and pressure</h2><p>Browse every canonical institution, reconstruct parent and subordinate units, compare operational reach, and open chapter-bounded dossiers without flattening organizations into static member lists.</p></div>
      <div className="succession-institution-command__network" aria-hidden="true"><Building2 size={38} /><span>{organizations.length}</span><small>connected institutions</small><i /><i /><i /></div>
    </section>

    <dl className="succession-institution-status-strip"><div><dt>Organizations</dt><dd>{organizations.length}</dd></div><div><dt>Root systems</dt><dd>{metrics.roots}</dd></div><div><dt>Active profiles</dt><dd>{metrics.active}</dd></div><div><dt>Active personnel</dt><dd>{metrics.personnel}</dd></div><div><dt>Relationship edges</dt><dd>{metrics.relationships}</dd></div></dl>

    <section className="succession-institution-control-deck" aria-label="Institution directory controls">
      <header><div><span>Command view</span><strong>{visible.length} of {organizations.length} institutions visible</strong></div><div>{[['directory', 'Directory', Layers3], ['hierarchy', 'Hierarchy', GitBranch], ['comparison', 'Compare', BarChart3]].map(([id, text, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} aria-pressed={view === id} onClick={() => setView(id)} key={id}><Icon size={15} aria-hidden="true" /> {text}</button>)}</div></header>
      <div className="succession-organization-filters succession-institution-filters">
        <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search organizations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Institution, authority, objective, territory, pressure…" /></label>
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}>{types.map((item) => <option value={item} key={item}>{item === 'all' ? 'All types' : label(item)}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{states.map((item) => <option value={item} key={item}>{item === 'all' ? 'All states' : label(item)}</option>)}</select></label>
      </div>
      <div className="succession-institution-active-filters">{!activeFilters.length && <span>No filters applied. Showing the complete institution graph.</span>}{activeFilters.map((item) => <button type="button" onClick={item.clear} key={item.id}>{item.label} <X size={12} aria-hidden="true" /></button>)}{!!activeFilters.length && <button type="button" className="is-reset" onClick={() => { setQuery(''); setType('all'); setStatus('all'); }}>Reset all</button>}</div>
    </section>

    <section className="succession-organization-coverage succession-institution-coverage" aria-label="Organization profile coverage by type">{coverage.organizationTypes.map((record) => <article key={record.id}><span>{record.label}</span><b>{record.explicit} / {record.total}</b><small>explicit profiles</small><i style={{ '--coverage': `${record.total ? Math.round(record.explicit / record.total * 100) : 0}%` }} /></article>)}</section>

    {view === 'hierarchy' && <section className="succession-organization-hierarchy succession-institution-hierarchy" aria-labelledby="organization-hierarchy-title"><header><GitBranch size={18} aria-hidden="true" /><div><span>Institutional hierarchy</span><h3 id="organization-hierarchy-title">Root organizations and subordinate units</h3><p>Branches remain explicit even when a root has no published subordinate record.</p></div></header><div>{roots.map((root) => <article key={root.id}><button type="button" onClick={() => onNavigate('organizations', { entity: root.id })}><EntityVisual entity={root} compact /><span><b>{root.name}</b><small>{label(root.organizationType)}</small></span><ArrowRight size={14} aria-hidden="true" /></button><div>{(childrenByParent.get(root.id) || []).map((child) => <button type="button" onClick={() => onNavigate('organizations', { entity: child.id })} key={child.id}><span>{child.name}</span><small>{label(child.organizationType)}</small></button>)}{!childrenByParent.get(root.id)?.length && <small>No subordinate unit published</small>}</div></article>)}</div></section>}

    {view === 'comparison' && <InstitutionComparison organizations={visible.map((record) => record.organization)} chapter={chapter} selectedIds={compareIds} onToggle={toggleCompare} onNavigate={onNavigate} />}

    {view === 'directory' && <section className="succession-organization-grid succession-institution-grid" aria-label="Canonical organization directory">{visible.map(({ organization, state, dossier }) => {
      const childCount = childrenByParent.get(organization.id)?.length || 0;
      const classification = stateClass(state?.status || organization.status);
      return <article className={`is-${classification}`} key={organization.id}>
        <header><EntityVisual entity={organization} /><div><EntityBadge entity={organization} compact /><span>{label(organization.organizationType)} · {label(state?.status || organization.status)}</span><h3>{organization.name}</h3></div></header>
        <p>{state?.operationalState || organization.summary}</p>
        <dl><Fact label="Leaders">{dossier?.leaders.length || 0}</Fact><Fact label="Personnel">{dossier?.activePersonnel.length || 0}</Fact><Fact label="Objectives">{dossier?.objectives.length || organization.objectives?.length || 0}</Fact><Fact label="Pressure">{dossier?.pressure.length || 0}</Fact><Fact label="Child units">{childCount}</Fact><Fact label="Territories">{dossier?.territories.length || 0}</Fact></dl>
        <footer><button type="button" className={compareIds.includes(organization.id) ? 'is-selected' : ''} aria-pressed={compareIds.includes(organization.id)} onClick={() => toggleCompare(organization.id)} disabled={!compareIds.includes(organization.id) && compareIds.length >= 4}><BarChart3 size={14} aria-hidden="true" /> {compareIds.includes(organization.id) ? 'In comparison' : 'Compare'}</button><button type="button" onClick={() => onNavigate('organizations', { entity: organization.id })}>Open institution dossier <ArrowRight size={14} aria-hidden="true" /></button></footer>
      </article>;
    })}</section>}
    {!visible.length && <ArchiveState kind="empty" title="No matching organizations" description="Clear the institutional search or choose different type and status filters." action={<button type="button" onClick={() => { setQuery(''); setType('all'); setStatus('all'); }}>Reset institution query</button>} />}
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

  return <article className="succession-organization-dossier succession-institution-dossier">
    <header className="succession-institution-dossier__hero" id="institution-overview">
      <div className="succession-institution-dossier__topline"><button type="button" className="succession-organization-back" onClick={() => onNavigate('organizations')}><ArrowLeft size={15} aria-hidden="true" /> Institution command</button><span>Institution record · {organization.id}</span></div>
      <div className="succession-institution-dossier__identity"><div className="succession-institution-dossier__visual"><EntityVisual entity={organization} /></div><div><EntityBadge entity={organization} /><span>{label(organization.organizationType)} · {label(dossier.state?.status || organization.status)}</span><h2>{organization.name}</h2><p>{organization.summary}</p></div></div>
      <div className="succession-institution-dossier__chapter"><div><span>State reconstruction boundary</span><strong>Chapter {chapter} of authorized Chapter {spoilerLimit}</strong></div><label><span className="sr-only">Institution state chapter</span><input type="number" min="338" max={spoilerLimit} value={chapter} onChange={(event) => onChapterChange(Math.min(spoilerLimit, Math.max(338, Number(event.target.value) || spoilerLimit)))} /></label><button type="button" onClick={() => onChapterChange(spoilerLimit)} disabled={chapter === spoilerLimit}>Latest</button></div>
    </header>

    <nav className="succession-institution-dossier-nav" aria-label="Institution dossier sections"><a href="#institution-state">State</a><a href="#institution-hierarchy">Hierarchy</a><a href="#institution-operations">Operations</a><a href="#institution-history">History</a><a href="#institution-evidence">Evidence</a></nav>

    <section className="succession-organization-state-board succession-institution-state-board" id="institution-state"><div><span>Operational state</span><h3>{dossier.state.operationalState}</h3><p>{dossier.state.authority}</p></div><dl><Fact label="Status">{label(dossier.state.status)}</Fact><Fact label="Certainty">{dossier.state.certainty}</Fact><Fact label="Leaders">{dossier.leaders.length}</Fact><Fact label="Active personnel">{dossier.activePersonnel.length}</Fact><Fact label="Canonical members">{dossier.canonicalMembers.length}</Fact><Fact label="Territories">{dossier.territories.length}</Fact></dl></section>

    <section className="succession-organization-hierarchy-board succession-institution-hierarchy-board" id="institution-hierarchy"><header><GitBranch size={18} aria-hidden="true" /><div><span>Command hierarchy</span><h3>Ancestors, direct authority, and subordinate units</h3></div></header><div className="succession-institution-chain">{dossier.hierarchy.ancestors.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Ancestor organization" />)}{dossier.hierarchy.parent && <EntityButton entity={dossier.hierarchy.parent} onNavigate={onNavigate} note="Direct parent" />}<div className="succession-institution-chain__focus"><EntityVisual entity={organization} compact /><span><b>{organization.name}</b><small>Selected institution</small></span></div>{dossier.hierarchy.children.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Subordinate unit" />)}{!dossier.hierarchy.parent && !dossier.hierarchy.children.length && <p>No parent or child organization is published.</p>}</div></section>

    <div className="succession-organization-dossier__columns succession-institution-operation-grid" id="institution-operations">
      <section><header><Landmark size={17} aria-hidden="true" /><div><span>Objectives</span><h3>Current institutional priorities</h3></div></header>{dossier.objectives.length ? <ol>{dossier.objectives.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No chapter-specific objectives are published.</p>}</section>
      <section><header><Shield size={17} aria-hidden="true" /><div><span>Pressure</span><h3>Operational risks and unresolved constraints</h3></div></header>{dossier.pressure.length ? <ol>{dossier.pressure.map((item) => <li key={item}>{item}</li>)}</ol> : <p>No structured pressure record is published.</p>}</section>
      <section><header><Users size={17} aria-hidden="true" /><div><span>Leadership</span><h3>Canonical and chapter-active leaders</h3></div></header>{dossier.leaders.length ? <div>{dossier.leaders.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note="Leadership" />)}</div> : <p>No named leader is linked.</p>}</section>
      <section><header><Users size={17} aria-hidden="true" /><div><span>Personnel</span><h3>Active personnel at Chapter {chapter}</h3></div></header>{dossier.activePersonnel.length ? <div>{dossier.activePersonnel.map((record) => <EntityButton key={record.id} entity={record.character} onNavigate={onNavigate} note={`${record.role} · ${label(record.status)}`} />)}</div> : <p>No explicit personnel transition intersects this chapter.</p>}</section>
      <section><header><MapPin size={17} aria-hidden="true" /><div><span>Territory</span><h3>Chapter-bounded operational locations</h3></div></header>{dossier.territories.length ? <div>{dossier.territories.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={label(entity.locationType)} />)}</div> : <p>No territory is asserted for this state.</p>}</section>
      <section><header><Activity size={17} aria-hidden="true" /><div><span>Active events</span><h3>Operations intersecting the selected chapter</h3></div></header>{dossier.activeEvents.length ? <div>{dossier.activeEvents.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={rangeLabel(entity.chapterRange)} />)}</div> : <p>No organization event intersects Chapter {chapter}.</p>}</section>
      <section><header><Network size={17} aria-hidden="true" /><div><span>Relationships</span><h3>Active institutional and political edges</h3></div></header>{relationships.length ? <div>{relationships.map((relationship) => { const otherId = relationship.sourceEntityId === organization.id ? relationship.targetEntityId : relationship.sourceEntityId; return <EntityButton key={relationship.id} entity={getEntityById(otherId)} onNavigate={onNavigate} note={`${label(relationship.relationshipType)} · ${relationship.sentiment}`} />; })}</div> : <p>No active relationship edge intersects Chapter {chapter}.</p>}</section>
      <section><header><Shield size={17} aria-hidden="true" /><div><span>Assignments</span><h3>Operations attributed to or reporting through the institution</h3></div></header>{assignments.length ? <div>{assignments.map((entity) => <EntityButton key={entity.id} entity={entity} onNavigate={onNavigate} note={`${label(entity.assignmentType)} · ${entity.status}`} />)}</div> : <p>No active canonical assignment directly references this organization.</p>}</section>
    </div>

    <section className="succession-organization-personnel-history succession-institution-history" id="institution-history"><header><Users size={17} aria-hidden="true" /><div><span>Personnel history</span><h3>Leadership, membership, recruitment, casualties, and service transitions</h3></div></header>{dossier.personnelHistory.length ? <div>{dossier.personnelHistory.map((record) => <article key={record.id}><span>{rangeLabel(record.chapterRange)} · {label(record.transitionType)} · {record.certainty}</span><h4>{record.characterId ? getEntityById(record.characterId)?.name || record.characterId : record.role}</h4><b>{record.role} · {label(record.status)}</b><p>{record.note}</p>{getEntityById(record.characterId) && <EntityButton entity={getEntityById(record.characterId)} onNavigate={onNavigate} note="Open character dossier" />}</article>)}</div> : <p>No explicit personnel history is published for this organization.</p>}</section>

    <section className="succession-organization-event-history succession-institution-event-history"><header><Activity size={17} aria-hidden="true" /><div><span>Event history</span><h3>Institution-linked operations through Chapter {chapter}</h3></div></header>{dossier.eventHistory.length ? <div>{dossier.eventHistory.map((event) => <EntityButton key={event.id} entity={event} onNavigate={onNavigate} note={rangeLabel(event.chapterRange)} />)}</div> : <p>No organization-linked events are indexed.</p>}</section>

    {!!dossier.sources.length && <section className="succession-organization-sources succession-institution-sources" id="institution-evidence"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence</span><h3>Institution, state, personnel, assignment, relationship, and event sources</h3></div></header>{dossier.sources.map((source) => <SourceReference key={source.id} source={source} onNavigate={onNavigate} />)}</section>}

    <footer className="succession-organization-dossier__footer succession-institution-dossier__footer">{previous ? <button type="button" onClick={() => onNavigate('organizations', { entity: previous.id, chapter })}><ArrowLeft size={14} aria-hidden="true" /><span><small>Previous institution</small>{previous.name}</span></button> : <span />}{next && <button type="button" onClick={() => onNavigate('organizations', { entity: next.id, chapter })}><span><small>Next institution</small>{next.name}</span><ArrowRight size={14} aria-hidden="true" /></button>}</footer>
  </article>;
}

export default function OrganizationsWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const organizations = useMemo(() => [...getEntitiesByType('organization')].sort((left, right) => left.name.localeCompare(right.name)), []);
  const selected = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedChapter = Number(routeParams.chapter);
  const [chapter, setChapter] = useState(requestedChapter || spoilerLimit);

  useEffect(() => setChapter(requestedChapter || spoilerLimit), [requestedChapter, spoilerLimit, selected?.id]);

  if (selected?.entityType === 'organization') return <OrganizationDossier organization={selected} chapter={chapter} spoilerLimit={spoilerLimit} onChapterChange={(value) => { setChapter(value); onNavigate('organizations', { entity: selected.id, chapter: value }); }} onNavigate={onNavigate} organizations={organizations} />;
  return <OrganizationDirectory organizations={organizations} chapter={chapter} initialView={routeParams.view} initialCompare={routeParams.compare || ''} onNavigate={onNavigate} />;
}
