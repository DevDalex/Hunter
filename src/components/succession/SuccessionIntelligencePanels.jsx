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
      return (Array.isArray(values) ? values : [values]).filter(Boolean).map((question, index) => ({
        id: `${entity.id}:${index}`,
        entity,
        text: typeof question === 'string' ? question : question.question || question.label || question.text,
        status: typeof question === 'object' ? question.status || 'open' : 'open',
        chapter: typeof question === 'object' ? question.openedAtChapter || question.chapter : null,
      }));
    }).filter((item) => item.text && (!item.chapter || item.chapter <= spoilerLimit));
  }, [spoilerLimit]);

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
      <header><CircleHelp size={18} aria-hidden="true" /><div><span>Mystery registry</span><h2>Open questions through Chapter {spoilerLimit}</h2></div><b>{questions.length}</b></header>
      {questions.length ? <ul>{questions.slice(0, 20).map((item) => <li key={item.id}><strong>{item.text}</strong><span>{labelOf(item.entity)} · {item.status}{item.chapter ? ` · opened Ch. ${item.chapter}` : ''}</span></li>)}</ul> : <p>No structured open-question records are published inside this boundary yet.</p>}
    </article>
  </section>;
}
