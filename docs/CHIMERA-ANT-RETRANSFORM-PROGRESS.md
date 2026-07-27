# Chimera Ant retransform — progress ledger

Branch: `chimera-ant-retransform`

## Status

| Batch | State | Evidence |
|---:|---|---|
| 1 | Complete | Added `src/data/chimeraAntExperience.js` and `docs/CHIMERA-ANT-RETRANSFORM.md`. |
| 2 | Next | Dedicated page shell, wide canvas, reading rail, and navigation replacement. |
| 3 | Pending | Hero, overview, and proportional episode-phase rail. |
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

### Next action

Create a dedicated `ChimeraAntPage` route component and desktop shell, then wire `SeriesWorkspace` to render it for `routeTarget === 'chimera-ant'` before the generic arc-page fallback.
