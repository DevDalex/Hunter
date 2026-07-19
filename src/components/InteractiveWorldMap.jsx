import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, Check, ChevronDown, ChevronUp, Clipboard, ExternalLink, Eye, EyeOff, Focus, HelpCircle, Info, Layers3, List,
  LocateFixed, Map as MapIcon, Minus, Plus, RotateCcw, Route, Search, ShipWheel,
} from 'lucide-react';
import {
  placementStates, worldMapAssets, worldMapKinds, worldMapLocations, worldMapLocationsById,
  worldMapModes, worldMapRoutes, worldMapStats, worldMapUnplacedLocations,
} from '../data/worldMap';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const normalizedText = (value) => String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const markerSymbol = (kind) => ({ country: '○', city: '●', landmark: '◆', facility: '■', region: '◇', island: '◉', continent: '◎', voyage: '✦' }[kind] || '●');

function routePoints(route) {
  return route.stops.map((id) => worldMapLocationsById.get(id)).filter(Boolean).map((item) => `${item.x},${item.y}`).join(' ');
}

function MapInspector({ location, expanded, onToggle, onCenter, onOpenBlackWhale, onOpenEncyclopedia, onOpenTimeline }) {
  if (!location) return <aside className="world-map-inspector world-map-inspector--empty"><MapIcon size={28} /><h3>Select a place</h3><p>Choose a marker or use the readable location list to inspect its role, connections, source, and placement confidence.</p></aside>;
  const placement = placementStates[location.confidence] || placementStates.approximate;
  const shipLink = location.id === 'black-whale-voyage';
  const voyageLink = location.era === 'succession' || ['kakin-empire', 'kakin-port', 'black-whale-voyage'].includes(location.id);
  const parentName = worldMapLocationsById.get(location.parent)?.name || location.parent.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Known World';
  return (
    <aside className={`world-map-inspector${expanded ? ' is-expanded' : ''}`} aria-live="polite">
      <button type="button" className="world-map-inspector__mobile-toggle" onClick={onToggle} aria-expanded={expanded}>
        <span><small>Selected place</small><strong>{location.name}</strong></span>{expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>
      <header>
        <span>{location.kind} · {location.depth} record</span>
        <h3>{location.name}</h3>
        {location.alternateNames.length > 0 && <small className="world-map-inspector__alternate">Also indexed as {location.alternateNames.join(' · ')}</small>}
        <p>{location.summary}</p>
      </header>
      <div className={`world-map-inspector__confidence is-${location.confidence}`}><Info size={14} /><span><b>{placement.label}</b>{placement.note}</span></div>
      <dl>
        <div><dt>Story era</dt><dd>{location.era === 'pre' ? 'Pre-Succession' : location.era === 'succession' ? 'Succession' : 'Cross-era'}</dd></div>
        <div><dt>Arc / phase</dt><dd>{location.arcs.length ? location.arcs.join(' · ') : 'World reference'}</dd></div>
        <div><dt>Map parent</dt><dd>{parentName}</dd></div>
        <div><dt>Placement basis</dt><dd>{location.basis}</dd></div>
      </dl>
      <section><b>Why it matters</b><p>{location.importance}</p></section>
      <section><b>What the source supports</b><p>{location.sourceNote}</p></section>
      {location.related.length > 0 && <section className="world-map-inspector__related"><b>Connected records</b><div>{location.related.map((item) => <span key={item}>{item}</span>)}</div></section>}
      <footer>
        <button type="button" onClick={() => onCenter(location)}><LocateFixed size={14} /> Center marker</button>
        {shipLink && <button type="button" onClick={onOpenBlackWhale}><ShipWheel size={14} /> Open Black Whale atlas</button>}
        {voyageLink && onOpenTimeline && <button type="button" onClick={() => onOpenTimeline('')}><Route size={14} /> Open voyage clock</button>}
        <button type="button" onClick={() => onOpenEncyclopedia?.(location.name)}><Layers3 size={14} /> Connected records</button>
        <a href={location.source} target="_blank" rel="noreferrer">Hunterpedia source <ExternalLink size={12} /></a>
      </footer>
    </aside>
  );
}

export default function InteractiveWorldMap({ initialLocation = '', initialMode = 'explore', initialRoute = '', onOpenBlackWhale, onOpenEncyclopedia, onOpenTimeline }) {
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const [mode, setMode] = useState(worldMapModes.some((item) => item.id === initialMode) ? initialMode : 'explore');
  const [selectedId, setSelectedId] = useState(() => {
    const normalized = normalizedText(initialLocation);
    const mapped = worldMapLocations.find((item) => item.id === initialLocation || normalizedText(item.name) === normalized || item.alternateNames.some((name) => normalizedText(name) === normalized));
    const unplaced = worldMapUnplacedLocations.some((item) => item.id === initialLocation || normalizedText(item.name) === normalized);
    return mapped?.id || (unplaced ? '' : 'yorknew-city');
  });
  const [query, setQuery] = useState(() => worldMapUnplacedLocations.find((item) => item.id === initialLocation || normalizedText(item.name) === normalizedText(initialLocation))?.name || '');
  const [kind, setKind] = useState('all');
  const [era, setEra] = useState('all');
  const [activeRouteId, setActiveRouteId] = useState(worldMapRoutes.some((item) => item.id === initialRoute) ? initialRoute : 'pre-journey');
  const [showLabels, setShowLabels] = useState(false);
  const [showUncertain, setShowUncertain] = useState(true);
  const [overlayOpacity, setOverlayOpacity] = useState(.68);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const [inspectorExpanded, setInspectorExpanded] = useState(false);
  const selected = worldMapLocationsById.get(selectedId);

  useEffect(() => {
    const normalized = normalizedText(initialLocation);
    const match = worldMapLocations.find((item) => item.id === initialLocation || normalizedText(item.name) === normalized || item.alternateNames.some((name) => normalizedText(name) === normalized));
    if (match) { setSelectedId(match.id); setQuery(''); return; }
    const unplaced = worldMapUnplacedLocations.find((item) => item.id === initialLocation || normalizedText(item.name) === normalized);
    if (unplaced) { setSelectedId(''); setQuery(unplaced.name); }
  }, [initialLocation]);

  useEffect(() => {
    if (worldMapModes.some((item) => item.id === initialMode)) setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (worldMapRoutes.some((item) => item.id === initialRoute)) setActiveRouteId(initialRoute);
  }, [initialRoute]);

  const visibleLocations = useMemo(() => {
    const normalized = normalizedText(query);
    return worldMapLocations.filter((location) => {
      const modeMatch = location.modes.includes(mode);
      const kindMatch = kind === 'all' || location.kind === kind;
      const eraMatch = era === 'all' || location.era === era || location.era === 'cross';
      const confidenceMatch = showUncertain || !['reference', 'conceptual'].includes(location.confidence);
      const searchMatch = !normalized || normalizedText(`${location.name} ${location.alternateNames.join(' ')} ${location.kind} ${location.summary} ${location.importance} ${location.related.join(' ')}`).includes(normalized);
      return modeMatch && kindMatch && eraMatch && confidenceMatch && searchMatch;
    });
  }, [era, kind, mode, query, showUncertain]);

  const visibleUnplaced = useMemo(() => {
    const normalized = normalizedText(query);
    return worldMapUnplacedLocations.filter((location) => (
      location.modes.includes(mode)
      && (era === 'all' || location.era === era || location.era === 'cross')
      && kind === 'all'
      && (!normalized || normalizedText(`${location.name} ${location.kind} ${location.note} ${location.related.join(' ')}`).includes(normalized))
    ));
  }, [era, kind, mode, query]);

  const visibleIds = useMemo(() => new Set(visibleLocations.map((item) => item.id)), [visibleLocations]);
  const visibleRoutes = useMemo(() => {
    if (mode === 'succession') return worldMapRoutes.filter((route) => route.id === 'succession-voyage');
    if (mode !== 'journey') return [];
    return worldMapRoutes.filter((route) => route.id === activeRouteId);
  }, [activeRouteId, mode]);

  useEffect(() => {
    if (mode === 'succession') setActiveRouteId('succession-voyage');
    else if (mode === 'journey' && activeRouteId === 'succession-voyage') setActiveRouteId('pre-journey');
  }, [activeRouteId, mode]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedId) params.set('location', selectedId);
    else {
      const unplaced = worldMapUnplacedLocations.find((item) => normalizedText(item.name) === normalizedText(query));
      if (unplaced) params.set('location', unplaced.id);
    }
    if (mode !== 'explore') params.set('mode', mode);
    if (mode === 'journey' && activeRouteId) params.set('route', activeRouteId);
    const next = `#/reference/atlas${params.toString() ? `?${params}` : ''}`;
    if (window.location.hash !== next) window.history.replaceState(null, '', next);
  }, [activeRouteId, mode, query, selectedId]);

  const dimensions = () => viewportRef.current?.getBoundingClientRect() || { width: 1, height: 1 };
  const constrainPan = (next, nextZoom = zoom) => {
    const { width, height } = dimensions();
    const maxX = Math.max(0, (nextZoom - 1) * width * .5 + width * .14);
    const maxY = Math.max(0, (nextZoom - 1) * height * .5 + height * .14);
    return { x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) };
  };

  const updateZoom = (next) => {
    const value = clamp(Number(next.toFixed(2)), 1, 2.6);
    setZoom(value);
    setPan((current) => constrainPan(current, value));
  };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const centerLocation = (location, preferredZoom = Math.max(zoom, 1.55)) => {
    const { width, height } = dimensions();
    const nextZoom = clamp(preferredZoom, 1, 2.6);
    setZoom(nextZoom);
    setPan(constrainPan({
      x: -(location.x / 100 - .5) * width * nextZoom,
      y: -(location.y / 100 - .5) * height * nextZoom,
    }, nextZoom));
  };

  const fitRoute = (route) => {
    const points = route.stops.map((id) => worldMapLocationsById.get(id)).filter(Boolean);
    if (!points.length) return;
    const minX = Math.min(...points.map((item) => item.x));
    const maxX = Math.max(...points.map((item) => item.x));
    const minY = Math.min(...points.map((item) => item.y));
    const maxY = Math.max(...points.map((item) => item.y));
    const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    const spread = Math.max((maxX - minX) / 100, (maxY - minY) / 100, .34);
    centerLocation(center, clamp(.82 / spread, 1, 2.1));
  };

  const selectLocation = (location, shouldCenter = false) => {
    setSelectedId(location.id);
    setInspectorExpanded(true);
    if (shouldCenter) centerLocation(location);
  };

  const beginDrag = (event) => {
    if (event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pan };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    setPan(constrainPan({ x: drag.pan.x + event.clientX - drag.x, y: drag.pan.y + event.clientY - drag.y }));
  };
  const endDrag = (event) => {
    if (dragRef.current?.id === event.pointerId) dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const copyView = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { setCopied(false); }
  };

  const changeMode = (next) => {
    setMode(next);
    setKind('all'); setEra('all'); setQuery(''); resetView();
    setInspectorExpanded(false);
    const first = worldMapLocations.find((item) => item.modes.includes(next));
    if (first) setSelectedId(first.id);
  };

  const activeRoute = worldMapRoutes.find((route) => route.id === activeRouteId);

  useEffect(() => {
    if (!initialRoute) return undefined;
    const route = worldMapRoutes.find((item) => item.id === initialRoute);
    if (!route) return undefined;
    const timer = window.setTimeout(() => fitRoute(route), 40);
    return () => window.clearTimeout(timer);
  }, [initialRoute]);

  return (
    <section className="interactive-world-map" aria-labelledby="interactive-world-map-title">
      <header className="interactive-world-map__intro">
        <div><span className="section-kicker">Interactive geographic atlas</span><h3 id="interactive-world-map-title">The supplied map—now the map.</h3></div>
        <p>The exact labeled image you supplied is the visible base. Interaction rings align with its existing points; selecting a location opens context without redrawing or “correcting” the geography.</p>
      </header>

      <div className="world-map-summary" aria-label="Map coverage summary">
        <div><strong>{worldMapStats.markers}</strong><span>map records</span></div>
        <div><strong>{worldMapStats.routes}</strong><span>curated routes</span></div>
        <div><strong>{worldMapStats.approximate}</strong><span>approximate points</span></div>
        <div><strong>{worldMapStats.reference}</strong><span>labels to verify</span></div>
      </div>

      <nav className="world-map-modes" aria-label="Map mode">
        {worldMapModes.map((item) => <button type="button" className={mode === item.id ? 'is-active' : ''} aria-current={mode === item.id ? 'page' : undefined} onClick={() => changeMode(item.id)} key={item.id}><span>{item.label}</span><small>{item.note}</small></button>)}
      </nav>

      <div className="world-map-toolbar">
        <label className="world-map-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Place, character, arc…" /><span className="sr-only">Search mapped places</span>{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label>
        <select value={kind} onChange={(event) => setKind(event.target.value)} aria-label="Filter map by place type">{worldMapKinds.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select>
        <select value={era} onChange={(event) => setEra(event.target.value)} aria-label="Filter map by story era"><option value="all">All story eras</option><option value="pre">Pre-Succession</option><option value="succession">Succession</option></select>
        <button type="button" className={showLabels ? 'is-active' : ''} onClick={() => setShowLabels((value) => !value)} aria-pressed={showLabels}>{showLabels ? <Eye size={15} /> : <EyeOff size={15} />} Labels</button>
        <button type="button" className={showUncertain ? 'is-active' : ''} onClick={() => setShowUncertain((value) => !value)} aria-pressed={showUncertain}><Info size={15} /> Approximate</button>
        {mode === 'reference' && <label className="world-map-opacity"><span>Overlay</span><input type="range" min="0.2" max="1" step="0.05" value={overlayOpacity} onChange={(event) => setOverlayOpacity(Number(event.target.value))} /><output>{Math.round(overlayOpacity * 100)}%</output></label>}
      </div>

      {(mode === 'journey' || mode === 'succession') && <div className="world-map-routebar">
        <div><Route size={16} /><span><b>{activeRoute?.label}</b><small>{activeRoute?.note}</small></span></div>
        {mode === 'journey' && <select value={activeRouteId} onChange={(event) => setActiveRouteId(event.target.value)} aria-label="Active story route">{worldMapRoutes.filter((route) => route.id !== 'succession-voyage').map((route) => <option value={route.id} key={route.id}>{route.label}</option>)}</select>}
        <button type="button" onClick={() => activeRoute && fitRoute(activeRoute)}><Focus size={14} /> Fit route</button>
      </div>}

      <div className="world-map-workspace">
        <div className="world-map-frame">
          <a className="skip-map-link" href="#world-map-location-list">Skip map and open location list</a>
          <div className="world-map-zoom" aria-label="Map view controls">
            <button type="button" onClick={() => updateZoom(zoom + .25)} disabled={zoom >= 2.6} aria-label="Zoom in"><Plus size={17} /></button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => updateZoom(zoom - .25)} disabled={zoom <= 1} aria-label="Zoom out"><Minus size={17} /></button>
            <button type="button" onClick={resetView} aria-label="Reset map"><RotateCcw size={16} /></button>
          </div>
          <div
            className={`world-map-viewport mode-${mode}${dragRef.current ? ' is-dragging' : ''}`}
            ref={viewportRef}
            onPointerDown={beginDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            aria-label="Interactive Known World map. Drag to pan after zooming, or use the location list below."
          >
            <div className="world-map-canvas" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})` }}>
              <img src={worldMapAssets.clean.src} width={worldMapAssets.clean.width} height={worldMapAssets.clean.height} alt="Terrain map of the Hunter × Hunter Known World" draggable="false" />
              {mode === 'reference' && <div className="world-map-reference-wash" style={{ opacity: overlayOpacity }} aria-hidden="true" />}
              {visibleRoutes.length > 0 && <svg className="world-map-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {visibleRoutes.map((route) => <polyline key={route.id} points={routePoints(route)} fill="none" stroke={route.color} strokeWidth=".55" strokeDasharray={route.dash || undefined} vectorEffect="non-scaling-stroke" />)}
              </svg>}
              <div className="world-map-markers">
                {visibleLocations.map((location) => {
                  const isSelected = location.id === selectedId;
                  const route = visibleRoutes.find((item) => item.stops.includes(location.id));
                  const routeOrder = route ? route.stops.indexOf(location.id) + 1 : 0;
                  const onActiveRoute = routeOrder > 0;
                  const labelIsPersistent = showLabels && (isSelected || onActiveRoute || location.labelPriority >= (zoom >= 1.8 ? 0 : zoom >= 1.3 ? 60 : 90));
                  return <button
                    type="button"
                    className={`world-map-marker kind-${location.kind} confidence-${location.confidence} era-${location.era}${isSelected ? ' is-selected' : ''}${onActiveRoute ? ' is-route-stop' : ''}`}
                    style={{ '--map-x': `${location.x}%`, '--map-y': `${location.y}%`, '--label-x': `${location.labelOffset[0]}px`, '--label-y': `${location.labelOffset[1]}px`, '--marker-priority': location.labelPriority }}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => selectLocation(location)}
                    onDoubleClick={() => centerLocation(location)}
                    aria-pressed={isSelected}
                    aria-label={`${location.name}, ${location.kind}, ${placementStates[location.confidence]?.label || 'mapped place'}${routeOrder ? `, route stop ${routeOrder} of ${route.stops.length}` : ''}`}
                    key={location.id}
                  ><i aria-hidden="true">{markerSymbol(location.kind)}</i><span className={labelIsPersistent ? '' : 'is-contextual'}><b>{location.name}</b><small>{location.summary}</small></span></button>;
                })}
              </div>
            </div>
          </div>
          <div className="world-map-legend" aria-label="Map legend">
            <span><i className="legend-supported" />Interactive location ring</span>
            <span><i className="legend-reference" />Reference / approximate point</span>
            <span><i className="legend-route" />Narrative route</span>
            <button type="button" onClick={copyView}>{copied ? <Check size={13} /> : <Clipboard size={13} />}{copied ? 'View copied' : 'Copy map view'}</button>
          </div>
        </div>
        <MapInspector location={selected} expanded={inspectorExpanded} onToggle={() => setInspectorExpanded((value) => !value)} onCenter={centerLocation} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} onOpenTimeline={onOpenTimeline} />
      </div>

      <details className="world-map-location-list" id="world-map-location-list">
        <summary><List size={16} /> Readable location list <span>{visibleLocations.length} shown</span></summary>
        <div>{visibleLocations.map((location) => <button type="button" className={selectedId === location.id ? 'is-active' : ''} onClick={() => { selectLocation(location, true); viewportRef.current?.scrollIntoView({ block: 'center' }); }} key={location.id}><i>{markerSymbol(location.kind)}</i><span><small>{location.kind} · {placementStates[location.confidence]?.label}</small><strong>{location.name}</strong></span><ArrowRight size={14} /></button>)}</div>
      </details>

      {visibleUnplaced.length > 0 && <section className="world-map-unplaced" aria-labelledby="world-map-unplaced-title">
        <header><HelpCircle size={21} /><div><span className="section-kicker">Deliberately unpinned</span><h4 id="world-map-unplaced-title">Important places without invented coordinates</h4><p>These records belong in the story or the larger voyage model, but not at a guessed point on this image.</p></div></header>
        <div>{visibleUnplaced.map((location) => <article key={location.id}><span>{location.kind} · {location.era === 'succession' ? 'Succession' : location.era === 'cross' ? 'Cross-era' : 'Pre-Succession'}</span><h5>{location.name}</h5><p>{location.note}</p><div>{location.related.map((item) => <small key={item}>{item}</small>)}</div><footer><button type="button" onClick={() => onOpenEncyclopedia?.(location.name)}><Layers3 size={13} /> Connected records</button><a href={location.source} target="_blank" rel="noreferrer">Hunterpedia source <ExternalLink size={11} /></a></footer></article>)}</div>
      </section>}

      <section className="world-map-scale-path" aria-label="Atlas scale transitions">
        <article><span>Scale 01</span><MapIcon size={20} /><h4>Known World</h4><p>Countries, cities, islands, landmarks, and broad story routes.</p></article>
        <ArrowRight size={18} />
        <article><span>Scale 02</span><Route size={20} /><h4>Voyage & outside world</h4><p>Lake Mobius, the advertised New Continent, and the true expedition objective use a separate relationship diagram.</p>{onOpenTimeline && <button type="button" onClick={() => onOpenTimeline('')}>Open voyage clock <ArrowRight size={13} /></button>}</article>
        <ArrowRight size={18} />
        <article><span>Scale 03</span><ShipWheel size={20} /><h4>Black Whale interior</h4><p>Five tiers, rooms, hidden bands, access rules, occupants, and movement.</p><button type="button" onClick={onOpenBlackWhale}>Open ship atlas <ArrowRight size={13} /></button></article>
      </section>

      <footer className="world-map-provenance">
        <div><b>{worldMapAssets.clean.label}</b><span>{worldMapAssets.clean.note}</span><span className="world-map-provenance__links"><a href={worldMapAssets.clean.source} target="_blank" rel="noreferrer">World record <ExternalLink size={11} /></a>{worldMapAssets.clean.imageSource && <a href={worldMapAssets.clean.imageSource} target="_blank" rel="noreferrer">Original image <ExternalLink size={11} /></a>}</span></div>
        <div><b>{worldMapAssets.reference.label}</b><span>{worldMapAssets.reference.note}</span><a href={worldMapAssets.reference.source} target="_blank" rel="noreferrer">Placement context <ExternalLink size={11} /></a></div>
      </footer>
    </section>
  );
}
