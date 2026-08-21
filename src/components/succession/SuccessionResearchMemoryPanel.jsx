import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Clock3, GitCompareArrows, LibraryBig, Plus, Search, Trash2 } from 'lucide-react';
import { getEntityById } from '../../data/succession/successionData';
import {
  SUCCESSION_ARCHIVE_MEMORY_EVENT,
  clearSuccessionCompareTray,
  createSuccessionWatchlist,
  deleteSuccessionWatchlist,
  readSuccessionArchiveMemory,
  removeSuccessionArchiveSearch,
  toggleSuccessionArchiveBookmark,
  toggleSuccessionWatchlistItem,
} from '../../data/succession/archiveMemory';
import './SuccessionResearchMemoryPanel.css';

const describeItem = (item) => {
  const entity = item.entityId ? getEntityById(item.entityId) : null;
  return {
    label: entity?.name || item.label || item.route,
    type: entity?.entityType || item.route,
    entity,
  };
};

const formatWhen = (value) => {
  const parsed = Date.parse(String(value || ''));
  if (!Number.isFinite(parsed)) return 'Saved locally';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(parsed));
};

function OpenItemButton({ item, onNavigate, label = 'Open' }) {
  return <button type="button" onClick={() => onNavigate(item.route, item.params || {})}>{label} <ArrowRight size={11} aria-hidden="true" /></button>;
}

