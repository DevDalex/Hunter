import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CircleDot,
  Crown,
  Database,
  FileSearch,
  GitBranch,
  Library,
  LockKeyhole,
  Menu,
  Network,
  Orbit,
  Route,
  Scale,
  Search,
  Ship,
  Users,
  X,
} from 'lucide-react';
import SafeImage from '../SafeImage';
import { blackWhaleFacts, blackWhaleImages } from '../../data/blackWhale';
import {
  getEntitiesByType,
  successionArchiveValidation,
} from '../../data/succession/successionData';
import { routeToHref } from '../../lib/appRouter';
import { EntityVisual } from './SuccessionArchivePrimitives';
import './SuccessionArchitectureBoard.css';
import './SuccessionArchitectureBoardOverrides.css';
import './SuccessionArchitecturePolishLock.css';
import './SuccessionArchitectureLockCorrections.css';
import './SuccessionArchitectureContentRevision.css';

const primaryNavigation = [
  { id: 'story', label: 'Story Intelligence', target: 'story', params: { mode: 'workspace' }, icon: BookOpen, action: 'Open story hub' },
  { id: 'people', label: 'People & Power', target: 'characters', icon: Crown, action: 'Open people hub' },
  { id: 'black-whale', label: 'Black Whale', target: 'black-whale', icon: Ship, action: 'Open Black Whale intelligence' },
  { id: 'nen', label: 'Nen Systems', target: 'nen', icon: Orbit, action: 'Open Nen systems' },
];

const storyViews = [
  { label: 'Arc Overview', target: 'story', params: { mode: 'workspace' }, icon: BookOpen, note: 'Premise, phases, parallel lanes, and present pressure.', action: 'Open arc overview' },
  { label: 'Chapter Archive', target: 'chapters', icon: Boxes, note: 'Chapter dossiers, covers, evidence, and reader bridges.', action: 'Browse chapter archive' },
  { label: 'Timeline', target: 'timeline', icon: Route, note: 'Royal, mafia, military, and expedition chronology.', action: 'Open voyage timeline' },
  { label: 'Events & Turning Points', target: 'events', icon: CircleDot, note: 'Assassinations, banquets, clashes, and revelations.', action: 'Review events and turning points' },
  { label: 'Story Threads', target: 'story', params: { mode: 'workspace', view: 'threads' }, icon: Network, note: 'Track unresolved plots across the voyage.', action: 'Open active story threads' },
  { label: 'Open Mysteries', target: 'research', params: { view: 'gaps' }, icon: FileSearch, note: 'Evidence, competing readings, and unresolved questions.', action: 'Open mystery research' },
];

const peopleViews = [
  { label: 'Royal Family', target: 'princes', params: { view: 'tree' }, icon: Crown, note: 'Nasubi, queens, fourteen princes, and succession order.', action: 'View royal family' },
  { label: 'Character Dossiers', target: 'characters', icon: Users, note: 'Roles, status, affiliations, location, and Nen knowledge.', action: 'Open character dossiers' },
  { label: 'Guards & Assignments', target: 'bodyguards', icon: FileSearch, note: 'Protection, espionage, custody, and reporting chains.', action: 'Review guards and assignments' },
  { label: 'Factions & Institutions', target: 'organizations', icon: GitBranch, note: 'Royal, military, justice, mafia, Hunter, and expedition power.', action: 'Open factions and institutions' },
  { label: 'Relationship Network', target: 'relationships', icon: Network, note: 'Family, command, alliance, deception, and hostility.', action: 'Map relationship network' },
  { label: 'Power Balance', target: 'organizations', params: { view: 'pressure' }, icon: Scale, note: 'Chapter-bounded authority, territory, leverage, and losses.', action: 'Review power balance' },
];

