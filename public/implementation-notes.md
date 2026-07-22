# Hunter × Hunter Archive — Implementation and Maintenance Handbook

Current contract: Phase 8A release base · Batch 12 design system · July 20, 2026

- Maintained story boundary: Chapter 413
- Factual source boundary: Hunterpedia / Fandom only
- Reader-facing route inventory: 26 screens
- Priority local media: 106 character portraits and 29 Black Whale derivatives
- Mobile-specific redesign: deferred
- Reader-facing Notebook route: retired
- Home-page design-system demonstration: retired

## Purpose

This handbook is the current maintainer contract for The Black Archive. It names the files that own facts, routes, media, styling, audits, and release packaging. Historical phase notes may explain how the project arrived here, but the values in this document describe the active build.

The archive distinguishes catalogue identity, arc-phase context, chapter-specific research, interpretation, unresolved material, and adaptation notes. A record being present does not mean its biography or analysis is complete.

## Architecture

The application has four top-level workspaces: Home, Series, Succession, and Reference. `src/data/routeManifest.js` owns the 26 reader-facing screens and aliases. `src/App.jsx` owns the lightweight shell and lazy rendering. `src/lib/appRouter.js` owns clean history paths, query preservation, direct-reload behavior, legacy hash parsing, and standalone fallback.

The route model is:

- clean browser paths for the hosted site;
- static-worker fallback through `server/index.js`;
- legacy hash routes retained only for compatibility and the direct-open standalone edition;
- large research datasets kept behind route or on-demand boundaries;
- retired Notebook paths resolve to the not-found experience;
- the existing Zoldyck Family page is now represented in the canonical route inventory.

The removed public Sources page and retired Notebook page must not return as top-level routes. Source links remain attached to the records they support.

Global CSS loads in this exact order:

1. `src/styles.css`, which imports `src/styles/base.css`, `src/styles/editorial.css`, `src/styles/experiences.css`, `src/styles/accessibility-contrast.css`, and `src/styles/archive-system.css`;
2. `src/nen.css`;
3. `src/styles/final-polish.css`.

The final layer keeps the Black Archive identity: black shell, warm paper, crimson active states, antique gold metadata, steel blue neutral information, and selective purple. Old `--forest*` compatibility names resolve to crimson rather than restoring a green brand.

## Content schema

The principal structured owners are:

- `src/data/chapterTitles.js` — numbered chapter titles;
- `src/data/chapters.js` — chapter catalogue and verified chapter-level metadata;
- `src/data/archiveMeta.js` — Chapter 413 boundary and shell-safe totals;
- `src/data/entityRegistry.js` — canonical character identities, aliases, and status;
- `src/data/entityIds.js` — stable archive ID namespaces and seed IDs;
- `src/data/encyclopedia.js` — connected entity records;
- `src/data/archiveDesignSystem.js` — Batch 12 primitive, tone, and design-system rules;
- `src/data/performanceBudgets.js` — canonical code, CSS, and media performance ceilings;
- `src/data/worldAtlas.js` — place hierarchy and travel relationships;
- `src/data/blackWhale.js` — Black Whale spaces and source-owned media records;
- `src/data/successionTimeline.js` — voyage chronology;
- `src/data/nenEncyclopedia.js` — Nen principles and named abilities;
- `src/data/systemsDesk.js` — organizations, relationships, and object trails.

Stable IDs and canonical owners should be updated before visual consumers. Do not add status flags, spellings, source URLs, performance numbers, evidence badges, source blocks, or reusable card shells independently when a central record already owns them.

The full character directory remains intact. Dossier profiles are additive and do not replace or delete source-index characters.

## Source and evidence contract

Hunterpedia/Fandom is the only factual and image-source boundary unless the user explicitly changes that policy.

Batch 11 adds these governance owners:

- `src/data/bibliography.js` — reusable source records;
- `src/data/evidenceStates.js` — confirmed, inferred, unclear, source-index-only, deferred, and medium-specific states;
- `src/data/reviewQueue.js` — incomplete or blocked work;
- `src/schema/` — bibliography, entity, chapter, character, and conflict contracts.

Rules:

- link to the most relevant approved Hunterpedia page;
- keep article and image provenance separate where needed;
- label archive-written summaries and analytical links honestly;
- preserve unknown or disputed states rather than completing them by inference;
- keep current-arc records within Chapter 413;
- do not copy long community-written passages into local records.

## Batch 12 design system

Batch 12 provides reusable archive UI primitives without adding a reader-facing system page:

