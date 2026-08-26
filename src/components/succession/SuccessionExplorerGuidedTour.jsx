import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Pause, Play, RotateCcw } from 'lucide-react';
import { getEntityById } from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerGuidedTour.css';

const selectTourStops = (nodes, mode) => {
  const ordered = [...nodes].filter((node) => Number.isFinite(Number(node.chapter))).sort((a, b) => a.chapter - b.chapter || b.importance - a.importance);
  if (!ordered.length) return [];
  if (mode === 'recent') return ordered.filter((node) => node.importance >= 1.5).slice(-12);
  const chapters = [...new Set(ordered.map((node) => node.chapter))];
  const desired = mode === 'compact' ? 8 : 12;
  if (chapters.length <= desired) return chapters.map((chapter) => ordered.filter((node) => node.chapter === chapter).sort((a, b) => b.importance - a.importance)[0]);
  const stops = [];
  for (let index = 0; index < desired; index += 1) {
    const chapterIndex = Math.round(index * (chapters.length - 1) / Math.max(1, desired - 1));
    const chapter = chapters[chapterIndex];
    const candidate = ordered.filter((node) => node.chapter === chapter).sort((a, b) => b.importance - a.importance)[0];
    if (candidate && !stops.some((stop) => stop.id === candidate.id)) stops.push(candidate);
  }
  return stops;
};

export default function SuccessionExplorerGuidedTour({ routeId, model }) {
  const explorer = useSuccessionExplorer();
  const [mode, setMode] = useState('arc');
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const stops = useMemo(() => selectTourStops(model.nodes, mode), [mode, model.nodes]);
  const current = stops[Math.min(index, Math.max(0, stops.length - 1))] || null;

  const focus = (nextIndex) => {
    if (!stops.length) return;
    const bounded = Math.max(0, Math.min(stops.length - 1, nextIndex));
    const node = stops[bounded];
    setIndex(bounded);
    explorer.setChapter(node.chapter);
    if (node.entityId) explorer.selectEntity(node.entityId, { routeId, chapter: node.chapter, label: node.label });
    explorer.pushHistory({ kind: 'guided-tour', routeId, chapter: node.chapter, label: node.label, nodeId: node.id });
    const surface = document.querySelector(`.succession-explorer-surface[data-explorer-route="${routeId}"] .succession-explorer-canvas__surface`);
    const width = surface?.getBoundingClientRect().width || 1000;
    const height = surface?.getBoundingClientRect().height || 620;
    const scale = 1.05;
    explorer.setCamera(routeId, {
      scale,
      x: width / (2 * scale) - node.x,
      y: height / (2 * scale) - node.y,
    });
  };

  const toggleAuto = () => {
    if (autoplay) {
      setAutoplay(false);
      return;
    }
    setAutoplay(true);
    const run = (position) => {
      if (position >= stops.length) {
        setAutoplay(false);
        return;
      }
      focus(position);
      window.setTimeout(() => {
        if (position < stops.length - 1) run(position + 1);
        else setAutoplay(false);
      }, 2100);
    };
    run(index);
  };

  return <section className="succession-explorer-tour">
    <header>
      <div><span>Guided visual documentary</span><h3><Compass size={18} /> Fly through the story instead of scrolling it</h3><p>The tour uses high-importance chapter-safe nodes from the current story model. Each stop moves the shared chapter and camera, so every connected instrument can follow.</p></div>
      <div className="succession-explorer-tour__modes">
        <button type="button" className={mode === 'arc' ? 'is-active' : ''} onClick={() => { setMode('arc'); setIndex(0); }}>Arc · 12 stops</button>
        <button type="button" className={mode === 'compact' ? 'is-active' : ''} onClick={() => { setMode('compact'); setIndex(0); }}>Fast · 8 stops</button>
        <button type="button" className={mode === 'recent' ? 'is-active' : ''} onClick={() => { setMode('recent'); setIndex(0); }}>Recent pressure</button>
      </div>
    </header>

    {!current ? <p className="succession-explorer-tour__empty">No chapter-safe tour stops are available under the current filters.</p> : <>
      <div className="succession-explorer-tour__stage">
        <div className="succession-explorer-tour__counter"><span>{String(index + 1).padStart(2, '0')}</span><i /><b>{String(stops.length).padStart(2, '0')}</b></div>
        <article>
          <span>Chapter {current.chapter} · {current.group}</span>
          <h4>{current.label}</h4>
          <p>{current.subtitle || 'This stop is a structural turning point in the currently filtered story model.'}</p>
          {current.entityId && <small>{getEntityById(current.entityId)?.entityType || current.kind}</small>}
        </article>
        <div className="succession-explorer-tour__controls">
          <button type="button" onClick={() => focus(index - 1)} disabled={index <= 0}><ArrowLeft size={14} /> Previous</button>
          <button type="button" className="is-primary" onClick={toggleAuto}>{autoplay ? <Pause size={14} /> : <Play size={14} />}{autoplay ? 'Pause tour' : 'Play tour'}</button>
          <button type="button" onClick={() => focus(index + 1)} disabled={index >= stops.length - 1}>Next <ArrowRight size={14} /></button>
          <button type="button" onClick={() => { setAutoplay(false); setIndex(0); focus(0); }}><RotateCcw size={14} /> Restart</button>
        </div>
      </div>
      <ol className="succession-explorer-tour__rail">{stops.map((stop, stopIndex) => <li className={stopIndex === index ? 'is-active' : stopIndex < index ? 'is-past' : ''} key={stop.id}><button type="button" onClick={() => focus(stopIndex)}><span>{stop.chapter}</span><i /><strong>{stop.label}</strong></button></li>)}</ol>
    </>}
  </section>;
}
