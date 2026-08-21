import { ArrowRight, Info } from 'lucide-react';
import { getSuccessionArchiveRoute, successionArchiveRetiredTargets } from '../../data/succession/archiveRoutes';
import './SuccessionConsolidatedRouteNotice.css';

const labelize = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const legacyDestinations = Object.freeze({
  'royal-family': 'princes',
  cast: 'characters',
  'nen-and-beasts': 'guardian-spirit-beasts',
  records: 'chapters',
  chapters: 'reader',
  queens: 'princes',
});

export default function SuccessionConsolidatedRouteNotice({ from, currentRouteId, onNavigate }) {
  if (!from) return null;
  const destinationId = successionArchiveRetiredTargets[from] || legacyDestinations[from] || currentRouteId;
  const destination = getSuccessionArchiveRoute(destinationId);
  const sourceLabel = labelize(from);
  const sameRoute = destinationId === currentRouteId;

  return <aside className="succession-consolidated-route" role="note" aria-label="Consolidated route notice">
    <Info size={16} aria-hidden="true" />
    <div><span>Route consolidated</span><b>{sourceLabel} now lives in {destination.label}</b><p>This older destination is retained for bookmarks and incoming links. Canonical records were consolidated instead of duplicated, so you are seeing the maintained workspace and current chapter boundary.</p></div>
    {!sameRoute && <button type="button" onClick={() => onNavigate(destinationId, {})}>Open {destination.label} <ArrowRight size={12} aria-hidden="true" /></button>}
  </aside>;
}
