import { ArrowRight, BookOpen, Map, PlayCircle, Users } from 'lucide-react';
import SourcePortrait from './SourcePortrait';
import { priorityPortraitByName } from '../data/priorityMedia.generated';
import { preSuccessionExperiences } from '../data/preSuccessionExperiences';

const portraitItem = (name) => {
  const media = priorityPortraitByName.get(name);
  return media
    ? { id: name, name, source: media.articleSource, image: media.src, media }
    : { id: name, name, source: `https://hunterxhunter.fandom.com/wiki/${encodeURIComponent(name.replaceAll(' ', '_'))}` };
};

export default function PreSuccessionOverview({ onNavigate }) {
  return <section className="pre-overview">
    <header className="pre-overview__statement">
      <div><span className="section-kicker">Completed 2011 journey</span><h2>Six arcs. Six different information systems.</h2></div>
      <p>The overview stays intentionally concise. Each arc opens as its own edition with the visual language best suited to its rules, people, locations, and conflicts.</p>
    </header>

    <div className="pre-overview__arc-list">
      {preSuccessionExperiences.map((arc) => {
        const lead = portraitItem(arc.heroPeople[0]);
        return <article style={{ '--arc': arc.color, '--arc-accent': arc.accent }} key={arc.id}>
          <button className="pre-overview__image" onClick={() => onNavigate('series', arc.id)} aria-label={`Open ${arc.title}`}><SourcePortrait item={lead} alt={`${arc.heroPeople[0]} portrait from Hunterpedia`} /></button>
          <div className="pre-overview__arc-copy"><span>{arc.order} · {arc.eyebrow}</span><h3>{arc.title}</h3><small>{arc.range}</small><p>{arc.deck}</p><dl>{arc.stats.slice(0, 3).map(([value, label]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
          <div className="pre-overview__arc-tools">
            <span><BookOpen size={15} /> Dedicated index</span>
            <span><Users size={15} /> Scoped cast</span>
            <span>{arc.id === 'greed-island' ? <PlayCircle size={15} /> : arc.id === 'chimera-ant' ? <Map size={15} /> : <BookOpen size={15} />} Arc-specific visual</span>
            <button onClick={() => onNavigate('series', arc.id)}>Open edition <ArrowRight size={14} /></button>
          </div>
        </article>;
      })}
    </div>

    <footer className="pre-overview__footer">
      <button onClick={() => onNavigate('series', 'volume-0')}><span>Kurapika’s Memories</span><b>Two-chapter Volume 0 study</b><ArrowRight size={15} /></button>
      <button onClick={() => onNavigate('series', 'adaptation')}><span>2011 anime</span><b>Episodes 1–148 adaptation desk</b><ArrowRight size={15} /></button>
      <button onClick={() => onNavigate('succession', 'overview')}><span>Continue after Chapter 339</span><b>Enter the Succession Era</b><ArrowRight size={15} /></button>
    </footer>
  </section>;
}

