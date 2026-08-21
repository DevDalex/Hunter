import { useMemo, useState } from 'react';
import { ArrowRight, CircleDot, GitBranch, SearchCheck, ShieldQuestion } from 'lucide-react';
import {
  getSuccessionMysteryCase,
  getSuccessionMysteryCasesAtChapter,
} from '../../data/succession/successionMysteryCases';
import { getEntityById } from '../../data/succession/successionData';
import './SuccessionResearchComprehensionPanel.css';

const labelize = (value) => String(value || 'unknown')
  .replace(/^story-thread:/, '')
  .replace(/^mystery-case:/, '')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const sourceChapter = (id) => {
  const match = String(id || '').match(/^source:chapter-(\d+)$/);
  return match ? Number(match[1]) : null;
};

const touchChaptersFor = (record) => [...new Set([
  ...(record.sourceIds || []).map(sourceChapter).filter(Number.isFinite),
  ...(record.resolutionHistory || []).map((entry) => Number(entry.chapter)).filter(Number.isFinite),
])].sort((a, b) => a - b);

const sharedKeys = (left, right) => {
  const groups = [
    ['people / records', left.relatedEntityIds || [], right.relatedEntityIds || []],
    ['abilities', left.relatedAbilityIds || [], right.relatedAbilityIds || []],
    ['story threads', left.relatedThreadIds || [], right.relatedThreadIds || []],
  ];
  return groups.flatMap(([type, leftIds, rightIds]) => {
    const rightSet = new Set(rightIds);
    return leftIds.filter((id) => rightSet.has(id)).map((id) => ({ type, id }));
  });
};

const displayRecord = (id) => getEntityById(id)?.name || labelize(id);

function StatusBoard({ records, chapter, onOpen }) {
  const buckets = useMemo(() => {
    const output = {
      new: [],
      touched: [],
      unresolved: [],
      resolved: [],
    };
    for (const record of records) {
      const touches = touchChaptersFor(record);
      if (record.status === 'resolved') output.resolved.push(record);
      else if (record.firstChapter === chapter) output.new.push(record);
      else if (touches.includes(chapter)) output.touched.push(record);
      else output.unresolved.push(record);
    }
    return output;
  }, [records, chapter]);

  const columns = [
    ['new', 'New at boundary', 'First published at the selected chapter.'],
    ['touched', 'Touched at boundary', 'Has a chapter source or resolution-history touchpoint at this boundary.'],
    ['unresolved', 'Earlier unresolved', 'Open case with no new source touchpoint at this exact boundary.'],
    ['resolved', 'Resolved', 'Explicitly marked resolved by the maintained case record.'],
  ];

  return <section className="succession-research-comprehension__section is-status">
    <header><span><ShieldQuestion size={14} aria-hidden="true" /> Case status</span><h3>What needs attention at Chapter {chapter}?</h3><p>The board uses publication/touchpoint state only; it does not assign speculative urgency scores.</p></header>
    <div className="succession-research-comprehension__status-board">{columns.map(([key, title, description]) => <section key={key}>
      <header><h4>{title}</h4><b>{buckets[key].length}</b><p>{description}</p></header>
      <ol>{buckets[key].slice(0, 7).map((record) => <li key={record.id}><button type="button" onClick={() => onOpen(record.id)}><span>{labelize(record.category)}</span><strong>{record.title}</strong><small>{record.candidates.length} candidates · {record.unknowns.length} unknowns</small></button></li>)}</ol>
      {buckets[key].length > 7 && <small className="succession-research-comprehension__shown">Showing 7 of {buckets[key].length}</small>}
    </section>)}</div>
  </section>;
}

