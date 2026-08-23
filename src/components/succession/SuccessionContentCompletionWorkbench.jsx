import { useMemo, useState } from 'react';
import { CheckCircle2, CircleHelp, Database, FileSearch, ShieldCheck, Users } from 'lucide-react';
import {
  getAllChapterCompletionDossiers,
  getAppendixCompletion,
  getCompletionReport,
  getCrossLinkCoverage,
  getEvidenceCompletion,
  getGlossaryCompletion,
  getInvestigationCompletion,
  getKakinCompletion,
  getKnowledgeCompletion,
  getLedgerCompletion,
  getMysteryCompletion,
  getNenCompletion,
  getPrinceCompletionDossiers,
  getSpecialTrackerCompletion,
} from '../../data/succession/contentCompletion';
import { SPECIAL_PRINCE_TRACKERS } from '../../data/succession/contentDepthExpansionReference';
import { LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER } from '../../data/latestChapterMetadata';
import './SuccessionContentCompletionWorkbench.css';

const VIEWS = [
  ['coverage', 'Coverage'],
  ['chapters', 'Chapters'],
  ['princes', 'Princes'],
  ['trackers', 'Prince trackers'],
  ['investigations', 'Investigations'],
  ['kakin', 'Kakin'],
  ['knowledge', 'Information war'],
  ['nen', 'Nen'],
  ['mysteries', 'Mysteries'],
  ['glossary', 'Glossary'],
  ['crosslinks', 'Cross-links'],
  ['ledgers', 'Ledgers'],
  ['evidence', 'Evidence'],
  ['appendices', 'Appendices'],
];

const STATUS_LABELS = {
  known: 'Known',
  'none-known': 'None known',
  'canon-unknown': 'Canon unknown',
  'not-applicable': 'N/A',
};

const renderValue = (value) => {
  if (value == null || value === '') return null;
  if (Array.isArray(value)) return value.length ? <ul>{value.slice(0, 40).map((entry, index) => <li key={`${index}-${typeof entry === 'object' ? entry?.id || entry?.name || 'row' : entry}`}>{renderValue(entry)}</li>)}</ul> : null;
  if (typeof value === 'object') {
    if (value.name || value.title || value.label) return <span>{value.name || value.title || value.label}</span>;
    return <pre>{JSON.stringify(value, null, 2)}</pre>;
  }
  return <span>{String(value)}</span>;
};

function Status({ value }) {
  const Icon = value === 'known' ? CheckCircle2 : CircleHelp;
  return <span className={`succession-completion-status is-${value}`}><Icon size={13} aria-hidden="true" />{STATUS_LABELS[value] || value}</span>;
}

function FieldRows({ fields }) {
  return <div className="succession-completion-fields">{fields.map((item, index) => <article key={item.id || item.label || item.focus || item.facet || item.topic || item.name || item.term || `${index}`}>
    <header><h4>{item.label || item.focus || item.facet || item.topic || item.name || item.term}</h4><Status value={item.status || item.completionState || 'known'} /></header>
    {renderValue(item.value ?? item.rows ?? item.knownFacts)}
    {item.note && <p>{item.note}</p>}
    {!!item.sourceRefs?.length && <small>Sources: {item.sourceRefs.join(' · ')}</small>}
  </article>)}</div>;
}

function Coverage({ chapter }) {
  const report = useMemo(() => getCompletionReport(chapter), [chapter]);
  return <section className="succession-completion-panel">
    <header><span>Completion contract</span><h3>{report.completeness}% requested-slot coverage</h3><p>{report.definition}</p></header>
    <dl className="succession-completion-stats">
      <div><dt>Checked slots</dt><dd>{report.cells}</dd></div>
      <div><dt>Missing</dt><dd>{report.missing.length}</dd></div>
      <div><dt>Chapters</dt><dd>{report.chapters}</dd></div>
      <div><dt>Princes</dt><dd>{report.princes}</dd></div>
      <div><dt>Trackers</dt><dd>{report.trackers}</dd></div>
      <div><dt>Nen records</dt><dd>{report.nenRecords}</dd></div>
      <div><dt>Glossary</dt><dd>{report.glossaryTerms}</dd></div>
      <div><dt>Cross-linked</dt><dd>{report.crossLinkedEntities}</dd></div>
      <div><dt>Ledgers</dt><dd>{report.ledgers}</dd></div>
      <div><dt>Appendices</dt><dd>{report.appendixFamilies}</dd></div>
    </dl>
    <div className="succession-completion-key">{Object.entries(report.counts).map(([key, count]) => <span key={key}><Status value={key} /> {count}</span>)}</div>
  </section>;
}