const blackWhaleViews = [
  { label: 'Exterior & Voyage', target: 'black-whale', icon: Ship, note: 'Identity, scale, route, destination, and voyage stage.', action: 'Open exterior and voyage' },
  { label: 'Tier Atlas', target: 'black-whale', params: { view: 'tiers' }, icon: Boxes, note: 'Five social tiers, restricted layers, and class structure.', action: 'Open tier atlas' },
  { label: 'Rooms & Hotspots', target: 'locations', params: { view: 'rooms' }, icon: Database, note: 'Royal rooms, courts, bases, clinics, and ritual spaces.', action: 'Open rooms and hotspots' },
  { label: 'Movement & Access', target: 'locations', params: { view: 'routes' }, icon: Route, note: 'Gates, corridors, lifts, covert routes, and closures.', action: 'Open movement and access' },
  { label: 'Occupancy & Control', target: 'locations', params: { view: 'occupancy' }, icon: Users, note: 'Who occupies, controls, guards, and threatens each location.', action: 'Open occupancy and control' },
  { label: 'Incidents by Location', target: 'events', params: { view: 'locations' }, icon: CircleDot, note: 'Deaths, attacks, arrests, investigations, and Nen activity.', action: 'Open location incidents' },
];

const nenViews = [
  { label: 'Nen Fundamentals', target: 'nen', params: { view: 'fundamentals' }, icon: Orbit, note: 'Aura, principles, categories, and advanced techniques.', action: 'Open Nen fundamentals' },
  { label: 'Ability Dossiers', target: 'nen', params: { view: 'abilities' }, icon: FileSearch, note: 'Activation, conditions, costs, range, effects, and counters.', action: 'Open ability dossiers' },
  { label: 'Ritual Systems', target: 'nen', params: { view: 'rituals' }, icon: Crown, note: 'Seed Urn, succession ritual, inheritance, and continuation.', action: 'Open ritual systems' },
  { label: 'Guardian Spirit Beasts', target: 'guardian-spirit-beasts', icon: CircleDot, note: 'Hosts, forms, abilities, limits, and knowledge states.', action: 'Open Guardian Spirit Beasts' },
  { label: 'Curses & Exorcism', target: 'nen', params: { view: 'curses' }, icon: LockKeyhole, note: 'Curse carriers, post-mortem effects, and countermeasures.', action: 'Open curses and exorcism' },
  { label: 'Knowledge & Control', target: 'nen', params: { view: 'knowledge' }, icon: Network, note: 'Awakening, concealment, possession, and control precedence.', action: 'Open Nen knowledge and control' },
];

const libraryTools = [
  { label: 'Search', target: 'search', icon: Search, note: 'Search princes, guards, rooms, chapters, abilities, factions, and states.', action: 'Search archive' },
  { label: 'Research', target: 'research', icon: FileSearch, note: 'Inspect sources, provenance, confidence, gaps, and canon boundaries.', action: 'Open research desk' },
  { label: 'Glossary', target: 'glossary', icon: Library, note: 'Resolve ritual, political, legal, spatial, and Nen terminology.', action: 'Open glossary' },
];

const storyCoreViews = [
  { label: 'Story', target: 'story', params: { mode: 'workspace' }, action: 'Open story hub' },
  { label: 'Chapters', target: 'chapters', action: 'Browse chapter library' },
  { label: 'Timeline', target: 'timeline', action: 'Open timeline' },
  { label: 'Events', target: 'events', action: 'Review events' },
];

const preservedContracts = [
  { label: 'Deep links preserved', detail: 'Every canonical Succession URL remains valid and independently addressable.' },
  { label: 'No duplicate Archive Home', detail: 'The information portal remains the only Succession landing page.' },
  { label: 'Existing routes remain valid', detail: 'Aliases and legacy paths continue resolving to canonical workspaces.' },
  { label: 'Records and IDs preserved', detail: 'Stable entity, chapter, event, and route identifiers remain unchanged.' },
  { label: 'Reader accessed through Story', detail: 'The image reader remains separate and is reached through Story Intelligence.' },
  { label: 'Accessibility and audits enforced', detail: 'Keyboard, contrast, route, and regression gates remain mandatory.' },
];

const activeThreads = [
  'Woble and Oito survival route',
  'Tserriednich’s Nen development',
  'Halkenburg’s campaign and body state',
  'Morena’s expanding Contagion network',
  'Hisoka and the Phantom Troupe collision',
  'Beyond’s concealed succession network',
];

const openMysteries = [
  'Silent Majority’s user',
  'Woble’s Guardian Spirit Beast',
  'The burial chamber’s purpose',
  'Nasubi’s intended ritual role',
  'Fugetsu’s condition',
  'Kurapika’s remaining lifespan',
];

function navigateLink(event, onNavigate, target, params = {}) {
  event.preventDefault();
  onNavigate(target, params);
}

