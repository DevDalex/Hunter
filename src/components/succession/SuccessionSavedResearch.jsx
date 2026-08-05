import { useEffect, useMemo, useState } from 'react';
import { Bookmark, Download, FolderKanban, Search, Trash2 } from 'lucide-react';
import {
  deleteInvestigation,
  exportResearchWorkspace,
  loadResearchWorkspace,
  removeBookmark,
  saveInvestigation,
  updateBookmark,
} from '../../lib/succession/researchWorkspace';

const downloadWorkspace = () => {
  const blob = new Blob([exportResearchWorkspace()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'hunter-research-workspace.json';
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function SuccessionSavedResearch({ onNavigate }) {
  const [workspace, setWorkspace] = useState(() => loadResearchWorkspace());
  const [query, setQuery] = useState('');
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
  const bookmarks = useMemo(() => workspace.bookmarks.filter((item) => !normalizedQuery || [item.label, item.domain, item.folder, ...(item.tags || [])].some((value) => String(value || '').toLowerCase().includes(normalizedQuery))), [normalizedQuery, workspace.bookmarks]);
  const investigations = useMemo(() => workspace.investigations.filter((item) => !normalizedQuery || [item.title, item.notes, item.status].some((value) => String(value || '').toLowerCase().includes(normalizedQuery))), [normalizedQuery, workspace.investigations]);
  const activeInvestigation = workspace.investigations.find((item) => item.id === activeInvestigationId);

  const mutate = (next) => setWorkspace(next);

  return <details className="succession-saved-research">
    <summary><Bookmark size={16} aria-hidden="true" /> My research <b>{workspace.bookmarks.length + workspace.investigations.length}</b></summary>
    <div className="succession-saved-research__toolbar">
      <label><Search size={15} aria-hidden="true" /><span className="sr-only">Search saved research</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookmarks and investigations…" /></label>
      <button type="button" onClick={downloadWorkspace}><Download size={15} /> Export workspace</button>
    </div>
    <div className="succession-saved-research__grid">
      <section>
        <h2><Bookmark size={16} aria-hidden="true" /> Bookmarks</h2>
        {bookmarks.length ? <ul>{bookmarks.slice().reverse().map((item) => <li key={`${item.domain}:${item.id}`}>
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
      <h2>Investigation editor</h2>
      <label>Title<input value={activeInvestigation.title} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, title: event.target.value }))} /></label>
      <label>Status<select value={activeInvestigation.status || 'open'} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, status: event.target.value }))}><option value="open">Open</option><option value="working">Working</option><option value="resolved">Resolved</option><option value="archived">Archived</option></select></label>
      <label>Private notes<textarea rows="8" value={activeInvestigation.notes || ''} onChange={(event) => mutate(saveInvestigation({ ...activeInvestigation, notes: event.target.value }))} placeholder="Evidence, suspects, counterarguments, and next checks…" /></label>
      <div><strong>Saved records</strong>{activeInvestigation.records?.length ? <ol>{activeInvestigation.records.map((record) => <li key={`${record.domain}:${record.id}`}>{record.label || record.id} <small>{record.domain}</small></li>)}</ol> : <p>No records saved to this investigation yet.</p>}</div>
    </section>}
  </details>;
}
