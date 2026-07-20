# Aggregate build preflight

Status: active build contract
Date: 2026-07-20
Owner: `scripts/run-build-preflight.mjs`

## Problem solved

The previous `npm run build` command chained independent audits with `&&`. A deployment stopped at the first failure, so several stale contracts appeared across several Cloudflare attempts instead of one report.

The aggregate runner executes all 14 independent pre-build audits, records every failure, and exits unsuccessfully only after the full list has run.

## Included audits

1. `audit:content`
2. `audit:implementation`
3. `audit:story`
4. `audit:reference`
5. `audit:characters`
6. `audit:final`
7. `audit:governance`
8. `audit:schema`
9. `audit:css`
10. `audit:readability`
11. `audit:layout`
12. `audit:accessibility`
13. `audit:media`
14. `audit:polish`

## Ordering rules

- Story → Reference → Characters → Final preserves the Batch 7–10 lock sequence.
- Final → Governance → Schema preserves the Batch 11 integration point.
- CSS ownership runs before the CSS-aware readability, layout, accessibility, and polish audits.
- Media verification runs before polish.

## Later build stages

These stages remain outside the aggregate runner because they require generated artifacts or a completed production build:

1. `package:release`
2. `audit:release`
3. hosting cleanup
4. Vite production build
5. `audit:performance`
6. hosting preparation

A failure in one of those stages is still a single ordered dependency failure, not an independent pre-build audit that can safely continue.

## Failure behavior

Each audit keeps its original stdout/stderr. At the end, the runner lists every failing script. Do not weaken factual or structural assertions merely to make the summary green; correct stale data, contracts, paths, or code.

## Verification boundary

Aggregate preflight passing proves only that its 14 repository-side audits passed for that source state. It does not prove release-package generation, Vite output, performance, browser QA, GitHub Actions, or Cloudflare deployment succeeded.
