import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, Film, Filter, GitBranch, Search, ShieldCheck, Trophy } from 'lucide-react';
import {
  completionArchiveCollections,
  completionStatusLabels,
  greedIslandCompletionStats,
  postClearRouteRecords,
  releaseReviewChecks,
  resolveGreedIslandCompletionSource,
} from '../../data/greed-island/completionArchive.js';
import { enrichedSpecifiedCardById } from '../../data/greed-island/specifiedCardsEnriched.js';
import { spellCardsById } from '../../data/greed-island/cardLibraries.js';
import './GreedIslandCompletionArchive.css';

const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const icons = { quiz: BookOpen, rewards: Trophy, route: GitBranch, adaptation: Film, release: ShieldCheck };

function CompletionBadge({ children, tone = 'neutral' }) {
  return <span className={`gi-completion-badge is-${tone}`}>{children}</span>;
}

function SourceLink({ sourceId, children = 'Open completion source' }) {
  const source = resolveGreedIslandCompletionSource(sourceId);
  return <a href={source.href} target="_blank" rel="noreferrer noopener">{children} <ExternalLink size={12} /></a>;
}

function cardLabel(id) {
  if (enrichedSpecifiedCardById.has(id)) return `${id} · ${enrichedSpecifiedCardById.get(id).name}`;
  if (spellCardsById.has(id)) return `${id} · ${spellCardsById.get(id).name}`;
  return id;
}

function CompletionRecord({ record }) {
  const source = resolveGreedIslandCompletionSource(record.sourceId);
  return <article className="gi-completion-record" aria-live="polite">
    <header>
      <span>{completionStatusLabels[record.status] || titleCase(record.status)} · {source.label}</span>
      <h3>{record.title}</h3>
      <p>{record.summary}</p>
    </header>
    {!!record.cards.length && <div className="gi-completion-cards" aria-label={`${record.title} linked cards`}>
      {record.cards.map((card) => <CompletionBadge key={card} tone="card">{cardLabel(card)}</CompletionBadge>)}
    </div>}
    {!!record.steps.length && <ol>{record.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
    {!!record.checks.length && <ul className="gi-completion-checks">{record.checks.map((check) => <li key={check}><CheckCircle2 size={14} /> {check}</li>)}</ul>}
    <div className="gi-completion-tags">
      {record.tags.map((tag) => <CompletionBadge key={tag}>{titleCase(tag)}</CompletionBadge>)}
    </div>
    <SourceLink sourceId={record.sourceId} />
  </article>;
}

function QuizBoundary({ records }) {
  const [selectedId, setSelectedId] = useState('gon-87-score');
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-completion-quiz" aria-labelledby="gi-completion-quiz-title">
    <header><BookOpen size={21} /><div><span>Completion quiz</span><h3 id="gi-completion-quiz-title">The quiz is recorded as a source boundary.</h3></div></header>
    <div className="gi-completion-quiz__board" aria-label="Greed Island completion quiz facts">
      <div><b>001–099</b><span>Specified Slot trigger</span></div>
      <div><b>100</b><span>questions confirmed</span></div>
      <div><b>87/100</b><span>Gon’s winning score</span></div>
      <div><b>000</b><span>Ruler’s Blessing</span></div>
    </div>
    <div className="gi-completion-selectors" aria-label="Completion quiz record selector">
      {records.map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} data-quiz-record={record.id} onClick={() => setSelectedId(record.id)}>{record.title}</button>)}
    </div>
    <CompletionRecord record={selected} />
  </section>;
}

function RewardSequence({ records }) {
  const [selectedId, setSelectedId] = useState('paladins-necklace-conversion');
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-completion-rewards" aria-labelledby="gi-completion-rewards-title">
    <header><Trophy size={21} /><div><span>Three-card reward sequence</span><h3 id="gi-completion-rewards-title">The reward path is ordered and card-linked.</h3></div></header>
    <div className="gi-completion-timeline" aria-label="Three-card reward sequence">
      {records.map((record, index) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} data-reward-step={record.id} onClick={() => setSelectedId(record.id)}>
        <i>{String(index + 1).padStart(2, '0')}</i><span>{record.title}</span>
      </button>)}
    </div>
    <CompletionRecord record={selected} />
  </section>;
}

function RouteFork({ records }) {
  const [routeId, setRouteId] = useState('accompany-to-kite');
  const selected = records.find((record) => record.id === routeId) || records[0];
  const magnetic = records.find((record) => record.id === 'magnetic-force-to-ging');
  const accompany = records.find((record) => record.id === 'accompany-to-kite');

  return <section className="gi-completion-route" aria-labelledby="gi-completion-route-title">
    <header><GitBranch size={21} /><div><span>Post-clear route fork</span><h3 id="gi-completion-route-title">Magnetic Force and Accompany resolve differently.</h3></div></header>
    <div className="gi-completion-route__choices" aria-label="Post-clear route choices">
      {[magnetic, accompany].filter(Boolean).map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} data-route-choice={record.id} onClick={() => setRouteId(record.id)}>
        <strong>{record.routeChoice}</strong><span>{record.destination}</span>
      </button>)}
    </div>
    <div className="gi-completion-route__outcome" role="status">
      {selected.id === 'magnetic-force-to-ging'
        ? 'Magnetic Force preserves Ging’s one-on-one condition: Gon alone is routed toward Ging.'
        : 'Accompany allows a friend to travel with Gon, so Elena’s routing sends Gon and Killua toward Kite instead.'}
    </div>
    <CompletionRecord record={selected} />
    <div className="gi-completion-route__handoff">
      <CompletionRecord record={records.find((record) => record.id === 'chimera-ant-handoff') || postClearRouteRecords[2]} />
    </div>
  </section>;
}

