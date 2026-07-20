import { ArrowRight, MapPinned, Orbit, Swords, UsersRound } from 'lucide-react';
import SafeImage from './SafeImage';

const entrances = [
  {
    id: 'pre',
    number: '01',
    view: 'series',
    target: '',
    eyebrow: 'The completed journey',
    title: 'Pre-Succession',
    range: 'Volume 0 · Chapters 1–339 · 2011 anime',
    copy: 'Follow Gon, Killua, Kurapika, and Leorio from the Hunter Exam through the Chairman Election across six distinct story arcs.',
    image: '/media/portraits/gon-freecss.webp',
    imageAlt: 'Gon Freecss portrait from Hunterpedia',
    accent: '#c29c57',
  },
  {
    id: 'succession',
    number: '02',
    view: 'succession',
    target: 'overview',
    eyebrow: 'The current expedition',
    title: 'Succession Contest',
    range: 'Chapters 340–413 · Black Whale voyage',
    copy: 'Navigate the royal contest, Guardian Spirit Beasts, mafia conflict, ship geography, and the voyage toward the Dark Continent.',
    image: '/media/portraits/kurapika.webp',
    imageAlt: 'Kurapika portrait from Hunterpedia',
    accent: '#a12a38',
  },
];

const tools = [
  ['characters', 'Characters', '644 indexed names', UsersRound, 'reference', 'encyclopedia', { category: 'characters' }],
  ['world', 'World atlas', 'Places and story routes', MapPinned, 'reference', 'atlas'],
  ['nen', 'Nen system', 'Principles and abilities', Orbit, 'reference', 'nen'],
  ['fight', 'Hisoka vs. Chrollo', 'Complete fight dossier', Swords, 'reference', 'conflicts', { case: 'hisoka-chrollo' }],
];

export default function SiteHome({ onNavigate, onPrefetch }) {
  return (
    <div className="simple-home">
      <section className="simple-home__masthead">
        <span className="simple-home__kicker">Hunterpedia-sourced · manga and 2011 anime</span>
        <div className="simple-home__headline">
          <h1>Hunter × Hunter <em>Archive</em></h1>
          <p>A visual reference for the story, its characters, locations, Nen, conflicts, and current manga developments.</p>
        </div>
      </section>

      <section className="simple-home__eras" aria-label="Choose a story era">
        {entrances.map((entry, index) => (
          <button
            type="button"
            className={`simple-home__era simple-home__era--${entry.id}`}
            style={{ '--home-accent': entry.accent }}
            onPointerEnter={() => onPrefetch?.(entry.view, entry.target)}
            onFocus={() => onPrefetch?.(entry.view, entry.target)}
            onClick={() => onNavigate(entry.view, entry.target)}
            key={entry.id}
          >
            <figure>
              <SafeImage src={entry.image} alt={entry.imageAlt} eager={index === 0} priority={index === 0 ? 'high' : 'auto'} />
              <span>{entry.number}</span>
            </figure>
            <div className="simple-home__era-copy">
              <span>{entry.eyebrow}</span>
              <h2>{entry.title}</h2>
              <small>{entry.range}</small>
              <p>{entry.copy}</p>
              <strong>Explore this era <ArrowRight size={17} /></strong>
            </div>
          </button>
        ))}
      </section>

      <section className="simple-home__tools" aria-label="Open a core encyclopedia tool">
        <header>
          <span>Browse the archive</span>
          <p>Jump directly into a reference collection.</p>
        </header>
        <div>
          {tools.map(([id, title, note, Icon, view, target, params]) => (
            <button type="button" onClick={() => onNavigate(view, target, params)} onPointerEnter={() => onPrefetch?.(view, target)} onFocus={() => onPrefetch?.(view, target)} key={id}>
              <Icon size={19} />
              <span><strong>{title}</strong><small>{note}</small></span>
              <ArrowRight size={15} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
