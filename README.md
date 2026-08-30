# Hunter × Hunter Succession Contest Archive

## Scope

This repository is maintained for the **Succession Contest arc only**.

The public application focuses on the Succession Contest experience and its directly related material: story intelligence, voyage chronology, characters and royal family, assignments and organizations, Black Whale locations, Succession-specific Nen and ritual systems, Guardian Spirit Beasts, events, relationships, chapter dossiers, research, search, and glossary tools.

Earlier-arc pages, general-series encyclopedias, the standalone World Atlas, general Nen encyclopedia, manga page hosting, and chapter administration/import tooling are intentionally removed.

## Runtime architecture

- React and Vite build the client into `dist/client/`.
- The Cloudflare Worker entry is `dist/server/index.js`.
- `dist/client/` is exposed through the `ASSETS` binding.
- The Worker provides static asset serving plus SPA fallback routing only.
- There are no chapter-admin or manga-import endpoints.

## Run locally

```bash
npm ci
npm run dev
```

## Validate and build

```bash
npm run verify
```

For a production bundle without the full verification pass:

```bash
npm run build
```

## Deploy to Cloudflare

```bash
npm run deploy
```

`wrangler.jsonc` keeps the Worker name `hunter`, entry `dist/server/index.js`, asset directory `dist/client`, binding `ASSETS`, and Worker-first routing.

## Core content owners

- Succession application: `src/components/succession/`
- Succession data: `src/data/succession/`
- Succession route registry: `src/data/succession/archiveRoutes.js`
- Browser entry: `src/App.jsx`
- Succession geography: `src/data/succession/blackWhaleCanonicalMap.js`
- Cloudflare Worker: `server/index.js`

## Repository policy

New features should stay inside the Succession Contest scope. Do not reintroduce earlier-arc archives, general-series reference surfaces, manga scan storage, or publishing/admin infrastructure without an explicit scope change.
