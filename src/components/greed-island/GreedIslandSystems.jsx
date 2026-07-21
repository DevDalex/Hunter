import { useMemo, useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Filter,
  Map,
  MapPin,
  Route,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  greedIslandGameMasterControls,
  greedIslandLocationById,
  greedIslandLocations,
  greedIslandPlayerSystems,
  greedIslandQuestRecords,
  greedIslandSystemStats,
  resolveGreedIslandSystemSource,
} from '../../data/greed-island/islandSystems.js';
import { gameMasterCardById, spellCardsById } from '../../data/greed-island/cardLibraries.js';
import { enrichedSpecifiedCardById } from '../../data/greed-island/specifiedCardsEnriched.js';
import './GreedIslandSystems.css';

const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusLabel = (status) => status === 'archive-simulation' ? 'Archive simulation' : titleCase(status);

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

function IslandMap({ selectedId, onSelect, filteredLocations }) {
  const visibleIds = new Set(filteredLocations.map((location) => location.id));
  return <div className="gi-systems-map" aria-label="Greed Island verified location map">
    <div className="gi-systems-map__grid" aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </div>
    {greedIslandLocations.map((location) => <button
      type="button"
      key={location.id}
      className={`${selectedId === location.id ? 'is-active' : ''}${visibleIds.has(location.id) ? '' : ' is-dimmed'}`}
      style={{ '--x': `${location.x}%`, '--y': `${location.y}%` }}
      onClick={() => onSelect(location.id)}
      aria-pressed={selectedId === location.id}
      data-location-id={location.id}
    >
      <span>{location.name}</span>
      <small>{titleCase(location.type)}</small>
    </button>)}
  </div>;
}

function LocationPanel({ selected }) {
  const source = resolveGreedIslandSystemSource(selected.sourceId);
  return <article className="gi-systems-location-card" aria-live="polite">
    <header>
      <MapPin size={20} />
      <div>
        <span>{titleCase(selected.type)} · {selected.region}</span>
        <h3>{selected.name}</h3>
      </div>
    </header>
    <p>{selected.role}</p>
    <div className="gi-systems-tags">
      <SystemBadge tone="verified">{statusLabel(selected.status)}</SystemBadge>
      {selected.tags.map((tag) => <SystemBadge key={tag}>{titleCase(tag)}</SystemBadge>)}
    </div>
    <dl>
      <div><dt>Map point</dt><dd>{Math.round(selected.x)} / {Math.round(selected.y)}</dd></div>
      <div><dt>Connections</dt><dd>{selected.connections.map((id) => greedIslandLocationById.get(id)?.name || id).join(', ')}</dd></div>
      <div><dt>Source</dt><dd>{source.label}</dd></div>
    </dl>
    <SourceLink sourceId={selected.sourceId}>Open location source</SourceLink>
  </article>;
}

