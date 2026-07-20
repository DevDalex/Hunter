# Hunter × Hunter — The Black Archive

A desktop-first Hunter × Hunter study archive with clean Story routes, a complete numbered chapter catalogue through Chapter 413, connected reference records, a 644-character directory, six additive character dossiers, Nen/world/organization/conflict backbones, local study tools, and dedicated Story prototypes.

The factual and image-source boundary is Hunterpedia/Fandom only. The archive keeps evidence depth explicit: all 413 chapters are locally structured, 112 have chapter-specific accounts, and 301 retain clearly labeled arc-phase context rather than invented scene summaries.

## Current architecture

- Four workspaces: Home, Series, Succession, and Reference.
- 26 reader-facing screens from `src/data/routeManifest.js`.
- Clean history paths with direct-reload fallback and legacy hash compatibility through `src/lib/appRouter.js`.
- Large research datasets remain behind route or on-demand boundaries.
- Mobile-specific redesign remains deferred; existing responsive and accessibility safeguards remain maintained.

The global visual order is:

1. `src/styles.css`, which imports `src/styles/base.css`, `src/styles/editorial.css`, and `src/styles/experiences.css`;
2. `src/nen.css`;
3. `src/styles/final-polish.css`.

The final identity is a black cinematic shell, warm paper reading surfaces, crimson active states, antique gold metadata, steel blue system information, and selective purple.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build performs these stages:

1. writes `public/build-info.json` with the exact commit identity;
2. runs all 14 independent pre-build audits through `scripts/run-build-preflight.mjs`, continuing after individual audit failures and reporting the complete failure list;
3. creates and audits both portable editions;
4. creates the production Vite build;
5. applies the performance audit;
6. prepares `dist/` for hosting.

Production browser files are written to `dist/client/`, with the worker at `dist/server/index.js` and hosting metadata at `dist/.openai/hosting.json`.

## Maintain the content

- Story architecture: `architecture/storyArchitecture.mjs`, `docs/STORY-ARCHITECTURE.md`, `src/lib/appRouter.js`.
- Chapter titles and boundary: `src/data/chapterTitles.js`, `src/data/chapters.js`, `src/data/archiveMeta.js`.
- Completed-arc research: `src/data/seriesResearch.js`.
- Current-arc research: `src/data/successionTimeline.js`, `src/data/successionDossier.js`, `src/data/successionArchive.js`.
- Canonical identities/status: `src/data/entityRegistry.js`.
- Stable archive IDs: `src/data/entityIds.js`.
- Character portraits: `src/data/characters.js`; regenerate with `npm run stabilize:media`.
- Black Whale media: `src/data/blackWhale.js`; regenerate with `npm run stabilize:rooms`.
- Source policy: `src/data/sourcePolicy.js`.
- Bibliography/evidence/review governance: `src/data/bibliography.js`, `src/data/evidenceStates.js`, `src/data/reviewQueue.js`.
- Machine-readable ownership and media schema: `src/data/dataOwnership.js`, `src/data/mediaSchema.js`.
- World hierarchy: `src/data/worldAtlas.js`.
- Nen: `src/data/nenEncyclopedia.js`.
- Organizations/relationships/objects: `src/data/systemsDesk.js`.
- Route inventory: `src/data/routeManifest.js`.
- Canonical maintainer handbook: `public/implementation-notes.md`.

The complete character directory must remain intact. Dossiers are richer overlays, not replacements for minor or source-index characters.

## Data and source policy

Canonical human-maintained records own facts and provenance. Generated media manifests and search indexes are deployment derivatives and must remain synchronized with their named owners.

Use direct approved Hunterpedia links. Keep local summaries, analytical connections, unresolved questions, manga-only material, anime-only material, and adaptation notes visibly distinct. Do not convert an inference into a confirmed record.

## Performance contract

`scripts/audit-performance.mjs` currently enforces:

- application entry: 150,000 bytes;
- startup JavaScript closure: 270,000 bytes;
- startup CSS: 390,000 bytes;
- largest JavaScript chunk: 220,000 bytes;
- individual portrait: 160,000 bytes;
- portrait library: 2,200,000 bytes;
- 22 dynamic entries: 17 UI boundaries, two Story detail chunks, and three search shards.

## Browser verification

Install the pinned browser tools and Chromium, then run:

```bash
npm ci
npm run browser:deps
npm run browser:install
npm run qa:browser
```

The matrix includes:

- 26 routes × desktop/tablet/phone-width visual checks = 78 renders;
- 26 routes × desktop/phone accessibility checks = 52 renders;
- seven critical keyboard flows;
- six routes × desktop/constrained-mobile performance profiles = 12 checks;
- search-shard and interaction verification.

Reports are written to `.search-qa/`, `.visual-qa/`, `.accessibility-qa/`, `.interaction-qa/`, `.performance-qa/`, and `.browser-qa/`.

`.github/workflows/browser-verification.yml` is configured for pull requests, pushes to `main`, and manual dispatch. Its existence is not proof that a particular commit passed; only a completed successful run provides that evidence.

## Portable editions

Each build regenerates:

- `public/hxh-archive-phase-8a-sites-source.zip` — maintainable project source including `src/`, `scripts/`, `architecture/`, `docs/`, `.github/`, `server/`, public assets, configuration, and `.openai/hosting.json`;
- `public/hxh-archive-phase-8a-standalone.zip` — direct-open built edition with local media and no source toolchain.

Neither package contains dependencies, Git history, credentials, or browser-local notes/progress. The generated ZIPs are copied to `dist/client/` for deployment and removed from `public/` during final hosting preparation.

A local build, static audit, or repository commit must not be described as a successful hosted release until the corresponding workflow or Cloudflare deployment reaches terminal success.
