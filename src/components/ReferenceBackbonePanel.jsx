import { ArrowRight, ExternalLink } from 'lucide-react';
import { referenceBackbonePrototype } from '../data/referenceBackbonePrototype';
import './ReferenceBackbonePanel.css';

export default function ReferenceBackbonePanel({ domain = 'nen', onSearch }) {
  const record = referenceBackbonePrototype.domains[domain];
  if (!record) return null;
  return <aside className={`reference-backbone reference-backbone--${record.id}`} aria-labelledby={`reference-backbone-${record.id}`}>
    <header className="reference-backbone__masthead">
      <div>
        <span>{referenceBackbonePrototype.batch} · {record.eyebrow}</span>
        <h2 id={`reference-backbone-${record.id}`}>{record.title}</h2>
        <p>{record.deck}</p>
      </div>
      <dl>
        {record.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
    </header>

    <div className="reference-backbone__lanes" aria-label={`${record.title} backbone lanes`}>
      {record.lanes.map(([name, detail], index) => <article key={name}>
        <i>{String(index + 1).padStart(2, '0')}</i>
        <h3>{name}</h3>
        <p>{detail}</p>
      </article>)}
    </div>

    <div className="reference-backbone__workspace">
      <section>
        <header><span>Prototype records</span><h3>What the page must now be able to hold</h3></header>
        <div className="reference-backbone__records">
          {record.records.map((item) => <article key={item.name}>
            <small>{item.type} · {item.arc}</small>
            <h4>{item.name}</h4>
            <p>{item.focus}</p>
            {onSearch && <button type="button" onClick={() => onSearch(item.name)}>Search this record <ArrowRight size={12} /></button>}
          </article>)}
        </div>
      </section>
      <aside>
        <header><span>Chimera Ant bridge</span><h3>Why this belongs after Batch 7</h3></header>
        <p>{referenceBackbonePrototype.thesis}</p>
        <div className="reference-backbone__chips">
          {record.chimeraBridge.map((item) => <button type="button" onClick={() => onSearch?.(item)} key={item}>{item}</button>)}
        </div>
        <ol>
          {record.nextActions.map((item, index) => <li key={item}><i>{String(index + 1).padStart(2, '0')}</i><span>{item}</span></li>)}
        </ol>
        <div className="reference-backbone__sources">
          {record.sources.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>{item.label}<ExternalLink size={11} /></a>)}
        </div>
      </aside>
    </div>
  </aside>;
}
