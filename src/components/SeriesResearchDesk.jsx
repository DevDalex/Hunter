import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { arcs } from '../data/arcs';
import {
  adaptationResearch,
  researchFieldDefinitions,
  seriesChronology,
  seriesResearchStats,
} from '../data/seriesResearch';
import { timelineEventCount } from '../data/successionTimeline';

const views = [
  ['chronology', 'Story chronology'],
  ['adaptation', 'Adaptation evidence'],
  ['method', 'Coverage notes'],
];

const statusKey = (chapter) => chapter.researchStatus === 'Arc-phase study record' ? 'phase-context' : 'chapter-specific';

export default function SeriesResearchDesk({ chapters, spoilerLimit, maxChapter = 413, onOpenSuccessionTimeline }) {
  const [view, setView] = useState('chronology');
  const [arc, setArc] = useState('all');
  const chronology = seriesChronology.filter((item) => item.range[0] <= spoilerLimit && (arc === 'all' || item.arcId === arc));

  const coverage = useMemo(() => {
    const available = chapters.filter((chapter) => chapter.number <= Math.min(spoilerLimit, maxChapter));
    return [
      ['Maintained chapter identity and source', available.length, available.length],
      ['Local chapter-specific summaries', available.filter((chapter) => statusKey(chapter) === 'chapter-specific').length, available.length],
      ['Arc-phase context records', available.filter((chapter) => chapter.research).length, Math.min(339, available.length)],
      ['Static ordered appearance lists', available.filter((chapter) => chapter.characters.length).length, available.length],
      ['Static location lists', available.filter((chapter) => chapter.locations.length).length, available.length],
      ['Static adaptation mappings', available.filter((chapter) => chapter.adaptations.length).length, available.length],
      ['Static page counts', available.filter((chapter) => chapter.pages).length, available.length],
      ['Static publication dates', available.filter((chapter) => chapter.releaseDate).length, available.length],
    ];
  }, [chapters, spoilerLimit, maxChapter]);

  const availableArcs = arcs.filter((item) => item.chapters[0] <= maxChapter);
  const availableChapterCount = chapters.filter((chapter) => chapter.number <= Math.min(spoilerLimit, maxChapter)).length;
  const chapterSpecificCount = chapters.filter((chapter) => chapter.number <= Math.min(spoilerLimit, maxChapter) && statusKey(chapter) === 'chapter-specific').length;

  return (
    <section className="series-research" id="series-research">
      <header className="series-research__hero">
        <div><span className="section-kicker">Curated Pre-Succession chronology</span><h2>Place six arcs inside the larger story.</h2><p>Compare selected events, dated periods, broad journey movement, and adaptation evidence through the Chairman Election. Chapters 1–339 remain lightweight references; the Black Whale voyage keeps its separate, much denser chronology.</p></div>
        <dl><div><dt>Reference boundary</dt><dd>Ch. {availableChapterCount}</dd></div><div><dt>Curated chapter records</dt><dd>{chapterSpecificCount}</dd></div><div><dt>Arc phases</dt><dd>{seriesResearchStats.completedArcPhases}</dd></div><div><dt>Voyage events</dt><dd>{timelineEventCount}</dd></div></dl>
      </header>

      <nav className="series-research__views" aria-label="Full-series research views">{views.map(([id, label]) => <button className={view === id ? 'is-active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)} key={id}>{label}</button>)}</nav>

      {view !== 'method' && <div className="series-research__filters">
        <label htmlFor="chronology-arc">Arc shown</label>
        <select id="chronology-arc" value={arc} onChange={(event) => setArc(event.target.value)}><option value="all">All Pre-Succession arcs</option>{availableArcs.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>
      </div>}

      {view === 'chronology' && <div className="series-research-chronology">
        <header><div><span>{chronology.length} structural blocks</span><h3>Selected story sequence</h3></div><p>This view separates exact calendar anchors, relative chronology, and arc study phases without requiring one timeline entry per early chapter.</p></header>
        <ol>{chronology.map((item) => <li key={item.id}><i>{item.order}</i><article><header><div><span>{item.arcTitle} · {item.chapters}</span><h3>{item.title}</h3></div><a href={item.source} target="_blank" rel="noreferrer">Source <ExternalLink size={10} /></a></header><p>{item.summary}</p><dl><div><dt>Precision</dt><dd>{item.precision}</dd></div><div><dt>Anchor</dt><dd>{item.anchor}</dd></div><div><dt>Route</dt><dd>{item.route}</dd></div><div><dt>Consequence</dt><dd>{item.consequence}</dd></div></dl></article></li>)}</ol>
        <button className="series-research-chronology__voyage" onClick={onOpenSuccessionTimeline}>Open the 134-event voyage timeline <ArrowRight size={13} /></button>
      </div>}

      {view === 'adaptation' && <div className="series-adaptation">
        <header><div><span>Evidence boundary</span><h3>Adaptation cross-reference</h3></div><p>Arc-level context is maintained locally. Exact 1999, OVA, and 2011 episode mappings remain chapter-specific evidence and load from Hunterpedia where the chapter page supplies them.</p></header>
        <div>{adaptationResearch.filter((item) => arc === 'all' || item.id === arc).map((item) => <article key={item.id}><span>{item.chapters}</span><h3>{item.arc}</h3><p>{item.note}</p><small>{item.status}</small><a href={item.source} target="_blank" rel="noreferrer">Arc source <ExternalLink size={10} /></a></article>)}</div>
      </div>}

      {view === 'method' && <div className="series-research-method">
        <section><header><span>Coverage is not depth</span><h3>What remains available as reference</h3></header><div>{coverage.map(([label, count, total]) => <article key={label}><div><strong>{count}</strong><span>/ {total}</span></div><p>{label}</p><progress value={count} max={Math.max(1, total)} aria-label={`${label}: ${count} of ${total}`} /></article>)}</div></section>
        <section><header><span>Record contract</span><h3>What every field means</h3></header><dl>{researchFieldDefinitions.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>
        <aside><b>Intentional depth boundary</b><p>No new chapter-by-chapter expansion is planned for Chapters 1–339. Missing appearance, adaptation, metadata, or image fields remain unknown rather than being inferred from an arc roster.</p></aside>
      </div>}
    </section>
  );
}
