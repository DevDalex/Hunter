import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Compass, ExternalLink, Images, Layers3, ListTree, Map as MapIcon, MapPin, Route, Search, ShipWheel } from 'lucide-react';
import {
  worldAtlasSource, worldAtlasStats, worldAtlasZones, worldGalleryIds,
  worldJourney, worldLocations, worldLocationsById,
} from '../data/worldAtlas';
import FandomImage from './FandomImage';
import HorizontalScrollHint from './HorizontalScrollHint';
import InteractiveWorldMap from './InteractiveWorldMap';
import ReferenceBackbonePanel from './ReferenceBackbonePanel';

const viewOptions = [
  ['map', 'Interactive map', MapIcon],
  ['outer', 'Voyage scale', Compass],
  ['journey', 'Story journey', Route],
  ['hierarchy', 'Place hierarchy', ListTree],
  ['gallery', 'Visual atlas', Images],
];

const normalizedText = (value) => String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const pathFor = (location) => {
  const path = [];
  const seen = new Set();
  let current = location;
  while (current && !seen.has(current.id)) {
    path.unshift(current);
    seen.add(current.id);
    current = current.parent ? worldLocationsById.get(current.parent) : null;
  }
  return path;
};

function LocationInspector({ location, onOpenBlackWhale, onOpenEncyclopedia }) {
  if (!location) return null;
  const zone = worldAtlasZones.find((item) => item.id === location.zone);
  const path = pathFor(location);
  const shipLocation = location.id === 'black-whale' || location.id.startsWith('bw-');
  return (
    <aside className="world-place-inspector" aria-live="polite">
      <div className="world-place-inspector__path">
        <MapPin size={13} />
        {path.map((item, index) => <span key={item.id}>{index > 0 && <i>/</i>}{item.name}</span>)}
      </div>
      {location.imageMode !== 'omit' && <FandomImage source={location.source} fallbackImage={location.image} alt={`${location.name} from Hunterpedia`} eager />}
      <header><span>{zone?.eyebrow} · {location.kind}</span><h3>{location.name}</h3><p>{location.summary}</p></header>
      <dl>
        <div><dt>Arc / phase</dt><dd>{location.arc}</dd></div>
        <div><dt>Chapter scope</dt><dd>{location.chapters}</dd></div>
        <div><dt>Control</dt><dd>{location.control}</dd></div>
        <div><dt>Access</dt><dd>{location.access}</dd></div>
        <div><dt>Principal events</dt><dd>{location.events}</dd></div>
        <div><dt>Current state</dt><dd>{location.status}</dd></div>
      </dl>
      <div className="world-place-inspector__related"><b>Connected records</b>{location.related.map((item) => <span key={item}>{item}</span>)}</div>
      <div className="world-place-inspector__actions">
        {shipLocation && <button type="button" onClick={onOpenBlackWhale}><ShipWheel size={13} /> Open interactive ship</button>}
        <button type="button" onClick={() => onOpenEncyclopedia?.(location.name)}><Layers3 size={13} /> Connected records</button>
        <a href={location.source} target="_blank" rel="noreferrer">Hunterpedia source <ExternalLink size={12} /></a>
      </div>
    </aside>
  );
}

