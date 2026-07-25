# Succession Visual Redesign — Batch 4

## Objective

Batch 4 redesigns the chapter, Story, event, Nen, Guardian Spirit Beast, location, and Black Whale reference interfaces while preserving canonical data, source provenance, research conclusions, routing, and chapter boundaries.

## Hours 37–40 — Chapter intelligence

- Cinematic chapter-intelligence command and chapter metrics.
- Search across chapters, events, lanes, state changes, and Story pressure.
- Story-phase and research-state filters.
- Intelligence-card and compact-index directory modes.
- Oversized chapter identity stage, phase progress, Reader/Story controls, and previous/next navigation.
- Structured Begins here / Already moving / State change sequence.
- Persistent chapter boundary and evidence/uncertainty board.
- Explicit pending-research treatment for imported but unannotated chapters.

## Hours 41–44 — Story intelligence

- Current-snapshot command hero and phase architecture.
- Synchronized Story swimlanes across a shared chapter axis.
- Accessible stacked lane alternatives for mobile.
- Status-aware Story-thread evidence records and dossiers.
- Causal river with navigable source event, relationship, target consequence, and explanation.
- Maintained graph edges only; no inferred relationships are manufactured by presentation code.

## Hours 45–46 — Event intelligence

- Event command hero and visible, active, resolved, unresolved, and causal-edge metrics.
- Existing status, category, faction, location, ability, and chapter filters retained.
- Operational timeline, intelligence-grid, and compact-index views.
- Dedicated event dossiers with chapter range, category, state, knowledge, importance, voyage day, evidence, cause/action/outcome pipeline, state changes, questions, linked entities, event graph, sources, and previous/next navigation.

## Hours 47–48 — Nen mechanics laboratory

- Systems and abilities retained as distinct archive modes.
- Knowledge, category, Nen type, owner, and system filtering.
- Status-aware ability and system records.
- Six-stage mechanic model: trigger, range, target, duration, cost, and limitation.
- Dedicated ability and system dossiers with mechanics, owners, connected systems, events, Guardian Spirit Beasts, actors, evidence, and interpretive boundaries.

## Hour 49 — Guardian Spirit Beasts and rituals

- Fifteen-position Seed Urn-centered royal Nen orbit with a complete semantic host index.
- Host-first and beast-first browsing.
- Search, knowledge-state, host-state, and active-filter controls.
- Status-aware beast records with known, suspected, unresolved, visibility, and host-state context.
- Dedicated dossiers separating host body, host consciousness, beast activity, and Nen continuation.
- Ability models, unresolved research records, knowledge timeline, ritual-system links, and evidence.

## Hour 50 — Locations and Black Whale reference

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

It then renders Chapters, Story, Events, Nen, Guardian Spirit Beasts, Locations, and Black Whale at desktop, tablet, and mobile sizes.

Final result: all audits and the production build pass, and **21 of 21 route-and-viewport renders pass**. Manual review confirmed the materially redesigned Guardian Spirit Beast, Location, and Black Whale screens are visually sound on desktop and mobile.

Batch 4 is complete. Batch 5 begins with the global Succession timeline and advanced visualization closure work.
