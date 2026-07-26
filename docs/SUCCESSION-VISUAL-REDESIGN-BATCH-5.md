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

## Hour 55 — Advanced Black Whale map

- Upgrade the sourced ship cross-section into a temporal spatial-intelligence command.
- Add Atlas, Occupancy, and Movement modes over the same canonical hotspot bridges.
- Preserve exact, aggregate, approximate, and legacy precision labels for every mapped record.
- Add chapter controls, active-location metrics, mapped occupant totals, event totals, and movement-path totals.
- Add occupancy and arrival badges directly to map markers without replacing the numbered hotspot index.
- Retain zoom, tier focus, hotspot paging, selected-location inspector, sourced imagery, canonical actions, royal-room plan, route reference, manifest, and room directory.

## Hour 56 — Chapter-sensitive occupancy and movement

- Resolve every mapped hotspot through `getLocationSnapshot(locationId, chapter)`.
- Recalculate occupants, assignments, events, abilities, room summaries, and selected-location intelligence whenever the chapter changes.
- Derive character movement paths from maintained location-history records instead of invented route assumptions.
- Show the latest mapped transition for each visible character, including previous location, arrival location, and chapter.
- Add a complete semantic location or movement ledger below the map so spatial meaning never depends on image position, line drawing, or color.
- Preserve chapter boundaries, touch-safe controls, responsive stacking, horizontal map navigation, and reduced-motion behavior.

## Hour 57 — Assignment operations command

- Replace the legacy dark assignment directory with a chapter-sensitive operational command.
- Keep operative, principal, protected or targeted subject, allegiance, reporting line, physical location, secrecy, status, chapter range, predecessor, successor, related events, and evidence as separate maintained fields.
- Add a cinematic command hero, active-snapshot signal, archive metrics, and assignment-family architecture.
- Add complete-archive and active-at-chapter scopes without hiding historical operations.
- Add personnel role snapshots and redesigned assignment dossiers with command chain, objective, authority basis, notes, succession, events, and sources.

## Hour 58 — Advanced tables and result presentation

- Provide command-card, sortable table, and compact ledger modes over the same filtered assignment records.
- Add sorting by chapter, assignment name, assignment type, and operative name.
- Add compound search, type, status, secrecy, scope, and chapter controls with removable active-filter chips.
- Add paginated result expansion for large sets instead of rendering an unbounded directory.
- Keep the table semantically structured, horizontally navigable where necessary, and paired with card and ledger alternatives.
- Preserve active-snapshot labels, explicit secrecy and status text, 44px controls, touch behavior, mobile stacking, and reduced motion.

## Acceptance gate

```bash
node scripts/audit-succession-batch-5-timeline.mjs
node scripts/audit-succession-batch-5-relationships.mjs
node scripts/audit-succession-batch-5-black-whale.mjs
node scripts/audit-succession-batch-5-assignments.mjs
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

The dedicated workflow renders the global Timeline, Succession Timeline, Relationships, Black Whale, and Assignments workspaces at desktop, tablet, and mobile sizes.

## Remaining Batch 5 scope

- Hours 59–64: interaction and motion polish, complete responsive/accessibility/performance review, legacy cleanup, cross-browser regression, final audit, debt record, and project closure.
