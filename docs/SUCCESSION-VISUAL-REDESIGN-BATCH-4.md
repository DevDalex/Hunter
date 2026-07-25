# Succession Visual Redesign — Batch 4

## Objective

Batch 4 redesigns the chapter, Story, event, Nen, Guardian Spirit Beast, location, and Black Whale reference interfaces while preserving the existing data and chapter boundary rules.

## Hour 37 — Chapter directory

- Add a chapter intelligence overview.
- Add imported, documented, partial, pending, and Story-lane metrics.
- Add text, Story-phase, and research-state filters.
- Add intelligence-card and compact-index layouts.
- Show event, cast, and Story-thread counts on chapter records.

## Hour 38 — Chapter-page headers

- Add an oversized chapter identity stage.
- Show title, phase, voyage day, research state, event count, open Story pressure, and evidence count.
- Add Reader, Story-phase, previous-chapter, and next-chapter controls.
- Show progress through the current Story phase.

## Hour 39 — Chapter summaries and event sequences

- Separate events that begin here from operations already in progress.
- Present maintained state changes as an ordered sequence.
- Show event chapter span, category, participant count, location count, and consequence count.
- Preserve links to Story lanes, event records, cast, locations, institutions, and Nen records.

## Hour 40 — Evidence and chapter safety

- Show the authorized chapter boundary throughout the dossier.
- Add a dedicated evidence and uncertainty board.
- Show source count, research state, unresolved Story-thread count, and selected boundary.
- Keep documented facts, maintained interpretation, unresolved questions, and missing documentation visually distinct.
- Keep imported but unannotated chapters explicitly marked as pending.

## Hour 41 — Story overview and narrative phases

- Add a narrative-intelligence command hero for the current authorized Story snapshot.
- Add phase, lane, event, thread, and causal-link metrics.
- Redesign the phase directory as a numbered chronological architecture.
- Show visible chapter range, lane count, event count, thread count, and current-phase state.
- Redesign phase dossiers with range identity, lane structure, event chronology, Story pressure, and evidence.

## Hour 42 — Parallel Story lanes

- Add synchronized Story swimlanes across a shared Chapter 340-to-current axis.
- Place event markers according to their canonical starting chapters.
- Add focus controls for one lane or all active lanes.
- Preserve ordinary lane buttons and mobile event lists as accessible alternatives.
- Redesign lane dossiers with phase history, event chronology, actors, and pressure records.

## Hour 43 — Story-thread presentation

- Promote open questions into status-aware evidence cards.
- Show category, opening chapter, exact question, and current status.
- Redesign thread dossiers with plotline, evidence-event, subject, and source counts.
- Keep resolved and unresolved thread states structurally and textually distinct.

## Hour 44 — Causal links and consequences

- Add a causal river that shows maintained source-event, relationship, target-event, and summary records.
- Keep every source and consequence node directly navigable to its event dossier.
- Preserve textual relationship labels so meaning does not depend on connectors or color.
- Limit the presentation to causal edges already exposed by the Story graph.

## Hour 45 — Event directory

- Add a canonical event-command hero and visible event, active, resolved, unresolved, and causal-edge metrics.
- Keep existing status, category, faction, location, ability, and chapter filters.
- Add active-filter chips and a one-step reset.
- Add operational timeline, intelligence-grid, and compact-index views.
- Show chapter span, state, participants, locations, abilities, consequences, and portrait stacks on event records.

## Hour 46 — Event dossiers

- Add a chapter-range identity stage with category, state, knowledge, importance, voyage day, and evidence context.
- Add direct Chapter and Story intelligence actions.
- Add a persistent chapter-boundary notice.
- Present causes, event action, and available outcomes as a three-part operational pipeline.
- Preserve state changes, unresolved questions, participants, organizations, locations, Nen abilities, predecessors, consequences, sources, and previous/next event navigation.
- Keep later outcomes and graph nodes hidden until their supporting chapter is authorized.

## Presentation constraints

- Use semantic Succession design tokens.
- Do not introduce raw hexadecimal colors or `!important` in the new route-owned visual files.
- Retain 44px control targets.
- Do not depend on hover for touch layouts.
- Provide reduced-motion behavior.
- Keep the Reader as a separate route.
- Keep advanced lane and causal visuals paired with ordinary semantic controls.
- Keep event filters and dossiers projected through the current chapter boundary.

## Validation

```bash
node scripts/audit-succession-batch-4-chapters.mjs
node scripts/audit-succession-batch-4-story.mjs
node scripts/audit-succession-batch-4-events.mjs
npm run audit:succession-visual-foundation
npm run audit:succession-shell-redesign
npm run audit:succession-page-header-redesign
npm run audit:succession-breadcrumb-redesign
npm run audit:succession-batch-2
npm run audit:succession-character-command
npm run audit:succession-royal-command
npm run audit:succession-batch-3
npm run audit:css
npm run audit:readability
npm run audit:accessibility
npm run prepare:eta-assets
npx vite build
```

The Batch 4 workflow renders the Chapters, Story, and Events workspaces at desktop, tablet, and mobile sizes.

## Remaining work

- Hour 47: Nen ability directory and cards.
- Hour 48: Ability dossiers and mechanic explanations.
- Hour 49: Guardian Spirit Beasts and ritual systems.
- Hour 50: Locations, Black Whale reference, and Batch 4 closure.
