# Quality and release architecture

This document defines the repository's authoritative release process and the evidence required before production promotion.

## Product platform contract

The archive is a desktop-only product. The minimum supported viewport width is **1366px**. Required browser evidence is collected at **1366×900** and **1600×1000**, with wider arc-specific checks where useful. Widths below 1366px are outside the product, design, testing, accessibility, performance, and release contract.

Legacy narrow-layout CSS may remain temporarily when removing it would risk desktop regressions. It is compatibility code only: it must not be cited by audits, documentation, pull-request acceptance criteria, or required workflows.

## Release principle

A green Vite build is necessary but not sufficient. A release is acceptable only when the authoritative `Release Quality` workflow passes.

The release hierarchy is:

1. Static and canonical contracts.
2. Production artifact construction.
3. Required Chromium behavior at supported desktop widths.
4. Full-release desktop cross-browser and arc-specific suites.
5. Final release gate.

Specialist workflows may produce deeper diagnostics, but they must not replace or contradict the authoritative release result.

## Pull-request checks

Every pull request to `main` must pass:

- Biome linting.
- Strict gradual TypeScript checking.
- Vitest and React Testing Library tests.
- Zod-backed archive and media validation.
- Sharp media generation and output verification.
- Aggregate content, schema, accessibility, layout, media, and governance audits.
- Complete Cloudflare production artifact construction.
- Worker-routing verification.
- Focused Playwright projects.
- Global Chromium browser verification at supported desktop widths.

## Full-release checks

Pushes to `main` and full manual releases additionally run:

- Succession desktop release QA.
- Succession Firefox and WebKit desktop regression QA.
- Chimera Ant structural and four-width desktop QA.
- Greed Island desktop release QA.

## Required human review

Automation cannot approve art direction. Major visual changes require human review of generated screenshots or a preview deployment.

Review at least:

- 1366×900, the minimum supported desktop viewport;
- 1600×1000, the standard desktop viewport;
- empty, long-copy, missing-image, and loading states;
- image focal points and caption placement;
- light and dark surface contrast;
- keyboard focus and reduced-motion behavior.

A visual change is not approved solely because overflow, contrast, and runtime tests pass.

## Media contract

New managed media should use a manifest ID rather than a raw component URL. A media record should provide a stable namespaced ID, source provenance, meaningful alt text, subjects, focal-point metadata, a safe-text region, purpose-specific variants, and expected output dimensions and formats.

Run `npm run media:check` to generate variants with Sharp and verify source availability, output dimensions, and formats. Generated media belongs under `public/media/generated/`. Temporary QA screenshots, reports, traces, and downloaded workflow archives are not production assets.

## Canonical data contract

Canonical archive records must use stable IDs and pass Zod validation before packaging. Validation must reject duplicate IDs, invalid ranges, malformed URLs, missing claim evidence, references to absent entities, invalid spoiler boundaries, and unsupported review or confidence values.

Schema changes require a schema-version update and, when stored data is affected, a migration script.

## Testing responsibility

Use the narrowest reliable test layer:

- **Vitest:** pure logic, schemas, selectors, sorting, filtering, chronology, aliases, and transformations.
- **React Testing Library:** production component behavior, keyboard interaction, disclosures, filters, empty states, and error states.
- **Playwright Test:** routing, browser runtime, media decoding, real interactions, desktop containment, traces, videos, and screenshots.
- **Custom audits:** archive-specific invariants that are durable and not tied to exact source formatting.

Do not add source-string assertions when behavior can be tested directly. Every reproducible user-visible bug should receive a regression test.

## Performance budgets

Performance checks are route-aware and run at supported desktop widths. They watch transferred JavaScript and CSS, above-fold image transfer, DOM-node count, request count, layout shift, route initialization time, browser long tasks, and horizontal overflow. Budget increases must be intentional and documented.

## Security

The `Security Quality` workflow runs a high-severity runtime dependency audit and CodeQL analysis for JavaScript and TypeScript. Repository settings should additionally enable secret scanning, dependency alerts, required reviews, branch protection, and required quality checks.

## Production diagnostics

Cloudflare source-map upload and observability are enabled. Production errors should identify the release commit, route, Worker or browser surface, failure class, and affected media or entity ID when relevant.

## Rollback

For a broken production release:

1. Stop further promotion.
2. Identify the last known green `Release Quality` commit.
3. Revert or redeploy that commit.
4. Confirm the deployed route through a production smoke test.
5. Add a regression test before reintroducing the failed change.

## Local commands

```bash
npm ci
npm run foundation:check
npm run preflight:build
npm run build
npm run test:e2e
npm run qa:browser:verify
npm run report:deadcode
```

Use `npm run dev` for local development; it validates and generates managed media before starting Vite.

## Definition of done

A change is done when canonical data and media are valid, affected logic and components have tests, the production build succeeds, affected desktop routes pass, no required workflow is red, visual changes have been reviewed by a person, documentation reflects the current contract, and obsolete compatibility code is removed when safe.
