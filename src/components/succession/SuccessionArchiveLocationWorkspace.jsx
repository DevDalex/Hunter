import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Clock3,
  Filter,
  GitBranch,
  Map,
  MapPin,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  getEntitiesByType,
  getEntityById,
  getLocationSnapshot,
  getSourcesForEntity,
} from '../../data/succession/successionData';
import {
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveLocationWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const titleCase = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (values) => [...new Set(values.filter(Boolean))];
const locations = getEntitiesByType('location');

const rangeLabel = (range) => {
  if (!range?.start) return 'Unassigned';
  if (range.end === null || range.end === undefined) return `${range.start}–current`;
  return range.start === range.end ? String(range.start) : `${range.start}–${range.end}`;
};

const locationOrder = (left, right) => (left.deck ?? 99) - (right.deck ?? 99)
  || (left.ancestorIds?.length || 0) - (right.ancestorIds?.length || 0)
  || left.name.localeCompare(right.name);

const resolveMany = (ids) => (ids || []).map(getEntityById).filter(Boolean);

function LinkedEntity({ entity, onNavigate, meta }) {
  if (!entity) return null;
  return <button type="button" className={`succession-location-linked-entity is-${entity.entityType}`} onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><small>{meta || entity.entityType.replaceAll('-', ' ')}</small><b>{entity.name}</b></span>
    <ArrowRight size={13} aria-hidden="true" />
  </button>;
}

function LocationCard({ location, selected, onOpen }) {
  const snapshot = getLocationSnapshot(location.id);
  const path = snapshot?.breadcrumbs.map((item) => item.name).join(' › ') || location.name;
  return <button type="button" className={`succession-location-card${selected ? ' is-selected' : ''}`} onClick={() => onOpen(location)}>
    <span className="succession-location-card__icon"><MapPin size={17} aria-hidden="true" /></span>
    <div><small>{titleCase(location.locationType)} · {location.deck ? `Tier ${location.deck}` : 'Shipwide'}</small><h3>{location.name}</h3><p>{location.summary}</p><em>{path}</em></div>
    <dl><div><dt>Access</dt><dd>{titleCase(location.accessLevel)}</dd></div><div><dt>Occupancy records</dt><dd>{snapshot?.history.length || 0}</dd></div><div><dt>Events</dt><dd>{snapshot?.events.length || 0}</dd></div></dl>
  </button>;
}

export default function SuccessionArchiveLocationWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
  const [type, setType] = useState(routeParams.type || 'all');
  const [deck, setDeck] = useState(routeParams.deck || 'all');
  const [access, setAccess] = useState(routeParams.access || 'all');
  const [focus, setFocus] = useState(routeParams.entity || routeParams.focus || '');
  const [snapshotChapter, setSnapshotChapter] = useState(Number(routeParams.chapter) || spoilerLimit);

  useEffect(() => {
    setFocus(routeParams.entity || routeParams.focus || '');
  }, [routeParams.entity, routeParams.focus]);

  useEffect(() => {
    setSnapshotChapter((current) => Math.min(Number(current) || spoilerLimit, spoilerLimit));
  }, [spoilerLimit]);

  const sortedLocations = useMemo(() => [...locations].sort(locationOrder), []);
  const types = useMemo(() => unique(sortedLocations.map((location) => location.locationType)).sort(), [sortedLocations]);
  const decks = useMemo(() => unique(sortedLocations.map((location) => location.deck)).sort((left, right) => left - right), [sortedLocations]);
  const accessLevels = useMemo(() => unique(sortedLocations.map((location) => location.accessLevel)).sort(), [sortedLocations]);

  const visible = useMemo(() => sortedLocations.filter((location) => {
    const searchable = normalize(`${location.name} ${location.summary} ${(location.aliases || []).join(' ')} ${location.locationType} ${location.accessLevel} ${location.zoneRole || ''}`);
    return (type === 'all' || location.locationType === type)
      && (deck === 'all' || String(location.deck || 'shipwide') === deck)
      && (access === 'all' || location.accessLevel === access)
      && (!query.trim() || searchable.includes(normalize(query)));
  }), [access, deck, query, sortedLocations, type]);

  const selected = focus ? getEntityById(focus) : null;
  const selectedLocation = selected?.entityType === 'location' ? selected : sortedLocations.find((location) => location.slug === focus) || null;
  const snapshot = selectedLocation ? getLocationSnapshot(selectedLocation.id, snapshotChapter) : null;
  const sources = selectedLocation ? getSourcesForEntity(selectedLocation.id) : [];

  const openLocation = (location) => {
    setFocus(location.id);
    onNavigate('locations', { entity: location.id, chapter: snapshotChapter });
  };

  const closeLocation = () => {
    setFocus('');
    onNavigate('locations');
  };

  const resetFilters = () => {
    setQuery('');
    setType('all');
    setDeck('all');
    setAccess('all');
  };

  const activeFilterCount = [query, type !== 'all', deck !== 'all', access !== 'all'].filter(Boolean).length;
  const royalRooms = locations.filter((location) => /^Room 10\d\d$/.test(location.name)).length;
  const historyCount = getEntitiesByType('location-history').length;

  return <div className="succession-canonical-locations">
    <section className="succession-canonical-locations__hero">
      <div><span>Canonical spatial graph</span><h2>Hierarchy, access, occupancy, movement, events, and Nen routes</h2><p>The Black Whale is modeled as a changing operational environment. Royal rooms, public tiers, Justice facilities, criminal spaces, checkpoints, and Nen-mediated zones preserve both their hierarchy and their chapter-bounded history.</p></div>
      <dl><div><dt>Locations</dt><dd>{locations.length}</dd></div><div><dt>Royal rooms</dt><dd>{royalRooms}</dd></div><div><dt>Movement records</dt><dd>{historyCount}</dd></div><div><dt>Spoiler boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
    </section>

    <section className="succession-location-filter-panel" aria-labelledby="succession-location-filter-title">
      <header><Filter size={17} aria-hidden="true" /><div><span>Spatial filters</span><h3 id="succession-location-filter-title">Filter the ship hierarchy</h3></div><b>{activeFilterCount} active</b></header>
      <label className="succession-location-filter-panel__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search canonical locations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Room, tier, access, route, incident…" /></label>
      <div className="succession-location-filter-panel__fields">
        <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All location types</option>{types.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Tier</span><select value={deck} onChange={(event) => setDeck(event.target.value)}><option value="all">All tiers</option><option value="shipwide">Shipwide</option>{decks.map((value) => <option value={String(value)} key={value}>Tier {value}</option>)}</select></label>
        <label><span>Access</span><select value={access} onChange={(event) => setAccess(event.target.value)}><option value="all">All access levels</option>{accessLevels.map((value) => <option value={value} key={value}>{titleCase(value)}</option>)}</select></label>
        <label><span>Snapshot chapter</span><input type="number" min="340" max={spoilerLimit} value={snapshotChapter} onChange={(event) => setSnapshotChapter(Math.min(spoilerLimit, Math.max(340, Number(event.target.value) || 340)))} /></label>
      </div>
      <footer><span role="status" aria-live="polite">Showing {visible.length} of {locations.length} canonical locations.</span><button type="button" disabled={!activeFilterCount} onClick={resetFilters}>Clear filters</button></footer>
    </section>

    {!selectedLocation && <section className="succession-location-directory" aria-label="Canonical Black Whale locations">
      {visible.map((location) => <LocationCard location={location} selected={false} onOpen={openLocation} key={location.id} />)}
      {!visible.length && <div className="succession-location-directory__empty"><Map size={22} aria-hidden="true" /><h3>No locations match these filters</h3><p>Clear one or more spatial facets to restore the hierarchy.</p><button type="button" onClick={resetFilters}>Reset location filters</button></div>}
    </section>}

    {selectedLocation && snapshot && <article className="succession-location-dossier" aria-labelledby="succession-location-dossier-title">
      <header>
        <button type="button" className="succession-location-dossier__close" onClick={closeLocation}><ArrowLeft size={14} aria-hidden="true" /> Location directory</button>
        <div><span>{titleCase(selectedLocation.locationType)} · {titleCase(selectedLocation.accessLevel)}</span><h2 id="succession-location-dossier-title">{selectedLocation.name}</h2><p>{selectedLocation.summary}</p></div>
        <dl><div><dt>Tier</dt><dd>{selectedLocation.deck || 'Shipwide'}</dd></div><div><dt>Zone role</dt><dd>{titleCase(selectedLocation.zoneRole)}</dd></div><div><dt>Canon layer</dt><dd>{titleCase(selectedLocation.canonLevel)}</dd></div><div><dt>Snapshot</dt><dd>Ch. {snapshot.chapter}</dd></div></dl>
      </header>

      <nav className="succession-location-breadcrumbs" aria-label="Location hierarchy"><Map size={15} aria-hidden="true" />{snapshot.breadcrumbs.map((location, index) => <span key={location.id}>{index > 0 && <i>›</i>}<button type="button" onClick={() => openLocation(location)}>{location.name}</button></span>)}</nav>

      <section className="succession-location-snapshot" aria-labelledby="succession-location-snapshot-title">
        <header><Clock3 size={17} aria-hidden="true" /><div><span>Chapter snapshot</span><h3 id="succession-location-snapshot-title">Operational state at Chapter {snapshot.chapter}</h3></div></header>
        <div className="succession-location-snapshot__stats"><div><Users size={15} /><span>Occupants</span><b>{snapshot.occupants.length}</b></div><div><Shield size={15} /><span>Assignments</span><b>{snapshot.assignments.length}</b></div><div><Activity size={15} /><span>Events</span><b>{snapshot.events.length}</b></div><div><Sparkles size={15} /><span>Abilities</span><b>{snapshot.abilities.length}</b></div></div>
      </section>

      {!!snapshot.children.length && <section className="succession-location-children"><header><Building2 size={17} aria-hidden="true" /><div><span>Hierarchy</span><h3>Contained locations</h3></div></header><div>{snapshot.children.map((location) => <button type="button" onClick={() => openLocation(location)} key={location.id}><MapPin size={15} /><span><small>{titleCase(location.locationType)}</small><b>{location.name}</b></span><ArrowRight size={13} /></button>)}</div></section>}

      <section className="succession-location-occupants" aria-labelledby="succession-location-occupants-title"><header><Users size={17} aria-hidden="true" /><div><span>Occupancy model</span><h3 id="succession-location-occupants-title">People present in the selected chapter snapshot</h3></div></header>{snapshot.occupants.length ? <div>{snapshot.occupants.map(({ entity, record }) => <LinkedEntity entity={entity} meta={`${titleCase(record.state)} · Ch. ${rangeLabel(record.chapterRange)}`} onNavigate={onNavigate} key={entity.id} />)}</div> : <p>No chapter-bounded occupant record is published for this location at Chapter {snapshot.chapter}.</p>}</section>

      <section className="succession-location-activity-grid">
        <section><header><Shield size={16} /><div><span>Assignments</span><h3>Protection, surveillance, and operations</h3></div></header>{snapshot.assignments.length ? <div>{snapshot.assignments.map((assignment) => { const person = getEntityById(assignment.personId); return <button type="button" onClick={() => onNavigate('bodyguards', { entity: assignment.id })} key={assignment.id}><EntityVisual entity={person} compact /><span><small>{titleCase(assignment.assignmentType)} · Ch. {rangeLabel(assignment.chapterRange)}</small><b>{assignment.name}</b></span><ArrowRight size={13} /></button>; })}</div> : <p>No active assignment record is linked to this chapter snapshot.</p>}</section>
        <section><header><Activity size={16} /><div><span>Events</span><h3>Incidents operating here</h3></div></header>{snapshot.events.length ? <div>{snapshot.events.map((event) => <LinkedEntity entity={event} meta={`Ch. ${rangeLabel(event.chapterRange)} · ${titleCase(event.status)}`} onNavigate={onNavigate} key={event.id} />)}</div> : <p>No canonical event spans this location at Chapter {snapshot.chapter}.</p>}</section>
        <section><header><Sparkles size={16} /><div><span>Nen systems</span><h3>Abilities active through linked events</h3></div></header>{snapshot.abilities.length ? <div>{snapshot.abilities.map((ability) => <LinkedEntity entity={ability} meta={titleCase(ability.category)} onNavigate={onNavigate} key={ability.id} />)}</div> : <p>No ability is currently derived from an event at this location.</p>}</section>
      </section>

      <section className="succession-location-history" aria-labelledby="succession-location-history-title"><header><GitBranch size={17} aria-hidden="true" /><div><span>Temporal occupancy</span><h3 id="succession-location-history-title">Movement and residence records</h3></div></header>{snapshot.history.length ? <div>{snapshot.history.map((record) => { const character = getEntityById(record.characterId); return <article key={record.id}><span>Ch. {rangeLabel(record.chapterRange)}</span><EntityVisual entity={character} compact /><div><h4>{character?.name || record.characterId}</h4><b>{titleCase(record.state)}</b><p>{record.summary}</p></div><button type="button" onClick={() => character && onNavigate(entityWorkspaceTarget(character), { entity: character.id })}>Open person</button></article>; })}</div> : <p>No historical occupancy records are published for this location.</p>}</section>

      {!!sources.length && <section className="succession-location-sources" aria-labelledby="succession-location-sources-title"><header><BookOpen size={17} aria-hidden="true" /><div><span>Evidence trail</span><h3 id="succession-location-sources-title">Location sources</h3></div></header><div>{sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}
    </article>}
  </div>;
}
