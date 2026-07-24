import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  ExternalLink,
  Eye,
  FileText,
  GitBranch,
  MapPin,
  Network,
  Search,
  Shield,
  Skull,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  beastRules,
  bodyStateLedger,
  exceptionalStatuses,
  guardianBeasts,
  princeDossiers,
  queenDossiers,
  successionChapterResearch,
  successionOperations,
  successionRelationships,
} from '../../data/successionDossier';
import {
  personnelTransitions,
  queenHouseholdLedger,
  roomAssignmentLedger,
} from '../../data/successionArchive';
import {
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import SafeImage from '../SafeImage';
import { EntityVisual } from './SuccessionArchivePrimitives';
import './SuccessionArchiveDeepWorkspaces.css';

const slugify = (value = '') => String(value)
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const firstChapter = (value) => Number(String(value || '').match(/\d{3}/)?.[0] || 0);
const normalizeText = (value) => String(value || '').toLocaleLowerCase();
const cleanPersonName = (value) => String(value || '')
  .replace(/\s*\([^)]*\)/g, '')
  .replace(/^Prince\s+/i, '')
  .trim();

const characterRecords = getEntitiesByType('character');
const organizationRecords = getEntitiesByType('organization');

const entityForName = (name) => {
  const cleaned = cleanPersonName(name);
  if (!cleaned) return null;
  const direct = getEntityById(`character:${slugify(cleaned)}`)
    || getEntityById(`organization:${slugify(cleaned)}`);
  if (direct) return direct;
  return [...characterRecords, ...organizationRecords].find((entity) => {
    const names = [entity.name, ...(entity.aliases || [])].map(normalizeText);
    return names.includes(normalizeText(cleaned));
  }) || null;
};

const queenEntity = (name) => entityForName(`${name} Hui Guo Rou`) || entityForName(name);
const princeForChild = (value) => {
  const cleaned = cleanPersonName(value);
  return princeDossiers.find((prince) => prince.short === cleaned || prince.name === cleaned || prince.name.startsWith(`${cleaned} `)) || null;
};
const statusTone = (value = '') => /dead|deceased|eliminated/i.test(value)
  ? 'dead'
  : /exceptional|occupied|possess|continuation/i.test(value)
    ? 'exceptional'
    : /active|protected/i.test(value)
      ? 'active'
      : 'neutral';

function EntityNameButton({ name, onNavigate, route = 'characters' }) {
  const entity = entityForName(name);
  return <button
    type="button"
    className="succession-deep-entity-button"
    disabled={!entity}
    onClick={() => entity && onNavigate(route, { entity: entity.id })}
  >
    <EntityVisual entity={entity} compact />
    <span>{name}</span>
  </button>;
}

