# Archive governance foundation

Status: Batch 11 locked
Date: 2026-07-20
Scope: bibliography registry, stable entity IDs, JSON schema contracts, evidence states, and manual review queue

## Purpose

Batch 11 is a foundation batch. It does not add a major reader-facing page. It gives future content batches a consistent destination for sources, IDs, certainty, schemas, and unfinished work before the archive expands again.

The goal is to prevent scattered records, repeated links, inconsistent IDs, overclaimed certainty, and undocumented TODOs.

## What Batch 11 adds

1. a bibliography registry in `src/data/bibliography.js`;
2. stable entity ID conventions in `src/data/entityIds.js`;
3. evidence states in `src/data/evidenceStates.js`;
4. a manual review queue in `src/data/reviewQueue.js`;
5. schema contracts in `src/schema/`;
6. an archive governance audit in `scripts/audit-archive-governance.mjs`;
7. ordered execution inside `scripts/run-build-preflight.mjs` after Final and before the general schema audit.

## No live UI rewrite

No live UI rewrite is part of this batch.

Batch 11 intentionally avoids replacing Story pages, Character pages, Chimera Ant, Greed Island, Nen, Atlas, Organizations, or Conflicts. The governance layer supports those systems without destabilizing them.

## Governance rule

Future archive records should prefer:

- a stable entity ID;
- one or more bibliography IDs;
- an evidence state;
- a schema-backed shape;
- a review-queue item when incomplete.

This does not claim every legacy record has already been converted. It establishes the destination model for future work.

## What this protects

- future chapter records;
- future timeline records;
- future cross-links;
- future search index records;
- future graph nodes;
- future Nen ability records;
- future organization hierarchy records;
- future mystery records;
- future Succession expansion records.

## Aggregate verification

The governance audit validates:

- bibliography IDs, approved URLs, collections, and usage notes;
- entity namespaces, canonical IDs, and ID syntax;
- evidence-state groups and required states;
- review-queue lanes, priorities, entity links, and evidence states;
- five schema contracts;
- Final → Governance → Schema ordering inside aggregate preflight;
- the existence of all Batch 11 documentation.

The aggregate preflight continues through the remaining independent audits after a failure and reports one complete repair list. Packaging and built-output audits remain later because they require generated artifacts.

## Preserved boundaries

- no character deletion;
- no mobile-specific redesign;
- no change to the Hunterpedia/Fandom-approved source policy;
- no new graph/search/chapter UI yet;
- no source-tier or media-legality system from removed roadmap items;
- no claim that external CI passed without a completed successful run.

## Next batch

The next roadmap item after Batch 11 remains Batch 12: Design system / archive UI library.
