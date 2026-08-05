import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Bookmark, Download, FolderKanban, Search, Trash2 } from 'lucide-react';
import {
  deleteInvestigation,
  exportInvestigation,
  exportResearchWorkspace,
  loadResearchWorkspace,
  removeBookmark,
  removeRecordFromInvestigation,
  reorderInvestigationRecords,
  saveInvestigation,
  updateBookmark,
} from '../../lib/succession/researchWorkspace';

const downloadText = (name, content) => {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};
const recordKey = (record) => `${record.domain}:${record.id}`;

export default function SuccessionSavedResearch({ onNavigate }) {
  const [workspace, setWorkspace] = useState(() => loadResearchWorkspace());
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [activeInvestigationId, setActiveInvestigationId] = useState('');
  useEffect(() => {
    const refresh = () => setWorkspace(loadResearchWorkspace());
    window.addEventListener('storage', refresh);
    window.addEventListener('hunter:research-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('hunter:research-updated', refresh);
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const bookmarks = useMemo(() => {
    const filtered = workspace.bookmarks.filter((item) => !normalizedQuery || [item.label, item.domain, item.folder, ...(item.tags || [])].some((value) => String(value || '').toLowerCase().includes(normalizedQuery)));
    return filtered.sort((left, right) => {
      if (sort === 'label') return String(left.label).localeCompare(String(right.label));
      if (sort === 'chapter') return Number(right.chapter || 0) - Number(left.chapter || 0);
      if (sort === 'oldest') return String(left.savedAt || '').localeCompare(String(right.savedAt || ''));
      return String(right.savedAt || '').localeCompare(String(left.savedAt || ''));
    });
  }, [normalizedQuery, sort, workspace.bookmarks]);
  const investigations = useMemo(() => workspace.investigations.filter((item) => !normalizedQuery || [item.title, item.notes, item.status].some((value) => String(value || '').toLowerCase().includes(normalizedQuery))), [normalizedQuery, workspace.investigations]);
  const activeInvestigation = workspace.investigations.find((item) => item.id === activeInvestigationId);
  const mutate = (next) => setWorkspace(next);

  const moveRecord = (record, direction) => {
    if (!activeInvestigation) return;
    const keys = activeInvestigation.records.map(recordKey);
    const index = keys.indexOf(recordKey(record));
    const target = index + direction;
    if (index < 0 || target < 0 || target >= keys.length) return;
    [keys[index], keys[target]] = [keys[target], keys[index]];
    mutate(reorderInvestigationRecords(activeInvestigation.id, keys));
  };

  return <details className="succession-saved-research">
    <summary><Bookmark size={16} aria-hidden="true" /> My research <b>{workspace.bookmarks.length + workspace.investigations.length}</b></summary>
    <div className="succession-saved-research__toolbar">
      <label><Search size={15} aria-hidden="true" /><span className="sr-only">Search saved research</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookmarks and investigations…" /></label>
      <label>Sort bookmarks<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="label">Label</option><option value="chapter">Chapter</option></select></label>
      <button type="button" onClick={() => downloadText('hunter-research-workspace.json', exportResearchWorkspace())}><Download size={15} /> Export workspace</button>
    </div>
    <div className="succession-saved-research__grid">
      <section>
        <h2><Bookmark size={16} aria-hidden="true" /> Bookmarks</h2>
        {bookmarks.length ? <ul>{bookmarks.map((item) => <li key={`${item.domain}:${item.id}`}>
          <button type="button" onClick={() => onNavigate(item.route, item.params || {})}><strong>{item.label}</strong><span>Chapter {item.chapter} · {item.domain}</span></button>
          <div className="succession-saved-research__bookmark-meta">
            <input aria-label={`Folder for ${item.label}`} value={item.folder || ''} onChange={(event) => mutate(updateBookmark(item.domain, item.id, { folder: event.target.value }))} placeholder="Folder" />
            <input aria-label={`Tags for ${item.label}`} value={(item.tags || []).join(', ')} onChange={(event) => mutate(updateBookmark(item.domain, item.id, { tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) }))} placeholder="tags, comma-separated" />
            <button type="button" aria-label={`Delete ${item.label}`} onClick={() => mutate(removeBookmark(item.domain, item.id))}><Trash2 size={14} /></button>
          </div>
        </li>)}</ul> : <p>No matching saved records.</p>}
      </section>
      <section>
        <h2><FolderKanban size={16} aria-hidden="true" /> Investigations</h2>
        {investigations.length ? <ul>{investigations.slice().reverse().map((item) => <li key={item.id}>
          <button type="button" onClick={() => setActiveInvestigationId(item.id)}><strong>{item.title}</strong><span>Chapter {item.chapter} · {item.records?.length || 0} records · {item.status || 'open'}</span></button>
          <button type="button" aria-label={`Delete ${item.title}`} onClick={() => { mutate(deleteInvestigation(item.id)); if (activeInvestigationId === item.id) setActiveInvestigationId(''); }}><Trash2 size={14} /></button>
        </li>)}</ul> : <p>No matching investigation boards.</p>}
      </section>
    </div>
    {activeInvestigation && <section className="succession-saved-research__editor" aria-label={`Edit ${activeInvestigation.title}`}>
      <header><h2>Investigation editor</h2><button type="button" onClick={() => downloadText(`hunter-investigation-${activeInvestigation.id}.json`, exportInvestigation(activeInvestigation.id))}><Download size={15} /> Export investigation</button></header>
      <label>Title<input value={activeInvestigation.title} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, title: event.target.value }))} /></label>
      <label>Status<select value={activeInvestigation.status || 'open'} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, status: event.target.value }))}><option value="open">Open</option><option value="working">Working</option><option value="resolved">Resolved</option><option value="archived">Archived</option></select></label>
      <label>Private notes<textarea rows="8" value={activeInvestigation.notes || ''} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, notes: event.target.value }))} placeholder="Evidence, suspects, counterarguments, and next checks…" /></label>
      <div><strong>Saved records</strong>{activeInvestigation.records?.length ? <ol>{activeInvestigation.records.map((record, index) => <li key={recordKey(record)}>
        <span>{record.label || record.id} <small>{record.domain}</small></span>
        <div><button type="button" disabled={index === 0} aria-label={`Move ${record.label || record.id} up`} onClick={() => moveRecord(record, -1)}><ArrowUp size={14} /></button><button type="button" disabled={index === activeInvestigation.records.length - 1} aria-label={`Move ${record.label || record.id} down`} onClick={() => moveRecord(record, 1)}><ArrowDown size={14} /></button><button type="button" aria-label={`Remove ${record.label || record.id}`} onClick={() => mutate(removeRecordFromInvestigation(activeInvestigation.id, record.domain, record.id))}><Trash2 size={14} /></button></div>
      </li>)}</ol> : <p>No records saved to this investigation yet.</p>}</div>
    </section>}
  </details>;
}
