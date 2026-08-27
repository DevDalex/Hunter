# Design Engineering Foundation

## Purpose

This foundation exists to make ambitious Succession Contest presentation safer to prototype and harder to dilute during implementation.

It does **not** replace the archive's canonical data, Vite/Cloudflare runtime, existing Succession visual foundation, media pipeline, spoiler controls, relationship records, story intelligence, or QA system.

## What already existed

Repository review confirmed that the archive already has mature versions of several things that would normally be added to a new project:

- semantic design tokens and scoped Succession visual rules;
- editorial and route-specific CSS ownership;
- chapter-boundary and spoiler audits;
- chapter-aware relationship records;
- story intelligence and thread selectors;
- media registry, dimensions, focal points, provenance, and derivative audits;
- Playwright/browser QA and accessibility checks;
- product capability definitions for playback, chapter diffs, graph views, spatial search, semantic zoom, and cross-route context.

Those systems remain authoritative.

## Deliberate non-additions

### Next.js

The current Vite + React + Cloudflare system is already deeply integrated with import tooling, audits, media preparation, and deployment. A framework migration would create risk without solving the presentation problem.

### Tailwind

The repository already has a large semantic CSS architecture and explicit stylesheet ownership. Adding a second styling grammar would increase ambiguity. Advanced compositions should use the existing tokens plus purpose-built CSS Grid, positioning, container behavior, and modern CSS.

### Lenis, Sigma, Pixi, Three.js

These remain evaluation-only. They should be added only when a specific interaction proves that native scrolling, DOM/CSS, or the existing rendering layer is insufficient.

## Added tooling

### Storybook

Use it as the isolated visual workshop for typography, crop treatments, annotations, motion states, and reusable composition primitives.

```bash
npm run storybook
npm run storybook:build
```

### Local composition lab

A dev-only route is available at:

```text
/__design-lab
```

Launch it with:

```bash
npm run design:lab
```

The route is excluded from production behavior through `import.meta.env.DEV`.

### Motion

`motion` is the default interaction layer for state transitions and restrained reveal behavior. Reduced-motion preferences remain authoritative.

### GSAP + ScrollTrigger

GSAP is loaded lazily through `src/lib/motion/successionMotion.js` and is reserved for sequences where scroll explains narrative or spatial state. It is not the default animation tool.

### Base UI

Base UI is available for future accessible dialogs, popovers, comboboxes, menus, and similar behavior without imposing a visual design system.

### Zod

`src/data/succession/presentationSchema.js` validates presentation metadata separately from canonical lore data. It provides chapter/spoiler boundaries, media treatment hints, importance, certainty, and story/entity links for art-directed surfaces.

### MiniSearch

`src/lib/search/createArchiveSearchIndex.js` provides a cross-entity search adapter without replacing current search logic. It can power future Spotlight-style experimental surfaces in isolation first.

### Graphology

`src/lib/graph/createSuccessionRelationshipGraph.js` converts the existing relationship records into a real graph model for neighborhoods, pathfinding, discovery, and eventual non-SVG visualizations. Graphology is the data engine, not a visual requirement.

## Art-direction primitives

`src/components/succession/art-direction/` introduces a composition grammar rather than a component-library aesthetic:

- `ArtCanvas`
- `MonumentTitle`
- `DisplayTitle`
- `MetaRail`
- `BleedMedia`
- `Annotation`
- `StoryBeat`
- `Reveal`

The primitives are intentionally low-level. They are allowed to overlap, bleed, crop, and participate in continuous compositions.

## Non-negotiable presentation rules

New flagship Succession surfaces should not default to:

- dashboard card grids;
- equal-height section slabs;
- SVG-led visual language;
- ornamental HUD graphics;
- repeated image + paragraph + button modules;
- animation whose only purpose is decoration.

They should instead prioritize:

- one continuous visual composition;
- manga/media as structural mass;
- strong macro/micro typography contrast;
- asymmetry built on a disciplined hidden grid;
- deliberate negative space;
- temporal and spoiler-aware presentation;
- progressive disclosure;
- motion that communicates state, causality, movement, or narrative change;
- relationships that are navigable as data even when they are not rendered as a network diagram.

## Integration rule

Prototype in Storybook or `/__design-lab` first. Promote a primitive or interaction into production only after it proves useful there and survives accessibility, reduced-motion, performance, and visual QA.
