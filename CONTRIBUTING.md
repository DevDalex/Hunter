# Contributing to the Hunter × Hunter Archive

## Before editing

1. Install the locked dependency graph with `npm ci`.
2. Read `docs/QUALITY-AND-RELEASE.md`.
3. Identify the canonical data, component, media, and QA contracts affected by the change.
4. Do not add a new tool when an existing layer already covers the requirement.

## Development workflow

```bash
npm run dev
```

The development command validates and generates managed media before starting Vite.

Before opening a pull request, run:

```bash
npm run foundation:check
npm run preflight:build
npm run build
```

For user-visible route or interaction changes, also run the relevant browser suite:

```bash
npm run test:e2e
npm run qa:browser:verify
```

## Data changes

- Use stable namespaced IDs.
- Validate canonical records with the repository Zod schemas.
- Keep chapter and episode ranges ordered and continuous where the domain requires continuity.
- Attach source provenance and evidence to factual claims.
- Represent uncertainty explicitly rather than converting it into certainty.
- Preserve spoiler boundaries.
- Add or update tests for every new invariant.

## Media changes

- Prefer a manifest ID and named variant over a raw URL.
- Store focal points and safe-text regions in the manifest, not scattered CSS.
- Generate purpose-specific variants with Sharp.
- Confirm alt text describes the meaningful content.
- Run `npm run media:check`.
- Do not commit workflow artifacts, QA screenshots, traces, videos, or diagnostic ZIP archives.

## Component changes

- Use semantic HTML and accessible names.
- Preserve keyboard operation and visible focus.
- Test loading, empty, error, unavailable-media, and long-copy states.
- Avoid absolute positioning for content whose dimensions can change.
- Do not solve contrast problems by weakening the QA threshold.
- Add a React Testing Library test for reusable interaction behavior.
- Add a Playwright regression test for a browser-only or layout failure.

## Audit rules

Custom audits should verify durable archive contracts. Avoid exact source-string matching when a unit, component, or browser test can verify the behavior.

Acceptable static checks include:

- required exports;
- prohibited runtime dependencies;
- required schema or route registrations;
- stable artifact boundaries;
- documented source-domain restrictions.

Brittle checks include:

- exact JSX expressions;
- exact formatting;
- exact class ordering;
- implementation details that do not change behavior.

## Pull-request expectations

A pull request should explain:

- the problem;
- the implementation;
- the resulting fix;
- affected routes and records;
- tests added or changed;
- visual evidence reviewed;
- performance or bundle impact;
- remaining limitations.

The authoritative `Release Quality` workflow must pass. `Security Quality` must not report a new high-severity runtime vulnerability or CodeQL finding.

## Definition of done

A contribution is complete only when the code, data, media, tests, documentation, and release evidence agree with one another. A green build alone is not completion.
