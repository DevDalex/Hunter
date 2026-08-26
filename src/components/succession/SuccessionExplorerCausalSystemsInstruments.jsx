import { useMemo } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  GitBranch,
  MapPin,
  Network,
  Orbit,
  Route,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getChapterDeltaBrief,
  getEntitiesByType,
  getEntityById,
  getGuardianBeastDossier,
  getOrganizationDossier,
} from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerCausalSystemsInstruments.css';

const safe = (factory, fallback = null) => {
  try { return factory(); } catch { return fallback; }
};
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const compact = (value, max = 180) => {
  const string = Array.isArray(value) ? value.join(' · ') : String(value || '');
  return string.length > max ? `${string.slice(0, max - 1)}…` : string;
};
const eventChapter = (eventOrCompact) => {
  const entity = eventOrCompact?.id ? getEntityById(eventOrCompact.id) : eventOrCompact;
  return Number(entity?.chapterRange?.start || entity?.chapter || entity?.number || 0) || 0;
};

function Frame({ eyebrow, title, description, icon: Icon, children, className = '' }) {
  return <section className={`succession-explorer-causal-systems ${className}`.trim()}>
    <header className="succession-explorer-causal-systems__head">
      <div><span>{eyebrow}</span><h3><Icon size={19} aria-hidden="true" /> {title}</h3><p>{description}</p></div>
    </header>
    {children}
  </section>;
}

function SelectEntityButton({ entity, detail, onSelect, icon: Icon = ChevronRight }) {
  if (!entity) return null;
  return <button type="button" className="succession-explorer-causal-systems__entity" onClick={() => onSelect(entity)}>
    <span>{labelize(entity.entityType)}</span>
    <strong>{entityLabel(entity)}</strong>
    {detail && <small>{detail}</small>}
    <Icon size={13} aria-hidden="true" />
  </button>;
}

const causalPriority = new Map([
  ['direct-cause', 0],
  ['enabling-condition', 1],
  ['constraint', 2],
  ['contextual-link', 3],
  ['sequence-only', 4],
]);

