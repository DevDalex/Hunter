import { useEffect, useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { recordBlueprints, researchStandards, worldIndexes } from '../data/referenceLibrary';

export default function ResearchLibrary({ initialIndex, initialQuery = '' }) {
  const [activeIndex, setActiveIndex] = useState(worldIndexes.some((group) => group.id === initialIndex) ? initialIndex : worldIndexes[0].id);
  const [query, setQuery] = useState(initialQuery);
  const selected = worldIndexes.find((group) => group.id === activeIndex) || worldIndexes[0];
  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return selected.items;
    return selected.items.filter((item) => `${item.name} ${item.note}`.toLowerCase().includes(normalized));
  }, [query, selected]);

  useEffect(() => {
    if (worldIndexes.some((group) => group.id === initialIndex)) setActiveIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  return (
    <section className="research-library" id="research-library">
      <div className="section-heading">
        <div><span className="section-kicker">Connected study system</span><h2>Reference library</h2></div>
        <p>Every shelf follows the same maintainable record pattern, with direct Hunterpedia sources and clear separation between verified, provisional, inferred, and unknown information.</p>
      </div>

      <div className="blueprint-grid">
        {recordBlueprints.map((blueprint) => (
          <article key={blueprint.id}>
            <div><BookOpen size={17} /><span>{blueprint.count}</span></div>
            <h3>{blueprint.title}</h3>
            <p>{blueprint.description}</p>
            <ul>{blueprint.fields.map((field) => <li key={field}>{field}</li>)}</ul>
            <a href={blueprint.source} target="_blank" rel="noreferrer">Hunterpedia index <ExternalLink size={12} /></a>
          </article>
        ))}
      </div>

      <div className="library-browser">
        <div className="library-browser__top">
          <nav aria-label="Reference index">
            {worldIndexes.map((group) => <button className={activeIndex === group.id ? 'is-active' : ''} onClick={() => { setActiveIndex(group.id); setQuery(''); }} key={group.id}>{group.title}</button>)}
          </nav>
          <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${selected.title.toLowerCase()}…`} /></label>
        </div>
        <header><span>{visibleItems.length} indexed entries</span><h3>{selected.title}</h3><p>{selected.description}</p></header>
        <div className="library-entry-grid">
          {visibleItems.map((item) => (
            <a href={item.source} target="_blank" rel="noreferrer" key={item.name}>
              <strong>{item.name}</strong><p>{item.note}</p><span>Open source <ExternalLink size={11} /></span>
            </a>
          ))}
          {!visibleItems.length && <p className="library-empty">No entries match this search.</p>}
        </div>
      </div>

      <div className="research-standards">
        <div><span className="section-kicker">Source status</span><h3>How records are labeled</h3></div>
        <dl>{researchStandards.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
      </div>
    </section>
  );
}
