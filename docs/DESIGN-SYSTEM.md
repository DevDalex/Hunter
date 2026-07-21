# Batch 12 — Design system / Archive UI library

Status: active Batch 12 contract
Date: 2026-07-20
Scope: reusable archive primitives, shared evidence language, source blocks, cards, ledgers, and maintainable UI rules

## Purpose

Batch 12 stops future archive pages from becoming custom one-off layouts. It introduces a small reusable component library for common Black Archive patterns while preserving the current route inventory and source policy.

This is not a new major reader-facing route. It is an additive UI foundation, and it no longer has a reader-facing demonstration on the home page.

## Canonical files

- `src/data/archiveDesignSystem.js` owns the design-system contract, primitive list, semantic tones, and rules.
- `src/components/ArchiveUI.jsx` owns reusable React primitives.
- `src/styles/archive-system.css` owns the shared primitive styles.
- `scripts/audit-design-system.mjs` keeps the contract build-blocking.
- `docs/DESIGN-SYSTEM.md` documents Batch 12.

## Primitives

### ArchiveSection

Reusable section shell with kicker, title, description, actions, and `aria-labelledby` wiring.

### ArchiveCard

Reusable paper/ink/steel card for archive records, gateways, summaries, and linked cards.

### EvidenceBadge

Reusable label for confirmed, inferred, unclear, deferred, source-index-only, manga-only, and anime-only states.

### StatusPill

Reusable compact token for status, blockers, design debt, media state, and maintenance state.

### SourceStack

Reusable Hunterpedia/Fandom source block with safe external-link behavior.

### ArchiveLedger

Reusable definition-list ledger for counts, budgets, routes, gates, and record facts.

## Semantic tones

The shared tone vocabulary mirrors the governance evidence states:

- confirmed;
- inferred;
- unclear;
- deferred;
- source-index-only;
- manga-only;
- anime-only.

Do not invent decorative badge colors for evidence states when this vocabulary fits.

## CSS layer

`src/styles/archive-system.css` is imported by `src/styles.css` after the semantic contrast layer and before runtime CSS extensions. It owns only reusable primitive styling, not route-specific story layouts.

The layer must keep:

- an explicit 11px minimum for compact badge/metadata text;
- responsive collapse for shared card grids;
- Black Archive color tokens;
- safe focus treatment for interactive cards;
- source blocks with clear Hunterpedia/Fandom source framing.

## Build gate

`audit:design-system` is part of the 16 independent pre-build audits in aggregate preflight. It verifies:

1. contract statistics match the design-system registry;
2. each primitive has a component and required CSS class;
3. semantic tones cover the current evidence vocabulary;
4. source/external links use safe attributes;
5. the global CSS chain imports the design-system layer;
6. the removed home-page showcase does not return;
7. README, handbook, docs, package scripts, and aggregate preflight are synchronized.

## Boundaries

Batch 12 does not:

- add a new major route;
- require a reader-facing component-library showcase;
- delete characters or reduce the character directory;
- change the Hunterpedia/Fandom source policy;
- complete the visible governance UI;
- resolve all legacy color-contrast design debt;
- reopen mobile-specific redesign.

The next natural feature after this batch is the visible governance UI: bibliography desk, evidence-state viewer, review queue, and source-policy dashboard.
