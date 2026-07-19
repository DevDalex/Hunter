import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Search } from 'lucide-react';
import { archiveDirectory, archiveDirectoryScopes } from '../data/archiveDirectory';

export default function ArchiveDirectory({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('All');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return archiveDirectory.filter((item) => (
      (scope === 'All' || item.scope === scope)
      && (!normalized || `${item.letter} ${item.title} ${item.scope} ${item.description} ${item.contents.join(' ')}`.toLowerCase().includes(normalized))
    ));
  }, [query, scope]);

  const open = (item) => onNavigate(item.route.view, item.route.target || '', item.route.params || {});

  return (
    <section className="archive-directory-page" id="archive-directory">
      <div className="section-heading">
        <div><span className="section-kicker">Archive navigation map</span><h2>A–Z study directory</h2></div>
        <p>Every letter opens an implemented part of the project. This is navigation into the chapter, character, Nen, Succession, ship, evidence, and research databases—not a list of future promises.</p>
      </div>
      <div className="archive-directory-page__toolbar">
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ability, mafia, timeline, room…" />{query && <button onClick={() => setQuery('')}>Clear</button>}</label>
        <select value={scope} onChange={(event) => setScope(event.target.value)} aria-label="Filter A to Z directory by scope">{archiveDirectoryScopes.map((item) => <option value={item} key={item}>{item}</option>)}</select>
        <span role="status" aria-live="polite">{visible.length} of 26 sections</span>
      </div>
      <div className="archive-directory-page__letters" aria-label="A to Z archive navigation">
        {archiveDirectory.map((item) => <button className={visible.includes(item) ? '' : 'is-muted'} onClick={() => document.getElementById(`archive-letter-${item.letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })} key={item.letter}>{item.letter}</button>)}
      </div>
      <div className="archive-directory-page__grid">
        {visible.map((item) => (
          <article id={`archive-letter-${item.letter}`} key={item.letter}>
            <header><i>{item.letter}</i><div><span>{item.scope}</span><h3>{item.title}</h3></div></header>
            <p>{item.description}</p>
            <ul>{item.contents.map((content) => <li key={content}>{content}</li>)}</ul>
            <footer><button onClick={() => open(item)}>Open this archive <ArrowRight size={14} /></button><a href={item.source} target="_blank" rel="noreferrer" aria-label={`${item.title} Hunterpedia source`}>Hunterpedia <ExternalLink size={11} /></a></footer>
          </article>
        ))}
      </div>
      {!visible.length && <div className="empty-state"><h3>No matching A–Z section</h3><p>Clear the filter or try a broader archive term.</p></div>}
    </section>
  );
}
