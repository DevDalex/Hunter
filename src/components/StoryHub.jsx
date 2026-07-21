import { ArrowRight, BookOpenText, Clock3, Film, LibraryBig } from 'lucide-react';
import { storyArcPages } from '../data/storyArcPages';
import { storyArcArtworkById } from '../data/storyArcArtwork';
import SafeImage from './SafeImage';
import './StoryHub.css';
import './StoryArcArtwork.css';

const utilityLinks = [
  { id: 'chronology', title: 'Complete chronology', note: 'Cross-arc events, flashbacks, and movements', icon: Clock3 },
  { id: 'chapters', title: 'Chapter directory', note: 'All 413 numbered chapter records', icon: LibraryBig },
  { id: 'adaptation', title: '2011 anime guide', note: '148 episodes mapped to the manga', icon: Film },
];

export default function StoryHub({ onNavigate, onPrefetch }) {
  return <div className="story-directory">
    <header className="story-directory__hero">
      <span>The chronological archive</span>
      <h1>The Story</h1>
      <p>From Kurapika’s childhood and the Hunter Exam to the voyage aboard Black Whale 1. Open one arc and remain inside that story until its ending, adaptation notes, and records.</p>
    </header>

    <section className="story-directory__arcs" aria-labelledby="story-directory-title">
      <header><span>Nine dedicated destinations</span><h2 id="story-directory-title">Choose an arc.</h2></header>
      <div>{storyArcPages.map((arc) => {
        const artwork = storyArcArtworkById.get(arc.id);
        const artworkStyle = {
          '--arc-artwork-position': artwork?.position || 'center',
          '--arc-artwork-fit': artwork?.fit || 'cover',
        };
        return <button
          type="button"
          className={`story-directory-card story-directory-card--${arc.visual.className}`}
          style={{ '--story-card-accent': arc.visual.accent, '--story-card-paper': arc.visual.paper }}
          onClick={() => onNavigate('series', arc.id)}
          onPointerEnter={() => onPrefetch?.('series', arc.id)}
          onFocus={() => onPrefetch?.('series', arc.id)}
          key={arc.id}
        >
          <figure><SafeImage className="story-arc-artwork" src={artwork?.image || arc.visual.hero[0]} fallbackSrc={artwork?.fallback || arc.visual.hero[0]} alt={artwork?.alt || `${arc.title} arc artwork`} style={artworkStyle} /></figure>
          <div className="story-directory-card__shade" />
          <div className="story-directory-card__copy">
            <i>{String(arc.order).padStart(2, '0')}</i>
            <span>{arc.status}</span>
            <h3>{arc.title}</h3>
            <p>{arc.premise}</p>
            <dl><div><dt>Manga</dt><dd>{Array.isArray(arc.manga?.pageRange) ? `Ch. ${arc.manga.pageRange[0]}–${arc.manga.pageRange[1]}` : 'Two supplementary chapters'}</dd></div><div><dt>Anime</dt><dd>{arc.anime2011 ? `Ep. ${arc.anime2011.pageRange[0]}–${arc.anime2011.pageRange[1]}` : 'Manga-only'}</dd></div></dl>
            <strong>Open arc <ArrowRight size={15} /></strong>
          </div>
        </button>;
      })}</div>
    </section>

    <section className="story-directory__utilities" aria-labelledby="story-utilities-title">
      <header><span>Story reference tools</span><h2 id="story-utilities-title">Continue by record type.</h2></header>
      <div>{utilityLinks.map(({ id, title, note, icon: Icon }) => <button type="button" onClick={() => onNavigate('series', id)} key={id}><Icon size={20} /><span><strong>{title}</strong><small>{note}</small></span><ArrowRight size={15} /></button>)}</div>
    </section>

    <aside className="story-directory__policy"><BookOpenText size={18} /><p>Arc pages are manga-led. The 2011 anime is treated as an adaptation layer, and interpretive theme sections are labelled separately from factual records.</p></aside>
  </div>;
}
