import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Crosshair,
  DoorOpen,
  GitBranch,
  MapPinned,
  MoveRight,
  Route,
  ShieldCheck,
  ShipWheel,
  UserRoundSearch,
  UsersRound,
  X,
} from 'lucide-react';
import { successionDays, successionPreludeEvents } from '../data/successionTimeline';
import { getEntityById } from '../data/succession/successionData';
import { getSpatialEvidenceIntelligence } from '../data/succession/contentDepthFinishingSelectors';
import './TimelineSpatialIntelligence.css';
import './TimelineSpatialSync.css';

const intelligenceViews = Object.freeze([
  ['space', 'Space'],
  ['knowledge', 'Knowledge'],
  ['operations', 'Operations'],
  ['deadlines', 'Deadlines'],
  ['nen', 'Nen'],
  ['mysteries', 'Mysteries'],
  ['decisions', 'Decisions'],
  ['causality', 'Causality'],
  ['evidence', 'Evidence'],
]);

const labelize = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());
const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const entityName = (id) => getEntityById(id)?.name || labelize(String(id || '').split(':').at(-1));

function Metric({ label, value, note }) {
  return <div><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

export default function TimelineSpatialIntelligence({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const requestedChapter = Number(requestedState.chapter);
  const spatial = useMemo(
    () => getSpatialEvidenceIntelligence(Number.isFinite(requestedChapter) ? requestedChapter : spoilerLimit),
    [requestedChapter, spoilerLimit],
  );
  const chapter = spatial.chapter;
  const previousChapter = spatial.previousChapter;
  const infrastructure = spatial.infrastructure || {};
  const comparison = spatial.comparison || {};
  const hotspots = spatial.hotspots || [];
  const movements = comparison.movements || [];
  const infrastructureRecords = infrastructure.records || [];
  const systems = Object.values(infrastructure.systems || {})
    .sort((left, right) => (right.activeEvents || 0) - (left.activeEvents || 0)
      || (right.activeAssignments || 0) - (left.activeAssignments || 0)
      || String(left.label).localeCompare(String(right.label)));

  const eventLocation = useMemo(() => {
    if (!requestedState.event) return '';
    const allEvents = [
      ...successionPreludeEvents,
      ...successionDays.flatMap((day) => day.events || []),
    ];
    return allEvents.find((event) => event.id === requestedState.event)?.location || '';
  }, [requestedState.event]);

  const locationToken = requestedState.spaceLocation || eventLocation || '';
  const resolveLocation = (token) => {
    if (!token) return null;
    return hotspots.find((row) => row.location.id === token || normalize(row.location.name) === normalize(token))
      || infrastructureRecords.find((row) => row.location.id === token || normalize(row.location.name) === normalize(token))
      || null;
  };
  const requestedLocation = resolveLocation(locationToken);
  const initialLocationId = requestedLocation?.location.id || hotspots[0]?.location?.id || infrastructureRecords[0]?.location?.id || '';
  const [selectedLocationId, setSelectedLocationId] = useState(initialLocationId);
  const [movementLimit, setMovementLimit] = useState(8);

  useEffect(() => {
    const resolved = resolveLocation(locationToken);
    if (resolved?.location.id && resolved.location.id !== selectedLocationId) setSelectedLocationId(resolved.location.id);
  }, [locationToken, selectedLocationId]);

  const selected = hotspots.find((row) => row.location.id === selectedLocationId)
    || infrastructureRecords.find((row) => row.location.id === selectedLocationId)
    || hotspots[0]
    || infrastructureRecords[0]
    || null;

  const activeCharacterId = requestedState.character || '';
  const activeCharacter = activeCharacterId ? getEntityById(activeCharacterId) : null;
  const focusedFromId = requestedState.spaceFrom || '';
  const focusedToId = requestedState.spaceTo || '';
  const orderedMovements = [...movements].sort((left, right) => {
    const leftFocused = left.character?.id === activeCharacterId ? 1 : 0;
    const rightFocused = right.character?.id === activeCharacterId ? 1 : 0;
    return rightFocused - leftFocused;
  });

  const navigateIntel = (intel) => {
    const { event: _event, view: _view, intel: _intel, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel, chapter });
  };

  const selectLocation = (rowOrId) => {
    const id = typeof rowOrId === 'string' ? rowOrId : rowOrId?.location?.id;
    const row = hotspots.find((item) => item.location.id === id)
      || infrastructureRecords.find((item) => item.location.id === id);
    if (!row) return;
    setSelectedLocationId(row.location.id);
    const { event: _event, view: _view, intel: _intel, spaceLocation: _spaceLocation, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'intelligence',
      intel: 'space',
      chapter,
      spaceLocation: row.location.id,
    });
  };

  const focusOccupant = (id) => {
    const { event: _event, character: _character, view: _view, intel: _intel, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'intelligence',
      intel: 'space',
      character: id,
      chapter,
      ...(selected?.location?.id ? { spaceLocation: selected.location.id } : {}),
    });
  };

  const selectMovement = (movement) => {
    const { event: _event, view: _view, intel: _intel, character: _character, spaceFrom: _from, spaceTo: _to, ...preserved } = requestedState;
    const destinationId = movement.to?.id || selected?.location?.id;
    if (destinationId) setSelectedLocationId(destinationId);
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'intelligence',
      intel: 'space',
      chapter,
      ...(movement.character?.id ? { character: movement.character.id } : {}),
      ...(destinationId ? { spaceLocation: destinationId } : {}),
      ...(movement.from?.id ? { spaceFrom: movement.from.id } : {}),
      ...(movement.to?.id ? { spaceTo: movement.to.id } : {}),
    });
  };

  const clearPersonFocus = () => {
    const { character: _character, spaceFrom: _from, spaceTo: _to, event: _event, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel: 'space', chapter });
  };

  const focusTimelineLocation = () => {
    if (!selected?.location?.name) return;
    const { event: _event, view: _view, intel: _intel, location: _location, from: _from, to: _to, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'overview',
      chapter,
      from: 340,
      to: spoilerLimit,
      location: selected.location.name,
      spaceLocation: selected.location.id,
    });
  };

  const focusCharacterTimeline = () => {
    if (!activeCharacterId) return;
    const { event: _event, view: _view, intel: _intel, from: _from, to: _to, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'people',
      character: activeCharacterId,
      chapter,
      from: 340,
      to: spoilerLimit,
      ...(selected?.location?.id ? { spaceLocation: selected.location.id } : {}),
    });
  };

  const focusedMovement = activeCharacterId
    ? movements.find((movement) => movement.character?.id === activeCharacterId
      && (!focusedFromId || movement.from?.id === focusedFromId)
      && (!focusedToId || movement.to?.id === focusedToId))
      || movements.find((movement) => movement.character?.id === activeCharacterId)
    : null;

  return <section className="timeline-spatial-intelligence" aria-labelledby="tsi-title">
    <nav className="tsi-intel-nav" aria-label="Timeline intelligence lenses">
      {intelligenceViews.map(([id, label]) => <button
        type="button"
        className={id === 'space' ? 'is-active' : ''}
        aria-pressed={id === 'space'}
        onClick={() => navigateIntel(id)}
        key={id}
      >{label}</button>)}
    </nav>

    <header className="tsi-hero">
      <div>
        <span><ShipWheel size={14} aria-hidden="true" /> SPATIAL INTELLIGENCE · CHAPTER {chapter}</span>
        <h2 id="tsi-title">Timeline and ship state are one system now.</h2>
        <p>Location, character and movement focus are preserved as shared timeline state. Select here, move back to chronology, scrub the chapter, and the spatial context travels with you.</p>
      </div>
      <div className="tsi-hero__clock">
        <Crosshair size={17} aria-hidden="true" />
        <span>STATE DELTA</span>
        <strong>{previousChapter} → {chapter}</strong>
        <small>{comparison.summary?.changedLocations || 0} changed locations · {comparison.summary?.movements || 0} movements</small>
      </div>
    </header>

    {(selected || activeCharacter || requestedState.event) && <section className="tsi-sync-focus" aria-label="Synchronized timeline and spatial focus">
      <div><GitBranch size={14} aria-hidden="true" /><span>SYNCED FOCUS</span></div>
      {selected && <button type="button" onClick={focusTimelineLocation}><MapPinned size={12} aria-hidden="true" /><span>{selected.location.name}</span><small>open chronology</small></button>}
      {activeCharacter && <button type="button" onClick={focusCharacterTimeline}><UserRoundSearch size={12} aria-hidden="true" /><span>{activeCharacter.name}</span><small>open person timeline</small></button>}
      {requestedState.event && <span className="tsi-sync-focus__source">EVENT → SPACE{eventLocation ? ` · ${eventLocation}` : ''}</span>}
      {focusedMovement && <span className="tsi-sync-focus__movement">{focusedMovement.from?.name || 'Unknown'} <MoveRight size={11} aria-hidden="true" /> {focusedMovement.to?.name || 'Unknown'}</span>}
      {activeCharacter && <button type="button" className="tsi-sync-focus__clear" onClick={clearPersonFocus}><X size={12} aria-hidden="true" /> Clear person</button>}
    </section>}

    <section className="tsi-metrics" aria-label="Black Whale spatial summary">
      <Metric label="Maintained locations" value={spatial.summary.locations} note="Black Whale graph" />
      <Metric label="Infrastructure systems" value={spatial.summary.systems} note="Functional layers" />
      <Metric label="Changed locations" value={spatial.summary.changedLocations} note={`Ch. ${previousChapter} → ${chapter}`} />
      <Metric label="Character movements" value={spatial.summary.movements} note="Published deltas" />
      <Metric label="Evidence-backed hotspots" value={spatial.summary.evidenceBackedHotspots} note="No unsupported claims" />
    </section>

    <div className="tsi-command-grid">
      <section className="tsi-hotspots" aria-labelledby="tsi-hotspots-title">
        <header><span><MapPinned size={13} aria-hidden="true" /> OPERATIONAL HOTSPOTS</span><strong id="tsi-hotspots-title">Where the maintained record is busiest</strong><small>Selecting a location now persists into the timeline state.</small></header>
        <div>{hotspots.slice(0, 16).map((row, index) => <button
          type="button"
          className={selected?.location?.id === row.location.id ? 'is-active' : ''}
          onClick={() => selectLocation(row)}
          key={row.location.id}
        >
          <i>{String(index + 1).padStart(2, '0')}</i>
          <span><strong>{row.location.name}</strong><small>{labelize(row.system)} · {row.provenanceCoverage}% evidence coverage</small></span>
          <b>{row.operationalLoad}</b>
        </button>)}</div>
      </section>

      <section className="tsi-location" aria-labelledby="tsi-location-title">
        {selected ? <>
          <header>
            <div><span>SELECTED LOCATION · CH. {chapter}</span><h3 id="tsi-location-title">{selected.location.name}</h3><p>{labelize(selected.system)}</p></div>
            <strong>{selected.operationalLoad}<small>operational load</small></strong>
          </header>
          <div className="tsi-location__state">
            <article><DoorOpen size={16} aria-hidden="true" /><span>Access</span><strong>{labelize(selected.state.accessLevel)}</strong><small>{labelize(selected.state.zoneRole)}</small></article>
            <article><UsersRound size={16} aria-hidden="true" /><span>Occupants</span><strong>{selected.state.occupants.length}</strong><small>chapter-bounded</small></article>
            <article><Crosshair size={16} aria-hidden="true" /><span>Active events</span><strong>{selected.state.events.length}</strong><small>at this boundary</small></article>
            <article><ShieldCheck size={16} aria-hidden="true" /><span>Assignments</span><strong>{selected.state.assignments.length}</strong><small>{selected.protocolIds?.length || 0} protocols</small></article>
          </div>
          <section className="tsi-occupants">
            <header><span>WHO IS HERE</span><small>Select a person to follow them spatially without leaving Space.</small></header>
            <div>{selected.state.occupants.slice(0, 18).map((id) => <button type="button" className={activeCharacterId === id ? 'is-active' : ''} onClick={() => focusOccupant(id)} key={id}>{entityName(id)}<ArrowRight size={11} aria-hidden="true" /></button>)}</div>
            {!selected.state.occupants.length && <p>No maintained occupant record is published for this location at Chapter {chapter}.</p>}
          </section>
          <footer>
            <button type="button" onClick={focusTimelineLocation}><Route size={13} aria-hidden="true" /> Filter chronology here</button>
            <button type="button" onClick={() => onOpenLocation?.(selected.location.name)}><ShipWheel size={13} aria-hidden="true" /> Open full ship atlas</button>
          </footer>
        </> : <div className="tsi-location__empty"><MapPinned size={24} aria-hidden="true" /><strong>No maintained Black Whale location is available at this boundary.</strong></div>}
      </section>

      <section className="tsi-movement" aria-labelledby="tsi-movement-title">
        <header><span><MoveRight size={13} aria-hidden="true" /> MOVEMENT DELTA</span><strong id="tsi-movement-title">Who changed position?</strong><small>Choose a movement to synchronize person + origin + destination.</small></header>
        <ol>{orderedMovements.slice(0, movementLimit).map((movement, index) => {
          const focused = movement.character?.id === activeCharacterId
            && (!focusedFromId || movement.from?.id === focusedFromId)
            && (!focusedToId || movement.to?.id === focusedToId);
          return <li className={focused ? 'is-focused' : ''} key={`${movement.character?.id || index}:${movement.from?.id || 'unknown'}:${movement.to?.id || 'unknown'}`}>
            <button type="button" onClick={() => selectMovement(movement)}>{movement.character?.name || entityName(movement.character?.id)}</button>
            <span>{movement.from?.name || 'Unknown'} <MoveRight size={11} aria-hidden="true" /> {movement.to?.name || 'Unknown'}</span>
            {movement.to?.id && <button type="button" aria-label={`Inspect ${movement.to.name || 'destination'}`} onClick={() => selectLocation(movement.to.id)}><Crosshair size={12} aria-hidden="true" /></button>}
          </li>;
        })}</ol>
        {!movements.length && <p>No maintained character movement delta is published between these chapter boundaries.</p>}
        {movementLimit < movements.length && <button type="button" className="tsi-more" onClick={() => setMovementLimit((current) => Math.min(movements.length, current + 12))}>Show more movements</button>}
      </section>
    </div>

    <section className="tsi-infrastructure" aria-labelledby="tsi-infrastructure-title">
      <header><div><span><Building2 size={13} aria-hidden="true" /> SHIP SYSTEMS</span><h3 id="tsi-infrastructure-title">The vessel as operational infrastructure</h3></div><p>These are functional groupings of maintained locations, not territorial-control claims.</p></header>
      <div>{systems.map((system) => <article key={system.id}>
        <span>{system.label}</span>
        <strong>{system.locationCount}<small>locations</small></strong>
        <dl><div><dt>Occupants</dt><dd>{system.occupants || 0}</dd></div><div><dt>Events</dt><dd>{system.activeEvents || 0}</dd></div><div><dt>Assignments</dt><dd>{system.activeAssignments || 0}</dd></div></dl>
      </article>)}</div>
    </section>

    {!!comparison.locationChanges?.length && <details className="tsi-changes">
      <summary><span>LOCATION STATE CHANGES</span><strong>{comparison.locationChanges.length} maintained changes</strong><small>Inspect the chapter delta</small></summary>
      <div>{comparison.locationChanges.map((change, index) => <article key={change.locationId || change.entity?.id || index}><span>{labelize(change.status || change.changeType || 'changed')}</span><strong>{change.entity?.name || entityName(change.locationId)}</strong></article>)}</div>
    </details>}
  </section>;
}
