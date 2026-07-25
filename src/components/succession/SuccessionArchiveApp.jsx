import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, Database, Images, Search, Users } from 'lucide-react';
import { ArchiveCard, ArchiveSection, EvidenceBadge, StatusPill } from '../ArchiveUI';
import {
  getEntitiesByType,
  getEntityById,
  getSourcesForEntity,
  searchSuccessionArchive,
  successionArchiveValidation,
} from '../../data/succession/successionData';
import {
  getSuccessionArchiveRoute,
  successionArchiveGroups,
  successionArchiveRoutes,
} from '../../data/succession/archiveRoutes';
import SuccessionArchiveShell from './SuccessionArchiveShell';
import {
  MafiaWorkspace,
  PrincesWorkspace,
} from './SuccessionArchiveWorkspaces';
import {
  BodyStatesWorkspace,
  QueensWorkspace,
} from './SuccessionArchiveDeepWorkspaces';
import AssignmentsWorkspace from './SuccessionArchiveAssignmentWorkspace';
import ChapterStoryWorkspace from './SuccessionArchiveChapterStoryWorkspace';
import CharactersWorkspace from './SuccessionArchiveCharacterWorkspace';
import EvidenceWorkspace from './SuccessionArchiveEvidenceWorkspace';
import EventsWorkspace from './SuccessionArchiveEventWorkspace';
import GuardianBeastsWorkspace from './SuccessionArchiveGuardianBeastWorkspace';
import LocationsWorkspace from './SuccessionArchiveLocationWorkspace';
import NenWorkspace from './SuccessionArchiveNenWorkspace';
import OrganizationsWorkspace from './SuccessionArchiveOrganizationWorkspace';
import RelationshipsWorkspace from './SuccessionArchiveRelationshipWorkspace';
import StoryIntelligenceWorkspace from './SuccessionArchiveStoryIntelligenceWorkspace';
import {
  DomainEntityDetail,
  GlossaryWorkspace,
  HuntersWorkspace,
  MediaWorkspace,
  MilitaryWorkspace,
  PoliticsWorkspace,
} from './SuccessionArchiveExtendedWorkspaces';
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
  if (routeId === 'bodyguards') return [
    ...getEntitiesByType('assignment'),
    ...characters().filter((entity) => (entity.roles || []).includes('bodyguard')),
  ];
  if (routeId === 'hunters') return characters().filter((entity) => (entity.roles || []).some((role) => role === 'hunter' || role === 'zodiac'));
  if (routeId === 'mafia') return [
    ...organizations().filter((entity) => entity.organizationType === 'mafia-family'),
    ...characters().filter((entity) => (entity.roles || []).some((role) => role === 'mafia-member' || role === 'mafia-boss' || role === 'mafia-underboss')),
  ];
  if (routeId === 'military') return [
    ...organizations().filter((entity) => entity.organizationType === 'military' || entity.id === 'organization:kakin-justice-bureau'),
    ...characters().filter((entity) => (entity.roles || []).some((role) => role === 'military' || role === 'justice-official')),
  ];
  if (routeId === 'organizations') return organizations();
  if (routeId === 'politics') return [
    ...organizations().filter((entity) => entity.organizationType === 'royal-house' || entity.organizationType === 'government-agency'),
    ...relationships().filter((entity) => entity.relationshipType === 'political' || entity.relationshipType === 'family'),
  ];
  if (routeId === 'locations') return getEntitiesByType('location');
  if (routeId === 'nen') return getEntitiesByType('ability');
  if (routeId === 'guardian-spirit-beasts') return getEntitiesByType('guardian-beast');
  if (routeId === 'events') return getEntitiesByType('event');
  if (routeId === 'deaths') return characters().filter((entity) => entity.status?.life === 'dead');
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