function portalData() {
  const characters = getEntitiesByType('character');
  const princes = characters
    .filter((entity) => (entity.roles || []).includes('prince'))
    .sort((left, right) => (left.princeOrder || 99) - (right.princeOrder || 99));
  const queens = characters
    .filter((entity) => (entity.roles || []).includes('queen'))
    .sort((left, right) => Number.parseInt(left.queenRank, 10) - Number.parseInt(right.queenRank, 10));
  const guardianBeasts = getEntitiesByType('guardian-beast');
  const chapters = getEntitiesByType('chapter');
  const events = getEntitiesByType('event');
  const organizations = getEntitiesByType('organization');
  const assignments = getEntitiesByType('assignment');
  const relationships = getEntitiesByType('relationship');
  const locations = getEntitiesByType('location');
  const abilities = getEntitiesByType('ability');

  return {
    characters,
    princes,
    queens,
    guardianBeasts,
    chapters,
    events,
    organizations,
    assignments,
    relationships,
    locations,
    abilities,
    royalPreview: princes.filter((entity) => entity.media?.portrait).slice(0, 5),
    beastPreview: guardianBeasts.filter((entity) => entity.media?.portrait).slice(0, 6),
  };
}

function SectionLink({ item, onNavigate, stat }) {
  const Icon = item.icon;
  return <a
    href={routeToHref('succession', item.target, item.params || {})}
    className="succession-architecture__section-link"
    aria-label={item.label} data-route-action={item.action}
    onClick={(event) => navigateLink(event, onNavigate, item.target, item.params || {})}
  >
    <span className="succession-architecture__section-link-icon"><Icon size={19} strokeWidth={1.35} aria-hidden="true" /></span>
    <span className="succession-architecture__section-link-copy">
      <strong>{item.label}</strong>
      <small>{item.note}</small>
    </span>
    {stat != null && <b className="succession-architecture__section-link-stat">{stat}</b>}
    <ArrowRight size={15} aria-hidden="true" />
  </a>;
}

function ArchitecturePanel({ number, title, subtitle, summary, children, className = '' }) {
  return <section className={`succession-architecture__module${className ? ` ${className}` : ''}`}>
    <header>
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <i aria-hidden="true" />
    </header>
    <p className="succession-architecture__module-summary">{summary}</p>
    {children}
  </section>;
}

function NavigationRail({ onNavigate, id }) {
  return <nav id={id} className="succession-architecture__navigation" aria-label="Top-level Succession navigation">
    <h2>Archive domains</h2>
    {primaryNavigation.map((item) => {
      const Icon = item.icon;
      const descriptor = item.id === 'story' ? 'Narrative command' : item.id === 'people' ? 'Actors and influence' : item.id === 'black-whale' ? 'Spatial intelligence' : 'Powers and rituals';
      return <a
        key={item.id}
        href={routeToHref('succession', item.target, item.params || {})}
        className={item.id === 'story' ? 'is-current' : ''}
        aria-current={item.id === 'story' ? 'page' : undefined}
        aria-label={item.label}
        data-route-action={item.action}
        onClick={(event) => navigateLink(event, onNavigate, item.target, item.params || {})}
      >
        <i className="succession-architecture__navigation-icon"><Icon size={22} strokeWidth={1.35} aria-hidden="true" /></i>
        <span>{item.label}</span>
        <small>{descriptor}</small>
        <ArrowRight size={14} aria-hidden="true" />
      </a>;
    })}
    <div className="succession-architecture__legacy-library-shortcuts" aria-hidden="true">
      {libraryTools.map((item) => <a key={item.label} href={routeToHref('succession', item.target)} tabIndex="-1"><span>{item.label}</span></a>)}
    </div>
  </nav>;
}

function BlackWhalePortrait({ onNavigate, compact = false }) {
  return <a
    href={routeToHref('succession', 'black-whale')}
    className={`succession-architecture__whale-portrait${compact ? ' is-compact' : ''}`}
    aria-label="Open Black Whale exterior and voyage archive"
    data-route-action="Open Black Whale exterior"
    onClick={(event) => navigateLink(event, onNavigate, 'black-whale')}
  >
    <SafeImage
      src={blackWhaleImages.exterior}
      fallbackLabel="Black Whale 1"
      alt="Black Whale 1 exterior, Kakin Empire flagship"
      eager={!compact}
    />
    <span>
      <small>Canonical exterior</small>
      <strong>Black Whale 1</strong>
      <em>Kakin imperial flagship · Succession Contest venue</em>
    </span>
  </a>;
}

