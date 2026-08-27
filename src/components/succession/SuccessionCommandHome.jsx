import { useState } from 'react';
import './SuccessionCommandHome.css';

const groups = [
  {
    id: 'story',
    number: '01',
    label: 'Story',
    items: ['Timeline', 'Chapters', 'Events', 'Threads', 'Black Whale'],
  },
  {
    id: 'characters',
    number: '02',
    label: 'Characters',
    items: ['Princes', 'Queens', 'Guards', 'Hunters', 'Mafia', 'Troupe'],
  },
  {
    id: 'nen',
    number: '03',
    label: 'Nen',
    items: ['Abilities', 'Types', 'Beasts', 'Conditions', 'Unknowns'],
  },
];

export default function SuccessionCommandHome() {
  const [openGroup, setOpenGroup] = useState(null);

  return <article
    className="succession-command-home"
    data-archive-route="story"
    data-archive-hub="story"
  >
    <a className="succession-command-home__skip" href="#succession-command-content">
      Skip to archive content
    </a>

    <div className="succession-command-home__whale" aria-hidden="true" />

    <main id="succession-command-content" className="succession-command-home__main" tabIndex="-1">
      <section className="succession-command-home__menu" aria-label="Archive sections">
        {groups.map((group) => {
          const expanded = openGroup === group.id;

          return <div className="succession-command-home__group" key={group.id}>
            <button
              className="succession-command-home__entry"
              type="button"
              aria-expanded={expanded}
              aria-controls={`succession-home-${group.id}`}
              onClick={() => setOpenGroup(expanded ? null : group.id)}
            >
              <span className="succession-command-home__number">{group.number}</span>

              <span className="succession-command-home__entry-copy">
                <strong>{group.label}</strong>
                <small>
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </small>
              </span>

              <span className="succession-command-home__plus" aria-hidden="true">+</span>
            </button>

            <div
              id={`succession-home-${group.id}`}
              className={`succession-command-home__detail${expanded ? ' is-open' : ''}`}
            >
              <div className="succession-command-home__detail-inner">
                <div className="succession-command-home__subcategories" aria-label={`${group.label} subcategories`}>
                  {group.items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            </div>
          </div>;
        })}
      </section>
    </main>
  </article>;
}
