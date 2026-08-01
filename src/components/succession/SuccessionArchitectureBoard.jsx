import { useEffect, useRef, useState } from 'react';
import {
  BookOpen, Boxes, CircleDot, Crown, ExternalLink, FileSearch, GitBranch, Library,
  LockKeyhole, Menu, Network, Orbit, Route, Scale, Search, Ship, Users, X,
} from 'lucide-react';
import { routeToHref } from '../../lib/appRouter';
import './SuccessionArchitectureBoard.css';
import './SuccessionArchitectureBoardOverrides.css';
import './SuccessionArchitecturePolishLock.css';

const primaryNavigation = [
  { id: 'story', label: 'Story Intelligence', target: 'story', params: { mode: 'workspace' }, icon: BookOpen, action: 'Open story hub' },
  { id: 'people', label: 'People & Power', target: 'characters', icon: Crown, action: 'Open people hub' },
  { id: 'black-whale', label: 'Black Whale', target: 'black-whale', icon: Ship, action: 'Open ship atlas' },
  { id: 'nen', label: 'Nen Systems', target: 'nen', icon: Orbit, action: 'Open Nen systems' },
  { id: 'search', label: 'Search', target: 'search', icon: Search, action: 'Search archive' },
  { id: 'research', label: 'Research', target: 'research', icon: FileSearch, action: 'Open research library' },
  { id: 'glossary', label: 'Glossary', target: 'glossary', icon: Library, action: 'Open glossary' },
];

const storyViews = [
  { label: 'Story', target: 'story', params: { mode: 'workspace' }, icon: BookOpen, note: 'Arc overview and narrative context.', action: 'Open story workspace' },
  { label: 'Chapters', target: 'chapters', icon: Boxes, note: 'Chapter summaries, covers, and links.', action: 'Browse chapter library' },
  { label: 'Timeline', target: 'timeline', icon: Route, note: 'Chronological progression of key moments.', action: 'Open timeline' },
  { label: 'Events', target: 'events', icon: CircleDot, note: 'Major and minor events across the voyage.', action: 'Review events' },
];

const peopleViews = [
  { label: 'Characters', target: 'characters', icon: Users, note: 'Profiles, roles, status, and affiliations.', action: 'Open character archive' },
  { label: 'Royal Family', target: 'princes', icon: Crown, note: 'Princes, queens, order, and family structure.', action: 'View royal family' },
  { label: 'Assignments', target: 'bodyguards', icon: FileSearch, note: 'Official tasks, missions, and mandates.', action: 'Review assignments' },
  { label: 'Organizations', target: 'organizations', icon: GitBranch, note: 'Factions, units, groups, and institutions.', action: 'Open organizations' },
  { label: 'Relationships', target: 'relationships', icon: Network, note: 'Alliances, conflicts, and influence.', action: 'Map relationships' },
];

const libraryTools = [
  { label: 'Search', target: 'search', icon: Search, note: 'Search every archive, entity, and metadata record.', action: 'Search archive' },
  { label: 'Research', target: 'research', icon: FileSearch, note: 'Sources, saved notes, datasets, and research logs.', action: 'Open research library' },
  { label: 'Glossary', target: 'glossary', icon: Library, note: 'Terms, definitions, and standardized references.', action: 'Open glossary' },
];

const preservedContracts = [
  { label: 'Deep links preserved', detail: 'Every canonical Succession URL remains valid and independently addressable.' },
  { label: 'No duplicate Archive Home', detail: 'The architecture portal is the only Succession landing page.' },
  { label: 'Existing routes remain valid', detail: 'Aliases and legacy paths continue resolving to canonical workspaces.' },
  { label: 'Records and IDs preserved', detail: 'Stable entity, chapter, event, and route identifiers remain unchanged.' },
  { label: 'Reader accessed through Story', detail: 'The image reader remains separate and is reached through the Story flow.' },
  { label: 'Accessibility and audits enforced', detail: 'Keyboard, contrast, route, viewport, and regression gates remain mandatory.' },
];

