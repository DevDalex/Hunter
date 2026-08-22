import { useMemo, useState } from 'react';
import { BookOpenCheck, BrainCircuit, Crown, Database, FileSearch, GitBranch, Library, Network, Scale, Search, ShieldQuestion, Swords, Users } from 'lucide-react';
import {
  getArchiveLedgers,
  getChapterForensicDossier,
  getContentExpansionSummary,
  getCrossLinkAtlas,
  getEntityById,
  getEvidenceQualityAudit,
  getFullPrinceDossiers,
  getInformationWarExpansion,
  getInvestigationDossiers,
  getKakinRoyalSystemReference,
  getMafiaDeepDossier,
  getMysteryEvidenceFiles,
  getReaderOrientation,
  getReferenceAppendices,
  getTroupeHisokaDeepDossier,
} from '../../data/succession/successionData';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionDeepArchiveWorkbench.css';

const views = Object.freeze([
  ['overview', 'Overview', Database], ['chapters', 'Chapter Forensics', FileSearch], ['princes', 'Prince Dossiers', Crown],
  ['investigations', 'Investigations', ShieldQuestion], ['criminal', 'Troupe & Mafia', Swords], ['kakin', 'Kakin System', Scale],
  ['knowledge', 'Information War', BrainCircuit], ['mysteries', 'Mystery Evidence', Search], ['crosslinks', 'Cross-links', Network],
  ['ledgers', 'Ledgers', Library], ['orientation', 'Reader Orientation', BookOpenCheck], ['evidence', 'Evidence Quality', GitBranch],
  ['appendices', 'Appendices', Users],
]);
const labelize = (v) => String(v || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const join = (v = []) => v.filter(Boolean).join(' · ') || 'None published';

function EntityButton({ id, onNavigate }) {
  const entity = id ? getEntityById(id) : null;
  if (!entity) return <span>{id || 'Unknown'}</span>;
  return <button type="button" className="succession-deep-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name || entity.title || entity.id}</button>;
}
function Stats({ rows }) { return <dl className="succession-deep-stats">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>; }
function Cards({ children }) { return <div className="succession-deep-grid">{children}</div>; }

function Overview({ chapter, onSelect }) {
  const s = getContentExpansionSummary(chapter);
  const cards = [
    ['chapters', `${s.chapterSchemaFields} chapter fields`, 'Scene, state, revelation, mystery, consequence, and cross-link forensics.'],
    ['princes', `${s.princeSchemaFields} prince fields`, `${s.princes} prince dossiers plus ${s.specialPrinceTrackers} special mechanical trackers.`],
    ['investigations', `${s.investigations} investigations`, 'Silent Majority, Beyond, Hisoka/Troupe, and the three-family mafia war.'],
    ['ledgers', `${s.ledgers} ledgers`, 'Deaths, curses, assignments, deception, objects, awakenings, special systems, and more.'],
    ['evidence', `${s.evidenceRules} evidence rules`, `${s.evidenceRecords} records checked for sourcing, uncertainty, and review boundaries.`],
    ['appendices', `${s.appendixFamilies} appendix families`, 'Dense reference lists without reviving retired standalone routes.'],
  ];
  return <Cards>{cards.map(([id, title, text]) => <article key={id}><span>{title}</span><p>{text}</p><button type="button" onClick={() => onSelect(id)}>Open</button></article>)}</Cards>;
}

function Chapters({ chapter, onNavigate }) {
  const d = getChapterForensicDossier(chapter);
  return <section><header><span>Normalized chapter dossier</span><h3>Chapter {d.chapter}: scene → state → consequence</h3><p>{d.whyItMatters}</p></header>
    <Stats rows={[["Events", d.eventIds.length], ["Characters", d.participantIds.length], ["Abilities", d.abilityIds.length], ["State changes", d.stateTransitions.length], ["Mysteries", d.affectedMysteries.length], ["Deaths", d.deaths.length]]} />
    <Cards><article><h4>Questions opened</h4><p>{join(d.questionsOpened)}</p></article><article><h4>Still unresolved</h4><p>{join(d.questionsStillOpen.slice(0, 10))}</p></article><article><h4>First appearances</h4><p>{join(d.firstAppearances.map((r) => r.name))}</p></article></Cards>
    <div className="succession-deep-schema">{d.schemaFields.map((f) => <span key={f}>{f}</span>)}</div>
    <div className="succession-deep-links">{d.participantIds.slice(0, 28).map((id) => <EntityButton id={id} onNavigate={onNavigate} key={id} />)}</div>
  </section>;
}

function Princes({ chapter, onNavigate }) {
  const rows = getFullPrinceDossiers(chapter);
  return <section><header><span>Royal dossiers</span><h3>All fourteen princes under one evidence schema</h3></header><div className="succession-deep-prince-grid">{rows.map((r) => <article key={r.prince.id}><span>Prince {r.order || '?'}</span><h4><EntityButton id={r.prince.id} onNavigate={onNavigate} /></h4><Stats rows={[["Life", labelize(r.state.life)], ["Last seen", r.state.latestAppearance ? `Ch. ${r.state.latestAppearance}` : 'Unknown'], ["Personnel", r.personnelIds.length], ["Threats in", r.incomingThreatIds.length], ["Nen", r.abilityIds.length], ["Knowledge", r.knownInformationIds.length]]} />{r.specialTracker && <><p>{r.specialTracker.canonicalFrame}</p><div className="succession-deep-tags">{r.specialTracker.focus.map((x) => <span key={x}>{x}</span>)}</div></>}</article>)}</div></section>;
}

function Investigations({ chapter, onNavigate }) {
  const rows = getInvestigationDossiers(chapter);
  return <section><header><span>Evidence-bounded investigations</span><h3>High-pressure case families</h3></header><Cards>{rows.map((r) => <article key={r.id}><span>{r.cases.length} cases</span><h4>{r.label}</h4><p>{r.rule}</p><div className="succession-deep-tags">{r.facets.map((x) => <span key={x}>{x}</span>)}</div><div className="succession-deep-links">{r.entities.map((e) => <EntityButton id={e.id} onNavigate={onNavigate} key={e.id} />)}</div></article>)}</Cards></section>;
}
function Criminal({ chapter }) {
  const troupe = getTroupeHisokaDeepDossier(chapter); const mafia = getMafiaDeepDossier(chapter);
  return <section><header><span>Criminal conflict</span><h3>Hisoka hunt + mafia war</h3></header><Cards><article><h4>Phantom Troupe / Hisoka</h4><Stats rows={[["Tracked members", troupe.members.length], ["Mystery cases", troupe.caseIds.length]]} /><p>{troupe.investigation.rule}</p></article><article><h4>Three-family war</h4><Stats rows={[["Families", mafia.families.length], ["Heil-Ly members", mafia.heilLy.members.length], ["Heil-Ly abilities", mafia.heilLy.abilityIds.length]]} /><p>{mafia.investigation.rule}</p></article></Cards></section>;
}
function Kakin({ chapter, onNavigate }) {
  const r = getKakinRoyalSystemReference(chapter);
  return <section><header><span>Royal system</span><h3>Dynasty, ritual, law, and security</h3></header><Stats rows={[["Queens", r.queens.length], ["Princes", r.princes.length], ["Protocols", r.protocols.length], ["Ritual cases", r.ritualCases.length]]} /><Cards>{r.reference.map((x) => <article key={x.term}><span>{x.category}</span><h4>{x.term}</h4><p>{x.summary}</p></article>)}</Cards><div className="succession-deep-links">{r.king && <EntityButton id={r.king.id} onNavigate={onNavigate} />}</div></section>;
}
function Knowledge({ chapter }) {
  const r = getInformationWarExpansion(chapter);
  return <section><header><span>Information asymmetry</span><h3>Who knows, misses, or falsely believes what</h3></header><Stats rows={[["Claims", r.totalClaims], ["Tracked topics", r.topics.length]]} /><Cards>{r.topics.map((x) => <article key={x.topic}><span>{x.count} claims</span><h4>{x.topic}</h4>{x.matches.slice(0, 4).map((m) => <p key={m.id}><b>{m.name}</b><br />Known: {join(m.knowerLabels)}<br />Hidden / false: {join(m.misinformedLabels)}</p>)}</article>)}</Cards></section>;
}
function Mysteries({ chapter }) {
  const rows = getMysteryEvidenceFiles(chapter);
  return <section><header><span>Mystery evidence</span><h3>Known facts, hypotheses, counterevidence, resolution tests</h3></header><div className="succession-deep-mystery-grid">{rows.map((r) => <article key={r.id}><span>{labelize(r.category)} · {labelize(r.status)}</span><h4>{r.title}</h4><p>{r.question}</p><Stats rows={[["Known", r.knownFacts.length], ["Unknown", r.unknowns.length], ["Candidates", r.candidates.length], ["For / against", `${r.evidenceForCount} / ${r.evidenceAgainstCount}`], ["Latest evidence", `Ch. ${r.latestEvidenceChapter}`]]} /></article>)}</div></section>;
}
function CrossLinks({ chapter }) {
  const r = getCrossLinkAtlas(chapter, chapter);
  return <section><header><span>Knowledge graph</span><h3>Chapter cross-link atlas</h3></header><Stats rows={[["Characters", r.characterIds.length], ["Organizations", r.organizationIds.length], ["Locations", r.locationIds.length], ["Abilities", r.abilityIds.length], ["Mysteries", r.mysteryCaseIds.length], ["Events", r.eventIds.length]]} /></section>;
}
function Ledgers({ chapter }) {
  const rows = getArchiveLedgers(chapter);
  return <section><header><span>Operational histories</span><h3>Moving facts become ledgers</h3></header><div className="succession-deep-ledger-grid">{rows.map((r) => <article key={r.id}><span>{r.count} records</span><h4>{r.label}</h4><p>{r.basis}</p><p>{join(r.preview.slice(0, 8))}</p></article>)}</div></section>;
}
function Orientation({ chapter }) {
  const [checkpoint, setCheckpoint] = useState(chapter); const r = getReaderOrientation(checkpoint);
  return <section><header><span>Reader orientation</span><h3>Resume from a remembered chapter</h3></header><div className="succession-deep-checkpoints">{r.availableCheckpoints.map((c) => <button type="button" className={c === r.chapter ? 'is-active' : ''} onClick={() => setCheckpoint(c)} key={c}>Ch. {c}</button>)}</div><Cards><article><h4>Prince snapshot</h4>{r.princeStatus.map((p) => <p key={p.name}><b>{p.name}</b> · {labelize(p.life)} · last Ch. {p.latestAppearance || '?'}</p>)}</article><article><h4>Open mysteries</h4>{r.unresolvedMysteries.slice(0, 12).map((m) => <p key={m.id}><b>{m.title}</b><br />{m.question}</p>)}</article><article><h4>Instant prompts</h4><div className="succession-deep-tags">{r.prompts.map((p) => <span key={p}>{p}</span>)}</div></article></Cards></section>;
}
function Evidence({ chapter, onNavigate }) {
  const r = getEvidenceQualityAudit(chapter);
  return <section><header><span>Provenance discipline</span><h3>Uncertainty stays visible</h3></header><Stats rows={[["Records", r.totalRecords], ["Unsourced", r.unsourced.length], ["Inference / theory", r.inferenceOrTheory.length], ["Explicit unknowns", r.explicitUnknowns.length], ["Stale boundaries", r.staleReviewBoundary.length]]} /><Cards>{r.rules.map((x) => <article key={x.id}><h4>{x.label}</h4><p>{x.rule}</p></article>)}</Cards>{!!r.unsourced.length && <div className="succession-deep-links">{r.unsourced.slice(0, 30).map((x) => <EntityButton id={x.entity.id} onNavigate={onNavigate} key={x.entity.id} />)}</div>}</section>;
}
function Appendices({ chapter }) {
  const r = getReferenceAppendices(chapter);
  return <section><header><span>Reference appendices</span><h3>Dense lookup material inside maintained scope</h3></header><Stats rows={[["People", r.dramatisPersonae.length], ["Aliases", r.aliases.length], ["Organizations", r.organizations.length], ["Nen users", r.knownNenUsers.length], ["Post-mortem", r.postMortemAbilities.length], ["Ongoing plans", r.ongoingPlans.length]]} /><div className="succession-deep-schema">{r.catalogue.map((x) => <span key={x}>{x}</span>)}</div></section>;
}

export default function SuccessionDeepArchiveWorkbench({ routeParams = {}, spoilerLimit = 417, onNavigate }) {
  const chapter = Math.min(spoilerLimit, Math.max(340, Number(routeParams.chapter) || spoilerLimit));
  const requestedView = routeParams.deepView;
  const [localView, setLocalView] = useState(requestedView || 'overview');
  const view = requestedView && views.some(([id]) => id === requestedView) ? requestedView : localView;
  const summary = useMemo(() => getContentExpansionSummary(chapter), [chapter]);
  const setView = (next) => { setLocalView(next); onNavigate?.('research', { ...routeParams, mode: 'cases', workspace: 'depth', deepView: next, chapter }); };
  return <section className="succession-deep-workbench"><header className="succession-deep-hero"><div><span>Content Depth Expansion</span><h2>Forensic reference through Chapter {chapter}</h2><p>All views derive from the same chapter-bounded canonical graph.</p></div><Stats rows={[["Chapter fields", summary.chapterSchemaFields], ["Prince fields", summary.princeSchemaFields], ["Ledgers", summary.ledgers], ["Mysteries", summary.mysteryFiles]]} /></header><nav className="succession-deep-tabs" aria-label="Deep archive views">{views.map(([id, label, Icon]) => <button type="button" className={view === id ? 'is-active' : ''} onClick={() => setView(id)} key={id}><Icon size={14} />{label}</button>)}</nav><div className="succession-deep-body">
    {view === 'overview' && <Overview chapter={chapter} onSelect={setView} />}{view === 'chapters' && <Chapters chapter={chapter} onNavigate={onNavigate} />}{view === 'princes' && <Princes chapter={chapter} onNavigate={onNavigate} />}{view === 'investigations' && <Investigations chapter={chapter} onNavigate={onNavigate} />}{view === 'criminal' && <Criminal chapter={chapter} />}{view === 'kakin' && <Kakin chapter={chapter} onNavigate={onNavigate} />}{view === 'knowledge' && <Knowledge chapter={chapter} />}{view === 'mysteries' && <Mysteries chapter={chapter} />}{view === 'crosslinks' && <CrossLinks chapter={chapter} />}{view === 'ledgers' && <Ledgers chapter={chapter} />}{view === 'orientation' && <Orientation chapter={chapter} />}{view === 'evidence' && <Evidence chapter={chapter} onNavigate={onNavigate} />}{view === 'appendices' && <Appendices chapter={chapter} />}
  </div></section>;
}
