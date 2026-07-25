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

## Presentation constraints

- Use semantic Succession design tokens.
- Do not introduce raw hexadecimal colors or `!important`.
- Retain 44px control targets.
- Do not depend on hover for touch layouts.
- Provide reduced-motion behavior.
- Keep the Reader as a separate route.

## Validation

```bash
node scripts/audit-succession-batch-4-chapters.mjs
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

The Batch 4 workflow renders the Chapters workspace at desktop, tablet, and mobile sizes.

## Remaining work

- Hour 41: Story overview and phases.
- Hour 42: Parallel Story lanes.
- Hour 43: Story-thread presentation.
- Hour 44: Causal links and consequences.
- Hour 45: Event directory.
- Hour 46: Event dossiers.
- Hour 47: Nen ability directory and cards.
- Hour 48: Ability dossiers and mechanic explanations.
- Hour 49: Guardian Spirit Beasts and ritual systems.
- Hour 50: Locations, Black Whale reference, and Batch 4 closure.