function ShipBlueprint() {
  return <svg className="succession-architecture__ship-blueprint" viewBox="0 0 420 170" aria-hidden="true">
    <path d="M22 118h372l-24 31H58z" /><path d="M64 116V86h36V61h30v25h34V48h28v38h33V71h37v15h50v30" />
    <path d="M178 48V23m0 0-21 25m21-25 22 25M272 71V37m0 0-17 34m17-34 17 34" /><path d="M82 101h212M69 127h307M89 140h265" />
    <circle cx="112" cy="103" r="5" /><circle cx="145" cy="103" r="5" /><circle cx="215" cy="103" r="5" /><circle cx="248" cy="103" r="5" /><circle cx="281" cy="103" r="5" />
    <path d="M20 153c56-12 102 12 154 0s98 13 142 0 68 5 91 0" />
  </svg>;
}

function MapSketch({ compact = false }) {
  return <svg className={`succession-architecture__map-sketch${compact ? ' is-compact' : ''}`} viewBox="0 0 360 190" aria-hidden="true">
    <path d="M18 42c28-20 57-14 79-25 25 7 45 28 67 32 29 6 51-12 79-9 30 4 39 23 70 24 12 18 5 39-11 53-19 16-24 45-57 47-23-9-31-36-55-43-24-7-43 14-68 8-24-6-29-31-54-36-23-5-39-22-50-51z" />
    <path d="M45 79c35 2 51 23 78 30 29 8 58-10 85 2 21 10 33 36 62 37M110 27c10 28-2 55 14 78m76-62c-12 23-3 43-10 66" />
    <circle cx="76" cy="82" r="5" /><circle cx="181" cy="105" r="5" /><circle cx="276" cy="67" r="5" /><path className="is-dashed" d="M76 82 181 105 276 67" />
    <path d="M305 132h34m-17-17v34m-12-5 24-24m-24 0 24 24" />
  </svg>;
}

function RadarSketch() {
  return <svg className="succession-architecture__radar" viewBox="0 0 240 180" aria-hidden="true">
    <path d="M120 20 187 59v78l-67 39-67-39V59z" /><path d="M120 47 164 72v52l-44 26-44-26V72zM120 75l22 13v26l-22 13-22-13V88z" />
    <path d="M120 20v156M53 59l134 78M187 59 53 137" /><circle cx="120" cy="20" r="6" /><circle cx="187" cy="59" r="6" /><circle cx="187" cy="137" r="6" />
    <circle cx="120" cy="176" r="6" /><circle cx="53" cy="137" r="6" /><circle cx="53" cy="59" r="6" />
  </svg>;
}

function BeastGrid() {
  return <div className="succession-architecture__beast-grid" aria-hidden="true">{['I', 'II', 'III', 'IV', 'V', 'VI'].map((label, index) => <span key={label}><i className={`beast-mark beast-mark--${index + 1}`} /><b>{label}</b></span>)}</div>;
}

function ViewCell({ item, onNavigate }) {
  const Icon = item.icon;
  return <a href={routeToHref('succession', item.target, item.params || {})} aria-label={`${item.label}. ${item.action}.`} data-route-action={item.action} className="succession-architecture__view-cell" onClick={(event) => { event.preventDefault(); onNavigate(item.target, item.params || {}); }}>
    <strong>{item.label}</strong><span className="succession-architecture__view-visual"><Icon size={36} strokeWidth={1.25} aria-hidden="true" /><i /><i /><i /></span><small>{item.note}</small>
  </a>;
}

function ArchitecturePanel({ number, title, subtitle, children }) {
  return <section className="succession-architecture__module"><header><span>{number}</span><div><h2>{title}</h2><p>{subtitle}</p></div><i aria-hidden="true" /></header>{children}</section>;
}

function NavigationRail({ onNavigate, id }) {
  return <nav id={id} className="succession-architecture__navigation" aria-label="Top-level Succession navigation"><h2>Top-level navigation</h2>{primaryNavigation.map((item) => {
    const Icon = item.icon;
    return <a key={item.id} href={routeToHref('succession', item.target, item.params || {})} className={item.id === 'story' ? 'is-current' : ''} aria-current={item.id === 'story' ? 'page' : undefined} aria-label={`${item.label}. ${item.action}.`} data-route-action={item.action} onClick={(event) => { event.preventDefault(); onNavigate(item.target, item.params || {}); }}><Icon size={25} strokeWidth={1.35} aria-hidden="true" /><span>{item.label}</span></a>;
  })}</nav>;
}

