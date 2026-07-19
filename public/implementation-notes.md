# Hunter × Hunter Archive — Implementation and Maintenance Handbook

Phase 6F handoff · Phase 6G final release · Phase 7A–7G release hardening · July 15, 2026

Maintained story boundary: Chapter 413

Factual source boundary: Hunterpedia / Fandom only

## Purpose

This handbook is the canonical maintainer handoff for Hunter × Hunter Archive. It explains how the archive is organized, which file owns each kind of information, how changes move through the site, and what must be verified before a hosted checkpoint is considered complete.

It is not a claim that every record has equal research depth. The site deliberately distinguishes:

- Catalogue identity: a stable title, number, source, or name exists.
- Arc-phase context: a chapter is positioned inside a sourced story phase without pretending that the phase roster is an exact scene list.
- Chapter-specific research: the local record contains evidence and writing specific to that chapter.
- Developing current-arc research: facts are maintained through the visible chapter boundary and may change when Hunterpedia updates.

## Architecture

### Workspace topology

The application has four top-level workspaces:

| Workspace | Purpose | Primary owner |
| --- | --- | --- |
| Home | Entry points and lightweight archive totals | `src/components/SiteHome.jsx` |
| Series | Arc navigation, chapter catalogue, progress, and full-series research | `src/components/SeriesWorkspace.jsx` |
| Succession | Royal system, current-arc roster, timeline, Black Whale, abilities, factions, and status ledgers | `src/data/routeManifest.js` plus Succession components |
| Reference | Unified encyclopedia, world, systems, Nen, conflicts, objects, sources, and maintenance | `src/data/routeManifest.js` plus Reference components |

`src/data/routeManifest.js` owns every reader-facing page record, route alias, primary-section set, and dossier-tab mapping. `src/App.jsx` owns route parsing, top-level navigation, spoiler state, and lazy rendering boundaries. Both must remain lightweight; large datasets must not be imported into either.

### Route model

The site uses hash routes so direct links work on the static hosted artifact:

- `#/home`
- `#/series`
- `#/series/research`
- `#/succession/<section>`
- `#/reference/<section>`

Query parameters select records, chapters, rooms, tabs, and searches. A new route is incomplete until it has:

1. Page metadata in `src/data/routeManifest.js`.
2. A lazy component boundary.
3. A breadcrumb.
4. An entry in `src/components/WorkspaceNav.jsx` or the relevant local navigation.
5. A correct active state in `src/components/Header.jsx`.
6. A direct-reload test.
7. A keyboard and mobile-selector test.

### Navigation hierarchy

The top header exposes Series, Succession, Reference, Nen, and Sources. Within a workspace, five high-frequency destinations remain visible on larger screens; less common pages use a native select. Mobile always uses a native section select rather than an overflowing tab wall.

Do not add another permanent primary navigation item unless it represents a true top-level reading mode. Maintenance belongs in Reference → More sections.

## Content schema

### Entity contract

The unified encyclopedia covers characters, factions, locations, Nen, conflicts, objects, relationships, and status/body-state records. Each maintained entity should have:

- Stable `id`.
- Canonical display name.
- Category and kind.
- Concise local summary.
- Direct Hunterpedia source.
- Research-depth label.
- Written status.
- Structured facts.
- Related stable records or names.
- Search tags.
- Media state.

The central identity owner is `src/data/entityRegistry.js`. Do not introduce a character-specific death flag inside a card component. Change the canonical identity and let the encyclopedia, roster, family tree, death ledger, and overlays resolve from it.

### Chapter contract

The numbered chapter sequence is assembled through:

- `src/data/chapterTitles.js` for ordered titles.
- `src/data/chapters.js` for catalogue records and verified chapter metadata.
- `src/data/seriesResearch.js` for completed-arc phase context and chronology.
- `src/data/successionDossier.js` for current-arc chapter research.
- `src/data/archiveMeta.js` for the visible archive boundary and lightweight shell totals.

A chapter record must never be added from an anticipated or placeholder page. The chapter endpoint changes only when Hunterpedia exposes a numbered chapter record.

### Relationship contract

Relationships should be directional, typed, and time-scoped where the story changes them. Prefer reusable records over prose embedded in one component. Relevant fields include:

- `from` and `to`.
- Relationship type.
- Story period or chapter range.
- Active, former, disputed, concealed, or unknown state.
- Direct source.

