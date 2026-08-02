# Black Whale 3D progress route

The public project dashboard lives at `/succession/black-whale-3d`.

## Current programme state

- Phase 7.0, Reconstruction Charter: complete.
- Phase 7.1, Reference Extraction: complete.
- Phase 7.2, Spatial Graph: next.
- Production geometry: 0%.

## Public files

- `public/succession/black-whale-3d/index.html`
- `public/succession/black-whale-3d/styles.css`
- `public/succession/black-whale-3d/data-loader.js`
- `public/succession/black-whale-3d/app.js`
- `public/phase7/black-whale-3d-charter.json`
- `public/phase7/black-whale-3d-analysis.json`
- `public/phase7/black-whale-3d-references-a.json`
- `public/phase7/black-whale-3d-references-b.json`

The split data loader combines the public records at runtime. The reference ledger contains 38 source shots, including 37 exact file-level Hunterpedia sources and one chapter-bounded record awaiting an exact file URL.

## Route ownership

`server/index.js` maps both `/succession/black-whale-3d` and `/succession/black-whale-3d/` to the static dashboard before the ordinary SPA fallback.

`public/assets/bw3d-route-bridge.js` exposes the dashboard from Succession pages and the Black Whale atlas without replacing the completed Phase 6 application router.

## Truth rules

- Geometry cannot become evidence.
- Unknown space remains unknown.
- Every future spatial record receives one of five certainty classes.
- The burial chamber tier remains quarantined because the approved gallery metadata conflicts.
- Room 3101 is canonical; Room 3125 remains a corrected legacy alias only.
- No panel direction is silently converted into bow, stern, port, or starboard.

## Validation

Run:

```bash
node scripts/audit-black-whale-3d-progress.mjs
```

The dedicated GitHub workflow runs the same audit whenever the route, evidence records, navigation bridge, Worker mapping, or audit changes.
