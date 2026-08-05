# ADR 0005: Worker-first routing

## Status
Accepted

## Context
The application combines a React SPA, static assets, a protected chapter administrator, and Worker API routes. SPA fallback must never swallow administrator or API requests.

## Decision
Cloudflare routes requests through the Worker first. The Worker handles `/api/admin/chapter/*` and `/admin/chapters`, delegates static assets to the `ASSETS` binding, and uses the SPA fallback only for remaining browser routes. Automatic platform HTML and not-found rewriting remain disabled.

## Consequences
- Protected routes cannot accidentally receive `index.html`.
- Browser deep links continue to work.
- Release audits must verify request ordering and the Worker/static output shape.
