import { lazy, Suspense, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Database, Search } from 'lucide-react';
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
  ArchiveState,
  EntityBadge,
  EntityHeader,
  EntityLink,
  RelatedEntities,
  SourceReference,
  entityWorkspaceTarget,
} from './SuccessionArchivePrimitives';

const FamilyTree = lazy(() => import('../FamilyTree'));
const BlackWhaleGuide = lazy(() => import('../BlackWhaleGuide'));
const SuccessionDossier = lazy(() => import('../SuccessionDossier'));
const SuccessionConnectionBoard = lazy(() => import('../SuccessionConnectionBoard'));
const TimelineWorkspace = lazy(() => import('../TimelineWorkspace'));

const Loading = ({ label }) => <ArchiveState kind="loading" title={`Opening ${label}`} description="Loading the preserved workspace inside the Succession Archive shell." />;

const sortByName = (entities) => [...entities].sort((left, right) => String(left.name || left.id).localeCompare(String(right.name || right.id)));

const entitiesForRoute = (routeId) => {
  const characters = getEntitiesByType('character');
  const organizations = getEntitiesByType('organization');
  const relationships = getEntitiesByType('relationship');
  if (routeId === 'characters') return characters;
  if (routeId === 'princes') return characters.filter((entity) => (entity.roles || []).some((role) => role.includes('prince')));
  if (routeId === 'queens') return characters.filter((entity) => (entity.roles || []).some((role) => role.includes('queen') || role === 'royal-parent'));
  if (routeId === 'bodyguards') return characters.filter((entity) => (entity.roles || []).includes('bodyguard'));
  if (routeId === 'hunters') return characters.filter((entity) => (entity.roles || []).some((role) => role === 'hunter' || role === 'zodiac'));
  if (routeId === 'mafia') return [
    ...organizations.filter((entity) => entity.organizationType === 'mafia-family'),
    ...characters.filter((entity) => (entity.tags || []).some((tag) => tag.includes('heil-ly') || tag.includes('mafia'))),
  ];
  if (routeId === 'military') return [
    ...organizations.filter((entity) => entity.organizationType === 'military'),
    ...characters.filter((entity) => (entity.roles || []).some((role) => role.includes('military'))),
  ];
  if (routeId === 'organizations') return organizations;
  if (routeId === 'politics') return [
    ...organizations.filter((entity) => entity.organizationType === 'royal-house'),
    ...relationships.filter((entity) => entity.relationshipType === 'political'),
  ];
  if (routeId === 'locations') return getEntitiesByType('location');
  if (routeId === 'nen') return getEntitiesByType('ability');
  if (routeId === 'guardian-spirit-beasts') return getEntitiesByType('guardian-beast');
  if (routeId === 'events') return getEntitiesByType('event');
  if (routeId === 'deaths') return characters.filter((entity) => entity.status?.life === 'dead');
  if (routeId === 'relationships') return relationships;
  if (routeId === 'chapters') return getEntitiesByType('chapter');
  if (routeId === 'research') return getEntitiesByType('source');
  return [];
};

function ArchiveHome({ onNavigate }) {
  const stats = successionArchiveValidation.stats;
  const featured = ['story', 'timeline', 'reader', 'characters', 'black-whale', 'research'];
  return <>
    <ArchiveSection
      id="succession-entry-points"
      kicker="Independent workspaces"
      title="One purpose per page."
      description="The previous all-in-one Succession page is now an archive entry point. Story, reading, people, systems, records, and research live in separate routes while sharing the same canonical graph."
    >
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
      <div><Database size={19} aria-hidden="true" /><span>Canonical layer</span><h2 id="succession-data-health-title">Pilot graph is connected and validated.</h2><p>Pages consume stable namespaced records through public selectors. Existing legacy workspaces remain available only where migration is still in progress.</p></div>
      <dl>
        <div><dt>Entities</dt><dd>{stats.entities}</dd></div>
        <div><dt>Characters</dt><dd>{stats.characters}</dd></div>
        <div><dt>Chapters</dt><dd>{stats.chapters}</dd></div>
        <div><dt>Warnings</dt><dd>{successionArchiveValidation.warnings.length}</dd></div>
      </dl>
    </section>

    <ArchiveSection id="archive-directory" kicker="Route hierarchy" title="Archive directory" description="Every major subject has a stable destination, even when its canonical dataset is still being expanded.">
      <div className="succession-route-matrix">
        {successionArchiveGroups.map((group) => <section key={group}><h3>{group}</h3><div>{successionArchiveRoutes.filter((route) => route.group === group).map((route) => <button type="button" key={route.id} onClick={() => onNavigate(route.id)}><span>{route.label}</span><small>{route.status}</small><ArrowRight size={13} /></button>)}</div></section>)}
      </div>
    </ArchiveSection>
  </>;
}

