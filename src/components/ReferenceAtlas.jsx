import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Search } from 'lucide-react';
import { referenceEntityRecords, referenceEntitySections } from '../data/referenceEntities';
import { notifyStudyDataChanged, readStoredJson, writeStoredJson } from '../lib/browserStorage';

const readIds = (key) => {
  const stored = readStoredJson(key, []);
  return Array.isArray(stored) ? stored : [];
};

export default function ReferenceAtlas({ initialSection = 'factions', initialQuery = '', singleSection = false }) {
  const sectionExists = referenceEntitySections.some((section) => section.id === initialSection);
  const [activeSection, setActiveSection] = useState(sectionExists ? initialSection : 'factions');
  const [query, setQuery] = useState(initialQuery);
  const [bookmarks, setBookmarks] = useState(() => new Set(readIds('hxh-bookmarks')));
  const [openRecord, setOpenRecord] = useState('');
  const section = referenceEntitySections.find((item) => item.id === activeSection) || referenceEntitySections[0];

  useEffect(() => {
    if (referenceEntitySections.some((item) => item.id === initialSection)) setActiveSection(initialSection);
  }, [initialSection]);
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return section.records.filter((item) => !normalized || `${item.name} ${item.kind} ${item.summary} ${Object.values(item.facts).join(' ')} ${item.related.join(' ')}`.toLowerCase().includes(normalized));
  }, [query, section]);

  const toggleBookmark = (id) => setBookmarks((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    writeStoredJson('hxh-bookmarks', [...next]);
    notifyStudyDataChanged();
    return next;
  });

  const remember = (item) => {
    const recent = readIds('hxh-recent-records').filter((id) => id !== item.id);
    writeStoredJson('hxh-recent-records', [item.id, ...recent].slice(0, 12));
    notifyStudyDataChanged();
    setOpenRecord((current) => current === item.id ? '' : item.id);
  };

  return (
    <section className="reference-atlas" id="reference-atlas">
      <div className="section-heading">
        <div><span className="section-kicker">Structured series records</span><h2>Connected reference atlas</h2></div>
        <p>These are working records, not a shelf of outbound links. Every entry carries comparable facts, related entities, a source state, and a direct Hunterpedia record.</p>
      </div>

      <div className={`reference-atlas__summary${singleSection ? ' reference-atlas__summary--single' : ''}`}>
        <div><strong>{referenceEntityRecords.length}</strong><span>structured records</span></div>
        {(singleSection ? [section] : referenceEntitySections).map((item) => <button className={item.id === activeSection ? 'is-active' : ''} onClick={() => { setActiveSection(item.id); setQuery(''); setOpenRecord(''); }} key={item.id}><strong>{item.records.length}</strong><span>{item.label}</span></button>)}
      </div>

      <div className="reference-atlas__toolbar">
        {!singleSection && <nav aria-label="Reference record types">{referenceEntitySections.map((item) => <button className={item.id === activeSection ? 'is-active' : ''} onClick={() => { setActiveSection(item.id); setQuery(''); setOpenRecord(''); }} key={item.id}>{item.label}</button>)}</nav>}
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${section.title.toLowerCase()}…`} />{query && <button onClick={() => setQuery('')}>Clear</button>}</label>
      </div>

      <header className="reference-atlas__heading"><span>{visible.length} of {section.records.length} records</span><h3>{section.title}</h3><p>{section.description}</p></header>
      <div className="reference-record-grid">
        {visible.map((item) => {
          const expanded = openRecord === item.id;
          const bookmarked = bookmarks.has(item.id);
          return (
            <article className={expanded ? 'is-expanded' : ''} id={`reference-${item.id}`} key={item.id}>
              <header><div><span>{item.kind}</span><h3>{item.name}</h3></div><button className={bookmarked ? 'is-active' : ''} onClick={() => toggleBookmark(item.id)} aria-label={bookmarked ? `Remove ${item.name} bookmark` : `Bookmark ${item.name}`}>{bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button></header>
              <p>{item.summary}</p>
              <dl>{Object.entries(item.facts).slice(0, expanded ? undefined : 3).map(([term, value]) => <div key={term}><dt>{term}</dt><dd>{value}</dd></div>)}</dl>
              <div className="reference-record__related"><b>Related</b>{item.related.map((related) => <span key={related}>{related}</span>)}</div>
              <footer><button onClick={() => remember(item)}>{expanded ? 'Show less' : 'Open full record'}</button><a href={item.source} onClick={() => remember(item)} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={11} /></a><span>{item.status} · reviewed {item.reviewed}</span></footer>
            </article>
          );
        })}
      </div>
      {!visible.length && <div className="empty-state"><h3>No matching record</h3><p>Try a person, place, faction, ability, object, or event name.</p></div>}
    </section>
  );
}