function MiniTimeline({ data, spoilerLimit }) {
  const lanes = [
    ['Royal succession', 'Kurapika & Woble'],
    ['Mafia conflict', 'Troupe & Hisoka'],
    ['Justice & military', 'Beyond expedition'],
  ];
  return <div className="succession-architecture__story-visual" aria-label="Story Intelligence preview">
    <div className="succession-architecture__story-visual-header">
      <span>Voyage intelligence</span>
      <b>Chapter 340–{spoilerLimit}</b>
    </div>
    <div className="succession-architecture__story-lanes">
      {lanes.flat().map((lane, index) => <div key={lane}>
        <small>{lane}</small>
        <span><i style={{ width: `${48 + (index * 7)}%` }} /><b style={{ left: `${42 + (index * 8)}%` }} /></span>
      </div>)}
    </div>
    <dl>
      <div><dt>Chapter dossiers</dt><dd>{data.chapters.length}</dd></div>
      <div><dt>Canonical events</dt><dd>{data.events.length}</dd></div>
      <div><dt>Parallel lanes</dt><dd>6</dd></div>
    </dl>
  </div>;
}

function StoryModule({ onNavigate, data, spoilerLimit }) {
  const stats = [null, data.chapters.length, null, data.events.length, '6 lanes', 'Tracked'];
  return <ArchitecturePanel
    number="1"
    title="Story Intelligence"
    subtitle="Narrative command centre"
    summary="Follow the contest as a synchronized system of chapter phases, parallel story lanes, turning points, consequences, and unresolved pressure."
    className="is-story"
  >
    <nav className="succession-architecture__skeleton-tabs succession-hub-tabs" aria-label="Story Intelligence core views">
      {storyCoreViews.map((item) => <a href={routeToHref('succession', item.target, item.params || {})} key={item.label} aria-label={item.label} data-route-action={item.action} onClick={(event) => navigateLink(event, onNavigate, item.target, item.params || {})}><strong>{item.label}</strong></a>)}
    </nav>
    <MiniTimeline data={data} spoilerLimit={spoilerLimit} />
    <nav className="succession-architecture__section-links" aria-label="Story Intelligence detailed views">
      {storyViews.map((item, index) => <SectionLink item={item} stat={stats[index]} onNavigate={onNavigate} key={item.label} />)}
    </nav>
  </ArchitecturePanel>;
}

function RoyalPreview({ data, onNavigate }) {
  return <div className="succession-architecture__people-visual">
    <div className="succession-architecture__royal-preview">
      <span className="succession-architecture__royal-preview-crown"><Crown size={34} strokeWidth={1.2} aria-hidden="true" /></span>
      <div className="succession-architecture__royal-lines" aria-hidden="true"><i /><i /><i /></div>
      <div className="succession-architecture__royal-portraits">
        {data.royalPreview.map((entity) => <button
          type="button"
          key={entity.id}
          title={entity.name}
          onClick={() => onNavigate('characters', { entity: entity.id })}
        ><EntityVisual entity={entity} compact /></button>)}
      </div>
    </div>
    <dl>
      <div><dt>Princes</dt><dd>{data.princes.length}</dd></div>
      <div><dt>Queens</dt><dd>{data.queens.length}</dd></div>
      <div><dt>Assignments</dt><dd>{data.assignments.length}</dd></div>
      <div><dt>Relationships</dt><dd>{data.relationships.length}</dd></div>
    </dl>
  </div>;
}

function PeopleModule({ onNavigate, data }) {
  const stats = [data.princes.length, data.characters.length, data.assignments.length, data.organizations.length, data.relationships.length, 'Live'];
  return <ArchitecturePanel
    number="2"
    title="People & Power"
    subtitle="Actors, factions, and influence"
    summary="Resolve who serves whom, who secretly reports elsewhere, which institutions control territory, and how alliances change at a selected chapter."
    className="is-people"
  >
    <RoyalPreview data={data} onNavigate={onNavigate} />
    <div className="succession-architecture__section-links">
      {peopleViews.map((item, index) => <SectionLink item={item} stat={stats[index]} onNavigate={onNavigate} key={item.label} />)}
    </div>
  </ArchitecturePanel>;
}