function ArchiveHome({ onNavigate }) {
  const stats = successionArchiveValidation.stats;
  const pictured = characters().filter((entity) => entity.media?.portrait).length;
  const featured = ['story', 'princes', 'reader', 'black-whale', 'research', 'glossary'];
  return <>
    <ArchiveSection id="succession-entry-points" kicker="Independent workspaces" title="One purpose per page." description="Story, reading, people, systems, records, research, vocabulary, and media now live in dedicated routes while sharing one canonical graph.">
      <div className="succession-home-grid">
        {featured.map((id) => {
          const route = getSuccessionArchiveRoute(id);
          return <ArchiveCard key={id} eyebrow={route.group} title={route.label} meta={route.description} onClick={() => onNavigate(id)}>
            <span className="succession-card-action">Open workspace <ArrowRight size={14} /></span>
          </ArchiveCard>;
        })}
      </div>
    </ArchiveSection>

    <section className="succession-data-health" aria-labelledby="succession-data-health-title">
      <div><Database size={19} aria-hidden="true" /><span>Canonical catalogue</span><h2 id="succession-data-health-title">The current-arc roster is connected and validated.</h2><p>Named records are deduplicated, placeholders are excluded, roles and affiliations drive each directory, and available Hunterpedia visuals are reused consistently.</p></div>
      <dl>
        <div><dt>Entities</dt><dd>{stats.entities}</dd></div>
        <div><dt>Characters</dt><dd>{stats.characters}</dd></div>
        <div><dt>Portraits</dt><dd>{pictured}</dd></div>
        <div><dt>Chapters</dt><dd>{stats.chapters}</dd></div>
      </dl>
    </section>

    <ArchiveSection id="archive-directory" kicker="Route hierarchy" title="Archive directory" description="Every major subject has a stable destination, a bounded record set, and a presentation suited to that subject.">
      <div className="succession-route-matrix">
        {successionArchiveGroups.map((group) => <section key={group}><h3>{group}</h3><div>{successionArchiveRoutes.filter((route) => route.group === group).map((route) => <button type="button" key={route.id} onClick={() => onNavigate(route.id)}><span>{route.label}</span><small>{route.status}</small><ArrowRight size={13} /></button>)}</div></section>)}
      </div>
    </ArchiveSection>
  </>;
}

function EntityDetail({ entity, onNavigate }) {
  const sources = getSourcesForEntity(entity.id);
  return <div className="succession-entity-detail">
    <EntityHeader entity={entity} onNavigate={onNavigate} />
    <section className="succession-entity-detail__facts">
      <div><span>Stable ID</span><code>{entity.id}</code></div>
      <div><span>Publication</span><b>{entity.publicationStatus || 'published'}</b></div>
      <div><span>Canon layer</span><EvidenceBadge state={entity.canonLevel === 'inference' ? 'inferred' : entity.canonLevel === 'theory' ? 'unclear' : 'confirmed'}>{entity.canonLevel || 'canon'}</EvidenceBadge></div>
      <div><span>Workspace</span><b>{getSuccessionArchiveRoute(entityWorkspaceTarget(entity)).label}</b></div>
    </section>
    {!!sources.length && <section className="succession-source-list" aria-labelledby="entity-source-list-title"><header><span>Evidence</span><h3 id="entity-source-list-title">Source references</h3></header>{sources.map((source) => <SourceReference source={source} onNavigate={onNavigate} key={source.id} />)}</section>}
    <RelatedEntities entityId={entity.id} onNavigate={onNavigate} />
  </div>;
}

