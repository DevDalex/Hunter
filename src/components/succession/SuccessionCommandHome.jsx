import {
  ArrowRight,
  Bell,
  BookOpen,
  Crown,
  FileSearch,
  Globe2,
  Home,
  Library,
  Network,
  Orbit,
  Search,
  Ship,
  Users,
} from 'lucide-react';
import SafeImage from '../SafeImage';
import {
  ARCHIVE_BOUNDARY,
  ARCHIVE_DETAILED_BOUNDARY,
  ARCHIVE_REVIEW_DATE,
} from '../../data/archiveMeta';
import { blackWhaleImages } from '../../data/blackWhale';
import { getEntitiesByType } from '../../data/succession/successionData';
import { routeToHref } from '../../lib/appRouter';
import './SuccessionCommandHome.css';

const navigation = [
  { label: 'Home', target: 'story', icon: Home, active: true },
  { label: 'Timeline', target: 'timeline', icon: Network },
  { label: 'Succession Contest', target: 'story', params: { mode: 'workspace' }, icon: Crown },
  { label: 'Nen Encyclopedia', href: '/nen', icon: Orbit },
  { label: 'World Atlas', href: '/world', icon: Globe2 },
  { label: 'Manga Reader', target: 'reader', icon: BookOpen },
  { label: 'Research Lab', target: 'research', icon: FileSearch },
  { label: 'Glossary', target: 'glossary', icon: Library },
  { label: 'Updates', target: 'chapters', icon: Bell },
];

const routeHref = (target, params = {}) => routeToHref('succession', target, params);

function ArchiveLink({ item, onNavigate }) {
  const Icon = item.icon;
  const href = item.href || routeHref(item.target, item.params || {});
  const externalRoute = Boolean(item.href);

  return <a
    className={item.active ? 'is-active' : ''}
    href={href}
    aria-current={item.active ? 'page' : undefined}
    onClick={externalRoute ? undefined : (event) => {
      event.preventDefault();
      onNavigate(item.target, item.params || {});
    }}
  >
    <Icon size={17} strokeWidth={1.55} aria-hidden="true" />
    <span>{item.label}</span>
  </a>;
}

function WorkspaceCard({ number, title, description, icon: Icon, href, onClick, visual }) {
  return <a className="succession-command-home__workspace-card" href={href} onClick={onClick}>
    <span className="succession-command-home__workspace-number">{number}</span>
    <div>
      <Icon size={31} strokeWidth={1.15} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      <strong>Explore <ArrowRight size={15} aria-hidden="true" /></strong>
    </div>
    {visual}
  </a>;
}

function QuickAccessItem({ label, count, icon: Icon, target, onNavigate }) {
  return <a
    href={routeHref(target)}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(target, {});
    }}
  >
    <Icon size={25} strokeWidth={1.2} aria-hidden="true" />
    <span>{label}</span>
    <b>{count}</b>
  </a>;
}

const chapterLabel = (chapter) => chapter.title || chapter.name || `Chapter ${chapter.number}`;

