# ADR 0003: Evidence and confidence model

## Status
Accepted

## Context
The archive combines canonical facts, direct inference, theories, editorial interpretation, and translation notes. Presenting all of these identically would blur canon and analysis.

## Decision
Every structured claim may declare a claim kind, certainty, chapter boundary, sources, contradictions, translation notes, and review date. Canonical claims require provenance. The user interface must expose the distinction through consistent labels and evidence drawers.

## Consequences
- Search, dossiers, questions, and exports can distinguish fact from interpretation.
- Claims can be revised or retracted without deleting their history.
- Records missing claim metadata remain valid legacy content but are reported as coverage gaps.
