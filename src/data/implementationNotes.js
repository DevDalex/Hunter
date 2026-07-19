export const IMPLEMENTATION_NOTES_VERSION = 'Phase 6F handoff · Phase 6G final gate · Phase 7A–7G release hardening · July 15, 2026';

export const implementationSections = [
  {
    id: 'architecture',
    label: 'Architecture',
    title: 'Four workspaces, one lightweight shell',
    summary: 'Home, Series, Succession, and Reference share one route shell, but their research datasets load only when a reader opens that workspace.',
    owner: 'Navigation and route composition',
    files: ['src/data/routeManifest.js', 'src/App.jsx', 'src/components/WorkspaceNav.jsx'],
    decisions: [
      ['Hash routes', 'Every study view has a shareable route without requiring a server-side router or losing the static hosting model.'],
      ['Route boundaries', 'Chapter, Succession, search, and encyclopedia systems are lazy-loaded so the home page does not import the full archive.'],
      ['Compact navigation', 'Five high-frequency destinations stay visible; less common pages remain available through a native section selector.'],
    ],
    checks: ['A route must resolve after a direct reload.', 'Changing a query parameter must preserve the selected record.', 'No new research dataset belongs in the startup shell.'],
  },
  {
    id: 'schema',
    label: 'Content schema',
    title: 'Stable identities and reusable relationships',
    summary: 'Chapters, people, places, abilities, factions, objects, conflicts, and relationships use stable identifiers and centralized status/source records.',
    owner: 'Structured research data',
    files: ['src/data/entityRegistry.js', 'src/data/encyclopedia.js', 'src/data/chapters.js'],
    decisions: [
      ['Stable IDs', 'A record is linked by an ID rather than by display text, preventing spelling changes from breaking cross-links.'],
      ['Central status', 'Confirmed death and exceptional body states resolve from shared identity records instead of separate card-specific flags.'],
      ['Depth labels', 'Catalogue identity, arc-phase context, and chapter-specific research are visibly distinct coverage levels.'],
    ],
    checks: ['IDs are unique inside every entity collection.', 'Every local factual record has a direct Hunterpedia source.', 'Unknown values remain unknown rather than being inferred into fact.'],
  },
  {
    id: 'evidence',
    label: 'Evidence rules',
    title: 'Hunterpedia-only sourcing with explicit confidence',
    summary: 'Hunterpedia/Fandom is the project’s factual source boundary. Site organization and visual analysis are labeled separately from canon claims.',
    owner: 'Source and confidence policy',
    files: ['src/data/referenceEntities.js', 'src/data/contentIntegrity.js', 'src/components/SourceRegistry.jsx'],
    decisions: [
      ['Direct records', 'Links point to the relevant chapter, person, ability, location, or file page—not merely a generic homepage.'],
      ['Fact versus analysis', 'Editorial diagrams may organize sourced facts, but they do not become a new canon statistic.'],
      ['Review boundary', 'Current-arc copy carries a visible chapter endpoint and developing-state language.'],
    ],
    checks: ['All stored research links use approved Hunterpedia/Fandom hosts.', 'Current-arc records never exceed the maintained chapter boundary.', 'Ambiguous and disputed material uses written uncertainty labels.'],
  },
  {
    id: 'media-status',
    label: 'Media & status',
    title: 'No fake imagery, no ambiguous death marks',
    summary: 'Every displayed image is entity-specific and source-linked. Missing media collapses cleanly, and a red X is reserved for confirmed death.',
    owner: 'Media and identity integrity',
    files: ['src/data/mediaRegistry.js', 'src/data/priorityMedia.generated.js', 'scripts/stabilize-media.mjs', 'src/components/SafeImage.jsx'],
    decisions: [
      ['Three media states', 'Locally stored, explicitly verified remote, and intentionally text-only are tracked separately. Runtime resolution is disabled.'],
      ['Intrinsic portrait data', 'Every local priority portrait carries width, height, focal point, article source, image source, and review date.'],
      ['Contain before crop', 'Reference and chapter imagery is contained when cropping could remove meaningful manga information.'],
      ['Written body state', 'Possession, displacement, duplicate beasts, detention, and unknown states are written in text rather than represented as death.'],
    ],
    checks: ['No generated or unrelated fallback is shown as canon media.', 'Broken images leave no empty placeholder frame.', 'Every confirmed-death overlay has a matching written label.'],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    title: 'Keyboard, touch, motion, and responsive density',
    summary: 'Navigation, search, drawers, filters, and visual atlases are designed to remain usable without hover, precise pointer control, or animation.',
    owner: 'Accessible interaction design',
    files: ['src/components/Header.jsx', 'src/components/ArchiveSearch.jsx', 'src/components/ChapterDrawer.jsx', 'src/components/FamilyTree.jsx', 'src/components/SuccessionDossier.jsx', 'scripts/accessibility-qa.mjs'],
    decisions: [
      ['Focus management', 'Menus and dialogs establish focus, trap it when modal, close with Escape, and return focus to the trigger.'],
      ['Roving tabs', 'Family-tree and Succession dossier tab sets support Arrow Left/Right, Home, and End while keeping one tab in the ordinary keyboard sequence.'],
      ['Native selectors', 'Long mobile section lists use native selects instead of horizontal tab walls.'],
      ['Reduced motion', 'Programmatic scrolling and loading animation respect the operating-system motion preference.'],
    ],
    checks: ['Every interactive control has a visible focus state.', 'Touch targets reach the maintained mobile size floor.', 'Graphics have a nonvisual label, ledger, or list equivalent.'],
  },
  {
    id: 'performance',
    label: 'Performance',
    title: 'Load the archive a reader actually requested',
    summary: 'The site separates the small shell from large research collections, preloads only after clear navigation intent, and measures representative routes under desktop and constrained-mobile conditions.',
    owner: 'Bundle and media loading',
    files: ['vite.config.js', 'src/App.jsx', 'src/lib/routePreload.js', 'src/data/homeHighlights.js', 'scripts/audit-performance.mjs', 'scripts/performance-qa.mjs'],
    decisions: [
      ['Lazy workspaces', 'Every major research surface has its own production chunk.'],
      ['Audited shell totals', 'Home statistics are lightweight constants checked against the full datasets during the build.'],
      ['Intent prefetch', 'A route begins loading after focus, pointer intent, or deliberate navigation—not simply because a link exists.'],
      ['Deferred media', 'Only first-viewport portraits are eager; archive and gallery images remain lazy by default.'],
    ],
    checks: ['The application entry remains at or below 55KB and its startup JavaScript closure at or below 260KB.', 'Twenty reader routes remain lazy and no large index enters the home shell.', 'Six representative routes pass both desktop and constrained-mobile readiness profiles without material layout shift.', 'No manifest, service worker, install prompt, or other PWA behavior is introduced.'],
  },
  {
    id: 'runbooks',
    label: 'Update runbooks',
    title: 'Repeatable updates instead of one-off edits',
    summary: 'New chapters, portraits, locations, Succession changes, and system records each have a canonical edit path and a required verification step.',
    owner: 'Ongoing archive maintenance',
    files: ['public/implementation-notes.md', 'README.md', 'scripts/audit-implementation.mjs'],
    decisions: [
      ['Trigger-based review', 'Maintenance starts from a source change: new chapter, revised status, new image, route revelation, or taxonomy change.'],
      ['Canonical first', 'Update the central identity or source record before changing any visual consumer.'],
      ['Build-blocking notes', 'The handbook and every canonical path named by the maintenance matrix are checked during production builds.'],
    ],
    checks: ['Follow the relevant matrix row before editing a consumer component.', 'Update the review date and change log for factual boundaries.', 'Run both content and implementation audits before a checkpoint.'],
  },
  {
    id: 'release',
    label: 'Release gate',
    title: 'Definition of done for every archive checkpoint',
    summary: 'A change is complete only when its facts, images, links, responsive presentation, accessibility, performance boundary, documentation, and hosted artifact agree.',
    owner: 'QA and release discipline',
    files: ['src/data/releaseReadiness.js', 'scripts/audit-release.mjs', 'scripts/audit-layout.mjs', 'scripts/audit-polish.mjs', 'scripts/visual-qa.mjs', 'scripts/performance-qa.mjs', 'scripts/package-release.mjs'],
    decisions: [
      ['Automated gate', 'Schema, ranges, identities, routes, sources, media accounting, storage boundaries, layout contracts, package contents, and handbook structure fail the build when inconsistent.'],
      ['Browser matrix', 'All 26 reader-facing routes are rendered at desktop, tablet, and phone-width browser viewports and scanned for runtime, overflow, pending/broken media, media-copy overlap, type, and interaction defects.'],
      ['Immutable checkpoint', 'The deployed version must correspond to the exact validated source state.'],
    ],
    checks: ['Content, implementation, readability, layout, accessibility, media, polish, performance, and final-release audits pass without warnings hidden as success.', 'The 20-route × 3-viewport browser matrix passes before the checkpoint, with key dense screens also reviewed visually.', 'The 20-route × 2-viewport WCAG matrix and critical keyboard flows pass.', 'The production build emits the client, worker, hosting manifest, release manifest, Sites-ready source, and direct-open standalone package.', 'The final hosted deployment reaches a directly verified terminal success state.'],
  },
];

