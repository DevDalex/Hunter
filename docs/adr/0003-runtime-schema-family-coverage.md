# ADR-0003 — Runtime schema-family coverage for every canonical entity type

**Status:** Accepted  
**Date:** 2026-08-22

## Context

The canonical graph grew from the original character/event/location model into sixteen registered entity types, including knowledge records, protocols, objects, documents and evidence items. Per-domain validators are useful, but a new entity type could otherwise be registered and enter runtime data without being assigned to a validator family.

## Decision

Every value in `ENTITY_TYPE_VALUES` must be assigned to an explicit runtime schema family. The current families are:

- **base** — character, organization, ability, guardian-beast, location, location-history, event, assignment, chapter, relationship, source.
- **intelligence** — knowledge-record, protocol, object, document, evidence-item.

`schemasFinal.js` combines the domain validators and the schema-family coverage check. Validation fails when a registered type is uncovered, a covered type is unregistered, or runtime data contains an uncovered/unregistered type.

## Consequences

- Adding a canonical entity type requires both a registry update and a validator-family decision.
- Runtime validation publishes the schema coverage version/type count for audits and generated documentation.
- TypeScript migration may happen incrementally, but compile-time types do not replace runtime validation at data-ingestion boundaries.

## Rejected alternatives

- Rely only on a switch default: rejected because unknown types can silently bypass type-specific validation.
- Require an immediate full TypeScript migration: rejected because it creates a large unrelated rewrite while runtime data contracts can be strengthened incrementally.
