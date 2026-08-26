import { useMemo } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  CircleHelp,
  Clock3,
  GitBranch,
  MapPin,
  Network,
  Orbit,
  Route,
  Ship,
  Users,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getEventsForAbility,
  getKnowledgeMatrix,
  getLocationBreadcrumbs,
  getLocationChildren,
  getLocationSnapshot,
  getRelationshipDetail,
  getRelationshipsForEntity,
} from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerDeepInstruments.css';

const MIN_CHAPTER = 340;
const safe = (factory, fallback) => {
  try { return factory(); } catch { return fallback; }
};
const entityLabel = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const chapterStart = (record) => Number(record?.chapterRange?.start || record?.firstChapter || record?.chapter || MIN_CHAPTER) || MIN_CHAPTER;
const chapterEnd = (record, boundary) => Math.min(boundary, Number(record?.chapterRange?.end ?? record?.latestChapter ?? boundary) || boundary);
const unique = (values) => [...new Set((values || []).filter(Boolean))];

function Frame({ eyebrow, title, description, icon: Icon, children, className = '' }) {
  return <section className={`succession-explorer-deep ${className}`.trim()}>
    <header className="succession-explorer-deep__head">
      <div><span>{eyebrow}</span><h3><Icon size={19} aria-hidden="true" /> {title}</h3><p>{description}</p></div>
    </header>
    {children}
  </section>;
}

function EntityButton({ entity, onClick, detail, icon: Icon = ChevronRight }) {
  if (!entity) return null;
  return <button type="button" className="succession-explorer-deep__entity" onClick={onClick}>
    <span>{labelize(entity.entityType)}</span>
    <strong>{entityLabel(entity)}</strong>
    {detail && <small>{detail}</small>}
    <Icon size={14} aria-hidden="true" />
  </button>;
}

const locationLoad = (snapshot) => (snapshot?.occupants?.length || 0)
  + (snapshot?.events?.length || 0)
  + (snapshot?.assignments?.length || 0)
  + (snapshot?.abilities?.length || 0);

