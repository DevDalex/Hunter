import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  GitBranch,
  Layers3,
  Map as MapIcon,
  Minus,
  MoveRight,
  Plus,
  Route,
  Search,
  ShipWheel,
  UserRound,
  Users,
} from 'lucide-react';
import {
  blackWhaleFacts, blackWhaleGallery, blackWhaleHotspots, blackWhaleImages, blackWhaleManifest,
  blackWhaleMovementRoutes, blackWhaleRooms, blackWhaleSource, blackWhaleTiers, blackWhaleVisualTour, royalRoomPlan,
} from '../data/blackWhale';
import {
  findBlackWhaleHotspotForCanonicalLocation,
  getBlackWhaleCanonicalBridge,
  getBlackWhaleRoyalRoomBridge,
} from '../data/succession/blackWhaleCanonicalMap';
import {
  getEntityById,
  getLocationSnapshot,
  getMovementHistoryForCharacter,
} from '../data/succession/successionData';
import SafeImage from './SafeImage';
import HorizontalScrollHint from './HorizontalScrollHint';
import './BlackWhaleIntelligenceCommand.css';

const normalize = (value) => String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const ROOM_BATCH = 12;
const MAP_MODES = [
  ['atlas', 'Atlas', MapIcon],
  ['occupancy', 'Occupancy', Users],
  ['movement', 'Movement', Route],
];
const includesChapter = (range, chapter) => chapter >= range.start && chapter <= (range.end ?? Number.POSITIVE_INFINITY);