function AdaptationArchive({ records }) {
  const [selectedId, setSelectedId] = useState('manga-chapter-185');
  const selected = records.find((record) => record.id === selectedId) || records[0];
  return <section className="gi-completion-adaptation" aria-labelledby="gi-completion-adaptation-title">
    <header><Film size={21} /><div><span>Adaptation archive</span><h3 id="gi-completion-adaptation-title">Manga sequence remains the backbone.</h3></div></header>
    <div className="gi-completion-adaptation__grid" aria-label="Completion adaptation selector">
      {records.map((record) => <button type="button" key={record.id} className={selected.id === record.id ? 'is-active' : ''} aria-pressed={selected.id === record.id} data-adaptation-record={record.id} onClick={() => setSelectedId(record.id)}>
        <span>{record.title}</span><small>{completionStatusLabels[record.status] || titleCase(record.status)}</small>
      </button>)}
    </div>
    <CompletionRecord record={selected} />
  </section>;
}

function ReleaseReview({ records }) {
  return <section className="gi-completion-release" aria-labelledby="gi-completion-release-title">
    <header><ShieldCheck size={21} /><div><span>Final release review</span><h3 id="gi-completion-release-title">Completion is not the same as deployment.</h3></div></header>
    <div className="gi-completion-release__grid">
      {records.map((record) => <article key={record.id} data-release-check={record.id}>
        <span>{completionStatusLabels[record.status] || titleCase(record.status)}</span>
        <h4>{record.title}</h4>
        <p>{record.summary}</p>
        <ul>{record.checks.map((check) => <li key={check}><CheckCircle2 size={14} /> {check}</li>)}</ul>
        <SourceLink sourceId={record.sourceId}>Open release source</SourceLink>
      </article>)}
    </div>
  </section>;
}

export default function GreedIslandCompletionArchive() {
  const [collectionId, setCollectionId] = useState('quiz');
  const [query, setQuery] = useState('');
  const collections = completionArchiveCollections;
  const collection = collections[collectionId];
  const Icon = icons[collectionId] || ShieldCheck;

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return collection.records;
    return collection.records.filter((record) => [
      record.title,
      record.summary,
      record.routeChoice,
      record.destination,
      ...record.cards,
      ...record.tags,
      ...record.steps,
      ...record.checks,
    ].some((value) => String(value || '').toLowerCase().includes(normalized)));
  }, [collection, query]);

  const activeRecords = matches.length ? matches : collection.records;

  return <section className="gi-completion" id="completion-archive" aria-labelledby="gi-completion-title">
    <header className="gi-section-heading">
      <span>Stage 09 · Completion archive</span>
      <h2 id="gi-completion-title">The quiz, reward choice, route fork, adaptations, and release gate now have a completion ledger.</h2>
      <p>The archive records the verified endgame sequence while keeping the unavailable 100-question transcript and public deployment outside the evidence boundary.</p>
    </header>

    <div className="gi-completion__metrics" aria-label="Greed Island completion verification summary">
      <div><b>{greedIslandCompletionStats.quizRecords}</b><span>quiz-boundary records</span></div>
      <div><b>{greedIslandCompletionStats.rewardRecords}</b><span>reward-sequence records</span></div>
      <div><b>{greedIslandCompletionStats.routeRecords}</b><span>post-clear route records</span></div>
      <div><b>{greedIslandCompletionStats.releaseChecks}</b><span>release-review gates</span></div>
    </div>

    <nav className="gi-completion__tabs" aria-label="Completion archive collections">
      {Object.values(collections).map((item) => {
        const TabIcon = icons[item.id] || ShieldCheck;
        return <button type="button" key={item.id} className={collectionId === item.id ? 'is-active' : ''} aria-pressed={collectionId === item.id} data-completion-tab={item.id} onClick={() => { setCollectionId(item.id); setQuery(''); }}>
          <TabIcon size={17} /><span>{item.label}</span><small>{item.records.length}</small>
        </button>;
      })}
    </nav>

    <div className="gi-completion__filters">
      <label className="gi-completion__search"><Search size={16} /><span className="sr-only">Search completion archive</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quiz, rewards, route, adaptation…" /></label>
      <p><Filter size={15} /> {matches.length} matching {collection.label.toLowerCase()} records</p>
    </div>

    <div className="gi-completion__active" data-completion-collection={collectionId}>
      <div className="gi-completion__collection-header"><Icon size={22} /><div><span>{collection.label}</span><h3>{activeRecords[0]?.title || collection.label}</h3></div></div>
      {collectionId === 'quiz' && <QuizBoundary records={activeRecords} />}
      {collectionId === 'rewards' && <RewardSequence records={activeRecords} />}
      {collectionId === 'route' && <RouteFork records={activeRecords.length ? activeRecords : postClearRouteRecords} />}
      {collectionId === 'adaptation' && <AdaptationArchive records={activeRecords} />}
      {collectionId === 'release' && <ReleaseReview records={activeRecords.length ? activeRecords : releaseReviewChecks} />}
    </div>

    <p className="gi-completion__boundary"><ShieldCheck size={15} /> Completion archive boundary: source-backed endgame facts are documented; missing quiz-question text, exact public deployment state, and unsourced adaptation mechanics are not invented.</p>
  </section>;
}
