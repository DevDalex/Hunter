# Chimera Ant retransform — progress ledger

Branch: `chimera-ant-retransform`

## Status

| Batch | State | Evidence |
|---:|---|---|
| 1 | Complete | Added `src/data/chimeraAntExperience.js` and `docs/CHIMERA-ANT-RETRANSFORM.md`. |
| 2 | Complete | Added the dedicated `ChimeraAntPage`, wide desktop canvas, sticky reading rail, route wiring, and section/phase progress behavior. |
| 3 | Next | Hero, Arc at a Glance overview, and proportional episode-phase rail. |
| 4 | Pending | Shared phase architecture. |
| 5 | Pending | Phases I and II. |
| 6 | Pending | Phases III and IV. |
| 7 | Pending | Phase V palace-invasion system. |
| 8 | Pending | Phases VI and VII. |
| 9 | Pending | Characters, factions, locations, Nen, conflicts, and objects. |
| 10 | Pending | Ending, adaptation, records, and sources. |
| 11 | Pending | Final verification, performance, and bugs. |

## Batch 1 record

### Completed

- Established the desktop-only experience contract.
- Set the preferred maximum page width to 1760px and the working canvas to approximately 92vw.
- Established the bone, charcoal, olive, moss, rose, royal, and mist palette.
- Defined the seven anime episode phases covering Episodes 76–136.
- Assigned each phase a distinct visual composition.
- Removed standalone Themes and Character Transformations from the final section order.
- Defined image, density, card, motion, and completion rules.
- Documented all eleven implementation batches.

### Verification

- The new module is standalone and does not alter the live route yet.
- Every exported object and array is immutable through `Object.freeze`.
- Episode phase ranges are contiguous: 76–85, 86–95, 96–102, 103–110, 111–121, 122–131, and 132–136.
- The section order includes the approved supporting and reference sections without the removed standalone sections.

### Risks carried into Batch 2

- The generic `ArcPage` still renders the current Chimera Ant page.
- The existing horizontal section bar and 1380px canvas remain unchanged until the dedicated shell is wired.
- No build has been run through the connector environment; repository CI will be used once implementation changes reach a runnable state.

## Batch 2 record

### Completed

- Added `src/components/ChimeraAntPage.jsx` as a route-specific page instead of rendering Chimera Ant through the generic `ArcPage`.
- Added `src/components/ChimeraAntPage.css` with a desktop-only minimum width of 1180px, a `92vw` working canvas, and a maximum width of 1760px.
- Replaced the crowded horizontal local navigation with a sticky left reading rail covering all fifteen approved sections.
- Added a vertical page-progress indicator driven by scroll position.
- Added active-section tracking through `IntersectionObserver` and `aria-current` state in the reading rail.
- Added seven-phase tracking with the current phase title and episode range shown in the rail.
- Preserved all approved archive destinations while excluding the removed standalone Themes and Character Transformations sections.
- Wired `SeriesWorkspace` to lazy-load the dedicated Chimera Ant page before the generic story-arc fallback.

### Verification

- `SeriesWorkspace.jsx` now imports `ChimeraAntPage` lazily and handles `routeTarget === 'chimera-ant'` before `storyArcIds` falls back to `ArcPage`.
- `ChimeraAntPage.jsx` consumes `chimeraAntSectionOrder`, `chimeraAntPhases`, and the approved palette from the Batch 1 contract.
- Every reading-rail destination maps to a rendered `data-section-id` section with a matching deterministic DOM id.
- Every episode phase maps to a rendered `data-phase-id` record, enabling active-phase observation and direct phase selection.
- The shell stylesheet contains no mobile layout breakpoint; its only media query respects reduced-motion preferences.
- GitHub reported no workflow runs for the route-wiring commit, so browser rendering and the complete Vite build remain unverified in the connector environment.

### Risks carried into Batch 3

- The current hero is a structurally sound shell treatment, not the final cinematic composition.
- The overview is still a transitional information spread and does not yet include the complete Arc at a Glance system.
- The seven-phase list is functional but not yet the proportional episode rail approved for Batch 3.
- Existing generic story data still supplies the supporting section copy until the later content-specific batches replace it.

### Next action

Recompose the hero, build the Arc at a Glance overview, and replace the temporary phase ledger entry point with a proportional seven-phase episode rail while preserving the Batch 2 shell and reading rail.