Blood relations, employer/guard assignments, false loyalty, custody, assassination targets, teacher/student links, mafia sponsorship, possession, and killer/victim links are different relationship types and should not be flattened into one generic connection.

## Source and evidence contract

Hunterpedia/Fandom is the site’s factual source boundary. Editorial organization is allowed, but it must remain visibly separate from canon claims.

### Required source behavior

- Link to the relevant chapter, character, ability, place, group, or file page.
- Keep image attribution tied to the Hunterpedia article or file page.
- Record a review boundary for current-arc material.
- Use “unknown,” “developing,” “ambiguous,” or “disputed” when the source does not settle a fact.
- Do not convert reader inference into a confirmed mechanism.
- Do not present an editorial score, visual grouping, or route diagram as an official Hunterpedia statistic.

### Research-depth language

- Verified: directly supported and stable in the maintained source.
- Developing: supported through the current chapter boundary but subject to revision.
- Inferred: a clearly labeled site interpretation based on cited evidence.
- Unknown: the source has not established the answer.
- Ambiguous/disputed: more than one reading remains viable in the source material.

The source registry and coverage report live in `src/components/SourceRegistry.jsx` and `src/data/referenceEntities.js`. The build-blocking factual checks live in `src/data/contentIntegrity.js`.

## Media and status rules

### Media states

`src/data/mediaRegistry.js` recognizes three legitimate states:

1. Locally stored: a verified Hunterpedia image is shipped with the site and has intrinsic dimensions plus a reviewed focal point.
2. Verified remote: an explicit Hunterpedia/Fandom image URL is stored for a non-priority record.
3. Intentionally text-only: no verified entity-specific image is currently claimed.

Browser-time portrait discovery is disabled. A Hunterpedia article link alone is never treated as an image record.

Never show a generic silhouette, fake manga panel, generated canon portrait, or unrelated image as a substitute. `src/components/SafeImage.jsx` removes failed media from layout. Components must not leave an empty visible image placeholder after failure.

### Image layout

- Use `object-fit: contain` for chapter pages, manga diagrams, maps, and evidence where cropping removes information.
- Portrait cards may use a controlled top-centered crop when the source is a portrait and the full subject remains legible.
- Keep media and body copy in separate layout rows when overlap is possible.
- Provide real dimensions or aspect ratios to reduce layout shift.
- Preserve the direct image/article source.

### Death and exceptional state

A red X means confirmed death only. It must be accompanied by a written “Deceased” label. Do not use the red X for:

- Eliminated from the contest without confirmed death.
- Original body deceased while consciousness remains active elsewhere.
- Body possessed.
- Consciousness displaced.
- Guardian Spirit Beast continuation or duplicate.
- Missing.
- Arrested, detained, or confined.
- Disguised or uncertain identity.
- Unknown status.

Update status in `src/data/entityRegistry.js` before changing any consumer view.

## Accessibility and responsive behavior

### Keyboard contract

- The skip control moves focus into the main archive.
- Header and workspace navigation expose an active page state.
- Global search opens with `/` or Ctrl/Cmd+K outside editing controls.
- Search results support Arrow Down, Arrow Up, Home, End, Enter, and Escape.
- Modal drawers and search trap focus, close with Escape, lock background scrolling, and return focus.
- Every button, link, input, and select has a visible focus indicator.

### Nonvisual contract

- Route changes announce the opened page.
- Filter result counts use a polite live region.
- Red X status always has text.
- Family trees, organization charts, timelines, and ship graphics require a list, inspector, table, or ledger equivalent.
- Controls use accessible names; icons alone are not the label.

### Responsive contract

Maintain desktop, tablet, and mobile behavior. Stress-test long character names, translated ability names, multi-line room names, dense facts, and large tables.

On narrow screens:

- Workspace sections use a native select.
- Touch targets retain the maintained size floor.
- Tables and diagrams scroll inside labeled regions rather than forcing the page width.
- Tooltips are never the only route to information.
- Images remain in their component bounds.

### Motion contract

Programmatic scrolling and decorative loading motion must respect `prefers-reduced-motion`. The experience must remain understandable with animation disabled.

## Performance boundaries

Phase 6E established a small application shell and route-loaded research workspaces. Preserve that architecture.

