import { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, Download, FileUp, NotebookPen, Trash2 } from 'lucide-react';
import { encyclopediaById } from '../data/encyclopedia';
import { notifyStudyDataChanged, readStoredJson, readStoredNumber, writeStoredJson, writeStoredString } from '../lib/browserStorage';

const readStoredArray = (key) => {
  const value = readStoredJson(key, []);
  return Array.isArray(value) ? value : [];
};

export default function StudyNotebook() {
  const [bookmarks, setBookmarks] = useState(() => readStoredArray('hxh-bookmarks'));
  const [recent, setRecent] = useState(() => readStoredArray('hxh-recent-records'));
  const [notes, setNotes] = useState(() => readStoredArray('hxh-notes'));
  const [draft, setDraft] = useState('');
  const [label, setLabel] = useState('General study note');
  const [message, setMessage] = useState('');
  const fileInput = useRef(null);

  const refresh = () => {
    setBookmarks(readStoredArray('hxh-bookmarks'));
    setRecent(readStoredArray('hxh-recent-records'));
    setNotes(readStoredArray('hxh-notes'));
  };
  useEffect(() => {
    window.addEventListener('hxh-study-data', refresh);
    window.addEventListener('storage', refresh);
    return () => { window.removeEventListener('hxh-study-data', refresh); window.removeEventListener('storage', refresh); };
  }, []);

  const bookmarkedRecords = useMemo(() => bookmarks.map((id) => encyclopediaById.get(id)).filter(Boolean), [bookmarks]);
  const recentRecords = useMemo(() => recent.map((id) => encyclopediaById.get(id)).filter(Boolean), [recent]);
  const persistNotes = (next) => {
    setNotes(next);
    if (!writeStoredJson('hxh-notes', next)) setMessage('This browser is blocking local storage; the note is visible now but cannot be kept after reload.');
  };
  const addNote = () => {
    const text = draft.trim();
    if (!text) return;
    persistNotes([{ id: `${Date.now()}`, label: label.trim() || 'Study note', text, updated: new Date().toISOString() }, ...notes]);
    setDraft(''); setMessage('Note saved.');
  };
  const removeBookmark = (id) => {
    const next = bookmarks.filter((item) => item !== id);
    writeStoredJson('hxh-bookmarks', next);
    setBookmarks(next);
    notifyStudyDataChanged();
  };
  const exportData = () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), studied: readStoredArray('hxh-studied'), spoilerLimit: readStoredNumber('hxh-spoiler-limit', 0), bookmarks, recent, notes };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'hxh-archive-study-data.json'; anchor.click(); URL.revokeObjectURL(url); setMessage('Study data exported.');
  };
  const importData = (event) => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result));
        if (!Array.isArray(payload.studied) || !Array.isArray(payload.bookmarks) || !Array.isArray(payload.notes)) throw new Error('Invalid study file');
        const writes = [
          writeStoredJson('hxh-studied', payload.studied),
          writeStoredJson('hxh-bookmarks', payload.bookmarks),
          writeStoredJson('hxh-recent-records', Array.isArray(payload.recent) ? payload.recent : []),
          writeStoredJson('hxh-notes', payload.notes),
        ];
        if (Number(payload.spoilerLimit) > 0) writes.push(writeStoredString('hxh-spoiler-limit', String(payload.spoilerLimit)));
        if (writes.some((saved) => !saved)) throw new Error('Browser storage unavailable');
        refresh(); notifyStudyDataChanged(); setMessage('Study data imported. Reload to apply chapter progress and spoiler settings.');
      } catch { setMessage('That file is not a valid Hunter Archive study export.'); }
    };
    reader.readAsText(file); event.target.value = '';
  };

  return (
    <section className="study-notebook" id="study-notebook">
      <div className="section-heading"><div><span className="section-kicker">Private browser storage</span><h2>Study notebook</h2></div><p>Bookmarks, notes, recently opened records, chapter progress, and spoiler settings stay in this browser unless you export them.</p></div>
      <div className="study-notebook__actions"><button onClick={exportData}><Download size={16} />Export all study data</button><button onClick={() => fileInput.current?.click()}><FileUp size={16} />Import study data</button><input ref={fileInput} type="file" accept="application/json" onChange={importData} hidden />{message && <span role="status">{message}</span>}</div>
      <div className="study-notebook__grid">
        <section><header><Bookmark size={18} /><div><span>{bookmarkedRecords.length} saved</span><h3>Bookmarks</h3></div></header><div className="notebook-list">{bookmarkedRecords.map((item) => <div key={item.id}><a href={`#/reference/encyclopedia?category=${item.category}&record=${encodeURIComponent(item.id)}`}><strong>{item.name}</strong><small>{item.kind} · {item.researchLevel}</small></a><button onClick={() => removeBookmark(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={14} /></button></div>)}{!bookmarkedRecords.length && <p>Save encyclopedia records to collect them here.</p>}</div></section>
        <section><header><NotebookPen size={18} /><div><span>{notes.length} notes</span><h3>Notes</h3></div></header><div className="note-composer"><input value={label} onChange={(event) => setLabel(event.target.value)} aria-label="Note title" /><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a chapter question, relationship clue, theory boundary, or study reminder…" /><button onClick={addNote}>Save note</button></div><div className="notebook-list notebook-list--notes">{notes.map((note) => <div key={note.id}><span><strong>{note.label}</strong><small>{note.text}</small></span><button onClick={() => persistNotes(notes.filter((item) => item.id !== note.id))} aria-label={`Delete ${note.label}`}><Trash2 size={14} /></button></div>)}</div></section>
        <section><header><NotebookPen size={18} /><div><span>{recentRecords.length} records</span><h3>Recently opened</h3></div></header><div className="notebook-list">{recentRecords.map((item) => <div key={item.id}><a href={`#/reference/encyclopedia?category=${item.category}&record=${encodeURIComponent(item.id)}`}><strong>{item.name}</strong><small>{item.kind}</small></a></div>)}{!recentRecords.length && <p>Open encyclopedia records and they will appear here.</p>}</div></section>
      </div>
    </section>
  );
}
