# Archive engineering and media foundation

This batch introduces the first infrastructure layer for the Hunter × Hunter archive without forcing a repository-wide rewrite.

## Added capabilities

- **Biome** formats and lints the new foundation surface.
- **TypeScript `checkJs`** performs strict, no-emit checking on schemas, media tooling, tests, and test configuration.
- **Vitest** covers pure archive invariants.
- **React Testing Library** covers user-visible component interaction.
- **Playwright Test** supplies reusable desktop projects, traces, screenshots, videos, retries, and HTML reports.
- **Zod** defines runtime contracts for ids, ranges, sources, media, claims, and character records.
- **Sharp** generates deterministic local media variants from focal-point metadata.
- **Knip** reports dead files, exports, and dependencies without blocking releases yet.
- **Cloudflare observability and source-map uploads** improve production diagnosis.

## Commands

```bash
npm run foundation:check
npm run quality:foundation
npm run typecheck
npm run test:unit
npm run test:e2e
npm run media:build
npm run media:verify
npm run report:deadcode
```

`npm run check` now includes `foundation:check`. The runtime build also generates and verifies declared media variants before Vite runs.

## Gradual coverage policy

The existing application contains a large amount of legacy JavaScript and custom audit code. Biome and TypeScript initially enforce only:

- `src/schemas/**`
- `src/media/**`
- the new media scripts
- unit/component/e2e tests
- Playwright and Vitest configuration
- package and Worker configuration where applicable

Coverage should expand directory by directory after existing findings are resolved. Do not disable strictness simply to increase the file count.

## Media-manifest contract

Local originals belong under:

```text
public/media/originals/
```

Generated delivery variants belong under:

```text
public/media/generated/
```

Each local media record should declare:

- a namespaced id;
- accessible alt text;
- source provenance;
- one or more subjects;
- a normalized focal point;
- a safe text region;
- explicit output dimensions, format, and quality.

Generated media is ignored by Git because it is reproducible from the manifest and originals.

## Quality-gate policy

The initial blocking foundation gate includes:

1. Biome checks on the scoped surface.
2. strict JavaScript type checking.
3. Vitest and component tests.
4. media-manifest validation.

Playwright Test remains a dedicated browser command because the repository already has broader browser workflows. Knip is informational until the initial dead-code inventory is reviewed and allowlists are justified.

## Next migration targets

1. Route-manifest and navigation records.
2. Shared media components and image metadata.
3. Canonical character and arc records.
4. Search selectors and spoiler-boundary logic.
5. Worker request/response bindings.
