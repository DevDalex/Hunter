import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { arcs } from '../data/arcs';
import { chapters } from '../data/chapters';
import { generalCharacterGroups, generalCharacterUniqueCount } from '../data/generalCharacterSnapshot';
import { successionRosterGroups } from '../data/successionRoster';
import { nenRecords } from '../data/nenEncyclopedia';
import { hunterpediaMasterCounts, hunterpediaMasterSources, nenTaxonomy, timelineIndex, worldIndexSections } from '../data/hunterpediaMasterIndex';

const tabs = [
  ['chapters', 'Chapters'], ['arcs', 'Story arcs'], ['timeline', 'Timeline'], ['characters', 'Characters'], ['world', 'World'], ['nen', 'Nen'],
];
const sourceForName = (name) => `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}`;
const matches = (query, value) => !query || String(value).toLowerCase().includes(query);

export default function HunterpediaMasterIndex({ spoilerLimit = 413, initialTab = 'chapters', initialQuery = '' }) {
  const [tab, setTab] = useState(tabs.some(([id]) => id === initialTab) ? initialTab : 'chapters');
  const [query, setQuery] = useState(initialQuery);
  const normalized = query.trim().toLowerCase();
  const visibleChapters = useMemo(() => chapters.filter((chapter) => chapter.number <= spoilerLimit && matches(normalized, `${chapter.number} ${chapter.title} ${chapter.arcTitle} ${chapter.volume || ''}`)), [normalized, spoilerLimit]);
  const uniqueSuccessionCount = new Set(successionRosterGroups.flatMap((group) => group.members.map((person) => person.name))).size;
  useEffect(() => { if (tabs.some(([id]) => id === initialTab)) setTab(initialTab); }, [initialTab]);
  useEffect(() => setQuery(initialQuery), [initialQuery]);

  return (
    <section className="hunterpedia-master" id="hunterpedia-master-index">
      <div className="section-heading"><div><span className="section-kicker">Hunterpedia source map</span><h2>Master manga index</h2></div><p>Six source libraries in the requested order. Every item is searchable, stays inside its own view, and opens the matching Hunterpedia record.</p></div>
      <div className="hunterpedia-master__sources">{hunterpediaMasterSources.map((source) => <a href={source.source} target="_blank" rel="noreferrer" key={source.name}>{source.name}<ExternalLink size={10} /></a>)}</div>
      <div className="hunterpedia-master__stats">
        <div><strong>{chapters.filter((chapter) => chapter.number <= spoilerLimit).length}</strong><span>chapters</span></div><div><strong>{arcs.length}</strong><span>official arcs</span></div><div><strong>{timelineIndex.length}</strong><span>timeline blocks</span></div><div><strong>{generalCharacterUniqueCount + uniqueSuccessionCount}</strong><span>directory records</span></div><div><strong>{hunterpediaMasterCounts.world}</strong><span>world entries</span></div><div><strong>{hunterpediaMasterCounts.nen + nenRecords.length}</strong><span>Nen entries</span></div>
      </div>
      <div className="hunterpedia-master__toolbar">
        <nav aria-label="Hunterpedia master index sections">{tabs.map(([id, label]) => <button className={tab === id ? 'is-active' : ''} onClick={() => { setTab(id); setQuery(''); }} key={id}>{label}</button>)}</nav>
        <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tabs.find(([id]) => id === tab)?.[1].toLowerCase()}…`} />{query && <button onClick={() => setQuery('')}>Clear</button>}</label>
      </div>

      {tab === 'chapters' && <div className="master-chapter-index">{visibleChapters.map((chapter) => <a href={chapter.sourceUrl} target="_blank" rel="noreferrer" key={chapter.number}><i>{String(chapter.number).padStart(3, '0')}</i><span><strong>{chapter.title}</strong><small>{chapter.arcTitle} · {chapter.volume ? `Volume ${chapter.volume}` : 'Uncollected'}</small></span></a>)}</div>}
      {tab === 'arcs' && <div className="master-arc-index">{arcs.filter((arc) => matches(normalized, `${arc.title} ${arc.premise} ${arc.focus.join(' ')}`)).map((arc) => <a href={arc.source} target="_blank" rel="noreferrer" key={arc.id}><span>{arc.order} · Chapters {arc.chapters[0]}–{Math.min(arc.chapters[1], spoilerLimit)}</span><h3>{arc.title}</h3><p>{arc.premise}</p><small>{arc.phases.join(' · ')}</small></a>)}</div>}
      {tab === 'timeline' && <div className="master-timeline-index">{timelineIndex.filter((entry) => matches(normalized, `${entry.era} ${entry.precision} ${entry.topics.join(' ')}`)).map((entry, index) => <a href={entry.source} target="_blank" rel="noreferrer" key={`${entry.era}-${index}`}><i>{String(index + 1).padStart(2, '0')}</i><div><span>{entry.precision}</span><h3>{entry.era}</h3><p>{entry.topics.join(' · ')}</p></div></a>)}</div>}
      {tab === 'characters' && <div className="master-character-index">
        {[...generalCharacterGroups.map((group) => ({ title: group.title, source: sourceForName(group.title), names: group.names })), ...successionRosterGroups.map((group) => ({ title: `Succession · ${group.title}`, source: group.source, names: group.members.map((person) => person.name) }))].map((group) => {
          const visible = group.names.filter((name) => matches(normalized, `${group.title} ${name}`)); if (!visible.length) return null;
          return <details open={Boolean(normalized)} key={group.title}><summary><span>{visible.length} records</span><strong>{group.title}</strong></summary><div>{visible.map((name) => <a href={sourceForName(name)} target="_blank" rel="noreferrer" key={`${group.title}-${name}`}>{name}</a>)}</div></details>;
        })}
      </div>}
      {tab === 'world' && <div className="master-world-index">{worldIndexSections.map((section) => {
        const groups = section.groups.map((group) => ({ ...group, items: group.items.filter((entry) => matches(normalized, `${section.title} ${group.name} ${entry.name}`)) })).filter((group) => group.items.length); if (!groups.length) return null;
        return <section key={section.id}><header><span>{groups.reduce((total, group) => total + group.items.length, 0)} indexed entries</span><h3>{section.title}</h3><p>{section.description}</p></header>{groups.map((group) => <details open={Boolean(normalized)} key={group.name}><summary>{group.name}<span>{group.items.length}</span></summary><div>{group.items.map((entry) => <a href={entry.source} target="_blank" rel="noreferrer" key={entry.name}>{entry.name}</a>)}</div></details>)}</section>;
      })}</div>}
      {tab === 'nen' && <div className="master-nen-index">
        {nenTaxonomy.map((section) => { const items = section.items.filter((entry) => matches(normalized, `${section.title} ${entry.name}`)); if (!items.length) return null; return <section key={section.title}><header><span>{items.length} source topics</span><h3>{section.title}</h3></header><div>{items.map((entry) => <a href={entry.source} target="_blank" rel="noreferrer" key={entry.name}>{entry.name}</a>)}</div></section>; })}
        <section><header><span>{nenRecords.filter((entry) => matches(normalized, `${entry.name} ${entry.user || ''} ${entry.type || ''}`)).length} study records</span><h3>Named concepts and abilities already researched</h3></header><div>{nenRecords.filter((entry) => matches(normalized, `${entry.name} ${entry.user || ''} ${entry.type || ''}`)).map((entry) => <a href={entry.source} target="_blank" rel="noreferrer" key={entry.id}>{entry.name}{entry.user ? ` · ${entry.user}` : ''}</a>)}</div></section>
      </div>}
    </section>
  );
}