- `src/App.jsx` may import small route metadata and lightweight audited totals.
- Chapter, Succession, search, and encyclopedia datasets stay behind `lazy()` boundaries.
- Global search data loads only when the search dialog is opened.
- Only first-viewport hero portraits load eagerly.
- Archive, gallery, and card media remains lazy by default.
- `src/data/homeHighlights.js` contains the four lightweight home portraits; the content audit checks them against the full character data.

After a dependency or route change, inspect production chunk output. A new large startup chunk usually indicates that a heavy data import escaped its route boundary.

## Browser-local state

The following are intentionally device-local:

- Studied chapters.
- Spoiler boundary.
- Bookmarks and notes.
- Recently viewed records.
- Media verification has no browser cache; the local portrait files are part of the release.
- Phase 6F release-inspection marks.

Do not describe these as synchronized account data. Export/import is the portability mechanism where the site provides one.

## Update runbooks

### 1. New chapter endpoint

Canonical owner: `src/data/chapterTitles.js`  
Companions: `src/data/chapters.js`, `src/data/archiveMeta.js`

1. Confirm the numbered Hunterpedia chapter page exists.
2. Append the exact title in order.
3. Extend the archive boundary and arc range.
4. Add verified metadata without fabricating unavailable fields.
5. Add or revise Succession research when the chapter is current-arc material.
6. Reconcile timeline ceilings, spoiler presets, labels, homepage totals, and change log.
7. Run both audits.

Verify continuous numbering, one arc assignment per chapter, no timeline event above the boundary, and no stale endpoint copy.

### 2. Chapter research revision

Canonical owner: `src/data/chapters.js`  
Companions: `src/data/seriesResearch.js`, `src/data/successionDossier.js`

Update the direct chapter evidence first. Keep an arc-phase account labeled as phase context. Reconcile chronology, appearances, locations, conflicts, objects, and adaptation mappings only when the source supports them.

### 3. Character identity or status

Canonical owner: `src/data/entityRegistry.js`  
Companions: `src/data/encyclopedia.js`, `src/data/successionRoster.js`

1. Resolve the canonical identity and aliases.
2. Update status and status note centrally.
3. Add the direct Hunterpedia source.
4. Reconcile affiliation and relationships.
5. Confirm every consumer shows the same written state.
6. Confirm a red X appears only for centrally confirmed death.

### 4. Character portrait

Canonical owner: `src/data/mediaRegistry.js`  
Companions: `src/data/characters.js`, `src/data/priorityMedia.generated.js`, `scripts/stabilize-media.mjs`, `src/components/SafeImage.jsx`

Verify that the image depicts the named entity, uses an approved host, and remains useful at card size. Record the article and image source, run `npm run stabilize:media`, review the generated dimensions and focal point, then run `npm run audit:media`. If no verified image is available, keep the record text-only. Do not create a placeholder or browser-time lookup.

### 5. World or location record

Canonical owner: `src/data/worldAtlas.js`  
Companions: `src/lib/hunterpediaLocations.js`, `src/components/WorldAtlas.jsx`

Assign a stable ID, parent, route region, kind, summary, chapters/arcs, controlling faction, story role, source, and image state. Validate that parent links have no cycles and that the mobile hierarchy remains readable.

### 6. Black Whale space or route

Canonical owner: `src/data/blackWhale.js`  
Companions: `src/components/BlackWhaleGuide.jsx`, `src/data/successionTimeline.js`

Update tier/deck, exact or approximate position, occupants, controlling faction, access, security, connected rooms, secret connections, relevant chapters, events, deaths, and operational status. Reconcile the hotspot, text inspector, room ledger, and chronology.

### 7. Succession chronology event

Canonical owner: `src/data/successionTimeline.js`  
Companions: `src/data/successionDossier.js`, `src/data/successionArchive.js`

Record voyage day, exact/approximate/unknown time, chapter, location, participants, cause, result, later consequence, concurrent events, status change, and confidence. Keep editorial pressure analysis separate from the canon chronology.

### 8. Nen mechanic or ability

Canonical owner: `src/data/nenEncyclopedia.js`  
Companions: `src/data/encyclopedia.js`, `src/data/successionDossier.js`

Update user, category/type, debut, mechanics, activation, conditions, limitations, cost, victims/uses, holder, interactions, counters, and unresolved rules. Label inference and unknown mechanics.

