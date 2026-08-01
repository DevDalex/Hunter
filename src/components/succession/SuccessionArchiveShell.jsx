import { useEffect, useRef, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  BookOpen,
  Boxes,
  Building2,
  ChevronRight,
  Clock3,
  Crown,
  FileSearch,
  Library,
  Map,
  Menu,
  Network,
  Orbit,
  Search,
  Shield,
  Ship,
  Swords,
  Users,
  X,
} from 'lucide-react';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import { routeToHref } from '../../lib/appRouter';
import {
  getSuccessionArchiveRoute,
  successionArchiveGroups,
  successionArchiveRoutes,
} from '../../data/succession/archiveRoutes';
import SpoilerControl from '../SpoilerControl';
import { ArchivePageHeader } from './SuccessionArchivePrimitives';
import './SuccessionArchiveContrastFixes.css';
import './SuccessionArchiveDeepContrastFixes.css';
import './SuccessionArchiveNenFixes.css';

const iconByRoute = {
  archive: Archive,
  story: BookOpen,
  timeline: Clock3,
  reader: BookOpen,
  search: Search,
  characters: Users,
  princes: Crown,
  queens: Crown,
  bodyguards: Shield,
  hunters: Shield,
  mafia: Swords,
  military: Shield,
  organizations: Building2,
  politics: Network,
  'black-whale': Ship,
  locations: Map,
  nen: Orbit,
  'guardian-spirit-beasts': Orbit,
  events: Clock3,
  deaths: FileSearch,
  relationships: Network,
  chapters: Library,
  research: FileSearch,
  glossary: Library,
  media: Boxes,
};

const hiddenNavigationRoutes = new Set(['archive', 'reader']);
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function ArchiveNavigation({ activeId, onNavigate, onIntent, id }) {
  return <nav id={id} className="succession-archive-nav" aria-label="Succession Contest Archive">
    {successionArchiveGroups.map((group) => {
      const routes = successionArchiveRoutes.filter((item) => item.group === group && !hiddenNavigationRoutes.has(item.id));
      return <section key={group} aria-labelledby={`${id}-${group.toLowerCase()}-label`}>
        <h2 id={`${id}-${group.toLowerCase()}-label`}>{group}</h2>
        <div>{routes.map((route) => {
          const Icon = iconByRoute[route.id] || Archive;
          const active = route.id === activeId;
          const routeParams = route.id === 'princes' ? { view: 'tree' } : {};
          const href = routeToHref('succession', route.id, routeParams);
          return <a
            href={href}
            key={route.id}
            className={active ? 'is-active' : ''}
            aria-current={active ? 'page' : undefined}
            onPointerEnter={() => onIntent?.(route.id)}
            onFocus={() => onIntent?.(route.id)}
            onClick={(event) => { event.preventDefault(); onNavigate(route.id, routeParams); }}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{route.label}</span>
            {route.status === 'foundation' && <small>Next</small>}
          </a>;
        })}</div>
      </section>;
    })}
  </nav>;
}

