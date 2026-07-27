# Chimera Ant retransform — progress ledger

Branch: `chimera-ant-retransform`

## Status

| Batch | State | Evidence |
|---:|---|---|
| 1 | Complete | Added `src/data/chimeraAntExperience.js` and `docs/CHIMERA-ANT-RETRANSFORM.md`. |
| 2 | Complete | Added the dedicated `ChimeraAntPage`, wide desktop canvas, sticky reading rail, route wiring, and section/phase progress behavior. |
| 3 | Complete | Rebuilt the cinematic hero, Arc at a Glance orientation spread, and proportional seven-phase episode rail. |
| 4 | Complete | Added reusable image-led phase spreads, state ledgers, episode-group records, source hooks, and seven composition contracts. |
| 5 | Next | Build the finished Phase I expedition route and Phase II three-front development system. |
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

## Batch 3 record

### Completed

- Replaced the temporary shell hero with a full cinematic composition using the existing arc artwork, layered veil, subtle dossier grid, large editorial title, route controls, field classification, and a five-column factual strip.
- Added explicit inclusive counts for the manga and anime ranges so the hero shows 133 chapters and 61 episodes without hardcoding the totals.
- Added a complete Arc at a Glance spread with the central conflict, a three-step Discover → Contain → Survive escalation path, and six dense orientation records.
- Replaced the temporary vertical phase ledger with a proportional seven-segment episode rail. Segment widths are derived from each phase’s inclusive episode count: 10, 10, 7, 8, 11, 10, and 5.
- Added interactive selected-phase detail showing its episode range, share of the arc, opening condition, turning point, and closing condition.
- Preserved the Batch 2 reading rail while decoupling phase scroll observation until Batch 4 supplies real phase-section markers.
- Added `src/components/ChimeraAntBatch3.css` as a focused visual layer so the Batch 2 shell remains stable and later batches can extend the page without rewriting the base stylesheet.

### Verification

- `ChimeraAntPage.jsx` imports the Batch 3 stylesheet after the base shell stylesheet, allowing the new hero and overview rules to override only their intended systems.
- The proportional rail uses `flex: var(--phase-weight)` where each weight is calculated from the phase episode range rather than manually assigned percentages.
- The phase totals add to 61 episodes, matching Episodes 76–136 inclusively.
- Every rail segment remains keyboard-operable, exposes `aria-pressed`, and updates an `aria-live` detail region.
- Hero navigation preserves the Greed Island, all-arcs, and Election destinations.
- No mobile breakpoint was added; the only new media query disables transition motion when reduced motion is requested.
- The connector still provides no browser runtime or Vite build execution, so screenshot-level layout verification and compile verification remain outstanding.

### Risks carried into Batch 4

- The phase rail currently changes the orientation detail only; it cannot yet jump to full phase spreads because those spreads do not exist.
- The timeline beneath the rail is still the temporary generic seven-column record and will be replaced by the shared phase architecture.
- The Arc at a Glance copy is now Chimera Ant-specific, while the remaining supporting sections still use generic arc data until their assigned batches.
- The hero uses the repository’s current single arc artwork; later visual batches may add additional image crops or phase-specific art after provenance review.

## Batch 4 record

### Completed

- Added `src/data/chimeraAntPhaseScaffold.js` with all seven phase records and twenty episode-group records covering Episodes 76–136.
- Added `src/components/ChimeraAntPhaseArchive.jsx` as the reusable phase-spread system.
- Replaced the temporary seven-column timeline with seven full phase sections that expose stable DOM ids and `data-phase-section` markers.
- Added reusable phase headers containing phase number, episode range, episode count, tone, location, participants, and composition contract.
- Added image-led editorial figures with configurable image, crop position, caption, credit label, and optional external source link.
- Added opening, turning, and closing state ledgers to every phase.
- Added episode-group records with exact subranges, signal labels, titles, and summaries.
- Added next-phase controls and connected the proportional phase rail to the full phase spreads.
- Added `src/components/ChimeraAntPhaseArchive.css` with separate composition hooks for expedition route, three-front development, dispersal map, plan versus reality, parallel invasion clock, mirrored endgames, and quiet aftermath.

### Verification

- Every phase id in `chimeraAntPhases` has a matching scaffold entry and rendered spread id in the form `chimera-phase-{phaseId}`.
- The episode-group subranges cover each phase without gaps: 76–85, 86–95, 96–102, 103–110, 111–121, 122–131, and 132–136.
- The page’s existing `IntersectionObserver` now observes seven real `[data-phase-section="true"]` elements instead of temporary phase controls.
- Phase-rail selection updates active state and scrolls to the matching spread while respecting reduced-motion preferences.
- Each figure exposes caption and source-credit hooks; verified phase-specific images can be inserted later without changing the component structure.
- Each spread receives the composition class declared in the Batch 1 phase contract.
- No mobile layout breakpoint was added to the new stylesheet.
- GitHub exposes no CI status for the implementation commit, and the connector cannot execute the Vite build, so compile and screenshot verification remain outstanding.

### Risks carried into Batch 5

- All seven spreads currently reuse the configured arc artwork with different crop positions; phase-specific image selection and provenance remain for the visual content batches.
- Phase I and II now have complete structural scaffolds, but their expedition route and three-front visual systems are only composition hooks rather than finished diagrams.
- Phase III through VII content is intentionally scaffold-level until their assigned batches.
- Supporting archive sections continue to use the generic arc records until Batch 9 and Batch 10.

### Next action

Finish Phase I and Phase II: build the NGL expedition route and threat-escalation visual, then build the training / colony / Hunter Association three-front development system with phase-specific images, episode evidence, and stronger wide-screen presentation.
