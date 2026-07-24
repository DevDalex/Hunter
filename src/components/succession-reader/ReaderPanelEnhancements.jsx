import { useEffect, useMemo, useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import {
  chapterProgressFor,
  clearReaderBookmarks,
  readSuccessionReaderState,
  setChapterCompleted,
  writeSuccessionReaderState,
} from './readerState.js';

const readerRange = { start: 338, end: 414 };
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const currentChapterFromLocation = () => clamp(Number(new URL(window.location.href).searchParams.get('chapter')) || readerRange.start, readerRange.start, readerRange.end);

const applyReaderUrl = (changes) => {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined || value === null || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  window.history.pushState({}, '', url);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const parseCommand = (value) => {
  const normalized = value.trim().toLocaleLowerCase();
  if (!normalized) return null;

  const chapterPage = normalized.match(/^(?:chapter\s*)?(\d{3})(?::(\d+))?$/i);
  if (chapterPage) return {
    type: 'route',
    changes: {
      chapter: clamp(Number(chapterPage[1]), readerRange.start, readerRange.end),
      page: Math.max(1, Number(chapterPage[2] || 1)),
      panel: undefined,
    },
  };

  const page = normalized.match(/^page\s+(\d+)$/i);
  if (page) return { type: 'route', changes: { page: Math.max(1, Number(page[1])), panel: undefined } };
  if (normalized === 'latest') return { type: 'route', changes: { chapter: readerRange.end, page: 1, panel: undefined } };
  if (['page', 'spread', 'scroll'].includes(normalized)) return { type: 'route', changes: { mode: normalized, panel: undefined } };
  if (['rtl', 'ltr'].includes(normalized)) return { type: 'route', changes: { direction: normalized, panel: undefined } };
  if (['width', 'height', 'original'].includes(normalized)) return { type: 'route', changes: { fit: normalized, panel: undefined } };
  if (['chapters', 'info', 'settings', 'thumbnails', 'bookmarks', 'shortcuts'].includes(normalized)) return { type: 'route', changes: { panel: normalized } };
  if (['black', 'charcoal', 'gray', 'paper'].includes(normalized)) return { type: 'theme', theme: normalized };
  return null;
};

export default function ReaderPanelEnhancements({ title, onClose }) {
  const [readerState, setReaderState] = useState(readSuccessionReaderState);
  const chapter = useMemo(currentChapterFromLocation, [title]);
  const chapterProgress = chapterProgressFor(readerState, chapter);
  const isInfo = title.startsWith('Chapter ') && title.endsWith(' information');
  const isSettings = title === 'Reader settings';
  const isCommands = title === 'Reader commands';

  useEffect(() => {
    if (!isCommands) return undefined;
    const input = document.querySelector('.succession-reader-panel--commands input[data-reader-autofocus]');
    if (!input) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Enter' || event.isComposing) return;
      const command = parseCommand(input.value);
      if (!command) return;
      event.preventDefault();
      if (command.type === 'theme') {
        const current = readSuccessionReaderState();
        writeSuccessionReaderState({ ...current, theme: command.theme });
        onClose();
        window.location.reload();
        return;
      }
      onClose();
      applyReaderUrl(command.changes);
    };
    input.addEventListener('keydown', onKeyDown);
    return () => input.removeEventListener('keydown', onKeyDown);
  }, [isCommands, onClose]);

  const toggleCompleted = () => {
    const next = setChapterCompleted(readerState, chapter, !chapterProgress.completed);
    writeSuccessionReaderState(next);
    setReaderState(next);
    onClose();
    window.location.reload();
  };

  const clearBookmarks = () => {
    if (!readerState.bookmarks.length) return;
    if (!window.confirm(`Remove all ${readerState.bookmarks.length} Succession reader bookmarks? Reading progress will be preserved.`)) return;
    const next = clearReaderBookmarks(readerState);
    writeSuccessionReaderState(next);
    setReaderState(next);
    onClose();
    window.location.reload();
  };

  if (isInfo) return <section className="succession-reader__panel-enhancement" aria-label="Chapter completion">
    <div><span>Reading state</span><strong>{chapterProgress.completed ? 'Completed' : chapterProgress.percent ? `${chapterProgress.percent}% read` : 'Not completed'}</strong></div>
    <button type="button" className={chapterProgress.completed ? 'is-completed' : ''} onClick={toggleCompleted}>
      <Check size={16} aria-hidden="true" /> {chapterProgress.completed ? 'Mark chapter incomplete' : 'Mark chapter complete'}
    </button>
  </section>;

  if (isSettings) return <section className="succession-reader__panel-enhancement is-danger" aria-label="Bookmark data controls">
    <div><span>Bookmarks</span><strong>{readerState.bookmarks.length} saved page{readerState.bookmarks.length === 1 ? '' : 's'}</strong></div>
    <button type="button" onClick={clearBookmarks} disabled={!readerState.bookmarks.length}>
      <Trash2 size={16} aria-hidden="true" /> Clear bookmarks only
    </button>
  </section>;

  if (isCommands) return <div className="succession-reader__command-syntax" role="note">
    <strong>Direct commands</strong>
    <span><code>400</code> chapter · <code>400:7</code> exact page · <code>page 7</code> · <code>scroll</code> · <code>rtl</code> · <code>bookmarks</code> · <code>paper</code></span>
    <small>Type a command and press Enter.</small>
  </div>;

  return null;
}
