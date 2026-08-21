import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Bookmark, Clock3, Download, FileText, GitCompareArrows, LibraryBig, Plus, Printer, Save, Search, Tags, Trash2 } from 'lucide-react';
import { getEntityById, getSourcesForEntity } from '../../data/succession/successionData';
import {
  SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT,
  SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT,
  SUCCESSION_ARCHIVE_MEMORY_EVENT,
  SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT,
  SUCCESSION_ARCHIVE_WATCHLIST_STATUSES,
  SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT,
  clearSuccessionCompareTray,
  createSuccessionWatchlist,
  deleteSuccessionWatchlist,
  moveSuccessionWatchlistItem,
  readSuccessionArchiveMemory,
  removeSuccessionArchiveSearch,
  renameSuccessionWatchlist,
  toggleSuccessionArchiveBookmark,
  toggleSuccessionWatchlistCitation,
  toggleSuccessionWatchlistItem,
  updateSuccessionArchiveBookmarkMetadata,
  updateSuccessionWatchlistMetadata,
  updateSuccessionWatchlistNote,
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

const memoryItemKey = (item) => `${item.route}|${item.entityId || ''}|${JSON.stringify(item.params || {})}`;
const normalizeSearchText = (value) => String(value || '').trim().toLocaleLowerCase();

const formatWhen = (value) => {
  const parsed = Date.parse(String(value || ''));
  if (!Number.isFinite(parsed)) return 'Saved locally';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(parsed));
};

const citationCandidatesForWatchlist = (watchlist) => {
  const map = new Map();
  for (const item of watchlist.items) {
    if (!item.entityId) continue;
    for (const source of getSourcesForEntity(item.entityId) || []) map.set(source.id, source);
  }
  return [...map.values()].sort((left, right) => Number(left.chapter || 9999) - Number(right.chapter || 9999) || String(left.name || left.id).localeCompare(String(right.name || right.id)));
};

const citationLine = (source) => {
  const chapter = source.chapter ? `Chapter ${source.chapter}` : source.name || source.id;
  const type = source.sourceType ? ` · ${source.sourceType}` : '';
  const note = source.note ? ` — ${source.note}` : '';
  return `- ${chapter}${type}${note} [${source.id}]`;
};

const markdownForWatchlist = (watchlist) => {
  const records = watchlist.items.map((item, index) => {
    const record = describeItem(item);
    const context = item.context ? ` — ${item.context}` : '';
    return `${index + 1}. **${record.label}** (${record.type.replaceAll('-', ' ')})${context}\n   - Archive route: \`${item.route}\`${item.entityId ? `\n   - Entity: \`${item.entityId}\`` : ''}`;
  });
  const citations = citationCandidatesForWatchlist(watchlist).filter((source) => watchlist.citationIds.includes(source.id));
  return [
    `# ${watchlist.name}`,
    '',
    `Status: **${watchlist.status}**`,
    watchlist.tags.length ? `Tags: ${watchlist.tags.map((tag) => `\`${tag}\``).join(' ')}` : 'Tags: _none_',
    '',
    '## Working thesis / notes',
    '',
    watchlist.note || '_No investigation note saved._',
    '',
    '## Saved records',
    '',
    ...(records.length ? records : ['_No records saved._']),
    '',
    '## Selected citations',
    '',
    ...(citations.length ? citations.map(citationLine) : ['_No citations selected._']),
    '',
    'Exported from Succession Research Memory. Local notes, status, tags, ordering and citation selections are personal research material, not canonical archive data.',
  ].join('\n');
};

const citationBundleForWatchlist = (watchlist) => {
  const citations = citationCandidatesForWatchlist(watchlist).filter((source) => watchlist.citationIds.includes(source.id));
  return [
    `# Citation bundle — ${watchlist.name}`,
    '',
    `Investigation status: ${watchlist.status}`,
    `Selected citations: ${citations.length}`,
    '',
    ...(citations.length ? citations.map(citationLine) : ['_No citations selected._']),
    '',
    'Generated from canonical source records linked to saved investigation entities.',
  ].join('\n');
};

