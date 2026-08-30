import './SuccessionCommandHome.css';
import './SuccessionCommandHomeTimelineLink.css';

const pillars = [
  {
    id: 'timeline',
    href: '/timeline',
    number: '01',
    label: 'Timeline',
    items: ['Chapters', 'Events', 'Threads', 'Black Whale', 'Locations'],
  },
  {
    id: 'characters',
    href: '/characters',
    number: '02',
    label: 'Characters',
    items: ['Princes', 'Queens', 'Guards', 'Hunters', 'Mafia', 'Troupe'],
  },
  {
    id: 'nen',
    href: '/nen',
    number: '03',
    label: 'Nen',
    items: ['Abilities', 'Spirit Beasts', 'Rituals', 'Conditions', 'Curses', 'Unknowns'],
  },
];

export default function SuccessionCommandHome() {
  return <article
    className="succession-command-home"
    data-archive-route="home"
    data-archive-hub="succession"
  >
    <a className="succession-command-home__skip" href="#succession-command-content">
      Skip to archive content
    </a>

    <div className="succession-command-home__whale" aria-hidden="true" />

    <main id="succession-command-content" className="succession-command-home__main" tabIndex="-1">
      <section className="succession-command-home__menu" aria-label="Succession Contest archive">
        {pillars.map((pillar) => <div className="succession-command-home__group" key={pillar.id}>
          <a className="succession-command-home__entry" href={pillar.href}>
            <span className="succession-command-home__number">{pillar.number}</span>
            <span className="succession-command-home__entry-copy">
              <strong>{pillar.label}</strong>
              <small>{pillar.items.map((item) => <span key={item}>{item}</span>)}</small>
            </span>
            <span className="succession-command-home__plus" aria-hidden="true">↗</span>
          </a>
        </div>)}
      </section>
    </main>
  </article>;
}
