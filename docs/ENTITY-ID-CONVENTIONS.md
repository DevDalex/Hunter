# Entity ID conventions

Status: Batch 11 seed
Owner: data model
Runtime file: `src/data/entityIds.js`

## Purpose

Entity IDs provide durable identifiers for future cross-links, graph nodes, chapter records, timelines, and search indexes.

The archive should not rely only on display names. Names can vary by spelling, alias, translation, or display surface. IDs should stay stable.

## Pattern

```txt
namespace.slug-name
```

Examples:

```txt
arc.chimera-ant
char.gon-freecss
nen.jajanken
faction.hunter-association
conflict.netero-vs-meruem
location.east-gorteau
object.poor-mans-rose
chapter.318
status.gon-comatose
source.src-arc-chimera-ant
operation.palace-invasion
```

## Namespaces

Batch 11 seeds these namespaces:

- `arc`
- `char`
- `nen`
- `faction`
- `conflict`
- `location`
- `object`
- `chapter`
- `status`
- `source`
- `mystery`
- `operation`

## Rules

1. IDs are lowercase.
2. IDs use hyphens, not spaces or underscores.
3. The namespace and slug are separated by a period.
4. Display names may change; IDs should not change casually.
5. Duplicate concepts should be merged before graph/search expansion.
6. Old records do not need to convert instantly, but new major systems should use IDs.

## Future batches

The chapter ledger, timeline engine, cross-link engine, search index, graph explorer, Nen ability encyclopedia, and mystery tracker should use these IDs.