export const maintenanceMatrix = [
  { id: 'chapter-endpoint', area: 'New chapter endpoint', trigger: 'Hunterpedia publishes a numbered chapter page', canonical: 'src/data/chapterTitles.js', companions: 'src/data/chapters.js · src/data/archiveMeta.js', action: 'Append the exact title, extend the boundary, add verified metadata, and update current-arc research.', verify: 'Continuous chapter sequence, arc range, timeline ceiling, and shell totals.' },
  { id: 'chapter-detail', area: 'Chapter research', trigger: 'A chapter gains or revises synopsis/metadata', canonical: 'src/data/chapters.js', companions: 'src/data/seriesResearch.js · src/data/successionDossier.js', action: 'Keep chapter-specific evidence separate from arc-phase context and link the direct chapter source.', verify: 'Research-depth label, source, chronology link, and spoiler boundary.' },
  { id: 'identity', area: 'Character identity/status', trigger: 'Name, affiliation, death, or exceptional state changes', canonical: 'src/data/entityRegistry.js', companions: 'src/data/encyclopedia.js · src/data/successionRoster.js', action: 'Change the central identity first; let cards, trees, ledgers, and overlays resolve from it.', verify: 'No duplicate canonical name; red X only for confirmed death.' },
  { id: 'portrait', area: 'Character portrait', trigger: 'A verified Hunterpedia image becomes available or breaks', canonical: 'src/data/characters.js', companions: 'src/data/priorityMedia.generated.js · scripts/stabilize-media.mjs · src/data/mediaRegistry.js · src/components/SafeImage.jsx', action: 'Record the verified article/file source, run the stabilizer, and retain dimensions and a reviewed focal point.', verify: 'Local file exists; dimensions match; approved source; correct subject; graceful failure; no unrelated fallback or runtime lookup.' },
  { id: 'world', area: 'World/location atlas', trigger: 'A location, hierarchy, or travel connection is added', canonical: 'src/data/worldAtlas.js', companions: 'src/lib/hunterpediaLocations.js · src/components/WorldAtlas.jsx', action: 'Assign a stable place ID, parent, region, story role, source, and route connection.', verify: 'No parent cycle; image and copy do not overlap; mobile hierarchy remains readable.' },
  { id: 'ship', area: 'Black Whale space/route', trigger: 'A room, closure, passage, or occupant changes', canonical: 'src/data/blackWhale.js', companions: 'src/components/BlackWhaleGuide.jsx · src/data/successionTimeline.js', action: 'Update location metadata, marker/route state, occupancy, access, chapters, and operational status.', verify: 'Map marker, text inspector, room ledger, and timeline all agree.' },
  { id: 'succession', area: 'Succession event', trigger: 'A new voyage event or corrected chronology appears', canonical: 'src/data/successionTimeline.js', companions: 'src/data/successionDossier.js · src/data/successionArchive.js', action: 'Add time precision, day, chapter, room, participants, cause, result, consequence, and confidence.', verify: 'No event exceeds the chapter boundary; analysis stays separate from canon time.' },
  { id: 'nen', area: 'Nen mechanic/ability', trigger: 'A rule, condition, user, or counter is revealed', canonical: 'src/data/nenEncyclopedia.js', companions: 'src/data/encyclopedia.js · src/data/successionDossier.js', action: 'Update user, category, debut, mechanics, conditions, limits, uses, and uncertainty.', verify: 'Confirmed mechanics and reader inference remain visibly distinct.' },
  { id: 'systems', area: 'Faction/relationship/object trail', trigger: 'Authority, alliance, custody, or evidence changes', canonical: 'src/data/systemsDesk.js', companions: 'src/data/encyclopedia.js · src/components/SystemsDesk.jsx', action: 'Update the stable record, directional relationship, time scope, and source.', verify: 'Organization level, relation type, story period, and current state are present.' },
  { id: 'navigation', area: 'Route/navigation change', trigger: 'A new workspace or page is added', canonical: 'src/data/routeManifest.js', companions: 'src/App.jsx · src/components/WorkspaceNav.jsx · src/components/Header.jsx', action: 'Register the route metadata, add its lazy rendering branch, active-state logic, breadcrumb, and compact selector entry.', verify: 'Unique route, direct reload, keyboard path, mobile selector, route announcement, and bundle split.' },
  { id: 'design', area: 'Layout/readability change', trigger: 'Dense content, collision, crop, or small-text defect is found', canonical: 'src/styles.css', companions: 'src/components/SafeImage.jsx · src/components/PageIntro.jsx · scripts/audit-layout.mjs · scripts/visual-qa.mjs', action: 'Fix the responsible component rule at all maintained browser widths without reviving placeholders or adding app-only behavior.', verify: 'Run the static layout audit and the 20-route × 3-viewport browser matrix, then review dense screens, focus, reduced motion, and long-name stress cases.' },
  { id: 'release-docs', area: 'Release documentation', trigger: 'Any maintained capability changes', canonical: 'public/implementation-notes.md', companions: 'README.md · src/data/referenceEntities.js', action: 'Update the handbook, visible implementation notes, review date when applicable, and change log.', verify: 'Implementation audit passes and every documented canonical path exists.' },
];

