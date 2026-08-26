# Black Whale Full-Page Review Protocol

## Purpose

Phase 7.1C replaces gallery-led extraction with a page-by-page review of Chapters 342–415. Every page is inspected, but only evidence about the Black Whale itself is retained.

The Black Whale is treated as:

- a vessel and exterior form;
- a five-tier spatial system;
- an operating environment;
- a collection of rooms, routes, thresholds and facilities;
- a chapter-dependent security and emergency system.

Story material merely occurring aboard the ship is excluded.

## Primary source

The repository already contains ordered full-page local chapter media used by the public reader:

- reader route: `/story/succession-contest/chapters`
- media catalogue: `src/data/successionChapterMedia.generated.js`
- availability registry: `src/data/successionChapterAvailability.generated.js`
- page path: `public/media/succession-contest/chapters/{chapter}/{page}.jpg`
- confirmed media coverage: Chapters 338–416
- review range: Chapters 342–415

Hunterpedia remains useful for terminology, chapter cross-checks, provenance, corrections and contradictions. It does not establish complete visual coverage.

## Copyright and storage boundary

The existing local reader pages are the source. Do not duplicate them into new research folders or commit page crops as separate public evidence assets.

The research corpus stores only:

- repository source path and optional source hash;
- chapter, page and panel locators;
- normalized panel coordinates;
- concise derived observations;
- location and route IDs;
- certainty and contradiction status;
- permitted modeling uses;
- exclusions and review notes.

## Chapter workflow

For each chapter:

1. Resolve the ordered page records from the generated media catalogue.
2. Confirm page order, dimensions and page count.
3. Inspect every page at readable resolution.
4. Mark every panel containing possible Black Whale evidence.
5. Reinspect marked panels at full resolution.
6. Extract atomic visual and textual claims.
7. Link claims to stable locations, routes and systems.
8. Record uncertainty and contradictions.
9. Record excluded story material at category level.
10. Complete a second verification pass.
11. Publish a chapter update.

## Inclusion test

Retain a panel or statement when it establishes at least one of the following:

- exterior form or hull structure;
- tier shape, stacking or boundary;
- room, corridor, passage, door, lift, stair or checkpoint;
- relative position or adjacency;
- movement route or access rule;
- security, military or emergency state;
- signage, numbering or wayfinding;
- operational systems such as lifeboats, sewage, airships or bulkheads;
- scale cue, crowd density, furniture scale, ceiling height or material language;
- concealed room, teleport route or inaccessible space;
- a temporal change to the vessel's use or control.

## Exclusion test

Exclude material that only concerns combat, character psychology, unrelated Nen mechanics, political discussion, succession strategy, Mafia or Phantom Troupe plot, flashbacks, or dialogue aboard the ship without spatial or operational evidence.

A chapter may contain both excluded story content and valid ship evidence. Filtering occurs panel by panel, not by chapter title.

## Panel locator

Each retained panel receives:

- chapter;
- repository page path;
- page number;
- panel number in reading order;
- normalized bounding box when useful;
- orientation;
- short visual description;
- dialogue relevance;
- evidence categories;
- linked location IDs;
- certainty;
- modeling permissions;
- limitations;
- contradiction references.

## Public storage layout

```text
public/phase7/
  black-whale-3d-full-page-review-342-415.json
  full-page-review/
    chapter-342.json
    chapter-343.json
    ...
```

## Chapter update format

Every chapter update reports:

- page count;
- pages inspected;
- Black Whale panels retained;
- evidence atoms added;
- locations or routes added or amended;
- contradictions found;
- story material excluded;
- exact public storage paths;
- unresolved questions;
- verification-pass status.

## Completion gates

Phase 7.1C remains open until every page from Chapters 342–415 has two completed review passes, every retained panel has a source locator, every evidence atom has an approved modeling use, every contradiction is resolved or quarantined, a coverage audit finds no unreviewed page, and the user has reviewed the chapter-by-chapter findings.

Phase 7.2 remains blocked throughout Phase 7.1C.