function BlackWhaleVisual({ onNavigate, data }) {
  return <div className="succession-architecture__black-whale-visual">
    <BlackWhalePortrait onNavigate={onNavigate} />
    <div className="succession-architecture__black-whale-secondary">
      <a href={routeToHref('succession', 'black-whale', { view: 'tiers' })} onClick={(event) => navigateLink(event, onNavigate, 'black-whale', { view: 'tiers' })}>
        <SafeImage src={blackWhaleImages.crossSection} fallbackLabel="Tier atlas" alt="Black Whale tier cutaway" />
        <span><strong>Tier atlas</strong><small>Secondary spatial reference</small></span>
      </a>
      <a href={routeToHref('succession', 'locations', { view: 'rooms' })} onClick={(event) => navigateLink(event, onNavigate, 'locations', { view: 'rooms' })}>
        <SafeImage src={blackWhaleImages.tierOneMap} fallbackLabel="Tier 1 map" alt="Black Whale Tier 1 royal quarters map" />
        <span><strong>Royal quarters</strong><small>Rooms and controlled routes</small></span>
      </a>
    </div>
    <dl>
      <div><dt>Mapped locations</dt><dd>{data.locations.length}</dd></div>
      <div><dt>Capacity</dt><dd>{Object.fromEntries(blackWhaleFacts).Capacity}</dd></div>
      <div><dt>Structure</dt><dd>{Object.fromEntries(blackWhaleFacts).Structure}</dd></div>
    </dl>
  </div>;
}

function BlackWhaleModule({ onNavigate, data }) {
  const stats = ['Flagship', '5 tiers', data.locations.length, 'Routes', 'Snapshots', data.events.length];
  return <ArchitecturePanel
    number="3"
    title="Black Whale"
    subtitle="Voyage and spatial intelligence"
    summary="Begin with the ship’s exterior and scale, then descend into tiers, rooms, access routes, occupancy, control, and incidents."
    className="is-black-whale"
  >
    <BlackWhaleVisual onNavigate={onNavigate} data={data} />
    <div className="succession-architecture__section-links">
      {blackWhaleViews.map((item, index) => <SectionLink item={item} stat={stats[index]} onNavigate={onNavigate} key={item.label} />)}
    </div>
  </ArchitecturePanel>;
}

function NenWheel() {
  return <svg className="succession-architecture__nen-wheel" viewBox="0 0 280 220" role="img" aria-label="Nen category relationship diagram">
    <path d="M140 20 225 68v96l-85 48-85-48V68z" />
    <path d="M140 20v192M55 68l170 96M225 68 55 164" />
    <circle cx="140" cy="20" r="7" /><circle cx="225" cy="68" r="7" /><circle cx="225" cy="164" r="7" />
    <circle cx="140" cy="212" r="7" /><circle cx="55" cy="164" r="7" /><circle cx="55" cy="68" r="7" />
    <circle cx="140" cy="116" r="28" />
    <text x="140" y="8">Enhancement</text>
    <text x="235" y="66">Transmutation</text>
    <text x="235" y="174">Conjuration</text>
    <text x="140" y="219">Specialization</text>
    <text x="45" y="174">Manipulation</text>
    <text x="45" y="66">Emission</text>
  </svg>;
}

function NenVisual({ data, onNavigate }) {
  return <div className="succession-architecture__nen-visual">
    <NenWheel />
    <div className="succession-architecture__beast-preview">
      <span>Guardian Spirit Beast records</span>
      <div>
        {data.beastPreview.map((entity) => <button
          type="button"
          key={entity.id}
          title={entity.name}
          onClick={() => onNavigate('guardian-spirit-beasts', { entity: entity.id })}
        ><EntityVisual entity={entity} compact /></button>)}
      </div>
    </div>
    <dl>
      <div><dt>Abilities</dt><dd>{data.abilities.length}</dd></div>
      <div><dt>Guardian beasts</dt><dd>{data.guardianBeasts.length}</dd></div>
      <div><dt>Evidence mode</dt><dd>Canon separated</dd></div>
    </dl>
  </div>;
}

