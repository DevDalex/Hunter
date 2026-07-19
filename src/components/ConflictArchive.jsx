import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Filter, MapPin, Search, ShieldAlert, Swords, Target, UsersRound } from 'lucide-react';
import { encyclopediaRecords } from '../data/encyclopedia';

const conflictRecords = encyclopediaRecords.filter((item) => item.category === 'conflicts');
const factLike = (record, pattern) => record?.facts?.find((item) => pattern.test(item.label))?.value || '';

const majorNames = new Set([
  'Gon vs. Hisoka', 'Kurapika vs. Uvogin', 'Chrollo vs. Zeno and Silva', 'Razor’s dodgeball game',
  'Gon vs. Genthru', 'Netero vs. Meruem', 'Gon vs. Neferpitou', 'Palace invasion operation',
  'Chrollo vs. Hisoka', '13th Chairman Election', 'Room 3101 breach', 'Borksen recruitment game',
]);

const classify = (record) => {
  const text = `${record.name} ${record.kind}`.toLowerCase();
  if (/game|election|negotiation|hostage|information|test|lesson/.test(text)) return 'strategy';
  if (/operation|pursuit|invasion|breach|escape|assassination|murder|campaign|war/.test(text)) return 'operation';
  return 'battle';
};

const filters = [
  ['all', 'All conflicts'], ['major', 'Major dossiers'], ['battle', 'Battles & duels'],
  ['operation', 'Operations'], ['strategy', 'Games & strategy'],
];

const phaseRows = (record) => [
  ['Objective', factLike(record, /objective|goal/i) || record.summary],
  ['Tools & abilities', factLike(record, /abilities|nen|tools/i) || 'Open the linked character and Nen records for confirmed mechanics.'],
  ['Turning point', factLike(record, /turning/i) || 'No separate turning-point field is maintained for this index record.'],
  ['Outcome', factLike(record, /outcome|result/i) || factLike(record, /status/i) || 'Outcome remains part of the source record.'],
  ['Consequence', factLike(record, /consequence|aftermath/i) || 'Follow connected records for the wider story consequence.'],
];

