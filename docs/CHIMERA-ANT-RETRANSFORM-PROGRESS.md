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
| 10 | Complete | Replaced the ending, adaptation, records, and sources sections with causal, correspondence, provenance, and boundary systems. |
| 11 | Next | Execute final desktop verification, compilation, visual QA, performance checks, source audit, and bug fixes. |

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

### Batch 9 — Supporting archive systems

- Added forty character, faction, location, Nen, conflict, and object records in six Chimera Ant-specific desktop systems.

## Batch 10 record

### Completed

- Added `src/data/chimeraAntReferenceArchive.js` with four frozen collections for ending, adaptation, records, and sources.
- Built a five-step ending causal chain from Rose detonation through delayed poison, recovered memory, final Gungi, and the transfer into the Election arc.
- Added five outcome records for the royal core, Komugi, Gon, the Hunter Association, and surviving Chimera Ants.
- Added a manga-versus-anime boundary field recording Chapters 186–318 as 133 chapters and Episodes 76–136 as 61 episodes.
- Added seven phase correspondence rows connecting each editorial phase to manga and anime ranges without presenting the phase names as official production labels.
- Added four adaptation comparison records for narration, temporal duration, violence/aftermath, and the final Gungi sequence.
- Added four record totals, five archive boundary rules, and three directory-action records.
- Added four source groups separating arc boundaries, places/institutions, people, and episode evidence.
- Added four evidence classes defining primary canon, secondary reference, editorial interpretation, and image provenance.
- Added `src/components/ChimeraAntReferenceArchivePortals.jsx` and a dedicated desktop-only stylesheet.
- Preserved the stable `chimera-ending`, `chimera-adaptation`, `chimera-records`, and `chimera-sources` section shells while hiding only their legacy generic children.
- Integrated the four reference portals through `ChimeraAntPhaseArchive.jsx`.
- Added `scripts/audit-chimera-ant-batch-10.mjs` and registered `npm run audit:chimera-ant-batch-10`.

### Verification

- The ending model contains exactly five ordered causal records and five unique outcome records.
- Every ending event has both a stated cause and consequence plus a Hunterpedia episode source.
- The adaptation model contains exactly seven ordered phase rows, four medium-comparison records, and inclusive totals of 133 manga chapters and 61 anime episodes.
- The records system explicitly warns that the seven phase labels are editorial navigation rather than official production labels and closes its scope at Chapter 318 and Episode 136.
- The source directory contains four groups with at least two Hunterpedia/Fandom references each and assigns a stated evidence purpose to every group.
- The component uses table semantics for chapter/episode correspondence and explicit causal labels for the ending chain.
- The stylesheet uses fixed desktop fields: five outcome columns, four record/evidence columns, two adaptation/source columns, and no mobile-width breakpoint.
- Its only media query respects reduced-motion preferences.
- GitHub reports six forward implementation commits from the Batch 9 ledger, six changed files, and no branch divergence.
- GitHub exposes no CI status for the pre-ledger implementation head. The connector cannot execute the Batch 8–10 npm audits, Vite build, or browser rendering, so runtime compilation and visual verification remain unconfirmed rather than being claimed as passed.

### Risks carried into Batch 11

- Both reference systems use React portals and require browser confirmation that all four targets mount after the destination sections exist and that hidden legacy children leave no residual spacing.
- The records action callbacks are wired through the phase archive contract, but the current route component does not yet pass `onNavigate` into that contract; Batch 11 must either pass the callback or convert the actions to verified links.
- The five-column outcome field, adaptation table, source groups, and earlier dense systems require collision, overflow, crop, and reading-size inspection at 1366, 1600, 1920, and 2560 pixel widths.
- The chapter-to-episode phase correspondence is editorial and should be fact-checked against chapter/episode endpoints during the final content audit.
- Hunterpedia/Fandom remains a secondary reference. Exact scene wording and composition must remain attributed to the manga or anime rather than inferred from the secondary index.
- The Batch 10 audit exists in the repository but has not been executed by CI or a connected runtime.

### Next action

Execute Batch 11: obtain a runnable checkout or CI path, run the dedicated Chimera Ant audits and full Vite build, inspect the page at all four desktop target widths, fix portal mounting and navigation, correct overflow/crops/spacing, verify image and source provenance, measure performance, and only then mark the redesign fully complete and disable the automation.