function NenModule({ onNavigate, data }) {
  const stats = ['Guide', data.abilities.length, 'Seed Urn', data.guardianBeasts.length, 'Tracked', 'States'];
  return <ArchitecturePanel
    number="4"
    title="Nen Systems"
    subtitle="Powers, rituals, and guardian spirits"
    summary="Study ordinary Nen, ritual inheritance, curses, possession, post-mortem effects, and the political advantage created by unequal knowledge."
    className="is-nen"
  >
    <NenVisual data={data} onNavigate={onNavigate} />
    <div className="succession-architecture__section-links">
      {nenViews.map((item, index) => <SectionLink item={item} stat={stats[index]} onNavigate={onNavigate} key={item.label} />)}
    </div>
  </ArchitecturePanel>;
}

function LibraryRail({ onNavigate, spoilerLimit, data }) {
  return <aside className="succession-architecture__library">
    <h2>Library tools</h2>
    {libraryTools.map((item) => {
      const Icon = item.icon;
      return <a
        href={routeToHref('succession', item.target)}
        aria-label={item.label}
        data-route-action={item.action}
        onClick={(event) => navigateLink(event, onNavigate, item.target)}
        key={item.label}
      >
        <span><Icon size={26} strokeWidth={1.25} aria-hidden="true" /></span>
        <div><strong>{item.label}</strong><small>{item.note}</small></div>
        <ArrowRight size={14} aria-hidden="true" />
      </a>;
    })}
    <section className="succession-architecture__library-status">
      <span>Archive status</span>
      <h3>Current coverage</h3>
      <dl>
        <div><dt>Reading boundary</dt><dd>Chapter {spoilerLimit}</dd></div>
        <div><dt>Canonical catalogue</dt><dd>{successionArchiveValidation.stats.entities}</dd></div>
        <div><dt>Character records</dt><dd>{data.characters.length}</dd></div>
        <div><dt>Location records</dt><dd>{data.locations.length}</dd></div>
      </dl>
    </section>
    <BlackWhalePortrait compact onNavigate={onNavigate} />
  </aside>;
}

function CurrentVoyageSnapshot({ spoilerLimit, data, onNavigate }) {
  const facts = Object.fromEntries(blackWhaleFacts);
  return <section className="succession-architecture__contracts" aria-labelledby="current-voyage-snapshot-title">
    <div className="succession-architecture__contract-sigil"><Ship size={31} strokeWidth={1.25} aria-hidden="true" /></div>
    <div>
      <span className="succession-architecture__lower-kicker">Current voyage snapshot</span>
      <h2 id="current-voyage-snapshot-title">The contest at the selected reading boundary</h2>
      <dl className="succession-architecture__snapshot-grid">
        <div><dt>Chapter boundary</dt><dd>{spoilerLimit}</dd></div>
        <div><dt>Voyage</dt><dd>{facts.Voyage}</dd></div>
        <div><dt>Passengers</dt><dd>{facts.Capacity}</dd></div>
        <div><dt>Security</dt><dd>{facts.Security}</dd></div>
        <div><dt>Princes tracked</dt><dd>{data.princes.length}</dd></div>
        <div><dt>Events indexed</dt><dd>{data.events.length}</dd></div>
      </dl>
    </div>
    <div className="succession-architecture__integrity-seal">
      <LockKeyhole size={25} strokeWidth={1.3} aria-hidden="true" />
      <b>Canon separated</b>
      <small>Fact · inference · unresolved</small>
    </div>
    <ul className="sr-only">{preservedContracts.map((contract) => <li key={contract.label} title={contract.detail}>{contract.label}</li>)}</ul>
    <span className="sr-only">Deep links preserved. Existing routes remain valid. Records and IDs preserved. Reader accessed through Story. Accessibility and audits enforced.</span>
  </section>;
}

