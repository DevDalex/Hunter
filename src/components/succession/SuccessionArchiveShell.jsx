import { lazy, Suspense, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileSearch,
  Library,
  Orbit,
  Search,
  Ship,
  Users,
} from 'lucide-react';
import { ARCHIVE_BOUNDARY } from '../../data/archiveMeta';
import { routeToHref } from '../../lib/appRouter';
import { getEntitiesByType, getEntityById } from '../../data/succession/successionData';
import { recordSuccessionLocalRouteView } from '../../data/succession/localAnalytics';
import {
  getSuccessionArchiveHub,
  getSuccessionArchiveRoute,
  successionArchiveHubGroups,
  successionArchiveHubs,
} from '../../data/succession/archiveRoutes';
import SpoilerControl from '../SpoilerControl';
import SuccessionCommandHome from './SuccessionCommandHome';
import SuccessionComprehensionBar from './SuccessionComprehensionBar';
import SuccessionConsolidatedRouteNotice from './SuccessionConsolidatedRouteNotice';
import SuccessionCoverageRoadmap from './SuccessionCoverageRoadmap';
import SuccessionEntityQuickBriefing from './SuccessionEntityQuickBriefing';
import SuccessionLocalAnalyticsPanel from './SuccessionLocalAnalyticsPanel';
import SuccessionNowDashboard from './SuccessionNowDashboard';
import SuccessionPeoplePowerComprehensionPanel from './SuccessionPeoplePowerComprehensionPanel';
import SuccessionNenSpatialComprehensionPanel from './SuccessionNenSpatialComprehensionPanel';
import SuccessionOnboardingMission from './SuccessionOnboardingMission';
import { ArchivePageHeader } from './SuccessionArchivePrimitives';
import './SuccessionArchiveHistoricalLayers.css';

const SuccessionInformationConsistencyPanel = lazy(() => import('./SuccessionInformationConsistencyPanel'));

const iconByHub = {
  story: BookOpen,
  people: Users,
  'black-whale': Ship,
  nen: Orbit,
  search: Search,
  research: FileSearch,
  glossary: Library,
};

const tabRouteParams = (hub, tab, routeParams = {}) => {
  const shared = {};
  if (routeParams.chapter) shared.chapter = routeParams.chapter;
  if (hub.id === 'black-whale') {
    if (routeParams.entity) shared.entity = routeParams.entity;
    if (routeParams.room) shared.room = routeParams.room;
  }
  return { ...shared, ...(tab.params || {}) };
};

const needsCharacterConsistency = (routeId, routeParams = {}) => {
  if (!['characters', 'princes', 'queens'].includes(routeId)) return false;
  if (routeParams.entity) return true;
  if (routeId === 'princes' && Number.isFinite(Number(routeParams.prince))) return true;
  if (routeId === 'queens' && routeParams.focus) return true;
  return false;
};

