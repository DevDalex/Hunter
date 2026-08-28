import { useEffect } from 'react';
import TimelineArchiveExplorer from './TimelineArchiveExplorer';
import TimelineCharacterSpatialFollower from './TimelineCharacterSpatialFollower';
import TimelineComparisonBuilder from './TimelineComparisonBuilder';
import TimelineContextNavigator from './TimelineContextNavigator';
import TimelineEventFocus from './TimelineEventFocus';
import TimelineIntelligencePanels from './TimelineIntelligencePanels';
import TimelineResearchWorkstation from './TimelineResearchWorkstation';
import TimelineSemanticLandmarks from './TimelineSemanticLandmarks';
import TimelineSpatialIntelligence from './TimelineSpatialIntelligence';
import TimelineStoryField from './TimelineStoryField';
import TimelineStoryTopography from './TimelineStoryTopography';
import TimelineWorkspaceSwitcher, { resolveTimelineWorkspaceMode } from './TimelineWorkspaceSwitcher';
import { SuccessionExplorerProvider } from './succession/SuccessionExplorerState';
import {
  NenInteractionGraphInstrument,
  TimelineCausalityGraphInstrument,
} from './succession/SuccessionExplorerGraphInstruments';
import './TimelineWorkspace.css';
import './TimelinePrimaryAtlas.css';
import './TimelineCompleteSystem.css';

export default function TimelineWorkspace({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const resolvedState = requestedState.view === 'ship'
    ? { ...requestedState, mode: 'space', view: 'intelligence', intel: 'space' }
    : requestedState;
  const workspaceMode = resolveTimelineWorkspaceMode(resolvedState);
  const modeState = { ...resolvedState, mode: workspaceMode };
  const storyActive = workspaceMode === 'story';
  const compareActive = workspaceMode === 'compare';
  const atlasActive = workspaceMode === 'atlas';
  const archiveActive = workspaceMode === 'archive';
  const spatialActive = workspaceMode === 'space';
  const dossierOpen = Boolean(modeState.event && modeState.focus === 'dossier');
  const contextChapter = Number(modeState.chapter) || spoilerLimit;

  useEffect(() => {
    if (requestedState.view !== 'ship') return;
    const { view: _legacyView, mode: _legacyMode, ...preserved } = requestedState;
    onNavigate?.({ ...preserved, scope: 'events', mode: 'space', view: 'intelligence', intel: 'space' });
  }, [onNavigate, requestedState]);

  const navigateTimelineState = (params) => onNavigate?.({ scope: 'events', ...params });
  const navigateWithDossier = (params) => onNavigate?.({
    scope: 'events',
    ...params,
    ...(params?.event ? { focus: 'dossier' } : {}),
  });

  const closeDossier = () => {
    const { focus: _focus, ...preserved } = modeState;
    onNavigate?.({ scope: 'events', ...preserved });
  };

  const openLocationInSpatialIntelligence = (location) => {
    const name = typeof location === 'string'
      ? location
      : location?.name || location?.room || location?.location || '';
    const {
      event: _event,
      focus: _focus,
      view: _view,
      intel: _intel,
      mode: _mode,
      spaceLocation: _spaceLocation,
      ...preserved
    } = modeState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      mode: 'space',
      view: 'intelligence',
      intel: 'space',
      chapter: Number(modeState.chapter) || spoilerLimit,
      ...(name ? { spaceLocation: name } : {}),
    });
  };

  const openTimelineLocation = onOpenLocation || openLocationInSpatialIntelligence;

  return (
    <section
      className={`timeline-workspace timeline-workspace--complete-system timeline-workspace--mode-${workspaceMode}${archiveActive ? ' timeline-workspace--archive-explorer' : ''}`}
      id="timeline-workspace"
    >
      <TimelineWorkspaceSwitcher
        activeMode={workspaceMode}
        requestedState={modeState}
        onNavigate={navigateTimelineState}
      />

      <TimelineResearchWorkstation
        requestedState={modeState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      {!archiveActive && <TimelineContextNavigator
        requestedState={modeState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />}

      <TimelineCharacterSpatialFollower
        requestedState={modeState}
        onNavigate={navigateTimelineState}
      />

      {archiveActive && <TimelineArchiveExplorer
        requestedState={modeState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />}

      {storyActive && <div className="timeline-system-mode timeline-system-mode--story">
        <TimelineStoryTopography
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
        />
        <TimelineSemanticLandmarks
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateWithDossier}
        />
        <TimelineStoryField
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateWithDossier}
        />
      </div>}

      {compareActive && <div className="timeline-system-mode timeline-system-mode--compare">
        <TimelineComparisonBuilder
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateWithDossier}
        />
      </div>}

      {atlasActive && <div className="timeline-system-mode timeline-system-mode--research">
        <section className="timeline-system-research-graphs" aria-label="Timeline causal and Nen graphs">
          <header>
            <span>RELATIONSHIP INTELLIGENCE</span>
            <h2>See consequence, not just chronology.</h2>
            <p>Canonical causal links and maintained Nen interaction contexts sit beside the textual research ledger instead of being flattened into event prose.</p>
          </header>
          <SuccessionExplorerProvider spoilerLimit={spoilerLimit}>
            <TimelineCausalityGraphInstrument chapter={contextChapter} />
            <NenInteractionGraphInstrument chapter={contextChapter} />
          </SuccessionExplorerProvider>
        </section>
        <TimelineIntelligencePanels
          spoilerLimit={spoilerLimit}
          onOpenLocation={openLocationInSpatialIntelligence}
          showChronology
          defaultSectionsOpen={false}
        />
      </div>}

      {spatialActive && <div className="timeline-system-mode timeline-system-mode--space">
        <TimelineSpatialIntelligence
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
          onOpenLocation={openTimelineLocation}
        />
      </div>}

      {dossierOpen && <div className="timeline-system-event-drawer" role="dialog" aria-modal="true" aria-label="Timeline event dossier">
        <TimelineEventFocus
          eventId={modeState.event}
          requestedState={modeState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
          onClose={closeDossier}
          onOpenLocation={openLocationInSpatialIntelligence}
        />
      </div>}
    </section>
  );
}
