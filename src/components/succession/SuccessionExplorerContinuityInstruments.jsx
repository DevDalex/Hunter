import { useMemo } from 'react';
import {
  ArrowRight,
  SearchCheck,
} from 'lucide-react';
import {
  getEntityById,
  searchArchiveProduct,
} from '../../data/succession/successionData';
import { useSuccessionExplorer } from './SuccessionExplorerState';
import './SuccessionExplorerContinuityInstruments.css';

const safe = (factory, fallback) => {
  try { return factory(); } catch { return fallback; }
};
const label = (entity) => entity?.name || entity?.title || entity?.term || entity?.label || entity?.id || 'Unknown';
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const TYPE_RULES = Object.freeze([
  ['character', /\b(?:character|person|people|prince|queen|guard|hunter|who)\b/i],
  ['ability', /\b(?:nen|ability|abilities|curse|technique|power)\b/i],
  ['location', /\b(?:location|room|tier|ship|where|place)\b/i],
  ['organization', /\b(?:organization|faction|mafia|army|bureau|group)\b/i],
  ['event', /\b(?:event|happened|happen|incident|death|attack)\b/i],
  ['relationship', /\b(?:relationship|ally|allies|enemy|hostile|connection|connected)\b/i],
  ['assignment', /\b(?:assignment|guarding|protecting|protects|reports to|surveillance|target)\b/i],
]);

const ROUTE_RULES = Object.freeze([
  ['research', /\b(?:evidence|source|claim|prove|certainty|contradiction|research)\b/i],
  ['relationships', /\b(?:relationship|ally|enemy|connection|connected|path between)\b/i],
  ['nen', /\b(?:nen|ability|abilities|curse|technique|power)\b/i],
  ['black-whale', /\b(?:black whale|ship|tier|room|where|location|place)\b/i],
  ['timeline', /\b(?:timeline|chronology|when|happened|before|after|during)\b/i],
  ['characters', /\b(?:character|person|people|who|prince|queen|guard|hunter)\b/i],
  ['chapters', /\b(?:chapter|what changed|difference between)\b/i],
]);

export function parseExplorerQuery(input, fallbackChapter) {
  const raw = String(input || '').trim();
  const chapterMatch = raw.match(/\b(?:chapter|ch\.?|at|through)\s*[:#]?\s*(3\d{2}|4\d{2})\b/i);
  const explicitType = raw.match(/\btype\s*:\s*([a-z-]+)/i)?.[1] || null;
  const inferredType = explicitType || TYPE_RULES.find(([, pattern]) => pattern.test(raw))?.[0] || 'all';
  const targetRoute = ROUTE_RULES.find(([, pattern]) => pattern.test(raw))?.[0] || 'search';
  const intent = /\bwhat changed\b|\bdiff(?:erence)?\b/i.test(raw)
    ? 'diff'
    : /\bwho knows\b|\bknowledge\b/i.test(raw)
      ? 'knowledge'
      : /\bcompare\b|\bversus\b|\bvs\.?\b/i.test(raw)
        ? 'compare'
        : /\bpath between\b|\bconnected to\b/i.test(raw)
          ? 'path'
          : /\bwhen\b|\btimeline\b|\bchronology\b/i.test(raw)
            ? 'timeline'
            : 'find';
  const chapter = chapterMatch ? Number(chapterMatch[1]) : fallbackChapter;
  const nenOnly = /\bnen(?:-only| only)?\b/i.test(raw) || inferredType === 'ability';
  const activeOnly = /\bactive(?: only)?\b/i.test(raw) || /\bcurrent(?:ly)?\b/i.test(raw);
  const cleaned = raw
    .replace(/\b(?:chapter|ch\.?|at|through)\s*[:#]?\s*(3\d{2}|4\d{2})\b/ig, ' ')
    .replace(/\btype\s*:\s*[a-z-]+\b/ig, ' ')
    .replace(/\b(?:active only|active|currently|nen only)\b/ig, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return Object.freeze({ raw, chapter, entityType: inferredType, targetRoute, intent, nenOnly, activeOnly, query: cleaned || raw });
}

export function StructuredQueryInstrument({ routeId, spoilerLimit, onNavigate }) {
  const explorer = useSuccessionExplorer();
  const raw = explorer.filters.query || '';
  const parsed = useMemo(() => parseExplorerQuery(raw, explorer.chapter), [explorer.chapter, raw]);
  const results = useMemo(() => raw ? safe(() => searchArchiveProduct(parsed.query, { chapter: Math.min(spoilerLimit, parsed.chapter), limit: 8 }), []) : [], [parsed.chapter, parsed.query, raw, spoilerLimit]);
  if (!raw) return null;
  const apply = () => {
    const chapter = Math.min(spoilerLimit, Math.max(340, parsed.chapter));
    explorer.setChapter(chapter);
    explorer.setFilters((current) => ({ ...current, query: parsed.query, entityType: parsed.entityType, nenOnly: parsed.nenOnly, activeOnly: parsed.activeOnly }));
    if (parsed.intent === 'knowledge') explorer.setRouteView('research', 'claims');
    if (parsed.intent === 'path') explorer.setRouteView('relationships', 'path');
    if (parsed.intent === 'timeline') explorer.setRouteView('timeline', 'atlas');
    if (parsed.intent === 'compare') explorer.setRouteView(parsed.targetRoute, 'compare');
    const target = parsed.intent === 'diff' ? 'research' : parsed.targetRoute;
    onNavigate?.(target, explorer.buildDeepLinkParams(target, {
      chapter,
      ...(parsed.query ? { search: parsed.query } : {}),
      ...(parsed.intent === 'diff' ? { mode: 'diff', from: Math.max(340, chapter - 1), to: chapter } : {}),
    }));
  };
  return <section className="succession-explorer-query-interpreter">
    <header><div><span>Deterministic query interpreter</span><h3><SearchCheck size={17} /> Read the request as archive controls</h3><p>This parser turns explicit words into route, chapter, domain and analysis controls. It does not invent facts or silently rewrite the query.</p></div><button type="button" onClick={apply}>Apply interpretation <ArrowRight size={13} /></button></header>
    <dl>
      <div><dt>Intent</dt><dd>{labelize(parsed.intent)}</dd></div>
      <div><dt>Route</dt><dd>{labelize(parsed.targetRoute)}</dd></div>
      <div><dt>Chapter</dt><dd>{parsed.chapter}</dd></div>
      <div><dt>Domain</dt><dd>{labelize(parsed.entityType)}</dd></div>
      <div><dt>Nen filter</dt><dd>{parsed.nenOnly ? 'On' : 'Off'}</dd></div>
      <div><dt>Active only</dt><dd>{parsed.activeOnly ? 'On' : 'Off'}</dd></div>
    </dl>
    <div className="succession-explorer-query-interpreter__preview"><span>Canonical preview</span><div>{results.map((result, index) => {
      const entity = result.entity || getEntityById(result.entityId || result.id);
      return <button type="button" onClick={() => entity && explorer.selectEntity(entity.id, { routeId, chapter: parsed.chapter, label: label(entity) })} key={entity?.id || result.id || index}><small>{labelize(result.domain || entity?.entityType || result.resultType)}</small><strong>{label(entity || result)}</strong><span>{result.matchReason || result.reason || ''}</span></button>;
    })}</div></div>
  </section>;
}
