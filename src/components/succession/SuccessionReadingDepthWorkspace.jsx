import { ArrowRight, BookOpen, FileSearch, Gauge, Layers3, Microscope, ShieldCheck } from 'lucide-react';
import {
  getChapterStoryDossier,
  getChapterWhatChanged,
  getClaimProvenanceProfile,
  getConsequenceChains,
  getEntitiesByType,
  getKnowledgeWarfareMatrix,
  getThreatAssassinationMatrix,
} from '../../data/succession/successionData';
import { successionMysteryCases } from '../../data/succession/successionMysteryCases';
import { getSuccessionTranslationVariantsAtChapter } from '../../data/succession/contentDepthTranslationVariants';
import './SuccessionReadingDepthWorkspace.css';

const modes = Object.freeze([
  ['quick', '60-second', Gauge],
  ['standard', 'Standard', BookOpen],
  ['deep', 'Deep analysis', Microscope],
  ['evidence', 'Evidence', FileSearch],
]);
const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function ModeNav({ routeId, chapter, active, onNavigate }) {
  return <nav className="succession-reading-depth__modes" aria-label="Explanation depth">{modes.map(([id, label, Icon]) => <button type="button" className={active === id ? 'is-active' : ''} aria-current={active === id ? 'page' : undefined} onClick={() => onNavigate(routeId, { chapter, depth: id })} key={id}><Icon size={14} aria-hidden="true" /> {label}</button>)}</nav>;
}