function StoryModule({ onNavigate }) {
  return <ArchitecturePanel number="1" title="Story Intelligence" subtitle="Comprehensive narrative archive"><nav className="succession-architecture__view-grid succession-hub-tabs" aria-label="Story Intelligence views">{storyViews.map((item) => <ViewCell item={item} onNavigate={onNavigate} key={item.label} />)}</nav></ArchitecturePanel>;
}

function PeopleModule({ onNavigate }) {
  return <ArchitecturePanel number="2" title="People & Power" subtitle="People, factions, and influence systems"><div className="succession-architecture__view-grid is-five">{peopleViews.map((item) => <ViewCell item={item} onNavigate={onNavigate} key={item.label} />)}</div></ArchitecturePanel>;
}

function BlackWhaleModule({ onNavigate }) {
  return <ArchitecturePanel number="3" title="Black Whale" subtitle="The voyage and environments"><div className="succession-architecture__split-grid">
    <a href={routeToHref('succession', 'black-whale')} aria-label="Ship Atlas. Open ship atlas." data-route-action="Open ship atlas" onClick={(event) => { event.preventDefault(); onNavigate('black-whale', {}); }}><strong>Ship Atlas</strong><ShipBlueprint /><small>Decks, rooms, systems, facilities, and personnel zones.</small></a>
    <a href={routeToHref('succession', 'locations')} aria-label="Locations. Open location records." data-route-action="Open location records" onClick={(event) => { event.preventDefault(); onNavigate('locations', {}); }}><strong>Locations</strong><MapSketch /><small>Destinations, sections, and notable areas.</small></a>
  </div></ArchitecturePanel>;
}

function NenModule({ onNavigate }) {
  return <ArchitecturePanel number="4" title="Nen Systems" subtitle="Powers, rituals, and guardian spirits"><div className="succession-architecture__split-grid">
    <a href={routeToHref('succession', 'nen')} aria-label="Nen and Rituals. Open Nen systems." data-route-action="Open Nen systems" onClick={(event) => { event.preventDefault(); onNavigate('nen', {}); }}><strong>Nen & Rituals</strong><RadarSketch /><small>Nen principles, categories, techniques, and rituals.</small></a>
    <a href={routeToHref('succession', 'guardian-spirit-beasts')} aria-label="Guardian Spirit Beasts. Open beast archive." data-route-action="Open beast archive" onClick={(event) => { event.preventDefault(); onNavigate('guardian-spirit-beasts', {}); }}><strong>Guardian Spirit Beasts</strong><BeastGrid /><small>Beasts, abilities, conditions, and contracts.</small></a>
  </div></ArchitecturePanel>;
}

function LibraryRail({ onNavigate }) {
  return <aside className="succession-architecture__library"><h2>Library tools</h2>{libraryTools.map((item) => {
    const Icon = item.icon;
    return <a href={routeToHref('succession', item.target)} aria-label={`${item.label}. ${item.action}.`} data-route-action={item.action} onClick={(event) => { event.preventDefault(); onNavigate(item.target, {}); }} key={item.label}><span><Icon size={31} strokeWidth={1.25} aria-hidden="true" /></span><div><strong>{item.label}</strong><small>{item.note}</small></div></a>;
  })}<div className="succession-architecture__library-map"><MapSketch compact /></div></aside>;
}

function PreservedContracts() {
  return <section className="succession-architecture__contracts"><div className="succession-architecture__contract-sigil"><Scale size={34} strokeWidth={1.3} aria-hidden="true" /></div><div><h2>Preserved contracts <span>(system rules)</span></h2><ul>{preservedContracts.map((contract) => <li key={contract.label} tabIndex="0" title={contract.detail} aria-label={`${contract.label}. ${contract.detail}`}><span>{contract.label}</span></li>)}</ul></div><div className="succession-architecture__integrity-seal"><LockKeyhole size={28} strokeWidth={1.3} aria-hidden="true" /><b>System integrity</b><small>Continuity locked</small></div></section>;
}

