# Story foundation layer

Status: **Batch 3 active foundation**  
Mobile status: **deferred**

This document records the first runtime Story foundation after the architecture lock and clean route migration.

## What Batch 3 owns

Batch 3 adds the shared Story scaffolding that later arc pages will inherit:

1. a real `/story` hub foundation backed by the nine-destination Story taxonomy;
2. a desktop-first chronological Story rail;
3. shared breadcrumbs for Home → Story → destination;
4. a context rail for reading boundary, factual spine, visual direction, mobile scope, and standard sections;
5. an arc foundation header for route-level arc pages with previous/next navigation and manga/anime/depth/accent facts;
6. a Zoldyck Family workspace bridge that keeps the route inside the Story foundation while its full page remains scheduled for the Early Arcs batch;
7. a Story foundation stylesheet with the approved Black Archive palette: dark shell, warm paper, crimson, gold, steel blue, and no global green branding.

## What Batch 3 does not own

Batch 3 does not redesign Yorknew, migrate arc components into page folders, split each arc into dedicated data modules, or complete the Zoldyck Family content page. It provides the route-level scaffolding that those later batches will use.

## Runtime files

- `src/components/StoryFoundation.jsx`
- `src/components/StoryFoundation.css`
- `src/components/SeriesWorkspace.jsx`
- `src/data/routeManifest.js`
- `scripts/audit-story-architecture.mjs`

## Acceptance rule

`npm run audit:story` now checks that the Story workspace renders through the shared foundation, that the Zoldyck route no longer bypasses the Story workspace in `App.jsx`, and that the foundation consumes the canonical architecture taxonomy and standard section policy.