export default function ConflictArchive({ initialQuery = '', onOpenEntity, onOpenHisokaDossier }) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(conflictRecords.find((item) => item.name === 'Kurapika vs. Uvogin')?.id || conflictRecords[0]?.id);
  const [view, setView] = useState('workbench');
  const visible = useMemo(() => conflictRecords.filter((record) => {
    const type = classify(record);
    const matchesFilter = filter === 'all' || filter === type || (filter === 'major' && majorNames.has(record.name));
    const haystack = `${record.name} ${record.kind} ${record.summary} ${record.facts.map((item) => item.value).join(' ')} ${record.related.join(' ')}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [filter, query]);
  const selected = visible.find((item) => item.id === selectedId) || visible[0] || null;
  const participantText = factLike(selected, /participants/i);
  const participants = participantText.split(/[;,·]/).map((item) => item.trim()).filter(Boolean);
  const chapters = factLike(selected, /chapters|chapter scope/i) || selected?.tags?.find((item) => /\d/.test(item)) || 'Source-defined range';
  const location = factLike(selected, /location|place/i) || selected?.related?.find((item) => /room|arena|palace|island|city|tier/i.test(item)) || 'Open linked location record';

  return <section className="conflict-archive" id="conflict-archive">
    <header className="conflict-archive__masthead">
      <div><span className="section-kicker">Fights and conflicts</span><h2>What each side wanted—and what changed.</h2><p>The archive separates formal fights, group operations, assassinations, pursuits, games, negotiations, and information wars. Every record tracks objective, tools, turning point, result, and consequence where the local source record supports them.</p></div>
      <dl><div><dt>Indexed conflicts</dt><dd>{conflictRecords.length}</dd></div><div><dt>Major dossiers</dt><dd>{majorNames.size}</dd></div><div><dt>Conflict forms</dt><dd>3</dd></div><div><dt>Featured reconstruction</dt><dd>Ch. 351–357</dd></div></dl>
    </header>

    <div className="conflict-archive__featured"><div><span>Full visual reconstruction</span><h3>Hisoka vs. Chrollo</h3><p>Arena position, information states, borrowed abilities, puppet rules, explosions, body damage, revival, and the Troupe aftermath.</p></div><button type="button" onClick={onOpenHisokaDossier}>Open the complete dossier <ArrowRight size={15} /></button></div>

    <div className="conflict-archive__toolbar">
      <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Participant, fight, ability, arc, room…" /></label>
      <div><Filter size={14} />{filters.map(([id, label]) => <button type="button" className={filter === id ? 'is-active' : ''} onClick={() => setFilter(id)} key={id}>{label}</button>)}</div>
      <nav aria-label="Conflict archive layout"><button className={view === 'workbench' ? 'is-active' : ''} onClick={() => setView('workbench')}>Dossier view</button><button className={view === 'matrix' ? 'is-active' : ''} onClick={() => setView('matrix')}>Comparison matrix</button></nav>
    </div>

    {view === 'workbench' && <div className="conflict-workbench">
      <aside className="conflict-index" aria-label="Conflict records"><header><span>{visible.length} matching records</span><strong>Select a confrontation</strong></header>{visible.map((record) => <button type="button" className={selected?.id === record.id ? 'is-active' : ''} onClick={() => setSelectedId(record.id)} key={record.id}><i data-type={classify(record)}>{classify(record).slice(0, 1).toUpperCase()}</i><span><small>{record.kind}</small><strong>{record.name}</strong><em>{factLike(record, /arc/i) || record.tags[0] || record.researchLevel}</em></span><ArrowRight size={13} /></button>)}{!visible.length && <div className="conflict-index__empty"><strong>No matching conflict</strong><p>Clear the search or choose another conflict form.</p></div>}</aside>

      {selected && <article className="conflict-dossier">
        <header><div><span>{selected.kind} · {selected.researchLevel}</span><h2>{selected.name}</h2><p>{selected.summary}</p></div><a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia source <ExternalLink size={12} /></a></header>
        <div className="conflict-dossier__facts"><div><Swords size={17} /><span><small>Participants</small><strong>{participantText || selected.related.slice(0, 4).join(' · ') || 'See source'}</strong></span></div><div><MapPin size={17} /><span><small>Location</small><strong>{location}</strong></span></div><div><Target size={17} /><span><small>Manga range</small><strong>{chapters}</strong></span></div></div>
        <ol className="conflict-anatomy">{phaseRows(selected).map(([label, detail], index) => <li key={label}><i>{String(index + 1).padStart(2, '0')}</i><span><small>{label}</small><p>{detail}</p></span></li>)}</ol>
        <section className="conflict-dossier__people"><header><UsersRound size={17} /><span><small>Connected people and systems</small><strong>Open another side of this conflict</strong></span></header><div>{[...new Set([...participants, ...selected.related])].slice(0, 14).map((item) => <button type="button" onClick={() => onOpenEntity?.(item)} key={item}>{item}</button>)}</div></section>
        <footer><ShieldAlert size={16} /><p><b>Evidence rule.</b> Missing phase details remain written as missing. The archive does not manufacture choreography from an arc-level summary.</p></footer>
      </article>}
    </div>}

    {view === 'matrix' && <div className="conflict-matrix"><table><thead><tr><th>Conflict</th><th>Form</th><th>Participants</th><th>Chapters</th><th>Turning point</th><th>Outcome</th></tr></thead><tbody>{visible.map((record) => <tr key={record.id}><th><button type="button" onClick={() => { setSelectedId(record.id); setView('workbench'); }}>{record.name}</button><small>{record.kind}</small></th><td>{classify(record)}</td><td>{factLike(record, /participants/i) || record.related.slice(0, 3).join(' · ')}</td><td>{factLike(record, /chapters/i) || 'Source range'}</td><td>{factLike(record, /turning/i) || 'Not separately indexed'}</td><td>{factLike(record, /outcome|result/i) || factLike(record, /status/i) || 'See record'}</td></tr>)}</tbody></table></div>}
  </section>;
}
