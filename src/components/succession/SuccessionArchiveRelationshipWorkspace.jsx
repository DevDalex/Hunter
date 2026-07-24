import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  Eye,
  Filter,
  GitBranch,
  Network,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import {
  getActiveRelationshipsAtChapter,
  getEntitiesByType,
  getEntityById,
  getRelationshipDetail,
  getRelationshipNeighborhood,
  getRelationshipSnapshot,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import {
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveRelationshipWorkspace.css';

const relationships = getEntitiesByType('relationship');
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const titleCase = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (values) => [...new Set(values.filter(Boolean))];

const rangeLabel = (range) => {
  if (!range?.start) return 'Unbounded';
  if (range.end === null || range.end === undefined) return `${range.start}–current`;
  return range.start === range.end ? String(range.start) : `${range.start}–${range.end}`;
};

const relationshipOrder = (left, right) => left.chapterRange.start - right.chapterRange.start
  || String(left.name).localeCompare(String(right.name));

function LinkedEntity({ entity, label, onNavigate, onFocus }) {
  if (!entity) return null;
  return <article className={`succession-relationship-linked-entity is-${entity.entityType}`}>
    <button type="button" onClick={() => onFocus(entity)}>
      <EntityVisual entity={entity} compact />
      <span><small>{label || titleCase(entity.entityType)}</small><b>{entity.name}</b></span>
      <Network size={13} aria-hidden="true" />
    </button>
    <button type="button" className="succession-relationship-linked-entity__record" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>Record <ArrowRight size={11} aria-hidden="true" /></button>
  </article>;
}

function RelationshipCard({ relationship, onOpen, onFocus, onNavigate }) {
  const detail = getRelationshipDetail(relationship.id);
  return <article className={`succession-relationship-card is-${relationship.sentiment} is-${relationship.status}`}>
    <div className="succession-relationship-card__nodes">
      <button type="button" onClick={() => detail?.source && onFocus(detail.source)}><EntityVisual entity={detail?.source} compact /><span>{detail?.source?.name || relationship.sourceEntityId}</span></button>
      <span><GitBranch size={16} aria-hidden="true" /><small>{relationship.direction === 'bidirectional' ? 'two-way' : 'directed'}</small></span>
      <button type="button" onClick={() => detail?.target && onFocus(detail.target)}><EntityVisual entity={detail?.target} compact /><span>{detail?.target?.name || relationship.targetEntityId}</span></button>
    </div>
    <button type="button" className="succession-relationship-card__body" onClick={() => onOpen(relationship)}>
      <small>{titleCase(relationship.relationshipType)} · Ch. {rangeLabel(relationship.chapterRange)}</small>
      <h3>{relationship.name}</h3>
      <p>{relationship.summary}</p>
      <em>{titleCase(relationship.subtype)}</em>
    </button>
    <dl><div><dt>State</dt><dd>{titleCase(relationship.status)}</dd></div><div><dt>Sentiment</dt><dd>{titleCase(relationship.sentiment)}</dd></div><div><dt>Strength</dt><dd>{titleCase(relationship.strength)}</dd></div></dl>
    <footer><button type="button" onClick={() => onOpen(relationship)}>Open relationship</button>{detail?.events?.[0] && <button type="button" onClick={() => onNavigate('events', { entity: detail.events[0].id })}>First linked event</button>}</footer>
  </article>;
}

export default function SuccessionArchiveRelationshipWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const routeEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const initialFocus = routeEntity && routeEntity.entityType !== 'relationship' ? routeEntity.id : routeParams.focus || '';
  const [query, setQuery] = useState(routeParams.search || '');
  const [type, setType] = useState(routeParams.type || 'all');
  const [sentiment, setSentiment] = useState(routeParams.sentiment || 'all');
  const [status, setStatus] = useState(routeParams.status || 'all');
  const [direction, setDirection] = useState(routeParams.direction || 'all');
  const [focus, setFocus] = useState(initialFocus);
  const [selectedId, setSelectedId] = useState(routeEntity?.entityType === 'relationship' ? routeEntity.id : '');
  const [snapshotChapter, setSnapshotChapter] = useState(Number(routeParams.chapter) || spoilerLimit);

  useEffect(() => {
    const entity = routeParams.entity ? getEntityById(routeParams.entity) : null;
    setSelectedId(entity?.entityType === 'relationship' ? entity.id : '');
    setFocus(entity && entity.entityType !== 'relationship' ? entity.id : routeParams.focus || '');
  }, [routeParams.entity, routeParams.focus]);

  useEffect(() => {
    setSnapshotChapter((current) => Math.min(Number(current) || spoilerLimit, spoilerLimit));
  }, [spoilerLimit]);

  const types = useMemo(() => unique(relationships.map((relationship) => relationship.relationshipType)).sort(), []);
  const sentiments = useMemo(() => unique(relationships.map((relationship) => relationship.sentiment)).sort(), []);
  const statuses = useMemo(() => unique(relationships.map((relationship) => relationship.status)).sort(), []);
  const chapterRelationships = getActiveRelationshipsAtChapter(snapshotChapter);

  const visible = useMemo(() => [...relationships].sort(relationshipOrder).filter((relationship) => {
    const detail = getRelationshipDetail(relationship.id);
    const searchable = normalize([
      relationship.name,
      relationship.summary,
      relationship.relationshipType,
      relationship.subtype,
      relationship.basis,
      relationship.operationalState,
      relationship.strength,
      relationship.certainty,
      ...(relationship.aliases || []),
      ...(relationship.evidenceNotes || []),
      detail?.source?.name,
      detail?.target?.name,
      ...detail?.events?.map((event) => event.name) || [],
    ].join(' '));
    return relationship.chapterRange.start <= spoilerLimit
      && (type === 'all' || relationship.relationshipType === type)
      && (sentiment === 'all' || relationship.sentiment === sentiment)
      && (status === 'all' || relationship.status === status)
      && (direction === 'all' || relationship.direction === direction)
      && (!focus || relationship.sourceEntityId === focus || relationship.targetEntityId === focus)
      && (!query.trim() || searchable.includes(normalize(query)));
  }), [direction, focus, query, sentiment, spoilerLimit, status, type]);

  const selectedRelationship = selectedId ? getEntityById(selectedId) : null;
  const selectedDetail = selectedRelationship?.entityType === 'relationship' ? getRelationshipDetail(selectedRelationship.id) : null;
  const selectedSources = selectedRelationship?.entityType === 'relationship' ? getSourcesForEntity(selectedRelationship.id) : [];
  const focusEntity = focus ? getEntityById(focus) : null;
  const focusSnapshot = focusEntity ? getRelationshipSnapshot(focusEntity.id, snapshotChapter) : null;
  const neighborhood = focusEntity ? getRelationshipNeighborhood(focusEntity.id, snapshotChapter) : null;

  const connectivity = useMemo(() => {
    const counts = new Map();
    for (const relationship of chapterRelationships) {
      counts.set(relationship.sourceEntityId, (counts.get(relationship.sourceEntityId) || 0) + 1);
      counts.set(relationship.targetEntityId, (counts.get(relationship.targetEntityId) || 0) + 1);
    }
    return [...counts.entries()]
      .map(([entityId, count]) => ({ entity: getEntityById(entityId), count }))
      .filter((entry) => entry.entity)
      .sort((left, right) => right.count - left.count || left.entity.name.localeCompare(right.entity.name))
      .slice(0, 12);
  }, [chapterRelationships]);

  const openRelationship = (relationship) => {
    setSelectedId(relationship.id);
    onNavigate('relationships', { entity: relationship.id, chapter: snapshotChapter });
  };

  const openFocus = (entity) => {
    setSelectedId('');
    setFocus(entity.id);
    onNavigate('relationships', { focus: entity.id, chapter: snapshotChapter });
  };

  const closeDetail = () => {
    setSelectedId('');
    onNavigate('relationships', focus ? { focus, chapter: snapshotChapter } : { chapter: snapshotChapter });
  };

  const clearFocus = () => {
    setSelectedId('');
    setFocus('');
    onNavigate('relationships', { chapter: snapshotChapter });
  };

  const resetFilters = () => {
    setQuery('');
    setType('all');
    setSentiment('all');
    setStatus('all');
    setDirection('all');
  };

  const activeFilterCount = [query, type !== 'all', sentiment !== 'all', status !== 'all', direction !== 'all'].filter(Boolean).length;
  const hostileCount = chapterRelationships.filter((relationship) => relationship.sentiment === 'hostile').length;
  const commandCount = chapterRelationships.filter((relationship) => relationship.relationshipType === 'command').length;

  return <div className="succession-canonical-relationships">
    <section className="succession-canonical-relationships__hero">
      <div><span>Canonical relationship graph</span><h2>Family, protection, command, treaty, deception, rivalry, and open hostility</h2><p>Each edge preserves its two endpoints, direction, type, subtype, sentiment, evidence basis, operational state, chapter range, and related events. Shared rooms and affiliations never create automatic loyalty.</p></div>
      <dl><div><dt>Relationships</dt><dd>{relationships.length}</dd></div><div><dt>Active at Ch. {snapshotChapter}</dt><dd>{chapterRelationships.length}</dd></div><div><dt>Hostile</dt><dd>{hostileCount}</dd></div><div><dt>Command</dt><dd>{commandCount}</dd></div></dl>
    </section>

    <section className="succession-relationship-filter-panel" aria-labelledby="succession-relationship-filter-title">
      <header><Filter size={17} aria-hidden="true" /><div><span>Graph filters</span><h3 id="succession-relationship-filter-title">Filter relationship states and evidence</h3></div><b>{activeFilterCount} active</b></header>
      <label className="succession-relationship-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search canonical relationships</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, faction, treaty, command, hostility, evidence…" /></label>
      <div className="succession-relationship-filter-panel__fields">
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option>{types.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Sentiment</span><select value={sentiment} onChange={(event) => setSentiment(event.target.value)}><option value="all">All sentiments</option>{sentiments.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All states</option>{statuses.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Direction</span><select value={direction} onChange={(event) => setDirection(event.target.value)}><option value="all">All directions</option><option value="directed">Directed</option><option value="bidirectional">Bidirectional</option></select></label>
        <label><span>Snapshot chapter</span><input type="number" min="338" max={spoilerLimit} value={snapshotChapter} onChange={(event) => setSnapshotChapter(Math.min(spoilerLimit, Math.max(338, Number(event.target.value) || 338)))} /></label>
      </div>
      <footer><span role="status" aria-live="polite">Showing {visible.length} of {relationships.length} records{focusEntity ? ` around ${focusEntity.name}` : ''}.</span><div>{focusEntity && <button type="button" onClick={clearFocus}>Clear node focus</button>}<button type="button" disabled={!activeFilterCount} onClick={resetFilters}>Clear filters</button></div></footer>
    </section>

    {!selectedDetail && <section className="succession-relationship-connectivity" aria-labelledby="succession-relationship-connectivity-title">
      <header><Network size={18} aria-hidden="true" /><div><span>Chapter {snapshotChapter} network</span><h3 id="succession-relationship-connectivity-title">Highest-connectivity people and organizations</h3></div></header>
      <div>{connectivity.map(({ entity, count }) => <button type="button" className={focus === entity.id ? 'is-active' : ''} onClick={() => openFocus(entity)} key={entity.id}><EntityVisual entity={entity} compact /><span><b>{entity.name}</b><small>{count} active edge{count === 1 ? '' : 's'}</small></span></button>)}</div>
    </section>}

    {focusEntity && focusSnapshot && !selectedDetail && <article className="succession-relationship-node-snapshot">
      <header><button type="button" onClick={clearFocus}><ArrowLeft size={14} aria-hidden="true" /> Whole graph</button><EntityVisual entity={focusEntity} /><div><span>Chapter {focusSnapshot.chapter} node snapshot</span><h2>{focusEntity.name}</h2><p>{focusEntity.summary}</p></div><dl><div><dt>Edges</dt><dd>{focusSnapshot.relationships.length}</dd></div><div><dt>Outgoing</dt><dd>{focusSnapshot.outgoing.length}</dd></div><div><dt>Incoming</dt><dd>{focusSnapshot.incoming.length}</dd></div><div><dt>Neighbors</dt><dd>{focusSnapshot.neighbors.length}</dd></div></dl></header>
      <section><header><Users size={17} aria-hidden="true" /><div><span>Immediate neighborhood</span><h3>{neighborhood?.nodes.length || 0} connected nodes at Chapter {focusSnapshot.chapter}</h3></div></header><div>{focusSnapshot.neighbors.map((entity) => <LinkedEntity entity={entity} onNavigate={onNavigate} onFocus={openFocus} key={entity.id} />)}</div></section>
      <section><header><GitBranch size={17} aria-hidden="true" /><div><span>Active edges</span><h3>Relationships touching this node</h3></div></header><div>{focusSnapshot.relationships.map((relationship) => <RelationshipCard relationship={relationship} onOpen={openRelationship} onFocus={openFocus} onNavigate={onNavigate} key={relationship.id} />)}</div></section>
    </article>}

    {!selectedDetail && !focusEntity && <section className="succession-relationship-directory" aria-label="Canonical relationship records">
      {visible.map((relationship) => <RelationshipCard relationship={relationship} onOpen={openRelationship} onFocus={openFocus} onNavigate={onNavigate} key={relationship.id} />)}
      {!visible.length && <div className="succession-relationship-empty"><Network size={22} aria-hidden="true" /><h3>No relationships match these filters</h3><p>Clear one or more graph facets to restore the ledger.</p><button type="button" onClick={resetFilters}>Reset relationship filters</button></div>}
    </section>}

    {selectedRelationship && selectedDetail && <article className="succession-relationship-dossier" aria-labelledby="succession-relationship-dossier-title">
      <header><button type="button" className="succession-relationship-dossier__close" onClick={closeDetail}><ArrowLeft size={14} aria-hidden="true" /> Relationship graph</button><div><span>{titleCase(selectedRelationship.relationshipType)} · Ch. {rangeLabel(selectedRelationship.chapterRange)}</span><h2 id="succession-relationship-dossier-title">{selectedRelationship.name}</h2><p>{selectedRelationship.summary}</p></div><dl><div><dt>Status</dt><dd>{titleCase(selectedRelationship.status)}</dd></div><div><dt>Sentiment</dt><dd>{titleCase(selectedRelationship.sentiment)}</dd></div><div><dt>Direction</dt><dd>{titleCase(selectedRelationship.direction)}</dd></div><div><dt>Certainty</dt><dd>{titleCase(selectedRelationship.certainty)}</dd></div></dl></header>

      <section className="succession-relationship-edge"><header><GitBranch size={17} aria-hidden="true" /><div><span>Canonical edge</span><h3>Source, direction, and target</h3></div></header><div><LinkedEntity entity={selectedDetail.source} label="Source node" onNavigate={onNavigate} onFocus={openFocus} /><span><b>{selectedRelationship.direction === 'bidirectional' ? '↔' : '→'}</b><small>{titleCase(selectedRelationship.subtype)}</small></span><LinkedEntity entity={selectedDetail.target} label="Target node" onNavigate={onNavigate} onFocus={openFocus} /></div></section>

      <section className="succession-relationship-state-grid">
        <article><Shield size={17} aria-hidden="true" /><span>Evidence basis</span><p>{selectedRelationship.basis}</p></article>
        <article><Activity size={17} aria-hidden="true" /><span>Operational state</span><p>{selectedRelationship.operationalState}</p></article>
        <article><Eye size={17} aria-hidden="true" /><span>Interpretive limits</span>{selectedRelationship.evidenceNotes?.length ? <ul>{selectedRelationship.evidenceNotes.map((note) => <li key={note}>{note}</li>)}</ul> : <p>No additional interpretive limitation is published.</p>}</article>
        <article><Clock3 size={17} aria-hidden="true" /><span>Graph metadata</span><dl><div><dt>Strength</dt><dd>{titleCase(selectedRelationship.strength)}</dd></div><div><dt>Canon layer</dt><dd>{titleCase(selectedRelationship.canonLevel)}</dd></div><div><dt>Range</dt><dd>Ch. {rangeLabel(selectedRelationship.chapterRange)}</dd></div></dl></article>
      </section>

      {!!selectedDetail.events.length && <section className="succession-relationship-events"><header><Activity size={17} aria-hidden="true" /><div><span>Operational evidence</span><h3>Events that establish or transform this relationship</h3></div></header><div>{selectedDetail.events.map((event) => <button type="button" onClick={() => onNavigate('events', { entity: event.id })} key={event.id}><span>Ch. {rangeLabel(event.chapterRange)}</span><b>{event.name}</b><p>{event.summary}</p><ArrowRight size={13} aria-hidden="true" /></button>)}</div></section>}

      {!!selectedSources.length && <section className="succession-relationship-sources"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence</span><h3>Relationship sources</h3></div></header><div>{selectedSources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}
    </article>}
  </div>;
}
