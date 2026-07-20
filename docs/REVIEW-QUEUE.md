# Review queue

Status: Batch 11 seed
Owner: archive governance
Runtime file: `src/data/reviewQueue.js`

## Purpose

The review queue prevents unfinished ideas from becoming invisible TODOs scattered across chat history, source files, and docs.

A queue item is not a promise that the work is complete. It is a visible maintenance record for future batches.

## Lanes

Batch 11 seeds these lanes:

- Source/citation cleanup
- Entity identity cleanup
- Content depth
- Cross-links
- QA and performance

## Item fields

Each queue item contains:

- `id`
- `lane`
- `title`
- `entityId`
- `status`
- `priority`
- `reason`
- `nextAction`
- `dependsOn`
- `evidenceState`

## Statuses

- `queued` means known work, not started.
- `blocked` means another system must exist first.
- `active-next` means a good candidate for the next batch.
- `watch` means keep visible but do not expand yet.

## Current high-priority work

High-priority work includes:

- migrating repeated source links toward bibliography IDs
- preserving source-index characters while expanding dossiers gradually
- seeding the complete chapter ledger
- preparing cross-link/orphan detection
- adding workflow proof later so latest commits no longer show no CI run

## Relationship to future batches

The review queue points toward:

- Batch 12 design system extraction
- Batch 13 chapter encyclopedia
- Batch 15 cross-link engine
- Batch 18 Nen ability records
- Batch 26 CI/release proof
- Batch 27 Succession mega-expansion
