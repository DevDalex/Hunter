# Succession Visual Redesign — Batch 5

## Objective

Batch 5 connects the completed Succession workspaces through advanced visualizations and closes the product at responsive, accessibility, performance, interaction, and cross-browser levels without changing canonical records, research conclusions, source provenance, or chapter boundaries.

## Hour 51 — Global Succession timeline

- Replace the legacy chronology presentation with a global intelligence command.
- Preserve complete-series, single-arc, and detailed Succession voyage scales in one route.
- Add a cinematic reading-boundary hero, release signal, structural metrics, chronology-scale rail, arc cards, and phase ledger.
- Reframe the detailed voyage as an operational record rather than a loose event list.
- Retain all maintained pre-voyage periods, voyage days, event details, sources, confidence states, locations, chapters, and narrative-pressure separation.
- Keep the same timeline available through both the global `/timeline` route and the Succession `/succession/timeline` route.

## Hour 52 — Timeline filtering and mobile presentation

- Add compound filtering by free text, story thread, time-confidence state, location, and chapter range.
- Add dynamic counts for visible events, voyage days, chapters, and locations.
- Preserve chronology, concurrent lanes, story-thread, chapter-order, and location views.
- Add selected-event intelligence with time, confidence, place, thread membership, chapter source, and ship-atlas action.
- Retain overview, standard, and complete density controls.
- Pair the wide concurrent-lane matrix with an ordinary lane-by-lane mobile list so the graphic is never the only readable representation.
- Add mobile-safe stacking, horizontal rails, 44px controls, touch behavior, and reduced-motion handling.

## Acceptance gate

```bash
node scripts/audit-succession-batch-5-timeline.mjs
npm run audit:succession-visual-foundation
npm run audit:succession-shell-redesign
npm run audit:succession-page-header-redesign
npm run audit:succession-breadcrumb-redesign
npm run audit:succession-batch-2
npm run audit:succession-character-command
npm run audit:succession-royal-command
npm run audit:succession-batch-3
node scripts/audit-succession-batch-4-chapters.mjs
node scripts/audit-succession-batch-4-story.mjs
node scripts/audit-succession-batch-4-events.mjs
node scripts/audit-succession-batch-4-nen-release.mjs
node scripts/audit-succession-batch-4-guardian-beasts.mjs
node scripts/audit-succession-batch-4-spatial.mjs
npm run audit:css
npm run audit:readability
npm run audit:accessibility
npm run prepare:eta-assets
npx vite build
```

The dedicated workflow then renders the global Timeline and the Succession Timeline at desktop, tablet, and mobile sizes.

## Remaining Batch 5 scope

- Hours 53–54: relationship graph, focused relationship analysis, and accessible list views.
- Hours 55–56: Black Whale map and chapter-sensitive occupancy/movement.
- Hours 57–58: assignment workspace and advanced table/result presentation.
- Hours 59–64: interaction and motion polish, complete responsive/accessibility/performance review, legacy cleanup, cross-browser regression, final audit, debt record, and project closure.
