# Chimera Ant retransform — progress ledger

Branch: `chimera-ant-retransform`

## Status

| Batch | State | Evidence |
|---:|---|---|
| 1 | Complete | Established the desktop design contract, palette, seven episode phases, section order, and eleven-batch plan. |
| 2 | Complete | Added the dedicated page shell, 92vw desktop canvas, sticky reading rail, route wiring, and scroll progress. |
| 3 | Complete | Rebuilt the cinematic hero, Arc at a Glance spread, and proportional seven-phase episode rail. |
| 4 | Complete | Added reusable phase spreads, image/source hooks, state ledgers, episode groups, and composition contracts. |
| 5 | Complete | Finished Phase I’s NGL route/threat system and Phase II’s three-front development matrix. |
| 6 | Complete | Finished Phase III’s dispersal/occupation map and Phase IV’s Gungi/preparation/blueprint system. |
| 7 | Complete | Finished Phase V’s palace schematic, relative clock, seven event lanes, and disruption ledger. |
| 8 | Complete | Finished Phase VI’s mirrored endgames and Phase VII’s poison, memory, final Gungi, survivor routes, and Election transition. |
| 9 | Complete | Replaced six generic supporting sections with Chimera Ant-specific character, faction, location, Nen, conflict, and object archive systems. |
| 10 | Next | Build ending/aftermath, manga-versus-anime, records, and source systems. |
| 11 | Pending | Final verification, performance, browser QA, and bugs. |

## Completed batch summary

### Batch 1 — Design contract

- Set the desktop-only working canvas to approximately 92vw with a 1760px preferred maximum.
- Defined the arc palette, seven contiguous episode phases, final section order, and eleven-batch plan.
- Removed standalone Themes and Character Transformations sections.

### Batch 2 — Dedicated shell

- Added the route-specific `ChimeraAntPage`, sticky left reading rail, active-section tracking, active-phase tracking, and page progress.
- Added no mobile-specific layout.

### Batch 3 — Hero and orientation

- Added the cinematic hero, field classification, Arc at a Glance spread, and seven-segment rail weighted by episode count.

### Batch 4 — Shared phase architecture

- Added seven stable phase spreads, twenty episode-group records, state ledgers, image/source hooks, and composition contracts.

### Batch 5 — Phases I and II

- Added the six-stop NGL expedition route, threat ladder, visual field, three-front development matrix, and East Gorteau convergence.

### Batch 6 — Phases III and IV

- Added the colony-dispersal map, East Gorteau occupation stack, dual Gungi/preparation tracks, palace blueprint, and Episode 110 readiness field.

### Batch 7 — Palace invasion

- Added the Royal Palace schematic, six entry/separation vectors, relative invasion clock, seven simultaneous lanes, and plan-versus-actual disruption ledger.

### Batch 8 — Endgames and aftermath phases

- Added mirrored Netero/Meruem and Gon/Pitou endgame dossiers, six comparison axes, poison/memory progression, final Gungi motif, survivor routes, and the Election transition.

## Batch 9 record

### Completed

- Added `src/data/chimeraAntSupportingArchive.js` with six frozen archive collections and forty supporting records.
- Added eight character dossiers linking phase coverage, episode range, allegiance, objective, tactical function, outcome, local portrait evidence where available, and Hunterpedia sources.
- Added five faction records for the Extermination Team, royal core, dispersed colony, human-aligned Ants, and occupied East Gorteau state machinery.
- Added a six-stop geographic escalation route from the Kakin coast through NGL, East Gorteau, the Royal Palace, the weapons test site, and the final Peijin/Gungi route.
- Added an eight-row tactical Nen matrix separating user, phase, battlefield function, constraint, and consequence.
- Added seven conflict and operation rows using a shared objective → disruption → cost → outcome sequence.
- Added a six-record object and evidence cabinet that keeps interpretive reading attached to operational evidence rather than restoring a standalone Themes section.
- Added `src/components/ChimeraAntSupportingArchivePortals.jsx` and `src/components/ChimeraAntSupportingArchive.css`.
- Preserved the six stable section ids and reading-rail destinations while replacing the rendered generic section bodies through React portals.
- Hid the six legacy generic wrappers only inside their matching Chimera Ant sections; the generic arc data remains untouched for every other story page.
- Added `scripts/audit-chimera-ant-batch-9.mjs` and registered `npm run audit:chimera-ant-batch-9`.

### Verification

- Collection counts are fixed at 8 characters, 5 factions, 6 locations, 8 Nen records, 7 conflicts, and 6 objects.
- Every record has a deterministic unique id and a Hunterpedia/Fandom source boundary.
- Seven character records use repository-local `/media/portraits/` assets; Morel uses a numbered dossier token instead of an invented or misleading image.
- The location route is explicitly ordered `01` through `06`; the object cabinet is explicitly ordered `01` through `06`.
- The Nen matrix uses table semantics and the conflict ledger exposes four synchronized operational columns.
- The integration imports and renders the supporting archive portal system once from `ChimeraAntPhaseArchive.jsx` while targeting the existing `chimera-characters`, `chimera-factions`, `chimera-locations`, `chimera-nen`, `chimera-conflicts`, and `chimera-objects` section shells.
- The Batch 9 stylesheet uses fixed desktop grids for the two-column character board, twelve-column faction field, six-stop location route, four-column Nen and conflict matrices, and three-column object cabinet.
- Its only media query respects reduced-motion preferences; no mobile-width breakpoint was introduced.
- GitHub reports six forward implementation commits from the Batch 8 ledger, six changed files, and no branch divergence.
- GitHub exposes no CI status for the pre-ledger implementation head. The connector cannot execute the new npm audit, Vite build, or browser rendering, so compile success and visual QA remain unconfirmed rather than being claimed as passed.

### Risks carried into Batch 10

- The React portal integration preserves stable page shells without rewriting the large route component, but it requires browser verification that all six targets mount after commit and that hidden legacy wrappers leave no spacing residue.
- The character board, Nen matrix, six-column route, and four-stage conflict rows are intentionally dense and require overflow, typography, and crop inspection during Batch 11.
- Several supporting records use character or episode pages as evidence where no dedicated object/location page is guaranteed; Batch 10’s source directory must make those boundaries explicit.
- Episode stills remain out of scope for this batch; local portraits and explanatory systems carry the presentation.
- The Batch 9 audit exists in the repository but has not been executed by CI or a connected runtime.

### Next action

Build Batch 10: replace the generic ending, manga-versus-anime, record-summary, and source-list sections with Chimera Ant-specific systems covering the final causal chain, survivor outcomes, chapter/episode correspondence, adaptation choices, source provenance, and archive boundaries.