### 9. Faction, relationship, or object trail

Canonical owner: `src/data/systemsDesk.js`  
Companions: `src/data/encyclopedia.js`, `src/components/SystemsDesk.jsx`

Preserve leadership level, directional relationship type, story-period scope, custody stage, current state, and source. Do not flatten a temporary agreement into permanent membership.

### 10. Route or navigation change

Canonical owner: `src/data/routeManifest.js`

Companions: `src/App.jsx`, `src/components/WorkspaceNav.jsx`, `src/components/Header.jsx`

Create a lazy page component, page metadata, breadcrumb, workspace entry, active state, route announcement, and search entry where useful. Verify direct reload, query preservation, keyboard operation, native mobile selection, and bundle separation.

### 11. Layout or readability defect

Canonical owner: `src/styles.css`  
Companions: `src/components/SafeImage.jsx`, `src/components/PageIntro.jsx`

Fix the responsible component at desktop, tablet, and mobile widths. Check long copy, missing media, focus, reduced motion, dense tables, image containment, tooltip collision, and horizontal scroll labeling. Do not reintroduce visible placeholders.

### 12. Release documentation

Canonical owner: `public/implementation-notes.md`  
Companions: `README.md`, `src/data/referenceEntities.js`

Update this handbook when ownership, schema, routes, evidence rules, media behavior, accessibility, performance boundaries, or release gates change. Add a concise change-log record. The implementation audit verifies every canonical path named by the runbook matrix.

## Release checklist

### Content integrity

- [ ] Chapter endpoint, titles, arc ranges, and timeline ceilings agree.
- [ ] New factual records use direct Hunterpedia/Fandom sources.
- [ ] Research-depth labels remain truthful.
- [ ] Unknown and ambiguous values are not silently completed.

### Identity and media

- [ ] Status and aliases resolve from the central identity record.
- [ ] Images depict the named subject and use approved hosts.
- [ ] Broken media collapses without an empty placeholder.
- [ ] Confirmed-death overlays have matching written labels.

### Responsive experience

- [ ] Desktop dense views remain readable.
- [ ] Tablet navigation and diagrams remain usable.
- [ ] Mobile uses compact selectors and labeled overflow regions.
- [ ] Images, labels, connectors, tooltips, and text do not collide.

### Accessibility

- [ ] Primary journeys work by keyboard.
- [ ] Focus is visible.
- [ ] Dialogs trap and restore focus.
- [ ] Visual diagrams have nonvisual equivalents.
- [ ] Reduced-motion mode removes nonessential motion.

### Performance and release

- [ ] Heavy datasets remain behind route or on-demand boundaries.
- [ ] Content audit passes.
- [ ] Implementation notes audit passes.
- [ ] Final-release audit passes.
- [ ] Production build emits the client, worker, hosting manifest, release manifest, and downloadable source package.
- [ ] The immutable hosted deployment is directly verified as succeeded.

## Phase 6G final release hardening

Phase 6G is the last Phase 6 subphase. It is a release and portability layer, not another reader-facing research directory.

It adds five maintained guarantees:

1. `src/data/routeManifest.js` is the single route contract for all 18 reader-facing screens.
2. `src/lib/browserStorage.js` is the only direct browser-storage boundary. Blocked, full, or unavailable storage must never crash reading, imagery, navigation, or search.
3. `src/components/SiteErrorBoundary.jsx` provides a readable recovery path for lazy-loading or rendering failure without deleting study data.
4. `scripts/package-release.mjs` introduced the deterministic source handoff in Phase 6G; the current Phase 7G build publishes `public/hxh-archive-phase-7g-source.zip`. It includes stabilized media and the QA scripts, while excluding dependencies, generated build output, repository history, hosting identity, and browser-local data.
5. `scripts/audit-release.mjs` validates the route inventory, all content contracts, storage isolation, new-tab safety, image-alt behavior, placeholder prohibition, responsive/reduced-motion rules, runtime recovery, release manifest, and package contents.

The companion `public/release-manifest.json` exposes the release boundary and package inventory without exposing private study data or deployment credentials.

## Phase 7A readability foundation

Phase 7A changes presentation, not factual scope. It establishes a maintainable reading contract across the existing archive:

