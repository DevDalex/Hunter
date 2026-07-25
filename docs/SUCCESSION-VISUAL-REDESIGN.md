# Succession Visual Redesign

## Objective

Redesign the presentation of the Succession section without changing its canonical data, research conclusions, chapter records, routing, search logic, source ownership, import workflows, or archive structure.

**Scope classification: presentation-only.**

The visual direction is a restrained royal intelligence archive: formal, political, secretive, dangerous, readable, and deliberately organized. It should not become a decorative fantasy dashboard, a neon game interface, or a collection of unrelated cards.

## Schedule and tracking

The complete 64-hour implementation schedule is tracked in GitHub issue **#49**.

The work is divided into five batches:

1. **Visual foundation and design system — Hours 1–14**
2. **Shell, navigation, and landing experience — Hours 15–24**
3. **People, royal family, and institutions — Hours 25–36**
4. **Story, chapters, Nen, events, and reference content — Hours 37–50**
5. **Advanced visualizations and final product closure — Hours 51–64**

## Batch 1 contract

Batch 1 establishes shared presentation rules. It does not complete page-specific redesigns.

### Owned files

- `src/data/succession/visualDesignSystem.js`
- `src/components/succession/SuccessionVisualFoundation.css`
- `src/components/succession/SuccessionVisualFoundationPreview.jsx`
- `src/components/succession/SuccessionVisualFoundationPreview.css`
- `scripts/audit-succession-visual-foundation.mjs`
- `scripts/report-succession-visual-inventory.mjs`
- `docs/SUCCESSION-VISUAL-REDESIGN.md`

### Commands

```bash
npm run audit:succession-visual-foundation
npm run report:succession-visual-inventory
```

The foundation audit is also part of `npm run audit:succession-runtime`, ensuring the contract participates in the existing runtime gate.

### Foundation requirements

- Every new rule is scoped under `.succession-archive`.
- The system uses semantic names instead of arbitrary color names tied to one page.
- Text never drops below the archive's 11px readability floor.
- Focus remains visible against every surface.
- Reduced-motion preferences are respected.
- Status and evidence meaning never depends on color alone.
- Mobile layouts reorder information by importance instead of merely shrinking desktop layouts.
- Existing compatibility CSS remains temporarily available while later batches migrate specialized workspaces.

## Visual identity

The visual identity draws from:

- royal records;
- classified intelligence files;
- military reports;
- court documents;
- political briefings;
- restricted databases;
- investigative archives;
- ship schematics.

Atmosphere should come from typography, spacing, composition, hierarchy, restrained color, and subtle surface treatment. Heavy background images, constant animation, excessive glow, ornamental clutter, and unreadable low-contrast text are out of scope.

## Semantic token groups

| Group | Purpose |
|---|---|
| Canvas | Base and raised page backgrounds |
| Surface | Cards, panels, overlays, insets, and selected records |
| Text | Primary, muted, subtle, and paper-surface ink |
| Accent | Royal, intelligence, danger, and system emphasis |
| Border | Subtle, default, strong, and focus boundaries |
| State | Evidence, publication, status, allegiance, and objective states |
| Typography | Display, body, monospaced, and hierarchy roles |
| Spacing | Shared page, section, and component rhythm |
| Radius | Controlled shape hierarchy |
| Motion | Restrained interaction timing and reduced-motion behavior |

## Semantic states

The foundation explicitly supports:

- confirmed;
- inferred;
- uncertain;
- disputed;
- pending;
- active;
- deceased;
- missing;
- captured;
- compromised;
- allied;
- hostile;
- neutral;
- completed;
- failed.

Later batches may add domain-specific labels, but they must map back to these semantic meanings rather than introduce unrelated visual systems.

## Shared component contracts

The first foundation pass standardizes:

- the scoped archive shell;
- grouped navigation;
- page headers;
- action buttons;
- tabs;
- form controls;
- entity visuals;
- entity cards;
- evidence badges;
- status pills;
- loading states;
- empty states;
- error states.

Specialized workspaces remain structurally unchanged until their assigned batch.

## Hidden preview

`SuccessionVisualFoundationPreview.jsx` demonstrates the token groups, principles, state vocabulary, component contracts, and loading/empty/error states. It is intentionally not registered in the public route map during Batch 1.

A later Batch 1 checkpoint may mount it in a local-only or screenshot-test harness. Public navigation must not expose the preview.

## Visual debt inventory

`npm run report:succession-visual-inventory` scans the Succession component directory and reports:

- CSS and JSX ownership;
- `!important` usage;
- raw color ownership;
- gradients and shadows;
- legacy tiny-text declarations;
- inline style use;
- CSS import ownership;
- migration guidance.

The report is diagnostic. High counts identify compatibility debt; they do not justify deleting a stylesheet or adding stronger overrides without workspace-level verification.

## Compatibility strategy

The current Succession implementation contains several corrective style layers. Batch 1 does not delete them blindly.

The new foundation is loaded after the existing compatibility styles. Later batches should:

1. migrate one workspace family at a time;
2. verify desktop and mobile behavior;
3. remove only the superseded compatibility declarations;
4. run the full Succession and browser QA gates;
5. record any remaining non-critical debt in issue #49.

## Hourly safety check

At the end of every implementation hour:

1. confirm affected pages render;
2. verify links and controls;
3. inspect desktop and mobile behavior;
4. check for style leakage outside Succession;
5. record completed work and remaining debt.

At the end of each batch, run the production build, Succession runtime audits, interaction QA, accessibility QA, responsive visual review, and relevant performance checks before proceeding.