export const releaseChecklist = [
  {
    id: 'content', label: 'Content integrity', items: [
      ['content-boundary', 'Chapter endpoint, titles, ranges, and timeline ceilings agree.'],
      ['content-sources', 'New factual records use direct Hunterpedia/Fandom sources.'],
      ['content-depth', 'Catalogue, phase-context, and chapter-specific depth are labeled honestly.'],
    ],
  },
  {
    id: 'identity-media', label: 'Identity & media', items: [
      ['identity-central', 'Status and aliases resolve from the central identity record.'],
      ['media-subject', 'Every image depicts the named subject and carries a source path.'],
      ['media-failure', 'Broken or unavailable imagery collapses without a placeholder.'],
    ],
  },
  {
    id: 'experience', label: 'Responsive experience', items: [
      ['experience-desktop', 'Dense views remain legible at desktop width.'],
      ['experience-mobile', 'Navigation, tables, maps, and cards remain usable on mobile.'],
      ['experience-overlap', 'Images, tooltips, connectors, and copy do not collide.'],
    ],
  },
  {
    id: 'accessibility', label: 'Accessibility', items: [
      ['access-keyboard', 'Every primary action is reachable and operable by keyboard.'],
      ['access-dialog', 'Dialogs trap/return focus and close with Escape.'],
      ['access-alternative', 'Visual diagrams expose a text, table, or ledger equivalent.'],
    ],
  },
  {
    id: 'performance-release', label: 'Performance & release', items: [
      ['performance-boundary', 'Heavy data remains behind a route or on-demand boundary.'],
      ['release-audits', 'Content, implementation, and final-release audits pass.'],
      ['release-hosted', 'The exact validated artifact is deployed and directly verified.'],
    ],
  },
];

export const completionCriteria = [
  ['Visible scope', 'The site explains its Chapter 413 boundary and varying research depth without claiming false completeness.'],
  ['Maintainable model', 'Stable IDs, central statuses, sources, and relationship records have named canonical owners.'],
  ['Repeatable updates', 'Twelve maintenance runbooks cover the archive’s recurring change types.'],
  ['Media integrity', 'Local, verified-remote, and text-only media states are documented and audited; runtime portrait resolution remains disabled.'],
  ['Accessible shell', 'Keyboard, touch, focus, reduced-motion, and nonvisual alternatives have explicit rules.'],
  ['Performance boundary', 'Large research collections remain separate from the startup shell.'],
  ['Build gate', 'Content and implementation audits block inconsistent production artifacts.'],
  ['Public handoff', 'A readable Maintenance page and a downloadable canonical handbook are available.'],
];

export const implementationStats = {
  sections: implementationSections.length,
  runbooks: maintenanceMatrix.length,
  checklistItems: releaseChecklist.reduce((total, group) => total + group.items.length, 0),
  criteria: completionCriteria.length,
};