export function ChapterCausalGatewayInstrument({ chapter, mode = 'previously' }) {
  const explorer = useSuccessionExplorer();
  const brief = useMemo(() => safe(() => getChapterDeltaBrief(chapter), null), [chapter]);
  const links = useMemo(() => {
    const all = brief?.causalLinks || [];
    if (!all.length) return [];
    const exact = all.filter((link) => mode === 'impact'
      ? eventChapter(link.source) === chapter
      : eventChapter(link.target) === chapter);
    const fallback = all.filter((link) => mode === 'impact'
      ? eventChapter(link.source) <= chapter && eventChapter(link.target) >= chapter
      : eventChapter(link.source) <= chapter && eventChapter(link.target) <= chapter);
    return [...(exact.length ? exact : fallback)].sort((left, right) => (causalPriority.get(left.causalityClass) ?? 9) - (causalPriority.get(right.causalityClass) ?? 9)
      || eventChapter(left.source) - eventChapter(right.source)
      || eventChapter(left.target) - eventChapter(right.target));
  }, [brief, chapter, mode]);

  if (!brief) return null;
  const isImpact = mode === 'impact';
  return <Frame
    eyebrow={isImpact ? 'Forward impact' : 'Causal prerequisites'}
    title={isImpact ? `What Chapter ${chapter} pushes forward` : `What Chapter ${chapter} depends on`}
    description="The gateway uses the archive’s existing causal classifier. Direct cause, enabling condition, constraint, contextual link, and sequence-only remain separate, and every displayed edge preserves its evidence state and source records."
    icon={isImpact ? ArrowRight : Route}
    className="succession-explorer-causal-systems--chapter"
  >
    <dl className="succession-explorer-causal-gateway__metrics">
      <div><dt>Added state</dt><dd>{brief.summary.additions}</dd></div>
      <div><dt>Modified state</dt><dd>{brief.summary.modifications}</dd></div>
      <div><dt>Direct causes</dt><dd>{brief.summary.directCauses}</dd></div>
      <div><dt>Enabling</dt><dd>{brief.summary.enablingConditions}</dd></div>
      <div><dt>Constraints</dt><dd>{brief.summary.constraints}</dd></div>
      <div><dt>Sequence only</dt><dd>{brief.summary.sequenceOnly}</dd></div>
    </dl>

    <div className="succession-explorer-causal-gateway__legend">
      <span><i className="is-direct" /> direct cause</span>
      <span><i className="is-enable" /> enabling condition</span>
      <span><i className="is-constraint" /> constraint</span>
      <span><i className="is-context" /> contextual link</span>
      <span><i className="is-sequence" /> sequence only, not causal</span>
    </div>

    <section className="succession-explorer-causal-gateway__lanes">
      <header><Clock3 size={15} aria-hidden="true" /><div><span>{isImpact ? 'Outgoing chapter pressure' : 'Incoming prerequisite pressure'}</span><strong>{links.length} classified links</strong></div></header>
      {!links.length && <div className="succession-explorer-causal-systems__empty"><CircleAlert size={16} /><p>No maintained causal link is attached to this chapter boundary in the selected direction. The interface does not manufacture one from chronology alone.</p></div>}
      <div>{links.map((link) => {
        const source = link.source?.id ? getEntityById(link.source.id) : null;
        const target = link.target?.id ? getEntityById(link.target.id) : null;
        return <article className={`is-${link.causalityClass}`} key={link.id}>
          <button type="button" onClick={() => source && explorer.selectEntity(source.id, { routeId: 'chapters', chapter: eventChapter(source) || chapter, label: entityLabel(source) })}>
            <span>CH. {eventChapter(source) || '—'}</span><strong>{entityLabel(source)}</strong>
          </button>
          <div className="succession-explorer-causal-gateway__edge">
            <b>{labelize(link.causalityClass)}</b>
            <i />
            <small>{labelize(link.evidenceState)}</small>
          </div>
          <button type="button" onClick={() => target && explorer.selectEntity(target.id, { routeId: 'chapters', chapter: eventChapter(target) || chapter, label: entityLabel(target) })}>
            <span>CH. {eventChapter(target) || '—'}</span><strong>{entityLabel(target)}</strong>
          </button>
          <footer>
            <span>{link.sourceRecords?.length || 0} source record{link.sourceRecords?.length === 1 ? '' : 's'}</span>
            {(link.sourceRecords || []).map((sourceRecord) => <button type="button" onClick={() => explorer.selectEntity(sourceRecord.id, { routeId: 'research', chapter, label: sourceRecord.name })} key={sourceRecord.id}>{sourceRecord.name}</button>)}
          </footer>
        </article>;
      })}</div>
    </section>
  </Frame>;
}

