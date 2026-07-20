# Hunter × Hunter — Archive

A responsive public study website with Hunterpedia-sourced arc navigation, clean Story routes, a complete chapter index through Chapter 413, full-series chronology, real Hunterpedia character image cards, local reading progress, a Nen encyclopedia, connected reference records, and expandable chapter records.

The research desk keeps evidence depth explicit: all 413 numbered chapters have a maintained local study record, 75 have chapter-specific local accounts, and Chapters 2–339 have honest arc-phase context rather than invented scene summaries. The chronology connects 39 full-series structural blocks to the separate 134-event Succession voyage timeline.

## Run locally

```bash
npm install
npm run dev
```

## Maintain the content

- Edit the seven official arc boundaries, study lenses, and descriptions in `src/data/arcs.js`.
- Update numbered titles in `src/data/chapterTitles.js`; the array position is the chapter number.
- Add verified chapter-level metadata to `verifiedDetails` in `src/data/chapters.js`.
- Maintain completed-arc phase research, story chronology, and adaptation evidence boundaries in `src/data/seriesResearch.js`.
- Maintain encyclopedia-to-story phase trails in `src/data/entityResearchTrails.js`.
- Review local, verified-remote, and text-only coverage in `src/data/mediaRegistry.js`.
- Treat `src/data/characters.js#characterPortraitSources` as the canonical owner of portrait provenance. Add a verified article and image source there, then run `npm run stabilize:media`; `src/data/priorityMedia.generated.js` is only a generated derivative mirror containing local asset metadata plus checked provenance.
- Treat `src/data/blackWhale.js#blackWhaleRemoteImageSources` as the canonical owner of Black Whale image provenance. Run `npm run stabilize:rooms` after changing those records; `src/data/blackWhaleMedia.generated.js` is never edited as source data.
- Keep approved source hosts and URL constructors in `src/data/sourcePolicy.js`, shared media semantics in `src/data/mediaSchema.js`, and machine-readable ownership in `src/data/dataOwnership.js`. `npm run audit:schema` blocks generated-provenance drift, duplicate identity keys, unauthorized generated imports, and source-policy violations.
- Maintain the structured world hierarchy and story-route legs in `src/data/worldAtlas.js`.
- Maintain Phase 6D organization charts, institutional relationships, and object/evidence trails in `src/data/systemsDesk.js`; every diagram record must retain a direct Hunterpedia source and an explicit time scope.
- Keep Phase 6E shell totals in `src/data/archiveMeta.js` synchronized through the build-blocking audit; heavy chapter, Succession, search, and encyclopedia datasets must remain behind route-level lazy boundaries.
- Use the Phase 6F [implementation and maintenance handbook](public/implementation-notes.md) for data ownership, recurring update runbooks, responsive/accessibility checks, and the release definition of done. Every canonical path named there is build-checked.
- Keep Phase 6G route metadata in `src/data/routeManifest.js`, browser-local access behind `src/lib/browserStorage.js`, and release requirements in `src/data/releaseReadiness.js`. Every build regenerates and checks the portable source package and `public/release-manifest.json`.
- Keep the locked Story redesign contract in `architecture/storyArchitecture.mjs`, `docs/STORY-ARCHITECTURE.md`, and `src/lib/appRouter.js`. `npm run audit:story` enforces the nine-destination taxonomy, clean target routes, history router, legacy redirect parsing, official/editorial arc distinction, hybrid Black Archive design, Yorknew prototype, Succession depth, manga/anime policy, and deferred mobile scope.
- Keep global style ownership behind the single `src/styles.css` entry point: shared foundations live in `src/styles/base.css`, editorial overrides in `src/styles/editorial.css`, and later route experiences in `src/styles/experiences.css`. Nen remains isolated in `src/nen.css`; `npm run audit:css` blocks extra global entry points and import-order drift.
- Keep Phase 7B priority portraits local and deterministic; `npm run audit:media` verifies every file and blocks browser-time portrait resolution from returning.
- Keep the layout contracts in `scripts/audit-layout.mjs`; use `scripts/visual-qa.mjs` to render all 18 focused routes at desktop, tablet, and phone-width browser viewports and scan for runtime errors, overflow, broken media, tiny text, and narrow-width interaction defects. These checks maintain one responsive website; the project is not a PWA or native phone app.
- Keep the interaction contracts in `scripts/audit-accessibility.mjs`; use `scripts/accessibility-qa.mjs` to run WCAG A/AA checks across all 18 routes at desktop and phone width plus browser-driven keyboard flows for skip navigation, search, menus, grouped views, drawers, downloads, and the Black Whale manifest.
- Keep Phase 7E loading boundaries in `src/lib/routePreload.js` and the literal home highlights in `src/data/homeHighlights.js`; `npm run audit:performance` enforces the startup, lazy-route, CSS, and portrait budgets, while `npm run qa:performance` exercises six routes at desktop and constrained-mobile settings.
- Keep Phase 7F media and density rules in `src/components/SafeImage.jsx`, `src/components/BlackWhaleGuide.jsx`, and `scripts/audit-polish.mjs`; remote imagery must disappear cleanly when unavailable, room records remain progressively readable, and browser QA fails visible pending media or media-copy collisions.
- Keep Phase 8A release metadata in `src/data/releaseReadiness.js`; the final checkpoint requires all static audits, the visual matrix, the WCAG matrix, keyboard flows, loading profiles, and both downloadable editions to agree with the exact deployed source.
- Update collected chapter ranges in `src/data/volumes.js`.
- Expand the maintained entity and search directories in `src/data/referenceEntities.js`, the three `src/data/archiveSearch.*.js` domain shards, and `src/data/characters.js`.
- Change `LATEST_CHAPTER` and append a title when Hunterpedia adds a new numbered chapter.
- Add more character portraits only after verifying the Hunterpedia article and image source, then regenerate the local media manifest.