function CandidateMatrix({ records, selectedId, onSelect, onOpen }) {
  const selected = getSuccessionMysteryCase(selectedId) || records[0] || null;
  if (!selected) return null;
  const touches = touchChaptersFor(selected);
  const laterTouches = touches.filter((chapter) => chapter > selected.firstChapter);

  return <section className="succession-research-comprehension__section is-candidates">
    <header><span><SearchCheck size={14} aria-hidden="true" /> Candidate evidence</span><h3>Compare explanations without turning them into probabilities</h3><p>Evidence-for and evidence-against remain verbatim case-file arguments. Counts are evidence entries, not likelihood scores.</p></header>
    <div className="succession-research-comprehension__case-picker">
      <label>Case<select value={selected.id} onChange={(event) => onSelect(event.target.value)}>{records.map((record) => <option value={record.id} key={record.id}>{record.title}</option>)}</select></label>
      <button type="button" onClick={() => onOpen(selected.id)}>Open full case <ArrowRight size={13} aria-hidden="true" /></button>
    </div>
    <div className="succession-research-comprehension__case-context">
      <div><span>Opened</span><b>Ch. {selected.firstChapter}</b></div>
      <div><span>Source/review touches after opening</span><b>{laterTouches.length}</b><small>{laterTouches.length ? laterTouches.map((chapter) => `Ch. ${chapter}`).join(' · ') : 'No later touchpoint published'}</small></div>
      <div><span>Known / unknown</span><b>{selected.knownFacts.length} / {selected.unknowns.length}</b></div>
      <div><span>Status</span><b>{labelize(selected.status)}</b></div>
    </div>
    <div className="succession-research-comprehension__matrix-wrap" tabIndex="0" role="region" aria-label={`Candidate evidence matrix for ${selected.title}`}>
      <table><thead><tr><th>Candidate</th><th>State</th><th>Evidence for</th><th>Evidence against / limits</th></tr></thead><tbody>{selected.candidates.map((candidate) => <tr key={candidate.id}>
        <th>{candidate.label}</th><td>{labelize(candidate.status)}</td>
        <td><b>{candidate.evidenceFor.length} item{candidate.evidenceFor.length === 1 ? '' : 's'}</b><ul>{candidate.evidenceFor.map((item) => <li key={item}>{item}</li>)}</ul></td>
        <td><b>{candidate.evidenceAgainst.length} item{candidate.evidenceAgainst.length === 1 ? '' : 's'}</b><ul>{candidate.evidenceAgainst.map((item) => <li key={item}>{item}</li>)}</ul></td>
      </tr>)}</tbody></table>
    </div>
  </section>;
}

function CaseConnections({ records, onOpen }) {
  const connections = useMemo(() => {
    const edges = [];
    for (let leftIndex = 0; leftIndex < records.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < records.length; rightIndex += 1) {
        const left = records[leftIndex];
        const right = records[rightIndex];
        const shared = sharedKeys(left, right);
        if (shared.length) edges.push({ id: `${left.id}:${right.id}`, left, right, shared });
      }
    }
    return edges.sort((a, b) => b.shared.length - a.shared.length || a.left.title.localeCompare(b.left.title));
  }, [records]);

  return <section className="succession-research-comprehension__section is-connections">
    <header><span><GitBranch size={14} aria-hidden="true" /> Cross-case connections</span><h3>Mysteries that touch the same people, abilities or Story threads</h3><p>Connections appear only when two maintained case files explicitly share a related ID.</p></header>
    <ol className="succession-research-comprehension__connections">{connections.slice(0, 16).map((edge) => <li key={edge.id}>
      <button type="button" onClick={() => onOpen(edge.left.id)}>{edge.left.title}</button>
      <span><CircleDot size={12} aria-hidden="true" /> {edge.shared.length} shared</span>
      <button type="button" onClick={() => onOpen(edge.right.id)}>{edge.right.title}</button>
      <small>{edge.shared.map((item) => `${labelize(item.type)}: ${displayRecord(item.id)}`).join(' · ')}</small>
    </li>)}</ol>
    {connections.length > 16 && <small className="succession-research-comprehension__shown">Showing 16 of {connections.length} explicit cross-case connections.</small>}
    {!connections.length && <p className="succession-research-comprehension__empty">No explicit shared case links are published at this chapter boundary.</p>}
  </section>;
}

export default function SuccessionResearchComprehensionPanel({ chapter = 417, onNavigate }) {
  const records = useMemo(() => getSuccessionMysteryCasesAtChapter(chapter), [chapter]);
  const defaultCase = [...records].sort((a, b) => b.firstChapter - a.firstChapter || a.title.localeCompare(b.title))[0]?.id || '';
  const [selectedId, setSelectedId] = useState(defaultCase);
  const openCase = (id) => onNavigate('research', { mode: 'cases', case: id });

  return <section className="succession-research-comprehension" aria-labelledby="succession-research-comprehension-title">
    <header className="succession-research-comprehension__hero">
      <span><ShieldQuestion size={15} aria-hidden="true" /> Research comprehension</span>
      <h2 id="succession-research-comprehension-title">See the state of the mystery ledger before reading nineteen separate dossiers</h2>
      <p>Status, competing explanations, evidence balance, source touchpoints and cross-case links are derived directly from the maintained case files through Chapter {chapter}.</p>
    </header>
    <div className="succession-research-comprehension__layout">
      <StatusBoard records={records} chapter={chapter} onOpen={openCase} />
      <CandidateMatrix records={records} selectedId={selectedId} onSelect={setSelectedId} onOpen={openCase} />
      <CaseConnections records={records} onOpen={openCase} />
    </div>
  </section>;
}