export function BlackWhaleHierarchyInstrument({ chapter, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const selected = explorer.selectedIds.map(getEntityById).find((entity) => entity?.entityType === 'location');
  const root = getEntityById('location:black-whale')
    || safe(() => getEntitiesByType('location').find((location) => !location.parentId), null);
  const focus = selected || root;
  const snapshot = useMemo(() => focus ? safe(() => getLocationSnapshot(focus.id, chapter), null) : null, [chapter, focus]);
  const breadcrumbs = useMemo(() => focus ? safe(() => getLocationBreadcrumbs(focus.id), []), [focus]);
  const children = useMemo(() => focus ? safe(() => getLocationChildren(focus.id), []) : [], [focus]);
  const childRows = useMemo(() => children.map((location) => {
    const childSnapshot = safe(() => getLocationSnapshot(location.id, chapter), null);
    const grandchildren = safe(() => getLocationChildren(location.id), []);
    return { location, snapshot: childSnapshot, grandchildren, load: locationLoad(childSnapshot) };
  }).sort((left, right) => right.load - left.load || entityLabel(left.location).localeCompare(entityLabel(right.location))), [chapter, children]);
  const parent = focus?.parentId ? getEntityById(focus.parentId) : null;
  const siblings = useMemo(() => parent ? safe(() => getLocationChildren(parent.id), []).filter((location) => location.id !== focus?.id) : [], [focus?.id, parent]);

  const select = (location) => {
    if (!location) return;
    explorer.selectEntity(location.id, { routeId: 'black-whale', chapter, label: entityLabel(location) });
  };

  if (!focus) return null;
  return <Frame
    eyebrow="Nested vessel navigation"
    title={`${entityLabel(focus)} · spatial hierarchy`}
    description="This is the canonical parent/child location tree, not inferred map geometry. Move from vessel → tier → zone → room while chapter-bounded occupancy, events, assignments and Nen load update with the shared time machine."
    icon={Ship}
    className="succession-explorer-deep--ship"
  >
    <nav className="succession-explorer-location-crumbs" aria-label="Black Whale location hierarchy">
      {breadcrumbs.map((location, index) => <span key={location.id}>
        {index > 0 && <ChevronRight size={13} aria-hidden="true" />}
        <button type="button" aria-current={location.id === focus.id ? 'location' : undefined} onClick={() => select(location)}>{entityLabel(location)}</button>
      </span>)}
    </nav>

    <div className="succession-explorer-location-focus">
      <section>
        <span>{labelize(focus.locationType)} · {labelize(focus.accessLevel)}</span>
        <h4>{entityLabel(focus)}</h4>
        <p>{focus.summary}</p>
        <dl>
          <div><dt>Children</dt><dd>{children.length}</dd></div>
          <div><dt>Occupants</dt><dd>{snapshot?.occupants?.length || 0}</dd></div>
          <div><dt>Events</dt><dd>{snapshot?.events?.length || 0}</dd></div>
          <div><dt>Assignments</dt><dd>{snapshot?.assignments?.length || 0}</dd></div>
          <div><dt>Nen</dt><dd>{snapshot?.abilities?.length || 0}</dd></div>
        </dl>
      </section>
      <aside>
        {parent && <EntityButton entity={parent} detail="Move one level outward" icon={Route} onClick={() => select(parent)} />}
        <button type="button" onClick={() => onNavigate?.('locations', explorer.buildDeepLinkParams('locations', { entity: focus.id, chapter }))}><MapPin size={14} /> Open location dossier</button>
      </aside>
    </div>

    {!!childRows.length && <section className="succession-explorer-location-children">
      <header><GitBranch size={15} aria-hidden="true" /><div><span>Next spatial level</span><strong>{children.length} canonical child locations</strong></div></header>
      <div>{childRows.map((row) => <button type="button" onClick={() => select(row.location)} key={row.location.id}>
        <span>{labelize(row.location.locationType)} · {labelize(row.location.accessLevel)}</span>
        <strong>{entityLabel(row.location)}</strong>
        <small>{row.grandchildren.length} deeper · {row.snapshot?.occupants?.length || 0} occupants · {row.snapshot?.events?.length || 0} events · {row.snapshot?.assignments?.length || 0} assignments</small>
        <i aria-label={`${row.load} current indexed load`}><b style={{ width: `${Math.min(100, Math.max(4, row.load * 8))}%` }} /></i>
      </button>)}</div>
    </section>}

    {!childRows.length && !!siblings.length && <section className="succession-explorer-location-siblings">
      <header><Route size={15} /><div><span>Same parent</span><strong>Nearby hierarchy siblings</strong></div></header>
      <div>{siblings.slice(0, 18).map((location) => <EntityButton entity={location} onClick={() => select(location)} key={location.id} />)}</div>
    </section>}
  </Frame>;
}

const relationChapter = (event) => Number(event?.chapterRange?.start || event?.chapter || 0) || 0;

export function RelationshipEdgeBiographyInstrument({ chapter, view = 'network', onNavigate }) {
  const explorer = useSuccessionExplorer();
  const selectedRelationship = explorer.selectedIds.map(getEntityById).find((entity) => entity?.entityType === 'relationship');
  const selectedEntity = explorer.selectedIds.map(getEntityById).find((entity) => entity && entity.entityType !== 'relationship');
  const candidates = useMemo(() => {
    if (selectedRelationship) return [selectedRelationship];
    if (!selectedEntity) return [];
    return safe(() => getRelationshipsForEntity(selectedEntity.id), [])
      .filter((relationship) => chapterStart(relationship) <= chapter)
      .sort((left, right) => chapterStart(right) - chapterStart(left));
  }, [chapter, selectedEntity, selectedRelationship]);
  const rows = useMemo(() => candidates.slice(0, view === 'timeline' ? 30 : 16).map((relationship) => {
    const detail = safe(() => getRelationshipDetail(relationship.id), null);
    const events = (detail?.events || []).filter((event) => relationChapter(event) <= chapter).sort((a, b) => relationChapter(a) - relationChapter(b));
    return {
      relationship,
      source: detail?.source || getEntityById(relationship.sourceEntityId),
      target: detail?.target || getEntityById(relationship.targetEntityId),
      events,
      start: chapterStart(relationship),
      end: chapterEnd(relationship, chapter),
    };
  }), [candidates, chapter, view]);

  if (!rows.length) return null;
  const span = Math.max(1, chapter - MIN_CHAPTER + 1);
  return <Frame eyebrow="Temporal edge biographies" title={selectedRelationship ? entityLabel(selectedRelationship) : `${entityLabel(selectedEntity)} · relationships through time`} description="Every edge keeps its stored chapter range, direction, type, sentiment and related canonical events. Event markers are documentary anchors, not inferred emotional beats." icon={Network} className="succession-explorer-deep--relationships">
    <div className="succession-explorer-edge-biographies">{rows.map((row) => {
      const left = Math.max(0, ((row.start - MIN_CHAPTER) / span) * 100);
      const width = Math.max(1.5, ((row.end - row.start + 1) / span) * 100);
      return <article key={row.relationship.id}>
        <header>
          <span>{labelize(row.relationship.relationshipType)} · {labelize(row.relationship.sentiment)} · {labelize(row.relationship.direction)}</span>
          <strong>Ch. {row.start}{row.relationship.chapterRange?.end ? `–${row.relationship.chapterRange.end}` : '+'}</strong>
        </header>
        <div className="succession-explorer-edge-biographies__pair">
          <button type="button" onClick={() => row.source && explorer.selectEntity(row.source.id, { routeId: 'relationships', chapter, label: entityLabel(row.source) })}>{entityLabel(row.source)}</button>
          <ArrowRight size={14} aria-hidden="true" />
          <button type="button" onClick={() => row.target && explorer.selectEntity(row.target.id, { routeId: 'relationships', chapter, label: entityLabel(row.target) })}>{entityLabel(row.target)}</button>
        </div>
        <div className="succession-explorer-edge-biographies__rail" aria-label={`Relationship active from Chapter ${row.start} through ${row.relationship.chapterRange?.end || 'current boundary'}`}>
          <i style={{ left: `${left}%`, width: `${Math.min(100 - left, width)}%` }} />
          {row.events.map((event) => {
            const eventChapter = relationChapter(event);
            const position = Math.max(0, Math.min(100, ((eventChapter - MIN_CHAPTER) / span) * 100));
            return <button type="button" title={`Chapter ${eventChapter}: ${entityLabel(event)}`} style={{ left: `${position}%` }} onClick={() => explorer.selectEntity(event.id, { routeId: 'relationships', chapter: eventChapter, label: entityLabel(event) })} key={event.id}><span className="sr-only">Chapter {eventChapter}: {entityLabel(event)}</span></button>;
          })}
        </div>
        <footer><span>{row.events.length} linked event{row.events.length === 1 ? '' : 's'}</span><button type="button" onClick={() => onNavigate?.('relationships', explorer.buildDeepLinkParams('relationships', { entity: row.relationship.id, chapter }))}>Open edge dossier <ChevronRight size={12} /></button></footer>
      </article>;
    })}</div>
  </Frame>;
}

const mechanicsStages = (ability) => {
  if (!ability) return [];
  const owners = (ability.ownerIds || []).map(getEntityById).filter(Boolean);
  return [
    {
      id: 'owner', label: 'User / source', icon: Users,
      values: owners.length ? owners.map(entityLabel) : ['Owner unresolved'],
      state: owners.length ? 'documented' : 'unknown',
    },
    {
      id: 'activation', label: 'Activation', icon: Clock3,
      values: ability.activation ? [ability.activation] : ['Activation not documented'],
      state: ability.activation ? 'documented' : 'unknown',
    },
    {
      id: 'conditions', label: 'Conditions', icon: GitBranch,
      values: ability.conditions?.length ? ability.conditions : ['No explicit condition is documented in this record'],
      state: ability.conditions?.length ? 'documented' : 'unknown',
    },
    {
      id: 'mechanism', label: 'Mechanic classification', icon: BrainCircuit,
      values: unique([ability.category && labelize(ability.category), ...(ability.classification?.nenTypes || []).map((value) => `${labelize(value)} Nen`), ability.range && `Range: ${ability.range}`, ability.duration && `Duration: ${ability.duration}`]),
      state: ability.category || ability.classification?.nenTypes?.length ? 'documented' : 'unknown',
    },
    {
      id: 'effect', label: 'Observed effect / use', icon: Orbit,
      values: ability.knownUses?.length ? ability.knownUses : ability.summary ? [ability.summary] : ['Effect not documented'],
      state: ability.knownUses?.length || ability.summary ? 'documented' : 'unknown',
    },
    {
      id: 'risk', label: 'Costs / limits', icon: CircleHelp,
      values: [...(ability.costs || []), ...(ability.limitations || [])].length ? [...(ability.costs || []), ...(ability.limitations || [])] : ['No explicit cost or limitation is documented'],
      state: [...(ability.costs || []), ...(ability.limitations || [])].length ? 'documented' : 'unknown',
    },
  ];
};

export function NenMechanicsCircuitInstrument({ chapter, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const ability = explorer.selectedIds.map(getEntityById).find((entity) => entity?.entityType === 'ability')
    || explorer.compareIds.map(getEntityById).find((entity) => entity?.entityType === 'ability');
  const stages = useMemo(() => mechanicsStages(ability), [ability]);
  const evidenceEvents = useMemo(() => ability ? safe(() => getEventsForAbility(ability.id), []).filter((event) => chapterStart(event) <= chapter).sort((a, b) => chapterStart(a) - chapterStart(b)) : [], [ability, chapter]);

  if (!ability) return null;
  return <Frame eyebrow="Nen mechanics circuitry" title={`${entityLabel(ability)} · mechanic pipeline`} description="The circuit is assembled only from stored ability fields: owner, activation, conditions, classification, demonstrated uses, costs and limitations. Empty stages remain explicitly unknown rather than being completed by inference." icon={BrainCircuit} className="succession-explorer-deep--nen-circuit">
    <div className="succession-explorer-nen-circuit">{stages.map((stage, index) => {
      const Icon = stage.icon;
      return <div className={`succession-explorer-nen-circuit__stage is-${stage.state}`} key={stage.id}>
        <header><Icon size={15} /><span>{String(index + 1).padStart(2, '0')}</span><strong>{stage.label}</strong></header>
        <ul>{stage.values.slice(0, 8).map((value, valueIndex) => <li key={`${stage.id}:${valueIndex}`}>{value}</li>)}</ul>
        {index < stages.length - 1 && <ArrowRight className="succession-explorer-nen-circuit__arrow" size={18} aria-hidden="true" />}
      </div>;
    })}</div>
    <section className="succession-explorer-nen-circuit__evidence">
      <header><Clock3 size={14} /><div><span>Demonstration record</span><strong>{evidenceEvents.length} linked canonical event{evidenceEvents.length === 1 ? '' : 's'} through Ch. {chapter}</strong></div></header>
      <div>{evidenceEvents.slice(0, 16).map((event) => <button type="button" onClick={() => explorer.selectEntity(event.id, { routeId: 'nen', chapter: chapterStart(event), label: entityLabel(event) })} key={event.id}><span>CH. {chapterStart(event)}</span><strong>{entityLabel(event)}</strong></button>)}</div>
    </section>
    <button type="button" className="succession-explorer-deep__open" onClick={() => onNavigate?.('nen', { entity: ability.id, chapter })}>Open complete ability dossier <ChevronRight size={13} /></button>
  </Frame>;
}

export function KnowledgePropagationTrailInstrument({ chapter }) {
  const explorer = useSuccessionExplorer();
  const perspectiveId = explorer.perspective;
  const perspective = perspectiveId === 'reader' ? null : getEntityById(perspectiveId);
  const matrix = useMemo(() => safe(() => getKnowledgeMatrix(chapter), { records: [] }), [chapter]);
  const records = useMemo(() => perspective ? (matrix.records || [])
    .filter((record) => (record.knowerEntityIds || []).includes(perspectiveId) || (record.misinformedEntityIds || []).includes(perspectiveId))
    .sort((left, right) => chapterStart(left) - chapterStart(right) || left.id.localeCompare(right.id)) : [], [matrix.records, perspective, perspectiveId]);

  if (!perspective || !records.length) return null;
  const maxChapter = Math.max(MIN_CHAPTER, chapter);
  const span = Math.max(1, maxChapter - MIN_CHAPTER + 1);
  return <Frame eyebrow="Perspective information trail" title={`${entityLabel(perspective)} · documented knowledge acquisition`} description="This trail shows only explicit chapter-bounded knowledge records. A record may list co-knowers or a public-release chapter, but the UI never invents who told whom when the source data does not say so." icon={Route} className="succession-explorer-deep--knowledge-trail">
    <div className="succession-explorer-knowledge-trail__axis"><span>CH. {MIN_CHAPTER}</span><i /><span>CH. {maxChapter}</span></div>
    <ol className="succession-explorer-knowledge-trail">{records.slice(-40).map((record) => {
      const start = chapterStart(record);
      const position = Math.max(0, Math.min(100, ((start - MIN_CHAPTER) / span) * 100));
      const misinformed = (record.misinformedEntityIds || []).includes(perspectiveId);
      const coKnowers = (record.knowerEntityIds || []).filter((id) => id !== perspectiveId).map(getEntityById).filter(Boolean);
      const subjects = (record.subjectEntityIds || []).map(getEntityById).filter(Boolean);
      return <li className={misinformed ? 'is-misinformed' : 'is-known'} key={record.id} style={{ '--knowledge-position': `${position}%` }}>
        <i />
        <article>
          <header><span>CH. {start}</span><b>{misinformed ? 'Misinformed / protected' : labelize(record.knowledgeState)}</b></header>
          <strong>{record.name}</strong>
          <p>{record.acquisition}</p>
          <dl>
            <div><dt>Subjects</dt><dd>{subjects.length ? subjects.slice(0, 4).map(entityLabel).join(' · ') : (record.subjectLabels || []).slice(0, 4).join(' · ') || 'Not entity-linked'}</dd></div>
            <div><dt>Co-knowers on record</dt><dd>{coKnowers.length ? coKnowers.slice(0, 5).map(entityLabel).join(' · ') : 'None explicitly listed'}</dd></div>
            <div><dt>Public state</dt><dd>{record.publicAtChapter ? `Public at Ch. ${record.publicAtChapter}` : 'No public-release chapter recorded'}</dd></div>
          </dl>
        </article>
      </li>;
    })}</ol>
  </Frame>;
}
