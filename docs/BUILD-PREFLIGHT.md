# Aggregate build preflight

Status: active Cloudflare build contract  
Date: 2026-07-23  
Owner: `scripts/run-build-preflight.mjs`

## Purpose

The aggregate runner executes all 15 independent pre-build audits, records every failure, and exits unsuccessfully only after the complete list has run. One Cloudflare build therefore reports the full repository repair list instead of revealing one stale contract per attempt.

## Included audits

1. `audit:content`
2. `audit:implementation`
3. `audit:story`
4. `audit:reference`
5. `audit:characters`
6. `audit:final`
7. `audit:governance`
8. `audit:design-system`
9. `audit:schema`
10. `audit:css`
11. `audit:readability`
12. `audit:layout`
13. `audit:accessibility`
14. `audit:media`
15. `audit:polish`

## Ordering rules

- Story → Reference → Characters → Final preserves the established content lock sequence.
- Final → Governance → Design System → Schema preserves the governance and reusable-UI integration point.
- CSS ownership runs before CSS-aware readability, layout, accessibility, and polish checks.
- Media verification runs before polish.

## Build composition

`npm run build` is intentionally composed from two independently useful stages:

1. `npm run check`
   - generates `public/build-info.json`;
   - runs the complete 15-audit aggregate preflight.
2. `npm run build:runtime`
   - clears stale hosting output;
   - builds Vite into `dist/client/`;
   - runs `audit:performance`;
   - prepares the Worker in `dist/server/`;
   - runs the Cloudflare release audit.

The retired portable ZIP and standalone build stages are intentionally absent.

## Browser CI boundary

The Cloudflare full-stack workflow is the authoritative complete repository gate. Browser CI uses `npm run qa:browser:ci`, which regenerates build identity, runs `build:runtime`, and then performs rendered search, visual, accessibility, interaction, reader, architecture, and browser-performance verification.

Browser CI does not rerun aggregate preflight because the Cloudflare job already runs those same 15 independent pre-build audits for the identical revision. Local `npm run qa:browser` still begins with the complete `npm run build` gate.

Both workflows cancel superseded runs on the same branch. A newer commit therefore stops obsolete CI work instead of allowing multiple stale browser/build matrices to consume runner time.

## Dependency boundary

Direct runtime and build dependencies are exact-versioned in `package.json` and synchronized through `package-lock.json`. Playwright, Axe, Vite, the React plugin, and Wrangler are repository devDependencies; CI must not install alternate transient versions.

## Failure behavior

Each audit keeps its original output. At the end, the runner lists every failing script. Correct stale data, paths, documentation, or code; do not weaken a factual or structural assertion merely to make the summary green.

## Verification boundary

Aggregate preflight proves only that its 15 repository-side audits passed for that source state. A full `npm run build` additionally proves the Vite, performance, Worker preparation, and Cloudflare artifact checks passed. Browser QA proves rendered behavior for that built revision. None proves that Cloudflare deployed successfully; hosted success requires a terminal Cloudflare result and direct live-route verification.
