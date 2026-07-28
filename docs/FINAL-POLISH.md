# Final polish batch

Status: Batch 10 locked
Date: 2026-07-20
Scope: desktop-first stabilization, visual identity lock, regression contracts, and release-readiness notes
unsupported narrow-width status: deferred

## Purpose

Batch 10 is not a new content feature. It closes the redesign sequence by making the previous batches harder to regress:

1. Chimera Ant remains the flagship Story stress test.
2. Nen, World, Organizations, and Conflicts remain the reference backbone.
3. Characters remain a full directory with additive dossier profiles, not a reduced cast list.
4. The Black Archive visual direction stays visible across the shell.
5. unsupported narrow-width-specific redesign remains deferred until explicitly reopened.

## Final visual correction

The older codebase still uses compatibility custom properties named `--forest`, `--forest-dark`, and `--forest-soft` in established selectors. Removing every old variable name would create unnecessary risk.

`src/styles/final-polish.css` therefore remaps those names to crimson-compatible values. Green remains acceptable only where the subject itself calls for it, such as terrain, NGL material, or a local visual metaphor. It is not the global brand.

## Locked design direction

The final global identity remains:

- black cinematic shell;
- warm ivory reading surfaces;
- crimson active states;
- antique gold structural metadata;
- steel blue neutral/system information;
- selective purple for royal, mystery, and Succession material.

The site should read as a serious illustrated story archive rather than a fan-wiki clone, streaming platform, corporate dashboard, or generic anime landing page.

## CSS ownership

Runtime CSS must load in this exact order:

1. `src/styles.css`;
2. `src/nen.css`;
3. `src/styles/final-polish.css`.

The CSS ownership audit validates the exact three-entry runtime order. The final-polish audit separately verifies that the final layer remains last and contains the locked Black Archive tokens and selectors.

## What Batch 10 owns

- final cascade overrides in `src/styles/final-polish.css`;
- loading that final stylesheet after Nen CSS in `src/main.jsx`;
- `scripts/audit-final-polish.mjs`;
- Batch 7–10 lock ordering inside `scripts/run-build-preflight.mjs`;
- this documentation file.

## What Batch 10 does not own

Batch 10 does not:

- add a new major content section;
- split Chimera Ant into nested pages;
- delete character records;
- turn source-index characters into full profiles automatically;
- reopen unsupported narrow-width-specific redesign;
- replace the Hunterpedia/Fandom source policy;
- prove external CI or browser QA without a completed successful run.

## Required previous batch locks

- `docs/CHIMERA-ANT-PROTOTYPE.md`;
- `docs/REFERENCE-BACKBONE.md`;
- `docs/CHARACTER-PROFILES.md`;
- `scripts/audit-story-architecture.mjs`;
- `scripts/audit-reference-backbone.mjs`;
- `scripts/audit-character-profiles.mjs`.

## Verification

The final audit checks that:

1. final polish loads after Nen CSS;
2. Black Archive tokens exist;
3. compatibility forest variables resolve to crimson values;
4. old global green values do not return in the final layer;
5. shared shell, Story prototypes, Nen, and character profiles receive final coverage;
6. Story, Reference, Characters, and Final audits remain present;
7. `scripts/run-build-preflight.mjs` runs those locks in that order;
8. Hunterpedia/Fandom sourcing and deferred unsupported narrow-width scope remain explicit.

## Current redesign sequence

- Batch 7: Chimera Ant prototype page;
- Batch 8: Reference Backbone — Nen / World / Organizations / Conflicts;
- Batch 9: Characters / Profile Dossiers;
- Batch 10: Final polish / QA lock / visual identity stabilization;
- Batch 11: archive governance foundation.

## Remaining honest boundary

Repository-side safeguards are not proof that GitHub Actions, browser QA, or Cloudflare deployment passed. A success claim requires the corresponding run to reach terminal success for the exact commit.