function DirectoryWorkspace({ routeId, routeParams, onNavigate }) {
  const [query, setQuery] = useState('');
  const entities = useMemo(() => sortedForRoute(routeId, entitiesForRoute(routeId)), [routeId]);
  const requestedPrince = Number(routeParams.prince);
  const selectedFromRoute = routeParams.entity ? getEntityById(routeParams.entity) : requestedPrince ? entities.find((entity) => entity.princeOrder === requestedPrince) : null;
  const selected = selectedFromRoute && entities.some((entity) => entity.id === selectedFromRoute.id) ? selectedFromRoute : null;
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return entities;
    return entities.filter((entity) => `${entity.name || ''} ${entity.id} ${(entity.aliases || []).join(' ')} ${(entity.roles || []).join(' ')} ${(entity.tags || []).join(' ')} ${entity.summary || ''}`.toLocaleLowerCase().includes(normalized));
  }, [entities, query]);
  const pictured = visible.filter((entity) => entity.media?.portrait).length;

  if (selected) return <EntityDetail entity={selected} onNavigate={onNavigate} />;
  if (!entities.length) return <ArchiveState kind="empty" title="Canonical records are not published here yet." description="The route will not manufacture missing lore or classifications. Source and provenance rules remain the publication gate." action={<button className="succession-button succession-button--quiet" onClick={() => onNavigate('research')}>Open research desk</button>} />;

  return <section className="succession-directory" aria-labelledby="succession-directory-title">
    <header>
      <div><span>Canonical directory</span><h2 id="succession-directory-title">{visible.length} of {entities.length} records</h2><p><Users size={13} aria-hidden="true" /> Deduplicated named records <i>·</i> <Images size={13} aria-hidden="true" /> {pictured} available visuals</p></div>
      <div className="succession-directory__tools"><label><Search size={16} aria-hidden="true" /><span className="sr-only">Filter current workspace</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter this workspace…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label></div>
    </header>
    <div className="succession-entity-grid">{visible.map((entity) => <article key={entity.id}><EntityVisual entity={entity} /><div><EntityBadge entity={entity} compact /><StatusPill tone="neutral">{entity.status?.life || entity.canonLevel || 'canon'}</StatusPill></div><h3>{entity.name || entity.id}</h3><p>{entity.summary || 'Canonical record available.'}</p><footer><code>{entity.id}</code><EntityLink entity={entity} onNavigate={onNavigate}>Open record</EntityLink></footer></article>)}</div>
    {!visible.length && <ArchiveState kind="empty" title="No matching records" description="Clear the workspace filter or search the complete archive." />}
  </section>;
}

function SearchWorkspace({ onNavigate, spoilerLimit }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim() ? searchSuccessionArchive(query, { limit: 30, chapter: spoilerLimit }) : [], [query, spoilerLimit]);
  return <section className="succession-search-workspace" aria-labelledby="succession-search-title">
    <label><Search size={20} aria-hidden="true" /><span className="sr-only">Search canonical Succession Archive</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Character, organization, event, location, ability, condition…" /></label>
    <p role="status" aria-live="polite">{query ? `${results.length} canonical result${results.length === 1 ? '' : 's'} through Chapter ${spoilerLimit}` : `Enter a term to search records available through Chapter ${spoilerLimit}.`}</p>
    <div>{results.map(({ entity, score }) => <article key={entity.id}><EntityVisual entity={entity} compact /><EntityBadge entity={entity} /><p>{entity.summary}</p><footer><span>Match {score}</span><EntityLink entity={entity} onNavigate={onNavigate}>Open</EntityLink></footer></article>)}</div>
    {query && !results.length && <ArchiveState kind="empty" title="No canonical match inside this chapter boundary" description="Try an alias, organization, location, ability condition, or Nen cost already documented by the selected chapter." />}
  </section>;
}

function FamilyTreeWorkspace({ spoilerLimit, onNavigate }) {
  const princes = entitiesForRoute('princes');
  return <Suspense fallback={<Loading label="royal family tree" />}>
    <div className="succession-migration-note"><b>Diagram view</b><span>The family tree remains available as a visual companion; prince records now open in the chapter-bounded character dossier.</span><button type="button" onClick={() => onNavigate('princes')}>Back to prince records</button></div>
    <FamilyTree
      spoilerLimit={spoilerLimit}
      onOpenPrince={(order) => {
        const entity = princes.find((record) => record.princeOrder === Number(order));
        onNavigate('characters', entity ? { entity: entity.id } : {});
      }}
    />
  </Suspense>;
}

function PreservedWorkspace({ routeId, routeParams, spoilerLimit, onNavigate }) {
  if (routeId === 'black-whale') return <Suspense fallback={<Loading label="Black Whale atlas" />}><BlackWhaleGuide initialQuery={routeParams.room || ''} initialLocationId={routeParams.entity || ''} spoilerLimit={spoilerLimit} onOpenWorldMap={(params = {}) => onNavigate('locations', params)} onOpenCanonicalLocation={(params) => onNavigate('locations', params)} /></Suspense>;
  if (routeId === 'timeline') return <Suspense fallback={<Loading label="voyage timeline" />}><TimelineWorkspace requestedArc="succession-contest" requestedScope={routeParams.scope || 'events'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => onNavigate('timeline', params)} onOpenLocation={(room) => onNavigate('black-whale', { room })} /></Suspense>;
  return null;
}

