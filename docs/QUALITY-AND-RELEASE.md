# Quality and release architecture

This document defines the repository's authoritative release process, the purpose of each quality layer, and the evidence required before production promotion.

## Release principle

A green Vite build is necessary but not sufficient. A release is acceptable only when the authoritative `Release Quality` workflow passes.

The release hierarchy is:

1. Static and canonical contracts.
2. Production artifact construction.
3. Required Chromium behavior.
4. Full-release cross-browser and arc-specific suites.
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
- Global Chromium browser verification.

## Full-release checks

Pushes to `main` and full manual releases additionally run:

- Succession responsive release QA.
- Succession Firefox and WebKit regression QA.
- Chimera Ant structural and four-width desktop QA.
- Greed Island release QA.

## Required human review

Automation cannot approve art direction. Major visual changes require a human review of generated screenshots or a preview deployment.

Review at least:

- the minimum supported viewport;
- one standard desktop viewport;
- tablet and mobile for responsive routes;
- empty, long-copy, missing-image, and loading states;
- image focal points and caption placement;
- light and dark surface contrast;
- keyboard focus and reduced-motion behavior.

A visual change is not approved solely because overflow, contrast, and runtime tests pass.

## Media contract

New managed media should use a manifest ID rather than a raw component URL.

A media record should provide:

- a stable namespaced ID;
- source provenance;
- meaningful alt text;
- subjects;
- focal-point metadata;
- a safe-text region;
- purpose-specific variants;
- expected width, height, format, and quality.

Run:

```bash
npm run media:check
```

The command generates variants with Sharp and verifies source availability, output dimensions, and output formats.

Generated media belongs under `public/media/generated/`. Do not commit temporary QA screenshots, reports, traces, or downloaded workflow ZIP archives.

## Canonical data contract

Canonical archive records must use stable IDs and pass Zod validation before packaging.

At minimum, validation must reject:

- duplicate IDs;
- reversed or discontinuous episode/chapter ranges;
- malformed URLs;
- missing claim evidence;
- references to absent entities;
- invalid spoiler boundaries;
- unsupported review or confidence values.

Schema changes require a schema-version update and, when existing stored data is affected, a migration script.

## Testing responsibility

Use the narrowest reliable test layer:

- **Vitest:** pure logic, schemas, selectors, sorting, filtering, chronology, aliases, and transformations.
- **React Testing Library:** production component behavior, keyboard interaction, disclosures, filters, empty states, and error states.
- **Playwright Test:** routing, browser runtime, media decoding, real interactions, viewport containment, traces, videos, and screenshots.
- **Custom audits:** archive-specific invariants that are durable and not tied to exact source formatting.

Do not add a source-string assertion when behavior can be tested directly. Static audits may verify required exports, prohibited dependencies, or durable configuration contracts, but should not depend on exact JSX expressions.

Every fixed user-visible bug should receive a regression test whenever the behavior is reproducible automatically.

## Performance budgets

Performance checks are route-aware. At a minimum, release QA must watch:

- transferred JavaScript and CSS;
- image transfer above the fold;
- DOM-node count;
- request count;
- layout shift;
- route initialization time;
- browser long tasks;
- horizontal overflow.

A budget increase must be intentional and documented in the pull request.

## Security

The `Security Quality` workflow runs:

- a high-severity runtime dependency audit;
- CodeQL analysis for JavaScript and TypeScript.

Repository settings should additionally enable:

- secret scanning;
- dependency alerts;
- required reviews;
- branch protection;
- required `Release Quality` and `Security Quality` checks.

These settings must be enabled in GitHub because they cannot be enforced by repository files alone.

## Production diagnostics

Cloudflare source-map upload and observability are enabled. Production errors should include enough context to identify:

- release commit;
- route;
- Worker or browser surface;
- failure class;
- affected media or entity ID when relevant.

Workflow evidence is retained temporarily. Diagnostic ZIP files are GitHub Actions artifacts, not production assets.

## Rollback

For a broken production release:

1. Stop further promotion.
2. Identify the last known green `Release Quality` commit.
3. Revert or redeploy that commit.
4. Confirm the deployed route through a production smoke test.
5. Add a regression test before reintroducing the failed change.

The rollback target is under ten minutes once deployment credentials and the last known green commit are available.

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

A change is done when:

- canonical data and media are valid;
- affected logic and components have tests;
- the production build succeeds;
- affected browser routes pass;
- no required workflow is red;
- visual changes have been reviewed by a person;
- documentation is updated when the contract or workflow changed;
- temporary files and obsolete compatibility code are removed.
