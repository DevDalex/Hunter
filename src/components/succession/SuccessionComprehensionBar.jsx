import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, BookOpenCheck, GitCompareArrows, Layers3 } from 'lucide-react';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import {
  SUCCESSION_ARCHIVE_MEMORY_EVENT,
  readSuccessionArchiveMemory,
  recordSuccessionArchiveVisit,
  toggleSuccessionArchiveBookmark,
  toggleSuccessionCompareItem,
} from '../../data/succession/archiveMemory';
import { successionSemanticStates } from '../../data/succession/comprehensionDesignSystem';
import { readBrowserRoute } from '../../lib/appRouter';
import { readStoredString, writeStoredString } from '../../lib/browserStorage';
import {
  SUCCESSION_READER_STATE_KEY,
  chapterProgressFor,
  readSuccessionReaderState,
} from '../succession-reader/readerState.js';
import SuccessionSemanticStateBadge from './SuccessionSemanticStateBadge';
import './SuccessionComprehensionBar.css';

const EARLIEST_SUCCESSION_CHAPTER = 340;
const DENSITY_STORAGE_KEY = 'hxh-succession-density-v1';
const densityModes = Object.freeze(['comfortable', 'compact', 'analyst']);
const normalizeDensity = (value) => densityModes.includes(value) ? value : 'comfortable';

const sameContext = (left, right) => left?.route === right.route
  && (left?.entityId || null) === (right.entityId || null)
  && JSON.stringify(left?.params || {}) === JSON.stringify(right.params || {});

export default function SuccessionComprehensionBar({ spoilerLimit, onSpoilerChange, onNavigate }) {
  const chapter = Math.min(ARCHIVE_BOUNDARY, Math.max(EARLIEST_SUCCESSION_CHAPTER, Number(spoilerLimit) || ARCHIVE_BOUNDARY));
  const previous = Math.max(EARLIEST_SUCCESSION_CHAPTER, chapter - 1);
  const next = Math.min(ARCHIVE_BOUNDARY, chapter + 1);
  const canPrevious = chapter > EARLIEST_SUCCESSION_CHAPTER;
  const canNext = chapter < ARCHIVE_BOUNDARY;
  const [memory, setMemory] = useState(readSuccessionArchiveMemory);
  const [readerState, setReaderState] = useState(readSuccessionReaderState);
  const [density, setDensity] = useState(() => normalizeDensity(readStoredString(DENSITY_STORAGE_KEY, 'comfortable')));
  const currentRoute = typeof window === 'undefined' ? { target: 'story', params: {} } : readBrowserRoute();
  const currentItem = {
    route: currentRoute.target,
    params: currentRoute.params || {},
    entityId: currentRoute.params?.entity || null,
    label: currentRoute.params?.entity || currentRoute.target,
    context: `Chapter ${chapter}`,
  };
  const isBookmarked = memory.bookmarks.some((item) => sameContext(item, currentItem));
  const isCompared = currentItem.entityId && memory.compare.some((item) => item.entityId === currentItem.entityId);
  const currentReaderProgress = chapterProgressFor(readerState, chapter);
  const hasCurrentReaderProgress = Boolean(currentReaderProgress?.updatedAt || (readerState.lastChapter === chapter && readerState.lastPage));
  const currentReaderPage = hasCurrentReaderProgress ? Number(currentReaderProgress?.page || readerState.lastPage || 1) : 1;
  const hasResumePosition = Boolean(readerState.lastChapter && readerState.lastPage);

  useEffect(() => {
    const refresh = () => setMemory(readSuccessionArchiveMemory());
    window.addEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
    return () => window.removeEventListener(SUCCESSION_ARCHIVE_MEMORY_EVENT, refresh);
  }, []);

  useEffect(() => {
    const refreshReader = (event) => {
      if (!event || event.key === SUCCESSION_READER_STATE_KEY) setReaderState(readSuccessionReaderState());
    };
    window.addEventListener('storage', refreshReader);
    window.addEventListener('focus', refreshReader);
    return () => {
      window.removeEventListener('storage', refreshReader);
      window.removeEventListener('focus', refreshReader);
    };
  }, []);

  useEffect(() => {
    recordSuccessionArchiveVisit(currentItem);
  }, [currentItem.route, currentItem.entityId, JSON.stringify(currentItem.params)]);

  useEffect(() => {
    writeStoredString(DENSITY_STORAGE_KEY, density);
    const archive = document.querySelector('.succession-archive');
    if (archive) archive.dataset.density = density;
  }, [density]);

  return <section className="succession-comprehension-bar" aria-label="Chapter context and evidence legend">
    <div className="succession-comprehension-bar__chapter">
      <span>Viewing state</span>
      <button type="button" disabled={!canPrevious} onClick={() => onSpoilerChange(previous)} aria-label={`Set archive boundary to Chapter ${previous}`}><ArrowLeft size={13} /> {previous}</button>
      <strong>Chapter {chapter}</strong>
      <button type="button" disabled={!canNext} onClick={() => onSpoilerChange(next)} aria-label={`Set archive boundary to Chapter ${next}`}>{next} <ArrowRight size={13} /></button>
      {chapter !== ARCHIVE_BOUNDARY && <button type="button" onClick={() => onSpoilerChange(ARCHIVE_BOUNDARY)}>Latest · {ARCHIVE_BOUNDARY}</button>}
    </div>

    <div className="succession-comprehension-bar__actions">
      <button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'quick' })}><BookOpenCheck size={13} /> 60-second brief</button>
      <button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'deep' })}><Layers3 size={13} /> State transition</button>
      <button type="button" onClick={() => onNavigate('reader', { chapter, page: currentReaderPage })}><BookOpen size={13} /> Read Ch. {chapter}{hasCurrentReaderProgress ? ` · p.${currentReaderPage}` : ''}</button>
      {hasResumePosition && <button type="button" onClick={() => onNavigate('reader', { chapter: readerState.lastChapter, page: readerState.lastPage })}><BookOpen size={13} /> Resume reader · Ch. {readerState.lastChapter} p.{readerState.lastPage}</button>}
      <button type="button" onClick={() => onNavigate('research', { mode: 'diff', from: previous, to: chapter })} disabled={previous === chapter}><GitCompareArrows size={13} /> Compare {previous} → {chapter}</button>
      <button type="button" aria-pressed={isBookmarked} onClick={() => toggleSuccessionArchiveBookmark(currentItem)}><Bookmark size={13} /> {isBookmarked ? 'Saved current' : 'Save current'}</button>
      <button type="button" aria-pressed={Boolean(isCompared)} disabled={!currentItem.entityId} title={currentItem.entityId ? undefined : 'Open a canonical entity record to add it to the compare tray.'} onClick={() => toggleSuccessionCompareItem(currentItem)}><GitCompareArrows size={13} /> {isCompared ? 'In compare tray' : 'Compare current'}</button>
    </div>

    <div className="succession-comprehension-bar__density" role="group" aria-label="Information density">
      <span>Density</span>
      {densityModes.map((mode) => <button type="button" className={density === mode ? 'is-active' : ''} aria-pressed={density === mode} onClick={() => setDensity(mode)} key={mode}>{mode}</button>)}
    </div>

    <details className="succession-comprehension-bar__legend">
      <summary>Meaning</summary>
      <div>{successionSemanticStates.map((state) => <SuccessionSemanticStateBadge state={state.id} compact key={state.id} />)}</div>
    </details>
  </section>;
}
