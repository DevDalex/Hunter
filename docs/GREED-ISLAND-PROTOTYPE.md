# Greed Island prototype page

Status: **Batch 6 Story redesign**  
unsupported narrow-width status: **deferred**

Batch 6 turns Greed Island into a dedicated Story prototype page after the Early Arc and Yorknew batches. It treats the arc as a game manual, card binder, strategy board, training dossier, and completion route.

## What this batch owns

1. `/story/greed-island` routes through `GreedIslandPrototypePage`.
2. `src/data/greedIslandPrototype.js` owns the Greed Island page data, card catalogue, card counts, route ledger, rules, locations, teams, training records, conflict records, Razor/dodgeball notes, Bomber notes, completion route, adaptation notes, and approved source links.
3. The card catalogue includes all 100 Specified Slot card names, all 40 Spell Card names, selected Free Slot records, and the Game Master-only cards listed on Hunterpedia.
4. The UI keeps the full card list searchable and filterable instead of rendering a long static wiki table first.
5. The card data stores names, category, and editorial story-use grouping. Long Hunterpedia card descriptions are intentionally not copied into the repository.
6. The page keeps Greed Island visually distinct from green island theming: dark game-cartridge shell, warm paper sections, electric blue/cyan interface accents, magenta game-system accents, antique-gold completion markers, and red danger markers for Bomber pressure.
7. `npm run audit:story` now checks Greed Island routing, module coverage, data counts, card totals, approved source hosts, and deferred unsupported narrow-width scope.

## What this batch does not own

Batch 6 does not redesign Chimera Ant, Chairman Election, Volume 0, Succession, Characters, or unsupported narrow-width layouts. It does not create a separate `/cards` route yet; the card catalogue lives inside the Greed Island arc page.

## Runtime files

- `src/data/greedIslandPrototype.js`
- `src/components/GreedIslandPrototypePage.jsx`
- `src/components/GreedIslandPrototypePage.css`
- `src/components/SeriesWorkspace.jsx`
- `scripts/audit-story-architecture.mjs`

## Acceptance rule

`npm run audit:story` must confirm that Greed Island routes through its dedicated prototype page, that card counts remain 100 specified / 40 spell / 4 Game Master records, that the page retains game rules, card catalogue, spell strategy, player teams, training, Razor/dodgeball, Bomber, completion, aftermath, adaptation, and Hunterpedia source modules, and that all Greed Island sources pass the approved Hunterpedia/Fandom source policy.
