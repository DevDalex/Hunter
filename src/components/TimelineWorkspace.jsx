import { useEffect, useState } from 'react';
import { CalendarDays, Search, ShieldCheck } from 'lucide-react';
import SuccessionTimeline from './SuccessionTimeline';
import './TimelineWorkspace.css';

export default function TimelineWorkspace({
  requestedSearch = '',
  spoilerLimit = Number.MAX_SAFE_INTEGER,
  onNavigate,
  onOpenLocation,
}) {
  const [query, setQuery] = useState(requestedSearch);

  useEffect(() => setQuery(requestedSearch), [requestedSearch]);

  const applySearch = (value) => {
    const next = value.trim();
    onNavigate?.({ scope: 'events', ...(next ? { search: next } : {}) });
  };

  return (
    <section className="timeline-workspace timeline-command timeline-command--voyage-only" id="timeline-workspace">
      <header className="timeline-workspace__hero timeline-command__hero timeline-command-voyage__hero">
        <div className="timeline-command__hero-copy">
          <span><CalendarDays size={15} aria-hidden="true" /> Succession voyage chronology</span>
          <h2>The voyage as a chapter-bounded operational ledger.</h2>
          <p>Follow the Succession Contest by chapter, voyage day, active thread, location, movement, and evidence confidence without opening the retired global chronology.</p>
        </div>
        <div className="timeline-command__signal" aria-label="Voyage timeline boundary">
          <span>Reading boundary</span>
          <strong>Ch. {spoilerLimit}</strong>
          <p>Uncertain sequencing remains visibly uncertain.</p>
          <ShieldCheck size={22} aria-hidden="true" />
        </div>
      </header>

      <div className="timeline-workspace__controls timeline-command-voyage__controls">
        <label>
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Search the Succession voyage timeline</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onBlur={() => applySearch(query)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') applySearch(query);
            }}
            placeholder="Event, chapter, place, person…"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                applySearch('');
              }}
            >
              Clear
            </button>
          )}
        </label>
      </div>

      <div className="timeline-workspace__events">
        <SuccessionTimeline
          spoilerLimit={spoilerLimit}
          initialQuery={query}
          onOpenLocation={onOpenLocation}
        />
      </div>
    </section>
  );
}
