import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Crosshair,
  DoorOpen,
  MapPinned,
  MoveRight,
  Route,
  ShieldCheck,
  ShipWheel,
  UsersRound,
} from 'lucide-react';
import { getEntityById } from '../data/succession/successionData';
import { getSpatialEvidenceIntelligence } from '../data/succession/contentDepthFinishingSelectors';
import './TimelineSpatialIntelligence.css';

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
  const systems = Object.values(infrastructure.systems || {})
    .sort((left, right) => (right.activeEvents || 0) - (left.activeEvents || 0)
      || (right.activeAssignments || 0) - (left.activeAssignments || 0)
      || String(left.label).localeCompare(String(right.label)));
  const [selectedLocationId, setSelectedLocationId] = useState(() => hotspots[0]?.location?.id || infrastructure.records?.[0]?.location?.id || '');
  const [movementLimit, setMovementLimit] = useState(8);

  const selected = hotspots.find((row) => row.location.id === selectedLocationId)
    || infrastructure.records?.find((row) => row.location.id === selectedLocationId)
    || hotspots[0]
    || infrastructure.records?.[0]
    || null;

  const navigateIntel = (intel) => {
    const { event: _event, view: _view, intel: _intel, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel, chapter });
  };

  const focusOccupant = (id) => {
    const { event: _event, character: _character, view: _view, intel: _intel, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'people', character: id, chapter });
  };

  const focusTimelineLocation = (name) => {
    const { event: _event, location: _location, view: _view, intel: _intel, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel: 'space', location: name, chapter });
  };

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
        <h2 id="tsi-title">The Black Whale is now part of the intelligence picture.</h2>
        <p>Occupancy, movement, infrastructure, access, assignments, events, and evidence are synchronized to the same chapter clock as the timeline. This view uses maintained spatial records only.</p>
      </div>
      <div className="tsi-hero__clock">
        <Crosshair size={17} aria-hidden="true" />
        <span>STATE DELTA</span>
        <strong>{previousChapter} → {chapter}</strong>
        <small>{comparison.summary?.changedLocations || 0} changed locations · {comparison.summary?.movements || 0} movements</small>
      </div>
    </header>

    <section className="tsi-metrics" aria-label="Black Whale spatial summary">
      <Metric label="Maintained locations" value={spatial.summary.locations} note="Black Whale graph" />
      <Metric label="Infrastructure systems" value={spatial.summary.systems} note="Functional layers" />
      <Metric label="Changed locations" value={spatial.summary.changedLocations} note={`Ch. ${previousChapter} → ${chapter}`} />
      <Metric label="Character movements" value={spatial.summary.movements} note="Published deltas" />
      <Metric label="Evidence-backed hotspots" value={spatial.summary.evidenceBackedHotspots} note="No unsupported claims" />
    </section>

    <div className="tsi-command-grid">
      <section className="tsi-hotspots" aria-labelledby="tsi-hotspots-title">
        <header><span><MapPinned size={13} aria-hidden="true" /> OPERATIONAL HOTSPOTS</span><strong id="tsi-hotspots-title">Where the maintained record is busiest</strong><small>Load = occupants + active events + assignments.</small></header>
        <div>{hotspots.slice(0, 16).map((row, index) => <button
          type="button"
          className={selected?.location?.id === row.location.id ? 'is-active' : ''}
          onClick={() => setSelectedLocationId(row.location.id)}
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
            <header><span>WHO IS HERE</span><small>Select a person to move the timeline into their chapter-bounded dossier.</small></header>
            <div>{selected.state.occupants.slice(0, 18).map((id) => <button type="button" onClick={() => focusOccupant(id)} key={id}>{entityName(id)}<ArrowRight size={11} aria-hidden="true" /></button>)}</div>
            {!selected.state.occupants.length && <p>No maintained occupant record is published for this location at Chapter {chapter}.</p>}
          </section>
          <footer>
            <button type="button" onClick={() => focusTimelineLocation(selected.location.name)}><Route size={13} aria-hidden="true" /> Filter chronology here</button>
            <button type="button" onClick={() => onOpenLocation?.(selected.location.name)}><ShipWheel size={13} aria-hidden="true" /> Open full ship atlas</button>
          </footer>
        </> : <div className="tsi-location__empty"><MapPinned size={24} aria-hidden="true" /><strong>No maintained Black Whale location is available at this boundary.</strong></div>}
      </section>

      <section className="tsi-movement" aria-labelledby="tsi-movement-title">
        <header><span><MoveRight size={13} aria-hidden="true" /> MOVEMENT DELTA</span><strong id="tsi-movement-title">Who changed position?</strong><small>Only maintained movement between Chapter {previousChapter} and {chapter}.</small></header>
        <ol>{movements.slice(0, movementLimit).map((movement, index) => <li key={`${movement.character?.id || index}:${movement.from?.id || 'unknown'}:${movement.to?.id || 'unknown'}`}>
          <button type="button" onClick={() => movement.character?.id && focusOccupant(movement.character.id)}>{movement.character?.name || entityName(movement.character?.id)}</button>
          <span>{movement.from?.name || 'Unknown'} <MoveRight size={11} aria-hidden="true" /> {movement.to?.name || 'Unknown'}</span>
          {movement.to?.id && <button type="button" aria-label={`Inspect ${movement.to.name || 'destination'}`} onClick={() => setSelectedLocationId(movement.to.id)}><Crosshair size={12} aria-hidden="true" /></button>}
        </li>)}</ol>
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
