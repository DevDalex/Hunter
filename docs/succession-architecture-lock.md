# Succession Contest architecture portal — structure lock and visual revision

## Current status

- Document: `SC–IA–01`
- Structural architecture: `Approved · Version 1.0`
- Visual layer: `Revision 1.1 · Review`
- Reading boundary: dynamic from the authorized Succession chapter limit
- Portal role: stable architecture and navigation entry point for Phases 3A–3E

The information architecture, routes, viewport-fill behavior, keyboard model, and destination contracts remain locked. The visual layer was reopened because the approved portal still read as a binary black-and-white wireframe rather than the intended layered monochrome editorial archive.

## Visual revision 1.1

This revision completes the previously unfinished architecture-page work:

- soft-gray browser canvas and near-white document sheet
- distinct primary, secondary, and inset surfaces
- three rule weights for modules, destinations, and supporting metadata
- stronger editorial hierarchy across the four numbered modules
- canonical manga Black Whale cross-section in every ship-image position
- canonical Tier 1 quarters map in every location/map position
- unified grayscale, contrast, framing, caption, and fallback treatment
- stronger but still monochrome icon, Nen diagram, beast-grid, seal, and marker treatment
- refined Preserved Contracts, Legend, Notes, and Reference Grid presentation
- miniature shared-shell preview upgraded from raw annotation diagram to finished interface preview
- visible visual-revision metadata while preserving the approved structural record

The original SVG ship and map drawings remain beneath the sourced images at low opacity as a resilient fallback if an asset cannot load.

## Source and provenance

The portal reuses canonical assets already maintained by the Black Whale workspace:

- `/black-whale-cutaway.png` — manga Black Whale 1 cross-section
- `/media/rooms/tier-1-quarters.png` — manga Tier 1 quarters plan

Their original Hunterpedia provenance remains documented in `src/data/blackWhale.js`. The architecture portal does not establish a second independent media catalogue.

## Locked architecture contract

The portal continues to preserve:

- complete viewport fill with no page scrollbar
- seven top-level destinations
- four numbered workspace modules
- Library Tools
- Preserved Contracts
- specification legend and miniature shared-shell preview
- complete-card navigation and route feedback
- canonical routes, aliases, stable IDs, Reader separation, and chapter boundary
- keyboard, contrast, zoom, resize, forced-colors, reduced-motion, and regression gates
- browser-captured 1440×1000 and 1920×1080 visual baselines

## Deliberately excluded

Tablet/mobile architecture-page recomposition is intentionally **not part of this lock pass**. It remains outside Visual Revision 1.1. No new phone stack, layered mobile architecture, or alternate tablet composition is introduced.

## Approval sequence

The structural record remains approved. The visual layer stays marked `Revision 1.1 · Review` until the deployed page is inspected. Final visual approval requires refreshed browser baselines and the complete build, visual, accessibility, keyboard, and performance suites on one exact commit.

Phase 3 work changes the destination workspaces rather than the architecture portal. Any later portal revision requires an explicit architecture-contract change, version update, and renewed browser baselines.
