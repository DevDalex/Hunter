# Chimera Ant prototype page

Status: **Batch 7 Story redesign**  
unsupported narrow-width status: **deferred**

Batch 7 moves Chimera Ant forward now, before the later Nen / World / Organizations / Fights and Characters redesign batches. It keeps the locked architecture rule: Chimera Ant begins as one comprehensive `/story/chimera-ant` route and may earn nested pages later only if the finished page proves a subject needs an independently shareable destination.

## What this batch owns

1. `/story/chimera-ant` routes through `ChimeraAntPrototypePage`.
2. `src/data/chimeraAntPrototype.js` owns the Chimera Ant war-dossier data: overview, threat model, master chronology, Palace Invasion clock, character arcs, Ant hierarchy, human extermination team, factions, locations, conflicts, Nen systems, objects and custody trails, themes, aftermath, adaptation layer, and approved Hunterpedia source links.
3. The page uses the Black Archive hybrid shell: dark biological/military hero, warm paper sections, ochre/toxic yellow/rust/bone arc accents, and crimson only for danger or active route structure.
4. The Palace Invasion is built as an advanced module inside the page rather than a nested route. It is intentionally shaped so it can become `/story/chimera-ant/palace-invasion` later if needed.
5. The character material is arc-specific. It does not attempt to replace the future Characters redesign or full character-profile routes.
6. The Nen material is arc-specific. It does not attempt to replace the later Nen encyclopedia redesign.
7. The World, Organizations, and Fights material is intentionally represented through locations, factions, conflict records, and source links so Batch 8 can reuse those lenses.
8. `npm run audit:story` now checks Chimera Ant routing, module coverage, data counts, approved source hosts, the one-route depth rule, and deferred unsupported narrow-width scope.

## What this batch does not own

Batch 7 does not redesign the global Characters section, the global Nen encyclopedia, World atlas, Organizations archive, Fights archive, Chairman Election page, Succession Contest archive, or unsupported narrow-width layouts. It does not create nested Chimera Ant routes yet.

## Runtime files

- `src/data/chimeraAntPrototype.js`
- `src/components/ChimeraAntPrototypePage.jsx`
- `src/components/ChimeraAntPrototypePage.css`
- `src/components/SeriesWorkspace.jsx`
- `scripts/audit-story-architecture.mjs`
- `scripts/audit-performance.mjs`

## Acceptance rule

`npm run audit:story` must confirm that Chimera Ant routes through its dedicated prototype page, that it remains one expandable route rather than a prematurely split mini-site, that the page retains threat model, master chronology, Palace Invasion clock, character arcs, Ant hierarchy, human team, factions, locations, conflicts, Nen systems, objects, themes, aftermath, adaptation, and Hunterpedia source modules, and that all Chimera Ant sources pass the approved Hunterpedia/Fandom source policy.

## Future split candidates

These are deliberately **not** routes in Batch 7:

- Palace Invasion
- Meruem / Komugi
- Gon / Pitou / Kite
- Ant hierarchy
- Conflict archive
- NGL and East Gorteau war map

The strongest future candidate is Palace Invasion because the clock, lanes, knowledge gaps, and combat fronts may outgrow the single page. The most narratively deserving candidate is Meruem / Komugi. Neither is pre-authorized merely because the arc is long.
