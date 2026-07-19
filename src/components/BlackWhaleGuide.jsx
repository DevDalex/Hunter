import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Layers3, Map as MapIcon, Minus, Plus, Search, ShipWheel, Users } from 'lucide-react';
import {
  blackWhaleFacts, blackWhaleGallery, blackWhaleHotspots, blackWhaleImages, blackWhaleManifest,
  blackWhaleMovementRoutes, blackWhaleRooms, blackWhaleSource, blackWhaleTiers, blackWhaleVisualTour, royalRoomPlan,
} from '../data/blackWhale';
import SafeImage from './SafeImage';
import HorizontalScrollHint from './HorizontalScrollHint';

const normalize = (value) => String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const ROOM_BATCH = 12;

export default function BlackWhaleGuide({ initialQuery = '', onOpenWorldMap }) {
  const [activeTier, setActiveTier] = useState('all');
  const [roomQuery, setRoomQuery] = useState('');
  const [selectedHotspotId, setSelectedHotspotId] = useState('tier-1');
  const [hoveredHotspotId, setHoveredHotspotId] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [routeKind, setRouteKind] = useState('all');
  const [roomLimit, setRoomLimit] = useState(ROOM_BATCH);
  const selectedHotspot = blackWhaleHotspots.find((hotspot) => hotspot.id === selectedHotspotId) || blackWhaleHotspots[0];
  const selectedHotspotIndex = blackWhaleHotspots.findIndex((hotspot) => hotspot.id === selectedHotspot.id);
  const selectedTier = blackWhaleTiers.find((tier) => tier.id === selectedHotspot.tier);

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
    <section className="black-whale-section black-whale-section--atlas" id="black-whale">
      <div className="section-heading">
        <div><span className="section-kicker">Black Whale 1 spatial archive</span><h2>Click through the ship</h2></div>
        <p>The Hunterpedia cross-section is the navigation surface. Hover for a quick label; select a marker to inspect the location, its access, occupants, routes, events, and source status.</p>
      </div>

      <div className="ship-source-banner">
        <ShipWheel size={20} />
        <div><strong>A canonical image with research overlays</strong><p>Markers indicate a confirmed tier or an approximate location within that tier. They do not claim an exact floor plan where Hunterpedia supplies none.</p></div>
        <div className="ship-source-banner__actions">
          {onOpenWorldMap && <button type="button" onClick={onOpenWorldMap}><MapIcon size={13} /> Return to voyage map</button>}
          <a href={blackWhaleSource} target="_blank" rel="noreferrer">Hunterpedia ship record <ExternalLink size={12} /></a>
        </div>
      </div>
      <HorizontalScrollHint>Swipe the ship image and the location rail sideways on smaller screens. Every marker also appears in the numbered location index.</HorizontalScrollHint>

      <div className="interactive-ship-atlas">
        <figure className="interactive-ship-map" data-image-frame>
          <div className="interactive-ship-map__toolbar"><div><span>Click a white marker</span><small>Approximate markers are labeled in the inspector</small></div><div><button type="button" onClick={() => setMapZoom((value) => Math.max(1, Number((value - .25).toFixed(2))))} disabled={mapZoom <= 1} aria-label="Zoom ship map out"><Minus size={14} /></button><b>{Math.round(mapZoom * 100)}%</b><button type="button" onClick={() => setMapZoom((value) => Math.min(1.75, Number((value + .25).toFixed(2))))} disabled={mapZoom >= 1.75} aria-label="Zoom ship map in"><Plus size={14} /></button><button type="button" onClick={() => setMapZoom(1)}>Reset</button></div></div>
          <div className="interactive-ship-map__viewport">
            <div className="interactive-ship-map__canvas" style={{ width: `${mapZoom * 100}%`, minWidth: `${620 * mapZoom}px` }}>
              <SafeImage src={blackWhaleImages.crossSection} alt="Manga cross-section of Black Whale 1 showing its five passenger tiers" eager />
              <div className="ship-hotspot-layer" aria-label="Black Whale locations">
                {blackWhaleHotspots.map((hotspot) => {
                  const selected = hotspot.id === selectedHotspotId;
                  const hovered = hotspot.id === hoveredHotspotId;
                  const tooltipSide = hotspot.x >= 64 ? ' is-tooltip-left' : ' is-tooltip-right';
                  const tooltipEdge = hotspot.y <= 15 ? ' is-tooltip-high' : hotspot.y >= 82 ? ' is-tooltip-low' : '';
                  return <button
                    className={`ship-hotspot ship-hotspot--${hotspot.tier}${selected ? ' is-selected' : ''}${tooltipSide}${tooltipEdge}`}
                    style={{ '--hotspot-x': `${hotspot.x}%`, '--hotspot-y': `${hotspot.y}%` }}
                    onMouseEnter={() => setHoveredHotspotId(hotspot.id)} onMouseLeave={() => setHoveredHotspotId(null)}
                    onFocus={() => setHoveredHotspotId(hotspot.id)} onBlur={() => setHoveredHotspotId(null)}
                    onClick={() => chooseHotspot(hotspot)} aria-label={`${hotspot.label}: ${hotspot.subtitle}`} aria-pressed={selected}
                    key={hotspot.id}
                  >
                    <i />
                    {hovered && <span className="ship-hotspot__tooltip"><strong>{hotspot.label}</strong><small>{hotspot.subtitle}</small><em>{hotspot.confidence}</em></span>}
                  </button>;
                })}
              </div>
            </div>
          </div>
          <figcaption><span>Hunterpedia / manga cross-section</span><a href={blackWhaleGallery} target="_blank" rel="noreferrer">Open image source and gallery <ExternalLink size={11} /></a></figcaption>
        </figure>

        <aside className="ship-location-inspector" aria-live="polite">
          <div className="ship-location-inspector__pager"><button type="button" onClick={() => stepHotspot(-1)} aria-label="Previous ship location"><ChevronLeft size={15} /></button><span>{selectedHotspotIndex + 1} / {blackWhaleHotspots.length}</span><button type="button" onClick={() => stepHotspot(1)} aria-label="Next ship location"><ChevronRight size={15} /></button></div>
          <header><span>{selectedHotspot.confidence}</span><h3>{selectedHotspot.label}</h3><p>{selectedHotspot.subtitle}</p></header>
          {selectedHotspot.room?.image && <figure data-image-frame><SafeImage src={selectedHotspot.room.image} alt={`${selectedHotspot.room.name} from Hunterpedia`} /></figure>}
          <div className="ship-location-inspector__evidence" aria-label="More images from this tier">{blackWhaleVisualTour.filter((room) => room.tier === selectedHotspot.tier && room.name !== selectedHotspot.room?.name).slice(0, 3).map((room) => <button type="button" onClick={() => openTourRoom(room)} title={room.name} key={room.name}><SafeImage src={room.image} alt="" /><span>{room.name}</span></button>)}</div>
          <p>{selectedHotspot.room?.detail || selectedHotspot.note || selectedTier?.description}</p>
          {selectedHotspot.room ? <dl>
            <div><dt>Tier</dt><dd>{selectedTier?.number} · {selectedTier?.name}</dd></div>
            <div><dt>Occupants</dt><dd>{selectedHotspot.room.occupants}</dd></div>
            <div><dt>Control</dt><dd>{selectedHotspot.room.control}</dd></div>
            <div><dt>Access</dt><dd>{selectedHotspot.room.access}</dd></div>
            {selectedHotspot.room.connections && <div><dt>Connections</dt><dd>{selectedHotspot.room.connections}</dd></div>}
            <div><dt>Current state</dt><dd>{selectedHotspot.room.status}</dd></div>
          </dl> : <dl>
            <div><dt>Passengers</dt><dd>{selectedTier?.class}</dd></div><div><dt>Population</dt><dd>{selectedTier?.population}</dd></div><div><dt>Security</dt><dd>{selectedTier?.security}</dd></div><div><dt>Control</dt><dd>{selectedTier?.control}</dd></div>
          </dl>}
          <div className="ship-location-inspector__actions"><button onClick={() => { setActiveTier(selectedHotspot.tier); setRoomQuery(''); document.getElementById('ship-room-index')?.scrollIntoView({ behavior: 'smooth' }); }}><Layers3 size={12} /> Browse this tier</button><a href={selectedHotspot.room?.source || selectedHotspot.source} target="_blank" rel="noreferrer">Location source <ExternalLink size={11} /></a></div>
        </aside>
      </div>

      <nav className="ship-hotspot-index" aria-label="Black Whale marked locations">
        {blackWhaleHotspots.map((hotspot, index) => <button type="button" className={hotspot.id === selectedHotspot.id ? 'is-active' : ''} aria-current={hotspot.id === selectedHotspot.id ? 'true' : undefined} onClick={() => chooseHotspot(hotspot)} key={hotspot.id}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{blackWhaleTiers.find((tier) => tier.id === hotspot.tier)?.number || 'Band'}</small><strong>{hotspot.label}</strong></span></button>)}
      </nav>

      <section className="ship-visual-tour" aria-labelledby="ship-visual-tour-title">
        <header><div><span className="section-kicker">Hunterpedia location gallery</span><h3 id="ship-visual-tour-title">See the ship before reading the directory</h3></div><p>{blackWhaleVisualTour.length} sourced room and facility images. Select any image to open its full location record, occupants, access, current state, and connections.</p></header>
        <div>{blackWhaleVisualTour.map((room, index) => {
          const tier = blackWhaleTiers.find((item) => item.id === room.tier);
          return <button type="button" onClick={() => openTourRoom(room)} key={room.name}><figure><SafeImage src={room.image} media={room.media} alt={`${room.name} from Hunterpedia`} /><i>{String(index + 1).padStart(2, '0')}</i></figure><span><small>Tier {tier?.number} · {room.type}</small><strong>{room.name}</strong></span></button>;
        })}</div>
      </section>

      <nav className="ship-tier-key" aria-label="Select a Black Whale tier">
        <button className={activeTier === 'all' ? 'is-active' : ''} onClick={() => { setActiveTier('all'); setRoomQuery(''); }}>Whole ship</button>
        {blackWhaleTiers.map((tier) => <button className={activeTier === tier.id ? 'is-active' : ''} onClick={() => chooseTier(tier.id)} key={tier.id}><b>{tier.number}</b><span>{tier.name}</span></button>)}
      </nav>

      <div className="ship-fact-ribbon">{blackWhaleFacts.map(([term, value]) => <div key={term}><span>{term}</span><strong>{value}</strong></div>)}</div>

      <section className="royal-room-plan royal-room-plan--editorial">
        <header><div><span>Tier 1 residence plan</span><h3>Fourteen prince rooms</h3></div><p>Two rows of seven, with higher-ranked rooms nearer the banquet hall. This shows the confirmed relationship between rooms, not invented scale.</p></header>
        <div className="royal-room-plan__banquet"><span>North / ceremony route</span><strong>Banquet hall</strong></div>
        <div className="royal-room-plan__rows">
          <div className="royal-room-plan__side"><span>Even-numbered side</span>{royalRoomPlan.filter((room) => room.side === 'even').map((room) => <button onClick={() => openRoyalRoom(room.roomNumber)} key={room.roomNumber}><i>{room.roomNumber}</i><strong>{room.prince}</strong><small>{room.state}</small></button>)}</div>
          <div className="royal-room-plan__corridor" aria-hidden="true"><span>Guarded central ring</span><i /><i /><i /><i /><i /><i /><i /></div>
          <div className="royal-room-plan__side"><span>Odd-numbered side</span>{royalRoomPlan.filter((room) => room.side === 'odd').map((room) => <button onClick={() => openRoyalRoom(room.roomNumber)} key={room.roomNumber}><i>{room.roomNumber}</i><strong>{room.prince}</strong><small>{room.state}</small></button>)}</div>
        </div>
      </section>

      <section className="ship-movement-map">
        <div className="subsection-title"><span>Spatial connections</span><h3>Official, restricted, and hidden routes</h3></div>
        <nav className="ship-route-toggles" aria-label="Filter ship movement routes">{['all', 'official', 'restricted', 'hidden'].map((kind) => <button className={routeKind === kind ? 'is-active' : ''} onClick={() => setRouteKind(kind)} key={kind}>{kind === 'all' ? 'All routes' : `${kind[0].toUpperCase()}${kind.slice(1)}`}</button>)}</nav>
        <div className="ship-movement-map__routes">{blackWhaleMovementRoutes.filter((route) => routeKind === 'all' || route.kind === routeKind).map((route) => <article className={`ship-route ship-route--${route.kind}`} key={route.name}><header><span>{route.kind}</span><h4>{route.name}</h4></header><div>{route.path.map((stop, index) => <span key={stop}><b>{stop}</b>{index < route.path.length - 1 && <i>→</i>}</span>)}</div><p>{route.access}</p></article>)}</div>
      </section>

      <section className="ship-manifest">
        <div className="subsection-title"><span>Passenger and staffing profile</span><h3>A city of 200,000</h3></div>
        <div className="ship-manifest__table-wrap" role="region" aria-label="Black Whale passenger manifest" tabIndex="0"><table><thead><tr><th>Group</th><th>Count</th><th>Distribution</th><th>Operational meaning</th></tr></thead><tbody>{blackWhaleManifest.map((row) => <tr key={row.group}><th>{row.group}</th><td>{row.count}</td><td>{row.distribution}</td><td>{row.note}</td></tr>)}</tbody></table></div>
      </section>

      <section className="room-index" id="ship-room-index">
        <div className="room-index__heading">
          <div><span className="section-kicker">Location directory</span><h3>{visibleRooms.length} matching spaces</h3><p className="room-index__progress" role="status">Showing {displayedRooms.length} of {visibleRooms.length} matches · {blackWhaleRooms.length} spaces indexed ship-wide</p></div>
          <div className="room-index__actions"><label><Search size={15} /><input value={roomQuery} onChange={(event) => setRoomQuery(event.target.value)} placeholder="Room, occupant, access…" /></label><button onClick={() => { setActiveTier('all'); setRoomQuery(''); }}>Reset</button></div>
        </div>
        <div className="tier-tabs"><button className={activeTier === 'all' ? 'is-active' : ''} onClick={() => setActiveTier('all')}>All</button>{blackWhaleTiers.map((tier) => <button className={activeTier === tier.id ? 'is-active' : ''} onClick={() => setActiveTier(tier.id)} key={tier.id}>{tier.number}</button>)}</div>
        <div className="room-grid">{displayedRooms.map((room) => {
          const tier = blackWhaleTiers.find((item) => item.id === room.tier);
          return <article className={`room-card${room.image ? ' has-image' : ''}`} key={`${room.tier}-${room.name}`}>
            {room.image && <figure data-image-frame><SafeImage src={room.image} alt={`${room.name} from Hunterpedia`} loading="eager" /></figure>}
            <div><span>Tier {tier?.number} · {room.type}</span><h4>{room.name}</h4><p>{room.detail}</p><dl><div><dt>Occupants</dt><dd>{room.occupants}</dd></div><div><dt>Control</dt><dd>{room.control}</dd></div><div><dt>Access</dt><dd>{room.access}</dd></div>{room.connections && <div><dt>Connections</dt><dd>{room.connections}</dd></div>}<div><dt>Status</dt><dd>{room.status}</dd></div></dl><a href={room.source} target="_blank" rel="noreferrer">Room source <ExternalLink size={10} /></a></div>
          </article>;
        })}</div>
        {!visibleRooms.length && <div className="empty-state"><h3>No room matches</h3><p>Try another room, person, faction, or access term.</p></div>}
        {roomsRemaining > 0 && <div className="room-index__more"><button type="button" onClick={() => setRoomLimit((current) => Math.min(current + ROOM_BATCH, visibleRooms.length))}>Show {Math.min(ROOM_BATCH, roomsRemaining)} more spaces</button><span>{roomsRemaining} still hidden in this filtered view</span></div>}
        <div className="ship-access-note"><Users size={18} /><p><b>Movement is political.</b> Tickets, guarded royal walls, military authority, mafia corridors, and Nen routes create overlapping maps of the same vessel.</p></div>
      </section>
    </section>
  );
}
