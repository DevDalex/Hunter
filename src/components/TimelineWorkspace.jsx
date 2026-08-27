import { useRef } from 'react';
import TimelineContextNavigator from './TimelineContextNavigator';
import TimelineEventFocus from './TimelineEventFocus';
import TimelineStoryField from './TimelineStoryField';
import './TimelineWorkspace.css';
import './TimelinePrimaryAtlas.css';

export default function TimelineWorkspace({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const returnStateRef = useRef(null);

  if (returnStateRef.current === null) {
    const { event: _event, ...initialReturnState } = requestedState;
    returnStateRef.current = initialReturnState;
  }

  const navigateTimelineState = (params) => onNavigate?.({ scope: 'events', ...params });

  const closeEventFocus = () => {
    const { event: _event, ...fallbackState } = requestedState;
    onNavigate?.({ scope: 'events', ...(returnStateRef.current || fallbackState) });
  };

  const openLocationOnMap = (location) => {
    const name = typeof location === 'string'
      ? location
      : location?.name || location?.room || location?.location || '';
    const { event: _event, ...preserved } = requestedState;
    onNavigate?.({
      ...preserved,
      scope: 'events',
      lens: 'locations',
      chapter: Number(requestedState.chapter) || spoilerLimit,
      ...(name ? { mapLane: `location:${String(name).trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-')}` } : {}),
    });
  };

  return (
    <section className="timeline-workspace timeline-workspace--map-only" id="timeline-workspace">
      <TimelineContextNavigator
        requestedState={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      <TimelineStoryField
        requestedState={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      {requestedState.event && <div className="timeline-map-event-drawer" role="dialog" aria-modal="true" aria-label="Timeline event dossier">
        <TimelineEventFocus
          eventId={requestedState.event}
          requestedState={requestedState}
          spoilerLimit={spoilerLimit}
          onNavigate={navigateTimelineState}
          onClose={closeEventFocus}
          onOpenLocation={openLocationOnMap}
        />
      </div>}
    </section>
  );
}
