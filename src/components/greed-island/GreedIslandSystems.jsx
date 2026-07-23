import { useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Filter,
  ImageOff,
  Layers3,
  List,
  Map,
  MapPin,
  Navigation,
  RotateCcw,
  Route,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import SafeImage from '../SafeImage';
import {
  greedIslandGameMasterControls,
  greedIslandLocationById,
  greedIslandLocations,
  greedIslandPlayerSystems,
  greedIslandQuestRecords,
  greedIslandSystemStats,
  resolveGreedIslandSystemSource,
} from '../../data/greed-island/islandSystems.js';
import {
  greedIslandOverviewMedia,
  resolveGreedIslandLocationMedia,
} from '../../data/greed-island/islandMedia.js';
import { gameMasterCardById, spellCardsById } from '../../data/greed-island/cardLibraries.js';
import { enrichedSpecifiedCardById } from '../../data/greed-island/specifiedCardsEnriched.js';
import './GreedIslandSystems.css';

const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusLabel = (status) => status === 'archive-simulation' ? 'Archive simulation' : titleCase(status);
const systemViews = new Set(['map', 'locations', 'quests', 'players', 'game-masters']);

const mapLayoutPositions = Object.freeze({
  'starting-point': Object.freeze({ x: 57, y: 90 }),
  masadora: Object.freeze({ x: 62, y: 73 }),
  'spell-card-shop': Object.freeze({ x: 70, y: 60 }),
  'trade-shops': Object.freeze({ x: 39, y: 47 }),
  badlands: Object.freeze({ x: 29, y: 66 }),
  port: Object.freeze({ x: 22, y: 82 }),
  soufrabi: Object.freeze({ x: 79, y: 46 }),
  aiai: Object.freeze({ x: 68, y: 30 }),
  limeiro: Object.freeze({ x: 48, y: 17 }),
});

const mapLayoutPosition = (location) => mapLayoutPositions[location.id] || location;

const mapConnections = (() => {
  const seen = new Set();
  const connections = [];
  greedIslandLocations.forEach((location) => {
    location.connections.forEach((targetId) => {
      const target = greedIslandLocationById.get(targetId);
      if (!target) return;
      const key = [location.id, target.id].sort().join(':');
      if (seen.has(key)) return;
      seen.add(key);
      connections.push({
        key,
        from: mapLayoutPosition(location),
        to: mapLayoutPosition(target),
      });
    });
  });
  return Object.freeze(connections);
})();

const samplePlayers = Object.freeze([
  Object.freeze({ id: 'gon', name: 'Gon Freecss', relation: 'Player', metAt: 'Starting Point / story route', usefulFor: 'Completion routing and card archive examples' }),
  Object.freeze({ id: 'killua', name: 'Killua Zoldyck', relation: 'Player', metAt: 'Starting Point / party route', usefulFor: 'Exit-route and Transport Ticket examples' }),
  Object.freeze({ id: 'biscuit', name: 'Biscuit Krueger', relation: 'Ally player', metAt: 'Badlands training route', usefulFor: 'Training and travel-context examples' }),
  Object.freeze({ id: 'hisoka', name: 'Hisoka Morow', relation: 'Known player', metAt: 'Greed Island player network', usefulFor: 'Met-player targeting demonstrations' }),
  Object.freeze({ id: 'genthru', name: 'Genthru', relation: 'Enemy player', metAt: 'Greed Island arc conflict', usefulFor: 'Attack, tracking, and risk-state demonstrations' }),
  Object.freeze({ id: 'razor', name: 'Razor', relation: 'Game Master', metAt: 'Soufrabi quest route', usefulFor: 'Quest boss and GM-control demonstrations' }),
]);

function SystemBadge({ children, tone = 'neutral' }) {
  return <span className={`gi-systems-badge is-${tone}`}>{children}</span>;
}

function SourceLink({ sourceId, children = 'Open source' }) {
  const source = resolveGreedIslandSystemSource(sourceId);
  return <a href={source.href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={12} /></a>;
}

function cardLabel(id) {
  if (enrichedSpecifiedCardById.has(id)) return `${id} · ${enrichedSpecifiedCardById.get(id).name}`;
  if (spellCardsById.has(id)) return `${id} · ${spellCardsById.get(id).name}`;
  if (gameMasterCardById.has(id)) return `${id} · ${gameMasterCardById.get(id).name}`;
  return id;
}

function IslandOverview() {
  return <section className="gi-systems-overview" aria-labelledby="gi-systems-overview-title">
    <div className="gi-systems-overview__visual">
      <SafeImage
        src={greedIslandOverviewMedia.src}
        fallbackSrc={greedIslandOverviewMedia.fallbackSrc}
        fallbackLabel="Greed Island map"
        alt={greedIslandOverviewMedia.alt}
        media={greedIslandOverviewMedia}
        eager
      />
      <span>Hunterpedia map reference</span>
    </div>
    <div className="gi-systems-overview__copy">
      <span>Island and location archive</span>
      <h2 id="gi-systems-overview-title">Explore the places where Greed Island’s rules become a world.</h2>
      <p>The source map, location artwork, quest records, player systems, and Game Master controls are presented separately. The source image is authentic Hunterpedia media; interactive marker spacing remains an archive navigation aid rather than a canonical distance claim.</p>
      <div className="gi-systems-overview__facts" aria-label="Island archive summary">
        <div><b>{greedIslandSystemStats.locations}</b><span>documented places</span></div>
        <div><b>{greedIslandSystemStats.quests}</b><span>location-linked quests</span></div>
        <div><b>9</b><span>verified visual records</span></div>
      </div>
    </div>
  </section>;
}

function IslandMap({ selectedId, onSelect, filteredLocations }) {
  const visibleIds = new Set(filteredLocations.map((location) => location.id));
  return <div className="gi-systems-map" aria-label="Greed Island location navigation map">
    <SafeImage
      src={greedIslandOverviewMedia.src}
      fallbackSrc={greedIslandOverviewMedia.fallbackSrc}
      fallbackLabel="Greed Island map"
      alt=""
      aria-hidden="true"
      className="gi-systems-map__image"
      media={greedIslandOverviewMedia}
      eager
    />
    <div className="gi-systems-map__shade" aria-hidden="true" />
    <svg className="gi-systems-map__connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {mapConnections.map((connection) => <line key={connection.key} x1={connection.from.x} y1={connection.from.y} x2={connection.to.x} y2={connection.to.y} />)}
    </svg>
    {greedIslandLocations.map((location) => {
      const position = mapLayoutPosition(location);
      return <button
        type="button"
        key={location.id}
        className={`${selectedId === location.id ? 'is-active' : ''}${visibleIds.has(location.id) ? '' : ' is-dimmed'}`}
        style={{ '--x': `${position.x}%`, '--y': `${position.y}%` }}
        onClick={() => onSelect(location.id)}
        aria-pressed={selectedId === location.id}
        aria-label={`${location.name}, ${titleCase(location.type)}, ${location.region}`}
        data-location-id={location.id}
      >
        <MapPin size={14} aria-hidden="true" />
        <span>{location.name}</span><small>{titleCase(location.type)}</small>
      </button>;
    })}
    <div className="gi-systems-map__legend" aria-hidden="true"><Navigation size={15} /><span>Source map + archive markers</span></div>
  </div>;
}

function LocationPanel({ selected }) {
  const source = resolveGreedIslandSystemSource(selected.sourceId);
  const position = mapLayoutPosition(selected);
  const locationMedia = resolveGreedIslandLocationMedia(selected.id);
  const quests = greedIslandQuestRecords.filter((quest) => quest.locationId === selected.id);
  return <article className="gi-systems-location-card" aria-live="polite" data-location-panel={selected.id}>
    <div className="gi-systems-location-card__visual">
      <SafeImage
        src={locationMedia.src}
        fallbackSrc={locationMedia.fallbackSrc}
        fallbackLabel={selected.name}
        alt={locationMedia.alt}
        media={locationMedia}
      />
      <span>{locationMedia.storage === 'remote-verified' ? 'Verified Hunterpedia visual' : 'Archive visual'}</span>
    </div>
    <header><MapPin size={20} /><div><span>{titleCase(selected.type)} · {selected.region}</span><h3>{selected.name}</h3></div></header>
    <p>{selected.role}</p>
    <div className="gi-systems-tags"><SystemBadge tone="verified">{statusLabel(selected.status)}</SystemBadge>{selected.tags.map((tag) => <SystemBadge key={tag}>{titleCase(tag)}</SystemBadge>)}</div>
    <dl>
      <div><dt>Archive point</dt><dd>{Math.round(position.x)} / {Math.round(position.y)}</dd></div>
      <div><dt>Connections</dt><dd>{selected.connections.map((id) => greedIslandLocationById.get(id)?.name || id).join(', ')}</dd></div>
      <div><dt>Quests</dt><dd>{quests.length ? quests.map((quest) => quest.title).join(', ') : 'No dedicated quest record'}</dd></div>
      <div><dt>Source</dt><dd>{source.label}</dd></div>
    </dl>
    <SourceLink sourceId={selected.sourceId}>Open location source</SourceLink>
  </article>;
}

function LocationDirectory({ filteredLocations, selectedId, onSelect }) {
  if (!filteredLocations.length) return <section className="gi-systems-locations-empty" role="status"><ImageOff size={24} /><h3>No locations match this search.</h3><p>Clear the search or choose another location type.</p></section>;

  return <section className="gi-systems-locations" aria-labelledby="gi-systems-locations-title">
    <header><List size={20} /><div><span>Location directory</span><h3 id="gi-systems-locations-title">Verified places, shown as places—not database rows.</h3></div></header>
    <div className="gi-systems-locations__grid">
      {filteredLocations.map((location) => {
        const locationMedia = resolveGreedIslandLocationMedia(location.id);
        return <button
          type="button"
          key={location.id}
          className={selectedId === location.id ? 'is-active' : ''}
          onClick={() => onSelect(location.id)}
          aria-pressed={selectedId === location.id}
          data-location-directory-id={location.id}
        >
          <span className="gi-systems-locations__image">
            <SafeImage src={locationMedia.src} fallbackSrc={locationMedia.fallbackSrc} fallbackLabel={location.name} alt={locationMedia.alt} media={locationMedia} />
          </span>
          <span className="gi-systems-locations__body">
            <small>{titleCase(location.type)} · {location.region}</small>
            <strong>{location.name}</strong>
            <span>{location.role}</span>
            <i>{location.connections.length} connected records</i>
          </span>
        </button>;
      })}
    </div>
  </section>;
}

function QuestDirectory({ selectedLocationId }) {
  const [questId, setQuestId] = useState('soufrabi-plot-of-beach');
  const questsForLocation = greedIslandQuestRecords.filter((quest) => quest.locationId === selectedLocationId);
  const activeQuest = greedIslandQuestRecords.find((quest) => quest.id === questId) || questsForLocation[0] || greedIslandQuestRecords[0];
  const source = resolveGreedIslandSystemSource(activeQuest.sourceId);
  const activeLocation = greedIslandLocationById.get(activeQuest.locationId);
  const locationMedia = resolveGreedIslandLocationMedia(activeQuest.locationId);

  return <section className="gi-systems-quests" aria-labelledby="gi-systems-quests-title">
    <header><Route size={20} /><div><span>Quest directory</span><h3 id="gi-systems-quests-title">Acquisition paths stay tied to locations.</h3></div></header>
    <div className="gi-systems-quest-layout">
      <div className="gi-systems-quest-list">
        {greedIslandQuestRecords.map((quest) => <button
          type="button"
          key={quest.id}
          className={`${activeQuest.id === quest.id ? 'is-active' : ''}${quest.locationId === selectedLocationId ? ' is-local' : ''}`}
          onClick={() => setQuestId(quest.id)}
          aria-pressed={activeQuest.id === quest.id}
          data-quest-id={quest.id}
        >
          <span>{quest.title}</span><small>{greedIslandLocationById.get(quest.locationId)?.name || quest.locationId}</small>
        </button>)}
      </div>
      <article className="gi-systems-quest-record">
        <div className="gi-systems-quest-record__visual"><SafeImage src={locationMedia.src} fallbackSrc={locationMedia.fallbackSrc} fallbackLabel={activeLocation?.name || 'Quest location'} alt={locationMedia.alt} media={locationMedia} /></div>
        <span>{statusLabel(activeQuest.status)} · {source.label}</span>
        <h4>{activeQuest.title}</h4>
        <p>{activeQuest.summary}</p>
        <dl>
          <div><dt>Location</dt><dd>{activeLocation?.name || activeQuest.locationId}</dd></div>
          <div><dt>Card focus</dt><dd>{activeQuest.cardFocus}</dd></div>
          <div><dt>Rewards</dt><dd>{activeQuest.rewards.join(', ')}</dd></div>
        </dl>
        <div className="gi-systems-card-row" aria-label={`${activeQuest.title} related cards`}>
          {activeQuest.cards.map((id) => <SystemBadge key={id} tone={String(id).startsWith('-') ? 'gm' : /^\d{4}$/.test(String(id)) ? 'spell' : 'card'}>{cardLabel(String(id))}</SystemBadge>)}
        </div>
        <ol>{activeQuest.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <SourceLink sourceId={activeQuest.sourceId}>Open quest source</SourceLink>
      </article>
    </div>
  </section>;
}

function PlayerBinderSystem() {
  const [playerId, setPlayerId] = useState('genthru');
  const [systemId, setSystemId] = useState('attack-risk');
  const selectedPlayer = samplePlayers.find((player) => player.id === playerId) || samplePlayers[0];
  const selectedSystem = greedIslandPlayerSystems.find((system) => system.id === systemId) || greedIslandPlayerSystems[0];
  const playerTargetable = selectedPlayer.relation !== 'Game Master';
  const routeMode = selectedSystem.tags.includes('travel') ? 'Travel target' : selectedSystem.tags.includes('attack') ? 'Risk target' : 'Information target';

  return <section className="gi-systems-player" aria-labelledby="gi-systems-player-title">
    <header><Users size={20} /><div><span>Player Binder</span><h3 id="gi-systems-player-title">Met-player systems power targeting.</h3></div></header>
    <div className="gi-systems-player__controls">
      <label><span>Known record</span><select value={playerId} onChange={(event) => setPlayerId(event.target.value)}>{samplePlayers.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}</select></label>
      <label><span>Binder system</span><select value={systemId} onChange={(event) => setSystemId(event.target.value)}>{greedIslandPlayerSystems.map((system) => <option key={system.id} value={system.id}>{system.title}</option>)}</select></label>
    </div>
    <div className="gi-systems-player__record">
      <article><span>{selectedPlayer.relation}</span><h4>{selectedPlayer.name}</h4><p>{selectedPlayer.usefulFor}</p><dl><div><dt>Met at</dt><dd>{selectedPlayer.metAt}</dd></div><div><dt>Target state</dt><dd>{playerTargetable ? routeMode : 'GM record; not a normal player target'}</dd></div></dl></article>
      <article><span>{statusLabel(selectedSystem.status)}</span><h4>{selectedSystem.title}</h4><p>{selectedSystem.summary}</p><div className="gi-systems-card-row">{selectedSystem.cards.map((id) => <SystemBadge key={id} tone={String(id).length === 4 ? 'spell' : 'card'}>{cardLabel(String(id))}</SystemBadge>)}</div></article>
    </div>
    <p role="status" className="gi-systems-player__outcome">{playerTargetable ? `${selectedSystem.title} can use ${selectedPlayer.name} as a selected archive target when the required card rule allows a previously met player.` : `${selectedPlayer.name} is shown as a Game Master record, so the simulation blocks normal player-target assumptions.`}</p>
    <SourceLink sourceId={selectedSystem.sourceId}>Open player-system source</SourceLink>
  </section>;
}

function GameMasterRoom() {
  const [controlId, setControlId] = useState('negative-card-console');
  const control = greedIslandGameMasterControls.find((item) => item.id === controlId) || greedIslandGameMasterControls[0];
  const source = resolveGreedIslandSystemSource(control.sourceId);

  return <section className="gi-systems-gm" aria-labelledby="gi-systems-gm-title">
    <header><ShieldCheck size={20} /><div><span>Game Master room</span><h3 id="gi-systems-gm-title">Control flow is archived, not made playable.</h3></div></header>
    <div className="gi-systems-gm__layout">
      <div className="gi-systems-gm__console">
        {greedIslandGameMasterControls.map((item) => <button type="button" key={item.id} className={control.id === item.id ? 'is-active' : ''} onClick={() => setControlId(item.id)} aria-pressed={control.id === item.id} data-gm-control={item.id}><span>{item.title}</span><small>{item.gm}</small></button>)}
      </div>
      <article className="gi-systems-gm__record">
        <span>{control.controlType} · {source.label}</span><h4>{control.title}</h4><p>{control.summary}</p>
        <dl><div><dt>GM</dt><dd>{control.gm}</dd></div><div><dt>Status</dt><dd>{statusLabel(control.status)}</dd></div><div><dt>Access</dt><dd>{control.cards.some((id) => String(id).startsWith('-')) ? 'Game Master-only' : 'Story / quest controlled'}</dd></div></dl>
        <div className="gi-systems-card-row">{control.cards.map((id) => <SystemBadge key={id} tone={String(id).startsWith('-') ? 'gm' : /^\d{4}$/.test(String(id)) ? 'spell' : 'card'}>{cardLabel(String(id))}</SystemBadge>)}</div>
        <SourceLink sourceId={control.sourceId}>Open GM source</SourceLink>
      </article>
    </div>
  </section>;
}

export default function GreedIslandSystems({ requestedView = 'map' }) {
  const view = systemViews.has(requestedView) ? requestedView : 'map';
  const [selectedLocationId, setSelectedLocationId] = useState('soufrabi');
  const [locationType, setLocationType] = useState('all');
  const [query, setQuery] = useState('');
  const selectedLocation = greedIslandLocationById.get(selectedLocationId) || greedIslandLocations[0];

  const locationTypes = useMemo(() => [...new Set(greedIslandLocations.map((location) => location.type))], []);
  const filteredLocations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return greedIslandLocations.filter((location) => {
      if (locationType !== 'all' && location.type !== locationType) return false;
      if (!normalized) return true;
      const questText = greedIslandQuestRecords.filter((quest) => quest.locationId === location.id).flatMap((quest) => [quest.title, quest.summary, quest.cardFocus]);
      return [location.name, location.type, location.region, location.role, ...location.tags, ...questText].some((value) => String(value || '').toLowerCase().includes(normalized));
    });
  }, [locationType, query]);

  const resetLocations = () => {
    setQuery('');
    setLocationType('all');
    setSelectedLocationId('soufrabi');
  };

  return <section className="gi-systems" id="island-systems" aria-labelledby="gi-systems-title" data-island-system-view={view}>
    {(view === 'map' || view === 'locations') && <IslandOverview />}

    <header className="gi-section-heading">
      <span>Stage 07 · Island systems</span>
      <h2 id="gi-systems-title">The Island now opens with its map and verified location imagery.</h2>
      <p>Map, location directory, quests, player targeting, and Game Master controls remain separate views so the section stays usable and source-bounded.</p>
    </header>

    <div className="gi-systems__metrics" aria-label="Greed Island system verification summary">
      <div><b>{greedIslandSystemStats.locations}</b><span>verified locations and facilities</span></div>
      <div><b>{greedIslandSystemStats.quests}</b><span>quest/acquisition records</span></div>
      <div><b>{greedIslandSystemStats.playerSystems}</b><span>player Binder systems</span></div>
      <div><b>{greedIslandSystemStats.gameMasterControls}</b><span>GM control records</span></div>
    </div>

    {(view === 'map' || view === 'locations') && <div className="gi-systems__filters">
      <label className="gi-systems__search"><Search size={16} /><span className="sr-only">Search Greed Island locations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations, quests, tags, roles…" /></label>
      <label><Filter size={15} /><span>Location type</span><select value={locationType} onChange={(event) => setLocationType(event.target.value)}><option value="all">All types</option>{locationTypes.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}</select></label>
      <button type="button" className="gi-systems__reset" onClick={resetLocations}><RotateCcw size={15} /> Reset</button>
    </div>}

    {view === 'map' && <div className="gi-systems__map-layout">
      <div><div className="gi-systems__map-header"><Map size={19} /><span>{filteredLocations.length} matching map records</span><small><Layers3 size={14} /> Source map / editorial markers</small></div><IslandMap selectedId={selectedLocation.id} onSelect={setSelectedLocationId} filteredLocations={filteredLocations} /></div>
      <LocationPanel selected={selectedLocation} />
    </div>}

    {view === 'locations' && <>
      <LocationDirectory filteredLocations={filteredLocations} selectedId={selectedLocation.id} onSelect={setSelectedLocationId} />
      <LocationPanel selected={selectedLocation} />
    </>}

    {view === 'quests' && <QuestDirectory selectedLocationId={selectedLocation.id} />}
    {view === 'players' && <PlayerBinderSystem />}
    {view === 'game-masters' && <GameMasterRoom />}

    <p className="gi-systems__provenance"><BookOpen size={15} /> Location visuals and facts use Hunterpedia/Fandom pages. The base map is a verified Hunterpedia image; marker coordinates and connection lines are archive navigation aids, not canonical distances. <SourceLink sourceId="locations">Open location category</SourceLink></p>
  </section>;
}