## Source policy

The project uses Hunterpedia on Fandom for chapter titles, arc boundaries, character images, Nen links, and reference links. Long community-written synopses are linked rather than copied; chapter-specific accounts, arc-phase context, and live source evidence are labeled separately.

Canonical human-maintained records own facts and provenance. Generated media manifests and runtime search records are derivatives: they may repeat canonical values for deployment, but the schema audit requires exact agreement with their named owner and prevents components from importing those generated files directly.

## Build

```bash
npm run build
```

The production-ready browser files are written to `dist/client/`.

Each production build regenerates two deterministic downloads. `public/hxh-archive-phase-8a-sites-source.zip` is the maintainable project and includes `.openai/hosting.json` so another ChatGPT Sites session can continue the same private deployment. `public/hxh-archive-phase-8a-standalone.zip` contains `Open-HxH-Archive.html` plus local media and can be opened directly without Node, Vite, a command file, or the hosted URL. Neither edition contains credentials, Git history, or browser-local study data. The ZIP files are generated artifacts rather than tracked source: the build copies them into `dist/client/` for deployment, then removes the temporary copies from `public/`.

Browser-rendered verification is committed as a repeatable project check. Install the pinned development dependencies and Chromium once, then run the complete matrix:

```bash
npm ci
npm run browser:deps
npm run browser:install
npm run qa:browser
```

`qa:browser` performs the production build once, then runs focused search-shard verification, route screenshots and overflow/media checks, WCAG and keyboard checks, critical Nen/relationship interaction states, and constrained performance profiles. Reports, the complete console log, and failure screenshots are written to `.search-qa/`, `.visual-qa/`, `.accessibility-qa/`, `.interaction-qa/`, `.performance-qa/`, and `.browser-qa/`. The same command runs automatically in the **Browser Verification** GitHub Actions workflow for pull requests and pushes to `main`.

The build also adds a minimal static worker and hosting metadata to `dist/`, so
the same source can be deployed through ChatGPT Sites without changing the React app.
