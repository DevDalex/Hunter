import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookCopy,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  FileClock,
  FileKey2,
  GitCompareArrows,
  History,
  Network,
  Scale,
  SearchCheck,
  ShieldQuestion,
} from 'lucide-react';
import {
  compareSameTypeRecords,
  getArtifactRecord,
  getArtifactsAtChapter,
  getChapterStateDiff,
  getEditorialChangeLog,
  getEntitiesByType,
  getEntityById,
  getIntelligenceWorkbenchSummary,
  getKnowledgeMatrix,
  getKnowledgeRecord,
  getProtocolRecord,
  getProtocolRecordsAtChapter,
} from '../../data/succession/successionData';
import { EntityLink, entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import SuccessionResearchMemoryPanel from './SuccessionResearchMemoryPanel';
import './SuccessionIntelligenceWorkbench.css';

const modes = Object.freeze([
  ['overview', 'Overview', Network],
  ['diff', 'Chapter diff', GitCompareArrows],
  ['knowledge', 'Knowledge & secrecy', BrainCircuit],
  ['protocols', 'Rules & protocols', Scale],
  ['artifacts', 'Objects & evidence', Boxes],
  ['compare', 'Compare records', SearchCheck],
  ['changes', 'Editorial history', History],
]);
const diffTypes = Object.freeze([
  'character', 'organization', 'ability', 'guardian-beast', 'location', 'event',
  'assignment', 'relationship', 'knowledge-record', 'protocol', 'object', 'document', 'evidence-item',
]);
const comparisonTypes = Object.freeze([
  'character', 'organization', 'ability', 'guardian-beast', 'location', 'event', 'assignment',
  'relationship', 'knowledge-record', 'protocol', 'object', 'document', 'evidence-item',
]);
const comparisonFieldViews = Object.freeze(['differences', 'all', 'shared']);
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const parseIds = (value) => String(value || '').split(',').map((id) => id.trim()).filter(Boolean);

function WorkbenchTabs({ mode, onSelect }) {
  return <nav className="succession-intelligence-tabs" aria-label="Phase 4 intelligence views">
    {modes.map(([id, label, Icon]) => <button type="button" className={mode === id ? 'is-active' : ''} aria-current={mode === id ? 'page' : undefined} onClick={() => onSelect(id)} key={id}><Icon size={15} aria-hidden="true" /><span>{label}</span></button>)}
  </nav>;
}

function EntityAction({ entity, onNavigate, label = 'Open record' }) {
  if (!entity) return null;
  if (['knowledge-record', 'protocol', 'object', 'document', 'evidence-item'].includes(entity.entityType)) {
    const mode = entity.entityType === 'knowledge-record' ? 'knowledge' : entity.entityType === 'protocol' ? 'protocols' : 'artifacts';
    return <button type="button" onClick={() => onNavigate('research', { mode, entity: entity.id })}>{label} <ArrowRight size={12} aria-hidden="true" /></button>;
  }
  return <button type="button" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{label} <ArrowRight size={12} aria-hidden="true" /></button>;
}

function OverviewMode({ spoilerLimit, onMode, onNavigate }) {
  const summary = getIntelligenceWorkbenchSummary(spoilerLimit);
  const cards = [
    ['diff', 'Chapter-to-chapter state comparison', 'Compare two chapter boundaries and display only additions, removals, and changed canonical states.', `${summary.chapter} current boundary`, GitCompareArrows],
    ['knowledge', 'Knowledge & Secrecy', 'Track who knows a claim, who is deliberately protected from it, and how far the information has travelled.', `${summary.knowledgeRecords} records · ${summary.secretKnowledge} secret`, BrainCircuit],
    ['protocols', 'Rules, Law & Ritual Protocol', 'Separate ritual conditions, Nen rules, royal ceremony, judicial procedure, and military orders.', `${summary.protocolRecords} protocols · ${summary.disputedProtocols} unresolved`, Scale],
    ['artifacts', 'Objects, Documents & Evidence', 'Inspect ownership, custody, location, Nen status, legal significance, and connected evidence.', `${summary.objects} objects · ${summary.documents} documents · ${summary.evidenceItems} evidence`, Boxes],
    ['compare', 'Same-type record comparison', 'Compare compatible records without generating duplicate permanent dossiers.', 'Up to four records', SearchCheck],
    ['changes', 'Archive editorial change log', 'Review merged archive changes separately from the story timeline.', `${summary.editorialEntries} published entries`, FileClock],
  ];
  return <>
    <SuccessionResearchMemoryPanel spoilerLimit={spoilerLimit} onNavigate={onNavigate} />
    <section className="succession-intelligence-overview" aria-labelledby="phase-4-overview-title">
      <header><span>Generated intelligence, not duplicated lore</span><h3 id="phase-4-overview-title">Six tools built on the same canonical graph.</h3><p>Every result respects the selected chapter boundary. Facts stay in their original records; this workbench reveals changes and relationships between them.</p></header>
      <div>{cards.map(([id, title, description, meta, Icon]) => <article key={id}><Icon size={21} aria-hidden="true" /><span>{meta}</span><h4>{title}</h4><p>{description}</p><button type="button" onClick={() => onMode(id)}>Open intelligence view <ArrowRight size={13} /></button></article>)}</div>
    </section>
  </>;
}

function DiffMode({ routeParams, spoilerLimit, onNavigate }) {
  const latest = Number(spoilerLimit) || 414;
  const [fromChapter, setFromChapter] = useState(Math.max(338, Number(routeParams.from) || latest - 1));
  const [toChapter, setToChapter] = useState(Math.max(338, Number(routeParams.to) || latest));
  const [type, setType] = useState(routeParams.type || 'all');
  useEffect(() => { if (routeParams.from) setFromChapter(Number(routeParams.from)); }, [routeParams.from]);
  useEffect(() => { if (routeParams.to) setToChapter(Number(routeParams.to)); }, [routeParams.to]);
  const result = useMemo(() => getChapterStateDiff(fromChapter, toChapter, { types: type === 'all' ? diffTypes : [type] }), [fromChapter, toChapter, type]);
  const apply = () => onNavigate('research', { mode: 'diff', from: fromChapter, to: toChapter, ...(type !== 'all' ? { type } : {}) });
  return <section className="succession-intelligence-diff" aria-labelledby="phase-4-diff-title">
    <header><div><span>Global state delta</span><h3 id="phase-4-diff-title">What changed between two chapter boundaries?</h3><p>Unchanged records disappear. Added, removed, and modified states retain their entity links and field-level deltas.</p></div><div className="succession-intelligence-controls"><label>From chapter<input type="number" min="338" max={spoilerLimit} value={fromChapter} onChange={(event) => setFromChapter(Number(event.target.value))} /></label><label>To chapter<input type="number" min="338" max={spoilerLimit} value={toChapter} onChange={(event) => setToChapter(Number(event.target.value))} /></label><label>Domain<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All intelligence domains</option>{diffTypes.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label><button type="button" onClick={apply}>Apply comparison</button></div></header>
    <dl className="succession-intelligence-summary"><div><dt>Added</dt><dd>{result.summary.added}</dd></div><div><dt>Removed</dt><dd>{result.summary.removed}</dd></div><div><dt>Changed</dt><dd>{result.summary.changed}</dd></div><div><dt>Direction</dt><dd>{labelize(result.direction)}</dd></div></dl>
    <div className="succession-intelligence-diff__records">{result.records.slice(0, 120).map((record) => {
      const entity = getEntityById(record.entity.id);
      return <article className={`is-${record.status}`} key={record.entity.id}><header><span>{labelize(record.entity.entityType)}</span><b>{labelize(record.status)}</b></header><h4>{record.entity.name}</h4>{record.status === 'changed' ? <dl>{record.deltas.slice(0, 6).map((delta) => <div key={delta.key}><dt>{delta.label}</dt><dd><span>{Array.isArray(delta.before) ? delta.before.join(' · ') : String(delta.before ?? 'None')}</span><ArrowRight size={12} aria-hidden="true" /><strong>{Array.isArray(delta.after) ? delta.after.join(' · ') : String(delta.after ?? 'None')}</strong></dd></div>)}</dl> : <p>{record.status === 'added' ? `Available by Chapter ${result.toChapter}.` : `No longer active by Chapter ${result.toChapter}.`}</p>}<EntityAction entity={entity} onNavigate={onNavigate} /></article>;
    })}</div>
    {!result.records.length && <p className="succession-intelligence-empty">No state changes match this comparison.</p>}
  </section>;
}

function KnowledgeMode({ routeParams, spoilerLimit, onNavigate }) {
  const matrix = getKnowledgeMatrix(spoilerLimit);
  const selected = routeParams.entity ? getKnowledgeRecord(routeParams.entity) : null;
  if (selected) return <section className="succession-intelligence-detail"><button type="button" onClick={() => onNavigate('research', { mode: 'knowledge' })}>← Back to Knowledge & Secrecy</button><span>{labelize(selected.knowledgeState)} · {selected.secrecy}</span><h3>{selected.name}</h3><p>{selected.summary}</p><dl><div><dt>Subjects</dt><dd>{selected.subjectLabels.join(' · ')}</dd></div><div><dt>Known by</dt><dd>{selected.knowerLabels.join(' · ')}</dd></div><div><dt>Protected from / misinformed</dt><dd>{selected.misinformedLabels.join(' · ') || 'None published'}</dd></div><div><dt>Acquisition</dt><dd>{selected.acquisition}</dd></div><div><dt>Public chapter</dt><dd>{selected.publicAtChapter || 'Not public'}</dd></div></dl><div className="succession-intelligence-links">{[...(selected.subjectEntityIds || []), ...(selected.knowerEntityIds || []), ...(selected.misinformedEntityIds || [])].map((id) => <EntityLink entityId={id} onNavigate={onNavigate} key={id} />)}</div></section>;
  return <section className="succession-intelligence-knowledge" aria-labelledby="phase-4-knowledge-title"><header><span>Information asymmetry</span><h3 id="phase-4-knowledge-title">Who knows what, and who does not?</h3><p>The matrix records access to claims and beliefs. It does not treat a character’s private intent as observable fact.</p></header><dl className="succession-intelligence-summary">{Object.entries(matrix.states).map(([state, count]) => <div key={state}><dt>{labelize(state)}</dt><dd>{count}</dd></div>)}</dl><div>{matrix.records.map((record) => <article key={record.id}><header><BrainCircuit size={16} aria-hidden="true" /><span>{labelize(record.currentKnowledgeState)}</span><b>{record.secrecy}</b></header><h4>{record.name}</h4><p>{record.summary}</p><dl><div><dt>Known by</dt><dd>{record.knowerLabels.join(' · ')}</dd></div><div><dt>Misinformed / protected</dt><dd>{record.misinformedLabels.join(' · ') || 'None published'}</dd></div></dl><EntityAction entity={record} onNavigate={onNavigate} /></article>)}</div></section>;
}

function ProtocolMode({ routeParams, spoilerLimit, onNavigate }) {
  const selected = routeParams.entity ? getProtocolRecord(routeParams.entity) : null;
  const records = getProtocolRecordsAtChapter(spoilerLimit);
  if (selected) return <section className="succession-intelligence-detail"><button type="button" onClick={() => onNavigate('research', { mode: 'protocols' })}>← Back to Rules & Protocols</button><span>{labelize(selected.domain)} · {labelize(selected.protocolStatus)}</span><h3>{selected.name}</h3><p>{selected.summary}</p><dl><div><dt>Authority</dt><dd>{selected.authority}</dd></div><div><dt>Rule</dt><dd>{selected.ruleStatement}</dd></div><div><dt>Trigger</dt><dd>{selected.trigger}</dd></div><div><dt>Scope</dt><dd>{selected.scope}</dd></div><div><dt>Enforcement</dt><dd>{selected.enforcement}</dd></div><div><dt>Exceptions</dt><dd>{selected.exceptions.join(' · ') || 'None published'}</dd></div><div><dt>Open questions</dt><dd>{selected.openQuestions.join(' · ') || 'None'}</dd></div></dl><div className="succession-intelligence-links">{selected.linkedEntityIds.map((id) => <EntityLink entityId={id} onNavigate={onNavigate} key={id} />)}</div></section>;
  return <section className="succession-intelligence-protocols" aria-labelledby="phase-4-protocol-title"><header><span>Rules, law, ritual, and procedure</span><h3 id="phase-4-protocol-title">Do not mix legal orders with Nen conditions.</h3><p>Each record states its authority, trigger, scope, enforcement mechanism, exceptions, and unresolved limits.</p></header><div>{records.map((record) => <article key={record.id}><header><Scale size={16} aria-hidden="true" /><span>{labelize(record.domain)}</span><b>{labelize(record.protocolStatus)}</b></header><h4>{record.name}</h4><p>{record.summary}</p><dl><div><dt>Authority</dt><dd>{record.authority}</dd></div><div><dt>Trigger</dt><dd>{record.trigger}</dd></div></dl><EntityAction entity={record} onNavigate={onNavigate} /></article>)}</div></section>;
}

function ArtifactMode({ routeParams, spoilerLimit, onNavigate }) {
  const selected = routeParams.entity ? getArtifactRecord(routeParams.entity) : null;
  const records = getArtifactsAtChapter(spoilerLimit);
  if (selected) return <section className="succession-intelligence-detail"><button type="button" onClick={() => onNavigate('research', { mode: 'artifacts' })}>← Back to Objects & Evidence</button><span>{labelize(selected.entityType)} · {labelize(selected.artifactCategory || selected.documentCategory || selected.evidenceCategory)}</span><h3>{selected.name}</h3><p>{selected.summary}</p><dl><div><dt>State</dt><dd>{labelize(selected.artifactState)}</dd></div><div><dt>Owners / authors</dt><dd>{[...(selected.ownerLabels || []), ...(selected.authorLabels || [])].join(' · ') || 'None published'}</dd></div><div><dt>Holders / recipients</dt><dd>{[...(selected.holderLabels || []), ...(selected.recipientLabels || [])].join(' · ') || 'None published'}</dd></div><div><dt>Location</dt><dd>{(selected.locationLabels || []).join(' · ') || 'Unknown'}</dd></div><div><dt>Nen status</dt><dd>{selected.nenStatus || 'Not specified'}</dd></div><div><dt>Legal significance</dt><dd>{selected.legalSignificance || 'Not specified'}</dd></div><div><dt>Evidence role</dt><dd>{selected.evidenceRole || selected.evidentiaryUse || 'Not specified'}</dd></div></dl>{selected.chainOfCustody?.length > 0 && <section><h4>Chain of custody</h4><ol>{selected.chainOfCustody.map((entry, index) => <li key={`${entry.chapter}-${index}`}><b>Chapter {entry.chapter}</b><span>{entry.state}</span><small>{entry.holder}</small></li>)}</ol></section>}<div className="succession-intelligence-links">{[...(selected.ownerEntityIds || []), ...(selected.holderEntityIds || []), ...(selected.authorEntityIds || []), ...(selected.recipientEntityIds || []), ...(selected.subjectEntityIds || []), ...(selected.locationEntityIds || [])].map((id) => <EntityLink entityId={id} onNavigate={onNavigate} key={id} />)}</div></section>;
  return <section className="succession-intelligence-artifacts" aria-labelledby="phase-4-artifact-title"><header><span>Objects, documents, and evidence</span><h3 id="phase-4-artifact-title">Physical and documentary records with custody.</h3><p>These records separate the item itself from the claim it supports, its Nen status, and its legal or operational significance.</p></header><div>{records.map((record) => <article key={record.id}><header>{record.entityType === 'document' ? <BookCopy size={16} /> : record.entityType === 'evidence-item' ? <FileKey2 size={16} /> : <Boxes size={16} />}<span>{labelize(record.entityType)}</span><b>{labelize(record.artifactState)}</b></header><h4>{record.name}</h4><p>{record.summary}</p><small>{labelize(record.artifactCategory || record.documentCategory || record.evidenceCategory)}</small><EntityAction entity={record} onNavigate={onNavigate} /></article>)}</div></section>;
}

function CompareMode({ routeParams, spoilerLimit, onNavigate }) {
  const initialIds = parseIds(routeParams.compare);
  const requestedFieldView = comparisonFieldViews.includes(routeParams.fields) ? routeParams.fields : 'differences';
  const [type, setType] = useState(routeParams.type || getEntityById(initialIds[0])?.entityType || 'character');
  const [fieldView, setFieldView] = useState(requestedFieldView);
  const candidates = useMemo(() => getEntitiesByType(type).filter((entity) => !entity.chapterRange?.start || entity.chapterRange.start <= spoilerLimit).sort((a, b) => a.name.localeCompare(b.name)), [type, spoilerLimit]);
  const defaults = initialIds.length >= 2 ? initialIds : candidates.slice(0, 2).map((entity) => entity.id);
  const [ids, setIds] = useState(defaults);
  useEffect(() => { setIds((current) => current.filter((id) => getEntityById(id)?.entityType === type).slice(0, 4)); }, [type]);
  useEffect(() => setFieldView(requestedFieldView), [requestedFieldView]);
  const selectedIds = ids.length >= 2 ? ids : candidates.slice(0, 2).map((entity) => entity.id);
  const result = compareSameTypeRecords(selectedIds, spoilerLimit);
  const visibleRows = result.valid ? result.rows.filter((row) => fieldView === 'all' || (fieldView === 'differences' ? !row.allSame : row.allSame)) : [];
  const setSlot = (index, value) => setIds((current) => { const next = [...current]; next[index] = value; return next.filter(Boolean); });
  const apply = () => onNavigate('research', { mode: 'compare', type, compare: selectedIds.join(','), fields: fieldView });
  return <section className="succession-intelligence-compare" aria-labelledby="phase-4-compare-title"><header><div><span>Same-type comparison</span><h3 id="phase-4-compare-title">Compare records without cloning dossiers.</h3><p>Differences are shown first by default. Switch to shared fields or the complete compatible-field set without changing the underlying chapter-bounded comparison.</p></div><div className="succession-intelligence-controls"><label>Record type<select value={type} onChange={(event) => { setType(event.target.value); setIds([]); }}>{comparisonTypes.map((value) => <option value={value} key={value}>{labelize(value)}</option>)}</select></label><label>Fields<select value={fieldView} onChange={(event) => setFieldView(event.target.value)}><option value="differences">Differences only</option><option value="all">All compatible fields</option><option value="shared">Shared only</option></select></label>{[0, 1, 2, 3].map((index) => <label key={index}>Record {index + 1}<select value={selectedIds[index] || ''} onChange={(event) => setSlot(index, event.target.value)}><option value="">None</option>{candidates.map((entity) => <option value={entity.id} key={entity.id}>{entity.name}</option>)}</select></label>)}<button type="button" onClick={apply}>Save comparison URL</button></div></header>{result.valid ? <div className="succession-intelligence-table" tabIndex="0" role="region" aria-label={`Comparison matrix showing ${visibleRows.length} of ${result.rows.length} compatible fields`}><div className="succession-intelligence-table__status" role="status" aria-live="polite">Showing {visibleRows.length} of {result.rows.length} compatible fields · {labelize(fieldView)} view</div><table><thead><tr><th>Field</th>{result.records.map((record) => <th key={record.id}>{record.name}</th>)}</tr></thead><tbody>{visibleRows.map((row) => <tr className={row.allSame ? 'is-shared' : 'is-different'} key={row.key}><th>{row.label}</th>{row.displayValues.map((value, index) => <td key={`${row.key}-${result.records[index].id}`}>{value}</td>)}</tr>)}</tbody></table>{!visibleRows.length && <p className="succession-intelligence-table__empty">No compatible fields match the selected {fieldView} view.</p>}<footer><span>{result.differenceCount} differences</span><span>{result.sharedCount} shared fields</span>{result.records.map((record) => <EntityAction entity={getEntityById(record.id)} onNavigate={onNavigate} label={record.name} key={record.id} />)}</footer></div> : <p className="succession-intelligence-empty">{result.reason}</p>}</section>;
}

function ChangesMode() {
  const log = getEditorialChangeLog();
  return <section className="succession-intelligence-changes" aria-labelledby="phase-4-changes-title"><header><span>Archive maintenance, not story chronology</span><h3 id="phase-4-changes-title">Editorial change log</h3><p>This ledger records merged archive work separately from canonical events aboard the Black Whale.</p></header><ol>{log.entries.map((entry) => <li key={entry.id}><div><CheckCircle2 size={17} aria-hidden="true" /><span>{entry.date}</span><b>{labelize(entry.phase)}</b></div><h4>{labelize(entry.changeType)}</h4><p>{entry.summary}</p><small>{entry.affectedDomains.map(labelize).join(' · ')}</small><code>{entry.commit ? entry.commit.slice(0, 8) : labelize(entry.status || 'uncommitted')}</code></li>)}</ol></section>;
}

export default function SuccessionIntelligenceWorkbench({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const requestedMode = modes.some(([id]) => id === routeParams.mode) ? routeParams.mode : 'overview';
  const [mode, setMode] = useState(requestedMode);
  useEffect(() => setMode(requestedMode), [requestedMode]);
  const selectMode = (id) => { setMode(id); onNavigate('research', { mode: id, ...(routeParams.chapter ? { chapter: routeParams.chapter } : {}) }); };
  return <section className="succession-intelligence-workbench" aria-labelledby="phase-4-workbench-title">
    <header className="succession-intelligence-workbench__hero"><div><span><ShieldQuestion size={16} aria-hidden="true" /> Phase 4 · High-value intelligence</span><h2 id="phase-4-workbench-title">Cross-examine the Succession Archive.</h2><p>Compare chapter states, map secrets, separate ritual from law, follow physical evidence, compare compatible records, and review editorial history without creating duplicate facts.</p></div><dl><div><dt>Boundary</dt><dd>Chapter {spoilerLimit}</dd></div><div><dt>Mode</dt><dd>{labelize(mode)}</dd></div><div><dt>Source rule</dt><dd>Chapter-linked</dd></div></dl></header>
    <WorkbenchTabs mode={mode} onSelect={selectMode} />
    <div className="succession-intelligence-workbench__body">
      {mode === 'overview' && <OverviewMode spoilerLimit={spoilerLimit} onMode={selectMode} onNavigate={onNavigate} />}
      {mode === 'diff' && <DiffMode routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {mode === 'knowledge' && <KnowledgeMode routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {mode === 'protocols' && <ProtocolMode routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {mode === 'artifacts' && <ArtifactMode routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {mode === 'compare' && <CompareMode routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={onNavigate} />}
      {mode === 'changes' && <ChangesMode />}
    </div>
  </section>;
}