function QuickView({ chapter, dossier, change, onNavigate }) {
  const events = [...(dossier?.startingEvents || []), ...(dossier?.continuingEvents || [])];
  const facts = [
    dossier?.research?.focus || dossier?.chapter?.summary,
    ...(dossier?.changes || []).slice(0, 3),
    dossier?.openThreads?.[0]?.profile?.question || dossier?.threads?.find((item) => item.status !== 'resolved')?.profile?.question,
  ].filter(Boolean).slice(0, 5);
  return <section className="succession-reading-depth__quick"><header><span>60-second briefing</span><h2>Chapter {chapter} in five signals</h2><p>This view deliberately strips the archive down to the minimum needed to remember what matters.</p></header><ol>{facts.map((fact, index) => <li key={`${index}-${fact}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{fact}</p></li>)}</ol><dl><div><dt>Changed records</dt><dd>{change.summary.added + change.summary.changed + change.summary.removed}</dd></div><div><dt>Events</dt><dd>{events.length}</dd></div><div><dt>Open threads</dt><dd>{dossier?.openThreads?.length || 0}</dd></div><div><dt>Sources</dt><dd>{dossier?.sources?.length || 0}</dd></div></dl><div className="succession-reading-depth__actions"><button type="button" onClick={() => onNavigate('reader', { chapter })}>Read manga <BookOpen size={13} /></button><button type="button" onClick={() => onNavigate('chapters', { chapter, depth: 'standard' })}>Open full dossier <ArrowRight size={13} /></button></div></section>;
}

function DeepView({ chapter, dossier, change, onNavigate }) {
  const threats = getThreatAssassinationMatrix(chapter).slice(0, 12);
  const knowledge = getKnowledgeWarfareMatrix(chapter).filter((record) => record.publicAtChapter === chapter || (record.subjectEntityIds || []).some((id) => dossier?.appearances?.some((entity) => entity.id === id))).slice(0, 12);
  const cases = successionMysteryCases.filter((record) => record.firstChapter <= chapter && record.latestChapter >= chapter).slice(0, 12);
  const consequences = getConsequenceChains(chapter);
  return <section className="succession-reading-depth__deep"><header><span>Deep analysis</span><h2>Chapter {chapter} as a strategic state transition</h2><p>State deltas, threats, information asymmetry, unresolved cases and causal structure are shown together instead of as separate encyclopedic lists.</p></header><dl className="succession-reading-depth__metrics"><div><dt>Added</dt><dd>{change.summary.added}</dd></div><div><dt>Changed</dt><dd>{change.summary.changed}</dd></div><div><dt>Removed</dt><dd>{change.summary.removed}</dd></div><div><dt>Threat signals</dt><dd>{threats.length}</dd></div><div><dt>Knowledge signals</dt><dd>{knowledge.length}</dd></div><div><dt>Causal links</dt><dd>{consequences.links.length}</dd></div></dl><div className="succession-reading-depth__columns"><section><h3>What changed?</h3><ol>{change.records.slice(0, 14).map((record) => <li key={record.entity.id}><span>{labelize(record.status)}</span><b>{record.entity.name}</b><small>{labelize(record.entity.entityType)}</small></li>)}</ol></section><section><h3>Active threats</h3><ol>{threats.map((record) => <li key={record.id}><span>{labelize(record.method)}</span><b>{record.source?.name || 'Unknown source'} → {record.target?.name || 'Unknown target'}</b><small>{labelize(record.status)}</small></li>)}</ol></section><section><h3>Information asymmetry</h3><ol>{knowledge.map((record) => <li key={record.id}><span>{labelize(record.state)}</span><b>{record.name}</b><small>{record.knowerLabels.slice(0, 3).join(' · ') || 'No knowers resolved'}</small></li>)}</ol></section><section><h3>Open cases touching this boundary</h3><ol>{cases.map((record) => <li key={record.id}><span>{labelize(record.category)}</span><b>{record.title}</b><small>{record.question}</small></li>)}</ol></section></div><div className="succession-reading-depth__actions"><button type="button" onClick={() => onNavigate('research', { mode: 'cases', workspace: 'depth', view: 'chapter', chapter })}>Open strategic workbench <Layers3 size={13} /></button><button type="button" onClick={() => onNavigate('research', { mode: 'cases' })}>Open mystery cases <ArrowRight size={13} /></button></div></section>;
}

function EvidenceView({ chapter, dossier, chapterEntity, onNavigate }) {
  const provenance = chapterEntity ? getClaimProvenanceProfile(chapterEntity.id, chapter) : null;
  const translations = getSuccessionTranslationVariantsAtChapter(chapter).filter((record) => record.chapter === chapter || record.entityIds.some((id) => dossier?.abilities?.some((ability) => ability.id === id) || dossier?.appearances?.some((entity) => entity.id === id)));
  return <section className="succession-reading-depth__evidence"><header><span>Evidence view</span><h2>Chapter {chapter}: claims before conclusions</h2><p>The narrative presentation is suppressed here. What remains is source coverage, canon/certainty state, direct chapter references, and relevant translation boundaries.</p></header><dl className="succession-reading-depth__metrics"><div><dt>Direct sources</dt><dd>{dossier?.sources?.length || 0}</dd></div><div><dt>Generated claims</dt><dd>{provenance?.claims.length || 0}</dd></div><div><dt>Unsupported</dt><dd>{provenance?.unsupported.length || 0}</dd></div><div><dt>Inferred</dt><dd>{provenance?.inferred.length || 0}</dd></div><div><dt>Translations / variants</dt><dd>{translations.length}</dd></div></dl><div className="succession-reading-depth__columns"><section><h3>Chapter sources</h3><ol>{(dossier?.sources || []).map((source) => <li key={source.id}><span>{source.chapter ? `Chapter ${source.chapter}` : labelize(source.sourceType)}</span><b>{source.name}</b><small>{source.note || source.summary}</small></li>)}</ol></section><section><h3>Claim provenance</h3><ol>{(provenance?.claims || []).map((claim) => <li key={claim.id}><span>{labelize(claim.provenanceState)}</span><b>{claim.label}</b><small>{claim.displayValue}</small></li>)}</ol></section><section><h3>Translation boundaries</h3><ol>{translations.map((record) => <li key={record.id}><span>{labelize(record.mechanicsImpact)} impact</span><b>{record.subject}</b><small>{record.note}</small></li>)}</ol></section></div><div className="succession-reading-depth__actions"><button type="button" onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence', entity: chapterEntity?.id })}>Open provenance workbench <ShieldCheck size={13} /></button><button type="button" onClick={() => onNavigate('reader', { chapter })}>Open primary reader <BookOpen size={13} /></button></div></section>;
}

export default function SuccessionReadingDepthWorkspace({ routeId = 'chapters', routeParams = {}, spoilerLimit = 417, onNavigate }) {
  const chapterEntities = getEntitiesByType('chapter').filter((record) => record.number <= spoilerLimit);
  const requested = Number(routeParams.chapter || routeParams.focus);
  const chapter = Number.isFinite(requested) && chapterEntities.some((record) => record.number === requested) ? requested : chapterEntities.at(-1)?.number || spoilerLimit;
  const active = ['quick', 'deep', 'evidence'].includes(routeParams.depth) ? routeParams.depth : 'standard';
  const dossier = getChapterStoryDossier(chapter);
  const change = getChapterWhatChanged(chapter);
  const chapterEntity = chapterEntities.find((record) => record.number === chapter) || null;

  return <div className={`succession-reading-depth is-${active}`}><header className="succession-reading-depth__header"><div><span>Reading depth</span><h2>Choose how much of the archive you want to see</h2><p>These are four materially different presentations of the same Chapter {chapter} boundary, not cosmetic font-size presets.</p></div><ModeNav routeId={routeId} chapter={chapter} active={active} onNavigate={onNavigate} /></header>{active === 'quick' && <QuickView chapter={chapter} dossier={dossier} change={change} onNavigate={onNavigate} />}{active === 'deep' && <DeepView chapter={chapter} dossier={dossier} change={change} onNavigate={onNavigate} />}{active === 'evidence' && <EvidenceView chapter={chapter} dossier={dossier} chapterEntity={chapterEntity} onNavigate={onNavigate} />}{active === 'standard' && <section className="succession-reading-depth__standard"><BookOpen size={18} aria-hidden="true" /><div><span>Standard dossier</span><h3>Full chapter / Story workspace below</h3><p>All maintained narrative, phase, event, cast, Nen, location, causal and source sections remain visible.</p></div></section>}</div>;
}
