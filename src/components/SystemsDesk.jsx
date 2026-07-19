import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, Boxes, ExternalLink, Filter, GitBranch, Landmark,
  Network, Search, Shield, Swords, Waypoints,
} from 'lucide-react';
import { encyclopediaRecords, findEncyclopediaRecord } from '../data/encyclopedia';
import {
  institutionCharts, institutionalRelationships, objectTrails, relationTypes,
  systemsDeskStats,
} from '../data/systemsDesk';
import HorizontalScrollHint from './HorizontalScrollHint';

const views = [
  ['institutions', 'Institutions', Landmark],
  ['relations', 'Power relations', Network],
  ['conflicts', 'Conflict anatomy', Swords],
  ['objects', 'Object trails', Waypoints],
];

const eraLabels = {
  'series-wide': 'Series-wide', 'hunter-exam': 'Hunter Exam', family: 'Family', yorknew: 'Yorknew',
  underworld: 'Underworld', 'greed-island': 'Greed Island', 'chimera-ant': 'Chimera Ant',
  election: 'Election', succession: 'Succession / expedition',
};

const relationLabel = Object.fromEntries(relationTypes);
const normalize = (value) => String(value || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const fact = (record, ...labels) => record?.facts.find((item) => labels.some((label) => normalize(item.label) === normalize(label)))?.value || '';

const conflictMode = (record) => {
  const text = normalize(`${record.kind} ${record.name}`);
  if (/game|contest|trial|test|training|election/.test(text)) return 'rules';
  if (/assassin|murder|operation|pursuit|infiltration|escape|capture/.test(text)) return 'operation';
  if (/negotiation|hostage|political|information|interrogation/.test(text)) return 'strategy';
  return 'battle';
};

const conflictModes = [
  ['all', 'All forms'], ['battle', 'Physical battles'], ['operation', 'Operations'],
  ['strategy', 'Negotiation / information'], ['rules', 'Games / tests'],
];

function ConnectedButton({ term, onOpenRecord, children }) {
  const open = () => {
    const match = findEncyclopediaRecord(term);
    onOpenRecord?.(match?.category || 'factions', match?.id || '', match ? '' : term);
  };
  return <button type="button" onClick={open}>{children || term}<ArrowRight size={12} /></button>;
}

function InstitutionView({ onOpenRecord }) {
  const [era, setEra] = useState('all');
  const [selectedId, setSelectedId] = useState(institutionCharts[0].id);
  const visible = institutionCharts.filter((chart) => era === 'all' || chart.era === era);
  const selected = institutionCharts.find((chart) => chart.id === selectedId && visible.some((item) => item.id === chart.id)) || visible[0];
  const eras = [...new Set(institutionCharts.map((chart) => chart.era))];

  useEffect(() => {
    if (!visible.some((chart) => chart.id === selectedId)) setSelectedId(visible[0]?.id || '');
  }, [era]);

  if (!selected) return null;
  return <div className="systems-institutions">
    <aside className="systems-index-rail">
      <header><span>Eight readable charts</span><h3>Choose a power structure</h3></header>
      <label><Filter size={14} /><span className="sr-only">Filter organization charts by story period</span><select value={era} onChange={(event) => setEra(event.target.value)}><option value="all">All story periods</option>{eras.map((item) => <option value={item} key={item}>{eraLabels[item] || item}</option>)}</select></label>
      <nav>{visible.map((chart) => <button type="button" className={chart.id === selected.id ? 'is-active' : ''} onClick={() => setSelectedId(chart.id)} key={chart.id}><small>{eraLabels[chart.era] || chart.era}</small><strong>{chart.name}</strong><span>{chart.scope}</span></button>)}</nav>
    </aside>

    <article className="systems-org-workspace">
      <header className="systems-org-workspace__intro"><div><span>{selected.scope}</span><h3>{selected.name}</h3><p>{selected.summary}</p></div><a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={12} /></a></header>
      <div className="systems-org-scroll" aria-label={`${selected.name} organization chart`}>
        <div className="systems-org-chart">
          <ConnectedButton term={selected.root.name} onOpenRecord={onOpenRecord}><span><small>Root authority</small><strong>{selected.root.name}</strong><em>{selected.root.role}</em></span></ConnectedButton>
          {selected.levels.map((level) => <section className="systems-org-chart__level" key={level.label}><header>{level.label}</header><div className="systems-org-chart__nodes" style={{ '--connector-inset': `${50 / level.nodes.length}%`, '--chart-columns': level.nodes.length }}>{level.nodes.map((item) => <ConnectedButton term={item.name} onOpenRecord={onOpenRecord} key={item.name}><span><strong>{item.name}</strong><em>{item.role}</em></span></ConnectedButton>)}</div></section>)}
        </div>
      </div>
      <footer className="systems-org-workspace__status"><Shield size={16} /><div><span>Maintained status</span><strong>{selected.status}</strong></div><p>Connector lines show the study hierarchy used here. They do not imply that every lower node reports directly to every node above it.</p></footer>
    </article>

    <aside className="systems-source-inspector">
      <span>Chart reading rule</span><h3>Authority is not the same as loyalty.</h3>
      <p>Hunter × Hunter repeatedly separates legal command, personal allegiance, contracts, biological hierarchy, political sponsorship, and temporary cooperation. Open the relationship view for those distinctions.</p>
      <ConnectedButton term={selected.name} onOpenRecord={onOpenRecord}>Open encyclopedia record</ConnectedButton>
    </aside>
  </div>;
}

function RelationsView({ onOpenRecord }) {
  const [type, setType] = useState('all');
  const [era, setEra] = useState('all');
  const [query, setQuery] = useState('');
  const eras = [...new Set(institutionalRelationships.map((item) => item.era))];
  const visible = useMemo(() => {
    const needle = normalize(query);
    return institutionalRelationships.filter((item) => (type === 'all' || item.type === type) && (era === 'all' || item.era === era) && (!needle || normalize(`${item.from} ${item.to} ${item.note} ${item.chapters}`).includes(needle)));
  }, [era, query, type]);

  return <div className="systems-relations">
    <header className="systems-view-intro"><div><span>Directional, typed and time-sensitive</span><h3>Who commands, sponsors, hires, contains—or hunts—whom?</h3></div><p>A line is never presented as generic “connection.” Its label states the relationship being claimed, while the era and state show when that claim applies.</p></header>
    <div className="systems-filterbar">
      <label className="systems-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Person, faction, contract, rivalry…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label>
      <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Relationship type"><option value="all">All relationship types</option>{relationTypes.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select>
      <select value={era} onChange={(event) => setEra(event.target.value)} aria-label="Story period"><option value="all">All story periods</option>{eras.map((item) => <option value={item} key={item}>{eraLabels[item] || item}</option>)}</select>
      <span role="status">{visible.length} relations</span>
    </div>
    <div className="systems-relation-legend">{relationTypes.map(([id, label]) => <button type="button" className={type === id ? 'is-active' : ''} onClick={() => setType(type === id ? 'all' : id)} key={id}><i data-relation={id} />{label}</button>)}</div>
    <div className="systems-relation-list">{visible.map((item) => <article data-relation={item.type} key={item.id}>
      <ConnectedButton term={item.from} onOpenRecord={onOpenRecord}>{item.from}</ConnectedButton>
      <div className="systems-relation-link"><span>{relationLabel[item.type]}</span><i><ArrowRight size={15} /></i><small>{item.state}</small></div>
      <ConnectedButton term={item.to} onOpenRecord={onOpenRecord}>{item.to}</ConnectedButton>
      <div className="systems-relation-note"><span>{eraLabels[item.era] || item.era} · {item.chapters}</span><p>{item.note}</p><a href={item.source} target="_blank" rel="noreferrer" aria-label={`Hunterpedia source for ${item.from} and ${item.to}`}><ExternalLink size={12} /> Source</a></div>
    </article>)}</div>
    {!visible.length && <div className="empty-state"><h3>No matching relationship</h3><p>Clear one of the filters or use a broader name.</p></div>}
  </div>;
}

function ConflictsView({ onOpenRecord, initialQuery = '' }) {
  const conflicts = useMemo(() => encyclopediaRecords.filter((item) => item.category === 'conflicts'), []);
  const [query, setQuery] = useState(initialQuery);
  const [mode, setMode] = useState('all');
  const visible = useMemo(() => {
    const needle = normalize(query);
    return conflicts.filter((item) => (mode === 'all' || conflictMode(item) === mode) && (!needle || normalize(`${item.name} ${item.kind} ${item.summary} ${item.tags.join(' ')} ${item.facts.map((row) => row.value).join(' ')}`).includes(needle)));
  }, [conflicts, mode, query]);
  const [selectedId, setSelectedId] = useState(conflicts[0]?.id || '');
  const selected = conflicts.find((item) => item.id === selectedId && visible.some((record) => record.id === item.id)) || visible[0];

  useEffect(() => {
    if (visible.length && !visible.some((item) => item.id === selectedId)) setSelectedId(visible[0].id);
  }, [mode, query]);

  const anatomy = selected ? [
    ['01', 'Objective', fact(selected, 'Objective') || selected.summary],
    ['02', 'Field', [fact(selected, 'Participants'), fact(selected, 'Location'), fact(selected, 'Chapters')].filter(Boolean).join(' · ') || 'Setting remains on the linked Hunterpedia record.'],
    ['03', 'Methods', fact(selected, 'Abilities') || fact(selected, 'Scope') || 'Methods are not yet locally expanded for this operation.'],
    ['04', 'Turning point', fact(selected, 'Turning point') || 'A distinct turning point is not yet locally isolated.'],
    ['05', 'Outcome', fact(selected, 'Outcome') || fact(selected, 'Status') || 'Outcome remains developing in the current record.'],
    ['06', 'Consequence', fact(selected, 'Consequence') || 'Downstream consequences remain on the connected chapter and arc records.'],
  ] : [];

  return <div className="systems-conflicts">
    <header className="systems-view-intro"><div><span>More than a fight list</span><h3>Conflict anatomy</h3></div><p>Physical battles, assassinations, trials, games, negotiations, pursuits, and information wars share one six-part reading structure without pretending they work the same way.</p></header>
    <div className="systems-filterbar systems-filterbar--conflicts">
      <label className="systems-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Fight, operation, participant, ability…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label>
      <nav>{conflictModes.map(([id, label]) => <button type="button" className={mode === id ? 'is-active' : ''} onClick={() => setMode(id)} key={id}>{label}</button>)}</nav>
      <span role="status">{visible.length} records</span>
    </div>
    <div className="systems-conflict-workspace">
      <aside className="systems-conflict-index">{visible.map((item) => <button type="button" className={selected?.id === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><i data-mode={conflictMode(item)} /><span><small>{item.kind}</small><strong>{item.name}</strong><em>{fact(item, 'Arc') || fact(item, 'Chapters') || item.researchLevel}</em></span></button>)}</aside>
      {selected ? <article className="systems-conflict-detail">
        <header><div><span>{selected.kind} · {selected.researchLevel}</span><h3>{selected.name}</h3><p>{selected.summary}</p></div><a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={12} /></a></header>
        <ol className="systems-conflict-anatomy">{anatomy.map(([number, label, value]) => <li key={label}><i>{number}</i><span><small>{label}</small><p>{value}</p></span></li>)}</ol>
        <div className="systems-conflict-related"><b>Connected records</b>{selected.related.map((item) => <ConnectedButton term={item} onOpenRecord={onOpenRecord} key={item}>{item}</ConnectedButton>)}</div>
        <ConnectedButton term={selected.name} onOpenRecord={onOpenRecord}>Open complete encyclopedia record</ConnectedButton>
      </article> : <div className="empty-state"><h3>No conflict selected</h3><p>Clear the current filter.</p></div>}
    </div>
  </div>;
}

function ObjectTrailsView({ onOpenRecord }) {
  const [selectedId, setSelectedId] = useState(objectTrails[0].id);
  const [query, setQuery] = useState('');
  const visible = objectTrails.filter((item) => !normalize(query) || normalize(`${item.name} ${item.kind} ${item.summary} ${item.stages.flat().join(' ')}`).includes(normalize(query)));
  const selected = objectTrails.find((item) => item.id === selectedId && visible.some((record) => record.id === item.id)) || visible[0];

  useEffect(() => {
    if (visible.length && !visible.some((item) => item.id === selectedId)) setSelectedId(visible[0].id);
  }, [query]);

  return <div className="systems-objects">
    <header className="systems-view-intro"><div><span>Custody, use and consequence</span><h3>Objects move through the story.</h3></div><p>These diagrams track meaningful state changes—who creates, owns, carries, uses, studies, transfers, or is affected by an object. They are study trails, not claims of literal legal ownership at every step.</p></header>
    <div className="systems-object-workspace">
      <aside className="systems-object-index"><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Object, user, location, effect…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label><nav>{visible.map((item) => <button type="button" className={selected?.id === item.id ? 'is-active' : ''} onClick={() => setSelectedId(item.id)} key={item.id}><small>{item.kind}</small><strong>{item.name}</strong><span>{item.stages.length} trail stages</span></button>)}</nav></aside>
      {selected ? <article className="systems-object-detail">
        <header><div><span>{selected.kind}</span><h3>{selected.name}</h3><p>{selected.summary}</p></div><a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={12} /></a></header>
        <div className="systems-object-detail__body without-image">
          <div className="systems-object-status"><span>Current recorded state</span><strong>{selected.status}</strong></div>
          <ol className="systems-object-trail">{selected.stages.map(([name, note], index) => <li key={`${selected.id}-${name}`}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{name}</strong><p>{note}</p></span>{index < selected.stages.length - 1 && <ArrowRight size={15} />}</li>)}</ol>
        </div>
        <ConnectedButton term={selected.name} onOpenRecord={onOpenRecord}>Open object encyclopedia record</ConnectedButton>
      </article> : <div className="empty-state"><h3>No matching object trail</h3><p>Clear the search filter.</p></div>}
    </div>
  </div>;
}

export default function SystemsDesk({ initialView = 'institutions', initialQuery = '', onOpenRecord }) {
  const validInitial = views.some(([id]) => id === initialView) ? initialView : 'institutions';
  const [view, setView] = useState(validInitial);

  useEffect(() => {
    if (views.some(([id]) => id === initialView)) setView(initialView);
  }, [initialView]);

  return <section className="systems-desk" id="systems-desk">
    <div className="section-heading systems-desk__heading"><div><span className="section-kicker">How power is organized</span><h2>Authority, loyalty and conflict—drawn as systems.</h2></div><p>Individual records live in the encyclopedia. These views reveal the structure between them: leadership, membership, sponsorship, rivalry, operations, and the path of consequential objects.</p></div>
    <div className="systems-desk__metrics">
      <div><Landmark size={17} /><strong>{systemsDeskStats.charts}</strong><span>organization charts</span></div>
      <div><Boxes size={17} /><strong>{systemsDeskStats.chartNodes}</strong><span>charted nodes</span></div>
      <div><GitBranch size={17} /><strong>{systemsDeskStats.relations}</strong><span>typed relations</span></div>
      <div><Waypoints size={17} /><strong>{systemsDeskStats.trails}</strong><span>object trails</span></div>
    </div>
    <nav className="systems-desk__views" aria-label="Systems desk views">{views.map(([id, label, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)} key={id}><Icon size={15} />{label}</button>)}</nav>
    <HorizontalScrollHint>Wide organization charts and relationship ledgers scroll sideways on smaller screens. Select a node for its readable encyclopedia record.</HorizontalScrollHint>
    {view === 'institutions' && <InstitutionView onOpenRecord={onOpenRecord} />}
    {view === 'relations' && <RelationsView onOpenRecord={onOpenRecord} />}
    {view === 'conflicts' && <ConflictsView onOpenRecord={onOpenRecord} initialQuery={initialQuery} />}
    {view === 'objects' && <ObjectTrailsView onOpenRecord={onOpenRecord} />}
  </section>;
}