function StoryWorkspace({ onNavigate }) {
  return <div className="succession-story-workspace">
    <section>
      <span>Archive orientation</span>
      <h2>The story page explains the conflict, then gets out of the way.</h2>
      <p>The Succession Contest runs across several simultaneous systems: the royal contest, the voyage, Nen instruction, mafia conflict, security operations, and Kurapika’s mission. This workspace no longer attempts to place every roster, ability, event, and record beneath one scrolling article.</p>
      <div><button className="succession-button succession-button--primary" onClick={() => onNavigate('timeline')}>Open timeline <ArrowRight size={14} /></button><button className="succession-button succession-button--quiet" onClick={() => onNavigate('reader')}>Read chapters <BookOpen size={14} /></button></div>
    </section>
    <aside>
      <article><span>Royal contest</span><h3>People and politics</h3><p>Use Princes, Queens, Bodyguards, Military, Politics, and Relationships as separate workspaces.</p><button onClick={() => onNavigate('princes')}>Open Princes</button></article>
      <article><span>Voyage systems</span><h3>Ship, Nen, and underworld</h3><p>Use Black Whale, Locations, Nen, Guardian Spirit Beasts, Mafia, and Events for focused research.</p><button onClick={() => onNavigate('black-whale')}>Open Black Whale</button></article>
      <article><span>Evidence</span><h3>Chapters and sources</h3><p>Use Chapter Records and Research for evidence. The image reader remains a separate tool.</p><button onClick={() => onNavigate('research')}>Open Research</button></article>
    </aside>
  </div>;
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
  const selected = routeParams.entity ? getEntityById(routeParams.entity) : null;
  const entities = useMemo(() => sortByName(entitiesForRoute(routeId)), [routeId]);
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return entities;
    return entities.filter((entity) => `${entity.name || ''} ${entity.id} ${(entity.aliases || []).join(' ')} ${entity.summary || ''}`.toLocaleLowerCase().includes(normalized));
  }, [entities, query]);

  if (selected) return <EntityDetail entity={selected} onNavigate={onNavigate} />;
  if (!entities.length) return <ArchiveState kind="empty" title="Canonical records are not published here yet." description="The route and interface are ready, but the archive will not manufacture missing lore or classifications. Existing source and provenance rules remain the gate for publication." action={<button className="succession-button succession-button--quiet" onClick={() => onNavigate('research')}>Open research desk</button>} />;

  return <section className="succession-directory" aria-labelledby="succession-directory-title">
    <header><div><span>Canonical directory</span><h2 id="succession-directory-title">{visible.length} of {entities.length} records</h2></div><label><Search size={16} aria-hidden="true" /><span className="sr-only">Filter current workspace</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter this workspace…" />{query && <button type="button" onClick={() => setQuery('')}>Clear</button>}</label></header>
    <div className="succession-entity-grid">{visible.map((entity) => <article key={entity.id}>
      <div><EntityBadge entity={entity} compact /><StatusPill tone="neutral">{entity.canonLevel || 'canon'}</StatusPill></div>
      <h3>{entity.name || entity.id}</h3>
      <p>{entity.summary || 'Canonical record available.'}</p>
      <footer><code>{entity.id}</code><EntityLink entity={entity} onNavigate={onNavigate}>Open record</EntityLink></footer>
    </article>)}</div>
    {!visible.length && <ArchiveState kind="empty" title="No matching records" description="Clear the workspace filter or search the complete archive." />}
  </section>;
}

function SearchWorkspace({ onNavigate }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => query.trim() ? searchSuccessionArchive(query, { limit: 30 }) : [], [query]);
  return <section className="succession-search-workspace" aria-labelledby="succession-search-title">
    <label><Search size={20} aria-hidden="true" /><span className="sr-only">Search canonical Succession Archive</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Character, organization, event, location, alias…" /></label>
    <p role="status" aria-live="polite">{query ? `${results.length} canonical result${results.length === 1 ? '' : 's'}` : 'Enter a term to search the canonical Succession graph.'}</p>
    <div>{results.map(({ entity, score }) => <article key={entity.id}><EntityBadge entity={entity} /><p>{entity.summary}</p><footer><span>Match {score}</span><EntityLink entity={entity} onNavigate={onNavigate}>Open</EntityLink></footer></article>)}</div>
    {query && !results.length && <ArchiveState kind="empty" title="No canonical match" description="The search does not fall back to invented records. Try an alias, chapter number, organization, or location." />}
  </section>;
}

