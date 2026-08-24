import { ChevronDown } from 'lucide-react';
import SuccessionTimeline from './SuccessionTimeline';
import TimelineIntelligencePanels from './TimelineIntelligencePanels';
import './TimelineWorkspace.css';

export default function TimelineWorkspace({
  requestedSearch = '',
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const applySearch = (value) => {
    const next = value.trim();
    onNavigate?.({ scope: 'events', ...(next ? { search: next } : {}) });
  };

  return (
    <section className="timeline-workspace timeline-command timeline-command--voyage-only" id="timeline-workspace">
      <SuccessionTimeline
        spoilerLimit={spoilerLimit}
        initialQuery={requestedSearch}
        onOpenLocation={onOpenLocation}
        onSearchCommit={applySearch}
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
