import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileSearch,
  Library,
  Menu,
  Orbit,
  Search,
  Ship,
  Users,
  X,
} from 'lucide-react';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import { routeToHref } from '../../lib/appRouter';
import {
  getSuccessionArchiveHub,
  getSuccessionArchiveRoute,
  successionArchiveHubGroups,
  successionArchiveHubs,
} from '../../data/succession/archiveRoutes';
import SpoilerControl from '../SpoilerControl';
import SuccessionCommandHome from './SuccessionCommandHome';
import SuccessionInformationConsistencyPanel from './SuccessionInformationConsistencyPanel';
import { ArchivePageHeader } from './SuccessionArchivePrimitives';
import './SuccessionArchiveContrastFixes.css';
import './SuccessionArchiveDeepContrastFixes.css';
import './SuccessionArchiveNenFixes.css';

const iconByHub = {
  story: BookOpen,
  people: Users,
  'black-whale': Ship,
  nen: Orbit,
  search: Search,
  research: FileSearch,
  glossary: Library,
};

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const tabRouteParams = (hub, tab, routeParams = {}) => {
  const shared = {};
  if (routeParams.chapter) shared.chapter = routeParams.chapter;
  if (hub.id === 'black-whale') {
    if (routeParams.entity) shared.entity = routeParams.entity;
    if (routeParams.room) shared.room = routeParams.room;
  }
  return { ...shared, ...(tab.params || {}) };
};

function ArchiveNavigation({ activeHubId, onNavigate, onIntent, id }) {
  return <nav id={id} className="succession-archive-nav" aria-label="Succession Contest Archive">
    {successionArchiveHubGroups.map((group) => {
      const hubs = successionArchiveHubs.filter((item) => item.group === group);
      return <section key={group} aria-labelledby={`${id}-${group.toLowerCase()}-label`}>
        <h2 id={`${id}-${group.toLowerCase()}-label`}>{group}</h2>
        <div>{hubs.map((hub) => {
          const Icon = iconByHub[hub.id] || BookOpen;
          const active = hub.id === activeHubId;
          const href = routeToHref('succession', hub.target);
          return <a
            href={href}
            key={hub.id}
            className={active ? 'is-active' : ''}
            aria-current={active ? 'page' : undefined}
            onPointerEnter={() => onIntent?.(hub.target)}
            onFocus={() => onIntent?.(hub.target)}
            onClick={(event) => { event.preventDefault(); onNavigate(hub.target, {}); }}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{hub.label}</span>
          </a>;
        })}</div>
      </section>;
    })}
  </nav>;
}

function SuccessionHubTabs({ hub, activeRouteId, routeParams, onNavigate, onIntent }) {
  if (!hub?.tabs?.length) return null;
  return <nav className="succession-hub-tabs" aria-label={`${hub.label} views`}>
    {hub.tabs.map((tab) => {
      const selected = tab.routes.includes(activeRouteId);
      const params = tabRouteParams(hub, tab, routeParams);
      const href = routeToHref('succession', tab.target, params);
      return <a
        href={href}
        key={tab.target}
        className={selected ? 'is-active' : ''}
        aria-current={selected ? 'page' : undefined}
        onPointerEnter={() => onIntent?.(tab.target)}
        onFocus={() => onIntent?.(tab.target)}
        onClick={(event) => { event.preventDefault(); onNavigate(tab.target, params); }}
      >{tab.label}</a>;
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
  const activeHub = getSuccessionArchiveHub(route.id);
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

  const showCommandHome = route.id === 'story' && Object.keys(routeParams || {}).length === 0;
  if (showCommandHome) return <SuccessionCommandHome
    spoilerLimit={spoilerLimit}
    onNavigate={onNavigate}
    onOpenSearch={onOpenSearch}
  />;

  const navigate = (target, params = {}) => onNavigate(target, params);
  const headerActions = <button type="button" className="succession-button succession-button--search" onClick={onOpenSearch}><Search size={16} aria-hidden="true" /> Search <kbd>Ctrl K</kbd></button>;
  const onHubRoot = route.id === activeHub.target;

  return <article className="succession-archive" data-archive-route={route.id} data-archive-hub={activeHub.id}>
    <a className="succession-archive__skip-link" href="#succession-workspace-content">Skip to workspace</a>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{route.label} workspace loaded. Reading boundary Chapter {spoilerLimit}. Active hub: {activeHub.label}.</span>

    <div className="succession-archive__mobile-bar">
      <button ref={menuButtonRef} type="button" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-controls="succession-mobile-navigation"><Menu size={19} aria-hidden="true" /> Archive</button>
      <span>{activeHub.label}</span>
      <button type="button" onClick={onOpenSearch} aria-label="Search Succession Contest Archive"><Search size={18} aria-hidden="true" /></button>
    </div>

    <div className="succession-archive__status-strip" aria-label="Black Whale archive context">
      <span><Ship size={14} aria-hidden="true" /><strong>Black Whale 1</strong></span>
      <span><b>Desk</b> {activeHub.label}</span>
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
            <div><dt>Desk</dt><dd>{activeHub.label}</dd></div>
            <div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
          </dl>

          <div className="succession-archive__sidebar-scroll">
            <ArchiveNavigation id="succession-desktop-navigation" activeHubId={activeHub.id} onNavigate={navigate} onIntent={onIntent} />
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
                <li><span>Succession Contest</span></li>
                <li className="succession-breadcrumbs__separator" aria-hidden="true"><ChevronRight size={13} /></li>
                <li>{onHubRoot
                  ? <span aria-current="page">{activeHub.label}</span>
                  : <button type="button" onClick={() => navigate(activeHub.target, {})}>{activeHub.label}</button>}
                </li>
                {!onHubRoot && route.id !== 'archive' && <>
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

          <SuccessionHubTabs hub={activeHub} activeRouteId={route.id} routeParams={routeParams} onNavigate={navigate} onIntent={onIntent} />

          {!hidePageHeader && <ArchivePageHeader
            headingLevel="h1"
            kicker={`${activeHub.group} hub`}
            title={activeHub.title}
            description={activeHub.description}
            actions={headerActions}
            meta={[
              { label: 'View', value: route.label },
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
          >
            <SuccessionInformationConsistencyPanel activeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} />
            {route.id === 'archive' ? null : children}
          </div>
        </div>
      </div>
    </div>

    {drawerOpen && <div className="succession-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
      <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Succession Archive navigation">
        <header><div><span>Black Whale 1</span><strong>Succession Intelligence</strong></div><button type="button" onClick={() => { setDrawerOpen(false); window.setTimeout(() => menuButtonRef.current?.focus(), 0); }} aria-label="Close archive navigation"><X size={20} aria-hidden="true" /></button></header>
        <ArchiveNavigation id="succession-mobile-navigation" activeHubId={activeHub.id} onNavigate={navigate} onIntent={onIntent} />
      </aside>
    </div>}
  </article>;
}