1. No pixel-based type declaration may fall below 11px; ordinary research copy resolves to a 14–15px reading floor with a larger mobile baseline.
2. Frequent filters, tabs, inputs, navigation controls, and study actions use a shared 44px touch-target contract.
3. Header, workspace navigation, and secondary research toolbars use shared offsets; secondary sticky layers become static on smaller screens instead of stacking over content.
4. Dense character, roster, Nen, and source grids use fewer columns, larger media frames, and more room for names and metadata.
5. Family-tree, Black Whale, world-atlas, institutional, and Succession-ledger views display a written mobile scroll cue and retain readable nonvisual alternatives.
6. `scripts/audit-readability.mjs` blocks type-floor, touch-target, sticky-stack, scroll-guidance, and narrow-phone regressions during every production build.

## Phase 7B media stabilization

Phase 7B makes priority character media deterministic instead of relying on browser-time discovery:

1. Eighty-six verified Hunterpedia portraits are stored under `public/media/portraits/` and ship with both the hosted build and source package.
2. `src/data/priorityMedia.generated.js` records the local path, intrinsic width and height, reviewed focal point, article source, image source, storage state, and review date.
3. `src/components/SafeImage.jsx` applies intrinsic dimensions and focal points consistently across the homepage, encyclopedia, family tree, Succession directories, prince/death records, and the Hisoka–Chrollo dossier.
4. `src/components/FandomImage.jsx` accepts only an explicit image record. It does not discover page images, call MediaWiki at runtime, or cache portrait guesses in the browser.
5. Records without a verified image render as text with no reserved media panel, broken icon, silhouette, generated substitute, or unrelated fallback.
6. `scripts/stabilize-media.mjs --verify-only` checks file dimensions against the manifest, and `scripts/audit-media.mjs` blocks missing files, invalid sources, duplicate paths, missing focal points, hidden runtime lookups, and empty image-frame regressions.

## Phase 7C visual regression and layout stabilization

Phase 7C verifies the existing responsive website across ordinary browser widths. It does not add a PWA manifest, service worker, install prompt, native mobile bundle, or app-only navigation.

1. `scripts/audit-layout.mjs` keeps the 30-screen route matrix, shrink-safe dossier grids, contained table frames, responsive breakpoints, Black Whale alignment, touch-safe shell controls, and the World Atlas constructor guard build-blocking.
2. `scripts/visual-qa.mjs` renders all 26 reader-facing routes at desktop (1440×1000), tablet (768×1024), and phone-width browser (390×844) viewports: 78 route/viewport checks in total.
3. The browser matrix reports runtime errors, failed requests, page-width overflow, escaped content, broken images, empty media frames, text below the 11px floor, and undersized narrow-width controls.
4. Dense Succession ledgers change from four or three columns to two columns at tablet width and one at phone width; they no longer force the document wider than the viewport.
5. Mafia and Justice tables scroll inside their labeled frames, while the Nen affinity map, series heading, Black Whale location rail, and Maintenance footer reflow without clipping.
6. The World Atlas aliases the Lucide map icon so it cannot shadow JavaScript’s built-in `Map` constructor and crash the route.
7. Automated browser checks complement human review of screenshots, keyboard paths, and information hierarchy; passing signals are not treated as proof of factual completeness.

## Phase 7D accessibility and interaction hardening

Phase 7D repairs the shared interaction layer without changing the site into an app:

1. The dark site-footer styles are scoped to `.site-footer`; nested record, pagination, chapter, system, and card footers retain their own layouts, colors, and spacing.
2. The narrow-browser menu contains keyboard focus while open, closes with Escape, and returns focus to its trigger. Search and chapter drawers retain the same containment and recovery behavior.
3. Family-tree and Succession dossier tabs implement roving focus with Arrow Left/Right, Home, and End, expose selected state, and name their controlled tab panels.
4. Dynamic search totals and chapter-source loading states announce through polite live regions. The organization-chart period filter and Black Whale manifest expose explicit accessible names.
5. The horizontally scrollable Black Whale manifest is keyboard-focusable, while the family tree and ship retain written/table equivalents for nonvisual reading.
6. `scripts/audit-accessibility.mjs` blocks structural regressions during every build.
7. `scripts/accessibility-qa.mjs` runs WCAG 2.0/2.1 A and AA checks across 18 routes at desktop and phone width (36 renders) and exercises seven critical keyboard flows in a real browser.

