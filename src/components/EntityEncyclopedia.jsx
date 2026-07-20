import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Grid2X2, List, Route, Search, X } from 'lucide-react';
import {
  encyclopediaById,
  encyclopediaCategories,
  encyclopediaRecords,
  encyclopediaStats,
  findEncyclopediaRecord,
} from '../data/encyclopedia';
import { getEntityResearchTrail, summarizeEntityResearchTrail } from '../data/entityResearchTrails';
import { mediaRegistryStats } from '../data/mediaRegistry';
import { notifyStudyDataChanged, readStoredJson, writeStoredJson } from '../lib/browserStorage';
import CharacterProfileDossier from './CharacterProfileDossier';
import FandomImage from './FandomImage';
import HorizontalScrollHint from './HorizontalScrollHint';
import SafeImage from './SafeImage';
import SourcePortrait, { sourcePortraitStats } from './SourcePortrait';

const PAGE_SIZE = 54;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const categoryLabel = (id) => encyclopediaCategories.find((item) => item.id === id)?.label || 'Encyclopedia';

const readIds = (key) => {
  const stored = readStoredJson(key, []);
  return Array.isArray(stored) ? stored : [];
};

const factValue = (item, label) => item.facts.find((fact) => fact.label === label)?.value || '';

function EntityResultThumb({ item, image }) {
  const [available, setAvailable] = useState(Boolean(image));
  useEffect(() => setAvailable(Boolean(image)), [image]);
  if (!image || !available) return null;
  return <span className="entity-result-thumb" data-image-frame><SafeImage src={image} media={item.media} alt="" onAvailabilityChange={setAvailable} />{item.statusCode === 'deceased' && <i aria-hidden="true">×</i>}</span>;
}