const downloadTextFile = (filename, content, type = 'text/markdown;charset=utf-8') => {
  if (typeof window === 'undefined' || typeof Blob === 'undefined') return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const fileStem = (watchlist) => watchlist.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'succession-research';
const downloadMarkdown = (watchlist) => downloadTextFile(`${fileStem(watchlist)}.md`, markdownForWatchlist(watchlist));
const downloadCitationBundle = (watchlist) => downloadTextFile(`${fileStem(watchlist)}-citations.md`, citationBundleForWatchlist(watchlist));

const printWatchlist = (watchlistId) => {
  if (typeof window === 'undefined') return;
  const target = document.querySelector(`[data-watchlist-id="${CSS.escape(watchlistId)}"]`);
  if (!target) return;
  const cleanup = () => {
    document.body.classList.remove('is-printing-succession-watchlist');
    target.classList.remove('is-print-target');
    window.removeEventListener('afterprint', cleanup);
  };
  document.body.classList.add('is-printing-succession-watchlist');
  target.classList.add('is-print-target');
  window.addEventListener('afterprint', cleanup, { once: true });
  window.print();
  window.setTimeout(cleanup, 1000);
};

function OpenItemButton({ item, onNavigate, label = 'Open' }) {
  return <button type="button" onClick={() => onNavigate(item.route, item.params || {})}>{label} <ArrowRight size={11} aria-hidden="true" /></button>;
}

export default function SuccessionResearchMemoryPanel({ spoilerLimit = 417, onNavigate }) {
  const [memory, setMemory] = useState(readSuccessionArchiveMemory);
  const [watchlistName, setWatchlistName] = useState('');
  const [watchlistPick, setWatchlistPick] = useState({});
  const [noteDrafts, setNoteDrafts] = useState({});
  const [tagDrafts, setTagDrafts] = useState({});
  const [nameDrafts, setNameDrafts] = useState({});
  const [bookmarkDrafts, setBookmarkDrafts] = useState({});
  const [bookmarkQuery, setBookmarkQuery] = useState('');
  const [bookmarkFolder, setBookmarkFolder] = useState('all');
  const [bookmarkSort, setBookmarkSort] = useState('recent');
  const [showAllBookmarks, setShowAllBookmarks] = useState(false);

  useEffect(() => {
    const refresh = () => setMemory(readSuccessionArchiveMemory());
    window.addEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
  }, []);

  const compareRows = useMemo(() => memory.compare.map((item) => ({ item, ...describeItem(item) })), [memory.compare]);
  const compareTypes = [...new Set(compareRows.map((row) => row.entity?.entityType).filter(Boolean))];
  const compareReady = compareRows.length >= 2 && compareTypes.length === 1;
  const recent = memory.recent.slice(0, 8);
  const bookmarkFolders = useMemo(() => [...new Set(memory.bookmarks.map((item) => item.folder || 'Unfiled'))].sort((left, right) => left.localeCompare(right)), [memory.bookmarks]);
  const filteredBookmarks = useMemo(() => {
    const needle = normalizeSearchText(bookmarkQuery);
    const rows = memory.bookmarks.filter((item) => {
      const record = describeItem(item);
      const folder = item.folder || 'Unfiled';
      if (bookmarkFolder !== 'all' && folder !== bookmarkFolder) return false;
      if (!needle) return true;
      return normalizeSearchText([record.label, record.type, folder, ...(item.tags || [])].join(' ')).includes(needle);
    });
    return [...rows].sort((left, right) => {
      const leftRecord = describeItem(left);
      const rightRecord = describeItem(right);
      if (bookmarkSort === 'name') return leftRecord.label.localeCompare(rightRecord.label);
      if (bookmarkSort === 'folder') return String(left.folder || 'Unfiled').localeCompare(String(right.folder || 'Unfiled')) || leftRecord.label.localeCompare(rightRecord.label);
      return (Date.parse(right.savedAt || '') || 0) - (Date.parse(left.savedAt || '') || 0);
    });
  }, [memory.bookmarks, bookmarkQuery, bookmarkFolder, bookmarkSort]);
  const bookmarks = showAllBookmarks ? filteredBookmarks : filteredBookmarks.slice(0, 24);

  const runCompare = () => {
    if (!compareReady) return;
    onNavigate('research', {
      mode: 'compare',
      type: compareTypes[0],
      compare: compareRows.map((row) => row.entity.id).join(','),
      fields: 'differences',
    });
  };

  const createWatchlist = (event) => {
    event.preventDefault();
    if (!watchlistName.trim()) return;
    createSuccessionWatchlist(watchlistName);
    setWatchlistName('');
  };

  const saveNote = (watchlist) => {
    const note = noteDrafts[watchlist.id] ?? watchlist.note ?? '';
    updateSuccessionWatchlistNote(watchlist.id, note);
  };

  const saveTags = (watchlist) => {
    const tags = tagDrafts[watchlist.id] ?? watchlist.tags.join(', ');
    updateSuccessionWatchlistMetadata(watchlist.id, { tags });
  };

  const saveWatchlistName = (watchlist) => {
    const name = nameDrafts[watchlist.id] ?? watchlist.name;
    if (!name.trim()) return;
    renameSuccessionWatchlist(watchlist.id, name);
  };

  const bookmarkDraft = (item) => bookmarkDrafts[memoryItemKey(item)] || { folder: item.folder || '', tags: (item.tags || []).join(', ') };
  const saveBookmarkMetadata = (item) => {
    const draft = bookmarkDraft(item);
    updateSuccessionArchiveBookmarkMetadata(item, { folder: draft.folder, tags: draft.tags });
  };

  return <section className="succession-research-memory" aria-labelledby="succession-research-memory-title">
    <header className="succession-research-memory__hero">
      <span><LibraryBig size={15} aria-hidden="true" /> Research memory · local only</span>
      <h2 id="succession-research-memory-title">Continue where you left off instead of rebuilding your mental map</h2>
      <p>Visits, bookmarks, saved searches, research collections and the compare tray stay in this browser. Notes, status, tags, ordering, citation selections and exports are personal research material, never canonical archive data.</p>
    </header>

    <div className="succession-research-memory__summary">
      <div><span>Recent</span><b>{memory.recent.length}</b></div>
      <div><span>Bookmarks</span><b>{memory.bookmarks.length}</b></div>
      <div><span>Saved searches</span><b>{memory.savedSearches.length}</b></div>
      <div><span>Compare tray</span><b>{memory.compare.length}/4</b></div>
      <div><span>Collections</span><b>{memory.watchlists.length}</b></div>
    </div>

    <div className="succession-research-memory__grid">
      <section>
        <header><span><Clock3 size={13} aria-hidden="true" /> Continue researching</span><h3>Recently opened archive contexts</h3></header>
        <ol className="succession-research-memory__items">{recent.map((item) => { const record = describeItem(item); return <li key={`${item.route}:${item.entityId || JSON.stringify(item.params)}`}><div><b>{record.label}</b><small>{record.type.replaceAll('-', ' ')} · {formatWhen(item.visitedAt)}</small></div><OpenItemButton item={item} onNavigate={onNavigate} /></li>; })}</ol>
        {!recent.length && <p className="succession-research-memory__empty">Open archive records and they will appear here.</p>}
        {memory.recent.length > recent.length && <small className="succession-research-memory__shown">Showing {recent.length} of {memory.recent.length} recent contexts.</small>}
      </section>

      <section className="is-bookmarks">
        <header><span><Bookmark size={13} aria-hidden="true" /> Saved records</span><h3>Archive bookmark manager</h3></header>
        <div className="succession-research-memory__bookmark-controls">
          <label><span>Search bookmarks</span><input type="search" value={bookmarkQuery} onChange={(event) => { setBookmarkQuery(event.target.value); setShowAllBookmarks(false); }} placeholder="name, type, folder, tag…" /></label>
          <label><span>Folder</span><select value={bookmarkFolder} onChange={(event) => { setBookmarkFolder(event.target.value); setShowAllBookmarks(false); }}><option value="all">All folders</option>{bookmarkFolders.map((folder) => <option value={folder} key={folder}>{folder}</option>)}</select></label>
          <label><span>Sort</span><select value={bookmarkSort} onChange={(event) => setBookmarkSort(event.target.value)}><option value="recent">Recently saved</option><option value="name">Name</option><option value="folder">Folder</option></select></label>
          <output>{filteredBookmarks.length} / {memory.bookmarks.length} matching</output>
        </div>
        <ol className="succession-research-memory__items succession-research-memory__bookmark-items">{bookmarks.map((item) => {
          const record = describeItem(item);
          const key = memoryItemKey(item);
          const draft = bookmarkDraft(item);
          const dirty = draft.folder !== (item.folder || '') || draft.tags !== (item.tags || []).join(', ');
          return <li key={key}><div className="succession-research-memory__bookmark-copy"><b>{record.label}</b><small>{record.type.replaceAll('-', ' ')} · {formatWhen(item.savedAt)}</small><div className="succession-research-memory__bookmark-meta"><label><span>Folder</span><input value={draft.folder} maxLength={SUCCESSION_ARCHIVE_BOOKMARK_FOLDER_LIMIT} onChange={(event) => setBookmarkDrafts((current) => ({ ...current, [key]: { ...draft, folder: event.target.value } }))} placeholder="Unfiled" /></label><label><span>Tags · max {SUCCESSION_ARCHIVE_BOOKMARK_TAG_LIMIT}</span><input value={draft.tags} onChange={(event) => setBookmarkDrafts((current) => ({ ...current, [key]: { ...draft, tags: event.target.value } }))} placeholder="prince, nen, revisit" /></label><button type="button" disabled={!dirty} onClick={() => saveBookmarkMetadata(item)}><Save size={11} /> Save metadata</button></div></div><div className="succession-research-memory__row-actions"><OpenItemButton item={item} onNavigate={onNavigate} /><button type="button" aria-label={`Remove bookmark ${record.label}`} onClick={() => toggleSuccessionArchiveBookmark(item)}><Trash2 size={12} aria-hidden="true" /> Remove</button></div></li>;
        })}</ol>
        {!filteredBookmarks.length && <p className="succession-research-memory__empty">{memory.bookmarks.length ? 'No bookmarks match the current search/folder filters.' : 'Use “Save current” in the chapter context bar to bookmark a workspace or record.'}</p>}
        {filteredBookmarks.length > bookmarks.length && <div className="succession-research-memory__bookmark-more"><small>Showing {bookmarks.length} of {filteredBookmarks.length} matching bookmarks.</small><button type="button" onClick={() => setShowAllBookmarks(true)}>Show all matching</button></div>}
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
        <ol className="succession-research-memory__items">{memory.savedSearches.map((record) => <li key={record.id}><div><b>{record.query}</b><small>Saved at Ch. {record.chapter} · reruns at current Ch. {spoilerLimit} · {formatWhen(record.savedAt)}</small></div><div className="succession-research-memory__row-actions"><button type="button" onClick={() => onNavigate('search', { query: record.query })}>Run now <ArrowRight size={11} /></button><button type="button" onClick={() => removeSuccessionArchiveSearch(record.id)}><Trash2 size={12} /> Remove</button></div></li>)}</ol>
        {!memory.savedSearches.length && <p className="succession-research-memory__empty">Save useful questions from Global Search and they will appear here.</p>}
      </section>

      <section className="is-watchlists">
        <header><span><LibraryBig size={13} aria-hidden="true" /> Research collections</span><h3>Investigations with rename, notes, status, tags, ordering, citations and portable exports</h3></header>
        <form className="succession-research-memory__watchlist-create" onSubmit={createWatchlist}><label><span>New collection</span><input value={watchlistName} onChange={(event) => setWatchlistName(event.target.value)} maxLength="120" placeholder="e.g. Halkenburg investigation" /></label><button type="submit" disabled={!watchlistName.trim()}><Plus size={12} /> Create</button></form>
        <div className="succession-research-memory__watchlists">{memory.watchlists.map((watchlist) => {
          const note = noteDrafts[watchlist.id] ?? watchlist.note ?? '';
          const noteDirty = note !== (watchlist.note || '');
          const tags = tagDrafts[watchlist.id] ?? watchlist.tags.join(', ');
          const tagsDirty = tags !== watchlist.tags.join(', ');
          const name = nameDrafts[watchlist.id] ?? watchlist.name;
          const nameDirty = name.trim() && name !== watchlist.name;
          const citations = citationCandidatesForWatchlist(watchlist);
          return <article data-watchlist-id={watchlist.id} data-status={watchlist.status} key={watchlist.id}>
            <header><div><b>{watchlist.name}</b><small>{watchlist.items.length} saved record{watchlist.items.length === 1 ? '' : 's'} · {watchlist.citationIds.length} citations · {formatWhen(watchlist.updatedAt)}</small></div><div className="succession-research-memory__collection-actions"><button type="button" onClick={() => downloadMarkdown(watchlist)}><Download size={12} /> Dossier .md</button><button type="button" onClick={() => downloadCitationBundle(watchlist)}><FileText size={12} /> Citations</button><button type="button" onClick={() => printWatchlist(watchlist.id)}><Printer size={12} /> Print</button><button type="button" onClick={() => deleteSuccessionWatchlist(watchlist.id)}><Trash2 size={12} /> Delete</button></div></header>
            <div className="succession-research-memory__investigation-meta"><label className="is-name"><span>Investigation name</span><input value={name} maxLength="120" onChange={(event) => setNameDrafts((current) => ({ ...current, [watchlist.id]: event.target.value }))} /><button type="button" disabled={!nameDirty} onClick={() => saveWatchlistName(watchlist)}><Save size={11} /> Rename</button></label><label><span>Status</span><select value={watchlist.status} onChange={(event) => updateSuccessionWatchlistMetadata(watchlist.id, { status: event.target.value })}>{SUCCESSION_ARCHIVE_WATCHLIST_STATUSES.map((status) => <option value={status} key={status}>{status}</option>)}</select></label><label className="is-tags"><span><Tags size={11} aria-hidden="true" /> Tags · max {SUCCESSION_ARCHIVE_WATCHLIST_TAG_LIMIT}</span><input value={tags} onChange={(event) => setTagDrafts((current) => ({ ...current, [watchlist.id]: event.target.value }))} placeholder="ritual, halkenburg, evidence-gap" /><button type="button" disabled={!tagsDirty} onClick={() => saveTags(watchlist)}><Save size={11} /> Save tags</button></label></div>
            <label className="succession-research-memory__note"><span>Investigation note / working thesis</span><textarea value={note} maxLength={SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT} onChange={(event) => setNoteDrafts((current) => ({ ...current, [watchlist.id]: event.target.value }))} placeholder="Question, hypothesis, evidence to revisit, contradictions, next checks…" /><small>{note.length} / {SUCCESSION_ARCHIVE_WATCHLIST_NOTE_LIMIT} characters · local only</small><button type="button" disabled={!noteDirty} onClick={() => saveNote(watchlist)}><Save size={12} /> Save note</button></label>
            <section className="succession-research-memory__ordered-records"><h4>Ordered evidence / record stack</h4><ol>{watchlist.items.map((item, index) => { const record = describeItem(item); return <li key={`${watchlist.id}:${item.route}:${item.entityId || JSON.stringify(item.params)}`}><span>{index + 1}</span><OpenItemButton item={item} onNavigate={onNavigate} label={record.label} /><div><button type="button" disabled={index === 0} aria-label={`Move ${record.label} up`} onClick={() => moveSuccessionWatchlistItem(watchlist.id, index, 'up')}><ArrowUp size={11} /></button><button type="button" disabled={index === watchlist.items.length - 1} aria-label={`Move ${record.label} down`} onClick={() => moveSuccessionWatchlistItem(watchlist.id, index, 'down')}><ArrowDown size={11} /></button><button type="button" onClick={() => toggleSuccessionWatchlistItem(watchlist.id, item)}><Trash2 size={11} /> Remove</button></div></li>; })}</ol>{!watchlist.items.length && <p className="succession-research-memory__empty">No records in this investigation yet.</p>}</section>
            <details className="succession-research-memory__citations"><summary>Citations · {watchlist.citationIds.length} selected / {citations.length} available</summary><div>{citations.map((source) => <label key={source.id}><input type="checkbox" checked={watchlist.citationIds.includes(source.id)} onChange={() => toggleSuccessionWatchlistCitation(watchlist.id, source.id)} /><span><b>{source.chapter ? `Chapter ${source.chapter}` : source.name || source.id}</b><small>{source.sourceType || 'source'} · {source.note || source.id}</small></span></label>)}</div>{!citations.length && <p className="succession-research-memory__empty">Saved records have no linked source records available for a citation bundle.</p>}</details>
            {memory.bookmarks.length > 0 && <div className="succession-research-memory__watchlist-add"><select aria-label={`Bookmark to add to ${watchlist.name}`} value={watchlistPick[watchlist.id] || ''} onChange={(event) => setWatchlistPick((current) => ({ ...current, [watchlist.id]: event.target.value }))}><option value="">Choose bookmarked record…</option>{memory.bookmarks.map((item, index) => <option value={index} key={`${watchlist.id}:${item.route}:${item.entityId || index}`}>{describeItem(item).label}</option>)}</select><button type="button" disabled={watchlistPick[watchlist.id] === undefined || watchlistPick[watchlist.id] === ''} onClick={() => { const item = memory.bookmarks[Number(watchlistPick[watchlist.id])]; if (item) toggleSuccessionWatchlistItem(watchlist.id, item); }}>Add</button></div>}
          </article>;
        })}</div>
        {!memory.watchlists.length && <p className="succession-research-memory__empty">Create an investigation, add records from archive bookmarks, then manage name, notes, status, tags, ordering and citations or export a dossier.</p>}
      </section>
    </div>
  </section>;
}
