import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileSearch,
  GitBranch,
  Library,
  Search,
  ShieldCheck,
} from 'lucide-react';
import {
  getChapterEvidenceProfile,
  getEntitiesByType,
  getEntityById,
  getEvidenceEntities,
  getFinalReleaseClosureReport,
  getFoundationClosureReport,
} from '../../data/succession/successionData';
import {
  EntityVisual,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import './SuccessionArchiveEvidenceWorkspace.css';

const normalize = (value) => String(value || '').trim().toLocaleLowerCase();
const titleCase = (value) => String(value || '').replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const coverageOrder = ['characters', 'organizations', 'abilities', 'locations', 'events', 'assignments', 'relationships', 'sources'];

function EvidenceEntityButton({ entity, onNavigate }) {
  if (!entity) return null;
  return <button type="button" className="succession-evidence-entity" onClick={() => onNavigate(entityWorkspaceTarget(entity), { entity: entity.id })}>
    <EntityVisual entity={entity} compact />
    <span><b>{entity.name}</b><small>{titleCase(entity.entityType)}</small></span>
    <ArrowRight size={13} aria-hidden="true" />
  </button>;
}

function GapList({ title, ids, icon: Icon = AlertTriangle, onNavigate }) {
  const entities = getEvidenceEntities(ids);
  return <section className="succession-evidence-gap-list">
    <header><Icon size={17} aria-hidden="true" /><div><span>Foundation review</span><h3>{title}</h3></div><b>{ids.length}</b></header>
    {entities.length ? <div>{entities.slice(0, 24).map((entity) => <EvidenceEntityButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</div> : <p>No records are currently in this gap category.</p>}
    {ids.length > entities.length && <small>{ids.length - entities.length} non-entity chapter or source records are tracked separately.</small>}
  </section>;
}

export default function SuccessionArchiveEvidenceWorkspace({ routeParams = {}, spoilerLimit = 414, onNavigate }) {
  const sources = useMemo(() => getEntitiesByType('source'), []);
  const chapters = useMemo(() => getEntitiesByType('chapter').filter((chapter) => chapter.number <= spoilerLimit).sort((left, right) => left.number - right.number), [spoilerLimit]);
  const closure = useMemo(() => getFoundationClosureReport(), []);
  const finalRelease = useMemo(() => getFinalReleaseClosureReport(), []);
  const requestedChapter = Number(routeParams.chapter);
  const [selectedChapter, setSelectedChapter] = useState(requestedChapter || chapters.at(-1)?.number || 414);
  const [query, setQuery] = useState(routeParams.search || '');
  const [sourceType, setSourceType] = useState(routeParams.type || 'all');
  const [gapMode, setGapMode] = useState(routeParams.gap || 'all');

  useEffect(() => {
    if (requestedChapter && chapters.some((chapter) => chapter.number === requestedChapter)) setSelectedChapter(requestedChapter);
  }, [chapters, requestedChapter]);

  useEffect(() => {
    setSelectedChapter((current) => Math.min(spoilerLimit, Number(current) || spoilerLimit));
  }, [spoilerLimit]);

  const profile = getChapterEvidenceProfile(selectedChapter);
  const sourceTypes = useMemo(() => [...new Set(sources.map((source) => source.sourceType))].sort(), [sources]);
  const visibleSources = useMemo(() => sources.filter((source) => {
    const matchesType = sourceType === 'all' || source.sourceType === sourceType;
    const searchable = normalize(`${source.name} ${source.summary} ${source.note} ${source.chapter || ''}`);
    return matchesType && (!query.trim() || searchable.includes(normalize(query)));
  }), [query, sourceType, sources]);

  const linkedGroups = profile ? [
    ['Characters', profile.characterIds],
    ['Organizations', profile.organizationIds],
    ['Abilities', profile.abilityIds],
    ['Locations', profile.locationIds],
    ['Events', profile.eventIds],
    ['Assignments', profile.assignmentIds],
    ['Relationships', profile.relationshipIds],
  ].map(([label, ids]) => ({ label, ids, entities: getEvidenceEntities(ids) })).filter((group) => group.entities.length) : [];

  const displayedGapIds = gapMode === 'orphans'
    ? closure.orphanedEntityIds
    : gapMode === 'sources'
      ? [...closure.missingSourceEntityIds, ...closure.brokenSourceEntityIds]
      : [];
  const readinessLabel = closure.readyForBatch2 ? 'Foundation closed' : 'Closure blocked';
  const batchStatus = Object.entries(finalRelease.batches || {});
  const externalGateKeys = ['performanceBuild', 'browserInteractionQa', 'browserAccessibilityQa', 'cloudflareDeployment'];

  const openChapter = (chapter) => {
    setSelectedChapter(chapter);
    onNavigate('research', { chapter });
  };

  return <div className="succession-evidence-workspace">
    <section className={`succession-evidence-hero is-${closure.readyForBatch2 ? 'ready' : 'blocked'}`}>
      <div><span><ShieldCheck size={16} aria-hidden="true" /> Batch 1.6 · Evidence Graph and Foundation Closure</span><h2>Chapter provenance, graph coverage, unresolved claims, and release gates</h2><p>Every chapter profile is derived from the canonical event, assignment, relationship, ability, location, organization, character, and source records. Missing evidence remains visible instead of being converted into invented certainty.</p></div>
      <dl><div><dt>Status</dt><dd>{readinessLabel}</dd></div><div><dt>Critical gaps</dt><dd>{closure.criticalGapCount}</dd></div><div><dt>Average provenance</dt><dd>{closure.averageChapterScore}% · {closure.averageChapterGrade}</dd></div><div><dt>Boundary</dt><dd>Ch. {closure.asOfChapter}</dd></div></dl>
    </section>

    <section className={`succession-release-candidate is-${finalRelease.closureReady ? 'ready' : 'blocked'}`} aria-labelledby="succession-release-candidate-title">
      <header>{finalRelease.closureReady ? <CheckCircle2 size={20} aria-hidden="true" /> : <AlertTriangle size={20} aria-hidden="true" />}<div><span>Batch 5 · Final Product Closure</span><h3 id="succession-release-candidate-title">{finalRelease.closureReady ? 'Static architecture is a release candidate' : 'Final product closure remains open'}</h3></div><b>{titleCase(finalRelease.status)}</b></header>
      <p>{finalRelease.promotionRule}</p>
      <div className="succession-release-candidate__inventory">
        <article><span>Authoritative workspaces</span><b>{finalRelease.productInventory?.counts.authoritativeWorkspaces || 0}</b></article>
        <article><span>Preserved tools</span><b>{finalRelease.productInventory?.counts.preservedVisualTools || 0}</b></article>
        <article><span>Legacy aliases</span><b>{finalRelease.productInventory?.counts.legacyAliases || 0}</b></article>
        <article><span>Removed implementation classes</span><b>{finalRelease.productInventory?.counts.removedImplementationClasses || 0}</b></article>
      </div>
      <div className="succession-release-candidate__batches">{batchStatus.map(([id, record]) => <article className={`is-${record.status}`} key={id}><span>{titleCase(id)}</span><b>{titleCase(record.status)}</b></article>)}</div>
      <div className="succession-release-candidate__external"><span>External gates required for closed status</span><div>{externalGateKeys.map((key) => <article key={key}><b>{titleCase(key)}</b><small>{titleCase(finalRelease.releaseGates[key])}</small></article>)}</div></div>
    </section>

    <section className="succession-foundation-closure" aria-labelledby="succession-foundation-closure-title">
      <header>{closure.readyForBatch2 ? <CheckCircle2 size={20} aria-hidden="true" /> : <AlertTriangle size={20} aria-hidden="true" />}<div><span>Closure gate</span><h3 id="succession-foundation-closure-title">{closure.readyForBatch2 ? 'Canonical foundation satisfies the critical evidence gates' : 'Critical evidence gaps still block Batch 1 closure'}</h3></div></header>
      <div className="succession-foundation-closure__domains">{Object.entries(closure.domainCounts).map(([domain, count]) => <article key={domain}><span>{titleCase(domain)}</span><b>{count}</b></article>)}</div>
      <dl><div><dt>Chapter profiles</dt><dd>{closure.chapterCount}</dd></div><div><dt>Missing primary sources</dt><dd>{closure.chaptersMissingPrimarySource.length}</dd></div><div><dt>Missing reader bridges</dt><dd>{closure.chaptersMissingReaderBridge.length}</dd></div><div><dt>Structurally sparse chapters</dt><dd>{closure.chaptersWithoutStructuredLinks.length}</dd></div><div><dt>Orphaned published records</dt><dd>{closure.orphanedEntityIds.length}</dd></div><div><dt>Broken source records</dt><dd>{closure.brokenSourceEntityIds.length}</dd></div></dl>
    </section>

    <section className="succession-evidence-chapter" aria-labelledby="succession-evidence-chapter-title">
      <header><BookOpen size={18} aria-hidden="true" /><div><span>Chapter evidence snapshot</span><h3 id="succession-evidence-chapter-title">Canonical links and provenance for Chapter {selectedChapter}</h3></div><label><span>Chapter</span><select value={selectedChapter} onChange={(event) => openChapter(Number(event.target.value))}>{chapters.map((chapter) => <option value={chapter.number} key={chapter.id}>{chapter.number} · {chapter.name.replace(/^Chapter \d+ ·?\s*/, '')}</option>)}</select></label></header>
      {profile && <>
        <div className="succession-evidence-chapter__score"><div><b>{profile.provenance.score}%</b><span>Grade {profile.provenance.grade}</span></div><dl>{coverageOrder.map((key) => <div key={key}><dt>{titleCase(key)}</dt><dd>{profile.coverage[key]}</dd></div>)}</dl></div>
        {!!profile.provenance.gaps.length && <div className="succession-evidence-chapter__warnings"><AlertTriangle size={17} aria-hidden="true" /><div><b>Profile gaps</b><span>{profile.provenance.gaps.map(titleCase).join(' · ')}</span></div></div>}
        <div className="succession-evidence-chapter__actions"><button type="button" onClick={() => onNavigate('chapters', { chapter: selectedChapter })}>Open Chapter Record <ArrowRight size={13} /></button><button type="button" onClick={() => onNavigate('reader', { chapter: selectedChapter })}>Open Reader <BookOpen size={13} /></button></div>
        <div className="succession-evidence-linked-groups">{linkedGroups.map((group) => <section key={group.label}><header><GitBranch size={16} aria-hidden="true" /><div><span>Linked domain</span><h4>{group.label}</h4></div><b>{group.entities.length}</b></header><div>{group.entities.slice(0, 18).map((entity) => <EvidenceEntityButton entity={entity} onNavigate={onNavigate} key={entity.id} />)}</div></section>)}</div>
        {!!profile.openQuestions.length && <section className="succession-evidence-open-questions"><header><AlertTriangle size={17} aria-hidden="true" /><div><span>Unresolved claims</span><h4>Questions explicitly retained at this chapter</h4></div></header><ul>{profile.openQuestions.map((question) => <li key={question}>{question}</li>)}</ul></section>}
        {!!profile.primarySourceIds.length && <section className="succession-evidence-primary-sources"><header><Library size={17} aria-hidden="true" /><div><span>Primary evidence</span><h4>Chapter source records</h4></div></header><div>{getEvidenceEntities(profile.primarySourceIds).map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</div></section>}
      </>}
    </section>

    <section className="succession-evidence-gap-controls" aria-labelledby="succession-evidence-gap-title"><header><FileSearch size={18} aria-hidden="true" /><div><span>Gap ledger</span><h3 id="succession-evidence-gap-title">Inspect non-critical coverage debt</h3></div></header><div>{[['all', 'Summary'], ['orphans', 'Orphaned records'], ['sources', 'Source failures']].map(([id, label]) => <button type="button" className={gapMode === id ? 'is-active' : ''} onClick={() => setGapMode(id)} key={id}>{label}</button>)}</div></section>
    {gapMode === 'all' ? <div className="succession-evidence-gap-grid"><GapList title="Published records without chapter graph links" ids={closure.orphanedEntityIds} onNavigate={onNavigate} /><GapList title="Missing or broken source references" ids={[...closure.missingSourceEntityIds, ...closure.brokenSourceEntityIds]} onNavigate={onNavigate} /></div> : <GapList title={gapMode === 'orphans' ? 'Published records without chapter graph links' : 'Missing or broken source references'} ids={displayedGapIds} onNavigate={onNavigate} />}

    <section className="succession-evidence-source-catalogue" aria-labelledby="succession-evidence-source-title">
      <header><Library size={18} aria-hidden="true" /><div><span>Source catalogue</span><h3 id="succession-evidence-source-title">Search maintained chapter and reference records</h3></div><b>{visibleSources.length}</b></header>
      <div className="succession-evidence-source-catalogue__tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Search evidence sources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chapter, source, evidence note…" /></label><select value={sourceType} onChange={(event) => setSourceType(event.target.value)}><option value="all">All source types</option>{sourceTypes.map((type) => <option value={type} key={type}>{titleCase(type)}</option>)}</select></div>
      <div>{visibleSources.map((source) => <article key={source.id}><span>{titleCase(source.sourceType)}{source.chapter ? ` · Ch. ${source.chapter}` : ''}</span><h4>{source.name}</h4><p>{source.note || source.summary}</p><footer><button type="button" onClick={() => onNavigate('research', { entity: source.id })}>Open record</button>{source.chapter && <button type="button" onClick={() => openChapter(source.chapter)}>Evidence profile</button>}</footer></article>)}</div>
    </section>
  </div>;
}