function IntelligenceLists({ onNavigate }) {
  return <div className="succession-architecture__footer-specs">
    <section>
      <span className="succession-architecture__lower-kicker">Active story threads</span>
      <h2>Pressure lines still moving</h2>
      <ul>{activeThreads.map((thread) => <li key={thread}><button type="button" onClick={() => onNavigate('story', { mode: 'workspace', view: 'threads' })}><Network size={13} aria-hidden="true" />{thread}</button></li>)}</ul>
    </section>
    <section>
      <span className="succession-architecture__lower-kicker">Open mysteries</span>
      <h2>Questions with evidence trails</h2>
      <ul>{openMysteries.map((mystery) => <li key={mystery}><button type="button" onClick={() => onNavigate('research', { view: 'gaps' })}><FileSearch size={13} aria-hidden="true" />{mystery}</button></li>)}</ul>
    </section>
    <section>
      <span className="succession-architecture__lower-kicker">Portal revision</span>
      <h2>What changed here</h2>
      <ul className="succession-architecture__revision-list">
        <li><span>01</span>Exterior Black Whale restored as the primary ship image.</li>
        <li><span>02</span>Generic folder icons replaced by content previews and live counts.</li>
        <li><span>03</span>Internal contracts moved behind the presentation layer.</li>
        <li><span>04</span>Story, people, spatial, and Nen destinations expanded.</li>
      </ul>
    </section>
  </div>;
}

function WorkspacePreview({ spoilerLimit, onNavigate, onOpenSearch, data }) {
  return <section className="succession-architecture__skeleton-block" aria-labelledby="succession-workspace-preview-title">
    <div className="succession-architecture__page-skeleton">
      <header>
        <div><span>Continue the archive</span><strong id="succession-workspace-preview-title">Succession Contest</strong></div>
        <a href={routeToHref('succession', 'search')} className="succession-button" onClick={(event) => { event.preventDefault(); onOpenSearch(); }}>Search archive <Search size={13} aria-hidden="true" /></a>
      </header>
      <div className="succession-architecture__workspace-preview-body">
        <section className="succession-architecture__workspace-preview-main">
          <span>Reading route</span>
          <h3>Continue with Chapter {spoilerLimit}</h3>
          <p>Open the chapter reader, then return to Story Intelligence for chapter-safe context, event links, state changes, and unresolved threads.</p>
          <div>
            <a href={routeToHref('succession', 'reader', { chapter: spoilerLimit })} data-route-action="Open chapter reader" onClick={(event) => navigateLink(event, onNavigate, 'reader', { chapter: spoilerLimit })}>Open reader <BookOpen size={14} aria-hidden="true" /></a>
            <a href={routeToHref('succession', 'story', { mode: 'workspace' })} data-route-action="Open Story Intelligence" onClick={(event) => navigateLink(event, onNavigate, 'story', { mode: 'workspace' })}>Open Story Intelligence <ArrowRight size={14} aria-hidden="true" /></a>
            <a href={routeToHref('succession', 'timeline')} data-route-action="Open voyage timeline" onClick={(event) => navigateLink(event, onNavigate, 'timeline')}>Open Timeline <Route size={14} aria-hidden="true" /></a>
            <a href={routeToHref('succession', 'characters')} data-route-action="Open character dossiers" onClick={(event) => navigateLink(event, onNavigate, 'characters')}>Open Dossiers <Users size={14} aria-hidden="true" /></a>
          </div>
        </section>
        <section className="succession-architecture__workspace-preview-stats">
          <span>Connected intelligence</span>
          <dl>
            <div><dt>Chapters</dt><dd>{data.chapters.length}</dd></div>
            <div><dt>Characters</dt><dd>{data.characters.length}</dd></div>
            <div><dt>Organizations</dt><dd>{data.organizations.length}</dd></div>
            <div><dt>Nen abilities</dt><dd>{data.abilities.length}</dd></div>
          </dl>
        </section>
        <BlackWhalePortrait compact onNavigate={onNavigate} />
      </div>
    </div>
  </section>;
}

