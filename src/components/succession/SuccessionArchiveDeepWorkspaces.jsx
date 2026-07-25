import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Crown,
  GitBranch,
  MapPin,
  Network,
  Search,
  Shield,
  Skull,
  Users,
} from 'lucide-react';
import {
  getCharacterDossier,
  getEntitiesByType,
  getEntityById,
} from '../../data/succession/successionData';
import { EntityVisual, SourceReference } from './SuccessionArchivePrimitives';
import './SuccessionArchiveDeepWorkspaces.css';

const latestChapter = () => getEntitiesByType('chapter').at(-1)?.number || 414;
const normalizeText = (value) => String(value || '').toLocaleLowerCase();
const stateTone = (value = '') => /dead|deceased|ended/i.test(value)
  ? 'dead'
  : /exceptional|occupied|possess|continuation|displaced|unknown/i.test(value)
    ? 'exceptional'
    : /alive|active|living/i.test(value)
      ? 'active'
      : 'neutral';
const queenRankNumber = (queen) => Number.parseInt(queen.queenRank, 10) || 99;
const queenShortName = (queen) => queen.name.replace(/ Hui Guo Rou$/, '');
const childrenForQueen = (queen, characters) => characters.filter((character) => character.royalMother && normalizeText(character.royalMother).includes(normalizeText(queenShortName(queen))));
const uniqueEntities = (entities) => entities.filter(Boolean).filter((entity, index, values) => values.findIndex((candidate) => candidate.id === entity.id) === index);

