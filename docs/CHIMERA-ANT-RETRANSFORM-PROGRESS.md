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
| 9 | Next | Replace the generic characters, factions, locations, Nen, conflicts, and objects sections with Chimera Ant-specific archive systems. |
| 10 | Pending | Ending, adaptation, records, and sources. |
| 11 | Pending | Final verification, performance, and bugs. |

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

## Batch 8 record

### Completed

- Added `src/data/chimeraAntEndgameSystems.js` with the complete Phase VI and Phase VII information models.
- Added `src/components/ChimeraAntEndgameSystems.jsx` and a dedicated desktop-only stylesheet.
- Built two complete Phase VI endgame dossiers: Netero/Meruem for Episodes 122–126 and Gon/Pitou for Episodes 127–131.
- Added four sourced sequence records to each endgame, covering terms, pattern, exhaustion, Rose detonation, coercive escort, Kite’s truth, Gon’s vow, and the postmortem aftermath.
- Added six explicit comparison axes: starting demand, power system, decision point, accepted price, immediate result, and story carried forward.
- Added a “mirror without equivalence” interpretation block so the layout compares shared self-destruction without flattening institutional extermination and personal revenge into the same act.
- Built the Phase VII poison-and-memory progression across Episodes 132, 133, 134, and 135.
- Added an abstract 9×9 Gungi visual motif with an explicit provenance boundary stating that it is not a reconstructed canonical board position.
- Added the final Gungi sequence through disclosure, consent, recognition, and death.
- Added four aftermath routes: Meruem/Komugi, Reina/Bloster, Welfin/Hina/Bizeff, and Gon/the Hunter Association.
- Added the Election transition connecting Netero’s death, Gon’s condition, institutional succession, and Killua’s rescue objective.
- Replaced the Phase VI and VII generic image hooks with local Gon and Komugi portrait records and Hunterpedia source links.
- Integrated both systems into the existing stable phase archive and marked all seven episode phases complete.
- Added `scripts/audit-chimera-ant-batch-8.mjs` and registered `npm run audit:chimera-ant-batch-8` in `package.json`.

### Verification

- Phase VI remains bounded to the two existing contiguous groups: 122–126 and 127–131.
- The Phase VI model contains exactly two endgames, two portraits per endgame, six dossier fields per endgame, four sequence records per endgame, and six comparison rows.
- Phase VII contains four ordered poison/memory records for Episodes 132–135, four final Gungi beats, and four survivor routes carrying the ending into Episode 136.
- Every episode and portrait source in the Batch 8 data points to Hunterpedia/Fandom, while all displayed portraits use repository-local `/media/portraits/` assets.
- `ChimeraAntPhaseArchive.jsx` imports and renders the Batch 8 component inside the existing Phase VI and VII ids and now marks all seven phase ids complete.
- The Gungi field renders eighty-one deterministic cells and is labeled as an abstract motif rather than canonical evidence.
- The Batch 8 stylesheet uses fixed desktop grids for the mirrored two-column field, four-stage progression, and four-route aftermath field. Its only media query is the reduced-motion preference; no mobile width breakpoint was introduced.
- The dedicated static audit checks system ids, episode boundaries, record counts, source boundaries, local media paths, integration hooks, Gungi provenance, desktop grid contracts, and the absence of mobile-specific width media queries.
- From the initial Batch 8 data commit to the pre-ledger branch head, GitHub reports seven additional forward commits, six further changed files, and no branch divergence. Including the initial data commit, Batch 8 was implemented through eight pre-ledger commits across seven implementation files.
- GitHub exposes no CI status for the pre-ledger implementation head. The connector cannot execute the new npm audit, Vite build, or browser rendering, so runtime compilation and screenshot-level verification remain unconfirmed rather than being claimed as passed.

### Risks carried into Batch 9

- The two full endgame dossiers, six-row comparison table, and four-column survivor route field are intentionally dense and require browser-level overflow and spacing inspection during Batch 11.
- The 9×9 Gungi field is a visual motif only; it must never be presented as a canonical game-state reconstruction.
- Episode stills are not yet used. The finished presentation relies on verified local portraits, explanatory diagrams, and source links.
- The Batch 8 audit exists in the repository but has not been executed by CI or a connected runtime.
- Supporting archive sections still use generic records and are the next required replacement.

### Next action

Build Batch 9: replace the generic character ledger, faction cards, location records, Nen list, conflict list, and object cards with Chimera Ant-specific wide archive systems that connect each record to phase, objective, allegiance, tactical function, outcome, and source evidence.
