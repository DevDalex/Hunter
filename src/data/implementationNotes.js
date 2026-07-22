import { archiveDesignSystemStats } from './archiveDesignSystem.js';
import { formatPerformanceBudget, performanceBudgets } from './performanceBudgets.js';

export const IMPLEMENTATION_NOTES_VERSION = 'Phase 6F handoff · Phase 8A current release · Batch 12 design system · July 20, 2026';

export const implementationSections = [
  {
    id: 'architecture', label: 'Architecture', title: 'Four workspaces, one lightweight shell',
    summary: 'Home, Series, Succession, and Reference share one route shell, while large research datasets load only when a reader opens that workspace.',
    owner: 'Navigation and route composition',
    files: ['src/data/routeManifest.js', 'src/lib/appRouter.js', 'src/App.jsx', 'src/components/WorkspaceNav.jsx'],
    decisions: [['Clean history routes', 'Reader-facing pages use clean paths with direct-reload fallback; legacy hash routes remain parseable.'], ['Route boundaries', 'Chapter, Succession, search, and encyclopedia systems stay lazy-loaded.'], ['Compact navigation', 'High-frequency destinations stay visible while less common pages remain in workspace navigation.']],
    checks: ['A clean route resolves after direct reload.', 'Query parameters preserve selected records.', 'Legacy hashes upgrade safely.', 'No large research dataset enters the startup shell.'],
  },
  {
    id: 'schema', label: 'Content schema', title: 'Stable identities and reusable relationships',
    summary: 'Chapters, people, places, abilities, factions, objects, conflicts, and relationships use stable identifiers and centralized status/source records.',
    owner: 'Structured research data',
    files: ['src/data/entityRegistry.js', 'src/data/entityIds.js', 'src/data/encyclopedia.js', 'src/data/chapters.js'],
    decisions: [['Stable IDs', 'Records are linked by IDs instead of display text.'], ['Central status', 'Confirmed death and exceptional body states resolve from shared identity records.'], ['Depth labels', 'Catalogue identity, phase context, chapter research, and evidence state remain distinct.']],
    checks: ['IDs are unique.', 'Local factual records have approved sources.', 'Unknown values stay unknown.'],
  },
  {
    id: 'evidence', label: 'Evidence rules', title: 'Hunterpedia-only sourcing with explicit confidence',
    summary: 'Hunterpedia/Fandom remains the factual source boundary; analysis and visual organization are labelled separately from canon claims.',
    owner: 'Source and confidence policy',
    files: ['src/data/bibliography.js', 'src/data/evidenceStates.js', 'src/data/reviewQueue.js', 'src/data/contentIntegrity.js'],
    decisions: [['Direct records', 'Links point to relevant pages rather than generic homepages.'], ['Fact versus analysis', 'Diagrams organize sourced facts but do not become canon statistics.'], ['Review boundary', 'Current-arc copy carries chapter endpoint and evidence state.']],
    checks: ['Stored links use approved hosts.', 'Current-arc records stay within Chapter 413.', 'Ambiguous material uses uncertainty labels.'],
  },
  {
    id: 'design-system', label: 'Design system', title: 'Reusable archive UI primitives',
    summary: 'Batch 12 provides shared sections, cards, evidence badges, status pills, source stacks, and ledgers so future pages stop becoming one-off layouts.',
    owner: 'Archive UI library',
    files: ['src/data/archiveDesignSystem.js', 'src/components/ArchiveUI.jsx', 'src/styles/archive-system.css', 'docs/DESIGN-SYSTEM.md', 'scripts/audit-design-system.mjs'],
    decisions: [['Primitive first', 'Use ArchiveUI before inventing a new badge, source block, card, status pill, or ledger.'], ['Evidence vocabulary', 'EvidenceBadge mirrors the governance evidence-state language.'], ['Internal foundation', 'The component library remains audited without a reader-facing design-system demonstration on the home page.']],
    checks: [`${archiveDesignSystemStats.primitives} primitives and ${archiveDesignSystemStats.semanticTones} tones stay registered.`, 'SourceStack keeps safe Hunterpedia/Fandom external links.', 'audit:design-system remains in aggregate preflight.'],
  },
  {
    id: 'media-status', label: 'Media & status', title: 'No fake imagery, no ambiguous death marks',
    summary: 'Every displayed image is entity-specific and source-linked. Missing media collapses cleanly, and a red X is reserved for confirmed death.',
    owner: 'Media and identity integrity',
    files: ['src/data/mediaRegistry.js', 'src/data/priorityMedia.generated.js', 'src/data/blackWhaleMedia.generated.js', 'scripts/stabilize-media.mjs', 'src/components/SafeImage.jsx'],
    decisions: [['Three media states', 'Local, verified-remote, and text-only are distinct.'], ['Intrinsic media data', 'Local images carry dimensions, focal point, source, storage state, and review date.'], ['Written body state', 'Possession, detention, missing, and unknown states are text, not death icons.']],
    checks: ['No unrelated fallback image.', 'Broken images leave no empty frame.', 'Death marks require written status.'],
  },
  {
    id: 'interaction', label: 'Interaction', title: 'Keyboard, touch, motion, and responsive density',
    summary: 'Navigation, search, drawers, filters, and atlases remain usable without hover, precise pointer control, or animation.',
    owner: 'Accessible interaction design',
    files: ['src/components/Header.jsx', 'src/components/ArchiveSearch.jsx', 'src/components/ChapterDrawer.jsx', 'src/components/FamilyTree.jsx', 'src/components/SuccessionDossier.jsx', 'scripts/accessibility-qa.mjs'],
    decisions: [['Focus management', 'Menus and dialogs establish, trap, close, and restore focus.'], ['Roving tabs', 'Tab sets support Arrow Left/Right, Home, and End.'], ['Reduced motion', 'Programmatic scrolling and loading animation respect OS motion settings.']],
    checks: ['Controls have visible focus.', 'Touch targets meet the maintained floor.', 'Diagrams have text or ledger alternatives.'],
  },
  {
    id: 'performance', label: 'Performance', title: 'Load the archive a reader actually requested',
    summary: 'The startup shell stays separate from large research collections, and representative routes are measured under desktop and constrained-mobile profiles.',
    owner: 'Bundle and media loading',
    files: ['src/data/performanceBudgets.js', 'vite.config.js', 'src/App.jsx', 'src/lib/routePreload.js', 'scripts/audit-performance.mjs', 'scripts/performance-qa.mjs'],
    decisions: [['Lazy workspaces', 'Sixteen UI boundaries, two Story pages, and three search shards remain dynamic.'], ['Intent prefetch', 'Routes load after focus, pointer intent, or navigation.'], ['Deferred media', 'Only first-viewport portraits are eager.']],
    checks: [`Entry ${formatPerformanceBudget(performanceBudgets.entryJs)} bytes, startup JS ${formatPerformanceBudget(performanceBudgets.startupJs)} bytes, startup CSS ${formatPerformanceBudget(performanceBudgets.startupCss)} bytes, and JS chunk ${formatPerformanceBudget(performanceBudgets.javascriptChunk)} bytes remain canonical budgets.`, 'Twenty-one dynamic entries remain separated.', 'No PWA or service worker is introduced.'],
  },
  {
    id: 'runbooks', label: 'Update runbooks', title: 'Repeatable updates instead of one-off edits',
    summary: 'New chapters, portraits, locations, Succession changes, UI primitives, and system records each have a canonical edit path and verification step.',
    owner: 'Ongoing archive maintenance',
    files: ['public/implementation-notes.md', 'README.md', 'scripts/audit-implementation.mjs', 'scripts/run-build-preflight.mjs'],
    decisions: [['Trigger-based review', 'Maintenance starts from a source, route, media, UI, taxonomy, or audit-contract change.'], ['Canonical first', 'Update the central record before consumers.'], ['Aggregate preflight', 'All sixteen independent pre-build audits run even when one fails.']],
    checks: ['Follow the relevant matrix row.', 'Update review date/change log when applicable.', 'Run aggregate preflight before packaging.'],
  },
  {
    id: 'release', label: 'Release gate', title: 'Definition of done for every archive checkpoint',
    summary: 'A change is complete only when facts, images, links, responsive presentation, accessibility, performance, documentation, and hosted artifact agree.',
    owner: 'QA and release discipline',
    files: ['src/data/releaseReadiness.js', 'scripts/run-build-preflight.mjs', 'scripts/audit-release.mjs', 'scripts/visual-qa.mjs', 'scripts/performance-qa.mjs', 'scripts/package-release.mjs'],
    decisions: [['Automated gate', 'Schema, ranges, IDs, sources, media, layout, packages, and handbook structure fail when inconsistent.'], ['Browser matrix', 'All 26 routes render at desktop, tablet, and phone widths.'], ['Immutable checkpoint', 'The deployed version must match the validated source state.']],
    checks: ['All sixteen independent pre-build audits pass.', 'Visual and accessibility browser matrices pass when required.', 'The final hosted deployment reaches terminal success.'],
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
  { id: 'navigation', area: 'Route/navigation change', trigger: 'A new workspace or page is added', canonical: 'src/data/routeManifest.js', companions: 'src/App.jsx · src/components/WorkspaceNav.jsx · src/components/Header.jsx · src/lib/appRouter.js', action: 'Register the route metadata, rendering branch, active state, breadcrumb, and selector entry.', verify: 'Unique route, direct reload, legacy upgrade, keyboard path, route announcement, and bundle split.' },
  { id: 'design', area: 'Layout/readability change', trigger: 'Dense content, collision, crop, or small-text defect is found', canonical: 'src/styles.css', companions: 'src/styles/final-polish.css · src/components/SafeImage.jsx · src/components/PageIntro.jsx · scripts/audit-layout.mjs · scripts/visual-qa.mjs', action: 'Fix the responsible component rule at all maintained widths without reviving placeholders or app-only behavior.', verify: 'Static layout audit and 26-route × 3-viewport visual matrix.' },
  { id: 'design-system', area: 'Design-system primitive or tone', trigger: 'A reusable card, badge, source block, status token, section shell, or ledger is needed', canonical: 'src/data/archiveDesignSystem.js', companions: 'src/components/ArchiveUI.jsx · src/styles/archive-system.css · docs/DESIGN-SYSTEM.md · scripts/audit-design-system.mjs', action: 'Update the registry, component, CSS, documentation, and audit together.', verify: 'Design-system audit and reader-facing showcase exclusion.' },
  { id: 'release-docs', area: 'Release documentation', trigger: 'Any maintained capability changes', canonical: 'public/implementation-notes.md', companions: 'README.md · docs/FINAL-POLISH.md · docs/ARCHIVE-GOVERNANCE.md · docs/DESIGN-SYSTEM.md · src/data/referenceEntities.js', action: 'Update the handbook, visible implementation notes, review date when applicable, and change log.', verify: 'Implementation audit passes and current counts match executable contracts.' },
];

export const releaseChecklist = [
  { id: 'content', label: 'Content integrity', items: [['content-boundary', 'Chapter endpoint, titles, ranges, and timeline ceilings agree.'], ['content-sources', 'New factual records use direct Hunterpedia/Fandom sources.'], ['content-depth', 'Catalogue, phase-context, and chapter-specific depth are labelled honestly.']] },
  { id: 'identity-media', label: 'Identity & media', items: [['identity-central', 'Status and aliases resolve from central records.'], ['media-subject', 'Every image depicts the named subject and carries a source path.'], ['media-failure', 'Broken media collapses without placeholders.']] },
  { id: 'experience', label: 'Responsive experience', items: [['experience-desktop', 'Dense views remain legible at desktop width.'], ['experience-mobile', 'Narrow-browser safeguards still work without expanding mobile redesign scope.'], ['experience-overlap', 'Images, tooltips, connectors, and copy do not collide.']] },
  { id: 'design-system', label: 'Design system', items: [['ui-primitives', 'Reusable primitives cover sections, cards, evidence badges, status pills, source stacks, and ledgers.'], ['ui-tones', 'Evidence UI uses the shared semantic-tone vocabulary.'], ['ui-gate', 'audit:design-system remains part of aggregate preflight.']] },
  { id: 'performance-release', label: 'Performance & release', items: [['performance-boundary', 'Heavy data remains behind a route or on-demand boundary.'], ['release-audits', 'Aggregate preflight, release, and performance audits pass.'], ['release-hosted', 'The exact validated artifact is deployed and directly verified.']] },
];

export const completionCriteria = [
  ['Visible scope', 'The site explains its Chapter 413 boundary and varying research depth without claiming false completeness.'],
  ['Maintainable model', 'Stable IDs, statuses, bibliography records, evidence states, sources, relationships, and design-system primitives have canonical owners.'],
  ['Repeatable updates', 'Thirteen maintenance runbooks cover the archive’s recurring change types.'],
  ['Media integrity', 'Local, verified-remote, and text-only media states are documented and audited.'],
  ['Accessible shell', 'Keyboard, touch, focus, reduced-motion, and nonvisual alternatives have explicit rules.'],
  ['Performance boundary', 'Large research collections remain separate from the startup shell under explicit budgets.'],
  ['Build gate', 'Sixteen independent audits run through one aggregate preflight before packaging.'],
  ['Public handoff', 'The maintainable source ZIP includes source, scripts, architecture, documentation, hosting identity, and current maintenance instructions.'],
];

export const implementationStats = {
  sections: implementationSections.length,
  runbooks: maintenanceMatrix.length,
  checklistItems: releaseChecklist.reduce((total, group) => total + group.items.length, 0),
  criteria: completionCriteria.length,
};