## Phase 7E performance and loading hardening

Phase 7E keeps the first visit small while preserving direct access to the full archive:

1. `src/data/homeHighlights.js` contains four literal shell-safe highlight records instead of importing the complete character and media registries.
2. `src/lib/routePreload.js` owns twenty lazy route loaders and begins an import only after focus, pointer intent, or deliberate navigation.
3. `src/components/SafeImage.jsx` exposes explicit fetch priority; only the first home portrait receives high priority.
4. The loading shell reserves the remaining browser viewport, preventing route readiness from causing material layout shift on constrained mobile.
5. `scripts/audit-performance.mjs` enforces a 55KB application-entry budget, a 260KB startup-JavaScript closure, a 390KB stylesheet ceiling, twenty lazy entries, and bounded portrait assets.
6. `scripts/performance-qa.mjs` checks six representative routes at desktop and constrained-mobile settings: twelve profiles in total, including readiness, layout shift, runtime failure, and service-worker absence.

## Phase 7F visual and media polish

Phase 7F addresses the remaining crowded and unreliable surfaces without fabricating imagery:

1. The Black Whale directory still indexes and searches all 51 spaces, but initially renders twelve matching records and reveals the rest in twelve-record reading batches.
2. `SafeImage` publishes a loaded state. Remote Fandom media, room media, and inspector media stay absent until successfully loaded and collapse after failure, so no gray placeholder frame remains.
3. The World Atlas metric shows a structured fallback count while its live source shelf is checking; the journey rail keeps chapter labels below its markers and fits the desktop reading width cleanly.
4. The encyclopedia category shelf has an explicit small-screen scroll cue.
5. `scripts/visual-qa.mjs` eagerly exercises lazy images only inside the audit, then fails visible pending images, broken images, empty frames, and media-copy overlaps.
6. `scripts/audit-polish.mjs` makes these density and media rules build-blocking.

## Phase 7G final site-wide release audit

Phase 7G is the final verification layer for this release, not a new reader feature:

1. Every static content, implementation, readability, layout, accessibility, media, polish, performance, package, and release contract must pass in one production build.
2. All 26 reader-facing routes render at desktop, tablet, and phone width: 78 visual checks.
3. All 18 routes render at desktop and phone width against WCAG 2.0/2.1 A and AA: 36 accessibility checks, plus seven keyboard interaction flows.
4. Six representative routes pass desktop and constrained-mobile loading profiles: twelve performance checks.
5. The release retains an explicit no-PWA guard: no web-app manifest, service worker, install prompt, or app-only shell is introduced.
6. The private hosted version must resolve to the exact validated source commit and a terminal successful deployment state.

## Build and validation

The production build runs nine audit contracts and one deterministic packaging step:

1. `scripts/audit-content.mjs` validates story boundaries, chapter sequence, sources, media accounting, identities, timelines, encyclopedia coverage, world hierarchy, systems data, shell statistics, and the Phase 6F implementation contract.
2. `scripts/audit-implementation.mjs` validates this handbook’s required sections, all eight system notes, all twelve maintenance runbooks, the release checklist, completion criteria, and the existence of every canonical path named by the matrix.
3. `scripts/audit-readability.mjs` validates the typography floor, 44px control contract, shared sticky stack, mobile scroll cues, and narrow-phone reflow.
4. `scripts/audit-layout.mjs` validates structural responsive contracts and guards the World Atlas against the icon/constructor collision.
5. `scripts/audit-accessibility.mjs` validates footer scoping, focus containment, roving tabs, named controls and scroll regions, and live announcements.
6. `scripts/stabilize-media.mjs --verify-only` and `scripts/audit-media.mjs` validate the local portrait files, metadata, source policy, deterministic rendering path, and removal of runtime image discovery.
7. `scripts/audit-polish.mjs` validates pending-media collapse, progressive ship-room rendering, atlas geometry, mobile category guidance, and the expanded visual-QA defect signals.
8. `scripts/package-release.mjs` regenerates the source archive and public release manifest from the current source state.
9. `scripts/audit-release.mjs` validates all 18 routes, all 36 content contracts, the browser-storage boundary, link and image rules, responsive safeguards, runtime recovery, and the downloadable package itself.
10. `scripts/audit-performance.mjs` validates the built manifest, startup dependency closure, route splits, stylesheet, portrait assets, and no-PWA boundary.

