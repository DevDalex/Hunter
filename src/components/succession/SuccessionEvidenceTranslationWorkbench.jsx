import { ArrowLeft, ArrowRight, BookMarked, FileSearch, Languages, ShieldCheck, TriangleAlert } from 'lucide-react';
import {
  getClaimProvenanceProfile,
  getEntityById,
  getProvenanceCoverageReport,
} from '../../data/succession/successionData';
import {
  getSuccessionTranslationSummary,
  getSuccessionTranslationVariantsAtChapter,
} from '../../data/succession/contentDepthTranslationVariants';
import { entityWorkspaceTarget } from './SuccessionArchivePrimitives';
import './SuccessionEvidenceTranslationWorkbench.css';

const labelize = (value) => String(value || 'unknown').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function EntityButton({ entity, onNavigate }) {
  if (!entity) return null;
  return <button type="button" className="succession-provenance-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>{entity.name}<ArrowRight size={11} aria-hidden="true" /></button>;
}

function ClaimDetail({ profile, onNavigate }) {
  const entity = getEntityById(profile.entity.id);
  return <section className="succession-provenance-detail">
    <button type="button" onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence' })}><ArrowLeft size={13} aria-hidden="true" /> Back to provenance coverage</button>
    <header><span>Claim-level provenance · {profile.coverage}% sourced</span><h3>{profile.entity.name}</h3><p>{profile.note}</p><EntityButton entity={entity} onNavigate={onNavigate} /></header>
    <dl className="succession-provenance-stats"><div><dt>Claims</dt><dd>{profile.claims.length}</dd></div><div><dt>Sources</dt><dd>{profile.sources.length}</dd></div><div><dt>Unsupported</dt><dd>{profile.unsupported.length}</dd></div><div><dt>Inferred</dt><dd>{profile.inferred.length}</dd></div></dl>
    <div className="succession-provenance-claims">{profile.claims.map((claim) => <article key={claim.id} className={claim.sources.length ? '' : 'is-unsupported'}>
      <header><span>{claim.label}</span><b>{labelize(claim.provenanceState)}</b></header>
      <p>{claim.displayValue}</p>
      <dl><div><dt>Canon</dt><dd>{labelize(claim.canonLevel)}</dd></div><div><dt>Certainty</dt><dd>{labelize(claim.certainty)}</dd></div><div><dt>Source mode</dt><dd>{claim.inheritedSourceChain ? 'Inherited entity source chain' : 'Explicit claim sources'}</dd></div></dl>
      <div className="succession-provenance-sources">{claim.sources.length ? claim.sources.map((source) => <span key={source.id}>{source.name}</span>) : <span className="is-warning"><TriangleAlert size={12} aria-hidden="true" /> No bounded source resolved</span>}</div>
    </article>)}</div>
  </section>;
}

