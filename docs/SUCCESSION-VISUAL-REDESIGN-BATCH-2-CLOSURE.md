# Succession Visual Redesign — Batch 2 Closure

## Scope

Batch 2 completes the shared shell, navigation, route orientation, chapter boundary, search presentation, and archive landing experience without changing canonical data, search matching, chapter availability, routing, imports, or workspace ownership.

## Hour 18 — Main navigation

The desktop sidebar and mobile drawer retain the canonical grouped route registry while gaining a consistent dossier-navigation treatment:

- deliberate group separation and scan lines;
- 46px desktop and 48px drawer route targets;
- contained route icons;
- explicit active-route treatment through the existing `aria-current="page"` state;
- visible active-state marker that does not depend on color alone;
- preserved pointer-intent and focus-intent preloading;
- no duplicated or alternate route registry.

## Hour 19 — Local navigation and orientation

The shared `ArchiveTabs` contract remains semantic and is presented as a sticky, horizontally reachable local orientation rail:

- existing `tablist`, `tab`, and `aria-selected` semantics are preserved;
- active state is visible through border, surface, text, and underline treatment;
- long tab collections scroll instead of shrinking below readable size;
- the rail stays available during long-page reading;
- tablet and mobile offsets account for the archive command bar;
- reduced-motion users receive no translation effects.

## Hour 20 — Chapter controls and release boundary

`SpoilerControl` now presents the publication boundary as an archive control rather than a bare form:

- bounded and current-authorized states are explicitly labeled;
- research checkpoints and custom maximum chapter remain available;
- previous-preset and latest-authorized navigation use the existing `onChange` contract;
- the current chapter and authorized maximum remain visible in an `aria-live` status;
- pending, unreleased, or unimported chapters are explicitly described as excluded;
- all values remain clamped to the generated authorized maximum.

## Hour 21 — Search and filters

The existing canonical search and workspace-filter logic is unchanged. Batch 2 redesigns its presentation:

- global search becomes a stable command surface with clear focus hierarchy;
- result totals remain announced through the existing live status;
- canonical result groups become bounded archive sections;
- result cards expose domain, label, summary, match reason, and destination without changing ranking;
- workspace filters receive visible focus-within treatment;
- search results retain full-width mobile actions and 44px targets.

## Hour 22 — Landing hero and primary entry points

The existing `succession-entry-points` section becomes the archive landing hero:

- a formal framed archive surface establishes the page identity;
- title and supporting copy receive a clear reading hierarchy;
- existing featured routes remain the primary entry cards;
- Story and Reader receive stronger first-row emphasis without changing destinations;
- the hero collapses from three columns to two and then one as space decreases.

## Hour 23 — Archive summaries and featured panels

The existing canonical validation and route-registry summaries become structured landing panels:

- catalogue health presents entity, character, portrait, and chapter totals;
- the route matrix remains generated from `successionArchiveGroups` and `successionArchiveRoutes`;
- every group receives a contained directory panel;
- route status remains visible on larger screens and is removed only when necessary on very small screens;
- no hand-maintained route list or duplicated catalogue is introduced.

## Hour 24 — Responsive navigation and Batch 2 regression review

Batch 2 closure owns responsive behavior across the shared experience:

- desktop sidebar navigation remains independently scrollable;
- the mobile drawer retains focus trapping, Escape handling, and canonical links;
- tabs and search remain sticky below the mobile command bar;
- chapter controls reflow into a single-column sequence;
- landing grids collapse without horizontal spill;
- all new presentation uses semantic foundation tokens;
- the closure layer contains no raw hexadecimal colors or `!important` declarations;
- reduced-motion behavior is explicit.

## Batch 2 closure gate

Run:

```bash
npm run audit:succession-visual-foundation
npm run audit:succession-shell-redesign
npm run audit:succession-page-header-redesign
npm run audit:succession-breadcrumb-redesign
npm run audit:succession-batch-2
npm run report:succession-visual-inventory
npm run audit:css
npm run audit:readability
npm run audit:accessibility
```

The dedicated workflow must also complete the direct Vite presentation build and render Story, Timeline, Characters, Black Whale, Nen, and Research at desktop, tablet, and mobile sizes. Batch 2 may close only after the complete 18-render matrix passes without a branch-only runtime regression.
