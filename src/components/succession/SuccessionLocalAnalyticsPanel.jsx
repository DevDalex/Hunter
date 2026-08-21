import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Pause, Play, RotateCcw } from 'lucide-react';
import { getSuccessionArchiveRoute } from '../../data/succession/archiveRoutes';
import {
  SUCCESSION_LOCAL_ANALYTICS_EVENT,
  readSuccessionLocalAnalytics,
  resetSuccessionLocalAnalytics,
  setSuccessionLocalAnalyticsEnabled,
} from '../../data/succession/localAnalytics';
import './SuccessionLocalAnalyticsPanel.css';

const formatWhen = (value) => {
  const parsed = Date.parse(String(value || ''));
  if (!Number.isFinite(parsed)) return 'No local sample yet';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(parsed));
};

export default function SuccessionLocalAnalyticsPanel() {
  const [analytics, setAnalytics] = useState(readSuccessionLocalAnalytics);

  useEffect(() => {
    const refresh = () => setAnalytics(readSuccessionLocalAnalytics());
    window.addEventListener(SUCCESSION_LOCAL_ANALYTICS_EVENT, refresh);
    return () => window.removeEventListener(SUCCESSION_LOCAL_ANALYTICS_EVENT, refresh);
  }, []);

  const rows = useMemo(() => Object.entries(analytics.routeViews)
    .map(([routeId, views]) => ({ routeId, views, route: getSuccessionArchiveRoute(routeId) }))
    .sort((left, right) => right.views - left.views || left.route.label.localeCompare(right.route.label)), [analytics.routeViews]);
  const max = Math.max(1, ...rows.map((row) => row.views));

  const toggleEnabled = () => setSuccessionLocalAnalyticsEnabled(!analytics.enabled);
  const reset = () => {
    resetSuccessionLocalAnalytics();
    setAnalytics(readSuccessionLocalAnalytics());
  };

  return <section className="succession-local-analytics" aria-labelledby="succession-local-analytics-title">
    <header>
      <div><span><BarChart3 size={14} aria-hidden="true" /> Local analytics · private to this browser</span><h2 id="succession-local-analytics-title">Usage counters without surveillance</h2><p>Only canonical route IDs, aggregate view counts, and coarse first/last timestamps are stored locally. Search text, entity IDs, notes, Reader pages, evidence selections, IP addresses, and page content are never recorded here or sent to a server.</p></div>
      <div><button type="button" onClick={toggleEnabled}>{analytics.enabled ? <Pause size={12} aria-hidden="true" /> : <Play size={12} aria-hidden="true" />}{analytics.enabled ? 'Pause counters' : 'Resume counters'}</button><button type="button" onClick={reset}><RotateCcw size={12} aria-hidden="true" /> Reset local analytics</button></div>
    </header>
    <dl className="succession-local-analytics__summary">
      <div><dt>Status</dt><dd>{analytics.enabled ? 'Active locally' : 'Paused'}</dd></div>
      <div><dt>Route views</dt><dd>{analytics.totalViews}</dd></div>
      <div><dt>Routes used</dt><dd>{rows.length}</dd></div>
      <div><dt>First sample</dt><dd>{formatWhen(analytics.firstSeenAt)}</dd></div>
      <div><dt>Last sample</dt><dd>{formatWhen(analytics.lastSeenAt)}</dd></div>
    </dl>
    <div className="succession-local-analytics__routes" role="list" aria-label="Local route usage counts">
      {rows.map((row) => <article role="listitem" key={row.routeId}><div><b>{row.route.label}</b><small>{row.routeId}</small></div><i aria-hidden="true"><span style={{ '--route-usage-width': `${Math.max(4, Math.round((row.views / max) * 100))}%` }} /></i><strong>{row.views}</strong></article>)}
      {!rows.length && <p>No route counters have been collected in this browser yet.</p>}
    </div>
    <footer>Reset removes the local analytics key only. Research Memory, bookmarks, onboarding, spoiler settings, and Reader progress are separate stores and are not touched.</footer>
  </section>;
}