function FooterSpecifications() {
  return <div className="succession-architecture__footer-specs"><section><h2>Legend</h2><ul><li><i className="is-solid" />Section</li><li><i />Sub-view</li><li><span>≡</span>Data set</li><li><GitBranch size={13} />Relation</li><li><ExternalLink size={13} />External link</li></ul></section><section><h2>Notes</h2><p>This approved record defines structure, routes, and shared system contracts.</p><p><b>Locked:</b> Phase 3 changes destination workspaces, not this portal.</p></section><section><h2>Reference grid</h2><div className="succession-architecture__reference-grid"><span>12px</span><b /><i /></div></section></div>;
}

function PageSkeleton({ onNavigate, onOpenSearch }) {
  return <section className="succession-architecture__skeleton-block"><div className="succession-architecture__callouts is-left"><p><b>Top header</b><span>Section header,<br />global utilities</span></p><p><b>Sidebar</b><span>Top-level navigation<br />persistent</span></p><p><b>Breadcrumb</b><span>Contextual path<br />within section</span></p><p><b>Timeline / map area</b><span>Temporal and spatial<br />context support</span></p></div>
    <div className="succession-architecture__page-skeleton"><header><strong>Succession Contest</strong><button type="button" className="succession-button" data-route-action="Search archive" onClick={onOpenSearch}>Search archive… <Search size={13} /></button></header><div className="succession-architecture__skeleton-body"><nav aria-label="Skeleton navigation">{primaryNavigation.map((item) => { const Icon = item.icon; return <button type="button" aria-label={`${item.label}. ${item.action}.`} data-route-action={item.action} onClick={() => onNavigate(item.target, item.params || {})} key={item.id}><Icon size={18} strokeWidth={1.35} /></button>; })}</nav><main><ol><li>Home</li><li>Succession Contest</li><li><button type="button" onClick={() => onNavigate('story', { mode: 'workspace' })}>Story Intelligence</button></li><li><button type="button" onClick={() => onNavigate('timeline', {})}>Timeline</button></li></ol><div className="succession-architecture__skeleton-tabs">{storyViews.map((item) => <button type="button" className={item.target === 'timeline' ? 'is-current' : ''} aria-current={item.target === 'timeline' ? 'page' : undefined} onClick={() => onNavigate(item.target, item.params || {})} key={item.label}>{item.label}</button>)}</div><section><button type="button" className="succession-architecture__mock-content succession-architecture__skeleton-shortcut" aria-label="Open timeline workspace" data-route-action="Open timeline" onClick={() => onNavigate('timeline', {})}><h3>Timeline: Key Moments</h3><span>{[1, 2, 3, 4].map((item) => <i key={item}><b /><em /></i>)}</span></button><button type="button" className="succession-architecture__map-shortcut" aria-label="Open Black Whale locations" data-route-action="Open locations" onClick={() => onNavigate('locations', {})}><MapSketch compact /></button></section><footer><button type="button" className="succession-architecture__timeline-shortcut" aria-label="Open timeline workspace" onClick={() => onNavigate('timeline', {})}>{['1010', '1015', '1020', '1025', '1030', '1035'].map((year) => <span key={year}><i />{year}</span>)}</button><button type="button" className="succession-architecture__map-shortcut" aria-label="Open Ship Atlas" onClick={() => onNavigate('black-whale', {})}><MapSketch compact /></button></footer></main><aside><h3>Related entity</h3><button type="button" aria-label="Open character archive" data-route-action="Open characters" onClick={() => onNavigate('characters', {})}><Users size={27} /><span /><span /></button><h3>Key data</h3>{[1, 2, 3, 4].map((item) => <p key={item}><i /><span /></p>)}</aside></div></div>
    <div className="succession-architecture__callouts is-right"><p><b>Dossier rail</b><span>Contextual details,<br />related entities,<br />quick data.</span></p></div></section>;
}

