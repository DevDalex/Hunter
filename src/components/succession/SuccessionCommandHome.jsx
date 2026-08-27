import { useState } from 'react';
import { routeToHref } from '../../lib/appRouter';
import './SuccessionCommandHome.css';

const groups = [
  {
    id: 'story',
    number: '01',
    label: 'Story',
    meta: ['Timeline', 'Chapters', 'Events', 'Threads', 'Black Whale'],
    links: [
      { label: 'Timeline', target: 'timeline' },
      { label: 'Chapters', target: 'chapters' },
      { label: 'Succession Archive', target: 'story', params: { mode: 'workspace' } },
      { label: 'Manga Reader', target: 'reader' },
      { label: 'Research', target: 'research' },
    ],
  },
  {
    id: 'characters',
    number: '02',
    label: 'Characters',
    meta: ['Princes', 'Queens', 'Guards', 'Hunters', 'Mafia', 'Troupe'],
    links: [
      { label: 'Princes', target: 'princes' },
      { label: 'Families', target: 'princes', params: { view: 'tree' } },
      { label: 'Organizations', target: 'organizations' },
      { label: 'Bodyguards', target: 'bodyguards' },
    ],
  },
  {
    id: 'nen',
    number: '03',
    label: 'Nen',
    meta: ['Abilities', 'Types', 'Beasts', 'Conditions', 'Unknowns'],
    links: [
      { label: 'Nen Encyclopedia', href: '/nen' },
      { label: 'Glossary', target: 'glossary' },
    ],
  },
];

const routeHref = (target, params = {}) => routeToHref('succession', target, params);

function ArchiveAction({ item, onNavigate }) {
  if (item.href) {
    return <a href={item.href}>{item.label}</a>;
  }

  return <a
    href={routeHref(item.target, item.params || {})}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(item.target, item.params || {});
    }}
  >
    {item.label}
  </a>;
}

export default function SuccessionCommandHome({ onNavigate }) {
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
                  {group.meta.map((item) => <span key={item}>{item}</span>)}
                </small>
              </span>

              <span className="succession-command-home__plus" aria-hidden="true">+</span>
            </button>

            <div
              id={`succession-home-${group.id}`}
              className={`succession-command-home__detail${expanded ? ' is-open' : ''}`}
            >
              <div className="succession-command-home__detail-inner">
                <nav aria-label={`${group.label} destinations`}>
                  {group.links.map((item) => (
                    <ArchiveAction key={item.label} item={item} onNavigate={onNavigate} />
                  ))}
                </nav>
              </div>
            </div>
          </div>;
        })}
      </section>
    </main>
  </article>;
}
