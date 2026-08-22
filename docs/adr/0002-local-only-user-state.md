# ADR-0002 — Local-only user state and privacy-safe analytics

**Status:** Accepted  
**Date:** 2026-08-22

## Context

Reader progress, bookmarks, investigations, onboarding, and lightweight usage diagnostics improve continuity, but they are not canon and should not create an account-level surveillance system.

## Decision

Personal state is browser-local and separated by purpose:

- Reader progress/bookmarks own chapter/page reading state.
- Research Memory owns visits, archive bookmarks, saved searches, compare tray and investigations.
- Onboarding owns only mission completion/skip state.
- Local analytics owns only canonical route IDs, aggregate view counts, and coarse first/last timestamps.

Local analytics must not store or transmit search text, entity IDs, notes, citations, Reader pages, evidence selections, IP addresses, page content, or other behavioral payload. It has pause/resume and reset controls. Resetting one store does not erase unrelated stores.

## Consequences

- No analytics network transport is required for this architecture.
- UI must label personal notes/collections separately from canonical archive data.
- New local stores require bounded normalization and an explicit privacy contract.
- If remote sync or server analytics is ever introduced, it requires a superseding ADR and a new consent/privacy design.

## Rejected alternatives

- One monolithic localStorage object: rejected because resets and migrations would couple unrelated user state.
- Sending search/entity events to a remote analytics service: rejected because current product goals can be met with local aggregate diagnostics.
- Treating investigation notes as canonical annotations: rejected because user research material must remain clearly non-canonical.
