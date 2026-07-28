# Reference backbone batch

Status: Batch 8 reference redesign  
unsupported narrow-width status: deferred  
Primary source policy: Hunterpedia/Fandom only

## Purpose

Batch 8 moves the site from four loose reference destinations into a connected reference backbone:

1. Nen as a technical manual.
2. World as a route-aware atlas.
3. Organizations as intelligence dossiers.
4. Fights/conflicts as tactical case files.

The batch follows the reordered plan approved after the Chimera Ant prototype: build Chimera Ant first, then use it as the stress test for Nen, World, Organizations, and Fights before the Characters batch and the final cleanup/QA batch.

## Runtime files

- `src/data/referenceBackbonePrototype.js`
- `src/components/ReferenceBackbonePanel.jsx`
- `src/components/ReferenceBackbonePanel.css`
- `src/App.jsx`
- `src/components/WorldAtlas.jsx`
- `src/components/OrganizationArchive.jsx`
- `src/components/ConflictArchive.jsx`
- `scripts/audit-reference-backbone.mjs`

## Nen scope

Nen remains the technical-manual section. The existing visual workbench is preserved rather than rewritten. Batch 8 adds a reference-backbone panel above the Nen workbench so the page now explicitly declares:

- foundations,
- operational techniques,
- contracts and special states,
- ability-record anatomy,
- Chimera Ant stress cases,
- source and uncertainty boundaries.

The page should continue to preserve the local diagram system, the existing Nen record directory, and the distinction between system concepts and named abilities.

## World scope

World becomes a route-aware atlas. Batch 8 surfaces a backbone panel inside `WorldAtlas.jsx` and keeps the existing map, outer-world scale view, story journey, hierarchy, and visual gallery.

The world panel emphasizes:

- geography,
- story route,
- control/access,
- connected evidence,
- Chimera Ant locations such as NGL, East Gorteau, the palace, Meteor City, and the Rose detonation site.

## Organization scope

Organizations become intelligence dossiers. Batch 8 surfaces a backbone panel inside `OrganizationArchive.jsx` and keeps the existing underworld/Kakin mafia interface.

The organization panel emphasizes:

- leadership,
- membership,
- territory,
- operations,
- the Hunter Association,
- the Chimera Ant colony,
- the Extermination Team,
- NGL and East Gorteau as institutional records.

## Conflict scope

Fights become tactical case files. Batch 8 surfaces a backbone panel inside `ConflictArchive.jsx` and keeps the existing conflict workbench and matrix.

The conflict panel emphasizes:

- objective,
- information state,
- tools and abilities,
- turning point,
- consequence,
- Palace Invasion as a multi-lane operation instead of a flat fight list.

## Acceptance rules

`npm run audit:reference` must confirm:

1. The canonical data contains exactly four domains: Nen, World, Organizations, and Conflicts.
2. Every domain has visible identity metadata, metrics, structural lanes, prototype records, Chimera Ant bridge items, next actions, and approved Hunterpedia/Fandom sources.
3. Nen surfaces the backbone while preserving the existing visual Nen workbench and record directory.
4. World, Organizations, and Conflicts each render the shared `ReferenceBackbonePanel` inside their route chunks.
5. The shared panel renders prototype records and source links from canonical data.
6. unsupported narrow-width remains deferred.

## Deferred work

This batch does not create full character-profile routes. That remains Batch 9.

This batch also does not complete every possible ability, location, organization, or fight. Instead, it establishes the reusable data and UI contract that later batches can fill in without turning each reference page into an unrelated one-off design.
