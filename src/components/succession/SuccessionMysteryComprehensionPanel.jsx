import { ArrowRight, GitBranch, SearchCheck, ShieldQuestion } from 'lucide-react';
import { getSuccessionMysteryCasesAtChapter } from '../../data/succession/successionMysteryCases';
import './SuccessionMysteryComprehensionPanel.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const unique = (values = []) => [...new Set(values.filter(Boolean))];

const sharedSignals = (a, b) => unique([
  ...a.relatedEntityIds.filter((id) => b.relatedEntityIds.includes(id)),
  ...a.relatedAbilityIds.filter((id) => b.relatedAbilityIds.includes(id)),
  ...a.relatedThreadIds.filter((id) => b.relatedThreadIds.includes(id)),
]);

function CaseButton({ record, onNavigate }) {
  return <button type="button" className="succession-mystery-comprehension__case-link" onClick={() => onNavigate('research', { mode: 'cases', case: record.id })}>
    <span>{record.title}</span><ArrowRight size={12} aria-hidden="true" />
  </button>;
}

export default function SuccessionMysteryComprehensionPanel({ chapter = 417, onNavigate }) {
  const records = getSuccessionMysteryCasesAtChapter(chapter);
  const categories = [...new Set(records.map((record) => record.category))]
    .map((category) => ({ category, records: records.filter((record) => record.category === category) }))
    .sort((a, b) => b.records.length - a.records.length || a.category.localeCompare(b.category));
  const recent = [...records]
    .sort((a, b) => b.latestChapter - a.latestChapter || b.firstChapter - a.firstChapter)
    .slice(0, 6);
  const candidateCases = [...records]
    .sort((a, b) => b.candidates.length - a.candidates.length || b.unknowns.length - a.unknowns.length)
    .slice(0, 4);
  const connections = records.flatMap((record, index) => records.slice(index + 1).map((other) => {
    const shared = sharedSignals(record, other);
    return shared.length ? { record, other, shared } : null;
  }).filter(Boolean)).sort((a, b) => b.shared.length - a.shared.length).slice(0, 8);

  return <section className="succession-mystery-comprehension" aria-labelledby="succession-mystery-comprehension-title">
    <header className="succession-mystery-comprehension__hero">
      <span><ShieldQuestion size={15} aria-hidden="true" /> Mystery command center</span>
      <h2 id="succession-mystery-comprehension-title">See unresolved pressure, competing explanations and cross-case links before opening a dossier</h2>
      <p>Everything below is derived from the canonical mystery case files at Chapter {chapter}. Candidates remain hypotheses and are never promoted to canon by ranking or visual emphasis.</p>
    </header>

    <div className="succession-mystery-comprehension__grid">
      <section>
        <header><span>Case pressure board</span><h3>Where unresolved research is concentrated</h3></header>
        <div className="succession-mystery-comprehension__categories">{categories.map(({ category, records: categoryRecords }) => <article key={category}>
          <div><b>{labelize(category)}</b><span>{categoryRecords.length} case{categoryRecords.length === 1 ? '' : 's'}</span></div>
          <small>{categoryRecords.reduce((sum, record) => sum + record.unknowns.length, 0)} unknowns · {categoryRecords.reduce((sum, record) => sum + record.candidates.length, 0)} candidates</small>
        </article>)}</div>
      </section>

      <section>
        <header><span><SearchCheck size={13} aria-hidden="true" /> New evidence horizon</span><h3>Cases touched nearest the current boundary</h3></header>
        <ol className="succession-mystery-comprehension__recent">{recent.map((record) => <li key={record.id}>
          <CaseButton record={record} onNavigate={onNavigate} />
          <span>Opened Ch. {record.firstChapter} · latest evidence Ch. {record.latestChapter}</span>
          <small>{record.knownFacts.length} known · {record.unknowns.length} unknown · {record.sourceIds.length} source anchors</small>
        </li>)}</ol>
      </section>

      <section className="is-wide">
        <header><span>Candidate comparison matrix</span><h3>Evidence for and against, side by side</h3></header>
        <div className="succession-mystery-comprehension__matrix" tabIndex="0" role="region" aria-label="Mystery candidate comparison table"><table>
          <thead><tr><th>Case</th><th>Candidate</th><th>Status</th><th>Evidence for</th><th>Evidence against / limits</th></tr></thead>
          <tbody>{candidateCases.flatMap((record) => record.candidates.map((candidate, index) => <tr key={`${record.id}-${candidate.id}`}>
            <th>{index === 0 ? <CaseButton record={record} onNavigate={onNavigate} /> : <span aria-hidden="true">↳</span>}</th>
            <td>{candidate.label}</td><td>{labelize(candidate.status)}</td>
            <td>{candidate.evidenceFor.join(' · ') || 'No affirmative evidence recorded.'}</td>
            <td>{candidate.evidenceAgainst.join(' · ') || 'No explicit counterevidence recorded.'}</td>
          </tr>))}</tbody>
        </table></div>
      </section>

      <section className="is-wide">
        <header><span><GitBranch size={13} aria-hidden="true" /> Cross-case graph</span><h3>Mysteries that share people, abilities or story threads</h3></header>
        <div className="succession-mystery-comprehension__connections">{connections.length ? connections.map(({ record, other, shared }) => <article key={`${record.id}-${other.id}`}>
          <CaseButton record={record} onNavigate={onNavigate} /><i aria-hidden="true">↔</i><CaseButton record={other} onNavigate={onNavigate} />
          <small>{shared.length} shared canonical signal{shared.length === 1 ? '' : 's'}: {shared.map((id) => id.split(':').at(-1).replaceAll('-', ' ')).join(' · ')}</small>
        </article>) : <p>No cross-case canonical links are published at this chapter boundary.</p>}</div>
      </section>
    </div>

    <footer>Showing all {records.length} published mystery cases through Chapter {chapter}; detailed evidence, resolution history and source anchors remain in each case dossier.</footer>
  </section>;
}