Before a release checkpoint, `scripts/visual-qa.mjs` runs the 18-route × 3-viewport visual matrix and `scripts/accessibility-qa.mjs` runs the 18-route × 2-viewport WCAG matrix plus critical keyboard flows. They are QA commands rather than production runtime dependencies.

A passing build must emit:

- `dist/client/` browser assets.
- `dist/server/index.js` with the static worker entry.
- `dist/.openai/hosting.json`.
- `dist/client/release-manifest.json`.
- `dist/client/hxh-archive-phase-7g-source.zip`.

Do not treat a local build alone as a hosted release. The deployed immutable version must match the exact validated source and reach a directly verified terminal success state.

## Failure handling

- Factual check fails: correct the data or boundary; do not weaken the assertion to accept a contradiction.
- Handbook path fails: update the path and handbook together, or restore the canonical owner.
- Image fails: verify the entity and source; remove the broken media claim if no valid replacement exists.
- Mobile collision: fix component layout and test long content; do not hide essential information.
- Bundle regression: locate the heavy import and restore a lazy route or on-demand boundary.
- Hosted build fails: fix the source and create a new immutable checkpoint; do not redeploy an already failed version unchanged.

## Completion criteria

Phase 6F is complete when all of the following remain true:

1. Visible scope: the site exposes its Chapter 413 boundary and varying research depth.
2. Maintainable model: stable IDs, central statuses, sources, and relationships have canonical owners.
3. Repeatable updates: twelve runbooks cover recurring archive change types.
4. Media integrity: local, verified-remote, and text-only states are documented and audited; runtime portrait resolution remains disabled.
5. Accessible shell: keyboard, touch, focus, reduced motion, and nonvisual alternatives have explicit rules.
6. Performance boundary: large research collections remain separate from the startup shell.
7. Build gate: content and implementation audits block inconsistent production artifacts.
8. Public handoff: the readable Maintenance page and this canonical handbook are available.

## Maintained file index

| Responsibility | Canonical path |
| --- | --- |
| Route registry and aliases | `src/data/routeManifest.js` |
| Route shell and lazy rendering | `src/App.jsx` |
| Workspace navigation | `src/components/WorkspaceNav.jsx` |
| Mobile/header navigation | `src/components/Header.jsx` |
| Chapter titles | `src/data/chapterTitles.js` |
| Chapter records | `src/data/chapters.js` |
| Archive boundary and shell totals | `src/data/archiveMeta.js` |
| Central identities and status | `src/data/entityRegistry.js` |
| Unified encyclopedia | `src/data/encyclopedia.js` |
| Media accounting | `src/data/mediaRegistry.js` |
| Local portrait manifest | `src/data/priorityMedia.generated.js` |
| Portrait stabilization and verification | `scripts/stabilize-media.mjs` |
| World hierarchy | `src/data/worldAtlas.js` |
| Live location category cache | `src/lib/hunterpediaLocations.js` |
| Browser-local state boundary | `src/lib/browserStorage.js` |
| Runtime recovery | `src/components/SiteErrorBoundary.jsx` |
| Readability and responsive density | `src/styles.css` |
| Mobile horizontal-scroll guidance | `src/components/HorizontalScrollHint.jsx` |
| Static layout regression checks | `scripts/audit-layout.mjs` |
| 18-route browser matrix | `scripts/visual-qa.mjs` |
| Black Whale spaces | `src/data/blackWhale.js` |
| Succession chronology | `src/data/successionTimeline.js` |
| Succession research | `src/data/successionDossier.js` |
| Nen library | `src/data/nenEncyclopedia.js` |
| Organization and evidence systems | `src/data/systemsDesk.js` |
| Content checks | `src/data/contentIntegrity.js` |
| Implementation checks | `scripts/audit-implementation.mjs` |
| Final-release checks | `scripts/audit-release.mjs` |
| Portable source packager | `scripts/package-release.mjs` |
| Public release contract | `src/data/releaseReadiness.js` |
| Main styling and responsive rules | `src/styles.css` |
| This handbook | `public/implementation-notes.md` |

## Maintenance principle

Update the canonical fact first, its relationships second, its visual consumers third, and the documentation/release record last. If the source does not establish something, preserve the uncertainty.
