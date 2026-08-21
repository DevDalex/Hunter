import { ArrowRight, CircleAlert, GitBranch, Layers3, Network, Sparkles } from 'lucide-react';
import {
  getActiveCountdowns,
  getChapterStoryDossier,
  getEntityById,
} from '../../data/succession/successionData';
import './SuccessionStoryComprehensionPanel.css';

const FIRST_SUCCESSION_CHAPTER = 340;
const compactRange = (chapter) => Array.from({ length: Math.min(4, chapter - FIRST_SUCCESSION_CHAPTER + 1) }, (_, index) => chapter - (Math.min(4, chapter - FIRST_SUCCESSION_CHAPTER + 1) - index - 1));
const profile = (record) => record?.profile || record || {};
const labelize = (value) => String(value || 'context').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const eventTouchesChapter = (event, chapter) => {
  const range = event?.canonicalChapterRange || event?.chapterRange || {};
  const start = Number(range.start ?? chapter);
  const end = Number(range.end ?? start);
  return chapter >= start && chapter <= end;
};

function LaneMatrix({ chapter, onNavigate }) {
  const chapters = compactRange(chapter);
  const dossiers = chapters.map((number) => getChapterStoryDossier(number)).filter(Boolean);
  const lanes = [...new Map(dossiers.flatMap((dossier) => dossier.laneDossiers || []).map((lane) => [lane.profile.id, lane.profile])).values()];

  return <section className="succession-story-comprehension__section">
    <header><span><Network size={14} aria-hidden="true" /> Story-lane matrix</span><h3>Which plotlines are active across the latest chapter boundaries?</h3><p>Cells count maintained events touching that chapter and open threads attached to the lane. They are activity signals, not importance scores.</p></header>
    <div className="succession-story-comprehension__matrix-wrap">
      <table>
        <thead><tr><th>Chapter</th>{lanes.map((lane) => <th key={lane.id}>{lane.name}</th>)}</tr></thead>
        <tbody>{dossiers.map((dossier) => <tr key={dossier.chapter.number}>
          <th><button type="button" onClick={() => onNavigate('chapters', { chapter: dossier.chapter.number, depth: 'quick' })}>Ch. {dossier.chapter.number}</button></th>
          {lanes.map((lane) => {
            const laneDossier = (dossier.laneDossiers || []).find((record) => record.profile.id === lane.id);
            const events = (laneDossier?.events || []).filter((event) => eventTouchesChapter(event, dossier.chapter.number));
            const openThreads = (laneDossier?.threads || []).filter((thread) => thread.status === 'open');
            const active = events.length > 0 || openThreads.length > 0;
            return <td className={active ? 'is-active' : 'is-quiet'} key={lane.id}>
              {active ? <button type="button" onClick={() => onNavigate('story', { chapter: dossier.chapter.number, lane: lane.id, mode: 'workspace' })} aria-label={`${lane.name} at Chapter ${dossier.chapter.number}: ${events.length} events, ${openThreads.length} open threads`}>
                <strong>{events.length}</strong><small>events</small><span>{openThreads.length} open</span>
              </button> : <span aria-label="No maintained activity at this chapter">—</span>}
            </td>;
          })}
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}

function ChapterBriefing({ chapter, dossier, onNavigate }) {
  const facts = [
    dossier?.research?.focus,
    ...(dossier?.changes || []).slice(0, 3),
  ].filter(Boolean).slice(0, 4);

  return <section className="succession-story-comprehension__section is-briefing">
    <header><span><Sparkles size={14} aria-hidden="true" /> Chapter intelligence card</span><h3>Chapter {chapter}: what matters before the full dossier</h3></header>
    <div className="succession-story-comprehension__briefing-grid">
      <div className="succession-story-comprehension__signals">
        <h4>Why this boundary matters</h4>
        <ol>{facts.map((fact, index) => <li key={`${index}:${fact}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{fact}</p></li>)}</ol>
      </div>
      <dl>
        <div><dt>People</dt><dd>{dossier?.appearances?.length || 0}</dd></div>
        <div><dt>Events</dt><dd>{dossier?.events?.length || 0}</dd></div>
        <div><dt>Locations</dt><dd>{dossier?.locations?.length || 0}</dd></div>
        <div><dt>Nen</dt><dd>{dossier?.abilities?.length || 0}</dd></div>
        <div><dt>Open threads</dt><dd>{dossier?.openThreads?.length || 0}</dd></div>
        <div><dt>Resolved here</dt><dd>{dossier?.resolvedThreads?.length || 0}</dd></div>
      </dl>
    </div>
    <footer><button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'standard' })}>Full chapter dossier <ArrowRight size={12} /></button><button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'evidence' })}>Evidence view <ArrowRight size={12} /></button></footer>
  </section>;
}

function CausalBoard({ dossier, onNavigate }) {
  const links = [...(dossier?.incomingCausalLinks || []), ...(dossier?.outgoingCausalLinks || [])];
  const unique = [...new Map(links.map((link) => [link.id, link])).values()];
  const visible = unique.slice(0, 10);
  return <section className="succession-story-comprehension__section">
    <header><span><GitBranch size={14} aria-hidden="true" /> Cause → event → consequence</span><h3>Causal structure around Chapter {dossier?.chapter?.number}</h3><p>Direct cause, enabling condition, contextual support, and sequence-only links remain visually distinct instead of being flattened into chronology.</p></header>
    <ol className="succession-story-comprehension__causal">{visible.map((link) => {
      const source = getEntityById(link.sourceEventId);
      const target = getEntityById(link.targetEventId);
      return <li key={link.id} className={`is-${link.causalityClass || link.causalType || 'contextual'}`}>
        <button type="button" onClick={() => source && onNavigate('events', { entity: source.id })}><strong>{source?.name || link.sourceEventId}</strong><small>Ch. {source?.canonicalChapterRange?.start || source?.chapterRange?.start || '—'}</small></button>
        <span><b>{labelize(link.causalityClass || link.causalType)}</b><i aria-hidden="true">→</i><small>{labelize(link.evidenceState)}</small></span>
        <button type="button" onClick={() => target && onNavigate('events', { entity: target.id })}><strong>{target?.name || link.targetEventId}</strong><small>Ch. {target?.canonicalChapterRange?.start || target?.chapterRange?.start || '—'}</small></button>
      </li>;
    })}</ol>
    {!visible.length && <p className="succession-story-comprehension__empty">No maintained causal link touches this chapter boundary.</p>}
    {unique.length > visible.length && <small className="succession-story-comprehension__shown">Showing {visible.length} of {unique.length} causal links. Open Events for the complete graph.</small>}
    {!!unique.length && <footer><button type="button" onClick={() => onNavigate('events', { chapter: dossier.chapter.number })}>Open event graph <ArrowRight size={12} /></button></footer>}
  </section>;
}

function PressureBoard({ chapter, dossier, onNavigate }) {
  const countdowns = getActiveCountdowns(chapter);
  const countdownIds = new Set(countdowns?.threadIds || []);
  const rows = (dossier?.openThreads || []).map((thread) => ({ dossier: thread, profile: profile(thread), timed: countdownIds.has(profile(thread).id) }));
  const sorted = [...rows].sort((a, b) => Number(b.timed) - Number(a.timed) || Number(a.profile.chapterRange?.start || 0) - Number(b.profile.chapterRange?.start || 0));
  const visible = sorted.slice(0, 10);
  return <section className="succession-story-comprehension__section">
    <header><span><CircleAlert size={14} aria-hidden="true" /> Open-thread pressure board</span><h3>What is still unresolved at Chapter {chapter}?</h3><p>Time-bounded signals are surfaced first, while all other open threads remain visible as unresolved rather than being converted into predictions.</p></header>
    <div className="succession-story-comprehension__pressure-grid">{visible.map(({ profile: row, timed }) => <article className={timed ? 'is-timed' : ''} key={row.id}>
      <span>{timed ? 'Time-bound signal' : labelize(row.category || 'open thread')}</span>
      <h4>{row.name}</h4>
      <p>{row.question || row.evidenceState || 'Unresolved at the selected chapter boundary.'}</p>
      <small>Opened Ch. {row.chapterRange?.start || '—'}</small>
    </article>)}</div>
    {!visible.length && <p className="succession-story-comprehension__empty">No open Story Intelligence thread is published at this boundary.</p>}
    {rows.length > visible.length && <small className="succession-story-comprehension__shown">Showing {visible.length} of {rows.length} open threads.</small>}
    <footer><button type="button" onClick={() => onNavigate('story', { chapter, mode: 'workspace' })}>Open Story Intelligence <ArrowRight size={12} /></button><button type="button" onClick={() => onNavigate('research', { mode: 'cases' })}>Mystery cases <Layers3 size={12} /></button></footer>
  </section>;
}

export default function SuccessionStoryComprehensionPanel({ chapter = 417, onNavigate }) {
  const dossier = getChapterStoryDossier(chapter);
  if (!dossier) return null;
  return <section className="succession-story-comprehension" aria-labelledby="succession-story-comprehension-title">
    <header className="succession-story-comprehension__hero">
      <span>Visual story comprehension</span>
      <h2 id="succession-story-comprehension-title">See the arc before opening the full record graph</h2>
      <p>Chapter briefing, lane activity, causal structure, and unresolved pressure are derived from the same canonical Story Intelligence data.</p>
    </header>
    <div className="succession-story-comprehension__layout">
      <ChapterBriefing chapter={chapter} dossier={dossier} onNavigate={onNavigate} />
      <LaneMatrix chapter={chapter} onNavigate={onNavigate} />
      <CausalBoard dossier={dossier} onNavigate={onNavigate} />
      <PressureBoard chapter={chapter} dossier={dossier} onNavigate={onNavigate} />
    </div>
  </section>;
}