const resolveBriefingEntity = (routeId, routeParams = {}) => {
  if (routeParams.entity) return getEntityById(routeParams.entity);
  if (routeId === 'princes' && Number.isFinite(Number(routeParams.prince))) {
    return getEntitiesByType('character').find((entity) => entity.princeOrder === Number(routeParams.prince)) || null;
  }
  if (routeId === 'chapters' && Number.isFinite(Number(routeParams.chapter))) {
    return getEntitiesByType('chapter').find((entity) => entity.number === Number(routeParams.chapter)) || null;
  }
  if (routeId === 'queens' && routeParams.focus) return getEntityById(routeParams.focus) || null;
  return null;
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
      </section>
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
  const contentRef = useRef(null);
  const previousRouteRef = useRef(null);
  const route = getSuccessionArchiveRoute(activeId);
  const activeHub = getSuccessionArchiveHub(route.id);
  const hidePageHeader = route.id === 'princes' && routeParams?.view === 'tree';
  const showCharacterConsistency = needsCharacterConsistency(route.id, routeParams);
  const briefingEntity = hidePageHeader ? null : resolveBriefingEntity(route.id, routeParams);
  const requestedBriefingChapter = Number(routeParams?.chapter);
  const briefingChapter = Number.isFinite(requestedBriefingChapter) ? Math.min(spoilerLimit, Math.max(340, requestedBriefingChapter)) : spoilerLimit;
  const consolidationSource = routeParams?.consolidatedFrom || (route.status === 'legacy' ? route.id : null);

  useEffect(() => {
    if (route.id === 'archive') onNavigate('story', {});
  }, [onNavigate, route.id]);

  useEffect(() => {
    if (route.id !== 'archive') recordSuccessionLocalRouteView(route.id);
  }, [route.id]);

  useEffect(() => {
    const previousRoute = previousRouteRef.current;
    previousRouteRef.current = activeId;
    if (route.id === 'search' || previousRoute === activeId) return undefined;
    const frame = window.requestAnimationFrame(() => contentRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [activeId, route.id]);

  const showCommandHome = route.id === 'story' && Object.keys(routeParams || {}).length === 0;
  if (showCommandHome) return <>
    <SuccessionOnboardingMission onNavigate={onNavigate} />
    <SuccessionCommandHome
      spoilerLimit={spoilerLimit}
      onNavigate={onNavigate}
      onOpenSearch={onOpenSearch}
    />
  </>;

  const navigate = (target, params = {}) => onNavigate(target, params);
  const headerActions = <button type="button" className="succession-button succession-button--search" onClick={onOpenSearch}><Search size={16} aria-hidden="true" /> Search <kbd>Ctrl K</kbd></button>;
  const onHubRoot = route.id === activeHub.target;
  const showNow = route.id === 'story';
  const showPeoplePower = activeHub.id === 'people';
  const showNenSpatial = ['nen', 'black-whale'].includes(activeHub.id);
  const showResearchOverviewMeta = route.id === 'research' && (!routeParams?.mode || routeParams.mode === 'overview');

  return <article className="succession-archive" data-archive-route={route.id} data-archive-hub={activeHub.id}>
    <a className="succession-archive__skip-link" href="#succession-workspace-content">Skip to workspace</a>
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{route.label} workspace loaded. Reading boundary Chapter {spoilerLimit}. Active hub: {activeHub.label}.</span>

    <div className="succession-archive__status-strip" aria-label="Black Whale archive context">
      <span><Ship size={14} aria-hidden="true" /><strong>Black Whale 1</strong></span>
      <span><b>Evidence</b> Canon separated</span>
    </div>

    <div className="succession-archive__layout">
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
          <SuccessionComprehensionBar spoilerLimit={spoilerLimit} onSpoilerChange={onSpoilerChange} onNavigate={navigate} />
          <SuccessionConsolidatedRouteNotice from={consolidationSource} currentRouteId={route.id} onNavigate={navigate} />

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
            meta={[{ label: 'View', value: route.label }]}
          />}
          <div
            ref={contentRef}
            id="succession-workspace-content"
            className="succession-archive__content"
            role="region"
            aria-label={`${route.label} workspace content`}
            tabIndex="-1"
          >
            {briefingEntity && <SuccessionEntityQuickBriefing entity={briefingEntity} chapter={briefingChapter} onNavigate={navigate} />}
            {showNow && <SuccessionNowDashboard chapter={spoilerLimit} onNavigate={navigate} />}
            {showPeoplePower && <SuccessionPeoplePowerComprehensionPanel chapter={spoilerLimit} onNavigate={navigate} />}
            {showNenSpatial && <SuccessionNenSpatialComprehensionPanel chapter={spoilerLimit} onNavigate={navigate} />}
            {showResearchOverviewMeta && <SuccessionCoverageRoadmap chapter={spoilerLimit} onNavigate={navigate} />}
            {showResearchOverviewMeta && <SuccessionLocalAnalyticsPanel />}
            {showCharacterConsistency && <Suspense fallback={null}>
              <SuccessionInformationConsistencyPanel activeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} />
            </Suspense>}
            {route.id === 'archive' ? null : children}
          </div>
        </div>
      </div>
    </div>
  </article>;
}
