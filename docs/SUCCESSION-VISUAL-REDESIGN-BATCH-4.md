# Succession Visual Redesign — Batch 4

## Objective

Batch 4 redesigns the chapter, Story, event, Nen, Guardian Spirit Beast, location, and Black Whale reference interfaces while preserving canonical data, source provenance, research conclusions, routing, and chapter boundaries.

## Task register

### Hour 37 — Chapter directory

Cinematic chapter-intelligence command, metrics, search, phase/research filters, and intelligence-card plus compact-index directory modes.

### Hour 38 — Chapter-page headers

Oversized chapter identity stage, phase progress, Reader and Story actions, research state, and previous/next navigation.

### Hour 39 — Chapter summaries and event sequences

Begins here, Already moving, and State change sequences with chapter, participant, location, and consequence context.

### Hour 40 — Evidence, uncertainty, and spoiler safety

Persistent authorized boundary, evidence board, documentation gaps, unresolved questions, and explicit pending-research treatment.

### Hour 41 — Story overview and narrative phases

Current-snapshot narrative command, phase architecture, metrics, and phase dossiers.

### Hour 42 — Parallel Story lanes

Synchronized chapter-positioned swimlanes with focus controls and accessible unsupported narrow-width alternatives.

### Hour 43 — Story-thread cards

Status-aware evidence records and thread dossiers with categories, chapters, questions, connected records, and sources.

### Hour 44 — Causal links and consequences

Navigable causal river limited to source, relationship, target, and explanation records already published by the Story graph.

### Hour 45 — Event directory

Operational timeline, intelligence-grid, compact-index views, metrics, and existing event facets with active-filter controls.

### Hour 46 — Event pages

Dedicated dossiers with chapter range, cause/action/outcome pipeline, state changes, questions, linked entities, event graph, evidence, and navigation.

### Hour 47 — Nen ability directory and cards

Systems/abilities modes, knowledge and mechanics filters, status-aware records, and six-stage mechanic summaries.

### Hour 48 — Ability dossiers and mechanic explanations

Trigger, range, target, duration, cost, limitation, owners, systems, events, actors, evidence, and interpretive boundaries.

### Hour 49 — Guardian Spirit Beasts, rituals, and systems

Fifteen-position Seed Urn-centered orbit, host/beast browsing, state filters, body/consciousness/Nen separation, knowledge history, ritual links, and evidence.

### Hour 50 — Locations, Black Whale reference, and Batch 4 closure

Canonical spatial command plus premium Black Whale atlas, inspector, bridge precision, sourced gallery, room plan, routes, manifest, directory, and final regression closure.

## Completed chapter intelligence

- Cinematic chapter-intelligence command and chapter metrics.
- Search across chapters, events, lanes, state changes, and Story pressure.
- Story-phase and research-state filters.
- Intelligence-card and compact-index directory modes.
- Oversized chapter identity stage, phase progress, Reader/Story controls, and previous/next navigation.
- Structured Begins here / Already moving / State change sequence.
- Persistent chapter boundary and evidence/uncertainty board.
- Explicit pending-research treatment for imported but unannotated chapters.

## Completed Story intelligence

- Current-snapshot command hero and phase architecture.
- Synchronized Story swimlanes across a shared chapter axis.
- Accessible stacked lane alternatives for unsupported narrow-width.
- Status-aware Story-thread evidence records and dossiers.
- Causal river with navigable source event, relationship, target consequence, and explanation.
- Maintained graph edges only; no inferred relationships are manufactured by presentation code.

## Completed event intelligence

- Event command hero and visible, active, resolved, unresolved, and causal-edge metrics.
- Existing status, category, faction, location, ability, and chapter filters retained.
- Operational timeline, intelligence-grid, and compact-index views.
- Dedicated event dossiers with chapter range, category, state, knowledge, importance, voyage day, evidence, cause/action/outcome pipeline, state changes, questions, linked entities, event graph, sources, and previous/next navigation.

## Completed Nen mechanics laboratory

- Systems and abilities retained as distinct archive modes.
- Knowledge, category, Nen type, owner, and system filtering.
- Status-aware ability and system records.
- Six-stage mechanic model: trigger, range, target, duration, cost, and limitation.
- Dedicated ability and system dossiers with mechanics, owners, connected systems, events, Guardian Spirit Beasts, actors, evidence, and interpretive boundaries.

## Completed Guardian Spirit Beast intelligence

- Fifteen-position Seed Urn-centered royal Nen orbit with a complete semantic host index.
- Host-first and beast-first browsing.
- Search, knowledge-state, host-state, and active-filter controls.
- Status-aware beast records with known, suspected, unresolved, visibility, and host-state context.
- Dedicated dossiers separating host body, host consciousness, beast activity, and Nen continuation.
- Ability models, unresolved research records, knowledge timeline, ritual-system links, and evidence.

## Completed spatial reference intelligence

- Canonical spatial command with hierarchy, type, tier, access, and chapter-snapshot filtering.
- Redesigned location cards and dossiers covering breadcrumbs, contained locations, occupants, assignments, events, abilities, movement history, and sources.
- Premium Black Whale atlas framing with zoom controls, hotspots, complete location index, canonical bridge precision, selected-location inspector, sourced visual tour, royal-room plan, movement routes, passenger manifest, and room directory.
- Canonical location dossiers remain the source of truth; the atlas remains a navigational and sourced reference layer.

## Presentation constraints

- Semantic Succession design tokens.
- No new canonical claims, source changes, or spoiler-boundary changes.
- No raw hexadecimal colors or route-owned `!important` overrides in the new Batch 4 command styles.
- 44px control targets.
- Keyboard and touch access without hover dependency.
- Reduced-motion behavior.
- Advanced graphics paired with ordinary semantic controls and lists.

## Final validation

The Batch 4 closure workflow runs:

```bash
node scripts/audit-succession-batch-4-chapters.mjs
node scripts/audit-succession-batch-4-story.mjs
node scripts/audit-succession-batch-4-events.mjs
node scripts/audit-succession-batch-4-nen-release.mjs
node scripts/audit-succession-batch-4-guardian-beasts.mjs
node scripts/audit-succession-batch-4-spatial.mjs
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

It then renders Chapters, Story, Events, Nen, Guardian Spirit Beasts, Locations, and Black Whale at desktop, unsupported narrow-width, and unsupported narrow-width sizes.

Final result: all audits and the production build pass, and **21 of 21 route-and-viewport renders pass**. Manual review confirmed the materially redesigned Guardian Spirit Beast, Location, and Black Whale screens are visually sound on desktop and unsupported narrow-width.

Batch 4 is complete. Batch 5 begins with the global Succession timeline and advanced visualization closure work.