function PreservedWorkspace({ routeId, routeParams, spoilerLimit, onNavigate }) {
  if (routeId === 'princes' && routeParams.prince) return <Suspense fallback={<Loading label="prince dossier" />}>
    <div className="succession-migration-note"><b>Migration layer</b><span>The established prince dossier remains functional while its records are moved into the canonical graph.</span></div>
    <SuccessionDossier embedded spoilerLimit={spoilerLimit} requestedTab="royal" requestedPrince={routeParams.prince} onNavigate={(target, params) => onNavigate(target, params)} onRouteTab={() => onNavigate('princes')} />
  </Suspense>;
  if (routeId === 'princes') return <Suspense fallback={<Loading label="royal family" />}><div className="succession-migration-note"><b>Migration layer</b><span>The established family tree remains functional while its records are moved into the canonical graph.</span></div><FamilyTree spoilerLimit={spoilerLimit} onOpenPrince={(prince) => onNavigate('princes', { prince })} /></Suspense>;
  if (routeId === 'black-whale') return <Suspense fallback={<Loading label="Black Whale atlas" />}><BlackWhaleGuide initialQuery={routeParams.room || ''} onOpenWorldMap={() => onNavigate('locations')} /></Suspense>;
  if (routeId === 'timeline') return <Suspense fallback={<Loading label="voyage timeline" />}><TimelineWorkspace requestedArc="succession-contest" requestedScope={routeParams.scope || 'events'} requestedSearch={routeParams.search || ''} spoilerLimit={spoilerLimit} onNavigate={(params) => onNavigate('timeline', params)} onOpenLocation={(room) => onNavigate('black-whale', { room })} /></Suspense>;
  if (routeId === 'relationships') return <Suspense fallback={<Loading label="relationship archive" />}><SuccessionConnectionBoard /></Suspense>;

  const dossierTab = {
    nen: 'abilities',
    'guardian-spirit-beasts': 'beasts',
    mafia: 'mafia',
    military: 'justice',
    chapters: 'chapters',
    deaths: 'status',
  }[routeId];
  if (!dossierTab) return null;
  return <Suspense fallback={<Loading label={getSuccessionArchiveRoute(routeId).label.toLowerCase()} />}>
    <div className="succession-migration-note"><b>Migration layer</b><span>This focused legacy panel is preserved while its records move into canonical selectors.</span></div>
    <SuccessionDossier
      embedded
      spoilerLimit={spoilerLimit}
      requestedTab={dossierTab}
      requestedPrince={routeParams.prince}
      requestedFocus={routeParams.focus}
      onNavigate={(target, params) => onNavigate(target, params)}
      onRouteTab={(tab) => {
        const target = { abilities: 'nen', beasts: 'guardian-spirit-beasts', mafia: 'mafia', justice: 'military', chapters: 'chapters', status: 'deaths', relations: 'relationships' }[tab] || routeId;
        onNavigate(target);
      }}
    />
  </Suspense>;
}

export default function SuccessionArchiveApp({ routeTarget, routeParams, spoilerLimit, onSpoilerChange, onNavigate, onExitArchive, onOpenSearch, onIntent }) {
  const route = getSuccessionArchiveRoute(routeTarget);
  const navigate = (target, params = {}) => onNavigate(target, params);
  const preserved = ['princes', 'black-whale', 'timeline', 'relationships', 'nen', 'guardian-spirit-beasts', 'mafia', 'military', 'chapters', 'deaths'].includes(route.id);

  return <SuccessionArchiveShell
    activeId={route.id}
    routeParams={routeParams}
    spoilerLimit={spoilerLimit}
    onSpoilerChange={onSpoilerChange}
    onNavigate={navigate}
    onExitArchive={onExitArchive}
    onOpenSearch={onOpenSearch}
    onIntent={onIntent}
  >
    {route.id === 'archive' && <ArchiveHome onNavigate={navigate} />}
    {route.id === 'story' && <StoryWorkspace onNavigate={navigate} />}
    {route.id === 'search' && <SearchWorkspace onNavigate={navigate} />}
    {preserved && <PreservedWorkspace routeId={route.id} routeParams={routeParams} spoilerLimit={spoilerLimit} onNavigate={navigate} />}
    {!['archive', 'story', 'search'].includes(route.id) && !preserved && <DirectoryWorkspace routeId={route.id} routeParams={routeParams} onNavigate={navigate} />}
  </SuccessionArchiveShell>;
}