- `src/components/ArchiveUI.jsx` — `ArchiveSection`, `ArchiveCard`, `EvidenceBadge`, `StatusPill`, `SourceStack`, and `ArchiveLedger`;
- `src/styles/archive-system.css` — reusable primitive styling;
- `docs/DESIGN-SYSTEM.md` — Batch 12 design-system documentation;
- `scripts/audit-design-system.mjs` — build-blocking primitive, tone, documentation, CSS, and showcase-exclusion audit.

Use these primitives instead of inventing one-off badges, source blocks, record cards, status pills, and ledgers. The library remains available for real archive pages, while its former home-page demonstration stays removed.

## Media and status rules

`src/data/characters.js` owns portrait provenance. `src/data/priorityMedia.generated.js` mirrors the 106 stabilized local portraits. `scripts/stabilize-media.mjs` regenerates and verifies that mirror.

`src/data/blackWhale.js` owns room-image provenance. `src/data/blackWhaleMedia.generated.js` mirrors the 29 stabilized derivatives. `scripts/stabilize-room-media.mjs` regenerates and verifies that mirror.

`src/data/mediaRegistry.js`, `src/data/mediaSchema.js`, and `src/components/SafeImage.jsx` enforce the media contract:

- local, verified-remote, and intentionally text-only are distinct states;
- missing media collapses without a fake silhouette or empty frame;
- local media carries dimensions, focal position, source provenance, storage state, and review date;
- runtime image discovery remains disabled;
- reference/evidence images use containment where cropping would remove information.

A red X means confirmed death only and requires written status. Possession, displacement, detention, missing identity, or unknown state must not be displayed as death.

## Accessibility and responsive behavior

The site remains one responsive website. Mobile-specific redesign is deferred, but existing narrow-browser safeguards remain required.

Maintain:

- skip navigation into `#main-content`;
- visible keyboard focus;
- menu and dialog focus containment;
- Escape dismissal and trigger-focus restoration;
- roving keyboard tabs where implemented;
- polite live announcements for dynamic status;
- named scroll regions and nonvisual alternatives for diagrams;
- a minimum 11px explicit text floor and 44px maintained touch-target contract;
- reduced-motion behavior;
- contained tables, maps, media, and long names.

Static contracts live in `scripts/audit-readability.mjs`, `scripts/audit-layout.mjs`, and `scripts/audit-accessibility.mjs`. Browser verification uses 26 routes across three visual viewports (78 renders) and 26 routes across two accessibility viewports (52 renders), plus seven critical keyboard flows. Those browser results must not be claimed as passed without an actual completed run.

## Performance boundaries

`src/data/performanceBudgets.js` is the canonical budget owner. `scripts/audit-performance.mjs` currently enforces:

- application entry: 500,000 bytes;
- startup JavaScript closure: 1,000,000 bytes;
- startup CSS: 1,000,000 bytes;
- largest JavaScript chunk: 750,000 bytes;
- local portrait: 160,000 bytes;
- portrait library: 2,200,000 bytes.

The code and CSS ceilings provide substantial feature-growth headroom. Structural guardrails remain strict: the home shell cannot import heavy archive datasets, dynamic boundaries must remain split, only the first home portrait receives high fetch priority, service-worker/PWA behavior remains excluded, and media ceilings remain unchanged.

The production manifest must retain 21 dynamic entries:

- 16 route/search UI boundaries;
- two Story detail boundaries;
- three search-data shards.

`src/lib/routePreload.js` owns the 16 direct UI loaders. Search data remains split across the three `src/data/archiveSearch.*.js` shards. `scripts/performance-qa.mjs` checks six representative routes under desktop and constrained-mobile profiles, for 12 route/profile checks.

Budget changes require review and synchronized documentation. The guardrail should not be removed merely to hide a regression.

## Aggregate build preflight

`scripts/run-build-preflight.mjs` runs all 16 independent pre-build audits and continues after individual failures, so one Cloudflare deployment reports the complete repair list:

1. content;
2. implementation;
3. Story architecture;
4. reference backbone;
5. character dossiers;
6. final polish;
7. archive governance;
8. design system;
9. data schema;
10. CSS ownership;
11. readability;
12. layout;
13. accessibility;
14. media;
15. Greed Island card libraries;
16. polish.

Packaging, release-package validation, the final Vite build, performance validation, and hosting preparation remain ordered after a successful aggregate preflight because they depend on generated artifacts.

## Update runbooks

### 1. New chapter endpoint
Canonical owner: `src/data/chapterTitles.js`. Update `src/data/chapters.js` and `src/data/archiveMeta.js`, then reconcile current-arc records and all Chapter 413 boundaries.

### 2. Chapter research revision
Canonical owner: `src/data/chapters.js`. Keep chapter-specific evidence separate from arc-phase context and direct source links.