function Chapters({ chapter }) {
  const dossiers = useMemo(() => getAllChapterCompletionDossiers(chapter), [chapter]);
  const [selected, setSelected] = useState(chapter);
  const dossier = dossiers.find((row) => row.chapter === selected) || dossiers.at(-1);
  return <section className="succession-completion-panel"><header><span>Chapter forensics</span><h3>Every requested field, Chapter 339–{chapter}</h3><p>Known facts, confirmed absences, unresolved canon, and scope boundaries are all visible. No schema-only blanks.</p></header>
    <div className="succession-completion-picker">{dossiers.map((row) => <button type="button" className={row.chapter === dossier.chapter ? 'is-active' : ''} onClick={() => setSelected(row.chapter)} key={row.chapter}>{row.chapter}</button>)}</div>
    <div className="succession-completion-summary"><strong>Chapter {dossier.chapter}</strong><span>{dossier.scope}</span><span>{dossier.completeness}%</span></div>
    <FieldRows fields={dossier.fields} />
  </section>;
}

function Princes({ chapter }) {
  const rows = useMemo(() => getPrinceCompletionDossiers(chapter), [chapter]);
  const [selected, setSelected] = useState(rows[0]?.prince?.id || null);
  const dossier = rows.find((row) => row.prince.id === selected) || rows[0];
  return <section className="succession-completion-panel"><header><span>Royal dossier completion</span><h3>All fourteen princes use the same full evidence schema</h3></header>
    <div className="succession-completion-picker">{rows.map((row) => <button type="button" className={row.prince.id === dossier?.prince.id ? 'is-active' : ''} onClick={() => setSelected(row.prince.id)} key={row.prince.id}>{row.prince.name}</button>)}</div>
    {dossier && <><div className="succession-completion-summary"><strong>{dossier.prince.name}</strong><span>Prince {dossier.order || '?'}</span><span>{dossier.completeness}%</span></div><FieldRows fields={dossier.fields} /></>}
  </section>;
}

function Trackers({ chapter }) {
  const rows = useMemo(() => SPECIAL_PRINCE_TRACKERS.map((tracker) => getSpecialTrackerCompletion(tracker.id, chapter)).filter(Boolean), [chapter]);
  return <section className="succession-completion-panel"><header><span>Prince-specific mechanics</span><h3>Special trackers contain matched canon rows or explicit unresolved facets</h3></header><div className="succession-completion-groups">{rows.map((row) => <article key={row.id}><h4>{row.label}</h4><p>{row.canonicalFrame}</p><FieldRows fields={row.focusRows} /></article>)}</div></section>;
}

