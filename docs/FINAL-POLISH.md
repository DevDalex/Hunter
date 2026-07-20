# Final polish batch

Status: Batch 10 locked
Date: 2026-07-20
Scope: desktop-first stabilization, visual identity lock, audit-chain lock, and release-readiness notes
Mobile status: deferred

## Purpose

Batch 10 is not a new content feature. It closes the redesign sequence by making the previous batches harder to regress:

1. Chimera Ant remains the flagship Story stress test.
2. Nen, World, Organizations, and Conflicts remain the reference backbone.
3. Characters remain a full directory with additive dossier profiles, not a reduced cast list.
4. The Black Archive visual direction stays visible across the shell.
5. Mobile-specific redesign remains deferred until explicitly reopened.

## Final visual correction

The older codebase still uses compatibility custom properties named `--forest`, `--forest-dark`, and `--forest-soft` in many established selectors. Removing every old variable name would create a large risk surface late in the batch cycle.

Batch 10 therefore keeps those variable names but remaps their final cascade values:

- `--forest` resolves to crimson.
- `--forest-dark` resolves to deep crimson.
- `--forest-soft` resolves to pale crimson paper.

This preserves old component wiring while preventing the global identity from feeling green.

Green is still allowed only when it has a subject-specific reason, such as terrain, NGL material, local aura diagrams, or a page-specific visual metaphor. It is not the site brand.

## Locked design direction

The final global identity remains:

- black cinematic shell
- warm ivory reading surfaces
- crimson active states
- antique gold structural metadata
- steel blue for neutral/system information
- selective purple for royal, mystery, and Succession material

The site should read as a serious illustrated story archive rather than a fan wiki, streaming platform, corporate dashboard, or generic anime landing page.

## What Batch 10 owns

Batch 10 owns:

- final cascade overrides in `src/styles/final-polish.css`
- loading that final stylesheet after the Nen stylesheet in `src/main.jsx`
- a new `audit:final` script
- build-chain integration for the final audit
- this documentation file

## What Batch 10 does not own

Batch 10 does not:

- add a new major content section
- split Chimera Ant into nested pages
- delete character records
- turn source-index characters into full profiles automatically
- redesign mobile navigation
- replace the Hunterpedia/Fandom source policy
- run or claim external CI results when GitHub does not provide a workflow run

## Required previous batch locks

Batch 10 assumes these earlier batch artifacts remain present:

- `docs/CHIMERA-ANT-PROTOTYPE.md`
- `docs/REFERENCE-BACKBONE.md`
- `docs/CHARACTER-PROFILES.md`
- `scripts/audit-story-architecture.mjs`
- `scripts/audit-reference-backbone.mjs`
- `scripts/audit-character-profiles.mjs`

## Verification

The final audit checks that:

1. `src/main.jsx` loads `src/styles/final-polish.css` after `src/nen.css`.
2. final Black Archive tokens exist.
3. old green compatibility variables resolve to crimson values.
4. old global green hex values are not reintroduced inside the final polish layer.
5. header, intro, Greed Island, Chimera Ant, Nen, and character profile selectors have final lock coverage.
6. `package.json` contains `audit:story`, `audit:reference`, `audit:characters`, `audit:final`, `audit:polish`, and `qa:browser`.
7. the normal build chain runs Story, Reference, Characters, and Final locks before the general schema/CSS/readability/layout/accessibility/media/polish/release sequence.
8. Hunterpedia/Fandom source policy and mobile-deferred status remain visible.

## Current final batch order

The redesign sequence now stands as:

- Batch 7: Chimera Ant prototype page
- Batch 8: Reference Backbone — Nen / World / Organizations / Conflicts
- Batch 9: Characters / Profile Dossiers
- Batch 10: Final polish / QA lock / visual identity stabilization

## Remaining honest boundary

This batch adds repository-side safeguards. It does not prove that GitHub Actions or browser QA passed unless a workflow run exists and reports success.