### 3. Character identity or status
Canonical owner: `src/data/entityRegistry.js`. Update aliases and status centrally before encyclopedia, roster, or dossier consumers.

### 4. Character portrait
Canonical owner: `src/data/characters.js`. Run `npm run stabilize:media`, inspect the generated record, then run the media audit.

### 5. World or location record
Canonical owner: `src/data/worldAtlas.js`. Preserve stable IDs, hierarchy, route links, source, and readable map/list equivalents.

### 6. Black Whale space or route
Canonical owner: `src/data/blackWhale.js`. Reconcile hotspot, inspector, room ledger, occupancy, access, and timeline references.

### 7. Succession chronology event
Canonical owner: `src/data/successionTimeline.js`. Record chapter, voyage day/time confidence, location, participants, result, and later consequence without exceeding the boundary.

### 8. Nen mechanic or ability
Canonical owner: `src/data/nenEncyclopedia.js`. Separate confirmed mechanics, conditions, costs, counters, inference, and unknown rules.

### 9. Faction, relationship, or object trail
Canonical owner: `src/data/systemsDesk.js`. Preserve direction, type, time scope, custody/authority, current state, and source.

### 10. Route or navigation change
Canonical owner: `src/data/routeManifest.js`. Update `src/App.jsx`, `src/lib/appRouter.js`, navigation, direct reload, legacy upgrade, accessibility, and bundle boundaries together.

### 11. Layout or readability defect
Canonical owner: `src/styles.css`, with final overrides in `src/styles/final-polish.css`. Run the static layout checks and the 26-route × 3-viewport visual matrix before declaring the defect closed.

### 12. Design-system primitive or tone
Canonical owner: `src/data/archiveDesignSystem.js`. Update `src/components/ArchiveUI.jsx`, `src/styles/archive-system.css`, `docs/DESIGN-SYSTEM.md`, and `scripts/audit-design-system.mjs` together.

### 13. Release documentation
Canonical owner: `public/implementation-notes.md`. Reconcile `README.md`, `docs/FINAL-POLISH.md`, `docs/ARCHIVE-GOVERNANCE.md`, `docs/DESIGN-SYSTEM.md`, and the visible change log whenever current contracts change.

## Release checklist

### Content integrity
- [ ] Chapter endpoint, titles, ranges, and timeline ceilings agree.
- [ ] New factual records use direct approved sources.
- [ ] Research-depth and evidence-state labels remain truthful.

### Identity and media
- [ ] Status and aliases resolve from central records.
- [ ] Images depict the named subject and retain provenance.
- [ ] Broken media collapses without placeholders.

### Responsive and accessible experience
- [ ] Dense desktop views remain readable.
- [ ] Existing narrow-browser safeguards still work without expanding deferred mobile redesign scope.
- [ ] Keyboard, focus, dialogs, live regions, reduced motion, and nonvisual alternatives remain intact.

### Design system and release
- [ ] Shared primitives cover cards, sections, source stacks, evidence badges, status pills, and ledgers.
- [ ] The removed home-page design-system showcase remains absent.
- [ ] All 16 aggregate preflight audits pass.
- [ ] Release ZIPs are generated and audited.
- [ ] The final production build and performance audit pass.
- [ ] Browser QA is run and reviewed when required for the checkpoint.
- [ ] The hosted deployment corresponds to the exact validated commit.

## Portable editions

Every production build generates:

- `public/hxh-archive-phase-8a-sites-source.zip` — maintainable source including `src/`, `scripts/`, `architecture/`, `docs/`, `.github/`, `server/`, public assets, configs, and `.openai/hosting.json`;
- `public/hxh-archive-phase-8a-standalone.zip` — direct-open built edition with local media and no source toolchain.

Neither package may contain dependencies, Git history, credentials, or browser-local study data. `scripts/package-release.mjs` creates both; `scripts/audit-release.mjs` inspects their contents.

## Completion criteria

1. The Chapter 413 scope and unequal research depth remain visible.
2. Stable IDs, statuses, bibliography records, evidence states, sources, relationships, and design-system primitives have canonical owners.
3. Thirteen maintenance runbooks cover recurring changes.
4. Media and written status remain deterministic and honest.
5. Keyboard, focus, reduced motion, narrow-browser safeguards, and nonvisual alternatives remain explicit.
6. Large data stays outside the startup shell under the maintained budgets.
7. Sixteen independent audits report together before packaging.
8. The maintainable source package contains the files required to rebuild, audit, document, and redeploy the archive.

A successful local or repository audit is not proof of a successful hosted deployment. Record that claim only after the corresponding workflow or Cloudflare build reaches terminal success.