function Investigations({ chapter }) {
  const rows = useMemo(() => getInvestigationCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Investigation files</span><h3>Silent Majority, Beyond, Troupe/Hisoka, and mafia</h3></header><div className="succession-completion-groups">{rows.map((row) => <article key={row.id}><h4>{row.label}</h4><p>{row.rule}</p><p>{row.evidence.length} evidence/record hooks</p><FieldRows fields={row.facets} /></article>)}</div></section>;
}

function Kakin({ chapter }) {
  const row = useMemo(() => getKakinCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Royal system</span><h3>Kakin dynasty, ritual, Nen, law, artifacts, and security</h3></header><FieldRows fields={row.reference} /></section>;
}

function Knowledge({ chapter }) {
  const row = useMemo(() => getKnowledgeCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Information war</span><h3>{row.totalClaims} canonical knowledge claims mapped across requested topics</h3></header><FieldRows fields={row.topics} /></section>;
}

function Nen() {
  const row = useMemo(() => getNenCompletion(), []);
  return <section className="succession-completion-panel"><header><span>General Nen encyclopedia</span><h3>{row.count} normalized system and ability records</h3><p>Every record exposes summary, mechanics, study guidance, related concepts, and a source slot. Unknown record fields remain explicit instead of being silently absent.</p></header><div className="succession-completion-groups">{row.records.map((record) => <article key={record.id}><header><h4>{record.name}</h4><Status value={record.status} /></header><FieldRows fields={record.fields.map((item) => ({ ...item, label: item.field }))} /></article>)}</div></section>;
}

function Mysteries({ chapter }) {
  const rows = useMemo(() => getMysteryCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Mystery dossiers</span><h3>Evidence, unknowns, candidates, and resolution history</h3></header><div className="succession-completion-groups">{rows.map((row) => <article key={row.id}><header><h4>{row.title}</h4><Status value={row.completionState} /></header><p>{row.question}</p><h5>Known</h5>{renderValue(row.knownFacts)}<h5>Unknown</h5>{renderValue(row.unknowns)}<h5>Candidates</h5>{renderValue(row.candidates)}</article>)}</div></section>;
}

function Glossary({ chapter }) {
  const row = useMemo(() => getGlossaryCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Canonical vocabulary</span><h3>{row.count} chapter-bounded glossary terms</h3></header><div className="succession-completion-groups">{row.records.map((record) => <article key={record.id}><header><h4>{record.term}</h4><Status value={record.status} /></header><FieldRows fields={record.fields.map((item) => ({ ...item, label: item.field }))} /></article>)}</div></section>;
}

function CrossLinks({ chapter }) {
  const row = useMemo(() => getCrossLinkCoverage(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Cross-link coverage</span><h3>{row.count} released canonical entities checked</h3><p>An entity with no extra edge is explicitly marked as a graph-isolated canon record instead of vanishing from the cross-link audit.</p></header><div className="succession-completion-groups">{row.records.map((record) => <article key={row.id}><header><h4>{row.name}</h4><Status value={row.status} /></header><p>{row.entityType}</p><p>{row.note || `${row.relatedEntityIds.length} related · ${row.relationshipIds.length} relationships · ${row.sourceIds.length} sources`}</p></article>)}</div></section>;
}

function Ledgers({ chapter }) {
  const rows = useMemo(() => getLedgerCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Operational ledgers</span><h3>Zero is now an explicit result, not an empty implementation</h3></header><div className="succession-completion-groups">{rows.map((row) => <article key={row.id}><header><h4>{row.label}</h4><Status value={row.status} /></header><p>{row.basis}</p><strong>{row.count} records</strong>{renderValue(row.preview)}</article>)}</div></section>;
}

function Evidence({ chapter }) {
  const row = useMemo(() => getEvidenceCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Evidence discipline</span><h3>{row.totalRecords} records audited through Chapter {chapter}</h3><p>Unsourced: {row.unsourced.length} · inference/theory: {row.inferenceOrTheory.length} · explicit unknowns: {row.explicitUnknowns.length} · stale boundaries: {row.staleReviewBoundary.length}</p></header><FieldRows fields={row.ruleRows} /></section>;
}

function Appendices({ chapter }) {
  const row = useMemo(() => getAppendixCompletion(chapter), [chapter]);
  return <section className="succession-completion-panel"><header><span>Reference systems</span><h3>Every requested appendix family remains visible even where canon is unresolved</h3></header><FieldRows fields={row.families} /></section>;
}

export default function SuccessionContentCompletionWorkbench({ spoilerLimit = LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER }) {
  const chapter = Math.min(
    LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER,
    Math.max(340, Number(spoilerLimit) || LATEST_DETAILED_SUCCESSION_RESEARCH_CHAPTER),
  );
  const [view, setView] = useState('coverage');
  return <section className="succession-content-completion"><header className="succession-completion-hero"><div><span><ShieldCheck size={15} aria-hidden="true" /> Content completion</span><h2>Audit-backed research coverage through Chapter {chapter}</h2><p>This layer closes the gap between “the UI supports a field” and “the field actually resolves to researched content or an explicit canon-unknown state.”</p></div><Database size={30} aria-hidden="true" /></header>
    <nav className="succession-completion-tabs" aria-label="Content completion views">{VIEWS.map(([id, label]) => <button type="button" className={view === id ? 'is-active' : ''} onClick={() => setView(id)} key={id}>{id === 'chapters' ? <FileSearch size={14} /> : id === 'princes' ? <Users size={14} /> : null}{label}</button>)}</nav>
    {view === 'coverage' && <Coverage chapter={chapter} />}
    {view === 'chapters' && <Chapters chapter={chapter} />}
    {view === 'princes' && <Princes chapter={chapter} />}
    {view === 'trackers' && <Trackers chapter={chapter} />}
    {view === 'investigations' && <Investigations chapter={chapter} />}
    {view === 'kakin' && <Kakin chapter={chapter} />}
    {view === 'knowledge' && <Knowledge chapter={chapter} />}
    {view === 'nen' && <Nen />}
    {view === 'mysteries' && <Mysteries chapter={chapter} />}
    {view === 'glossary' && <Glossary chapter={chapter} />}
    {view === 'crosslinks' && <CrossLinks chapter={chapter} />}
    {view === 'ledgers' && <Ledgers chapter={chapter} />}
    {view === 'evidence' && <Evidence chapter={chapter} />}
    {view === 'appendices' && <Appendices chapter={chapter} />}
  </section>;
}