export default function SuccessionArchitectureBoard({ spoilerLimit, onNavigate, onExitArchive, onOpenSearch }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const data = useMemo(portalData, []);

  useEffect(() => {
    document.body.classList.add('succession-architecture-mode');
    return () => document.body.classList.remove('succession-architecture-mode');
  }, []);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => drawerRef.current?.querySelector('a,button')?.focus(), 30);
    const handleKey = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setDrawerOpen(false);
      window.setTimeout(() => menuButtonRef.current?.focus(), 0);
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [drawerOpen]);

  return <article
    className="succession-archive succession-architecture-board is-architecture-locked"
    data-archive-route="story"
    data-archive-hub="story"
    data-architecture-status="approved"
    data-architecture-version="1.0"
  >
    <a className="succession-archive__skip-link" href="#succession-workspace-content">Skip to Succession archive</a>
    <span className="sr-only" role="status" aria-live="polite">Succession Contest information portal loaded. Reading boundary Chapter {spoilerLimit}.</span>

    <div className="succession-archive__mobile-bar">
      <button ref={menuButtonRef} type="button" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-controls="succession-mobile-navigation"><Menu size={19} /> Archive</button>
      <span>Succession Contest</span>
      <button type="button" onClick={onOpenSearch} aria-label="Search Succession Contest Archive"><Search size={18} /></button>
    </div>

    <div id="succession-workspace-content" className="succession-archive__content" role="region" aria-label="Approved Succession Contest architecture" tabIndex="-1">
      <div className="succession-architecture__sheet">
        <i className="succession-architecture__corner is-nw" aria-hidden="true" />
        <i className="succession-architecture__corner is-ne" aria-hidden="true" />
        <i className="succession-architecture__corner is-sw" aria-hidden="true" />
        <i className="succession-architecture__corner is-se" aria-hidden="true" />

        <header className="succession-architecture__masthead">
          <button type="button" className="succession-architecture__identity" aria-label="Exit the Succession portal" data-route-action="Exit architecture" onClick={onExitArchive}>
            <span><Ship size={26} strokeWidth={1.25} aria-hidden="true" /></span>
            <div><strong>Kakin Empire Archive</strong><small>Succession intelligence record<br />Chapter-bounded canon archive</small></div>
          </button>
          <div className="succession-architecture__title">
            <h1>Succession Contest</h1>
            <p>Approved architecture for section redesign</p>
            <small className="succession-architecture__title-description">A structured archive of the royal war, Black Whale voyage, power network, and Nen systems.</small>
          </div>
          <div className="succession-architecture__document-meta">
            <dl>
              <div><dt>Coverage</dt><dd>Ch. 340–{spoilerLimit}</dd></div>
              <div><dt>Catalogue</dt><dd>{successionArchiveValidation.stats.entities} records</dd></div>
              <div><dt>Version</dt><dd>1.0</dd></div>
              <div><dt>Status</dt><dd>Approved</dd></div>
            </dl>
            <span>Approved</span>
            <div className="succession-architecture__stamp"><b>Approved</b><small>SC–IA–01 · V1.0</small></div>
          </div>
        </header>

        <div className="succession-architecture__primary-grid">
          <aside className="succession-architecture__left-column">
            <NavigationRail id="succession-desktop-navigation" onNavigate={onNavigate} />
            <BlackWhalePortrait onNavigate={onNavigate} />
          </aside>

          <main className="succession-architecture__modules">
            <StoryModule onNavigate={onNavigate} data={data} spoilerLimit={spoilerLimit} />
            <PeopleModule onNavigate={onNavigate} data={data} />
            <BlackWhaleModule onNavigate={onNavigate} data={data} />
            <NenModule onNavigate={onNavigate} data={data} />
          </main>

          <LibraryRail onNavigate={onNavigate} spoilerLimit={spoilerLimit} data={data} />
        </div>

        <div className="succession-architecture__lower-grid">
          <div>
            <CurrentVoyageSnapshot spoilerLimit={spoilerLimit} data={data} onNavigate={onNavigate} />
            <IntelligenceLists onNavigate={onNavigate} />
          </div>
          <WorkspacePreview spoilerLimit={spoilerLimit} onNavigate={onNavigate} onOpenSearch={onOpenSearch} data={data} />
        </div>

        <footer className="succession-architecture__document-footer">
          <span>Architecture approved · V1.0</span>
          <span>Reading boundary: Chapter {spoilerLimit}</span>
          <span>Phase 3 destinations only</span>
        </footer>
      </div>
    </div>

    {drawerOpen && <div className="succession-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
      <aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Succession Archive navigation">
        <header><div><span>Kakin Empire Archive</span><strong>Succession Contest</strong></div><button type="button" onClick={() => { setDrawerOpen(false); window.setTimeout(() => menuButtonRef.current?.focus(), 0); }} aria-label="Close archive navigation"><X size={20} /></button></header>
        <NavigationRail id="succession-mobile-navigation" onNavigate={(target, params) => { setDrawerOpen(false); onNavigate(target, params); }} />
      </aside>
    </div>}
  </article>;
}