export function QueensWorkspace({ routeParams = {}, spoilerLimit = latestChapter(), onNavigate }) {
  const characters = useMemo(() => getEntitiesByType('character'), []);
  const queens = useMemo(() => characters
    .filter((character) => (character.roles || []).includes('queen'))
    .sort((left, right) => queenRankNumber(left) - queenRankNumber(right)), [characters]);
  const requested = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const routeSelected = requested?.entityType === 'character' && (requested.roles || []).includes('queen')
    ? requested.id
    : routeParams.focus
      ? queens.find((queen) => normalizeText(queen.name).includes(normalizeText(routeParams.focus)))?.id
      : null;
  const [selectedId, setSelectedId] = useState(routeSelected || null);
  const [query, setQuery] = useState('');
  const [lifeFilter, setLifeFilter] = useState('all');

  useEffect(() => setSelectedId(routeSelected || null), [routeSelected]);

  const records = useMemo(() => queens.map((queen) => {
    const dossier = getCharacterDossier(queen.id, spoilerLimit);
    const children = childrenForQueen(queen, characters);
    return { queen, dossier, children, tone: stateTone(dossier?.state?.life || queen.status?.life) };
  }), [characters, queens, spoilerLimit]);
  const selectedRecord = records.find((record) => record.queen.id === selectedId) || null;
  const visible = useMemo(() => records.filter((record) => {
    const stateMatch = lifeFilter === 'all' || record.tone === lifeFilter;
    const text = normalizeText([
      record.queen.name,
      record.queen.queenRank,
      record.queen.summary,
      record.dossier?.state?.operationalState,
      record.dossier?.roleProfile?.authority,
      ...record.children.map((child) => child.name),
    ].join(' '));
    return stateMatch && (!query.trim() || text.includes(normalizeText(query)));
  }), [lifeFilter, query, records]);
  const counts = useMemo(() => ({
    active: records.filter((record) => record.tone === 'active').length,
    exceptional: records.filter((record) => record.tone === 'exceptional').length,
    deceased: records.filter((record) => record.tone === 'dead').length,
    children: records.reduce((total, record) => total + record.children.length, 0),
  }), [records]);

  const openQueen = (queen) => {
    setSelectedId(queen.id);
    onNavigate('queens', { entity: queen.id });
  };

  if (selectedRecord) {
    const { queen: selected, dossier, children } = selectedRecord;
    const index = records.findIndex((record) => record.queen.id === selected.id);
    const previous = records[index - 1]?.queen;
    const next = records[index + 1]?.queen;
    const relationships = dossier?.relationships?.relationships || [];
    const assignments = dossier?.assignments?.assignments || [];
    const relatedActors = uniqueEntities([
      ...children,
      ...relationships.flatMap((relationship) => [relationship.sourceEntity, relationship.targetEntity]),
    ]).filter((entity) => entity.id !== selected.id);
    const pressure = [...(dossier?.roleProfile?.responsibilities || []), ...(dossier?.roleProfile?.vulnerabilities || [])];
    const sources = dossier?.sources || [];

    return <article className="succession-queen-dossier succession-queen-command-dossier">
      <header className="succession-queen-dossier__toolbar">
        <button type="button" onClick={() => { setSelectedId(null); onNavigate('queens'); }}><ArrowLeft size={15} aria-hidden="true" /> Queen households</button>
        <button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><GitBranch size={15} aria-hidden="true" /> Royal hierarchy</button>
      </header>

      <section className="succession-queen-intelligence-hero" aria-labelledby="succession-queen-dossier-title">
        <div className="succession-queen-intelligence-hero__rank"><span>{String(queenRankNumber(selected)).padStart(2, '0')}</span><small>Queen rank</small></div>
        <div className="succession-queen-intelligence-hero__portrait"><EntityVisual entity={selected} /></div>
        <div className="succession-queen-intelligence-hero__copy">
          <span>{dossier?.state?.life || selected.status?.life || 'State unresolved'} · Chapter {spoilerLimit}</span>
          <h2 id="succession-queen-dossier-title">{selected.name}</h2>
          <p>{dossier?.state?.operationalState || selected.summary}</p>
          <div><small><MapPin size={13} aria-hidden="true" /> {dossier?.location?.name || 'Location unresolved'}</small><small><Crown size={13} aria-hidden="true" /> {children.length} connected prince{children.length === 1 ? '' : 's'}</small></div>
        </div>
      </section>

      <dl className="succession-queen-command-metrics">
        <div><dt>Royal children</dt><dd>{children.length}</dd></div>
        <div><dt>Assignments</dt><dd>{assignments.length}</dd></div>
        <div><dt>Relationships</dt><dd>{relationships.length}</dd></div>
        <div><dt>Pressure records</dt><dd>{pressure.length}</dd></div>
      </dl>

      <nav className="succession-queen-dossier-nav" aria-label="Queen dossier sections">
        <a href="#queen-authority">Authority</a><a href="#queen-branch">Branch</a><a href="#queen-network">Network</a><a href="#queen-evidence">Evidence</a>
      </nav>

      <section className="succession-queen-authority-board" id="queen-authority">
        <div><span>Household authority</span><h3>{dossier?.roleProfile?.label || 'Royal household authority'}</h3><p>{dossier?.roleProfile?.authority || selected.summary}</p></div>
        <dl><div><dt>Life</dt><dd>{dossier?.state?.life || 'Unknown'}</dd></div><div><dt>Body</dt><dd>{dossier?.state?.bodyState || 'Unresolved'}</dd></div><div><dt>Protection</dt><dd>{dossier?.state?.protectionState || 'Unresolved'}</dd></div><div><dt>Threat</dt><dd>{dossier?.state?.threatLevel || 'Unrated'}</dd></div></dl>
      </section>

      <div className="succession-queen-dossier__columns">
        <section><header><Shield size={17} aria-hidden="true" /><div><span>Mandate</span><h3>Responsibilities and constraints</h3></div></header>{pressure.length ? <ol>{pressure.map((item, itemIndex) => <li key={`${item}-${itemIndex}`}>{item}</li>)}</ol> : <p>No structured household pressure is published at this boundary.</p>}</section>
        <section><header><Activity size={17} aria-hidden="true" /><div><span>Current state</span><h3>Operational and allegiance posture</h3></div></header><p>{dossier?.state?.allegianceState || 'No separate allegiance state is published.'}</p><p>{dossier?.state?.consciousnessState || 'No exceptional consciousness state is recorded.'}</p></section>
      </div>

      <section className="succession-queen-dossier__children" id="queen-branch" aria-labelledby="succession-queen-children-title">
        <header><Crown size={18} aria-hidden="true" /><div><span>Maternal branch</span><h3 id="succession-queen-children-title">Connected princes in succession order</h3></div></header>
        <div>{children.map((entity) => <button type="button" key={entity.id} onClick={() => onNavigate((entity.roles || []).includes('prince') ? 'princes' : 'characters', { entity: entity.id })}><EntityVisual entity={entity} compact /><span><b>{entity.princeOrder ? `${entity.princeOrder}. ` : ''}{entity.name}</b><small>{(entity.roles || []).join(' · ')}</small></span><ArrowRight size={14} aria-hidden="true" /></button>)}</div>
        {!children.length && <p>No prince is linked to this maternal branch in the canonical graph.</p>}
      </section>

      <section className="succession-queen-network" id="queen-network" aria-labelledby="succession-queen-network-title">
        <header><Network size={18} aria-hidden="true" /><div><span>Household network</span><h3 id="succession-queen-network-title">Relationships, placements, and reporting lines</h3></div></header>
        <div>{relatedActors.slice(0, 18).map((entity) => <button type="button" key={entity.id} onClick={() => onNavigate((entity.roles || []).includes('prince') ? 'princes' : (entity.roles || []).includes('queen') ? 'queens' : 'characters', { entity: entity.id })}><EntityVisual entity={entity} compact /><span><b>{entity.name}</b><small>{(entity.roles || []).slice(0, 3).join(' · ') || entity.entityType}</small></span></button>)}</div>
        {!!assignments.length && <footer><Shield size={15} aria-hidden="true" /><span>{assignments.length} active assignment record{assignments.length === 1 ? '' : 's'} intersect this household at Chapter {spoilerLimit}.</span></footer>}
      </section>

      <section className="succession-queen-evidence" id="queen-evidence" aria-labelledby="succession-queen-evidence-title">
        <header><BookOpen size={18} aria-hidden="true" /><div><span>Evidence ledger</span><h3 id="succession-queen-evidence-title">Sources supporting identity, state, branch, and operations</h3></div></header>
        {sources.length ? sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />) : <p>The complete evidence list remains available through the connected character intelligence dossier.</p>}
        <button type="button" onClick={() => onNavigate('characters', { entity: selected.id })}>Open complete character chronology <ArrowRight size={14} aria-hidden="true" /></button>
      </section>

      <footer className="succession-queen-dossier__pager">
        <button type="button" onClick={() => previous && openQueen(previous)} disabled={!previous}><ArrowLeft size={14} aria-hidden="true" /> {previous ? `${previous.queenRank}. ${queenShortName(previous)}` : 'First queen'}</button>
        <button type="button" onClick={() => next && openQueen(next)} disabled={!next}>{next ? `${next.queenRank}. ${queenShortName(next)}` : 'Last queen'} <ArrowRight size={14} aria-hidden="true" /></button>
      </footer>
    </article>;
  }

  return <section className="succession-queen-board succession-queen-command" aria-labelledby="succession-queen-board-title">
    <section className="succession-queen-command__hero">
      <div><span><Crown size={15} aria-hidden="true" /> Maternal power command</span><h2 id="succession-queen-board-title">Eight households shape fourteen claims to the throne</h2><p>Queen rank is only the visible hierarchy. Each record combines maternal branch, current state, household authority, prince connections, assignments, relationships, pressure, and chapter boundary.</p><button type="button" onClick={() => onNavigate('princes', { view: 'tree' })}><GitBranch size={15} aria-hidden="true" /> Open interactive royal hierarchy</button></div>
      <div className="succession-queen-branch-sigil" aria-hidden="true"><Crown size={40} /><span>8</span><small>maternal branches</small></div>
    </section>

    <dl className="succession-queen-status-strip"><div><dt>Queens</dt><dd>{records.length}</dd></div><div><dt>Active</dt><dd>{counts.active}</dd></div><div><dt>Exceptional</dt><dd>{counts.exceptional}</dd></div><div><dt>Deceased</dt><dd>{counts.deceased}</dd></div><div><dt>Linked princes</dt><dd>{counts.children}</dd></div></dl>

    <section className="succession-queen-command__filters" aria-label="Queen household filters">
      <label><Search size={16} aria-hidden="true" /><span className="sr-only">Search queen households</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Queen, prince, authority, pressure…" /></label>
      <div>{[['all', 'All households'], ['active', 'Active'], ['exceptional', 'Exceptional'], ['dead', 'Deceased']].map(([id, text]) => <button type="button" className={lifeFilter === id ? 'is-active' : ''} aria-pressed={lifeFilter === id} onClick={() => setLifeFilter(id)} key={id}>{text}</button>)}</div>
      <span role="status" aria-live="polite">{visible.length} of {records.length} households visible</span>
    </section>

    <div className="succession-queen-command__grid">{visible.map(({ queen, dossier, children, tone }) => {
      const pressureCount = (dossier?.roleProfile?.responsibilities?.length || 0) + (dossier?.roleProfile?.vulnerabilities?.length || 0);
      return <button type="button" className={`succession-queen-card is-${tone}`} key={queen.id} onClick={() => openQueen(queen)}>
        <span className="succession-queen-card__rank">{String(queenRankNumber(queen)).padStart(2, '0')}</span>
        <EntityVisual entity={queen} />
        <div className="succession-queen-card__copy"><span>{dossier?.state?.life || queen.status?.life || 'State unresolved'}</span><h3>{queen.name}</h3><p>{dossier?.state?.operationalState || queen.summary}</p></div>
        <dl><div><dt>Princes</dt><dd>{children.length}</dd></div><div><dt>Assignments</dt><dd>{dossier?.assignments?.assignments.length || 0}</dd></div><div><dt>Relationships</dt><dd>{dossier?.relationships?.relationships.length || 0}</dd></div><div><dt>Pressure</dt><dd>{pressureCount}</dd></div></dl>
        <footer><span>{dossier?.location?.name || 'Location unresolved'}</span><b>Open household dossier <ArrowRight size={14} aria-hidden="true" /></b></footer>
      </button>;
    })}</div>
    {!visible.length && <div className="succession-queen-command__empty"><Users size={24} aria-hidden="true" /><h3>No matching queen households</h3><p>Clear the search or restore all life states.</p><button type="button" onClick={() => { setQuery(''); setLifeFilter('all'); }}>Reset household query</button></div>}
  </section>;
}