export default function SuccessionArchitectureBoard({ spoilerLimit, onNavigate, onExitArchive, onOpenSearch }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => { document.body.classList.add('succession-architecture-mode'); return () => document.body.classList.remove('succession-architecture-mode'); }, []);
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => drawerRef.current?.querySelector('a,button')?.focus(), 30);
    const handleKey = (event) => { if (event.key !== 'Escape') return; event.preventDefault(); setDrawerOpen(false); window.setTimeout(() => menuButtonRef.current?.focus(), 0); };
    document.addEventListener('keydown', handleKey);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); };
  }, [drawerOpen]);

  return <article className="succession-archive succession-architecture-board is-architecture-locked" data-archive-route="story" data-archive-hub="story" data-architecture-status="approved" data-architecture-version="1.0"><a className="succession-archive__skip-link" href="#succession-workspace-content">Skip to architecture</a><span className="sr-only" role="status" aria-live="polite">Approved Succession Contest architecture board loaded. Reading boundary Chapter {spoilerLimit}.</span>
    <div className="succession-archive__mobile-bar"><button ref={menuButtonRef} type="button" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen} aria-controls="succession-mobile-navigation"><Menu size={19} /> Archive</button><span>Succession Contest</span><button type="button" onClick={onOpenSearch} aria-label="Search Succession Contest Archive"><Search size={18} /></button></div>
    <div id="succession-workspace-content" className="succession-archive__content" role="region" aria-label="Approved Succession Contest architecture" tabIndex="-1"><div className="succession-architecture__sheet"><i className="succession-architecture__corner is-nw" aria-hidden="true" /><i className="succession-architecture__corner is-ne" aria-hidden="true" /><i className="succession-architecture__corner is-sw" aria-hidden="true" /><i className="succession-architecture__corner is-se" aria-hidden="true" />
      <header className="succession-architecture__masthead"><button type="button" className="succession-architecture__identity" aria-label="Exit the Succession architecture portal" data-route-action="Exit architecture" onClick={onExitArchive}><span><Ship size={27} strokeWidth={1.25} aria-hidden="true" /></span><div><strong>Kakin Empire Archive</strong><small>Information architecture record<br />Approved — Phase 2 locked</small></div></button><div className="succession-architecture__title"><h1>Succession Contest</h1><p>Approved architecture for section redesign</p></div><div className="succession-architecture__document-meta"><dl><div><dt>Architecture doc.</dt><dd>SC–IA–01</dd></div><div><dt>Date</dt><dd>08.01.2026</dd></div><div><dt>Version</dt><dd>1.0</dd></div><div><dt>Status</dt><dd>Approved</dd></div></dl><span>Approved</span><div className="succession-architecture__stamp"><b>Approved</b><small>SC–IA–01 · V1.0</small></div></div></header>
      <div className="succession-architecture__primary-grid"><aside className="succession-architecture__left-column"><NavigationRail id="succession-desktop-navigation" onNavigate={onNavigate} /><div className="succession-architecture__ship-portrait"><ShipBlueprint /><small>The Black Whale · Kakin Empire flagship</small></div></aside><main className="succession-architecture__modules"><StoryModule onNavigate={onNavigate} /><PeopleModule onNavigate={onNavigate} /><BlackWhaleModule onNavigate={onNavigate} /><NenModule onNavigate={onNavigate} /></main><LibraryRail onNavigate={onNavigate} /></div>
      <div className="succession-architecture__lower-grid"><div><PreservedContracts /><FooterSpecifications /></div><PageSkeleton onNavigate={onNavigate} onOpenSearch={onOpenSearch} /></div><footer className="succession-architecture__document-footer"><span>Architecture approved · V1.0</span><span>Reading boundary: Chapter {spoilerLimit}</span><span>Phase 3 destinations only</span></footer>
    </div></div>
    {drawerOpen && <div className="succession-drawer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}><aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Succession Archive navigation"><header><div><span>Kakin Empire Archive</span><strong>Succession Contest</strong></div><button type="button" onClick={() => { setDrawerOpen(false); window.setTimeout(() => menuButtonRef.current?.focus(), 0); }} aria-label="Close archive navigation"><X size={20} /></button></header><NavigationRail id="succession-mobile-navigation" onNavigate={(target, params) => { setDrawerOpen(false); onNavigate(target, params); }} /></aside></div>}
  </article>;
}