export default function SuccessionCommandHome({ spoilerLimit, onNavigate, onOpenSearch }) {
  const characters = getEntitiesByType('character');
  const princes = characters.filter((entity) => (entity.roles || []).includes('prince'));
  const queens = characters.filter((entity) => (entity.roles || []).includes('queen'));
  const organizations = getEntitiesByType('organization');
  const assignments = getEntitiesByType('assignment');
  const chapters = [...getEntitiesByType('chapter')]
    .filter((chapter) => Number(chapter.number) >= 340)
    .sort((left, right) => Number(right.number || 0) - Number(left.number || 0));
  const recentChapters = chapters.slice(0, 4);

  const openSuccession = (event) => {
    event.preventDefault();
    onNavigate('story', { mode: 'workspace' });
  };

  return <article className="succession-command-home" data-archive-route="story" data-archive-hub="story">
    <a className="succession-command-home__skip" href="#succession-command-content">Skip to archive content</a>

    <aside className="succession-command-home__rail" aria-label="Hunter Archive navigation">
      <button
        type="button"
        className="succession-command-home__identity"
        onClick={() => onNavigate('story', {})}
        aria-label="Open Succession Archive home"
      >
        <span aria-hidden="true">×</span>
        <strong>Hunter Archive</strong>
        <small>Succession Contest</small>
      </button>

      <nav>{navigation.map((item) => <ArchiveLink key={item.label} item={item} onNavigate={onNavigate} />)}</nav>

      <footer>
        <span>Evidence-bound archive</span>
        <small>Canon · inference · uncertainty</small>
      </footer>
    </aside>

    <main id="succession-command-content" className="succession-command-home__main" tabIndex="-1">
      <section className="succession-command-home__hero" aria-label="Black Whale voyage overview">
        <button type="button" className="succession-command-home__search" onClick={onOpenSearch}>
          <Search size={18} aria-hidden="true" />
          <span>Search the archive…</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="succession-command-home__ship-stage">
          <SafeImage
            src={blackWhaleImages.exterior}
            alt="Black Whale 1 sailing toward the New Continent"
            fallbackLabel="Black Whale 1"
            eager
          />
        </div>

        <section className="succession-command-home__voyage" aria-labelledby="succession-voyage-title">
          <header><span aria-hidden="true" /><h1 id="succession-voyage-title">Voyage status</h1></header>
          <dl>
            <div><dt>Current vessel</dt><dd>Black Whale 1</dd></div>
            <div><dt>Reading boundary</dt><dd>Ch. {spoilerLimit}</dd></div>
            <div><dt>Archive ceiling</dt><dd>Ch. {ARCHIVE_BOUNDARY}</dd></div>
            <div><dt>Detailed research</dt><dd>Ch. {ARCHIVE_DETAILED_BOUNDARY}</dd></div>
            <div><dt>Reviewed</dt><dd>{ARCHIVE_REVIEW_DATE}</dd></div>
          </dl>
        </section>
      </section>

      <section className="succession-command-home__workspaces" aria-label="Core archive workspaces">
        <WorkspaceCard
          number="01"
          title="Succession Contest Archive"
          description="Princes, families, assignments, organizations, events, relationships, and chapter-bounded story intelligence."
          icon={Crown}
          href={routeHref('story', { mode: 'workspace' })}
          onClick={openSuccession}
          visual={<div className="succession-command-home__crown-visual" aria-hidden="true"><Crown size={84} strokeWidth={0.8} /></div>}
        />
        <WorkspaceCard
          number="02"
          title="Nen Encyclopedia"
          description="The retained general map of Nen principles, categories, techniques, abilities, conditions, and users."
          icon={Orbit}
          href="/nen"
          visual={<div className="succession-command-home__nen-visual" aria-hidden="true"><span /><span /><span /><i>発</i></div>}
        />
        <WorkspaceCard
          number="03"
          title="World Atlas"
          description="The retained atlas of the Known World, voyage routes, nations, locations, hierarchies, and visual records."
          icon={Globe2}
          href="/world"
          visual={<div className="succession-command-home__world-visual" aria-hidden="true"><Globe2 size={128} strokeWidth={0.55} /></div>}
        />
      </section>

      <section className="succession-command-home__lower-grid">
        <section className="succession-command-home__quick" aria-labelledby="succession-quick-title">
          <header><span>Direct access</span><h2 id="succession-quick-title">Archive desks</h2></header>
          <div>
            <QuickAccessItem label="Princes" count={princes.length} icon={Crown} target="princes" onNavigate={onNavigate} />
            <QuickAccessItem label="Queens" count={queens.length} icon={Users} target="queens" onNavigate={onNavigate} />
            <QuickAccessItem label="Organizations" count={organizations.length} icon={Network} target="organizations" onNavigate={onNavigate} />
            <QuickAccessItem label="Assignments" count={assignments.length} icon={FileSearch} target="bodyguards" onNavigate={onNavigate} />
            <QuickAccessItem label="Chapters" count={chapters.length} icon={BookOpen} target="chapters" onNavigate={onNavigate} />
          </div>
        </section>

        <section className="succession-command-home__updates" aria-labelledby="succession-updates-title">
          <header><div><span>Archive activity</span><h2 id="succession-updates-title">Latest chapter records</h2></div><button type="button" onClick={() => onNavigate('chapters', {})}>View all <ArrowRight size={14} aria-hidden="true" /></button></header>
          <div>
            {recentChapters.map((chapter) => <a
              key={chapter.id}
              href={routeHref('chapters', { entity: chapter.id })}
              onClick={(event) => {
                event.preventDefault();
                onNavigate('chapters', { entity: chapter.id });
              }}
            >
              <BookOpen size={15} aria-hidden="true" />
              <span><b>Chapter {chapter.number}</b><small>{chapterLabel(chapter)}</small></span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>)}
            {!recentChapters.length && <p>No chapter records are available inside the current archive boundary.</p>}
          </div>
        </section>

        <section className="succession-command-home__evidence" aria-labelledby="succession-evidence-title">
          <header><span>Research discipline</span><h2 id="succession-evidence-title">Every claim keeps its certainty.</h2></header>
          <p>The interface separates confirmed canon, supported inference, and unresolved questions instead of flattening them into one answer.</p>
          <ul>
            <li><i />Confirmed</li>
            <li><i />Inferred</li>
            <li><i />Unresolved</li>
          </ul>
        </section>
      </section>
    </main>
  </article>;
}