export default function SuccessionResearchMemoryPanel({ spoilerLimit = 417, onNavigate }) {
  const [memory, setMemory] = useState(readSuccessionArchiveMemory);
  const [watchlistName, setWatchlistName] = useState('');
  const [watchlistPick, setWatchlistPick] = useState({});

  useEffect(() => {
    const refresh = () => setMemory(readSuccessionArchiveMemory());
    window.addEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
  }, []);

  const compareRows = useMemo(() => memory.compare.map((item) => ({ item, ...describeItem(item) })), [memory.compare]);
  const compareTypes = [...new Set(compareRows.map((row) => row.entity?.entityType).filter(Boolean))];
  const compareReady = compareRows.length >= 2 && compareTypes.length === 1;
  const recent = memory.recent.slice(0, 8);
  const bookmarks = memory.bookmarks.slice(0, 12);

  const runCompare = () => {
    if (!compareReady) return;
    onNavigate('research', {
      mode: 'compare',
      type: compareTypes[0],
      compare: compareRows.map((row) => row.entity.id).join(','),
    });
  };

  const createWatchlist = (event) => {
    event.preventDefault();
    if (!watchlistName.trim()) return;
    createSuccessionWatchlist(watchlistName);
    setWatchlistName('');
  };

  return <section className="succession-research-memory" aria-labelledby="succession-research-memory-title">
    <header className="succession-research-memory__hero">
      <span><LibraryBig size={15} aria-hidden="true" /> Research memory · local only</span>
      <h2 id="succession-research-memory-title">Continue where you left off instead of rebuilding your mental map</h2>
      <p>Visits, bookmarks, saved searches, watchlists and the compare tray stay in this browser. Nothing in this panel is uploaded or treated as canonical archive data.</p>
    </header>

    <div className="succession-research-memory__summary">
      <div><span>Recent</span><b>{memory.recent.length}</b></div>
      <div><span>Bookmarks</span><b>{memory.bookmarks.length}</b></div>
      <div><span>Saved searches</span><b>{memory.savedSearches.length}</b></div>
      <div><span>Compare tray</span><b>{memory.compare.length}/4</b></div>
      <div><span>Watchlists</span><b>{memory.watchlists.length}</b></div>
    </div>

    <div className="succession-research-memory__grid">
      <section>
        <header><span><Clock3 size={13} aria-hidden="true" /> Continue researching</span><h3>Recently opened archive contexts</h3></header>
        <ol className="succession-research-memory__items">{recent.map((item) => { const record = describeItem(item); return <li key={`${item.route}:${item.entityId || JSON.stringify(item.params)}`}><div><b>{record.label}</b><small>{record.type.replaceAll('-', ' ')} · {formatWhen(item.visitedAt)}</small></div><OpenItemButton item={item} onNavigate={onNavigate} /></li>; })}</ol>
        {!recent.length && <p className="succession-research-memory__empty">Open archive records and they will appear here.</p>}
        {memory.recent.length > recent.length && <small className="succession-research-memory__shown">Showing {recent.length} of {memory.recent.length} recent contexts.</small>}
      </section>

      <section>
        <header><span><Bookmark size={13} aria-hidden="true" /> Saved records</span><h3>Archive bookmarks</h3></header>
        <ol className="succession-research-memory__items">{bookmarks.map((item) => { const record = describeItem(item); return <li key={`${item.route}:${item.entityId || JSON.stringify(item.params)}`}><div><b>{record.label}</b><small>{record.type.replaceAll('-', ' ')} · {formatWhen(item.savedAt)}</small></div><div className="succession-research-memory__row-actions"><OpenItemButton item={item} onNavigate={onNavigate} /><button type="button" aria-label={`Remove bookmark ${record.label}`} onClick={() => toggleSuccessionArchiveBookmark(item)}><Trash2 size={12} aria-hidden="true" /> Remove</button></div></li>; })}</ol>
        {!bookmarks.length && <p className="succession-research-memory__empty">Use “Save current” in the chapter context bar to bookmark a workspace or record.</p>}
        {memory.bookmarks.length > bookmarks.length && <small className="succession-research-memory__shown">Showing {bookmarks.length} of {memory.bookmarks.length} bookmarks.</small>}
      </section>

      <section className="is-compare">
        <header><span><GitCompareArrows size={13} aria-hidden="true" /> Compare tray</span><h3>Collect up to four records, then hand them to the existing comparison engine</h3></header>
        <div className="succession-research-memory__compare">{compareRows.map(({ item, label, type }) => <article key={item.entityId}><span>{type.replaceAll('-', ' ')}</span><b>{label}</b></article>)}</div>
        {!compareRows.length && <p className="succession-research-memory__empty">Open a canonical entity and use “Compare current” in the context bar.</p>}
        {compareRows.length > 1 && compareTypes.length > 1 && <p className="succession-research-memory__warning">The current Research comparison engine compares same-type records. Remove mixed record types before comparing.</p>}
        <footer><button type="button" disabled={!compareReady} onClick={runCompare}>Compare {compareRows.length || ''} record{compareRows.length === 1 ? '' : 's'} <ArrowRight size={12} /></button><button type="button" disabled={!compareRows.length} onClick={clearSuccessionCompareTray}>Clear tray</button></footer>
      </section>

      <section>
        <header><span><Search size={13} aria-hidden="true" /> Saved searches</span><h3>Questions worth returning to</h3></header>
        <ol className="succession-research-memory__items">{memory.savedSearches.map((record) => <li key={record.id}><div><b>{record.query}</b><small>Boundary Ch. {record.chapter} · {formatWhen(record.savedAt)}</small></div><div className="succession-research-memory__row-actions"><button type="button" onClick={() => onNavigate('search', { query: record.query, chapter: Math.min(spoilerLimit, record.chapter) })}>Run <ArrowRight size={11} /></button><button type="button" onClick={() => removeSuccessionArchiveSearch(record.id)}><Trash2 size={12} /> Remove</button></div></li>)}</ol>
        {!memory.savedSearches.length && <p className="succession-research-memory__empty">Save useful questions from Global Search and they will appear here.</p>}
      </section>

      <section className="is-watchlists">
        <header><span><LibraryBig size={13} aria-hidden="true" /> Watchlists</span><h3>Group bookmarked records into research collections</h3></header>
        <form className="succession-research-memory__watchlist-create" onSubmit={createWatchlist}><label><span>New watchlist</span><input value={watchlistName} onChange={(event) => setWatchlistName(event.target.value)} maxLength="120" placeholder="e.g. Halkenburg investigation" /></label><button type="submit" disabled={!watchlistName.trim()}><Plus size={12} /> Create</button></form>
        <div className="succession-research-memory__watchlists">{memory.watchlists.map((watchlist) => <article key={watchlist.id}><header><div><b>{watchlist.name}</b><small>{watchlist.items.length} saved record{watchlist.items.length === 1 ? '' : 's'}</small></div><button type="button" onClick={() => deleteSuccessionWatchlist(watchlist.id)}><Trash2 size={12} /> Delete</button></header><ol>{watchlist.items.slice(0, 8).map((item) => { const record = describeItem(item); return <li key={`${watchlist.id}:${item.route}:${item.entityId || JSON.stringify(item.params)}`}><OpenItemButton item={item} onNavigate={onNavigate} label={record.label} /></li>; })}</ol>{bookmarks.length > 0 && <div className="succession-research-memory__watchlist-add"><select aria-label={`Bookmark to add to ${watchlist.name}`} value={watchlistPick[watchlist.id] || ''} onChange={(event) => setWatchlistPick((current) => ({ ...current, [watchlist.id]: event.target.value }))}><option value="">Choose bookmarked record…</option>{bookmarks.map((item, index) => <option value={index} key={`${watchlist.id}:${item.route}:${item.entityId || index}`}>{describeItem(item).label}</option>)}</select><button type="button" disabled={watchlistPick[watchlist.id] === undefined || watchlistPick[watchlist.id] === ''} onClick={() => { const item = bookmarks[Number(watchlistPick[watchlist.id])]; if (item) toggleSuccessionWatchlistItem(watchlist.id, item); }}>Add</button></div>}</article>)}</div>
        {!memory.watchlists.length && <p className="succession-research-memory__empty">Create a watchlist, then add records from your archive bookmarks.</p>}
      </section>
    </div>
  </section>;
}
