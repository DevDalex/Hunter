# ADR 0004: Media storage and derivative pipeline

## Status
Accepted incrementally

## Context
Chapter images and archive illustrations can make Git history, deployment transfers, and browser payloads unnecessarily large. The application also needs predictable thumbnails, modern formats, dimensions, and cache keys.

## Decision
The repository stores canonical media manifests and authorized source references. Generated thumbnails and AVIF/WebP derivatives are build artifacts. Large chapter-image binaries should migrate to Cloudflare R2 or an equivalent authorized object store without changing reader URLs abruptly. Manifests must include source hash, dimensions, derivative paths, chapter boundary, and authorization state.

## Migration sequence
1. Generate and validate a manifest for existing media.
2. Produce thumbnails and modern derivatives where tooling is available.
3. Upload immutable objects under content hashes.
4. Keep compatibility URLs during migration.
5. Remove duplicated binaries from ordinary Git history only after hosted verification.

## Consequences
- Reader and archive pages can request appropriately sized assets.
- Cache invalidation becomes content-addressed.
- The source repository remains an index and application rather than the permanent binary warehouse.
- Migration remains reversible until hosted verification succeeds.
