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

## Primary-source requirement

A chapter may be marked reviewed only when its lawful primary pages are available as a PDF, CBZ archive, or ordered image folder.

Hunterpedia remains useful for:

- terminology;
- chapter cross-checks;
- exact uploaded image provenance;
- correction and contradiction discovery.

Hunterpedia does not establish complete visual coverage.

## Copyright boundary

Full manga pages and scans must not be committed to the public repository.

Primary files remain in:

`private-evidence-vault/chapters/<chapter>/`

This directory is excluded from Git.

The public repository stores only:

- chapter, page and panel locators;
- normalized panel coordinates;
- source hashes;
- perceptual hashes for duplicate detection;
- concise derived observations;
- location and route IDs;
- certainty and contradiction status;
- permitted modeling uses;
- exclusions and review notes.

## Chapter workflow

For each chapter:

1. Register the source file and SHA-256 hash.
2. Confirm page order and page count.
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

Exclude material that only concerns:

- combat;
- character psychology;
- unrelated Nen mechanics;
- political discussion;
- succession strategy;
- Mafia or Phantom Troupe plot;
- flashbacks;
- dialogue taking place aboard the ship without spatial or operational evidence.

A chapter may contain both excluded story content and valid ship evidence. Filtering occurs panel by panel, not by chapter title.

## Panel locator

Each retained panel receives:

- chapter;
- printed or digital page number;
- panel number in reading order;
- normalized bounding box;
- orientation;
- panel hash;
- short visual description;
- dialogue relevance;
- evidence categories;
- linked location IDs;
- certainty;
- modeling permissions;
- limitations;
- contradiction references.

Example:

```json
{
  "chapter": 395,
  "page": 14,
  "panel": 2,
  "bbox": {"x": 0.08, "y": 0.12, "w": 0.84, "h": 0.46},
  "subject": "Room 3101 route discussion",
  "evidenceTypes": ["route", "adjacency"],
  "locationIds": ["bw3d.node.room-3101", "bw3d.node.heilly-hidden-base"],
  "certainty": "c1-confirmed"
}
```

## Storage layout

Private, never committed:

```text
private-evidence-vault/
  chapters/
    342/
      source.pdf
      source.sha256
      contact-sheet.jpg
      crops/
```

Public metadata:

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

- source filename and hash;
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

Phase 7.1C remains open until:

- all available chapters in the requested range have primary pages;
- every page has two completed review passes;
- every retained panel has a locator and source hash;
- every evidence atom has an approved modeling use;
- every contradiction is resolved or quarantined;
- a coverage audit finds no unreviewed page;
- the user has reviewed the chapter-by-chapter findings.

Phase 7.2 remains blocked throughout Phase 7.1C.