export function BodyStatesWorkspace({ spoilerLimit = latestChapter(), onNavigate }) {
  const characters = useMemo(() => getEntitiesByType('character'), []);
  const dossiers = useMemo(() => characters.map((character) => getCharacterDossier(character.id, spoilerLimit)).filter(Boolean), [characters, spoilerLimit]);
  const exceptional = dossiers.filter((dossier) => /dead|unknown|possess|displaced|continuation|deceased|occupied/i.test(`${dossier.state?.life} ${dossier.state?.bodyState} ${dossier.state?.consciousnessState}`));
  const confirmedDead = dossiers.filter((dossier) => dossier.state?.life === 'dead');
  const bodyStates = [...new Map(exceptional.map((dossier) => [dossier.state?.bodyState, dossier])).values()];
  const consciousnessStates = [...new Map(exceptional.map((dossier) => [dossier.state?.consciousnessState, dossier])).values()];

  return <div className="succession-body-states">
    <section className="succession-body-states__hero"><div><span>Status discipline</span><h2>Death, body, consciousness, possession, and Nen continuation remain separate</h2><p>This route now reads directly from every chapter-bounded character dossier. It does not infer that a dead body, displaced consciousness, legal identity, and continuing Nen are the same state.</p></div><dl><div><dt>Exceptional records</dt><dd>{exceptional.length}</dd></div><div><dt>Confirmed dead</dt><dd>{confirmedDead.length}</dd></div><div><dt>Boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl></section>
    <section className="succession-body-state-ledger" aria-labelledby="succession-body-state-ledger-title"><header><Skull size={19} aria-hidden="true" /><div><span>Body-state ledger</span><h3 id="succession-body-state-ledger-title">Distinct body conditions in the canonical state graph</h3></div></header><div>{bodyStates.map((dossier) => <article className={`is-${stateTone(dossier.state?.bodyState)}`} key={`${dossier.character.id}-${dossier.state?.bodyState}`}><span>{dossier.state?.bodyState}</span><h4>{dossier.character.name}</h4><p>{dossier.state?.operationalState}</p></article>)}</div></section>
    <section className="succession-body-state-legend" aria-labelledby="succession-body-state-legend-title"><header><AlertTriangle size={18} aria-hidden="true" /><div><span>Consciousness distinctions</span><h3 id="succession-body-state-legend-title">Identity and continuation states requiring context</h3></div></header><div>{consciousnessStates.map((dossier) => <article key={`${dossier.character.id}-${dossier.state?.consciousnessState}`}><h4>{dossier.character.name}</h4><p>{dossier.state?.consciousnessState}</p></article>)}</div></section>
    <section className="succession-dead-directory" aria-labelledby="succession-dead-directory-title"><header><span>Confirmed canonical records</span><h3 id="succession-dead-directory-title">Characters known dead at Chapter {spoilerLimit}</h3></header><div>{confirmedDead.map((dossier) => <button type="button" key={dossier.character.id} onClick={() => onNavigate('characters', { entity: dossier.character.id })}><EntityVisual entity={dossier.character} compact /><span>{dossier.character.name}</span><small>{dossier.state?.bodyState}</small></button>)}</div></section>
  </div>;
}