export function GuardianBeastEcologyInstrument({ chapter, mode = 'ecology' }) {
  const explorer = useSuccessionExplorer();
  const dossiers = useMemo(() => getEntitiesByType('guardian-beast')
    .map((beast) => safe(() => getGuardianBeastDossier(beast.id, chapter), null))
    .filter(Boolean)
    .sort((left, right) => Number(left.host?.princeOrder || 99) - Number(right.host?.princeOrder || 99) || entityLabel(left.host).localeCompare(entityLabel(right.host))), [chapter]);
  const systems = useMemo(() => [...new Map(dossiers.flatMap((dossier) => dossier.systems || []).map((profile) => [profile.id, profile])).values()], [dossiers]);
  const knownAbilityCount = dossiers.reduce((total, dossier) => total + (dossier.state?.knownAbilityIds?.length || 0), 0);
  const suspectedAbilityCount = dossiers.reduce((total, dossier) => total + (dossier.state?.suspectedAbilityIds?.length || 0), 0);
  const derivedStates = dossiers.filter((dossier) => dossier.state?.derived).length;
  const select = (entity, routeId = 'guardian-spirit-beasts') => entity && explorer.selectEntity(entity.id, { routeId, chapter, label: entityLabel(entity) });

  return <Frame
    eyebrow="Ritual ecology"
    title={`Guardian Spirit Beast field · Chapter ${chapter}`}
    description="All visible beast dossiers share one bounded field: host → beast → documented or suspected ability → ritual system. Derived chapter states stay labelled, and suspected abilities never merge into known mechanics."
    icon={Sparkles}
    className="succession-explorer-causal-systems--beasts"
  >
    <dl className="succession-explorer-beast-ecology__metrics">
      <div><dt>Visible beasts</dt><dd>{dossiers.length}</dd></div>
      <div><dt>Hosts</dt><dd>{new Set(dossiers.map((dossier) => dossier.host?.id).filter(Boolean)).size}</dd></div>
      <div><dt>Known abilities</dt><dd>{knownAbilityCount}</dd></div>
      <div><dt>Suspected abilities</dt><dd>{suspectedAbilityCount}</dd></div>
      <div><dt>Derived states</dt><dd>{derivedStates}</dd></div>
      <div><dt>Ritual systems</dt><dd>{systems.length}</dd></div>
    </dl>

    {(mode === 'ritual' || mode === 'ecology') && !!systems.length && <section className="succession-explorer-beast-ecology__systems">
      <header><Orbit size={15} aria-hidden="true" /><div><span>Shared ritual systems</span><strong>{systems.length} chapter-available system profiles</strong></div></header>
      <div>{systems.map((profile) => <article key={profile.id}>
        <div><span>{labelize(profile.category)}</span><strong>{profile.name}</strong><p>{profile.summary}</p></div>
        <dl><div><dt>Rules</dt><dd>{profile.rules?.length || 0}</dd></div><div><dt>Costs</dt><dd>{profile.costs?.length || 0}</dd></div><div><dt>Risks</dt><dd>{profile.risks?.length || 0}</dd></div><div><dt>Open questions</dt><dd>{profile.openQuestions?.length || 0}</dd></div></dl>
        {!!profile.rules?.length && <details><summary>Documented rules <ChevronRight size={13} /></summary><div>{profile.rules.map((rule, index) => <p key={index}>{rule}</p>)}</div></details>}
      </article>)}</div>
    </section>}

    <section className="succession-explorer-beast-ecology__field">
      <header><Network size={15} aria-hidden="true" /><div><span>Host ↔ beast ↔ mechanic field</span><strong>{dossiers.length} dossiers</strong></div></header>
      <div>{dossiers.map((dossier) => {
        const known = new Set(dossier.state?.knownAbilityIds || []);
        const suspected = new Set(dossier.state?.suspectedAbilityIds || []);
        return <article className={dossier.state?.derived ? 'is-derived' : 'is-explicit'} key={dossier.beast.id}>
          <button type="button" className="succession-explorer-beast-ecology__host" onClick={() => select(dossier.host, 'princes')}>
            <span>{dossier.host?.princeOrder ? `Prince ${dossier.host.princeOrder}` : labelize(dossier.host?.roles?.[0])}</span><strong>{entityLabel(dossier.host)}</strong>
          </button>
          <ArrowRight size={14} aria-hidden="true" />
          <button type="button" className="succession-explorer-beast-ecology__beast" onClick={() => select(dossier.beast)}>
            <span>{dossier.state?.derived ? 'Derived chapter state' : labelize(dossier.state?.knowledge)}</span><strong>{entityLabel(dossier.beast)}</strong><small>{compact(dossier.state?.operationalState, 130)}</small>
          </button>
          <ArrowRight size={14} aria-hidden="true" />
          <div className="succession-explorer-beast-ecology__abilities">
            {dossier.abilities.length ? dossier.abilities.map((knowledge) => <button type="button" className={known.has(knowledge.ability.id) ? 'is-known' : suspected.has(knowledge.ability.id) ? 'is-suspected' : 'is-linked'} onClick={() => select(knowledge.ability, 'nen')} key={knowledge.ability.id}>
              <span>{known.has(knowledge.ability.id) ? 'Known' : suspected.has(knowledge.ability.id) ? 'Suspected' : labelize(knowledge.knowledgeState)}</span><strong>{knowledge.ability.name}</strong>
            </button>) : <span className="is-empty">No chapter-visible ability record</span>}
          </div>
          <footer><span>{dossier.sources.length} sources</span><span>{dossier.timeline.length} state records</span><span>{labelize(dossier.state?.certainty)}</span></footer>
        </article>;
      })}</div>
    </section>
  </Frame>;
}

