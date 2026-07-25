# Succession Visual Redesign — Batch 4 Spatial Closure

## Hour 50 — Locations, Black Whale reference, and Batch 4 closure

This task visually unifies the canonical location graph and the Black Whale reference atlas while preserving their distinct responsibilities:

- canonical location dossiers remain the source of truth for hierarchy, access, chapter snapshots, occupants, assignments, events, abilities, movement history, and evidence;
- the visual Black Whale atlas remains a navigational and sourced reference layer whose markers declare exact, aggregate, approximate, or legacy bridge precision.

### Canonical location command

- Replace the legacy dark-card presentation with semantic royal-archive command surfaces.
- Add a cinematic spatial-graph hero and high-contrast location metrics.
- Redesign type, tier, access, and chapter-snapshot controls with paper intelligence surfaces.
- Elevate location cards with hierarchy paths, access state, occupancy history, event totals, and spatial identity.
- Redesign location dossiers with chapter snapshot, contained locations, occupants, assignments, events, abilities, movement history, breadcrumbs, and evidence.
- Retain mobile stacking, 44px controls, keyboard focus, touch behavior, and reduced-motion support.

### Black Whale reference command

- Reframe the ship atlas as a premium spatial command interface.
- Preserve zoom controls, hotspot navigation, numbered location index, sourced imagery, tier selectors, movement routes, passenger manifest, room index, and canonical location actions.
- Strengthen the selected-location inspector and canonical bridge context.
- Keep exact, aggregate, approximate, and legacy precision labels visible in the existing inspector records.
- Redesign the sourced visual tour, fourteen-prince room plan, movement routes, manifest table, room cards, and access notices.
- Preserve an ordinary index for every hotspot so the map is never the only navigation method.
- Keep the map horizontally navigable on small screens and collapse multi-column reference layouts without hiding canonical actions.

### Batch 4 closure

The closure workflow runs all Batch 4 chapter, Story, Event, Nen, Guardian Spirit Beast, and spatial audits; inherited Batch 1–3 contracts; CSS ownership; readability; accessibility; the production build; and responsive rendering for Locations and Black Whale.

```bash
node scripts/audit-succession-batch-4-spatial.mjs
node scripts/audit-succession-batch-4-chapters.mjs
node scripts/audit-succession-batch-4-story.mjs
node scripts/audit-succession-batch-4-events.mjs
node scripts/audit-succession-batch-4-nen-release.mjs
node scripts/audit-succession-batch-4-guardian-beasts.mjs
npm run audit:css
npm run audit:readability
npm run audit:accessibility
npm run prepare:eta-assets
npx vite build
```
