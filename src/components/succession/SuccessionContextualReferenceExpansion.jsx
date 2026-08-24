import { useMemo } from 'react';
import { Database, Network, ShieldCheck } from 'lucide-react';
import {
  getCrossLinkCoverage,
  getKakinCompletion,
  getKnowledgeCompletion,
  getLedgerCompletion,
} from '../../data/succession/contentCompletion';
import './SuccessionContextualCompletion.css';

const clampChapter = (value) => Math.min(417, Math.max(340, Number(value) || 417));
const labelForStatus = Object.freeze({
  known: 'Known',
  'none-known': 'None known',
  'canon-unknown': 'Canon unknown',
  'not-applicable': 'N/A',
});

function Status({ value }) {
  return <span className={`succession-contextual-status is-${value}`}>{labelForStatus[value] || value}</span>;
}

function Surface({ kicker, title, description, icon: Icon, children }) {
  return <section className="succession-contextual-completion succession-contextual-completion--reference">
    <header className="succession-contextual-completion__header"><div><span><Icon size={14} aria-hidden="true" />{kicker}</span><h2>{title}</h2><p>{description}</p></div></header>
    {children}
  </section>;
}

function KakinReference({ chapter }) {
  const kakin = useMemo(() => getKakinCompletion(chapter), [chapter]);
  return <Surface kicker="Royal-system reference" title="Kakin dynasty, ritual, law, artifacts, and security" description="The complete Kakin reference layer is now attached to the Royal Family route, including unresolved canon boundaries." icon={ShieldCheck}>
    <div className="succession-contextual-grid">{kakin.reference.map((row) => <article className="succession-contextual-field" key={row.term}><header><h4>{row.term}</h4><Status value={row.status} /></header><p>{row.summary}</p>{row.rows?.length ? <small>{row.rows.length} matched canonical record{row.rows.length === 1 ? '' : 's'}</small> : <small>{row.note}</small>}</article>)}</div>
  </Surface>;
}

function KnowledgeReference({ chapter }) {
  const knowledge = useMemo(() => getKnowledgeCompletion(chapter), [chapter]);
  return <Surface kicker="Information war" title={`${knowledge.topics.length} tracked knowledge topics · ${knowledge.totalClaims} canonical claims`} description="Who knows, lacks, misreads, withholds, or propagates crucial information is now visible in the normal Research route." icon={Network}>
    <div className="succession-contextual-grid">{knowledge.topics.map((row) => <article className="succession-contextual-field" key={row.topic}><header><h4>{row.topic}</h4><Status value={row.status} /></header>{row.rows?.length ? <><strong>{row.rows.length} matched claim{row.rows.length === 1 ? '' : 's'}</strong><ul>{row.rows.slice(0, 8).map((record, index) => <li key={record.id || index}>{record.name || record.title || record.summary || record.id || 'Knowledge record'}</li>)}</ul></> : <p>{row.note}</p>}</article>)}</div>
  </Surface>;
}

function LedgerReference({ chapter }) {
  const ledgers = useMemo(() => getLedgerCompletion(chapter), [chapter]);
  const crossLinks = useMemo(() => getCrossLinkCoverage(chapter), [chapter]);
  const isolated = crossLinks.records.filter((row) => row.status === 'canon-unknown');
  const typeCounts = crossLinks.records.reduce((map, row) => {
    map.set(row.entityType, (map.get(row.entityType) || 0) + 1);
    return map;
  }, new Map());
  return <Surface kicker="Operational ledgers and graph" title={`${ledgers.length} ledgers · ${crossLinks.count} graph-checked canonical entities`} description="The complete movement/state ledger family and cross-link health are now visible beside the normal Events and Relationships routes." icon={Database}>
    <div className="succession-contextual-grid">{ledgers.map((row) => <article className="succession-contextual-field" key={row.id}><header><h4>{row.label}</h4><Status value={row.status} /></header><strong>{row.count} record{row.count === 1 ? '' : 's'}</strong><p>{row.basis}</p>{row.preview?.length ? <ul>{row.preview.slice(0, 10).map((item, index) => <li key={`${index}-${item}`}>{typeof item === 'string' ? item : item?.name || item?.title || item?.id || 'Record'}</li>)}</ul> : <small>{row.note}</small>}</article>)}</div>
    <section className="succession-contextual-subsection"><header><span>Cross-link health</span><h3>{crossLinks.count - isolated.length} connected · {isolated.length} graph-isolated</h3><p>A graph-isolated record remains canonical and reachable; it simply has no additional relationship/source edge at this chapter boundary.</p></header><div className="succession-contextual-prince-index">{[...typeCounts.entries()].sort((a, b) => b[1] - a[1]).map(([type, count]) => <div className="succession-contextual-field is-compact" key={type}><span>{type}</span><strong>{count}</strong><small>checked entities</small></div>)}</div>{isolated.length > 0 && <details className="succession-contextual-details"><summary>Show graph-isolated canonical records <b>{isolated.length}</b></summary><div className="succession-contextual-grid">{isolated.map((row) => <article className="succession-contextual-field is-compact" key={row.id}><header><h4>{row.name}</h4><Status value={row.status} /></header><p>{row.entityType}</p><small>{row.note}</small></article>)}</div></details>}</section>
  </Surface>;
}

export default function SuccessionContextualReferenceExpansion({ routeTarget, routeParams = {}, spoilerLimit = 417 }) {
  const chapter = clampChapter(routeParams.chapter || routeParams.focus || routeParams.to || spoilerLimit);
  if (routeTarget === 'princes') return <KakinReference chapter={chapter} />;
  if (routeTarget === 'research') return <KnowledgeReference chapter={chapter} />;
  if (routeTarget === 'events' || routeTarget === 'relationships') return <LedgerReference chapter={chapter} />;
  return null;
}
