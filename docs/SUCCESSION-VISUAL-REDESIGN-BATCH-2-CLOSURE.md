# Succession Visual Redesign — Batch 2 Closure

## Scope

Batch 2 completes the desktop shell, navigation, route orientation, chapter boundary, search presentation, and archive landing experience without changing canonical data, matching logic, chapter availability, routing, imports, or workspace ownership.

## Hour 18 — Main navigation

The persistent dossier sidebar uses the canonical grouped route registry, explicit current-page state, visible focus, route preloading, and one source of navigation truth.

## Hour 19 — Local navigation and orientation

`ArchiveTabs` remains a semantic, keyboard-operable orientation rail. Long collections retain their own bounded horizontal scroll region rather than shrinking below readable size.

## Hour 20 — Chapter controls and release boundary

`SpoilerControl` preserves chapter clamping, checkpoint navigation, publication status, and live status announcements.

## Hour 21 — Search and filters

Search and workspace filters preserve canonical matching and ranking while presenting clear focus hierarchy, grouped results, match reasons, and destination controls.

## Hour 22 — Landing hero and primary entry points

The archive landing hero establishes identity and preserves existing featured routes and destinations.

## Hour 23 — Archive summaries and featured panels

Catalogue health and route summaries remain generated from canonical registries rather than duplicated lists.

## Hour 24 — Desktop navigation and Batch 2 regression review

The sidebar remains independently scrollable; tabs and search remain stable; chapter controls and landing grids remain contained at 1366×900 and 1600×1000; presentation uses semantic tokens; reduced-motion behavior is explicit.

## Batch 2 closure gate

Run the foundation, shell, header, breadcrumb, Batch 2, CSS, readability, accessibility, build, and desktop browser-render gates. Batch 2 closes only after the supported desktop matrix passes without a branch-only runtime regression.
