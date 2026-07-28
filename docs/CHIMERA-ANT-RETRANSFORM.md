# Chimera Ant page — complete desktop retransform

## Product decision

The Chimera Ant page is a desktop-only illustrated narrative archive. It combines the readability of a manga companion book, the information structure of a biological and military dossier, and cinematic treatment for decisive scenes.

The page must not resemble a narrow blog article, a streaming-service landing page, a corporate annual report, or a generic card dashboard.

## Non-negotiable rules

1. unsupported narrow-width-specific design and touch-specific interaction are out of scope.
2. The working canvas uses approximately 92vw with a preferred maximum width of 1760px.
3. No major viewport may contain only a large heading and a short paragraph.
4. Images must establish place, identify people, explain sequence, or mark a turning point.
5. Cards are reserved for compact records. Narrative movement uses connected editorial spreads.
6. Episode ranges govern the phase architecture.
7. Each phase receives a distinct visual composition.
8. Standalone Themes and Character Transformations sections remain removed.
9. Interpretive analysis is placed beside the scenes, conflicts, objects, and outcomes that support it.
10. The palace invasion is represented through parallel event lanes and a visible invasion clock.
11. Motion is restrained and must clarify progression, position, comparison, or state change.
12. Factual accuracy, source boundaries, image provenance, and performance budgets remain repository requirements.

## Visual identity

### Foundation

- Illustrated manga companion
- Wide editorial spreads
- Dense but readable information
- Large visual anchors instead of empty decorative space

### Chimera Ant personality

- Biological classification
- Expedition records
- Military planning
- Royal imagery
- Gungi notation
- State and consequence ledgers

### Palette

- Void: `#11140f`
- Charcoal: `#1b1e18`
- Bone: `#e9e6da`
- Paper: `#dcded2`
- Ink: `#1d211a`
- Olive: `#6f7a45`
- Moss: `#4d5b39`
- Rose: `#7b3538`
- Royal: `#6c6680`
- Mist: `#9ea693`

The page alternates bone editorial fields and charcoal cinematic fields. Red is reserved for irreversible danger, death, or cost. Royal violet appears sparingly around Meruem and the Royal Guards.

## Seven episode phases

| Phase | Episodes | Title | Primary visual system |
|---:|---:|---|---|
| I | 76–85 | NGL Expedition and Kite’s Fall | Expedition route and threat escalation |
| II | 86–95 | Defeat, Birth, and Return | Three-front parallel development |
| III | 96–102 | Rogue Ants and East Gorteau | Colony dispersal and political map |
| IV | 103–110 | Komugi and Invasion Preparation | Plan-versus-reality palace blueprint |
| V | 111–121 | Palace Invasion | Parallel-lane invasion clock |
| VI | 122–131 | The Two Endgames | Mirrored endgame presentation |
| VII | 132–136 | Poison, Memory, and Homecoming | Quiet aftermath and survivor destinations |

## Final section order

1. Overview
2. Before the arc
3. Premise
4. Episode phases
5. Detailed timeline
6. Characters
7. Factions
8. Locations
9. Nen and abilities
10. Conflicts and fights
11. Objects and symbols
12. Ending and aftermath
13. Manga versus anime
14. Records
15. Sources

## Batch plan

### Batch 1 — Design contract and visual direction

- Establish desktop canvas, palette, density, image, card, and motion rules.
- Establish seven episode phases and distinct composition assignments.
- Establish final section order without standalone Themes or Transformations.
- Add a persistent progress ledger.

### Batch 2 — Dedicated page shell

- Create a Chimera Ant-specific route component instead of forcing the generic ArcPage layout.
- Create the wide desktop canvas and left reading rail.
- Replace the crowded horizontal local navigation.
- Add section and phase progress behavior.

### Batch 3 — Hero and overview

- Recompose the hero around artwork, title, premise, metadata, and arc controls.
- Add the Arc at a Glance overview.
- Add the proportional seven-phase episode rail.

### Batch 4 — Shared phase architecture

- Create reusable phase headers, image spreads, episode-group records, opening/turning/closing states, and captions.
- Keep each phase capable of supplying a different composition.

### Batch 5 — Phases I and II

- Build the NGL expedition route and threat escalation.
- Build the three-front training, colony, and Hunter Association development view.

### Batch 6 — Phases III and IV

- Build colony dispersal and East Gorteau transition.
- Build Komugi/Gungi development and the palace plan-versus-reality blueprint.

### Batch 7 — Phase V palace invasion

- Build the parallel-lane invasion clock.
- Track Gon/Pitou, Killua, Knuckle/Shoot, Morel/Pouf, Youpi, Ikalgo/Welfin, Netero/Meruem, and Komugi.

### Batch 8 — Phases VI and VII

- Build the mirrored endgames.
- Build the Rose, memory recovery, final Gungi, survivor destinations, and Election transition.

### Batch 9 — Supporting archive systems

- Characters
- Factions
- Locations
- Nen and abilities
- Conflicts and fights
- Objects and symbols

### Batch 10 — Ending and reference systems

- Ending and aftermath
- Manga versus anime
- Records
- Sources

### Batch 11 — Final desktop verification

- Visual consistency
- Content verification
- Image provenance
- Accessibility that remains relevant to desktop
- Performance budgets
- Browser behavior
- Build and release checks
- Final bug fixes

## Completion standard

A batch is complete only when its implementation is committed on the retransform branch, its changed behavior is verified as far as the available tooling allows, and the progress ledger records the evidence, remaining risks, and next batch.