function QuestDirectory({ selectedLocationId }) {
  const [questId, setQuestId] = useState('soufrabi-plot-of-beach');
  const questsForLocation = greedIslandQuestRecords.filter((quest) => quest.locationId === selectedLocationId);
  const activeQuest = greedIslandQuestRecords.find((quest) => quest.id === questId) || questsForLocation[0] || greedIslandQuestRecords[0];
  const source = resolveGreedIslandSystemSource(activeQuest.sourceId);

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
          <span>{quest.title}</span>
          <small>{greedIslandLocationById.get(quest.locationId)?.name || quest.locationId}</small>
        </button>)}
      </div>
      <article className="gi-systems-quest-record">
        <span>{statusLabel(activeQuest.status)} · {source.label}</span>
        <h4>{activeQuest.title}</h4>
        <p>{activeQuest.summary}</p>
        <dl>
          <div><dt>Location</dt><dd>{greedIslandLocationById.get(activeQuest.locationId)?.name || activeQuest.locationId}</dd></div>
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
      <label><span>Known record</span><select value={playerId} onChange={(event) => setPlayerId(event.target.value)}>
        {samplePlayers.map((player) => <option key={player.id} value={player.id}>{player.name}</option>)}
      </select></label>
      <label><span>Binder system</span><select value={systemId} onChange={(event) => setSystemId(event.target.value)}>
        {greedIslandPlayerSystems.map((system) => <option key={system.id} value={system.id}>{system.title}</option>)}
      </select></label>
    </div>
    <div className="gi-systems-player__record">
      <article>
        <span>{selectedPlayer.relation}</span>
        <h4>{selectedPlayer.name}</h4>
        <p>{selectedPlayer.usefulFor}</p>
        <dl>
          <div><dt>Met at</dt><dd>{selectedPlayer.metAt}</dd></div>
          <div><dt>Target state</dt><dd>{playerTargetable ? routeMode : 'GM record; not a normal player target'}</dd></div>
        </dl>
      </article>
      <article>
        <span>{statusLabel(selectedSystem.status)}</span>
        <h4>{selectedSystem.title}</h4>
        <p>{selectedSystem.summary}</p>
        <div className="gi-systems-card-row">{selectedSystem.cards.map((id) => <SystemBadge key={id} tone={String(id).length === 4 ? 'spell' : 'card'}>{cardLabel(String(id))}</SystemBadge>)}</div>
      </article>
    </div>
    <p role="status" className="gi-systems-player__outcome">
      {playerTargetable
        ? `${selectedSystem.title} can use ${selectedPlayer.name} as a selected archive target when the required card rule allows a previously met player.`
        : `${selectedPlayer.name} is shown as a Game Master record, so the simulation blocks normal player-target assumptions.`}
    </p>
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
        {greedIslandGameMasterControls.map((item) => <button
          type="button"
          key={item.id}
          className={control.id === item.id ? 'is-active' : ''}
          onClick={() => setControlId(item.id)}
          aria-pressed={control.id === item.id}
          data-gm-control={item.id}
        >
          <span>{item.title}</span>
          <small>{item.gm}</small>
        </button>)}
      </div>
      <article className="gi-systems-gm__record">
        <span>{control.controlType} · {source.label}</span>
        <h4>{control.title}</h4>
        <p>{control.summary}</p>
        <dl>
          <div><dt>GM</dt><dd>{control.gm}</dd></div>
          <div><dt>Status</dt><dd>{statusLabel(control.status)}</dd></div>
          <div><dt>Access</dt><dd>{control.cards.some((id) => String(id).startsWith('-')) ? 'Game Master-only' : 'Story / quest controlled'}</dd></div>
        </dl>
        <div className="gi-systems-card-row">{control.cards.map((id) => <SystemBadge key={id} tone={String(id).startsWith('-') ? 'gm' : /^\d{4}$/.test(String(id)) ? 'spell' : 'card'}>{cardLabel(String(id))}</SystemBadge>)}</div>
        <SourceLink sourceId={control.sourceId}>Open GM source</SourceLink>
      </article>
    </div>
  </section>;
}

export default function GreedIslandSystems() {
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
      return [
        location.name,
        location.type,
        location.region,
        location.role,
        ...location.tags,
      ].some((value) => String(value || '').toLowerCase().includes(normalized));
    });
  }, [locationType, query]);

  return <section className="gi-systems" id="island-systems" aria-labelledby="gi-systems-title">
    <header className="gi-section-heading">
      <span>Stage 07 · Island systems</span>
      <h2 id="gi-systems-title">The island now has a map, quests, player targeting, and a Game Master room.</h2>
      <p>Locations, acquisition paths, player-list behavior, and Game Master controls are modeled as linked archive systems that consume the verified card libraries without inventing live game state.</p>
    </header>

    <div className="gi-systems__metrics" aria-label="Greed Island system verification summary">
      <div><b>{greedIslandSystemStats.locations}</b><span>verified locations and facilities</span></div>
      <div><b>{greedIslandSystemStats.quests}</b><span>quest/acquisition records</span></div>
      <div><b>{greedIslandSystemStats.playerSystems}</b><span>player Binder systems</span></div>
      <div><b>{greedIslandSystemStats.gameMasterControls}</b><span>GM control records</span></div>
    </div>

    <div className="gi-systems__filters">
      <label className="gi-systems__search"><Search size={16} /><span className="sr-only">Search Greed Island island systems</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search locations, tags, roles…" /></label>
      <label><Filter size={15} /><span>Location type</span><select value={locationType} onChange={(event) => setLocationType(event.target.value)}>
        <option value="all">All types</option>
        {locationTypes.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}
      </select></label>
    </div>

    <div className="gi-systems__map-layout">
      <div>
        <div className="gi-systems__map-header"><Map size={19} /><span>{filteredLocations.length} matching map records</span></div>
        <IslandMap selectedId={selectedLocation.id} onSelect={setSelectedLocationId} filteredLocations={filteredLocations} />
      </div>
      <LocationPanel selected={selectedLocation} />
    </div>

    <QuestDirectory selectedLocationId={selectedLocation.id} />
    <PlayerBinderSystem />
    <GameMasterRoom />

    <p className="gi-systems__provenance"><BookOpen size={15} /> Island systems use Hunterpedia location, card, and Game Master pages. Map coordinates are original archive layout positions, not canonical distances. <SourceLink sourceId="locations">Open location category</SourceLink></p>
  </section>;
}
