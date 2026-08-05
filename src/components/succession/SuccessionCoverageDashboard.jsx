import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Database, RotateCcw } from 'lucide-react';
import { domainCoverage } from '../../data/archiveCoverage';
import { clearProductEvents, summarizeProductEvents } from '../../lib/privacyAnalytics';

const statusLabel = (status) => ({ maintained: 'Maintained', partial: 'Partial', sparse: 'Sparse', review: 'Needs review' }[status] || status || 'Unknown');

export default function SuccessionCoverageDashboard() {
  const [analytics, setAnalytics] = useState(() => summarizeProductEvents());
  useEffect(() => {
    const refresh = () => setAnalytics(summarizeProductEvents());
    window.addEventListener('hunter:analytics-updated', refresh);
    return () => window.removeEventListener('hunter:analytics-updated', refresh);
  }, []);
  const coverage = useMemo(() => Object.entries(domainCoverage).map(([id, item]) => ({ id, ...item })), []);
  const reset = () => {
    clearProductEvents();
    setAnalytics({});
  };

  return <details className="succession-coverage-dashboard">
    <summary><Database size={16} aria-hidden="true" /> Coverage and local usage</summary>
    <div className="succession-coverage-dashboard__grid">
      <section>
        <header><Database size={18} aria-hidden="true" /><div><span>Coverage roadmap</span><h2>Indexed domains</h2></div></header>
        <div role="table" aria-label="Archive domain coverage">
          <div role="row" className="is-heading"><span role="columnheader">Domain</span><span role="columnheader">Through</span><span role="columnheader">Status</span></div>
          {coverage.map((item) => <div role="row" key={item.id}><strong role="rowheader">{item.label}</strong><span role="cell">Chapter {item.chapter}</span><span role="cell">{statusLabel(item.status)}</span></div>)}
        </div>
      </section>
      <section>
        <header><BarChart3 size={18} aria-hidden="true" /><div><span>Private analytics</span><h2>Stored only on this device</h2></div></header>
        {Object.keys(analytics).length ? <ul>{Object.entries(analytics).sort((a, b) => b[1] - a[1]).map(([name, count]) => <li key={name}><span>{name.replaceAll('-', ' ')}</span><strong>{count}</strong></li>)}</ul> : <p>No local product events recorded yet.</p>}
        <button type="button" onClick={reset}><RotateCcw size={15} aria-hidden="true" /> Reset local analytics</button>
        <small>No search text, names, notes, email addresses, or tokens are stored.</small>
      </section>
    </div>
  </details>;
}
