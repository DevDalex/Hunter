import { useMemo, useState } from 'react';
import { CircleHelp, GitCompare } from 'lucide-react';
import { getEntitiesByType } from '../../data/succession/successionData';
import { compareEntities, comparisonDomains } from '../../lib/succession/comparison';

const entityTypesByDomain = {
  characters: ['character'],
  princes: ['character'],
  organizations: ['organization'],
  abilities: ['ability'],
  chapters: ['chapter'],
};
const asArray = (value) => value ? (Array.isArray(value) ? value : [value]) : [];
const labelOf = (entity) => entity.name || entity.title || entity.label || entity.id;
const printable = (value) => {
  if (value === null || value === undefined || value === '') return 'Unknown';
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' ? labelOf(item) : item).join(', ') || 'None';
  if (typeof value === 'object') return Object.entries(value).map(([key, item]) => `${key}: ${printable(item)}`).join(' · ');
  return String(value);
};

export default function SuccessionIntelligencePanels({ spoilerLimit }) {
  const [domain, setDomain] = useState('characters');
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');
  const [questionFilter, setQuestionFilter] = useState('all');
  const options = useMemo(() => {
    const records = (entityTypesByDomain[domain] || []).flatMap((type) => getEntitiesByType(type));
    return domain === 'princes' ? records.filter((record) => (record.roles || []).includes('prince')) : records;
  }, [domain]);
  const comparison = useMemo(() => {
    const left = options.find((record) => record.id === leftId);
    const right = options.find((record) => record.id === rightId);
    if (!left || !right || left.id === right.id) return null;
    try { return compareEntities(domain, [left, right]); } catch { return null; }
  }, [domain, leftId, options, rightId]);
  const questions = useMemo(() => {
    const domains = ['character', 'organization', 'ability', 'guardian-beast', 'event', 'chapter', 'location'];
    return domains.flatMap((type) => getEntitiesByType(type)).flatMap((entity) => {
      const values = entity.openQuestions || entity.unresolvedQuestions || entity.questions || [];
      return asArray(values).filter(Boolean).map((question, index) => {
        const record = typeof question === 'string' ? { question } : question;
        return {
          id: record.id || `${entity.id}:${index}`,
          entity,
          text: record.question || record.label || record.text,
          status: record.status || 'open',
          chapter: record.openedAtChapter || record.chapter || null,
          resolvedAtChapter: record.resolvedAtChapter || null,
          candidates: asArray(record.candidates),
          evidenceFor: asArray(record.evidenceFor || record.supportingEvidence),
          evidenceAgainst: asArray(record.evidenceAgainst || record.contradictions),
          history: asArray(record.history || record.resolutionHistory),
        };
      });
    }).filter((item) => item.text && (!item.chapter || item.chapter <= spoilerLimit));
  }, [spoilerLimit]);
  const visibleQuestions = questionFilter === 'all' ? questions : questions.filter((item) => item.status === questionFilter);
  const statuses = [...new Set(questions.map((item) => item.status))];

  return <section className="succession-intelligence-panels" aria-label="Comparison and open questions">
    <article className="succession-intelligence-panels__compare">
      <header><GitCompare size={18} aria-hidden="true" /><div><span>Comparison engine</span><h2>Compare canonical records</h2></div></header>
      <div className="succession-intelligence-panels__selectors">
        <label>Domain<select value={domain} onChange={(event) => { setDomain(event.target.value); setLeftId(''); setRightId(''); }}>{Object.keys(comparisonDomains).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
        <label>First record<select value={leftId} onChange={(event) => setLeftId(event.target.value)}><option value="">Choose…</option>{options.map((record) => <option key={record.id} value={record.id}>{labelOf(record)}</option>)}</select></label>
        <label>Second record<select value={rightId} onChange={(event) => setRightId(event.target.value)}><option value="">Choose…</option>{options.map((record) => <option key={record.id} value={record.id}>{labelOf(record)}</option>)}</select></label>
      </div>
      {comparison ? <div className="succession-intelligence-panels__table" role="table" aria-label={`${domain} comparison`}>
        <div role="row" className="is-heading"><span role="columnheader">Field</span><span role="columnheader">{labelOf(options.find((record) => record.id === leftId))}</span><span role="columnheader">{labelOf(options.find((record) => record.id === rightId))}</span></div>
        {comparison.rows.map((row) => <div role="row" key={row.field}><strong role="rowheader">{row.field}</strong><span role="cell">{printable(row.values[0])}</span><span role="cell">{printable(row.values[1])}</span></div>)}
      </div> : <p>Select two different records to generate a chapter-bounded comparison.</p>}
    </article>

    <article className="succession-intelligence-panels__questions">
      <header><CircleHelp size={18} aria-hidden="true" /><div><span>Mystery registry</span><h2>Questions through Chapter {spoilerLimit}</h2></div><b>{visibleQuestions.length}</b></header>
      <label>Question status<select value={questionFilter} onChange={(event) => setQuestionFilter(event.target.value)}><option value="all">All</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
      {visibleQuestions.length ? <div className="succession-intelligence-panels__question-list">{visibleQuestions.slice(0, 30).map((item) => <details key={item.id}>
        <summary><strong>{item.text}</strong><span>{labelOf(item.entity)} · {item.status}{item.chapter ? ` · opened Ch. ${item.chapter}` : ''}{item.resolvedAtChapter ? ` · resolved Ch. ${item.resolvedAtChapter}` : ''}</span></summary>
        <div className="succession-intelligence-panels__question-detail">
          <section><h3>Candidates</h3>{item.candidates.length ? <ul>{item.candidates.map((value, index) => <li key={index}>{printable(value)}</li>)}</ul> : <p>No candidates recorded.</p>}</section>
          <section><h3>Evidence for</h3>{item.evidenceFor.length ? <ul>{item.evidenceFor.map((value, index) => <li key={index}>{printable(value)}</li>)}</ul> : <p>No supporting evidence recorded.</p>}</section>
          <section><h3>Evidence against</h3>{item.evidenceAgainst.length ? <ul>{item.evidenceAgainst.map((value, index) => <li key={index}>{printable(value)}</li>)}</ul> : <p>No contradictory evidence recorded.</p>}</section>
          <section><h3>Resolution history</h3>{item.history.length ? <ol>{item.history.map((value, index) => <li key={index}>{printable(value)}</li>)}</ol> : <p>No status history recorded.</p>}</section>
        </div>
      </details>)}</div> : <p>No structured questions are published inside this boundary yet.</p>}
    </article>
  </section>;
}
