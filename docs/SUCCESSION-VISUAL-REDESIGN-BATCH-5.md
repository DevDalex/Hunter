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

## Hour 53 — Relationship graph

- Replace the flat relationship directory with a chapter-sensitive intelligence network.
- Render only canonical relationship records already active at the selected chapter.
- Distinguish allied, hostile, mixed, and uncertain sentiment without using color as the only signal.
- Preserve directed and bidirectional edges, source and target nodes, type, subtype, strength, status, chapter range, and evidence state.
- Add a highest-connectivity graph and focused radial neighborhoods around a selected character or organization.
- Keep direct navigation from every visible node and edge into its canonical dossier.

## Hour 54 — Focused and accessible relationship views

- Add graph, accessible edge-list, and dossier-card modes over the same filtered records.
- Pair every visual graph with a complete textual edge ledger.
- State source node, target node, direction, relationship type, sentiment, status, and chapter span in ordinary markup.
- Add focused node snapshots with incoming, outgoing, neighboring, and total edge counts.
- Preserve relationship evidence, operational state, interpretive limits, linked events, sources, and entity records.
- Add responsive graph reduction, mobile semantic reading order, touch-safe controls, and reduced-motion behavior.

## Acceptance gate

```bash
node scripts/audit-succession-batch-5-timeline.mjs
node scripts/audit-succession-batch-5-relationships.mjs
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

The dedicated workflow renders the global Timeline, Succession Timeline, and Relationships workspace at desktop, tablet, and mobile sizes.

## Remaining Batch 5 scope

- Hours 55–56: Black Whale map and chapter-sensitive occupancy/movement.
- Hours 57–58: assignment workspace and advanced table/result presentation.
- Hours 59–64: interaction and motion polish, complete responsive/accessibility/performance review, legacy cleanup, cross-browser regression, final audit, debt record, and project closure.
