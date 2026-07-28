# Succession Visual Redesign

## Objective

Redesign the Succession presentation without changing canonical data, research conclusions, chapter records, routing, search logic, source ownership, import workflows, or archive structure.

**Scope classification: presentation-only, desktop-only.**

## Schedule and tracking

The 64-hour implementation schedule is tracked in GitHub issue **#49**.

## Supported presentation contract

The redesign targets 1366×900 and 1600×1000. The shell uses a persistent dossier sidebar, a bounded workspace stage, keyboard-visible skip navigation, semantic tokens, readable text, reduced-motion behavior, and explicit horizontal containment. Widths below 1366px are not acceptance targets.

## Batch 1 — Visual foundation and design system

The foundation establishes shared semantic colors, typography, spacing, surfaces, component states, visible focus, reduced motion, and an 11px readability floor. Compatibility declarations may remain only where their removal would risk supported desktop layouts.

## Batch 2 — Shell, navigation, and landing experience

### Hour 15 — Shared shell and layout

The archive uses a two-column desktop frame with a viewport-sticky dossier sidebar, bounded sidebar scrolling, a controlled content stage, and a shared workspace focus target.

#### Preserved wide-workspace containment

Every direct workspace child uses intrinsic-size containment. Wide rails remain owned by the workspace that renders them; the shell does not conceal horizontal regressions.

### Hour 16 — Page headers and metadata

#### Workspace metadata rail

A shared route-header hierarchy presents classification, title, description, actions, and metadata without changing route ownership or canonical values.

### Hour 17 — Breadcrumbs and return paths

#### Return-path contract

Breadcrumbs preserve Story → Succession Archive → current workspace ancestry. The return action keeps the established callbacks and keyboard semantics.

### Hours 18–24 — Batch 2 closure

Batch 2 closes primary navigation, local tabs, chapter boundaries, search presentation, the archive landing hero, canonical summary panels, and desktop regression review.

## Batch 3 — People, royal family, and institutions

Character, prince, queen, family, and institution surfaces use canonical dossier APIs, accessible text equivalents for visualizations, keyboard-operable controls, semantic tables, and desktop containment.

## Batch 4 — Story intelligence

Story, chapter, event, Nen, Guardian Spirit Beast, and spatial workspaces remain chapter-bounded and evidence-linked.

## Batch 5 — Advanced visualizations and final closure

Timeline, relationship, assignment, and Black Whale workspaces retain semantic alternatives, stable routing, production performance budgets, reduced motion, forced-colors support, and desktop cross-browser verification.

## Rendered visual QA

Every curated Succession release route is rendered at 1366×900 and 1600×1000. Browser checks cover runtime errors, failed requests, horizontal overflow, uncontained spill, broken imagery, duplicate IDs, heading structure, workspace landmarks, readable type, accessibility violations, and layout shift.

## Compatibility strategy

Migrate one workspace family at a time, verify both supported desktop widths, remove only superseded compatibility declarations, run the full Succession and browser gates, and record remaining non-critical debt.

## Hourly safety check

At each checkpoint, confirm supported desktop pages render, links and controls work, style ownership remains scoped, and affected quality gates pass.
