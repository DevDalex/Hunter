# Archive governance foundation

Status: Batch 11 locked
Date: 2026-07-20
Scope: bibliography registry, stable entity IDs, JSON schema contracts, evidence states, and manual review queue

## Purpose

Batch 11 is a foundation batch. It does not add a major reader-facing page. It adds the governance layer that future content batches need before the archive grows again.

The goal is to prevent future work from becoming scattered records, repeated links, inconsistent IDs, uncertain claims, and undocumented TODOs.

## What Batch 11 adds

Batch 11 adds:

1. a bibliography registry in `src/data/bibliography.js`
2. stable entity ID conventions in `src/data/entityIds.js`
3. evidence states in `src/data/evidenceStates.js`
4. a manual review queue in `src/data/reviewQueue.js`
5. schema contracts in `src/schema/`
6. an archive governance audit in `scripts/audit-archive-governance.mjs`
7. build-chain integration through `audit:governance`

## No live UI rewrite

No live UI rewrite is part of this batch.

Batch 11 intentionally avoids touching Story pages, Character pages, Chimera Ant, Greed Island, Nen, Atlas, Organizations, or Conflicts. Those systems already exist and should not be destabilized by a governance foundation batch.

## What this protects

This batch protects:

- future chapter records
- future timeline records
- future cross-links
- future search index records
- future graph nodes
- future Nen ability records
- future organization hierarchy records
- future mystery records
- future Succession mega-expansion records

## Governance rule

Future archive records should prefer:

- a stable entity ID
- one or more bibliography IDs
- an evidence state
- a schema-backed shape
- a review queue item if incomplete

This does not mean every old record has already been converted. It means the next phases now have a clean destination model.

## Preserved boundaries

Batch 11 preserves these boundaries:

- no character deletion
- no mobile redesign
- no change to the Hunterpedia/Fandom-approved source policy
- no new graph/search/chapter UI yet
- no claim that external CI passed unless GitHub returns a workflow run

## Next batch

The next roadmap item after Batch 11 is Batch 12: Design system / archive UI library.
