import { useMemo, useState } from 'react';
import { ArrowRight, CircleDot, GitBranch, SearchCheck, ShieldQuestion } from 'lucide-react';
import { getSuccessionMysteryCasesAtChapter } from '../../data/succession/successionMysteryCases';
import { getEntityById } from '../../data/succession/successionData';
import './SuccessionMysteryComprehensionPanel.css';

const labelize = (value) => String(value || 'unknown')
  .replace(/^story-thread:/, '')
  .replace(/^mystery-case:/, '')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (values = []) => [...new Set(values.filter(Boolean))];
const sourceChapter = (id) => {
  const match = String(id || '').match(/^source:chapter-(\d+)$/);
  return match ? Number(match[1]) : null;
};
const touchChaptersFor = (record) => unique([
  ...(record.sourceIds || []).map(sourceChapter).filter(Number.isFinite),
  ...(record.resolutionHistory || []).map((entry) => Number(entry.chapter)).filter(Number.isFinite),
]).sort((a, b) => a - b);
const sharedSignals = (a, b) => unique([
  ...a.relatedEntityIds.filter((id) => b.relatedEntityIds.includes(id)),
  ...a.relatedAbilityIds.filter((id) => b.relatedAbilityIds.includes(id)),
  ...a.relatedThreadIds.filter((id) => b.relatedThreadIds.includes(id)),
]);
const displaySignal = (id) => getEntityById(id)?.name || labelize(id);

function CaseButton({ record, onNavigate }) {
  return <button type="button" className="succession-mystery-comprehension__case-link" onClick={() => onNavigate('research', { mode: 'cases', case: record.id })}>
    <span>{record.title}</span><ArrowRight size={12} aria-hidden="true" />
  </button>;
}

function StatusBoard({ records, chapter, onNavigate }) {
  const buckets = useMemo(() => {
    const result = { new: [], touched: [], unresolved: [], resolved: [] };
    for (const record of records) {
      const touches = touchChaptersFor(record);
      if (record.status === 'resolved') result.resolved.push(record);
      else if (record.firstChapter === chapter) result.new.push(record);
      else if (touches.includes(chapter)) result.touched.push(record);
      else result.unresolved.push(record);
    }
    return result;
  }, [records, chapter]);
  const columns = [
    ['new', 'New at boundary', 'First published at this chapter.'],
    ['touched', 'Touched at boundary', 'Has an explicit chapter source or resolution-history touchpoint here.'],
    ['unresolved', 'Earlier unresolved', 'Still open without a new touchpoint at this exact boundary.'],
    ['resolved', 'Resolved', 'Explicitly marked resolved in the maintained case file.'],
  ];

  return <section className="is-wide">
    <header><span><ShieldQuestion size={13} aria-hidden="true" /> Case status</span><h3>What changed in the mystery ledger at Chapter {chapter}?</h3></header>
    <div className="succession-mystery-comprehension__status-board">{columns.map(([key, title, description]) => <section key={key}>
      <header><h4>{title}</h4><b>{buckets[key].length}</b><p>{description}</p></header>
      <ol>{buckets[key].slice(0, 7).map((record) => <li key={record.id}><CaseButton record={record} onNavigate={onNavigate} /><small>{labelize(record.category)} · {record.candidates.length} candidates · {record.unknowns.length} unknowns</small></li>)}</ol>
      {buckets[key].length > 7 && <small className="succession-mystery-comprehension__shown">Showing 7 of {buckets[key].length}</small>}
    </section>)}</div>
  </section>;
}

function CandidateMatrix({ records, onNavigate }) {
  const defaultId = [...records].sort((a, b) => b.firstChapter - a.firstChapter || a.title.localeCompare(b.title))[0]?.id || '';
  const [selectedId, setSelectedId] = useState(defaultId);
  const selected = records.find((record) => record.id === selectedId) || records[0] || null;
  if (!selected) return null;
  const touches = touchChaptersFor(selected);
  const laterTouches = touches.filter((value) => value > selected.firstChapter);

  return <section className="is-wide">
    <header><span><SearchCheck size={13} aria-hidden="true" /> Candidate comparison matrix</span><h3>Evidence for and against, side by side</h3></header>
    <div className="succession-mystery-comprehension__picker">
      <label>Case<select value={selected.id} onChange={(event) => setSelectedId(event.target.value)}>{records.map((record) => <option key={record.id} value={record.id}>{record.title}</option>)}</select></label>
      <CaseButton record={selected} onNavigate={onNavigate} />
    </div>
    <div className="succession-mystery-comprehension__context">
      <div><span>Opened</span><b>Ch. {selected.firstChapter}</b></div>
      <div><span>Later source / review touchpoints</span><b>{laterTouches.length}</b><small>{laterTouches.length ? laterTouches.map((value) => `Ch. ${value}`).join(' · ') : 'None published'}</small></div>
      <div><span>Known / unknown</span><b>{selected.knownFacts.length} / {selected.unknowns.length}</b></div>
      <div><span>Status</span><b>{labelize(selected.status)}</b></div>
    </div>
    <div className="succession-mystery-comprehension__matrix" tabIndex="0" role="region" aria-label={`Candidate evidence matrix for ${selected.title}`}><table>
      <thead><tr><th>Candidate</th><th>Status</th><th>Evidence for</th><th>Evidence against / limits</th></tr></thead>
      <tbody>{selected.candidates.map((candidate) => <tr key={`${selected.id}-${candidate.id}`}>
        <th>{candidate.label}</th><td>{labelize(candidate.status)}</td>
        <td><b>{candidate.evidenceFor.length} item{candidate.evidenceFor.length === 1 ? '' : 's'}</b>{candidate.evidenceFor.length ? <ul>{candidate.evidenceFor.map((item) => <li key={item}>{item}</li>)}</ul> : <span>No affirmative evidence recorded.</span>}</td>
        <td><b>{candidate.evidenceAgainst.length} item{candidate.evidenceAgainst.length === 1 ? '' : 's'}</b>{candidate.evidenceAgainst.length ? <ul>{candidate.evidenceAgainst.map((item) => <li key={item}>{item}</li>)}</ul> : <span>No explicit counterevidence recorded.</span>}</td>
      </tr>)}</tbody>
    </table></div>
    <footer className="succession-mystery-comprehension__note">Evidence counts describe maintained argument entries, not probability or confidence scores.</footer>
  </section>;
}

