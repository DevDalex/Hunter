import {
  Activity,
  ArrowRight,
  CircleAlert,
  Clock3,
  Eye,
  GitCompareArrows,
  MapPinned,
  Network,
  Sparkles,
} from 'lucide-react';
import {
  getActiveCountdowns,
  getChapterStoryDossier,
  getChapterWhatChanged,
  getKnowledgeWarfareMatrix,
  getThreatAssassinationMatrix,
} from '../../data/succession/successionData';
import {
  getFactionRecentChangeSummaries,
  getSpatialEvidenceIntelligence,
} from '../../data/succession/contentDepthFinishingSelectors';
import './SuccessionNowDashboard.css';

const labelize = (value) => String(value || 'unknown')
  .replaceAll('-', ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const threadProfile = (record) => record?.profile || record || {};

function Metric({ icon: Icon, label, value, note }) {
  return <div className="succession-now__metric">
    <Icon size={16} aria-hidden="true" />
    <span>{label}</span>
    <strong>{value}</strong>
    {note && <small>{note}</small>}
  </div>;
}

function Section({ icon: Icon, eyebrow, title, action, children }) {
  return <section className="succession-now__section">
    <header>
      <div><span><Icon size={14} aria-hidden="true" /> {eyebrow}</span><h3>{title}</h3></div>
      {action}
    </header>
    {children}
  </section>;
}

export default function SuccessionNowDashboard({ chapter = 417, onNavigate }) {
  const change = getChapterWhatChanged(chapter);
  const dossier = getChapterStoryDossier(chapter);
  const countdowns = getActiveCountdowns(chapter);
  const threats = getThreatAssassinationMatrix(chapter);
  const knowledge = getKnowledgeWarfareMatrix(chapter);
  const factions = getFactionRecentChangeSummaries(chapter).filter((record) => record.changed);
  const spatial = getSpatialEvidenceIntelligence(chapter);

  const openThreads = (dossier?.openThreads || []).map(threadProfile).filter(Boolean);
  const changedRecords = change?.records || [];
  const changedCount = Number(change?.summary?.added || 0)
    + Number(change?.summary?.changed || 0)
    + Number(change?.summary?.removed || 0);
  const countdownCount = (countdowns?.threadIds?.length || 0) + (countdowns?.mysteryCaseIds?.length || 0);
  const visibleChanges = changedRecords.slice(0, 6);
  const visibleThreads = openThreads.slice(0, 5);
  const visibleFactions = factions.slice(0, 5);
  const visibleHotspots = (spatial?.hotspots || []).slice(0, 5);

  return <section className="succession-now" aria-labelledby="succession-now-title">
    <header className="succession-now__hero">
      <div>
        <span><Sparkles size={15} aria-hidden="true" /> Current-state briefing</span>
        <h2 id="succession-now-title">Succession Contest · Chapter {chapter} now</h2>
        <p>Start with the state transition, active pressure, unresolved threads, and locations carrying the most documented operational load. Open the deeper workspaces only when you need the underlying graph.</p>
      </div>
      <div className="succession-now__hero-actions">
        <button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'quick' })}>60-second chapter <ArrowRight size={13} /></button>
        <button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'deep' })}>Deep analysis <Eye size={13} /></button>
      </div>
    </header>

    <div className="succession-now__metrics" aria-label={`Chapter ${chapter} briefing metrics`}>
      <Metric icon={GitCompareArrows} label="Changed records" value={changedCount} note={`Ch. ${change?.previousChapter ?? Math.max(340, chapter - 1)} → ${chapter}`} />
      <Metric icon={Clock3} label="Countdown signals" value={countdownCount} note="threads + open cases" />
      <Metric icon={CircleAlert} label="Threat signals" value={threats.length} note="documented targeting / pressure" />
      <Metric icon={Network} label="Open threads" value={openThreads.length} note="story intelligence" />
      <Metric icon={Eye} label="Knowledge claims" value={knowledge.length} note="reader ≠ character knowledge" />
      <Metric icon={MapPinned} label="Changed locations" value={spatial?.summary?.changedLocations || 0} note="spatial state delta" />
    </div>

    <div className="succession-now__grid">
      <Section
        icon={GitCompareArrows}
        eyebrow="What changed?"
        title={`Chapter ${change?.previousChapter ?? Math.max(340, chapter - 1)} → ${chapter}`}
        action={<button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'deep' })}>Full delta <ArrowRight size={12} /></button>}
      >
        <ol className="succession-now__ledger">
          {visibleChanges.map((record) => <li key={record.entity?.id || record.id}>
            <span className={`is-${record.status || 'changed'}`}>{labelize(record.status || 'changed')}</span>
            <div><strong>{record.entity?.name || record.name || record.id}</strong><small>{labelize(record.entity?.entityType || record.entityType || 'record')}</small></div>
          </li>)}
        </ol>
        {!visibleChanges.length && <p className="succession-now__empty">No material archive-state delta is published for this boundary.</p>}
        {changedRecords.length > visibleChanges.length && <small className="succession-now__shown">Showing {visibleChanges.length} of {changedRecords.length} changed records.</small>}
      </Section>

      <Section
        icon={Network}
        eyebrow="Open pressure"
        title="Unresolved story threads"
        action={<button type="button" onClick={() => onNavigate('story', { chapter, mode: 'workspace' })}>Story desk <ArrowRight size={12} /></button>}
      >
        <ol className="succession-now__threads">
          {visibleThreads.map((record) => <li key={record.id || record.name}>
            <strong>{record.name || record.title || 'Unresolved thread'}</strong>
            <p>{record.question || record.evidenceState || 'Open at the selected chapter boundary.'}</p>
          </li>)}
        </ol>
        {!visibleThreads.length && <p className="succession-now__empty">No open Story Intelligence thread is published at this boundary.</p>}
        {openThreads.length > visibleThreads.length && <small className="succession-now__shown">Showing {visibleThreads.length} of {openThreads.length} open threads.</small>}
      </Section>

      <Section
        icon={Activity}
        eyebrow="Faction movement"
        title="Who actually changed?"
        action={<button type="button" onClick={() => onNavigate('organizations', { chapter })}>Organizations <ArrowRight size={12} /></button>}
      >
        <ol className="succession-now__factions">
          {visibleFactions.map((record) => <li key={record.organization.id}>
            <strong>{record.organization.name}</strong>
            <small>members {record.changes.members >= 0 ? '+' : ''}{record.changes.members} · abilities {record.changes.abilities >= 0 ? '+' : ''}{record.changes.abilities} · events {record.changes.events >= 0 ? '+' : ''}{record.changes.events}</small>
          </li>)}
        </ol>
        {!visibleFactions.length && <p className="succession-now__empty">No faction resource delta is recorded from the previous maintained chapter.</p>}
        {factions.length > visibleFactions.length && <small className="succession-now__shown">Showing {visibleFactions.length} of {factions.length} changed factions.</small>}
      </Section>

      <Section
        icon={MapPinned}
        eyebrow="Where pressure concentrates"
        title="Operational hotspots"
        action={<button type="button" onClick={() => onNavigate('black-whale', { chapter })}>Ship atlas <ArrowRight size={12} /></button>}
      >
        <ol className="succession-now__hotspots">
          {visibleHotspots.map((record) => <li key={record.location.id}>
            <div><strong>{record.location.name}</strong><small>{labelize(record.system)}</small></div>
            <span>{record.operationalLoad} load · {record.provenanceCoverage}% evidenced</span>
          </li>)}
        </ol>
        {!visibleHotspots.length && <p className="succession-now__empty">No operational hotspot is published for this boundary.</p>}
        {(spatial?.hotspots?.length || 0) > visibleHotspots.length && <small className="succession-now__shown">Showing {visibleHotspots.length} of {spatial.hotspots.length} evidence-led hotspots.</small>}
      </Section>
    </div>
  </section>;
}
