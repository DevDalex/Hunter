# ADR 0002: Canonical route registry

## Status
Accepted

## Context
Archive routes, release lists, aliases, navigation hubs, sitemap rules, and retired workspaces previously duplicated route knowledge across multiple modules.

## Decision
`src/data/succession/archiveRoutes.js` and the route registry derived from it are the canonical route source. Release routes, aliases, canonical destinations, search inclusion, and navigation must be derived from that source. Retired-route explanations remain presentation metadata rather than independent routes.

## Consequences
- New routes are defined once.
- Redirect and release audits can compare derived outputs.
- Legacy compatibility remains available without becoming a second product model.
- Route consumers must not maintain private release lists.