function Connections({ records, onNavigate }) {
  const connections = useMemo(() => records.flatMap((record, index) => records.slice(index + 1).map((other) => {
    const shared = sharedSignals(record, other);
    return shared.length ? { record, other, shared } : null;
  }).filter(Boolean)).sort((a, b) => b.shared.length - a.shared.length || a.record.title.localeCompare(b.record.title)), [records]);

  return <section className="is-wide">
    <header><span><GitBranch size={13} aria-hidden="true" /> Cross-case graph</span><h3>Mysteries that share people, abilities or Story threads</h3></header>
    <div className="succession-mystery-comprehension__connections">{connections.length ? connections.slice(0, 16).map(({ record, other, shared }) => <article key={`${record.id}-${other.id}`}>
      <CaseButton record={record} onNavigate={onNavigate} /><i aria-hidden="true"><CircleDot size={12} /></i><CaseButton record={other} onNavigate={onNavigate} />
      <small>{shared.length} shared canonical signal{shared.length === 1 ? '' : 's'}: {shared.map(displaySignal).join(' · ')}</small>
    </article>) : <p>No cross-case canonical links are published at this chapter boundary.</p>}</div>
    {connections.length > 16 && <small className="succession-mystery-comprehension__shown">Showing 16 of {connections.length} explicit cross-case connections.</small>}
  </section>;
}

export default function SuccessionMysteryComprehensionPanel({ chapter = 417, onNavigate }) {
  const records = getSuccessionMysteryCasesAtChapter(chapter);
  const categories = [...new Set(records.map((record) => record.category))]
    .map((category) => ({ category, records: records.filter((record) => record.category === category) }))
    .sort((a, b) => b.records.length - a.records.length || a.category.localeCompare(b.category));

  return <section className="succession-mystery-comprehension" aria-labelledby="succession-mystery-comprehension-title">
    <header className="succession-mystery-comprehension__hero">
      <span><ShieldQuestion size={15} aria-hidden="true" /> Mystery command center</span>
      <h2 id="succession-mystery-comprehension-title">See unresolved pressure, competing explanations and cross-case links before opening a dossier</h2>
      <p>Everything below is derived from the canonical mystery case files at Chapter {chapter}. Candidates remain hypotheses and are never promoted to canon by ranking or visual emphasis.</p>
    </header>

    <div className="succession-mystery-comprehension__grid">
      <StatusBoard records={records} chapter={chapter} onNavigate={onNavigate} />

      <section>
        <header><span>Research concentration</span><h3>Which domains contain the most open case material?</h3></header>
        <div className="succession-mystery-comprehension__categories">{categories.map(({ category, records: categoryRecords }) => <article key={category}>
          <div><b>{labelize(category)}</b><span>{categoryRecords.length} case{categoryRecords.length === 1 ? '' : 's'}</span></div>
          <small>{categoryRecords.reduce((sum, record) => sum + record.unknowns.length, 0)} unknowns · {categoryRecords.reduce((sum, record) => sum + record.candidates.length, 0)} candidates</small>
        </article>)}</div>
      </section>

      <section>
        <header><span><SearchCheck size={13} aria-hidden="true" /> Source horizon</span><h3>Cases with the most recent explicit source touchpoints</h3></header>
        <ol className="succession-mystery-comprehension__recent">{[...records].sort((a, b) => (touchChaptersFor(b).at(-1) || b.firstChapter) - (touchChaptersFor(a).at(-1) || a.firstChapter)).slice(0, 7).map((record) => {
          const touches = touchChaptersFor(record);
          const latestTouch = touches.at(-1) || record.firstChapter;
          return <li key={record.id}><CaseButton record={record} onNavigate={onNavigate} /><span>Opened Ch. {record.firstChapter} · latest explicit source/review touch Ch. {latestTouch}</span><small>{record.knownFacts.length} known · {record.unknowns.length} unknown · {record.sourceIds.length} source anchors</small></li>;
        })}</ol>
      </section>

      <CandidateMatrix records={records} onNavigate={onNavigate} />
      <Connections records={records} onNavigate={onNavigate} />
    </div>

    <footer>Showing all {records.length} published mystery cases through Chapter {chapter}; detailed evidence, resolution history and source anchors remain in each case dossier.</footer>
  </section>;
}
