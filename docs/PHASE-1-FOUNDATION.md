# Phase 1: Foundation stabilization

## Canonical route ownership

`src/data/routeRegistry.js` is the product-facing route contract. It derives canonical routes from `src/data/succession/archiveRoutes.js` and owns:

- release inclusion;
- search inclusion;
- sitemap inclusion;
- canonical destinations;
- legacy redirects.

`src/data/routeManifest.js` remains a compatibility surface for older consumers, but its release routes and aliases are derived from the canonical registry.

## Chapter coverage vocabulary

The archive uses three distinct user-facing boundaries:

1. **Latest official publication**: verified publication metadata.
2. **Latest readable chapter**: authorized integrated-reader media.
3. **Latest fully indexed chapter**: maintained scene-level research.

The boundaries and per-domain coverage live in `src/data/archiveCoverage.js`.

## Chapter safety

`src/lib/chapterBoundary.js` provides the shared visibility contract for records with chapter metadata. New chapter-bounded workspaces should filter their records through this utility or an equivalent domain adapter.

`npm run audit:spoilers` verifies the baseline future-record leak behavior. Domain-specific spoiler fixtures should be added as each workspace adopts the shared boundary contract.

## Stable audit entry point

Run:

```bash
npm run audit:foundation
```

This checks:

- canonical routes and legacy redirects;
- archive and domain coverage boundaries;
- chapter-boundary regression behavior.

Historical audit commands remain available for compatibility, but new permanent checks should be grouped under stable responsibility-based commands rather than batch or redesign names.

## Generated statistics

Edit `src/data/siteStats.source.json`, then run:

```bash
node scripts/generate-site-stats.mjs
```

The generated consumer module is `src/data/siteStats.generated.js`. Do not edit it directly.
