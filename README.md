# Hunter × Hunter Archive

## Current public scope

The website is intentionally limited to two maintained areas:

- the **Succession Contest Archive**, opened at `/`;
- the **general Nen Encyclopedia**, opened at `/nen`.

The standalone **World Atlas** and `/world` route are retired. Succession-specific geography remains available through the maintained Black Whale and Locations workspaces inside the Succession Contest Archive.

Earlier-arc Story pages, the global timeline, the general character encyclopedia, the general organizations workspace, the general fights archive, and the old site homepage are retired.

## Runtime architecture

- React and Vite build the client application into `dist/client/`.
- The Cloudflare Worker entry is `dist/server/index.js`.
- `dist/client/` is bound as `ASSETS` with Worker-first routing.
- `server/index.js` handles `/api/admin/chapter/*` and `/admin/chapters` before static files or the SPA fallback.
- GitHub is the canonical content store for authorized Succession chapter media.

## Maintained routes

### Succession Contest

The dedicated archive owns:

- Story Intelligence
- voyage timeline
- manga reader
- Succession search
- characters and royal family
- assignments and organizations
- Black Whale and location records
- Nen, ritual systems, and Guardian Spirit Beasts
- events, relationships, chapter dossiers, research, and glossary

### Retained general reference

- `/nen` keeps the complete Nen system map and ability encyclopedia.

## Run locally

```bash
npm ci
npm run dev
```

## Validate and build

```bash
npm run build
```

The build runs the Succession runtime audit sweep, verifies the hosted chapter administrator, builds Vite, checks performance budgets, prepares the Worker artifact, and validates the Cloudflare release shape.

## Deploy to Cloudflare

```bash
npm run deploy
```

`wrangler.jsonc` must retain:

- Worker name `hunter`;
- entry `dist/server/index.js`;
- asset directory `dist/client`;
- binding `ASSETS`;
- `run_worker_first: true`;
- disabled automatic HTML and not-found rewriting.

A successful commit is not proof of a hosted release. Record deployment success only after Cloudflare reaches terminal success.

## Core content owners

- Succession routes: `src/data/succession/archiveRoutes.js`
- Public route boundary: `src/data/routeManifest.js`
- Browser routing: `src/lib/appRouter.js`
- Succession application: `src/components/succession/`
- General Nen data and interface: `src/data/nenEncyclopedia.js`, `src/components/NenEncyclopedia.jsx`
- Succession geography: `src/data/succession/blackWhaleCanonicalMap.js` and the Black Whale / Locations workspaces
- Succession chapter media: `src/data/successionChapterMedia.generated.js`
- Cloudflare Worker: `server/index.js`, `server/chapter-admin.js`, `wrangler.jsonc`

## Chapter administrator

The protected administrator remains at `/admin/chapters`. Its API family is `/api/admin/chapter/*` and must always return JSON rather than `index.html`.

Required Worker secrets and variables are documented in `docs/HOSTED-CHAPTER-ADMIN.md`.
