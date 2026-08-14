# Chapter 339–417 website visibility audit

This audit exists to catch a different class of regression from the normal data/schema suites: information that is still present in source files but is no longer reachable or visible in the released website because of a stale route, import, publication boundary, selector, progressive-render limit, retired workspace, reader/media assumption, or canonicalization mismatch.

## Scope

- Chapter 339 is the pre-Succession handoff and must remain reachable through the read-only Series chapter bridge.
- Chapters 340–417 are the maintained Succession Contest research range.
- Chapter 417 is the current published/research ceiling.
- Local chapter-page media is independently authorized through Chapter 416; Chapter 417 must remain a real reader-catalogue record with an explicit no-pages state rather than receiving invented media.

## Structural reachability gate

`npm run audit:succession-visibility`

The structural gate verifies:

- active Archive and Dossier entrypoints are Through417;
- publication/research boundaries resolve to Chapter 417;
- Chapter 339 resolves to a released website route;
- Chapter 340–417 maintained research is contiguous;
- every maintained event survives in the canonical event graph by stable ID, exact title, or explicit `maintainedBeatIds` lineage;
- prelude/context records remain attached to the active maintained chapter record without being misclassified as canonical events;
- every published canonical entity resolves by ID and owns an active released workspace;
- character, organization, Guardian Spirit Beast, and ability-knowledge history remains reachable through the corresponding timeline/dossier selector;
- Story Intelligence phase/lane/thread/causal records remain chapter-bounded and reachable;
- Nen systems, glossary entries, and media records remain inside active publication boundaries;
- missing/broken source links and missing reader bridges fail the gate.

Foundation records that render on their owning website workspace but lack a chapter backlink in the Research evidence graph are reported separately as `EVIDENCE-UNLINKED`. They are provenance/linkage debt, not presentation disappearance.

## Rendered website gate

`scripts/succession-339-417-visibility-qa.mjs`

The browser gate boots the production website and verifies the real released surfaces, including:

- the restored Chapter 339 bridge and Chapter 340 handoff;
- all 78 Succession chapter dossiers, 340–417;
- all published characters, organizations, locations, assignments, relationships, Guardian Spirit Beasts, abilities, Nen systems, glossary terms, and sources;
- the complete canonical Events workspace through Chapter 417;
- progressive Assignment loading through the complete record set;
- semantic Relationship list completeness;
- Research media deep links after the standalone Media route was retired;
- Chapter 417 Reader visibility with an explicit no-local-pages state.

The rendered gate uses exact canonical counts and owning-workspace contracts rather than minimum thresholds. This prevents a page from passing merely because “enough” records survived while a specific record silently disappeared.

## Optional deeper search probes

- `npm run audit:succession-visibility:fast-search`
- `npm run audit:succession-visibility:deep`

These are intentionally not part of the normal fast `check` path because brute-force global-search reconstruction across thousands of records is expensive. They remain available for targeted x-ray passes when Search routing itself is under investigation.

## Regression found by the first audit

The first pass found a genuine dead-route regression for Chapter 339: its series research and old search destination still existed, but the consolidated route manifest no longer exposed any Series route. The fix restores a narrow read-only `/series/chapters?chapter=...` bridge for Chapters 1–339 instead of incorrectly moving Chapter 339 into the Succession canonical graph.

The same pass also found Chapter 387–388 maintained-event IDs whose content had survived canonically under renamed event IDs. Explicit `maintainedBeatIds` lineage now proves those source beats survive canonicalization without relying on fuzzy title matching.
