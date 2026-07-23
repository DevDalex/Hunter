# Hunter × Hunter — The Black Archive

A desktop-first Hunter × Hunter research archive deployed as one full-stack Cloudflare Workers application. Hunterpedia/Fandom is the factual and image-source boundary.

## Runtime architecture

- React and Vite build the reader application into `dist/client/`.
- The Cloudflare Worker entry is `dist/server/index.js`.
- `dist/client/` is bound as `ASSETS` with Worker-first routing.
- `server/index.js` handles `/api/admin/chapter/*` and `/admin/chapters` before static files or the SPA fallback.
- GitHub is the canonical content store; the protected chapter administrator can publish authorized chapter media back to the repository.
- `src/data/routeManifest.js` owns 26 reader-facing screens.
- Large HxH datasets remain behind 21 dynamic entries: route/search UI boundaries, Story detail boundaries, and search shards.

## Run locally

```bash
npm ci
npm run dev
```

## Validate and build

```bash
npm run build
```

The build:

1. writes `public/build-info.json` with the exact commit identity;
2. runs 15 independent pre-build audits;
3. clears stale hosting output and retired portable archives;
4. builds the Vite client into `dist/client/`;
5. validates performance budgets;
6. prepares the Worker in `dist/server/`;
7. runs the Cloudflare release audit.

## Deploy to Cloudflare

```bash
npm run build
npx wrangler deploy
```

`wrangler.jsonc` must retain:

- Worker name `hunter`;
- entry `dist/server/index.js`;
- asset directory `dist/client`;
- binding `ASSETS`;
- `run_worker_first: true`;
- disabled automatic HTML and not-found rewriting.

A successful build or GitHub commit is not proof of a hosted release. Record deployment success only after Cloudflare reaches terminal success and the live API returns JSON.

## Core HxH content owners

- Chapter titles and boundary: `src/data/chapterTitles.js`, `src/data/chapters.js`, `src/data/archiveMeta.js`.
- Story architecture: `architecture/storyArchitecture.mjs`, `src/data/routeManifest.js`, `src/lib/appRouter.js`.
- Completed-arc research: `src/data/seriesResearch.js`, `src/data/seriesArcDossiers.js`.
- Succession research: `src/data/successionTimeline.js`, `src/data/successionDossier.js`, `src/data/successionArchive.js`.
- Character identity and portraits: `src/data/entityRegistry.js`, `src/data/entityIds.js`, `src/data/characters.js`.
- World, Nen, organizations, and conflicts: `src/data/worldAtlas.js`, `src/data/nenEncyclopedia.js`, `src/data/systemsDesk.js`, `src/data/encyclopedia.js`.
- Source policy and evidence: `src/data/sourcePolicy.js`, `src/data/bibliography.js`, `src/data/evidenceStates.js`, `src/data/reviewQueue.js`.
- Route inventory: `src/data/routeManifest.js`.
- Cloudflare Worker: `server/index.js`, `server/chapter-admin.js`, `wrangler.jsonc`.

## Batch 12 design system

Batch 12 is the current reusable archive UI foundation. `src/data/archiveDesignSystem.js` owns the primitive and semantic-tone contracts, `src/components/ArchiveUI.jsx` implements the shared components, and `src/styles/archive-system.css` owns their styling.

Use `ArchiveSection`, `ArchiveCard`, `EvidenceBadge`, `StatusPill`, `SourceStack`, and `ArchiveLedger` before creating one-off equivalents. The design-system audit remains part of the 15 independent pre-build audits, while the old reader-facing demonstration remains removed.

## Media ownership

`src/data/characters.js` owns portrait provenance and `src/data/priorityMedia.generated.js` is its generated projection. `src/data/blackWhale.js` owns room-image provenance and `src/data/blackWhaleMedia.generated.js` is its generated projection.

The maintained library includes 106 character portraits and 29 Black Whale derivatives. Generated media files should be regenerated through their scripts rather than edited manually.

## Source policy

Only approved Hunterpedia/Fandom article and image hosts may be used for factual records and displayed source media. Keep confirmed facts, inference, unresolved questions, manga-only material, anime-only material, and adaptation notes visibly distinct.

## Performance contract

`src/data/performanceBudgets.js` owns the current limits:

- application entry: 500,000 bytes;
- startup JavaScript closure: 1,000,000 bytes;
- startup CSS: 1,000,000 bytes;
- largest JavaScript chunk: 750,000 bytes;
- individual portrait: 160,000 bytes;
- portrait library: 2,200,000 bytes.

## Chapter administrator

The protected administrator lives at `/admin/chapters`. Its API family is `/api/admin/chapter/*` and must always return JSON rather than `index.html`.

Required Worker secrets and variables are documented in `docs/HOSTED-CHAPTER-ADMIN.md`. Keep GitHub credentials out of the repository.

## Browser verification

```bash
npm run browser:deps
npm run browser:install
npm run qa:browser
```

Browser QA remains separate from the normal Cloudflare build because it is substantially heavier. Use it for UI, routing, accessibility, and interaction checkpoints.

## Maintainer documentation

- `public/implementation-notes.md` — current maintenance contract.
- `docs/BUILD-PREFLIGHT.md` — build-gate order.
- `docs/STORY-ARCHITECTURE.md` — story and route model.
- `docs/HOSTED-CHAPTER-ADMIN.md` — administrator setup and operation.
- `docs/DESIGN-SYSTEM.md` — reusable archive UI primitives.