export default function EntityEncyclopedia({ initialCategory = 'characters', initialQuery = '', initialRecord = '', spoilerLimit = Number.MAX_SAFE_INTEGER }) {
  const validInitialCategory = encyclopediaCategories.some((item) => item.id === initialCategory) ? initialCategory : 'characters';
  const [category, setCategory] = useState(validInitialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [letter, setLetter] = useState('all');
  const [status, setStatus] = useState('all');
  const [depth, setDepth] = useState('all');
  const [affiliation, setAffiliation] = useState('all');
  const [era, setEra] = useState('all');
  const [portraitCoverage, setPortraitCoverage] = useState('all');
  const [characterView, setCharacterView] = useState('portraits');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(initialRecord && encyclopediaById.has(initialRecord) ? initialRecord : '');
  const [bookmarks, setBookmarks] = useState(() => new Set(readIds('hxh-bookmarks')));

  useEffect(() => {
    if (encyclopediaCategories.some((item) => item.id === initialCategory)) setCategory(initialCategory);
  }, [initialCategory]);
  useEffect(() => setQuery(initialQuery), [initialQuery]);
  useEffect(() => {
    if (initialRecord && encyclopediaById.has(initialRecord)) setSelectedId(initialRecord);
  }, [initialRecord]);

  const visible = useMemo(() => {
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return encyclopediaRecords
      .filter((item) => item.category === category)
      .filter((item) => !item.chapter || item.chapter <= spoilerLimit)
      .filter((item) => letter === 'all' || item.name.toUpperCase().startsWith(letter))
      .filter((item) => status === 'all' || item.statusCode === status)
      .filter((item) => depth === 'all' || (depth === 'researched' ? item.researchLevel !== 'Hunterpedia source index' : item.researchLevel === 'Hunterpedia source index'))
      .filter((item) => category !== 'characters' || affiliation === 'all' || factValue(item, 'Indexed under').split(' · ').includes(affiliation))
      .filter((item) => category !== 'characters' || portraitCoverage === 'all' || (portraitCoverage === 'stored' ? Boolean(item.image) : !item.image))
      .filter((item) => {
        if (category !== 'characters' || era === 'all') return true;
        const scope = factValue(item, 'Series scope');
        if (era === 'pre') return scope.includes('Pre-Succession');
        if (era === 'succession') return scope.includes('Succession');
        if (era === 'cross') return scope === 'Pre-Succession and Succession';
        return scope.startsWith('Source directory');
      })
      .filter((item) => !terms.length || terms.every((term) => `${item.name} ${item.kind} ${item.summary} ${item.facts.map((fact) => `${fact.label} ${fact.value}`).join(' ')} ${item.related.join(' ')} ${item.tags.join(' ')}`.toLowerCase().includes(term)))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [affiliation, category, depth, era, letter, portraitCoverage, query, spoilerLimit, status]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = encyclopediaById.get(selectedId) || visible[0] || null;
  const selectedIndex = selected ? visible.findIndex((item) => item.id === selected.id) : -1;
  const studyTrail = useMemo(() => getEntityResearchTrail(selected), [selected]);
  const studyTrailSummary = useMemo(() => summarizeEntityResearchTrail(studyTrail), [studyTrail]);
  const characterAffiliations = useMemo(() => [...new Set(encyclopediaRecords.filter((item) => item.category === 'characters').flatMap((item) => factValue(item, 'Indexed under').split(' · ').filter(Boolean)))].sort((a, b) => a.localeCompare(b)), []);
  const storyGroups = useMemo(() => {
    if (category !== 'characters' || characterView !== 'story') return [];
    const groups = new Map();
    visible.forEach((item) => {
      const group = factValue(item, 'Indexed under').split(' · ')[0] || 'Other characters';
      groups.set(group, [...(groups.get(group) || []), item]);
    });
    return [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [category, characterView, visible]);

  useEffect(() => setPage(1), [affiliation, category, depth, era, letter, portraitCoverage, query, status]);
  useEffect(() => {
    if (!visible.length) { setSelectedId(''); return; }
    if (!visible.some((item) => item.id === selectedId)) setSelectedId(visible[0].id);
  }, [selectedId, visible]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const writeRoute = (nextCategory, recordId = '', search = '') => {
    const params = new URLSearchParams({ category: nextCategory });
    if (recordId) params.set('record', recordId);
    if (search) params.set('search', search);
    window.history.replaceState(null, '', `#/reference/encyclopedia?${params}`);
  };

  const chooseCategory = (nextCategory) => {
    const first = encyclopediaRecords.find((item) => item.category === nextCategory && (!item.chapter || item.chapter <= spoilerLimit));
    setCategory(nextCategory);
    setQuery('');
    setLetter('all');
    setStatus('all');
    setDepth('all');
    setAffiliation('all');
    setEra('all');
    setPortraitCoverage('all');
    setSelectedId(first?.id || '');
    writeRoute(nextCategory, first?.id || '');
  };

  const remember = (item) => {
    if (!item) return;
    const recent = readIds('hxh-recent-records').filter((id) => id !== item.id);
    writeStoredJson('hxh-recent-records', [item.id, ...recent].slice(0, 16));
    notifyStudyDataChanged();
  };

  const chooseRecord = (item) => {
    setSelectedId(item.id);
    const index = visible.findIndex((record) => record.id === item.id);
    if (index >= 0) setPage(Math.floor(index / PAGE_SIZE) + 1);
    remember(item);
    writeRoute(item.category, item.id, query);
  };

  const toggleBookmark = (item) => {
    setBookmarks((current) => {
      const next = new Set(current);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      writeStoredJson('hxh-bookmarks', [...next]);
      notifyStudyDataChanged();
      return next;
    });
  };

  const openRelated = (term) => {
    const match = findEncyclopediaRecord(term, category) || findEncyclopediaRecord(term);
    if (match) {
      setCategory(match.category);
      setQuery('');
      setLetter('all');
      setStatus('all');
      setDepth('all');
      setAffiliation('all');
      setEra('all');
      setPortraitCoverage('all');
      setSelectedId(match.id);
      setPage(1);
      remember(match);
      writeRoute(match.category, match.id);
      return;
    }
    setQuery(term);
    setLetter('all');
    setPage(1);
    writeRoute(category, '', term);
  };

  const moveSelection = (amount) => {
    if (selectedIndex < 0) return;
    const next = visible[selectedIndex + amount];
    if (next) chooseRecord(next);
  };

  const portraitFor = (item) => item?.image || '';

  return (
    <section className="entity-encyclopedia" id="entity-encyclopedia">
      <header className="entity-encyclopedia__masthead">
        <div>
          <span className="section-kicker">Browse and connect</span>
          <h2>Start with a name. Follow the story around it.</h2>
          <p>Characters, factions, places, powers, conflicts, objects, relationships, deaths, and exceptional states share one connected index.</p>
        </div>
        <dl>
          <div><dt>Records</dt><dd>{encyclopediaStats.records}</dd></div>
          <div><dt>Characters</dt><dd>{encyclopediaStats.characters}</dd></div>
          <div><dt>Relations</dt><dd>{encyclopediaStats.relationships}</dd></div>
          <div><dt>Categories</dt><dd>{encyclopediaStats.categories}</dd></div>
        </dl>
      </header>

      <aside className="entity-media-coverage" aria-label="Hunterpedia media coverage">
        <div><span>Complete character directory</span><strong>{sourcePortraitStats.totalCharacters} <small>names</small></strong><progress value={sourcePortraitStats.totalCharacters} max={sourcePortraitStats.totalCharacters} aria-label={`${sourcePortraitStats.totalCharacters} character names indexed`} /></div>
        <div><span>Locally verified portraits</span><strong>{sourcePortraitStats.locallyStored} <small>of {sourcePortraitStats.totalCharacters}</small></strong><progress value={sourcePortraitStats.locallyStored} max={sourcePortraitStats.totalCharacters} aria-label={`${sourcePortraitStats.locallyStored} of ${sourcePortraitStats.totalCharacters} character portraits stored locally`} /></div>
        <p><b>Portrait policy.</b> The 106 priority portraits are stored and verified. Remaining identities attempt a visible Hunterpedia file-page portrait and fall back to initials when no source image resolves; the interface never invents a face.</p>
      </aside>

      <nav className="entity-category-nav" aria-label="Encyclopedia categories">
        {encyclopediaCategories.map((item) => (
          <button type="button" className={category === item.id ? 'is-active' : ''} aria-current={category === item.id ? 'page' : undefined} onClick={() => chooseCategory(item.id)} key={item.id}>
            <span>{item.label}</span><b>{item.count}</b>
          </button>
        ))}
      </nav>
      <HorizontalScrollHint>Swipe the category shelf sideways on smaller screens; every category remains available without shrinking its label.</HorizontalScrollHint>

      <div className="entity-encyclopedia__toolbar">
        <label className="entity-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${categoryLabel(category).toLowerCase()}, facts, aliases, or related records…`} />{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label>
        <select value={depth} onChange={(event) => setDepth(event.target.value)} aria-label="Filter local research depth">
          <option value="all">All research depths</option>
          <option value="researched">Locally researched</option>
          <option value="source-index">Source-index only</option>
        </select>
        {(category === 'characters' || category === 'status') && <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter status">
          <option value="all">All statuses</option>
          <option value="active">Maintained active</option>
          <option value="deceased">Confirmed deceased</option>
          <option value="exceptional">Exceptional state</option>
          <option value="unreviewed">Not locally reviewed</option>
        </select>}
        <span role="status" aria-live="polite">{visible.length} matching records</span>
      </div>

      {category === 'characters' && <div className="entity-alphabet" aria-label="Filter character names by first letter">
        <button className={letter === 'all' ? 'is-active' : ''} onClick={() => setLetter('all')}>All</button>
        {alphabet.map((item) => <button className={letter === item ? 'is-active' : ''} onClick={() => setLetter(item)} key={item}>{item}</button>)}
      </div>}

      {category === 'characters' && <div className="character-encyclopedia-controls">
        <nav aria-label="Character directory display">
          <button className={characterView === 'portraits' ? 'is-active' : ''} onClick={() => setCharacterView('portraits')}><Grid2X2 size={15} />Portrait gallery</button>
          <button className={characterView === 'index' ? 'is-active' : ''} onClick={() => setCharacterView('index')}><List size={15} />Research index</button>
          <button className={characterView === 'story' ? 'is-active' : ''} onClick={() => setCharacterView('story')}><Route size={15} />Story groups</button>
        </nav>
        <label><span>Affiliation / story group</span><select value={affiliation} onChange={(event) => setAffiliation(event.target.value)}><option value="all">All affiliations</option>{characterAffiliations.map((item) => <option value={item} key={item}>{item}</option>)}</select></label>
        <label><span>Story era</span><select value={era} onChange={(event) => setEra(event.target.value)}><option value="all">All eras</option><option value="pre">Pre-Succession</option><option value="succession">Succession</option><option value="cross">Cross-era characters</option><option value="unreviewed">Source scope not reviewed</option></select></label>
        <label><span>Portrait state</span><select value={portraitCoverage} onChange={(event) => setPortraitCoverage(event.target.value)}><option value="all">All portrait states</option><option value="stored">Locally verified portrait</option><option value="source">Hunterpedia source lookup</option></select></label>
        <p><b>{paged.filter((item) => item.media?.storage === 'local').length}</b> locally stored portraits on this page · <b>{paged.filter((item) => !item.image).length}</b> source-page portrait attempts.</p>
      </div>}

      <div className="entity-encyclopedia__context">
        <div><span>{categoryLabel(category)}</span><h3>{encyclopediaCategories.find((item) => item.id === category)?.description}</h3></div>
        <p><b>Record depth varies.</b> Some entries contain a full local account; others provide a searchable identity and direct Hunterpedia record.</p>
      </div>

      <div className={`entity-workbench${category === 'characters' ? ` is-character-view-${characterView}` : ''}`}>
        <aside className="entity-result-column" aria-label={`${categoryLabel(category)} results`}>
          {category === 'characters' && characterView === 'portraits' ? <div className="character-portrait-browser" role="listbox" aria-label="Character portrait gallery">
            {paged.map((item) => <button type="button" role="option" aria-selected={selected?.id === item.id} className={`${selected?.id === item.id ? 'is-active' : ''}${item.statusCode === 'deceased' ? ' is-deceased' : ''}${item.image ? ' has-image' : ' has-source-portrait'}`} onClick={() => chooseRecord(item)} key={item.id}><SourcePortrait item={item} alt={`${item.name} portrait from Hunterpedia`} />{item.statusCode === 'deceased' && <i aria-label="Confirmed deceased">×</i>}<small>{item.kind}</small><strong>{item.name}</strong><em>{item.researchLevel}</em></button>)}
            {!paged.length && <div className="entity-empty"><strong>No matching records</strong><p>Clear a filter or try a broader spelling.</p></div>}
          </div> : category === 'characters' && characterView === 'story' ? <div className="character-story-browser" aria-label="Characters grouped by story affiliation">
            {storyGroups.map(([group, records]) => <section key={group}><header><span>{records.length} records</span><h3>{group}</h3></header><div>{records.map((item) => <button type="button" className={`${selected?.id === item.id ? 'is-active' : ''}${item.statusCode === 'deceased' ? ' is-deceased' : ''}`} onClick={() => chooseRecord(item)} key={item.id}><strong>{item.name}</strong><small>{item.kind} · {item.researchLevel}</small></button>)}</div></section>)}
            {!storyGroups.length && <div className="entity-empty"><strong>No matching records</strong><p>Clear a filter or try a broader spelling.</p></div>}
          </div> : <div className="entity-result-list" role="listbox" aria-label={`${categoryLabel(category)} records`}>
            {paged.map((item) => { const image = portraitFor(item); return <button type="button" role="option" aria-selected={selected?.id === item.id} className={`${selected?.id === item.id ? 'is-active' : ''}${item.statusCode === 'deceased' ? ' is-deceased' : ''}${image ? ' has-image' : ''}`} onClick={() => chooseRecord(item)} key={item.id}>{category === 'characters' ? <SourcePortrait item={item} className="entity-result-thumb" decorative /> : <EntityResultThumb item={item} image={image} />}<span className="entity-result-copy"><small>{item.kind}</small><strong>{item.name}</strong><em>{item.researchLevel}</em></span></button>; })}
            {!paged.length && <div className="entity-empty"><strong>No matching records</strong><p>Clear a filter or try a broader spelling.</p></div>}
          </div>}
          {characterView !== 'story' && pageCount > 1 && <footer className="entity-pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {pageCount}</span><button disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>Next</button></footer>}
        </aside>

        <div className="entity-detail-column">
          {selected ? <article className={`entity-record${selected.statusCode === 'deceased' ? ' is-deceased' : ''}`}>
            <header className="entity-record__header">
              <div><span>{categoryLabel(selected.category)} · {selected.kind}</span><h2>{selected.name}</h2><p>{selected.summary}</p></div>
              <div className="entity-record__actions">
                <button className={bookmarks.has(selected.id) ? 'is-active' : ''} onClick={() => toggleBookmark(selected)}>{bookmarks.has(selected.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}{bookmarks.has(selected.id) ? 'Saved' : 'Save'}</button>
                <a href={selected.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={13} /></a>
              </div>
            </header>

            <div className="entity-record__identity">
              {selected.category === 'characters' ? <SourcePortrait item={selected} className={`entity-record-image${selected.statusCode === 'deceased' ? ' is-deceased' : ''}`} alt={`${selected.name} from Hunterpedia`} eager showState /> : portraitFor(selected) && <FandomImage source={selected.source} fallbackImage={portraitFor(selected)} media={selected.media} className={`entity-record-image${selected.statusCode === 'deceased' ? ' is-deceased' : ''}`} alt={`${selected.name} from Hunterpedia`} eager />}
              <div>
                <span className={`entity-status entity-status--${selected.statusCode}`}>{selected.statusLabel}</span>
                <dl>{selected.facts.map((fact) => <div key={`${selected.id}-${fact.label}`}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
              </div>
            </div>

            <CharacterProfileDossier selected={selected} onOpenRelated={openRelated} />

            <section className="entity-record__relations">
              <header><span>Cross-links</span><h3>Connected records</h3></header>
              <div>{selected.related.length ? selected.related.map((item) => <button type="button" onClick={() => openRelated(item)} key={item}>{item}</button>) : <p>No local cross-links have been assigned to this source-index record yet.</p>}</div>
            </section>

            {studyTrail.length > 0 && <section className="entity-record__study-trail">
              <header><div><span>Story trail</span><h3>Where this record enters the manga</h3></div><p>{studyTrailSummary.phases} narrative movement{studyTrailSummary.phases === 1 ? '' : 's'} · Chapters {studyTrailSummary.range} · {studyTrailSummary.arcs.join(' · ')}</p></header>
              <div>{studyTrail.map((item) => <article key={item.id}><span>{item.arcTitle} · {item.chapters}</span><h4>{item.phase}</h4><p>{item.summary}</p><small>Connected through: {item.matched.join(' · ')}</small><footer><button type="button" onClick={() => { window.location.hash = `#/series/chapters?chapter=${item.range[0]}`; }}>Open chapter record</button><a href={item.source} target="_blank" rel="noreferrer">Hunterpedia <ExternalLink size={10} /></a></footer></article>)}</div>
              <p className="entity-record__trail-boundary">This is a broad story trail, not a complete ordered appearance list. It shows the locally indexed narrative movements that explicitly name this record.</p>
            </section>}

            <footer className="entity-record__integrity">
              <div><span>Record depth</span><strong>{selected.researchLevel}</strong></div>
              <div><span>Last reviewed</span><strong>{selected.reviewed}</strong></div>
              <div><span>Source policy</span><strong>Hunterpedia / Fandom only</strong></div>
            </footer>

            <nav className="entity-record__sequence" aria-label="Move through filtered records"><button disabled={selectedIndex <= 0} onClick={() => moveSelection(-1)}>Previous record</button><span>{selectedIndex >= 0 ? selectedIndex + 1 : 0} / {visible.length}</span><button disabled={selectedIndex < 0 || selectedIndex >= visible.length - 1} onClick={() => moveSelection(1)}>Next record</button></nav>
          </article> : <div className="entity-empty entity-empty--detail"><strong>No record selected</strong><p>Choose a category or clear the current filters.</p></div>}
        </div>
      </div>

    </section>
  );
}
