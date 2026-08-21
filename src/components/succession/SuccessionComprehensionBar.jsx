import { ArrowLeft, ArrowRight, BookOpenCheck, GitCompareArrows, Layers3 } from 'lucide-react';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import './SuccessionComprehensionBar.css';

const EARLIEST_SUCCESSION_CHAPTER = 340;

const semanticLegend = Object.freeze([
  ['canon', 'Canon'],
  ['inference', 'Inference'],
  ['theory', 'Theory'],
  ['translation', 'Translation'],
  ['changed', 'Changed'],
  ['unresolved', 'Unresolved'],
]);

export default function SuccessionComprehensionBar({ spoilerLimit, onSpoilerChange, onNavigate }) {
  const chapter = Math.min(ARCHIVE_BOUNDARY, Math.max(EARLIEST_SUCCESSION_CHAPTER, Number(spoilerLimit) || ARCHIVE_BOUNDARY));
  const previous = Math.max(EARLIEST_SUCCESSION_CHAPTER, chapter - 1);
  const next = Math.min(ARCHIVE_BOUNDARY, chapter + 1);
  const canPrevious = chapter > EARLIEST_SUCCESSION_CHAPTER;
  const canNext = chapter < ARCHIVE_BOUNDARY;

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
      <button type="button" onClick={() => onNavigate('research', { mode: 'diff', from: previous, to: chapter })} disabled={previous === chapter}><GitCompareArrows size={13} /> Compare {previous} → {chapter}</button>
    </div>

    <details className="succession-comprehension-bar__legend">
      <summary>Meaning</summary>
      <div>{semanticLegend.map(([state, label]) => <span className={`is-${state}`} key={state}>{label}</span>)}</div>
    </details>
  </section>;
}
