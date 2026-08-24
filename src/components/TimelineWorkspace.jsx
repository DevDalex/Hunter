import { ChevronDown } from 'lucide-react';
import SuccessionTimeline from './SuccessionTimeline';
import TimelineComparisonBuilder from './TimelineComparisonBuilder';
import TimelineContextNavigator from './TimelineContextNavigator';
import TimelineIntelligencePanels from './TimelineIntelligencePanels';
import './TimelineWorkspace.css';

export default function TimelineWorkspace({
  requestedSearch = '',
  requestedState = {},
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const applySearch = (value) => {
    const next = value.trim();
    const { search: _search, event: _event, ...preservedState } = requestedState;
    onNavigate?.({ ...preservedState, scope: 'events', ...(next ? { search: next } : {}) });
  };

  const navigateTimelineState = (params) => onNavigate?.({ scope: 'events', ...params });

  return (
    <section className="timeline-workspace timeline-command timeline-command--voyage-only" id="timeline-workspace">
      <TimelineContextNavigator
        requestedState={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      <TimelineComparisonBuilder
        requestedState={requestedState}
        spoilerLimit={spoilerLimit}
        onNavigate={navigateTimelineState}
      />

      <SuccessionTimeline
        spoilerLimit={spoilerLimit}
        initialQuery={requestedSearch}
        requestedState={requestedState}
        onOpenLocation={onOpenLocation}
        onSearchCommit={applySearch}
        onStateCommit={navigateTimelineState}
      />

      <details className="st-research-annex">
        <summary>
          <div><span>Research annex</span><strong>Princes, open questions, Nen developments, and active deadlines</strong></div>
          <ChevronDown size={20} aria-hidden="true" />
        </summary>
        <TimelineIntelligencePanels
          spoilerLimit={spoilerLimit}
          onOpenLocation={onOpenLocation}
          showChronology={false}
          defaultSectionsOpen={false}
          embedded
        />
      </details>
    </section>
  );
}
