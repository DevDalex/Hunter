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
| 11 | Complete | Static audits, Vite production build, Chromium interaction checks, text-size and contrast checks, performance budgets, segmented section evidence, and desktop QA passed at 1366, 1600, 1920, and 2560 pixels. |

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

### Batch 10 — Ending and reference systems

- Added the five-step ending causal chain, outcome ledger, manga/anime correspondence, adaptation comparison, record boundaries, source groups, and evidence classes.

## Batch 11 record

### Completed

- Fixed the Batch 10 records-directory control so it uses the route callback when supplied and a deterministic clean-route fallback otherwise.
- Added `scripts/audit-chimera-ant-final.mjs`, `scripts/chimera-ant-final-qa.mjs`, and the `Chimera Ant Final QA` GitHub Actions workflow.
- Opened draft pull request #57 solely to expose pull-request-triggered execution evidence without merging or claiming deployment.
- Corrected the browser harness to open the application’s clean `/story/chimera-ant` route.
- Added `src/components/ChimeraAntBatch11.css` as a desktop-only containment and readability layer imported after the earlier phase styles.
- Rebalanced the Phase III dispersal field and legend after the 1366px run exposed a right-edge collision.
- Made the Phase V lane matrix fluid after the 1600px run exposed a fixed-width overflow.
- Made the six-stage invasion clock fluid after the next 1366px run exposed its remaining horizontal overflow.
- Added a 12px minimum for labels, metadata, captions, links, and compact record copy found below the readability floor.
- Added surface-aware olive, royal, rose, and moss tokens for light and charcoal surfaces.
- Added explicit opaque fallbacks beneath gradient-only Phase II headers so contrast remains deterministic.
- Corrected the Arc at a Glance label, phase-rail eyebrow, and the two dark-phase footer labels that failed the contrast audit.
- Added segmented 1600px screenshots for all fifteen sections and all seven phase systems in addition to viewport captures at every target width.
- Added no viewport-width media query and no mobile-specific interaction or layout.

### Verification evidence

- The final successful visual-fix commit is `935ede1999ee1711899f01ef1e5e81d8b34a5ccd` on `chimera-ant-retransform`.
- Pull request #57 produced successful `Chimera Ant Final QA` run `30301579522` against GitHub’s merge-test commit `765a54c4b96a22fc59a7b1fa69e70903b7d6a1df`.
- `npm run verify:chimera-ant` passed, covering the Batch 8, Batch 9, Batch 10, and final Batch 11 structural audits.
- `npx vite build` passed before browser execution.
- Chromium installation and the four-width browser suite passed.
- All fifteen page sections, seven episode phases, six supporting portals, four reference portals, seven phase controls, eight character dossiers, five faction records, six location stops, eight Nen rows, seven conflict rows, six object records, five ending-chain records, and seven adaptation rows mounted with their expected counts.
- Phase selection and reading-rail navigation passed.
- Hidden legacy bodies remained hidden; no duplicate ids, broken images, runtime errors, console errors, horizontal viewport overflows, text below 12px, or low-contrast audited microcopy were reported.
- DOM and transfer budgets passed at every viewport with 4,742 DOM nodes, 27 loaded resources, and 2,663,757 transferred bytes.
- Viewport results:
  - 1366px: passed; page height 59,301px; screenshot `.chimera-ant-qa/chimera-ant-1366-viewport.png`.
  - 1600px: passed; page height 53,772px; viewport screenshot plus fifteen section captures and seven phase captures.
  - 1920px: passed; page height 51,107px; screenshot `.chimera-ant-qa/chimera-ant-1920-viewport.png`.
  - 2560px: passed; page height 51,597px; screenshot `.chimera-ant-qa/chimera-ant-2560-viewport.png`.
- The final report contained an empty `failures` collection.

### Remaining non-blocking risks

- The page is intentionally very long and information-dense. Future content additions should rerun the same four-width suite because text growth can reintroduce clipping, overflow, or contrast regressions.
- Automated checks verify size, contrast, containment, interaction, media loading, and budgets. Screenshot evidence still benefits from optional human art-direction review for subjective composition and image choice.
- Pull request #57 remains draft and unmerged; this ledger does not by itself claim release through the repository’s normal merge process.
- No mobile layout was added or evaluated because the redesign contract is desktop-only.

### Next action

Review the segmented section and phase screenshots, then merge pull request #57 through the repository’s normal process when satisfied. No redesign batch remains.
