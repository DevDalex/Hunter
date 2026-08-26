# ADR-0004 — Performance budgets, lazy data islands, and local media derivatives

**Status:** Accepted  
**Date:** 2026-08-22

## Context

The Succession graph grows with every chapter and can easily produce oversized JavaScript chunks. The archive also contains character/room imagery whose provenance must remain stable while runtime delivery should not depend on remote wiki availability.

## Decision

- Preserve the existing preferred JavaScript chunk budget rather than raising it to hide growth.
- Split dense chapter/domain leaves into named lazy data islands when they push the central graph or a chapter island beyond the preferred budget.
- Do not force broad `ThroughNNN` overlay chains into the same named chunk as direct chapter leaves when that coalesces unrelated historical payload.
- Canonical priority portraits and Black Whale room media remain locally stabilized WebP originals with source provenance and dimension verification.
- Responsive derivatives may be generated from those verified local originals. They must remain generated artifacts tied to the original manifest/provenance, not become a second canonical media registry.
- PWA/offline support remains outside the current performance contract and requires a separate ADR before introduction.

## Consequences

- Chunk warnings are engineering signals; the normal response is boundary analysis/splitting, not a higher ceiling.
- Media derivative generation must be reproducible and verifiable without modifying canonical source metadata.
- Remote source URLs remain provenance, not runtime delivery dependencies for stabilized media.
- Build/audit tooling should fail on missing generated manifests, invalid local files, or provenance drift.

## Rejected alternatives

- Raise the chunk limit whenever content grows: rejected because it makes startup/performance regressions invisible.
- Keep runtime images remote: rejected for stability and reproducibility.
- Replace originals with only small derivatives: rejected because larger displays and future derivative regeneration need the verified local source asset.
