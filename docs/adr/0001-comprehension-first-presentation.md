# ADR-0001 — Comprehension-first presentation over one canonical graph

**Status:** Accepted  
**Date:** 2026-08-22

## Context

The Succession Contest archive contains enough people, institutions, Nen mechanics, evidence, spatial state, and chapter deltas that a flat encyclopedia presentation makes correct data difficult to understand. Creating separate simplified data stores would make comprehension easier at the cost of canon drift.

## Decision

Presentation uses three depths over the **same canonical graph**:

1. **Briefing** — current state, material change, evidence count, unresolved state.
2. **Intelligence** — comparisons, causality, information asymmetry, operations, spatial/Nen systems.
3. **Research** — canonical records, provenance, source boundaries, translation variants, contradictions, notes and exports.

The 60-second, Standard, Deep Analysis, and Evidence reading modes are materially different presentations, not separate lore databases. Derived visual systems must use maintained selectors or explicit chapter-bounded records. Unknowns remain unknown; the UI does not fill visual gaps by inventing hierarchy, causation, power scores, territorial control, knowledge, or motive.

## Consequences

- New comprehension surfaces should derive from canonical selectors instead of duplicating facts.
- Top-N presentations disclose visible/total counts or provide a complete drill-down.
- Canon / Inference / Theory / Editorial / Translation / Changed / Unresolved use the shared semantic registry.
- A visual redesign can change hierarchy and interaction without changing canonical records.

## Rejected alternatives

- A second simplified Succession database: rejected because it creates synchronization and provenance drift.
- A single giant dossier view: rejected because it preserves data depth but not comprehension.
- Automated speculative filling of missing relationships or mechanics: rejected because presentation completeness is not evidence.
