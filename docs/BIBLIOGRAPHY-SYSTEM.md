# Bibliography system

Status: Batch 11 seed
Owner: archive governance
Runtime file: `src/data/bibliography.js`

## Purpose

The bibliography registry gives future records a stable source layer. Instead of repeating raw links in every component and data file forever, future records can point to bibliography IDs.

This is a governance layer, not a reader-facing source page yet.

## Record shape

Each record contains:

- `id`
- `title`
- `href`
- `category`
- `recordTypes`
- `usedBy`
- `status`
- `notes`

IDs use the format:

```txt
src-arc-chimera-ant
src-char-gon
src-system-nen
```

## Current use

The registry currently seeds sources for:

- major Story arcs
- flagship character dossiers
- key organizations
- Nen
- world/atlas records
- key Chimera Ant locations and conflicts
- future chapter ledger source seeding

## Future use

Future batches should migrate records toward `sourceIds` arrays instead of raw source duplication.

Examples:

```js
sourceIds: ['src-arc-chimera-ant', 'src-char-meruem']
```

## Boundary

The bibliography registry does not change the source policy. It only centralizes source references for future use.
