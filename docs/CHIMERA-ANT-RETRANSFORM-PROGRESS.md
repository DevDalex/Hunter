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
| 7 | Next | Build the Phase V palace-invasion plan, entry vectors, clock, and simultaneous event lanes. |
| 8 | Pending | Phases VI and VII. |
| 9 | Pending | Characters, factions, locations, Nen, conflicts, and objects. |
| 10 | Pending | Ending, adaptation, records, and sources. |
| 11 | Pending | Final verification, performance, and bugs. |

## Completed batch summary

### Batch 1 — Design contract

- Set the desktop-only working canvas to approximately 92vw with a 1760px preferred maximum.
- Defined the bone, charcoal, olive, moss, rose, royal, and mist visual language.
- Defined contiguous episode phases: 76–85, 86–95, 96–102, 103–110, 111–121, 122–131, and 132–136.
- Removed standalone Themes and Character Transformations sections.

### Batch 2 — Dedicated shell

- Added `src/components/ChimeraAntPage.jsx` and the dedicated route before the generic arc fallback.
- Replaced the crowded horizontal navigation with a sticky left reading rail.
- Added active-section, active-phase, and page-progress tracking.
- Added no mobile-specific layout.

### Batch 3 — Hero and orientation

- Added the cinematic hero with arc navigation, field classification, factual strip, and two entry actions.
- Added an Arc at a Glance orientation spread.
- Added a seven-segment rail weighted by the inclusive phase episode counts: 10, 10, 7, 8, 11, 10, and 5.

### Batch 4 — Shared phase architecture

- Added seven stable phase spreads and twenty episode-group records covering Episodes 76–136.
- Added opening, turning, and closing state ledgers.
- Added phase artwork, crop, caption, credit, and source hooks.
- Added composition contracts for route, three-front, dispersal, preparation, invasion, endgames, and aftermath systems.

### Batch 5 — Phases I and II

- Added a six-stop NGL expedition route and five-level threat escalation visual.
- Added episode evidence links and a Kite/Gon/Killua/Pitou visual field.
- Added a three-front matrix aligning the boys, the colony, and the Hunter Association across Episodes 86–95.
- Added the convergence into the East Gorteau operation.

## Batch 6 record

### Completed

- Added `src/data/chimeraAntMiddlePhaseSystems.js` with finished Phase III and Phase IV information architecture.
- Added `src/components/ChimeraAntMiddlePhaseSystems.jsx` and its dedicated wide-screen stylesheet.
- Built a four-branch colony-dispersal map from the former Queen’s nest toward Meteor City, East Gorteau, human-aligned defectors, and Komugi’s palace entry.
- Added a central origin record, scalable SVG connection lines, episode ranges, outcomes, and Hunterpedia evidence links for every branch.
- Added an East Gorteau occupation stack showing government shell, puppet control, population movement, and Selection.
- Added verified local visual records for Meruem, Komugi, and Neferpitou.
- Built Phase IV as two parallel four-step tracks: Komugi’s Gungi progression and the extermination team’s military preparation.
- Added a plan-versus-known-reality palace blueprint covering Meruem, Pitou, Pouf, and Youpi assignments.
- Added the Episode 110 launch-readiness field for portals, inside intelligence, Guard positions, and the Selection deadline.
- Replaced Phase III and IV’s generic artwork hooks with local Meruem and Komugi visual records and Hunterpedia credit links.
- Marked Phases I–IV as finished while preserving the shared phase shell, state ledger, episode groups, navigation, and stable ids.

### Verification

- Phase III evidence ranges cover Episodes 96–97, 98–100, and 101–102, matching the phase’s 96–102 boundary.
- Phase IV uses two aligned progress tracks covering 103, 104–105, 106–108, and 109–110 on the Gungi side, and 103–105, 106–107, 108–109, and 110 on the operation side.
- The Phase IV blueprint contains one row for each intended Royal target: Meruem, Neferpitou, Shaiapouf, and Menthuthuyoupi.
- `ChimeraAntPhaseArchive.jsx` renders the middle-phase systems inside the existing Phase III and IV ids and marks all four completed phases with `data-phase-finish="complete"`.
- The Batch 6 comparison is six commits ahead of the Batch 5 ledger with five changed files and no branch divergence.
- The new stylesheet contains no mobile layout breakpoint; its only media query respects reduced-motion preferences.
- GitHub exposes no CI status for the final implementation commit, so Vite compilation and screenshot-level browser verification remain outstanding.

### Risks carried into Batch 7

- The Phase III map deliberately uses a dense 780px desktop field and needs browser-level collision and crop verification during Batch 11.
- Phase IV’s blueprint records assumptions already under pressure by Episode 110; the full consequences belong to the Phase V clock rather than this preparation section.
- Episode stills have not been added; verified repository-local portraits and source hooks are used instead.
- Supporting archive sections remain generic until Batches 9 and 10.

### Next action

Build Phase V as the page’s most technically ambitious system: a Royal Palace plan, Dragon Dive and portal entry vectors, a visible invasion clock, parallel lanes for Gon/Pitou, Killua, Knuckle/Shoot/Youpi, Morel/Pouf, Ikalgo/Welfin, Netero/Meruem, and Komugi, plus clear plan-versus-actual disruption states.
