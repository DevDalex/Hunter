import { useEffect, useState } from 'react';
import { Bookmark, FolderKanban } from 'lucide-react';
import { loadResearchWorkspace } from '../../lib/succession/researchWorkspace';

export default function SuccessionSavedResearch({ onNavigate }) {
  const [workspace, setWorkspace] = useState(() => loadResearchWorkspace());
  useEffect(() => {
    const refresh = () => setWorkspace(loadResearchWorkspace());
    window.addEventListener('storage', refresh);
    window.addEventListener('hunter:research-updated', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('hunter:research-updated', refresh);
    };
  }, []);

  return <details className="succession-saved-research">
    <summary><Bookmark size={16} aria-hidden="true" /> My research <b>{workspace.bookmarks.length + workspace.investigations.length}</b></summary>
    <div className="succession-saved-research__grid">
      <section>
        <h2><Bookmark size={16} aria-hidden="true" /> Bookmarks</h2>
        {workspace.bookmarks.length ? <ul>{workspace.bookmarks.slice().reverse().map((item) => <li key={`${item.domain}:${item.id}`}><button type="button" onClick={() => onNavigate(item.route, item.params || {})}><strong>{item.label}</strong><span>Chapter {item.chapter} · {item.domain}</span></button></li>)}</ul> : <p>No saved records yet.</p>}
      </section>
      <section>
        <h2><FolderKanban size={16} aria-hidden="true" /> Investigations</h2>
        {workspace.investigations.length ? <ul>{workspace.investigations.slice().reverse().map((item) => <li key={item.id}><strong>{item.title}</strong><span>Chapter {item.chapter} · {item.records?.length || 0} records · {item.status || 'open'}</span></li>)}</ul> : <p>No investigation boards yet.</p>}
      </section>
    </div>
  </details>;
}