export default function BlackWhaleGuide({
  initialQuery = '',
  initialLocationId = '',
  spoilerLimit = 414,
  onOpenWorldMap,
  onOpenCanonicalLocation,
}) {
  const [activeTier, setActiveTier] = useState('all');
  const [roomQuery, setRoomQuery] = useState('');
  const [selectedHotspotId, setSelectedHotspotId] = useState('tier-1');
  const [hoveredHotspotId, setHoveredHotspotId] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapMode, setMapMode] = useState('atlas');
  const [snapshotChapter, setSnapshotChapter] = useState(spoilerLimit);
  const [routeKind, setRouteKind] = useState('all');
  const [roomLimit, setRoomLimit] = useState(ROOM_BATCH);

  useEffect(() => setSnapshotChapter((current) => Math.min(Number(current) || spoilerLimit, spoilerLimit)), [spoilerLimit]);

  const hotspotIntel = useMemo(() => blackWhaleHotspots.map((hotspot) => {
    const bridge = getBlackWhaleCanonicalBridge({ hotspotId: hotspot.id, roomName: hotspot.roomName, tier: hotspot.tier });
    const location = getEntityById(bridge.locationId);
    const snapshot = location?.entityType === 'location' ? getLocationSnapshot(location.id, snapshotChapter) : null;
    return Object.freeze({ hotspot, bridge, location, snapshot });
  }), [snapshotChapter]);
  const intelByHotspot = useMemo(() => new Map(hotspotIntel.map((record) => [record.hotspot.id, record])), [hotspotIntel]);
  const hotspotByLocation = useMemo(() => {
    const map = new Map();
    hotspotIntel.forEach((record) => {
      if (!map.has(record.bridge.locationId) || record.bridge.precision === 'exact') map.set(record.bridge.locationId, record.hotspot);
    });
    return map;
  }, [hotspotIntel]);

  const resolveMappedHotspot = (locationId) => {
    if (!locationId) return null;
    const direct = hotspotByLocation.get(locationId);
    if (direct) return direct;
    const location = getEntityById(locationId);
    const ancestors = [...(location?.ancestorIds || [])].reverse();
    for (const ancestorId of ancestors) {
      const match = hotspotByLocation.get(ancestorId);
      if (match) return match;
    }
    const fallbackId = findBlackWhaleHotspotForCanonicalLocation(locationId);
    return fallbackId ? blackWhaleHotspots.find((hotspot) => hotspot.id === fallbackId) || null : null;
  };

  const movementSegments = useMemo(() => {
    const characterIds = new Set(hotspotIntel.flatMap((record) => record.snapshot?.occupants.map(({ entity }) => entity.id) || []));
    return [...characterIds].map((characterId) => {
      const records = getMovementHistoryForCharacter(characterId)
        .filter((record) => record.chapterRange.start <= snapshotChapter)
        .sort((left, right) => left.chapterRange.start - right.chapterRange.start);
      const current = records.at(-1);
      const previous = [...records].reverse().find((record) => record.locationId !== current?.locationId);
      const from = resolveMappedHotspot(previous?.locationId);
      const to = resolveMappedHotspot(current?.locationId);
      if (!from || !to || from.id === to.id) return null;
      return Object.freeze({
        character: getEntityById(characterId),
        from,
        to,
        current,
        previous,
        chapter: current.chapterRange.start,
      });
    }).filter(Boolean).sort((left, right) => right.chapter - left.chapter || left.character.name.localeCompare(right.character.name)).slice(0, 18);
  }, [hotspotIntel, hotspotByLocation, snapshotChapter]);

  const arrivalsByHotspot = useMemo(() => movementSegments.reduce((map, segment) => {
    map.set(segment.to.id, (map.get(segment.to.id) || 0) + 1);
    return map;
  }, new Map()), [movementSegments]);

  const selectedHotspot = blackWhaleHotspots.find((hotspot) => hotspot.id === selectedHotspotId) || blackWhaleHotspots[0];
  const selectedHotspotIndex = blackWhaleHotspots.findIndex((hotspot) => hotspot.id === selectedHotspot.id);
  const selectedTier = blackWhaleTiers.find((tier) => tier.id === selectedHotspot.tier);
  const selectedIntel = intelByHotspot.get(selectedHotspot.id);
  const selectedBridge = selectedIntel?.bridge || getBlackWhaleCanonicalBridge({ hotspotId: selectedHotspot.id, roomName: selectedHotspot.roomName, tier: selectedHotspot.tier });
  const selectedCanonicalLocation = selectedIntel?.location || getEntityById(selectedBridge.locationId);
  const selectedCanonicalSnapshot = selectedIntel?.snapshot || (selectedCanonicalLocation ? getLocationSnapshot(selectedCanonicalLocation.id, snapshotChapter) : null);
  const selectedMovements = movementSegments.filter((segment) => segment.from.id === selectedHotspot.id || segment.to.id === selectedHotspot.id);

  const mappedOccupants = useMemo(() => hotspotIntel.reduce((total, record) => total + (record.snapshot?.occupants.length || 0), 0), [hotspotIntel]);
  const mappedEvents = useMemo(() => hotspotIntel.reduce((total, record) => total + (record.snapshot?.events.length || 0), 0), [hotspotIntel]);
  const activeLocations = useMemo(() => hotspotIntel.filter((record) => (record.snapshot?.occupants.length || 0) || (record.snapshot?.events.length || 0)).length, [hotspotIntel]);

  const visibleRooms = useMemo(() => {
    const normalized = roomQuery.trim().toLowerCase();
    return blackWhaleRooms.filter((room) => (
      (activeTier === 'all' || room.tier === activeTier)
      && (!normalized || `${room.name} ${room.type} ${room.detail} ${room.occupants} ${room.control} ${room.access} ${room.connections || ''} ${room.status}`.toLowerCase().includes(normalized))
    ));
  }, [activeTier, roomQuery]);
  const displayedRooms = visibleRooms.slice(0, roomLimit);
  const roomsRemaining = Math.max(0, visibleRooms.length - displayedRooms.length);

  useEffect(() => setRoomLimit(ROOM_BATCH), [activeTier, roomQuery]);

  useEffect(() => {
    if (!initialLocationId) return;
    const hotspotId = findBlackWhaleHotspotForCanonicalLocation(initialLocationId);
    const hotspot = blackWhaleHotspots.find((record) => record.id === hotspotId);
    if (!hotspot) return;
    setSelectedHotspotId(hotspot.id);
    setActiveTier(hotspot.tier);
    setRoomQuery(hotspot.roomName || '');
  }, [initialLocationId]);

  useEffect(() => {
    if (!initialQuery) return;
    const incoming = normalize(initialQuery);
    const match = blackWhaleHotspots.find((hotspot) => {
      const terms = [hotspot.label, hotspot.subtitle, hotspot.roomName].filter(Boolean).map(normalize);
      return terms.some((term) => term && (incoming.includes(term) || term.includes(incoming)));
    });
    if (match) {
      setSelectedHotspotId(match.id);
      setActiveTier(match.tier);
      setRoomQuery(match.roomName || '');
    } else {
      setRoomQuery(initialQuery.replace(/^Tier \d+\s*[·/]\s*/i, ''));
    }
  }, [initialQuery]);

  const openCanonicalLocation = (record) => {
    if (!record?.locationId) return;
    const params = { entity: record.locationId, chapter: snapshotChapter };
    if (onOpenCanonicalLocation) onOpenCanonicalLocation(params);
    else onOpenWorldMap?.(params);
  };

  const chooseTier = (tier) => {
    setActiveTier(tier);
    setRoomQuery('');
    const tierHotspot = blackWhaleHotspots.find((hotspot) => hotspot.id === tier);
    if (tierHotspot) setSelectedHotspotId(tierHotspot.id);
  };
  const chooseHotspot = (hotspot) => {
    setSelectedHotspotId(hotspot.id);
    setHoveredHotspotId(null);
    setActiveTier(hotspot.tier);
    setRoomQuery(hotspot.roomName || '');
  };
  const stepHotspot = (amount) => {
    const nextIndex = (selectedHotspotIndex + amount + blackWhaleHotspots.length) % blackWhaleHotspots.length;
    chooseHotspot(blackWhaleHotspots[nextIndex]);
  };
  const openRoyalRoom = (roomNumber) => {
    setActiveTier('tier-1');
    setRoomQuery(roomNumber);
    setTimeout(() => document.getElementById('ship-room-index')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };
  const openTourRoom = (room) => {
    setActiveTier(room.tier);
    setRoomQuery(room.name);
    const hotspot = blackWhaleHotspots.find((item) => item.roomName === room.name);
    if (hotspot) setSelectedHotspotId(hotspot.id);
    setTimeout(() => document.getElementById('ship-room-index')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <section className={`black-whale-section black-whale-section--atlas black-whale-intelligence is-${mapMode}`} id="black-whale">
      <div className="section-heading black-whale-intelligence__hero">
        <div><span className="section-kicker">Black Whale 1 spatial intelligence</span><h2>See the ship change by chapter.</h2><p>The sourced cross-section now supports atlas, occupancy, and movement modes. Every signal resolves through the canonical location graph and preserves exact, aggregate, approximate, or legacy bridge precision.</p></div>
        <dl><div><dt>Snapshot</dt><dd>Ch. {snapshotChapter}</dd></div><div><dt>Active locations</dt><dd>{activeLocations}</dd></div><div><dt>Mapped occupants</dt><dd>{mappedOccupants}</dd></div><div><dt>Movement paths</dt><dd>{movementSegments.length}</dd></div></dl>
      </div>

      <div className="ship-source-banner">
        <ShipWheel size={20} />
        <div><strong>Visual atlas connected to the canonical graph</strong><p>Markers distinguish exact, aggregate, approximate, and legacy-ID bridges. Canonical dossiers remain the source of truth for occupants, assignments, events, abilities, and evidence.</p></div>
        <div className="ship-source-banner__actions">
          {onOpenWorldMap && <button type="button" onClick={() => onOpenWorldMap({ chapter: snapshotChapter })}><MapIcon size={13} /> Canonical spatial archive</button>}
          <a href={blackWhaleSource} target="_blank" rel="noreferrer">Hunterpedia ship record <ExternalLink size={12} /></a>
        </div>
      </div>

      <section className="ship-temporal-command" aria-labelledby="ship-temporal-command-title">
        <header><div><Clock3 size={17} aria-hidden="true" /><span><small>Temporal map control</small><h3 id="ship-temporal-command-title">Atlas state at Chapter {snapshotChapter}</h3></span></div><b>{mappedEvents} mapped events</b></header>
        <nav aria-label="Black Whale map mode">{MAP_MODES.map(([id, label, Icon]) => <button type="button" className={mapMode === id ? 'is-active' : ''} aria-pressed={mapMode === id} onClick={() => setMapMode(id)} key={id}><Icon size={14} aria-hidden="true" />{label}</button>)}</nav>
        <label><span>Chapter 340</span><input type="range" min="340" max={spoilerLimit} value={snapshotChapter} onChange={(event) => setSnapshotChapter(Number(event.target.value))} aria-label="Black Whale snapshot chapter" /><span>Chapter {spoilerLimit}</span></label>
        <footer><div><span>Selected chapter</span><strong>{snapshotChapter}</strong></div><div><span>Occupants</span><strong>{mappedOccupants}</strong></div><div><span>Events</span><strong>{mappedEvents}</strong></div><div><span>Transitions</span><strong>{movementSegments.length}</strong></div></footer>
      </section>

      <HorizontalScrollHint>Swipe the ship image and location rail sideways on smaller screens. Occupancy and movement modes also have complete text ledgers below the map.</HorizontalScrollHint>

      <div className="interactive-ship-atlas black-whale-intelligence__atlas">
        <figure className="interactive-ship-map" data-image-frame>
          <div className="interactive-ship-map__toolbar"><div><span>{mapMode === 'atlas' ? 'Canonical hotspot atlas' : mapMode === 'occupancy' ? `Occupancy at Chapter ${snapshotChapter}` : `Movement known by Chapter ${snapshotChapter}`}</span><small>{mapMode === 'movement' ? 'Lines connect the latest mapped location transition for each visible character.' : 'Select any marker for its canonical snapshot.'}</small></div><div><button type="button" onClick={() => setMapZoom((value) => Math.max(1, Number((value - .25).toFixed(2))))} disabled={mapZoom <= 1} aria-label="Zoom ship map out"><Minus size={14} /></button><b>{Math.round(mapZoom * 100)}%</b><button type="button" onClick={() => setMapZoom((value) => Math.min(1.75, Number((value + .25).toFixed(2))))} disabled={mapZoom >= 1.75} aria-label="Zoom ship map in"><Plus size={14} /></button><button type="button" onClick={() => setMapZoom(1)}>Reset</button></div></div>
          <div className="interactive-ship-map__viewport">
            <div className="interactive-ship-map__canvas" style={{ width: `${mapZoom * 100}%`, minWidth: `${620 * mapZoom}px` }}>
              <SafeImage src={blackWhaleImages.crossSection} alt="Manga cross-section of Black Whale 1 showing its five passenger tiers" eager />
              {mapMode === 'movement' && <svg className="ship-movement-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="ship-movement-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>{movementSegments.map((segment) => <line x1={segment.from.x} y1={segment.from.y} x2={segment.to.x} y2={segment.to.y} markerEnd="url(#ship-movement-arrow)" key={`${segment.character.id}-${segment.from.id}-${segment.to.id}`} />)}</svg>}
              <div className="ship-hotspot-layer" aria-label="Black Whale locations">
                {blackWhaleHotspots.map((hotspot) => {
                  const selected = hotspot.id === selectedHotspotId;
                  const hovered = hotspot.id === hoveredHotspotId;
                  const intel = intelByHotspot.get(hotspot.id);
                  const occupantCount = intel?.snapshot?.occupants.length || 0;
                  const eventCount = intel?.snapshot?.events.length || 0;
                  const arrivalCount = arrivalsByHotspot.get(hotspot.id) || 0;
                  const tooltipSide = hotspot.x >= 64 ? ' is-tooltip-left' : ' is-tooltip-right';
                  const tooltipEdge = hotspot.y <= 15 ? ' is-tooltip-high' : hotspot.y >= 82 ? ' is-tooltip-low' : '';
                  const tierMuted = activeTier !== 'all' && activeTier !== hotspot.tier;
                  return <button
                    className={`ship-hotspot ship-hotspot--${hotspot.tier}${selected ? ' is-selected' : ''}${occupantCount ? ' has-occupants' : ''}${eventCount ? ' has-events' : ''}${arrivalCount ? ' has-arrivals' : ''}${tierMuted ? ' is-tier-muted' : ''}${tooltipSide}${tooltipEdge}`}
                    style={{ '--hotspot-x': `${hotspot.x}%`, '--hotspot-y': `${hotspot.y}%` }}
                    onMouseEnter={() => setHoveredHotspotId(hotspot.id)} onMouseLeave={() => setHoveredHotspotId(null)}
                    onFocus={() => setHoveredHotspotId(hotspot.id)} onBlur={() => setHoveredHotspotId(null)}
                    onClick={() => chooseHotspot(hotspot)} aria-label={`${hotspot.label}: ${occupantCount} occupants, ${eventCount} events, ${arrivalCount} mapped arrivals at Chapter ${snapshotChapter}`} aria-pressed={selected}
                    key={hotspot.id}
                  >
                    <i />
                    {mapMode === 'occupancy' && occupantCount > 0 && <b className="ship-hotspot__count">{occupantCount}</b>}
                    {mapMode === 'movement' && arrivalCount > 0 && <b className="ship-hotspot__count">+{arrivalCount}</b>}
                    {hovered && <span className="ship-hotspot__tooltip"><strong>{hotspot.label}</strong><small>{hotspot.subtitle}</small><em>{titleCase(intel?.bridge.precision)} bridge · {occupantCount} occupants · {eventCount} events</em></span>}
                  </button>;
                })}
              </div>
            </div>
          </div>
          <figcaption><span>Hunterpedia / manga cross-section · canonical snapshot Chapter {snapshotChapter}</span><a href={blackWhaleGallery} target="_blank" rel="noreferrer">Open image source and gallery <ExternalLink size={11} /></a></figcaption>
        </figure>

        <aside className="ship-location-inspector" aria-live="polite">
          <div className="ship-location-inspector__pager"><button type="button" onClick={() => stepHotspot(-1)} aria-label="Previous ship location"><ChevronLeft size={15} /></button><span>{selectedHotspotIndex + 1} / {blackWhaleHotspots.length}</span><button type="button" onClick={() => stepHotspot(1)} aria-label="Next ship location"><ChevronRight size={15} /></button></div>
          <header><span>{selectedHotspot.confidence} · {titleCase(selectedBridge.precision)} bridge</span><h3>{selectedHotspot.label}</h3><p>{selectedHotspot.subtitle}</p></header>
          {selectedHotspot.room?.image && <figure data-image-frame><SafeImage src={selectedHotspot.room.image} alt={`${selectedHotspot.room.name} from Hunterpedia`} /></figure>}
          <div className="ship-location-inspector__evidence" aria-label="More images from this tier">{blackWhaleVisualTour.filter((room) => room.tier === selectedHotspot.tier && room.name !== selectedHotspot.room?.name).slice(0, 3).map((room) => <button type="button" onClick={() => openTourRoom(room)} title={room.name} key={room.name}><SafeImage src={room.image} alt="" /><span>{room.name}</span></button>)}</div>
          <p>{selectedHotspot.room?.detail || selectedHotspot.note || selectedTier?.description}</p>
          <dl className="ship-location-inspector__snapshot"><div><dt style={{ color: 'var(--succession-text-strong)' }}>Canonical record</dt><dd>{selectedCanonicalLocation?.name || selectedBridge.locationId}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Chapter</dt><dd>{snapshotChapter}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Occupants</dt><dd>{selectedCanonicalSnapshot?.occupants.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Assignments</dt><dd>{selectedCanonicalSnapshot?.assignments.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Events</dt><dd>{selectedCanonicalSnapshot?.events.length || 0}</dd></div><div><dt style={{ color: 'var(--succession-text-strong)' }}>Abilities</dt><dd>{selectedCanonicalSnapshot?.abilities.length || 0}</dd></div></dl>
          {!!selectedCanonicalSnapshot?.occupants.length && <section className="ship-location-inspector__occupants"><span>Present at Chapter {snapshotChapter}</span><div>{selectedCanonicalSnapshot.occupants.slice(0, 8).map(({ entity, record }) => <span key={entity.id}><UserRound size={11} aria-hidden="true" /><b>{entity.name}</b><small>{titleCase(record.state)}</small></span>)}</div></section>}
          {mapMode === 'movement' && <section className="ship-location-inspector__movements"><span>Mapped transitions</span>{selectedMovements.length ? <div>{selectedMovements.slice(0, 6).map((segment) => <p key={segment.character.id}><b>{segment.character.name}</b><small>{segment.from.label} <MoveRight size={11} aria-hidden="true" /> {segment.to.label} · Ch. {segment.chapter}</small></p>)}</div> : <p>No mapped transition touches this marker by Chapter {snapshotChapter}.</p>}</section>}
          {selectedBridge.note && <p><b>Bridge note:</b> {selectedBridge.note}</p>}
          <div className="ship-location-inspector__actions"><button type="button" onClick={() => openCanonicalLocation(selectedBridge)}><MapIcon size={12} /> Open Chapter {snapshotChapter} snapshot</button><button type="button" onClick={() => { setActiveTier(selectedHotspot.tier); setRoomQuery(''); document.getElementById('ship-room-index')?.scrollIntoView({ behavior: 'smooth' }); }}><Layers3 size={12} /> Browse this tier</button><a href={selectedHotspot.room?.source || selectedHotspot.source} target="_blank" rel="noreferrer">Location source <ExternalLink size={11} /></a></div>
        </aside>
      </div>

      <nav className="ship-hotspot-index" aria-label="Black Whale marked locations">
        {blackWhaleHotspots.map((hotspot, index) => { const intel = intelByHotspot.get(hotspot.id); return <button type="button" className={hotspot.id === selectedHotspot.id ? 'is-active' : ''} aria-current={hotspot.id === selectedHotspot.id ? 'true' : undefined} onClick={() => chooseHotspot(hotspot)} key={hotspot.id}><i>{String(index + 1).padStart(2, '0')}</i><span><b>{hotspot.label}</b><small>{intel?.snapshot?.occupants.length || 0} occupants · {intel?.snapshot?.events.length || 0} events</small></span></button>; })}
      </nav>

      <section className="ship-temporal-ledger" aria-labelledby="ship-temporal-ledger-title">
        <header><div><GitBranch size={17} aria-hidden="true" /><span><small>Semantic map alternative</small><h3 id="ship-temporal-ledger-title">{mapMode === 'movement' ? `Movement paths by Chapter ${snapshotChapter}` : `Location snapshots at Chapter ${snapshotChapter}`}</h3></span></div><p>The map is never the only representation of occupancy or movement.</p></header>
        {mapMode === 'movement' ? <ol>{movementSegments.map((segment) => <li key={`${segment.character.id}-${segment.chapter}`}><span><UserRound size={14} aria-hidden="true" /><b>{segment.character.name}</b></span><div><small>Chapter {segment.chapter}</small><strong>{segment.from.label} <MoveRight size={13} aria-hidden="true" /> {segment.to.label}</strong><p>{segment.current.summary}</p></div><button type="button" onClick={() => chooseHotspot(segment.to)}>Inspect arrival</button></li>)}</ol> : <ol>{hotspotIntel.filter((record) => record.snapshot).sort((left, right) => (right.snapshot.occupants.length + right.snapshot.events.length) - (left.snapshot.occupants.length + left.snapshot.events.length)).map((record) => <li key={record.hotspot.id}><span><MapIcon size={14} aria-hidden="true" /><b>{record.hotspot.label}</b></span><div><small>{titleCase(record.bridge.precision)} canonical bridge</small><strong>{record.location?.name || record.bridge.locationId}</strong><p>{record.snapshot.occupants.length} occupants · {record.snapshot.assignments.length} assignments · {record.snapshot.events.length} events · {record.snapshot.abilities.length} abilities</p></div><button type="button" onClick={() => chooseHotspot(record.hotspot)}>Inspect marker</button></li>)}</ol>}
      </section>

      <section className="ship-visual-tour" aria-labelledby="ship-visual-tour-title">
        <header><div><span className="section-kicker">Hunterpedia location gallery</span><h3 id="ship-visual-tour-title">See the ship before reading the directory</h3></div><p>{blackWhaleVisualTour.length} sourced room and facility images. Select any image to open its visual record, then continue into the canonical chapter snapshot.</p></header>
        <div>{blackWhaleVisualTour.map((room, index) => { const tier = blackWhaleTiers.find((item) => item.id === room.tier); return <button type="button" onClick={() => openTourRoom(room)} key={room.name}><figure><SafeImage src={room.image} media={room.media} alt={`${room.name} from Hunterpedia`} /><i>{String(index + 1).padStart(2, '0')}</i></figure><span><small>Tier {tier?.number} · {room.type}</small><strong>{room.name}</strong></span></button>; })}</div>
      </section>

      <nav className="ship-tier-key" aria-label="Select a Black Whale tier"><button className={activeTier === 'all' ? 'is-active' : ''} onClick={() => { setActiveTier('all'); setRoomQuery(''); }}>Whole ship</button>{blackWhaleTiers.map((tier) => <button className={activeTier === tier.id ? 'is-active' : ''} onClick={() => chooseTier(tier.id)} key={tier.id}><b>{tier.number}</b><span>{tier.name}</span></button>)}</nav>
      <div className="ship-fact-ribbon">{blackWhaleFacts.map(([term, value]) => <div key={term}><span>{term}</span><strong>{value}</strong></div>)}</div>

      <section className="royal-room-plan royal-room-plan--editorial"><header><div><span>Tier 1 residence plan</span><h3>Fourteen prince rooms</h3></div><p>Two rows of seven, with higher-ranked rooms nearer the banquet hall. Each room button has a stable canonical location ID and opens the selected chapter.</p></header><div className="royal-room-plan__banquet"><span>North / ceremony route</span><strong>Banquet hall</strong></div><div className="royal-room-plan__rows"><div className="royal-room-plan__side"><span>Even-numbered side</span>{royalRoomPlan.filter((room) => room.side === 'even').map((room) => <button onClick={() => openRoyalRoom(room.roomNumber)} onDoubleClick={() => openCanonicalLocation(getBlackWhaleRoyalRoomBridge(room.roomNumber))} title="Click to filter; double-click to open the canonical room snapshot" key={room.roomNumber}><i>{room.roomNumber}</i><strong>{room.prince}</strong><small>{room.state}</small></button>)}</div><div className="royal-room-plan__corridor" aria-hidden="true"><span>Guarded central ring</span><i /><i /><i /><i /><i /><i /><i /></div><div className="royal-room-plan__side"><span>Odd-numbered side</span>{royalRoomPlan.filter((room) => room.side === 'odd').map((room) => <button onClick={() => openRoyalRoom(room.roomNumber)} onDoubleClick={() => openCanonicalLocation(getBlackWhaleRoyalRoomBridge(room.roomNumber))} title="Click to filter; double-click to open the canonical room snapshot" key={room.roomNumber}><i>{room.roomNumber}</i><strong>{room.prince}</strong><small>{room.state}</small></button>)}</div></div></section>

      <section className="ship-movement-map"><div className="subsection-title"><span>Spatial connections</span><h3>Official, restricted, and hidden routes</h3></div><nav className="ship-route-toggles" aria-label="Filter ship movement routes">{['all', 'official', 'restricted', 'hidden'].map((kind) => <button className={routeKind === kind ? 'is-active' : ''} onClick={() => setRouteKind(kind)} key={kind}>{kind === 'all' ? 'All routes' : `${kind[0].toUpperCase()}${kind.slice(1)}`}</button>)}</nav><div className="ship-movement-map__routes">{blackWhaleMovementRoutes.filter((route) => routeKind === 'all' || route.kind === routeKind).map((route) => <article className={`ship-route ship-route--${route.kind}`} key={route.name}><header><span>{route.kind}</span><h4>{route.name}</h4></header><div>{route.path.map((stop, index) => <span key={stop}><b>{stop}</b>{index < route.path.length - 1 && <i>→</i>}</span>)}</div><p>{route.access}</p></article>)}</div></section>

      <section className="ship-manifest"><div className="subsection-title"><span>Passenger and staffing profile</span><h3>A city of 200,000</h3></div><div className="ship-manifest__table-wrap" role="region" aria-label="Black Whale passenger manifest" tabIndex="0"><table><thead><tr><th style={{ color: 'var(--succession-text-on-paper)' }}>Group</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Count</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Distribution</th><th style={{ color: 'var(--succession-text-on-paper)' }}>Operational meaning</th></tr></thead><tbody>{blackWhaleManifest.map((row) => <tr key={row.group}><th>{row.group}</th><td>{row.count}</td><td>{row.distribution}</td><td>{row.note}</td></tr>)}</tbody></table></div></section>

      <section className="room-index" id="ship-room-index">
        <div className="room-index__heading"><div><span className="section-kicker">Location directory</span><h3>{visibleRooms.length} matching spaces</h3><p className="room-index__progress" role="status">Showing {displayedRooms.length} of {visibleRooms.length} matches · {blackWhaleRooms.length} spaces indexed ship-wide · snapshot Chapter {snapshotChapter}</p></div><div className="room-index__actions"><label><Search size={15} /><input value={roomQuery} onChange={(event) => setRoomQuery(event.target.value)} placeholder="Room, occupant, access…" /></label><button onClick={() => { setActiveTier('all'); setRoomQuery(''); }}>Reset</button></div></div>
        <div className="tier-tabs"><button className={activeTier === 'all' ? 'is-active' : ''} onClick={() => setActiveTier('all')}>All</button>{blackWhaleTiers.map((tier) => <button className={activeTier === tier.id ? 'is-active' : ''} onClick={() => setActiveTier(tier.id)} key={tier.id}>{tier.number}</button>)}</div>
        <div className="room-grid">{displayedRooms.map((room) => { const tier = blackWhaleTiers.find((item) => item.id === room.tier); const canonicalBridge = getBlackWhaleCanonicalBridge({ roomName: room.name, tier: room.tier }); const canonicalLocation = getEntityById(canonicalBridge.locationId); const snapshot = canonicalLocation?.entityType === 'location' ? getLocationSnapshot(canonicalLocation.id, snapshotChapter) : null; return <article className={`room-card${room.image ? ' has-image' : ''}`} key={`${room.tier}-${room.name}`}>{room.image && <figure data-image-frame><SafeImage src={room.image} alt={`${room.name} from Hunterpedia`} loading="eager" /></figure>}<div><span>Tier {tier?.number} · {room.type}</span><h4>{room.name}</h4><p>{room.detail}</p><dl><div><dt>Reference occupants</dt><dd>{room.occupants}</dd></div><div><dt>Chapter {snapshotChapter}</dt><dd>{snapshot ? `${snapshot.occupants.length} mapped occupants` : 'Aggregate record'}</dd></div><div><dt>Control</dt><dd>{room.control}</dd></div><div><dt>Access</dt><dd>{room.access}</dd></div>{room.connections && <div><dt>Connections</dt><dd>{room.connections}</dd></div>}<div><dt>Canonical bridge</dt><dd>{titleCase(canonicalBridge.precision)} · {canonicalLocation?.name || canonicalBridge.locationId}</dd></div></dl><div className="ship-location-inspector__actions"><button type="button" onClick={() => openCanonicalLocation(canonicalBridge)}><MapIcon size={11} /> Chapter {snapshotChapter} snapshot</button><a href={room.source} target="_blank" rel="noreferrer">Room source <ExternalLink size={10} /></a></div></div></article>; })}</div>
        {!visibleRooms.length && <div className="empty-state"><h3>No room matches</h3><p>Try another room, person, faction, or access term.</p></div>}
        {roomsRemaining > 0 && <div className="room-index__more"><button type="button" onClick={() => setRoomLimit((current) => Math.min(current + ROOM_BATCH, visibleRooms.length))}>Show {Math.min(ROOM_BATCH, roomsRemaining)} more spaces</button><span>{roomsRemaining} still hidden in this filtered view</span></div>}
        <div className="ship-access-note"><Users size={18} /><p><b>Movement is political.</b> Tickets, guarded royal walls, military authority, mafia corridors, and Nen routes create overlapping maps of the same vessel.</p></div>
      </section>
    </section>
  );
}