function ProvenanceView({ chapter, routeParams, onNavigate }) {
  const report = getProvenanceCoverageReport(chapter);
  const selected = routeParams.entity ? getClaimProvenanceProfile(routeParams.entity, chapter) : null;
  if (selected) return <ClaimDetail profile={selected} onNavigate={onNavigate} />;
  return <section><header className="succession-provenance-head"><span>Research evidence graph</span><h3>Claim-level provenance coverage</h3><p>Generated field claims inherit a canonical entity’s source chain until an explicit claim-level citation is available. Unsupported claims remain visible as debt instead of being silently treated as sourced.</p></header><dl className="succession-provenance-stats"><div><dt>Coverage</dt><dd>{report.coverage}%</dd></div><div><dt>Claims</dt><dd>{report.claims}</dd></div><div><dt>Explicit claim sources</dt><dd>{report.explicitClaimSources}</dd></div><div><dt>Inherited sources</dt><dd>{report.inheritedEntitySources}</dd></div><div><dt>Unsupported</dt><dd>{report.unsupported}</dd></div></dl><h4 className="succession-provenance-subhead">Weakest coverage first</h4><div className="succession-provenance-grid">{report.weakest.map((profile) => <article key={profile.entity.id}><FileSearch size={18} aria-hidden="true" /><span>{profile.coverage}% coverage</span><h4>{profile.entity.name}</h4><p>{profile.claims.length} claims · {profile.unsupported.length} unsupported · {profile.inferred.length} inferred</p><button type="button" onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence', entity: profile.entity.id })}>Inspect claims <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>;
}

function TranslationView({ chapter, onNavigate }) {
  const records = getSuccessionTranslationVariantsAtChapter(chapter);
  const summary = getSuccessionTranslationSummary(chapter);
  return <section><header className="succession-provenance-head"><span>Translation / naming variants</span><h3>Meaning-changing differences stay separate from spelling differences.</h3><p>The archive records what it actually has. When a differing translation is known to exist but its exact wording is not stored, the missing wording remains explicitly unquoted rather than reconstructed.</p></header><dl className="succession-provenance-stats"><div><dt>Variants</dt><dd>{summary.records}</dd></div><div><dt>Mechanics impact</dt><dd>{summary.mechanicsImpacting}</dd></div><div><dt>Exact alternate not archived</dt><dd>{summary.exactAlternateUnarchived}</dd></div></dl><div className="succession-provenance-grid">{records.map((record) => <article key={record.id} className={record.mechanicsImpact !== 'none' ? 'is-mechanics' : ''}><Languages size={18} aria-hidden="true" /><span>{labelize(record.category)} · impact {labelize(record.mechanicsImpact)}</span><h4>{record.subject}</h4><dl><div><dt>Archive rendering</dt><dd>{record.adopted}</dd></div><div><dt>Alternate / variant</dt><dd>{record.alternate}</dd></div><div><dt>Boundary note</dt><dd>{record.note}</dd></div></dl><div className="succession-provenance-sources">{record.entityIds.map((id) => { const entity = getEntityById(id); return entity ? <EntityButton entity={entity} onNavigate={onNavigate} key={id} /> : null; })}</div></article>)}</div></section>;
}

export default function SuccessionEvidenceTranslationWorkbench({ routeParams = {}, spoilerLimit = 417, onNavigate }) {
  const active = routeParams.mode === 'cases' && routeParams.workspace === 'evidence';
  const chapter = Math.min(spoilerLimit, Math.max(340, Number(routeParams.chapter) || spoilerLimit));
  const view = routeParams.evidenceView === 'translations' ? 'translations' : 'provenance';
  const summary = getSuccessionTranslationSummary(chapter);
  const provenance = getProvenanceCoverageReport(chapter);

  if (!active) return <section className="succession-provenance-entry"><ShieldCheck size={22} aria-hidden="true" /><div><span>Content Depth · Evidence integrity</span><h3>Claims, sources, and translation boundaries.</h3><p>{provenance.coverage}% claim-source coverage through Chapter {chapter}, with {summary.records} maintained translation/naming variants and {summary.mechanicsImpacting} mechanics-impacting discrepancy.</p></div><button type="button" onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence' })}>Open evidence workbench <ArrowRight size={13} /></button></section>;

  return <section className="succession-provenance-workbench"><header className="succession-provenance-hero"><div><span><BookMarked size={14} aria-hidden="true" /> Evidence integrity · Chapter {chapter}</span><h2>Provenance and translation intelligence</h2><p>Claim sources, inherited provenance, unsupported debt, semantics-changing translations, and canonicalization variants in one evidence-bounded research surface.</p></div></header><nav className="succession-provenance-tabs" aria-label="Evidence integrity views"><button type="button" className={view === 'provenance' ? 'is-active' : ''} onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence', evidenceView: 'provenance' })}><ShieldCheck size={14} aria-hidden="true" /> Provenance</button><button type="button" className={view === 'translations' ? 'is-active' : ''} onClick={() => onNavigate('research', { mode: 'cases', workspace: 'evidence', evidenceView: 'translations' })}><Languages size={14} aria-hidden="true" /> Translation variants</button><button type="button" onClick={() => onNavigate('research', { mode: 'overview' })}><ArrowLeft size={14} aria-hidden="true" /> Research overview</button></nav><div className="succession-provenance-body">{view === 'provenance' ? <ProvenanceView chapter={chapter} routeParams={routeParams} onNavigate={onNavigate} /> : <TranslationView chapter={chapter} onNavigate={onNavigate} />}</div></section>;
}
