# Architecture Decision Records

ADRs capture durable engineering/product decisions that should survive individual implementation PRs. They document **why** a constraint exists, what alternatives were rejected, and what future changes must explicitly revisit.

## Status vocabulary

- **Accepted** — current architecture.
- **Superseded** — replaced by a later ADR; retain for history.
- **Proposed** — not yet an active contract.

## Succession archive decisions

1. [ADR-0001 — Comprehension-first presentation over one canonical graph](./0001-comprehension-first-presentation.md)
2. [ADR-0002 — Local-only user state and privacy-safe analytics](./0002-local-only-user-state.md)
3. [ADR-0003 — Runtime schema-family coverage for every canonical entity type](./0003-runtime-schema-family-coverage.md)
4. [ADR-0004 — Performance budgets, lazy data islands, and local media derivatives](./0004-performance-media-boundaries.md)

A change that violates one of these contracts should update or supersede the relevant ADR in the same PR.