export default function WorldAtlas({ initialLocation = '', initialMode = 'explore', initialRoute = '', onOpenBlackWhale, onOpenEncyclopedia, onOpenTimeline }) {
  const initial = worldLocationsById.get(initialLocation) || worldLocations.find((location) => normalizedText(location.name) === normalizedText(initialLocation)) || worldLocationsById.get('whale-island');
  const [view, setView] = useState('map');
  const [selectedId, setSelectedId] = useState(initial.id);
  const [activeJourneyId, setActiveJourneyId] = useState(() => worldJourney.find((leg) => leg.stops.includes(initial.id))?.id || worldJourney[0].id);
  const [zoneFilter, setZoneFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!initialLocation) return;
    const match = worldLocationsById.get(initialLocation) || worldLocations.find((location) => normalizedText(location.name) === normalizedText(initialLocation));
    if (!match) return;
    setSelectedId(match.id);
    setActiveJourneyId(worldJourney.find((leg) => leg.stops.includes(match.id))?.id || worldJourney[0].id);
  }, [initialLocation]);

  const selected = worldLocationsById.get(selectedId) || worldLocations[0];
  const activeJourney = worldJourney.find((leg) => leg.id === activeJourneyId) || worldJourney[0];
  const locationKinds = useMemo(() => [...new Set(worldLocations.map((location) => location.kind))].sort(), []);
  const childrenByParent = useMemo(() => worldLocations.reduce((map, location) => {
    if (!location.parent) return map;
    if (!map.has(location.parent)) map.set(location.parent, []);
    map.get(location.parent).push(location);
    return map;
  }, new Map()), []);

  const visibleIds = useMemo(() => {
    const normalized = normalizedText(query);
    const matches = new Set(worldLocations.filter((location) => {
      const inZone = zoneFilter === 'all' || location.zone === zoneFilter;
      const inLevel = levelFilter === 'all' || location.kind === levelFilter;
      const searchable = normalizedText(`${location.name} ${location.kind} ${location.arc} ${location.summary} ${location.events} ${location.related.join(' ')}`);
      return inZone && inLevel && (!normalized || searchable.includes(normalized));
    }).map((location) => location.id));
    worldLocations.forEach((location) => {
      if (!matches.has(location.id)) return;
      pathFor(location).forEach((ancestor) => matches.add(ancestor.id));
    });
    return matches;
  }, [levelFilter, query, zoneFilter]);

  const hierarchyRows = useMemo(() => {
    const rows = [];
    const visit = (location, depth = 0) => {
      if (!visibleIds.has(location.id)) return;
      rows.push({ location, depth });
      (childrenByParent.get(location.id) || []).forEach((child) => visit(child, depth + 1));
    };
    worldAtlasZones.forEach((zone) => {
      worldLocations.filter((location) => location.zone === zone.id && (!location.parent || worldLocationsById.get(location.parent)?.zone !== zone.id)).forEach((location) => visit(location));
    });
    return rows;
  }, [childrenByParent, visibleIds]);

  const selectLocation = (id) => {
    setSelectedId(id);
    const journey = worldJourney.find((leg) => leg.stops.includes(id));
    if (journey) setActiveJourneyId(journey.id);
  };

  const searchBackbonePlace = (value) => {
    setQuery(value);
    setView('hierarchy');
    const match = worldLocations.find((location) => normalizedText(`${location.name} ${location.summary} ${location.arc}`).includes(normalizedText(value)));
    if (match) selectLocation(match.id);
  };

  return (
    <section className="world-atlas" id="world-atlas">
      <div className="section-heading world-atlas__heading">
        <div><span className="section-kicker">Story geography</span><h2>From the Known World to the voyage.</h2></div>
        <p>Explore actual geographic placement first, then switch to the supporting journey, place hierarchy, or recognition gallery. Approximate positions remain visibly approximate.</p>
      </div>

      <div className="world-atlas__metrics">
        <div><strong>{worldAtlasStats.structuredPlaces}</strong><span>structured places</span></div>
        <div><strong>{worldAtlasStats.nestedPlaces}</strong><span>nested sublocations</span></div>
        <div><strong>{worldAtlasStats.journeyLegs}</strong><span>story-route legs</span></div>
        <div><strong>{worldGalleryIds.length}</strong><span>pictured major places</span></div>
      </div>

      <ReferenceBackbonePanel domain="world" onSearch={searchBackbonePlace} />

      <nav className="world-atlas__views" aria-label="World atlas views">
        {viewOptions.map(([id, label, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)} key={id}><Icon size={15} />{label}</button>)}
      </nav>
      <HorizontalScrollHint>The story route can continue sideways on small screens; select any stop to open its full readable inspector.</HorizontalScrollHint>

      {view === 'map' && <InteractiveWorldMap initialLocation={initialLocation} initialMode={initialMode} initialRoute={initialRoute} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} onOpenTimeline={onOpenTimeline} />}

      {view === 'outer' && <div className="outer-world-view">
        <header><div><span className="section-kicker">A different spatial scale</span><h3>The Known World is not the whole world.</h3></div><p>This explanatory diagram separates the familiar six-continent map from Lake Mobius, the public New Continent destination, and the Dark Continent beyond. Relative size is instructional—not a measured projection.</p></header>
        <div className="outer-world-diagram" role="img" aria-label="Conceptual scale diagram showing the Known World inside Lake Mobius, the Black Whale route toward the New Continent, and the Dark Continent outside the lake">
          <div className="outer-world-diagram__continent"><span>Outside the familiar map</span><strong>Dark Continent</strong><small>Vast external landmass · hazards, resources, Gatekeepers and Guides</small></div>
          <div className="outer-world-diagram__lake"><span>Lake Mobius</span><div className="outer-world-diagram__known"><img src="/world-map-preview.webp" alt="" /><strong>Known World</strong><small>Human-inhabited map used by the atlas</small></div><div className="outer-world-diagram__new"><strong>New Continent</strong><small>Public transfer destination</small></div><div className="outer-world-diagram__route"><i /><b>Black Whale voyage</b><small>Kakin departure → transfer phase</small></div></div>
        </div>
        <ol className="outer-world-sequence"><li><i>01</i><span><strong>Known World</strong><p>Use the interactive geographic map for countries, cities, landmarks, and story routes.</p></span></li><li><i>02</i><span><strong>Black Whale voyage</strong><p>The current story moves a city-sized vessel through political, logistical, and ritual systems.</p></span></li><li><i>03</i><span><strong>New Continent</strong><p>The announced public destination and transfer framework are not the final Dark Continent expedition.</p></span></li><li><i>04</i><span><strong>Beyond the human map</strong><p>Gatekeeper and Guide requirements belong to the true outward journey.</p></span></li></ol>
        <footer><button type="button" onClick={onOpenBlackWhale}><ShipWheel size={14} /> Enter the Black Whale interior</button><button type="button" onClick={() => onOpenTimeline?.('voyage')}><Route size={14} /> Open voyage chronology</button><a href={worldAtlasSource} target="_blank" rel="noreferrer">Hunterpedia world source <ExternalLink size={11} /></a></footer>
      </div>}

      {view === 'journey' && <div className="world-journey">
        <div className="world-journey__notice"><MapIcon size={18} /><p><b>Reading route, not geography.</b> Lines show the order in which the manga’s major study locations become important. They do not claim distance, compass position, or travel duration.</p><a href={worldAtlasSource} target="_blank" rel="noreferrer">World source <ExternalLink size={11} /></a></div>
        <nav className="world-journey__spine" aria-label="Story journey legs">
          {worldJourney.map((leg) => <button type="button" className={leg.id === activeJourney.id ? 'is-active' : ''} onClick={() => { setActiveJourneyId(leg.id); selectLocation(leg.stops[0]); }} key={leg.id}><i>{leg.order}</i><span>{leg.chapters}</span><strong>{leg.title}</strong></button>)}
        </nav>
        <div className="world-journey__workspace">
          <article className="world-journey__leg">
            <header><span>{activeJourney.arc} · {activeJourney.chapters}</span><h3>{activeJourney.title}</h3><p>{activeJourney.note}</p></header>
            <ol>{activeJourney.stops.map((id, index) => {
              const location = worldLocationsById.get(id);
              return <li className={selectedId === id ? 'is-active' : ''} key={id}><button type="button" onClick={() => selectLocation(id)}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{location.kind}</small><strong>{location.name}</strong></span><ArrowRight size={14} /></button></li>;
            })}</ol>
          </article>
          <LocationInspector location={selected} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} />
        </div>
      </div>}

      {view === 'hierarchy' && <div className="world-hierarchy">
        <div className="world-hierarchy__toolbar">
          <div className="world-zone-filter"><button type="button" className={zoneFilter === 'all' ? 'is-active' : ''} onClick={() => setZoneFilter('all')}>All route regions</button>{worldAtlasZones.map((zone) => <button type="button" className={zoneFilter === zone.id ? 'is-active' : ''} onClick={() => setZoneFilter(zone.id)} key={zone.id}>{zone.label}</button>)}</div>
          <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Place, arc, event, character…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label>
          <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} aria-label="Filter by location type"><option value="all">All location types</option>{locationKinds.map((kind) => <option value={kind} key={kind}>{kind}</option>)}</select>
        </div>
        <div className="world-hierarchy__workspace">
          <div className="world-location-tree" role="list" aria-label="Nested location hierarchy">
            {worldAtlasZones.filter((zone) => zoneFilter === 'all' || zone.id === zoneFilter).map((zone) => {
              const rows = hierarchyRows.filter((row) => row.location.zone === zone.id);
              if (!rows.length) return null;
              return <section key={zone.id}><header><span>{zone.eyebrow}</span><h3>{zone.label}</h3><p>{zone.description}</p></header><div>{rows.map(({ location, depth }) => <button type="button" style={{ '--tree-depth': depth }} className={selectedId === location.id ? 'is-active' : ''} onClick={() => selectLocation(location.id)} role="listitem" key={location.id}><i aria-hidden="true" /><span><small>{location.kind}</small><strong>{location.name}</strong></span><em>{childrenByParent.get(location.id)?.length || 0}</em></button>)}</div></section>;
            })}
            {!hierarchyRows.length && <div className="empty-state"><h3>No matching place</h3><p>Try a broader route region or location type.</p></div>}
          </div>
          <LocationInspector location={selected} onOpenBlackWhale={onOpenBlackWhale} onOpenEncyclopedia={onOpenEncyclopedia} />
        </div>
      </div>}

      {view === 'gallery' && <div className="world-gallery-view">
        <div className="world-gallery-view__intro"><div><span>Recognition gallery</span><h3>Major locations at a glance</h3></div><p>Only explicitly indexed Hunterpedia images are displayed. If a location has no verified image record, its card remains text-only instead of showing a placeholder or unrelated art.</p></div>
        <div className="world-gallery-grid">{worldGalleryIds.map((id) => {
          const location = worldLocationsById.get(id);
          return <article className={selectedId === id ? 'is-active' : ''} key={id}>
            <FandomImage source={location.source} fallbackImage={location.image} alt={`${location.name} from Hunterpedia`} />
            <div><span>{location.arc} · {location.kind}</span><h3>{location.name}</h3><p>{location.summary}</p><button type="button" onClick={() => { selectLocation(id); setView('hierarchy'); }}>Open nested record <ArrowRight size={12} /></button></div>
          </article>;
        })}</div>
      </div>}

    </section>
  );
}