export function QueensWorkspace({ routeParams = {}, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const initialFocus = routeParams.focus || slugify((requestedEntity?.name || '').replace(/ Hui Guo Rou$/, ''));
  const [focus, setFocus] = useState(initialFocus);
  const selected = queenHouseholdLedger.find((queen) => slugify(queen.name) === focus) || null;
  const dossierFor = (queen) => queenDossiers.find((record) => record.name === queen.name);

  useEffect(() => {
    setFocus(routeParams.focus || slugify((requestedEntity?.name || '').replace(/ Hui Guo Rou$/, '')));
  }, [requestedEntity?.name, routeParams.focus]);

  const openQueen = (queen) => {
    const entity = queenEntity(queen.name);
    const nextFocus = slugify(queen.name);
    setFocus(nextFocus);
    onNavigate('queens', entity ? { entity: entity.id, focus: nextFocus } : { focus: nextFocus });
  };

  if (selected) {
    const entity = queenEntity(selected.name);
    const dossier = dossierFor(selected);
    return <article className="succession-queen-dossier">
      <button type="button" className="succession-deep-back" onClick={() => onNavigate('queens')}><ArrowLeft size={15} aria-hidden="true" /> All queens</button>
      <section className="succession-queen-dossier__hero">
        <EntityVisual entity={entity} />
        <div><span>{selected.rank} Queen · {selected.status}</span><h2>{selected.name} Hui Guo Rou</h2><p>{dossier?.role || selected.action}</p><small><MapPin size={13} aria-hidden="true" /> {selected.residence}</small></div>
        <a href={selected.source} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a>
      </section>
      <div className="succession-queen-dossier__columns">
        <section><span>Household position</span><h3>Political action</h3><p>{selected.action}</p></section>
        <section><span>Security network</span><h3>Guards and surveillance</h3><p>{selected.guards}</p></section>
      </div>
      <section className="succession-queen-dossier__children" aria-labelledby="succession-queen-children-title">
        <header><Crown size={18} aria-hidden="true" /><div><span>Royal branch</span><h3 id="succession-queen-children-title">Children and succession interests</h3></div></header>
        <div>{(dossier?.children || []).map((child) => {
          const prince = princeForChild(child);
          const entityForPrince = prince ? entityForName(prince.name) : null;
          return <button type="button" key={child} disabled={!prince} onClick={() => prince && onNavigate('princes', entityForPrince ? { entity: entityForPrince.id } : { prince: prince.order })}>
            <EntityVisual entity={entityForPrince} compact />
            <span>{child}</span>
            {prince && <small>Prince {prince.order} · {prince.status}</small>}
          </button>;
        })}</div>
      </section>
    </article>;
  }

  return <section className="succession-queen-board" aria-labelledby="succession-queen-board-title">
    <header><div><span>Royal maternal hierarchy</span><h2 id="succession-queen-board-title">Eight queens, fourteen prince branches, overlapping surveillance</h2><p>Queen rank determines more than parentage. Each household carries guards, spies, reassignment power, and a different political exposure to the contest.</p></div><dl><div><dt>Queens</dt><dd>{queenHouseholdLedger.length}</dd></div><div><dt>Prince branches</dt><dd>14</dd></div></dl></header>
    <div>{queenHouseholdLedger.map((queen) => {
      const entity = queenEntity(queen.name);
      const dossier = dossierFor(queen);
      return <button type="button" className={`succession-queen-card is-${statusTone(queen.status)}`} key={queen.rank} onClick={() => openQueen(queen)}>
        <span className="succession-queen-card__rank">{queen.rank}</span>
        <EntityVisual entity={entity} />
        <div><span>{queen.status}</span><h3>{queen.name}</h3><p>{dossier?.role || queen.action}</p></div>
        <dl><div><dt>Children</dt><dd>{dossier?.children.length || 0}</dd></div><div><dt>Residence</dt><dd>{queen.residence}</dd></div></dl>
        <footer><b>Open household dossier</b><ArrowRight size={14} aria-hidden="true" /></footer>
      </button>;
    })}</div>
  </section>;
}

export function BodyguardsWorkspace({ routeParams = {}, onNavigate }) {
  const requestedOrder = Number(routeParams.prince || routeParams.room);
  const [selectedOrder, setSelectedOrder] = useState(Number.isFinite(requestedOrder) && requestedOrder ? requestedOrder : null);
  const [query, setQuery] = useState('');
  const selected = roomAssignmentLedger.find((room) => room.order === selectedOrder) || null;
  const namedBodyguards = useMemo(() => characterRecords.filter((entity) => (entity.roles || []).includes('bodyguard')), []);
  const visibleRooms = useMemo(() => {
    const normalized = normalizeText(query.trim());
    if (!normalized) return roomAssignmentLedger;
    return roomAssignmentLedger.filter((record) => normalizeText(`${record.prince} ${record.room} ${record.mother} ${record.state} ${record.original} ${record.deployed} ${record.current}`).includes(normalized));
  }, [query]);

  useEffect(() => {
    const next = Number(routeParams.prince || routeParams.room);
    setSelectedOrder(Number.isFinite(next) && next ? next : null);
  }, [routeParams.prince, routeParams.room]);

  const openRoom = (order) => {
    setSelectedOrder(order);
    onNavigate('bodyguards', { prince: order });
  };

  return <div className="succession-guards-workspace">
    <section className="succession-guards-workspace__hero">
      <div><span>Room assignment matrix</span><h2>Protection, surveillance, infiltration, and reassignment</h2><p>Every royal room combines personal guards, queen-appointed spies, Hunters, servants, military observers, and temporary replacements. Loyalty and physical location are tracked separately.</p></div>
      <dl><div><dt>Prince rooms</dt><dd>{roomAssignmentLedger.length}</dd></div><div><dt>Named bodyguards</dt><dd>{namedBodyguards.length}</dd></div><div><dt>Tracked transitions</dt><dd>{personnelTransitions.length}</dd></div></dl>
    </section>

    <label className="succession-guards-workspace__search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search room assignments</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Room, prince, guard movement, current state…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label>

    <section className="succession-room-matrix" aria-labelledby="succession-room-matrix-title">
      <header><span>Fourteen-room board</span><h3 id="succession-room-matrix-title">Current household and personnel state</h3></header>
      <div>{visibleRooms.map((room) => {
        const prince = princeDossiers.find((record) => record.order === room.order);
        const entity = prince ? entityForName(prince.name) : null;
        return <button type="button" className={`succession-room-card is-${statusTone(room.state)}${selectedOrder === room.order ? ' is-selected' : ''}`} onClick={() => openRoom(room.order)} key={room.order}>
          <span>{String(room.order).padStart(2, '0')}</span><EntityVisual entity={entity} compact /><div><small>{room.room}</small><h4>{room.prince}</h4><p>{room.current}</p></div><b>{room.state}</b>
        </button>;
      })}</div>
    </section>

    {selected && <section className="succession-room-dossier" aria-labelledby="succession-room-dossier-title">
      <header><div><span>Selected assignment</span><h3 id="succession-room-dossier-title">Room {selected.room} · {selected.prince}</h3></div><button type="button" onClick={() => { setSelectedOrder(null); onNavigate('bodyguards'); }}>Close</button></header>
      <dl><div><dt>Queen</dt><dd>{selected.mother}</dd></div><div><dt>State</dt><dd>{selected.state}</dd></div></dl>
      <div><section><span>Original complement</span><p>{selected.original}</p></section><section><span>Deployments and embedded actors</span><p>{selected.deployed}</p></section><section><span>Current operational state</span><p>{selected.current}</p></section></div>
    </section>}

    <section className="succession-transition-ledger" aria-labelledby="succession-transition-title">
      <header><Activity size={18} aria-hidden="true" /><div><span>Movement history</span><h3 id="succession-transition-title">Personnel transitions with consequences</h3></div></header>
      <div>{personnelTransitions.map((transition) => <article key={`${transition.day}-${transition.subject}`}><span>{transition.day} · Ch. {transition.chapters}</span><h4>{transition.subject}</h4><small>{transition.route}</small><p>{transition.change}</p><b>{transition.state}</b></article>)}</div>
    </section>

    <section className="succession-guard-directory" aria-labelledby="succession-guard-directory-title">
      <header><Shield size={18} aria-hidden="true" /><div><span>Canonical people</span><h3 id="succession-guard-directory-title">Named bodyguards and protectors</h3></div></header>
      <div>{namedBodyguards.map((guard) => <button type="button" key={guard.id} onClick={() => onNavigate('bodyguards', { entity: guard.id })}><EntityVisual entity={guard} compact /><span>{guard.name}</span><small>{(guard.affiliations || []).map((item) => item.role).filter(Boolean).slice(0, 2).join(' · ') || 'Bodyguard'}</small></button>)}</div>
    </section>
  </div>;
}

export function GuardianBeastsWorkspace({ routeParams = {}, onNavigate }) {
  const [focus, setFocus] = useState(routeParams.focus || '');
  const selected = guardianBeasts.find((beast) => slugify(beast.host) === focus) || null;

  useEffect(() => setFocus(routeParams.focus || ''), [routeParams.focus]);

  const openBeast = (beast) => {
    const nextFocus = slugify(beast.host);
    setFocus(nextFocus);
    onNavigate('guardian-spirit-beasts', { focus: nextFocus });
  };

  return <div className="succession-beasts-workspace">
    <section className="succession-beasts-workspace__hero"><div><span>Seed Urn system</span><h2>Fifteen parasitic Nen records, one ritual, incomplete rules</h2><p>Each beast reflects its host while operating under shared ritual restrictions. Known mechanics, suspected classifications, and complete unknowns are presented separately.</p></div><dl><div><dt>Royal beasts</dt><dd>{guardianBeasts.length}</dd></div><div><dt>Shared rules</dt><dd>{beastRules.length}</dd></div><div><dt>Unknown Woble beast</dt><dd>1</dd></div></dl></section>

    <section className="succession-beast-rules" aria-labelledby="succession-beast-rules-title"><header><Sparkles size={18} aria-hidden="true" /><div><span>Shared contract</span><h3 id="succession-beast-rules-title">Known ritual constraints</h3></div></header><ol>{beastRules.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol></section>

    <section className="succession-beast-grid" aria-label="Guardian Spirit Beast comparison">
      {guardianBeasts.map((beast) => <button type="button" className={`${slugify(beast.host)}${selected?.host === beast.host ? ' is-selected' : ''}`} onClick={() => openBeast(beast)} key={`${beast.order}-${beast.host}`}>
        <span className="succession-beast-grid__order">{beast.order}</span>
        <span className="succession-beast-grid__image">{beast.image ? <SafeImage src={beast.image} alt={`${beast.host} Guardian Spirit Beast`} fallbackLabel="GSB" /> : <Eye aria-hidden="true" />}</span>
        <div><small>{beast.knowledge}</small><h3>{beast.host}</h3><p>{beast.ability}</p></div>
        <dl><div><dt>Type</dt><dd>{beast.type}</dd></div><div><dt>Condition</dt><dd>{beast.conditions}</dd></div></dl>
      </button>)}
    </section>

    {selected && <section className="succession-beast-dossier"><button type="button" className="succession-deep-back" onClick={() => { setFocus(''); onNavigate('guardian-spirit-beasts'); }}><ArrowLeft size={15} aria-hidden="true" /> All beasts</button><div><span>Host {selected.order}</span><h2>{selected.host} Guardian Spirit Beast</h2><p>{selected.ability}</p></div><dl><div><dt>Knowledge state</dt><dd>{selected.knowledge}</dd></div><div><dt>Nen type</dt><dd>{selected.type}</dd></div><div><dt>Conditions</dt><dd>{selected.conditions}</dd></div></dl><footer><button type="button" onClick={() => { const prince = princeDossiers.find((record) => record.short === selected.host); const entity = prince && entityForName(prince.name); if (prince) onNavigate('princes', entity ? { entity: entity.id } : { prince: prince.order }); }}>Open host dossier <ArrowRight size={14} aria-hidden="true" /></button><a href={selected.source} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a></footer></section>}
  </div>;
}

export function EventsWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(routeParams.focus || '');
  const eligible = useMemo(() => successionOperations.filter((operation) => firstChapter(operation.chapters) <= spoilerLimit), [spoilerLimit]);
  const visible = useMemo(() => eligible.filter((operation) => {
    const matchesStatus = status === 'all' || operation.status === status;
    const matchesQuery = !query.trim() || normalizeText(`${operation.name} ${operation.summary} ${operation.place} ${operation.chapters}`).includes(normalizeText(query.trim()));
    return matchesStatus && matchesQuery;
  }), [eligible, query, status]);
  const selected = eligible.find((operation) => slugify(operation.name) === focus) || null;
  const statuses = [...new Set(eligible.map((operation) => operation.status))];

  useEffect(() => setFocus(routeParams.focus || ''), [routeParams.focus]);

  const openOperation = (operation) => {
    const next = slugify(operation.name);
    setFocus(next);
    onNavigate('events', { focus: next });
  };

  return <div className="succession-events-workspace">
    <section className="succession-events-workspace__hero"><div><span>Operational chronology</span><h2>Murders, investigations, alliances, breaches, and succession operations</h2><p>Events are organized by chapter span, physical location, consequence, and current state instead of appearing as an alphabetical entity list.</p></div><dl><div><dt>Visible at Ch. {spoilerLimit}</dt><dd>{eligible.length}</dd></div><div><dt>Active</dt><dd>{eligible.filter((item) => item.status === 'active').length}</dd></div><div><dt>Resolved</dt><dd>{eligible.filter((item) => item.status === 'resolved').length}</dd></div></dl></section>
    <div className="succession-events-workspace__tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search events</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Operation, location, chapter…" /></label><div>{[['all', 'All'], ...statuses.map((item) => [item, item])].map(([id, label]) => <button type="button" className={status === id ? 'is-active' : ''} onClick={() => setStatus(id)} key={id}>{label}</button>)}</div></div>
    <section className="succession-event-timeline" aria-label="Succession event timeline">{visible.map((operation, index) => <button type="button" className={`is-${operation.status}${selected?.name === operation.name ? ' is-selected' : ''}`} onClick={() => openOperation(operation)} key={operation.name}><span className="succession-event-timeline__index">{String(index + 1).padStart(2, '0')}</span><div><small>Ch. {operation.chapters} · {operation.place}</small><h3>{operation.name}</h3><p>{operation.summary}</p></div><b>{operation.status}</b></button>)}</section>
    {selected && <section className="succession-event-dossier"><header><div><span>Event record</span><h3>{selected.name}</h3></div><button type="button" onClick={() => { setFocus(''); onNavigate('events'); }}>Close</button></header><p>{selected.summary}</p><dl><div><dt>Chapter span</dt><dd>{selected.chapters}</dd></div><div><dt>Location</dt><dd>{selected.place}</dd></div><div><dt>State</dt><dd>{selected.status}</dd></div></dl><footer><button type="button" onClick={() => onNavigate('reader', { chapter: firstChapter(selected.chapters) })}>Read from Chapter {firstChapter(selected.chapters)} <BookOpen size={13} aria-hidden="true" /></button><a href={selected.source} target="_blank" rel="noreferrer noopener">Reference <ExternalLink size={13} aria-hidden="true" /></a></footer></section>}
  </div>;
}

export function BodyStatesWorkspace({ onNavigate }) {
  const deadCharacters = useMemo(() => characterRecords.filter((entity) => entity.status?.life === 'dead'), []);
  return <div className="succession-body-states">
    <section className="succession-body-states__hero"><div><span>Status discipline</span><h2>Death, consciousness, possession, custody, and continuation are not interchangeable</h2><p>The arc repeatedly separates a body’s condition from the state of its consciousness, Nen, legal custody, or Guardian Spirit Beast. This ledger prevents those distinctions from being collapsed.</p></div><dl><div><dt>State categories</dt><dd>{bodyStateLedger.length}</dd></div><div><dt>Confirmed dead records</dt><dd>{deadCharacters.length}</dd></div><div><dt>Exceptional definitions</dt><dd>{exceptionalStatuses.length}</dd></div></dl></section>
    <section className="succession-body-state-ledger" aria-labelledby="succession-body-state-ledger-title"><header><Skull size={19} aria-hidden="true" /><div><span>Body-state ledger</span><h3 id="succession-body-state-ledger-title">How the archive classifies exceptional states</h3></div></header><div>{bodyStateLedger.map((record) => <article className={`is-${record.className}`} key={record.state}><span>{record.state}</span><h4>{record.examples}</h4><p>{record.rule}</p></article>)}</div></section>
    <section className="succession-body-state-legend" aria-labelledby="succession-body-state-legend-title"><header><AlertTriangle size={18} aria-hidden="true" /><div><span>Interpretation rules</span><h3 id="succession-body-state-legend-title">Labels that require extra context</h3></div></header><div>{exceptionalStatuses.map(([label, note]) => <article key={label}><h4>{label}</h4><p>{note}</p></article>)}</div></section>
    <section className="succession-dead-directory" aria-labelledby="succession-dead-directory-title"><header><span>Confirmed canonical records</span><h3 id="succession-dead-directory-title">Characters marked dead in the maintained catalogue</h3></header><div>{deadCharacters.map((entity) => <button type="button" key={entity.id} onClick={() => onNavigate('deaths', { entity: entity.id })}><EntityVisual entity={entity} compact /><span>{entity.name}</span><small>As of Ch. {entity.status?.asOfChapter || 'maintained record'}</small></button>)}</div></section>
  </div>;
}

const relationshipGroupFor = (type) => {
  if (/kinship|parent|twin|blood|mother|sibling/i.test(type)) return 'Family';
  if (/alliance|cooperation|treaty|partnership|collective/i.test(type)) return 'Alliance';
  if (/command|officer|guard|teacher|contract|protection|loyalty/i.test(type)) return 'Duty and command';
  if (/hunt|target|hostile|assassination|captor|rivalry/i.test(type)) return 'Conflict';
  return 'Political and institutional';
};

export function RelationshipsWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const [query, setQuery] = useState(routeParams.search || '');
  const [group, setGroup] = useState('all');
  const [focus, setFocus] = useState(routeParams.focus || '');
  const eligible = useMemo(() => successionRelationships.filter((relationship) => firstChapter(relationship.chapters) <= spoilerLimit), [spoilerLimit]);
  const groups = [...new Set(eligible.map((relationship) => relationshipGroupFor(relationship.type)))];
  const visible = useMemo(() => eligible.filter((relationship) => {
    const matchesGroup = group === 'all' || relationshipGroupFor(relationship.type) === group;
    const matchesFocus = !focus || normalizeText(`${relationship.from} ${relationship.to}`).includes(normalizeText(focus));
    const matchesQuery = !query.trim() || normalizeText(`${relationship.from} ${relationship.to} ${relationship.type} ${relationship.note} ${relationship.state}`).includes(normalizeText(query.trim()));
    return matchesGroup && matchesFocus && matchesQuery;
  }), [eligible, focus, group, query]);
  const frequent = useMemo(() => {
    const counts = new Map();
    eligible.forEach((relationship) => {
      [relationship.from, relationship.to].forEach((name) => counts.set(name, (counts.get(name) || 0) + 1));
    });
    return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 10);
  }, [eligible]);

  return <div className="succession-relationships-workspace">
    <section className="succession-relationships-workspace__hero"><div><span>Typed relationship graph</span><h2>Family, protection, command, alliance, deception, and hostility</h2><p>Every connection preserves its type, chapter range, operational state, and explanatory note. A shared room or organization does not automatically mean loyalty.</p></div><dl><div><dt>Visible links</dt><dd>{eligible.length}</dd></div><div><dt>Relationship groups</dt><dd>{groups.length}</dd></div><div><dt>Current focus</dt><dd>{focus || 'All'}</dd></div></dl></section>
    <section className="succession-relationship-focus" aria-labelledby="succession-relationship-focus-title"><header><Network size={18} aria-hidden="true" /><div><span>High-connectivity nodes</span><h3 id="succession-relationship-focus-title">Focus the graph on a recurring actor</h3></div></header><div><button type="button" className={!focus ? 'is-active' : ''} onClick={() => setFocus('')}>All links</button>{frequent.map(([name, count]) => <button type="button" className={focus === name ? 'is-active' : ''} onClick={() => setFocus(name)} key={name}>{name}<small>{count}</small></button>)}</div></section>
    <div className="succession-relationships-workspace__tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search relationships</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, organization, relationship, chapter…" /></label><div>{[['all', 'All'], ...groups.map((item) => [item, item])].map(([id, label]) => <button type="button" className={group === id ? 'is-active' : ''} onClick={() => setGroup(id)} key={id}>{label}</button>)}</div></div>
    <section className="succession-relationship-ledger" aria-label="Relationship records">{visible.map((relationship) => <article className={`is-${statusTone(relationship.state)}`} key={`${relationship.from}-${relationship.to}-${relationship.type}`}>
      <div className="succession-relationship-ledger__nodes"><EntityNameButton name={relationship.from} onNavigate={onNavigate} /><GitBranch size={18} aria-hidden="true" /><EntityNameButton name={relationship.to} onNavigate={onNavigate} /></div>
      <div><span>{relationship.type}</span><h3>{relationship.from} ↔ {relationship.to}</h3><p>{relationship.note}</p></div>
      <footer><small>{relationship.phase} · Ch. {relationship.chapters}</small><b>{relationship.state}</b></footer>
    </article>)}</section>
  </div>;
}