export default function SuccessionArchiveApp({ routeTarget, routeParams, spoilerLimit, onSpoilerChange, onNavigate, onExitArchive, onOpenSearch, onIntent }) {
  const route = getSuccessionArchiveRoute(routeTarget);
  const navigate = (target, params = {}) => {
    const linkedEntity = params.entity ? getEntityById(params.entity) : null;
    const canonicalTarget = linkedEntity?.entityType === 'character'
      ? 'characters'
      : linkedEntity?.entityType === 'organization'
        ? 'organizations'
        : linkedEntity?.entityType === 'ability'
          ? 'nen'
          : linkedEntity?.entityType === 'guardian-beast'
            ? 'guardian-spirit-beasts'
            : target;
    onNavigate(canonicalTarget, params);
  };
  const treeView = route.id === 'princes' && routeParams.view === 'tree';
  const preserved = ['black-whale', 'timeline'].includes(route.id);
  const dedicated = new Set(['story', 'princes', 'queens', 'bodyguards', 'mafia', 'nen', 'guardian-spirit-beasts', 'events', 'deaths', 'relationships', 'chapters', 'characters', 'hunters', 'military', 'organizations', 'politics', 'locations', 'research', 'glossary', 'media']);
  const selectedEntity = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const specializedRecordRoute = ['characters', 'princes', 'queens', 'chapters', 'events', 'locations', 'bodyguards', 'relationships', 'organizations', 'nen', 'guardian-spirit-beasts'].includes(route.id);
  const showCharacterDossier = Boolean(selectedEntity?.entityType === 'character' && !treeView);
  const showOrganizationDossier = Boolean(selectedEntity?.entityType === 'organization' && !treeView);
  const showAbilityDossier = Boolean(selectedEntity?.entityType === 'ability' && !treeView);
  const showGuardianBeastDossier = Boolean(selectedEntity?.entityType === 'guardian-beast' && !treeView);
  const showDomainDetail = Boolean(selectedEntity && !showCharacterDossier && !showOrganizationDossier && !showAbilityDossier && !showGuardianBeastDossier && !treeView && !specializedRecordRoute);
  const showRouteWorkspace = !showCharacterDossier && !showOrganizationDossier && !showAbilityDossier && !showGuardianBeastDossier && !showDomainDetail;

  return <SuccessionArchiveShell activeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onSpoilerChange={onSpoilerChange} onNavigate={navigate} onExitArchive={onExitArchive} onOpenSearch={onOpenSearch} onIntent={onIntent}>
    {route.id === 'archive' && <ArchiveHome onNavigate={navigate} />}
    {route.id === 'story' && <StoryIntelligenceWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {route.id === 'search' && <SearchWorkspace onNavigate={navigate} spoilerLimit={spoilerLimit} />}
    {treeView && <FamilyTreeWorkspace spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showCharacterDossier && <CharactersWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showOrganizationDossier && <OrganizationsWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showAbilityDossier && <NenWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showGuardianBeastDossier && <GuardianBeastsWorkspace routeParams={{ ...routeParams, entity: selectedEntity.id }} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showDomainDetail && <DomainEntityDetail entity={selectedEntity} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'characters' && <CharactersWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'princes' && !treeView && <PrincesWorkspace routeParams={routeParams} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'queens' && <QueensWorkspace routeParams={routeParams} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'bodyguards' && <AssignmentsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'hunters' && <HuntersWorkspace onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'mafia' && <MafiaWorkspace routeParams={routeParams} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'military' && <MilitaryWorkspace onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'organizations' && <OrganizationsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'politics' && <PoliticsWorkspace onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'locations' && <LocationsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'nen' && <NenWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'guardian-spirit-beasts' && <GuardianBeastsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'events' && <EventsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'deaths' && <BodyStatesWorkspace routeParams={routeParams} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'relationships' && <RelationshipsWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'chapters' && <ChapterStoryWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'research' && <EvidenceWorkspace routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {showRouteWorkspace && route.id === 'glossary' && <GlossaryWorkspace />}
    {showRouteWorkspace && route.id === 'media' && <MediaWorkspace onNavigate={navigate} />}
    {preserved && <PreservedWorkspace routeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {!['archive', 'story', 'search'].includes(route.id) && !treeView && !preserved && !dedicated.has(route.id) && <DirectoryWorkspace routeId={route.id} routeParams={routeParams} onNavigate={navigate} />}
  </SuccessionArchiveShell>;
}
