import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, ShieldQuestion } from 'lucide-react';
import {
  getSuccessionMysteryCase,
  getSuccessionMysteryCasesAtChapter,
  getSuccessionMysteryCaseSummary,
} from '../../data/succession/successionMysteryCases';
import './SuccessionIntelligenceWorkbench.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function CaseDetail({ record, onNavigate }) {
  return <section className="succession-intelligence-detail">
    <button type="button" onClick={() => onNavigate('research', { mode: 'cases' })}><ArrowLeft size={13} aria-hidden="true" /> Back to mystery cases</button>
    <span>{labelize(record.category)} · {labelize(record.status)} · Chapters {record.firstChapter}–{record.latestChapter}</span>
    <h3>{record.title}</h3>
    <p>{record.question}</p>
    <p>{record.summary}</p>
    <dl>
      <div><dt>Known facts</dt><dd>{record.knownFacts.join(' · ') || 'None published'}</dd></div>
      <div><dt>Unknowns</dt><dd>{record.unknowns.join(' · ') || 'None'}</dd></div>
      <div><dt>Sources</dt><dd>{record.sourceIds.join(' · ')}</dd></div>
    </dl>
    <section>
      <h4>Candidate explanations</h4>
      <div className="succession-intelligence-knowledge"><div>{record.candidates.map((candidate) => <article key={candidate.id}>
        <header><ShieldQuestion size={15} aria-hidden="true" /><span>{labelize(candidate.status)}</span></header>
        <h4>{candidate.label}</h4>
        <dl>
          <div><dt>Evidence for</dt><dd>{candidate.evidenceFor.join(' · ') || 'No affirmative evidence recorded.'}</dd></div>
          <div><dt>Evidence against / limits</dt><dd>{candidate.evidenceAgainst.join(' · ') || 'No explicit counterevidence recorded.'}</dd></div>
        </dl>
      </article>)}</div></div>
    </section>
    {!!record.resolutionHistory.length && <section><h4>Resolution history</h4><ol>{record.resolutionHistory.map((entry, index) => <li key={`${entry.chapter || index}-${index}`}>{entry.chapter ? `Chapter ${entry.chapter}: ` : ''}{entry.summary || String(entry)}</li>)}</ol></section>}
  </section>;
}

export default function SuccessionMysteryCaseWorkbench({ routeParams = {}, spoilerLimit = 417, onNavigate }) {
  const active = routeParams.mode === 'cases';
  const summary = getSuccessionMysteryCaseSummary(spoilerLimit);
  const selected = active && routeParams.case ? getSuccessionMysteryCase(routeParams.case) : null;
  const [query, setQuery] = useState('');
  const records = useMemo(() => getSuccessionMysteryCasesAtChapter(spoilerLimit).filter((record) => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return true;
    return `${record.title} ${record.question} ${record.summary} ${record.category} ${record.knownFacts.join(' ')} ${record.unknowns.join(' ')}`.toLocaleLowerCase().includes(needle);
  }), [query, spoilerLimit]);

  if (!active) return <section className="succession-intelligence-workbench">
    <div className="succession-intelligence-workbench__hero">
      <div><span><ShieldQuestion size={14} aria-hidden="true" /> Content Depth · Case files</span><h2>Open mysteries with arguments, not just question labels.</h2><p>Each case separates established facts, unknowns, competing explanations, supporting evidence, counterevidence, related systems, and the Chapter {spoilerLimit} boundary.</p></div>
      <dl><div><dt>Cases</dt><dd>{summary.total}</dd></div><div><dt>Open</dt><dd>{summary.open}</dd></div><div><dt>Categories</dt><dd>{summary.categories.length}</dd></div></dl>
    </div>
    <div className="succession-intelligence-workbench__body"><section className="succession-intelligence-overview"><header><span>Investigation layer</span><h3>Turn unresolved threads into evidence-bounded case files.</h3><p>The ledger never upgrades a candidate explanation into canon merely because it is plausible.</p></header><div><article><ShieldQuestion size={22} aria-hidden="true" /><span>Chapter-bounded</span><h4>Mystery case files</h4><p>Inspect Tserriednich’s Room 1004 reality problem, Benjamin’s countdown, Gypsy Life, the succession ritual, Silent Majority, curse networks, and more.</p><button type="button" onClick={() => onNavigate('research', { mode: 'cases' })}>Open case files <ArrowRight size={13} aria-hidden="true" /></button></article></div></section></div>
  </section>;

  return <section className="succession-intelligence-workbench">
    <div className="succession-intelligence-workbench__hero">
      <div><span><ShieldQuestion size={14} aria-hidden="true" /> Mystery intelligence</span><h2>Case files through Chapter {spoilerLimit}.</h2><p>Known facts remain separate from candidate explanations. Every case exposes what would need to be learned before it can actually be resolved.</p></div>
      <dl><div><dt>Visible cases</dt><dd>{records.length}</dd></div><div><dt>Open</dt><dd>{summary.open}</dd></div><div><dt>Boundary</dt><dd>Ch. {spoilerLimit}</dd></div></dl>
    </div>
    <div className="succession-intelligence-tabs"><button type="button" className="is-active" aria-current="page" onClick={() => onNavigate('research', { mode: 'cases' })}><ShieldQuestion size={15} aria-hidden="true" /><span>Cases</span></button><button type="button" onClick={() => onNavigate('research', { mode: 'overview' })}><ArrowLeft size={15} aria-hidden="true" /><span>Intelligence overview</span></button></div>
    <div className="succession-intelligence-workbench__body">
      {selected ? <CaseDetail record={selected} onNavigate={onNavigate} /> : <section className="succession-intelligence-knowledge">
        <header><span>Open questions · competing explanations · evidence boundaries</span><h3>What is actually unresolved?</h3><p>Search by character, mechanic, institution, threat, or mystery. Candidate explanations are explicitly marked as hypotheses, not facts.</p></header>
        <label className="succession-intelligence-controls"><span className="sr-only">Filter mystery cases</span><Search size={15} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter case files…" /></label>
        <div>{records.map((record) => <article key={record.id}>
          <header><ShieldQuestion size={16} aria-hidden="true" /><span>{labelize(record.category)}</span><b>{labelize(record.status)}</b></header>
          <h4>{record.title}</h4>
          <p>{record.question}</p>
          <dl><div><dt>Known</dt><dd>{record.knownFacts.length}</dd></div><div><dt>Unknown</dt><dd>{record.unknowns.length}</dd></div><div><dt>Candidates</dt><dd>{record.candidates.length}</dd></div></dl>
          <button type="button" onClick={() => onNavigate('research', { mode: 'cases', case: record.id })}>Open case <ArrowRight size={13} aria-hidden="true" /></button>
        </article>)}</div>
      </section>}
    </div>
  </section>;
}