export function OrganizationDependencyInstrument({ chapter, mode = 'dependencies', onNavigate }) {
  const explorer = useSuccessionExplorer();
  const organization = explorer.selectedIds.map(getEntityById).find((entity) => entity?.entityType === 'organization')
    || explorer.compareIds.map(getEntityById).find((entity) => entity?.entityType === 'organization');
  const dossier = useMemo(() => organization ? safe(() => getOrganizationDossier(organization.id, chapter), null) : null, [chapter, organization]);
  const candidates = useMemo(() => !organization ? getEntitiesByType('organization').map((entity) => ({ entity, dossier: safe(() => getOrganizationDossier(entity.id, chapter), null) })).filter((record) => record.dossier) : [], [chapter, organization]);
  const select = (entity, routeId = 'organizations') => entity && explorer.selectEntity(entity.id, { routeId, chapter, label: entityLabel(entity) });

  if (!dossier) return <Frame
    eyebrow="Documented dependency context"
    title="Select an organization to open its operating topology"
    description="This view only uses links already present in the organization dossier: hierarchy, active personnel, territory, assignments, relationships, events and sources. A connection is not automatically treated as indispensable."
    icon={Building2}
    className="succession-explorer-causal-systems--organization"
  ><div className="succession-explorer-organization-topology__chooser">{candidates.map(({ entity, dossier: candidate }) => <button type="button" onClick={() => select(entity)} key={entity.id}><span>{labelize(entity.organizationType)}</span><strong>{entity.name}</strong><small>{candidate.activePersonnel.length} personnel · {candidate.activeEvents.length} active events · {candidate.relationships?.relationships?.length || 0} relationships</small><ChevronRight size={13} /></button>)}</div></Frame>;

  const hierarchy = [
    ...(dossier.hierarchy?.ancestors || []),
    ...(dossier.hierarchy?.parent ? [dossier.hierarchy.parent] : []),
    ...(dossier.hierarchy?.children || []),
  ].filter((entity, index, values) => values.findIndex((candidate) => candidate.id === entity.id) === index);
  const personnel = dossier.activePersonnel || [];
  const relationships = dossier.relationships?.relationships || [];
  const assignments = dossier.assignments?.assignments || [];
  const relationshipRows = relationships.map((relationship) => {
    const otherId = relationship.sourceEntityId === organization.id ? relationship.targetEntityId : relationship.sourceEntityId;
    return { relationship, entity: getEntityById(otherId) };
  }).filter((row) => row.entity);

  const categories = [
    { id: 'hierarchy', label: 'Hierarchy', icon: GitBranch, count: hierarchy.length, rows: hierarchy.map((entity) => ({ entity, detail: entity.parentOrganizationId === organization.id ? 'Child organization' : dossier.hierarchy?.parent?.id === entity.id ? 'Parent organization' : 'Ancestor' })) },
    { id: 'people', label: 'Active personnel', icon: Users, count: personnel.length, rows: personnel.map((record) => ({ entity: record.character, detail: `${record.role || 'Member'} · ${labelize(record.status)}` })) },
    { id: 'territory', label: 'Territory', icon: MapPin, count: dossier.territories.length, rows: dossier.territories.map((entity) => ({ entity, detail: 'Chapter-bounded territory record', routeId: 'black-whale' })) },
    { id: 'relationships', label: 'Relationships', icon: Network, count: relationshipRows.length, rows: relationshipRows.map((row) => ({ entity: row.entity, detail: `${labelize(row.relationship.relationshipType)} · ${labelize(row.relationship.sentiment)}` })) },
    { id: 'assignments', label: 'Assignments', icon: Shield, count: assignments.length, rows: assignments.map((record) => ({ entity: getEntityById(record.personId) || getEntityById(record.subjectEntityId), detail: `${labelize(record.assignmentType)} · ${record.name || 'assignment'}`, routeId: 'bodyguards' })) },
    { id: 'events', label: 'Active events', icon: Clock3, count: dossier.activeEvents.length, rows: dossier.activeEvents.map((entity) => ({ entity, detail: `Chapter ${eventChapter(entity)}`, routeId: 'events' })) },
  ];
  const visibleCategories = mode === 'hierarchy' ? categories.filter((category) => ['hierarchy', 'people'].includes(category.id))
    : mode === 'territory' ? categories.filter((category) => ['territory', 'events', 'relationships'].includes(category.id))
      : categories;

  return <Frame
    eyebrow="Documented dependency context"
    title={`${organization.name} · operating topology`}
    description="The center node is surrounded by canonical hierarchy, active personnel, territory, assignments, relationships and events. The topology exposes what the dossier links; it does not infer that every linked record is a necessary dependency."
    icon={Building2}
    className="succession-explorer-causal-systems--organization"
  >
    <div className="succession-explorer-organization-topology__center">
      <div><span>{labelize(organization.organizationType)} · Chapter {chapter}</span><strong>{organization.name}</strong><p>{dossier.state?.operationalState || organization.summary}</p></div>
      <dl><div><dt>Personnel</dt><dd>{personnel.length}</dd></div><div><dt>Territories</dt><dd>{dossier.territories.length}</dd></div><div><dt>Assignments</dt><dd>{assignments.length}</dd></div><div><dt>Relationships</dt><dd>{relationships.length}</dd></div><div><dt>Active events</dt><dd>{dossier.activeEvents.length}</dd></div><div><dt>Sources</dt><dd>{dossier.sources.length}</dd></div></dl>
    </div>

    {!!dossier.objectives.length && <section className="succession-explorer-organization-topology__objectives"><header><Route size={15} /><div><span>Maintained objectives</span><strong>{dossier.objectives.length}</strong></div></header><div>{dossier.objectives.map((objective, index) => <p key={index}>{objective}</p>)}</div></section>}
    {!!dossier.pressure.length && <section className="succession-explorer-organization-topology__pressure"><header><CircleAlert size={15} /><div><span>Maintained pressure</span><strong>{dossier.pressure.length}</strong></div></header><div>{dossier.pressure.map((pressure, index) => <p key={index}>{pressure}</p>)}</div></section>}

    <div className="succession-explorer-organization-topology__categories">{visibleCategories.map((category) => {
      const Icon = category.icon;
      return <section key={category.id}>
        <header><Icon size={15} aria-hidden="true" /><div><span>{category.label}</span><strong>{category.count}</strong></div></header>
        <div>{category.rows.length ? category.rows.map((row, index) => <SelectEntityButton entity={row.entity} detail={row.detail} onSelect={(entity) => select(entity, row.routeId || 'organizations')} key={`${category.id}:${row.entity?.id || index}`} />) : <p>No chapter-active records in this category.</p>}</div>
      </section>;
    })}</div>

    <footer className="succession-explorer-causal-systems__footer"><button type="button" onClick={() => onNavigate?.('organizations', explorer.buildDeepLinkParams('organizations', { entity: organization.id, chapter }))}>Open complete organization dossier <ChevronRight size={13} /></button><span><FileCheck2 size={13} /> {dossier.sources.length} canonical source records bound to the dossier</span></footer>
  </Frame>;
}