export function ChapterRecordsWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const requestedNumber = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
  const eligible = useMemo(() => successionChapterResearch.filter((chapter) => chapter.number <= spoilerLimit), [spoilerLimit]);
  const fallbackNumber = eligible.at(-1)?.number || successionChapterResearch[0]?.number;
  const [selectedNumber, setSelectedNumber] = useState(requestedNumber || fallbackNumber);
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState('all');
  const phases = [...new Set(eligible.map((chapter) => chapter.phase))];
  const visible = useMemo(() => eligible.filter((chapter) => {
    const matchesPhase = phase === 'all' || chapter.phase === phase;
    const matchesQuery = !query.trim() || normalizeText(`${chapter.number} ${chapter.title} ${chapter.phase} ${chapter.voyageDay} ${chapter.focus} ${chapter.lanes.join(' ')} ${chapter.locations.join(' ')}`).includes(normalizeText(query.trim()));
    return matchesPhase && matchesQuery;
  }), [eligible, phase, query]);
  const selected = eligible.find((chapter) => chapter.number === selectedNumber) || eligible.at(-1) || null;

  useEffect(() => {
    const next = Number(routeParams.chapter || routeParams.focus || requestedEntity?.number);
    if (next && eligible.some((chapter) => chapter.number === next)) setSelectedNumber(next);
  }, [eligible, requestedEntity?.number, routeParams.chapter, routeParams.focus]);

  if (!selected) return null;
  const selectedIndex = eligible.findIndex((chapter) => chapter.number === selected.number);
  const previous = eligible[selectedIndex - 1];
  const next = eligible[selectedIndex + 1];
  const openChapter = (number) => {
    setSelectedNumber(number);
    onNavigate('chapters', { chapter: number });
  };

  return <div className="succession-chapter-records">
    <section className="succession-chapter-records__hero"><div><span>Research ledger</span><h2>Chapter evidence separated from the image reader</h2><p>Each record connects the chapter’s primary focus, voyage phase, parallel story lanes, chronology, locations, confidence, and direct reading route.</p></div><dl><div><dt>Visible through boundary</dt><dd>{eligible.length}</dd></div><div><dt>Phases</dt><dd>{phases.length}</dd></div><div><dt>Selected</dt><dd>Ch. {selected.number}</dd></div></dl></section>
    <div className="succession-chapter-records__layout">
      <aside className="succession-chapter-index">
        <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search chapter records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chapter, title, lane, location…" /></label>
        <select value={phase} onChange={(event) => setPhase(event.target.value)} aria-label="Filter chapter phase"><option value="all">All phases</option>{phases.map((item) => <option value={item} key={item}>{item}</option>)}</select>
        <div>{visible.map((chapter) => <button type="button" className={chapter.number === selected.number ? 'is-active' : ''} onClick={() => openChapter(chapter.number)} key={chapter.number}><b>{chapter.number}</b><span><strong>{chapter.title}</strong><small>{chapter.phase} · {chapter.voyageDay}</small></span><ArrowRight size={13} aria-hidden="true" /></button>)}</div>
      </aside>
      <article className="succession-chapter-record">
        <header><div><span>{selected.phase} · {selected.voyageDay}</span><h2>Chapter {selected.number}: {selected.title}</h2><p>{selected.focus}</p></div><button type="button" onClick={() => onNavigate('reader', { chapter: selected.number })}>Open reader <BookOpen size={14} aria-hidden="true" /></button></header>
        <section className="succession-chapter-record__lanes"><span>Parallel story lanes</span><div>{selected.lanes.map((lane) => <small key={lane}>{lane}</small>)}</div></section>
        <div className="succession-chapter-record__grid">
          <section><MapPin size={17} aria-hidden="true" /><span>Locations</span>{selected.locations.length ? <ul>{selected.locations.map((location) => <li key={location}>{location}</li>)}</ul> : <p>No local chronology location is attached.</p>}</section>
          <section><Activity size={17} aria-hidden="true" /><span>Chronology events</span>{selected.events.length ? <ul>{selected.events.map((event, index) => <li key={`${event.label || event.title || 'event'}-${index}`}>{event.label || event.title || event.summary || event.note || 'Linked chronology event'}</li>)}</ul> : <p>Study summary available without a separate local event row.</p>}</section>
          <section><Eye size={17} aria-hidden="true" /><span>Evidence confidence</span><p>{selected.confidence.length ? selected.confidence.join(' · ') : 'Primary chapter source'}</p><small>{selected.status}</small></section>
          <section><FileText size={17} aria-hidden="true" /><span>Coverage</span><ul>{Object.entries(selected.coverage).map(([key, value]) => <li key={key}><b>{key}</b><small>{value ? 'Available' : 'Not linked'}</small></li>)}</ul></section>
        </div>
        {!!selected.prelude.length && <section className="succession-chapter-record__prelude"><span>Prelude connections</span><div>{selected.prelude.map((event, index) => <article key={`${event.title || event.label || 'prelude'}-${index}`}><h4>{event.title || event.label || event.chapters}</h4><p>{event.summary || event.note || event.description}</p></article>)}</div></section>}
        <footer><button type="button" disabled={!previous} onClick={() => previous && openChapter(previous.number)}><ArrowLeft size={14} aria-hidden="true" /> {previous ? `Chapter ${previous.number}` : 'First record'}</button><a href={selected.source} target="_blank" rel="noreferrer noopener">Chapter reference <ExternalLink size={13} aria-hidden="true" /></a><button type="button" disabled={!next} onClick={() => next && openChapter(next.number)}>{next ? `Chapter ${next.number}` : 'Latest record'} <ArrowRight size={14} aria-hidden="true" /></button></footer>
      </article>
    </div>
  </div>;
}
