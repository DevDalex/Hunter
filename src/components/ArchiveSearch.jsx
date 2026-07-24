import { useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, Search, X } from 'lucide-react';
import { loadArchiveSearchIndex } from '../data/archiveSearch';

const popularSearches = ['Kurapika', 'Kakin Empire', 'Room 1014', 'Guardian Spirit Beast', 'Chapter 359'];
const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
const normalizeQuery = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export default function ArchiveSearch({ open, spoilerLimit = Number.MAX_SAFE_INTEGER, onClose, onSelect }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const resultRefs = useRef([]);
  const restoreFocusRef = useRef(typeof document === 'undefined' ? null : document.activeElement);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchIndex, setSearchIndex] = useState([]);
  const [indexState, setIndexState] = useState('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeQuery(deferredQuery);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setIndexState(searchIndex.length ? 'ready' : 'loading');
    loadArchiveSearchIndex().then(({ index }) => {
      if (cancelled) return;
      setSearchIndex(index);
      setIndexState('ready');
    }).catch(() => {
      if (!cancelled) setIndexState('error');
    });
    return () => { cancelled = true; };
  }, [loadAttempt, open]);

  const matchingResults = useMemo(() => {
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    if (!terms.length || indexState !== 'ready') return [];
    const ranked = [];
    for (const item of searchIndex) {
      if (item.chapter && item.chapter > spoilerLimit) continue;
      if (!terms.every((term) => item.searchText.includes(term))) continue;
      const score = item.titleText === normalizedQuery
        ? 0
        : item.titleText.startsWith(normalizedQuery)
          ? 1
          : terms.every((term) => item.titleText.includes(term))
            ? 2
            : 3;
      ranked.push({ item, score });
    }
    ranked.sort((a, b) => a.score - b.score || a.item.title.length - b.item.title.length || collator.compare(a.item.title, b.item.title));
    return ranked.slice(0, 240).map(({ item }) => item);
  }, [indexState, normalizedQuery, searchIndex, spoilerLimit]);

  const results = useMemo(() => matchingResults.filter((item) => type === 'all' || item.type === type).slice(0, 80), [matchingResults, type]);
  const visibleTypes = useMemo(() => [...new Set(matchingResults.map((item) => item.type))], [matchingResults]);

  useEffect(() => {
    setActiveIndex(-1);
    resultRefs.current = resultRefs.current.slice(0, results.length);
  }, [query, type, results.length]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    const previousFocus = restoreFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusInput = () => inputRef.current?.focus({ preventScroll: true });
    focusInput();
    const frame = window.requestAnimationFrame(focusInput);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href], input, select')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) { setQuery(''); setType('all'); }
  }, [open]);

  const focusResult = (index) => {
    if (!results.length) return;
    const next = (index + results.length) % results.length;
    setActiveIndex(next);
    resultRefs.current[next]?.focus();
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      focusResult(0);
    }
  };

  const handleResultKeyDown = (event, index) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); focusResult(index + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); index === 0 ? inputRef.current?.focus() : focusResult(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); focusResult(0); }
    if (event.key === 'End') { event.preventDefault(); focusResult(results.length - 1); }
  };

  if (!open) return null;
  const statusMessage = indexState === 'loading'
    ? 'Preparing the archive search index'
    : indexState === 'error'
      ? 'The archive search index could not be loaded'
      : normalizedQuery
        ? `${results.length} matching archive result${results.length === 1 ? '' : 's'}`
        : 'Archive search ready';

  return (
    <div className="archive-search-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={dialogRef} className="archive-search-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-search-title" aria-busy={indexState === 'loading'}>
        <header>
          <div><span className="section-kicker">Global archive search</span><h2 id="archive-search-title">Find any maintained record</h2></div>
          <button onClick={onClose} aria-label="Close archive search"><X size={20} /></button>
        </header>
        <label className="archive-search-input"><span className="sr-only">Search the archive</span><Search size={19} /><input ref={inputRef} autoFocus role="combobox" value={query} onChange={(event) => { setQuery(event.target.value); setType('all'); }} onKeyDown={handleInputKeyDown} aria-controls="archive-search-results" aria-expanded={Boolean(normalizedQuery && indexState === 'ready')} aria-autocomplete="list" placeholder="Character, mapped place, chapter, room, ability…" /><kbd>Esc</kbd></label>
        <p className="sr-only" role="status" aria-live="polite">{statusMessage}</p>

        {!query && <div className="archive-search-empty">
          <p>Searches cover mapped places, chapters, arcs, characters, princes, Guardian Spirit Beasts, Nen abilities, factions, rooms, operations, objects, mysteries, and reference shelves.</p>
          <div>{popularSearches.map((item) => <button onClick={() => setQuery(item)} key={item}>{item}</button>)}</div>
        </div>}

        {query && indexState === 'loading' && <div className="archive-search-no-results" role="status"><strong>Preparing archive search</strong><p>Loading the story, Succession, and reference indexes…</p></div>}
        {query && indexState === 'error' && <div className="archive-search-no-results" role="alert"><strong>Search index unavailable</strong><p>The archive itself is still available through navigation.</p><button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}>Retry search index</button></div>}

        {query && indexState === 'ready' && <>
          <div className="archive-search-filters" aria-label="Filter search result type">
            <button className={type === 'all' ? 'is-active' : ''} onClick={() => setType('all')}>All <small>{matchingResults.length}</small></button>
            {visibleTypes.map((item) => <button className={type === item ? 'is-active' : ''} onClick={() => setType(item)} key={item}>{item}</button>)}
          </div>
          <div id="archive-search-results" className="archive-search-results" role="listbox" aria-label={`${results.length} archive search results`}>
            {results.map((item, index) => (
              <button ref={(node) => { resultRefs.current[index] = node; }} role="option" aria-selected={activeIndex === index} onFocus={() => setActiveIndex(index)} onMouseMove={() => setActiveIndex(index)} onKeyDown={(event) => handleResultKeyDown(event, index)} onClick={() => onSelect(item)} key={item.id}>
                <span>{item.type}</span><div><strong>{item.title}</strong><small>{item.subtitle}</small></div>
                {item.route ? <ArrowRight size={16} /> : <ExternalLink size={15} />}
              </button>
            ))}
            {!results.length && <div className="archive-search-no-results"><strong>No matching archive record</strong><p>Try fewer words or another spelling.</p></div>}
          </div>
        </>}
      </section>
    </div>
  );
}
