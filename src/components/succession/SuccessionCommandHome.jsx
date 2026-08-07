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
} from 'lucide-react';
import SafeImage from '../SafeImage';
import {
  ARCHIVE_BOUNDARY,
  ARCHIVE_DETAILED_BOUNDARY,
  ARCHIVE_REVIEW_DATE,
} from '../../data/archiveMeta';
import { blackWhaleImages } from '../../data/blackWhale';
import { routeToHref } from '../../lib/appRouter';
import './SuccessionCommandHome.css';
import './SuccessionCommandHomeQaFixes.css';

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
    <Icon size={16} strokeWidth={1.45} aria-hidden="true" />
    <span>{item.label}</span>
  </a>;
}

function PortalCard({ number, eyebrow, title, description, icon: Icon, href, onClick, variant }) {
  return <a className={`succession-command-home__portal is-${variant}`} href={href} onClick={onClick}>
    <span className="succession-command-home__portal-number">{number}</span>
    <Icon className="succession-command-home__portal-icon" size={28} strokeWidth={1.05} aria-hidden="true" />
    <div>
      <small>{eyebrow}</small>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
    <ArrowRight className="succession-command-home__portal-arrow" size={17} aria-hidden="true" />
    <span className="succession-command-home__portal-mark" aria-hidden="true" />
  </a>;
}

export default function SuccessionCommandHome({ spoilerLimit, onNavigate, onOpenSearch }) {
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
        <span>Black Whale 1</span>
        <small>Archive boundary · Ch. {spoilerLimit}</small>
      </footer>
    </aside>

    <main id="succession-command-content" className="succession-command-home__main" tabIndex="-1">
      <section className="succession-command-home__hero" aria-label="Black Whale voyage overview">
        <div className="succession-command-home__ship-stage">
          <SafeImage
            src={blackWhaleImages.exterior}
            alt="Black Whale 1 sailing toward the New Continent"
            fallbackLabel="Black Whale 1"
            eager
          />
        </div>

        <button type="button" className="succession-command-home__search" onClick={onOpenSearch}>
          <Search size={17} aria-hidden="true" />
          <span>Search archive</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="succession-command-home__locator" aria-hidden="true">
          <span>BW-01</span><i /><span>NEW CONTINENT ROUTE</span>
        </div>

        <section className="succession-command-home__voyage" aria-labelledby="succession-voyage-title">
          <header><span aria-hidden="true" /><h1 id="succession-voyage-title">Voyage status</h1></header>
          <dl>
            <div><dt>Vessel</dt><dd>Black Whale 1</dd></div>
            <div><dt>Reading boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
            <div><dt>Archive ceiling</dt><dd>Chapter {ARCHIVE_BOUNDARY}</dd></div>
            <div><dt>Detailed research</dt><dd>Chapter {ARCHIVE_DETAILED_BOUNDARY}</dd></div>
            <div><dt>Last review</dt><dd>{ARCHIVE_REVIEW_DATE}</dd></div>
          </dl>
        </section>

        <section className="succession-command-home__portals" aria-label="Core archive workspaces">
          <PortalCard
            number="01"
            eyebrow="Primary archive"
            title="Succession Contest"
            description="Royal families, assignments, organizations, events, relationships, and chapter intelligence."
            icon={Crown}
            href={routeHref('story', { mode: 'workspace' })}
            onClick={openSuccession}
            variant="succession"
          />
          <PortalCard
            number="02"
            eyebrow="Power system"
            title="Nen Encyclopedia"
            description="Principles, categories, techniques, abilities, conditions, costs, and users."
            icon={Orbit}
            href="/nen"
            variant="nen"
          />
          <PortalCard
            number="03"
            eyebrow="World intelligence"
            title="World Atlas"
            description="The Known World, nations, routes, nested locations, and voyage geography."
            icon={Globe2}
            href="/world"
            variant="world"
          />
        </section>
      </section>
    </main>
  </article>;
}
