import TimelineArchiveExplorer from './TimelineArchiveExplorer';
import './TimelineWorkspace.css';
import './TimelinePrimaryAtlas.css';

export default function TimelineWorkspace({
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
}) {
  const navigateTimelineState = (params) => onNavigate?.({ scope: 'events', ...params });

  return (
    <section className="timeline-workspace timeline-workspace--archive-explorer" id="timeline-workspace">
      <TimelineArchiveExplorer
        requestedState={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />
    </section>
  );
}
