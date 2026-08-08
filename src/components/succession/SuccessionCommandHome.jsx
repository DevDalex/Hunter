import {
  ArrowRight,
  Bell,
  BookOpen,
  Crown,
  FileSearch,
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
import {
  successionHomeCounts,
  successionHomeRecentChapters,
} from '../../data/successionHomeSummary';
import { routeToHref } from '../../lib/appRouter';
import './SuccessionCommandHome.css';
import './SuccessionCommandHomeQaFixes.css';

const BLACK_WHALE_HERO = '/media/rooms/black-whale-exterior.webp';
const KURAPIKA_PORTRAIT = '/media/portraits/kurapika.webp';

const navigation = [
  { label: 'Home', target: 'archive', icon: Home, active: true },
  { label: 'Timeline', target: 'timeline', icon: Network },
  { label: 'Succession Contest', target: 'story', params: { mode: 'workspace' }, icon: Crown },
  { label: 'Nen Encyclopedia', href: '/nen', icon: Orbit },
  { divider: true, label: 'Archive tools' },
  { label: 'Manga Reader', target: 'reader', icon: BookOpen },
  { label: 'Research Lab', target: 'research', icon: FileSearch },
  { label: 'Glossary', target: 'glossary', icon: Library },
  { label: 'Updates', target: 'chapters', icon: Bell },
];

const routeHref = (target, params = {}) => routeToHref('succession', target, params);

function ArchiveLink({ item, onNavigate }) {
  if (item.divider) {
    return <span className="succession-command-home__rail-divider" aria-hidden="true" />;
  }

  const Icon = item.icon;
  const href = item.href || routeHref(item.target, item.params || {});
  const directHref = Boolean(item.href);

  return <a
    className={item.active ? 'is-active' : ''}
    href={href}
    aria-current={item.active ? 'page' : undefined}
    onClick={directHref ? undefined : (event) => {
      event.preventDefault();
      onNavigate(item.target, item.params || {});
    }}
  >
    <Icon size={17} strokeWidth={1.35} aria-hidden="true" />
    <span>{item.label}</span>
    {item.active && <i aria-hidden="true" />}
  </a>;
}

function PortalCard({ number, title, description, href, onClick, variant, children }) {
  return <a className={`succession-command-home__portal is-${variant}`} href={href} onClick={onClick}>
    <span className="succession-command-home__portal-number">{number}</span>
    <div className="succession-command-home__portal-copy">
      <h2>{title}</h2>
      <p>{description}</p>
      <strong>Explore <ArrowRight size={15} aria-hidden="true" /></strong>
    </div>
    <div className="succession-command-home__portal-visual" aria-hidden="true">{children}</div>
  </a>;
}

function QuickAccessItem({ label, count, icon: Icon, target, params = {}, onNavigate }) {
  return <a
    href={routeHref(target, params)}
    onClick={(event) => {
      event.preventDefault();
      onNavigate(target, params);
    }}
  >
    <Icon size={26} strokeWidth={1.1} aria-hidden="true" />
    <span>{label}</span>
    <b>{count}</b>
  </a>;
}

const chapterLabel = (chapter) => chapter.title || chapter.name || `Chapter ${chapter.number}`;

export default function SuccessionCommandHome({ spoilerLimit, onNavigate, onOpenSearch }) {
  const recentChapters = successionHomeRecentChapters;

  const openSuccession = (event) => {
    event.preventDefault();
    onNavigate('story', { mode: 'workspace' });
  };

  const openReader = (event) => {
    event.preventDefault();
    onNavigate('reader', {});
  };

  return <article className="succession-command-home" data-archive-route="story" data-archive-hub="story">
    <a className="succession-command-home__skip" href="#succession-command-content">Skip to archive content</a>

    <aside className="succession-command-home__rail" aria-label="Hunter Archive navigation">
      <button
        type="button"
        className="succession-command-home__identity"
        onClick={() => onNavigate('archive', {})}
        aria-label="Open Succession Archive home"
      >
        <span className="succession-command-home__identity-mark" aria-hidden="true">
          <i /><b>×</b><i />
        </span>
        <strong>Hunter × Hunter</strong>
        <small>Succession Contest</small>
        <small>Archive</small>
      </button>

      <nav>{navigation.map((item, index) => <ArchiveLink key={`${item.label}-${index}`} item={item} onNavigate={onNavigate} />)}</nav>

      <footer>
        <span>Black Whale 1</span>
        <small>Archive boundary · Ch. {spoilerLimit}</small>
      </footer>
    </aside>

    <main id="succession-command-content" className="succession-command-home__main" tabIndex="-1">
      <section className="succession-command-home__hero" aria-label="Black Whale voyage overview">
        <div className="succession-command-home__hero-grid" aria-hidden="true" />
        <div className="succession-command-home__hero-orbit" aria-hidden="true" />

        <div className="succession-command-home__ship-stage">
          <SafeImage
            src={BLACK_WHALE_HERO}
            alt="Black Whale 1 sailing toward the New Continent"
            fallbackLabel="Black Whale 1"
            eager
          />
        </div>

        <button type="button" className="succession-command-home__search" onClick={onOpenSearch}>
          <Search size={18} strokeWidth={1.35} aria-hidden="true" />
          <span>Search the archive…</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="succession-command-home__telemetry" aria-hidden="true">
          <span>BW-01</span>
          <i />
          <small>New Continent route</small>
        </div>

        <section className="succession-command-home__voyage" aria-labelledby="succession-voyage-title">
          <header><span aria-hidden="true" /><h1 id="succession-voyage-title">Voyage status</h1></header>
          <dl>
            <div><dt>Vessel</dt><dd>Black Whale 1</dd></div>
            <div><dt>Reading boundary</dt><dd className="is-accent">Chapter {spoilerLimit}</dd></div>
            <div><dt>Research coverage</dt><dd>Chapter {ARCHIVE_DETAILED_BOUNDARY}</dd></div>
            <div><dt>Archive ceiling</dt><dd>Chapter {ARCHIVE_BOUNDARY}</dd></div>
            <div><dt>Last review</dt><dd>{ARCHIVE_REVIEW_DATE}</dd></div>
          </dl>
        </section>
      </section>

      <section className="succession-command-home__portals" aria-label="Primary archive workspaces">
        <PortalCard
          number="01"
          title="Succession Contest Archive"
          description="Princes, families, organizations, assignments, events, relationships, and chapter intelligence."
          href={routeHref('story', { mode: 'workspace' })}
          onClick={openSuccession}
          variant="succession"
        >
          <div className="succession-command-home__portrait-stack">
            {['benjamin-hui-guo-rou.webp', 'camilla-hui-guo-rou.webp', 'kurapika.webp', 'tserriednich-hui-guo-rou.webp', 'woble-hui-guo-rou.webp'].map((file) => (
              <img key={file} src={`/media/portraits/${file}`} alt="" loading="lazy" decoding="async" />
            ))}
          </div>
        </PortalCard>

        <PortalCard
          number="02"
          title="Nen Encyclopedia"
          description="Nen abilities, categories, principles, conditions, techniques, costs, and users."
          href="/nen"
          variant="nen"
        >
          <div className="succession-command-home__nen-diagram">
            <span /><span /><span /><span />
            <i>発</i>
          </div>
        </PortalCard>

        <PortalCard
          number="03"
          title="Manga Reader"
          description="Read the imported Succession Contest chapters with direct chapter-record bridges."
          href={routeHref('reader')}
          onClick={openReader}
          variant="reader"
        >
          <div className="succession-command-home__reader-visual">
            <BookOpen size={94} strokeWidth={0.65} />
            <span>340</span><span>416</span>
          </div>
        </PortalCard>
      </section>

      <section className="succession-command-home__lower-grid">
        <section className="succession-command-home__quick" aria-labelledby="succession-quick-title">
          <header><h2 id="succession-quick-title">Quick access</h2></header>
          <div>
            <QuickAccessItem label="Princes" count={successionHomeCounts.princes} icon={Crown} target="princes" onNavigate={onNavigate} />
            <QuickAccessItem label="Families" count={successionHomeCounts.families} icon={Users} target="princes" params={{ view: 'tree' }} onNavigate={onNavigate} />
            <QuickAccessItem label="Organizations" count={successionHomeCounts.organizations} icon={Network} target="organizations" onNavigate={onNavigate} />
            <QuickAccessItem label="Assignments" count={successionHomeCounts.assignments} icon={FileSearch} target="bodyguards" onNavigate={onNavigate} />
            <QuickAccessItem label="Chapters" count={successionHomeCounts.chapters} icon={BookOpen} target="chapters" onNavigate={onNavigate} />
          </div>
        </section>

        <section className="succession-command-home__updates" aria-labelledby="succession-updates-title">
          <header>
            <h2 id="succession-updates-title">Latest updates</h2>
            <button type="button" onClick={() => onNavigate('chapters', {})}>View all updates <ArrowRight size={14} aria-hidden="true" /></button>
          </header>
          <div>
            {recentChapters.map((chapter) => <a
              key={chapter.id}
              href={routeHref('chapters', { entity: chapter.id })}
              onClick={(event) => {
                event.preventDefault();
                onNavigate('chapters', { entity: chapter.id });
              }}
            >
              <BookOpen size={14} strokeWidth={1.2} aria-hidden="true" />
              <span><b>Chapter {chapter.number}</b><small>{chapterLabel(chapter)}</small></span>
              <em>Ch. {chapter.number}</em>
            </a>)}
            {!recentChapters.length && <p>No chapter records are available inside the current archive boundary.</p>}
          </div>
        </section>

        <section className="succession-command-home__quote" aria-label="Kurapika archive quote">
          <div className="succession-command-home__quote-media">
            <SafeImage src={KURAPIKA_PORTRAIT} alt="Kurapika" fallbackLabel="Kurapika" />
          </div>
          <blockquote>“In this world, wherever there is light, there are also shadows.”</blockquote>
          <cite>Kurapika</cite>
          <div className="succession-command-home__quote-dots" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>
      </section>
    </main>
  </article>;
}
