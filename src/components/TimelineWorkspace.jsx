import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import SuccessionTimeline from './SuccessionTimeline';
import TimelineCharacterSpatialFollower from './TimelineCharacterSpatialFollower';
import TimelineComparisonBuilder from './TimelineComparisonBuilder';
import TimelineContextNavigator from './TimelineContextNavigator';
import TimelineEventFocus from './TimelineEventFocus';
import TimelineIntelligencePanels from './TimelineIntelligencePanels';
import TimelineSemanticLandmarks from './TimelineSemanticLandmarks';
import TimelineSpatialIntelligence from './TimelineSpatialIntelligence';
import TimelineStoryField from './TimelineStoryField';
import TimelineStoryTopography from './TimelineStoryTopography';
import TimelineWorkspaceSwitcher, { resolveTimelineWorkspaceMode } from './TimelineWorkspaceSwitcher';
import './TimelineWorkspace.css';

export default function TimelineWorkspace({
  requestedSearch = '',
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const resolvedState = requestedState.view === 'ship'
    ? { ...requestedState, view: 'intelligence', intel: 'space' }
    : requestedState;
  const workspaceMode = resolveTimelineWorkspaceMode(resolvedState);
  const spatialActive = workspaceMode === 'space';
  const cinematicActive = workspaceMode === 'event';
  const storyActive = workspaceMode === 'story';
  const compareActive = workspaceMode === 'compare';
  const atlasActive = workspaceMode === 'atlas';
  const archiveActive = workspaceMode === 'archive';
  const atlasState = spatialActive
    ? { ...resolvedState, view: 'intelligence', intel: 'knowledge' }
    : resolvedState;
  const returnStateRef = useRef(null);
  const returnScrollRef = useRef(0);
  const previousEventRef = useRef('');
  const restorePendingRef = useRef(false);

  if (returnStateRef.current === null) {
    const { event: _event, ...initialReturnState } = resolvedState;
    returnStateRef.current = initialReturnState;
  }

  useEffect(() => {
    if (requestedState.view !== 'ship') return;
    const { view: _legacyView, mode: _legacyMode, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', view: 'intelligence', intel: 'space' });
  }, [onNavigate, requestedState]);

  useEffect(() => {
    const eventId = resolvedState.event || '';
    const previousEventId = previousEventRef.current;
    if (!eventId) {
      returnStateRef.current = resolvedState;
      if (restorePendingRef.current) {
        restorePendingRef.current = false;
        const top = returnScrollRef.current;
        globalThis.requestAnimationFrame?.(() => globalThis.requestAnimationFrame?.(() => globalThis.scrollTo?.({ top, left: 0, behavior: 'auto' })));
      }
    } else if (!previousEventId) {
      returnScrollRef.current = globalThis.scrollY || 0;
    }
    previousEventRef.current = eventId;
  }, [resolvedState]);

  const applySearch = (value) => {
    const next = value.trim();
    const { search: _search, event: _event, ...preservedState } = resolvedState;
    onNavigate?.({ ...preservedState, scope: 'events', ...(next ? { search: next } : {}) });
  };

  const navigateTimelineState = (params) => onNavigate?.({ scope: 'events', ...params });
  const commitTimelineState = (params) => onNavigate?.({
    scope: 'events',
    ...params,
    ...(resolvedState.mode ? { mode: resolvedState.mode } : {}),
    ...(resolvedState.compare ? { compare: resolvedState.compare } : {}),
    ...(resolvedState.spaceLocation ? { spaceLocation: resolvedState.spaceLocation } : {}),
    ...(resolvedState.spaceFrom ? { spaceFrom: resolvedState.spaceFrom } : {}),
    ...(resolvedState.spaceTo ? { spaceTo: resolvedState.spaceTo } : {}),
    ...(spatialActive ? { view: 'intelligence', intel: 'space' } : {}),
  });

  const closeEventFocus = () => {
    const { event: _event, ...fallbackState } = resolvedState;
    const restoreState = returnStateRef.current || fallbackState;
    restorePendingRef.current = true;
    onNavigate?.({ scope: 'events', ...restoreState });
  };

  const openLocationInSpatialIntelligence = (location) => {
    const name = typeof location === 'string'
      ? location
      : location?.name || location?.room || location?.location || '';
    const {
      event: _event,
      view: _view,
      intel: _intel,
      mode: _mode,
      spaceLocation: _spaceLocation,
      ...preserved
    } = resolvedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      view: 'intelligence',
      intel: 'space',
      chapter: Number(resolvedState.chapter) || spoilerLimit,
      ...(name ? { spaceLocation: name } : {}),
    });
  };

  return (
    <section className={`timeline-workspace timeline-command timeline-command--voyage-only timeline-workspace--mode-${workspaceMode}${spatialActive ? ' timeline-workspace--spatial-intelligence' : ''}${cinematicActive ? ' timeline-workspace--event-focus' : ''}`} id="timeline-workspace">
      <TimelineContextNavigator
        requestedState={resolvedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      {!cinematicActive && <TimelineWorkspaceSwitcher
        activeMode={workspaceMode}
        requestedState={resolvedState}
        onNavigate={navigateTimelineState}
      />}

      {cinematicActive ? <TimelineEventFocus
        eventId={resolvedState.event}
        requestedState={resolvedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
        onClose={closeEventFocus}
        onOpenLocation={openLocationInSpatialIntelligence}
      /> : <>
        <TimelineCharacterSpatialFollower
          requestedState={resolvedState}
          onNavigate={navigateTimelineState}
        />

        {storyActive && <>
          <TimelineStoryTopography
            requestedState={resolvedState}
            spoilerLimit={spoilerLimit}
            onNavigate={navigateTimelineState}
          />
          <TimelineSemanticLandmarks
            requestedState={resolvedState}
            spoilerLimit={spoilerLimit}
            onNavigate={navigateTimelineState}
          />
          <TimelineStoryField
            requestedState={resolvedState}
            spoilerLimit={spoilerLimit}
            onNavigate={navigateTimelineState}
          />
        </>}

        {compareActive && <TimelineComparisonBuilder
          requestedState={resolvedState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
        />}

        {(atlasActive || archiveActive) && <SuccessionTimeline
          spoilerLimit={spoilerLimit}
          initialQuery={requestedSearch}
          requestedState={atlasState}
          onOpenLocation={openLocationInSpatialIntelligence}
          onSearchCommit={applySearch}
          onStateCommit={commitTimelineState}
        />}

        {spatialActive && <TimelineSpatialIntelligence
          requestedState={resolvedState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
          onOpenLocation={onOpenLocation}
        />}

        {atlasActive && <details className="st-research-annex">
          <summary>
            <div><span>Research annex · extended intelligence</span><strong>Princes, open questions, Nen developments, and active deadlines</strong></div>
            <ChevronDown size={20} aria-hidden="true" />
          </summary>
          <TimelineIntelligencePanels
            spoilerLimit={spoilerLimit}
            onOpenLocation={openLocationInSpatialIntelligence}
            showChronology={false}
            defaultSectionsOpen={false}
            embedded
          />
        </details>}
      </>}
    </section>
  );
}