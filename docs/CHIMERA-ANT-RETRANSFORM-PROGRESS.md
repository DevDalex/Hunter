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
| 8 | Next | Build Phase VI’s mirrored endgames and Phase VII’s poison, memory, final Gungi, and survivor-route systems. |
| 9 | Pending | Characters, factions, locations, Nen, conflicts, and objects. |
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

## Batch 7 record

### Completed

- Added `src/data/chimeraAntPalaceInvasionSystem.js` with the complete Phase V information model.
- Added `src/components/ChimeraAntPalaceInvasionSystem.jsx` and dedicated desktop presentation styles.
- Built a schematic Royal Palace field with seven operational zones: airspace, Royal chamber, central stair, Pouf front, Pitou/Komugi front, underground route, and Meruem extraction vector.
- Added six sourced entry and separation vectors for Dragon Dive, Netero/Zeno contact, Knov portal entry, Guard separation, Pitou diversion, and Ikalgo’s underground route.
- Added a six-stage relative invasion clock. Only launch is fixed at `00:00`; later labels remain relative to avoid inventing unsupported second-by-second precision.
- Added seven simultaneous event lanes for Gon/Pitou, Killua, Knuckle/Shoot/Youpi, Morel/Pouf, Ikalgo/Welfin, Netero/Meruem, and Komugi.
- Aligned every lane across four shared periods: Impact, Rupture, Separation, and Divergence.
- Added a plan-versus-actual disruption ledger covering Meruem separation, Pitou containment, Youpi attrition, Pouf containment, and synchronization failure.
- Added verified local visual records for Netero, Meruem, Gon, Neferpitou, and Komugi.
- Replaced the Phase V generic image hook with a local Isaac Netero visual record and Hunterpedia source.
- Marked Phase V as finished while preserving the shared phase id, state ledger, episode groups, and next-phase navigation.

### Verification

- Phase V remains bounded to Episodes 111–121 through the existing three contiguous groups: 111–113, 114–117, and 118–121.
- The relative clock contains six ordered records with Hunterpedia episode evidence and does not claim precise timestamps beyond launch.
- The lane matrix contains seven rows and four event cells per row, producing twenty-eight synchronized state records.
- The palace schematic contains seven zones and six directional vectors with deterministic ids and source links.
- The Phase V integration uses the existing `chimera-phase-palace-invasion` id and `data-phase-section="true"` marker.
- Portraits appear only on lanes with semantically matching local records; other lanes use numbered dossier tokens rather than misleading character images.
- The Batch 7 comparison is seven commits ahead of the Batch 6 ledger, with six changed files and no branch divergence.
- No mobile layout breakpoint was added; the only media query respects reduced-motion preferences.
- GitHub exposes no CI status for the final implementation commit, so Vite compilation and screenshot-level browser verification remain outstanding.

### Risks carried into Batch 8

- The palace schematic’s seven absolute-positioned zones and six-column evidence key require browser-level collision testing during Batch 11.
- The relative clock deliberately prioritizes accuracy over false timestamp precision; exact narrator timestamps can be added later only when individually verified.
- Phase VI and Phase VII still use scaffold-level composition hooks.
- Supporting archive sections remain generic until Batches 9 and 10.

### Next action

Build Phase VI and Phase VII: create a mirrored Netero/Meruem versus Gon/Pitou endgame system with cost, weapon, decision, and aftermath comparisons; then create the poison-and-memory progression, final Gungi presentation, and survivor-destination map for Episodes 132–136.
