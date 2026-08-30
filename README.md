# Hunter × Hunter Succession Contest Archive

## Scope

This repository is maintained for the **Succession Contest arc only**.

The public product has exactly three first-class content systems:

1. **Timeline** — chapters, events, story threads, chronology, Black Whale locations and movement, causal context, and changing story state.
2. **Characters** — royalty, guards, Hunters, mafia, the Troupe, affiliations, assignments, relationships, status, knowledge, and movement.
3. **Nen** — abilities, Guardian Spirit Beasts, ritual mechanics, conditions, costs, curses, possession, instruction, Contagion, and unresolved systems.

Other Succession data may exist only when it directly supports one of those three systems. Organizations, assignments, relationships, locations, events, royal-family data, Guardian Spirit Beasts, chapter records, evidence, and similar material are supporting data rather than independent products.

Earlier arcs, general-series encyclopedias, the World Atlas, general Nen encyclopedia, manga page hosting, the manga Reader, and chapter administration/import tooling are intentionally removed.

## Public routes

- `/timeline`
- `/characters`
- `/nen`

`/` is only the three-pillar entrance. Retired Succession routes redirect into the pillar that owns their information.

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

## Repository policy

The product owner decides presentation and product direction. Permanent checks may catch real breakage, malformed data, spoiler leaks, accessibility failures, serious performance regressions, vulnerable dependencies, invalid media output, or an undeployable build. They must not freeze colors, layouts, component structures, route counts, milestone phases, or previous design decisions.

New public features should fit Timeline, Characters, or Nen unless the product scope is explicitly changed.