export default function SuccessionArchiveShell({
  activeId,
  routeParams,
  spoilerLimit,
  onSpoilerChange,
  onNavigate,
  onExitArchive,
  onOpenSearch,
  onIntent,
  children,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const contentRef = useRef(null);
  const previousRouteRef = useRef(activeId);
  const route = getSuccessionArchiveRoute(activeId);
  const hidePageHeader = route.id === 'princes' && routeParams?.view === 'tree';

  useEffect(() => setDrawerOpen(false), [activeId, routeParams]);

  useEffect(() => {
    if (route.id === 'archive') onNavigate('story', {});
  }, [onNavigate, route.id]);

  useEffect(() => {
    if (previousRouteRef.current === activeId) return;
    previousRouteRef.current = activeId;
    const frame = window.requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeId]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => drawerRef.current?.querySelector(focusableSelector)?.focus(), 20);
    const restoreMenuFocus = () => window.setTimeout(() => menuButtonRef.current?.focus(), 0);
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setDrawerOpen(false);
        restoreMenuFocus();
        return;
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const focusable = [...drawerRef.current.querySelectorAll(focusableSelector)].filter((node) => node.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [drawerOpen]);

  const navigate = (target, params = {}) => onNavigate(target, params);
  const headerActions = <button type="button" className="succession-button succession-button--search" onClick={onOpenSearch}><Search size={16} aria-hidden="true" /> Search <kbd>Ctrl K</kbd></button>;

  return <article className="succession-archive" data-archive-route={route.id}>
    <a className="succession-archive__skip-link" href="#succession-workspace-content">Skip to workspace</a>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{route.label} workspace loaded. Reading boundary Chapter {spoilerLimit}.</span>

    <div className="succession-archive__mobile-bar">
      <button ref={menuButtonRef} type="button" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-controls="succession-mobile-navigation"><Menu size={19} aria-hidden="true" /> Archive</button>
      <span>{route.label}</span>
      <button type="button" onClick={onOpenSearch} aria-label="Search Succession Contest Archive"><Search size={18} aria-hidden="true" /></button>
    </div>

    <div className="succession-archive__status-strip" aria-label="Black Whale archive context">
      <span><Ship size={14} aria-hidden="true" /><strong>Black Whale 1</strong></span>
      <span><b>Desk</b> {route.group}</span>
      <span><b>Boundary</b> Chapter {spoilerLimit}</span>
      <span><b>Evidence</b> Canon separated</span>
    </div>

    <div className="succession-archive__layout" aria-hidden={drawerOpen ? 'true' : undefined}>
      <aside className="succession-archive__sidebar">
        <div className="succession-archive__sidebar-inner">
          <div className="succession-archive__brand">
            <div className="succession-archive__brand-seal" aria-hidden="true"><Ship size={21} /></div>
            <div className="succession-archive__brand-copy">
              <span>Black Whale 1</span>
              <strong>Succession Intelligence</strong>
              <p>Chapter-bounded operations archive</p>
            </div>
          </div>

          <dl className="succession-archive__sidebar-context">
            <div><dt>Desk</dt><dd>{route.group}</dd></div>
            <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
          </dl>

          <div className="succession-archive__sidebar-scroll">
            <ArchiveNavigation id="succession-desktop-navigation" activeId={route.id} onNavigate={navigate} onIntent={onIntent} />
          </div>

          <details className="succession-archive__boundary">
            <summary>Reading boundary <b>Ch. {spoilerLimit}</b></summary>
            <SpoilerControl value={spoilerLimit} latestChapter={ARCHIVE_BOUNDARY} onChange={onSpoilerChange} />
          </details>
        </div>
      </aside>

      <div className="succession-archive__workspace">
        <div className="succession-archive__workspace-frame">
          <div className="succession-route-context">
            <nav className="succession-breadcrumbs" aria-label="Breadcrumb">
              <ol>
                <li><button type="button" onClick={onExitArchive}>Story</button></li>
                <li className="succession-breadcrumbs__separator" aria-hidden="true"><ChevronRight size={13} /></li>
                <li><span aria-current={route.id === 'story' ? 'page' : undefined}>Succession Contest</span></li>
                {route.id !== 'story' && route.id !== 'archive' && <>
                  <li className="succession-breadcrumbs__separator" aria-hidden="true"><ChevronRight size={13} /></li>
                  <li><span aria-current="page">{route.label}</span></li>
                </>}
              </ol>
            </nav>
            <button
              type="button"
              className="succession-return-path"
              onClick={onExitArchive}
              aria-label="Return to Story"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Return to Story</span>
            </button>
          </div>
          {!hidePageHeader && <ArchivePageHeader
            headingLevel="h1"
            kicker={`${route.group} workspace`}
            title={route.title}
            description={route.description}
            actions={headerActions}
            meta={[
              { label: 'Vessel', value: 'Black Whale 1' },
              { label: 'Reading boundary', value: `Chapter ${spoilerLimit}` },
              { label: 'Evidence mode', value: 'Canon separated' },
            ]}
          />}
          <div
            ref={contentRef}
            id="succession-workspace-content"
            className="succession-archive__content"
            role="region"
            aria-label={`${route.label} workspace content`}
            tabIndex="-1"
          >{route.id === 'archive' ? null : children}</div>
        </div>
      </div>
    </div>

    {drawerOpen && <div className="succession-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
      <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Succession Archive navigation">
        <header><div><span>Black Whale 1</span><strong>Succession Intelligence</strong></div><button type="button" onClick={() => { setDrawerOpen(false); window.setTimeout(() => menuButtonRef.current?.focus(), 0); }} aria-label="Close archive navigation"><X size={20} aria-hidden="true" /></button></header>
        <ArchiveNavigation id="succession-mobile-navigation" activeId={route.id} onNavigate={navigate} onIntent={onIntent} />
      </aside>
    </div>}
  </article>;
}
