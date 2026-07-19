import { arcs } from '../data/arcs';

const preSuccessionArcs = arcs.filter((arc) => arc.chapters[1] <= 339);

export default function ArcNav({ activeArc, setActiveArc, completedCount }) {
  return (
    <section className="arc-section" id="arcs">
      <div className="section-heading">
        <div><span className="section-kicker">Six completed arcs</span><h2>Browse Pre-Succession by arc</h2></div>
        <p>Six arc studies organize the completed journey. {completedCount} optional chapter references are marked studied.</p>
      </div>
      <nav className="arc-nav" aria-label="Story arcs">
        <button className={activeArc === 'all' ? 'is-active' : ''} onClick={() => setActiveArc('all')}>
          <span>All</span><strong>Six arcs</strong><small>Ch. 1–339 boundary</small>
        </button>
        {preSuccessionArcs.map((arc) => (
          <button key={arc.id} className={activeArc === arc.id ? 'is-active' : ''} onClick={() => setActiveArc(arc.id)}>
            <span>{arc.order}</span><strong>{arc.short}</strong><small>{arc.chapters[0]}–{arc.chapters[1]}</small>
          </button>
        ))}
      </nav>
    </section>
  );
}
