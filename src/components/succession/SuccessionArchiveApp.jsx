import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Database, Images, Search, Users } from 'lucide-react';
import { ArchiveCard, ArchiveSection, EvidenceBadge, StatusPill } from '../ArchiveUI';
import {
  getEntitiesByType,
  getEntityById,
  getSourcesForEntity,
  searchArchiveProduct,
  successionArchiveValidation,
} from '../../data/succession/successionData';
import {
  getSuccessionArchiveRoute,
  successionArchiveGroups,
  successionArchiveRetiredTargets,
  successionArchiveRoutes,
} from '../../data/succession/archiveRoutes';
import SuccessionArchiveShell from './SuccessionArchiveShell';
import { PrincesWorkspace } from './SuccessionArchiveWorkspaces';
import { QueensWorkspace } from './SuccessionArchiveDeepWorkspaces';
import AssignmentsWorkspace from './SuccessionArchiveAssignmentWorkspace';
import ChapterStoryWorkspace from './SuccessionArchiveChapterStoryWorkspace';
import CharactersWorkspace from './SuccessionArchiveCharacterWorkspace';
import EvidenceWorkspace from './SuccessionArchiveEvidenceWorkspace';
import EventsWorkspace from './SuccessionArchiveEventWorkspace';
import GlossaryWorkspace from './SuccessionArchiveGlossaryWorkspace';
import GuardianBeastsWorkspace from './SuccessionArchiveGuardianBeastWorkspace';
import LocationsWorkspace from './SuccessionArchiveLocationWorkspace';
import NenWorkspace from './SuccessionArchiveNenWorkspace';
import OrganizationsWorkspace from './SuccessionArchiveOrganizationWorkspace';
import RelationshipsWorkspace from './SuccessionArchiveRelationshipWorkspace';
import StoryIntelligenceWorkspace from './SuccessionArchiveStoryIntelligenceWorkspace';
import SuccessionIntelligenceWorkbench from './SuccessionIntelligenceWorkbench';
import SuccessionMysteryCaseWorkbench from './SuccessionMysteryCaseWorkbench';
import SuccessionReadingDepthWorkspace from './SuccessionReadingDepthWorkspace';
import SuccessionWorkspaceRefinementDeck from './SuccessionWorkspaceRefinementDeck';
import { DomainEntityDetail } from './SuccessionArchiveExtendedWorkspaces';
import {
  ArchiveState,
  EntityBadge,
  EntityHeader,
  EntityLink,
  EntityVisual,
  RelatedEntities,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';
import {
  ArchiveCoverageReport,
  CoverageBoundaryProvider,
  RecordCoverageSections,
  RecordCurrencyStrip,
} from './SuccessionCoverageCurrency';
import './SuccessionArchiveSearch.css';

const FamilyTree = lazy(() => import('../FamilyTree'));
const BlackWhaleGuide = lazy(() => import('../BlackWhaleGuide'));
const TimelineWorkspace = lazy(() => import('../TimelineWorkspace'));

const Loading = ({ label }) => <ArchiveState kind="loading" title={`Opening ${label}`} description="Loading the preserved workspace inside the Succession Archive shell." />;
const characters = () => getEntitiesByType('character');
const organizations = () => getEntitiesByType('organization');
const relationships = () => getEntitiesByType('relationship');

const entitiesForRoute = (routeId) => {
  if (routeId === 'characters') return characters();
  if (routeId === 'princes') return characters().filter((entity) => (entity.roles || []).includes('prince'));
  if (routeId === 'queens') return characters().filter((entity) => (entity.roles || []).includes('queen'));
  if (routeId === 'bodyguards') return [...getEntitiesByType('assignment'), ...characters().filter((entity) => (entity.roles || []).includes('bodyguard'))];
  if (routeId === 'organizations') return organizations();
  if (routeId === 'locations') return getEntitiesByType('location');
  if (routeId === 'nen') return getEntitiesByType('ability');
  if (routeId === 'guardian-spirit-beasts') return getEntitiesByType('guardian-beast');
  if (routeId === 'events') return getEntitiesByType('event');
  if (routeId === 'relationships') return relationships();
  if (routeId === 'chapters') return getEntitiesByType('chapter');
  if (routeId === 'research') return getEntitiesByType('source');
  return [];
};

const sortedForRoute = (routeId, entities) => [...entities].sort((left, right) => {
  if (routeId === 'princes') return (left.princeOrder || 99) - (right.princeOrder || 99);
  if (routeId === 'queens') return Number.parseInt(left.queenRank, 10) - Number.parseInt(right.queenRank, 10);
  if (routeId === 'chapters') return (left.number || 0) - (right.number || 0);
  return String(left.name || left.id).localeCompare(String(right.name || right.id));
});

function ArchiveHome({ onNavigate, spoilerLimit }) {
  const stats = successionArchiveValidation.stats;
  const pictured = characters().filter((entity) => entity.media?.portrait).length;
  const featured = ['story', 'princes', 'reader', 'black-whale', 'research', 'glossary'];
  return <>
    <ArchiveSection id="succession-entry-points" kicker="Independent workspaces" title="One purpose per page." description="Story, reading, people, institutions, systems, records, research, and vocabulary live in focused routes while media provenance remains available through Search and Research."><div className="succession-home-grid">{featured.map((id) => { const route = getSuccessionArchiveRoute(id); return <ArchiveCard key={id} eyebrow={route.group} title={route.label} meta={route.description} onClick={() => onNavigate(id)}><span className="succession-card-action">Open workspace <ArrowRight size={14} /></span></ArchiveCard>; })}</div></ArchiveSection>
    <section className="succession-data-health" aria-labelledby="succession-data-health-title"><div><Database size={19} aria-hidden="true" /><span>Canonical catalogue</span><h2 id="succession-data-health-title">The current-arc archive is connected and validated.</h2><p>People, institutions, Nen systems, story intelligence, vocabulary, media provenance, and evidence share one chapter-bounded graph.</p></div><dl><div><dt>Entities</dt><dd>{stats.entities}</dd></div><div><dt>Characters</dt><dd>{stats.characters}</dd></div><div><dt>Portraits</dt><dd>{pictured}</dd></div><div><dt>Chapters</dt><dd>{stats.chapters}</dd></div></dl></section>
    <ArchiveCoverageReport boundary={spoilerLimit} onNavigate={onNavigate} />
    <ArchiveSection id="archive-directory" kicker="Route hierarchy" title="Archive directory" description="Every major subject has a stable destination, a bounded record set, and a presentation suited to that subject."><div className="succession-route-matrix">{successionArchiveGroups.map((group) => <section key={group}><h3>{group}</h3><div>{successionArchiveRoutes.filter((route) => route.group === group).map((route) => <button type="button" key={route.id} onClick={() => onNavigate(route.id)}><span>{route.label}</span><small>{route.status}</small><ArrowRight size={13} /></button>)}</div></section>)}</div></ArchiveSection>
  </>;
}

function EntityDetail({ entity, onNavigate }) {
  const sources = getSourcesForEntity(entity.id);
  return <div className="succession-entity-detail"><EntityHeader entity={entity} onNavigate={onNavigate} /><section className="succession-entity-detail__facts"><div><span>Stable ID</span><code>{entity.id}</code></div><div><span>Publication</span><b>{entity.publicationStatus || 'published'}</b></div><div><span>Canon layer</span><EvidenceBadge state={entity.canonLevel === 'inference' ? 'inferred' : entity.canonLevel === 'theory' ? 'unclear' : 'confirmed'}>{entity.canonLevel || 'canon'}</EvidenceBadge></div><div><span>Workspace</span><b>{getSuccessionArchiveRoute(entityWorkspaceTarget(entity)).label}</b></div></section>{!!sources.length && <section className="succession-source-list" aria-labelledby="entity-source-list-title"><header><span>Evidence</span><h3 id="entity-source-list-title">Source references</h3></header>{sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}<RelatedEntities entityId={entity.id} onNavigate={onNavigate} /></div>;
}

function DirectoryWorkspace({ routeId, routeParams, onNavigate }) {
  const [query, setQuery] = useState('');
  const entities = useMemo(() => sortedForRoute(routeId, entitiesForRoute(routeId)), [routeId]);
  const requestedPrince = Number(routeParams.prince);
  const selectedFromRoute = routeParams.entity ? getEntityById(routeParams.entity) : requestedPrince ? entities.find((entity) => entity.princeOrder === requestedPrince) : null;
  const selected = selectedFromRoute && entities.some((entity) => entity.id === selectedFromRoute.id) ? selectedFromRoute : null;
  const visible = useMemo(() => { const normalized = query.trim().toLocaleLowerCase(); if (!normalized) return entities; return entities.filter((entity) => `${entity.name || ''} ${entity.id} ${(entity.aliases || []).join(' ')} ${(entity.roles || []).join(' ')} ${(entity.tags || []).join(' ')} ${entity.summary || ''}`.toLocaleLowerCase().includes(normalized)); }, [entities, query]);
  const pictured = visible.filter((entity) => entity.media?.portrait).length;
  if (selected) return <EntityDetail entity={selected} onNavigate={onNavigate} />;
  if (!entities.length) return <ArchiveState kind="empty" title="Canonical records are not published here yet." description="The route will not manufacture missing lore or classifications. Source and provenance rules remain the publication gate." action={<button className="succession-button succession-button--quiet" onClick={() => onNavigate('research')}>Open research desk</button>} />;
  return <section className="succession-directory" aria-labelledby="succession-directory-title"><header><div><span>Canonical directory</span><h2 id="succession-directory-title">{visible.length} of {entities.length} records</h2><p><Users size={13} aria-hidden="true" /> Deduplicated named records <i>·</i> <Images size={13} aria-hidden="true" /> {pictured} available visuals</p></div><div className="succession-directory__tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Filter current workspace</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter this workspace…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label></div></header><div className="succession-entity-grid">{visible.map((entity) => <article key={entity.id}><EntityVisual entity={entity} /><div><EntityBadge entity={entity} compact /><StatusPill tone="neutral">{entity.status?.life || entity.canonLevel || 'canon'}</StatusPill></div><h3>{entity.name || entity.id}</h3><p>{entity.summary || 'Canonical record available.'}</p><footer><code>{entity.id}</code><EntityLink entity={entity} onNavigate={onNavigate}>Open record</EntityLink></footer></article>)}</div>{!visible.length && <ArchiveState kind="empty" title="No matching records" description="Clear the workspace filter or search the complete archive." />}</section>;
}

const searchGroupLabel = (domain) => domain.startsWith('story-') ? 'Story Intelligence' : domain === 'glossary' ? 'Glossary' : domain.replaceAll('-', ' ');

function SearchWorkspace({ onNavigate, spoilerLimit }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim() ? searchArchiveProduct(query, { limit: 60, chapter: spoilerLimit }) : [], [query, spoilerLimit]);
  const groups = useMemo(() => { const map = new Map(); for (const result of results) { const key = result.domain.startsWith('story-') ? 'story-intelligence' : result.domain; const current = map.get(key) || []; current.push(result); map.set(key, current); } return [...map.entries()]; }, [results]);
  return <section className="succession-search-workspace succession-search-complete" aria-labelledby="succession-search-title"><label><Search size={20} aria-hidden="true" /><span className="sr-only">Search canonical Succession Archive</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, alias, mechanic, condition, thread, term…" /></label><p role="status" aria-live="polite">{query ? `${results.length} result${results.length === 1 ? '' : 's'} through Chapter ${spoilerLimit}` : `Search every canonical domain available through Chapter ${spoilerLimit}.`}</p><div className="succession-search-complete__groups">{groups.map(([domain, records]) => <section key={domain} aria-labelledby={`search-group-${domain}`}><header><h2 id={`search-group-${domain}`}>{searchGroupLabel(domain)}</h2><span>{records.length}</span></header><div>{records.map((result) => <article key={result.id}>{result.entity ? <EntityVisual entity={result.entity} compact /> : result.resultType === 'glossary' ? <BookOpen size={22} aria-hidden="true" /> : <Search size={22} aria-hidden="true" />}<div><span>{result.domain.replaceAll('-', ' ')}</span><h3>{result.label}</h3><p>{result.summary}</p><small>{result.matchReason}</small></div><button type="button" onClick={() => onNavigate(result.route, result.params)}>Open <ArrowRight size={13} aria-hidden="true" /></button></article>)}</div></section>)}</div>{query && !results.length && <ArchiveState kind="empty" title="No canonical match inside this chapter boundary" description="Try an alias, synonym, organization, location, ability mechanic, unresolved question, or glossary term already documented by the selected chapter." />}</section>;
}

function FamilyTreeWorkspace({ spoilerLimit, onNavigate }) {
  const princes = entitiesForRoute('princes');
  return <Suspense fallback={<Loading label="royal family hierarchy" />}><div className="succession-royal-hierarchy-workspace">
    <h1 className="sr-only">Kakin Royal Family</h1>
    <FamilyTree spoilerLimit={spoilerLimit} onOpenPrince={(order) => { const entity = princes.find((record) => record.princeOrder === Number(order)); onNavigate('princes', entity ? { entity: entity.id } : {}); }} />
  </div></Suspense>;
}

function PreservedWorkspace({ routeId, routeParams, spoilerLimit, onNavigate }) {
  if (routeId === 'black-whale') return <Suspense fallback={<Loading label="Black Whale atlas" />}><BlackWhaleGuide initialQuery={routeParams.room || ''} initialLocationId={routeParams.entity || ''} spoilerLimit={spoilerLimit} onOpenWorldMap={(params = {}) => onNavigate('locations', params)} onOpenCanonicalLocation={(params) => onNavigate('locations', params)} /></Suspense>;
  if (routeId === 'timeline') return <Suspense fallback={<Loading label="voyage timeline" />}><TimelineWorkspace embedded requestedArc="succession-contest" requestedScope={routeParams.scope || 'events'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => onNavigate('timeline', params)} onOpenLocation={(room) => onNavigate('black-whale', { room })} /></Suspense>;
  return null;
}

export default function SuccessionArchiveApp({ routeTarget, routeParams, spoilerLimit, onSpoilerChange, onNavigate, onExitArchive, onOpenSearch, onIntent }) {
  const route = getSuccessionArchiveRoute(routeTarget);
  const navigate = (target, params = {}) => {
    const requestedTarget = successionArchiveRetiredTargets[target] || target;
    const linkedEntity = params.entity ? getEntityById(params.entity) : null;
    const preserveRoyalTarget = requestedTarget === 'princes' && (linkedEntity?.roles || []).includes('prince')
      || requestedTarget === 'queens' && (linkedEntity?.roles || []).includes('queen');
    const canonicalTarget = preserveRoyalTarget
      ? requestedTarget
      : linkedEntity?.entityType === 'character'
        ? 'characters'
        : linkedEntity?.entityType === 'organization'
          ? 'organizations'
          : linkedEntity?.entityType === 'ability'
            ? 'nen'
            : linkedEntity?.entityType === 'guardian-beast'
              ? 'guardian-spirit-beasts'
              : ['knowledge-record', 'protocol', 'object', 'document', 'evidence-item'].includes(linkedEntity?.entityType)
                ? 'research'
                : requestedTarget;
    onNavigate(canonicalTarget, params);
  };
  const treeView = route.id === 'princes' && routeParams.view === 'tree';
  const preserved = ['black-whale', 'timeline'].includes(route.id);
  const dedicated = new Set(['story', 'princes', 'queens', 'bodyguards', 'nen', 'guardian-spirit-beasts', 'events', 'relationships', 'chapters', 'characters', 'organizations', 'locations', 'research', 'glossary']);
  const readingDepthActive = ['story', 'chapters'].includes(route.id) && ['quick', 'deep', 'evidence'].includes(routeParams.depth);
  const requestedPrinceOrder = Number(routeParams.prince);
  const requestedChapterNumber = Number(routeParams.chapter);
  const selectedEntity = routeParams.entity
    ? getEntityById(routeParams.entity)
    : route.id === 'princes' && Number.isFinite(requestedPrinceOrder)
      ? characters().find((entity) => entity.princeOrder === requestedPrinceOrder) || null
      : route.id === 'chapters' && Number.isFinite(requestedChapterNumber)
        ? getEntitiesByType('chapter').find((entity) => entity.number === requestedChapterNumber) || null
        : null;
  const specializedRecordRoute = ['characters', 'princes', 'queens', 'chapters', 'events', 'locations', 'bodyguards', 'relationships', 'organizations', 'nen', 'guardian-spirit-beasts', 'research'].includes(route.id);
  const royalCharacterRoute = ['princes', 'queens'].includes(route.id);
  const showCharacterDossier = Boolean(selectedEntity?.entityType === 'character' && !treeView && !royalCharacterRoute);
  const showOrganizationDossier = Boolean(selectedEntity?.entityType === 'organization' && !treeView);
  const showAbilityDossier = Boolean(selectedEntity?.entityType === 'ability' && !treeView);
  const showGuardianBeastDossier = Boolean(selectedEntity?.entityType === 'guardian-beast' && !treeView);
  const showDomainDetail = Boolean(selectedEntity && !showCharacterDossier && !showOrganizationDossier && !showAbilityDossier && !showGuardianBeastDossier && !treeView && !specializedRecordRoute);
  const showRouteWorkspace = !showCharacterDossier && !showOrganizationDossier && !showAbilityDossier && !showGuardianBeastDossier && !showDomainDetail;

  const requestedCoverageChapter = Number(routeParams.chapter);
  const coverageBoundary = Number.isFinite(requestedCoverageChapter)
    ? Math.min(spoilerLimit, Math.max(340, requestedCoverageChapter))
    : spoilerLimit;
  const showSelectedCoverage = Boolean(selectedEntity && !treeView && !showDomainDetail && !['knowledge-record', 'protocol', 'object', 'document', 'evidence-item'].includes(selectedEntity.entityType));

  return <CoverageBoundaryProvider boundary={coverageBoundary}><SuccessionArchiveShell activeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onSpoilerChange={onSpoilerChange} onNavigate={navigate} onExitArchive={onExitArchive} onOpenSearch={onOpenSearch} onIntent={onIntent}>
    {route.id === 'archive' && <ArchiveHome onNavigate={navigate} spoilerLimit={spoilerLimit} />}
    {showSelectedCoverage && <section className="succession-selected-record-coverage" aria-label="Selected record chapter coverage">
      <RecordCurrencyStrip entity={selectedEntity} boundary={coverageBoundary} />
      <RecordCoverageSections entity={selectedEntity} boundary={coverageBoundary} />
    </section>}
    {!readingDepthActive && <SuccessionWorkspaceRefinementDeck routeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {['story', 'chapters'].includes(route.id) && <SuccessionReadingDepthWorkspace routeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {route.id === 'story' && !readingDepthActive && <StoryIntelligenceWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {route.id === 'search' && <SearchWorkspace onNavigate={navigate} spoilerLimit={spoilerLimit} />}
    {treeView && <FamilyTreeWorkspace spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showCharacterDossier && <CharactersWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showOrganizationDossier && <OrganizationsWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showAbilityDossier && <NenWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showGuardianBeastDossier && <GuardianBeastsWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showDomainDetail && <DomainEntityDetail entity={selectedEntity} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'characters' && <CharactersWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'princes' && !treeView && <PrincesWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'queens' && <QueensWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'bodyguards' && <AssignmentsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'organizations' && <OrganizationsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'locations' && <LocationsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'nen' && <NenWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'guardian-spirit-beasts' && <GuardianBeastsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'events' && <EventsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'relationships' && <RelationshipsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'chapters' && !readingDepthActive && <ChapterStoryWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'research' && <>
      <SuccessionMysteryCaseWorkbench routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />
      {routeParams.mode !== 'cases' && <SuccessionIntelligenceWorkbench routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
      <ArchiveCoverageReport boundary={spoilerLimit} onNavigate={navigate} compact />
      <EvidenceWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />
    </>}
    {showRouteWorkspace && route.id === 'glossary' && <GlossaryWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {preserved && <PreservedWorkspace routeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {!['archive', 'story', 'search'].includes(route.id) && !treeView && !preserved && !dedicated.has(route.id) && <DirectoryWorkspace routeId={route.id} routeParams={routeParams} onNavigate={navigate} />}
  </SuccessionArchiveShell></CoverageBoundaryProvider>;
}