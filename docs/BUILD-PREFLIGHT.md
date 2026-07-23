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

## Later Cloudflare build stages

These ordered stages require generated output and therefore run after the aggregate preflight:

1. hosting cleanup;
2. Vite production build into `dist/client/`;
3. `audit:performance`;
4. Worker preparation into `dist/server/`;
5. Cloudflare release audit.

The retired portable ZIP and standalone build stages are intentionally absent.

## Failure behavior

Each audit keeps its original output. At the end, the runner lists every failing script. Correct stale data, paths, documentation, or code; do not weaken a factual or structural assertion merely to make the summary green.

## Verification boundary

Aggregate preflight proves only that its 15 repository-side audits passed for that source state. A full `npm run build` additionally proves the Vite, performance, Worker preparation, and Cloudflare artifact checks passed. Neither proves that Cloudflare deployed successfully; hosted success requires a terminal Cloudflare result and direct live-route verification.
